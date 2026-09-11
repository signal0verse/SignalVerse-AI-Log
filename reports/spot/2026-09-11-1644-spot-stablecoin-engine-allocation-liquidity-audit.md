# Stablecoin Engine — Allocation, Asset-Conflict, Liquidity & Profit-Accounting Redesign: Full Architecture Audit (read-only)

## Metadata

- Date: 2026-09-11
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine)
- Mode: Read-only audit only — no implementation, no migration, no deploy
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: 67138bcd5d6278f79dfd11524d6ef263bd3e3bf8
- Ending commit: 67138bcd5d6278f79dfd11524d6ef263bd3e3bf8 (unchanged — zero commits to signalverse-main from this task)

## Objective

Full architecture audit for a ground-up redesign of the Stablecoin Demo Engine, extending an earlier same-day audit (`reports/spot/2026-09-11-1600-spot-stablecoin-engine-architecture-audit.md`) with a much more specific target model: Live Pair + Fee Monitor with intelligent ranking, strict per-pair capital **Allocations**, a hard **Asset Conflict Rule** (no stablecoin asset may be active in more than one Allocation at a time), non-compounding Trading Capital, an internal (non-Binance-connected) Profit Withdrawal ledger, a future Real-mode Balance Reconciliation + App/Telegram Liquidity Alert design, and expanded missed-opportunity reason tracking. Explicit instruction: **no implementation, no DB/schema change, no migration, no scheduler change, no deploy, no commit/push in the main repo, no Binance order** — audit and a separate Implementation Plan only, saved as a report file in this repository.

## Scope

Read-only re-inspection of `api/stablecoin-engine.ts` (full file), all three Stablecoin migration files, `scripts/stablecoin-engine-test.mjs`, `src/app/App.tsx`'s `StablecoinEnginePanel`, plus new targeted reads for this task: the existing Telegram-notification call pattern in `api/copytrade.ts`, the existing Binance Spot balance-reading function (`getBinanceSpotBalance`), and the existing `spot_profit_withdrawals` migration + its `record_spot_profit_withdrawal` Postgres function (Copy Trading Spot's own profit-withdrawal ledger, and Copy Trading Spot's `spot_setups`/`spot_cycles` schema (proof of an existing, proven "one isolated capital pocket per symbol" precedent already used elsewhere in this codebase). No file was modified anywhere. No migration was run. No production data was changed. No Binance order was placed.

## Actions Taken

1. Re-verified the complete current `api/stablecoin-engine.ts` (907 lines) — this file has not changed since the prior same-day audit, so all structural findings from that audit still apply and are restated here with updated context for the new requirements.
2. Re-verified `migrations/stablecoin_engine.sql`, `migrations/stablecoin_demo_automation.sql`, `migrations/stablecoin_decision_audit.sql`.
3. Re-verified `StablecoinEnginePanel` in `src/app/App.tsx` — no pair-selection UI exists today (unchanged from prior audit).
4. New for this task: located and read the existing Telegram-notification call pattern (`api/copytrade.ts:5800-5812`, `notifyPendingTriggered`) — direct `fetch` to `https://api.telegram.org/bot${botToken}/sendMessage`, no shared helper library, duplicated per-file per this project's established convention.
5. New for this task: located and read `getBinanceSpotBalance(apiKey, apiSecret)` (`api/copytrade.ts:2921-2922`) — an existing, working, signed `GET /api/v3/account` Binance Spot balance reader, already used by Copy Trading Spot's real-balance dashboard and pre-trade balance checks (`api/copytrade.ts:3644-3653`, `4029-4030`, `4179-4190`).
6. New for this task: located and read `migrations/spot_profit_withdrawals.sql` in full — an existing, proven, atomic (`SECURITY DEFINER` + `FOR UPDATE` row lock), idempotent (`request_id` unique constraint) profit-withdrawal ledger and its `record_spot_profit_withdrawal()` Postgres function, built for Copy Trading Spot and directly reusable as a template for the requested Stablecoin profit-withdrawal accounting.
7. New for this task: located and read `spot_setups`/`spot_cycles` schema (`migrations/spot_copytrade.sql:5-44`) — confirms this project already has a proven "one isolated capital pocket per symbol" precedent (`UNIQUE(telegram_id, mode, symbol)` on `spot_setups`, plus an explicit `compound boolean NOT NULL DEFAULT false` column) that the new Stablecoin Allocation model can directly follow instead of inventing a new pattern.
8. Drafted the full 32-section audit plus a separate Implementation Plan section below.

## Files Inspected

