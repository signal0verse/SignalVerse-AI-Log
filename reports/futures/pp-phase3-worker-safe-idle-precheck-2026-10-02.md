# Phase 3 — Futures PP Worker safe-idle precheck: BLOCKED before start

## Metadata

- Date: 2026-10-02.
- Task: PHASE 3 — FUTURES PROFIT PROTECTION WORKER SAFE-IDLE SMOKE TEST.
- Evidence window: 2026-10-02T11:09:17Z–2026-10-02T11:15:32Z, UTC.
- Application repository: signal0verse/signalverse-main (verified origin).
- Inspected application release: a0455626c0a54fb443f457e0a595a662974623fa.
- Independently pinned partner runtime: 84f27c2e40b02b0dbf61c58429cf7c45f4f852da.
- Report repository: signal0verse/SignalVerse-AI-Log, master.
- Starting report-repository commit: f3044908055d9ae553e7a6087f849c4fbb316c4c.
- Mode: read-only precheck; no production smoke execution.

## Executive result

آزمون پیش از شروع Worker متوقف شد. مقدار واقعی هر دو کلید حفاظت سود روشن است؛ پوزیشن باز نیز وجود دارد و نسخهٔ نصب‌شده حالت مستقلِ verification-only یا safe-idle ندارد. شروع این Worker با وضعیت فعلی، مسیر ثبت‌نام خودکار و سپس پایش زنده را در دسترس قرار می‌دهد. این با محدودیت همین مجوز سازگار نیست.

```text
FINAL_CLASSIFICATION=PHASE3-SAFE-IDLE-BLOCKED
CANONICAL_WORKER_STARTED=NO
AUTOMATIC_ENROLLMENT_LIVE_OBSERVATION=NOT_SAFE_TO_VERIFY
PARTNER_PP_ISOLATION=BLOCKED
```

این نتیجه، خرابی bootstrap یا رد شدن پیاده‌سازی Automatic Enrollment نیست؛ آزمون runtime اجرا نشده است. نتیجهٔ قبلی انتشار نیز با این گزارش بازنویسی نمی‌شود.

## Authorized scope and actions actually performed

Owner allowed fresh read-only prechecks and a bounded canonical-worker start **only if safe-idle preconditions pass**. No permission to change mode switches, worker environment/unit, partner runtime, policy, source, orders or positions was given.

Actual actions were limited to:

1. Reading the exact task attachment, repository instructions, strategy amendments, safe-test runbook and approved PP documentation.
2. Inspecting exact-release worker/API/monitor/admission/lifecycle and owned-runtime sources, installed unit/drop-in, process provenance and selected non-secret bootstrap flags.
3. Reading DB aggregates and RLS catalogs under explicit read-only transactions with 2-second lock and 10-second statement timeouts.
4. Comparing installed raw source hashes with raw Git blobs from the approved commit, inspecting compiled call sites, and running `node --check` on the installed worker without importing it.
5. Reading journal counts and final service/provenance state.
6. Writing only this sanitized AI-Log report. No application-source commit or change was made.

No `systemctl start`, stop, restart, enable, disable, daemon-reload, SQL DDL/DML, RPC enrollment, exchange request, approval, artifact, migration or deployment action was issued.

## Fresh service and runtime evidence

Initial service evidence was collected at 11:09:17Z; the final service/provenance reread was at 11:14:42Z. Values below were unchanged across those reads.

| Service | PID before → after | State | Boot enabled | NRestarts before → after |
| --- | --- | --- | --- | --- |
| signalverse.service | 3165132 → 3165132 | active/running | yes | 0 → 0 |
| signalverse-admin.service | 3165128 → 3165128 | active/running | yes | 0 → 0 |
| signalverse-observer.service | 3165127 → 3165127 | active/running | yes | 0 → 0 |
| postgrest.service | 1960930 → 1960930 | active/running | yes | 0 → 0 |
| signalverse-futures-profit-protection.service | 0 → 0 | inactive/dead | no | 0 → 0 |
| signalverse-partner-copytrade.service | 3092803 → 3092803 | active/running | yes | 0 → 0 |

