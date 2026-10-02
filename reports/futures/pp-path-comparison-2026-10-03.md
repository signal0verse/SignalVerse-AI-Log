# Futures Profit Protection — final path comparison

## Metadata / Objective / Scope

- Date: 2026-10-03 Asia/Kuala_Lumpur; evidence timestamps below are UTC.
- Task: PP-PATH-COMPARISON; audit + disposable adversarial comparison only.
- Application repository starting/ending HEAD: `0dbca62357a4adf34240f40ceda3e387356ec4b0`; no application commit, push, main promotion, CI, artifact, Guard or deployment.
- Deployed Canonical source: `e1fdc45f29b350670e707de3a7afa10b9153d689`.
- Independently installed Partner source: `84f27c2e40b02b0dbf61c58429cf7c45f4f852da`.
- Primary tracked worktree was already dirty in `HANDOFF.md`; private/untracked work was preserved. The candidate checkout tracked tree was clean and remained clean. This report and a handoff addition are documentation, not application changes.
- Authority: latest owner attachment, FINAL PROFIT PROTECTION PATH COMPARISON. Test harnesses were isolated under `tmp/pp-path-comparison-20261003`; no architectural repair was implemented.

## 1. Current Production state

Read-only snapshots: initial bounded check at 18:20:23Z; structured before snapshot `2026-10-02T18:23:21.066123Z`; additional catalog/default confirmation at `18:35:57.560763Z`, `18:40:24.555224Z`, `18:44:36.530937Z`; final snapshot: `2026-10-02T18:57:36.901614Z`.

| Service | Before PID | After PID | State / boot enablement | Restarts before → after |
|---|---:|---:|---|---|
| signalverse.service | 3202681 | 3202681 | active / enabled | 0 → 0 |
| signalverse-admin.service | 3202627 | 3202627 | active / enabled | 0 → 0 |
| signalverse-observer.service | 3202625 | 3202625 | active / enabled | 0 → 0 |
| postgrest.service | 1960930 | 1960930 | active / enabled | 0 → 0 |
| signalverse-futures-profit-protection.service | 0 | 0 | inactive / disabled | 0 → 0 |
| signalverse-partner-copytrade.service | 3092803 | 3092803 | active / enabled; pre-existing | 0 → 0 |
| signalverse-partner-copytrade-postgrest.service | 3092801 | 3092801 | active / enabled | 0 → 0 |

Canonical marker, app/admin symlink and their actual process cwd all point to e1fd. Partner link, process cwd, retained source manifest and bundle point independently to 84f27. Partner is not assumed to have adopted the latest main just because main was released.

Partner bundle SHA-256:

```text
fbd6312f1d9d0ba501eaed4ef4cf0bda1732cfe6ca00acab676a405538a8b1f1
```

Shared control table was already `real_enabled=true`, `demo_enabled=true`, with `updated_at=2026-10-01T22:02:54.495Z`. Both flags and this timestamp remained unchanged. **They were not OFF.** Canonical service and bootstrap were OFF: service disabled/inactive/PID0 and application worker flag unset. Partner had `PARTNER_COPYTRADE_ENABLED=1`, `PARTNER_COPYTRADE_WORKER=1`, `FUTURES_PROFIT_PROTECTION_WORKER=0`; the last flag forbids canonical bootstrap, but does not disable Partner's explicit PP sweep.

Both public/owned PP state, close-intent and PP-attributed closed-record counts were zero before/after. No account identifiers, credentials or account balances were accessed. No claim is made that all financial rows in an active application were globally frozen: normal unrelated services continued running.

## 2. Canonical call graph — source-inspected, not started in Production

```text
installed systemd unit (disabled)
 → server/futures-profit-protection/worker.mjs
 → isProfitProtectionWorkerEntrypoint(realpath-aware)
 → bootProfitProtectionWorker(workerFlag === '1')
 → configureProfitProtectionVerification before importing financial runtime
 → .runtime/api/copytrade.mjs
 → module bootstrap ensureProfitProtectionMonitor(true)
 → initial disabledPollMs=30000; subsequent returned interval scheduling
 → profitProtectionMonitorTick [copytrade.ts:16392]
     → scope-local in-flight Set; control read
     → oldest uncertain close intent: independent native-flat read,
       advance own token to FLAT_CONFIRMED; never resubmit
     → up to 500 non-reconciled PP states; round-robin batch <=5
     → runProfitProtectionPosition [16268]
         → original trade + scoped account lookup
         → driveProfitProtection (shared lifecycle)
             → independent native epoch/quantity/side/entry read
             → observation → evaluateProfitProtection (shared pure policy)
             → saveProfitProtection [16110] revision CAS
             → ARMED → EXIT_PREPARED + unique intent token
             → recheck allowed/native epoch/fresh quote
             → persisted EXIT_SUBMITTED
             → closeBinanceTrade [8836] / closeGateTrade [7861]
               / closeMexcTrade [646]
                 → executeTrackedFullClose (shared)
                 → native full-position preflight
                 → trackedFuturesClosePorts [15974]
                 → public.futures_claim_position_close
                 → exactly one native submit callback
                 → full-fill evidence + independent native-flat read
                 → durable UNKNOWN or FLAT_CONFIRMED intent evidence
             → next invocation independently verifies FLAT
             → cleanupProfitProtection [16242], only owned SL/TP IDs
             → ownsClose + evidence / reconciliation / persisted RECONCILED
     → discoverOpenProfitProtection [16085]
         → OPEN standard Futures, keyset page <=25; existing state wins
         → enrollOpenProfitProtection [16029]
         → shared enrollment helper, permission/accepted execution/native basis
         → public.futures_enroll_profit_protection (transactional/idempotent)
         → same monitor processes enrolled row on a later tick
```

