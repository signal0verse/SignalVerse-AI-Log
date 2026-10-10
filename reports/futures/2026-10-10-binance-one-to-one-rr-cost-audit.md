# Binance Futures gross 1:1 reward/risk cost study

Date: 2026-10-10 (Asia/Kuala_Lumpur). Owner request: test whether equal gross reward and risk remain economically worthwhile after Binance fees. Result: gross 1:1 loses money at a 50% win rate when positive trading fees are paid. A sufficiently higher independently demonstrated win rate can overcome those costs; this study does not measure that win rate.

## Method and evidence

- Deterministic sensitivity study, NOT a market backtest. An isolated local script imports only the actual pure futures-economics and futures-risk modules. No API bootstrap, environment file, database, private exchange API, order or production mutation.
- 48 scenarios cover LONG/SHORT, stop/target distances of 0.1%, 0.2%, 0.5%, 1%, 2% and 5%, plus four fee-role profiles. All 361 arithmetic checks passed against an independent integer fixed-point oracle. Additional checks cover zero-fee controls, break-even expectation, positive/negative expectation around the threshold, leverage invariance at identical notional, extra costs, and the existing native 1.9 admission threshold.
- Main assumptions: linear USDT-margined contract, 100 USDT margin, 10x leverage, 1000 USDT entry notional, entry price 100, quantity 10; taker fee 0.05% at entry and at either exit. Fees use the respective executed entry/exit notional, not margin and not a constant entry-notional approximation for both exits. All outcomes assume complete fills at the stipulated prices.
- The 0.02% maker / 0.05% taker reference is the regular-user example in the [official Binance fee calculation FAQ](https://www.binance.com/en/support/faq/detail/360033544231). This is an explicit study assumption, not a verified private account rate. The [current public fee table](https://www.binance.com/en/fee/futureFee) was opened but its dynamic rows were not returned by the text reader. Account/symbol rates are obtained through Binance's authenticated [User Commission Rate](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/User-Commission-Rate); no private account was queried here. VIP, symbol promotions and eligible funded BNB discounts can change actual fees.

## Main LONG results, both sides taker

Gross reward equals gross risk in every row. Net reward/risk below expresses positive net winning outcome divided by absolute net losing outcome. Thresholds are rounded to two decimal places and profitability requires exceeding the exact break-even threshold.

| Stop and target distance from entry | Net winning outcome (USDT) | Net losing outcome (USDT) | Net reward/risk | Break-even win rate |
|---|---:|---:|---:|---:|
| 0.2% | 0.999 | -2.999 | 0.3331 | 75.01% |
| 0.5% | 3.9975 | -5.9975 | 0.6665 | 60.01% |
| 1% | 8.995 | -10.995 | 0.8181 | 55.00% |
| 2% | 18.99 | -20.99 | 0.9047 | 52.50% |
| 5% | 48.975 | -50.975 | 0.9608 | 51.00% |

At a 0.1% LONG target, even the target outcome is slightly negative (-0.0005 USDT); fees absorb the entire gain. The corresponding SHORT case has only a tiny positive target outcome because the exit notional is lower. This directional difference is modeled explicitly rather than treating every sub-0.1% outcome as identical.

At the 1% stop/target example, entry fee is 0.50, winning-exit fee 0.505, losing-exit fee 0.495. Exact break-even win rate is 55.00250125062531%. For 100 stipulated trades of identical notional/distance: 50 wins/50 losses produce -100 USDT; 55/45 produce -0.05; 60/40 produce +99.90. These are conditional arithmetic totals, not observed trading results or predictions.

At 1% distance, alternate LONG role assumptions produce thresholds: maker entry/taker exits 53.50%; maker entry/resting maker TP/taker SL 52.70%; funded eligible 10% BNB taker discount 54.50%. A LIMIT order is not automatically maker, and native standard Binance Futures uses MARKET entry and market-trigger exits; maker scenarios do not imply a change in live execution.

Restoring a net 1:1 LONG payoff with a 1% gross stop and both-side 0.05% fees requires roughly a 1.2001% gross target. This changes geometry and is only a calculation; no target or stop was edited. It also does not meet the existing engine's higher gross admission threshold.

## Active engine cross-check

Read-only VPS inspection found active marker ad5fefc92349622f5c0c02ee14353f0a46446b3e. The native standard minimum gross reward/risk remains 1.9 in both futures-risk and the copytrade admission function. A hypothetical 1:1 setup is rejected by the actual pure risk function.

The tested local modules exactly match the active source after normalizing Windows CRLF to Git/VPS LF: futures-risk SHA-256 1c93cfe14b16796c0333cca260a21d6f54f7d694b93ebc50f9a977131015bc03; futures-economics SHA-256 862ec1e80a3d823cbd2b98746f7aa92c08e7f8e4bbe06490ca31840e1360a93d. This verifies the accounting mathematics used for this study, not every other active file or a full deployment audit.

## Limits and publication

Main table excludes funding, slippage/spread execution losses, credit/service costs, liquidation and incomplete fills. Net funding paid and extra execution costs raise the required win rate; received funding can offset costs. An additional hypothetical 0.30 USDT round-trip cost was separately tested and raises the 1% LONG threshold to approximately 56.50%. No value was invented for the actual user's funding or slippage. Leverage scales notional relative to margin; at identical notional and percentage distances it does not improve payoff ratio or win-rate threshold.

No actual signal win rate, historical trade distribution, profitability, confidence interval or outcome improvement was established. The appropriate decision depends on representative actual net performance, not the nominal ratio alone. No strategy change, migration, application commit/push or deployment occurred. Existing unrelated work was preserved. The ignored test script/results remain local; only this sanitized report is published to SignalVerse-AI-Log and its remote bytes are verified.
