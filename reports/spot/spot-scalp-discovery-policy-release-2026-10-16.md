# Spot Scalp discovery risk presets: verified production release

Date: 2026-10-16 (Asia/Kuala_Lumpur). Deployed and verified on SignalVerse and the shared CrossVerse terminal.

Source: `de7e1e85b791ac3af3f048b960a4c481b8dbb68d`. Previous core and Paper source: `52844ba671267b193ac061751427008d58623d26`.
Repository: `signal0verse/signalverse-main`, branch `main`.

## Released behavior

The independent technical Spot Scalp project uses an explicit opt-in discovery policy, `scalp-risk-v1`, with these floors:

| Preset | Discovery score | Direction edge | Minimum 24h turnover, USD |
|---|---:|---:|---:|
| Conservative | 40 | 20 | 10000000 |
| Balanced | 30 | 15 | 5000000 |
| Aggressive | 20 | 10 | 2000000 |

Both discovery and the exact native Spot pair must meet the selected turnover floor. Maximum spread remains 10 basis points (0.1%). The Futures-backed discovery path still requires current open interest of at least USD 5000000. Snapshot freshness, closed 5m/15m confirmations, 1h confirmation, existing preset-specific 4h policy, fees, funds, permissions and durable order holds remain enforced. Passing one floor does not itself authorize a trade. These labels describe filter strictness, not measured investment risk or promised returns.

Native and owned PostgreSQL final admission verify the saved profile, scan policy/version and exact thresholds, and freeze them in new technical cycle evidence. The Paper runtime uses the same source policy. Existing accepted cycles and classic Spot/Futures behavior are retained. Old profiles without the explicit version retain 40/20/USD10000000 until the user reselects a preset and explicitly saves it. No profiles were saved or activated by the deployment operator. Diagnostics and seven-language preset explanations expose effective and legacy limits.

## Release evidence

- [Official exact-source push CI](https://github.com/signal0verse/signalverse-main/actions/runs/38849678558): all 79 steps passed.
- [Official immutable artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/38856222441): successful; artifact `12027660452`.
- Retained archive SHA-256: `b26f54d77904c7d3b22ccdaec46f83dc459ebe94527eb964847c10eb71f0666e`. All 2384 Git blobs and modes matched the exact source, without repackaging.
- The closed 25-file delta, nine additions and 16 reversible predecessor projections were verified before approval.
- Consistent private PostgreSQL/SQLite backups and isolated cold restores passed. The exact additive migration `spot_scalp_discovery_risk.sql` was rehearsed on the restored database and then applied transactionally under the installed deployment lock. It modifies four technical admission definitions, adds one canonical helper and two validated profile constraints. Other function definitions/privileges, existing constraints and profile bytes were verified unchanged. All restored table counts were retained; no account or order data migration was performed.
- Migration SHA-256: `1aff441387d2eac7b5d7610a32901287a80e3f51612b466bd7f4f8a8a097a3bc`.
- The initial disk-only restore gate stopped before mutation because headroom was insufficient. Retained backups remained on disk; the complete cold restore used a separate tmpfs PostgreSQL cluster capped at 2 CPU and 3 GiB, with no network or production-directory access. Independent 2 GiB disk, tmpfs and host-memory reserves were enforced. The original capacity gate was preserved, no older backups or other-task resources were deleted, and the temporary cluster was removed after verification.
- Independent installed Guard authorization covered the exact retained SHA/archive digest. Guard and production control files were not modified.
- [Official production release](https://github.com/signal0verse/signalverse-main/actions/runs/38857468339): successful.
- Native SignalVerse, owned runtime, admin and Paper were checked at the exact source above using process directories and health. Paper's 13 executable files plus provenance matched a fresh build from published source.
- The Paper operator initially stopped before cutover because it incorrectly expected the provenance JSON to change. Exact predecessor/source comparison proved the metadata generator and all of its recorded inputs unchanged. The corrected operator requires only `spot-scanner.mjs` to differ, requires unchanged metadata and identical repeated builds, and retains the failed attempt. No source, artifact or runtime verification gate was bypassed.
- Both public origins served matching shared manifest, `terminal.js` and `public-source.js` hashes and sizes. SignalVerse native frontend and analytical worker assets also matched. Restricted public paths remained unavailable.
- Environment, service unit, schedule, routing and deployment control hashes were preserved. Only this task's temporary runners/containers were cleaned up. The existing restricted free runner route was used; no paid GitHub-hosted Actions job was requested.

## Validation boundary

Local evidence before push: 73 focused tests, 101 isolated PostgreSQL checks, 345 integrated tests, 28 final scope tests, focused strict TypeScript and the full shared terminal production build passed. Official CI above is the final release gate.

No forced scan, test trade, account activation or order hold change was performed. Deployment verification proves the active code and database contract, not that any private account filled an order or achieved a return. Users must explicitly select and save their desired policy separately in the intended Demo/Real settings to adopt the new limits.
