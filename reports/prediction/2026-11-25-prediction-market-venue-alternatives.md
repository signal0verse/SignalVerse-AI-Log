# Prediction market venue comparison for SignalVerse

## Metadata

- Date: 2026-11-25 (Asia/Kuala_Lumpur)
- Module: Prediction Market
- Mode: Official documentation and public market data review
- Repository: SignalVerse-AI-Log
- Branch: master

## Objective and scope

Compare live-money alternatives to Polymarket for personal onboarding and a SignalVerse multi-user autonomous engine. Compare terms, API or partner access, and suitability for daily and weekly crypto evaluation. No production or account access was needed.

## Findings

| Venue | Geographic and account terms | SignalVerse integration |
| --- | --- | --- |
| Limitless Exchange | Iran, Russia, Belarus and other named areas are blocked. Trading restrictions separately include the United States, Taiwan, Ontario and Alberta. France is absent from the named ranges in section 1, which also requires lawful use in the relevant jurisdictions. Wallet onboarding is documented, and identity or eligibility checks may be requested. | Best technical candidate for a crypto pilot among the venues reviewed. Base and USDC. Self-directed API tokens are available to eligible traders. The multi-user Programmatic API has an application and documents sub-accounts and delegated orders. SignalVerse acceptance and French server egress eligibility have not been confirmed. |
| Myriad | The sign-in page says points and real-money markets depend on the country. Its linked full terms returned HTTP 404 on review, so the venue's complete current country list was not verified. | Public market reads, wallet-bound order credentials, order book, and an official Builder program are documented. Secondary candidate subject to full geography and partner terms confirmation. |
| Kalshi | International trading is available to eligible countries with identity and residency checks. The Member Agreement explicitly restricts France and Iran. | Official trading API and separate demo environment. Appropriate for evaluating integration without real funds, or for real use in eligible jurisdictions subject to agreement and applicable law. |
| Predict.fun | The terms expressly restrict France and Iran, among others. | BNB Chain with an official hybrid order-book architecture. Geographic restrictions remain for the locations above. |
| Opinion | Trading terms presented by the official site include France, Iran and an explicit EU/EEA list. The current terms page's rendered document was verified from its first-party page bundle. | BNB Chain CLOB SDK and an application for API access. Geographic restrictions remain for the locations above. |

The [French national gaming authority](https://anj.fr/prediction-market-platforms-illegal-france-and-potentially-risky-users) says the prediction betting sites discussed in its notice are unauthorized in France. Absence of France from a site's named exclusion list does not settle operator, user, or hosting eligibility. The public data review did not determine whether a specific venue accepts a French datacenter IP for order origination.

## Checks and results

- The Limitless public active market slugs endpoint returned HTTP 200. The response included November 25 daily up-or-down contracts for BTC and ETH. No BTC or ETH market with an explicit weekly label in its slug appeared in that sample. This was a point-in-time search, not proof of continuous daily coverage or lack of weekly contracts.
- Public order books returned data for both daily examples. On the YES side the highest bid and lowest ask were 0.039 and 0.168 for BTC, and 0.084 and 0.999 for ETH. The spreads were 12.9 and 91.5 cents per contract, respectively. These were two late-session snapshots. Persistent liquidity, executable size, and realized fills were outside the review.
- Myriad's onboarding page was accessible. The terms link on that page returned HTTP 404.
- No source code, production configuration, release, database, wallet, order, account, or learning setting was changed. This report was the only file created. No build or authenticated execution test was run.

## Remaining checks

For a multi-user real-money rollout, confirm the operator and intended users' eligibility and partner approval, verify whether the intended server region and IP are accepted, and measure recurring market coverage, depth, spread, fees, and settlement with read-only data before considering live execution.

## Official sources

- [Limitless terms](https://docs.limitless.exchange/user-guide/terms-of-service)
- [Limitless Programmatic API](https://docs.limitless.exchange/developers/programmatic-api)
- [Limitless active market data](https://api.limitless.exchange/markets/active/slugs)
- [Limitless order book reference](https://docs.limitless.exchange/api-reference/trading/orderbook)
- [Myriad onboarding](https://myriad.markets/auth)
- [Myriad API](https://docs.myriad.markets/builders/myriad-api-reference)
- [Myriad Builder program](https://docs.myriad.markets/builders/builder-revenue-sharing)
- [Kalshi Member Agreement](https://kalshi.com/docs/kalshi-member-agreement.pdf)
- [Kalshi international onboarding](https://help.kalshi.com/en/articles/14026044-can-i-trade-on-kalshi-from-outside-the-united-states)
- [Kalshi API demo](https://docs.kalshi.com/getting_started/demo_env)
- [Predict.fun terms](https://docs.predict.fun/terms-of-service)
- [Opinion trading terms](https://app.opinion.trade/terms)
- [Opinion CLOB SDK](https://docs.opinion.trade/developer-guide/opinion-clob-python-sdk/overview)

