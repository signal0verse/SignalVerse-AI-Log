# SignalVerse — Engine Intelligence Upgrade

## Metadata / scope

- Work started: 2026-10-09; report: 2026-10-10, Asia/Kuala_Lumpur.
- Task: priority-based current-source audit, prior-evidence review, offline correction and validation.
- Repository: SignalVerse-Main. Development branch: `codex/engine-intelligence-20261009`.
- Authenticated main/base inspected at start: `b18d35403bdc71274bb18bfbf135bec50d15a6c9`.
- Ending application HEAD: same base; implementation is an **uncommitted development diff**, not a release identity.
- Prior research source: `61280af0f123fe8d6bbfb4afe7e0cb6a7d238c91`; never substituted for the current baseline.
- Application commit/push/CI/deploy: NONE. Only this sanitized work report is intended for the separately authorized AI-Log report repository.
- No Production connection, database access, credential read, exchange request, LLM request, worker/scheduler/flag change, order or position action. Public documentation browsing and repository Git operations are not exchange-account validation.
- Primary checkout, unrelated dirty work, earlier reports/data and Prediction Market were preserved.

Local implementation/evidence root:

```text
C:/Projects/SignalVerse-Main/tmp/engine-intelligence-20261009
```

Prior research root, read-only:

```text
C:/Projects/SignalVerse-Main/tmp/engine-tools-research-20261009
```

All source references below are repository-relative to those roots. The report follows the existing AI-Log template and the owner's required A–I structure; no private account evidence is included.

## A. Executive Summary

نتیجهٔ اصلی: مشکل فعلی کمبود تعداد اندیکاتور نیست. بخشی از ابزارهای فهرست‌شده از قبل در اسکنر، انجین یا مدیریت ریسک وجود دارند؛ بعضی فقط داده/شاهد هستند و نباید به‌عنوان رأی فعال انجین معرفی شوند.

پنج اصلاح فنی محدود در شاخهٔ توسعه انجام شد: حفظ مقدار معتبر صفر در StochRSI، هم‌راستاکردن حداقل تاریخچهٔ شبیه‌ساز Spot، محاسبهٔ جداگانهٔ ارزش واقعی دارایی باز، اتصال Fast Trader دمو به ورودی بومی Futures و جلوگیری از فرض دورهٔ Funding هنگام خرابی داده. این اصلاحات اثبات سود بیشتر نیستند.

هیچ ابزار جدیدی برای معاملات واقعی فعال نشده است. بازپخش‌های تازه، اثر اقتصادی اصلاحات را اندازه گرفتند؛ برای پذیرش یک استراتژی جدید، شواهد مستقل کافی نداریم. قرارداد بستهٔ تاریخی انتشار نیز تغییرات جدید را نمی‌پذیرد؛ بنابراین این شاخه فقط برای بازبینی فنی آماده است، نه انتشار.

Confirmed findings and action:

| Finding | Evidence | Disposition |
|---|---|---|
| Valid StochRSI zero became neutral 50 | Shared indicator used truthiness fallback; falling-price golden input produces exact zero | IMPLEMENT: finite-value fallback; no threshold change |
| Spot simulator requested 220 daily warmup bars while Market Map requires at least 400 | Actual `runSpotSimulation` request versus `SPOT_MARKET_MAP_MIN_LONG_CANDLES` | IMPLEMENT: 400-day request; not a claim of complete 1000-day layer coverage |
| Legacy terminal Spot equity projects TP proceeds, not achieved/marked equity | Actual legacy return and partial-sale ledger | IMPLEMENT: separate cash-plus-inventory MTM output, preserve legacy/UI output |
| Demo Fast Trader supplied legacy Spot-derived inputs and no native exchange to a native-only gate | Actual builder → handler → `analyzeOneCoinPro` call graph | IMPLEMENT: reuse existing native/shared builder; keep Demo-only, no gate bypass |
| Failed Binance funding metadata fetch invented an 8h interval | `binanceUniverse` caught failures as an empty adjustment list | IMPLEMENT: invalid/failed metadata remains unknown; existing AUTO gate rejects it |
| Existing exact release contract excludes any new source/research paths | Unmodified `owned-futures-entry-scope-test.mjs` fails `Exact owned entry inventory` | BLOCKED for promotion; gate was not weakened |
| No stable new alpha demonstrated | Three prior studies plus 32 current paired corrective replays | No new trading tool ACCEPTED; research/negative findings retained |

The old Fast Trader mismatch is evidence of a fail-closed/broken source path, **not proof that Production actually traded on Spot candles**. No Production runtime was inspected in this task.

## B. Current Capability Audit

### Source / call-path key

