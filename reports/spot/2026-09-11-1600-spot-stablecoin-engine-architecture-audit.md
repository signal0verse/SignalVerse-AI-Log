# Stablecoin Engine — Pair-Aware Rebuild: Architecture Audit (read-only)

## Metadata

- Date: 2026-09-11
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine)
- Mode: Read-only audit only — no implementation
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: 67138bcd5d6278f79dfd11524d6ef263bd3e3bf8
- Ending commit: 67138bcd5d6278f79dfd11524d6ef263bd3e3bf8 (unchanged — audit made zero commits to this repo)

## Objective

User requested a full, exact architecture audit of the Stablecoin Demo Engine before a ground-up rebuild, driven by a new core requirement: a **Live Pair + Fee Monitor** where the user explicitly selects one eligible (zero-fee, verified, trading) pair, configures Trading Capital / Opportunity Capacity / Required Liquidity for that pair specifically, and the engine trades only within that pair's isolated allocation — never crossing capital into another pair. The user also reported a live production symptom: capital intended for USDT/USDC had ended up in FDUSD, and asked for the exact root cause. Explicit instruction: **no code changes, no migration, no commit/push/deploy, audit and report only**, formatted as a specific numbered Q&A (31 questions) plus a separate "Implementation Plan" section.

## Scope

Read-only inspection of `api/stablecoin-engine.ts`, all three Stablecoin migration files, `scripts/stablecoin-engine-test.mjs`, `src/app/App.tsx`'s `StablecoinEnginePanel`, and one read-only SQL query against production (`stablecoin_demo_setups`, `stablecoin_demo_inventory`, `stablecoin_demo_trades`) to obtain concrete evidence of the reported bug. No file was modified. No migration was run. No production data was changed. No Binance order was placed.

## Actions Taken

1. Re-read the complete current `api/stablecoin-engine.ts` (907 lines) in full, tracing: pair discovery, fee verification, order-book/VWAP, the pure Decision Engine functions, the demo executor, the automatic cycle orchestrator (`runStablecoinDemoCycle`), the HTTP handler and every action's permission gate.
2. Read `migrations/stablecoin_engine.sql`, `migrations/stablecoin_demo_automation.sql`, and (from prior session context, re-verified against the live schema below) `migrations/stablecoin_decision_audit.sql`.
3. Read the full `StablecoinEnginePanel` component in `src/app/App.tsx` (state, effects, and render tree) to confirm there is no pair-selection UI today.
4. Ran a read-only SQL query against production (`ssh` + `psql`, SELECT only) to pull the exact live evidence of the reported FDUSD-contamination symptom:
   ```sql
   SELECT id, status, capital_usd, initial_allocation FROM stablecoin_demo_setups WHERE telegram_id=98758441 ORDER BY created_at DESC LIMIT 1;
   SELECT asset, balance FROM stablecoin_demo_inventory WHERE setup_id='e7ea4738-7502-419b-8cbc-ea8605fb468e';
   SELECT pair, from_asset, from_qty, to_asset, to_qty, status, created_at FROM stablecoin_demo_trades WHERE setup_id='e7ea4738-7502-419b-8cbc-ea8605fb468e' AND status='EXECUTED' ORDER BY created_at;
   ```
5. Produced a 31-question structured findings report plus a separate Implementation Plan section for the user, delivered inline in chat (not as a file in the main repo). This document reproduces that same audit for GPT/supervisor review.

## Files Inspected

