# PHASE 5J — PROFIT PROTECTION PROMOTION SAFETY AUDIT

## Metadata / executive result

- Date: 2026-10-02, Asia/Kuala_Lumpur; UTC evidence date: 2026-10-01.
- Task ID: Phase 5J.
- Module: Futures Profit Protection.
- Mode: READ-ONLY PROMOTION SAFETY AUDIT; report-only publication to the separate AI-Log repository.
- Application repository: signal0verse/signalverse-main.
- Candidate branch: codex/futures-pp-worker-symlink-20261002-main-current-v2.
- Candidate starting/ending SHA: 66f3ac2e89d1c40543851c6a9b1f46318d6f6a12, unchanged.
- Objective: independently audit the already-created Phase 5I-B candidate and current Production safety before any separate promotion authorization. No implementation or repair.

```text
FINAL=PHASE 5J PASSED — PROMOTION SAFETY AUDIT PASSED
```

Candidate is eligible to REQUEST a separate promotion authorization.

This result is NOT a promotion, deployment, live Worker bootstrap acceptance, PP activation, private-account execution acceptance, or profitability claim.

### Evidence timestamps

| Evidence | UTC |
| --- | --- |
| First bounded VPS snapshot starts | 2026-10-01T19:37:30.319343498Z |
| First PP control read | 2026-10-01T19:37:30.813943Z |
| First VPS snapshot ends | 2026-10-01T19:37:30.827997619Z |
| Independent source assertions complete | 2026-10-01T19:39:13.387Z |
| Existing exact-candidate CI reverified | 2026-10-01T19:40:17.444Z |
| Final aggregate PP DB read | 2026-10-01T19:41:08.156704Z |
| Final VPS snapshot starts | 2026-10-01T19:41:49.693902719Z |
| Journal window ends | 2026-10-01T19:41:49.773Z |
| Final VPS snapshot ends | 2026-10-01T19:41:50.960074185Z |
| Final local clean/scope-repair identity check | 2026-10-01T19:43:19.373Z |

Remote main and both candidate branches were read with `git ls-remote` at the beginning and again after source, CI and VPS inspection; all identities below matched on both reads. Journal coverage starts at 2026-10-01T19:25:00Z, conservatively before this task's VPS inspection; it is not an invented exact task-start timestamp.

## 1. Remote Git state / ancestry

```text
REMOTE_MAIN=da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f
CANDIDATE=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
CANDIDATE_BRANCH=codex/futures-pp-worker-symlink-20261002-main-current-v2
CANDIDATE_PARENT=da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f
MERGE_BASE=da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f
INTENDED_CANDIDATE_COMMITS_AHEAD=1
UNEXPECTED_COMMITS=0
OLD_REJECTED_CANDIDATE=266134db0d93a27e49cf1219f4cd2418c124ce0e
OLD_PP_PARENT=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
```

Actual `git rev-list --reverse main..candidate` contains ONLY the exact candidate SHA. `git show -s --format='%H%n%P%n%s'` proves a single direct parent at the pinned current main, not either old identity. Both old identities remain legitimate historical references/ancestors where required; neither is the new candidate's immediate base. The old rejected remote branch is still unchanged at its old SHA.

The isolated candidate worktree is clean. Root checkout's pre-existing dirty HANDOFF and private/untracked work are retained and were not stashed, reset, cleaned, staged or committed. No branch pointer was moved by this phase.

## 2. Exact candidate diff / current-main preservation

```text
FILES_CHANGED=5
INSERTIONS=182
DELETIONS=7
UNAUTHORIZED_FILES=NONE
```

| Approved changed file | Exact purpose |
| --- | --- |
| server/futures-profit-protection/worker.mjs | Canonical, fail-closed entrypoint recognition only |
| scripts/futures-profit-protection-test.mjs | Exact approved nine-case disposable bootstrap coverage |
| scripts/futures-profit-protection-scope-test.mjs | Exact approved Phase 5I-A contract repair |
| HANDOFF.md | Inserted candidate-only receipt; previous main body preserved |
| docs/futures-profit-protection.md | Inserted bootstrap/test/release-boundary note; previous body preserved |

