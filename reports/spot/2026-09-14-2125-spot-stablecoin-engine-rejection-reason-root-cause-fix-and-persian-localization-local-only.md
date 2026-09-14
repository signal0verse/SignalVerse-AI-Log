# Stablecoin Engine — Rejection-Reason Root-Cause Fix (Allocation Inventory vs. Market Liquidity) + Full Persian Localization (Local Only, No Deploy)

## Metadata

- Date: 2026-09-16 (session continued from 2026-09-15)
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine — Allocation architecture)
- Mode: Local code fix + test, per the user's explicit instruction — **no Commit, no Push, no Deploy, no Production Write, no change to any real Allocation, no Binance order in this task**. Reference report: `reports/spot/2026-09-14-2022-spot-stablecoin-engine-ui-cleanup-richer-monitoring-production-deploy.md` (the last thing actually deployed, commit `af68aeb`).
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: af68aeb1dce64ec3904b21948d1b4d38115a6261
- Ending commit: af68aeb1dce64ec3904b21948d1b4d38115a6261 (**unchanged — nothing was committed or pushed in this task**)

## Objective

The user reported that the Persian UI showed one ambiguous message — "ظرفیت/نقدینگیِ این Allocation برایِ ثبتِ این فرصت کافی نیست" — for what are actually two completely different root causes: (1) the allocation's own held asset balance being short of the required tranche, and (2) the allocation's balance being fully sufficient but the live Binance order book itself lacking depth to fill the trade. The user asked for a genuine, root-cause fix (not a text-only change): the two causes must be reported as distinct reasons, each with a real numeric breakdown (required size, executable size, shortfall, direction, best price, order-book status for a market-liquidity rejection; gross/net profit, fee, execution impact, minimum, shortfall for a profit rejection) — with an explicit "not available" fallback rather than any fabricated number when a figure genuinely cannot be computed. Separately, the user required that **no English word remain visible anywhere in the Persian UI** for this panel (technical identifiers/code/variable names in the codebase are exempt), while the English UI must stay fully unaffected.

## Scope

Local code changes to `api/stablecoin-engine.ts` (decision-engine reason split + diagnostic fields + a new pure historical-detail reconstruction function) and `src/app/App.tsx` (UI rendering + a full Persian-localization pass of the Stablecoin panel), plus new/updated tests in `scripts/stablecoin-engine-test.mjs`, a build, and this report. No SSH, no database write, no migration, no deploy, no push to `signalverse-main`, and no Binance call of any kind was made in this task — this was pure static code editing plus local `node --test`/`npm run build`/`git diff --check` runs.

## Part 1 — Root-Cause Diagnosis

Traced the exact code path in `classifyStablecoinExecutability` (`api/stablecoin-engine.ts`). Two structurally distinct branches were both mapping to the same reason string when `capacityLimited` (the allocation-scoped flag) was set:

| Branch | Real condition | Old reason (both branches) |
|---|---|---|
| `inventoryAvailable < notionalUsd` | The allocation's OWN held asset balance is short | `INSUFFICIENT_OPPORTUNITY_LIQUIDITY` |
| `!bookFullyFilled` | Binance's live order book can't fill the requested notional at any depth | `INSUFFICIENT_OPPORTUNITY_LIQUIDITY` |

**Confirmed: this is exactly the reported bug** — a UI reading only the reason string could never tell "the allocation needs to be topped up / wait for a reverse trade" apart from "this is a live market-liquidity condition, unrelated to the allocation's configuration at all." The non-allocation-scoped legacy path (`capacityLimited` unset) was already correctly split (`'Inventory insufficient'` vs. `'Insufficient liquidity'`) — only the allocation-architecture path had this ambiguity, introduced when the two were originally deliberately merged under one capacity-aware label in an earlier phase.

## Part 2 — The Fix (root-caused, not text-only)

### `api/stablecoin-engine.ts`

