# Binance Futures Demo funding-crossing: final result (2026-09-22)

## Metadata

- Date: 2026-09-22 UTC
- Module: Isolated, one-shot ETHUSDT Binance Futures Demo test
- Mode: Demo only; report and read-only follow-up
- Application repository: `signal0verse/SignalVerse-Main`, `main` at `7a8f2a5cb2aa9cf2a435ed9b1f9ab0e5928faf5b` at the time of inspection
- Production deployed-SHA file at 2026-09-22 00:38 UTC: `cbc64240002d7b491774aafbfa5d650cd9460956`; this is separate from the application repository HEAD and was not changed by this report work
- AI Log repository: `signal0verse/SignalVerse-AI-Log`, `master`; starting commit `b928c21953697b9b36f3b3141303906126ce6d41`

## Objective and scope

Report the outcome of the previously approved, bounded, one-trade ETHUSDT Futures Demo funding-crossing test. The test was scheduled on a VPS because the owner's desktop would be off. No real-account trade, Spot trade, application strategy change, Production deployment, or additional Demo trade was authorized by this reporting request.

## Actions taken

1. Read the isolated test execution journal, the private reconciliation result (extracting only aggregate trade data), systemd service/timer state, and relevant journal lines.
2. Ran one authenticated **GET-only** Demo Futures preflight after the event to verify account state. It made 14 successful read requests, without orders or setting changes.
3. Inspected the isolated launch wrapper to classify the service failure; did not rerun it or alter the VPS.
4. Confirmed the one-shot timers have no next scheduled execution.

## Files inspected

- VPS isolated test `execution-journal.json`, `funding-reconciliation-private.json`, and `watchdog-result.json` (private identifiers omitted here)
- VPS `/etc/systemd/system/sv-demo-funding.service` and unit journal
- Local `tmp/binance-demo-funding-20260921/launch.sh`
- Application and AI Log Git status

## Files changed

- This AI Log report only. No application code or settings were changed in this reporting turn.

## Confirmed results

- Exactly one Demo entry POST: BUY `0.008 ETH` at `2775.02 USDT`, filled at 2026-09-21 23:57:43.616 UTC. Actual entry notional: `22.20016 USDT` at 1x during the bounded test.
- Native stop-loss `2712.52` and take-profit `2900.02` were verified as present while the position was open. Their *trigger behavior* was not exercised.
- The position was held over the 2026-09-22 00:00:00 UTC funding timestamp. One funding-income row was independently reconciled: `-0.00222019 USDT` paid.
- Exit SELL `0.008 ETH` at `2775.20 USDT` filled at 00:00:15.536 UTC, roughly 152 seconds after entry. Two fills total; no second entry.
- Gross realized price PnL: `+0.00144000 USDT`. Entry and exit commissions combined: `0.01776070 USDT`. Funding: `-0.00222019 USDT`. **Net of these recorded items: `-0.01854089 USDT`**. This is a technical execution result, not a profitable trading result.
- The main test process completed with `entryPosts=1`, `finalFlatAndClean=true`, and `leverageRestored=true`. The reconciler at 00:20:10 UTC reported `DEMO_FUNDING_RECONCILIATION_PASS`, with zero final open positions, standard orders, and algo orders, and no submitted orders.
- Independent timed watchdog runs at approximately 00:06 and 00:07 UTC reported `FLAT_CLEAN_AND_RESTORED`; neither submitted a close POST because the account was already flat.
- A fresh authenticated read-only check at 00:37:29–00:37:34 UTC passed 14/14 requests and found zero open positions, standard orders, and algo orders. It found one-way position mode, normal single-asset margin mode, and trading permission enabled.
- All three one-shot timers have elapsed and show no next run.

## Safety defect: immediate stop hook

- **CONFIRMED:** The systemd main process exited successfully (`ExecMainStatus=0`), but the service unit ended `Result=exit-code` because its immediate `ExecStopPost` watchdog wrapper exited `65/DATAERR` at 00:00:21 UTC.
- **CONFIRMED from the pinned wrapper:** exit 65 is emitted when its `demo.env` credential path is not readable. Thus the immediate post-stop watchdog did not execute its account checks in this run.
- **UNCONFIRMED:** The deeper reason the credential was unreadable in `ExecStopPost` (for example credential lifecycle or unit configuration). No source or configuration change was made to test a fix.
- **Impact:** No exposure remained in this observed run because the main process had already closed the position and the later independent watchdogs and fresh read confirmed a clean account. However, the immediate backup path is **not proven safe** for a future unattended run. Repair and exercise that path before reusing this one-shot design.

## Tests and verification

| Check | Outcome |
| --- | --- |
| One bounded Demo order and native protection presence | PASS |
| Held across funding and reconciled actual funding-income row | PASS |
| Final flat/clean state, restored leverage, independent timed watchdog | PASS |
| Fresh 14/14 authenticated GET-only account preflight | PASS |
| Immediate `ExecStopPost` backup watchdog | **FAIL** — exit 65 before account checks |
| Strategy quality, signal engine, supervisor intervention, stop/target trigger, or profitability | **NOT TESTED** |

No build or application test suite was run in this reporting turn. No real-account or Spot behavior was exercised. This single Demo trade does not establish live reliability, profitability, or optimal long/short/time-frame behavior.

## Git and publication state

The application worktree had no tracked changes; existing unrelated untracked files were preserved. This report is the only intended AI Log change. Publication commit and remote verification are recorded by the publishing operation and should not be inferred from this draft.

## Recommended next step

Before any further unattended Demo trade, fix and deliberately test the immediate `ExecStopPost` credential/access failure. Then use separate controlled Demo scenarios to test forced stop, take-profit, cancellation/reconciliation, and the actual SignalVerse engine and supervisor; compare those results with the existing baseline before considering application-code changes. Keep Real Futures and Spot untouched unless separately authorized.
