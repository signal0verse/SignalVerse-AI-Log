# VPS deployment guard installation — READ-ONLY PREFLIGHT, 2026-09-24 UTC

## Decision and safety boundary

**VPS-GUARD-PREFLIGHT-READY, subject to a fresh no-in-flight-deploy check and the owner's exact approval phrase.** This is a preparation report, **not** an installation report. No candidate file was copied to VPS, no authorization was created/revoked, and no unit, symlink, marker, database, exchange account or Production application was changed. No service was stopped, restarted, disabled or reloaded. The current active application is still the unapproved runtime `85aedfb944a67c94227ac343e911bc64a581e79e`; the old push-deploy control plane remains active and vulnerable until a separately approved cutover.

Evidence was collected read-only via direct SSH to the owner-provided VPS IP/key, not via the Cloudflare domain, at approximately `2026-09-24T12:39:23Z`–`12:46Z`. The implementation source is local branch `codex/production-deploy-control-20260924`, implementation commit `677bc19d94cbf64b18a7e80adad68d1f9a967a83`; branch report HEAD before this preflight is `839925301973b93615a2b4974e6f7b0599fec5ed`. Candidate files are unchanged from the implementation commit. The prior offline evidence is 14/14 control test groups passing on local Node 24, not a live Node 22/systemd acceptance test.

Closing read-only verification at `2026-09-24T12:52:45Z` again found the marker and both app/admin links at `85aedfb`, main PID `1962862` with the same `2026-09-23T20:58:18Z` start and `NRestarts=0`, receiver PID `542667` with the same `2026-09-11T06:12:26Z` start and `NRestarts=0`, and unchanged old receiver/coordinator hashes. This preflight did not restart either service or change the runtime.

## 1. Actual VPS and repository state

| Item | Read-only observation |
| --- | --- |
| Active marker | `/var/lib/signalverse-deploy/deployed-sha` = `85aedfb944a67c94227ac343e911bc64a581e79e`; root:root `0640`, mtime `2026-09-23T20:58:20.292879Z` |
| App symlink and process cwd | `/opt/signalverse/app` and live PID `1962862` cwd both resolve to `/opt/signalverse/releases/85aedfb944a67c94227ac343e911bc64a581e79e`; executable `/usr/bin/node` |
| Admin symlink | `/opt/signalverse-admin/app` resolves to `/opt/signalverse-admin/releases/85aedfb944a67c94227ac343e911bc64a581e79e` |
| Main service | active, `Result=success`, PID `1962862`, `NRestarts=0`, process start `2026-09-23T20:58:18Z` |
| Deploy receiver service | active, `Result=success`, PID `542667`, `NRestarts=0`, process start `2026-09-11T06:12:26Z`; listens only on `127.0.0.1:3002` |
| Deploy artifact units | One historical failed instance `eee238bcd3cf437a9233aac3378e8fc6062d3665`, last ran `2026-09-08T22:21:28Z`–`22:24:39Z`, exit 1. No active deploy-artifact instance was listed. A later `systemctl list-jobs` showed an unrelated `signalverse-fast-jobs.service` job, not an artifact deploy. Recheck all units/jobs immediately before an approved cutover. |
| Installed receiver SHA-256 | `a2be21974760cde9fb7658d73787840603fd27410166f3c791c6d1b6142e0e8d` at `/opt/signalverse/deploy-receiver.mjs`, root:root `0644` |
| Installed coordinator SHA-256 | `b3f4f5a6f2698cc7001059e28d7fbf628d40538bb9e4bba758538acc4f453c80` at `/usr/local/sbin/signalverse-deploy`, root:root `0755` |
| Installed receiver unit SHA-256 | `332c381cc0abea82b98b3dc2fbe3f47e38024d70c7ef0f05fc8fa1667b8b792c`, root:root `0644`, enabled |
| Artifact template unit SHA-256 | `1a95022b391deba37bb3b161c6526fc4423f6966904177a8653e5284e52d82a4`; static template, **not** a replacement target |