```text
 HANDOFF.md                                       |  7 ++
 docs/futures-profit-protection.md                | 10 +++
 scripts/futures-profit-protection-scope-test.mjs | 64 +++++++++++++++-
 scripts/futures-profit-protection-test.mjs       | 95 +++++++++++++++++++++++-
 server/futures-profit-protection/worker.mjs      | 13 +++-
 5 files changed, 182 insertions(+), 7 deletions(-)
```

The complete diff was inspected. Git byte comparisons independently prove that `src/terminal/full-mount.tsx`, `src/terminal/trade-onboarding-i18n.ts`, `src/terminal/trade-onboarding.tsx` and `docs/AI_HANDOFF.md` exactly equal current main. HANDOFF and the PP document preserve the title and entire previous main body verbatim, in order; only directly relevant notes are inserted.

The current-main tree has 716 files; all 711 paths outside the five-file delta are unchanged. This is exact inventory protection, not an expanded onboarding exception. `git diff --check main candidate` passes.

Comparison with the rejected candidate differs at seven paths: HANDOFF, AI_HANDOFF, PP documentation, scope test and the three onboarding paths. Worker and Worker-test content equal the exact approved historical blobs. These seven differences retain current-main changes and the approved scope repair; they do not reintroduce the old tree.

## 3. Worker source verification

CONFIRMED: the only runtime change is entrypoint recognition. Both the argv entry path and module URL resolve through `realpathSync`, `fileURLToPath` and `pathToFileURL` before equality comparison. Missing, wrong-type, invalid or unresolvable paths return false; there is no fallback bootstrap.

Exact source-block comparisons prove:

```text
CANONICAL_ENTRY_AND_MODULE_COMPARISON=YES
REALPATHSYNC=YES
FILEURLTOPATH=YES
PATHTOFILEURL=YES
FAIL_CLOSED=YES
EXPLICIT_WORKER_FLAG_REQUIRED=YES (exact value 1)
BOOT_FUNCTION_UNCHANGED=YES
SUCCESS_FAILURE_HANDLING_UNCHANGED=YES
MONITOR_UNCHANGED=YES
ADAPTERS_UNCHANGED=YES
PURE_POLICY_UNCHANGED=YES
WORKER_RUNTIME_ARCHITECTURE_CHANGED=NO
```

The existing runtime import and Worker flag check are identical to main. The bottom `.then`/`.catch` handling is identical. Git blob comparisons confirm unchanged copytrade runtime, policy/lifecycle/execution modules, Decision Engine, Risk, market discovery, unit, workflow and strategy history.

No new Strategy, Engine, AI exit, TP1/TP2/TP3, partial close, dynamic SL/TP, Binance cancel/create replacement, scanner/Fast Trader dependency, venue decision logic or exchange API is introduced. This is not an audit claiming that every inherited financial feature is defect-free; it proves this candidate does not change those features.

```text
CANDIDATE_WORKER_SHA256=fa8a6ec35b007515876387eebd04aa31bb0d5c81cb63ad14dcfd744a62aabe17
CANDIDATE_WORKER_TEST_SHA256=71aa6ba1139861615d53001ff2f32746a8e1b7f9428074a4adf62beb77963b8f
```

## 4. Worker test contract

All nine approved cases are present and unchanged from the approved test blob:

1. Frozen pre-fix source reproduces the clean symlink no-op.
2. Canonical direct invocation imports the fake runtime exactly once.
3. Production-shaped app/release symlink imports exactly once.
4. Preserved symlink main URL normalizes both identities.
5. Non-main import cannot bootstrap, even with the flag.
6. Missing argv fails closed in helper and actual imported module.
7. Invalid/unresolvable entry/module paths fail closed.
8. Absent or wrong flag rejects before any fake runtime import.
9. Failed runtime import retains the existing failure exit.

These tests use actual temporary filesystem paths, child Node processes and a real symlink on Linux (junction on Windows), not merely source-text checks. Child environments are restricted; the disposable runtime only prints an import count and contains no app/DB/exchange/network/environment-file logic. Missing/wrong flag and failure cases retain explicit exit-code and absence-of-import assertions. Successful cases demand exactly one import and one bootstrap message.