- `api/stablecoin-engine.ts` (full file, 907 lines)
- `migrations/stablecoin_engine.sql`
- `migrations/stablecoin_demo_automation.sql`
- `migrations/stablecoin_decision_audit.sql` (schema re-confirmed against live DB via `\d` earlier in this working session)
- `scripts/stablecoin-engine-test.mjs` (existing coverage reviewed for what it does/doesn't assert about pair isolation)
- `src/app/App.tsx` — `StablecoinEnginePanel` (full component, ~570 lines) and the Terminal-level access-gating around it

## Files Changed

NONE

## Root Cause / Findings

**CONFIRMED** — The current engine has no concept of a user-selected pair or per-pair capital isolation. Inventory is modeled as a single shared pool per Demo setup, keyed `(setup_id, asset)` (`migrations/stablecoin_engine.sql`, `stablecoin_demo_inventory` table, PK `(setup_id, asset)`). Every 5-minute automatic cycle (`runStablecoinDemoCycle`, `api/stablecoin-engine.ts:503-547`) discovers **every** currently-tradable stablecoin/stablecoin pair on Binance (`discoverStablecoinPairs()`, unfiltered by any user selection), evaluates all of them against that one shared pool, ranks all resulting decisions purely by net profit (`rankStablecoinDecisions`, line 198), and executes whichever pair/side ranked #1 — regardless of which pair the user believed they were running.

**CONFIRMED, with live production evidence** — reproduced the exact reported symptom:
```
stablecoin_demo_setups (id=e7ea4738-...): initial_allocation = {"USDC": 2500, "USDT": 2500}
stablecoin_demo_trades (EXECUTED, this setup):
  FDUSDUSDC  USDC 2500 -> FDUSD 2503.5   (2026-09-10 23:25:33 UTC)
  FDUSDUSDT  USDT 2500 -> FDUSD 2503     (2026-09-10 23:31:01 UTC)
stablecoin_demo_inventory (current): USDC=0, USDT=0, FDUSD=5006.5
```
This is the direct, mechanical result of the shared-pool design above — not a transient bug or a race condition. The exact code path: `api/stablecoin-engine.ts:516` (`discoverStablecoinPairs()`, unfiltered) → `:518-533` (loop evaluates every pair × side against `balances[sourceAsset]`, a setup-wide map, not pair-scoped) → `:534-535` (`rankStablecoinDecisions` picks the global best across all pairs) → `:538-539` (`simulateStablecoinTrade`, `api/stablecoin-engine.ts:418-450`) which reads/writes `stablecoin_demo_inventory` with no pair filter at all (`:419`, `:439-442`).

**CONFIRMED** — `stablecoin_pair_snapshots` (defined in `migrations/stablecoin_engine.sql`) is never written to or read from anywhere in `api/stablecoin-engine.ts` (grep-verified, zero matches). It is a fully dead table today.

**CONFIRMED** — `stablecoin_fee_verifications` is write-only: exactly one `.insert()` call, inside `discover-pairs` (`api/stablecoin-engine.ts:637`), never read anywhere in the codebase. The live Decision Engine's fee data always comes fresh from `verifyPairFeeLive()` (a direct Binance call), never from this cache.

**CONFIRMED** — Fail-closed fee handling is already correct at the classifier level: `classifyStablecoinExecutability` (`api/stablecoin-engine.ts:145-160`), the first check (line 151), rejects any decision with `feeVerified=false` before any spread/profit math runs. This part needs no behavior change, only exposure at pair-selection time (which doesn't exist yet).

**CONFIRMED** — No forced-rebalance logic exists anywhere in the current code. `simulateStablecoinTrade` only ever executes a trade produced by a genuine `EXECUTABLE` Decision Engine output; there is no code path that trades purely to restore a 50/50 (or any) balance ratio.

**CONFIRMED** — ROI (`computeReport`, `api/stablecoin-engine.ts:241`) already divides by `setup.capitalUsd` (the user's original Trading-Capital-equivalent input), not by any larger liquidity figure — the formula itself needs no change; the missing piece is that "Required Liquidity" as a distinct, larger figure doesn't exist yet to be confused with it.

**CONFIRMED** — There is no pair-selection UI today. `StablecoinEnginePanel` (`src/app/App.tsx:2780+`) only collects a single total `capitalUsd` (`startDemo()`, lines 2906-2914) and displays a hard-coded "Initial split: 50% USDT / 50% USDC" (line 2997). The existing "Pairs" monitoring tab (lines 3073+) is read-only/informational only — it renders whatever the last automatic cycle evaluated, with no click-to-select affordance.

**CONFIRMED** — `StablecoinRejectionReason` (`api/stablecoin-engine.ts:141-143`) currently has 8 values and conflates "Binance order-book depth insufficient" and "user's own inventory/liquidity insufficient" under two different-but-adjacent reasons (`'Insufficient liquidity'` vs `'Inventory insufficient'`); neither maps to the requested `INSUFFICIENT_OPPORTUNITY_LIQUIDITY` concept (a profitable opportunity blocked specifically by a pair's configured capacity ceiling), which does not exist today because opportunity capacity itself does not exist today.

**UNCONFIRMED / not tested in this audit** — whether the exact combination of concurrent per-pair cycles (once pair isolation is implemented) interacts safely with the existing `last_tick_at` single-claim-per-setup compare-and-swap (`api/stablecoin-engine.ts:706-710`); the current claim is scoped to one `setup_id`, not one `(setup_id, pair)`, so the claim mechanism will need explicit re-design once multiple isolated allocations can exist per setup and each may need its own independent claim/cadence. This is flagged as an open design question for the Implementation Plan, not something evaluated end-to-end here.

## Implementation

Not applicable — no implementation was performed in this task, per explicit user instruction. A full proposed Implementation Plan (new table `stablecoin_pair_allocations`, `allocation_id` added to `stablecoin_demo_inventory`/`stablecoin_demo_trades`/`stablecoin_cycle_decisions`, a new `computeRequiredLiquidityUsd()` pure function, a new `INSUFFICIENT_OPPORTUNITY_LIQUIDITY` classifier branch, new `select-pair`/`stop-pair-allocation` actions, and a Live Pair Monitor backed by a periodic — not per-render — refresh of `stablecoin_pair_snapshots`) was drafted and delivered to the user in chat, pending their explicit approval before any code is written.

## Tests Executed

None — this was a read-only audit. No test suite was run as part of this task (the existing `scripts/stablecoin-engine-test.mjs` suite was last run and fully passing in the prior session's task, before this audit began; it was not re-run here since no code changed).

## Build Result

Not applicable — no code was changed.

## Git Status

`signalverse-main` repository: clean, no uncommitted changes from this task, `HEAD` at `67138bcd5d6278f79dfd11524d6ef263bd3e3bf8` (unchanged before/after this audit).

## Commit

None in `signalverse-main` (no code changes were made). This report itself is the only commit produced by this task, in this separate reporting repository (`SignalVerse-AI-Log`).

## Remaining Issues

- The pair-isolation rebuild described in the Implementation Plan has not been implemented, reviewed by a second author, or approved yet.
- The interaction between per-pair allocation claims and the existing single-setup `last_tick_at` compare-and-swap claim needs explicit design before implementation (flagged as UNCONFIRMED above).
- Migration strategy for existing production rows (the live setup currently holding $5,006.50 entirely in FDUSD, from the shared-pool trades documented above) needs an explicit decision: map to a single "Legacy/Mixed" allocation (Implementation Plan option B) versus another approach — not decided yet, pending user/GPT input.

## Risks / Limitations

- This audit relied on the single most-recent production Demo setup as evidence; it did not exhaustively review every historical setup for other manifestations of the same shared-pool cross-contamination (though the root cause is structural, so every past multi-pair-active setup is expected to exhibit it equally).
- No live Binance calls were made during this audit itself (all findings came from static code reading plus the one read-only Postgres query above) — fee/eligibility findings describe the code's *logic*, not a fresh live re-verification of current Binance fee state for any specific pair.
- The Implementation Plan's schema proposal (`stablecoin_pair_allocations` + `allocation_id` columns) is a design recommendation, not something validated against the live schema cache or PostgREST compatibility beyond the same idioms this project has already used successfully for prior additive migrations.

## Recommended Next Step

Await explicit user (and optionally GPT/supervisor) sign-off on the Implementation Plan (new `stablecoin_pair_allocations` table + `allocation_id` propagation + `select-pair`/`stop-pair-allocation` actions + Live Pair Monitor + expanded rejection-reason enum) before any implementation begins, per the user's explicit "no code changes yet" instruction. Recommend resolving the flagged UNCONFIRMED claim/cadence design question (per-pair claim scoping) explicitly before implementation starts, since it affects the schema of the new allocations table.