| Key | Exact source and actual path inspected |
|---|---|
| F1 | `api/analyze.ts`: `analyzeOneCoinPro` (near 3114) native venue/source/provenance checks → `computeFuturesDecision` alias → `reviewFuturesEngineDecision` → decision persistence |
| F2 | `api/_shared/futures-decision-engine.ts`: `normalizeFuturesDecisionInput` → `computeCanonicalFuturesDecision` (near 338), exported `computeFuturesDecision`; shared vote/setup authority |
| F3 | `api/_shared/futures-indicators.ts`: shared EMA/MACD/RSI/StochRSI/BB/ATR input construction; `futures-risk.ts`: setup/risk validation |
| F4 | `api/copytrade.ts`: `futuresProWatchTick` → `buildFuturesProTimeframeInputs` (near 12010) → Binance/MEXC/Gate native fetchers → closed-native selector → F1 |
| F5 | `api/copytrade.ts`: `runSimulation` (near 13171) → native historical candles/funding → shared timeframe builder → F2 → risk/`stepPosition` |
| FT | `api/copytrade.ts`: `fastTraderTick` → `buildFastTraderTimeframeInputs` → `api/analyze.ts:handleFastTraderAnalyze` → F1. Handler forces Demo; new bridge supplies Binance native identity |
| D1 | `api/_shared/futures-discovery-data.ts`: `collectDiscoveryInstruments` → `fetchDiscoveryUniverse` → broad scan → deep native 1h/4h enrichment; public-data adapters |
| D2 | `api/_shared/futures-market-discovery.ts`: closed-series features → regime/side scoring/ranking; `futures-auto-candidate-quality.ts:evaluateAutoCandidateQuality` → AUTO admission |
| D3 | `api/copytrade.ts`: discovery run/serialization → `maintainFuturesDiscoveryRows` / `applyFuturesDiscoveryToProfiles` → subsequent native new-entry admission, not scanner-created orders |
| P1 | `api/_shared/futures-candle-provenance.ts`: native boundary/alignment/contiguity/OHLC/freshness selector and decision-input hash; `futures-market-data.ts`: historical market/funding providers |
| J1 | `api/copytrade.ts`: `claimRealExecutionAttempt` (10634), `markRealExecutionSubmitted` (10702), `activateRealPendingTrade`; durable journal + native/owned freshness gate |
| S1 | `api/copytrade.ts:computeSpotMarketMapFromCandles` (12489) → `computeSpotAccumulationVerdict` → `decideSpotScenario` → `computeHorizonAwareSpotLadders` |
| S2 | `api/copytrade.ts`: Spot scenario lifecycle / `evaluateSpotAggregateExit` (4385); live continuation/admission paths preserved byte-for-byte |
| S3 | `api/copytrade.ts:runSpotSimulation` (14021) → S1/S2, actual daily fills; new separate MTM fields, legacy return retained |
| R1 | Prior `research/engine-tools/{protocol.json,core.mjs,core.test.mjs,run.mjs,capture.json,summary.json,*-results.json,data/*}` |
| R2 | Prior `research/custom-strategies/{protocol.json,filters.mjs,filters.test.mjs,run.mjs,capture.json,summary.json,evidence.json,*-results.json,data/*}` including separate 400-day sensitivity protocol/runner/results |
| R3 | Prior `research/spot-engine-primitives/{protocol.json,policies.mjs,policies.test.mjs,run.mjs,summary.json,evidence.json,*-results.json}` and all nine associated main/market reports |

Test names in the next table refer to the explicit suites in section F, not an assertion that live execution was tested. “Used” means source-reachable, not reverified active Production configuration.

