# Current saved Scalp policy for prospective scenarios: verified release

Date: 2026-10-18 (Asia/Kuala_Lumpur). Deployed and verified on SignalVerse and the shared CrossVerse terminal.

Source: `5886eb77f0e4165839c7bc1763bc1f8841f5c1dc`. Predecessor: `666514422455a56130a8511af4f1f5906484cfd8`.
Repository: `signal0verse/signalverse-main`, branch `main`.

## Released behavior

For every independent technical Scalp asset, newly accepted scenarios 2–4 use the same account's current saved tools, explicit 15-minute confirmation policy and hourly policy. The Medium `scalp-15m-v1` policy requires a minimum score of 3. Profiles without explicit opt-in retain the strict legacy minimum of 4; deployment does not force all users to Medium or save/enable a profile.

Scenario 1 and every previously accepted scenario, purchase, sale, allocation, level and strategy snapshot remain immutable. Each new later scenario freezes its own current-policy provenance on acceptance. Preview displays the settings source, revision, scenario, tools/15-minute/hourly versions and effective minimum. Its cache follows that revision. Final admission rejects analysis whose profile changes before acceptance; Paper repeats this check inside its write transaction. The provisional preview cannot place orders, reserve capital or charge credit.

Canonical 5-minute LONG analysis, valid bullish 15-minute trend, at least two bullish and at most one bearish momentum component, complete closed candles, reaction, hourly, liquidity, cost, depth, capital, plan, credit and durable uncertain-order holds remain independent requirements. No symbol-specific exception exists. No profile save/activation, forced engine tick, acceptance trade or order-hold alteration was used for release verification.

## Verification

- [Official exact-source CI](https://github.com/signal0verse/signalverse-main/actions/runs/39058461002): all 79 steps passed.
- [Immutable artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/39064900586): artifact `12112593432`; all 2447 blobs and modes match the commit. Archive SHA-256: `5a180d94757bd5acd8dd879b9cd10c5e0119e4611ddb3bc8472f6544ba798b7d`.
- Closed 29-file scope, 9 additions and 20 reversible predecessor projections verified. Original safety and release gates were retained.
- Fresh deployment-operator tests verified complete transaction rollback on function-definition, privilege, constraint and saved-row mismatches in a disposable PostgreSQL cluster. Private consistent PostgreSQL/SQLite backups, full isolated cold restore, every backup table count and exact migration rehearsal passed. Restore had no network or production-directory access, a 2 CPU / 3 GiB cap, a private temporary filesystem and full 2 GiB reserves. Temporary resources were removed.
- `spot_scalp_scenario_policy.sql`, SHA-256 `65a791c21a21d60f91f16ea1a779299c1d12aa06be313743dcded18c32849c41`, changes only the two technical admission wrappers and their two existing cycle guards. All unrelated catalog objects, function ACLs and saved profile/setup/cycle bytes were preserved. No new function, constraint or user-row rewrite was introduced.
- The initial isolated cold restore hit its unchanged 3 GiB memory cap while creating an index. Recovery reused and reverified the original retained PostgreSQL/SQLite backup bytes, with no new snapshot. Data remained on private tmpfs; post-data indexes and temporary index files used a fixed, preallocated 512 MiB private disk filesystem. Synthetic PG17 restore/index-placement and corrupt-retention tests passed before recovery. Full restore/table-count/DDL/ACL checks and the original 2 CPU / 3 GiB / zero-swap / no-network / 2 GiB reserves remained required; the loop, image and both private mounts were removed.
- Installed independent Guard approved the exact source/archive digest, followed by the [official production release](https://github.com/signal0verse/signalverse-main/actions/runs/39066771318).
- Native, owned, admin and Paper process versions and health matched this source. All 13 Paper executable files and metadata matched an exact-source build; service, Spot scanner, store admission and metadata changed. SQLite schema and existing write/serialization statements stayed identical.
- Both public origins served matching manifests and asset hashes/lengths, including native frontend and analytical worker assets. Current-policy provenance markers were present in actual compiled terminal/runtime files.
- Only the two explicitly approved superseded versions were privately archived, fully compared, audited for live use and removed. Two obsolete task staging links were separately recorded and retired; no target data was removed through those links. Current and predecessor rollback versions and all backups were preserved. Full disk reserve and predecessor-plus-margin capacity remained required.
- Task runners, containers and temporary restore resources were cleaned up. No paid GitHub runner or cancellation of unrelated work was used.

Before push: 691 integrated, 15 focused and 70 closed-scope checks passed. All 382 predecessor PostgreSQL checks passed; a new local SQL precedence issue was repaired with parentheses alone and 43 fresh checks passed against the exact repaired bytes. Scoped strict TypeScript, zero additional API diagnostics at the retained target, native/admin/owned/shared/Paper builds and synthetic Persian UI review passed. These local checks supplement the full official CI above.

This verifies deployed code and database contracts, not private-account fills or profitability. No account records, private archives, screenshots or credentials are included in this report.
