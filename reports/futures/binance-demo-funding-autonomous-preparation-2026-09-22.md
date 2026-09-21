# Binance Futures Demo Funding — bounded autonomous-test preparation

## Metadata

- Date: 2026-09-22 (Asia/Kuala_Lumpur; preparation at 2026-09-21 16:25–16:30 UTC)
- Module: external Binance USDⓈ-M Futures Demo, ETHUSDT; isolated funding reconciliation
- Mode: preparation, public read-only check, offline mocks; **no Demo order or signed account call in this request**
- Application repository: `signal0verse/SignalVerse-Main`, `main` at `306f073106b73c239c507661f79ca220293f7098`
- Active executable Production SHA previously reported: `d38ce3f1c39933b747ebf94874e1d6d75dc00924` (not redeployed or reverified here)
- AI Log repository: `signal0verse/SignalVerse-AI-Log`, `master` from `dc1af0d26b0278d2aa96197c5b50f46a50bb6155`

## Objective and authorization

The owner directed that Demo-account checks and tests proceed without repeated requests for approval. An earlier separate approval bounded one ETHUSDT Futures Demo technical Funding-crossing test to one entry, maximum 25 USDT notional at 1x, native stop/target, intended loss below 1 USDT, and confirmed closure within ten minutes. No Real, Spot, application-code, or Production change was authorized by this step. Future Demo tests are not treated as unlimited trading authorization.

## Actions taken

1. Preserved the dirty application worktree; an unrelated ongoing Spot edit in `api/copytrade.ts` was not staged, committed, or modified by this work.
2. Reviewed the isolated scratch Demo harness and its explicit one-shot journal, allowlisted Demo origin/endpoints, single-entry guard, flat-account gate, bounded risk, protection and cleanup flow. Updated its entry price formatting to follow the exchange tick precision rather than always sending eight decimals. Updated the scratch test plan to reflect the owner's approval without weakening its stop conditions.
3. Added an isolated mocked read-only reconciliation test: exact entry/exit fill bounds, signed Funding income, large income ID preservation, replay of the current Real final-Funding calculation with an in-memory ledger, and no exchange mutation. Missing income must remain inconclusive.
4. Public Demo `premiumIndex` read at 2026-09-21 16:27:35 UTC: ETHUSDT next Funding `2026-09-22T00:00:00Z`, displayed rate `0.00002500`. This is an observation, not a promise of the later rate or settlement.
5. Updated the existing one-shot same-thread reminder for approximately 2026-09-22 07:57 Asia/Kuala_Lumpur. It states that no new approval should be requested; a future active turn may attempt only the already bounded Demo cycle after fresh offline tests and authenticated preflight, and must stop without an order if network/credentials/supervision/account state/time or risk gates are unavailable. It forbids Real, Spot, application and Production changes, second trades, and uncertain-ACK resubmission. The scheduled run has not occurred.

## Checks and results

- `node tmp/binance-demo-funding-20260921/window-rules.test.mjs`: 3/3 pass.
- `node tmp/binance-demo-funding-20260921/funding-window.test.mjs`: 5/5 pass after tick-precision correction. Includes lost entry/close acknowledgments, protection rejection and early native exit.
- `node tmp/binance-demo-funding-20260921/reconcile-funding.test.mjs`: 2/2 pass. No Funding event does not produce a pass artifact.
- `node scripts/binance-final-funding-test.mjs`: 10/10 pass against the existing application code.
- Public Demo read: next time/rate above. Initial sandboxed socket was denied; the read-only request succeeded with approved elevated network access.
- No new signed Demo account preflight, live order, actual Funding-income event, or profitability result in this turn.

## Findings and limitations

- **Confirmed:** the scratch entry price had an avoidable exchange-precision rejection risk; corrected and mock-tested in scratch only. This is not an application fix.
- **Confirmed:** offline mocks exercise control flow, not real exchange fills, SL/TP trigger behavior, actual income settlement, or a Production account.
- **Unconfirmed:** whether the scheduled background turn can access the necessary network and transient Demo credentials and remain active through closure. If not, it is required to place no order and report the blocker. A scheduled task or accepted API response is not proof of a clean close; independent post-event signed reconciliation remains necessary.
- The existing dirty application worktree belongs to other work. No application files were committed or pushed, and in-app Demo parity remains deferred.
- The external Demo key previously shared in conversation should be rotated by the owner after testing; it is not included in this report or source files.

## Recommended next step

At the near-settlement turn, recheck all safety gates and run at most the one approved external Demo cycle only if the whole ten-minute supervision and cleanup path is available. After at least fifteen minutes, reconcile exact private Funding income against fills and the current Real function. Classify zero/missing Funding or any uncertain account state as inconclusive/needs attention, never as a passed test. Present evidence and ask the owner before changing main application code.
