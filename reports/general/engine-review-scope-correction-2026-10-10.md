# SignalVerse Standard Futures Auto Scanner and Spot correctness review

## Metadata

- Date: 2026-10-10, owner working date, Asia/Kuala_Lumpur.
- Task: ENGINE REVIEW SCOPE CORRECTION.
- Mode: source review, isolated development corrections, offline validation.
- Repository: SignalVerse-Main.
- Branch: `codex/engine-intelligence-20261009`.
- Starting and ending HEAD: `b18d35403bdc71274bb18bfbf135bec50d15a6c9`.
- Candidate identity: **uncommitted development diff**, not a release commit.
- Primary checkout preserved; no synchronization or rewrite of application main.

## Objective and executive result

Reviewed Standard Futures first, its Auto Scanner second, and Spot separately.
Three new correctness boundaries are fixed locally and ready for review. The
scanner also has a reproduced, still-unfixed ordering defect. Consequently this
is **not** full engine certification or release readiness.

Fresh explicit offline suites: **664/664 passed, zero skipped**. Separately, the
unchanged historical release-scope gate **failed**, one test-file failure. Web,
Admin and 14 API bundles passed. TypeScript: 102 baseline, 102 candidate, zero
introduced diagnostics; this is not a clean whole-project TypeScript result.
No improvement in profitability is proven. No new indicator was added.

Fast Trader received no additional implementation or independent evaluation.
Its earlier uncommitted correction is preserved, not silently deleted or newly
certified. Shared-input effects were checked through Standard Futures tests.

## Actions and evidence boundaries

Inspected actual source, relevant existing tests and retained research. Executed
actual function declarations through the existing AST-isolated harness, pure
shared modules and synthetic storage/market ports. The full credential-loading
API module was not bootstrapped. Historical replays used existing checksum-bound
public data, with external transport forbidden. No exchange data was recaptured.

The new 36-case boundary suite initially had 8 passes and 28 failures. After the
three narrow corrections it passed 36/36. This is distinct from the six new Spot
core cases and the known-defect scanner ordering diagnostic. The diagnostic's
successful reproduction is **not a passing scanner-safety test**.

## A Futures Standard

### Actual decision and execution path

`buildFuturesProTimeframeInputs` in `api/copytrade.ts` obtains venue-native data
for Binance, MEXC or Gate, selects closed/current contiguous candles, computes
shared indicators and attaches normalized input hashes/provenance. The standard
handler in `api/analyze.ts`, including `analyzeOneCoinPro`, validates native basis
and provenance and uses `api/_shared/futures-decision-engine.ts` as authority.
An unavailable/disabled Real central engine is a denial, not permission to fall
back to an independent AI decision.

The implemented vote is EMA trend, MACD, RSI, StochRSI and Bollinger evidence;
absolute score at least four. Higher timeframe breaks equal-strength ties.
EMA200 extension, configured regime and stablecoin context can constrain the
decision. Structure, order-block/FVG and CPR evidence is not equivalent to a
new profitable signal: baseline SMC decision weight is zero. Real Supervisor is
a confirmation filter; it cannot rewrite the central direction or levels.

`generateFuturesSetup` keeps SL at 1.25 ATR and TP1 at twice that risk distance.
Higher analytical targets remain unchanged. `evaluateFuturesRisk` checks price
geometry, raw R:R, leverage and position-state/capacity evidence. Unknown open
position state blocks admission. Native execution feasibility, margin-mode and
leverage checks are downstream. Sizing is configured margin times effective
leverage divided by fill price, not a newly proven fixed-account-risk fraction.
Owned and native Real entry retain the existing origin/freshness/final-submit
gates and durable uncertain-entry holds; none was removed or reset.

### Confirmed defect and local repair

Before correction, native Standard and the historical input builder accepted
as few as five bars. The EMA helper substitutes last price when it lacks its
period. A 60-bar synthetic actual-core replay produced LONG, score 4 and data
completeness 1 while EMA200 equalled the last price. That is missing evidence
being presented as zero extension, not a properly seeded EMA200.

Both Standard boundaries now require **200 real closed bars** for 15m, 1h, 4h,
1d and 1w. Existing indicator arithmetic, votes, SL/TP and thresholds are unchanged.
The native short-interval requirement and legacy Spot-basis branch are preserved.
Tests cover all three native venues, 5/19/60/199 rejection, 200-bar acceptance,
the five Standard historical intervals, and exclusion of a forming 200th bar.

