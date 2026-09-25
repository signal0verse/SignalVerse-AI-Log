# Gate existing-position native Futures source fix — 2026-09-25

## Metadata / executive result

- Task: FINAL GATE POSITION-MANAGEMENT FIX, local code + deterministic offline tests only.
- Repository: SignalVerse-Main; branch: codex/futures-completion-20260925.
- Requested previous executable candidate: `fc5a730029e617ee807aae59c722b462501b54ee`.
- Starting checkout: `d92c53c69afb81945847159d595a03150f841947` (subsequent classification documentation; executable code identical to fc5).
- New executable commit: `a4c1edcedacc1787f9d2bb78ebbc21e898b86900`.
- Final local documentation commit: `05213455614fa16ccadb0d9e1ee715c93f3bc9da`.
- Publication target: signal0verse/SignalVerse-AI-Log, master, this dated reports/futures path. Application branch is not pushed.
- Final evidence review: 2026-09-25T11:10:11Z; subsequent in-memory API bundle recheck also passed.
- Gate observer source correction: **PASS locally**. The active application exit observer no longer consumes Binance Spot.
- Comprehensive acceptance: **FUTURES-INCOMPLETE**. The independent shared fee/funding representation criterion remains unfulfilled; it is not silently waived because the Gate fix passes.
- IMPROVEMENT PROVEN = NO. PRODUCTION STRATEGY CHANGED = NO.
- No VPS, deployment, main push/merge, exchange request/write, live position, credential, DB, Guard or Production action. Only official public documentation was consulted externally for source semantics. Mock HTTP includes synthetic private order operations in memory, never on an exchange.
- Current deployed SHA/live activity was NOT inspected. A local commit is not evidence of rollout.

## Objective and permitted scope

Replace ONLY the wrong market-data source in existing Gate position observation. Preserve exit mathematics and all execution, protection, reconciliation and accounting functions. The new owner request explicitly authorizes this local observer correction; the earlier source-classification evidence is preserved as history. No actual position is touched.

The primary checkout and its unrelated work remain untouched. Work used the existing isolated candidate checkout; pre-existing untracked tmp/ was not staged. No strategy vote, level, sizing, accounting formula, Demo, Simulator, Binance/MEXC implementation or user-facing workflow was edited.

## Exact changes

| File | Change |
|---|---|
| api/_shared/futures-market-data.ts | Extend existing Gate native transport with an optional bounded 1m from/to request, native schema/identity validation; old limit-only NEW-analysis request remains identical. Export its existing request type. |
| api/_shared/gate-futures-observer.ts | New narrow existing-position window adapter: native 1m paging, chronology/completeness/finite-value checks, high/low aggregation, no cache/fallback. |
| api/copytrade.ts | Import adapter and replace only syncRealGateTrades candle lookup. Keep its cache parameter for caller compatibility but do not consume it. |
| scripts/futures-gate-observer-native-test.mjs | 111 offline source, mutation, parity, invalid-input and actual-function lifecycle tests. |
| scripts/futures-completion-scope-check.mjs | Freeze comparison at fc5, allow only authorized syncRealGateTrades change; compare all other declared functions and API diagnostics. |
| reports/futures/gate-position-management-native-futures-fix-2026-09-25.md | This report. |
| reports/futures/futures-completion-audit-2026-09-25.md | Append-only-in-history current addendum; retain earlier findings. |
| HANDOFF.md | Latest scoped implementation/evidence/remaining-limit entry. |

The first five files are in the executable commit above. The last three are a separate documentation commit; its final SHA is returned in the conversation. No application branch was published.

## Phase 1 — exact semantics and call graph

### Old path at fc5

```text
cron-sync-all -> handleCronSyncAll -> OPEN real Gate trades
or authenticated POST action=sync -> matching OPEN real Gate trades
-> syncRealGateTrades
-> native Gate position lookup
-> ensureProtection using persisted stop_loss / tp1
-> spotPairFor + shared cache OR fetchKlineExtremes(..., 'spot')
-> Binance Spot /api/v3/klines, interval=1m
-> aggregate high/low -> decideRealTradeAction
-> adapter.reconcilePosition -> applyRealGateAction
-> native Gate position re-read -> closeGateTrade
-> confirmed complete fill -> cancelGateTriggerOrders
-> reconcileGateClosePnl -> persisted closure / outcome / lock resolution
```

### New path at a4c1edc

