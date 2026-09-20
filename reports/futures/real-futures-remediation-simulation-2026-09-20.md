# Real Futures remediation experiments — 2026-09-20

## Metadata

- Date: 2026-09-20
- Task ID: real-futures-remediation-simulation-20260920
- Module: Standard Real Copy Trade Futures; offline research only
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting / ending application HEAD: 498f66d19fbaae9c21aea7c8c4ffe5601b7eeff9
- Last previously verified executable release: 6430c450057af53e4a81d4a1a37322a5902b1783; not re-inspected in this task
- Decision: NO PROMOTION. No proposed strategy demonstrated the required improvement.

## Objective

Test the previously proposed remedies before changing application code. Compare
before/after honestly, including adverse results. Owner decides whether to implement.
Real Futures is the only candidate target. Spot behavior is excluded. Demo parity
is deferred until Real fixes have been approved, implemented and verified.

## Scope / Actions Taken

- Read project rules, complete strategy history, handoffs and safe test runbook.
- Preserved unrelated/untracked work; safe fast-forward synchronization was already up to date.
- Created isolated prototypes and runners under local untracked
  `tmp/real-futures-validation-20260920/`. No application bootstrap or env files
  are loaded; pure current functions are extracted using TypeScript AST/VM.
- Reused already collected private audit evidence locally. No new private API,
  database, order, cancellation, configuration, service or production operation.
- Downloaded public market data with explicit GET host/path allowlists: 550 GETs,
  508,178 candles, 5,436 funding observations, 86 data files. Candle chronology,
  OHLC validity, finite values and zero internal gaps checked; hashes retained.
- Reproduced engineering defects and compared them with isolated candidate
  contracts. A passing prototype is not a deployed fix.
- Ran six portfolio variants over two chronological windows and two cost cases;
  separately replayed observed entry episodes to isolate an exit-policy hypothesis.
- No parameter optimization, side inversion or relaxed criteria after results.

## Files Inspected

`AGENTS.md`, `CLAUDE.md`, `TRADING_STRATEGY.md`, `HANDOFF.md`, `docs/AI_HANDOFF.md`,
`docs/testing/stability-test-runbook.md`, `docs/fixes/futures-real-execution-safety.md`,
the previous read-only audit/proposal, `api/analyze.ts`, `api/copytrade.ts`,
`scripts/lib/actual-futures-core.mjs`, the two execution fault suites and historical
runner sources. Legacy historical runners that bootstrap env/private clients were
inspected only, NOT executed. AI-log's existing report template was used.

## Files Changed / Implementation

- Application, Spot, Demo, API and configuration source: NONE.
- Local evidence: protocol, public downloader, isolated candidate model, portfolio
  replay, paired replay, model/contract tests, verification runner, data validation,
  outputs and logs under the untracked task directory.
- Documentation: this report and an additive `HANDOFF.md` entry only.
- No strategy-history update: no strategy was implemented or activated.
- Build: NOT RUN / not applicable; no executable application source was changed.

## Protocol and comparability

Frozen protocol file: `tmp/real-futures-validation-20260920/protocol.json`.
Public symbols: BTC, ETH, SOL, BNB, XRP, UNI. Window June 22 through September 19
UTC, 2026: first 60 days development, final 30 days chronological validation.
This is NOT pristine independent out-of-sample evidence: the preceding audit
already exposed part of September and informed these hypotheses.

All arms use identical hypothetical initial equity of 10,000 USDT, leverage 5,
at most five positions globally and one per symbol. Ordinary notional is 1,000
USDT per entry, not the owner's account settings. Risk-sized variants cap modeled
initial price/commission/slippage risk at 10 USDT and notional at 1,000 USDT;
future funding, gaps and execution failure can exceed the nominal risk amount.

