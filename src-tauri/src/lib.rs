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
}

/// Lightweight diagnostic event we emit to the frontend BEFORE the
/// NDJSON stream proper begins (so the UI can render a "spawning
/// assay…" indicator) and on any spawn-time failure.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "snake_case", tag = "type")]
enum GuiEvent {
    Spawning { command: String },
    SpawnFailed { reason: String },
    StreamEnded { exit_code: Option<i32> },
    Raw { line: String },
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
    app.emit("assay://event", GuiEvent::Spawning { command: command_label })
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
                GuiEvent::SpawnFailed { reason: reason.clone() },
            )
            .ok();
            *state.running.lock().map_err(|e| e.to_string())? = false;
            return Err(reason);
        }
    };

    let stdout = child.stdout.take().expect("stdout was piped");
    let stderr = child.stderr.take().expect("stderr was piped");
    let stdout_app = app.clone();
    thread::spawn(move || stream_stdout(stdout, stdout_app));
    let stderr_app = app.clone();
    thread::spawn(move || stream_stderr(stderr, stderr_app));

    let app_for_wait = app.clone();
    // Cheap Arc::clone — the waiter thread now owns its own handle
    // to the `running` lock and the Tauri State storage is not
    // touched after this point. Replaces an earlier raw-pointer
    // cast that depended on the Tauri runtime not relocating
    // managed state, which is an implementation detail we have no
    // contract on.
    let running = Arc::clone(&state.inner().running);
    thread::spawn(move || {
        let exit_code = child.wait().ok().and_then(|s| s.code());
        if let Ok(mut guard) = running.lock() {
            *guard = false;
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
    out
}

/// Read assay's stdout line by line. Each line is one NDJSON
/// event; we forward it verbatim wrapped in `GuiEvent::Raw` so the
/// frontend can parse it with the assay schema (avoiding a
/// duplicate type definition on the Rust side that would drift
/// versus assay's actual schema).
fn stream_stdout(stdout: std::process::ChildStdout, app: AppHandle) {
    let reader = BufReader::new(stdout);
    for line in reader.lines() {
        let Ok(line) = line else { break };
        if line.is_empty() {
            continue;
        }
        let _ = app.emit("assay://event", GuiEvent::Raw { line });
    }
}

/// Read assay's stderr and forward each line as a diagnostic
/// event. assay only writes to stderr on actual errors (panics,
/// validator setup failures, etc.) so each line is meaningful.
fn stream_stderr(stderr: std::process::ChildStderr, app: AppHandle) {
    let reader = BufReader::new(stderr);
    for line in reader.lines() {
        let Ok(line) = line else { break };
        if line.is_empty() {
            continue;
        }
        let _ = app.emit(
            "assay://event",
            GuiEvent::SpawnFailed {
                reason: format!("assay stderr: {line}"),
            },
        );
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![pick_repo, start_analysis])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

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
        let args = StartArgs {
            repo: "C:/proj".into(),
            ecosystem: "all".into(),
            mode: "dry-run".into(),
            threads: None,
            fail_fast: false,
            member_gate: false,
        };
        assert_eq!(
            build_cli_args(&args),
            vec!["analyze", "--format", "ndjson", "--repo", "C:/proj"]
        );
    }

    #[test]
    fn build_cli_args_validate_with_ecosystem_filter_and_threads() {
        let args = StartArgs {
            repo: "/repo".into(),
            ecosystem: "npm".into(),
            mode: "validate".into(),
            threads: Some(8),
            fail_fast: true,
            member_gate: true,
        };
        let cli = build_cli_args(&args);
        assert!(cli.contains(&"--ecosystem".to_string()));
        assert!(cli.contains(&"npm".to_string()));
        assert!(cli.contains(&"--validate".to_string()));
        assert!(cli.contains(&"--threads".to_string()));
        assert!(cli.contains(&"8".to_string()));
        assert!(cli.contains(&"--fail-fast".to_string()));
        assert!(cli.contains(&"--member-gate".to_string()));
    }

    #[test]
    fn build_cli_args_apply_pr_mode_emits_correct_flag() {
        let args = StartArgs {
            repo: "/r".into(),
            ecosystem: "cargo".into(),
            mode: "apply-pr".into(),
            threads: None,
            fail_fast: false,
            member_gate: false,
        };
        assert!(build_cli_args(&args).contains(&"--apply-pr".to_string()));
    }
}
