# Prediction bounded v2 shadow collector — controlled exact-SHA release

## Metadata / authorization

- Report date: 2026-10-01, Asia/Kuala_Lumpur.
- Repository: signal0verse/signalverse-main; PR #184.
- Explicit owner approval: release only d8a52c019a00dd4add9b8153cd8c684a3ee00806.
- Exact deployed source SHA: **d8a52c019a00dd4add9b8153cd8c684a3ee00806**.
- Previous production SHA: **b211db170dc3e35fd2965cdb74e496df5998d19a**.
- Activation gate consumed: 2026-09-30T19:44:58Z / 2026-10-01 03:44:58 +08.
- Deployment success: **2026-09-30T19:45:01Z / 2026-10-01 03:45:01 +08**.
- Quantitative post-release cohort snapshot: 2026-09-30T19:53:59.754860Z.
- Mode: existing shadow observation/outcome collection only.

IMPLEMENTED: YES. TESTED: YES. DEPLOYED: EXACT APPROVED SHA.
OBSERVED IN PRODUCTION: two fully inspected natural collector batches; four
successful natural run summaries by the final health recheck, as detailed below.
STATISTICAL VALIDATION: **NOT COMPLETE / NOT YET VALIDATED**.

**Prediction ENTRY = OFF. REAL = OFF. AUTONOMOUS-LEARN = OFF.**
These statements concern Prediction; unrelated existing trading jobs were not
disabled, changed or reconfigured by this task.

## Objective / scope

Deploy the already-tested bounded v2 shadow collector through the existing
controlled release procedure. Do not substitute a commit, merge unrelated work,
change engine math/gates/AI/risk/sizing/settlement/isolation or any protected
trading module, run migrations, add schedulers/gates, force trades, enable entry,
Real or learning, or bundle the separate A-mode timeout. Post-deployment checks
are read-only; actual writes must come only from the existing natural resolver.

## Preflight / exact source and artifact

Read-only baseline at 2026-09-30T19:33:53Z confirmed deployed-sha, main/admin
symlinks and active service identify b211db170dc3e35fd2965cdb74e496df5998d19a.
PR #184's exact head was d8a52c019a00dd4add9b8153cd8c684a3ee00806, base main
f5c843ef7bb32293255ea1a52308bc74fc388caf, with successful PR CI.

Git ancestry: previous runtime -> f5c843ef (documentation-only audit) -> approved
d8a52c01 implementation. main was exactly the direct parent, so it was normally
fast-forwarded to the approved commit without a merge/replacement commit or
force push. Remote main was verified equal to the target. This supplies the
controlled workflow's required main-push CI; it does not select a moving HEAD
as the application release. Artifact/release inputs always use the literal SHA.
The local feature checkout stayed on the target, with tracked source clean at
preflight and unrelated/untracked work preserved.

Final GitHub read confirms PR #184 is merged/closed with both its head and
merge_commit_sha equal to the exact approved d8a52c019a00dd4add9b8153cd8c684a3ee00806;
remote main still points to that same commit. No replacement merge commit exists.

