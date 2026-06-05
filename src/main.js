// assay-gui frontend — Direction-B redesign.
//
// Two phases driven by a small state machine:
//   • setup — a guided 4-step wizard (Repository → Scope → Action → Review)
//     that assembles a run config and translates it into one plain-English
//     "what will happen" summary plus the exact `assay` command.
//   • run   — the live validation sweep + results: proposals stream pending →
//     validating → pass/fail, lockstep cohorts render as one unit, failures
//     show findings + a suggested fix, and the run ends with a result banner,
//     an "Apply N passing" CTA, and root-cause clusters.
//
// Vanilla JS — no framework, no bundler. The Rust backend forwards each NDJSON
// line wrapped in `GuiEvent::Raw { line }`; we parse the embedded event and
// mutate the DOM in place.
//
// Theming: the whole UI wears any Aegis v2 brand × variant via the in-app theme
// picker (Settings › Appearance) and the header light/dark quick-toggle. Every
// color routes through `--ae-*` tokens, so a theme switch repaints everything —
// including the bespoke sweep visualization no generic component models.
//
// Schema-forward safety: `failure_context`, `failure_clusters`, and any
// suggested-`fix` field are additive (assay 1.6.0+) — absent on older binaries.
// Their renderers run only when the fields are present; never warn, never crash.

// Aegis v2 design system. The bare import registers every ae-* custom element;
// the named imports drive the theme picker. Vendored, self-contained (lit
// inlined) — see vendor/aegis/VENDORED.md.
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

// --- Domain constants --------------------------------------------

// Ecosystem filter options (maps to assay `--ecosystem`).
const ECOS = [
  { value: "all", label: "all" },
  { value: "cargo", label: "cargo" },
  { value: "npm", label: "npm" },
  { value: "github-actions", label: "gha" },
];

// Risk-laddered actions. `value` is the GUI/StartArgs `mode`; `report` is
// assay's dry-run (no flag). risk 1..3 drives the visible risk dots.
const ACTIONS = [
  {
    value: "report", t: "Just report", flag: "dry-run", risk: 1, rl: "Nothing changes",
    d: "List every available upgrade and how safe each one looks. Read-only — nothing on disk is touched.",
  },
  {
    value: "validate", t: "Validate with CI", flag: "--validate", risk: 1, rl: "Read-only",
    d: "Run your real CI on each upgrade to prove it stays green. Still nothing is committed.",
  },
  {
    value: "apply-local", t: "Commit to this branch", flag: "--apply-local", risk: 3, rl: "Writes to your branch",
    d: "Apply every upgrade that passes CI and commit it straight to your current branch.",
  },
  {
    value: "apply-pr", t: "Open a pull request", flag: "--apply-pr", risk: 2, rl: "Pushes a branch",
    d: "Apply passing upgrades on a fresh branch, push it, and open a PR for you to review.",
  },
];

// Upgrade tiers (assay's classifier names) the Scope step can include/exclude.
// assay has no `--skip-tier`, so tier scoping is applied client-side at NDJSON
// ingestion — except the {breaking only} case, which maps to `--only-breaking`
// so the validator queue is genuinely narrowed.
const TIERS = [
  { key: "compatible", t: "Compatible upgrades", d: "Minor & patch bumps expected to be drop-in safe.", chip: ["green", "low risk"] },
  { key: "breaking", t: "Breaking upgrades", d: "Major bumps that may need code changes. Worth validating.", chip: ["red", "needs care"] },
  { key: "lockfile-only", t: "Lockfile-only changes", d: "Transitive pins with no manifest edit.", chip: ["blue", "trivial"] },
];

const WIZ_STEPS = [
  { key: "repo", title: "Repository", sub: (c) => c.repo || "pick a repo" },
  { key: "scope", title: "Scope", sub: (c) => scopeSubLabel(c) },
  { key: "action", title: "Action", sub: (c) => actionFor(c.action).t },
  { key: "review", title: "Review", sub: () => "confirm & run" },
];

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

/** Open (or create) the persistent store and return a minimal { get, set, save }
 * shim. Degrades to no-op (no persistence) if the store plugin is unreachable. */
