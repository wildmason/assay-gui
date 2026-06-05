// assay-gui frontend.
//
// Vanilla JS — no framework, no bundler. The Rust backend
// forwards each NDJSON line wrapped in `GuiEvent::Raw { line }`.
// We parse the embedded event and update the proposal-list DOM
// in place. Cohort members render inside a containing card so
// multi-member cohort lockstep groups are visually one unit.
// Single-member cohorts render flat (no container) — the
// container affordance is reserved for actual lockstep groupings.
//
// All Tauri global access is deferred until DOMContentLoaded so a
// missing global doesn't tear down module evaluation before the
// user sees any UI.
//
// Persistence: settings + recent repos live in a single
// `assay-gui.json` store managed by tauri-plugin-store. Stores
// are created lazily — the JS-side `getStore(path, opts)` call
// from `@tauri-apps/plugin-store` is exposed via withGlobalTauri
// as `window.__TAURI__.store.getStore` when the plugin is loaded.
// We access it through a defensive shim so missing-plugin failures
// degrade to "no persistence" instead of crashing the app.
//
// Schema-forward safety: `failure_context` and `failure_clusters`
// are added in assay 1.6.0 and absent on 1.5.0. We treat them as
// purely additive — no warning, no error, no degraded UI on
// absence. Their renderers run only when the fields are present
// and non-empty.

// Aegis v2 design system. The bare import registers every ae-* custom element
// (and the global side effects); the named imports drive the in-app theme
// picker. Vendored, self-contained (lit inlined) — see vendor/aegis/VENDORED.md.
import "./vendor/aegis/aegis.js";
import {
  THEME_REGISTRY,
  applyTheme as aeApplyTheme,
  resolveEffectiveVariant,
  getThemeBrand,
  getThemeVariant,
  toast as aeToast,
} from "./vendor/aegis/aegis.js";

const RECENTS_CAP = 8;
const STORE_PATH = "assay-gui.json";
const STORE_KEY_PREFS = "prefs";
const STORE_KEY_RECENTS = "recents";
const STORE_KEY_LAST_ARGS = "lastArgs";

// --- Tauri shims -------------------------------------------------

function tauri() {
  const T = window.__TAURI__;
  if (!T || !T.core || !T.event) {
    throw new Error(
      "window.__TAURI__ globals not present — is `app.withGlobalTauri: true` set in tauri.conf.json?"
    );
  }
  return { invoke: T.core.invoke, listen: T.event.listen };
}

/**
 * Open (or create) the persistent store and return a minimal
 * { get, set, save } shim.
 *
 * We don't depend on the @tauri-apps/plugin-store JS bindings —
 * we'd have to ship a bundler to use them. Instead we hit the
 * plugin's IPC commands directly (`plugin:store|load`,
 * `plugin:store|set`, etc.) and pass around the resource id the
 * `load` command returns. If the store plugin isn't reachable
 * for any reason (older binary, missing capability, dev oddity),
 * every operation degrades to a no-op and the app keeps working
 * without persistence.
 */
async function openStore() {
  try {
    const { invoke } = tauri();
    const rid = await invoke("plugin:store|load", {
      path: STORE_PATH,
      options: { autoSave: true },
    });
    return {
      async get(key) {
        try {
          const [value, exists] = await invoke("plugin:store|get", { rid, key });
          return exists ? value : null;
        } catch {
          return null;
        }
      },
      async set(key, value) {
        try { await invoke("plugin:store|set", { rid, key, value }); } catch { /* noop */ }
      },
      async save() {
        try { await invoke("plugin:store|save", { rid }); } catch { /* noop */ }
      },
    };
  } catch (err) {
    console.warn("store unavailable; persistence disabled:", err);
    return { get: async () => null, set: async () => {}, save: async () => {} };
  }
}

