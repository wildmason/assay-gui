#!/usr/bin/env bash
# macos-ssh-tauri.sh
#
# tauri-action `tauriScript` wrapper for macOS rows of the release matrix.
#
# What it does:
#   1. Ensures @tauri-apps/cli@v2 is installed globally (idempotent), since
#      tauri-action's auto-install path is skipped whenever tauriScript is set.
#   2. Patches the @tauri-apps/cli native binary's embedded bundle_dmg.sh
#      template so SKIP_JENKINS defaults to 1 instead of 0 (same byte length;
#      in-place edit). The resulting DMG is functional and notarizable; only
#      the optional Finder window cosmetics are skipped.
#   3. Re-signs the patched .node module ad-hoc so Node.js accepts it.
#   4. Runs `tauri "$@"`.
#   5. If Apple notary credentials are present, submits and staples each
#      produced DMG container before tauri-action uploads release assets.
#
# Why this is in Mortar rather than in CI Forge: tauri-bundler embeds the
# bundle_dmg.sh template inside its native binary, and tauri-action does
# `npm install -g @tauri-apps/cli@v2` mid-step which overwrites any patch
# we land on disk beforehand. The only reliable injection point is at
# tauri-action's `tauriScript` hook, which is workflow-level.
#
# On GitHub-hosted macos-14 runners this wrapper still patches. That trades
# custom Finder cosmetics for one deterministic macOS release path across
# hosted and SSH-only runners, and it gives us one place to apply the optional
# DMG-container notarization pass before upload.

set -euo pipefail

log() { printf 'macos-ssh-tauri: %s\n' "$*" >&2; }

# --- Step 1: ensure tauri-cli is installed -------------------------------
if ! command -v tauri >/dev/null 2>&1; then
  log "installing @tauri-apps/cli@v2 globally"
  npm install -g @tauri-apps/cli@v2 >&2
fi

# --- Step 2: patch bundle_dmg.sh template --------------------------------
# SSH sessions on macOS can issue trivial AppleScript queries (`get name`),
# but the heavier window-manipulation operations bundle_dmg.sh's
# template.applescript performs (open disk window, set position, set bounds,
# set viewOptions, set background picture) reliably hit `AppleEvent timed out
# (-1712)` because WindowServer access is not brokered through SSH bash
# sessions even when forge-ci is logged in graphically. Probing for
# AppleScript reachability gave false confidence: basic queries succeeded
# while the bundle_dmg.sh script still failed. Always patch when this wrapper
# runs so hosted and local macOS release rows follow the same path.
log "patching bundle_dmg.sh template (SKIP_JENKINS default 0->1) for SSH-safe DMG bundling"

# Locate the native binary. Try the typical Homebrew global layout first;
# fall back to a broader search if absent.
CLI_BINARY=""
for candidate in \
  "/opt/homebrew/lib/node_modules/@tauri-apps/cli/node_modules/@tauri-apps/cli-darwin-arm64/cli.darwin-arm64.node" \
  "/opt/homebrew/lib/node_modules/@tauri-apps/cli/node_modules/@tauri-apps/cli-darwin-x64/cli.darwin-x64.node" \
  "/usr/local/lib/node_modules/@tauri-apps/cli/node_modules/@tauri-apps/cli-darwin-arm64/cli.darwin-arm64.node" \
  "/usr/local/lib/node_modules/@tauri-apps/cli/node_modules/@tauri-apps/cli-darwin-x64/cli.darwin-x64.node"
do
  if [[ -f "$candidate" ]]; then
    CLI_BINARY="$candidate"
    break
  fi
done

if [[ -z "$CLI_BINARY" ]]; then
  NPM_PREFIX=$(npm prefix -g)
  CLI_BINARY=$(find "$NPM_PREFIX/lib/node_modules/@tauri-apps" -name 'cli.darwin-*.node' 2>/dev/null | head -1 || true)
fi

if [[ -z "$CLI_BINARY" || ! -f "$CLI_BINARY" ]]; then
  log "ERROR: could not locate @tauri-apps/cli native binary; aborting"
  exit 1
