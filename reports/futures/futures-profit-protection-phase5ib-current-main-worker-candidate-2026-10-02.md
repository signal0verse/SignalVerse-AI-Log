# PHASE 5I-B — NEW CURRENT-MAIN PP WORKER CANDIDATE REPORT

## 1. Base Identity

Metadata: date 2026-10-02 (Asia/Kuala_Lumpur), final evidence collection 2026-10-01 19:24:53 UTC, task Phase 5I-B, module Futures, mode local implementation + candidate-branch publication + fresh Linux CI only, repository signal0verse/signalverse-main. Objective: add the exact approved scope repair and Worker entrypoint fix directly to current main, preserve all current-main content, then stop before promotion/deployment. Evidence below distinguishes executed tests from inspected source and untested live behavior.

```text
CURRENT_REMOTE_MAIN=da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f
EXPECTED_MAIN=da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f
BASE_VERIFIED=YES
NEW_BRANCH=codex/futures-pp-worker-symlink-20261002-main-current-v2
NEW_CANDIDATE_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
NEW_CANDIDATE_PARENT=da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f
PARENT_EQUALS_CURRENT_MAIN=YES
OLD_REJECTED_CANDIDATE=266134db0d93a27e49cf1219f4cd2418c124ce0e
OLD_PP_PARENT=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
HISTORICAL_FINANCIAL_BASE=8a3524bdf595b4883c0b2fd9e46df8d136be90d6
```

Safely fetched main and verified both origin/main and `git ls-remote` before reconstruction. Created the isolated v2 worktree directly at pinned main with LF checkout bytes. It was clean before applying changes. Remote main was reread immediately before the one application commit and again before/after candidate-only push; all reads matched the pinned main. The original root checkout's unrelated dirty HANDOFF/private/untracked work and all old branches/worktrees were preserved.

```text
WORKTREE=C:/Projects/SignalVerse-Main/tmp/futures-pp-worker-main-current-v2-20261002
LOCAL_MAIN_BEFORE=f5c843ef7bb32293255ea1a52308bc74fc388caf
LOCAL_MAIN_AFTER=f5c843ef7bb32293255ea1a52308bc74fc388caf
```

The v2 application commit is the only commit after pinned main; its parent is not the rejected old candidate or old PP parent.

## 2. Current-Main Preservation

Complete main delta from old PP parent: five paths, 137 insertions and 7 deletions:

```text
CURRENT_MAIN_DELTA_PATHS=
HANDOFF.md
docs/AI_HANDOFF.md
src/terminal/full-mount.tsx
src/terminal/trade-onboarding-i18n.ts
src/terminal/trade-onboarding.tsx

ONBOARDING_FILES_PRESERVED=YES
OLD_MAIN_CONTENT_REINTRODUCED=NO
```

Direct comparisons against pinned main prove exact content equality for AI_HANDOFF and all three onboarding files. HANDOFF receives only an inserted PP candidate note after its title; its entire original main body is retained verbatim and in order. No current-main content is reverted or exempted by an onboarding whitelist. The dedicated PP document likewise retains its entire original body. Exact-current-main preservation, historical financial/PP invariants, and zero-introduced-diagnostic checks remain active.

## 3. Candidate Scope

```text
FILES_CHANGED=5
INSERTIONS=182
DELETIONS=7
```

| Changed path | Direct reason |
| --- | --- |
| server/futures-profit-protection/worker.mjs | Only approved canonical/fail-closed entrypoint comparison |
| scripts/futures-profit-protection-test.mjs | Exact already-approved nine-case disposable bootstrap regression coverage |
| scripts/futures-profit-protection-scope-test.mjs | Exact unmodified Phase 5I-A repair for historical/current-main separation |
| HANDOFF.md | Insert candidate-only current-main reconstruction receipt without replacing prior handoff |
| docs/futures-profit-protection.md | Insert bootstrap behavior, validation and separate promotion/deploy boundaries |

