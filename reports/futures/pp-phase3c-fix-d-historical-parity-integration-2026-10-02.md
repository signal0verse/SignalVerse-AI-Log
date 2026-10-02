# Phase 3C-FIX-D — historical terminal parity integration

## Metadata

- Date: 2026-10-02, Asia/Kuala_Lumpur (UTC+08).
- Task: PHASE-3C-FIX-D-HISTORICAL-PARITY-INTEGRATION.
- Module: Futures PP VERIFY_ONLY source acceptance, test-only integration.
- Repository: signal0verse/signalverse-main.
- Branch: codex/futures-pp-auto-enrollment-20261002.
- Starting commit / sole parent: edd47880d4f37acb116ff1e33cb74f1fbeff5452.
- New normal repair commit: 0ac5d1db973837e1cff679753706ca0f193e0087.
- Main independently checked before/after candidate push: a0455626c0a54fb443f457e0a595a662974623fa.
- Official candidate CI: 37027854829; exact SHA 0ac5d1db973837e1cff679753706ca0f193e0087.
- Final evidence collection: 2026-10-02T15:38:08Z; CI final conclusion FAILURE.

## Objective / Scope

Repair only the historical terminal consumer's failure to use the canonical Phase3B verified predecessor view. Owner authorized a new normal repair commit on top of edd47880, candidate-branch-only push, official exact-SHA CI and then STOP. No application implementation, Worker, Partner, SQL, strategy, scanner, scheduler, workflow, main promotion or Production change was authorized or performed.

## Root Cause / Findings

CONFIRMED_HISTORICAL_CONSUMER_NOT_USING_PHASE3B_CONTRACT.

The previous official CI 37019341040 passed 35 of its first 36 combined terminal/paper tests. Its one failure was this historical source chain:

```text
full-terminal-contract-test.mjs:120
  actual api/copytrade.ts
  -> beforeOwnedCopytrade
  -> beforeAutomaticProfitProtection
  -> frozen automatic-admission digest assertion
```

The old automatic contract recognized the earlier API bytes, not the actual approved Phase3B API hash 61977ce893dfdb65758df1041044f5d61f70a4931e3550dca006d0bf2ace09d2. The consumer had not first invoked the existing closed Phase3B verification/restoration layer. This was a test integration defect, not evidence of a production PP/strategy failure.

## Actions Taken / Implementation

1. Read the complete task and relevant source/contracts; preserved the dirty primary checkout, private/untracked work and original failed report/run.
2. Changed only two test/parity files, 20 insertions and 4 deletions relative to edd47880.
3. Historical terminal test now invokes verifyPhase3BScope() before passing phase3B.read('api/copytrade.ts') into the unchanged old contract chain.
4. Canonical exact contract now additionally pins this historical consumer's exact hash. Reversing only its three integration edits must reconstruct the entire previous consumer's LF bytes, including all historical assertions and final newlines.
5. Retained the original 12 Phase3B hashes, original contract prefix, existing compatibility repair pins and required-file checks. The canonical union inventory is now exactly 16 paths versus 15 previously, solely because this historical consumer is newly integrated. No second independent Phase3B API digest list was introduced.
6. Added five in-memory negative cases to the existing canonical validator; all 41 reject. Old automatic and owned-copytrade parity helpers and old automatic digest JSON are byte-identical to edd47880.
7. Verified protected implementation hashes, exact staged bytes/inventory, syntax and whitespace checks. Created one ordinary commit with sole parent edd47880; no amend/rebase/merge/force/history rewrite.
8. Rechecked remote identities immediately before push, pushed only exact 0ac5d1d to the existing candidate branch, then independently read back candidate 0ac5d1d and main a045.
9. Existing CI has only main/master push triggers; queried the exact candidate SHA first (no run), then dispatched only the existing official Production CI on the candidate ref. Historical terminal step passed on Linux, but a later isolated execution-fault step failed. Stopped without any new repair, rerun or next-phase action. No release/preparation workflow invoked.
10. This report is outside the frozen candidate checkout and not part of the application repair commit. AI-Log publication is documentation-only and separately verified.

Exact resulting test-only source flow:

```text
actual candidate inventory + bytes
  -> canonical Phase3B exact scope/hash/negative validation
  -> verified pinned a045 predecessor API source view
  -> unchanged owned/automatic/approved-PP historical adapters
  -> unchanged terminal historical assertions
```

The verified view is test-only. Neither repair file is imported by application runtime. No old digest exception, assertion suppression, function wildcard, arbitrary source normalization or fallback was added.

## Files Inspected

