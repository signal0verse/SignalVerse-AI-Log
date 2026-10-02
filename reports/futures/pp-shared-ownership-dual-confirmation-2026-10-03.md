# Futures Profit Protection — shared native ownership kernel and dual-confirmation assessment

## Metadata / executive result

- Date: 2026-10-03 Asia/Kuala_Lumpur; report evidence compiled 2026-10-02T20:01:40Z.
- Task: PROFIT-PROTECTION-SHARED-OWNERSHIP-THEN-DUAL-CONFIRMATION.
- Mode: local development, disposable PostgreSQL/synthetic transport, and read-only installed source/runtime/catalog inspection. No live Worker activation.
- Primary application checkout: HEAD `0dbca62357a4adf34240f40ceda3e387356ec4b0`, unchanged; existing dirty/private work preserved.
- Isolated development checkout: `tmp/futures-pp-auto-enrollment-20261002`, HEAD `e1fdc45f29b350670e707de3a7afa10b9153d689`, unchanged. Two new untracked candidate files; no existing tracked executable file changed.
- Canonical runtime: `e1fdc45f29b350670e707de3a7afa10b9153d689`.
- Independently pinned Partner runtime: `84f27c2e40b02b0dbf61c58429cf7c45f4f852da`.
- Starting evidence: [permanent prior comparison](https://github.com/signal0verse/SignalVerse-AI-Log/blob/fc1fe58bc08ef87f6d7da447ce2bd0941bfd1936/reports/futures/pp-path-comparison-2026-10-03.md). Its failures are NOT reclassified or superseded by isolated-kernel results.

**ARCHITECTURE_RESULT = NEITHER_PROVEN. PRODUCTION_READY = NO.**

Implemented and tested a local shared authority kernel, then a local dual-confirmation prototype because complete shared-path mediation/native attestation could not be proven. Final disposable run: 3000 shared races, 3000 dual-confirmation races, 76 named checks, ten actual disposable OS-child kills; zero double authorizations/fake close proposals in that bounded kernel. Existing offline regression suite: 146/146. Targeted TypeScript and in-memory module bundle PASS.

These are NOT acceptance of the complete installed architecture. The new module has no current application/Partner callers. There is no verified native UID/subaccount/position-generation registrar. Existing PP and legacy exit RPCs remain schema-local and reachable without this kernel. Four new RPC calls through the unchanged Partner database wrapper were actually rejected with `RPC_DENIED`, before any I/O. Dual confirmation has the same unresolved execution authority/native-identity integration dependency. Therefore neither architecture may be selected or activated.

## 1. Current architecture / actual call paths

Source line references below use the isolated `e1fdc45...` checkout unless explicitly labelled installed Partner. This task inspected source and captured installed source hashes; it did not invoke the live financial handlers.

```text
Canonical dedicated Worker (currently disabled/inactive/PID 0)
  server/futures-profit-protection/worker.mjs
  -> existing financial bundle
  -> profitProtectionMonitorTick                    api/copytrade.ts:16392
  -> runProfitProtectionPosition                   api/copytrade.ts:16268
  -> driveProfitProtection / original deterministic policy
  -> existing native close adapter
  -> executeTrackedFullClose
  -> trackedFuturesClosePorts                      api/copytrade.ts:15974
  -> profitProtectionDB.rpc(futures_claim_position_close)
  -> schema-local close intent -> native submit -> read native FLAT
  -> cleanupProfitProtection                       api/copytrade.ts:16242
  -> existing local reconciliation

Partner installed bundle (pre-existing active, separately pinned 84f27...)
  server/partner-copytrade/service.ts:101
  -> account-bound owned context
  -> explicit profitProtectionMonitorTick
  -> same original policy/native close function bodies
  -> ownedDatabase.rpc                             database.mjs:20
  -> partner_copytrade.futures_claim_position_close

Existing exit
  -> existingFuturesClose                          api/copytrade.ts:15960
  -> optional tracked close context
  -> schema-local RPC when context exists
  -> legacy direct native submit when context is undefined

New candidate kernel
  -> NO import/caller from any of the above paths
```

`existingFuturesClose` returns undefined for Fast/Whale positions (15963), missing-migration error codes (15967), or no PP position (15970). The native close adapters use conditional tracked execution at lines 658 (MEXC), 7871 (Gate), 8844 (Binance). These paths remain byte-preserved, not silently rerouted or disabled. They are concrete complete-mediation gaps, not evidence of a safe global lock.

The installed old Partner monitor and canonical `e1fd...` monitor differ in automatic-discovery integration, as established in the prior report. This task preserves automatic enrollment and does not retrofit the pinned Partner bundle. An unset canonical Worker flag does not disable Partner's explicit PP sweep.

## 2. Confirmed root cause and unchanged historical failures

1. Existing CAS/claim uniqueness is by schema-local trade IDs. Two rows in public and owned schemas can describe one native position without contesting one shared native owner.
2. The owned registry's API-key HMAC uniqueness is not native account UID/subaccount attestation; it cannot prove account identity across key rotation/aliases or across schemas.
3. MEXC has a native position ID which must remain an exact decimal string. For Binance/Gate, symbol/side/entry/quantity alone cannot distinguish a later reopened generation with identical values.
4. Partner's current PP claim attempts `FOR SHARE` on a SELECT-only control view and receives PostgreSQL 42501. This is an availability/permission failure, not proof of shared ownership. No permission repair was performed.
5. Legacy exits and current PP claims do not use the proposed authority. A proof about its unique index cannot establish that these independent paths cannot bypass it.

Prior comparison findings remain permanent: 1000 actual-role Canonical-PP versus Partner-EXISTING_EXIT races had 1000 double authorizations and 1000 double fake close proposals. Another 1000 privileged diagnostic races doubled, but were not current Production privileges. Actual-role PP-versus-PP had 1000 Partner permission rejections, not shared-lock acceptance. These groups were NOT rerun or counted as the new kernel's races and were NOT converted into live trading failures or safe acceptance.

## 3. Shared Ownership design / identity formula

The kernel's durable identity is a native account registry, a native slot and a non-replayable generation, not a local DB trade UUID.

```text
account registry uniqueness:
  exchange + product + settlement + attested native UID + native subaccount

slot uniqueness:
  account registry UUID + native symbol + position mode + slot side
  ONE_WAY slot side = BOTH; HEDGE slot side = LONG or SHORT

epoch:
  independently verified native position generation
  MEXC additionally requires exact native position ID (decimal string)

nativeExitKey ordered JSON tuple:
  [accountRegistryUUID, exchange, product, settlement, nativeSymbol,
   positionMode, slotSide, verifiedEpoch, direction, nativePositionId]

global owner primary key:
  (nativeSlotUUID, verifiedEpoch)
  plus one unresolved active owner per nativeSlotUUID
```

Registry UUIDs are references to attested account records, NOT themselves native-account proof. Binding records connect each namespace/peer/local-trade reference to that one native slot/epoch. The test registrar is explicitly a **synthetic superuser fixture**, never a real native attestation. No real UID, subaccount, native account mapping, account secret, position epoch or existing private position was fabricated/read/populated.

The proposed trusted registrar must verify actual native account and generation linkage, including alias/key-rotation consistency, before any real binding can be admitted. That producer and its real-data evidence do not exist in this candidate. There is no fallback from missing attestation to local row ID, API key fingerprint, symbol/side/time rounding, or a made-up real generation.

## 4. Actual implementation / exact files changed

Two new candidate files, both clearly labelled LOCAL ONLY:

| Path within isolated development checkout | Actual implementation | What it does NOT implement |
|---|---|---|
| `api/_shared/futures-native-exit-ownership.ts` | Native tuple validation; context/entry/quantity/freshness checks; readback identity check; shared claim + one-time spend; original tracked full-close ordering; two independent pure-policy evaluations and one executor | No runtime callers, account-attestation producer, original PP-row CAS transaction wrapper, Partner message protocol, or actual exchange bootstrap |
| `migrations/futures_native_exit_authority_candidate.sql` | New private registry/slot/peer/binding/owner schema; unique owner and active-slot indexes; narrow actor/Partner-account resolver; shared public claim/spend/persist/reconcile RPCs; direct registry/owner access denied | NOT a Production-ready migration; no old-RPC replacement, native registry population, schema backfill, activation, historical repair or complete position/RLS/cleanup integration |

Local harness files:

- `tmp/pp-shared-ownership-20261003/test.mjs`: final disposable races/adversarial checks, per-race recording, temp-cluster lifecycle.
- `tmp/pp-shared-ownership-20261003/crash-child.mjs`: disposable SQL child, five commit/execution boundaries for both roles.
- `tmp/pp-shared-ownership-20261003/audit-evidence.mjs`: independently compares before/after captures, unchanged source and recorded test counts/hashes.
- Existing read-only capture tooling in `tmp/pp-path-comparison-20261003` was reused without changing its financial boundaries.
- This report and a task-specific addition to primary `HANDOFF.md` are documentation only.

No existing application, Partner, PP policy/lifecycle/execution/enrollment, native adapter, SQL admission function, Spot, strategy/engine/risk, scanner, Fast Trader, workflow, Guard or service file was modified. Candidate output was pre-existing and preserved. No new application commit or push.

Kernel transition:

```text
no owner
  -> RESERVED (only first successful INSERT)
  -> EXECUTION_SPENT (same peer/trade/token/incarnation/evaluation CAS, once)
  -> UNKNOWN (uncertain outcome: durable hold, no TTL takeover or blind retry)
     or FLAT_CONFIRMED (verified zero quantity + native reference + positive fill)
  -> RECONCILED (same owner, after stored FLAT; epoch tombstone retained)
```

Only the winner receives a successful claim. Identical duplicate tokens cannot spend twice. Changed incarnation cannot spend an old reservation. Lost spend acknowledgment is a stop, not a retry. Reconciled epochs remain permanently non-replayable.

The prototype's reconcile RPC only requires stored FLAT evidence. It does **not** yet require or atomically bind existing owned-order disappearance, protection cleanup and financial settlement/reconciliation evidence. Therefore it is not a replacement for the original lifecycle's complete reconciliation, nor proof of eventual safe slot-generation rollover.

## 5. Test method, commands and environment

Final disposable test interval: **2026-10-02T19:57:57.921Z -> 2026-10-02T19:58:53.821Z**.

Environment: Windows, Node v22.23.3, PostgreSQL 18.6 (MSVC x86_64). Private fresh loopback cluster, random port, trust authentication limited to the synthetic cluster; explicit private data-directory verification; 110 maximum connections. It never reads .env, Production DB URLs, exchange credentials, live bootstrap, or external exchange clients. Cluster stop/removal succeeded and only its checked temporary directory was removed.

```powershell
# Portable Node 22 used; commands shown without any secret-bearing environment.
node --experimental-strip-types tmp/pp-shared-ownership-20261003/test.mjs
node tmp/pp-shared-ownership-20261003/audit-evidence.mjs

# From the isolated development checkout:
node --experimental-strip-types --test --test-reporter=spec `
  scripts/futures-profit-protection-test.mjs `
  scripts/futures-profit-protection-adapters-test.mjs `
  scripts/futures-profit-protection-enrollment-test.mjs

node node_modules/typescript/bin/tsc --noEmit --target ES2022 `
  --module ESNext --moduleResolution Bundler --allowImportingTsExtensions `
  --skipLibCheck --types node api/_shared/futures-native-exit-ownership.ts
```

Additional executed checks:

- Three harness scripts `node --check`: PASS.
- Esbuild `bundle:true`, Node22/ESM, `write:false` for the new module: PASS, one in-memory output, 11691 bytes; no bundle written/activated.
- Actual unchanged `ownedDatabase` import with synthetic tenant/shared stubs: all four new native RPCs throw `RPC_DENIED`, zero transport calls. This is evidence of **incomplete integration**, not a successful release gate.
- Git source/body comparison: eleven inspected existing sources/migrations equal the pinned candidate after LF normalization; all existing tracked files have an empty candidate Git diff.
- `rg` import/caller search across api/server/scripts/migrations: only new SQL definitions/grants, no application caller of new module/authority.
- Independent read-only capture comparison: before/after runtime/source/mtime/selected catalog/control evidence exactly equal, excluding collection timestamp.

No official CI, Linux runtime CI, Web/Admin rebuild, application artifact, Guard or release was run. Targeted type success is not a claim of a whole-repository TypeScript gate. Existing offline suite: **146 tests, 146 pass, 0 fail, 0 cancelled, 0 skipped, 0 todo**.

## 6. Shared races — exact counts / scope

Each pair has the same synthetic attested native account/slot/epoch, venue, symbol, direction, native entry/quantity, PP state/peak/PnL/trigger and evaluation time. Local trade/request IDs differ by namespace. Both unchanged pure policies independently produce CLOSE before concurrent attempts. Alternate launch ordering; independent PostgreSQL connections and actor roles. Both use the new controller and the **actual unchanged** `executeTrackedFullClose`, but close/readback transport is synthetic.

| Shared group | Races | Exactly one owner | Zero owners | Double authorization | Double fake close proposal | Two owners |
|---|---:|---:|---:|---:|---:|---:|
| Binance synthetic native slot | 1000 | 1000 | 0 | 0 | 0 | 0 |
| Gate synthetic native slot | 1000 | 1000 | 0 | 0 | 0 | 0 |
| MEXC exact-string synthetic native ID | 1000 | 1000 | 0 | 0 | 0 | 0 |
| Total | **3000** | **3000** | **0** | **0** | **0** | **0** |

1500 LONG and 1500 SHORT; both one-way and hedge slots. Each final owner reaches stored FLAT in successful synthetic transport cases; 3000 successful single spend/proposals. Per-race Canonical claim, Partner claim, owner, authorization, close proposal, execution proposal, token, native tuple, venue and side are retained locally in `results.json`. Its evidence checksum appears below. Raw test artifacts/private catalog captures are not committed to AI-Log.

This is 3000 **new-kernel races**, NOT 3000 production-handler/native-private-account integration races. The counter totals do not erase the old paths' demonstrated bypasses.

## 7. Restart results

Eleven named restart/state-boundary checks all passed in the kernel:

| Scenario | Subsequent fake close proposals | Meaning |
|---|---:|---|
| BEFORE_CLAIM | 1 | No committed reservation; a fresh contender may become sole owner |
| AFTER_CLAIM | 0 | Durable reservation blocks contender; changed incarnation denied |
| AFTER_AUTHORIZATION | 0 | No second claim or stale incarnation spend |
| BEFORE_EXECUTION | 0 | Committed hold retained |
| AFTER_PROPOSAL | 0 | Spent right is non-replayable |
| AFTER_SIMULATED_CLOSE | 0 | Stored FLAT is not another execution permission |
| RESTART | 0 | Spent state retained |
| STALE_OWNER | 0 | No ownership stealing or implicit expiry release |
| DUPLICATE_WORKER | 0 | Another local invocation cannot claim |
| DELAYED_WORKER | 0 | Another invocation cannot steal committed hold |
| SIMULTANEOUS_RESTART | 0 | Reserved state rejects alternate claimant |

These eleven checks construct representative committed stages and reconnect through a fresh SQL connection. The names are NOT proof of eleven full financial Worker boots, all scheduling interleavings, or two actual Production Workers restarting concurrently. Real concurrent controller calls are exercised by the 3000 races/100-duplicate test; actual OS-child termination is separately documented next.

## 8. Crash / transaction / uncertainty results

**Ten actual disposable OS-child kills**, both Canonical-role and Partner-role SQL fixtures, two per stage:

| Child killed at | Cases | Prior fake submits per case | Subsequent proposal per case | Double close |
|---|---:|---:|---:|---:|
| UNCOMMITTED claim | 2 | 0 | 1 after PostgreSQL rollback | 0 |
| Committed CLAIMED | 2 | 0 | 0 | 0 |
| Committed SPENT | 2 | 0 | 0 | 0 |
| FAKE_SUBMIT after spend | 2 | 1 | 0 | 0 |
| Stored FLAT | 2 | 1 | 0 | 0 |

The child is only a disposable SQL/fake-submit fixture, NOT actual financial Worker bootstrap. Only its known child PID is killed. No Production PID/service is killed, started or restarted.

Additional real SQL checks: transaction ROLLBACK and connection death before commit both leave no owner; the other actor can then obtain exactly one fresh claim. Committed reservations are never released by a timeout. Expired RESERVED hold cannot be spent/stolen. Reconciled generation cannot be reauthorized.

Injected controller failures: unreadable native preflight and wrong native readback identity produce zero first-actor authorization/submission; a separately fresh valid actor may subsequently be sole owner. Response timeout/partial native remainder preserve UNKNOWN and block another submit. Lost durable spend acknowledgment has one committed spend but **zero submissions**, retains the hold, and blocks retry. Availability is sacrificed on ambiguity; this is not exact-once eventual completion or evidence that the real exchange always closes.

## 9. Idempotency results

- Same decision/token submitted **100 times concurrently**: 1 authorization, 1 spend, 1 fake submission; 99 denied attempts.
- Same evaluation/trade/epoch with another token or actor: cannot acquire a second owner.
- Restart/incarnation replacement cannot use old reservation's spend.
- Transaction rollback is not a committed ownership hold; committed/spent/UNKNOWN holds never expire into permission to resubmit.
- Same reconciled generation remains a durable tombstone; no old-epoch replay.
- SQL entry and quantity changes reject at both claim and spend (four additional checks).

**IDEMPOTENCY_FAILURE = 0 in tested kernel/controller cases.** Current installed call paths were not converted to this authority, so this does not prove complete installed idempotency.

## 10. Duplicate-close / flat / cleanup results

New-kernel shared races: zero double authorization/close/two owners. Dual races: zero double authorization/close. Restart/OS-kill/100-duplicate/unknown-outcome cases: no second executable fake close. Original `executeTrackedFullClose` remains responsible for preflight, freshness, native fill and independent post-submit FLAT read; it was not replaced or weakened.

The new kernel itself does not call native protection cleanup or settle financial rows. Full cleanup/reconciliation composition has **not** been implemented/proven for both paths. Original offline adapter/lifecycle tests still demand independent FLAT before owned-protection cleanup and preserve UNKNOWN on uncertainty. That existing regression success does not prove an atomic connection between old cleanup and the new native authority.

## 11. Native identity / account authorization results

Thirty groups of nine identity-field mismatches = **270 synthetic mismatch rejections**: account, exchange, product, settlement, native symbol, position mode, direction, verified epoch and native position ID. No owner created by those inputs. MEXC fixture IDs exceed JavaScript safe-integer range and stay exact decimal strings.

Additional PASS checks: direct owner-row UPDATE denied for both roles; private registry SELECT denied for both; Partner account JWT mismatch denied; cross-role peer spoof denied both directions; missing trade binding denied; malformed UUID request errors without granting ownership; four claim/spend entry/quantity mismatches denied; reconcile-before-FLAT denied; three incomplete FLAT-evidence variants denied.

This narrow role/registered-binding test is NOT complete existing account RLS integration. Trusted fixture bindings are synthetic; SQL does not inspect real `copy_trades`/PP state/revision or original transactional close intent. The controller does not prove the native-symbol/generation provenance of both policy states merely because two supplied tuples match. Registry account/slot locking and unique keys are useful only when the registrar and all caller bindings are genuinely correct and protected.

**Real native account/position mapping = NOT_PROVEN. Real position-generation replacement/alias/key-rotation acceptance = NOT_PROVEN. No real private API was called to manufacture that evidence.**

## 12. Shared ownership outcome / mandatory acceptance

| Requirement | New isolated kernel | Complete Canonical + Partner architecture |
|---|---|---|
| >=3000 races | PASS, 3000 | NOT_PROVEN; full caller composition not tested |
| Durable shared atomic reservation/spend | PASS in fresh DB | Not wired to current RPC paths |
| Zero duplicate authority/close | PASS bounded | Prior actual-path counterexamples remain |
| Crash/restart/uncertainty safety | PASS bounded | Full Worker composition not proven |
| Native identity cannot alias/reopen silently | Synthetic mismatch rejection | Registrar/native generation proof absent |
| Neither path can bypass | Not claimed | **FAIL**: current paths have no new-authority callers |
| Schema separation cannot isolate lock | Shared public RPC/protected schema in fixture | Partner wrapper denies new public RPC and uses its existing schema |
| Complete cleanup/reconciliation | Not part of kernel | NOT_PROVEN |

**SHARED_OWNERSHIP_PROVEN = NO.** Passing kernel counters alone are insufficient. The approved fallback was therefore attempted, without deploying/forcing this incomplete architecture.

## 13. Dual independent confirmation — implementation and 3000 results

Prototype independently calls the original pure policy for Canonical and Partner state/observation inputs. It never accepts a caller-supplied YES as proof. It requires same native tuple, current policy version, normalized PP evaluation state (excluding only local trade/request/close-intent IDs), identical observation, freshness, allowed prior phases, and both actual results CLOSE_PROFIT_PROTECTION/EXIT_PREPARED. Request/approved tuple/time/context are bound before one shared claim/spend/close controller. Partner confirmation does not independently submit a close.

Twenty kinds x150 = **3000** races. Only valid two-confirmation cases acquire the one shared authorization. Cases marked ERROR are injected invalid/UNKNOWN states, not a live Partner service exception.

| Kind | Cases | Authorizations / fake close proposals | Expected |
|---|---:|---:|---|
| BOTH_CLOSE | 150 | 150 / 150 | One per race |
| CLOSE_HOLD | 150 | 0 / 0 | DENY |
| HOLD_CLOSE | 150 | 0 / 0 | DENY |
| UNKNOWN_CLOSE | 150 | 0 / 0 | DENY |
| CLOSE_UNKNOWN | 150 | 0 / 0 | DENY |
| ERROR_CLOSE | 150 | 0 / 0 | DENY |
| CLOSE_ERROR | 150 | 0 / 0 | DENY |
| STALE | 150 | 0 / 0 | DENY |
| POSITION mismatch | 150 | 0 / 0 | DENY |
| ACCOUNT mismatch | 150 | 0 / 0 | DENY |
| EXCHANGE mismatch | 150 | 0 / 0 | DENY |
| SYMBOL mismatch | 150 | 0 / 0 | DENY |
| SIDE mismatch | 150 | 0 / 0 | DENY |
| POLICY_VERSION mismatch | 150 | 0 / 0 | DENY |
| EVALUATION timestamp mismatch | 150 | 0 / 0 | DENY |
| DUPLICATE valid invocation | 150 | 150 / 150 | One per race |
| RESTART valid fresh invocation | 150 | 150 / 150 | One per race |
| STALE_WORKER | 150 | 0 / 0 | DENY |
| DELAYED | 150 | 0 / 0 | DENY |
| SIMULTANEOUS valid invocation | 150 | 150 / 150 | One per race |
| Total | **3000** | **600 / 600** | **2400 races rejected** |

Double authorization/close/mismatched-confirmation close = 0. Stale/delayed cases close = 0. Each race invokes the controller concurrently twice; same/different tokens exercise duplicate authority. The RESTART label here is a fresh valid controller invocation after independent re-evaluation, not a full OS Worker restart; real SQL-child crashes are separate.

Limit: evaluations are two independent calls in the local test process, not authenticated outputs from two separately installed Worker services. No durable cross-process confirmation exchange, persisted original PP CAS version binding, complete public/owned RPC bridge or mandatory all-path enforcement exists. Dual confirmation cannot repair an untrusted native registry or a bypassable executor.

**DUAL_CONFIRMATION_PROVEN = NO.**

## 14. Exact failures / non-hidden test history

1. Initial duplicate fixture: 3000 shared races passed, then the 100-concurrent same-token assertion expected one but received zero. Evaluation timestamp was generated before opening 100 connections and aged beyond the unchanged three-second safety boundary. Only harness ordering was repaired (fresh request after connection pool opens); policy freshness was not relaxed. Preserved local `results-initial-duplicate-fixture-failure.json`; interval 19:49:16.818Z -> 19:49:54.600Z.
2. Earlier kernel run passed 6000 races at 19:50:32.239Z -> 19:51:22.585Z (`results-v1-kernel-pass.json`); later run additionally tested native-read identity and real OS-child kills at 19:52:48.405Z -> 19:53:44.856Z. Repeated same coverage is not counted as additional independent races in this report.
3. Supplemental non-escalated test startup failed before any race at 19:56:57.728Z -> 19:57:08.242Z. Startup had no PostgreSQL log; the harness's error formatter raised ENOENT while trying to read that missing log. No race acceptance inferred. Preserved `results-supplemental-sandbox-start-failure.json`. Error formatting now tolerates absent startup logs; the bounded disposable harness was rerun with reviewed process permission. The final 76-check/6000-race run has zero harness errors. The failed output alone does not prove the precise OS denial cause.
4. Local evidence summarizer first hit Node execFileSync ENOBUFS while reading the large Git blob for copytrade.ts. Raised only the local output buffer to 5 MB; no application/data change. Final source-integrity comparison passed.
5. Four real calls to the unchanged Partner database wrapper rejected new RPC names. This expected rejection demonstrates a concrete full-integration blocker; it is not hidden as a successful bridge.
6. No runtime caller imports the new controller. Full-path mediation therefore fails. No claim that fixture acceptance resolves this.

Prior real-role/privileged diagnostic failures remain documented in the permanent comparison. No test was skipped, weakened, or relabelled as live execution acceptance.

## 15. Exact remaining uncertainties / minimum next engineering work

1. Verified native-account UID/subaccount attestation producer and cross-key/schema alias reconciliation; no privileged arbitrary binding seed in eventual real operation.
2. Proven native position-generation/epoch lifecycle for Binance/Gate and exact MEXC ID, including replacement/reopen with identical entry/quantity, partial changes and authoritative native symbol/side/mode.
3. Complete Canonical/Partner native authority mediation, including competing existing exits, without removing legacy protection or inventing row-ID identity. Public shared RPC bridge with existing Partner account/RLS boundaries must be explicitly designed/tested; merely widening an RPC allowlist is insufficient.
4. Atomic linkage to existing PP state/revision, decision/input digest, close intent and original transactional admission. New authority RPCs currently do not read/validate those real rows; a prototype caller could supply a matching registered request without the full original policy CAS.
5. Token-bound native FLAT/protection cleanup/settlement/reconciliation linkage and durable epoch advancement. Stored FLAT alone is not complete cleanup evidence.
6. Actual financial-handler composition adversarial tests using real public/owned SQL/functions and unchanged native adapters behind fake transport; not only controller fixtures. Full Worker crash/concurrent restart and unknown native-read provenance remain unproven.
7. For fallback, authenticated/durable independent worker confirmations tied to actual same PP version/state/evaluation, with the same non-bypassable authority. Two local pure calls are not that delivery protocol.
8. Real cross-account overlap and private exchange behavior remain deliberately uninspected/unproven. Profitability and live fills are not implied by this task.

Do not unblock the Worker by repairing only Partner view permissions or registering guessed identities. This report presents a bounded local kernel/prototype, not a complete deployable repair. No automatic next release/activation step is permitted.

## 16. Final architecture decision / source integrity

**SELECTED_ARCHITECTURE = NEITHER. ARCHITECTURE_RESULT = NEITHER_PROVEN.**

Reason: complete-mediation and verifiable native-identity prerequisites are unmet for BOTH alternatives. Shared ownership's local authority is useful evidence, but not usable by the installed paths. Dual confirmation still depends on that same unresolved authority and adds unimplemented durable independent-confirmation provenance. Selection is factual, not based on convenience or the green isolated count.

Original policy activation/peak/giveback/fees/funding/risk/direction/entry/position size/SL/ONE-TP behavior remains unchanged. Automatic full-position ONE-TP eligibility/enrollment remains unchanged, including analytical TP2/TP3 with 100/0/0 and rejection of true multi-TP. No manual opt-in was reintroduced. Existing offline admission/native/lifecycle regression suite passed.

Selected unchanged source SHA-256, using LF-normalized Git/body comparison because the local checkout has Windows line endings:

```text
policy       832a06acc20a4ec47fc89d564c4f30c7e0b44357a11ba93a144a9dd12fe6950d
lifecycle    5e4e23f7a0f69310993666940b27f18c23bb0b4a98d05d7071fd0efb356dbab4
execution    224ca45ff2b89c1475cb28160faad871cc36ab5e2cd21abdeef9e83b149f0c7c
enrollment   88d8a84b818cd219a62788af1ad5fb0374de158611916e27ea2ba5582e8989ba
worker       c22f5b8f8756df7856ac5f9aa3b52b07df2d0556ea33b0859e3e0b945082c028
copytrade    61977ce893dfdb65758df1041044f5d61f70a4931e3550dca006d0bf2ace09d2
```

New candidate/test evidence raw byte hashes:

```text
native module    5117efaf437d18a857b31f77a28d7683c33411c4453831432d2a31dc3a9116aa
candidate SQL    cbdac629890fcb5d3a567b160946b62c17da9b3858c4da7e15f5c521516d5ebe
test harness     d86cb4dd492531ce5962f3da237c0d5226636bf71ddcb0b2199457acba9e652f
crash child      1a7598b15db9b7b5e0bf7a46b3f78bdcc094f38dffddd2dd89e9d90cfd45a474
final results    3b9cce83c9d4a38fa9d962b9a3cec7e96f03bcfa357f2b337822d211e929898c
```

Raw per-race evidence remains local; no account/credential/test artifacts published. Candidate uncommitted/unpushed. AI-Log is a separate report-only publication under standing AGENTS.md instruction; its documentation commit/readback receipt is returned separately and recorded in primary HANDOFF. No application-history identity was altered.

## 17. Production readiness / before-after evidence / safety

Read-only VPS snapshots:

- Before: **2026-10-02T19:42:42.233302Z**.
- After: **2026-10-02T19:59:40.794325Z**.
- SSH read-only source/runtime/catalog capture; bounded REPEATABLE READ READ ONLY transaction followed by ROLLBACK. No account/trade credential row reads; no exchange calls; no writes/configuration commands.
- Active marker/app/admin release paths and process cwd remain canonical `e1fdc45...`; Partner path/manifest remains `84f27...`.
- All **23 inspected source hashes and mtime_ns** unchanged and matched their independently read exact Git blobs; Partner bundle SHA-256 remains `fbd6312f1d9d0ba501eaed4ef4cf0bda1732cfe6ca00acab676a405538a8b1f1`.
- All seven service state/PID/start time/NRestarts captured properties unchanged. Selected installed function definitions/grants/RLS/views/roles/indexes/defaults/triggers and PP control/aggregate observations unchanged. This is a bounded catalog comparison, not a whole-DB immutability claim.

| Service | Before/after PID | State | Enabled | NRestarts before/after |
|---|---:|---|---|---|
| signalverse | 3202681 | active/running | YES | 0 / 0 |
| admin | 3202627 | active/running | YES | 0 / 0 |
| observer | 3202625 | active/running | YES | 0 / 0 |
| public PostgREST | 1960930 | active/running | YES | 0 / 0 |
| Canonical PP Worker | **0** | **inactive/dead** | **NO** | 0 / 0 |
| Partner Copytrade | 3092803 | active/running, pre-existing | YES | 0 / 0 |
| Partner PostgREST | 3092801 | active/running | YES | 0 / 0 |

**REAL_PP and DEMO_PP were already TRUE in the existing control row and remained TRUE/unchanged**, updated_at still 2026-10-01T22:02:54.495Z. This task did not enable/disable them. Do not report them as OFF. Canonical PP Worker stays disabled/inactive/PID0; Partner's pre-existing Worker flags remain unchanged.

Both public/partner_copytrade aggregates at both captures: PP state rows 0, PP close-intent rows 0, PP-attributed closed trade records 0. No real exchange/native account inspection was performed; unrelated background financial activity was not globally frozen or asserted absent. Safety counts below are actions performed by **this task**, not an assertion about all other services/user activity.

No Production changes, Worker/Partner restart, migration, backup, scanner action, flags change, exchange/order/position/SL/TP/close action, new approval, Guard, artifact, release or application push/commit/CI. Documentation-only AI-Log publication does not activate application code. No runnable temporary PostgreSQL cluster remains from the completed disposable run.

## Files inspected / publication limitations

Actual pinned source inspection includes `api/copytrade.ts`; PP policy, lifecycle, execution, enrollment and runtime modules; `api/_shared/partner-copytrade-context.ts`; canonical Worker; Partner main/service/http/database/network/contract; original PP, automatic-enrollment and owned-copytrade SQL/schema/claim paths; the installed Partner manifest/bundle hash; prior comparison report; current runtime-read/capture tooling; new module/SQL/harness/results; and AI-Log report template/README/secret scanner. Runtime collection hashes 23 installed files because not every canonical-only file exists in both release trees. Reading source containing credential-handling code is not decrypting or accessing actual credentials.

Exact report-only publication is to `signal0verse/SignalVerse-AI-Log/master/reports/futures/pp-shared-ownership-dual-confirmation-2026-10-03.md`. Scan and manual sanitized diff review are required before report commit; remote file bytes/SHA must be independently verified afterward. If publication fails, preserve local report and do not claim it was published.

## Final machine-readable result

```text
PHASE=PP-SHARED-OWNERSHIP-AND-DUAL-CONFIRMATION
IMPLEMENTATION_SCOPE=LOCAL_KERNEL_AND_LOCAL_FALLBACK_PROTOTYPE_ONLY
METRIC_SCOPE=DISPOSABLE_KERNEL_NOT_INSTALLED_PATH_ACCEPTANCE
SHARED_OWNERSHIP_IMPLEMENTED=YES
SHARED_OWNERSHIP_PROVEN=NO
DUAL_CONFIRMATION_IMPLEMENTED=YES
DUAL_CONFIRMATION_PROVEN=NO
RACE_TESTS=6000
SHARED_RACE_TESTS=3000
DUAL_RACE_TESTS=3000
DOUBLE_AUTHORIZATION=0
DOUBLE_CLOSE=0
TWO_OWNERS=0
RESTART_DUPLICATE_CLOSE=0
STALE_OWNER_DUPLICATE_CLOSE=0
IDEMPOTENCY_FAILURE=0
MISMATCH_BYPASS=0
FULL_PATH_MEDIATION=NOT_IMPLEMENTED
REAL_NATIVE_IDENTITY_ATTESTATION=NOT_PROVEN
PREVIOUS_INSTALLED_PATH_COUNTEREXAMPLES=UNCHANGED
SELECTED_ARCHITECTURE=NEITHER
SELECTION_REASON=FACTUAL_EVIDENCE_ONLY
ARCHITECTURE_RESULT=NEITHER_PROVEN
PRODUCTION_READY=NO
PRODUCTION_WORKER_STARTED=NO
PRODUCTION_TOUCHED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
PARTNER_CHANGED=NO
REAL_EXCHANGE_CALLS=0
REAL_CLOSE_ACTIONS=0
REAL_POSITION_ACTIONS=0
REAL_SL_CHANGES=0
REAL_TP_CHANGES=0
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI=NOT_RUN
DEPLOYMENT=NO
FINAL_CLASSIFICATION=NEITHER_PROVEN
STOP
```
