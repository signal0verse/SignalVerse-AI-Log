# Real Futures — final read-only release audit of exact d58 (2026-09-22)

## Metadata

- Date: 2026-09-22 UTC
- Task: Exact-SHA release audit; no implementation or live validation
- Source repository: `SignalVerse-Main`, isolated candidate `codex/futures-correctness-2026-09-22`
- Audited executable: `d58dba78184d80818fc1580890a1c85bf2eb7724`
- Previous executable: `428c2c3bfb4edbf09cf1423f5aa408684341d65f`
- Read-only Production runtime observed during this audit: `3d738da8d32ee61e552646c3d2db14715c1ca6ea`
- Code changes in this audit: NONE

## 1. EXACT SHA VERIFICATION

The local repository resolved the exact commit `d58dba78184d80818fc1580890a1c85bf2eb7724`, parent `66a2f1dae44d8962ab6c694a95a53ca1e266c7f9`, tree `40fe740593d41b298e0a029949d8aa6eee4f86e6`. The isolated candidate checkout was clean. The six paths changed by this commit are `api/analyze.ts`, `api/copytrade.ts`, added `scripts/futures-mexc-native-routing-test.mjs`, and updated `scripts/futures-pro-timeframes-test.mjs`, `scripts/futures-real-execution-fault-test.mjs`, and `scripts/futures-real-price-basis-test.mjs`. A subsequent branch HEAD `9f088fe809c77afed3644fcc133413302d786a27` changes only handoff/testing documentation and was **not** substituted for the executable SHA.

Tests/builds ran from a fresh `git archive` materialization of exact d58. Its `api/copytrade.ts` hash matched Git blob `1667baa63cfe5f555681af9dbe7d1f59149a4d57`. `git diff --check d58^ d58` passed. Temporary audit build outputs were kept outside the candidate checkout.

## 2. CRITICAL FILE/SHA DISCREPANCY

The available attachment directory contained pasted-text/JSON files but **no independently accessible `copytrade.ts` source attachment**. Therefore a byte-for-byte `SAME`/`DIFFERENT` verdict for the purported export is **NOT VERIFIABLE**; neither result is invented. The older generic `fetchKlineExtremes()` implementation described in the request would be different from exact d58: d58 restricts that helper to explicit Spot and introduces an exchange-discriminated Futures market-window helper. The exact Git commit is the sole authoritative source for this audit. The missing independent file comparison remains a requested gate and contributes to `BLOCKED`.

## 3. MEXC ROUTING AUDIT

Static call-path tracing of the exact SHA found Real MEXC initial/manual/automatic Pro analysis using native `MEXC_CONTRACT /api/v1/contract/kline/{symbol}` candles, including server-side re-observation of manually supplied analysis inputs. Native `MEXC_CONTRACT /api/v1/contract/ticker` `lastPrice` supplies Real MEXC min-margin/current price, entry preflight, R:R inputs and trade detail. Pending triggers and `syncRealMexcTrades` read native MEXC `Min1` contract Kline windows. Both software SL and TP use that same Latest-price window; failed, incomplete or malformed Real windows fail closed. The reviewed Real MEXC call graph has no Binance market-data URL, Spot substitute, Binance Futures Kline or Mark Price path. This is a static/offline invariant, **not** a live private-account readback.

## 4. BINANCE ROUTING AUDIT

Real Binance Engine/Re-Analyze eligibility and entry preflight use Binance USD-M Futures Contract candles/ticker. In `syncRealBinanceTrades`, the required Contract and Mark windows are independently requested from `/fapi/v1/klines` and `/fapi/v1/markPriceKlines`; missing either prevents a software-close decision. Software SL probes Contract, software TP probes Mark. The Real Binance path has no silent Spot fallback. Position Re-Analyze remains Binance-only; this audit does not claim MEXC Re-Analyze parity.

## 5. SPOT ISOLATION

The inspected caller/source matrix for `fetchKlineExtremes`, market-window, ticker and current-price helpers is:

| Caller / route | Exchange / mode | Purpose | Actual source | Allowed? |
| --- | --- | --- | --- | --- |
| `syncRealMexcTrades` | MEXC Real | Software SL/TP | MEXC native Latest Kline | Yes; matches native trigger basis |
| MEXC Pro analysis, pending, entry | MEXC Real | Analysis/trigger/current price | MEXC native Kline and ticker `lastPrice` | Yes; no Binance or Spot fallback |
| `syncRealBinanceTrades` | Binance Real | Software SL/TP | Binance Contract/Mark Kline | Yes; matches native bases |
| Binance Re-Analyze, pending, entry | Binance Real | Analysis/trigger/current price | Binance Contract candles/ticker | Yes |
| `syncSpotCycles` and `syncSpotCyclesReal` | Spot | Cycle observer | Binance Spot `data-api.binance.vision` | Yes; explicitly Spot |
| `syncDemoTrades` | Demo | Existing demo observer | Binance Spot | Yes; existing behavior preserved |
| `syncRealGateTrades` | Gate legacy | Existing observer | Explicit Binance Spot | Existing legacy behavior; **not** native parity |
| `syncRealHyperliquidTrades` | Hyperliquid legacy | Existing observer | Explicit Binance Spot | Existing legacy behavior; **not** native parity |
| FastTrader Demo/experimental virtual paths | Demo/experimental | Candle feed | Existing Binance Spot | Outside Real MEXC/Binance call graph |

Repository-wide search covered `BINANCE_FAPI`, both `/fapi/v1` Kline endpoints, `data-api.binance.vision`, `MEXC_CONTRACT`, both MEXC endpoints, `fetchKlineExtremes(`, `spotPairFor(` and `futuresPairFor(`. Existing legacy Spot consumers are not silently reclassified as native Futures feeds.

