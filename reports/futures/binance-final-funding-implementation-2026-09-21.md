# Binance Real Futures final Funding implementation — 2026-09-21

## Status

The approved terminal-Funding candidate was implemented and verified in the
local SignalVerse working tree. It is **not deployed**: no executable commit
was pushed to the application repository, no Production migration was run and
no private exchange call or order was made.

## Changes

- New Binance Real Futures terminal lifecycles enter a durable `PENDING`
  Funding-reconciliation state on every verified close path.
- After a 15-minute settlement delay, the normal account sync fetches Funding
  with exact open/close bounds, explicit pagination and global income-ID
  deduplication, including when the account has no open position.
- API/database failure or malformed/non-USDT data never becomes a fabricated
  zero. The result stays `UNKNOWN`; transient failures receive a bounded-delay
  retry.
- Terminal net PnL is displayed only when final fee and Funding are known, as
  raw realized PnL minus fee plus signed Funding. Pending/unknown results are
  excluded from aggregates and sharing.
- An additive migration adds nullable queue/status timestamps and a partial
  due index. It performs no historical backfill.
- Demo, Spot, other Futures exchanges, Engine, Supervisor and trading decisions
  were not changed.

## Checks

- Dedicated Funding suite: **10/10 PASS**.
- Adjacent Real execution suites: **125/125 Node cases PASS**; the Gate/MEXC
  runner additionally completed 32 internal assertions with zero network,
  database and real-order calls.
- Full allowlisted offline set: **363/363 PASS**.
- Customer and admin Vite builds: PASS.
- API bundle: **14/14 handlers PASS** for the Node 22 target.
- `git diff --check`: PASS.
- Local disposable PostgreSQL: **NOT_RUN** because PostgreSQL binaries were not
  installed. The real migration reapply/constraint/index checks were added to
  the isolated SQL runner for the release environment.

## Publication and remaining gates

Application source remains local and uncommitted; Production continues to run
the previously verified executable release. Before any application push, the
release requires owner approval, a native database backup, isolated
restore/migration drill, migration plus PostgREST schema-cache reload before
code deployment, Node 22 CI, and post-deploy verification.

Historical Funding rows are intentionally not rewritten by this change.