async function clipboardWrite(text) {
  try {
    const { invoke } = tauri();
    await invoke("plugin:clipboard-manager|write_text", { text });
    return true;
  } catch (err) {
    console.warn("clipboard plugin write failed:", err);
  }
  // Browser fallback (works in dev WebView too).
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// --- DOM refs ----------------------------------------------------

const $ = (id) => document.getElementById(id);
const els = {
  // Header
  runStatus: $("run-status"),
  themeToggle: $("theme-toggle"),
  themeIcon: $("theme-icon"),
  settingsBtn: $("settings-btn"),
  // Error banner (ae-alert)
  errorBanner: $("error-banner"),
  errorBannerBody: $("error-banner-body"),
  errorBannerCopy: $("error-banner-copy"),
  errorBannerDismiss: $("error-banner-dismiss"),
  // Theme picker
  themeBrand: $("theme-brand"),
  themeVariants: $("theme-variants"),
  // Recents
  recents: $("recents"),
  recentsList: $("recents-list"),
  recentsClear: $("recents-clear"),
  // Controls
  repo: $("repo"),
  browse: $("browse"),
  ecosystem: $("ecosystem"),
  mode: $("mode"),
  failFast: $("fail-fast"),
  start: $("start"),
  runAgain: $("run-again"),
  cliPreview: $("cli-preview"),
  openSettingsInline: $("open-settings-inline"),
  // Progress
  emptyState: $("empty-state"),
  proposalList: $("proposal-list"),
  countDiscovered: $("count-discovered"),
  countValidating: $("count-validating"),
  countPassed: $("count-passed"),
  countFailed: $("count-failed"),
  validateBreaking: $("validate-breaking"),
  footerTail: $("footer-tail"),
  // Filters
  filterbar: $("filterbar"),
  search: $("search"),
  // Clusters
  clusters: $("clusters"),
  clustersList: $("clusters-list"),
  // Settings drawer (ae-drawer)
  settingsOverlay: $("settings-overlay"),
  settingsClose: $("settings-close"),
  executorGroup: $("executor-group"),
  settingsThreads: $("settings-threads"),
  settingsMemberGate: $("settings-member-gate"),
  settingsNoShaPin: $("settings-no-sha-pin"),
  settingsSave: $("settings-save"),
};

// --- State -------------------------------------------------------

const state = {
  proposals: new Map(),
  cohorts: new Map(),
  listOrder: [],
  runActive: false,
  /** assay command args used for the last/current run; powers "Run again". */
  lastArgs: null,
  /** Active filter: 'all' | 'tier:<value>' | 'state:<value>'. */
  filter: "all",
  /** Lowercased subject substring. */
  search: "",
  /** User prefs (merged with defaults on load). */
  prefs: {
    executor: "docker",
    threads: 4,
    memberGate: false,
    noShaPinProposals: false,
    // Aegis theme selection. themeBrand is a BrandId ('default','cinnabar',
    // 'spectrum',…); themeVariant is a VariantId or null (null = the brand's
    // default, and for the 'default' brand that means follow the OS scheme).
    themeBrand: "default",
    themeVariant: null,
  },
  recents: [], // Array<{ path, lastUsedAt }>
  store: null,
};

// --- Theme -------------------------------------------------------
//
// The UI wears any Aegis v2 brand × variant. The selection lives in
// prefs.themeBrand (BrandId) + prefs.themeVariant (VariantId | null) and is
// applied by stamping data-theme/data-variant on <html> via Aegis's applyTheme.
// Theme changes are LOW-STAKES and persist immediately (like the header
// toggle) — independent of the Settings "Save" button, which gates the run
// settings.

function currentSelection() {
  return { theme: state.prefs.themeBrand || "default", variant: state.prefs.themeVariant ?? null };
}

/** Apply the current prefs selection to <html> and sync the header icon. */
function applyThemeSelection() {
  aeApplyTheme(currentSelection());
  updateThemeIcon();
}

/** Header ☀/☾ reflects the EFFECTIVE variant's light/dark direction. */
function updateThemeIcon() {
  if (!els.themeIcon) return;
  const sel = currentSelection();
  const v = getThemeVariant(sel.theme, resolveEffectiveVariant(sel));
  els.themeIcon.textContent = v && v.isDark ? "☾" : "☀";
}

/**
 * Header quick-toggle: flip the current brand between its light and dark
 * variants. No-op for a brand that ships only one direction (the full picker
 * in Settings is the way to leave such a brand).
 */
function cycleTheme() {
  const brand = getThemeBrand(state.prefs.themeBrand || "default");
  if (!brand) return;
  const cur = getThemeVariant(brand.id, resolveEffectiveVariant(currentSelection()));
  const wantDir = cur && cur.direction === "dark" ? "light" : "dark";
  const target =
    brand.variants.find((v) => v.direction === wantDir && !v.isHighContrast) ||
    brand.variants.find((v) => v.direction === wantDir);
  if (!target) return;
  state.prefs.themeVariant = target.id;
  applyThemeSelection();
  syncThemePicker();
  persistPrefs();
}

// --- Theme picker (Settings › Appearance) ------------------------

/** Populate the brand <ae-select> + variant chips from THEME_REGISTRY. */
function buildThemePicker() {
  if (!els.themeBrand) return;
  els.themeBrand.innerHTML = THEME_REGISTRY.map(
    (b) => `<ae-option value="${escapeAttr(b.id)}">${escapeHtml(b.label)}</ae-option>`,
  ).join("");
  els.themeBrand.value = state.prefs.themeBrand || "default";
  renderVariantChips();
}

/** Reflect the current selection back into the brand select + variant chips. */
function syncThemePicker() {
  if (els.themeBrand) els.themeBrand.value = state.prefs.themeBrand || "default";
  renderVariantChips();
}

/** Render the variant swatch chips for the currently-selected brand. */
function renderVariantChips() {
  if (!els.themeVariants) return;
  const brand = getThemeBrand(state.prefs.themeBrand || "default");
  if (!brand) { els.themeVariants.innerHTML = ""; return; }
  const effective = resolveEffectiveVariant({ theme: brand.id, variant: state.prefs.themeVariant ?? null });
  const chips = [];
  // "System" chip for the brand that follows the OS (only the default brand).
  if (brand.followsSystem) chips.push(systemChipHtml(state.prefs.themeVariant == null));
  for (const v of brand.variants) {
    chips.push(variantChipHtml(v, state.prefs.themeVariant != null && v.id === effective));
  }
  els.themeVariants.innerHTML = chips.join("");
  els.themeVariants.querySelectorAll(".theme-swatch").forEach((chip) => {
    chip.addEventListener("click", () => selectVariant(chip.dataset.variant || null));
    chip.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectVariant(chip.dataset.variant || null); }
    });
  });
}

function variantChipHtml(v, on) {
  const s = v.swatch || {};
  return `
    <div class="theme-swatch" role="radio" tabindex="0" aria-checked="${on}" data-variant="${escapeAttr(v.id)}" title="${escapeAttr(v.description || v.label)}">
      <span class="theme-swatch-preview">
        <span style="background:${escapeAttr(s.bg || "")}"></span>
        <span style="background:${escapeAttr(s.surface || "")}"></span>
        <span class="sw-accent" style="background:${escapeAttr(s.accent || "")}"></span>
      </span>
      <span class="theme-swatch-label">${escapeHtml(v.label)}</span>
    </div>`;
}

function systemChipHtml(on) {
  return `
    <div class="theme-swatch" role="radio" tabindex="0" aria-checked="${on}" data-variant="" title="Follow the OS light / dark / contrast preference">
      <span class="theme-swatch-preview">
        <span style="background:#ffffff"></span>
        <span style="background:#0d1117"></span>
        <span class="sw-accent" style="background:var(--ae-color-accent)"></span>
      </span>
      <span class="theme-swatch-label">System</span>
    </div>`;
}

/** Brand changed in the select: reset to its default variant (OS-follow for
 * the default brand), then apply + persist live. */
function selectBrand(brandId) {
  const brand = getThemeBrand(brandId) || getThemeBrand("default");
  state.prefs.themeBrand = brand.id;
  state.prefs.themeVariant = brand.followsSystem ? null : brand.defaultVariant;
  applyThemeSelection();
  renderVariantChips();
  persistPrefs();
}

/** Variant chip clicked. Empty string => null (brand default / OS follow). */
function selectVariant(variantId) {
  state.prefs.themeVariant = variantId ? variantId : null;
  applyThemeSelection();
  renderVariantChips();
  persistPrefs();
}

// --- CLI preview -------------------------------------------------