The installed receiver explicitly requires `event_name='push'` and workflow `production-ci.yml` on main/master, saves the archive in `incoming`, then starts `signalverse-deploy-artifact@<sha>`. Its current unit allows writes to the entire deployment state directory (`ReadWritePaths=/var/lib/signalverse-deploy`, `UMask=0027`). Remote application `main` still resolved to `85aedfb`; its workflow still gives `id-token: write` and has `Package verified source` and `Deliver release to production` steps under `if: github.event_name == 'push'`. GitHub `Production` environment had `protection_rules=[]` and no deployment branch policy; private-repository branch-protection API returned 403, so branch rules were not established.

The approval, revocation, claim and consumed directories are all **ABSENT**. The helper `/opt/signalverse/release-authorization.mjs` is absent. Existing `/var/lib/signalverse-deploy` and `incoming` are root:signalverse `0750`; this satisfies the candidate's root ownership/no group write requirement. `/opt/signalverse` is root:root `0755`, `/opt/signalverse/releases` root:signalverse `0750`, `/opt/signalverse-admin` root:signalverse_admin_code `0750`; installed main release is signalverse:signalverse `0750`, admin release root:signalverse_admin_code `0750`. The candidate installation does not need to modify any application release directory. VPS has Node `v22.23.2`, `/usr/bin/flock` and `/usr/bin/sha256sum`.

## 2. Exact candidate identity and destination

SHA-256 values below are for **committed Git blob bytes at exact commit `677bc19...`**, not possibly CRLF-converted Windows worktree copies. Future staging must use `git archive` from that commit and verify these hashes after transfer and after installation.

| Candidate file | SHA-256 | Future destination | Owner/mode |
| --- | --- | --- | --- |
| `ops/signalverse-deploy-receiver.mjs` | `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa` | `/opt/signalverse/deploy-receiver.mjs` | root:root `0644` |
| `ops/signalverse-release-authorization.mjs` | `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83` | `/opt/signalverse/release-authorization.mjs` | root:root `0644` |
| `ops/signalverse-deploy` | `572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec` | `/usr/local/sbin/signalverse-deploy` | root:root `0755` |
| `ops/signalverse-deploy-receiver.service` | `7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1` | `/etc/systemd/system/signalverse-deploy-receiver.service` | root:root `0644` |

Provision root:root `0700` directories `/var/lib/signalverse-deploy/approvals`, `/revoked`, `/claims`, `/consumed`. The existing `incoming` root:signalverse `0750` can remain unchanged because it has no group/other write. Any later owner-created approval must be root:root `0600`, bind the exact commit and independently computed archive SHA-256, and expire within one hour. **No real approval is part of installation or this preflight.** The receiver candidate writes only `incoming` and `claims`; it must read, not write, approvals/revocations/consumed. The deploy artifact template does not need replacement. Main, admin, observer, jobs, nginx, DB and exchange settings must remain untouched.

## 3. Safe future cutover order — proposal ONLY, not executed

A purely A→B→F file-copy sequence while the old receiver is still listening cannot guarantee safety: a main push could reach it mid-installation. An **A0 quiescence prerequisite** is mandatory. Stage the exact-commit archive and verify hashes before A0, without touching active control files. At the approved maintenance instant:

