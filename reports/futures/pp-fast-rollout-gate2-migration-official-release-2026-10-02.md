# Futures PP Automatic Enrollment — Gate 2 migration and official release

## Metadata

- Date: 2026-10-02; all operational timestamps below are UTC.
- Task: PP-FAST-ROLLOUT-GATE-2, exact owner approval supplied in this conversation.
- Module: Futures Profit Protection admission/enrollment; no live PP acceptance.
- Application repository: `signal0verse/signalverse-main`.
- Frozen application/main identity: `a0455626c0a54fb443f457e0a595a662974623fa`.
- Runtime before: `84f27c2e40b02b0dbf61c58429cf7c45f4f852da`.
- Runtime after: `a0455626c0a54fb443f457e0a595a662974623fa`.
- Report repository: `signal0verse/SignalVerse-AI-Log`, `master`.
- Evidence collection: pre-mutation snapshot at 10:25:50Z; final read-only runtime check at 10:56:51Z.

## Executive result

**PP-FAST-ROLLOUT-GATE-2-PASS.** The approved admission-only migration was backed up, applied once, and verified. The exact official retained artifact was independently checked, authorized by one fresh Guard, and released through the official workflow. The application, admin, observer and health/API checks passed on the exact target SHA. The canonical PP worker was neither started nor enabled.

**Real and Demo PP flags were already ON before this operation; both remain ON, unchanged.** The main process does not have the canonical worker bootstrap flag set. The independently pinned partner-copytrade process remains on its previous runtime and was not restarted. Therefore this report does **not** claim live PP activation, automatic-enrollment execution on an account, a profitable exit, or partner runtime rollout.

The earlier Gate 2 blocked report is preserved. This operation used the owner's later authorization with successful main/push CI `36994567002`; it did not reuse the older candidate-only CI as release acceptance.

## Scope and actions

1. Rechecked remote main and the exact successful main/push Production CI before production mutation and again before release.
2. Read Production database catalogs, PP counts/control flags, worker state, runtime identities, installed release tooling and authorization stores. No exchange API was called.
3. Created and restore-verified a full PostgreSQL backup using the existing native backup/restore procedure.
4. Independently checked the exact migration bytes and applied only the approved function/admission replacement in its transaction.
5. Compared protected before/after snapshots without publishing any rows or account identifiers; verified function bodies, privileges, SECURITY INVOKER and RLS boundaries.
6. Verified authenticated public and owned PostgREST OpenAPI and zero-row SELECT. No enrollment or close RPC was invoked.
7. Ran official prepare-only; downloaded and independently verified the retained outer ZIP and inner Git archive. No local archive regeneration or repackaging occurred.
8. Created exactly one root-owned out-of-band Guard and immediately verified its exact SHA/digest, expiry and unused/unclaimed/unrevoked state.
9. Dispatched one official Production Release using that artifact and Guard. Only the coordinator's normal application/admin/observer activation occurred.
10. Independently verified marker, symlinks, process provenance, consumed Guard, delivered bytes, services, health, schema readiness, unchanged flags and inactive canonical worker.
11. Stopped at Gate 2; no next-phase worker activation or live acceptance was performed.

## Exact CI and release identity