async function openStore() {
  try {
    const { invoke } = tauri();
    const rid = await invoke("plugin:store|load", { path: STORE_PATH, options: { autoSave: true } });
    return {
      async get(key) {
        try {
          const [value, exists] = await invoke("plugin:store|get", { rid, key });
          return exists ? value : null;
        } catch { return null; }
      },
      async set(key, value) { try { await invoke("plugin:store|set", { rid, key, value }); } catch { /* noop */ } },
      async save() { try { await invoke("plugin:store|save", { rid }); } catch { /* noop */ } },
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
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

// --- DOM refs ----------------------------------------------------

const $ = (id) => document.getElementById(id);
const els = {
  // Header
  brand: $("brand"),
  stepIndicator: $("step-indicator"),
  runStatus: $("run-status"),
  themeToggle: $("theme-toggle"),
  themeIcon: $("theme-icon"),
  settingsBtn: $("settings-btn"),
  // Error banner (ae-alert)
  errorBanner: $("error-banner"),
  errorBannerBody: $("error-banner-body"),
  errorBannerCopy: $("error-banner-copy"),
  errorBannerDismiss: $("error-banner-dismiss"),
  // Phases
  setupView: $("setup-view"),
  runView: $("run-view"),
  wizard: $("setup-view"),
  wizardRail: $("wizard-rail"),
  wizardContent: $("wizard-content"),
  wizBack: $("wiz-back"),
  wizNext: $("wiz-next"),
  // Run view
  runTitle: $("run-title"),
  countDiscovered: $("count-discovered"),
  countValidating: $("count-validating"),
  countPassed: $("count-passed"),
  countFailed: $("count-failed"),
  validateBreaking: $("validate-breaking"),
  runAgain: $("run-again"),
  newAnalysis: $("new-analysis"),
  progressbar: $("progressbar"),
  progressFill: $("progress-fill"),
  resultBannerMount: $("result-banner-mount"),
  filterbar: $("filterbar"),
  statusFilter: $("status-filter"),
  search: $("search"),
  emptyState: $("empty-state"),
  proposalList: $("proposal-list"),
  clusters: $("clusters"),
  clustersList: $("clusters-list"),
  // Settings drawer (ae-drawer)
  settingsOverlay: $("settings-overlay"),
  settingsClose: $("settings-close"),
  settingsMemberGate: $("settings-member-gate"),
  settingsNoShaPin: $("settings-no-sha-pin"),
  density: $("density"),
  railLayout: $("rail-layout"),
  themeBrand: $("theme-brand"),
  themeVariants: $("theme-variants"),
  settingsSave: $("settings-save"),
};

// --- State -------------------------------------------------------

function defaultConfig() {
  return {
    repo: "",
    ecosystem: "all",
    tiers: { compatible: true, breaking: true, "lockfile-only": true },
    action: "validate",
    executor: "docker",
    threads: 4,
    failFast: false,
  };
}

const state = {
  // Phase machine.
  phase: "setup", // 'setup' | 'run'
  step: 0,
  maxStep: 0,
  config: defaultConfig(),
  // Run.
  proposals: new Map(),
  cohorts: new Map(),
  listOrder: [],
  runActive: false,
  lastArgs: null,
  /** Tier scope applied to the active run (client-side ingestion filter). */
  runScope: null,
  /** True when the run is a report (dry-run) — toggles count visibility etc. */
  runIsReport: false,
  filter: "all",
  search: "",
  /** Persisted prefs: leftover behaviour flags + appearance. */
  prefs: {
    memberGate: false,
    noShaPinProposals: false,
    density: "regular",
    railLayout: "side",
    // Aegis theme selection.
    themeBrand: "default",
    themeVariant: null,
  },
  recents: [], // Array<{ path, lastUsedAt }>
  store: null,
  /** Review step: exact-command box expanded? */
  cmdOpen: false,
};

// --- Theme -------------------------------------------------------

function currentSelection() {
  return { theme: state.prefs.themeBrand || "default", variant: state.prefs.themeVariant ?? null };
}
function applyThemeSelection() {
  aeApplyTheme(currentSelection());
  updateThemeIcon();
}
function updateThemeIcon() {
  if (!els.themeIcon) return;
  const sel = currentSelection();
  const v = getThemeVariant(sel.theme, resolveEffectiveVariant(sel));
  els.themeIcon.textContent = v && v.isDark ? "☾" : "☀";
}
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

function buildThemePicker() {
  if (!els.themeBrand) return;
  els.themeBrand.innerHTML = THEME_REGISTRY.map(
    (b) => `<ae-option value="${escapeAttr(b.id)}">${escapeHtml(b.label)}</ae-option>`,
  ).join("");
  els.themeBrand.value = state.prefs.themeBrand || "default";
  renderVariantChips();
}
function syncThemePicker() {
  if (els.themeBrand) els.themeBrand.value = state.prefs.themeBrand || "default";
  renderVariantChips();
}
function renderVariantChips() {
  if (!els.themeVariants) return;
  const brand = getThemeBrand(state.prefs.themeBrand || "default");
  if (!brand) { els.themeVariants.innerHTML = ""; return; }
  const effective = resolveEffectiveVariant({ theme: brand.id, variant: state.prefs.themeVariant ?? null });
  const chips = [];
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
function selectBrand(brandId) {
  const brand = getThemeBrand(brandId) || getThemeBrand("default");
  state.prefs.themeBrand = brand.id;
  state.prefs.themeVariant = brand.followsSystem ? null : brand.defaultVariant;
  applyThemeSelection();
  renderVariantChips();
  persistPrefs();
}
function selectVariant(variantId) {
  state.prefs.themeVariant = variantId ? variantId : null;
  applyThemeSelection();
  renderVariantChips();
  persistPrefs();
}

// --- Config helpers ----------------------------------------------

function actionFor(value) { return ACTIONS.find((a) => a.value === value) || ACTIONS[0]; }

/** Map the wizard `action` to the StartArgs/CLI `mode` (report → dry-run). */
function actionToMode(action) { return action === "report" ? "dry-run" : action; }

function selectedTierKeys(c = state.config) {
  return TIERS.map((t) => t.key).filter((k) => c.tiers[k]);
}

/** True when exactly the breaking tier is selected — maps to `--only-breaking`. */
function onlyBreakingScope(c = state.config) {
  const sel = selectedTierKeys(c);
  return sel.length === 1 && sel[0] === "breaking";
}

function ecoWords(c = state.config) {
  return c.ecosystem === "all" ? "all ecosystems" : c.ecosystem;
}

function scopeSubLabel(c = state.config) {
  const n = selectedTierKeys(c).length;
  return `${c.ecosystem === "all" ? "all" : c.ecosystem} · ${n}/3 types`;
}

/** One honest sentence describing the run. Unlike the prototype's mock, we
 * can't know real upgrade counts before assay runs, so we describe scope in
 * words; the live counts appear in the run view once they stream in. */
function planSentenceHtml(c = state.config) {
  const ecos = `<b>${escapeHtml(ecoWords(c))}</b>`;
  const sandbox = c.executor === "docker" ? "Docker sandbox" : "host shell";
  switch (c.action) {
    case "report":
      return `Scan the available upgrades across ${ecos} and report which are safe. <b style="color:var(--green)">Nothing</b> on disk changes.`;
    case "validate":
      return `Run your CI on the in-scope upgrades across ${ecos} inside a <b style="color:var(--blue)">${sandbox}</b>, ${c.threads} at a time. <b style="color:var(--green)">Nothing is committed.</b>`;
    case "apply-local":
      return `Validate the in-scope upgrades across ${ecos}, then <b style="color:var(--red)">commit every passing upgrade</b> directly to your current branch.`;
    case "apply-pr":
      return `Validate the in-scope upgrades across ${ecos}, apply the passing ones on a new branch, and <b style="color:var(--accent)">open a pull request</b>.`;
    default:
      return "";
  }
}

function willHappenVerb(c = state.config) {
  switch (c.action) {
    case "report": return "report only";
    case "validate": return "run CI";
    case "apply-pr": return "open a PR";
    case "apply-local": return "commit greens";
    default: return "";
  }
}

/** Assemble the exact `assay` argv for the Review-step command box. */
function buildCommandArgs(c = state.config) {
  const parts = ["assay", "analyze", "--format", "ndjson"];
  if (c.repo.trim()) parts.push("--repo", quote(c.repo.trim()));
  if (c.ecosystem !== "all") parts.push("--ecosystem", c.ecosystem);
  const mode = actionToMode(c.action);
  if (mode === "validate") parts.push("--validate");
  else if (mode === "apply-local") parts.push("--apply-local");
  else if (mode === "apply-pr") parts.push("--apply-pr");
  if (mode !== "dry-run") {
    parts.push("--executor", c.executor);
    // Host validation runs newly-bumped build scripts unsandboxed; assay
    // requires this explicit acknowledgment alongside `--executor host`.
    if (c.executor === "host") parts.push("--unsafe-host-validation");
  }
  if (c.threads) parts.push("--threads", String(c.threads));
  if (c.failFast) parts.push("--fail-fast");
  if (onlyBreakingScope(c)) parts.push("--only-breaking");
  if (state.prefs.memberGate) parts.push("--member-gate");
  if (state.prefs.noShaPinProposals) parts.push("--no-sha-pin-proposals");
  return parts;
}

/** Build the StartArgs payload the Rust `start_analysis` command expects. */
function buildStartArgs(overrides = {}) {
  const c = state.config;
  return {
    repo: c.repo.trim(),
    ecosystem: c.ecosystem,
    mode: actionToMode(c.action),
    threads: c.threads || null,
    failFast: c.failFast,
    memberGate: state.prefs.memberGate,
    executor: c.executor,
    noShaPinProposals: state.prefs.noShaPinProposals,
    onlyBreaking: onlyBreakingScope(c),
    ...overrides,
  };
}

function quote(s) { return /\s/.test(s) ? `"${s}"` : s; }

/** Mutate config + re-render. `rerender:false` updates only the rail + footer
 * (used by the repo text input so it keeps focus). */
function setConfig(patch, { rerender = true } = {}) {
  Object.assign(state.config, patch);
  if (rerender) renderWizard();
  else { renderRail(); updateFooter(); }
}

// ========================================================================
// WIZARD
// ========================================================================

function renderWizard() {
  renderRail();
  renderStepBody();
  updateFooter();
  syncTopbar();
}

function renderRail() {
  const c = state.config;
  const layout = state.prefs.railLayout === "top" ? "top" : "side";
  els.wizard.dataset.rail = layout;
  const steps = WIZ_STEPS.map((s, i) => {
    const done = i < state.step;
    const cur = i === state.step;
    const clickable = i <= state.maxStep;
    const cls = ["wiz-step", done ? "done" : "", cur ? "cur" : "", clickable ? "" : "upcoming"]
      .filter(Boolean).join(" ");
    const marker = done ? "✓" : String(i + 1);
    const sep = layout === "top" && i > 0 ? `<span class="step-sep" aria-hidden="true">›</span>` : "";
    return `${sep}<button class="${cls}" data-step="${i}" type="button"
        ${clickable ? "" : 'aria-disabled="true"'} ${cur ? 'aria-current="step"' : ""}>
        <span class="num" aria-hidden="true">${marker}</span>
        <span class="meta">
          <span class="t">${escapeHtml(s.title)}</span>
          <span class="s">${escapeHtml(s.sub(c))}</span>
        </span>
      </button>`;
  }).join("");

  const foot = `<div class="rail-foot">
      <b>Will happen:</b> ${escapeHtml(willHappenVerb(c))} on
      <span class="accent">in-scope upgrades</span> across ${escapeHtml(ecoWords(c))}.
    </div>`;

  els.wizardRail.innerHTML = steps + (layout === "side" ? foot : "");
  els.wizardRail.querySelectorAll(".wiz-step").forEach((btn) => {
    const i = Number(btn.dataset.step);
    if (i > state.maxStep) return;
    btn.addEventListener("click", () => goToStep(i));
  });
}

function renderStepBody() {
  const body = [bodyRepo, bodyScope, bodyAction, bodyReview][state.step];
  els.wizardContent.innerHTML = `<div class="wizard-content-inner fade-up">${body()}</div>`;
  [wireRepo, wireScope, wireAction, wireReview][state.step]();
}

function updateFooter() {
  els.wizBack.disabled = state.step === 0;
  const last = state.step === WIZ_STEPS.length - 1;
  els.wizNext.textContent = last ? "▶ Start analysis" : "Continue →";
  els.wizNext.disabled = !canAdvance();
}

function canAdvance() {
  if (state.step === 0) return !!state.config.repo.trim();
  return true;
}

function goToStep(i) {
  if (i < 0 || i > state.maxStep) return;
  state.step = i;
  renderWizard();
}
function wizNext() {
  if (!canAdvance()) return;
  if (state.step < WIZ_STEPS.length - 1) {
    state.step += 1;
    state.maxStep = Math.max(state.maxStep, state.step);
    renderWizard();
  } else {
    startRun();
  }
}
function wizBack() {
  if (state.step === 0) return;
  state.step -= 1;
  renderWizard();
}

// ---- Step 1: Repository ----------------------------------------

function bodyRepo() {
  const c = state.config;
  const note = c.repo.trim()
    ? `<div class="repo-note"><span class="ok" aria-hidden="true">✓</span>
         <span>assay will scan manifests in <span class="mono">${escapeHtml(c.repo.trim())}</span> — it never edits anything here.</span></div>`
    : "";
  const recents = state.recents.length
    ? `<div class="recents">
         <div class="rh"><span class="eyebrow">Recent</span></div>
         <ul class="recents-list">${state.recents.map(recentHtml).join("")}</ul>
       </div>`
    : "";
  return `
    <h2 class="step-h">Which repository should assay check?</h2>
    <p class="step-sub">Point it at a local clone. assay reads your manifests and lockfiles — it never edits anything here.</p>
    <div class="repo-row">
      <ae-input id="repo-input" class="repo-input" placeholder="~/path/to/repo" spellcheck="false" value="${escapeAttr(c.repo)}">
        <span slot="start" aria-hidden="true" style="color:var(--accent)">▸</span>
      </ae-input>
      <ae-button id="repo-browse" variant="secondary">Browse…</ae-button>
    </div>
    <div id="repo-note">${note}</div>
    ${recents}`;
}

function recentHtml(r) {
  return `<li class="recent" data-path="${escapeAttr(r.path)}" role="button" tabindex="0" title="${escapeAttr(r.path)}">
      <span class="ico" aria-hidden="true">▸</span>
      <span class="path">${escapeHtml(r.path)}</span>
      <span class="when">${escapeHtml(relativeTime(r.lastUsedAt))}</span>
      <button class="recent-remove" type="button" aria-label="remove ${escapeAttr(r.path)}">×</button>
    </li>`;
}

function wireRepo() {
  const input = $("repo-input");
  const browse = $("repo-browse");
  if (input) {
    const onInput = (e) => {
      const v = String(e.detail?.value ?? input.value ?? "");
      setConfig({ repo: v }, { rerender: false });
      const note = $("repo-note");
      if (note) {
        note.innerHTML = v.trim()
          ? `<div class="repo-note"><span class="ok" aria-hidden="true">✓</span><span>assay will scan manifests in <span class="mono">${escapeHtml(v.trim())}</span> — it never edits anything here.</span></div>`
          : "";
      }
    };
    input.addEventListener("ae-input", onInput);
    input.addEventListener("ae-change", onInput);
    input.addEventListener("ae-clear", () => onInput({ detail: { value: "" } }));
  }
  if (browse) {
    browse.addEventListener("click", async () => {
      try {
        const { invoke } = tauri();
        const picked = await invoke("pick_repo");
        if (typeof picked === "string" && picked.length > 0) setConfig({ repo: picked });
      } catch (err) {
        console.error("pick_repo failed", err);
        toast(`Browse failed: ${err}`);
      }
    });
  }
  els.wizardContent.querySelectorAll(".recent").forEach((li) => {
    const path = li.dataset.path;
    li.addEventListener("click", (e) => {
      if (e.target.closest(".recent-remove")) return;
      setConfig({ repo: path });
    });
    li.addEventListener("keydown", (e) => {
      if (e.target.closest(".recent-remove")) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setConfig({ repo: path }); }
    });
    const rm = li.querySelector(".recent-remove");
    if (rm) rm.addEventListener("click", (e) => {
      e.stopPropagation();
      state.recents = state.recents.filter((x) => x.path !== path);
      persistRecents();
      renderStepBody();
    });
  });
}

// ---- Step 2: Scope ---------------------------------------------

function bodyScope() {
  const c = state.config;
  const ecoBtns = ECOS.map((e) => `<ae-segmented-item value="${escapeAttr(e.value)}">${escapeHtml(e.label)}</ae-segmented-item>`).join("");
  const rows = TIERS.map((t) => {
    const on = !!c.tiers[t.key];
    return `<div class="checkrow ${on ? "on" : ""}" data-tier="${escapeAttr(t.key)}" role="checkbox" aria-checked="${on}" tabindex="0">
        <span class="cbox" aria-hidden="true">✓</span>
        <span class="ck-main">
          <span class="t">${escapeHtml(t.t)} <span class="scope-chip ${t.chip[0]}">${escapeHtml(t.chip[1])}</span></span>
          <span class="d">${escapeHtml(t.d)}</span>
        </span>
      </div>`;
  }).join("");
  const breakingOnly = onlyBreakingScope(c)
    ? `<div class="repo-note" style="margin-top:16px"><span class="ok" aria-hidden="true">⚡</span><span>Breaking-only scope — assay runs with <span class="mono">--only-breaking</span> so the validator queue skips everything else.</span></div>`
    : "";
  return `
    <h2 class="step-h">What should it look at?</h2>
    <p class="step-sub">Narrow the sweep to the ecosystems and risk levels you care about.
      <span class="help" title="Anything you exclude here is skipped before validation." aria-label="Anything you exclude here is skipped before validation.">?</span></p>
    <div class="scope-eco-row">
      <span class="eyebrow">Ecosystem</span>
      <ae-segmented id="scope-eco" value="${escapeAttr(c.ecosystem)}" aria-label="Ecosystem">${ecoBtns}</ae-segmented>
    </div>
    <span class="eyebrow" style="display:block;margin-bottom:10px">Upgrade types to include</span>
    ${rows}
    ${breakingOnly}`;
}

function wireScope() {
  const eco = $("scope-eco");
  if (eco) eco.addEventListener("ae-change", (e) => setConfig({ ecosystem: e.detail?.value ?? eco.value ?? "all" }));
  els.wizardContent.querySelectorAll(".checkrow").forEach((row) => {
    const key = row.dataset.tier;
    const toggle = () => {
      const next = { ...state.config.tiers, [key]: !state.config.tiers[key] };
      if (!Object.values(next).some(Boolean)) return; // keep at least one
      setConfig({ tiers: next });
    };
    row.addEventListener("click", toggle);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });
}

// ---- Step 3: Action --------------------------------------------

function bodyAction() {
  const c = state.config;
  const needsSandbox = c.action !== "report";
  const cards = ACTIONS.map((a) => {
    const sel = c.action === a.value;
    const card = `<button class="optcard ${sel ? "sel" : ""}" data-action="${escapeAttr(a.value)}" type="button" role="radio" aria-checked="${sel}">
        <span class="radio-dot" aria-hidden="true"></span>
        <span class="ocbody">
          <span class="octitle"><span class="t">${escapeHtml(a.t)}</span><span class="flag-chip">${escapeHtml(a.flag)}</span></span>
          <span class="ocdesc">${escapeHtml(a.d)}</span>
        </span>
        <span class="risk r${a.risk}" title="${escapeAttr(a.rl)}"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="lbl">${escapeHtml(a.rl)}</span></span>
      </button>`;
    const subs = sel && needsSandbox ? subOptionsHtml(c) : "";
    return card + subs;
  }).join("");
  return `
    <h2 class="step-h">What should assay do with the upgrades it finds?</h2>
    <p class="step-sub">Each step does more — and changes more. You can re-run with a different action any time.
      <span class="help" title="assay only ever writes when you pick an apply mode." aria-label="assay only ever writes when you pick an apply mode.">?</span></p>
    <div role="radiogroup" aria-label="Action">${cards}</div>`;
}

function subOptionsHtml(c) {
  return `<div class="suboptions fade-up">
      <div class="subrow">
        <span class="sl"><span class="t">Run upgrades in <span class="help" title="Docker isolates each trial build (the safe default). Host is faster but runs newly-bumped build scripts directly on your machine — only for repos you fully trust." aria-label="Docker isolates each trial build (the safe default). Host is faster but runs newly-bumped build scripts directly on your machine — only for repos you fully trust.">?</span></span><span class="f">--executor</span></span>
        <ae-segmented id="sub-executor" value="${escapeAttr(c.executor)}" aria-label="Executor">
          <ae-segmented-item value="docker">Docker</ae-segmented-item>
          <ae-segmented-item value="host">Host</ae-segmented-item>
        </ae-segmented>
      </div>
      <div class="subrow">
        <span class="sl"><span class="t">Parallel workers</span><span class="f">--threads</span></span>
        <div class="numstep">
          <button id="threads-dec" type="button" aria-label="fewer workers">−</button>
          <span class="val" aria-live="polite">${c.threads}</span>
          <button id="threads-inc" type="button" aria-label="more workers">+</button>
        </div>
      </div>
      <div class="subrow">
        <span class="sl"><span class="t">Stop at first failure</span><span class="f">--fail-fast</span></span>
        <ae-switch id="sub-fail-fast" ${c.failFast ? "checked" : ""} aria-label="Stop at first failure"></ae-switch>
      </div>
    </div>`;
}

function wireAction() {
  const group = els.wizardContent.querySelector('[role="radiogroup"]');
  const cards = Array.from(els.wizardContent.querySelectorAll(".optcard"));
  cards.forEach((card, idx) => {
    card.addEventListener("click", () => setConfig({ action: card.dataset.action }));
    card.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setConfig({ action: ACTIONS[(idx + 1) % ACTIONS.length].value });
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setConfig({ action: ACTIONS[(idx - 1 + ACTIONS.length) % ACTIONS.length].value });
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setConfig({ action: card.dataset.action });
      }
    });
    // Roving tabindex: only the selected card is tab-reachable.
    card.tabIndex = card.classList.contains("sel") ? 0 : -1;
  });
  if (group) {
    const sel = group.querySelector(".optcard.sel");
    if (sel) sel.focus({ preventScroll: true });
  }
  const exec = $("sub-executor");
  if (exec) exec.addEventListener("ae-change", (e) => setConfig({ executor: e.detail?.value ?? exec.value ?? "docker" }));
  const dec = $("threads-dec");
  const inc = $("threads-inc");
  if (dec) dec.addEventListener("click", () => setConfig({ threads: Math.max(1, state.config.threads - 1) }));
  if (inc) inc.addEventListener("click", () => setConfig({ threads: Math.min(16, state.config.threads + 1) }));
  const ff = $("sub-fail-fast");
  if (ff) ff.addEventListener("ae-change", (e) => setConfig({ failFast: !!(e.detail?.checked ?? ff.checked) }));
}

