# Prediction Polymarket Polygon wallet connection — 2026-11-20

The review candidate adds per-Telegram-account Polymarket Deposit Wallet
connection, after the owner's choice of a dedicated wallet. [Exact source](https://github.com/signal0verse/signalverse-main/commit/4a29e908cbbd04593c9a4b7594e47d481f498221)
· [Connection guide](https://github.com/signal0verse/signalverse-main/blob/4a29e908cbbd04593c9a4b7594e47d481f498221/docs/prediction-wallet-connect.md)

## Flow and ownership

- The authenticated Real tab takes the public Deposit Wallet address from the
  Polymarket profile and prepares a ten-minute, single-use connection message.
  The owner approves an EIP-191 message on Polygon. The message binds the
  SignalVerse origin, Telegram account, wallet, network and expiry.
- An injected browser wallet can sign directly. Telegram users can open the
  one-time link in a wallet browser. The separate approval page uses the
  opaque ticket in the URL fragment and clears it on startup. Requests use
  POST and carry no Telegram token on the external page.
- The server checks both the Polymarket factory-derived Deposit Wallet
  address and its current on-chain owner. It supports current beacon and
  legacy UUPS Deposit Wallets controlled by the original signer. The binding
  is one-to-one. A linked user's own holdings and history are read from
  Polymarket. A changed owner blocks those reads. Disconnect removes the
  app binding and any in-flight proof.
- The migration adds two service-only tables and atomic issue, consume and
  disconnect functions. No private key, wallet withdrawal approval or
  delegated order permission is collected. The legacy Real order routes
  remain disabled.

## Verification

- Node.js 22 passed 45 focused cases, including real-message recovery against
  synthetic Polygon owner evidence, cross-account denial, replay, expiry,
  and explicit off-state for order actions. Targeted strict TypeScript, Web
  and Admin builds and the Prediction API bundle passed.
- Five checks passed on a new disposable PostgreSQL instance using the real
  migration. They covered browser role denial, expiry and replacement,
  same-ticket concurrency, cross-account concurrency for the same wallet
  and scoped disconnect. The cluster was stopped and removed.
- A local Chromium run used the built approval page and a synthetic wallet
  on a 360px Persian view and a 900px English view. Both showed the account
  and network in the message, removed the fragment, required the approval
  click, switched to Polygon, signed one message and showed success.
- A public read from the production host confirmed Polygon chain ID 137 and
  code at the official Deposit Wallet factory. No funded account connection
  or private wallet signature was attempted against production.

## Release status

Only the review branch was pushed. The running release remains
`bcca682604eb3874fd4cb884703e3d000cdc5713`. The wallet link tables are absent from production.
Real and autonomous learning remain off. The new code retains the existing
entry predicates and Demo paths.

The local canonical Git archive measured 8,404,021 bytes against the
unchanged 8,388,608-byte receiver limit. The exact candidate exceeds
the limit by 15,413 bytes. Release packaging and official CI are pending.
The wallet migration has only been applied to the disposable database.

[Polymarket Deposit Wallet documentation](https://docs.polymarket.com/trading/wallets-auth)
· [Polygon contract addresses](https://docs.polymarket.com/resources/contracts)
