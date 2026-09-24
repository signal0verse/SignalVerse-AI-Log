# VPS Guard release-path repair and validation

## Update 2026-09-25 — authorized repair; overall release path BLOCKED

- Application report commit: `45dcbec74023cad0a698f211ab10ab950b9abdec` on `codex/production-deploy-control-20260924` (documentation only; no application `main` push).
- Owner supplied the exact fresh approval message `APPROVE VPS GUARD RELEASE PATH REPAIR` before VPS control-plane modification.
- **Final status: VPS-GUARD-REPAIR-BLOCKED.** The receiver import path was made internally consistent and safe DENY validation passed. The complete manual secure-release route is still unavailable because remote `main` remains `85aedfb944a67c94227ac343e911bc64a581e79e`, with only the old push/deploy `production-ci.yml` and without the `production-release.yml` required by Guard OIDC. No workflow/main/application deployment was performed. The receiver was stopped and left disabled after the test.

### Confirmed root cause and exact change

Read-only VPS forensics at `2026-09-24T19:07–19:11Z` confirmed that the installed receiver imports `./signalverse-release-authorization.mjs`, while the reviewed installer had placed the same authorization helper at `/opt/signalverse/release-authorization.mjs` (also used by the coordinator). The expected relative import target was absent. The previous aborted cutover had left the receiver inactive/disabled; its earlier 151-ms start/stop was not proof of healthy execution.

Under the global deploy lock, after verifying Production marker/symlinks, disabled receiver, exact hashes and no active/queued artifact unit, the only lasting VPS control-plane path added was root-owned `/opt/signalverse/signalverse-release-authorization.mjs` → relative symlink `release-authorization.mjs`. The target remains root:root 0644 and SHA-256 `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83`; the parent directory is root:root 0755 and cannot be modified by non-root. Symlink mode 0777 is conventional and does not grant write access to the target/parent. Receiver SHA remained `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa`; coordinator/unit hashes also remained their approved values. No existing VPS file was overwritten.

Backups of the receiver, helper and unit were preserved byte-for-byte in `/var/lib/signalverse-deploy/control-backups/guard-path-repair-20260925/` (root:root 0700 directory; original file modes). A verified temporary loopback readiness probe was staged and removed after validation; no temporary test file remains.

### Actual tests and final state

| Gate | Evidence |
|---|---|
| Local offline security/readiness suite | 18/18 PASS; wrong/missing SHA approval, digest mismatch, expiry, revocation, replay/consumption, wrong ref/branch, non-manual workflow and unauthorized admission exercised in disposable fixtures |
| Node/Bash/systemd validation | Receiver/helper `node --check`, coordinator `bash -n`, unit `systemd-analyze verify`: PASS |
| Installed helper missing approval | `AUTHORIZATION_MISSING`, exit 1, no artifact/claim |
| Bounded receiver readiness | Started `2026-09-24T19:16:27Z`; ready `19:16:27.943Z` after 206 ms/2 attempts; listener only `127.0.0.1:3002`, PID `2083350`, restarts 0 during test |
| Harmless malformed requests | Missing bearer: HTTP 401. `Bearer invalid`: HTTP 401, `OIDC_MALFORMED`; journal matched at `19:17:12Z` |
| No deploy side effect | No synthetic claim/artifact, approvals/claims/consumed stayed 0, historical incoming count stayed 230, no active/queued artifact unit |
| Final guard state | Stopped/disabled at `19:18:47Z`; final `inactive/disabled`, PID 0, NRestarts 0, no port-3002 listener |
| Final application state | At `19:19:24Z`, marker/app/admin symlinks still `85aedfb944a67c94227ac343e911bc64a581e79e` with original inode/mtime; main/admin/observer PIDs `1962862`/`1962858`/`1962856`, restarts 0 |

No valid OIDC token, approval manifest, authorized release request, artifact admission, app deployment, DB query/write, exchange API call, order, position, leverage or Strategy/Spot/Demo change occurred. No private-account or DB-state reconciliation is claimed. `git diff --check` for the documentation-only application report/handoff passed. The original user's unrelated untracked workspace files were preserved.

Rollback if separately directed: leave receiver stopped/disabled, acquire global deploy lock, verify the exact root-owned relative symlink and target/backup hashes, remove only that newly added symlink, and preserve existing files/backups. This returns the old disabled state; **never** re-enable the old push receiver. A separately reviewed/authorized manual workflow and GitHub Environment reviewer rollout is required before the complete secure release path can be called ready. Do not push/merge `main` through its old push-deploy workflow merely to add it; no Stage 1B deployment is authorized by this report.

---

## Historical authorization-gate report

## Metadata

- Date: 2026-09-25 (Asia/Kuala_Lumpur)
- Task ID: secure Production release-path repair
- Module: VPS Guard control plane
- Mode: authorization-gated; documentation only
- Repository: `signal0verse/signalverse-main`
- Branch: `codex/production-deploy-control-20260924`
- Starting commit: `da5cf68b52a9a721d87d0477232bd41bd5f79cad`
- Ending commit: `6cc5bfede218c8310cd8886d07db5c042624200a`
- Final status: **VPS-GUARD-REPAIR-AWAITING-AUTHORIZATION**

## Objective, scope and finding

The owner requested repair and safe validation of only the Guard release path, with no application deployment or trading. The task explicitly required a fresh, separate owner authorization message before **any** VPS control-plane modification. No such approval message was received. The approval phrase appearing in the task text is a condition, not authorization. Work stopped at the gate; no fresh VPS forensics, repair, service start, readiness or rejection test was performed.

Historical read-only evidence from `2026-09-24T18:25:42Z` showed deployed marker and app/admin symlinks on `85aedfb944a67c94227ac343e911bc64a581e79e`, with main/admin/observer active. The Guard receiver was inactive/disabled with PID 0 and no port-3002 listener at the preceding check. Prior inspection found the receiver-adjacent helper filename absent while a differently named helper existed. These are **not** a fresh measurement or complete root-cause analysis. Exact import path, installed hashes, ownership, sandbox, backups and journal require the requested read-only forensics before a minimal repair can be selected. No rename or workaround was assumed.

## Actions, changes and tests

Only `HANDOFF.md` and `reports/security/vps-guard-release-path-repair-2026-09-25.md` were changed locally as documentation; `git diff --check` passed and they were committed with `[skip ci]` on the development branch. Application `main` was not merged/pushed. No VPS file, backup, service, Production runtime, DB, exchange, credential, Strategy, Risk, Supervisor, scheduler, Spot or Demo was changed by this task. No application deployment, order, position or exchange write occurred.

| Item | Result |
|---|---|
| Root cause | NOT DETERMINED in this turn |
| VPS files changed / backups | NONE / NONE |
| Node/systemd/authorization tests | NOT RUN |
| Receiver readiness / invalid-request rejection | NOT RUN |
| Current Guard state and Production SHA | NOT FRESHLY VERIFIED; prior state only |
| Rollback | NOT APPLICABLE; no VPS modification |

## Limitations and next step

Do not treat the prior SHA or service state as current. The owner must send the exact fresh authorization as a new message. An authorized follow-up should first complete read-only Phase 0 forensics, then present exact proposed file changes and rollback before any VPS write. Do not revive the old receiver, bypass Guard or deploy Stage 1B as part of this repair task.
