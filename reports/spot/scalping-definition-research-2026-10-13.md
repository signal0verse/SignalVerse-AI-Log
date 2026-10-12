# Scalping definition and comparison with published Spot mode — 2026-10-13

Date: 2026-10-13, Asia/Kuala_Lumpur. Scope: the owner requested an internet
search explaining what scalping means and what it does. Research only; no
source, database, settings, strategy, orders or runtime changes; no product
commit/push/deployment. This sanitized research report is the required AI-log publication.

## Sources checked

- [IG Academy: Day trading and scalping](https://www.ig.com/uk/ig-academy/planning-and-risk-management/day-trading-and-scalping)
  explains very short holding times, repeated small-profit trades, prompt
  acceptance of small losses, liquid markets and execution discipline.
- [IG: A beginners' guide to a forex scalping strategy](https://www.ig.com/en/trading-strategies/a-beginners--guide-to-a-forex-scalping-strategy-210304)
  explains seconds/minutes, the effect of liquidity/spreads on small gains,
  technical indicators and loss-control rules. Forex-specific examples were
  not treated as crypto parameters or implementation instructions.
- [Binance Academy's verified official article on Binance Square: What Is Scalp Trading?](https://www.binance.com/en/square/post/42851)
  describes small short-term crypto price moves, technical analysis, rapid
  execution and common intraday chart periods. The standalone Academy article
  URLs were inaccessible through the web tool; no unobserved content was inferred.

No promises of profitability, low risk or particular win rates are adopted.
No source is extensively quoted; this report summarizes the relevant concepts.

## Findings

Scalping is a trading style, not one universal indicator or entry formula. Its
purpose is to capture small short-term moves with repeated entries and quick
exits, often over seconds or minutes. Trend pullbacks, momentum/breakouts and
mean reversion are possible approaches, each requiring defined entry/exit rules.
Reading a 1m or 5m chart alone does not establish scalping behavior.

Liquid markets, relatively narrow spreads, reliable execution and explicit
loss controls matter because transaction costs and one large loss can erase
many small gains. No fixed target percentage or guaranteed holding duration
applies to every market. Choosing many trades is not itself evidence of an edge.

Illustration only, not current venue fees or a trade recommendation: a 0.3%
gross price gain on $1,000 gives $3 before costs; hypothetical 0.1% fees on
both sides consume approximately $2, leaving approximately $1 before spread
and slippage. The true sell fee depends on proceeds and actual fills.

## Comparison with this product

The immediately preceding verified [strategy explanation](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/spot/spot-scalp-strategy-explained-2026-10-13.md)
documents automatic discovery, new 5m campaigns and existing Spot averaging
scenarios. The owner explicitly selected no stop-loss and no forced time/loss
exit. Such campaigns can remain open indefinitely pending recovery.

Inference from the cited definition and actual implemented rules: the current
product mode is more precisely described as short-horizon profit-taking with
bounded averaging, rather than conventional quick-exit scalping. Shortening
the analysis horizon did not establish a full independently validated scalp
strategy. Averaging can reduce cost basis but does not ensure price recovery
or bound holding time/loss. No loss-exit rule was added during this research.

## Checks and publication

Web searches and primary-provider educational pages were reviewed. No
implementation changed, so no tests or production acceptance actions were
rerun. Functional release tests documented previously remain separate from
profitability evidence. This report contains no credentials or private account data.