fi

log "patching: $CLI_BINARY"

python3 - "$CLI_BINARY" <<'PY'
import sys
path = sys.argv[1]
needle = b'SKIP_JENKINS=0'
replacement = b'SKIP_JENKINS=1'
with open(path, 'rb') as f:
    data = f.read()
count = data.count(needle)
if count == 0:
    # Already patched (or upstream changed the template); no-op.
    print("macos-ssh-tauri: SKIP_JENKINS=0 not found; assuming already patched", file=sys.stderr)
    sys.exit(0)
if count > 1:
    print(f"macos-ssh-tauri: unexpected occurrence count {count}; refusing", file=sys.stderr)
    sys.exit(2)
patched = data.replace(needle, replacement, 1)
assert len(patched) == len(data), "patch length changed"
with open(path, 'wb') as f:
    f.write(patched)
print("macos-ssh-tauri: patched in place", file=sys.stderr)
PY

# The .node binary ships linker-signed with an embedded codesign signature. A
# byte-level patch invalidates that signature, which on macOS leads to Node.js
# loading the module but silently disabling some functionality (in practice:
# tauri-bundler's macOS bundling phase completes for `.app` but skips `.dmg`
# and `.app.tar.gz`/`.sig` generation, with no error message). Re-sign ad-hoc
# so the binary loads cleanly. `-s -` matches the original linker-signed
# identity (ad-hoc).
log "re-signing patched binary (ad-hoc) so Node.js accepts it"
codesign --force -s - "$CLI_BINARY" 2>&1 | sed 's/^/macos-ssh-tauri: /' >&2
codesign --verify "$CLI_BINARY" 2>&1 || {
  log "ERROR: codesign verify failed after re-sign; aborting"
  exit 1
}
log "binary re-signed and verified"

notarize_dmg_containers_if_possible() {
  if [[ "$(uname -s)" != "Darwin" ]]; then
    return 0
  fi

  if [[ -z "${APPLE_API_ISSUER:-}" || -z "${APPLE_API_KEY:-}" || -z "${APPLE_API_KEY_PATH:-}" ]]; then
    log "DMG container notarization skipped: Apple notary env not fully present"
    return 0
  fi

  if [[ ! -f "$APPLE_API_KEY_PATH" ]]; then
    log "ERROR: APPLE_API_KEY_PATH does not point to a file: $APPLE_API_KEY_PATH"
    exit 1
  fi

  if ! command -v xcrun >/dev/null 2>&1; then
    log "ERROR: xcrun is unavailable; cannot notarize DMG container"
    exit 1
  fi

  local roots=("$PWD")
  if [[ -d "$PWD/../src-tauri" ]]; then
    roots+=("$(cd "$PWD/.." && pwd)")
  fi

  local found=0
  local dmg
  while IFS= read -r -d '' dmg; do
    found=1
    log "checking DMG container ticket: $dmg"
    if xcrun stapler validate "$dmg" >/dev/null 2>&1; then
      log "DMG already has a stapled ticket: $dmg"
      continue
    fi

    log "submitting DMG container to Apple notary service: $dmg"
    xcrun notarytool submit "$dmg" \
      --issuer "$APPLE_API_ISSUER" \
      --key-id "$APPLE_API_KEY" \
      --key "$APPLE_API_KEY_PATH" \
      --wait

    log "stapling DMG container ticket: $dmg"
    xcrun stapler staple "$dmg"
    xcrun stapler validate "$dmg"
  done < <(find "${roots[@]}" -type f -path '*/bundle/dmg/*.dmg' -print0 2>/dev/null)

  if [[ "$found" -eq 0 ]]; then
    log "ERROR: Apple notary env present, but no bundle/dmg/*.dmg artifacts were found"
    exit 1
  fi
}

# --- Step 3: run tauri ----------------------------------------------------
tauri "$@"

# --- Step 4: optionally notarize/staple DMG containers before upload -------
notarize_dmg_containers_if_possible