function buildCommandArgs() {
  // Mirror what the Rust side will assemble. We need this for
  // both the preview and the "Run again" payload.
  const parts = ["assay", "analyze", "--format", "ndjson"];
  const repo = els.repo.value.trim();
  if (repo) parts.push("--repo", quote(repo));
  if (els.ecosystem.value !== "all") parts.push("--ecosystem", els.ecosystem.value);
  switch (els.mode.value) {
    case "validate": parts.push("--validate"); break;
    case "apply-local": parts.push("--apply-local"); break;
    case "apply-pr": parts.push("--apply-pr"); break;
  }
  if (els.mode.value !== "dry-run") {
    parts.push("--executor", state.prefs.executor);
  }
  if (state.prefs.threads) parts.push("--threads", String(state.prefs.threads));
  if (els.failFast.checked) parts.push("--fail-fast");
  if (state.prefs.memberGate) parts.push("--member-gate");
  if (state.prefs.noShaPinProposals) parts.push("--no-sha-pin-proposals");
  return parts;
}

function updateCliPreview() {
  els.cliPreview.textContent = buildCommandArgs().join(" ");
}

function quote(s) {
  if (/\s/.test(s)) return `"${s}"`;
  return s;
}

// --- Recents -----------------------------------------------------

function renderRecents() {
  if (!state.recents.length || state.runActive) {
    els.recents.hidden = true;
    return;
  }
  els.recents.hidden = false;
  els.recentsList.innerHTML = "";
  for (const r of state.recents) {
    const li = document.createElement("li");
    li.className = "recent-item";
    li.title = r.path;
    li.innerHTML = `
      <span class="recent-icon" aria-hidden="true">▸</span>
      <span class="recent-path"></span>
      <span class="recent-meta"></span>
      <button class="recent-remove" type="button" aria-label="remove">×</button>
    `;
    li.querySelector(".recent-path").textContent = r.path;
    li.querySelector(".recent-meta").textContent = relativeTime(r.lastUsedAt);
    li.addEventListener("click", (e) => {
      if (e.target.closest(".recent-remove")) return;
      els.repo.value = r.path;
      updateCliPreview();
      // One-click open + analyze.
      startRun();
    });
    li.querySelector(".recent-remove").addEventListener("click", (e) => {
      e.stopPropagation();
      state.recents = state.recents.filter((x) => x.path !== r.path);
      persistRecents();
      renderRecents();
    });
    els.recentsList.appendChild(li);
  }
}

async function pushRecent(path) {
  if (!path) return;
  state.recents = state.recents.filter((r) => r.path !== path);
  state.recents.unshift({ path, lastUsedAt: Date.now() });
  if (state.recents.length > RECENTS_CAP) {
    state.recents = state.recents.slice(0, RECENTS_CAP);
  }
  await persistRecents();
}

async function persistRecents() {
  if (!state.store) return;
  await state.store.set(STORE_KEY_RECENTS, state.recents);
  await state.store.save();
}

function relativeTime(ts) {
  if (!ts) return "";
  const delta = Date.now() - ts;
  const m = 60_000, h = 3_600_000, d = 86_400_000;
  if (delta < m) return "just now";
  if (delta < h) return `${Math.floor(delta / m)}m ago`;
  if (delta < d) return `${Math.floor(delta / h)}h ago`;
  return `${Math.floor(delta / d)}d ago`;
}

// --- Prefs persistence -------------------------------------------

async function persistPrefs() {
  if (!state.store) return;
  await state.store.set(STORE_KEY_PREFS, state.prefs);
  await state.store.save();
}

function applyPrefsToSettingsPanel() {
  if (els.executorGroup) els.executorGroup.value = state.prefs.executor || "docker";
  els.settingsThreads.value = String(state.prefs.threads || 4);
  els.settingsMemberGate.checked = !!state.prefs.memberGate;
  els.settingsNoShaPin.checked = !!state.prefs.noShaPinProposals;
  // The theme controls are driven live by the picker, not gated by Save.
  syncThemePicker();
}

function readPrefsFromSettingsPanel() {
  state.prefs.executor = (els.executorGroup && els.executorGroup.value) || "docker";
  const t = parseInt(els.settingsThreads.value, 10);
  state.prefs.threads = Number.isFinite(t) && t > 0 ? t : 4;
  state.prefs.memberGate = els.settingsMemberGate.checked;
  state.prefs.noShaPinProposals = els.settingsNoShaPin.checked;
  // Theme is not read here — selectBrand/selectVariant already persisted it.
}

// --- Start / run ------------------------------------------------

function buildStartArgsPayload() {
  return {
    repo: els.repo.value.trim(),
    ecosystem: els.ecosystem.value,
    mode: els.mode.value,
    threads: state.prefs.threads || null,
    failFast: els.failFast.checked,
    memberGate: state.prefs.memberGate,
    executor: state.prefs.executor,
    noShaPinProposals: state.prefs.noShaPinProposals,
    onlyBreaking: false,
  };
}

function validateBreakingUpgrades() {
  const base = state.lastArgs || buildStartArgsPayload();
  const args = {
    ...base,
    repo: base.repo || els.repo.value.trim(),
    ecosystem: base.ecosystem || els.ecosystem.value,
    mode: "validate",
    threads: state.prefs.threads || null,
    failFast: els.failFast.checked,
    memberGate: state.prefs.memberGate,
    executor: state.prefs.executor,
    noShaPinProposals: state.prefs.noShaPinProposals,
    onlyBreaking: true,
  };
  startRun(args);
}

async function startRun(prebuiltArgs) {
  const args = prebuiltArgs || buildStartArgsPayload();
  if (!args.repo) {
    setStatus("Pick a repo first.", "error");
    return;
  }
  if (state.runActive) return;
  hideErrorBanner();
  resetRunState();
  if (args.onlyBreaking) {
    els.emptyState.querySelector("p").textContent = "Validating breaking-risk upgradesâ€¦ waiting for assay to surface proposals.";
  }
  setStatus("running", "running");
  state.runActive = true;
  state.lastArgs = args;
  els.start.disabled = true;
  els.runAgain.hidden = true;
  renderRecents(); // hides while running
  try {
    const { invoke } = tauri();
    await invoke("start_analysis", { args });
  } catch (err) {
    setStatus(`failed: ${err}`, "error");
    state.runActive = false;
    els.start.disabled = false;
    renderRecents();
  }
  // Recents update happens on RunStarted so we don't accumulate
  // entries for invocations that never even spawned.
}

// --- Event handling ---------------------------------------------

