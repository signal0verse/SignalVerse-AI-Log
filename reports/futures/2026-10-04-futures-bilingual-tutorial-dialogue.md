# Futures tutorial refresh and brand-free bilingual voice scripts

## Metadata

- Date: 2026-10-04 (Asia/Kuala_Lumpur)
- Task ID: futures-tutorial-bilingual-20261004
- Module: Standard Futures customer education / narration preparation
- Mode: local education-only implementation; offline tests and browser preview
- Repository: signal0verse/signalverse-main
- Branch: codex/futures-tutorial-20261004
- Starting commit: f1f4981d48a26ed2aa88af4d46186266b5748dcb
- Ending source commit: 677c2df251bfe533581afca4d8cf702062183773
- Source pushed: NO
- Main changed by this task: NO
- Deployment: NOT REQUESTED / NOT PERFORMED
- Report destination: signal0verse/SignalVerse-AI-Log, master, reports/futures/

## Objective

The owner requested an updated in-app Futures text tutorial covering newly added features, especially Auto Scanner. The owner also requested matched Persian and English narration scripts before video editing, with no brand name in the spoken text. The owner will supply both recordings later.

## Scope

Update education text and floating-help knowledge only. Inspect actual implementation and relevant approved strategy amendments to avoid describing proposals as active features. Prepare voice-ready text and an isolated local preview. No account actions, financial settings, strategy changes, orders, exchange synchronization, migrations or production configuration changes were authorized for this task.

The primary dirty checkout and other contributors' work were preserved. The existing education checkout was tracked-clean, with known untracked public media. It was fast-forwarded from the earlier education checkpoint to current main f1f4981, then a separate local codex/futures-tutorial-20261004 branch was created. Existing media was neither staged nor deleted.

## Actions Taken

1. Read repository instructions, current handoffs, all strategy amendments and the safe test runbook.
2. Compared actual Futures UI, automatic-list cycle consumption, discovery maintenance, eligible re-analysis and accounting with dated implementation/release evidence.
3. Updated only FuturesCustomerCatalog educational content and one import in App.tsx; preserved its entry button, modal, Escape handling, close action and scroll-lock lifecycle.
4. Added a single bilingual lesson source containing 26 paired chapters, rendered as readable expandable chapters with Persian RTL / English LTR.
5. Removed customer-facing proprietary numeric scoring/risk formula disclosures from this tutorial; did not modify the actual engine.
6. Mechanically exported plain spoken and chaptered text from that source. Persian spoken export: 1,959 whitespace-separated words. English: 1,903. No brand spelling in either language.
7. Updated help knowledge to explain confirmed-opening cycle consumption, scanner versus analysis timing, current Demo accounting, removed non-operational controls, and recorded source-version reentry policy.
8. Added safe offline coverage/scope/render/export checks and documentation.
9. Built the web/admin bundles and non-executed API syntax bundles; inspected both languages in the isolated local browser preview.
10. Committed exactly 13 task files locally. No executable source push or production release occurred.
11. Prepared this sanitized mandatory dated work report for separate report-repository publication; remote verification is performed after report publication.

## Files Inspected

Relevant actual source:
- src/app/App.tsx: FuturesCustomerCatalog, FuturesDiscoveryPanel, FuturesProListSection, CopyTradePanel, Re-Analyze options, chart-post help and simulation UI.
- src/app/copyTradeAccounting.ts and src/app/FuturesEconomicsPanel.tsx.
- api/copytrade.ts: consumeFuturesProCycle, confirmed Real/Demo openings, discovery profiles and maintainFuturesDiscoveryRows.
- api/analyze.ts: HELP_ASSISTANT_APP_DESCRIPTION.
- package.json, tsconfig.json, Vite configuration and existing styles.
- AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md, TRADING_STRATEGY.md, colleague handoff and stability runbook.
- Relevant discovery/continuous-scanner and reentry release documents.
- Local five-minute scanner activation evidence and AI-Log prior reentry/Demo accounting rollout evidence.

No private account export, exchange credential file, production trade history or account balance was read.

## Files Changed