// ---- Step 4: Review --------------------------------------------

function bodyReview() {
  const c = state.config;
  const act = actionFor(c.action);
  const writes = c.action === "apply-local" || c.action === "apply-pr";
  const tierList = selectedTierKeys(c).join(" · ");
  const cmd = buildCommandArgs(c).join(" ");
  const sandboxRow = c.action !== "report"
    ? `<div class="pr"><span class="k">Sandbox</span><span class="v">${escapeHtml(c.executor)} · ${c.threads} workers${c.failFast ? " · fail-fast" : ""}</span></div>`
    : "";
  return `
    <h2 class="step-h">Ready to run</h2>
    <p class="step-sub">Here's exactly what will happen when you hit start.</p>
    <p class="plan-hero">${planSentenceHtml(c)}</p>
    <div class="plan-table">
      <div class="pr"><span class="k">Repository</span><span class="v">${escapeHtml(c.repo.trim() || "—")}</span></div>
      <div class="pr"><span class="k">Scope</span><span class="v">${escapeHtml(ecoWords(c))} · <span class="em">${escapeHtml(tierList)}</span></span></div>
      <div class="pr"><span class="k">Action</span><span class="v">${escapeHtml(act.t)} <span class="faint">(${escapeHtml(act.flag)})</span></span></div>
      ${sandboxRow}
    </div>
    <button class="cmd-toggle ${state.cmdOpen ? "open" : ""}" id="cmd-toggle" type="button" aria-expanded="${state.cmdOpen}">
      <span class="chev" aria-hidden="true">▸</span>${state.cmdOpen ? "Hide" : "Show"} the exact command
    </button>
    <div class="cmd-box" id="cmd-box" ${state.cmdOpen ? "" : "hidden"}>${escapeHtml(cmd)}</div>
    <div class="safety-note">
      ${writes
        ? `<span class="ico-warn" aria-hidden="true">⛊</span> This run can write to your repo. Only upgrades that pass CI are applied.`
        : `<span class="ico-ok" aria-hidden="true">⛊</span> Safe to run — no commits, no pushes, nothing on disk changes.`}
    </div>`;
}

