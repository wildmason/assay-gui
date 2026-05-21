# Changelog

All notable changes to `assay-gui` are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project tracks [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] — 2026-05-20

### Fixed

- **Settings overlay was visible on launch and could not be dismissed.** The `.overlay` CSS rule set `display: flex` directly, which has higher specificity than the user-agent stylesheet's `[hidden] { display: none }`. Result: `<div id="settings-overlay" class="overlay" hidden>` rendered fully visible despite the `hidden` attribute, blocking access to the main UI behind a semi-transparent backdrop. Clicking the X button, the backdrop, or Save all called `closeSettings()` which set `hidden = true`, but the CSS rule still won, so the overlay stayed visible. Fix: added a global `[hidden] { display: none !important; }` rule near the top of `src/styles.css`. The `!important` is justified — the HTML `hidden` attribute means hidden, and no class-based layout rule should ever beat it. Same fix prevents the equivalent ghost-visibility bug on any other element toggled via `el.hidden = true/false` whose class also sets `display:` (filterbar, control-row, etc.).

## [0.2.0] — 2026-05-20

Production polish over the 0.1.0 spike. The UI now feels finished rather than functional.

### Added

- **Cohort grouping with expandable detail rows.** Multi-member cohorts (`@angular/*`, `@tiptap/*`, `tokio + tokio-util`, etc.) render under a containing affordance so framework-family upgrades visibly evaluate as one atomic unit.
- **Recent-repos persistence** via `tauri-plugin-store@2`. The repo dropdown remembers the last paths analyzed across launches.
- **Live counters + filters + search** across proposals. Filter by state (pass / fail / pending), search by package name, see counters update as the analyze progresses.
- **Settings drawer** with executor (Docker / Host), worker threads, member-gate, no-SHA-pin-proposals, and theme (system / dark / light) — persisted via the store plugin.
- **Run-again** button that re-dispatches the last analyze with the same flags.
- **Copy-to-clipboard** on findings + stderr via `tauri-plugin-clipboard-manager@2`. One click on any red proposal copies the structured failure context.
- **Error-state banner** for empty-NDJSON failure runs (the case where assay exits cleanly with no proposals emitted but stderr carries the diagnosis).
- **Light/dark theme toggle** with `prefers-color-scheme` default + manual override persisted in the store.
- **Structured failure-context render path** consuming the schema added in [`dep-assay` 1.6.0](https://github.com/wildmason/assay/releases/tag/v1.6.0). Each red proposal can display code badges + `file:line:col` location; falls back to raw `stderr_tail` when running against an older assay (1.5.x or earlier).
- **Root-cause clusters section** at the page footer when assay emits `run_completed.failure_clusters` with two or more proposals sharing a fingerprint.

### Changed

- **`GuiEvent::Raw { line }`** forwards each NDJSON line verbatim to the WebView, making the GUI schema-forward — additive assay NDJSON schema changes flow through without a GUI rebuild.
- **`StderrBanner`** event for the empty-NDJSON failure case (assay exited cleanly without emitting any proposal events, but stderr carries the diagnosis).
- **Capability surface expanded** to include `store:*` + `clipboard-manager:allow-write-text`. CSP unchanged (`default-src 'self'`, no `connect-src`).
- **Bundled exe is ~10.1 MB**, NSIS installer ~2.3 MB, MSI ~3.5 MB.

### Removed

- The `unsafe { &*(usize as *const AppState) }` pointer cast in the child-wait thread (commit `752bb80`). Replaced with `Arc<AppState>` cloned into the thread. No `unsafe` blocks remain.

## [0.1.0] — 2026-05-20

Initial spike. Tauri 2 shell over `assay analyze --format ndjson`. Per-proposal progress rows, cohort grouping (visual only), repo picker, basic start/stop. No persistence, no theming, no filters.
