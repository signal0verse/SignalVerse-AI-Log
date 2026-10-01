# SignalVerse Futures — Phase 3 Historical Executable Market-Data & Provenance Research

## Metadata, objective and scope

- Date checked: **2026-10-01**. Local evidence rechecked during 08:06–08:11 UTC; public documentation inspected on the same date.
- Task: determine whether existing/retrievable data can support causal, quantity-aware research on a future full-position profit-protection close.
- Mode: RESEARCH / AUDIT ONLY. No implementation, parameter selection or optimization.
- Application repository/branch: SignalVerse-Main / `codex/prediction-coverage-expansion-audit`.
- Application source identity: `0dbca62357a4adf34240f40ceda3e387356ec4b0`.
- Starting worktree: already dirty; existing HANDOFF changes and unrelated untracked work preserved. No application Git synchronization, commit, push, code edit, build or application test.
- Changes: this Markdown research report only, plus its sanitized report-only publication in SignalVerse-AI-Log/master. No raw account exports are published.
- No SSH, Production/account/credential access, exchange API request, order simulation against an exchange, database access/write, migration, service/configuration/scheduler/gate change, deployment or SL/TP change.
- Publication uses the existing AI-Log report process. Its clean checkout refresh initially failed under restricted networking, then succeeded with approved network access. This is not application delivery.
- Predecessor: [Phase 2 report at its verified publication commit](https://github.com/signal0verse/SignalVerse-AI-Log/blob/6ecf2d53fee4f3b44655cb780a8c01d4535d0781/reports/futures/profit-protection-phase2-parameter-validation-2026-10-01.md).
- Source labels below distinguish official exchange documentation, external-provider claims, inspected local evidence and research design. Documentation availability is NOT verified episode coverage.

## 1. Executive Summary

**Phase 4 parameter research is NO-GO with the current inspected dataset. Phase 2 remains MORE DATA REQUIRED.**

The answer is qualified: Binance and Gate have documented historical-data routes; a current third-party archive also documents MEXC Futures coverage. These are plausible acquisition paths, not data already joined, downloaded or quality-certified for our positions. None restores SignalVerse's unrecorded receive times or creates factual fills for an exit that never happened.

Current evidence supports entry/accounting reconstruction and coarse Binance candle research, not exact fast-exit execution: **144 historical Binance Real records, 117 accepted-plan links, 112 minute-proxy episodes, 0 exact causal executable fast-exit validations**. MEXC's older snapshot is incomplete; no eligible Gate paired episode was supplied. No uniquely identifiable PHA incident was found in the inspected captures.

| Venue | Existing local foundation | Historical acquisition opportunity | Present acceptance |
| --- | --- | --- | --- |
| Binance USD-M | Native entry/fill-cycle accounting; accepted risk for 117; minute OHLC/funding | Official trade archives; conditional official L2 access; external recorded depth/quotes/mark | Missing executable tape and operational timing; not ready |
| MEXC Futures | 114 venue-labeled Real rows in an older snapshot; weak risk/cost linkage | Official candles/funding/private history; external recorded Futures streams from June 2026 | No certified position-to-tape pair; not ready |
| Gate Futures | No eligible paired historical position/tape capture here | Official trade/book/mark/funding download formats; external recorded streams | No certified position-to-tape pair; not ready |

These are data-readiness statements, not exchange quality rankings. Availability claims are evidenced in sections 3–5; no profitability or AI effectiveness inference is made.

## 2. Current Historical Data Inventory

### Inspected/reused local sources

The existing local snapshots are evidence exports, **not a fresh query of the current Production database**. Paths below are local references, not public exports.

| Source | Evidence and limits |
| --- | --- |
| `tmp/admin-futures-audit-20260920/trades.json` | 144 Real Binance rows; 99 Long / 45 Short; current trade fields, quantity, leverage, timestamps and persisted outcomes |
| Same directory: `reconciled.json` | 144 native fill-cycle matches; entry/actual-exit fills and historical commissions/funding references |
| Same directory: `attempts.json` | 117 COMMITTED entry requests with accepted SL/ONE TP and durable order/trade linkage |
| Same directory: `decisions.json` | 12,076 decision rows; linked entry ATR/context where populated |
| `tmp/real-futures-validation-20260920/data/` | Phase 2 inventory: 46 Futures OHLC files / 433,598 rows; 16 funding files / 5,436 events; 24 Spot files / 74,580 rows explicitly excluded |
| `data-validation.json`, `protocol.json` in that directory | Existing receipts/assumptions; not current approval, executable quotes or a live observation contract |
| `reports/futures/profit-protection-phase2-parameter-validation-2026-10-01.md` | Preserved Phase 2 result; its complete-file hash rechecked |
| Sept1 standard-trade snapshots at 10:16:59, 10:17:33 and 10:29:46 UTC under `C:/Projects/SignalVerse-Data/snapshots/` | Each has 232 rows; repeated snapshots must not be summed as independent trades |
| Latest Sept1 `futures_standard_trades.json` / associated `engine_decisions.json` | 118 Real / 114 Demo trade rows; 114 MEXC / 4 unknown Real venue; sparse accepted-risk/cost evidence |
| `net-profitability-fee-rebuild-2026-09-03T07-30-00Z/MACHINE_READABLE/trades_1M.json`, `trades_3M.json` | 3,653 / 9,051 research rows in nested `rows` arrays; inspected for PHA identity only, not accepted as native Real episodes or added to trade totals |
| `tmp/trades_main.json`, `tmp/trades_current.json` | Different product's trade schema; excluded from Futures evidence |
| Earlier structural Shadow ledger and legacy V2 research | Reused limitations from Phase 2; no native fills/executable tape; old 186-stale-input Shadow remains FAIL |

The Binance capture spans Sept7–Sept20. The Sept1 Real snapshot's opening timestamps span **2026-08-13T12:54:19.816539Z through 2026-08-28T19:17:31.708536Z**. Its 114 MEXC rows could fall inside a provider's documented coverage start, but actual symbol/channel/day coverage is still unverified.

**Field existence correction:** all 144 Binance rows include the nullable key `peak_net_pnl_usdt`, but **0/144 have a value**. Thus usable historical net-peak evidence is absent; saying the schema literally has no such field would be inaccurate. Stored MFE is non-null in 141/144 overall and 114/117 accepted-plan rows; it has no ordered executable peak event.

Phase 2 found 13/117 current SL values and 13 TP values differ from accepted entry requests. The cause was not attributed. Freeze accepted original risk; do not substitute later mutable rows.

### Fingerprints independently rechecked in this phase

| File | Complete-file SHA-256 |
| --- | --- |
| Binance `trades.json` | `0fd7998ab049f62eb28595588a95d233331651d74757e114e56e2827bd3534df` |
| `reconciled.json` | `155633844fd869137683df78546440aafea65ed4de97b18cf82d07241724db66` |
| `attempts.json` | `baec3646d860125f9b4d829c82fda3ba646e108d869610ec2b78f6f5c503cfb5` |
| `decisions.json` | `59cda572d85cf2031cfe8954a2be0cd1bf3f20c196329e86f84a2b512c575647` |
| `data-validation.json` | `72e827822e222d2c5701c6b3d8062f0c8d6dabca5ce99d52882ab76dfab8527a` |
| Current historical `protocol.json` | `c0ffbc66aa90de6c97b08a7940a2b54a36b769f018f800e9f9c503187a549ad2` |
| Latest Sept1 standard-trades snapshot | `2669e505c9a815a8e3834694a535cf74ee4215621d7b34aaf71db0dc97213e4d` |
| Phase 2 report | `6f65416cb7eac1c9364ed8b06e0d53bb8a8f3fd201e76c7f839faa53e518259e` |
| Earlier two Sept1 standard-trades snapshots, same content | `10f5c9030814dd85dbbfbc933f2fd718d4d2f9e7838e797fb5bcb7611868186e` |
| Fee-rebuild 1M / 3M research rows | `010d05366e4f38fde5fbffc37396aec2f31b71945895adde8f1affe18d265878` / `bf71f67b3e474c54e3ffd847fa2be050d891332c5314d9f926a298c2322c5d1a` |

Phase 2's 86/86 cache-hash/integrity checks are prior results, **not rerun in this phase**. This phase rehashed the listed evidence files and made bounded local JSON inventory/identity checks. No parameter replay or test suite was executed.

Source inspection/reuse: `api/copytrade.ts`, `api/_shared/futures-candle-provenance.ts`, previously inspected shared Futures Engine/risk/economics paths and prior producer/reconciliation sources. Project instructions, current handoffs, strategy amendments and safe-test runbook were respected; unsafe legacy integration scripts were not run.

## 3. Binance Data Availability

Status vocabulary throughout sections 3–5:

- **AVAILABLE**: a documented source exists for that data type, not proof every required file exists.
- **PARTIALLY AVAILABLE**: limited resolution, depth, retention, conditional access or incomplete linkage.
- **NOT AVAILABLE**: absent from inspected local evidence or no route in inspected official documentation, as explicitly scoped.
- **UNKNOWN / REQUIRES ACCOUNT TEST**: entitlement, private retention, dated symbol coverage or exact semantics not tested. No account test occurred.

### Official sources — checked 2026-10-01

[B1: Binance public-data repository / Futures CSV formats and checksums](https://github.com/binance/binance-public-data) documents daily/monthly trades, aggTrades and klines, checksum sidecars and archive revisions. Daily files become available the next day; monthly publication is later. This supplies native historical trade-time evidence, not a private executable quote or SignalVerse receipt log.

[B2: Current USD-M REST Market Data](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data), sections Kline, Mark/Index Kline, Funding History, Order Book and Symbol Book Ticker:

| Purpose | Exact documented route / limit |
| --- | --- |
| Contract OHLC | `GET /fapi/v1/klines`; native inclusive close-time field |
| Mark/index OHLC | `/fapi/v1/markPriceKlines`, `/fapi/v1/indexPriceKlines` |
| Funding settlement history | `/fapi/v1/fundingRate` |
| Current book/BBO | `/fapi/v1/depth`, `/fapi/v1/ticker/bookTicker`; not arbitrary-time book history |
| Aggregated trades | `/fapi/v1/aggTrades`; current docs limit queries to last 48h, start/end span under 1h |
| Current identity/clock | `/fapi/v1/exchangeInfo`, `/fapi/v1/time` |

Aggregation compresses same-price/taker-side trades within 100ms. Book snapshots expose output/transaction time; BBO excludes RPI liquidity. Candles are not continuous mark or index events. Older-than-REST-window research should use archives, not assume unlimited REST retention. Current specifications do not establish historical revisions.

[B3: Official historical L2 announcement/document lineage](https://www.binance.com/en/blog/futures/421499824684901131) describes account-whitelisted order-book access. The [official repository's older L2 documentation](https://github.com/binance/binance-public-data/diffs/0?commit=e8cdb38250d443e8b948f6cf7e37207614a7ad43&name=master&sha1=4d66fc593d6afa301c9266aed28598f8fc76d6a4&sha2=e8cdb38250d443e8b948f6cf7e37207614a7ad43&short_path=eefa7af&w=false) distinguishes T_DEPTH, restricted S_DEPTH and backfill limitations. **Historical evidence of an access route, not a current coverage guarantee.** Current portal/API entitlement, historical depth and exact symbol/day availability remain UNKNOWN. Do not reuse 2021 limitations as confirmed 2026 policy.

[B4: Official private-history announcement](https://www.binance.com/en/support/announcement/detail/6811b3e0da104d77b6fb178e053b887c), updated 2024-10-08, identifies asynchronous order/trade export routes `/fapi/v1/order/asyn`, `/trade/asyn` and their `/id` links. Recovery of our account's original protection, fills and funding is conditional on authorized private export; not performed here.

[B5: Current official local-book maintenance](https://developers.binance.com/en/docs/products/derivatives-trading-usds-futures/websocket-market-streams/How-to-manage-a-local-order-book-correctly), updated October1, requires snapshot/stream overlap and `pu == previous u`; quantities are absolute. This is a **live protocol**, not historical WS storage.

### External archive — secondary exchange evidence

[T1: Tardis Binance Futures](https://docs.tardis.dev/historical-data-details/binance-futures) claims coverage since **2019-11-17**, recorded trade/depth/bookTicker/markPrice/forceOrder streams, generated REST snapshots up to 1000 levels and sequence validation. Its mark feed is sampled at 1s after February2020; liquidation publication exposes only the latest per-symbol event per 1000ms. Provider receipt timestamps refer to its collector, not ours. Its exact September2026 cohort files were not obtained or certified.

| Required data | Official historical status | Inspected local status / limitation |
| --- | --- | --- |
| Last trades / native IDs | AVAILABLE [B1]; bounded REST [B2] | Trade fills are private executions, not a complete public tape |
| Continuous mark / index | PARTIALLY AVAILABLE: OHLC [B2]; recorded sampled stream via external [T1] | NOT AVAILABLE as ordered position tape |
| Best bid / best ask / spread | UNKNOWN official dated archive coverage; current REST only [B2]; external [T1] | NOT AVAILABLE |
| Depth snapshots/deltas | UNKNOWN / conditional [B3]; external [T1] | NOT AVAILABLE |
| Reconstructible depth | PARTIALLY AVAILABLE after snapshot/sequence/depth validation [B5/T1] | 0 validated position joins |
| Actual-size executable price | Derived/modelable only from valid depth; never an observed hypothetical fill | NOT AVAILABLE |
| Funding reference history | AVAILABLE [B2] | 5,436 cached reference events; actual accounting separate |
| Liquidation tape | PARTIALLY AVAILABLE external sampled stream [T1]; not all liquidations | No complete market tape |
| Contract specifications / symbol history | Current metadata AVAILABLE [B2]; as-of revisions UNKNOWN | Historical spec snapshot not certified |
| Order/fill/protection history | UNKNOWN / REQUIRES ACCOUNT TEST [B4] | Historical native cycles present; original protection lifecycle still incomplete |
| SignalVerse receive-time history | NOT AVAILABLE from exchange archive | Missing |

The [official liquidity-program depth exports](https://www.binance.com/en-NG/support/faq/detail/afd1ccded7ca41108b281c927fefa3a0) describe percentage-band aggregates; these are not per-price L2 and must not substitute for it. No paid entitlement, price quote, public archive file or private account was tested.

## 4. MEXC Data Availability

### Official sources — checked 2026-10-01

| Source/section | Documented capability and important restriction |
| --- | --- |
| [M1: Contract candles](https://www.mexc.com/api-docs/futures/market-endpoints/get-candlestick-data) | `GET /api/v1/contract/kline/{symbol}`; start/end seconds, Min1 available, up to 2000 points; full retention not promised |
| [M2: Fair-price candles](https://www.mexc.com/api-docs/futures/market-endpoints/get-fair-price-candles), [index candles](https://www.mexc.com/api-docs/futures/market-endpoints/get-index-price-candles) | `/kline/fair_price/{symbol}`, `/kline/index_price/{symbol}`; historical OHLC, not an ordered sub-minute tape |
| [M3: Recent deals](https://www.mexc.com/api-docs/futures/market-endpoints/get-recent-trades) | `/api/v1/contract/deals/{symbol}`; up to 100 recent deals; no arbitrary-date pagination documented |
| [M4: Depth snapshot](https://www.mexc.com/api-docs/futures/market-endpoints/get-contract-order-book-depth), [recent depth commits](https://www.mexc.com/api-docs/futures/market-endpoints/get-the-last-n-depth-snapshots) | `/depth/{symbol}`, `/depth_commits/{symbol}/{limit}`; current/recent versioned data, not month-old L2 history |
| [M5: Funding history](https://www.mexc.com/api-docs/futures/market-endpoints/get-funding-rate-history) | `/api/v1/contract/funding_rate/history`; rate, settleTime, collectCycle; paginated, up to 1000 per page; total retention unspecified |
| [M6: Contract information](https://www.mexc.com/api-docs/futures/market-endpoints/get-contract-info) | Current documented `/api/v1/contract/detail/country`; contractSize, volume/price units, fees, protection restrictions, listing metadata; not an as-of revision ledger |
| [M7: Historical positions](https://www.mexc.com/api-docs/futures/account-and-trading-endpoints/get-historical-positions) | Private position identity/quantity/direction/openType; start/end milliseconds, pagination |
| [M8: Historical orders](https://www.mexc.com/api-docs/futures/account-and-trading-endpoints/get-all-historical-orders), [per-order fills](https://www.mexc.com/api-docs/futures/account-and-trading-endpoints/get-trade-records-by-order-id) | `/api/v1/private/order/list/history_orders`, `/deal_details/{orderId}`; fills include quantity, price, fee/currency, deal time and category |
| [M9: Funding fees](https://www.mexc.com/api-docs/futures/account-and-trading-endpoints/get-funding-fee-details) | Private positionId-linked funding amounts/settlement time; distinct from public reference rate |
| [M10: TP/SL order history](https://www.mexc.com/api-docs/futures/account-and-trading-endpoints/get-take-profitstop-loss-order-list) | `/api/v1/private/stoporder/list/orders`; positionId, original levels, states, lossTrend/profitTrend: latest/fair/index |
| [M11: WS depth](https://www.mexc.com/api-docs/futures/websocket-api/order-book-depth), [maintenance rules](https://www.mexc.com/api-docs/futures/websocket-api/incremental-order-book-maintenance-mechanism) | 200ms depth push; matching-engine `cts`, envelope `ts`, version; contiguous versions and absolute quantity updates; recent 1000-commit repair is not historical retention |
| [M12: Fair-price WS](https://www.mexc.com/api-docs/futures/websocket-api/fair-price), [tickers](https://www.mexc.com/api-docs/futures/websocket-api/tickers) | Live fair-price change events; all-contract ticker every 2s with BBO/mark/index values; not a stored historical service |

Native candle response supplies second-based time, not a Binance-style inclusive close field. Existing SignalVerse code interprets it as open time and derives an end-exclusive close. Preserve raw native timestamps and interpretation version; do not claim a derived boundary is an observed exchange publication time.

Depth array documentation has potentially confusing wording for volume versus order count. **Do not certify executable quantity by assuming the wrong tuple component**; require sample/schema reconciliation with contract units. This is a data-quality blocker, not permission to change the adapter.

Private export retention cannot be inferred from REST pagination. The [current official order-history export guide](https://www.mexc.com/learn/article/mexc-futures-now-support-order-history-and-capital-flow-exports-to-pdf/1) describes bounded 18-month/365-day web bulk export; UI/export/API paths may differ. Account access and usable machine-readable completeness remain untested. A PDF or closed-position summary alone is not an execution event journal.

### External archive — secondary exchange evidence

[T2: Tardis MEXC Futures](https://docs.tardis.dev/historical-data-details/mexc-futures) documents a Futures archive since **2026-06-25**, distinct from MEXC Spot. It lists deal/depth/ticker/fair/index/funding streams, generated depth snapshots and raw contract metadata updates. Claimed generated snapshots reach up to 5000 levels, which must not be silently equated with every native request or episode. **No exact August2026 contract/day file or depth tuple was verified.**

| Required data | Official historical status | External opportunity / inspected local status |
| --- | --- | --- |
| Last trade tape | PARTIALLY AVAILABLE: recent 100 [M3] | Historical recorded deals [T2]; no local certified tape |
| Mark/fair / index | PARTIALLY AVAILABLE: historical OHLC [M2] | Recorded streams [T2]; none paired locally |
| BBO / spread | NOT AVAILABLE as dated history in inspected official docs; live [M12] | Ticker/depth archive [T2]; unverified |
| Historical depth snapshots/deltas | NOT AVAILABLE in inspected official historical routes [M4] | Archive [T2], dates/units/gaps unverified |
| Depth reconstruction / full-size quote | PARTIALLY AVAILABLE via versioned archive after validation [M11/T2] | 0 accepted paired episodes |
| Funding | AVAILABLE reference [M5]; private payment conditional [M9] | No complete epoch-linked payment/tape ledger |
| Liquidation | No complete public historical market tape located; UNKNOWN | Private fill category can identify own liquidation [M8], not all-market events; external liquidation coverage not established |
| Contract/symbol revisions | Current metadata AVAILABLE [M6]; historical revisions UNKNOWN | Raw contract updates [T2] may help; as-of version not certified |
| Position/order/protection history | UNKNOWN / REQUIRES ACCOUNT TEST [M7–M10] | Older snapshot lacks enough accepted-risk/path evidence |
| Official bulk public Futures WS archive | NOT AVAILABLE in inspected documentation | External route exists; does not restore SignalVerse receipt time |

MEXC native protection trigger reference must be recorded per accepted order, not presumed to be contract last. No order/protection request was sent.

## 5. Gate Data Availability

### Official sources — checked 2026-10-01

[G1: Current Historical Quotation portal](https://www.gate.com/developer/historical_quotes) explicitly offers Futures trade/candle downloads and depth/depth snapshots. It advertises trades/candles from January2023 and depth from August2021; this is portal-level coverage, not a verified guarantee for each listed/delisted contract. It distinguishes monthly files from hourly book files and UTC filename construction.

[G2: Official historical format announcement](https://www.gate.com/announcements/article/21688), originally 2021-07-26, documents Futures trades, orderbooks, mark_prices and funding files:
- Trades: fractional-second timestamp, deal ID, price, signed contract count.
- Orderbooks: hourly initial set snapshot plus updates merged into 100ms batches, with begin-ID/count.
- Mark files: timestamped index/mark/last observations; example cadence is irregular, not a guaranteed continuous millisecond feed.
- Funding updates are indicative; funding applies identify reference settlement rates, not our private payment.

Current portal formats take precedence for retrieval paths; the old announcement's generic monthly URL must not be blindly used for hourly depth. Neither source was treated as proof a required file downloaded successfully.

[G3: Gate's official Futures REST SDK endpoint reference](https://raw.githubusercontent.com/gateio/gateapi-python/master/docs/FuturesApi.md):
- `GET /futures/{settle}/trades` accepts time bounds; truncation requires complete pagination.
- `/candlesticks` supports `mark_` and `index_` contract prefixes, maximum 2000 points.
- `/funding_rate`, `/liq_orders` provide history routes.
- Private `/orders_timerange`, `/my_trades_timerange`, `/position_close`, `/account_book` are potential lifecycle/accounting sources; retention/account permissions untested.
- `/order_book` is a current snapshot, not arbitrary-time reconstruction.

[G4: Official Futures WS](https://www.gate.com/docs/developers/futures/), Order Book API, documents BBO `t/u`, snapshot overlap and `U/u` deltas. Optional depth frequencies are 20ms/100ms with level restrictions. This describes live publication, not historical retention. One prose example conflicts with its payload's frequency/level; raw messages and validated sequences must resolve that ambiguity rather than silently choosing the favorable interpretation.

[G5: Contract model](https://raw.githubusercontent.com/gateio/gateapi-python/master/docs/Contract.md) supplies direct/inverse type, quanto_multiplier, precision, fee rates, funding interval and config_change_time. These are current specifications, not all historical revisions. [Native trigger model](https://raw.githubusercontent.com/gateio/gateapi-python/master/docs/FuturesPriceTrigger.md) distinguishes last/mark/index reference. [Trade model](https://raw.githubusercontent.com/gateio/gateapi-python/master/docs/FuturesTrade.md) distinguishes internal liquidation/ADL trades, which may not appear in ordinary candles. [Account-book model](https://raw.githubusercontent.com/gateio/gateapi-python/master/docs/FuturesAccountBook.md) distinguishes funding, fees, PnL and rebates.

### External archive — secondary exchange evidence

[T3: Tardis Gate Futures](https://docs.tardis.dev/historical-data-details/gate-io-futures) claims coverage since **2020-07-01**, trades/tickers/BBO and roughly 100ms legacy book snapshots of **20 levels**, with provider receive times. This is **not unlimited full depth**, even if a normalized dataset is named incremental_book_L2. Quantity beyond retained levels remains unknown. Exact dated file coverage was not tested.

| Required data | Official historical status | Inspected local limitation |
| --- | --- | --- |
| Last trades | AVAILABLE [G1/G2/G3] | No eligible Gate epoch/tape pair |
| Mark / index | AVAILABLE sampled files [G2], OHLC [G3] | Resolution and exact symbol/day coverage unverified |
| BBO / spread | PARTIALLY AVAILABLE: derivable from valid archived books [G1/G2] | No validated book pair; separate BBO archive [T3] external |
| Depth snapshot/delta | AVAILABLE format/portal [G1/G2] | Batch semantics, gaps and exact hourly files not validated |
| Reconstructed depth | PARTIALLY AVAILABLE pending parser/continuity/unit validation | Full-size quote not proved |
| Executable actual-size price | Modelable only with sufficient book quantity, not factual hypothetical execution | NOT AVAILABLE |
| Funding | AVAILABLE reference files/routes [G2/G3]; account payments conditional | No certified position/accounting linkage |
| Liquidation | PARTIALLY AVAILABLE REST history [G3]; completeness/retention UNKNOWN | No certified market tape |
| Historical contract/symbol revisions | Current metadata AVAILABLE [G5]; revision history UNKNOWN | Need as-of contract snapshots |
| Private position/order/protection history | UNKNOWN / REQUIRES ACCOUNT TEST [G3/G5] | No complete paired history in supplied evidence |
| Historical WS replay | Official download is not identical raw WS receipt history | External sampled archive [T3]; our receipt times absent |

A public archive route was identified, **not downloaded**. No cost/paywall/long-term-retention SLA was established for Gate's exact files. Do not report “Gate has no historical orderbook data.”

### External-provider trust and access, all venues

[T4: Tardis HTTP API](https://docs.tardis.dev/api/http-api-reference) describes raw replay slices and exchange metadata/coverage endpoints. Those public coverage endpoints were not accessible through the browsing tool here, so exact per-symbol coverage remains unverified.

[T5: Provider schema](https://docs.tardis.dev/tardis-machine/data-types) separates exchange timestamp from localTimestamp. [T6: Billing/access](https://docs.tardis.dev/faq/billing-and-subscriptions) describes subscription-bound history: CSV access differs from raw-replay/instrument-metadata access, and history horizon depends on plan/billing. First-day monthly samples are documented by venue pages. No subscription, trial, key, purchase or download was created.

**Trust verdict: conditionally usable as a source of observed market messages, not certified truth about our execution.** Require raw/native messages, recorded schema version, source/receipt provenance, venue-specific continuity checks, coverage incidents, sample cross-check against official trades/funding and complete file hashes. Provider timestamps are not SignalVerse's historical latency. Paid archive coverage does not solve unobserved counterfactual fills.

## 6. Position-to-Market-Data Join Feasibility

### Concrete join contract — design only

Use an immutable **position epoch**, not symbol + approximate calendar day:

```text
private account scope + exchange + market family + native contract + position mode/side
  + flat-to-nonzero generation
  -> accepted entry plan + durable attempt/order IDs
  -> all native entry fills + quantity changes + actual terminal fills/flat evidence
  -> same native instrument's trades / mark / index / depth
  -> causally available observations
```

Account identifiers stay private; reports use pseudonymous episode keys. Native position IDs can be reused or absent; one-way BOTH and hedge Long/Short require different keys. An add/reduce/manual action is a quantity event within a documented epoch, not an invented independent trade.

| Join step | Exact rule |
| --- | --- |
| Instrument identity | Match venue, Production market family, settlement currency, native contract, side/mode and listing generation; no fuzzy PHA/USDT match across venues or Spot |
| Accepted plan | Join durable attempt -> exchange entry order -> actual fills -> original decision; preserve accepted SL/ONE TP/reference and immutable hash |
| Entry timing | First positive fill opens exposure; cumulative fills define actual size/VWAP. Full-size research begins after completed entry, or explicitly models partial-entry exposure |
| Epoch endpoint | Actual reduction fills plus independently observed native zero quantity; DB CLOSED, HTTP success or order ACK alone is not flat |
| Market interval | Include initialization snapshot before entry, complete intervening deltas and data through actual episode censoring; preserve source retention/coverage |
| Time normalization | Keep raw integer/string timestamps, units and precision; convert separately to UTC with documented semantics |
| Clock uncertainty | Preserve host clock samples, exchange-time probes and RTT-derived bounds; no invented exact one-way latency. Today's clock cannot correct an unmeasured past host clock |
| Order | Sequence/version within stream first; timestamp ties across streams remain partial order unless receive/instrument sequencing resolves them |
| Deduplication | Native channel+event/trade ID or documented sequence range + payload hash; do not collapse distinct trades sharing a millisecond |
| Gap handling | Detect missing IDs/versions, disconnects, snapshot mismatch and capture outages. A new snapshot reinitializes from that point; it does not heal an earlier missing interval |
| Temporal join | As-of observation whose exchange time AND known availability permit use at the decision; never nearest-neighbor join to a future quote |
| Costs/specification | Join effective-at contract/fee rules and actual signed funding/payment IDs; do not apply current metadata retrospectively without evidence |

No universal timestamp tolerance is selected. Tolerance comes from measured clock uncertainty and native granularity; if it straddles trigger ordering, classify the result AMBIGUOUS rather than shift it until profitable.

**Local feasibility:** Binance 117 accepted-plan joins are reusable, but executable market/receive-time joins are absent. MEXC rows are not complete epochs; Gate lacks supplied pairs. Existing entry candle-provenance code records selection/close/hash information, not a continuous exit quote tape or market receive journal. Code/schema presence does not prove historical population or active runtime.

**Current Production database sufficiency: NOT VERIFIED.** No live database was queried. Existing exports demonstrate missing evidence in this research dataset, not that no later Production telemetry could exist.

## 7. PHA Forensic Reconstruction

**PHA RECONSTRUCTION: NOT POSSIBLE WITH CURRENT DATA**

Bounded identity inspection found 0 PHA-symbol matches in:
- the 144-row Binance trade capture and its decision/attempt captures;
- all three Sept1 standard-Futures snapshots;
- the 3,653/9,051-row fee-rebuild research outputs.

The different-schema trade helper files also supplied no PHA identity, but are not Futures proof. This is not a claim that PHA never traded or that all private history was searched.

| Incident requirement | Current evidence |
| --- | --- |
| Unique venue/account/native contract/side/epoch/order identity | Missing; cannot uniquely select an incident |
| Exact entry fills, accepted SL and ONE TP, trigger reference | Missing for this incident |
| Actual contracts/base exposure/multiplier/margin mode | Missing |
| Native position-open and actual close/flat timestamps | Missing |
| Ordered mark/last/BBO/depth with clock/sequence integrity | Missing |
| Comparable causal net peak timestamp/value | Missing |
| Reversal and rule-trigger chronology | Not reconstructible; no rule is selected in Phase 3 |
| Hypothetical executable full-close result | Unobserved; even future tape acquisition supplies a model, not an actual fill |
| Eventual native SL trigger/fills and realized net accounting | Not linked |

Minimum forensic input is an owner-provided private native order/position reference or machine-readable historical export that resolves venue, exact contract, side and time. Retrieve its accepted protection and full fill/payment history under a separate authorized read-only account task. Do not substitute screenshot prices, a “PHA-like” candle or a post-hoc maximum. PHA cannot be used as calibration or representative performance evidence.

## 8. Causal Replay Feasibility

### Observable versus counterfactual timeline

| Stage | With current data | With validated historical event tape | Still not factual |
| --- | --- | --- | --- |
| T0 Entry | Actual native Binance fills for matched cycles | Position/plan/fills can anchor exposure | Entry close approximations do not equal fill time |
| T1 Profit activation | Not exact; no ordered executable net path | Computable from information causally available under a later frozen policy | No activation threshold selected here |
| T2 Running peak | Stored MFE lacks event chronology | Running observed peak with explicit price basis, size/cost bounds and source event IDs | Final maximum cannot be inserted into earlier state |
| T3 Giveback | Minute proxy only | Measured relative to comparable running net peak | Between-publication path remains unobserved |
| T4 Exit decision | Never produced by this new mechanism | Counterfactual decision using a pre-frozen rule and available events | Not a real historical SignalVerse decision |
| T5 Hypothetical submit | Missing | Modeled decision-to-submit latency only | No real submit/ACK existed |
| T6 Hypothetical fill | Missing | Full-size book/latency/impact bounded execution model | Queue races, hidden liquidity, self-impact and actual fill cannot be known exactly |
| T7 Flat confirmation | Actual old lifecycle may supply historical evidence | Modeled state can sum hypothetical fills | Cannot call a synthetic zero position “exchange-confirmed flat” |

An **event-time market replay** is preferable to candles, but it is only idealized causality if SignalVerse receipt times are missing. Operational replay must also obey receive-time availability. Provider receive-order replay is a different observer experiment; label it explicitly.

Processing design:
1. Validate immutable source/spec/epoch manifests and replay warmup/book initialization.
2. Deliver events in recorded observer-available order; enforce native stream sequencing and exchange time bounds. Do not retroactively insert a late event into already-made decisions.
3. At time T, advance only the known position/cost/book state. Calculate a running net peak from comparable liquidation estimates, not future MFE.
4. Admit only complete/fresh observations with measured uncertainty. Record all vetoes, missing data and tie-order alternatives. Invalid intervals are censored, not interpolated into smooth profit.
5. Simulate only a FULL POSITION CLOSE intent after a later separately frozen rule; existing native SL/ONE TP competition remains part of the event model.
6. Model submission/arrival/fills separately. Exchange protection can fire before arrival; avoid selling/closing twice or treating unknown execution as a new attempt.
7. Reconcile modeled fill sum and quantity, but keep hypothetical flat distinct from independently observed actual flat. No live order is needed or authorized here.

**Resolution:** retain the fastest native unaggregated available feed and its actual cadence; do not manufacture tick resolution. A 100/200ms batched book or 1s mark feed cannot support claims about within-batch/within-second ordering. Test only at identifiable resolution with sensitivity/censoring. A millisecond timestamp does not mean millisecond sampling.

Example OHLC high 0.0800 and close 0.0770 supplies neither order of extrema, spread, depth, executable size nor trigger availability. Even 10-second OHLC does not fix this. No OHLC-only exact-fast-exit PASS is possible.

## 9. Net PnL / Execution-Cost Reconstruction

Separate **actual settled net PnL**, **mark-based unrealized PnL**, and **estimated full-size liquidation net PnL**. Only the last is comparable to a hypothetical market close; mark/last alone can overstate realizable profit.

For a verified linear quote-settled contract:

```text
remaining_base_qty = remaining_native_contracts * effective_contract_multiplier
executable_close_vwap = sum(level_price * filled_base_qty) / total_base_qty

gross_if_closed = side_sign * remaining_base_qty * (close_vwap - entry_vwap)
episode_net = realized_gross_to_date + gross_if_closed
              - actual_entry_fees - actual_realized_exit_fees - estimated_remaining_close_fee
              + signed_actual_funding_to_date
              + separately evidenced rebates/other attributable cash flows
```

This is an accounting definition, not an implemented rule or optimized cost model. Inverse/quanto products require their native payoff in settlement currency; **do not reuse the linear formula universally**. Leverage changes margin/exposure/risk, not a second PnL multiplier once actual quantity is known.

| Component | Required reconstruction | Current gap |
| --- | --- | --- |
| Entry | All actual fill prices/amounts, entry fee currencies and completion time | Available for matched Binance cycles, not complete across venues |
| Close quote | Long sells into bids; Short buys asks; consume enough valid levels for complete remaining size | No paired book tape |
| Spread/impact | Included in book-derived VWAP; add only unmodeled residual impact/latency uncertainty | No calibrated residual/latency evidence |
| Fees | Historical actual per-fill commission; for hypothetical exit use effective account fee schedule/uncertainty | Default advertised fee is not proof; non-USDT fees need as-of conversion |
| Funding | Actual signed per-position payments through the chosen cutoff; reference rate estimates only where explicitly modeled | Public rate is not the actual payment; interval and exposure may change |
| Multiplier/specification | Effective-at contract type, contractSize/quanto multiplier, rounding and price/volume units | Historical revisions incomplete |
| Liquidation/ADL | Actual quantity/margin transitions and category; separate normal market execution | No complete continuous risk path |
| Native SL/TP | Accepted trigger reference + native trigger/order/fill timestamps and accepted rule settings | Candle crossing is not trigger/fill proof |
| Flat/settlement | Independent position-zero evidence and attributable final fees/funding | Hypothetical evidence does not exist |

**No double-counting:** do not subtract an extra generic spread/slippage charge when the same cost already appears in depth-derived close VWAP or actual fills. Do not add funding reference estimates over actual funding cash flows. Track raw fee sign versus signed cash-flow convention explicitly.

A comparable net peak must use the **same quantity, price basis and cost convention** as current net PnL. Size or fee-basis changes require an explicit generation/reset/rebasing record; do not fabricate giveback from inconsistent states. Missing final cost settlement means provisional, not final net profit.

The local native accounting can establish historical Binance endpoint totals, but **not a newly chosen hypothetical exit's exact net return**. Constant Phase 2 fee/slippage assumptions remain assumptions.

## 10. Future Telemetry Contract

**Specification only: no schema, migration, collector or worker is created.** Use append-only event records referencing immutable raw data/plan blobs; do not replace evidence with one mutable trade row. Decimal financial values are strings; native IDs and nanosecond times are strings to avoid floating-point/integer loss.

Mandatory legend: **M** required; **C** required when that event/source exists; otherwise explicit null plus reason; **O** diagnostic. Each field below inherits the envelope. Time codes: **EV** native event time; **TX** native matching/transaction time; **RX** local receive time; **APP** app computation time; **ASOF** effective-at metadata time. No RX is derived from EV or today's clock.

### Shared envelope and provenance

| Field / type | Meaning | Source | Timestamp semantics | Required / reason |
| --- | --- | --- | --- | --- |
| event_id / string | Stable unique evidence identity | Native ID or collector-generated ID | Per captured event | M: dedup/replay |
| event_kind, schema_version / enum,string | Dataset/category and parser version | Capture metadata | Version at capture | M: interpret bytes reproducibly |
| position_epoch_id / string | Position generation key | Native lifecycle + private account scope | Whole nonzero epoch | M for position events; C for public tape attribution |
| exchange, environment, market_family / enums | Venue, Real/Demo, USD-M/settlement family | Native connection configuration | ASOF | M: prevent cross-venue/mode joins |
| native_symbol, instrument_generation / strings | Exact contract/listing identity | Native contract record | ASOF | M: avoid symbol reuse/rename |
| source_uri, channel, source_version / strings | Endpoint/topic and native schema | Capture request/subscription | At capture | M: audit origin |
| raw_payload_ref, raw_payload_sha256 / strings | Private immutable raw bytes | Capture storage | At capture | M: verify normalization |
| exchange_event_at, exchange_transaction_at / nullable timestamp strings | Native publication and transaction clocks | Native EV/TX fields | Preserve raw unit/precision separately | C; explicit absence, never invented |
| received_at_utc, received_at_monotonic_ns / strings | Host receipt instant/within-boot order | Collector clocks | RX | M for future live evidence; absent historically must remain null |
| host_boot_id, connection_id / strings | Clock/connection generation | Collector | RX | M: reconnect and monotonic reset |
| ingest_sequence / integer string | Local capture ordering | Collector | RX order | M: tie/order audit |
| clock_sample_id, clock_uncertainty_ms / string,decimal | Measured offset bound and confidence | Host/exchange probe telemetry | Effective interval, not future clock | M for latency claims |
| quality_status, missing_fields / enum,string[] | VALID/GAP/STALE/AMBIGUOUS etc | Independent validator | As-of decision | M: fail-closed research admission |

### A. Position lifecycle

| Field / type | Meaning | Source | Timestamp semantics | Required / reason |
| --- | --- | --- | --- | --- |
| account_scope_hash, native_position_id / string,nullable string | Private account disambiguation; native ID if supplied | Account/position event | EV/ASOF | M/C: epoch join without public account IDs |
| decision_id, attempt_id, entry_order_ids / strings,array | Original durable entry chain | Existing journal/native fills | APP -> TX | M: accepted entry linkage |
| side, native_position_side, position_mode / enums | Long/Short, BOTH/hedge semantics | Native accepted state | EV/ASOF | M: avoid offsetting wrong leg |
| entry_first_fill_at, entry_complete_at / timestamps | Start of exposure and completion | Native fill ledger | TX, retain RX | M: no full-size before filled |
| entry_vwap, entry_fills_ref / decimal,string | Weighted actual entry and underlying fills | Native executions | Through entry_complete_at | M: gross PnL anchor |
| original_risk_plan_ref/hash / strings | Immutable accepted original entry risk | Submitted plan + accepted response/native order | APP/EV before exposure | M: mutable SL must not redefine R |
| accepted_sl, accepted_one_tp / decimals | Exactly original full-position levels | Accepted risk/protection evidence | ASOF entry epoch | M: native baseline |
| sl_trigger_reference, tp_trigger_reference, native_rule_flags / enums,object | Last/mark/index, protection/price guards | Accepted native protection objects | ASOF acceptance | M: crossing semantics |
| qty_native, qty_base, qty_delta, qty_effective_at / decimals,timestamp | Native and normalized exposure changes | Position/fill events | TX/EV | M: executable-size and full-close math |
| contract_spec_ref/hash / strings | Effective multiplier/type/tick/step/settlement | Native metadata snapshot | ASOF | M: financial units |
| leverage, margin_mode, margin_state_ref / decimal,enum,string | Accepted leverage/margin/risk state | Native position/account snapshots | EV/ASOF | M: liquidation/context, not extra PnL multiplier |
| actual_close_fill_at, actual_flat_at, lifecycle_state / timestamps,enum | Actual terminal fills/confirmed flat or unresolved | Native fills + independent position checks | TX/EV/RX | C: actual lifecycle vs censored |
| quantity_generation / integer | Comparable position-size segment | Quantity transitions | At transition | M: peak comparability |

### B. Market data

| Field / type | Meaning | Source | Timestamp semantics | Required / reason |
| --- | --- | --- | --- | --- |
| last_trade_id, last_trade_price, last_trade_qty / string,decimals | Public matched trade | Native trade stream/archive | TX + RX when captured | M for trade tape; not executable quote |
| mark_price, index_price / decimals | Separate valuation/reference streams | Native mark/fair/index | EV + RX | M: protection/value chronology |
| best_bid_price/qty, best_ask_price/qty / decimals | BBO prices and native size | Native BBO or reconstructed L2 | EV/TX + RX | M: side-specific liquidation |
| spread_price, spread_bps / decimals | Derived spread from same valid BBO | BBO above | Same event/as-of generation | M: quote consistency |
| book_snapshot_ref/hash, snapshot_sequence / strings | Book initialization and native ID | Native snapshot/archive | EV/TX/RX | M for depth path |
| book_delta_ref/hash, sequence_first/last/previous / strings | All ordered native deltas/ranges | Native depth | EV/TX/RX | M/C by venue: continuity |
| native_quantity_unit, retained_levels / enum,integer | Contracts/base, observable depth cap | Source schema/spec | ASOF snapshot | M: prevent overclaiming full depth |
| is_snapshot, is_generated, aggregation_interval_ms / bools,decimal | Native vs generated/batched data | Provider/source metadata | At capture | M: precision limits |
| gap_intervals, reconnect_events_ref / array,string | Missing/corrupt capture intervals | Sequence/capture validator | RX and affected EV range | M: censor, not interpolate |
| executable_qty, executable_vwap, uncovered_qty / decimals | Quantity-aware liquidation estimate/bounds | Valid book + epoch quantity | As-of book generation | M for executable PnL; null if depth insufficient |
| quote_age_ms, book_health / decimal,enum | Freshness/continuity at observation | RX/APP + validator | APP at use | M: no stale executable claim |

### C. Exchange events

| Field / type | Meaning | Source | Timestamp semantics | Required / reason |
| --- | --- | --- | --- | --- |
| native_order_id, native_trade_id, native_algo_id / nullable strings | Exact native identities | Native order/algo/execution events | EV/TX/RX | C: match actions/protection |
| native_status, native_event_reason / strings | Acceptance, trigger, reject, cancel, fill etc | Native event payload | EV/TX/RX | M: ACK is not fill |
| protection_accepted_at, protection_triggered_at, protection_payload_ref / timestamps,string | Actual bracket lifecycle evidence | Native acceptance/trigger/history | EV/TX/RX | C: baseline trigger/fill competition |
| funding_payment_id/amount/currency, funding_settle_at / strings,decimal,timestamp | Actual signed position payment | Native private funding ledger | EV/settlement + RX | C: exact net cost |
| liquidation_adl_kind, forced_execution_ref / enum,string | Own forced reduction/market liquidation category | Native private event/history | TX/EV | C: distinguish ordinary exit |
| effective_spec_changed_at, new_spec_ref / timestamp,string | Contract metadata revisions | Native contract update/snapshot | ASOF + RX | C: historical units |
| clock_probe_sent/received_at, server_time / timestamps | Exchange time/RTT bounds | Time probe + host clock | Host APP/RX and EV | M when deriving clock uncertainty |

### D. Exit-decision events — eventual research only

| Field / type | Meaning | Source | Timestamp semantics | Required / reason |
| --- | --- | --- | --- | --- |
| policy_id/hash, research_protocol_hash / strings | Frozen rule/protocol identity, no defaults selected here | Research manifest | Before first evaluated event | M: no post-hoc tuning |
| evaluated_at, input_event_ids, input_available_at / timestamp,array,timestamp | Actual knowledge cutoff and exact inputs | Replay/app evaluation trace | APP constrained by RX/EV | M: prove no look-ahead |
| pnl_basis, net_liquidation_estimate/bounds / enum,decimal/object | Comparable full-size net estimate | Cost/book/epoch state | As-of evaluation | M: not mark-only profit |
| activation_event_id/at / string,timestamp | First causal arming observation if rule arms | Frozen rule trace | APP and referenced market event | C: auditable T1 |
| running_peak_net, peak_event_id/at / decimal,string,timestamp | Peak observed so far, not eventual MFE | Causal state reducer | Available event only | C: auditable T2 |
| current_net, giveback_value, quantity_generation / decimals,integer | Comparable decline on same exposure basis | Causal state | APP | M: avoid inconsistent peak |
| confirmation_evidence_ids, veto_reasons / arrays | Rule inputs and explicit unavailable-data vetoes | Frozen rule trace | APP | M: no invented confirmation |
| verdict, exit_reason, exit_intent_id / enum,string,nullable string | HOLD/VETO/FULL_CLOSE_INTENT, reasoning and idempotency key | Decision journal | APP | M/C: one full-close intent, not partial TP |
| execution_domain / enum | ACTUAL / MODELED / IDEAL_EVENT_TIME | Research/runtime context | Whole event | M: no synthetic actual claims |

### E. Execution events

| Field / type | Meaning | Source | Timestamp semantics | Required / reason |
| --- | --- | --- | --- | --- |
| close_intent_id, client_order_id, submitted_qty / strings,decimal | Durable full-size close identity/size | Existing execution journal | APP before submit | C for future actual close; absent for old counterfactual |
| close_submit_started/completed_at / timestamps | Client send attempt and return | Transport telemetry | APP/monotonic | C: T5/timeout uncertainty |
| close_ack_at, native_ack_time, ack_status/raw_ref / timestamps,enum,string | Received ACK/rejection evidence | Native response/event | RX vs EV separate | C: do not call ACK flat |
| close_fill_id/at/qty/price / strings,timestamp,decimals | Every actual execution, including multiple fills | Native private fills | TX + RX | C: T6 complete amount |
| fill_fee_amount/currency, fee_cashflow_sign / decimal,string,enum | Commission/rebate with unit/sign | Native fills/payment ledger | At fill/settlement | C: net PnL |
| full_close_remaining_qty, request_outcome / decimal,enum | Remaining exposure and UNKNOWN states | Fills + native quantity | As-of observation | M after close intent: no unsafe resend |
| modeled_latency_bounds, impact_assumptions/hash / object,string | Counterfactual execution assumptions | Frozen research manifest | As-of modeled T5/T6 | M for modeled executions, never fabricated actual values |

### F. Reconciliation events

| Field / type | Meaning | Source | Timestamp semantics | Required / reason |
| --- | --- | --- | --- | --- |
| reconcile_request_id, sent_at/received_at / strings,timestamps | Independent native query provenance | Position query transport | APP/RX, native as-of if supplied | C: T7 proof |
| native_position_qty, position_mode/side, raw_position_ref / decimal,enums,string | Independent remaining exposure | Native position response/event | EV/ASOF + RX | M for actual flat acceptance |
| flat_confirmed_at, flat_evidence_ids / timestamp,array | Confirmed zero on correct leg/epoch | Independent native zero evidence | APP after evidence | C; modeled flat stored separately |
| reconciled_fill_qty, unresolved_qty, orphan_state / decimals,enum | Conservation and unresolved actions | Native fills + position/journal | As-of reconciliation | M: UNKNOWN stays unresolved |
| native_protection_ids/status, cleanup_requested_at/result / arrays,enum,timestamp,enum | Protection present and later cleanup outcome | Native reads/execution journal | Only after independent flat | C: preserve original SL/TP until actual flat |
| realized_net_total, accounting_status, accounting_evidence_ids / decimal,enum,array | Final/provisional PnL with fees/funding | Native cash-flow reconciliation | Settlement-aware | M: no premature final PnL |
| reconciled_at, incident_reason / timestamp,string | Audit completion/remaining ambiguity | Reconciler | APP | M: lifecycle accountability |

This is a logical evidence contract, not a request to add these as dozens of database columns. Keep large public tape in immutable research storage referenced by hashes; keep private raw evidence encrypted/access-controlled outside Git. Future implementation requires its own scope/retention/privacy/resource review.

## 11. Untouched Holdout Design

**Proposed, not started or frozen as a dataset:** chronological cutoff **2026-10-05T00:00:00Z**, end-exclusive candidate holdout **2026-11-05T00:00:00Z**. This future window is a design reservation only; no automation/collector/test is scheduled by this report.

1. Existing exposed data through this research is development material, including Phase 2's tail. It cannot be relabeled untouched.
2. Before the cutoff, separately approve and hash the data-admission, episode grouping, cost/latency model, native trigger references, policy identity, outcomes and statistical decision plan. **No policy/threshold is selected now.**
3. If collection/validation/policy freeze is not complete before cutoff, this proposed window is NOT a valid final holdout. Choose a newly authorized future cutoff before inspecting outcomes; do not retroactively “freeze.”
4. Development episodes must be fully ended before cutoff. Epochs spanning the boundary are quarantined entirely, not split between folds. All prior inputs used by development remain excluded from final acceptance.
5. Group overlapping exposures, repeated signals, reentries, shared whale/copy lineage and cross-venue correlated time blocks; keep each group on one side. Respect all feature lookbacks/position horizons when purging boundary overlap. No arbitrary embargo number is optimized here.
6. Preserve naturally occurring Long/Short, timeframe and volatility strata. Report missing/sparse strata as unvalidated; never generate trades to fill quotas.
7. Freeze a manifest containing native instrument/epoch keys, exact UTC bounds, source URIs/retrieval times, raw complete-file hashes/checksum sidecars, metadata revisions, gaps/exclusions, parser/protocol/code hashes and split assignments.
8. Seal the holdout before outcomes are shown to parameter selection. Evaluate once under the predeclared plan; new tuning after inspection requires a new future holdout.
9. Sample sufficiency depends on independent episode groups and uncertainty/power, not a convenient trade-count target. If the reserved month lacks required coverage, report insufficient evidence; do not extend it after seeing favorable results without a new preregistered plan.

No current holdout file/hash exists; the report hash freezes this **design**, not future data. No claims of representation or statistical power are made in advance.

## 12. Data Quality Risks

| Risk | Required handling |
| --- | --- |
| Candles conceal within-window order | Use event tape; do not select a favorable OHLC extremum ordering |
| Decimal timestamps/large native IDs | Preserve original strings/units; no JavaScript rounding of IDs or fractional-second native precision |
| Native close semantics | Binance raw inclusive close; MEXC/Gate interpreted window-end boundaries kept distinct from publication/receive times |
| Cross-stream ties | Partial-order ambiguity and sensitivity, not invented event order |
| Packet loss/reconnects | Explicit gap intervals and valid post-gap reinitialization; no retroactive gap healing |
| Official/provider archive revisions | Save retrieval timestamp, complete bytes/checksum and revision identity; freeze exact source edition |
| Book-depth cap/aggregation | Uncovered quantity and within-batch uncertainty veto exact fill claims |
| MEXC tuple/size ambiguity | Validate units against raw sample/spec; no executable-price proof until resolved |
| Gate old/new archive formats | Confirm hourly filename/schema and set/take/make semantics; do not assume CSV deltas are WS absolute updates |
| Last/mark/index confusion | Per-order native reference plus distinct streams; same candle does not cover all triggers |
| Hidden/RPI/internal/ADL liquidity | Normal public book may omit relevant execution; explicitly bound/model or exclude |
| Mutable original risk | Accepted-plan hash; later row SL/TP cannot replace original |
| Funding/accounting timing | Separate indicative rate, applied reference rate and actual signed payment |
| Censored lifecycle/flat | Preserve UNKNOWN and censoring, no false CLOSED |
| Selection/survivorship bias | Retain rejected/gap/delisted episodes and counts; no only-profitable subset |
| Archive time vs local availability | Event-time idealized and receipt-causal analyses labeled separately |
| Market order counterfactual | Historical book does not include our hypothetical impact; no exact actual fill or profitability guarantee |
| Small/concentrated sample | Independent groups, exposed tail rejection, stratified uncertainty |
| Source browsing failures | Tool-inaccessible metadata/portal pages are not evidence data never exists |

No source has been purchased or certified. Sources with old publication dates were used for documented format/access lineage, not asserted as current SLAs.

## 13. What Can Be Proven Today

- The listed local evidence identities are unchanged; Phase 2's report was not rewritten.
- Accepted Binance entry risk/native fill linkage is supported for the prior 117 records; minute research coverage is 112, not executable fast-exit validation.
- A nullable net-peak field exists in the inspected export but is unpopulated; persisted MFE lacks ordered executable peak timestamps.
- Official data documentation provides concrete candidate sources, including Gate historical book/mark/funding formats and MEXC public/private historical routes.
- A current external provider specifically documents Binance, Gate and **MEXC Futures**, not just Spot. Exact cohort coverage remains unverified.
- Missing SignalVerse receipt clocks and nonexistent counterfactual close fills cannot be recovered merely from market candles.
- PHA is not uniquely linked in the inspected evidence.
- The telemetry/join/holdout plan is specified without implementation or rule thresholds.

## 14. What Cannot Be Proven Today

- Exact profit arming/peak/giveback/confirmation times for our historical policy, or the exact native protected trigger ordering.
- Actual executable full-position close price, latency, fee and independently confirmed flat for a never-submitted exit.
- Full uninterrupted market depth/mark/BBO coverage for each Binance/MEXC/Gate epoch.
- Source/provider claims' dated byte-level coverage, entitlement or complete native contract revision history.
- Current live Production database telemetry completeness, account permissions or runtime SHA; none was accessed.
- PHA's exact entry/risk/path/SL/realized result, or that it represents other trades.
- Improved net returns, reduced drawdown, Short/Long effectiveness, supervisor value, calibrated thresholds, Production readiness or transferability between venues.
- A genuinely untouched completed holdout.

## 15. Exact Missing Data

| Blocker | Exact missing evidence |
| --- | --- |
| Cross-venue epoch identity | Private pseudonymous scope, native instrument generation/settlement/mode, durable entry/position IDs and zero-to-nonzero lifecycle |
| Binance executable path | Dated native trade/BBO/depth/mark/index bytes for each epoch, initial snapshots/deltas, sequence/gap validation, sufficient actual-size depth |
| MEXC paired episodes | Accepted original SL/ONE TP/reference, full native entry/exit/funding/fee ledger, as-of contractSize/quantity semantics plus exact archived path |
| Gate paired episodes | Native position/fill/protection/accounting chain, contract multiplier/type and dated valid hourly books/mark/trades/funding |
| Operational chronology | Actual SignalVerse receive timestamps, monotonic ordering, clock-offset/RTT bounds, disconnect/reconnect events |
| Original baseline protection | Accepted native order objects, trigger reference/flags, trigger and fill timestamps, native protection lifecycle |
| Net peak | Ordered comparable quantity-aware net liquidation observations and source IDs; not final MFE |
| Costs | Effective account fees/currency conversion, exact actual signed funding and final fees, full-size depth and calibrated latency/impact bounds |
| PHA | Unique venue/contract/side/time/native order or position reference first |
| Final holdout | Future pre-frozen dataset/split/model/policy manifest and sufficient independent natural strata |
| Actual hypothetical execution | Fundamentally unobservable retrospectively; remains modeled unless a later separately authorized natural actual lifecycle exists |

Do not request credentials to “solve” this research report. Later historical account exports require separate explicit scope, private storage and redaction.

## 16. Minimum Dataset Required Before Phase 4

Phase 4 may proceed only for a venue/cohort that meets a **research data gate**, not simply because an archive exists:

1. Unambiguous accepted original risk/ONE TP, native fills, quantity/mode/specification and epoch/censoring linkage.
2. Raw native trade, mark/index and bid/ask/depth covering initialization through episode end; timestamps/precision, batching and source provenance retained.
3. Sufficient opposing-side depth for actual remaining size; unsupported quantity vetoed, not valued at BBO.
4. No unexplained sequence gaps in admitted decision intervals; every gap/exclusion and data-error rate independently reported.
5. Per-source event and availability semantics established. If our historical RX is absent, admit only a clearly labeled idealized/provider-observer analysis, not a Production-operational claim.
6. Actual fee/funding/multiplier evidence for baseline; conservative frozen hypothetical cost/latency/impact model with explicit uncertainty and competition with original native SL/TP.
7. Zero look-ahead in running peaks, confirmation inputs and observable event delivery; reproducible raw dataset/protocol/code hashes.
8. Genuine untouched future holdout design plus adequate independent naturally occurring coverage.
9. Separate observed versus modeled execution/flat results. Even perfect market data does not make a counterfactual fill a factual exchange outcome.

Current inspected admissible exact-fast-exit episodes: **Binance 0; MEXC 0; Gate 0**. These are zero validated coverage counts, not zero account trades.

## 17. Recommended Data Collection Plan

**Plan only. No collection infrastructure, account query, purchase, scheduler or Production change is authorized or performed.**

| Order | Smallest next separately authorized action | Deliverable / stop gate |
| --- | --- | --- |
| 1 | Resolve native epoch/accepted plan and PHA identity using existing private exports first | Exact instrument/time/risk/fill linkage; ambiguous identity stops |
| 2 | Check official dated coverage for the selected Binance/Gate epochs; use provider Futures archives where official type/retention is insufficient | Per-symbol/day/channel inventory, access terms, native sample schema and hashes; no assumption of entitlement |
| 3 | Validate a bounded historical sample before bulk purchase/download | Snapshot/delta continuity, units, receipt semantics, native trades/funding cross-check; failure stops expansion |
| 4 | Freeze supported resolution and quantity bounds per venue | Document observed vs modeled components and censor invalid intervals |
| 5 | Specify and separately authorize future append-only telemetry for natural existing-system episodes | Contract from section10; private evidence outside Git; no scanner/order/SL/TP change |
| 6 | Pre-register an actually future untouched holdout before outcome access | Exact window/grouping/source/quality/cost/policy hashes; not the exposed September tail |
| 7 | Re-audit the minimum dataset gate | Only then consider a separately approved Phase 4 causal research task |

Official Gate files may avoid a paid provider for some types; Binance L2 entitlement may require approval; MEXC's inspected official routes do not expose arbitrary historical books, so provider validation or future capture is the realistic route. Source accessibility is a data task, not permission to change adapters.

Natural future telemetry can observe actual existing lifecycles and later evaluate hypothetical intents in research. It must not manufacture trades, close positions, alter native protection or invoke paid AI to create evidence.

## 18. Research Go / No-Go Decision

**Overall selection: B. Partial foundation and credible acquisition paths; collect and certify the specified missing evidence first.**

- Phase 4 parameter research now: **NO-GO**.
- Phase 2 conclusion: **MORE DATA REQUIRED**, preserved.
- Improvement proven: **NO**.
- Production readiness/profit protection effectiveness: **NOT PROVEN**.
- PHA reconstruction: **NOT POSSIBLE WITH CURRENT DATA**.
- Exact causal executable historical validations: **0**.
- Application/Strategy/Engine/Spot/Demo/Simulator/Scanner/adapter/SL/TP changes: **NONE**.
- Production/DB/schema/migration/deploy/service/configuration changes: **NONE**.
- Orders/position/exchange actions: **0**.
- Application Git commit/push/main change: **NONE**. Report-only AI-Log publication is separate; final delivery must include the verified publication SHA/link.
- Checks: bounded local JSON inventory/identity/fingerprints and public primary-document research; no build, integration test, parameter replay, historical archive ingestion, account test or Production inspection.
- Remaining limitation: archived market causality can become testable after acquisition/validation, but exact counterfactual real fills and historical unrecorded SignalVerse receipt times do not become factual.

DATA PARTIALLY SUFFICIENT — collect specified missing data first
