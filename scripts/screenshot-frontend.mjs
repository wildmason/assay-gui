// Visual-QA the reskinned frontend without Tauri.
//
// Serves src/ as a static site and drives it with Playwright (chromium from
// the sibling aegis-v2 checkout). The Tauri globals are absent, but the code
// degrades gracefully (no store, no event stream), so the shell, the ae-*
// controls, the theme picker, and the sweep-list styling all render. We inject
// a small static sweep so the list isn't empty, then capture several Aegis
// brands + the settings drawer.
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

// A static sample sweep, matching main.js's render markup, so the list shows.
const SAMPLE_SWEEP = `
  <li class="proposal state-success"><span class="proposal-icon"></span>
    <span class="proposal-text"><span class="proposal-subject">serde</span>
      <span class="proposal-version"><span class="from">1.0.197</span><span class="arrow">→</span><span class="to">1.0.210</span></span>
      <span class="proposal-reason">Validated: no regression observed under repo gates.</span></span>
    <span class="proposal-tier tier-compatible">compatible</span><span class="proposal-duration">2.4 s</span><span class="proposal-chevron">▸</span></li>
  <li class="proposal state-failure"><span class="proposal-icon"></span>
    <span class="proposal-text"><span class="proposal-subject">actions/checkout</span>
      <span class="proposal-version"><span class="from">v3</span><span class="arrow">→</span><span class="to">v4</span></span>
      <span class="proposal-reason">Validation failed: workflow referenced removed input (gha:major-bump)</span></span>
    <span class="proposal-tier tier-breaking">breaking</span><span class="proposal-duration">8.1 s</span><span class="proposal-chevron">▸</span></li>
  <li class="cohort state-inprogress"><div class="cohort-header"><span class="cohort-icon"></span>
    <span class="cohort-name">@angular/*</span><span class="cohort-members-summary">core, common, forms, router</span>
    <span class="cohort-lockstep-tag">lockstep · 4</span></div>
    <ol class="cohort-members">
      <li class="proposal state-inprogress"><span class="proposal-icon"></span><span class="proposal-text"><span class="proposal-subject">@angular/core</span>
        <span class="proposal-version"><span class="from">17.3.0</span><span class="arrow">→</span><span class="to">18.0.0</span></span></span>
        <span class="proposal-tier tier-breaking">breaking</span><span class="proposal-duration"></span><span class="proposal-chevron">▸</span></li>
      <li class="proposal state-inprogress"><span class="proposal-icon"></span><span class="proposal-text"><span class="proposal-subject">@angular/router</span>
        <span class="proposal-version"><span class="from">17.3.0</span><span class="arrow">→</span><span class="to">18.0.0</span></span></span>
        <span class="proposal-tier tier-breaking">breaking</span><span class="proposal-duration"></span><span class="proposal-chevron">▸</span></li>
    </ol></li>`;

const browser = await chromium.launch();
const shots = [];

async function shot(page, name) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: true });
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
}

const THEMES = [
  { name: "01-default-dark.png", theme: null, variant: "dark", scheme: "dark" },
  { name: "02-default-light.png", theme: null, variant: "light", scheme: "light" },
  { name: "03-cinnabar-lacquer.png", theme: "cinnabar", variant: "dark", scheme: "dark" },
  { name: "04-source-control-dark.png", theme: "spectrum", variant: "source-control-dark", scheme: "dark" },
  { name: "05-metro.png", theme: "metro", variant: null, scheme: "light" },
  { name: "06-crucible.png", theme: "crucible", variant: null, scheme: "dark" },
];

for (const t of THEMES) {
  const page = await browser.newPage({ viewport: { width: 980, height: 860 }, colorScheme: t.scheme });
  await page.goto(base, { waitUntil: "load" });
  await page.waitForFunction(() => customElements.get("ae-button") && customElements.get("ae-tag"));
  // Inject the sample sweep + reveal the list.
  await page.evaluate((html) => {
    const list = document.getElementById("proposal-list");
    const empty = document.getElementById("empty-state");
    if (list) { list.innerHTML = html; list.hidden = false; }
    if (empty) empty.style.display = "none";
    const status = document.getElementById("run-status");
    if (status) { status.textContent = "running"; status.setAttribute("tone", "accent"); }
    const fb = document.getElementById("filterbar");
    if (fb) fb.hidden = false;
  }, SAMPLE_SWEEP);
  await setTheme(page, t.theme, t.variant);
  await page.waitForTimeout(250);
  await shot(page, t.name);
  await page.close();
}

// Settings drawer + theme picker (default brand).
{
  const page = await browser.newPage({ viewport: { width: 980, height: 860 }, colorScheme: "dark" });
  await page.goto(base, { waitUntil: "load" });
  await page.waitForFunction(() => customElements.get("ae-drawer"));
  await setTheme(page, "cinnabar", "dark");
  await page.click("#settings-btn");
  await page.waitForTimeout(450); // open transition
  await shot(page, "07-settings-theme-picker.png");
  await page.close();
}

await browser.close();
await new Promise((r) => server.close(r));
console.log(`\n  wrote ${shots.length} screenshots to screenshots/`);
for (const s of shots) console.log(`    ${s}`);
