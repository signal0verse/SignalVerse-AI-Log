# Futures manual-profit re-entry Production rollout

## Metadata and scope

- Date: 2026-10-04, Asia/Kuala_Lumpur. Operational timestamps below are UTC.
- Owner request: activate the already-tested manual-profit re-entry correction.
- Exact source: fca794122a7f235e0a774dbbbb0c6241ce4e10a3.
- Prior runtime/rollback source: c03de74c1d192a991487b4ec530305acb5ece8be.
- Source CI: Production CI 37157890862, exact main/push SHA, success, 42/42 steps. Rechecked before this operation; no new application commit or CI rerun.
- Scope: existing backup procedure, exact admission migration, official retained artifact and release gates. No PP activation, worker start, test trade, exchange request or unrelated source change.

## Current result

BACKUP/RESTORE=PASS. MIGRATION=PASS. POSTGREST=PASS. OFFICIAL_ARTIFACT=PASS. GUARD=PASS/CONSUMED_ONCE. OFFICIAL_RELEASE=PASS. POST_DEPLOY_VERIFICATION=PASS.

Historical checkpoint: the automated approval reviewer initially rejected Guard creation because it required explicit authorization for the exact release SHA and artifact digest. The rejected command did not execute. The owner subsequently explicitly approved ONE fresh Guard and official release for the exact SHA, artifact ID and digest above. No alternative route was used. The evidence below records the successful authorized continuation without erasing the earlier checkpoint.

The application now runs exactly fca794122a7f235e0a774dbbbb0c6241ce4e10a3. The manual-profit re-entry admission contract and matching application analysis/admission code are deployed. This is NOT activation of an automatic Profit Protection close worker, nor evidence of profitability or a tested private-exchange lifecycle.

## Full backup and restore evidence

Used the existing PostgreSQL custom-format pg_dump/pg_restore mechanism. Backup started 2026-10-04T07:40:57.610307Z.

```text
DATABASE=signalverse_cutover2
POSTGRESQL=17.11
BACKUP=/var/backups/signalverse/pre-futures-reentry-fca7941-20261004T074057610307Z.dump
BACKUP_BYTES=163220042
BACKUP_SHA256=12c657060cdf1fb7bdefaf4953f60fcd56d86741676744a5c6e77dc8d36cfaca
BACKUP_OWNER=postgres
BACKUP_MODE=0600
DIRECTORY_MODE=0700
PG_RESTORE_LIST_LINES=1403
DISPOSABLE_RESTORE_DATABASE=sv_reentry_restore_20261004074057
RESTORE_PUBLIC_TABLES=98
RESTORE_COPY_TRADES=1378
RESTORE_EXECUTION_ATTEMPTS=209
```

Full restoration completed using --exit-on-error --single-transaction. The exact migration then passed against the restored real schema. Five functions, two triggers and two indexes were verified. Only the explicitly created disposable database was dropped after validation; the full backup remains on the VPS and can recreate it. No backup contents or account rows were exported to Git. Backup/restore verification finished 07:43:49.772508Z.

## Exact migration

```text
SOURCE=migrations/futures_manual_profit_reentry.sql
LF_SHA256=37933b63213149850f8de45d2c74febda26756495e0dcccfce6bac997a86b03f
STARTED=2026-10-04T07:48:33.292497Z
VERIFIED=2026-10-04T07:48:35.398239Z
RESTORED_AND_PRODUCTION_CATALOG_SHA256=4b8374d6a73c3910384b9cce4c3726a03606d4e8b95500b28eb3f951f4064ba9
FINANCIAL_ROWS_FINGERPRINT=613ede545ce1db249ad1301b002ee104
UNRELATED_SCHEMA_FINGERPRINT=e591b19441bcfacc35ac0ab893192290
```

The first pre-migration attempt stopped before any SQL write because a normal fast-jobs run was active. A read-only wait subsequently observed the separate normal stablecoin collector. Neither job was stopped or modified. After both completed naturally and list-jobs was empty, the unchanged preconditions passed.

