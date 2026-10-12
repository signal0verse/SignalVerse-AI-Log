# Spot automatic scalp scanner — 2026-10-13

Date: 2026-10-13, Asia/Kuala_Lumpur. Scope: replace the existing automatic Spot
campaign horizon in Demo and real copy trading on CrossVerse and SignalVerse,
as explicitly selected by the owner. Publication and runtime verification are complete.

## Result and behavior

The Spot scalp scanner discovers coins automatically through the existing
Futures public collector, V3 ranking and AUTO quality authority. The user's
top 50 / 100 / 200 market-cap selection, verified identities, stablecoin
exclusion, native Spot pair availability and liquidity checks remain. Discovery
still requires its existing 4h trend and 1h confirmation; those rules were not
replaced with a new scalp ranking strategy. Zero qualified candidates is valid.

New automatic Spot campaigns use up to 1,000 contiguous, closed native Spot
5-minute candles with the existing Formula-B verdict, scenarios, depth and
structure/ATR buying ladders. They retain averaging and profit-taking, with no
stop-loss, forced losing exit or maximum holding time. An averaged position can
remain open indefinitely. This release does not establish profitability.

Manual daily Spot and already-open daily campaigns keep their original horizon,
allocation and levels. Immutable decision/cycle references freeze campaign
strategy; refreshing discovery metadata cannot switch an open campaign's horizon.
Missing, foreign or mixed references do not silently fall back to daily data.
Automatic admission requires a persisted decision. Manual and automatic lists
remain independent; same-owner, same-mode, same-venue symbol collisions remain
blocked. Existing plan, budget, credit, funding and order reconciliation rules remain.

Target admission checks the highest buy rung against authenticated maker/taker
maximum, buyer/seller/special/tax fees, quote tick rounding, a 10-basis-point spread
reserve and a 0.1% net return margin. Uneconomic targets are rejected rather than
stretched. Missing cost or market context produces a persisted WAIT before
automatic allocation. Demo explicitly estimates 0.1% per side for admission;
displayed Demo PnL remains gross, not realized net profitability.

## Exact changes

Core source and active runtime:
`087e4cb611feee6a05bcc7aa1dfc2684bfdcbcf4`.

The new pure scalp policy and native market adapters integrate through the
existing canonical Spot wrapper. Paper analysis, completed 1-minute replay and
manual close use the selected venue. An OHLC minute touching a new buy cannot
also invent a same-bar take-profit. Native Demo recovery preserves cohort
activation checkpoints and watermarks. Native MEXC/Gate MARKET triggers use
current native quotes; owned/Binance resting LIMIT orders retain exchange-fill
authority. Durable uncertain submission holds and exit reconciliation remain.

Seven-locale UI guidance, floating help, strategy history, build provenance and
the safe test runbook were updated. The closed successor scope reconstructs all
original pure/manual/Futures/budget/order/credit/exit statements and keeps every
inherited CI gate. The Paper package truthfully records the scanner horizon amendment.

CrossVerse documentation-only source:
`5e61809144675177fcffbbaf158a72a9d398c0e4`, remotely verified. Product guide and
assistant DRAFT are synchronized; the assistant store was not published.
Client runtime remains `93084e290711b79be159370b278d717c4dacfc9d` and supplier
runtime remains `f39837edc25d11233b0f233a6d7ff97bf7ebac8b`. No PHP request contract,
schema migration or user/history rewrite was needed.

## Tests and protocol evidence

Final adapter/replay/closed-scope suite: **39/39 PASS**. It covers actual Paper
venue shape, missing immutable references, fee/tax/tick/spread boundaries,
closed/gapped/stale/duplicate candles, MEXC pagination, cohort recovery,
ambiguous same-bar fills, no executed stop-loss and owner manual exit.
These checks use pure modules, canonical functions and isolated in-memory SQLite.

Final API diagnostic comparison: **34 baseline / 34 candidate, no introduced or
removed diagnostics**. Local frontend/admin, owned and shared terminal builds pass.
Earlier combined original/new suites passed 129/129; predecessor scopes passed
72/72 and inherited funding/allocation/completion scopes passed 133/133.
CrossVerse's isolated guide/Postman validator passed all existing assertions.

Final exact-source [official CI 38295046193](https://github.com/signal0verse/signalverse-main/actions/runs/38295046193)
completed successfully: **all 76 steps passed**, including the inherited gates.

Unsigned public reads of the actual adapter returned 999 valid closed BTC
5-minute bars at Binance, MEXC and Gate. MEXC uses an exclusive close boundary
and caps this response at 500 bars; endTime alone was ignored, while both
startTime and endTime retrieved the exact preceding page. The adapter validates
adjacency rather than padding missing history. Gate's explicit unclosed flag
is excluded. This does not prove availability for every symbol or private execution.

Protocol references: [Binance market data](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints),
[Binance commission](https://developers.binance.com/docs/binance-spot-api-docs/faqs/commission_faq),
[MEXC official Spot v3](https://mexcdevelop.github.io/apidocs/spot_v3_en/),
[Gate official Spot endpoints](https://www.gate.com/docs/developers/apiv4/en/spot/).

## Release evidence

[Official preparation 38299879151](https://github.com/signal0verse/signalverse-main/actions/runs/38299879151)
succeeded. Immutable artifact **11769603623** contains the original retained
archive, 6,737,616 bytes, SHA-256:

```
6e5d3b54a6abff85cc60c3d77bc16f30c4f898931f2c779fd56dfe5def45de37
```

Independent verification matched **all 2,234 Git blobs and file modes** to the
reviewed commit; the archive was not repacked. Consistent private PostgreSQL and
SQLite backups stayed server-side. Cold restore verified all 134 PostgreSQL
table row counts and SQLite integrity, foreign keys, schema and table counts.
Only an isolated restore database was created and removed; no live schema migration.

[Official production release 38300314363](https://github.com/signal0verse/signalverse-main/actions/runs/38300314363)
succeeded using the existing independent Guard approval bound to the exact
commit and retained artifact digest. Native, owned, admin and both public host
assets were released through this workflow. Paper was then built from the same
retained archive with lockfile-matched isolated dependencies and switched atomically.
Exactly five Paper files changed: engine, provenance, scanner, service and market
ports; all remaining package files are byte-identical to the prior package.
A fresh Paper backup/cold restore passed, with its prior release retained for rollback.

Final checks: **all four services active at 087e4cb**, correct process working
directories, native/admin health, owned manifest, canonical engine provenance,
SQLite integrity/foreign keys and compiled strategy/guard markers passed.
Environment, unit, scheduler, proxy and deployment control hashes were preserved.
The unsigned private Paper endpoint still returns HTTP 401.

Both [CrossVerse manifest](https://cross-verse.net/trade-terminal/manifest.json)
and [SignalVerse manifest](https://signal.easybitpay.com/trade-terminal/manifest.json)
identify the final source. Actual versioned terminal.js and public-source.js
bytes match their advertised hashes and are identical across hosts.
Unsupported public index paths remain HTTP 404.

## Limits

No operator profile activation, forced refresh, Paper tick or private exchange
test order was performed. Runtime health, mocks and public candles do not verify
private-account execution, net profitability or a maximum holding time. Existing
daily Simulator results are not a scalp alpha backtest. Provider outages, rate
limits, missing costs and legitimate zero-candidate scans still cause safe WAIT
or rejection. Real-use results require observation of the user's normal opted-in trading.