function startEventListener() {
  const { listen } = tauri();
  return listen("assay://event", (e) => {
    const payload = e.payload;
    if (!payload || !payload.type) return;
    switch (payload.type) {
      case "spawning":
        els.footerTail.textContent = "spawning…";
        break;
      case "spawn_failed":
        setStatus("spawn failed", "error");
        showErrorBanner(payload.reason || "spawn failed", null);
        state.runActive = false;
        els.start.disabled = false;
        renderRecents();
        break;
      case "stderr_banner":
        showErrorBanner(payload.text || "(no stderr captured)", payload.exit_code);
        break;
      case "stream_ended":
        finalizeRun(payload.exit_code);
        break;
      case "raw":
        handleNdjsonLine(payload.line);
        break;
      default:
        console.warn("unhandled event", payload);
    }
  });
}

function finalizeRun(exitCode) {
  state.runActive = false;
  els.start.disabled = false;
  if (state.lastArgs) els.runAgain.hidden = false;
  if (exitCode === 0 || exitCode == null) {
    if (els.runStatus.dataset.kind === "error") {
      // Keep the error pill if a banner showed.
    } else {
      setStatus("done", "done");
    }
  } else if (state.proposals.size === 0) {
    // No proposals + non-zero exit = the banner is already
    // showing or about to.
    setStatus(`exit ${exitCode}`, "error");
  } else {
    setStatus(`exit ${exitCode}`, "error");
  }
  renderRecents();
  updateValidateBreakingButton();
}

function handleNdjsonLine(line) {
  let evt;
  try {
    evt = JSON.parse(line);
  } catch {
    console.warn("bad NDJSON line:", line);
    return;
  }
  switch (evt.type) {
    case "run_started": onRunStarted(evt); break;
    case "proposal_validating": onProposalValidating(evt); break;
    case "proposal_completed": onProposalCompleted(evt); break;
    case "cohort_validating": onCohortValidating(evt); break;
    case "cohort_completed": onCohortCompleted(evt); break;
    case "run_completed": onRunCompleted(evt); break;
    default:
      // Unknown event types are tolerated — assay's 1.x stability
      // promise says new variants are additive.
      console.warn("unknown event type:", evt.type, evt);
  }
}

function onRunStarted(evt) {
  // Push to recents only once we actually have a working run.
  if (state.lastArgs && state.lastArgs.repo) {
    pushRecent(state.lastArgs.repo);
  }
  const validationAttempted = state.lastArgs?.mode === "validate";
  // Index cohorts.
  const cohortByMember = new Map();
  (evt.cohorts || []).forEach((c) => {
    state.cohorts.set(c.id, {
      id: c.id,
      display: c.display,
      memberIds: c.member_ids,
      state: "pending",
    });
    c.member_ids.forEach((mid) => cohortByMember.set(mid, c.id));
  });

  // Index proposals.
  (evt.proposals || []).forEach((p) => {
    state.proposals.set(p.id, {
      id: p.id,
      subject: p.subject,
      from: p.from,
      to: p.to,
      tier: p.tier,
      ecosystem: p.ecosystem,
      cohort: p.cohort || null,
      explanation: p.explanation || null,
      state: "pending",
      durationMs: null,
      conclusion: null,
      validationAttempted,
      // 1.6.0+ fields, surfaced when present on proposal_completed.
      failureContext: null,
      stderrTail: null,
      manifestPaths: null,
      validatedWorkflows: null,
      ciForgeRunIds: null,
      notes: null,
      expanded: false,
    });
  });

  // Compute list order. Multi-member cohorts get a container; a
  // cohort with only one member renders flat (no container) per
  // the design rationale — the container affordance is reserved
  // for actual lockstep groupings.
  const placedCohorts = new Set();
  (evt.proposals || []).forEach((p) => {
    const cid = cohortByMember.get(p.id);
    if (cid && state.cohorts.get(cid).memberIds.length > 1) {
      if (!placedCohorts.has(cid)) {
        placedCohorts.add(cid);
        state.listOrder.push({ kind: "cohort", id: cid });
      }
    } else {
      state.listOrder.push({ kind: "proposal", id: p.id });
    }
  });

  renderList();
  // Filterbar visible once we have proposals to filter.
  els.filterbar.hidden = state.proposals.size === 0;
  els.footerTail.textContent = `${state.proposals.size} proposal(s), ${state.cohorts.size} cohort(s)`;
  updateValidateBreakingButton();
}

function onProposalValidating(evt) {
  const p = state.proposals.get(evt.id);
  if (!p) return;
  p.state = "inprogress";
  updateProposalRow(p);
  updateCounts();
}

function onProposalCompleted(evt) {
  const p = state.proposals.get(evt.id);
  if (!p) return;
  p.state = mapConclusion(evt.conclusion);
  p.conclusion = evt.conclusion;
  p.durationMs = evt.duration_ms;
  // assay 1.6.0+ optional fields. Treat absence as "no extra
  // detail to show" — never crash, never warn.
  if (evt.failure_context) p.failureContext = evt.failure_context;
  if (evt.stderr_tail) p.stderrTail = evt.stderr_tail;
  if (evt.manifest_paths) p.manifestPaths = evt.manifest_paths;
  if (evt.validated_workflows) p.validatedWorkflows = evt.validated_workflows;
  if (evt.ci_forge_run_ids) p.ciForgeRunIds = evt.ci_forge_run_ids;
  if (evt.notes) p.notes = evt.notes;
  updateProposalRow(p);
  if (p.el && p.el.classList.contains("expanded")) {
    // Re-render expanded panel with the freshly-arrived detail.
    renderDetailPanel(p);
  }
  updateCounts();
}

function onCohortValidating(evt) {
  const c = state.cohorts.get(evt.cohort);
  if (!c) return;
  c.state = "inprogress";
  updateCohortContainer(c);
  c.memberIds.forEach((mid) => {
    const m = state.proposals.get(mid);
    if (m) {
      m.state = "inprogress";
      updateProposalRow(m);
    }
  });
  updateCounts();
}

