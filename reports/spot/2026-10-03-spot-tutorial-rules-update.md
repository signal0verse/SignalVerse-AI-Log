# Spot customer tutorial — current-rule audit and update

## Metadata

- Date: 2026-10-03
- Task ID: spot-tutorial-update-20261003
- Module: Spot customer tutorial and floating help
- Mode: isolated source update; no production operation
- Repository: signal0verse/signalverse-main
- Branch: codex/spot-tutorial-update-20261003
- Starting commit: e1fdc45f29b350670e707de3a7afa10b9153d689
- Ending commit: f4dc6e76f9df2fe64e9cf5079dc6e8d5963bdcc8

## Objective

The owner asked to inspect the complete in-app SignalVerse Spot tutorial and
update it if current rules were missing. Scope was education, not a strategy
rewrite, financial policy change or activation of a trading feature.

## Scope

Existing bilingual tutorial popup, its practical customer explanations, and the
Spot portion of floating-help knowledge. All work performed in a separate Git
worktree so the main local checkout's unrelated work remained untouched.

## Actions Taken

1. Read project instructions, handoff, strategy history and safe-test runbook.
2. Compared guide claims with current Spot execution/accounting/credit/UI paths
   and relevant September safety reports.
3. Corrected mode-specific exits, fill confirmation and stored-analysis wording.
4. Added seven collapsed practical sections and five explicitly labeled colors.
5. Updated floating-help Spot content to match, without internal engine thresholds.
6. Ran isolated rendering, builds and scope checks; committed the source candidate.

## Files Inspected

- AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md
- TRADING_STRATEGY.md and docs/COLLEAGUE_HANDOFF_2026-09-29.md
- docs/testing/stability-test-runbook.md
- docs/testing/spot-implementation-report-2026-09-21.md
- docs/testing/spot-p0-1-p0-2-f1-deploy-2026-09-22.md
- src/app/App.tsx, src/app/SpotWaitDetailsModal.tsx, src/app/spotDecisionDetails.ts
- api/copytrade.ts and api/analyze.ts
- package.json, package-lock.json and Vite build configuration

## Files Changed

- src/app/App.tsx
- src/app/SpotTutorialUpdates.tsx
- api/analyze.ts (Spot help paragraphs only)
- scripts/spot-tutorial-ui-test.mjs
- docs/testing/stability-test-runbook.md
- docs/testing/spot-tutorial-rules-update-2026-10-03.md
- HANDOFF.md

## Root Cause / Findings

CONFIRMED: The old tutorial generalized combined exits to all Spot paths. Current
demo/non-Binance market-sell handling differs from Binance real per-cycle LIMIT
take-profit. Touching a chart level alone does not prove an exchange fill.

CONFIRMED: Education was missing capital reserves versus actual orders/holdings,
withdrawal bookkeeping, realization duration, fee/dust/edit constraints and status
interpretation. Old floating help overstated uniform charge timing and freshness.

CONFIRMED: Real credit reservation is separate from final debit and from trading
capital. Binance first-fill charging differs from other real scenario-open paths.
Demo execution is free but access gates still apply.

UNCONFIRMED: Live runtime SHA and appearance of this candidate in production. No
private exchange execution, live fill or profitability was tested or claimed.

## Implementation

Preserved the existing entry button and popup. Added native collapsed details for
WAIT decisions/timestamps; capital accounting; withdrawals/compound/growth/time;
cycle count and credit; real orders/fees/dust/editing; invalidation/simulation; and
colored status interpretation. Clarified that withdrawal is not a money transfer,
invalidation is not an automatic stop-loss, and projected simulation proceeds are
not realized cash. No trading function, credit policy, withdrawal calculation,
growth formula, account record or scheduler was changed.

## Tests Executed

Node 22.23.3; shared installed dependencies used only after confirming the base
and task lockfiles have identical SHA-256. No production env or API bootstrap.

- node --test scripts/spot-tutorial-ui-test.mjs: PASS, 6/6. Actual tutorial AST
  rendered with React in both languages, closed/open states; checks direction,
  dialog and close labels, seven collapsed sections, five colors and key warnings.
- Local AST scope comparison against starting SHA: PASS. App/API declarations
  outside tutorial/help unchanged; non-Spot floating-help paragraphs unchanged.
  Initial comparison failed on CRLF versus LF only; normalizing the checker
  resolved it without application edits.
- esbuild transform of api/analyze.ts: PASS, no import/execution of API code.
- git diff --check: PASS.

## Build Result

- Frontend production build: PASS; pre-existing large-chunk warning remains.
- Admin production build: PASS.
- No VPS artifact was released.

## Git Status

Source branch pushed successfully. Remote `refs/heads/codex/spot-tutorial-update-20261003`
verified via `git ls-remote` at f4dc6e76f9df2fe64e9cf5079dc6e8d5963bdcc8.
The first push failed at the credential dialog; retry used the already-authenticated
GitHub CLI helper for that command only, without changing global credentials.
Tracked task files committed; local scope checker is untracked and not published.
Primary checkout preserved; main and the live runtime were not changed.

## Commit

f4dc6e76f9df2fe64e9cf5079dc6e8d5963bdcc8 — docs(spot): align customer tutorial with current execution and accounting

## Remaining Issues

The candidate has not been deployed or merged to main. Production still requires
an independently approved exact-SHA release and matching-runtime verification.

## Risks / Limitations

SSR checks are not a browser interaction/visual test. No live data, private account,
database mutation, exchange call or AI-provider call occurred in validation.
This report contains no credentials, user identifiers, balances or private records.
No financial/strategy behavior was changed; tutorial accuracy is tied to reviewed
source behavior and must be rechecked when the implementation changes.

## Recommended Next Step

Review the tutorial candidate and include it in the next owner-approved VPS release;
verify the chosen runtime still implements these documented Spot distinctions.
