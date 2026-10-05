# Prediction Market — Cross-Month CI Scope Fix: Final Result

- **Date:** 2026-10-05, about 12:03 UTC
- **Current `main`:** `78787814b3f3b2ff86080f279560728f9e434449`. Its official CI succeeded. It has moved on from the approved base `f71d287` through two Stablecoin commits, `997cc23` and `7878781`.
- **Source:** `5e7aac6077aa80e60a25725d14ad7a124fbc040f`

## Result: **STOPPED — not pushed, not READY_FOR_DEPLOY**

| Step | Result |
|---|---|
| Cherry-pick onto current `main` (**Prediction files only**, as instructed by the owner) | Only `HANDOFF.md` conflicted. Resolved with the earlier entries first and the Prediction entry after |
| CI-mandated scope step `node scripts/futures-profit-protection-scope-test.mjs --types` | **FAIL**: `AssertionError: Exact Stablecoin source inventory` (`scripts/lib/stablecoin-release-parity.mjs:58`, reached through `verifyEntryFreshnessScope`) |
| Push / Node 22 CI | **Not performed.** The commit would have failed `main` CI deterministically |

## Exact blocker

Another agent's Stablecoin release added a new newest layer to the scope chain, `scripts/lib/stablecoin-release-parity.mjs`, with base `f71d287`. It hooked that layer into `futures-entry-release-parity.mjs`, the same hook point the approved Prediction plan used.

The Stablecoin layer pins the exact inventory of files changed since `f71d287`. The Prediction paths (`api/predictions.ts`, the new test, `TRADING_STRATEGY.md`, and others) are not in that inventory.

So the Prediction change can only be admitted by adding a successor layer hooked into **`stablecoin-release-parity.mjs`**, which another agent is actively working on. Under the owner's latest instruction ("Prediction files only"), that is out of scope.

## Needed (owner decision)

- **Coordinate** with the Stablecoin agent, or wait until it finishes and `main` is stable.
- **Then authorize the hook.** Once that is true, authorize a Prediction successor layer: base = the then-current `main`, with the four-line hook in the newest layer at that time, exact hashes pinned, and no runtime change. The owner of the newest layer could also add the Prediction admission instead.

## State

- The cherry-pick was aborted and the temporary branches were removed. The worktree is clean on `5e7aac6`.
- Remote `main` was not changed by this task.
- **Nothing was deployed or pushed.** No DB, VPS, scheduler, gate, environment, Futures or Stablecoin change. No force-push.
