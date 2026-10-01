# Phase 5M-A — official prepare-only artifact created and independently verified

## Metadata

- Date: 2026-10-02, Asia/Kuala_Lumpur; evidence below uses 2026-10-01 UTC.
- Task ID: Phase 5M-A, directly owner-authorized prepare-only continuation.
- Module: Futures Profit Protection release artifact verification, not deployment.
- Mode: existing official prepare-only workflow plus read-only provenance/byte verification and safety checks.
- Application repository: signal0verse/signalverse-main.
- Audited branch: codex/futures-pp-worker-symlink-20261002-main-current-v2.
- Starting / ending source commit: 66f3ac2e89d1c40543851c6a9b1f46318d6f6a12.
- Output repository: SignalVerse-AI-Log/master, report-only publication under AGENTS.md; no application source commit or push.

## Objective / Scope

The owner directly authorized the existing official prepare-only artifact workflow for the exact target, explicitly excluding Guard creation, release and deployment. Create the artifact only through that workflow, independently verify retained bytes/provenance/digest/embedded Git identity, then stop. No Worker/PP activation, account/order/position/SL/TP/close action, application modification, database mutation, alternative packaging or release route.

## Executive result

```text
AUTHORIZED_PREPARE_ONLY_RESULT=PASS
OFFICIAL_ARTIFACT_VERIFICATION=PASS
GUARD_CREATED=NO
GUARD_CLAIMED=NO
GUARD_CONSUMED=NO
RELEASE_DISPATCHED=NO
DEPLOYMENT=NO
```

The directly authorized prepare-only scope is complete. The previous permission-review blocker was resolved by the owner's new direct conversation authorization. Exactly one official preparation workflow was dispatched; it succeeded and retained one immutable artifact. The downloaded outer ZIP digest matches the GitHub API; the independently computed inner release.tar.gz digest matches retained metadata; native Git embedded identity equals the exact target. No archive was rebuilt/repackaged locally.

The broader Phase 5M-A classification must NOT say Guard ready: the latest owner instruction expressly prohibits Guard creation. Artifact verification is PASS; Guard preparation/verification remains intentionally outside this authorization. Thus the broader artifact-plus-Guard gate remains:

```text
FINAL_CLASSIFICATION=PHASE 5M-A BLOCKED — ARTIFACT OR GUARD PREREQUISITE NOT VERIFIED
REMAINING_PREREQUISITE=SEPARATELY AUTHORIZED INDEPENDENT EXACT-SHA/INNER-DIGEST GUARD
```

This remaining gate is not an artifact failure. No automatic continuation into Guard or release follows.

## Actions Taken

1. Check root git status; preserve existing dirty HANDOFF, private/untracked files and earlier reports. Use the already-clean isolated exact-target checkout; no pull/checkout/stash/reset/clean/stage/source commit/source push.
2. Recheck remote main, candidate HEAD, exact parent and clean status. Recheck existing exact main/push Production CI run 36919580840 and every job/step conclusion. Query existing exact-head preparation runs: none before dispatch.
3. Collect bounded read-only Production/OFF/Worker snapshot and compare selected runtime/service/configuration fields with the preceding Phase 5M snapshot: identical.
4. Recheck current main/CI immediately before dispatch. Dispatch only production-release-artifact.yml with ref=main and sha=exact target through the existing official GitHub CLI route.
5. Read run/jobs and artifact APIs. Require successful official workflow_dispatch on exact main/tooling SHA; one successful prepare job, ten actually present steps successful, no failed/skipped step; one selected unexpired artifact.
6. Call the reviewed verifySource function against independently fetched run/artifact API records. Download the retained GitHub ZIP directly; compute its complete SHA-256 and size before saving; require exact API digest/size equality. Do not generate a local source archive.
7. Inspect ZIP member inventory before extraction: exactly metadata.json and release.tar.gz, no extra paths and bounded sizes. Extract only the verified retained ZIP into a new local output directory; refuse existing output/overwrite.
8. Independently hash inner bytes with PowerShell Get-FileHash, then call reviewed verifySource/verifyBundle/embeddedCommit/digest functions with independently fixed expected identities. Confirm regular non-symlink files, exact two-file bundle, metadata contract/size/run/attempt/tooling/repository/digest and native Git embedded commit. Do not invoke packageCommit or the package CLI locally.
9. Recheck Production snapshot and final main/clean candidate. Independent before/after comparison of selected marker/link/process/service/configuration/hash fields is identical. Stop before Guard/release.
10. Create/sanitize this report and publish only the report to the separate AI-Log repository, verifying remote bytes and report-only commit scope. Never commit/downloaded artifacts into Git.

