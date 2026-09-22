# Real Futures correctness candidate — release gates still open

## Metadata

- Date: 2026-09-22 UTC
- Task ID: Final Real Futures remediation, engineering-correctness track
- Module: Real Binance Futures Engine / Re-Analyze / protection / execution journal
- Mode: Offline tests, isolated PostgreSQL, Production read-only aggregate
- Repository: `signal0verse/signalverse-main`
- Branch: `codex/futures-correctness-2026-09-22` (local only)
- Starting commit: `6d4b735f0f555bc499c30a73a70a148779ae8e2a`
- Ending candidate commit: `6bf9bcf67b01275aff69c918a3598b6885a008f6`, rebased onto `3d738da8d32ee61e552646c3d2db14715c1ca6ea`

## Objective

Test the nine known Real Futures correctness gaps, repair only demonstrated
engineering failures while freezing the entry strategy, and deploy only if
all integrated and live gates pass.

## Scope

Real Binance Futures only. No Spot implementation, Demo-parity rollout,
new strategy, new indicators, live order, account setting, historical
backfill, or modification of the independent 24-hour public Shadow observer.

## Actions Taken

1. Inspected project policy, strategy, latest handoffs, cleanly separated
   other contributors' work, active runtime SHA and actual PostgREST database.
   During this task, another Spot release advanced `main` and VPS active SHA
   to `3d738da8`; the candidate was rebased and retested against that SHA.
2. Added offline failure-injection checks before changing risky protection
   ordering. The DB-write fault initially returned the false success
   `SL_TP_UPDATED`; it now returns a deferred outcome while retaining old
   orders.
3. Tested atomic capacity and per-trade Re-Analyze claims on a distinct,
   disposable PostgreSQL database on the VPS. Two concurrent attempts
   produced exactly one winner. Fault-injected count-query failure and wrong
   claim-token release failed closed. The temporary database was removed.
4. Queried only aggregate Real Binance close counts on the database connected
   to Production. No account IDs, order IDs, balances or credentials were
   exported. Zero newly closed trades existed since the executable marker,
   so private fee/funding reconciliation cannot yet be claimed.
5. Ran focused regressions, builds, and source bundle checks. No Production
   migration, main push, or deployment was attempted.

## Files Inspected

`AGENTS.md`, `CLAUDE.md`, `HANDOFF.md`, `docs/AI_HANDOFF.md`, all of
`TRADING_STRATEGY.md`, `docs/testing/stability-test-runbook.md`, relevant
Futures audit/fix reports, `api/analyze.ts`, `api/copytrade.ts`, existing
Futures test scripts, migrations and UI labels. The active service and
PostgREST schema were inspected read-only.

## Files Changed

Candidate commit changes `api/analyze.ts`, `api/copytrade.ts`,
`src/app/App.tsx`, the focused Futures regression scripts, two additive SQL
migrations plus isolated SQL fixtures, `HANDOFF.md`, and
`docs/testing/real-futures-correctness-remediation-2026-09-22.md`.
It contains no Spot logic change or secrets.

## Root Cause / Findings

