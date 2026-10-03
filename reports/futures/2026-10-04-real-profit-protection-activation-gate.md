# Real Profit Protection activation gate — 2026-10-04

## Metadata

- Date: 2026-10-04, Asia/Kuala_Lumpur.
- Evidence review: 2026-10-03 UTC; timestamp checkpoint 21:35:58 UTC.
- Module: standard Futures Profit Protection and local post-manual-profit-close admission.
- Mode: read-only activation precheck; no live test.
- Application repository: SignalVerse-Main.
- Inspected isolated branch: codex/futures-manual-close-reentry-20261004.
- Candidate HEAD/base: 2d9ce43094f5d20148950d6b156bc9280366ecd0.
- Authenticated remote main recheck: 2d9ce43094f5d20148950d6b156bc9280366ecd0.

## Objective and authorization

The owner requested deployment and activation of the existing PP switch, then explicitly clarified REAL rather than Demo and stated an intention to use small positions. Real scope is therefore clarified. Missing owner permission is NOT the blocker.

Small size does not establish position-lifecycle targeting correctness. Activation is blocked by the existing unproved execution boundary and by the local candidate's release gate.

## Actions taken

- Inspected the existing PP switch, API permission update, monitor/worker wiring and native close callback.
- Rechecked authenticated remote main without pushing.
- Confirmed the local re-entry candidate remains uncommitted with its previous changes preserved.
- Inspected the previous local validation report and safety findings.
- Did not access VPS, runtime credentials, Production DB or exchange APIs.

## Files inspected

Paths below are relative to the isolated candidate unless stated otherwise:

- src/app/FuturesProfitProtection.tsx.
- api/copytrade.ts.
- api/_shared/futures-profit-protection.ts.
- server/futures-profit-protection/worker.mjs.
- reports/futures/futures-manual-profit-reentry-fix-2026-10-04.md.
- Primary checkout: reports/futures/2026-10-04-experimental-profit-exit-switch-safety.md.
- Primary checkout: reports/futures/pp-final-safety-account-control-2026-10-03.md; relevant findings inspected, not a new complete broad audit.
- AI-Log: templates/report-template.md and scripts/scan-secrets.mjs.

## Findings

### Confirmed: the switch is a permission flag, not operational readiness

FuturesProfitProtectionControl polls profit-protection-status and sends profit-protection-control with an enabled boolean. The API handler at api/copytrade.ts:16532 updates the singleton mode-specific enabled field. It does not start or prove a healthy worker.

profitProtectionControl at api/copytrade.ts:16023 reports available when its database row can be read. This is not native execution-health evidence. A displayed ON cannot be treated as live protection.

### Confirmed: the current close path reaches native execution

The source chain is:

```text
worker import / FUTURES_PROFIT_PROTECTION_WORKER=1
  -> ensureProfitProtectionMonitor
  -> profitProtectionMonitorTick
  -> runProfitProtectionPosition
  -> driveProfitProtection
  -> close callback
  -> closeBinanceTrade / closeGateTrade / closeMexcTrade
```

At api/copytrade.ts:16346, Real Binance PP reaches closeBinanceTrade. Its native submission at api/copytrade.ts:8851 uses a MARKET reduce-only order with symbol and quantity. The tracked wrapper re-reads position state before submission. These local checks do not prove exchange-atomic fencing to one historical lifecycle against an external close/reopen between observation and order acceptance.

The A -> FLAT -> B risk therefore remains NOT_PROVEN safe. This report does not claim an actual stale close occurred.

### Confirmed: the re-entry fix is not a native close fence

The existing local admission candidate blocks continuation after a durably recorded full profitable manual close until fresh closed-candle reset evidence exists. It does not atomically prevent native account writers from creating a replacement position, and does not prove the PP executor can never close that replacement.

That candidate also has an introduced release-contract rejection: the historical frozen whole-file Phase 3B parity contract rejects the api/copytrade.ts delta. It has not received complete official exact-SHA CI acceptance.

### Confirmed: current PP is not the proposed Scanner-based reversal experiment

The inspected existing policy uses peak/giveback, minimum retained profit, quote age and confirmations. Enabling it would not implement a Scanner V3 adverse-momentum/volume/OI reversal strategy. Neither strategy was changed or activated here.

## Files changed / implementation

Only this sanitized work report was created and copied to AI-Log. No application source, UI, policy, test, migration, worker, flag or financial state was changed in this activation request. Previous local task changes remain preserved.

## Checks and tests

- Authenticated git ls-remote origin refs/heads/main: exact approved local base observed.
- git status --short: previous local candidate changes remain uncommitted; no reset, stash or cleanup.
- Source inspections: read-only.
- No new trading tests, builds or CI were run.
- Previous report records 212/212 offline tests and 49/49 disposable SQL tests, Web/Admin builds passing and zero introduced TypeScript diagnostics. These are historical local evidence, not renewed acceptance or live close proof.
- Previous PP parity suite: baseline 52/52, local candidate 51/52. The introduced scope failure is not relabeled a baseline failure.

## Git / publication

- Application commit: NONE.
- Application push/main write: NO.
- AI-Log publication is documentation-only to master, with remote bytes/SHA verification reported in the conversation.
- No release artifact, Guard, release dispatch or application deployment.

## Limitations and next step

Actual Production runtime, flags, worker PID and account state were not read in this request; no fresh claim is made about their current values. Source behavior is not Production operational proof.

Before any Real automatic close test, establish the exact single-executor/lifecycle execution safety boundary and obtain full acceptance of the source candidate through the existing release contract and exact-SHA official CI. Do not bypass those gates because the proposed trade size is small. Do not replace the request with a Demo or observation-only activation without the owner's choice.

## Final state

```text
REAL_TEST_REQUESTED=YES
OWNER_AUTHORIZATION_MISSING=NO
NATIVE_LIFECYCLE_CLOSE_SAFETY=NOT_PROVEN
LOCAL_CANDIDATE_RELEASE_GATE=BLOCKED
LIVE_PP_ACTIVATION=NOT_PERFORMED
APPLICATION_CODE_CHANGED_BY_THIS_REQUEST=NO
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI_DISPATCH=NO
DEPLOYMENT=NO
PRODUCTION_CHANGE_BY_THIS_REQUEST=NO
DATABASE_MUTATION=NO
PP_WORKER_STARTED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
EXCHANGE_CALLS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_CHANGES=0
TP_CHANGES=0
CLOSE_ACTIONS=0
FINAL_CLASSIFICATION=BLOCKED_UNPROVEN_REAL_CLOSE_SAFETY_AND_RELEASE_GATE
```
