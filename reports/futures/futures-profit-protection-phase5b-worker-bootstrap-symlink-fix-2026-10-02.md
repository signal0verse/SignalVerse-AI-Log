# Futures Profit Protection — Phase 5B bootstrap fix / acceptance blocked

## Metadata

- Date: 2026-10-02, Asia/Kuala_Lumpur (UTC+08:00).
- Task: owner-supplied Phase 5B implement/test/build/commit/CI/artifact, no deployment.
- Module: standard Futures Profit Protection dedicated worker bootstrap only.
- Mode: local implementation; offline tests/builds; read-only Production checks.
- Repository: signal0verse/signalverse-main.
- Branch: codex/futures-pp-worker-symlink-20261002.
- Starting/ending committed HEAD: 9de1fb13966bb4b2c76dc8efa6a21334d86aacdf.
- New application commit: NONE. Working implementation is uncommitted.
- Production precheck: 2026-10-01T16:53:05Z / 2026-10-02T00:53:05+08:00.
- Production final check: 2026-10-01T17:08:23Z / 2026-10-02T01:08:23+08:00.

## Executive result

The minimal bootstrap repair is implemented. All nine focused entry-point cases,
93 combined PP tests, 16 disposable PostgreSQL checks, Web/Admin builds and all
14 API bundles PASS. No financial or Production behavior was changed.

**Release preparation is BLOCKED, not READY.** The owner's explicit commit gate
is "If all tests pass". The broader Futures run is 881 PASS / 3 failed test files.
A disposable baseline containing the exact deployed Git blobs reproduces all three
failures. They are inherited legacy assertions, not introduced bootstrap changes,
but this task does not silently waive the all-tests-pass gate or repair unrelated
code/tests. Full local CI also encounters genuine Windows/POSIX prerequisites.

No new application commit, push, GitHub CI dispatch, release artifact, Guard,
deployment or Worker start occurred. Prior successful Production deployment is
not relabelled a failure. This report's AI-Log publication is documentation only,
separate from application source/CI/Production.

## Objective and strict scope

Repair only main-executable detection when Node launches the existing Worker
through the app symlink. Preserve the explicit flag and entire boot function,
monitor loop, adapters, lifecycle, policy, reconciliation, database behavior and
safety gates. Stop before deployment/Worker activation/Real or Demo enablement.

No strategy, entry, SL, ONE TP, execution, risk, economics, scanner, AI, Fast Trader,
Spot, Prediction, workflows, Guard, unit/drop-in or persistent environment changes.
No Production SQL write, schema refresh, private exchange request, trade or position
operation. Existing dirty/private work in the original checkout was preserved;
the existing clean PP checkout was reused rather than overwriting that work.

## Confirmed root cause

Old condition:

```js
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
```

The actual installed ExecStart still names:

```text
/usr/bin/node /opt/signalverse/app/server/futures-profit-protection/worker.mjs
```

The active app symlink resolves to:

```text
/opt/signalverse/releases/9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
```

The module URL resolves through that symlink, while argv still names the symlink.
Unresolved URL equality is false; the boot function is never called. The previous
clean exit was NOT an exchange, DB, systemd or PP policy failure. The supplied
prompt's repeated SHA fragment in one example URL is a typo, not an actual path;
the independently read deployed path above is authoritative.

## Actual implementation

Only `server/futures-profit-protection/worker.mjs` has an executable source delta:

```js
import {realpathSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
export function isProfitProtectionWorkerEntrypoint(entryPath,moduleUrl=import.meta.url) {
  if(typeof entryPath!=='string'||!entryPath)return false;
  try {
    return pathToFileURL(realpathSync(entryPath)).href===pathToFileURL(realpathSync(fileURLToPath(moduleUrl))).href;
  } catch {
    return false;
  }
}
```

The top-level conditional calls this predicate with `process.argv[1]`. Both paths
are filesystem-resolved, including URL decoding. Missing/invalid/unresolvable
paths return false. No hardcoded release, SHA or host path occurs in production
source. `bootProfitProtectionWorker` and its `workerFlag === '1'` requirement,
runtime URL, actual import, success message and failure exit remain unchanged.
The resolver does not import the runtime or start a loop itself.

## Files inspected / changed