Uncertain states are durable holds, not expiring leases. Native observation budget is 24 complete cycles/minute/venue/process, not a cross-process exchange quota or an end-to-end latency SLA.

## 3. Partner call graph — independently pinned installed source

```text
active signalverse-partner-copytrade.service
 → output/partner-copytrade/main.mjs (84f27 source manifest)
 → server/partner-copytrade/main.ts
     → canonical flag must NOT equal '1'
     → PARTNER_COPYTRADE_ENABLED === '1'
     → start(OwnedCopytradeService, worker === true)
 → http.ts: start
     → PP interval 1000ms; per-kind running guard
     → reconcile/entry 300000ms; lease-protection 15000ms
 → OwnedCopytradeService.sweep('profit-protection')
     → registry.all(); account-local protectionBusy
     → context(account, maintenance=true)
     → ownedDatabase + ownedFetch
     → withPartnerCopytrade (AsyncLocalStorage)
     → if market === 'usdm', old profitProtectionMonitorTick [16263]
         → same scope-local tick guard / control / uncertain-flat reconciliation
         → same non-reconciled state batch, runProfitProtectionPosition [16147]
         → same pure policy + lifecycle + actual native close adapters
         → schema-local CAS via saveProfitProtection [16003]
         → owned claim via trackedFuturesClosePorts [15970]
         → partner_copytrade.futures_claim_position_close
         → native submit / flat read / cleanup [16122] / reconciliation
```

The old Partner monitor does **not** call the new automatic discovery/enrollment helper. Existing/manual opt-in is an older separate admission path. Installed SQL enrollment has been updated, but that does not make the pinned old runtime's automatic discovery exist. Main's new worker/enrollment code is not the installed Partner bundle.

Partner wrapper ignores the monitor's returned 2s/30s interval and sweeps on its fixed 1s timer. `busy`, `protectionBusy` and the monitor's in-flight Set are process-local; none owns a native position across processes/schemas. The separate reconciliation sweep and PP sweep can overlap at a native account boundary, despite their individual guards.

## 4–5. Shared components and exact differences

| Component | Canonical | Partner | Shared? | Difference / risk |
|---|---|---|---|---|
| Runtime release | e1fd | 84f27 | NO | Independently installed/pinned |
| Pure policy | operational-v1 | operational-v1 | YES, exact bytes | Neither path has a better policy from this evidence |
| Lifecycle | driveProfitProtection | same | YES, exact bytes | CAS port namespace differs |
| Tracked execution | executeTrackedFullClose | same | YES, exact bytes | Admission RPC namespace differs |
| Economics core | same pure module | same | YES, exact bytes | Live final accounting still requires actual exchange evidence |
| Three close adapter bodies | native Binance/Gate/MEXC | same bodies | YES, AST bytes | Both can reach the same native account through different DB rows |
| Monitor | new discovery + verify-only guards | old monitor | NO | Same close core, different admission and host cadence |
| Automatic enrollment | new helper/discovery | absent from pinned monitor | NO | SQL presence is not runtime feature parity |
| Enrollment SQL | public transactional function | owned clone invoking common mode helper | Related, not identical | Exact installed source tested; actor/RLS preserved |
| Claim SQL | SECURITY DEFINER/public | SECURITY INVOKER/owned | NO | Partner PP claim locks a SELECT-only control view |
| State/intent tables | public | partner_copytrade | NO | Independent PK, token and instrument indexes |
| Account identity | legacy Telegram account lookup | partner account + private actor | NO | No demonstrated common exchange-native account owner |
| CAS | trade_id + revision | same local pattern | Same pattern, different rows | Local duplicate prevention is not cross-schema exclusion |
| Control read | public | owned control view | Same underlying flags | Partner FOR SHARE requires rights actor does not have |
| Cleanup | independent flat, owned IDs | same core + old wrapper | Core related, source differs | No cleanup before native flat; no dynamic SL/TP |
| Reconciliation | original trade + own intent evidence | owned counterpart | Related, namespace differs | PP causality must not be inferred from flat alone |
| Scheduling | returned interval + serial canonical timer | fixed 1s owned PP sweep | NO | Different cadence; no live latency winner demonstrated |
| Registry uniqueness | legacy account table | HMAC credential fingerprint unique within owned registry | NO shared owner | Different keys for one account and legacy namespace are not ruled out |

Exact shared module SHA-256:

```text
policy      832a06acc20a4ec47fc89d564c4f30c7e0b44357a11ba93a144a9dd12fe6950d
lifecycle   5e4e23f7a0f69310993666940b27f18c23bb0b4a98d05d7071fd0efb356dbab4
execution   224ca45ff2b89c1475cb28160faad871cc36ab5e2cd21abdeef9e83b149f0c7c
economics   862ec1e80a3d823cbd2b98746f7aa92c08e7f8e4bbe06490ca31840e1360a93d
```