Signal inputs are 250 closed bars at 15m/1h/4h/1d; weekly is not scored.
Decision clock is 15 minutes, execution clock 5 minutes. Entry is the next eligible
bar open after signal bars close, with adverse slippage. Production core and
indicator formulas are extracted, not rewritten. Existing 1.9 gross entry R:R
recheck is retained in original arms. Entries cannot consume proceeds from an
exit that happens later within the same bar. Stops win ambiguous SL/TP candles;
adverse gaps use the worse open; TP1 closes 100%, preserving current Real semantics.
Stops derived from a close only become effective in the next bar.

Fee assumption: 0.05% per side. Slippage: 0.02% per side; stress 0.10% per side.
Historical funding uses observed rate and associated mark price, charged only
while the modeled position is open. Subsecond funding publication jitter is
assigned to the boundary; no inferred zero funding series. Cutoff positions remain
open, marked to market with estimated exit fee, not invented closed wins.
Reported net includes that cutoff MTM; drawdown is sampled 5-minute net equity.

Macro history is incomplete: timestamp-bounded recorded regime, maximum age
24 hours, exists for 1,588 of 8,640 decision timestamps. The other 7,052 use null,
explicitly disclosed. Historical stablecoin context is unavailable. This controls
comparisons but is NOT a faithful replay of the entire live orchestration.
Reviewer latency, credit policy, fresh pending-signal lifecycle, lot/tick/minimum
notional filters, exact liquidation/maintenance schedules, spread depth and
mark-price TP execution are not reproduced. No live AI reviewer is bypassed or
disabled; the offline core comparison simply does not call one.

### Candidate definition

- Context: confirmed 4h higher highs/higher lows or lower highs/lower lows.
- Setup: 1h confirmed swing break, followed by directional 15m retest; two bars
  required on each side before a pivot becomes knowable.
- Break/retest/SL buffers: 0.10/0.25/0.25 ATR; break expires after 12 setup bars.
- SL: opposite confirmed structural swing plus buffer. TP: nearest observed
  opposing pivot, capped at 2 original R. No invented farther target to make a
  setup pass. Required modeled net R:R is 1.5.
- OB and FVG are mechanically defined candidate price zones with displacement,
  age and invalidation checks, NOT evidence of institutional orders. The optional
  rule-reviewer requires proximity to a surviving OB or FVG. This is a deterministic
  zone filter, NOT an LLM Supervisor and not a measurement of AI effectiveness.
- Profit-lock: activate after a completed close reaches 1 original R; stop trails
  0.5 original R behind favorable closes, never widening, with net break-even floor
  including known fees/funding. This is one hypothesis, not a universal remedy.

## Results — hypothetical portfolio, not private account PnL

Final 30-day chronological validation; amounts in virtual USDT:

| Variant | Closed / open | Net incl. MTM | Max equity drawdown | Stress net |
| --- | ---: | ---: | ---: | ---: |
| Current engine, current Spot candle source, executing simulated Futures | 328 / 3 | +248.80 | 588.01 | -6.99 |
| Same current engine, Futures candle source | 268 / 2 | +29.88 | 720.54 | -241.61 |
| Futures source + proposed profit-lock | 433 / 2 | -71.85 | 732.27 | -45.17 |
| Structure first, fixed notional | 1 / 0 | -91.53 | 140.15 | -92.98 |
| Structure first, risk sizing | 1 / 0 | -10.16 | 15.56 | -10.16 |
| Structure + risk sizing + deterministic zone reviewer | 0 / 0 | 0.00 | 0.00 | 0.00 |

The first row is NOT the Spot Copy Trade product; it is the current Futures
engine's existing Spot-price input. Spot Copy Trade was neither run nor changed.

Development-window net, in the same order: -773.59, -487.08, -1,144.87,
+115.50, +17.96 and 0.00. Structure generated just one trade in each window:
neither a single win nor reduced drawdown from almost no trading demonstrates edge.
Adding the zone reviewer removed all entries, so its filtering benefit is unproven.

Profit-lock raised net win rate from 32.84% to 46.65%, yet reduced validation
net by 101.73 USDT. Closed trades rose from 268 to 433; fees rose from 269.44
to 434.51 USDT. Faster exits also change later entries and portfolio allocation,
so this is not merely the same trades with cheaper exits. Stress improves this
variant relative to Futures baseline but remains negative, not a passing result.