## 6. CACHE ISOLATION

The Real Futures window key is `exchange:nativeSymbol:basis:sinceMs`; therefore Binance Contract, Binance Mark and MEXC native Latest cannot share entries. The remaining Spot observer keys are separate/explicit `spot:` or Spot-only caches. Real callers use the exchange-discriminated key and do not fall through to the Spot helper on an unavailable Real window.

## 7. PROTECTION SEMANTICS

Exact d58 `placeMexcStopOrder` and `placeMexcTakeProfitOrder` both submit `trend: 1`; the [official MEXC Contract API](https://mexcdevelop.github.io/apidocs/contract_v1_en/) defines `1` as Latest Price (`2` Fair, `3` Index). The software MEXC observer uses the native Latest contract-price Kline for both SL and TP. Binance retains SL=Contract and TP=Mark in the software observer. These are source-code/contract semantics, not a verification that a private exchange order was accepted or read back.

## 8. TEST VERIFICATION

Commands ran against the archive of **exact d58**, not the prior executable or documentation HEAD:

- `node --test --test-reporter=tap` on `futures-reanalysis-test.mjs`, `futures-real-execution-fault-test.mjs`, `futures-correctness-test.mjs`, `binance-final-funding-test.mjs`, `futures-real-price-basis-test.mjs`, `futures-liquidation-feasibility-test.mjs`, `futures-pro-timeframes-test.mjs`, `futures-mexc-native-routing-test.mjs`: **294 pass, 0 fail, 0 skip**.
- `node --test --test-reporter=tap` on `futures-gate-mexc-fault-test.mjs` and five `futures-simulation-{accounting,accounting-ui,capital,execution,chronology}-test.mjs` suites: **153 pass, 0 fail, 0 skip**.
- Web Vite build: PASS. Admin Vite build: PASS. Both output to isolated temporary directories.
- esbuild, `write:false`, `api/analyze.ts` and `api/copytrade.ts`: **2/2 PASS**.
- Credential-loading legacy suites were intentionally not run. The PostgreSQL clone test was not rerun in this exact-SHA audit; its earlier result is historical evidence only.

These checks establish offline correctness for the exercised cases, not private exchange execution or profitability.

## 9. TYPECHECK DELTA

The machine-checkable `futures-typecheck-delta.mjs` comparison used a clean Production baseline at `3d738da8d32ee61e552646c3d2db14715c1ca6ea` versus exact d58. Full diagnostics: **52 → 52, zero new**. Affected API diagnostics: **35 → 30, zero new, five removed**. No `tsconfig.json` change or new suppression was found in the exact d58 delta. Global `tsc` remains **red on baseline diagnostics**; it is not reported as green.

## 10. MIGRATION STATUS

The candidate contains `migrations/futures_reanalysis_claims.sql` followed by `migrations/futures_real_portfolio_capacity.sql`. Their Git blob IDs at previous candidate `428c2c3` and exact d58 are identical, respectively `6499ce0b254b49e345330a914c25afd5825c9555` and `51dc89f4b0010c16dd23edc3f047785f0e40a69b`. Thus the prior disposable schema-clone/apply/reapply/rollback evidence concerns the same SQL bytes. That clone passed historically; it was **not rerun for this audit**. Read-only Production inspection showed the pending reanalysis tables absent. **Production migrations executed: FALSE.** No Production migration was attempted.

## 11. LIVE-ONLY GATES

| Gate | Exact-d58 status |
| --- | --- |
| A. Real Binance protection replacement/read-back | NOT VERIFIED |
| B. Real MEXC protection replacement/read-back | NOT VERIFIED |
| C. Fresh Real fee/funding/PnL/app-ledger reconciliation | NOT VERIFIED |
| D. Production runtime on d58 | NOT VERIFIED; read-only VPS runtime was `3d738da8d32ee61e552646c3d2db14715c1ca6ea` |
| E. Profitability | NO CONCLUSION; correctness tests cannot establish it |

No trade was created to manufacture a sample. The isolated 24-hour Shadow observer, if still running, does not satisfy these private-account gates.

## 12. SCOPE AUDIT

Exact d58 changes only the six executable/test paths listed above relative to its parent. Against Production, `src/app/App.tsx` changes are Real Re-Analyze result labels only; there is no diff to `TRADING_STRATEGY.md`, `lib/strategyEngine.ts` or `tsconfig.json`. Source review found no Engine score/indicator-vote formula, Supervisor authority, live-account setting, Spot strategy, Demo strategy or Shadow-observer change introduced by d58. The adjusted diagnostics and venue routing can affect Real Futures decisions; that is the requested correction, not a claim of live performance. No forbidden-scope modification was made during this audit.

## 13. FINAL RELEASE STATUS

**BLOCKED.** Exact-SHA source/routing/caches/protection semantics and the stated offline test/build/typecheck-delta results were verified. The independently exported `copytrade.ts` was unavailable, so its required SAME/DIFFERENT comparison could not be certified. More importantly, live-only protection read-backs, fresh fee/funding/PnL reconciliation and runtime validation at d58 remain unverified, and pending migrations have not run in Production. Do not interpret this as `READY TO DEPLOY`, `READY FOR PRODUCTION` or `LIVE VERIFIED`.

Recommended next step: obtain the independent export only if its byte-level discrepancy must be resolved; otherwise treat Git d58 as the sole source of truth. A separate owner-approved release/migration plan and naturally available live samples are required before any live-gate conclusion. Do not clear uncertain durable holds or create a trade merely to make a gate green.

**No merge. No Production push. No Production deployment. No Production migration. No Real order. No Spot/Demo/Shadow change.** The only publication for this audit is this sanitized AI-Log report.
