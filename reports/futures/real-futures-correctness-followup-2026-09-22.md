# Real Futures correctness follow-up — candidate remains undeployed

## Metadata

- Date: 2026-09-22 UTC
- Task ID: Final Real Futures correctness remediation, follow-up
- Module: Real Binance Futures analysis, Re-Analyze, protection and emergency exit
- Mode: Isolated implementation, offline fault tests, Production read-only checks
- Repository: `signal0verse/signalverse-main`
- Branch: `codex/futures-correctness-2026-09-22` (local only)
- Starting commit: `6bf9bcf67b01275aff69c918a3598b6885a008f6`
- Ending candidate commit: `751819782fd31376a4745acdce657a5e92a11b42`
- Active Production SHA verified by symlink and marker: `3d738da8d32ee61e552646c3d2db14715c1ca6ea`

## Objective

Continue the existing Real Futures correctness work end-to-end where evidence permits, without a strategy redesign, Spot/Demo behavior change, Shadow alteration, or unauthorized live Binance write. Do not merge or deploy until the stated acceptance gates pass.

## Scope

Real Binance Futures price-source consistency, legacy-decision fail-closed behavior, emergency-close protection ordering, manual protection confirmation, and related offline tests. The previous candidate's selected-timeframe, monetary-risk, claim, capacity, Supervisor and WAIT fixes remain in the branch; its two migrations remain unapplied.

## Actions Taken

1. Audited the current candidate and observed that the emergency AT_RISK path canceled native SL/TP before a reduce-only close, while Real Binance analysis and several lifecycle checks still used Spot data.
2. Changed Real Binance analysis to use server-observed USD-M contract candles; manual Pro analysis discards client-supplied Spot indicators. Exact selected intervals are retained, and unavailable contract data blocks analysis/entry without a Spot fallback.
3. Tagged opening decision provenance as `CONTRACT_PRICE`; old pending/direct decisions without verified provenance cannot submit a new Binance entry. Legacy OPEN trades keep existing protection and do not authorize contract-basis Re-Analyze from an unknown opening source.
4. Matched software SL to Contract Price and TP to Mark Price; entry R:R uses the contract ticker. Kept fill/commission/income-based accounting and Binance actual liquidation price separate.
5. Reordered emergency close so native protection stays until a fresh position read confirms flat. Corrected manual proposal confirmation to require DB acknowledgements. Made batch source failures consume neither AI credit nor Pro cycle.
6. Updated focused tests, handoff and floating-help knowledge. Created local candidate commit only; no main merge or Production push.

## Files Inspected

`AGENTS.md`, `CLAUDE.md`, `HANDOFF.md`, `docs/AI_HANDOFF.md`, `TRADING_STRATEGY.md`, `docs/testing/stability-test-runbook.md`, `docs/testing/real-futures-correctness-remediation-2026-09-22.md`, relevant API modules, migration files and focused test scripts.

## Files Changed

`api/analyze.ts`, `api/copytrade.ts`, `scripts/futures-correctness-test.mjs`, `scripts/futures-liquidation-feasibility-test.mjs`, `scripts/futures-pro-timeframes-test.mjs`, `scripts/futures-real-execution-fault-test.mjs`, `scripts/futures-real-price-basis-test.mjs`, `scripts/futures-reanalysis-test.mjs`, `HANDOFF.md`, `docs/AI_HANDOFF.md`, `docs/testing/real-futures-correctness-followup-2026-09-22.md`.

## Root Cause / Findings

- CONFIRMED: Old emergency close canceled protection before a possibly failing market close. Fault injection reproduced two deletes before a 503; corrected behavior performs zero deletes while the close is uncertain.
- CONFIRMED: Real Binance Spot/Contract/Mark mixing. The candidate now has explicit basis selection; public contract and Mark kline endpoints each returned HTTP 200 from the VPS. Reachability is not private execution verification.
- CONFIRMED: Manual protection confirmation previously did not require a successful trade-row write. Fault test now returns NOT_CONFIRMED on a failed DB acknowledgement.
- CONFIRMED: Batch `SOURCE_UNAVAILABLE` had skipped credit but not cycle consumption; both now skip.
- CONFIRMED: The active Production database currently has zero OPEN Real Binance positions and zero newly closed Real Binance trades since the prior executable marker, so live protection replacement and fresh fee/funding reconciliation cannot be demonstrated now.
- UNCONFIRMED: Binance exchange behavior for the new replacement sequence on a real open position; no live write was authorized or attempted.

## Implementation

The exact code and audit matrix are in the candidate handoff document cited above. The entry strategy, Engine score/thresholds, Demo, Spot, and independent 24-hour Shadow observer were not changed. No historical accounting backfill was performed.

## Tests Executed

- `node --test` over the seven selected focused suites: **272/272 PASS**, zero failed. Includes timeframe pinning, monetary no-widening, protection faults, emergency ordering, final funding, price provenance, Supervisor/WAIT, and liquidation separation. These are offline fixtures, not live exchange proof.
- App Vite build: PASS in isolated output directory after the default output path hit sandbox `EPERM`.
- Admin Vite build: PASS in isolated output directory.
- esbuild of `api/analyze.ts` and `api/copytrade.ts` with `write:false`: PASS.
- `git diff --check`: PASS.
- Read-only VPS checks: active SHA marker/symlink agree, service active, `/healthz` `ok:true`; public ETHUSDT contract and Mark kline endpoints HTTP 200.
- Read-only Production DB aggregate: OPEN Real Binance = 0; newly closed Real Binance since executable marker = 0; candidate claim table and capacity trigger absent.
- Not rerun: PostgreSQL production-schema clone/migrations; unsafe legacy test scripts that load Production env/DB; private Binance replacement or account mutation.

## Build Result

Both Vite builds and affected API bundles passed. Repository-wide TypeScript check failed on existing unrelated frontend/module/Spot diagnostics. A targeted two-API check also remains red on existing diagnostics in those large modules; new `SOURCE_UNAVAILABLE` type-narrowing diagnostics encountered during this task were corrected. Neither typecheck is reported as green.

## Git Status

Local candidate committed on the isolated branch; no push to main/master and no deployment. Production remains `3d738da8d32ee61e552646c3d2db14715c1ca6ea`.

## Commit

`751819782fd31376a4745acdce657a5e92a11b42` (candidate only).

## Remaining Issues

The unique per-trade Re-Analyze claim prevents concurrent analysis/protection but does **not** yet retain one durable pending trigger arising during a run. The two candidate migrations are unapplied to Production. Production-schema restore/migration, final CI, integrated Real protection read-back, and fee/funding reconciliation on a genuinely newly closed Real trade are outstanding. No current position/trade exists to satisfy the latter live gates without a separately authorized, bounded real-money action.

## Risks / Limitations

Offline tests and HTTP 200 cannot prove exchange-side protection, profitability or private accounting. Binance cannot atomically couple a reduce-only MARKET close with trigger-order retirement; uncertain close must remain OPEN/UNKNOWN until reconciled. Legacy untagged decisions are intentionally blocked from new Real Binance entry and automatic protection replacement, not silently converted. Full typecheck is still red. No Production database, code, service setting, exchange order, or 24-hour Shadow state was changed.

## Recommended Next Step

Implement and test the durable one-pending-trigger coalescing invariant, then run restored Production-schema migration tests and final CI. Do not deploy or merge until the owner-specified gates are actually met; obtain fresh, bounded authority before any new live Binance write outside normal Production operations.
