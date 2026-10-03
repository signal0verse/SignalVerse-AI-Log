# Futures reentry after an early profitable exit

## Metadata

- Date: 2026-10-04 Asia/Kuala_Lumpur. Final evidence collected by 2026-10-03T21:26:01Z.
- Module: standard Futures entry admission.
- Mode: isolated local implementation and disposable tests; no Production access.
- Repository: signal0verse/SignalVerse-Main.
- Branch: codex/futures-manual-close-reentry-20261004.
- Starting and ending application HEAD: 2d9ce43094f5d20148950d6b156bc9280366ecd0.
- Source changes: uncommitted in the isolated worktree. No application source push or CI dispatch.

## Objective

The owner reports repeatedly closing a profitable Futures position before its target, then losing on an immediate engine entry into the same continuation. Prevent that consumed setup from reopening until a genuinely reset and newly qualifying setup is recorded. This protects the result of an early profit exit; it does not authorize automatic Profit Protection or solve the independent delayed-close lifecycle problem.

## Scope

Standard legacy SignalVerse Real and Demo entry admission only. Preserve the existing Engine, Supervisor, entry geometry, risk rules, ONE TP, SL, close logic, protection, adapters, Scanner and Spot. Do not modify existing positions, start a worker, change PP flags, access private exchange APIs, or deploy. Preserve the independently deployed Partner namespace, Fast Trader and Whale paths.

## Root Cause and Findings

CONFIRMED FROM SOURCE: a full manual close records CLOSED_MANUAL and resolves the old signal lock. The active Futures Pro symbol remains eligible for later analysis. The scheduler excludes currently OPEN symbols, not a consumed profitable setup. A new decision/pending ID can therefore propose the same continuation. There was no durable setup-consumption admission barrier. Admin signal-lock exceptions also make a non-admin-only fix insufficient.

OWNER-REPORTED, NOT PRODUCTION-AUDITED: the frequency, monetary losses and exact live events. No private account or Production database was queried in this task.

The existing PP persistence path uses CLOSED_MANUAL with PROFIT_PROTECTION reason for a full close. The new admission rule can recognize that recorded outcome without changing or activating PP. This is not proof that the old automatic-close path is safe.

## Implementation

Reuse copy_trades, engine_decisions, pending_signals and futures_execution_attempts; no new table. A full standard manual early-profit exit consumes the user's coin setup within its mode, across direction, timeframe and venue. Favorable-price exits with provisional zero PnL also block; the actual schema prohibits NULL PnL. Partial exits, ordinary manual losses, SL and TP exits do not create this initial barrier. Once a new setup is admitted, its subsequent entry/closure consumes that reset too: the first reset cannot become a permanent exception.

Re-entry requires all of the following recorded evidence:

1. The original decision's scored timeframes are known. Missing original linkage remains denied, not guessed.
2. A later deterministic raw WAIT has no data issues and valid native closed-candle provenance for every scored timeframe, including the exited timeframe and all original timeframes. Every raw score has absolute value below the Engine's existing qualification threshold of four.
3. Its exited-timeframe candle closed after the recorded exit or subsequent consumed lifecycle. A Supervisor/risk/capacity veto, NO_TRADE, stale/unknown candle, omitted timeframe or merely elapsed time is not a reset.
4. A later deterministic LONG/SHORT decision qualifies in the requested timeframe on a later closed native candle. Its owner, mode, symbol, venue, direction and decision ID match. No overlapping standard OPEN position or previously used decision is admitted.

The SQL validates timestamp order, input selection, source/venue, native close semantics, newest closed boundary and input/hash completeness. Binance uses inclusive native milliseconds; MEXC/Gate use the existing derived end-exclusive contract. No exchange semantics were newly assumed.

Execution flow:

- analyzeOneCoinPro persists the unchanged raw Engine result, then checks admission before acquiring a new OPEN signal lock or creating pending entry. WAIT evidence is retained for future reset detection.
- executeDemoProOpen and activateDemoPending check admission before financial/price calls; the Demo insert trigger independently checks under the durable lock.
- claimRealExecutionAttempt checks before the existing immutable claim. Its immutable request carries exact symbol, decision ID and timeframe. The SQL trigger checks both PREPARED creation and PREPARED to SUBMITTED, before the existing submission callback can permit an exchange POST.
- The same owner/mode/coin advisory transaction lock serializes durable full manual-close observation with admission. Real cross-venue unresolved claims cannot reuse a reset concurrently. PREPARED/SUBMITTED/UNKNOWN holds never expire or get deleted by this change.
- Real post-fill persistence is not rejected: an already filled position must remain recorded and protected. Existing close and recovery paths remain unchanged.
- Blocked batch results spend no credit/watch loop. Analysis continues to look for a new setup; the Scanner candidate list is not deleted or redesigned.

