# PHASE 5H — CONTROLLED PROMOTION & DEPLOYMENT REPORT

## 1. Promotion

- Candidate SHA: `266134db0d93a27e49cf1219f4cd2418c124ce0e`.
- Promoted main SHA: NONE; no promotion was attempted.
- Observed remote main: `da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f`, independently read twice during this preflight.
- Parent: `9de1fb13966bb4b2c76dc8efa6a21334d86aacdf`.
- Promotion method: NOT EXECUTED. A normal fast-forward of current remote main to this candidate is impossible: GitHub compare reports DIVERGED, ahead_by=2, behind_by=1, merge base `9de1fb13966bb4b2c76dc8efa6a21334d86aacdf` (comparison base=candidate, head=current remote main).
- Scope verified: EXACTLY four files, 136 insertions / 3 deletions, subject `fix(futures): harden profit protection worker entrypoint`:
  - `HANDOFF.md`: reviewed Worker fix handoff.
  - `docs/futures-profit-protection.md`: reviewed bootstrap documentation.
  - `scripts/futures-profit-protection-test.mjs`: canonical-path regression tests.
  - `server/futures-profit-protection/worker.mjs`: minimal canonical-path entrypoint comparison.
- Candidate tracked worktree: clean. Pre-existing untracked reports and temporary files were preserved and excluded. Root checkout's modified HANDOFF and private/untracked work were also preserved; no staging, stash, reset, clean, merge, rebase, new application commit or push occurred.
- The attachment's Phase 1 parent line is malformed (39 hexadecimal characters). The valid full SHA at the attachment's beginning and the actual Git parent agree exactly; no alternate candidate was substituted.

## 2. Production Deployment

- Deployed SHA: no new deployment; existing runtime remains `9de1fb13966bb4b2c76dc8efa6a21334d86aacdf`.
- Release path: `/opt/signalverse/releases/9de1fb13966bb4b2c76dc8efa6a21334d86aacdf`.
- Admin release path: `/opt/signalverse-admin/releases/9de1fb13966bb4b2c76dc8efa6a21334d86aacdf`.
- Deployment time: NOT APPLICABLE for Phase 5H. No release workflow, artifact preparation, approval creation/claim/consumption or activation was invoked.
- Production SHA verified: YES, for the existing runtime, not the candidate. Marker, app/admin symlinks and active process working directories independently agree with the existing SHA.
- Read-only VPS evidence timestamps: `2026-10-01T18:19:31.252698Z` before and `2026-10-01T18:19:31.835500Z` after the bounded DB read. Marker, links, service properties and PIDs were identical in both snapshots.

| Service | State | PID | NRestarts | Existing start time (UTC) |
| --- | --- | ---: | ---: | --- |
| signalverse.service | active/running | 3051115 | 0 | 2026-10-01 16:35:55 |
| signalverse-admin.service | active/running | 3051068 | 0 | 2026-10-01 16:35:47 |
| signalverse-observer.service | active/running | 3051067 | 0 | 2026-10-01 16:35:46 |
| postgrest.service | active/running | 1960930 | 0 | 2026-09-23 20:37:29 |

No health/API/release validation of a newly deployed candidate was possible because deployment was stopped before promotion.

## 3. Worker Verification

- Worker source verified: existing old source only; candidate source is NOT installed.
- Installed source SHA-256: `7c0bd80f7320016e3d01ba1b5cdd737fd87a3f60f81338654cb01f3983d55faf`.
- Canonical entrypoint fix present: NO in the installed source; YES in the reviewed candidate diff. This is expected for an undeployed candidate, not a new post-deploy failure.
- Worker bootstrap: NOT TESTED in this phase; no start requested.
- Worker health: inactive/dead, MainPID=0, NRestarts=0, Result=success. An inactive service is not proof that the bootstrap fix works in Production.
- Crash loop: none observed in the service snapshots; no candidate startup was attempted.
- Startup verification result: BLOCKED / NOT EXECUTED due to the earlier promotion precondition.
- Existing unit SHA-256 remains `d562e0803f18a0972f8f643dc6998c7cef478f2b922236ed0eb923600233f66d`.
- Existing drop-in SHA-256 remains `8abd593c611846bf1d2a3967bdf3a970d3fb85e00d277bec9deb2e41abf16695`.
- No unit/drop-in/environment/worker/adapters/monitor modification or service reload/start/stop/enable/restart occurred.

