# Futures Profit Protection account control and local safety repairs

## Metadata

- Date: 2026-10-03 UTC
- Phase: PP-FINAL-SAFETY-SOLUTION-ACCOUNT-CONTROL
- Mode: isolated local implementation, disposable database proof, public documentation review
- Application repository: SignalVerse-Main
- Isolated branch: codex/pp-exclusive-writer-20261003
- Isolated starting and ending HEAD: e1fdc45f29b350670e707de3a7afa10b9153d689
- Primary checkout HEAD: 0dbca62357a4adf34240f40ceda3e387356ec4b0
- Application commit: NONE; no application source push
- Evidence collection completed through 2026-10-03T11:38:41Z
- Historical Production reference: a0455626c0a54fb443f457e0a595a662974623fa; NOT freshly observed in this task
- Public report only; no credentials, native account identifiers or financial rows included

## Executive result

The three previously demonstrated native protection bypasses have been repaired **locally by fail-closed quarantine**, not by making live protection execution available. Every native mutation through the common helper or the Partner final forwarding sink is now either the supported durable, tracked CLOSE path or denied. ENTRY is also denied before any effect because allowing an entry while its mandatory protection writes are denied would be unsafe. **This candidate must not be deployed over existing position management.**

The final complete named regression improved from 889 PASS / 68 FAIL to **955 PASS / 2 FAIL / 0 SKIPPED, 957 total**. The remaining failures are genuine historical exact-scope contract failures for this new architecture. Their assertions and allowlists were not changed. Overall regression and release acceptance therefore remain FAIL.

Actual PostgreSQL ownership tests completed 5,000 Canonical/Partner races and 5,000 A/Flat/B traces **for each** Binance, MEXC and Gate. All five duplicate/stale counters were zero **under the explicitly synthetic exclusive-account and terminal-evidence model**. These results are not real native account or order-execution proof.

The hard external limitation is specific: **an application holding a customer's trading API key cannot impose its local authority on that customer's separate native key, UI or master/admin authority**. Current BYOK registration does not establish exclusive native custody. IP restriction on one key does not govern another key or privileged account administration. This is not a claim that all possible managed-account configurations are impossible.

STATE A is not achieved. STATE B is documented for the **current BYOK account-control boundary**. MEXC/Gate lifecycle-fence behavior remains NOT_PROVEN, not an asserted absence of capability. Local remaining work is reported separately below and is not disguised as an exchange limitation.

## Objective and scope

Implement bounded, technically useful safety repairs in the existing isolated prototype; prove the local atomic boundary with actual SQL and real candidate guard/sink code; investigate real native account-control primitives from primary documentation; preserve policy, native adapter contracts, SL, ONE-TP, enrollment, Strategy and Decision Engine.

No SSH/VPS command, private exchange request, Production database access, financial mutation, service or Worker activation, PP flag change, application commit, CI dispatch, release or deployment occurred. Only the sanitized work report is authorized for publication to AI-Log/master by repository instructions.

## Actions taken

1. Read the owner attachment, project instructions, strategy amendments, handoffs, prior failure report, safe test runbook and report template.
2. Reviewed existing durable PP/entry/Partner structures before retaining the already-created neutral authority candidate.
3. Removed native protection/control/cancel fall-through from the candidate common mutation classifier.
4. Required the same fixed-byte, one-shot execution ticket at the Partner final sink for every native non-GET request.
5. Quarantined ENTRY before account reads, SQL claims or POST so no filled entry can be left without the unavailable protection saga.
6. Repaired only extracted legacy test dependency injection, without changing any original fixture assertion. The shim accepts only .invalid fixture hosts.
7. Increased real SQL concurrency/ABA proof loops to 5,000 per venue; explicitly labeled synthetic native boundary, terminal receipts and SQL-only ENTRY.
8. Re-ran the complete named regression and builds; independently checked unchanged policy/native functions and the apparent TypeScript diagnostic shift.
9. Reviewed current public Binance/MEXC/Gate documentation, including the newly confirmed Gate order pid parameter.
10. Preserved original failed evidence, root/private work, the owner's prior MEXC work and application history.

## Account control findings

### What is actually outside SignalVerse control

The current connection path in api/copytrade.ts:18556–18655 validates supplied credentials with authenticated reads and stores the account configuration. It does not provision an API-only account, inventory every native write key, revoke other credentials, control the master administrator or enforce process-level signer custody.

Partner credential fingerprint uniqueness in server/partner-copytrade/database.mjs identifies reuse of the **same key**, not two different keys accessing the same real native account.

Application SQL cannot intercept a request made directly to an exchange by a different authorized credential or native UI. A local generation number, fresh read, reduce-only instruction or row lock cannot create an exchange-enforced predicate absent from the native request contract. This is an enforcement-domain argument, not a profitability finding or a live-account incident claim.

### Binance

