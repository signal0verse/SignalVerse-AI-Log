# Analysis zero-credit support and configurable VIP coin access

## Metadata

- Date: 2026-10-25
- Task ID: analysis-credit-zero / analysis-access-integrated
- Module: Telegram standalone Analysis credit and coin access
- Mode: Owner-authorized implementation and production release
- Repository: signal0verse/signalverse-main
- Branch: codex/analysis-access-integrated-20261025
- Starting commit: d220314a2968083adb7b1277cf5dbc23915591a7
- Ending commit: 62709669e73bfbcc98bbb8d31678fd180c9d9693
- Release state: COMPLETE; official activation and independent runtime/source/public-asset checks passed at 2026-10-25T09:39:33.684974+00:00.
- Active main/admin/owned runtime: 62709669e73bfbcc98bbb8d31678fd180c9d9693
- Independent Paper runtime: 2da63dc5441928c5c325067869445e8732bde48c (retained separately).

## Objective

Fix the Analysis credit setting so zero can be saved, displayed and used without a fallback fee. Add an administrator switch to the same card: enabled preserves VIP coin restrictions; disabled opens all Analysis coins to signed-in users at the configured Analysis credit cost. Apply the reviewed work to the official bot while preserving the independent UI release.

## Scope

Only standalone Analysis cost validation, public pricing, settlement, session/access gates, the existing administrator card, customer help, focused tests and the preservation manifest were changed. The owner assigned general UI/UX to another chat. Its latest reviewed interface remains the base. No order submission, live scan, account migration, provider selection, trading strategy, other VIP section or timeframe policy was authorized or changed.

## Actions Taken

1. Reproduced the zero-value paths from source and corrected save validation, zero-preserving public/runtime reads and free settlement.
2. Added a strict boolean setting with the existing restrictive behavior as its default. Updates retain the previous displayed state on failure.
3. Applied the coin gate consistently to the existing pickers and the current Analysis workspace. Added a session guard before native provider/market work while preserving authenticated partner-host context.
4. Added focused offline behavioral tests and a closed, reversible successor manifest. Preserved previous release assertions and limited the source delta to fourteen paths.
5. Validated local builds and source preservation. Pushed the reviewed feature branch.
6. Waited for the independently authorized UI release to finish, revalidated its active source and controls, then fast-forwarded main atomically with a rollback reference. No force push.
7. Passed the exact main-push CI, prepared the official immutable artifact and independently verified every blob, directory, executable mode, metadata field and ZIP/inner archive digest. No archived code was executed or repackaged during verification.
8. Completed a fresh source-consistent server-only backup/cold restore, fresh bot/control/capacity checks and the installed Guard's one-use approval for the exact source/archive digest. Used the official release workflow.
9. Verified active process directories, consumed authorization, rollback predecessors, all six services, public HTML/assets, shared manifests, actual Analysis settings and all 2496 deployed source blobs/modes. The independent Paper runtime and all 22 installed controls remained unchanged.

## Files Inspected

CLAUDE.md, AGENTS.md, HANDOFF.md, docs/AI_HANDOFF.md, TRADING_STRATEGY.md and dated amendments, docs/COLLEAGUE_HANDOFF_2026-09-29.md, docs/testing/stability-test-runbook.md, current Analysis/admin/public-info call sites, relevant UI preservation tests, production CI/artifact/release workflows and installed release-control requirements.

## Files Changed

- HANDOFF.md
- api/admin.ts
- api/analyze.ts
- api/public-info.ts
- src/app/App.tsx
- docs/fixes/standalone-analysis-zero-credit.md
- docs/testing/stability-test-runbook.md
- scripts/standalone-zero-credit-test.mjs
- scripts/standalone-analysis-access-scope-test.mjs
- scripts/lib/standalone-analysis-access-parity.mjs
- scripts/lib/standalone-analysis-access-delta.json
- scripts/lib/analysis-workspace-release-parity.mjs
- scripts/analysis-workspace-ui-test.mjs
- scripts/spot-setup-views-test.mjs

## Root Cause / Findings

CONFIRMED: positive-only validation rejected zero, truthy fallback expressions replaced stored zero, and standalone defaults could inherit an unrelated legacy price. Coin access was hard-coded around the prior VIP/trial policy. The current Analysis workspace also had a separate asset gate requiring consistent handling.

CONFIRMED: source verification found 114 unrelated backend functions and 197 unrelated App functions byte-identical to the reviewed base. No separate design-component or stylesheet file was modified. Strategy, copytrade backend, workflows and installed control-plane source remain unchanged.

## Implementation

