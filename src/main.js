// assay-gui frontend.
//
// The Rust backend forwards each NDJSON line from assay's stdout
// wrapped in a `GuiEvent::Raw { line }`. We parse the embedded
// event and update the proposal-list DOM in place. Cohort members
// render inside a containing <div class="cohort"> so multi-member
// cohort lockstep groups are visually one unit. Per-proposal rows
// outside any cohort render as a flat row in the list.
//
// All Tauri global access is deferred until DOMContentLoaded so a
// missing global doesn't tear down module evaluation before the
// user sees any UI. Errors are logged to console AND surfaced in
// the UI via the run-status pill.

function tauri() {
  // `withGlobalTauri: true` in tauri.conf.json exposes the core
  // bindings under window.__TAURI__. The dialog/file plugins are
  // NOT auto-exposed there in Tauri 2; we use `invoke` to call
  // Rust commands that wrap those plugin APIs instead.
  const T = window.__TAURI__;
  if (!T || !T.core || !T.event) {
    throw new Error(
      "window.__TAURI__ globals not present — is `app.withGlobalTauri: true` set in tauri.conf.json?"
    );
  }
  return { invoke: T.core.invoke, listen: T.event.listen };
}

// --- DOM refs ----------------------------------------------------

const $ = (id) => document.getElementById(id);
const els = {
  repo: $("repo"),
  browse: $("browse"),
  ecosystem: $("ecosystem"),
  mode: $("mode"),
  threads: $("threads"),
  failFast: $("fail-fast"),
  memberGate: $("member-gate"),
  start: $("start"),
  cliPreview: $("cli-preview"),
  runStatus: $("run-status"),
  emptyState: $("empty-state"),
  proposalList: $("proposal-list"),
  countTotal: $("count-total"),
  countPending: $("count-pending"),
  countInProgress: $("count-inprogress"),
  countSuccess: $("count-success"),
  countFailure: $("count-failure"),
  footerTail: $("footer-tail"),
};

// --- State -------------------------------------------------------

/**
 * Run state derived from the NDJSON events.
 *
 *   proposals: Map<id, { id, subject, from, to, tier, ecosystem,
 *                        cohort?, state, durationMs?, el? }>
 *   cohorts:   Map<id, { id, display, memberIds[], state, el?, listEl? }>
 *   listOrder: Array<{ kind: 'proposal' | 'cohort', id }>
 */
const state = {
  proposals: new Map(),
  cohorts: new Map(),
  listOrder: [],
  runActive: false,
};

// --- CLI preview -------------------------------------------------

function updateCliPreview() {
  const parts = ["assay", "analyze", "--format", "ndjson"];
  const repo = els.repo.value.trim();
  if (repo) parts.push("--repo", quote(repo));
  if (els.ecosystem.value !== "all") parts.push("--ecosystem", els.ecosystem.value);
  switch (els.mode.value) {
    case "validate": parts.push("--validate"); break;
    case "apply-local": parts.push("--apply-local"); break;
    case "apply-pr": parts.push("--apply-pr"); break;
  }
  if (els.threads.value) parts.push("--threads", els.threads.value);
  if (els.failFast.checked) parts.push("--fail-fast");
  if (els.memberGate.checked) parts.push("--member-gate");
  els.cliPreview.textContent = parts.join(" ");
}

function quote(s) {
  if (/\s/.test(s)) return `"${s}"`;
  return s;
}

[els.repo, els.ecosystem, els.mode, els.threads, els.failFast, els.memberGate].forEach((el) => {
  el.addEventListener("input", updateCliPreview);
  el.addEventListener("change", updateCliPreview);
});
updateCliPreview();

// --- Browse for repo ---------------------------------------------

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

// --- Start analysis ----------------------------------------------

els.start.addEventListener("click", async () => {
  const repo = els.repo.value.trim();
  if (!repo) {
    setStatus("Pick a repo first.", "error");
    return;
  }
  if (state.runActive) return;
  resetState();
  setStatus("running", "running");
  state.runActive = true;
  els.start.disabled = true;
  try {
    const { invoke } = tauri();
    await invoke("start_analysis", {
      args: {
        repo,
        ecosystem: els.ecosystem.value,
        mode: els.mode.value,
        threads: els.threads.value ? parseInt(els.threads.value, 10) : null,
        failFast: els.failFast.checked,
        memberGate: els.memberGate.checked,
      },
    });
  } catch (err) {
    setStatus(`failed: ${err}`, "error");
    state.runActive = false;
    els.start.disabled = false;
  }
});

// --- Event handling ----------------------------------------------

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
      els.footerTail.textContent = payload.reason || "spawn failed";
      state.runActive = false;
      els.start.disabled = false;
      break;
    case "stream_ended":
      state.runActive = false;
      els.start.disabled = false;
      if (payload.exit_code === 0) {
        setStatus("done", "done");
      } else if (payload.exit_code != null) {
        setStatus(`exit ${payload.exit_code}`, "error");
      }
      break;
    case "raw":
      handleNdjsonLine(payload.line);
      break;
    default:
      console.warn("unhandled event", payload);
  }
  });
}

// Kick off the event listener once the DOM is parsed (so Tauri
// globals are present and `els.*` are bound).
window.addEventListener("DOMContentLoaded", () => {
  try {
    startEventListener();
  } catch (err) {
    console.error("could not subscribe to assay://event", err);
    setStatus(`init failed: ${err}`, "error");
  }
});

