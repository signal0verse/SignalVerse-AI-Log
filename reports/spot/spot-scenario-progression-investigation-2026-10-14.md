# Classic Spot scenario progression investigation — 2026-10-14

Status: DIAGNOSIS_COMPLETE; NO_EXECUTABLE_CHANGE_OR_DEPLOYMENT.

The owner requested investigation of a fully bought first scenario in internal
Paper Demo and a separate native Binance Real account. Records were restricted
to the exact authenticated displayed Paper cycle and the native account identifier
explicitly supplied by the owner. Private identifiers, symbols, amounts, order
IDs, exchange credentials, row exports and exact financial timestamps are omitted
from this public report. Evidence is retained privately in the local task output.

Paper: all four simulated buys are recorded and candle synchronization remains
current without a data-gap error. After the final buy, every retained discovery
scan either rejected candidate quality or lacked admissible evidence; none passed.
The scanner profile is currently disabled. The classic scanner admission function
requires an enabled profile and fresh qualifying LONG evidence before any following
scenario analysis. No second-scenario decision was recorded. This is the documented
admission behavior; completion of the first ladder alone does not authorize entry.

Native Binance: all four ladder orders are recorded FILLED. The second scenario
was actually analyzed twice and both saved decisions were WAIT with
meaningfulDepthNotMet: the observed decision price was above the preceding
scenario's deepest deployed rung. A first take-profit is recorded FILLED and the
second is recorded NEW in the internal exchange journal. These are persisted
observations, not a new direct private-exchange verification. The scanner profile
is now disabled; its last candidate-quality observation rejected fresh admission.

An additional native Binance retry defect was identified. In
syncRealSpotLimitOrders, the branch without a new buy/sell fill updates the clock,
checks deployment retries, then continues before tryAutoAdvanceScenario. Thus a
fully bought cycle receiving WAIT is not reanalyzed on those subsequent ticks.
Historical admissible scans existed during this gap. This demonstrates missing
reanalysis, not a proven missed qualifying trade or loss. The current disabled
profile would independently block a new scenario even after fixing that defect.

The defect was reproduced offline by extracting and transpiling the actual
exported native sync declaration from the deployed source, with synthetic market
and memory database ports. A four-buy, open, no-new-fill cycle updated its clock
but invoked next-scenario analysis zero times. The three-buy control also made no
analysis call. No API bootstrap, environment/secret file, network, real order or
production database was used by the reproduction.

Source verification confirmed the active Core process and release
e80c41c3b7cb1fa490d66e3569a37c3ea64b41c9, exact source-byte equality with the
inspected copytrade.ts, and an active Paper service. Executable source, financial
policy, scanner settings, budgets, leases, orders and holds were not changed by
the diagnostic scripts. No profile activation, forced scan/tick, forced scenario,
private order request, release or profitability claim was made.

One initial overly broad diagnostic query was rejected by automatic review before
execution. It was replaced with an exact user-owned cycle lookup; no broader
account data was accessed. The requested diagnosis is complete. The native retry
defect remains uncorrected and undeployed. A correction must preserve scanner
admission, confirmed-fill and UNKNOWN holds, depth, costs, allocation, credit,
capacity, protection and normal official release gates.