- Complete owner task; repository contributor/CLAUDE/current handoff/test safety instructions and prior blocked CI report.
- scripts/full-terminal-contract-test.mjs.
- scripts/lib/futures-profit-protection-verify-only-parity.mjs.
- scripts/lib/futures-profit-protection-automatic-parity.mjs and its automatic-delta.json.
- scripts/lib/owned-copytrade-parity.mjs and historical approved PP contract.
- scripts/futures-profit-protection-scope-test.mjs and automatic-scope-test.mjs.
- Selected safe-idle, enrollment, adapter, PP and disposable safe-idle SQL tests; offline paper-build/test files.
- Actual tsconfig and TypeScript diagnostic inputs; protected PP application/Worker/policy/runtime/execution/lifecycle/enrollment files.
- .github/workflows/production-ci.yml, read-only; no workflow change.
- Existing AI-Log report template; master has no AGENTS.md at the queried location (HTTP 404).

## Files Changed

| Repair commit path | Exact purpose |
| --- | --- |
| scripts/full-terminal-contract-test.mjs | Import/call canonical verifier, consume its verified API view; historical assertions unchanged |
| scripts/lib/futures-profit-protection-verify-only-parity.mjs | Exact consumer hash plus predecessor-byte assertion; five additional negative cases; existing closed contract preserved |

Diffstat: 2 files, 20 insertions, 4 deletions. No application/Worker/Partner/SQL/src/.github/ops changes in the new commit. Existing untracked output files remain uncommitted. Local handoff/report documentation is maintained separately in the primary checkout and never added to the frozen candidate inventory.

## Tests Executed

Local Node v22.23.3; commands executed only in the isolated candidate checkout. SQL uses a newly owned disposable local PostgreSQL 18.6 cluster, never an existing Production database.

| Command/check | Actual result |
| --- | --- |
| node --test --test-name-pattern 'unrelated customer panels and canonical engines preserve upstream parity' scripts/full-terminal-contract-test.mjs | 1/1 PASS; exact formerly failing test |
| node --test scripts/full-terminal-contract-test.mjs | 10/10 PASS, no failure/skip/cancel |
| node scripts/build-partner-paper-engine.mjs | PASS, offline ignored .runtime/partner-paper fixture; no Partner activation |
| node --test scripts/partner-paper-test.mjs scripts/partner-paper-http-test.mjs scripts/full-terminal-contract-test.mjs scripts/terminal-view-parity-test.mjs | 36/36 PASS, no failure/skip/cancel; exact previously failing first CI batch |
| node scripts/futures-profit-protection-scope-test.mjs --types | PASS, exit 0; exact 16-path contract; all 41 negative cases rejected |
| node --test scripts/futures-profit-protection-safe-idle-test.mjs scripts/futures-profit-protection-enrollment-test.mjs scripts/futures-profit-protection-adapters-test.mjs scripts/futures-profit-protection-test.mjs | 179/179 PASS, no failure/skip/cancel |
| FUTURES_PROFIT_PROTECTION_TEST_PG_BIN=local PG18/bin node scripts/futures-profit-protection-safe-idle-sql-test.mjs | 13/13 PASS; owned temporary cluster stopped and removed |
| Independent strict TypeScript API diagnostic, actual tsconfig, baseline edd47880 versus working candidate | 30 baseline / 30 candidate / 0 introduced; diagnostic multiset compared, not count alone |
| Official frontend scope/types diagnostic | 72 baseline / 71 candidate / 0 introduced |
| Official API scope/types diagnostic | 30 baseline / 30 candidate / 0 introduced |
| node --check on both changed modules | PASS |
| git diff --check and git diff --cached --check | PASS |
| Exact two-path staged inventory and full LF-normalized staged/working bytes | PASS |
| Post-edit protected source compared byte-for-byte to edd47880 | UNCHANGED |

Important count distinction: full-terminal-contract-test.mjs alone contains 10 tests. The previous 35/36 and repaired 36/36 counts refer to the four-file combined CI batch, not 36 tests in that one file.

An initial draft run correctly failed the new predecessor-byte assertion because editing dropped one final blank line. Restored that exact historical newline and recalculated the new consumer/self-integrity pins; did not relax the original predecessor hash or assertions. All results above are subsequent final successful runs, not that failed draft.

Negative coverage includes unrelated API/risk/UI/terminal changes, every required-file removal, every exact candidate-file mutation, safety-assertion mutation and protected Spot function mutation. Checks are in-memory only. Canonical historical evidence: 683 non-PP files byte-identical; 711 protected current-main files; 403 non-admission API functions preserved; existing Worker controls 2 accepted/2 rejected.

VERIFY_ONLY regression totals: actual DB mutations 0, RPC mutations 0, exchange calls 0, order/position/SL/TP/close actions 0. Synthetic proposed/denied effects are not actual exchange execution. Disposable SQL's two intentional fixture-writer CAS/claim races are local test data only; cross-schema/native-exchange concurrency is NOT PROVEN.

## Protected Source Integrity

LF-normalized hashes, independently compared against sole parent edd47880 after the repair:

| Source | SHA-256, unchanged |
| --- | --- |
| api/copytrade.ts | 61977ce893dfdb65758df1041044f5d61f70a4931e3550dca006d0bf2ace09d2 |
| server/futures-profit-protection/worker.mjs | c22f5b8f8756df7856ac5f9aa3b52b07df2d0556ea33b0859e3e0b945082c028 |
| api/_shared/futures-profit-protection.ts | 832a06acc20a4ec47fc89d564c4f30c7e0b44357a11ba93a144a9dd12fe6950d |
| api/_shared/futures-profit-protection-runtime.ts | a376f592f66962c0f7ab4e1f365c2210473e904752193b8dfbbf7471d4e853e4 |
| api/_shared/futures-profit-protection-execution.ts | 224ca45ff2b89c1475cb28160faad871cc36ab5e2cd21abdeef9e83b149f0c7c |
| api/_shared/futures-profit-protection-lifecycle.ts | 5e4e23f7a0f69310993666940b27f18c23bb0b4a98d05d7071fd0efb356dbab4 |
| api/_shared/futures-profit-protection-enrollment.ts | 88d8a84b818cd219a62788af1ad5fb0374de158611916e27ea2ba5582e8989ba |

Historical consumer original hash: 5b3f7b9bc0c755165aa9684f722c75f2f5e2d4e8447ca91cd2869ae68ed2ef90. New exact consumer hash: a274f2e91ebb0a80fd5e5278a1c0b8aa4954028df98fcb54961f76dc5d904d9d. Canonical self-body integrity hash, excluding its one integrity-record line: 50c86697835a79f83706a4a0f88e1cfcf039c0686258d872bfe5356f09ed87d8.

## Official CI / Build Result

