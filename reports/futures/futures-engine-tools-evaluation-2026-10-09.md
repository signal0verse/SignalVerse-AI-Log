# Futures — missing-tools historical research, separate result

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

فیلتر فاندینگ در این نمونه کمی بهتر شد، اما برتری فقط روی سولانا متمرکز بود و در فصل دوم تقریباً از بین رفت. سودآوری پایدار و بهبود قابل انتشار اثبات نشده است.

```text
FUTURES_RESEARCH=COMPLETED_LIMITED_PILOT
FUTURES_IMPROVEMENT_PROVEN=NO
PRODUCTION_STRATEGY_CHANGED=NO
```

## Scope and safety

Only source inspection, a new isolated research directory, public historical GET capture, offline replay, tests and reports. No application/strategy/entry/exit/risk/SL/TP change. No credentials or private account data. No production/database/service/worker/PP-flag action. No orders, positions or exchange-account API calls. Public market-data GETs are not zero: 84 capture requests plus two endpoint probes. Application code was NOT changed; experimental admission filters exist only in the research runner.

All tests are offline after capture: global fetch throws; API handlers are not imported. Existing TypeScript AST isolation executes actual pure engine/simulator declarations, replacing only data/context boundaries and the experimental admission hook. This does not prove full live path parity.

## Method / implementation

Actual chain: `api/copytrade.ts::runSimulation → buildFuturesTimeframeInput → computeFuturesDecision → evaluateFuturesRisk → existing stepPosition/finalizeTrade`. Data fetches are injected captured Binance USD-M candles/funding; engine is not copied/reimplemented. The research hook can only change an accepted LONG/SHORT to NO_TRADE; it cannot move Entry/SL/TP, force a direction or create a real order.

Each coin independently starts 10,000 USDT per quarterly fold; 250 fixed margin and leverage 2, original liquidation feasibility still enforced. Aggregate displayed starting capital=30,000 per fold, NOT a shared capital/portfolio risk simulation. Fee=0.05% per side, slippage=0.02%, actual historical settled funding applied, one TP allocation 100/0/0, trailing off, macro/drawdown overlays disabled equally. Existing daily decision / 4h execution clock retained. Native 15m/1h/4h/1d source windows remain separate and require fully closed contiguous bars.

## Results — terminal marked net vs closed-only net

| Research arm | Q1 net (USDT) | Q2 net (USDT) | Sum of reset folds | Closed records | Closed net only |
|---|---:|---:|---:|---:|---:|
| Baseline | 41.7124 | 23.0273 | 64.7397 | 117 | -1.6021 |
| Native taker-delta | -67.6246 | -86.6752 | -154.2998 | 91 | -220.6416 |
| ATR shock veto | 54.9442 | 23.0273 | 77.9715 | 116 | 11.6297 |
| BTC EMA200 alignment | -67.8971 | -126.8898 | -194.7868 | 79 | -265.3746 |
| Delta + ATR + BTC | -241.6999 | -144.3962 | -386.0962 | 57 | -456.6840 |
| Opposing-structure room | 0.0000 | -3.6192 | -3.6192 | 1 | -3.6192 |
| Last settled funding veto | 76.1688 | 23.2577 | 99.4266 | 118 | 33.0848 |
| Daily Futures/Spot premium proxy | 66.7375 | 23.0273 | 89.7648 | 116 | 23.4231 |

Baseline sum of terminal MTM nets +64.7397 is NOT realized trading profit: summed closed trade net is -1.6021, with open positions at the quarter endpoints. Funding arm closed net +33.0848 and terminal net +99.4266. Neither is a prospective account result.

