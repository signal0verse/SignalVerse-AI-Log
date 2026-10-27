# Telegram Spot — shared weighted scenario exits released

## Metadata

- Date: 2026-10-27, Asia/Kuala_Lumpur.
- Task: Owner-approved shared Spot position across scenarios.
- Module: Native Telegram Standard Spot and scalp; shared owned LIMIT controller.
- Mode: Demo and real, all supported assets within each account/setup/venue/quote/round.
- Repository: signal0verse/signalverse-main.
- Branch: codex/spot-position-weighted-exits-20261026; published to main.
- Starting production commit: 623225675adaa102b05924d28a506514f772777d.
- Active executable commit: 952eb6201594fb3c5a5ef462e30b4215c74cd8e4.
- Ending documentation commit: 9e3da71a6a3176c21abb8f401e117696640f5a98 ([skip ci]).

## Objective

Treat later scenarios as averaging layers of one position. Use a combined buy
average and the owner-selected quantity-weighted means of saved scenario TP
references for both exits. Apply to all Telegram assets in Demo/real and check
Standard Spot as well as scalp. The owner also explicitly approved test
compatibility with every previous assertion retained and direct new-code tests.

## Scope

Shared exit accounting, durable native/owned LIMIT allocation, retained legacy
MARKET execution, common position/history display, additive schema, tests,
documentation and the existing controlled main-bot release. Entry levels,
budgets, financial admission/funding/credit rules, tenant scope, accepted
scenario references, root controls and scheduler gates were preserved.

## Actions Taken / Findings

- CONFIRMED: exit bookkeeping was aggregate, but the prior trigger chose an
  individual eligible target; charts still exposed individual scenario means.
- Implemented one pure weighted policy. TP1 sells only the cumulative missing
  half; TP2 sells the remainder. Confirmed partial fills and later buys cannot
  repeatedly sell half of old inventory. Verified lot/minimum rules handle an
  unsellable first-stage residual only after actual execution.
- Added one durable LIMIT exit with immutable pro-rata allocations, actual
  fee/inventory projection and setup/snapshot fencing. Unknown submission,
  cancellation, fees or unjournaled legacy exposure retain a hold.
- Kept native/owned execution, credit and admission ports; actual finite fully
  executed buy quantities remain mandatory for scenario continuation. Round
  continuation uses combined realized profit and rejects manual/still-open work.
- Added common average, targets, remaining quantity and pooled sale history to
  Standard/scalp, including seven-language RTL/Latin-number rendering.
- Applied only reviewed additive nullable columns/functions/triggers/indexes
  after private full restore and actual-layout rehearsal. Old execution rows
  were not adopted, deleted or rewritten by the migration.

## Files Inspected / Changed

The primary inspected implementation files were api/copytrade.ts,
api/_shared/spot-position.ts, both shared LIMIT engines, the existing venue
adapter, common UI/model/history files, strategy/handoff/runbook, original CI/
release controls and relevant actual-source fixtures. The exact reviewed source
scope has46 files; protected workflows/installed controls stayed unchanged.

Changed paths:

- HANDOFF.md
- TRADING_STRATEGY.md
- api/_shared/spot-position.ts
- api/analyze.ts
- api/copytrade.ts
- docs/AI_HANDOFF.md
- docs/fixes/spot-weighted-position-2026-10-26.md
- docs/testing/stability-test-runbook.md
- migrations/spot_position_exits.sql
- scripts/build-partner-copytrade.mjs
- scripts/build-partner-paper-engine.mjs
- scripts/lib/spot-position-delta.json
- scripts/lib/spot-position-parity.mjs
- scripts/lib/standalone-analysis-geometry-parity.mjs
- scripts/native-mexc-spot-limit-test.mjs
- scripts/native-mexc-spot-limit-ui-test.mjs
- scripts/partner-spot-limit-integration-test.mjs
- scripts/partner-spot-limit-sql-test.mjs
- scripts/signalverse-spot-allocation-test.mjs
- scripts/spot-capital-allocation-test.mjs
- scripts/spot-position-aggregation-test.mjs
- scripts/spot-position-engine-test.mjs
- scripts/spot-position-factories-test.mjs
- scripts/spot-position-scope-test.mjs
- scripts/spot-position-sql-test.mjs
- scripts/spot-position-sql-test.py
- scripts/spot-position-test.mjs
- scripts/spot-position-ui-test.mjs
- scripts/spot-real-limit-order-test.mjs
- scripts/spot-scalp-market-batch-test.mjs
- scripts/spot-scanner-scalp-test.mjs
- scripts/spot-scenario-continuation-test.mjs
- scripts/spot-scenario-retry-test.mjs
- scripts/spot-setup-reliability-test.mjs
- scripts/spot-setup-views-test.mjs
- scripts/spot-technical-scalp-test.mjs
- server/partner-copytrade/contract.mjs
- server/partner-copytrade/position-limit-engine.ts
- server/partner-copytrade/spot-limit-engine.ts
- src/app/App.tsx
- src/app/SpotPositionSummary.tsx
- src/app/SpotScalpOverview.tsx
- src/app/SpotScalpWorkspace.tsx
- src/app/scalp-overview-model.ts
- src/app/spot-position-history.ts
- src/app/spot-scalp-presentation.ts

