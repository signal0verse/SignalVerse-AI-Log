# VPS Guard installation retry — approval-gated read-only preflight, 2026-09-24 UTC

**Status: WAITING FOR NEW OWNER APPROVAL. NO INSTALLATION OR DENY TEST.** This is a new attempt, distinct from the aborted CRLF attempt. The prior `APPROVE VPS GUARD INSTALLATION` phrase is not authorization for this retry. The required fresh phrase is `APPROVE VPS GUARD INSTALL RETRY`; it had not been received at this checkpoint. No active VPS change is authorized before it arrives.

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
