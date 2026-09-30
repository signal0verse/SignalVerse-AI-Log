# Prediction v2 bounded shadow outcome collection

## Metadata

- Date: 2026-10-01, 03:26 Asia/Kuala_Lumpur (2026-09-30 19:26 UTC); publication receipt recorded separately after final CI.
- Task: owner-approved implementation of the 2026-10-01 outcome-collection design.
- Module / mode: Prediction Market, shadow validation data collection only.
- Repository: signal0verse/signalverse-main.
- Branch: codex/prediction-v2-outcome-collection.
- Starting commit: f5c843ef7bb32293255ea1a52308bc74fc388caf.
- Ending source commit: d8a52c019a00dd4add9b8153cd8c684a3ee00806.
- Draft review: https://github.com/signal0verse/signalverse-main/pull/184.

## Objective / authorized scope

Replace the resolver's mixed-version VALID-only LIMIT 200 selection with bounded,
fair collection for one frozen first eligible/scorable v2 shadow observation per
market. Preserve actual prior and evaluation provenance, deterministic order,
actual CLOB outcomes, retries, idempotency and v1 isolation. No changes to engine
math, classification, templates, H1-H8, AI policy, risk/Kelly/sizing, Entry/Real,
learning, production configuration or the separate A-mode timeout. No migration
or deployment was authorized.

## Actions taken / files inspected

Read the owner's explicit implementation approval and the approved audit design;
reviewed AGENTS.md, CLAUDE.md, HANDOFF.md, AI handoff/release boundaries and safe
test runbook. Inspected the current resolver, run wrapper, settlement helpers,
Engine v2 metadata/persistence, schema/index migrations, isolated PostgREST
transport, existing Prediction tests and Production CI workflow. Read the public
AI-Log report template. Reviewed actual production SQL plans and a read-only
runtime/gate baseline; no production captures became fixtures.

Created a feature branch, implemented collection, added deterministic integration
tests, updated superseded VALID-only structural assertions, ran the reviewed
safe suite/build/API bundle/scope audit, committed eight intended files and
published an attached draft PR. No merge or release was dispatched.

## Files changed

Committed in the source SHA above:

1. api/predictions.ts — collector, narrow opt-in CLOB binary validation/deadline,
   resolver wiring and test exports.
2. scripts/prediction-v2-outcome-collection-test.mjs — 27 native node:test cases.
3. scripts/lib/prediction-isolated-env.mjs — Prediction-only JSONB CAS/keyset
   transport support, controllable asynchronous CLOB responses, created_at default.
4. scripts/prediction-resolution-lookup-test.mjs — include the new collector in
   unresolved-write protection checks; preserve legacy mapping assertions.
5. scripts/prediction-shadow-resolution-test.mjs — owner-approved frozen v2
   architecture replaces the old VALID-only requirement, with source/idempotency
   constraints retained.
6. .github/workflows/production-ci.yml — run the new offline collector suite.
7. docs/prediction-v2-outcome-collection.md — storage/selection/chronology contract,
   exact limits, query plans and validation/release boundaries.
8. HANDOFF.md — dated implementation and remaining release gate.

This final report is saved locally under reports/prediction/ and published to
SignalVerse-AI-Log/master; it is outside the tested executable source commit.
Temporary receipts/logs/scripts are under tmp/prediction-v2-outcome-collection-20261001/
and are not committed or published. Existing unrelated/untracked work is preserved.

## Root cause / findings

CONFIRMED: the old shadow query excluded scorable abstentions, mixed v1/v2 and
limited repeated rows before market deduplication. The new worklist does not
depend on OPPORTUNITY/WATCH/NEUTRAL/INSUFFICIENT_DATA, class or future outcomes.

CONFIRMED: existing JSONB can hold a durable selection/provenance/status registry
without schema changes. All 7,116 production market metadata values in the
read-only plan snapshot were NULL; code nevertheless preserves other object
metadata and refuses unknown state versions/non-object metadata.

