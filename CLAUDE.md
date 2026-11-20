# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MarketPulse Pro: a no-build, vanilla-JS PWA for tracking stocks, ETFs, bonds, certificates and crypto, with charting, position sizing, multi-portfolio P&L (Italian tax regimes) and Gemini-based analysis. The UI, comments, logs and docs are in **Italian**. Keep new user-facing strings in Italian.

There is no package.json, bundler or test suite. Files are served as they are. `tools/check.py` is the only automated check.

## Workspace rules (from GEMINI.md)

1. **Bump the cache-busting versions with every change.** When you edit `style.css`, `app.js`, `firebase-sync.js` or `firebase-config.js`, update the `?v=NN` query string that loads it:
   - in `index.html` for `app.js` and `style.css`
   - in `app.js` for `firebase-sync.js`
   - in `firebase-sync.js` for `firebase-config.js`

   `firebase.json` sets `max-age=604800` on `.js` and `.css` files, so clients keep old copies until the URL changes.
2. **Run `python3 tools/check.py` after every code change**, and fix anything it reports before you finish. It checks:
   - the syntax of every file (JS with `node --check`, Python, JSON, CSS braces, HTML tags)
   - that every file changed since HEAD has a new `?v=` version
   - that the guide copy embedded in `app.js` matches `ISTRUZIONI.md`
   - that everything synced to Firestore is allowed by `firestore.rules`
3. **Deploy only when the user asks for it in chat.** Never deploy on your own initiative. The live site is https://marketpulsepro-682ff.web.app/.
4. **Never start background scripts or watchers**, for example to monitor Git or `origin/main`.

## Commands

- **Consistency and syntax checks:** `python3 tools/check.py`. It exits with code 1 on failure and needs `node` on the PATH.
- **Run locally (with the API proxy):** `python3 server.py`. It uses only the standard library and binds the first free port among 8080, 8000, 5000, 3000. At startup it refreshes every cached history.
- **Refresh the history cache only:** `python3 server.py --sync` (or `--update`)
- **Deploy to Firebase Hosting (only on request):** `npx --yes firebase-tools deploy --only hosting --project marketpulsepro-682ff`. This is also the default VS Code build task.
- **Deploy Firestore rules (only on request):** `npx --yes firebase-tools deploy --only firestore:rules --project marketpulsepro-682ff`

## Architecture

**Frontend files** (all at the repo root, which is also the hosting `public` dir):
- `index.html`: all markup and modals.
- `app.js`: about 10k lines, one classic (non-module) script. It holds all logic: the global `AppState` object, `DEFAULT_ASSETS`, rendering, the canvas chart engine (main, RSI, MACD), indicators, the risk calculator, portfolios and the help guide.
- `style.css`
- `firebase-sync.js`: an ES module loaded lazily from `app.js` via `import('./firebase-sync.js?v=NN')`. It loads the Firebase SDK v11.9.1 from the gstatic CDN with dynamic imports and handles Auth, Firestore sync of the `/users/{uid}` doc, App Check (reCAPTCHA Enterprise), and Firebase AI Logic (Gemini) structured-JSON calls (`analyzePortfolioWithGemini`, `analyzeAssetWithGemini`).
- `firebase-config.js`: the default web config. A config saved in localStorage under `marketpulse_firebase_config` overrides it.

**Cache busting** is manual (see workspace rule 1). `sw.js` is a deliberate "zero-cache" pass-through service worker: it purges CacheStorage and fetches with `no-store`. Don't add asset caching to it.

**Market-data fetching uses layered fallbacks.** The same frontend runs both with and without `server.py`:
1. First it tries the local `server.py` endpoints: `/api/history`, `/api/search`, `/api/openfigi` (ISIN lookup).
   - `isLocalApiAvailable()` probes `/api/status` once per session and caches the result in `AppState.localApiAvailable`. On Firebase Hosting or any other static server the probe fails, so the local endpoints are skipped.
   - A failure on a single request only falls through to the next source for that request. Don't let one per-request error disable the local server globally.
2. Then it falls back to public CORS proxies (`fetchUrlViaKeylessGateways`: allorigins, corsproxy.io) that wrap Yahoo Finance, along with other sources such as Stooq-style symbols.
3. Crypto comes directly from the Binance REST API. Fear & Greed comes from alternative.me.

`server.py` proxies Yahoo v8 chart and search, with CNBC as a fallback, and keeps an incremental per-symbol bar store in `history_cache.json`. That file is not committed and is excluded from hosting. Responses are rebuilt in the Yahoo v8 chart JSON shape, so the frontend parses one format whatever the source.

**Persistence:** state lives in localStorage under `marketpulse_*` keys (`marketpulse_assets`, `marketpulse_portfolios`, `marketpulse_active_portfolio_id`, `marketpulse_portfolio`, `marketpulse_settings`, `marketpulse_portfolio_sort`, plus `mp_portfolio_rules`). When the user is signed in, `triggerCloudSync()` pushes the same state to Firestore (debounced), and remote snapshots are applied back while `isRemoteUpdateInProgress` is set.

**`firestore.rules` validates the schema strictly** with `hasOnly` key whitelists and type and size checks on the user doc, settings, positions, assets and notes. If you add a field to any data that syncs to the cloud, update the matching validator and the header comment, which documents the data model. Otherwise, once the rules are deployed, every cloud write will be rejected.
- `saveUserDataToCloud` replaces the whole `/users/{uid}` document with `setDoc`, so every field in its payload must be in the `isValidUserDoc` whitelist.
- **Deployed rules differ from this file.** As of 2026-11-20 the project runs a permissive owner-only ruleset, not the strict `firestore.rules` in this repo. Deploy it only on request, and only after `tools/check.py` passes.

**In-app help (`ISTRUZIONI.md`):** this file is the user guide, and it doubles as the most complete functional spec of the app. `app.js` fetches it at runtime and renders it with a small custom Markdown renderer (`renderSimpleHelpMarkdown`). It is deployed on purpose and is not in the hosting ignore list.
- **Structure:** each of its four `## N.` sections becomes an index card and a detail page. The sections are: Watchlist & Ricerca; Analisi, Grafici & Valutazione IA; Rischio & Certificati; Portafogli & Impostazioni. Keep that heading structure.
- **Keep it in sync:** when you change user-facing behavior, update the guide too. That includes keyboard shortcuts (`/`, `1`–`5`, `C`, `R`, `M`, `F`, `?`, `Esc`), category filters, the portfolio fields, the Italian capital-gains rates (12.5% government bonds/white list, 26% stocks/ETFs/certificates, 33% crypto-assets), the what-if simulator and the settings.
- **Before changing behavior,** read the relevant section to see how the feature is meant to work.
- **Embedded copy:** `app.js` keeps a full copy of the guide in `HELP_GUIDE_FULL_MD`, used as an offline fallback (and the fetched file is used only if it contains `## 1.`). Whenever you edit `ISTRUZIONI.md`, update that copy too. `tools/check.py` fails if they differ.

**Hosting:** `firebase.json` serves the repo root and ignores dotfiles, `server.py`, `README.md`, `GEMINI.md`, `CLAUDE.md`, `tools/`, `firestore.rules` and the cache. Any new file at the root gets deployed unless you add it to `ignore`.
