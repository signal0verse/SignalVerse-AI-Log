# 2026-11-21 — Polymarket order warning on the Prediction engine

The read-only request from the production host at 2026-11-21T15:16:02+08:00 returned HTTP 200 and reported France, region code GES, with order placement blocked. Polymarket's geographic endpoint classifies the network address of the caller. The official policy lists France as close-only on the frontend and API, so opening a new position is restricted. [Polymarket geographic restrictions](https://docs.polymarket.com/api-reference/geoblock)

The application derives this warning from the explicit blocked response to the geographic check. Wallet-link state and Demo entry are separate from that check. The initial read did not return a usable result. The Node request from the same host confirmed the classification. Verification used GET requests only and did not change application state or place an order.
