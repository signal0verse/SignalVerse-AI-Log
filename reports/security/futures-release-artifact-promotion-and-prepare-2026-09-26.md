# Release artifact fix promotion and prepare-only verification — 2026-09-26

## Metadata

- Date: 2026-09-26, Asia/Kuala_Lumpur; operational evidence timestamps below are UTC on 2026-09-25.
- Task: owner-approved promotion of the reviewed artifact control-plane fix, normal CI, prepare-only, independent retained-byte verification, then STOP.
- Repository: `signal0verse/signalverse-main`.
- Remote main before: `5eb6094658a692ba32687fccaa9759d20b68d6b5`.
- Remote main after: `10075341cdca3782cdd254d784afe39d818f7c0d`.
- Application artifact target: `5eb6094658a692ba32687fccaa9759d20b68d6b5` (not the tooling/main SHA).
- Working branch: `codex/release-artifact-reuse-20260926`, clean isolated checkout.
- Result: PASS for promotion, exact-main push CI, prepare-only and independent artifact validation. No release or deployment was attempted.

## Objective and scope

Promote only the already-reviewed six-file control-plane commit, allow normal push CI, run the dedicated prepare-only workflow for the exact application target and independently verify its retained bytes. No application implementation, Futures/Strategy/Spot, Guard, approval/claim, database, VPS, exchange, order or position changes were authorized or performed.

## Actions taken

1. Verified remote main, exact commit identity/direct ancestry, clean isolated checkout and approved six-file scope. The unrelated primary workspace and its existing work were preserved.
2. Read the workflow triggers and delivery boundaries. Push invokes Production CI; preparation and Production Release require separate dispatch. No automatic release was assumed or invoked.
3. Performed the normal, non-forced fast-forward push:

   ```text
   git push origin 10075341cdca3782cdd254d784afe39d818f7c0d:refs/heads/main
   git ls-remote origin refs/heads/main
   ```

   Remote main was immediately verified at exactly `10075341cdca3782cdd254d784afe39d818f7c0d` and verified again at completion. No merge commit, rebase, squash, force push or history rewrite occurred.

4. Observed the normal push-triggered Production CI to success.
5. Dispatched only the prepare-only workflow:

   ```text
   gh workflow run production-release-artifact.yml --repo signal0verse/signalverse-main --ref main -f sha=5eb6094658a692ba32687fccaa9759d20b68d6b5
   ```

6. Queried the completed run and its one retained artifact. Downloaded the exact artifact ID through the authenticated GitHub API as binary bytes, without text conversion.
7. Independently checked the downloaded ZIP hash/size, extracted only the two allowed files, checked the inner archive SHA-256/size, verified metadata/API provenance, and compared all tar file payloads to the target Git tree.
8. Stopped. No delivery request was sent to the VPS. No new Production Release run was invoked. A final read-only query still showed the preceding failed release run `36158663844`, created `2026-09-25T16:06:51Z`, as the latest Production Release run.

## Files inspected / promoted

Exactly these files belong to the reviewed commit:

| File | Classification |
| --- | --- |
| `.github/workflows/production-release-artifact.yml` | New prepare-only workflow |
| `.github/workflows/production-release.yml` | Retained-artifact delivery workflow |
| `scripts/release-artifact.mjs` | Artifact preparation and validation |
| `scripts/release-artifact-test.mjs` | Packaging/provenance regression tests |
| `reports/security/futures-release-artifact-reproducibility-fix-2026-09-26.md` | Implementation report |
| `HANDOFF.md` | Existing implementation handoff |

The approved commit was promoted unchanged. No new application commit or implementation edit was created in this task. Existing Production CI and application/migration/Guard files were not changed by the promoted diff. This completion report is published separately to AI-Log, not as an additional application-main commit.

## CI and build evidence

| Field | Production CI | Prepare-only |
| --- | --- | --- |
| Run ID | `36163756436` | `36164169421` |
| Workflow | Production CI | Production Release Artifact (prepare only) |
| Head SHA | `10075341cdca3782cdd254d784afe39d818f7c0d` | `10075341cdca3782cdd254d784afe39d818f7c0d` |
| Branch | main | main |
| Event | push | workflow_dispatch |
| Created UTC | `2026-09-25T16:54:32Z` | `2026-09-25T16:58:29Z` |
| Completed/updated UTC | `2026-09-25T16:57:06Z` | `2026-09-25T16:58:49Z` |
| Conclusion | success | success |