| Arm | Fold | Daily MTM max DD % | Closed win rate % | Closed PF | Open at end | Offered / admitted / vetoed |
|---|---|---:|---:|---:|---:|---|
| Baseline | Q1 | 0.6430 | 27.4510 | 0.9564 | 2 | 57 / 57 / 0 |
| Baseline | Q2 | 0.5803 | 24.2424 | 1.0632 | 1 | 85 / 85 / 0 |
| Native taker-delta | Q1 | 0.9165 | 25.6410 | 0.7882 | 2 | 60 / 43 / 17 |
| Native taker-delta | Q2 | 0.6591 | 17.3077 | 0.8170 | 1 | 93 / 64 / 29 |
| ATR shock veto | Q1 | 0.6427 | 28.0000 | 0.9737 | 2 | 57 / 56 / 1 |
| ATR shock veto | Q2 | 0.5803 | 24.2424 | 1.0632 | 1 | 85 / 85 / 0 |
| BTC EMA200 alignment | Q1 | 1.1169 | 32.3529 | 0.7127 | 3 | 95 / 39 / 56 |
| BTC EMA200 alignment | Q2 | 0.5272 | 17.7778 | 0.6362 | 1 | 105 / 55 / 50 |
| Delta + ATR + BTC | Q1 | 1.1936 | 18.1818 | 0.2381 | 3 | 101 / 25 / 76 |
| Delta + ATR + BTC | Q2 | 0.5238 | 14.2857 | 0.5245 | 1 | 111 / 41 / 70 |
| Opposing-structure room | Q1 | 0.0000 | N/A | N/A | 0 | 135 / 0 / 135 |
| Opposing-structure room | Q2 | 0.0121 | 0.0000 | 0.0000 | 0 | 129 / 1 / 128 |
| Last settled funding veto | Q1 | 0.6423 | 28.8462 | 1.0027 | 2 | 61 / 58 / 3 |
| Last settled funding veto | Q2 | 0.5796 | 24.2424 | 1.0637 | 1 | 86 / 85 / 1 |
| Daily Futures/Spot premium proxy | Q1 | 0.6425 | 28.0000 | 0.9896 | 2 | 57 / 56 / 1 |
| Daily Futures/Spot premium proxy | Q2 | 0.5803 | 24.2424 | 1.0632 | 1 | 85 / 85 / 0 |

All drawdowns above use daily marked aggregate equity on three independent capital sleeves. Intraday worst drawdown can be larger. Veto counts can change future offered decisions by changing position occupancy; admitted is not equivalent to filled (existing fill-price R:R gates may still reject).

## Where the apparent funding improvement comes from

- Q1 funding versus baseline: +34.4564 USDT.
- Q2 funding versus baseline: +0.2304 USDT.
- Total difference: +34.6869 USDT; ALL from SOL. BTC and ETH outcomes unchanged.
- Only four funding vetoes across its folds; the resulting trade sequence has 118 closed trades vs baseline 117. It is not a large independently replicated effect.
- ATR and daily-premium apparent benefits also occur only in SOL/Q1. Q2 difference for each is zero.
- Structure-room arm rejects 263 of 264 offered setups and produces one losing closed trade. Avoiding nearly every trade is not proof of better entry quality.
- Delta alone, BTC alignment alone and their combined arm underperform. This rejects these specific simplistic hypotheses in this sample, NOT the entire class of order flow or regime analysis.

## Baseline closed outcome by direction and timeframe

| Fold | LONG count / net | SHORT count / net |
|---|---:|---:|
| Q1 | 17 / -0.1476 | 34 / -32.3765 |
| Q2 | 42 / -27.3553 | 24 / 58.2774 |

| Fold | 15m count / net | 1h count / net | 4h count / net | 1d count / net |
|---|---:|---:|---:|---:|
| Q1 | 3 / -28.0139 | 14 / -37.9015 | 20 / -49.5075 | 14 / 82.8987 |
| Q2 | 16 / -46.7526 | 21 / -78.9867 | 19 / -44.8216 | 10 / 201.4829 |

This is a diagnostic partition after a mixed-timeframe engine chooses its interval, not four independently validated timeframe strategies. No parameter changed based on this partition.

## Pre-registered double-cost sensitivity

| Arm, doubled costs | Q1 net | Q2 net | Sum | Closed records |
|---|---:|---:|---:|---:|
| Baseline | 20.9310 | 59.2746 | 80.2056 | 88 |
| Delta + ATR + BTC | -246.1181 | -102.4014 | -348.5195 | 38 |

Higher slippage changes fill-price risk eligibility, so the trade set changes (baseline 117 → 88 trades). Aggregate MTM can therefore increase despite higher costs; do not interpret that as lower costs being harmful or an alpha proof. The combined arm remains materially worse. Funding/premium were not added to stress after seeing their results.

## Tests and files

60 complete replay cases: 8 arms × 2 folds × 3 symbols + 2 stress arms × 2 folds × 3 symbols. Final execution 2026-10-09T12:34:57.569Z to 2026-10-09T12:35:47.640Z. Native funding evidence AVAILABLE for every run. Each closed trade reconciles gross minus fees minus funding to net. Results retain simulated trade evidence and per-decision feature timestamps.

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

Keep Production Futures unchanged. The funding veto is a narrow candidate for a new preregistered wider/held-out experiment, NOT a recommended live change. Validate broader symbols/regimes and genuine point-in-time OI/funding/spread availability before touching Auto Scanner or the core. MEXC/Gate would require separate native capture, costs and replay, not Binance results copied across venues.

Application commit=NONE; application push=NO; deployment=NO; DB mutation=NO; orders/positions/SL/TP actions=0. Only sanitized reporting is published to AI-Log/master.
