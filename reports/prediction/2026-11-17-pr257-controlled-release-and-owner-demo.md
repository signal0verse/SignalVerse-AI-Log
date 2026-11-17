# PR 257 controlled Prediction Demo release — 2026-11-17

Updated 2026-11-17 16:10:59 MYT.

## Source and release evidence

- The owner authorized [PR 257](https://github.com/signal0verse/signalverse-main/pull/257), exactly `0578551fa195c17a24d1384bc7579db3a66a824f`, its additive Prediction migration, and owner-only daily and weekly Demo settings.
- Before the release attempt, the healthy production runtime and live symlink were both `59fb9e17a26dcae3eaaee1b58ec6af5efa2f48cd`.
- Source was fast-forwarded from `59fb9e17a26dcae3eaaee1b58ec6af5efa2f48cd` to `0578551fa195c17a24d1384bc7579db3a66a824f`. Main at report time is `0578551fa195c17a24d1384bc7579db3a66a824f`.
- The exact reviewed [PR CI](https://github.com/signal0verse/signalverse-main/actions/runs/43867865322) passed all 94 steps.
- The exact-main [push CI](https://github.com/signal0verse/signalverse-main/actions/runs/44023244059), attempt 2, is **success** with 94 successful steps.
- The first isolated CI attempt was proactively cancelled after its timing fell behind the last successful run by more than the remaining timeout margin. The complete same-source main/push workflow ran on the existing standard GitHub-hosted route within included compute capacity. The isolated-runner repository setting was restored after assignment. No workflow files, job timeout, CI acceptance checks, or billing controls changed.
- [Official retained preparation](https://github.com/signal0verse/signalverse-main/actions/runs/44037637859) produced artifact ID 14308421014. Independent verification matched 2762 Git blobs and modes, 8,382,475 inner archive bytes, and SHA-256 `dd8691bfddc4f2097ad65043de061d5424ab3cd02b2c108968ed261fe75f2bb6`.
- The existing one-use Guard was issued for the independently verified artifact digest.
- [Official controlled delivery](https://github.com/signal0verse/signalverse-main/actions/runs/44042265783) is **success**.

## Migration and runtime

- Full private PostgreSQL backup and isolated cold restore verified at 2026-11-17 15:51:10 MYT. All 150 relation counts and restored catalog/ACLs matched, both SQLite snapshots passed integrity, and the cold rehearsal preserved existing Prediction account/position data and unrelated schema.
- Exactly the additive migration SHA-256 `e17be83fc927cdee7c539dcedaa4635d5eb95f639a35e8310163f6b38bcd9d00` committed at 2026-11-17 15:53:22 MYT. The live columns, validated constraints, enabled triggers, unique partial index, function definitions and restricted execution matched the cold rehearsal. Read-only PostgREST checks passed with 0 retries. No enrollment or fixture rows were created by the migration.
- The deployment success marker was written at 2026-11-17 15:58:30 MYT. Runtime verified at 2026-11-17 15:59:24 MYT. The active SHA, release symlink, running process, public assets, Admin health and all 2762 installed Git blobs and modes matched. The exact Guard was consumed once. The existing rollback pointer retains the prior release. 23 protected controls and 17 job gates matched the preflight.

## Demo and scope

- Daily and weekly evaluation consent persisted for only the requested authenticated account at 2026-11-17 16:01:13 MYT. Existing qualified participation, categories, capital and per-trade cap were preserved.
- Read-only observation found 1 completed scheduled Demo entry ticks in the latest bounded window after consent, of which 1 reported evaluation details.
- The first genuine daily simulated position opened at 2026-11-17 16:06:28 MYT. The first successful normal tick opened both scheduled cadences. The owner-scoped v2 price evidence, no-AI path, chronology, UTC period keys, configured size cap, and exact modeled quote/fee receipts passed read-only reconciliation. Both evaluation rows were OPEN at verification. The next normal resolver call succeeded and the authenticated UI rendered both cadence labels.
- Real Prediction execution and the autonomous learning gate were verified OFF. Existing qualified Demo entry and resolution remained active. The installed scope preserves the original model, order/risk policy, independent modules and scheduler.

## Errors, retries and rollback

- No deployment rollback was observed. Only existing controlled release and recovery mechanisms are in scope.
- A local operator variable shadow caused a serialization error after the cold restore had passed. The retained immutable backup and private cold rehearsal receipts were rechecked, including the original dump digest and both SQLite round trips, and the final metadata receipt was recovered. The source backup and cold migration were performed once.
- The first verification query used fraction bounds for a percentage-valued book midpoint. The operator read was corrected to the repository’s percentage units and repeated with exact receipt checks. Runtime and position data were unchanged.

## Statistical status

Phase 9A statistical validation is **not complete**. Demo positions, isolated test receipts and runtime health do not establish profitability or model superiority. Chronology-uncertified historical observations were not scored.