## Tests Executed

- Direct current policy/controller/factory/UI/MARKET suites: PASS. Synthetic
  buys2@100 and3@80 give average88 and weighted targets98/108. Cases cover
  partial fills, cumulative stages, fees, allocation conservation, all three
  LIMIT adapters, MEXC/Gate actual MARKET evaluator batches, no repeated POST,
  concurrency, holds, manual close, continuation and RTL/history.
  Original official entry: node scripts/spot-setup-views-test.mjs, which imports
  the actual current policy, controller, factory, UI and scope suites. The
  original scalp entry runs node --test scripts/spot-scalp-market-batch-test.mjs
  alongside its retained related suites.
- Actual current controller plus retained retry suite:47/47 PASS locally.
- Final exact-source factory/controller regression:23/23 PASS, including the
  unchanged native Binance four-rung full-fill continuation gate.
- node --test scripts/spot-technical-scalp-test.mjs
  scripts/spot-scanner-scalp-test.mjs:16/16 PASS on fixed source.
- Disposable PostgreSQL17 policy suite:56/56 PASS, including real concurrent
  waiting claims after an instant FILLED winner, RLS/foreign owner, immutable
  allocation/history, nonfinite/foreign evidence, fees/minimums and manual close.
  Command: SPOT_LIMIT_TEST_PG_BIN=/isolated/pg17/bin node
  scripts/spot-position-sql-test.mjs, also retained in the original SQL CI entry.
