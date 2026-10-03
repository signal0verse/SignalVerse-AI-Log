# Binance Futures profit exit hypothesis test

## Metadata

- Date: 2026-10-04, Asia/Kuala_Lumpur.
- Module: Futures exit research, offline only.
- Author and audience: Codex for the SignalVerse owner.
- Application branch: codex/prediction-coverage-expansion-audit.
- Starting and ending application HEAD: 0dbca62357a4adf34240f40ceda3e387356ec4b0.
- Pure indicator source snapshot: 2d9ce43094f5d20148950d6b156bc9280366ecd0, clean detached checkout.
- First replay: 2026-10-03T20:33:05.512Z to 2026-10-03T20:33:23.722Z.
- Deterministic repeat: 2026-10-03T20:35:52.883Z to 2026-10-03T20:36:09.312Z.
- Runtime: Node v22.23.3.
- Changes: disposable numerical POC under tmp and this report only. No application commit, push, CI or deployment. Report-only AI-Log publication is separate.

## Objective

Test whether confirming adverse trend, momentum and volume while a position is profitable avoids surrendering profit before its original TP. The owner's proposed whale or visible-target mechanism is a hypothesis, not an established explanation. These data cannot identify who traded or their intent.

## Executive finding

**IMPROVEMENT PROVEN = NO. Do not activate this rule.**

In 112 historical fixed-entry Binance replay episodes, the frozen confirmed-weakness rule produced 7 hypothetical earlier exits. It improved 3 endpoints and worsened 4. One exit avoided a later original SL; four positions later reached their original TP in the baseline. The candidate's cost-adjusted endpoint total was 3.167046 USDT versus 3.844200 USDT for fixed SL/ONE TP, a difference of -0.677154 USDT.

The confirmation filter was less damaging than giveback-only exits, but did not beat the unchanged baseline. This is a narrow negative result for one fixed five-minute proxy, not proof that all discretionary trend exits are ineffective.

## Scope

Only existing local historical captures and native public-data caches were read. No fresh exchange requests, private-account access, VPS commands, credentials, Production DB, order endpoint, worker, scheduler, gate, UI or application code were used or changed. Scanner, PP backend/policy, Strategy, Decision Engine, risk, entry, SL and ONE TP remain untouched.

This is not the existing Scanner V3 running as an exit engine. Its current 1h/4h scoring also requires quote-volume and other inputs absent here. The experiment reuses the actual EMA helper and tests the related price/momentum/base-volume idea on five-minute bars. It must not be presented as exact Scanner or live PP parity.

## Actions taken

1. Reviewed project instructions, handoffs, strategy and safe test guidance; preserved existing dirty HANDOFF and unrelated files.
2. Reused audited historical entries, accepted original SL/ONE TP plans, native minute candles and funding.
3. Froze one protocol before calculating this task's outcomes. No threshold search or post-result tuning.
4. Ran synthetic chronology/cost/failure tests, the paired historical replay, raw-prefix checks and a deterministic repeat.
5. Kept negative, zero-action, cost-stress and premature-exit results.
6. Prepared this sanitized report using the project report template and documentation guidance.

## Files inspected

- AGENTS.md, CLAUDE.md, latest HANDOFF.md, docs/AI_HANDOFF.md, TRADING_STRATEGY.md, docs/COLLEAGUE_HANDOFF_2026-09-29.md and docs/testing/stability-test-runbook.md.
- reports/futures/profit-protection-phase2-parameter-validation-2026-10-01.md and relevant Phase 3 evidence inventory.
- reports/futures/futures-discovery-quality-evaluation-2026-09-29.md.
- Pure source snapshot api/_shared/futures-market-discovery.ts, futures-indicators.ts and relevant futures-decision-engine.ts declarations.
- Existing tmp/real-futures-validation-20260920/{protocol.json,data-validation.json,download.mjs,model.mjs,paired.mjs}.
- Existing tmp/admin-futures-audit-20260920/{reconciled.json,attempts.json,decisions.json,reconcile.mjs}.
- Sixteen Futures minute-cache files and sixteen funding-cache files. Spot cache files were not used.
- AI-Log README, report template and secret-scanner implementation.

