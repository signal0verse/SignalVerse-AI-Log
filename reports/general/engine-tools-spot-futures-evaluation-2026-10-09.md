# Engine tools inventory and separate Spot/Futures evidence — 2026-10-09

## Metadata

- Date: 2026-10-09.
- Task: owner-supplied missing-tools inventory; separate Spot and Futures research.
- Mode: isolated local historical paper replay, public market data only.
- Repository: SignalVerse-Main; detached research checkout at `61280af0f123fe8d6bbfb4afe7e0cb6a7d238c91`.
- Starting/ending application commit: identical. No application commit, push, CI or deployment.
- This is the source SHA last observed as runtime in the previous task at 2026-10-09T11:49:02Z. No VPS access or new runtime verification in this task.
- Remote main observed at task start: `c68a5709c0cbec0cef9420e09c405227cece87e1`. Primary local HEAD: `0dbca62357a4adf34240f40ceda3e387356ec4b0`; pre-existing dirty work preserved.
- Frozen protocol SHA-256: `b86275afff29d4b0dddc431d1de87ca04596801582a8eae2b0467a1f6a4eb45b`.

## Objective / executive result

Owner asked to inspect the tools in the supplied Word/image, compare with existing engines, test Spot and Futures independently and report whether trades improve.

نتیجه: اضافه‌کردن مجموعهٔ این ابزارها به خودی خود بهتر نشد. اسپات بهبودی نشان نداد. فیوچرز برای فاندینگ فقط یک نشانهٔ کوچک و متمرکز روی سولانا نشان داد؛ هیچ تغییر معاملاتی برای Production پذیرفته یا اعمال نشد.

```text
ENGINE_TOOL_AUDIT=COMPLETED
SPOT_PILOT=COMPLETED
FUTURES_PILOT=COMPLETED
ALL_PROPOSED_TOOLS_BACKTESTED=NO
SUSTAINABLE_IMPROVEMENT_PROVEN=NO
PRODUCTION_STRATEGY_CHANGED=NO
```

Read separate detailed results: [Spot](../spot/spot-engine-tools-evaluation-2026-10-09.md), [Futures](../futures/futures-engine-tools-evaluation-2026-10-09.md), [exact metric/data/hash evidence](engine-tools-research-evidence-2026-10-09.json).

## Scope and safety

Only source inspection, a new isolated research directory, public historical GET capture, offline replay, tests and reports. No application/strategy/entry/exit/risk/SL/TP change. No credentials or private account data. No production/database/service/worker/PP-flag action. No orders, positions or exchange-account API calls. Public market-data GETs are not zero: 84 capture requests plus two endpoint probes. Application code was NOT changed; experimental admission filters exist only in the research runner.

All tests are offline after capture: global fetch throws; API handlers are not imported. Existing TypeScript AST isolation executes actual pure engine/simulator declarations, replacing only data/context boundaries and the experimental admission hook. This does not prove full live path parity.

## Source document and interpretation

The supplied DOCX was fully extracted with python-docx using the documents skill and compared with the supplied table image. Document SHA-256: `b60ca148b4e1c4a1168578d5989e2333191833142247dd24d7977e6b0388189b`. Its architecture recommendations are hypotheses/source material, not authority to rearchitect or activate anything.

## Inventory: what exists vs what this pilot can actually prove

Source inspection is limited to the frozen standard entry/discovery/risk paths, not an assertion that a term cannot exist in unrelated modules.

