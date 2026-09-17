# Whale Trading Phase 2 — functional Demo implementation and verification

Date: 2026-09-18 (Asia/Kuala_Lumpur). Repository: signal0verse/signalverse-main.
Task ID: `01a0b04b-d191-75c0-bafc-5ecc5e12152d`.

## Result and publication

Continued the existing Whale Trading foundation into an executable Demo pipeline under Copy Trade > Futures > Whale Trading. Whale selection supplies opportunities to the existing Futures architecture; it does not replace the central engine or copy the whale's position size. The Persian/English interface includes overview, live activity, qualified whales, watchlist, active positions, history, performance and settings.

- Feature branch: `codex/whale-trading-v1`.
- Implementation commit: `7ceb4c7005bf749d8be9566524a9b4f273c91551`.
- Final feature HEAD (portable SQL test runner): `9bafb7e88f684e980524aa8cb858a8775073d91b`.
- Foundation commit: `b92b8480c28af07c99e783cfdb2151498963b934`.
- Draft review: https://github.com/signal0verse/signalverse-main/pull/86
- Initial CI: https://github.com/signal0verse/signalverse-main/actions/runs/35258361206 — application tests passed up to the SQL step; temporary PostgreSQL startup failed on the Linux package socket default. The runner now explicitly disables Unix sockets in its disposable configuration (clients use random-port loopback TCP), reports its own cluster startup log on failure, and all 11 local SQL groups passed again after correction.
- Production runtime SHA: **not inspected or claimed**. No production deployment, migration, worker activation, private-account verification or real order was performed. Real Whale execution remains hard-locked.

This delivers an isolated, tested functional Demo implementation. The limitations and rollout checks below are explicit; this report does not claim every aspirational capability in the full specification or a live production rollout.

## Architecture and durable data

The path is public Hyperliquid WebSocket → existing exact net-position state → fenced transactional event/checkpoint persistence → durable owner jobs → existing market context → `analyzeOneCoinPro` / `computeShadowEngineState` → existing Demo supervisor policy → pending signal → `activateDemoPending` / `executeDemoProOpen` → transactional Demo ledger.

The whale cannot override WAIT, missing data, opposite engine direction, eligibility or risk decisions. Existing engine decisions, supervisor verdicts, pending/trade ledgers and post-trade analysis are reused. No private exchange adapter or second strategy engine was added. Standard Futures, Spot, Prediction and Real durable-order holds retain their policies.

Additive migration `whale_trading_v1.sql` provides settings, wallets, immutable-by-identity events, retryable jobs, singleton lease, owner lineage and Demo-only database constraints. Lease and revision fencing protect checkpoint commits. Unique pending/job/trade relationships and account/trade locks protect duplicate submissions and settlement. Direct service writes to events, wallets and leases are revoked; mutation goes through fenced RPCs. Public, anonymous and authenticated database roles cannot access the new tables; the existing authenticated server API scopes requests to the owner.

Startup/reconnect reconciles fresh snapshots and bounded inclusive-cursor fill/funding history. Historical or recovered events never become new entry instructions. Same-block net-size chains, partial fills, additions, reductions, exits and flips are checked; ambiguous/conflicting history is not silently accepted. Live ingestion persists before dispatch and does not wait for AI analysis. Periodic recovery is bounded to one queued pass. Incremental live history updates avoid sending the entire history on every fill.

Leverage, margin, cumulative funding, funding payments, stop/target changes and cancellations are observations, never direct order commands. Public provider limits are respected: at most ten global wallet subscriptions; excess wallets are visibly capacity-limited. History truncation and unavailable funding invalidate completeness instead of implying zero costs.

## Qualification, risk and management

Performance and copyability have separate scores and WATCHLIST / QUALIFIED / WARNING / PAUSED / DISQUALIFIED states. Completed round trips, fees, available funding, win rate, profit factor, holding time, concentration, recent/longer windows, additions, flips and liquidations inform qualification. Missing opening legs and ambiguous histories are excluded. Backfill receipts do not count as observed live latency.

User settings control Demo enablement, capital, margin, maximum leverage, requested margin mode, position count, symbol/direction concentration, stop risk, notional, daily realized loss, capital drawdown, freshness, price drift and qualification requirements. Optional whale leverage remains capped by user limits and the existing liquidation feasibility logic. Eligible whale SL/TP must be unique full-position reduce-only closing-side protection and pass the existing direction/R:R checks; configurable central-engine fallback applies otherwise.

Open trades use the existing Demo protection evaluator. Atomic settlement covers automated and manual closure. Monitoring remains active after entry pause or watchlist removal. Alignment shows ALIGNED / WEAKENING / INVALIDATED / UNKNOWN. Existing central reanalysis can tighten protection when confirmed and valid; a whale exit alone does not force our exit. Existing policy does not reverse, resize or force-close on disagreement, so no separate whale strategy was invented.

## Replay and UI

Offline replay compiles the actual pure central engine, leverage and Demo protection declarations through an AST dependency boundary. It does not import API bootstrap, credentials or copied strategy formulas. Chronological frames reject future market, candle, macro and event observations. Entry cannot exit on an earlier bar; open trades remain open at the end.

Replay distinguishes original whale closed results, blind-copy comparator and intelligent Demo, with accepted/rejected decisions and gross/estimated-fee results. Absolute original-whale PnL is not a normalized comparison because sizing differs. The live performance view shows available whale metrics; no synthetic blind-copy live PnL is presented as observed data.

The actual UI components were inspected in Persian and English with a synthetic API fixture. Watchlist actions, eight sections, risk settings, saved settings and active positions were checked. At 390 × 844, the panel had no horizontal overflow. Browser viewport was restored and the temporary preview was stopped after QA. This is frontend fixture verification, not a live user-account test.

