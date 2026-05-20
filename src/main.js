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
  // Error banner
  errorBanner: $("error-banner"),
  errorBannerBody: $("error-banner-body"),
  errorBannerCopy: $("error-banner-copy"),
  errorBannerDismiss: $("error-banner-dismiss"),
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
  footerTail: $("footer-tail"),
  // Filters
  filterbar: $("filterbar"),
  search: $("search"),
  // Clusters
  clusters: $("clusters"),
  clustersList: $("clusters-list"),
  // Settings drawer
  settingsOverlay: $("settings-overlay"),
  settingsClose: $("settings-close"),
  settingsThreads: $("settings-threads"),
  settingsMemberGate: $("settings-member-gate"),
  settingsNoShaPin: $("settings-no-sha-pin"),
  settingsSave: $("settings-save"),
  // Toast
  toast: $("toast"),
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
    theme: "system",
  },
  recents: [], // Array<{ path, lastUsedAt }>
  store: null,
};

// --- Theme -------------------------------------------------------

function applyTheme(theme) {
  // theme is one of: 'system' | 'dark' | 'light'.
  const effective =
    theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
      : theme;
  if (effective === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    els.themeIcon.textContent = "☀";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    els.themeIcon.textContent = "☾";
  }
}

function cycleTheme() {
  // Manual toggle bounces between light <-> dark, leaving "system"
  // behind. We persist whatever the user lands on.
  const cur = state.prefs.theme;
  const next = cur === "light" ? "dark" : "light";
  state.prefs.theme = next;
  applyTheme(next);
  persistPrefs();
  // Reflect in the settings panel if it's already populated.
  const radio = document.querySelector(`input[name="theme"][value="${next}"]`);
  if (radio) radio.checked = true;
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
  document.querySelectorAll('input[name="executor"]').forEach((r) => {
    r.checked = r.value === state.prefs.executor;
  });
  document.querySelectorAll('input[name="theme"]').forEach((r) => {
    r.checked = r.value === state.prefs.theme;
  });
  els.settingsThreads.value = String(state.prefs.threads || 4);
  els.settingsMemberGate.checked = !!state.prefs.memberGate;
  els.settingsNoShaPin.checked = !!state.prefs.noShaPinProposals;
}

function readPrefsFromSettingsPanel() {
  const executor = document.querySelector('input[name="executor"]:checked');
  const theme = document.querySelector('input[name="theme"]:checked');
  state.prefs.executor = executor ? executor.value : "docker";
  state.prefs.theme = theme ? theme.value : "system";
  const t = parseInt(els.settingsThreads.value, 10);
  state.prefs.threads = Number.isFinite(t) && t > 0 ? t : 4;
  state.prefs.memberGate = els.settingsMemberGate.checked;
  state.prefs.noShaPinProposals = els.settingsNoShaPin.checked;
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
  };
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
    if (els.runStatus.classList.contains("pill-error")) {
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
      state: "pending",
      durationMs: null,
      conclusion: null,
      // 1.6.0+ fields, surfaced when present on proposal_completed.
      failureContext: null,
      stderrTail: null,
      manifestPaths: null,
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
  setStatus("done", "done");
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
    </span>
    <span class="proposal-tier"></span>
    <span class="proposal-duration"></span>
    <span class="proposal-chevron" aria-hidden="true">▸</span>
    <div class="proposal-detail" role="region" aria-label="Proposal detail"></div>
  `;
  li.querySelector(".proposal-subject").textContent = p.subject;
  li.querySelector(".from").textContent = p.from;
  li.querySelector(".to").textContent = p.to;
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
  if (Array.isArray(p.manifestPaths) && p.manifestPaths.length) {
    lines.push(`<dt>manifests</dt><dd>${p.manifestPaths.map(escapeHtml).join("<br>")}</dd>`);
  }
  if (p.notes) {
    const notes = Array.isArray(p.notes) ? p.notes : [p.notes];
    lines.push(`<dt>notes</dt><dd>${notes.map(escapeHtml).join("<br>")}</dd>`);
  }
  lines.push("</dl>");

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
  state.filter = f;
  document.querySelectorAll(".chip").forEach((c) => {
    c.classList.toggle("chip-active", c.dataset.filter === f);
  });
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

function setStatus(label, kind) {
  els.runStatus.textContent = label;
  els.runStatus.className = `run-status pill pill-${kind || "idle"}`;
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
  els.toast.textContent = message;
  els.toast.hidden = false;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { els.toast.hidden = true; }, 1800);
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

[els.repo, els.ecosystem, els.mode, els.failFast].forEach((el) => {
  el.addEventListener("input", updateCliPreview);
  el.addEventListener("change", updateCliPreview);
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

// Filter chips.
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => setFilter(chip.dataset.filter));
});

els.search.addEventListener("input", () => {
  state.search = els.search.value.trim().toLowerCase();
  applyFilters();
});

// Error banner copy + dismiss.
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

// Theme toggle (header icon).
els.themeToggle.addEventListener("click", cycleTheme);
// React to OS preference changes when in "system" mode.
window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
  if (state.prefs.theme === "system") applyTheme("system");
});

// Settings drawer.
function openSettings() {
  applyPrefsToSettingsPanel();
  els.settingsOverlay.hidden = false;
}
function closeSettings() { els.settingsOverlay.hidden = true; }
els.settingsBtn.addEventListener("click", openSettings);
els.openSettingsInline.addEventListener("click", openSettings);
els.settingsClose.addEventListener("click", closeSettings);
els.settingsOverlay.addEventListener("click", (e) => {
  if (e.target === els.settingsOverlay) closeSettings();
});
els.settingsSave.addEventListener("click", async () => {
  readPrefsFromSettingsPanel();
  applyTheme(state.prefs.theme);
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
    }
    const savedRecents = await state.store.get(STORE_KEY_RECENTS);
    if (Array.isArray(savedRecents)) {
      state.recents = savedRecents.slice(0, RECENTS_CAP);
    }
  } catch (err) {
    console.warn("store init failed:", err);
  }
  applyTheme(state.prefs.theme || "system");
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
