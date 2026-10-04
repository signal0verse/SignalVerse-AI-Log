# Standard Futures Demo accounting display correction

## Metadata

- Date: 2026-10-04
- Task ID: DEMO-COPYTRADE-ACCOUNTING-DISPLAY
- Module: Futures / Standard Demo copy-trade
- Mode: isolated local implementation and offline validation
- Repository: SignalVerse-Main
- Branch: codex/futures-demo-accounting-20261004
- Starting / ending source HEAD: 14c68c785cfbf8fbca34f006d636e3891b2db2de
- Source commit: NONE; implementation remains uncommitted
- Production / exchange / database access in this task: NONE

## Objective

Fix the owner's report that Demo closed-trade accounting is unavailable. Screenshots show 0/98 confirmed-net coverage, blank calendar values and incomplete-accounting labels on closed trades.

## Scope

Change only Standard Futures Demo presentation of existing recorded results. Preserve real-account evidence requirements, virtual balance settlement, execution, positions, SL/TP, Strategy, Scanner, Spot, Fast Trader and PP behavior. No deployment or financial history repair was performed.

## Actions Taken

1. Read contributor instructions, handoff and complete trading strategy plus safe-test runbook.
2. Read authenticated remote main: 14c68c785cfbf8fbca34f006d636e3891b2db2de.
3. Created a clean isolated worktree from that exact base; primary dirty/private work preserved.
4. Traced Demo closure persistence, source normalization, strict-net display helpers and all Standard Futures presentation consumers.
5. Reproduced the defect using actual extracted CopyTradePanel computations and synthetic rows.
6. Applied a presentation-only modeled-result projection; added runtime/helper/actual-JSX regression tests.
7. Ran tests, builds, independent TypeScript baseline comparison and protected-path diff checks.
8. Prepared this sanitized report for the required report-only AI-Log publication. Source was not committed or pushed.

## Files Inspected

- AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md
- docs/COLLEAGUE_HANDOFF_2026-09-29.md
- TRADING_STRATEGY.md; docs/testing/stability-test-runbook.md
- src/app/App.tsx; src/app/FuturesEconomicsPanel.tsx
- api/copytrade.ts; api/analyze.ts
- api/_shared/futures-economics.ts; api/_shared/futures-economics-sources.ts
- scripts/futures-economics-contract-test.mjs
- scripts/futures-simulation-accounting-ui-test.mjs
- scripts/lib/actual-futures-core.mjs; scripts/lib/futures-pure-test-context.mjs
- scripts/futures-typecheck-delta.mjs
- docs/fixes/futures-simulation-accounting.md
- package.json, package-lock.json, tsconfig.json, vite.config.ts, vite.admin.config.ts

## Files Changed

- src/app/App.tsx: Standard Futures history/statistics/calendar/detail display wiring and explanatory labels.
- src/app/copyTradeAccounting.ts: new pure display projection; no persistence or network.
- scripts/futures-demo-accounting-ui-test.mjs: 33 new offline regression tests.
- api/analyze.ts: HELP_ASSISTANT_APP_DESCRIPTION prose only; no analysis/API handler logic change.
- HANDOFF.md: additive local handoff.
- reports/futures/demo-copytrade-accounting-display-2026-10-04.md: this report.

## Root Cause / Findings

CONFIRMED IN SOURCE AND REPRODUCTION:

- evaluateDemoTradeStep and the existing manual Demo close path record gross pnl_usdt and modeled fee_usdt.
- demoTradeEconomics explicitly represents funding as NOT_AVAILABLE because funding is not modeled.
- The shared economics contract correctly leaves final netPnl null in this situation.
- Standard Futures UI incorrectly used the Real final-net eligibility condition for every Demo display/aggregate. This excluded even complete Demo gross/fee pairs.
- Baseline regression: two closed Demo fixtures with known gross and fees produced coverage 0/2. Expected modeled results were +9 and -5, total +4, win rate 50%.
- After the correction, the same actual UI computation produces 2/2, total +4, win rate 50%.

UNCONFIRMED:

- This task did not query the owner's Production rows. It does not certify that each of the 98 screenshot trades has complete recorded gross and fee fields.
- No exact screenshot-wide monetary total is asserted.

## Implementation

Standard Demo display result = stored gross PnL minus stored modeled fees, only for a closed row with valid close timestamp and finite, available gross/fees. Zero is valid; null, missing, invalid or overflow values are not fabricated. Missing/invalid margin leaves percentage unavailable.

This result is explicitly labeled as a Demo model excluding unmodeled funding, NOT confirmed real net PnL. The same projection drives history, total PnL, win rate, calendar and closed details. Demo statistics/share text explains the basis.

The shared economics contract and detail breakdown remain unchanged: funding is unknown and final net remains unavailable. Demo virtual balance still uses its existing gross-settlement policy. No backfill, balance recalculation, funding assumption or fee-rate change.