The approved scope repair was imported from the retained local Phase 5I-A patch and verified against the existing repaired file's full SHA-256, not recreated from memory or weakened. Only the isolated Worker/test diff from the rejected commit was read as reference and applied; no cherry-pick, merge, rebase, old-tree import, or history rewrite occurred.

Source identity checks:

```text
SCOPE_REPAIR_SHA256=a6674cf1b22afb91271f8c95d621294c09fb5de4fbca68dce4745ccb065fcc0b
WORKER_SHA256=fa8a6ec35b007515876387eebd04aa31bb0d5c81cb63ad14dcfd744a62aabe17
WORKER_TEST_SHA256=71aa6ba1139861615d53001ff2f32746a8e1b7f9428074a4adf62beb77963b8f
```

Worker and Worker-test canonical source contents exactly match the previously approved Git blobs. All other runtime sources, strategy, engine, risk, scanner, Fast Trader, adapters, reconciliation, execution/SL/TP/policy, migrations, units/scheduler, workflows and secrets have no candidate diff.

## 4. Worker Fix

CONFIRMED source root cause: the original Worker compared a raw argv URL through the app symlink to a canonical module URL under the release directory. That difference prevented bootstrap even with the explicit flag. The unchanged old source reproduces a clean symlink no-op in the disposable child-process fixture.

```text
WORKER_FIX_APPLIED=YES
ENTRYPOINT_CANONICALIZATION=YES (both entry path and module path)
REALPATH=realpathSync
FILEURLTOPATH=YES
PATHTOFILEURL=YES
FAIL_CLOSED=YES (missing/invalid/unresolvable path returns false)
WORKER_FLAG_PRESERVED=YES
BOOT_LOGIC_PRESERVED=YES
MONITOR_PRESERVED=YES
ADAPTERS_PRESERVED=YES
WORKER_RUNTIME_ARCHITECTURE_CHANGED=NO
```

An exact source-block comparison proves that the existing `bootProfitProtectionWorker` function, including flag check and bundled runtime import, is unchanged. Success/failure handling remains unchanged. No cadence, monitor, position management, financial/state-machine or policy change is made. No Production Worker is invoked by the tests; the child processes import only a disposable stand-in that prints an import count.

## 5. Tests

```text
LOCAL_NODE=v22.23.3
WORKER_BOOTSTRAP=9/9 PASS
PP_CORE=52/52 PASS (includes the nine bootstrap cases)
PP_ADAPTER=37/37 PASS
PP_UI=4/4 PASS
PP_COMBINED=93/93 PASS (do not add bootstrap subset twice)
PP_SQL=16/16 PASS (fresh local PostgreSQL 18.6)
SCOPE=PASS (exit 0, --types)
ONBOARDING_BASELINE=PASS
NEGATIVE_CONTROLS=5/5 PASS (fresh isolated reconstructed copy)
FRONTEND_DIAGNOSTICS=71 baseline / 71 candidate
API_DIAGNOSTICS=30 baseline / 30 candidate
INTRODUCED_DIAGNOSTICS=0
WEB_BUILD=PASS
API_BUILD=PASS (14/14 bundles, write:false)
ADMIN=PASS (build and exact existing strict typecheck)
LEGACY_BASELINE_FAILURES=NOT RUN LOCALLY; all three tests unchanged
```

Executed commands, using the existing portable Node 22 runtime:

```text
node --check server/futures-profit-protection/worker.mjs
node --check scripts/futures-profit-protection-test.mjs
node --test --test-name-pattern="worker bootstrap:" scripts/futures-profit-protection-test.mjs
node --test scripts/futures-profit-protection-test.mjs scripts/futures-profit-protection-adapters-test.mjs scripts/futures-profit-protection-ui-test.mjs
node scripts/futures-profit-protection-scope-test.mjs --types
FUTURES_PROFIT_PROTECTION_TEST_PG_BIN=<local PostgreSQL 18 bin> node scripts/futures-profit-protection-sql-test.mjs
node node_modules/vite/bin/vite.js build
node node_modules/vite/bin/vite.js build --config vite.admin.config.ts
node node_modules/typescript/bin/tsc --noEmit --strict --skipLibCheck --jsx react-jsx --target ES2022 --module ESNext --moduleResolution bundler --allowJs admin/src/main.tsx
```

