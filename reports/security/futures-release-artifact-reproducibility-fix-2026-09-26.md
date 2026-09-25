# Futures release artifact reproducibility — implementation only

## Metadata

- Date: 2026-09-26 Asia/Kuala_Lumpur (audit on 2026-09-25 UTC).
- Module: release packaging/delivery control-plane candidate; no application changes.
- Repository: signal0verse/signalverse-main.
- Branch: codex/release-artifact-reuse-20260926, isolated worktree.
- Starting commit / unchanged application target: `5eb6094658a692ba32687fccaa9759d20b68d6b5`.
- Status: **FUTURES-RELEASE-ARTIFACT-FIX-READY**, local implementation only, NOT permission to release.
- Ending implementation commit: recorded in final handoff/publication, not substituted for the application target.

## Objective and scope

Audit the complete installed artifact path, then eliminate repackaging between independent approval and delivery. Keep exact digest verification and all Guard policies. No release/preparation workflow was dispatched, no authorization issued/modified and no Production writes occurred. The existing dirty owner checkout and its unrelated work were preserved; the candidate is based on the exact target in a separate worktree. No pull/merge/main update was performed.

## Confirmed root cause

Windows system `core.autocrlf=true` converted LF to CRLF during `git archive`. For the immutable target:

```text
Linux CI SHA256 = 5a25a166cca27eadaf8281ea783d1cb91cf12e50f62dfb431bfcdb99b683c8be
Linux CI reproduced bytes = 3950488
Previous Windows SHA256 = 56fb543a71190e76aa36cbd33363b6bdba9d2e32e5093bca769306d6b31070af
Previous Windows bytes = 3963529
```

Historical failed run `36158663844` packaged the LF bytes but the independent manifest approved the Windows digest. The receiver correctly rejected `ARTIFACT_SHA_MISMATCH` after claiming the approval. Prior evidence/reports were not rewritten. This correction does not treat two digests as equivalent.

## Complete read-only audit: before

Inspected the full target `.github/workflows/production-release.yml`, the full Production CI workflow, and the complete installed receiver, authorization helper and coordinator. Current remote workflow blob still `ac63f98be6e5dd24a239ddbab25b769645ad52d4` / 3260 bytes; remote main remained the exact target. Local main remained `85aedfb944a67c94227ac343e911bc64a581e79e` (not changed or synchronized by this task).

| Stage | Actual current path / evidence |
| --- | --- |
| Created | `production-release.yml`, manual exact-SHA checkout; `git archive --format=tar.gz --output="$RUNNER_TEMP/release.tar.gz" "$REQUESTED_SHA"`. No EOL pin and no retained Actions artifact. Production CI itself builds/tests, but does not retain this source archive. |
| Hashed | Release job `sha256sum` hashes its newly created archive; prior independent operator generation hashed a separate Windows archive. |
| Approved | Root-owned out-of-band `approvals/<sha>.json`, exact SHA + exactly one artifact digest, UUID, issuance/expiry, version. CI/HTTP cannot issue it. No cryptographic signature field: trust is root ownership/private store plus strict format, not a fabricated signature. |
| Transmitted | OIDC-authenticated curl `--data-binary @release.tar.gz` to existing receiver. |
| Receiver verification | `createDeployReceiver` -> `inspectApproval` -> `claimApproval` -> `receiveArchive`; streamed SHA-256 compared exactly to `manifest.artifactSha256`; mismatch removes only the upload temporary, not the claim. No accepted artifact/unit on mismatch. |
| Final verification | Installed coordinator, holding global flock, builds from the accepted archive then calls helper `consume` immediately before activation. `consumeApproval` hashes the archive again, matches the exact manifest digest and claim, checks expiry/revocation, records consumption, then activation can occur. No second archive creation on VPS. |

The installed coordinator, not the older source copy of `ops/signalverse-deploy` in the application target, is authoritative for the last gate. No installed file was replaced.

Installed hashes:

```text
/opt/signalverse/deploy-receiver.mjs
c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa
/opt/signalverse/release-authorization.mjs
acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83
/usr/local/sbin/signalverse-deploy
572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec
```

Receiver OIDC remains restricted to the existing repository, main ref, manual event, and `production-release.yml@refs/heads/main`. Its workflow claim SHA identifies reviewed control-plane code, not necessarily the ancestor application SHA; target identity is independently fixed by the out-of-band manifest and artifact digest. The new preparation workflow has no OIDC write grant or delivery path. No Guard change is necessary.

## Packaging design after — preferred retained-byte design

```text
explicit prepare-only workflow (exact target + successful main push CI)
  -> create archive ONCE using LF-preserving command-scoped contract
  -> hash that exact buffer + verify embedded Git PAX commit
  -> retain release.tar.gz + metadata.json under immutable artifact ID
  -> independent operator downloads/verifies actual inner archive bytes
  -> separately authorized approval binds target + actual archive SHA-256
  -> existing Production Release explicitly selects run ID + artifact ID + digest
  -> verify successful main preparation provenance and retained metadata
  -> download exact retained artifact; verify digest + embedded commit
  -> send SAME inner release.tar.gz bytes; NO archive regeneration
  -> unchanged receiver digest gate -> unchanged final consume digest gate
```

