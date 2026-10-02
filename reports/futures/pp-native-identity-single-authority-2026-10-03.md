# PP native position identity and single authority — partial local repair, NOT_PROVEN

## Metadata

- Date: 2026-10-03 (owner local date, UTC+08).
- Task ID / phase: PP-NATIVE-POSITION-IDENTITY-AND-SINGLE-AUTHORITY.
- Module: Futures Profit Protection identity / durable execution ownership.
- Mode: source audit, narrow local repairs, offline/disposable validation; no activation.
- Repository: SignalVerse; primary checkout HEAD unchanged: 0dbca62357a4adf34240f40ceda3e387356ec4b0.
- Candidate directory: tmp/futures-pp-auto-enrollment-20261002.
- Candidate branch: codex/futures-pp-auto-enrollment-20261002.
- Candidate starting/ending HEAD: e1fdc45f29b350670e707de3a7afa10b9153d689.
- Application commit/push/CI/deployment: NONE / NO / NOT_STARTED / NO.
- Report publication: documentation only to SignalVerse-AI-Log/master; receipt provided separately after remote byte verification.

## Executive result

نتیجهٔ کامل **NOT_PROVEN** است. دو نقص محدود، پس از بازتولید، فقط در کاندید محلی اصلاح شدند: رد شناسهٔ عددیِ بی‌دقت MEXC و خواندن دوبارهٔ پوزیشن پیش از مصرف حق اجرای یک‌بارمصرف در هستهٔ آزمایشی. اما مرجع مشترک هنوز به مسیرهای واقعی Canonical و Partner متصل نیست، هویت مشترک حساب/نسل پوزیشن اثبات نشده، و مجموعهٔ موجود یک assertion قرارداد تغییرات را رد کرد. هیچ فعال‌سازی، مهاجرت یا انتشار انجام نشد.

This is NOT completion of the requested root fix. It is NOT a release-ready candidate. The required 21,000-scenario acceptance matrix was NOT completed. Passing a synthetic registry kernel cannot establish native account/position mapping or installed-path mediation. No native account identifiers, API keys or private position evidence were obtained.

## Objective and scope

Audit every existing PP path before implementation; build native durable identity and mandatory shared authorization/execution only with proved identity. Preserve Canonical and Partner, dual confirmation as a gate, existing policy/entry/SL/ONE TP, native protection, scanner, Fast Trader, Spot and Demo. Real exchange calls, Production DML/DDL, worker activation and flags changes are forbidden.

Two locally reproducible identity/execution defects were repaired. Broader mediation was not wired using guessed account UUIDs, arbitrary generations, local trade IDs or API-key fingerprints. A trusted proof-reference string in a synthetic SQL fixture is not evidence from a real exchange.

## Actual source and call graph inspected

Line numbers below refer to the local candidate after its five-line MEXC addition; installed source remains unchanged.

| Area | Exact source / route | Current authority |
| --- | --- | --- |
| Canonical host | server/futures-profit-protection/worker.mjs:113 bootProfitProtectionWorker → compiled copytrade import; copytrade worker flag → ensureProfitProtectionMonitor → profitProtectionMonitorTick:16397 | Public-schema state/claim |
| Partner monitor | server/partner-copytrade/service.ts:94 sweep('profit-protection') → account market='usdm' → withPartnerCopytrade(context) → profitProtectionMonitorTick | Owned context and partner_copytrade-schema state/claim |
| Automatic enrollment | discoverOpenProfitProtection:16090 → enrollment helper → accepted entry/risk basis + native position → futures_enroll_profit_protection | Schema-local trade ID and PP identity |
| Evaluation | runProfitProtectionPosition:16273 → driveProfitProtection → unchanged evaluateProfitProtection → schema-local CAS save | Local trade/revision/intent |
| PP close | lifecycle EXIT_PREPARED → EXIT_SUBMITTED → close callback → closeBinanceTrade / closeGateTrade / closeMexcTrade → executeTrackedFullClose | trackedFuturesClosePorts:15979 → selected-schema futures_claim_position_close |
| Other managed exit | existingFuturesClose:15965 → same tracked adapters, reason EXISTING_EXIT | Same schema-local claim, not shared native authority |
| Flat / cleanup | lifecycle independent position read → FLAT_CONFIRMED → CLEANUP_PENDING → cleanupProfitProtection:16247 → owned protection absence confirmation | Native projection + local ownership evidence |
| Accounting | ownsClose / closeEvidence → reconcile callback → existing native PnL accounting | Local trade and local intent/token |
| Restart | EXIT_PREPARED → UNKNOWN; EXIT_SUBMITTED/UNKNOWN no close retry; monitor uncertain-intent flat reconciliation | Durable local hold, no proved global account/lifecycle hold |
| Candidate kernel | futures-native-exit-ownership.ts → public.futures_native_exit_* candidate SQL | Synthetic registered account/slot/epoch; no current production caller |

