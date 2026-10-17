# Independent Scalp hourly confirmation and next-scenario previews: verified release

Date: 2026-10-18 (Asia/Kuala_Lumpur). Deployed and verified on SignalVerse and the shared CrossVerse terminal.

Source: `666514422455a56130a8511af4f1f5906484cfd8`. Predecessor: `696e9afc0094af65d94be81e0c74de9a875f2f27`.
Repository: `signal0verse/signalverse-main`, branch `main`.

## Released behavior

The independent 5-minute technical Spot Scalp project supports explicit opt-in hourly policy `scalp-1h-v1` for all assets and prospective scenarios 2–4 on both brands. Conservative requires canonical hourly confirmation. Balanced also admits neutral context with a positive EMA20 price-distance or three-hour EMA20 slope component. Aggressive additionally admits opposing context only within -0.5 hourly ATR distance and -0.1 hourly ATR slope. Flat, missing, inconsistent and strongly adverse context rejects. Original raw categories, scores, valid closed 5m/15m data and all liquidity, cost, depth, funds, permission and durable order-hold checks remain authoritative.

After a confirmed purchase, the normal engine tick analyzes the next scenario through scenario 4, using the accepted campaign's frozen technical settings. A separate provisional preview records time, concrete blockers and conditional levels only when supplied by the actual engine, including when entry is blocked. No preview creates a cycle, accepted decision, reservation, credit charge or order. Actual advancement still requires four fully confirmed prior ladders and fresh independent admission checks. Missing/stale analysis is disclosed. Native, owned and internal Paper paths use the same policy; no symbol-specific exception exists.

Selecting a preset or Reset updates a draft; explicit Save adopts the new policy. Existing user profiles were not saved, enabled or migrated by this release. Accepted campaigns retain immutable levels and evidence. No forced scan, acceptance trade or order-hold alteration was performed. Classic Spot and generic Futures/SHORT remain unchanged. The seven-language UI explains hourly admission and provisional previews.

## Verification

- [Official exact-source CI](https://github.com/signal0verse/signalverse-main/actions/runs/39045400996): all 79 steps passed.
- [Immutable artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/39051978842): artifact `12107888345`; all 2438 blobs and modes match the commit. Retained archive SHA-256: `f23a81be0abbbe95578896e944a2020a4a73497621c687d99870055e0bb66f34`.
- Closed 35-file scope, 11 additions and 24 reversible predecessor projections verified.
- Private PostgreSQL/SQLite backups, full isolated cold restores and migration rehearsal passed. A task-private temporary filesystem addressed the shared tmpfs capacity limit; shared mount configuration stayed unchanged and the private mount was removed. Restore had no network/production-directory access, a 2 CPU / 3 GiB limit and full 2 GiB reserves. Backups and rollback versions were preserved.
- `spot_scalp_hourly_risk.sql`, SHA-256 `38bd076b5bdae3c5896cf2c5b7f3689e493553cf6ad5b0150cfda55a01efbe04`, adds two pure security-invoker helpers and two profile CHECKs and updates only the two native/owned technical admission wrappers. Function ACLs, unrelated catalog objects and profile bytes were preserved. Fresh local failure-injection checks proved complete transaction rollback on helper-definition and constraint mismatches.
- Installed independent Guard approved the exact source/archive digest.
- [Official production release](https://github.com/signal0verse/signalverse-main/actions/runs/39053231022): successful.
- Native, owned, admin and Paper processes/health verified at this source. Paper's 13 executable files and provenance matched a fresh exact-source build; only service, Spot scanner bundle and source metadata changed from its predecessor. Both public origins served matching manifests and asset hashes/lengths; native frontend/analytical worker assets also matched.
- The initial candidate CI caught an isolated test declaration omission. The corrected fixture extracts the actual preview guard, retains every original assertion and verifies post-reconciliation order without a classic preview write. Runtime and SQL remained identical; this corrected exact source passed the full CI above.
- Task runner/container and temporary restore resources were cleaned up. No paid GitHub runner, unrelated workload cancellation or reserve reduction was used.

Before push: 642 integrated, 382 disposable PostgreSQL plus 57 focused hourly SQL, 57 engine/data/replay/tool and focused functional/rendering/scope checks passed. Strict scoped TypeScript, terminal/native/owned/Paper builds and Persian UI inspection passed; retained API targets added no diagnostics. Official CI above remains the release gate.

This verifies deployed code and database contracts, not private-account fills or profitability.