function wireReview() {
  const toggle = $("cmd-toggle");
  const box = $("cmd-box");
  if (toggle && box) {
    toggle.addEventListener("click", () => {
      state.cmdOpen = !state.cmdOpen;
      box.hidden = !state.cmdOpen;
      toggle.classList.toggle("open", state.cmdOpen);
      toggle.setAttribute("aria-expanded", String(state.cmdOpen));
      toggle.querySelector(".chev").nextSibling.textContent = state.cmdOpen ? "Hide the exact command" : "Show the exact command";
    });
  }
}

// ========================================================================
// PHASE MACHINE
// ========================================================================

function syncTopbar() {
  if (state.phase === "setup") {
    els.stepIndicator.hidden = false;
    els.stepIndicator.innerHTML = `Step <b>${state.step + 1}</b> of ${WIZ_STEPS.length}`;
  } else {
    els.stepIndicator.hidden = true;
  }
  setRunStatusPill();
}

function setRunStatusPill() {
  if (state.phase === "setup") { setStatus("ready", "idle"); return; }
  if (state.runActive) { setStatus("running", "running"); return; }
  const anyFail = Array.from(state.proposals.values()).some((p) => p.state === "failure");
  if (anyFail) setStatus("needs attention", "error");
  else setStatus("done", "done");
}

