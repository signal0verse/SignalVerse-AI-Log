# Standalone Analysis zero-credit save and fallback correction

## Metadata

- Date: 2026-10-25, Asia/Kuala_Lumpur
- Task ID: analysis-credit-zero-20261025
- Module: Analysis Tab Credit settings, display and settlement
- Mode: bounded bug fix; offline validation; feature-branch publication
- Repository: signal0verse/signalverse-main
- Branch: codex/analysis-credit-zero-main-20261025
- Starting commit: 3f6a657316e694e834e4c9c76966edc4d96c744b
- Ending commit: 391894c20350c66240c70fc9038921ea2cc43914

## Objective

The owner reported a save error when entering zero in the Analysis Tab Credit
card, then explicitly requested correcting both additional places where zero
was being rejected. The owner separately approved sending the eight-file fix
commit to the feature branch after automatic approval review requested explicit
publication consent.

## Scope

Correct the standalone analysis price only, including admin save validation,
public dashboard pricing, runtime pricing and zero-cost settlement. Preserve
VIP/trial gates, positive-price billing, provider choice and other feature
prices. No main merge, deployment, production database/settings/service action,
private account request, trade or strategy change.

## Actions Taken

1. Checked the dirty primary checkout and read project instructions, handoffs,
   strategy history, safe test runbook and the reporting template. Preserved all
   unrelated tracked/untracked work.
2. Confirmed the save rejection and two downstream positive-only price readers.
   Prepared and tested a narrow candidate locally.
3. Compared against authenticated remote main. The primary checkout was behind,
   so created a managed worktree based on the current remote main commit.
   Retained the newer Telegram UI and partner integration while applying only
   the relevant edits. Re-ran the regression and builds on that current base.
4. Updated floating help, fix documentation, safe test runbook and HANDOFF.
5. Committed exactly eight task files. Restored only the task's own temporary
   edits from the older checkout after byte-checking against its saved patch;
   its original branch, existing HANDOFF delta and private/untracked work remain.
6. Published only the approved feature branch and read its remote ref back.

## Files Inspected

- AGENTS.md; CLAUDE.md; HANDOFF.md; docs/AI_HANDOFF.md
- TRADING_STRATEGY.md; docs/COLLEAGUE_HANDOFF_2026-09-29.md
- docs/testing/stability-test-runbook.md
- api/admin.ts; api/analyze.ts; api/public-info.ts; src/app/App.tsx
- Existing credit regression scripts and production CI build commands
- AI Log report template, README and secret-scanning helper

## Files Changed

- api/admin.ts
- api/analyze.ts
- api/public-info.ts
- src/app/App.tsx
- scripts/standalone-zero-credit-test.mjs
- docs/fixes/standalone-analysis-zero-credit.md
- docs/testing/stability-test-runbook.md
- HANDOFF.md

## Root Cause / Findings

CONFIRMED by actual source and offline handler execution:

- The client submitted numeric zero, while admin save validation required a
  strictly positive standalone analysis price. The API returned HTTP 400 and
  the UI displayed its generic save failure.
- Independently, the public price reader and runtime price reader both treated
  zero as invalid and fell back to the existing USD 0.05 standalone default.
- Correcting only the save validation would therefore leave display/billing
  inconsistent with the saved zero setting.

The original screenshot's exact live network response was not captured. Live
runtime SHA and authenticated live browser acceptance were NOT_VERIFIED in this
task; the causal findings above refer to the inspected code and offline tests.

## Implementation

- Standalone admin pricing accepts finite zero or positive numbers. Negative,
  blank, null, boolean, array/object and nonnumeric input remains invalid.
- Public and runtime readers preserve an explicit zero; absent/invalid values
  still use the standalone default, independent of legacy shared prices.
- The client input accepts zero, validates before save and explains zero-cost
  semantics in Persian and English. It retains the newer input language marker.
