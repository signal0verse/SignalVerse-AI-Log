# Spot — missing-tools historical research, separate result

## Metadata

- Date: 2026-10-09.
- Task: owner-supplied missing-tools inventory; separate Spot and Futures research.
- Mode: isolated local historical paper replay, public market data only.
- Repository: SignalVerse-Main; detached research checkout at `61280af0f123fe8d6bbfb4afe7e0cb6a7d238c91`.
- Starting/ending application commit: identical. No application commit, push, CI or deployment.
- This is the source SHA last observed as runtime in the previous task at 2026-10-09T11:49:02Z. No VPS access or new runtime verification in this task.
- Remote main observed at task start: `c68a5709c0cbec0cef9420e09c405227cece87e1`. Primary local HEAD: `0dbca62357a4adf34240f40ceda3e387356ec4b0`; pre-existing dirty work preserved.
- Frozen protocol SHA-256: `b86275afff29d4b0dddc431d1de87ca04596801582a8eae2b0467a1f6a4eb45b`.

## Executive result

بهبود معاملات اسپات در این آزمایش اثبات نشد. نسخهٔ پایه از فیلترهای اضافه‌شده بهتر یا برابر بود؛ عدد مثبتِ پایان دوره به‌تنهایی به معنی سودآوری پایدار نیست.

```text
SPOT_RESEARCH=COMPLETED_LIMITED_PILOT
SPOT_IMPROVEMENT_PROVEN=NO
PRODUCTION_STRATEGY_CHANGED=NO
```

## Scope and safety

Only source inspection, a new isolated research directory, public historical GET capture, offline replay, tests and reports. No application/strategy/entry/exit/risk/SL/TP change. No credentials or private account data. No production/database/service/worker/PP-flag action. No orders, positions or exchange-account API calls. Public market-data GETs are not zero: 84 capture requests plus two endpoint probes. Application code was NOT changed; experimental admission filters exist only in the research runner.

All tests are offline after capture: global fetch throws; API handlers are not imported. Existing TypeScript AST isolation executes actual pure engine/simulator declarations, replacing only data/context boundaries and the experimental admission hook. This does not prove full live path parity.

## Method / implementation

Actual source chain: `api/copytrade.ts::runSpotSimulation → computeSpotMarketMapFromCandles → computeSpotAccumulationVerdict → decideSpotScenario → computeHorizonAwareSpotLadders → evaluateSpotAggregateExit`, extracted by `scripts/lib/actual-futures-core.mjs`. Only an OPEN admission can be vetoed by the research arm; all ladders, exits and risk rules remain the existing core. No Futures short/leverage model is transplanted into Spot.

Native Binance Spot daily BTCUSDT/ETHUSDT/SOLUSDT bars. Q1: Jan 1 to Apr 1 terminal mark; Q2: Apr 1 to Jul 1 terminal mark, UTC. 1,000 USDT per coin (3,000 total) at each reset; scenario allocation 10/20/35/35 and ladder allocation 10/20/35/35; no compounding. Fees 0.10% per fill plus 0.02% notional impact charged as a cost, not a queue model. Fully closed daily bars only. ATR, delta and BTC filters are the same pre-registered definitions in the master report; perpetual funding/basis/OI are not falsely treated as native Spot fields.

Important accounting correction exists ONLY in the reporting harness: the existing simulator's terminal `finalEquity` includes projected future-TP liquidation of remaining inventory. It is NOT accepted as achieved profit. Cash/quantity are reconstructed from actual reported buy/sell fills, per-leg cost deducted, remaining inventory marked using the last available closed Spot price. Aggregate TP1 sells half remaining inventory; TP2 sells the balance. Closed net and terminal quantities reconcile to the actual simulator. No application fix was made.

## Results — net includes remaining-inventory MTM

