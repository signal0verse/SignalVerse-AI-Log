# Real Futures Stage 1A — actual Production candle provenance

## Metadata and scope

- Date: 2026-09-25 Asia/Kuala_Lumpur; audit 2026-09-24 16:17–16:35 UTC.
- Mode: read-only examination of existing decision capture, schema, telemetry and active-SHA source. No Production DB query or write, exchange call, order, service, application code/config, Spot, Demo, Guard, main push or deployment.
- Last read-only Production marker/app/admin symlink check immediately before this task: `85aedfb944a67c94227ac343e911bc64a581e79e` at 2026-09-24 16:14:17 UTC. No new deployment claim.

## Executive result

**REAL_DECISION_CANDLE_LINKAGE = NOT_AVAILABLE**

**STAGE1A = BLOCKED**

Actual Real decision records do not preserve the exact native candle they consumed or its close time. Neither a SAFE_CLOSED nor FORMING_BAR classification can be proven for an actual Production decision. The former isolated Shadow result (186 stale inputs, 16 changed observer decisions, two side flips) is not Real Production evidence and was not used to estimate impact.

## Sources inspected and findings

- Existing Production DB capture `tmp/admin-futures-audit-20260920/decisions.json` and PostgREST `schema.json`, captured 2026-09-20 13:10:03 UTC: 12,076 Futures/Real-mode decision rows dated 2026-08-22 to 2026-09-20. Rows have `created_at`, symbol and interval, but no exact decision-computation time, exchange column, selected native candle open/close, raw response timestamp or per-timeframe input snapshot. All captured `multi_timeframe` objects contain only `alignment` and `alignedCount`. This historical capture does not count decisions after 2026-09-20.
- `migrations/engine_decisions.sql` and later migrations: no per-input candle timestamp columns. `created_at` is an insertion time after computation and cannot stand in for `decision_time`.
- `api/analyze.ts` (`TFInput`, `buildFuturesDecisionRow`, `loadRealFuturesMarketInputs`, persistence and GitHub Engine event): transient `last20` candle data reaches the Engine, but selected candle timestamp and native close time are not persisted/logged with the decision. The GitHub event timestamp is generated after analysis. `cpr.sourceCandleTime` is only separate CPR context, not provenance for each scored timeframe.
- `api/copytrade.ts`: Binance `/fapi/v1/klines` fetch maps array fields 0–5 but discards native close time at index 6; MEXC contract `/api/v1/contract/kline/{symbol}` maps `data.time[i]` seconds to candle `t` milliseconds. `buildFuturesProTimeframeInputs` uses the fetched rows but does not persist the selected native row/close boundary with the Real decision. Later pending/trade records can link some decisions to a venue, but cannot reconstruct the exact mutable native candle seen at analysis time.
- MEXC contract REST describes `data.time[]` as the time window; the same official contract Kline WebSocket documentation explicitly identifies `t` as the window start in seconds. The REST response has no separate native close-time field. The app maps 15m→Min15, 1h→Min60, 4h→Hour4, 1d→Day1 and 1w→Week1; any derived end-exclusive boundary would require the **captured selected native window start**, which is absent. [MEXC contract API documentation](https://mexcdevelop.github.io/apidocs/contract_v1_en/).
- The historical isolated Shadow ledgers have public-observer candle timestamps but are not actual Real decisions. No current exchange query can prove which historical, potentially forming row a past Production analysis consumed.

## Binance and MEXC evidence table

These are missing-linkage rows, not fabricated individual decisions:

| Exchange | Symbol | Timeframe | decision_time | candle_open_time | candle_close_time | Classification | Source/evidence |
|---|---|---|---|---|---|---|---|
| Binance | Present in captured decisions but venue not reliably attributable | Selected interval exists | Missing; `created_at` is later | Missing with decision | Native `k[6]` discarded/not persisted | UNKNOWN | Capture/schema; `api/copytrade.ts` native Kline mapping; `api/analyze.ts` row/log builder |
| MEXC | Present in captured decisions but venue not reliably attributable | Selected interval exists | Missing; `created_at` is later | Selected native `data.time[i]` missing | No separate REST close field; selected window boundary missing | UNKNOWN | Same sources; MEXC official Kline semantics |

## Counts and exact blocker

| Measure | Result |
|---|---:|
| Historical actual Real-mode decision rows inspected for requisite fields | 12,076 |
| Actual Real decisions verified against native candle | 0 |
| Binance venue-verified, classifiable decisions | 0 |
| MEXC venue-verified, classifiable decisions | 0 |
| SAFE_CLOSED | 0 verified, not proof of absence |
| FORMING_BAR | 0 verified, not proof of absence |
| UNKNOWN | 12,076 in the historical capture |
| Forming-bar percentage | Not calculable |
| Earliest/latest confirmed forming-bar time | Not available |
| Confirmed affected symbols/timeframes | Not available |

The historical Binance/MEXC split is itself not reliable because those captured decision rows lack exchange and source provenance. The exact missing fields **per decision and scored native timeframe** are: immutable decision ID; exchange; symbol; timeframe/native interval; precise time the input was selected/scored and decision computed; selected native candle open time; Binance native close time (`k[6]`) or MEXC selected native window start plus exact interval/boundary convention; source basis and ideally a response snapshot/hash. This is a data requirement, not authorization to instrument Production in this task.

**IMPROVEMENT PROVEN = NO**

**PRODUCTION STRATEGY CHANGED = NO**

No later strategy stage was begun. The full local report is at `reports/futures/real-futures-strategy-stage1a-real-candle-provenance-2026-09-25.md` in the application workspace; this publication is a sanitized work-log copy.