| Capability | Current Status | Source Files | Actual Call Path | Data Source | Data Quality | Spot/Futures | Demo/Real/Simulator | Existing Tests | Known Defects | Evidence | Recommendation |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Central Futures engine | Used, one authority | F1/F2/F5 | watch/analysis and simulator → F2 | normalized native TF inputs | controlled by P1; mode-specific external context differs | Futures | all three; FT Demo | shared-engine, timing, PIT | full live AI/account parity not proven by offline equality | same core imports and actual-function tests | ACCEPT preservation, not new alpha |
| EMA/MACD/RSI/StochRSI/BB | Used in votes | F2/F3 | F2 five-vote scoring | closed OHLCV | valid zero was lost | Futures | all shared callers | shared-engine + new P0 | zero→50 truthiness bug fixed | actual descending fixture | IMPLEMENT completed |
| ATR / volatility / R:R | Used | F2/F3 | indicators → setup → risk | native bars/account risk inputs | fallback exists for short/missing series | Futures; distinct Spot use | all three | risk through shared/simulator suites | minimum standard history can be only five bars; full long-EMA evidence is not certified | source fallback and input minimum | ACCEPT current policy; RESEARCH stricter minimum contract |
| Native closed candles | Used for standard path | F4/P1 | native fetch → strict selector → F1 | Binance native close field; MEXC/Gate boundary semantics | gaps/duplicates/stale/invalid OHLC reject | Futures | standard Demo/Real, native simulator | closed-native, PIT, timing | not a proof of historical network receipt time | 147750 cached native klines checked | ACCEPT technical preservation |
| Fast Trader native parity | Defective old bridge; corrected locally | FT/F3/P1 | FT → existing F4 builder → Demo F1 | Binance native 1m/5m | both TFs required; >=210 closed bars; no Spot fallback | Futures only | Demo only | 19 new actual-source tests | no 1m/5m historical profitability sample or live test | invalid/forming poison and auth tests | IMPLEMENT completed; no Real FT |
| Input trace / decision provenance | Used, partial historical coverage | P1/F1 | normalized scoring hash → recorded evidence | native window + decision timestamps | hash proves bytes, not exchange latency | Futures | Demo/Real source, simulator evidence | PIT/closed-native | old records may lack provenance; not inspected here | current source + replay manifests | ACCEPT tracing, BLOCKED live provenance conclusions |
| Durable entry ownership / idempotency | Used | J1 | pending → claim → submit/reconcile | durable execution intent + setup evidence | uncertain holds retained | Futures | Real/owned execution | freshness 98, integration65, owned86 | no disposable SQL concurrency run in this task | actual-source inert tests; unchanged declarations | ACCEPT preserve; not new exchange exactly-once proof |
| OI + price/volume | Used in discovery, not an added core vote | D1/D2/F2 | OI history → positioning score / quality | Binance/Gate histories; MEXC current OI | MEXC history unavailable; short windows only | Futures | Demo/Real candidate lists; not full historical scanner replay | discovery/data/quality | no broad historical OI archive for alpha test | current OI quadrant/side score | ACCEPT existing use; RESEARCH incremental filter |
| Funding crowding / interval | Used in discovery, evidence in engine | D1/D2/F2 | rate/interval → ranking → AUTO quality | native public metadata | fetch failure formerly invented 8h | Futures | candidate lists; simulator recorded settlements separate | 13 new metadata cases + existing data/core | historical interval completeness absent; manual discovery retains existing optional-unknown semantics | same market PASS with valid interval, non-PASS on failures | IMPLEMENT metadata fix; RESEARCH alpha |
| Spread / market quality | Used, not full depth model | D1/D2 | bookTicker spread/turnover → shortlist/quality | native top-of-book/tickers | snapshot age validated; no historical L2 receipt tape | Futures | Demo/Real discovery | discovery/data/live inert | top spread does not prove executable size/slippage | feature + AUTO required fields | ACCEPT existing use; RESEARCH depth |
| Volume / momentum | Used | F3/D2/S1 | indicator inputs + multi-horizon ranking | native OHLCV, venue unit normalization | aggregation loses intrabar order flow | both, separate logic | live source + simulations | data normalization/core/research | no claim of tick CVD | actual D2 weights and unit tests | ACCEPT reuse; no duplicate engine |
| Support/resistance / market structure | Used in Spot; Futures evidence | S1/F2 | Spot map→ladder; Futures structure diagnostics | closed history/pivots | long-layer coverage explicit | both | all relevant paths | shared/Spot replay | Futures SMC evidence has zero vote weight | code path, not just function name | RESEARCH incremental Futures veto; preserve Spot |
| Order Block / FVG | Partial, diagnostic | F2/F3 | retained structural evidence | OHLC patterns | not order-book/fill evidence | Futures | evidence accompanying core | shared-engine | presence is not weighted execution authority | zero-weight SMC contract | RESEARCH, do not claim absent or active alpha |
| Order flow / Delta / CVD | Bar proxy researched, no complete integrated tape | R1; D2 volume overlap | standalone replay veto only | native taker/base kline volumes | no tick sequencing/global CVD | both, separate arms | research only | R1 core and checksum evidence | aggregation/session-reset limits | negative/unstable prior arms | RESEARCH; REJECT tested combined overlay |
| L2 imbalance / market depth | No proven central alpha layer | D1 spread; R1 limitations | no integrated central L2 signal found | would need snapshot + ordered deltas | archive absent | both, independently | none accepted | no historical alpha test | book reconstruction/latency gaps | source inventory + official sequence contract | BLOCKED on replayable archive |
| Liquidation flow | Gate aggregates collected; no weighted decision layer | D1/D2 | Gate stats → 4h diagnostic metric | Gate public contract stats | not complete venue-wide event tape | Futures | scanner evidence | data/core tests | Binance/MEXC historical equivalent not present | liquidation field collected, not a score component | BLOCKED alpha; RESEARCH loss/coverage model |
| Volume profile / value area / HVN-LVN | Not integrated | S1/F2/R1 inventory | no price-volume distribution authority found | needs trades/price buckets | OHLC volume alone insufficient for exact profile | both separately | research not run | none proving alpha | historical granular tape absent | report limitations | BLOCKED; do not invent OHLC “true profile” |
| Basis / cross-exchange | Native adapters exist; alpha layer incomplete | P1/D1/R1 | R1 synchronized daily premium veto only | Spot/Futures daily closes | proxy, not native mark/index basis; no synchronized multi-venue tape | Futures | research only | R1 | historical clock/mapping/settlement gaps | daily-premium protocol | RESEARCH/BLOCKED, not implement now |
| Positioning / long-short ratios | Partial OI positioning, no verified full ratio strategy | D2/F2 | OI quadrants, evidence | OI/tickers | current OI != authenticated account positioning | Futures | scanner; no accepted simulator ratio | discovery | historical ratio coverage absent | source distinctions | RESEARCH |
| Options IV/skew/gamma | Not integrated/proven | R1 audit inventory | none in central entry path | needs timestamped options chain | no usable archive | Futures context | none | not run | coverage/model/expiry semantics absent | data inventory | BLOCKED |
| Regime / cross-asset / macro | Partial existing context | F1/F2/S1, existing regime modules | optional regime/stablecoin context | BTC/ETH, dominance, stablecoin/fear-greed sources | historical release/receipt coverage incomplete | both, separate admission | live code; replay context held null equally | PIT, replay | DXY/gold/Nasdaq/news-as-of causal integration not proven | no macro data invented in replays | RESEARCH existing context first |
| Spot Market Map / multi-horizon | Used | S1/S3 | map→accumulation→scenario | closed daily history | minimum400; complete long layers may need1000 | Spot | Demo/Real source, simulator | P0 and existing replay | old220 transport; fixed minimum not full layer parity | 400-bar request and sparse results | IMPLEMENT minimum; RESEARCH full-layer parity |
| Spot DCA / allocation / exits | Used, not missing | S1/S2/S3 | configurable ladder→fills→aggregate exit | Spot price/capital/scenario state | fills deterministic at simulator resolution | Spot | live source + simulator | P0/research primitives | daily buy-before-sell ambiguity; grid/trailing not equivalent | real ladder functions + R3 | ACCEPT preserve; REJECT tested ladder swap |
| Spot marked accounting | Added separate output | S3 | actual buys/sells/fees + last closed mark | simulator actual fill ledger | rejects malformed/oversold ledger; stale carry disclosed | Spot only | simulator/research function return | 16 P0 tests | new field not yet exposed by public handler/UI | golden partial-sale value 1014.84 | IMPLEMENT completed; no financial DB change |
| Execution fees/funding/slippage/risk overlay | Used, incomplete realism | F3/F5/S3/J1 | risk gate / simulator fill lifecycle | configured costs + recorded funding | synthetic slippage, funding points not completeness proof | both, separate costs | source paths vs offline models distinguished | 21/27/41/46 sim suites | no historical liquidity queue/latency proof | exact ledgers and cost stress | ACCEPT arithmetic; BLOCKED complete live realism |
| AI Supervisor / ensemble / confidence | Supervisor used; ensemble/calibration not proven | F1, `futures-supervisor.ts`, old A/B helpers | engine first→confirm/veto | engine decision + model review | omitted in replay; no outcomes calibration | Futures; separate Spot review | live source only in this task | shared contract, not new LLM experiment | heuristic confidence is not calibrated win probability | no SL/TP/direction replacement by new code | ACCEPT role; RESEARCH calibration; defer ensemble |
| Grid/StepGrid/TWAP/adaptive execution | Not proven implemented as requested strategy | R2/R3 and actual lifecycle inventory | no accepted new path | would require lifecycle + granular execution tape | no evidence of safe/profitable replacement | Spot/Futures separately | none newly built | not run | execution risk and large scope | negative/primitives reports | RESEARCH later; do not build now |