CONFIRMED: the source helper provides closed state and winner tokens, not an
authoritative settlement timestamp. Assigning today's resolved_at cannot prove
a historical settlement occurred after the observation. This implementation
records that limitation explicitly and excludes such chronology from scoring.

UNCONFIRMED: deployed behavior of the new collector, real-world PostgREST/CLOB
latency over all markets, and complete Phase 9A statistical acceptance. These
are not inferred from mocks, successful builds or current service health.

## Implementation

Successor probes skip all repeated evaluations for the last market ID; the
latest successful resolver run summary persists the rotation cursor. History
uses ts ASC, id ASC with keyset continuation, only v2/NULL user rows whose parent
run is entry_shadow. Exactly one first eligible observation is frozen in
prediction_markets.metadata.v2ShadowOutcome by whole-metadata CAS. Outcomes are
not read to choose it. Later evaluations and backfills cannot replace a freeze.

Eligibility requires exactly one parseable frozen V2_META, finite actual p0 in
[0,1], finite stored YES probability in [0,100], valid observation timestamp and
asOfMs <= ts <= collection time. Price metadata, when present/required, must use
only candles before evaluation with the existing spot freshness limit. A real
50% prior is accepted; no-book fallback 50% is excluded. Unsupported and
inadmissible flags are separate overlapping abstention dimensions; they are
not relabeled VALID. Exclusion counts cover the scanned prefix, while run
scorable/missing-outcome counts cover visited selections, not the global cohort.

Per invocation: <=12 market visits, <=256 returned history rows, <=32 per visit,
<=8 distinct conditions, concurrency <=2, 30s shared collector deadline and
15s per-CLOB fetch timeout. Requests to both PostgREST and CLOB receive abort
signals. This deadline starts after the unchanged Demo settlement path; the
legacy path/run-summary writer and AI funnel do not acquire new deadlines.

Condition IDs are deduplicated before CLOB GETs. The shared settlement helper
is used with validation-only strict binary checks: exactly two distinct source
tokens, complete frozen YES/NO mapping, at most one winner. Its default legacy
Demo/discovery mapping remains unchanged. No price/end-date/AI inference.
LOOKUP_FAILED and NOT_YET_RESOLVED retry on subsequent rotations; cancellation,
UNMAPPED and INVALID_BINARY write terminal non-scoring status sentinels.

Source/time/token receipt persists before the selected-row update. Only the
selected v2 observation with NULL outcome may receive its first result.
Preexisting and concurrent conflicting outcomes are never overwritten or
silently adopted as a verified collector score. If acknowledgement is
interrupted after writing, the next visit may repair it only when outcome and
resolved_at match the persisted receipt. A pending receipt alone proves no
successful outcome write. No history-wide v2 writes or v1 shadow writes occur.

Evaluation/observation/freeze times remain immutable. resolved_at/observedAt is
the collector's first observed outcome timestamp; actualResolutionAt remains
NULL. An open lookup after the observation followed by a closed lookup provides
a valid transition bracket and permits binary scoreEligible. Closed on first
lookup collects coverage with RESOLUTION_TIME_UNVERIFIED/scoreEligible=false.
The future Phase 9A reporter must require exact receipt/row agreement and this
chronology flag before scoring; disabled legacy learning is not that reporter.

## Database / actual query-plan review

Production DB writes: NONE. Reset/destructive mutation: NONE. Migration: NONE.
SQL ran in READ ONLY REPEATABLE READ transactions with 20s statement timeouts.
The final history/CAS plan used the real service_role privileges. CAS used
EXPLAIN without ANALYZE, so UPDATE was planned and never executed.

- Market worklist successor: existing idx_prediction_predictions_market;
  execution 33.472ms / 513.574ms in sampled plans.
- Initial per-market history query: 31.830ms / 128 returned rows.
- Final 32-row keyset history: 981.377ms, bitmap indexes plus top-N sort.
- Market JSONB CAS: primary-key index with metadata equality filter, plan only.
- Latest resolver summary: run-type/start index, 0.175ms.

