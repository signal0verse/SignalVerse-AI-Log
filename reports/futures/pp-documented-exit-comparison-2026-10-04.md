# Documented profit-protection exit comparison — 2026-10-04

## Metadata

- Date: 2026-10-04 UTC.
- Task: Research existing adverse-trend/profit-protection examples and test a suitable documented rule.
- Module: Futures; disposable offline research only.
- Application repository: SignalVerse-Main.
- Primary branch: codex/prediction-coverage-expansion-audit.
- Starting/ending application HEAD: 0dbca62357a4adf34240f40ceda3e387356ec4b0; unchanged.
- Replay 1: 2026-10-04T09:18:30.956Z–09:18:45.884Z.
- Replay 2: 2026-10-04T09:19:17.559Z–09:19:32.570Z.
- Runtime: Node v22.23.3.
- Classification: DOCUMENTED_CANDIDATE_TESTED — IMPROVEMENT_NOT_PROVEN — DO_NOT_ACTIVATE.

## Objective and scope

The owner asked whether others have implemented the idea of exiting profitable positions when the trend weakens, and asked for an actual test of a suitable example. This task researches primary documentation and conducts an offline paired replay. It does not implement an application feature, alter the existing PP detector, activate a worker, access Production, or make exchange requests.

## Documented examples — implementation is not performance evidence

