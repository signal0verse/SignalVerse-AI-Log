# Prediction Market — Cross-Month Weekly Touch: Fast-Forward to Main + CI

- **Date:** 2026-10-05, about 09:30 UTC
- **Target SHA:** `5e7aac6077aa80e60a25725d14ad7a124fbc040f` (parent `3e92cab7a36cc0021847b1f700b9b5a394c75b37`)

## Result: **FAIL — the precondition was not met, so the fast-forward was NOT performed**

| Step | Result |
|---|---|
| 1. Is `main` still exactly `3e92cab`? | **NO.** `origin/main` (fetched, then confirmed with `git ls-remote`) is `a4ba3246672c3db35b61f56ed5600ba20fb9a0f1` |
| 2. Fast-forward `main` to `5e7aac6` | **NOT PERFORMED.** It is no longer a fast-forward: `5e7aac6` is not a descendant of `a4ba324`, and the only way to make `main` equal `5e7aac6` would be a force-push that deletes `a4ba324` |
| 3. No rebase, merge, code change or new commit | Respected: none was made |
| 4. Resulting `main` SHA | Unchanged at `a4ba324` (nothing was pushed) |
| 5. Official Node 22 `production-ci` run for `5e7aac6` | **NOT RUN.** The SHA is not on `main`, so no `main` push CI exists for it |

## What changed on `main`

There is exactly one new commit since `3e92cab`:

```text
a4ba324 2026-10-05T17:28:38+08:00 Farzam Feali  fix(futures): fence stale entries and tighten auto candidate admission
21 files changed, 1035 insertions(+), 12 deletions(-) (does not touch api/predictions.ts)
```

`3e92cab` is still an ancestor of `main`. The cross-month change has no textual overlap with `a4ba324` in `api/predictions.ts`. That fact is not, by itself, a release verification.

## What remains needed (owner decision; not done here)

The exact SHA `5e7aac6` can no longer reach `main` without discarding `a4ba324`. Any path forward produces a **new SHA**, and that new SHA needs its own `main`-push Node 22 CI run and a short re-check before an exact-SHA release. The two options are:

- **Rebase or cherry-pick** the single commit onto `a4ba324`. This gives a linear history with a new SHA.
- **Merge** the branch into `main`. This creates a merge commit.

Neither was done, because both were explicitly prohibited for this step.

## Unchanged

- Nothing was deployed. No artifact was prepared or released.
- No DB, VPS, scheduler, gate, environment or production change was made.
- Production is still running `3e92cab`, as last read at 09:11Z. That remains the rollback target for any later release.
- Branch `codex/prediction-cross-month-touch-shadow-20261005` is still at `5e7aac6`.
