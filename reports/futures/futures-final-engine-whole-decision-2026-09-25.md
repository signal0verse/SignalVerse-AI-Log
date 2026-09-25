# Futures final engine validation — whole-decision parity — 2026-09-25

## Metadata / current completion pass

### Metadata / executive result

- Evidence finalized: 2026-09-25T10:16:43Z.
- Mode: isolated local development and offline validation ONLY.
- Starting candidate: `8421c7dec693505e737e5fdafbbccf2fcb0dab9b`.
- Executable candidate: `b80f89d343663f347862855555e61077ee31b468`; branch `codex/futures-completion-20260925`. Documentation-only HEAD: `fc5a730029e617ee807aae59c722b462501b54ee` records this report/HANDOFF.
- Central engine version: `5.0.1-canonical-futures-20260925`.
- **917/917 Node tests PASS; zero failures, skips, cancellations.**
- **Whole-decision parity: 120/120 PASS.**
- **Final comprehensive status: FUTURES-INCOMPLETE. IMPROVEMENT PROVEN = NO. PRODUCTION STRATEGY CHANGED = NO.**
- No application push, deployment, VPS access, service/config/DB/account operation, credential read, real/demo order, Guard/security change or workflow dispatch occurred. Production runtime was NOT inspected; candidate SHA is not runtime SHA.

### Objective / latest authorized scope

Finish the common decision authority and whole-object validation, with Gate native inputs restricted to NEW analysis/decisions. The owner's final instruction explicitly superseded the earlier tentative observer-source permission: **do not modify the Gate observer, execution, exit/management, SL/TP or protection of existing positions**. All of those remain unchanged. The dirty primary checkout was untouched; no stash/reset/clean/pull was performed there.

### Confirmed implementation and actual call graph

```text
Standard Real / Demo:
  native public input bridge -> buildFuturesProTimeframeInputs
  -> selectClosedNativeFuturesCandles -> shared indicators + native provenance
  -> analyzeOneCoinPro -> computeFuturesDecision (alias computeShadowEngineState)
Simulator:
  public native Binance history -> causal closed window -> buildFuturesTimeframeInput
  -> runSimulation -> computeFuturesDecision
Both:
  normalization-only compatibility facade
  -> normalizeFuturesDecisionInput
  -> computeCanonicalFuturesDecision (ONE actual math body, explicit clock)
  -> generateFuturesSetup + evaluateFuturesRisk
  -> complete Engine decision -> existing Supervisor policy -> unchanged execution
```

The old positional facade remains for compatibility, but contains no votes, gates, ranking or geometry. Its optional clock acquisition is outside the pure authority. The authority has no mode/venue branches, API, DB, transport, fill or implicit clock. Real/Demo pass the recorded decision-start timestamp; Simulator passes historical decision time. Inputs are cloned; transport provenance is removed after upstream validation, not used as a substitute for candles.

Canonical interfaces explicitly name OHLCV/indicators, decision time, regime/stable trend, funding, OI, price basis, strategy overrides and decision-risk state. Timeframe alignment is derived once inside the authority. Current decision adapters do **not** supply timestamped funding/OI to this new context; these remain explicit null, not fabricated observations. Price basis is NATIVE_CONTRACT for standard native consumers. Output now includes marketContext, strategyConfig and riskConfig alongside all previous fields. No strategy weight, threshold, formula or protection rule was tuned.

### Whole-object parity and independent baseline comparison

The new suite invokes the **actual live input builder independently for Real and Demo**, and the **actual Simulator normalization function** on the same OHLCV snapshot. It then deep-compares entire canonical inputs and **entire deterministic outputs**, with no output-field whitelist. Direction/decision, raw/effective scores, confidence, selected TF, setup/SL/TP1/2/3/RR, risk, blockers/reasons, invalidations, data quality, CPR, directional/regime evidence, context/configuration and version are all included.

120 scenarios: **13 LONG, 8 SHORT, 83 WAIT, 16 NO_TRADE**; 46 contain contradictory votes. Cases include 2/4 timeframes, mixed TF direction, volatility, exact boundary/+1ms/mid-period, position cap, unknown position count, lock, invalid leverage, stable-trend and regime vetoes. Native builders cover Binance/MEXC/Gate. Same inputs/context/configuration/account are a precondition; this is not a claim that different venue prices or execution policies give identical outcomes.

