# Continuous Auto Scanner refresh diagnosis

## Metadata

- Date: 2026-10-03, client timezone Asia/Kuala_Lumpur (UTC+08:00).
- Task: investigate the owner's screenshot and failure of automatic list updates.
- Mode: READ-ONLY diagnosis; documentation only.
- Application workspace: codex/prediction-coverage-expansion-audit, HEAD 0dbca62357a4adf34240f40ceda3e387356ec4b0.
- Observed Production runtime: a9d43d676911cbe947af0d0c1ec080031a4151ab.
- Evidence collection: server UTC 2026-10-03T15:49:58Z to 15:51:17Z (client 23:49:58 to 23:51:17).

## Objective and scope

Determine why the Futures Market Discovery panel and automatically maintained coin list do not continue updating. No scanner invocation, profile change, exchange request, deployment, service operation, database mutation or application implementation was authorized or performed.

## Executive finding

CONFIRMED: the existing five-minute timer is healthy, but the independent futures-discovery-cron-tick gate is OFF. Natural job invocations explicitly skip the scanner. Enabled user profiles do not override this server gate.

CONFIRMED: the deployed Discovery panel does not periodically reload its displayed scan. Even after backend scanning is restored, its timestamp/candidate cards remain a snapshot until a manual reload, venue selection, profile save or component remount. The Pro setup list has a separate sync-event reload; it must not be confused with the Discovery cards.

CONFIRMED: the scan matching the screenshot succeeded. It is not evidence of a failed market-data scan.

## Actions taken and exact evidence

### Scheduler and runtime

Read-only SSH inspected the deployed-sha marker, app release symlink, installed job runner, timer/service metadata and scanner-only journal lines. No API action was invoked.

- Marker and /opt/signalverse/app resolved to a9d43d676911cbe947af0d0c1ec080031a4151ab both before and after the diagnostic checks.
- signalverse-fast-jobs.timer: active/waiting, last trigger 2026-10-03T15:45:05Z; next trigger 15:50:03Z at the first snapshot. The fast service had finished with Result=success, ExecMainStatus=0.
- /etc/signalverse/jobs.d/futures-discovery-cron-tick.enabled: absent.
- Six observed natural invocations logged skipping at 15:20:56, 15:26:00, 15:30:55, 15:35:51, 15:40:56 and 15:46:06 UTC.
- Exact relevant journal message: futures-discovery-cron-tick not enabled (jobs.d/futures-discovery-cron-tick.enabled missing); skipping
- The installed /usr/local/libexec/signalverse-jobs lines 70–74 contain one gated invocation using the existing authentication pattern.
- Timer inventory showed the existing signalverse-fast-jobs.timer, not a second scanner timer. This was not an exhaustive audit of all possible external schedulers.

### Database evidence

Only bounded aggregate SELECTs were performed in BEGIN READ ONLY, with statement_timeout=5s, lock_timeout=2s. current_database()=signalverse_cutover2 and transaction_read_only=on.

| Measurement | Result |
| --- | --- |
| Enabled Demo Binance profiles | 5 |
| Enabled Real Binance profiles | 1 |
| Active discovery setup rows, Demo | 14 |
| Active discovery setup rows, Real | 8 |
| Runs in the preceding 30 minutes | 1 |
| Latest run as_of | 2026-10-03T15:42:26.629Z |
| Latest run created_at | 2026-10-03T15:42:54.211635Z |
| Latest run status | OK |
| Universe / deep shortlist | 521 / 125 |
| Long / Short candidates | 3 / 2 |
| Run errors | 0 |
| Previous run as_of | 2026-10-02T21:39:53.040Z |

The latest run's client-local time is 2026-10-03 23:42, matching the screenshot's date, time, 521 contracts and 125 deep checks. Existing records do not label this run's trigger, so its manual origin is not claimed as independently logged. The deployed gate/journal prove periodic cron scanning was skipped during the observed window.

### Deployed source and UI behavior

The two deployed source files were independently hashed with git hash-object and matched the corresponding blobs of the observed runtime SHA:

- src/app/App.tsx: f29744a75414173a0653a11c415ff22fc820f5ed
- api/copytrade.ts: 0d8741a9592974bc27b043f72aeef20636dd2a93

The complete FuturesDiscoveryPanel slice is unchanged between the working source and the deployed commit; SHA-256 946005abd729afb5890bab9dc29b679457f499258740db7bff29a4bb4180fe15. Static inspection found no interval, copytrade-sync listener, visibility or focus refresh in that component.

Call chains:

- Scan button → load(true) → POST futures-discovery-refresh. The endpoint reuses the existing result until its as_of is at least five minutes old. A second click inside that interval need not produce a new timestamp.
- Initial display → load(false) → GET futures-discovery. The initial useEffect runs only when data is absent; it does not re-fetch an existing snapshot on a clock.
- Enable/save auto-add → set-futures-discovery-profile. This persists a profile and can scan immediately; it does not create the independent VPS gate.
- Existing timer → job_enabled(futures-discovery-cron-tick) → authenticated cron handler → enabled profiles → scan → list maintenance. Execution stops at the absent gate.
- Pro setup list → sv-copytrade-synced → loadEntries. Discovery cards have no corresponding listener.

The previously fixed cron/as_of phase tolerance of 60 seconds is present in deployed source. The earlier cadence defect is not the reason for the current explicit gate skip.

## Files inspected

AGENTS.md, CLAUDE.md, latest HANDOFF.md entries, docs/AI_HANDOFF.md, docs/COLLEAGUE_HANDOFF_2026-09-29.md, TRADING_STRATEGY.md, docs/testing/stability-test-runbook.md, docs/futures-auto-scanner-continuous-2026-09-30.md, src/app/App.tsx, api/copytrade.ts, deploy/prediction/signalverse-jobs.sh, migrations/futures_market_discovery.sql, migrations/futures_discovery_profile_margin_mode.sql, dated controlled-verification and Production-release reports in the existing AI-Log checkout. Deployed counterparts, marker/symlink, journal and aggregate scanner tables were inspected as detailed above.

## Changes and validation

Only this report and an additive HANDOFF entry were authored. No application source, strategy, scanner algorithm, scheduler, profile, credential or Production setting changed.

No build, full regression suite, browser click, live scanner test or exchange test was performed. The static component check first exceeded Node's default child-process output buffer; rerunning the same read-only check with an explicit bounded 16 MiB buffer succeeded. This is diagnostic tooling, not an application fix.

No application commit/push, CI, artifact, Guard, release, restart, schema/data write or order/position/SL/TP action was performed. Normal unrelated Production activity was not suspended and is not claimed to be zero.

## Remaining issues and recommended next step

Repair is NOT IMPLEMENTED. A separately authorized narrow follow-up should distinguish:

1. Read-only UI refresh of Discovery results and clear indication of cached results versus a new scan.
2. Owner-approved activation of the existing independent scanner gate, with a bounded verification of two natural ticks.

The current gate would process all six enabled profiles, including one Real profile. Do not silently enable it as part of diagnosis or describe it as a Demo-only change. Scanner itself has no direct order/close call in the inspected maintenance path, but updated Real setup rows feed the existing Futures analysis/execution gates. Valid candidates must remain; unchanged symbols after a scan alone do not indicate failure.

Private account identifiers, credentials, detailed trade rows and database exports were neither published nor needed. App-source provenance was verified; no live browser-network trace or independent exchange-state audit was performed.

Final classification: CAUSE FOUND; CONTINUOUS SCANNING NOT ACTIVE; UI AUTO REFRESH MISSING; NO REPAIR OR ACTIVATION PERFORMED.