Inspected: AGENTS.md, CLAUDE.md, latest HANDOFF/AI_HANDOFF, full TRADING_STRATEGY,
colleague handoff, safe test runbook, Phase 4 report, worker, PP operational doc,
PP policy/lifecycle/adapter/UI/SQL/scope tests and imported pure test context,
official Production CI and prepare-only workflows, release-artifact helper,
reviewed regression sources, installed unit/drop-in/symlinks/service metadata,
OFF singleton through bounded read-only SQL, and AI-Log README/template/scanner.
No secret values or private account/trade rows were exposed.

| Changed path | Classification and reason |
| --- | --- |
| server/futures-profit-protection/worker.mjs | Minimal executable main-path resolver and guard replacement |
| scripts/futures-profit-protection-test.mjs | Nine actual filesystem/child-process regressions; existing assertions retained |
| docs/futures-profit-protection.md | Bootstrap defect/repair and blocked acceptance boundary |
| HANDOFF.md | Dated local implementation and no-release handoff |
| reports/futures/futures-profit-protection-phase5b-worker-bootstrap-symlink-fix-2026-10-02.md | This sanitized report (untracked locally; report-only AI-Log publication) |

Before report creation, tracked diff: four files, 136 insertions, 3 deletions.
Initial code/test diff: two files, 105 insertions, 3 deletions. `git diff --check`
PASS. `git diff --name-only` contains only the four tracked paths above. Diff of
api/src/migrations/ops/.github against deployed HEAD is empty.

During local tests, three VERIFIED-UNMODIFIED checkout text inputs were mechanically
converted CRLF→LF to match Linux (`App.tsx`, terminal indicators, reserve migration).
Their canonical Git tree bytes never changed; original CRLF checkout form was
restored afterward. They are not source changes and are absent from final diff.
No application/test expectation was edited to make those EOL cases pass.

Temporary ignored/untracked local test logs and fixture harnesses remain outside
the release inventory. No artifact/credential/database dump is staged/published.

## Focused executable regression evidence

Actual modified worker bytes were copied into a disposable:

```text
<temp>/opt/signalverse/releases/<old-SHA>/server/futures-profit-protection/worker.mjs
<temp>/opt/signalverse/app -> releases/<old-SHA>
```

Fake `.runtime/api/copytrade.mjs` only emits an import counter. No actual API
bootstrap, .env, DB, exchange, private API or network is imported. Child processes
receive a restricted environment, bounded five-second timeout and hidden windows.
Fixture cleanup validates the exact owned temp parent/name before removal.

| Case | Actual result |
| --- | --- |
| Frozen old 9de1fb worker, symlink invocation | PASS: defect reproduced; exit 0, zero bootstrap/runtime messages |
| Canonical executable path | PASS: resolver true; one runtime import and one initialization message |
| Production-shaped directory link | PASS: resolver true; one runtime import and one initialization message |
| `--preserve-symlinks-main` | PASS: both resolved identities still equal; one bootstrap |
| Import by a different executable | PASS: no bootstrap despite flag |
| Missing argv | PASS: predicate false; actual module import does not bootstrap |
| Missing/NUL/non-string entry or invalid/non-file module URL | PASS: false; actual missing-entry import cannot bootstrap |
| Absent, `0`, or `true` host flag | PASS: exit 1, WORKER_BOOT_FAILED, no runtime import |
| Runtime import rejects | PASS: existing failure exit/message retained |

Focused command:

```text
Node22 --test --test-name-pattern="worker bootstrap" scripts/futures-profit-protection-test.mjs
```

Result: 9 tests, 9 PASS, 0 FAIL, 0 SKIPPED. Local Node v22.23.3 on Windows;
directory junctions exercise real filesystem resolution. Linux CI would use actual
directory symlinks, but that NEW exact-SHA Linux run has NOT happened. These child
processes do not prove real monitor safe-idle/keepalive or private execution.

## PP, regression, SQL, types and build results

