# Futures completion audit — 2026-09-25

## Metadata / Executive result

- Mode: LOCAL DEVELOPMENT ONLY; no deployment.
- Repository: signal0verse/signalverse-main.
- Branch: codex/futures-completion-20260925.
- Previous candidate: `9836d0503f69d6f3083cba73ce3b50c5895135db`.
- Final application branch HEAD (report-only follow-up): `8421c7dec693505e737e5fdafbbccf2fcb0dab9b`.
- Final executable candidate: `cb1fd6425a651fe0b22e5524001d66cfecf5cf4a`. The following report-only commit does not change executable code.
- Engine version: `5.0.0-shared-futures-20260925`.
- Historical replay collection: `2026-09-25T09:42:24.634Z`.
- Final local test matrix: 632/632 Node tests passed; 0 failed, skipped, cancelled.
- **Final acceptance: FUTURES-INCOMPLETE.**
- **IMPROVEMENT PROVEN = NO. PRODUCTION STRATEGY CHANGED = NO.**

خلاصه: انجین تصمیم، اندیکاتورها و ریسک پایهٔ مسیر استاندارد Futures مشترک شدند؛ Simulator دیگر استراتژی مستقل ندارد. Gate برای تحلیل/سیگنال جدید از کندل بومی Futures استفاده می‌کند. با این حال مالک در همین نوبت دستور داد به پوزیشن باز و Spot دست نزنیم. مشاهده‌گر خروج قدیمی Gate در `syncRealGateTrades` هنوز Spot می‌خواند و عمداً دست‌نخورده ماند. بنابراین معیار فراگیر «هیچ کندل Spot در کل Gate Futures» کامل نیست و اعلام COMPLETE درست نیست.

این گزارش نشان‌دهندهٔ فیکس واقعی کد توسعه است، نه صرفاً برنامهٔ کار؛ اما بهبود سودآوری یا تأثیر AI واقعی اثبات نشده است. هیچ دستور VPS، سفارش واقعی/دمو، تغییر DB، سرویس، تنظیم، credential، Guard یا workflow انجام نشد. SHA فعال Production در این نوبت بازخوانی نشده؛ SHA کاندید را runtime معرفی نمی‌کنیم.

## Objective and authorized scope

Finish the Futures engineering candidate: one decision authority for standard Demo Pro, Real Pro and Simulator; native closed inputs; controlled SMC/Supervisor ablation; explicit replay costs; regression and build evidence. Preserve Spot/Prediction/MLM, Guard and existing open-position protection. Owner's latest restriction overrides the broader no-Spot-anywhere acceptance item; it is reported as incomplete, not silently waived.

Work was confined to an isolated checkout. The owner's dirty primary checkout was not reset, cleaned, stashed or synchronized. No application main merge/push, workflow dispatch, release or new live observation was performed. The prior failed Shadow (186 stale inputs) remains FAIL; neither that report nor its frozen runner/ledger was rewritten.

## Confirmed findings and implementation

1. Simulator previously used its own `buildTFSeries`, `confluenceScore`, `confluenceVotes`, `nearbyStructureLevels`, timeframe ranking and setup generation, on generic Spot historical data. Those calls were removed from the Futures Simulator decision path; their unrelated consumers were preserved.
2. `api/_shared/futures-decision-engine.ts` now owns `computeFuturesDecision` (legacy-compatible alias `computeShadowEngineState`). It has no network, DB, credential or venue execution logic. Live `analyzeOneCoinPro` and actual `runSimulation` import this authority.
3. `futures-indicators.ts` is the pure shared indicator implementation. Simulator constructs point-in-time normalized inputs with it; standard live native input builders use the same indicator functions.
4. `futures-risk.ts` owns setup mathematics and decision risk. Invalid price/target geometry, unknown position count, open symbol lock, position cap and leverage constraints fail closed in every mode. Open position count is read for the correct mode, not the Real count for Demo.
5. Simulator takes the Engine's selected interval, side and absolute setup. It does not move SL/TP around the eventual fill. Fill-time geometry is rechecked; an unfavorable gap can reject entry before fee/margin debit. Existing liquidation feasibility, capacity, drawdown sizing and execution rules remain execution constraints.
6. Disabled Real Engine now holds new analysis rather than falling through to legacy AI-primary trading. The real Supervisor gate is pure filter-only: CONFIRM + successful review can approve; CAUTION flags and blocks; REJECT/disabled/unavailable block. Engine levels are not taken from review output. Existing Demo review policy is retained; **decision parity does not claim identical live approval/execution policy**.
7. Gate native public OHLCV/context bridge, provenance, internal analysis route, fresh-entry price and pending-entry native observation were added. Standard Demo and Real inputs use their selected venue (default Demo Binance), with no cross-venue/Spot fallback for those new-decision paths. Unsupported standard venues are rejected before provider/DB work. Whale-specific flow is not being redesigned.
8. Simulator uses public Binance USD-M Klines and funding history. Funding is a signed cash flow on remaining quantity, not a future score input. Empty/unavailable funding is explicitly NOT_AVAILABLE. Summary/UI warn when total-cost economics are incomplete; old runs are not rewritten.