All pre-existing output fields (excluding intentionally versioned engineVersion and three newly additive context/config fields) also match the frozen starting authority for all 120 scenarios. No input mutation occurs. Historical economic replay was **not rerun** this pass; its negative result in the previous completion report remains prior evidence, not a new claim.

### Gate findings / precise exclusion

- NEW decision pipeline: existing Gate Futures endpoint -> native OHLCV -> closed selection/provenance -> shared indicators -> canonical authority passes local end-to-end tests on 15m/1h/4h/1d.
- 20 endpoint-to-decision cases: valid / stale / missing / malformed / HTTP failure, for each TF. Only the Gate Futures URL is allowed, exactly one request per case; Spot/Binance/MEXC alternatives are forbidden stubs. Invalid native data returns no analysis inputs. No fallback or provider substitution occurs.
- The existing Gate native implementation needed no further source change in this pass.
- Old observer is **C: ACTIVE POSITION MANAGEMENT**, not dead code. `syncRealGateTrades` in api/copytrade.ts:7849 is called by the recurring sync at :14605 and user/account sync at :17508. It still calls `fetchKlineExtremes(..., 'spot')`, then `decideRealTradeAction` and reconciliation.
- That observer is **outside the NEW-analysis decision graph**, hence non-blocking for the bounded new-input gate, but a real retained broader Futures limitation. It was NOT relabeled dead, fixed, or native. No open-position function was changed.

### Native chronology verification

New matrix: **144/144** assertions across Binance/MEXC/Gate × 15m/1h/4h/1d. For each: exact native close, native close minus 1ms, input selected before close with decision after close, decision after close, missing close, malformed timestamp, reversed open/close, wrong source; selectors separately reject stale, missing, malformed and future-only windows.

Important correction to older prose in the previous completion report: Binance uses its native inclusive index-6 close, open+duration-1ms. It may be SAFE_CLOSED at that exact native millisecond; it does not universally wait for the next exclusive boundary. MEXC/Gate derive exclusive close=open+duration. The test subtracts 1ms from the **native close**, not a rounded clock. Stale data is rejected by the selection gate; mere close-before-decision is not a freshness proof. Provenance tests do not replace whole-window validation.

### Strategy / Supervisor / risk-cost conclusions

| Question | Current answer |
|---|---|
| One pure central engine? | YES, computeCanonicalFuturesDecision contains the unchanged deterministic math. |
| Real/Demo/Simulator call it? | YES via one canonical facade; Simulator has no separate score/direction/setup algorithm. |
| Whole-decision parity? | 120/120 full-object, independently normalized snapshots; not just old component parity. |
| Gate new decisions native/Spot-free? | PASS locally; open-position observer expressly excluded. |
| Gate observer? | Active position management, unchanged by owner instruction. |
| SMC role / effect? | FVG/OB/swings/SR attribution-only, default weight zero (A + D), not unreachable; prior 0/54 decision changes retained. No invented SMC vote. |
| Supervisor authority / effect? | Review/filter only; CONFIRM can approve, REJECT/CAUTION/unavailable cannot author levels. Existing Demo execution policy is distinct. Prior fixture: 3 approvals / 9 rejections / 2 flags / 7 unavailable on the same 21 candidate decisions; zero level rewrites. This is NOT actual AI efficacy evidence. |
| Decision risk shared? | YES: geometry, RR, leverage, open count/unknown count, symbol lock. Size/exposure/liquidation and private venue constraints remain execution-specific. |
| Fees/funding fully shared across all consumers? | **NO, not proven or fully wired.** futuresPositionEconomics is a pure reference helper, not a common booked-cashflow authority in Real/Demo/Simulator. Simulator stepPosition has its own fee booking and uses futuresFundingPayment for native historical events. Real accounting must use confirmed exchange fills/income; Demo has its existing model. Tests verify those paths separately, not identical ledgers. |
| All engineering acceptance items complete? | NO. Full cross-consumer risk/cost/accounting unification cannot be claimed. Changing execution/lifecycle is forbidden in this pass. |
| Economic improvement? | NOT PROVEN; prior 15 closed trades net -8.0347317428 USDT and two open remain small, restricted historical evidence. |
| Production strategy changed? | NO; no deployment or trading occurred. |

The remaining risk/cost item is an **architecture/wiring limitation**, separate from insufficient profitability evidence. It is why comprehensive FUTURES-COMPLETE(-WITH-ECONOMIC-VALIDATION-LIMITATION) is not claimed. The owner's excluded observer is documented separately; repairing it is not a precondition for this bounded new-decision-input gate. Do not broaden scope automatically.

