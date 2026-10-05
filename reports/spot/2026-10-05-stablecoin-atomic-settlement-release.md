# Stablecoin corrective release: atomic demo settlement and section reliability

## Metadata

- Date: 2026-10-05 (Asia/Kuala_Lumpur; operational receipts use UTC)
- Task ID: stablecoin-section / 01a10bb3-67d7-7c81-9441-9efec303daa9
- Module: Stablecoin shared demo, viewer/operator UI and internal bookkeeping
- Mode: isolated development, offline actual-source tests, disposable SQL tests, owner-authorized production release
- Repository: signal0verse/signalverse-main
- Branch: codex/stablecoin-audit-20261005, promoted normally to main
- Starting source/observed active runtime: f71d287167a33fffa9b0af99e6fb2fd1a021c0c5
- Initial audit commit: 997cc23bdab2b5471e536b479362a01c4f317cc7
- Ending source commit: 78787814b3f3b2ff86080f279560728f9e434449
- Runtime verification: PASS, exact ending SHA; final read-only receipt 2026-10-05T12:10:51Z

## Objective

The owner identified the Stablecoin home card and asked to check the section for
bugs, then explicitly instructed: fix its bugs and deploy the app. The earlier
audit fixed UI/fee issues but withheld deployment because two actual-source
faults proved unsafe non-atomic demo settlement. This request completes that
correction and the official release process.

## Scope

Stablecoin Phase-1 demo and its existing shared viewer/operator permissions.
No Real stablecoin activation, real order, withdrawal/transfer, credential change,
strategy threshold rewrite, account migration, historical balance backfill or
other trading-module change. Preserve unrelated dirty primary-checkout work,
independent workers, protection/reconciliation and deployment authorization.

## Actions Taken

1. Reused the attached isolated worktree and rechecked current main/active runtime.
2. Replaced separate balance/ledger writes with transactional PostgreSQL settlement.
3. Unified manual/cron durable claims and added stale-cycle/duplicate fencing.
4. Corrected reserve/manual-capital concurrency, retries, validation and reporting.
5. Retained all initial actual-source UI/access/fee corrections and expanded tests.
6. Added a closed, hash-pinned Stablecoin release contract and preserved historical
   assertions through exact reversible comparison-boundary integrations.
7. Pushed normally/atomically to main and the candidate branch, retaining rollback
   ref codex/rollback-stablecoin-20261005 at the original runtime SHA. No force push.
8. Required successful exact main-push CI; prepared the official retained artifact
   and independently compared all 830 Git blobs without executing archive code.
9. Took a complete private on-server backup, restored it on that host and applied
   the exact migration twice to the restored database. Compared historical data.
10. Applied only the reviewed migration to production, verified definitions against
    rehearsal, issued an existing one-use exact-SHA/digest approval out of band,
    and dispatched the official Production Release workflow.

## Files Inspected

AGENTS.md, CLAUDE.md, latest HANDOFF.md, docs/AI_HANDOFF.md, full
TRADING_STRATEGY.md/current amendments, colleague handoff and safe test runbook;
Stablecoin API/UI/migrations/tests, release workflows, release-artifact verifier,
existing historical scope contracts, backup implementation, installed Guard and
coordinator source, read-only production schema/configuration identity and service
fingerprints. Credentials and private account rows are not included in this report.

## Files Changed

- api/stablecoin-engine.ts; src/app/App.tsx; api/analyze.ts (Stablecoin help only).
- migrations/stablecoin_demo_atomic_settlement.sql (new additive migration).
- scripts/stablecoin-panel-regression-test.mjs;
  scripts/stablecoin-settlement-test.mjs;
  scripts/stablecoin-settlement-sql-test.mjs;
  scripts/stablecoin-engine-test.mjs;
  scripts/stablecoin-demo-atomicity-audit.mjs.
- scripts/lib/stablecoin-release-parity.mjs;
  scripts/lib/stablecoin-release-delta.json;
  scripts/stablecoin-release-scope-test.mjs.
- scripts/lib/futures-entry-release-parity.mjs;
  scripts/futures-entry-release-scope-test.mjs;
  scripts/futures-tutorial-ui-test.mjs (historical comparison integration only).
- .github/workflows/production-ci.yml (additive Stablecoin tests), HANDOFF.md,
  docs/fixes/stablecoin-section-audit-2026-10-05.md,
  docs/fixes/stablecoin-atomic-settlement-2026-10-05.md.

