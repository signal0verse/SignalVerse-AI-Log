# Real Futures read-only engine, capital and Supervisor audit — 2026-09-20

## Metadata

- Date: 2026-09-20 UTC
- Task ID: real-futures-readonly-audit-20260920
- Module: Standard Copy Trade / Real Binance Futures
- Mode: Read-only production audit; isolated offline reproductions
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: `5e56ab7ca92f25d36ea235184c0f267b2c0795cf`
- Ending documentation commit: `498f66d19fbaae9c21aea7c8c4ffe5601b7eeff9`
- Verified active executable release: `6430c450057af53e4a81d4a1a37322a5902b1783`

## Objective

Investigate the requested Real Binance account's execution results, mistakes,
capital controls, PnL protection, timeframe/direction behavior and Supervisor
contribution. The owner requested investigation, not a new implementation.

## Scope

Read-only code, scoped database GETs, private exchange GETs and bounded server-log
inspection. No orders, cancellations, account-setting edits, production database
writes, service changes or deployment. Private financial results were delivered
locally to the owner, not published in this repository.

## Actions Taken

1. Preserved unrelated work, synchronized fast-forward only and read project,
   strategy, handoff and safe-testing instructions.
2. Verified the executable release independently from repository HEAD.
3. Collected paginated, scoped database evidence and linked entry decisions,
   reviews, execution attempts, reanalysis, proposals and funding.
4. Independently reconstructed exchange position cycles from signed GET-only
   history, preserving large IDs; reconciled both sides of commissions and
   funding. Kept exact, legacy corroborated and inferred identities distinct.
5. Inspected current call sites and retained production errors; reproduced ten
   current defect/limitation behaviors in isolated AST/VM tests.
6. Wrote a private owner report and a sanitized technical handoff. Committed and
   pushed only the latter documentation with `[skip ci]`.

## Files Inspected

- AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md
- TRADING_STRATEGY.md, including dated amendments
- docs/testing/stability-test-runbook.md
- docs/fixes/futures-real-execution-safety.md
- api/copytrade.ts, api/analyze.ts, src/app/App.tsx
- Existing relevant Futures reports and this repository's report template

## Files Changed

- Main repository: HANDOFF.md and docs/fixes/futures-real-readonly-audit-2026-09-20.md
- Local-only ignored/untracked audit directory: scripts, raw evidence, summaries,
  offline reproductions and private report; NOT committed
- AI Log: this sanitized report only

## Root Cause / Findings

### CONFIRMED

- Closing-fill accounting omits entry commission. Client net PnL omits funding
  and treats missing fees as zero; independent exchange evidence confirms a
  material reporting difference in the audited sample.
- Legacy zero-PnL/SL labels remain wrong. The current estimated fallback loses
  source provenance; price proximity is not proof of close cause.
- Closing-fill history is one bounded page without pagination/end time. Pure
  summarization accepts partial closure and over-attributes an oversized fill.
- Historical funding coverage is incomplete; final vanished-position processing
  does not explicitly collect the final funding interval.
- R/MFE/MAE normalize against mutable current stop distance, mixing risk bases
  after an adjustment.
- Standard Real profit-lock stops are disallowed by the reanalysis validator;
  Smart Profit Protection is not called in that standard Real path. Full TP1
  exit is an intentional policy, not a newly introduced defect.
- Reanalysis validates entry direction/liquidation safety but can widen loss
  risk. Observed updates confirm this is more than a theoretical possibility.
- Repeated `-4130` replacement conflicts create proposal churn; raw-price equality
  before tick rounding repeatedly supersedes pending proposals.
- Production unique-index errors confirm proposal contention. Read/update locks
  and proposal replacement are not transactional. Caught error details are not
  fully preserved in the audit row.
- Entry watchlist timeframe selection is not passed into open-position
  reanalysis; weekly remains among reanalysis inputs. This does not show failure
  of the new entry filter or prove weekly was selected after its rollout.