The API validation uses the existing esbuild CI settings with all 14 actual handler entrypoints and `write:false`; no API bootstrap or runtime activation occurs. The SQL suite creates a new private loopback cluster on a random port, exercises synthetic records only, then stops/removes that exact cluster. It reports productionConnections=0 and exchangeActions=0. It is not a Production migration.

Bootstrap coverage uses actual temporary files and child processes: pre-fix reproduction, canonical direct invocation, production-shaped symlink/release invocation, preserved symlink main URL, non-main import, missing argv, invalid paths, missing/wrong flag, and import failure. Missing/wrong flags are separately asserted inside their shared case. Windows uses directory junctions; fresh Linux CI must independently execute actual directory symlinks. No case was removed or weakened.

Fresh negative controls run the same repaired scope gate on the isolated detached current-main copy with the exact approved Worker/test changes. All five actual failing processes return exit 1 with the expected specific assertion: unexpected untracked fixture, onboarding mutation, protected Engine mutation, frozen financial/execution source mutation, and existing handoff overwrite. The control harness passes only when that exact rejection is observed. All synthetic changes/fixtures were removed; the restored temporary copy passes again. The candidate itself never receives those mutations. Embedded exact-content controls also accept two approved Worker/test blobs and reject two altered blobs; PP parity tests independently reject unrelated Spot changes.

Initial local setup problems are retained, not hidden: the sanitized sandbox-user bootstrap harness initially passed 8/9 but Git denied access to the historical blob due to ownership; running the identical test as the checkout owner passed 9/9, without Git-config or assertion changes. The shared ancestor dependency directory initially lacked the already-declared locked `@types/qrcode`, so the first admin typecheck failed TS7016. A fresh isolated `npm ci --ignore-scripts --no-audit --no-fund` installed 272 packages from the unchanged lockfile. PP, scope/types, admin typecheck and Web/Admin/API checks were repeated successfully with the complete candidate dependencies. No application/type declaration, lockfile, baseline test or build configuration was edited.

Warnings: existing Windows Git LF/CRLF and inaccessible global-ignore warnings; Vite reports the existing large minified web chunk. Neither is suppressed. All checked-in candidate bytes remain the reviewed Git source; no release artifact is built or approved here. The three legacy baseline tests are preserved and not represented as newly passing tests.

## 6. Diff Safety

```text
CURRENT_MAIN_TO_CANDIDATE_DIFF=
 HANDOFF.md                                       |  7 ++
 docs/futures-profit-protection.md                | 10 +++
 scripts/futures-profit-protection-scope-test.mjs | 64 +++++++++++++++-
 scripts/futures-profit-protection-test.mjs       | 95 +++++++++++++++++++++++-
 server/futures-profit-protection/worker.mjs      | 13 +++-
 5 files changed, 182 insertions(+), 7 deletions(-)

UNAUTHORIZED_FILES=NONE
OLD_MAIN_CONTAMINATION=NONE
```

`git diff --check` and staged diff checks pass; all candidate changes were inspected before the single commit. Scope and exact-source assertions pass. Candidate worktree is clean after committing; compiled outputs/dependencies are ignored and not committed.

Old rejected candidate comparison is intentionally different at seven paths: HANDOFF, AI_HANDOFF, dedicated PP docs, repaired scope test, and three onboarding paths. Worker/test sources are exactly equal. Those seven differences consist of retained intervening current-main content plus the new scope repair and candidate documentation, not reintroduction of the old tree. This comparison is evidence of intent preservation, not ancestry reuse.

## 7. Git

```text
COMMIT_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
COMMIT_SUBJECT=fix(futures): harden profit protection worker entrypoint on current main
PUSHED_BRANCH=codex/futures-pp-worker-symlink-20261002-main-current-v2
REMOTE_SHA_MATCH=YES
APPLICATION_COMMITS_CREATED=1
MAIN_PUSH=NO
MERGE=NO
FORCE_PUSH=NO
OLD_CANDIDATE_MODIFIED=NO
```

