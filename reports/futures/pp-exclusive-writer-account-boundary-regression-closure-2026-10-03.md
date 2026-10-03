# PP exclusive writer: real-account boundary and regression closure

## Metadata

- Date: 2026-10-03 UTC.
- Phase: PP-EXCLUSIVE-WRITER-REAL-ACCOUNT-BOUNDARY-AND-REGRESSION-CLOSURE.
- Mode: source inspection, official documentation, isolated negative controls and named offline regression. No Production operation.
- Application repository: SignalVerse-Main.
- Primary HEAD, before/after: `0dbca62357a4adf34240f40ceda3e387356ec4b0`.
- Existing isolated prototype: `tmp/pp-exclusive-writer-20261003`, branch `codex/pp-exclusive-writer-20261003`, HEAD/base `e1fdc45f29b350670e707de3a7afa10b9153d689`.
- Application commit created in this request: NONE. The previous prototype remains uncommitted and is not a release identity.
- Final classification: `BLOCKED_EXTERNAL_ACCOUNT_BOUNDARY_AND_LOCAL_GATES`.

## Executive result

**No deployable or fully enforced safety solution was proved.** The external prerequisite is now concrete: SignalVerse's current customer-supplied-key connection does not control the native account's other API keys, UI access, master/designated-trader privileges, or other processes holding a trading credential. A local SQL `VERIFIED` flag cannot supply that control. A dedicated, technically controlled native-account/credential-custody boundary must be provisioned and evidenced outside this source-only phase before an exclusive-writer guarantee can be certified.

This is the task's permitted external-prerequisite stop, **not** completion of the implementation/regression gates. No blanket impossibility claim is made about every possible exchange/custodial arrangement. No claim is made that the current account is exclusive, that all 67 old failures were fixed, that the requested 5,000+ case thresholds were met, or that CI passed.

Fresh negative controls also prove a local release blocker: three native conditional-protection submission paths forward through the actual candidate helper and Partner sink without consulting native-account verification, position verification or the shared authority. These orders can affect a slot asynchronously. Merely gating immediate market entry/close therefore cannot establish the requested all-outstanding-writes terminal barrier.

The full named regression was rerun: **957 tests, 889 PASS, 68 FAIL, zero skipped/cancelled/todo**. The additional timeout passed when isolated; the 67 original failures remain. All ten previous prototype source/test hashes remain unchanged. No application repair was made in this request.

## Objective and scope

Determine whether the existing exclusive-writer prototype can satisfy the real account boundary, common ENTRY/CLOSE authority, all-write quarantine, terminal barrier, Canonical/Partner concurrency, regression and CI requirements for Binance, MEXC and Gate. Stop without Production mutation when a final external prerequisite is established.

Preserved: pure PP policy, ONE TP, SL, automatic enrollment, Strategy, Decision Engine, scanner, Spot, legacy tests/assertions, historical reports, previous prototype and unrelated parallel work. No credential file, live exchange account, Production DB, VPS, Guard or deployment path was accessed. No safe dedicated boundary-test account was provisioned or demonstrated in the available audit evidence; no two-key exchange order test was performed.

## Actions taken and evidence timestamps

1. Read the complete current owner task, repository instructions, prior exclusive-writer report and existing candidate evidence.
2. Inspected current connection/custody and shared-vs-owned database source; traced immediate native submit, tracked close, original-entry association, Partner forwarding, quarantine and local terminal RPCs.
3. Inspected Binance's current official account/key/subaccount capabilities and native order contract; checked MEXC's current account endpoint documentation and Gate's native account/position/order contract. Documentation was read on 2026-10-03; this is not live-account configuration verification.
4. Added one **diagnostic-only** negative-control file outside the application candidate; executed actual candidate helper and Partner forwarding sink with synthetic ports. Run: `2026-10-03T10:45:52.109Z` to `2026-10-03T10:45:52.125Z`.
5. Reran the full explicit 19-file regression inventory with Node `v22.23.3`: `2026-10-03T10:44:45.302Z` to `2026-10-03T10:47:21.433Z`.
6. Ran isolated existing PP and safe-idle suites without editing assertions. Rechecked independent localized scope. Recomputed all ten prior candidate hashes and fresh evidence hashes.
7. Recorded the external stop and remaining local blockers. Prepared this sanitized report and an additive HANDOFF entry. Only this report is eligible for the standing AI-Log publication requirement, not application source publication.

## Confirmed external prerequisite: native account control

