# Windows backups, Data and AI Log — audit and owner-requested disable

## Metadata

- Date: 2026-10-25T05:34:43+08:00 (Asia/Kuala_Lumpur). Server evidence was collected on 2026-10-24 at 21:23–21:30 UTC, which is 2026-10-25 05:23–05:30 locally.
- Task ID: backup-audit-20261025
- Module: Infrastructure / local Windows automation
- Mode: read-only investigation, followed by explicitly authorized disabling of two Windows scheduled tasks.
- Repository: signal0verse/signalverse-main; inspected application commit `0dbca62357a4adf34240f40ceda3e387356ec4b0` on `codex/prediction-coverage-expansion-audit`.
- Live deployed marker: `2da63dc5441928c5c325067869445e8732bde48c` (read, not deployed by this task).
- Ending application code: unchanged. The task handoff is a separate documentation-only publication; no main integration or production release.
- AI Log local clone: master `445632d3ed564c6d4c8e50e211d1e0aa3b678cf3`; remote master at the comparison was `c3a3bdaba5e4e87d28829fda916a66bd5325cda4`.

## Objective

The owner asked what the local backups contain, whether they work, whether the server already backs up the same data, and what `C:\Projects\SignalVerse-Data` and `C:\Projects\SignalVerse-AI-Log` contain. The owner then explicitly requested turning off the automatic Windows backups/exports at computer startup, shutdown and periodic execution. No deletion, server backup reconfiguration or production mutation was requested.

## Scope

Inspected file metadata, backup manifests and bounded logs; source code of the local backup/export launchers; Windows Task Scheduler registrations; existing server backup catalogs, hashes, proof files, timers and read-only PostgreSQL catalog. CSV/application row contents, secrets and private master-key contents were not printed or published. Existing database dumps remained in place and were not downloaded.

## Actions Taken

1. Inventoried the three owner-named local paths and their sizes without following junctions.
2. Read backup manifests/logs and inspected backup/export source without running either exporter.
3. Inspected the exact two Windows tasks and saved their complete pre-change XML definitions privately in ignored `tmp/backup-audit-20261025/`.
4. Inspected live server backup storage, schedules, existing restore proof and the newest native PostgreSQL archive catalog. Compared all current public table names against the archive and local configured table list.
5. Computed SHA-256 of the existing newest server database dump and matched its recorded cold-restore proof. No fresh database restore was performed.
6. Compared local AI Log master against GitHub using GitHub's compare API; no pull/reset or unrelated report modification.
7. Disabled only the two explicitly requested Windows tasks. Initial non-admin attempt disabled DB Backup but hit Windows Access Denied for TradeExport. The reviewed narrow helper was then launched through standard Windows UAC; its Administrator action completed and verified both tasks disabled at **2026-10-25T05:33:01.8819822+08:00**.
8. Preserved all existing files and unrelated working changes. No backup job was started, no backup was pruned and no server setting changed.

## Findings — Windows automatic tasks

| Task | Before | Trigger actually registered | Final verified state |
|---|---|---|---|
| SignalVerse-DB-Backup | enabled / Ready | daily 03:00 local; catch up when available | **Disabled / Enabled=false** |
| SignalVerse-TradeExport | enabled / Ready | logon plus event/shutdown trigger; source installer identifies shutdown/restart Event 1074 | **Disabled / Enabled=false** |

Neither registered trigger set had an active repetition interval. The old source comments mention every five minutes, but the current installer and live task use logon/shutdown instead. Disabling the whole task disables all of its triggers, including any later scheduled instance until explicitly re-enabled.

DB Backup executed `scripts/run-backup.bat`, which runs `node scripts/backup-database.mjs`. TradeExport executes Windows `wscript.exe` with `scripts/run-export-hidden.vbs`, which waits for `export-trades.mjs`. No Windows/Microsoft backup, unrelated task or production scheduler was disabled.

Before disable, DB task last ran 2026-10-25 04:13:19 locally, with recorded result **3221225786 / 0xC000013A**. The log includes `^C` interruption markers; exact actor/cause for each interruption was not proven. Its previous settings included a 15-minute execution limit, no wake-to-run and battery restrictions. TradeExport last reported task result 0, but its outputs were stale. The VBS wrapper ignores the child process return value, so task result 0 does not establish successful CSV export.

## Findings — what the three paths are