Actions upload/download support this architecture without VPS changes. [Upload artifact documentation](https://github.com/actions/upload-artifact) describes immutable artifacts; [download documentation](https://github.com/actions/download-artifact) supports exact artifact IDs and cross-run selection. New actions are pinned to audited official tag commit identities (upload v7 `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a`, download v8 `3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c`).

Important distinctions:

- The Actions ZIP container digest is NOT the Guard digest. The Guard digest is SHA-256 of the inner `release.tar.gz` actually transmitted.
- Immutable means a particular artifact ID's bytes are not overwritten, not permanent storage. Retention is 30 days; deletion/expiry/missing artifact causes failure, never repackaging fallback.
- Preparation name binds target, run ID and attempt; `overwrite:false`. Reruns receive a different attempt/name/ID. Stale-attempt artifacts are rejected.
- Release validates authenticated API run ID/status/conclusion/path/repository/head repository/main/manual-event/attempt plus artifact ID/name/run/head/expiry. Download hash mismatch is an error; the inner digest and metadata are then checked again before OIDC retrieval.
- The operator-supplied digest is a preflight expectation, NOT authorization. Only the independent root manifest grants admission. A fabricated input digest cannot override Guard.
- Helpers are checked out from the reviewed workflow revision, never executed from the downloaded application archive. This permits retaining the exact old application target while separately reviewing/promoting new release tooling later. Neither promotion is authorized here.
- Packaging contract pins `core.autocrlf=false`, `core.eol=lf`, `tar.umask=0002`, and Git's built-in `tar.tar.gz.command=git archive gzip`, only per command. Git version/build options are recorded. No global/local config is modified.
- Reproducibility is demonstrated for the recorded toolchain/target, not a universal claim over all future Git/zlib versions or committed export/filter attributes. Reusing the approved bytes removes cross-build equality as a delivery dependency.

## Files changed

1. `.github/workflows/production-release-artifact.yml` — new manual prepare-only workflow, archive once, hash/metadata, immutable retention. No Production environment, OIDC write permission, automatic trigger, approval or deploy call.
2. `.github/workflows/production-release.yml` — download exact retained bytes instead of creating an archive; required explicit artifact coordinates, source/hash/commit validation. Existing CI, main lineage, environment, OIDC and receiver delivery gates retained.
3. `scripts/release-artifact.mjs` — dependency-free packaging/verification helper, bounded subprocess/output, 8 MiB receiver-compatible limit, embedded Git identity, metadata checks, no networking or Guard/application imports. Refuses output overwrite.
4. `scripts/release-artifact-test.mjs` — offline local Git fixtures, deterministic full-digest regression, provenance/tampering/identity/CLI/workflow tests.
5. This report.
6. `HANDOFF.md` — classification, results and no-release boundary only.

No application, Futures, Spot, Demo, execution, database, installed Guard or coordinator file changed. Production CI itself is not modified. Tests are run locally; no automatic workflow execution is claimed.

## Tests executed

| Check | Result |
| --- | --- |
| `node --check scripts/release-artifact.mjs` and test file | PASS |
| `node --test scripts/release-artifact-test.mjs` | 32/32 PASS, zero skipped |
| Exact target packaged repeatedly with the production helper | Same full Linux CI SHA-256, 3950488 bytes; embedded commit exact |
| Disposable repository: autocrlf true/input/false, eol=crlf, hostile tar mode/backend config, two repetitions each | Same complete digest/commit; command settings win; fixture config unchanged; uncommitted edits excluded |
| CLI roundtrip, source verification, archive/metadata checks, no overwrite | PASS, retained bytes unchanged; extra files rejected |
| Wrong run/repository/branch/event/attempt/workflow/artifact/expiry/digest/metadata/embedded identity | Rejected; old Windows digest not accepted |
| actionlint 1.7.12 on both workflow files | PASS; shellcheck/pyflakes explicitly disabled; YAML/expression/action lint passed |
| Bash `-n` for all 7 workflow run blocks | PASS (syntax only, nothing executed) |
| `git diff --check` | PASS |

Local Node v24.19.0, Git 2.55.0.windows.5; workflow helper runtime explicitly Node 22. Native Linux/GitHub end-to-end execution is NOT performed. Actionlint downloaded from the official release and verified against published checksum `6e7241b51e6817ea6a047693d8e6fed13b31819c9a0dd6c5a726e1592d22f6e9` before use. An attempted optional PyYAML check was unavailable; no dependency was installed to compensate. Actionlint plus separate Bash syntax validation supplied the actual static checks.

One initial local test exposed a Windows stdin EOF when feeding the entire tar to `git get-tar-commit-id`, which reads only 1024 bytes. The helper now supplies exactly that prefix after bounded gzip validation; the final suite passes. This was a local verifier issue, not a change to archive contents or weakened identity checking.

## Existing claim and required recovery — no action performed

Exact read-only snapshot **2026-09-25T16:26:32Z**:

```text
UUID = 3bbbf63d-65c1-45c2-82d1-7be1943c7f52
approval = present
SHA-keyed claim = present, identical manifest
approval/claim SHA256 = 663b42664e1695ce1ca800e01b46a6bf6e8261ae54d9a9d9ffeb8c44c83af1cb
issuedAt = 2026-09-25T15:51:36Z
expiresAt = 2026-09-25T16:51:36Z
consumed UUID record = absent
revoked UUID marker = absent
target incoming archive = absent
queued systemd jobs = 0
target artifact unit = absent
Production runtime marker = b3195f788e14e393464e93aa9545cc7614a1caaf
receiver = active, PID 2166041
```

The owner's description says expired; the recorded VPS clock at this snapshot was still before the recorded expiry. We do not fabricate an expired observation. It is already **claimed and unusable** regardless. After natural expiry it remains unusable, and the claim is not automatically removed. An unrelated historical failed artifact unit exists; it was neither retried nor altered.

The helper exposes only the `consume` CLI; there is no recovery/unclaim/issue/revoke command. `inspectApproval` blocks a new manifest even with a new UUID when `claims/<same-sha>.json` exists. Expiry is not cleanup. Therefore **no executable recovery procedure is currently available**, and no replacement approval can safely be issued through the current path as-is.

Required separately authorized recovery procedure specification (NOT an invented command and NOT executed):

1. Obtain explicit owner approval for designing/testing and later running failed-claim recovery. Packaging approval alone does not authorize this.
2. Preserve the failed run/log IDs, complete old approval/claim bytes, hashes, ownership/modes/timestamps, receiver rejection journal, incoming/consumed/revoked state and unchanged runtime proof in durable restricted audit evidence. Verify its integrity; never rewrite the failed record.
3. A reviewed recovery operation must serialize with both receiver admission and the coordinator: the coordinator flock alone is insufficient because receiver claim admission does not take that flock. Demonstrate no in-flight receiver upload, no queued/running target activation, no consumption and no uncertain activation. Ambiguity must keep the SHA blocked.
4. Specify and test crash-safe retirement of the failed authorization and the SHA-keyed admission hold, retaining immutable evidence/tombstones so the old UUID/authorization cannot be replayed. This transition is missing today; it requires separate design/security review and explicit authorization. Do not improvise file edits, rename/delete recipes, expiry bypass or `consume` as cleanup.
5. Independently verify post-recovery invariants: old authorization permanently unusable, failed evidence intact, no activation/runtime changes, and a clearly audited state that can admit a newly authorized manifest for the same SHA. If any invariant is unproven, STOP.
6. Only after that approved recovery has actually succeeded, separately authorize issuance of one fresh manifest for the downloaded retained artifact's exact digest. Then separately authorize release. None of these future actions is performed here.

The precise missing operation is safe retirement of a failed, unconsumed, SHA-keyed claim under concurrency control; neither waiting nor generating a new UUID implements it.

## Build / Git / remaining gates

Application builds are NOT RUN: no application code changed. The fix is a local control-plane candidate only. Required later gates: owner review, separately authorized control-plane promotion, real non-deploy artifact preparation/download validation on GitHub, independent artifact inspection, approved claim-recovery implementation/operation, new manifest authorization, then separate exact-target release authorization. No promise of live artifact retention/transfer success is inferred from mocks or syntax tests.

Final read-only check at **2026-09-25T16:34:49Z**: all three installed control-plane hashes and both old approval/claim hashes match the earlier snapshot; both manifests remain root:root 0600. Receiver PID remains 2166041, active, NRestarts=0. Runtime marker and both app/admin symlinks remain `b3195f788e14e393464e93aa9545cc7614a1caaf`. Remote main re-read is still the exact target. The VPS timestamp still precedes the recorded expiry; no expired-state claim is made for this snapshot.

Commit/publication state is recorded in the final response. Report publication, if successful, is to the separate AI-Log repository only; no application branch is pushed.

```text
ROOT_CAUSE = WINDOWS_CORE_AUTOCRLF_TRUE
PACKAGING_DESIGN_BEFORE = SEPARATE_OPERATOR_ARCHIVE_AND_RELEASE_REPACKAGING
PACKAGING_DESIGN_AFTER = PREPARE_ONCE_RETAIN_APPROVE_AND_DELIVER_SAME_BYTES
WORKFLOW_CHANGED = YES_LOCAL_ONLY
GUARD_CHANGED = NO
DETERMINISTIC_ARTIFACT_RESULT = PASS_EXACT_REFERENCE_DIGEST
CLAIM_RECOVERY_PROCEDURE = SPECIFIED_BUT_NOT_IMPLEMENTED_OR_AUTHORIZED
RELEASE_RETRY_ALLOWED = NO
DEPLOYMENT = NO
PRODUCTION_CHANGE = NO
DATABASE_CHANGE = NO
ORDER/POSITION_CHANGE = NO
EXCHANGE_ACTIONS = 0
APPROVAL_CREATED = NO
CLAIM_MODIFIED = NO
```

## Publication addendum

- Local implementation commit: 10075341cdca3782cdd254d784afe39d818f7c0d.
- Application branch: local only, not pushed; main and Production unchanged.
- Publication scope: this sanitized report only, to AI-Log/master.
