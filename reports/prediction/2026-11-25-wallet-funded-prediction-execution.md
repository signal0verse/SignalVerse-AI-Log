# Wallet-funded prediction market execution

## Metadata

- Date: 2026-11-25 (Asia/Kuala_Lumpur)
- Module: Prediction Market
- Mode: Read-only first-party documentation review
- Repository and branch: SignalVerse-AI-Log, master

## Objective

Identify prediction market paths where the trader can spend the existing balance of their wallet on an individual position, without first transferring funds into a separate trading account. The order still uses wallet funds, and the position amount can be spent or held as collateral by a contract.

## Trust Wallet findings

Trust Wallet's [Predictions announcement](https://trustwallet.com/blog/company/introducing-predictions-in-trust-wallet) documents a no-separate-account and no-separate-deposit user flow funded by the existing self-custodial wallet. The markets and settlement logic belong to third-party venues. This documents the user-facing flow and does not establish the exact transfers performed internally by every routing provider. No trade was submitted or transaction trace collected.

| Provider path | Funding evidence and fit |
| --- | --- |
| Predict.fun inside Trust Wallet, BNB Smart Chain | [Trust Wallet documents](https://trustwallet.com/glossary/predict-fun) direct trading from the existing wallet with no bridge or separate account for eligible users. Predict.fun's [standalone onboarding](https://docs.predict.fun/the-basics/making-your-first-purchase) separately describes funding its own smart wallet, and the official provider guides do not agree on the collateral label. The exact asset and transaction route in the Trust Wallet app remain unverified and should be read from a market quote before implementation. |
| Polymarket inside Trust Wallet | Trust Wallet describes routing from several source chains via MoonPay. [Polymarket](https://docs.polymarket.com/trading/overview) documents Polygon settlement and a funded account wallet. Its [builder onboarding](https://docs.polymarket.com/trading/wallets-auth) uses a user-controlled Deposit Wallet for new builder accounts. An in-app flow may abstract transfers. Its internal path was not verified. |
| Hyperliquid HIP-4 inside Trust Wallet | The market is native to Hyperliquid L1. The [venue's standard onboarding](https://hyperliquid.gitbook.io/hyperliquid-docs/onboarding/how-to-start-trading) requires a funded balance on HyperCore. No separate manual transfer may be needed when that balance already exists. This review did not verify the exact in-app routing steps for a fresh wallet. |
| Myriad inside Trust Wallet | The announcement also names Myriad, but the current regional in-app route and transaction flow were not verified. The standalone Myriad and protocol paths are distinguished below. |

## Other documented models

| Venue | What the user signs or funds |
| --- | --- |
| Limitless on Base, external EOA | Uses existing native USDC in the external wallet with the required contract approvals. Limitless does not hold a platform balance, and trading settles through smart contracts. The documented partner EOA flow requires the user to sign each order. An embedded wallet is a separate funding path. [Wallet guide](https://docs.limitless.exchange/user-guide/wallet-types), [contracts](https://docs.limitless.exchange/user-guide/smart-contracts), [partner API](https://docs.limitless.exchange/developers/programmatic-api). |
| Seer on Gnosis or Ethereum | Connect an external wallet and buy outcome tokens from a DEX pool. Existing eligible collateral is swapped at execution, subject to pool liquidity. [Trading guide](https://seer-3.gitbook.io/seer-documentation/getting-started/navigate-our-site/buy-sell-outcome-tokens), [contract architecture](https://seer-3.gitbook.io/seer-documentation/developers/intro). |
| Jupiter Forecast on Solana | The documented flow converts the user's Solana USDC to a Token-2022 outcome token in one signed swap. Its current native markets are 15-minute BTC rounds. [Forecast docs](https://developers.jup.ag/docs/prediction/forecast). |
| Myriad Protocol on BNB Smart Chain | The [builder documentation](https://docs.myriad.markets/builders) allows EOA and contract wallets, ERC-20 approval and on-chain trading. Most markets use USD1 and some use USDT. Its order book requires wallet-based account authentication and signs orders off-chain for on-chain settlement. The standard [Myriad web app](https://docs.myriad.markets/deposit-and-withdraw) documents funding a separate non-custodial account wallet. |
| Azuro | A relevant smart-contract design example for direct wallet execution. Its [official site](https://azuro.org/) states betting operations are paused, so it is not a current execution candidate. |

## SignalVerse takeaway

The documented short list is Limitless EOA for integration and existing crypto market coverage, Myriad Protocol for an EVM contract path, Seer for a DEX-pool path, and Jupiter Forecast for an atomic Solana swap. Trust Wallet can be a wallet connection and signing surface via its [developer integration](https://developer.trustwallet.com/developer/listing-guide/mobile-optimize). These findings establish conditional architecture fit. Venue eligibility, current coverage and liquidity, ip egress eligibility, and delegated execution remain separately unverified. No approval, order, wallet funding, code change, deployment, or production change was performed. This report is the sole published change.

