# PHASE 5I — NEW CANDIDATE RECONSTRUCTION REPORT

## 1. Base Identity

- Current remote main: `da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f`, freshly read before isolation and again after the STOP.
- Expected main: `da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f`.
- Base verified: YES; fetched exact main, created a fresh worktree directly at this SHA, verified HEAD and merge base equal it.
- Old candidate: `266134db0d93a27e49cf1219f4cd2418c124ce0e`, unchanged locally/remotely.
- New branch: `codex/futures-pp-worker-symlink-20261002-main-current` (LOCAL ONLY).
- New isolated worktree: `C:/Projects/SignalVerse-Main/tmp/futures-pp-worker-main-current-20261002`.
- Main additions inspected: `99df5d3867bc5a7d3a75340637332e75bd764577` and `da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f`.
- Their net delta from the old PP parent is five paths, 137 insertions / 7 deletions: `HANDOFF.md`, `docs/AI_HANDOFF.md`, `src/terminal/full-mount.tsx`, `src/terminal/trade-onboarding-i18n.ts`, `src/terminal/trade-onboarding.tsx`. Legitimate onboarding/account-mode routing was not removed or treated as unwanted.

## 2. New Candidate

- New candidate SHA: NOT CREATED. A branch at the clean base exists, but no new Worker implementation commit exists.
- New candidate parent: NOT APPLICABLE; the intended base is the exact current main above.
- Parent equals current main: NOT APPLICABLE until a candidate commit is created.
- Commit subject: NOT CREATED.
- Candidate worktree clean: YES; no staged, tracked or untracked changes in the new worktree.
- BASE_WORKTREE_CLEAN=YES. Before and after the failed base validation, HEAD remained the exact current main.
- Root checkout's unrelated modified HANDOFF and private/untracked files were preserved. No stash, clean, reset, cherry-pick, merge, rebase or history rewrite occurred.

## 3. Scope

- Files changed in the new candidate: NONE.
- Insertions: 0.
- Deletions: 0.
- Worker fix only: NOT APPLIED because untouched-base validation exposed an unexpected mandatory scope-gate failure.
- Current main onboarding changes preserved: YES, byte-for-byte; `git diff --exit-code <current-main> --` and `git diff --cached --exit-code` returned no difference.
- Unrelated changes: NONE introduced. Only a separate local work report was created outside the candidate worktree.

Current-base onboarding Git blobs, unchanged in the isolated worktree:

| Path | Git blob |
| --- | --- |
| src/terminal/full-mount.tsx | 0e4c27cb99a10a9fbfc273e72e1e8e54d6778492 |
| src/terminal/trade-onboarding-i18n.ts | ed62e648c842e45c841ae1d03250a3f6fc3f232e |
| src/terminal/trade-onboarding.tsx | b78410d57e2ccd3f693b8e0f82cd4c882b9075ab |

## 4. Worker Fix

- Canonical entrypoint: the approved old candidate was inspected; NOT REPLAYED into the new worktree.
- realpathSync / fileURLToPath / pathToFileURL: approved implementation remains in the old candidate; no new implementation or workaround invented.
- Fail closed: unchanged in the old reviewed implementation; new fix validation NOT RUN.
- Worker flag preserved: YES; source and service configuration unchanged.
- Monitor preserved: YES, no code change.
- Adapter preserved: YES, no code change.
- Existing base Worker and core-test source are the same Git versions as the old PP parent, so a direct replay of the approved bootstrap change itself would not require adapting those files. The blocker is a different, pre-existing scope test.
- Current PP operational documentation and the old candidate's documentation delta were inspected. The old Phase 5B text contains historical uncommitted/commit-gate statements; it was not copied over current documentation or newer main handoff entries.

## 5. Tests

- Worker bootstrap: NOT RUN; no new fix applied. Old 9/9 evidence is not reused as new-candidate acceptance.
- PP core: NOT RUN after STOP.
- Adapter: NOT RUN after STOP.
- UI: NOT RUN after STOP.
- SQL: NOT RUN after STOP; no disposable or Production database was migrated.
- Scope: FAIL on the exact UNMODIFIED CURRENT MAIN, BEFORE applying any Worker/test/documentation change.
- Web build: NOT RUN after STOP.
- API build: NOT RUN after STOP.
- Admin: NOT RUN after STOP.
- Legacy tests: unmodified; prior `BASELINE_EXISTING_FAILURE` disposition unchanged; not rerun and not used to explain this separate scope failure.