function enterSetup() {
  clearActiveRunUi();
  state.phase = "setup";
  els.setupView.hidden = false;
  els.runView.hidden = true;
  renderWizard();
}

function enterRun() {
  state.phase = "run";
  els.setupView.hidden = true;
  els.runView.hidden = false;
  syncTopbar();
}

function clearActiveRunUi() {
  // Leave the run view intact in the DOM but reset transient bits if needed.
}

// ========================================================================
// RUN
// ========================================================================

async function startRun(prebuiltArgs) {
  const args = prebuiltArgs || buildStartArgs();
  if (!args.repo) { toast("Pick a repo first."); return; }
  if (state.runActive) return;
  // Tier scope applied client-side at ingestion. When --only-breaking already
  // narrowed the server side, scope is moot; otherwise we hide out-of-scope
  // tiers from the streamed proposals.
  state.runScope = prebuiltArgs && prebuiltArgs.scopeTiers
    ? prebuiltArgs.scopeTiers
    : { ...state.config.tiers };
  state.runIsReport = args.mode === "dry-run";
  hideErrorBanner();
  resetRunState();
  enterRun();
  setStatus("running", "running");
  state.runActive = true;
  state.lastArgs = args;
  els.runAgain.hidden = true;
  els.runTitle.textContent = state.runIsReport ? "Report" : "Validation sweep";
  // Report mode has no validating/passed/failed counts.
  els.countValidating.hidden = state.runIsReport;
  els.countPassed.hidden = state.runIsReport;
  els.countFailed.hidden = state.runIsReport;
  try {
    const { invoke } = tauri();
    await invoke("start_analysis", { args });
  } catch (err) {
    setStatus(`failed: ${err}`, "error");
    state.runActive = false;
    syncTopbar();
  }
}

function validateBreakingUpgrades() {
  const base = state.lastArgs || buildStartArgs();
  startRun({
    ...base,
    repo: base.repo || state.config.repo.trim(),
    ecosystem: base.ecosystem || state.config.ecosystem,
    mode: "validate",
    onlyBreaking: true,
    scopeTiers: { compatible: false, breaking: true, "lockfile-only": false },
  });
}

// ---- Event handling --------------------------------------------