This deliberately restricts availability: a selected weekly timeframe needs
approximately 200 weeks. Young listings or any insufficient selected timeframe
can block the all-or-none input set. No silent lower-history fallback is proposed.
The evidence does not show how many Production decisions previously used short
history; no Production impact count is inferred.

### Incomplete capabilities and evidence

- Raw R:R is not net executable R:R after spread, fees, slippage and holding
  funding. The economics helper can account for costs, but that does not mean
  every cost is an input to central entry acceptance. The local `roundTripCostRate`
  definition has no observed caller in this source.
- OI and normalized funding are used by discovery/AUTO admission and contextual
  review, not independent mandatory votes in the Standard core. Ordinary core
  context does not provide a fully populated execution-cost model.
- Native filters/minimum order/bracket checks exist; historical executable depth,
  queue position, private fee tier and complete funding provenance are unproven.
- Demo Standard analysis can be native while `executeDemoProOpen` still prices
  from the Spot mirror, falling back to proposed entry if price lookup fails.
  `fetchDemoPriceableSymbols` intentionally checks that mirror. Thus Demo is not
  proven to be an executable native Futures fill benchmark. This was not changed.
- Hashes and closed-bar tests support reproducibility of recorded input, not
  proof of original network receipt timing or funded execution.

### Experiments

Fresh paired offline replay reused BTC/ETH/SOL, 2025 Q3 and Q4, the existing
cost contract and separate 2x cost stress. There were 24 Futures replay cases.
All 72 compared ledger/equity/open-position fields matched exact baseline and
candidate; another 72 matched the previous candidate. Adequately seeded cached
histories therefore show no behavioral regression from the new boundary.

At 1x modeled costs, both arms had 100 closed trades, summed closed net 612.688656
and marked net 651.343301. At 2x, both had 70, 557.590682 and 595.553180. These
are sums over independent replay accounts, **not** a compounded portfolio return.
Full side/timeframe, drawdown, win-rate and profit-factor records are in evidence.
This is already-inspected historical data, not a fresh holdout or proof of alpha.

Status: **local boundary fix ready for review; economic/native-fill completeness
needs further work; profitability improvement not proven**.

## B Futures Auto Scanner

### Cycle and central-engine integration

The authenticated profile-enable handler persists the selected configuration and
runs fresh V3 immediately on initial enable or venue change. The cron handler
uses existing authentication and `futuresDiscoveryTick`, configured for five
minutes with one-minute phase tolerance. This review inspected source; it did
not connect to the VPS, assert that its current timer/gate is enabled, or observe
two real ticks.

V3 evaluates native universe/liquidity, 4h trend, 1h confirmation, participation,
multi-window momentum, OI and funding evidence. AUTO quality adds its existing
strict qualification. Passing discovery only places an opportunity on the list;
the watch/entry path still needs the Standard Decision Engine and live admission.
The scanner does not place orders or close positions.

Maintenance preserves manual rows, open-position rows and qualified older rows;
age or loss of top rank alone does not retire them. Explicit invalidation can
retire non-open discovery rows. Missing observations retain the row but clear
previous entry PASS evidence. Complete universe absence can retire; incomplete
universe evidence cannot. Qualified replacements fill capacity; weak forced
substitutes are not introduced. Active-symbol uniqueness handles identical
inserts and manual wins. User deletion has its existing 24-hour cooldown.

Errors are recorded; failed/stale scans do not normally apply. The same-process
scan promise is cleared after rejection, permitting a later retry. Rate pacing,
bounded deep scan, HTTP timeouts and tick budget exist; global multi-process/IP
quota coordination and distributed restart ordering are not proven.

### Corrected timestamp boundary

NaN defeats ordinary age comparisons, and future timestamps previously passed
them. The common maintenance boundary now rejects non-integer, future, or more
than 45-minute-old as-of values before any maintenance storage operation. The
existing 45-minute policy and disabled-profile cleanup remain unchanged. Four
negative tests, exact-boundary/disabled positives and coalescer failure/retry
test passed. This closes malformed/clock-corrupt evidence admission; it is not
a replacement for serialization.

### Confirmed remaining ordering defect