Raw private rows, account identifiers, native order identifiers and database exports are not included in this report or its publication.

## Files changed

Only new task-local files:

- tmp/pp-scanner-exit-poc-20261004/protocol.json
- tmp/pp-scanner-exit-poc-20261004/core.mjs
- tmp/pp-scanner-exit-poc-20261004/core.test.mjs
- tmp/pp-scanner-exit-poc-20261004/run.mjs
- tmp/pp-scanner-exit-poc-20261004/result.json, generated sanitized aggregates
- reports/futures/2026-10-04-scanner-evidence-exit-offline-poc.md and its identical AI-Log report copy

No previously existing source/test/data file was changed. No permanent Production exit implementation was created.

## Data and episode construction

The inspected capture has 144 Binance Real historical entry cycles. Exactly 117 link to unique COMMITTED accepted plans; their original stop and TP match the original decision, timestamps precede the entry, native entry-order linkage matches, and fill quantity/USDT commissions/BOTH position side pass checks.

Exclusions: 27 lack a unique accepted plan, 4 fail a conservative margin-risk bound without a liquidation tape, and 1 has no completed post-entry observation before native exit. Exactly 112 episodes remain, 80 Long and 32 Short.

The 32 native cache files contain 203498 minute candles and 5436 funding events. Their complete-file receipt hashes and embedded candle-row hashes were verified. All loaded candle timestamps, OHLC/base-volume and funding order/integrity checks passed. Funding coverage was required through each episode horizon. Data-file provenance is inherited from the earlier documented public downloader, not newly authenticated exchange execution.

The [official Binance Kline documentation](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data) separates open time, volume, native close time and quote-asset volume. The old normalizer retained open time, OHLC and volume but discarded raw close-time and quote-volume fields. Consequently, interval-end availability is a historical proxy, and base-volume acceleration is not exact quote-turnover acceleration.

## Frozen research implementation

All arms use identical accepted entry, actual completed quantity, original SL and one full TP.

- Baseline: fixed SL and ONE TP.
- Giveback control: sampled net peak at least 1R, giveback at least 0.5R and 30 percent of peak, current estimated net profit at least 0.25R.
- Confirmed candidate: same profit conditions, plus two distinct consecutive closed five-minute bars with adverse trend/momentum and sustained adverse-move participation.

For Long, five-minute close must be below EMA20, its three-bar EMA slope negative, one-bar and four-bar returns negative, and last-four-bars base volume at least the comparable prior-twenty-bars average. Short is symmetric. At least 50 contiguous bars are required, with a fixed maximum 120-bar window. Missing/gapped/stale/invalid features reset confirmation and cannot authorize the candidate exit. Repeated polling cannot count as another bar.

Minute closes update the sampled net peak causally. Features use only completed five-minute periods. A signal is priced at the next minute open, not its eventual high/low. Existing native SL/TP gaps are checked before a hypothetical exit. Simultaneous SL/TP touches would exclude the episode; none occurred in the accepted sample. No fictitious intraminute tick sequence is constructed.

This represents approximately five-to-ten-minute confirmation after deterioration, with idealized next-open availability. It does NOT validate a seconds-fast professional exit. It also cannot guarantee positive realized profit after a gap.

Costs: actual entry fees; estimated exit fee 0.05 percent; adverse exit impact 0.02 percent; signed historical funding at constant completed exposure. The 0.1 percent impact stress is synthetic. Exact funding/trigger/fill order at a common boundary remains ambiguous.

## Paired results

Values are USDT and include separately priced open MTM where stated. They are counterfactual estimates, NOT realized Production profit.

