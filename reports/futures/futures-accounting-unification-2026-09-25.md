# Futures accounting unification — 2026-09-25

## Metadata

- Date: 2026-09-25. Local evidence collection and validation; final source validation/report preparation completed by 13:41:11 UTC.
- Task: FINAL ACCOUNTING UNIFICATION / NO DEPLOYMENT.
- Module: standard Real/Demo Futures copy-trading and Futures Simulator.
- Application branch: codex/futures-completion-20260925, existing isolated checkout.
- Previous executable SHA: a4c1edcedacc1787f9d2bb78ebbc21e898b86900.
- Starting documentation HEAD: 05213455614fa16ccadb0d9e1ee715c93f3bc9da.
- Accounting implementation commit: 03d8f9d2577477686206a157a61d2666bc6c446b.
- Final executable/test SHA: b03adbc5bf26a698f3dca91a4be5bb2c5e15514f.
- Documentation/publication commits are separate from the executable SHA.
- Production runtime SHA: NOT INSPECTED in this local-only task. No claim about another contributor's actions.
- Final engineering status: FUTURES-COMPLETE-WITH-ECONOMIC-VALIDATION-LIMITATION.
- IMPROVEMENT PROVEN = NO.
- PRODUCTION STRATEGY CHANGED BY THIS TASK = NO.

## Executive result / objective

A common, pure, source-aware Futures economics contract now connects the existing Real reconciliation, Demo model and Simulator model to consistent accounting presentation. Venue economics are not forced to match. Missing evidence remains null with a status; it is not a zero fee/funding assertion.

The central Strategy/Decision Engine, indicator weights, SMC, Supervisor authority, entry/SL/TP geometry and exchange execution/protection rules were not redesigned. The existing native Gate observation function and transport remain unchanged from a4c. No VPS, Guard, Production, live DB, credential, exchange account, order or position operation was performed. No application push, main merge, CI dispatch or deployment occurred.

Final validation: 1207/1207 Node tests across the explicit 23-file Futures allowlist, plus 6/6 separate local PostgreSQL checks. These are different checks, not duplicate counts from repeated runs. Web/admin builds and all 14 API bundles pass. Economic profitability and natural private-account lifecycle validation remain unproven.

## Confirmed audit findings

1. Simulator stepPosition previously owned duplicated fee/gross/net arithmetic; its legacy realizedPnl accumulator includes fees and paid-positive funding. Demo stores gross PnL and report-only modeled fees. A single legacy pnl_usdt subtraction cannot describe both.
2. Gate position_close reports distinct trading PnL, funding and signed fee cash flows as well as an aggregate pnl. Using the aggregate as gross and subtracting fees again misrepresents net.
3. MEXC native history realised is treated as netted in the existing implementation. It cannot safely be relabeled gross. Old partial fee queries could look like a complete roundtrip fee; one known order is not complete fee coverage.
4. The old client net helper treated missing fees/funding as zero and generally considered non-Binance rows final. That was incompatible with source-aware accounting.
5. Demo manual close after partial targets recomputed fees for the original quantity, replacing prior fee legs. It also released only remaining margin/new PnL even though automatic partial targets had returned zero balanceDelta. Both terminal accounting inconsistencies are corrected locally without changing target/stop selection.
6. Native account availability and actual exchange statements were NOT queried. All exchange payloads used in tests were synthetic.

