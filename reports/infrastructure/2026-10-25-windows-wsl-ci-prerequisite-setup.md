# Windows Linux prerequisite installed — restart required before CI

## Metadata

- Date: 2026-10-25, Asia/Kuala_Lumpur
- Task ID: windows-linux-setup-20261025
- Module: local Windows prerequisite for isolated release tests
- Mode: owner-approved local installation; no production activation
- Repository: signal0verse/signalverse-main
- Branch: codex/telegram-ui-preview-20261025
- Starting/ending source commit:3f6a657316e694e834e4c9c76966edc4d96c744b

## Objective

The owner explicitly approved installing and preparing the missing Linux test
prerequisite on this Windows machine so the already-approved Telegram UI release
can proceed. The approval disclosed possible restart requirements. The assistant
has not restarted the computer or treated installation as successful deployment.

## Scope

Install the standard Microsoft Windows Subsystem for Linux prerequisite. Retain
the existing production release gates, application source, private work, account
state, financial behavior and production configuration. Do not force a reboot or
install an unrelated Linux distribution.

## Actions Taken

1. Checked the clean candidate worktree and unchanged source SHA3f6a6573. Read the
   current handoff, release gates, safe test runbook and isolated-runner procedure.
2. Verified that WSL was initially absent and the normal terminal was not elevated.
   The dedicated official CI run40137578402 remained queued without a runner.
3. Launched the Microsoft system WSL executable through standard Windows RunAs
   elevation with the exact command `wsl.exe --install --no-distribution`.
   No security/authentication dialog was automated. No execution-policy change,
   password entry, security bypass, third-party installer or restart command.
4. Installation started2026-10-24T22:40:03.001279Z and completed22:41:22.492271Z,
   equivalent to2026-10-25 06:40–06:41 in the user's timezone. Native exit code0.
5. Verified WSL version, installed VirtualMachinePlatform feature, hardware
   virtualization/SLAT support and pending component reboot state.
6. Saved private local installation/verification receipts and a continuation
   record. Preserved the existing application source and deployment SHA.

## Files Inspected

- Current repository instructions, handoffs and release/runbook documents
- Windows WSL CLI status/help/version output
- Selected Windows edition/build, optional-feature and virtualization metadata
- Component-servicing pending-reboot flag
- Exact GitHub Production CI run state

## Files Changed

Application source: NONE.

Local task receipts only, under ignored task-owned tmp/windows-linux-setup-20261025:
install-receipt.json, verification.json and continuation.json.

System change: standard Microsoft WSL package/kernel and the Virtual Machine
Platform prerequisite installed/enabled by the approved installer.

## Root Cause / Findings

CONFIRMED: WSL was not installed before this request. It is now installed and
queryable. Hardware virtualization does not need a firmware-setting change:
VirtualizationFirmwareEnabled, SLAT and VMMonitorModeExtensions all report True.

CONFIRMED: VirtualMachinePlatform has InstallState1 (enabled). Component servicing
reports RebootPending=True. Windows Update's separate reboot flag was False.
WSL2 cannot yet start its VM on the current boot. A Windows restart remains
required before Docker/Linux test execution can be verified.

NOT_VERIFIED: Docker engine readiness, disposable runner registration, full
official CI, immutable artifact preparation and production delivery after restart.

## Implementation

The supported Microsoft command installs the WSL prerequisite without creating
an Ubuntu/user distribution. Existing Docker Desktop remains installed; its
Linux engine must be checked after the new Windows feature becomes active.
No production VPS package, service, environment, bot token/webhook or financial
configuration was changed by this local installation.

## Checks / Results

- Installer exit code: PASS,0.
- `wsl.exe --version`: PASS, WSL3.0.3.0; kernel6.18.54.1-1; Windows10.0.26300.9711.
- `wsl.exe --status`: installed/default version2; VM activation still pending.
- VirtualMachinePlatform: enabled, InstallState1.
- Hardware virtualization/SLAT/VM monitor: True.
- Pending component reboot: True.
- Automatic restart: NOT PERFORMED.
- Repository: clean, unchanged3f6a657316e694e834e4c9c76966edc4d96c744b.
- Production CI40137578402: still QUEUED on that exact SHA at final check.

## Build Result

No application changes, so the completed Web/Admin/API builds and19 focused
checks from the preceding request were not needlessly repeated. Installing WSL
does not substitute for full exact-main Node22/Linux CI.

