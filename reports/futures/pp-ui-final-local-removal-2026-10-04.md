# Futures PP decorative UI removal on current main — 2026-10-04

## Metadata

- Date: 2026-10-04 UTC.
- Task: Remove the two non-operational Profit Protection sections shown in the owner's screenshot.
- Module: Futures frontend only.
- Mode: Local implementation and offline validation; no release.
- Authenticated remote main observed before reconstruction: fca794122a7f235e0a774dbbbb0c6241ce4e10a3.
- Isolated branch: codex/pp-ui-final-removal-20261004.
- Isolated worktree: C:/Projects/SignalVerse-Main/tmp/pp-ui-final-removal-20261004.
- Starting/ending worktree HEAD: fca794122a7f235e0a774dbbbb0c6241ce4e10a3.
- Cleanup source is UNCOMMITTED. HEAD is the base, not a new cleanup release SHA.
- Primary checkout HEAD remains 0dbca62357a4adf34240f40ceda3e387356ec4b0.
- Fresh validation completed by 2026-10-04T09:32:06Z; built-bundle check performed afterward.

## Objective and scope

The owner asked to remove the decorative PP control and per-position PP status, with no replacement. The prior cleanup remained local on an older base. Its existing source/test delta was inspected and reused on a fresh isolated checkout of the authenticated current main. Existing old worktrees and unrelated dirty work were preserved.

This does not assert that every possible profit-protection strategy is impossible. It removes misleading UI for the currently non-operational standard Futures PP feature. The independent Fast Trader feature is outside scope.

## Actions taken / actual source trace

The active source mounts the same PP exports in three places in src/app/App.tsx:

- Futures header: FuturesProfitProtectionControl.
- Open-position card: FuturesProfitProtectionCard.
- Trade detail: the same FuturesProfitProtectionCard when stored PP metadata exists.

Previously the control polled profit-protection-status every five seconds, rendered the mode flag as ON/OFF and exposed a toggle posting to profit-protection-control. The card displayed stored PP metadata, phase, automatic-admission/availability messages and a PP-specific details wrapper. A displayed ON flag was not proof of a running or safely executing worker.

Both exports now return null unconditionally. Their compatible prop/type signatures remain so App.tsx does not need modification. The removed components no longer read PP state, issue status requests, poll, confirm, render handlers or call mutation callbacks.

This UI change does NOT turn off server flags, erase PP records or change backend behavior.

## Removed

- Independent Profit Protection label and ON/OFF switch.
- Enable/disable control and توقف خروج‌های جدید.
- Automatic PP status / وضعیت در دسترس نیست.
- PP availability/waiting/phase cards, metrics and decorative detail wrapper.
- Component-local PP request/polling/toggle wiring.

There is no replacement notice, coming-soon card, fake disabled button or empty DOM wrapper.

## Preserved

Full App.tsx is unchanged relative to the verified base (normalized checkout EOL comparison). The existing Entry, SL, ONE TP, position status, Manual Close, Re-Analyze, native protection and confirmation controls remain in their original paths.

Fast Trader Smart Exit & Profit Protection is unchanged. Spot, Scanner, Strategy, Decision Engine, Risk, automatic enrollment, execution adapters, PP Worker/monitor/RPCs and database behavior remain unchanged. Existing generic trade-list loading/refresh and backend PP metadata attachment remain; removing this display is not a global monitoring/configuration change.

Read-only inspection of HELP_ASSISTANT_APP_DESCRIPTION found no instructions for these removed standard Futures PP UI controls. The unrelated Partner description was not changed; api/analyze.ts remains exact base.

## Files inspected

- AGENTS.md, CLAUDE.md, latest HANDOFF, current AI handoff and colleague release boundaries.
- Existing cleanup source/tests in tmp/pp-ui-current-main-20261004 and previous removal report.
- Current src/app/FuturesProfitProtection.tsx and all three App.tsx mounts.
- Existing UI tests and the complete imported offline enrollment/monitor test.
- api/analyze.ts help-description references.
- package.json, package-lock.json, vite.config.ts, vite.admin.config.ts.
- Built Web JS bundle; AI-Log report template/publication rules.

## Exact files changed

In the new isolated worktree only:

| File | Change |
|---|---|
| src/app/FuturesProfitProtection.tsx | Null-render both PP exports; remove display and UI-only effects |
| scripts/futures-profit-protection-ui-test.mjs | Six actual-render assertions now require empty PP output |
| scripts/futures-profit-protection-ui-cleanup-test.mjs | Reused 84 absence/state-isolation/preservation checks |
| docs/futures-profit-protection.md | Add local-only UI removal contract |
| HANDOFF.md | Add current task handoff |
| reports/futures/pp-ui-final-local-removal-2026-10-04.md | This report |

