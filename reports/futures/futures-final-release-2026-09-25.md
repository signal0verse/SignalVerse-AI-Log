# Futures final release — clean exact-SHA preflight

## Current result / metadata

- Date: 2026-09-25; evidence window 14:12:35Z–14:16:54Z.
- Task: owner-approved CLEAN ISOLATED CHECKOUT / READ-ONLY RELEASE PREFLIGHT.
- Final status: **FUTURES-RELEASE-PREFLIGHT-BLOCKED**.
- The earlier documentation-HEAD mismatch is RESOLVED by a separate exact checkout, not by substituting the documentation commit.
- No deployment was authorized or attempted in this preflight.
- A historical report from the previous attempt is preserved verbatim below; this dated section is the current result.

```text
APPROVED_SHA        = b03adbc5bf26a698f3dca91a4be5bb2c5e15514f
ACTUAL_CHECKOUT_SHA = b03adbc5bf26a698f3dca91a4be5bb2c5e15514f
MAIN_SHA            = b3195f788e14e393464e93aa9545cc7614a1caaf
LOCAL_MAIN_REF      = 85aedfb944a67c94227ac343e911bc64a581e79e
PRODUCTION_SHA      = b3195f788e14e393464e93aa9545cc7614a1caaf
CI_STATUS           = BLOCKED: zero Production CI runs for the approved SHA
RELEASE_STATUS      = BLOCKED: target not on main, no qualifying CI, no target Guard approval
VPS_STATUS          = BLOCKED for this target; existing app/admin/observer/receiver are active
BLOCKER             = main/candidate divergence; exact-SHA promotion cannot fast-forward
NEXT_EXACT_STEP     = owner decision on a newly identified main-based candidate; no automatic substitution
CODE_CHANGED        = NO
PRODUCTION_CHANGED  = NO
VPS_CHANGED         = NO
ORDERS              = NO
POSITIONS_CHANGED   = NO
DATABASE_CHANGED    = NO
```

The NO statements describe actions by this task. They are not a private-account/DB audit of concurrent autonomous or owner activity.

## Objective / authorized scope

Create an isolated checkout of exactly the owner-approved executable, confirm prior acceptance, read current main/CI/Production/release controls, and report the remaining route. No application/Strategy/Engine/Risk/Supervisor/accounting/Spot/MLM change, main push, release dispatch, Guard admission, migration, service action or trade is authorized here.

## 1. Exact isolated candidate — READY

A new managed detached worktree named futures-release-b03-20260925 was created at the requested commit. No pre-existing branch or checkout was switched/reset/cleaned, and no untracked work was removed. The primary concurrent work and the earlier Futures documentation checkout were not edited.

Observed at 14:12:35Z and again 14:16:07Z/14:16:54Z, before writing this explicitly requested documentation:

```text
git rev-parse HEAD
b03adbc5bf26a698f3dca91a4be5bb2c5e15514f

git rev-parse HEAD^{tree}
2ad5f2484b873d27d5a819808efcf7298b18c2c3

git status --porcelain=v1 --untracked-files=all
<empty>

git diff --quiet b03adbc5bf26a698f3dca91a4be5bb2c5e15514f HEAD
exit 0
git diff --quiet
exit 0
git diff --cached --quiet
exit 0
```

e9edb886f24fe693243ac9e8776ca87820bf9fd5 is NOT the release identity. Its entire committed difference from b03 consists of HANDOFF.md, the safe testing runbook, the accounting report and the completion report. There is no executable difference. The report/handoff written after preflight are documentation only, left uncommitted, and are not part of the approved Git tree/archive.

## 2. Existing acceptance evidence — READY as prior local evidence only

Inspected the final accounting report at documentation commit e9edb886f24fe693243ac9e8776ca87820bf9fd5 and confirmed the executable tree it describes matches b03.