0. Recheck marker, both links, main PID/start time and no active/queued deploy unit. Stop and **disable only the deploy receiver**, so a reboot during the cutover does not reactivate the old push receiver. Acquire `/run/lock/signalverse-deploy.lock` exclusively and hold it for the entire cutover. Recheck the marker/links/PID after obtaining the lock; if anything changed or a deploy unit owns the lock, **abort before installation**. A request accepted before quiescence may still exist, but cannot pass the held coordinator lock; once released it will face the new authorization gate. Never stop protection/reconciliation or the application.
1. **A:** Create the four root-only authorization directories, with no approval records.
2. **B:** Back up exactly the three old control-plane files (receiver source, coordinator, receiver unit) into a root-only durable directory. Install the committed helper, guarded coordinator, manual-only receiver and candidate receiver unit at the exact paths/modes above. Do not touch any application release or symlink.
3. **C–E:** Verify owners/modes, SHA-256, Node/Bash syntax and `systemd-analyze verify`; run `systemctl daemon-reload` (no service restart). Verify the effective receiver unit has `UMask=0077` and writable paths only `incoming` and `claims`; approvals/revoked/consumed stay outside those paths.
4. **F:** Start only the receiver (it was intentionally stopped); leave it **disabled** until the no-authorization denial test passes. This receiver start is strictly required for the new source/unit to take effect. Do not start/restart the app, admin or observer. If receiver start or sandbox verification fails, stop it and keep it disabled.
5. **G–J:** Recheck main PID/start time/`NRestarts`, marker content and mtime, app/admin symlink target and symlink inode/mtime. Send only an invalid-token POST to loopback `127.0.0.1:3002` for a synthetic unused SHA; expect HTTP 401, no archive/claim/consumed record, no artifact-unit start, no swap, marker change or app restart. Separately call the helper's **read-only** `inspectApproval` for that synthetic SHA; expect `AUTHORIZATION_MISSING`. This test cannot exercise the full OIDC-valid-but-approval-missing HTTP branch without a real manual-workflow token; do not fabricate approval or dispatch CI. Check the journal for rejection and zero new artifact activation. Only after all checks pass, enable the new receiver. Release the lock last.

The existing application stays at `85aedfb...` by checking identity before quiescence, after the lock is held, after the receiver starts and after denial. This is a **future stop-on-mismatch procedure**, not evidence that the installation has occurred. The unavoidable pre-quiescence race is handled by aborting if the old runtime changed before the lock baseline; no installation proceeds against a changed SHA. Until A0, the old push path is still live.

## 4. Exact command plan and rollback boundary

**NOT EXECUTED.** The future operator must run these commands only after the owner sends the exact phrase `APPROVE VPS GUARD INSTALLATION`, reverify the same source hashes and baseline, and stop on any nonzero exit. Local staging must archive the committed Git blobs, not copy Windows CRLF worktree files. The direct IP/key are intentionally omitted from this public report; the final private handoff identifies them.

```powershell
# In C:\Projects\SignalVerse-Main, after separate owner approval only:
git archive --format=tar --output=tmp\sv-guard-677bc19.tar 677bc19d94cbf64b18a7e80adad68d1f9a967a83 ops/signalverse-deploy-receiver.mjs ops/signalverse-release-authorization.mjs ops/signalverse-deploy ops/signalverse-deploy-receiver.service
# Verify the archive's exact four entries locally, then transfer it by the owner-provided direct-IP SSH key to /var/tmp/sv-guard-677bc19.tar. Never push main.
```