Primary checkout: report copy and additive HANDOFF note only. AI-Log receives only the sanitized report.

Protected-path diff is empty for api/, server/, migrations/, ops/, deploy/, .github/ and src/app/App.tsx. No application source outside the PP display module changed.

## Tests executed

Existing Node v22.23.3/dependencies reused. Candidate and primary package-lock SHA-256 match. No install, env file, Production API bootstrap, database connection or exchange request.

Commands from the isolated worktree:

```text
node --test --test-reporter=spec scripts/futures-profit-protection-ui-test.mjs scripts/futures-profit-protection-ui-cleanup-test.mjs
147/147 PASS; failed=0; skipped=0; duration=3467.399ms

node <existing-vite>/bin/vite.js build --mode pp-ui-final-removal
PASS; 2035 modules; 13.11s; existing large-chunk warning

node <existing-vite>/bin/vite.js build --config vite.admin.config.ts --mode pp-ui-final-removal
PASS; 1713 modules; 8.28s

node <existing-typescript>/bin/tsc --noEmit --pretty false --target es2022 --module esnext --moduleResolution bundler --jsx react-jsx --skipLibCheck --esModuleInterop --allowImportingTsExtensions --types node src/app/FuturesProfitProtection.tsx
PASS; zero diagnostics

git diff --check
PASS
```

The 147 tests are 84 cleanup cases, six official UI-render cases and 57 unchanged imported admission/monitor regressions. Real/Demo, Persian/English, admin/user, OPEN/CLOSED and all eight stored phases render an exactly empty string, even with enabled metadata. A Proxy rejects every prop read; synthetic fetch/timer/confirm/mutation ports remain unused.

The test-contract change is only the owner-requested removal of the old UI. No backend/policy assertion, frozen historical release scope or financial test was weakened.

Built Web artifact: dist/assets/index-DiCSkSt9.js. Additional assertion verifies seven removed PP labels/endpoint markers are absent; both independent Fast Trader labels remain. This is local compiled-output validation, not a live Production browser test.

## Fingerprints

Raw SHA-256:

- PP component: 12af315fa07cf124ed25b15df4f4e5333ed9134c31347463436e29600f087c2a.
- Official UI test: 8ce50cf5822e1466d230171aa5714ca2070336b6d1a85f9d14e44e2c9e44cb72.
- Cleanup test: d84bd366cf5b8a1ecb56eabe9577987d60a5924fb56b0b6d3a010a9f406775f1.
- Both package locks: fe938f4bc16dfbf034f15ad3ed3dda69fd2556889938536a82fbfa6d5eca6858.

## Git / publication state and limitations

No application commit/push, merge, CI dispatch, artifact, Guard or deployment. The prior pinned-base reconstruction authorization was not treated as permission to deploy; this is a fresh local-only implementation of the renewed UI request.

Official whole-release scope/CI gates were not run or modified. Their historical exact-inventory contracts may need a separately reviewed UI successor before release; 147 focused tests are not claimed as official release acceptance. Full-repository TypeScript and live browser/account checks were not performed.

Initial sandbox worktree-ref creation was denied, then the identical scoped local operation succeeded under the reviewed permission. An initial inspection used a non-existent components/ path and was corrected to the actual src/app/FuturesProfitProtection.tsx. A tool-orchestration syntax typo was corrected before any test command executed. No source fix, permission broadening or Production workaround resulted from these setup issues.

Standing AGENTS instruction authorizes publishing this sanitized work report to SignalVerse-AI-Log/master only. Its commit and remote-byte confirmation are recorded separately; application source stays local and uncommitted.

## Safety / final result

```text
LOCAL_UI_CLEANUP=PASS
PRODUCTION_UI_REMOVED=NOT_DEPLOYED
PP_BACKEND_CHANGED=NO
PP_WORKER_CHANGED=NO
WORKER_STARTED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
DATABASE_CHANGES=0
EXCHANGE_CALLS=0
ORDER_POSITION_CHANGES=0
ENTRY_SL_TP_CHANGES=0
CLOSE_ACTIONS=0
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI=NOT_RUN
DEPLOYMENT=NO
```

Next step is separately authorized source promotion and the existing official release gates; no runtime activation is implied by the local UI removal.