| Required evidence | Prior recorded result / boundary |
| --- | --- |
| Offline Futures allowlist | 1207/1207 PASS in 23 files; not rerun here |
| Temporary PostgreSQL | 6/6 PASS; no Production schema assertion |
| Web / admin builds | Both PASS |
| API bundles | 14/14 PASS |
| Shared Decision Engine / Real-Demo-Simulator parity | Common computeCanonicalFuturesDecision; 120 whole-decision parity cases in the prior suite |
| Binance / MEXC native Futures data | Prior native/provenance suites retained |
| Gate NEW input and existing-position observer | Native market-data provider; 111 observer regression tests retained |
| Unified fee/funding accounting | Shared economics contract/normalizers; 179 accounting cases retained |

Source spot checks at the exact candidate: api/_shared/futures-decision-engine.ts:338; api/analyze.ts:2; api/copytrade.ts:1–7,7899,11664; api/_shared/gate-futures-observer.ts:1,9,26. These connect the common decision/market-data/observer/accounting modules. This is identity/linkage confirmation, not a new economic audit or live execution test.

Prior Node runtime was local 24.19.0. These results do not replace the missing exact-SHA main-push CI. No tests/builds, strategy retuning or exchange simulations were run in this preflight. Profitability remains **NOT PROVEN**.

## 3. Current main — BLOCKED for exact-SHA promotion

Read-only remote acquisition used git fetch --no-tags origin main; main was verified independently with git ls-remote twice, most recently at 14:16:54Z. Fetch updates local remote-tracking metadata only; no remote ref or local main pointer was written.

```text
git rev-parse main
85aedfb944a67c94227ac343e911bc64a581e79e

git rev-parse origin/main
b3195f788e14e393464e93aa9545cc7614a1caaf

git merge-base origin/main b03adbc5bf26a698f3dca91a4be5bb2c5e15514f
1cbd0f7572905588d9335ffd426685693ee5df58

git rev-list --left-right --count origin/main...b03adbc5bf26a698f3dca91a4be5bb2c5e15514f
1  10

git merge-base --is-ancestor b03adbc5bf26a698f3dca91a4be5bb2c5e15514f origin/main
exit 1

git merge-base --is-ancestor origin/main b03adbc5bf26a698f3dca91a4be5bb2c5e15514f
exit 1
```