The application/admin/observer start timestamp remained 2026-10-02T10:50:02Z. Partner start remained 2026-10-01T22:15:48Z. Canonical worker had no ExecMainStartTimestamp. Its stored Result=success/ExecMainStatus=0 is **not** evidence of a completed smoke test.

Marker `/var/lib/signalverse-deploy/deployed-sha`, application symlink `/opt/signalverse/app`, admin symlink `/opt/signalverse-admin/app`, and running application/admin/observer working directories all identified the exact expected a045 release. Partner symlink and process remained on the separate 84f27c2 release.

Canonical unit and override:

```text
UNIT=/etc/systemd/system/signalverse-futures-profit-protection.service
OVERRIDE=/etc/systemd/system/signalverse-futures-profit-protection.service.d/override.conf
ExecStart=/usr/bin/node /opt/signalverse/app/server/futures-profit-protection/worker.mjs
WorkingDirectory=/opt/signalverse/app
User=signalverse
Group=signalverse
EnvironmentFile=/etc/signalverse/signalverse.env (effective override)
FUTURES_PROFIT_PROTECTION_WORKER=1 (unit bootstrap configuration)
Restart=on-failure
RestartSec=5
UMask=0077
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
After=network-online.target signalverse.service
Wants=network-online.target
BindsTo=signalverse.service
PartOf=signalverse.service
```

No environment-file content or credential value is included. Process-level bootstrap flags were explicitly whitelisted: main FUTURES_PROFIT_PROTECTION_WORKER was unset; partner PARTNER_COPYTRADE_WORKER=1 and FUTURES_PROFIT_PROTECTION_WORKER=0.

## Source/version and reachable enrollment path

Installed worker and raw API hashes independently matched approved Git blobs:

```text
WORKER_SOURCE_COMMIT=a0455626c0a54fb443f457e0a595a662974623fa
WORKER_FILE_SHA256=fa8a6ec35b007515876387eebd04aa31bb0d5c81cb63ad14dcfd744a62aabe17
API_SOURCE_SHA256=92e4400bae077640e38fad06d8cb26752007512a62e1b61f59dc37958ec6136e
APPROVED_REPOSITORY_UNIT_SHA256=d562e0803f18a0972f8f643dc6998c7cef478f2b922236ed0eb923600233f66d
WORKER_SYNTAX=node --check: PASS
```

The repository-unit hash is not represented as a hash of an unverified effective unit/drop-in combination. Installed worker and compiled API bundle existed with owner/group signalverse:signalverse and mode 0640; Node is the interpreter, so executable mode on the `.mjs` file is not required.

Confirmed worker source uses realpathSync, fileURLToPath and pathToFileURL for canonical entrypoint comparison; unresolvable/missing paths fail closed. `bootProfitProtectionWorker()` requires workerFlag exactly `1`, then imports the same-release `.runtime/api/copytrade.mjs`; the existing module initializes `profitProtectionMonitorTick`, not a copied alternative execution engine.

Exact approved source call chain:

```text
worker.mjs guarded entrypoint
→ bootProfitProtectionWorker(workerFlag='1')
→ import .runtime/api/copytrade.mjs
→ ensureProfitProtectionMonitor(true)
→ initial timer: 30,000 ms
→ profitProtectionMonitorTick() [api/copytrade.ts:16357]
→ existing uncertain-intent/state handling
→ discoverOpenProfitProtection(control) [api/copytrade.ts:16400; definition:16071]
→ OPEN standard/full/ONE-TP discovery
→ enrollOpenProfitProtection() [api/copytrade.ts:16025]
→ enrollProfitProtection() [api/_shared/futures-profit-protection-enrollment.ts]
→ native/basis/entitlement/epoch verification
→ futures_enroll_profit_protection transactional RPC
→ SAME monitor processes enrolled state on subsequent ticks
```