Exact command executed in the clean isolated base using Node v22.23.3:

```text
C:/Projects/SignalVerse-Main/tmp/pp-bootstrap-node22-20261002/node-v22.23.3-win-x64/node.exe scripts/futures-profit-protection-scope-test.mjs
```

Exit code: 1. Actual relevant error:

```text
AssertionError [ERR_ASSERTION]: Latest-main file reverted: src/terminal/full-mount.tsx
    at file:///C:/Projects/SignalVerse-Main/tmp/futures-pp-worker-main-current-20261002/scripts/futures-profit-protection-scope-test.mjs:35:53
generatedMessage: false
code: 'ERR_ASSERTION'
actual: false
expected: true
operator: '=='
```

The message is the test's assertion text, NOT evidence that this task reverted the file. The entire new worktree was still exactly current main.

Root cause confirmed from the unchanged scope-test source:

1. Line 5 pins `base='8a3524bdf595b4883c0b2fd9e46df8d136be90d6'`, an older main rather than current `da992966...`.
2. Lines 23–29 declare a closed `ppPaths` inventory that does not contain the three legitimate new onboarding paths.
3. Line 34 obtains the entire path delta from that old base to the current working tree.
4. Line 35 rejects every path outside that old PP inventory and labels it "Latest-main file reverted".
5. The first rejected path is `src/terminal/full-mount.tsx`; the two other onboarding paths are also outside the frozen inventory by direct source/diff inspection. The runner aborts at the first assertion, so those later checks are not falsely reported as separately executed failures.

This is a scope-baseline incompatibility already present on the requested clean base, not a Worker regression introduced by reconstruction. The earlier invariant checks preceding line 35 completed without throwing in this run; the type-diagnostic stage was not reached. This run used the already available ancestor checkout's TypeScript dependency; no dependency installation or application runtime bootstrap occurred.

No test, fixture, allowlist, baseline, expected result or workflow was modified to obtain a green result. No further checks/builds/commit/push/CI were attempted after the mandatory STOP.

## 6. CI

- CI run: NONE dispatched in Phase 5I.
- CI head SHA: NOT APPLICABLE.
- CI conclusion: NOT RUN.
- New candidate CI verified: NO; no new candidate commit exists.
- Previous CI for `266134db...` is not claimed as validation of the current-main tree.

## 7. Production Safety

- Production SHA: `9de1fb13966bb4b2c76dc8efa6a21334d86aacdf`, freshly verified read-only.
- App path: `/opt/signalverse/releases/9de1fb13966bb4b2c76dc8efa6a21334d86aacdf`.
- Admin path: `/opt/signalverse-admin/releases/9de1fb13966bb4b2c76dc8efa6a21334d86aacdf`.
- Worker active: NO; inactive/dead, MainPID=0.
- Worker enabled: NO; disabled.
- REAL_PP: OFF.
- DEMO_PP: OFF.
- Production deployed: NO.
- Main/admin/observer/PostgREST PIDs: 3051115 / 3051068 / 3051067 / 1960930 respectively; all active/running, NRestarts=0. Properties/paths/PIDs were identical in the before/after snapshot pair.
- Read-only snapshot timestamps: `2026-10-01T18:33:09.869024Z` and `2026-10-01T18:33:10.069211Z`.
- Bounded read-only DB: `signalverse_cutover2`, transaction_read_only=on, lock_timeout=2s, statement_timeout=5s; explicit ROLLBACK.
- Control updated_at: `2026-10-01T11:30:19.817128Z`; PP position rows=0, ALL close intents=0.
- Installed unit / drop-in / old Worker SHA-256 remain:
  - unit: `d562e0803f18a0972f8f643dc6998c7cef478f2b922236ed0eb923600233f66d`.
  - drop-in: `8abd593c611846bf1d2a3967bdf3a970d3fb85e00d277bec9deb2e41abf16695`.
  - Worker: `7c0bd80f7320016e3d01ba1b5cdd737fd87a3f60f81338654cb01f3983d55faf`.