| Issue | Existing/deployed state | Candidate test/fix | Verification level |
|---|---|---|---|
| 1 Timeframes | CONFIRMED: Re-Analyze restored all five default frames, including unselected Weekly. | Pin opening decision's selected intervals through candle builder and Engine request; fail closed on missing provenance. | Offline PASS; no live write. |
| 2 Monetary risk | CONFIRMED: directional check allowed a loss-side wider SL. | Reject gross monetary stop-loss increase at fixed live quantity before Binance placement. | Offline PASS; live write unverified. |
| 3 Concurrency/churn | CONFIRMED: advisory timestamp was non-atomic; exact float compare differed from exchange tick; pending manual proposal could cause repeated AI. | Durable per-trade claim, token-bound release, no auto-expiry, pending-proposal coalescing, tick-aware compare. | Offline + isolated PostgreSQL PASS; migration not deployed. |
| 4 Binance protection | CONFIRMED: DB update errors were ignored after old-order cancel. | Verify new legs, acknowledge DB, then retire obsolete IDs; defer on DB/cancel fault; never cancel an adopted same ID. | Fault-injection PASS; exchange/DB live write unverified. |
| 5 Price basis | CONFIRMED: Spot candles/live gates coexist with Futures Contract-price SL, Mark-price TP/liquidation. | No blind source switch made; Futures public kline endpoint was reachable from VPS, but all Real analysis paths and software exits still need provenance/parity integration. | OPEN BLOCKER. |
| 6 Capacity | CONFIRMED: query error/null could read as zero; different-symbol claims could race. | Fail-closed count plus owner-wide atomic entry-journal reservation at unchanged five-slot limit. | Offline + isolated PostgreSQL PASS; migration not deployed. |
| 7 Supervisor data | CONFIRMED: opposing non-neutral trend counted as aligned. | Real-only same-direction aligned count; Supervisor remains categorical reviewer. | Pure Engine PASS; no live verdict. |
| 8 WAIT fallback | CONFIRMED: zero-score fallback looked like selected winner. | Real-only provenance records actual scores, null winner, explicit fallback and status without changing score/entry formula. | Pure Engine PASS; downstream integration pending. |
| 9 Accounting | Implemented/deployed fee and delayed terminal Funding logic existed. | Existing offline suite passed; active DB aggregate had zero newly closed Real Binance trades after executable marker. | LIVE PRIVATE ACCOUNTING **NOT VERIFIED**; no backfill. |

## Implementation

No Engine entry philosophy, thresholds, indicator stack, new strategy,
Spot, or Demo execution logic was changed. Candidate migrations were not
applied to Production. Re-Analyze still cannot open, reverse or resize a
position, and it does not consume a new trading cycle. A failed protection
replacement does not by itself close a SAFE position; independently
confirmed liquidation `AT_RISK` retains its fail-safe close path, including
when claim/audit persistence fails.

## Tests Executed

- `node --test` on the four focused correctness/reanalysis/Real-execution/
  final-funding suites after rebase: **260/260 PASS**.
- Existing Futures Pro timeframe source checks: **18/18 PASS**.
- Existing liquidation-feasibility source/pure checks: PASS.
- Isolated PostgreSQL capacity: four open fixture positions plus two
  simultaneous different-symbol claims → one accepted, one rejected;
  unreadable count → rejected; no overrun. PASS.
- Isolated PostgreSQL Re-Analyze: two concurrent claims → one token;
  wrong-token release false, rightful release true, next claim allowed. PASS.
- Production read-only aggregate on active DB: **0** newly closed Real
  Binance trades since 2026-09-21 23:31:25 UTC. This is a limit, not a pass
  for private fee/funding matching.
- `git diff --check`: PASS.

## Build Result

App Vite build, separate admin Vite build and esbuild bundles of both changed
API modules PASS after rebase. Repository-wide `npx tsc --noEmit` is RED on
existing unrelated missing optional UI/Next dependencies, `ImportMeta.env`
and Spot history types; it is not reported as a pass.

## Git Status

Candidate worktree clean at local commit `6bf9bcf`; `origin/main` and VPS
active release remain `3d738da8`. No main push, Production migration,
deployment, real trade or real position mutation. The independent Shadow
observation was not touched.

## Commit

Local candidate only: `6bf9bcf67b01275aff69c918a3598b6885a008f6`.
No approved executable Production commit exists for this request.

## Remaining Issues

Price-basis reconciliation, restored-schema migration drill, integrated
Real-only exchange/DB protection test, full typecheck gate, and authentic
new-close private fee/funding/exit-identity reconciliation remain open.
The non-expiring Re-Analyze claim intentionally needs manual reconciliation
after a crashed worker; never clear it just to make a scheduler green.

## Risks / Limitations

Offline and isolated-database passes are not evidence of private-account
execution or profitability. A newly placed but DB-unconfirmed protection leg
may need explicit exchange reconciliation. No new live trade should be
manufactured solely to close the accounting gate.

## Recommended Next Step

Keep Production unchanged. Validate the smallest Real-only price-source
correction across automatic/manual entry, Re-Analyze, native triggers and
software exits; run the integrated safety matrix against a restored schema
clone and Demo exchange where appropriate; wait for authentic new Real close
evidence for read-only accounting. Only then review exact diff, backup,
apply migrations, merge/deploy through the normal pipeline and verify active
SHA/health/runtime/schema before considering final approval.

**Final decision: existing Real Futures version is NOT ready for final approval.**