function startEventListener() {
  const { listen } = tauri();
  return listen("assay://event", (e) => {
    const payload = e.payload;
    if (!payload || !payload.type) return;
    switch (payload.type) {
      case "spawning": break;
      case "spawn_failed":
        setStatus("spawn failed", "error");
        showErrorBanner(payload.reason || "spawn failed", null);
        state.runActive = false;
        syncTopbar();
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
  if (state.lastArgs) els.runAgain.hidden = false;
  setRunStatusPill();
  if ((exitCode === 0 || exitCode == null) && els.runStatus.dataset.kind !== "error") {
    // status already set by setRunStatusPill / run_completed
  } else if (exitCode != null && exitCode !== 0 && els.runStatus.dataset.kind !== "error") {
    setStatus(`exit ${exitCode}`, "error");
  }
  updateValidateBreakingButton();
}

function handleNdjsonLine(line) {
  let evt;
  try { evt = JSON.parse(line); } catch { console.warn("bad NDJSON line:", line); return; }
  switch (evt.type) {
    case "run_started": onRunStarted(evt); break;
    case "proposal_validating": onProposalValidating(evt); break;
    case "proposal_completed": onProposalCompleted(evt); break;
    case "cohort_validating": onCohortValidating(evt); break;
    case "cohort_completed": onCohortCompleted(evt); break;
    case "run_completed": onRunCompleted(evt); break;
    default:
      // Additive event types (proposal_discovered, cohort_grouped, …) are
      // tolerated per assay's 1.0 stability promise.
      break;
  }
}

/** True when this proposal's tier is within the active scope. */
function inScope(tier) {
  if (!state.runScope) return true;
  return state.runScope[tier] !== false;
}

function onRunStarted(evt) {
  if (state.lastArgs && state.lastArgs.repo) pushRecent(state.lastArgs.repo);
  const validationAttempted = state.lastArgs?.mode === "validate";

  // Index cohorts, keeping only in-scope members.
  const cohortByMember = new Map();
  (evt.cohorts || []).forEach((c) => {
    const memberIds = (c.member_ids || []).filter((mid) => {
      const p = (evt.proposals || []).find((x) => x.id === mid);
      return p && inScope(p.tier);
    });
    state.cohorts.set(c.id, { id: c.id, display: c.display, memberIds, state: "pending" });
    memberIds.forEach((mid) => cohortByMember.set(mid, c.id));
  });

  // Index proposals (scope-filtered).
  (evt.proposals || []).forEach((p) => {
    if (!inScope(p.tier)) return;
    state.proposals.set(p.id, {
      id: p.id, subject: p.subject, from: p.from, to: p.to, tier: p.tier,
      ecosystem: p.ecosystem, cohort: p.cohort || null, explanation: p.explanation || null,
      state: "pending", durationMs: null, conclusion: null, validationAttempted,
      failureContext: null, stderrTail: null, manifestPaths: null,
      validatedWorkflows: null, ciForgeRunIds: null, notes: null, expanded: false,
    });
  });

  // List order: multi-member cohorts get a container; single in-scope members
  // render flat.
  const placedCohorts = new Set();
  (evt.proposals || []).forEach((p) => {
    if (!inScope(p.tier)) return;
    const cid = cohortByMember.get(p.id);
    if (cid && state.cohorts.get(cid).memberIds.length > 1) {
      if (!placedCohorts.has(cid)) { placedCohorts.add(cid); state.listOrder.push({ kind: "cohort", id: cid }); }
    } else {
      state.listOrder.push({ kind: "proposal", id: p.id });
    }
  });

  renderList();
  els.filterbar.hidden = state.proposals.size === 0;
  updateProgress();
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
  if (evt.failure_context) p.failureContext = evt.failure_context;
  if (evt.stderr_tail) p.stderrTail = evt.stderr_tail;
  if (evt.manifest_paths) p.manifestPaths = evt.manifest_paths;
  if (evt.validated_workflows) p.validatedWorkflows = evt.validated_workflows;
  if (evt.ci_forge_run_ids) p.ciForgeRunIds = evt.ci_forge_run_ids;
  if (evt.notes) p.notes = evt.notes;
  updateProposalRow(p);
  if (p.el && p.el.classList.contains("expanded")) renderDetailPanel(p);
  updateCounts();
}

function onCohortValidating(evt) {
  const c = state.cohorts.get(evt.cohort);
  if (!c) return;
  c.state = "inprogress";
  updateCohortContainer(c);
  c.memberIds.forEach((mid) => {
    const m = state.proposals.get(mid);
    if (m) { m.state = "inprogress"; updateProposalRow(m); }
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
    if (m) { m.state = newState; m.conclusion = evt.conclusion; m.durationMs = evt.duration_ms; updateProposalRow(m); }
  });
  const memberStates = new Set(c.memberIds.map((mid) => state.proposals.get(mid)?.state));
  if (memberStates.size > 1) c.state = "mixed";
  updateCohortContainer(c);
  updateCounts();
}

function onRunCompleted(evt) {
  for (const p of state.proposals.values()) {
    if (p.state === "pending") { p.state = "unvalidated"; p.conclusion = "unvalidated"; updateProposalRow(p); }
  }
  if (Array.isArray(evt.failure_clusters) && evt.failure_clusters.length > 0) {
    renderClusters(evt.failure_clusters);
  }
  updateCounts();
  updateProgress(true);
  renderResultBanner();
  setRunStatusPill();
  updateValidateBreakingButton();
}

// ---- Run rendering ---------------------------------------------

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
    <span class="proposal-icon" aria-hidden="true"></span>
    <span class="proposal-text">
      <span class="proposal-subject"></span>
      <span class="proposal-version">
        <span class="from"></span>
        <span class="arrow" aria-hidden="true">→</span>
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
    if (e.target.closest("button, a, .detail-stderr")) return;
    toggleExpanded(p);
  });
  return li;
}

function toggleExpanded(p) {
  p.expanded = !p.expanded;
  if (p.expanded) { renderDetailPanel(p); p.el.classList.add("expanded"); }
  else p.el.classList.remove("expanded");
}

function proposalExplanation(p) { return p.explanation || inferGithubActionsExplanation(p); }

function proposalReasonText(p) {
  if (p.state === "inprogress") return "Running your CI…";
  if (p.failureContext?.summary) {
    const rule = p.failureContext.rule ? ` (${p.failureContext.rule})` : "";
    return `Validation failed: ${p.failureContext.summary}${rule}`;
  }
  if (p.stderrTail && p.state === "failure") {
    const firstLine = String(p.stderrTail).split(/\r?\n/).find((line) => line.trim());
    if (firstLine) return `Validation failed: ${firstLine.trim()}`;
  }
  if (p.state === "success") return "Validated — CI passed, no regression.";
  if (p.state === "unvalidated" && p.validationAttempted) {
    const note = firstNote(p);
    return note ? `Validation unavailable: ${note}` : "Validation unavailable: no repo gate ran for this proposal.";
  }
  const exp = proposalExplanation(p);
  if (exp?.summary) return exp.summary;
  if (p.tier === "compatible") return "Looks safe — minor/patch bump within semver.";
  if (p.tier === "breaking") return "Breaking change — validate before applying.";
  if (p.tier === "lockfile-only") return "Lockfile-only — transitive pin, no manifest edit.";
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
  if (Array.isArray(p.notes)) return String(p.notes.find((n) => String(n).trim()) || "").trim();
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
      inputs: { from_major: fromMajor, from_ref: p.from || "", to_major: toMajor, to_ref: p.to || "" },
      decision: "breaking", fallback: true,
    };
  }
  return {
    summary: "Classifier metadata was not recorded with this run; rerun analysis with the current assay binary for rule-level evidence.",
    rule: "classifier:metadata-missing",
    inputs: { from_ref: p.from || "", to_ref: p.to || "" },
    decision: p.tier || "breaking", fallback: true,
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
  lines.push(`<dt>change</dt><dd>${escapeHtml(p.from || "—")} → ${escapeHtml(p.to || "—")}</dd>`);
  if (p.cohort) lines.push(`<dt>cohort</dt><dd>${escapeHtml(p.cohort)}</dd>`);
  if (p.durationMs != null) lines.push(`<dt>duration</dt><dd>${escapeHtml(formatDuration(p.durationMs))}</dd>`);
  if (p.conclusion) lines.push(`<dt>result</dt><dd>${escapeHtml(p.conclusion)}</dd>`);
  if (p.validationAttempted) lines.push(`<dt>validation</dt><dd>${escapeHtml(validationStatusText(p))}</dd>`);
  if (Array.isArray(p.manifestPaths) && p.manifestPaths.length) lines.push(`<dt>manifests</dt><dd>${p.manifestPaths.map(escapeHtml).join("<br>")}</dd>`);
  if (Array.isArray(p.validatedWorkflows) && p.validatedWorkflows.length) lines.push(`<dt>validated workflows</dt><dd>${p.validatedWorkflows.map(escapeHtml).join("<br>")}</dd>`);
  if (Array.isArray(p.ciForgeRunIds) && p.ciForgeRunIds.length) lines.push(`<dt>ci-forge runs</dt><dd>${p.ciForgeRunIds.map(escapeHtml).join("<br>")}</dd>`);
  if (p.notes) { const notes = Array.isArray(p.notes) ? p.notes : [p.notes]; lines.push(`<dt>notes</dt><dd>${notes.map(escapeHtml).join("<br>")}</dd>`); }
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
        for (const [key, value] of entries) lines.push(`<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(String(value))}</dd>`);
        lines.push("</dl>");
      }
    }
    if (exp.decision) lines.push(`<p class="classifier-decision">decision: ${escapeHtml(exp.decision)}</p>`);
    lines.push("</div>");
  }

  if (p.failureContext) {
    const fc = p.failureContext;
    lines.push('<div class="detail-section">');
    lines.push("<h4>Why it failed</h4>");
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
    // Suggested fix (1.6.0+ additive; absent today → not shown).
    if (fc.fix) lines.push(`<div class="fix-hint"><b>Suggested fix.</b> ${escapeHtml(fc.fix)}</div>`);
    if (p.stderrTail) {
      lines.push(`<button class="link-btn toggle-raw" data-toggle="raw-${escapeAttr(p.id)}" type="button">Show raw stderr</button>`);
      lines.push(`<pre class="detail-stderr" id="raw-${escapeAttr(p.id)}" hidden></pre>`);
    }
    lines.push("</div>");
  } else if (p.stderrTail || p.state === "failure") {
    lines.push('<div class="detail-section">');
    lines.push("<h4>stderr <button class=\"link-btn copy-stderr\" type=\"button\">copy</button></h4>");
    if (p.stderrTail) lines.push(`<pre class="detail-stderr">${escapeHtml(p.stderrTail)}</pre>`);
    else lines.push(`<p style="margin:0;color:var(--text-faint);font-size:11.5px">No stderr captured by this assay version.</p>`);
    lines.push("</div>");
  } else if (p.state === "success") {
    lines.push('<div class="detail-section"><h4>Evidence</h4>');
    lines.push(`<div style="font-family:var(--font-mono);font-size:11.5px;color:var(--text-dim)">repo gates passed · no test regressions · lockfile resolves cleanly</div></div>`);
  }

  panel.innerHTML = lines.join("\n");

  const rawToggle = panel.querySelector(".toggle-raw");
  if (rawToggle) {
    rawToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const pre = document.getElementById(rawToggle.getAttribute("data-toggle"));
      if (!pre) return;
      if (pre.hidden) { pre.textContent = p.stderrTail || ""; pre.hidden = false; rawToggle.textContent = "Hide raw stderr"; }
      else { pre.hidden = true; rawToggle.textContent = "Show raw stderr"; }
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
  if (f.line != null) { s += `:${f.line}`; if (f.column != null) s += `:${f.column}`; }
  return s;
}

