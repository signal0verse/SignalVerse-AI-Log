# Binance Futures Demo: live-exposure watchdog fault test (2026-09-22)

## Metadata

- Date: 2026-09-22 UTC
- Module: Isolated, one-shot ETHUSDT Binance Futures Demo watchdog test
- Mode: Demo only; one bounded trade and independent read-only reconciliation
- Application repository: `signal0verse/signalverse-main`, docs-only `[skip ci]` commit `f1e2c5103290da017b593a4c91613bdbd34614b3`
- VPS Production deployed-SHA file before and after: `cbc64240002d7b491774aafbfa5d650cd9460956`; `signalverse.service` stayed active
- AI Log repository/branch: `signal0verse/SignalVerse-AI-Log`, `master`

## Objective and scope

The owner asked to proceed with Demo testing using the existing Demo-only credential. The objective was to test recovery of an actual protected Demo position when the isolated main process fails, not to validate SignalVerse entry strategy. No Real trade, Spot action, application code/DB/settings change, or Production deployment was performed.

## Preparation and tests

- An isolated one-run harness was created under the pre-existing VPS Demo package, with its own journal, main unit, independent credential-bearing watchdog, and two one-shot backup timers. It permitted at most one ETHUSDT LONG entry, filled notional at most 25 USDT, 1x leverage, native SL/TP, an intended stop loss under 1 USDT including a conservative fee allowance, and an eight-minute exposure deadline. The main process was designed to exit intentionally with code 42 only after native protection readback; the watchdog alone could submit one identified reduce-only close, never an entry.
- Five fully mocked end-to-end tests passed on VPS Node 22 without credentials or network: protected close, rejected stop protection, uncertain close ACK without repost, unfilled entry, and unrelated exposure fail-closed. Shell/Node/systemd syntax checks passed.
- A fresh authenticated GET-only preflight passed 14/14 requests, found positive collateral and no open positions, regular orders or algo orders, and made zero mutations. Both backup timers were armed before the main service started.

## Observed execution and exchange readback

| UTC time | Observation |
| --- | --- |
| 05:28:05 | Isolated main service started. |
| 05:28:15 | One Demo entry, actual notional `21.74816 USDT`; both native protection legs verified; main exited intentionally with status 42, triggering `OnFailure=`. |
| 05:28:21 | Independent watchdog reported `FLAT_CLEAN_AND_RESTORED`, exactly one reduce-only close POST, 16 requests. |
| 05:29:50 | First one-shot backup found flat/clean and submitted zero close POSTs. |
| 05:31:54–05:31:57 | Independent eight-request GET-only reconciliation passed, including both exact fills, no open exposure and restored leverage. |
| 05:36:43 | Second one-shot backup found flat/clean and submitted zero close POSTs. |
| After second backup | Final 14-request GET-only preflight found zero open positions, regular orders and algo orders, with zero mutations. |

The reconciled entry was BUY `0.008 ETH` at `2718.52 USDT`; the exit was SELL `0.008 ETH` at `2718.50 USDT`. Gross realized price PnL was `-0.00015999 USDT`; combined commissions were `0.01739846 USDT`; net before any funding was **`-0.01755845 USDT`**. This is a technical recovery test with a negative net result, not evidence of profitability.

## Timing caveat and final state

The second backup timer was first displayed for 05:32:46 UTC, then its displayed next firing moved to 05:36:39 UTC after a systemd daemon reload used to install the GET-only reconciliation unit. The association is observed; the exact internal reason was not independently proven. The account was already flat. Relative `OnActiveSec` timers should not be trusted as immutable absolute exposure deadlines across reloads; future unattended tests should use absolute deadlines or avoid reloads during exposure.

Both backup timers elapsed. Their temporary timer units were stopped, and all five units created for this test (main, watchdog, reconciler, two timers) were moved from the installed systemd directory to a recoverable archive under the isolated Demo directory. Absence from the installed-unit path was verified. Journal and private reconciliation artifacts remain isolated; no broad cleanup or Production service restart occurred. The original main unit's intentional failed status was not misreported as a recovery failure.

## Limitations and next gate

The test proves this bounded Demo `OnFailure` recovery path and exact flat readback for one case. It does **not** exercise native SL/TP triggers, the in-app Demo copy-trade route, Real Futures, Spot, engine/supervisor decisions, profit lock, or statistical reliability. A shared Demo-only credential remains an integrity concern despite the owner's acceptance of this test. Any main-application change remains a separate owner decision after further evidence.