function onCohortCompleted(evt) {
  const c = state.cohorts.get(evt.cohort);
  if (!c) return;
  const newState = mapConclusion(evt.conclusion);
  c.state = newState;
  c.memberIds.forEach((mid) => {
    const m = state.proposals.get(mid);
    if (m) {
      // Member proposals share the cohort's conclusion since
      // cohorts are atomic. But individual member outcomes can
      // still vary in the GUI rendering — that's why we capture
      // "mixed" below when proposal_completed events show a
      // disagreement, e.g. some succeeded and some failed.
      m.state = newState;
      m.conclusion = evt.conclusion;
      m.durationMs = evt.duration_ms;
      updateProposalRow(m);
    }
  });
  // If members have heterogeneous states (e.g. one already
  // failed), reflect that as 'mixed' on the container.
  const memberStates = new Set(c.memberIds.map((mid) => state.proposals.get(mid)?.state));
  if (memberStates.size > 1) c.state = "mixed";
  updateCohortContainer(c);
  updateCounts();
}

function onRunCompleted(evt) {
  const s = evt.summary || {};
  const tail = [];
  if (typeof s.proposals_total === "number") tail.push(`${s.proposals_total} total`);
  if (typeof s.proposals_passed === "number") tail.push(`${s.proposals_passed} ✓`);
  if (typeof s.proposals_failed === "number" && s.proposals_failed > 0)
    tail.push(`${s.proposals_failed} ✗`);
  if (typeof s.proposals_unvalidated === "number" && s.proposals_unvalidated > 0)
    tail.push(`${s.proposals_unvalidated} unvalidated`);
  if (typeof s.proposals_shipped === "number" && s.proposals_shipped > 0)
    tail.push(`${s.proposals_shipped} shipped`);
  els.footerTail.textContent = tail.join(" · ");
  // Root-cause clusters — assay 1.6.0+ field. Absent today; we
  // render the section only when the array is non-empty.
  if (Array.isArray(evt.failure_clusters) && evt.failure_clusters.length > 0) {
    renderClusters(evt.failure_clusters);
  }
  for (const p of state.proposals.values()) {
    if (p.state === "pending") {
      p.state = "unvalidated";
      p.conclusion = "unvalidated";
      updateProposalRow(p);
    }
  }
  setStatus("done", "done");
  updateValidateBreakingButton();
}

// --- Rendering ---------------------------------------------------

function renderList() {
  els.proposalList.innerHTML = "";
  const hasRows = state.listOrder.length > 0;
  els.proposalList.hidden = !hasRows;
  els.emptyState.style.display = hasRows ? "none" : "block";

  for (const entry of state.listOrder) {
    if (entry.kind === "proposal") {
      const p = state.proposals.get(entry.id);
      if (!p) continue;
      const row = renderProposalRow(p);
      p.el = row;
      els.proposalList.appendChild(row);
    } else {
      const c = state.cohorts.get(entry.id);
      if (!c) continue;
      const container = renderCohortContainer(c);
      c.el = container;
      els.proposalList.appendChild(container);
    }
  }
  applyFilters();
  updateCounts();
}

function renderProposalRow(p) {
  const li = document.createElement("li");
  li.className = `proposal state-${p.state}`;
  li.dataset.id = p.id;
  li.innerHTML = `
    <span class="proposal-icon"></span>
    <span class="proposal-text">
      <span class="proposal-subject"></span>
      <span class="proposal-version">
        <span class="from"></span>
        <span class="arrow">→</span>
        <span class="to"></span>
      </span>
      <span class="proposal-reason"></span>
    </span>
    <span class="proposal-tier"></span>
    <span class="proposal-duration"></span>
    <span class="proposal-chevron" aria-hidden="true">▸</span>
    <div class="proposal-detail" role="region" aria-label="Proposal detail"></div>
  `;
  li.querySelector(".proposal-subject").textContent = p.subject;
  li.querySelector(".from").textContent = p.from;
  li.querySelector(".to").textContent = p.to;
  updateProposalReason(p, li);
  const tier = li.querySelector(".proposal-tier");
  tier.textContent = p.tier;
  tier.classList.add(`tier-${p.tier}`);
  li.addEventListener("click", (e) => {
    // Ignore clicks on interactive children inside the detail
    // panel (copy buttons, raw-stderr toggle).
    if (e.target.closest("button, a, .detail-stderr")) return;
    toggleExpanded(p);
  });
  return li;
}

function toggleExpanded(p) {
  p.expanded = !p.expanded;
  if (p.expanded) {
    renderDetailPanel(p);
    p.el.classList.add("expanded");
  } else {
    p.el.classList.remove("expanded");
  }
}

function proposalExplanation(p) {
  return p.explanation || inferGithubActionsExplanation(p);
}

function proposalReasonText(p) {
  if (p.failureContext?.summary) {
    const rule = p.failureContext.rule ? ` (${p.failureContext.rule})` : "";
    return `Validation failed: ${p.failureContext.summary}${rule}`;
  }
  if (p.stderrTail && p.state === "failure") {
    const firstLine = String(p.stderrTail).split(/\r?\n/).find((line) => line.trim());
    if (firstLine) return `Validation failed: ${firstLine.trim()}`;
  }
  if (p.state === "success") {
    return "Validated: no regression observed under repo gates.";
  }
  if (p.state === "unvalidated" && p.validationAttempted) {
    const note = firstNote(p);
    return note
      ? `Validation unavailable: ${note}`
      : "Validation unavailable: no repo gate ran for this proposal.";
  }
  const exp = proposalExplanation(p);
  if (exp?.summary) return `Risk: ${exp.summary}`;
  return "";
}

function validationStatusText(p) {
  switch (p.state) {
    case "success": return "validated pass";
    case "failure": return "validated failure";
    case "inprogress": return "validation running";
    case "unvalidated": return "validation unavailable";
    default: return p.validationAttempted ? "validation requested" : "not validated";
  }
}

function firstNote(p) {
  if (!p.notes) return "";
  if (Array.isArray(p.notes)) {
    return String(p.notes.find((note) => String(note).trim()) || "").trim();
  }
  return String(p.notes).trim();
}

function updateProposalReason(p, row = p.el) {
  if (!row) return;
  const reason = row.querySelector(".proposal-reason");
  if (!reason) return;
  const text = proposalReasonText(p);
  reason.textContent = text;
  reason.title = text;
  reason.hidden = !text;
}

