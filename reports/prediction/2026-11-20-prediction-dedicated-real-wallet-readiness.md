# Prediction dedicated Real wallet readiness — 2026-11-20

The owner selected a dedicated Polymarket Deposit Wallet with limited signing
permission for the autonomous engine. The review branch adds an authenticated
Real account panel for preflight and portfolio reads. Automatic orders and
signing remain disabled.

## Verified production constraints

- The active Prediction release is `bcca682604eb3874fd4cb884703e3d000cdc5713`. The production learning gate is
  absent. This task inspected the runtime and made public GET requests.
- An initial bare HTTP probe received HTTP 403. Standard JSON requests identified
  as SignalVerse passed the public API checks. The official geographic endpoint
  returned HTTP 200 with `blocked=true` for the **current production server**.
  The result establishes the restriction on that server's path. Individual
  account eligibility was outside the scope of the probe.
- The official wallet deployment and open/closed positions endpoints responded
  HTTP 200 with the documented envelope for a public burn address. This
  verifies the read wire format independent of private wallets.
- The official SDK version inspected for scoped Deposit Wallet Session Keys
  requires Node.js 24 or newer. The current application and official API
  bundle target Node.js 22. Order execution remains pending a supported
  eligible signing environment, wallet authorization and approved limits.

## Candidate and checks

- [Exact candidate](https://github.com/signal0verse/signalverse-main/commit/b521cee6cf4a4073a1f5e2a7d70c2e19df82477d) was pushed only to
  `codex/prediction-real-wallet-preflight`. The main source ref remained at
  `bcca682604eb3874fd4cb884703e3d000cdc5713`. The candidate has no release or official CI acceptance.
- The Real tab opens from the autonomous monitor. It shows server eligibility,
  wallet deployment, recent venue holdings and closed positions for a
  server-configured pilot. The wallet binding uses the authenticated account
  and the server configuration. Provider errors remain unavailable and
  incomplete result pages are labeled. Returned wallet data is private and
  non-cacheable.
- Node.js 22 verification passed 45 focused tests, including eight new wallet
  cases. The Web and Admin production builds and Prediction API bundle passed.
  The real order and wallet mutation endpoints returned 501 with the legacy
  Real setting set to true in the synthetic test.
- The production release, autonomous entry predicates, Demo ledgers and
  learning controls remained unchanged. This task created no wallet, signer
  credentials, scheduler, order or production database record.

[Polymarket geographic restrictions](https://docs.polymarket.com/api-reference/geoblock)
and [scoped Session Key documentation](https://docs.polymarket.com/trading/session-keys).
