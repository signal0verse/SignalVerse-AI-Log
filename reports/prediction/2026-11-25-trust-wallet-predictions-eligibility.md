# Trust Wallet Predictions eligibility

## Metadata

- Date: 2026-11-25 (Asia/Kuala_Lumpur)
- Module: Prediction Market
- Mode: Read-only official documentation review
- Publication: SignalVerse-AI-Log, master

## Findings

- Trust Wallet offers a self-custodial Predictions tab. Its [product FAQ](https://trustwallet.com/prediction-markets) says the wallet itself requires no new account or identity check for the feature. The same FAQ says it applies each provider's regional restrictions. Provider terms and payment-provider requirements can apply separately.
- The Predictions product page lists Polymarket, Predict.fun on BNB Chain, and Hyperliquid HIP-4 on Hyperliquid L1. The [integration announcement](https://trustwallet.com/blog/company/introducing-predictions-in-trust-wallet) additionally names Myriad. Which providers are actually shown in a given account or region was not tested.
- Iran: [Trust Wallet's own Terms of Service](https://trustwallet.com/terms-of-service) explicitly exclude persons located in, residing in, or nationals of Iran, and entities organized under its laws. A no-KYC wallet flow does not remove that eligibility restriction.
- France: Both [Polymarket](https://polymarket.com/tos) and [Predict.fun](https://docs.predict.fun/terms-of-service) restrict trading under their terms. There is no verified availability or local authorization here for the other Predictions providers in Trust Wallet.
- Malaysia: Local availability and authorization for Trust Wallet Predictions were not verified. Self-custody alone does not establish provider eligibility.
- SignalVerse: Trust Wallet is a user interface to provider markets. No Trust Wallet API or permission for SignalVerse multi-user delegated prediction execution was established. [Hyperliquid's official API reference](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/asset-ids) documents outcome assets, so HIP-4 is a distinct integration candidate with its own coverage and eligibility questions.

## Scope and publication

Public provider documentation only. No wallet connection, deposit, order, live account eligibility test, source change or production change. This report is the sole published change.

