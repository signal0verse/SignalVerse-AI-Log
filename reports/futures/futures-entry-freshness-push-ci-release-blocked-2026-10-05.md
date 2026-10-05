# Futures entry freshness — main push succeeded, official CI blocked deployment

## Metadata

- Date: 2026-10-05; all operational timestamps below are UTC.
- Owner request: push and deploy the previously validated entry-freshness/AUTO-quality repair.
- Repository: `signal0verse/signalverse-main`.
- Isolated branch: `codex/futures-entry-freshness-20261005`.
- Source SHA: `a4ba3246672c3db35b61f56ed5600ba20fb9a0f1`.
- Sole parent and main before push: `3e92cab7a36cc0021847b1f700b9b5a394c75b37`.
- Main after push and final authenticated recheck: `a4ba3246672c3db35b61f56ed5600ba20fb9a0f1`.
- Final classification: **SOURCE_PUSHED_CI_FAILED_DEPLOYMENT_BLOCKED**.

## Objective / scope

Publish the already-reviewed repair using normal main promotion, exact-SHA official CI and the established retained-artifact/independent-Guard/release route. Do not modify open positions, SL/TP, PP flags, unrelated product work or release protections. The primary dirty checkout was preserved. No new application commit, history rewrite or test modification was made during this request.

Prior local implementation and validation evidence: [entry freshness/AUTO-quality report](https://github.com/signal0verse/SignalVerse-AI-Log/blob/089f19c874d3175a46f2f5ebf816a5d7620946e0/reports/futures/futures-entry-freshness-auto-quality-2026-10-05.md).

## Actions taken

1. Authenticated immediate remote-main read matched the exact parent. Candidate worktree was clean; the target had one sole parent and exactly one commit ahead; diff check passed.
2. Normally pushed only the exact target SHA to `refs/heads/main`. No force, merge, rebase, squash, amendment or additional source change.
3. Verified remote main equals the target. Observed the automatically triggered main/push Production CI; no manual CI dispatch.
4. Performed read-only VPS identity, service health, installed release-control hash and target-approval absence checks. Main/admin health returned healthy; no state-changing command was run.
5. Official CI failed. Stopped before artifact preparation, Guard creation or Production Release. Read the failing logs and the exact historical test consumers; did not change assertions or retry CI.
6. Rechecked unchanged runtime/service PIDs and target-state absence after CI failure. Published only this sanitized documentation report.

Exact push command, after the identity/cleanliness checks:

```text
git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push origin a4ba3246672c3db35b61f56ed5600ba20fb9a0f1:refs/heads/main
```

## Official CI result

- [Production CI run 37292123821](https://github.com/signal0verse/signalverse-main/actions/runs/37292123821).
- Workflow: `.github/workflows/production-ci.yml`.
- Head SHA: `a4ba3246672c3db35b61f56ed5600ba20fb9a0f1`.
- Branch: `main`; event: `push`; attempt: initial automatic run.
- Created: `2026-10-05T09:45:18Z`.
- Job started: `2026-10-05T09:45:22Z`; completed: `2026-10-05T09:48:40Z`.
- Final workflow update: `2026-10-05T09:48:41Z`.
- Job: `Build web and API runtime` — **FAILURE**.
- Step disposition: 24 success, 1 failure, 17 skipped, including cleanup/setup steps.
- Failed step 23: `Test opt-in Futures Profit Protection without private services`.
- First test command in that step: **637 PASS / 3 FAIL / 0 SKIP**, 640 total. Exit 1.
- The subsequent standalone scope/type command in the same shell step was not reached. Later scheduler/discovery/SQL/web/API build steps were skipped, not passed.

```text
node --test scripts/futures-profit-protection-test.mjs scripts/futures-profit-protection-adapters-test.mjs scripts/futures-profit-protection-ui-test.mjs
```

### Exact failed assertions

1. Test 277: `all prior scope manifests, PP/backend/financial/entry code and workflows remain untouched`.
   - File: `scripts/futures-demo-accounting-scope-test.mjs:59`; assertion at line 64.
   - `ERR_ASSERTION`, expected empty Git diff, actual:

```text
api/_shared/futures-auto-candidate-quality.ts
api/_shared/futures-entry-freshness.ts
api/copytrade.ts
```

2. Test 465: `every analyze API byte outside floating-help knowledge is unchanged; no trading API edit`.
   - File: `scripts/futures-tutorial-ui-test.mjs:131`; assertion at line 139.
   - `ERR_ASSERTION`, strict hash equality.
   - Actual: `cfd19b2c32d55de9df2483d341c0435d5e575bdcf7bee77df6ce35dc9ab7ea18`.
   - Expected: `c0ce25665e53666d756205fe99f4cde7ab7c0d6c7ff97f9788a4be7eb38acacf`.

3. Test 466: `this revision changes only the dated tutorial paragraph in help knowledge`.
   - File: `scripts/futures-tutorial-ui-test.mjs:146`; assertion at line 152.
   - `ERR_ASSERTION`, strict hash equality.
   - Actual: `6ffc3949c2d7be2937ab671a9295ef5bcdf0876845be00bfaefd2f5e7e011c1f`.
   - Expected: `b6c3cca99453a6f898142ed5576111512f8f578a634770d538d726fae3ff7a2c`.

## Root cause / disposition

**CONFIRMED:** these historical consumers compare current application bytes directly with older Demo-display/tutorial-only boundaries. The new candidate intentionally changes entry admission and help knowledge, but those three assertions were not connected to the existing closed successor's validated historical view. The Demo test directly runs `git diff` from its old base to the current worktree. The tutorial tests directly hash current `analyze.ts` against older educational revisions.

This is a missing historical-consumer integration in the release-test chain. It is not the separate inherited Gate `getCreditConfig` failure described in the prior report, and it is not proven to be a Linux line-ending or Node-version problem. It must not be waved away as an unchanged baseline failure. The previous 905 selected local tests and separate scope/type gate did not cover this complete official aggregate command; they are insufficient release acceptance.

The failures identify scope/byte-contract incompatibility, not a demonstrated funded-trade failure. Neither that distinction nor previous local success authorizes bypassing CI. A narrow repair must preserve the original assertions and older pinned contracts, validate the entire actual successor before historical projection, test unauthorized-mutation rejection, rerun this exact aggregate command and then obtain successful official CI on the new normal commit. No repair or replacement commit was made in this request.

## Runtime verification / zero deployment

Preflight `2026-10-05T09:46:21Z`, healthy main/admin responses at approximately `09:47:24Z`; final independent verification `2026-10-05T09:50:59Z`.

| Item | Before | After |
| --- | --- | --- |
| Runtime marker | `3e92cab7a36cc0021847b1f700b9b5a394c75b37` | unchanged |
| App release symlink | `/opt/signalverse/releases/3e92cab7a36cc0021847b1f700b9b5a394c75b37` | unchanged |
| Admin release symlink | `/opt/signalverse-admin/releases/3e92cab7a36cc0021847b1f700b9b5a394c75b37` | unchanged |
| Main PID / NRestarts | `3487230 / 0`, active | unchanged |
| Admin PID / NRestarts | `3487183 / 0`, active | unchanged |
| Observer PID / NRestarts | `3487181 / 0`, active | unchanged |
| PostgREST PID / NRestarts | `1960930 / 0`, active | unchanged |
| Independent Partner PID / NRestarts | `3092803 / 0`, active | unchanged |
| PP Worker | disabled / inactive / PID 0 | unchanged |

Installed read-only control-plane hashes match the prior release receipt:

- Receiver: `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa`.
- Authorization helper: `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83`.
- Coordinator: `928eefc39677fe27242f8d2762d7fb3de97bebd2ff8678c20e86ff22188ce308`.

The installed artifact unit identifies the coordinator at `/usr/local/sbin/signalverse-deploy`. An initial read-only probe used the nonexistent `/usr/local/bin` path; the unit resolved the correct path. No file was installed or changed. An old failed unit for a different SHA was visible, but no target release was submitted. Existing fast jobs continued naturally; their timer/configuration were not changed.

No approval, claim or incoming archive for the target was found before or after CI. No artifact workflow or release workflow was invoked. No direct Production SQL, database mutation, exchange API call, order operation, position operation or SL/TP modification was performed during this publication request. Runtime health is not proof of natural account execution or profit improvement.

## Files inspected / changed

Inspected contributor/release/test guidance, current HANDOFF, official CI/artifact/release workflows, artifact verifier, installed read-only release unit/helper/coordinator, candidate source identity, the three failing historical assertions and their historical-projection helpers.

Application source files changed this turn: **NONE**. Candidate remains clean at the pushed SHA. Primary unrelated changes were preserved.

Local uncommitted operator verification helpers were prepared outside the candidate under `tmp/` for the prospective artifact stage, but never executed because CI failed:

- `entry-release-artifact-verify-20261005.mjs`
- `entry-release-artifact-git-verify-20261005.py`

They do not package, deploy or create authorization. No archive was generated/downloaded. This report is the only AI-Log file committed for the request.

## Final state / next step

```text
SOURCE_PUSH=YES
MAIN_SHA=a4ba3246672c3db35b61f56ed5600ba20fb9a0f1
HISTORY_REWRITE=NO
NEW_APPLICATION_COMMIT=NO
CI_RUN_ID=37292123821
CI_EVENT=push
CI_RESULT=FAILURE
CI_RETRY=NO
ARTIFACT_PREPARATION=NO
GUARD_CREATED=NO
RELEASE_RUN=NONE
DEPLOYMENT=NO
PRODUCTION_RUNTIME_SHA=3e92cab7a36cc0021847b1f700b9b5a394c75b37
MIGRATION=NO
DATABASE_MUTATION=NO
WORKER_STARTED=NO
PP_FLAGS_CHANGED=NO
SCANNER_CONFIGURATION_CHANGED=NO
EXCHANGE_CALLS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_TP_CHANGES=0
CLOSE_ACTIONS=0
FINAL_CLASSIFICATION=SOURCE_PUSHED_CI_FAILED_DEPLOYMENT_BLOCKED
```

Next required work is the narrowly reviewed historical-consumer integration repair and full exact-SHA CI. Do not create an artifact/Guard or deploy this failed-CI SHA. The new scanner/admission behavior is not active on Production.
