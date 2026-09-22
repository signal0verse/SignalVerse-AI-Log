# Binance Futures Demo watchdog recovery — 2026-09-22

## Metadata

- Date: 2026-09-22 UTC
- Module: Isolated VPS ETHUSDT Futures Demo one-shot harness
- Mode: Demo-only systemd safety fix and no-trade verification
- Application repository: `signal0verse/SignalVerse-Main`, docs-only commit `b5691e2b77aa597f7a327734cab83a399977103c` (`[skip ci]`)
- Production deployed-SHA file before and after this task: `cbc64240002d7b491774aafbfa5d650cd9460956`; main application service stayed active
- AI Log repository/branch: `signal0verse/SignalVerse-AI-Log`, `master`

## Objective and scope

Continue the safe next step after the one-trade Demo funding test: diagnose and repair the immediate backup watchdog, then test it without placing another order. The SignalVerse application, Real Futures, Spot, database, and Production runtime were outside scope and unchanged. This work did not schedule another trade.

## Evidence and root cause

- **CONFIRMED:** The original Demo trade process exited zero, but systemd marked its unit failed because `ExecStopPost` exited `65/DATAERR`. The launch wrapper returns 65 if its `demo.env` path is unreadable.
- **CONFIRMED by no-network VPS probe:** The same encrypted credential was readable during the parent unit's start phase and unreadable during its `ExecStopPost` phase. The probe checked file readability only; it did not source or print the credential, contact the exchange, or place an order.
- **UNCONFIRMED:** The deeper systemd-internal cause of that phase-specific unreadability. The practical defect was reliance on the parent unit's credential in the post-stop hook.

## Change applied

The isolated, already-used `sv-demo-funding.service` on the VPS was backed up. Its credential-dependent `ExecStopPost` command was removed. The unit now uses native `OnSuccess=` and `OnFailure=` to trigger the existing independent `sv-demo-funding-watchdog.service`, which loads its own encrypted credential. The watchdog code, order/risk limits, one-shot timers, and application release were not changed. The old unit failure state was deliberately not reset or presented as a new run.

The local scratch unit template was updated to match. A scratch test-only fixture was also repaired: its imported guard had read the host's current clock while the scenario used a 2026-09-21 fake clock. The test now evaluates the same guard source inside the fake-clock VM. This does not change the live guard or trading code.

## Tests and results

| Check | Outcome |
| --- | --- |
| Reproduce original credential failure without network | PASS: readable at start, unreadable at post-stop, exit 65 |
| Native success-path delegation to a separate credential-bearing no-network child | PASS |
| Native failure-path delegation to the same child | PASS |
| Installed unit `systemd-analyze verify` and loaded properties | PASS: both dependencies loaded; no `ExecStopPost` |
| Fresh authenticated Demo GET-only preflight | PASS: 14 requests, zero mutations, zero open positions/regular orders/algo orders |
| Four mocked scratch harness test files on VPS Node 22 | First run 10/14 due expired fake-clock fixture; after test-only repair **14/14 PASS** |
| Actual trade under the new systemd wiring | **NOT RUN** — no new order or future timer |

The two temporary no-trade parent probes used no network. Their credential-bearing child probe was removed from `/etc/systemd/system` after testing and preserved in the isolated test archive. The original three timers had elapsed and showed no next activation. The Production service was active and its deployed-SHA file unchanged before and after this task. The main application worktree had concurrent unrelated changes; only the two documentation files belonging to this task were staged in the docs-only application commit.

## Remaining limits and next gate

This verifies the new systemd delegation mechanism, **not** a new live-position failure recovery, timeout, native SL/TP trigger, strategy/supervisor performance, or profitability. The original unit remains in its historical failed state. Before any new unattended Demo order, rotate the Demo API key that was exposed in the conversation, and run bounded timeout/live-exposure recovery scenarios with an independent final-flat check. Any main-code change remains a separate owner decision after evidence review.
