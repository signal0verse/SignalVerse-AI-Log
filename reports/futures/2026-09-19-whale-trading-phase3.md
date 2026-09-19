# Whale Trading Phase 3 — public-data Demo readiness

Date: 2026-09-19 (Asia/Kuala_Lumpur). Repository: `signal0verse/signalverse-main`.
Task ID: `01a0b04b-d191-75c0-bafc-5ecc5e12152d`.

## Result and publication state

Phase 3 completes the requested Whale Trading section inside Copy Trade > Futures. Users select Hyperliquid whale wallets instead of a static coin list; a qualified public wallet event enters the existing Futures analysis, supervisor, pending, independent risk/sizing, Demo execution and protection architecture. The central Futures strategy was not replaced or changed.

- Feature branch: `codex/whale-trading-v1`.
- Starting commit: `9bafb7e88f684e980524aa8cb858a8775073d91b`.
- Phase 3 commit/final feature HEAD: `92e044891a1fa9ac68adb0b1a6e43a5e25101547`.
- Draft review: https://github.com/signal0verse/signalverse-main/pull/86
- Node 22/Linux CI: https://github.com/signal0verse/signalverse-main/actions/runs/35431914020 — passed in 2m22s.
- Production runtime SHA: not inspected or claimed.
- No production migration, service installation, worker activation, private-account access, exchange order or Real enablement occurred. The PR workflow skipped packaging and production delivery as designed.

The section remains Demo-only and Real Whale Trading remains locked at UI, API, database and execution-routing levels.

## Public live-data verification

Two separate 120-second observations used only the documented public Hyperliquid WebSocket and Info endpoints. The observer discovered at most two public counterparties from the BTC public trade stream, then exercised the actual provider, recovery, exact net-position state and worker against a local in-memory durable store. It loaded no `.env`, database URL, account credential, signing key or exchange adapter.

| Evidence | Result |
| --- | --- |
| First observation | 2 real public fills; detection 505–584 ms |
| Second observation | 1 real public BTC partial close; detection 423 ms |
| State | Observed fills normalized and persisted before publication; exact net position recovered |
| PostgreSQL replay of capture | First capture's 2 public fills persisted through the real `whale_commit` RPC in a fresh isolated PostgreSQL cluster |
| Trading side effects | 0 Demo executions and 0 Real orders in both observation runs |

No observed wallet was promoted or qualification was bypassed. The second observation produced one DISQUALIFIED wallet and one WATCHLIST wallet with partial evidence. Therefore a live-public-data → qualified whale → Demo open → close lifecycle was **not observed**. The Demo lifecycle evidence below is isolated synthetic/actual-code verification, not a claim of a live authorized account trade. The 423–584 ms sample is observational evidence, not a latency guarantee.

## Worker, recovery and observability

The public worker now has a bounded serialized queue, graceful drain, startup cleanup, per-wallet recovery isolation, structured error events, queue/error counters, last processing and reconciliation timestamps, provider reconnect/error/last-message health and stale-wallet counts. Existing singleton lease, checkpoint revision fencing, deduplication, gap invalidation, inclusive backfill and snapshot recovery remain in force.

Existing position monitoring runs before durable job claim or new analysis on every tick. A failed queue claim or slow/unavailable analysis cannot postpone that tick's protection call. Live ingestion still persists state before dispatch and does not wait for AI analysis.

Every event records source, receipt, normalization, database processing, state revision and LIVE/DELAYED/RECOVERED quality. Decision records expose measurable T0–T6 intervals for detection, normalization, persistence, queue, engine, optional supervisor, execution and total decision time. Unmeasured stages remain null rather than fabricated zeroes.

## Qualification and whale profile

Qualification now exposes COMPLETE/PARTIAL/UNKNOWN evidence and score confidence. Incomplete history, costs/funding, gaps or insufficient completed trades cannot display a strong performance/copyability score or complete net PnL. Forward evidence records observation age, live-fill sample, history sample and provider-limit/gap labels.

The profile includes completed sample, average and median holding evidence, current snapshot leverage, current protected positions, preferred symbols/shares, reductions and live observations. Unavailable historical market-condition behavior stays null. Snapshot leverage is labeled as current-only evidence and is not presented as historical leverage distribution.