These samples motivated conservative caps. Returned rows/client work are
bounded; PostgreSQL physical pages are not (one probe filtered 3,135 rows; one
history sample visited 614 heap blocks). Abort propagation/server cancellation
and load growth require post-release observation; no new index is authorized.

## Tests executed

All tests use synthetic data/source extraction/in-memory transports and no
production credentials or data fixtures. Unknown outbound requests are rejected
by the isolated harness. Local Node version: v24.19.0; CI supplies Node 22.

Full reviewed SAFE Prediction suite: PASS, 26 files, 142 node runner entries,
0 failures/cancellations/skips. The runner counts assertion scripts as aggregate
entries; 142 must not be presented as the count of every individual assertion.
The legacy prediction-market-position-credit-test.mjs reads production env and
performs production DB writes; it was intentionally NOT RUN and is not in CI.

Exact invocation (one node --test process with this allowlist):

```powershell
node --experimental-strip-types --test `
  scripts/prediction-ai-price-review-diagnostic-test.mjs `
  scripts/prediction-autonomous-account-test.mjs `
  scripts/prediction-autonomous-monitor-i18n-test.mjs `
  scripts/prediction-autonomous-multiuser-test.mjs `
  scripts/prediction-autonomous-sizing-test.mjs `
  scripts/prediction-calibration-test.mjs `
  scripts/prediction-demo-lifecycle-test.mjs `
  scripts/prediction-duplicate-protection-test.mjs `
  scripts/prediction-engine-v2-test.mjs `
  scripts/prediction-market-engine-test.mjs `
  scripts/prediction-market-lifecycle-test.mjs `
  scripts/prediction-market-lookahead-test.mjs `
  scripts/prediction-observability-test.mjs `
  scripts/prediction-ranking-test.mjs `
  scripts/prediction-resolution-lookup-test.mjs `
  scripts/prediction-revalidation-test.mjs `
  scripts/prediction-settlement-test.mjs `
  scripts/prediction-shadow-classification-test.mjs `
  scripts/prediction-shadow-entry-test.mjs `
  scripts/prediction-shadow-resolution-test.mjs `
  scripts/prediction-side-aware-test.mjs `
  scripts/prediction-time-horizon-gate-test.mjs `
  scripts/prediction-tradeability-gate-test.mjs `
  scripts/prediction-v2-i18n-test.mjs `
  scripts/prediction-v2-outcome-collection-test.mjs `
  scripts/prediction-v2-replay-regression-test.mjs
```

New collector tests: 27 native cases cover multi-tick fairness, failures/open
retries, bounded history continuation, first-row preservation, chronological/ID
ties, actual prior/fallback exclusion, all four decision classes, exact token
mapping/provenance, cancelled/unmapped/non-binary outcomes, idempotency,
preexisting/concurrent conflict protection, concurrent freeze, v1/manual/real
cohort exclusion, temporal metadata/order, historical uncertainty, condition
deduplication, concurrency, elapsed/transport cancellation, crash receipt repair,
unknown metadata preservation, real Engine-generated shadow records, no trade
creation/Entry/Real/learning activation. Existing Demo lifecycle: 21 native cases
including unchanged multi-user sizing/PnL/ownership and concurrent settlement.

Initial structural checks failed because they enforced the superseded VALID-only
path; they were updated to the explicitly approved v2 cohort and unresolved CAS
contract. A new synthetic engine test initially used a question without the
verified date shape; its fixture was corrected to the verified question. Final
suite has no skipped or failing checks; no trading gate or PnL expectation was
weakened to obtain a pass.

Protected-module diff audit: PASS. Compared all 216 original top-level source
declarations by TypeScript AST against starting SHA. Only ClobSettlementStatus,
fetchClobMarketState, fetchClobSettlementOutcome, autonomousResolutionTick and
test exports differ; four new collector declarations were added. The old Demo
settlement block is byte-identical. Engine/evidence/classifier/templates/H1-H8,
entry, Real, risk, Kelly, sizing, AI/diagnostic and learning declarations are
unchanged. Published PR file list matches the eight intended files above;
no Futures/Spot/Fast Trader/Supervisor/Wallet/UI/scheduler/migration changes.
git diff --check: PASS.

