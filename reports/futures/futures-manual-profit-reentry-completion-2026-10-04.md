# Manual profit close reentry correction

## Metadata

- Date: 2026-10-04, Asia/Kuala_Lumpur.
- Evidence checkpoint: 2026-10-03T21:53:31Z.
- Repository: signal0verse/SignalVerse-Main.
- Isolated branch: codex/futures-manual-close-reentry-20261004.
- Worktree: tmp/futures-manual-close-reentry-20261004.
- Application HEAD/base and authenticated remote main: 2d9ce43094f5d20148950d6b156bc9280366ecd0.
- Application source commit/push: NONE/NO. Local candidate remains uncommitted.

## Executive result

The local standard Futures admission fix now prevents repeated entry into a consumed setup after a durably recorded full profitable manual close. New Real pending entries are rejected before fresh native reads/adoption; existing uncertain attempts and already recorded fills retain recovery priority. Fresh local validation passed 222 offline tests and 61 disposable PostgreSQL checks, including 120 repeated synthetic Real admission denials.

This is a local implementation result, NOT a Production rollout. An existing frozen whole-file PP parity test still rejects the admission delta. Its assertion was not weakened, removed or bypassed. No Production state, PP flag, worker, exchange order or position was changed.

## Objective and scope

The owner prioritized the repeated-entry problem after manually taking profit. Reuse the previous local candidate rather than redesigning the Engine. Prevent continued LONG/SHORT entries on the same consumed setup until complete evidence shows a reset and a newly qualifying setup.

Scope is standard SignalVerse Futures admission. Preserve Strategy scoring, Decision Engine, risk, ONE TP, SL, native adapters, open-position management, Scanner, Spot, UI, Fast Trader, Whale and the independent Partner namespace. Do not activate PP or treat this gate as a native close-execution fence.

## Findings and changes

The earlier candidate already used the durable copy_trades, engine_decisions and futures_execution_attempts ledgers, with no timer, new table or trade backfill. A complete manual profit close consumes the user/mode/coin setup across direction, timeframe and venue. Original decision metadata must exist. A valid deterministic WAIT with all scored native closed-candle inputs below the existing qualification threshold, followed by a newly qualifying later closed candle, is required for re-entry. A new analysis ID, elapsed time, price move or direction/venue/timeframe change alone does not release it.

Three narrow completion changes were made:

1. Analysis also checks admission for an actionable LONG/SHORT result without watchSetup, before any new signal lock or pending entry.
2. activateRealPendingTrade first retains its existing known-attempt recovery branch, then checks NEW pending admission before native provenance/balance/position-adoption calls. The immutable claim and PREPARED-to-SUBMITTED SQL trigger still recheck admission.
3. Explicit CLOSED_MANUAL profit consumes the setup even at or beyond the previous target. Actual TP/SL exit statuses are not reclassified or modified.

No existing position is closed or altered by this admission fix. An external manual exchange exit cannot be observed before existing reconciliation records it. If reconciliation labels an external exit differently, this task does not invent a manual-close cause or change the existing exit classifier.

## Exact files changed

All prior candidate changes are preserved. The complete current task candidate inventory is:

- api/_shared/futures-reentry-admission.ts: shared fail-closed admission RPC port; comment updated.
- migrations/futures_manual_profit_reentry.sql: durable admission policy, serialization triggers, restricted grants and indexes; manual-profit target proximity exclusion removed.
- api/analyze.ts: raw decision persistence precedes admission, actionable-side fallback, blocked accounting and help knowledge.
- api/copytrade.ts: standard direct/pending admission, immutable decision linkage and early NEW Real pending gate.
- scripts/futures-manual-profit-reentry-test.mjs: real extracted pending handler with fail-fast ports; hold/recorded-fill recovery checks.
- scripts/futures-manual-profit-reentry-sql-test.mjs: disposable DB policy, repeated entry, concurrency, migration and restart proofs.
- scripts/lib/futures-pure-test-context.mjs: previously added pure admission port for isolated tests.
- scripts/futures-real-execution-fault-test.mjs: previously added RPC fixture without removing existing assertions.
- HANDOFF.md and TRADING_STRATEGY.md: dated local result and release limitations.
- reports/futures/futures-manual-profit-reentry-fix-2026-10-04.md: preserved previous local report.
- reports/futures/futures-manual-profit-reentry-completion-2026-10-04.md: this new report.

No task diff in src/, server/, ops/, .github/, Decision Engine, risk, native data, discovery policy, PP policy/execution/worker or adapters. The existing PP parity helper and its negative assertions remain unchanged.

## Tests and builds

All tests below were reviewed isolated fixtures, with no application credential/bootstrap or private exchange transport.