| Local path | Measured content / size | Meaning and freshness |
|---|---|---|
| SignalVerse-Main/backups | 620,538,136 bytes, about 591.8 MiB | incomplete daily table JSON exports plus older native dump, release evidence and unique local-retirement/source archives |
| SignalVerse-Data | 282 files; 117,479,629 bytes, about 112.0 MiB | historical CSV research exports and older JSON/safety snapshots; not a current complete production backup |
| SignalVerse-AI-Log | 440 files including Git metadata; 6,767,015 bytes, about 6.5 MiB | a Git repository of engineering reports and decisions; not the live service log and not a database backup |

Drive C had about 236.7 GiB free in the initial metadata reading. Disk exhaustion was not established as the local failure cause. The folder inventory skipped the known archived node_modules junction and did not follow its target.

The Data directory contains 16 CSV files; the main recurring CSVs were last modified 2026-09-02, its newest export log 2026-09-07, and its snapshot group no later than 2026-09-04. The last inspected export log says `pending_signals: Bad Request` and “Previous backup preserved.” This is useful historical material, not evidence of a working current mirror. The production Linux runtime does not depend on these Windows-local CSV paths. A search of api/src/server/ops/workflows found no use of these local export paths.

AI Log local master had no tracked changes in the successful elevated read. GitHub master was **73 commits ahead**, zero behind, before this report publication. That is a stale local clone rather than lost GitHub reports. No local synchronization was performed. This new report is published directly to the mandatory remote master and verified independently; it does not imply that the old local clone was updated.

## Findings — local database backup is incomplete

There were **13 retained timestamp directories**: 6 failed manifests, 7 missing manifests, **zero successful manifests**. The newest directory `2026-10-24T20-13-22` (created 2026-10-25 04:13 local) contained **zero files**. Directory existence and a recent name are not backup success.

| Retained run (UTC stamp) | Manifest | Files | Principal evidence |
|---|---|---:|---|
| 2026-10-12T19-00-03 | ABSENT | 6 | interrupted / no completion receipt |
| 2026-10-13T19-00-03 | ABSENT | 5 | interrupted / no completion receipt |
| 2026-10-14T19-00-03 | FAILED | 63 | engine_decisions: Invalid string length, prediction_predictions: Invalid string length, stablecoin_pair_snapshots: Invalid string length |
| 2026-10-15T19-00-04 | ABSENT | 0 | empty directory |
| 2026-10-16T19-00-04 | FAILED | 63 | engine_decisions: Invalid string length, prediction_predictions: Invalid string length, stablecoin_pair_snapshots: Invalid string length |
| 2026-10-17T19-00-02 | FAILED | 63 | engine_decisions: Invalid string length, prediction_predictions: Invalid string length, stablecoin_pair_snapshots: Invalid string length |
| 2026-10-18T19-00-03 | ABSENT | 33 | interrupted / no completion receipt |
| 2026-10-19T19-00-03 | FAILED | 63 | engine_decisions: Invalid string length, prediction_predictions: Invalid string length, stablecoin_pair_snapshots: Invalid string length |
| 2026-10-20T19-00-03 | FAILED | 1 | all 65 tables: Database connection error |
| 2026-10-22T03-40-34 | FAILED | 1 | all 65 tables: Database connection error |
| 2026-10-22T19-00-03 | ABSENT | 6 | interrupted / no completion receipt |
| 2026-10-23T19-00-04 | ABSENT | 4 | interrupted / no completion receipt |
| 2026-10-24T20-13-22 | ABSENT | 0 | empty directory |

The script accumulates all rows of a table in memory, then JSON-stringifies the whole array. `engine_decisions`, `prediction_predictions` and `stablecoin_pair_snapshots` repeatedly failed with **Invalid string length**. Other executions recorded **Database connection error** or ended without any manifest. The last “success” in the retained historical log was 2026-09-26T19:00:03Z (2026-09-27 03:00 local); that is the script's own old-list success message, not proof of full inventory coverage.

The local TABLES list covers **65** names, while a live READ ONLY catalog query found **103 public tables**: **38 current public tables are omitted**, including autonomous Prediction ledgers, newer Futures protection/discovery/reanalysis records, Stablecoin allocation/reserve/withdrawal tables, Spot discovery and Whale records. Non-public partner schemas are also outside this public-JSON exporter. Even an all-green run of the present fixed list would not be a complete database backup.