- Original complete Production CI: [40399456039](https://github.com/signal0verse/signalverse-main/actions/runs/40399456039), SUCCESS
  for exact main executable 952eb6201594fb3c5a5ef462e30b4215c74cd8e4; all mandatory original steps retained.
- Four original compiler comparisons: PASS with no introduced diagnostics.
  Existing baseline TypeScript diagnostics remain; this is not a zero-error
  global typecheck claim.
  The first release evidence collector stopped before any dispatch because
  GitHub CLI's formatted log omitted the last two results. The official raw
  attempt ZIP contained all four. The collector was corrected to require both
  frontend/API results in each original successful step43/56, with unchanged
  source, tests, assertions and workflow. The incomplete formatted log and
  stopped checkpoint were preserved; release resumed only after raw evidence
  and absence of any earlier release action were verified.
  A separate read-only operator RPC probe initially assumed a public database
  origin. It stopped before approval/delivery. The existing configured internal
  route was checked without exposing credentials or changing configuration;
  the corrected probe then verified the actual owner-scoped snapshot. Artifact
  preparation and the already verified additive migration were not repeated.
  Commands: node scripts/partner-spot-limit-scope-test.mjs --types and node
  scripts/futures-profit-protection-scope-test.mjs --types; both retain the
  original frontend/API comparison and diagnostic matching rules.
- Fresh consistent145-relation backup/cold restore, all table counts/catalog/
  RLS, six CHECK-format round trips, two effective owner-ACL representations
  and both SQLite cold/compressed round trips: PASS. Actual-restored-schema
  migration rehearsal preserved old rows/catalog/ACL/RLS and adopted no orders.
- All2572 native Git blobs/executable modes, the nine exact source files allowed
  by the unchanged installed sanitized-admin deployer, its compiled asset copies
  and strict root/group/file modes, public assets,
  process source, schema bodies/permissions/triggers/indexes and existing-owner
  native RPC/cache/scope: PASS. Normal-cadence native pooled exit and retained
  Demo history/real order identities were verified; exact signed exchange GETs
  matched existing identities/type/price/quantity.
  The first full-tree operator checker incorrectly expected private trading
  source inside the sanitized admin tree. It stopped after confirming the whole
  native tree. The unchanged installed deployer was byte-matched to reviewed Git;
  its exact nine-file copy contract and compiled asset copies were then verified,
  together with absence of private trading source. Nothing was copied into admin
  to satisfy the earlier assumption, and deployment/approval were not repeated.

The first official run40371555121 FAILED at a missing imported planner in a
recursive scalp fixture. Two fixture dependency bindings were corrected without
changing assertions or runtime bytes. An intervening local full run had109
passes and3 source-signature failures because a Git commit occurred during its
verification. That run was retained as invalid, not counted as a pass. The16
targeted tests and the final complete official CI ran on fixed source and passed.
The earlier14981cb0 run40376214671 lost its first runner when local Docker shut
down; its second attempt was deliberately superseded by the native four-rung
preservation correction. The27b410e5 candidate run40383281408 was then cancelled
while queued when the owner requested local Docker be closed. Those outcomes
and diagnostics remain separate from the final successful attempt. At the
owner's renewed request, all final tests ran in a disposable server container
with two CPUs and4GiB, mapped unprivileged user namespace, no host mounts or
inbound ports, and blocked private/production egress. Local Docker stayed off.
No workflow, assertion, routing variable or comparison was weakened.
Its resumed server attempt2 passed25 original steps, then74/77 allocation
checks passed and3 failed because an extracted function lacked the actual
cohort dependency. Only two fixtures, their closed preservation manifest and
documentation changed. All40 and51 prior assertion calls were retained;
separate current native Demo/real and profit/loss/open/manual/latest-round cases
exercise the actual helpers. Runtime, dependencies and migration bytes stayed
unchanged. The final successful exact-source official run supersedes that failure.
A server rehearsal bootstrap that executed no tests was retained as incomplete;
the corrected fixed-file runner did not count that probe as a pass.
The fixture-only95011 candidate subsequently reproduced a real first-entry
regression with synthetic ports: analysis0/persistence0 instead of1/1 for a
genuinely new zero-cycle setup. The original cron explicitly uses this same
function for first entry. Its unassigned CI was cancelled as superseded.
The final source restores original first entry for a confirmed empty scoped
history and zero used cycles. Used/invalid counters or unknown history remain
held; existing rounds still require a complete non-manual jointly profitable
close. Funding, credit, geometry, cycle caps and net compound calculations are
unchanged. All175 focused actual-current cases passed on that final source in
the capped server environment, with no failed/skipped/cancelled tests. The
current native Demo/real cases cover all three venues, prior-history holds and
the original gross-profit-minus-withdrawals compound calculation.
The older-source private rehearsal completed12 original run blocks and was
then deliberately retired during the next block after the replacement's175
focused checks passed. Its partial result was preserved, not claimed as a
complete pass. The final official exact-source run performed every original
step in full and provides the release evidence above.

## Build / Delivery Result

Web, Admin, native API and shared owned runtime builds: PASS in final official
CI/delivery. Original retained preparation [40422674255](https://github.com/signal0verse/signalverse-main/actions/runs/40422674255)
and original guarded release [40423356619](https://github.com/signal0verse/signalverse-main/actions/runs/40423356619) succeeded.
The retained ZIP/tar/PAX/tree/blob/mode/digest contract was independently verified
without repacking or running archived application code as root. The original
one-use approval was consumed for the exact artifact. No installed Guard,
workflow, archive bound, TTL or scheduler gate was relaxed.

## Git Status / Commit

Executable source and feature branch were published without force push.
Rollback refs preserve the pre-change main and runtime. Main later received
documentation-only 9e3da71a6a3176c21abb8f401e117696640f5a98; active native/admin/owned source
remains 952eb6201594fb3c5a5ef462e30b4215c74cd8e4. Tracked work is committed; generated build outputs are retained.

## Remaining Issues / Risks and Limitations

No open item remains for the requested native Telegram weighted-position fix.
Unknown outcomes, unconfirmed fees and legacy evidence holds remain conservative;
they are not automatically erased/adopted to make a dashboard green. Real
execution evidence covers the naturally eligible observed path, not every
private account or future profitability. The separate Paper deployment stays pinned
to 2da63dc5441928c5c325067869445e8732bde48c; it is outside this native Telegram rollout.
After pooled metadata exists, preserve its allocations/fills/holds and prefer
compatible forward repair; legacy downgrade needs reconciled owner-approved
recovery. All22 installed controls and17 job gates stayed unchanged. No forced
analysis/job, profile activation or operator exchange POST/DELETE was used.
Private account identifiers, portfolio amounts/levels, keys, database exports
and test artifacts are excluded from this report.

## Recommended Next Step

Use normal bot execution and the shared position display. Any future incident
should reconcile exact existing order identities and retained evidence before
changing execution state.