### Actual SignalVerse boundary

`api/copytrade.ts:18556` onward accepts an existing user API key/secret, verifies the connection using a native account read and upserts an encrypted connection in `real_accounts`. It does **not** provision a dedicated native subaccount, revoke alternative keys, prohibit native UI/switch login, or constrain the native account administrator's ability to create another writer.

Partner `server/partner-copytrade/database.mjs:37` onward binds provided credentials to an owned account. Its credential fingerprint distinguishes supplied credentials, not every credential that the native exchange may authorize for the same account. Different native keys can map to the same Futures slot. A credential fingerprint is not an exchange account identifier and not an exclusion policy.

This is a confirmed source limitation, not evidence that a particular user actually used another key or traded manually. No private account inventory was read.

### Binance capability answers

Binance documents virtual-email subaccounts as API-operated and without direct virtual-email login, but also documents master-managed API access, multiple subaccount keys and switch-login management. This supports technical account segregation, not automatic one-writer enforcement. [Official subaccount FAQ](https://www.binance.com/en/support/faq/detail/360020632811).

| Question | Evidence-based answer for this task |
| --- | --- |
| Restrict key trading permissions/IP access? | Available per-key controls exist. They are not a native per-slot common authorization gate. No actual account policy was verified. |
| Isolate separate subaccounts? | Native segregation is available. Different keys **inside the same** subaccount are not thereby separate positions. |
| Only SignalVerse has write authority? | NOT_PROVEN for existing BYOK connections; requires controlled provisioning and credential/admin custody. |
| Exclude manual UI? | API-only virtual-email setup is a useful component. Ordinary customer UI/master/switch access was not proved disabled or technically inaccessible here. |
| Could another authorized trading key/application affect this account's slot? | The account model supports multiple keys; no documented per-application slot quarantine was found. No real two-key experiment was run. |
| Dedicated exclusively to SignalVerse? | A separately provisioned account can be dedicated operationally. Its actual technical exclusion, administrator permissions and key custody remain an external prerequisite. |
| Force all internal SignalVerse writers through one gate? | Locally implementable, but current prototype does not yet cover protection/control writes. |

Managed subaccounts separate investor asset control from designated-trader API access. The designated trader can manage multiple keys; the product alone is not the requested single-writer proof. Eligibility and configuration must be established by the operator/exchange. [Official managed-subaccount documentation](https://www.binance.com/en/support/faq/detail/0594748722704383a7c369046e489459).

The institutional account API exposes master-controlled key creation, permission changes, deletion and IP controls. These capabilities would need to be constrained by a verifiable custody/access boundary; SignalVerse's current BYOK flow does not invoke that provisioning model. [Official institutional account API](https://developers.binance.com/en/docs/catalog/vip-and-institutional-caas/api/rest-api/account).

The inspected USD-M order contract still provides ordinary slot-targeting fields, not a documented compare-and-close predicate binding an order to an old position lifetime. Admission timestamp/receive-window checks do not prove that an accepted order has finished executing. `BINANCE_NATIVE_FENCE=NO_USABLE_DOCUMENTED_FENCE_FOUND`, not a universal claim about undisclosed exchange products. [Official USD-M trade contract](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade).

### Strongest candidate operating boundary — required, not installed/proven

A dedicated API-only native account/subaccount, a controlled master/designated-trader administration boundary, no independently usable trading credentials or UI access outside that boundary, and one non-exported trading credential used only by the authorized executor. Native key restrictions, host/process access and network egress must be evidenced, not promised. Administrative/break-glass operations must stop admission and retain quarantine until outstanding writes are terminal; arbitrary administrator/root override cannot silently be included in the guarantee.

Both Canonical and Partner would then require the same durable native slot for **every** entry, immediate close, protection submission/amendment/cancellation and other slot-affecting operation. All outstanding request identities and conditional orders must be collected and reconciled before releasing the slot. Flat alone, lease expiry, API-key uniqueness in SignalVerse, or one successful account read does not establish this boundary.

**External prerequisite to continue:** the operator must provide or authorize a safe dedicated account arrangement with verifiable native account/product/mode binding, complete trading-key and UI/admin access policy, custody of all write/admin credentials, and an authorized scope for configuration/evidence collection. Do not send secrets in a report or chat. Do not move existing assets/positions, revoke current protection, or alter an existing real account as an implicit workaround.

Until this exists, more local race iterations cannot prove exclusion of an exchange writer that never calls SignalVerse's database. This requirement is outside the current no-exchange/Production-change boundary. It is **not** a request to change the current account in this task.

## MEXC and Gate: separate conclusions

### MEXC

The installed adapter uses `contract.mexc.com` private position/order APIs and explicit `positionId` on the close payload. Exact lifecycle non-reuse and configured-key-to-authenticated-native-account binding remain unproved. The candidate's real binding adapter denies rather than inventing a UID. Asset/currency balances and leverage references to an account UID are not an authenticated self-UID response.

Current asset documentation does not supply that binding; the market-maker STP group endpoints are not a demonstrated general-purpose self-account identity for the configured key. A switch to the newer API base was **not** implemented or assumed compatible. [MEXC current account assets](https://www.mexc.com/api-docs/futures/account-and-trading-endpoints/get-all-account-assets), [fee details](https://www.mexc.com/api-docs/futures/account-and-trading-endpoints/get-fee-details), [STP group/member endpoint](https://www.mexc.com/api-docs/futures/account-and-trading-endpoints/query-stp-groups-and-group-members).

No existing MEXC contract/assertion was weakened. No real `positionId` reuse was assumed. The same external-writer boundary and all-write terminal barrier would be required if a usable native lifecycle fence cannot be proved.

### Gate

Native account metadata and position `pid`/`open_time`/`update_id` are available concepts in the inspected API. Their presence is not a documented permanent generation/non-reuse fence for the current size/reduce-only close. The candidate does not convert `open_time` into an invented perpetual generation. Native order expiry is an admission bound, not proof that all conditional/accepted requests are terminal. [Gate Futures API](https://www.gate.com/docs/developers/apiv4/en/futures/).

Actual dedicated account/key custody and no-external-writer configuration remain unverified. Gate conditional `price_orders` is one of the reproduced internal coverage gaps below.

## Existing candidate flow and database authority

Source flow for immediate submissions:

```text
Canonical native signer OR Partner service
  -> exclusiveNativeSubmit
  -> executeExclusiveNativeWrite
  -> resolve actual native account + current basis
  -> public.futures_native_write_claim
  -> same shared native slot enters HOLD
  -> second native state validation
  -> public.futures_native_write_spend (one shot)
  -> fixed native wire submit
  -> public.futures_native_write_unknown / durable HOLD
  -> trusted terminal collector [NOT CERTIFIED / NOT WIRED]
  -> terminal / reconcile_flat
  -> original source/token retirement
  -> only then possible new ENTRY
```

Tracked PP close uses `executeTrackedFullClose` and `withNativeCloseBasis` to carry the original source association; policy approval is not the shared execution spend. Partner service passes `this.registry.shared` as `nativeWriteDatabase`, rather than its owned/cloned financial namespace. Partner's ordinary native forwarding additionally demands the matching one-shot ticket. That ticket is a process-local final forwarding check, not a replacement for durable SQL authorization.

The existing isolated migration defines **one local candidate table**, not deployed:

```text
public.futures_native_write_authority
```

Five candidate RPCs, unchanged in this request:

```text
public.futures_native_write_claim
public.futures_native_write_spend
public.futures_native_write_unknown
public.futures_native_write_terminal
public.futures_native_write_reconcile_flat
```

Static SQL evidence: native slot uniqueness includes venue/account/product/settlement/mode/symbol; row/advisory locking serializes claim; one-shot spend checks token/owner/payload; retired-token history rejects old reuse; HOLD is not a time-expiring lease; RLS and restrictive grants separate application spend from trusted terminal reconciliation. The candidate creates a `NOLOGIN NOINHERIT` reconciliation role. These are candidate properties, not freshly verified Production role/catalog permissions.

Prior disposable PostgreSQL 18.6 evidence: 43 groups passed at `2026-10-03T09:49:16.982Z`–`09:51:29.434Z`, including 1,001 independent-connection races and 1,001 delayed-A cases per venue under synthetic exclusive ACL/native-terminal receipts. No Production schema was migrated. The trusted real registrar, entry-source association collector and complete native terminal/quiescence collector are still missing; current SQL cannot independently authenticate a JSON evidence reference. Actual Production grants/BYPASSRLS posture was not inspected here. Therefore `REAL_DURABLE_AUTHORITY=NOT_CERTIFIED`.

The requested **5,000+ mixed PostgreSQL races and 5,000+ A-to-B cases per venue were not run/met**. Prior conditional zeros must not be promoted to live or all-path guarantees.

## Native writer coverage and confirmed bypasses

Repository host/path searches covered API, server, scripts, ops and workflows; execution routes were traced in `api/copytrade.ts` and `server/partner-copytrade/network.mjs`. Diagnostic/legacy scripts with native endpoint literals were not indiscriminately executed. The repository safe-test rule forbids treating an empty shell as sufficient protection against scripts loading Production env files. Search coverage is not a claim that every historical script was behaviorally certified.

| Native operation | Candidate ordinary gate | Quarantine/terminal coverage | Evidence |
| --- | --- | --- | --- |
| Binance immediate `/fapi/v1/order` ENTRY/CLOSE | Shared claim/spend required | Conditional local only | Native signer, `openBinanceTrade`, tracked `closeBinanceTrade`, Partner immediate sink |
| MEXC immediate `/private/order/submit` | Shared gate; real native-account binding currently DENY | Conditional local only | Native MEXC signer and tracked full close |
| Gate immediate `/futures/usdt/orders` | Shared claim/spend required | Conditional local only | Gate signer and tracked full close |
| Binance `/fapi/v1/algoOrder` protection | **No shared authority check** | **FAIL** | Actual helper + Partner sink negative control |
| MEXC `/private/planorder/place` protection | **No shared authority check** | **FAIL** | Actual helper + Partner sink negative control |
| Gate `/futures/usdt/price_orders` protection | **No shared authority check** | **FAIL** | Actual helper + Partner sink negative control |
| Native cancellation/leverage/margin/control writes | Classified outside ordinary gate | Not proved in common outstanding-write barrier | Source inspection; no native execution |
| Binance protection-failure unwind before trade persistence | Ordinary close requires original tracked basis, but call lacks it | Candidate availability regression | `api/copytrade.ts:8872` calls `closeBinanceTrade` without a tracked context |
| Tracked manual/emergency/reconciliation closes | Converge on ordinary signer; several carry context | Full preservation not accepted while fault suite fails | `api/copytrade.ts:9141`, `10325`, `18998` |

The unprotected-entry unwind must eventually reuse the durable ENTRY lifecycle/original fill association while preserving the existing protection-failure contract. Inventing a tracked trade before persistence or permitting an unowned emergency bypass would not be a safe fix. No such fix was made.

### Actual-code negative controls

New file: `tmp/pp-exclusive-account-boundary-20261003/counterexamples.mjs`.

It imports the actual candidate `executeExclusiveNativeWrite`, `classifyNativeWrite` and `ownedFetch`; global real fetch throws. All account/position/RPC ports throw if consulted. The final transport is synthetic. No API bootstrap, credential loading, database or exchange call is performed.

| Venue | Tested protection path | Synthetic forwards | Account reads | Position reads | Authority calls |
| --- | --- | ---: | ---: | ---: | ---: |
| Binance | `/fapi/v1/algoOrder`, STOP_MARKET, closePosition | 1 | 0 | 0 | 0 |
| MEXC | `/api/v1/private/planorder/place`, close side | 1 | 0 | 0 | 0 |
| Gate | `/futures/usdt/price_orders`, reduce-only initial order | 1 | 0 | 0 | 0 |

All three reproduce `QUARANTINE_NOT_CONSULTED`. Diagnostic assertions passed; **safety result is FAIL**, not three safe trading tests. This proves application forwarding coverage is incomplete even if an authority read would deny or be unavailable. It does not claim native exchange acceptance/fill or an actual live stale-position loss.

## Tests executed and full regression disposition

Commands below ran only in the isolated candidate/diagnostic directory, with the existing local Node 22 runtime. No wildcard discovery of unsafe scripts was used.

```text
node --experimental-strip-types tmp/pp-exclusive-account-boundary-20261003/counterexamples.mjs

PP_VALIDATION_OUTPUT=output/exclusive-writer-account-boundary-20261003
PP_TEST_CONCURRENCY=2
node scripts/futures-exclusive-writer-validation.mjs --regression-only

node --test --test-concurrency=1 scripts/futures-profit-protection-test.mjs
node --test --test-concurrency=1 scripts/futures-profit-protection-safe-idle-test.mjs
node scripts/futures-exclusive-writer-scope-test.mjs
```

| Check | Actual result | Acceptance |
| --- | --- | --- |
| Actual helper + Partner sink negative controls | 3/3 counterexamples reproduced, exit 0, no real IO | **Safety FAIL** |
| Named complete 19-file regression | 957 total; 889 PASS; 68 FAIL; skipped/cancelled/todo 0; exit 1 | **FAIL** |
| Isolated unchanged PP test | 52 total; 51 PASS; 1 historical parity failure; exit 1 | **FAIL** |
| Isolated unchanged safe-idle test | 33 total; 32 PASS; 1 frozen-byte contract failure; exit 1; 166,760.3621 ms | **FAIL** |
| Parallel timeout isolation | `transport/database fails closed projection` passed isolated, 7,333.3221 ms | Environment-sensitive failure, not erased from aggregate |
| Independent localized candidate scope | PASS; 405 unaffected functions, 27 other MEXC native functions unchanged; no historical test edits | Not the official release-scope acceptance |
| Requested expanded 5,000+ PG/race/ABA proofs | NOT_RUN | **NOT_MET** |
| Official CI | NOT_RUN | **NOT_ACCEPTED** |

### Every fresh failure is accounted for

The following identifiers refer to the fresh full regression TAP log. Grouping is a failure inventory, not a waiver. All 68 failures remain in the 889/68 aggregate. No test was deleted/skipped or assertion/allowlist changed.

| TAP IDs | Count | Classification/evidence | Disposition |
| --- | ---: | --- | --- |
| 2 | 1 | Gate/MEXC extracted fixture stops at new `exclusiveNativeSubmit` dependency; file-level failure | Introduced test-integration blocker; underlying cases not proved; NOT_FIXED |
| 107 | 1 | Existing safe-idle frozen-byte assertion rejects changed `futures-profit-protection-execution.ts` | Contract mismatch with candidate; NOT_FIXED, not exempted as baseline |
| 133 | 1 | Child `spawnSync ... ETIMEDOUT`; this exact projection case passed unchanged in isolated safe-idle run | Test-environment-sensitive; aggregate remains FAIL; no timeout/assertion weakening |
| 191 | 1 | Closed Phase3B parity rejects candidate `api/copytrade.ts` | Contract mismatch; NOT_FIXED, no automatic allowlist expansion |
| 264, 265, 266, 267, 271, 283, 284, 285, 286, 289, 290, 295, 333, 334, 335, 336, 348 | 17 | Direct `exclusiveNativeSubmit is not defined` in extracted Binance execution/handler fixtures | Introduced dependency/test-integration failure; NOT_FIXED |
| 263, 268, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 287, 291, 292, 293, 294, 296, 297, 298, 299, 300, 301, 302, 303, 304, 326, 327, 339, 340, 341, 342, 343, 344, 347, 349, 350, 351, 352, 355, 356, 357, 358, 359, 361, 362 | 47 | Binance fault/handler assertions fail downstream of the incomplete extraction integration (including null fee/status, failed side-effect counts, protection/re-analysis/UNKNOWN/unwind expectations) | Regression/test-integration UNRESOLVED; not all exonerated as fixtures; NOT_FIXED |

The 17+47 rows cover all 64 failing Binance cases. Source inspection independently confirms at least the unwind availability regression; a harness dependency repair alone would not establish preservation of emergency/protection behavior. The previous 67 failures were therefore **not** dismissed as harmless legacy failures. No complete clean-baseline pass was proved: previous full baseline had a child timeout; the unchanged isolated PP baseline passed 52/52, but that is not full-suite acceptance.

The official historical scope contract was already FAIL in the prior validation. It has not been re-approved or widened. Localized AST scope PASS cannot override it. A behavior-preserving integration repair and explicit resolution of the frozen release-contract scope remain required before CI.

## Build and TypeScript evidence — prior, source-identical, not a new run

The preserved `output/exclusive-writer-validation-source-final/result.json` records `2026-10-03T09:43:14.841Z`–`09:48:50.144Z`:

- Web build PASS, Admin build PASS, Partner build PASS, 14 required API bundles PASS.
- Frontend diagnostics 71 before/71 after, no introduced diagnostics.
- API+Partner 33 before/33 after. Raw comparison contains one added/one removed TS2345 diagnostic: unchanged Spot DELETE call moved from line 4045 to 4112 and union spelling reordered. It is not a demonstrated new semantic typing regression; no Spot change was made to suppress it.
- Prior syntax checks 9/9 PASS.

All ten candidate implementation/test file hashes were rechecked unchanged in this request. These builds are retained evidence for that unchanged source, not a freshly run complete release gate. Regression and official scope still fail; CI was not run and no candidate was committed/pushed.

## Exact source integrity

Hashes are SHA-256 of the actual isolated source bytes, unchanged from the previous phase:

| Candidate file | SHA-256 |
| --- | --- |
| `api/copytrade.ts` | `1d98350508cd27f7dd4691077424311ac7d10517916f8ff9220994688237296d` |
| `api/_shared/futures-profit-protection-execution.ts` | `1855d540ad88f2eb3d507f69fab9c710f13726a1db506aecb58a6561cd53c386` |
| `api/_shared/partner-copytrade-context.ts` | `a4fa750fa2f1d83f7a5dc2e25035b3ef45bdbeb1d3d05bf5f474884fd5120d5a` |
| `server/partner-copytrade/service.ts` | `3940cd787193e69de21e258cb7d2e89d8f03ebaba93c0fdcca225f9eb19291a1` |
| `server/partner-copytrade/network.mjs` | `8030b23e27e890d8c8f78de28111617b0d5f7dd4f637a71973f481c4d71d1a82` |
| `api/_shared/futures-exclusive-writer.ts` | `ce7a5e8d7041c44a7ef03d516ad35afb9ce27c1a13a97de3ba74aa26a06560f6` |
| `migrations/futures_exclusive_writer_candidate.sql` | `a6cd5a283c4f7dc482372b9e192f46a3af734e6bad5dc420f6d1d9acd88558eb` |
| `scripts/futures-exclusive-writer-proof.mjs` | `56eb7b8c10cde48e227fce29561799aa094f5fa81e9b6125e2dd7f34ae37d0d9` |
| `scripts/futures-exclusive-writer-validation.mjs` | `2b44f17a121c5906ff08955c29becc47d6e4e3d970d88738fa3abf67b726a0b2` |
| `scripts/futures-exclusive-writer-scope-test.mjs` | `1e15cc1394fe37496d02abc2d64490cebeb0e7f1bf8c633356ad9a32d90f5811` |

Fresh local evidence:

| File | SHA-256 |
| --- | --- |
| `tmp/pp-exclusive-account-boundary-20261003/counterexamples.mjs` | `0ef62ebbaaf5b4637c07f9c11d649d5aff8571371512588b3a33c8642886bfca` |
| `tmp/pp-exclusive-writer-20261003/output/exclusive-writer-account-boundary-20261003/result.json` | `f197ed5f5a94584d59ae6415aea94dac97d35608ae81a4508ec03b927c288ab6` |
| Same output directory, `offline-regression.log` | `9c55b76ebea7a10b3ac8236289ff365d271c978d060176c3e4663812308e9a9e` |

## Exact inspected/changed files

Relevant source and evidence inspected:

```text
AGENTS.md
CLAUDE.md
HANDOFF.md
docs/AI_HANDOFF.md
docs/COLLEAGUE_HANDOFF_2026-09-29.md
TRADING_STRATEGY.md
docs/testing/stability-test-runbook.md
reports/futures/pp-binance-native-fence-exclusive-writer-2026-10-03.md

tmp/pp-exclusive-writer-20261003/api/copytrade.ts
tmp/pp-exclusive-writer-20261003/api/_shared/futures-exclusive-writer.ts
tmp/pp-exclusive-writer-20261003/api/_shared/futures-profit-protection-execution.ts
tmp/pp-exclusive-writer-20261003/api/_shared/partner-copytrade-context.ts
tmp/pp-exclusive-writer-20261003/server/partner-copytrade/service.ts
tmp/pp-exclusive-writer-20261003/server/partner-copytrade/network.mjs
tmp/pp-exclusive-writer-20261003/server/partner-copytrade/database.mjs
tmp/pp-exclusive-writer-20261003/migrations/futures_exclusive_writer_candidate.sql
tmp/pp-exclusive-writer-20261003/scripts/futures-exclusive-writer-proof.mjs
tmp/pp-exclusive-writer-20261003/scripts/futures-exclusive-writer-validation.mjs
tmp/pp-exclusive-writer-20261003/scripts/futures-exclusive-writer-scope-test.mjs
tmp/pp-exclusive-writer-20261003/scripts/futures-profit-protection-scope-test.mjs
tmp/pp-exclusive-writer-20261003/scripts/futures-profit-protection-test.mjs
tmp/pp-exclusive-writer-20261003/scripts/futures-profit-protection-safe-idle-test.mjs
tmp/pp-exclusive-writer-20261003/scripts/futures-real-execution-fault-test.mjs
tmp/pp-exclusive-writer-20261003/scripts/futures-gate-mexc-fault-test.mjs
tmp/pp-exclusive-writer-20261003/.github/workflows/production-ci.yml
tmp/pp-exclusive-writer-20261003/output/exclusive-writer-validation-source-final/result.json
tmp/pp-exclusive-writer-20261003/output/exclusive-writer-account-boundary-20261003/result.json
tmp/pp-exclusive-writer-20261003/output/exclusive-writer-account-boundary-20261003/offline-regression.log
tmp/pp-auto-ai-log-20261002/templates/report-template.md
```

Changes made **in this request**, not the previous prototype:

```text
NEW diagnostic only:
tmp/pp-exclusive-account-boundary-20261003/counterexamples.mjs

NEW sanitized report:
reports/futures/pp-exclusive-writer-account-boundary-regression-closure-2026-10-03.md

ADDITIVE documentation only:
HANDOFF.md

GENERATED local test evidence only:
tmp/pp-exclusive-writer-20261003/output/exclusive-writer-account-boundary-20261003/result.json
tmp/pp-exclusive-writer-20261003/output/exclusive-writer-account-boundary-20261003/offline-regression.log
```

No application/test-assertion/migration change; no table/RPC created or changed in this request; zero Production schema changes. The ten-file previous uncommitted candidate remains preserved, not repaired or published. All unrelated dirty/private/untracked work was preserved.

## Final required fields

```text
FINAL_SOLUTION=NONE_CERTIFIED; EXTERNAL_ACCOUNT_PREREQUISITE_ESTABLISHED
BINANCE_NATIVE_FENCE=NO_USABLE_DOCUMENTED_FENCE_FOUND
EXCLUSIVE_WRITER=EXISTING_CONDITIONAL_LOCAL_PROTOTYPE; NOT_PRODUCTION_SAFE
REAL_ACCOUNT_BOUNDARY=REQUIRES_TECHNICAL_NATIVE_ACCOUNT_AND_CREDENTIAL_CUSTODY_PROVISIONING
SHARED_AUTHORITY=LOCAL_SQL_AND_SHARED_NAMESPACE_ONLY; LIVE_NOT_CERTIFIED
SINGLE_EXECUTOR=ORDINARY_PATH_CONDITIONAL_LOCAL_ONLY; ALL_WRITES_NOT_PROVEN
SINGLE_ENTRY_AUTHORITY=ORDINARY_PATH_LOCAL_ONLY; EXTERNAL_WRITERS_NOT_CONTROLLED
CANONICAL_PARTNER_SAFETY=INCOMPLETE; PROTECTION_PATHS_OUTSIDE_SHARED_GATE

BINANCE_A_TO_B=PRIOR_1001_CONDITIONAL_LOCAL_CASES; LIVE_NOT_PROVEN; 5000_PLUS_NOT_MET
MEXC_A_TO_B=PRIOR_1001_CONDITIONAL_LOCAL_CASES; ACCOUNT_BINDING_NOT_PROVEN; 5000_PLUS_NOT_MET
GATE_A_TO_B=PRIOR_1001_CONDITIONAL_LOCAL_CASES; LIVE_NOT_PROVEN; 5000_PLUS_NOT_MET

DOUBLE_AUTHORIZATION=PRIOR_LOCAL_0_ONLY; GLOBAL_NOT_PROVEN
DOUBLE_EXECUTOR=PRIOR_LOCAL_0_ONLY; GLOBAL_NOT_PROVEN
DOUBLE_CLOSE=PRIOR_LOCAL_0_ONLY; GLOBAL_NOT_PROVEN
TWO_OWNERS=PRIOR_LOCAL_0_ONLY; GLOBAL_NOT_PROVEN
STALE_A_ON_B=PRIOR_CONDITIONAL_LOCAL_0_ONLY; UNCONTROLLED_EXTERNAL_WRITER_CAN_INVALIDATE_BOUNDARY

UNKNOWN_POST=LOCAL_DURABLE_HOLD_ONLY; ALL_NATIVE_OUTSTANDING_WRITES_NOT_PROVEN
RESTART=LOCAL_HOLD_ONLY; LIVE_TERMINAL_COLLECTOR_NOT_CERTIFIED
RETRY=LOCAL_ONE_SHOT_ONLY; COMPLETE_ALL_PATH_CONTRACT_NOT_ACCEPTED
REOPEN=DENIED_BY_ORDINARY_LOCAL_HOLD; GLOBAL_ACCOUNT_EXCLUSION_NOT_PROVEN

DIRECT_BYPASS=3_CONFIRMED_NATIVE_PROTECTION_FORWARDING_COUNTEREXAMPLES; NOT_A_COMPLETE_TOTAL
ENTRY_BYPASS=EXTERNAL_NATIVE_WRITERS_NOT_TECHNICALLY_EXCLUDED
CLOSE_BYPASS=NATIVE_CONDITIONAL_PROTECTION_NOT_FORCED_THROUGH_SHARED_AUTHORITY

REGRESSION=FAIL; 957_TOTAL; 889_PASS; 68_FAIL; 0_SKIPPED
BUILD=PRIOR_UNCHANGED_SOURCE_WEB_ADMIN_PARTNER_14_API_PASS; NOT_FRESH_CI
CI=NOT_RUN

EXACT_FILES_CHANGED=ONE_DIAGNOSTIC; THIS_REPORT; ADDITIVE_HANDOFF; GENERATED_LOCAL_REGRESSION_LOGS
EXACT_TABLES_CHANGED=NONE_THIS_REQUEST; PRODUCTION_NONE
EXACT_RPCS_CHANGED=NONE_THIS_REQUEST; PRODUCTION_NONE

APPLICATION_COMMIT=NONE
PUSH=NO_APPLICATION_PUSH; SEPARATE_REPORT_ONLY_AI_LOG_PUBLICATION
DEPLOYMENT=NO

PRODUCTION_WORKER_STARTED=NO
REAL_EXCHANGE_CALLS=0
REAL_CLOSE_ACTIONS=0
PRODUCTION_MUTATIONS=0_BY_THIS_REQUEST
REAL_PP=NOT_CHANGED; NO_FRESH_LIVE_OBSERVATION
DEMO_PP=NOT_CHANGED; NO_FRESH_LIVE_OBSERVATION
ORDERS_CHANGED=0_BY_THIS_REQUEST
POSITIONS_CHANGED=0_BY_THIS_REQUEST
SL_CHANGES=0_BY_THIS_REQUEST
ONE_TP_CHANGES=0_BY_THIS_REQUEST

FINAL_CLASSIFICATION=BLOCKED_EXTERNAL_ACCOUNT_BOUNDARY_AND_LOCAL_GATES
```

## Why an old Close(A) cannot close a new B — not proved for current real accounts

There is **no final enforced real operating model in this request**, so it would be false to claim that old Close(A) cannot affect B on current accounts. Under the *conditional design*, every writer must enter the same native-account/slot authority, B entry is denied while A's durable owner/request remains unresolved, and the slot is released only after the original request is correlated and terminal, admission of delayed packets is no longer possible, all accepted ordinary/conditional/protection writes are terminal or safely absent, and the exact final native state is established. Retired tokens/source associations then reject old A retries after B. Current customer-controlled external writers can evade the database, and current protection submissions evade the shared gate; consequently that conditional reasoning is not a proved live guarantee.

## Remaining issues and safe next action

External: establish a technically controlled dedicated account/key/admin boundary and authorize a safe evidence collection/provisioning scope. A promise not to trade manually, one exported customer key, an arbitrary DB evidence flag, or hypothetical MEXC/Gate ID non-reuse is insufficient.

Local: implement all-write/quarantine coverage without dropping existing SL/ONE-TP protection or emergency unwind; supply authenticated native account/source/terminal collectors; resolve all 67 original regression failures while preserving assertions/contracts; prove actual DB-role behavior; reach the requested 5,000+ race and per-venue adversarial thresholds; build and pass exact-source official CI. None is waived by this external stop. No candidate should be released while these blockers remain.

## Git/publication and Production safety

Application HEADs/history and all prior prototype hashes remain unchanged. No application commit, source push, main merge, CI, release, Guard, migration, service/Worker start, flag change, exchange request or financial mutation occurred. Production runtime/PID/flags were **not freshly inspected**, so this report asserts zero actions by this task, not knowledge of unrelated simultaneous operator activity.

This sanitized Markdown report alone is published to `signal0verse/SignalVerse-AI-Log/master` under the standing repository reporting instruction, with a `[skip ci]` report-only commit. Publication commit and independent remote byte verification are recorded in the final response/HANDOFF receipt after publication; they are not an application release identity. Raw local logs and diagnostic artifacts are not published.