function inferGithubActionsExplanation(p) {
  if ((p.ecosystem || "").toLowerCase() !== "github-actions") return null;
  if ((p.tier || "").toLowerCase() !== "breaking") return null;

  const fromMajor = majorFromActionRef(p.from);
  const toMajor = majorFromActionRef(p.to);
  if (fromMajor && toMajor && fromMajor !== toMajor) {
    return {
      summary: `gha: major version changed (${fromMajor} -> ${toMajor}); breaking-by-spec`,
      rule: "gha:major-bump",
      inputs: {
        from_major: fromMajor,
        from_ref: p.from || "",
        to_major: toMajor,
        to_ref: p.to || "",
      },
      decision: "breaking",
      fallback: true,
    };
  }

  return {
    summary: "Classifier metadata was not recorded with this run; rerun analysis with the current assay binary for rule-level evidence.",
    rule: "classifier:metadata-missing",
    inputs: {
      from_ref: p.from || "",
      to_ref: p.to || "",
    },
    decision: p.tier || "breaking",
    fallback: true,
  };
}

function majorFromActionRef(ref) {
  const m = String(ref || "").trim().match(/^v?(\d+)(?:[.\-_]|$)/i);
  return m ? m[1] : null;
}

function renderDetailPanel(p) {
  const panel = p.el.querySelector(".proposal-detail");
  if (!panel) return;
  const lines = [];
  lines.push('<dl class="detail-grid">');
  lines.push(`<dt>ecosystem</dt><dd>${escapeHtml(p.ecosystem || "—")}</dd>`);
  lines.push(`<dt>tier</dt><dd>${escapeHtml(p.tier || "—")}</dd>`);
  lines.push(`<dt>from</dt><dd>${escapeHtml(p.from || "—")}</dd>`);
  lines.push(`<dt>to</dt><dd>${escapeHtml(p.to || "—")}</dd>`);
  if (p.cohort) {
    lines.push(`<dt>cohort</dt><dd>${escapeHtml(p.cohort)}</dd>`);
  }
  if (p.durationMs != null) {
    lines.push(`<dt>duration</dt><dd>${escapeHtml(formatDuration(p.durationMs))}</dd>`);
  }
  if (p.conclusion) {
    lines.push(`<dt>conclusion</dt><dd>${escapeHtml(p.conclusion)}</dd>`);
  }
  if (p.validationAttempted) {
    lines.push(`<dt>validation</dt><dd>${escapeHtml(validationStatusText(p))}</dd>`);
  }
  if (Array.isArray(p.manifestPaths) && p.manifestPaths.length) {
    lines.push(`<dt>manifests</dt><dd>${p.manifestPaths.map(escapeHtml).join("<br>")}</dd>`);
  }
  if (Array.isArray(p.validatedWorkflows) && p.validatedWorkflows.length) {
    lines.push(`<dt>validated workflows</dt><dd>${p.validatedWorkflows.map(escapeHtml).join("<br>")}</dd>`);
  }
  if (Array.isArray(p.ciForgeRunIds) && p.ciForgeRunIds.length) {
    lines.push(`<dt>ci-forge runs</dt><dd>${p.ciForgeRunIds.map(escapeHtml).join("<br>")}</dd>`);
  }
  if (p.notes) {
    const notes = Array.isArray(p.notes) ? p.notes : [p.notes];
    lines.push(`<dt>notes</dt><dd>${notes.map(escapeHtml).join("<br>")}</dd>`);
  }
  lines.push("</dl>");

  const exp = proposalExplanation(p);
  if (exp) {
    const fallbackClass = exp.fallback ? " classifier-fallback" : "";
    lines.push(`<div class="detail-section classifier-section${fallbackClass}">`);
    lines.push("<h4>Classification</h4>");
    lines.push(`<div class="findings-summary classifier-summary">${escapeHtml(exp.summary || "")} <span class="rule">${escapeHtml(exp.rule || "")}</span></div>`);
    if (exp.inputs && typeof exp.inputs === "object") {
      const entries = Object.entries(exp.inputs).sort(([a], [b]) => a.localeCompare(b));
      if (entries.length) {
        lines.push('<dl class="detail-grid classifier-inputs">');
        for (const [key, value] of entries) {
          lines.push(`<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(String(value))}</dd>`);
        }
        lines.push("</dl>");
      }
    }
    if (exp.decision) {
      lines.push(`<p class="classifier-decision">decision: ${escapeHtml(exp.decision)}</p>`);
    }
    lines.push("</div>");
  }

  // failure_context structured findings (1.6.0+). When absent,
  // we fall through to the raw stderr_tail render.
  if (p.failureContext) {
    const fc = p.failureContext;
    lines.push('<div class="detail-section">');
    lines.push("<h4>Findings</h4>");
    lines.push(`<div class="findings-summary">${escapeHtml(fc.summary || "")} <span class="rule">${escapeHtml(fc.rule || "")}</span></div>`);
    if (Array.isArray(fc.findings) && fc.findings.length) {
      lines.push('<ul class="findings">');
      for (const f of fc.findings) {
        const loc = formatFindingLoc(f);
        lines.push(`<li class="finding">
          ${f.code ? `<span class="finding-code">${escapeHtml(f.code)}</span>` : '<span class="finding-code">finding</span>'}
          <span class="finding-body">
            <span class="finding-message">${escapeHtml(f.message || "")}</span>
            ${loc ? `<span class="finding-loc">${escapeHtml(loc)}</span>` : ""}
          </span>
        </li>`);
      }
      lines.push("</ul>");
    }
    if (p.stderrTail) {
      lines.push(`<button class="link-btn toggle-raw" data-toggle="raw-${escapeAttr(p.id)}" type="button">Show raw stderr</button>`);
      lines.push(`<pre class="detail-stderr" id="raw-${escapeAttr(p.id)}" hidden></pre>`);
    }
    lines.push("</div>");
  } else if (p.stderrTail || p.state === "failure") {
    // No structured failure_context but the proposal failed —
    // render raw stderr_tail if we have one. When even that is
    // missing (today's 1.5.0 case), say so plainly rather than
    // leaving the panel empty.
    lines.push('<div class="detail-section">');
    lines.push("<h4>stderr <button class=\"link-btn copy-stderr\" type=\"button\">copy</button></h4>");
    if (p.stderrTail) {
      lines.push(`<pre class="detail-stderr">${escapeHtml(p.stderrTail)}</pre>`);
    } else {
      lines.push(`<p style="margin:0;color:var(--text-faint);font-size:11.5px">No stderr captured by this assay version.</p>`);
    }
    lines.push("</div>");
  }

  panel.innerHTML = lines.join("\n");

  // Wire up dynamic buttons inside the panel.
  const rawToggle = panel.querySelector(".toggle-raw");
  if (rawToggle) {
    rawToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetId = rawToggle.getAttribute("data-toggle");
      const pre = document.getElementById(targetId);
      if (pre) {
        if (pre.hidden) {
          pre.textContent = p.stderrTail || "";
          pre.hidden = false;
          rawToggle.textContent = "Hide raw stderr";
        } else {
          pre.hidden = true;
          rawToggle.textContent = "Show raw stderr";
        }
      }
    });
  }
  panel.querySelectorAll(".copy-stderr").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const ok = await clipboardWrite(p.stderrTail || "");
      toast(ok ? "Copied stderr to clipboard" : "Copy failed");
    });
  });
}