```text
Node v22.23.3
node --test --test-reporter=spec
  scripts/futures-manual-profit-reentry-test.mjs
  scripts/futures-pro-scheduler-reliability-test.mjs
  scripts/futures-shared-engine-test.mjs
  scripts/futures-real-execution-fault-test.mjs
  scripts/futures-gate-mexc-fault-test.mjs
RESULT: 222/222 PASS; zero failed/skipped/cancelled.
Dedicated reentry suite: 26/26; included, not counted again.

FUTURES_REENTRY_TEST_PG_BIN=<explicit installed PostgreSQL bin>
node scripts/futures-manual-profit-reentry-sql-test.mjs
RESULT: 61/61 PASS on a NEW PostgreSQL18.6 loopback cluster.
Cluster stopped and its own temporary directory removed.
120 synthetic Real PREPARED attempts rejected across
Binance/MEXC/Gate x LONG/SHORT; no new OPEN rows or entry holds.

node --test --test-reporter=spec
  scripts/futures-candle-provenance-test.mjs
  scripts/futures-profit-protection-test.mjs
  scripts/futures-auto-scanner-integration-test.mjs
RESULT: 88/89 PASS; one known introduced frozen parity failure.

node scripts/futures-typecheck-delta.mjs
Explicit clean same-base comparison:
Full: 71 baseline / 71 candidate, introduced=0.
Affected API: 65 baseline / 65 candidate, introduced=0.

Web Vite6.3.5 build: PASS.
Admin build: PASS.
14 API esbuild Node22 bundles: PASS, write=false.
node --check scripts/futures-manual-profit-reentry-sql-test.mjs: PASS.
git diff --check: PASS.
```

The Gate/MEXC runner's 32 internal scenarios are included as one Node test and are not added again. Some wiring tests are static evidence; actual entry/pending functions are AST-extracted with all other ports fail-fast, while SQL tests independently exercise real transactions, serialization and restart persistence.

Initial new pending fixtures had six cross-VM Object-prototype comparison failures despite equal patch fields. The assertion now compares the exact JSON patch, without omitting any fields. The first build command used a nonexistent candidate-local Vite path. The existing primary dependency runtime was then used explicitly; package-lock SHA-256 matches the candidate exactly, and installed/locked Vite are both6.3.5. No dependency, build configuration or assertion was changed to hide a production failure.

## Remaining release gate

```text
Failure: legacy parity permits only the exact approved PP delta
         and rejects unrelated Spot edits
Helper: scripts/lib/futures-profit-protection-verify-only-parity.mjs:11
Error: Only exact Phase 3B capability delta: api/copytrade.ts
```

The historical contract accepts only frozen whole-file source hashes, not this new admission delta. This remains a release blocker, not a functional reentry test PASS. The previous exact-base PP baseline was52/52; it was not rerun here. No full official CI acceptance is claimed.

Next, integrate the narrowly reviewed admission delta into a closed successor release contract with preserved negative checks, then run exact-SHA official CI. Any eventual backed-up Production migration/cache refresh and guarded release must use the existing route; no rollout is performed by this request.

## Source hashes

Raw working-copy SHA-256 values, NOT release-artifact digests:

```text
api/_shared/futures-reentry-admission.ts
a0e190d57e4ae65f77a378a252e14d1c5b3e205d192ab356daab14a8824c6f39
migrations/futures_manual_profit_reentry.sql
37933b63213149850f8de45d2c74febda26756495e0dcccfce6bac997a86b03f
api/analyze.ts
8eba110f540bd15c6d4a668060d194178a377e0088f3b3b27bab0a3ab54c3182
api/copytrade.ts
864246a2510dc1474b5c88010b2c8c4a5d77077d2caef1dc7c55ba715b449258
scripts/futures-manual-profit-reentry-test.mjs
14cde852ef0208945d5ed655ecd87cc3d2f033c32579b2c18867511f222e1011
scripts/futures-manual-profit-reentry-sql-test.mjs
4bf174e85ecb626983acbbed1fb742265fad9ca4a2322b94a1514ebf1d244e27
```

## Git and safety state

The primary checkout and other contributors' dirty/untracked work were preserved. Source changes stay in the isolated candidate, uncommitted; remote main was rechecked unchanged. Only this sanitized report is published to SignalVerse-AI-Log/master, with remote bytes and commit verification reported in the conversation.

```text
LOCAL_REENTRY_IMPLEMENTATION=PASS
RELEASE_READINESS=BLOCKED_HISTORICAL_SCOPE_CONTRACT
PRODUCTION_FIX_ACTIVE=NOT_VERIFIED_NOT_DEPLOYED
IMPROVEMENT_PROVEN=NO
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI_DISPATCH=NO
DEPLOYMENT=NO
PRODUCTION_MIGRATION=NO
PRODUCTION_DB_MUTATION=NO
PP_WORKER_STARTED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
EXCHANGE_CALLS=0
ORDER_CHANGES=0
POSITION_CHANGES=0
SL_TP_CHANGES=0
CLOSE_ACTIONS=0
```
