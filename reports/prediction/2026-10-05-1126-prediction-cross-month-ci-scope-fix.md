# Prediction Market — Cross-Month Weekly Touch: CI Scope Fix + Complete CI

- **Date:** 2026-10-05, about 11:26 UTC
- **Base `main`:** `f71d287167a33fffa9b0af99e6fb2fd1a021c0c5` (unchanged)
- **Source:** `5e7aac6077aa80e60a25725d14ad7a124fbc040f`

## Result: **STOPPED — the scope-projection write was blocked by the Claude Code permission classifier. Not READY_FOR_DEPLOY.**

| Step | Result |
|---|---|
| 1. Reapply `5e7aac6` onto `f71d287` | Done. Only `HANDOFF.md` conflicted |
| 2. Resolve `HANDOFF.md` (Futures first, then Prediction) | Done; 0 conflict markers |
| 3. Add the narrow test-only scope projection | **Blocked.** Creating the new projection file was denied by the Claude Code auto-mode permission classifier (reason: "CI Bypass"). Per that tool policy, the change was not attempted again by any other route |
| 4–8. Local scope test, push, Node 22 CI | **Not performed.** No new SHA exists, and nothing was pushed |

## What was intended (the authorized Option 1)

The plan followed the same pattern every earlier release used to join the Futures scope chain (for example, how `futures-training-release-parity.mjs` was wired to the entry-freshness layer in `a4ba324`):

- **New layer.** A new test-only layer `scripts/lib/prediction-cross-month-release-parity.mjs`, with base `f71d287`. It would pin exact SHA-256 values for:
  - `api/predictions.ts`
  - `scripts/prediction-cross-month-touch-shadow-test.mjs`
  - `.github/workflows/production-ci.yml`
  - `HANDOFF.md`
  - `TRADING_STRATEGY.md`
  - the hook file below
  - its own self-hash

  It would also check that the three text files only gained one contiguous addition.
- **Hook into the previous layer.** A four-line hook in `scripts/lib/futures-entry-release-parity.mjs`: one import; `verifyEntryFreshnessScope` delegating to the new projection; `beforeEntryFreshness` chaining; and the admitted set including `additionalPaths`. The new layer would verify that this is the only change to that file.
- **No Futures runtime code would change.**

## Decision needed (owner)

1. **Allow the action.** Grant permission for this test-only scope-file write, either by approving it in the Claude Code permission prompt or by adding a matching permission rule in settings. I would then redo steps 1–8 from scratch. **Or**
2. **Owner applies it.** The owner, or the Futures scope-chain owner, applies the scope layer directly. CI can then run on the resulting SHA.

## State

- Cherry-pick aborted; temporary branch removed; worktree clean on `5e7aac6`.
- Remote `main` is unchanged at `f71d287`.
- **Nothing was deployed or pushed.** No DB, VPS, scheduler, gate, environment or Futures-runtime change. No force-push.
