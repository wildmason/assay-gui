// Visual-QA the redesigned frontend without Tauri.
//
// Serves src/ as a static site and drives it with Playwright (chromium from the
// sibling aegis-v2 checkout). The Tauri globals are absent, but the code
// degrades gracefully (no store, no event stream), so the wizard, the ae-*
// controls, the theme picker, and the sweep visualization all render. We drive
// the wizard with real interactions and inject a static run state so both
// phases are captured across several Aegis brands.
//
//   node scripts/screenshot-frontend.mjs            (assumes ../../aegis-v2)
//   node scripts/screenshot-frontend.mjs <aegis>

import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const srcDir = path.join(root, "src");
const outDir = path.join(root, "screenshots");
const aegisRoot = path.resolve(process.argv[2] || path.join(root, "..", "..", "aegis-v2"));

const pwEntry = path.join(aegisRoot, "node_modules", "playwright", "index.js");
if (!existsSync(pwEntry)) {
  console.error(`playwright not found at ${pwEntry} — pass the aegis-v2 path as argv[1].`);
  process.exit(1);
}
const pw = await import(pathToFileURL(pwEntry).href);
const chromium = pw.chromium || (pw.default && pw.default.chromium);
if (!chromium) { console.error("could not load chromium from playwright export"); process.exit(1); }

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".map": "application/json", ".svg": "image/svg+xml" };
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const file = path.join(srcDir, path.normalize(p));
    if (!file.startsWith(srcDir)) { res.writeHead(403).end(); return; }
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const base = `http://127.0.0.1:${port}/`;
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const shots = [];

async function newPage(scheme) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 880 }, colorScheme: scheme });
  await page.goto(base, { waitUntil: "load" });
  await page.waitForFunction(() => customElements.get("ae-button") && customElements.get("ae-segmented") && customElements.get("ae-switch"));
  await page.waitForTimeout(120);
  return page;
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(outDir, name), fullPage: false });
  shots.push(name);
}

async function setTheme(page, theme, variant) {
  await page.evaluate(({ theme, variant }) => {
    const el = document.documentElement;
    for (const a of ["data-theme", "data-variant", "data-collection"]) el.removeAttribute(a);
    if (theme) {
      el.setAttribute("data-theme", theme);
      el.setAttribute("data-collection", theme === "spectrum" ? "spectrum" : "aegis");
    }
    if (variant) el.setAttribute("data-variant", variant);
  }, { theme, variant });
  await page.waitForTimeout(220);
}

// Fill the repo input (via the ae-input's event) and advance the wizard.
async function driveWizard(page, toStep) {
  await page.evaluate(() => {
    const input = document.getElementById("repo-input");
    if (input) {
      input.value = "~/work/payments-api";
      input.dispatchEvent(new CustomEvent("ae-input", { detail: { value: "~/work/payments-api" }, bubbles: true }));
    }
  });
  await page.waitForTimeout(80);
  for (let i = 0; i < toStep; i++) {
    await page.click("#wiz-next");
    await page.waitForTimeout(160);
  }
}

// Static run state — flip to the run phase and inject a representative sweep,
// a result banner, and a root-cause cluster so the results design is captured.
const SAMPLE_SWEEP = `
  <li class="proposal state-success"><span class="proposal-icon"></span>
    <span class="proposal-text"><span class="proposal-subject">react</span>
      <span class="proposal-version"><span class="from">18.2.0</span><span class="arrow">→</span><span class="to">18.3.1</span></span>
      <span class="proposal-reason">Validated — CI passed, no regression.</span></span>
    <span class="proposal-tier tier-compatible">compatible</span><span class="proposal-duration">1.3 s</span><span class="proposal-chevron">▸</span></li>
  <li class="cohort state-success"><div class="cohort-header"><span class="cohort-icon"></span>
    <span class="cohort-name">serde · serde_derive</span><span class="cohort-members-summary">serde, serde_derive</span>
    <span class="cohort-lockstep-tag">lockstep · 2</span></div>
    <ol class="cohort-members">
      <li class="proposal state-success"><span class="proposal-icon"></span><span class="proposal-text"><span class="proposal-subject">serde</span>
        <span class="proposal-version"><span class="from">1.0.197</span><span class="arrow">→</span><span class="to">1.0.203</span></span></span>
        <span class="proposal-tier tier-compatible">compatible</span><span class="proposal-duration">2.4 s</span><span class="proposal-chevron">▸</span></li>
      <li class="proposal state-success"><span class="proposal-icon"></span><span class="proposal-text"><span class="proposal-subject">serde_derive</span>
        <span class="proposal-version"><span class="from">1.0.197</span><span class="arrow">→</span><span class="to">1.0.203</span></span></span>
        <span class="proposal-tier tier-compatible">compatible</span><span class="proposal-duration">2.4 s</span><span class="proposal-chevron">▸</span></li>
    </ol></li>
  <li class="proposal state-failure"><span class="proposal-icon"></span>
    <span class="proposal-text"><span class="proposal-subject">eslint</span>
      <span class="proposal-version"><span class="from">8.57.0</span><span class="arrow">→</span><span class="to">9.3.0</span></span>
      <span class="proposal-reason">Flat config required: .eslintrc.json no longer loaded</span></span>
    <span class="proposal-tier tier-breaking">breaking</span><span class="proposal-duration">2.6 s</span><span class="proposal-chevron">▸</span></li>
  <li class="proposal state-failure"><span class="proposal-icon"></span>
    <span class="proposal-text"><span class="proposal-subject">reqwest</span>
      <span class="proposal-version"><span class="from">0.11.24</span><span class="arrow">→</span><span class="to">0.12.4</span></span>
      <span class="proposal-reason">API break: depends on http 1.0; downstream types changed</span></span>
    <span class="proposal-tier tier-breaking">breaking</span><span class="proposal-duration">3.1 s</span><span class="proposal-chevron">▸</span></li>`;