The legacy `buildEngineTimeframeInputsFor` / Spot-backed experimental A/B helper remains for virtual tooling; this task does **not** certify it as native production parity. The production-oriented FT caller no longer uses it in this development diff.

Binance funding metadata is an adjustment list, so a valid empty list is different from failure. The current native adapter's existing 8h default is retained only for a valid list; explicit adjustments remain authoritative. This interpretation is supported by [Binance market-data documentation](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data#get-funding-rate-info) and the [official funding explanation](https://www.binance.com/en/support/faq/detail/360033525031). No new exchange endpoint was called.

## C. Prioritized Roadmap

Statuses describe this task's evidence, not permission to deploy. Cost is relative engineering effort, not a monetary estimate.

| Priority | Problem → proposed solution | Expected benefit | Required data | Cost / risk | Dependencies | Acceptance criteria | Final status |
|---|---|---|---|---|---|---|---|
| P0.1 | Zero oscillator incorrectly neutral → finite fallback | Correct shared input mathematics | golden bars | low / may change genuine boundary decisions | F3 | exact zero preserved, nonzero parity, shared regressions | IMPLEMENT complete |
| P0.2 | FT broken native admission bridge → reuse F4 | One shared/native Demo path | synthetic closed 1m/5m | low-medium / renewed Demo activity if later deployed | P1, F1 | both TFs, >=210 bars, reject bad/stale inputs, forcedDemo | IMPLEMENT complete |
| P0.3 | Spot220 warmup → request existing400 minimum | meaningful initial Market Map eligibility | daily cached history | low / changes simulated opportunities | S1 | closed400 request; no policy rewrite; compare baseline | IMPLEMENT complete |
| P0.4 | Projected Spot equity mistaken for achieved value → separate MTM | truthful measurement | actual simulator fill ledger | medium / accounting double-count risk | S2/S3 | partial/full/no-fill/fee/gap/invalid ledgers; independent reconstruction | IMPLEMENT complete |
| P0.5 | Funding metadata outage treated as default → unknown | no invented AUTO eligibility | malformed/success fixtures | low / fewer candidates during outage | existing AUTO gate | valid control PASS; failures notPASS; diagnostics retained | IMPLEMENT complete |
| P0.6 | Full bar sufficiency, receipt latency and funding completeness unproven → explicit coverage contracts | stronger replay validity | venue timestamped windows + settlement schedules | medium / unsupported assumptions | historical capture specification | no inferred gap-free funding from nonempty arrays; all required layers covered | RESEARCH, not completed |
| P0.7 | Historical closed release manifest excludes new correction → reviewed exact successor later | preserve old security/financial invariants | this frozen delta and negative mutations | medium / weakening old gates forbidden | separate release review | old gate retained, unrelated mutation rejected, exact-SHA CI later | BLOCKED for release; no gate changed |
| P1.1 | Funding alpha unstable → isolated causal veto test on fresh sample | possibly reduce crowded entries | timestamped native settlements/metadata | medium / selection bias | P0 complete | unchanged prior screening: positive paired MTM both folds at1x/2x, DD no worse, >=30 closes, positive closednet; independent follow-up still required | RESEARCH |
| P1.2 | OI/spread/volume already used but marginal value unknown → ablate one existing component at a time | avoid duplicate votes/overfilter | contemporaneous scanner universe + snapshots | medium / correlation & survivors | archived rejected as well as accepted candidates | same universe/risk/cost/clock; full opportunity denominator | RESEARCH/BLOCKED data |
| P1.3 | Spot lower activity partly input-limited → full long-layer coverage audit before filter tuning | avoid optimizing under-warmed baseline | up to1000+ closed daily bars, listings | medium / opportunity regime differences | S1 coverage semantics | layer-specific coverage, unchanged scenario/risk, separately reset folds | RESEARCH |
| P2.1 | L2/order-flow realism → research capture/reconstruction, not alpha integration | measure executable liquidity | sequence-stamped deltas/trades + receipt times | high / gaps, latency, resets | storage/source contract | snapshot+sequence replay, gap rejection, independent multi-regime holdout | BLOCKED |
| P2.2 | Liquidations/basis/cross-venue evidence incomplete → venue-specific coverage and mapping first | contextual crowding/dislocation evidence | native timestamped series | high / inconsistent units and sampling | P0 data contract | no fabricated full tape; no cross-venue identity/clock ambiguity | BLOCKED/RESEARCH |
| P2.3 | Volume profile/options absent → establish need and archive before coding | unproven | granular trades / options chain | high / sparse coverage & model bias | independent hypothesis | incremental value over structure/ATR, costs and adverse regimes | BLOCKED |
| P3 | Spot liquidity/structure/regime adaptation → separate one-feature experiments | improve Spot decisions without Futures transfer | long Spot history + realistic fills | medium-high / daily intrabar ambiguity | P0.3/P0.4/P1.3 | causal inputs, robust folds, inventory marking, adequate closed cycles | RESEARCH; no live adaptation |
| P4 | Ensemble/adaptive weights/confidence calibration | unproven calibration benefit | outcome-linked, leak-free labels | high / overfit and drift | stable P0–P3 baseline | locked train/validation/test, calibration metrics, same engine authority | RESEARCH deferred |

