# Futures PP — actual-path ownership bridge audit

## Metadata

- Date: 2026-10-03, Asia/Kuala_Lumpur; UTC evidence collected on 2026-10-02.
- Task: PP-REAL-PATH-OWNERSHIP-BRIDGE-AUDIT.
- Mode: source/catalog/runtime READ-ONLY audit and design; documentation only.
- Main workspace: `C:/Projects/SignalVerse-Main`, unchanged HEAD `0dbca62357a4adf34240f40ceda3e387356ec4b0`.
- Existing local candidate: `tmp/futures-pp-auto-enrollment-20261002`, branch `codex/futures-pp-auto-enrollment-20261002`, unchanged HEAD `e1fdc45f29b350670e707de3a7afa10b9153d689`.
- Installed Canonical source identity: `e1fdc45f29b350670e707de3a7afa10b9153d689`.
- Installed Partner source identity: `84f27c2e40b02b0dbf61c58429cf7c45f4f852da`.
- Final classification: **NOT_PROVEN**. No new implementation, integrated race test, application commit/push, CI, activation or deployment.

## Executive result / scope

Both actual paths are traced below, including account selection, database namespace, policy, durable admission, exchange submission and cleanup. They share policy/lifecycle/adapter source, but **not a durable native-position owner**. The same local RPC name resolves to two different schema-local functions and tables. Neither native-account equivalence nor cross-path position-generation equivalence is recorded by these callers. No existing usable Canonical-to-Partner ownership bridge was found in the inspected paths/records.

An important version distinction: installed Canonical source contains automatic enrollment discovery; installed Partner source is an older separately pinned bundle with manual enrollment. Reusing the same function name does not make these two deployed implementations identical.

Consequently the user's prerequisite for integrated tests is unsatisfied. Those tests were deliberately NOT RUN. The previous 6,000 synthetic kernel races are historical, isolated evidence, not integrated acceptance. This audit neither substitutes new abstractions for the missing bridge nor modifies the previous implementation, tests or reports.

Read-only Production observation was performed using the already-reviewed bounded source/catalog capture. No account rows, credentials, private exchange response, or exchange API were accessed. `PRODUCTION_TOUCHED=NO` below means **no mutation by this task**, not no observation or a claim that all other trading activity stopped.

## Evidence conventions and exact sources

Source line ranges refer to immutable Git blobs, not guessed deployed line numbers:

- **C**: `git show e1fdc45f29b350670e707de3a7afa10b9153d689:<path>`.
- **P**: `git show 84f27c2e40b02b0dbf61c58429cf7c45f4f852da:<path>`.
- **L**: existing local candidate working file; includes the previously added five-line MEXC precision rejection, not deployed.

Source function ranges were extracted independently using TypeScript AST without importing/bootstrapping the application. All code citations below specify file, function/DDL block and line range. Shared PP policy/lifecycle/execution/context files and Partner service/database/network files inspected at C and P match the runtime captures. Do not silently use L as deployed source.

Existing read-only capture: `tmp/pp-path-comparison-20261003/runtime-native-identity-audit.json`, collected `2026-10-02T20:31:54.439569Z`, SHA-256 `7e62463425a1ad4df6d19ec7f534435ab577daffff00462e5e2877994b866246`.

New capture: `tmp/pp-path-comparison-20261003/runtime-ownership-bridge-audit.json`, collected `2026-10-02T21:17:19.076304Z`, SHA-256 `15602987d5a0938c35b9cfd2e807ca867ac69fcf29ee61f9bff38a92a78ddd62`.

The capture script is `tmp/pp-path-comparison-20261003/capture.mjs`, using the previously reviewed `runtime-read.py`. It reads service properties, selected nonsecret process flags, source hashes/mtime, release links, Partner manifest and a bounded repeatable-read/READ ONLY PostgreSQL transaction with ROLLBACK. Database queries inspect relevant definitions/ACLs/indexes/RLS/views and aggregate PP counts, not account/trade content. No capture payload/database export is published with this sanitized report.

### Files inspected