Committed source/doc files:
1. HANDOFF.md
2. api/analyze.ts — help-description prose only
3. docs/testing/stability-test-runbook.md
4. src/app/App.tsx — catalog function and content import only
5. src/app/FuturesTutorialContent.tsx
6. src/app/futuresTutorialLessons.ts
7. scripts/futures-tutorial-export.mjs
8. scripts/futures-tutorial-ui-test.mjs
9. docs/training/futures/README.md
10. docs/training/futures/fa-dialogue.txt
11. docs/training/futures/en-dialogue.txt
12. docs/training/futures/fa-chapters.txt
13. docs/training/futures/en-chapters.txt

Local-only artifacts outside the source commit: isolated preview index/config/entry, web/admin builds and two browser screenshots under the owned Futures tutorial preview directory. No generated build, screenshot, voice or video was staged.

## Root Cause / Findings

CONFIRMED:
- The previous tutorial omitted persistent Auto Scanner profiles and did not clearly distinguish candidate discovery, analysis decisions and executed trades.
- Standard automatic-list cycles are consumed on confirmed position opening, not on scans, WAIT outcomes or failed analyses. Two existing form input labels still use the old analysis-attempt wording.
- Five-minute background discovery does not guarantee analysis/execution of every coin within five minutes. Candidate cards are snapshots, not guaranteed continuously refreshed UI.
- Manual and discovery rows share a ten-coin capacity. Discovery maintenance does not remove manual rows or close open positions; target count need not be filled when eligible candidates are insufficient.
- Standard Real exits the entire position at TP1; configurable TP1/TP2/TP3 allocations are Demo-only.
- Eligible open-position Re-Analyze is scoped to Binance Real; it is protection review, not a new/reversed/enlarged trade.
- Corrected Standard Demo results deduct modeled stored fees but exclude unmodeled funding. Virtual balance still settles gross PnL. Unknown accounting is not zero.
- Non-operational standalone profit-protection controls were removed from current UI and are not taught as usable controls.
- Fast Trader remains a separate Demo workflow, not a synonym for Standard Futures.
- Source f1f4981 and prior official rollout reports include the reentry correction and Demo presentation fix. Their earlier successful release evidence is historical evidence, not a new private-account execution test by this task.

UNCONFIRMED:
- Current process/runtime provenance was not revalidated in full. A scoped read-only VPS check returned checkout HEAD f1f4981; a guessed deployment-marker lookup did not yield valid marker evidence and is not counted as runtime confirmation.
- No physical Telegram Android, authenticated private Futures UI, order execution or profitability was tested.
- This new educational change is NOT deployed.

## Implementation

The practical writing guidance influenced the scripts: each chapter describes observable actions, states and limitations, not slogans or internal engine weights. The paired single-source paragraphs prevent drift between app text and voice exports. Speakable exports contain paragraphs only; chaptered exports supply matching titles for later scene planning.

Topics: Demo/Real/access, exchange connection, Personal List, margin/leverage/Isolated/Cross, timeframes, cycles/credit, start/stop, decision method, WAIT reasons, one-off scans, candidate interpretation, persistent per-mode scanner settings, list maintenance, scanning versus analysis queue, pending confirmation/execution, position/chart/protection, exit modes, Re-Analyze, manual closure/reentry, finalized Real economics, Demo model limitations, history/posts, Fast Trader, Simulation Lab and risk checklist.

No voice, movie, timed subtitle, chapter timestamp or Futures YouTube link was created. Final timing must come from the owner-supplied recordings, not guessed chapter lengths.

## Tests Executed