The three actual adapter function hashes match across commits: Binance `cf094b74572d8ab248dfb2e0f103c5ce3034b46344ab0e0cc26f210019b03190`; Gate `97293d0abea4704c0f12528dee19ba45fb08dbeceb187dcd978a268d6ef07bb7`; MEXC `8f645d56d4fe3168ff81189133ab8d2a52e93a365553281f4df4321cfefbd4ee`.

## 6. Test environment and authenticity boundary

One common harness extracts the actual named function bodies from each exact Git commit, records line/hash, and runs them in separate disposable VM contexts. Shared pure modules and native adapter bodies are byte-verified. No full API bootstrap or dotenv load occurs. Installed SQL was read using a bounded repeatable-read READ ONLY transaction, then recreated in fresh PostgreSQL 18.6 loopback clusters. Node is v22.23.3. Role BYPASSRLS/NOINHERIT properties, owned account defaults, the control view and account-RLS predicate were independently read/replicated. All recreated tested SQL prosrc MD5 values matched the installed values.

The database fixture is intentionally not a copy of Production: it contains minimal synthetic account/trade/execution/PP rows. It implements the actual tested PP state/intent triggers and RPCs, not all unrelated production trade-history triggers, foreign keys, PostgREST/JWT transport or financial settlement architecture. Results prove the exercised boundary, not a full financial-system certification.

The native adapters are called through disposable ports, not through the entire Partner HTTP/HMAC/ownedFetch credential/venue router. That outer wrapper was source-audited, not exercised as a live service. The synthetic registry fixture is a USDM Binance account used to test schema/account RLS; Gate/MEXC cases qualify their actual adapter/policy/SQL boundaries, **not** full venue-specific registry/auth integration. The334 Binance races in each group already use the matching synthetic account venue and are sufficient independent counterexamples; broader private venue-wrapper acceptance remains NOT PROVEN. No current Production account duplication is inferred from this synthetic mapping.

Synthetic common causal tape: entry100, quantity1, original risk5, long SL95/ONE TP125; symmetric short SL105/ONE TP75. All three exchanges and both sides are tested. Full-depth executable observations explicitly include known zero funding, receipt/evaluation time and identical prices. Zero funding is a synthetic fixture input, not an assumption about real funding. No OHLC extreme was expanded into invented market ticks.

The execution function's supported `ports.now` uses the same disposable clock as the lifecycle. Actual execution/admission/policy code remains unchanged. Native position reads, fill/flat responses, accounting transport and exchange requests are disposable ports. VM has no live fetch authority, decryption accepts only `SYNTHETIC`, and unknown fake transport routes are denied. Every recorded close is a **fake execution proposal**, not an exchange order.

The common harness records original/native identity, schema/account, price/PnL, peak, activation/reversal counters, giveback, phase, revision, intent/token, installed claim result/error, adapter payload, flat state, cleanup, reconciliation result and timings. Raw synthetic outputs remain local and are not published as account data.

Commands executed:

```text
node --check tmp/pp-path-comparison-20261003/compare.mjs
node --check tmp/pp-path-comparison-20261003/crash-child.mjs
node --experimental-strip-types tmp/pp-path-comparison-20261003/compare.mjs
node --experimental-strip-types tmp/pp-path-comparison-20261003/compare.mjs --extended-only
```

Final primary run: `2026-10-02T18:47:04.419Z` → `18:56:48.443Z`. Final extended run: `2026-10-02T18:50:03.741Z` → `18:50:54.208Z`. Each fresh cluster was stopped and removed only after validating its exact private temporary path. No production connection/URL/credential was used by the harness.

## 7–8. Shared scenarios and behavior results

The primary matrix has 20 variants ×3 venues ×2 sides ×2 paths =240 scenario runs. A–E pure comparisons add 30 paired comparisons. The extended matrix adds160 checks; its10 transaction/reconnect checks are reported separately, not counted again as unique coverage when repeated in the primary run.

| Test | Canonical observed | Partner observed | Scope / result |
|---|---|---|---|
| A below activation | NO_ACTION, no close | same | Policy PASS |
| B activation | ARM after3 observations /4s confirmation | same | Policy PASS |
| C higher profit | peak increases, HOLD | same | Policy PASS |
| D small reversal | HOLD, no close | same | Policy PASS |
| E confirmed giveback | one fake close; own flat/cleanup/RECONCILED | policy triggers; claim permission error → UNKNOWN, zero POST | Policy PASS both; Partner PP execution FAIL |
| F ONE TP | native-winner status retained; no PP duplicate | same | Fake native-flat/status only; actual exchange TP fill NOT PROVEN |
| G SL | native-winner status retained; no PP duplicate | same | Fake native-flat/status only; actual exchange SL fill NOT PROVEN |
| H near native TP/SL | native winner, no PP POST in this ordering | same | Native-winner scenario PASS; competing app exit tested separately below |
| I already flat | no close; flat/cleanup; unowned OPEN trade not falsely labelled PP | same | Bounded safety PASS; independent financial sync completion NOT PROVEN |
| J UNKNOWN | preserve hold, no POST | same | PASS in local state scope |
| K changed/partial quantity | UNKNOWN, no retry/cleanup | same | PASS in local state scope |
| L restart after ARM | fresh VM/connection resumes persisted peak/ARM | same |12 fresh-context checks PASS; real service restart NOT performed |
| M persisted close intent | EXIT_SUBMITTED does not resubmit | same | Local hold safety PASS |
| N before/after claim | PREPARED restart → UNKNOWN; committed claim prevents new token | same | DB/process boundary checks PASS, not global native ownership |
| O temporary persistence failure | no unacknowledged transition close; later ticks resume safely | same | Bounded failure safety PASS |
| P timeout/reject/partial | retain UNKNOWN and protection; no second POST | Partner PP cannot reach transport; actual EXISTING_EXIT adapter path tested separately | PP-path availability FAIL; adapter-level safety PASS |
| Q stale revision | CAS loser cannot change state or submit | same | Local CAS PASS |