## Files / Source Inspected

- Owner's direct prepare-only authorization and complete Phase 5M-A specification.
- Existing repository instructions/current handoffs/safe runbook and the preceding Phase 5M-A report remain applicable; no strategy/financial policy change.
- Exact candidate .github/workflows/production-release-artifact.yml, .github/workflows/production-release.yml and scripts/release-artifact.mjs, fully inspected in the preceding phase and unchanged in the pinned clean checkout.
- Fresh GitHub run/jobs/artifact records; retained metadata.json and release.tar.gz bytes, not executed application source.
- Read-only installed marker/link/process/service metadata, Worker unit/drop-in/environment hashes and requested Worker flag only; no credential contents disclosed.
- Selected aggregate PP database controls/counts and journal evidence; no private account/trade-row contents published.

## Files Changed / Implementation

No application source, strategy, policy, tests, workflow, Guard/receiver/helper/coordinator, installed file, service, database, exchange integration or scheduler changed. Only this report was created, plus downloaded artifact outputs outside the audited checkout under:

```text
tmp/phase5ma-artifact-36924691521-20261002/github-artifact.zip
tmp/phase5ma-artifact-36924691521-20261002/bundle/metadata.json
tmp/phase5ma-artifact-36924691521-20261002/bundle/release.tar.gz
```

These outputs are downloaded retained bytes, not a new local package, not manually uploaded artifacts and not source commits. They are not published to AI-Log.

## Evidence timestamps

| Evidence | UTC |
| --- | --- |
| Exact main/parent/clean target/CI checks complete | 2026-10-01T20:51:17.969Z |
| Before Production snapshot | 2026-10-01T20:51:30.614005941Z to 20:51:31.661387204Z |
| Before READ ONLY DB result | 2026-10-01T20:51:31.552327Z |
| Official prepare-only dispatch | 2026-10-01T20:51:54.612Z |
| Preparation created | 2026-10-01T20:51:57Z |
| Retained artifact created | 2026-10-01T20:52:13Z |
| Successful preparation run updated/completed record | 2026-10-01T20:52:16Z |
| Retained ZIP independent download/hash verified | 2026-10-01T20:53:18.257Z |
| Independent inner/provenance/embedded verification complete | 2026-10-01T20:54:03.555Z |
| After Production snapshot | 2026-10-01T20:54:46.100102180Z to 20:54:47.279582278Z |
| After READ ONLY DB result | 2026-10-01T20:54:47.129586Z |

## Exact Git / existing CI

```text
MAIN_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
TARGET_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
PARENT_SHA=da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f
AUDITED_CANDIDATE_HEAD=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
AUDITED_CANDIDATE_STATUS=CLEAN BEFORE/AFTER
CI_RUN=36919580840
CI_WORKFLOW=Production CI
CI_HEAD_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
CI_HEAD_BRANCH=main
CI_EVENT=push
CI_CONCLUSION=success
CI_JOBS=1/1 SUCCESS
CI_STEPS=38/38 SUCCESS
CI_FAILED=0
CI_SKIPPED=0
NORMAL_CI_DISPATCH=NO
```

