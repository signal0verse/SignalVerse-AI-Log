# CRITICAL SAFETY VERIFICATION — Re-Analyze Close Gating

**Date:** 2026-09-17 · **Scope:** verification and explicitness-hardening of the exact concern raised — can a protection-update failure ever close a position. **No deploy, no push to `main`, no order/position touched.**

## Direct answers

**1. Can `PROTECTION_UPDATE_DEFERRED` ever close a position? NO.**
Verified two ways: (a) `runFuturesReanalysis` itself never writes `copy_trades.status` on this outcome — proven by a sweep test across all 6 non-success `final_action` values. (b) An end-to-end test with a SAFE position (liquidation-wise) whose only active Re-Analysis attempt genuinely reaches `PROTECTION_UPDATE_DEFERRED` (real Engine/Supervisor pass, real forced Binance rejection) confirms `status: 'OPEN'` and the original `stop_loss` untouched afterward.

**2. Can a generic `ERROR` ever close a position? NO.**
Same sweep test covers this explicitly (Engine unavailable via `timeframes.length < 2` → `'ERROR'`, `copy_trades` never touched).

**3. Can `UNKNOWN` ever close a position? NO.**
`UNKNOWN` (from `computeProtectionStatus`) is never checked anywhere in the close-gating condition at all — only the literal `liquidationSafe === false` boolean matters, and `UNKNOWN` corresponds to `liquidationSafe === null`, not `false`. Also unchanged from the original liquidation-feasibility work (`futures-liquidation-feasibility-test.mjs` TEST 14 already covers this and still passes).

**4. What exact condition can invoke the liquidation fail-safe?**
```ts
const liquidationFailSafeShouldClose = liquidationSafe === false && !resolvedByReanalysis;
if (liquidationFailSafeShouldClose) { /* cancel, close, verify flat */ }
```
`liquidationSafe` is computed independently, once per tick, from Binance's actual `liquidationPrice` vs. the trade's raw (never-modified) `stop_loss` — **before** Re-Analysis is even considered. This is now a single, explicitly named boolean (previously the same logic, just expressed as nested `if`s) — a dedicated structural test now fails if the old, less explicit `if (!resolvedByReanalysis)` form is ever reintroduced, and another confirms the sibling non-AT_RISK call site never even reads Re-Analysis's return value, so it has no way to close anything regardless of outcome.

**5. What happens when Binance rejects a new SL/TP?**
`final_action: 'PROTECTION_UPDATE_DEFERRED'`, `protection_result: 'DEFERRED'`. The old, valid protection is never touched (verified: `exchange_sl_order_id`/`stop_loss` byte-identical before and after). The exact Binance-side note for both legs is captured into `futures_reanalysis_audit.comparison.protection_error`. The position stays fully `OPEN`. If this happened during an AT_RISK check specifically, the pre-existing, unmodified liquidation fail-safe still applies on its own independent condition — not because of the rejection itself.

**6. What happens when existing SL/TP is EXPIRED?**
Two things, both already correct with zero new production code required (only new tests + a diagnostic addition):
- `isLiveAlgoOrder` already excludes `EXPIRED` (only `NEW`/`WORKING` count as live) — this was already true before this task.
- The **already-existing, unmodified** regular reconciliation tick (`adapter.ensureProtection`, runs every ~5 minutes for every position regardless of Re-Analysis) automatically attempts to place a fresh replacement whenever the recorded order isn't found live. Proven end-to-end with the real DASH evidence shape: if recovery succeeds → `protection_status: 'SAFE'`; if it also fails → `protection_status: 'UNVERIFIED'` (never `AT_RISK`, never closed) as long as liquidation itself is safe. A new diagnostic (`queryBinanceAlgoOrderById`) now surfaces the actual `algoStatus`/`createTime`/`updateTime`/`triggerTime`/`goodTillDate` in the logs whenever this happens, instead of a generic "missing" note.

