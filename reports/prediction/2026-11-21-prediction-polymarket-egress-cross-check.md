# 2026-11-21 — Prediction host egress cross-check

The read-only checks from the live SignalVerse host at 2026-11-21T15:26:30+08:00 received HTTP 200 from both providers. Polymarket returned country FR, region GES, and a blocked result for order placement. Cloudflare also classified the outgoing connection as FR. [Polymarket geographic eligibility](https://docs.polymarket.com/api-reference/geoblock)

Polymarket's terms prohibit using a VPN or a similar tool to attempt to bypass platform restrictions. The checks used the existing host network. Production configuration and order state were untouched. A Builder support inquiry can clarify which hosting and egress arrangements are supported for routing eligible user orders. [Polymarket terms](https://polymarket.com/tos)