The installed compiled bundle contains discovery at line 15227, monitor at 15563, account-scoped in-flight guard at 15565–15566, and explicit worker bootstrap at 15619. Source line numbers above refer to the exact a045 tree, not the independently pinned partner tree.

Admission inspection confirms:

- Execution allocation 100/0/0 is authoritative; analytical TP2/TP3 prices are not used to reject it.
- True multi-TP, missing allocations, partial remaining quantity, nonstandard trades and unsupported Real venues fail closed.
- Persisted state wins before new enrollment, including disabled, UNKNOWN and RECONCILED states.
- Original accepted risk, permissions and native full-position epoch remain required.
- Transactional persistence must acknowledge successful enrollment; no manual enrollment was attempted.

These are source/version findings and previously validated contracts, **not live acceptance/idempotency/restart tests in this phase**.

## Why safe-idle preconditions fail

At 11:10:21Z and 11:14:42.484034Z, read-only DB checks independently returned:

```text
DATABASE=signalverse_cutover2
transaction_read_only=on
REAL_PP=true
DEMO_PP=true
PUBLIC_PP_STATE_ROWS=0
OWNED_PP_STATE_ROWS=0
PUBLIC_CLOSE_INTENTS=0
OWNED_CLOSE_INTENTS=0
PUBLIC_RECONCILED_PP_ROWS=0
OWNED_RECONCILED_PP_ROWS=0
```

The initial aggregate OPEN population was 12 Demo and 4 Real. The pure allocation/full/standard/venue subset was 11 Demo and 4 Real; one Demo row had accepted-exit-basis metadata. These subset counts **do not** prove full admission eligibility. Further entitlement, native identity, original basis and epoch gates must still pass. In particular, absence of Demo-style accepted_exit_basis on Real rows is not proof that Real execution provenance is missing.

No independent SAFE_IDLE/VERIFY_ONLY/DRY_RUN runtime gate was found in the worker/monitor path inspected. Enabled mode switches allow automatic discovery. Empty existing PP tables therefore do not guarantee idle behavior: discovery can create new state and subsequent ticks can enter the existing policy lifecycle.

Starting and stopping before the first 30-second timer would neither prove monitor/DB/discovery behavior nor establish a robust verification-only condition. This workaround was not attempted. Turning either mode OFF or changing the worker runtime/unit would require separate authorization; neither was done.

## Partner-copytrade isolation and duplicate-loop findings

Partner is active, with its worker option enabled. Its actual call chain is:

```text
installed partner main → http.ts:24 periodic 'profit-protection' (1,000 ms)
→ service.sweep('profit-protection')
→ Registry.all(), per-account protectionBusy guard
→ withPartnerCopytrade(account context)
→ if market==='usdm': profitProtectionMonitorTick()
→ owned database adapter / partner_copytrade schema / actor RLS
```

The canonical and owned source import the same **named shared monitor family**. They do **not** currently execute byte-identical versions: installed partner 84f27c2 source monitor is at api/copytrade.ts:16263 and lacks the new automatic-discovery call and new monitor-level account-keyed in-flight Set present in a045.

Read-only source and deployed catalogs prove namespace isolation:

- AsyncLocalStorage selects owned context; copytradeDatabase routes to its account-scoped owned adapter rather than public legacy tables.
- Registry creates clients with schema partner_copytrade, actor role and account-bound claims.
- Shared control/settings reads are wrapped against writes; no shared write path was exercised.
- Owned copy_trades, execution_attempts, PP positions and close intents have RLS and FORCE RLS enabled.
- Deployed owned_rows USING/WITH CHECK require both current account and its actor.
- partner_copytrade_actor is neither superuser nor BYPASSRLS.
- Current owned trade/PP/intent populations are zero. Registry aggregate showed two accounts, one spot and one usdm; no identities or private records are published.

Limits are significant: process-local Sets/boolean guards are not distributed locks. Source CAS and durable close admission are relevant safeguards, but this phase did not independently validate their behavior across these two active-version combinations or prove native exchange-account/instrument non-overlap across public and owned namespaces. RLS proves database row isolation, not native-account execution isolation or a live concurrency test. No actual double-close/cross-account leak was observed or claimed.

