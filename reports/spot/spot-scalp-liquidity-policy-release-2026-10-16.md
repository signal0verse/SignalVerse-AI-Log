# Spot Scalp liquidity presets: verified production release

Date: 2026-10-16. Deployed and verified on SignalVerse and the shared CrossVerse terminal.

Source: `633898244df01f2706c59a1af9c13d9919da8d14`. Previous core and Paper source: `de7e1e85b791ac3af3f048b960a4c481b8dbb68d`.
Repository: `signal0verse/signalverse-main`, branch `main`.

## Released behavior

The independent technical Spot Scalp project supports an explicit opt-in `scalp-risk-v2` policy:

| Preset | Maximum spread, bps | LONG volume participation must be greater than | Minimum 24h turnover, USD |
|---|---:|---:|---:|
| Conservative | 10 | -0.25 | 10000000 |
| Balanced | 15 | -0.50 | 5000000 |
| Aggressive | 20 | -0.65 | 2000000 |

Equality to the spread ceiling passes that condition. Equality to the participation boundary rejects. Discovery and the exact native Spot pair must meet their turnover floor. Discovery score/edge, freshness, current open interest for Futures-backed candidates, 1h/preset-specific 4h confirmation, high-volatility and anti-chasing checks, closed 5m/15m candles, fees, funds, permissions and durable order holds remain enforced. Passing these filters alone does not place an order or guarantee returns.

Saved v1 or unversioned profiles retain their prior behavior. Selecting a preset or Reset edits a draft; an explicit Save adopts v2. Deployment did not save, activate or migrate user profiles. Generic Futures/SHORT, classic Spot and accepted campaign management remain unchanged. Native-only metals retain their separate closed native-candle path. Seven-language settings and diagnostics show the limits, actual participation and recorded rejection boundary.

## Release verification

- [Official push CI](https://github.com/signal0verse/signalverse-main/actions/runs/38868822267): all 79 steps passed on the exact source.
- [Immutable artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/38879747578): successful; artifact `12036972463`. All 2391 source blobs and modes match the commit without repackaging.
- Retained archive SHA-256: `772647faaea7db25362bb61b6a80db8979d548dc065a3b60c2fb304171a2d7be`.
- Exact 22-file scope, 7 additions and 15 reversible predecessor projections verified.
- Private PostgreSQL/SQLite backups and complete isolated cold restores verified. The temporary PostgreSQL cluster had no network or production-directory access, capped at 2 CPU / 3 GiB, preserving 2 GiB reserves.
- New SQLite snapshots were cold-verified, compressed without loss in private temporary memory storage, and checked byte-for-byte after retention. Earlier backups and runtime releases remained intact. Seven inactive temporary source extractions from this work were removed after full comparison with their retained immutable archives and checks for live references. The capacity gate initially stopped release before migration; removing three of those verified temporary copies recovered enough space to pass the unchanged gate, which reserves 2 GiB plus the predecessor release footprint and 128 MiB build margin.
- Additive `spot_scalp_liquidity_risk.sql` rehearsed and applied under the deployment lock. It replaces the existing canonical helper and four native/owned technical admission definitions. Catalog, privileges, existing constraints and profile bytes were checked. No account/order data migration was performed.
- Migration SHA-256: `d405e6775a86090e8e8674cf3ca8b715049771e8f165b3d7efe7e1cb23d29bad`. The release operator also passed isolated failure-injection tests proving full transactional rollback on a mismatched expected definition.
- Installed independent Guard approved the exact source/archive digest.
- [Official production release](https://github.com/signal0verse/signalverse-main/actions/runs/38881943284): successful.
- Native, owned, admin and Paper processes and health verified at this source. Paper's 13 executable files and provenance matched a fresh source build. Both public origins served identical manifest/terminal asset hashes and lengths. SignalVerse native frontend/analytical worker assets matched; unsupported public paths remained restricted.
- The first CI attempt stopped at the disk reserve during dependency installation. The same source/run was retried with task-private temporary-memory work storage inside the unchanged 2 CPU / 3 GiB runner limit. No gate was bypassed, paid GitHub-hosted job requested, unrelated workload cancelled or older backup removed. Task runners, containers and restore cluster were cleaned up.

Local evidence before push: 397 integrated tests, 213 isolated PostgreSQL checks, 52 shared discovery/quality tests, 25 final scope checks, scoped strict TypeScript, full terminal build and Persian UI checks passed. Official CI above is the release gate.

No forced scan, test trade, user-setting activation or order-hold change was used for acceptance. This verification proves deployed code and database contracts; it does not claim a private account filled an order or earned a return.
