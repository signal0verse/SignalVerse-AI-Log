# Whale Trading — initial implementation, not complete V1

## Metadata

- Date: 2026-09-18, Asia/Kuala_Lumpur (2026-09-17 UTC)
- Task ID: whale-trading-v1-foundation-20260918
- Module: futures
- Mode: development; synthetic offline tests; no trading
- Repository: signal0verse/signalverse-main
- Branch: codex/whale-trading-v1
- Starting commit: fff033f996e8cb9087c65c605823c82a1b3d5289 (after fast-forward)
- Ending commit: b92b8480c28af07c99e783cfdb2151498963b934
- Implementation status: IN_PROGRESS — foundation implemented, full V1 incomplete
- Publication: feature branch pushed; no merge, deployment, production migration or runtime verification

## Objective

The owner requested reports here after every request, then explicitly asked to start
the attached Whale Trading implementation. Subsequent clarifications are binding:
preserve the current Real Futures architecture, use a whale watchlist instead of
the symbol list as this mode's opportunity source, and place the new section named
**Whale Trading** inside **Copy Trade > Futures**. Audible notification at completion
or when asking a question was also requested and recorded as a host-dependent preference.

## Scope

Initial development increment: repository audit, new section/watchlist, public
wallet-feed provider, net-position state, isolated tests and handoff. Real Whale
Trading remains locked. No existing Futures strategy, risk, order or protection
function was rewritten. No unrelated Spot or Prediction feature was modified.

## Actions Taken

1. Preserved existing untracked work; fast-forwarded main and created a separate branch.
2. Read contributor rules, handoffs, strategy history, safe testing runbook and supplied specification.
3. Mapped actual decision/reviewer/risk/pending/execution/protection/reconciliation/Simulator/runtime paths.
4. Added bilingual Whale Trading selection UI, authenticated owner-scoped API and draft watchlist migration.
5. Added read-only Hyperliquid wallet subscriptions and exact net-position transition logic.
6. Added offline fault, isolation, API and rendering tests; included suites in CI.
7. Updated help knowledge, contributor reporting/notification rules and implementation handoff.
8. Committed and pushed the development branch. This report records the actual partial milestone.

## Files Inspected

AGENTS.md; CLAUDE.md; HANDOFF.md; docs/AI_HANDOFF.md; TRADING_STRATEGY.md;
docs/testing/stability-test-runbook.md; package.json; api/analyze.ts;
api/copytrade.ts; lib/strategyEngine.ts; src/app/App.tsx;
server/admin-console/server.mjs; ops/signalverse-deploy;
.github/workflows/production-ci.yml; existing Futures migrations and selected
Futures fault/reanalysis/liquidation/UI test harnesses. Official Hyperliquid
subscriptions, heartbeat, info and rate-limit documentation was inspected.

## Files Changed

- AGENTS.md
- HANDOFF.md
- .github/workflows/production-ci.yml
- api/analyze.ts (help knowledge only)
- api/copytrade.ts (watchlist helper and authenticated route)
- src/app/App.tsx (new subsection)
- src/app/WhaleTradingPanel.tsx
- server/whale-trading/position-state.mjs
- server/whale-trading/hyperliquid-provider.mjs
- migrations/whale_watchlist.sql
- scripts/whale-position-state-test.mjs
- scripts/whale-provider-test.mjs
- scripts/whale-watchlist-test.mjs
- docs/whale-trading-v1.md
- docs/whale-trading-specification.md (preserved supplied specification)

## Root Cause / Findings

**CONFIRMED from source:** the central live decision is computeShadowEngineState
in api/analyze.ts. Risk is distributed across analysis and execution. Existing
Real Futures uses pending signals and durable execution holds. The Hyperliquid
execution adapter exists; a public whale event ingestion pipeline did not.
The main HTTP runtime is copied from shared VPS files by the deployment script;
it is not fully represented in this checkout. Admin WebSocket service is isolated
and must not be repurposed as a trading worker.

**UNCONFIRMED:** active production SHA, live feed delivery, private-account state,
PostgreSQL migration behavior and any copy profitability. No such claims are made.

## Implementation

- UI: wallet address/optional label, add/remove, loading/errors, explicit not-ready
  status in English/Persian with RTL. A saved wallet is not labeled qualified.