| Metric | Fixed SL and ONE TP | Giveback only | Confirmed weakness |
| --- | ---: | ---: | ---: |
| Episodes | 112 | 112 | 112 |
| Closed / censored | 93 / 19 | 98 / 14 | 95 / 17 |
| Closed net value | 4.096563 | 3.619505 | 3.720358 |
| Open endpoint MTM | -0.252363 | -3.470000 | -0.553312 |
| Total endpoint value | 3.844200 | 0.149505 | 3.167046 |
| Difference from baseline | 0 | -3.694695 | -0.677154 |
| Mean endpoint per episode | 0.034323 | 0.001335 | 0.028277 |
| Closed profit factor | 1.171032 | 1.178850 | 1.161056 |
| Closed win rate percent | 36.5591 | 48.9796 | 38.9474 |
| Research protection exits | 0 | 32 | 7 |
| Improved / worsened endpoints | 0 / 0 | 12 / 20 | 3 / 4 |
| Avoided later original SL | 0 | 9 | 1 |
| Later original TP after early exit | 0 | 18 | 4 |
| Lower endpoint premature exits | 0 | 20 | 4 |
| Original SL after sampled 1R profit | 11 | 2 | 10 |
| Entry and estimated exit fees | 2.700472 | 2.699629 | 2.700245 |
| Signed funding | -0.099083 | -0.077310 | -0.089675 |
| Modeled exit impact | 0.540917 | 0.540580 | 0.540826 |

Confirmed exits capture 48.23 percent of their sampled net peak on average; this is NOT full-size executable MFE. Improved endpoints total 1.909496 USDT and sacrificed endpoint value totals 2.586650 USDT. Four of seven exits, 57.14 percent, sacrifice value relative to the baseline horizon.

Increased win rate alone is misleading: both research rules have higher win rate yet lower total endpoint value than the baseline.

The earlier Phase 2 report has a different pooled endpoint (3.594460 USDT). Its exact stdin implementation is not retained here, so the endpoint difference is NOT independently reconciled or attributed to a proven cause. This run explicitly uses the last fully observed fold close for censored positions and open-time protection priority, uniformly across its three arms. The closed baseline total matches the earlier 4.096563 USDT. No cross-report performance improvement is claimed; the previous report is not rewritten or relabeled.

## Temporal and directional checks

The entire cohort is previously exposed. The label validation below identifies the old chronological window, NOT an untouched acceptance set.

| Fold end exclusive | Episodes | Candidate minus baseline | Candidate exits |
| --- | ---: | ---: | ---: |
| Sep 9 to Sep 17 UTC | 40 | 0.317436 | 3 |
| Sep 17 to Sep 19 UTC | 42 | -0.994590 | 4 |
| Sep 19 to Sep 20 13:00 UTC | 30 | 0 | 0 |

Long: 80 episodes, 6 candidate exits, delta -0.560533 USDT.
Short: 32 episodes, 1 candidate exit, delta -0.116621 USDT.
No separate Short effectiveness claim is possible from one action.

Entry timeframe counts are 53 at 15m, 31 at 1h, 18 at 4h, 4 at 1d and 6 at 1w. Candidate deltas are -0.249862, +0.144998, -0.572290, 0 and 0 respectively. Weekly has no baseline completed outcomes; zero action is not acceptance.

Only ten entry-day blocks exist. A descriptive seeded 5000-resample day-block bootstrap gives a pooled delta interval of [-3.390388, +1.303110] USDT. It spans zero and is not formal independent significance evidence. Removing the largest improvement changes pooled delta to -2.441652 USDT; removing the three largest leaves -2.586650.

Candidate known feature evaluations: 11182; unknown warmup/missing feature evaluations: 225. Unknown is not zero weakness. There were 948 adverse-feature bars, but only 7 full research exits after profit/confirmation gates.

## Cost and delay sensitivity

At 0.1 percent adverse impact, baseline endpoint is 1.680932 USDT and candidate endpoint 1.893153 USDT, delta +0.212221, with six exits. Costs also change profit qualification, so the action set changes. This small sign reversal is reported, not used to select a winning parameter or override the negative ordinary-cost result.

An extra one-minute submission delay gives candidate endpoint 3.089577 USDT; five minutes gives 2.897849. These are modeled bar-open prices, not measured submission/fill latency.