Additional executed checks, using all6 venue/side combinations on both paths:

-12 installed enrollment/idempotency/explicit opt-out preservation checks.
-12 fresh VM/connection restarts after ARM;12 repeated identical ticks.
-12 simultaneous stale-revision same-schema worker races: Canonical exactly one fake POST each; Partner zero because claim permission failure. No same-schema double POST.
-48 actual adapter failure cases: timeout/rejection/partial/delayed-flat, using the allowed EXISTING_EXIT admission on each real function/role; exactly one initial fake POST, durable UNKNOWN, subsequent claim rejected, no cleanup or second POST.
-60 invalid-input cases: unreadable native position, stale quote, incomplete depth, missing funding and changed native epoch/quantity; zero authorization/POST/cleanup.
-4 disposable OS child-process deaths: two roles × uncommitted/committed claim. Uncommitted claims roll back; committed claims remain and reject a new token after the child is killed.

Original Entry/SL/ONE TP in each PP identity was unchanged. No dynamic protection, partial TP or policy/threshold change was introduced. Cleanup proposals concern only owned protection IDs **after fake independent flat**.

## 9–10. Concurrency and duplicate-close results

| Group | Iterations | Canonical authorized | Partner authorized | Canonical only | Partner only | Double authorization | Double fake close | Claim conflicts | Permission failures | Native safety |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Actual roles: PP vs PP | 1000 | 1000 | 0 | 1000 | 0 | 0 | 0 | 0 | 1000 | NOT PROVEN |
| Actual roles: PP vs EXISTING_EXIT | 1000 | 1000 | 1000 | 0 | 0 | 1000 | 1000 | 0 | 0 | FAIL |
| Disposable postgres diagnostic: PP vs PP | 1000 | 1000 | 1000 | 0 | 0 | 1000 | 1000 | 0 | 0 | FAIL; NOT Production privilege |
| All three groups | 3000 | 3000 | 2000 | 1000 | 0 | 2000 | 2000 | 0 | 1000 | FAIL |

Thus **1000** actual-role duplicate-authority/close counterexamples, plus **1000** privileged diagnostic counterexamples; totals must not be misread as2000 actual-role/Production races. Every group covers Binance334, Gate333 and MEXC333 iterations, evenly500 long/500 short overall. No same-schema stale-CAS steal, duplicate UNKNOWN retry or duplicate PARTIAL retry occurred in the separately exercised local cases. Zero cross-schema claim conflicts is a defect signal here, not a safety achievement: independent indexes never contested the same native slot.

Every race uses the same known synthetic native account/venue/symbol/side/entry/quantity/epoch, represented by different schema rows. Both sides independently read the same still-open native snapshot before admission. A disposable barrier waits for both actual claim attempts before releasing fake submits; it does not replace SQL admission. PP races begin ARMED with peak10/current6 and two prior reversal confirmations; the same next quote triggers policy/CAS/intent creation. This is not merely parallel insertion into fabricated intent tables.

The actual-role PP-vs-PP group's zero double close is **NOT PROVEN** native safety: Partner is rejected by a permission defect, not by a shared owner. The actual-role Canonical PP-vs-Partner EXISTING_EXIT group is a direct architectural counterexample if both schemas represent one native position. The privileged PP-vs-PP group uses postgres **only inside the disposable DB** to expose the absence of shared ownership behind the known permission defect; it is not claimed as current Partner production privilege or a production repair.

Native reduce-only prevents increasing exposure on a compliant venue; it does not establish exactly one authorized close, nor protect a replacement epoch from stale unshared authority. No real duplicate order/close is asserted to have occurred in Production.

## 11. Native identity and lock/claim audit

The PP identity includes tradeId, acceptedRequestId, exchange, symbol, side, original accepted prices/risk/quantities, openedAtMs and MEXC nativePositionId. It does **not** contain a common attested exchange account UID, shared legacy/Partner namespace, position mode or cross-schema owner token. Binance/Gate native checks compare quantity/entry/side; MEXC additionally compares native positionId. Same averages/quantity alone cannot establish global account/epoch uniqueness.

Owned credential fingerprint is HMAC(exchange + market + API key), unique only in `partner_copytrade.accounts`. It cannot rule out legacy reuse, different API keys for one exchange account, subaccount/account alias mistakes or cross-schema representation. No credentials or live mappings were read here, so **actual Production account overlap is NOT PROVEN**, not assumed true or false.