On current-core Futures-input validation, closed LONG net was +417.95 across
168 trades and SHORT net -381.26 across 100 trades. The selected 1h subset had
+255.34 across 96 closes; 15m had -354.78 across 128. These are descriptive,
selection-dependent groups, not permission to disable SHORT/15m or proof of the
best standalone timeframe. Daily had only three closes; do not rank it by total.

Day-block bootstrap of closed-PnL differences is wide and crosses zero (profit-lock
minus Futures baseline: approximately -766.67 to +621.86 at 95%). Cutoff MTM is
not included in this bootstrap; it is a diagnostic, not independent certification.

### Separate paired entry replay

Previously observed entries were also replayed with their original decision SL/TP,
same actual initial quantity/entry fee, 1-minute Futures candles and observed
funding. Initial setups beyond a simple margin boundary were excluded because
an accurate liquidation path was unavailable, not treated as successful holds.
Profit-lock worsened aggregate counterfactual net despite reducing average hold
time; uncertainty crossed zero. Exact account-linked amounts remain local only.

This is NOT a realizable alternative portfolio: preserving later actual entries
can overlap positions still open in the counterfactual. It also does NOT reconstruct
historical manual or reanalysis exits. Its correct control is the same-entry fixed
SL/TP replay, not the actual account's reported PnL. First partial entry minutes
are skipped and remaining end-of-window exposure is MTM.

## Engineering findings and test coverage

| Problem / proposal | Evidence in this task | What remains unverified |
| --- | --- | --- |
| Profit/BE stops rejected; wider loss stops accepted | Actual function reproductions; candidate current-price/ratchet contract passes | Real replacement lifecycle and exchange acceptance; economic rule failed |
| Mutable R/MFE denominator | Actual current functions reproduced; immutable original-risk contract checked | Persistence and historical data repair |
| Entry commission omitted, partial/oversized closes | Actual summarizer reproductions; full-cycle, duplicate-safe, unknown-fee candidate tests | Production pagination, order/position attribution and reconciliation integration |
| Final funding missing | Candidate boundary and idempotency tests; historical public funding replay | Production final-settlement reconciliation |
| DB count failure / total-cap concurrency | Actual fail-open reproduction; in-memory fail-closed/reservation tests | Real transactional SQL reservation and cross-worker integration |
| Protection proposal race / tick churn | In-memory single-claim and tick-normalized identity tests | Postgres uniqueness races, crash recovery and native cancel/replace atomicity |
| Lost response, partial fills, malformed snapshots | Existing actual-function fault suites pass | Private-account execution not tested |
| Cancel-old-before-confirmed-replacement risk | Candidate preserves old protection on timeout contract | Venue-specific ability to replace without unsafe gaps |
| Weekly reappears in reanalysis | Current default/multiselect tests and candidate pinned-scope test | Actual per-trade persistence/reanalysis call sites remain unfixed |
| Aligned count includes opposing directions | Actual engine returns three nonneutral TFs with only two bullish; reproduced | Runtime change intentionally not made |
| Indicator direction vs structure/OB/FVG | Causal prototype, 90-day comparison, pivot/zone invalidation tests | Sample inadequate; no independent OB vs FVG effectiveness conclusion |
| Capital sizing | Same structural trade loses much less under fixed-risk sizing | No edge created; gaps/funding/liq and portfolio correlation remain risks |
| Supervisor does not add measurable benefit | Malformed/timeout response contracts tested only | Actual LLM filtering/management benefit NOT TESTED |
| Historical error rows, fallback zeros, incomplete MFE | Existing audit preserved; independent complete candles used here | No production repair or end-to-end exception telemetry tests |
| Contract vs mark trigger / source mismatch | Both candle input sources compared | Exact mark-price TP, tick/lot execution, latency and liquidity NOT VERIFIED |

## Tests Executed

1. Two existing approved fault suites: 110/110 Node test cases passed, including
   Gate/MEXC's 32 nested assertion groups counted by Node as ONE case, not added twice.