```bash
# Future root shell on VPS only; NOT EXECUTED in this preflight.
set -euo pipefail
sv_expected_sha=85aedfb944a67c94227ac343e911bc64a581e79e
sv_probe_sha=ffffffffffffffffffffffffffffffffffffffff
sv_before_marker="$(cat /var/lib/signalverse-deploy/deployed-sha)"
sv_before_marker_stat="$(stat -c '%i:%Y' /var/lib/signalverse-deploy/deployed-sha)"
sv_before_app="$(readlink -f /opt/signalverse/app)"
sv_before_app_stat="$(stat -c '%i:%Y' /opt/signalverse/app)"
sv_before_admin="$(readlink -f /opt/signalverse-admin/app)"
sv_before_admin_stat="$(stat -c '%i:%Y' /opt/signalverse-admin/app)"
sv_before_main="$(systemctl show signalverse.service -p MainPID -p ExecMainStartTimestamp -p NRestarts)"
sv_before_admin_service="$(systemctl show signalverse-admin.service -p MainPID -p ExecMainStartTimestamp -p NRestarts)"
sv_before_observer_service="$(systemctl show signalverse-observer.service -p MainPID -p ExecMainStartTimestamp -p NRestarts)"
sv_before_receiver_pid="$(systemctl show signalverse-deploy-receiver.service -p MainPID --value)"
test "$sv_before_marker" = "$sv_expected_sha"
test "$sv_before_app" = "/opt/signalverse/releases/$sv_expected_sha"
test "$sv_before_admin" = "/opt/signalverse-admin/releases/$sv_expected_sha"
sv_guard_stage="$(mktemp -d /var/tmp/sv-guard-677bc19.XXXXXX)"
sv_entries="$(tar -tf /var/tmp/sv-guard-677bc19.tar)"
test "$sv_entries" = "$(printf 'ops/\nops/signalverse-deploy\nops/signalverse-deploy-receiver.mjs\nops/signalverse-deploy-receiver.service\nops/signalverse-release-authorization.mjs')"
tar -tvf /var/tmp/sv-guard-677bc19.tar | awk 'substr($1,1,1)!="-" && substr($1,1,1)!="d" {exit 1}'
tar -xf /var/tmp/sv-guard-677bc19.tar -C "$sv_guard_stage" --no-same-owner --no-same-permissions
printf '%s  %s\n' \
  c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa "$sv_guard_stage/ops/signalverse-deploy-receiver.mjs" \
  acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83 "$sv_guard_stage/ops/signalverse-release-authorization.mjs" \
  572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec "$sv_guard_stage/ops/signalverse-deploy" \
  7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1 "$sv_guard_stage/ops/signalverse-deploy-receiver.service" \
  | sha256sum --check --status -
systemctl stop signalverse-deploy-receiver.service
systemctl disable signalverse-deploy-receiver.service
exec 8>/run/lock/signalverse-deploy.lock
flock -x -n 8 || exit 1
test "$(cat /var/lib/signalverse-deploy/deployed-sha)" = "$sv_before_marker"
test "$(readlink -f /opt/signalverse/app)" = "$sv_before_app"
test "$(readlink -f /opt/signalverse-admin/app)" = "$sv_before_admin"
test "$(systemctl show signalverse.service -p MainPID -p ExecMainStartTimestamp -p NRestarts)" = "$sv_before_main"
test "$(systemctl show signalverse-admin.service -p MainPID -p ExecMainStartTimestamp -p NRestarts)" = "$sv_before_admin_service"
test "$(systemctl show signalverse-observer.service -p MainPID -p ExecMainStartTimestamp -p NRestarts)" = "$sv_before_observer_service"
test -z "$(systemctl list-units --all --plain --no-legend 'signalverse-deploy-artifact@*.service' | awk '$3=="active" || $3=="activating" || $3=="deactivating" {print $1}')"
test -z "$(systemctl list-jobs --plain --no-legend | awk '/signalverse-deploy-artifact@/ {print $2}')"
install -d -o root -g root -m 0700 /var/lib/signalverse-deploy/approvals /var/lib/signalverse-deploy/revoked /var/lib/signalverse-deploy/claims /var/lib/signalverse-deploy/consumed
install -d -o root -g root -m 0700 /var/lib/signalverse-deploy/control-backups /var/lib/signalverse-deploy/control-backups/677bc19
install -o root -g root -m 0644 /opt/signalverse/deploy-receiver.mjs /var/lib/signalverse-deploy/control-backups/677bc19/deploy-receiver.mjs
install -o root -g root -m 0755 /usr/local/sbin/signalverse-deploy /var/lib/signalverse-deploy/control-backups/677bc19/signalverse-deploy
install -o root -g root -m 0644 /etc/systemd/system/signalverse-deploy-receiver.service /var/lib/signalverse-deploy/control-backups/677bc19/signalverse-deploy-receiver.service
install -o root -g root -m 0644 "$sv_guard_stage/ops/signalverse-release-authorization.mjs" /opt/signalverse/release-authorization.mjs
install -o root -g root -m 0755 "$sv_guard_stage/ops/signalverse-deploy" /usr/local/sbin/signalverse-deploy
install -o root -g root -m 0644 "$sv_guard_stage/ops/signalverse-deploy-receiver.mjs" /opt/signalverse/deploy-receiver.mjs
install -o root -g root -m 0644 "$sv_guard_stage/ops/signalverse-deploy-receiver.service" /etc/systemd/system/signalverse-deploy-receiver.service
cmp -s "$sv_guard_stage/ops/signalverse-deploy-receiver.mjs" /opt/signalverse/deploy-receiver.mjs
cmp -s "$sv_guard_stage/ops/signalverse-release-authorization.mjs" /opt/signalverse/release-authorization.mjs
cmp -s "$sv_guard_stage/ops/signalverse-deploy" /usr/local/sbin/signalverse-deploy
cmp -s "$sv_guard_stage/ops/signalverse-deploy-receiver.service" /etc/systemd/system/signalverse-deploy-receiver.service
sha256sum /opt/signalverse/deploy-receiver.mjs /opt/signalverse/release-authorization.mjs /usr/local/sbin/signalverse-deploy /etc/systemd/system/signalverse-deploy-receiver.service
/usr/bin/node --check /opt/signalverse/deploy-receiver.mjs
/usr/bin/node --check /opt/signalverse/release-authorization.mjs
bash -n /usr/local/sbin/signalverse-deploy
systemd-analyze verify /etc/systemd/system/signalverse-deploy-receiver.service
systemctl daemon-reload
systemctl show signalverse-deploy-receiver.service -p ReadWritePaths -p UMask -p ExecStart
test "$(systemctl show signalverse-deploy-receiver.service -p UMask --value)" = 0077
test "$(systemctl show signalverse-deploy-receiver.service -p ReadWritePaths --value)" = '/var/lib/signalverse-deploy/incoming /var/lib/signalverse-deploy/claims'
systemctl start signalverse-deploy-receiver.service
test "$(systemctl is-active signalverse-deploy-receiver.service)" = active
test "$(systemctl show signalverse-deploy-receiver.service -p MainPID --value)" != "$sv_before_receiver_pid"
test ! -e "/var/lib/signalverse-deploy/incoming/$sv_probe_sha.tar.gz"
sv_deny_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
sv_http="$(curl --silent --show-error --max-time 10 --output /dev/null --write-out '%{http_code}' --request POST "http://127.0.0.1:3002/_deploy/$sv_probe_sha" --header 'Authorization: Bearer invalid' --header 'Content-Type: application/gzip' --data-binary 'invalid')"
test "$sv_http" = 401
/usr/bin/node --input-type=module -e 'import {inspectApproval,PRODUCTION_STATE} from "/opt/signalverse/release-authorization.mjs"; try { inspectApproval(PRODUCTION_STATE,"ffffffffffffffffffffffffffffffffffffffff"); process.exitCode=1; } catch (error) { if(error.reason!=="AUTHORIZATION_MISSING") process.exitCode=2; else console.log(error.reason); }'
test ! -e "/var/lib/signalverse-deploy/incoming/$sv_probe_sha.tar.gz"
test ! -e "/var/lib/signalverse-deploy/claims/$sv_probe_sha.json"
test "$(cat /var/lib/signalverse-deploy/deployed-sha)" = "$sv_before_marker"
test "$(stat -c '%i:%Y' /var/lib/signalverse-deploy/deployed-sha)" = "$sv_before_marker_stat"
test "$(readlink -f /opt/signalverse/app)" = "$sv_before_app"
test "$(stat -c '%i:%Y' /opt/signalverse/app)" = "$sv_before_app_stat"
test "$(readlink -f /opt/signalverse-admin/app)" = "$sv_before_admin"
test "$(stat -c '%i:%Y' /opt/signalverse-admin/app)" = "$sv_before_admin_stat"
test "$(systemctl show signalverse.service -p MainPID -p ExecMainStartTimestamp -p NRestarts)" = "$sv_before_main"
test "$(systemctl show signalverse-admin.service -p MainPID -p ExecMainStartTimestamp -p NRestarts)" = "$sv_before_admin_service"
test "$(systemctl show signalverse-observer.service -p MainPID -p ExecMainStartTimestamp -p NRestarts)" = "$sv_before_observer_service"
test -z "$(systemctl list-units --all --plain --no-legend 'signalverse-deploy-artifact@*.service' | awk '$3=="active" || $3=="activating" || $3=="deactivating" {print $1}')"
journalctl -u signalverse-deploy-receiver.service --since "$sv_deny_at" --no-pager -o short-iso
journalctl --quiet -u signalverse-deploy-receiver.service --since "$sv_deny_at" --no-pager -o cat | grep -F '"reason":"OIDC_MALFORMED"' >/dev/null
test -z "$(journalctl --quiet -u "signalverse-deploy-artifact@$sv_probe_sha.service" --since "$sv_deny_at" --no-pager -o cat)"
systemctl enable signalverse-deploy-receiver.service
flock -u 8
exec 8>&-
```

