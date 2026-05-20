# assay-gui

Tauri desktop utility that wraps the [`assay`](https://crates.io/crates/dep-assay) CLI with a live-progress GUI. Point it at a repo, watch each proposed dependency upgrade flow through validation in real time, with cohort lockstep members visually grouped under one container so you can see the framework lockstep behavior at a glance.

**Architecture:** a small Tauri 2 shell. The Rust backend spawns `assay analyze --format ndjson <flags>` as a child process, parses each NDJSON event line, and forwards a typed event to the WebView. The vanilla-JS frontend listens on those events and updates per-proposal rows from `pending` → `in_progress` → `complete` (green check / red x) as each event arrives. Cohort groups render with a containing affordance so multi-member cohorts (`@angular/*`, `@tiptap/*`, `tokio + tokio-util`, etc.) are visually one unit being evaluated together.

No frontend framework — plain HTML + CSS + JS. Small footprint by design. The whole production build is a single ~10MB Tauri binary.

## Requirements

- [Tauri 2 prerequisites](https://tauri.app/start/prerequisites/) (Rust, system WebView, platform build tools).
- [`assay`](https://crates.io/crates/dep-assay) on `PATH` (the GUI shells out to `assay analyze ...`). Install: `cargo install dep-assay`.

## Develop

```sh
cargo install tauri-cli --version "^2"
cargo tauri dev
```

The frontend lives in `src/` and is served directly (no bundler). Edits hot-reload by virtue of the WebView re-reading.

## Build

```sh
cargo tauri build
```

Produces the installer + raw binary under `src-tauri/target/release/bundle/`.

## Why

The CLI already does the heavy lifting and ships per-proposal verdicts. The GUI is for the moments where you want a sweep visualization: "is the @angular/* cohort going through together?", "which proposal is the worker on right now?", "did the tokio family land green?" Watching the sweep complete is hugely more informative than waiting for the end-of-run summary text.