```text
same two callers and position/protection checks
-> syncRealGateTrades [api/copytrade.ts:7850; source call:7886]
-> fetchGateFuturesObserverWindow(contract, sinceMs, observedAtMs, fetchWithTimeout)
-> fetchGateNativeFuturesCandles(contract, '1m', ..., {fromMs,toMs})
-> GET api.gateio.ws/api/v4/futures/usdt/candlesticks
-> native t/OHLCV validation + complete contiguous 1m window + high/low
-> SAME decideRealTradeAction [2326]
-> SAME createGateFuturesAdapter [8164] -> applyRealGateAction [7833]
-> SAME closeGateTrade [7775] / gateAwaitFill [7611]
-> SAME cancelGateTriggerOrders [7709]
-> SAME reconcileGateClosePnl [7807] / vanished-position branch [7818]
-> SAME persisted patch / unlock / post-trade notification
```

Direct callers at the new source: handleCronSyncAll:14600 and authenticated handler:17503. This proves production-facing source reachability, not an observed live invocation.

| Question | Exact preserved behavior |
|---|---|
| Why high/low? | Detect a threshold touched during the observation window even if the latest close is back inside the range. Not a close-only exit. |
| Timeframe | Native Gate 1m, matching the former 1m observer. |
| Window | since = last_synced_at or opened_at; lower bound min(since, observedAt - 60 seconds). Only candle opens at/after that bound; aligned with ceil(bound/60s). At most 6 x 1000 bars. |
| LONG | SL when window low <= stored stop_loss; TP when high >= stored tp1. |
| SHORT | SL when high >= stored stop_loss; TP when low <= stored tp1. |
| Both touched | SL first, including when both occur anywhere in the aggregated window. No intrabar path/order reconstruction invented. |
| Price basis | Unprefixed Gate USDT contract trade-price OHLCV, consistent with existing Gate protection price_type=0. No mark/index substitution. |
| Timing | Current forming minute remains usable. Mid-minute requires that minute's snapshot; at the exact boundary the just-closed prior minute may be accepted if the zero-age new bar is not published. Never substitute close-only NEW-entry selection. |
| Exit execution | Stored side/current contract size, market-style price=0, tif=ioc, reduce_only=true; all unchanged. |
| Actual exit price | Confirmed Gate fill/history, not the candle close/high/low. Native history fallback behavior unchanged. |
| State writes in application | No-hit: last_synced_at and excursion. Confirmed exit: existing status/qty/close price/PnL/fee/outcome/protection-ID patch and signal unlock. No DB was used by the tests. |
| Invalid candles | No software-exit inference or sync-time advancement. The existing protection check already ran; it is not disabled by a public-data failure. |
| Unknown/partial execution | Retain existing failure/uncertain handling; do not falsely persist closed, cancel protection or unlock before complete-fill confirmation. |

The old lower-bound behavior can omit the candle containing a sub-minute start. Aggregate SL-first can be conservative when TP occurred earlier. Both limitations are preserved intentionally, not redesigned.

## Native source contract and failure behavior

