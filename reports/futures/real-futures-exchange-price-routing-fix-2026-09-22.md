# Real Futures exchange price routing — forensic stop report, 2026-09-22

## 1. ROOT CAUSE

The frozen candidate `428c2c3bfb4edbf09cf1423f5aa408684341d65f` wired Binance Contract/Mark candle selection into `syncRealMexcTrades` rather than `syncRealBinanceTrades`. The helper chooses Binance URLs solely from `basis`, with no exchange identity. Its omitted basis defaults to Binance Spot. The previous 287-test suite checked the helper but not the exchange synchronizer call sites. **No code was changed in this task** because the required MEXC-native Futures source and trigger-price semantics are not established by the Production repository or history; the owner's stop condition applies.

## 2. PRODUCTION VS CANDIDATE ROUTING

Production source is established by reading `api/copytrade.ts` at `3d738da8d32ee61e552646c3d2db14715c1ca6ea`; candidate source is established by reading the same file at `428c2c3bfb4edbf09cf1423f5aa408684341d65f`.

| Exchange | Purpose | Production source | Candidate source | Correct source after fix |
| --- | --- | --- | --- | --- |
| Binance Real | Software SL | Binance Spot 1m via `data-api.binance.vision` | Binance Spot 1m, still | Binance USD-M Contract candles |
| Binance Real | Software TP | Binance Spot 1m via `data-api.binance.vision` | Binance Spot 1m, still | Binance USD-M Mark candles |
| MEXC Real | Software SL | Binance Spot 1m, `spotPairFor` | Binance USD-M Contract candles, `futuresPairFor` | **Unresolved:** MEXC-native Futures feed/trigger basis not present in project evidence |
| MEXC Real | Software TP | Binance Spot 1m, `spotPairFor` | Binance USD-M Mark candles, `futuresPairFor` | **Unresolved:** same blocker |
| Binance Real | Re-Analyze / eligibility | Binance Spot candle input | Binance USD-M Contract candles | Binance USD-M Contract candles |
| Binance Real | Entry R:R preflight | Binance Spot ticker | Binance USD-M Contract ticker | Binance USD-M Contract ticker |
| MEXC Real | Pro analysis / entry preflight | Binance Spot market input/ticker | Binance Spot market input/ticker, unchanged | **Unresolved** under the proposed no-Binance-for-MEXC invariant |

The Production MEXC synchronizer comment explicitly says its software observer uses the same Spot candles as Demo; its actual code calls `spotPairFor`, then `fetchKlineExtremes`, whose Production body is hard-coded to Binance Spot. MEXC *execution and native protection orders* use MEXC contract symbols and MEXC APIs, but this does not establish a MEXC-native candle feed or the price field that triggers those orders.

## 3. IMPLEMENTED FIX

**None.** The requested rules conflict at the verified baseline: preserve Production MEXC market-data behavior, yet prohibit any Real MEXC market-data call to Binance. Switching to a newly invented MEXC endpoint or guessing whether its native SL/TP use Last, Fair/Mark or Index would violate the explicit stop instruction and could change live exit timing. An exchange-aware boundary and regression tests remain the next *proposed* implementation after the missing source contract is supplied and approved.

## 4. BINANCE ROUTING

The required Binance mapping is clear but not yet correctly wired end-to-end: Engine/Re-Analyze/eligibility Contract candles, pre-entry Contract ticker, software SL Contract candles, software TP Mark candles, native SL `CONTRACT_PRICE`, native TP `MARK_PRICE`. Candidate `syncRealBinanceTrades` still calls the default Spot window helper for both software exits. A missing Contract/Mark feed must be UNKNOWN/unavailable, never Spot fallback. No Binance route was edited in this task.

## 5. MEXC ROUTING

