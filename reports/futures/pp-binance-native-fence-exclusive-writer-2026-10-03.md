# Futures Profit Protection native fence and exclusive writer validation

## Metadata

- Date: 2026-10-03 UTC.
- Task ID: PP-BINANCE-NATIVE-FENCE-THEN-EXCLUSIVE-WRITER.
- Module: Futures Profit Protection, native submission authority only.
- Mode: public documentation research, isolated local implementation, disposable PostgreSQL and synthetic transports. No live account operation.
- Repository: SignalVerse-Main. Primary checkout HEAD remains `0dbca62357a4adf34240f40ceda3e387356ec4b0`.
- Candidate branch: `codex/pp-exclusive-writer-20261003`.
- Candidate checkout: `tmp/pp-exclusive-writer-20261003`.
- Starting and ending application commit: `e1fdc45f29b350670e707de3a7afa10b9153d689`. Changes remain uncommitted in the isolated checkout; no application push.

## Executive result

نسخهٔ محلیِ کنترل مشترک ورود و خروج پیاده‌سازی شد و آزمون‌های PostgreSQL موقت آن پاس شدند؛ اما تضمین حساب واقعی اثبات نشده و نسخه آمادهٔ انتشار نیست. نویسندهٔ بیرونی حساب هنوز از نظر فنی مهار نشده، اتصال هویت حساب MEXC اثبات نشده و رگرسیون قدیمی نیز پاس نیست. این گزارش نتیجهٔ مدل مصنوعی را جایگزین شواهد صرافی یا ایمنی صددرصدی نمی‌کند.

No usable **documented** Binance USD-M request condition was found that means “execute only against original position A.” This is a conclusion about the inspected supported contracts, not a claim about every undocumented exchange implementation. Investigation continued into an exclusive-writer implementation rather than stopping at the documentation audit.

The new local authority passes 43 integrated proof groups: 1,001 independent-connection, different-key Canonical/Partner races and 1,001 delayed A-to-B traces **per venue**. All positive A-to-B traces assume a synthetic enforced account boundary and synthetic authenticated terminal evidence. With that boundary deliberately removed, the negative model produces 1,001 unsafe closes per venue. The latter is a blocker, not a safety PASS; MEXC's negative model deliberately assumes ID reuse without claiming that the real exchange reuses IDs.

Final classification: **BLOCKED_NOT_PROVEN**. There is no basis for enabling live PP, starting its Production Worker, promoting this source, or deploying it.

## Objective and authorized scope

Prevent an old Profit Protection Close for A from affecting reopened B, and prevent two paths from independently submitting the same ordinary native Close. Preserve policy, SL, ONE TP, enrollment, Strategy, Decision Engine, scanner, Spot and Prediction Market.

Only the new isolated local checkout was changed. No SSH, Production credential acquisition, exchange API request, Production database access/mutation, flags, services, scheduler, Guard, official CI, deployment or application main push was performed. No fresh Production runtime, PID or flag state is claimed.

## Binance documentation findings

The current REST ordinary/algo order contracts and WebSocket equivalents were inspected together with the actual adapter. Fields covered include symbol, side, positionSide, quantity, reduceOnly, closePosition, client order IDs, MARKET, STOP_MARKET, TAKE_PROFIT_MARKET, trailing/conditional orders, trigger/working types, time-in-force and GTD. None of these inspected requests carries an expected position-lifetime ID or conditional position-version predicate. Account alias, order ID, fill correlation, update time and position mode are useful evidence, but are not an exchange-enforced A-lifetime fence. This request-schema conclusion is based on the [official REST trade catalogue](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade) and [official WebSocket trade catalogue](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/ws-api/trade).

Account/balance alias, V2/V3 position observations, exchange information, portfolio/account identity and order-query metadata do not add the missing request predicate. The candidate uses the authenticated USD-M balance alias and independently verifies one-way mode; it does not call an API key fingerprint the account identity. See the [official account catalogue](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/account).