## Tests executed

- Node 22 syntax check on run.mjs: PASS.
- Node 22 test runner on core.test.mjs: **14/14 PASS**, no failures/skips.
- Native historical replay: exit 0, 112 paired episodes.
- **640 raw-prefix recomputation and future-price/volume/funding suffix-poison checks PASS**.
- **36 existing input fingerprint checks PASS**, excluding the newly frozen protocol fingerprint; includes 32 native cache files and four supporting capture/receipt files.
- Accepted-plan and accounting identities PASS.
- Deterministic second replay: all inputs, exclusions, metrics, grouping, bootstrap and sensitivity results identical apart from collection timestamps.
- Primary git diff --check: exit 0; existing HANDOFF EOL warning is unrelated.
- No Web/Admin build or official CI: no application/frontend changes in this task.
- These research tests are not added to application acceptance or live-execution totals.

## Evidence fingerprints

| Local file | SHA256 |
| --- | --- |
| Frozen protocol | 1eab517ff642c708f90b875721c6b63187ac447a6bcfc0b7357fd7ba7665c99c |
| Pure research core | 7b954b18b93746dcda7a20f71b1a2e8c3978855ba55c58d91b5382a32aafa3d4 |
| Research tests | df41a9106215867d0dba48e152084f029a773fbcd19ef4de887e77e4290ceba2 |
| Replay runner | 4a5a26eeb1adc5b815179408744e47f1c6af4746a42c5439529d31e7a960d66c |
| Existing EMA source | 843290d778e14df6a6c1c1e7424367b224f2681ee234dc86aa0a66bc7fe793d6 |

## Risks and remaining evidence gaps

- No exact historical OI, spread/depth, quote turnover, continuous mark or receive-time tape; no liquidations/whale identity evidence.
- No seconds-level emergency behavior or actual executable full-close/fill/flat validation.
- Fixed-original-protection counterfactual, not reconstruction of every Production manual/reanalysis exit.
- Independent entries can overlap after counterfactual exits, so portfolio return/capital allocation and maximum drawdown remain UNAVAILABLE. No misleading drawdown is calculated from sorted trade endpoints.
- Warmup omissions and closed-bar latency limit fast-exit coverage; zero unknowns are not claimed.
- Existing account lifecycle/stale-close execution safety is NOT solved by a better market signal.
- No MEXC/Gate paired episode acceptance; findings cannot be transferred across venues.
- No untouched holdout, only seven candidate actions, no tuning or deployable threshold acceptance.

## Git status and publication

Application HEAD/history remain unchanged. Previously dirty HANDOFF and other contributors' work are preserved, not staged or committed. This report carries the complete research handoff without editing their work.

Application commit: NONE. Application push: NO. Report-only AI-Log commit and verified link are delivered separately after publication; publication failure must be stated rather than assumed.

## Recommended next step

Do not enable this candidate. If the owner later wants seconds-fast exit research, use an unseen timestamped Futures quote/mark/depth dataset with causal momentum/participation and explicit cost/latency evidence. Test premature TP sacrifice alongside saved SL, with unchanged entries. Separately retain the single-authority/lifecycle execution gate; this task does not implement or activate it.

## Final safety boundary

```text
IMPROVEMENT_PROVEN=NO
APPLICATION_SOURCE_CHANGED=NO
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
STRATEGY_CHANGED=NO
SCANNER_CHANGED=NO
UI_CHANGED=NO
PP_BACKEND_CHANGED=NO
PP_WORKER_STARTED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
PRODUCTION_ACCESS=NO
PRODUCTION_CHANGED_BY_TASK=NO
DATABASE_ACCESS=NO
DATABASE_MUTATION=NO
EXCHANGE_REQUESTS=0
EXCHANGE_ACTIONS=0
ORDERS=0
POSITIONS_CHANGED=0
ENTRY_SL_TP_CHANGES=0
CLOSE_ACTIONS=0
DEPLOYMENT=NO
FINAL_CLASSIFICATION=IMPROVEMENT_NOT_PROVEN
```