- node scripts/futures-tutorial-export.mjs — PASS: 26 chapters per language; 1,959 FA / 1,903 EN spoken words; brand check and deterministic exports.
- node --test scripts/futures-tutorial-ui-test.mjs — final PASS: 10/10, zero failures/skips. Covers paired content, actual-source rule anchors, rendered directions/26 accordions, extracted actual modal shell, exact App preservation outside catalog/import, exact analyze API preservation outside help literal, unchanged copytrade/strategy/accounting, and exact export parity without fabricated timestamps.
- New education-module TypeScript compile — PASS: zero diagnostics, strict noEmit/Bundler/react-jsx, no app bootstrap.
- API syntax bundles with esbuild, write:false, packages:external, target:node22 — PASS: analyze 326,458 bytes; copytrade 1,148,238 bytes. Output not executed; no env/bootstrap/API handler invocation.
- git diff --check and staged diff check — PASS.
- Browser preview at 390 x 844 — PASS observed: FA RTL / EN LTR; document width 390 equals viewport width 390; 26 chapters; expansion/collapse; close action and body overflow restored; readable text. Screenshots retained locally.

Intermediate diagnostics retained:
- First test run: 7/10. One textual assertion expected different wording; two whole-file comparisons hit Node's default child-process maxBuffer. Fixed the exact negative-confidence wording assertion and increased the read buffer; full exact comparisons remain enforced through SHA-256.
- Initial build launcher used a nonexistent checkout-local node_modules path. Corrected to existing package resolution and Vite API builds; no dependency installation.
- Initial browser navigation timed out but a fresh inventory recovered the created tab and both-language QA succeeded. Later helper calls timed out/reset while attempting to restore normal viewport and mark the tab. These final UI cleanup outcomes are not claimed verified. No browser state loss was treated as a production failure.
- Historical whole-file release gates were not weakened or represented as passed. No new source-delta successor was created in this task.

## Build Result

Final web/admin Vite API builds: PASS, using the actual education checkout and an envDir pointing to the owned preview folder rather than account env files.
- Web: 2,038 modules; 11.00 seconds.
- Admin: 2,038 modules; 8.98 seconds.
- Existing large-chunk warnings remain.
- Host Node: 24.19.0. Authoritative production Node22 Linux CI was NOT run for this local candidate.
- Strict checks were limited to the new education modules, not a claim that the historical whole-project TypeScript diagnostics disappeared.

## Git Status

Local source commit 677c2df251bfe533581afca4d8cf702062183773 on codex/futures-tutorial-20261004.
Source tracked tree clean after commit. Existing untracked public media preserved.
No push to application main or task branch; no deployment/artifact/Guard/service restart.
The report repository was separately fast-forwarded before creating this report; only this report is staged for publication.

## Commit

Application source: 677c2df251bfe533581afca4d8cf702062183773 (local only).
The report publication commit and full remote-byte verification are provided in the final publication receipt; this file cannot self-embed its own commit hash.

## Remaining Issues

- Owner must supply Persian and English recordings before video editing, audio alignment and timed subtitles.
- Existing cycle input-label mismatch remains outside this education-only edit.
- Physical mobile/private-account behavior remains unverified.
- Source promotion to production requires the normal independently reviewed exact successor, full CI and release process. Local tests/builds are not release acceptance.
- Later browser helper timeouts prevented verification of the final viewport/tab cleanup.

## Risks / Limitations

No live account, balances, credit policies, strategy, scanner activation, worker, exchange order, position, SL/TP, close, migration, financial DML or production setting was changed by this task. Existing background autonomous activity was not stopped and is not asserted absent.

Public source checks for general risk/cost wording:
- [Binance Futures fees](https://www.binance.com/en/support/faq/detail/98488a516eb84e3eb34605683dffd554): trading costs, funding paid/received and liquidation.
- [Binance Futures margin modes](https://www.binance.com/en/support/faq/detail/360038075852): shared Cross collateral and mode choice before entry.
- [Bybit USDT contract FAQ](https://www.bybit.com/en/help-center/article/FAQ-USDT-Perpetual-and-Expiry-Contracts): general contract collateral and execution-cost differences, not a claim of app integration.

Report and narration reviewed for credentials, private financial rows, account identifiers, network addresses and proprietary engine formulas. None included. References describe the app's observable workflow and general risks, not trading recommendations or profitability guarantees.

## Recommended Next Step

Give the owner both complete narration texts now. Wait for their recordings, then build and synchronize the two-language educational videos from those actual voices. Keep app source release separate; do not activate trading features or deploy merely to publish training text.