### Shared architecture and full-field parity

```text
Native venue OHLCV + timestamps
  -> canonical fully-closed selection + provenance
  -> shared Futures indicators + point-in-time context + account state
  -> computeFuturesDecision
       -> shared setup / decision-risk gate
       -> direction, score, confidence, timeframe, levels, reasons, evidence
  -> Supervisor filter (where existing mode policy requires it)
  -> venue executor OR isolated simulator fill/time model
```

Twenty-four normalized snapshots compare all decision fields across Demo/Real/Simulator: decision, direction, raw/effective score, confidence, chosen interval, full setup (entry/SL/TP1/2/3), risk, reasons, strategy evidence and multi-timeframe diagnostics. Same normalized input AND same context/account/overrides are required. Neutral trends are not counted as directional agreement. There is no extra mathematical Simulator strategy. A source-wiring test checks the actual live import and actual simulator call and absence of old scoring/setup calls.

The old execution tests still inject deterministic indicator fixtures to isolate fills/accounting; they now translate fixtures into the real shared core, rather than copying its math. These fixtures are not economic evidence. The historical ablation uses actual indicators and actual Engine.

## Mathematical strategy map

The following is the **default standard Engine**, not experimental Fast Trader overrides, private execution or an invented SMC strategy.

| Input/component | Formula / signal | Score / confirmation / conflict | Final default effect |
|---|---|---|---|
| EMA9/21/50 | EMA alpha = 2/(n+1), SMA seed; bullish price > E9 > E21 > E50, bearish reversed | +1 / -1; other alignment 0 | One of five confluence votes |
| EMA200 | Same EMA; distance = 100*(price-E200)/E200 for chosen interval | No score; LONG distance >35% or SHORT <-35% blocks | Extension gate, not a crossover vote |
| EMA cross | E50 crosses E200 between final two samples: golden/death | 0 direct score | Evidence only |
| RSI14 | Wilder average gain/loss; RSI=100-100/(1+AG/AL); AL=0 ->100 | 50<RSI<75: +1; 25<RSI<50: -1; boundaries/extremes:0 | Momentum vote; disagreement offsets other votes |
| RSI divergence | Last low/high vs 10 bars earlier against RSI movement | 0 direct score; no swing-confirmed divergence model | Evidence only |
| MACD | EMA12-EMA26; signal EMA9; hist=line-signal | line>signal and hist>0:+1; inverse:-1; otherwise0 | Momentum vote |
| Bollinger | Mean20, population std20, bands mean±2std; clamped percent-B 0..100 | 50..95:+1; else5..50:-1; else0; exactly50 takes +1 first | Momentum vote; boundary asymmetry is existing behavior, not a new symmetric rule |
| StochRSI | RSI14 in trailing14 RSI range; smoothed EMA3 K then EMA3 D | K>D and K<80:+1; K<D and K>20:-1 | Momentum vote; existing helper uses falsy-zero fallback to50; not silently claimed to be textbook-perfect |
| ATR14 | TR=max(H-L,abs(H-prevC),abs(L-prevC)); Wilder smoothing | No direction vote; fallback last20 ATR, then2% price with data issue | SL distance and risk geometry; fallback is explicit |
| Confirmed swings / S-R | Local high/low with3 preceding and3 subsequent **already closed** bars; last5; SR aliases those swings | 0 direct vote; no independent BOS gate | Structure evidence; no future candles used to confirm a swing |
| FVG | Three-bar gap: H[i-2]<L[i] bullish, L[i-2]>H[i] bearish; retain4 | 0; no mitigation/fill-life gate implemented | Evidence only |
| Order blocks | Opposite prior body followed by reversal body >1.5x its size; retain4 zones | 0; not a full institutional OB/BOS model | Evidence only |
| Nearby structure | Swing/FVG/OB levels within20%, 0.5%-price dedup; nearest4 below/2 above | 0; cannot change default entry/SL/TP | Attribution, not default stop placement |
| BOS / liquidity sweep | No explicit default BOS state machine, sweep classifier, order-book liquidity model | No contribution | NOT IMPLEMENTED; do not relabel FVG/OB detection as proof of these |
| CPR daily/weekly | Previous available closed bar: pivot=(H+L+C)/3; BC=(H+L)/2; TC=2*pivot-BC; ordered band | Default0; explicit experiment overrides can veto | Evidence in standard Engine, not enabled strategy alpha |
| Higher-timeframe context | Score each selected interval; choose abs(score)>=4; maximize abs; ties favor higher rank15m<1h<4h<1d<1w | No weighted average and no mandatory N-of-M vote; alignedCount is diagnostic | Selected interval drives setup; no qualifier ->WAIT (fallback TF evidence only) |
| Market regime | Existing point-in-time regime input; confidence>=0.5 and opposite risk environment | Hard veto; soft regime score contribution disabled by default | LONG/RISK_OFF or SHORT/RISK_ON ->NO_TRADE |
| Stablecoin supply | Existing 30-day trend context | LONG blocked below-3%; SHORT exempt; missing null does not invent trend | Macro filter; missing context remains limitation |
| Funding / OI | Native venue funding and OI context, where available | No direct core vote; can inform reviewer; historical funding is booked only at its timestamp | Context/cost, not silently a direction signal |
| Ichimoku / ADX | No implementation in the active shared indicator/core modules (source search) | None | NOT IMPLEMENTED |
| Setup / entry | Entry=selected closed price; D=1.25*ATR; SL=entry-sign*D; TP1/2/3=entry+sign*(2,3.5,5)*D | Shared R:R>=1.9, positive finite ordered targets, lock/count/leverage gates | If gates pass ->raw-score LONG/SHORT; otherwiseNO_TRADE |