Official source semantics: [Gate position-close fields](https://github.com/gateio/gateapi-go/blob/master/docs/PositionClose.md) distinguish pnl_pnl, pnl_fund and pnl_fee; the adapter uses these rather than recharging aggregate pnl. [MEXC contract documentation](https://mexcdevelop.github.io/apidocs/contract_v1_en/#get-order-transaction-details-based-on-the-order-id) supplies transaction id, feeCurrency and fee; history holdFee is signed income/expense. The docs do not establish a safe gross interpretation for the existing realised field, so the fallback gross remains ESTIMATED. [Hyperliquid fill documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint) provides tid, feeToken, closedPnl and fee; fee already includes builder fee. The normalizer preserves USDC and never adds builder fee twice.

## Canonical contract / pure authority

api/_shared/futures-economics.ts defines FuturesTradeEconomics v1:

- grossPnl, tradingFees, funding, slippageCost, otherExecutionCosts, netPnl.
- grossStatus, feeStatus, fundingStatus, netStatus.
- components: each value plus its own evidence status and source.
- source, currency, completeness, realizedAt, slippageInGross.
- representedNetPnl: explicitly a partial subtotal, NEVER a confirmed final net when required evidence is absent.

Statuses are KNOWN, ESTIMATED, PENDING and NOT_AVAILABLE. KNOWN means known from the named source/model; it does not turn a demo model into an exchange-confirmed fee. Invalid, empty, non-finite or absent values become unavailable, not zero. Finite arithmetic overflow cannot produce a final net or disrupt a reconciliation caller through composition.

Pure shared functions:

```text
grossPnL(side, executedEntry, executedExit, quantity)
feeFromExecution(notional, rate)
fundingCashFlow(side, quantity, markPrice, rate)
netPnL(gross, fees, receivedPositiveFunding, slippage, otherCosts)

netPnL = grossPnL - tradingFees + fundingCashFlow
         - separatelyRepresentedSlippage - otherKnownExecutionCosts
```

Fees are paid-positive; rebates can be negative. Funding is received-positive / paid-negative. Slippage already embedded in executed-price gross is disclosed and NOT deducted a second time. No future funding is an input to the Strategy from this layer.

COMPLETE means the required gross/fee/funding terms are known and the net for represented terms is available. Optional unrepresented costs retain NOT_AVAILABLE/null. The UI explicitly says this is not confirmation that every possible unrepresented cost was zero.

The legacy futuresPositionEconomics and paid-positive futuresFundingPayment APIs delegate their math to the common layer. No I/O, DB, exchange call or mode-specific decision exists in the pure layer.

## Source -> persistence -> presentation

| Path | Source and accounting | Persistence / evidence status |
|---|---|---|
| Binance Real | Existing exact-entry/native fill lifecycle summarizer supplies gross and both-side commissions. Existing final income reconciliation supplies signed funding. | Additive economics snapshot on terminal patches; final funding result and recomposed snapshot update together. Funding PENDING/unknown keeps net unavailable. Legacy rows do not gain invented fill provenance. |
| MEXC Real | Existing history and deal endpoints only; no extra request class. Native deal identities deduplicate fees; wrong/missing currency/value fails closed. Distinct entry/exit IDs and successful fee coverage are required for confirmed total fees. | Legacy realised remains unchanged. Canonical gross is the explicitly ESTIMATED price fallback; raw signed holdFee is retained without coercing missing to zero. Partial fees are NOT_AVAILABLE; fallback fee estimate is ESTIMATED. Not advertised as fully confirmed native net. |
| Gate Real | pnl_pnl gross, minus signed pnl_fee cashflow as fees paid, plus pnl_fund. Missing component is unavailable. | Native snapshot appended to existing close/vanished/manual patches. Legacy aggregate pnl_usdt/fee columns and execution selection semantics are preserved; common UI uses the normalized snapshot. |
| Hyperliquid Real compatibility | Native matched fill identities, closedPnl, feeToken and fee; USDC, not silently USDT. Incomplete entry/exit coverage cannot become confirmed total fees/gross. | Existing execution and legacy fields retained. Funding remains unavailable in this adapter. No builder-fee double charge. |
| Demo | Simulated executed-price gross; stored configured model fee KNOWN as a MODEL, not exchange-confirmed. No funding model. | Existing mode + pnl_usdt + fee_usdt + closed_at fields reconstruct the canonical contract; no historical backfill/new Demo ledger required. Funding is NOT_AVAILABLE and final net null. Partial subtotal is labeled. Virtual balance retains gross settlement, not an invented exchange balance. |
| Futures Simulator | Common fee/gross/net math books entry, partial exits and signed observed funding. Existing historical fill/SL-first/chronology models retained. | Each new saved trade and open-at-end snapshot includes economics inside existing simulation JSON. Legacy pnlUsdt and MTM cash-flow accumulator remain compatible; old runs are not rewritten. Missing funding makes normalized final net unavailable even when model cash flow is numeric. |

Real fill matching, Gate history selection, position lookup, order submission/confirmation, protection and actual native source acquisition remain the existing implementation. This task improves accounting representation, not the quality of live evidence or account matching. Native values do not establish a private-account lifecycle merely because a mock passed.

Simulator funding availability follows the existing bounded/paged native historical provider; absence is disclosed. It does not assert independently authenticated completeness of an exchange's response or improve the coarse historical funding/fill model.

## Partial-close and no-double-booking checks

- Actual Demo and Simulator TP1 -> TP2 -> final functions tested for LONG and SHORT, with 30/30/40 allocation. Sum of parts equals position gross; entry/exit fees are conserved.
- Simulator entry fee is charged once; partial closes add only their exit fees. Finalization returns equityDelta=0. Repeating a completed step returns zero delta.
- Signed funding is added once to represented cash flow; legacy paid-positive funding facade is explicitly converted.
- Common identity-based aggregation counts duplicate observations once and rejects conflicting identity/currency evidence. Binance's existing full-lifecycle and final income dedup tests remain.
- MEXC order IDs and native deal IDs are deduplicated. One known order or missing fee component cannot masquerade as full roundtrip coverage.
- Demo manual close keeps prior fee legs and charges only the remaining quantity. Terminal gross settlement releases the full reserved margin plus all realized parts, consistently with automatic terminal settlement.
- This establishes deterministic accounting conservation and regression behavior. It is NOT a new proof of cross-process transactional exactly-once behavior for legacy Demo read/modify/write endpoints; their concurrency architecture was not redesigned.

## Persistence / migration

migrations/futures_economics_contract.sql adds one nullable JSONB column to public.copy_trades, with an idempotent version/currency/object-shape constraint. Missing keys cannot bypass the CHECK through SQL NULL. Existing columns and meanings remain unchanged. There is no UPDATE/backfill, historical run rewrite, new order table or balance migration.

Existing Demo numeric fields already represent the model; Simulator's existing JSON persistence stores its new snapshots. The additive column is necessary for native Real component evidence that ambiguous legacy pnl_usdt cannot represent.

Local PostgreSQL 18.6 checks: migration twice, unchanged legacy row, exact canonical JSON roundtrip/recomposition, null versus known value, invalid version/currency/shape rejection, repeated snapshot write without duplicate rows/backfill. A fresh random-port loopback cluster was initialized, verified as belonging to the test, stopped and removed. No existing DB connection/configuration was used.

**Deployment prerequisite, not authorization:** the additive migration must be applied through a separately approved release process before code that writes the new column is activated. This task did not apply it to Production and does not authorize deployment.

## UI / reporting

The same FuturesEconomicsPanel is used for Real/Demo trade details and Futures Simulator results/open snapshots. It displays gross, fees, funding, slippage/other costs, net, status, source/currency and completeness. Estimated is not confirmed; unavailable is not zero. Embedded slippage is identified.

Confirmed-net lists, totals, win rate and calendar use the canonical result. Empty confirmed coverage displays unavailable, not a misleading zero return/win rate. The confirmed/total count is shown. Telegram share captions no longer format missing net as NaN. Partial subtotals and Demo's report-only fee/gross-balance model are explicit.

Legacy simulations without the new contract display a legacy-evidence warning rather than reconstructed fictional costs. Existing MTM and actual model cash-flow summaries remain, with cost-coverage limitations. Spot screens/functions are unchanged.

The floating help description was updated only for these accounting semantics; no trading prompt, Strategy or Supervisor authority changed.

## Completeness search / remaining occurrences

Search used fee*, funding*, grossPnL, netPnL and realizedPnl across application source, server and migrations, with TypeScript enclosing-function mapping for copytrade/analyze. Occurrences are not required to disappear.

| Category | Remaining locations / reason |
|---|---|
| A — canonical shared accounting | futures-economics.ts; futures-risk.ts compatibility math delegates; common net composition and identity aggregation. |
| B — source/model normalization | futures-economics-sources.ts; reconcileRealClosePnl, reconcileHyperliquidClosePnl, reconcileGateClosePnl, reconcileBinanceClosePnl; Demo stored model; Simulator finalizeTrade/stepPosition/runSimulation use common functions. |
| C — native acquisition and bookkeeping plumbing | fetchMexcOrderFee, native history/fill getters, summarise/resolveBinanceCloseFills, fetchAndRecordBinanceFunding, reconcileFinal/PendingBinanceFunding, native historical funding provider; venue lifecycle patches carry snapshots without changing order behavior. Native market funding/context observations are not this accounting formula. |
| D — presentation / legacy evidence | App net helpers and panel; computeAnalytics consumes existing model cash flow; admin engine-monitor explicitly labels stored PnL as not a verified fee-net exchange statement. Post-trade/learning records retain their legacy outcome meaning, not a new canonical net claim. |
| E — separate products / decision estimates | computeSpotReturnMetrics/computeSpotCycleFeeUsdt/syncRealSpotLimitOrders/handleSpotCopyTrade/runSpotSimulation; Spot/stablecoin/prediction modules and migrations; Whale source-wallet analytics/replay. Fast Trader smartExitNetPnl/smartExitPriceForNet/evaluateSmartExit*, its Smart Exit settlement and A/B virtual experiment cost models are separate pre-existing policy/model consumers, not silently substituted with Real confirmed accounting. |
| E — frozen strategy estimates, not booked results | evaluateEconomicEdge, assessTradeEconomics, reanalysis/pro-watch decision inputs and prompt contexts estimate entry/exit feasibility. The owner prohibited changing strategy/execution semantics; these estimates are not presented by the new contract as exchange-confirmed fees. |

No claim is made that unrelated Spot/Whale/Fast Trader/A-B products were migrated into this standard-copytrade contract, or that every cost estimate anywhere in the repository is now the same source. The previous architecture blocker for the requested Real/Demo/Simulator representation is closed; venue/model evidence limitations are explicitly represented.

## Files changed / inspected

This task's executable/test commits collectively change exactly these 16 files:

- api/_shared/futures-economics.ts
- api/_shared/futures-economics-sources.ts
- api/_shared/futures-risk.ts
- api/analyze.ts
- api/copytrade.ts
- migrations/futures_economics_contract.sql
- scripts/binance-final-funding-test.mjs
- scripts/futures-completion-scope-check.mjs
- scripts/futures-gate-observer-native-test.mjs
- scripts/futures-real-execution-fault-test.mjs
- scripts/lib/futures-pure-test-context.mjs
- scripts/lib/futures-accounting-scope.mjs
- scripts/futures-economics-contract-test.mjs
- scripts/futures-economics-sql-test.mjs
- src/app/App.tsx
- src/app/FuturesEconomicsPanel.tsx

Documentation follows separately:
- reports/futures/futures-accounting-unification-2026-09-25.md
- reports/futures/futures-completion-audit-2026-09-25.md
- HANDOFF.md
- docs/testing/stability-test-runbook.md

Inspected: AGENTS.md, CLAUDE.md, current HANDOFF/AI_HANDOFF, all TRADING_STRATEGY including amendments, safe testing runbook, prior Gate fix/completion reports; the source/reconciliation/model/UI/persistence paths above; existing explicitly allowlisted tests and AST helpers; official native field documentation; AI-Log README/template/secret-scanner. No env/secret file was read.

## Tests executed / final results

Final explicit allowlist (no unsafe wildcard):

```powershell
node --test --test-reporter=./scripts/lib/futures-compact-reporter.mjs scripts/futures-economics-contract-test.mjs scripts/futures-gate-observer-native-test.mjs scripts/futures-whole-decision-test.mjs scripts/futures-shared-engine-test.mjs scripts/futures-binance-provenance-validation-test.mjs scripts/futures-candle-provenance-test.mjs scripts/futures-correctness-test.mjs scripts/futures-mexc-native-routing-test.mjs scripts/futures-real-price-basis-test.mjs scripts/futures-reanalysis-test.mjs scripts/futures-simulation-execution-test.mjs scripts/futures-simulation-chronology-test.mjs scripts/futures-simulation-accounting-test.mjs scripts/futures-simulation-accounting-ui-test.mjs scripts/futures-simulation-capital-test.mjs scripts/futures-real-execution-fault-test.mjs scripts/futures-gate-mexc-fault-test.mjs scripts/historical-point-in-time-test.mjs scripts/historical-simulation-timing-test.mjs scripts/simulation-analytics-test.mjs scripts/futures-pro-timeframes-test.mjs scripts/futures-tp-allocation-test.mjs scripts/binance-final-funding-test.mjs
```

1207/1207 PASS; 1179 top-level cases; zero fail/skip/cancel; final run duration 74687.304ms. The prior 1028 are retained and 179 accounting cases added. Includes 128 normalized cross-mode combinations plus missing/malformed/nonfinite/status/conservation/native normalization/actual partial/manual/UI cases; 120 whole-decision parity and 111 Gate observer cases remain. Legacy internal assertion groups are not counted twice.

Additional:
- Local PostgreSQL: 6/6 PASS, separately from Node count. Run with explicit FUTURES_ECONOMICS_TEST_PG_BIN pointing to the installed local PostgreSQL 18 bin directory and node scripts/futures-economics-sql-test.mjs.
- node scripts/futures-completion-scope-check.mjs --types: PASS; 462 unrelated API functions identical to a4c, including117 Spot and12 selected execution/protection functions. Nine additional lifecycle functions differ ONLY by additive economics: real.economics metadata.
- Dedicated Gate suite retains close/protection/native-price/PnL legacy parity; comparison excludes only the new economics property, not legacy financial/execution fields.
- App source comparison: all17 named Spot functions byte-identical.
- Pure shared-module tsc --noEmit: PASS.
- API comparison:30 baseline diagnostics/30 current, zero introduced. Frontend comparison:1 baseline/1 current, zero introduced. This is NOT a globally green legacy typecheck claim.
- node --check new economics contract/SQL test scripts: PASS; git diff --check: PASS.
- Node24.19.0 local runtime, not Node22 CI execution.

Intermediate test failures were addressed: old AST harnesses needed actual shared pure imports; one mock had the wrong function signature; a frontend test setup line was misplaced; and the local PostgreSQL harness initially failed startup due to option quoting. These were local-only development failures, not claimed Production incidents. The final matrix and fresh SQL cluster run pass.

## Build result

- npm run build: web PASS (2025 modules,11.09s), admin PASS (1713 modules,6.22s).
- Existing >500kB web-chunk warning remains, not a failure.
- All14 top-level API handlers bundled in memory with esbuild, Node22 target, packages external, write:false: PASS, zero errors/warnings.
- No application bootstrap/private endpoint/browser trading action was run.

## Git / publication state

Changes committed only on the existing local codex branch. Original primary checkout and its unrelated/untracked work were not modified by this task; pre-existing tmp/ in the isolated checkout is preserved. No build/database artifact is committed.

A sanitized copy of this report is published to SignalVerse-AI-Log/master only, under reports/futures. That is a reports-only remote, not the application remote. Its commit/file blob verification is reported separately in the conversation. Application code is NOT pushed.

## Remaining limitations / acceptance

Engineering acceptance for the requested standard Futures accounting contract is complete locally: shared fee/funding/net math, mode-specific normalized sources, statuses, persistence, partial-close conservation, common UI and regression evidence. Engine/Strategy/native Gate decision and position-management semantics remain intact.

Not established:
- profitability improvement, AI Supervisor effectiveness, representative economic performance or private-account execution correctness;
- a genuinely new Binance/MEXC/Gate Real lifecycle or natural native-protection/accounting gate;
- complete financial evidence for every venue/legacy row; MEXC gross fallback stays estimated and unmodeled funding stays unavailable;
- an accounting/concurrency redesign of unrelated Fast Trader/Whale/A-B/Spot products;
- live PostgreSQL migration compatibility/release readiness on the actual deployment host.

The earlier failed Shadow and negative small-sample economic result remain unchanged. No parameter was optimized against that sample. No real/test exchange trade was manufactured. No Production runtime assertion is inferred from a local commit.

**FINAL STATUS: FUTURES-COMPLETE-WITH-ECONOMIC-VALIDATION-LIMITATION**

Next action is owner review of this local candidate and its additive migration/release prerequisites, not automatic deployment or strategy retuning.
