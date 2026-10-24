# Approved Telegram UI release — source published, runtime not deployed

## Metadata

- Date: 2026-10-25, Asia/Kuala_Lumpur
- Task ID: telegram-workspace-production-release-20261025
- Module: Telegram workspace UI and release preservation evidence
- Mode: owner-approved release preparation; activation blocked on CI execution
- Repository: signal0verse/signalverse-main
- Branch: codex/telegram-ui-preview-20261025, also normally fast-forwarded to main
- Starting design commit: 9753985bb2af8c84afc0ba5af4a07e7e80b48017
- Ending source commit: 3f6a657316e694e834e4c9c76966edc4d96c744b
- Preserved predecessor/active runtime: 2da63dc5441928c5c325067869445e8732bde48c
- Result: NOT DEPLOYED; required exact-main CI remains queued with zero runners

## Objective

The owner approved the displayed cleaner Telegram design, supplied SignalVerse
logo and currency icons, and requested deployment to the official main bot.
The original authorization to deploy is valid; a later question asks permission
only for installing missing Linux test prerequisites on this Windows machine.
No such installation or reboot has been performed.

## Scope

Preserve the reviewed UI, existing financial behavior, private local work and
production controls. Complete source preservation, official CI, immutable artifact,
private rollback backup/cold restore, independent exact-digest Guard approval and
official release before claiming activation. No strategy, risk, credit, SQL,
account, order, worker or production configuration change is authorized here.

## Actions Taken

1. Verified a clean candidate worktree and current remote main. Confirmed the
   active main/admin/owned release is exactly the candidate's predecessor2da63dc5.
   The independent Paper pointer also remains on that source.
2. Verified live Telegram identity with read-only getMe/getWebhookInfo:
   @SignalVerse_AI_bot and the expected signal.easybitpay.com webhook host.
   Token/webhook values were not changed or disclosed.
3. Recorded22 installed release/runtime/unit/configuration fingerprints and
   active service/pointer evidence. No installed Guard/coordinator/receiver,
   environment, service unit or timer was edited.
4. The initial legacy closed scope correctly rejected the new UI inventory.
   Added a narrow, byte-pinned, reversible presentation successor. Every changed
   predecessor file reconstructs exactly; unknown/missing/extra bytes, financial
   APIs, private files, migrations and workflow changes are rejected. Historical
   assertions remain, with an exact predecessor projection only after that proof.
   Direct new-UI tests run against actual candidate source. The existing CI UI
   entry imports the additional tests; no workflow gate was removed or skipped.
5. Updated HANDOFF, AI handoff, safe runbook and release evidence document.
   Removed the obsolete candidate-only/live-unchanged sentence from help knowledge
   in preparation for the approved release. No trading handler was changed.
6. Passed19 focused UI/preservation tests, scoped strict TypeScript, Web/Admin
   production builds and syntax-only analyze API bundling. The lengthy Windows
   historical parity process was interrupted; full official Linux CI remains
   mandatory and has not been reported as passed.
7. Published feature branch and main normally, without force. Preserved rollback
   ref codex/rollback-telegram-ui-20261025 at2da63dc5. Verified source remote SHA3f6a6573.
8. Started required main-push Production CI40137578402. It remains queued before
   any test step because SV_ISOLATED_RUNNER=enabled and the repository currently
   has zero registered runners. No payment/budget variable, hosted-routing gate,
   workflow or repository visibility was changed to bypass that restriction.
9. Took a new full native PostgreSQL snapshot and consistent read-only Paper and
   receipt SQLite backups, then completed isolated cold restore/integrity proofs.
   All backup contents remain private on the server.
10. Investigated the installed local Docker environment. Its engine was initially
    unavailable; WSL reports not installed. The existing Docker Desktop CLI
    startup returned Starting, but a bounded20-second engine query still timed
    out. Native Docker app launch approval also timed out. The production VPS has
    no Docker executable. No WSL/software/Windows feature was installed and no
    reboot, security change or production runner installation was performed.
