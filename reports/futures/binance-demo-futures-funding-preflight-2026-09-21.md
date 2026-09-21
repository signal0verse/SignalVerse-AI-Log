# Binance Demo Futures Funding preflight — 2026-09-21

## Metadata

- Date: 2026-09-21, 13:09 UTC
- Module: Binance USDT-M Futures Demo / Real Futures Funding verification
- Mode: authenticated read-only Demo preflight; no order execution
- Repository: signal0verse/SignalVerse-Main
- Branch: main
- Starting commit: 306f073106b73c239c507661f79ca220293f7098
- Ending commit: 306f073106b73c239c507661f79ca220293f7098

## Objective

Continue the owner's step-by-step Binance Futures Demo validation of the Real
Futures final-Funding fix, without changing the main application or Spot.

## Scope

The previously approved bounded order test is ETHUSDT Demo only, at most two
sequential cycles, notional at most 25 USDT each, 1x leverage, protective
stop/target, target loss at most 1 USDT per cycle, and full cleanup within ten
minutes. This run did not place an order because no Funding settlement was
available within that interval. No Real account was touched.

## Actions Taken

1. Opened the owner's `demo.binance.com/en/futures` URL. The in-app browser
   redirected to a Binance sign-in page; no UI trade was placed.
2. Verified the Demo Futures public API clock was reachable.
3. Ran the allowlisted authenticated read-only Demo API preflight: 14 requests,
   all HTTP 200, zero mutations, zero submitted orders.
4. Checked the public ETHUSDT Funding schedule. The next settlement was
   2026-09-21 16:00 UTC, approximately 171 minutes after the preflight. A
   market-wide public scan found no settlement within the next 15 minutes.
5. Reviewed the previous bounded Demo execution and reconciliation records:
   two completed technical cycles, flat and clean; no Funding event occurred.

## Files Inspected

- `tmp/binance-demo-validation-20260920/preflight.mjs`
- `tmp/binance-demo-validation-20260920/limits.mjs`
- `tmp/binance-demo-validation-20260920/execute.mjs`
- `tmp/binance-demo-validation-20260920/execution-journal.json`
- `tmp/binance-demo-validation-20260920/reconciliation-result.json`
- `tmp/binance-demo-validation-20260920/preflight-2026-09-21T13-09-15-578Z.json`

## Files Changed

NONE in the application repository. This report is the only publication artifact.

## Root Cause / Findings

- CONFIRMED: Demo Futures authentication and the read-only account/order/market
  endpoints worked. The Demo account was trade-enabled, with no open position,
  ordinary order or algo order at preflight time.
- CONFIRMED: the previous technical Demo cycles did not encounter a Funding
  settlement. Their success does not prove final-Funding accounting.
- CONFIRMED: a ten-minute trade started during this preflight would not cross
  the next ETHUSDT Funding timestamp.
- UNCONFIRMED: signed nonzero Funding ingestion and final-net-PnL behavior after
  a real Demo settlement. No profitability or Real private-account claim follows
  from this preflight.

## Implementation

None. No application code, strategy, configuration, migration, Demo orders, or
Production state changed.

## Tests Executed

- Demo Futures public clock: HTTP 200, PASS.
- Authenticated allowlisted read-only preflight: 14/14 HTTP 200, PASS for
  readiness only; zero orders and mutations.
- Public Funding schedule scan: completed, PASS for schedule observation;
  no settlement within the previously approved ten-minute execution window.
- Actual Funding-crossing order/reconciliation test: NOT RUN.

## Build Result

NOT RUN; no code changed.

## Git Status / Commit

Application HEAD remained `306f073106b73c239c507661f79ca220293f7098`.
No application commit or push was made. Existing unrelated untracked files
were preserved. Active Production SHA was not rechecked in this run.

## Remaining Issues / Risks / Limitations

The Real Futures final-Funding change remains unverified by a nonzero Demo
Funding event. Binance Demo results would not by themselves establish Real
account correctness or profitability. No unattended Demo trade was scheduled.

## Recommended Next Step

Near an actual ETHUSDT Demo Funding timestamp, recheck exchange schedule,
account flatness, symbol rules and the user's bounded limits; only then run a
supervised protected Demo cycle across settlement, reconcile signed Funding and
fees after closing, and ask the owner before any further application changes.
