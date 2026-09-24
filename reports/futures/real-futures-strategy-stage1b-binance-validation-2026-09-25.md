# Real Futures Stage 1B — Binance-First Offline Validation

## Metadata

- Date: 2026-09-25 (Asia/Kuala_Lumpur)
- Task ID: Real Futures Stage 1B Binance-first validation
- Module: Real Futures candle provenance
- Mode: offline fixture validation only
- Repository: `signal0verse/signalverse-main`
- Branch: `codex/production-deploy-control-20260924`
- Starting commit: `e323f2758dfb0bccc68f4e1a85ca7ff32eccbdbe`
- Ending commit: `00dfcf6e990c60626b5cadf3c1a29737a443a24e`

## Objective and scope

Validate the existing Stage 1B Binance provenance mechanism before any separate Production observation. Only an offline test, report, and handoff were added; no app executable, database, exchange, Production service, or application main branch was changed.

## Files inspected

`api/_shared/futures-candle-provenance.ts`, `api/copytrade.ts`, `api/analyze.ts`, existing Binance/correctness tests, `TRADING_STRATEGY.md`, `CLAUDE.md`, `HANDOFF.md`, `docs/AI_HANDOFF.md`, and `docs/testing/stability-test-runbook.md`.

Date: 2026-09-25 (Asia/Kuala_Lumpur). Source candidate: `e323f2758dfb0bccc68f4e1a85ca7ff32eccbdbe` on `codex/production-deploy-control-20260924`.

## Executive result

**BINANCE-STAGE1B-PASS** for the **offline technical provenance mechanism only**. The exact Binance native Kline close field survives to the decision row, boundary classification behaves as specified for 15m/1h/4h/1d, and fixture-based before/after trading outputs are identical. **BINANCE_LIVE_PROVENANCE_OBSERVATION = NOT_YET_AVAILABLE.** No post-instrumentation Production decision was inspected, and this branch has not been deployed by this task. No Production forming-bar count, affected Real-decision count, profitability effect, or strategy improvement is claimed. **PRODUCTION STRATEGY CHANGED = NO.**

## Exact chain traced

`fetchRealBinanceContractCandlesAt` reads USD-M `/fapi/v1/klines` and retains the selected row's `k[0]` open and `k[6]` native inclusive close. `buildFuturesProTimeframeInputs` normalizes that same array with `toFuturesProCandles`, passes it to `futuresProComputeIndicators`, captures the selection timestamp and SHA-256 of that exact normalized scoring array, and returns the metadata beside each timeframe input. The authenticated `handleRealBinanceMarketInputs` → `loadRealFuturesMarketInputs` bridge preserves it while discarding client-supplied price as authority. `analyzeOneCoinPro` uses those timeframe inputs for Engine scoring and calls `captureRealFuturesCandleEvidence` → `buildRealFuturesDecisionCandleProvenance`; both Real decision persistence branches pass it to `buildFuturesDecisionRow` → `persistEngineDecision` → the existing `engine_decisions` INSERT. The Real Binance Re-Analysis path passes the same metadata to its decision INSERT. Source and fixture tests cover the exact named functions and the bridge/row/ID chain; no network, exchange or database was contacted.

## Test matrix and boundaries

| Timeframe | Native open / close | Same selected row as indicator input | Exact close | Close −1 ms | Selection before close, completion after | Missing close | Malformed close | Reversed open/close | Missing hash |
|---|---|---|---|---|---|---|---|---|---|
| 15m | PASS | PASS | SAFE_CLOSED | FORMING_BAR | FORMING_BAR | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| 1h | PASS | PASS | SAFE_CLOSED | FORMING_BAR | FORMING_BAR | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| 4h | PASS | PASS | SAFE_CLOSED | FORMING_BAR | FORMING_BAR | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| 1d | PASS | PASS | SAFE_CLOSED | FORMING_BAR | FORMING_BAR | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

All four fixtures use Binance-shaped 12-field Kline arrays with UTC-aligned interval opens and native `close = next open − 1 ms`. For each, the selected final candle's open and close match `k[0]`/`k[6]`; the indicator spy receives that exact selected candle; and `scoringInputSha256` equals the SHA-256 of the precise normalized OHLCV array passed to indicator calculation. Selection time is captured independently of a synthetic later DB-created time; `decisionComputationStartedAt` and `decisionComputationCompletedAt` survive the same decision row. At exact native close both comparisons are SAFE_CLOSED. A one-millisecond-earlier decision is FORMING_BAR. Earlier selection remains FORMING_BAR even if computation starts/completes after close. Invalid evidence never becomes SAFE_CLOSED.

## Before/after non-regression

The test loads the actual pre-instrumentation source from commit `c56aee13b46199b0b101c1db86df8c8c07091bdf` and the current source into isolated VMs. For the **same four Binance Kline fixtures**, separately in LONG and SHORT cases, both versions call their actual candle builder and actual `computeShadowEngineState`, `shadowFuturesSetup`, `shadowRiskGates`, `buildEngineOnlyAnalysis`, `buildEngineReviewPrompt`, and `reviewEngineDecisionWithOpenRouter` functions. Indicator outputs and the provider reply are deterministic fixtures, not live AI. Normalized scored candles, all legacy timeframe-input fields, complete Engine state, direction, raw/effective score, chosen timeframe, setup entry/SL/TP1–3/R:R, volatility, risk blockers/invalidations, user-facing output, exact Supervisor prompt, and mocked Supervisor verdict are equal before/after. This proves fixture-path non-regression, not a Production execution or actual paid Supervisor equivalence test.

## Tests and changes

- `node --test scripts/futures-binance-provenance-validation-test.mjs` → **35/35 PASS** (four timeframe groups × seven boundary subcases, four group assertions, bridge/decision-ID chain, and LONG/SHORT parity).
- `node --test scripts/futures-real-price-basis-test.mjs scripts/futures-correctness-test.mjs` → **15/15 PASS**.
- `node --check scripts/futures-binance-provenance-validation-test.mjs` → PASS. `git diff --check` → PASS.
- Changed files in this task: `scripts/futures-binance-provenance-validation-test.mjs` (new offline test), this report, and `HANDOFF.md`. **No application code, Strategy, Risk, SL/TP, Supervisor, Spot, Demo, Guard, Production, DB/schema, service, workflow, credential, or exchange state changed.** No application `main` merge/push/deploy; no real order.

## Next fastest gate (not executed)

**Technically YES, conditional on a natural new Real Binance analysis decision after a separately authorized instrumentation deployment.** A short, controlled, read-only observation window can connect decision time → scored Binance candle → native `k[6]` → SAFE_CLOSED/FORMING_BAR/UNKNOWN. Minimum evidence: independently verified active runtime SHA containing Stage 1B; UTC window start/end; each new Real Binance `engine_decisions.id`, symbol, every scored timeframe, `inputSelectedAt`, computation start/completion, native open and inclusive close, Contract Price source, scoring-input hash, capture error and both classification fields; plus service persistence-error logs and a decision-count reconciliation so absent rows are not mistaken for safe decisions. A window with no qualifying natural decision is **insufficient**, not PASS. No trade should be manufactured and this report is not deployment authorization.

AI-Log publication and exact task commit SHA are verified separately after this branch-only report commit.
