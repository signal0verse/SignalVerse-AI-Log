# Prediction Market — Cross-Month Weekly Touch: Cherry-Pick Resolution + Node 22 CI

- **Date:** 2026-10-05, about 11:08 UTC
- **Base `main`:** `f71d287167a33fffa9b0af99e6fb2fd1a021c0c5`. Verified unchanged before and after; its official CI run `37294274363` succeeded.
- **Source commit:** `5e7aac6077aa80e60a25725d14ad7a124fbc040f`

## Result: **NOT PUSHED — a deterministic CI blocker was found before the push. Not READY_FOR_DEPLOY.**

| Step | Result |
|---|---|
| Cherry-pick onto `f71d287` | Only `HANDOFF.md` conflicted. Code, test, CI line and `TRADING_STRATEGY.md` applied without conflict |
| `HANDOFF.md` resolution | Done as instructed and verified: both Futures entries kept first, then the Prediction entry; 0 conflict markers |
| Pre-push check of the CI-mandated scope step (`node scripts/futures-profit-protection-scope-test.mjs --types`, `production-ci.yml` line 109) | **FAIL** on the cherry-picked tree: `AssertionError: Exact entry-freshness inventory` |
| Same command on a clean `f71d287` (temporary detached worktree) | **PASS** (exit 0). The failure is caused only by the cherry-pick, not by the environment |
| Push to `main` | **Not performed.** It would have placed a commit on shared `main` that is guaranteed to fail CI |
| New SHA / Node 22 CI | **None / NOT RUN** |

## Diagnosis

The Futures release-scope chain enforces an exact list of changed files, and the exact SHA-256 of each changed file, relative to base `3e92cab`. It is reached as `futures-profit-protection-scope-test`, then the projection libraries, then `scripts/lib/futures-entry-release-parity.mjs` (`validateEntryFreshness`, lines 83–90; `verifyEntryFreshnessScope`, lines 93–98).

The cherry-pick adds three paths to that list:

- `api/predictions.ts`
- `scripts/prediction-cross-month-touch-shadow-test.mjs`
- `.github/workflows/production-ci.yml`

It also changes the pinned bytes of `HANDOFF.md` and `TRADING_STRATEGY.md` (`scripts/lib/futures-entry-release-delta.json`).

As a result, any Prediction change on top of the current `main` fails CI until a new projection layer for it is added to the Futures scope chain. Earlier non-Futures releases (the Spot and Futures tutorials) were admitted the same way. Adding that layer means editing Futures test code under `scripts/lib/futures-*`, which this task prohibited ("Do NOT change Futures or any unrelated code").

The Prediction code itself was not the cause: Prediction and Futures code were byte-preserved, and the earlier Prediction suite passed 23/23.

## Decision needed (owner)

Authorize one of the following two options:

1. **Scope layer for Prediction.** A narrow, test-only projection layer in the Futures scope chain that admits exactly these five Prediction paths, pinned by hash, with Futures runtime untouched. It would go in the same commit as the cherry-pick, followed by the official Node 22 CI on the resulting SHA.
2. **Repair by the scope chain's owner.** The owner of the Futures scope chain adds the Prediction admission themselves.

## State after this task

- Remote `main` is unchanged at `f71d287`. The Prediction branch is unchanged at `5e7aac6`.
- The cherry-pick was aborted, and the temporary branch and baseline worktree were removed. The worktree is clean.
- **Nothing was deployed.** No artifact was prepared. No DB, VPS, scheduler, gate, environment or production change was made. Futures code was untouched. No force-push was used.