The Partner database wrapper dispatches approved RPC names to its tenant client. Its allowlist does NOT admit futures_native_exit_claim/spend/persist/reconcile. Shared reads are read-only. There is no narrow account-bound shared-authority bridge in either actual PP close callback.

The current public close-intent table has trade_id primary key, token unique, and active-instrument uniqueness on (telegram_id,exchange,symbol). Partner migration clones tables/functions into partner_copytrade. That uniqueness does not conflict across schemas and does not attest one native account. JavaScript in-flight Sets are process/account-local.

The new candidate SQL remains an explicitly NON-PRODUCTION prototype. It was neither changed nor applied to Production in this task.

## Native identity findings and documented semantics

### Binance

Actual getBinanceOpenPosition:8356 returns quantity, entry, direction and liquidation price. Its PP projection retains only quantity/entry/side. It rejects ambiguous responses and hedge mode; this is useful but not generation proof.

Native Position Information V3 documents symbol, positionSide, positionAmt and updateTime. It does not expose a stable position lifecycle ID in that response contract. updateTime is an update timestamp, not a unique open-generation ID. Two synthetic responses with different updateTime yield exactly the same current adapter output. An identical-size/price close-and-reopen cannot be excluded by the present projection alone. [Binance Position Information V3](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade#position-information-v3-user_data).

Binance Futures Balance documents accountAlias as a unique account alias. This is a potential native account proof source, NOT evidence acquired or wired by this task. The existing PP native-position input has no such account binding. Do not claim Binance has no account identifier anywhere. [Binance Futures account API](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/account).

### Gate

Actual getGateOpenPosition:7683 returns only size, avgPrice and side after checking contract/mode='single'. Gate documents user, contract, mode, open_time (First Open Time), update_id, and pid (Sub-account position ID). These native fields are currently discarded.

Important correction to an overly broad inference: the examined Gate documentation DOES contain position/open-time identity fields. It is incorrect to say Gate exposes no position identifier at all. pid is described specifically for sub-account positions; universal availability, uniqueness scope, lifetime/reuse and complete account linkage are not proved by a sample field or integer alone.

Synthetic responses differing in user, pid and open_time still produce identical outputs from the actual existing adapter. This demonstrates projection loss, not a claim that real Gate currently has overlapping positions. A proof-bearing account/contract/mode/lifecycle projection still needs to be specified and retained. [Gate Position schema](https://www.gate.com/docs/developers/apiv4/en/futures/#position).

### MEXC

The native endpoint documents positionId as a long, plus symbol, positionType, state, holdVol and createTime. Current adapter retains positionId/size/entry/side, but not a shared native account binding or complete mode/state/generation evidence. No account UID source or cross-key alias proof was obtained. Do not infer an account from one API key or local actor. [MEXC Get Open Positions](https://www.mexc.com/api-docs/futures/account-and-trading-endpoints/get-open-positions).

Confirmed precision defect: distinct native integers 9007199254740992 and 9007199254740993 alias after normal JavaScript Number decoding. The prior adapter accepted the resulting rounded number and converted it to the same decimal string. The local repair rejects non-string IDs unless they are positive safe integers; exact decimal strings remain intact. It does NOT recover already-lost JSON precision or claim all native payloads are now losslessly decoded. If the upstream transport has rounded an ID, the correct local result is denial, not reconstruction.

## Reproduced defects and exact local changes

1. api/copytrade.ts, getMexcOpenPosition: five added lines validating ID representation before String conversion. Unsafe numeric / unsupported values raise MEXC native position identity precision is unverified. Existing full-close payload, quantity rules, policy and SL/TP are untouched. This validation also affects other callers of this shared MEXC position reader; it can deny an operation whose ID precision is uncertain. That is an identity rejection, not a new order/execution strategy.
2. api/_shared/futures-native-exit-ownership.ts: independently re-read the native identity/quantity/entry/side after durable claim and before one-time spend; recheck authorization freshness. Failed/changed read retains the claim hold and cannot spend/submit. This module is still unintegrated with actual PP callers.

Before repair, an isolated claim callback changed native quantity from 1 to 2; the prototype spent and submitted one synthetic close using the stale pre-claim snapshot. After repair, the exact scenario produces zero spend and zero synthetic POST and raises NATIVE_POSITION_CHANGED_BEFORE_EXECUTION.

This second read reduces a specific local admission race. It is NOT an exchange-atomic lock or guarantee against a position changing after preflight. No production guarantee is implied.

No SQL, policy, lifecycle, enrollment, Canonical host, Partner host/wrapper/contract or actual tracked-execution helper was modified.

## Files changed / created by this task

Application candidate edits:

- tmp/futures-pp-auto-enrollment-20261002/api/copytrade.ts — five-line exact-ID denial.
- tmp/futures-pp-auto-enrollment-20261002/api/_shared/futures-native-exit-ownership.ts — second pre-execution identity/snapshot/freshness read (previously untracked local prototype).

Local diagnostic/test evidence:

- tmp/pp-native-identity-20261003/diagnose.mjs — AST-isolated actual reader functions + before/after kernel counterexample.
- tmp/pp-native-identity-20261003/test.mjs and crash-child.mjs — mechanical copies of the previously inspected disposable test harness, preserving the previous task's runner/results.
- tmp/pp-native-identity-20261003/summarize.mjs — read-only integrity/result comparison.
- Generated before.json, after.json, results.json, summary.json remain local and untracked.
- New read-only capture: tmp/pp-path-comparison-20261003/runtime-native-identity-audit.json.
- This dated report and HANDOFF.md classification entry. Existing dirty/private work preserved.

## Checks executed

Node v22.23.3; no API bootstrap, .env, private account key or exchange transport loaded by tests.

### Actual adapter counterexamples

Before: 2026-10-02T20:28:52.670Z → 20:28:52.787Z.
After final diagnostic: 2026-10-02T20:31:12.210Z → 20:31:12.338Z.

Command: node tmp/pp-native-identity-20261003/diagnose.mjs [--after].

Ten final named groups: Binance projection loss and Gate projection loss remain reproducible; distinct MEXC string IDs preserved; two unsafe numeric IDs rejected; twelve malformed IDs rejected; four exact/safe IDs accepted; malformed reads rejected for all three venues; claim-to-spend quantity change denied with zero fake posts. Synthetic native reads 27; actual exchange calls/orders/closes 0.

Passing assertions here include assertions that reproduce unresolved defects. Do NOT label the ten groups native-mapping acceptance PASS.

### Disposable PostgreSQL kernel regression

Command: node tmp/pp-native-identity-20261003/test.mjs.
Run: 2026-10-02T20:30:58.291Z → 20:31:57.133Z.
Environment: fresh private loopback cluster, PostgreSQL 18.6 x86_64 Windows; synthetic superuser registrar; actual two SQL actor roles; no existing DB URL/env/key; cluster stopped/removed by runner.

- 3000 shared kernel races, 1000 each venue: exactly one synthetic owner, authorization, spend and fake close.
- 3000 dual kernel races: 20 cases ×150; 600 authorized, 2400 denied.
- 76 named additional checks: account-role/JWT boundary, missing binding, identity mismatches, private table denial, malformed input, incomplete flat evidence, same-token 100-way concurrency, uncertain response/partial/freshness/hold/restart/rollback/disconnection, ten actual disposable OS-child kills.
- Kernel recorded doubleAuthorization=0, doubleClose=0, twoOwners=0; dual mismatchClose=0.
- Errors=0; disposable clusterRemoved=true.

These are synthetic-registry kernel tests, NOT concurrent Canonical/Partner production handlers sharing native account evidence. Twenty case groups/76 checks are not 1000 crash scenarios. Ten OS kills are not 1000 OS kills. Ownership/authorization/execution checks in one race are not three separately counted race sets.

### Required matrix status

| Required distinct acceptance category | Required | Completed for actual integrated paths |
| --- | ---: | ---: |
| Ownership races | 5000 | 0 |
| Authorization races | 5000 | 0 |
| Execution races | 5000 | 0 |
| Restart/crash scenarios | 1000 | 0 |
| Stale owner | 1000 | 0 |
| Stale authorization | 1000 | 0 |
| Identity mismatch | 1000 | 0 |
| Duplicate retry | 1000 | 0 |
| Cross-path Canonical vs Partner | 1000 | 0 |

The 6000 kernel races are reported separately, not allocated/recounted to fill this 21000-scenario acceptance matrix. It is incomplete because actual mandatory mediation and a proved native registrar are absent. Repeating a fabricated registry does not close that gap.

### Existing offline regression: FAIL retained

Command:
node --test scripts/futures-profit-protection-test.mjs scripts/futures-profit-protection-adapters-test.mjs scripts/futures-profit-protection-enrollment-test.mjs

Result: 146 tests, 145 pass, 1 fail, 0 skip, exit 1.

Exact failed test: legacy parity permits only the exact approved PP delta and rejects unrelated Spot edits.
Location: scripts/futures-profit-protection-test.mjs:301.
Exact error: Only exact Phase 3B capability delta: api/copytrade.ts.
Stack: beforeVerifyOnlyProfitProtection, scripts/lib/futures-profit-protection-verify-only-parity.mjs:11:10.

Cause is confirmed by the closed-byte historical allowlist: it admits normalized copytrade hashes 92e4400b... / 61977ce8..., not the new native-ID validation delta 5fcd8468.... This is an introduced release-contract failure from the new source bytes, not a pre-existing baseline failure and not an observed strategy behavior regression. The assertion/allowlist was not relaxed, normalized away, skipped or updated. Exact scope contract acceptance for this new delta remains a release blocker.

### Static build/type checks

- git diff --check: exit 0.
- esbuild, write:false, Node22 target: actual copytrade bundle 1145185 bytes; candidate native-ownership module 12514 bytes. No runtime files written.
- Targeted tsc of futures-native-exit-ownership.ts with noEmit/esnext/bundler/es2022/allowImportingTsExtensions/skipLibCheck: exit 0.
- Full API/frontend independent baseline diagnostic, Web/Admin full build, official CI: NOT_RUN. Do not infer zero full-project introduced diagnostics from a targeted check.

## Source integrity and exact evidence hashes

Twelve tracked policy/lifecycle/execution/enrollment/host/Partner/SQL files compare equal to e1fd after CRLF→LF normalization. All actual native close payload functions and Binance/Gate reader functions are unchanged; tracked diff is only the five-line MEXC validation. The prior candidate SQL raw hash is unchanged.

| Local evidence | SHA-256 |
| --- | --- |
| copytrade.ts after | 5fcd84689c95f6db1def3dac884ce56fd6c8891d1dc60418aa8ca6ab50996125 |
| Native ownership module after | 10d62b4b04bb6f7e16aadffa0dfb963488d7bc75da579d24d9e52d531fa865c4 |
| Candidate SQL unchanged | cbdac629890fcb5d3a567b160946b62c17da9b3858c4da7e15f5c521516d5ebe |
| Before diagnostics | 200c0a6a974cb80365a178fd15924012c3232470b91fa71f652030bf0e3b1fb3 |
| After diagnostics | e66f85109bea4d0823e5a48a549bf17ef48de2a0ee43fd01283fc6ad83ebb78f |
| Fresh kernel results | f9b10eb80f08cd8dea8347ed9ec0bde0d9dabb9def6a88544b5947f1bce7c541 |

Do not overwrite the prior report/results at pp-shared-ownership-20261003. Previous cross-schema counterexamples remain evidence; this local prototype has not fixed the installed paths.

## Production safety / independent read-only observation

A single bounded read-only SSH capture used the previously inspected script: systemctl show, source hash/mtime, marker/symlinks/cwd, sanitized four process flags; PostgreSQL REPEATABLE READ READ ONLY, bounded 8s statement/2s lock timeouts, ROLLBACK. No account/trade row contents or exchange credentials were read. Aggregate PP counts and catalog only. No exchange API call.

Previous independent checkpoint: 2026-10-02T19:59:40.794325Z.
New checkpoint: 2026-10-02T20:31:54.439569Z.

Marker/app/admin/cwd remain e1fdc45f29b350670e707de3a7afa10b9153d689. Partner source remains 84f27c2e40b02b0dbf61c58429cf7c45f4f852da and bundle fbd6312f1d9d0ba501eaed4ef4cf0bda1732cfe6ca00acab676a405538a8b1f1. All 23 installed source hash/mtime pairs, catalog/control metadata, links and seven inspected unit property sets compare equal to the previous checkpoint.

| Unit | PID | State / enabled | NRestarts |
| --- | ---: | --- | ---: |
| Application | 3202681 | active / enabled | 0 |
| Admin | 3202627 | active / enabled | 0 |
| Observer | 3202625 | active / enabled | 0 |
| PostgREST | 1960930 | active / enabled | 0 |
| Canonical PP | 0 | inactive / disabled | 0 |
| Existing Partner | 3092803 | active / enabled | 0 |
| Partner PostgREST | 3092801 | active / enabled | 0 |

REAL_PP=true and DEMO_PP=true were ALREADY set, unchanged, updated_at=2026-10-01T22:02:54.495Z. They were not turned ON or OFF by this task. Public and owned PP state/intents/PP-closed aggregate counts are all 0 in both snapshots. This does not prove global account inactivity or the absence of unrelated background trading.

PRODUCTION_TOUCHED=NO means no mutation by this task; read-only observation did occur. Partner was inspected read-only and was not changed/stopped. No canonical Worker start/enable, Guard, artifact, migration, deployment or service operation occurred.

## Remaining root blockers / next local engineering contract

1. Prove and retain exchange-native account identity across both namespaces and across distinct API keys/subaccounts, without credentials in evidence. A local trade UUID, telegram actor or per-key fingerprint is insufficient.
2. Establish a durable native account/product/settlement/symbol/mode/side slot and independently proved lifecycle/generation. Binance requires a documented lifecycle source / conservative fresh-entry+flat correlation contract; cannot use updateTime as a permanent ID. Gate must preserve and validate its relevant user/open_time/pid semantics rather than assume optional fields guarantee uniqueness. MEXC needs exact lossless position ID plus native account/mode/state/lifecycle proof.
3. Provide a trusted registrar / attestation producer. Candidate SQL proof_reference and arbitrary epoch text are currently synthetic fixtures, not authoritative evidence.
4. Wire both actual close admission paths to the SAME shared authority, with account-bound narrow RPCs retaining Partner RLS. The old schema-local claim may not remain a bypass for a managed native epoch. Preserve manual/native protection/reconciliation; do not disable monitors to pretend coordination.
5. Bind shared claim/authorization/consumption atomically to persisted original policy state, source revision/intent, current controls, native proof and incarnation. Existing prototype lacks this full atomic integration.
6. Preserve independent dual gate: same native identity/snapshot/version/evaluation, authenticated durable Canonical and Partner confirmations, one shared authorization. Calling the same pure policy twice in an offline fixture is not evidence of two authenticated live monitor confirmations.
7. Extend flat/cleanup/reconciliation to exact winner and current native lifecycle, retaining uncertain holds and tombstones; never release a consumed/uncertain epoch on TTL alone.
8. Review narrowly pinned source-scope contract for the new authorized identity-only delta without weakening unrelated-code rejection. Then execute all nine required matrix categories separately on integrated actual paths, plus both positive and missing-evidence denial cases for each venue.

These are unresolved implementation/proof requirements, not completed features. No further Production authority is requested or inferred. Until these are implemented and measured, neither architecture nor activation can be declared proved.

## Final classification

The overall invariants below are NOT_MEASURED for a complete integrated native system, not zero. The prototype's bounded counters above remain separate. Current native projections contain demonstrated ambiguity/loss; the pre-repair kernel also had one simulated stale-snapshot submission, fixed locally. Do not erase it by reporting a global zero.

```text
PHASE=PP-NATIVE-POSITION-IDENTITY-AND-SINGLE-AUTHORITY
NATIVE_POSITION_IDENTITY_PROVEN=NO
SHARED_OWNERSHIP_PROVEN=NO
SINGLE_EXECUTION_AUTHORITY_PROVEN=NO
DUAL_CONFIRMATION_PROVEN=NO
CROSS_PATH_CONCURRENCY_PROVEN=NO
RESTART_SAFETY_PROVEN=NO
FAIL_CLOSED_PROVEN=NO
IDEMPOTENCY_PROVEN=NO

DOUBLE_AUTHORIZATION=NOT_MEASURED_INTEGRATED
DOUBLE_CLOSE=NOT_MEASURED_INTEGRATED
TWO_OWNERS=NOT_MEASURED_INTEGRATED
TWO_EXECUTORS=NOT_MEASURED_INTEGRATED
IDENTITY_COLLISION=NOT_MEASURED_INTEGRATED
IDENTITY_AMBIGUITY=NOT_MEASURED_INTEGRATED
STALE_AUTH_CLOSE=NOT_MEASURED_INTEGRATED
STALE_OWNER_CLOSE=NOT_MEASURED_INTEGRATED
RESTART_DUPLICATE_CLOSE=NOT_MEASURED_INTEGRATED
RETRY_DUPLICATE_CLOSE=NOT_MEASURED_INTEGRATED
MISMATCH_BYPASS=NOT_MEASURED_INTEGRATED
CROSS_PATH_DUPLICATE_CLOSE=NOT_MEASURED_INTEGRATED
UNVERIFIED_NATIVE_IDENTITY_CLOSE=NOT_MEASURED_INTEGRATED

PRODUCTION_WORKER_STARTED=NO
PRODUCTION_TOUCHED=NO
REAL_EXCHANGE_CALLS=0
REAL_CLOSE_ACTIONS=0
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI=NOT_STARTED
DEPLOYMENT=NO
FINAL_CLASSIFICATION=NOT_PROVEN
STOP
```