| File/source | Exact function or block / range inspected | Purpose |
| --- | --- | --- |
| C `api/copytrade.ts` | client initialization 1–45; `getMexcOpenPosition` 667–681; `getGateOpenPosition` 7678–7687; `getBinanceOpenPosition` 8351–8366 | DB routing and actual native projections |
| C `api/copytrade.ts` | `existingFuturesClose` 15960–15973; `trackedFuturesClosePorts` 15974–15994; `profitProtectionControl` 15995–16000 | Actual close authorization |
| C `api/copytrade.ts` | `enrollOpenProfitProtection` 16029–16081; `discoverOpenProfitProtection` 16085–16109; `saveProfitProtection` 16110–16128; `profitProtectionNativePosition` 16146–16164 | Discovery, enrollment and CAS |
| C `api/copytrade.ts` | `profitProtectionObservation` 16215–16241; `cleanupProfitProtection` 16242–16267; `runProfitProtectionPosition` 16268–16382; `profitProtectionMonitorTick` 16392–16447; `ensureProfitProtectionMonitor` 16448–16456 and worker bootstrap 16458–16461 | Complete Canonical path |
| P `api/copytrade.ts` | `getMexcOpenPosition` 665–679; `getGateOpenPosition` 7676–7685; `getBinanceOpenPosition` 8349–8364; `existingFuturesClose` 15957–15969; `trackedFuturesClosePorts` 15970–15988; `profitProtectionControl` 15989–15994 | Separately pinned Partner path |
| P `api/copytrade.ts` | `saveProfitProtection` 16003–16015; `profitProtectionNativePosition` 16032–16049; `profitProtectionObservation` 16099–16121; `cleanupProfitProtection` 16122–16146; `runProfitProtectionPosition` 16147–16254; `profitProtectionMonitorTick` 16263–16304 | Complete Partner monitoring/execution |
| P `api/copytrade.ts` | authenticated `profit-protection-position` branch 16371–16437, especially state/RPC 16430–16435 | Manual Partner enrollment, not automatic discovery |
| C/P `api/_shared/partner-copytrade-context.ts` | `currentPartnerCopytrade` / `withPartnerCopytrade` 15–17; `copytradeDatabase` 19–25; `copytradeFetch` 26–27 | AsyncLocalStorage routing, not a global ownership lock |
| C `api/_shared/futures-profit-protection-runtime.ts` | `profitProtectionReadDatabase` 19–48 | LIVE keeps routed DB; VERIFY_ONLY blocks effects |
| C/P `api/_shared/futures-profit-protection.ts` | `ProtectionIdentity` 24–30; `createProtectionState` 50–68; `evaluateProfitProtection` 69–127 | Exact identity and policy; no new policy audit/change |
| C `api/_shared/futures-profit-protection-enrollment.ts` | `profitProtectionEligibility` 16–24; `enrollProfitProtection` 32–53 | Current automatic admission identity construction |
| C/P `api/_shared/futures-profit-protection-lifecycle.ts` | `sameEpoch` 19–24; `driveProfitProtection` 27–101 | CAS, policy versus execution, restart/flat order |
| C/P `api/_shared/futures-profit-protection-execution.ts` | context/ports 4–15; `executeTrackedFullClose` 16–51 | Actual shared adapter hook, not global authority |
| C `server/futures-profit-protection/worker.mjs` | `bootProfitProtectionWorker` 113–126; entrypoint 127–134 | Dedicated Canonical bootstrap |
| C/P `server/partner-copytrade/main.ts` | bootstrap 1–12 | Separate pinned Partner process and DB endpoint |
| C/P `server/partner-copytrade/http.ts` | `start` 4–28, scheduler 21–26 | Actual Partner PP sweep cadence |
| C/P `server/partner-copytrade/service.ts` | `context` 13–34; `handle` 39–90; `sweep` 94–113 | Account/context, API and monitor caller |
| C/P `server/partner-copytrade/database.mjs` | `ownedDatabase` 14–21; `Registry.client/tenant` 30–36; `Registry.bind` 37–57; `Registry.all` 73 | Tenant schema/role and per-key binding |
| C/P `server/partner-copytrade/contract.mjs` | tables/RPC/shared-read allowlists 4–16; `command` 34–45 | No shared native-owner RPC allowance |
| C/P `server/partner-copytrade/network.mjs` | `classifyRequest` 9–51; `ownedFetch` 52–60 | Venue/product boundary; exits lack native shared claim |
| C/P `server/partner-copytrade/receipts.mjs` | constructor/claim/read/finish 7–15 | Partner command idempotency, not native-position owner |
| C `migrations/immutable_ledger_schema.sql` | `copy_trades` 49–74 | Local trade UUID/order lifecycle, not native account |
| C `migrations/real_accounts_multi_exchange.sql` | composite account PK 15–16; exchange propagation 22–25 | Telegram/exchange binding |
| C `migrations/futures_execution_attempts.sql` | table/unique active entry 8–37; immutable transition guard 39–74 | Durable local entry evidence, not cross-path exit owner |
| C `migrations/futures_profit_protection.sql` | state/intent tables and indexes 26–44; state/intent guards 46–102; claim 106–123 | Actual durable schema-local ownership |
| C `migrations/futures_profit_protection_automatic_enrollment.sql` | public enrollment 18–75; Partner clone 80–94; locked boolean control helper 7–17 | Installed enrollment contract and deliberate namespace isolation |
| C/P `migrations/partner_copytrade.sql` | accounts/uniqueness 22–36; owned clones/RLS 47–98; RPC cloning 116–134; global-control view 156–159 | Physical independent records, not common rows |
| C `migrations/futures_reanalysis_claims.sql` | trade-keyed claims/pending 7–26; `request_futures_reanalysis_run` 31–61 | Existing reconciliation/protection admission record candidate |
| C `migrations/futures_protection_proposals.sql` | trade-keyed proposal/history 22–59; pending index 68–71 | Existing protection lifecycle candidate, not shared close owner |
| L `api/_shared/futures-native-exit-ownership.ts`; L `migrations/futures_native_exit_authority_candidate.sql` | prior prototype only; searched actual API/server callers for imports/native claim/spend RPCs | No actual-path wiring/registrar proof; no change this task |
| L `scripts/futures-profit-protection-test.mjs` | exact parity case 301–311 | Diagnose previous one failure |
| L `scripts/lib/futures-profit-protection-verify-only-parity.mjs` | pinned byte hashes/helper 5–14 | Reproduce actual contract rejection without changing assertions |
| Existing local reports | `pp-path-comparison-2026-10-03.md`, `pp-shared-ownership-dual-confirmation-2026-10-03.md`, `pp-native-identity-single-authority-2026-10-03.md` | Historical tests/failures remain preserved |

Project entry instructions/runbook and AI-Log README/report template were also reviewed. No report, optional untracked contributor work or historical evidence was removed.

## 1. Canonical complete trace

The code path exists but its dedicated Production service is **disabled/inactive/PID 0** at the observed checkpoints. Tracing reachability is not claiming this Worker submitted live closes.

```text
C worker.bootProfitProtectionWorker -> import exact .runtime/api/copytrade.mjs
  -> ensureProfitProtectionMonitor -> profitProtectionMonitorTick
  -> public PP state discovery / public OPEN copy_trades auto-enrollment
  -> public local trade + real_accounts(telegram_id, exchange)
  -> native projection / original COMMITTED execution attempt
  -> public futures_enroll_profit_protection
  -> driveProfitProtection -> unchanged evaluateProfitProtection
  -> public state CAS EXIT_PREPARED -> EXIT_SUBMITTED
  -> close{Binance,Gate,Mexc}Trade(context)
  -> executeTrackedFullClose -> public futures_claim_position_close
  -> venue submit callback -> signed exchange request
  -> independent native flat read -> local intent evidence
  -> next lifecycle read -> owned-protection cleanup -> local reconciliation
```

