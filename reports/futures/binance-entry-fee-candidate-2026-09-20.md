# Binance Futures entry-fee reconciliation candidate — 2026-09-20

## Metadata

- Date: 2026-09-20
- Task ID: binance-futures-entry-fee-candidate-20260920
- Scope: isolated accounting tests only
- Repository / branch: signal0verse/signalverse-main / main
- Application HEAD: `498f66d19fbaae9c21aea7c8c4ffe5601b7eeff9`
- Application source changed: no
- Exchange mutations in this step: none

## Objective and boundary

The owner asked to proceed one defect at a time, test a proposed remedy first,
and request explicit permission before changing application source. This step
tested only the confirmed Binance Real Futures accounting defect where the
current close-fill summarizer stores exit commission but omits entry commission.

No new exchange request was made by the candidate test. It reused the exact two
private Binance Demo lifecycles captured during the already-authorized bounded
run and 144 previously reconciled private historical Real cycles. No order,
position, leverage, account setting, database row, application configuration,
Spot path, in-app Demo path, strategy, Supervisor or production deployment was
changed.

## Current behavior reproduced

The unchanged application declaration `summariseBinanceCloseFills` filters for
close-side fills, so its fee total necessarily excludes entry fills. The exact
Demo exchange evidence reproduced the omission:

- 2 Demo cycles: current close-only fee `0.01870657 USDT`;
  full entry-plus-close fee `0.03741314 USDT`.
- 144 previously audited Real cycles: current close-only fee
  `1.58946553 USDT`; full entry-plus-close fee `3.17329807 USDT`.
- Omitted entry commission in those samples: `0.01870657 USDT` and
  `1.58383254 USDT`, respectively.

These are accounting comparisons over the inspected fills, not a profitability
forecast and not evidence that every historical row can be repaired safely.

## Candidate contract tested

The isolated candidate is not imported by application code. It uses the exact
stored entry-order identity as the lifecycle boundary, de-duplicates fills by
Binance trade ID, verifies entry quantity, and requires the close fills to match
the full position quantity. It preserves exchange-reported gross realized PnL
and weighted close price while reporting the lifecycle fee as entry commission
plus close commission.

The candidate fails closed instead of inventing precise accounting when:

- entry identity is missing or does not match;
- the entry or close quantity is partial or oversized;
- another same-side fill changes the position basis before closure;
- a trade ID is absent or a fill is malformed; or
- fees are paid in a non-USDT asset. In the last case PnL remains available but
  the USDT fee is explicitly unknown rather than being silently misconverted.

## Test evidence

`node --test tmp/binance-demo-validation-20260920/fee-candidate.test.mjs`
completed with 12 passed, 0 failed:

1. exact two Demo lifecycles, both directions;
2. all 144 independently reconciled historical Real cycles;
3. duplicate trade IDs;
4. partial close;
5. oversized close;
6. missing/wrong entry identity;
7. entry quantity disagreement;
8. a same-side add that changes cost basis;
9. separation from a later lifecycle;
10. non-USDT commission;
11. symmetric SHORT behavior; and
12. malformed/missing trade identity.

For all 146 complete inspected cycles, the candidate retained the independently
reconciled gross PnL and close price and recovered the known full commission.
The application file remained unmodified and repository HEAD did not change.

## What a later approved implementation would change

The narrow implementation would pass the exact stored Binance entry-order ID
into close reconciliation, use identity- and quantity-bounded lifecycle fills,
store entry-plus-close USDT commission, and add focused regression tests. It
would not alter signal direction, SL/TP, allocation, leverage, Supervisor,
portfolio limits, Spot or in-app Demo behavior.

This step does not authorize that implementation. The owner must approve it
explicitly before application source is edited.

## Remaining limitations and separate gates

- Some old database rows were already found with rounded or missing order IDs.
  A safe implementation must mark those histories unknown rather than guess.
- This candidate does not address final funding reconciliation, fill pagination,
  protection replacement, profit locking, concurrency, engine quality or
  Supervisor usefulness. Those remain separate test-and-approval items.
- The fee field is lifecycle cost; exchange `realizedPnl` remains gross PnL.
  UI/net-PnL consumers must continue to subtract the verified fee once, not twice.
- No application build or regression suite was required because executable source
  did not change. Full relevant suites are required if implementation is approved.
- The previously authorized two-entry Demo allowance is consumed. This step did
  not submit and does not authorize a third order.

## Git / publication state

No application commit, push, deployment or production change was made. This
sanitized report is published separately to `signal0verse/SignalVerse-AI-Log`,
branch `master`, under `reports/futures/`, and its remote content is read back.
Private fills, account identifiers, order/trade IDs and credentials remain local
and are excluded from this report.
