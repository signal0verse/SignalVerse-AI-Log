# Stablecoin Engine Allocation Redesign — Migration Strategy Correction: No Legacy/Mixed Allocation

## Metadata

- Date: 2026-09-11
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine)
- Mode: Read-only correction to a prior report's plan — no implementation, no migration, no deploy
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: 67138bcd5d6278f79dfd11524d6ef263bd3e3bf8
- Ending commit: 67138bcd5d6278f79dfd11524d6ef263bd3e3bf8 (unchanged — zero commits to signalverse-main from this task)

## Objective

This is a **correction**, not a new audit. The user reversed a specific decision made in `reports/spot/2026-09-11-1644-spot-stablecoin-engine-allocation-liquidity-audit.md`: that report's §28 (Migration Strategy) and §29 (Backward Compatibility) proposed creating a synthetic "Legacy/Mixed" Allocation and backfilling `allocation_id` onto the existing production Demo's historical inventory/trade/decision rows so old data would remain queryable under the new schema. The user has now explicitly decided **against** this: the new Allocation architecture must start completely fresh, with zero historical inventory, trades, or profit feeding into it, while the old data must still be preserved (never deleted or fabricated) as separately-viewable historical/archived records. This report supersedes only §28/§29 of the prior report; every other section of that report (§1-§27, §30-§32, and the rest of the Implementation Plan) remains valid and unchanged. See the companion decision record: `decisions/2026-09-11-1658-stablecoin-no-legacy-allocation-fresh-start.md`.

## Scope

