# Real Futures Stage 1B — Native Candle Provenance Instrumentation

## Metadata

- Date: 2026-09-25 (Asia/Kuala_Lumpur)
- Task ID: Real Futures Stage 1B
- Module: Real Futures candle provenance
- Mode: branch-only implementation; no Production action
- Repository: `signal0verse/signalverse-main`
- Branch: `codex/production-deploy-control-20260924`
- Starting commit: `c56aee13b46199b0b101c1db86df8c8c07091bdf`
- Ending commit: `e323f2758dfb0bccc68f4e1a85ca7ff32eccbdbe`

## Objective and scope

Capture future actual Real Futures decision/candle linkage for Binance and MEXC without changing strategy, execution, Spot, Demo, Production runtime or Production database. Stage 1A historical rows remain unproven.

## Files inspected

`api/analyze.ts`, `api/copytrade.ts`, `api/_shared/github-event-log.ts`, the existing decision-linkage/persistence and Futures input tests, `TRADING_STRATEGY.md`, `CLAUDE.md`, `HANDOFF.md`, `docs/AI_HANDOFF.md`, and `docs/testing/stability-test-runbook.md`.

## Git and build status

Seven Stage 1B files were committed on the development branch at the ending commit above; application `main` was not pushed or merged. Both modified API bundles passed isolated `esbuild` validation. Repository-wide TypeScript checking remains non-green for unrelated existing errors, detailed below.

Date: 2026-09-25 (Asia/Kuala_Lumpur); evidence compiled 2026-09-24T16:57Z. Branch: `codex/production-deploy-control-20260924`. This is a branch-only measurement candidate, **not a Production release**.

## Result

**STAGE1B-READY** for a separately authorized, controlled future Production observation. This does not resolve Stage 1A for historical Real decisions: those rows still lack the native candle linkage. No actual post-instrumentation Real decision or exchange/account outcome has been inspected. **IMPROVEMENT PROVEN = NO. PRODUCTION STRATEGY CHANGED = NO.** No Production deployment, schema/database write, exchange call/order, service change, Spot or Demo change occurred in this task.

## Source trace and smallest capture points

1. Real Futures automatic setup/entry and pinned-timeframe reanalysis call `buildFuturesProTimeframeInputs` in `api/copytrade.ts`. Manual Real analysis calls the authenticated `real-binance-market-inputs` or `real-mexc-market-inputs` bridge. These are the server-observed input paths; browser-supplied prices are not authoritative.
2. The Real Binance builder fetches USD-M Contract Price `/fapi/v1/klines`; the Real MEXC builder fetches native Latest Price `/api/v1/contract/kline/{symbol}`. The same fetched array is normalized by `toFuturesProCandles` and supplied to `futuresProComputeIndicators`.
3. At this already-existing fetch/normalization point, capture each scored timeframe's input-selection timestamp, selected final candle's native open/window-start, its native or derived close boundary, price basis, and SHA-256 of the **exact normalized OHLCV array passed to the indicator function**. The hash is a compact scoring-input identifier, not a retained raw snapshot; it is not a proof that the entire market feed was complete.
4. `loadRealFuturesMarketInputs` in `api/analyze.ts` preserves the bridge's per-timeframe metadata. `analyzeOneCoinPro` captures computation start/completion timestamps; the Real Binance open-position `computeFuturesReanalysisDecision` does the same. `captureRealFuturesCandleEvidence` classifies every scored input. Both Engine-first and AI-attributed decision branches, plus Real Binance Re-Analysis, pass the evidence into `buildFuturesDecisionRow`.
5. The existing `engine_decisions` INSERT persists the provenance under `multi_timeframe.candleProvenance`, inside the **same decision row whose `id` is returned to entry/reanalysis**. There is exactly one `inputs[]` element per scored timeframe, in Engine input order. No new table, schema, trading-event stream, or DB `created_at` proxy is used. Existing application code contains no update/delete of `engine_decisions`; this is application-level insert-only provenance, **not a new DB-enforced immutability guarantee**. A failed DB insert yields no durable row and emits `FUTURES_CANDLE_PROVENANCE_PERSISTENCE_FAILED` to service stderr as well as the existing best-effort persistence error logger. An incomplete capture is `UNKNOWN` and emits `FUTURES_CANDLE_PROVENANCE_INCOMPLETE` or `...CAPTURE_FAILED`; it never manufactures a safe timestamp.

## Native semantics and recorded fields

For Binance, `k[0]` is the native Kline open time and `k[6]` the native **inclusive millisecond close time**, retained from the actual USD-M response. The selected final row is the same row used by the indicator input. No Spot/Mark substitution is introduced.

