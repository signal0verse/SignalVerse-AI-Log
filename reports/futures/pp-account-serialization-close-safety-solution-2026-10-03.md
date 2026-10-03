# PP account serialization and Close safety solution — 2026-10-03

## Metadata

- Phase: `PP-ACCOUNT-SERIALIZATION-AND-CLOSE-SAFETY-SOLUTION`.
- Module: Futures Profit Protection execution safety, not policy/Strategy.
- Mode: source discovery, architecture elimination, isolated negative diagnostics; no Production operation.
- Application repository: SignalVerse-Main; root HEAD before/after `0dbca62357a4adf34240f40ceda3e387356ec4b0`.
- Reviewed Canonical source **C**: `e1fdc45f29b350670e707de3a7afa10b9153d689`.
- Reviewed Partner source **P**: `84f27c2e40b02b0dbf61c58429cf7c45f4f852da`.
- Local worktree **L**: `tmp/futures-pp-auto-enrollment-20261002`, C HEAD plus the pre-existing five-line MEXC numeric-ID rejection and untracked native-authority prototypes. Preserved exactly.
- First negative diagnostic: `2026-10-03T08:23:20.466Z`, Node `v24.19.0`, 20 groups.
- Final expanded diagnostic: `2026-10-03T08:25:16.062Z`, Node `v22.23.3`, 21 groups.
- Source/hash/report checkpoint: `2026-10-03T08:26:50Z`; official public documentation re-read during this phase.
- Final classification: **HARD_EXTERNAL_LIMITATION** under the required operating model permitting external/manual reopening on a shared native slot. This is NOT an assertion that all exchange APIs have no position identifiers.

## Executive result / objective

The requested combined guarantee is not implementable solely inside SignalVerse under that operating model. Problem 1 is technically solvable with a common durable account-slot authority, but it is not wired today. Problem 2 has a concrete counterexample for the current Binance order contract even if Problem 1, authenticated account binding, lifecycle detection and durable quarantine are assumed PERFECT.

The decisive distinction is **before sending** versus **after sending**. A fresh authenticated read and an atomic application claim can reject a visible B before submission. They cannot recall an already-sent A request, nor prevent a separate exchange writer reopening B while the request is in flight. Detecting B afterwards does not undo its execution. UNKNOWN/HOLD prevents additional sends, but does not neutralize the first packet.

All eight requested options were investigated below. A safe internal-only alternative requires a genuinely exclusive account/slot writer boundary, not a promise by this program or a per-key mutex. Such exclusivity is not established in this installation and cannot be installed silently without changing the operating model. Therefore no partial bridge, migration or application executor change was presented as a complete solution. A reproducible local diagnostic was built instead; it records the failure rather than hiding it.

MEXC and Gate native-ID semantics remain separate unresolved contracts. The Binance counterexample alone is sufficient to defeat the required all-three guarantee. No fabricated live ID reuse, rejection, lifecycle or private-account evidence is claimed.

## Scope / actions taken

1. Re-read the complete attached phase and preserved the existing dirty trees.
2. Re-traced actual source entry, close, reconciliation, Partner transport and durable claim structures. Inspected existing native-authority prototypes before proposing any new structure.
3. Re-read official public order/timing/cancellation specifications. No private exchange endpoint was called.
4. Created an AST-isolated negative diagnostic using exact C/P functions and L's existing MEXC reader; no API bootstrap, env file or financial client import.
5. Ran 1,001 current-source cross-path races per venue, ideal common-authority controls, delayed A/FLAT/B models, mismatch tests and durable-hold/restart controls.
6. Re-ran the complete named existing PP regression file, including its failing strict parity test; no test exclusion or changed assertion.
7. Rechecked the three pre-existing candidate file hashes and unchanged application HEADs.
8. Added this report and an additive HANDOFF entry. Report-only AI-Log publication is separate from an application commit/push.

## Exact files inspected / source conventions

Unqualified line numbers in the inventory below are **L**. The machine evidence additionally contains an AST call inventory for C/P/L and exact extracted function ranges/hashes for each; do not apply L offsets blindly to P. The immutable C/P Close adapters are byte-equivalent as functions. The inspected Partner server/context SQL files and base entry/PP migrations have zero C-to-P Git diff. P's older copytrade PP monitor is not substituted with C's later automatic enrollment/VERIFY_ONLY behavior.

- C/P/L `api/copytrade.ts`: signed transports, native readers, every named entry/close adapter and its call sites, entry journal, pending/manual handlers, Pro/Fast/Discovery jobs, PP enrollment/monitor/cleanup, funding/protection reconciliation.
- `api/analyze.ts`: pending provenance and entry defaults; analysis generates pending/setups, not the native order transport.
- `api/_shared/futures-profit-protection.ts`, `futures-profit-protection-lifecycle.ts`, `futures-profit-protection-execution.ts`, `futures-profit-protection-enrollment.ts`, `futures-profit-protection-runtime.ts`.
- `api/_shared/partner-copytrade-context.ts`.
- `server/partner-copytrade/{contract.mjs,network.mjs,database.mjs,receipts.mjs,service.ts,http.ts}`; `server/futures-profit-protection/worker.mjs`.
- `migrations/{futures_profit_protection.sql,futures_profit_protection_automatic_enrollment.sql,futures_execution_attempts.sql,partner_copytrade.sql}` and relevant entry capacity/ledger source identified in the previous actual-path audit.
- Pre-existing, unwired `api/_shared/futures-native-exit-ownership.ts` and `migrations/futures_native_exit_authority_candidate.sql`.
- `scripts/futures-profit-protection-test.mjs`, `scripts/lib/{owned-copytrade-parity.mjs,futures-profit-protection-verify-only-parity.mjs}`.
- Relevant AGENTS/CLAUDE/HANDOFF/AI handoff, complete Trading Strategy and safe-test runbook; prior actual-path/native-lifecycle reports and safe diagnostic source.
- Targeted searches over all `api/server/lib` TS/JS/MJS sources for native order endpoints, adapter calls and `placeEntry`; admin-console search found no independent native Futures order writer. No credentials/env/DB exports inspected.

