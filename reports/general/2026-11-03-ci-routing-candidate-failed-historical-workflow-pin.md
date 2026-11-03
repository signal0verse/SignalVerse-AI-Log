# CI routing candidate — official failure, stopped before promotion/release

Recorded 2026-11-03T15:49:49.569922+00:00. This final failure report
supersedes the earlier [in-progress checkpoint](https://github.com/signal0verse/SignalVerse-AI-Log/blob/1eb53933a580ac0f21a2a6fd8d9b5e3df8ee20a7/reports/general/2026-11-03-ci-routing-candidate-validation-in-progress.md).
No CI pass, complete performance improvement or Production readiness is claimed.

## Frozen source and actual official run

- Candidate: `418de61b83a915ed19b1f0642e6a45a8c362f8ef`; branch `codex/ci-module-routing-20261103`.
- Sole parent and still-current remote main: `eacedbb2801c303482b201320968983fce9d93bf`.
- [Official candidate CI 41664101646](https://github.com/signal0verse/signalverse-main/actions/runs/41664101646) —
  `workflow_dispatch`, attempt1, **FAILURE**; Node22.23.4 on the original isolated
 2CPU/4GiB runner, unchanged180-minute limit.
- Job: Build web and API runtime, started 2026-11-03T15:29:24Z,
  completed 2026-11-03T15:38:47Z (9m23s). It failed an assertion, not a timeout.
  An early failure is not a complete-suite speed measurement.
- Actual94 step results: **9 success,2 failure,83 skipped**. The remaining
  required stages were skipped after the first failure; they were not approved
  as unnecessary by the selector. Both old cancelled chart CI attempts remain
  unusable for release acceptance.

## Exact failure and read-only root-cause proof

Step8, `Test retained Spot scanner and independent chart workspace navigation`:
**557 tests;556 pass,1 fail,0 cancelled/skipped**.

Failing test:

```text
checked source batches execute every original assertion and reject changing snapshots
AssertionError: Original cache and workflow authority unchanged
```

The current lossless loader is `scripts/spot-swing-entry-info-test.mjs`.
It loads the hash-verified historical test program from immutable Git commit
`a3ddbbcbad3e7b1c480772469f942f27357743b7`, same path, into an isolated temporary
`current-entry.mjs`. The failing assertion is original program line106 (stack
location `/tmp/sv-current-entry-tests-.../current-entry.mjs:106:238`). Its raw
`source()` reader (line70) compares five current cache/workflow files with
historical released baseline `5bf0dcd8d56ae12ca4a4f1728a189c16e889dc08`.

Independent direct Git-byte comparison, without the CI preload/projection:

| Protected file | Current candidate versus historical baseline |
| --- | --- |
| `scripts/lib/scope-verification-cache.mjs` | IDENTICAL |
| `scripts/lib/scope-git-cache.mjs` | IDENTICAL |
| `.github/workflows/production-ci.yml` | CHANGED: authorized CI successor |
| `.github/workflows/production-release.yml` | IDENTICAL |
| `.github/workflows/production-release-artifact.yml` | IDENTICAL |

The baseline Production CI bytes equal parent eacedbb2's bytes exactly. The
candidate intentionally adds CI step IDs, routing conditions, shell-only
preloading and the final mandatory audit, so the old raw workflow equality
cannot pass. This Linux-only archived test consumer was outside the practical
Windows66-case local selection. The two reviewed current chart inventory
transports did not reach this separate raw archived-program reader.

This is a missing historical **source-inventory transport** for the newly
authorized CI successor. The observed assertion is not evidence of a Strategy,
Spot, Futures engine or financial behavior failure. It also does not prove the
unexecuted stages clean. The original assertion, historical program hash and
all protected cache/release files remain intact; nothing was removed or weakened.

Step91, `Require every selected and mandatory gate to succeed`, then correctly
failed with:

```text
Required gate did not succeed: gate_006
```

That second failure is the intended fail-closed rejection of the first failure,
not a false pass or permission to skip the remaining required gates.

## What actually passed and what remains unverified

- Official Node22 CI selftest stage: **33/33**,0 failures/cancelled/skipped.
  Early isolated-runner/source gate, dependency install and selection plan passed.
- The failed retained scanner/navigation group passed556 other tests. Its group
  result is **FAIL**, not partial acceptance.
- The four original compiler comparisons, remaining full-suite steps,
  official18 chart-completion proofs and official Web/Admin/API builds:
  **NOT RUN** in this failed attempt. No zero-new-diagnostics claim is made for
  this official run.
- Earlier actual local results remain separately labelled:66/66 tests on
  Node24,7 local committed-CLI synthetic fixtures, Web/Admin and14 API bundles
  passed; four final documentation/source checks also passed. They do not
  override this failed official run.
- The full75 original command groups,87 fragments and90 YAML steps remain in
  source. This CI-change attempt selected the full path. No assertion, test,
  compiler comparison, cache/witness policy, release workflow or receiver limit
  was dropped to obtain green.

Authoritative log ZIP SHA-256:
`96ff113e579d3e8360446820b5e6760c7d99d34b7941da47e5b8bb3f4a4449a2`.
All raw logs, run/job metadata, per-step failures and the Git-byte comparison
receipt are retained privately. No live/private account data is included here.

## Required next review — no implementation performed after failure

The smallest repair to review is the **current immutable-program loader/read
transport**, not deletion of line106 or replacement of its expected equality.
Only exact, independently validated CI-successor bytes may map to their reviewed
predecessor for that historical comparison. All original executable assertions,
immutable program/hash, cache/release bytes and unknown-byte rejection must stay.
Required evidence includes the exact failing Linux test, direct-current CI proof,
corrupted-workflow/cache/extra-file negatives and a fresh complete exact-SHA
Linux CI after a separately reviewed normal successor commit. No new commit,
source edit, push, rerun or dispatch was performed after this failure.

A capacity option worth separately evaluating is the existing repository's
hash-verified immutable-Git program-storage pattern for **CI-only** tool/test
bodies, with complete expanded-program proof and cold Node22 bootstrap tests.
This is a proposal, not an implemented or size-verified solution. It must not
hide dependencies/assertions, alter packaging/Guard, or delete unrelated reports.

## Independent release capacity blocker remains

The exact local candidate capacity test measured **8,407,874 bytes**,
against the unchanged **8,388,608-byte** maximum: **19,266 bytes over**.
Those diagnostic bytes were discarded. No official/retained release artifact,
Guard or approval exists for this candidate. No compression/export rule,
packaging/receiver/Guard change, cap increase, unrelated archival or alternative
artifact was performed. Capacity and new release identity require separate
review; branch CI could never replace main/push release acceptance.

## Cleanup and operational safety

The existing isolated runner controller recorded automatic container removal
and saved diagnostics. Independent read-only checks prove the owned container
absent and GitHub runner213 registration absent. No other runner/container was
modified. The runner listener's exit0 is normal process cleanup and **does not**
change the failed GitHub job result.

Remote main still equals the frozen parent above; local branch HEAD is still
418de61b and its working tree is clean. Only the previously published CI-only
candidate commit exists; no further application-source push occurred.

No main promotion, official artifact preparation, Guard/approval/claim action,
release, deployment, production service restart, migration, financial DB mutation,
scanner/profile/job/Strategy/Risk/Execution change, PP flag change, canonical PP
Worker start/enable/restart or private exchange/order/position/SL/TP/close action
was performed. Previous Production runtime c1619552 was not changed by this task;
no fresh application-runtime verification is claimed in this CI-only phase.
Disposable SQL/runtime tests remain isolated from Production. No private-account
execution or profitability claim is made.

The scheduled CI heartbeat is being deleted because this run failed and the
instructions require stopping before another repair/push/rerun. A later owner
instruction can authorize the narrowly reviewed next step.

FINAL_CLASSIFICATION=CI_FAILED_STOPPED_BEFORE_FURTHER_ACTION
MAIN_PUSH=NO
APPLICATION_COMMIT_AFTER_FAILURE=NO
SOURCE_EDIT_AFTER_FAILURE=NO
PUSH_AFTER_FAILURE=NO
CI_RERUN=NO
OFFICIAL_ARTIFACT_PREPARATION=NO
GUARD=NO
DEPLOYMENT=NO
DATABASE_MUTATION=NO
WORKER_STARTED=NO
PP_FLAGS_CHANGED=NO
EXCHANGE_ACTIONS=0
ORDER_CHANGES=0
POSITION_CHANGES=0
SL_TP_CHANGES=0
CLOSE_ACTIONS=0
OWNED_CI_CONTAINER=REMOVED_VERIFIED
OWNED_RUNNER_REGISTRATION=ABSENT_VERIFIED
