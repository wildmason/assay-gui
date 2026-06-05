# Vendored Aegis v2

These files are generated — **do not edit by hand**. Regenerate with:

```sh
node scripts/vendor-aegis.mjs
```

| File | What |
|------|------|
| `aegis.js` | `@wildmason/aegis` 2.0.0-alpha.0 element bundle + theme registry, esbuild-bundled with `lit` inlined (self-contained ESM, no bare imports). |
| `aegis.js.map` | Source map for the above (devtools only). |
| `aegis.css` | `tokens.css` + every scheme/brand pack, concatenated in `@layer` order. Drives the in-app theme picker (all brands × variants). |

Source: `..\..\aegis-v2` (`@wildmason/aegis@2.0.0-alpha.0`).
