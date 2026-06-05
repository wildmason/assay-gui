// Vendor Aegis v2 into assay-gui's bundler-free frontend.
//
// assay-gui ships its frontend as raw HTML/CSS/JS served directly by Tauri —
// no bundler, no node_modules. Aegis v2 is distributed as `ae-*` Lit custom
// elements whose published `dist/aegis.js` *externalizes* `lit` (bare
// `import ... from "lit"`), so it can't load in a no-bundler browser as-is.
//
// This script produces two self-contained, same-origin assets under
// `src/vendor/aegis/`:
//
//   aegis.js   — the full element bundle + theme registry/applyTheme, with lit
//                INLINED via esbuild, so a plain `<script type="module">` /
//                `import` resolves with zero bare specifiers.
//   aegis.css  — the global token + theme cascade: tokens.css (which declares
//                `@layer ae-base, ae-scheme, ae-brand`) FIRST, then every
//                scheme + brand pack, so the in-app theme picker can switch
//                across all brands × variants at runtime.
//
// Re-run after upgrading the sibling aegis-v2 checkout:
//   node scripts/vendor-aegis.mjs            (assumes ../../aegis-v2)
//   node scripts/vendor-aegis.mjs <path>     (explicit aegis-v2 root)
//
// Prereq: the aegis-v2 checkout must have its deps installed (lit + esbuild)
// and a built `dist/aegis.js` (`npm run build:lib` there). esbuild is invoked
// from aegis-v2's own node_modules, so assay-gui needs nothing installed.

import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const assayRoot = path.resolve(here, "..");
const outDir = path.join(assayRoot, "src", "vendor", "aegis");

const aegisRoot = path.resolve(
  process.argv[2] || path.join(assayRoot, "..", "..", "aegis-v2"),
);

function die(msg) {
  console.error(`\n  vendor-aegis: ${msg}\n`);
  process.exit(1);
}

if (!existsSync(aegisRoot)) {
  die(`aegis-v2 checkout not found at ${aegisRoot} — pass its path as argv[1].`);
}
const distEntry = path.join(aegisRoot, "dist", "aegis.js");
if (!existsSync(distEntry)) {
  die(
    `${distEntry} missing — run \`npm run build:lib\` in the aegis-v2 checkout first.`,
  );
}
const esbuildMain = path.join(aegisRoot, "node_modules", "esbuild", "lib", "main.js");
if (!existsSync(esbuildMain)) {
  die(`esbuild not found in ${aegisRoot}/node_modules — run \`npm install\` there.`);
}

// --- 1. Bundle the element library with lit inlined ------------------------

const esbuild = await import(pathToFileURL(esbuildMain).href);

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const jsOut = path.join(outDir, "aegis.js");
await esbuild.build({
  entryPoints: [distEntry],
  bundle: true,
  format: "esm",
  outfile: jsOut,
  sourcemap: true,
  legalComments: "none",
  // Resolve `lit` and friends from aegis-v2's node_modules.
  absWorkingDir: aegisRoot,
  logLevel: "warning",
});

// Sanity: the bundle must be free of bare specifiers, or it won't load.
const bundled = await readFile(jsOut, "utf8");
const bareImports = [
  ...bundled.matchAll(/\bimport\s*[\{*\w][^;]*?from\s*["']([^"'./][^"']*)["']/g),
  ...bundled.matchAll(/\bimport\s*["']([^"'./][^"']*)["']/g),
].map((m) => m[1]);
if (bareImports.length) {
  die(`bundle still has bare imports (won't load no-bundler): ${[...new Set(bareImports)].join(", ")}`);
}
if (!/THEME_REGISTRY/.test(bundled) || !/applyTheme/.test(bundled)) {
  die("bundle is missing the THEME_REGISTRY / applyTheme exports the picker needs.");
}

// --- 2. Concatenate the token + theme cascade ------------------------------
//
// tokens.css MUST come first: it carries the `@layer ae-base, ae-scheme,
// ae-brand` ordering statement that every scheme/brand block slots into.

const tokensCss = path.join(aegisRoot, "src", "tokens", "tokens.css");
const themesDir = path.join(aegisRoot, "themes");

// Scheme packs before brand packs is cosmetic (layer order is fixed by the
// statement in tokens.css), but keeps the file readable.
const schemePacks = ["light.css", "dark.css", "high-contrast.css"];
const collectionBase = ["spectrum-base.css"];
const { readdir } = await import("node:fs/promises");
const allThemeFiles = (await readdir(themesDir)).filter((f) => f.endsWith(".css"));
const brandPacks = allThemeFiles
  .filter((f) => !schemePacks.includes(f) && !collectionBase.includes(f))
  .sort();

const cssOrder = [
  { label: "tokens.css (base + @layer order)", file: tokensCss },
  ...schemePacks.map((f) => ({ label: `themes/${f}`, file: path.join(themesDir, f) })),
  ...collectionBase.map((f) => ({ label: `themes/${f}`, file: path.join(themesDir, f) })),
  ...brandPacks.map((f) => ({ label: `themes/${f}`, file: path.join(themesDir, f) })),
];

const parts = [
  "/* VENDORED — do not edit. Regenerate via scripts/vendor-aegis.mjs. */\n",
];
for (const { label, file } of cssOrder) {
  if (!existsSync(file)) die(`expected CSS missing: ${file}`);
  parts.push(`\n/* ===== ${label} ===== */\n`);
  parts.push(await readFile(file, "utf8"));
}
const cssOut = path.join(outDir, "aegis.css");
await writeFile(cssOut, parts.join(""), "utf8");

// --- 3. Provenance ---------------------------------------------------------

const pkg = JSON.parse(await readFile(path.join(aegisRoot, "package.json"), "utf8"));
const brandCount = (bundled.match(/data-theme/g) || []).length; // rough, informational
await writeFile(
  path.join(outDir, "VENDORED.md"),
  `# Vendored Aegis v2

These files are generated — **do not edit by hand**. Regenerate with:

\`\`\`sh
node scripts/vendor-aegis.mjs
\`\`\`

| File | What |
|------|------|
| \`aegis.js\` | \`@wildmason/aegis\` ${pkg.version} element bundle + theme registry, esbuild-bundled with \`lit\` inlined (self-contained ESM, no bare imports). |
| \`aegis.js.map\` | Source map for the above (devtools only). |
| \`aegis.css\` | \`tokens.css\` + every scheme/brand pack, concatenated in \`@layer\` order. Drives the in-app theme picker (all brands × variants). |

Source: \`${path.relative(assayRoot, aegisRoot).replace(/\\\\/g, "/")}\` (\`${pkg.name}@${pkg.version}\`).
`,
  "utf8",
);

const cssBytes = (await readFile(cssOut)).length;
console.log("vendor-aegis: wrote");
console.log(`  aegis.js   ${(bundled.length / 1024).toFixed(0)} KB (self-contained, lit inlined)`);
console.log(`  aegis.css  ${(cssBytes / 1024).toFixed(0)} KB (${cssOrder.length} files, tokens first)`);
console.log(`  source     ${pkg.name}@${pkg.version}`);
