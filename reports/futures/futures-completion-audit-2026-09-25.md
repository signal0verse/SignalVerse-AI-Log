# Futures-only development checkpoint — 2026-09-25

## Metadata

- Date: 2026-09-25
- Module: Real Futures strategy input / architecture
- Mode: isolated local development; no Production deployment
- Repository: SignalVerse-Main
- Branch: `codex/futures-completion-20260925`
- Starting commit: `1cbd0f7572905588d9335ffd426685693ee5df58`
- Ending commit: `9836d0503f69d6f3083cba73ce3b50c5895135db`

## Objective and scope

Audit and advance the Futures-only Engine-first pipeline, correct verified input problems, test locally, and report remaining gaps. No VPS, Guard, application-main push, DB write, credential access, exchange order, Spot/Demo behavior change, or Production deployment was authorized or performed.

## Confirmed findings

1. Real Binance/MEXC Futures Pro consumed the last native Kline in indicator calculations without first requiring that it be closed. Stage 1B recorded provenance but did not prevent forming/stale inputs.
2. Real Gate Futures Pro automatic analysis selected Spot candles; a native Gate Futures candle/provenance bridge is absent.
3. Live `computeShadowEngineState` and historical `runSimulation` remain separate decision implementations. Demo/Real have differing input sources and at least one mode-specific alignment calculation. A single shared complete decision engine is **not proven**.
4. RSI/MACD/Bollinger/StochRSI/EMA contribute to the live five-vote score; EMA200 and market regime are hard gates. FVG/OB/swing/SR are computed but largely attribution, not general entry/SL/TP or score inputs. SL/TP remain ATR geometry. RSI divergence is computed but not an independent live vote. Ichimoku/ADX were not found in the Futures implementation. Funding/OI are context rather than a proved deterministic cost gate.
5. Existing exchange-specific execution/protection/reconciliation and AI reviewer paths exist, but adapter normalization, full Real lifecycle evidence, and measured Supervisor value remain incomplete.

## Implementation and changed files

- Added a pure native closed-candle selector with Binance inclusive and MEXC exclusive close semantics, canonical freshness, ordering, continuity and OHLCV validation: `api/_shared/futures-candle-provenance.ts`.
- Applied the selector before Real Binance/MEXC indicator/scoring calculation and made the scoring hash/provenance refer to the actually selected bars: `api/copytrade.ts`.
- Required `SAFE_CLOSED` evidence at Real analysis entry. Gate Real Pro now rejects analysis before scoring Spot candles, and its automatic Pro tick skips the Spot fallback; existing-position protection/reconciliation were not altered: `api/analyze.ts`, `api/copytrade.ts`.
- Added/updated offline tests: `scripts/futures-closed-native-candles-test.mjs`, `scripts/futures-candle-provenance-test.mjs`, `scripts/futures-binance-provenance-validation-test.mjs`, `scripts/futures-mexc-native-routing-test.mjs`, `scripts/futures-real-price-basis-test.mjs`, `scripts/futures-tp-allocation-test.mjs`, `scripts/simulator-engine-parity-direct-test.mjs`.
- Updated `HANDOFF.md`, `TRADING_STRATEGY.md`, and `reports/futures/futures-completion-audit-2026-09-25.md` in the application branch. The TP test edit only corrected a stale structural regex; TP math was unchanged.

## Tests and build

- Native candle/provenance/routing/correctness/Re-Analyze offline suite: **216/216 PASS**.
- Futures TP allocation standalone: **PASS**.
- Strategy math parity on public BTC/ETH/SOL history: **1,200/1,200 PASS**.
- Simulator direct component parity: **340/340 per symbol** for BTC/ETH/SOL, plus no-look-ahead and structural checks; not full Demo/Real/Simulator decision parity.
- Futures macro-gate parity: boundary and public BTC/ETH/SOL checks **PASS**.
- Six-file broader offline suite: **116/117 PASS**; remaining failure is two stale Spot `start-cycle` structural assertions in `engine-first-consensus-test.mjs`. Spot code was not changed.
- `npm run build`: web/admin **PASS** (Vite large-chunk warning).
- In-memory esbuild bundles for `api/analyze.ts` and `api/copytrade.ts`: **PASS**.
- Repository-wide TypeScript check: **FAIL** due existing frontend/dependency type/module errors; no new diagnostic was recorded in changed Futures files. Typecheck-green status is not claimed.

The frozen historical 24-hour Shadow with 186 stale inputs remains FAIL. Offline parity or mocks do not establish live execution, profitability, Supervisor effectiveness, or fresh Real accounting. No unsafe legacy script that reads local production env/DB was run.

## Status and remaining issues

**FUTURES-INCOMPLETE — not ready for deployment.** Next work is a truly shared pure decision function and whole-decision parity across Demo/Real/Simulator, native Gate Futures input/provenance, unified risk/cost and exchange capability contracts, and paired causal outcome evaluation before changing SMC weights or protection geometry. Fresh prospective Shadow and natural Real exchange lifecycles remain separate gates. No application push or Production action occurred.
