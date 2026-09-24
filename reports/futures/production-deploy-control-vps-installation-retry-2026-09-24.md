# VPS Guard installation retry — stopped at DENY connectivity, 2026-09-24 UTC

> **FINAL STATUS: VPS-GUARD-INSTALL-BLOCKED.** The owner provided the fresh exact phrase `APPROVE VPS GUARD INSTALL RETRY`. The LF package passed Linux staging checks and the control-plane files were installed, but the first invalid-bearer DENY request received **no HTTP response**: `curl` exited 7 because no listener was yet reachable at `127.0.0.1:3002`. The run stopped immediately; the new receiver was stopped and disabled, and the old push receiver was **not** re-enabled. No retry, valid authorization, application deploy, main merge/push, Production CI, DB or exchange action occurred. The `401` and helper `AUTHORIZATION_MISSING` gates are **NOT VERIFIED**. The old push path is closed only because the receiver is disabled; deployment is currently unavailable, not safely validated.

The following section records the **earlier approval-gated read-only checkpoint**, before the owner supplied the fresh approval. Its statements that installation had not occurred were true only at that checkpoint and are superseded by the final result above and the installation evidence below. This is a new attempt, distinct from the aborted CRLF attempt; the prior `APPROVE VPS GUARD INSTALLATION` phrase was not reused.

Source branch: `codex/production-deploy-control-20260924`. Candidate source commit: `677bc19d94cbf64b18a7e80adad68d1f9a967a83`. Local package `tmp/guard-package-677bc19/guard-677bc19-lf.tar` is 30,720 bytes and its read-only SHA-256 check equals `5a491d635c1018ef86f360a3ce2cfbb0c0444b8aa674dff48bc07f79a4fde352`. The owner states an independent Linux verification has completed; the underlying Linux test log was not supplied in this request, so this preflight does not present it as independently reviewed evidence. Any later installation must verify the package and each extracted file afresh on VPS staging before touching active files.

At `2026-09-24T14:08:45Z`, a read-only direct VPS check found:

| Item | Observation |
| --- | --- |
| Production marker | `85aedfb944a67c94227ac343e911bc64a581e79e` |
| Main symlink | `/opt/signalverse/releases/85aedfb944a67c94227ac343e911bc64a581e79e` |
| Admin symlink | `/opt/signalverse-admin/releases/85aedfb944a67c94227ac343e911bc64a581e79e` |
| Main | active, PID `1962862`, start `2026-09-23 20:58:18 UTC`, `NRestarts=0` |
| Admin | active, PID `1962858`, same start, `NRestarts=0` |
| Observer | active, PID `1962856`, same start, `NRestarts=0` |
| Old push receiver | active/enabled, PID `542667`, start `2026-09-11 06:12:26 UTC`, `NRestarts=0` |
| Active/queued deploy artifact | none listed by `systemctl list-units`/`list-jobs` at this instant; must be rechecked under the global lock |
| Old receiver/control hashes | receiver `a2be21974760cde9fb7658d73787840603fd27410166f3c791c6d1b6142e0e8d`; coordinator `b3f4f5a6f2698cc7001059e28d7fbf628d40538bb9e4bba758538acc4f453c80`; receiver unit `332c381cc0abea82b98b3dc2fbe3f47e38024d70c7ef0f05fc8fa1667b8b792c` |

The required LF file hashes for the future retry are receiver `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa`, authorization helper `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83`, coordinator `572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec`, and receiver unit `7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1`. These are expected candidate values, **not installed-file results**. The old CRLF archive must not be reused. No package has been uploaded or extracted on VPS for this retry.

After fresh approval only: verify archive/hash/zero CR/BOM/mode/Node/Bash/systemd on VPS staging; acquire the global deploy lock; recheck marker, both links, all process identities and artifact units; stop and disable only the old push receiver; verify inactive and recheck while locked; provision root-only control directories and backup; replace only verified control-plane files; verify installed hashes and sandbox; start only the new receiver; test only an invalid-bearer DENY and helper `AUTHORIZATION_MISSING`; prove no artifact acceptance/activation or main/admin/observer restart and unchanged runtime/links/marker. Stop on the first failed check, leave the new receiver disabled, never re-enable the old push receiver automatically, and do not improvise rollback. No real approval manifest, valid release test, application deployment, Production CI, main merge/push, DB, exchange or trading action is allowed.

Pending result fields: installed hashes/permissions; old receiver stop/disable; new receiver activation; HTTP DENY response; helper rejection; artifact/unit activation; before/after inode/mtime, PIDs and restarts; GitHub Environment reviewer completion; closure of the old push path. **None is claimed at this approval checkpoint.** GitHub Environment reviewer configuration remains a separate gate. Merging the application branch into `main` is still unsafe while the old push receiver is active.

## Freshly approved execution and Linux staging evidence

At `2026-09-24T14:32:26Z`, just before upload, a read-only VPS check again found the `85aedfb944a67c94227ac343e911bc64a581e79e` marker and both matching links, old receiver active/enabled at PID `542667`, no active/queued artifact, and unused new staging/backup paths. The new local archive was uploaded **only** to `/var/tmp/guard-677bc19-lf.tar`. Its VPS SHA-256 was `5a491d635c1018ef86f360a3ce2cfbb0c0444b8aa674dff48bc07f79a4fde352`, size `30,720` bytes. It was extracted into `/var/tmp/guard-677bc19-lf.stage`; the previous CRLF archive was not reused.