## Root Cause / Findings

CONFIRMED:

- A destination balance write failure left the source debited; a failed ledger
  insert could still return executed=true. Rebalance had the same split-write risk.
- Manual tick bypassed the cron claim. Old work could settle after stop/new claim.
- Manual capital additions could overwrite concurrent balances. Reserve refill
  could consume reserve without a valid destination row or accurate before balance.
- Request retries generated new withdrawal IDs; capital additions had no durable
  request identity. Lost responses could lead to duplicate bookkeeping.
- Rebalance totals counted only the last 50 rows; ordinary row-limited reads could
  silently truncate full-history metrics. Rebalances polluted opportunity counts,
  and capital injections/omitted rebalance costs could distort drawdown.
- Initial audit also proved cross-allocation history races, hidden failures/stale
  data, misleading viewer account state, inflated gross previews, stopped-history
  disappearance, malformed fee acceptance and missing rebalance fee verification.

UNCONFIRMED: profitability, private-account execution and physical Telegram-device
behavior. No claim that previously inconsistent historical rows are reconciled.

## Implementation

One settlement RPC serializes setup -> allocation -> inventory, validates active
identity and the exact durable cycle claim, writes both balances, cooldown and
ledger together, and returns a committed trade ID. Suppressed/failed writes roll
back. Same-cycle/same-kind repeats return the original receipt; changed payloads
conflict. Unknown responses never become successful executions or new retry IDs.

Existing par-value demo math, opportunity-unit cap, fee/strategy thresholds,
withdrawal policy and Trading Capital ROI denominator remain. Rebalance costs
stay distinct from realized strategy profit. Normal cooldown skips rebalance and
allows strategy evaluation. Market/fee/key restrictions validation fails closed.

Shared locking protects reserve/manual additions, membership, finite inputs and
active state. UI request identities persist across reloads until acknowledged.
The full-ledger read-only snapshot is consistent within one SQL statement and
does not inherit PostgREST row truncation. Direction labels use actual assets;
drawdown uses transaction deltas rather than treating injected capital as gains.

## Tests Executed

All application tests used fake transports or newly initialized loopback clusters;
none loaded application env files, invoked live trading APIs or used real accounts.

- Node 22: --test scripts/stablecoin-engine-test.mjs
  scripts/stablecoin-panel-regression-test.mjs scripts/stablecoin-settlement-test.mjs
  scripts/stablecoin-market-data-collector-test.mjs: PASS, 49 top-level tests.
  Legacy engine contains 395 internal checks and collector 107; these are not
  falsely counted as separate node:test results. Actual UI has 30 cases and new
  actual settlement/market/request/report behavior has 17 cases.
- STABLECOIN_TEST_PG_BIN with PostgreSQL 18, scripts/stablecoin-settlement-sql-test.mjs:
  PASS, 20 cases, real production declarations/procedures on a fresh local cluster.
  Includes destination/ledger exceptions and suppressed writes for both paths,
  receipt/replay conflicts, concurrency, finite/identity/stop/claim rejection,
  reserve/capital/withdrawal serialization, grants and custom dump/restore.
- Closed Stablecoin/entry scopes plus actual Futures tutorial:
  --test scripts/futures-tutorial-ui-test.mjs scripts/stablecoin-release-scope-test.mjs
  scripts/futures-entry-release-scope-test.mjs: PASS, 113 tests including tampering.
- Initial broad PP/Spot/reentry/tutorial aggregate: 879/880 PASS; the single failure
  was a direct historical App comparison that still read current Stablecoin bytes.
  Its comparison boundary was repaired without deleting/changing the assertion;
  the affected 113-case aggregate above and final exact-source official CI pass.
- Strict API TypeScript check: PASS. Frontend baseline/current diagnostics 71/71,
  zero introduced; this is not a claim the repository has zero existing TS errors.
- git diff --check: PASS. Historical negative atomicity audit stays pinned to
  997cc23 and intentionally demonstrates the two prior failures.
- Official main-push Production CI: SUCCESS,
  https://github.com/signal0verse/signalverse-main/actions/runs/37305591163
  (same exact ending SHA, including all existing gates and new offline/SQL tests).
- Production PostgreSQL 17.11 restore rehearsal: migration applied twice, historical
  inventory/trade/event/allocation/reserve hashes unchanged, four new public RPCs
  present, no production data mutation during rehearsal.

