# Binance Demo Funding: approval arrived after settlement — 2026-09-22

## Metadata

- Date: 2026-09-22 Asia/Kuala_Lumpur / 2026-09-21 16:08 UTC
- Module: ETHUSDT Binance Futures Demo Funding validation
- Mode: public read-only schedule check; no account or order action
- Repository: signal0verse/SignalVerse-Main
- Branch: main
- Starting commit: 306f073106b73c239c507661f79ca220293f7098
- Ending commit: 306f073106b73c239c507661f79ca220293f7098

## Objective

Respond to the owner's approval of one new bounded Demo Funding test and
determine whether the immediately preceding settlement window was still usable.

## Scope

The owner's affirmative answer applies to a single new ETHUSDT Futures Demo
test with the previously stated limits: at most 25 USDT notional, 1x leverage,
native stop and target, intended loss at most 1 USDT, and a confirmed close
within ten minutes. No Real account, Spot, application code or Production
setting was authorized by this step.

## Actions Taken

1. Checked the UTC clock: 2026-09-21 16:08:22 UTC, after the scheduled
   16:00 UTC Funding settlement.
2. Queried the public Binance Demo ETHUSDT premium-index endpoint. It reported
   next Funding at 2026-09-22 00:00 UTC with a finite nonzero displayed rate.
   The rate is provisional and may change before settlement.
3. Declined to open a position now because an eight-hour hold would violate
   the ten-minute approved limit; a short trade now would not cross Funding.
4. Updated the existing same-thread scheduled follow-up to perform only a
   public read-only check around 2026-09-21 23:45 UTC (2026-09-22 07:45 local).
   Its prompt expressly forbids orders, leverage changes, credentials, code
   changes, Production actions and additional scheduling.

## Files Inspected

- `tmp/SignalVerse-AI-Log-funding-implementation/templates/report-template.md`
- Existing local automation configuration for the same-thread Funding check
- Application Git status and HEAD

## Files Changed

NONE in the application. This report is the only repository publication artifact.
The existing app-level read-only follow-up configuration was updated.

## Root Cause / Findings

- CONFIRMED: the owner's approval arrived after the 16:00 UTC Funding window.
- CONFIRMED: at the public observation the next ETHUSDT Demo Funding time was
  2026-09-22 00:00 UTC.
- UNCONFIRMED: account readiness, a nonzero final Funding event, signed income
  attribution, and final net PnL. No signed account request was made in this turn.

## Implementation / Tests Executed / Build Result

- No application implementation.
- Public Demo Futures premium-index GET: HTTP 200 and expected ETHUSDT schedule
  shape, PASS for timing observation only.
- No private-account test, order, offline regression suite or build was run.

## Git Status / Commit

Application HEAD remained `306f073106b73c239c507661f79ca220293f7098`.
No application commit, push or deployment. Unrelated untracked work was
preserved. Active Production runtime SHA was not rechecked here.

## Remaining Issues / Risks / Limitations

The one-trade Funding-crossing test remains unexecuted. The next public
Funding time and rate must be rechecked shortly beforehand, as must account
flatness, symbol filters, market spread, protective-order capability and
credential path. Scheduled Codex work is unattended and is not being used to
trade. An intended stop-loss amount is not a guaranteed maximum under gaps or
exchange/network failure.

## Recommended Next Step

Near 2026-09-21 23:57 UTC, if the owner is present and the fresh preflight
passes, run only the approved single supervised Demo cycle across settlement,
close and verify flat within ten minutes, then perform delayed read-only
Funding/fee reconciliation. If the window is missed or any guard fails, place
no order and report the next available event. Ask before any application change.
