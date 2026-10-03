# Auto Scanner five minute activation and natural verification

## Metadata

- Date: 2026-10-04 in Asia/Kuala_Lumpur, UTC+08:00. Server evidence is dated 2026-10-03 UTC.
- Task: activate the existing Futures automatic scanner without changing its strategy or Engine.
- Mode: one authorized operational gate change, followed by bounded read-only verification.
- Application branch: codex/prediction-coverage-expansion-audit.
- Application HEAD before and after: 0dbca62357a4adf34240f40ceda3e387356ec4b0.
- Production runtime before and after: a9d43d676911cbe947af0d0c1ec080031a4151ab.
- Server evidence: precheck 2026-10-03T16:22:29Z; DB baseline 16:24:34.221918Z; final DB 16:33:16.019862Z; final runtime 16:33:18.338483959Z.

## Objective and authorization

The owner clarified that the already-written scanner strategy must remain unchanged. Every five minutes, existing qualified candidates should remain; invalid candidates should retire according to the existing rules; qualified replacements should fill available capacity. No new minimum-residence or first-analysis guard was requested.

This supersedes the proposed additional analysis-opportunity condition recorded in the preceding preactivation report. That historical report is preserved, not rewritten or relabeled. No such new guard was implemented or claimed.

The enabled profile inventory was five Demo Binance profiles and one Real Binance profile. The gate activates existing profile maintenance for all six, not a Demo-only test. No profile, Real trading gate, account, strategy, execution or protection setting was changed.

## Executive result

PASS: the existing independent scanner gate is ON, and two natural five-minute scheduler executions produced separate successful Binance runs. Actual persisted list maintenance retired an invalid candidate, admitted a qualified replacement, and preserved the resulting list on the second tick.

Only the gate file was created. No application code, scanner algorithm, timer, service unit, database schema or strategy was changed. The gate remains ON for ongoing automatic scanning.

This is backend scanning/list-maintenance verification, not profitability, exchange-execution acceptance, or a fix to the Discovery panel's separate display-refresh limitation.

## Exact operational change

Created this existing control-plane gate at 2026-10-03T16:25:44.887483633Z, client-local 2026-10-04 00:25:44.887:

- Path: /etc/signalverse/jobs.d/futures-discovery-cron-tick.enabled.
- Owner/group: root:signalverse.
- Mode: 0644.
- Size: 0 bytes.
- SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.

The parent directory already existed as root:signalverse, mode 0755. The target was absent and not a symlink. The approved mutation was exactly:

```sh
install -o root -g signalverse -m 0644 /dev/null /etc/signalverse/jobs.d/futures-discovery-cron-tick.enabled
```

The first attempted pre-mutation guard check used the wrong marker path, /opt/signalverse/deployed-sha. It failed before reaching install. Read-only source/runbook inspection resolved the correct path, /var/lib/signalverse-deploy/deployed-sha. The retry checked the exact current marker and installed job-runner hash before creating the gate. No mutation occurred in that failed precheck.

No directory, timer or alternate scheduler was created. No service was started, stopped, enabled, disabled or restarted by the agent. The existing 16:25 timer execution was already running when the gate was created; it reached the scanner afterward and produced the first run.

## Existing execution flow and preserved rules

Existing signalverse-fast-jobs.timer
→ /usr/local/libexec/signalverse-jobs fast
→ existing independent gate
→ existing authenticated futures-discovery-cron-tick handler
→ futuresDiscoveryTick
→ runFuturesDiscoveryScanCoalesced
→ applyFuturesDiscoveryToProfiles
→ maintainFuturesDiscoveryRows.

The existing job runner uses the existing authentication pattern. No credential was printed, read from an environment file, changed or supplied by the agent, and no manual scanner/cron API request was issued.

Unchanged behavior in the exact deployed source:

- Existing candidates that remain targets are retained; metadata refresh does not advance updated_at, preserving the Engine's existing rotation behavior.
- Eligible candidates that fall outside the current ranked shortlist are retained.
- Missing/unavailable evidence does not cause speculative retirement.
- Open-position symbols are not retired by this maintenance path; it does not close their positions.
- Explicit invalidation, such as SCORE_BELOW_MINIMUM, can retire discovery-sourced rows without an open position.
- New candidates must be in the existing qualified candidate pool and pass the existing mode suitability/capacity/cooldown checks.
- Manual rows retain priority and are never selected for discovery retirement.
- No age-only retirement, forced weak candidate, new first-analysis rule, new PP policy or Engine change was introduced.
- The scanner has no direct exchange order/close call in the inspected maintenance path. Updated Real setup rows can subsequently feed the existing Engine/execution gates; these existing downstream gates were not changed or independently tested here.

## Natural tick evidence

No manual invocation or timer restart was used.

| Evidence | Tick 1 | Tick 2 |
| --- | --- | --- |
| Timer/service start UTC | 2026-10-03T16:25:02Z | 2026-10-03T16:30:02Z |
| Scan run ID | 2eac37a8-3077-4d4a-869d-fca989ad4fcf | 1ab4d3d8-a2ad-4a97-9711-66e8674cec41 |
| Scan as_of UTC | 2026-10-03T16:25:56.130Z | 2026-10-03T16:30:55.802Z |
| Run persisted UTC | 2026-10-03T16:26:24.126563Z | 2026-10-03T16:31:24.774792Z |
| Service finished UTC | 2026-10-03T16:26:57Z | 2026-10-03T16:32:10Z |
| Run status | OK | OK |
| Universe / deep shortlist | 521 / 129 | 521 / 129 |
| Long / Short candidates | 2 / 3 | 2 / 3 |
| Recorded scan errors | 0 | 0 |
| Service exit | success, status 0 | success, status 0 |

The scan as_of interval is 299.672 seconds. The existing timer is OnCalendar=*-*-* *:0/5:00 with its unchanged accuracy/random-delay settings. At final verification it was active/waiting, with the next scheduled invocation at 16:35:02Z.

The independent unit journal shows both starts and successful finishes. Scanner failure-message filtering of the application journal returned no matching failure during the bounded verification window. This is not an assertion that all unrelated application logs are error-free.

## Actual candidate maintenance

Counts are setup rows across multiple profiles, not unique coins or trades.

| Measurement | Before activation | After tick 1 | After tick 2 |
| --- | --- | --- | --- |
| Active Discovery rows, Demo | 14 | 14 | 14 |
| Active Discovery rows, Real | 8 | 8 | 8 |
| Deleted Discovery rows, Demo | 35 | 40 | 40 |
| Deleted Discovery rows, Real | 14 | 15 | 15 |

Observed retirement:

- WLD retired from five Demo rows and one Real row.
- All six carry retiredBy=discovery and retiredReason=NOT_CANDIDATE:SCORE_BELOW_MINIMUM.
- Demo retirement timestamps: 16:26:25.468Z through 16:26:26.004Z.
- Real retirement timestamp: 16:26:25.569Z.

Observed replacement:

- OPEN admitted as SHORT with the unchanged scanner score 60.
- Five Demo rows were created, first at 16:26:25.514456Z; one Real row at 16:26:25.677587Z.
- All six are still active after tick 2.
- Exact latest-run symbol/direction/discoveryScore membership check: 6 new rows / 6 exact qualified-candidate matches.
- No new setup creation and no Discovery retirement occurred after the second service start, through final DB verification. The second scan therefore did not churn the list solely because another five minutes elapsed.

Retention evidence:

- Nine pre-existing Demo rows and seven pre-existing Real rows remained active: 16 retained preactivation rows.
- After tick 1, 10 Demo and 5 Real active rows carried that fresh run ID.
- After tick 2, the same 10 Demo and 5 Real active rows carried the second run ID. These are durable evidence of refresh/revalidation, not a reused status-only claim.
- The other seven active rows were retained but were not assigned the fresh top-candidate run ID. Their exact per-row keep branch was not separately classified; do not label all retained rows as independently proven fresh top-ranked candidates.
- Metadata run IDs on retained rows are intentionally overwritten by the next successful refresh. The tick-1 membership counts above were captured before tick 2, not reconstructed from the final metadata.

Both natural runs contained the same eligible five-symbol pool:

| Symbol | Direction | Score |
| --- | --- | --- |
| ZRO | LONG | 66 |
| ATH | LONG | 50 |
| OPEN | SHORT | 60 |
| BR | SHORT | 57 |
| PONS | SHORT | 52 |