| Stage | SOURCE / FUNCTION / LINE RANGE | IDENTITY and DATABASE RECORD | RPC / LOCK | AUTHORIZATION / EXECUTOR |
| --- | --- | --- | --- | --- |
| Position discovery | C `copytrade.ts`, `profitProtectionMonitorTick` 16392–16447; `discoverOpenProfitProtection` 16085–16109 | Existing `public.futures_profit_protection_positions.trade_id`; new local OPEN `public.copy_trades.id`, mode/exchange/symbol/side/entry/qty | Discovery SELECT, no claim; process `profitProtectionTicksInFlight` and cursor are only local scheduling | Global mode boolean permits consideration; dedicated worker invokes tick |
| Identity/account | C `copytrade.ts`, `runProfitProtectionPosition` 16268–16291; `profitProtectionNativePosition` 16146–16164; shared `ProtectionIdentity` 24–30 | Account from `public.real_accounts(telegram_id,exchange)`; native side/quantity/entry; MEXC `positionId` only; local trade ID/accepted request/opened_at in PP JSON | No native-account registry or global lifecycle lock | Existing selected account is used by native readers; not a native-account equivalence attestation |
| Enrollment | C `copytrade.ts`, `enrollOpenProfitProtection` 16029–16081; `enrollProfitProtection` 32–53; automatic SQL 18–73 | `public.futures_execution_attempts` COMMITTED, original SL/TP; `public.copy_trades`; inserts PP `identity/state` under local trade ID | `public.futures_enroll_profit_protection`, local `copy_trades FOR UPDATE`; existing row remains durable/idempotent | Eligibility/mode/user permission and matching native quantities; no orders during enrollment |
| Policy evaluation | C `copytrade.ts`, `profitProtectionObservation` 16215–16241; lifecycle `driveProfitProtection` 75–80; policy `evaluateProfitProtection` 69–127 | Existing PP JSON identity/state and executable observation; local revision | C `saveProfitProtection` 16110–16128 updates by local trade/revision CAS; trigger increments revision | Pure `CLOSE_PROFIT_PROTECTION` is a proposal, not a shared execution grant |
| Authorization | lifecycle 79–90; C `copytrade.ts`, close port 15974–15994 and PP context 16315–16322; SQL claim 106–123 | PP `closeIntentId` becomes token; `public.futures_position_close_intents(trade_id,token,telegram_id,exchange,symbol)` | `public.futures_claim_position_close`; local trade/state row locks, global control FOR SHARE; unique local trade/token/instrument | Requires OPEN real trade, enabled PP, persisted EXIT_SUBMITTED/token for PP reason. Only one **local** intent, not a global native owner |
| Execution | C `runProfitProtectionPosition` 16301–16323; shared `executeTrackedFullClose` 16–51 | Uses enrolled native quantity, side/entry, token, observation age; MEXC context native ID | Pre-submit native read then local claim; no separate shared spend/owner RPC | Winning local admission calls `submit()` once; response loss becomes durable UNKNOWN, no POST retry branch |
| Exchange adapter | C `closeMexcTrade` 646–665; `closeGateTrade` 7861–7875; `closeBinanceTrade` 8836–8848 | Venue pair and native qty; MEXC native ID; Gate signed contract size; Binance reduceOnly qty | Exchange adapter/fill validation; no additional DB global ownership gate | Exactly the existing signed request submits the native market close; see endpoint table below |
| Flat verification | shared execution 36–48; lifecycle 40–69; C `profitProtectionMonitorTick` 16403–16422 | Independent native read must be null; local same-token evidence becomes FLAT_CONFIRMED; uncertain rows remain held | Local intent update; current-state lifecycle CAS | Null must come from validated reader, not exception. No new close on restart/UNKNOWN |
| Cleanup/reconciliation | C `cleanupProfitProtection` 16242–16267; lifecycle 54–64; `runProfitProtectionPosition` 16325–16379 | Persisted local SL/TP order IDs; local owned token/reason/flat/fill; adapter reconciliation; local trade status | Local CAS/trade update, signal resolution, post-trade queue; no cross-path cleanup owner | Only after independent flat; cancels stored owned protection and records local result. This path was inspected, NOT executed |

The native quantity differs from base-asset quantity for contract venues: enrollment reads MEXC contractSize / Gate quantoMultiplier before comparing to local `copy_trades.qty` (C enrollment 16059–16066); the close uses `identity.nativeQuantity`, not the normalized asset quantity. Matching quantity does not establish a native position generation.

## 2. Partner complete trace — actual pinned bundle, not hypothetical current code

Partner's separate bootstrap forbids the Canonical worker flag but uses its **own** enabled scheduler. `FUTURES_PROFIT_PROTECTION_WORKER=0` does not mean its PP sweep is OFF: P `main.ts` 1–11, `http.ts/start` 21–26, `service.ts/sweep` 94–113 explicitly invoke PP for `market=usdm`. The process was already active before this task; it was not started, stopped or altered.

```text
P main -> http.start(worker=true) -> 1-second profit-protection sweep
  -> Registry.all accounts -> OwnedCopytradeService.context
  -> withPartnerCopytrade -> tenant JWT/account_id + ownedDatabase
  -> P profitProtectionMonitorTick (existing enrolled states only)
  -> partner_copytrade local trade + owned real_accounts(actor, exchange)
  -> unchanged policy/lifecycle -> local CAS -> local close context
  -> venue adapter -> executeTrackedFullClose
  -> partner_copytrade.futures_claim_position_close
  -> ownedFetch venue/product checks -> native request
  -> native flat -> owned intent evidence -> cleanup/reconciliation

Separate enrollment route:
authenticated owned command profit-protection-position
  -> P handleAuthenticatedCopytrade manual enrollment
  -> local COMMITTED attempt + native validation
  -> partner_copytrade.futures_enroll_profit_protection
```