The entire existing test body from `const epoch=...` onward equals main byte-for-byte. Adapter, UI and SQL test files likewise equal main. No case or failure condition was weakened. Existing exact-candidate Linux evidence independently has nine `ok` bootstrap cases and 93/93 combined PP results.

## 5. Scope contract verification

The candidate scope test, the original retained local Phase 5I-A repair and the approved recorded digest all match:

```text
SCOPE_REPAIR_SHA256=a6674cf1b22afb91271f8c95d621294c09fb5de4fbca68dce4745ccb065fcc0b
CURRENT_MAIN_REFERENCE=da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f
HISTORICAL_FINANCIAL_BASE=8a3524bdf595b4883c0b2fd9e46df8d136be90d6
OLD_PP_PARENT_REFERENCE=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
APPROVED_WORKER_CONTENT_REFERENCE=266134db0d93a27e49cf1219f4cd2418c124ce0e
```

Inspected the complete repaired contract. It separately checks historical accepted PP inventory/financial parity, pinned current-main ancestry, exact current-main preservation, the narrow future five-path delta, unauthorized/untracked changes, exact approved Worker/test content, documentation-body retention and zero introduced TypeScript diagnostics. Historical references do not define the new candidate base.

The retained 5I-B negative-control evidence is five actual rejecting scope processes: unauthorized untracked source, onboarding mutation, protected Engine mutation, frozen financial/execution mutation and overwritten handoff. All synthetic changes were restored in that isolated fixture. This phase did not recreate fixtures or mutate source to rerun them.

## 6. Existing test / build / fresh exact-candidate CI evidence

No tests, builds or CI were dispatched/rerun in Phase 5J. Existing Phase 5I-B execution evidence was reused where sufficient; the exact CI metadata, all step conclusions and relevant full-log records were independently reread through read-only GitHub calls.

| Gate | Actual retained evidence | Phase 5J verification |
| --- | --- | --- |
| Worker bootstrap | 9/9 | Nine actual Linux `ok` records verified |
| PP core | 52/52, including nine bootstrap cases | Prior local result retained; unchanged test body verified |
| PP adapters | 37/37 | Prior local result retained; file unchanged |
| PP UI | 4/4 | Prior local result retained; file unchanged |
| Combined PP | 93/93, fail=0, skip=0 | Actual Linux TAP summary verified |
| PP SQL | 16/16 | Actual Linux summary verified; productionConnections=0, exchangeActions=0 |
| Scope | PASS | Exact-source identity and Linux scope output verified |
| Onboarding preservation | PASS | Direct canonical Git byte equality independently verified |
| Negative controls | 5/5 | Retained isolated-process evidence, not rerun |
| Frontend diagnostics | 71 baseline / 71 candidate | Linux JSON independently verified; introduced=[] |
| API diagnostics | 30 baseline / 30 candidate | Linux JSON independently verified; introduced=[] |
| Web build | PASS | Exact-run successful step verified |
| API build | 14/14 local bundles; exact-run expected bundle count verified | Existing local record plus successful CI bundle/verification steps |
| Admin build/typecheck | PASS | Existing local build record plus successful CI typecheck/artifact steps |

The Worker subset must not be added again to the combined 93. SQL tests use disposable clusters: recorded local PostgreSQL 18.6 and Linux PostgreSQL 16.15, not the Production database.

```text
CI_RUN_ID=36913279166
CI_HEAD_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
CI_HEAD_BRANCH=codex/futures-pp-worker-symlink-20261002-main-current-v2
CI_WORKFLOW=Production CI
CI_PATH=.github/workflows/production-ci.yml
CI_EVENT=workflow_dispatch
CI_CONCLUSION=success
CI_JOB_ID=110540970333
CI_JOB=Build web and API runtime
CI_JOBS=1/1 SUCCESS
CI_STEPS=38/38 SUCCESS
CI_FAILED_STEPS=0
CI_SKIPPED_STEPS=0
CI_RUNNER=ubuntu-latest / GitHub Actions 1000000967
CI_NODE=v22.23.3
CI_STARTED_AT=2026-10-01T19:18:13Z
CI_JOB_STARTED_AT=2026-10-01T19:18:18Z
CI_JOB_COMPLETED_AT=2026-10-01T19:22:40Z
CI_RUN_UPDATED_AT=2026-10-01T19:22:41Z
```