11. Asked the owner for permission to install/prepare the missing Linux test
    prerequisite on this Windows host, noting possible restart requirements.
    That specific installation decision remains pending at this report snapshot.

## Files Inspected

- AGENTS.md, CLAUDE.md, latest HANDOFF and docs/AI_HANDOFF.md
- Existing UI preview document and current colleague/release handoff
- Production CI, artifact preparation and exact-SHA release workflows
- Installed root release coordinator and authorization contract, read-only
- Safe test runbook and free-isolated-actions-2026-10-13.md
- Current and historical source preservation helpers and tests
- Existing backup helpers, server service/pointer metadata and designated env path
- Local Docker CLI help/status, contexts and non-secret operational metadata
- Official Microsoft WSL and Docker Windows prerequisite documentation

## Files Changed

- HANDOFF.md
- docs/AI_HANDOFF.md
- docs/testing/stability-test-runbook.md
- docs/testing/telegram-workspace-production-release-2026-10-25.md
- api/analyze.ts, help text only
- scripts/lib/spot-setup-reliability-parity.mjs
- scripts/lib/telegram-workspace-release-parity.mjs
- scripts/lib/telegram-workspace-release-delta.json
- scripts/telegram-workspace-release-scope-test.mjs
- scripts/telegram-workspace-ui-test.mjs
- scripts/spot-setup-views-test.mjs
- scripts/terminal-view-parity-test.mjs

Private task-specific preflight/backup/restore helpers and receipts are outside the
source commit. Original primary checkout private/untracked work was preserved.

## Root Cause / Findings

CONFIRMED: The UI candidate is based on the actual active source, so no unrelated
unreleased financial changes need promotion. All existing application non-render
logic and198 other function bodies remain unchanged by the reviewed UI.

CONFIRMED: Official CI has no registered isolated runner. Earlier successful jobs
used disposable Linux runners; none is currently online. Installed local Docker
does not provide a working Linux engine and WSL is absent. These are execution
environment blockers, not a failing financial test or a successful deployment.

CONFIRMED: First cold restore completed and all139 table counts matched, but a
strict catalog text comparison found six CHECK expressions with normalized AND
parentheses. No difference was waived by a loose regex: each original expression
was parsed again on the isolated restored PostgreSQL server inside a rolled-back
constraint transaction, and its canonical form matched exactly. All other catalog,
owner, ACL, index, function and trigger values matched. A second complete count
comparison passed. Production DDL/DML remained zero.

## Backup / Restore Evidence

- Full native PostgreSQL17 custom dump:897507927 bytes.
- SHA256:19e98769de5da55c4d6d6c1e21a9704a1c496f33c81cc4c9a9c9b891259fd3c8.
- Exported repeatable-read snapshot; all139 archived table-data entries restored
  and compared against counts from that exact source snapshot.
- Isolated disk-backed restore: private network, production directories and
  production sockets inaccessible, CPUQuota100%, MemoryMax1GiB.
- Source catalog digest:ce2ff8f4668d5fb0fae44c859c10d1651fe164c50ee8d28be5fa03a775601c19.
- Snapshot count digest:d6d237e8dc0f3ebee1695cb6003cbe3d2fb89f448c8ea2f077a986085018e151.
- Six CHECK parser round-trips verified; no policy expression changed.
- Paper snapshot1654505472 bytes and receipt snapshot569344 bytes: cold SQLite
  integrity_check=ok; compressed round-trip bytes verified.
- Temporary cluster stopped and only its verified task-owned data/socket removed.
-22 control fingerprints unchanged; no production database/schema/account write.
- Final proof completed2026-10-24T22:36:30.710208Z (2026-10-25 06:36 local).
- Private server proof:
  /var/lib/signalverse-deploy/operations/telegram-workspace-20261025/backup-proof.json.

## Tests Executed

- Focused UI, closed UI successor and predecessor scope: PASS19/19.
- Existing non-render App logic preserved;198 other function bodies exact: PASS.
- Strict changed component/preview TypeScript: PASS.
- Web/Admin build at final source: PASS. Existing large frontend bundle warning
  remains; no full legacy zero-diagnostic claim.