2. New isolated chronology/zone/execution model suite: 11/11 passed.
3. Actual defect reproductions + proposed contract suite: 20/20 passed.
4. Combined required Node 22 run: 141/141 passed. These include tests confirming
   defects in unchanged production functions; not 141 bugs fixed.
5. Six arms x two windows x two cost cases: 24 portfolio comparisons.
6. Paired observed-entry replay and block bootstrap completed locally.
7. Complete dataset validity/gap and per-portfolio accounting identity checks passed.
8. Required runtime `v22.23.2`: all 24 portfolio results exactly matched the first
   `v24.19.0` run. Hashes of both API files, application UI and package files stayed
   unchanged; verification receipt completed at 2026-09-20T14:46:01.975Z.

Commands are listed for reproducibility; no legacy env-reading runner is needed:

```powershell
node tmp/real-futures-validation-20260920/download.mjs
node tmp/real-futures-validation-20260920/download.mjs --actual
npx --yes --package=node@22 node tmp/real-futures-validation-20260920/verify-run.mjs
node tmp/real-futures-validation-20260920/analyse-results.mjs
```

The downloader requires public network access. `npx` obtains the isolated Node
runtime; that install is not an offline operation. Test/replay child processes
receive only OS path/temp variables and perform no network/database calls.
Scratch artifacts are deliberately not committed: paired rows contain private data.

## Root Cause / Findings

- CONFIRMED: accounting/protection/cap/attribution defects remain reproducible.
  Isolated candidate contracts demonstrate specific safer outcomes, not integration.
- CONFIRMED in this model: a higher win rate can coexist with lower net PnL;
  the proposed simple profit-lock is not a demonstrated improvement.
- CONFIRMED: this structural rule set is too selective for a credible performance
  conclusion; a zero-trade reviewer cannot be called useful merely for avoiding loss.
- UNCONFIRMED: Futures-source migration alone, OB/FVG or AI supervision will improve
  real returns. Partial macro history and execution approximations limit all results.

## Git Status / Commit / Publication

Application repo: no commit, push or deployment in this task; HEAD unchanged.
Only local documentation changes and untracked test artifacts are new; unrelated
work remains intact. Separate sanitized work-report publication goes to
`signal0verse/SignalVerse-AI-Log`, `master`, under `reports/futures/` and is verified
by reading the remote content. Publication receipt/link belongs in the final handoff.

## Remaining Issues / Risks / Recommended Next Step

Coverage is deliberately partial, not a claim that every proposal has been fully
validated: the full event-driven thesis-invalidation/expiry state machine,
portfolio correlation/aggregate monetary-risk controls, supervisor evidence-ID
validation and real SQL/venue integration were not implemented or tested end to
end. The profit-lock arm is the explicitly specified close-based R-rule above,
not the entire proposed structure-following position manager. Partial/time exits
were not introduced. These gaps remain open rather than being labeled PASS.

No arm met the frozen acceptance rule: positive validation net, superiority to the
Futures-input baseline, no worse drawdown, at least 30 closes, improvement across
four of six symbols and positive cost stress. No production promotion is justified.

Separate correctness fixes from strategy profitability. Owner may next authorize
small Real-only accounting/protection/cap fixes, with tests against actual integrated
call sites and disposable SQL. Do not implement the losing profit-lock or declare
the structural prototype profitable. A future revised hypothesis needs a new frozen
protocol and genuinely unseen/prospective shadow period; no fitting these thresholds
until the historical table turns green. Actual Supervisor effectiveness requires its
own authorized, cost-controlled evidence, not a deterministic-filter stand-in.

After owner-approved Real fixes are complete, verify full agreed behavior parity
in Demo with explicit isolation from Spot. No Demo transfer or activation happened.

## Primary API references

Funding observations include the associated mark price: [Binance funding history](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data#get-funding-rate-history).
Native conditional execution has its own trigger/order contracts; candle replay is
not proof of a live fill: [Binance Futures trade API](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade).
