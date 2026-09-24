# SignalVerse VPS Guard receiver startup diagnosis — read-only, 2026-09-24 UTC

## Final decision

**RECEIVER-STARTUP-CAUSE-UNRESOLVED.** The evidence identifies a concrete **test-orchestration/readiness defect**: the cutover script treated `systemctl start` plus `ActiveState=active` on a `Type=simple` unit as proof that the TCP listener was ready and sent the invalid-bearer request immediately. The process was intentionally stopped only about **152 ms** after systemd recorded it as started. There is no receiver `READY` audit record or Node exception in the journal. This explains why the prior `curl (7)` result cannot be called an authorization failure, but it does **not** prove whether the receiver would have bound successfully after more time. No receiver start, HTTP request, deployment or repair was performed in this diagnostic task; latent bind, sandbox or runtime trouble cannot be ruled out without a separately authorized supervised start.

The previous control-plane installation remains **VPS-GUARD-INSTALL-BLOCKED**. The new files are installed, but the receiver is intentionally **inactive and disabled**; the old push implementation was not re-enabled. There is no listener on port `3002` at the final read-only check. No live `401` or helper `AUTHORIZATION_MISSING` test has passed. Merging or pushing application `main` remains unsafe; deployment is unavailable while the receiver stays disabled.

## Exact unit and current state

Read-only evidence was collected by direct SSH at `2026-09-24T14:48:10Z`–`14:50:08Z`. `systemctl status` reported loaded unit `/etc/systemd/system/signalverse-deploy-receiver.service`, `disabled`, `inactive (dead)` since `14:37:39Z`, prior `Duration: 151ms`, `Main PID: 2058985 (code=killed, signal=TERM)`, CPU `187ms`. Effective `systemctl show` values:

| Property | Value |
| --- | --- |
| `LoadState` / `ActiveState` / `SubState` | `loaded` / `inactive` / `dead` |
| `Result` / `ExecMainCode` / `ExecMainStatus` | `success` / `2` (killed) / `15` (SIGTERM) |
| `MainPID` / `NRestarts` | `0` / `0` |
| `ExecMainStartTimestamp` / `ExecMainExitTimestamp` | both `Thu 2026-09-24 14:37:39 UTC` |
| `ExecStart` | `/usr/bin/node /opt/signalverse/deploy-receiver.mjs` |
| `Type` / `Restart` / `RestartSec` | `simple` / `on-failure` / `3` |
| `Environment` / `UMask` | `PORT=3002` / `0077` |
| `User` / `Group` | `root` / `root` |
| `ReadWritePaths` | `/var/lib/signalverse-deploy/incoming /var/lib/signalverse-deploy/claims` |
| Sandbox | `PrivateTmp=yes`, `PrivateDevices=yes`, `ProtectSystem=strict`, `ProtectHome=yes`, `ProtectKernelTunables=yes`, `ProtectKernelModules=yes`, `ProtectControlGroups=yes`, `NoNewPrivileges=yes`, `LockPersonality=yes`, `RestrictSUIDSGID=yes`, `RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX` |
| Limits / drop-ins | `MemoryMax=268435456`, `TasksMax=64`, no drop-ins |

`systemctl cat` matched the installed unit: no additional override was found. `ss -lntp '( sport = :3002 )'` showed **no listener at the current stopped state**. This is expected with the unit disabled and does not reconstruct the exact socket state during the 151 ms prior run.

## Verbatim startup-window journal and process evidence

The complete relevant `journalctl -u signalverse-deploy-receiver.service --since '2026-09-24 14:37:25 UTC' --until '2026-09-24 14:37:50 UTC' -o short-precise` output was:

```text
Sep 24 14:37:36.765748 vmi3541699 systemd[1]: Stopping signalverse-deploy-receiver.service - SignalVerse GitHub OIDC deployment receiver...
Sep 24 14:37:36.790403 vmi3541699 systemd[1]: signalverse-deploy-receiver.service: Deactivated successfully.
Sep 24 14:37:36.791866 vmi3541699 systemd[1]: Stopped signalverse-deploy-receiver.service - SignalVerse GitHub OIDC deployment receiver.
Sep 24 14:37:36.792539 vmi3541699 systemd[1]: signalverse-deploy-receiver.service: Consumed 1min 11.146s CPU time, 45.9M memory peak, 0B memory swap peak.
Sep 24 14:37:39.260771 vmi3541699 systemd[1]: Started signalverse-deploy-receiver.service - SignalVerse GitHub OIDC deployment receiver with independent release approval.
Sep 24 14:37:39.412571 vmi3541699 systemd[1]: Stopping signalverse-deploy-receiver.service - SignalVerse GitHub OIDC deployment receiver with independent release approval...
Sep 24 14:37:39.431008 vmi3541699 systemd[1]: signalverse-deploy-receiver.service: Deactivated successfully.
Sep 24 14:37:39.431381 vmi3541699 systemd[1]: Stopped signalverse-deploy-receiver.service - SignalVerse GitHub OIDC deployment receiver with independent release approval.
```

