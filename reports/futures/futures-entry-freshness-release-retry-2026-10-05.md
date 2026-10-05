# Futures entry freshness / AUTO quality — controlled release retry

## Metadata

- Date: 2026-10-05 (UTC evidence timestamps).
- Module: standard Real Futures entry admission and AUTO candidate quality; release-test integration.
- Repository: signal0verse/signalverse-main; source branch codex/futures-entry-freshness-20261005, promoted normally to main.
- Starting source: a4ba3246672c3db35b61f56ed5600ba20fb9a0f1.
- Retry source: f71d287167a33fffa9b0af99e6fb2fd1a021c0c5; sole parent is the starting source.
- Pre-release runtime: 3e92cab7a36cc0021847b1f700b9b5a394c75b37.
- Current classification: **SOURCE_CI_ARTIFACT_PASS_AWAITING_EXACT_GUARD_AUTHORIZATION**. Deployment has not occurred.

## Objective / scope

The owner requested another deployment attempt after the previous exact-SHA CI failure. Repair only the missing historical-test integration, preserve executable bytes of the reviewed a4ba324 implementation, run normal main/push CI, and use only the existing retained-artifact, independent-Guard and official release route. Do not force-push, manufacture trades, alter open-position management, change PP flags, or run migrations. Preserve the primary checkout's unrelated work.

## Confirmed root cause and bounded repair

Previous CI37292123821 failed three direct historical Demo/tutorial comparisons (637/640 in the full PP/UI aggregate). Those consumers had not been connected to the existing exact successor validation. The earlier selected local tests were insufficient and are not represented as full official acceptance.

This retry validates the complete current successor's file inventory, exact canonical hashes and preservation checks before providing predecessor bytes to the three historical comparisons. Their original assertions remain; current functional/render tests still read current source. Negative assertion-tamper tests were added. No frozen historical manifest or financial assertion was weakened. Runtime, application, workflows, migrations, ops, policy and dependencies have zero diff against a4ba324.

## Exact retry files changed

Seven files; 56 insertions / 6 deletions:

1. HANDOFF.md — append retry reason and release boundary.
2. docs/testing/futures-entry-freshness-2026-10-05.md — record failed CI and bounded retry disposition.
3. scripts/futures-demo-accounting-scope-test.mjs — validate the current successor, then use its pinned predecessor for the original historical inventory assertion.
4. scripts/futures-tutorial-ui-test.mjs — historical reader only in the two byte-contract comparisons; other tests remain on current source.
5. scripts/futures-entry-release-scope-test.mjs — runtime/workflow/policy preservation and two negative assertion-tamper checks.
6. scripts/lib/futures-entry-release-delta.json — exact updated retry inventory/hashes.
7. scripts/lib/futures-entry-release-parity.mjs — bounded reversal of only these historical consumer hooks; complete successor still fail-closed.

Full release delta versus active3e92 contains23 paths (the21 implementation paths plus two historical consumers). No extra runtime delta was introduced by the retry.

## Tests executed locally

```text
node --test scripts/futures-entry-release-scope-test.mjs scripts/futures-demo-accounting-scope-test.mjs scripts/futures-tutorial-ui-test.mjs
130 PASS / 0 FAIL / 0 SKIP

node --test scripts/futures-profit-protection-test.mjs scripts/futures-profit-protection-adapters-test.mjs scripts/futures-profit-protection-ui-test.mjs
640 PASS / 0 FAIL / 0 SKIP

node --test scripts/futures-entry-freshness-test.mjs scripts/futures-entry-admission-integration-test.mjs scripts/futures-auto-quality-test.mjs
179 PASS / 0 FAIL / 0 SKIP

node scripts/futures-profit-protection-scope-test.mjs --types
PASS; API diagnostics30 ->30, frontend72 ->71; introduced0.
```