- No Worker start/test on Production; no restart, enabling, configuration change, DML, DDL, migration, approval, artifact preparation or release.
- Exchange/order/position/SL/TP actions by this task: 0. No exchange API or private-account verification was attempted; these are task action counts, not claims about unrelated live jobs.

## 8. Git Safety

- Main modified: NO; no local main branch-pointer operation or source edit.
- Main pushed: NO; remote remains exact `da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f`.
- Force push: NO.
- Merge: NO.
- Old candidate modified: NO; old remote branch remains exact `266134db0d93a27e49cf1219f4cd2418c124ce0e`.
- New candidate pushed: NO; new branch exists locally at the base only, no remote branch exists.
- Application commit: NONE created.
- The authorized local isolation changed only Git worktree/branch metadata. Fetch refreshed `origin/main` to the verified remote head; it did not merge or move local main.
- Separate AI-Log report-only publication under AGENTS.md is not an application-branch push or candidate promotion. Exact publication commit/read-back are reported separately after completion.

## 9. Final Result

`PHASE 5I BLOCKED — DO NOT PROCEED`

The requested current-main base passes the identity/preservation checks but fails the existing mandatory PP scope test before any reconstruction. The phase's "unexpected condition => STOP" rule was followed. No new candidate was committed, pushed or dispatched to CI.

### Metadata / objective / scope

- Local date: 2026-10-02, Asia/Kuala_Lumpur; evidence UTC date: 2026-10-01.
- Task: Phase 5I, Futures Profit Protection Worker reconstruction only; no main promotion/deployment/Worker startup/PP activation.
- Starting/ending isolated-worktree HEAD: `da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f`.
- Expected deliverable was a single new candidate preserving exact current main plus only the approved Worker fix. A defensible blocked report is delivered instead because the required unchanged gate fails on the clean base.

### Actions / files inspected

- Owner Phase 5I attachment read in full; root/candidate Git status and existing worktree inventory inspected.
- Main refreshed with `git fetch --no-tags origin main` after matching `git ls-remote`; fetched identity checked before creating the fresh branch/worktree.
- Complete main delta and old candidate's Worker/test/documentation delta inspected; main onboarding changes preserved.
- `AGENTS.md`, `CLAUDE.md`, latest `HANDOFF.md` / `docs/AI_HANDOFF.md`, safe test runbook and current PP operational documentation inspected. `TRADING_STRATEGY.md` was not edited; its Git blob matches the already-read old PP parent.
- Existing PP core, adapter, UI, scope and SQL tests; `scripts/lib/futures-profit-protection-parity.mjs`, `scripts/lib/futures-pure-test-context.mjs`; existing Worker and `package.json` inspected for safe execution. No `.env` file was present in the new worktree; no application environment file or exchange credential was loaded. The existing SSH identity was used only for the authorized read-only VPS audit.
- Executed only the existing offline read-only scope check on the untouched base, then stopped implementation/validation work.
- Verified fresh Production safety through marker/symlink/process/systemctl metadata and aggregate read-only PP control/count queries.
- Only this new sanitized local report was written; no application source/documentation/test file was changed.

### Remaining issue / recommended next step

Separate owner authorization is required to repair the scope-baseline contract before resuming reconstruction. A minimal proposal for review is to retain the historical PP/function/parity assertions unchanged and add a distinct exact-current-main preservation comparison whose only permitted new delta is the reviewed Worker, direct bootstrap tests and minimal Worker documentation. The three onboarding implementation files must stay byte-identical to current main; do not simply exclude them or weaken the existing financial/function checks. This proposal has NOT been implemented or tested and is not a green-gate claim.

After that separately approved gate repair and clean-base validation, resume only the already approved Worker reconstruction and fresh exact-SHA CI. This report grants no main promotion, release preparation, Guard, deployment, Worker start, trading activation or profitability acceptance.
