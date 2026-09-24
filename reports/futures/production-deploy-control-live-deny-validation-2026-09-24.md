# VPS Guard live DENY validation — preflight blocked, 2026-09-24 UTC

**Final status: VPS-GUARD-DENY-BLOCKED.** Fresh owner approval `APPROVE VPS GUARD LIVE DENY RETRY` was received in this conversation on 2026-09-24, before any attempted service action. The approved live validation was stopped at read-only preflight. No receiver start/stop/enable/disable, TCP readiness probe, HTTP DENY, authorization-helper invocation, deploy, approval creation, application restart, database or exchange action occurred in this attempt. There is no live `401` or `OIDC_MALFORMED` result to claim.

## Blocking evidence

At `2026-09-24T15:39:47Z`, the VPS returned the approved installed SHA-256 values:

| File | SHA-256 | Owner/mode |
| --- | --- | --- |
| `/opt/signalverse/deploy-receiver.mjs` | `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa` | `root:root 644` |
| `/opt/signalverse/release-authorization.mjs` | `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83` | `root:root 644` |
| `/usr/local/sbin/signalverse-deploy` | `572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec` | `root:root 755` |
| `/etc/systemd/system/signalverse-deploy-receiver.service` | `7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1` | `root:root 644` |

Line 9 of the installed receiver was independently read at `2026-09-24T15:43:00Z`: it imports `./signalverse-release-authorization.mjs`; the installed helper is named `/opt/signalverse/release-authorization.mjs` instead. A read-only `stat` at `2026-09-24T15:41:08Z` returned `No such file or directory` for `/opt/signalverse/signalverse-release-authorization.mjs`, while `/opt/signalverse/release-authorization.mjs` was present as a regular 0644 file. A second read-only existence check at `15:43:00Z` likewise confirmed the import target was absent. Thus the installed receiver's relative ESM import target is missing. This is a deterministic static startup prerequisite failure, independent of the previously fixed readiness-wait ordering. No live module import/start was attempted, so an actual runtime exception or successful bind is **not** claimed. The earlier 151 ms start/stop cannot establish that the receiver was otherwise healthy; the premature curl and this packaging/path mismatch must be distinguished.

An attempted read-only module-import diagnostic was denied by the local safety reviewer because evaluating a production module could have top-level effects. It did not run. The diagnosis instead relies on the installed receiver SHA matching the reviewed source plus the VPS filesystem `stat` result. No workaround was attempted.

## Other preflight and final state

- `UMask=0077`; `ReadWritePaths` were only `/var/lib/signalverse-deploy/incoming` and `/var/lib/signalverse-deploy/claims`.
- `approvals`, `revoked`, `claims`, `consumed` were `root:root 0700` and empty in the preflight listing. No approval manifest was created.
- Receiver remained `ActiveState=inactive`, `UnitFileState=disabled`, `MainPID=0`, `NRestarts=0`; loopback port 3002 had no listener at final read. The old push path was not re-enabled. No artifact unit was active/activating/deactivating or queued; one historical failed artifact unit was visible in `list-units --all` and was not activated in this attempt.
- Production marker and app/admin symlinks were all `85aedfb944a67c94227ac343e911bc64a581e79e` at `15:39:47Z` and again at `15:41:08Z` for marker/symlinks. Main/admin/observer PIDs at the final read were `1962862`/`1962858`/`1962856`, each `NRestarts=0`, with start time `2026-09-23 20:58:18 UTC`; these match the prior dated baseline. No application deployment or restart was performed by this attempt. Production DB and exchange state were not queried, so an independent no-change proof for them is not claimed.

## Requested live gates — actual result

| Gate | Result |
| --- | --- |
| Fresh owner approval | Received, 2026-09-24; exact message timestamp not exposed by the tool transcript |
| Global deploy lock | Not acquired; stopped before active validation |
| Receiver readiness / exact READY timestamp | Not run / unavailable |
| Synthetic invalid-bearer HTTP status and body | Not sent / unavailable |
| `OIDC_MALFORMED` | Not observed |
| `AUTHORIZATION_MISSING` | Not run |
| Artifact, claim, consumed side effects | None observed in read-only preflight; no request was sent |
| Receiver final state | Inactive/disabled/PID 0 |
| Old push path final state | Inactive/disabled; not re-enabled |

The safe next step is a **separately reviewed and authorized** control-plane packaging correction that makes the receiver import path and installed helper filename agree, with the four-file hash contract updated/reverified as appropriate. Do not silently rename an installed file, weaken OIDC/approval logic, or use this approval as authority for a repair or another live test. After correction, a new owner-approved DENY validation must prove TCP readiness, HTTP `401` with `OIDC_MALFORMED`, `AUTHORIZATION_MISSING`, and zero deploy side effects. Deployment remains unavailable and no application release was made.

## Commit and publication state

Only this report and `HANDOFF.md` were committed on the existing `codex/production-deploy-control-20260924` branch as documentation with `[skip ci]`; no application code, VPS file, `main` merge/push or Production workflow was changed. The sanitized report was published to `SignalVerse-AI-Log/master`; the final remote commit and matching blob SHA are recorded in the delivery message. Unrelated untracked workspace files were preserved.