| Stage | SOURCE / FUNCTION / LINE RANGE | IDENTITY and DATABASE RECORD | RPC / LOCK | AUTHORIZATION / EXECUTOR |
| --- | --- | --- | --- | --- |
| Position discovery | P `http.ts/start` 21–26; `service.ts/sweep` 94–113; P `copytrade.ts/profitProtectionMonitorTick` 16263–16304 | Registry account UUID first; then RLS-scoped `partner_copytrade.futures_profit_protection_positions.trade_id`; loads associated owned trade | Per-account/process busy Set; schema-local state queries | Existing enrolled state considered. **No automatic OPEN-trade enrollment in this pinned tick** |
| Identity/account | P `service.ts/context` 13–34; `database.mjs/client/tenant` 30–36; P `runProfitProtectionPosition` 16147–16168 / native reader 16032–16049 | Partner/subject/account UUID plus private numeric actor; owned trade UUID; owned `real_accounts(actor,exchange)`; projected native side/qty/entry and MEXC positionId | JWT `account_id`, forced RLS; separate PostgREST schema; not a native account/lifecycle registry | Server context binds the local account; shared control read is not a common execution owner |
| Enrollment | P `service.ts/handle` 62–86; P authenticated branch 16371–16437 | Original COMMITTED owned attempt, local trade opened_at; createProtectionState uses local trade/accepted request; persists identity JSON | `partner_copytrade.futures_enroll_profit_protection`, cloned SECURITY INVOKER local row lock | Authenticated manual command; older API also rejects analytical TP2/TP3. New SQL alone does not replace this old JS gate |
| Policy evaluation | P `copytrade.ts/profitProtectionObservation` 16099–16121; `runProfitProtectionPosition` 16169–16174; same shared lifecycle 75–80 | Owned PP state/revision; same pure policy and observations | P `saveProfitProtection` 16003–16015 CAS on owned trade/revision | Local close proposal only; no required independent Canonical confirmation |
| Authorization | P `runProfitProtectionPosition` 16188–16196; `trackedFuturesClosePorts` 15970–15988; cloned SQL described below | Owned trade UUID + local PP intent token; owned close-intent row | `partner_copytrade.futures_claim_position_close`, local trade/state FOR UPDATE and local unique indexes | Same semantic checks but **different rows/locks**; restricted Partner role, not service_role |
| Execution | P PP close callback 16175–16197; shared `executeTrackedFullClose` 16–51 | Owned identity and close context; native qty/entry/side checked; MEXC ID checked by adapter | Tenant claim first; no shared native spend/owner call | Local permitted submit callback; not contingent on another path's claim/token |
| Exchange adapter | P `closeMexcTrade` 644–663; `closeGateTrade` 7859–7873; `closeBinanceTrade` 8834–8846; `ownedFetch` 52–60 | Existing account-bound native payload; native ID for MEXC | Product/venue guard; entry lease checks only for `kind=entry` | Exit requests can continue during lease expiry/revocation; transport does not verify a common DB ownership token |
| Flat verification | Same execution 36–48/lifecycle 40–69; P uncertain monitor 16270–16285 | Validated native reader, owned same-token intent evidence | Owned intent persistence | Unknown outcomes retain hold; no close retry, but holds are not shared with public |
| Cleanup/reconciliation | P `cleanupProfitProtection` 16122–16146; PP callbacks 16198–16251; same lifecycle 54–64 | Owned stored protection IDs, local reason/token/fill; owned trade reconciliation | Owned CAS/update and existing adapter reconciliation | Same ordering principle; **not coordinated with Canonical cleanup/native generation** |

### Existing Partner admission limitation — not a shared safety guarantee

The installed Partner close RPC still executes `SELECT ... FOR SHARE` against the Partner global-control view for PP reasons. The view is SELECT-only for the restricted actor. The automatic-enrollment migration introduced a public locked-boolean helper **for enrollment**, not for this close RPC. Actual captured definitions confirm these remain different functions:

- public claim body MD5 `1ad818bca177e757372c53e32bd7bec0`, SECURITY DEFINER, service_role grant;
- Partner claim body MD5 `825f67bd408016d2cc415065a32a31d7`, SECURITY INVOKER, partner_copytrade_actor grant.

Evidence: SQL claim 106–123; Partner clone 116–129 and control view 156–159; automatic-enrollment helper/clone 7–17, 80–94; exact runtime catalog capture above. The prior disposable actual-role diagnostic recorded SQLSTATE 42501 for Partner PP admission. It was **not rerun or repaired** here. This local role denial does not prove shared ownership: `EXISTING_EXIT` bypasses the PP control branch, and unenrolled adapter calls can omit tracked admission. Likewise current zero state rows / inactive Canonical service are not a synchronization mechanism.

## 3. Native position identity, separately by venue

Only official documentation pages were consulted; no exchange account/API call occurred. Documentation describes field semantics, not a demonstrated same-account/same-lifecycle linkage in Production.

| Venue | Actual endpoint / fields / mapping | Current persistence | Proven identity result |
| --- | --- | --- | --- |
| Binance | GET `/fapi/v3/positionRisk`; documented symbol, positionSide, positionAmt, entryPrice, updateTime. C `getBinanceOpenPosition` 8351–8366 / P 8349–8364 admits one-way BOTH, derives LONG/SHORT from signed amount, returns qty/entry/liquidation only | PP JSON local trade/acceptedRequestId/openedAt; no native account alias/subaccount, positionSide/product/settlement or independently observed generation retained | No stable lifecycle position ID in this endpoint's inspected schema. Current qty/entry/side comparison is not a unique lifecycle. **NOT_PROVEN** |
| MEXC | GET `/api/v1/private/position/open_positions`; native `positionId` (long), symbol, positionType, holdVol, holdAvgPrice/openAvgPrice. C reader 667–681 / P 665–679; PP projection C 16162–16164 / P 16047–16048 | Decimal `nativePositionId` in PP identity JSON at C enrollment 16065–16066, shared enrollment 46–49, SQL 66/70–71; P manual branch 16423/16430–16434. Close includes positionId and checks it | A real native Position ID field is present, NOT a local order/trade ID. Native-account binding, mode/state/lifecycle/reuse semantics and full cross-path uniqueness are unproved. **Full identity NOT_PROVEN** |
| Gate | GET `/api/v4/futures/usdt/positions/{contract}`; schema includes user, contract, size, mode, open_time, update_id, pid. C `getGateOpenPosition` 7678–7687 / P 7676–7685 validates mode=single but returns only qty/entry/side | user/open_time/pid/mode/update_id dropped before PP identity persistence; nativePositionId null | `pid` is documented as sub-account position ID; open_time is first-open time, update_id changes on update. Availability and non-reuse across required account/lifecycle scope are not proved; mapping also discards them. **NOT_PROVEN** |