### Architecture trace — Canonical and Partner

| Stage | Source / function / line | Durable data, identity and authority | Retry / uncertain behavior |
| --- | --- | --- | --- |
| Discovery | `copytrade.ts` 15134 onward, Futures Discovery; `futuresProWatchTick` 11933 | Discovery maintains Pro rows; engine decisions / pending signals. It does not directly order. | Data failure does not imply a native entry. |
| Native/account read | readers: MEXC 667, Gate 7683, Binance 8356; `profitProtectionNativePosition` 16151 | Credentials are selected by local account/actor. Binance projected qty/entry/side; Gate projected size/entry/side; MEXC exact decimal positionId. Full global native-account binding is absent. | Unreadable/malformed snapshot is not flat. No authenticated account comparison was acquired in this phase. |
| Entry reservation | `claimRealExecutionAttempt` 10420; `markRealExecutionSubmitted` 10471; pending 10739 / manual 18743 | `futures_execution_attempts`: request UUID/hash/client ID; active uniqueness local actor/exchange/symbol. Capacity reservation is not PP close/reopen serialization. | PREPARED/SUBMITTED/UNKNOWN holds do not expire. Existing claimed request is not blindly resubmitted. |
| Native entry/fill | `openMexcTrade` 558; `openGateTrade` 7740; `openBinanceTrade` 8697 | Venue-native order, then native fill correlation and protection; resulting local trade links entry attempt/order. | Uncertain native result/persistence stays UNKNOWN; no invented success. Binance lost entry response queries its deterministic client ID. |
| Persistence/enrollment | pending 10744–10835; manual 18755 onward; enrollment 16030 onward; automatic SQL | `copy_trades`, COMMITTED entry attempt, PP positions identity/state/revision; retained original risk and full native quantity. | Automatic enrollment is not Close authorization. No historical backfill was executed. |
| Policy | pure `evaluateProfitProtection`; lifecycle driver; `runProfitProtectionPosition` 16273 | Original policy, ONE TP, original SL, fees/funding/debounce; durable phase CAS local trade. | Policy CLOSE decision does not authorize an exchange operation. |
| Close authorization | `trackedFuturesClosePorts` 15979; `futures_claim_position_close` SQL 106 | `futures_position_close_intents`: local trade PK, unique token, actor/instrument unresolved uniqueness. SQL locks local trade and local PP state. | UNKNOWN is a local durable hold. No common spend/owner barrier between schemas. |
| Executor | `executeTrackedFullClose` lines 16–51 | Native read -> quantity/entry/side/quote checks -> local claim -> one submit callback -> readback/persist. | No POST retry branch. No final native lifecycle precondition embedded at exchange acceptance. |
| Native close/fill | MEXC 646 / Gate 7866 / Binance 8841 | MEXC positionId; Gate contract/reduce_only/no pid; Binance symbol/MARKET/qty/reduceOnly/no lifecycle ID. Fill evidence is checked after request. | A correlated fill is not proof it affected A rather than an externally reopened B. |
| Flat/reconciliation | `profitProtectionMonitorTick` 16397; uncertain lookup 16408, flat update 16425; sync functions 2521/7947/10119 | PP/intent states and trade/protection history. Current uncertain-intent reconciler can record FLAT from snapshot without proving in-flight request inadmissibility/terminal order. | Observed flat alone is insufficient to release a proposed reopen quarantine. Preserve held attempts/protection; no such release was performed here. |
| Cleanup | `cleanupProfitProtection` 16247; native trigger cancel helpers | Existing lifecycle cleanup follows flat/proven close rules; this phase made no cleanup call. | Changing cancellation order is not an exchange generation fence. |
| Reopen | pending/manual entries above, plus external exchange writers | Native flat/open-order preflight + local entry journal, not a common unresolved-Close slot gate. | A delayed unaccepted Close is not yet visible as an open order; preflight can miss it. |

Partner chain: private authenticated HTTP -> `service.ts::handle` / `command` -> owned context/database -> the shared handler; scheduled `sweep('entry')` -> Pro; `sweep('reconcile')` -> `handleCronSyncAll`; `sweep('profit-protection')` -> pinned P monitor -> actual P close adapter. Context redirects tables/RPCs to `partner_copytrade`; SQL clones `futures_claim_position_close`. A shared control view is only a mode switch, not shared ownership. SQLite command receipts claim request IDs per partner/subject/account; they do not claim a native position across Canonical. `busy` and `protectionBusy` are separate process Sets, not durable account locks. `network.mjs::ownedFetch` lines 52–60 checks entry permission for entry requests but forwards classified exits without the required common close-authorization spend.

