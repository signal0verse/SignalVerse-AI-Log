# Manual profitable close: live re-entry admission check

## Metadata

- Date: 2026-10-04, Asia/Kuala_Lumpur.
- Module: standard Real Futures re-entry admission.
- Mode: owner-requested, bounded read-only Production audit.
- Application runtime: fca794122a7f235e0a774dbbbb0c6241ce4e10a3.
- Collection: 08:10:16Z inventory; 08:11:09Z and 08:11:41Z admission snapshots (16:10–16:11 local).
- Private owner/trade/decision IDs, exact execution timestamps, prices, amounts and account identifiers are intentionally omitted from this report. No raw ledger export is published.

## Objective and scope

The owner manually closed a profitable Binance Futures position and requested verification that continuation of the same setup cannot immediately reopen that coin. Inspect existing records and evaluate the existing SELECT-only admission function; do not invoke analysis, sync, entry, execution, exchange endpoints or a scheduler.

## Findings

CONFIRMED from the application's durable Production records:

- One matching recent Real Binance manual closure was found; status CLOSED_MANUAL, remaining percentage zero, recorded PnL positive and outcome WIN. It is standard Futures, not Fast Trader or Whale.
- Original decision and no-new-decision admission evaluations both return allowed=false with FUTURES_SETUP_CONSUMED_AFTER_PROFIT_EXIT.
- A naturally occurring post-close deterministic LONG decision exists on a different timeframe from the closed position. Evaluating that exact persisted decision through the deployed admission function also returns the same explicit denial. A fresh decision ID/timeframe therefore does not bypass the consumed setup in this observation.
- For the same owner/mode/normalized coin across venues: open trade count 0; new trades after closure 0; entry attempts created/submitted after closure 0; PREPARED/SUBMITTED/UNKNOWN attempts 0; recent pending entries 0. No hold was removed or modified.
- Both re-entry triggers remain enabled. Runtime marker and app symlink identify exact fca7941. Canonical PP worker remains disabled/inactive with PID 0.
- Second independent snapshot confirmed the same denial and zero subsequent entry records.

## Method / files inspected

Read the deployed candidate's `migrations/futures_manual_profit_reentry.sql`, `api/_shared/futures-reentry-admission.ts` and analyze admission call sites. Local disposable operators under `tmp/ape-reentry-*.py` performed only system-file/service reads and bounded PostgreSQL queries.

Database transactions used REPEATABLE READ READ ONLY, statement timeout 8–10 seconds, lock timeout 2 seconds and ROLLBACK. Existing `copy_trades`, `engine_decisions`, `pending_signals`, `futures_execution_attempts` and trigger metadata were inspected. The actual `futures_reentry_admission_v1` function was evaluated with the selected existing trade/decision scope. No synthetic trade, INSERT/UPDATE/DELETE, trigger execution test or exchange authentication was performed.

## Evidence limits

This proves the recorded closure qualifies for the currently installed admission block and the observed post-close decision is denied by that function. No separate production log of an executed exchange rejection was claimed: zero submission records and a read-only admission evaluation are not an exchange order test. Native exchange flat status/fills were not independently queried. Recorded positive PnL is application evidence, not a new exchange reconciliation or profitability claim.

The rule is not a permanent coin ban. Entry can become eligible only after the required evidenced raw WAIT/closed-candle setup reset and a later qualifying fresh setup. This bounded check does not promise perpetual monitoring or prevent independent manual trading/excluded execution paths.

## Changes, publication and result

Only disposable local read-only operator files and this sanitized report were created. No application source/main/history, Production configuration, DB rows/schema, worker/flags, strategy, scanner or trading controls changed. Primary dirty/untracked work was preserved. No CI/build/deploy was run. Only this report is committed/published to AI-Log/master and its remote bytes are verified separately.

```text
RECORDED_MANUAL_PROFIT_CLOSE=CONFIRMED
LIVE_ADMISSION=DENIED_CONSUMED_SETUP
NATURAL_POST_CLOSE_DECISION=OBSERVED_AND_READ_ONLY_ADMISSION_DENIED
OBSERVED_REENTRY=0
DATABASE_MUTATION=NO
PRODUCTION_CHANGE=NO
WORKER_STARTED=NO
PP_FLAGS_CHANGED=NO
EXCHANGE_CALLS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_TP_ACTIONS=0
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
DEPLOYMENT=NO
FINAL_CLASSIFICATION=RECORDED_CLOSE_AND_CURRENT_REENTRY_BLOCK_VERIFIED
```

Normal autonomous services were not paused. Zero-action statements refer to this audit; unrelated account activity was not audited.