`runFuturesDiscoveryScanCoalesced` uses a process-local account/venue Map for the
scan only. `maintainFuturesDiscoveryRows` reads rows, open positions and capacity,
then writes separately, without a durable run-version fence/transaction covering
the apply phase.

The offline actual-function diagnostic pauses an old metadata update, completes
a newer scan's update, then releases the old one. Final persisted run becomes
`old`, not `new`; both scan timestamps are otherwise fresh. The update filters
row identity/status but not monotonic observation version. This is a reproduced
code-path defect, not speculation that it happened in Production.

Other unresolved concurrency risks include separate capacity reads before
different-symbol inserts, disable/configuration changes during maintenance, and
open-position lookup versus retirement timing. Existing uniqueness is useful
but insufficient to prove these safe. We did not claim to reproduce every race.

No fake process-local lock was presented as a distributed fix. The next repair
needs an atomic per-profile/mode/venue apply over existing durable structures,
with monotonic accepted run time/version, configuration recheck, capacity and
open-position preservation. It requires explicit schema/RPC design and disposable
database concurrency proof; no migration or live repair occurred here.

Status: **sequential lifecycle and bounded-time admission pass offline; distributed
ordering safety is BLOCKED by the reproduced defect**.

## C Spot Engine

### Existing behavior

Spot's Market Map uses distinct local/medium/long contexts (100/365/1000 daily
bars), minimum history and layer-specific evidence. Formula B accumulation uses
separate evidence axes and capital/reserve context. Existing DCA scenarios and
ladders are already implemented; they are not missing simply because a comparison
table calls DCA a new strategy. Futures votes/configuration are not substituted.

Live `evaluateSpotScenarioDecision` calls the existing live daily-data path;
forming daily input is not equivalent to the simulator's closed historical slice.
The aggregate exit helper shares blended holding-cost checks, staged sales and
pro-rata allocations across scenario holdings. A deeper scenario's touched
target below blended cost cannot trigger a gross-loss aggregate exit. That
gross-cost check is **not** a guarantee of net profit after commissions.

Six fresh actual-function core tests prove missing history yields null evidence,
capital splits/calls stay separate, below-blended targets do not sell, valid
aggregate quantities are pro-rata, persisted stage receipts prevent repeating
that stage, and empty holdings do not create a sell. Inert fill callbacks are
not exchange execution acceptance.

### Previous corrections independently reviewed

The 400-bar simulator warmup meets the existing total-history threshold; it
does not provide 1000 bars or guarantee the long layer's independent 200-bar
minimum. The separate marked-equity field counts paid buys, sale proceeds,
fees and remaining inventory. It does not replace the owner's legacy projected
TP display or assume a hypothetical terminal liquidation.

A new defect was reproduced: fully sold scenarios left the open ledger before
its invalid-cash/fee check. Negative/nonfinite fees or proceeds could therefore
escape that check and enter closed results. Validation now occurs before a
closed scenario is removed. Six negative fixtures reject invalid settlement
values; valid complete-sale arithmetic is unchanged. A positive test uses the
actual aggregate-exit helper: starting 1000, buying 100, half sold at 120, rest
marked at 110, 0.1% fees gives 1014.84. Complete sale gives 1019.78.

### Historical quality and results

Spot replay uses causally sliced closed daily bars, not future candles, with
recorded input/source hashes. However OHLC cannot establish whether a day's
buy happened before its high/exit. Missing dates retain last-known marks whose
age is not surfaced in the new MTM series. Actual receipt times, executable
intraday sequencing and private fill/fee evidence remain missing. These are
limits to historical interpretation, not fixed by adding more warmup.

Eight fresh paired Spot replay cases retained the previous results exactly
(24 compared candidate fields). Across the two three-symbol portfolio folds:

| Arm | Cost model | Closed trades | Closed net | Marked net | Maximum fold drawdown |
|---|---:|---:|---:|---:|---:|
| Base 220-day input | 1x | 0 | 0 | 2.341102 | 0.633290% |
| Candidate 400-day input | 1x | 5 | 14.125032 | 1.008611 | 1.313340% |
| Base 220-day input | 2x | 0 | 0 | 1.935854 | 0.633358% |
| Candidate 400-day input | 2x | 5 | 13.771658 | -0.151088 | 1.321004% |