No new combination was run: **no individual new tool met the required robustness screen**. The earlier combined-filter experiment is retained as a historical negative result, not reused as a valid “approved combination.”

## D. Experimental Evidence

### D1. Prior evidence reconciliation

Read the three protocols, runners, indicator/wrapper implementations, tests, reports, captures and result manifests. Programmatic full-file JSON checks supplement source reading; hashes are not a substitute for semantic inspection.

- 71 retained research files inventoried and SHA-256 recorded.
- 36 cached data-file hashes and row counts matched; 151089 rows counted across files, including overlapping history and unused warmup, **not unique executed decisions**.
- 147750 kline records passed native close-field, step/gap and OHLC checks.
- 54 recorded primary prior source-hash comparisons matched the retained source tree, plus10 additional comparisons in the separately checked400-day sensitivity result. Its dedicated protocol hash also matched.
- 5095 retained admission-feature evidence records had native close strictly before decision time. This is feature causality evidence, not network-receipt provenance or proof every live input was correct.
- Primary prior replays: 74 + 176 + 64 = 314. The second study also contains 44 separately labeled, post-hoc 400-day Spot sensitivity runs; those are not silently included in its176 headline.
- Retained files were not modified or recaptured. Prior diagnostic test counts69/85/74 are historical evidence, not fresh current-suite counts.

| Study | Spot evidence | Futures evidence | Decision |
|---|---|---|---|
| Engine tools, 2025H1 | 14 replays; baseline8 closes, closednet31.5192, MTM23.8660; combined MTM-24.4203 | 60 replays; baseline117 closes, closednet-1.6021, MTM64.7397; funding MTM99.4266, mostly first-quarter/SOL uplift; Q2 uplift only0.2304; combined MTM-386.0962 | RESEARCH funding alone; REJECT tested combined overlay; no broad profitability claim |
| Custom strategies, 2025H2 | 220-day baseline0 closes; separate400 sensitivity5 closes; best-looking tiny samples insufficient | Keltner/OBV70 closes, closednet625.4955, MTM664.5001; Q3 delta+57.4321 but Q4 delta-44.2753 | No arm passed both-fold/cost/DD/sample screen; no new core strategy |
| Spot engine primitives, 2025H2 reused | baseline5 closes, MTM1.0086; equal ladder0.7336, front ladder0.3912; weekday21.9788 but only8 closes and no Q3 activity | baseline651.3433; trail2ATR468.8784; six-bar timeout327.0282; weekday548.3691. At2x:595.5532 /398.6193 /246.7152 /475.4247 | REJECT these tested exit/ladder replacements; sparse Spot weekday stays RESEARCH, not accepted |

All figures are simulated quote-currency units, not account profits. Negative findings are specific to these implementations and samples, not universal impossibility theorems. Original thresholds were not retuned.