## Files Changed

| File | Purpose |
| --- | --- |
| api/_shared/futures-reentry-admission.ts | Shared fail-closed admission RPC port |
| migrations/futures_manual_profit_reentry.sql | Prerequisite checks, ledger policy, entry/close serialization triggers, lookup indexes and restricted RPC grants |
| api/analyze.ts | Admission after raw decision persistence, before pending/open lock; blocked accounting and help knowledge |
| api/copytrade.ts | Standard Demo/Real admission and immutable decision linkage |
| scripts/futures-manual-profit-reentry-test.mjs | Actual extracted entry tests, fail-closed RPC cases and exact-base preservation assertions |
| scripts/futures-manual-profit-reentry-sql-test.mjs | Real disposable PostgreSQL migration, policy, concurrency and restart tests |
| scripts/lib/futures-pure-test-context.mjs | Expose the shared pure admission port to existing isolated fixtures |
| scripts/futures-real-execution-fault-test.mjs | Model the new RPC in fixtures without weakening existing execution assertions |
| HANDOFF.md | Local implementation and release limitation |
| TRADING_STRATEGY.md | Dated entry-admission amendment; no weight/level rewrite |
| reports/futures/futures-manual-profit-reentry-fix-2026-10-04.md | This report |

## Files Inspected

The changed files above; migrations/engine_decisions.sql, migrations/immutable_ledger_schema.sql, migrations/futures_execution_attempts.sql; api/_shared/futures-candle-provenance.ts, futures-decision-engine.ts, futures-risk.ts, futures-market-data.ts and partner-copytrade-context.ts; src/app/App.tsx; existing PP policy/execution/worker and historical parity helper; scheduler, native-provenance, PP and Scanner integration tests; Vite configs, package.json and the stability test runbook. Repository entry instructions and strategy/handoff documentation were read before implementation.

## Tests Executed

Windows Node v22.23.3; PostgreSQL 18.6 in a NEW loopback-only disposable cluster. Tests never import Production API bootstrap, read env files or contact an exchange. PostgreSQL test processes require local sandbox escalation; no existing database is used.

```text
node --test scripts/futures-manual-profit-reentry-test.mjs scripts/futures-pro-scheduler-reliability-test.mjs scripts/futures-shared-engine-test.mjs scripts/futures-real-execution-fault-test.mjs scripts/futures-gate-mexc-fault-test.mjs
212/212 PASS; 0 failed, skipped or cancelled.

FUTURES_REENTRY_TEST_PG_BIN=<installed local PostgreSQL bin>
node scripts/futures-manual-profit-reentry-sql-test.mjs
49/49 PASS.

node --test scripts/futures-candle-provenance-test.mjs scripts/futures-profit-protection-test.mjs scripts/futures-auto-scanner-integration-test.mjs
88/89 PASS; one historical whole-file scope assertion FAIL.

node --test scripts/futures-profit-protection-test.mjs
Clean exact-base checkout: 52/52 PASS.

FUTURES_TSC_BASELINE_ROOT=<clean exact-base checkout>
FUTURES_TSC_BASELINE_SHA=2d9ce43094f5d20148950d6b156bc9280366ecd0
node scripts/futures-typecheck-delta.mjs
Full: 71 baseline / 71 candidate, introduced=0.
Affected API: 65 baseline / 65 candidate, introduced=0.

node --check scripts/futures-manual-profit-reentry-sql-test.mjs
PASS.

git diff --check
PASS.
```

The 212 Node-runner tests include one Gate/MEXC runner covering 32 internal adapter scenarios; those are not added again to the runner count. The dedicated new Node suite is 16/16. Some tests are static wiring/byte checks, not runtime exchange acceptance. Actual PostgreSQL tests independently cover both directions on Binance/MEXC/Gate, old pending and missing links, malformed/stale/future evidence, no cooldown, single-use resets, subsequent SL consumption, concurrent Demo entries and cross-venue Real claims, manual-close/admission race, retained uncertain holds, server restart, restricted RPC access and preserving populated evidence on migration reapplication.

Early development failures were not hidden: the isolated harness initially lacked the new RPC/IO ports; those fixture ports were added without deleting assertions. SQL syntax/record-field errors were corrected. A NULL-PnL fixture correctly hit the existing NOT NULL constraint; the final test now requires that rejection and separately verifies provisional zero PnL. Final counts above are fresh reruns, not those incomplete attempts.

## Build Result