Applied the exact migration statements under the existing global deploy lock and a single PostgreSQL transaction. Transaction-local limits: lock timeout 3 seconds, statement timeout 30 seconds, idle-in-transaction timeout 45 seconds. Bounded table locks prevented concurrent writes to the compared financial/PP rows during verification. Source bytes were hash-checked again. Additional transaction-local assertions compared complete financial-row fingerprints and existing schema definitions before COMMIT. Both remained equal; no trade/order/balance/history backfill or DML was issued.

Production function definitions/ACLs, trigger definitions and index definitions produced the same canonical SHA-256 as the restored-schema validation. Existing columns, functions, indexes, triggers and constraints outside the exact new objects remained unchanged in the transaction comparison. Runtime marker and service PIDs/restart counts were unchanged during migration.

Read-only verification at 07:50:16.669403Z confirmed both admission/evidence functions are SECURITY INVOKER; anon and authenticated have no EXECUTE privilege, while service_role does. Both indexes are ready/valid and both triggers enabled.

## Schema-cache/application database path

Issued only NOTIFY pgrst, 'reload schema'; no service restart. Authenticated checks used the existing local database API route and its existing runtime credential without logging the credential.

- OpenAPI HTTP 200; exact admission RPC visible.
- Zero-row copy_trades SELECT: HTTP 200, zero rows read.
- Read-only admission RPC with invalid owner 0: HTTP 200, allowed=false, FUTURES_REENTRY_INVALID_SCOPE. This returns before account lookup; no simulated or real order was created.
- Database DML from checks: none.

## Official immutable artifact