| Suite/check | PASS / FAIL / SKIPPED and exact evidence |
| --- | --- |
| PP policy/lifecycle/Demo replay/worker file | PASS 52/52, includes the nine worker cases |
| Actual extracted native adapters | PASS 37/37, injected transport only |
| Actual React PP UI | PASS 4/4, both modes/languages |
| Combined PP | PASS 93/93, zero skipped; do not add the focused 9 again |
| PP SQL | PASS 16/16 on fresh loopback PG18.6; cluster stopped/removed |
| Broad Futures regression | FAIL: 884 test cases, 881 PASS / 3 FAIL / 0 skipped |
| Frozen baseline repeat of three failing files | FAIL: 3/3 files reproduce unchanged baseline failures |
| Real execution faults + Gate/MEXC + funding | PASS 131/131; isolated transports, no private request |
| Historical timing | PASS 32/32 |
| Simulation exits | PASS 46/46 |
| Simulation chronology | PASS 41/41 |
| Simulation accounting/UI | PASS 39/39 |
| Simulation capital | PASS 27/27 |
| Simulation analytics | PASS 54/54 |
| Futures scheduler | PASS 17/17 |
| Market discovery suites | PASS 116/116 |
| Partner host/auth/contracts/indicator parity | PASS 21/21 after canonical-LF test inputs |
| Paper/full-terminal parity | PASS 36/36 |
| News/catalog/watchlist/onboarding/paper transport | PASS 24/24 |
| Learning | PASS: structural script and its 26 behavioral cases |
| GitHub transport | PASS 11/11 |
| Whale pure/offline suites | PASS 96/96 |
| Existing stablecoin/collector suites | PASS after unchanged reserve SQL fixture is LF; neither source nor tests changed |
| Existing Prediction suite commands | PASS; all commands in the official step completed |
| Existing full Windows admin group | FAIL: 135 PASS / 59 FAIL, POSIX permissions/symlinks and Unix-only SQL binary checks |
| Entry-claim SQL on Windows | FAIL before DB startup: requires extensionless Unix binaries; no Production fallback |
| Later Whale/admin SQL workflow steps | NOT RUN after local prerequisite stop; not counted PASS |
| PP scope | PASS: 689 non-PP tracked baseline files intact; existing analysis/Spot/Fast Trader/scanner functions unchanged |
| Frontend type comparison | PASS acceptance: 71 baseline / 71 candidate diagnostics, 0 introduced; NOT type-clean |
| API type comparison | PASS acceptance: 30 baseline / 30 candidate diagnostics, 0 introduced; NOT type-clean |
| Standalone admin strict typecheck | PASS |
| Worker JS syntax / diff whitespace | PASS |
| Web/Admin normal build | PASS / PASS; existing large-chunk warning, no build error |
| Reusable/full terminal builds | PASS / PASS; no activation |
| API bundling | PASS 14/14, target node22, write:false final independent check |
| Lint | NOT CONFIGURED in the current CI/package scripts |
| NEW GitHub CI | NOT RUN; no new application commit exists |

Unsafe legacy notional/min-margin/private-account tests that load Production
credentials are NOT RUN under the safe runbook. No wildcard execution of scripts.
Skipped/unrun cases are not converted to PASS. An initial sandbox PG startup failure
was rerun with suitable local permissions; the unchanged PP SQL suite then passed
all 16 checks. Other local failures are retained, not hidden.

The official workflow's local command equivalents were executed with Node22 and
credential-free children. Windows cannot validate Linux POSIX permissions or Unix
SQL paths. This is PARTIAL/FAIL local CI evidence, not GitHub/Linux CI PASS.
Dependencies were installed with `npm ci` from unchanged lockfiles (installation
host Node24; tests/builds rerun with portable Node22). npm reported two inherited
high-severity audit findings; no unapproved dependency remediation was attempted.

## Exact remaining legacy blockers

1. `futures-history-detail-test.mjs`: 37 structural checks pass, 12 fail, including
   obsolete spot-price/UI/fee/source-shape expectations. No private account test.
2. `futures-liquidation-feasibility-test.mjs`: two direct-close source-shape
   assertions fail at the existing shared close wrapper. Actual isolated faults
   and durable PP close ordering pass separately; no assertion is waived.
3. `futures-pro-timeframes-test.mjs`: fails its assertion that both add/edit forms
   render the previously expected multi-select source pattern.

For the baseline proof, all three tests AND every file they read were taken from
exact Git commit 9de1fb... into a fresh disposable fixture, using canonical LF.
The current inputs/tests match those blobs exactly. Baseline exit 1; all three
test files fail again. This proves inheritance; it does not grant permission to
change UI/risk/history/execution or silently redefine release acceptance.

## Production unchanged proof

