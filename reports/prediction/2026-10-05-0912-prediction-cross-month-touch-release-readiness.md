# Prediction Market — Cross-Month Weekly Touch: Final Release Readiness

- **Date:** 2026-10-05, 09:00–09:12 UTC.
- **Scope:** decide whether this exact commit is ready for a controlled exact-SHA production release. Nothing was deployed, merged, opened as a PR, modified, or changed in CI.
- **Target SHA:** `5e7aac6077aa80e60a25725d14ad7a124fbc040f`
- **Branch:** `codex/prediction-cross-month-touch-shadow-20261005` (the remote head equals the local head; the working tree is clean)
- **Base / current `origin/main`:** `3e92cab7a36cc0021847b1f700b9b5a394c75b37` (fetched 09:00 UTC; `main` has not moved, and the target is exactly one commit ahead)
- **Rollback SHA:** `3e92cab7a36cc0021847b1f700b9b5a394c75b37` (the running production release)
- **Reviewed report:** `reports/prediction/2026-10-05-0855-prediction-cross-month-touch-shadow.md`

## Final Decision: **NOT_READY**

### Blockers (only these)

1. **The SHA is not on `origin/main`.** `production-release-artifact.yml` (line 36) and `production-release.yml` (line 75) both enforce `git merge-base --is-ancestor <SHA> origin/main`. The target exists only on the feature branch, so the artifact preparation step would reject it.
2. **There is no successful `main` push CI run for this SHA, and therefore no Node 22 test result.** Both workflows require a `production-ci.yml` run with `head_branch == "main"`, `event == "push"` and `conclusion == "success"` for the exact SHA (artifact workflow lines 37–40; release workflow line 48). None exists. Node 22 is not installed locally (only v24.19.0 is), so the suite has not yet been verified on CI's runtime.

**Resolution path (owner action, outside this task):** fast-forward `main` from `3e92cab` to `5e7aac6`. That is possible because `main` is the exact parent, so the SHA is preserved, with no merge commit and no rebase. Then wait for the resulting `main` push CI, which runs on Node 22, to succeed. After that, follow the normal pipeline: artifact preparation, independent digest verification, owner VPS approval (≤ 1 h), then release. No code change is needed.

## 1. SHA / Branch / Diff

```text
HEAD = remote branch = 5e7aac6077aa80e60a25725d14ad7a124fbc040f
origin/main = merge-base = 3e92cab7a36cc0021847b1f700b9b5a394c75b37 (main ahead of base: 0)

 .github/workflows/production-ci.yml                |   1 +
 HANDOFF.md                                         |   6 +
 TRADING_STRATEGY.md                                |   2 +
 api/predictions.ts                                 | 273 ++++++++++-
 scripts/prediction-cross-month-touch-shadow-test.mjs | 529 ++++++++++
 5 files changed, 808 insertions(+), 3 deletions(-)
```

## 2. Tests (exact SHA, clean tree, no `.env.backup.local` present, so the production DB is unreachable)

**Node version: v24.19.0 locally. Node 22: NOT AVAILABLE locally, so NOT RUN** (this is blocker 2).

Every Prediction command from the `production-ci.yml` list was run:

| Command | Result |
|---|---|
| `node scripts/prediction-market-engine-test.mjs` | PASS |
| `node scripts/prediction-market-lookahead-test.mjs` | PASS |
| `node scripts/prediction-time-horizon-gate-test.mjs` | PASS 10/10 |
| `node scripts/prediction-tradeability-gate-test.mjs` | PASS 10/10 |
| `node scripts/prediction-ranking-test.mjs` | PASS 5/5 |
| `node scripts/prediction-shadow-classification-test.mjs` | PASS 4/4 |
| `node scripts/prediction-side-aware-test.mjs` | PASS 19/19 |
| `node scripts/prediction-settlement-test.mjs` | PASS 17/17 |
| `node scripts/prediction-calibration-test.mjs` | PASS 12/12 |
| `node scripts/prediction-duplicate-protection-test.mjs` | PASS 14/14 |
| `node scripts/prediction-revalidation-test.mjs` | PASS 12/12 |
| `node scripts/prediction-shadow-resolution-test.mjs` | PASS 17/17 |
| `node scripts/prediction-autonomous-sizing-test.mjs` | PASS 10/10 |
| `node scripts/prediction-shadow-entry-test.mjs` | PASS 15/15 |
| `node scripts/prediction-observability-test.mjs` | PASS 49/49 |
| `node scripts/prediction-engine-v2-test.mjs` | PASS 45/45 |
| `node scripts/prediction-demo-lifecycle-test.mjs` | PASS 21/21 |
| `node scripts/prediction-v2-replay-regression-test.mjs` | PASS 9/9 |
| `node scripts/prediction-v2-i18n-test.mjs` | PASS 121/121 |
| `node scripts/prediction-ai-price-review-diagnostic-test.mjs` | PASS 19/19 |
| `node scripts/prediction-v2-outcome-collection-test.mjs` | PASS 27/27 |
| `node scripts/prediction-cross-month-touch-shadow-test.mjs` | **PASS 34/34** |
| `node --test scripts/prediction-demo-job-test.mjs` | PASS 7/7 |

Total: **23/23 steps PASS, 0 FAIL.** The test that proves isolation ("cross-month markets never reach the Demo insert" while a supported control market opens) was already shown not to be vacuous. In the implementation report, a mutation widening the weekly regex made it fail, and the file was then restored.

## 3. Build / Typecheck

| Check | Result |
|---|---|
| `tsc --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --types node --lib ES2022,DOM api/predictions.ts` | HEAD has one error, `TS2322` (`autonomousLearningTick` return type, line 3231). The base `3e92cab` has the identical error at line 2964. **New errors: 0** |
| `esbuild api/*.ts --bundle --platform=node --format=esm --target=node22 --packages=external --sourcemap` (CI flags) | PASS: 14 sources produce 14 bundles |
| Web build | NOT APPLICABLE (no UI change) |

## 4. Protected-Area Check

- **Changed files are exactly the five listed in §1.** None is under `migrations/`, `deploy/`, `ops/`, `server/`, `lib/`, `src/` or `admin/`, and no other `api/*.ts` file was touched.
- **Untouched:** Futures, Spot, Fast Trader, Supervisor, Wallet, signing.
- **CI:** one added line (`node scripts/prediction-cross-month-touch-shadow-test.mjs`). No trigger or job change.
- **DB schema:** no migration, no DDL.
- **Writes in `api/predictions.ts`:** no new `.insert(`, `.upsert(`, `.delete(` or `.update({` lines.
- **Env:** the only new variable is the kill switch `PREDICTION_CROSS_MONTH_TOUCH_SHADOW`.
- **Scheduler and gates:** no scheduler, timer, cron or gate change, and no `jobs.d` reference.
- **Real Trading:** no change; it remains OFF.
- **Learning:** no change; it remains OFF.
- **Production state (read-only SSH, 09:11:01Z):** `/opt/signalverse/app -> releases/3e92cab…`. No release directory exists for the target yet, and there are 0 approvals for the target SHA, so the SHA has never been attempted and is not burned.

## 5. Deployment and Rollback Readiness

| Item | Status |
|---|---|
| Exact SHA | Clean, one fast-forward commit on top of the current `main` and the running release |
| Release pipeline gates | **Not met**: blockers 1 and 2 |
| Artifact / approval / claim | None exist; the SHA is fresh |
| Rollback SHA | `3e92cab7a36cc0021847b1f700b9b5a394c75b37`, the currently running release; its release directory is present on the VPS |
| Functional rollback without redeploy | Set `PREDICTION_CROSS_MONTH_TOUCH_SHADOW=off` in the API environment (takes effect at process restart). This disables the observation only, because production decisions never depended on it |
| Change risk | Additive and shadow-only. The production decision path, the Demo insert, thresholds, H1–H8, fees, Kelly, Range and the Touch maths are unchanged |

## 6. Statement

This decision concerns release mechanics only. The change does **not** establish profitability, model superiority, or missing profitable trades. The cross-month family is **SHADOW-ONLY** and cannot create an autonomous Demo position.

No deployment, merge, PR, CI change, code change, production, DB, VPS, scheduler or gate change was made during this review.