- Successful zero-cost VIP analysis returns the unchanged balance without a
  balance rewrite or zero-value credit transaction. Existing positive-cost
  successful-click charging and ledger behavior remain intact.
- Non-VIP access still permits only one lifetime BTC trial; other coins and
  subsequent use still require VIP. Provider selection and other feature
  prices/minimum top-up rules are unchanged. Zero customer credit cost does not
  itself change the provider selected by the existing analysis flow.
- No migration or trading-strategy history amendment was needed.

## Tests Executed

Command: `node --test scripts/standalone-zero-credit-test.mjs`

Result: PASS, 7 tests, 0 failures, 0 skipped on the current-main-based candidate.
The same seven tests also passed on the initial older-checkout candidate.

Coverage:

1. Zero survives admin save/reload, public pricing and runtime pricing.
2. Zero-string/positive inputs save; invalid inputs produce no settings write.
3. Missing/invalid standalone values keep the correct default; other feature
   price lanes keep their existing zero restrictions and legacy fallback.
4. Zero-cost VIP analysis passes with no credit and writes no balance/ledger.
5. Zero price preserves the non-VIP coin restriction and lifetime BTC trial.
6. Positive price retains insufficient-credit blocking and exact deduction.
7. Actual client save sends numeric zero only to its own setting; input minimum
   allows zero and invalid client inputs do not issue requests.

Tests extract actual declarations and handler blocks using the TypeScript AST,
with in-memory DB/HTTP fixtures. They do not import API bootstrap, read env files,
contact providers/exchanges, or access a real database.

`git diff --check`: PASS. Final staged inventory: exactly the eight files above.

The older standalone analysis/admin delegation tests were inspected and NOT_RUN:
they explicitly load a production env file and perform real database writes.
No wildcard test suite, full historical CI or live/private acceptance was run.

## Build Result

- `npm run build`: PASS for Web and Admin on the current-main-based candidate.
- Bundled the three changed API handlers with esbuild, Node 22 target,
  external packages: PASS.
- Host runtime: Node 24.19.0. Execution under Node 22 was not independently run.
- Existing large frontend bundle warning remains; this task does not claim a
  bundle-size improvement or a complete CI/release gate result.

## Git Status

- Feature branch published and remote ref verified:
  391894c20350c66240c70fc9038921ea2cc43914.
- Remote main remains 3f6a657316e694e834e4c9c76966edc4d96c744b at verification.
- Managed worktree retains the candidate for follow-up; generated validation
  artifacts are excluded from the commit.
- Primary checkout returned to its original branch; original HANDOFF changes
  and private/untracked work are preserved.
- No main merge, pull request, production release or runtime activation.

## Commit

[391894c2 — fix(analysis): allow zero credit cost across save and pricing](https://github.com/signal0verse/signalverse-main/commit/391894c20350c66240c70fc9038921ea2cc43914)

## Remaining Issues

- The live application will continue its existing behavior until this candidate
  is reviewed, integrated and released through the separate approved process.
- Authenticated live save/reload/analysis acceptance and runtime SHA remain
  NOT_VERIFIED; offline fixtures are not evidence of private execution.

## Risks / Limitations

- Automatic approval review rejected the source push twice because it required
  explicit consent for the exact private source/document payload and destination.
  The owner then explicitly approved that feature-branch publication. No bypass
  was used. Repository ownership/account permissions were read back.
- The first authorized Git push could not obtain interactive Git credentials.
  The successful retry used the already authenticated GitHub CLI as a temporary
  credential helper for that command; global Git settings were not changed.
- Source/test/document changes were reviewed for secrets/private account data.
  The source-test scanner reported only the deliberate synthetic fixture string;
  no real credential was present. This report contains no source code, private
  account records, financial account amounts, secrets or backup artifacts.
- AI Log destination visibility was checked and is public. Only this sanitized
  work report is published there, as required by the owner's reporting policy.

## Recommended Next Step

Review the published feature-branch commit. Any production release, integration
or live settings change remains separate from this completed source correction.