1. [Freqtrade custom exit](https://www.freqtrade.io/en/stable/strategy-callbacks/#custom-exit-signal) documents per-open-trade indicator/profit-dependent exits and distinguishes them from exchange stop-loss management. Its examples demonstrate a real software mechanism, not audited profitability for SignalVerse. The documentation also warns that some rate-based backtests can be inaccurate. Inspected as an implementation example; not installed, executed or endorsed as a safe account executor.
2. [StockCharts Chandelier Exit](https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/chandelier-exit) documents Charles Le Beau's volatility-adjusted trend exit: a rolling high minus an ATR multiple for longs, or a rolling low plus that multiple for shorts. Its published defaults are 22 periods and multiplier 3. This is the one selected numerical candidate, not a claim that its stock-chart examples prove crypto performance.
3. [StockCharts ATR calculation](https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/average-true-range-atr) specifies true range, arithmetic seed and Wilder recursive smoothing, and explains initialization sensitivity. The research uses at least 250 contiguous bars before treating the indicator as available.

No independent, reproducible proof was found in the inspected sources that this exact SignalVerse profit-only, intraday adaptation improves net returns. No retailer ROI, whale narrative, or manipulation explanation was accepted as evidence.

## Frozen test design

The protocol was written and SHA-256 recorded BEFORE running this candidate against the historical data. No parameters were retuned after its result.

- One new candidate only: CHANDLIER_PROFIT_ONLY.
- Closed five-minute bars, built only from five present, contiguous native minute records.
- Rolling high/low and Wilder ATR use 22 periods, multiplier 3.
- LONG signal: previous close >= previous long line, current close < current long line; SHORT is mirrored. This is a crossover rule, not every below-line observation.
- Lines follow the published rolling formula; no extra ratchet, momentum, volume, orderflow or OI filter.
- Require estimated net exit value strictly positive at signal time.
- Execute only at the next minute open, with no use of that minute's future high/low. The immediate-next-open case is an optimistic zero-latency boundary proxy, not proven live fill availability.
- Preserve fixed entry, quantity, initial SL and ONE TP. Native open-time gaps have priority over a pending research exit; intrabar SL/TP has priority before a new signal. Simultaneous ambiguous SL/TP bars reject rather than choose the favorable outcome.
- No reentry, capital recycling, leverage adjustment or portfolio allocation.
- UNKNOWN during insufficient warmup/gaps means no research exit, not evidence of a healthy trend.
- This adapts a documented indicator to five-minute Futures profit-only exits. It is NOT exact Scanner V3, the existing PP policy, a seconds-scale detector, or a native conditional-order implementation.

Costs: actual historical entry commission/VWAP; assumed exit commission 0.05%; adverse exit impact 0.02% for both arms; signed historical funding using constant completed quantity. Stress uses 0.10% impact, recomputing the profit gate, and separately 1/5-minute extra exit delay. Net-profit-at-signal does not guarantee positive live fill after a gap.

## Data and paired cohort

Existing frozen Binance Futures data only, no fresh exchange/account calls:

- 144 historical entry-cycle records; 117 uniquely linked committed entry plans.
- Exclusions: 27 without a unique accepted plan; 4 whose initial risk reaches the coarse leverage margin bound without liquidation tape; 1 without a completed post-entry observation before native exit.
- 112 eligible independent episodes: 80 LONG / 32 SHORT, across 16 symbols.
- 203,498 native minute OHLC/base-volume rows and 5,436 funding observations.
- 39 recorded file fingerprints, including 32 bar/funding files verified against the existing receipt.
- Actual historical entry fills/plan geometry are linked locally; raw private IDs/account/order records are NOT published.
- Original SL/TP baseline reproduces the earlier replay EXACTLY, including eligible cohort, exclusion counts and net aggregates.
- All three date groups were previously exposed. None is an untouched holdout.

The bar cache preserves normalized open-time OHLC, not original native close-time/receipt fields. Closure uses the frozen minute-interval proxy. This is insufficient for the prior seconds-scale executable-input audit.

## Numerical result

USDT below is the sum across independent fixed-entry replay episodes, NOT actual realized account profit, a portfolio return, or a percentage.

| Metric | Fixed SL + ONE TP baseline | Chandelier profit-only |
|---|---:|---:|
| Eligible episodes | 112 | 112 |
| Closed in replay | 93 | 103 |
| Censored/open at cutoff | 19 | 9 |
| Closed net | +4.096563 | -1.392376 |
| Open endpoint mark-to-market | -0.252363 | +0.282682 |
| Total endpoint net | +3.844200 | -1.109694 |
| Mean net / initial risk | +0.067589R | -0.098541R |
| Closed win rate | 36.56% | 49.51% |
| Closed profit factor | 1.1710 | 0.9297 |
| Original SL exits | 59 | 52 |
| Original TP exits | 34 | 17 |
| Research protection exits | 0 | 34 |

Paired delta: **-4.953894 USDT**. Of 34 changed episodes, 12 improved and 22 worsened; 78 were unchanged. Seven later-stop-loss episodes improved, but 17 later-target episodes were exited with a worse result. Zero candidate exits were net-negative under the base proxy, yet the total became worse: banking many small profits can remove winners without removing enough losing trades.

Signal coverage: 5,320 available evaluations, 1,049 UNKNOWN evaluations, 279 adverse crossings before exits. UNKNOWN is retained, not converted to a signal. Available-sample success is not asserted.

### Side and date stability

| Group | Episodes | Research exits | Paired delta USDT |
|---|---:|---:|---:|
| LONG | 80 | 27 | -3.070718 |
| SHORT | 32 | 7 | -1.883177 |
| 2026-09-09 to 2026-09-17 exclusive | 40 | 13 | +2.012825 |
| 2026-09-17 to 2026-09-19 exclusive | 42 | 15 | -9.192313 |
| 2026-09-19 to 2026-09-20 13:00Z exclusive | 30 | 6 | +2.225593 |

Date grouping uses entry time; each replay ends at that group's frozen cutoff. Small positive date groups are not grounds for selecting a winning subgroup.

| Original entry timeframe | Episodes | Research exits | Paired delta USDT |
|---|---:|---:|---:|
| 15m | 53 | 5 | -0.485796 |
| 1h | 31 | 10 | -3.307045 |
| 4h | 18 | 12 | -4.522420 |
| 1d | 4 | 2 | +1.608854 |
| 1w | 6 | 5 | +1.752512 |

All candidate exit signals still use five-minute bars, irrespective of original entry timeframe.

### Stress / fragility

- 0.10% impact: baseline +1.680932, candidate -2.703240, delta -4.384171 USDT; 32 protection exits.
- Extra one-minute delay: candidate -1.036121, delta -4.880321; 34 exits.
- Extra five-minute delay: candidate -1.162544, delta -5.006744; 34 exits.
- Descriptive 5,000-resample entry-day block interval over 10 days: delta [-22.983342, +9.224227]. This is not an independent significance or profitability test.
- Remove the best 1/3/5 paired contributors: delta -6.718392 / -9.898145 / -12.196277.
- Portfolio drawdown is NOT computed: episodes overlap and there is no feasible capital/account replay.

The previous giveback-plus-confirmed-momentum/volume prototype also remains negative (approximately -0.677154 USDT paired delta in its preserved report). It was not retuned or relabeled. The new result does not disprove every possible trend-exit approach; it rejects activation of this tested adaptation.

## Tests executed

Commands used Node v22.23.3 from the existing local runtime, no dependency install.

```text
node --test tmp/pp-documented-exit-poc-20261004/core.test.mjs tmp/pp-scanner-exit-poc-20261004/core.test.mjs
29/29 PASS: 15 new candidate tests + 14 existing replay/accounting tests

node tmp/pp-documented-exit-poc-20261004/run.mjs
PASS: replay/invariants; economic result NEGATIVE

node --check tmp/pp-documented-exit-poc-20261004/core.mjs
node --check tmp/pp-documented-exit-poc-20261004/run.mjs
PASS
```

Coverage includes Wilder seed/recursion/gap true range, rolling formula, 250-bar warmup, invalid data/gaps, missing/forming-bar rejection, both directions, costs/funding, native SL/TP priority, ambiguity rejection, next-open timing, delay and gap loss, and no executor/I/O dependency in the research core.

Historical replay also passed 640 prefix-recomputation/future-suffix-poison checks and accounting/decision-before-execution assertions. Repeating the complete replay matched every result except the intentionally differing start/end timestamps. Static no-execution checks are not live exchange safety proof.

Web/Admin build and application regression gates were NOT rerun: no application file changed or release candidate was created.

## Files inspected and changed

Inspected:

- Existing research protocol/core/tests/runner/result under tmp/pp-scanner-exit-poc-20261004.
- Existing read-only data-validation receipt, reconciled entry capture, attempts and decision snapshots under tmp/real-futures-validation-20260920 and tmp/admin-futures-audit-20260920.
- Thirty-two existing minute/funding files.
- Repository status/HANDOFF and safe-test instructions; AI-Log README/template.
- Primary documentation linked above.

New disposable files, under tmp/pp-documented-exit-poc-20261004:

- protocol.json — frozen hypothesis and boundaries.
- core.mjs — pure documented indicator + offline exit replay only.
- core.test.mjs — 15 isolated tests.
- run.mjs — existing-data cohort/accounting comparison and evidence checks.
- result.json — generated sanitized aggregate output; no private row IDs.

Documentation only:

- reports/futures/pp-documented-exit-comparison-2026-10-04.md.
- HANDOFF.md — appended task handoff while preserving existing unrelated changes.
- AI-Log report copy under the same reports/futures filename.

No application source, existing experiment, UI, Strategy, Decision Engine, SL/TP, Scanner, adapter, PP module/Worker or database file modified.

## Reproducibility fingerprints

SHA-256:

- protocol.json: e8b7842ad743060dd414f47cfc347057851f9803d9cd2167b3c67d19ba0e7a8a
- core.mjs: 3b48730b35a80b1cce2d93e791cb0fde017c9f1f0bb07ec87b8a87a2cf7b8932
- core.test.mjs: 0d2f376a1ab23168c9459d59894b56dfc35a0cd999c222e367aed8c8fb03e4e1
- run.mjs: 394de8cd8996b0e60a5f84493692ceaecf4cb470d17bf6bcce2276776dc6d1e2
- second result.json: 7ef6f99c366f9ab628e0126a6fbb39d119d8bf0941c45f8dffcb22ddbbd6f8f7
- Stable result excluding run timestamps: 6ba2eb24a0535122fa99cb650bd36a7537cd529338213a20d76cfa945adeae33

The four private snapshot hashes are enforced in run.mjs; individual private records are never printed. Existing research core hash is pinned and unchanged.

## Risks / unresolved items

- Small, previously seen sample; correlated overlapping episodes; timeframe and profit-only adaptation are research choices.
- Historical OHLC is not authenticated executable spread/depth/tape. Fee, impact, funding boundary and native stop/TP timing remain proxies. Partial entry minute is skipped consistently in both arms; this is not a complete actual account-history reconstruction.
- Liquidation risk is only coarsely screened; no full mark/margin replay.
- A five-minute exit cannot establish a seconds-scale response to a sudden reversal.
- No proof of safe A -> FLAT -> B targeting, exclusive writer, shared close authority or exchange-side fencing is produced by finding a better policy.
- More favorable win rate is not proof of higher net profit.
- Neither the sources nor this replay establish whale intent, target hunting or guaranteed reversals.

## Safety / Git / publication

```text
APPLICATION_SOURCE_CHANGED=NO
EXISTING_PP_CHANGED=NO
STRATEGY_ACTIVATED=NO
VPS_ACCESSED=NO
PRODUCTION_CHANGED=NO
WORKER_STARTED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
DATABASE_ACCESSED=NO
DATABASE_MUTATION=NO
EXCHANGE_CALLS=0
ORDERS=0
POSITIONS_CHANGED=0
SL_TP_CHANGES=0
CLOSE_ACTIONS=0
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI=NOT_RUN
DEPLOYMENT=NO
IMPROVEMENT_PROVEN=NO
RECOMMENDATION=DO_NOT_ACTIVATE_THIS_CANDIDATE
```

Primary dirty/untracked work was preserved; no pull/reset/cleanup of the application repository. Only this sanitized report is intended for the standing-authorized AI-Log/master report publication; its publication commit and remote-byte verification receipt are returned separately. Initial sandbox network access to AI-Log failed, followed by a successful permitted authenticated read. A harmless HANDOFF hash check initially used the report-repository directory, found no file, then was corrected to the application directory; it wrote nothing.

## Recommended next step

Do not activate this adaptation. If further research is desired, require a predeclared fresh-data comparison of the actual richer market-weakness detector with executable costs and an untouched evaluation period. That collection/experiment and any later execution authorization are separate work, not performed or scheduled here.
