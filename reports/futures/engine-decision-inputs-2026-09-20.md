# Standard Real Futures engine decision inputs — 2026-09-20

## Metadata

- Date: 2026-09-20
- Task ID: futures-engine-inputs-explanation-20260920
- Module: Standard Real Futures deterministic engine
- Mode: Read-only explanation
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting / ending commit: 498f66d19fbaae9c21aea7c8c4ffe5601b7eeff9

## Objective

Clarify whether the currently audited engine only analyzes indicators.

## Scope

Current standard Real Futures call path, not every analysis product or experiment.

## Actions Taken / Files Inspected

Checked git status and re-read the decision computation, macro/risk gates and
Real caller in api/analyze.ts, particularly lines 2204, 2220, 2319 and 3717.
Preserved all existing untracked work.

## Files Changed / Implementation

No application files changed. Local work report and its AI Log publication only.

## Root Cause / Findings

CONFIRMED: primary direction comes from five indicator votes (EMA trend, MACD,
RSI, StochRSI, Bollinger position), with an absolute-score threshold and
best-timeframe selection. ATR determines stop/target distances. Macro regime,
EMA200 extension, stablecoin trend and risk/execution guards can block entry.
Structure/FVG/order-block and CPR context exists, but does not become an
independent structural direction/stop-setting engine in the default Real caller.
That caller does not pass the experimental structural/CPR overrides.
Supervisor reviews the engine's existing decision; it cannot originate a new
direction or replace entry/SL/TP. Thus "only indicators and nothing else" is too
strong, while "indicator-led direction with additional filters/context" is accurate.

## Tests Executed / Build Result

None: source verification only, no code changes or private exchange calls.

## Git Status / Commit

Application repository unchanged; no new application commit or deployment.
This sanitized report is published to AI Log master and read back for verification.

## Remaining Issues / Risks / Limitations

The earlier audit's issues remain open. This explanation does not assess every
other AI-analysis, Spot, Whale or experimental engine path and makes no new
profitability claims. No private account records or credentials are published.

## Recommended Next Step

If a structural-first engine is desired, first define and test its decision and
risk rules separately; no such implementation was requested or performed here.