[Existing successful exact-SHA Production CI](https://github.com/signal0verse/signalverse-main/actions/runs/36919580840). Final git ls-remote and HEAD still equal the target, and candidate status is empty. Existing global-ignore permission warnings did not change Git state or prevent successful identity/status checks.

## Official prepare-only run / immutable artifact identity

```text
PREPARATION_RUN_ID=36924691521
PREPARATION_WORKFLOW=Production Release Artifact (prepare only)
PREPARATION_PATH=.github/workflows/production-release-artifact.yml
PREPARATION_EVENT=workflow_dispatch
PREPARATION_HEAD_BRANCH=main
PREPARATION_HEAD_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
PREPARATION_ATTEMPT=1
PREPARATION_STATUS=completed
PREPARATION_CONCLUSION=success
PREPARATION_JOB_ID=110579006173
PREPARATION_JOBS=1/1 SUCCESS
PREPARATION_ACTUAL_STEPS=10/10 SUCCESS
PREPARATION_FAILED=0
PREPARATION_SKIPPED=0
ARTIFACT_ID=11193805318
ARTIFACT_NAME=production-release-66f3ac2e89d1c40543851c6a9b1f46318d6f6a12-36924691521-1
ARTIFACT_EXPIRED=false
ARTIFACT_EXPIRES_AT=2026-10-31T20:52:12Z
```

[Official successful prepare-only run](https://github.com/signal0verse/signalverse-main/actions/runs/36924691521).

Actual successful steps: setup job; checkout reviewed tooling; setup Node22; validate exact target and successful CI; create exactly one LF-preserving archive and record digest; retain exact bytes; record independent approval coordinates (NOT an approval); post Node setup; post checkout; complete job. The Actions step-number labels are not the count of actual steps: ten returned steps were verified, not an invented fifteen-step total.

The workflow has read-only contents/actions permissions and no Production environment, OIDC request, receiver delivery or activation step. Packaging occurs only in its GitHub/Linux runner; its existing package contract is git-archive-lf-v1, Git2.55.0, reviewed command-scoped EOL/backend/tar mode settings. The uploader retains exact release.tar.gz and metadata.json bytes with overwrite=false, compression-level=0 and thirty-day retention.

## Independent byte / semantic / provenance verification

| Layer | Independent actual verification | Result |
| --- | --- | --- |
| Official source run | Installed reviewed verifySource against fresh run and artifact API responses; repo, workflow path/event/main, completed/success, run/attempt, artifact name/run/tooling SHA | PASS |
| Exact tooling/application identity | Run head SHA, metadata workflowSha, requested target and embedded archive SHA all equal exact target | PASS |
| Retained outer ZIP | Download raw retained bytes; compute complete SHA-256/size; exact match to GitHub artifact API digest/size | PASS |
| ZIP member inventory | Exactly release.tar.gz and metadata.json, bounded positive member sizes; no unexpected paths | PASS |
| Inner archive byte digest | Independently compute PowerShell SHA-256, then reviewed digest/verifyBundle; exact metadata match | PASS |
| Embedded Git commit | Native git get-tar-commit-id via reviewed embeddedCommit, no local archive creation | PASS |
| Metadata contract | version1, contract, repo, target, byte size, inner digest, run36924691521/attempt1 and exact workflowSha | PASS |
| Availability | API expired=false; expiry future at verification time | PASS |
| No repackaging | Download/extract/verify only; no local git archive/tar/gzip creation or manual upload | PASS |

```text
OUTER_GITHUB_ZIP_BYTES=4561804
OUTER_GITHUB_ZIP_SHA256=5ea0cd6e6fa88bbeff915e2efee2e03950edc880dd57f5e6e49224a58f3c26f5
API_OUTER_DIGEST=sha256:5ea0cd6e6fa88bbeff915e2efee2e03950edc880dd57f5e6e49224a58f3c26f5
INNER_RELEASE_BYTES=4560859
INNER_RELEASE_SHA256=ca52962df2d7e93e2f782f0cee23b2516f6c305cfcbb1e358e973df03bee44dd
METADATA_BYTES=685
EMBEDDED_APPLICATION_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
ARTIFACT_CONTRACT=git-archive-lf-v1
ARTIFACT_VERIFICATION=PASS
```

IMPORTANT: the eventual Guard must bind the INNER release.tar.gz digest, not the outer GitHub ZIP digest. No Guard has been issued or validated in this task. A later official release must download/use this retained artifact identity and verify the same bytes; do not rebuild them.

## Production / Worker / PP / zero-action evidence

Before and after marker, app/admin links, process cwd, service PIDs/restart counts/start times, selected Worker configuration and installed file hashes independently match. Programmatic stable-region comparison is identical; no service start/restart/enable or activation occurred.

| Service | Before = after state | PID | NRestarts |
| --- | --- | --- | --- |
| signalverse.service | active/running | 3051115 | 0 |
| signalverse-admin.service | active/running | 3051068 | 0 |
| signalverse-observer.service | active/running | 3051067 | 0 |
| postgrest.service | active/running | 1960930 | 0 |
| PP Worker | inactive/dead, disabled | 0 | 0 |

```text
PRODUCTION_SHA_BEFORE=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
PRODUCTION_SHA_AFTER=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
APP_LINK=/opt/signalverse/releases/9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
ADMIN_LINK=/opt/signalverse-admin/releases/9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
WORKER_ACTIVE=NO
WORKER_ENABLED=NO
WORKER_PID=0
REAL_PP=OFF
DEMO_PP=OFF
```

Peer-authenticated database reads on signalverse_cutover2 used psql -X, ON_ERROR_STOP, BEGIN READ ONLY, lock_timeout2s, statement_timeout5s and explicit ROLLBACK. Both independently returned readOnly=on. One control row real=false/demo=false; updatedAt unchanged at 2026-10-01T11:30:19.817128Z. All close intents, PP close intents, PP state rows, PP-enabled rows and PP-closed records remain zero. No DML/DDL/migration/schema refresh/backfill was performed.

Selected journal coverage starts 2026-10-01T20:25:14Z. Before: ends 20:51:31.566831527Z, 26 ordinary entries. After: ends 20:54:47.162125597Z, 29 ordinary entries. Both: zero Worker entries, zero PP events, zero Worker lifecycle. No raw private messages disclosed.

No exchange API calls or trading commands were made. Zero-action fields describe this task, not an account-wide forensic guarantee about unrelated ordinary jobs or owner activity. No private exchange state was queried. No HTTP/application post-deploy check was required/performed; active services are not a private-execution or profitability PASS.

## Required Phase 5M-A fields

```text
PHASE=5M-A
TARGET_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
PARENT_SHA=da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f
CI_RUN=36919580840
CI_RESULT=PASS; 1/1 JOB; 38/38 STEPS; 0 FAILED; 0 SKIPPED
PRODUCTION_SHA=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
REAL_PP=OFF
DEMO_PP=OFF
WORKER_ACTIVE=NO
WORKER_ENABLED=NO
WORKER_PID=0
ARTIFACT_PREPARATION_RUN=36924691521
ARTIFACT_ID=11193805318
ARTIFACT_NAME=production-release-66f3ac2e89d1c40543851c6a9b1f46318d6f6a12-36924691521-1
ARTIFACT_SHA256=5ea0cd6e6fa88bbeff915e2efee2e03950edc880dd57f5e6e49224a58f3c26f5 (OUTER GITHUB ZIP)
INNER_RELEASE_SHA256=ca52962df2d7e93e2f782f0cee23b2516f6c305cfcbb1e358e973df03bee44dd
EMBEDDED_APPLICATION_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
ARTIFACT_PROVENANCE=PASS; OFFICIAL MAIN WORKFLOW_DISPATCH; RUN/ATTEMPT/ARTIFACT/METADATA/EMBEDDED ID VERIFIED
ARTIFACT_VERIFICATION=PASS
GUARD_TARGET_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12 (REQUIRED TARGET ONLY)
GUARD_ID=NOT CREATED
GUARD_DIGEST=NOT SET; REQUIRED INNER DIGEST ca52962df2d7e93e2f782f0cee23b2516f6c305cfcbb1e358e973df03bee44dd
GUARD_EXPIRY=NOT CREATED
GUARD_STATUS=NOT CREATED/NOT VERIFIED; EXCLUDED BY DIRECT OWNER SCOPE
GUARD_VERIFICATION=BLOCKED
DEPLOYMENT=NO
WORKER_START=NO
PP_ACTIVATION=NO
EXCHANGE_ACTIONS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_ACTIONS=0
TP_ACTIONS=0
CLOSE_ACTIONS=0
APPLICATION_COMMIT_CREATED=NO
APPLICATION_PUSH=NO
AUTHORIZED_PREPARE_ONLY_RESULT=PASS
FINAL_CLASSIFICATION=PHASE 5M-A BLOCKED — ARTIFACT OR GUARD PREREQUISITE NOT VERIFIED
```

## Tests / Build / Git / Commit

No application regression suite/build/normal CI rerun occurred. Existing Production CI is the pinned successful evidence; official prepare-only packaging and actual independently downloaded byte/provenance verification passed. This is GitHub/Linux packaging/runtime evidence, not a source-text-only test and not a VPS Guard/delivery execution test.

Root remains on codex/prediction-coverage-expansion-audit at 0dbca62357a4adf34240f40ceda3e387356ec4b0. Audited candidate remains exact target/clean; root private/dirty work and prior blocked reports are preserved. Source commits/pushes: NONE. Report-only AI-Log commit/link and remote verification are returned in the completion message. No artifact archive/application code/private data is included in that report commit.

## Remaining Issues / Risks / Next Step

The owner-authorized prepare-only task is completed. An independent exact-target/verified INNER-digest approval, if later separately authorized, remains a distinct gate; the present task does not create/claim/consume one. Guard readiness and deployment are not proven. Any later operator must recheck exact identities/availability/expiry and current Production safety and use the official retained artifact, without repackaging.

Stop here. No Guard creation, release dispatch, deployment, Worker start/enable, PP activation, database change or financial action follows.
