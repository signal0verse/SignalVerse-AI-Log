# Structure-led Futures and actionable supervision — proposal, 2026-09-20

## Metadata

- Date: 2026-09-20
- Task ID: structure-supervisor-remediation-proposal-20260920
- Module: Standard Copy Trade Futures engine and position management
- Mode: Proposal only; no implementation or trading authorization
- Repository / branch: signal0verse/signalverse-main / main
- Starting / ending application commit: 498f66d19fbaae9c21aea7c8c4ffe5601b7eeff9

## Objective

Propose remedies for indicator-led decisions and supervision with no demonstrated
incremental filtering benefit, before making any application changes.

## Scope / Actions Taken

Revisited current strategy principles, later amendments, handoffs and the completed
read-only audit. Distinguished observed engineering limitations from unproven
claims that structure-based strategies necessarily outperform indicators.
Consulted primary research on data-snooping and out-of-sample evaluation.
No new private-account inspection, trading action or test execution.

## Files Inspected

CLAUDE.md, TRADING_STRATEGY.md, HANDOFF.md, docs/AI_HANDOFF.md and
docs/fixes/futures-real-readonly-audit-2026-09-20.md. Earlier verified code evidence
in api/analyze.ts and api/copytrade.ts remains the current implementation baseline.

## Root Cause / Findings

CONFIRMED by the preceding code/account audit: direction is indicator-led;
structure is not the main default stop/direction authority; supervisor verdicts
showed no observed veto benefit; position reanalysis and accounting have separate
defects. UNCONFIRMED: indicator dependence alone caused losses, or OB/FVG-based
rules would guarantee a better outcome. Losing trades can be valid strategy risk.

## Proposed Design — NOT IMPLEMENTED

### 1. One versioned structural decision contract

Extend the shared deterministic engine behind an isolated experimental version,
not an untracked parallel production engine. Use venue Futures data with explicit
contract/mark trigger bases, freshness and completeness checks. Build confirmed
swings, trend/range states, support/resistance zones and break/retest evidence.
Each pivot or zone must carry both its source time and the time it became known;
no retroactive use of future bars. Unconfirmed intrabar evidence cannot silently
count as confirmed structure.

OB/FVG are candidate price-pattern zones, not proof of institutional orders or
unfilled exchange liquidity. Define formation, displacement, width, freshness,
touch/mitigation and invalidation mechanically. Test zone types separately;
do not require every correlated pattern to count as independent confirmation.

Start with one bounded setup family: structural continuation on a confirmed
break and retest, mirrored for LONG/SHORT. Add range or reversal families only
after independent evidence, not as exceptions to make rejected trades pass.
Indicators remain secondary timing/volatility evidence; strong votes cannot
override absent/invalid structure. No valid candidate means WAIT.

### 2. Assign timeframe roles and preserve trade identity

Among the user's selected timeframes, explicitly designate structural context
and execution trigger roles. Higher context is not an automatic universal veto;
each setup family must define permitted relationships. Weekly must never be
silently reintroduced if unselected. Freeze selected timeframes, setup type,
entry structure and original monetary risk on trade creation. Watchlist edits
should apply to new entries unless an explicit policy governs existing positions.
Reanalysis must assess the original thesis, not silently switch timeframe to
find an unrelated fresh-entry signal.

### 3. Structural protection and monetary sizing

SL belongs beyond the setup's objectively defined invalidation, with tested
tick/spread/volatility allowance. ATR is a buffer/sanity input, not the sole
anchor. TP must respect the first relevant opposing structure and executable
space, with fees, slippage and expected funding disclosed. Insufficient net
reward/risk means WAIT; never move the target farther merely to manufacture RR.

Position quantity derives from an owner-approved loss budget and entry-to-stop
distance plus conservative execution costs. Margin, leverage, aggregate risk,
correlation and liquidation constraints can reduce or reject size; never increase
budget just to satisfy exchange minimums. No numeric account-risk limit is chosen
in this proposal. Budget cannot guarantee actual loss under gaps/slippage.
No automatic widening of initial loss risk or averaging down to rescue a thesis.

### 4. Pre-entry Supervisor with measurable consequences

