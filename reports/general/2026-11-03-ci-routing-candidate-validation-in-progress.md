# CI routing candidate — validation in progress, not release acceptance

Recorded 2026-11-03T15:34:59.884913+00:00. This is a checkpoint, not a successful CI/deployment report.

## Authorization and source identity

Owner explicitly approved repairing CI before chart deployment after both
unchanged 180-minute attempts of main/push run41598306471 were cancelled.
A normal single commit was created on a separate branch and pushed there only:

- Candidate: `418de61b83a915ed19b1f0642e6a45a8c362f8ef`.
- Sole parent and remote main before/after push: `eacedbb2801c303482b201320968983fce9d93bf`.
- Branch: `codex/ci-module-routing-20261103`.
- Main promotion: **NOT PERFORMED**. No force push, amend or history rewrite.
- Application/runtime source is byte-identical to the parent; current main work
  was preserved. Earlier production runtime c161955239f24f151fed6a2a08dfcb8bef0e04ac
  was last independently verified during the prior read-only release audit;
  this CI task did not deploy or re-query the application runtime.

## Changes and preserved gates

The existing one-job workflow keeps its trigger/routing/permissions, Node22,
180-minute limit, original test commands and order. Every75 original command
group remains; prerequisite/compiler fragments give87 fragments and90 YAML
steps including planning/selftests/final audit. All four original frontend/API
compiler comparisons remain mandatory. Web/Admin/API and artifact-presence
checks remain mandatory. Artifact/Guard/release workflows and receiver limits
are unchanged.

The selector uses complete local Git change evidence, old/new runtime import
graphs, both rename paths, transitive **executed** test imports and literal
source/SQL dependencies. Historical allowlist names are recorded separately
from executable imports. Hashed proofs map actual generated Paper inputs and
existing native/test dynamic loaders; a changed/missing proof fails closed.
Shared/unknown inputs, workflow, test/provenance/contracts or documentation
changes request full validation. Some legacy mixed bundles still execute
several domains. This is conservative CI routing, not a claim of independent
runtime/module architecture or selective acceptance for every future PR.

A read-only actual-source routing example for a standalone Analysis chart edit
selects37/75 gates and excludes Prediction and Stablecoin; a shared Futures
indicator edit selects75/75. These are local routing examples, **not observed
selective GitHub runs**. This CI implementation change itself requires full CI.

The final always-running audit binds an exact-SHA plan/digest, recomputes it and
rejects missing, failed, cancelled or wrongly skipped required steps. CI-only
preloading connects compatible reads to the unchanged existing Git cache;
mutable reuse remains inside complete before/after source witnesses. Cache and
witness implementation files remain exact. The preload applies only to shell
steps and uses an absolute file URL, including child working directories.

Two old chart source-inventory readers and the existing latest-scope adapter
now transport only this separately validated exact CI successor. Their entire
predecessor files/assertions reconstruct exactly. A raw-current CI proof pins
the complete17-file delta, protected product/release files and every byte;
negative cases reject changed/extra inputs. No product assertion, expected
trading result, policy, financial guard or source-witness rule was removed.

## Actual local checks

- Fresh final Node24 run: **66/66 pass**,0 failed/cancelled/skipped,157.437s.
  Includes11 checked-Git/preload cases,18 routing cases,4 exact-source cases,
  all8 original cache/witness cases, all18 chart-completion cases and7 actual
  page/render/runtime cases. After the documentation update, all4 exact-source
  checks were run afresh and passed again.
-7 separate committed-CLI fixtures passed: exact-source/full planning,
  synthetic successful audit, reject failed/cancelled/skipped/missing required
  results, reject tampered plan and reject a mismatched checkout SHA. These
  simulate GitHub result shapes locally and are **not GitHub acceptance**.
- Web build PASS; Admin build PASS; API bundle PASS,14 source handlers and14
  bundles. Generated outputs are not committed. Known chunk-size warnings remain.
- YAML parsed with90 unique step IDs; `git diff --check` passed. Product TS input
  files/configuration did not change. Fresh official Node22 four-comparison
  results are still pending; previous chart compiler results are not reused as
  acceptance for this candidate.
