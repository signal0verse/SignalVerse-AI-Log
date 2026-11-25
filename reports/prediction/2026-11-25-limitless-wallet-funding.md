# Limitless wallet funding for live trades

## Metadata

- Date: 2026-11-25 (Asia/Kuala_Lumpur)
- Module: Prediction Market
- Mode: Read-only documentation review
- Repository: SignalVerse-AI-Log, master

## Objective and findings

- [Limitless's first-trade guide](https://docs.limitless.exchange/user-guide/making-your-first-trade) specifies USDC on Base for live purchases.
- The [wallet guide](https://docs.limitless.exchange/user-guide/wallet-types) says a connected external wallet can use its existing USDC on Base. A social-login user funds the trading wallet address shown in the app. The venue does not hold a separate platform balance.
- [Packs](https://docs.limitless.exchange/user-guide/packs) use USDC on Base and have a documented minimum stake of 1 USDC per pack. An external wallet can also need ETH on Base for network fees.
- Public-data simulation in SignalVerse can run without funding, wallet approval, or live orders.

## Checks and changes

Reviewed official documentation. No wallet activity, funds transfer, orders, source changes, or production changes. This report is the sole deliverable.

