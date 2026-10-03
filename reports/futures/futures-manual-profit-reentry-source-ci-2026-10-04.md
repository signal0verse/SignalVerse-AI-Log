# Manual-profit Futures re-entry: exact source promotion and official CI

## Metadata

- Date: 2026-10-04, Asia/Kuala_Lumpur. Operational evidence timestamps below are UTC.
- Repository: signal0verse/signalverse-main.
- Isolated branch: codex/futures-manual-close-reentry-20261004.
- Base: 2d9ce43094f5d20148950d6b156bc9280366ecd0.
- Commit/main after promotion: fca794122a7f235e0a774dbbbb0c6241ce4e10a3.
- Mode: authorized source fix/promotion; read-only Production preflight; no deployment.
- Result: SOURCE PUSH + EXACT-SHA PRODUCTION CI PASS. Server rollout is not complete.

## Objective and authority

Fix repeat standard Futures entry after a durably recorded full manual profitable exit, repair the exact historical release-contract blockers, and validate the real source. The owner subsequently explicitly approved pushing only this existing commit to main and observing official CI. No further application commit, history rewrite, migration, artifact preparation, Guard issuance, release or PP activation was performed after that approval.

The previous dated failed validation receipts are preserved, not rewritten as successes. This receipt records the completed successor validation and source promotion.

## Confirmed findings and implementation

A manual profitable exit did not consume the original entry setup. The new admission gate reuses existing copy_trades, engine_decisions, pending_signals and futures_execution_attempts. A durably recorded full CLOSED_MANUAL profitable exit consumes the user/mode/symbol setup across timeframe, side and venue.

A new analysis ID, elapsed time, price movement, direction flip or venue switch alone does not rearm it. Reentry requires a later raw deterministic WAIT with complete valid native closed-candle provenance and all original/current scored timeframes unqualified, followed by a later newly qualifying setup on a new closed candle. Reset is single-use. Missing provenance fails closed. Favorable manual exits at/beyond the old TP, or provisional zero PnL, cannot evade the rule.

Real PREPARED/SUBMITTED admission and Demo insertion are serialized with durable manual-close observation. Existing uncertain PREPARED/SUBMITTED/UNKNOWN holds are neither expired, deleted nor resubmitted. Recorded fill recovery and Real post-fill persistence remain preserved. The task does not change the native close, SL, ONE-TP or protection execution paths.

The historical contract rejected the legitimate new admission delta because it pinned complete earlier API files. The successor validates the complete actual 20-file candidate, exact LF-normalized hashes, its own body and manifest, and AST preservation of non-admission API functions before supplying an exact predecessor snapshot to historical consumers. Original negative tests and assertions remain intact; actual new source and SQL are tested independently. The intervening two-file documentation-only receipt is explicitly accounted for, not exempted by wildcard.

This is not PP close-lifecycle safety, an automatic profit-close implementation, or profitability proof.

## Exact changed-file inventory

Relative to the exact base, Git reported these 20 paths:

1. .github/workflows/production-ci.yml — add offline reentry/scope and disposable SQL CI steps; remove no gates.
2. HANDOFF.md — dated scope, evidence and release boundaries.
3. TRADING_STRATEGY.md — record the new entry-admission rule.
4. api/_shared/futures-reentry-admission.ts — fail-closed shared admission helper.
5. api/analyze.ts — record raw decision evidence and enforce new-entry admission.
6. api/copytrade.ts — enforce admission without replacing existing fill recovery/exit behavior.
7. docs/testing/futures-reentry-release-2026-10-04.md — exact successor and release runbook.
8. migrations/futures_manual_profit_reentry.sql — durable RPC/index/trigger serialization; not applied to Production.
9. reports/futures/futures-manual-profit-reentry-completion-2026-10-04.md — preserve prior completion/blocker evidence.
10. reports/futures/futures-manual-profit-reentry-fix-2026-10-04.md — preserve prior implementation evidence.
11. scripts/futures-manual-profit-reentry-sql-test.mjs — disposable transactional/concurrency proof.
12. scripts/futures-manual-profit-reentry-test.mjs — actual-source admission tests.
13. scripts/futures-real-execution-fault-test.mjs — required synthetic admission context.
14. scripts/futures-reentry-release-scope-test.mjs — closed successor/mutation/preservation tests.
15. scripts/lib/futures-profit-protection-verify-only-parity.mjs — exact successor integration, not weaker PP assertions.
16. scripts/lib/futures-pure-test-context.mjs — synthetic isolated fixture integration.
17. scripts/lib/futures-reentry-release-delta.json — exact reviewed inventory and hashes.
18. scripts/lib/futures-reentry-release-parity.mjs — closed scope and historical predecessor validation.
19. scripts/lib/spot-fullscreen-release-parity.mjs — exact successor integration preserving original Spot source/assertions.
20. scripts/spot-tutorial-release-scope-test.mjs — exact predecessor view for its historical API comparison.

