# Published Spot scalp strategy explanation — 2026-10-13

Date: 2026-10-13, Asia/Kuala_Lumpur. Request: explain the strategy that was
actually released. This request is read-only: no source, schema, UI, settings,
profile, engine or order changes; no commit, push or deployment to either product.
Only this required sanitized work report is published to the AI log.

## Verified behavior

Reviewed api/_shared/spot-scanner-scalp.ts, api/_shared/spot-auto-scanner.ts,
api/copytrade.ts and docs/spot-scanner-scalp.md in released source
087e4cb611feee6a05bcc7aa1dfc2684bfdcbcf4. Runtime/public provenance was verified
in the immediately preceding [release report](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/spot/spot-auto-scalp-release-2026-10-13.md).

The actual model is Spot pullback accumulation using shorter candles and
existing averaging scenarios, followed by the canonical profit-taking rules.
It does not introduce an independently optimized scalp strategy or a fixed
holding-time promise.

- Discovery reuses the existing Futures public collector, V3 ranking and AUTO
  quality gates: 4h trend, 1h confirmation and existing liquidity, turnover,
  volatility, funding/open-interest checks. The selected market-cap top
  50/100/200 universe excludes stablecoins and must have an eligible liquid
  native Spot pair. Only LONG/buy-qualified candidates are retained; no short
  or leverage is introduced into Spot.
- New scanner campaigns analyze up to 1,000 valid contiguous closed 5m candles
  from the selected Spot venue. The existing daily macro context remains.
  Range/history comparisons refer to this available 5m window, not all-time prices.
- Canonical Formula B combines available own-history drawdown, medium structure,
  relative range position, local confluence and macro regime votes. Missing votes
  are excluded. A FAVORABLE bias (greater than 0.2), sufficient numerical
  evidence, available capital/scenario capacity and applicable depth checks
  permit OPEN. Evidence confidence is calculated but has no newly added
  minimum-confidence threshold. Missing or unfavorable evidence causes WAIT.
- Each scenario retains four descending buy rungs. Local structural lows are
  considered first, then medium/long lows; remaining rungs use canonical ATR
  spacing. Scenario and ladder percentages remain the configured allocation
  model, with fixed setup budget/reserve limits. Subsequent scenarios require
  fresh analysis and a meaningful deeper-price check, not unlimited doubling.
- Exit levels remain canonical structural resistance levels, falling back to
  ATR distances when unavailable. No fixed take-profit percentage was added.
  Before admission, the lower target, rounded down to quote tick, must cover
  the highest buy rung, both-side verified fees, a 10bps spread reserve and
  a 0.1% minimum net-return margin. This is a cost-admission estimate, not a
  guarantee of realized return. A failing target is rejected rather than moved.
- Per owner instruction, there is no executed stop-loss or forced loss/time exit.
  Manual closing remains available. Positions can stay open indefinitely while
  waiting for recovery. Uncertain orders remain durable holds, and exchange
  reconciliation remains authoritative.
- Manual daily setups and already-open legacy daily campaigns retain their
  original horizon and frozen levels. New automatic campaigns adopt 5m;
  refreshing scanner metadata cannot rewrite an open campaign.

## Checks and limits

This explanation used targeted source reads only. No tests were rerun because
no implementation changed. Prior release evidence includes final 39/39 new
adapter/replay/scope checks, all 76 official CI steps, four-service runtime
checks and matching assets on both hosts. These are functional/safety checks,
not evidence that the scalp model is profitable. The inherited daily simulator
is not an optimized scalp backtest. Private live execution and net results
require observing ordinary user-enabled trading, not an operator test order.