## Build Result

Node 22 web and standalone admin builds PASS. Changed API handlers bundle without
execution. Official CI also built all web/admin/API outputs. Existing web chunk
size warning remains; no build gate was removed.

## Git Status

Main and candidate branch published at ending SHA; rollback branch retains f71d287.
Primary dirty checkout and unrelated/untracked work preserved. Executable changes
were published with normal CI (no skip directive); production activation is
separate. Isolated candidate was clean after commit.

## Commit

78787814b3f3b2ff86080f279560728f9e434449

## Backup, Artifact and Deployment Evidence

- Automatic approval review rejected the proposed full production JSON backup to
  a local task directory because it would copy sensitive account data. That command
  did not run. The approved safer alternative kept all sensitive bytes on the
  existing server in a private directory/file (0700/0600); no private data download.
- Complete custom-format backup: 178006889 bytes, SHA-256
  6af4c5840be37399bacaf3c2036c9e33781380f42519426014513c81e2aa0ef6.
  Full restore succeeded: 98 public tables, 12 Stablecoin tables, 136 inventory
  rows, 6820 demo ledger rows, zero invalid indexes. Backup remains on server.
- Migration SHA-256: 8ac1962e6f38476e7d4e852eedf3ed0f1bdcf23571c6ba9fe7f2020c11c01abe.
  Production applied at 2026-10-05T11:59:41Z; changed function definition digest
  matches rehearsal (3cb10b776321eb38fc6330b51814247a). No historical backfill.
- Official artifact preparation: SUCCESS, run 37306286462; artifact ID 11344106312.
  Inner archive: 4861448 bytes, SHA-256
  b9e9c320e8b4762cac4dda2731d4514e126b1d386ba89f9b5d0d07817580e5c8.
  Provenance/embedded commit/digest verified; all 830 regular Git blobs and modes
  exactly matched, with no downloaded archive code executed.
- Installed Guard/coordinator preserved. Existing out-of-band exact approval was
  issued and validated for this SHA/digest, then official release dispatched:
  https://github.com/signal0verse/signalverse-main/actions/runs/37306598498
- Official Production Release: SUCCESS. App/admin symlinks, deployment marker,
  process working directory and admin readiness identify the exact ending SHA.
  All 830 deployed source files match the approved artifact; all 22 control-plane
  fingerprints match preflight. App, admin, observer and release receiver active.
- Existing standalone profit-protection unit remains disabled/inactive with no
  start timestamp, consistent with the prior handoff. It was not activated by this
  release; no claim is made that this independent unit is running.
- Main loopback health and full admin readiness PASS. Private PostgREST schema
  exposes all four new RPCs. Generated API bundle contains settlement/snapshot/
  idempotent RPCs, and UI bundle contains the corrected viewer/request markers.
- Final Guard receipt: exact approval consumed once, no pending claim, incoming
  artifact SHA-256 matches the approved archive. No authorization bypass.
- Public root and /healthz return 200; unauthenticated Stablecoin access-status
  returns 401 as expected. Public /assets/index-DHxEyhIe.js exactly matches the
  active generated bundle, SHA-256
  4d5acc3cec09d9182dbb99fdde7603ab2656792cd52a336933d2220411624a13.
  Initial default-Python-client requests returned 403; browser User-Agent requests
  passed. No front-door, authentication or network policy was changed.
- Read-only log window 12:02:00Z through 12:10:51Z: zero Stablecoin error lines,
  nine normal market-collector ticks, zero collector failures. A first broad
  string search counted the routine failed=0 field; classification corrected that
  false positive. No authenticated account action or manufactured trade was used.

## Remaining Issues

No remaining failed release checks. Existing historical inconsistencies are preserved rather
than silently corrected; a separate evidence-based reconciliation would need its
own scope. This release fixes prospective settlement and the confirmed UI/report
defects, not the historical ledger's truth by assumption.

## Risks / Limitations

Demo only. Passed fault tests, restored data and successful deployment are not
proof of exchange fills, private-account execution or profitability. The established
simulation economics remain unchanged. Physical Telegram-device behavior was not
independently tested. No trade was manufactured to validate the release.

## Recommended Next Step

Use normal app operation to observe the updated section. Do not activate
Real Stablecoin trading or rewrite old ledger rows based on this report.
