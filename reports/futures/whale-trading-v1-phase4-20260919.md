# SignalVerse Whale Trading V1 — Phase 4 engineering handoff

## Metadata

- **Task:** Phase 4 — Live Qualified-Whale → Demo Lifecycle, Evidence Accumulation & Operational Readiness
- **Date:** 2026-09-19 (Asia/Kuala_Lumpur); live evidence times are UTC
- **Repository:** `signal0verse/signalverse-main`
- **Branch:** `codex/whale-trading-v1`
- **Starting commit:** `92e044891a1fa9ac68adb0b1a6e43a5e25101547`
- **Ending commit:** `696973a3f2942351be35e0012e664e95e04a5d89`
- **Pull request:** https://github.com/signal0verse/signalverse-main/pull/86
- **CI:** PASS — Production CI run `35434158975`
- **Production deployment:** NOT PERFORMED
- **Production database migration:** NOT PERFORMED
- **Private account or Real Whale execution:** NOT PERFORMED
- **Outcome:** **Outcome B** — no legitimate qualified Whale appeared in the bounded observation window; qualification was not forced and no live Demo E2E is claimed.

## Delivered behavior

Phase 4 keeps the existing real Futures architecture and the Whale Trading section
inside Copy Trade → Futures. Wallet selection supplies opportunity symbols and
directions; it does not introduce a separate symbol universe or trading engine.
Current Futures analysis, pending ledger, risk gates, Demo execution and continuous
protection remain authoritative.

The operator now has four explicit modes:

1. `PUBLIC_OBSERVATION`
2. `DEMO_COPY_ENABLED`
3. `DEMO_COPY_PAUSED`
4. `EMERGENCY_KILL`

Only `DEMO_COPY_ENABLED` admits new Demo candidates. Paused and emergency modes keep
monitoring and protection of existing Demo positions active. The UI also exposes the
existing atomic close path for each active Whale Demo position. Real remains locked in
settings validation, request routing, pending/trade database constraints and execution
adapters.

Qualification now reports LOW/MEDIUM/HIGH confidence. Existing thresholds and score
weights were preserved. Provider-incomplete history may qualify only after the existing
minimum days and completed-trade count accrue naturally from uninterrupted forward
observation with complete funding/cost evidence. Historical backfill cannot become a
fresh entry instruction, a gap breaks continuity, and a short incremental page cannot
upgrade uncertain old history.

Owner-scoped qualification state and append-only transition events are recorded before
job gating. Each candidate and Demo activation keeps wallet/event/symbol/direction,
source price/time, Whale and user size/leverage/margin mode, entry drift, SL/TP,
qualification/copyability, Engine/risk/protection outcome and T0–T6 timing lineage.

## Files created

- `docs/whale-trading-phase4.md`
- `migrations/whale_trading_phase4.sql`
- `ops/whale-worker.env.example`
- `scripts/whale-phase4-test.mjs`

## Files modified

- `.github/workflows/production-ci.yml`
- `HANDOFF.md`
- `api/copytrade.ts`
- `docs/AI_HANDOFF.md`
- `docs/testing/stability-test-runbook.md`
- `scripts/lib/whale-test-db.mjs`
- `scripts/whale-provider-test.mjs`
- `scripts/whale-public-observe.mjs`
- `scripts/whale-sql-test.mjs`
- `scripts/whale-v1-test.mjs`
- `server/whale-trading/analytics.mjs`
- `server/whale-trading/hyperliquid-provider.mjs`
- `server/whale-trading/observability.mjs`
- `server/whale-trading/recovery.mjs`
- `server/whale-trading/service.mjs`
- `server/whale-trading/worker.mjs`
- `src/app/WhaleTradingPanel.tsx`
- `src/app/WhaleTradingViews.tsx`

Unrelated untracked user files were not staged or modified.

## Migration and access boundary

`whale_trading_phase4.sql` is additive and was not applied to production. It creates:

- `whale_qualification_state`, keyed by owner and wallet;
- `whale_qualification_events`, append-only transition evidence;
- `whale_record_qualification`, a security-definer RPC that checks watchlist ownership,
  locks the owner/wallet row, rejects stale wallet revisions, serializes concurrent
  transitions and appends only when status changes.

RLS is enabled. Public, anonymous, authenticated and `whale_feed` roles have no access
to owner qualification state/events and cannot execute the RPC. `service_role` receives
only the required select/execute grants. The public-feed worker still cannot read owner
settings, jobs, Demo accounts/trades or credentials and cannot activate a trade.

Reviewed migration order:

1. `whale_watchlist.sql`
2. `whale_trading_v1.sql`
3. `whale_trading_phase3.sql`
4. `whale_trading_phase4.sql`

## Worker and recovery changes

The public provider validates Hyperliquid subscription snapshots but does not deliver
their historical rows into the live queue. REST snapshot/backfill is the authoritative
recovery path. The worker creates durable REST checkpoints before accepting the live
stream, then reconciles from the checkpoint with overlap instead of downloading an
incomplete 90-day window every 30 seconds.

History request failures, bounded history and incomplete incremental windows are
separate states. A network failure cannot restore continuous forward evidence. Worker
health now includes start time, qualification-transition count, last transition, queue,
reconnect/error state, processed/reconciliation times, stale wallets, `realLocked` and
release SHA. Qualification logs are emitted on state transitions rather than every fill.

## LIVE PUBLIC OBSERVATION

All runs used `scripts/whale-public-observe.mjs`, public Hyperliquid WebSocket/REST,
six discovered public wallets, an in-memory durable observer and no `.env`, database,
private key, signing client or order adapter. Artifacts remained under ignored `tmp/`.

| Run | UTC period | Real live fills | Result | Final health |
| --- | --- | ---: | --- | --- |
| Diagnostic | 08:45:19–08:50:32 | 30 | 0 qualified; 2 disqualified | 16 reconnects, 16 feed errors, 135 worker errors, 6 stale wallets |
| After snapshot/incremental fix | 08:55:56–08:59:08 | 136 | 0 qualified; 1 disqualified | 4 reconnects, 4 feed errors, 2 worker errors, 0 stale wallets |
| Final after startup checkpoint fix | 08:59:38–09:03:33 | 36 | 0 qualified; 1 disqualified | 0 reconnects, 0 feed errors, 0 worker errors, 0 stale wallets |

The final command included discovery and about 113 seconds of initial public REST
checkpointing before the requested 120-second live stream. The stream observed 21
increases and 15 partial closes. All 36 were normalized and persisted; duplicate
incidents were zero. Reconstructed rows were labelled separately and synthetic rows
were zero.

### Qualification evidence

- Qualified Whale count: **0**
- Qualified Whale event count: **0**
- Rejected/disqualified wallets: **1**
- Watchlist wallets: **5**
- Qualification transitions: **6 initial natural evaluations**, no forced promotion
- Complete-history disqualified wallet: Performance Score **0**, Copyability **76.36**,
  99 completed trades; failed performance and drawdown.
- Other wallets: scores remained unavailable because provider history, duration, sample
  or funding/cost evidence was incomplete. No missing value was converted to zero.

### Latency and persistence

- Average local persistence after normalization: **125.58 ms**
- Average source-clock lead over host: **670.53 ms**
- Average one-way detection latency: **NOT VERIFIED / null**
- Unmeasured detection events due to clock skew: **36**

The exchange source timestamp was ahead of the host clock. Reporting a negative value
as latency would be false, so the event and operator reports expose clock skew and keep
one-way detection latency null. A synchronized host/exchange time source is a rollout
gate.

### Engine, risk, Demo and lifecycle results

- Engine-approved live qualified candidates: **0**
- Engine-rejected live qualified candidates: **0**
- Live Demo entries: **0**
- Live Demo exits: **0**
- Live protection modifications: **0**
- Live partial/full Demo lifecycle events: **0**
- Real orders: **0**
- Entry drift / protection coverage for live Demo: **NOT VERIFIED**
- Position recovery for an authorized live Demo: **NOT VERIFIED**

No legitimate qualified event existed, so the system correctly did not manufacture a
Demo trade. No profitability or edge can be inferred.

## SYNTHETIC INTEGRATION

The actual central analyzer, pending creation, Demo executor, existing risk/protection
logic, Whale reduction/exit observation and replay use the real code path under isolated
fixtures. These tests verify behavior and regression safety; they are not live evidence.

- **80/80** Whale unit and synthetic integration tests passed.
- Coverage includes exact net state, flips/reopens/partial/full closes, deduplication,
  provider validation, bounded queue, reconnect/gap recovery, forward qualification,
  user-owned margin/leverage/capital, protection validation, actual Engine integration,
  timing, replay, dashboard ownership and Real locks.

## ISOLATED POSTGRESQL

- **13/13** groups passed on PostgreSQL **18.4**.
- All Whale migrations applied twice.
- Dedicated feed role, grants and RLS remained isolated.
- Watchlist capacity/normalization, singleton lease, event/job atomicity, deduplication,
  revision fencing and expired-lease rejection passed.
- Qualification transitions were deterministic and append-only under two concurrent
  RPC calls; only one transition row was appended.
