#![forbid(unsafe_code)]

//! assay-gui — Tauri 2 shell that wraps the `assay` CLI.
//!
//! The frontend invokes `start_analysis` with a [`StartArgs`]
//! payload; we spawn `assay analyze --format ndjson <flags>` as a
//! child process, stream its stdout line by line, and forward each
//! parsed event to the WebView via the `assay://event` Tauri
//! event channel. The WebView listens and updates its per-proposal
//! progress rows in real time.
//!
//! No assay-as-library coupling: we shell out by design so the GUI
//! can ride alongside any version of the assay binary on PATH
//! without recompiling. The GUI declares a minimum NDJSON schema
//! version it understands; field changes within a 1.x assay are
//! additive per the assay 1.0 stability promise.
//!
//! ## stderr handling
//!
//! assay writes diagnostic warnings to stderr (e.g. cache miss
//! breadcrumbs, ecosystem-skip notices). These are NOT runtime
//! errors. The previous shape of this file forwarded every stderr
//! line as a `SpawnFailed` event, which flipped the UI run-status
//! pill to red on perfectly successful runs. The current shape
//! BUFFERS stderr in memory and only surfaces it (as an
//! `AssayStderrBanner` event) when the child exits non-zero AND
//! no NDJSON `run_started` event was ever observed — i.e. assay
//! died before it managed to emit any structured progress. That's
//! the case where the user is otherwise looking at an empty
//! progress view and has zero diagnostic signal.

use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use std::sync::{Arc, Mutex};
use std::thread;

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, State};
use tauri_plugin_dialog::DialogExt;

/// Arguments the frontend hands us when the user clicks "Start
/// analysis". Mirrors the subset of assay CLI flags the UI
/// surfaces.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StartArgs {
    /// Absolute path to the repository root.
    pub repo: String,
    /// Ecosystem filter; one of `all`, `cargo`, `github-actions`,
    /// `npm`. Maps directly to `--ecosystem`.
    pub ecosystem: String,
    /// One of `dry-run`, `validate`, `apply-local`, `apply-pr`.
    /// Maps to the corresponding `--validate` / `--apply-*` flag.
    pub mode: String,
    /// Optional override for worker threads. None → assay's
    /// default (min(4, available_parallelism())).
    #[serde(default)]
    pub threads: Option<usize>,
    /// `--fail-fast` toggle.
    #[serde(default)]
    pub fail_fast: bool,
    /// `--member-gate` toggle.
    #[serde(default)]
    pub member_gate: bool,
    /// Validator executor: `docker` (assay default; sandboxed
    /// build-script isolation) or `host` (faster, no sandbox).
    /// Maps to `--executor docker|host`. When `mode == "dry-run"`
    /// the validator never runs and this field is silently
    /// ignored by assay.
    #[serde(default = "default_executor")]
    pub executor: String,
    /// Suppress SHA-pin hardening proposals for tag-pinned
    /// GitHub Actions references. Maps to `--no-sha-pin-proposals`.
    #[serde(default)]
    pub no_sha_pin_proposals: bool,
    /// Keep only proposals classified as breaking-risk. Used by the
    /// GUI's "Validate breaking upgrades" second-phase workflow.
    #[serde(default)]
    pub only_breaking: bool,
}

fn default_executor() -> String {
    "docker".into()
}

/// Lightweight diagnostic event we emit to the frontend BEFORE the
/// NDJSON stream proper begins (so the UI can render a "spawning
/// assay…" indicator) and on any spawn-time failure.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "snake_case", tag = "type")]
enum GuiEvent {
    Spawning {
        command: String,
    },
    SpawnFailed {
        reason: String,
    },
    StreamEnded {
        exit_code: Option<i32>,
    },
    Raw {
        line: String,
    },
    /// Aggregated stderr surfaced after the child exits without
    /// having emitted any NDJSON. The frontend renders this in a
    /// top-of-page banner instead of leaving the user with a blank
    /// progress view.
    StderrBanner {
        text: String,
        exit_code: Option<i32>,
    },
}

