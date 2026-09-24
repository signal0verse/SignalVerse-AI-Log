# Real Futures Stage 1B — isolated Binance provenance candidate

## Metadata

- Date: 2026-09-25 (Asia/Kuala_Lumpur)
- Task ID: Binance Stage 1B isolation from active Production baseline
- Module: Real Futures candle provenance
- Mode: offline branch-only; no VPS, Production, DB or exchange operation
- Repository: `signal0verse/SignalVerse-Main`
- Branch: `codex/binance-stage1b-isolated-20260925`
- Starting commit: `85aedfb944a67c94227ac343e911bc64a581e79e` (owner-specified active Production SHA)
- Ending commit: `4fd7ebf0b276277a767b48b678e0b25cd9d84bf2`

## Objective and result

Isolate only Stage 1B Binance/Real Futures candle-provenance instrumentation from a mixed Guard/deploy-control branch. **BINANCE-STAGE1B-ISOLATED-READY** means a small offline branch candidate is ready for separate review; it does not authorize deployment. No live Real decision was observed. `IMPROVEMENT PROVEN = NO`; `PRODUCTION STRATEGY CHANGED = NO`.

## Source, ancestry and scope

The mixed application candidate was `e323f2758dfb0bccc68f4e1a85ca7ff32eccbdbe`; its parent carried unrelated deploy-control commits. History and per-commit file lists identified only two Stage 1B source commits: `e323f2758dfb0bccc68f4e1a85ca7ff32eccbdbe` (instrumentation) and `00dfcf6e990c60626b5cadf3c1a29737a443a24e` (Binance validation). These were cherry-picked onto a fresh branch based directly on `85aedfb...`, yielding `227a3a2d7e1889f727995268aeb1bc8a31590124` and `caa404d05d1fc595e39f237feecaa4ff2edff205`. The `HANDOFF.md` conflict was resolved by retaining only Stage 1B sections, not Guard text. Baseline-comparison tests were then pinned to the actual active baseline in commit `3d3cfdba2254723ceaf8a8540643a7f336f87e07`.

The final merge base is exactly `85aedfb944a67c94227ac343e911bc64a581e79e`. Final diff: **10 files, 771 insertions, 10 deletions**, all explainable Stage 1B scope:

| File | Why required / expected change |
|---|---|
| `api/_shared/futures-candle-provenance.ts` | Native timestamp/interval validation and candle-evidence classification |
| `api/copytrade.ts` | Capture native Binance/MEXC candle timestamps, selection time, scoring-input hash |
| `api/analyze.ts` | Link captured evidence to the existing Real decision row; surface capture/persistence errors |
| `scripts/futures-candle-provenance-test.mjs` | Focused evidence and non-regression tests against active SHA |
| `scripts/futures-binance-provenance-validation-test.mjs` | Native Binance boundary and LONG/SHORT parity fixtures against active SHA |
| `scripts/futures-mexc-native-routing-test.mjs` | Supply shared interval constants to its isolated test VM |
| `reports/futures/real-futures-strategy-stage1b-candle-provenance-instrumentation-2026-09-25.md` | Existing implementation evidence |
| `reports/futures/real-futures-strategy-stage1b-binance-validation-2026-09-25.md` | Existing offline validation evidence |
| `reports/futures/real-futures-strategy-stage1b-binance-isolated-candidate-2026-09-25.md` | This branch's isolation audit trail |
| `HANDOFF.md` | Stage 1B-only handoff entries |

Explicitly excluded: `.github/workflows/production-ci.yml`, `.github/workflows/production-release.yml`, `ops/signalverse-deploy*`, `ops/signalverse-release-authorization.mjs`, Guard retry/readiness scripts, deploy-control tests and unrelated documentation. `git diff --quiet 85aedfb... HEAD -- .github ops` returned 0. The application diff contains only provenance capture/plumbing; no Engine, Strategy, Risk, Supervisor, execution, Spot or Demo formula change was intended. Source-equivalence and Binance fixture tests compare the affected decision and risk functions, scored input, direction/score/timeframe, Entry/SL/TP/R:R and mocked Supervisor behavior against the active baseline.

## Checks and build

| Command/check | Result |
|---|---|
| `node --test scripts/futures-candle-provenance-test.mjs` | 6/6 PASS |
| `node --test scripts/futures-binance-provenance-validation-test.mjs` | 35/35 PASS |
| `node --test scripts/futures-real-price-basis-test.mjs scripts/futures-correctness-test.mjs` | 15/15 PASS |
| `node scripts/futures-pro-timeframes-test.mjs` | 18/18 PASS |
| esbuild `write:false` bundle of `api/analyze.ts`, `api/copytrade.ts` | 0 errors, 0 warnings each |
| `git diff --check 85aedfb... HEAD` | PASS |

All checks were local/fixture-only. The isolated worktree used an ignored local `node_modules` junction to the existing checkout; no package install or network request was made. Host Node v24 differs from the preferred Node 22 CI; this remains a release verification item.

## Git state, limits and next step

Final application branch commit: `4fd7ebf0b276277a767b48b678e0b25cd9d84bf2`; clean worktree at audit. No application `main` merge/push, workflow dispatch, approval, VPS access, service start/restart, database access, exchange call, order or Production file change occurred. Runtime SHA was **not** re-observed from the VPS in this task; the active baseline is the owner's supplied SHA, not a fresh runtime assertion. Real Binance forming-bar count, live non-regression and profitability remain unknown.

Next step: separate owner authorization and release gates for any deployment, followed by read-only observation of naturally occurring Real Binance decisions. This report is not deployment authorization.