- Web Vite build PASS; unchanged UI bundle index-Do3I3wpK.js. Existing large-chunk warning remains.
- Admin Vite build PASS.
- All 14 API handlers bundle successfully with the normal Node22/esbuild options and write=false. No runtime artifact is generated or delivered.
- TypeScript result is zero introduced diagnostics, NOT a claim that the repository has zero baseline diagnostics.

## Release Contract Blocker

The candidate introduces ONE observed historical scope failure:

```text
Test: legacy parity permits only the exact approved PP delta and rejects unrelated Spot edits
Helper: scripts/lib/futures-profit-protection-verify-only-parity.mjs:11
Error: Only exact Phase 3B capability delta: api/copytrade.ts
```

This helper permits only frozen whole-file hashes; the new reviewed entry-admission delta changes that file. Baseline PP suite is 52/52 and candidate PP suite is 51/52, so this scope rejection IS introduced, not a baseline failure. The other 37 native/Scanner tests passed. The frozen helper, assertions and PP implementation are unchanged. The new exact-base test verifies all non-admission API function bodies, Spot UI, Engine, Risk, native market-data module, PP policy/execution module and worker are byte-preserved. That evidence does not bypass the old release contract.

Release readiness is BLOCKED. A separately reviewed exact-delta successor contract and complete official CI must accept this change before source promotion or release. No wildcard/hash bypass, CI weakening or unrelated repair was performed. Other full release gates were not run and are not claimed PASS.

## Working Copy Hashes

SHA-256 of raw local bytes, not release-artifact digests:

```text
api/_shared/futures-reentry-admission.ts
61718047bc3940c9f53dcc68ca108b342402154a6b624ba12abd868f1663ff21
migrations/futures_manual_profit_reentry.sql
79d7e4207e772e692da974f2d01a6991cfe8f64ed6893c14d89959efbafbc42b
api/analyze.ts
78cbdcb2401cdca60a4cb2bff632991e4b2727086bfcf98e98eb9889bbd9c468
api/copytrade.ts
0a0e08fc1e80f595493499359b2a32b946190e9e55b8844ba974e7329b625227
scripts/futures-manual-profit-reentry-test.mjs
08795e2ab70543bc9935f332c189626855e94c57458da8892d6f16d10351a878
scripts/futures-manual-profit-reentry-sql-test.mjs
cd42c2af2f8640f1442e7793c64109885b7440f0e7e5a3f429596b7880632691
```

## Git Status

Primary checkout remains at 0dbca62357a4adf34240f40ceda3e387356ec4b0 with its pre-existing tracked/untracked work preserved. All task source changes are isolated and uncommitted on the branch named above. Application main is not pushed or changed by this task. Only this sanitized work report is published to SignalVerse-AI-Log/master under the standing repository reporting instruction.

## Risks and Limitations

- This fixes admission after a DURABLY RECORDED full profitable close. An external manual exchange close is not observable until the existing reconciliation records it. A later SQL recheck is not an atomic exchange-side fence against arbitrary external writers.
- It does not prove or activate safe automatic PP Close execution, native lifecycle generation identity, shared Canonical/Partner authority or profitability.
- Unknown original decision/provenance fails closed and can leave a legacy coin blocked indefinitely. No ad-hoc data repair, hold deletion or timed unlock is authorized. A continuing strong higher-timeframe score also prevents re-entry intentionally.
- The independent Partner namespace, Fast Trader, Whale and manual-close-free historical Simulator are not modified. Native symbol aliases remain the existing adapter contract; only the existing logical coin and USDT quote spelling are normalized here.
- Production schema/readiness/runtime/account state was NOT inspected. Local SQL passed against the actual repository schemas with explicit metadata fixture columns, not a live schema clone.

## Recommended Next Step

Review the local entry-only delta and its exact scope-contract blocker. After separate authorization, make the narrow immutable-scope integration, run full official exact-SHA CI, then perform the existing backed-up migration/cache/Guard/release route. The required new migration is migrations/futures_manual_profit_reentry.sql; DO NOT replay base migrations or activate PP as part of it. Do not deploy API callers without that schema: absent RPC/schema evidence deliberately blocks entry.

## Final State

```text
LOCAL_ENTRY_POLICY_TESTS=PASS
RELEASE_READINESS=BLOCKED_HISTORICAL_SCOPE_CONTRACT
IMPROVEMENT_PROVEN=NO
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI_DISPATCH=NO
PRODUCTION_MIGRATION=NO
DEPLOYMENT=NO
PRODUCTION_TOUCHED=NO
PP_WORKER_STARTED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
EXCHANGE_CALLS=0
ORDER_CHANGES=0
POSITION_CHANGES=0
SL_TP_CHANGES=0
CLOSE_ACTIONS=0
```