## Every identified Open class / reachability

CAN_BYPASS below means the **required shared native Close/reopen authority**, not that existing auth/risk/native-entry checks are absent. Scheduled path reachability is source evidence, not a claim a live gate is enabled today.

| Open class | Exact path / reachability | CAN_OPEN / CAN_REOPEN | Shared authority bypass |
| --- | --- | --- | --- |
| Auto Scanner | discovery rows -> Pro -> `api/analyze.ts` pending -> `checkPendingSignals` -> `activatePendingSignal` -> `activateRealPendingTrade` | Indirect YES for gated Real; scanner itself NO | YES at resulting entry claim; scanner is not an executor. |
| Futures Pro / Copytrade | cron Pro 15120 -> analysis/pending; cron sync 14982 -> pending activation 10948 -> native entry | YES when existing gates permit | YES; current entry journal does not consult PP unresolved Close state. |
| Manual standard Futures | authenticated POST `action=open` 18617 -> claim 18743 -> MEXC 18755 / Gate 18783 / Binance 18795 | YES | YES with respect to shared authority; normal existing gates remain. |
| Pending confirmation / retry | authenticated `confirm-pending` calls activation at 17450; activation checks known attempt before new order | YES for a new eligible attempt; uncertain same attempt blocked | Different new entry ID can enter after flat/local committed lifecycle; there is no common PP slot hold. |
| Partner Copytrade | `contract.mjs` allows setup/confirm-pending, not direct `action=open`; `service.ts` entry/reconcile sweep reuses originals | YES indirectly / confirm-pending | YES; owned entry rows differ from public rows. Entry lease does not serialize native slot globally. |
| Fast Trader | `fastTraderTick` 11453 checks Demo grant/flags, selects Demo trades and activates Demo pending | Real NO in the inspected path | NOT APPLICABLE to native PP entry; do not redesign or enable it. |
| Cron / client sync | `handleCronSyncAll` and authenticated sync actions also call `checkPendingSignals` | YES indirectly, when existing Real gates permit | Same missing PP reopen guard. No new scheduler introduced. |
| Generic adapter entry methods | MEXC 8141 / Gate 8274 / Binance 10386 `.placeEntry` closures call native entry without entry callback | Callable/exported factory, but **no in-tree `.placeEntry(...)` call site found** | Potential direct future caller; must deny at actual final transport/entry gate, not assumed active today. |
| Legacy entry | `openRealTrade` 1383, fallback calls 10811 / 18813 | Source-reachable fallback for other exchange labels; standard three venues use explicit branches | No shared Close gate; do not silently label active on a standard venue. |
| Recovery/reconciliation | Existing attempt recovery uses recorded trade/result, not a separate proved new native writer; sync can activate unrelated/new pending entries | Existing attempt replay NO; new pending entry YES | Must remain held if unresolved slot Close exists. No automatic reset/delete of uncertain attempt is acceptable. |
| Admin | standalone admin-console has no native order writer in targeted search; owner through authenticated copytrade still uses manual path | Standalone NO; owner handler YES | Owner manual path has same missing global gate. |
| External webhook/API | inspected Partner signed API and copytrade authenticated handlers are the above paths; no additional three-venue native order writer found outside copytrade | Conditional YES through those handlers | Same shared-authority gap. No nonexistent webhook file was treated as a writer. |
| Emergency/unwind | protection failure in `openBinanceTrade` 8805 closes an entry; no separate new entry writer | Open NO (Close only) | See Close inventory. |
| Exchange UI / mobile / other API key / another program | outside this repository and transaction domain | YES in the operating model in question | **YES, even with perfect local account serialization**. No live external trade was made to demonstrate this. |

## Every identified Close class

| Close class | Source/action | Concurrency / shared-authority status |
| --- | --- | --- |
| Canonical PP | `runProfitProtectionPosition` -> close adapters 16323/16324/16327 | Local claim only; native POST once per claimed local trade. |
| Partner PP | P monitor -> P PP callback -> P close adapters | Same semantic helper, distinct durable namespace; no shared owner/spend. |
| SL/TP / strategy exits | sync MEXC -> `applyRealMexcAction` 2500; Gate -> `applyRealGateAction` 7935; Binance -> `applyRealBinanceAction` 9074 | `existingFuturesClose` adds local claim only for managed standard trades. Native protective orders can trigger independently of application claims. |
| Manual standard / Partner close | authenticated `action=close`: MEXC 18865 / Gate 18911 / Binance 18931; Partner permits this command | Same existing managed local hook, no cross-path authority. |
| Liquidation-risk emergency | Binance sync -> automatic reduce-only close 10258 | Managed local hook when available. Actual exchange liquidation/ADL is an external state transition, not an app PP authorization. |
| Protection-failure unwind | Binance entry -> `closeBinanceTrade` 8805 without tracked context | Direct submit branch; no shared gate. Removing this safety behavior is not authorized or a valid solution. |
| Legacy close | `closeRealTrade` 1411 -> native POST 1417; manual fallback 18943 | No tracked context/shared gate. Standard three-venue branches take their explicit adapters; fallback not silently asserted active. |
| Unenrolled / excluded managed helpers | `existingFuturesClose` returns undefined for Fast/Whale, absent managed row, missing schema | Adapter executes direct submit when context absent. An exported tracked helper alone cannot prove no bypass. |
| Reconciliation | PP uncertain loop does reads/local state updates, not another POST; native sync may call strategy/emergency close above | Flat observation is not delivery-terminal proof. No automatic resubmission in the inspected PP uncertain loop. |
| Funding/PnL reconciliation | `reconcileRealClosePnl`, `reconcileGateClosePnl`, `reconcileBinanceClosePnl`, final funding reconciliation | Accounting/history reads are not independently identified native Close POSTs. No accounting change made. |
| Admin / external | standalone admin NO native executor found; authenticated owner/Partner close as above; exchange UI, SL/TP, liquidation/other client outside app | External native transitions can make A flat without the local PP packet resolving. |