- analyze.ts syntax-only esbuild targetNode22: PASS, no API execution.
- Git diff/staged checks: PASS.
- Full historical Windows parity process: INTERRUPTED, not passed.
- Required exact-main official CI40137578402: QUEUED, zero steps executed.
- Native/SQLite backup and full isolated cold restore: PASS as described above.
- Runtime/source/bot identity read-only checks: PASS for the prior active release.

## Build Result

Web2142 modules and Admin1713 modules built. Native local Node is24.19.0; the
required official Node22 CI execution is still pending. Client assets retain
the reviewed design/logo/icons. No artifact-preparation or release workflow was
dispatched without its successful main CI prerequisite.

## Git Status / Commit

- Main and feature remote:3f6a657316e694e834e4c9c76966edc4d96c744b, VERIFIED.
- New commit: test(ui): preserve closed release scope for approved Telegram workspace.
- Original UI commit9753985b is retained in ancestry.
- Rollback branch:codex/rollback-telegram-ui-20261025 ->2da63dc5, VERIFIED.
- Isolated source worktree clean at the final source check.
- Runtime/main/admin/owned and independent Paper remain on2da63dc5; no activation.
- Immutable artifact preparation: NOT STARTED.
- Independent one-use Guard approval: NOT ISSUED.
- Production Release workflow: NOT STARTED.

## Remaining Issues

1. Restore a working, approved isolated Linux CI execution host. The owner has
   been asked to approve missing Windows prerequisites; no installation is implied
   by elapsed time or the earlier deployment approval.
2. Pass the full exact-main Production CI, prepare and verify retained artifact
   bytes/tree, then use unchanged independent Guard/OIDC release and verify actual
   runtime/public assets and customer interface.
3. Revalidate runtime/control pins and backup freshness before eventual activation.

## Risks / Limitations

This report is not a successful deployment receipt. The main bot remains on its
previous release, with services active. No live order, account operation, reset,
forced scan, migration, credential/webhook change, worker activation, risk/credit
policy change, paid CI budget change or profitability claim was made.

Automatic approval review rejected a proposed process-memory credential read;
it was not executed or retried indirectly. Normal bot identity verification then
succeeded using only the service's explicitly configured env file, without
displaying credentials. That rejection is resolved by the supported source and
is not the remaining CI blocker. Native app launch approval timing out was also
not treated as installation consent.

## Recommended Next Step

Resolve the clearly described local prerequisite decision or provide an existing
approved isolated host. Continue the already-authorized release through the full
unchanged gates. Do not claim that source publication or backup success alone
updated the main bot.

References:
- https://github.com/signal0verse/signalverse-main/actions/runs/40137578402
- https://learn.microsoft.com/en-us/windows/wsl/basic-commands
- https://docs.docker.com/desktop/setup/install/windows-install/

## 2026-10-25 06:42 local — Windows prerequisite installed, restart required

This update supersedes the installation-decision-pending state above. The owner
explicitly approved preparing the Linux prerequisite on this Windows machine.
The standard elevated Microsoft command `wsl.exe --install --no-distribution`
completed with exit0. WSL3.0.3.0/kernel6.18.54.1-1 are installed;
VirtualMachinePlatform reports enabled, hardware virtualization/SLAT are True,
and component servicing reports a required restart. No automatic/forced restart,
unrelated distribution, firmware edit or production runtime change was performed.
Official exact-main CI40137578402 remains queued on source3f6a6573 until the
post-restart Docker/isolated-runner environment is verified and started.

The installation and continuation receipts are retained privately. Full sanitized
installation report, with remote bytes verified:
https://github.com/signal0verse/SignalVerse-AI-Log/blob/b6b90a8254868b0d3e7d22c3bc26c9a4de56ac5f/reports/infrastructure/2026-10-25-windows-wsl-ci-prerequisite-setup.md

The main bot has not yet adopted the new UI. Successful full main CI, immutable
artifact verification, fresh server/control/backup evidence, existing independent
Guard authorization and official release/actual UI verification remain required.