- **`StablecoinRejectionReason` split**: added `'INSUFFICIENT_ALLOCATION_INVENTORY'` and `'INSUFFICIENT_MARKET_LIQUIDITY'` as two distinct values. `'INSUFFICIENT_OPPORTUNITY_LIQUIDITY'` is kept in the type union only so already-persisted historical rows (written before this fix) still type-check and can still be labeled/counted — `classifyStablecoinExecutability` never emits it again.
- **`classifyStablecoinExecutability`** now returns the specific reason per branch; **`simulateStablecoinTrade`**'s own execution-time balance re-check (a genuine inventory check) was relabeled the same way for consistency.
- **`StablecoinDecision` extended** with real, non-fabricated diagnostic fields computed from the exact same inputs already used for the decision (never a parallel/guessed calculation): `bestPrice`, `vwapPrice`, `requestedNotionalUsd`, `filledNotionalUsd`, `marketLiquidityShortfallUsd`, `inventoryAvailableUsd`, `inventoryShortfallUsd`, `grossProfitUsd`, `minNetProfitUsd`, `profitShortfallUsd`. These are purely additive — `classifyStablecoinExecutability`'s own inputs/branches/outputs are byte-identical to before, confirmed by diff review (Part 4).
- **New pure function `buildPersistedDecisionDetail`**: reconstructs the same diagnostic shape from an already-persisted `stablecoin_cycle_decisions` row, using only columns that table already stores (`best_price`, `vwap_price`, `filled_notional`, `requested_notional`, `fee_usd`, `execution_impact_usd`, `net_profit_usd`, `gross_spread_pct`, `notional_usd`) — **no migration, no new column**. When a number genuinely wasn't recorded historically (per-decision inventory was never persisted, only ever known live), the corresponding fields are explicitly `null` — never a fabricated `0` or guess, matching the user's explicit "say not available instead of showing a fake number" requirement.
- **`StablecoinAllocationReport` extended** with `opportunitiesInventoryConstrained`/`opportunitiesMarketLiquidityConstrained` (the two new reasons counted separately), while `opportunitiesLiquidityConstrained` remains their backward-compatible sum (also still counting any old, pre-fix ambiguous row already in history).
- **`allocation-status` handler**: extended its `stablecoin_cycle_decisions` select with the extra already-existing columns needed, and attaches a `detail` object (from `buildPersistedDecisionDetail`) onto the `lastDecision` it returns — so the persisted "Latest Cycle" view gets the same rich breakdown the live preview already had.
- **Two related create-allocation/withdrawal error paths** (`select-pair`'s validation errors, `record-profit-withdrawal`'s `WITHDRAWAL_EXCEEDS_AVAILABLE_PROFIT`) were given explicit `code` fields where they lacked one, so the frontend can translate them instead of falling back to a raw English message string.

Verified via `npx tsc --noEmit --strict` (clean) and an explicit diff review confirming `runAllocationCycle`, `persistCycleDecisions`, and `DEFAULT_THRESHOLDS` have **zero modified lines** — this fix touches only reason labeling and purely-additive diagnostic fields, never sizing, thresholds, fee/impact math, or the scheduler.

### `src/app/App.tsx`