VPS staging validation ran at `14:34:19Z`–`14:34:20Z` under Linux. Exact four-entry tar listing, regular-file types, SHA-256, owner/mode, byte size, zero CR, exact LF count, no UTF-8/UTF-16 BOM, both Node `--check`, Bash `-n`, and `systemd-analyze verify` all passed. Extracted coordinator was root:root `0755`; the other three files root:root `0644`.

| File | Extracted and installed SHA-256 | Bytes | CR/LF/BOM | Installed owner/mode |
| --- | --- | ---: | --- | --- |
| Receiver | `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa` | 8,601 | `0/151/none` | root:root `0644` |
| Authorization helper | `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83` | 7,324 | `0/136/none` | root:root `0644` |
| Coordinator | `572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec` | 9,973 | `0/172/none` | root:root `0755` |
| Receiver unit | `7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1` | 889 | `0/33/none` | root:root `0644` |

Installed-file hashes above were re-read independently at `14:38:09Z`; the installation script had already checked exact owners/modes, installed hashes, `systemd-analyze verify`, effective `UMask=0077`, and `ReadWritePaths` limited to `incoming` and `claims` before starting the new receiver. `approvals`, `revoked`, `claims`, `consumed`, `control-backups`, and `control-backups/677bc19-lf` were created root:root `0700`. The four authorization directories were confirmed empty; no real approval, revocation, claim or consumption was created. Three old control-plane files were preserved in the backup directory with their previous SHA-256 values `a2be2197...`, `b3f4f5a6...`, and `332c381c...`. They were **not** restored or reactivated after failure.

## Cutover chronology and exact failure

The install script began at `2026-09-24T14:37:36Z`, acquired `/run/lock/signalverse-deploy.lock` exclusively, and checked marker/link inode+mtime, main/admin/observer identities and zero active/queued deploy artifacts while holding it. Baseline marker was `85aedfb944a67c94227ac343e911bc64a581e79e`, inode `609128`, mtime `2026-09-23 20:58:20.292879592 +0000`, size `41`. App link inode/mtime was `608973`/`2026-09-23 20:58:18.681895231 +0000`; admin link `8506584`/`2026-09-23 20:58:18.696895085 +0000`. Main/admin/observer PIDs were `1962862`/`1962858`/`1962856`, all started `2026-09-23 20:58:18 UTC`, `NRestarts=0`. The old receiver PID was `542667`.

Under the lock, only the old push receiver was stopped and disabled by `14:37:37Z`; it was verified inactive with `MainPID=0`. Runtime and artifact checks repeated successfully. The verified control-plane files and root-only directories were then installed; the unit was reloaded without restarting main/admin/observer. The **new receiver** was started at `14:37:39Z`, briefly active with PID `2058985` and still **disabled** pending DENY acceptance.

The first loopback POST used synthetic SHA `ffffffffffffffffffffffffffffffffffffffff` and `Authorization: Bearer invalid`. It failed immediately with `curl: (7) Failed to connect to 127.0.0.1 port 3002`; **there was no HTTP status or response body**. The script exited nonzero at `14:37:39Z` and its failure handler stopped/disabled the receiver. Two `GUARD_RETRY_FAILED` lines arose from the shell error trap on the same failed `curl`, **not two DENY attempts**. Journal records a systemd start and immediate intentional stop, with no `READY` or rejection audit event between them. A startup-readiness race is plausible, but the journal cannot prove that was the sole cause; do not call this a successful rejection or an engine defect. The helper `AUTHORIZATION_MISSING` step was never reached and was **not** run separately after the stop. No attempt to retry or modify startup timing was made.

Read-only final audit at `2026-09-24T14:38:09Z`–`14:38:43Z` showed receiver `inactive/dead`, `disabled`, `MainPID=0`, `NRestarts=0`, `Result=success`, `ExecMainStatus=15` from the deliberate stop. `ss` showed **no listener** on `3002`. The four root-only authorization directories each had zero entries; synthetic incoming archive and claim were absent; the synthetic artifact unit had no journal entries. The one old artifact instance remained historical `failed`, not active. **No artifact was accepted or activated in this attempt**, but that is not proof that the new guard's HTTP authorization path works.

Marker content, inode, nanosecond mtime and size stayed unchanged; both app/admin link targets, inode and nanosecond mtime stayed unchanged. Main/admin/observer remained active with the same respective PIDs `1962862`/`1962858`/`1962856`, same start timestamp and `NRestarts=0`. Active application runtime remained exactly `85aedfb944a67c94227ac343e911bc64a581e79e`. No application deployment or restart occurred. No database, exchange, credentials or Real trading action occurred.

## Release-control consequence and next step

**VPS-GUARD-INSTALL-BLOCKED.** The control files are installed with correct hashes, but the receiver is intentionally disabled and no live `401`/`AUTHORIZATION_MISSING` verification exists. The old automatic Push entry point is closed **while the unit remains disabled**, at the cost of deployment unavailability. Do not re-enable the old receiver or merge/push application `main`. GitHub Production Environment reviewer configuration remains separately required and was not changed or freshly audited in this attempt.

The next task should first diagnose receiver readiness **read-only/offline** using the preserved journal, installed unit/source and a safe local or isolated reproduction. Any new receiver start, repeated DENY request, timing change, rollback or installation retry requires fresh owner direction. Preserve the staged package, backups, installed files, empty authorization directories and evidence; do not improvise rollback or create a valid approval.
