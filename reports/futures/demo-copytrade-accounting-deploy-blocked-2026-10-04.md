# Demo copy-trade accounting deployment — blocked by historical release scope

## Metadata

- Date: 2026-10-04; evidence collected through 10:39:57 UTC.
- Task ID: DEMO-COPYTRADE-ACCOUNTING-DEPLOY
- Module: Standard Futures Demo accounting display.
- Mode: owner-authorized deployment preflight; stopped at first failed official gate.
- Repository: SignalVerse-Main.
- Candidate branch: codex/futures-demo-accounting-20261004.
- Starting / ending candidate HEAD: 14c68c785cfbf8fbca34f006d636e3891b2db2de.
- New source commit: NONE.

## Objective

Publish the previously locally validated Demo accounting display correction through the official release mechanism. The owner's current request authorizes deployment, not bypassing an existing release gate.

## Scope

Exact existing local implementation only. No balance settlement, financial history, Real trading, PP Worker/flags, Strategy, Scanner or position changes. No alternative deployment.

## Actions Taken

1. Preserved dirty primary checkout and existing isolated candidate changes.
2. Authenticated git ls-remote origin refs/heads/main returned 14c68c785cfbf8fbca34f006d636e3891b2db2de, matching the candidate base. No main advancement blocker.
3. Read official Production CI and prepare-only workflows, safe-test runbook and relevant historical scope validators.
4. Executed the exact official scope command locally.
5. Stopped on failure before commit/push, remote CI, artifact, Guard or any VPS access.
6. Rehashed the four validated implementation/test files; all match the previous local validation report exactly.
7. Prepared a sanitized report-only AI-Log publication; no application publication.

## Files Inspected

- AGENTS.md, CLAUDE.md, latest HANDOFF.md and docs/AI_HANDOFF.md entries.
- docs/COLLEAGUE_HANDOFF_2026-09-29.md.
- docs/testing/stability-test-runbook.md.
- .github/workflows/production-ci.yml.
- .github/workflows/production-release-artifact.yml.
- scripts/futures-profit-protection-scope-test.mjs.
- scripts/lib/futures-pp-ui-removal-parity.mjs.
- scripts/lib/futures-pp-ui-removal-delta.json.
- scripts/futures-pp-ui-removal-scope-test.mjs.
- scripts/futures-reentry-release-scope-test.mjs.
- Prior local report: demo-copytrade-accounting-display-2026-10-04.md.

The optional .githooks/pre-commit path does not exist; no hook was installed, changed or bypassed.

## Files Changed In This Request

- Primary HANDOFF.md: additive blocker handoff only, retaining all pre-existing edits.
- reports/futures/demo-copytrade-accounting-deploy-blocked-2026-10-04.md: this report.
- AI-Log copy of this report.

Candidate application, test, manifest and validator files: NO NEW CHANGES.

## Root Cause / Findings

CONFIRMED:

Official command:
node scripts/futures-profit-protection-scope-test.mjs --types

Runtime: Node v22.23.3.
Exit: 1.
First assertion:
AssertionError [ERR_ASSERTION]: Exact PP UI removal inventory

Location:
scripts/lib/futures-pp-ui-removal-parity.mjs:63
called by verifyPpUiRemovalScope -> projectPpUiRemovalScope ->
verifyManualProfitReentryReleaseScope -> historical Spot/Phase3B scope projections ->
futures-profit-protection-scope-test.mjs.

The validator pins the earlier PP UI-removal release to parent
fca794122a7f235e0a774dbbbb0c6241ce4e10a3 and an exact closed file inventory/digest manifest.

Five legitimate new Demo-accounting paths are outside that earlier inventory:

- api/analyze.ts (help knowledge text only)
- reports/futures/demo-copytrade-accounting-display-2026-10-04.md
- scripts/futures-demo-accounting-ui-test.mjs
- src/app/App.tsx
- src/app/copyTradeAccounting.ts

This is not evidence of a failed Demo calculation. It is a missing successor release-scope contract for this newly authorized feature correction. The current guardrail rejects the new delta as designed.

The gate stopped at inventory validation. Downstream digest/projection/type checks in this invocation were not reached and are NOT reported as passing. Expanding the list alone is not sufficient: exact file hashes, preservation assertions and actual-source regression tests must also remain effective.

## Implementation

NONE in this request. No validator, allowlist, immutable manifest or historical assertion was changed. No test was disabled and no gate was bypassed.

## Tests Executed / Existing Evidence

- Official scope command: FAIL as above; stop before source publication.
- git diff --check: PASS.
- Protected execution paths have empty task diff:
  api/copytrade.ts, api/_shared, server, migrations, ops, deploy, .github.
- Four implementation/test byte hashes remain equal to the prior local validation:
  - App.tsx: 1d178e1e89d9957d63a40dff30f561d8bda8560f254d66a2b79d17e032baf143
  - copyTradeAccounting.ts: 4be949f902acfccb9e296728fffed439f1f6b5838833303ab3bd1c7e87ae5b6c
  - futures-demo-accounting-ui-test.mjs: 032b2d899371c61b733993fd2cdb91395305410e804f88c66e98c2024aebf8dc
  - api/analyze.ts: 46fd2f8f1feb86af02f4f6c1cb6212a15ad84e59340736656b2c126f116de8df
- Previous local evidence (not rerun here): 230/230 tests, Web/Admin build PASS, zero introduced TypeScript diagnostics. Full TypeScript retained 71 baseline diagnostics; affected API set retained 65.
- Those local results do not override this failed release gate.

## Build Result

Not rerun after the release-gate stop. Prior build evidence remains recorded separately; no release artifact prepared.

## Git Status / Commit

REMOTE_MAIN=14c68c785cfbf8fbca34f006d636e3891b2db2de
CANDIDATE_BASE=14c68c785cfbf8fbca34f006d636e3891b2db2de
CANDIDATE_NEW_COMMIT=NONE
APPLICATION_PUSH=NO
MAIN_CHANGE=NO
REMOTE_CI=NOT_STARTED
ARTIFACT=NOT_CREATED
GUARD=NOT_CREATED
RELEASE=NOT_STARTED

Report-only AI-Log commit/link is returned after remote byte verification.

## Remaining Issues / Risks / Limitations

- Demo accounting correction is NOT deployed.
- No VPS, runtime, database or private exchange inspection was performed in this request; current Production health/state was not freshly asserted.
- Existing history rows with missing fees will remain honestly unavailable even after eventual release; no backfill is part of this fix.
- Existing Production continues independently; zero direct agent actions is not a claim of zero natural trading activity.

## Recommended Next Step

Obtain explicit approval for a narrowly bounded Demo-accounting successor scope contract and corresponding tests. Preserve old manifests and negative assertions; verify the exact new delta before any historical projection; reject all unrelated backend/Spot/PP/execution changes. Then rerun gates and official exact-SHA CI before artifact/independent Guard/release. Do not deploy by manual copy or reuse any previous Guard.

PRODUCTION_CHANGE_BY_TASK=NO
DATABASE_MUTATION=NO
WORKER_STARTED=NO
PP_FLAGS_CHANGED=NO
EXCHANGE_CALLS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_TP_CHANGES=0
CLOSE_ACTIONS=0
DEPLOYMENT=NO
FINAL_STATUS=DEPLOYMENT_BLOCKED_RELEASE_SCOPE_CONTRACT