Additional static limitations, not fixed because the owner requested disabling: offset pagination has no shared consistent database snapshot; JSON exports omit schema/functions/roles; full-table buffering causes growth failures; pruning runs before failure is raised and counts every subdirectory toward 14, including special archives. The log confirms an old backup was deleted even after a zero-row failed run. The exporter also lacks a request timeout. No pruning or exporter execution was invoked during this task.

## Findings — actual server backups

**CONFIRMED: the server has substantial main-database release safety backups in addition to the separate daily SQLite backups.** Looking only in `/var/backups/signalverse` would miss the newer generations under `/var/lib/signalverse-deploy/backups`.

| Scope | Actual evidence | Schedule / limitation |
|---|---|---|
| Main PostgreSQL + release safety state | 32 release backup directories; 3 retained native database.dump payloads after existing retention; newest payload 753,980,010 bytes | tied to controlled release/safety snapshots; no independent daily main-PostgreSQL backup timer/cron was found |
| Newest main PostgreSQL dump | created 2026-10-22 20:18:12 UTC; file completed 20:21:17 UTC = **2026-10-23 04:21:17 Asia/Kuala_Lumpur** | about 49 hours old at this audit; does not contain changes after its snapshot |
| Main dump integrity / recorded recovery | pg_restore --list exit 0; all **103 current public table names** represented, **139 table-data entries across schemas**; current SHA-256 equals stored proof | proof records consistent snapshot, cold restore and table-count verification PASS; those recovery steps happened previously, not newly executed now |
| Admin auth SQLite + matching master key | daily timer enabled; latest snapshot 2026-10-24 03:22 UTC; manifest integrity=ok and keyCheckMatched=true; fresh immutable read-only quick_check=ok | next scheduled 2026-10-25 ~03:23 UTC (~11:23 local); covers admin auth, not trading database |
| Internal Paper ledger SQLite | daily 02:35 UTC timer enabled; latest additional snapshot 2026-10-24 20:57 UTC; compressed metadata integrity_verified=true | latest gzip about 265 MB, represents about 1.65 GB raw; this task did not decompress/re-restore that newest compressed payload |
| Older manual safety dumps | observed in /var/backups/signalverse and /root/backups, including 2026-10-10 and older | historical material; not the newest restore point |

Newest main dump SHA-256: `8ac8ec6ebedc2f0d444554841f0433881a37dd2254eb2a320d3ec7d2da9c02a5`. Its stored proof reports `cold_restore_verified=true`, `all_backup_table_counts_verified=true`, and `tables_verified=139`. Catalog-name comparison certifies names represented, not equality of current live data to a two-day-old snapshot. No fresh cold restore or private account execution was claimed.

The installed server capacity-maintenance source retains selected verified release generations (latest three plus bounded weekly selections and active/previous references) and Paper generations (latest seven plus weekly selections), with verified lossless compression. This inspection did not run maintenance or delete payloads. Older proof directories can remain after the large payload is pruned, so a historical PASS JSON alone is not evidence that its dump still exists; the three retained payloads were checked separately.

The main PostgreSQL cluster and PostgREST were active, and the direct READ ONLY catalog query succeeded. This disproves an inference that local “Database connection error” alone establishes an offline server database. It does not establish the precise public PostgREST/credential-path cause. PostgreSQL archive_mode was off; no WAL archiving/PITR was established. No remote/off-host backup destination or provider-level VPS snapshot schedule was verified. OS dpkg-db-backup is package metadata backup, not the application database.

## Decision — is this Windows folder needed?

The production service needs none of these Windows paths to run. The owner-requested automatic local jobs are now off. The broken JSON directory is not a reliable substitute for the verified native server dump, and running it again unchanged would not solve its size/coverage/snapshot limitations.

However, **same-server release backups are not a complete daily/off-host recovery policy**. The main database snapshot cadence presently depends on releases; latest inspected main data are from October 23 local time. A complete replacement for computer-based backup should be a bounded native PostgreSQL backup on the server with an agreed RPO, verified restore tests and an encrypted copy outside this VPS (plus necessary independent auth keys/config and SQLite stores). The off-host destination does not need to be this computer. This is a recommendation, not infrastructure implemented here. Existing daily admin/Paper backup tasks remain enabled.