- API: existing Telegram session authentication, VIP/test-grant and suspension
  checks; all persistence scoped by verified owner. Client owner values ignored.
- Draft schema: owner/provider/wallet uniqueness and ten unique slots per owner;
  RLS enabled, public/anon/authenticated access revoked, service role grants only.
- Provider: wallet-based userFills subscriptions, dynamic symbols, historical/live
  separation, explicit Spot exclusion, heartbeat/reconnect, queue bounds and gap
  invalidation. It never loads exchange credentials and does not auto-start.
- State: exact decimal quantities, partial/full close distinction, increases,
  flips/reopen, average entry, dedup/conflict detection, atomic in-memory batches,
  stale/future/out-of-order handling and snapshot reconciliation requirement.
- No direct event-to-order route exists. Every observation has execution disabled.
  Real requests and all unimplemented whale execution actions return locked.

## Tests Executed

**PASS — final new suites: 33 tests, zero failures.**

```text
node --test scripts/whale-position-state-test.mjs scripts/whale-provider-test.mjs scripts/whale-watchlist-test.mjs
```

**PASS — initial combined regression: 262 runner cases, zero failures.** This run
contained 31 whale cases before two additional regressions were added and passed
in the final 33-case run. Do not double-count reruns as extra coverage.

```text
node --test scripts/whale-position-state-test.mjs scripts/whale-provider-test.mjs scripts/whale-watchlist-test.mjs scripts/futures-real-execution-fault-test.mjs scripts/futures-gate-mexc-fault-test.mjs scripts/futures-reanalysis-test.mjs scripts/futures-liquidation-feasibility-test.mjs
```

Gate/MEXC's internal 32 checks and liquidation's internal checks each count as one
runner case in that aggregate. Tests use synthetic data and replaced transports,
not production accounts/DB. Mock slot uniqueness is NOT a PostgreSQL race test.

**PASS — strict new-panel typecheck:**

```text
node node_modules/typescript/bin/tsc --noEmit --strict --skipLibCheck --jsx react-jsx --target ES2022 --module ESNext --moduleResolution bundler src/app/WhaleTradingPanel.tsx
```

**PASS — git diff whitespace check.** No test failed in this increment.

## Build Result

- npm run build: PASS for web and admin; existing large-chunk warning remains.
- esbuild bundles of both changed API handlers, target Node 22, write:false: PASS.
- Full-project TypeScript cleanliness: NOT_ASSERTED.
- Local runtime: Node 24.19.0. CI configured for Node 22; remote CI NOT_RUN.

## Git Status

Tracked working tree clean after commit. Pre-existing unrelated untracked files
preserved. Feature branch push succeeded. Main was not pushed or merged.

## Commit

[b92b8480c28af07c99e783cfdb2151498963b934](https://github.com/signal0verse/signalverse-main/commit/b92b8480c28af07c99e783cfdb2151498963b934)

## Remaining Issues

1. Migration is NOT_EXECUTED. psql is unavailable in PATH; isolated SQL validation remains.
2. Durable event/checkpoint/decision lineage storage and actual snapshot/backfill integration remain.
3. Provider/state modules are not connected to a production worker or the saved watchlist.
4. Performance/copyability scoring, qualification and behavioral profiles remain.
5. Same-existing-engine/reviewer/risk/pending/execution integration, user sizing,
   continuous management and Demo end-to-end remain.
6. Protection/leverage/margin/funding event streams, same-engine historical replay,
   benchmark comparison and post-trade analytics remain.
7. Full activity/history/settings UI and interactive browser/mobile visual QA remain.

## Risks / Limitations

This is NOT complete working V1, NOT an active feed, NOT a running copy trader and
NOT deployed. Watchlist persistence requires the pending migration. All UI claims
and API status explicitly disclose this. In-memory reconciliation and fake socket
tests are not durable recovery or live-provider evidence. SQL was only reviewed,
not run. Existing application behavior was covered by selected offline regressions,
not every possible workflow. No private account read, real order, paid AI request,
production database write or service activation occurred. Real Whale Trading is locked.

## Recommended Next Step

Continue the authorized implementation with isolated PostgreSQL validation and
durable public-event/snapshot recovery, then feed qualified wallet opportunities
into the CURRENT Futures Pro decision/pending path. Preserve current financial
policies and native execution/protection. Do not deploy this incomplete milestone
as a completed trading mode or enable Real Whale Trading.