- Forged Real settings/mode remained blocked at the database layer.
- Concurrent activation created one Demo trade and debited once.
- Actual state → qualification → Futures analyzer → Demo SQL ledger → protection exit
  passed.
- Concurrent close settled once and restart could not repeat it.
- Backup and restore retained rows and constraints.

## AUTHORIZED DEMO E2E

**NOT VERIFIED.** No natural qualified event occurred in the bounded live window and no
authorized private Demo account was used. The isolated actual-code/PostgreSQL scenario
is not relabelled as live Demo.

## HISTORICAL REPLAY

Existing actual-core replay regression passed under synthetic fixtures. Replay remains
separate from live public observation and from authorized Demo. It is not a claim of
profitability or future performance.

## UI and language verification

The Whale Trading section now shows:

- qualification confidence, evidence basis and observed-since time;
- qualification changes separate from live fills;
- filters for qualification/evidence/performance/copyability/win rate/drawdown/trades,
  active position and recent activity;
- expandable evidence, behavior, positions, Demo history and rejected opportunities;
- explicit operating controls and emergency-entry explanation;
- active-position Demo close action;
- observation counts, timing/clock-skew/persistence, evidence classes and limitations.

Persian and English content was rendered through a local mocked-dashboard harness.
Persian was visually inspected at 390×844: `dir=rtl`, document scroll width 375 for a
390 viewport, no horizontal overflow, natural labels and reachable settings/close
controls. English desktop showed the same evidence and Real-lock language. This was UI
QA, not a production login or account test.

## Build and CI evidence

- Main Vite production build: **PASS**
- Standalone admin Vite build: **PASS**
- Whale UI strict TypeScript: **PASS**
- API bundle: **PASS, 14 handlers** with production-equivalent esbuild options
- `git diff --check`: **PASS**
- Pull request CI: **PASS** — https://github.com/signal0verse/signalverse-main/actions/runs/35434158975

The existing Vite large-chunk warning remains; it is not introduced as a correctness
failure. The full-project TypeScript baseline was not used as a new gate because the
repository has unrelated known diagnostics; the changed Whale UI files were checked
strictly.

## Production and safety state

No production file, service, database, account or configuration was changed. The new
migration was not applied. The Whale worker was not installed, started or enabled on a
server. No deployment to `main`, release symlink change, service restart, private API
read, credential use, Demo account action or exchange order occurred.

The central trading strategy and `TRADING_STRATEGY.md` were not changed. Phase 4 changes
qualification evidence, observation, audit and operations; it does not silently mutate
the Futures formula, risk policy or protection rules.

## Rollout and rollback gates

1. Confirm reviewed release SHA, active app/database inventory and service paths.
2. Take a complete backup and prove restore in isolation.
3. Apply migrations in the documented order and re-run RLS/grant/Real-lock checks.
4. Create the dedicated `signalverse-whale` OS user and a short-lived signed
   `whale_feed` JWT. Populate a protected copy of `ops/whale-worker.env.example`; keep
   all app/exchange/service-role secrets out.
5. Install the prepared unit without enabling it. Verify working directory, release SHA,
   env permissions and sandbox paths.
6. Start in `PUBLIC_OBSERVATION` only. Require singleton lease, `RUNNING`,
   `realLocked:true`, expected wallet count, fresh messages/reconciliation, bounded
   queue, stable reconnect/error counters and no unexplained stale wallets.
7. Synchronize the host clock and run a defined observation window before claiming
   one-way latency.
8. Demo enablement requires a separate reviewed authorization and a naturally qualified
   event. Real remains locked.
9. Rollback begins with `EMERGENCY_KILL`, preserves active-position monitoring in the
   main app, stops/disables only the Whale worker, restores the prior release symlink
   and verifies the deployed SHA. Additive audit tables should not be dropped as a
   routine rollback.

## Remaining limitations

- One-way detection latency was not measurable because clocks were not synchronized.
- Hyperliquid public history can be bounded and funding can be unavailable.
- Forward qualification requires real elapsed time; the final window was too short to
  satisfy the existing seven-day threshold.
- No natural qualified live event, Engine decision for such an event, authorized Demo
  entry/exit, live protection change or post-trade qualification update was observed.
- Demo fees are estimates, funding is unavailable, and CROSS collateral/liquidation is
  modelled rather than privately verified at an exchange.
- Production migration, service rollout, active release-SHA verification and production
  health/rollback were prepared but not performed.

Phase 4 is complete under Outcome B. The next safe step is a reviewed public-observation
rollout with synchronized clocks and stable health, followed by a separately authorized
Demo window only after a wallet qualifies naturally.