| Gate | Run | Exact head SHA / event | Result |
| --- | --- | --- | --- |
| Production CI | [36994567002](https://github.com/signal0verse/signalverse-main/actions/runs/36994567002) | `a0455626c0a54fb443f457e0a595a662974623fa`, `main`, `push` | SUCCESS; 1/1 job, 39/39 reported steps; zero failed/skipped |
| Prepare-only | [36997022780](https://github.com/signal0verse/signalverse-main/actions/runs/36997022780) | Same SHA, `main`, `workflow_dispatch`, attempt 1 | SUCCESS |
| Production Release | [36997483769](https://github.com/signal0verse/signalverse-main/actions/runs/36997483769) | Same SHA, `main`, `workflow_dispatch` | SUCCESS; release job and all 11 reported steps successful |

- CI completed: 10:20:11Z.
- Prepare created: 10:43:12Z; completed: 10:43:31Z.
- Release dispatch requested: 10:48:07.9446324Z; run created: 10:48:10Z.
- VPS target unit started: 10:48:27Z.
- Guard consumption: 10:50:01Z, before activation.
- Normal main/admin/observer service start: 10:50:02Z.
- Target activation/marker success: 10:50:09Z.
- GitHub release run completed: 10:50:17Z.
- Final remote-main read remained exactly the target; application source/branch/history were not changed by this task.

## Backup and database safety

- Database: `signalverse_cutover2`; PostgreSQL 17.11.
- Backup ID: `pp-auto-gate2-a0455626-20261002T1032Z`.
- Private backup directory: `/opt/signalverse/shared/backups/pp-auto-gate2-a0455626-20261002T1032Z`.
- Native full custom-format dump: `original.dump`, 142,934,996 bytes, root-owned mode 0600; directory mode 0700.
- Dump SHA-256: `9e649b8e66a8905fe0f7321a292f57782aff3a2b589abc5d135ee09e6d27eac4`.
- Backup started: 10:32:31Z; restore verification completed: 10:35:21Z.
- Restore drill used only a disposable database, connection limit 0, and `pg_restore --exit-on-error`; 98 public and 28 partner-copytrade tables restored successfully.
- Only the exact disposable restore database was removed after verification. The protected full dump, restore log and archive listing remain available for recovery. No restore into Production occurred.
- Read-only precheck confirmed the existing base PP schema, execution-attempt provenance, six TP-allocation columns across public/owned trade tables, existing enrollment functions and owned account-RLS prerequisites. Historical base migrations were not rerun.
- Enabled database DDL event triggers before application: zero.
- Applied using `psql -X -v ON_ERROR_STOP=1`, the exact file's `BEGIN`/`COMMIT`, lock timeout 5 seconds and statement timeout 30 seconds.
- Application/commit time: 10:39:09Z. Commands completed with `COMMIT`; no ad-hoc repair or migration retry.

### Exact migration

```text
MIGRATION_FILE=migrations/futures_profit_protection_automatic_enrollment.sql
MIGRATION_SHA256=73c1440d8469e8eff8b39a9109f24a8d34186acc2b9cb52f9bf756c0e93408c0
MIGRATION_RESULT=PASS_APPLIED_ONCE
```

The source contains function replacement, grants/revokes and refresh of the already-existing owned enrollment clone. It does not execute a trade UPDATE/backfill, table rewrite, balance/order/position mutation, PP-control toggle or enrollment/close RPC. An INSERT exists inside the enrollment function body; this task never invoked that function.

Protected `admission-before.json` and `admission-after.json` were compared in memory. Full-row aggregate fingerprints for public/owned trades, PP positions, close intents and execution attempts, plus column/RLS metadata and the complete control row, matched exactly: `migrationSnapshotEqual=true`, `differingSections=[]`. The protected snapshots were not published.

| Aggregate | Before migration | After migration / post-release check |
| --- | ---: | ---: |
| Public trade rows | 1349 | 1349 |
| Owned trade rows | 0 | 0 |
| Public PP state / enabled / closed | 0 / 0 / 0 | 0 / 0 / 0 |
| Owned PP state / enabled / closed | 0 / 0 / 0 | 0 / 0 / 0 |
| Public / owned PP close intents | 0 / 0 | 0 / 0 |
| Real / Demo PP global flags | ON / ON | ON / ON, unchanged |

The exact full-row equality proves no mutation by the migration. Post-release counts and PP-state checks are additional evidence, **not** a blanket claim that every background trading/account row or exchange state was independently audited throughout the window. No account rows, exchange credentials or private provider state were exported. No exchange action was initiated by this task.

## Schema, functions and API/SQL contract

The approved Git migration's function bodies were independently fingerprinted and compared with installed `pg_proc` bodies. All matched before release and again at 10:54:49–10:54:51Z:

| Function | Body fingerprint (MD5 comparison only) | Security |
| --- | --- | --- |
| `public.futures_pp_enrollment_mode_enabled(text)` | `dd084eb30f931416fc504b130ab6d4b0` | SECURITY DEFINER; pinned `pg_catalog, public, pg_temp`; locked boolean-only control read |
| `public.futures_enroll_profit_protection(uuid,jsonb)` | `b325f56c68fc3869bd3a21161654ada7` | SECURITY DEFINER; pinned `pg_catalog, public, pg_temp`; service-role execution |
| `partner_copytrade.futures_enroll_profit_protection(uuid,jsonb)` | `9542aa2a26b1565c77c5af561a75acc0` | SECURITY INVOKER; pinned `pg_catalog, partner_copytrade, pg_temp`; owned actor execution |

These MD5 values are only exact catalog/body-comparison fingerprints, not approval signatures or release digests. Artifact and migration identities use SHA-256.

- Owned enrollment remains account/actor RLS scoped; relevant owned tables retain enabled FORCE RLS and unchanged policies.
- The new boolean helper grants no control-table UPDATE authority to owned actors. The owned clone uses owned trades/state/attempts/close-intents; its only shared reference is the public boolean mode helper.
- Exact approved API admission helper and SQL enforce OPEN, standard Futures, full remaining quantity and execution allocations `100/0/0`; analytical TP2/TP3 prices do not themselves reject admission. True multi-TP, partial positions, missing original accepted provenance and invalid epochs remain rejected.
- Existing persisted identity wins; no reset, upsert, revision bump or implicit re-enable. Row locking preserves transactional idempotency. Restart discovery is keyset-paged and relies on persisted identity/SQL, not a new execution path.
- API/SQL parity and restart/idempotency evidence: exact approved source, matching deployed function bodies, and the successful exact-SHA offline/disposable-SQL CI steps. **No live Production enrollment acceptance was run.** Previously recorded local results are not represented as newly executed live tests.

## PostgREST and health verification

Before release at 10:41:47Z, and after release at 10:54:49–10:54:51Z:

- Authenticated public OpenAPI: HTTP 200; `copy_trades`, economics, all TP allocation fields, enrollment RPC and boolean mode helper visible.
- Owned schema OpenAPI: HTTP 200; trade model/economics and owned enrollment RPC visible.
- Both public and owned GET/SELECT checks used `limit=0`: HTTP 200, zero returned rows.
- No POST/RPC, dummy INSERT, UPDATE or account-specific enrollment was used.
- Existing schema cache already exposed the function replacement/new helper. No `NOTIFY`, PostgREST restart or persistent configuration change was needed.
- Application `/healthz`: HTTP 200, `ok=true`.
- Admin `/healthz`: HTTP 200, `ok=true`, release SHA exactly target; database/static/auth/snapshot readiness true at 10:56:49Z.
- Public API `/api/public-info`: HTTP 200.

## Retained artifact and one fresh Guard

```text
ARTIFACT_RUN_ID=36997022780
ARTIFACT_ID=11222231493
ARTIFACT_NAME=production-release-a0455626c0a54fb443f457e0a595a662974623fa-36997022780-1
EMBEDDED_SHA=a0455626c0a54fb443f457e0a595a662974623fa
OUTER_ARTIFACT_SHA256=ea9dd4af0970d176505f0f7b06f64c247b4d0d681fa92d03eacb3bb80e2f9f6d
OUTER_BYTES=4632988
INNER_RELEASE_SHA256=6147b6936cd1fbd9bd686e84e4223f8f69da03c5fd4404fa8262f3492bbf5bfc
INNER_BYTES=4632043
ARTIFACT_CONTRACT=git-archive-lf-v1
GUARD_ID=77a0ecab-11d7-4c7b-a930-a1ab05e41e51
GUARD_ISSUED=2026-10-02T10:47:02Z
GUARD_EXPIRES=2026-10-02T11:47:02Z
```

The outer retained ZIP digest was independently calculated and matched GitHub artifact metadata. Existing `scripts/release-artifact.mjs` source/bundle validation verified run/attempt/repository/workflow provenance, the exact inner digest, embedded native Git commit identity and the expected two bundle files. Neither approval preparation nor delivery rebuilt the release archive.

Exactly one fresh manifest was created using the established out-of-band root-exclusive manifest mechanism, global deployment lock, file/directory durability and the installed authorization helper. The approved SHA/digest had no existing approval/claim before issuance. The manifest is root:root mode 0600; protected store directories are 0700. Immediately before release the helper confirmed unused, unclaimed, unrevoked and unexpired, with 3534 seconds remaining. No old authorization was reused, recovered or altered.

Official journal at 10:50:01Z:

```json
{"event":"release_authorization","requestedSha":"a0455626c0a54fb443f457e0a595a662974623fa","approvedSha":"a0455626c0a54fb443f457e0a595a662974623fa","authorizationId":"77a0ecab-11d7-4c7b-a930-a1ab05e41e51","version":1,"validation":"PASS","consume":"PASS","activation":"NOT_STARTED"}
```

After release the consumed manifest contains the same UUID, target and digest; its bytes equal the preserved approval bytes. Manifest SHA-256 is `d3de9fd11d78aa281bae2036ea5bb7fd08bf6bf67dd292a1f46a2f3c4dd997c8`. The SHA-keyed claim is absent after successful consumption; the UUID is consumed and cannot be reused. The delivered private `incoming` archive still hashes to the exact approved inner digest.

Normal server-side compilation of the delivered source into runtime bundles is part of the established coordinator. It is **not** regeneration of the approval-bound source archive. A separately logged partner build digest is not the approved release archive identity; it was not substituted for it or activated as an owned runtime.

## Post-deploy provenance and service safety

At 10:52:09–10:52:10Z, repeated through 10:56:51Z:

- `/var/lib/signalverse-deploy/deployed-sha` equals target.
- `/opt/signalverse/app` resolves to `/opt/signalverse/releases/a0455626c0a54fb443f457e0a595a662974623fa`.
- `/opt/signalverse-admin/app` resolves to the corresponding exact-SHA admin release.
- Active application/admin/observer process working directories resolve to those exact releases; bundled PP admission code and the guarded worker bootstrap are present.
- Target artifact unit finished successfully at 10:50:09Z, Result success, ExecMainStatus 0, NRestarts 0. No target artifact job remained queued/running.
- Official journal activation PASS preceded the final successful deployment line.

| Service | PID before | PID after | Final state | NRestarts |
| --- | ---: | ---: | --- | ---: |
| application | 3092054 | 3165132 | active/running, exact target | 0 |
| admin | 3092050 | 3165128 | active/running, exact target | 0 |
| observer | 3092049 | 3165127 | active/running, exact target | 0 |
| public PostgREST | 1960930 | 1960930 | active/running, unchanged | 0 |
| Guard receiver | 2210596 | 2210596 | active/running, unchanged | 0 |
| partner-copytrade | 3092803 | 3092803 | active/running, previous independent pin | 0 |
| canonical PP worker | 0 | 0 | disabled/inactive/dead | 0 |

Only normal official main/admin/observer activation restarted those three services. No manual service restart, worker start/enable, partner pin change or DB-service restart was performed. Main bootstrap flag is unset; owned bootstrap flag is `0`. Journal PP-monitor record count since release is zero for main, owned and canonical PP service. This is corroboration, not a substitute for actual service/flag/PP-state checks.

The partner-copytrade symlink/process remains independently pinned to `84f27c2e40b02b0dbf61c58429cf7c45f4f852da`. Updating its SQL admission clone does not mean the new owned discovery runtime is active. No duplicate PP execution path was activated by this release.

Installed release control-plane hashes stayed unchanged:

```text
COORDINATOR=928eefc39677fe27242f8d2762d7fb3de97bebd2ff8678c20e86ff22188ce308
RECEIVER=c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa
AUTHORIZATION_HELPER=acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83
```

No startup failure/restart-loop journal record was found for main/admin/observer during the inspected startup window. Initial connection-refused probes from 10:50:02–10:50:06Z occurred inside the existing bounded readiness loop; health was ready and activation passed at 10:50:09Z. They were not treated as an application crash.

The historical failed artifact unit for another SHA remains preserved; it was not in flight and was not retried or cleaned.

## Checks, warnings and limitations

- Actual operational checks: Git exact-main read; GitHub CI/prepare/release run/job metadata; native backup and disposable restore; exact transactional migration; catalog/body/security and private before/after equality; authenticated OpenAPI/zero-row SELECT; independent retained archive verification; installed helper validation and consumed evidence; systemd/journal/process/symlink/marker; health/API GET. All required Gate 2 checks passed.
- No new local strategy simulations or exchange lifecycle tests were executed. Exact-SHA CI is offline/disposable SQL acceptance, not live PP effectiveness.
- Official build emitted existing npm audit output reporting two high-severity vulnerabilities and web chunk-size warnings. No dependency fix was attempted in this frozen release task. These warnings do not prove an exploit or a new regression, and remain separate follow-up evidence.
- No general private-account/exchange read was authorized or performed. `EXCHANGE_ACTIONS=0` means this task initiated none, not proof that no naturally operating system/user ever acted.
- Post-release trade counts and empty PP state are not a full ongoing row-level or exchange-state audit. Migration full-row equality is specifically between the immediate protected migration snapshots.
- A proposed read-only snapshot-printing command was rejected before execution by the safety reviewer. It was replaced with sanitized key/type, equality and aggregate-only output; no private snapshot was disclosed. Diagnostic path/auth/route corrections did not change Production code/configuration.
- Canonical PP worker/live acceptance remains deliberately pending. No conclusion about live enrollment, HUMA/STRK account acceptance, close execution, profitability or protection effectiveness is drawn from this phase.

## Files inspected and changes

Application/approved tooling inspected includes the exact migration, `api/copytrade.ts`, `api/_shared/futures-profit-protection-enrollment.ts`, `server/futures-profit-protection/worker.mjs`, owned database/worker/contract source, official production CI/prepare/release workflows and `scripts/release-artifact.mjs`. Installed coordinator/receiver/helper, relevant systemd units, protected authorization/backup metadata, DB catalogs, runtime bundles and target-unit journal were inspected read-only.

Application source changes: **NONE**. No application commit, source push, main write, amendment or history rewrite occurred. Existing untracked `output/` in the isolated candidate and unrelated work in the primary checkout were preserved.

Authorized Production changes were only: protected backup files, exact admission-function/grant migration, one fresh Guard and its official consumption, and normal exact-artifact application/admin/observer release activation. Only this sanitized document is changed/committed in the separate AI-Log report repository.

## Final required fields

```text
PHASE=PP-FAST-ROLLOUT-GATE-2
TARGET_SHA=a0455626c0a54fb443f457e0a595a662974623fa
MAIN_SHA=a0455626c0a54fb443f457e0a595a662974623fa
CI_RUN_ID=36994567002
CI_SHA=a0455626c0a54fb443f457e0a595a662974623fa
CI_EVENT=push
CI_RESULT=SUCCESS
MIGRATION_FILE=migrations/futures_profit_protection_automatic_enrollment.sql
MIGRATION_SHA256=73c1440d8469e8eff8b39a9109f24a8d34186acc2b9cb52f9bf756c0e93408c0
BACKUP_STATUS=PASS_FULL_DUMP_AND_DISPOSABLE_RESTORE_VERIFIED
MIGRATION_RESULT=PASS_APPLIED_ONCE
SCHEMA_BEFORE=REQUIRED_BASE_PP_AND_EXECUTION_PROVENANCE_PRESENT;OLD_ADMISSION
SCHEMA_AFTER=APPROVED_ADMISSION_FUNCTIONS_INSTALLED;TABLE_COLUMNS_AND_RLS_UNCHANGED
FUNCTIONS_VERIFIED=PUBLIC_MODE_HELPER_PUBLIC_ENROLLMENT_OWNED_ENROLLMENT_MATCH
API_SQL_PARITY=PASS_APPROVED_SOURCE_EXACT_CI_AND_DEPLOYED_CATALOG;NO_LIVE_ENROLLMENT_TEST
POSTGREST_READINESS=PASS_PUBLIC_AND_OWNED_OPENAPI_200_ZERO_ROW_SELECT_200
ARTIFACT_ID=11222231493
EMBEDDED_SHA=a0455626c0a54fb443f457e0a595a662974623fa
OUTER_ARTIFACT_SHA256=ea9dd4af0970d176505f0f7b06f64c247b4d0d681fa92d03eacb3bb80e2f9f6d
INNER_RELEASE_SHA256=6147b6936cd1fbd9bd686e84e4223f8f69da03c5fd4404fa8262f3492bbf5bfc
GUARD_ID=77a0ecab-11d7-4c7b-a930-a1ab05e41e51
GUARD_TARGET_SHA=a0455626c0a54fb443f457e0a595a662974623fa
GUARD_DIGEST=6147b6936cd1fbd9bd686e84e4223f8f69da03c5fd4404fa8262f3492bbf5bfc
GUARD_STATUS=VALIDATED_FRESH_THEN_CONSUMED_BY_OFFICIAL_RELEASE
GUARD_VERIFICATION=PASS_OWNER_MODE_EXPIRY_IDENTITY_UNUSED_PRE_RELEASE_CONSUMED_POST_RELEASE
RELEASE_RUN_ID=36997483769
RELEASE_RESULT=SUCCESS
PRODUCTION_SHA_BEFORE=84f27c2e40b02b0dbf61c58429cf7c45f4f852da
PRODUCTION_SHA_AFTER=a0455626c0a54fb443f457e0a595a662974623fa
PRODUCTION_SHA_MATCH=YES
APPLICATION_HEALTH=PASS_HTTP_200
ADMIN_HEALTH=PASS_HTTP_200_EXACT_SHA_ALL_READINESS_TRUE
API_HEALTH=PASS_HTTP_200
WORKER_ENABLED=NO
WORKER_ACTIVE=NO
WORKER_PID=0
WORKER_STARTED=NO
REAL_PP=ON_UNCHANGED
DEMO_PP=ON_UNCHANGED
DATABASE_MUTATION=AUTHORIZED_ADMISSION_FUNCTION_DDL_AND_GRANTS_ONLY;FINANCIAL_DML_NO
TRADE_CHANGES=0_BY_TASK;MIGRATION_FULL_ROW_SNAPSHOTS_IDENTICAL
POSITION_CHANGES=0_BY_TASK
ORDER_CHANGES=0_BY_TASK
SL_CHANGES=0_BY_TASK
TP_CHANGES=0_BY_TASK
CLOSE_ACTIONS=0_BY_TASK
EXCHANGE_ACTIONS=0_BY_TASK
APPLICATION_COMMIT_CREATED=NO
APPLICATION_PUSH=NO
LIVE_PP_ACCEPTANCE=NOT_PERFORMED
NEXT_PHASE_ACTIONS=NONE
FINAL_CLASSIFICATION=PP-FAST-ROLLOUT-GATE-2-PASS
```

## Publication and hard stop

This sanitized report is to be committed and published only to AI-Log/master, with remote file/blob/content verification reported in the conversation. No backups, private snapshots, credentials, account records or downloaded artifacts are included.

**STOP AFTER GATE 2.** A separately authorized phase would be required for any canonical worker activation or live PP acceptance. No automatic progression is authorized here.