Accordingly, **PARTNER_PP_ISOLATION=BLOCKED for live coexistence acceptance**, while source/RLS namespace isolation is verified. There is an existing independently scheduled owned PP sweep; globally saying “no second PP loop” would be inaccurate. Canonical stayed stopped, so this task activated no additional loop. Zero explicit journal PP strings do not prove owned inactivity: owned logging redacts engine details into generic observations.

## Postcheck, background activity and attribution

Services, marker, symlinks, mode-control fingerprint, PP state and close-intent counts were unchanged at the final service/DB reread. Canonical journal from 11:09:17Z through 11:14:42Z contained no entries. Main/partner explicit PP, PP-close and worker-bootstrap-failure log-string counts were all zero; those counts are corroboration only, not a full private-exchange action ledger.

Public trade count was 1,349 and owned trade count zero at the initial and 11:14:42Z comparison. Whole-row DB fingerprints matched through that comparison. A further read at 11:15:32Z showed **a changed public trade fingerprint**; owned remained unchanged. No task write or worker start occurred. Therefore a global “no Production trading-row changes throughout this task” assertion is **not** supported. The exact changed row count/cause is not established by these aggregate reads and was not investigated outside this phase. Naturally running services were not paused or modified.

The final aggregate count of copy_trades with close_reason=PROFIT_PROTECTION was zero in both namespaces. PP_CLOSED_RECORDS before/after below specifically denotes RECONCILED PP-state rows; the later close-tag check is separately identified, not substituted for an earlier uncollected observation.

No private exchange-account query was made. Zero order/position/SL/TP/close/exchange actions below means **zero initiated by this task**. It is not a statement about unrelated background/user exchange activity. No balances, credential values, private per-position rows or financial exports are published.

## Checks executed and limits

- `systemctl show`, effective unit/drop-in reads, process cwd and selected flag reads: read-only, verified above.
- `readlink -f`, marker read and raw source SHA-256 comparisons: exact target verified.
- Installed `node --check worker.mjs`: PASS; no module import/worker bootstrap.
- Explicit `BEGIN READ ONLY` aggregate/catalog queries with bounded timeouts: successful checks described above.
- Journal reads/counts: no canonical execution records in the inspected window.
- No runtime smoke, actual monitor tick, restart test, exchange integration test, policy evaluation or live automatic-enrollment test was performed.
- One initial read-only query referenced a nonexistent accounts.lease column; it failed without any write and was replaced by the required aggregate-only query. Local path/glob and raw Git buffer-limit corrections were diagnostic-only, not Production failures or fixes.
- No new build/test suite run was needed to decide the live safe-idle precondition. Earlier offline/SQL/CI acceptance is not counted as new live evidence.

## Files inspected / changed

Inspected exact application sources: server/futures-profit-protection/worker.mjs; api/copytrade.ts; api/_shared/futures-profit-protection.ts, futures-profit-protection-enrollment.ts, futures-profit-protection-lifecycle.ts and partner-copytrade-context.ts; server/partner-copytrade/main.ts, http.ts, service.ts, database.mjs and contract.mjs; relevant PP migrations/schema contracts and PP documentation. Installed worker/API bundle, corresponding installed owned sources/bundle, canonical unit/drop-in, service/journal/provenance and deployed RLS catalogs were inspected read-only.

Application source changes: NONE. Primary checkout dirty/untracked contributor work, including HANDOFF.md, was preserved untouched. Exact candidate remained at a045 with only preexisting untracked output/. No application/main/candidate history was changed. Only this report is committed to the separate AI-Log repository.

## Final required fields