- [Production CI](https://github.com/signal0verse/signalverse-main/actions/runs/36163756436): its configured test/build stages, including Futures, Spot, admin, isolated SQL and web/API builds, passed.
- [Prepare-only](https://github.com/signal0verse/signalverse-main/actions/runs/36164169421): Ubuntu 24.04/Linux; Node `22.23.2`; Git `2.55.0`; reported zlib `1.3`; attempt `1`.
- The earlier local 32/32 artifact regression result is historical evidence, not a newly executed test count in this task. The Production CI workflow does not itself run that dedicated suite. Actual GitHub packaging and retention were exercised here, independently of source-text tests.

## Retained artifact identity

| Field | Exact value |
| --- | --- |
| Artifact ID | `10875754793` |
| Name | `production-release-5eb6094658a692ba32687fccaa9759d20b68d6b5-36164169421-1` |
| Created UTC | `2026-09-25T16:58:44Z` |
| Expires UTC | `2026-10-25T16:58:43Z` |
| Expired at inspection | false |
| Artifact count for run | 1 |
| Downloaded UTC | `2026-09-25T17:00:03.688Z` |
| Independent verification UTC | `2026-09-25T17:00:39.276Z` |
| GitHub wrapper ZIP bytes | `3951433` |
| GitHub wrapper ZIP SHA-256 | `10619be293e249c61c23f85fc4aac5b0eb3622e3467b738e7a295dd8ea51439e` |
| Inner release.tar.gz bytes | `3950488` |
| Inner release.tar.gz SHA-256 | `5a25a166cca27eadaf8281ea783d1cb91cf12e50f62dfb431bfcdb99b683c8be` |
| Embedded commit | `5eb6094658a692ba32687fccaa9759d20b68d6b5` |
| Contract | `git-archive-lf-v1` |
| Metadata run/attempt | `36164169421` / `1` |
| Metadata workflow/tooling SHA | `10075341cdca3782cdd254d784afe39d818f7c0d` |

[Retained GitHub artifact](https://github.com/signal0verse/signalverse-main/actions/runs/36164169421/artifacts/10875754793).

**The inner archive digest, not the GitHub wrapper ZIP digest, is the release-artifact identity for any future independently authorized Guard approval.** No approval was created here.

## Independent checks executed

| Check | Result |
| --- | --- |
| Authenticated run identity, success, workflow, branch, attempt | PASS |
| Authenticated artifact ID/name/run association, non-expiry | PASS |
| Downloaded ZIP SHA-256 and size equal API metadata | PASS |
| ZIP exact allowlist: `metadata.json`, `release.tar.gz`; no symlink entries; bounded extraction; no overwrite | PASS |
| Independent PowerShell `Get-FileHash -Algorithm SHA256` of retained inner archive | PASS |
| Inner archive size/digest equal metadata and known correct Linux reference | PASS |
| Promoted helper `verify` against downloaded run/artifact API records | PASS |
| `git get-tar-commit-id` applied to decompressed archive prefix | PASS: exact target |
| Independent tar payload Git blob hashes compared with `git ls-tree -r -z` target | PASS: 574/574 regular files; exact tree count; no duplicates |
| Repackaging during download/verification | NONE |

The helper invocation was verification only:

```text
node scripts/release-artifact.mjs verify 5eb6094658a692ba32687fccaa9759d20b68d6b5 5a25a166cca27eadaf8281ea783d1cb91cf12e50f62dfb431bfcdb99b683c8be 36164169421 10875754793 <evidence>/bundle <evidence>/run.json <evidence>/artifact.json
```

The independent tar audit decompressed and read the retained bytes in memory; it did not create a substitute tar/gzip archive. Every file payload was checked against the target Git object, not only the embedded commit label.

## Findings and lifecycle boundary

CONFIRMED: the new Linux prepare-only run produced the exact previously established correct Linux digest. The reviewed deterministic packaging contract avoids inherited Windows `core.autocrlf=true` conversion, which produced the earlier different Windows artifact. The retained archive is the intended target's complete Git tree.

Observed lifecycle:

```text
main/tooling 1007534 + requested target 5eb6094
  -> Linux prepare-only run 36164169421
  -> one release.tar.gz + metadata
  -> immutable artifact ID 10875754793
  -> exact-ID binary download
  -> independent byte/commit/tree verification
  -> STOP
```

The delivered archive has NOT been sent to the receiver or accepted by Guard in this task. Static release-flow verification and successful local/GitHub preparation do not establish live Guard acceptance or deployment success.

## Git / publication state

- Reviewed commit promoted: `10075341cdca3782cdd254d784afe39d818f7c0d`.
- Remote main verified at exactly that SHA after push and at final read-only recheck.
- Isolated checkout remains clean at that SHA.
- No new application commit; local primary workspace and its unrelated work preserved.
- This sanitized report is intended for `SignalVerse-AI-Log/master`; its publication commit and verified link are reported in the task response after remote readback.

## Remaining issues / limitations

1. Production Release, retained-byte delivery to VPS, Guard digest verification on that delivery and activation remain intentionally untested in this task.
2. The old claimed/expired approval UUID `3bbbf63d-65c1-45c2-82d1-7be1943c7f52` was not inspected again or modified. No recovery/unclaim mechanism was executed or invented. Its recorded recovery blocker remains separate; a retained correct artifact does not clear it.
3. No approval was created or renewed. No claim was removed or revoked. No release retry is authorized by completion of this task.
4. The current Production runtime was not queried over SSH in this task. Do not equate current GitHub main with an activated runtime.
5. Artifact retention expires as shown; no permanence beyond the recorded retention window is claimed.
6. These results concern release packaging correctness, not trading execution, strategy performance or profitability.

## Safety declarations

```text
PUSH_TO_MAIN = YES (exact reviewed commit, fast-forward)
HISTORY_REWRITE = NO
NORMAL_PRODUCTION_CI = PASS
PREPARE_ONLY_DISPATCH = YES
PRODUCTION_RELEASE_INVOKED = NO
DEPLOYMENT = NO
VPS_ACTION = NO
APPROVAL_CREATED = NO
APPROVAL_RECOVERED_OR_RENEWED = NO
CLAIM_MODIFIED_OR_DELETED = NO
GUARD_MODIFIED = NO
DATABASE_CHANGE = NO
APPLICATION_SOURCE_CHANGE = NO
FUTURES_STRATEGY_CHANGE = NO
SPOT_CHANGE = NO
ORDERS = 0
POSITIONS_CHANGED = 0
EXCHANGE_ACTIONS = 0
```

These action counts describe this task's operations; they are not a claim that autonomous Production activity was paused or independently audited.

## Recommended next step

Owner decision only. Stop here as requested. Any evidence-preserving approval-state recovery, new independent approval or official release requires its own explicit, bounded authorization and fresh identity/expiry checks. Do not delete historical claim evidence or automatically retry release.