Signed request timestamp/recvWindow bounds constrain admission of the exact old bytes, not their target generation. They cannot alone prove that an admitted order is terminal. UNKNOWN responses therefore remain holds. See [Binance USD-M general information](https://developers.binance.com/en/docs/products/derivatives-trading-usds-futures/general-info).

User-stream ordering within a connection, expiry/reconnect handling and execution reports were considered. Conditional-order expiry when flat, including the described GTE_GTC event, does not prove rejection of an as-yet-unregistered stale conditional create arriving after B opens, or of an already-admitted request. Public stream documentation was accessible, but linked dynamically rendered payload-schema pages did not provide complete field text; no unavailable schema is represented as inspected evidence. See [the official user-data stream documentation](https://developers.binance.com/en/docs/products/derivatives-trading-usds-futures/user-data-streams).

Hedge mode is not enabled by this candidate. It rejects non-one-way authenticated account mode and non-BOTH Binance positionSide. No live hedge-mode proof is claimed.

## External account boundary

A virtual-email subaccount can remove direct subaccount login, but the master account can manage API keys and enable account switching. Consequently, a subaccount or IP-restricted key alone is not an account-wide writer lock. See [Binance virtual subaccounts](https://www.binance.com/en/support/faq/detail/360020632811), [account switching](https://www.binance.com/en-NG/support/faq/detail/63e6942cb1f64f26ba8841241ff6c5ab) and [Exchange Link account controls](https://developers.binance.com/en/docs/catalog/vip-and-institutional-exchange-link/api/rest-api/account).

The exact prerequisite for the exclusive-writer guarantee is an independently enforced account boundary that excludes **every** uncontrolled writer, not a promise not to trade manually:

1. An isolated native Futures account/subaccount, with uncontrolled UI/login/switch trading paths disabled.
2. Inventory and revocation of every other trading API key/application/service for that native account.
3. Sole trading credential in non-exportable custody accessible only to the authorized executor; an enforced executor network/OS boundary must also prevent raw trading egress by other processes.
4. Independently constrained master capabilities that cannot create another trading key or re-enable a login/switch route during an unresolved operation. If the owner/master can bypass this boundary, the guarantee explicitly excludes that state and the account must remain unverified/quarantined.
5. Independent attestation of account, product, settlement, position mode, key aliases and this boundary. Any uncertain or revoked boundary denies new admission.

No inspected native API provides the whole immutable account-wide lock automatically. No account configuration, key inventory/revocation, custody/egress rule or master restriction was installed here: real exchange calls/configuration were prohibited. The local database's `VERIFIED` field and evidence reference are **not themselves** that technical boundary. Migration provisions no account, and application/Partner roles cannot provision one.

## Existing structures inspected and reuse decision

Inspected `copy_trades`, `real_accounts`, `futures_execution_attempts`, `futures_profit_protection_positions`, `futures_position_close_intents`, the corresponding migrations, tracked-close ports, Partner database/registry/context/network/service and existing RPC call sites. Existing entry attempts and trade-local close intents retain their financial, attribution and UNKNOWN semantics.

Those records are keyed by actor/trade and, on the Partner path, by an owned schema/clone. They cannot safely make an ordinary native ENTRY and CLOSE across two schemas contend on one native account/slot merely by retaining their existing trade-local primary keys and foreign keys. A small neutral public slot authority was therefore added **locally only**. It is not another PP decision engine. Existing projection rows may still independently exist; only the new native authority is allowed to admit an ordinary native submit.

## Implementation and execution flow

The shared row is unique on venue, authenticated native account, product, settlement, one-way mode and symbol. Credential fingerprints resolve to that row but do not replace native account identity. Ambiguous/unverified bindings deny.

```text
Existing discovery and unchanged PP policy
  -> tracked original trade/native basis
  -> public or Partner source namespace
  -> existing financial intent projection
  -> fixed signed native request bytes
  -> authenticated native account and position validation
  -> shared durable slot claim (row/advisory locks)
  -> second native account/position validation
  -> atomic one-shot spend
  -> ordinary native POST
  -> persistent HOLD, including success/lost response/restart
  -> separately trusted terminal evidence
  -> terminal/reconcile RPC
  -> eligible new ENTRY only after complete terminal barrier
```

`executeTrackedFullClose` carries the original ledger trade ID, basis and exact MEXC position ID when available. The public and Partner namespaces hash their existing trade identities. A trusted entry-fill association must map these aliases onto the current shared slot. Source aliases are retired durably and cannot be assigned to reopened B. This avoids accepting old A merely because B has the same entry, side, quantity or assumed-reused MEXC position ID. These hashes are not invented native Position IDs or perpetual native generation IDs.

`executeExclusiveNativeWrite` derives symbol, side, quantity and admission deadline from the immutable signed bytes, not a mutable caller object. Claim/spend acknowledgement loss produces zero submit and leaves HOLD. A successfully spent request is never re-signed/retried by this guard. Restart or elapsed time cannot free the row.

The private forwarding ticket binds the final Partner sink to the spent exact URL/body/signature/credential. A second forward, different bytes or a direct ordinary native forwarding call denies. This in-process ticket is an additional sink constraint, not the durable owner or an account-exclusive boundary.

### Entry and Close writer coverage

The source writer inventory was traced through ordinary exchange transports, rather than inferred from function names:

| Writer | Path reaching the shared gate or denial |
| --- | --- |
| Canonical pending entry / confirmation / retry | `activateRealPendingTrade` -> existing exchange adapter -> native signed request -> `exclusiveNativeSubmit` |
| Scanner / Pro entry | discovery and `handleFuturesProCronTick` -> existing pending activation -> same transports; no scanner algorithm change |
| Manual / admin entry | `handleAuthenticatedCopytrade` / adapter entry -> same transports |
| Legacy Binance entry | `openRealTrade` -> `binanceSignedRequest`; no independent raw native POST |
| Partner entry and monitor | `PartnerCopytradeService.ctx` uses `registry.shared` public authority, then existing adapter and `ownedFetch` sink |
| Canonical / Partner PP Close | `runProfitProtectionPosition` -> native adapter -> `executeTrackedFullClose` -> shared ordinary native submission |
| Existing exits / sync / reconciliation | `existingFuturesClose`, `syncRealBinanceTrades`, `syncRealMexcTrades`, `syncRealGateTrades` -> same close adapters; an untracked source cannot submit |
| Emergency / unwind / direct adapter | Common ordinary native gate; missing original source/basis denies, not a second executor |
| Legacy Close | `closeRealTrade` denies untracked requests **before** its existing protection-cancellation body |
| Fast Trader | Existing path inspected; no new Real native writer introduced or Fast Trader source changed |
| Scheduler / API / services | Existing callers converge through these same three ordinary native signed transports; no new scheduler/worker created |

In the final source, the ordinary submits are MEXC `/api/v1/private/order/submit`, Gate `/futures/usdt/orders` and Binance `/fapi/v1/order`. Unknown/batch ordinary-order writer routes fail closed. Repository search also accounted for existing native algo/price/plan protection creation, cancellation and leverage/margin controls. These remain separate native protection/control behavior; they are not PP execution authority.

The existing VERIFY_ONLY capability now rejects an attempted native effect before private account discovery/shared RPC work. Its sealed transport remains authoritative. No capability, policy threshold or worker activation setting was weakened.

### Terminal barrier and limits

Trusted-only terminal/reconcile RPCs require exact slot/request/source attribution, authenticated evidence digest, native-clock lower bound beyond the fixed original admission deadline, correlated terminal native result, and complete native order inventories. CLOSE or FLAT requires no ordinary/algo/protection orders. An ENTRY returning OPEN may retain known independent reduce-only SL/ONE TP, never an order that can open a position. A subsequent independent native SL/TP flat requires a separate empty-inventory, revision-CAS reconciliation before re-entry.

The app and Partner cannot call these trusted RPCs, alter ownership, or fabricate boundary provisioning. Trusted collector/registrar implementation and deployment are **not certified for a real account** in this task. In particular, a live collector must additionally establish quiescence/terminal status for all in-flight independent protection/control submissions, not just observe an empty order snapshot or inspect the ordinary request deadline stored here. This candidate leaves those existing submissions intact; it does not prove their full native queue/barrier coverage. A JSON receipt is a trusted evidence interface, not native proof. This is a remaining integrated terminal-barrier requirement, not a completed production guarantee.

## Venue-specific findings

| Venue | Actual code binding | Lifecycle/fence result | Local behavior |
| --- | --- | --- | --- |
| Binance | Authenticated position mode plus USD-M balance accountAlias, repeated before spend | No usable documented A-lifetime Close fence | Unverified account/slot denies; conditional local shared admission proven |
| MEXC | Installed Contract API self account/subaccount binding remains NOT_PROVEN | Exact positionId is required for a close, but lifetime non-reuse is not established | Actual API bridge always denies `EXCLUSIVE_MEXC_NATIVE_ACCOUNT_BINDING_NOT_PROVEN`; synthetic binding tests do not replace this |
| Gate | Authenticated Futures accounts `user`, USDT settlement, one-way mode | pid/open_time/update_id are not assumed non-reused or conditional Close generations | Unverified binding denies; fixed ordinary write expiry added without changing SL/TP payloads |

MEXC's installed ordinary order contract permits a positionId on a close but does not establish the lifetime non-reuse guarantee needed here. Its numeric/string precision contract was not weakened. See [the installed MEXC Contract API documentation](https://mexcdevelop.github.io/apidocs/contract_v1_en/).

Gate's account user, position fields and millisecond `x-gate-exptime` were inspected. Expiry can bound admission, not identify A's lifetime or prove all accepted orders terminal. See [the official Gate Futures API](https://www.gate.com/docs/developers/apiv4/en/futures/). Per-key permissions/IP restrictions likewise are not an account-wide writer lock; see [Gate API v4](https://www.gate.com/docs/developers/apiv4/en/).

## Files changed and exact hashes

Ten local implementation/test paths changed; report and additive HANDOFF are documentation only. No old test/assertion/allowlist was edited.

| Path | Purpose | SHA-256 of final local bytes |
| --- | --- | --- |
| `api/copytrade.ts` | Common native admission envelope, public/Partner account binding, signed fixed bytes, early legacy denial | `1d98350508cd27f7dd4691077424311ac7d10517916f8ff9220994688237296d` |
| `api/_shared/futures-profit-protection-execution.ts` | Carry original tracked trade source/basis into the envelope | `1855d540ad88f2eb3d507f69fab9c710f13726a1db506aecb58a6561cd53c386` |
| `api/_shared/partner-copytrade-context.ts` | Public shared native authority client in owned context | `a4fa750fa2f1d83f7a5dc2e25035b3ef45bdbeb1d3d05bf5f474884fd5120d5a` |
| `server/partner-copytrade/service.ts` | Supply existing public `registry.shared` client | `3940cd787193e69de21e258cb7d2e89d8f03ebaba93c0fdcca225f9eb19291a1` |
| `server/partner-copytrade/network.mjs` | One-shot exact-byte ordinary native forwarding sink | `8030b23e27e890d8c8f78de28111617b0d5f7dd4f637a71973f481c4d71d1a82` |
| `api/_shared/futures-exclusive-writer.ts` | Classification, original source, fixed bytes, shared claim/spend, durable HOLD | `ce7a5e8d7041c44a7ef03d516ad35afb9ce27c1a13a97de3ba74aa26a06560f6` |
| `migrations/futures_exclusive_writer_candidate.sql` | One neutral table and five local RPCs | `a6cd5a283c4f7dc482372b9e192f46a3af734e6bad5dc420f6d1d9acd88558eb` |
| `scripts/futures-exclusive-writer-proof.mjs` | Actual disposable PG, different-key races, precise delayed-arrival model and native bridge tests | `56eb7b8c10cde48e227fce29561799aa094f5fa81e9b6125e2dd7f34ae37d0d9` |
| `scripts/futures-exclusive-writer-validation.mjs` | Named safe regression, build, bundles and independent baseline diagnostics | `2b44f17a121c5906ff08955c29becc47d6e4e3d970d88738fa3abf67b726a0b2` |
| `scripts/futures-exclusive-writer-scope-test.mjs` | Independent localized-scope proof, never reapproving the old Phase3B byte contract | `1e15cc1394fe37496d02abc2d64490cebeb0e7f1bf8c633356ad9a32d90f5811` |

Local-only schema: `public.futures_native_write_authority`. Local-only RPCs:

```text
futures_native_write_claim
futures_native_write_spend
futures_native_write_unknown
futures_native_write_terminal
futures_native_write_reconcile_flat
```

No Production table/RPC was created or changed. The candidate migration was applied twice only in each runner-owned disposable cluster to check repeatability.

## Tests executed

Commands use the existing isolated Node `v22.23.3` and PostgreSQL `18.6`; no env-file load, existing DB URI or exchange fetch was permitted.

```text
node --experimental-strip-types --check <each of the 9 JS/TS source/test paths>
node scripts/futures-exclusive-writer-scope-test.mjs
PP_PROOF_PG_BIN=<installed PG binaries>
node --experimental-strip-types scripts/futures-exclusive-writer-proof.mjs
node scripts/futures-exclusive-writer-validation.mjs
```

Final proof window: `2026-10-03T09:49:16.982Z` to `2026-10-03T09:51:29.434Z`; 43/43 groups PASS. The owned loopback cluster was stopped afterward. Migration hash exactly matches the inventory above.

| Venue | Different-key Canonical/Partner races | Delayed A packet arrives after B opens | Double auth / executor / Close / owner | Stale A affects B |
| --- | ---: | ---: | --- | ---: |
| Binance | 1001 | 1001 conditional native models | 0 / 0 / 0 / 0 | 0 conditional |
| MEXC | 1001 | 1001 conditional native models | 0 / 0 / 0 / 0 | 0 conditional |
| Gate | 1001 | 1001 conditional native models | 0 / 0 / 0 / 0 | 0 conditional |

The delayed-packet trace is explicitly: authorize A, leave packet waiting, A flat, deny internal B while unresolved, obtain **synthetic** native inadmissibility/terminal evidence, retire old token, open B, then deliver the old packet and reject it. It is not evidence of real vendor behavior. A separate test denies a new authorization attempted by old A's source after identical B is fully open.

Actual PostgreSQL row locks, uniqueness, permissions, independent connections and one-shot spend were exercised; account responses, native clocks, order status and external ACL were synthetic. Actual signed adapter functions, the API binding helper, tracked-close helper and Partner forwarding sink were executed against synthetic response transports and real disposable RPCs. MEXC's real bridge code was tested as DENY, not as a positive native account-binding proof.

Additional groups cover lost claim/spend acknowledgements, restart/reconstructed caller before/after POST, lost exchange response, UNKNOWN, retry, duplicate forwarding, source replay, wrong native account, changed signed symbol/deadline, quantity/entry/side/ID mismatch, reconciliation/manual/native SL-TP races, missing original source, direct/legacy/batch entry/Close denial, retained protection and revision-CAS flat reconciliation. No mathematical SHA collision proof or live-exchange lifecycle proof is implied by these tests.

The negative external-writer models produce **1001 unsafe outcomes for each venue** without the enforced boundary. They are intentionally retained separate from the positive count. A local mutex, alias, fresh read or SQL row lock cannot exclude such an external B.

### Relevant existing regression

Final candidate validation window: `2026-10-03T09:43:14.841Z` to `2026-10-03T09:48:50.144Z`. The explicit 19-file offline inventory ran: **957 total, 890 PASS, 67 FAIL, 0 skipped/cancelled**. This is FAIL, not release acceptance.

Failures are recorded without deleting or changing expectations:

- 64 in `futures-real-execution-fault-test.mjs`: existing extraction/fixture closures lack the new `exclusiveNativeSubmit` dependency; some dependent assertions fail downstream because those mocked operations do not occur.
- 1 file-level failure in `futures-gate-mexc-fault-test.mjs`: the same missing extracted helper prevents the old fixture suite from completing. Unexecuted downstream cases are not counted as proven.
- 1 in `futures-profit-protection-safe-idle-test.mjs`: old byte-frozen execution/Partner scope is intentionally no longer identical to this new authority implementation.
- 1 in `futures-profit-protection-test.mjs`: the closed Phase3B parity inventory rejects this newly requested architecture.
- The separate old `futures-profit-protection-scope-test.mjs --types` gate also FAILS on the new inventory. It was not weakened or bypassed.

The two formerly failing actual VERIFY_ONLY native-adapter denial tests were repaired in implementation, not by changing their assertions, and pass in the final run. A first iteration emitted a missing VM fixture dependency during proof development; it was fixed and the complete final proof rerun. Old partial results were not promoted to acceptance.

Independent clean-base comparison uses `tmp/pp-exclusive-baseline-20261003` at the same C commit. Windows checkout CRLF initially produced a byte-comparison failure; both disposable checkouts were mechanically normalized to tracked LF bytes without Git tree changes. A subsequent parallel baseline run had a 5-second legacy Worker child timeout (956/957); its separate historical scope command passed. The unchanged 52-test PP file rerun alone passed 52/52, including that Worker bootstrap case. A complete serial baseline attempt then exceeded the harness's 240-second process bound and returned ETIMEDOUT without a final aggregate. That attempt is incomplete, not PASS. All these artifacts remain separate; no inherited source failure is silently blamed for the candidate's 67 failures.

Final local evidence files (generated artifacts are retained locally, not published):

```text
output/exclusive-writer-proof.json
SHA256 038c0f34706d2d2cfbe909424fece4f3446ccbccd3fdf8f849eecaa3577e5089
output/exclusive-writer-validation-source-final/result.json
SHA256 1532b9d0885fea119441e32687984cffc262f68cb3bb17a19d26ef23b259eec2
baseline output/exclusive-writer-validation-final-lf/result.json
baseline output/exclusive-baseline-final-serial/result.json
```

### Syntax, scope, build and TypeScript

- Syntax: 9/9 JS/TS checks PASS; `git diff --check` PASS.
- New independent scope proof: PASS. 405 existing copytrade functions unchanged; only the three native signed transport functions and early legacy Close changed, plus one new helper. All 27 other MEXC native functions remain byte-identical after LF normalization.
- Old pre-existing five-line MEXC working-copy edit remains in the original checkout and was not reapplied/removed. Its previous source-contract failure was not resolved by weakening assertions.
- Web build, Admin build, Partner bundle and 14/14 API bundles: PASS.
- Frontend TypeScript diagnostics: 71 baseline, 71 candidate, zero introduced diagnostics.
- API/Partner TypeScript: 33 baseline, 33 candidate. The raw textual comparator reports one added and one removed TS2345 diagnostic for the **unchanged** Spot cancel call: base line4045 rejects DELETE against `POST | GET`, candidate line4112 rejects DELETE against `GET | POST`. These are the same union/type error with formatting order/line shift, not a new Spot or PP typing defect. Both raw diagnostics are preserved; no Spot code or TypeScript gate was edited to hide them. TypeScript is not globally clean.
- Pure PP policy, enrollment, lifecycle, Decision Engine, Risk, scanner, Prediction, stablecoin, UI and Worker/workflow source remain unchanged against C. Shared signing Gate Spot passthrough is preserved. This is source/build evidence, not a live Spot regression certification.
- Official CI: NOT_RUN. No GitHub CI dispatch or application push occurred.

## Remaining issues and rollout decision

1. **Hard external prerequisite:** no verified technical exclusion of all UI/master/other-key/process/app/account writers exists in the evidence available here. This cannot be manufactured with a database `VERIFIED` flag. Real account configuration/custody/master controls require a separately authorized account/operator boundary.
2. **Native evidence gap:** no certified trusted collector/registrar binds all original trade aliases to authenticated native entry fills and proves terminal state/gap recovery, native clock bounds and complete in-flight protection/control quiescence on a real account. No application role is allowed to fabricate that proof or release HOLD. This prototype is not operationally complete without it.
3. **MEXC:** the installed API's configured key-to-self account/subaccount binding remains unresolved; real adapter submission is DENY. Numeric/native positionId non-reuse was not assumed.
4. **Regression acceptance:** the old extraction fixtures and closed historical release contract do not validate this architecture. Their 67 failures and separate scope failure remain blockers. A new isolated fixture integration/review must preserve every substantive original assertion; this task did not simply change old hashes/expectations to make them green.
5. **Availability:** untracked emergency/unwind/legacy ordinary closes now fail closed. Although native protection payload/policy is untouched, this is a consequential execution-availability limit. Do not deploy the candidate as a healthy existing execution replacement.

The conditional mechanism is clear: B cannot enter while the one durable slot still holds an old operation; it can enter only after the exact old signed bytes are inadmissible and all relevant native effects are conclusively terminal. A retired source also cannot obtain a new authority against B. **That mechanism becomes a real guarantee only with the independently enforced external writer boundary and a complete certified native terminal barrier. Neither is proven for Production here.**

No rollout is prepared/authorized. Keep the candidate isolated, preserve uncertain durable holds, and do not activate it in Real or Demo.

## Git and Production safety

Primary and original PP worktrees, private/untracked work and the pre-existing MEXC prototype were preserved. Original PP hashes rechecked unchanged:

```text
api/copytrade.ts
5fcd84689c95f6db1def3dac884ce56fd6c8891d1dc60418aa8ca6ab50996125
api/_shared/futures-native-exit-ownership.ts
10d62b4b04bb6f7e16aadffa0dfb963488d7bc75da579d24d9e52d531fa865c4
migrations/futures_native_exit_authority_candidate.sql
cbdac629890fcb5d3a567b160946b62c17da9b3858c4da7e15f5c521516d5ebe
```

Only this sanitized report is eligible for AI-Log/master publication. No source, database dump, credentials, private native account data or generated test artifact is published.

## Final requested fields

```text
PHASE=PP-BINANCE-NATIVE-FENCE-THEN-EXCLUSIVE-WRITER
FINAL_SOLUTION=EXCLUSIVE_WRITER_LOCAL_CANDIDATE; LIVE_GUARANTEE_BLOCKED
BINANCE_NATIVE_FENCE=NO_USABLE_DOCUMENTED_A_LIFETIME_FENCE_FOUND
BINANCE_NATIVE_FENCE_PROVEN=NO
IF_NATIVE_FENCE_FAILED=EXCLUSIVE_WRITER_PATH_IMPLEMENTED_AND_TESTED_LOCALLY
EXCLUSIVE_WRITER_IMPLEMENTED=LOCAL_CANDIDATE_YES; PRODUCTION_NO
EXCLUSIVE_WRITER_PROVEN=CONDITIONAL_LOCAL_MODEL_ONLY; LIVE_NO
SHARED_AUTHORITY=ONE_PUBLIC_NATIVE_SLOT_ROW_LOCAL
SINGLE_EXECUTOR=ONE_DURABLE_SPEND_PLUS_EXACT_BYTE_SINK_LOCAL
SINGLE_CLOSE_OWNER=ONE_OPERATIVE_NATIVE_OWNER_LOCAL
SINGLE_ENTRY_AUTHORITY=SAME_NATIVE_SLOT_LOCAL
CANONICAL_PARTNER_CONCURRENCY=3003_ACTUAL_DISPOSABLE_PG_RACES
DOUBLE_AUTHORIZATION=0_IN_CONDITIONAL_SUITE
DOUBLE_EXECUTOR=0_IN_CONDITIONAL_SUITE
DOUBLE_CLOSE=0_IN_CONDITIONAL_SUITE
TWO_OWNERS=0_IN_CONDITIONAL_SUITE
A_TO_B_TEST_BINANCE=1001_CONDITIONAL_MODELS
A_TO_B_TEST_MEXC=1001_CONDITIONAL_MODELS; REAL_BINDING_DENY
A_TO_B_TEST_GATE=1001_CONDITIONAL_MODELS
STALE_A_ON_B=0_CONDITIONAL; UNCONTROLLED_EXTERNAL_MODEL_1001_PER_VENUE
IDENTITY_MISMATCH=DENY_TESTED; LIVE_BINDING_NOT_CERTIFIED
RESTART_SAFETY=LOCAL_DURABLE_HOLD_PASS
UNKNOWN_POST_SAFETY=LOCAL_DURABLE_HOLD_PASS
RETRY_SAFETY=LOCAL_ONE_SHOT_PASS
REOPEN_SAFETY=CONDITIONAL_BARRIER_PASS; LIVE_BARRIER_NOT_CERTIFIED
EXTERNAL_WRITER_CONTROL=NOT_INSTALLED_OR_PROVEN
ACCOUNT_BOUNDARY_PROVEN=NO
DIRECT_EXECUTOR_BYPASS=ORDINARY_NATIVE_LOCAL_DENY_PROVEN
ENTRY_BYPASS=ORDINARY_NATIVE_LOCAL_DENY_PROVEN
CLOSE_BYPASS=ORDINARY_NATIVE_LOCAL_DENY_PROVEN
SL_UNCHANGED=POLICY_AND_PAYLOAD_YES
ONE_TP_UNCHANGED=YES
STRATEGY_UNCHANGED=YES
DECISION_ENGINE_UNCHANGED=YES
TESTS=43_PROOF_GROUPS_PASS; LEGACY_REGRESSION_890_PASS_67_FAIL
BUILD=WEB_ADMIN_PARTNER_AND_14_API_PASS
CI=NOT_RUN
EXACT_FILES_CHANGED=10_LOCAL_PATHS_LISTED_ABOVE_PLUS_REPORT_HANDOFF
EXACT_TABLES_CHANGED=LOCAL_public.futures_native_write_authority_ONLY
EXACT_RPCS_CHANGED=5_LOCAL_RPCS_LISTED_ABOVE; PRODUCTION_NONE
APPLICATION_COMMIT=NONE
PUSH=NO_APPLICATION_PUSH; REPORT_ONLY_AI_LOG_PUBLICATION_SEPARATE
DEPLOYMENT=NO
PRODUCTION_WORKER_STARTED=NO
REAL_PP=NOT_CHANGED
DEMO_PP=NOT_CHANGED
REAL_EXCHANGE_CALLS=0
REAL_CLOSE_ACTIONS=0
PRODUCTION_MUTATIONS=0
FINAL_CLASSIFICATION=BLOCKED_NOT_PROVEN
```
