# Futures manual-profit re-entry deployment status

## Metadata and objective

- Date: 2026-10-04, Asia/Kuala_Lumpur.
- Live runtime evidence: 2026-10-04T07:36:29Z (15:36:29 local).
- Request: determine whether the completed re-entry fix has actually deployed.
- Scope: read-only source/CI/runtime/schema checks; documentation-only receipt.

## Confirmed result

The fix is committed and on remote main, with successful official CI, but it is NOT deployed. The required Production migration is also absent.

```text
REMOTE_MAIN=fca794122a7f235e0a774dbbbb0c6241ce4e10a3
CI_RUN=37157890862
CI_SHA=fca794122a7f235e0a774dbbbb0c6241ce4e10a3
CI_EVENT=push
CI_RESULT=success
PRODUCTION_MARKER=c03de74c1d192a991487b4ec530305acb5ece8be
APP_SYMLINK_SHA=c03de74c1d192a991487b4ec530305acb5ece8be
ADMIN_SYMLINK_SHA=c03de74c1d192a991487b4ec530305acb5ece8be
APPLICATION_SERVICE=active
APPLICATION_PID=3345217
DATABASE=signalverse_cutover2
AUDIT_TRANSACTION_READ_ONLY=on
REENTRY_ADMISSION_RPC_PRESENT=false
REENTRY_TRIGGER_COUNT=0
```

Evidence: authenticated git ls-remote; GitHub run API; existing official SSH route; deployed-sha and both resolved release symlinks; systemctl show; bounded PostgreSQL catalog SELECT inside BEGIN READ ONLY / ROLLBACK. No trade/account rows or exchange endpoints were queried.

The catalog check used the exact public.futures_reentry_admission_v1(bigint,text,text,text,text,text,uuid) signature and the two migration trigger names. No migration or runtime activation was inferred from source publication.

## Checks, changes and remaining work

All status queries completed successfully. Tests/builds were not rerun for this read-only question. [Prior source and 42/42-step CI receipt](futures-manual-profit-reentry-source-ci-2026-10-04.md) retains the implementation evidence. [Official CI run](https://github.com/signal0verse/signalverse-main/actions/runs/37157890862).

Only this documentation report was added. No application commit, deployment, database mutation, worker start, flag change, exchange call, order action, position action or SL/TP change occurred during this check. Normal live activity was not paused or audited as task-created activity.

Remaining rollout gates: approved backup/restore verification, exact re-entry migration and PostgREST verification, official retained artifact and independent Guard, official release, then post-deployment verification. The new re-entry behavior cannot yet be claimed active in Production.

This report is published to SignalVerse-AI-Log/master; remote content and publication identity are verified separately. Existing historical receipts and unrelated local notes are preserved.