Pushed only the exact candidate SHA to the new branch with a normal non-force refspec. Remote reads confirm the new branch points to that SHA, main remains pinned, and the rejected old branch remains `266134...`. No PR was created or merged. No amend/rebase/squash/reset/history rewrite occurred.

Inspected sources include AGENTS/CLAUDE/current handoffs/safe runbook/PP document; current Worker and the narrowly scoped approved Worker/test diff; PP policy/lifecycle/execution, adapter/UI/SQL tests and direct parity/pure-context helpers; exact approved scope repair; package/lockfile/tsconfigs/Vite configs; and existing CI/workflow trigger definitions. CI workflow is unchanged and has no deployment steps; artifact/release workflows were not invoked.

## 8. Fresh CI

```text
CI_RUN_ID=36913279166
CI_JOB_ID=110540970333
CI_HEAD_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
CI_HEAD_MATCH=YES
CI_BRANCH=codex/futures-pp-worker-symlink-20261002-main-current-v2
CI_EVENT=workflow_dispatch
CI_WORKFLOW=Production CI (.github/workflows/production-ci.yml)
CI_STARTED_AT=2026-10-01T19:18:13Z
CI_CONCLUSION=SUCCESS
CI_JOB_STARTED_AT=2026-10-01T19:18:18Z
CI_JOB_COMPLETED_AT=2026-10-01T19:22:40Z
CI_RUN_UPDATED_AT=2026-10-01T19:22:41Z
CI_RUNNER=ubuntu-latest / GitHub Actions 1000000967 / GitHub Actions runner group
NODE_VERSION=v22.23.3
CI_JOBS=1/1 SUCCESS
CI_STEPS=38/38 SUCCESS
CI_FAILED_STEPS=0
CI_SKIPPED_STEPS=0
PP_CI=93/93 PASS; zero fail/skip
WORKER_CI=9/9 PASS (actual Linux directory symlinks)
PP_SQL_CI=16/16 PASS (fresh PostgreSQL 16.15)
SCOPE_CI=PASS
BUILD_CI=PASS (partner/full terminal, admin typecheck, Web/Admin, API, artifact verification)
DIAGNOSTICS_CI=frontend 71/71; API 30/30; introduced=0
```

Run: https://github.com/signal0verse/signalverse-main/actions/runs/36913279166

Only the existing Production CI workflow was dispatched on the exact published candidate branch, because its push trigger is limited to main/master. The run metadata independently confirms its exact head SHA and final success. The older run 36901769380 is not reused. No CI retry or test weakening occurred.

Independent full-log verification records Node `v22.23.3` at `2026-10-01T19:18:23Z`; nine actual bootstrap `ok` cases (38–46) at `19:20:21Z`; PP summary 93 pass / 0 fail / 0 skipped; exact current-main/future-delta preservation at `19:20:23Z`; frontend 71/71 and zero introduced at `19:20:56Z`; API 30/30 and zero introduced at `19:21:13Z`; SQL 16/16 and stopped/removed disposable cluster at `19:22:18Z`. The test fixture never imports the actual application bundle on Linux either. The nine Worker cases are a subset of the 93, not additional trade evidence.

All actual job step results (numbers preserved from GitHub; post steps use 69–71):

