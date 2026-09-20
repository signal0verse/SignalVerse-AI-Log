# Binance Futures Demo — steps 1 and 2, 2026-09-20

## Metadata

- Date: 2026-09-20
- Task ID: binance-demo-preflight-bounded-execution-20260920
- Module: isolated Standard Real Futures execution-component validation
- Mode: Binance Demo only; no production trading or application deployment
- Repository / branch: signal0verse/signalverse-main / main
- Starting / ending application HEAD: 498f66d19fbaae9c21aea7c8c4ffe5601b7eeff9
- Execution window: 2026-09-20T15:18:43.397Z to 15:18:56.133Z
- Final independent read-only reconciliation: 2026-09-20T15:19:54.716Z

## Objective / Scope

Owner requested step-by-step tests on Binance Demo before deciding whether to
apply proposed changes. Owner supplied demo credentials and explicitly confirmed
at most two sequential ETHUSDT demo trades, intended notional at most 25 USDT
each, leverage 1, SL/TP, target loss at most 1 USDT per trade, cleanup and a maximum
10-minute test. These are test constraints, not a guaranteed bound under execution
failure. No production account, Spot, application Demo behavior or strategy change
was authorized by this bounded execution test.

## Actions Taken

- Checked dirty worktree and preserved prior documentation/untracked work; no pull
  across that work, no application commit or push.
- Confirmed the Futures Demo REST origin using official documentation; pinned
  every request to `https://demo-fapi.binance.com`, disabled redirects and allowed
  only reviewed endpoint/method combinations. No production fallback.
- Credentials were supplied through temporary process environment variables and
  removed when the process finished. No key/secret was written into scripts,
  env files, reports, source control, application DB or saved test artifacts.
  Credentials supplied in conversation should be rotated after testing.
- Isolated scripts live under untracked `tmp/binance-demo-validation-20260920/`.
  No application bootstrap, production env file, DB, AI or Telegram client loaded.
- Read-only preflight checked signing, account access, free collateral, modes,
  positions, regular/algo orders, public symbol filters and quote/mark snapshots.
- Added and passed offline boundary/failure tests before the demo mutations.
- Executed the authorized LONG then SHORT technical cycles with bounded IOC limit
  entry orders, current application protection functions and verified reduce-only
  closure. These deliberately controlled entries are NOT engine-generated signals.
- Reconciled exact entry/exit order identities and fill quantities, both-side fees,
  funding records, terminal protection statuses and final account cleanliness.

## Files Inspected

Project entry instructions, CLAUDE, strategy history, current handoffs, safe test
runbook, Futures execution safety report, previous simulation report,
`scripts/futures-real-execution-fault-test.mjs`, `scripts/lib/actual-futures-core.mjs`,
selected Binance execution/protection/accounting declarations in `api/copytrade.ts`,
official Binance General Info, Account and Trade API references.

## Files Changed / Implementation

- Application executable source, configuration, DB and strategy: NONE.
- New scratch files: `preflight.mjs`, `preflight.test.mjs`, `limits.mjs`,
  `execute.mjs`, `execution.test.mjs`, `reconcile.mjs`, local evidence and publication helper.
- Documentation only: this report and an additive `HANDOFF.md` entry.
- Only demo-symbol leverage was temporarily set to 1 and restored to its observed
  original setting after confirmed flat. Margin mode and account position mode
  were not changed. No global cancel-all or unrelated-order cancellation was used.

## Results

### Step 1 — preflight

The first probe received successful signed account access but stopped on its own
over-strict V3 schema assumption: it expected `canTrade`, which was absent in that
V3 response. This was a new harness issue, not evidence of a production app bug.
The probe was corrected to use V2 for the trading-enabled flag and retained V3
schema evidence. The failed attempt remains recorded, not relabeled as passing.

The subsequent 14-request read-only preflight passed. Authentication was verified,
the account reported trading enabled and positive available collateral, and no
open position, regular order or algo order was present. Mode checks completed.
This alone was NOT treated as proof that an order would execute.

### Step 2 — bounded execution components

- Two entries completed, one LONG and one SHORT, sequentially; both observed
  filled notionals were below the approved cap, with leverage 1 for the test.
- Two native protection legs per position were accepted and read back on Binance.
- Repeating each ensure call adopted/confirmed the existing leg without an extra
  protection POST: four protection creations total, not eight.
