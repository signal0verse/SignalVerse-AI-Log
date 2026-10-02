# Futures PP — Phase 3C-FIX-E official CI failure diagnosis

## Metadata

- Date: 2026-10-02 UTC; final source/log recheck at 15:56–15:59 UTC.
- Task ID: PHASE-3C-FIX-E-DIAGNOSIS.
- Module: isolated Futures execution fault-test initialization.
- Mode: diagnosis only; no repair, local test rerun, CI rerun, release or Production access.
- Repository: `signal0verse/signalverse-main`.
- Candidate branch: `codex/futures-pp-auto-enrollment-20261002`.
- Starting/ending candidate: `0ac5d1db973837e1cff679753706ca0f193e0087`.
- Sole parent: `edd47880d4f37acb116ff1e33cb74f1fbeff5452`.
- Pre-Phase3B comparison: `a0455626c0a54fb443f457e0a595a662974623fa`.
- Existing failed official CI: [37027854829](https://github.com/signal0verse/signalverse-main/actions/runs/37027854829).
- Existing pre-Phase3B main/push CI: [36994567002](https://github.com/signal0verse/signalverse-main/actions/runs/36994567002).
- Sanitization: no credentials, connection strings or private account/trade data. The fixture identifiers and simulated prices in the CI evidence are synthetic, not Production observations.

## Executive result

All five failures share one missing lexical dependency in the old AST-extracted VM: `profitProtectionDB`. Phase3B changed `existingFuturesClose` to use the capability-aware database alias, while the older fault-test VM still supplies only `supabase`. The VM extracts function declarations without importing the new runtime bridge or executing its module-level alias initializer.

The first CI failure explicitly prints `profitProtectionDB is not defined`. The remaining four CI records print assertion stacks, not the caught application exception. Their common root is independently established from their exact fixtures, control flow, unchanged extracted function body and absent VM binding; no unrecorded application stack is invented.

This is a **test-environment initialization compatibility regression** introduced by Phase3B's dependency contract, not a pre-existing failing baseline, not a Phase3C-FIX-D code change, and not evidence of a Linux/CI configuration defect. No actual Phase3B application-runtime defect is established: the full API module defines the alias before these functions are called. That is a limited diagnosis, not proof of complete private-account execution or live safety.

No repair was implemented. Release remains blocked by the failed CI.

## Objective and scope

Identify each of the five failures independently, trace the complete database binding contract, compare candidate/parent/pre-Phase3B/validated isolated initialization, and propose the minimum future repair class. Source, tests, workflows, environment, runtime, Partner, flags and database are not changed. No test fixture or fake database was injected in this task.

The only local documentation writes are this report and a new section in the primary checkout's already-dirty `HANDOFF.md`. They are outside the candidate worktree and are not staged or committed to the application repository. Standing AGENTS reporting publication concerns only the sanitized report in the separate AI-Log repository, not application source/main.

## Actions taken / evidence collection

1. Read the owner's complete Phase 3C-FIX-E attachment and the complete preceding Phase 3C-FIX-D report.
2. Read existing official run metadata, failed step log and baseline success log using GitHub's read-only `gh run view` interface. No CI dispatch or rerun.
3. Inspect each failing test, the AST extractor, VM sandbox, API call path, new database initializer/runtime bridge, and the already-validated safe-idle initialization paths.
4. Compare exact Git source at pre-Phase3B, parent and candidate. Run read-only source/hash/TypeScript-AST diagnostics; these parse source only, do not import/bootstrap the API or Worker, and do not execute fixtures.
5. Verify candidate identity, two-file parent delta, protected-path emptiness, normalized source hashes, tracked/index cleanliness and `git diff --check`.

Representative read-only commands:

```text
gh run view 37027854829 --repo signal0verse/signalverse-main --json databaseId,headSha,headBranch,event,conclusion,jobs
gh run view 37027854829 --repo signal0verse/signalverse-main --log-failed
gh run view 36994567002 --repo signal0verse/signalverse-main --json databaseId,headSha,headBranch,event,conclusion,createdAt,updatedAt,jobs
gh run view 36994567002 --repo signal0verse/signalverse-main --log
git show -s --format='%H%n%P%n%s' HEAD
git diff --stat edd47880d4f37acb116ff1e33cb74f1fbeff5452 0ac5d1db973837e1cff679753706ca0f193e0087
git diff --name-status a0455626c0a54fb443f457e0a595a662974623fa 0ac5d1db973837e1cff679753706ca0f193e0087
git diff --name-status edd47880d4f37acb116ff1e33cb74f1fbeff5452 0ac5d1db973837e1cff679753706ca0f193e0087 -- api server migrations .github src ops
git diff --check edd47880d4f37acb116ff1e33cb74f1fbeff5452 0ac5d1db973837e1cff679753706ca0f193e0087
git status --short
```

The protected-path diff and diff-check return no output. Candidate status contains only pre-existing untracked `output/`; tracked/index source is clean. The primary checkout's prior dirty/untracked/private work was preserved.

## Files inspected

Paths below refer to exact candidate `0ac5d1d` unless otherwise noted. Numbered API/test references are verified candidate-source lines, not guessed VM-generated line numbers.

- `api/copytrade.ts`: imports/DB initialization; liquidation safety; `runFuturesReanalysis`; `syncRealBinanceTrades`; `existingFuturesClose`; `trackedFuturesClosePorts`.
- `api/_shared/futures-profit-protection-runtime.ts`: capability getter, database read restriction, effect denial, live identity path.
- `api/_shared/futures-profit-protection.ts`.
- `api/_shared/futures-profit-protection-execution.ts`.
- `api/_shared/futures-profit-protection-lifecycle.ts`.
- `api/_shared/futures-profit-protection-enrollment.ts`.
- `server/futures-profit-protection/worker.mjs`: capability bootstrap before module load, entrypoint guard.
- `scripts/futures-real-execution-fault-test.mjs`: AST selected symbols/extraction, in-memory DB, sandbox, five fixtures/assertions.
- `scripts/lib/futures-pure-test-context.mjs`: actual shared imports supplied to sandbox, omitted runtime bridge.
- `scripts/futures-profit-protection-safe-idle-test.mjs`: actual API bundling, capability bootstrap and real restricted DB adapter initialization in isolated tests.
- `scripts/futures-profit-protection-safe-idle-sql-test.mjs`: disposable loopback PostgreSQL ownership/read-only role isolation.
- `scripts/lib/futures-profit-protection-verify-only-parity.mjs`: exact byte/inventory contract, including the proposed future repair's scope implication.
- `scripts/full-terminal-contract-test.mjs`: Phase3C-FIX-D's historical consumer integration.
- `.github/workflows/production-ci.yml`: unchanged exact fault-suite command and CI contract.
- Existing reports `pp-phase3c-fix-phase3b-release-blocked-2026-10-02.md` and `pp-phase3c-fix-d-historical-parity-integration-2026-10-02.md` and candidate Phase3B report.
- Contributor instructions: `AGENTS.md`, `CLAUDE.md`, latest `HANDOFF.md`, `docs/AI_HANDOFF.md`, `docs/COLLEAGUE_HANDOFF_2026-09-29.md`, `docs/testing/stability-test-runbook.md`.
- Separate AI-Log template: `templates/report-template.md`.

## Existing official CI result

```text
RUN=37027854829
WORKFLOW=Production CI
HEAD_SHA=0ac5d1db973837e1cff679753706ca0f193e0087
HEAD_BRANCH=codex/futures-pp-auto-enrollment-20261002
EVENT=workflow_dispatch
CONCLUSION=failure
CREATED_AT=2026-10-02T15:33:49Z
JOB_START=2026-10-02T15:33:54Z
JOB_END=2026-10-02T15:35:31Z
FINAL_UPDATED_AT=2026-10-02T15:35:32Z
NODE=v22.23.3
JOB_ID=110906966709
JOB_NAME=Build web and API runtime
SUCCESSFUL_STEPS=22
FAILED_STEPS=1
SKIPPED_STEPS=16
FAULT_STEP=21
FAULT_SUITE_TESTS=131
FAULT_SUITE_PASS=126
FAULT_SUITE_FAIL=5
FAULT_SUITE_SKIPPED=0
FAULT_STEP_EXIT=1
FAULT_STEP_EXIT_TIMESTAMP=2026-10-02T15:35:29.6686600Z
```

The exact step command was:

```text
node --test scripts/futures-real-execution-fault-test.mjs scripts/futures-gate-mexc-fault-test.mjs scripts/binance-final-funding-test.mjs
```

The repaired terminal step 9 passed 36/36 and its second batch 24/24. The later PP test step 22 and final build stages were skipped, not passed. No acceptance substitution with earlier local tests is made.

## Five failures — independent fixture and stack evidence

All five originate in `scripts/futures-real-execution-fault-test.mjs`. Each has `AssertionError`, `ERR_ASSERTION`, operator `strictEqual`, actual `0`, expected `1`. The failing assertion checks the count of completed closes, after the caught dependency error prevented the close call. The simulated transport never touches an exchange account.

| Failure | CI test | Test declaration / assertion | First failing application symbol | Independent path to shared root |
|---|---:|---|---|---|
| 1 | 49 | 875:1 / 881:10 | `existingFuturesClose` → `profitProtectionDB` at API 15964 | No active reanalysis policy; unsafe SL immediately reaches the close branch. CI explicitly records the missing name. |
| 2 | 51 | 916:1 / 926:10 | Same | Claim/audit persistence errors are intentionally handled; `finish('ERROR')` returns an outcome, not an uncaught failure. It is not `SL_TP_UPDATED`, so the close branch reaches the missing alias. |
| 3 | 52 | 931:1 / 949:10 | Same | The preceding assertion at 948 confirms actual fixture outcome `PROTECTION_UPDATE_DEFERRED`; this cannot suppress the liquidation close. |
| 4 | 54 | 991:1 / 1005:10 | Same | The preceding assertion at 1004 confirms `INVALID_TP_PROPOSAL`; this cannot suppress the liquidation close. |
| 5 | 56 | 1047:1 / 1066:10 | Same | The preceding assertion at 1065 confirms `PROTECTION_UPDATE_PENDING_CONFIRMATION` from fixture Binance error -4130; this cannot suppress the liquidation close. |

### Failure 1 — exact test and recorded error

```text
TEST=an open position with SL beyond actual liquidationPrice is alerted AND closed unconditionally - no settings/toggle involved
NOT_OK_TIMESTAMP=2026-10-02T15:35:29.6362830Z
ERROR_DETAIL_TIMESTAMP=2026-10-02T15:35:29.6369426Z
RECORDED_CAUGHT_EXCEPTION_MESSAGE=profitProtectionDB is not defined
ASSERTION=0 !== 1
```

The error block's synthetic logged notification ends with the following exact entry:

```text
["error","🛑 بستنِ پوزیشنِ پرریسکِ ETH با خطا مواجه شد","profitProtectionDB is not defined"]
```

Exact assertion stack:

```text
TestContext.<anonymous> (file:///home/runner/work/signalverse-main/signalverse-main/scripts/futures-real-execution-fault-test.mjs:881:10)
async Test.run (node:internal/test_runner/test:1054:7)
async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
```

Missing infrastructure: YES. Actual Phase3B runtime regression demonstrated: NO. Shared with failures 2–5: YES. Failure occurs on entry to the new Phase3B-aware close ownership DB read, **before** the read adapter, managed/unmanaged ownership decision, effect denial or actual close executes in that VM. Liquidation detection itself already executes.

### Failure 2 — exact test, error and stack

```text
TEST=AT_RISK still closes when Re-Analysis claim and audit persistence both fail
NOT_OK_TIMESTAMP=2026-10-02T15:35:29.6381837Z
ERROR=Expected values to be strictly equal:

0 !== 1
```

```text
TestContext.<anonymous> (file:///home/runner/work/signalverse-main/signalverse-main/scripts/futures-real-execution-fault-test.mjs:926:10)
async Test.run (node:internal/test_runner/test:1054:7)
async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
```

The fixture `dbFail` deliberately rejects reanalysis claims and audit inserts. API 9567–9575 handles audit error/throw and returns `lastOutcome`. API 9585–9606 handles claim failure via `finish('ERROR', ...)`. Thus these fixture errors do not escape and are not a second root cause. The close helper's new DB binding is still absent. Missing infrastructure: YES; runtime regression demonstrated: NO; shared with 1,3,4,5: YES. Reanalysis executes before the failure; Phase3B ownership/effect logic does not.

### Failure 3 — exact test, error and stack

```text
TEST=AT_RISK + an ACTIVE Re-Analysis policy that genuinely results in PROTECTION_UPDATE_DEFERRED (Engine/Supervisor/Risk all pass, Binance placement fails) still closes via the SAME unconditional fail-safe - a deferred result must never weaken it
NOT_OK_TIMESTAMP=2026-10-02T15:35:29.6395312Z
ERROR=Expected values to be strictly equal:

0 !== 1
```

```text
TestContext.<anonymous> (file:///home/runner/work/signalverse-main/signalverse-main/scripts/futures-real-execution-fault-test.mjs:949:10)
async Test.run (node:internal/test_runner/test:1054:7)
async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
```

The fixture's protection-placement failure is intentional. The outcome sanity assertion passes before the failing close-count assertion. Missing infrastructure: YES; runtime regression demonstrated: NO; shared with 1,2,4,5: YES. Reanalysis executes before the failure; Phase3B ownership/effect logic does not.

### Failure 4 — exact test, error and stack

```text
TEST=AT_RISK + a genuinely INVALID_TP_PROPOSAL (TP below the real entry) still closes via the SAME unconditional liquidation fail-safe - an invalid proposal must never weaken it, exactly like DEFERRED
NOT_OK_TIMESTAMP=2026-10-02T15:35:29.6414552Z
ERROR=Expected values to be strictly equal:

0 !== 1
```

```text
TestContext.<anonymous> (file:///home/runner/work/signalverse-main/signalverse-main/scripts/futures-real-execution-fault-test.mjs:1005:10)
async Test.run (node:internal/test_runner/test:1054:7)
async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
```

The fixture's invalid proposed TP is intentional and its outcome is verified before the close assertion. Missing infrastructure: YES; runtime regression demonstrated: NO; shared with 1,2,3,5: YES. Reanalysis executes before the failure; Phase3B ownership/effect logic does not.

### Failure 5 — exact test, error and stack

```text
TEST=AT_RISK + a genuine Binance -4130 (existing same-type closePosition order) still closes via the SAME unconditional liquidation fail-safe - a pending-confirmation proposal must never weaken it
NOT_OK_TIMESTAMP=2026-10-02T15:35:29.6433206Z
ERROR=Expected values to be strictly equal:

0 !== 1
```

```text
TestContext.<anonymous> (file:///home/runner/work/signalverse-main/signalverse-main/scripts/futures-real-execution-fault-test.mjs:1066:10)
async Test.run (node:internal/test_runner/test:1054:7)
async Test.processPendingSubtests (node:internal/test_runner/test:744:7)
```

The synthetic -4130 protection response is intentional. The pending-confirmation outcome assertion passes before the close assertion. Missing infrastructure: YES; runtime regression demonstrated: NO; shared with 1–4: YES. Reanalysis executes before the failure; Phase3B ownership/effect logic does not.

**Evidence boundary:** only failure 1 includes `h.logs` in its assertion message. Failures 2–5 have no retained application exception stack in TAP. Their attribution is a deterministic source/control-flow proof, not a newly executed debugger/test or invented dynamic trace.

## Shared control-flow proof

Each fixture supplies an ordinary LONG trade (no Fast Trader/whale identifier), entry 100, quantity 1, SL 90, actual simulated liquidation price 95. `evaluateLiquidationSafety` returns false (API around 3187). The five paths converge:

```text
fixture → syncRealBinanceTrades
  → liq === false (api/copytrade.ts:10189)
  → optional runFuturesReanalysis
  → resolvedByReanalysis only if finalAction === 'SL_TP_UPDATED' (10207)
  → liquidationFailSafeShouldClose = liq === false && !resolvedByReanalysis (10223)
  → closeBinanceTrade(..., await existingFuturesClose(t)) (10253)
  → existingFuturesClose (15960), fast/whale early-return not applicable (15963)
  → first missing free variable: profitProtectionDB.from(...) (15964)
  → rejected await occurs BEFORE closeBinanceTrade is invoked
  → caller catches at 10277–10279; fixture protection becomes UNKNOWN/logged
  → success counter increment at 10267 is not reached
  → returned count remains 0 (10349)
  → each test expected 1, so ERR_ASSERTION
```

The reanalysis errors/outcomes differ, but none is `SL_TP_UPDATED`. The missing alias is independent of those outcomes, simulated exchange error codes, CI transport configuration or real accounts.

Related dependency note: `denyProfitProtectionEffect` is also absent from the old VM. These five ordinary unmanaged fixtures fail at the earlier `profitProtectionDB` read; the denial helper is not their first failure. Future initialization must include the complete real capability-boundary dependency closure, not merely add an unguarded DB alias or no-op denial function. This is a related uninitialized dependency, not a sixth observed failure or a separate demonstrated cause for these five.

## `profitProtectionDB` provenance: runtime versus tests

| Question | Exact evidence |
|---|---|
| Definition | `api/copytrade.ts:15959`: `const profitProtectionDB = profitProtectionReadDatabase(supabase);` |
| Import | API line 16 imports `profitProtectionReadDatabase`, verification/effect helpers from `./_shared/futures-profit-protection-runtime.ts`. |
| Export | The runtime bridge exports the initializer/effect helpers. The alias is a private API-module constant, not a production export. |
| Runtime DB | API lines 31,41–44 initialize the actual application Supabase/copytrade DB before the later alias statement. No credentials/env file was read by this diagnosis. |
| LIVE initializer | Bridge line 19 onwards: without sealed VERIFY_ONLY capability it returns the exact supplied DB object; effect denial returns false. |
| VERIFY_ONLY initializer | With sealed capability it supplies the real read-restricted proxy; forbidden table/column/RPC/write/effect calls are denied. |
| Worker bootstrap | `worker.mjs:113` seals capability before awaiting actual API module load; entrypoint guard at 127 avoids import-triggered Worker start. Source inspected only. |
| Old fault VM extraction | Fault test 25–27 selects the close function declarations; 63–86 extracts/transpiles only selected declarations/constants. No module import or alias initializer is run. |
| Old VM dependency injection | Sandbox 303 onwards spreads `futuresPure`; at 348 it binds `supabase: db`. At 410–411 the VM is created/run. It does not bind `profitProtectionDB` or bridge helpers. |
| Shared pure context | `futures-pure-test-context.mjs` imports the actual pure Engine/Risk/provenance/economics/execution/Partner-context modules, but not the PP runtime bridge; therefore its spread cannot supply the alias. |
| Existing DB fixture | Fault test's already-existing in-memory database supplies ordinary `supabase` operations; this task neither changed nor instantiated it. Missing binding is not a missing Production DB column or schema cache. |
| Validated Phase3B safe-idle path | Safe-idle test 204 includes `profitProtectionDB` in its test-only bundle exports, 206–208 bundles actual API, 210–215 isolates non-routable child environment/capability bootstrap. It executes full module initialization rather than omitting it. |
| Secondary safe-idle VM | Safe-idle test 124–127 uses the actual `profitProtectionReadDatabase` and capability helpers. LIVE identity/effect assertions at 200–201 test preserved original behavior. |
| Disposable SQL | Safe-idle SQL test owns a fresh loopback cluster, restricted read-only/RLS role and disposable tables. Previously recorded 13/13 PASS is not a new run in this diagnosis. |
| Existed before Phase3B? | NO. Pre-Phase3B API has no alias and its close helper reads `supabase` directly. |
| Contract changed by Phase3B? | YES, close helper's dependency changed to capability-aware alias. Old AST harness was not adapted. |
| Changed by FIX-D? | NO. Parent/candidate API, bridge, Worker, fault harness and pure context are identical. FIX-D changes only historical terminal consumer and exact parity contract. |

## Baseline comparison — not an exemption

The test source, pure-context source and CI workflow are identical at pre-Phase3B `a0455626...`, parent `edd47880...` and candidate `0ac5d1d...`. The caller `syncRealBinanceTrades` AST body is also identical. Phase3B, already present in the parent, changes the close helper's dependency.

Existing official main/push CI `36994567002` tested exact pre-Phase3B SHA `a0455626c0a54fb443f457e0a595a662974623fa`, with Node v22.23.3 and SUCCESS. Step 21 ran from `2026-10-02T10:18:15Z` to `10:18:20Z`. Its retained log independently proves:

```text
2026-10-02T10:18:19.9753926Z ok 49 - [exact failure-1 test name above]
2026-10-02T10:18:19.9760267Z ok 51 - [exact failure-2 test name above]
2026-10-02T10:18:19.9765810Z ok 52 - [exact failure-3 test name above]
2026-10-02T10:18:19.9778175Z ok 54 - [exact failure-4 test name above]
2026-10-02T10:18:19.9789363Z ok 56 - [exact failure-5 test name above]
2026-10-02T10:18:20.0068016Z # tests 131
2026-10-02T10:18:20.0068687Z # pass 131
2026-10-02T10:18:20.0068981Z # fail 0
2026-10-02T10:18:20.0070774Z # skipped 0
```

Bracketed test-name references abbreviate the baseline lines only; the complete exact names are retained in the five failure sections. GitHub CLI labels old log columns `UNKNOWN STEP`; this does not mean the evidence is unavailable. Run metadata, command and test names/timestamps establish the correct batch.

Parent CI `37019341040` stopped at the earlier terminal parity step and **skipped** this fault batch. It cannot prove parent runtime-test PASS. Static identity proves the parent already contains the same uninitialized test dependency. FIX-D unblocks the earlier gate and exposes the later defect; it does not create the defect.

The prior Phase3B 179/179 regression, 13/13 disposable SQL, 41/41 negative rejection and zero introduced TS diagnostics were validated in their appropriate earlier environment. They neither cover this old harness's initialization nor override the five current CI failures. None was rerun here.

Classification:

```text
PRE_PHASE3B_FAULT_BASELINE=131_PASS_0_FAIL
PARENT_FAULT_CI=SKIPPED
FIX_D_CHANGED_FAULT_INFRASTRUCTURE=NO
PHASE3B_RUNTIME_REGRESSION_DEMONSTRATED=NO
PHASE3B_TEST_INITIALIZATION_COMPATIBILITY_REGRESSION=YES
LINUX_CI_CONFIGURATION_REGRESSION_DEMONSTRATED=NO
CURRENT_FIVE_FAILURES_ARE_IGNORABLE_BASELINE=NO
```

Here `PHASE3B_REGRESSION=NO` in the requested final fields means no **application-runtime** regression was demonstrated. Phase3B's dependency change did introduce a real test-contract compatibility regression. It must be repaired and fully verified separately, not dismissed.

## Source/hash integrity and scope

SHA-256 below is over source text normalized ONLY from CRLF to LF, for reproducible Git/worktree comparison, not release-artifact hashing. No source was changed or normalized on disk.

| File | Parent and candidate same normalized hash | Pre-Phase3B relation |
|---|---|---|
| `api/copytrade.ts` | `61977ce893dfdb65758df1041044f5d61f70a4931e3550dca006d0bf2ace09d2` | Older hash `92e4400bae077640e38fad06d8cb26752007512a62e1b61f59dc37958ec6136e` |
| `api/_shared/futures-profit-protection-runtime.ts` | `a376f592f66962c0f7ab4e1f365c2210473e904752193b8dfbbf7471d4e853e4` | Absent before Phase3B |
| `server/futures-profit-protection/worker.mjs` | `c22f5b8f8756df7856ac5f9aa3b52b07df2d0556ea33b0859e3e0b945082c028` | Phase3B change already present in parent |
| `scripts/futures-real-execution-fault-test.mjs` | `7c1c5acf124f747b32d413b804a34300f463e57355068475ea4651501d6c291d` | Identical across all three commits |
| `scripts/lib/futures-pure-test-context.mjs` | `f26d451d998e00c3a931b67e1356bc32f80f81fddf77dd73df8602b8cc3704a6` | Identical across all three commits |
| `.github/workflows/production-ci.yml` | `b93b7a36b86ac1683e8717a509819cf818534d7a9d5dc84d111aad215a0eaea3` | Identical across all three commits |
| `scripts/futures-profit-protection-safe-idle-test.mjs` | `09a6a9055aac8e1baccc28b014052a6f74e87305c54471f6fbd7e6dbbc2e2823` | Added by Phase3B, unchanged by FIX-D |
| `scripts/futures-profit-protection-safe-idle-sql-test.mjs` | `eabcad2d6426778beedce9d454cd6c0b641a812ee048c01830b042cf7faaecc6` | Added by Phase3B, unchanged by FIX-D |

Unchanged pure PP modules across all three:

```text
policy=832a06acc20a4ec47fc89d564c4f30c7e0b44357a11ba93a144a9dd12fe6950d
execution=224ca45ff2b89c1475cb28160faad871cc36ab5e2cd21abdeef9e83b149f0c7c
lifecycle=5e4e23f7a0f69310993666940b27f18c23bb0b4a98d05d7071fd0efb356dbab4
enrollment=88d8a84b818cd219a62788af1ad5fb0374de158611916e27ea2ba5582e8989ba
syncRealBinanceTrades_AST=c54e4e0818e855baef0d22bd44c48769a15190e1301f802dbc57b93b37290fc7
```

Exact parent→candidate delta: **2 files, 20 insertions / 4 deletions**:

```text
scripts/full-terminal-contract-test.mjs
scripts/lib/futures-profit-protection-verify-only-parity.mjs
```

No `api/`, `server/`, `migrations/`, `.github/`, `src/` or `ops/` change exists in that delta. Application/Worker/Partner/workflow/DB migration/Spot/scanner/strategy/Decision Engine therefore remain unchanged by FIX-D and by this diagnostic.

Pre-Phase3B→candidate union is the already-approved exact 16-path set, not an extra execution-harness modification:

```text
HANDOFF.md
api/_shared/futures-profit-protection-runtime.ts
api/copytrade.ts
docs/futures-profit-protection.md
reports/futures/pp-phase3b-verify-only-capability-2026-10-02.md
scripts/full-terminal-contract-test.mjs
scripts/futures-profit-protection-adapters-test.mjs
scripts/futures-profit-protection-automatic-scope-test.mjs
scripts/futures-profit-protection-enrollment-test.mjs
scripts/futures-profit-protection-safe-idle-sql-test.mjs
scripts/futures-profit-protection-safe-idle-test.mjs
scripts/futures-profit-protection-scope-test.mjs
scripts/futures-profit-protection-test.mjs
scripts/lib/futures-profit-protection-verify-only-parity.mjs
server/futures-profit-protection/worker.d.mts
server/futures-profit-protection/worker.mjs
```

## Implementation / proposed minimum future repair

**Actual implementation: NONE.** No environment patch, alias, import, mock, fallback, test weakening or source change occurred.

```text
REQUIRED_REPAIR_CLASS=TEST_ENVIRONMENT_INITIALIZATION
REQUIRED_REPAIR_FILES=
  scripts/futures-real-execution-fault-test.mjs
  scripts/lib/futures-profit-protection-verify-only-parity.mjs
```

1. In a separately authorized repair, update only the old isolated execution harness's initialization to use the actual Phase3B runtime boundary and its complete dependency closure. Keep the established offline transport/DB isolation; do not bootstrap Production dependencies, replace application functions, bypass capability denials or add a no-op effect helper. Preserve all five close-safety assertions and verify managed/unmanaged/VERIFY_ONLY behavior and actual fault injection.
2. Accompany that exact reviewed test-harness delta with an exact inventory/hash pin in the existing canonical parity contract. Its current line 48 requires the complete 16-path inventory; adding the fault-test file without a narrow accompanying contract update would itself be rejected. This is a closed test-scope update, not permission for application/runtime exceptions.

No need for an API, Worker, Partner, workflow, SQL, Strategy or shared pure-context change was found. Additional files or failures discovered during a future authorized repair require fresh scope review, not implicit permission here.

Future checks should also ensure negative transport tests genuinely reach their intended injected close failure. Existing CI test 50 passes its OPEN/no-cancel assertions, but the same earlier missing alias can prevent reaching its simulated transport failure. Its green result alone is not proof of that intended path. This is a test coverage caution, not a new observed failing test or an application defect claim.

## Tests executed / build result

- Local test suites, disposable SQL, TypeScript compilation, builds and Worker smoke: **NOT RUN in this diagnosis**.
- CI rerun/dispatch: **NO**.
- Existing exact official CI inspected: **126/131 PASS, 5 FAIL**.
- Existing exact pre-Phase3B fault batch independently inspected: **131/131 PASS, 0 FAIL**.
- Read-only Git diff/scope/source/hash/AST diagnostics: successful; source hashes unchanged; protected-path diff empty; diff-check clean.
- Later candidate CI PP/build stages: **SKIPPED**, not accepted.

## Git status / files changed / commit

- Candidate remains exact `0ac5d1db973837e1cff679753706ca0f193e0087`; parent unchanged; tracked/index clean, existing untracked `output/` preserved.
- Primary checkout preserves earlier dirty `HANDOFF.md` and unrelated/private untracked files.
- Source/tests/workflow/environment files changed by this task: **NONE**.
- Documentation only: this report and own new primary `HANDOFF.md` section.
- Application commit/stage/push/main write: **NONE**.
- Separate AI-Log report publication, if successful, is documentation only under standing contributor instructions; its verified publication SHA/link are reported in the final response and handoff separately.

## Production safety / limitations

No SSH/VPS command, DB connection, env/credential read, private or public exchange request, service action, artifact preparation, Guard, release, deployment, position/order/SL/TP/close or flag write occurred. Partner source/runtime was not altered.

Last supplied Production reference is `a0455626c0a54fb443f457e0a595a662974623fa`, Worker disabled/inactive/PID 0. This task **did not freshly inspect the server**: these are prior references, not newly proven live health/state. `REAL_PP=UNCHANGED` and `DEMO_PP=UNCHANGED` mean no flag change by this task. No unsafe command was used to claim fresh Production verification.

The static common-root proof is complete for the five recorded failures. It does not guarantee that an eventual repair leaves no other failing tests. No claim of profitability, strategy improvement or real exchange lifecycle acceptance is made.

## Requested final classification

```text
PHASE=PHASE-3C-FIX-E-DIAGNOSIS
CANDIDATE_SHA=0ac5d1db973837e1cff679753706ca0f193e0087
PARENT_SHA=edd47880d4f37acb116ff1e33cb74f1fbeff5452
CI_RUN=37027854829
CI_RESULT=126_PASS_5_FAIL
FAILURE_1=TEST_49_MISSING_DB_BINDING_ASSERT_881
FAILURE_2=TEST_51_MISSING_DB_BINDING_ASSERT_926
FAILURE_3=TEST_52_MISSING_DB_BINDING_ASSERT_949
FAILURE_4=TEST_54_MISSING_DB_BINDING_ASSERT_1005
FAILURE_5=TEST_56_MISSING_DB_BINDING_ASSERT_1066
PROFIT_PROTECTION_DB_ROOT_CAUSE=AST_VM_OMITS_MODULE_ALIAS_INITIALIZER_AND_RUNTIME_BRIDGE
SHARED_ROOT_CAUSE=YES
SHARED_FAILURES=1,2,3,4,5
BASELINE_COMPARISON=PRE_PHASE3B_131_PASS_0_FAIL_PARENT_STAGE_SKIPPED_FIX_D_TWO_PARITY_FILES_ONLY
PHASE3B_REGRESSION=NO
TEST_ENVIRONMENT_REGRESSION=YES
CI_ENVIRONMENT_REGRESSION=NO
PHASE3B_APPLICATION_CHANGED=NO
WORKER_CHANGED=NO
PARTNER_CHANGED=NO
CI_WORKFLOW_CHANGED=NO
DB_MIGRATION_CHANGED=NO
SPOT_CHANGED=NO
SCANNER_CHANGED=NO
STRATEGY_CHANGED=NO
DECISION_ENGINE_CHANGED=NO
REQUIRED_REPAIR_CLASS=TEST_ENVIRONMENT_INITIALIZATION
REQUIRED_REPAIR_FILES=scripts/futures-real-execution-fault-test.mjs;scripts/lib/futures-profit-protection-verify-only-parity.mjs
REPAIR_MINIMUM_SCOPE=REAL_CAPABILITY_BOUNDARY_INITIALIZATION_IN_OFFLINE_HARNESS_PLUS_EXACT_TEST_SCOPE_PIN_ONLY
CODE_CHANGED=NO
COMMIT=NONE
PUSH=NO
CI_RERUN=NO
ARTIFACT=NO
GUARD=NO
DEPLOYMENT=NO
PRODUCTION_TOUCHED=NO
DATABASE_MUTATION=NO
EXCHANGE_CALLS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_CHANGES=0
TP_CHANGES=0
CLOSE_ACTIONS=0
WORKER_START=NO
PARTNER_TOUCHED=NO
REAL_PP=UNCHANGED
DEMO_PP=UNCHANGED
FINAL_CLASSIFICATION=DIAGNOSIS_COMPLETE_SHARED_TEST_INITIALIZATION_BLOCKER
STOP
```

## Remaining issues / recommended next step

Stop here. A separate owner authorization is required for the two-file test-initialization/scope repair and its validation. No repair, application commit/push, CI rerun, artifact/Guard/release or Production operation follows this diagnosis.