## Verification evidence

| Check | Result |
| --- | --- |
| Explicit offline allowlist | **360 tests passed, 0 failed, 0 skipped**: 62 Whale cases + 298 existing Futures cases |
| Actual PostgreSQL 18.4 isolated cluster | **11 groups passed** |
| End-to-end SQL scenario | Actual state → qualification → actual analyzer → actual Demo executor → SQL ledger → whale exit observation → actual monitor → history passed |
| Database guarantees | Migration reapply, RLS/grants, watch capacity, lease fencing, dedup/conflict rollback, revision conflict, Real constraints, concurrent single entry/debit, concurrent single exit/credit and backup/restore passed |
| Production builds | Web and standalone admin passed; existing Vite large-bundle warning remains |
| New panel/views | Isolated strict TypeScript passed |
| Changed API bundles | Both passed esbuild Node 22-target compilation |
| Browser fixture QA | Persian/English and 390-pixel mobile layout passed |
| Whitespace | `git diff --check` passed |

Local Node version was 24.19.0. Tests used synthetic transports or fresh private PostgreSQL clusters; no production database, account, credentials, paid model calls or orders were used. No arbitrary broad scripts were executed. The exact safe commands are recorded in `docs/testing/stability-test-runbook.md`.

**Final Node 22/Linux CI passed** on commit `9bafb7e88f684e980524aa8cb858a8775073d91b`: [Production CI run 35258807493](https://github.com/signal0verse/signalverse-main/actions/runs/35258807493). The full existing workflow, including new Whale offline/SQL groups, admin, historical/simulation, Real execution fault, stablecoin, prediction, database, build and API artifact checks, completed successfully. This pull-request run does not deploy production.

## Remaining limits and rollout gates

1. Production migration compatibility, reviewed deployment, worker environment/unit installation and fresh live public-wallet observation remain rollout checks. The provided systemd unit targets the repository's actual `/opt/signalverse/app` layout. No production enablement was performed.
2. Historical replay covers exact core entry/protection, not unrecorded historical AI-assisted management. Missing AI verdicts, liquidity and protection modifications are not reconstructed from current information.
3. Demo funding is unavailable and fees are estimated. CROSS is recorded as a requested mode but collateral netting is not simulated; existing isolated liquidation estimates remain conservative. No profitability claim is made.
4. Drawdown from provider history is a closed-PnL/equity proxy, not full historical account maximum drawdown. Direction concentration is not an empirical correlation matrix.
5. The provider's latest-10,000-fill ceiling and bounded local profile can make history incomplete. HIP-3/custom multi-DEX account reconstruction is not certified; unsupported/incomplete markets are not executable candidates.
6. Existing Standard Demo balance mutations are not transactional. Whale-owned mutations are transactional, but mixed-mode legacy Demo concurrency remains a known broader limitation.
7. Real Whale remains locked at UI, API and database levels. Passing synthetic/offline tests is not verification of private-account execution.

Before rollout: follow the existing production backup/restore gates; apply watchlist then V1 migrations after Futures schema; deploy reviewed API/UI; configure the worker's service database access and dedicated secret via protected environment files; install the unit; verify service lease, fresh snapshots, release SHA and monitoring. Keep exchange signing keys out of the public-feed worker. Users explicitly enable Demo settings. Rollback preserves ledgers and open-position protection.

## Documentation and source references

The implementation, rollout and limitations are documented in `docs/whale-trading-phase2.md`; the exact Phase 2 request is retained in `docs/whale-trading-phase2-specification.md`. HANDOFF, AI_HANDOFF, strategy amendment, safe test runbook and floating help were updated. Unrelated contributor files and temporary artifacts were not committed.

Provider limits and public data semantics were checked against official documentation:
- [Hyperliquid Info endpoint](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint)
- [Hyperliquid WebSocket subscriptions](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/websocket/subscriptions)

No credentials, private account data, database exports or test artifacts are included in this report.

## Changed-file inventory (relative to the starting foundation commit)

Created:

```text
docs/whale-trading-phase2-specification.md
docs/whale-trading-phase2.md
migrations/whale_trading_v1.sql
ops/signalverse-whale.service
scripts/lib/actual-futures-core.mjs
scripts/lib/sql-postgrest-fixture.mjs
scripts/lib/whale-test-db.mjs
scripts/whale-engine-integration-test.mjs
scripts/whale-replay.mjs
scripts/whale-sql-test.mjs
scripts/whale-v1-test.mjs
server/whale-trading/analytics.mjs
server/whale-trading/recovery.mjs
server/whale-trading/replay.mjs
server/whale-trading/service.mjs
server/whale-trading/worker.mjs
src/app/WhaleTradingViews.tsx
```

Modified:

```text
.github/workflows/production-ci.yml
HANDOFF.md
TRADING_STRATEGY.md
api/analyze.ts
api/copytrade.ts
docs/AI_HANDOFF.md
docs/testing/stability-test-runbook.md
docs/whale-trading-v1.md
scripts/whale-watchlist-test.mjs
server/whale-trading/hyperliquid-provider.mjs
server/whale-trading/position-state.mjs
src/app/App.tsx
src/app/WhaleTradingPanel.tsx
```

The initial Windows sandbox could not initialize PostgreSQL because of restricted-token behavior; the authorized isolated test ran outside that restriction. A pg_ctl inherited-pipe timeout was corrected by disconnecting its stdio. During the Linux startup fix, passing single-quoted empty socket settings through Windows pg_ctl treated quotes literally and failed to create a socket lock file; writing the setting to the temporary postgresql.conf resolved the cross-platform quoting issue. Final local SQL verification passed all 11 groups. These were test-harness startup failures, not production operations.