- Current actual `buildBinanceProtectionParams` / `ensureBinanceProtectionLeg`
  declarations and their local dependencies were AST-extracted from the unchanged
  application and exercised against Demo through the restricted transport.
- Entry and exit orchestration, local journal and transport belonged to the
  separate demo harness. The entire application entry path, DB journal, reviewer,
  scheduler and `openBinanceTrade` were NOT tested end to end.
- Exits were reduce-only and verified flat before removing leftover test protection.
  Final readback found zero positions, zero regular orders and zero algo orders.
  All four historical protection records were terminal `EXPIRED` at reconciliation.
- Original leverage was restored and read back. The execution run completed in
  12.736 seconds with 69 requests, well within the approved time bound.
- A separate 15-GET reconciliation verified four fills, both-side commissions,
  absence of funding events during this short window and final clean state.

Stops and targets were accepted and observed live, but the market did NOT have to
hit either trigger: positions were explicitly closed for cleanup. Therefore this
is not a trigger-fill, replacement-race, trailing-stop, restart or profitability test.
The small net demo loss reflects spread/fees on deliberate quick round trips,
not an evaluation of a trading signal or a failed strategy forecast.
Account-linked values and identifiers remain in local evidence, not this report.

## Root Cause / Findings

- CONFIRMED: current protection construction/readback works for the two tested
  LONG/SHORT Demo cases and is idempotent on a repeated matching ensure call.
- CONFIRMED WITH EXCHANGE FILL EVIDENCE: the unchanged current
  `summariseBinanceCloseFills` returns exit commission but omits entry commission.
  Summing both sets of independently queried fills produces a higher total cost.
  The previously identified accounting problem is therefore reproduced with
  actual Demo exchange responses, not solely synthetic fixtures.
- CONFIRMED: cleanup and leverage restoration completed; no unresolved test
  exposure or retained test protection remained at the final observation.
- UNCONFIRMED: engine direction quality, structure/OB/FVG profitability, profit-side
  stop movement, native triggered fills, gap/latency behavior, Supervisor usefulness,
  SQL concurrency and equivalence to production execution.

## Tests Executed

- `preflight.test.mjs`: 10/10 Node 22 offline cases PASS. Hard demo origin, GET-only
  paths, no credentials in output, V3/V2 handling, malformed quantities, auth/network
  failure, unknown-order shape and preservation/reporting of existing exposure.
- `execution.test.mjs`: 6/6 Node 22 offline cases PASS. Complete mocked lifecycle
  with actual protection declarations, lost entry ACK, lost close ACK, failed SL
  cleanup, symbol/notional/entry-count constraints and forbidden broad mutations.
- Demo preflight: first attempt STOPPED on harness schema check; corrected attempt PASS.
- Authorized exchange execution: two component cycles PASS; not strategy validation.
- Independent exchange reconciliation: PASS, no new order submitted.
- No pre-existing application regression suites were rerun in this turn; their
  previous 141-case result is not counted again as new coverage here.

Node 22.23.2 was used for the order runner and offline suites. The already cached
executable was invoked directly for credential-bearing execution, without passing
the credentials to npm. Request timestamps were corrected using demo server time;
all HTTP calls had finite timeouts and the order runner had a local durable journal.
New submissions are refused if that journal already exists; uncertain replies
are queried by the same identity, not blindly submitted again.

## Build Result

NOT RUN / not applicable: no executable application source changed.

## Git Status / Commit / Publication

No application commit, push, deploy, migration or service change. Prior work remains
preserved. This sanitized work report is published separately to
`signal0verse/SignalVerse-AI-Log`, `master`, and remote content is read back to verify.
The publication receipt remains local. No credentials or private test artifacts
are included in either repository's committed files.

## Remaining Issues / Recommended Next Step

Bounded trade authorization is consumed: do not start a third entry or a continuous
bot from this run. No improvement to engine profitability has been established.
The next proposed narrow fix is complete fee/close attribution, tested against
these exact local Demo fills and failure cases, before owner-approved application
implementation. Stop/TP replacement, profit-side stop validation and engine
opportunity filtering should remain separate subsequent gates, not be bundled into
an automatic production promotion. Application Demo parity remains deferred until
Real fixes are approved and stabilized; external Binance Demo is the test venue.

## Primary References

- [Official Futures Demo endpoint and signing](https://developers.binance.com/en/docs/products/derivatives-trading-usds-futures/general-info)
- [Account information and symbol configuration](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/account)
- [Orders, conditional protection and trade fills](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade)