Binance source supports only a current-position slot, not permanent generation: using local `opened_at`, accepted request UUID, updateTime, or a concatenated qty/entry/side string as a native position ID would be invented evidence. Missing a distinct generation permits two separate real lifecycles with the same projected values; no claim is made that this happened live. [Official Binance Position Information V3](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade).

MEXC semantics: `positionType` specifies direction; `openType` distinguishes isolated/cross margin, not one-way/hedge position mode; state distinguishes held/system-held/closed, with create/update timestamps. The documented example has positionId `1109973831`, symbol BTC_USDT, positionType 1, state 1. Current mapping keeps positionId/size/average/side but not the native account, mode attestation or creation/state fields. The page does not establish globally non-reused IDs across every account and lifecycle. [Official MEXC Open Positions](https://www.mexc.com/api-docs/futures/account-and-trading-endpoints/get-open-positions).

The previously made **local-only** MEXC precision rejection (L reader 675–679) rejects unsafe numeric IDs before converting to a string. It is still uncommitted and is not installed at C or P; rejecting rounded IDs improves one input guard, not native-account/global uniqueness proof. No Production MEXC ID was read to claim an actual precision incident.

Gate exposes relevant native fields; stating Gate has no position identity fields would be incorrect. They are optional in the inspected schema, and pid's documented subaccount scope must be preserved/verified rather than assumed universal. `close_order.id` is an order reference, not a position ID. [Official Gate Position schema](https://www.gate.com/docs/developers/apiv4/en/futures/#position).

```text
NATIVE_POSITION_IDENTITY_PROVEN=NO
REASON=NO_TRUSTED_CROSS_PATH_NATIVE_ACCOUNT_AND_LIFECYCLE_BINDING
```

## 4. Existing records searched FIRST — no new table created

| Existing record | What it already proves / source | Why it is not currently a shared native owner |
| --- | --- | --- |
| public/owned `copy_trades` | Local UUID, actor, venue/symbol/side/qty, entry/protection order IDs, opened/closed timestamps; immutable schema 49–74; owned clone 49–98 | Separate physical tables and local UUIDs. No cross-schema native-account/generation/alias pointer |
| public/owned `real_accounts` | Local actor/exchange binding; composite PK migration 15–16; PP account selectors C 16278–16281 / P 16155–16159 | Credentials identify a configured key, not an independently persisted native account across keys. No public-to-Partner binding in these selectors |
| Partner `accounts` | UUID owner/subject/exchange/product and per-key credential fingerprint; Registry.bind 37–57; SQL 22–36 | HMAC includes API key; same key uniqueness is Partner-only. Different keys for the same exchange account are not equated, and public binding is absent |
| public/owned `futures_execution_attempts` | Durable accepted local entry UUID, normalized symbol, request hash, client/native order ID and trade_id; SQL 8–37/39–74; C `claimRealExecutionAttempt` 10415–10467, `markRealExecutionSubmitted` 10469–10480, `finishRealExecutionAttempt` 10482–10507 | Entry reservation/journal, not a native-position lifetime or shared exit grant. Order ID/clientOrderId must not be relabelled position ID |
| public/owned PP enrollment | Immutable local accepted risk + projected native position; PP SQL 26–33/46–78; automatic enrollment 23–71 | Useful existing provenance to retain, but local trade primary key and missing native account/generation/bridge |
| public/owned close intent | Durable token, reason, phase, reference/fill, local active-instrument uniqueness; PP SQL 34–44/79–123 | Best existing close-admission/uncertainty evidence to reuse, but each namespace locks/inserts different rows; key lacks native account/product/lifecycle |
| public/owned reanalysis claims/pending/proposals | Local immutable trade lifecycle and protection proposal history; reanalysis SQL 7–26/52–61; proposal SQL 22–59/68–71 | Local protection/reanalysis coordination, not cross-path full-close ownership; not appropriate to conflate these policies |
| Partner command receipts | SQLite primary key partner/subject/account/request UUID, response-loss hold; Receipts 7–15 and service.handle 65/88 | Protects request replay in one service. PP timer does not go through this command receipt; Canonical has no pointer to it |
| Reconciliation / economic records | C PP reconciliation 16343–16379 / P 16216–16251 connects local trade, entry/close order and native accounting | Post-outcome recording is not pre-submit authorization; no common owner/generation pointer |
| Shared control table/view | Partner read-only view of public mode booleans; SQL 156–159 and ownedDatabase 14–21 | Shared operator policy is not shared ownership, native identity, token or claim |
| Local prior native kernel/SQL | Untracked candidate has synthetic account/slot/binding/owner records and isolated tests | No actual caller/registrar/native-account attestation; not deployed or current authoritative data. Passing isolated mocks is not an existing live bridge |

Searches covered relevant migration definitions, native/position identifiers, close-call sites and caller/RPC allowlists; catalog checks independently confirmed current state/intent indexes/roles/RLS/function bodies. This is a bounded claim about **these actual execution paths and their evidence**, not a claim that every unrelated table in every project was inspected.

Existing local records are valuable inputs for a future bridge and should be preserved/reused. **No currently suitable shared ownership row was found.** Creating new tables is not authorized/performed by this result.

## 5. Cross-path bridge proof attempt — fails at shared row

For one hypothetical native account and native open position, let public local trade be C1 and owned local trade be P1. These are symbols for the proof, not real account/trade identifiers:

```text
Canonical: C1 -> public PP/CLOSE row -> public.futures_claim_position_close(C1, tokenC)
Partner:   P1 -> owned  PP/CLOSE row -> partner_copytrade.futures_claim_position_close(P1, tokenP)

No recorded edge C1 -> shared native owner <- P1
No proof C1 == P1
Even C1 == P1 by coincidence would still address different physical table rows.
```

Proof sources: local identities in shared `ProtectionIdentity` 24–30 / enrollment 46–49; schema routing `copytradeDatabase` 19–25 and `ownedDatabase` 14–21; physical CREATE TABLE LIKE and owner-FK cloning in Partner SQL 61–98; RPC namespace rewrite 120–129; claim local SQL 110–121; runtime captured indexes/functions above.

The actual active-instrument indexes are separately:

```text
public.futures_position_close_intents
  UNIQUE (telegram_id, exchange, symbol) WHERE phase IN (EXIT_SUBMITTED, UNKNOWN)
partner_copytrade.futures_position_close_intents
  UNIQUE (telegram_id, exchange, symbol) WHERE phase IN (EXIT_SUBMITTED, UNKNOWN)
```

A private Partner actor and a public Telegram ID need not match. Even equal actors would not make two indexes mutually exclusive. No claim statement joins, locks or resolves both to a common native-account/lifecycle owner. Partner's shared-read allowlist contains only controls/configuration, not shared close records; its RPC allowlist dispatches to tenant functions only.

```text
CROSS_PATH_BRIDGE=NOT_PROVEN
CANONICAL_ID_EQUALS_PARTNER_ID=NOT_PROVEN
SAME_DURABLE_OWNERSHIP_ROW=NOT_PROVEN
```

No real overlapping account/position was looked up or invented. Source-level independent authorization reachability is established; actual concurrent native double-close frequency is NOT_MEASURED.

## 6. Last common pre-exchange point and current bypasses

For **enrolled standard PP application closes**, the actual common hook is:

`api/_shared/futures-profit-protection-execution.ts::executeTrackedFullClose`, lines 16–51, specifically native validation 19–29 → local `ports.claim` 30 → `submit` 33. Both C/P PP callbacks always provide TrackedCloseContext. This is the smallest existing place where a future account/generation-bound shared DB authorization/claim/one-time-spend could be enforced, **after** identity/bridge proof and separate implementation authorization. It is not enforced today.

Immediately before each native POST the venue-specific submit callback is the final actual executable boundary:

| Venue | C function / range / POST | P function / range / POST | Native signed transport |
| --- | --- | --- | --- |
| MEXC | `closeMexcTrade` 646–665; POST 653 | same 644–663; POST 651 | `/api/v1/private/order/submit`; close side 4/2, vol, positionId; C mexcSignedRequest 321–349 / P 319–347 |
| Gate | `closeGateTrade` 7861–7875; POST 7865 | same 7859–7873; POST 7863 | `/api/v4/futures/usdt/orders`, signed opposite contract size, reduce_only IOC; C gateSignedRequest 7596–7624 / P 7594–7622 |
| Binance | `closeBinanceTrade` 8836–8848; POST 8839 | same 8834–8846; POST 8837 | `/fapi/v1/order`, opposite MARKET side, reduceOnly, quantity; C binanceSignedRequest 296–316 / P 294–314 |

All eleven actual calls to the three close adapters in each immutable `api/copytrade.ts` were AST-traced. No caller imported the prior native-ownership prototype:

| Caller | C call lines | P call lines | Admission routing |
| --- | --- | --- | --- |
| `applyRealMexcAction` | 2495 | 2493 | `existingFuturesClose(t)` |
| `applyRealGateAction` | 7930 | 7928 | `existingFuturesClose(t)` |
| `applyRealBinanceAction` | 9069 | 9067 | `existingFuturesClose(t)` |
| `syncRealBinanceTrades` | 10253 | 10251 | `existingFuturesClose(t)` |
| `runProfitProtectionPosition` | 16318, 16319, 16322 | 16191, 16192, 16195 | PP TrackedCloseContext; local RPC |
| `handleAuthenticatedCopytrade`, manual close | 18860, 18906, 18926 | 18758, 18804, 18824 | `existingFuturesClose(trade)` |
| `openBinanceTrade`, entry-protection failure cleanup | 8800 | 8798 | No close context; not PP ownership |

Important qualifiers:

1. `existingFuturesClose` returns undefined for unenrolled, Fast/Whale or absent legacy schema (C 15960–15973; P 15957–15969). Adapter tail ternaries then call submit directly (C MEXC 658–664, Gate 7871–7874, Binance 8844–8847). Thus the common hook is **not universal mediation** for all application close paths. Managed EXISTING_EXIT is still a schema-local claim, not a cross-path gate.
2. `ownedFetch` validates venue/product and classifies a native reduce-only close as exit; its lease check applies only to entries (`network.mjs` 52–60). It has no atomic native-owner/token DB check. A Javascript Set, the two processes' scheduling flags, or transport allowlist cannot replace the shared durable gate.
3. Legacy `closeRealTrade` sends a direct Binance reduce-only POST (C 1406–1414 / P 1404–1412); the manual handler fallback references it after the supported-venue branches (C call 18938; P 18836). No supported Binance/MEXC/Gate branch uses this fallback; its use by any legacy unsupported account is not established. It must not be miscounted as a proved active PP route or silently fixed here.
4. Native exchange SL/TP/liquidation/manual-exchange actions occur outside an application execution gate. A future gate must preserve their reconciliation rather than claim control of exchange-side automation.
5. The unchanged tracked helper reads native state before claim and post-submit for flat, not an independently bound post-claim shared spend. The prior prototype added such a second read locally, but current callers do not use it. No live closure race result is fabricated from this source ordering.

Therefore: both paths can reach native submission without a **common native durable authority** under their own admissible branches. This is not a claim that the currently inactive Canonical worker is actively racing Partner in Production, nor that Partner PP's permission error can be ignored.

## 7. Minimal design proposal ONLY — implementation prohibited until proof

### First complete evidence, not another kernel

1. Retain existing trade, entry-attempt, enrollment and close-intent records. Establish a trusted, lossless native **account/product/settlement/subaccount + symbol/mode/slot + lifecycle** proof that can link their local IDs. A per-key hash, local trade UUID or price/qty/side coincidence is insufficient. Required proof producer does not currently exist in the inspected paths.
2. Per venue, prove scope and lifecycle semantics before choosing the key. MEXC: exact positionId with account and native lifecycle/state correlation. Gate: retain/validate user/pid/open_time/mode with independently justified reuse rules; missing proof must deny. Binance: documented native slot and independently correlated entry/flat/lifecycle evidence; never rename updateTime or an invented epoch as a native ID. This task does not fetch credentials or attest an account.
3. Only after that evidence can both local trade references be bound to the same durable ownership identity. Explicitly define native reopen, aggregation/addition, partial/external change and ambiguous response behavior. Unknown ownership is a hold, not an expiring lease.

### Reuse existing authorization path once bridge is proven

The smallest future change is to reuse tracked-close hook and existing close-intent evidence, **not** replace the policy or add a second monitor/executor. Existing public intent `trade_id` FK/PK cannot represent a Partner-only trade or multiple local references by itself. A reviewed extension separating native owner key from local trade aliases is necessary if this ledger is selected; do not pretend an unchanged FK can act as the bridge. No schema or alias structure is implemented/selected as authoritative here.

Proposed future transaction at the existing pre-submit hook:

```text
prove alias -> native owner/generation
  -> lock ONE durable owner row in ONE namespace
  -> verify actor/account authorization + current PP controls
  -> verify persisted original policy revision/intent + native proof/freshness
  -> claim ONE token/authorized executor
  -> one-time durable execution spend (no uncertain replay)
  -> existing venue submit callback
  -> matching native flat/fill -> winner-bound cleanup/reconciliation
```

Both Canonical service role and Partner restricted account role would use narrowly account-bound shared RPCs; Partner RLS/isolation must remain intact, without public service-role or control-table write grants. Actual managed PP/manual/SL/TP application exits must resolve the same owner, including uncertainty and restart. Unmapped legacy positions require an explicit scope decision, not a silent bypass or forced shutdown of protection.

Policy computation remains unchanged and separate from authorization. If dual confirmation is required, two independently authenticated persisted path confirmations must bind the same native identity/snapshot/policy version/evaluation/revision; neither policy caller can independently submit. Calling the pure policy twice in one synthetic fixture is not that proof. Worker/Partner activity or scheduler changes are outside this task.

### Smallest affected paths if later authorized

- Native projections/enrollment identity and persistence: current native readers, `ProtectionIdentity`, enrollment and narrow identity evidence contract.
- Shared ownership resolution and account-bound RPC surface: existing PP close-intent storage/claim plus reviewed alias/native proof extension; Partner allowlist/database adapter only as needed to reach that shared authority.
- Pre-submit enforcement: `executeTrackedFullClose`, `trackedFuturesClosePorts`, existing close adapters' managed context handling; no new close executor or strategy rewrite.
- Winner-bound reconciliation: existing flat/evidence/cleanup callbacks retain holds and confirm current generation.
- Exact-byte scope contract review for the already-made local identity delta; assertions remain strict.

These are proposed boundaries, not permission to change them or a ready Production design. No new abstraction/table/module was created by this audit.

## 8. Independent disposition of the 146-test failure

Historical result remains 145 PASS / 1 FAIL / 146 total. No tests/assertions were repaired, skipped to improve acceptance or weakened.

Failed case: `scripts/futures-profit-protection-test.mjs`, test at 301–311, assertion 308: legacy parity permits only the exact approved PP delta and rejects unrelated Spot edits.

Rejecting function: `scripts/lib/futures-profit-protection-verify-only-parity.mjs::beforeVerifyOnlyProfitProtection`, lines 5–14, assertion 11. It LF-normalizes and permits exactly these `api/copytrade.ts` hashes:

```text
pre-Phase3B = 92e4400bae077640e38fad06d8cb26752007512a62e1b61f59dc37958ec6136e
approved Phase3B = 61977ce893dfdb65758df1041044f5d61f70a4931e3550dca006d0bf2ace09d2
current local = 5fcd84689c95f6db1def3dac884ce56fd6c8891d1dc60418aa8ca6ab50996125
```

At `2026-10-02T21:15:27.878Z`, an independent bounded diagnostic imported **only the existing parity helper**, read C baseline/current source, invoked the real helper on each, and printed the exact diff. No app bootstrap, credentials, DB, network or order transport was loaded by this diagnostic:

```text
C baseline helper: ACCEPT
L current helper: REJECT
code: ERR_ASSERTION
message: Only exact Phase 3B capability delta: api/copytrade.ts
location: scripts/lib/futures-profit-protection-verify-only-parity.mjs:11:10
diff: exactly 5 added lines in getMexcOpenPosition; 0 deletions
```

Classification: **genuine introduced exact-byte/source-scope contract failure caused by the prior local MEXC identity guard change**. Not a pre-existing baseline error, generated fixture/type issue, or measured strategy/close behavioral regression. The earlier 145 passing tests do not prove absence of all behavior defects. A necessary safety input guard still needs an explicitly reviewed narrow release-contract admission; this audit does not modify the contract or turn the failing release gate green.

## 9. Tests and source integrity

- Actual immutable-source AST caller/range extraction: completed, 11 three-adapter call sites per deployed source traced; no app execution.
- Real parity helper baseline/current diagnostic: completed as above, rejection reproduced; not a rerun of the 146 suite or integrated test.
- Existing source search: no actual API/server invocation of the previous native claim/spend prototype; current Partner RPC allowlist remains schema-local.
- Integrated tests: **NOT RUN**, required bridge absent. Specifically no 3,000 Canonical-v-Partner races, 3,000 authorization races, 3,000 execution races, or 1,000 restart/stale-authorization/stale-owner/retry/identity-mismatch categories; no new venue integrated identity suite. These requested groups are not replaced by prior kernel tests.
- Build/type-check/CI: NOT_RUN / NOT_STARTED; no source changed, no release acceptance claim.

Previously modified local source remained unchanged at the `2026-10-02T21:17:45.756Z` audit hash check:

| Existing local file | SHA-256, unchanged from preceding task |
| --- | --- |
| `api/copytrade.ts` | `5fcd84689c95f6db1def3dac884ce56fd6c8891d1dc60418aa8ca6ab50996125` |
| `api/_shared/futures-native-exit-ownership.ts` | `10d62b4b04bb6f7e16aadffa0dfb963488d7bc75da579d24d9e52d531fa865c4` |
| `migrations/futures_native_exit_authority_candidate.sql` | `cbdac629890fcb5d3a567b160946b62c17da9b3858c4da7e15f5c521516d5ebe` |

Unknown integrated counters are **NOT_MEASURED**, not zero. Existing synthetic ambiguity/counterexamples and historical test failures remain permanent evidence; neither 6,000 kernel passes nor an inactive service proves global safety.

## 10. Production safety and observed state

The new checkpoint independently matched 23/23 source files to the pinned Git blobs, with zero mismatches. Comparing old/new captures found **unchanged** all seven service records, release links, source hashes/mtime, Partner manifest/bundle and captured catalog/control/aggregate data (excluding only the observation timestamp). This is observation of those fields, not complete database/account activity certification.

| Runtime/service | Observed state at 2026-10-02T21:17:19.076304Z |
| --- | --- |
| marker, app/admin links and main cwd | `e1fdc45f29b350670e707de3a7afa10b9153d689` |
| application/admin/observer | active; PIDs 3202681 / 3202627 / 3202625, each NRestarts 0 |
| public PostgREST | active; PID 1960930, NRestarts 0 |
| Canonical PP worker | disabled / inactive / PID 0 / NRestarts 0; not started |
| Partner runtime | `84f27c2e40b02b0dbf61c58429cf7c45f4f852da`; pre-existing active PID 3092803, NRestarts 0 |
| Partner PostgREST | pre-existing active PID 3092801, NRestarts 0 |
| Partner flags | Canonical worker flag 0; own worker flag 1; Partner enabled 1; unchanged |
| Partner bundle hash | `fbd6312f1d9d0ba501eaed4ef4cf0bda1732cfe6ca00acab676a405538a8b1f1` |
| REAL_PP / DEMO_PP | already ON / ON, unchanged; control updated_at remains `2026-10-01T22:02:54.495Z` |
| public PP states / intents / PP-labelled closed trades | 0 / 0 / 0, unchanged |
| owned PP states / intents / PP-labelled closed trades | 0 / 0 / 0, unchanged |

It would be incorrect to report mode flags OFF or the Partner process disabled merely because the Canonical worker is inactive. No flag/service/account state was changed here. Aggregate zero PP records is not proof that no unrelated orders/positions exist or that no live trading occurred elsewhere.

## Changes, Git and publication

Only this sanitized report and the root local `HANDOFF.md` audit entry are changed by this task. Existing local diagnostic output is stored separately; no application/test/SQL source changes. Application HEADs remain unchanged; all prior dirty/untracked work is retained. No application commit, push, CI, Guard, artifact, release or deployment is performed.

The standing AGENTS.md reports-only publication route is `signal0verse/SignalVerse-AI-Log`, branch master. Only this report may be committed/pushed there after secret scan and staged-diff review. Its exact publication commit, remote-file digest verification and link are returned in the conversation/local handoff receipt; that documentation commit is not an application commit.

## Remaining blocker / recommended next decision

Native account/lifecycle proof and a real cross-path alias-to-owner bridge are the prerequisites. Approve a bounded **evidence contract/design review** before any integrated implementation. Reuse existing durable provenance/close-intent records wherever possible, without disguising namespace-local IDs as a native owner. Then separately authorize narrow integration, exact source-scope acceptance and actual-path tests. Production activation remains outside this phase.

## Final requested structure

```text
PHASE=PP-REAL-PATH-OWNERSHIP-BRIDGE-AUDIT

CANONICAL_PATH_TRACED=YES_SOURCE_AND_CATALOG
PARTNER_PATH_TRACED=YES_PINNED_SOURCE_AND_CATALOG

CANONICAL_POSITION_IDENTITY=PUBLIC_LOCAL_TRADE_ID_PLUS_PROJECTED_NATIVE_SNAPSHOT
PARTNER_POSITION_IDENTITY=OWNED_LOCAL_TRADE_ID_PLUS_ACCOUNT_UUID_ACTOR_AND_PROJECTED_NATIVE_SNAPSHOT

NATIVE_BINANCE_IDENTITY=NOT_PROVEN
NATIVE_MEXC_IDENTITY=POSITION_ID_PRESENT_FULL_NATIVE_IDENTITY_NOT_PROVEN
NATIVE_GATE_IDENTITY=FIELDS_PRESENT_DISCARDED_FULL_NATIVE_IDENTITY_NOT_PROVEN

SHARED_RECORD_FOUND=NO_SUITABLE_SHARED_NATIVE_OWNER
SHARED_RECORD=EXISTING_SCHEMA_LOCAL_PROVENANCE_AND_INTENTS_ONLY
CROSS_PATH_BRIDGE_PROVEN=NO

SINGLE_EXECUTION_GATE_FOUND=COMMON_TRACKED_HOOK_ONLY_NOT_GLOBALLY_ENFORCED
ATOMIC_OWNERSHIP_PROVEN=NO_CROSS_PATH
IDEMPOTENCY_GATE_PROVEN=NO_CROSS_PATH

CONTRACT_FAILURE_CLASSIFICATION=INTRODUCED_EXACT_BYTE_SCOPE_CONTRACT_CHANGE

INTEGRATED_TESTS_RUN=0_BRIDGE_NOT_PROVEN
INTEGRATED_TESTS_PASS=NOT_APPLICABLE_NOT_RUN
INTEGRATED_TESTS_FAIL=NOT_APPLICABLE_NOT_RUN

DOUBLE_AUTHORIZATION=NOT_MEASURED_INTEGRATED
DOUBLE_CLOSE=NOT_MEASURED_INTEGRATED
TWO_OWNERS=NOT_MEASURED_INTEGRATED
TWO_EXECUTORS=NOT_MEASURED_INTEGRATED
CROSS_PATH_DUPLICATE_CLOSE=NOT_MEASURED_INTEGRATED
IDENTITY_COLLISION=NOT_MEASURED_INTEGRATED
IDENTITY_AMBIGUITY=NOT_MEASURED_INTEGRATED
STALE_AUTH_CLOSE=NOT_MEASURED_INTEGRATED
RESTART_DUPLICATE_CLOSE=NOT_MEASURED_INTEGRATED
RETRY_DUPLICATE_CLOSE=NOT_MEASURED_INTEGRATED

PRODUCTION_WORKER_STARTED=NO
PRODUCTION_TOUCHED=NO
REAL_EXCHANGE_CALLS=0
REAL_CLOSE_ACTIONS=0
PRODUCTION_DB_MUTATION=0

APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI=NOT_STARTED
DEPLOYMENT=NO

FINAL_CLASSIFICATION=NOT_PROVEN
STOP
```
