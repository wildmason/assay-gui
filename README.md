# assay-gui

Tauri desktop utility that wraps the [`assay`](https://crates.io/crates/dep-assay) CLI with a live-progress GUI. Point it at a repo, watch each proposed dependency upgrade flow through validation in real time, with cohort lockstep members visually grouped under one container so you can see the framework lockstep behavior at a glance.

**Architecture:** a small Tauri 2 shell. The Rust backend spawns `assay analyze --format ndjson <flags>` as a child process, parses each NDJSON event line, and forwards a typed event to the WebView. The vanilla-JS frontend listens on those events and updates per-proposal rows from `pending` → `in_progress` → `complete` (green check / red x) as each event arrives. Cohort groups render with a containing affordance so multi-member cohorts (`@angular/*`, `@tiptap/*`, `tokio + tokio-util`, etc.) are visually one unit being evaluated together.

No frontend framework and no bundler — plain HTML + CSS + JS served directly. The
UI is built from [Aegis v2](https://github.com/wildmason/aegis-unified) `ae-*` web
components (buttons, inputs, selects, checkboxes, radios, tags, the settings
drawer, the alert banner, toasts) styled by Aegis's `--ae-*` design tokens, with a
built-in **theme picker** (Settings › Appearance) that re-skins the whole UI across
every Aegis brand × variant at runtime. Small footprint by design — the whole
production build is a single ~11 MB Tauri binary.

## Theming

The entire UI wears any Aegis v2 brand — neutral **Aegis** (follows your OS
light / dark / high-contrast), **Cinnabar**, **Editorial**, **Metro**, **Crucible**,
or any of the 12 **Spectrum** palettes (incl. the GitHub-flavored *Source Control
Dark*). Pick one live from **Settings › Appearance**; the header ☀/☾ button is a
quick light↔dark flip for the current brand. Your choice persists via
`tauri-plugin-store`.

Aegis ships as `ae-*` Lit elements that externalize `lit`, which a bundler-free
app can't load directly, so the design system is **vendored** into
`src/vendor/aegis/` as a self-contained ESM bundle (lit inlined via esbuild) plus
a concatenated token + theme stylesheet. Regenerate after upgrading the sibling
`aegis-v2` checkout:

```sh
node scripts/vendor-aegis.mjs            # assumes ../../aegis-v2
node scripts/vendor-aegis.mjs <path>     # explicit aegis-v2 root
```

`scripts/check-frontend.mjs` is a dependency-free smoke test (element-id wiring +
vendor integrity); `scripts/screenshot-frontend.mjs` renders the UI across themes
with Playwright for visual QA.

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

## Release

Tag pushes trigger `.github/workflows/release.yml`, which runs the verify matrix (fmt / clippy / lib tests on ubuntu/macos/windows), creates a draft GitHub Release, builds via `tauri-action` across:

- `windows-latest` → `assay_<ver>_x64-setup.exe` (NSIS) + `assay_<ver>_x64_en-US.msi` (**unsigned** — no Authenticode cert configured; SmartScreen will warn)
- `macos-14` → `Assay_<ver>_universal.dmg` (Intel + Apple Silicon, **signed + notarized** when Apple secrets are configured)
- `ubuntu-22.04` → `.deb` + `.AppImage` (glibc 2.35 floor — works on Ubuntu 22+, Debian 12+, RHEL 9+)

…then flips the draft to published. The macOS row uses `scripts/macos-ssh-tauri.sh` (verbatim from Mortar) to patch `bundle_dmg.sh`'s `SKIP_JENKINS` default for SSH/CI hosts and to submit + staple DMG notarization when the Apple notary env is present.

### Required repo secrets (macOS signing path)

Set these in GitHub repo settings → Secrets → Actions before pushing the first signed tag. The `preflight` job refuses to run the build matrix on tag pushes when any are missing:

| Secret | Source |
|---|---|
| `APPLE_CERTIFICATE` | base64-encoded `Developer ID Application` `.p12` |
| `APPLE_CERTIFICATE_PASSWORD` | `.p12` export password |
| `APPLE_SIGNING_IDENTITY` | `Developer ID Application: <name> (<TEAMID>)` |
| `APPLE_API_ISSUER` | App Store Connect API issuer UUID |
| `APPLE_API_KEY` | App Store Connect API key ID |
| `APPLE_API_KEY_FILE` | base64 of the `AuthKey_<ID>.p8` itself |

For unsigned dry-runs of the matrix, use `workflow_dispatch` with a tag input — the preflight gate is skipped.

### Local dispatch via CI Forge

The workflow is shape-compatible with [CI Forge](https://github.com/wildmason/ci-forge). Once the local fleet is registered + `forge mirror-actions --preset wildmason` has seeded the action store, you can bypass hosted-runner minutes:

```sh
forge run --workflow .github/workflows/release.yml \
          --event workflow_dispatch \
          --input tag=vX.Y.Z
```

## Why

The CLI already does the heavy lifting and ships per-proposal verdicts. The GUI is for the moments where you want a sweep visualization: "is the @angular/* cohort going through together?", "which proposal is the worker on right now?", "did the tokio family land green?" Watching the sweep complete is hugely more informative than waiting for the end-of-run summary text.