function handleNdjsonLine(line) {
  let evt;
  try {
    evt = JSON.parse(line);
  } catch (err) {
    console.warn("bad NDJSON line:", line);
    return;
  }
  switch (evt.type) {
    case "run_started":
      onRunStarted(evt);
      break;
    case "proposal_validating":
      onProposalValidating(evt);
      break;
    case "proposal_completed":
      onProposalCompleted(evt);
      break;
    case "cohort_validating":
      onCohortValidating(evt);
      break;
    case "cohort_completed":
      onCohortCompleted(evt);
      break;
    case "run_completed":
      onRunCompleted(evt);
      break;
    default:
      console.warn("unknown event type:", evt.type, evt);
  }
}

// --- Event handlers ----------------------------------------------

function onRunStarted(evt) {
  // Build the cohort table first so we know which proposals are
  // cohort members.
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

  // Index all proposals.
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
    });
  });

  // Compute list order: walk proposals in given order; first time
  // we hit a member of a cohort, emit the cohort placeholder and
  // remember we've placed it. Non-cohort and singleton-cohort
  // proposals get their own row.
  const placedCohorts = new Set();
  evt.proposals.forEach((p) => {
    const cid = cohortByMember.get(p.id);
    if (cid) {
      if (!placedCohorts.has(cid)) {
        placedCohorts.add(cid);
        state.listOrder.push({ kind: "cohort", id: cid });
      }
    } else {
      state.listOrder.push({ kind: "proposal", id: p.id });
    }
  });

  renderList();
  els.footerTail.textContent = `${evt.proposals.length} proposal(s), ${state.cohorts.size} cohort(s)`;
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
  p.durationMs = evt.duration_ms;
  updateProposalRow(p);
  updateCounts();
}

function onCohortValidating(evt) {
  const c = state.cohorts.get(evt.cohort);
  if (!c) return;
  c.state = "inprogress";
  updateCohortContainer(c);
  // Reflect on each member row.
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
  updateCohortContainer(c);
  c.memberIds.forEach((mid) => {
    const m = state.proposals.get(mid);
    if (m) {
      m.state = newState;
      m.durationMs = evt.duration_ms;
      updateProposalRow(m);
    }
  });
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
  setStatus("done", "done");
}

// --- Rendering ---------------------------------------------------

function renderList() {
  els.proposalList.innerHTML = "";
  els.proposalList.hidden = state.listOrder.length === 0;
  els.emptyState.style.display = state.listOrder.length === 0 ? "block" : "none";

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
  `;
  li.querySelector(".proposal-subject").textContent = p.subject;
  li.querySelector(".from").textContent = p.from;
  li.querySelector(".to").textContent = p.to;
  const tier = li.querySelector(".proposal-tier");
  tier.textContent = p.tier;
  tier.classList.add(`tier-${p.tier}`);
  return li;
}

function renderCohortContainer(c) {
  const li = document.createElement("li");
  li.className = `cohort state-${c.state}`;
  li.dataset.cohort = c.id;
  li.innerHTML = `
    <div class="cohort-header">
      <span class="cohort-icon"></span>
      <span class="cohort-name"></span>
      <span class="cohort-meta"></span>
      <span class="cohort-lockstep-tag">lockstep · ${c.memberIds.length}</span>
    </div>
    <ol class="cohort-members"></ol>
  `;
  li.querySelector(".cohort-name").textContent = c.display;
  li.querySelector(".cohort-meta").textContent = `${c.memberIds.length} packages`;
  const membersList = li.querySelector(".cohort-members");
  c.memberIds.forEach((mid) => {
    const p = state.proposals.get(mid);
    if (!p) return;
    const row = renderProposalRow(p);
    p.el = row;
    membersList.appendChild(row);
  });
  c.listEl = membersList;
  return li;
}

function updateProposalRow(p) {
  if (!p.el) return;
  p.el.className = `proposal state-${p.state}`;
  const dur = p.el.querySelector(".proposal-duration");
  if (dur) dur.textContent = p.durationMs != null ? formatDuration(p.durationMs) : "";
}

function updateCohortContainer(c) {
  if (!c.el) return;
  c.el.className = `cohort state-${c.state}`;
}

function updateCounts() {
  let pending = 0, inProgress = 0, success = 0, failure = 0, total = 0;
  for (const p of state.proposals.values()) {
    total++;
    switch (p.state) {
      case "pending": pending++; break;
      case "inprogress": inProgress++; break;
      case "success": success++; break;
      case "failure": failure++; break;
      case "unvalidated": pending++; break; // count unvalidated under pending in the UI
    }
  }
  els.countTotal.textContent = `${total} total`;
  els.countPending.textContent = `${pending} pending`;
  els.countInProgress.textContent = `${inProgress} in progress`;
  els.countSuccess.textContent = `${success} ✓`;
  els.countFailure.textContent = `${failure} ✗`;
}

// --- Helpers -----------------------------------------------------

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

function resetState() {
  state.proposals.clear();
  state.cohorts.clear();
  state.listOrder = [];
  els.proposalList.innerHTML = "";
  els.proposalList.hidden = true;
  els.emptyState.style.display = "block";
  els.emptyState.querySelector("p").textContent = "Sweep started… waiting for assay to surface proposals.";
  els.footerTail.textContent = "";
  updateCounts();
}
