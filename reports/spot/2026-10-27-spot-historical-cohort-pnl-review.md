# Spot historical scenario P&L — read-only review

## Metadata

- Date: 2026-10-27, Asia/Kuala_Lumpur.
- Task: Explain a negative individual scenario result under the shared Spot strategy.
- Module: Telegram Spot history and aggregate exit accounting.
- Repository: signal0verse/signalverse-main.
- Repository documentation HEAD: 9e3da71a6a3176c21abb8f401e117696640f5a98.
- Active executable verified by server read: 952eb6201594fb3c5a5ef462e30b4215c74cd8e4.

## Objective and Scope

Determine whether the selected historical negative allocation was a stop-loss,
an accounting error, or one member's contribution to a shared exit. Scope was
read-only inspection of the previously identified owned records and immutable
source versions. Private account identifiers, assets, prices, quantities,
portfolio results, execution times and snapshots are excluded from this report.

## Actions Taken / Findings

- CONFIRMED: the selected records are Demo. Their recorded sales carry target
  stages, including aggregate target stages; no stop-loss sale is recorded.
- The old executor selected an eligible individual scenario's target and sold
  the shared holdings proportionally. A member with a higher acquisition cost
  can therefore have a negative allocation while the combined result is positive.
- Recomputed each recorded result from sale proceeds minus purchase cost, using
  decimal arithmetic. Both match the stored results; their precise combined
  recorded result is positive. Summing rounded UI rows can differ by one cent
  from rounding the sum of the precise ledger values.
- The historical close predates the current weighted-target deployment. That
  deployment does not rewrite past fills or accepted target references.
- The history UI uses a generic Closed label for aggregate target stage strings;
  that label does not assert a stop-loss. It displays the individual scenario's
  stored result rather than a combined cohort total.
- Previous purchase and sale prefixes were compared by immutable cycle identity
  and remain preserved. No historical result was replaced to make it positive.

## Files Inspected / Changed

Inspected TRADING_STRATEGY.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md,
docs/testing/stability-test-runbook.md, src/app/SpotHistoryPanel.tsx,
src/app/spot-scalp-presentation.ts and the aggregate exit implementation in
api/copytrade.ts at the older executable 623225675adaa102b05924d28a506514f772777d.
No tracked application file changed. Private diagnostic helpers and evidence
remain outside Git; only this sanitized report is published.

## Checks / Results

- Owner-scoped database reads used an explicit READ ONLY transaction and bounded
  statement/process timeouts; no environment credentials or application bootstrap
  were loaded into a test runner.
- Decimal ledger arithmetic and recorded target-stage evidence: PASS.
- Historical prefix and active source verification: PASS.
- New build, CI run or behavioral tests: not required for this explanation;
  no executable or financial policy changed. Local Docker was not started.

## Build / Delivery and Git State

No deployment, migration, setting change, profile activation, forced scheduler,
analysis or exchange order was performed during this review. Current executable
and documentation HEAD remain separate as recorded above. Tracked working files
are unchanged and existing untracked output is preserved.

## Remaining Issues / Limits

This review explains the selected historical record. The current owner-approved
policy uses quantity-weighted saved targets across the shared position. Its
release evidence is recorded in the prior weighted-position release report.
An individual scenario's allocation can be negative within a positive shared
exit; the strategy evaluates the combined position. Recorded results here are
ledger amounts, not a new claim of fee-adjusted profitability or verification of
every private account. The historical display was not redesigned in this review.

## Recommended Next Step

Read historical scenario allocations together with the combined position result.
Preserve original fills and distinguish generic closure labels from explicit
stop-loss or manual-sale evidence.