function formatFindingLoc(f) {
  if (!f.file) return "";
  let s = f.file;
  if (f.line != null) {
    s += `:${f.line}`;
    if (f.column != null) s += `:${f.column}`;
  }
  return s;
}

function renderCohortContainer(c) {
  const li = document.createElement("li");
  li.className = `cohort state-${c.state}`;
  li.dataset.cohort = c.id;
  li.innerHTML = `
    <div class="cohort-header">
      <span class="cohort-icon"></span>
      <span class="cohort-name"></span>
      <span class="cohort-members-summary"></span>
      <span class="cohort-lockstep-tag">lockstep · ${c.memberIds.length}</span>
    </div>
    <ol class="cohort-members"></ol>
  `;
  li.querySelector(".cohort-name").textContent = c.display;
  const summary = c.memberIds
    .map((mid) => state.proposals.get(mid)?.subject)
    .filter(Boolean)
    .join(", ");
  li.querySelector(".cohort-members-summary").textContent = summary;
  const membersList = li.querySelector(".cohort-members");
  c.memberIds.forEach((mid) => {
    const p = state.proposals.get(mid);
    if (!p) return;
    const row = renderProposalRow(p);
    p.el = row;
    membersList.appendChild(row);
  });
  return li;
}

function updateProposalRow(p) {
  if (!p.el) return;
  const wasExpanded = p.el.classList.contains("expanded");
  p.el.className = `proposal state-${p.state}${wasExpanded ? " expanded" : ""}`;
  const dur = p.el.querySelector(".proposal-duration");
  if (dur) dur.textContent = p.durationMs != null ? formatDuration(p.durationMs) : "";
  updateProposalReason(p);
  applyFiltersToRow(p);
}

function updateCohortContainer(c) {
  if (!c.el) return;
  c.el.className = `cohort state-${c.state}`;
  applyFiltersToCohort(c);
}

function updateCounts() {
  let discovered = 0, validating = 0, passed = 0, failed = 0;
  for (const p of state.proposals.values()) {
    discovered++;
    switch (p.state) {
      case "inprogress": validating++; break;
      case "success": passed++; break;
      case "failure": failed++; break;
    }
  }
  els.countDiscovered.textContent = `${discovered} discovered`;
  els.countValidating.textContent = `${validating} validating`;
  els.countPassed.textContent = `${passed} passed`;
  els.countFailed.textContent = `${failed} failed`;
  updateValidateBreakingButton();
}

function updateValidateBreakingButton() {
  if (!els.validateBreaking) return;
  const hasBreaking = Array.from(state.proposals.values()).some(
    (p) => p.tier === "breaking" && (p.state === "pending" || p.state === "unvalidated")
  );
  const isBreakingValidation = state.lastArgs?.onlyBreaking && state.lastArgs?.mode === "validate";
  els.validateBreaking.hidden = state.runActive || !hasBreaking || isBreakingValidation;
}

// --- Clusters ---------------------------------------------------

function renderClusters(clusters) {
  els.clusters.hidden = false;
  els.clustersList.innerHTML = "";
  for (const cluster of clusters) {
    const li = document.createElement("li");
    li.className = "cluster";
    const rep = cluster.representative || {};
    const findings = Array.isArray(rep.findings) ? rep.findings : [];
    const findingHtml = findings.length
      ? `<ul class="findings">${findings.map((f) => `
          <li class="finding">
            ${f.code ? `<span class="finding-code">${escapeHtml(f.code)}</span>` : '<span class="finding-code">finding</span>'}
            <span class="finding-body">
              <span class="finding-message">${escapeHtml(f.message || "")}</span>
              ${formatFindingLoc(f) ? `<span class="finding-loc">${escapeHtml(formatFindingLoc(f))}</span>` : ""}
            </span>
          </li>`).join("")}</ul>`
      : "";
    li.innerHTML = `
      <div class="cluster-head">
        <span class="cluster-count">${cluster.proposal_ids.length} proposals</span>
        <span class="cluster-fp">fingerprint: ${escapeHtml(cluster.fingerprint || "")}</span>
      </div>
      <div class="cluster-members">${cluster.proposal_ids.map(escapeHtml).join(", ")}</div>
      <div class="cluster-rep">
        <div class="findings-summary">${escapeHtml(rep.summary || "")} <span class="rule">${escapeHtml(rep.rule || "")}</span></div>
        ${findingHtml}
      </div>
    `;
    els.clustersList.appendChild(li);
  }
}

// --- Filters + search ------------------------------------------

function setFilter(f) {
  // ae-segmented owns its own active-cell styling; we only track + filter.
  state.filter = f;
  applyFilters();
}

function applyFilters() {
  for (const p of state.proposals.values()) applyFiltersToRow(p);
  for (const c of state.cohorts.values()) applyFiltersToCohort(c);
}

function rowMatchesFilters(p) {
  if (state.search) {
    const subj = (p.subject || "").toLowerCase();
    if (!subj.includes(state.search)) return false;
  }
  if (state.filter === "all") return true;
  const [kind, val] = state.filter.split(":");
  if (kind === "tier") return p.tier === val;
  if (kind === "state") return p.state === val;
  return true;
}

function applyFiltersToRow(p) {
  if (!p.el) return;
  const match = rowMatchesFilters(p);
  p.el.classList.toggle("hidden-by-filter", !match);
}

function applyFiltersToCohort(c) {
  if (!c.el) return;
  // Cohort visible if any member matches.
  const anyMatch = c.memberIds.some((mid) => {
    const m = state.proposals.get(mid);
    return m && rowMatchesFilters(m);
  });
  c.el.classList.toggle("hidden-by-filter", !anyMatch);
}

