# Next Binance Real Futures defect: terminal funding finalization — 2026-09-21

## Scope

Read-only prioritization after the deployed lifecycle-commission fix. No application code, database row, exchange request, order, configuration or service was changed.

## Recommended next defect

The next correctness defect should be missing terminal funding reconciliation for Binance Real Futures. The current `fetchAndRecordBinanceFunding` helper runs only while the exchange position is still open. When synchronization detects that the position has vanished, the code reconciles close fills and immediately writes the terminal trade patch without one final funding capture. A funding event posted after the last open-position poll can therefore remain absent from `cumulative_funding_usdt`.

This does not change the Binance wallet balance. It can make application net PnL, reports, learning inputs and account comparisons incomplete. It is the logical next item because lifecycle commission is now fixed and this completes the other known exchange-cost component without changing entry signals or risk policy.

## Required test-first candidate

Before implementation, an isolated Real-only candidate should prove all of the following:

1. terminal funding is bounded to the exact lifecycle from `opened_at` through the confirmed close time;
2. exchange income IDs remain idempotent under repeated immediate and delayed reconciliation;
3. a later position on the same symbol cannot donate funding to the earlier closed trade;
4. delayed income publication is handled by a bounded retry/finalization state rather than being silently treated as zero;
5. API or database failure leaves funding unknown/incomplete and never blocks position closure;
6. pagination and the endpoint's bounded history behavior are covered;
7. Spot, in-app Demo, Engine, Supervisor, SL/TP and sizing remain untouched; and
8. read-only replay matches independently captured exchange income for known audited cycles before any Production change.

A single extra call in the vanished-position branch is not sufficient by itself: without an end boundary and delayed reconciliation, it can still miss late publication or misattribute a later lifecycle's funding.

## Priority after this item

After terminal funding correctness, the next engineering defects are atomic reanalysis/protection-proposal claims plus tick-normalized deduplication, then explicit no-widen/risk-budget policy. The previously tested simple profit-lock rule should not be promoted: it increased win rate but worsened validation net PnL. Engine market-structure and Supervisor work should remain separate experiments after accounting and concurrency are trustworthy.

## Publication state and limitations

This sanitized report is published to `signal0verse/SignalVerse-AI-Log`, branch `master`. No SignalVerse application repository change was made. The recommendation is not authorization to implement or deploy it, and it does not claim profitability.