No new code inspection was required for this correction beyond re-confirming two facts already established in the prior two audits: (1) `stablecoin_demo_setups.created_at` is set once at INSERT and never mutated afterward (confirmed from the table's original definition in `migrations/stablecoin_engine.sql`, unchanged since), and (2) the existing `report`/`demo-status`/`trade-history`/`decision-history`/`pair-monitoring` actions already resolve "the relevant setup" either by an explicit `setupId` query parameter or by `order('created_at', {ascending:false}).limit(1)` for `ADMIN_ID` (verified in `api/stablecoin-engine.ts` in the prior audit, lines 727-729, 765-767, 787-789, 831-833). No file was modified. No migration was run. No production data was changed. No Binance order was placed.

## Actions Taken

1. Reviewed the user's explicit correction against the exact text of the prior report's §28/§29 and the "Implementation Plan" Migration Strategy paragraph.
2. Re-confirmed (re-reading, not re-running) that `allocation_id` was already planned as an **additive, nullable** column on the three existing tables in the original plan — meaning the only actual change this correction requires is *policy* (never write to that column for pre-existing rows), not a schema redesign.
3. Designed the "keep legacy data separate without touching it" mechanism, using only facts already established in the prior audits (see Root Cause / Findings below) — no new code paths were invented that aren't already simple consequences of the existing schema/query shapes.
4. Wrote a companion decision record (`decisions/2026-09-11-1658-stablecoin-no-legacy-allocation-fresh-start.md`) documenting the reversal, its rationale, and its reversibility, per this repository's own convention of separating durable decisions from audit reports.
5. Wrote this correction report, to be saved and pushed as instructed.

## Files Inspected

None newly inspected in this task — this correction relies entirely on facts already gathered and cited in `reports/spot/2026-09-11-1600-...` and `reports/spot/2026-09-11-1644-...`.

## Files Changed

NONE

## Root Cause / Findings

Not applicable in the usual sense (no new bug investigated) — this section instead documents the **corrected design** for legacy-data isolation, evidence-based against the already-confirmed facts from the prior two audits.

**CONFIRMED (from prior audits, re-cited here):** the current production Demo setup (`stablecoin_demo_setups` row `e7ea4738-...`) holds ~$5,006.50, entirely in FDUSD, as a direct result of the shared-pool architecture bug. Nothing about this correction changes that root-cause finding — it only changes what the *new* architecture is allowed to do with that setup's data going forward (nothing).

**CONFIRMED:** `stablecoin_demo_setups.created_at` (`migrations/stablecoin_engine.sql`) is a `timestamptz NOT NULL DEFAULT now()` column, set exactly once at row creation, never referenced in any `UPDATE` statement anywhere in `api/stablecoin-engine.ts` (the only mutations to this table are to `status`/`stopped_at`/`last_tick_at`, none of which are `created_at`). This means a brand-new setup row, created at any point after this correction is implemented, will always have a later `created_at` than the existing legacy row.

**CONFIRMED:** every "find the relevant setup" query in the current codebase (`demo-status`, `trade-history`, `decision-history`, `pair-monitoring` — all four, `api/stablecoin-engine.ts`) already uses `order('created_at', {ascending:false}).limit(1)` scoped to `ADMIN_ID`, with no other filter. A direct, load-bearing consequence: once a genuinely new setup exists, these existing queries will automatically and correctly prefer it over the legacy one, with **zero code change required** to that specific selection logic — only the *meaning* of what gets created under `start-demo` (or its future equivalent) needs to change, not how "most recent" is determined.

**CONFIRMED:** the existing `report` action (`api/stablecoin-engine.ts`, the older `setupId`-parameterized action, distinct from `demo-status`'s auto-discovery) already requires an **explicit** `setupId` and performs no "most recent" inference at all. This means it already functions, unmodified, as a permanent, explicit-only "view a specific historical Demo's report" endpoint — exactly what's needed to keep viewing the legacy setup's history without it ever being surfaced as a default.

**Design conclusion (not yet implemented):** Because of the three confirmed facts above, "keep legacy data separate, don't delete or fabricate it" requires **no new schema, no new endpoint, and no new query logic** beyond what the original (uncorrected) plan already proposed for `allocation_id`'s nullability. The only actual change is a **negative constraint on future code**: no migration, backfill script, or application code path may ever write a non-null `allocation_id` onto a row whose `setup_id` predates the redesign, and no new Allocation-scoped query may read inventory/trades/decisions except by joining through `stablecoin_pair_allocations` (which will never contain a row referencing the legacy setup). Isolation is structural (the join simply cannot produce legacy rows), not merely a convention someone could accidentally violate later — this is a materially stronger guarantee than "we just won't query it," and was chosen specifically for that reason.

## Implementation

Not applicable — no implementation was performed. This section documents the **corrected** Migration Strategy and Backward Compatibility design that replaces §28/§29 of the prior report.

### Corrected §28 — Migration Strategy

Purely additive, exactly as the prior report proposed, **minus the backfill step**:
1. Create the new tables (`stablecoin_pair_allocations`, `stablecoin_allocation_assets`, `stablecoin_profit_withdrawals`) and add `allocation_id` as a **nullable** column to `stablecoin_demo_inventory`, `stablecoin_demo_trades`, and `stablecoin_cycle_decisions`.
2. **No backfill step.** Every row that exists before this migration keeps `allocation_id = NULL` forever. No data-migration script runs against pre-existing rows at all.
3. Before any new Demo can be started under the new architecture, the currently-`RUNNING` legacy setup must be explicitly stopped (via the existing, unmodified `stop-demo` action) — this is a one-time **administrative action by the admin**, not a data migration, and is required only because of the existing `idx_stablecoin_demo_setups_one_running_per_user` constraint (at most one `RUNNING` setup per admin at a time), not because of anything specific to this correction.
4. The first `select-pair` call under the new architecture creates a **brand-new** `stablecoin_demo_setups` row (never reusing the legacy `setup_id`), a brand-new `stablecoin_pair_allocations` row, and brand-new `stablecoin_demo_inventory` rows seeded only from the capital the user configures at that moment — never from the legacy setup's balances in any form.

### Corrected §29 — Backward Compatibility

- All pre-existing `stablecoin_demo_trades`/`stablecoin_cycle_decisions`/`stablecoin_demo_inventory` rows remain exactly as they are today, byte-for-byte, permanently, with `allocation_id` staying `NULL`.
- The existing `report` action (explicit-`setupId`-only) remains the permanent, unmodified way to view the legacy setup's full historical report — functioning as the "Historical/Archived Demo" viewer requested by the user, with zero new code.
- New Allocation-based Monitoring/History/Reporting UI and API actions (`pair-monitoring`, the new `allocation-status`, and the `allocationId`-filterable extensions to `trade-history`/`decision-history` proposed in the prior report) exclusively join through `stablecoin_pair_allocations`, so the legacy setup's rows are structurally never returned by any of them.
- New Profit/ROI/Liquidity accounting (the non-compounding Trading Capital model, the `stablecoin_profit_withdrawals` ledger, Required Liquidity calculations) starts every new Allocation at exactly zero realized profit and zero prior activity — nothing from the legacy setup is summed, averaged, or otherwise incorporated into any new figure.
- If a genuinely "lifetime, all-eras" report is ever wanted later, that remains possible in principle (nothing was deleted), but is explicitly out of scope and not part of this plan.

## Tests Executed

None — this is a planning correction, not an implementation task.

## Build Result

Not applicable — no code was changed.

## Git Status

`signalverse-main`: clean, `HEAD` unchanged at `67138bcd5d6278f79dfd11524d6ef263bd3e3bf8`. `SignalVerse-AI-Log`: this report and its companion decision record are the only changes in this task.

## Commit

See the end-of-task announcement for this report's exact commit SHA in `SignalVerse-AI-Log`.

## Remaining Issues

- The rest of the prior report's Implementation Plan (§13-§27, §30-§32 of `2026-09-11-1644-...`) is unaffected by this correction and still awaits approval as previously reported.
- Exact wording/UX for how the legacy setup is labeled or surfaced to the admin (if at all) outside of the explicit `report?setupId=...` call has not been specified — recommend a minimal, low-risk approach: no dedicated "Legacy" UI is required at launch; the admin can retrieve the old report by ID if ever needed, and no further UI work is implied by this correction unless separately requested.

## Risks / Limitations

- This correction was produced by re-analysis of already-established facts (no new production queries were run in this task) — the "no backfill" design is sound given those facts, but has not been implemented or tested end-to-end.
- Because no unified cross-era report exists, any future request for "total lifetime profit across both the legacy and new architecture" would need a separate, explicit design decision — flagged here so it isn't assumed to already be possible.

## Recommended Next Step

Treat §28/§29 of `reports/spot/2026-09-11-1644-...` as superseded by this report. Await explicit user (and optionally GPT/supervisor) approval of the full, now-corrected Implementation Plan (prior report §13-§32 plus this report's revised §28/§29) before any implementation begins.