The [official Gate Futures candlestick API](https://www.gate.com/docs/developers/apiv4/en/futures/#futures-market-k-line-chart) documents contract/interval, Unix-second from/to, t/OHLCV objects and incompatible limit versus from/to parameters. The existing transport normalizes t to milliseconds. The observer uses a minute-open grid, with interval end open + 60s exclusive; it does not invent a Binance native close-time field.

Requests use only the fixed Gate Futures USDT endpoint, exact contract, 1m and utc0. Range requests omit limit. No import/call to the new-entry builder, Binance, MEXC or Spot fallback exists in this path. The generic fetchWithTimeout retains its existing 15-second timeout.

Fail closed for missing first/last/middle bars, stale current snapshot, gaps, duplicates, malformed/off-grid/future timestamps, non-finite or impossible OHLCV, wrong explicit contract/interval, wrong timeframe grid, Spot arrays, MEXC-shaped objects, empty data, HTTP/JSON/timeout failure or a failed later page. Do not use a valid partial prefix. Over-budget windows return unknown rather than truncate successfully. No shared cache is read or written; consecutive polls request fresh native snapshots.

**Evidence limitation:** Gate's ordinary response does not echo contract/interval. Binding is the fixed request plus native schema/time grid. Explicit mismatched labels are rejected when present; an identically shaped, unlabeled wrong-series response cannot independently authenticate its identity. Offline fixtures do not prove the live server's identity/completeness/latency or publication delay. This task makes no live API call.

## Offline parity and regression evidence

- 14 deterministic LONG/SHORT cases: SL, TP, neither, both in one bar, multi-bar, price gap, boundary. The actual frozen old fetchKlineExtremes and decideRealTradeAction were extracted from fc5; the new path uses the actual canonical transport and adapter. Identical normalized prices produce identical extremes and exit decisions.
- Source guard follows observer -> window -> canonical Gate transport. Negative mutation cases prove that Spot parameter/helper/import, Binance Spot URL, Binance/MEXC helper, history fallback or spotPairFor insertion fails the guard.
- Timing tests cover current-bar high/low touch with non-touch close, lower-bound alignment and exact boundaries. Paging covers 1000/1001/6000/6001 bars, reverse order normalization and second-page failure.
- 26 invalid-data variants are checked directly and through the actual observer. Protection verification remains reached; no software close/cancel/DB advancement is inferred from bad data.
- 8 LONG/SHORT lifecycle cases compare entire baseline/new mocked side effects and persistence patches. Actual observer, Gate adapter, decision, action, close, fill validation, cancellation and reconciliation functions run; network/DB/protection I/O is mocked.
- Reduce-only IOC signed close size, complete-fill-before-cancel, closed state, fill/history price, PnL/fee persistence, quantity zero, cleared protection IDs and unlock are asserted.
- Partial/unconfirmed exit or position-read failure does not fabricate closure/cancel/unlock. Vanished-position branch, missing-history fallback and repeated fresh polls are covered.
- Initial dedicated run: 103/111 passed; 8 comparisons failed because nested mock arguments retained VM-realm prototypes. Fixture capture was normalized to plain JSON values; no application behavior or expected assertions was weakened. Final dedicated run and full matrix: all 111 passed.

## Full relevant Futures matrix

Exact explicit allowlist command (no unsafe wildcard):

```powershell
node --test --test-reporter=./scripts/lib/futures-compact-reporter.mjs scripts/futures-gate-observer-native-test.mjs scripts/futures-whole-decision-test.mjs scripts/futures-shared-engine-test.mjs scripts/futures-binance-provenance-validation-test.mjs scripts/futures-candle-provenance-test.mjs scripts/futures-correctness-test.mjs scripts/futures-mexc-native-routing-test.mjs scripts/futures-real-price-basis-test.mjs scripts/futures-reanalysis-test.mjs scripts/futures-simulation-execution-test.mjs scripts/futures-simulation-chronology-test.mjs scripts/futures-simulation-accounting-test.mjs scripts/futures-simulation-accounting-ui-test.mjs scripts/futures-simulation-capital-test.mjs scripts/futures-real-execution-fault-test.mjs scripts/futures-gate-mexc-fault-test.mjs scripts/historical-point-in-time-test.mjs scripts/historical-simulation-timing-test.mjs scripts/simulation-analytics-test.mjs scripts/futures-pro-timeframes-test.mjs scripts/futures-tp-allocation-test.mjs scripts/binance-final-funding-test.mjs
```

**1028/1028 PASS**, 1000 top-level tests, 22 files, zero failures/skips/cancellations; duration 93945.3216ms. Includes prior 917 plus new 111. Legacy internal assertion groups are not double-counted as Node tests.

| Suite | Reported tests |
|---|---:|
| Gate observer native |111|
| Whole decision (120 whole-object parity + 144 chronology + 20 Gate NEW endpoint + 1 coverage)|285|
| Shared engine, strategy, SMC, reviewer, risk/funding fixtures|55|
| Binance provenance validation|35|
| Candle provenance|7|
| Correctness|10|
| MEXC native routing|7|
| Real price basis|6|
| Reanalysis|140|
| Simulation execution|46|
| Simulation chronology|41|
| Simulation accounting|21|
| Simulation accounting UI|18|
| Simulation capital|27|
| Real execution faults|119|
| Historical point-in-time|31|
| Simulation analytics|54|
| Binance final funding fixtures|11|
| Four legacy file-level cases: Gate/MEXC faults, historical timing, pro timeframes, TP allocation|4|

Additional executed commands/results:

- node --check scripts/futures-gate-observer-native-test.mjs: PASS.
- node --check scripts/futures-completion-scope-check.mjs: PASS.
- node scripts/futures-completion-scope-check.mjs --types: PASS. Frozen baseline fc5; **484 other declared API functions identical**, including 117 Spot and 19 selected execution/protection/reconciliation functions. The authorized observer is excluded from equality, checked by the dedicated source/lifecycle suite.
- API TypeScript diagnostics: baseline 30, current 30, introduced 0. This is NOT a globally green TypeScript claim.
- Targeted compiler: node node_modules/typescript/bin/tsc --noEmit --skipLibCheck --allowImportingTsExtensions --target ES2022 --module NodeNext --moduleResolution NodeNext api/_shared/gate-futures-observer.ts api/_shared/futures-market-data.ts: PASS.
- git diff --check: PASS.
- Local runtime: Node 24.19.0. No Node22 CI execution/dispatch claim.

## Build result

- npm run build: PASS (web 2022 modules, 13.67s; admin 1713 modules, 6.72s).
- Existing web chunk-size warning >500kB retained, not an error.
- All 14 top-level api/*.ts handlers bundled in memory: PASS, zero errors/warnings, Node22 target, no emitted files. Exact validation body:

```javascript
const fs=require('fs'),esbuild=require('esbuild');
const entries=fs.readdirSync('api').filter(x=>x.endsWith('.ts')).map(x=>'api/'+x);
let warnings=0;
for(const entry of entries){
  const r=esbuild.buildSync({entryPoints:[entry],bundle:true,platform:'node',target:'node22',format:'esm',packages:'external',write:false,logLevel:'silent'});
  warnings+=r.warnings.length;
}
console.log(JSON.stringify({entries,bundles:entries.length,errors:0,warnings}));
```

A Node22 bundle target does not establish Node22 runtime CI. No live application bootstrap or private endpoint was tested.

## Full static re-grep / remaining Spot references

Searches covered fetchKlineExtremes, literal spot, spotPairFor, Binance Spot host and helper callers; TypeScript AST mapped hits to enclosing functions. Line numbers below refer to the new executable commit. Reusable Spot helpers remain because unrelated products are forbidden scope.

| Remaining match/group in api/copytrade.ts | Classification / why not Gate active position management |
|---|---|
| 1396-1435, 1752/1763; Spot comments, spotPairFor, fetchPrices, fetchKlineExtremes | Generic Spot definitions. No call edge from the corrected Gate observer/window/native transport. |
| executeDemoProOpen:1691; syncDemoTrades:2219/2224 | Demo opening/exit consumers, intentionally unchanged. |
| syncRealHyperliquidTrades:2654/2659 | Different venue; not represented as fixed. |
| checkSpotOrderFeasible:2860/2873 | Actual Spot feasibility. |
| getFuturesMinMargin:2936 | Remaining **Gate pre-entry minimum-margin estimate** may use Spot quote. Not position observation/protection/exit or central NEW-analysis candles. Separate limitation, not falsely called universally native. |
| syncSpotCycles:4390/4400; deployRealSpotLimitLadders:4629; manageRealSpotTakeProfit:4819; cancelOpenRealSpotLadderBuys:5026; evaluateSpotCycleStepReal:5127 | Real/Demo Spot lifecycle, not Gate Futures. |
| fetchLiveSpotCandles:5313/5315; syncSpotCyclesReal:5617/5622; syncRealSpotLimitOrders:5686 | Spot-only helpers/consumers. |
| handleSpotCopyTrade:6139/6211/6299/6722/6945/6960 | Spot handler. |
| renderTradeChartPng:7141, associated fetchKlinesPage | Reporting chart, not price input to Gate exit decision/action. |
| activateRealPendingTrade:10627 | Conditional fallback for other venues; Gate branch immediately above uses native Gate context. |
| checkPendingSignals:10905/10909 | Five remaining fetchKlineExtremes call sites in total: this conditional + Demo + Hyperliquid + two Spot sync functions. Real Gate uses getFuturesMarketWindow(exchange=gate,basis=latest), not this fallback. |
| BINANCE_DATA_HOST:10954, fetchLiveFuturesCandles:11293, fetchLiveSpotCandlesAt:11521/11523, historical comments and computeSpotMarketMapFromCandles:12102 | Shared legacy/historical/Spot helpers. Gate observer imports none; Gate NEW input builder uses its own native source. Not a blanket claim that every unrelated legacy Futures helper is native. |
| handleWhaleWorkerTick:15000/15001 | Separate Whale Demo context. |
| handler trade-detail:15831 | Gate may still display Spot-derived unrealized PnL. Read/display only; no persistence/exit/protection action. Separate reporting limitation. |
| handler manual-close block:16839 | Explicit mode=demo query, not Gate Real close. |
| handler Real entry:17175 | Pair declaration; Gate current-price branch uses native context before other-venue fallback. |
| Current syncRealGateTrades:7850-7900, native window, native transport | **No Spot dependency in the software-exit data chain.** Dedicated source tests and mutation tests enforce it. |

Manual Gate Real close remains native position -> closeGateTrade -> native trigger cancellation -> native reconciliation, with stored-entry expected-price hint, not Spot candles. The reanalysis position-edit path selects Binance, not Gate. Gate post-trade chart/context is not consumed by the exit action. Do not confuse those reporting paths with native software-exit decision inputs.

No source modification to Binance/MEXC execution/protection, Demo, Simulator, Spot, Prediction, Strategy formulas, AI Supervisor or central Decision Engine. Dedicated test additionally compares entire analyze.ts, App.tsx and shared engine/risk/indicator/supervisor/provenance files against fc5.

## Full acceptance matrix

| Requirement | Current result / scope |
|---|---|
| One shared pure Decision Engine | PASS; unchanged implementation |
| Real/Demo/Simulator wiring | PASS for standard tested decision path |
| Whole decision parity | PASS, 120 fixtures |
| Binance native NEW candles | PASS offline provenance/regression |
| MEXC native NEW candles | PASS offline routing/regression |
| Gate native NEW candles / no Spot fallback | PASS, 20 endpoint-to-engine tests; existing transport URL preserved |
| Gate existing-position management no Spot | PASS locally for active observation/protection/close/reconciliation path |
| Existing Gate exit mathematics | PASS; 14 parity cases and actual-function lifecycle comparisons |
| Protection semantics unchanged | PASS locally; functions identical, mocked lifecycle order verified |
| Reconciliation semantics unchanged | PASS locally; functions identical, persistence mocks verified |
| Shared risk / fee / funding representation | **INCOMPLETE**: decision risk shared; common booked-cashflow representation is not fully wired |
| SMC role documented | PASS; existing OB/FVG/swings/SR attribution with default vote weight zero; not rewritten |
| Supervisor reviewer role | PASS source/regression; no economic-effectiveness claim |
| No look-ahead / multi-timeframe | PASS NEW-decision chronology matrix; exit intrabar model intentionally distinct |
| Relevant Futures tests | PASS, 1028/1028 |
| Web/admin/API builds | PASS |

Exact remaining engineering evidence: api/_shared/futures-risk.ts:32 defines futuresPositionEconomics, but repository source search finds no application consumer (only shared-engine tests). futuresFundingPayment is used by Simulator in copytrade.ts:12934, not a common Real/Demo booked ledger. Real exchange fills/income and Demo/Simulator modeled costs still have distinct representations. Existing report already recorded this limitation; the older broader PASS wording is not promoted over later evidence. Resolving it would exceed this source-only task and violate the prohibition on changing accounting formulas/Demo/Simulator here.

## Known unrelated baseline failures / economic limitations

- API typecheck retains 30 pre-existing diagnostics; zero introduced.
- Prior mixed broad suite's 116/117 Spot structural result is historical, not rerun or modified to turn green. It is outside the explicit safe Futures allowlist.
- Web chunk warning remains.
- Gate minimum-margin Spot estimate and displayed-PnL/chart sources remain separate auxiliary limitations, not hidden by the narrower management-source PASS.
- No private exchange execution, protection, accounting or live Gate candle readiness claim. Natural Real lifecycle gates remain unproven by mocks.
- No new economic replay/optimization. Historical failed 24h Shadow, 186 stale inputs and previous negative economic result are preserved, not reclassified or counted as new evidence.
- No profitability, AI Supervisor value-add, or improved trading outcomes established.
- Missing/late native candles intentionally abstain from software exit. This can delay software observation; native protection validation remains unchanged. No new retries/telemetry framework or timing redesign was added.
- Production deployment is neither performed nor approved by this report.

## Files inspected

AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md, TRADING_STRATEGY.md (including amendments), docs/testing/stability-test-runbook.md; current completion/classification report; api/copytrade.ts (Gate lifecycle, scheduler/handler, pending-entry, NEW inputs, min-margin/reporting/Demo/Spot distinctions); api/analyze.ts; src/app/App.tsx; api/_shared/futures-market-data.ts, futures-decision-engine.ts, futures-risk.ts, futures-indicators.ts, futures-supervisor.ts, futures-candle-provenance.ts; new observer and its tests; all explicitly selected test files/source fixtures and scope checker; package.json/build configuration; AI-Log README/template/secret-scanner.

## Git / publication / next step

Code committed only on the existing local codex branch. Documentation follows separately. Nothing pushed to application main or any application remote. Pre-existing untracked tmp/ preserved. A sanitized copy is published separately to SignalVerse-AI-Log/master per AGENTS; remote commit/blob verification and final app documentation SHA are reported in the conversation.

**Final: FUTURES-INCOMPLETE.** The authorized Gate observer correction is complete and offline-validated; do not silently expand into accounting work, deploy, or manufacture live validation. Next scope, if separately authorized, is the remaining shared cost-representation acceptance item.
