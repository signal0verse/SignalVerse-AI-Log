# Prediction Market — Cross-Month Weekly Touch: Final CI Integration

- **Date:** 2026-10-05, about 14:12 UTC
- **Result:** **READY_FOR_DEPLOY** (not deployed)

| Item | Value |
|---|---|
| Base `main` (verified before push) | `78787814b3f3b2ff86080f279560728f9e434449`. Stablecoin work complete; its official CI succeeded |
| Source commit | `5e7aac6077aa80e60a25725d14ad7a124fbc040f` |
| **New `main` SHA** | **`dee7ad48d75b181c3650bd0f899288ddd743d43d`** (fast-forward, no force-push) |
| Official CI | `production-ci` run **37316749406**, event `push`, branch `main`, head `dee7ad4…`, conclusion **success** (13:26:01–13:34:40Z) |
| Node in CI | `node-version: 22` → **v22.23.3** |

## What was done

1. **Reapplied** `5e7aac6` onto `7878781`. Only `HANDOFF.md` conflicted; it was resolved by keeping every existing entry and adding the Prediction entry after them. The Prediction code is byte-identical to `5e7aac6` (the `api/predictions.ts` SHA-256 is `6972c200…` in both).
2. **Found the newest scope layer.** After Stablecoin, it is `scripts/lib/stablecoin-release-parity.mjs`: its `verifyStablecoinScope` reads the working tree directly, and no later layer exists.
3. **Added the test-only admission**, following that layer's own pattern:
   - New `scripts/lib/prediction-cross-month-release-parity.mjs`, with base `7878781`. It pins exact SHA-256 values for `api/predictions.ts`, `scripts/prediction-cross-month-touch-shadow-test.mjs`, `.github/workflows/production-ci.yml`, `HANDOFF.md`, `TRADING_STRATEGY.md` and the hooked Stablecoin layer, plus its own self-hash. It also checks that the docs and CI file only gained one contiguous addition.
   - A four-line hook in `stablecoin-release-parity.mjs`: one import; `verifyStablecoinScope` delegating to the Prediction projection; `beforeStablecoin` chaining; the admitted set including `additionalPaths`. The new layer verifies that this is the only change to that file.
   - No Futures or Stablecoin runtime file changed. There was no DB, VPS, scheduler, gate or environment change.

## Commit contents (7 files, +886/−5)

`.github/workflows/production-ci.yml` (+1), `HANDOFF.md` (+6), `TRADING_STRATEGY.md` (+2), `api/predictions.ts` (+270/−3), `scripts/prediction-cross-month-touch-shadow-test.mjs` (new), `scripts/lib/prediction-cross-month-release-parity.mjs` (new, test-only), `scripts/lib/stablecoin-release-parity.mjs` (+4/−2, test-only hook)

## Tests

**Local (before push, Node 24.19.0):**
- The Prediction layer: PASS.
- `node scripts/futures-profit-protection-scope-test.mjs --types`: PASS, with no new API or frontend TypeScript diagnostics.
- `node --test scripts/stablecoin-release-scope-test.mjs`: 45/45.
- Offline CI commands: 45 of 48 passed.
- The other 3 failed locally on the candidate and **failed identically on a clean `7878781`**, so they are not caused by this change:
  - `terminal-indicator-parity-test`
  - the partner-paper pair (needs an unrun build output)
  - `stablecoin-engine-test` (known Windows CRLF false checks)

  The official CI passes all three.

**Official CI (Node 22.23.3):**
- The job `Build web and API runtime` succeeded.
- The scope test passed, with API diagnostics 30 → 30 and none introduced.
- The Stablecoin delta-preservation check: ok.
- `prediction-cross-month-touch-shadow-test`: 34/34, 0 fail.
- No `not ok` in the Prediction step.

## Deployment

**NOT DEPLOYED.** No artifact was prepared, nothing was approved, and nothing was released. The next step (an owner action) is the existing exact-SHA pipeline for `dee7ad48d75b181c3650bd0f899288ddd743d43d`: artifact preparation, independent digest verification, owner VPS approval, then release.

The rollback target is whatever release is running at that time; verify it at release. The functional off-switch without a redeploy is `PREDICTION_CROSS_MONTH_TOUCH_SHADOW=off`.

The change is shadow-only. It does not establish profitability or model superiority, and the cross-month family cannot create an autonomous Demo position.