### Final tests / builds

- New file: 285/285 = 120 whole-object parity + 1 coverage/pure-boundary check + 144 native chronology + 20 Gate end-to-end.
- Existing explicit allowlist: 632/632 rerun, including shared-engine 55, execution fault 119, reanalysis 140, Binance provenance 35, correctness 10, and existing simulation/protection/accounting groups detailed in the previous completion report.
- Combined **917/917**, 21 files, 889 top-level tests; zero failed/skipped/cancelled. Legacy scripts count as file-level Node tests; internal assertions are not added twice.
- First combined run: 911/917, six failures from old fixture VMs extracting only the compatibility facade; their injected votes no longer reached the moved body. Both harnesses now extract the actual canonical body too, with structuredClone supplied. Assertions unchanged; targeted rerun45/45 and final complete rerun917/917.
- Scope comparison against9836d0503f69d6f3083cba73ce3b50c5895135db: **117 Spot functions and20 execution/protection/reconciliation functions unchanged**, including syncRealGateTrades.
- API TypeScript comparison: baseline30/current30, **zero introduced diagnostics**. Six shared modules targeted tsc PASS. Global TypeScript is NOT certified green.
- API analyze/copytrade bundles PASS, node22 target, write:false.
- Web build PASS (2022 modules; existing large-chunk warning). Admin build PASS (1713 modules).
- Syntax checks for all three affected test files and git diff --check PASS.
- Local runtime Node24.19.0; Node22 CI was not dispatched. Old mixed116/117 Spot assertion remains historical/separate, not fixed or counted as a new Futures failure.

Reproduction (explicit safe allowlist, no app bootstrap, .env, live exchange or DB):

```powershell
node --test --test-reporter=./scripts/lib/futures-compact-reporter.mjs scripts/futures-whole-decision-test.mjs scripts/futures-shared-engine-test.mjs scripts/futures-binance-provenance-validation-test.mjs scripts/futures-candle-provenance-test.mjs scripts/futures-correctness-test.mjs scripts/futures-mexc-native-routing-test.mjs scripts/futures-real-price-basis-test.mjs scripts/futures-reanalysis-test.mjs scripts/futures-simulation-execution-test.mjs scripts/futures-simulation-chronology-test.mjs scripts/futures-simulation-accounting-test.mjs scripts/futures-simulation-accounting-ui-test.mjs scripts/futures-simulation-capital-test.mjs scripts/futures-real-execution-fault-test.mjs scripts/futures-gate-mexc-fault-test.mjs scripts/historical-point-in-time-test.mjs scripts/historical-simulation-timing-test.mjs scripts/simulation-analytics-test.mjs scripts/futures-pro-timeframes-test.mjs scripts/futures-tp-allocation-test.mjs scripts/binance-final-funding-test.mjs
node scripts/futures-completion-scope-check.mjs --types
npm run build
```

### Exact files changed this pass / publication

1. api/_shared/futures-decision-engine.ts — canonical interfaces/normalization, pure authority, additive evidence/version.
2. api/analyze.ts — recorded decision-start clock and native price-basis metadata only.
3. api/copytrade.ts — Simulator native price-basis metadata only.
4. scripts/futures-whole-decision-test.mjs —285 independent offline checks.
5. scripts/futures-correctness-test.mjs — follow moved authority in fixture VM.
6. scripts/futures-binance-provenance-validation-test.mjs — same harness correction.
7. reports/futures/futures-completion-audit-2026-09-25.md — this dated completion addendum.
8. HANDOFF.md — scope, results and remaining limits.

Source inspection included the six shared Futures modules, live analyzer/input builders, actual Simulator, Gate sync callers, scope/replay harnesses, previous report and project instructions. No private data was read. Existing untracked tmp/ remains uncommitted; no test artifacts or dependencies are committed. Application branch is local only. AI-Log publication is a separate report-only operation, verified after push; earlier AI-Log reports and failed Shadow evidence are preserved.

Recommended next step: review this unreleased candidate and explicitly decide a separate, safely bounded cost/accounting-contract task. Do not deploy, modify open positions or infer trading authority from test results.


## Historical evidence preserved

The [previous completion report](futures-completion-audit-2026-09-25.md) contains the unchanged detailed mathematical map, replay output and response hash manifest. It has not been edited by this publication. This report supersedes its broad parity/cost-completion claims with the precise evidence above.