No task-created change in src/, server/, ops/, deploy/, PP policy/worker/migrations, exchange adapters, Decision Engine scoring, Risk or Scanner. The release workflow and Guard code were not changed. Existing main Spot work remains intact.

Commit statistics: 20 files, 1323 insertions, 25 deletions.

## Local validation

Tests were audited against the safe test runbook before execution. These are separate suite results, not summed as unique cases.

- Focused actual-source/admission/successor/PP/Spot scope: 129/129 PASS, zero failed/skipped/cancelled.
- Native candle, Auto Scanner, scheduler, shared engine, Real execution faults and Gate/MEXC regressions: 233/233 PASS. Internal Gate/MEXC groups were not double-counted.
- Disposable PostgreSQL reentry proof: 61/61 PASS, including 120 repeated synthetic Real denials, all six venue/direction combinations, concurrent admissions, manual-close serialization, single-use reset, restart and permissions.
- Existing PP scope with independent types: PASS; original 50 negative mutation cases still rejected.
- Historical frontend diagnostics: baseline 72, candidate 71, introduced 0. API diagnostics: 30/30, introduced 0.
- Independent exact-base TypeScript comparison: full 71/71 and affected 65/65; introduced 0.
- Web and Admin builds: PASS. Existing large-bundle warning is not reported as a failure.
- Fourteen API runtime bundles: PASS.
- Syntax/static scope and git diff --check: PASS.
- Postcommit exact successor inventory: 20 paths, PASS.

Key commands:

```text
node --test --test-reporter=spec scripts/futures-reentry-release-scope-test.mjs scripts/futures-manual-profit-reentry-test.mjs scripts/futures-profit-protection-test.mjs scripts/spot-tutorial-release-scope-test.mjs
node --test --test-reporter=spec scripts/futures-candle-provenance-test.mjs scripts/futures-auto-scanner-integration-test.mjs scripts/futures-pro-scheduler-reliability-test.mjs scripts/futures-shared-engine-test.mjs scripts/futures-real-execution-fault-test.mjs scripts/futures-gate-mexc-fault-test.mjs
node scripts/futures-profit-protection-scope-test.mjs --types
node scripts/futures-manual-profit-reentry-sql-test.mjs
node scripts/futures-typecheck-delta.mjs
vite build
vite build --config vite.admin.config.ts
git diff --check
```

Local Node: 22.23.3. Disposable SQL used PostgreSQL 18.6 with an explicitly supplied local binary directory. Its synthetic loopback cluster was stopped/cleaned. No Production database was used by tests.

## Git and official CI

The immediate normal fast-forward push promoted exactly the authorized commit:

```text
REMOTE_MAIN_BEFORE=2d9ce43094f5d20148950d6b156bc9280366ecd0
TARGET_SHA=fca794122a7f235e0a774dbbbb0c6241ce4e10a3
SOLE_PARENT=2d9ce43094f5d20148950d6b156bc9280366ecd0
REMOTE_MAIN_AFTER=fca794122a7f235e0a774dbbbb0c6241ce4e10a3
PROMOTION=normal fast-forward; no force or rewrite
CI_WORKFLOW=Production CI
CI_PATH=.github/workflows/production-ci.yml
CI_RUN_ID=37157890862
CI_HEAD_SHA=fca794122a7f235e0a774dbbbb0c6241ce4e10a3
CI_HEAD_BRANCH=main
CI_EVENT=push
CI_DISPATCH=NO
CI_RESULT=success
CI_CREATED_AT=2026-10-03T22:16:51Z
CI_JOB_STARTED_AT=2026-10-03T22:16:55Z
CI_COMPLETED_AT=2026-10-03T22:22:20Z
CI_NODE=22.23.3
CI_JOB=Build web and API runtime
CI_JOB_ID=111305026113
CI_JOBS=1/1 success
CI_STEPS=42/42 success, including setup/cleanup
CI_FAILED=0
CI_SKIPPED=0
```

