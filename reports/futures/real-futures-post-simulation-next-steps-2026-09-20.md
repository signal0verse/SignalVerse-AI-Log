# Real Futures: interpreting negative experiments and next steps

## Metadata

- Date: 2026-09-20
- Task ID: real-futures-post-simulation-advice-20260920
- Module: Standard Real Copy Trade Futures
- Mode: Explanation and proposed next tests only
- Repository / branch: signal0verse/signalverse-main / main
- Starting / ending application HEAD: 498f66d19fbaae9c21aea7c8c4ffe5601b7eeff9

## Objective / Scope

Explain whether the previous tests failed, what the engine lacks and what should
be done next. No new implementation, simulation, production change or trading
authorization is inferred. Spot remains excluded; Demo parity remains deferred
until owner-approved Real fixes are completed and verified.

## Actions Taken / Files Inspected

Checked git status, reviewed the full previous simulation report and coverage
matrix and the existing AI-log report template. Revisited primary research on
backtest overfitting. Existing local documentation/untracked work was preserved.

## Findings

CONFIRMED by the prior run, not newly executed here: 141 technical tests passed;
some intentionally confirm current bugs. The profit-lock hypothesis did not
improve base-case net performance. The narrow structural candidate produced too
few trades for a credible conclusion; the rule-reviewer eliminated all entries.
This is neither a failed test runner nor a general rejection of market structure.
The narrow prototype is not the complete proposed position-management system.

The current engine already computes some structure/OB/FVG information, but its
default entry direction and SL/TP are indicator/ATR-led. The remedy is not simply
adding more indicators or pattern labels. Needed capabilities include an explicit
setup/thesis contract, coherent timeframe roles pinned to each position, economic
feasibility after costs, consistent original monetary risk, reliable execution and
accounting, and independently evaluated actionable supervision. Existing risk
controls and durable execution protections must be preserved, not described as absent.

UNCONFIRMED: a particular structural rule, tighter trailing stop, higher-timeframe
filter or stronger AI will increase real returns. The previous incomplete macro
history and approximate execution prohibit claiming an exact live-system replay.

## Recommended Next Step

1. Diagnostic experiment only: instrument the candidate funnel. Count rejection
   reasons separately for unavailable data, context, break, retest, stop distance,
   target space/net RR, OB and FVG. Verify whether excessive exclusion arises from
   a harness defect, incompatible rules or genuinely absent opportunities. Do not
   assert the cause from the combined risk-rejection counter alone.
2. Separate engineering correctness from economic edge: test real integrated
   candidate patches in an isolated fixture for complete fees/funding, immutable
   risk, non-widening legal protection, replacement uncertainty, pinned timeframes
   and atomic capacity. These criteria do not require a higher backtest profit.
   Implementing application fixes still requires the owner's next instruction.
3. Decompose hypotheses on matched opportunity streams: current baseline, one
   structural modification, then OB or FVG individually, then management changes.
   Preserve a fixed-entry comparison as well as a feasible portfolio comparison.
   Do not enable the rejected generic profit-lock or disable SHORT/15m from one
   retrospective subset. Any post-result hypothesis needs new evaluation data.
4. Measure Supervisor utility independently: evidence-backed pre-entry WAIT/REJECT
   and bounded event-driven recommendations, with no invented prices or risk-policy
   override. Compare accepted/rejected opportunity outcomes, missed winners, cost
   and latency. Rule tests are not AI-quality evidence. A prospective no-order
   shadow evaluation needs a defined scope/budget and does not mean Demo rollout.
5. Promotion requires safety, cost-adjusted performance, uncertainty and unseen
   data gates plus owner approval. No promise of achieving profitability.

## Files Changed / Implementation

Only this local sanitized advisory report and its publication helper. No application
source, settings, strategy history, account, database, Spot or Demo changes.

## Tests Executed / Build Result

NONE this turn. Earlier test figures remain explicitly dated prior-run evidence.
No build, private API, order, cancellation, migration or service operation.

## Git Status / Commit / Publication

No application commit, push or deployment. Prior documentation modifications and
untracked files remain untouched. This sanitized report is published separately
to SignalVerse-AI-Log/master and read back; publication receipt is saved locally.

## Remaining Issues / Risks / Limitations

All previously unimplemented fixes remain unimplemented. Full state-machine,
transactional SQL, precise mark-price execution and actual LLM incremental value
remain unverified. Repeatedly fitting rules to already observed historical results
can create apparent improvement without future edge.

## Research Reference

[Bailey et al., The Probability of Backtest Overfitting](https://www.davidhbailey.com/dhbpapers/backtest-prob.pdf)
supports keeping model selection separate from independent performance evidence;
it does not establish the profitability of any proposed trading setup.
