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