## Build / CI

- npm run build: PASS, web + standalone admin. Existing >500kB chunk warning;
  no new UI behavior or bundle policy change.
- npx esbuild api/predictions.ts --bundle --platform=node --format=esm
  --packages=external --outfile=tmp/prediction-v2-outcome-collection-20261001/predictions.mjs:
  PASS (final 160.3kB local bundle).
- Production CI run 36765431271 for exact head
  d8a52c019a00dd4add9b8153cd8c684a3ee00806: completed/success, verified from
  GitHub's final run receipt. The offline Prediction step, disposable SQL tests,
  web/API build and the full required CI job all passed under Node 22.
  https://github.com/signal0verse/signalverse-main/actions/runs/36765431271
- Release/artifact/deployment workflow dispatch by this task: NONE.

## Git / commit / publication state

Source commit d8a52c019a00dd4add9b8153cd8c684a3ee00806 was normally pushed to
origin/codex/prediction-v2-outcome-collection and remote ref verified identical.
Draft PR 184 is attached to this chat. Tracked tree is clean. Main was not
merged/pushed by implementation; unrelated/untracked work remains preserved.
This final report is not included in the source SHA, so the published CI head
continues to identify the exact executable change. Its AI-Log publication uses
the contents API on master with returned commit/blob receipt and remote-byte
verification; failure would be reported instead of claiming success.

## Production status / remaining issues

- IMPLEMENTED: bounded v2 shadow collector on the feature branch.
- TESTED: reviewed safe local suite/build/API compile/scope audit and successful
  exact-head Production CI under Node 22.
- DEPLOYED: NO deployment of this change.
- OBSERVED IN PRODUCTION: new collector NOT OBSERVED. Only old runtime baseline
  and read-only SQL plans were inspected.
- NOT YET VALIDATED: calibration, fee-adjusted profitability, model/AI/B/C
  superiority, complete Phase 9A cohort/criteria and new collector runtime health.

Read-only runtime baseline at 2026-09-30T19:25:31Z: deployed SHA/release symlink
still b211db170dc3e35fd2965cdb74e496df5998d19a; service active/running. Only
prediction-discovery-cron.enabled, prediction-shadow-entry-cron.enabled and
prediction-resolve-cron.enabled exist among Prediction gates. Shared runner has
zero prediction-enter-cron or prediction-learn references. Real execution source
remains disabled, with unchanged 501 behavior verified by offline regression.

ENTRY = OFF. REAL = OFF. AUTONOMOUS-LEARN = OFF.
No fake trades. No forced opportunities. No gate weakening. No unrelated changes.

## Risks / limitations / next milestone

No new exact-release approval was supplied, so work stops before deployment.
Neither successful CI nor a draft PR authorizes activation. Resolver-summary
durability is necessary for rotation. SQL plans are samples; existing indexes
still read more physical rows/pages than the client caps. Historical closed or
preexisting outcomes lack certified actual chronology; coverage collection does
not make them eligible scores. Pending receipts must be joined to their row.
Normal database-default timestamp ordering is assumed for partial scans; a
future historical observation backfill during a partial scan needs review.

Next: owner review and explicit approval for the exact release SHA, then the
existing release process, read-only verification of collection/provenance/
idempotency/isolation/health with Entry/Real/learn OFF. No gate file or
prediction-enter-cron installation is part of this change. Then collect enough
prospective temporally verified distinct outcomes and implement the separate
read-only cohort validation reporter; the AI timeout remains a separate task.

Phase 9A stays unchanged: >=28 days, >=300 distinct resolved markets, >=100 per
applicable allowed type, >=30 resolved would-open markets, paired Brier/log-loss
with registered bootstrap criteria, ECE <=0.03 with required bins/uncertainty,
fee-adjusted edge, H1/H5, stability, type/category and abstention analysis. No
criterion is lowered to compensate for insufficient evidence.