- `api/stablecoin-engine.ts` (full file, 907 lines)
- `migrations/stablecoin_engine.sql`
- `migrations/stablecoin_demo_automation.sql`
- `migrations/stablecoin_decision_audit.sql`
- `scripts/stablecoin-engine-test.mjs`
- `src/app/App.tsx` — `StablecoinEnginePanel` and its Terminal-level access gating
- `api/copytrade.ts` — Telegram notification pattern (`notifyPendingTriggered`, lines 5800-5812), `getBinanceSpotBalance` (lines 2921-2922) and its call sites (3644-3653, 4029-4030, 4179-4190)
- `migrations/spot_profit_withdrawals.sql` (full file)
- `migrations/spot_copytrade.sql` (`spot_setups`/`spot_cycles` table definitions, lines 5-44)

## Files Changed

NONE

## Root Cause / Findings

The findings below follow the user's requested 32-point report structure exactly.

### 1. Executive Summary

**CONFIRMED.** The current Stablecoin Demo Engine is a single-pool, single-strategy arbitrage bot with no concept of a user-selected pair, no per-pair capital isolation, no opportunity-capacity ceiling, no profit-withdrawal ledger, and no real-balance reconciliation. It is functionally correct at the pure-math layer (fee, spread, VWAP, fail-closed fee verification are all sound and need no rework) but architecturally flat: it treats the admin's entire stablecoin balance as one undifferentiated pot and trades whichever pair looks best each cycle. This directly caused the reported production symptom (capital intended for USDT/USDC migrating into FDUSD) and blocks every one of the new requirements (Asset Conflict Rule, Required Liquidity, Opportunity Capacity, non-compounding accounting, per-pair missed-opportunity metrics).

### 2. مشکل اصلی Architecture فعلی (Core problem)

**CONFIRMED.** Inventory is modeled as `(setup_id, asset) → balance` (`migrations/stablecoin_engine.sql`, `stablecoin_demo_inventory`, PK `(setup_id, asset)`) — one shared pool per Demo run, not per pair. Every automatic cycle (`runStablecoinDemoCycle`, `api/stablecoin-engine.ts:503-547`) discovers and evaluates **every** currently-tradable stablecoin/stablecoin pair (`discoverStablecoinPairs()`, line 516, completely unfiltered by user intent), ranks all resulting decisions purely by net profit across all pairs (`rankStablecoinDecisions`, line 198, applied at lines 534-535), and executes whichever one pair/side wins that cycle.

### 3. Root Cause انتقالِ سرمایه به FDUSD

**CONFIRMED, with live production evidence** (re-verified, unchanged from the prior audit — no trades have occurred against this exact evidence set since):
```
stablecoin_demo_setups (id=e7ea4738-...): initial_allocation = {"USDC": 2500, "USDT": 2500}
stablecoin_demo_trades (EXECUTED):
  FDUSDUSDC  USDC 2500 -> FDUSD 2503.5   (2026-09-10 23:25:33 UTC)
  FDUSDUSDT  USDT 2500 -> FDUSD 2503     (2026-09-10 23:31:01 UTC)
stablecoin_demo_inventory (current): USDC=0, USDT=0, FDUSD=5006.5
```
Exact code path: `api/stablecoin-engine.ts:516` (unfiltered discovery) → `:518-533` (evaluates `balances[sourceAsset]`, a setup-wide map) → `:534-535` (global best-of-all-pairs ranking) → `:538-539` (`simulateStablecoinTrade`, lines 418-450) which reads/writes `stablecoin_demo_inventory` with zero pair filter (line 419, 439-442). This is deterministic, structural behavior — not a race condition or transient bug.

### 4. Current Inventory Architecture

Covered in §2/§3 above. One row per `(setup_id, asset)`; no pair, no allocation dimension exists anywhere in the schema or the code that reads/writes it.

### 5. Current Pair Discovery

**CONFIRMED correct, no change needed.** `discoverStablecoinPairs()` (`api/stablecoin-engine.ts:275-299`) calls Binance's live `GET /api/v3/exchangeInfo`, filters to symbols where both `baseAsset` and `quoteAsset` are in the fixed `STABLE_ASSETS` name-set (line 91 — an asset classification list, not a pair allowlist), with a 1-hour in-memory cache (line 276). This already satisfies "dynamic, never hard-coded pair universe."

### 6. Current Fee Verification