| Guard / lock | Scope/key | Lifetime / transaction | Crash/reconnect behavior | Cross-native safety |
|---|---|---|---|---|
| Canonical serial timer | one process | invocation + returned interval | lost on process death | NO |
| monitor in-flight Set | process + context account/legacy | try/finally invocation | lost on death | NO |
| Partner per-kind running | one process/kind | sweep invocation | lost on death | NO |
| busy / protectionBusy | one process/account, separate Sets | request/sweep finally | lost on death; not common between kinds | NO |
| discovery cursor | process/context | paging optimization | resets; persisted enrollment wins | Not ownership |
| observation budget | process/venue | rolling60s | resets after restart | Not ownership / not global quota |
| PP state CAS | schema + trade_id + revision | acknowledged SQL UPDATE | committed state survives; stale revision rejected | NO shared row |
| enrollment row lock | schema copy_trades trade_id | enrollment transaction | rollback releases; commit preserves state | NO |
| claim row lock | schema copy_trades trade_id | claim transaction only | releases at end; uncertain intent persists | NO |
| PP control FOR SHARE | public table / owned view | claim transaction | Partner actor denied on view | Not shared native owner |
| local intent PK | schema trade_id | durable row | survives commit/crash/reconnect; no TTL | Local only |
| local token unique | schema token | durable row | cannot reuse token locally | Local only |
| local active instrument unique | schema telegram_id,exchange,symbol; SUBMITTED/UNKNOWN | durable partial unique index | retains uncertain hold until flat reconciliation | Actor/schema keys differ |
| owned account fingerprint | owned schema venue/product/API-key HMAC | durable account/tombstone | retained on revoke | No legacy/native-UID exclusion |
| native epoch preflight | one request's native read | no server-side cross-worker lease | stale/unreadable read fails closed | Read is not mutex |

Answers: Canonical and Partner can both claim the same **logical native position** through separate schema/actor rows; tested at their actual SQL/adapter boundaries. Durable local ownership survives commit, DB reconnect and process death. An uncommitted claim rolls back; no POST is permitted without acknowledged admission. A stale worker cannot overwrite the same row's revision or reclaim its active intent. But neither local constraint prevents another namespace/account alias from owning the same native position. No TTL-based takeover is justified.

## 12–13. Restart and failure-injection analysis

The10 DB checks (5 per path): explicit rollback; connection loss before commit; committed claim + reconnect + duplicate rejection; malformed persisted state rejection; bounded50ms row-lock timeout with no new claim. All passed in the final corrected fixture. Four real disposable child-process deaths add OS-level commit-boundary evidence. Fresh VM tests remove in-memory lifecycle state and reuse persisted DB state. This is stronger than merely asserting a startup message, but is **not** a full installed worker/systemd restart or live exchange crash recovery test.

Actual shared lifecycle never retries EXIT_PREPARED discovered after restart, EXIT_SUBMITTED or UNKNOWN; it preserves native protection until independent flat. Partial, rejected, timeout and delayed-flat adapter results retain a durable hold. Crash after a real exchange accepts but before its response/flat read was not manufactured here; safety logic/persisted hold was tested, but live order evidence recovery and eventual settlement remain NOT PROVEN.

Failure conditions were not weakened or skipped. During harness construction, a synthetic clock binding, Gate's constant binding and owned column defaults were corrected. Earlier fixture errors included expired/future synthetic clock admission, `GATE_SETTLE is not defined`, and RLS insertion rejection caused by the omitted owned default. Those are **harness defects, not Production findings**; only the final independently confirmed fixture is used for acceptance. Both final suites' harness-error arrays are empty. This does not hide injected or architectural errors: the primary scenario O records12 `PROFIT_PROTECTION_STATE_UNAVAILABLE` events by design,30 Partner PP scenario claims record42501, and the race group adds1000 Partner permission rejections. The extended unreadable-native cases record their injected read errors while denying all effects.

## 14. Performance measurements — descriptive, not a winner

All durations below are milliseconds, p50 / p95; nearest sampled rank, not statistical confidence intervals.

| Measurement | Canonical n; p50 / p95 | Partner n; p50 / p95 | Evidence boundary |
|---|---|---|---|
| Shared policy evaluation, A–E paired tapes |30;0.0341 /0.1430 |30;0.0331 /0.0944 | Same causal tape/exact code, no network |
| Actual RPC successful EXISTING_EXIT admission |24;6.6384 /7.4350 |24;7.4239 /10.5324 | Same24 adapter-failure scenarios/actual roles, loopback DB |
| State persistence in extended matrix |162;1.7489 /3.4065 |156;2.1733 /11.7055 | Different counts due PP authorization failure; descriptive only |
| Full per-position tick in extended matrix |138;6.2255 /24.9839 |138;6.9691 /24.9064 | Mixed success/failure inputs, not equal successful PP lifecycle |
| First resumed ARM tick with fresh VM/DB connection |6;25.3043 /33.3221 |6;30.0319 /33.8853 | Does not include OS/systemd full bootstrap |
| Live trigger-to-close / exchange acceptance |NOT PROVEN |NOT PROVEN | No real worker/close test |

The24 Canonical EXISTING_EXIT samples exclude each of its six additional same-schema PP-claim samples; the known fixture order and recorded counts establish that subset. RPC claim is the measured durable-authorization segment; no separate live authorization/exchange latency is invented.

