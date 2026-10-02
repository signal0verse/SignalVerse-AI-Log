# Futures PP — shared native identity and single Close authority prerequisite stop

## Metadata

- Date: 2026-10-03, Asia/Kuala_Lumpur.
- Phase: PP-SHARED-NATIVE-IDENTITY-SINGLE-CLOSE-AUTHORITY.
- Diagnostic completed: 2026-10-02T21:40:45.144Z.
- Scope: bounded native-identity prerequisite verification; offline actual-reader diagnostics. No repeat broad audit.
- Root HEAD unchanged: 0dbca62357a4adf34240f40ceda3e387356ec4b0.
- Candidate checkout: tmp/futures-pp-auto-enrollment-20261002.
- Candidate HEAD unchanged: e1fdc45f29b350670e707de3a7afa10b9153d689.
- Canonical and Partner source references: e1fdc45f29b350670e707de3a7afa10b9153d689 and 84f27c2e40b02b0dbf61c58429cf7c45f4f852da.
- Final classification: NOT_PROVEN. This is NOT a bridge implementation or successful single-authority acceptance.

## Objective and safety decision

The owner authorized fixing the real Canonical/Partner ownership bridge while preserving policy, automatic enrollment, ONE TP, SL, native adapters and existing architecture. The owner explicitly required stopping if native identity or single authority cannot be proved, and required integrated races only AFTER that proof.

