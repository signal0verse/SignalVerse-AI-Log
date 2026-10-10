# Binance Futures reward/risk comparison follow-up

Date: 2026-10-10 (Asia/Kuala_Lumpur). Owner asked which ratio is preferable after the gross 1:1 fee study.

Recommendation scope: use a gross reward of twice the initial risk as a baseline for evaluation, consistent with the standard engine's existing target geometry and 1.9 minimum admission threshold verified in the preceding audit. This is not an empirically optimized ratio, a production change or a guarantee that 2R outperforms 3R.

The actual pure futuresPositionEconomics module was used again. LONG example: entry 100, quantity 10, stop 99, entry notional 1000 USDT; entry/exit taker fees 0.05% each. This explicit fee assumption matches the example in the [Binance official fee calculation FAQ](https://www.binance.com/en/support/faq/detail/360033544231), rechecked in this turn; actual private account rates were not queried. Funding, slippage and service costs excluded.

| Gross reward / gross risk | Net win USDT | Net loss USDT | Net reward / net risk | Break-even win rate |
|---|---:|---:|---:|---:|
| 1 | 8.995 | -10.995 | 0.818099 | 55.0025% |
| 1.5 | 13.9925 | -10.995 | 1.272624 | 44.0020% |
| 2 | 18.99 | -10.995 | 1.727149 | 36.6683% |
| 3 | 28.985 | -10.995 | 2.636198 | 27.5013% |

Four break-even expectation assertions passed. A larger target is not sufficient evidence of better actual expectancy: a hypothetical 2R strategy with 50% wins has +3.9975 USDT expected net per trade here, whereas hypothetical 3R with 30% wins has +0.9990. Those win rates are stipulated counterexamples, not observed engine performance. Actual choice needs representative realized win probabilities, net expectancy and drawdown under each exit rule. Raising the target alone can reduce its hit rate.

No market backtest, private-account order, database change, strategy edit, application commit/push or deployment was performed. The prior active-runtime inspection remains evidence from that audit, not a new whole-release check in this follow-up. Only this sanitized report is published to SignalVerse-AI-Log, with decoded remote-byte verification. Existing unrelated work remains preserved.