**7. Is actual Binance replacement success proven? NO — unchanged from the prior report.**
This session still has no Binance API credentials for the account (no `EXCHANGE_KEY_SECRET`), so no live call was made this pass either. Everything above is proven against the mock harness and the previously-captured production audit trail, not a live Binance response. I am not claiming otherwise.

**8. Exact Binance error, if available.**
No new live evidence was obtained this pass (same constraint as #7). The only concrete Binance-side data available remains what you provided directly: `algoId 30000002197788010`, DASHUSDT, `TAKE_PROFIT_MARKET`/`SELL`, trigger `60.70`, `algoStatus: EXPIRED`. The `timeInForce: 'GTE_GTC'` question from the prior report remains genuinely unresolved (conflicting evidence, not changed, not guessed at).

**9. Tests passed.**
```
node --test scripts/futures-reanalysis-test.mjs            → 83/83 PASS (80 + 3 new critical-invariant structural/sweep tests)
node --test scripts/futures-real-execution-fault-test.mjs  → 105/105 PASS (101 + 2 end-to-end DEFERRED tests + 2 end-to-end EXPIRED-recovery tests)
node scripts/futures-liquidation-feasibility-test.mjs      → 64/64 PASS (one regex-distance bound widened; assertion itself unchanged)
npx tsc --noEmit -p .                                        → 0 errors in api/copytrade.ts / api/analyze.ts
npm run build                                                → PASS
esbuild api/*.ts --bundle --platform=node --format=esm --packages=external → PASS
```
Writing the two new end-to-end tests surfaced **6 real, pre-existing AST-extraction gaps** in `futures-real-execution-fault-test.mjs` (`computeLiveRegimeNow`, `votesFromFastTraderIndicators`, `evaluateOriginalDecisionConsistency`, `classifyReanalysisDiagnosis`, `decideRealTradeAction`, `computeExcursionR`, `mergeRunningExcursion`, `computeLightweightMarketSnapshot`, plus several constants) that had been silently dormant since earlier phases — no test in that file had ever driven `syncRealBinanceTrades` far enough to reach them. All fixed; the file's own coverage is now measurably more complete than before this pass, not just for this one issue.

**10. Files changed.**
- `api/copytrade.ts` — the `liquidationFailSafeShouldClose` explicitness refactor only (no behavior change).
- `scripts/futures-reanalysis-test.mjs` — 3 new tests (critical-invariant structural test, AUTO_ELIGIBLE-never-reads-result structural test, non-success-final_action DB-untouched sweep).
- `scripts/futures-real-execution-fault-test.mjs` — 6 AST-extraction gaps fixed, 4 new end-to-end tests (AT_RISK+DEFERRED-still-closes, SAFE+DEFERRED-stays-open, EXPIRED-recovery-succeeds, EXPIRED-recovery-fails), and a `vm.Context`-realm `console.error` fix that made all of this debuggable in the first place.
- `scripts/futures-liquidation-feasibility-test.mjs` — one regex-distance bound widened (`{0,3500}` → `{0,5000}`) after the explicitness refactor pushed the real distance to 4357 chars; the assertion's own claim is unchanged.

## What was NOT changed
No Strategy/Engine/ATR/timeframe/TP-formula/leverage-formula/liquidation-formula/Supervisor-architecture change. No new database column or migration. No credit/cycle logic touched. This entire pass is a clarity refactor plus verification — the underlying control flow was already correct before today; it is now explicit, tested end-to-end (not just structurally), and the account owner's exact concern has concrete, reproducible test evidence behind the "no" answer rather than just a code-reading claim.

## Safety confirmation
No real order placed, cancelled, or modified. No real position opened, closed, resized, or reversed. No live Binance API call of any kind (read or write) — this session has no credentials for the account. No deploy, no push to `main`. All work committed to `futures-liquidation-feasibility-fix` (commits `b997689`, `a081920`) and pushed to that branch only.