**CONFIRMED correct at the classifier level, needs earlier exposure.** `verifyPairFeeLive()` (lines 365-379) makes a fresh, signed `sapi/v1/asset/tradeFee` call every time it's invoked — no caching in the decision path. `classifyStablecoinExecutability` (lines 145-160), first check (line 151): `if (!feeVerified) return NOT_EXECUTABLE, 'Fee unverified'` — fail-closed is already unconditional and correct. `stablecoin_fee_verifications` is write-only evidence (one `.insert()` at line 637, `discover-pairs` only), never read by the decision path — confirmed via grep, zero read call sites. `stablecoin_pair_snapshots` is entirely dead — zero references anywhere in the code (grep-verified). What's missing is not the verification mechanism itself, but a **pre-selection eligibility gate** the user sees before configuring an Allocation, and a dedicated Monitor refresh cadence independent of whether a Demo is even running.

### 7. Current Profit / ROI

**CONFIRMED correct formula, wrong scope of what feeds it.** `computeNetProfitUsd` (lines 132-135): gross profit minus fee (USD) minus execution impact (USD) — correct, no change needed. `computeReport`'s ROI (line 241): `roiPct = totalProfitUsd / setup.capitalUsd × 100` — already divides by the user's original capital input, not by any larger figure. The gap is that "Required Liquidity" as a distinct, larger number doesn't exist yet to risk being confused with Trading Capital — the formula itself is already what the new spec wants.

### 8. Current Scheduler