## 4. Safety

- REAL_PP: OFF, freshly verified from the Production control row.
- DEMO_PP: OFF, freshly verified from the Production control row.
- Control updated_at: `2026-10-01T11:30:19.817128Z`, unchanged from the prior recorded audit.
- Exchange actions: 0 by this task; no exchange API was called.
- Order actions: 0 by this task.
- Position actions: 0 by this task.
- SL actions: 0 by this task.
- ONE TP actions: 0 by this task.
- PP close intents: 0 total; ALL close intents: 0; PP position-state rows: 0.
- PP-related closed-trade records since candidate commit time (`2026-10-01T17:44:25Z`): 0 in the inspected DB query.
- Production database inspected: `signalverse_cutover2`; transaction_read_only=on, lock_timeout=2s, statement_timeout=5s, explicit ROLLBACK. Only aggregate/control metadata was read; no account credentials or private trade-row identities were exposed.
- Database DML/DDL/migration/backfill: NONE.

## 5. Final Worker State

- Worker active: NO.
- Worker enabled: NO (`UnitFileState=disabled`).
- Production remains functionally disabled: YES for Profit Protection; Real/Demo PP OFF and Worker inactive/disabled. This does not mean the application's other trading functionality is disabled.

## 6. Existing Trading State

- Existing positions modified: NO by this task.
- Existing orders modified: NO by this task.
- Existing SL modified: NO by this task.
- Existing ONE TP modified: NO by this task.
- No private exchange position/order verification was attempted. These zero-action statements describe this task, not a fabricated proof that every account state stayed unchanged under other naturally running Production jobs.

## 7. Legacy Tests

