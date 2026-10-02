# Phase 5N — Worker smoke stopped before any mutation: Production SHA mismatch

## Metadata

- Date: 2026-10-02, Asia/Kuala_Lumpur.
- Task: Phase 5N; dedicated Futures Profit Protection Worker install/start smoke only.
- Owner-approved target: 66f3ac2e89d1c40543851c6a9b1f46318d6f6a12.
- Mode actually executed: local read-only contract inspection and immediate read-only VPS marker gate; no installation, enable, start or smoke execution.
- Operational audit interval: 2026-10-02T05:53:16Z through stop-record time 2026-10-02T05:57:23Z, equivalent to 13:53:16–13:57:23 Asia/Kuala_Lumpur.
- Application root branch/HEAD preserved: codex/prediction-coverage-expansion-audit / 0dbca62357a4adf34240f40ceda3e387356ec4b0.
- Exact local target checkout remains clean at 66f3ac2e89d1c40543851c6a9b1f46318d6f6a12.
- Publication: sanitized report only to SignalVerse-AI-Log/master under AGENTS.md; no application commit/push.

## Objective / Scope

Verify the already-deployed exact version before considering the existing Worker unit's enable/start. Require Real/Demo PP OFF and non-trading/non-mutating safety before any Worker action. The owner explicitly requires STOP if the Production SHA differs. Do not deploy/pull another SHA, modify source/policy/engine, mutate trading database, invoke exchanges/orders/positions/SL/TP/close, or start unrelated services.

## Executive Result

```text
EXPECTED_PRODUCTION_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
OBSERVED_PRODUCTION_MARKER=84f27c2e40b02b0dbf61c58429cf7c45f4f852da
EXACT_PRODUCTION_GATE=FAIL
WORKER_INSTALL_PERFORMED=NO
WORKER_ENABLE_PERFORMED=NO
WORKER_START_PERFORMED=NO
WORKER_SMOKE_EXECUTED=NO
FINAL_CLASSIFICATION=PHASE 5N BLOCKED — WORKER SAFE-IDLE PREREQUISITE NOT VERIFIED; NO WORKER START
```

The first remote prerequisite failed. No substitution with the newly observed SHA was made. No later remote service/source/config/database/health inspection, Worker install/enable/start, live smoke, exchange request or repair occurred. Current Worker state and PP flags were therefore NOT VERIFIED; the previous Phase 5M-C snapshot cannot be reused as today's live evidence.

The new marker is an observed identity mismatch, not proof of an unauthorized deployment, Worker defect or trading mutation. Its publication cause/authorization and current link/process provenance were outside this stopped request and were not investigated. The prior successful Phase 5M-C report remains unchanged.

## Actions Taken / Exact Stop Evidence

1. Read the complete owner Phase 5N attachment, project entry instructions, CLAUDE.md, current AI handoff, latest relevant HANDOFF entries, colleague release boundaries and safe-test runbook. No pull, stash, reset, checkout, stage or source edit; preserve existing dirty HANDOFF/private/untracked work.
2. Read the exact local candidate's Worker entrypoint, existing systemd unit, monitor control flow, pure lifecycle and existing isolated bootstrap test definitions. No test process or production import was executed.
3. Submit a read-only SSH precheck over the previously approved host/port/key route. Put exact marker equality ahead of every service/configuration/database/source command.
4. The marker read returned a different SHA and the shell immediately exited under set -euo pipefail. Everything below that equality test was skipped.
5. Record the stop, recheck only the already-existing local pinned checkout/hash, and create/sanitize/publish this report. No further VPS operation.

The executed remote gate was:

```bash
set -euo pipefail
printf 'REQUIRED_PRODUCTION_MARKER='
cat /var/lib/signalverse-deploy/deployed-sha
test "$(cat /var/lib/signalverse-deploy/deployed-sha)" = '66f3ac2e89d1c40543851c6a9b1f46318d6f6a12'
```

Actual output / result:

```text
REQUIRED_PRODUCTION_MARKER=84f27c2e40b02b0dbf61c58429cf7c45f4f852da
SSH_COMMAND_EXIT_CODE=1
```

This exit is the intended failed identity gate, not a connection failure. The exact remote wall-clock timestamp was not collected after the marker mismatch because the script stopped immediately; 05:57:23Z is the subsequent local stop-record timestamp, not an invented server timestamp.

## Local Source Inspection — Not Current Production Acceptance

The existing clean local checkout's HEAD is exact66f3ac2e89d1c40543851c6a9b1f46318d6f6a12. Its Worker file SHA-256 is:

```text
LOCAL_PINNED_WORKER_SHA256=fa8a6ec35b007515876387eebd04aa31bb0d5c81cb63ad14dcfd744a62aabe17
CURRENT_PRODUCTION_WORKER_HASH=NOT_VERIFIED
```

The local entrypoint contains realpathSync/fileURLToPath/pathToFileURL canonical comparison and fail-closed invalid-path handling. An explicit Worker flag of 1 is required before runtime import. Existing nine bootstrap test definitions exercise canonical/direct/symlink/import/missing/invalid/flag/failure cases using disposable fake runtimes. They were reviewed, NOT run in this stopped task. No existing CI or past test result is substituted for current runtime validation.

Files inspected in the exact local candidate:

- server/futures-profit-protection/worker.mjs, complete entrypoint.
- ops/signalverse-futures-profit-protection.service.
- api/copytrade.ts, PP control/monitor and native observation/reconciliation call sites.
- api/_shared/futures-profit-protection-lifecycle.ts.
- scripts/futures-profit-protection-test.mjs, including all bootstrap fixture/test definitions.
- scripts/futures-profit-protection-adapters-test.mjs, read only; no adapter tests invoked.
- HANDOFF.md, latest relevant Phase 5I-B contract.

### Additional local safety concern requiring fresh verification

In pinned66f3 source, OFF is not a blanket no-I/O/read-only Worker mode. The monitor checks control.available, then reads uncertain close intents in EXIT_SUBMITTED/UNKNOWN regardless of mode OFF. For such an intent it can read an encrypted-account record, perform a native position GET and update the close intent to FLAT_CONFIRMED. Its later position filter also retains phases other than DISARMED/ARMED regardless of the mode flags; lifecycle position/cleanup/reconciliation paths precede the new-trigger allowed check.

Concrete pinned-source paths:

```text
worker.mjs direct entry + FUTURES_PROFIT_PROTECTION_WORKER=1
  -> import .runtime/api/copytrade.mjs
  -> ensureProfitProtectionMonitor(true)
  -> profitProtectionControl()
  -> if control.available
  -> uncertain close-intent lookup
  -> native-position read
  -> possible close-intent reconciliation UPDATE

non-DISARMED/non-ARMED persisted PP record
  -> runProfitProtectionPosition
  -> driveProfitProtection
  -> position / cleanup / reconciliation before allowed() for new trigger
```

This is NOT a claim that an action occurred, or that the newly observed84f27 runtime has identical code. It is why a future safe-idle precheck must examine actual current deployed code and state, rather than equating OFF or empty historical counters with a guaranteed no-action mode. No source fix or disabling of durable reconciliation/protection is authorized or performed here; existing holds must not be erased to obtain a green smoke test.

## Tests / Checks / Scope

| Check | Actual result |
| --- | --- |
| Local exact target identity and clean checkout | PASS |
| Local canonical Worker source contract | Present by inspection only |
| Current Production exact marker gate | FAIL: observed84f27 instead of66f3 |
| Current installed Worker source/unit/drop-in/config | NOT VERIFIED; skipped after stop |
| Current service PIDs/restart counts | NOT VERIFIED; skipped |
| Current REAL_PP/DEMO_PP | NOT VERIFIED; skipped |
| Current read-only PP counts | NOT COLLECTED; skipped |
| Bootstrap regression execution | NOT RUN |
| Worker enable/start/smoke | NOT RUN |
| Database/exchange/order/position action | None performed by this task |