function renderCohortContainer(c) {
  const li = document.createElement("li");
  li.className = `cohort state-${c.state}`;
  li.dataset.cohort = c.id;
  li.innerHTML = `
    <div class="cohort-header">
      <span class="cohort-icon" aria-hidden="true"></span>
      <span class="cohort-name"></span>
      <span class="cohort-members-summary"></span>
      <span class="cohort-lockstep-tag">lockstep · ${c.memberIds.length}</span>
    </div>
    <ol class="cohort-members"></ol>
  `;
  li.querySelector(".cohort-name").textContent = c.display;
  const summary = c.memberIds.map((mid) => state.proposals.get(mid)?.subject).filter(Boolean).join(", ");
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
  updateProgress();
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
    if (p.state === "inprogress") validating++;
    else if (p.state === "success") passed++;
    else if (p.state === "failure") failed++;
  }
  els.countDiscovered.textContent = `${discovered} found`;
  els.countValidating.textContent = `${validating} validating`;
  els.countPassed.textContent = `${passed} passed`;
  els.countFailed.textContent = `${failed} failed`;
  updateValidateBreakingButton();
}

function updateProgress(done = false) {
  let settled = 0;
  const total = state.proposals.size;
  let failed = 0;
  for (const p of state.proposals.values()) {
    if (p.state === "success" || p.state === "failure" || p.state === "unvalidated") settled++;
    if (p.state === "failure") failed++;
  }
  const pct = total ? Math.round((settled / total) * 100) : 0;
  els.progressFill.style.width = `${pct}%`;
  els.progressbar.setAttribute("aria-valuenow", String(pct));
  if (done) els.progressbar.dataset.done = failed ? "fail" : "pass";
  else delete els.progressbar.dataset.done;
}

function renderResultBanner() {
  let discovered = 0, passed = 0, failed = 0;
  const by = { compatible: 0, breaking: 0, "lockfile-only": 0 };
  for (const p of state.proposals.values()) {
    discovered++;
    if (p.state === "success") passed++;
    else if (p.state === "failure") failed++;
    if (by[p.tier] != null) by[p.tier]++;
  }
  const isReport = state.runIsReport;
  const cls = failed ? "bad" : "ok";
  const icon = failed ? "⚠" : "✓";
  let title, sub, action = "";
  if (isReport) {
    title = `Reported ${discovered} available upgrade${discovered === 1 ? "" : "s"}`;
    sub = `${by.compatible} compatible · ${by.breaking} breaking · ${by["lockfile-only"]} lockfile-only. Nothing was validated yet — run a validation to prove they're safe.`;
    action = `<ae-button id="banner-validate" variant="primary" size="sm">▶ Validate these</ae-button>`;
  } else if (failed) {
    title = `${failed} of ${discovered} upgrade${discovered === 1 ? "" : "s"} need attention`;
    sub = `<b>${passed} passed</b> and are safe to apply. The ${failed} failure${failed === 1 ? "" : "s"} are grouped by cause below.`;
    if (passed > 0) action = `<ae-button id="banner-apply" variant="primary" size="sm">Apply ${passed} passing →</ae-button>`;
  } else {
    title = `All ${discovered} upgrade${discovered === 1 ? "" : "s"} passed`;
    sub = "Every upgrade ran clean under your CI. Safe to apply or open as a PR.";
    if (passed > 0) action = `<ae-button id="banner-apply" variant="primary" size="sm">Apply ${passed} passing →</ae-button>`;
  }
  els.resultBannerMount.innerHTML = `
    <div class="result-banner ${cls} fade-up" role="status">
      <span class="rb-ico" aria-hidden="true">${icon}</span>
      <div><div class="rb-title">${escapeHtml(title)}</div><div class="rb-sub">${sub}</div></div>
      ${action ? `<div class="rb-actions">${action}</div>` : ""}
    </div>`;
  const validateBtn = $("banner-validate");
  if (validateBtn) validateBtn.addEventListener("click", () => {
    startRun({ ...buildStartArgs(), mode: "validate", onlyBreaking: false, scopeTiers: { ...state.runScope } });
  });
  const applyBtn = $("banner-apply");
  if (applyBtn) applyBtn.addEventListener("click", () => {
    // Writing runs are confirmed in the wizard, not launched silently.
    state.config.action = "apply-local";
    state.step = 2;
    state.maxStep = WIZ_STEPS.length - 1;
    enterSetup();
    toast("Review the apply action, then start.");
  });
}

