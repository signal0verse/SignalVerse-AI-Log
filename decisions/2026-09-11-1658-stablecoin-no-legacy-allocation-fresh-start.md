# Stablecoin Allocation Redesign: No Legacy/Mixed Allocation — Fresh Start Only

## Metadata

- Date: 2026-09-11
- Decision ID: stablecoin-no-legacy-allocation-fresh-start
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine)
- Related report(s): `reports/spot/2026-09-11-1644-spot-stablecoin-engine-allocation-liquidity-audit.md` (§28 Migration Strategy, §29 Backward Compatibility — both superseded by this decision, see `reports/spot/2026-09-11-1659-spot-stablecoin-engine-migration-strategy-correction.md` for the fully revised sections)

## Context

The prior audit (`2026-09-11-1644-...`) proposed migrating the current single-pool production Demo (currently holding ~$5,006.50, entirely drifted into FDUSD due to the shared-pool bug documented in that audit and the earlier `2026-09-11-1600-...` audit) into a synthetic "Legacy/Mixed" Allocation, backfilling `allocation_id` onto its existing inventory/trade/decision rows so historical data would remain queryable under the new allocation-aware schema. The user reconsidered this and issued an explicit correction: the new Allocation architecture must start completely fresh, with no historical inventory, trades, or profit feeding into it in any form.

## Options Considered

1. **Legacy/Mixed Allocation + backfill** (the prior audit's original proposal): create one synthetic Allocation per existing setup, backfill `allocation_id` onto all its historical rows. Pro: every historical row gets a home under the new schema, uniform querying. Con: conflates a "real" user-configured Allocation (with intentional Trading Capital / Opportunity Capacity / Required Liquidity) with an artificial one representing pre-redesign, single-pool, cross-contaminated activity — risks the new Profit/ROI accounting silently including pre-redesign numbers the user explicitly does not want counted.
2. **No Legacy Allocation, no backfill, structural non-reference** (chosen): leave every existing `stablecoin_demo_setups`/`stablecoin_demo_inventory`/`stablecoin_demo_trades`/`stablecoin_cycle_decisions` row exactly as it is, permanently `allocation_id = NULL`. New Allocation-aware code paths always require a non-null `allocation_id` (via an inner join to the new `stablecoin_pair_allocations` table), so old rows are structurally unreachable by any new query — not by convention, but because the join simply cannot produce them. Historical data remains permanently, unmodified, and separately viewable through the existing (unmodified) `action=report&setupId=<old-id>` endpoint. Pro: zero risk of legacy numbers leaking into new Profit/ROI/Liquidity math; zero data loss; zero fabrication. Con: no single unified "all-time" report spanning both eras (acceptable — not requested).
3. **Delete/archive old rows out of the live tables**: rejected outright — violates this project's own standing rule (see `CLAUDE.md`/prior audits: "never fabricate or delete real historical data") and this repository's README ("Do not delete previous reports" applies in spirit to production history too).

## Decision

Option 2. No Legacy/Mixed Allocation will be created. No backfill of `allocation_id` onto pre-existing rows. The currently-running legacy setup (and its ~$5,006.50 FDUSD position) is left completely untouched and excluded from all new Allocation-based Trading Capital, Opportunity Capacity, Required Liquidity, Inventory, and Profit/ROI calculations. New Demos start with genuinely fresh Inventory and a genuinely fresh Allocation, and the new model operates purely on: user-selected Pair, Trading Capital, Opportunity Capacity, and Required Liquidity — nothing carried over from before the redesign.

## Rationale

**CONFIRMED (schema-level fact, verified by re-reading the live table definitions in the prior audits):** `allocation_id` was already planned as a new, nullable column added additively to the three existing tables — nullability was always required for backward compatibility regardless of which option was chosen, since pre-redesign rows cannot retroactively gain a real user-configured Allocation. The only actual change this decision makes is *whether anything ever gets written into that column for old rows* — under Option 2, nothing does, permanently.

**CONFIRMED:** the existing `report`/`demo-status` actions already support viewing a specific `setupId`'s history in complete isolation (this is exactly how they work today, verified in both prior audits) — so "keep old data viewable without deleting it" requires zero new code, just continuing to allow the old `setupId` to be queried directly, while the new Live Pair Monitor / Allocation Monitoring UI never surfaces it as a default/most-recent option.

**LIKELY, pending implementation:** because `created_at` on `stablecoin_demo_setups` is set once at INSERT and never mutated by ticks, a genuinely new setup row created under the new architecture will always sort after the legacy one in "most recent setup" queries — meaning no special-casing or exclusion logic is needed for the new UI to naturally prefer the new setup once it exists. This has not been implemented or tested yet; it follows from the existing query shape (`order('created_at', {ascending:false}).limit(1)`, already used by `demo-status`/`trade-history`/`decision-history`/`pair-monitoring` today) but is flagged as LIKELY rather than CONFIRMED since it depends on the not-yet-written new setup-creation code actually inserting a fresh row rather than reusing the old one.

## Consequences

- The Migration Strategy and Backward Compatibility sections of `reports/spot/2026-09-11-1644-...` are superseded — see the correction report for the fully revised text.
- No migration will ever backfill or rewrite `stablecoin_demo_setups`/`stablecoin_demo_inventory`/`stablecoin_demo_trades`/`stablecoin_cycle_decisions` rows created before the redesign; any future additive migration only adds new, nullable columns/tables.
- The currently-running legacy setup must be explicitly stopped (via the existing, unmodified `stop-demo` action — an administrative step, not a data migration) before a genuinely fresh setup can be started under the new architecture, since `idx_stablecoin_demo_setups_one_running_per_user` allows only one RUNNING setup per admin at a time.
- No unified "lifetime" Profit/ROI report spanning both the legacy single-pool era and the new allocation era will exist unless separately requested later — this is an accepted, deliberate limitation, not an oversight.

## Reversibility

Fully reversible in principle: because no old row is ever deleted or rewritten, a future decision to backfill `allocation_id` onto legacy rows (effectively re-adopting Option 1) remains technically possible at any later date without any data having been lost. It is not reversible in the sense of "making legacy profit count toward new ROI retroactively" without a separate, explicit future decision to do so.

## Recommended Next Step

Treat this decision as final for the Migration Strategy/Backward Compatibility portions of the Implementation Plan. No implementation should begin until the user separately approves the full corrected plan (see the correction report).