| Service | PID before / after | Restarts before / after | Final state |
| --- | --- | --- | --- |
| signalverse | 3051115 / 3051115 | 0 / 0 | active/running |
| admin | 3051068 / 3051068 | 0 / 0 | active/running |
| observer | 3051067 / 3051067 | 0 / 0 | active/running |
| PostgREST | 1960930 / 1960930 | 0 / 0 | active/running |
| PP worker | 0 / 0 | 0 / 0 | inactive/dead/disabled |

Final marker and app/admin realpaths are exact 9de1fb...; public local health is
HTTP200 with `ok:true`. Bounded `BEGIN READ ONLY`, statement_timeout 5s and ROLLBACK
reads `real_enabled=false`, `demo_enabled=false`. No DML/DDL or schema refresh.

Installed hashes remain the previous deployed evidence:

```text
worker:   7c0bd80f7320016e3d01ba1b5cdd737fd87a3f60f81338654cb01f3983d55faf
unit:     d562e0803f18a0972f8f643dc6998c7cef478f2b922236ed0eb923600233f66d
drop-in:  8abd593c611846bf1d2a3967bdf3a970d3fb85e00d277bec9deb2e41abf16695
```

The installed EnvironmentFile/drop-in was inspected without printing secret
values. Neither ExecStart nor file was modified. Counts below cover this task's
actions, not unrelated natural application activity on other modules/accounts.

## Git / artifact / release state

Remote main checked before and after: exact 9de1fb13966bb4b2c76dc8efa6a21334d86aacdf.
Existing CI36853090043 is success for this OLD SHA/main/push; it is NOT acceptance
of the uncommitted fix. Existing artifact11156828095 and consumed Guard are also
OLD release evidence and are NOT reused or presented as a new fix artifact.

```text
FINAL_STATUS=PHASE5B_BOOTSTRAP_FIX_TESTED_RELEASE_PREPARATION_BLOCKED
OLD_SHA=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
NEW_SHA=NOT_CREATED
OLD_PRODUCTION_SHA=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
CURRENT_PRODUCTION_SHA=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
UNRELATED_SOURCE_FILES_CHANGED=NO
ENTRYPOINT_TEST=PASS
CANONICAL_PATH_TEST=PASS
SYMLINK_PATH_TEST=PASS
NON_MAIN_IMPORT_TEST=PASS
MISSING_ARG_TEST=PASS
INVALID_PATH_TEST=PASS
WORKER_FLAG_TEST=PASS
NO_DUPLICATE_BOOTSTRAP_TEST=PASS
PP_TESTS=93_PASS_0_FAIL_0_SKIPPED
PP_SQL=16_PASS_0_FAIL
FUTURES_REGRESSION=881_PASS_3_FAILED_FILES_INHERITED
BUILD=PASS_WEB_ADMIN_14_API_BUNDLES
CI=NOT_RUN_NEW_SHA_NOT_CREATED
ARTIFACT_ID=NOT_CREATED
ARTIFACT_RUN_ID=NOT_RUN
ARTIFACT_SHA256=NOT_CREATED
EMBEDDED_COMMIT=NOT_AVAILABLE
CORE_COMMIT=NONE
CORE_PUSH=NO
PRODUCTION_DEPLOYMENT=NO
WORKER_STARTED=NO
WORKER_ENABLED=NO
REAL_PP=OFF
DEMO_PP=OFF
EXCHANGE_ACTIONS=0
ORDERS_CHANGED=0
POSITIONS_CHANGED=0
SL_CHANGES=0
ONE_TP_CHANGES=0
DATABASE_CHANGE=NO
GUARD_CREATED=NO
```

## Remaining issues / next phase

Owner must explicitly settle the inherited legacy-test acceptance disposition;
the task did not authorize unrelated test repairs or waive "all tests pass".
Windows-only prerequisite failures require a genuine Linux validation, not mocks
of permissions or bypasses. The tested local bootstrap change is preserved.

Only after the acceptance gate is actually met: one bootstrap-only source commit
with the requested message, authorized normal Git/main CI, NEW exact-SHA successful
CI, existing prepare-only workflow, independent retained-byte/digest/embedded-SHA
verification, then STOP. A fresh independent Guard and official deploy/Worker
start require the next owner authorization. Do not renew/reuse consumed approvals,
repackage retained bytes, edit the active release, change ExecStart or enable PP.

Profitability/improvement/private-account execution/real monitor safe-idle are NOT
proven by these offline checks. No financial parameter or strategy change occurred.