Positive closed results omit remaining inventory risk if read alone. Marked
results and the tiny five-trade sample do **not** support improved profitability.
The 2x candidate marked result is negative. No new Spot strategy is accepted.

Status: **local accounting boundaries ready for review; historical execution/data
quality incomplete; alpha evidence insufficient**.

## Five previous local corrections

1. Finite zero StochRSI remains zero, not neutral 50. Shared Standard/pure tests
   re-executed; no new indicator or vote rule.
2. Spot warmup 220 to 400 retained, with the layer-coverage limitation above.
3. Separate paid-cash/inventory MTM retained, now also checking closed-ledger
   settlement. Valid existing results reproduced.
4. Previous short-interval native bridge preserved; no new independent Fast
   Trader testing. The prior `api/analyze.ts` and provenance-file hashes match.
5. Missing/invalid Binance funding metadata remains unknown instead of inventing
   an eight-hour interval. Fresh 13-case adapter tests pass. A valid empty
   adjustment list retains the existing default; unknown cannot pass AUTO quality.
   `api/_shared/futures-discovery-data.ts` is byte-identical to prior validation.

## Tests and build

Run from the isolated worktree with Node v22.23.3:

```text
node research/engine-intelligence/review-validation.mjs
node --test scripts/engine-review-spot-core-test.mjs
node research/engine-intelligence/scanner-ordering-diagnostic.mjs
node research/engine-intelligence/review-replay.mjs futures baseline
node research/engine-intelligence/review-replay.mjs futures candidate
node research/engine-intelligence/review-replay.mjs spot baseline
node research/engine-intelligence/review-replay.mjs spot candidate
node research/engine-intelligence/review-evidence.mjs
git diff --check
```

| Offline suite | Passed |
|---|---:|
| Prior P0 actual-function corrections | 16 |
| New engine boundaries | 36 |
| Binance funding metadata | 13 |
| Development scope including negative mutations | 11 |
| Shared Futures engine | 55 |
| Historical point in time | 31 |
| Historical timing wrapper | 1 |
| Futures simulation accounting / capital / chronology / execution | 21 / 27 / 41 / 46 |
| Market discovery | 36 |
| Entry freshness / admission integration / owned entry | 98 / 65 / 86 |
| Closed native candles / discovery data / maintenance | 11 / 18 / 46 |
| New Spot actual core | 6 |
| **Total** | **664** |

The timing wrapper runs 16 inner checks, not added again to the 664 count.
Several existing suites include structural assertions: those prove wiring/scope,
not runtime concurrency, private execution or profitability. The new isolated
tests execute actual functions; injected I/O remains synthetic.

Web and Admin builds passed; Web retains its large-chunk warning. API bundling
passed 14/14. Type diagnostics matched file/code/message multiplicities between
exact base source overlays and candidate: 102 versus 102, zero introduced.
`git diff --check` passed. No official CI was dispatched.

Unchanged official-gate command:

```text
node --test scripts/owned-futures-entry-scope-test.mjs
EXIT=1
TEST_FILES_FAILED=1
ERROR=AssertionError [ERR_ASSERTION]: Exact owned entry inventory
```

The closed predecessor manifest does not admit the new engine sources/research
inventory. It fails during collection before individual cases. No historical
allowlist, hash manifest, assertion or CI step was relaxed. The separate local
development-scope check covers exact changed declarations and rejects unrelated
mutations; it is not a substitute for the release gate.

The two new research wrappers initially had local module-resolution/literal
replacement errors, and the diagnostic initially missed an imported discovery
constant. Those harness-only issues were corrected before collecting the final
evidence. They were not product regressions or omitted failed trading tests.

## Files inspected

- `api/copytrade.ts`, `api/analyze.ts` and their active Standard, discovery and Spot callers.
- `api/_shared/futures-decision-engine.ts`, `futures-risk.ts`, `futures-indicators.ts`, `futures-candle-provenance.ts`.
- `api/_shared/futures-discovery-data.ts`, `futures-market-discovery.ts`, `futures-discovery-evaluation.ts` and current entry freshness/economics helpers.
- Relevant native/owned entry, historical accounting, chronology, simulation, discovery and Spot tests.
- `scripts/lib/actual-futures-core.mjs`, `scripts/lib/futures-pure-test-context.mjs`, `scripts/lib/owned-futures-entry-parity.mjs` and its frozen manifest.
- `.github/workflows/production-ci.yml`, project instructions, handoff, strategy history and safe test runbook.
- Earlier engine-tools/custom-strategies/Spot-primitives evidence and the retained local replay/capture manifests.