Whale and user positions remain distinct. Symbols originate from qualified wallet events. User capital, margin, leverage cap, notional, concentration, daily loss, drawdown, freshness and price-drift limits remain authoritative. Whale position size is not copied. CROSS collateral netting is explicitly unavailable in Demo and no exchange-equivalent collateral model is fabricated.

## Engine, protection and lifecycle

The existing `analyzeOneCoinPro` / deterministic engine, existing supervisor policy, pending ledger, Demo executor, liquidation feasibility and protection logic remain the only decision path. The whale cannot override WAIT, missing evidence, opposite engine direction, account eligibility or risk limits.

Observed whale stop/target changes are management evidence. A stop may replace current protection only after the central reanalysis confirms the current side and the observed stop is tighter, direction-valid and passes the existing R:R validator. If it fails, a valid centrally proposed tighter stop may apply. Looser/invalid stops, cancellation, unavailable review and rejected review preserve current protection. Whale target changes are recorded but not mirrored under current policy. Whale exits remain evidence; existing SL/TP and management logic decide the user's exit.

Pausing or removing a whale stops new entries while existing trade monitoring continues. Entry drift, current whale position, user position, alignment and protection decisions are retained in audit context.

## Demo ledger, Simulator and analytics

The dashboard separates:

1. source-whale metrics from provider evidence;
2. the user's observed Demo ledger; and
3. hypothetical blind/intelligent replay.

Demo performance labels estimated fees, unavailable funding, bounded recent history and closed-PnL drawdown. It does not call the result complete net return. The blind replay documents its entry rule, latency/slippage/fee assumptions, win rate, drawdown and no-protection behavior. Rejected opportunities have `NOT_OBSERVED` outcomes instead of invented subsequent PnL. Replay continues compiling actual pure central-engine/protection declarations and rejects look-ahead.

## Bilingual and mobile UI

Persian and English views show evidence completeness, available history, live samples, worker queue/reconnect/errors, event detection/persistence time, Whale Position versus Your Position, entry drift, engine decision time and protection outcome. Notifications cover worker disconnect, new Demo copy, lifecycle and qualification changes without raw-fill spam.

The actual components were inspected at 390×844 and desktop with the second real public capture. Persian RTL, English LTR, wallet/symbol/number direction, live activity, watchlist, performance and settings rendered without horizontal overflow. The temporary browser tab and local preview server were closed after QA.

## Security and Real lock

Additive migration `whale_trading_phase3.sql` creates event evidence fields and a NOLOGIN `whale_feed` role. It can read only public watch addresses and public feed state and execute only the fenced lease/commit RPCs. Actual PostgreSQL tests proved it cannot read owner IDs, settings, jobs, Demo accounts or trades; claim jobs; call activation; or update feed tables directly.

The worker requires a signed JWT whose role claim is exactly `whale_feed`. It rejects a service-role key, exchange keys/secrets/private keys, the internal copy-trade secret, external dispatch origins and credentialed loopback URLs. PostgREST remains responsible for JWT signature and expiry validation. The systemd unit uses a separate `signalverse-whale` OS user, restrictive umask and inaccessible application environment paths.

Public events retain `executionAllowed:false`. Real Whale pending/trade constraints and execution routing remain locked. Passing tests, receiving an HTTP response or running a public observer is not private-account execution evidence.

## Verification categories

| Category | Evidence and result |
| --- | --- |
| UNIT / INTEGRATION | **71/71** Whale state, provider, watchlist, actual Futures integration and Phase 3 cases passed |
| API compilation | `api/analyze.ts` and `api/copytrade.ts` bundled successfully |
| UI type safety | Strict isolated TypeScript check passed for `WhaleTradingPanel`, `WhaleTradingViews` and `WhaleEvidence` |
| BUILD | Main web and standalone admin production builds passed; existing Vite >500 kB chunk warning remains |
| ISOLATED POSTGRESQL | **13/13 groups passed** on PostgreSQL 18.4 |
| SYNTHETIC ACTUAL-CODE E2E | Actual state → qualification → actual analyzer → actual Demo executor → SQL ledger → protection exit → history passed |
| LIVE PUBLIC DATA | 3 real public fills across two bounded observations; exact public state and two captured-event SQL inserts verified |
| LIVE DEMO E2E | **Not observed** because no sampled wallet legitimately qualified; no bypass was used |
| BROWSER QA | Persian/English, 390×844 and desktop passed with an actual public capture |
| FULL CI | Production CI run 35431914020 passed every executed test, SQL, build, bundle and artifact check; PR deploy steps were skipped |
| WHITESPACE | `git diff --check` passed |