Logical activation confirmation is4s over3 causal observations; reversal confirmation is4s over3 observations, identically for both policies. This is not a claim of a4s live detection SLA. Worker polling, round-robin backlog, read budget, network and exchange execution add unmeasured time. Canonical and Partner do not have comparable successful PP execution latency because Partner's PP authorization fails. Adapter-level successful claim timings are from EXISTING_EXIT, not a hidden permission repair. Measurements are Windows/loopback/VM measurements with fixed participant order and some concurrent disposable load, not GitHub/Linux/VPS performance certification. No numerical score or speed-based winner is assigned.

## 15. Exact failures

1. **Partner PP admission availability FAIL**. Installed owned function is SECURITY INVOKER and executes:

   ```sql
   SELECT real_enabled INTO allowed
   FROM partner_copytrade.futures_profit_protection_control
   WHERE singleton FOR SHARE;
   ```

   Actor has SELECT only on this view. Final tests receive PostgreSQL `42501`:

   ```text
   permission denied for view futures_profit_protection_control
   DURABLE_CLOSE_ADMISSION_UNAVAILABLE
   CLOSE_OUTCOME_UNKNOWN_NO_RESUBMISSION
   ```

   Policy/CAS reach persisted EXIT_SUBMITTED, claim is denied before fake POST, lifecycle enters UNKNOWN. No permission was granted in Production. Enrollment uses the newly installed safe common mode helper, but the separate close-claim clone still has the old view-lock expression.

2. **Cross-schema ownership FAIL**. Local trade locks and local unique indexes authorize two close proposals for one known synthetic native identity. The actual-role PP-vs-EXISTING_EXIT group proves this without privilege elevation. The privileged PP-vs-PP diagnostic shows the same gap when the unrelated view-rights defect no longer masks it.

3. **Installed Partner automatic discovery absent**. New SQL is present, old Partner monitor does not call the new discovery/automatic enrollment helper. Pre-enrolled core-policy comparisons were used fairly; missing admission was not disguised by claiming main-source parity.

4. **Operational coexistence not solved by flags**. Partner flag0 does not disable its own PP sweep; per-account process-local guards do not serialize another worker/schema. Canonical remained OFF; no service/control remedy was applied.

## 16. Factual comparison table — no score

Statuses refer only to the evidence scope explicitly named. PASS in an offline subcomponent is not a live financial-system PASS.

| Area | Canonical | Partner | Evidence / unproven boundary |
|---|---|---|---|
| 1 Trigger detection | PASS | PASS | Same actual policy/tapes |
| 2 Profit activation | PASS | PASS |3-observation/4s causal confirmation |
| 3 Peak tracking | PASS | PASS | C and fresh-context restart |
| 4 Giveback | PASS | PASS | D/E, same long/short thresholds |
| 5 Lifecycle | PASS bounded | FAIL PP completion | Partner reaches UNKNOWN due actual claim defect |
| 6 Persistence | PASS bounded | PASS bounded | Actual CAS/trigger/DB rows |
| 7 Claim | PASS local | FAIL PP; PASS EXISTING_EXIT local | Actual installed role/functions |
| 8 Ownership | FAIL global | FAIL global | No common native account/epoch owner |
| 9 Cross-schema safety | FAIL | FAIL | Actual-role duplicate authorization counterexample |
| 10 Duplicate-close prevention | PASS same row; FAIL cross-schema | same limitation + PP permission blocker | Local CAS != global ownership |
| 11 Restart safety | PASS local; NOT PROVEN global | same | Fresh VM/connection and child crash; no real service restart |
| 12 Crash recovery | PASS local holds; NOT PROVEN eventual live recovery | same | Committed intents durable; no live accepted-order recovery |
| 13 UNKNOWN | PASS bounded | PASS bounded | No retry / no pre-flat cleanup |
| 14 PARTIAL | PASS bounded | PASS adapter EXISTING_EXIT; PP transport not reached | Fake partial fill and durable hold |
| 15 Flat verification | PASS fake native evidence | PASS lower layer; PP completion NOT PROVEN | No production position test |
| 16 Cleanup | PASS bounded | NOT PROVEN successful PP; PASS native-winner boundary | Only owned fake IDs after flat |
| 17 Reconciliation | PASS synthetic own-close core; NOT PROVEN live accounting | NOT PROVEN successful PP | Not all Production trade triggers/actual economics replayed |
| 18 Adapter boundary | PASS fake payload/full-fill/flat ordering | same adapter bodies; PASS EXISTING_EXIT faults | No private exchange execution acceptance |
| 19 Determinism | PASS same tape | PASS same tape | Exact shared bytes and result equality |
| 20 Test coverage | PASS stated matrix | PASS stated matrix | Coverage != operational acceptance; limits explicitly listed |
| 21 Failure handling | PASS bounded holds; NOT PROVEN global recovery | FAIL PP availability; PASS local fail-closed adapter | No unsafe retries within one schema |
| 22 Performance | NOT PROVEN live | NOT PROVEN live | Descriptive offline samples only |
| 23 Operational complexity | NOT PROVEN as sole global owner | NOT PROVEN as sole global owner | No score; source differences and repairs named |

Unproven: actual account overlap/exchange UID mapping; whole installed service restart/recovery; live canonical monitor/enrollment latency; full old Partner automatic enrollment (absent in inspected code); real fill/flat/SL/ONE-TP lifecycle and final fees/funding/PnL; entire Production schema/JWT/settlement behavior; profitability and AI effectiveness. None is inferred from successful mocks/SQL/HTTP.

