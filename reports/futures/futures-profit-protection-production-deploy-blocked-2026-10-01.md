# Futures Profit Protection — Production deployment preflight / worker environment blocker

## Metadata / objective / scope

- Date: 2026-10-01 (UTC).
- Task: exact-SHA Futures PP infrastructure rollout; keep Real PP OFF.
- Application repository/branch: signal0verse/signalverse-main / main.
- Frozen source commit: 9de1fb13966bb4b2c76dc8efa6a21334d86aacdf.
- Publication repository/branch: signal0verse/SignalVerse-AI-Log / master.
- Publication starting commit: e1ca0ceaf6181eaa01dde48b11396bb0dc95d307.
- Publication ending commit: the documentation commit containing this report;
  its exact SHA and remote blob verification are returned in the conversation.
- Allowed: approved backup, additive PP migration, official exact release and
  reviewed worker infrastructure, plus the separately confirmed exact Guard manifest.
- Prohibited: source/strategy changes, PP enablement, manual application deployment,
  exchange actions, existing position/protection changes or improvised repairs.

## Executive result

**PRODUCTION DEPLOY BLOCKED — REVIEWED WORKER ENVIRONMENT MISMATCH.**

The owner authorized the exact Production infrastructure rollout, with Real PP
remaining OFF and no trading actions. The exact source/CI/artifact gates passed;
the owner separately confirmed the exact SHA/digest Guard issuance. A private
verified database backup and the exact additive PP migration completed. PostgREST
schema visibility and authenticated zero-row application-role reads passed.

Before official application release or worker installation, preflight found that
the reviewed worker unit reads a DIFFERENT environment file from the actual main
service. That worker file contains neither required DATABASE variable. Mutating
deployment work stopped; the cause was diagnosed read-only. No unit override,
source correction, application delivery/activation or worker start was improvised.

At final VPS evidence collection **2026-10-01T11:37:18–11:37:19Z**, the application,
admin and observer remained on the existing release; all four existing services
were healthy with unchanged PIDs and restart counts. PP mode switches were both
false and PP position/close-intent tables empty. This is NOT Production PP readiness
and NOT a claim of exchange execution, native protection acceptance or profitability.

## Authorization and frozen identities

```text
TARGET_SHA=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
PARENT_SHA=8a3524bdf595b4883c0b2fd9e46df8d136be90d6
REMOTE_MAIN=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
LIVE_APPLICATION_SHA=6789a2e9457f0c927b8b7ac1dc5f79ef3748dbba
ROLLBACK_REFERENCE=6789a2e9457f0c927b8b7ac1dc5f79ef3748dbba
SOURCE_WORKTREE=CLEAN
SOURCE_OR_MAIN_WRITES_IN_THIS_TASK=NO
```

Remote main was checked before prepare-only, Guard issuance, backup and migration,
then finally again with both retained branches. It remained the exact target.
Retained remote refs remain:

- codex/main-retained-before-futures-pp-latest-20261001 → 6789a2e9457f0c927b8b7ac1dc5f79ef3748dbba.
- codex/main-retained-before-futures-pp-8a3524b-20261001 → 8a3524bdf595b4883c0b2fd9e46df8d136be90d6.

