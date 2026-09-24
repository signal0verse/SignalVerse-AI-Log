# Real Futures strategy audit — Stage 1 candle correctness and decision impact

## Metadata

- Date: 2026-09-25 (Asia/Kuala_Lumpur); evidence collected 2026-09-24 16:06–16:17 UTC.
- Module: Production Real Futures copy-trade strategy; Stage 1 only.
- Mode: read-only Production/source audit and isolated public-data historical replay.
- Application repository branch/HEAD: `codex/production-deploy-control-20260924` / `c56aee13b46199b0b101c1db86df8c8c07091bdf` (not changed).
- Production marker and app/admin symlinks at 2026-09-24 16:14:17 UTC: `85aedfb944a67c94227ac343e911bc64a581e79e`. `signalverse.service`, `signalverse-admin.service`, and `signalverse-observer.service` were active, each with `NRestarts=0`. An initial check accidentally queried nonexistent `signalverse-main.service`; the correct units were subsequently checked. No service action was taken.
- Former isolated observer source: `cbc64240002d7b491774aafbfa5d650cd9460956`, not the above Production runtime.

## Objective and scope

The owner locked evaluation order: data/candles; then strategy structure; then risk/exit; then AI Supervisor outcome; then paired baseline versus candidate by Long/Short × timeframe. Production Strategy, Spot and Demo Futures remain unchanged. Guard is only a release-control blocker, not a strategy improvement. No order, private account/API-key access, Production DB write, deploy, service restart, or application-code change was authorized or performed.

## Evidence and method

- The frozen 24-hour observer ledger `/var/lib/sv-futures-shadow-20260922/events.jsonl` was copied read-only into an ignored local audit artifact. Its SHA-256 was `b05ba2866f60fab919150418d01ba4a657b94f176bbc836310f25ce54e0cd4e1`, matching the previous final audit. The previous 24-hour Shadow verdict remains permanently **FAIL**; this report does not alter it.
- The frozen runner at `tmp/futures-shadow-20260922/runner.mjs` caches each symbol/timeframe under `Math.floor((decisionTime - 1) / timeframeMs)` (line 75). At an exact close boundary, that key can equal the preceding tick's key; the previous-period 250-bar input is reused. The runner records bar close boundary and hash (lines 97, 126).
- A new isolated local audit script, `tmp/futures-shadow-paired-audit-20260925.mjs`, issued exactly 24 public Binance Futures historical Kline GETs (six symbols × four timeframes). No credentials or writes were used. It reconstructed every recorded 250-bar input from the historical raw OHLCV, verified all 2,304 bar-window SHA-256 hashes (576 ledger events × four timeframes; **zero mismatches**), and reproduced the recorded baseline Engine decision/score/chosen timeframe for every affected event (**zero mismatches**). It then replaced only stale inputs with the latest candle fully closed at each decision time, using the same frozen indicator and Engine modules and the same account/context parameters. Thus the directional deltas below are a paired *observer* counterfactual, not inferred from bar timestamps alone.
- Historical candles were queried with an end time before the last observed decision; each replayed 250-bar window was cut at its own original/canonical close boundary. No future candle was admitted. The exact hash parity supports historical-data equivalence for this replay.

## Stage 1 results

Window: 2026-09-22 07:30:00 UTC to 2026-09-23 07:30:00 UTC, end-exclusive. The ledger contains 96 decision times × six symbols = 576 events. The old observer had 186 stale **symbol × timeframe inputs** at 24 hourly decision times: 1h=144, 4h=36, 1d=6, 15m=0. These belong to 144 affected **symbol × decision** events, not 186 trades.

| Symbol | Affected events | Stale 1h | Stale 4h | Stale 1d | Recorded LONG/SHORT/WAIT | Decision changes after correction |
|---|---:|---:|---:|---:|---:|---:|
| BTC | 24 | 24 | 6 | 1 | 8 / 2 / 14 | 0 |
| ETH | 24 | 24 | 6 | 1 | 5 / 2 / 17 | 0 |
| SOL | 24 | 24 | 6 | 1 | 9 / 1 / 14 | 2 |
| BNB | 24 | 24 | 6 | 1 | 3 / 6 / 15 | 2 |
| XRP | 24 | 24 | 6 | 1 | 9 / 0 / 15 | 5 |
| UNI | 24 | 24 | 6 | 1 | 9 / 3 / 12 | 7 |

