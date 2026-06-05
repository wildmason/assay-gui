// Dependency-free smoke test for the assay-gui frontend.
//
// assay-gui ships raw HTML/JS with no bundler and no test runner, so the
// failure modes that actually bite are (1) an element id referenced by main.js
// via $("…") that exists neither in index.html nor in a main.js template (a
// rename breaks `els.foo` silently at runtime), and (2) vendor drift — the
// Aegis bundle losing its self-contained shape or the theme exports the picker
// depends on. This catches both with plain node string checks.
// Run:  node scripts/check-frontend.mjs

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fail = [];
const ok = [];
const check = (cond, msg) => (cond ? ok.push(msg) : fail.push(msg));

const html = await readFile(path.join(root, "src", "index.html"), "utf8");
const js = await readFile(path.join(root, "src", "main.js"), "utf8");
const css = await readFile(path.join(root, "src", "vendor", "aegis", "aegis.css"), "utf8");
const bundle = await readFile(path.join(root, "src", "vendor", "aegis", "aegis.js"), "utf8");

// 1. Every id main.js looks up via $("…") must exist somewhere it can be found
//    at runtime: either declared in index.html, or created by a main.js
//    template string (id="…"). The wizard renders its step bodies imperatively,
//    so several refs (repo-input, cmd-box, banner-apply, …) are the latter.
const htmlIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const jsTemplateIds = new Set([...js.matchAll(/\bid="([a-zA-Z0-9_-]+)"/g)].map((m) => m[1]));
const known = new Set([...htmlIds, ...jsTemplateIds]);
const referenced = new Set([...js.matchAll(/\$\("([^"]+)"\)/g)].map((m) => m[1]));
for (const id of referenced) {
  check(known.has(id), `main.js references #${id} → resolvable (index.html or rendered)`);
}

// 2. The Aegis assets are loaded.
check(/vendor\/aegis\/aegis\.css/.test(html), "index.html links vendor/aegis/aegis.css");
check(/import\s+["']\.\/vendor\/aegis\/aegis\.js["']/.test(js), "main.js imports the aegis.js bundle");

// 3. The bundle is self-contained (no bare imports would fail in a no-bundler
//    browser) and exports the symbols the theme picker imports.
const bareImports = [
  ...bundle.matchAll(/\bimport\s*[\{*\w][^;]*?from\s*["']([^"'./][^"']*)["']/g),
  ...bundle.matchAll(/\bimport\s*["']([^"'./][^"']*)["']/g),
].map((m) => m[1]);
check(bareImports.length === 0, `aegis.js has no bare imports (found: ${[...new Set(bareImports)].join(", ") || "none"})`);
for (const sym of ["THEME_REGISTRY", "applyTheme", "resolveEffectiveVariant", "getThemeBrand", "getThemeVariant", "toast"]) {
  check(js.includes(sym), `main.js imports ${sym}`);
  check(bundle.includes(sym), `aegis.js exports ${sym}`);
}

// 4. The token cascade declares its @layer order before any layered block, and
//    tokens.css is concatenated first.
const layerStmt = css.indexOf("@layer ae-base, ae-scheme, ae-brand");
const firstLayerBlock = css.search(/@layer\s+ae-(base|scheme|brand)\s*\{/);
check(layerStmt !== -1, "aegis.css declares the @layer ae-base,ae-scheme,ae-brand order");
check(layerStmt !== -1 && layerStmt < firstLayerBlock, "aegis.css declares layer order before the first layered block");
check(css.indexOf("tokens.css (base") < css.indexOf("themes/"), "aegis.css concatenates tokens.css before the theme packs");

// 5. The reskin uses ae-* elements (guards against reverting to native controls).
//    Static markup in index.html:
for (const tag of ["ae-button", "ae-input", "ae-select", "ae-checkbox", "ae-tag", "ae-drawer", "ae-alert", "ae-segmented", "ae-empty-state"]) {
  check(html.includes(`<${tag}`), `index.html uses <${tag}>`);
}
//    Wizard controls rendered by main.js:
for (const tag of ["ae-switch", "ae-segmented", "ae-button", "ae-input"]) {
  check(js.includes(`<${tag}`), `main.js renders <${tag}>`);
}

// 6. The two-phase shell is present (wizard + run view) and wired.
for (const id of ["setup-view", "run-view", "wizard-rail", "wizard-content", "wiz-back", "wiz-next", "result-banner-mount", "progressbar"]) {
  check(htmlIds.has(id), `index.html defines #${id}`);
}
for (const fn of ["enterSetup", "enterRun", "renderWizard", "startRun", "buildStartArgs", "renderResultBanner"]) {
  check(js.includes(`function ${fn}`), `main.js defines ${fn}()`);
}

// 7. action → mode mapping covers every assay mode, and only assay-supported
//    flags are emitted (no invented --skip-tier).
for (const flag of ["--validate", "--apply-local", "--apply-pr", "--only-breaking", "--executor", "--unsafe-host-validation", "--threads", "--fail-fast", "--member-gate", "--no-sha-pin-proposals"]) {
  check(js.includes(flag), `buildCommandArgs can emit ${flag}`);
}
check(!js.includes('"--skip-tier"'), "no invented --skip-tier flag emitted (assay has none)");

// --- report ---------------------------------------------------------------
console.log(`\n  ✓ ${ok.length} checks passed`);
if (fail.length) {
  console.error(`\n  ✗ ${fail.length} FAILED:`);
  for (const m of fail) console.error(`      - ${m}`);
  process.exit(1);
}
console.log("  frontend smoke test: all green\n");