A virtual-email subaccount prevents direct subaccount login, but its API administration remains with the master. The current FAQ also permits multiple keys per subaccount. That is useful segregation, not a guarantee that the master cannot provision another writer. [Binance subaccount FAQ](https://www.binance.com/en-AU/support/faq/detail/360020632811).

The ordinary USD-M order contract includes symbol, side, positionSide, quantity, reduceOnly, timestamp/recvWindow and client order identity. It does not document an expected position-lifetime condition. The client order ID is an order identity, not proof of a nonreusable position generation. Time admissibility does not establish that a reopened slot belongs to A. [Binance native order contract](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade).

**Inference for this architecture:** a dedicated key and restricted egress can constrain that key's callers, but cannot constrain a different master-issued credential. Native API management supports per-subaccount key creation and IP restriction; no native configuration was changed or inspected privately here. [Binance official subaccount API examples](https://github.com/binance/binance-cli/blob/master/examples/sub-account.md).

### MEXC

The current setup manual distinguishes API-only subaccounts without Web/App login from standard accounts with login. The master-management documentation retains control over subaccount keys, orders, passwords and freezing. These controls can help build a custodied boundary but do not establish exclusivity for a customer-controlled master. [MEXC setup manual](https://www.mexc.com/en-GB/announcements/article/mexc-sub-account-api-key-setup-manual-17827791534686), [MEXC subaccount management](https://www.mexc.com/announcements/article/mexc-introduces-sub-account-support-4529143435545).

The installed contract API documents positionId in native position data and as an optional order-submit parameter, recommended for closing. Therefore **positionId is not missing**. The examined contract does not prove never-reuse plus old-A-request rejection after A/Flat/B, nor a general authenticated configured-key-to-account identity usable by the current bridge. The actual MEXC bridge denies when native account binding is not proved. No asset/config/actor identifier is substituted. [MEXC contract API](https://mexcdevelop.github.io/apidocs/contract_v1_en/).

The 27 nonsigner MEXC functions match the candidate base byte-for-byte after LF normalization. The prior separate five-line change is not reapplied, removed or used to relax a contract.

### Gate

The native API explicitly includes **pid on the ordinary POST futures order request**, as well as position pid/open_time/update_id and pid on other order schemas. It would be incorrect to claim Gate has no close-target field. However, the examined text does not establish the required nonreuse and stale-lifetime rejection behavior. Merely transmitting pid is not yet a proved A/Flat/B fence. [Gate native Futures contract](https://www.gate.com/docs/developers/apiv4/en/futures/).

Gate documents per-key read/write permissions and IP restriction, plus master subaccount key management and locking. Those restrict a configured key/account business permission; the application cannot infer that every other credential or administrator is technically excluded. Gate direct-login exclusion for the intended account arrangement was not established. [Gate authentication and permissions](https://www.gate.com/docs/developers/apiv4/en/), [Gate subaccount/key management](https://www.gate.com/docs/developers/apiv4/en/subaccount/).

### Control matrix

The following describes documented capabilities and the current architecture, **not actual customer permissions observed**. YES_IF_AUTHORIZED is conditional on native trading permission; UNKNOWN is not silently treated as NO.

| Writer or control | Can write position | Can open | Can close | Can cancel | Can replace | Enforcement boundary |
| --- | --- | --- | --- | --- | --- | --- |
| Configured native trading key | YES_IF_AUTHORIZED | YES_IF_AUTHORIZED | YES_IF_AUTHORIZED | YES_IF_AUTHORIZED | API/product dependent | Its permission/IP policy, not other credentials |
| Second native trading key | YES_IF_AUTHORIZED | YES_IF_AUTHORIZED | YES_IF_AUTHORIZED | YES_IF_AUTHORIZED | API/product dependent | Outside current app authority |
| Standard native UI/user | YES_IF_AUTHORIZED | YES_IF_AUTHORIZED | YES_IF_AUTHORIZED | YES_IF_AUTHORIZED | UI/product dependent | Outside current app authority |
| Binance virtual-email subaccount direct login | NO under documented account type | NO via that direct login | NO via that direct login | NO via that direct login | NO via that direct login | Master API administration remains |
| MEXC API-only direct login | NO under documented account type | NO via Web/App login | NO via Web/App login | NO via Web/App login | NO via Web/App login | Master control remains |
| Gate intended direct login | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Not proved disabled |
| Customer master/admin | Can provision/manage further authority | Indirect writer possible | Indirect writer possible | Venue/admin dependent | Venue/admin dependent | Not custodied by current app |
| External bot/other service holding trading credentials | YES_IF_AUTHORIZED | YES_IF_AUTHORIZED | YES_IF_AUTHORIZED | YES_IF_AUTHORIZED | API/product dependent | External unless signer/egress custody is enforced |
| Reviewed candidate Canonical/Partner tracked CLOSE | Conditional shared gate | DENY ENTRY | Conditional one-shot CLOSE | DENY | DENY | Common helper + durable SQL + final Partner ticket |
| Candidate manual/recovery/retry/legacy without original association | DENY | DENY | DENY | DENY | DENY | No valid tracked source or unsupported mutation |
| Native SL/TP, liquidation or exchange system action | Native system can change exposure | Product/system dependent | YES | System dependent | System dependent | Cannot be prevented by application mutex; must be reconciled |
| Legacy private integration script or another VPS process | UNKNOWN current execution | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Not a live runtime inventory; must be excluded from signer custody |

| Configuration | Useful effect | Does it alone prove an exclusive writer? |
| --- | --- | --- |
| Dedicated trading API key | Separate audit/custody for that key | NO |
| IP whitelist | Limits network origins accepted for that key | NO; another permitted key or process at same origin is not excluded |
| Least privilege/read-only observer keys | Removes observer trading permission | NO; write/admin inventory still required |
| Trading permission separation | Can restrict selected native credentials/products | NO; all writer credentials must be covered |
| Subaccount | Separates account/position slots | NO; master/UI/key custody must also be addressed |
| Disable withdrawal/unnecessary permissions | Reduces nontrading exposure | NO; does not prevent open/close |
| Key rotation/removal of old keys | Can retire known native credentials | NO without complete inventory and control of future issuance |
| Separate operational account | Can be a component of a verifiable boundary | CONDITIONAL; custody, native account semantics and enforcement require separate proof |

## Exact runtime mutation inventory

AST inspection at 2026-10-03T11:38:13.441Z covered 390 JS/TS/MJS files under api, server, lib, scripts and src. Additional text search covered deploy/ops shell and runtime sources. It found 26 native mutation call sites in api/copytrade.ts. Dynamic third-party code, private tools and actually deployed processes are not certified by static search.

For every row below:

- Account resolution: caller's configured credential → authenticated native account/product/mode. Actual account values are not included.
- Executor: Binance rows use binanceSignedRequest; MEXC rows mexcSignedRequest; Gate rows gateSignedRequest.
- Supported CLOSE authority: executeExclusiveNativeWrite → public.futures_native_write_authority; claim/spend/unknown RPCs; row/advisory locking; immutable source association; exact signed payload hash; one-shot final sink.
- ENTRY and unsupported mutations: **DENY before execution**, not a successful shared-authority operation.
- Partner uses the same public/shared database port, not its tenant clone.

| Venue | Function | Source line | Native mutation | Candidate result |
| --- | --- | ---: | --- | --- |
| MEXC | placeMexcStopOrder | 479 | POST planorder/place | DENY protection |
| MEXC | placeMexcTakeProfitOrder | 493 | POST planorder/place | DENY protection |
| MEXC | cancelMexcStopOrders | 503 | POST stoporder/cancel_all | DENY cancel |
| MEXC | openMexcTrade | 639 | POST order/submit | DENY ENTRY |
| MEXC | closeMexcTrade | 717 | POST order/submit | Tracked CLOSE; actual binding absence DENY |
| Binance | openRealTrade | 1445 | POST leverage | DENY control |
| Binance | openRealTrade | 1453 | POST order | DENY ENTRY |
| Binance | closeRealTrade | 1476 | DELETE algoOrder | Early untracked DENY; otherwise cancel DENY |
| Binance | closeRealTrade | 1477 | DELETE algoOrder | Early untracked DENY; otherwise cancel DENY |
| Binance | closeRealTrade | 1479 | POST order | Tracked basis required |
| Gate | setGateLeverage | 7739 | POST position leverage | DENY control |
| Gate | openGateTrade | 7821 | POST orders | DENY ENTRY |
| Gate | placeGateProtectionOrder | 7859 | POST price_orders | DENY protection |
| Gate | cancelGateTriggerOrders | 7870 | DELETE price_orders/id | DENY cancel |
| Gate | closeGateTrade | 7937 | POST orders | Tracked CLOSE gate |
| Binance | binanceAwaitFill | 8504 | DELETE order | DENY cancel |
| Binance | cancelBinanceTriggerOrders | 8594 | DELETE algoOrder | DENY cancel |
| Binance | placeBinanceProtectionOrder | 8645 | POST algoOrder | DENY protection |
| Binance | setBinanceMarginType | 8729 | POST marginType | DENY control |
| Binance | openBinanceTrade | 8810 | POST leverage | DENY control |
| Binance | openBinanceTrade | 8822 | POST order | DENY ENTRY |
| Binance | closeBinanceTrade | 8911 | POST order | Tracked CLOSE gate |
| Binance | cancelBinanceAlgoOrderById | 9298 | DELETE algoOrder | DENY cancel |
| Binance | cleanupProfitProtection | 16323 | DELETE algoOrder | DENY cancel |
| Gate | cleanupProfitProtection | 16329 | DELETE price_orders/id | DENY cancel |
| MEXC | cleanupProfitProtection | 16335 | POST planorder/cancel | DENY cancel |

### Caller chains and execution separation

Canonical monitor → runProfitProtectionPosition (16390 Binance / 16391 Gate / 16394 MEXC) → executeTrackedFullClose → withNativeCloseBasis(original trade/source) → existing native close adapter → signed helper → exclusiveNativeSubmit → common durable guard → native forwarding callback.

Partner Monitor → service/context with nativeWriteDatabase=this.registry.shared → same copytrade/PP handler → same tracked gate; its final ownedFetch requires the exact common spend ticket for every native mutation. Policy evaluation is not authorization.

Manual API handlers, activateRealPendingTrade and standard adapter wrappers reach the same signers. Relevant entry callers are handleAuthenticatedCopytrade:18822/18850/18862/18880, activateRealPendingTrade:10811/10837/10855/10878 and adapter wrappers createMexcTrade/createGateTrade/createBinanceTrade. These are now quarantined, not certified operational entry.

Existing exit callers include applyRealMexcAction:2562, applyRealGateAction:8002, applyRealBinanceAction:9141, syncRealBinanceTrades:10325 and manual close handler:18932/18978/18998/19010. They cannot acquire a close without the original tracked basis/source; unsupported cleanup/control writes deny.

Protection cleanup also follows vanished-position reconciliation:2540/7983/9123, cancellation after fill uncertainty:8504, and reanalysis cancellation:10081/10082. Quarantine intentionally makes the candidate unavailable for live management.

Auto Scanner does not directly submit orders. Futures Pro, Fast Trader, pending activation and scheduler routes reach existing execution adapters; no second PP engine or scanner writer was added. The Canonical Worker source itself is unchanged and was not started. Admin requests do not acquire special bypass authority. Hyperliquid and Spot are outside this three-venue native guard and are not claimed covered. Gate Spot continues through its original product/lease classifier.

Private/legacy integration scripts identified by native-host search were not run. The static inventory cannot remove their credentials or certify their VPS scheduling; a controlled signer must withhold trading credentials/native egress from all such processes.

## Reused durable structures and local authority

Existing structures inspected:

- migrations/futures_profit_protection.sql: per-trade positions and close intents; copy_trades foreign keys; durable active-close uniqueness.
- migrations/futures_execution_attempts.sql: PREPARED/SUBMITTED/UNKNOWN entry holds.
- migrations/partner_copytrade.sql and server/partner-copytrade/database.mjs: separate tenant projections and credential-fingerprint records.
- api/_shared/futures-profit-protection-execution.ts: executeTrackedFullClose ordering.
- Existing futures_claim_position_close and owned equivalents: actor/trade-scoped, not a common native account slot across public/Partner ledgers.

These remain financial provenance projections. Their actor/trade identity and foreign keys cannot safely equate different native keys/public/Partner entries by assumption. The already-created isolated neutral candidate is retained; **no further table was added in this phase**.

Candidate schema: one public.futures_native_write_authority row per venue/native account/USDM/USDT/ONE_WAY/symbol, with explicit key/source aliases, revision, one owner/token, fixed-byte digest/deadline, spent bit, nonexpiring HOLD, and retired-token/source history.

Candidate RPCs:

1. futures_native_write_claim
2. futures_native_write_spend
3. futures_native_write_unknown
4. futures_native_write_terminal
5. futures_native_write_reconcile_flat

Claim/spend use actual PostgreSQL atomic updates and row/advisory locking. A second caller cannot obtain an active owner/spend. Lost claim/spend acknowledgement causes zero submit; timeout, failure and successful submission all retain HOLD until trusted reconciliation. TTL or a flat snapshot alone does not release it. Terminal/flat evidence requires exact intent association, resolved fixed requests, empty outstanding order inventory, retired source/token checks and revision CAS.

**Important limitation:** the terminal collector and technical-boundary registrar are not implemented/certified for actual accounts. Test receipt JSON and a SQL VERIFIED field are synthetic fixtures, not exchange proof. Privileged role/custody segregation in actual Production has not been observed. Runtime ENTRY/protection remain quarantined.

## Local implementation and files

Complete candidate source/test/schema delta relative to e1fdc45f29b350670e707de3a7afa10b9153d689: **15 files**. Seven tracked files contain 97 insertions / 7 deletions; eight candidate files are untracked. Output artifacts and this report are not application source changes.

| File | Role | This phase |
| --- | --- | --- |
| api/_shared/futures-exclusive-writer.ts | Common neutral gate, fixed bytes, original source, durable hold | Changed: deny all unsupported mutations and quarantine ENTRY |
| api/_shared/futures-profit-protection-execution.ts | Original tracked close basis propagation | Previous prototype preserved |
| api/_shared/partner-copytrade-context.ts | Public shared writer DB port | Previous prototype preserved |
| api/copytrade.ts | Three native signed transports/common bridge/early legacy denial | Previous prototype preserved |
| server/partner-copytrade/network.mjs | Final native forwarding ticket | Changed: every native mutation requires ticket |
| server/partner-copytrade/service.ts | Shared DB wiring | Previous prototype preserved |
| migrations/futures_exclusive_writer_candidate.sql | Neutral table and five RPCs | Previous prototype preserved; disposable application only |
| scripts/futures-exclusive-writer-proof.mjs | Actual SQL + candidate guard/sink modeled races | Changed: 5,000 per venue and truthful ENTRY/model labels |
| scripts/futures-exclusive-writer-scope-test.mjs | Separate exact source-preservation check | Extended: fixture assertion parity / unchanged Spot typing source |
| scripts/futures-exclusive-writer-validation.mjs | Explicit regression/build/type inventory | Preserved |
| scripts/futures-exclusive-writer-inventory.mjs | Read-only AST writer inventory | Added |
| scripts/futures-exclusive-writer-quarantine-test.mjs | Actual helper/sink negative controls | Added |
| scripts/futures-real-execution-fault-test.mjs | Existing extracted Binance/HL unit fixtures | Dependency injection only |
| scripts/futures-gate-mexc-fault-test.mjs | Existing extracted Gate/MEXC unit fixtures | Dependency injection only |
| scripts/lib/isolated-signed-transport.mjs | .invalid-only extracted unit dependency | Added; NOT native authority proof |

The old unchecked Binance algoOrder, MEXC planorder/place and Gate price_orders paths previously forwarded one synthetic request each with zero authority calls. Now the common helper rejects them before any effect, and the direct Partner sink also rejects. No alternate live executor or bypass flag was introduced.

405 existing copytrade functions, 27 nonsigner MEXC functions, Partner product/request classification and all original assertions/fixture code are unchanged. The source check removes only the exact new dependency import/injection lines and demands complete original fixture byte equality. PP pure policy/lifecycle/enrollment, Strategy, Decision Engine, risk, Auto Scanner, Spot UI, Worker and original scope/parity contracts remain unchanged.

Raw Git status still reports LF/CRLF index differences in the isolated Windows checkout; that is not a clean candidate or permission to commit. With explicit LF-safe comparison, the semantic tracked inventory is the seven files above. No config/history/index reset or automatic cleanup was performed.

### Exact final hashes

SHA-256 values below are raw final file bytes, not a Production release artifact.

| File | SHA-256 |
| --- | --- |
| api/_shared/futures-exclusive-writer.ts | 4f9ac88a46d562822c7b8f760dc208d09083cf26785df8c3e7d3db67ce0eb0cd |
| api/_shared/futures-profit-protection-execution.ts | 1855d540ad88f2eb3d507f69fab9c710f13726a1db506aecb58a6561cd53c386 |
| api/_shared/partner-copytrade-context.ts | a4fa750fa2f1d83f7a5dc2e25035b3ef45bdbeb1d3d05bf5f474884fd5120d5a |
| api/copytrade.ts | 1d98350508cd27f7dd4691077424311ac7d10517916f8ff9220994688237296d |
| server/partner-copytrade/network.mjs | 70f25cfc54273013ef15b964073ed7ce52f870c66e1e997232e483518f9ba2d6 |
| server/partner-copytrade/service.ts | 3940cd787193e69de21e258cb7d2e89d8f03ebaba93c0fdcca225f9eb19291a1 |
| migrations/futures_exclusive_writer_candidate.sql | a6cd5a283c4f7dc482372b9e192f46a3af734e6bad5dc420f6d1d9acd88558eb |
| scripts/futures-exclusive-writer-proof.mjs | b43ef9b1dbbcfc63efe933a8a64f6f1ec254bf648ea01df435e9bfa91a2f7f4f |
| scripts/futures-exclusive-writer-scope-test.mjs | 52fd9c6da1e00608f332cec1f33907ac3a48e92633914d8dc92bf013c3f2f49c |
| scripts/futures-exclusive-writer-validation.mjs | 2b44f17a121c5906ff08955c29becc47d6e4e3d970d88738fa3abf67b726a0b2 |
| scripts/futures-exclusive-writer-inventory.mjs | dd3b10d2083036370920b5160e571a07df68d57e5541328758677382be47e90a |
| scripts/futures-exclusive-writer-quarantine-test.mjs | dcb57f0493f39a32c0f732902cac16101f80dd2ab2d9164de3bce1ed075f4744 |
| scripts/futures-real-execution-fault-test.mjs | aed3d65ca5872d560c2e50c859feaea704c7e3b3f83566a7c5f74f1bb69a301b |
| scripts/futures-gate-mexc-fault-test.mjs | 2c18e14c6067ac479b0d775741bbdd83f1dc1f83eaf300dc3fc030d9242fe1af |
| scripts/lib/isolated-signed-transport.mjs | 262134693212c34ed20a84b741e8cacec4789f4609fd24cb314ade55167d8add |

Protected prior owner worktree hashes remain copytrade 5fcd84689c95f6db1def3dac884ce56fd6c8891d1dc60418aa8ca6ab50996125, native-exit ownership helper 10d62b4b04bb6f7e16aadffa0dfb963488d7bc75da579d24d9e52d531fa865c4 and native-exit candidate SQL cbdac629890fcb5d3a567b160946b62c17da9b3858c4da7e15f5c521516d5ebe. No private/unrelated work was deleted or moved.

## Tests executed

Node v22.23.3. All below used reviewed offline/disposable ports; no private native API, env-file bootstrap or Production DB.

### Quarantine and source integrity

~~~text
node --test scripts/futures-exclusive-writer-quarantine-test.mjs
46/46 PASS; 0 FAIL; 0 SKIPPED
node scripts/futures-exclusive-writer-scope-test.mjs
PASS localized source preservation; NOT historical release approval
node scripts/futures-exclusive-writer-inventory.mjs
PASS execution; 390 files, 26 runtime mutation calls
node --check <proof/inventory/quarantine/shim files>
PASS
git -c core.autocrlf=false -c core.safecrlf=false diff --check
PASS
~~~

Quarantine cases exercise actual candidate helper and Partner sink: 19 mutation routes against both, ENTRY before effects on three venues, native GET preservation, Gate Spot preservation and unknown mutation denial. They do not claim protection availability.

### Actual PostgreSQL proof and conditional native model

~~~text
PP_PROOF_PG_BIN=<installed PostgreSQL 18 binary directory>
node scripts/futures-exclusive-writer-proof.mjs
PostgreSQL 18.6, fresh runner-owned cluster
43/43 proof groups PASS
2026-10-03T11:23:06.482Z → 2026-10-03T11:34:11.460Z
~~~

| Venue | Canonical/Partner independent SQL-connection races | A/Flat/B traces | Double auth | Double executor | Double close | Two owners | Stale A on B |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Binance | 5000 | 5000 | 0 | 0 | 0 | 0 | 0 |
| MEXC | 5000 | 5000 | 0 | 0 | 0 | 0 | 0 |
| Gate | 5000 | 5000 | 0 | 0 | 0 | 0 | 0 |

**Boundary:** SYNTHETIC_ENFORCED_ACL_NOT_REAL_EXCHANGE. ENTRY is SQL-only model admission; actual runtime ENTRY is denied. Terminal native receipts/account ACL are synthetic. Actual shared CLOSE helper, native signed bridge, Partner sink and SQL claim/spend run in-process against mocked native responses and real disposable SQL. Actual MEXC API bridge denies missing native account binding; modeled MEXC SQL identity is not that missing proof.

Tests cover restart before POST, lost claim/spend acknowledgement, timeout/UNKNOWN, retries, second caller, stale/retired token and source alias, identical reopened B, wrong account/symbol/deadline/quantity/direction, reconciliation during close, flat-only/TTL denial and revision CAS.

The no-external-writer model blocks B while A is held. Independent native SL/TP or another allowed external writer can flatten A; a real guarantee needs all pending request/protection reconciliation and enforced external entry exclusion before B. Test labels do not pretend those native enforcement prerequisites are installed.

Separate negative controls show 5,000 **modeled harmful** uncontrolled-writer outcomes per venue. Gate model omits a proved native pid predicate; MEXC ID reuse is deliberately hypothetical. These demonstrate the model's reliance on the boundary, **not actual native acceptance/reuse behavior**.

Initial sandboxed PostgreSQL start failed before proof execution. The separately authorized local retry completed; its fresh cluster was stopped in finally. Subsequent pg_ctl status returned **no server running** for that exact owned data directory. The failed initial attempt is not counted as a proof PASS.

### Regression and builds

Complete explicit inventory: 19 named suites in scripts/futures-exclusive-writer-validation.mjs.

~~~text
PP_VALIDATION_OUTPUT=output/exclusive-writer-final-account-control-serial-receipt-20261003
PP_TEST_CONCURRENCY=2
node scripts/futures-exclusive-writer-validation.mjs --regression-only
2026-10-03T11:34:50.357Z → 2026-10-03T11:36:55.487Z
957 total / 955 PASS / 2 FAIL / 0 cancelled / 0 SKIPPED / 0 TODO
exit 1
~~~

The output folder name includes serial-receipt, but the exact file-concurrency setting was **2**, not 1. The PostgreSQL proof/build processes were finished before this final regression execution.

Earlier post-fixture run: 952 PASS / 5 FAIL, including three 12-second child timeouts during competing proof/build load. These failed receipts remain preserved. The unchanged final rerun passed those same tests without increasing deadlines or altering assertions.

Web build PASS; Admin build PASS; Partner build PASS; all **14 API bundles PASS** in the fresh source-identical runtime build run at 2026-10-03T11:22:23.744Z–11:30:16.820Z. Only isolated unit fixture/scripts changed afterward; application sources match the build.

Independent compiler comparison: frontend 71 baseline → 71 candidate diagnostics. API/Partner 33 → 33. The raw matcher lists one introduced TS2345 at copytrade.ts:4112 and one removed at base:4045 because the message union order changes from POST|GET to GET|POST. Both refer to the **same unchanged cancelBinanceSpotOrder / binanceSpotSignedRequest source**; localized equality proves no new error there. The raw failure is preserved; this is not a clean TypeScript build. Genuine new source diagnostics observed: 0.

Official historical scope test remains **FAIL**: its exact Phase3B file inventory does not authorize the exclusive-writer architecture. Official GitHub CI **NOT_RUN**, no push/dispatch authorized.

## Every previous regression failure disposition

The prior full report remains permanent failed evidence:
[Prior account-boundary/regression report](https://github.com/signal0verse/SignalVerse-AI-Log/blob/bf5ab0587767ba11787f94d4f241e33b4b9e5977/reports/futures/pp-exclusive-writer-account-boundary-regression-closure-2026-10-03.md).

TAP numbers identify the same full-suite ordering. Detailed original names/errors remain in that report and local receipts.

| Previous IDs | Count | Root cause / source | Actual repair or disposition | Final result |
| --- | ---: | --- | --- | --- |
| 2 | 1 | Gate/MEXC extracted signer fixture missing new exclusiveNativeSubmit dependency; harness:33 and standalone context:240 | Inject .invalid-only signed transport; no assertion/parser change | PASS; Gate/MEXC file executes underlying internal groups |
| 264,265,266,267,271,283,284,285,286,289,290,295,333,334,335,336,348 | 17 | Binance extracted harness sandbox around :305 lacks the same new signer dependency | Same bounded fixture dependency injection | PASS |
| 263,268,272,273,274,275,276,277,278,279,280,281,282,287,291,292,293,294,296,297,298,299,300,301,302,303,304,326,327,339,340,341,342,343,344,347,349,350,351,352,355,356,357,358,359,361,362 | 47 | Downstream admission/protection/fill/reconciliation expectations after missing dependency; same existing harness source | Same dependency repair; original expected values retained | PASS |
| 133 | 1 | VERIFY_ONLY projection child spawnSync ETIMEDOUT, safe-idle run helper:211, 12-second bound | No code/deadline change; isolated/final unloaded rerun | PASS; old failure retained |
| 107 | 1 | safe-idle-test:177 exact a045 execution/context/service bytes contract | New shared basis/import wiring legitimately differs; no allowlist/hash weakening | FAIL |
| 191 | 1 | profit-protection-test:301 → legacy parity consumer, verify-only-parity:11 | New native signing/authority bridge outside exact Phase3B delta | FAIL |

Total 68 = 65 dependency/downstream failures repaired + 1 transient rerun PASS + 2 scope failures retained. A separate isolated legacy adapter run reported 124/124 PASS. It tests native fill/parsing/protection behavior with the unit dependency, **not the new authority or live entry protection saga**.

The two remaining failures are not unrelated baseline regressions and are not external exchange failures. They reject the newly introduced prototype scope. Under the explicit no-contract-weakening rule, they cannot honestly be labeled PASS. A future separately reviewed replacement scope contract must preserve all old non-PP invariants; none was implemented here.

## Hard external limitation and safe operational solution

~~~text
EXTERNAL_LIMITATION=Current customer-controlled native BYOK account administration is outside the application authority
WHY_UNSOLVABLE=Local SQL/signers cannot veto independent native UI/key/master requests or future native key issuance
EXCHANGE=BINANCE,MEXC,GATE under the current BYOK custody arrangement
MISSING_PRIMITIVE=Exchange-enforced exclusive writer/custody boundary OR proved expected-lifetime close rejection
WHY_APPLICATION_CANNOT_REPRODUCE_IT=Independent authorized native requests do not consult SignalVerse DB, mutex, source alias or token
WHAT_EXCHANGE_CONTROL_IS_REQUIRED=Native account isolation, complete writer-key/admin inventory, enforceable writer exclusion, authenticated account binding and terminal/reopen evidence
WHAT_ACCOUNT_CONFIGURATION_IS_REQUIRED=Separately approved dedicated account; API-only where documented; broker-only trading credentials/egress; read-only observer keys; old writer removal; controlled master/key issuance and audited recovery barrier
SAFE_OPERATING_MODE=No new automatic PP close guarantee on unverified BYOK; observation/alerts only for this candidate; existing Production and native protection remain untouched
~~~

An operator-custodied account with a single signer/egress broker is a **conditional feasible control direction**, not an installed solution or excuse to redesign unrelated architecture. The administrator capable of reissuing native writer rights must be inside that controlled domain, or any such change must revoke admission and maintain HOLD until complete re-verification. A user's promise not to trade is not evidence.

Binance virtual-email and MEXC API-only account types are documented components. Gate's intended no-login and admin-exclusion arrangement needs separate native confirmation. None is provisioned by this phase. Existing assets, positions, keys and protections must not be moved/revoked to manufacture a test.

MEXC exact account binding and native stale-ID behavior, and Gate pid lifetime/reuse/stale request behavior remain unresolved. Their absence is not asserted globally. A future proved native fence could reduce reliance on exclusion for that venue; it must be evidenced before acceptance.

### Local remaining requirements are distinct

1. Same-owner durable ENTRY → protective setup → uncertain-fill/unwind saga. Actual entry is currently quarantined, not completed.
2. Trusted native terminal collector and technical-boundary registrar, with privilege and account custody evidence. JSON fixture flags are insufficient.
3. Native account/position/source association across public and Partner ledgers, including current MEXC native key binding and Gate pid semantics.
4. Independently reviewed new architecture scope contract without removing old protection/Spot/native assertions.
5. Exact candidate clean Git/CI gate, under separate push authorization; no current CI PASS exists.
6. Native exclusion/behavioral proof under separately authorized safe account scope. No exchange test is authorized here.

These are not declared solved by 30,000 model iterations. The local prototype remains quarantined and **NOT DEPLOYABLE**.

## Files inspected

Owner attachment; AGENTS.md, CLAUDE.md, TRADING_STRATEGY.md amendments, HANDOFF.md, docs/AI_HANDOFF.md, docs/COLLEAGUE_HANDOFF_2026-09-29.md and docs/testing/stability-test-runbook.md; prior exclusive-writer/account-boundary reports; candidate files listed above; api/_shared/futures-profit-protection.ts, enrollment/lifecycle/runtime, futures-decision-engine.ts, futures-risk.ts, futures-market-discovery.ts, api/analyze.ts, api/predictions.ts, api/stablecoin-engine.ts, server/futures-profit-protection/worker.mjs; existing PP/entry/Partner migrations and database adapter; original historical scope/parity/safe-idle tests; explicit regression inventory and local build/test logs; read-only native endpoint/account documentation linked at each finding.

No credential/env/database-export file was read for native account access.

## Git status and publication

Application HEADs unchanged. No application commit, branch promotion, push, reset, rebase, amend or deployment. Primary dirty/private work remains preserved. Application source stays only in the isolated candidate; documentation update is additive.

Publication is report-only to SignalVerse-AI-Log/master. The publication commit and independently verified remote bytes will be returned in the conversation and recorded in HANDOFF.md; no report claims source deployment. Existing failed historical reports are not rewritten.

## Final requested fields

~~~text
FINAL_SOLUTION=Local fail-closed repairs implemented; real account guarantee not achieved
SOLUTION_TYPE=STATE_B_HARD_EXTERNAL_LIMITATION_CURRENT_BYOK
ARCHITECTURE=Existing PP plus isolated shared durable native slot authority; no second PP engine
ACCOUNT_BOUNDARY=NOT_PROVEN_ON_REAL_ACCOUNTS; outside current application-key enforcement domain
SHARED_AUTHORITY=PROVEN_IN_DISPOSABLE_SQL_MODEL; NOT_END_TO_END_REAL_PROVEN
SINGLE_EXECUTOR=ONE_SHOT_MODEL_PROVEN; EXTERNAL_WRITERS_NOT_CONTROLLED
SINGLE_ENTRY_AUTHORITY=SQL_MODEL_PROVEN; RUNTIME_ENTRY_QUARANTINED_NOT_OPERATIONAL
BINANCE=CONDITIONAL_MODEL_PASS; REAL_A_TO_B_NOT_PROVEN
MEXC=CONDITIONAL_MODEL_PASS; REAL_ACCOUNT_BINDING_AND_FENCE_NOT_PROVEN
GATE=CONDITIONAL_MODEL_PASS; PID_FIELD_EXISTS; REAL_LIFETIME_FENCE_NOT_PROVEN
CANONICAL_PARTNER=5000_RACES_PER_VENUE_MODEL_PASS; REAL_SCOPE_NOT_PROVEN
STALE_A_ON_B=0_IN_EXCLUSIVE_MODEL; UNCONTROLLED_REAL_ACCOUNT_GUARANTEE_NOT_PROVEN
UNKNOWN_POST=DURABLE_HOLD_MODEL_PASS; NO_BLIND_SECOND_POST
RESTART=MODEL_PASS
RETRY=MODEL_PASS_NO_SECOND_SUBMIT
REOPEN=MODEL_BARRIER_PASS; TRUSTED_NATIVE_COLLECTOR_NOT_IMPLEMENTED
DIRECT_BYPASS=0_OBSERVED_IN_REVIEWED_CANDIDATE_HELPER_AND_PARTNER_SINK; GLOBAL_EGRESS_NOT_PROVEN
ENTRY_BYPASS=0_TESTED; ALL_RUNTIME_ENTRIES_DENIED
CLOSE_BYPASS=0_TESTED_INTERNAL; OUTSIDE_WRITERS_NOT_CONTROLLED
DOUBLE_AUTHORIZATION=0_MODEL_ONLY
DOUBLE_EXECUTOR=0_MODEL_ONLY
DOUBLE_CLOSE=0_MODEL_ONLY
TWO_OWNERS=0_MODEL_ONLY
REGRESSION=FAIL:957_TOTAL,955_PASS,2_FAIL,0_SKIPPED
BUILD=WEB_PASS,ADMIN_PASS,PARTNER_PASS,14_API_BUNDLES_PASS
CI=NOT_RUN
FILES_CHANGED=15_ISOLATED_CANDIDATE_SOURCE_TEST_SCHEMA_FILES; REPORT_AND_HANDOFF_ADDED_SEPARATELY
TABLES_CHANGED=0_PRODUCTION; EXISTING_CANDIDATE_NEUTRAL_TABLE_APPLIED_ONLY_TO_DISPOSABLE_PG
RPCS_CHANGED=0_PRODUCTION; FIVE_EXISTING_CANDIDATE_RPCS_TESTED_IN_DISPOSABLE_PG
APPLICATION_COMMIT=NONE
PUSH=NO_APPLICATION_PUSH; REPORT_ONLY_AI_LOG_PUBLICATION
DEPLOYMENT=NO
PRODUCTION_WORKER_STARTED=NO
REAL_EXCHANGE_CALLS=0
REAL_CLOSE_ACTIONS=0
PRODUCTION_MUTATIONS=0
REAL_PP=NOT_READ_OR_CHANGED_THIS_PHASE
DEMO_PP=NOT_READ_OR_CHANGED_THIS_PHASE
ORDERS_CHANGED=0
POSITIONS_CHANGED=0
SL_CHANGES=0
ONE_TP_CHANGES=0
FINAL_CLASSIFICATION=HARD_EXTERNAL_LIMITATION
QUALIFIER=CURRENT_BYOK_ACCOUNT_BOUNDARY; LOCAL_CANDIDATE_ALSO_HAS_UNRESOLVED_GATES
RELEASE_READINESS=BLOCKED
~~~

STOP. Do not start the Worker, enable PP, deploy this quarantine candidate or interpret modeled counters as real account safety.
