# Binance Real Futures terminal-funding candidate — 2026-09-21

## Metadata

- Date: 2026-09-21 (Asia/Kuala_Lumpur)
- Task ID: binance-real-terminal-funding-candidate-20260921
- Scope: tests and comparison only
- Repository / branch: signal0verse/signalverse-main / main
- Application HEAD tested: `bbeac50b2875e29b614fa84d99d83fd8768ebc6d`
- Application code, database, exchange and Production changes: none

## Boundary

The owner authorized continuing to the next test step after the lifecycle-fee
fix. This task tested terminal Funding reconciliation for Binance Real Futures.
It did not authorize an implementation, migration, backfill, order, private API
request, service change or Production deployment. Spot and in-app Demo remained
outside the change scope.

All newly created harness files and private evidence remain under `tmp/` and are
excluded from commit. No credential, account identifier, order/trade ID or
individual private financial row is included in this report.

## Current behavior reproduced

Tests extracted the actual current declarations from `api/copytrade.ts` and
`src/app/App.tsx` rather than importing application bootstrap.

The following defects were reproduced:

1. The vanished-position terminal branch reconciles close fills and writes the
   terminal trade patch without a final call to Funding reconciliation.
2. `fetchAndRecordBinanceFunding` sends `startTime` and `limit=1000`, but no
   `endTime` or `page`.
3. Reusing that helper after closure without modification can include Funding
   from a later lifecycle on the same symbol.
4. The UI `netPnlUsdt` calculation subtracts fee but does not add signed
   `cumulative_funding_usdt`.

## Candidate contract tested

The isolated candidate requires:

- an exact lifecycle window from `opened_at` through the confirmed exchange
  close time;
- `symbol`, `incomeType=FUNDING_FEE`, `startTime`, `endTime`, `limit` and `page`
  on every income-history request;
- pagination until a short page, with a bounded maximum page count;
- global de-duplication by exchange income ID without moving an event already
  owned by another lifecycle;
- an immediate `PENDING` result and a separate delayed successful pass before
  declaring a terminal value complete;
- `UNKNOWN`, never zero, for malformed/non-USDT events or API/persistence
  failure;
- signed Funding in Binance Real terminal net PnL: gross minus commission plus
  Funding; and
- unchanged Demo behavior.

A single extra call in the close branch is not an acceptable fix: it can miss
late publication and, without a fixed end boundary, contaminate older cycles.

## Test results

### Candidate and private replay

On Node 22, 17/17 targeted tests passed:

- 3 current-defect reproductions;
- 8 candidate boundary, pagination, identity, delayed-finality, failure and UI
  accounting cases; and
- 6 private snapshot integrity/replay cases.

The private replay used the previously captured, read-only evidence from the
earlier audit. It covered 144 one-to-one reconciled Binance Real lifecycles and
118 persisted Funding-event rows. Aggregate comparison:

| Measure | Current stored evidence | Exact bounded exchange replay |
| --- | ---: | ---: |
| Funding total | `-0.075721 USDT` | `-0.108471 USDT` |
| Difference |  | `-0.032750 USDT` |
| Lifecycles with a Funding mismatch |  | `32 / 144` |

The candidate exactly reproduced the independently reconstructed per-cycle
exchange Funding. No exchange income ID belonged to more than one lifecycle.
An intentionally unbounded query would have differed from exact lifecycle
Funding for 112/144 cycles because it could see later same-symbol events.

These are historical audit results, not proof that every mismatch happened
after the latest rollout or that terminal capture was the only historical
cause. They prove that the stored dataset is incomplete relative to the captured
exchange evidence and that the bounded candidate corrects the inspected sample.

### Adjacent regression

The targeted tests were run together with the tracked isolated Futures suites:

- 114/114 actual Binance/Hyperliquid fault cases passed;
- the Gate/MEXC runner passed all 32 internal assertions with zero network,
  database or real-order calls; and
- combined Node runner result: 132/132 test cases passed.

The Gate/MEXC runner is one Node test case containing 32 internal assertions;
those assertions are not double-counted in the 132 total.

### SQL integration

Disposable PostgreSQL integration was `NOT_RUN`: this Windows host has no
`pg_config` or PostgreSQL binaries. The safe runbook explicitly requires
reporting that prerequisite gap rather than installing a database implicitly or
using Production as a substitute. Any implementation that adds durable state
or SQL behavior must pass the disposable PostgreSQL suite in CI before rollout.

## Before-versus-candidate decision

The candidate is positive for accounting correctness and lifecycle isolation.
It is not a profitability strategy and does not change entry, exit, protection,
leverage, allocation, Engine or Supervisor decisions.

Implementation should include both terminal capture and downstream net-PnL use;
fixing storage while leaving the UI formula fee-only would retain a visible
accounting error. Pending Funding must remain visibly incomplete rather than
silently becoming zero.

## Remaining decisions and limitations

- The durable delayed-finalization mechanism and its retry/finality timing must
  be integrated and tested at actual call sites. A nullable sentinel may avoid
  a schema change, but its UI/API semantics must be explicit and tested; an
  additive status field would require a migration and rollout ordering.
- Historical backfill is a separate Production database mutation and is not
  authorized by this candidate.
- Binance history availability still limits very old lifecycle recovery.
- This test does not address protection proposal races, risk widening, Engine
  quality, market structure, Supervisor value or profitability.

## Publication state

Only this sanitized report and a dated HANDOFF entry are intended for a
documentation-only `[skip ci]` commit. Candidate scripts and private data remain
untracked under `tmp/`. A separate owner approval is required before application
implementation, migration, backfill, push or Production deployment.