| Evidence | Result / identity |
| --- | --- |
| PR CI | [36765431271](https://github.com/signal0verse/signalverse-main/actions/runs/36765431271), success, exact target |
| Required main-push CI | [36766682086](https://github.com/signal0verse/signalverse-main/actions/runs/36766682086), success, exact target |
| Prepare-only workflow | [36767150563](https://github.com/signal0verse/signalverse-main/actions/runs/36767150563), success, exact target/main/manual event |
| Immutable artifact ID | 11122650127, non-expired, attempt 1 |
| Artifact name | production-release-d8a52c019a00dd4add9b8153cd8c684a3ee00806-36767150563-1 |
| Inner archive size | 4,440,067 bytes |
| Inner archive SHA-256 | fca043ddc9c81b1d027c69386d270b4759dae043be48c17247f9bdb953e07872 |
| Controlled release | [36767582721](https://github.com/signal0verse/signalverse-main/actions/runs/36767582721), completed/success, exact target |

Downloaded exactly artifact 11122650127 and independently hashed its inner
release.tar.gz. Existing release-artifact.mjs verified run/artifact provenance,
metadata, repository, attempt, digest and embedded Git commit. A separate archive
review compared every one of 681 regular files to the target Git blobs: all
exact; no untracked/local private env/test-output paths or special file entries.
No archive was repackaged for delivery.

The existing root authorization store received one new release approval binding
this exact SHA to the independently verified digest, using exclusive creation,
private permissions, one-hour expiry and the installed inspector. Existing
authorizations/claims were not overwritten. This is the existing release
authorization mechanism, not a trading/scheduler gate. The receiver and final
coordinator consumed it once under their unchanged guard. Received VPS archive
digest matches the independently inspected bytes. No guard policy/tooling was
changed or bypassed; no direct application release script replaced the workflow.

## Runtime verification

Read-only verification at 2026-09-30T19:45:50Z:

- deployed-sha = d8a52c019a00dd4add9b8153cd8c684a3ee00806.
- Main symlink = /opt/signalverse/releases/d8a52c019a00dd4add9b8153cd8c684a3ee00806.
- Admin symlink = /opt/signalverse-admin/releases/d8a52c019a00dd4add9b8153cd8c684a3ee00806.
- Running main process cwd identifies the same release; main/admin/observer are
  active/running, restarted at 2026-09-30T19:44:58Z by the existing coordinator.
- Main health: ok=true. Admin health: exact releaseSha, authReady/snapshotReady/
  staticReady/databaseReady all true. Read-only public-info returned HTTP 200.
- Controlled deploy unit: Result=success, exit status 0; authorization validation/
  consumption PASS, activation PASS in its installed coordinator journal.
- Main/admin .release-ready markers present. Compiled predictions.mjs contains
  collectV2ShadowOutcomes; subsequent actual run summaries prove it executed.
- All 681 deployed source files match the approved artifact bytes. Exact
  Prediction source SHA-256:
  027b07f5ff3fe67fa2fafcb52b7be4d64c934ed7cabd2509cce7d9f4a9599ce8.

Health and HTTP status alone are not the collector acceptance evidence; actual
stored natural-run/cohort evidence follows.

Final read-only runtime recheck at 2026-09-30T20:03:02Z again confirmed exact
deployed SHA, both symlinks, unchanged running process identity, healthy
main/admin/observer, identical source/archive digests and retained rollback
pointers. No additional deployment or restart occurred during verification.

## Natural shadow collector runs / bounded rotation

No resolver endpoint was manually POSTed, no job was manually triggered, and no
test/fixture rows were inserted. Existing scheduling produced these runs:

| Metric | First natural run | Second natural run |
| --- | ---: | ---: |
| Start UTC | 19:46:24.061 | 19:51:13.276 |
| Finish UTC | 19:46:28.162 | 19:51:17.392 |
| Entire resolver duration ms | 4,101 | 4,116 |
| v2 collector elapsed ms | 2,910 | 3,025 |
| Markets visited | 12 | 12 |
| History rows returned | 239 | 256 |
| Distinct CLOB lookups | 7 | 8 |
| Newly frozen selections | 7 | 8 |
| Binary outcomes written | 4 | 3 |
| Terminal non-binary outcomes | 0 | 2 |
| NOT_YET_RESOLVED | 3 | 3 |
| LOOKUP_FAILED | 0 | 0 |
| Errors / conflicts / deadlines reached | 0 / 0 / false | 0 / 0 / false |

Both run summaries have success=true/error=NULL. Observed work satisfies the
12-market, 256-row, 8-distinct-lookup and 30s collector bounds. The 32-row
per-market and concurrency-2 caps were verified in the exact deployed source
and synthetic integration suite; actual peak in-flight concurrency was not
independently instrumented in production. The unchanged preceding Demo path and
generic summary writer are outside the new collector deadline.

First persisted afterMarketId: 0ed726a8-3487-4e27-94a9-2c659da9f7ab.
Second persisted afterMarketId: 1b610f4d-1e2b-47ab-b4cf-0d9d094723bd.
Both equal the maximum registry market ID visited in their batch. The second
batch added 12 different markets, all strictly after the first persisted cursor;
every first-batch registry object/frozen observation remained identical. This
directly confirms cursor continuation and avoids the old repeated-row LIMIT
behavior across the two adjacent batches. A complete worklist wrap/revisit has
not been observed in this short verification window.

Follow-up status-only read at 2026-09-30T20:03:39.990138Z found two additional
natural successful runs: 19:56:03.608-19:56:07.145Z and
20:01:17.777-20:01:23.668Z. Each visited 12 markets with 7 lookups; rows were
209/231 and collector elapsed 2,416/4,398 ms. Neither reported errors, conflicts,
LOOKUP_FAILED or deadline hits. Their persisted cursors advanced to 2be0fce2
and 39b56e05 respectively. These later summaries support continued bounded
operation; their additional cohort rows were not subjected to the independent
15-selection / 9-receipt audit below, whose snapshot remains explicitly fixed.

## Outcome / cohort verification

Read-only snapshot 2026-09-30T19:53:59.754860Z:

- 24 market registries, 15 frozen eligible v2 shadow observations, 9 partial
  histories not yet selected. Partial scanning is distinguishable from selection.
- Independent chronological SQL validation: all 15 chosen IDs equal the first
  eligible row in ts/id order, with zero prior or evaluation-time mismatch.
  Original class/decision remains unchanged; all selections belong to v2,
  NULL-user observations and an entry_shadow parent run. No v1/manual/entry-real
  contamination. Zero invalid/nonfinite/range-invalid selected priors.
- The examined prefix contains 152 missing-prior fallback-50 rows; zero selected
  and zero given collector outcome receipts. All 152 remain separately counted
  as unscorable. A genuine 50% book prior remains permitted by the unchanged
  collector eligibility contract and was tested synthetically.
- Abstention coverage: 12 selections retain INSUFFICIENT_EVIDENCE, 10 have the
  unsupported flag, 12 the inadmissible flag. These are overlapping dimensions,
  not labels silently converted to VALID forecasts. Decisions/probabilities are
  preserved, including abstentions.
- 9 outcome receipts: 7 binary resolutions, 2 RESOLVED_NO_WINNER. Bounded public
  CLOB GET checks independently matched all 9 to closed state and the frozen
  stored token mapping/winner flags. No price/end-date/AI heuristic was used.
- All receipt outcome/timestamps match their selected observation row; no
  provenance mismatch. Each received timestamp is later than both observation
  and evaluation time. These are collector-observed outcome times, not invented
  authoritative settlement timestamps; actualResolutionAt remains NULL.
- All 9 have unverified resolution chronology and scoreEligible=false. There
  are **zero temporally verified scores**, including the seven historical binary
  resolutions. Cancelled outcomes are not scored. Future open-then-closed
  transition evidence is required to certify settlement after the observation.
- 6 still-open selections remain unresolved and have NOT_YET_RESOLVED state.
  They are not terminal and remain eligible for retry on subsequent rotations.
- First-batch outcomes and frozen registries are byte-identical after the second
  batch; no duplicate writes to that batch occurred. Outcome writes are guarded
  by ID/model-version and NULL-outcome CAS in deployed code. A full rotation
  revisit, forced concurrent conflict and crash-repair event were **not** induced
  in production; their behavioral protection remains supported by the previously
  passed synthetic cases, not falsely claimed as live fault-injection evidence.
- All 14 preexisting v2 outcomes retain their pre-release timestamps and YES
  distribution. No observed preexisting outcome was overwritten. There was no
  live conflicting writer in the window; conflict-branch execution is not claimed.

LOOKUP_FAILED, UNMAPPED and INVALID_BINARY were not observed in the two natural
run samples. Their retry/non-scoring handling is verified in deployed source
and prior deterministic tests, not claimed as production-exercised. Two actual
cancelled/no-winner source outcomes were observed and independently verified.

## Database safety / protected module integrity

Every operator verification SQL transaction was READ ONLY, with bounded
statement/lock timeouts. No production reset, manual UPDATE/INSERT/DELETE,
migration, account/profile/balance edit or fixture creation occurred. Public
outcome rechecks were GETs only. The natural application resolver itself wrote
the approved market JSONB registry and selected observation outcome/time fields.

All 253,821 v1 rows have the identical pre/post whole-row fingerprint. For all
30,950 v2 observations existing at the pre-release snapshot, the entire stored
row except its two authorized outcome/time fields has an identical pre/post
fingerprint. Thus probabilities, decisions, evidence, class and other original
observation fields remain unchanged in this inspected population. Snapshot
fingerprints/receipts are kept locally; account-level data are not published.

Deployed source diff from previous runtime: only the eight reviewed implementation
files plus the already-existing documentation-only audit report. All protected
Futures/Spot/Fast Trader/Supervisor/Wallet/UI/migration/scheduler source bytes
match the previous runtime. The independent AST audit compared 216 original
Prediction declarations: only settlement status/opt-in helper options, resolver
and test exports differ; all math/classification/templates/H1-H8/AI/risk/Kelly/
sizing/entry/Real/learning declarations remain unchanged. The Demo settlement
body is byte-identical. No live multi-user Demo settlement was exercised because
there were no autonomous trades; its existing synthetic regression passed.

All 13 existing job gate names/content hashes and the shared jobs runner hash
are unchanged. No new trading gate, scheduler or prediction-enter-cron was
installed. Prediction's existing gates remain discovery, shadow-entry and
resolve only. Other modules' existing gates were preserved.

## Safety statuses / observed errors

- Prediction ENTRY: OFF; entry gate absent, no enter runner reference added,
  autonomous trade table remains empty before and after release.
- Prediction REAL: OFF; real trade count 0, unchanged disabled execution/501
  behavior in approved source and offline regression. No wallet signing/order/
  funds operation was issued by this task or exists in the collector path.
  Independent account/on-chain funds auditing was not performed and is not claimed.
- Prediction AUTONOMOUS-LEARN: OFF; no learn runner reference, zero learn runs
  since approval, calibration snapshot count remains 0.
- No forced trades/opportunities, relaxed gates, strategy/AI weight updates,
  paid-AI policy changes or A-mode timeout changes.
- Two observed natural resolve runs: no errors, LOOKUP_FAILED, conflicts or
  deadline hits; six NOT_YET_RESOLVED results are normal retry states. Two
  terminal cancellations are coverage exclusions, not scored binary forecasts.
- A local report reader initially assumed one-line JSON; PostgreSQL json_agg
  returned multiline JSON. The reader was corrected and raw read-only receipts
  re-parsed/verified. This was a local audit parsing failure, not a resolver/DB
  failure or production repair. Failed parsing attempts are not counted as PASS.

## Rollback state

Rollback occurred: **NO**. Activation/health/exact-identity checks passed.
Existing coordinator's previous main/admin pointers now both identify
b211db170dc3e35fd2965cdb74e496df5998d19a, the actual pre-release runtime, and
that release is retained. New exact target remains active. No database rollback
or authorization-store cleanup was attempted. Future operational rollback must
use the existing controlled procedure and preserve collected data.

## Tests / build / files / publication

No source implementation was edited in this release task. The same approved
SHA passed PR CI and its required main-push CI, including new collector tests,
Prediction regressions, web/API build and existing full CI. Previous local
evidence: 27 collector cases, 26 safe Prediction files / 142 node-runner entries,
build and API bundle PASS; production-writing legacy position-credit test was
excluded. Verification did not rerun tests against the production DB.

Read: approved implementation contract/report, release workflows/helpers,
installed authorization/receiver/coordinator, current source/PR/CI/artifact,
production runtime/gate/hash/DB aggregate receipts and bounded CLOB responses.
Created: this report and temporary audit scripts/receipts under
tmp/prediction-v2-controlled-release-20261001/; added a relevant dated local
HANDOFF entry. Unrelated files/reports are preserved. No new application commit
is substituted for the target. Final documentation is outside the released SHA.

This complete reviewed report is published to
signal0verse/SignalVerse-AI-Log/master under this reports/prediction/ path. Remote
bytes and returned blob/commit are verified separately before reporting success;
publication failures must be stated and the local report retained.

## Remaining validation gaps / next milestone

**Phase 9A statistical validation is NOT complete.** No profitability, calibration,
model/AI/B/C superiority or fee-adjusted edge claim is made. The implementation
has begun bounded actual-outcome coverage, not established forecast quality.
Historical binary receipts with uncertified chronology cannot be scored.

Current observed collector cohort is only 15 selections with zero certified
temporal scores. Full wrap/retries/revisits, live transient lookup failures,
unmapped/invalid binary outcomes and concurrent-conflict/crash recovery,
prospective open-to-resolved brackets and
longer runtime health remain unobserved or insufficient in this short window.
Work caps do not bound PostgreSQL physical heap pages; plan/load growth and
summary durability remain operational limitations from the implementation contract.

Unchanged required minima and analyses: >=28 days, >=300 distinct resolved
markets, >=100 per applicable allowed trading type, >=30 resolved would-open
markets, paired Brier/log-loss and registered bootstrap criteria, ECE <=0.03
with required equal-count bins/uncertainty, fee-adjusted edge, H1/H5 constraints,
stability, type/category and abstention analysis. No criterion was weakened.

Next milestone: accumulate prospective temporally certified distinct outcomes
under existing Entry/Real/learn-OFF scheduling and implement the separate
read-only pre-registered cohort reporter. No automatic activation, scheduler
change or additional release is authorized by this successful deployment.