// --- Helpers ----------------------------------------------------

function mapConclusion(conclusion) {
  switch (conclusion) {
    case "success": return "success";
    case "failure": return "failure";
    case "unvalidated": return "unvalidated";
    default: return "failure";
  }
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms} ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)} s`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s - m * 60);
  return `${m}m ${rem}s`;
}

const STATUS_TONE = { idle: "neutral", running: "accent", done: "success", error: "danger" };
function setStatus(label, kind) {
  els.runStatus.textContent = label;
  els.runStatus.dataset.kind = kind || "idle";
  // run-status is an <ae-tag>; tone drives its color.
  els.runStatus.setAttribute("tone", STATUS_TONE[kind] || "neutral");
}

function resetRunState() {
  state.proposals.clear();
  state.cohorts.clear();
  state.listOrder = [];
  els.proposalList.innerHTML = "";
  els.proposalList.hidden = true;
  els.emptyState.style.display = "block";
  els.emptyState.querySelector("p").textContent = "Sweep started… waiting for assay to surface proposals.";
  els.footerTail.textContent = "";
  els.clusters.hidden = true;
  els.clustersList.innerHTML = "";
  els.filterbar.hidden = true;
  updateCounts();
}

function showErrorBanner(text, exitCode) {
  els.errorBanner.hidden = false;
  els.errorBannerBody.textContent = exitCode != null
    ? `exit ${exitCode}\n\n${text}`
    : text;
}

function hideErrorBanner() {
  els.errorBanner.hidden = true;
  els.errorBannerBody.textContent = "";
}

function toast(message) {
  // Aegis toast() self-portals into document.body and auto-dismisses.
  aeToast({ message, duration: 1800 });
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s) {
  return String(s).replace(/[^a-zA-Z0-9_-]/g, "_");
}

// --- Wireup -----------------------------------------------------

// ae-input fires `ae-input`/`ae-change`; ae-select + ae-checkbox fire
// `ae-change`. Listen for both so the CLI preview stays live.
[els.repo, els.ecosystem, els.mode, els.failFast].forEach((el) => {
  el.addEventListener("ae-input", updateCliPreview);
  el.addEventListener("ae-change", updateCliPreview);
});

els.browse.addEventListener("click", async () => {
  try {
    const { invoke } = tauri();
    const picked = await invoke("pick_repo");
    if (typeof picked === "string" && picked.length > 0) {
      els.repo.value = picked;
      updateCliPreview();
    }
  } catch (err) {
    console.error("pick_repo failed", err);
    setStatus(`browse failed: ${err}`, "error");
  }
});

els.start.addEventListener("click", () => startRun());

els.runAgain.addEventListener("click", () => {
  if (state.lastArgs) startRun(state.lastArgs);
});

els.validateBreaking.addEventListener("click", validateBreakingUpgrades);

// Status filter (ae-segmented — single-select radiogroup).
const statusFilter = $("status-filter");
if (statusFilter) {
  statusFilter.addEventListener("ae-change", (e) => {
    setFilter(e.detail?.value ?? statusFilter.value ?? "all");
  });
}

els.search.addEventListener("ae-input", (e) => {
  state.search = String(e.detail?.value ?? els.search.value ?? "").trim().toLowerCase();
  applyFilters();
});
els.search.addEventListener("ae-clear", () => {
  state.search = "";
  applyFilters();
});

// Error banner copy + dismiss (our own non-destructive dismiss — see index.html).
els.errorBannerCopy.addEventListener("click", async () => {
  const ok = await clipboardWrite(els.errorBannerBody.textContent || "");
  toast(ok ? "Copied to clipboard" : "Copy failed");
});
els.errorBannerDismiss.addEventListener("click", hideErrorBanner);

// Recents clear.
els.recentsClear.addEventListener("click", async () => {
  state.recents = [];
  await persistRecents();
  renderRecents();
});

// Theme: header quick-toggle (light↔dark) + live brand picker.
els.themeToggle.addEventListener("click", cycleTheme);
els.themeBrand.addEventListener("ae-change", (e) => {
  selectBrand(e.detail?.value ?? els.themeBrand.value ?? "default");
});
// Keep the header icon honest when the OS scheme flips under "System".
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (state.prefs.themeBrand === "default" && state.prefs.themeVariant == null) {
    updateThemeIcon();
  }
});

// Settings drawer (ae-drawer is controlled via the `open` property; it closes
// itself on backdrop/escape and fires ae-close).
function openSettings() {
  applyPrefsToSettingsPanel();
  els.settingsOverlay.open = true;
}
function closeSettings() { els.settingsOverlay.open = false; }
els.settingsBtn.addEventListener("click", openSettings);
els.openSettingsInline.addEventListener("click", openSettings);
els.settingsClose.addEventListener("click", closeSettings);
els.settingsSave.addEventListener("click", async () => {
  readPrefsFromSettingsPanel();
  await persistPrefs();
  updateCliPreview();
  closeSettings();
  toast("Settings saved");
});

// --- Bootstrap --------------------------------------------------

window.addEventListener("DOMContentLoaded", async () => {
  try {
    state.store = await openStore();
    const savedPrefs = await state.store.get(STORE_KEY_PREFS);
    if (savedPrefs && typeof savedPrefs === "object") {
      Object.assign(state.prefs, savedPrefs);
      // Pre-Aegis builds stored a single prefs.theme string
      // ('system'|'dark'|'light'). Map it onto the new brand/variant axes
      // (all under the default brand) so an upgrading user keeps their choice.
      if (typeof savedPrefs.theme === "string" && !savedPrefs.themeBrand) {
        state.prefs.themeBrand = "default";
        state.prefs.themeVariant = savedPrefs.theme === "system" ? null : savedPrefs.theme;
      }
      delete state.prefs.theme;
    }
    const savedRecents = await state.store.get(STORE_KEY_RECENTS);
    if (Array.isArray(savedRecents)) {
      state.recents = savedRecents.slice(0, RECENTS_CAP);
    }
  } catch (err) {
    console.warn("store init failed:", err);
  }
  buildThemePicker();
  applyThemeSelection();
  applyPrefsToSettingsPanel();
  renderRecents();
  updateCliPreview();
  try {
    startEventListener();
  } catch (err) {
    console.error("could not subscribe to assay://event", err);
    setStatus(`init failed: ${err}`, "error");
  }
});