Do not describe Data as a current full backup or AI Log as the runtime/database backup. Do not automatically delete the whole backups folder: it also contains local-retirement archives, source/release evidence and historical files beyond the failed daily snapshots. The user requested automation off, so all three folders and their contents were preserved.

## Implementation

- **Changed:** only Windows task Enabled state for SignalVerse-DB-Backup and SignalVerse-TradeExport, verified Disabled.
- **Preserved:** all task trigger definitions and actions (pre-change XML saved privately), all existing data/backup/report files, all server backup jobs and runtime.
- **Application production code:** NONE. No migration, database mutation, new backup, restore, deployment, service restart, exchange request or trading action.
- Local audit helpers/receipts are ignored under tmp; only sanitized report and task handoff are eligible for Git publication.

## Checks Executed

| Check | Actual result |
|---|---|
| Local metadata / manifests / bounded logs | completed; exposed incomplete/empty backups and stale Data exports |
| Windows task definitions and execution metadata | read; daily and logon/event triggers identified; no active repeating interval |
| Task XML rollback snapshots | two saved locally; never published |
| Initial Disable-ScheduledTask | DB task disabled; TradeExport Windows Access Denied; partial result preserved, not misreported as success |
| Reviewed UAC helper | completed; both task states Disabled, Enabled=false |
| Existing native pg_restore catalog / table-name comparison | exit 0; 103 public names, 139 total data entries, zero missing current public names |
| Current SHA-256 vs stored main restore proof | MATCH |
| Fresh admin backup immutable quick_check | ok |
| Paper fresh immutable quick_check | ok for an older uncompressed backup inspected; not the newest compressed gzip |
| PostgreSQL catalog/settings | explicit READ ONLY transaction, statement timeout, ROLLBACK; succeeded |
| AI Log compare | remote ahead 73 / behind 0 before this publication |
| Source build/application suites | not run; no production code change |

An optional schema-only HTTP probe using the local database service-role credential was **rejected by automatic approval review before execution**: sensitive credential egress was not specifically authorized by the audit request. It was not retried or routed through another path. It was unnecessary to establish the file, scheduler and native-backup findings. Exact public backup-API connection diagnosis therefore remains unverified. GitHub report access/publication is a separate owner-required operation and does not use that database credential.

## Files Inspected

AGENTS.md, CLAUDE.md, latest HANDOFF.md and docs/AI_HANDOFF.md entries, colleague release boundary, AI Log README/template/scanner; scripts/backup-database.mjs, run-backup.bat, verify-backup-coverage.mjs, export-trades.mjs, run-export-hidden.vbs, setup-export-scheduler.ps1; ops/admin-backup.mjs and admin timer/service; Paper backup source; installed server backup retention source; existing backup manifests/proofs and native archive catalogs. Raw private rows, key files and environment values are not in this report.

## Git Status / Commit

Primary executable files unchanged. The pre-existing HANDOFF delta was **+352/-0 lines** before this task and must be retained byte-for-byte. Only the new task-specific note is staged separately if publishing the documentation branch; none of those previous 352 lines are included in the new commit. Other untracked work is preserved. The stale AI Log local clone is not reset/pulled or modified; publication uses the new report only on remote master. Publication receipts record exact commit/blob and remote-byte comparison.

## Risks / Limitations and Remaining Issues

- No fresh full recovery drill, latest Paper gzip decompression or provider snapshot/off-host destination verification.
- Main database recovery point is release-bound and older than the live database; turning off the unreliable Windows jobs does not create a new replacement policy.
- Local credential-path/network connection failure is not diagnosed; latest worker interruption causes are not all certified.
- Public schema coverage is 103/103 in the newest catalog, but no audit of live-versus-snapshot private row content was performed.
- Admin key consistency is based on its saved manifest plus fresh SQLite quick_check; key contents were not read.
- No filesystem deletion or secure-erasure operation occurred. Existing private exports remain private local material and should not be committed or sent to AI Log.

## Recommended Next Step

Keep the two Windows jobs disabled as requested. If a server-only operational solution is desired, separately implement daily native backup plus encrypted off-host delivery and scheduled restore verification; preserve current release/admin/Paper safeguards. Any cleanup of the historical Windows files should be scoped separately to avoid removing unique retirement/source archives. AI Log can later be fast-forwarded independently if a current local report copy is wanted.