- New `StablecoinRejectionDetailRows` component renders the exact numeric breakdown per reason kind: **market-liquidity** (direction, requested size, executable size, shortfall, best price, order-book status), **allocation-inventory** (direction, required size, available balance, shortfall — or an explicit "not recorded for this historical cycle, see Live Market Preview" message when the historical number isn't available), **profit-below-minimum** (gross profit, fee, execution impact, net profit, minimum required, shortfall to minimum). Wired into both the Live Market Preview (live, real-time numbers) and the Latest Persisted Cycle (historical reconstruction) sections of each Allocation's Details view.
- Full Persian-localization pass of the panel, fixing every remaining English word/enum value visible in `fa` mode: "Live Pair Monitor" → "پایشِ زنده‌یِ جفت‌ها", "Allocationها" → "اختصاص‌هایِ سرمایه", mismatched "سرمایه (ROI)" label + bare "ROI" → "سرمایه‌یِ معامله" / "بازدهِ سرمایه", "بهترین Bid/Ask" → "قیمتِ خرید/فروش", "موجودیِ Base/Quote" fallback → "موجودیِ دارایی‌ِ پایه/مقابل", "توقف/شروعِ این Allocation" → "توقف/شروعِ این اختصاصِ سرمایه", bare "Binance" → "بایننس", raw enum values (`RUNNING`, `BUY_BASE`/`SELL_BASE`, `TRADING`) → new `stablecoinSideLabel`/`stablecoinTradingStatusLabel` translators, the `bps` unit → a percent-based formatter (`stablecoinFeePctFromBps`) in `fa` mode, and the "ترید" loanword → the project's own preferred "معامله" throughout. `stablecoinReasonLabel`'s fallback now frames any unrecognized/dynamic reason (e.g. a raw Binance error message) in a Persian sentence rather than showing it bare. English mode (`fa === false`) was left completely untouched — verified by diff review (every edit was inside a `fa ? "…" : "…"` ternary's Persian branch, or a shared/neutral element).

## Files Changed

- `api/stablecoin-engine.ts` — reason split (`INSUFFICIENT_ALLOCATION_INVENTORY`/`INSUFFICIENT_MARKET_LIQUIDITY`), `StablecoinDecision`'s new diagnostic fields, `buildPersistedDecisionDetail` (new, pure), `StablecoinAllocationReport`'s two new counters, `allocation-status`'s extended select + attached detail, two new backend error `code`s.
- `src/app/App.tsx` — `StablecoinRejectionDetailRows` (new), `stablecoinSideLabel`/`stablecoinTradingStatusLabel`/`stablecoinFeePctFromBps` (new), full Persian-localization pass, `STABLECOIN_REASON_LABELS_FA` dictionary extended/corrected, `stablecoinReasonLabel`'s fallback now Persian-framed.
- `scripts/stablecoin-engine-test.mjs` — 2 existing frozen mirrors (`classifyStablecoinExecutabilityV2`, `computeAllocationReport`) updated to the new split; TEST 16 rewritten to prove the two reasons are genuinely distinguishable (not the same code path) and backward-compatible for legacy non-allocation callers; TEST 18 updated for the new counters; TEST 16b (new) verifies the exact numeric diagnostics with the user's own worked example ($5,000 requested / $3,800 executable → $1,200 shortfall); TEST 43 (new) is a structural check against the real `api/stablecoin-engine.ts` source confirming the classifier no longer emits the old ambiguous reason and the decision/report/handler changes are genuinely present; TEST 44 (new) is a structural check against the real `src/app/App.tsx` source confirming every specific English-in-Persian bug named above is fixed and stays fixed.

No other file was touched.

## Tests Executed

| Suite | Result |
|---|---|
| `node --test scripts/stablecoin-engine-test.mjs` | **PASS** — all 44 checks (2 mirrors updated, 4 new/rewritten test blocks) |
| `npm run build` (web + admin) | **PASS** |
| `npx tsc --noEmit --strict` on `api/stablecoin-engine.ts` | **PASS** |
| `git diff --check` | **PASS** (benign Windows LF→CRLF warnings only, not whitespace errors) |
| Diff review confirming `runAllocationCycle`/`persistCycleDecisions`/`DEFAULT_THRESHOLDS` have zero modified lines | **PASS** |

```
 api/stablecoin-engine.ts           | 141 ++++++++++++++++++++---
 scripts/stablecoin-engine-test.mjs | 176 +++++++++++++++++++++++++---
 src/app/App.tsx                    | 230 ++++++++++++++++++++++++++++---------
 3 files changed, 460 insertions(+), 87 deletions(-)
```

## Production Safety

No SSH, no database read or write, no migration, no deploy, no Binance call of any kind occurred in this task — purely static code edits plus local `node --test`/`npm run build`/`tsc`/`git diff --check` runs. No real Allocation was Stopped/Deleted/Reset. `signal0verse/signalverse-main` remains at commit `af68aeb` — nothing committed, nothing pushed. Real Trading remains fully disabled (unaffected by this task).

## Remaining Issues / Awaiting Approval

1. **Awaiting explicit user approval before committing/deploying** the changes in this task.
2. A small number of truly dynamic, runtime-generated reason strings (e.g. a raw Binance HTTP-error or network-exception message surfaced through `verifyPairFeeLive`'s failure path) cannot be pre-translated since they are generated by an external system at request time — `stablecoinReasonLabel`'s fallback now wraps these in an explicit Persian frame ("خطایِ فنیِ نامشخص (متنِ اصلی): …") rather than showing them bare, but the technical detail itself stays in its original language after that frame. Flagged here as a known, deliberate boundary rather than a gap the user should discover independently.
3. The real, pre-fix `71013bfd-.../USDCUSDT` allocation flagged in earlier reports (structurally unable to execute under its original 50/50-seeded inventory) remains unchanged and out of scope for this task.

---

## FINAL STATUS TABLE

```
ROOT CAUSE IDENTIFIED: YES (single ambiguous reason string covering two distinct conditions in classifyStablecoinExecutability)
REASON SPLIT INTO TWO DISTINCT VALUES: YES (INSUFFICIENT_ALLOCATION_INVENTORY / INSUFFICIENT_MARKET_LIQUIDITY)
DIAGNOSTIC NUMBERS ADDED TO DECISION OBJECT: YES (real, derived from existing inputs, never fabricated)
HISTORICAL DETAIL RECONSTRUCTION: YES (buildPersistedDecisionDetail, no migration needed)
"NOT AVAILABLE" SHOWN INSTEAD OF FAKE NUMBERS: YES (historical inventory fields always null when not recorded)
ALLOCATED CAPITAL VS MARKET LIQUIDITY UI DISTINCTION: YES (explicit separate Persian sentence + numeric breakdown)
PROFIT-SHORTFALL BREAKDOWN ADDED: YES (gross/fee/impact/net/minimum/shortfall)
ENGLISH WORDS REMAINING IN PERSIAN UI: NO (full sweep completed, verified structurally)
ENGLISH UI MODE AFFECTED: NO (verified untouched by diff review)
EXECUTION LOGIC CHANGED: NO
MINIMUM PROFIT THRESHOLD CHANGED: NO
FEE/EXECUTION-IMPACT CALCULATION CHANGED: NO
TRADE SIZING/CAPACITY/SCHEDULER CHANGED: NO
REAL ALLOCATION CHANGED: NO
BINANCE ORDER SENT: NO
MIGRATION EXECUTED: NO (none needed for this fix)
BUILD: PASS
REGRESSION TESTS: PASS (44/44, 6 new/updated)
GIT DIFF CHECK: PASS
CODE COMMITTED: NO
CODE PUSHED: NO
PRODUCTION DEPLOYED: NO
AWAITING: user approval before commit/deploy
```
