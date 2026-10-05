# Prediction Market — Cross-Month Weekly Touch: Exact-SHA Production Deployment

- **Date:** 2026-10-05, 14:29–14:43 UTC
- **Final result: PASS**

| Item | Value |
|---|---|
| **Deployed SHA** | `dee7ad48d75b181c3650bd0f899288ddd743d43d` |
| Official CI on that SHA | `production-ci` run 37316749406: push, `main`, success, Node v22.23.3 |
| **Rollback SHA** | `78787814b3f3b2ff86080f279560728f9e434449` (the release running before this deploy; its release directory is retained) |

## Artifact / digest verification

| Check | Result |
|---|---|
| Artifact preparation | Run **37325120567** (`workflow_dispatch` on `main`, run head `dee7ad4`): success. Artifact **11352026335** |
| Inner `release.tar.gz` SHA-256, computed independently after download | **`e1e76ce4021b6644e48b2b9e8148f8b939face7d2aa738ac05d6c269fc659091`**, 4,880,939 bytes |
| `metadata.json` | `sha` = `dee7ad4…`; `artifactSha256` and byte count match; `workflowSha` = `dee7ad4…` |
| Repository verifier (`scripts/release-artifact.mjs source` and `verify`, run locally from the reviewed `dee7ad4` tooling) | Both exit 0 |
| Content cross-check | `api/predictions.ts` inside the archive has SHA-256 `6972c200…`, identical to the git blob at `dee7ad4`. It contains the shadow marker. The archive holds 832 files |

## Approval / release

- **VPS approval** was issued with the reviewed helper `/root/issue-approval.mjs`. Its SHA-256 `e5e22deb…` is identical to the reviewed local copy. Output: `WRITTEN_AND_VALID`, id `d6cf2c39-9f1a-470b-ba4d-657f726e13fa`, bound to the exact SHA and digest, expiring 15:33:10Z. The file is root-owned, mode 0600.
- **Release workflow** run **37325673566**: success, 14:33:35–14:36:33Z. The receiver returned `{"status":"deployed","sha":"dee7ad48d75b181c3650bd0f899288ddd743d43d"}`.

## Post-deploy verification (read-only)

| Check | Result |
|---|---|
| VPS running SHA | `/opt/signalverse/app -> /opt/signalverse/releases/dee7ad48d75b181c3650bd0f899288ddd743d43d` |
| Deployed `predictions.mjs` | Contains the `CROSS_MONTH_WEEKLY_TOUCH_SHADOW_V1` marker and the kill-switch reference |
| Kill switch `PREDICTION_CROSS_MONTH_TOUCH_SHADOW` | Not set in any running `signalverse*` unit or env file, so the **shadow is ON** as intended |
| First Shadow tick after deploy (14:42:40Z) | `success=true`; `crossMonthTouchShadow.version=CROSS_MONTH_WEEKLY_TOUCH_SHADOW_V1`; `entry_reachable=false`; candidates 0; rule fetches 0; `SUPPORTED_EXISTING_WEEKLY: 3`; `opened=0` |
| Entry tick after deploy | 1 run, successful |
| Prediction gates | Unchanged: discovery, enter, resolve, shadow-entry |
| REAL `prediction_trades` | 0 |

Candidates are 0 because the current week (October 5–11) is inside a single month. The first cross-month week the shadow will observe is **October 26–November 1, 2026**. That is the week US daylight saving time ends (November 1), so its window is 169 hours long.

## Scope

- **Nothing changed besides the release:** no code change, rebuild, rebase or merge; no other SHA deployed; no DB schema, Futures, Stablecoin, scheduler, gate or environment change.
- **Trading and Learning:** Real Trading stays OFF and Learning stays OFF.
- **The family cannot create a Demo position:** cross-month markets are SHADOW-ONLY and cannot create an autonomous Demo position. The change does not establish profitability or model superiority.
- **Rollback options:**
  - Redeploy `7878781` through the same exact-SHA pipeline.
  - Or, for a functional off-switch without a redeploy, set `PREDICTION_CROSS_MONTH_TOUCH_SHADOW=off` in the API environment and restart the process.