[Exact CI run](https://github.com/signal0verse/signalverse-main/actions/runs/37157890862).

All relevant groups succeeded: admin/partner transport, isolated paper/terminal/owned copytrade, unchanged Spot closed scope, admin types, learning/event transport, chronology/accounting/reservation/analytics simulation, isolated Real execution faults, PP historical scope, scheduler, actual reentry/successor, discovery, Whale, stablecoin, Prediction, disposable entry/PP/reentry/Whale/admin SQL, web build, API bundles and artifact existence checks.

Actual GitHub/Linux evidence additionally shows 73/73 actual reentry/successor tests and SQL RESULT 61/61 PASS. Independent historical type deltas remain introduced 0. This is real GitHub runtime validation, not a claim based only on source-text tests.

Candidate tracked worktree is clean. Generated output/ logs remain untracked and are not included in the commit. The primary checkout and its unrelated work were not used for promotion.

## Read-only Production preflight

The former port-22 connection failure was resolved by the owner's explicit correction to port 22123. No host/service/network configuration was changed.

At 2026-10-03T22:19:57Z, marker and main release pointed to:

```text
c03de74c1d192a991487b4ec530305acb5ece8be
```

At 22:22:42Z, admin symlink and application/admin/observer process working directories independently pointed to the same release. At 22:23:47Z the marker and all service PIDs/restarts remained unchanged.

| Service | PID before/after | Restarts before/after | Final state |
| --- | --- | --- | --- |
| signalverse.service | 3345217 / 3345217 | 0 / 0 | active/running |
| signalverse-admin.service | 3345213 / 3345213 | 0 / 0 | active/running |
| signalverse-observer.service | 3345212 / 3345212 | 0 / 0 | active/running |
| postgrest.service | 1960930 / 1960930 | 0 / 0 | active/running |
| signalverse-futures-profit-protection.service | 0 / 0 | 0 / 0 | disabled/inactive |

Receiver was already active with zero restarts. No queued systemd job was present at the second observation. A historical failed artifact unit for a different SHA exists; it was not restarted, cleared or reused.

At 22:20:49Z, bounded PostgreSQL catalog inspection verified current_database() = signalverse_cutover2 and transaction_read_only = on. Required migration columns and three existing roles were present; no conflicting schema-lock count was observed. New reentry functions and triggers were absent. The transaction ended with ROLLBACK, with no DDL/DML.

Existing database PP controls are true for Real and Demo; they were only read and not toggled. The canonical PP worker is disabled/inactive/PID 0. Do not conflate existing control booleans with operational PP execution. Public PP close-intent count was 0 at that observation; this is not a whole-account exchange audit.

Existing approved backup directory is postgres-owned, mode 0700. No new backup or restore was run.

## Migration and remaining release gates

```text
MIGRATION_SOURCE=migrations/futures_manual_profit_reentry.sql
MIGRATION_LF_SHA256=37933b63213149850f8de45d2c74febda26756495e0dcccfce6bac997a86b03f
MIGRATION_APPLIED=NO
ARTIFACT_PREPARED=NO
GUARD_CREATED=NO
RELEASE_DISPATCHED=NO
DEPLOYMENT=NO
```

Next gated sequence, not executed: exact-source authorization/readiness recheck; approved complete Production backup and restore/integrity verification; exact bounded transactional migration; catalog and PostgREST RPC readiness verification; official retained artifact preparation and independent digest/commit verification; independent exact-SHA/digest Guard; official Production Release; postdeploy runtime/health/admission verification.

Source CI PASS is not Production rollout PASS. The deployed runtime remains the previous release and the new database admission contract is not yet present.

## Safety and limits

```text
ADDITIONAL_APPLICATION_COMMIT_AFTER_AUTHORIZATION=NO
HISTORY_REWRITE=NO
PRODUCTION_CODE_CHANGED_BY_TASK=NO
PRODUCTION_DATABASE_DDL=NO
PRODUCTION_DATABASE_DML=NO
WORKER_STARTED=NO
PP_FLAGS_CHANGED=NO
EXCHANGE_CALLS_BY_TASK=0
ORDER_ACTIONS_BY_TASK=0
POSITION_ACTIONS_BY_TASK=0
SL_CHANGES_BY_TASK=0
TP_CHANGES_BY_TASK=0
CLOSE_ACTIONS_BY_TASK=0
PP_ACTIVATION=NO
PROFITABILITY_PROVEN=NO
```

Zero-action statements describe this task; normal autonomous activity was not paused and no private exchange account history was queried. External manual closes become enforceable only after existing reconciliation durably records them. This rule is not an exchange-native lifecycle fence for an independent delayed PP close.

No active-runtime health/HTTP response was substituted for proof of private execution. The report contains no credentials, database exports or private account rows.

## Publication

This sanitized receipt is published separately to SignalVerse-AI-Log/master. Its remote content/hash verification and documentation-only publication commit are reported in the conversation. The earlier local historical-contract explanation note is preserved unstaged; prior published failed receipts are unchanged.