- Spot candles drive standard Futures analysis and software exits, while native
  SL/TP use contract/mark prices. The liquidation-risk close branch cancels
  protection before confirming the close, creating an edge-case protection gap.
- Engine confidence is a normalized vote score, not an empirical success
  probability. `alignedCount` counts all non-neutral trends, including opposing
  directions, but the Supervisor prompt presents it as alignment.
- Contrary to an older audit's conclusion, current Real entry does call the paid
  Supervisor and requires CONFIRM. No veto benefit was observed in this sample;
  that is not a causal proof of no possible benefit.
- Capital guards exist, including cap, RR, isolated liquidation feasibility and
  durable execution holds, but fixed margin sizing is not fixed-loss-budget
  sizing. The cap query fails open on a count error; reproduced offline.

### LIKELY / NEEDS ADDITIONAL TESTING

- Cheap/full reanalysis snapshots use different candle lengths and structure
  calculations, potentially amplifying repetitive support-shift triggers.
- Compressed, anchored reviewer context and correlated indicator votes may limit
  discrimination. A paired, controlled comparison is required.

### UNCONFIRMED

- A specific loss caused by Spot/Futures basis divergence, a cap breach, or a
  liquidation-loss incident caused by the identified close-gap edge case.
- Profitability of any proposed trailing, timeframe, sizing or reviewer change.
- Exact AI-service cost and complete historical equity percentage drawdown.

Detailed source locations, evidence qualifications and priorities:
[technical audit at the published documentation commit](https://github.com/signal0verse/signalverse-main/blob/498f66d19fbaae9c21aea7c8c4ffe5601b7eeff9/docs/fixes/futures-real-readonly-audit-2026-09-20.md).

## Implementation

NONE to application behavior. Documentation and local audit tooling only.
No strategy history or user-help behavior changed because no feature or fix was
implemented. No private-account identifiers, financial totals, raw records,
credentials, database exports or test artifacts are included in this publication.

## Tests Executed

- `node tmp/admin-futures-audit-20260920/offline-repros.mjs`: 10/10 reproductions
  confirmed current behavior. Network-free, no env, no production bootstrap or
  database writes. This is evidence of defects/limitations, NOT an execution
  safety certification. Runtime: local Node v24.19.0, not production Node 22.
- Read-only exchange reconciliation: complete reconstructed cycle matching with
  explicitly retained identity-confidence limitations; no quantity mismatch.
- `git diff --cached --check`: PASS before documentation commit.
- Broad legacy tests were deliberately not run because some use live credentials
  or write production data.

## Build Result

NOT RUN — no executable changes; no build or deployment claimed.

## Git Status

Documentation commit successfully pushed to main. Existing unrelated untracked
work preserved. Private audit artifacts remain local and untracked.

## Commit

Application repository documentation: `498f66d19fbaae9c21aea7c8c4ffe5601b7eeff9`,
message `docs: record read-only real futures audit [skip ci]`.
Active executable SHA remains the separately verified release above. This report
is published to AI Log master and read back for content verification.

## Remaining Issues

All reported application issues remain unfixed in this request. Historical
accounting corrections, risk-policy changes, atomicity, timeframe propagation,
profit protection and reviewer evaluation require a separately authorized phase.

## Risks / Limitations

Historical samples cross prior releases and manual/exchange intervention;
timeframe performance is not randomized. Close-cause labels are heuristic.
Sampled MFE is not proof of executable profit capture. Retained server logs do
not cover every historical ERROR row. Read-only evidence and offline tests cannot
establish future profitability or validate live private-account execution safety.

## Recommended Next Step

Obtain authorization for separate accounting and concurrency repairs first,
then specify no-widen/risk-budget and timeframe propagation policy. Evaluate net
profit protection and Supervisor changes independently before any live rollout.

Reference:
[official Binance Account Trade List fields and history-window constraints](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade).