const RESULT_BANNER = `
  <div class="result-banner bad" role="status">
    <span class="rb-ico">⚠</span>
    <div><div class="rb-title">2 of 5 upgrades need attention</div>
      <div class="rb-sub"><b>3 passed</b> and are safe to apply. The 2 failures are grouped by cause below.</div></div>
    <div class="rb-actions"><ae-button variant="primary" size="sm">Apply 3 passing →</ae-button></div>
  </div>`;

const CLUSTER = `
  <li class="cluster"><div class="cluster-head">
    <span class="cluster-count">2 proposals</span><span class="cluster-fp">fingerprint: config-schema-migration</span></div>
    <div class="cluster-members">eslint, prettier</div>
    <div class="cluster-rep"><div class="cluster-summary">Both upgrades fail because a config file uses an old schema the new major rejects.</div></div></li>`;

async function showRunView(page) {
  await page.evaluate(({ sweep, banner, cluster }) => {
    document.getElementById("setup-view").hidden = true;
    document.getElementById("run-view").hidden = false;
    document.getElementById("step-indicator").hidden = true;
    const status = document.getElementById("run-status");
    status.textContent = "needs attention"; status.setAttribute("tone", "danger"); status.dataset.kind = "error";
    document.getElementById("run-title").textContent = "Validation sweep";
    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    set("count-discovered", "5 found"); set("count-validating", "0 validating"); set("count-passed", "3 passed"); set("count-failed", "2 failed");
    const list = document.getElementById("proposal-list");
    list.innerHTML = sweep; list.hidden = false;
    document.getElementById("empty-state").style.display = "none";
    document.getElementById("filterbar").hidden = false;
    document.getElementById("result-banner-mount").innerHTML = banner;
    const pb = document.getElementById("progressbar"); pb.dataset.done = "fail";
    document.getElementById("progress-fill").style.width = "100%";
    document.getElementById("validate-breaking").hidden = false;
    document.getElementById("run-again").hidden = false;
    const cl = document.getElementById("clusters"); cl.hidden = false;
    document.getElementById("clusters-list").innerHTML = cluster;
  }, { sweep: SAMPLE_SWEEP, banner: RESULT_BANNER, cluster: CLUSTER });
  await page.waitForTimeout(160);
}

// 1. Wizard — Repository step (default dark)
{
  const page = await newPage("dark");
  await setTheme(page, null, "dark");
  await shot(page, "01-wizard-repository.png");
  await page.close();
}
// 2. Wizard — Action step with progressive disclosure (default dark)
{
  const page = await newPage("dark");
  await setTheme(page, null, "dark");
  await driveWizard(page, 2);
  await shot(page, "02-wizard-action.png");
  await page.close();
}
// 3. Wizard — Review step (default dark)
{
  const page = await newPage("dark");
  await setTheme(page, null, "dark");
  await driveWizard(page, 3);
  await shot(page, "03-wizard-review.png");
  await page.close();
}
// 4. Run view — results with banner + cluster (default dark)
{
  const page = await newPage("dark");
  await setTheme(page, null, "dark");
  await showRunView(page);
  await shot(page, "04-run-results.png");
  await page.close();
}
// 5. Run view — default light
{
  const page = await newPage("light");
  await setTheme(page, null, "light");
  await showRunView(page);
  await shot(page, "05-run-light.png");
  await page.close();
}
// 6. Wizard Action — cinnabar
{
  const page = await newPage("dark");
  await setTheme(page, "cinnabar", "dark");
  await driveWizard(page, 2);
  await shot(page, "06-cinnabar-action.png");
  await page.close();
}
// 7. Run view — spectrum source-control-dark
{
  const page = await newPage("dark");
  await setTheme(page, "spectrum", "source-control-dark");
  await showRunView(page);
  await shot(page, "07-source-control-dark-run.png");
  await page.close();
}
// 8. Wizard Action — metro
{
  const page = await newPage("light");
  await setTheme(page, "metro", null);
  await driveWizard(page, 2);
  await shot(page, "08-metro-action.png");
  await page.close();
}
// 9. Run view — crucible
{
  const page = await newPage("dark");
  await setTheme(page, "crucible", null);
  await showRunView(page);
  await shot(page, "09-crucible-run.png");
  await page.close();
}
// 10. Settings drawer + theme picker
{
  const page = await newPage("dark");
  await setTheme(page, "cinnabar", "dark");
  await page.click("#settings-btn");
  await page.waitForTimeout(450);
  await shot(page, "10-settings-theme-picker.png");
  await page.close();
}

await browser.close();
await new Promise((r) => server.close(r));
console.log(`\n  wrote ${shots.length} screenshots to screenshots/`);
for (const s of shots) console.log(`    ${s}`);