The one main-only commit is b3195f7, feat(spot): bidirectional Parity Inventory Rebalance (Demo) (#160), touching five files: api/stablecoin-engine.ts, docs/AI_HANDOFF.md, migrations/stablecoin_parity_rebalance.sql, scripts/stablecoin-engine-test.mjs, src/app/App.tsx. The approved candidate has ten commits after the shared base and does not contain that main-only change.

Consequences:

- Main is NOT simply behind b03. Moving its tip to b03 would be non-fast-forward and discard the main-only lineage.
- Merging the two histories would produce a NEW SHA, not b03.
- A merge could make b03 reachable, but CI on the merge SHA would still not satisfy the workflow's successful main-push CI requirement for b03 itself.
- No force-push, merge, rebase, cherry-pick, local-main update or candidate substitution was performed.
- This is not evidence of an unauthorized concurrent change. The task does not investigate or relabel the owner's separate Spot work.

## 4. Current CI and release workflow

GitHub read-only Actions queries:

- Approved b03: Production CI total_count=0, runs=[].
- Current main b319: successful main/push CI [36123967741](https://github.com/signal0verse/signalverse-main/actions/runs/36123967741).
- Manual release workflow ID 366395695 is active.
- Existing successful manual main release run [36137427817](https://github.com/signal0verse/signalverse-main/actions/runs/36137427817), created 2026-09-25T12:52:01Z, has workflow head b319. Two earlier manual runs failed; none were started by this task.
- Current Environment has only branch_policy, sole allowed branch main. No required-reviewer rule is present. It must not be described as reviewer-protected.

Both exact-candidate and freshly fetched main have identical reviewed workflow blobs:

```text
production-release.yml = ac63f98be6e5dd24a239ddbab25b769645ad52d4
production-ci.yml      = 66c3d1c93366183be6786ab1ee355f54de16ee53
```

The current route is build/test-only Production CI on main push, then a separate manual production-release.yml workflow with a full 40-character sha input. The release job requires main ref, successful Production CI push on main for that exact target SHA, exact checkout, target ancestry on origin/main, exact Git archive, Production Environment and OIDC delivery to the installed Guard. The Guard separately requires an operator-issued exact-SHA/archive-digest approval.

Thus the workflow DOES accept an exact SHA, but b03 currently fails its prerequisites. No workflow dispatch or GitHub setting change was made.

## 5. Current Production / VPS — independently observed

Read-only SSH sampled the VPS at 14:13:43Z, 14:14:32Z, 14:15:08Z, 14:16:16Z and 14:16:46Z.

- Deployed marker: b3195f788e14e393464e93aa9545cc7614a1caaf.
- App symlink: /opt/signalverse/releases/b3195f788e14e393464e93aa9545cc7614a1caaf.
- Admin symlink: /opt/signalverse-admin/releases/b3195f788e14e393464e93aa9545cc7614a1caaf.
- Independently read main process cwd matches the app release; admin/observer cwd matches the admin release.
- Marker inode/mtime/size before and after: 608945:1790340817:41.
- Approved b03 is NOT deployed.

| Service | PID before / after | Start UTC | State / NRestarts |
| --- | --- | --- | --- |
| signalverse.service | 2177526 / 2177526 | 2026-09-25 12:53:35 | active/running; 0 / 0 |
| signalverse-admin.service | 2177522 / 2177522 | 2026-09-25 12:53:35 | active/running; 0 / 0 |
| signalverse-observer.service | 2177519 / 2177519 | 2026-09-25 12:53:35 | active/running; 0 / 0 |
| signalverse-deploy-receiver.service | 2166041 / 2166041 | 2026-09-25 10:48:00 | active/running; 0 / 0 |

The receiver is now enabled and listening at 127.0.0.1:3002. Older reports saying inactive/disabled are historical and were NOT reused as current facts. No readiness/401/valid release request was sent.

Installed hashes still match the previously approved package:

| Component | SHA-256 |
| --- | --- |
| Receiver | c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa |
| Authorization helper | acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83 |
| Coordinator | 572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec |
| Receiver unit | 7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1 |

The helper reads approvals/<sha>.json; the exact b03 manifest is ABSENT at 14:16:46Z. The approvals directory is root:root 0700. No approval content, exchange secret or private key text was read. Existing SSH authentication was used without exposing its key.

The coordinator source retains the global deploy lock and final consume gate. No coordinator/helper was executed. No active/queued deploy artifact was observed. The sole failed artifact unit is historical: eee238... started 2026-09-08T22:21:28Z and exited 22:24:39Z, not a failure of this preflight. One unrelated recurring collector job appeared in list-jobs and was not touched.

Service activity and listener availability do NOT establish full application/API/Futures health or private-account correctness. Those post-deploy checks were not run, and no trading/sync endpoint was invoked.

## 6. Additional prerequisite — accounting migration

The approved candidate includes migrations/futures_economics_contract.sql: an additive nullable copy_trades.economics JSONB column and version/currency/object constraint, without backfill. The prior report requires it before activating code that writes the column.

Production schema was NOT queried, so current column/constraint presence is UNKNOWN, not assumed absent or complete. No DB connection/write/migration occurred. The reviewed release workflow has no automatic step applying this migration. Any future authorized release needs explicit schema verification and an approved migration procedure if missing.

## 7. Exact remaining release sequence

Statuses are for releasing the exact approved candidate, not general server health.

| Stage | Status | Exact reason / remaining gate |
| --- | --- | --- |
| APPROVED SHA | READY | Exact detached checkout and Git tree verified; prior local acceptance linked |
| MAIN | BLOCKED | 1 main-only vs 10 candidate-only commits; neither ancestor; no permitted fast-forward to b03 |
| CI | BLOCKED | Zero CI runs for b03; current-main CI cannot be substituted |
| RELEASE | BLOCKED | Workflow target ancestry/CI requirements unmet; exact target Guard approval absent |
| VPS | BLOCKED | Existing host/receiver active, but no authorized eligible candidate admission; DB prerequisite unverified |
| POST-DEPLOY VERIFY | BLOCKED | No deployment performed; cannot verify candidate runtime/endpoints/accounting |

There is no permitted exact-b03 -> current-main -> qualifying-CI route under the current no-history-rewrite/no-control-change rules. The next action is an owner decision, NOT starting/replacing Guard, dispatching CI as a substitute for push CI, or attempting deployment.

Recommended decision: authorize a separately reviewed main-based Futures candidate preserving the current Spot changes and both histories. It necessarily gets a NEW SHA and must receive fresh acceptance/release approval. Until then, b03 remains the approved identity and is not replaced by e9ed, current main or a newly invented SHA.

## 8. Files inspected / changes / validation

Inspected owner attachment; AGENTS.md/CLAUDE.md; latest handoff/current AI handoff; prior accounting and control-plane/Stage1B release reports; exact candidate Git status/tree/diffs; current workflow YAML; migration source and selected Engine/observer/accounting linkage; live marker/symlinks/process metadata; installed Guard hashes and relevant authorization/coordinator source lines; GitHub read-only CI/workflow/Environment APIs.

Local state changes: one isolated detached worktree and local fetch metadata; only the requested report plus a HANDOFF note are written afterward in that NEW worktree. No old worktree or application code was edited. No application commit/push; no history rewrite. Reports-only AI-Log publication is separate from application main.

No application tests/builds rerun; prior evidence was inspected as required. Exact Git identity/diff and read-only runtime checks completed. Documentation is whitespace/secret-scanned and reviewed before publication.

Diagnostic limitations transparently recorded: sandbox inspection could not read the SSH-key path; approved SSH subsequently worked without exposing key content. Two multiline SSH read commands had PowerShell/CRLF trailer errors after their earlier read output; corrected single-line read-only commands supplied the final evidence. An interpolated exit-label was discarded and replaced by an explicit TARGET_APPROVAL=ABSENT check. These were local command-format issues, not receiver/service failures. No repair or remote file creation occurred.

The report is published only to SignalVerse-AI-Log/master after secret review. Remote commit and file/blob identity are verified separately and returned in the final response.

**FINAL STATUS: FUTURES-RELEASE-PREFLIGHT-BLOCKED**

---

# Historical report — previous attempt before clean-checkout authorization

The following snapshot is preserved verbatim. Its earlier mismatch status is historical, not the result of the successful exact checkout above.

# Futures final release — stopped at exact-candidate gate

## Metadata

- Date: 2026-09-25.
- Task: FINAL RELEASE AND VPS DEPLOYMENT.
- Mode: local read-only Git preflight; documentation/publication only after the mandatory stop.
- Evidence checkpoints: 2026-09-25T13:50:26.6276830Z and 2026-09-25T13:50:49.6923300Z.
- Application repository: signal0verse/signalverse-main.
- Dedicated candidate branch: codex/futures-completion-20260925.
- Requested executable commit: b03adbc5bf26a698f3dca91a4be5bb2c5e15514f.
- Observed dedicated-worktree HEAD: e9edb886f24fe693243ac9e8776ca87820bf9fd5.
- Starting and ending application commit: e9edb886f24fe693243ac9e8776ca87820bf9fd5; no application commit/checkout/reset was performed.
- Final status: **FUTURES-CANDIDATE-MISMATCH**.

## Objective

Release exactly the owner-pinned candidate through the existing approved path, subject to the explicit first gate: HEAD must equal the requested commit; otherwise STOP without substituting another commit.

## Scope / safety decision

The exact-HEAD gate did not pass. Release work stopped before scope promotion, main synchronization/push, CI, or VPS deployment. Executable-tree equivalence is NOT a waiver of the owner's exact commit identity requirement.

No new worktree or detached checkout was created to bypass this stop. Only this requested report and the dedicated candidate's HANDOFF.md were changed. No application source or branch pointer was modified.

## Actions taken / exact Git evidence

The primary checkout was inspected first. It belongs to concurrent, unrelated work:

- Branch: feat/parity-inventory-rebalance.
- HEAD: 0e891e389bfab17f312f78d524fd17e5a274ec25.
- Untracked work was present and preserved.
- No pull, checkout, staging, cleanup or edit was performed there.

The existing dedicated Futures checkout was then inspected:

```text
git branch --show-current
codex/futures-completion-20260925

git rev-parse HEAD
e9edb886f24fe693243ac9e8776ca87820bf9fd5

git status --porcelain=v1
?? tmp/

git log --format='%H %s' b03adbc5bf26a698f3dca91a4be5bb2c5e15514f..HEAD
e9edb886f24fe693243ac9e8776ca87820bf9fd5 Document Futures accounting unification validation [skip ci]

git diff --name-only b03adbc5bf26a698f3dca91a4be5bb2c5e15514f HEAD
HANDOFF.md
docs/testing/stability-test-runbook.md
reports/futures/futures-accounting-unification-2026-09-25.md
reports/futures/futures-completion-audit-2026-09-25.md

git diff --quiet b03adbc5bf26a698f3dca91a4be5bb2c5e15514f HEAD -- api src migrations scripts
exit 0
```

The requested commit exists. Its own commit diff is:

```text
b03adbc5bf26a698f3dca91a4be5bb2c5e15514f Reject incomplete native Futures fee coverage
api/copytrade.ts                            |  9 ++++++---
scripts/futures-economics-contract-test.mjs | 17 ++++++++++++++---
2 files changed, 20 insertions(+), 6 deletions(-)
```

This is the final incremental commit, not the whole cumulative Futures release scope. The cumulative release scope was not promoted/approved in this task because Phase 1 stopped execution.

## Root cause / findings

CONFIRMED: the dedicated branch is one documentation-only commit after the requested executable candidate. This is a commit-identity mismatch, not evidence of an executable regression, an unauthorized application deployment, or a failed CI run.

CONFIRMED: all differences between the requested candidate and observed committed HEAD are the four documentation paths listed above. The candidate executable paths have no differences.

UNCONFIRMED: current remote main, current Production SHA, runtime health and release mechanism readiness. No live or remote application inspection was performed after the stop. Older runtime SHAs are not presented as fresh evidence.

## Prior test/build evidence — inspected, NOT rerun

Source: reports/futures/futures-accounting-unification-2026-09-25.md at documentation commit e9edb886f24fe693243ac9e8776ca87820bf9fd5.

Its previously published immutable report is:
[Accounting validation report](https://github.com/signal0verse/SignalVerse-AI-Log/blob/a5ae5ee02877086256face19dda0540d27b7d2cd/reports/futures/futures-accounting-unification-2026-09-25.md).

| Check | Prior recorded result | This release attempt |
| --- | --- | --- |
| Explicit offline Node allowlist | 1207/1207 PASS; zero fail/skip/cancel | Report inspected; not rerun |
| Isolated PostgreSQL checks | 6/6 PASS on temporary PostgreSQL 18.6 | Report inspected; no DB connection |
| Web build | PASS | Not rerun |
| Admin build | PASS | Not rerun |
| Top-level API bundles | 14/14 PASS | Not rerun |
| CI on exact SHA / main ref | Not established by local tests | Not run or queried |

The prior test runtime was local Node 24.19.0, not proof of Production CI Node 22. Earlier typecheck results were zero newly introduced diagnostics, not a globally clean legacy typecheck.

## Release record

| Required field | Evidence / outcome |
| --- | --- |
| Final code SHA requested | b03adbc5bf26a698f3dca91a4be5bb2c5e15514f |
| Actual dedicated HEAD | e9edb886f24fe693243ac9e8776ca87820bf9fd5 |
| Previous Production SHA | NOT VERIFIED in this attempt; no VPS access |
| Main SHA before release | NOT CHECKED; Phase 3 was not reached |
| Main SHA after release | NOT CHECKED; no main write by this task |
| CI run ID | NONE initiated; existing runs not queried |
| CI result | NOT RUN |
| Deployment method | NOT INVOKED; existing controls neither tested nor changed |
| Deployed SHA | NONE deployed by this task; current live SHA not verified |
| Deployment timestamp | NOT APPLICABLE |
| Application health | NOT CHECKED |
| API health | NOT CHECKED |
| Futures health / engine load | NOT CHECKED |
| Binance / MEXC / Gate runtime checks | NOT CHECKED |
| Native Gate existing-position observer | No runtime verification or invocation |
| Accounting module load | NOT CHECKED in Production |
| Open-position impact | Zero position actions by this task |
| Order impact | Zero placed/cancelled/modified orders by this task |
| Database impact | Zero connections, reads, writes or migrations by this task |
| Exchange-write impact | Zero exchange calls by this task |
| Final status | FUTURES-CANDIDATE-MISMATCH |

No application restart, deploy artifact activation, Guard invocation, workflow dispatch, leverage/protection change or manual lifecycle action occurred. No claim is made that normal concurrent Production activity stopped or that account state was independently inspected.

## Files inspected

- Owner's FINAL RELEASE AND VPS DEPLOYMENT attachment.
- AGENTS.md and CLAUDE.md.
- Latest HANDOFF.md entries and docs/AI_HANDOFF.md.
- reports/futures/futures-accounting-unification-2026-09-25.md.
- Git status, branch, commit metadata and diff/path inventories in the primary and dedicated checkouts.
- AI-Log README.md, templates/report-template.md and scripts/scan-secrets.mjs.

## Files changed / implementation

Only documentation:

- reports/futures/futures-final-release-2026-09-25.md (new).
- HANDOFF.md (new dated entry in the dedicated Futures checkout).
- Identical sanitized report in the reports-only SignalVerse-AI-Log repository.

No executable implementation change. No strategy, indicator, SMC, Supervisor, SL/TP, protection, accounting, Spot, Demo, workflow or security change.

## Tests executed / build result

No application tests/builds were rerun after the stop. Local Git identity and executable diff checks were executed as listed above. Documentation is checked for whitespace errors and secret patterns before its separate reports-only publication.

## Git status / commit / publication

The dedicated application's HEAD remains e9edb886f24fe693243ac9e8776ca87820bf9fd5. This report and the new HANDOFF entry are deliberately left uncommitted; pre-existing untracked tmp/ remains untouched. No app branch/main push, merge, reset or checkout occurred.

AI-Log/master is the only remote publication target. Its clean checkout was synchronized with git pull --ff-only (Already up to date). The sanitized report is committed/pushed separately and its actual remote commit/file identity is verified before a publication success claim in the final response. No application CI is triggered by this reports-only publication.

## Remaining issues / limitations

1. The exact checked-out HEAD gate is unresolved. A documentation descendant is not substituted for the approved candidate.
2. Main ancestry/scope, exact-SHA CI, approved deployment readiness and all post-deployment checks remain unexecuted.
3. The prior accounting report requires the additive nullable economics migration before activating code that writes it. No Production migration was performed or assumed complete. Its approved release handling remains a separate prerequisite.
4. Private-account lifecycle, native protection/accounting gates and profitability were not established by these local results.
5. Profitability: **NOT PROVEN**. No new strategy validation or historical result reinterpretation occurred.

## Recommended next step

Owner confirmation to resume from a clean isolated checkout pinned to exactly b03adbc5bf26a698f3dca91a4be5bb2c5e15514f, preserving the current documentation branch and unrelated work. This would resume the remaining gates, not waive them or authorize a different SHA, history rewrite, security bypass, order, or unapproved DB action.

**FINAL STATUS: FUTURES-CANDIDATE-MISMATCH**
