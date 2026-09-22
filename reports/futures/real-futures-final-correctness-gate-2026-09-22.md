# Real Binance Futures — final offline correctness gate, 2026-09-22

## 1. IMPLEMENTED

Isolated candidate: `codex/futures-correctness-2026-09-22`. Added a database-atomic, one-pending-per-trade Re-Analyze trigger with source priority, restart recovery, coalescing, flat/Auto-off discard, and non-expiring hold on uncertain exchange mutation. Re-Analyze reads fresh position/native protection and rechecks quantity, side and actual liquidation safety before replacement. Real Binance entry and Re-Analyze now require explicit Contract Price and DIRECT/FALLBACK timeframe provenance; legacy open protection is preserved. User-facing Once results expose QUEUED/INELIGIBLE. No Engine scoring, strategy formula, Supervisor authority, Spot, Demo, Shadow observer or live account setting was changed.

## 2. TESTED OFFLINE

Focused safe seven-script matrix: **287/287 passed**, covering 2/10-way trigger concurrency, restart, manual-during-Auto, lifecycle identity, claim/consume faults, protection replacement and emergency-close faults, price basis, timeframe propagation, monetary no-widening, Supervisor LONG/SHORT/NEUTRAL alignment, WAIT fallback provenance, liquidation feasibility and synthetic fee/funding reconciliation. Web/admin Vite builds and both affected API bundles passed. `git diff --check` passed. Credential-dependent legacy scripts were not run; a separate Spot-oriented structural test has failures reproduced unchanged on the clean Production baseline. Offline tests do not prove live execution or profitability.

## 3. PRODUCTION-SCHEMA CLONE VERIFIED

Read-only Production **schema-only** dump (PostgreSQL 17.11; SHA-256 `d232618406317f9fda4d2dc9e022e13d2e92d48be8ba3426bd7f63b5ee78b897`) restored into disposable localhost PostgreSQL 18.6 without rows or Production credentials. Before: 88 public tables, no pending/claims/capacity trigger. Both candidate migrations applied and reapplied; after: 90 public tables, required tables, unique keys, RLS/grants and capacity trigger present. Actual PostgreSQL connection tests passed for 2/10 concurrent triggers, one-slot capacity under 10 attempts, duplicate symbol, exchange identity, manual priority, flat/Auto-off/lifecycle separation and fail-closed read errors. Transaction-abort rollback restored the prior shape. Production rows copied **0**; Production migrations **0**. Temporary schema dump removed. This is structural compatibility, not a live Production migration.

## 4. LIVE-ONLY BLOCKERS

Integrated Binance protection replacement/read-back is **unverified** without a naturally eligible open Real position. Fresh Real entry/exit commission, funding, realized PnL and app-ledger reconciliation is **unverified** without a naturally newly closed trade. The last read-only VPS aggregate check at 2026-09-22 09:25 UTC found zero of each; no later active-account state is claimed. No test Real trade was created.

## 5. EXACT AUTHORIZATION REQUIRED

Owner approval is required for the exact executable SHA, reviewed migration/backup/rollback window, Production merge/deploy and any bounded live exchange-write validation. A naturally eligible existing position is needed for protection read-back; a naturally closed trade is needed for accounting. Do not clear an uncertain durable claim or manufacture a trade merely to green a gate.

## 6. FINAL CANDIDATE SHA

Tested executable commit: `428c2c3bfb4edbf09cf1423f5aa408684341d65f`. Documentation-only branch HEAD: `66a2f1dae44d8962ab6c694a95a53ca1e266c7f9`. Last read-only verified Production runtime SHA at 09:25 UTC: `3d738da8d32ee61e552646c3d2db14715c1ca6ea`. Candidate was neither merged nor pushed to the Production repository.

## 7. TEST COUNTS

Focused runner **287 pass / 0 fail / 0 skip**. Schema clone migration/reapply/rollback and SQL concurrency/capacity gate passed separately. Web/admin builds **2/2**; changed API bundles **2/2**. TypeScript delta gates **2/2** for zero new diagnostics. Credential-dependent legacy suites unrun; the unchanged baseline Spot structural failure is not counted as a pass.

## 8. TYPECHECK BASELINE / NEW ERROR DELTA

Clean unchanged Production-SHA checkout compared by exact diagnostic multiset, with no suppressions. Full TypeScript: baseline **52**, candidate **52**, **0 new**. Targeted API modules: baseline **35**, candidate **30**, **0 new**, **5 removed**. The repository and targeted TypeScript commands remain red on pre-existing diagnostics; the machine-checkable zero-new-error gate is green, not `tsc` itself.

## 9. DEPLOY COMMAND SEQUENCE PROPOSED BUT NOT EXECUTED

1. Obtain fresh owner approval of the exact SHA, migration/backup/rollback and live-validation scope; independently check Shadow stop condition and current runtime.
2. Freeze candidate; rerun focused tests, disposable clone, builds, API bundles and TypeScript delta; require CI on the exact SHA.
3. Only after authorization, merge reviewed candidate, back up Production, apply reviewed migrations in a controlled window, verify schema/constraints and retain rollback readiness.
4. Only after separate deploy authorization, verify active SHA, service health, capacity and protection invariants before Real actions.
5. Under fresh bounded write approval, verify protection on a naturally eligible open Real position; observe a naturally closed Real trade for actual fee/funding/ledger reconciliation. If absent, leave both gates blocked.

**Not released. No merge, Production push, Production migration, deploy, Real Binance order, Spot/Demo mutation or Shadow mutation was performed.** Full project handoff: `docs/testing/real-futures-final-correctness-gate-2026-09-22.md` on the isolated candidate branch.
