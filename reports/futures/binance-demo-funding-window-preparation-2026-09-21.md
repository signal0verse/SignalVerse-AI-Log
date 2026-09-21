# Binance Demo Funding-window preparation — 2026-09-21

## Metadata

- Date: 2026-09-21, 13:29 UTC
- Module: ETHUSDT Binance Futures Demo / Real final-Funding validation
- Mode: public read-only schedule check plus isolated offline test
- Repository: signal0verse/SignalVerse-Main
- Branch: main
- Starting commit: 306f073106b73c239c507661f79ca220293f7098
- Ending commit: 306f073106b73c239c507661f79ca220293f7098

## Objective

Advance the owner's next step toward an actual Funding-crossing Binance Demo
test while preserving the step-by-step approval and no-code-change boundary.

## Scope / Actions Taken

- Reviewed the prior two-cycle Demo report: its two-entry authorization was
  consumed, and neither cycle crossed a Funding settlement.
- Queried only the public Demo Futures ETHUSDT premium-index endpoint. At the
  observation, the next Funding timestamp was 2026-09-21 16:00 UTC and the
  displayed rate was finite and nonzero. This is not a guarantee of the final
  settlement rate.
- Re-ran the isolated existing Real final-Funding test suite against current
  application source: 10/10 passed on local Node 24.19.0. Earlier release CI
  already validated Node 22; this run does not claim to replace that evidence.
- Wrote a scratch, non-executable single-settlement test plan under
  `tmp/binance-demo-funding-20260921/test-plan.md`. It requires new owner
  approval, current-account flatness, one ETHUSDT Demo entry at most, the
  previously stated size/risk/time limits, native protection, cleanup and
  exact signed Funding reconciliation after the settlement delay.
- Requested a new explicit owner approval. None is assumed by this report.
- Scheduled one same-thread, read-only check near 2026-09-21 15:45 UTC
  (23:45 Asia/Kuala_Lumpur). Its prompt forbids orders, credentials, leverage
  changes, application changes and Production operations; it is only a
  reminder/readiness follow-up, not an execution authorization.

## Files Inspected

- `CLAUDE.md`, current `HANDOFF.md`, `docs/AI_HANDOFF.md`,
  `TRADING_STRATEGY.md`, `docs/testing/stability-test-runbook.md`
- `docs/testing/binance-demo-execution-2026-09-20.md`
- `docs/testing/binance-final-funding-production-2026-09-21.md`
- `tmp/binance-demo-validation-20260920/limits.mjs`
- `tmp/binance-demo-validation-20260920/execute.mjs`
- `tmp/binance-demo-validation-20260920/reconcile.mjs`
- `scripts/binance-final-funding-test.mjs`
- `api/copytrade.ts` final-Funding reconciliation declaration

## Files Changed / Implementation

Application executable source, strategy, DB, configuration, Spot and in-app
Demo: NONE. Only an untracked local scratch test plan and this report were
written. No order-runner was launched or scheduled.

## Findings

- CONFIRMED: the displayed next Demo ETHUSDT Funding time remained 16:00 UTC.
- CONFIRMED: current offline Real final-Funding cases passed 10/10.
- CONFIRMED: the previous bounded two-entry authorization is consumed;
  another trade needs fresh approval.
- UNCONFIRMED: a nonzero signed Demo Funding event and exchange-linked final
  net PnL. No Demo order was placed in this step.

## Tests Executed / Build Result

- Public Demo premium-index GET: HTTP 200, schedule/rate parsed; PASS for
  public schedule observation only.
- `node --test scripts/binance-final-funding-test.mjs`: 10/10 PASS, zero
  network/database/exchange mutation by the reviewed suite.
- Build: NOT RUN, no application code changed.

## Git Status / Commit

Application HEAD unchanged at `306f073106b73c239c507661f79ca220293f7098`.
No application commit, push, Production deploy or private-account call. Existing
unrelated untracked work was preserved. Active Production SHA was not
rechecked in this step.

## Remaining Issues / Risks / Next Step

The nonzero Funding test can only be meaningful across a settlement and after
the exchange income record is available. A stop/target hit before settlement
or missing/zero income must be marked INCONCLUSIVE. A ten-minute position limit
does not make gap/slippage loss impossible. Scheduled Codex tasks run unattended;
none was created to place an order. The single scheduled follow-up is
read-only. After fresh approval, rerun all account and
market guards near the event, execute at most one supervised Demo cycle, close
and verify flat within the agreed window, then reconcile read-only after the
application's 15-minute delay. Ask before any application change.