function updateValidateBreakingButton() {
  if (!els.validateBreaking) return;
  const hasBreaking = Array.from(state.proposals.values()).some(
    (p) => p.tier === "breaking" && (p.state === "pending" || p.state === "unvalidated")
  );
  const isBreakingValidation = state.lastArgs?.onlyBreaking && state.lastArgs?.mode === "validate";
  els.validateBreaking.hidden = state.runActive || !hasBreaking || isBreakingValidation || state.phase !== "run";
}

// ---- Clusters --------------------------------------------------

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
        <div class="cluster-summary">${escapeHtml(rep.summary || "")}</div>
        ${findingHtml}
      </div>
    `;
    els.clustersList.appendChild(li);
  }
}

// ---- Filters + search ------------------------------------------

function setFilter(f) { state.filter = f; applyFilters(); }

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
  p.el.classList.toggle("hidden-by-filter", !rowMatchesFilters(p));
}
function applyFiltersToCohort(c) {
  if (!c.el) return;
  const anyMatch = c.memberIds.some((mid) => {
    const m = state.proposals.get(mid);
    return m && rowMatchesFilters(m);
  });
  c.el.classList.toggle("hidden-by-filter", !anyMatch);
}

// --- Recents -----------------------------------------------------

async function pushRecent(path) {
  if (!path) return;
  state.recents = state.recents.filter((r) => r.path !== path);
  state.recents.unshift({ path, lastUsedAt: Date.now() });
  if (state.recents.length > RECENTS_CAP) state.recents = state.recents.slice(0, RECENTS_CAP);
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
function applyAppearancePrefs() {
  document.body.setAttribute("data-density", state.prefs.density || "regular");
  if (els.density) els.density.value = state.prefs.density || "regular";
  if (els.railLayout) els.railLayout.value = state.prefs.railLayout || "side";
}
function applyPrefsToSettingsPanel() {
  els.settingsMemberGate.checked = !!state.prefs.memberGate;
  els.settingsNoShaPin.checked = !!state.prefs.noShaPinProposals;
  if (els.density) els.density.value = state.prefs.density || "regular";
  if (els.railLayout) els.railLayout.value = state.prefs.railLayout || "side";
  syncThemePicker();
}
function readPrefsFromSettingsPanel() {
  state.prefs.memberGate = els.settingsMemberGate.checked;
  state.prefs.noShaPinProposals = els.settingsNoShaPin.checked;
  // density / rail-layout / theme persist live (not gated by Save).
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
  els.clusters.hidden = true;
  els.clustersList.innerHTML = "";
  els.filterbar.hidden = true;
  els.resultBannerMount.innerHTML = "";
  els.progressFill.style.width = "0%";
  delete els.progressbar.dataset.done;
  els.progressbar.setAttribute("aria-valuenow", "0");
  els.validateBreaking.hidden = true;
  updateCounts();
}
function showErrorBanner(text, exitCode) {
  els.errorBanner.hidden = false;
  els.errorBannerBody.textContent = exitCode != null ? `exit ${exitCode}\n\n${text}` : text;
}
function hideErrorBanner() {
  els.errorBanner.hidden = true;
  els.errorBannerBody.textContent = "";
}
function toast(message) { aeToast({ message, duration: 1800 }); }
function escapeHtml(s) {
  if (s == null) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function escapeAttr(s) { return String(s == null ? "" : s).replace(/"/g, "&quot;"); }

// --- Wireup -----------------------------------------------------

// Wizard footer.
els.wizBack.addEventListener("click", wizBack);
els.wizNext.addEventListener("click", wizNext);

// Run-view actions.
els.validateBreaking.addEventListener("click", validateBreakingUpgrades);
els.runAgain.addEventListener("click", () => { if (state.lastArgs) startRun(state.lastArgs); });
els.newAnalysis.addEventListener("click", enterSetup);
els.brand.addEventListener("click", () => { if (state.phase === "run" && !state.runActive) enterSetup(); });

// Run-view filters.
if (els.statusFilter) {
  els.statusFilter.addEventListener("ae-change", (e) => setFilter(e.detail?.value ?? els.statusFilter.value ?? "all"));
}
els.search.addEventListener("ae-input", (e) => {
  state.search = String(e.detail?.value ?? els.search.value ?? "").trim().toLowerCase();
  applyFilters();
});
els.search.addEventListener("ae-clear", () => { state.search = ""; applyFilters(); });

// Error banner copy + dismiss.
els.errorBannerCopy.addEventListener("click", async () => {
  const ok = await clipboardWrite(els.errorBannerBody.textContent || "");
  toast(ok ? "Copied to clipboard" : "Copy failed");
});
els.errorBannerDismiss.addEventListener("click", hideErrorBanner);

// Theme: header quick-toggle + live brand picker.
els.themeToggle.addEventListener("click", cycleTheme);
els.themeBrand.addEventListener("ae-change", (e) => selectBrand(e.detail?.value ?? els.themeBrand.value ?? "default"));
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (state.prefs.themeBrand === "default" && state.prefs.themeVariant == null) updateThemeIcon();
});

// Appearance prefs (persist live).
if (els.density) els.density.addEventListener("ae-change", (e) => {
  state.prefs.density = e.detail?.value ?? els.density.value ?? "regular";
  applyAppearancePrefs();
  persistPrefs();
});
if (els.railLayout) els.railLayout.addEventListener("ae-change", (e) => {
  state.prefs.railLayout = e.detail?.value ?? els.railLayout.value ?? "side";
  if (state.phase === "setup") renderRail();
  persistPrefs();
});

// Settings drawer.
function openSettings() { applyPrefsToSettingsPanel(); els.settingsOverlay.open = true; }
function closeSettings() { els.settingsOverlay.open = false; }
els.settingsBtn.addEventListener("click", openSettings);
els.settingsClose.addEventListener("click", closeSettings);
els.settingsSave.addEventListener("click", async () => {
  readPrefsFromSettingsPanel();
  await persistPrefs();
  if (state.phase === "setup") renderWizard();
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
      // Migrate a pre-Aegis single `theme` string onto brand/variant axes.
      if (typeof savedPrefs.theme === "string" && !savedPrefs.themeBrand) {
        state.prefs.themeBrand = "default";
        state.prefs.themeVariant = savedPrefs.theme === "system" ? null : savedPrefs.theme;
      }
      delete state.prefs.theme;
      // Carry forward an older `executor`/`threads` pref into the default config.
      if (savedPrefs.executor) state.config.executor = savedPrefs.executor;
      if (savedPrefs.threads) state.config.threads = savedPrefs.threads;
    }
    const savedRecents = await state.store.get(STORE_KEY_RECENTS);
    if (Array.isArray(savedRecents)) state.recents = savedRecents.slice(0, RECENTS_CAP);
  } catch (err) {
    console.warn("store init failed:", err);
  }
  buildThemePicker();
  applyThemeSelection();
  applyAppearancePrefs();
  applyPrefsToSettingsPanel();
  enterSetup();
  try {
    startEventListener();
  } catch (err) {
    console.error("could not subscribe to assay://event", err);
    toast(`init failed: ${err}`);
  }
});