Raw score is the sum of five votes; confidence=clamp(abs(effectiveScore)/5,0,1), **not calibrated win probability**. Default effectiveScore=raw score. No qualifying interval means WAIT. A qualifying score can still be blocked by macro/risk; reviewers cannot manufacture an entry from WAIT.

Known inherited indicator warmup/default behavior was extracted, not secretly optimized: usual native window250; minimum accepted window remains5; EMA short-history fallback, short BB denominator and zero-value Stoch defaults require a separately evidenced strategy change. This audit does not certify sparse/new-listing history as a full200-bar warmup. Invalid OHLCV, gaps, stale/forming candles fail input checks independently.

## Native candle provenance / timeframe boundaries

| Venue | Native source / timestamp contract | Implemented local evidence | Limit |
|---|---|---|---|
| Binance | USD-M /fapi/v1/klines; native index6 is inclusive close milliseconds | Native close must equal open+duration-1; selector waits until end-exclusive boundary; input hash and close evidence recorded | Public/input and offline checks only; no fresh Real decision observation |
| MEXC | Contract Kline time[] is opening seconds; Min15/Min60/Hour4/Day1/Week1 | Close=open+duration (exclusive); no price reconstruction from Spot; full source identity | No private lifecycle exercised |
| Gate | /api/v4/futures/usdt/candlesticks, contract=BTC_USDT, timezone=utc0; t is opening seconds | Native OHLCV, exclusive close=open+duration, hash, GATE_TRADE_PRICE, all-selected-TF fail-closed; contract context from /futures/usdt/contracts | New analysis/entry path complete locally; old open-position exit observer deliberately excluded |

Exact-boundary tests cover15m/1h/4h/1d plus optional Monday-anchored1w for all three venues. Inputs after the decision cannot affect indicators. At a boundary the latest fully closed candle is required; previous-period stale cache/data is rejected, not used as a substitute. Missing/nonfinite OHLCV, off-grid, gaps/duplicates and malformed chronology fail closed. Gate public probes in this task also confirmed all five interval names returned native data; they do not prove account execution.

