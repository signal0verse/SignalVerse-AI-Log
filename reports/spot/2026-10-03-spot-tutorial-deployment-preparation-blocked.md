# Spot tutorial deployment preparation — blocked before release

## Metadata

- Date: 2026-10-03
- Task ID: spot-tutorial-deployment
- Module: Spot tutorial release
- Mode: source promotion and release preparation; production activation NOT performed
- Repository: signal0verse/signalverse-main
- Branch: main (approved tutorial); codex/spot-tutorial-release-20261003 (local test integration)
- Starting active commit: e1fdc45f29b350670e707de3a7afa10b9153d689
- Published tutorial commit: f4dc6e76f9df2fe64e9cf5079dc6e8d5963bdcc8
- Ending active commit: unchanged, e1fdc45f29b350670e707de3a7afa10b9153d689

## Objective

The owner accepted the local tutorial preview and explicitly asked to deploy it.

## Scope

Publish the approved Spot tutorial, use the existing exact-SHA CI/artifact/Guard
release workflow and verify production. No trading-policy, scheduler, account,
order, schema, receiver or root-coordinator change was requested.

## Actions Taken

1. Compared the deployed-source pin and latest main: both were e1fdc45, the tutorial
   candidate's parent. Confirmed the main/admin services were active and local
   health succeeded. An initial query used the nonexistent signalverse-api unit;
   inventory confirmed the correct active unit is signalverse.service.
2. Promoted the exact preview commit f4dc6e7 to main with a normal fast-forward push.
3. Exact main push CI failed at two historical source-parity checks, before any
   artifact preparation or production delivery.
4. Prepared a five-file local integration that validates the exact approved
   tutorial and its test-only bridge, then supplies the original byte state to
   historical contracts. The actual application code is not transformed at runtime.
5. Ran relevant offline tests and reviewed source scope. Attempted to commit/push
   the test integration; automatic approval review rejected that compound action
   as a persistent release-control change not covered by tutorial deployment consent.
6. Stopped publication/deployment at that rejection. No alternate delivery route,
   root authorization issuance, CI bypass or direct asset replacement was attempted.

## Files Inspected

- AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md
- docs/COLLEAGUE_HANDOFF_2026-09-29.md and safe-test runbook
- production-ci.yml, production-release-artifact.yml, production-release.yml
- scripts/release-artifact.mjs and current historical source-parity helpers/tests
- Installed release coordinator and release-authorization module, read-only

## Files Changed

The previously approved application commit was published unchanged. Five local
test/control files are prepared and uncommitted in the separate release worktree:

- .github/workflows/production-ci.yml
- scripts/lib/futures-profit-protection-automatic-parity.mjs
- scripts/lib/futures-profit-protection-verify-only-parity.mjs
- scripts/lib/spot-tutorial-release-parity.mjs (new)
- scripts/spot-tutorial-release-scope-test.mjs (new)

No additional src/app, api, server, ops or migrations changes were made to the
approved preview. Local, unexecuted artifact-inspection/approval scripts remain
under the earlier isolated worktree's tmp directory; they were not published or
executed against production.

## Root Cause / Findings

CONFIRMED: The historical automatic PP contract freezes the entire App source,
and the Phase3B contract freezes the cumulative changed-path inventory. The new
approved guide differs from both snapshots, so simply deploying the tutorial
cannot pass the current source-wide tests.

CONFIRMED: Main CI run 37101504889 failed in full-terminal-contract-test and
terminal-view-parity-test. Existing financial execution and account behavior
were not changed by the tutorial.

CONFIRMED: Publication of the prepared control integration was rejected by the
automatic approval reviewer. It classified changing CI/parity contracts as a
durable security/release-control modification requiring specific owner consent.

## Implementation

Candidate integration pins the exact seven-file reviewed tutorial at f4dc6e7,
four test/workflow integration hashes and its own integrity hash. Unexpected,
missing or changed source paths are rejected. It reverses that inspected delta
only for historical comparisons, preserving the old Phase3B negative checks and
older policy/body assertions. Adds actual tutorial rendering plus closed-scope
tests to CI. This candidate is not committed, published or active.

## Tests Executed

Node 22.23.3, offline sources only:

- node --test scripts/spot-tutorial-ui-test.mjs scripts/spot-tutorial-release-scope-test.mjs scripts/full-terminal-contract-test.mjs scripts/terminal-view-parity-test.mjs scripts/trade-onboarding-test.mjs:
  PASS, 24/24. Original Phase3B contract reported 50 rejected negative cases;
  additional tutorial checks reject unexpected paths, missing files and mutations.
- git diff --check: PASS.
- git diff --name-only against approved preview for src/app, api, server, ops and
  migrations: EMPTY, no runtime changes from the reviewed UI.
- node scripts/futures-profit-protection-scope-test.mjs --types: FAILED before
  type diagnostics on a protected-policy string comparison showing CRLF checkout
  text versus LF Git text. No policy file was changed. This wider check remains
  incomplete and should be rerun in a canonical-LF isolated checkout after consent;
  do not weaken policy assertions to address a checkout line-ending difference.
- Production read-only health and main/admin service inventory: PASS.

## Build Result

The approved preview's prior frontend/admin builds passed. Exact main CI:
https://github.com/signal0verse/signalverse-main/actions/runs/37101504889
FAILED at historical UI/scope parity. No successful successor CI/artifact/release
was produced in this request.

## Git Status

Remote main is f4dc6e76f9df2fe64e9cf5079dc6e8d5963bdcc8. Local release branch
HEAD remains the same; its five control/test changes are uncommitted. The rejected
commit/push command did not execute. Original dirty checkout and local preview
remain preserved. Live runtime remains e1fdc45.

## Commit

No new commit in this deployment request. Approved tutorial source f4dc6e7 was
fast-forward published to main.

## Remaining Issues

Specific owner consent for the concrete five-file CI/parity integration, then
canonical-LF broader validation, commit/push, exact main CI, retained artifact
inspection, existing one-time Guard authorization, official release and live checks.

## Risks / Limitations

Changing a release-control contract affects future acceptance; therefore its exact
scope and negative checks need review. Current prepared integration admits only
the reviewed tutorial/test delta, but automatic approval review still requires
specific consent. No VPS write, service restart, database change, scheduler/flag
change, order, real account action or production migration was performed.

## Recommended Next Step

Owner explicitly approve or decline the prepared five-file test/control integration.
If approved, finish validation and the normal gated release; do not bypass it.
