# Futures pending entry freshness and premature analysis lock

## Metadata

- Date: 2026-10-12
- Task ID: futures-pending-stale-diagnostic-20261012
- Module: standard owned Futures analysis / pending entry
- Mode: read-only diagnosis and isolated regression checks
- Repository: signalverse-main
- Branch: codex/admin-futures-access-20261012
- Starting / ending application commit: ef1324ef13351463e016c0b3fcfc835ab4850bb3

## Objective

Explain a pending Futures entry rejected with FUTURES_ENTRY_DECISION_STALE. Private account identifiers, trade timestamps, symbols, prices and database extracts are omitted from this public report.

## Scope

Read the current application source and narrowly scoped existing database metadata. No provider request, order, analysis command, configuration change, database mutation or deployment.

## Actions Taken

Verified the active core release. Read existing pending status, linked decision timing, execution-attempt presence, matching signal-lock state and recorded trade count under an exact account ownership predicate. Cross-checked the source's freshness admission and automatic analysis path. Ran the existing isolated pure-helper regression suite.

## Files Inspected

- api/_shared/futures-entry-freshness.ts
- api/analyze.ts: findAnyOpenLock, analyzeOneCoinPro and upsertPendingSignal
- api/copytrade.ts: activateRealPendingTrade, pending activation and futuresProWatchTick
- server/partner-copytrade/service.ts and database.mjs
- scripts/futures-entry-freshness-test.mjs
- applicable contributor instructions, strategy history and safe-test runbook

## Files Changed

NONE in the application. This sanitized diagnostic report is the only publication.

## Root Cause / Findings

CONFIRMED: the linked decision's computation was older than the existing ten-minute entry ceiling when pending activation ran. Its computation/persistence timestamps were valid and ordered. Entry failed before the durable exchange submission attempt was created, with no resulting recorded trade.

CONFIRMED: an OPEN signal_locks row had already been written at analysis time despite no recorded trade. analyzeOneCoinPro treats that lock as an open position and returns LOCKED before generating another decision. The inspected time window contained no replacement decision before the rejected entry. The automatic worker revisits the setup through this same analysis function.

The resulting mismatch is between a pre-execution signal lock that blocks refreshed analysis and a final admission gate that correctly refuses outdated evidence. The screenshot's failure is not an exchange order rejection. It does not establish an API-credential, balance or leverage failure.

## Implementation

NONE. Do not remove the freshness gate or reuse an uncertain execution identifier as a workaround.

## Tests Executed

- node --test scripts/futures-entry-freshness-test.mjs: PASS, 100 tests / 0 failures.
- Existing read-only database metadata/source cross-check: confirmed the sequence above. One initial lock query referred to an unavailable historical timestamp column and failed without mutation; the corrected read selected only existing columns and succeeded.

The pure-helper suite validates admission behavior, including a stale decision on a still-current 4h candle. It is not a new end-to-end test of a lock-lifecycle repair; no repair was made.

## Build Result

Not run: application source unchanged.

## Git Status / Commit

No application commit, push or release. Existing untracked output was preserved. Only this documentation report is published to SignalVerse-AI-Log.

## Remaining Issues

Premature OPEN analysis locks can prevent fresh pending-entry analysis. Pending rows also retain a longer monitoring window than the final decision admission lifetime. The safe lifecycle correction needs separate implementation and regression validation.

## Risks / Limitations

Observations describe stored application records, not a live private-exchange reconciliation. No exchange action or account reset was used to diagnose this issue. Independent reads do not constitute an atomic snapshot across unrelated operator changes.

## Recommended Next Step

Separate pending-analysis ownership from confirmed open-position ownership. Revalidate an unsubmitted pending entry through the same native engine using current closed candles and current candidate authority; admit only a newly approved decision. Preserve PREPARED/SUBMITTED/UNKNOWN holds, duplicate-entry protection, supervisor checks, sizing gates and existing exits. Test these transitions before any owner-approved release.