All direct three-venue ordinary native order POSTs found in inspected production source are in copytrade's entry/close adapters plus the documented legacy routines; trigger-order placement/cancellation is separate. Spot endpoints were excluded, never executed or modified.

## Exchange-specific evidence and conclusion

### Binance — concrete limiting contract

Current adapter sends symbol/opposite side/MARKET/quantity/reduceOnly; signed transport adds timestamp and `recvWindow=10000`. The official order request has a position-side slot, not an expected A lifetime/version. Client order ID identifies an order, not its target lifetime; the inspected close does not send one. Cancellation addresses an existing order, not an unreceived request tombstone. [Official order and cancellation contract](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade).

The documented time window limits request admission, not the position lifetime; unknown response is not definitive rejection. [Official timing and unknown-outcome rules](https://developers.binance.com/en/docs/products/derivatives-trading-usds-futures/general-info).

**Inference / counterexample, not observed live:** send A's packet; SL/TP/manual makes A flat; external writer opens same-direction B in the same slot before admission expiry; old packet arrives. Its valid fields do not distinguish that state from a legitimate reduce-only Close of B. Matching A quantity/entry at the final read, another fresh read, a local generation number, a DB token, aborting the socket or a client UUID cannot add an exchange-enforced lifecycle precondition. A single first packet suffices; no duplicate or retry is needed. Even permanent application quarantine cannot prevent that external B.

### MEXC — conditional native targeting, not invented reuse

Actual close already sends the exact decimal positionId, validates it at read time and correlates symbol/side/filled contract volume. Documentation lists positionId for the actual `/api/v1/private/order/submit` route but does not provide the required complete stale-ID-versus-reopened-B/non-reuse/account-scope contract. Newer routes and position-scoped TP APIs are not substituted. [Official actual MEXC route](https://mexcdevelop.github.io/apidocs/contract_v1_en/).

Two explicit hypothetical server contracts were tested: strict different/non-reused IDs reject the old target; reused IDs permit the old target to identify B. Neither branch proves which contract a live account implements. Authenticated configured key -> native account/subaccount binding remains unestablished; private fill counterparty identity is not self identity. Current exact-string/lossless parser and stricter pre-existing five-line numeric guard were preserved. Outcome: **NOT_PROVEN_NATIVE_FENCE**, not a claim that MEXC necessarily reuses IDs.

### Gate — current slot payload versus potential pid targeting

The current payload has contract/signed size/IOC/reduce_only and no pid. The official schema offers pid; x-gate-exptime is admission expiry, not lifecycle identity. The inspected native reader discards account/open_time/pid metadata. A field's presence does not establish complete non-reuse/stale-target behavior for every supported mode. [Official Gate order/position contract](https://www.gate.com/docs/developers/apiv4/en/futures/).

Current payload fails the slot-based external-reopen model. A future pid-targeted adapter still needs authenticated account/mode binding and contractual rejection evidence, particularly availability in the currently supported single-position mode. Outcome: **CURRENT_SLOT_PATH_UNSAFE_MODEL / NATIVE_PID_FENCE_NOT_PROVEN**, not an assertion all Gate targeting is impossible.

## Exhaustive option elimination — A through H

| Option | Enforcement point / can solve A -> B? | External reopen | Restart / timeout / UNKNOWN |
| --- | --- | --- | --- |
| A Native fence | Exchange must atomically reject a Close unless target lifetime is still A. Current Binance contract lacks that precondition. MEXC/Gate potential ID contracts unproved. | Only a genuine native fence solves this independently of outside writers. | Native precondition must survive delayed admission; cannot assume it. |
| B Account serialization | Durable DB account/product/settlement/slot gate plus final entry/close transport enforcement; solves internally controlled B only. | Bypassed by exchange UI/another writer. API-key/IP isolation is not account-wide writer exclusion. | Persistent quarantine survives crash; missing/lost acknowledgement denies. |
| C Block reopen until resolved | Keep unresolved Close hold AND reject all internal entries, already-sent opening packets and pending/native opening orders. Release only after old requests inadmissible and accepted orders terminal with exact correlation. | External B remains possible during hold. | No TTL release. UNKNOWN/flat-only observation never frees hold. |
| D Cancel/confirmation barrier | Cancel a known pending order and prove terminal result; combine with admission expiry and writer quarantine. Not-found before original POST arrives does not tombstone future arrival. An already executed MARKET cannot be undone. | Can reopen before cancel/arrival ordering settles. | Response loss retains quarantine; never treat not-found/timeout as proof of cancel. |
| E positionId/pid targeting | MEXC already supplies ID; Gate would need retained pid/mode and changed adapter. No corresponding A-lifecycle target in current Binance order path. | Safe only with proved native scope/non-reuse/stale-target rejection. | No locally invented epoch substituted; ID/history gaps deny. |
| F Reservation + account lock | Atomic owner/one-shot spend solves duplicate local submitters; snapshot-before-POST remains a different transaction from exchange execution. | Does not lock exchange UI or a request already beyond the local gate. | A lease/expired lock cannot authorize another send; durable HOLD required. |
| G Exchange-specific fences | Short admission expiry, reduce-only, native IDs, client IDs, exact fill/order correlation improve boundedness/correlation but cannot manufacture a missing exchange precondition. | Slot reduce-only limits increasing exposure, not choosing A versus B. | Same intent only, no retry POST on UNKNOWN; order/client IDs not lifetime IDs. |
| H Combination | A+B+C+D+E+F+G can be safe with genuine native fence OR externally enforced exclusive writer ownership and terminal packet/order barrier. These assumptions are not satisfied for all three current accounts. | **Still fails on Binance if arbitrary external same-slot B is permitted.** | Restart/timeout safety can be made conservative internally but cannot recall the first in-flight packet. |

Also evaluated alternatives beyond the list: continuous stream/backfill/current read detects some completed transitions but is not atomic with request arrival; historical generation anchors cannot be sent as a supported Binance precondition; two confirmations merely add pre-send reads; IOC/FOK or shorter recvWindow is not a lifetime fence; routing/reducing quantity/pricing constraints can still affect a sufficiently matching B; manual review cannot atomically prevent a subsequent reopen. Revoking/changing account trading permissions or moving accounts would require separately authorized exchange/operating-model changes, and no supported per-intent exchange-wide lock was found. No such mutation was attempted.

## Smallest conditional internal-only design (NOT implemented)

This is a concrete path to solve Problem 1 and internally controlled Problem 2 **after** the external-writer boundary is changed/proven; not an accepted solution today.

### Existing structures to reuse before considering new tables

- `futures_position_close_intents`: reusable journal, but its mandatory public trade FK/PK and actor-local active uniqueness cannot address a Partner-only native owner. A reviewed schema generalization would add a neutral authority ID, nullable local-trade alias and authenticated native account/product/settlement/slot binding, unique unresolved slot, immutable request/payload digest, executor incarnation/one-shot spend, admission expiry and terminal evidence. Preserve historical trade/token evidence; never fake a public trade for a Partner row.
- `futures_profit_protection_positions`: keep local policy/enrollment projections and revisions. They reference the common owner via namespace/account/actor/trade aliases; they do not each own an independent native execution right.
- `futures_execution_attempts`: reuse durable entry attempts, but add the same native account/slot admission barrier to BOTH namespaces. Claim atomically checks unresolved Close/entry exposure, and final egress checks the reserved entry execution right. Existing UNKNOWN entries stay held.
- `real_accounts` and Partner `accounts`: candidates for retaining authenticated native self-binding and credential-binding revision, with uniqueness across namespaces. A fingerprint proves key equality, not native account equivalence across different keys. If a trustworthy registry cannot be enforced with these existing structures/RLS, its absence blocks execution; no guessed account UUID is allowed.
- Local `copy_trades` remain reporting/accounting aliases, never global native generation proof. The existing five-table unwired prototype is NOT adopted as necessary; its assumed trusted registrar/epoch is not produced by the current code and it does not fence the exchange after POST.

### Atomicity, exact flow and recovery

1. Trusted authenticated account/product/mode/slot binding with complete entry-fill/flat/reopen history; ambiguity or observation gap denies automatic Close. App revision is named a local continuity token, not native generation proof.
2. Canonical and Partner authenticate their alias against that binding and call the same protected public authority RPC. Partner's cloned claim must delegate, not clone the owner table. RLS/JWT actor/account checks must remain; clients cannot register their own binding or write/spend owner rows directly.
3. Serializable transaction or ordered row/advisory lock on the authenticated native slot coordinates ALL entry reservations and Close claims. Unique unresolved slot + unique immutable intent wins one owner. DB acknowledgement loss never licenses an exchange send.
4. Common final executor performs a fresh matching native read, validates the exact authority/owner/policy basis, then atomically spends a one-shot execution right and commits before network submission. Missing/spent/stale/mismatched token denies; neither path has a direct-submit fallback. Process-local mutex is irrelevant.
5. All app manual/pending/Pro/Partner/recovery/direct/legacy/unwind egress must use this authority. Preserve native SL/ONE TP as independent existing protection. Route emergency exits through the same owner without removing safety exits or changing policies. Already-sent entry requests/opening orders must also be represented before admitting a Close.
6. Crash before/after spend and transport timeout become durable HOLD. Restart can observe/reconcile but cannot create a new owner or resubmit; availability is sacrificed rather than guessing whether POST was sent. Query the same correlated native order/client ID; never mint another Close token after UNKNOWN.
7. Reconcile only exact terminal order/fill/flat evidence AND exhaustion of all outstanding request admission windows/accepted opening or closing orders. Flat alone does not prove an old packet cannot still arrive. Release a quarantined slot only on that complete barrier, never TTL or a learning-job lease.
8. External writer can STILL reopen B after step 4. Thus this sequence is sufficient only with proved exclusive writer enforcement, or a genuine native exchange fence. A new snapshot in step 7 cannot undo damage occurring before it. This is the exact point where the present requirement exceeds app control.

No schema/RPC changes were authored/applied because that last invariant cannot be proven under the required current model. A PostgreSQL-only test would prove a database lock, not turn that external invariant true.

## Hard limitation proof and safe remaining operating modes

Consider two executions with identical local history up to the last fresh authenticated read, common durable claim/spend and send of packet P. In execution X, A still occupies the slot when P arrives. In execution Y, A becomes flat and an external writer creates B before P arrives, within the valid admission window. P carries no expected-A condition in the current Binance API. An exchange processing the documented slot request cannot distinguish P from a legitimate Close of B using those fields. No app algorithm observing only before send can force a different exchange outcome after send. The fake contract model exhibits the permissible Y trace; it does not assert that a private account has experienced it.

Missing primitive: **atomic exchange-side compare-current-position-lifetime-and-close**, or an **exchange-enforced exclusive writer boundary across every Open writer** paired with a complete old-request/order terminal barrier. An application DB transaction cannot lock an external exchange writer or invalidate a previously valid signed request retroactively.

Safe modes that remain:

- No new automatic PP Close on shared externally writable slots; policy/observation/VERIFY_ONLY can be used within its existing proven read-only bounds while native SL/ONE TP and existing reconciliation are left intact. This is a safety recommendation, NOT a flag change performed here.
- A separately approved, genuinely exclusive account/subaccount operating model: all entry/close writers including manual tools routed through the same durable authority, with no uncontrolled UI/other-key reopen, complete outstanding entry/close order inventory, and terminal/inadmissible-request barrier. This would require proof of enforceable exclusivity and a new implementation phase. Merely owning one API key, agreeing not to trade manually, or banning internal endpoints does not prove it.
- Exchange-specific native-target mode only after a documented or formally verified target lifetime/reuse/rejection contract and authenticated account/mode binding. MEXC/Gate field names alone are insufficient. Do not infer global impossibility for these venues.

No operating-mode/account migration or live activation is authorized by this report. No policy/threshold/ONE-TP/SL/enrollment/Strategy change is proposed as a workaround.

## Tests executed — exact counts and meaning

Commands (all offline/local):

```powershell
node --check scripts/diagnostics/pp-account-serialization-close-safety-proof.mjs
node scripts/diagnostics/pp-account-serialization-close-safety-proof.mjs
& 'C:\Projects\SignalVerse-Main\tmp\pp-bootstrap-node22-20261002\node-v22.23.3-win-x64\node.exe' --check scripts/diagnostics/pp-account-serialization-close-safety-proof.mjs
& 'C:\Projects\SignalVerse-Main\tmp\pp-bootstrap-node22-20261002\node-v22.23.3-win-x64\node.exe' scripts/diagnostics/pp-account-serialization-close-safety-proof.mjs
& 'C:\Projects\SignalVerse-Main\tmp\pp-bootstrap-node22-20261002\node-v22.23.3-win-x64\node.exe' --experimental-strip-types --test scripts/futures-profit-protection-test.mjs
```

The first Node24 run had 20 groups; a further in-flight UNKNOWN counterexample was then added to the diagnostic ONLY. Final Node22 run has 21 groups, exit 0. Those PASS assertions confirm **negative counterexamples and labeled controls**, NOT that the desired automatic Close solution passed. Fake Maps are deliberately ideal positive controls, NOT durable SQL proof. Native transports receive only synthetic arguments; no network client/bootstrap is imported. No actual exchange acceptance/fill rates measured.

| Diagnostic | Cases | Measured result / limitation |
| --- | ---: | --- |
| Actual C/P functions, two fake schema-local claims | 1,001 per exchange / 3,003 total | 3,003 pairs accept two local claims and produce two synthetic POST attempts. Does NOT assert two real fills. |
| Same actual functions, ideal common atomic Map control | 1,001 per exchange / 3,003 total | One model claim/POST; duplicate model claims/POSTs 0. Not an implemented PostgreSQL bridge. |
| Binance delayed after final read, external A/flat/B | 1,001 | 1,001 stale effects on B in documented slot-contract model despite common owner/internal reopen hold. |
| Gate current no-pid payload / slot model | 1,001 | 1,001 stale effects in model; not a native-server behavioral claim. |
| MEXC same/reused-ID hypothesis | 1,001 | 1,001 stale effects IF native ID can denote B. Actual reuse NOT_PROVEN. |
| MEXC different/non-reused ID strict-target hypothesis | 1,001 | 1,001 modeled rejections, 0 stale effects IF that native fence exists. Actual fence NOT_PROVEN. |
| Mismatched visible native input before submit | 1,001 per exchange / 3,003 | Actual helper/read hook denies; 0 synthetic POSTs. Does not close after-read race. |
| UNKNOWN + retry + reconstructed Partner caller sharing ideal hold | 1,001 per exchange / 3,003 | First synthetic POST only, UNKNOWN retained; no retry/restart synthetic POST. Map persistence is a model, not PostgreSQL crash durability. |
| Binance already-sent packet after client timeout/HOLD | 1,001 | No second POST; first packet can still reduce externally reopened B in model. |
| Internal-exclusive quarantine / terminal-not-flat control | 1,001 | Flat/timeout alone cannot release; both admission expiry and order terminal required by modeled control. External exclusion still a prerequisite. |
| Additional cases | 4 groups | MEXC exact-string/numeric guard, Binance payload indistinguishability, cancel-before-arrival model, terminal quarantine control. Included in 21 total groups, not additional native evidence. |

In the exact-quantity B branch of each unsafe A/B model, 501 cases even let the existing helper record flat after a synthetic fill of B. In larger-B cases it correctly reports UNKNOWN **after** reducing B. Both demonstrate why post-fill validation alone is not preventative. This is not a claim of live incorrect accounting.

Required release-acceptance metrics (two owners, duplicate authorization/executor/Close, stale A on B, identity collisions) are **NOT_ACCEPTED / live NOT_MEASURED**, not certified zeros. The 3,003 source-race pairs and 1,001-per-exchange adversarial models are diagnostic coverage, not the requested post-implementation integrated SQL/native acceptance suite. No actual SQL/role race suite was run because no full safety implementation exists.

### Existing regression failure preserved, not weakened

The complete named regression file returned exit 1: **51/52 pass, 1 fail, 0 skipped/cancelled**. Failing test 52 at `scripts/futures-profit-protection-test.mjs:301` -> assertion 308 -> `scripts/lib/futures-profit-protection-verify-only-parity.mjs:11`:

```text
ERR_ASSERTION
Only exact Phase 3B capability delta: api/copytrade.ts
```

Cause is the already-existing five-line MEXC numeric precision guard versus a closed source-hash allowlist. L contains five added lines/zero deletions in copytrade; this phase added none. The diagnostic independently confirms exact decimal ID preservation and rejection of an already-rounded numeric ID. It does NOT justify adding another admitted hash, skipping parity, weakening the MEXC contract or claiming the regression suite green. No source/test/contract repair was made.

Build: NOT_RUN; no application implementation or dependency changed. Official CI: NOT_STARTED; no application push. The existing regression's Worker fixtures use disposable local fake runtime imports, never start the Production Worker or import its real financial bundle.

## Files changed / tables / RPCs / hashes

Actual new/updated files in this request only:

1. `scripts/diagnostics/pp-account-serialization-close-safety-proof.mjs` — new offline negative diagnostic, source AST inventory and explicit parameterized contract models; no application import or execution wiring.
2. `reports/futures/pp-account-serialization-close-safety-solution-2026-10-03.md` — this report.
3. `HANDOFF.md` — additive coordination entry preserving all pre-existing content.
4. One report-only mirror in SignalVerse-AI-Log. No application source is published there.

Generated local evidence (not source/DB exports, not committed): `tmp/pp-account-serialization-20261003/offline-evidence.json` initial Node24 capture; `offline-evidence-node22.json` final capture.

```text
DIAGNOSTIC_SHA256=57055ce8fa30ce1f18d8d84fa6377c83525bd58aad018b89527e764d683e4102
NODE22_EVIDENCE_SHA256=2c12d84ce0e70cd47d5c325fbb2539a01a9f2509343662617c38ca77f0a1b2ab
LOCAL_COPYTRADE_SHA256=5fcd84689c95f6db1def3dac884ce56fd6c8891d1dc60418aa8ca6ab50996125
EXISTING_NATIVE_HELPER_SHA256=10d62b4b04bb6f7e16aadffa0dfb963488d7bc75da579d24d9e52d531fa865c4
EXISTING_NATIVE_SQL_SHA256=cbdac629890fcb5d3a567b160946b62c17da9b3858c4da7e15f5c521516d5ebe
APPLICATION_FILES_CHANGED=NONE
EXACT_TABLES_CHANGED=NONE
EXACT_RPCS_CHANGED=NONE
IMPLEMENTATION_COMMIT=NONE
```

The three pre-existing candidate source hashes equal their incoming values. Existing prototypes, five-line guard, other contributors' reports/source/untracked work and root dirty HANDOFF content were preserved. No application stash/reset/clean/pull/branch switch/history rewrite performed. The initially clean, independent AI-Log checkout was fast-forward synchronized to preserve other report publications before adding this report.

## Production safety / Git / publication limitations

- No SSH/VPS/service/Worker/gate command in this phase; no exchange account or credential read, no exchange call, no Production DB access/mutation, no approval/artifact/release/deployment.
- No changes to Strategy, Decision Engine, PP policy, ONE TP, SL, enrollment, scanner, Spot, Prediction Market, Real/Demo flags or Partner runtime.
- Production Worker was **not started by this task**. Current live PID/flags/runtime were NOT freshly observed; do not infer current OFF state from that statement. Earlier runtime observations remain historical.
- Application HEADs stayed unchanged; no application commit/main push/CI. AI-Log report-only publication is permitted by standing AGENTS and is not an application release. Its verified receipt/link is returned separately; publication is not assumed from local file creation.

## Final decision / required next prerequisite

```text
PHASE=PP-ACCOUNT-SERIALIZATION-AND-CLOSE-SAFETY-SOLUTION
PROBLEM_1_STATUS=IMPLEMENTABLE_WITH_SHARED_DURABLE_AUTHORITY_NOT_IMPLEMENTED
PROBLEM_2_STATUS=HARD_EXTERNAL_LIMITATION_ON_EXTERNAL_REOPEN_BINANCE_SLOT
BINANCE_STATUS=NO_ATOMIC_LIFETIME_CLOSE_FENCE_IN_CURRENT_CONTRACT
MEXC_STATUS=NATIVE_POSITION_ID_PRESENT_LIFETIME_FENCE_NOT_PROVEN
GATE_STATUS=CURRENT_NO_PID_SLOT_MODEL_UNSAFE_NATIVE_PID_FENCE_NOT_PROVEN
SOLUTION_FOUND=NO
SOLUTION_TYPE=CONDITIONAL_EXCLUSIVE_WRITER_DESIGN_ONLY
ARCHITECTURE=ONE_DURABLE_NATIVE_ACCOUNT_SLOT_AUTHORITY_PLUS_ENTRY_QUARANTINE_PLUS_TERMINAL_BARRIER_REQUIRES_EXTERNAL_WRITER_EXCLUSION_OR_NATIVE_FENCE
EXACT_FILES_CHANGED=DIAGNOSTIC_REPORT_ADDITIVE_HANDOFF_AI_LOG_REPORT_ONLY
EXACT_TABLES_CHANGED=NONE
EXACT_RPCS_CHANGED=NONE
EXACT_EXECUTION_FLOW=EXISTING_CODE_UNCHANGED_NO_NEW_SHARED_GATE_WIRED
EXACT_OPEN_FLOW_PROTECTION=EXISTING_ENTRY_HOLDS_ONLY_NO_SHARED_PP_REOPEN_GATE
EXACT_CLOSE_FLOW_PROTECTION=EXISTING_SCHEMA_LOCAL_CLAIM_ONLY
UNKNOWN_POST_HANDLING=NO_RETRY_IN_EXISTING_HELPER_HOLD_CANNOT_RECALL_FIRST_PACKET
RESTART_HANDLING=SHARED_HOLD_MODEL_DENIES_SECOND_SEND_NOT_DB_CRASH_PROOF
RETRY_HANDLING=NO_SECOND_SYNTHETIC_POST_WITH_IDEAL_HOLD
REOPEN_HANDLING=INTERNAL_QUARANTINE_INSUFFICIENT_FOR_EXTERNAL_B
CANONICAL_PARTNER_CONCURRENCY=3003_CURRENT_SOURCE_PAIRS_TWO_LOCAL_CLAIMS_TWO_SYNTHETIC_POSTS
DIRECT_EXECUTOR_BYPASS=EXISTS_IN_CURRENT_SOURCE_SHARED_GATE_NOT_WIRED
STALE_A_CLOSE_ON_B=BINANCE_MODEL_1001_OF_1001_GATE_MODEL_1001_OF_1001_MEXC_CONDITIONAL_NATIVE_NOT_MEASURED
DOUBLE_AUTHORIZATION=CURRENT_LOCAL_MODEL_3003_PAIRS_SHARED_MODEL_ZERO_NATIVE_NOT_MEASURED
DOUBLE_EXECUTOR=TWO_SYNTHETIC_SUBMITTERS_IN_3003_PAIRS_NATIVE_NOT_MEASURED
DOUBLE_CLOSE=REAL_NOT_MEASURED_NO_TWO_NATIVE_FILLS_CLAIMED
IDENTITY_MISMATCH=3003_VISIBLE_PRE_SUBMIT_MODEL_MISMATCHES_DENIED_POST_READ_GAP_REMAINS
RACE_TESTS=3003_CURRENT_SOURCE_NEGATIVE_PLUS_3003_IDEAL_SHARED_CONTROLS
ADVERSARIAL_TESTS=1001_PER_EXCHANGE_PLUS_SECOND_MEXC_CONTRACT_AND_1001_BINANCE_UNKNOWN_PACKET_CASES
REGRESSION_TESTS=51_OF_52_PASS_ONE_PREEXISTING_MEXC_SCOPE_FAILURE_ZERO_SKIPPED
BUILD=NOT_RUN_NO_APPLICATION_IMPLEMENTATION
CI=NOT_STARTED
IMPLEMENTATION_COMMIT=NONE
DEPLOYMENT=NO
PRODUCTION_WORKER_STARTED=NO
REAL_EXCHANGE_CALLS=0
PRODUCTION_MUTATIONS=0
FINAL_CLASSIFICATION=HARD_EXTERNAL_LIMITATION
```

Before an implementation claiming full safety, the owner must choose and prove the external-writer operating boundary or obtain an exchange-native A-lifetime Close fence contract. That is a materially different authority/operating-model prerequisite, not another speculative lock over local trade IDs. No further mutation or automatic rollout follows this report.