- **16/144** affected observer decisions changed after only the closed-candle correction. Two were direct LONG↔SHORT flips: BNB at 2026-09-22 17:00 UTC changed SHORT/1h/score −4 to LONG/15m/score +4; SOL at 2026-09-23 02:00 UTC changed LONG/1h/+4 to SHORT/15m/−4. The other 14 were trade↔WAIT transitions. Among affected events, chosen timeframe changed in 18 and setup values changed in 25; setup change does not imply an executed trade.
- At the 2026-09-23 00:00 UTC boundary all six symbols had stale 1h, 4h and 1d inputs; SOL changed WAIT→LONG and UNI changed LONG→WAIT under paired replay.
- The original structural observer was public-data-only, had no LLM, no exchange order/fill, no private account state, and null macro/stablecoin context. Therefore these deltas prove the defect can directly change a decision in that **observer**, not that 16 Production orders were altered or that the corrected choices earned more money.

## Separate Production-input finding

At exact active Production SHA `85aedfb...`, `api/copytrade.ts` `fetchRealBinanceContractCandlesAt` (around line 11644) queries `/fapi/v1/klines` with `limit=250` but no decision-time/end-time closed-bar constraint and maps the response without using its close-time field. The MEXC native Kline path likewise does not discard a still-forming last row. `buildFuturesProTimeframeInputs` (around line 11752) immediately computes indicators from all fetched rows, takes the last row's close as price, and supplies its last 20 bars to `api/analyze.ts`. `computeShadowEngineState` (around line 2172) scores the supplied indicators and selects the best timeframe. The Real `futures-pro-analyze` path obtains these server-side native inputs through `loadRealFuturesMarketInputs` (around lines 3595, 4761); this is not the frozen observer cache implementation.

**Confirmed from code:** there is no explicit fully-closed-candle filter or freshness validation in that live native input builder before indicators/decision. **Not yet proven from live decision telemetry:** the exact number of live Real decisions that actually included a forming bar, or whether one changed a submitted trade. This separate risk needs a timestamped, read-only production decision/input audit before any claim about actual account impact. Binance's public Kline format includes both open time and close time, so close-time validation is possible. MEXC semantics require exchange-specific verification rather than assuming Binance timing.

## Tests, changes and limits

- Tests: 24 public historical GETs; 2,304/2,304 recorded bar hashes match; affected baseline Engine parity 144/144; stale-input count 186; paired decision changes 16; direct side flips 2. Local script exited 0.
- No application file, Production setting, service, strategy, Spot, Demo, DB, exchange account, or frozen ledger/runner was changed. The only new file outside this report is an ignored local audit script; the copied ledger is an ignored local test artifact and is not published.
- No profitability, Net Return, Drawdown, fee/funding, AI Supervisor value, or real-account execution result follows from this structural replay. Do not label this Stage 1 evidence as strategy-improvement `YES`.
- The corrected short boundary test from 2026-09-24 remains a separate PASS for naturally exercised candle boundaries only. It neither repairs the failed historical 24-hour run nor validates this live Production input path.

## Next gate

Complete Stage 1 by (a) read-only linking actual Real decision timestamps to native input close timestamps, including Binance and MEXC separately, and (b) preparing a strictly isolated closed-candle baseline/candidate comparison with the exact Production Engine and point-in-time data. Only after candle provenance is established should Stage 2 evaluate Trend/Structure, S/R, OB, FVG and entry quality; then Stage 3 risk/exit with fees/funding and Long/Short by timeframe; then Stage 4 AI Supervisor incremental effect; then Stage 5 same-condition net comparison. Production Strategy remains unchanged unless stable economic improvement is proven and the owner separately approves a release.