/// Tracks whether assay emitted any NDJSON during the run.
///
/// If a child exits non-zero without ever emitting NDJSON (e.g.
/// `--repo` doesn't exist, clap couldn't parse the args, the
/// binary itself segfaulted), the UI would otherwise see only
/// `stream_ended` with an exit code and no rows. The frontend
/// shows a stderr banner in that case; this flag is what lets us
/// distinguish "run failed with no output" from "run succeeded
/// quietly with some harmless stderr breadcrumbs".
#[derive(Default)]
struct RunDiagnostics {
    saw_ndjson: bool,
    stderr_buf: String,
}

/// State held inside the Tauri app. Right now only used to gate
/// "one run at a time" — clicking Start while a run is in progress
/// is rejected by the backend.
///
/// The `running` flag is wrapped in `Arc<Mutex<...>>` so the
/// child-process waiter thread can hold its own owning handle to
/// the lock without needing a raw-pointer cast back into Tauri's
/// state storage. Cloning an `Arc<Mutex<bool>>` is a single atomic
/// refcount bump per spawn.
#[derive(Default, Clone)]
pub struct AppState {
    /// `true` while a child `assay` process is active.
    running: Arc<Mutex<bool>>,
}

/// Open a folder picker and return the chosen path (or `None` if
/// the user cancelled). Invoked from the frontend so the GUI does
/// NOT depend on the dialog plugin's JS bridge being globally
/// exposed — sidesteps the `withGlobalTauri` plugin-namespace gap.
#[tauri::command]
async fn pick_repo(app: AppHandle) -> Result<Option<String>, String> {
    use std::sync::mpsc;
    let (tx, rx) = mpsc::channel::<Option<String>>();
    app.dialog().file().pick_folder(move |result| {
        let path = result.map(|p| p.to_string());
        let _ = tx.send(path);
    });
    rx.recv().map_err(|e| e.to_string())
}