**CONFIRMED, working correctly today, needs re-scoping not redesign.** `signalverse-fast-jobs.timer` (systemd, every 5 minutes) → `/usr/local/libexec/signalverse-jobs` → `POST /api/stablecoin-engine?action=stablecoin-demo-cron-tick` (CRON_SECRET bearer). Inside that action (lines 691-720): finds all `stablecoin_demo_setups` with `status='RUNNING'` for `ADMIN_ID` (line 695), and for each, an atomic compare-and-swap claim on `last_tick_at` (lines 706-710, the exact same idiom as `api/copytrade.ts`'s `claimSpotLadder`/`spot_ladder_claims`) before calling `runStablecoinDemoCycle`. This claim is scoped to one **setup**, not one **pair** — see §23 (Scheduler Safety) for why this remains sufficient under the proposed Asset Conflict Rule.

### 9. Current Database

`stablecoin_demo_setups` (setup-level meta + `last_tick_at` claim), `stablecoin_demo_inventory` (setup×asset pool, no pair dimension), `stablecoin_demo_trades` (append-only ledger, now with `fee_bps`/`executed_price` populated as of the prior turn's monitoring work), `stablecoin_cycle_decisions` (every evaluated decision per cycle, added in the prior turn's audit-trail work — already has `pair`, `side`, `fee_bps`, `fee_verified`, `best_price`, `vwap_price`, `net_profit_usd`, `status`, `reason`, `is_best`, `trade_id`), `stablecoin_pair_snapshots` (dead, unused), `stablecoin_fee_verifications` (write-only evidence, unused by decisions). None of these have any pair-allocation or profit-withdrawal concept today.

### 10. Current UI

**CONFIRMED — no pair-selection UI exists.** `StablecoinEnginePanel` (`src/app/App.tsx:2780+`) collects only a single total `capitalUsd` (`startDemo()`, lines 2906-2914) with a hard-coded "Initial split: 50% USDT / 50% USDC" label (line 2997). The existing "Pairs" monitoring tab (lines 3073+) is purely informational — renders the last automatic cycle's evaluated pairs, no click-to-select, no eligibility/liquidity-quality ranking, no per-allocation breakdown.

### 11. Current Telegram

**CONFIRMED, existing mechanism is directly reusable, no new system needed.** No shared notification library exists in this project — every `api/*.ts` file that sends a Telegram message does so with its own direct `fetch(\`https://api.telegram.org/bot${botToken}/sendMessage\`, ...)` call (e.g. `api/copytrade.ts:5800-5812`, `notifyPendingTriggered`). `api/stablecoin-engine.ts` currently has **zero** Telegram code. Adding Liquidity Warning/Restored/Blocked notifications means adding this exact same duplicated-fetch pattern locally to `api/stablecoin-engine.ts` (matching the project's established no-cross-import convention), targeting `chat_id: ADMIN_ID` — not building a new parallel notification system.

### 12. Gap Analysis

| Requirement | Exists today? |
|---|---|
| Dynamic pair discovery | Yes, correct |
| Live fail-closed fee verification | Yes, correct (at decision time) |
| Order-book VWAP, no fixed slippage | Yes, correct |
| Pair selection by user | **No** |
| Per-pair capital allocation / isolation | **No** |
| Asset Conflict Rule | **No** |
| Opportunity Capacity / Required Liquidity | **No** |
| Non-compounding capital enforcement | Not explicit (currently trivially non-compounding only because there is no per-pair capital concept at all to compound) |
| Internal profit-withdrawal ledger | **No** (but `spot_profit_withdrawals` is a directly reusable template from Copy Trading Spot) |
| Real balance reconciliation | **No** (but `getBinanceSpotBalance` already exists and is directly reusable) |
| App + Telegram liquidity alerts | **No** (but the Telegram-send pattern already exists and is directly reusable) |
| Missed-opportunity reason granularity | Partial — 8 reasons exist today, none distinguish "opportunity blocked by configured capacity" from "Binance order-book too shallow" or "user's own inventory too low" |
| Live Pair Monitor with real ranking | Partial — a read-only, non-ranked, non-eligibility-flagged version exists |
| Real execution kill-switch | Yes, correct (`501`, unconditional) |

### 13. Proposed Allocation Architecture

A new `stablecoin_pair_allocations` table, one row per (setup, pair) the user has explicitly configured and started, each owning its own two-asset inventory slice. This directly mirrors the already-proven Copy Trading Spot precedent: `spot_setups` enforces `UNIQUE(telegram_id, mode, symbol)` — "one active capital pocket per symbol" — the new table applies the same idea at "one active capital pocket per (base, quote) pair," extended with the Asset Conflict Rule described next. Full schema in the Implementation Plan.

### 14. Asset Conflict Rule

**Design, not yet implemented.** Enforced at the database level via a partial unique index on the *asset*, not the pair: since each Allocation names exactly two assets (base, quote), the conflict check is "does either asset of the proposed Allocation already appear in another `ACTIVE` Allocation for this setup." Postgres cannot express "no shared element between two arrays" as a simple unique index directly, so the recommended approach is a companion table `stablecoin_allocation_assets(allocation_id, asset)` (one row per asset per allocation, i.e., exactly two rows per allocation) with a **partial unique index on `(setup_id, asset) WHERE allocation_status = 'ACTIVE'`** (denormalizing `setup_id`/status onto this junction table, or joining allocation status in an enforcement function) — this gives an atomic, race-safe, database-level guarantee, not just an application-level check, matching this project's established pattern of pairing an app-level check with a real DB constraint (see `idx_stablecoin_demo_setups_one_running_per_user` from the prior migration). The API-level `select-pair` action must also re-check explicitly before insert and return a clear, human-readable reason (`ASSET_ALREADY_ALLOCATED: USDC is already used by allocation <id> (USDT/USDC)`) for the UI to display, per the user's explicit UX requirement.

### 15. Trading Capital Model

**Design.** Renamed/clarified as `trading_capital_usd` on the new Allocation row — the ROI denominator, entered once at Allocation creation, never mutated by trading activity (see §11/non-compounding below).

### 16. Opportunity Capacity Model

**Design.** `opportunity_capacity` (integer ≥ 1) on the Allocation row — purely a multiplier input from the user, no independent calculation.

### 17. Required Liquidity Model

**Design.** `required_liquidity_usd = trading_capital_usd × opportunity_capacity`, computed once at Allocation creation (pure function, unit-testable, no network/DB dependency) and stored (not recomputed ad hoc) so historical Allocations remain stable even if the pure formula's presentation changes later.

### 18. Inventory Model

**Design.** `stablecoin_demo_inventory`'s primary key changes conceptually from `(setup_id, asset)` to `(allocation_id, asset)` — see Migration Strategy (§28) for exactly how existing rows are preserved. Each Allocation's two assets are seeded at ~50/50 of `required_liquidity_usd` (matching the user's worked example: Capital $2,000 × Capacity 3 = $6,000 Required Liquidity → ~$3,000/$3,000 initial split), never touched by any other Allocation's trades.

### 19. Profit Accounting Model

**Design, directly modeled on `migrations/spot_profit_withdrawals.sql`.** Realized profit is never mutated or "spent" — it stays exactly what `computeReport`/the trade ledger already compute (sum of `net_profit_usd` over `EXECUTED` trades for that allocation). A new, analogous `stablecoin_profit_withdrawals` table (allocation-scoped instead of setup-scoped) + a new `record_stablecoin_profit_withdrawal()` Postgres function, copying `record_spot_profit_withdrawal()`'s exact shape: `SECURITY DEFINER`, row-locks the allocation (`FOR UPDATE`), computes `available = realized - already_withdrawn`, rejects (`WITHDRAWAL_EXCEEDS_AVAILABLE_PROFIT`) if the requested amount exceeds that, is idempotent via a `request_id` unique constraint so a client retry never double-records. This is explicitly **not** connected to any Binance withdrawal API — it is bookkeeping only, and the UI copy must say so explicitly (per the user's exact requested wording).

### 20. Real Balance Reconciliation

**Design.** For a *future* Real-mode allocation (still disabled/501 today, no change to that in this task), the existing `getBinanceSpotBalance(apiKey, apiSecret)` (`api/copytrade.ts:2921-2922`, signed `GET /api/v3/account`) is the exact mechanism to duplicate into `api/stablecoin-engine.ts` (per this project's no-cross-import convention). A periodic reconciliation tick (piggybacked on the same 5-minute scheduler cadence, not a new one) compares `required_liquidity_usd` for each active Real Allocation against the live free balance of its two assets, computing an explicit `shortfall_usd` when negative — never silently treated as "no opportunity."

### 21. Alert Architecture

**Design.** Three explicit states per Real Allocation, derived purely from the reconciliation check above — no new fabricated data: `GREEN` (available ≥ required), `YELLOW` (available ≥ some fraction, e.g. covers at least 1 of `opportunity_capacity` tranches, but not full capacity), `RED` (available < one tranche, i.e., trading that allocation is not currently possible at all). State transitions (not raw levels) drive both the in-app banner and the Telegram message, so a steady RED state doesn't spam repeated notifications every 5 minutes — only entering and leaving RED/YELLOW fires a message.

### 22. Telegram Notification Architecture

Per §11/§21: reuse the exact `fetch`-to-`sendMessage` pattern already in this codebase, duplicated locally into `api/stablecoin-engine.ts`, targeting `chat_id: ADMIN_ID`, fired only on Alert *state transitions* (not every tick), bilingual message templates matching the user's example wording.

### 23. Scheduler Safety

**CONFIRMED — the existing setup-level claim remains sufficient, no per-pair scheduler complexity is needed**, precisely *because* of the Asset Conflict Rule: since no two active Allocations in the same setup can ever share an asset, and there is only one setup (`ADMIN_ID`'s), all active Allocations for that setup can safely be processed **sequentially within the same single `runStablecoinDemoCycle` invocation** (one claim, one cycle, loop over active Allocations inside it) — exactly the same structural pattern as today's inner loop over discovered pairs, just now scoped to `ACTIVE` Allocations instead of the full Binance-wide discovery set. No new lock table, no per-pair claim, no additional scheduler complexity is justified by this audit. This directly satisfies the user's explicit "keep the architecture simple, don't build per-pair scheduler complexity unless proven necessary" instruction — it is not necessary.

### 24. Database Changes Required

See Implementation Plan below for exact DDL. Summary: one new `stablecoin_pair_allocations` table, one new `stablecoin_allocation_assets` junction table (for the Asset Conflict partial-unique-index), one new `stablecoin_profit_withdrawals` table + one new Postgres function (`record_stablecoin_profit_withdrawal`), and an `allocation_id` column added to `stablecoin_demo_inventory`, `stablecoin_demo_trades`, and `stablecoin_cycle_decisions` (nullable, for backward compatibility with pre-existing rows — see §29).

### 25. API Changes Required

New actions: `select-pair` (create an Allocation — validates eligibility + Asset Conflict, computes Required Liquidity, seeds inventory), `stop-pair-allocation`, `record-profit-withdrawal`, `allocation-status` (per-allocation monitoring). Modified actions: `start-demo` (no longer performs any trading-relevant setup beyond creating the bare Demo shell — capital/pair decisions move to `select-pair`), `runStablecoinDemoCycle` (loop scoped to `ACTIVE` allocations, not raw discovery), `pair-monitoring` (must add explicit `eligible: boolean`, ranking, and Asset-Conflict-aware "why can't I select this" reasoning), `demo-status`/`trade-history`/`decision-history` (must accept an optional `allocationId` filter). Unchanged: `discover-pairs` (still a valid informational/manual action), `connect-verification-account`, `real-execute` (still `501`), the entire cron-gating/access-model work from the prior two turns.

### 26. UI Changes Required

Full replacement of the current single-capital-input flow with: Live Pair Monitor (ranked, eligibility-flagged, Asset-Conflict-aware) at the top → click an eligible pair → Configuration panel (Trading Capital, Opportunity Capacity, auto-computed Required Liquidity) → per-allocation Start/Stop → a new Accounting section (Total Realized Profit / Recorded Withdrawals / Available Profit / "Record Profit Withdrawal" button with the exact bookkeeping-only disclaimer copy the user specified) → Monitoring extended to show all requested per-allocation metrics (§18 below) and, for a future Real allocation, the GREEN/YELLOW/RED liquidity banner.

### 27. Monitoring Changes Required

Per-allocation: Pair, Capital, Capacity, Required Liquidity, Current Inventory (both assets), Available remaining capacity, Realized Profit, ROI, Observed/Captured/Missed opportunity counts (missed further split by reason, using the expanded 8-reason enum below), Liquidity Alert state (Real only, for now inert/future).

### 28. Migration Strategy

Purely additive, following this project's own established convention (see prior two Stablecoin migrations, both additive/idempotent). Recommended sequencing: (1) create the new tables with `allocation_id` columns added as **nullable** to the three existing tables; (2) a one-time data-migration statement that creates exactly one "Legacy/Mixed" Allocation per existing setup and back-fills `allocation_id` on all its pre-existing inventory/trade/decision rows, so no history is lost, deleted, or fabricated; (3) only after that backfill, the application code switches to requiring `allocation_id` on all new writes. This exactly matches this project's own precedent from the prior `stablecoin_demo_automation.sql` migration, which found and safely remediated 18 pre-existing duplicate RUNNING rows before adding its own new constraint, rather than assuming clean data. **No migration was written or run in this task** — this is a strategy recommendation only.

### 29. Backward Compatibility

Directly covered by §28's backfill step — every existing `stablecoin_demo_trades`/`stablecoin_cycle_decisions`/`stablecoin_demo_inventory` row keeps its exact current values and gains only a new `allocation_id` pointing at the auto-created Legacy allocation; `computeReport`/history queries continue to work unmodified for that legacy data, while all new activity is fully allocation-isolated.

### 30. Complete Test Plan

The user's lettered scenarios A–V, restated as concrete test targets (pure-function and structural, per this project's `node --test` convention, no live Binance calls required for any of them except where explicitly noted):
- **A/B/C** — Asset Conflict Rule: pure-function test of the conflict-check predicate given a set of already-ACTIVE allocations' asset pairs; confirm USDT/USDC + FDUSD/USDC rejected (shared USDC), USDT/USDC + USDT/USD1 rejected (shared USDT), USDT/USDC + FDUSD/USD1 allowed (fully disjoint).
- **D/E** — `computeRequiredLiquidityUsd(capital, capacity)` pure-function table test for capacity 1 through 4+.
- **F/G** — simulate 3 sequential same-direction opportunities against a capacity-3 allocation (all captured, inventory drifts as the user's worked example describes) vs. a capacity-1 allocation (the 2nd identical opportunity is rejected specifically with `INSUFFICIENT_OPPORTUNITY_LIQUIDITY`, never `NO_OPPORTUNITY`).
- **H** — after a profitable trade, assert `trading_capital_usd` on the allocation row is byte-identical to its value before the trade (non-compounding).
- **I/J/K** — mirror `spot_profit_withdrawals`' own test pattern (if one exists — recommend checking `scripts/` for an existing `spot-profit-withdrawal*-test.mjs` before writing a new one) against the new `record_stablecoin_profit_withdrawal`: sequential partial withdrawals summing exactly to realized profit, then a withdrawal attempt exceeding remaining available profit is rejected.
- **L/M/N** — classifier-level: `feeVerified=true, feeBps=0` → eligible; `feeVerified=true, feeBps>0` → not eligible; `feeVerified=false` → blocked, `reason='FEE_NOT_VERIFIED'` (renamed/kept from today's `'Fee unverified'`).
- **O** — two isolated allocations processed in the same cycle; assert neither allocation's inventory rows are touched by the other's trade.
- **P/Q/R/S** — Real-mode only, cannot be fully tested without a Real-enabled account; recommend deferring live-integration tests until Real mode is separately authorized, but the pure liquidity-state-transition logic (GREEN/YELLOW/RED, and "only notify on transition") is fully unit-testable today with synthetic balance inputs.
- **T/U** — reuse the exact existing `stablecoin-engine-test.mjs` claim-staleness test pattern (already covers "two ticks overlapping" and "stale claim recovery" for the setup-level claim); confirm it still holds once the cycle body loops over allocations internally rather than raw discovery.
- **V** — the migration backfill script (§28) must be tested against a snapshot of current production-shaped data (capital/allocation/trade counts before and after must match exactly, only `allocation_id` populated).

### 31. Risks

- The Asset Conflict Rule's database-level enforcement (a true "no shared array element" constraint) is the single most architecturally delicate piece of this redesign — getting the junction-table/partial-index design wrong could either allow a race condition (two allocations claiming the same asset simultaneously) or be overly restrictive. This deserves its own focused design review before implementation, not just this audit's outline.
- The claim/cadence question flagged in the prior audit (per-allocation vs per-setup claim) is resolved by this audit's Scheduler Safety finding (§23) — sequential-within-one-setup-claim is sufficient — but this conclusion depends entirely on the Asset Conflict Rule holding perfectly; if that rule is ever bypassed or has a bug, the "sequential is safe" argument would need to be revisited.
- Migrating existing production data (the live setup currently holding $5,006.50 entirely in FDUSD) into a "Legacy" allocation is a policy decision, not just a technical one — the user should explicitly confirm whether that specific historical position should be exposed as-is under a Legacy allocation, or handled differently (e.g., manually closed out first).

### 32. Recommended Implementation Order

1. Pure functions first (fully unit-testable, zero DB/network): `computeRequiredLiquidityUsd`, the Asset Conflict predicate, the expanded rejection-reason classifier branch, the GREEN/YELLOW/RED liquidity-state function.
2. Additive migration (new tables + nullable `allocation_id` columns + backfill script), reviewed and approved separately before being run.
3. `select-pair`/`stop-pair-allocation` actions + `runStablecoinDemoCycle` re-scoping to loop over `ACTIVE` allocations (Demo only — Real stays `501`).
4. `stablecoin_profit_withdrawals` + `record_stablecoin_profit_withdrawal` (Demo-scoped bookkeeping first; Real balance reconciliation and Telegram alerts can follow once Real mode itself is separately authorized).
5. Live Pair Monitor UI rebuild + Configuration panel + Accounting section.
6. Full test suite per §30, then a dedicated production smoke-test pass before considering this closed.

## Implementation

Not applicable — no implementation was performed in this task, per explicit user instruction. See "Root Cause / Findings" §13-§27 above and the summary immediately below for the full proposed design.

### طرح Implementation پیشنهادی (Proposed Implementation Plan)

**فایل‌هایی که تغییر می‌کنند:**
- `api/stablecoin-engine.ts` — تابعِ اصلیِ Orchestration (`runStablecoinDemoCycle`) بازنویسی می‌شود تا رویِ Allocationهایِ فعال حلقه بزند؛ توابعِ محاسباتیِ خالص (`computeGrossSpreadPct`, `computeFeeUsd`, `computeExecutionImpactUsd`, `computeNetProfitUsd`, `decideStablecoinTrade`, `rankStablecoinDecisions`) دست‌نخورده می‌مانند. اکشن‌هایِ جدید و اصلاح‌شده طبقِ §25.
- `src/app/App.tsx` (`StablecoinEnginePanel`) — بازطراحیِ کامل طبقِ §26.
- Migrationِ Additiveِ جدید (فایلِ تازه، ویرایشِ فایل‌هایِ قدیمی ممنوع طبقِ قراردادِ پروژه).
- `scripts/stablecoin-engine-test.mjs` — تست‌هایِ جدیدِ §30.

**Functionهایِ جدید/تغییریافته:**
- جدید (خالص): `computeRequiredLiquidityUsd(tradingCapitalUsd, opportunityCapacity)`.
- جدید (خالص): تابعِ تشخیصِ Asset Conflict.
- اصلاح: `classifyStablecoinExecutability` — یک شاخه‌یِ جدید برایِ `INSUFFICIENT_OPPORTUNITY_LIQUIDITY` قبل از رَدِ کلی، و گسترشِ Enum به هشت Reasonِ درخواست‌شده (`NO_OPPORTUNITY, OPPORTUNITY_NOT_PROFITABLE, INSUFFICIENT_OPPORTUNITY_LIQUIDITY, INSUFFICIENT_INVENTORY, INSUFFICIENT_ORDERBOOK_DEPTH, FILTER_FAILURE, FEE_NOT_VERIFIED, OTHER_EXECUTION_REJECTION`).
- جدید: `simulateStablecoinTrade`/`recordRejectedOpportunity` پارامترِ `allocationId` می‌گیرند؛ Queryهایِ Inventory از `setup_id` به `allocation_id` تغییر می‌کنند.
- جدید (کپیِ الگویِ `notifyPendingTriggered` در `api/copytrade.ts`): تابعِ محلیِ ارسالِ تلگرام برایِ Liquidity Alerts.
- جدید (کپیِ الگویِ `getBinanceSpotBalance` در `api/copytrade.ts`): تابعِ محلیِ خواندنِ موجودیِ واقعیِ Spot، فقط برایِ فازِ آینده‌یِ Real.

**Table/Columnهایِ پیشنهادی:**
```sql
CREATE TABLE stablecoin_pair_allocations (
  id uuid PK, setup_id uuid FK, pair text, base_asset text, quote_asset text,
  trading_capital_usd numeric, opportunity_capacity int,
  required_liquidity_usd numeric,
  status text CHECK IN ('ACTIVE','STOPPED'),
  fee_bps_at_selection numeric, fee_verified_at timestamptz,
  created_at, updated_at, stopped_at
);
CREATE TABLE stablecoin_allocation_assets (
  allocation_id uuid FK, setup_id uuid, asset text, allocation_status text
  -- partial UNIQUE (setup_id, asset) WHERE allocation_status='ACTIVE'  ← Asset Conflict Rule enforced here
);
CREATE TABLE stablecoin_profit_withdrawals ( -- مستقیماً بر اساسِ spot_profit_withdrawals
  id uuid PK, allocation_id uuid FK, telegram_id bigint,
  amount_usd numeric CHECK > 0, request_id uuid, created_at,
  UNIQUE (telegram_id, request_id)
);
-- + تابعِ record_stablecoin_profit_withdrawal() (کپیِ دقیقِ record_spot_profit_withdrawal())
-- + allocation_id (nullable) روی: stablecoin_demo_inventory, stablecoin_demo_trades, stablecoin_cycle_decisions
```

**Allocation چگونه ساخته می‌شود:** کاربر از Live Pair Monitor یک Pairِ Eligible را انتخاب می‌کند → اکشنِ `select-pair` چکِ Asset Conflict + Fee Eligibility را دوباره Server-side تایید می‌کند → محاسبه‌یِ `required_liquidity_usd` → ساختِ ردیفِ Allocation + دو ردیفِ `stablecoin_allocation_assets` + Seedِ اولیه‌یِ Inventory (تقریباً ۵۰/۵۰).

**Asset Conflict چگونه enforce می‌شود:** ایندکسِ Unique جزئی رویِ `stablecoin_allocation_assets(setup_id, asset) WHERE allocation_status='ACTIVE'` (§14).

**Pair چگونه انتخاب می‌شود / Live Monitor چگونه کار می‌کند:** §5/§10/§26 بالا.

**Fee چگونه Verify می‌شود:** بدونِ تغییر در مکانیزم (§6)، فقط نمایشِ زودتر در Selection.

**Liquidity/Opportunity Capacity چگونه محاسبه می‌شوند:** §16/§17.

**Inventory چگونه مستقل می‌شود:** §18.

**Profit/Withdrawal چگونه ثبت می‌شوند:** §19.

**ROI چگونه محاسبه می‌شود:** بدونِ تغییرِ فرمول (§7).

**Real Balance چگونه Reconcile می‌شود / Alertها چگونه کار می‌کنند / Telegram چگونه:** §20/§21/§22 (فقط طراحی برایِ آینده، بدونِ فعال‌سازیِ Real).

**Scheduler چگونه کار می‌کند:** بدونِ تغییرِ Timer/Claim؛ فقط بدنه‌یِ داخلیِ Cycle (§23).

**Testها:** §30.

## Tests Executed

None — this was a read-only audit. No test suite was run as part of this task.

## Build Result

Not applicable — no code was changed.

## Git Status

`signalverse-main`: clean, `HEAD` unchanged at `67138bcd5d6278f79dfd11524d6ef263bd3e3bf8` before and after this audit. `SignalVerse-AI-Log`: this report file is the only change, committed and pushed to `master` as part of this task.

## Commit

See the end-of-task announcement for this report's exact commit SHA in `SignalVerse-AI-Log` (this section is filled by the commit performed immediately after this file was written).

## Remaining Issues

- No implementation has occurred; everything in "Implementation" above is a design proposal pending explicit approval.
- The Asset Conflict Rule's exact database enforcement mechanism (junction table + partial unique index, §14/§31) should get a focused design review of its own before being written into a migration — this audit outlines the approach but does not claim it is the only viable one.
- The policy question of how to treat the current live production setup (100% FDUSD today) under the new Legacy-allocation backfill needs an explicit decision from the user before any migration is written (§31).

## Risks / Limitations

- This audit is based on static code reading plus the same production evidence already gathered in the prior same-day audit (no new live Binance calls were made in this task).
- The Real-mode sections (Balance Reconciliation, Alerts, pre-trade balance check) are architecture-only recommendations; none of it can be validated end-to-end without Real mode being separately authorized and enabled, which remains explicitly out of scope.
- The Test Plan (§30) describes intended test targets, not tests that were actually written or run in this task.

## Recommended Next Step

Await explicit user (and optionally GPT/supervisor) sign-off on this Implementation Plan, with particular attention requested on: (1) the Asset Conflict Rule's exact DB enforcement design, (2) the Legacy-allocation migration policy for the current live FDUSD position, and (3) confirmation that the recommended implementation order (§32) is acceptable, before any code is written.