## 17. Final architectural result

```text
SELECTED_ARCHITECTURE=NEITHER_SAFE_YET
SELECTION_REASON=FACTUAL_EVIDENCE_ONLY
```

این نتیجه دربارهٔ مالکیت سراسری پوزیشن است، نه بد بودن Policy. Policy هر دو مسیر یکسان و در نمونه‌های مشترک درست بود. انتخاب Canonical صرفاً چون جدیدتر است، یا Partner صرفاً چون service آن فعال است، موجه نیست. هیچ مسیر در وضعیت فعلی مالک انحصاریِ تمام نمایش‌های یک پوزیشن بومی نیست. خاموش بودن فعلی Canonical از این مقایسه مجوز روشن‌کردن آن نمی‌سازد؛ خرابی مجوز Partner نیز قفل ایمنی قابل‌قبول نیست.

## 18. Minimum repair design — proposal only, not implementation

هدف پیشنهادی: یک مرجع **مشترک و پایدار** برای مجوز خروج بومی، بدون جایگزینی Policy، بدون AI، بدون تغییر Entry/Risk/SL/ONE TP یا adapterهای فعلی. انتخاب نهایی implementation و فعال‌سازی به مجوز جداگانه نیاز دارد.

1. Map both namespaces to one trusted native-account identity: venue/product/settlement + attested exchange UID/subaccount, not Telegram ID, partner actor, API-key hash or DB trade UUID alone. Different keys/rotation must map to the same account; unknown identity must DENY. No real keys/UID were obtained in this task.
2. Reserve one normalized native position slot: account + venue/product + native symbol + position mode/side; persist an epoch derived from confirmed accepted/native linkage. MEXC nativePositionId is required; Binance/Gate cannot invent a native epoch solely from equal average entry. Keep a slot-level uncertain hold so a later replacement epoch cannot be targeted by an old claim.
3. Both schema-specific admission RPCs retain their current account/RLS/eligibility checks, then acquire the **same** narrow shared owner transaction/unique slot and one intent/fencing token before any native close. PP and existing/manual standard Futures close boundaries must participate; a legacy untracked path cannot bypass it. Other subsystems sharing a native slot require explicit isolation/denial until ownership is established, not an unapproved strategy change.
4. Common durable states: RESERVED/PREPARED → SUBMITTED/UNKNOWN → independently FLAT_CONFIRMED → CLEANUP_PENDING → RECONCILED. Owner/epoch/revision/token changes are CAS-checked. No TTL takeover, claim deletion or uncertain-order resubmission. A lost DB acknowledgment is UNKNOWN/STOP, not permission to POST again.
5. Keep atomic common admission + schema intent linkage; committed common claim survives process crash/reconnect. Rollback creates no authority. Native POST happens only after acknowledged common ownership. Native-triggered SL/ONE TP can still win; re-read flat and preserve cause instead of attributing every flat to PP.
6. Token-bound evidence/cleanup/reconciliation is written only by the same owner. Original native protection remains until independent flat and owned-ID verification; no dynamic SL/TP, no partial TP. Persist immutable audit/tombstone evidence for completed epochs.
7. Fix Partner control-lock availability only through a narrowly reviewed read/lock helper equivalent to enrollment's common helper, **not** by granting control UPDATE or bypassing RLS. This availability repair alone must never be deployed as a concurrency fix; it would uncover the duplicate-authority path.
8. Preserve independent Partner context/auth/account isolation. Shared owner table access must be mediated by account-bound narrow RPCs; do not expose other tenants' rows or credentials. No broad public/owned schema merge.
9. Preserve current automatic enrollment and Demo/Simulator deterministic Policy. Define safe Demo identity separately; retain Real native identity requirements. Do not backfill/enroll live positions automatically during repair rollout. Any activation/migration has separate backup/approval gates.

Expected future change sites, **not changed here**: one additive shared-native-exit-ownership migration; account/epoch resolution boundary; both claim RPC adapters; shared tracked-close port; narrowly authorized Partner control helper; tests for all aliases/entry generations/close origins/crash/UNKNOWN/partial/native-winner races. The three native submit adapters and pure policy/lifecycle math should remain unchanged except consuming the common admission port. This is a design, not a ready/deployed shared-owner implementation.

## 19. Production safety, files, Git and evidence integrity

Final automated deep comparison verified unchanged marker, all7 unit properties/PIDs/start times/restart counts, app/admin/Partner links, all23 captured source hashes/mtime values, Partner source manifest/bundle, control booleans/timestamp and both schemas' PP counts. The10 captured SQL definitions/ACLs and selected grant/view/RLS/role/index/default/trigger catalogs matched the exact-schema snapshot. All23 deployed sources matched exact Git blobs independently. Production marker/process/link identity remains e1fd; Partner remains84f27. Canonical was not started or enabled. These are bounded before/after evidence checks plus a read-only command audit, not an assertion that no ordinary unrelated account activity happened anywhere.

