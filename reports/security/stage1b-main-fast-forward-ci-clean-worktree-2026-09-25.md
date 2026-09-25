# SignalVerse Stage 1B clean-worktree main-CI verification — 2026-09-25

Final status after the separately authorized retry: **STAGE1B-MAIN-CI-PASS**.

## Authorized retry — exact result

The owner sent the exact fresh message `APPROVE STAGE1B FAST-FORWARD TO MAIN FOR CI RETRY`. This authorized **only** an exact-SHA fast-forward to application `main` for CI, not a Production deployment. The previous pre-approval snapshot remains below as historical evidence and must not be confused with this completed retry.

| Required field | Final result |
|---|---|
| `ORIGIN_MAIN_BEFORE` / `REMOTE_MAIN_BEFORE` | `3e3703dc6a4211ca02c5850d113af3caa00abb83`, re-read by `git fetch`/`git ls-remote` and immediately before push |
| `CANDIDATE_SHA` | `1cbd0f7572905588d9335ffd426685693ee5df58` |
| `MERGE_BASE` / ancestry | Exactly `3e3703dc6a4211ca02c5850d113af3caa00abb83`; candidate direct parent is the same SHA |
| `CANDIDATE_SCOPE` | Exactly the 10 Stage 1B files listed below; no `.github`, `ops`, Guard, deploy-control, scheduler, migration or unrelated execution change; `git diff --check` PASS |
| `TESTS` | Fresh candidate-local 6/6, 35/35, 15/15 and 18/18 PASS; syntax checks PASS |
| `BUILD` | Web and admin PASS; existing large-chunk warning only |
| `BUNDLES` | `api/analyze.ts` and `api/copytrade.ts` esbuild with `write:false`: both PASS, zero errors/warnings |
| Explicit push result | `git push --porcelain origin 1cbd0f7572905588d9335ffd426685693ee5df58:refs/heads/main` returned `3e3703d..1cbd0f7`, exit 0; no force, merge, rebase, cherry-pick or other commit |
| `REMOTE_MAIN_AFTER` | Exactly `1cbd0f7572905588d9335ffd426685693ee5df58`, verified immediately after push and after CI |
| `CI_RUN_ID` / workflow | `36108633173` / `Production CI`; [run](https://github.com/signal0verse/signalverse-main/actions/runs/36108633173) |
| `CI_EVENT` / `CI_REF` / `CI_HEAD_SHA` | `push` / `main` / `1cbd0f7572905588d9335ffd426685693ee5df58` |
| `CI_RESULT` | `completed`, `success`; created `2026-09-25T07:38:01Z`, updated `2026-09-25T07:40:26Z`; job `107986811503` succeeded with 30 steps and zero failed steps |
| `PRODUCTION_ACTIVE_SHA` before/after | Marker and both app/admin symlinks: `85aedfb944a67c94227ac343e911bc64a581e79e` at `07:36:57Z`, immediately post-push, and `07:41:08Z` |
| `APPLICATION_DEPLOYMENT` | None observed: same active SHA, same main/admin/observer PIDs `1962862`/`1962858`/`1962856`, all `NRestarts=0`; no deploy job |
| `GUARD_RELEASE` | None: receiver inactive/PID 0; Production Release workflow had no runs; old failed artifact unit `eee238...` remained failed and untouched |
| `DB_CHANGES` / `EXCHANGE_WRITES` | None initiated by this task; private DB/account activity by other actors was not independently reconciled |
| `TEMP_WORKTREE_CLEANUP` | New task-created path `C:\Users\Farzam\AppData\Local\Temp\sv-stage1b-main-ci-retry-1790321508319` removed with `git worktree remove`; `Test-Path=False`, absent from worktree list; original dirty checkout and all other worktrees preserved |

The retry began with a freshly fetched `origin/main`, a new detached worktree initially clean at `3e3703d...`, and an exact candidate checkout. `npm ci --ignore-scripts` installed 270 lockfile packages only there; local Node was v24.19.0 despite the package's Node 22.x requirement, so the local test environment is not identical to CI (CI used Node 22). The four suites, web/admin build and two write-free API bundles were rerun in this fresh worktree; no source or test was modified. The CI workflow at the base SHA was inspected again: ordinary push CI has `contents: read`, no OIDC deployment credential and no receiver POST; the OIDC/Guard delivery is confined to the separate manual `production-release.yml`, which was **not** dispatched.

The final VPS sample at `2026-09-25T07:41:08Z` showed one ordinary `signalverse-fast-jobs.service` job starting, but **no deploy job or active artifact unit**. This scheduled app job is not evidence of Stage 1B deployment. We did not query or change its DB or trading state. No order, position, leverage change, Binance Stage 1B live observation or Production application rollout was requested or executed **by this task**. Successful main CI establishes only the exact-SHA CI gate; it does **not** prove live candle provenance, profitability, Supervisor effectiveness, native protection or Real accounting. Those remain separate natural/release gates.

The original dirty application checkout was not edited or committed. This dated report lives in the separate AI-Log repository rather than the dirty application tree, preserving the exact candidate SHA and avoiding an unrelated application commit. The next gate, if desired, requires a **separate** owner decision and the existing manual release/Guard authorization path; this report is not that authorization.

## Earlier pre-approval checkpoint (historical, superseded)

At the earlier checkpoint, the request required a **new, separate owner message** containing `APPROVE STAGE1B FAST-FORWARD TO MAIN FOR CI RETRY` before any remote-main push. No such message had yet been received; the earlier approval for a different attempt was not reused. Phases 0–6 were completed in an isolated temporary worktree and Phase 7 stopped that attempt. This historical checkpoint was **STAGE1B-MAIN-PUSH-AWAITING-AUTHORIZATION**, before the later retry documented above.

## Git baseline, worktree and candidate scope

At the start, `git fetch origin --prune` succeeded. `git rev-parse origin/main` and `git ls-remote origin refs/heads/main` both returned `3e3703dc6a4211ca02c5850d113af3caa00abb83`. The existing dirty checkout was not repaired, stashed, reset, cleaned or modified. A new detached worktree at `C:\Users\Farzam\AppData\Local\Temp\sv-stage1b-main-ci-1790319288540` was created from `origin/main`; its initial `HEAD` was exactly `3e3703d...` and `git status --short` was empty. Only this temporary worktree was switched to candidate `1cbd0f7572905588d9335ffd426685693ee5df58` for tests.

`git cat-file -t` identified the candidate as a commit. Its direct parent and `git merge-base 3e3703d... 1cbd0f7...` were exactly `3e3703dc6a4211ca02c5850d113af3caa00abb83`; `git merge-base --is-ancestor` succeeded. `git diff --check` passed. Exact `git diff --name-status` against that base showed **10 files**:

| Status | Path |
|---|---|
| M | `HANDOFF.md` |
| A | `api/_shared/futures-candle-provenance.ts` |
| M | `api/analyze.ts` |
| M | `api/copytrade.ts` |
| A | `reports/futures/real-futures-strategy-stage1b-binance-isolated-candidate-2026-09-25.md` |
| A | `reports/futures/real-futures-strategy-stage1b-binance-validation-2026-09-25.md` |
| A | `reports/futures/real-futures-strategy-stage1b-candle-provenance-instrumentation-2026-09-25.md` |
| A | `scripts/futures-binance-provenance-validation-test.mjs` |
| A | `scripts/futures-candle-provenance-test.mjs` |
| M | `scripts/futures-mexc-native-routing-test.mjs` |

No `.github`, `ops`, Guard, deploy-control, scheduler, migration or unrelated execution file is in this diff. These are scope/ancestry checks, not live trading validation.

## Release-control inspection

The `origin/main` version of `.github/workflows/production-ci.yml` has push triggers for `main`/`master`, `contents: read`, and test/build/artifact verification only. It contains no VPS receiver POST and no `id-token: write`. The separate `.github/workflows/production-release.yml` is `workflow_dispatch` only; it requires a full exact SHA, a successful `push` CI run for that SHA on `main`, exact checkout/ancestry, and then sends an OIDC bearer to the VPS Guard endpoint. No workflow was dispatched. Static inspection cannot substitute for observing a future main push, and a valid Guard admission was not tested here.

## Exact candidate-local verification

The test scripts were inspected for bootstrap/env/DB/network paths before execution; their exchange and Supervisor transports are injected fixtures. Lockfile-pinned dependencies were installed **only in the disposable worktree** with `npm ci --ignore-scripts` (exit 0, 270 packages). Local Node was **v24.19.0**, whereas `package.json` requires **22.x**; npm emitted `EBADENGINE`. This local version mismatch remains a limitation. npm also reported two high-severity dependency advisories; no package changes were made.

| Command/check | Result |
|---|---|
| `node --test scripts/futures-candle-provenance-test.mjs` | 6/6 PASS |
| `node --test scripts/futures-binance-provenance-validation-test.mjs` | 35/35 PASS (verified completed run) |
| `node --test scripts/futures-real-price-basis-test.mjs scripts/futures-correctness-test.mjs` | 15/15 PASS |
| `node scripts/futures-pro-timeframes-test.mjs` | 18/18 PASS |
| `node --check` on both new test scripts | PASS |
| `npm run build` | Web and admin PASS; existing large-chunk warning only |
| esbuild `write:false` on `api/analyze.ts` and `api/copytrade.ts` | Both PASS, zero errors and warnings |

The first build and bundle attempts failed because the local sandbox denied esbuild access to the temporary worktree path. The identical commands were rerun with filesystem access to **only that local temp worktree** and passed; no source or test was changed to obtain green results. The first parallel Binance test returned a still-running session without a captured final result, so the verified 35/35 result above comes from a separate completed rerun. These local checks are **not** the required exact-SHA `main` push CI.

## Prior Production read-only baseline and no-push state

Read-only SSH to the owner-designated VPS IP/port sampled UTC `2026-09-25T07:02:05Z` through `07:03:03Z`, then again at `07:05:16Z`. At both checks `/var/lib/signalverse-deploy/deployed-sha` was `85aedfb944a67c94227ac343e911bc64a581e79e`; `/opt/signalverse/app` and `/opt/signalverse-admin/app` resolved to releases of that same SHA. The main/admin/observer services remained active with PIDs `1962862`/`1962858`/`1962856` and `NRestarts=0` throughout both samples. The Guard receiver was inactive with PID 0, no TCP listener on port 3002 appeared, `systemctl list-jobs` reported no jobs, and GitHub listed no Production Release workflow runs. One historical deploy-artifact unit (`eee238...`) remained in `failed` state; it was not activated or altered. No active or queued deploy unit/job was observed; private account/DB/exchange state was not independently reconciled.

Remote application `main` was **not pushed**. Post-push main SHA and CI run ID/event/ref/head/result are therefore **not applicable**, not PASS. No candidate-specific deployment, Guard request, migration or exchange action was undertaken. The previous active Production SHA remained unchanged in the two samples, but this cannot rule out unrelated third-party activity outside the observation window.

## Prior cleanup and next gate

Before cleanup the task-created worktree path was resolved and checked against the known Temp target and Git worktree list. `git worktree remove` succeeded without force. `Test-Path` then returned `False`, and the worktree disappeared from `git worktree list`; the original dirty checkout and every pre-existing worktree remained. The app repository local `main` and remote `main` were not advanced.

To proceed with a **new** main-push attempt, the owner must send the exact fresh retry authorization in a separate message. Because the disposable worktree is now removed, a future attempt must recreate it and recheck remote main, candidate scope, Production baseline and all push gates; this report itself grants no push or release authority. The requested report was kept in the separate AI-Log repository to avoid touching the dirty application checkout. No application-code/report commit was added to the candidate.