The local full-project `tsc --noEmit` command still reports pre-existing missing optional UI dependencies and unrelated existing type errors. The changed Whale UI modules passed their isolated strict check, and both production builds passed. Local Node was 24.19.0; final CI used repository-required Node 22.

No arbitrary test-script glob was run. The safe allowlist and public observer rules are recorded in `docs/testing/stability-test-runbook.md`.

## Migration and rollout gates

Production remains untouched. A reviewed rollout must:

1. record the active production SHA, database identity/version and service paths;
2. complete the standard backup and restore verification;
3. apply existing Futures migrations, `whale_watchlist.sql`, `whale_trading_v1.sql`, then `whale_trading_phase3.sql` and recheck RLS, constraints and grants;
4. inventory the real PostgREST authenticator, grant only the required `whale_feed` membership and issue a short-lived signed role JWT;
5. provision a protected worker environment containing only database public API URL, restricted role JWT, worker dispatch secret and loopback API base;
6. install the reviewed unit under the dedicated OS user and verify the deployed/worker SHAs before enable/start;
7. verify a single renewable lease, fresh snapshots/checkpoints, queue/reconnect/error metrics and gap recovery;
8. observe a real public event through persistence, state and UI while confirming that it cannot create Real activity;
9. enable Demo only for an authorized test account after sufficient evidence and verify independent sizing, mandatory protection, atomic ledger and monitoring;
10. re-run all UI/API/database/execution Real locks;
11. roll back by pausing entries while retaining open-position monitoring, then stop the worker and restore the prior app without deleting ledgers.

## Remaining limitations

- Production migration, worker installation, live production UI, authorized-account Demo lifecycle and active runtime SHA verification have not occurred.
- Public history remains bounded by provider limits; PARTIAL evidence can improve only with future persisted observation.
- Demo funding is unavailable, fees are estimates, CROSS collateral netting is not simulated and closed-PnL drawdown is not full account equity drawdown.
- Historical AI management is unavailable and replay does not invent it.
- The blind comparator is hypothetical, not a live portfolio.
- Existing Standard Demo balance writes retain the broader mixed-mode concurrency limit. Whale-owned entry and settlement remain transactional.
- Public observation proves transport/state behavior, not profitability or private-account execution.

## Documentation and references

Primary implementation handoff: `docs/whale-trading-phase3.md`. `HANDOFF.md`, `docs/AI_HANDOFF.md`, the safe test runbook, Phase 2 pointer and floating help were updated. No strategy formula or policy changed, so `TRADING_STRATEGY.md` did not receive a new amendment.

Official provider references:

- [Hyperliquid WebSocket subscriptions](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/websocket/subscriptions)
- [Hyperliquid Info endpoint](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint)

No credential, private account data, database export or temporary capture is included in this report.

## Changed-file inventory

Created:

```text
docs/whale-trading-phase3.md
migrations/whale_trading_phase3.sql
scripts/whale-phase3-test.mjs
scripts/whale-public-observe.mjs
server/whale-trading/observability.mjs
src/app/WhaleEvidence.tsx
```

Modified:

```text
.github/workflows/production-ci.yml
HANDOFF.md
api/analyze.ts
api/copytrade.ts
docs/AI_HANDOFF.md
docs/testing/stability-test-runbook.md
docs/whale-trading-phase2.md
ops/signalverse-whale.service
scripts/whale-sql-test.mjs
server/whale-trading/analytics.mjs
server/whale-trading/hyperliquid-provider.mjs
server/whale-trading/replay.mjs
server/whale-trading/service.mjs
server/whale-trading/worker.mjs
src/app/WhaleTradingPanel.tsx
src/app/WhaleTradingViews.tsx
```

Unrelated untracked contributor files and ignored observation/build artifacts were preserved and not committed.