Installed function source fingerprints (MD5 of PostgreSQL prosrc, independently matched in the disposable DB): public claim `1ad818bca177e757372c53e32bd7bec0`; owned claim `825f67bd408016d2cc415065a32a31d7`; public enrollment `b325f56c68fc3869bd3a21161654ada7`; owned enrollment `9542aa2a26b1565c77c5af561a75acc0`; public enrollment-mode helper `dd084eb30f931416fc504b130ab6d4b0`; each schema's state guard `d6f323660816c7cd9652ec15d034b5d4` and intent guard `d6d45f6680f00263cd06e976a283397a`; owned current_account `099356510db85329530f293ed7773f58`. These identify source, not a claim of cryptographic security of MD5.

Files inspected: exact deployed `api/copytrade.ts` from both commits; `_shared/futures-profit-protection.ts`, lifecycle, execution, economics, enrollment, runtime and partner-copytrade-context; canonical worker; Partner main/service/http/database/network/contract/build manifest; `migrations/futures_profit_protection.sql`, `futures_profit_protection_automatic_enrollment.sql`, `partner_copytrade.sql`; current systemd/proc/link metadata and bounded PostgreSQL function/grant/view/role/RLS/index/default/trigger catalogs. Root instructions/runbook and relevant prior rollout report/HANDOFF were read. No unrelated trading module was changed.

Files created/changed only for this task: this report, a documentation-only HANDOFF addition, and isolated `tmp/pp-path-comparison-20261003/{runtime-read.py,capture.mjs,pg-wire.mjs,compare.mjs,crash-child.mjs}` plus generated local evidence. No application/worker/Partner/SQL/policy/workflow source changed. No new full application build/CI was needed or run for an unchanged-source audit. Root/candidate Git HEADs were not moved.

Local raw evidence SHA-256 values:

```text
results.json          4e0eb425743a9763a658cbc3409989f4711f76d02d78ce7559aa3ef1329b334a
extended-results.json a486620dcff5dd883b46f873c8c54bfcc3b60152ebff07830328b1972be5fc6f
runtime-before.json   0125274f0d07d4c093ea963c9b6b8801e9951a3ebcf1eb3b231bb20a6e1f363a
runtime-after.json    9d0d746927d939ce25d5d51058411de1e0d70387428c7578176840ac11c1641b
compare.mjs           68ebd060d8dd09a5381e6472693a57a0d086dbfbdda6878f44924601c831c63c
pg-wire.mjs           a06b64fc362604d74d17edb86324e967401bb4f503f6d9ef0a52736f05e530d3
crash-child.mjs       e832b7bde27601934aa28da98cfcf76070551197e2e862db3c468a3164c7e205
```

Raw records are generated/synthetic or sanitized read-only metadata; not committed to the application or AI-Log. AI-Log receives only this reviewed report, not source, DB export, account rows or credentials. Documentation publication status/commit is reported separately after remote verification.

## 20. Recommended next controlled step / final status

ابتدا طرح مرجع مشترک خروج و قرارداد هویت بومی را در شاخهٔ ایزوله با دادهٔ ساختگی پیاده‌سازی و بررسی کنید؛ سپس همین ماتریس را بدون حذف هیچ سناریو تکرار کنید. معیار پذیرش باید **صفر مجوز و پیشنهاد بستن دوگانه با مجوزهای سالم هر دو مسیر** باشد، نه صفر شدن صرفاً بر اثر خطای مجوز. تا آن زمان Canonical را در Production فعال نکنید. هیچ service موجود در این بررسی متوقف/تغییر داده نشد.

```text
PHASE=PP-PATH-COMPARISON
CANONICAL_TESTED=YES
PARTNER_TESTED=YES
CANONICAL_POLICY_BEHAVIOR=PASS
PARTNER_POLICY_BEHAVIOR=PASS
CANONICAL_OWNERSHIP=FAIL
PARTNER_OWNERSHIP=FAIL
CROSS_SCHEMA_CONCURRENCY=FAIL
DUPLICATE_CLOSE_PROTECTION=FAIL
RESTART_SAFETY=NOT_PROVEN
FAILURE_RECOVERY=NOT_PROVEN
NATIVE_POSITION_IDENTITY=FAIL
RACE_TESTS=3000
DOUBLE_CLOSE=2000_FAKE_TOTAL_1000_ACTUAL_ROLE_1000_PRIVILEGED_DIAGNOSTIC
DOUBLE_AUTHORIZATION=2000_TOTAL_1000_ACTUAL_ROLE_1000_PRIVILEGED_DIAGNOSTIC
CLAIM_CONFLICTS=0_CROSS_SCHEMA_RACES
SELECTED_ARCHITECTURE=NEITHER_SAFE_YET
SELECTION_REASON=FACTUAL_EVIDENCE_ONLY
REPAIR_REQUIRED=YES
PRODUCTION_WORKER_STARTED=NO
PRODUCTION_TOUCHED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
EXCHANGE_CALLS=0
REAL_CLOSE_ACTIONS=0
COMMIT=NONE_APPLICATION
PUSH=NO_APPLICATION_PUSH
CI=NOT_RUN
DEPLOYMENT=NO
FINAL_CLASSIFICATION=PP_PATH_COMPARISON_COMPLETE_ACTIVATION_BLOCKED
STOP
```

Ownership/native-identity FAIL is a structural result for possible shared native positions, **not** a claim that an actual current customer's two live accounts overlap. Restart/failure NOT_PROVEN is global/live qualification; the bounded local persistence/failure cases above passed. Separate report-only AI-Log publication is required by standing owner instructions and is not an application push or release.