Gate supports natural1w, not an assumed synonym7d. Reference: [Gate official Futures API](https://www.gate.com/docs/developers/apiv4/en/futures/). Binance source field reference: [USD-M Kline data](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Kline-Candlestick-Data). Source semantics plus recorded native fields are used; no rounded decision timestamp is invented.

**Remaining Gate defect:** actual `syncRealGateTrades` still calls `fetchKlineExtremes(detectPair, sinceMs, 'spot')` for existing-position exit observation. Owner declined altering open-position logic. It is unchanged, is not newly introduced, and is NOT a PASS for all Gate market data.

## Risk, size, leverage and costs

Decision risk is shared: correct signed geometry, positive finite entry/SL/TP, minimum RR1.9, no open signal lock, finite known position count <5, leverage1..125. This unifies the previously mode-specific decision gate; it does not claim identical monetary execution on different venues.

Execution sizing remains venue-specific: requested margin and leverage -> available balance/capacity checks -> contract/quantity/tick rounding -> fill -> native protection. Simulator uses its existing fixed/percentage margin, free-capital reservation, global concurrency, drawdown throttle and isolated-liquidation approximation; these constraints can reject/reduce a fill but cannot invent a different Engine setup. The intended signal levels are frozen.

Costs in replay:

- Gross=(exit-entry)*qty for LONG; inverse for SHORT.
- Entry and exit taker fee=executed price*executed quantity*feeRate, including partial exits.
- Signed funding=LONG(+1)/SHORT(-1)*remainingQty*nativeMarkPrice*rate. Positive means paid; negative received.
- Closed net=gross-fees-funding; R=closed net / original stop-risk notional.
- Opening fees/funding affect booked balance even for still-open positions; unrealized MTM is separate.
- Empty/missing funding ->NOT_AVAILABLE, not proof of zero cost. UI labels incomplete economics.
- No fee tier, maker rebates, spread/queue model or exchange invoice is fabricated.

## Paired historical SMC ablation and outcomes

Actual shared Engine/indicators and actual `runSimulation` were used; no copied shadow score proxy. Fixed window2026-08-01T00:00:00Z to2026-09-01T00:00:00Z. The existing simulator includes the end timestamp for observable open/funding events; this is **not** described as end-exclusive. Three symbols BTC/ETH/SOL; default15m/1h/4h/1d; last250 causal input bars per TF. All arms use identical public responses, cached in memory within the paired run.

Explicit assumptions: starting equity10000 USDT; margin250 per entry; requested leverage2; fee0.05% each leg; entry/stop slippage0.02%; TP allocation100/0/0; SL multiplier1.25; maintenance margin0.5%; daily decision clock;4h execution OHLC with adverse/SL-first ambiguity; fills at observable open quote; no trailing, no drawdown throttle; no forced terminal liquidation. Native funding:93 records each symbol,279 total. Stablecoin/regime historical context unavailable; both arms use null/disabled context consistently, not invented macro history. This is a restricted comparison, not full Production reproduction.

A=full default Engine. B=same inputs with swings/FVG/OB/SR emptied. Across54 evaluated decisions: **0 changes** in decision/direction/score/confidence/timeframe/setup/risk/entry/SL/TP1/TP2/TP3. Structure evidence changes; default trading outputs do not. Incremental SMC contribution in this default path is zero, **not evidence that SMC can never help a different strategy**.

| Group (A and B identical) | Closed | Wins/losses | Gross USDT | Fees | Signed funding | Net USDT | Avg R |
|---|---:|---:|---:|---:|---:|---:|---:|
| All |15|5/10|-1.847888|7.594173|-1.407329|-8.034732|-0.090325|
| LONG |6|4/2|93.248792|3.046624|0.942823|89.259345|0.869081|
| SHORT |9|1/8|-95.096680|4.547548|-2.350152|-97.294077|-0.729929|
|15m|2|1/1|2.272782|1.004908|0.045146|1.222728|0.284230|
|1h|3|2/1|21.254784|1.502359|-0.000690|19.753115|0.860026|
|4h|5|1/4|7.976636|2.529144|0.440747|5.006744|-0.487283|
|1d|5|1/4|-33.352089|2.557762|-1.892532|-34.017319|-0.413400|

Daily-sampled max drawdown0.8052126155%; final booked balance9991.4652682572; two positions still open, unrealized-0.199960008; total equity change-8.7346917508. Closed net is not total terminal equity change because open entry fees are booked. Daily sampling can understate intraday drawdown;4h OHLC cannot resolve exact within-bar funding/SL order. Funding is charged after same-time observable exits and before new entries. This disclosed model convention is not native invoice evidence.

Small samples, unequal horizons, open trades and absent macro context preclude a profitable/best-timeframe recommendation or a stable out-of-sample improvement claim.

## Supervisor ablation — fixture versus actual AI

The live standard Engine is authoritative; `reviewFuturesEngineDecision` only returns approval/flag/verdict metadata. No direction/entry/SL/TP can be accepted from its fixture payload. Existing Real requires CONFIRM; Demo retains its distinct review policy.

For the historical filter comparison, baseline candidate decisions are frozen by causal input/time hash; the filtered arm cannot create extra opportunities simply because it rejected a previous position. A deliberately synthetic causal hash-based fixture produces CONFIRM/REJECT/CAUTION/unavailable **without inspecting future outcomes**. It is a gate/economic plumbing exercise, not AI:

| Fixture outcome | Count |
|---|---:|
| Approve |3|
| Reject |9|
| Flag (CAUTION; not executed) |2|
| Unavailable (not executed) |7|
| Direction / level rewrites |0|

Of21 trade-intent candidate reviews,18 were filtered. Three approvals yielded two closed and one open position. Closed wins/losses1/1; gross-11.6769205146, fees1.0118826481, funding-0.4296321506, net-12.2591710121 USDT; averageR0.3624106903; daily maxDD0.1836934488%; terminal equity change-12.6091510161. LONG closed1 net5.4960197394; SHORT closed1 net-17.7551907515. Timeframes:15m one,1d one,1h/4h no closed trades. Lower drawdown with fewer trades is not proof of beneficial intelligence; net outcome here was worse than Engine-only.

Actual AI economic effect: **NOT_AVAILABLE / NOT PROVEN**. No fresh timestamp-linked real AI verdict + identical candidate/outcome dataset was collected and no LLM was called. Existing sanitized `docs/testing/futures-engine-supervisor-assessment-2026-09-22.md` reported historical all-CONFIRM reviews, not a causal paired efficacy experiment. Do not attribute the synthetic fixture's results to that AI.

## Exchange abstraction and protection audit (unchanged lifecycle)

The conceptual interface is implemented through `FuturesExchangeAdapter` plus venue helpers, not eleven falsely claimed identical public methods.

| Required operation | Actual mapping |
|---|---|
|getMarketInfo|Venue helpers getSymbolInfo / getMexcContractInfo / getGateContractInfo|
|getBalance / getPosition|Adapter methods, normalized balance/position snapshot; unknown is not flat|
|placeEntry|Adapter ->openBinanceTrade/openMexcTrade/openGateTrade, fill validation + initial protection|
|placeProtection / replaceProtection|Adapter ensureProtection ->ensure*ProtectionLeg and native placement/query/cancel helpers|
|getOrder / cancelOrder|Venue signed order/status/algo/plan helpers; not a universal adapter method|
|closePosition|Existing applyReal*Action / close*Trade paths, native reduce-only/close semantics|
|reconcilePosition|Adapter method and syncReal*Trades|
|getExchangeCapabilities|Readonly adapter.capabilities; no duplicated capability policy inside Engine|

Venue details: Binance symbolBTCUSDT, base quantity + MARKET_LOT_SIZE/LOT_SIZE/tick/notional filters and leverage brackets, one-way integration, configurable isolated/cross; SL contract trigger versus TP mark trigger. MEXC BTC_USDT, contractSize conversion/vol precision/price unit-scale, isolated one-way side codes, expiring plan protection and refresh. Gate BTC_USDT, integer contract sizing/quanto multiplier and price round, isolated one-way, native price orders. Capability flags describe this integration, not every venue feature.

Entry attempts PREPARED/SUBMITTED/UNKNOWN remain durable holds. Partial fills, ambiguous fills, missing position responses, lost submissions, protection failure/unwind verification, restart reconciliation and vanished-position accounting are covered by existing offline fault tests. No unknown hold was removed or resubmitted. Live protection/fresh accounting gates for Binance/MEXC/Gate remain **NATURALLY PENDING**; no trade was manufactured.

Read-only AST scope check against previous candidate proves117 Spot functions and20 selected entry/protection/reconciliation functions are byte-identical (normalized line endings). This includes all three open*/syncReal* paths checked and the frozen Gate observer. It is a precise source scope proof, not proof of live account health or no unrelated actor's Production change.

## Test matrix / commands

All commands were run in the isolated worktree with Node24.19.0. Project deployment target is Node22; no CI22 success is claimed. API bootstrap, environment files, production credentials, database and order transports were excluded from the tests.

```powershell
node --test --test-reporter=./scripts/lib/futures-compact-reporter.mjs scripts/futures-shared-engine-test.mjs scripts/futures-binance-provenance-validation-test.mjs scripts/futures-candle-provenance-test.mjs scripts/futures-correctness-test.mjs scripts/futures-mexc-native-routing-test.mjs scripts/futures-real-price-basis-test.mjs scripts/futures-reanalysis-test.mjs scripts/futures-simulation-execution-test.mjs scripts/futures-simulation-chronology-test.mjs scripts/futures-simulation-accounting-test.mjs scripts/futures-simulation-accounting-ui-test.mjs scripts/futures-simulation-capital-test.mjs scripts/futures-real-execution-fault-test.mjs scripts/futures-gate-mexc-fault-test.mjs scripts/historical-point-in-time-test.mjs scripts/historical-simulation-timing-test.mjs scripts/simulation-analytics-test.mjs scripts/futures-pro-timeframes-test.mjs scripts/futures-tp-allocation-test.mjs scripts/binance-final-funding-test.mjs
node scripts/futures-completion-scope-check.mjs --types
node scripts/futures-completion-replay.mjs --public-history
npm run build
npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --allowImportingTsExtensions --skipLibCheck api/_shared/futures-decision-engine.ts api/_shared/futures-indicators.ts api/_shared/futures-risk.ts api/_shared/futures-supervisor.ts api/_shared/futures-market-data.ts api/_shared/futures-candle-provenance.ts
```

| File (scripts/) | Final Node test count | Result |
|---|---:|---|
|futures-shared-engine-test.mjs|55|PASS — parity/SMC/Supervisor/risk/funding/Gate/boundaries|
|futures-binance-provenance-validation-test.mjs|35|PASS|
|futures-candle-provenance-test.mjs|7|PASS|
|futures-correctness-test.mjs|10|PASS|
|futures-mexc-native-routing-test.mjs|7|PASS|
|futures-real-price-basis-test.mjs|6|PASS|
|futures-reanalysis-test.mjs|140|PASS|
|futures-simulation-execution-test.mjs|46|PASS|
|futures-simulation-chronology-test.mjs|41|PASS|
|futures-simulation-accounting-test.mjs|21|PASS|
|futures-simulation-accounting-ui-test.mjs|18|PASS|
|futures-simulation-capital-test.mjs|27|PASS|
|futures-real-execution-fault-test.mjs|119|PASS|
|historical-point-in-time-test.mjs|31|PASS|
|simulation-analytics-test.mjs|54|PASS|
|binance-final-funding-test.mjs|11|PASS|
|futures-gate-mexc-fault-test.mjs|1 file case (32 internal groups)|PASS|
|historical-simulation-timing-test.mjs|1 file case (16 internal checks)|PASS|
|futures-pro-timeframes-test.mjs|1 file case (18 internal checks)|PASS|
|futures-tp-allocation-test.mjs|1 file case (legacy internal assertions)|PASS|
|TOTAL|632|0 failures/skips/cancellations|

Do not add internal legacy groups again to632. Existing mixed historical test retains its unchanged Spot assertions only as isolation regression; no Spot strategy work was performed.

Failures encountered and resolved: extraction moved pure declarations/imports out of API files, so test harnesses needed actual shared bindings (not mocked replacement scores); the execution fault harness initially lacked FUTURES_NATIVE_SOURCE (25 cascading failures); old timeframe source assertion expected Demo Spot; old fill tests expected now-forbidden reanchoring; a bounded TP structural regex was too short after Gate pricing. Assertions now verify frozen levels/gap rejection and actual native/shared wiring, not weaker expected economics. Final matrix has zero failures.

Excluded: old mixed `engine-first-consensus-test.mjs` uses a hard-coded primary checkout and obsolete legacy AI-primary/Spot structural assumptions; it was not modified to green the candidate. Relevant Futures filter/authority behavior has dedicated current tests. Unsafe legacy scripts that read .env/DB were not run. No new SQL schema/transaction work was required or claimed.

## Build and typecheck

- Web build PASS:2022 modules; admin build PASS:1713 modules. Existing web chunk-size warning remains.
- esbuild both API entrypoints, bundle=true, platform=node, target=node22, packages=external, write=false: PASS,0 errors,0 warnings; no output artifact installed.
- Six shared Futures modules TypeScript check: PASS.
- API full dependency check:30 diagnostics at frozen baseline and30 now, **0 introduced** by multiset comparison through a read-only compiler host.
- Repository-wide `tsc --noEmit` is still NOT green (existing frontend/dependency diagnostics). No claim of full-repository type cleanliness.
- `git diff --check`: PASS before commit. Source-only, not deployment readiness.

## Exact files changed

Application:
- api/_shared/futures-candle-provenance.ts
- api/_shared/futures-decision-engine.ts (new)
- api/_shared/futures-indicators.ts (new)
- api/_shared/futures-market-data.ts (new)
- api/_shared/futures-risk.ts (new)
- api/_shared/futures-supervisor.ts (new)
- api/analyze.ts
- api/copytrade.ts
- src/app/App.tsx (Futures simulation cost evidence display only)

Tests/tooling:
- scripts/futures-binance-provenance-validation-test.mjs
- scripts/futures-candle-provenance-test.mjs
- scripts/futures-completion-replay.mjs (new)
- scripts/futures-completion-scope-check.mjs (new)
- scripts/futures-correctness-test.mjs
- scripts/futures-mexc-native-routing-test.mjs
- scripts/futures-pro-timeframes-test.mjs
- scripts/futures-real-execution-fault-test.mjs
- scripts/futures-real-price-basis-test.mjs
- scripts/futures-reanalysis-test.mjs
- scripts/futures-shared-engine-test.mjs (new)
- scripts/futures-simulation-accounting-test.mjs
- scripts/futures-simulation-accounting-ui-test.mjs
- scripts/futures-simulation-capital-test.mjs
- scripts/futures-simulation-chronology-test.mjs
- scripts/futures-simulation-execution-test.mjs
- scripts/futures-tp-allocation-test.mjs
- scripts/historical-simulation-timing-test.mjs
- scripts/lib/actual-futures-core.mjs
- scripts/lib/futures-compact-reporter.mjs (new)
- scripts/lib/futures-pure-test-context.mjs (new)
- scripts/lib/futures-simulation-fixtures.mjs (new)

Documentation:
- HANDOFF.md
- TRADING_STRATEGY.md (dated Futures candidate amendment; old history preserved)
- docs/AI_HANDOFF.md
- docs/testing/stability-test-runbook.md
- reports/futures/futures-completion-audit-2026-09-25.md (this report)

Inspected evidence additionally: AGENTS.md, CLAUDE.md, complete strategy history, existing completion report, native/provenance/reanalysis/fault code/tests, docs/testing/futures-engine-supervisor-assessment-2026-09-22.md and AI-Log report template. No private account exports or raw test artifacts are committed.

## Remaining issues / acceptance

| Requirement | Result |
|---|---|
|One standard Futures Engine; Demo/Real/Simulator wiring, no Simulator scoring duplicate|PASS locally|
|Full-field decision/risk/MTF parity; native closed new-decision input for Binance/MEXC/Gate|PASS locally|
|Traceable component formulas; SMC default contribution measured|PASS (zero incremental decision/economic effect observed)|
|Supervisor architecture and controlled fixture economic plumbing|PASS locally; actual AI efficacy NOT PROVEN|
|Shared decision risk, fee/funding representation|PASS locally, execution assumptions explicitly limited|
|Existing protection/reconciliation regression|PASS offline; private natural lifecycle still pending|
|No Spot candle anywhere in Gate Futures|INCOMPLETE — frozen open-position observer, owner forbids alteration|
|Futures tests and web/admin/API builds|PASS locally; repository-wide tsc remains baseline-limited|
|No unrelated Production action|YES: no such action performed; runtime not independently queried this task|
|Profitability/stable economic improvement|NOT PROVEN|
|Final status|FUTURES-INCOMPLETE|

The remaining Gate item is a real engineering gap, not merely insufficient economic sample size. Therefore FUTURES-COMPLETE-WITH-ECONOMIC-VALIDATION-LIMITATION would be inaccurate.

Next safe step is owner review of this **unreleased** candidate and this explicit preserved Gate limitation. Do not alter an open position, start another Shadow, deploy, or grant real trading authority from this report. Any strategy addition/weighting needs a new controlled comparison; the negative small replay is not authorization to optimize toward a favorable historical score.

## Git / publication state

Executable candidate committed locally on the isolated codex branch; application push/main merge/deployment=NO. Temporary local tooling remains untracked and was not staged. This report is committed separately and mirrored to SignalVerse-AI-Log/master; the actual publication commit/remote verification are reported with the final response, not inferred from a local save.

## Public replay input digest manifest

Each digest is SHA-256 of JSON.stringify(parsed public response) in request order, not a hash of raw HTTP bytes. No account or credential data is present.

| Public request | SHA-256 |
|---|---|
| https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=15m&startTime=1785317400000&endTime=1788220800000&limit=1000 | bdb9fbf1f5267413a6ea6d7b54dc7bac4bfe143a4b1169058473e2a6e562abc1 |
| https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=15m&startTime=1786217400000&endTime=1788220800000&limit=1000 | 9909858fe1de1929732d7b94cf06c59d8f16a977a85070274ebb2143d41ea0df |
| https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=15m&startTime=1787117400000&endTime=1788220800000&limit=1000 | 7b457be543b70a098bb6ad86948aa8d615284afe508d6db1a329e4521a96b4b8 |
| https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=15m&startTime=1788017400000&endTime=1788220800000&limit=1000 | c86f79daa5862943f94a322669b183f59e35b0ebebb4cf64accac13cdbcd2aef |
| https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=1h&startTime=1784642400000&endTime=1788220800000&limit=1000 | a79351e89e3ae9143162e0a60abd85c8d2ac09cdd730aa06cf6b57b11d22d210 |
| https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=4h&startTime=1781942400000&endTime=1788220800001&limit=1000 | a4d6ea0842571384d1b0e4c4473d360170a4008443f179d008732ad370e194b7 |
| https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=1d&startTime=1763942400000&endTime=1788220800000&limit=1000 | f8f590a397d905baea35249bdaccbbf619afe2f68d63fa27daa5cad10f032529 |
| https://fapi.binance.com/fapi/v1/klines?symbol=ETHUSDT&interval=15m&startTime=1785317400000&endTime=1788220800000&limit=1000 | a99b2cf0247786a94535083b1f0e7b1871634168cd27bcbc5933d986b844d5cd |
| https://fapi.binance.com/fapi/v1/klines?symbol=ETHUSDT&interval=15m&startTime=1786217400000&endTime=1788220800000&limit=1000 | 8ab4a8c8ec732249bba1de3323b2129abf0659f4127c271b79adcf802d6e5839 |
| https://fapi.binance.com/fapi/v1/klines?symbol=ETHUSDT&interval=15m&startTime=1787117400000&endTime=1788220800000&limit=1000 | fe0273fd1178e1b4ffb39af553680bb32d89d675984244949cd62101bc748359 |
| https://fapi.binance.com/fapi/v1/klines?symbol=ETHUSDT&interval=15m&startTime=1788017400000&endTime=1788220800000&limit=1000 | 4a5129de0ac92629887fd0c31ad189befa30afe787209bb212c4f78e7a42662f |
| https://fapi.binance.com/fapi/v1/klines?symbol=ETHUSDT&interval=1h&startTime=1784642400000&endTime=1788220800000&limit=1000 | 81705e4264be41c4fa0feab1e663358eb79cf1175316c860e800814ef0ea7986 |
| https://fapi.binance.com/fapi/v1/klines?symbol=ETHUSDT&interval=4h&startTime=1781942400000&endTime=1788220800001&limit=1000 | 2f977407f4d49676dc3fd5e80d8f664739e4d41e4c2d38f58c619fd7d2bdb923 |
| https://fapi.binance.com/fapi/v1/klines?symbol=ETHUSDT&interval=1d&startTime=1763942400000&endTime=1788220800000&limit=1000 | fa79b8832b6634997302aa7f37168067be68db3ee32ebb182919b28da4acf4ca |
| https://fapi.binance.com/fapi/v1/klines?symbol=SOLUSDT&interval=15m&startTime=1785317400000&endTime=1788220800000&limit=1000 | 416a61826a1a2ecc5b00faef4ea36285264865f0b2aac5cce5b344df9c7932ff |
| https://fapi.binance.com/fapi/v1/klines?symbol=SOLUSDT&interval=15m&startTime=1786217400000&endTime=1788220800000&limit=1000 | 2abbd26c6128c1f494f90c63b01683e8a10c75ee0b3b4a14f943e5b24a06d469 |
| https://fapi.binance.com/fapi/v1/klines?symbol=SOLUSDT&interval=15m&startTime=1787117400000&endTime=1788220800000&limit=1000 | 83f90c521d43a52124e25920bff831493038b5da0fd57f5d0693ad03a67af2de |
| https://fapi.binance.com/fapi/v1/klines?symbol=SOLUSDT&interval=15m&startTime=1788017400000&endTime=1788220800000&limit=1000 | 4bfcc46e7cce446b20018094727a183f9195f0bc228786fe8c0658d889ccdfa0 |
| https://fapi.binance.com/fapi/v1/klines?symbol=SOLUSDT&interval=1h&startTime=1784642400000&endTime=1788220800000&limit=1000 | e8ffb19fb815f133ed07be056e32da77e3c1ebe0fc6e18028b766712aa7190d3 |
| https://fapi.binance.com/fapi/v1/klines?symbol=SOLUSDT&interval=4h&startTime=1781942400000&endTime=1788220800001&limit=1000 | 927b3fc1ce653ca118a1a7f8e9ad6fec348412ef8db1766635eaf4ee2e5f8805 |
| https://fapi.binance.com/fapi/v1/klines?symbol=SOLUSDT&interval=1d&startTime=1763942400000&endTime=1788220800000&limit=1000 | 881ccb40eb0597c803881deaee8083215700b423df930b469fc69a32fa8206bf |
| https://fapi.binance.com/fapi/v1/fundingRate?symbol=BTCUSDT&startTime=1785542400000&endTime=1788220800000&limit=1000 | abe1f0417251fc9e13e2bea0668bdc7d42a4faa71e0cbbe6fd8f4bcb7cd9cb35 |
| https://fapi.binance.com/fapi/v1/fundingRate?symbol=ETHUSDT&startTime=1785542400000&endTime=1788220800000&limit=1000 | 4899b131894d6741a53f844bffe8f8df629295401b927271b1d69f250f5d522b |
| https://fapi.binance.com/fapi/v1/fundingRate?symbol=SOLUSDT&startTime=1785542400000&endTime=1788220800000&limit=1000 | d172259f34793578854c5dfe61471549c74c55f36b19a1e9620c663b8aa109ba |