```text
PHASE=PHASE-3-WORKER-SAFE-IDLE-SMOKE-PRECHECK
PRODUCTION_SHA=a0455626c0a54fb443f457e0a595a662974623fa
WORKER_SOURCE_SHA=a0455626c0a54fb443f457e0a595a662974623fa
WORKER_ENABLED_BEFORE=NO
WORKER_ENABLED_AFTER=NO
WORKER_ACTIVE_BEFORE=NO
WORKER_ACTIVE_AFTER=NO
WORKER_PID=0
WORKER_RESTARTS_BEFORE=0
WORKER_RESTARTS_AFTER=0
REAL_PP_BEFORE=ON
REAL_PP_AFTER=ON_UNCHANGED
DEMO_PP_BEFORE=ON
DEMO_PP_AFTER=ON_UNCHANGED
AUTOMATIC_ENROLLMENT_PATH=REACHABLE_IN_APPROVED_INSTALLED_SOURCE_AND_BUNDLE;NOT_EXECUTED
AUTOMATIC_ENROLLMENT_LIVE_OBSERVATION=NOT_SAFE_TO_VERIFY
PARTNER_COPYTRADE_ACTIVE=YES_UNCHANGED
PARTNER_PP_PATH=ACTIVE_OWNED_1S_SWEEP;SAME_MONITOR_FAMILY;OLDER_84F27C2_VERSION
PARTNER_PP_ISOLATION=BLOCKED
PP_STATE_BEFORE=PUBLIC:0;OWNED:0
PP_STATE_AFTER=PUBLIC:0;OWNED:0
PP_CLOSE_INTENTS_BEFORE=PUBLIC:0;OWNED:0
PP_CLOSE_INTENTS_AFTER=PUBLIC:0;OWNED:0
PP_CLOSED_RECORDS_BEFORE=PUBLIC:0;OWNED:0;RECONCILED_PP_STATE_ROWS
PP_CLOSED_RECORDS_AFTER=PUBLIC:0;OWNED:0;RECONCILED_PP_STATE_ROWS
DATABASE_MUTATION=NONE_BY_TASK;PUBLIC_TRADE_FINGERPRINT_CHANGE_OBSERVED_IN_BACKGROUND
TRADE_CHANGES=0_BY_TASK;GLOBAL_ROW_CHANGE_COUNT_AND_CAUSE_NOT_ESTABLISHED
POSITION_CHANGES=0_BY_TASK;NATIVE_STATE_NOT_QUERIED
ORDER_CHANGES=0_BY_TASK;NATIVE_STATE_NOT_QUERIED
SL_CHANGES=0_BY_TASK
TP_CHANGES=0_BY_TASK
CLOSE_ACTIONS=0_BY_TASK
EXCHANGE_ACTIONS=0_BY_TASK
WORKER_BOOTSTRAP=SOURCE_AND_SYNTAX_VERIFIED;RUNTIME_NOT_RUN
WORKER_MONITOR=SOURCE_AND_BUNDLE_VERIFIED;CANONICAL_RUNTIME_NOT_RUN
RESTART_LOOP=NONE_OBSERVED;CANONICAL_NOT_STARTED
DUPLICATE_PP_LOOP=NO_LOOP_ACTIVATED_BY_TASK;EXISTING_OWNED_SWEEP_PRESENT;LIVE_CROSS_RUNTIME_ACCEPTANCE_UNPROVEN
FINAL_CLASSIFICATION=PHASE3-SAFE-IDLE-BLOCKED
```

## Remaining gates and hard stop

A separately authorized, explicitly nontrading idle arrangement is needed before a canonical live smoke can be claimed. For example, an authorized OFF-switch arrangement would also require fresh checks for uncertain states/close intents because existing reconciliation paths can run even with switches OFF. No mode changes or implementation are proposed as already approved.

Mixed-version public/owned coexistence and native-account separation remain distinct evidence gates; do not solve them by restarting/upgrading partner-copytrade under this task. No live acceptance, manual enrollment, ARM/EXIT/CLOSE test, deployment, worker start, service change or next-phase action was taken.

Report publication is restricted to AI-Log/master, with secret scanning, diff review and remote-byte verification. The report commit and verified remote link are returned in the conversation. No backup/private snapshot/credential or exchange lifecycle artifact is included.