- Workflow: Production CI, existing .github/workflows/production-ci.yml, actual Node v22.23.3, ubuntu-latest.
- Run: [37027854829](https://github.com/signal0verse/signalverse-main/actions/runs/37027854829).
- Event: workflow_dispatch; candidate ref, NOT main push CI or deployment authorization.
- Exact SHA: 0ac5d1db973837e1cff679753706ca0f193e0087.
- Branch: codex/futures-pp-auto-enrollment-20261002.
- Created: 2026-10-02T15:33:49Z.
- Job: Build web and API runtime, ID 110906966709, started 2026-10-02T15:33:54Z.
- Job completed: 2026-10-02T15:35:31Z; run final update 2026-10-02T15:35:32Z.
- Final conclusion: failure; watcher exited 1. Job step totals including setup/cleanup: 22 success, 1 failure, 16 skipped.

| Official CI step(s) | Exact result |
| --- | --- |
| Checkout, Node, dependencies, admin dependencies (1-5) | PASS |
| Admin/auth, partner host, reusable terminal (6-8) | PASS |
| Historical terminal/paper parity (9) | PASS; first batch 36/36, second batch 24/24; 41 canonical negatives and unchanged historical assertions logged |
| Full terminal build, owned copytrade tests, standalone admin types (10-12) | PASS |
| Learning, logging, historical timing, simulation exits/chronology/accounting/capital/analytics (13-20) | PASS |
| Real execution faults with isolated transports (21) | FAIL; 126/131 pass, 5 fail, 0 skip/cancel |
| PP/UI/scope/types (22) | SKIPPED; successful local scope/types is not this skipped GitHub step |
| Scheduler/discovery/whale/stablecoin/prediction suites (23-28) | SKIPPED |
| PostgreSQL install and disposable SQL suites (29-33) | SKIPPED |
| Web application/API bundling/expected artifacts (34-36) | SKIPPED |
| Post Node (71) | SKIPPED |
| Post checkout and complete job (72-73) | PASS |

### Exact remaining CI blocker — no repair attempted

Failed command, unchanged by this repair:

```text
node --test scripts/futures-real-execution-fault-test.mjs scripts/futures-gate-mexc-fault-test.mjs scripts/binance-final-funding-test.mjs
```

All five failed assertions are in scripts/futures-real-execution-fault-test.mjs:

| Test number / source test line / assertion line | Scenario | Exact assertion |
| --- | --- | --- |
| 49 / 875 / 881 | SL beyond actual liquidationPrice; unconditional alert and close | ERR_ASSERTION, 0 !== 1 |
| 51 / 916 / 926 | AT_RISK while re-analysis claim/audit persistence fail | ERR_ASSERTION, 0 !== 1 |
| 52 / 931 / 949 | AT_RISK plus PROTECTION_UPDATE_DEFERRED | ERR_ASSERTION, 0 !== 1 |
| 54 / 991 / 1005 | AT_RISK plus INVALID_TP_PROPOSAL | ERR_ASSERTION, 0 !== 1 |
| 56 / 1047 / 1066 | AT_RISK plus Binance -4130 | ERR_ASSERTION, 0 !== 1 |

The first failure's fixture notification contains this exact error at 2026-10-02T15:35:29.6369426Z:

```text
profitProtectionDB is not defined
```

Read-only source inspection confirms the offline harness AST-extracts existingFuturesClose/trackedFuturesClosePorts (function list lines 25-27) and builds a VM sandbox (line 303) with supabase: db (line 348), but no profitProtectionDB binding. Actual api/copytrade.ts has a module-level binding at line 15959, and existingFuturesClose reads it at line 15964, reached from syncRealBinanceTrades at line 10253. The fixture extracts function declarations, not that module initialization. This confirms a missing harness dependency for the first reported ReferenceError. The other four failures share missing-close assertions, but their individual complete root causes were not repaired or separately proven. No baseline rerun was performed, so none is relabeled as an accepted baseline failure.

The Phase3B source and fault harness are both unchanged by this two-file repair. This failure is not proof of a real exchange/account error; it is nevertheless a genuine failed CI acceptance gate and must not be bypassed. Old terminal integration is corrected; complete candidate acceptance remains BLOCKED. No additional code edit, CI rerun, application commit or release attempt followed.

Full exact-SHA Web/API build acceptance is unproven because the final build/bundle steps were skipped. Successful offline terminal builds are not a retained release artifact or Production deployment.

## Git Status / Commit

One new normal commit 0ac5d1db973837e1cff679753706ca0f193e0087 with sole parent edd47880d4f37acb116ff1e33cb74f1fbeff5452. Candidate-only ordinary push independently read back. No additional commit, main push, amendment, merge, rebase, squash or force. Tracked candidate checkout clean after commit; pre-existing output files retained untracked. Primary dirty work/private files preserved.

## Remaining Issues / Risks / Limitations

No SSH or Production runtime/database/account check was performed in this phase; no fresh Production-health, PID or flag-state claim is made. The latest recorded runtime a045 and disabled/inactive canonical Worker are reference evidence only, not freshly remeasured. REAL_PP/DEMO_PP flags were not changed. This phase proves test integration/source CI only, not private-account execution, profitability, live Worker readiness or financial performance. Build-generated ignored offline fixtures/CI output are not official retained release artifacts.

Main promotion, artifact preparation, Guard, release/deploy and Worker/PP activation remain separately gated. Stop after final candidate CI result; do not proceed automatically.

## Final Required Status

```text
PHASE=PHASE-3C-FIX-D-HISTORICAL-PARITY-INTEGRATION
ROOT_CAUSE=CONFIRMED_HISTORICAL_CONSUMER_NOT_USING_PHASE3B_CONTRACT
REPAIR_FILES=scripts/full-terminal-contract-test.mjs;scripts/lib/futures-profit-protection-verify-only-parity.mjs
REPAIR_SCOPE=EXACT
PHASE3B_APPLICATION_CHANGED=NO
WORKER_CHANGED=NO
PARTNER_CHANGED=NO
TERMINAL_TEST_BEFORE=35/36
TERMINAL_TEST_AFTER=36/36
PHASE3B_SCOPE=PASS
PHASE3B_TYPES=PASS
PHASE3B_REGRESSION=179/179 PASS; disposable SQL 13/13 PASS
NEGATIVE_CASES=41/41 REJECTED
TS_BASELINE=API 30; FRONTEND 72
TS_CANDIDATE=API 30; FRONTEND 71
TS_INTRODUCED=0
DIFF_CHECK=PASS
UNRELATED_FILES=NONE IN REPAIR COMMIT
NEW_COMMIT=0ac5d1db973837e1cff679753706ca0f193e0087
PARENT=edd47880d4f37acb116ff1e33cb74f1fbeff5452
PUSH=YES; CANDIDATE ONLY
CI_RUN=37027854829
CI_SHA=0ac5d1db973837e1cff679753706ca0f193e0087
CI_STATUS=FAIL; STEP 21; 126/131 PASS; 5 FAIL
MAIN_PROMOTION=NO
ARTIFACT=NO
GUARD=NO
DEPLOYMENT=NO
WORKER_START=NO
DATABASE_MUTATION=NO PRODUCTION MUTATION; DISPOSABLE TEST FIXTURES ONLY
EXCHANGE_CALLS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_CHANGES=0
TP_CHANGES=0
CLOSE_ACTIONS=0
PARTNER_TOUCHED=NO
FINAL_CLASSIFICATION=BLOCKED_OFFICIAL_CI; HISTORICAL_PARITY_REPAIR_PASS
STOP
```

## Recommended Next Step

STOPPED. A separately authorized diagnosis/repair of the isolated execution-fault harness is required before any new CI attempt; no acceptance weakening or assumption that all failures are baseline. Main promotion and every operational phase remain separately unauthorized.