| Research arm | Q1 net (USDT) | Q2 net (USDT) | Sum of reset folds | Closed records | Closed net only |
|---|---:|---:|---:|---:|---:|
| Baseline | -7.6532 | 31.5192 | 23.8660 | 8 | 31.5192 |
| Native taker-delta | -31.2967 | 13.7167 | -17.5800 | 4 | 13.7167 |
| ATR shock veto | -7.6532 | 31.5192 | 23.8660 | 8 | 31.5192 |
| BTC EMA200 alignment | -7.6532 | 4.8051 | -2.8481 | 2 | 4.8051 |
| Delta + ATR + BTC | -29.9661 | 5.5459 | -24.4203 | 0 | 0.0000 |

Capital differs from Futures; do not compare the dollar totals across markets as equal-sized strategies. Baseline total closed net is +31.5192, while the sum of terminal marked nets is +23.8660 because Q1 still carries unrealized loss/cost. The combined arm has zero closed trades; its Q2 positive mark is not a win.

| Arm | Fold | Daily MTM max DD % | Closed win rate % | Closed PF | Open at end | Offered / admitted / vetoed |
|---|---|---:|---:|---:|---:|---|
| Baseline | Q1 | 2.1386 | N/A | N/A | 3 | 4 / 4 / 0 |
| Baseline | Q2 | 0.3803 | 100.0000 | N/A | 0 | 11 / 11 / 0 |
| Native taker-delta | Q1 | 1.1337 | N/A | N/A | 2 | 37 / 3 / 34 |
| Native taker-delta | Q2 | 0.1984 | 100.0000 | N/A | 0 | 28 / 5 / 23 |
| ATR shock veto | Q1 | 2.1386 | N/A | N/A | 3 | 4 / 4 / 0 |
| ATR shock veto | Q2 | 0.3803 | 100.0000 | N/A | 0 | 11 / 11 / 0 |
| BTC EMA200 alignment | Q1 | 2.1386 | N/A | N/A | 3 | 6 / 3 / 3 |
| BTC EMA200 alignment | Q2 | 0.0000 | 100.0000 | N/A | 0 | 46 / 4 / 42 |
| Delta + ATR + BTC | Q1 | 1.1337 | N/A | N/A | 1 | 58 / 1 / 57 |
| Delta + ATR + BTC | Q2 | 0.4830 | N/A | N/A | 1 | 45 / 2 / 43 |

PF=N/A where there are no losing closed records (including no records); not proof of infinite profitability. Baseline 100% win rate in Q2 means eight closed accumulation records, while Q1 had no closed trades. This is heavily affected by held/unclosed inventory and is not a reliable win-rate estimate.

The simple delta arm reduced marked drawdown in Q1 but worsened net outcome. ATR shock veto was never triggered and adds no demonstrated value. BTC alignment reduced profitable participation. Combined filters did not improve this Spot method.

## Pre-registered double-cost sensitivity

| Arm, doubled costs | Q1 net | Q2 net | Sum | Closed records |
|---|---:|---:|---:|---:|
| Baseline | -8.2508 | 30.9286 | 22.6779 | 8 |
| Delta + ATR + BTC | -30.0861 | 5.4259 | -24.6603 | 0 |

Only baseline and combined were cost-stressed as fixed in the protocol; this is not a post-result winner search.

## Tests and files

14 complete replay cases: 5 arms × 2 folds + 2 stress arms × 2 folds. Final execution 2026-10-09T12:34:47.139Z to 2026-10-09T12:35:02.000Z. Reported fill stages and accounting checks all pass.

Two development errors were found in the research harness, not hidden: the initial Spot parser rejected native `agg-tp1/agg-tp2` labels; it was corrected to match actual source semantics and rerun. The custom test initially imported a non-existent builder name; corrected to the existing export before 22/22 PASS. No application source or strategy threshold was changed to improve results.

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

## Decision / next step

Do NOT activate these overlays in Spot based on this pilot. Preserve the existing Spot engine. A larger chronological test with full long-horizon warm-up, credible intraday fill sequencing and truly held-out data is needed before considering any filter. Higher-quality historical order-flow/volume-at-price data may enable a different future hypothesis; none is proven here.

Application commit=NONE; application push=NO; deployment=NO; DB mutation=NO; orders/positions/SL/TP actions=0. Only sanitized reporting is published to AI-Log/master.