## Git Status / Commit

No new source commit or default-branch push. Candidate/main remain3f6a6573.
Previously verified live bot/main/admin/owned and independent Paper remain on
2da63dc5; this step did not contact or mutate production runtime. Refer to the
prior release-preparation report for the complete private backup/cold-restore
proof and22 unchanged control fingerprints.

## Remaining Issues

1. Save open work and restart Windows with the owner's control/confirmation.
2. Verify WSL2 and Docker start correctly; then create only the documented
   disposable isolated Linux runner with2CPU/3GB bounds and blocked private egress.
3. Complete exact-main CI40137578402, immutable retained-artifact/tree/digest
   verification, fresh runtime/control/backup checks, independent existing Guard
   authorization and official production delivery. Verify actual public UI/assets
   and runtime SHA before claiming the main bot updated.

## Risks / Limitations

The host prerequisite is installed but the working Linux/Docker environment is
not yet accepted because the new feature requires a reboot. Production deployment
is incomplete. No paid CI budget, repository visibility, protection gate, trade,
account, database, credential or production worker policy changed. No firmware
setting or global sound setting was modified.

## Recommended Next Step

Restart Windows after saving work, then resume this same chat to verify the
environment and continue the already-authorized UI deployment. Do not start a
second backup, runner or cutover while an earlier result is unknown.

References:
- https://learn.microsoft.com/en-us/windows/wsl/basic-commands
- https://docs.docker.com/desktop/setup/install/windows-install/
- https://github.com/signal0verse/signalverse-main/actions/runs/40137578402
- https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/general/2026-10-25-telegram-workspace-production-release.md

## Owner-approved restart handoff - 2026-10-25 06:45 +08:00

The owner explicitly confirmed that open work is saved and requested an immediate
Windows restart. Installation exit0, enabled VirtualMachinePlatform, hardware
virtualization and saved continuation state were rechecked; the source worktree
remains clean at3f6a657316e694e834e4c9c76966edc4d96c744b.

A normal Windows restart command, shutdown.exe /r /t 0, is prepared without the
force-close flag. This handoff is published before invoking it because reboot
terminates the local executor. At publication the restart has not yet been
invoked; reboot completion, post-restart WSL/Docker readiness and deployment
remain unverified. The private continuation record retains the exact CI run,
source/runtime pins, backup-proof location and remaining controlled release gates.
No production activation or new source commit belongs to this reboot step.

## Post-restart continuation - 2026-10-25 07:03 +08:00

The owner resumed this chat after Windows booted. The normal restart command
returned exit0; Windows reports its new boot at06:46:31 local. WSL2 now runs the
Docker distribution with kernel6.18.54.1. Local Linux Docker29.6.2 is ready.

Docker initially failed before its engine started because stale, inaccessible
AF_UNIX IPC objects remained from August. Its normal stop command timed out.
Only processes whose executable paths matched the installed Docker directory
were stopped; the two exact transient socket parent directories were renamed
to task-specific preservation siblings. No directory was deleted, no factory
reset/prune/unregister performed, and no Docker data/settings or production
configuration changed. The preserved IPC directories and private repair receipt
remain available. The engine subsequently started successfully.

A pinned Ubuntu24.04 disposable image contains native PostgreSQL17.11,
GitHub CLI2.103.2 and the repository-supported Actions runner2.338.0. The latter
two archives matched official SHA256 values. Before JIT registration, the new
container verified zero host mounts, no socket/inbound port/host networking,
private/metadata egress denial, working public HTTPS and the inability to regain
NET_ADMIN after dropping its bounding capability. Limits are2CPU/3GiB RAM with
low scheduling weight; no host or production credentials are in the image.

Exact-main CI40137578402 attempt1 failed during checkout because the unprivileged
runner inherited root's HOME. No application tests ran in that attempt. The
runner diagnostics were preserved and its exact container removed; GitHub
automatically removed its one-job registration. The image now sets the correct
runner HOME. The same main-push CI was retried with a fresh JIT runner; at this
update it has started, and full test completion remains pending. This is an
infrastructure correction only: application/main SHA remains3f6a6573 and the
source worktree is clean. The main bot has not been activated with the new UI.

Reference for the matching Docker IPC startup failure class:
https://github.com/docker/desktop-feedback/issues/531