Finite nonnegative standalone prices are accepted; blank, null, boolean, array, invalid and negative values are rejected. Missing/invalid standalone prices default independently. A successful zero-cost request reports the existing balance without a balance write or zero-value ledger entry.

The VIP restriction defaults to enabled. Enabled preserves the existing one-ever Bitcoin trial for non-VIP users and VIP access to other coins. Disabled permits signed-in non-VIP users to use all standalone Analysis coins, subject to the configured credit check/settlement. Trial history is retained across toggles. VIP/admin access, partner-host identity and unrelated VIP/timeframe behavior are preserved. Customer credit price does not disable provider costs.

## Tests Executed

- Combined offline command:

```sh
node --test scripts/standalone-zero-credit-test.mjs scripts/standalone-analysis-access-scope-test.mjs scripts/analysis-workspace-ui-test.mjs scripts/analysis-workspace-release-scope-test.mjs scripts/telegram-workspace-ui-test.mjs scripts/telegram-workspace-release-scope-test.mjs
```

- Result: PASS, 52/52 tests, including 22 focused cost/access/scope cases.
- Final three changed API bundles: PASS with esbuild.
- Direct unprojected source-preservation audit: PASS, 114 backend and 197 App functions unchanged outside the explicit change list.
- Whitespace validation: PASS.

```sh
git diff --check
```

- Legacy scripts known to load production credentials or write production data were inspected and not executed.
- Fresh source-consistent cold backup and restore: PASS for all 139 relations, exact catalog/owner/ACL/index/function checks with six CHECK parser roundtrip proofs, and both SQLite integrity/compressed roundtrips. A helper-name error in the private checker interrupted its first pass; the corrected verifier completed on the same restored snapshot, preserving the failure evidence and creating no duplicate dump. Temporary restore cluster removed; 22 installed controls unchanged.
- Exact-main production CI: PASS, all 79 steps, [run 40176114486](https://github.com/signal0verse/signalverse-main/actions/runs/40176114486). The stage importing the new cost/access cases passed in that same CI.
- Official web/admin build and all API bundles: PASS in CI. The workflow bundles handlers with:

```sh
npx esbuild api/*.ts --bundle --platform=node --format=esm --target=node22 --packages=external --sourcemap --outdir=.runtime/api --out-extension:.js=.mjs
```

- Immutable artifact verification: PASS, 2496 Git blobs, 62 directories, full content/mode/metadata/digest checks; retained artifact ID 12594277306 from [preparation run 40181066641](https://github.com/signal0verse/signalverse-main/actions/runs/40181066641).
- Inner archive SHA-256: d5a4ebd48a1c0d7799186966d9e19285ee2c7506fa762eb2ac5c31e99a4dfedc.
- Official activation: PASS, [release run 40181267621](https://github.com/signal0verse/signalverse-main/actions/runs/40181267621).
- Independent runtime/public-assets verification: PASS; authorization consumed, rollback pointers retained, six services active, three shared manifests correct and public bytes identical to the active build.
- Independent deployed-source verification: PASS, all 2496 blobs and executable modes, 24955133 source bytes. No account or order mutation was performed by these checks.

## Build Result

Web/Admin production build: PASS. The final trusted-host follow-up changed only backend/test/manifest code; App bytes remained identical to the successful build. Official CI and production installation/build also passed. The public JavaScript and CSS bytes match the active release.

## Git Status

Reviewed feature branch and main published. Final source worktree clean. GitHub main and active main/admin/owned runtime independently verified at the ending commit. Unrelated/private work in other checkouts retained. The rollback branch and runtime predecessors retain d220314a2968083adb7b1277cf5dbc23915591a7. Independent Paper remains 2da63dc5441928c5c325067869445e8732bde48c.

## Commit

62709669e73bfbcc98bbb8d31678fd180c9d9693

## Remaining Issues

NONE for the requested implementation and release. Actual public settings observed after activation: Analysis credit cost 0.01; VIP restriction enabled. This work installed valid zero pricing and the new control without writing either live value. The owner can select zero or toggle access in the existing administrator card.

## Risks / Limitations

Offline tests and service/HTTP checks do not establish private-account execution or profitability. No live order or account test was performed. The new switch is installed with the restrictive default and no administrator value or credit price is silently changed. The owner must choose future live settings through the existing administrator controls. Historical backup evidence retains its original source/target identity and is not relabeled.

## Recommended Next Step

Reopen the Telegram mini-app to load the active assets. The owner may now save a zero Analysis price or turn off the coin restriction as desired. Keep private backup/operational evidence on its authorized hosts. No implementation or release work remains for this request.