Production software exit observer used Binance Spot candles, while native MEXC plan orders used MEXC `symbol`, `triggerPrice`, `triggerType`, `trend` and `orderType` fields. The repository has MEXC contract detail and private execution/protection APIs, but no established MEXC Futures candle-window acquisition or documented mapping of native trigger-price basis to a candle field. Candidate instead uses Binance USD-M Contract/Mark candles in the MEXC observer. To proceed safely, the owner must resolve whether to preserve the historical cross-exchange Spot observer despite the new no-Binance invariant, or authorize a separately specified and validated MEXC-native Futures data contract and changed observer behavior. No endpoint or basis was guessed.

## 6. SPOT ISOLATION

No Spot or Demo code was modified during this task. The existing defaulted `fetchKlineExtremes` remains unsafe for an omitted basis in Real Futures; explicit exchange/basis typing is needed in a corrected candidate. Existing Spot/Demo callers and legacy Hyperliquid/Gate callers must be classified and regression-tested before changing the shared helper. Production MEXC's historic Spot observer is a Real Futures caller of the Spot helper, not a Spot trading feature.

## 7. CACHE ISOLATION

Candidate MEXC cache keys are `contract:<Binance pair>:<sinceMs>` and `mark:<Binance pair>:<sinceMs>`; Binance's unchanged key is `<Spot pair>:<sinceMs>`. These do not prove an exchange-aware boundary and omit explicit exchange identity. A future corrected key must include exchange, venue symbol, basis and sinceMs, with tests on a shared cache for Binance/MEXC mixed windows. No cache code was changed.

## 8. TEST RESULTS

No fix or new executable test was produced; previous focused count remains **287/287** on the frozen code, but is insufficient for this defect. No new 288+ count is claimed. The required endpoint-selection, mixed-window, missing-feed, cache-isolation and both-synchronizer routing tests were **not run/added** because the MEXC source contract is unresolved. PostgreSQL, build, API-bundle and TypeScript delta gates were not rerun for a nonexistent revised SHA. The prior full TypeScript comparison (52→52, zero new) is historical evidence only.

## 9. STATIC AUDIT

Relevant candidate call sites: `api/copytrade.ts:1772-1784` defaulted helper and Binance URL selection; `:2484-2500` Real MEXC wrongly on Binance Contract/Mark; `:9916-9926` Real Binance still on Spot; `:9949` Binance eligibility on Contract; `:10349` and `:16906` Binance entry Contract ticker; `:10621-10626` Real Binance pending on Contract versus other modes on Spot; `:11362-11376` server Pro Spot/Contract candle builders; `api/analyze.ts` Real Binance server bridge. Other `fetchKlineExtremes` callers are Demo (`:2245`), Hyperliquid legacy (`:2612`), Gate Real (`:7612`) and Spot cycle watchers (`:4204`, `:5426`); these were not edited. Search across application code found MEXC contract detail/position/order endpoints but no MEXC-native Futures kline-window implementation. Current invariants are **false**: `REAL_MEXC_MARKET_DATA_MUST_NOT_CALL_BINANCE` and `REAL_BINANCE_FUTURES_MUST_NOT_FALLBACK_TO_SPOT`.

## 10. NEW EXECUTABLE SHA

**Not created.** Frozen executable remains `428c2c3bfb4edbf09cf1423f5aa408684341d65f`; documentation-only successor remains `66a2f1dae44d8962ab6c694a95a53ca1e266c7f9`. The isolated candidate worktree stayed clean. Claiming a new tested executable SHA without a justified MEXC source and passing tests would be false.

## 11. REMAINING LIVE-ONLY BLOCKERS

Even after a future routing fix and offline audit, integrated Binance protection replacement/read-back and a newly closed Real Binance fee/funding/ledger reconciliation remain unverified without naturally suitable live lifecycles and separate bounded authorization. No real position or order was created for this report.

## 12. RELEASE STATUS

**BLOCKED — AWAITING NEXT RELEASE AUDIT, contingent first on resolving the MEXC market-data source contract.** The current candidate fails routing correctness and is not ready for merge or deploy. No merge, Production push, Production migration, deployment, Real order, Spot/Demo/Shadow modification, strategy/Engine/Supervisor change or live account-setting change occurred.