Exact successful main/push [Production CI 36853090043](https://github.com/signal0verse/signalverse-main/actions/runs/36853090043)
was reverified: head SHA target, main, push, success. The preceding exact candidate
run 36852518826 and automatic main run each passed 38/38. Neither an old PP candidate
nor a newly reconstructed identity was substituted.

## Official immutable artifact and independent Guard

[Prepare-only 36854698591](https://github.com/signal0verse/signalverse-main/actions/runs/36854698591)
ran on exact main/target, workflow_dispatch. Job window: **2026-10-01T11:20:03Z →
11:20:15Z**, success. This workflow creates an archive once and retains its bytes;
it does not issue approval, deliver an artifact or activate Production.

```text
ARTIFACT_ID=11156828095
ARTIFACT_NAME=production-release-9de1fb13966bb4b2c76dc8efa6a21334d86aacdf-36854698591-1
PREPARATION_RUN_ID=36854698591
INNER_RELEASE_TAR_GZ_BYTES=4554018
INNER_RELEASE_TAR_GZ_SHA256=03576b69ee8a25f9fbde47f882c3079c8a92cf1315c419b1db9a766019aeb54a
EMBEDDED_COMMIT=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
PACKAGING_CONTRACT=git-archive-lf-v1
REPACKAGING=NO
```

The retained artifact was downloaded locally without rebuilding it. Independent
Get-FileHash SHA256, metadata/provenance validation and embedded Git tar commit
validation matched. The outer Actions ZIP digest is NOT the Guard digest.

The owner explicitly answered YES to creation only for this exact SHA, inner
digest and artifact ID. An exclusive root-owned manifest was published through
the existing out-of-band operator mechanism, then inspected without claiming it.
No receiver/helper/coordinator/security code was changed.

```text
GUARD_UUID=3127608d-c7d3-4629-bb1e-25111ef1ce63
GUARD_ISSUED_UTC=2026-10-01T11:25:13Z
GUARD_EXPIRY_UTC=2026-10-01T12:25:13Z
MANIFEST_OWNER=root:root
MANIFEST_MODE=0600
GUARD_LAST_CHECK=VALID_UNUSED_UNCLAIMED
GUARD_CONSUMED=NO
GUARD_REVOKED=NO
```

The format/ownership/private-store validation passed. This mechanism does not have
a cryptographic manifest signature; root/private ownership is the existing trust
contract, not a fabricated signature. The approved archive digest was never
weakened or replaced. Authorization remains unused at the final timestamp; its
expiry must be rechecked before any later release. No automatic renewal/recovery
is authorized or performed by this report.

Installed control-plane hashes matched the established values. The authorization
helper's compatibility path is a root-owned symlink to a root-owned 0644 file;
the symlink's 777 mode was NOT a world-writable regular code file. No permissions
were changed to resolve that observation. The installed coordinator consumes
the exact approval under its deployment flock before activation.

## Backup and rollback safety

The existing private custom-format pg_dump procedure documented in prior
Production release evidence was reused, not replaced with a new backup system.
Target database was independently confirmed as **signalverse_cutover2**, PostgreSQL
**17.11**. Preflight reads used read-only transactions and bounded statements.

```text
BACKUP=/var/backups/signalverse/pre-futures-pp-9de1fb1-20261001T112619Z.dump
BACKUP_START_UTC=2026-10-01T11:26:19Z
BACKUP_VERIFIED_END_UTC=2026-10-01T11:27:54Z
BACKUP_BYTES=131181803
BACKUP_SHA256=d6b6c95d64c78908a15bc6dacc40b931f2bf621dd5ba5b00f3a5c808c1a6a8d2
BACKUP_OWNER=postgres:postgres
BACKUP_MODE=0600
BACKUP_DIRECTORY_MODE=0700
BACKUP_STATUS=PASS
```

The coordinator lock was acquired with a bounded wait; marker remained the prior
release and no active/queued artifact activation was observed. The dump completed
successfully with lock-wait timeout 5s. pg_restore --list read the TOC (994 output
lines), and pg_restore --file=/dev/null decoded the complete archive successfully.
Checksum and permissions were verified again before migration. A fresh disposable
database restore was NOT performed in this task; readable full archive/TOC and
checksum must not be described as a restore drill. No backup contents or account
rows were printed, exported from the VPS or committed. No backup was deleted.

## Exact migration and schema preservation

The official archive's migration, worker and unit were extracted solely for byte
verification. All three matched their exact committed blobs, had CR=0 and no BOM:

| Approved source | SHA256 |
|---|---|
| migrations/futures_profit_protection.sql | 9eba38bdc023f55105b1726916b31263e2ad40adb5ef3da589846684b3223034 |
| ops/signalverse-futures-profit-protection.service | d562e0803f18a0972f8f643dc6998c7cef478f2b922236ed0eb923600233f66d |
| server/futures-profit-protection/worker.mjs | 7c0bd80f7320016e3d01ba1b5cdd737fd87a3f60f81338654cb01f3983d55faf |

The migration was required BEFORE application activation because the candidate's
Demo entry inserts accepted_exit_basis. This safety ordering was explicitly
communicated; both migration and rollout were within the owner's authorization.

Before execution: both new copy_trades columns, all three PP tables, six functions
and three triggers were absent; relevant roles existed and no conflicting DDL
lock was present. No guessing, partial-schema repair or rerun occurred. The exact
LF file was uploaded into restricted operator staging, hashed again, then executed
with psql -X -v ON_ERROR_STOP=1 into the confirmed database. Its own BEGIN/COMMIT,
lock_timeout 5s and statement_timeout 30s were preserved.

```text
MIGRATION_START_UTC=2026-10-01T11:30:19Z
MIGRATION_COMMIT_UTC=2026-10-01T11:30:20Z
MIGRATION_RESULT=PASS
MIGRATION_EXECUTED=YES
MIGRATION_REAPPLIED=NO
```

Verification:

- copy_trades.accepted_exit_basis JSONB nullable; close_reason TEXT nullable.
- Three PP tables present; all RLS enabled; 11 constraints all validated.
- Five required PK/unique/partial indexes present, including active-instrument
  uniqueness for EXIT_SUBMITTED/UNKNOWN.
- Three expected triggers enabled; six expected functions present; the three RPCs
  SECURITY DEFINER and executable by service_role. Guard functions not exposed as
  general service RPCs. Service-role SELECT granted; anon/authenticated SELECT denied.
- Exactly one new control singleton, **real_enabled=false, demo_enabled=false**.
- PP position and close-intent tables each contain **zero** rows. No legacy
  position enrollment, fake state, history backfill or accepted-basis backfill.
- Existing public table columns/types/defaults/not-null, constraints and indexes
  retained the exact catalog MD5 **12a819edaad0543f23e3751ba68faae6**, before and
  after excluding ONLY the explicitly new PP objects/two added columns.
- Existing Futures, Spot and actual Prediction table families remained intact.

The only inserted data was the new OFF-default control singleton. UPDATE statements
inside new function definitions were NOT invoked. This migration did not execute
trading/balance/history DML or modify native SL/TP. Known skip notices referred
only to absent triggers that were about to be created; they were not migration failures.

## PostgREST/application-role readiness

The standard NOTIFY pgrst, 'reload schema' was issued without restarting a service.
The initial verification probe incorrectly chose the reviewed WORKER environment
file and stopped with the actual error **DATABASE_RUNTIME_CONFIG_MISSING**. This
was not a failed migration or unhealthy existing database; it exposed the worker's
site environment mismatch described below. All subsequent diagnosis was read-only.

Using the actual main service's existing DB environment, authenticated OpenAPI
returned **200**, all new columns/PP models and three RPC paths were visible.
Existing economics remained visible. Zero-row SELECT of id/accepted_exit_basis/
close_reason/economics through the same application role returned **200/[]**;
reading the control singleton returned both switches false. No dummy INSERT,
UPDATE or RPC execution was used to prove readability. Only existing DATABASE
runtime configuration was used; no exchange credential was decrypted or used.

## Exact worker blocker / no invented repair

| Evidence | Actual finding |
|---|---|
| Reviewed unit EnvironmentFile | /opt/signalverse/shared/.env.production |
| Actual main service EnvironmentFiles | /etc/signalverse/signalverse.env |
| Required DATABASE_API_URL / DATABASE_SERVICE_ROLE_KEY in reviewed worker file | BOTH absent; only names/presence printed, never values |
| Required DB keys in initial running main environment | BOTH present |
| Required DB keys in systemd DefaultEnvironment | BOTH absent |
| Worker bootstrap | Directly imports release .runtime/api/copytrade.mjs; no main-service bootstrap/environment inheritance |
| copytrade module constructor | createClient(process.env.DATABASE_API_URL, process.env.DATABASE_SERVICE_ROLE_KEY) |
| Worker installed/started | NO / NO |

Source locations: ops/signalverse-futures-profit-protection.service EnvironmentFile,
server/futures-profit-protection/worker.mjs bootProfitProtectionWorker, and the
api/copytrade.ts Supabase client constructor. The source unit claims to reuse the
existing application environment, but the live site's main unit uses a different
file. Supplying the reviewed unit unchanged therefore does not supply the required
DB configuration. This is a deterministic initialization preflight blocker, not
an observed live worker crash; the worker was deliberately not started to manufacture
that failure. It is NOT a strategy/threshold/SL/TP/entry defect.

Smallest proposal for a separately instructed next step: a site-local drop-in ONLY
for this worker, resetting EnvironmentFile and pointing to the already existing
main-service environment. Do not copy secret values, alter the existing environment,
change worker/application source, touch other units, or enable PP. Validate the
merged unit and OFF/empty state before the authorized official release/worker
installation. No such override or repair was implemented here. The existing
Guard approval must still be unused/unexpired and main exact before any continuation;
this task does not authorize silent renewal if it expires.

## Final runtime and safety evidence

Application marker/cwd/app symlink and admin/observer release paths remained:

```text
/opt/signalverse/releases/6789a2e9457f0c927b8b7ac1dc5f79ef3748dbba
/opt/signalverse-admin/releases/6789a2e9457f0c927b8b7ac1dc5f79ef3748dbba
```

| Service | Before PID | Final PID | Restarts before/after | Final state |
|---|---:|---:|---|---|
| signalverse.service | 3012849 | 3012849 | 0 / 0 | active |
| signalverse-admin.service | 3012811 | 3012811 | 0 / 0 | active |
| signalverse-observer.service | 3012810 | 3012810 | 0 / 0 | active |
| postgrest.service | 1960930 | 1960930 | 0 / 0 | active |

Application health and public-info HTTP passed; admin health reported the prior
release, auth/snapshot/static/database readiness true. No restart loop or application
activation occurred. No target artifact unit was started; no Production Release
workflow was dispatched. The PP unit remained not-found/inactive/MainPID=0.

Existing standard Futures open-position projections remained readable before/after;
aggregate SL-price/single-TP/native-reference coverage did not change. Native references
were not uniformly present in the PREEXISTING ledger. That is a preexisting limitation,
not proof that the exchange protection is absent/present; no private exchange read or
repair was performed. No account IDs, symbols, position quantities/prices or order
IDs are included in this sanitized report. Actual native protection/private-account
execution is NOT VERIFIED by these schema/health reads.

```text
PRODUCTION_DEPLOYED=NO
DEPLOYED_SHA=6789a2e9457f0c927b8b7ac1dc5f79ef3748dbba
RELEASE_RUN_ID=NOT_DISPATCHED
MIGRATION_EXECUTED=YES
MIGRATION_RESULT=PASS
POSTGREST_SCHEMA_READY=YES
WORKER_INSTALLED=NO
WORKER_RUNNING=NO
REAL_PP_ENABLED=NO
DEMO_PP_ENABLED=NO
EXCHANGE_ORDERS_CREATED_BY_THIS_TASK=0
POSITIONS_CHANGED_BY_THIS_TASK=0
EXISTING_SL_MODIFIED_BY_THIS_TASK=0
EXISTING_ONE_TP_MODIFIED_BY_THIS_TASK=0
AUTO_SCANNER_CHANGED=NO
FAST_TRADER_CHANGED=NO
SPOT_CHANGED=NO
PREDICTION_MARKET_CHANGED=NO
DECISION_ENGINE_CHANGED=NO
STRATEGY_CHANGED=NO
RISK_CHANGED=NO
APPLICATION_SOURCE_CHANGED=NO
GUARD_CODE_CHANGED=NO
SERVICE_RESTART=NO
```

Zero action counts describe THIS task, not absence of natural trading elsewhere.
Production changes were limited to the separately approved unused Guard manifest,
private backup, exact additive PP schema/OFF singleton and schema-cache notification.
Existing balances/orders/positions/protection/history were not written by this task.
The approval, backup, migration staging and evidence remain preserved; no rollback
was improvised and no approved/claimed state was removed.

## Publication / remaining work

Files inspected included the frozen source migration, worker and unit listed above;
api/copytrade.ts; .github/workflows/production-ci.yml;
.github/workflows/production-release-artifact.yml;
.github/workflows/production-release.yml;
docs/testing/real-futures-production-release-c518-2026-09-22.md; the existing safety
runbook/handoffs; retained artifact metadata.json and release.tar.gz; installed
receiver, authorization helper and coordinator; installed main/PP systemd metadata;
environment variable NAMES/presence only; deployed-sha, release symlinks/process cwd;
database catalog; authenticated OpenAPI and zero-row projections.

Changed application-source files: NONE. New Git-tracked file in this task: only
this sanitized report. Production filesystem/schema changes are explicitly listed
above and must not be confused with a source change or application activation.

Checks executed: exact remote refs and CI identities; retained-archive SHA256 and
embedded commit; manifest ownership/format/unused state; pg_dump and both
pg_restore validations; exact migration transaction and catalog comparison;
PostgREST OpenAPI/zero-row reads; systemctl service metadata, process/release identity
and health checks. These were PASS except the explicit worker-env initialization
preflight. No fresh application build or live worker execution was performed here;
the exact previously completed CI gates remain the build evidence.

This sanitized dated report is the handoff for the blocked infrastructure phase.
It is published as a documentation-only AI-Log/master commit and the remote file
blob is verified before claiming publication in the conversation. Source main and
the frozen application worktree were deliberately not edited to add a handoff
commit, because doing so would advance the exact release identity. Existing dirty
root HANDOFF/private/untracked work was preserved. No new application Git commit,
push, merge or source rewrite occurred.

Remaining: explicit disposition of the worker environment mismatch, then recheck
exact main/artifact/approval/backup/schema, official exact-SHA release, approved
worker installation and healthy idle observation with Real/Demo PP OFF. Existing
migration is now present and must not be blindly rerun. Do not label infrastructure
READY until the worker and application runtime are genuinely verified.