Separate deterministic gates from the language-model reviewer. Deterministic
gates enforce price/time/zone evidence, economic feasibility, portfolio limits
and protection readiness. The reviewer receives independently computed evidence
and competing-case context, not only an already-positive engine narrative.
Where practical, first-pass evidence assessment precedes showing the engine's
confidence to reduce anchoring; this remains a hypothesis to test.

Output a validated APPROVE/WAIT/REJECT plus evidence IDs and reason codes.
WAIT conditions must be observable, versioned, expire and be re-evaluated by the
engine. The reviewer cannot invent price levels, force a new direction, authorize
an entry with no engine setup or bypass risk controls. Hallucinated evidence,
timeouts or malformed responses block new entry. No quota for rejections.
Optional corrected candidates must be generated and revalidated by the engine,
not accepted as arbitrary AI price suggestions.

### 5. Event-driven open-position management

Use a deterministic state machine for valid thesis, confirmed favorable progress,
thesis invalidation, expired setup and data uncertainty. Each state has an
owner-approved action: hold, tighten protection, cancel an unfilled entry, or
request a verified reduce-only exit on defined invalidation. These are proposed
new policies, not permissions to change current trades.

Profit-side stops must be valid against CURRENT market/trigger price, tick rules
and direction, not rejected just because they crossed original entry. Net
breakeven must include entry/exit costs and funding; execution remains uncertain.
Tightening follows confirmed favorable structure and a tested retracement rule,
not every small gain. Partial exits/time stops require separate policy testing;
the existing full-TP1 rule is not silently changed.

AI reviews only meaningful events. Timeouts keep existing protection and cannot
delay hard emergency guards. The execution adapter confirms safe replacement or
preserves current orders; it must not blindly delete protection to avoid -4130.
Use atomic claims, idempotency, tick-aware proposal deduplication and bounded
retry/cost limits. Uncertain orders retain durable holds and reconciliation.

### 6. Define evidence of improvement before implementation

Repair two-sided fees/funding, close attribution and immutable initial-risk/MFE
metrics before using dashboards to judge strategy. Freeze evaluation rules before
results; use chronological development/validation/untouched test windows and
multiple symbols/regimes. Account for pivot confirmation lag, limit non-fills,
latency, contract/mark basis, slippage and all known costs. LLM historical tests
can leak later knowledge; assess incremental reviewer benefit prospectively in
shadow mode with frozen model/prompt and timestamp-bounded evidence.

On identical opportunity streams compare baseline, structure without AI and the
same structure with AI; test position-management changes in a separate controlled
comparison. Measure net expectancy, drawdown, tail losses, opportunity cost,
protection success, useful rejection precision and AI cost/latency, with sample
uncertainty. Counterfactual avoided losses are simulated estimates, not actual
saved account money. No target win rate or guaranteed gain is claimed.

Only after agreed acceptance gates: no-money shadow, demo, then separately
authorized bounded Real pilot with rollback and preserved protection. An unhelpful
reviewer is redesigned or proposed for removal; the current mandatory-review
policy is not bypassed without owner approval.

## Implementation / Files Changed

No executable, settings, strategy-history or help-content changes. This local
proposal/report and sanitized AI Log publication only. Main repository unchanged.

## Tests Executed / Build Result

NOT RUN — proposal only. No backtest, new superiority result or deployment claimed.

## Git Status / Commit

Application HEAD unchanged; existing untracked work preserved. No application
commit. This report is published to AI Log master and read back for verification.

## Remaining Issues / Risks / Limitations

Existing audit issues remain unfixed. Structural definitions, loss budgets,
timeframe role mapping, profit-lock/exit policy and release gates require an
approved specification before implementation. Pattern labels alone are not an
economic edge. Small-sample retrospective optimization can overfit.

## Recommended Next Step

Agree a narrow contract for one continuation setup, immutable initial risk and
actionable review states. Then authorize accounting/execution safety repairs and
an isolated evaluation of that contract, not a direct production replacement.

## Research Reference

Sullivan, Timmermann and White show why selecting trading rules repeatedly on
the same historical data requires data-snooping controls and out-of-sample tests.
This supports evaluation discipline, not any claim of OB/FVG profitability:
[Data-Snooping, Technical Trading Rule Performance, and the Bootstrap](https://eprints.lse.ac.uk/119144/1/dp303.pdf).
