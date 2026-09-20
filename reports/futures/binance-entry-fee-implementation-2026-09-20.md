# Binance Futures lifecycle-fee implementation — 2026-09-20

## Metadata

- Date: 2026-09-20
- Task ID: binance-futures-lifecycle-fee-implementation-20260920
- Scope: owner-approved application implementation and offline verification
- Repository / branch: signal0verse/signalverse-main / main
- Starting and current HEAD: `498f66d19fbaae9c21aea7c8c4ffe5601b7eeff9`
- Commit / application push / Production deployment: none
- Exchange, database or account mutation in this step: none

## Authorization and boundary

After the isolated candidate passed, the owner explicitly approved applying
that one change to the main project. The approved scope was complete Binance
Real Futures lifecycle commission attribution. Spot, in-app Demo, engine signal
direction, Supervisor, allocation, leverage, SL/TP formulas and other findings
were out of scope and were not changed.

This implementation step made no new private exchange request and submitted no
order. It reused already-captured private fills locally for exact replay. No API
credential, account identifier, order/trade ID or private fill is included here.

## Implementation

`api/copytrade.ts` now:

- requires the exact, losslessly decoded Binance entry-order ID for lifecycle
  fill accounting;
- fetches entry fills by that exact `orderId`, separately from the close-time
  window, because `opened_at` can be persisted after the entry fill;
- de-duplicates overlapping results by Binance trade ID;
- requires exact entry quantity and a complete matching close quantity;
- refuses precise attribution if a later same-side fill changes position basis,
  the close is partial/oversized, identity is missing, or a fill is malformed;
- sums entry plus close commission only when every lifecycle fee is denominated
  in USDT, otherwise retains exchange PnL but marks fee unknown; and
- passes the stored entry-order ID from vanished-position, SL/TP action,
  liquidation-risk close, manual-close and Binance adapter paths.

Exchange `realizedPnl` remains the source of gross PnL; it is not recomputed.
The client can continue subtracting `fee_usdt` once to display net PnL. No
schema or UI change was needed.

## Verification

### Runtime-equivalent offline tests

With Node 22, the same major version used by Production:

- 127/127 Node test cases passed across the actual AST-extracted Binance
  implementation, adjacent Gate/MEXC isolation suite, and private replay.
- The tracked Binance suite is now 114/114, including five new lifecycle tests:
  full fee/PnL, overlap de-duplication, fail-closed quantity/basis cases,
  non-USDT fee handling, and exact entry-order query shape.
- The adjacent Gate/MEXC harness completed all 32 internal assertions with
  zero network calls, database calls or real orders.

### Exact exchange-evidence replay

The implemented application declaration—not a copied replacement—was extracted
and run over the exact two Binance Demo lifecycles and 144 independently
reconciled historical Real cycles retained locally. All 12 candidate/failure
tests passed. For all 146 complete inspected lifecycles, implemented gross PnL,
weighted close price and entry-plus-close fee matched the pre-approved candidate
and independent reconciliation.

The known sample totals remain:

- two Demo cycles: `0.03741314 USDT` full commission rather than the prior
  close-only `0.01870657 USDT`;
- 144 historical Real cycles: `3.17329807 USDT` full commission rather than
  the prior close-only `1.58946553 USDT`.

These figures validate attribution over inspected fills; they are not a
profitability result and do not rewrite historical database rows.

### Build and static checks

- Main and standalone-admin Vite production builds passed.
- All 14 API TypeScript handlers bundled successfully for target Node 22, with
  14/14 expected handler artifacts.
- `git diff --check` passed.
- A strict standalone check of `api/copytrade.ts` still reports 20 pre-existing,
  unrelated diagnostics; none are in the changed ranges. The successful Node 22
  API bundle is the repository's Production CI compile gate.
- The older `binance-algo-protection-test.mjs` fixture contract was updated but
  its full script was deliberately not executed because its Part C reads private
  Production data. The safe isolated CI suite covers the changed implementation.

## Remaining limitations

- Historical rows with missing or previously rounded entry order IDs remain
  unknown; the code will not guess or silently assign another lifecycle's fee.
- Binance documents a seven-day maximum query interval and three-month trade
  history availability for account trade-list queries. Long-lived or old
  histories can therefore still fall back to an unverified fee. Pagination and
  archival lifecycle journals remain separate work.
- Funding finalization, partial-position basis journaling, estimated-fallback
  labeling, protection replacement, profit locking, concurrency, engine quality
  and Supervisor usefulness are separate findings and were not changed.
- In-app Demo parity is intentionally deferred until Real changes are approved,
  deployed and stabilized. This specific in-app Demo path already has its own
  estimated round-trip fee model and was not modified.

## Files changed for this approved item

- `api/copytrade.ts`
- `scripts/futures-real-execution-fault-test.mjs`
- `scripts/binance-algo-protection-test.mjs`
- `HANDOFF.md`
- this report

No migration, generated build artifact or private scratch evidence is intended
for commit. Existing unrelated worktree files were preserved.

## Publication state

The application implementation is local and uncommitted. It has not been pushed
or deployed. A push to the executable repository's main branch would trigger
Production delivery and therefore requires a separate explicit owner decision.
This sanitized work report is published separately to
`signal0verse/SignalVerse-AI-Log`, branch `master`, and remote-readback verified.

## Primary external reference

- [Binance USD-M Account Trade List](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade)