The exact denial request is a loopback POST with an invalid bearer and synthetic SHA, **not** a trade or a valid owner authorization. Its expected HTTP result is 401; if it returns 202 or starts an artifact unit, stop immediately. A separate read-only helper inspection must return `AUTHORIZATION_MISSING`. The operator must record baseline and after values for marker SHA/mtime, app/admin link target/inode/mtime, main PID/start timestamp/`NRestarts` and deploy-unit journal. A 401 alone does not prove the approval branch; that limitation is explicit.

**Control-plane-only rollback if any step fails:** stop and leave the receiver **disabled**, hold or reacquire the deploy lock, restore only the three backed-up control files and reload systemd if needed. Preserve authorization/claim/consumed files for audit; do not clear them. Do **not** start the old push-accepting receiver as part of rollback, and do not touch app/admin symlinks or restart application/protection services. The resulting safe state is temporarily unavailable deployment, not restored automatic push delivery. An operator needs separate approval for any later receiver reactivation.

```bash
# Future failure rollback ONLY in a fresh root shell after the cutover shell exits; NOT EXECUTED.
systemctl stop signalverse-deploy-receiver.service
systemctl disable signalverse-deploy-receiver.service
exec 8>/run/lock/signalverse-deploy.lock
flock -x -n 8 || exit 1
test -s /var/lib/signalverse-deploy/control-backups/677bc19/deploy-receiver.mjs
test -s /var/lib/signalverse-deploy/control-backups/677bc19/signalverse-deploy
test -s /var/lib/signalverse-deploy/control-backups/677bc19/signalverse-deploy-receiver.service
install -o root -g root -m 0644 /var/lib/signalverse-deploy/control-backups/677bc19/deploy-receiver.mjs /opt/signalverse/deploy-receiver.mjs
install -o root -g root -m 0755 /var/lib/signalverse-deploy/control-backups/677bc19/signalverse-deploy /usr/local/sbin/signalverse-deploy
install -o root -g root -m 0644 /var/lib/signalverse-deploy/control-backups/677bc19/signalverse-deploy-receiver.service /etc/systemd/system/signalverse-deploy-receiver.service
systemctl daemon-reload
# Do NOT start/enable the restored old receiver. Keep deployment unavailable.
# Preserve approvals, claims, revocations, consumed records and staged evidence.
# Verify application marker, both symlinks and main/admin/observer process identity.
flock -u 8
exec 8>&-
```

## 5. Result fields required after a future approved installation

Installed hashes, actual file modes, exact actions/timestamps, service stop/start, live denial HTTP and helper results, before/after runtime SHA, marker/link inode+mtime, main PID/start/restart count, artifact-unit journal and GitHub reviewer settings are **NOT APPLICABLE — NOT INSTALLED** in this preflight. The current old hashes and runtime baseline are recorded above. Consequently, merging the branch into application `main` is **NOT YET SAFE**. A later installation/denial report must fill these fields from live evidence; no result may be inferred from this plan or the previous 14 offline test groups.

VPS-GUARD-PREFLIGHT-READY