| Number | CI step | Result |
| --- | --- | --- |
| 1 | Set up job | SUCCESS |
| 2 | Check out repository | SUCCESS |
| 3 | Set up Node.js | SUCCESS |
| 4 | Install dependencies | SUCCESS |
| 5 | Install isolated admin runtime dependencies | SUCCESS |
| 6 | Test independent admin auth and live transport offline | SUCCESS |
| 7 | Test partner host context and unchanged Telegram authentication offline | SUCCESS |
| 8 | Build reusable partner terminal (no activation) | SUCCESS |
| 9 | Test isolated internal paper and exact original UI parity | SUCCESS |
| 10 | Build full terminal candidate (no activation) | SUCCESS |
| 11 | Typecheck standalone admin UI | SUCCESS |
| 12 | Test learning extraction without live services | SUCCESS |
| 13 | Test GitHub event transport without live services | SUCCESS |
| 14 | Test historical timing without live services | SUCCESS |
| 15 | Test futures simulation exits without live services | SUCCESS |
| 16 | Test futures simulation chronology without live services | SUCCESS |
| 17 | Test futures simulation accounting without live services | SUCCESS |
| 18 | Test futures simulation capital reservation without live services | SUCCESS |
| 19 | Test versioned simulation analytics without live services | SUCCESS |
| 20 | Test real execution faults with isolated transports | SUCCESS |
| 21 | Test opt-in Futures Profit Protection without private services | SUCCESS |
| 22 | Test Futures Pro scheduler deadlines and failure rotation without services | SUCCESS |
| 23 | Test Futures Market Discovery without services | SUCCESS |
| 24 | Test whale data and watchlist without live services | SUCCESS |
| 25 | Test stablecoin engine (Binance spot, demo-only) without live services | SUCCESS |
| 26 | Test stablecoin market data collector (read-only, no trading) without live services | SUCCESS |
| 27 | Test prediction market autonomous engine without live services | SUCCESS |
| 28 | Install disposable SQL test runtime | SUCCESS |
| 29 | Test durable entry claims in a new private PostgreSQL cluster | SUCCESS |
| 30 | Test Profit Protection close ownership in disposable PostgreSQL | SUCCESS |
| 31 | Test Whale Demo pipeline and transactions in disposable PostgreSQL | SUCCESS |
| 32 | Test admin monitoring grants in a new private PostgreSQL cluster | SUCCESS |
| 33 | Build web application | SUCCESS |
| 34 | Bundle server API handlers | SUCCESS |
| 35 | Verify expected artifacts | SUCCESS |
| 69 | Post Set up Node.js | SUCCESS |
| 70 | Post Check out repository | SUCCESS |
| 71 | Complete job | SUCCESS |

CI warnings, not suppressed: Node's existing SQLite ExperimentalWarning in unrelated isolated admin/paper tests; the existing Vite web chunk-size warning; GitHub's ubuntu-latest image migration annotation for October 19, 2026. These are not failing assertions. The known three legacy baseline scripts were not added/modified/dispatched individually and are not claimed repaired. All required unchanged workflow gates passed.

## 9. Production Safety

```text
PRODUCTION_DEPLOYED=NO
WORKER_STARTED=NO
WORKER_ENABLED=NO
REAL_PP=UNCHANGED
DEMO_PP=UNCHANGED
EXCHANGE_ACTIONS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_TP_ACTIONS=0
PRODUCTION_DATABASE_CHANGED=NO
VPS_CHANGED=NO
GUARD_ACTIONS=0
ARTIFACT_PREPARATION=NO
```

These are this task's action-scope statements, not a new live private-account attestation. No VPS/Production/database/exchange access or mutation occurred. The last independently verified Production identity in the preceding phase is `9de1fb13966bb4b2c76dc8efa6a21334d86aacdf`; this phase does not reread live runtime or flags and does not claim new live bootstrap/monitor verification. Disposable fake runtime imports and local SQL records are not actual Production Worker activation or trading evidence.

## 10. Final Result

```text
PHASE 5I-B PASSED — NEW CANDIDATE CREATED FROM CURRENT MAIN AND FRESH CI PASSED — READY FOR PHASE 5J
```

Fresh exact-candidate CI and independent log/step verification are complete. Stop here for the separately authorized Phase 5J promotion-safety review. No main promotion, artifact/Guard, deployment, Worker installation/start/enable, Real/Demo PP activation or trading lifecycle is authorized. Source and disposable test success prove neither profitability nor actual Production bootstrap/monitor/private-account exit behavior. No unresolved candidate test failure remains; the documented initial local permission/dependency setup failures were resolved without source/config/assertion changes.
