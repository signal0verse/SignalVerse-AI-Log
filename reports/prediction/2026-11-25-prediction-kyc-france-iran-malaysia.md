# Prediction market KYC and geographic eligibility

## Metadata

- Date: 2026-11-25 (Asia/Kuala_Lumpur)
- Module: Prediction Market
- Repository and branch: SignalVerse-AI-Log, master
- Mode: Public documentation and regulator review

## Result

No reviewed live-money venue had both a verified no-KYC policy and verified permission to trade in France, Iran and Malaysia. The table describes retail eligibility evidence. Missing names in published venue lists leave local legal authorization unverified.

| Venue or access path | Identity checks | France | Iran | Malaysia |
| --- | --- | --- | --- | --- |
| Polymarket International | The signup guide documents wallet, email and Google sign-in. The terms allow further information requests to verify eligibility. | New orders restricted. ANJ ordered a website block. A prior production probe confirmed the SignalVerse French egress was blocked. | Explicitly restricted by terms and geoblock docs. | Not named in the checked published platform lists. No local authorization verified. |
| Limitless | The ordinary wallet signup guide lists no upfront ID document step. The terms permit identity or eligibility checks at any time. | Not named in the terms' specific location warnings. General local-law requirements apply. No current authorization or French production egress acceptance verified. | Explicit access restriction. | Not named in the terms' listed locations. No local authorization verified. |
| Predict.fun | Wallet or social onboarding. Terms allow additional eligibility information on demand. | Explicit trade restriction. | Explicit trade restriction. The relevant clause includes citizenship, residence and location. | Not named. No local authorization verified. |
| Opinion | Terms permit requests for identity, age, address, eligibility or source-of-funds information. No universal upfront KYC conclusion. | Explicitly restricted, including as part of the EU/EEA list. | Explicitly restricted. | Not named in the first-party terms reviewed. No local authorization verified. |
| Jupiter Predict / Forecast | The documented prediction flow uses wallet signing and does not mention an upfront document upload. No guaranteed exemption from checks was verified. | Not named in Jupiter's general location restrictions or API IP block note. No authorization verified. | General Jupiter interface terms expressly exclude Iran. The separate API IP note covers United States and South Korea and describes technical filtering. | Not named in either checked list. No local authorization verified. |
| Kalshi | Identity verification required. | Event-contract trading expressly prohibited under the Member Agreement. | Event-contract trading expressly prohibited under the Member Agreement. | Not named in the checked Member Agreement list. Applicable-law clause and identity/residency checks still apply. |
| Binance app Prediction | Binance's exchange account requires KYC. The Prediction tab is a third-party Predict.fun integration offered in supported regions. | Predict.fun terms restrict France. | Predict.fun terms restrict Iran. | SEC Malaysia listed Binance in its investor alert on 2026-10-08. Prediction availability was not independently verified. |
| World App / World Money | Mini App terms and any identity checks are venue-specific. | The Polymarket and Kalshi access paths are still subject to provider restrictions. | The Polymarket and Kalshi access paths are still subject to provider restrictions. | Provider availability unverified. |
| Myriad | Social or email sign-in advertised. Document verification rules were not verified. | Unverified. | Unverified. | Unverified. Myriad advertises local variation between points and live-money offerings. |
| World Chain examples | TickX requires verified personhood or a verified human-backed agent. OracleX has been documented as a hackathon project using mock collateral. | No verified applicable live event-market eligibility. | No verified applicable live event-market eligibility. | No verified applicable live event-market eligibility. |
| Seer | Public platform site describes Gnosis/Ethereum market architecture. No complete identity or jurisdiction policy verified. | Unverified. | Unverified. | Unverified. |

## Scope and verification limits

- ANJ's statements concern market availability and unauthorized offers in France. The venue matrix does not decide all questions about where a business may host technology. Only the French Polymarket egress is supported by the earlier production probe. No fresh production network checks, account creation or orders were performed.
- Malaysia's general betting laws and Binance-specific regulator notice were reviewed. A missing name from a venue's restrictions is insufficient to establish local authorization or test an actual account. No blanket claim that Malaysia has specifically blocked every service was made.
- Reviewed Opinion's current full terms through the official app's public terms page bundle because its web rendering did not expose the clauses directly. Myriad's terms link was unavailable during this review and the previous comparison.
- No code, funds, production configuration or account permissions changed. This report is the only published change.

## Sources

- [Polymarket Terms of Use](https://polymarket.com/tos), [Geoblock documentation](https://docs.polymarket.com/api-reference/geoblock), and [previous French egress probe](2026-11-21-prediction-polymarket-egress-cross-check.md)
- [Limitless terms](https://docs.limitless.exchange/user-guide/terms-of-service) and [onboarding guide](https://docs.limitless.exchange/user-guide/making-your-first-trade)
- [Predict.fun terms](https://docs.predict.fun/terms-of-service) and [Opinion terms](https://app.opinion.trade/terms)
- [Jupiter terms](https://docs.jup.ag/user-docs/legal/terms-of-use) and [Prediction API](https://developers.jup.ag/docs/prediction)
- [Kalshi Member Agreement](https://kalshi.com/docs/kalshi-member-agreement.pdf) and [identity verification](https://help.kalshi.com/en/articles/15581140-document-verification-on-kalshi)
- [Binance identity verification](https://www.binance.com/en/support/faq/detail/360027287111?hl=en) and [prediction integration](https://www.binance.com/en-IN/support/announcement/detail/4989a793bf58434980967848a0f16d77)
- [French regulator decision on Polymarket](https://www.anj.fr/promotion-illegal-gambling-services-blocking-polymarket-website)
- [Securities Commission Malaysia investor alert](https://www.sc.com.my/resources/media/investor-alert-updates/investor-alert-list-as-at-8102026), [Malaysian Act 289](https://lom.agc.gov.my/ilims/upload/portal/akta/LOM/EN/Act%20289.pdf), and [Malaysian Betting Act](https://lom.agc.gov.my/ilims/upload/portal/akta/LOM/EN/Act%20495.pdf)
- [Myriad onboarding](https://myriad.markets/auth), [World ecosystem report](2026-11-25-world-chain-prediction-markets.md), and [Seer](https://seer.pm/)