[Exact-candidate CI](https://github.com/signal0verse/signalverse-main/actions/runs/36913279166). This existing fresh run belongs to the new candidate, not the rejected old candidate. It is candidate-branch CI, not a new main push CI or release run. The workflow source is unchanged and has build/test steps only; no release mechanism was invoked.

Warnings remain recorded: SQLite ExperimentalWarning in unrelated isolated tests, existing Vite chunk-size warning and the future ubuntu-latest image migration annotation. Initial local Git ownership and dependency-installation problems were resolved in 5I-B without source/config/assertion changes; they are not hidden new runtime acceptance.

### Known legacy baseline limitations

The three legacy files are byte-identical to main and were NOT run/fixed here or added to this CI:

- History detail: recorded prior paired baseline/candidate 37 passes / 12 failures.
- Liquidation feasibility: recorded prior paired 61 passes / 2 failures.
- Pro timeframes: recorded prior paired run reached 15 passes and the same expected=2 / actual=3 assertion.

Their disposition remains BASELINE_EXISTING_FAILURE. Exact CI success is not an assertion that all repository tests pass.

## 7. Production / Worker configuration and unchanged-state evidence

Fresh marker, app/admin symlinks and active process cwd independently agree before and after:

```text
PRODUCTION_RELEASE_SHA=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
APP_RELEASE=/opt/signalverse/releases/9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
ADMIN_RELEASE=/opt/signalverse-admin/releases/9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
```

Source main and deployed runtime are separate identities. The candidate is NOT installed; the server retains the pre-fix Worker source. This is expected for an undeployed candidate, not a failed candidate startup test.

| Service | State before/after | PID before/after | NRestarts before/after | Existing start UTC |
| --- | --- | --- | --- | --- |
| signalverse.service | active/running | 3051115 / 3051115 | 0 / 0 | 2026-10-01 16:35:55 |
| signalverse-admin.service | active/running | 3051068 / 3051068 | 0 / 0 | 2026-10-01 16:35:47 |
| signalverse-observer.service | active/running | 3051067 / 3051067 | 0 / 0 | 2026-10-01 16:35:46 |
| postgrest.service | active/running | 1960930 / 1960930 | 0 / 0 | 2026-09-23 20:37:29 |
| signalverse-futures-profit-protection.service | inactive/dead; disabled | 0 / 0 | 0 / 0 | No current start/exit timestamps |

Worker LoadState=loaded, Result=success, ExecMainCode=0, ExecMainStatus=0. No service action or restart activity was caused by this phase. No application/admin/observer restart occurred between snapshots.

```text
WORKER_EXECSTART=/usr/bin/node /opt/signalverse/app/server/futures-profit-protection/worker.mjs
WORKER_WORKINGDIRECTORY=/opt/signalverse/app
WORKER_FRAGMENT=/etc/systemd/system/signalverse-futures-profit-protection.service
WORKER_DROPIN=/etc/systemd/system/signalverse-futures-profit-protection.service.d/override.conf
WORKER_ENVIRONMENT_FILE=/etc/signalverse/signalverse.env
FUTURES_PROFIT_PROTECTION_WORKER=1 (unit configuration)
ENVIRONMENT_FILE_WORKER_FLAG=NO_OVERRIDE
MAIN_ADMIN_OBSERVER_PROCESS_WORKER_FLAG=ABSENT
WORKER_RUNNING=NO
WORKER_ENABLED=NO
```

Only the requested flag was extracted from configuration/process metadata; environment files were not sourced or disclosed. The stopped Worker has no live process environment to attest; this is configured flag evidence, not active-process evidence. Main/admin/observer do not carry this flag.

All four hashes match before and after; unit/drop-in/source also match prior independently recorded evidence:

| File | SHA-256 before = after |
| --- | --- |
| Installed Worker unit | d562e0803f18a0972f8f643dc6998c7cef478f2b922236ed0eb923600233f66d |
| Installed Worker drop-in | 8abd593c611846bf1d2a3967bdf3a970d3fb85e00d277bec9deb2e41abf16695 |
| Existing application environment file | 8f6532d0ab00e69e1b0f9637e5ec896724563ae34126a3830f8ceb232cfa0af3 |
| Existing deployed Worker source | 7c0bd80f7320016e3d01ba1b5cdd737fd87a3f60f81338654cb01f3983d55faf |

Fresh DB control evidence on both reads: exactly one control row, real_enabled=false, demo_enabled=false, updated_at unchanged at 2026-10-01T11:30:19.817128Z.

```text
REAL_PP=OFF
DEMO_PP=OFF
```

## 8. No trading activity / evidence limits

Production database was inspected only with `BEGIN READ ONLY`, lock_timeout=2s, statement_timeout=5s, explicit ROLLBACK, no psql startup file, and aggregate/control SELECTs. Actual current_database=signalverse_cutover2 and transaction_read_only=on were independently read. No credentials, account identities or private trade rows were output.

```text
ALL_CLOSE_INTENTS=0
PP_CLOSE_INTENTS=0
UNCERTAIN_CLOSE_INTENTS=0
PP_POSITION_STATE_ROWS=0
ENABLED_PP_POSITION_STATE_ROWS=0
PP_CLOSED_ROWS_ALL_TIME=0
PP_CLOSED_ROWS_IN_AUDIT_WINDOW=0
WORKER_JOURNAL_ENTRIES_IN_WINDOW=0
WORKER_RUNTIME_EVENTS_IN_WINDOW=0
WORKER_START_STOP_JOURNAL_ENTRIES_IN_WINDOW=0
APPLICATION_PP_JOURNAL_EVENTS_IN_WINDOW=0
```

Journal window: 2026-10-01T19:25:00Z through 2026-10-01T19:41:49.773Z. An independent unfiltered JSON read of the four units contained 17 ordinary entries, zero Worker entries and zero PROFIT_PROTECTION messages. No message content/private identifiers were published.

Collection detail: the first `journalctl --grep=PROFIT_PROTECTION` pipeline yielded an empty parsed result and exit 1, so shell pipefail stopped that collector before its final runtime snapshot. This was a no-match collection result, not a Worker crash or failed invariant. The subsequent read-only, unfiltered JSON query independently verified zero matches and exited 0; a separate final runtime snapshot completed. No repair, restart, source/test change or failure-suppression operation occurred.

This audit made no exchange calls, order submissions/cancellations/replacements, position changes, close actions or SL/ONE TP changes. Database/journal evidence supports zero PP activity in the inspected scope. It does not prove that other naturally running jobs or the owner could not change an exchange account.

NATIVE EXCHANGE STATE NOT VERIFIED IN THIS AUDIT

No private exchange APIs were called merely to manufacture that attestation. The zero-action declarations below describe THIS audit, not a fabricated account-wide native state comparison.

## 9. Real / Demo / Simulator architecture boundary

Candidate remains EXIT-ONLY. All entry, direction, original SL, single TP, sizing, Decision Engine, Strategy, AI Supervisor, scanner and Fast Trader source paths equal current main. No new policy, execution adapter or exchange logic is added.

Inspected inherited source confirms `runProfitProtectionPosition` injects the existing observation/position/close ports into `driveProfitProtection`; Real/Demo admission retains its separate authoritative mode/per-position gates. `driveProfitProtection` calls the same pure `evaluateProfitProtection`; `replayProfitProtection` folds that same function over timestamped executable observation events. Only runtime execution/evidence adapters differ.

This common policy contract is not proof of equal realized results across venues/modes. Demo funding remains explicitly unmodeled, and the existing OHLC Simulation Lab is not replaced or newly wired to invent an intrabar PP tape. Simulator parity refers to the timestamped pure-policy event replay, not a fabricated historical fill path. All these boundaries are unchanged.

## 10. Promotion prerequisite matrix

| Check | Result | Evidence |
| --- | --- | --- |
| A. Direct current-main base | PASS | Exact single parent and merge-base |
| B. Exact candidate scope | PASS | Five paths, 182 additions / 7 deletions |
| C. Onboarding preserved | PASS | Direct Git byte equality and documentation-body preservation |
| D. Approved Worker fix | PASS | Exact approved blob; original boot/handling preserved |
| E. Worker tests valid | PASS | Nine genuine filesystem/child-process cases; Linux records |
| F. Scope contract valid | PASS | Exact approved hash; complete contract inspected |
| G. Fresh candidate CI | PASS | Existing run 36913279166, exact SHA, 38/38 successful steps |
| H. Current Production safe for this promotion audit | PASS | Unchanged pinned runtime/config; OFF controls; zero PP state/intents |
| I. Worker stopped/disabled | PASS | inactive/dead, disabled, PID=0, no lifecycle events |
| J. REAL_PP OFF | PASS | Fresh authoritative control SELECT |
| K. DEMO_PP OFF | PASS | Fresh authoritative control SELECT |
| L. No audit trading side effects | PASS | Read-only actions; zero PP aggregates/events; native state limitation explicit |
| M. No unauthorized architecture changes | PASS | Complete diff and unchanged protected source blobs |
| N. No old rejected-tree contamination | PASS | Old blob only approved content reference; preserved current main |
| O. No old-PP-parent base contamination | PASS | Direct parent is current main, not old PP parent |

No unresolved candidate, CI or Production safety invariant failed in the requested scope. H/L are bounded audit findings, not a complete private-account/production-functionality certification.

## 11. Actions, files inspected, changes and publication boundary

Actually executed: read-only Git metadata/diff/blob/hash assertions; read-only GitHub existing run/job/log reads; authorized SSH read-only marker/symlink/process/unit/hash/journal reads; bounded READ ONLY control/count transactions; report creation and sanitization. No new test/build/CI/release execution.

Principal inspected sources: owner Phase 5J attachment in full; AGENTS/CLAUDE/current handoffs/colleague handoff/safe test runbook; complete five-path candidate diff, Worker source and repaired scope test; existing approved local scope-repair file; current copytrade PP integration and monitor; pure-policy/lifecycle/execution references and retained adapter/UI/SQL/legacy/architecture blobs; unchanged Production CI workflow; Phase 5I-A/5I-B and earlier Production/legacy disposition reports; installed Worker unit/drop-in metadata and selected flag; existing VPS runtime and aggregate PP evidence; AI-Log README/report template/scanner.

Application files changed: NONE. Application commits/pushes: NONE. Candidate/main/old branch references: unchanged. Root's previous private/dirty work: preserved. The only new local file is this dated audit report, outside the clean candidate worktree. HANDOFF and source/test files were not edited because this phase expressly prohibits implementation/repair/candidate changes.

Sanitized report-only publication to SignalVerse-AI-Log/master is authorized by the standing AGENTS reporting instruction; it is not an application push, promotion or release. Its actual publication commit and byte-for-byte remote verification are provided in the final response, not invented inside this pre-publication report.

## 12. Final classification / hard stop

```text
FINAL=PHASE 5J PASSED — PROMOTION SAFETY AUDIT PASSED

NO MERGE
NO MAIN PUSH
NO FORCE PUSH
NO DEPLOY
NO WORKER START
NO WORKER ENABLE
NO REAL_PP ENABLE
NO DEMO_PP ENABLE
NO EXCHANGE ACTION
NO ORDER/POSITION/SL/TP CHANGE
NO DATABASE MUTATION
```

Candidate is eligible to REQUEST a separate promotion authorization.

Stop here. No promotion, artifact, Guard creation/claim/consumption, deployment, Worker installation/activation or PP enablement is authorized or executed. Any later approval must recheck current remote main/ancestry and current OFF/stopped conditions; this dated PASS is not an indefinite lock on externally changing state. Future deployment/bootstrap/native execution/effectiveness/profitability remain unverified and must not be inferred from this audit.