## Exact task-created changes

Additional application changes in this scope-correction turn:

- `api/_shared/futures-indicators.ts`: Standard historical minimum 200.
- `api/copytrade.ts`: native Standard minimum 200, scan-time boundary, closed Spot settlement validation.

Additional tests and evidence tooling:

- `scripts/engine-intelligence-scope-test.mjs`: extend the development declaration
  inventory to the reviewed maintenance boundary; preserve negative assertions.
- `scripts/engine-review-boundaries-test.mjs`.
- `scripts/engine-review-spot-core-test.mjs`.
- `research/engine-intelligence/scope-correction-protocol.json`.
- `research/engine-intelligence/review-validation.mjs` and generated `review-validation.json`.
- `research/engine-intelligence/review-replay.mjs` and four separate
  `spot-review-{baseline,candidate}-results.json` / `futures-review-{baseline,candidate}-results.json`.
- `research/engine-intelligence/scanner-ordering-diagnostic.mjs` and its generated JSON.
- `research/engine-intelligence/review-evidence.mjs` and its generated JSON.
- `HANDOFF.md`, `TRADING_STRATEGY.md`, this report.

Prior local changes in `api/analyze.ts`, `futures-candle-provenance.ts` and
`futures-discovery-data.ts` remain unchanged and checksum-verified. Combined
development delta still spans five executable source files, not just this turn's
two. No UI, migration, service, workflow or release-manifest file changed.

Current principal source SHA-256 values:

```text
api/copytrade.ts
a06acafa1f58ff422680b128307b5cb24e18630876f13a3af1b82e655dfb301d
api/_shared/futures-indicators.ts
709a0689235f557a5688c604596fd31e50344fec3b6b7b36bb5ce2e29cf5d39a
```

All test/runner/result hashes and individual counts are in the companion evidence.
Earlier results were preserved under their original filenames.

## D Overall decision and next priority

- **Ready for review:** three new correctness boundaries plus the previously
  retained corrections, with fresh offline tests and unchanged mature-history
  replay results. Not a clean release candidate.
- **Needs repair:** durable scanner apply ordering/configuration/capacity fencing;
  Demo versus native Futures price-basis parity; Spot malformed/gap/mark-age and
  intraday execution evidence. No broad policy rewrite was attempted.
- **Blocked:** release gate's exact-inventory failure; scanner distributed safety;
  complete funded execution and economics validation.
- **Insufficient evidence:** new OI/order-flow/depth/basis/ensemble strategies and
  profitability claims. Current indicators or a comparable bot's feature list do
  not establish incremental value. Retained previous screening was not promoted.
- **Highest next priority:** repair and prove atomic, monotonically ordered
  Auto Scanner maintenance using existing durable storage, with delayed-old-run,
  concurrent capacity, disable/restart and open-position race tests. Keep this
  separate from signal tuning. Then close native fill/cost and Spot historical
  provenance gaps before any new-alpha experiment or release successor approval.

## Publication and safety

Application commit: NONE. Application push/merge/CI/deployment: NONE. The source
remains in the isolated development worktree. Only the sanitized work report and
companion evidence are intended for the owner-required AI-Log publication; its
report commit is separate from application source and does not deliver code.

```text
FUTURES_STANDARD=LOCAL_FIX_READY_FOR_REVIEW_WITH_LIMITATIONS
AUTO_SCANNER=DURABLE_ORDERING_DEFECT_REPRODUCED_NEEDS_REPAIR
SPOT=LOCAL_ACCOUNTING_FIX_READY_FOR_REVIEW_HISTORICAL_LIMITATIONS
RELEASE_READY=NO
IMPROVEMENT_PROVEN=NO
FAST_TRADER_NEW_DEVELOPMENT=NO
PRODUCTION_ACTIONS=0
DATABASE_ACTIONS=0
EXCHANGE_CALLS=0
ORDERS=0
POSITION_CHANGES=0
WORKER_STARTED=NO
DEPLOYMENT=NO
```
