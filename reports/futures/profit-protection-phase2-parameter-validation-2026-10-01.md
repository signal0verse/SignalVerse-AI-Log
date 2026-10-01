# Futures Profit Protection — Phase 2 Research and Parameter Validation

## Metadata and scope

- Date: 2026-10-01; aggregate evidence rechecked at 2026-10-01T07:45:19Z.
- Task: Phase 2, research and parameter validation ONLY.
- Module: Real Futures position-level profit protection; no feature implementation.
- Application repository: SignalVerse-Main.
- Branch inspected: `codex/prediction-coverage-expansion-audit`.
- Starting and ending application HEAD: `0dbca62357a4adf34240f40ceda3e387356ec4b0`.
- Mode: local historical reads, disposable in-memory research, public technical documentation, report-only output.
- Application tree was already dirty. Existing `HANDOFF.md`, reports, scripts and untracked work were preserved. No application commit, branch update, synchronization, build or application test was performed.
- No Production/SSH/database/account access; no exchange data requests or exchange writes. No application, Strategy, Engine, Spot, Demo, Simulator, scheduler, service, gate, protection, migration or deployment change.
- Predecessor: [Phase 1 audit and design](https://github.com/signal0verse/SignalVerse-AI-Log/blob/8765f5065bbac3f2149f51b726ca1706a3a9b01c/reports/futures/profit-protection-fast-exit-audit-design-2026-10-01.md).
- Publication: sanitized report only in SignalVerse-AI-Log/master. The documentation publication commit is separate from application HEAD; remote publication must be verified before being claimed in the final response.

## 1. Executive conclusion

**Decision: MORE DATA REQUIRED. No threshold is selected for implementation.**

Existing local evidence is better than a screenshot or an isolated incident: 144 historical Binance Real trade/fill-cycle records, of which 117 link to accepted entry-time SL/ONE-TP plans and ATR. However, only 112 support a conservative, minute-resolution research proxy, and **zero support exact causal fast-exit execution validation**. Ordered bid/ask, depth, continuous mark-price observations, quote receipt timestamps, actual hypothetical-close fills and an untouched holdout are missing.

The proxy compared 90 configurations across six parameter families. **None improved the validation-fold result.** Nine configurations tied the baseline; the representative tying configurations made no protection exit in validation. Ties without actions are not evidence of effectiveness. A descriptive pooled improvement in one illustrative rule disappears after removing its three largest paired improvements. Short-side effectiveness was not demonstrated.

Confirmed findings:

- Original accepted risk can be recovered for 117 historical Binance entries. Current trade-row stops differ from the accepted stops in 13 of those records; using the later row would redefine risk silently.
- The illustrative rule made 7 hypothetical full closes: 4 would later reach the original SL, 2 would later reach the original TP, and 1 baseline episode remained horizon-censored.
- Paired positive improvements total 4.182384 USDT, sacrificed endpoint value totals 1.000195 USDT. These are small-sample **counterfactual proxy values**, not realized Production profit.
- The validation loss, concentration in a few Long trades, sparse timeframe coverage, exposed historical tail and execution-data gaps prevent safe parameter selection.

The concept remains suitable for further research, but this report does not establish improved strategy performance, guaranteed profit protection, Production readiness, or permission to implement. The existing native SL and ONE TP remain untouched.

## 2. Available historical data

### Primary local evidence inspected

Paths below are relative to the application repository except where stated. Raw account records were read locally; no raw rows, private account identifiers, order IDs or credentials are published.

| Source | Available evidence | Use in this phase |
| --- | --- | --- |
| `tmp/admin-futures-audit-20260920/trades.json` | 144 Real Binance rows; 99 Long / 45 Short; entry, current SL/TP, quantity, timeframe, leverage, persisted outcome fields | Scope and risk-snapshot comparison |
| `tmp/admin-futures-audit-20260920/reconciled.json` | 144 native fill-cycle matches, actual entry fills/commissions, historical exit/accounting references | Native entry VWAP, quantity, fill completion and entry cost |
| `tmp/admin-futures-audit-20260920/attempts.json` | 117 COMMITTED requests, accepted SL/TP, entry hint and durable order/trade linkage | Immutable accepted risk plan |
| `tmp/admin-futures-audit-20260920/decisions.json` | 12,076 records; entry-time ATR, regime, trend, structure and momentum metadata where present | Linked entry snapshot, not future exit confirmation |
| `tmp/real-futures-validation-20260920/data/` | Native normalized Futures OHLC and historical funding, plus separate Spot files | Only Futures 1m/funding files used for paired episodes |
| `tmp/real-futures-validation-20260920/data-validation.json` | Prior download/hash receipts | Independently rehashed local files |
| `tmp/real-futures-validation-20260920/protocol.json` | Historical research fee/slippage assumptions | Assumption source; not a live authorization |
| `tmp/real-futures-validation-20260920/paired-results.json` | Prior fixed-vs-ratchet comparison; 137 paired records | Historical context only; not rerun or treated as this full-close policy |
| `tmp/real-futures-validation-20260920/{download,model,paired}.mjs` | Prior producer and replay implementation | Read only; not executed |
| `tmp/admin-futures-audit-20260920/reconcile.mjs` | Existing fill-cycle linkage method | Read only; not executed |
| `tmp/futures-shadow-ledger-audit-20260925.jsonl` | 576 structural observer events / 96 decision times | Excluded from trade PnL replay; hashes are not executable price paths |
| `tmp/klines_sep15_23.json`, `tmp/klines_sep23_25.json` | 2,557 and 416 OHLC rows respectively, without sufficient embedded venue/symbol provenance | Excluded |

The native cache has **46 Futures OHLC files / 433,598 rows**, **16 funding files / 5,436 events**, and **24 Spot OHLC files / 74,580 rows**. All 86 local files were rehashed against the existing receipt: **0 hash mismatches**, 0 detected timestamp-order/OHLC-integrity violations. The 74,580 Spot rows are explicitly excluded; the mixed directory must not be reported as entirely Futures data.

Native 1m cache symbols: AR, BNB, BTC, CAKE, DASH, DOGE, ETH, INJ, NEAR, ONDO, SOL, TAO, UNI, XAUT, XRP and ZEC, all USDT pairs. Other timeframe files are not a replacement for a fast executable quote tape.

### Additional snapshots and prior research

- `C:/Projects/SignalVerse-Data/snapshots/2026-09-01T10-29-46-726Z/futures_standard_trades.json`: 232 records, 118 Real / 114 Demo. Real coverage is 116 Long / 2 Short, 117 at 4h / 1 at 1h; exchange field identifies 114 MEXC and 4 unknown. Of the Real records, 11 have non-null MFE, 5 have non-null R multiple and 1 has a non-null fee. Thirty-one linked decision records lack the required entry/SL/TP/ATR risk data. This snapshot alone cannot calibrate the proposed policy. Do not add its counts to the later snapshot as unique current positions.
- The associated `engine_decisions.json` has 4,032 rows: 491 Real, 2,915 Demo and 626 with null mode.
- `C:/Projects/SignalVerse-Data/snapshots/smart-exit-position-intelligence-2026-09-03T15-06-22Z/raw-smart-exit-v2-backtest.json`: prior V2 result rows do not retain ordered entry/path/ATR/peak timestamps. Nested 1M/3M windows and Spot-derived inputs are not independent native-Futures parameter validation. V2 was historically rejected; its defaults were not copied.
- Prior `paired-results.json` records a fixed-vs-ratchet net difference of -7.0868796 USDT and a stored bootstrap interval spanning zero. It concerns a different design; stop ratcheting is outside this task.
- The historical failed Shadow's 186 stale inputs remain FAIL evidence. Structural observer decisions cannot establish Real trade-profit protection.

### Source files inspected or reused from Phase 1

`api/copytrade.ts` (PnL/R/excursion helpers, Smart Exit, synchronization and close paths); `api/_shared/futures-decision-engine.ts`; `api/_shared/futures-risk.ts`; Phase 1 report and the existing historical audit/research sources above. Project instructions, strategy amendments and safe-test guidance were respected. No legacy script that can load environment files or write account/DB state was executed.

### Local evidence fingerprints

These are SHA-256 of complete local source files, not authorization identities:

| File | SHA-256 |
| --- | --- |
| Sept20 `trades.json` | `0fd7998ab049f62eb28595588a95d233331651d74757e114e56e2827bd3534df` |
| Sept20 `reconciled.json` | `155633844fd869137683df78546440aafea65ed4de97b18cf82d07241724db66` |
| Sept20 `attempts.json` | `baec3646d860125f9b4d829c82fda3ba646e108d869610ec2b78f6f5c503cfb5` |
| Sept20 `decisions.json` | `59cda572d85cf2031cfe8954a2be0cd1bf3f20c196329e86f84a2b512c575647` |
| `data-validation.json` | `72e827822e222d2c5701c6b3d8062f0c8d6dabca5ce99d52882ab76dfab8527a` |
| Current historical `protocol.json` | `c0ffbc66aa90de6c97b08a7940a2b54a36b769f018f800e9f9c503187a549ad2` |
| Sept1 standard-trades snapshot | `2669e505c9a815a8e3834694a535cf74ee4215621d7b34aaf71db0dc97213e4d` |
| Sept1 engine-decisions snapshot | `327afe1db651358ad68d75602c65dcf74188ade22b2e9d58be27784b642fab09` |
| Legacy V2 backtest JSON | `22294e87acc3835815258e1c5179c21f3d7f813c25e3635d0e06e00e12f2e228` |
| Structural Shadow ledger | `b05ba2866f60fab919150418d01ba4a657b94f176bbc836310f25ce54e0cd4e1` |

The prior receipt's protocol fingerprint is not assumed to equal the current full-file fingerprint. Existing research is not represented as a newly approved immutable Production experiment.

## 3. Missing data

| Required evidence | Present / missing | Consequence |
| --- | --- | --- |
| Accepted entry risk, one TP, entry quantity and ATR | Linked for 117 Binance entries | R-based coarse research possible |
| Ordered sub-minute price/quote observations | 0 eligible episodes | Emergency velocity and transient wick behavior unverified |
| Continuous native mark-price tape | 0 eligible episodes | Actual mark-triggered TP chronology cannot be replayed exactly |
| Full-size bid/ask and depth | 0 eligible episodes | Executable peak, spread uncertainty and market-close impact unknown |
| Observation receive time, gaps and freshness at decision | Not retained in normalized bar files | Historical bar closure does not prove live receipt latency |
| Native raw candle close-time field | Normalized 1m files retain open timestamp/OHLC, not raw close field | Canonical minute boundary is a proxy, not live provenance proof |
| Exact MFE/MAE event timestamps | Persisted extrema lack ordered peak events | Cannot trigger an earlier close from eventual MFE |
| Repeated causal momentum/structure snapshots | Entry snapshots only for this replay | Models C/D cannot be evaluated faithfully |
| Hypothetical full-close submission/ack/fill/flat timestamps | None | No live exit SLA or realized-fill guarantee |
| Exact changing quantity/margin/liquidation path | Not sufficiently complete | Four episodes excluded; no general liquidation model inferred |
| MEXC/Gate linked native episodes with accepted risk and quote tape | None in eligible replay | No cross-exchange parameter validation |
| Fresh untouched final holdout | 0 | Historical tail cannot serve as independent final acceptance |
| PHA incident identity/path | 0 uniquely linked PHA records in the 144-row primary capture | No incident reconstruction or PHA-specific tuning |

**Exact causal fast-exit coverage = 0/112; UNKNOWN/AMBIGUOUS execution coverage = 112/112 (100%).** This does not invalidate minute-proxy arithmetic; it limits what that arithmetic can prove.

## 4. Existing SignalVerse variables that can be reused

The basic reusable contract is accepted side, original native SL/ONE TP, completed entry VWAP, actual base exposure, entry-time ATR/timeframe, a trade epoch, and comparable net-PnL observations. Trend/regime/structure/momentum metadata are useful stratification inputs where actually recorded, not automatically exit signals.

At this source revision, `computeRMultiple` (`api/copytrade.ts:1494`) and `computeExcursionR` (`:1513`) divide signed price movement by `abs(entry - stopLoss)` supplied by the caller. `mergeRunningExcursion` (`:1526`) merges window extrema monotonically. The ordinary Real callers can supply the current trade-row stop. These helpers do not independently prove an immutable accepted stop snapshot; their gross price-R is not fee/funding-adjusted net R.

The historical plan check found **13/117 current `stop_loss` values differ from the accepted request**, and 13 current TP values differ from accepted TP. This does not attribute why they changed. It establishes why a later row must not define the new mechanism's original denominator.

The replay froze the accepted request's stop and TP; checked both against the linked original decision; checked decision/submission timestamps precede the first native fill; and matched the native entry order to the durable attempt. All 117 accepted-plan link checks passed. There are 22 multi-fill entries; full exposure begins only after the last entry fill. All inspected entry commissions are USDT. All primary native cycles use one-way `BOTH` position mode and reconcile entry quantity to the cycle quantity. The accepted allocation is one 100% TP, not partial targets.

For the eligible linear Binance sample:

```text
s = +1 for Long, -1 for Short
E0 = completed native entry VWAP
S0 = accepted entry-time stop, immutable within this episode
Q0 = completed base-asset exposure
R0 = Q0 * s * (E0 - S0), strictly positive
ATR0 = positive entry-time ATR, frozen for this research

CurrentNet(t) = s*Q0*(referencePrice(t)-E0)
                - entryFees - estimatedFullCloseFee
                - estimatedExitImpact + signedFundingTo(t)
PeakNet(t) = max(0, comparable CurrentNet observations up to t)
Giveback(t) = max(0, PeakNet(t)-CurrentNet(t))
PeakR = PeakNet/R0; CurrentR = CurrentNet/R0; GivebackR = Giveback/R0
GivebackATR = Giveback/(Q0*ATR0)
PeakFraction = Giveback/PeakNet, only if PeakNet > 0
```

For venues using contracts, base exposure requires a verified multiplier/conversion; the Binance sample is not proof of MEXC/Gate multiplier correctness. Leverage is not an extra multiplier on underlying price PnL/R. Changing side/quantity/entry epoch needs explicit reconciliation, not silent rescaling.

Of the 117 linked rows, 114 have non-null stored MFE; none have a non-null `peak_net_pnl_usdt`. Persisted MFE therefore does not supply a comparable net-profit peak series. MAE exists as an observation field, but no ordered executable MAE tape is supplied here.

## 5. Variables that should NOT be used

- A later mutable SL to redefine original R; an original-stop-less row treated as if it had accepted risk provenance.
- Final candle high/low, eventual maximum MFE/MAE, future indicators, later regime labels or final volume to justify an earlier policy decision.
- Gross historical MFE compared to a current cost-adjusted net profit without recomputing comparable components.
- Leverage-scaled margin return as a shared underlying price-risk measure.
- Whole-minute OHLC as if it were an ordered mark/bid/ask tape or actual fill.
- Entry trend/structure/momentum snapshot as evidence of subsequent deterioration.
- Tiny or non-positive PeakNet as the denominator of a profit-percentage trigger; missing costs treated as zero.
- A universal legacy 30%/35% giveback default, an external system's threshold, PHA identity, discovery score or AI opinion.
- Existing Demo/Smart Exit settings as independently validated standard-Real full-close parameters.

## 6. Recommended activation concept

**Research concept, not an enabled or parameter-selected policy:** latch arming only after a verified, comparable net-profit peak meaningfully exceeds immutable original risk and transaction-cost uncertainty. PeakR is the simplest scale tested here. ATR exposure is a useful second normalization for investigation, but this dataset does not justify adding a second activation knob.

Arming should not be undone merely because profit later disappears. Requiring CurrentNet to remain positive would suppress a necessary response after a gap. Conversely, one stale or unexecutable price spike cannot prove meaningful profit. A conservative cost/quote uncertainty bound is required before claiming executable activation.

Only R-based arming was quantified in the 90-configuration grid. ATR-based activation and a measured spread/depth uncertainty floor remain **UNTESTED**. Closed-minute sampling reduces wick-driven arming but may react too late; it is not a validated solution to that trade-off.

## 7. Recommended giveback concept

Use a small family rather than a hard-coded universal percentage. Compare net GivebackR first, then ATR-normalized giveback or a peak fraction only when PeakNet is strictly meaningful. The research did compare all three, with optional causal adverse-price/ATR confirmation.

None demonstrated positive validation improvement. A percentage rule was not selected. More elaborate tiered thresholds are **UNTESTED and unjustified**; adding them to this small exposed sample would increase multiple-testing risk.

Net GivebackR keeps activation and reversal comparable to the accepted risk contract. ATR is potentially useful to distinguish a normal retracement from an unusually large one, but ATR must come from a causal native observation and its timeframe definition must remain explicit.

## 8. Recommended reversal confirmation

| Model | What was actually tested | Result / limitation |
| --- | --- | --- |
| A | Armed PeakR plus GivebackR; also separate fraction/ATR giveback families | No positive validation configuration |
| B | A plus positive adverse movement from causal price peak | Identical to A across folds; no demonstrated added discrimination |
| C | Giveback plus momentum deterioration | UNTESTED: no repeated causal post-entry momentum series |
| D | Giveback plus structure deterioration | UNTESTED: entry structure is not later structural deterioration |
| E | A plus previous-to-current closed-minute adverse move / ATR0 | Tested coarse velocity, not acceleration or sub-second emergency behavior |
| F | A plus adverse move from observed price peak / ATR0 | No positive validation configuration; some no-action ties |

No signal is recommended for implementation yet. B's trivial positive-adverse test cannot distinguish strong reversal from ordinary retracement. Models C/D must use the existing shared Engine's causally timestamped evidence if later researched; they must not introduce another entry strategy.

External evidence is pattern evidence only. LEAN's [TrailingStopRiskManagementModel source](https://raw.githubusercontent.com/QuantConnect/Lean/master/Algorithm.Framework/Risk/TrailingStopRiskManagementModel.cs) illustrates side-aware running extrema and a flat target after drawdown, with state reset on side/flat changes. Its holdings-value definition, default percentage and insight cancellation are not SignalVerse's net-profit/R0 contract and were not copied. No external threshold supplies local parameter acceptance.

## 9. Normal vs emergency exit comparison

A coarse descriptive experiment required F-confirmation on two consecutive closed-minute observations for the normal branch. A second variant also permitted a stronger E-condition without that debounce. This minute-resolution experiment does not measure a sub-minute emergency path.

| Proxy variant | Pooled endpoint value, USDT | Protection exits | Mean captured sampled net peak |
| --- | ---: | ---: | ---: |
| Normal F, two closed observations | 6.631197 | 4 | -9.3316% |
| Same normal branch plus stronger coarse E branch | 6.479054 | 4 | 4.3576% |

The extra branch reduces pooled endpoint value by 0.152143 USDT. The negative capture in the normal variant means it can react after positive profit is already gone. Higher peak capture alone does not mean better final economics.

**No material two-level benefit is proven.** Prefer the simpler research family until an independent dataset proves extra complexity helps. Existing liquidation safety is separate and unchanged. Any eventual emergency path must retain identity, freshness, ownership, actual position and unresolved-execution checks; speed is not permission to bypass safety.

## 10. Candidate parameter ranges

Ranges came from **TRAIN completed episodes only**, using linear-interpolated empirical quartiles, not arbitrary production defaults. There are 34 completed training episodes; 31 positive sampled peaks, 34 positive givebacks and 27 episodes contributing positive-current-profit peak-fraction samples.

For each training episode: collect maximum sampled PeakR, maximum net giveback in R/ATR, maximum adverse price movement/ATR, and maximum one-minute adverse change/ATR before original protection exit. The fraction family uses each episode's Q75 of positive giveback fractions while current net is non-negative, then quartiles across episodes. This construction is exploratory, not a claim of optimum.

| Quantity | Q25 | Q50 | Q75 | Interpretation |
| --- | ---: | ---: | ---: | --- |
| Activation PeakR | 0.313607 | 1.205291 | 1.739223 | Original accepted risk units |
| GivebackR | 0.721794 | 1.162193 | 1.486168 | Net giveback / R0 |
| Net giveback / ATR exposure | 0.887452 | 1.317838 | 1.895961 | Divide by Q0*ATR0 |
| Peak profit fraction | 0.509568 | 0.636145 | 0.834264 | Fractions, NOT recommended percentages |
| Adverse price move / ATR0 | 0.806469 | 1.320484 | 1.852101 | From causal sampled price peak |
| One-minute adverse change / ATR0 | 0.198960 | 0.270059 | 0.417318 | Per minute; not continuous velocity |

Configuration counts: A_R 9, B 9, F 27, E 27, A_fraction 9, A_ATR 9: **90 total**. Numerical displays round to six decimals; calculations used full precision.

## 11. Parameter sensitivity

### All configurations on the validation fold

Delta is paired candidate minus fixed-original-protection proxy baseline, including separately censored endpoint values.

| Family | Configurations | Minimum validation delta, USDT | Maximum validation delta, USDT | Positive | Zero |
| --- | ---: | ---: | ---: | ---: | ---: |
| A_R | 9 | -5.368031 | -0.222382 | 0 | 0 |
| B | 9 | -5.368031 | -0.222382 | 0 | 0 |
| F | 27 | -5.401508 | 0.000000 | 0 | 3 |
| E | 27 | -4.906562 | 0.000000 | 0 | 4 |
| A_fraction | 9 | -8.416583 | 0.000000 | 0 | 1 |
| A_ATR | 9 | -5.656130 | 0.000000 | 0 | 1 |

### A_R grid, no approved configuration

| Activation R | Giveback R | Completed TRAIN delta | VALIDATION delta | Exposed historical tail delta |
| ---: | ---: | ---: | ---: | ---: |
| 0.313607 | 0.721794 | 1.337315 | -5.368031 | 3.437764 |
| 0.313607 | 1.162193 | 0.324448 | -1.503102 | 2.761419 |
| 0.313607 | 1.486168 | -0.741468 | -0.459869 | 1.625309 |
| 1.205291 | 0.721794 | -0.222743 | -4.455115 | 3.323173 |
| 1.205291 | 1.162193 | -0.385764 | -0.573160 | 2.173778 |
| 1.205291 | 1.486168 | -1.072943 | -0.723055 | 1.203658 |
| 1.739223 | 0.721794 | 1.757441 | -0.911874 | 3.230720 |
| 1.739223 | 1.162193 | 1.364317 | -0.222382 | 2.040254 |
| 1.739223 | 1.486168 | 1.003170 | -0.237371 | 1.251007 |

Twenty-five nearby empirical-quantile combinations were also inspected: activation Q65/Q70/Q75/Q80/Q85 and giveback Q40/Q45/Q50/Q55/Q60. **All validation deltas remain negative**, ranging -3.331490 to -0.177413 USDT. The exposed tail is positive, 1.019758 to 2.128392 USDT, but a small activation shift around 1.739 to 1.784 R materially changes that tail result. No stable, independently validated neighborhood is established.

Representative model configurations were chosen by best validation endpoint value, with deterministic lower-threshold tie handling, solely to display comparable trade-offs. They are not implementation recommendations. Validation selection and the already-exposed tail prevent reporting independent final acceptance. [QuantConnect's parameter-optimization guidance](https://www.quantconnect.com/docs/v2/writing-algorithms/optimization/parameters) supports separating older training from later testing and warns about overfitting; it does not validate these local thresholds.

## 12. Long vs Short results

Illustrative A_R uses activation 1.739223 R and giveback 1.162193 R **for descriptive reporting only**. Values pool all folds and include horizon MTM, not an untouched test.

| Side | Episodes | Baseline endpoint value | Candidate endpoint value | Delta, USDT | Protection exits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Long | 80 | 5.023848 | 8.206037 | 3.182189 | 7 |
| Short | 32 | -1.429388 | -1.429388 | 0.000000 | 0 |

Short had no hypothetical protection actions in this illustrative rule, so neither benefit nor false-exit behavior is validated for Short. Validation contains only 6 Short entries. The older MEXC snapshot's two Shorts cannot repair this gap. No side-specific production parameter is selected.

## 13. Timeframe results

| Entry timeframe | Episodes | Baseline endpoint value | Candidate endpoint value | Delta, USDT | Protection exits |
| --- | ---: | ---: | ---: | ---: | ---: |
| 15m | 53 | -6.774470 | -5.997997 | 0.776473 | 4 |
| 1h | 31 | 7.585503 | 8.685804 | 1.100301 | 2 |
| 4h | 18 | 8.073476 | 9.378891 | 1.305415 | 1 |
| 1d | 4 | -4.655164 | -4.655164 | 0.000000 | 0 |
| 1w | 6 | -0.634885 | -0.634885 | 0.000000 | 0 |

Daily has only one baseline completed episode; weekly has **zero completed episodes and six censored episodes**. Weekly's presence in a historical capture is not approval to enable it. There are no eligible accepted-plan 1m/5m entries for this analysis, although the observation tape is 1m. No independent timeframe ranking or per-timeframe threshold is defensible.

## 14. Volatility/regime results

Entry volatility is ATR0/E0. Training-only completed-episode tercile boundaries are 0.005951 and 0.015874 (about 0.5951% and 1.5874%). These are **descriptive stratification boundaries**, not profit-exit thresholds. Mixed entry timeframes make them imperfect comparable volatility regimes.

| Entry-volatility bucket | Episodes | Baseline value | Candidate value | Delta, USDT | Protection exits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Low | 31 | -0.578078 | -0.741558 | -0.163480 | 2 |
| Medium | 37 | 1.642617 | 1.180346 | -0.462271 | 1 |
| High | 44 | 2.529922 | 6.337861 | 3.807939 | 4 |

Entry regime: 102 NEUTRAL episodes, pooled delta +2.081888; 10 RISK_ON, delta +1.100301; **0 RISK_OFF**. This is an entry snapshot, not a causal live regime transition. The apparent high-volatility benefit is concentrated in four actions and is not an independent basis for a high-volatility-only feature.

## 15. Baseline vs candidate results

### Episode construction and limits

Of 144 native cycles, exclude 27 without a verified accepted attempt, 4 whose original SL distance falls outside a simple margin-risk bound without a usable liquidation path, and 1 without a closed observation before native exit. Remaining **112** form a minute-level proxy. The simple liquidation filter is an exclusion rule, not an exact exchange liquidation calculation.

The baseline is **fixed accepted original SL and ONE TP on the same native contract-price OHLC path**, not a reconstruction of every actual Production reanalysis/manual close or of the current shared Engine's full position lifecycle. Actual historical fills establish entry/cost provenance, but their actual exit behavior is not substituted for the counterfactual baseline. Therefore this is not exact “current Production versus new policy” acceptance.

Replay starts after the last entry fill's partial minute. No full-position profit trigger uses that partial minute's eventual OHLC. Existing native SL/TP is prioritized; ambiguous level-touch conditions would be excluded. Native gap protection at the close-submission open is checked before a hypothetical protection close. The research initially reviewed and corrected a proxy edge case involving the terminal bar's open; only the final results in this report are retained, not earlier provisional aggregates.

For each fully closed minute, update net sampled peak using its close only, then evaluate protection. Candidate execution is the next available minute open with modeled adverse impact, not that minute's later high/low/close. Bar high/low is used only for the baseline/native-protection observer after bar completion, never to arm a prior protection decision. Native mark-trigger versus contract-price chronology remains AMBIGUOUS.

The normalized input retains open time, not receipt time/native close-time field. Minute closure is modeled as `openTime + 60,000 ms`, an idealized availability assumption. No live data-provenance PASS is inferred from it.

### Chronological folds, UTC, end-exclusive

| Fold | Window | Episodes | Long / Short | Baseline closed / censored |
| --- | --- | ---: | --- | --- |
| TRAIN | 2026-09-09T00:00Z → 2026-09-17T00:00Z | 40 | 21 / 19 | 34 / 6 |
| VALIDATION | 2026-09-17T00:00Z → 2026-09-19T00:00Z | 42 | 36 / 6 | 34 / 8 |
| EXPOSED_HOLDOUT | 2026-09-19T00:00Z → 2026-09-20T13:00Z | 30 | 23 / 7 | 25 / 5 |

Threshold calibration excludes incomplete training outcomes. No earlier fold uses a later fold's prices for its endpoint. Positions remaining open at the boundary are reported separately as MTM, never as completed wins. These trades span only ten entry days; the validation/tail windows each provide very limited independent temporal variation. The tail had already been used in prior local research: **untouched final test = 0**, regardless of its chronological position.

### Required metrics, illustrative A_R

All amounts are USDT. “Endpoint value” includes priced liquidation-cost MTM of censored episodes; it is **not realized PnL**. Closed PF/win rate use only that variant's completed episodes.

| Metric | Baseline proxy | Candidate proxy |
| --- | ---: | ---: |
| Closed episodes / remaining censored | 93 / 19 | 94 / 18 |
| Hypothetical closed net PnL | 4.096563 | 8.364533 |
| Separate open MTM | -0.502103 | -1.587884 |
| Total endpoint value | 3.594460 | 6.776649 |
| Mean endpoint value per episode | 0.032093 | 0.060506 |
| Median endpoint value per episode | -0.122527 | -0.110849 |
| Closed-episode profit factor | 1.171032 | 1.391499 |
| Closed-episode win rate | 36.559140% | 41.489362% |
| Episodes | 112 | 112 |
| Protection exits | 0 | 7 |
| Premature exits, lower later baseline endpoint | Not applicable | 3 |
| Mean sampled net peak captured at protection exit | Not applicable | 37.9530% |
| Mean remaining giveback at protection exit | Not applicable | 1.331015 R |
| Original SL after sampled meaningful profit | 4 | 0 |
| Later original TP after candidate protection exit | Not applicable | 2 |
| Entry + estimated exit fees, including MTM close-cost estimates | 2.700336 | 2.701924 |
| Signed historical funding | -0.099083 | -0.092222 |
| Modeled adverse exit impact | 0.540863 | 0.541498 |
| Actual executable MFE captured | UNKNOWN | UNKNOWN |
| Portfolio max drawdown impact | UNAVAILABLE | UNAVAILABLE |
| Exact fast-exit execution coverage | 0/112 | 0/112 |

“Meaningful profit” in that table uses the illustrative activation cutoff; it is not an independently approved definition. Sampled peak capture and remaining giveback concern the seven triggered episodes, not the true intraminute MFE of the portfolio. Average retained profit is represented by those capture/value metrics, not a fabricated executable-peak measurement.

### Fold comparison and other families

| Fold | Baseline endpoint | Illustrative A_R endpoint | Delta |
| --- | ---: | ---: | ---: |
| TRAIN, including six censored | -2.343524 | -0.979207 | 1.364317 |
| VALIDATION | 11.856719 | 11.634337 | -0.222382 |
| Exposed historical tail | -5.918735 | -3.878481 | 2.040254 |

| Representative family | TRAIN delta | VALIDATION delta | Exposed tail delta | Pooled protection exits |
| --- | ---: | ---: | ---: | ---: |
| A_R / B | 1.364317 | -0.222382 | 2.040254 | 7 |
| F | 0.977538 | 0.000000 | 1.841652 | 4 |
| E | 0.045512 | 0.000000 | 1.898653 | 3 |
| Fraction | 1.003170 | 0.000000 | 1.108071 | 5 |
| ATR giveback | 0.975989 | 0.000000 | 1.810673 | 4 |

The latter four representatives made **zero validation protection exits**. Their zero validation delta cannot prove a useful policy.

Entry fees come from actual historical USDT commissions. The inherited research estimate for exit fee is 0.05%; adverse exit impact is 0.02%. Actual entry fill prices already include entry execution effects; no extra entry-slippage surcharge was added. Funding uses stored native event rate and mark value, signed by side, for constant completed exposure. This does not measure full-size executable spread/depth or exact funding/fill ordering at a live boundary.

An additional 0.1% adverse-impact stress repriced BOTH current/peak PnL and baseline/candidate endpoint values with frozen thresholds. Baseline endpoint becomes 1.431410, candidate 5.014102, with 5 protection exits and 2 premature exits. Changing cost changes the sampled net peak and therefore action selection. This synthetic stress is not proof of cost robustness at live size.

## 16. Profit protected vs future profit sacrificed

For each hypothetical full close, compare its final net value to the baseline's original-protection endpoint at the same fold horizon. Sum positive differences as “paired protected improvement” and negative differences as “sacrificed endpoint value.” This is not a claim that every improved close realized positive profit.

| Illustrative pooled comparison | Result |
| --- | ---: |
| Paired protected improvement | 4.182384 USDT |
| Sacrificed future endpoint value | 1.000195 USDT |
| Net paired endpoint difference | 3.182189 USDT |
| Protection exits whose baseline later hits SL | 4 |
| Protection exits whose baseline later hits TP | 2 |
| Protection exit with baseline horizon-censored | 1 |

Outlier removal shows the pooled benefit is not broad:

| Largest positive paired improvements removed | Remaining episodes | Remaining total delta, USDT |
| ---: | ---: | ---: |
| 0 | 112 | 3.182189 |
| 1 | 111 | 1.766345 |
| 3 | 109 | -0.941293 |
| 5 | 107 | -1.000195 |

This concentration, together with validation losses, precludes a reliable improvement claim. No manufactured confidence interval or statistically significant profitability claim is made from ten entry days and correlated/overlapping episodes.

## 17. False-exit analysis

The illustrative rule sacrifices value in **3/7 protection exits (42.86%)**: one validation and two exposed-tail episodes. Two reach the original TP later. Of the third, the baseline is still horizon-censored, so “premature” means lower endpoint value, not a proven eventual TP winner. All seven exits occur on Long positions.

Low-volatility pooled delta is negative despite a small win-rate change; medium volatility is also negative. These are concrete warnings against using win rate or avoided SL alone as acceptance.

Normal pullback versus transient spread spike, thin liquidity, wick, mark/contract discrepancy and temporary momentum slowdown **cannot be separated or frequency-estimated** from these files. Their cause-specific rates are UNKNOWN, not zero. Minute-close sampling misses intraminute favorable peaks and adverse rebounds. A single event can be both a saved later SL and an unnecessarily early close relative to a better execution opportunity; both economics and timing must be measured.

Do not compensate for false exits by adding a new re-entry/chasing strategy, moving native protection or scanner-driven actions.

## 18. Latency analysis

The Phase 1 source audit found ordinary synchronization/polling, including a browser interval around 20 seconds and a recorded VPS jobs interval of five minutes; neither establishes an always-on position-protection latency SLA. No live service or exchange timing was measured in this phase.

| Stage | Local evidence | Status |
| --- | --- | --- |
| Market movement → observation | Closed-minute historical proxy; live receive times missing | UNVERIFIED live; roughly 0–60s sampling delay in proxy |
| Observation → policy calculation | Disposable deterministic research loop | No per-position Production timing measured |
| Policy → durable exit intent | No implementation in this phase | UNVERIFIED |
| Intent → close submission | Next-open proxy, plus delay sensitivity | Not measured live |
| Submission → exchange acknowledgement | No hypothetical-close account lifecycle | UNVERIFIED |
| Acknowledgement → complete fill | Full-fill assumption only | UNVERIFIED |
| Fill → independently confirmed flat | No new exchange lifecycle | UNVERIFIED |

| Extra submission delay after closed-minute trigger | Pooled candidate endpoint value | Mean sampled peak captured |
| ---: | ---: | ---: |
| 0 minutes | 6.776649 | 37.9530% |
| 1 minute | 6.709796 | 36.3773% |
| 5 minutes | 6.844602 | 33.1514% |

The five-minute endpoint happens to rebound in some episodes. It does **not** recommend waiting five minutes or imply greater latency is safe. Capture declines; path dependence prevents a monotonic return claim. Twenty-second, sub-second, stream reconnect, rate-limit, fill and flat-confirmation latency cannot be inferred from this experiment.

The next-open fill is optimistic regarding liquidity/completeness. [QuantConnect's fill-model documentation](https://www.quantconnect.com/docs/v2/writing-algorithms/reality-modeling/trade-fills/key-concepts) distinguishes modeled fills from actual order execution and explains stale/partial-fill concerns. Those concerns remain unresolved here; external documentation is not a local fill test.

## 19. Binance/MEXC/Gate implementation constraints

This is constraint inheritance from the source/Phase 1 audit, not new live exchange compatibility validation.

| Venue | Research coverage | Constraint for any future implementation |
| --- | --- | --- |
| Binance | 112 coarse native contract-price episodes; actual entry fills; no continuous mark/depth tape | Keep existing Algo SL/ONE TP unchanged. Use existing safe full-close adapter; independently prove flat before owned protection cleanup. Native price-trigger semantics must match the tape. |
| MEXC | Old snapshot records, no eligible paired native quote episodes | Verify contract/base exposure and native price/fill semantics. Existing close/cleanup behavior needs independent after-close position proof; no claim of cross-venue parameter acceptance. |
| Gate | Source observer/adapter evidence only; no eligible paired episodes | Native Futures observer remains authoritative, not Spot. Verify multiplier/position identity and flat/owned-cleanup evidence. No open-position-path change here. |

All venues require one full-position close through the existing safe adapter. Keep native SL and ONE TP until confirmed flat; no partial TP, stop/TP edit, cancellation/recreation loop or second entry model. UNKNOWN/PARTIAL execution must remain a durable hold, never an expiring excuse to retry. No protection ownership assumption based on symbol alone. No API request was sent to any exchange in this research.

## 20. Recommended deterministic policy

**No deployable parameterized policy is recommended yet.** The simplest research contract to retain is immutable accepted risk plus causal comparable net peak and significant normalized giveback. Additional reversal confirmation must prove incremental value, not just exist in code.

For a later separately authorized design, the conceptual order remains:

```text
existing shared Entry / native SL / ONE TP
  → identify unchanged position epoch and completed exposure
  → validate ordered fresh native executable observations and cost bounds
  → update comparable peak from observations available now only
  → latch ARMED after an evidence-selected meaningful peak
  → evaluate evidence-selected giveback/reversal condition
  → durable idempotent full-close intent through existing adapter
  → verify actual FLAT
  → owned protection cleanup
  → reconciliation
```

Missing/invalid evidence yields UNKNOWN for profit policy, not fake zero risk or invented profit. Existing native protection and independent liquidation safety remain active. No AI, Supervisor, Auto Scanner, Personal List or new Strategy is involved. The same pure verdict contract should ultimately be shared across Real/Demo/Simulator; none was implemented or changed here.

## 21. Remaining uncertainties

1. Exact current Production behavior differs from the fixed-original-protection proxy; reanalysis/manual intervention and exact native mark triggers are not reconstructed.
2. Intra-minute ordering, true executable peak/MFE/MAE and positive-profit arming validity are unresolved for every eligible episode.
3. The tail is already exposed; multiple families/neighborhoods were examined. There is no genuinely untouched final test or acceptance confidence interval.
4. Small, correlated samples, overlapping entries and only ten entry days prohibit a feasible portfolio drawdown/capital-return claim. Portfolio max drawdown was deliberately not fabricated from sorted endpoint outcomes.
5. Short, daily, weekly, RISK_OFF, MEXC and Gate coverage is insufficient; no symbol-specific or side-specific calibration is justified.
6. Spread/depth costs, actual close fees and realized funding/ack/fill/flat latency remain unmeasured. A full close can still realize a loss after arming.
7. The exact PHA incident is not identified in this dataset. No screenshots or symbol-specific behavior were used.
8. Mutable-stop risk drift is real in these records, but its cause/authorization cannot be inferred; this phase does not repair it.
9. Normal-versus-emergency and momentum/structure confirmation need distinct causal tapes before complexity is justified.

## 22. Required tests before implementation

The following are future requirements, **not completed application tests**:

| Requirement | Current result | Required acceptance evidence |
| --- | --- | --- |
| Original R/TP immutable entry linkage | 117 historical Binance links checked | Versioned risk snapshot survives later SL/TP and quantity/epoch changes without silent drift |
| Quote/mark/executable-size provenance | Missing | Ordered venue-native timestamps, receive time, size-aware bid/ask/depth and finite cost bounds |
| No look-ahead | Coarse chronology checks below | Prefix replay from raw observations, future-suffix poisoning, boundary/missing/stale/out-of-order tests, no later peak/window leakage |
| Native protection race | Coarse contract-price priority only | Exact mark/contract trigger semantics, native SL/TP versus close-intent race and independently confirmed flat |
| Costs/accounting | Historical entries plus estimates | Actual commission/funding components, cost revisions, unknown-cost states and realistic full-close fill model |
| Parameter robustness | Failed to show validation improvement | Preregistered small family, untouched forward holdout, temporal blocks, outlier removal and stable neighborhoods |
| Premature-exit opportunity cost | 3 descriptive losses | Independent normal-pullback/TP-sacrifice cases, not only saved SL cases |
| Long/Short/TF/volatility | Sparse and uneven | Sufficient independent completed episodes in the proposed scope; unsupported groups remain unvalidated |
| Momentum/structure/emergency | Missing/coarse only | Causal repeated existing-Engine evidence and high-frequency adverse path; prove incremental benefit |
| Idempotency/execution safety | Not implemented | Duplicate triggers, partial fill, lost acknowledgement, UNKNOWN holds, concurrency/fencing, identity/ownership and restart/replay tests |
| Real/Demo/Simulator parity | Not implemented | Same normalized event tape gives same pure verdict; adapter/cost differences remain explicit |
| Operational latency | Unverified | Observation/intent/submission/ack/fill/flat timestamps and measured tail delays, without manufacturing Real trades |

### Checks actually executed in this phase

- Disposable stdin Node research (`node --input-type=module`), reading local JSON only; no application imports, environment loading, network or output-data files. Final run exit 0.
- **236 chronology/prefix assertions passed**: two stored-step boundary/order assertions per 112 episodes, plus 12 future-suffix condition-input poisoning checks. The latter check stored causal condition inputs; it is **not** a complete raw-data prefix-recomputation proof. The peak-building loop was reviewed for forward-only closed-price use.
- **86/86 local data-file hash checks passed**, 0 detected monotonic/OHLC-integrity violations.
- Accepted-plan provenance checks passed for 117 records; baseline `gross - fees - impact + signed funding = net` checks passed.
- 90 configurations, 25 nearby sensitivity points, side/timeframe/regime/volatility grouping, extra-delay and cost-stress comparisons actually evaluated; negative results retained.
- Research stdin source fingerprint (LF-normalized): `573bf75ca5cb6ef61b3fb65ed9d5db6f854a517dee513efbb6a9338c3cc1a5a2`.
- No new permanent framework/script, application test, Web/Admin/API build, private-account execution test or Production verification. Counts here must not be added to previous application acceptance totals.

## 23. Recommended next step

**Stop parameter selection.** Do not turn the illustrative 1.739223/1.162193 R pair, quartiles, legacy percentages or best pooled result into configuration or code.

A separately authorized data/provenance phase should first identify or obtain an ordered native executable quote/mark tape linked to accepted original risk and actual position epochs, with cost/funding/quantity metadata and receive timestamps. It should reserve a genuinely unseen temporal holdout and collect enough independent Long/Short/timeframe/volatility cases. MEXC/Gate require their own verified contract/exposure/timestamp semantics; Binance findings are not transferable acceptance.

Only then preregister a small causal full-close family and test it against faithful existing behavior, realistic fill/latency assumptions, premature-exit opportunity cost, and outlier/neighborhood stability. Research observation alone can validate data/verdict/latency coverage, not private fills or guaranteed retained profit. Implementation needs a separate owner authorization after defensible results.

### Changes, publication and final boundary

Only this research report was created, plus its identical sanitized publication copy. Existing application HEAD/history/source, `HANDOFF.md` and unrelated private/untracked work remain unchanged. No application commit was made. The AI-Log documentation commit/remote verification are reported separately upon successful publication; publication is not an application release.

```text
APPLICATION_CODE_CHANGED = NO
APPLICATION_COMMIT = NONE
STRATEGY_CHANGED = NO
DATABASE_CHANGED = NO
MIGRATIONS_CREATED = NO
PRODUCTION_CHANGED = NO
FEATURE_ENABLED = NO
SCHEDULER_OR_SERVICE_CHANGED = NO
SPOT_CHANGED = NO
DEMO_OR_SIMULATOR_CHANGED = NO
EXCHANGE_REQUESTS = 0
EXCHANGE_ACTIONS = 0
ORDERS = 0
POSITIONS_CHANGED = 0
DEPLOYMENT = NO
PARAMETERS_SELECTED_FOR_IMPLEMENTATION = NO
IMPROVEMENT_PROVEN = NO
```

**Final research decision: MORE DATA REQUIRED.**