| Tool category | Actual existing source evidence | Spot assessment/test | Futures assessment/test |
|---|---|---|---|
| MA/EMA/MACD/RSI/Stoch/BB | Shared indicators and confluence already exist | Baseline accumulation indicators retained | Existing directional votes retained |
| ATR / volatility | ATR in indicators, ladders and SL/risk | ATR shock veto tested; no effect | ATR shock veto tested; one Q1 SOL improvement, no Q2 effect |
| Support/resistance / structure | Spot horizon-aware map/ladders; Futures nearest levels recorded | Baseline actual structure retained | Opposing-room admission veto tested; near-total suppression, not accepted |
| OB / FVG | Spot map/ladders use structural sources; Futures detects/reports OB/FVG with smcDecisionWeight=0 | Existing logic, not a new OB/FVG profitability proof | No separate causal OB/FVG alpha proved |
| Open Interest | Discovery normalizes OI and changes; auto-candidate quality requires current OI evidence | No native Spot OI; derivative overlay not tested | Document's blanket “missing engine” claim is outdated at scanner layer; no adequate 2025 OI replay tape captured |
| Funding | Discovery directional crowding modifier and extreme-funding blocker already act on candidates | Not native Spot carrying cost; not tested as derivative-context overlay | Last earlier settled-rate veto tested; weak SOL-only benefit |
| Liquidation flow | Gate discovery has contract-stats liquidation mapping; Binance provider returns null; metrics alone are not a full signal | NOT_TESTED | No Binance historical liquidation tape in pilot; NOT_TESTED |
| Order flow / CVD | Standard candle input does not carry a full tick-derived CVD tape | Native bar taker-delta overlay tested; worse net | Same overlay on chosen interval; worse net |
| Order book | Depth reads in execution/PP-related paths do not establish ordinary entry alpha | No sequenced historical L2 tape; NOT_TESTED | Same; no synthetic OHLC “book” |
| Liquidity / spread / impact | Discovery spread and turnover gates, execution feasibility exist | Explicit fee/impact assumptions; no queue simulation | Spread gating already exists in scanner; fee/slippage stress tested, L2 impact alpha NOT_TESTED |
| Basis | No proven dedicated basis factor in inspected standard entry path | Context overlay NOT_TESTED | Same-close daily Futures/Spot premium proxy tested; explicitly NOT mark/index or dated-future basis |
| Cross-exchange | Separate adapters/normalization, not a synchronized cross-venue entry factor | NOT_TESTED | Binance only; no Gate/MEXC comparison |
| Positioning / long-short ratio | Discovery “positioning” derives OI/price agreement, not automatically account long/short statistics | NOT_TESTED | Full long/short-ratio history NOT_TESTED |
| Options IV / skew / gamma | No validated options surface driving these inspected entry paths | NOT_TESTED | NOT_TESTED; unrelated prediction-market “gamma” is not evidence |
| Volume profile / value area | SR/OB/FVG are not volume-at-price distributions | No transaction-price/volume tape; NOT_TESTED | Same; no fabricated profile from OHLC |
| Cross-asset | Existing MarketRegime includes BTC EMA distance, ETH/BTC, dominance, breadth, stablecoin context | Additional simple BTC EMA200 admission tested; no improvement | Same; no improvement. DXY/Gold/Nasdaq full layer not proved |
| Event / macro | News UI/ingestion is not proof of causal event surprise in engine decisions | No timestamped release-vintage tape; NOT_TESTED | Same |
| Execution intelligence | Existing adapters/feasibility are not proof of native TWAP/VWAP schedule optimization | NOT_TESTED | NOT_TESTED |
| Model ensemble | Existing confluence and AI Supervisor are not a trained independent statistical ensemble | No new model or training | No new model or LLM calls |
| Risk overlay | Existing capital/leverage/liquidation limits and optional drawdown throttle | Only ATR admission overlay studied; no risk-policy change | Same; correlation/exposure optimizer NOT_TESTED |

Key inspected anchors: `api/_shared/futures-decision-engine.ts` (structure at 374–375; smcDecisionWeight at 518), `futures-indicators.ts::buildFuturesTimeframeInput`, `futures-risk.ts`, `futures-market-discovery.ts` (OI 380+, funding 463–495, spread rejection 567+, crowded funding 621), `futures-auto-candidate-quality.ts` (15–16), `futures-discovery-data.ts::oiHistoryFor` (461+), `api/copytrade.ts` (Spot market map/regime/aggregate exits; runSimulation 13120; runSpotSimulation 13970), `api/analyze.ts`.

## Public evidence and acquisition