No shell env file, private exchange credential, authenticated trading endpoint or production API bootstrap was loaded/executed. No current database query was issued. No remote directory/file/unit/configuration or authorization storage was changed. The prepared but skipped precheck commands do not count as executed evidence.

## Required Final Fields

Unknown fields are intentionally not filled with the request's expected state or the previous day's snapshot. The zero-action fields describe THIS task; they are not account-wide/trade-history attestations.

```text
PHASE=5N
PRODUCTION_SHA=84f27c2e40b02b0dbf61c58429cf7c45f4f852da (observed marker only)
WORKER_SOURCE_SHA=NOT_VERIFIED_ON_CURRENT_PRODUCTION
WORKER_UNIT=signalverse-futures-profit-protection.service (requested target; current unit not inspected)
WORKER_ENABLED_BEFORE=NOT_VERIFIED
WORKER_ENABLED_AFTER=NOT_VERIFIED; NO ENABLE COMMAND PERFORMED
WORKER_ACTIVE_BEFORE=NOT_VERIFIED
WORKER_ACTIVE_AFTER=NOT_VERIFIED; NO START COMMAND PERFORMED
WORKER_PID=NOT_VERIFIED
WORKER_RESTARTS_BEFORE=NOT_VERIFIED
WORKER_RESTARTS_AFTER=NOT_VERIFIED
WORKER_BOOTSTRAP_TEST=NOT_RUN
WORKER_IDLE_MODE=NOT_VERIFIED
REAL_PP_BEFORE=NOT_VERIFIED
REAL_PP_AFTER=NOT_VERIFIED; NOT CHANGED BY TASK
DEMO_PP_BEFORE=NOT_VERIFIED
DEMO_PP_AFTER=NOT_VERIFIED; NOT CHANGED BY TASK
PP_STATE_MUTATION=NO_BY_THIS_TASK; LIVE COUNTS NOT COLLECTED
PP_CLOSE_INTENTS_CREATED=0_BY_THIS_TASK
PP_CLOSED_RECORDS_CREATED=0_BY_THIS_TASK
DATABASE_MUTATION=NO
EXCHANGE_ACTIONS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_ACTIONS=0
TP_ACTIONS=0
CLOSE_ACTIONS=0
APPLICATION_RESTARTED=NO_BY_THIS_TASK
ADMIN_RESTARTED=NO_BY_THIS_TASK
OBSERVER_RESTARTED=NO_BY_THIS_TASK
POSTGREST_RESTARTED=NO_BY_THIS_TASK
FINAL_CLASSIFICATION=PHASE 5N BLOCKED — WORKER SAFE-IDLE PREREQUISITE NOT VERIFIED; NO WORKER START
```

## Files Changed / Git / Publication

Only this new dated report is added locally. No application source, existing handoff, strategy, risk, engine, policy, tests, workflow, main/candidate branch, Guard, artifact, scheduler, database, exchange settings or runtime changed by this task. No application commit/push; private/untracked work and the earlier successful release report are preserved. Global-ignore permission warnings did not indicate a candidate change and were not repaired.

The report is reviewed for secrets/private data and scanned with the existing pinned AI-Log scanner before report-only publication. Its remote bytes and one-report commit scope are independently verified; the publication commit/link are returned in the final response. No executable application change is published.

## Remaining Prerequisites / Hard Stop

The exact approved runtime prerequisite must be reconciled by the owner before this Worker operation can resume. Do not silently replace the approved66f3 target with84f27, roll back, deploy an older version, investigate/modify the newer runtime beyond scope or start the Worker using old safety evidence. A subsequent authorized request needs the intended current SHA and fresh read-only source/configuration/state evidence proving the requested non-mutating idle contract. Any needed safety-mode implementation requires its own source/release authorization; do not alter durable financial holds or protection/reconciliation to pass a smoke.

No Worker/runtime/PP activation phase followed this blocked report. No live PP effectiveness, execution, latency, profitability or account safety is claimed.