There is **no startup-failure line or error text** from Node/systemd in that window to capture. A second read-only query for `_PID=2058985` in the same window returned `-- No entries --`. The receiver's `server.listen(..., '127.0.0.1', () => audit({ validation: 'READY', ... }))` callback at `ops/signalverse-deploy-receiver.mjs:148-150` emitted no `READY` entry before the stop. The earlier installer output records `curl: (7) Failed to connect to 127.0.0.1 port 3002 after 0 ms: Couldn't connect to server`, then the failure handler stopped/disabled the unit. Because the process was killed by the handler (SIGTERM) and systemd reports `Result=success`, this is **not** evidence of a Node crash or failed systemd start.

The cutover script preserved on VPS at `/var/tmp/sv-guard-retry-install-677bc19.sh:136-146` shows the sequencing defect precisely: `systemctl start`, `ActiveState=active` and PID checks, then an immediate `curl` POST, with no bounded wait for `READY` or TCP readiness. `Type=simple` only confirms process launch, not that `server.listen` has completed. The `Started`→`Stopping` interval was `151.800 ms`. This is category **G: other — premature readiness assumption in the installation test** for the observed `curl (7)`. Categories A–F have no affirmative failure evidence, but cannot all be ruled out for a longer run; therefore the **actual receiver startup/bind capability is unresolved**, and the final status is not upgraded to CAUSE-FOUND.

## Read-only file and syntax validation

`/usr/bin/node` exists and is executable (root:root `0755`, Node `v22.23.2`). All four installed files exist with expected owner/mode and unchanged SHA-256:

| File | SHA-256 | Owner/mode |
| --- | --- | --- |
| `/opt/signalverse/deploy-receiver.mjs` | `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa` | root:root `0644` |
| `/opt/signalverse/release-authorization.mjs` | `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83` | root:root `0644` |
| `/usr/local/sbin/signalverse-deploy` | `572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec` | root:root `0755` |
| `/etc/systemd/system/signalverse-deploy-receiver.service` | `7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1` | root:root `0644` |

Read-only `/usr/bin/node --check` on both `.mjs`, `bash -n` on the coordinator, and `systemd-analyze verify` on the installed unit all exited successfully with no diagnostic output. The hashes match the independently Linux-staged LF package from the preceding task (zero CR/BOM was proven there); this task did not rewrite or normalize any file. Syntax and hash success do not prove that runtime binding would succeed.

## Final Production invariants and minimal next-step proposal

At `2026-09-24T14:50:08Z`, marker content remained `85aedfb944a67c94227ac343e911bc64a581e79e`, inode `609128`, mtime `2026-09-23 20:58:20.292879592 +0000`, size `41`. App symlink still resolved to `/opt/signalverse/releases/85aedfb944a67c94227ac343e911bc64a581e79e`, inode `608973`, mtime `2026-09-23 20:58:18.681895231 +0000`; admin symlink still resolved to the matching admin release, inode `8506584`, mtime `2026-09-23 20:58:18.696895085 +0000`. Main/admin/observer were active at PIDs `1962862`/`1962858`/`1962856`, all with the same `2026-09-23 20:58:18 UTC` start and `NRestarts=0`. No active/activating or queued deploy artifact was listed. Receiver remained inactive/disabled with `MainPID=0`; the old push implementation was **not** re-enabled. No application restart, symlink change or deployment occurred in this diagnosis.

**Safest minimal proposal, NOT IMPLEMENTED:** first review an offline change to the *installation test*, not trading/app code or the receiver: after `systemctl start`, wait for the receiver's own `READY` event or a loopback listening socket with a strict bounded timeout, and only then send the invalid-bearer DENY. If readiness never appears, capture the full journal and stop/disable, without accepting or testing a valid authorization. Any supervised receiver start/DENY retry requires new owner authorization. Do not weaken hash, approval, OIDC or activation gates. The separate GitHub Production Environment reviewer requirement remains pending; do not merge/push `main` while the live receiver gate is unverified.

**RECEIVER-STARTUP-CAUSE-UNRESOLVED**
