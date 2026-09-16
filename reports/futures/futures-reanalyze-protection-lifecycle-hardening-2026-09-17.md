# FINAL FOCUSED FIX — Re-Analyze Protection Lifecycle Hardening

**Date:** 2026-09-17 · **Scope:** Binance Algo protection replacement lifecycle for Futures Re-Analyze only. **No deploy, no push to `main`, no order/position touched.** Code committed to the existing feature branch (`futures-liquidation-feasibility-fix`, already merged/deployed for the prior phase — this is a follow-up commit on the same branch, not yet merged again).

## 1. Forensic investigation — what was actually found

**A hard constraint discovered first:** this session has no Binance API credentials for the account (`EXCHANGE_KEY_SECRET` is not present in any local `.env*` file, and the real account's keys in `real_accounts` are encrypted with it). **No live, authenticated Binance API call — read or write — was possible or attempted at any point in this task.** Everything below comes from (a) data already captured by the app itself in `copy_trades`/`futures_reanalysis_audit` from the prior deploy's live production run, and (b) Binance's official public API documentation.

**Observed production symptom** (from the prior deploy's own audit trail, all real): Engine=confirmed same direction, Supervisor=CONFIRM, Risk=SAFE, but the actual Binance protection-replacement call never confirmed — `final_action: 'ERROR'`, `protection_result: 'FAILED'`, on every AUTO_ELIGIBLE trigger observed so far, across multiple symbols and multiple hours. The old protection was never touched in any of these — verified directly (`stop_loss`/`exchange_sl_order_id` in `copy_trades` stayed byte-identical to their original values across every failed attempt).

**The specific algo order you named** (`algoId 30000002197788010`, DASHUSDT TAKE_PROFIT_MARKET, trigger `60.70`, `algoStatus: EXPIRED`) could not be queried live (no credentials), but its reported status is directly informative on its own:

- Binance's official docs (`developers.binance.com`, USDⓈ-M Futures, New/Query Algo Order) confirm `algoStatus` for a conditional order can genuinely be `EXPIRED`, and that this specifically means *"an order that was not triggered before its time frame expired."*
- This directly **contradicts** this codebase's own prior assumption, stated verbatim in `ensureBinanceProtectionLeg`'s comment: *"Binance conditional orders have no expiration, so there is no proactive replacement step."* That assumption is now known to be factually wrong — not a new bug introduced by this session, a previously-undiscovered wrong assumption from an earlier phase, now confirmed wrong by live evidence on this exact account.
- I do **not** have enough evidence to say *why* it expired (the user-visible UI does not expose `goodTillDate`/a documented fixed duration, and I explicitly avoided guessing a number — no "7-day" or any other duration claim appears anywhere in this fix).

**On `timeInForce: 'GTE_GTC'`** — I investigated this as a candidate root cause and deliberately **did not change it**. Reasoning, shown honestly because the evidence is genuinely mixed:
- Some current Binance documentation pages enumerate the Algo Order `timeInForce` values as `GTC, IOC, FOK, GTX, GTD, RPI` — `GTE_GTC` is not in that list.
- But `buildBinanceProtectionParams`'s own comment says this value was **empirically verified** by reading back orders Binance's *own UI* created on this exact account, specifically confirming `GTE_GTC` — meaning at some point, this was observed to be exactly what Binance itself uses for this order type. A separate, community-sourced source also independently describes `GTE_GTC` as a real, historically-valid `timeInForce` specific to STOP_MARKET/TAKE_PROFIT_MARKET conditional orders.
- Given this direct conflict between sources, and given I cannot make a live call to settle it, **changing a live-trading exchange order parameter on an unconfirmed guess was rejected as too risky** — this matches your own instruction not to assume, and your explicit fallback: *"If a controlled live test is absolutely required to validate Binance replacement semantics, STOP and report exactly what is required before executing it."* I'm doing exactly that here (see §6) rather than guessing.
- **My best-supported working hypothesis for the *placement failures specifically*** (distinct from the *expiry* question): Binance's Algo Service may not allow two live `closePosition=true` conditional orders of the same `orderType` (e.g., two STOP_MARKET) on the same symbol/side simultaneously — which is exactly what this project's own "place new before cancelling old" safety ordering deliberately creates for a brief window. This is plausible and consistent with everything observed (the *regular* reconciliation tick, which only ever tries to place a *replacement* when the *existing* one is already gone, never hits this; only Re-Analysis, which intentionally keeps the old one alive while placing a new one, does) — but I could not confirm it against a raw Binance error response, so I'm not treating it as fact. This is the live-test-validated question in §6.

## 2. What was fixed (safe regardless of which hypothesis above turns out to be correct)

1. **`ensureBinanceProtectionLeg`** now looks up (read-only, via the new `queryBinanceAlgoOrderById`, `GET /fapi/v1/algoOrder?algoId=`) exactly why a previously-recorded order is no longer live — `algoStatus`, `createTime`, `updateTime`, `triggerTime`, `goodTillDate` — instead of silently treating "not live" as generically "missing." This diagnostic is folded into every note this function returns, so it's visible in logs on the *regular* reconciliation path too, not just Re-Analysis.
2. **`runFuturesReanalysis`** now returns an explicit `final_action: 'PROTECTION_UPDATE_DEFERRED'` / `protection_result: 'DEFERRED'` — never a bare `'ERROR'` — whenever Engine+Supervisor+Risk all approved a change but Binance would not confirm the new protection. **This code path never writes to `copy_trades` at all** (verified by a dedicated test: no `status` change, no `stop_loss`/`tp1` change) — the position and its existing valid protection are left exactly as they were before the attempt.
3. **The actual Binance-side note for both legs is now captured**, not discarded — stored in `futures_reanalysis_audit.comparison.protection_error: {sl, tp}`.
4. **`computeReanalysisEligibility`** gained a dedicated, bounded, exponential backoff specifically for retrying a deferred protection update — 5-minute base, doubling, capped at 1 hour, and it stops forcing eligibility after 6 consecutive deferrals (still reachable via the ordinary market-change/staleness/AT_RISK triggers, which are completely unmodified). This is deliberately **separate** from the existing market-aware triggers: a deferred protection update is worth retrying on its own schedule, not only when the market also happens to move.
5. **AT_RISK is completely unaffected.** `resolvedByReanalysis = reResult.finalAction === 'SL_TP_UPDATED'` still only matches the literal success value — a `PROTECTION_UPDATE_DEFERRED` result (like the old `'ERROR'` before it) correctly falls through to the existing, **entirely unmodified** unconditional liquidation fail-safe close. A protection-update failure is *never itself* a reason to close; only a genuine liquidation-risk condition is — this was already true before this fix and remains exactly as-is.

**Confirmed unchanged:** Strategy/Engine decision logic, ATR/multiplier/TP formulas, leverage logic, the liquidation-feasibility gate and its formula, the AI Supervisor's reviewer-only architecture, credit/cycle logic, `openBinanceTrade` (never called from this path, unchanged), and the "place-new-before-cancel-old" safety ordering itself (unchanged — this fix only changes what happens *when that ordering's placement step fails*, never the ordering itself).

## 3. Tests

10 new tests added to `scripts/futures-reanalysis-test.mjs` (plus 2 pre-existing dependency lists updated in that file and in `scripts/futures-real-execution-fault-test.mjs` so the new code is actually exercised, not silently skipped by a stale AST-extraction list — confirmed this mattered: the first run after the fix showed the *old* test still passing by accident, because the extraction gap made `runFuturesReanalysis` throw and fall back to the pre-existing catch-all `'ERROR'`, masking the new code entirely. Fixed and re-verified.):

- Deferred outcome never writes to `copy_trades` at all.
- SL leg succeeds but TP leg fails independently → still fully `PROTECTION_UPDATE_DEFERRED`, old orders never cancelled.
- AT_RISK + a deferred (not successful) attempt still falls through to the unmodified fail-safe (structural).
- Backoff: not yet due (attempt 1, too soon) → not eligible.
- Backoff: due (attempt 1, backoff elapsed) → eligible.
- Backoff grows with attempt count (attempt 3 needs longer than attempt 1).
- Backoff is capped, not unbounded exponential growth.
- Dedicated backoff retry stops once the max-attempts cap is reached.
- A non-deferred outcome (success) clears the deferred marker.
- A second consecutive deferred attempt increments the count and **preserves** the original `deferredSince` timestamp (doesn't reset it — otherwise backoff would never actually grow).
- The existing "protection placement failure" test was updated (not just left passing by accident) to assert the new explicit label and captured error text.

**Results:**
```
node --test scripts/futures-reanalysis-test.mjs            → 80/80 PASS (70 pre-existing + 10 new)
node --test scripts/futures-real-execution-fault-test.mjs  → 101/101 PASS (no regression)
node scripts/futures-liquidation-feasibility-test.mjs      → 64/64 PASS (no regression - ensureBinanceProtectionLeg's own contract test still holds)
npx tsc --noEmit -p .                                       → 0 errors in api/copytrade.ts / api/analyze.ts
npm run build                                                → PASS (web + admin)
esbuild api/*.ts --bundle --platform=node --format=esm --packages=external → PASS
```

## 4. Production testing

**No production testing was performed or attempted** — no real position was touched, no real order was placed/cancelled/modified, and (as stated in §1) no live Binance API call of any kind was made, because this session has no credentials to make one. All verification was against the mock harness and previously-captured, already-existing production data.

## 5. Acceptance criteria — honest status

| # | Criterion | Status |
|---|---|---|
| 1 | AUTO Re-Analyze works end-to-end | Partially confirmed live (eligibility, Engine, Supervisor, Risk, DIRECTION_MISMATCH all proven live in the prior deploy); the actual protection-*replacement* success path is **not yet confirmed live** — only the deferred/safe-failure path is new and tested here |
| 2–4 | Engine primary / Supervisor reviewer / Risk independent | Unchanged, still true |
| 5 | Never opens/reverses/resizes | Unchanged, still true |
| 6 | **Never closes merely because SL/TP update failed** | ✅ Now explicit and tested — was already true in effect before this fix (verified in the prior report), now also correctly *labeled*, not just accidentally safe |
| 7 | Existing valid protection preserved during failed replacement | ✅ tested |
| 8 | **Binance protection replacement is actually supported by the implemented lifecycle** | ⚠️ **Not yet fully closed** — see §6. This fix makes failure safe and diagnosable; it does not yet guarantee the replacement itself will succeed, because the exact Binance-side rejection reason for the placement failures is unconfirmed |
| 9 | EXPIRED algo orders correctly detected | ✅ new diagnostic captures algoStatus/createTime/updateTime/triggerTime/goodTillDate |
| 10 | Protection verified from Binance, not assumed | Unchanged — already true (read-after-write already existed) |
| 11 | Automatic retry without spam | ✅ new, bounded, tested |
| 12 | Position closes stop AUTO immediately | Unchanged, still true |
| 13 | Liquidation-risk fail-safe remains independent | ✅ confirmed unaffected |
| 14 | No false CLOSED_MANUAL/CLOSED from Re-Analyze | ✅ confirmed — this code path never writes `status` at all |
| 15 | Exact Binance errors captured | ✅ new (`comparison.protection_error`) |
| 16 | Focused tests pass | ✅ 80/80, 101/101, 64/64 |
| 17 | Build/typecheck pass | ✅ |

**I am not claiming criterion 8 is fully met, per your own explicit instruction not to make the error disappear without actually fixing the lifecycle.** What I've done makes the failure mode fully safe, diagnosable, and self-recovering-with-backoff — but I have not confirmed, with live evidence, that a corrected replacement sequence would actually succeed against Binance's real constraints, because I cannot test that without either credentials or your explicit go-ahead for a controlled live test.

## 6. What a controlled live test would need to actually close criterion 8

To determine (not guess) whether the "place-new-before-cancel-old" ordering is fundamentally incompatible with Binance's Algo Service for same-type `closePosition=true` orders, and to see the *actual* Binance error text instead of my two competing hypotheses:

- **Read-only first, safest**: query `GET /fapi/v1/algoOrder?algoId=30000002197788010` and `GET /fapi/v1/allAlgoOrders?symbol=DASHUSDT` directly (requires the real account's decrypted API key/secret — not available to this session; would need to be run either by you directly, or by this session temporarily granted `EXCHANGE_KEY_SECRET` for a strictly read-only investigation script). This alone would likely explain both the EXPIRED status and, by comparing timestamps against the failed Re-Analysis attempts, whether a live conflicting order was actually present at each failure.
- **If that isn't conclusive**: a genuinely controlled test would mean attempting the "place new SL while an old SL is still live" sequence on a real position and capturing Binance's raw JSON error response — I have deliberately not attempted this, since it is a live write and squarely inside what you told me to stop and ask about rather than improvise.

I'm not asking you to run this now — flagging it as the concrete, specific next step per your own instruction, rather than leaving it vague.

## 7. Explicit confirmations

- No Strategy/Engine/ATR/timeframe/TP-formula/leverage-formula/liquidation-formula/Supervisor-architecture change.
- No credit/cycle logic touched.
- No real order placed, cancelled, or modified. No real position opened, closed, resized, or reversed.
- No live Binance API call of any kind (this session has no credentials for the account).
- No deploy, no push to `main`. Code committed to `futures-liquidation-feasibility-fix` (commit `beeab59`) and pushed to that branch only.