[Preparation run](https://github.com/signal0verse/signalverse-main/actions/runs/37186440413) completed successfully for exact fca7941 on main.

```text
PREPARATION_RUN=37186440413
ARTIFACT_ID=11296794097
EMBEDDED_COMMIT=fca794122a7f235e0a774dbbbb0c6241ce4e10a3
INNER_RELEASE_BYTES=4732954
INNER_RELEASE_SHA256=16a918081b499915c0d57feeef8a9d595399761000fc7415330bd088dcb931bc
OUTER_ZIP_BYTES=4733899
OUTER_ZIP_SHA256=d3560b2ad44ac8a7fbe3238f3b615eca3e50ad7bccbe3e8a90eefc282a3257f1
CANONICAL_GIT_BLOBS_MATCHED=779
REPACKAGING=NO
ARCHIVE_CODE_EXECUTED_DURING_VALIDATION=NO
```

The existing source/bundle verifier checked run/workflow/repository/attempt provenance, exact metadata, digest and embedded commit. An independent second download verified the complete outer ZIP hash/size. All 779 regular tar members matched canonical Git blob hashes with no extraction, duplicate/special/path-traversal entries or missing files. No local alternative archive was made.

## Pre-release runtime and unchanged safety boundaries

At 07:49:47Z, marker and runtime remained c03de74c1d192a991487b4ec530305acb5ece8be. The target approval, claim and incoming archive were independently confirmed absent after the auto-review rejection.

| Service | PID | NRestarts | State |
| --- | --- | --- | --- |
| Application | 3345217 | 0 | active |
| Admin | 3345213 | 0 | active |
| Observer | 3345212 | 0 | active |
| PostgREST | 1960930 | 0 | active |
| Canonical PP worker | 0 | 0 | disabled/inactive |

Local main/admin health passed before migration; admin identified the previous runtime and all readiness flags true. Existing Real/Demo PP control booleans are true and were not changed; their fingerprint remains 411677de88aec39415a53ef1560ff005. The canonical worker remains inactive. These booleans are not evidence of operational automatic PP. Public PP close-intent count remained 0 at the observed checkpoint.

Installed Guard/control code was read, not changed. Integrity baselines:

```text
RECEIVER=c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa
AUTHORIZATION_HELPER=acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83
COORDINATOR=928eefc39677fe27242f8d2762d7fb3de97bebd2ff8678c20e86ff22188ce308
RECEIVER_UNIT=7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1
ARTIFACT_UNIT=1a95022b391deba37bb3b161c6526fc4423f6966904177a8653e5284e52d82a4
```

## Authorized Guard and official release

Immediately before creation, authenticated remote main and successful main/push CI were rechecked. The exact retained artifact was independently downloaded/hash-checked again; source metadata and embedded commit passed. PostgREST readiness passed again. No artifact was rebuilt or repackaged, and the successful migration/backup were not repeated.

Exactly one fresh root-owned approval was created through the existing out-of-band manifest mechanism under the global deploy lock, then read back with the installed authorization helper. Exclusive file creation, fsync and no-overwrite hard-link publication preserved one-shot semantics. Target approval/claim/incoming paths were absent, stores were root:root 0700, and no deploy job was queued. No installed Guard code changed.

```text
GUARD_UUID=ea258042-8b6b-4761-ac41-60aee1ad6cee
GUARD_SHA=fca794122a7f235e0a774dbbbb0c6241ce4e10a3
GUARD_DIGEST=16a918081b499915c0d57feeef8a9d595399761000fc7415330bd088dcb931bc
ISSUED_AT=2026-10-04T07:54:40Z
EXPIRES_AT=2026-10-04T08:54:40Z
OWNER_MODE=root:root 0600
MANIFEST_SHA256=a41b19e112ac0539bab7bd6ab099d3edbe5e1066e7b2949d5f39ec08c94a6199
INITIAL_STATE=VALID_UNUSED_UNCLAIMED
RELEASE_RUN=37187229473
RELEASE_JOB=111391652801
RELEASE_CREATED_AT=2026-10-04T07:54:52Z
RELEASE_JOB_STARTED_AT=2026-10-04T07:54:57Z
RELEASE_JOB_COMPLETED_AT=2026-10-04T07:57:04Z
RELEASE_RESULT=SUCCESS
RELEASE_STEPS=11_SUCCESS_0_FAILED_0_SKIPPED
GUARD_CONSUMED_AT=2026-10-04T07:56:55.592444Z
ACTIVATION_PASS_AT=2026-10-04T07:57:02.893071Z
FINAL_GUARD_STATE=CONSUMED_ONCE_CLAIM_ABSENT_NOT_REVOKED
```

Invoked only the existing `production-release.yml` on main with sha=fca7941, artifact_run_id=37186440413, artifact_id=11296794097 and the exact approved digest. [Official release run](https://github.com/signal0verse/signalverse-main/actions/runs/37187229473). All 11 reported steps succeeded, including exact CI, retained provenance, download, complete-byte verification and delivery through OIDC/Guard. Normal coordinator activation restarted only app/admin/observer as required. No manual copy/deploy or service restart command was used.

## Post-deploy independent verification

Read-only verification completed 2026-10-04T07:58:34.437692Z:

- Marker, app release symlink, admin release symlink and running app/admin/observer cwd all identify exact fca7941.
- Delivered incoming archive SHA-256 equals the approved digest. All 779 regular archive source files match active release bytes with zero mismatches.
- Consumed Guard record has the exact UUID/SHA/digest and unchanged manifest SHA-256. Active SHA claim is absent. Installed receiver/helper/coordinator/unit hashes all match the pre-release baselines above.
- Both deployed analyze and copytrade API bundles contain the new admission RPC and fail-closed evidence marker.
- Migration catalog SHA-256 remains 4b8374d6a73c3910384b9cce4c3726a03606d4e8b95500b28eb3f951f4064ba9. Migration was not replayed.
- PostgREST authenticated OpenAPI, zero-row SELECT and invalid-owner read-only admission RPC passed again after release. No application/account/order test was invoked.
- Local app health, public-info, admin health, public health and public homepage all returned HTTP 200. Admin releaseSha is exact target; ok/authReady/snapshotReady/staticReady/databaseReady all true.
- Artifact unit exited successfully with ExecMainStatus=0, inactive/dead after completion. Journal independently records authorization validation/consume PASS and exact-SHA activation PASS.

| Service | Before PID | After PID | NRestarts after | Final state |
| --- | --- | --- | --- | --- |
| Application | 3345217 | 3416055 | 0 | active/running; started 07:57:01Z |
| Admin | 3345213 | 3416012 | 0 | active/running; started 07:56:55Z |
| Observer | 3345212 | 3416011 | 0 | active/running; started 07:56:55Z |
| PostgREST | 1960930 | 1960930 | 0 | active/running; not restarted |
| Guard receiver | 2210596 | 2210596 | 0 | active/running; not restarted |
| Canonical PP worker | 0 | 0 | 0 | disabled/inactive; never started |

The first read-only postdeploy verifier stopped at its PP control checksum assertion: it incorrectly used md5(jsonb_agg(to_jsonb(row))::text), while the earlier baseline used md5(string_agg(row_to_json(row)::text,'')). Independent aggregate inspection proved the original row checksum is still exactly 411677de88aec39415a53ef1560ff005; real_enabled=true and demo_enabled=true remain unchanged, with updated_at still 2026-10-01T22:02:54.495Z. Only the disposable local verifier's serialization method was corrected; the expected checksum and Production state were not changed. The complete verifier then passed. Public PP close-intent count remains 0. Existing true control booleans must NOT be described as flags OFF or as evidence of operational automatic PP.

A second complete read-only stability check finished 2026-10-04T07:59:52.080135Z. All post-activation PIDs were unchanged, every NRestarts remained 0, health/readiness checks passed, all 779 source files still matched, schema/control fingerprints were unchanged and the canonical PP worker remained disabled/inactive/PID 0. This is a bounded postdeploy observation, not continuous monitoring.

## Functional scope and evidence limits

In standard Futures copy-trading, a durably recorded full profitable manual close consumes the previous setup for that user/mode/coin. A continuation signal alone, a timer, changed timeframe/direction/venue or a new analysis ID cannot rearm entry. A later fully evidenced native-closed-candle raw WAIT reset, followed by a new qualifying setup, is required. Missing evidence fails closed. Existing positions/protection remain managed by their existing paths; Fast Trader, Whale and separate Partner behavior are outside this correction.

Already-completed acceptance evidence is not rerun or misrepresented as live execution: local focused 129/129, regression 233/233, disposable SQL 61/61 including repeated Real denials, preserved historical negatives, zero introduced TypeScript diagnostics, Web/Admin/API build PASS. Exact main/push Production CI 37157890862 passed 42/42 steps. No real trade was manufactured to prove the re-entry scenario; naturally occurring lifecycle behavior and profitability are not claimed verified.

## Files, publication and remaining limits

Application source/main/history were unchanged in this activation phase. Disposable local operator scripts under tmp/ performed backup/restore, bounded migration, schema/artifact verification, the authorized single Guard creation and read-only postdeploy checks. No script was installed as a new Production runtime or deployment route. The primary checkout's pre-existing HANDOFF and unrelated/untracked work were preserved; the source release already contains its implementation handoff. Candidate tracked worktree remains clean.

Only this sanitized report is published to SignalVerse-AI-Log/master; previous status/failure receipts and unrelated local work remain preserved. Publication identity and remote byte verification are recorded separately in the conversation.

No further activation step is required for the deployed re-entry correction. Automatic PP worker/close activation remains outside this authorization. Do not reapply the migration, rebuild the artifact, issue another Guard or manufacture a trade.

```text
APPLICATION_CODE_CHANGED=NO
MAIN_CHANGED=NO
PRODUCTION_MIGRATION=YES
PRODUCTION_FINANCIAL_DML=NO
ARTIFACT_PREPARED=YES
GUARD_CREATED=ONE_EXACT_APPROVAL
RELEASE_EXECUTED=YES_OFFICIAL_ONLY
DEPLOYMENT=PASS
DEPLOYED_SHA=fca794122a7f235e0a774dbbbb0c6241ce4e10a3
ROLLBACK_SOURCE=c03de74c1d192a991487b4ec530305acb5ece8be
MIGRATION_REAPPLIED=NO
WORKER_STARTED=NO
PP_FLAGS_CHANGED=NO
EXCHANGE_ACTIONS_BY_TASK=0
ORDERS_BY_TASK=0
POSITIONS_CHANGED_BY_TASK=0
SL_TP_CHANGES_BY_TASK=0
CLOSE_ACTIONS_BY_TASK=0
FINAL_CLASSIFICATION=FUTURES_REENTRY_PRODUCTION_RELEASE_PASS
```

Zero-action statements describe this task. Normal autonomous activity was not paused; no whole-account exchange audit was performed. Source/SQL correctness and technical rollout do not prove profitability or resolve independent delayed-close PP lifecycle safety.