Real results still require KNOWN net economics, including funding evidence. The shared detail modal opts into Demo display only from Standard Copy Trade; Fast Trader defaults remain unchanged. Open-position controls and every unrelated top-level App function match the approved base after normalizing checkout line endings.

## Tests Executed

Runtime: Node v22.23.3; TypeScript 5.7.3. Existing dependencies reused; package-lock SHA-256 matches the primary checkout.

1. Before implementation: node --test scripts/futures-demo-accounting-ui-test.mjs
   - Expected reproduction failure: actual 0/2 versus required 2/2.
2. After implementation:
   node --test --test-reporter=spec scripts/futures-demo-accounting-ui-test.mjs scripts/futures-economics-contract-test.mjs scripts/futures-simulation-accounting-ui-test.mjs
   - PASS: 230/230; zero failed/skipped.
   - 33 new tests; 197 existing economics/Simulation UI regressions.
   - Actual UI computation and React-rendered history/detail fragments; missing costs, numeric strings, zero, fee-induced loss, partial coverage, percentages, unchanged Real/legacy evidence gates, unchanged Fast Trader, calendar and source integrity.
   - Existing tests also validate Demo partial/manual fees, gross-balance settlement, Real cost provenance and Simulator economics.
   - An intermediate new source-integrity assertion detected Windows CRLF versus Git LF only. It was corrected to compare LF-normalized content; no semantic differences were ignored.
3. Independent existing TypeScript delta tool:
   FUTURES_TSC_BASELINE_ROOT=<clean exact-base checkout>
   FUTURES_TSC_BASELINE_SHA=14c68c785cfbf8fbca34f006d636e3891b2db2de
   node scripts/futures-typecheck-delta.mjs
   - Full: 71 baseline / 71 candidate / 0 introduced / 0 removed.
   - Affected API diagnostic set: 65 baseline / 65 candidate / 0 introduced / 0 removed.
   - Whole-project TypeScript is NOT clean; inherited diagnostics are unchanged.
4. Strict no-emit check of src/app/copyTradeAccounting.ts and its imports: PASS, zero diagnostics.
5. git diff --check: PASS.
6. Protected executable-path diff:
   api/copytrade.ts, api/_shared, server, migrations, ops, deploy, .github,
   src/app/FuturesProfitProtection.tsx: EMPTY.

No API bootstrap, credentials, live exchange calls, DB connection or orders were used by the tests. No indiscriminate test glob was run.

## Build Result

- Web: PASS, Vite 6.3.5; existing large-bundle warning retained.
- Admin: PASS, Vite 6.3.5.
- No remote CI, artifact preparation, Guard or release workflow was run.

## Source SHA-256 (local bytes)

- src/app/App.tsx: 1d178e1e89d9957d63a40dff30f561d8bda8560f254d66a2b79d17e032baf143
- src/app/copyTradeAccounting.ts: 4be949f902acfccb9e296728fffed439f1f6b5838833303ab3bd1c7e87ae5b6c
- scripts/futures-demo-accounting-ui-test.mjs: 032b2d899371c61b733993fd2cdb91395305410e804f88c66e98c2024aebf8dc
- api/analyze.ts: 46fd2f8f1feb86af02f4f6c1cb6212a15ad84e59340736656b2c126f116de8df

## Git Status / Commit

Implementation exists only in the isolated worktree:
C:/Projects/SignalVerse-Main/tmp/futures-demo-accounting-20261004

Source commit = NONE.
Source push = NO.
Main change = NO.
AI-Log publication is report-only; its verified commit/link is returned separately.

## Remaining Issues / Risks / Limitations

- Local fix only: not deployed and not verified in the authenticated Production UI.
- Missing historical gross/fees remain incomplete intentionally. No invented legacy cost reconstruction.
- Funding is still not modeled in Demo; this result is not all-cost Real economics or proof of profitability.
- Existing historical release-scope gates and exact-SHA CI were not run in this local task. Separate source-promotion/release review is required before deployment; no contract was weakened.
- The API still limits its existing history response; pagination and historical scope were not changed.

## Safety

ACCOUNTING_BACKEND_LOGIC_CHANGED=NO
HELP_KNOWLEDGE_TEXT_CHANGED=YES
DATABASE_MUTATION=NO
PRODUCTION_CHANGE=NO
WORKER_STARTED=NO
PP_FLAGS_CHANGED=NO
EXCHANGE_CALLS=0
ORDER_CHANGES=0
POSITION_CHANGES=0
SL_TP_CHANGES=0
CLOSE_ACTIONS=0
SOURCE_COMMIT=NONE
SOURCE_PUSH=NO
DEPLOYMENT=NO

## Recommended Next Step

Review the local Demo presentation fix, then obtain the separate normal source-promotion/CI/release gates if publication is desired. Do not reuse any previous PP UI Guard/approval. After an authorized release, verify the actual Demo account history read-only; do not fabricate missing legacy data.

FINAL_STATUS=LOCAL_FIX_VALIDATED_NOT_DEPLOYED