Prior records: [engine tools](https://github.com/signal0verse/SignalVerse-AI-Log/blob/0e3704ea83e6f13706cfb1fe70d28122132f3086/reports/general/engine-tools-spot-futures-evaluation-2026-10-09.md), [custom strategies](https://github.com/signal0verse/SignalVerse-AI-Log/blob/4cf22ae4511c3268dc0ed56bb6018fdbe40494a9/reports/general/custom-strategies-engine-evaluation-2026-10-09.md), [Spot primitives](https://github.com/signal0verse/SignalVerse-AI-Log/blob/65b233234798d628b29ec840d2b99a9014bcf5f0/reports/general/spot-engine-primitives-evaluation-2026-10-09.md).

### D2. New registered corrective experiment

- Protocol: `research/engine-intelligence/protocol.json`. Technical hypotheses registered before their tests; FT and funding-metadata amendments explicitly recorded. No alpha selection or post-result threshold tuning.
- Frozen current baseline above; exact baseline indicator module loaded from Git, not reimplemented mathematics. For Spot baseline, transport restores the original220-day request; candidate uses400. Entry/exit logic otherwise same; new MTM output checked independently.
- Data: existing Binance BTC/ETH/SOL Q3/Q4 2025. H1/H2 Spot warmup caches merged only after byte-equivalent overlap and contiguous-step checks.
- These quarters were previously observed: **not unseen holdouts**. No train fit, optimization, live scanner universe, private execution, AI review or macro context. Missing historical context held equally unavailable.
- Spot:1000 per coin, total3000 per independently reset quarter, existing scenario/ladder10/20/35/35, no compound. Daily decisions/fills.
- Futures: independent10000-per-symbol sleeves per quarter, fixed250 margin,2x leverage, ONE-TP100/0/0, no new trailing. Existing daily decisions /4h execution resolution retained; not a fast-timeframe HFT test.
- Fees/impact per side: Spot0.1% +0.02%; Futures0.05% +0.02% slippage. All baseline/candidate arms rerun at doubled fees and impact/slippage. Recorded funding included; negative funding below is a net credit. Funding completeness is **not proven** merely by points existing.
- No hypothetical terminal sale. Spot MTM includes actual cash from partial sells, paid fees, remaining quantity × latest closed mark. Research impact remains separately subtracted; it is not silently inserted into the application function's paid-fee ledger.
- 32 new replay cases:8 Spot portfolio runs and24 Futures per-symbol runs. Source/data/protocol hashes retained.

### D3. Spot — separate result

| Variant / costs | Closed cycles | Closed net | Marked net incl. open inventory | Total modeled fee+impact | Worst quarterly MTM DD | Q3 / Q4 marked net |
|---|---:|---:|---:|---:|---:|---|
| Baseline220 /1x | 0 | 0 | 2.341102 | 0.405248 | 0.633290% | 0 /2.341102 |
| Candidate400 /1x | 5 | 14.125032 | 1.008611 | 1.159699 | 1.313340% | 0 /1.008611 |
| Baseline220 /2x | 0 | 0 | 1.935854 | 0.810496 | 0.633358% | 0 /1.935854 |
| Candidate400 /2x | 5 | 13.771658 | -0.151088 | 2.319398 | 1.321004% | 0 /-0.151088 |

All five closes are inQ4. Candidate closed win rate100% is a **five-cycle selected closed subset**; open losses remain. Profit factor is undefined with no closed losers, not an infinity-based acceptance. Average closed trade2.825006 at1x and2.754332 at2x. Q4 open scenarios: baseline4, candidate3; Q3 none.

The input correction exposes more valid opportunities and a worse marked result in this sample. Correctness acceptance is **not** alpha acceptance. Do not market14.125 closed profit while ignoring the remaining inventory. Golden partial-sale test:1000 starting capital → actual marked1014.84; the legacy projected field differs and is retained separately.

### D4. Futures — separate result

| Variant / costs | Closed trades | Closed net | Marked net | Closed-trade fees | Recorded net funding | Q3 / Q4 marked net |
|---|---:|---:|---:|---:|---:|---|
| Baseline /1x | 100 | 612.688656 | 651.343301 | 49.966365 | -1.993786 | 192.938556 /458.404745 |
| Candidate /1x | 100 | 612.688656 | 651.343301 | 49.966365 | -1.993786 | 192.938556 /458.404745 |
| Baseline /2x | 70 | 557.590682 | 595.553180 | 69.891655 | -2.315078 | 197.578065 /397.975114 |
| Candidate /2x | 70 | 557.590682 | 595.553180 | 69.891655 | -2.315078 | 197.578065 /397.975114 |

72/72 exact paired field comparisons match: complete trade ledgers, equity curves, marked/closed net, open-position records and trade counts across six symbol/fold runs at each cost level. Cost stress reruns admission/risk, so the70-trade count is not a recosted fixed100-trade list. The zero-boundary indicator correction did not change these particular cached decisions; this does not make the golden zero defect unreal.

| 1x fold / asset | Trades | Win rate | Profit factor | Average trade | Max DD | Marked net |
|---|---:|---:|---:|---:|---:|---:|
| Q3 BTC | 15 | 13.33% | 0.40881 | -4.271785 | 0.990606% | -67.333389 |
| Q3 ETH | 28 | 42.86% | 1.45256 | 2.704521 | 0.563500% | 75.376567 |
| Q3 SOL | 24 | 41.67% | 2.13500 | 7.703974 | 0.699738% | 184.895377 |
| Q4 BTC | 17 | 58.82% | 4.08203 | 10.536138 | 0.356187% | 179.114346 |
| Q4 ETH | 6 | 33.33% | 2.77498 | 9.685760 | 0.843047% | 100.725865 |
| Q4 SOL | 10 | 50.00% | 3.05037 | 17.891455 | 0.576453% | 178.564534 |

Per-side and chosen-timeframe metrics are retained in local `evidence.json` and the companion report `engine-intelligence-evidence-2026-10-10.json`, not merged with Spot. These independent sleeves/quarter resets are not one continuous portfolio return. No result is generalized to MEXC/Gate, small caps or actual account slippage. **IMPROVEMENT PROVEN = NO.**

### D5. Why advanced data work remains blocked

Existing Binance OI statistics expose only recent history; the official page states a latest-one-month limit. That cannot reconstruct the missing2025 OI receipt-time archive used by these experiments. Native basis history is similarly time-limited. [Official market-data specification](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data#open-interest-statistics).

Order-book research must first reconstruct snapshot/delta sequence and resynchronize on gaps; top-of-book snapshots or daily candles are not a substitute. [Official local-order-book procedure](https://developers.binance.com/en/docs/products/derivatives-trading-usds-futures/websocket-market-streams/How-to-manage-a-local-order-book-correctly).

No granular liquidation/options/volume-profile archive was found in the retained evidence. Gate's collected aggregates do not establish complete cross-venue event coverage. No data was fabricated and no broad new capture framework was built.

## E. Implementation Report

### Executable source changed: exactly five files

| File | Exact declarations / reason |
|---|---|
| `api/_shared/futures-indicators.ts` | `futuresProCalcStochRSI`: preserve finite0; `buildFuturesTimeframeInput`:1m/5m duration support for same closed-bar contract |
| `api/_shared/futures-candle-provenance.ts` | `FUTURES_KLINE_INTERVAL_MS`: add1m/5m Binance FT durations only; MEXC interval map unchanged |
| `api/copytrade.ts` | `buildFastTraderTimeframeInputs`: existing native builder, both TFs required; `buildFuturesProTimeframeInputs`: type/minimum extension only for FT; `runSpotSimulation`:400day request, separate MTM/valuation fields and invalid-ledger rejection |
| `api/analyze.ts` | `handleFastTraderAnalyze`: explicitBinance into existing native-only analysis; authentication and forcedDemo retained |
| `api/_shared/futures-discovery-data.ts` | `binanceUniverse`: distinguish successful valid adjustment list from fetch/schema/duplicate failure; unknown stays null with diagnostic |

No new engine, order path, DB table, migration, feature toggle, dependency or execution adapter. Existing risk/SL/ONE-TP/scoring thresholds, live Spot lifecycle and AI confirm/veto authority remain unchanged. Numerical correction can affect a genuine zero-boundary decision; it is not claimed behavior-neutral for every possible input.

The scanner change is **metadata validity**, not a ranking/quality-threshold rewrite. Existing manual discovery may still display optional rate evidence with unknown interval; AUTO admission cannot PASS it. No historical interval completeness or universal manual-scan funding semantics are newly certified.

New MTM outputs are additive return fields of the actual Spot simulator. The current public handler/UI still consumes legacy fields; this task neither silently changes owner-approved projected display nor claims the new fields are already visible to users.

### Tests / research / documentation added

- `scripts/engine-intelligence-p0-test.mjs`
- `scripts/engine-intelligence-fast-trader-test.mjs`
- `scripts/engine-intelligence-funding-test.mjs`
- `scripts/engine-intelligence-scope-test.mjs`
- `research/engine-intelligence/protocol.json`
- `research/engine-intelligence/replay.mjs`
- `research/engine-intelligence/evidence.mjs`
- `research/engine-intelligence/validate.mjs`
- `research/engine-intelligence/release-contract-diagnostic.mjs`
- Generated local-only evidence: four market/variant resultJSON files, `evidence.json`, `validation.json`, `release-contract-diagnostic.json`. These are **not committed to the application repository**.
- This report, isolated `HANDOFF.md` and isolated `TRADING_STRATEGY.md` development notes. No primary-checkout handoff overwritten.

AST projection restores only named declarations to the frozen base and requires every remaining source byte, normalized only for Windows line endings, to equal the base. Negative unrelated mutations must fail. Whole tracked executable inventory must equal the five sources above. This development proof does not replace the historical release gate.

### Final executable SHA-256 (working-file bytes)

```text
api/copytrade.ts
eaf306825d96f9358a622176c71711e07120120469d643122df5b867169e4f9b
api/analyze.ts
22aab67b36c95acc76f10d17e1118584e51f24860ada73f45892f06e6b361569
api/_shared/futures-indicators.ts
56d9616881ab809d1f4bfb5cdf7b78c72fa2e0db97fb6d9fa14eeae31d0a99fc
api/_shared/futures-candle-provenance.ts
31b25d6b74d210f601f9299c41a744f42d18610280781733097a71a7c45eab2f
api/_shared/futures-discovery-data.ts
e9365cedb087d006835942b38b5693b03982ef464200fdd949d04183f931cdcc
```

## F. Test Results

Fresh validation uses Node22.23.3 and an explicit offline allowlist. No wildcard test discovery or API bootstrap. Synthetic transports/fake databases are inert; historical replay transport throws on network use. Tests are not private exchange integration tests.

| Suite (scripts/name-test.mjs) | TAP pass | Fail / skipped |
|---|---:|---|
| engine-intelligence-p0 | 16 | 0 /0 |
| engine-intelligence-fast-trader | 19 | 0 /0 |
| engine-intelligence-funding | 13 | 0 /0 |
| engine-intelligence-scope | 11 | 0 /0 |
| futures-shared-engine | 55 | 0 /0 |
| historical-point-in-time | 31 | 0 /0 |
| historical-simulation-timing | 1 wrapper containing16 logical checks | 0 /0 |
| futures-simulation-accounting | 21 | 0 /0 |
| futures-simulation-capital | 27 | 0 /0 |
| futures-simulation-chronology | 41 | 0 /0 |
| futures-simulation-execution | 46 | 0 /0 |
| futures-market-discovery | 36 | 0 /0 |
| futures-entry-freshness | 98 | 0 /0 |
| futures-entry-admission-integration | 65 | 0 /0 |
| owned-futures-entry | 86 | 0 /0 |
| futures-closed-native-candles | 11 | 0 /0 |
| futures-discovery-data | 18 | 0 /0 |
| futures-discovery-live | 46 | 0 /0; name says live, harness is actual-source/inert DB |

Final result: **641/641 TAP tests PASS**, zero failures/skips in this explicit functional/scope allowlist. Counting the16 internal timing assertions instead of their single wrapper gives656 logical checks; these are two counting conventions, not additional641+656 tests. Of the641,59 are new corrective/development-scope tests. Separately, the unchanged historical release-contract diagnostic has **one failed wrapper** and blocks release.

Web build PASS; Admin build PASS;14/14 API entry bundles PASS. Web retains its large-chunk warning. Full configured frontend plus changed-API diagnostic roots: frozen baseline102 diagnostics, candidate102, **introduced0** by file/code/message multiset; neither is globally type-clean. The runner compares base sources in-memory without rewriting the checkout. Fresh `git diff --check` PASS; all8 new JavaScript research/test scripts passed `node --check`. No historical147/147 or earlier-study test total was reused as current acceptance.

Reproduction commands, in the isolated root with Node22 on PATH:

```powershell
node research/engine-intelligence/validate.mjs
node research/engine-intelligence/replay.mjs spot baseline
node research/engine-intelligence/replay.mjs spot candidate
node research/engine-intelligence/replay.mjs futures baseline
node research/engine-intelligence/replay.mjs futures candidate
node research/engine-intelligence/evidence.mjs
node research/engine-intelligence/release-contract-diagnostic.mjs
git diff --check
```

The last diagnostic intentionally invokes the **unchanged** historical gate. Observed exit1, one failed wrapper before individual tests: `Exact owned entry inventory`. New files and changes are not in that previous release's sealed manifest; API hashes would also differ. This is a real promotion blocker, not a failed trade-accounting assertion. The gate and its assertions were not edited, skipped in CI or regenerated. No CI was run.

Intermediate failures were retained in the work history, not hidden:

- A new golden fixture initially assumed a rising/flat StochRSI EMA decayed to exactzero; mathematical checking showed tiny positive residuals. The fixture was corrected; exact falling-zero check remained strict.
- Missing explicit inert context ports initially triggered the actual-function harness boundary check. Throwing stubs were added; no external request occurred.
- Separate VM object prototypes caused a deep-equality assertion despite equal values; complete JSON value equality is used for that deterministic result, not a weaker partial assertion.
- Local validation runner initially attempted an unexported Vite subpath; it now resolves the package's CLI file. Application dependencies/config unchanged.
- One introduced ES2020 TypeScript diagnostic came from `.at(-1)` on the new MTM curve; indexed access replaced it. Existing baseline diagnostics are not relabeled as regressions or hidden with suppressions.

Not run: Production/private APIs, disposable SQL races, full unsafe legacy test wildcard, real browser/account lifecycle, exact-SHA GitHub CI, multi-hour operational soak, unseen alpha holdout, tick-level fill replay, MEXC/Gate profitability, Fast Trader historical alpha. No production readiness is inferred from builds.

## G. Remaining Blockers

1. Historical release scope contract needs a separately reviewed exact successor preserving old financial/security invariants. No main push, manifest weakening or release bypass in this task.
2. Current global TypeScript baseline already has diagnostics, including missing optional frontend dependencies/types and existing API issues. Zero introduced errors is not a globally clean typecheck.
3. Funding events being present does not prove every settlement/interval change was captured. Gap-free native settlement metadata and observed-at history are still needed for strong cost completeness.
4. Full Spot long-layer semantics may require1000-day history;400 is only existing overall minimum. Daily OHLC buy-before-sell sequencing is not intrabar executable proof. Existing legacy projected stage-label handling is not an achieved-profit calculation and was preserved.
5. Standard Futures minimum history currently permits five bars while some indicators require substantially more. FT now enforces210; standard minimum-policy unification requires explicit missing-history tests and contract review, not blind threshold expansion.
6. Simulator daily decision/4h fill cadence differs from live timer cadence. New offline parity proves shared decision mathematics given the same input, not identical live input/AI/account state or latency.
7. No point-in-time universe, rejected-candidate archive, full L2, options or cross-venue granular data. Historical BTC/ETH/SOL selection and repeated data reuse limit generalization.
8. No new alpha passed the prior robustness screen. Spot's five closes and zeroQ3 activity are insufficient. No combination may be accepted merely because a single total looked positive.
9. Old experimental A/B tooling still has legacy Spot-backed input builders; it is not accepted as a central-engine/native benchmark. No user-facing experiment was activated.
10. Development changes are uncommitted and unpromoted. Production SHA, active services, flags and balances were intentionally not queried; report only **zero actions by this task**, not speculative current runtime state.

## H. Production Readiness

| Capability/change | Research/engineering decision | Readiness |
|---|---|---|
| Shared StochRSI zero correctness | IMPLEMENT completed, golden + regression proof | READY FOR REVIEW |
| Spot400 minimum input + separate MTM | IMPLEMENT completed, independent ledger/replay | READY FOR REVIEW; no new alpha accepted |
| FT native shared Demo bridge | IMPLEMENT completed, fail-closed actual-source tests | READY FOR REVIEW; no live activation |
| Binance funding metadata failure handling | IMPLEMENT completed, valid/invalid paired fixture | READY FOR REVIEW |
| Entire branch promotion | Historical exact scope not integrated; not committed/CI tested | BLOCKED |
| Existing common engine/risk/AI role | Preserve proven source boundaries | READY FOR REVIEW of preservation only |
| Funding/OI/liquidity incremental alpha | insufficient independent evidence | NOT READY / RESEARCH |
| L2/liquidation/options/volume-profile/cross-venue alpha | missing suitable causal archive | BLOCKED |
| Spot adaptive/grid/trailing replacement | no robust accepted edge | NOT READY |
| Ensemble/calibrated confidence | baseline/labels incomplete | NOT READY |

**APPROVED FOR CONTROLLED ROLLOUT: none.** There is no new feature flag to turn on; corrections remain in an isolated development diff. Optional experimental policies, Production defaults and all live flags were untouched.

## I. Final Recommendation

الان باید همین اصلاحات محدودِ صحت محاسبه و داده بازبینی شوند؛ نباید با افزودن اندیکاتورهای بیشتر نتیجهٔ ضعیف یا نامطمئن را پنهان کنیم. ابتدا قرارداد انتشار و پوشش داده تکمیل شود، بعد ارزیابی مستقلِ Funding و کیفیت فرصت‌ها با یک تغییر در هر آزمایش انجام شود.

1. **Correct now:** review the five local corrections and their exact scope/negative tests. No Production rollout is authorized by this report.
2. **Complete next:** layer-specific history sufficiency, causal settlement/receipt coverage, actual-cost/marked-output reporting contract and closed-scope successor. Do not silently change legacy projected UI.
3. **Build only after data contract approval:** small research-only, sequence/receipt-aware public-data archive if needed; reuse current providers. Do not build a new strategy engine or a large framework first.
4. **Do not build now:** combined filters, options model, L2 alpha, new Grid/DCA/PP engine, adaptive live exits, duplicated Simulator logic or confidence-as-win-probability. Earlier negative variants stay rejected for integration.
5. **Most important next evidence:** an independent point-in-time sample covering accepted and rejected opportunities, listings, multiple regimes, full costs and open inventory; keep Spot and Futures conclusions separate.
6. **Acceptance:** pre-register the existing screening rules before any next experiment; if data/sample/coverage fails, label UNKNOWN/RESEARCH/BLOCKED rather than tune to green.

```text
ENGINE_INFRASTRUCTURE_IMPROVED_LOCALLY=YES
NEW_ALPHA_ACCEPTED=NO
IMPROVEMENT_IN_PROFITABILITY_PROVEN=NO
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI_DISPATCH=NO
DEPLOYMENT=NO
PRODUCTION_CONNECTIONS=0
DATABASE_CHANGES=0
WORKER_STARTS=0
SCHEDULER_CHANGES=0
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
EXCHANGE_REQUESTS=0
ORDERS_CHANGED=0
POSITIONS_CHANGED=0
SL_TP_CHANGES=0
PREDICTION_MARKET_CHANGED=NO
FINAL_CLASSIFICATION=TECHNICAL_CORRECTIONS_READY_FOR_REVIEW__RELEASE_BLOCKED__ALPHA_NOT_PROVEN
```
