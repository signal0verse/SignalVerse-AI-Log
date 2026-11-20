# Polymarket API key and address scope — 2026-11-20

Polymarket Settings issues a Relayer API Key with its Signer Address. It
authenticates gas-sponsored relayer requests. The official client also
takes a signer and the distinct account wallet address. Wallet batches
require a wallet signature. [Wallets and authentication](https://docs.polymarket.com/trading/wallets-auth)

The public position endpoint uses the Deposit Wallet address to look up open
and closed positions. The SignalVerse candidate uses a one-time owner
signature to associate that address with a verified Telegram account.
[Position endpoint](https://docs.polymarket.com/api-reference/wallet/list-positions-for-a-user-or-market)
· [Wallet-link candidate](https://github.com/signal0verse/signalverse-main/commit/4a29e908cbbd04593c9a4b7594e47d481f498221)

Every CLOB order needs an order signature. A Deposit Wallet owner can authorize
a separate, time-limited CLOB Session Key with no withdrawal permission.
[Order signing](https://docs.polymarket.com/trading/place-orders)
· [Session Keys](https://docs.polymarket.com/trading/session-keys)

This was a documentation verification. No credential was requested or tested.
There were no source changes or production actions.