#[tauri::command]
async fn start_analysis(
    args: StartArgs,
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    {
        let mut running = state.running.lock().map_err(|e| e.to_string())?;
        if *running {
            return Err("an analysis is already running; wait for it to finish".into());
        }
        *running = true;
    }

    let cmd_args = build_cli_args(&args);
    let command_label = format!("assay {}", cmd_args.join(" "));
    app.emit(
        "assay://event",
        GuiEvent::Spawning {
            command: command_label,
        },
    )
    .ok();

    let child = Command::new("assay")
        .args(&cmd_args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn();
    let mut child = match child {
        Ok(c) => c,
        Err(err) => {
            let reason = format!(
                "could not spawn `assay`: {err}. Ensure `dep-assay` is installed and on PATH (`cargo install dep-assay`)."
            );
            app.emit(
                "assay://event",
                GuiEvent::SpawnFailed {
                    reason: reason.clone(),
                },
            )
            .ok();
            *state.running.lock().map_err(|e| e.to_string())? = false;
            return Err(reason);
        }
    };

    let diagnostics = Arc::new(Mutex::new(RunDiagnostics::default()));

    let stdout = child.stdout.take().expect("stdout was piped");
    let stderr = child.stderr.take().expect("stderr was piped");
    let stdout_app = app.clone();
    let stdout_diag = Arc::clone(&diagnostics);
    thread::spawn(move || stream_stdout(stdout, stdout_app, stdout_diag));
    let stderr_diag = Arc::clone(&diagnostics);
    thread::spawn(move || buffer_stderr(stderr, stderr_diag));

    let app_for_wait = app.clone();
    // Cheap Arc::clone — the waiter thread now owns its own handle
    // to the `running` lock and the Tauri State storage is not
    // touched after this point.
    let running = Arc::clone(&state.inner().running);
    let wait_diag = Arc::clone(&diagnostics);
    thread::spawn(move || {
        let exit_code = child.wait().ok().and_then(|s| s.code());
        if let Ok(mut guard) = running.lock() {
            *guard = false;
        }
        // If the child died before emitting any NDJSON, surface
        // the buffered stderr in a banner so the UI has something
        // to show. Otherwise stay quiet — assay writes harmless
        // breadcrumbs to stderr on normal runs.
        if exit_code.unwrap_or(0) != 0 {
            if let Ok(diag) = wait_diag.lock() {
                if !diag.saw_ndjson && !diag.stderr_buf.is_empty() {
                    app_for_wait
                        .emit(
                            "assay://event",
                            GuiEvent::StderrBanner {
                                text: diag.stderr_buf.clone(),
                                exit_code,
                            },
                        )
                        .ok();
                }
            }
        }
        app_for_wait
            .emit("assay://event", GuiEvent::StreamEnded { exit_code })
            .ok();
    });
    Ok(())
}

/// Translate UI form state into the assay CLI argv tail.
fn build_cli_args(args: &StartArgs) -> Vec<String> {
    let mut out: Vec<String> = vec![
        "analyze".into(),
        "--format".into(),
        "ndjson".into(),
        "--repo".into(),
        args.repo.clone(),
    ];
    if args.ecosystem != "all" {
        out.push("--ecosystem".into());
        out.push(args.ecosystem.clone());
    }
    match args.mode.as_str() {
        "validate" => out.push("--validate".into()),
        "apply-local" => out.push("--apply-local".into()),
        "apply-pr" => out.push("--apply-pr".into()),
        // dry-run is the default; no flag.
        _ => {}
    }
    // Executor only meaningful when validator runs; assay
    // silently ignores it on dry-run anyway, but we omit on
    // dry-run to keep the command preview minimal.
    if args.mode != "dry-run" {
        let exec = args.executor.to_ascii_lowercase();
        if exec == "host" || exec == "docker" {
            out.push("--executor".into());
            out.push(exec);
        }
    }
    if let Some(t) = args.threads {
        out.push("--threads".into());
        out.push(t.to_string());
    }
    if args.fail_fast {
        out.push("--fail-fast".into());
    }
    if args.member_gate {
        out.push("--member-gate".into());
    }
    if args.no_sha_pin_proposals {
        out.push("--no-sha-pin-proposals".into());
    }
    if args.only_breaking {
        out.push("--only-breaking".into());
    }
    out
}

/// Read assay's stdout line by line. Each line is one NDJSON
/// event; we forward it verbatim wrapped in `GuiEvent::Raw` so the
/// frontend can parse it with the assay schema (avoiding a
/// duplicate type definition on the Rust side that would drift
/// versus assay's actual schema).
fn stream_stdout(
    stdout: std::process::ChildStdout,
    app: AppHandle,
    diag: Arc<Mutex<RunDiagnostics>>,
) {
    let reader = BufReader::new(stdout);
    for line in reader.lines() {
        let Ok(line) = line else { break };
        if line.is_empty() {
            continue;
        }
        if let Ok(mut d) = diag.lock() {
            d.saw_ndjson = true;
        }
        let _ = app.emit("assay://event", GuiEvent::Raw { line });
    }
}

/// Buffer assay's stderr for the duration of the run. We don't
/// stream it to the UI because assay routinely writes harmless
/// breadcrumbs there. The buffered text is surfaced only when the
/// child exits non-zero without having emitted any NDJSON.
fn buffer_stderr(stderr: std::process::ChildStderr, diag: Arc<Mutex<RunDiagnostics>>) {
    const MAX_STDERR_BYTES: usize = 32 * 1024;
    let reader = BufReader::new(stderr);
    for line in reader.lines() {
        let Ok(line) = line else { break };
        if let Ok(mut d) = diag.lock() {
            if d.stderr_buf.len() >= MAX_STDERR_BYTES {
                continue;
            }
            d.stderr_buf.push_str(&line);
            d.stderr_buf.push('\n');
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![pick_repo, start_analysis])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    fn base_args() -> StartArgs {
        StartArgs {
            repo: "C:/proj".into(),
            ecosystem: "all".into(),
            mode: "dry-run".into(),
            threads: None,
            fail_fast: false,
            member_gate: false,
            executor: "docker".into(),
            no_sha_pin_proposals: false,
            only_breaking: false,
        }
    }

    #[test]
    fn app_state_running_flag_is_shareable_across_threads() {
        // Regression guard for the prior `unsafe { &*(usize as
        // *const AppState) }` cast in the waiter thread. The new
        // shape stores `running` as `Arc<Mutex<bool>>` so a cheap
        // `Arc::clone` lets a spawned thread mutate the flag
        // without touching Tauri's state storage.
        let state = AppState::default();
        let cloned = Arc::clone(&state.running);
        // Original thread sets the flag.
        *state.running.lock().unwrap() = true;
        // Spawned thread reads + flips it. This mirrors the
        // start_analysis → child-wait waiter pattern exactly.
        let handle = thread::spawn(move || {
            let mut g = cloned.lock().unwrap();
            assert!(*g, "spawned thread should see writes from the original");
            *g = false;
        });
        handle.join().expect("spawned thread should complete");
        assert!(
            !*state.running.lock().unwrap(),
            "original thread should see the spawned thread's write"
        );
    }

    #[test]
    fn build_cli_args_dry_run_basic() {
        let args = base_args();
        assert_eq!(
            build_cli_args(&args),
            vec!["analyze", "--format", "ndjson", "--repo", "C:/proj"]
        );
    }

    #[test]
    fn build_cli_args_validate_with_ecosystem_filter_and_threads() {
        let mut args = base_args();
        args.repo = "/repo".into();
        args.ecosystem = "npm".into();
        args.mode = "validate".into();
        args.threads = Some(8);
        args.fail_fast = true;
        args.member_gate = true;
        args.executor = "host".into();
        let cli = build_cli_args(&args);
        assert!(cli.contains(&"--ecosystem".to_string()));
        assert!(cli.contains(&"npm".to_string()));
        assert!(cli.contains(&"--validate".to_string()));
        assert!(cli.contains(&"--threads".to_string()));
        assert!(cli.contains(&"8".to_string()));
        assert!(cli.contains(&"--fail-fast".to_string()));
        assert!(cli.contains(&"--member-gate".to_string()));
        assert!(cli.contains(&"--executor".to_string()));
        assert!(cli.contains(&"host".to_string()));
    }

    #[test]
    fn build_cli_args_apply_pr_mode_emits_correct_flag() {
        let mut args = base_args();
        args.mode = "apply-pr".into();
        args.ecosystem = "cargo".into();
        assert!(build_cli_args(&args).contains(&"--apply-pr".to_string()));
    }

    #[test]
    fn build_cli_args_no_sha_pin_proposals_flag() {
        let mut args = base_args();
        args.no_sha_pin_proposals = true;
        assert!(build_cli_args(&args).contains(&"--no-sha-pin-proposals".to_string()));
    }

    #[test]
    fn build_cli_args_only_breaking_flag() {
        let mut args = base_args();
        args.mode = "validate".into();
        args.only_breaking = true;
        assert!(build_cli_args(&args).contains(&"--only-breaking".to_string()));
    }

    #[test]
    fn build_cli_args_executor_omitted_on_dry_run() {
        // The validator doesn't run in dry-run mode and assay
        // silently ignores --executor there. Omitting it keeps
        // the CLI preview shown to the user clean and matches
        // what assay actually consumes.
        let mut args = base_args();
        args.executor = "host".into();
        let cli = build_cli_args(&args);
        assert!(!cli.contains(&"--executor".to_string()));
    }

    #[test]
    fn build_cli_args_executor_present_on_validate() {
        let mut args = base_args();
        args.mode = "validate".into();
        args.executor = "docker".into();
        let cli = build_cli_args(&args);
        assert!(cli.contains(&"--executor".to_string()));
        assert!(cli.contains(&"docker".to_string()));
    }

    #[test]
    fn run_diagnostics_starts_empty() {
        let d = RunDiagnostics::default();
        assert!(!d.saw_ndjson);
        assert!(d.stderr_buf.is_empty());
    }
}