- History detail: `BASELINE_EXISTING_FAILURE`; prior paired LF snapshot result 37 passed / 12 failed for both baseline and candidate.
- Liquidation feasibility: `BASELINE_EXISTING_FAILURE`; prior paired result 61 passed / 2 failed for both.
- Pro timeframes: `BASELINE_EXISTING_FAILURE`; prior paired run reached 15 passes then the same expected=2 / actual=3 assertion in both.
- Modified: NO; neither these tests nor CI were changed.
- Fresh read-only GitHub recheck: existing candidate CI run [36901769380](https://github.com/signal0verse/signalverse-main/actions/runs/36901769380), exact head SHA `266134db0d93a27e49cf1219f4cd2418c124ce0e`, candidate branch, event=workflow_dispatch, conclusion=success. Job 110502401416 (`Build web and API runtime`) had 38/38 successful steps, zero failed/skipped steps; ran `2026-10-01T17:45:49Z` to `2026-10-01T17:49:05Z`.
- This existing CI is not a new main push CI. The three named legacy scripts are not exercised by that workflow. No claim is made that all repository tests pass. No tests/build/CI dispatch were executed in Phase 5H.

## 8. Final Result

`DEPLOYMENT BLOCKED — DO NOT PROCEED`

The exact current main and approved candidate have diverged. The two remote-main additions relative to the approved parent are:

1. `99df5d3867bc5a7d3a75340637332e75bd764577` — Add reviewed exchange onboarding and account mode routing.
2. `da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f` — Merge branch 'main' of https://github.com/signal0verse/signalverse-main into codex/trello-trade-structure (committer timestamp `2026-10-01T17:59:47Z`).

GitHub's comparison of approved parent to current main reports ahead_by=2 / behind_by=0. Its net changed paths are `HANDOFF.md`, `docs/AI_HANDOFF.md`, `src/terminal/full-mount.tsx`, `src/terminal/trade-onboarding-i18n.ts` and `src/terminal/trade-onboarding.tsx`. These existing parallel changes were not removed, overwritten or characterized as unauthorized.

The exact-identity and no-additional-changes conditions cannot be met by publishing the frozen candidate to this new main. Force-push, silently merging, substituting another SHA or reconstructing a new candidate is not performed under this phase's authorization.

ROLLBACK_REQUIRED=NO: there was no new deployment and no new candidate runtime failure. Last observed Production SHA remains `9de1fb13966bb4b2c76dc8efa6a21334d86aacdf`.

### Metadata

- Date: 2026-10-02, Asia/Kuala_Lumpur (UTC evidence date: 2026-10-01).
- Task ID: Phase 5H controlled promotion preflight.
- Module: Futures Profit Protection / release preflight.
- Mode: read-only investigation after mandatory pre-promotion STOP; report-only publication to separate AI-Log under AGENTS.md.
- Repository: signal0verse/signalverse-main; candidate branch `codex/futures-pp-worker-symlink-20261002`.
- Starting/ending candidate commit: `266134db0d93a27e49cf1219f4cd2418c124ce0e` (unchanged).

### Objective and scope

Owner approved promoting/deploying the exact audited Worker candidate and temporarily testing startup with both PP gates OFF. The attachment requires STOP before promotion when preconditions materially differ. The first remote-main check found a material difference, so all release/Worker actions were withheld. Only source/GitHub metadata, bounded read-only VPS/DB checks and this sanitized report were performed.

### Actions and exact evidence sources

- `git show --no-patch --format=fuller` and `%H%n%P%n%s` for the exact candidate.
- `git diff --stat` and `--name-status` between the approved parent and candidate.
- `git --no-optional-locks status --short` in the root and dedicated candidate worktree.
- `git ls-remote origin refs/heads/main refs/heads/codex/futures-pp-worker-symlink-20261002`, followed by a second main-only read: same observed main.
- GitHub REST commit metadata for the observed main and comparisons parent...main and candidate...main, including merge base and ahead/behind counts.
- GitHub REST candidate CI run and jobs endpoints; no workflow dispatch.
- VPS `/var/lib/signalverse-deploy/deployed-sha`, app/admin resolved symlinks, `/proc/<active PID>/cwd`, read-only `systemctl show` and SHA-256 reads of the Worker source/unit/drop-in.
- Bounded PostgreSQL READ ONLY transaction containing the control row, PP state/intents counts and PP-related closed-trade count; explicit ROLLBACK.
- Existing separate AI-Log README/report template/secret-scan patterns reviewed for report publication. No secrets, environment contents, user IDs, private positions or exports included.

### Files inspected

- Owner Phase 5H attachment (read in full).
- Root `AGENTS.md`, `CLAUDE.md`, `docs/COLLEAGUE_HANDOFF_2026-09-29.md`; latest root `HANDOFF.md` and `docs/AI_HANDOFF.md` entries.
- Candidate `.github/workflows/production-ci.yml`, `.github/workflows/production-release-artifact.yml` and `.github/workflows/production-release.yml` (read in full).
- Exact four-path candidate Git inventory; existing Worker source and installed unit/drop-in bytes on VPS.
- Separate AI-Log `README.md`, `templates/report-template.md`, `scripts/scan-secrets.mjs`.

### Files changed / implementation / commit

- Only this new report was created locally; application source, candidate commit, branches, existing HANDOFF changes and all untracked work were preserved.
- No repair, strategy/application implementation or new application commit.
- Separate AI-Log report-only publication state and commit are reported after remote verification; they are not application promotion.

### Checks / build / Git status

- Exact candidate identity/four-file inventory: PASS.
- Current remote-main precondition: BLOCKED (DIVERGED).
- Existing Production SHA/links/process provenance and OFF gates: read-only confirmed.
- Existing candidate CI: SUCCESS; new CI/build/tests: NOT EXECUTED.
- Application Git push/main write/history rewrite: NO.
- Prepare/release/approval/deployment/service action: NO.

### Remaining issue / limitations / recommended next step

A separately authorized new candidate based on the current main would be needed to preserve its new onboarding changes and add only the reviewed Worker fix; it would have a different SHA and require exact-scope review, fresh CI and the normal artifact/independent Guard/release gates. Do not silently treat the old candidate CI as acceptance of that new tree. No reconstruction or new-SHA release is authorized or attempted here. Profit Protection effectiveness, private exchange execution and profitability remain untested.