This confirms qualified retention and a real invalidation/replacement event without modifying thresholds or manufacturing invalid market conditions.

## Profile and runtime preservation

The full-profile snapshot was hashed server-side without exporting private profile records. The before/after snapshot hashes matched; all six profile settings, including enabled state, remained unchanged.

| Runtime evidence | Before | After |
| --- | --- | --- |
| Production marker and app release | a9d43d676911cbe947af0d0c1ec080031a4151ab | same |
| Deployed api/copytrade.ts Git blob | 0d8741a9592974bc27b043f72aeef20636dd2a93 | same |
| Installed job runner SHA-256 | e5065de3cca0911815cbab94bfdfa8187d4f26578372e5481690ff6dff46e0c9 | same |
| Main PID / NRestarts | 3275208 / 0 | same, active |
| Admin PID / NRestarts | 3275171 / 0 | same, active |
| Observer PID / NRestarts | 3275169 / 0 | same, active |
| Scanner gate | absent, OFF | present, ON |

Only the existing fast-jobs timer was found in the targeted SignalVerse scanner/fast-timer inventory. No duplicate scheduler was created. This is not an exhaustive claim about every possible external scheduler.

No application deployment, source push, CI, artifact, Guard, migration, manual SQL DML or profile rewrite was performed. Read-only SQL used BEGIN READ ONLY with statement_timeout=5s and lock_timeout=2s. Expected automated setup insert/retirement/metadata writes did occur through the existing scanner, as requested; they must not be mislabeled as zero database mutation.

Direct agent exchange API calls, order actions, position actions, SL/TP changes and close actions: 0. Normal existing Production activity was not paused. Zero global trading activity or unchanged private exchange state was not audited and is not claimed. Source inspection proves the scanner-maintenance branch has no direct order or position-close execution.

## Files inspected and changed

Relevant existing sources and records inspected:

- Exact deployed commit api/copytrade.ts, especially scan coalescing, cron phase tolerance, profile application and candidate maintenance.
- deploy/prediction/signalverse-jobs.sh and the installed runner.
- Existing signalverse-fast-jobs.timer, service metadata and bounded unit/application journals.
- docs/futures-auto-scanner-continuous-2026-09-30.md.
- Previous diagnosis/preactivation reports, HANDOFF.md, and the existing report template.
- Bounded persisted futures_discovery_profiles, futures_discovery_runs and futures_pro_setups evidence.

Application source/test/workflow changes: NONE.

Operational file added: /etc/signalverse/jobs.d/futures-discovery-cron-tick.enabled only.

Documentation added: reports/futures/auto-scanner-five-minute-activation-2026-10-04.md, mirrored to SignalVerse-AI-Log; additive HANDOFF.md entry. Prior documentation and unrelated/private work are preserved.

## Validation and publication

Operational validation: two natural scheduler ticks, successful independent run/journal evidence, persisted retirement/replacement/retention, unchanged profile snapshot, deployed source hash and primary PIDs.

No build or offline regression suite was rerun because no executable file changed. This is not a new strategy acceptance test.

Application commit: NONE. Application push: NO. AI-Log report-only publication is separately verified after report creation; its receipt is recorded in HANDOFF and the final response. No application runtime publication occurred.

## Remaining limitation

The Discovery candidate cards/timestamp have a separate known UI snapshot behavior. This task did not add interval/focus/sync fetching or deploy a UI change. Reopening/reloading the Discovery panel can show the newer persisted scan; the Pro setup list has its existing sync-event reload. Do not equate the active backend scanner with a claim that the currently open Discovery cards now automatically refresh.

The Engine's existing per-tick analysis limits and risk/execution behavior remain unchanged. This work does not guarantee every candidate is analyzed within five minutes, prevent all losses or prove profitability.

## Final status

AUTO SCANNER FIVE MINUTE BACKEND = ACTIVE AND VERIFIED
EXISTING STRATEGY AND ENGINE = UNCHANGED
GATE = ON
NATURAL TICKS VERIFIED = 2
PROFILE CHANGES = 0
APPLICATION DEPLOYMENT = NO
NEW SCHEDULER = NO
UI DISPLAY AUTO REFRESH FIX = NOT IMPLEMENTED