Native Binance Spot and USD-M REST kline fields preserve exchange close-time and taker-buy base volume; this permits bar-aggregated delta, not tick CVD or orderbook reconstruction. Binance documents those native fields and separately warns that Spot archive timestamps from 2025 can be microseconds. This capture used REST and validated milliseconds; it did not mix archive units. [Binance public-data specification](https://github.com/binance/binance-public-data/blob/master/README.md).

Official OI statistics REST history is limited to the latest month; it cannot supply this 2025 experiment today through that endpoint. This is not a claim that an independently audited archive/vendor is impossible. The actual paired daily price premium here is not the official basis series. [Binance market-data reference](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data).

- Capture started 2026-10-09T12:24:41.964Z; completed 2026-10-09T12:25:11.017Z.
- 18 public data files; 74955 total rows including funding; 84 bounded capture requests.
- Native kline close = open + timeframe duration - 1 ms; exact interval/gap and taker-volume checks.
- Data source/URL/row counts/checksums retained in capture receipt; public inputs only.
- No present-day book/OI snapshot was relabeled as historical evidence.

## Experimental contract

Fixed before bulk capture/result inspection: BTC/ETH/SOL; Q1 and Q2 2025; no threshold optimization. Baseline plus:

- Delta: sum(2 × native taker-buy-base − base volume) over last four closed chosen-interval bars must align with direction.
- Volatility: ATR14/close no more than twice median previous 60 ATR14/close values.
- BTC: direction aligned with last closed Spot BTC daily close vs EMA200.
- Combined: conjunction of those three, not an optimized ensemble.
- Futures structure-room: nearest opposing existing structural level distance divided by original stop distance at least 1.9; unknown denies.
- Futures funding: last strictly earlier settled rate, maximum age 12h, direction × rate no greater than 0.0001. NOT a future funding forecast.
- Futures daily premium: synchronized closed daily Futures/Spot close ratio minus one, direction × premium no greater than 0.001. NOT actual intraday basis.

Every unavailable feature denies that experimental candidate; no guessed data. Thresholds define illustrative, falsifiable pilot hypotheses, not calibrated best parameters. Missing tools were explicitly excluded rather than “passed” through proxies.

## Condensed paired result

| Market | Baseline summed terminal MTM net | Combined filters | Incremental result |
|---|---:|---:|---:|
| Spot | +23.8660 USDT | -24.4203 USDT | -48.2863 USDT |
| Futures | +64.7397 USDT | -386.0962 USDT | -450.8359 USDT |

These sum two independently reset quarterly runs. They are not live account profit or a compounded six-month return. Starting capital differs (Spot 3,000; Futures three separate 10,000 sleeves). Baseline CLOSED net is +31.5192 Spot and -1.6021 Futures; do not present marked unrealized gains as realized profit.

Funding-only Futures +99.4266 marked net vs baseline +64.7397; increment +34.6869, all SOL, only +0.2304 in Q2. This does NOT establish robust incremental edge. Spot best additional arm (ATR) merely equals baseline and never vetoes.

## Actions / files changed

No tracked application source changed. New isolated research files: `research/engine-tools/{protocol.json,capture.mjs,capture.json,core.mjs,core.test.mjs,run.mjs,summarize.mjs,spot-results.json,futures-results.json,summary.json,data/*.json}`. Three report Markdown files plus the report-only JSON evidence and an isolated HANDOFF note. Primary dirty HANDOFF and unrelated private/untracked work untouched. No strategy-history amendment because no strategy change was applied.

## Reproduction and evidence

Local research root: `C:/Projects/SignalVerse-Main/tmp/engine-tools-research-20261009/research/engine-tools`.

Retained: frozen `protocol.json`, public-only `capture.json` with every URL/row-count/checksum, 18 raw JSON captures, `core.mjs`, `capture.mjs`, `run.mjs`, `core.test.mjs`, `summarize.mjs`, both result JSONs with decision/feature timestamps and actual simulated trade/fill evidence, and `summary.json`.

The sanitized [machine-readable summary](../general/engine-tools-research-evidence-2026-10-09.json) contains exact per-arm/per-fold/per-symbol metrics, Long/Short and timeframe breakdowns, source/data receipts and file hashes. Raw captures and executable research code stay local; AI-Log receives reports only.

Node executable: `C:/Projects/SignalVerse-Main/tmp/pp-bootstrap-node22-20261002/node-v22.23.3-win-x64/node.exe` (v22.23.3). From the isolated checkout:

```text
node --test research/engine-tools/core.test.mjs
node --test scripts/historical-point-in-time-test.mjs
node scripts/historical-simulation-timing-test.mjs
node research/engine-tools/run.mjs spot
node research/engine-tools/run.mjs futures
node research/engine-tools/summarize.mjs
git diff --exit-code -- api server src migrations ops deploy .github
git diff --check
```

Custom checks 22/22; existing point-in-time 31/31; existing simulator timing integration 16/16: total 69/69 PASS. These are engineering/temporal checks, NOT 69 profitable trades. Raw data hashes and native close-time arithmetic/gaps validated. All research .mjs syntax checks PASS. Protected application paths have zero diff. Web/Admin build not run: no application/UI files changed. Official CI not invoked.

## Development failures recorded

Initial research-only Spot accounting parser stopped on native aggregate fill labels; updated to the existing labels/portion semantics and reran all cases. Initial custom test import used a nonexistent builder name; corrected to the existing export. One ad-hoc console-summary expression had a parenthesis syntax error and was rerun corrected. None changed engine code, thresholds or tests to force profitable output.

## Build / Git / publication

No application build or official CI: app sources untouched. Research syntax checks and protected-path zero diff PASS. Application commit=NONE; application push=NO. Reports only are published to AI-Log/master under the standing AGENTS instruction; publication commit and verified remote links are returned with completion. No claims of publication until remote verification.

## Risks / limitations

- Exploratory January–June 2025 Binance-only BTC/ETH/SOL pilot, not the user's accounts or actual Production trades, not MEXC/Gate validation, not a small-cap universe.
- Q1 and Q2 are separately reset quarterly runs. Their net sums are NOT one continuously compounded six-month portfolio. Same universe/thresholds, no tuning after results. Both periods were examined; Q2 is a chronological second fold, not a prospective or permanently untouched holdout.
- Macro regime gate is disabled equally, stablecoin context is null, AI is omitted, universe is fixed (not the live Auto Scanner). No claim of complete Production strategy parity. Existing source features do not by themselves prove contribution to live profit.
- Multi-arm comparisons, only three convenient surviving large-cap assets, sparse Spot closures and no statistical significance/power proof. Funding's small edge is concentrated in one coin. No deployment recommendation follows.
- Historical REST data fetched today is not a historical receipt-time archive. Strict native bar-close filtering prevents future-bar use but does not prove instantaneous publication latency at an exchange boundary.
- Daily/4h OHLC cannot establish intrabar queue/latency/fill order. Spot uses the existing buy-then-aggregate-exit bar model, which can be optimistic on a bar touching both. Futures uses existing conservative bar rules and original risk gates. Costs are explicit assumptions, not the owner's actual fee tier.
- Open positions are marked to market, never counted as closed wins or forcibly liquidated at a future TP. Marked gains are not realized profit and exclude hypothetical terminal liquidation costs.
- No all-timeframe/high-frequency claim: Spot is daily accumulation; Futures engine chooses 15m/1h/4h/1d inputs but its existing simulator evaluates daily and fills on 4h bars.
- Existing Spot simulator requests only 220 warm-up daily bars per fold. This does not supply the full long-horizon Market Map history (minimum 400 for the long layer); that context is incomplete in this pilot, not silently certified as full live-engine parity.
- No historical L2 queue, liquidation tape, long/short ratio, point-in-time options surface, synchronized multi-venue tape, volume-at-price trade tape or macro publication-vintage feed was validated. Those proposed tools remain NOT_TESTED; OHLC proxies are not substitutes.

## Recommended next step

Do not add all layers or change production based on this list. Preserve both engines. If further research is requested, pre-register a wider multi-regime/native-data test of the narrow funding hypothesis and collect/validate missing point-in-time tapes first. Keep Spot and Futures independently evaluated. The simple delta/combined filters tested here should not be promoted; a failing simple filter does not prove the whole data family useless.

```text
PRODUCTION_CHANGE=NO
APPLICATION_CODE_CHANGE=NO
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
DEPLOYMENT=NO
DATABASE_MUTATION=NO
WORKER_START=NO
PRIVATE_EXCHANGE_CALLS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_TP_ACTIONS=0
IMPROVEMENT_PROVEN=NO
```