Counts overlap and must not be summed as unique coverage. The179 comprise98 helper tests,65 current-call-site integration tests and16 AUTO-quality tests. Static source/inventory checks are not exchange runtime tests. TypeScript is a baseline comparison, not a clean repository-wide typecheck. Syntax checks and git diff --check passed. The exact formerly failing aggregate, not a reduced subset, now passed. No new local build was necessary for this test-only successor; exact-SHA official CI must establish release builds.

## Source promotion / official CI

Authenticated remote main was a4ba324 immediately before push. Clean successor f71d287 was pushed with a normal non-force fast-forward; remote readback matched it. No other commit or working-tree change was included. No manual CI dispatch.

- CI run: [37294274363](https://github.com/signal0verse/signalverse-main/actions/runs/37294274363).
- Exact SHA: f71d287167a33fffa9b0af99e6fb2fd1a021c0c5.
- Branch/event: main / push.
- Final CI/build result: **SUCCESS**, one job (Build web and API runtime),42/42 successful steps,0 failed,0 skipped. Job ran2026-10-05T10:05:17Z–10:13:20Z on Linux, Node22.23.3/npm10.9.9.
- Official Linux logs independently confirm640/640 for the formerly failing aggregate; frontend72->71/API30->30 diagnostics with0 introduced. Web/Admin builds, all API bundles, retained regression and disposable SQL gates passed.

## Pre-release runtime / control-plane checks

Collected2026-10-05T10:05:51Z (health responses10:05:52Z). Marker and both main/admin symlinks matched3e92cab. Main and admin health returned successful readiness; admin reported that exact release. Guard receiver/helper/coordinator hashes matched prior installed values; approval-store directories were root:root0700. No target approval, claim or incoming archive existed. No target activation was queued/running. One unrelated old failed artifact unit was retained unchanged; the normal fast-jobs service was naturally running.

| Service | PID before | NRestarts before | State before |
| --- | ---: | ---: | --- |
| signalverse |3487230|0|active/enabled|
| signalverse-admin |3487183|0|active/enabled|
| signalverse-observer |3487181|0|active/enabled|
| postgrest |1960930|0|active/enabled|
| signalverse-futures-profit-protection |0|0|inactive/disabled|
| signalverse-partner-copytrade |3092803|0|active/enabled|
| signalverse-deploy-receiver |2210596|0|active/enabled|

Partner was checked under its actual signalverse-partner-copytrade unit; the initial nonexistent short name is not used as evidence. No environment/credential values or private account rows were exposed.

## Artifact / authorization / release boundary

- Official prepare-only run [37295268881](https://github.com/signal0verse/signalverse-main/actions/runs/37295268881): SUCCESS,10/10 steps. Workflow/tooling SHA is the exact f71d287 target.
- Artifact ID:11337594856.
- Artifact name:production-release-f71d287167a33fffa9b0af99e6fb2fd1a021c0c5-37295268881-1.
- Created2026-10-05T10:14:24Z; retained until2026-11-04T10:14:23Z.
- Outer GitHub ZIP SHA-256:4693de0df783223721aca5fea6542fbd5649fb0a0cad6d6fc8d9a540f73d004e;4,831,845 bytes. Independent second download matched GitHub's artifact digest and size.
- Inner release.tar.gz SHA-256:90ab26a6e809f437743064c1a152f0a3c343a388db1f92159fc04fcaa81edb1f;4,830,900 bytes.
- Embedded commit:f71d287167a33fffa9b0af99e6fb2fd1a021c0c5.
- Metadata, run/repository/attempt/artifact identity and LF packaging contract:PASS.
- Independent tar-reader verification against canonical Git objects:820/820 regular file blobs,54/54 directories and executable modes match exactly. No extraction or archive code execution. No repackaging.

Owner was asked for the existing independent one-time Guard authorization bound to precisely this SHA, artifact ID and inner digest. No old approval may be reused. At this receipt, that exact confirmation has not yet been received: **GUARD_CREATED=NO; RELEASE_RUN=NONE; DEPLOYMENT=NO**. This is an authorization boundary, not a remaining CI/build failure.

Final read-only preflight2026-10-05T10:15:50Z: remote main still f71d287; active marker/app/admin remain3e92cab; all seven correct service PIDs/restart counts unchanged from the table. Main/Admin health PASS; public-info HTTP200. Target approval/claim/archive absent; no activation job. PP Worker remains inactive/disabled/PID0. No post-deployment verification is claimed because no deployment occurred.

## Implementation effect and limitations

The reviewed runtime repair binds new standard Real entries to their original active setup and current decision, rechecks contributing closed native candle boundaries and freshness, and checks current AUTO quality. New quality requires confirmed4h/1h direction, non-adverse participation and present market-quality data; missing evidence is UNKNOWN, not PASS. Qualified candidates may replace invalid ones; time alone does not churn a valid list. The existing five-minute scheduler cadence is unchanged.

No migration is needed; existing JSON metadata is used. PREPARED/SUBMITTED/UNKNOWN holds retain existing recovery behavior. No uncertain hold is freed or resubmitted to make tests green. Existing positions, SL/ONE TP, core Decision Engine/V3, native execution adapters, PP Worker, Partner, Spot, Fast Trader, Prediction and Whale code remain outside the executable change scope.

IMPORTANT: final reads reduce but do not eliminate the SELECT-to-submit race with concurrent scanner/profile/decision writers. An offline counterexample explicitly demonstrates this residual race. Atomic database admission shared with those writers is not implemented or proven by this release. No profitability, improved realized R:R, prevention of every losing trade or live exchange execution is inferred. The retrospective sample included a TP winner. Natural future outcomes require separate observation.

## Safety / Git / remaining work

No production SQL, migration, direct exchange request, test order, manual position/SL/TP change, PP activation or scanner-gate change was performed during local repair and source promotion. Existing autonomous activity is not claimed to be globally stopped. Deployment-related service activation, if performed, must be recorded separately below. Primary dirty/untracked work and the AI-Log checkout's unrelated report are preserved.

## Files inspected and local operator helpers

Read the CI, prepare-only and release workflows; release-artifact validator; installed receiver/helper/coordinator identity and root authorization/activation code; historical consumers/parity validators; current source diff and release notes; report template. Reused local read-only artifact verification helpers under tmp/, updating only the target SHA. These uncommitted operator helpers independently checked the official downloaded artifact and never created an archive or executed its contents.

## Final state / next step

```text
SOURCE_SHA=f71d287167a33fffa9b0af99e6fb2fd1a021c0c5
REMOTE_MAIN_SHA=f71d287167a33fffa9b0af99e6fb2fd1a021c0c5
SOURCE_PUSH=YES_NORMAL_FAST_FORWARD
CI_RUN=37294274363
CI=PASS_42_OF_42_STEPS
ARTIFACT_PREPARE_RUN=37295268881
ARTIFACT_ID=11337594856
ARTIFACT_VERIFICATION=PASS
GUARD_CREATED=NO
GUARD_AUTHORIZATION=AWAITING_EXACT_OWNER_CONFIRMATION
RELEASE_RUN=NONE
DEPLOYMENT=NO
ACTIVE_RUNTIME_SHA=3e92cab7a36cc0021847b1f700b9b5a394c75b37
DATABASE_MUTATION=NO
MIGRATION=NO
PP_WORKER_STARTED=NO
PP_FLAG_CHANGE=NO
SCANNER_GATE_CHANGE=NO
DIRECT_EXCHANGE_ACTIONS=0
TEST_ORDERS=0
MANUAL_POSITION_SL_TP_ACTIONS=0
HISTORY_REWRITE=NO
FINAL_CLASSIFICATION=SOURCE_CI_ARTIFACT_PASS_AWAITING_EXACT_GUARD_AUTHORIZATION
```

After explicit exact-artifact confirmation: recheck main/CI/runtime and unused target state, issue one fresh approval using the existing out-of-band mechanism, immediately validate it, invoke only the official retained-artifact release, and verify runtime/services read-only. Do not renew a burned approval or take an alternative delivery route. Source and artifact readiness alone do not mean the repair is active for live users.