- One newly added cross-directory preload test initially failed on Windows
  absolute-path URL handling. It was corrected to an absolute file URL, without
  weakening its assertion, and the complete66-case run was repeated green.
  An earlier65-case run and the failed66-case run were not relabelled.
- Initial Vite build was sandbox-denied writing its existing shared dependency
  cache; the normal build was rerun with that cache writable and passed. No
  source workaround or dependency/package change was made.
- Bounded cold historical-import profiles and one interrupted long local group
  are diagnostics, not successful gates. Whole-suite Linux speed remains
  unproven until the exact official run finishes.

## Official CI — still in progress

[Candidate run 41664101646](https://github.com/signal0verse/signalverse-main/actions/runs/41664101646)
uses the exact candidate above, `workflow_dispatch`, attempt1. At the recorded
snapshot it had7 successful steps, the retained Spot scanner/chart test group
running, and no failed step. The early isolated-runner scope gate, dependency
installation, selection plan and new CI selftest stage had succeeded. Full
compiler/build/chart-log verification remains pending. This branch dispatch
**cannot substitute for the required successful exact main/push release CI**.

One existing-factory isolated one-job Linux runner213 is attached, with the
unchanged2CPU/4GiB limit, mapped non-host-root namespace, no host mounts/ports,
private/production egress denied and production files inaccessible. No second
runner or third retry of the old chart run was created. Its original controller
removes the container on completion; final registration/container cleanup is
pending the job exit. Windows Docker was not used.

Owner-approved ten-minute follow-up remains scoped to finishing/verifying this
CI and publishing the actual result. It adds no promotion/deployment authority.

## Independent hard release blocker

Exact local commit capacity test: **8,407,874 bytes**, versus the
unchanged **8,388,608-byte** installed limit; excess
**19,266 bytes**. These diagnostic bytes were
discarded; no official or retained release artifact exists for this candidate.
No report archival, export rule, compression/packaging change, receiver/Guard
change, limit increase or alternative artifact was performed to evade this gate.

Even a green candidate CI cannot make this source release-ready. Capacity must
be resolved and any new main/release identity separately reviewed; main/push
acceptance, official retained bytes and independent Guard remain required.
The frozen chart's two cancelled attempts are never release acceptance.

## Exact changed paths

- `.github/workflows/production-ci.yml`
- `HANDOFF.md`
- `docs/testing/ci-module-routing-2026-11-03.md`
- `scripts/analysis-chart-completeness-test.mjs`
- `scripts/analysis-page-evidence-test.mjs`
- `scripts/ci-checked-git-preload.mjs`
- `scripts/ci-checked-git-test.mjs`
- `scripts/ci-module-routing-test.mjs`
- `scripts/ci-module-routing.mjs`
- `scripts/ci-module-scope-test.mjs`
- `scripts/lib/analysis-native-ux-parity.mjs`
- `scripts/lib/ci-checked-git.mjs`
- `scripts/lib/ci-module-delta.json`
- `scripts/lib/ci-module-policy.json`
- `scripts/lib/ci-module-routing.mjs`
- `scripts/lib/ci-module-scope.mjs`
- `scripts/lib/ci-workflow-contract.mjs`

## Operational safety / pending work

Production changes0; application/financial/strategy/scanner/worker/runtime
source changes0. No production DB read/write/migration was performed in this
CI task. Original disposable SQL tests run only in the isolated CI environment.
No artifact workflow, Guard/approval/claim operation or release was invoked.
Canonical PP Worker was not started/enabled/restarted; existing REAL_PP and
DEMO_PP flags were not changed. No private exchange call, order, position,
Entry/SL/TP modification or close action was performed.

Remaining: exact official CI completion, all original compiler/chart/source
log proofs, owned CI resource cleanup, final sanitized report and separate
resolution/review of the release capacity/new identity. No profitability or
private-account execution claim is made.

STATUS=CI_CANDIDATE_RUNNING_RELEASE_BLOCKED
MAIN_PUSH=NO
ARTIFACT_PREPARATION=NO
GUARD=NO
DEPLOYMENT=NO
DATABASE_MUTATION=NO
WORKER_STARTED=NO
EXCHANGE_ACTIONS=0
ORDER_CHANGES=0
POSITION_CHANGES=0
SL_TP_CHANGES=0
CLOSE_ACTIONS=0