For MEXC, the existing adapter maps REST `data.time[i]` (seconds) to milliseconds. The documented contract Kline time denotes the native **window start**; REST exposes no separate close field. `candleCloseTime` is therefore explicitly **derived**, end-exclusive, as `data.time[i] × 1000 + duration(nativeInterval)`. Existing mapping is `15m→Min15`, `1h→Min60`, `4h→Hour4`, `1d→Day1`, `1w→Week1`. Source: [MEXC contract API documentation](https://mexcdevelop.github.io/apidocs/contract_v1_en/). The separate Binance field semantics are in [Binance USD-M Kline documentation](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Kline-Candlestick-Data).

Each record has `exchange`, `symbol`, `timeframe`, `nativeInterval`, `inputSelectedAt`, `candleOpenTime`, `candleCloseTime`, `closeSemantics`, `priceSource`, `scoringInputSha256`, `captureError`, `atDecision`, `atInputSelection`, and `classification`. The containing object has `version`, `decisionComputationStartedAt`, `decisionComputationCompletedAt`, and `inputs`. The exact decision link is the containing `engine_decisions.id`, not a rounded timestamp. `atDecision` compares the computation-start timestamp with close/boundary; `atInputSelection` separately compares the earlier input-selection timestamp. The combined classification is `FORMING_BAR` if either comparison is forming, `SAFE_CLOSED` only if both are closed, otherwise `UNKNOWN`. The completion timestamp makes the calculation interval auditable; DB `created_at` is never interpreted as decision time. Invalid source/interval/semantics, missing hash/time, or reversed open/close cannot become `SAFE_CLOSED`.

## Files changed

- `api/_shared/futures-candle-provenance.ts` — observation-only types, native interval mapping, deterministic classifier and per-input record builder.
- `api/copytrade.ts` — retain Binance native `k[6]`, attach per-timeframe Real input provenance and scoring-array hash; Spot and Demo builder results unchanged.
- `api/analyze.ts` — attach per-input provenance to existing Real decision INSERTs and surface capture/persistence failures; no Engine, Supervisor, risk, entry, SL/TP, or execution formula changed.
- `scripts/futures-candle-provenance-test.mjs` — offline fixture tests A–F and source/row-output non-regression assertions.
- `scripts/futures-mexc-native-routing-test.mjs` — inject the actual shared native interval constants into its isolated VM fixture after the constant moved; no product behavior change.
- `HANDOFF.md` and this report — handoff/evidence only.

## Verification

- Offline focused and relevant existing Futures suites: `node --test scripts/futures-candle-provenance-test.mjs scripts/futures-real-price-basis-test.mjs scripts/futures-mexc-native-routing-test.mjs scripts/futures-reanalysis-test.mjs` → **158/158 PASS**, zero exchange/DB/network calls from tests. The cases include Binance native index 6, MEXC end-exclusive boundary, distinct selection/computation timestamps, safe/forming/unknown, missing/malformed evidence, decision-row ID linkage, and visible insert failure.
- `node scripts/futures-pro-timeframes-test.mjs` → **18/18 PASS** (selection, default excluding Weekly, create/edit, Real/Demo UI routing).
- `esbuild` bundle validation of `api/analyze.ts` and `api/copytrade.ts` with external packages and `write:false` → zero errors/warnings. `git diff --check` → PASS.
- The actual source bodies of `computeShadowEngineState`, `buildEngineOnlyAnalysis`, `buildEngineReviewPrompt`, `reviewEngineDecisionWithOpenRouter`, `shadowFuturesSetup`, `shadowRiskGates`, `futuresProComputeIndicators`, and `toFuturesProCandles` match pre-change HEAD. The fixture compares the decision row with/without instrumentation and finds all pre-existing output fields equal, including direction, score, chosen interval, entry/SL/TP; Supervisor logic is unchanged. This is **offline non-regression**, not a live execution equivalence proof.
- Repository-wide `npx tsc --noEmit --pretty false` remains non-green because of unrelated pre-existing frontend/module typing errors; no touched API-file errors appeared. Two older structural scripts (`engine-decisions-linkage-test.mjs`, `engine-decisions-persistence-test.mjs`) also fail against pre-existing source assumptions: the persistence script expects two Futures decision INSERT call sites whereas untouched HEAD already has three (including Re-Analysis); linkage has additional stale regex assertions. They are not represented as passes or repaired in this scope.

## Limits and next measurement

Stage 1B does not identify whether any historical Production Real decision used a forming bar. The 186 stale historical observer inputs and 16 changed replay decisions cannot be translated into Real Production impact. No empirical profitability, AI Supervisor effectiveness, or strategy improvement is proven. A future controlled Production observation requires separate release authorization and verification of active SHA; then query actual newly inserted `engine_decisions` rows for both Binance and MEXC, count one provenance entry per scored input, verify IDs/time/basis/hash and classify `SAFE_CLOSED`/`FORMING_BAR`/`UNKNOWN`. Do not treat absent decision rows or persistence warnings as safe. This task does not authorize deployment, a real trade, or Stage 2 strategy work.

Publication plan: commit only these Stage 1B files on the development branch and publish this sanitized report to AI-Log/master. Application `main` is not to be pushed or merged. Exact publication SHA and remote-readback result belong in the final handoff response.