The previous actual-path report is reused, not repeated: [ownership bridge audit](https://github.com/signal0verse/SignalVerse-AI-Log/blob/aa0c4b32ebbf0d2ff1419ab0e53dafb4df551629/reports/futures/pp-real-path-ownership-bridge-audit-2026-10-03.md).

This phase tested the first missing prerequisite directly. Current readers do not deliver a complete account/position-generation identity, and no trustworthy producer of the missing linkage exists in the authorized existing evidence. The first prerequisite therefore remains unproved. No shared-record/gate wiring was implemented on an invented key, no always-DENY implementation was mislabelled a useful working bridge, and no integrated matrix was run.

## Exact focused actions and sources

- Read applicable project entry instructions, latest handoff, complete strategy history and safe-test runbook. No strategy change.
- Read only the already-identified native reader functions, actual tracked-close helper, Partner transport/RPC allowlist, previous local ownership prototype and strict parity helper.
- Consulted official public documentation ONLY; no exchange account/private API call.
- Created a disposable prerequisite diagnostic under tmp/, without importing the API bootstrap or reading credentials/env.
- AST-isolated exact functions from immutable C/P Git blobs and the pre-existing local candidate. Signed GET functions were replaced with synthetic-return callbacks; every callback enforces GET and synthetic key/secret arguments.
- Reproduced the previous MEXC precision behavior and strict contract rejection without changing source, tests, assertions or allowlists.
- Rechecked candidate/source hashes. No SSH, VPS commands, Production database access, migration, Worker operation or flag change occurred in this phase.

### Native fields: confirmed versus unproved

| Venue | Confirmed official fields and current reader evidence | Remaining prerequisite |
| --- | --- | --- |
| Binance | GET /fapi/v3/balance documents accountAlias as a unique account alias. C getBinanceUsdtBalance lines 8338–8343 and P 8336–8341 discard it and return available/equity only. C getBinanceOpenPosition 8351–8366 / P 8349–8364 project qty/entry/side/liquidation from positionRisk. | The documented alias is a potential native account-binding input, NOT a position lifetime ID. Neither reader/enrollment persists a shared account binding plus independently established flat/reopen generation. Native account/lifecycle proof is NOT_PROVEN. |
| MEXC | GET /api/v1/private/position/open_positions documents positionId as Position ID, direction/state and createTime/updateTime. L getMexcOpenPosition 667–686 retains an exact decimal ID but discards state/createTime; C 667–681 lacks the local numeric-precision rejection. | The inspected position endpoint does not document a native account UID. No existing trusted cross-key account proof or position-ID reuse/lifecycle proof was found. This does NOT prove that no MEXC API anywhere exposes account identity; it bounds this inspected source. Complete identity remains NOT_PROVEN. |
| Gate | Position schema documents user, pid (sub-account position ID), open_time and update_id. C getGateOpenPosition 7678–7687 / P 7676–7685 drop those fields and retain size/entry/side only. | Native fields exist; their availability/scope/reuse and a persisted account/generation linkage still need proof. pid/open_time must not be assumed universally sufficient from their names. Complete identity remains NOT_PROVEN. |

Official supporting sources: [Binance Futures Account Balance V3](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/account), [Binance Position Information V3](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade), [MEXC Open Positions](https://www.mexc.com/api-docs/futures/account-and-trading-endpoints/get-open-positions), [Gate Position schema](https://www.gate.com/docs/developers/apiv4/en/futures/#position).

Binance updateTime is an update timestamp, not an immutable position-generation ID. Two synthetic native observations with different updateTime and equal projected size/entry/side yield the same actual reader output. This is an information-loss counterexample, NOT evidence of an actual live close/reopen or measured Production collision. A local UUID, API-key HMAC, price/quantity coincidence or concatenated projection is not substituted for missing native proof.

## Tests executed — six negative-prerequisite diagnostics

Node v22.23.3. The diagnostic source was reviewed before execution. No application bootstrap, network-capable signed implementation, DB client or live transport is loaded. These are behavioral tests of isolated actual functions, NOT source-text-only assertions and NOT integrated execution races.

Command, from the candidate checkout:

```text
C:/Projects/SignalVerse-Main/tmp/pp-bootstrap-node22-20261002/node-v22.23.3-win-x64/node.exe --check C:/Projects/SignalVerse-Main/tmp/pp-shared-native-authority-20261003/native-prerequisites.mjs
C:/Projects/SignalVerse-Main/tmp/pp-bootstrap-node22-20261002/node-v22.23.3-win-x64/node.exe C:/Projects/SignalVerse-Main/tmp/pp-shared-native-authority-20261003/native-prerequisites.mjs
```

Syntax exit 0; execution exit 0; diagnostic groups 6/6. PASS here means the stated gap/rejection was reproduced; it does NOT mean the required identity/authority is proved.

| Group | Actual observation | Diagnostic result |
| --- | --- | --- |
| Binance account alias | Different synthetic native account aliases become the same C/P balance projection; alias absent in result. | PASS — missing proof reproduced |
| Binance position generation | Different synthetic updateTime values become the same C/P position projection. | PASS — insufficient lifetime evidence reproduced |
| Gate account/position metadata | Different synthetic user/pid/open_time/update_id become the same C/P projection; all are absent from result. | PASS — discarded provenance reproduced |
| MEXC exact decimal ID | Decimal string 9223372036854775807 remains exact in L; state/createTime/account binding absent. | PASS — partial identity only |
| MEXC numeric precision | C accepts an already-rounded synthetic Number converted to a wrong string; the pre-existing five-line L guard rejects it. | PASS — real guard behavior reproduced |
| Strict Phase3B contract | Real parity helper accepts the pinned approved C bytes and rejects L; Git diff is exactly 5 insertions, 0 deletions. | PASS — original contract failure remains |

No submit callback, fake Close, race, synthetic owner-registration or SQL cluster was executed. Integrated metrics stay NOT_MEASURED. Six prerequisite diagnostics must not be counted as the requested integrated matrix or added to the earlier 6,000 kernel races.

## MEXC change-contract disposition — not weakened

The failed existing release test remains genuine and unchanged:

- scripts/futures-profit-protection-test.mjs, test 301–311, assertion 308.
- scripts/lib/futures-profit-protection-verify-only-parity.mjs::beforeVerifyOnlyProfitProtection, lines 5–14, assertion 11.
- Actual rejection: ERR_ASSERTION / Only exact Phase 3B capability delta: api/copytrade.ts.
- Approved Phase3B LF-normalized hash: 61977ce893dfdb65758df1041044f5d61f70a4931e3550dca006d0bf2ace09d2.
- Existing local LF-normalized hash: 5fcd84689c95f6db1def3dac884ce56fd6c8891d1dc60418aa8ca6ab50996125.
- Change: exactly five added lines rejecting unsafe numeric native IDs.
- Classification: introduced exact-source scope-contract change, with independently reproduced useful input-guard behavior; NOT a fixture exemption or proof of no behavioral regression.
- No assertions skipped, hashes admitted, wildcard exclusions added, snapshots replaced or tests modified.
- Historical 145/146 remains historical. The full suite was not rerun and is not reported green.

## Shared gate status and stop point

The previous actual-path evidence remains authoritative: public and partner_copytrade close-intent/PP tables and claim RPCs are independent. api/_shared/futures-profit-protection-execution.ts::executeTrackedFullClose, lines 16–51 (claim line 30, submit line 33), is a real common hook, not a global native owner. Partner contract.mjs lines 4–16 still routes close RPCs to its owned schema. The prior local prototype requires trusted registration, but no actual native account/generation producer or caller wiring supplies it.

Adding an atomic lock over an unproved key could merge different accounts/lifecycles, or give two keys to the same native position. It cannot satisfy identity collision/ambiguity = 0. A successful fake registration/race would not repair that missing input.

Exactly three missing proof elements remain before safe implementation:
1. Authenticated native account identity, scoped to exchange/product/settlement/subaccount, mapped consistently across both paths and API keys.
2. Native position-slot/lifecycle evidence, including flat/reopen, aggregation and external changes, not merely local opened_at or size/entry/side.
3. A reviewed local-trade-to-that-proved-identity binding enabling both RLS-preserving callers to address the same durable owner.

Because those prerequisites are unproved, the phase stops BEFORE creating/populating or wiring a shared durable owner. There is no claim that a DB lock alone can atomically stop all external exchange lifecycle changes between a read and a close request.

## Files changed and integrity

Application / policy / adapter / SQL / test / Partner changes this phase: NONE.

New local disposable diagnostic:
- tmp/pp-shared-native-authority-20261003/native-prerequisites.mjs
- generated tmp/pp-shared-native-authority-20261003/evidence.json

Documentation only:
- reports/futures/pp-shared-native-identity-single-close-authority-2026-10-03.md
- root HANDOFF.md entry.

| File | SHA-256 |
| --- | --- |
| diagnostic source | eeb999ce51fac491ccad047662d326982636724d0ef2c2a6916608069016e9dd |
| generated evidence | 39bf9abd30d13f2a794c361dd675c37fd0b283ee2095f639598e73fa8c753b2a |
| pre-existing local api/copytrade.ts, unchanged | 5fcd84689c95f6db1def3dac884ce56fd6c8891d1dc60418aa8ca6ab50996125 |
| pre-existing native ownership prototype, unchanged | 10d62b4b04bb6f7e16aadffa0dfb963488d7bc75da579d24d9e52d531fa865c4 |
| pre-existing candidate SQL, unchanged | cbdac629890fcb5d3a567b160946b62c17da9b3858c4da7e15f5c521516d5ebe |

Git candidate status remains the same pre-existing modified api/copytrade.ts plus untracked prototype/SQL/output. Root HEAD and candidate HEAD are unchanged; no main/branch write, application commit or push. Existing private/unrelated work is retained.

Build/CI: NOT_RUN / NOT_STARTED because the prerequisite stop occurred; no app source changed. No fresh Production/runtime/flag observation is claimed in this phase. Previous service/flag observations are historical, not silently refreshed: the Canonical worker was inactive and Partner active; Real/Demo PP were ON. This task did not change them.

## Publication

Only this sanitized report is authorized for report-only AI-Log/master publication by standing AGENTS.md. No diagnostic source/output, credentials, database export or application change is published there. Publication commit and byte-exact remote verification are recorded separately in the final response/local handoff receipt.

## Final classification

```text
PHASE=PP-SHARED-NATIVE-IDENTITY-SINGLE-CLOSE-AUTHORITY
NATIVE_POSITION_IDENTITY_PROVEN=NO
ONE_CANONICAL_IDENTITY_PROVEN=NO
SHARED_OWNERSHIP_PROVEN=NO
SINGLE_EXECUTION_AUTHORITY_PROVEN=NO
OFFLINE_PREREQUISITE_DIAGNOSTICS=6/6_REPRODUCED_GAPS
INTEGRATED_TESTS_RUN=0
DOUBLE_AUTHORIZATION=NOT_MEASURED
TWO_OWNERS=NOT_MEASURED
DOUBLE_CLOSE=NOT_MEASURED
STALE_AUTHORIZATION_CLOSE=NOT_MEASURED
RETRY_DUPLICATE_CLOSE=NOT_MEASURED
RESTART_DUPLICATE_CLOSE=NOT_MEASURED
IDENTITY_COLLISION_AMBIGUITY=NOT_MEASURED
CROSS_PATH_DUPLICATE_CLOSE=NOT_MEASURED
APPLICATION_SOURCE_CHANGED=NO
CONTRACT_WEAKENED=NO
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
MAIN_PUSH=NO
CI=NOT_STARTED
DEPLOYMENT=NO
WORKER_STARTED=NO
REAL_PP=UNCHANGED_BY_TASK
DEMO_PP=UNCHANGED_BY_TASK
PRODUCTION_DB_MUTATION=0
REAL_EXCHANGE_CALLS=0
ORDER_POSITION_SL_TP_CLOSE_ACTIONS=0
FINAL_CLASSIFICATION=NOT_PROVEN
STOP
```
