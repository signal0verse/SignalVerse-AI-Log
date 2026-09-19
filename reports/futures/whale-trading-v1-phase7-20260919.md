# SignalVerse Whale Trading V1 — Phase 7 production rollout report

- **Task:** Controlled Production Rollout, Public Observation, Natural Qualification
- **Date:** 2026-09-19 (Asia/Kuala_Lumpur)
- **Application repository:** `signal0verse/signalverse-main`
- **Executable PR:** [#86](https://github.com/signal0verse/signalverse-main/pull/86)
- **Executable Production SHA:** `8c27da4b8c12917c8e4d9968fe57a5e10f6a66e6`
- **Production CI:** [run 35438837537](https://github.com/signal0verse/signalverse-main/actions/runs/35438837537) — SUCCESS in 3m42s
- **Documentation PR:** [#90](https://github.com/signal0verse/signalverse-main/pull/90), merged as `2957be4e2ba100ef191d0fbab4f5c9f743c8d0f1` with `[skip ci]`
- **Final-state documentation PR:** [#91](https://github.com/signal0verse/signalverse-main/pull/91), merged as `ee00db43f01cddb0547ece1e43e09ad5152d603a` with `[skip ci]`
- **Outcome:** B — infrastructure rolled out; public observation ran; no natural qualification; Demo stayed disabled; Real stayed locked

## Result

The reviewed Whale Trading release was deployed to Production, the database and
restricted runtime prerequisites were installed, and the worker ran only in
`PUBLIC_OBSERVATION`. It captured 100 live public Hyperliquid Futures fills and proved
durable lease fencing, event uniqueness and fail-closed job processing. It created no
Demo setting, pending signal or trade.

The observation did not qualify a whale. The feed showed recurring WebSocket gaps and
recovery failures. A good pre-restart interval reached `CLOCK_OK`, but the final
post-restart state was `RECOVERY_REQUIRED / CLOCK_UNKNOWN` because no new source fill
had arrived and the feed was disconnected at the audit instant. The Phase 7 stop
condition was applied: the worker was stopped and disabled. Demo was not enabled. No
qualification threshold was changed, no qualification was forced and no evidence was
manufactured.

## Reviewed release and deployment

Before rollout, Production ran `fff033f996e8cb9087c65c605823c82a1b3d5289` and had
no Whale schema, role, user, env or service. PR #86's exact head had already passed:

- 96/96 allowlisted Whale tests;
- 13/13 isolated PostgreSQL groups;
- 348/348 safe workflow-aligned Futures/history/simulation tests;
- strict Whale UI TypeScript;
- main and admin production builds;
- 14/14 production-shaped API bundles;
- Persian RTL and English LTR mobile/desktop UI checks.

PR #86 was marked ready, updated to the Phase 7 scope and merged. The main-branch CI
repeated its tests/build/package gates and atomically activated merge SHA `8c27da4`.
The active symlink, deployment marker, expected Whale files, four main services and
loopback `/healthz` HTTP 200 were verified immediately after deployment.

## Backup and isolated restore gate

A native custom-format PostgreSQL 17 dump was taken before Production DDL:

| Evidence | Result |
| --- | --- |
| Backup directory | `/var/backups/signalverse/whale-phase7-before.Kzk2II` |
| Dump size | 51,213,359 bytes |
| SHA-256 | `61995066b8044815113f1c2b6f35cc0e89379c3238996c52643c6cf922afb911` |
| Restored public tables | 80 |
| Baseline row counts | Unchanged after migration |
| Isolated cluster | PostgreSQL 17, private Unix socket, TCP disabled |
| Migration passes | Required four-file sequence, twice |
| Security checks | RLS, least privilege and Real lock PASS |
| Final state | Cluster stopped; `restore_migration_drill=PASS`; Production DDL still NONE |

Two preliminary operator-harness runs restored the dump and passed the substantive
checks but returned nonzero because of a SQL cast precedence error and then a trailing
PowerShell CR character. Both isolated clusters stopped cleanly. The harness was fixed
and rerun from a fresh dump; the final run above returned exit code 0. These were drill
harness errors, not Production database failures.

## Production database rollout

After the restore gate, the following reviewed additive migrations were applied with
`ON_ERROR_STOP`, in order:

1. `whale_watchlist.sql`
2. `whale_trading_v1.sql`
3. `whale_trading_phase3.sql`
4. `whale_trading_phase4.sql`

Post-migration verification:

- 8 Whale tables and 8 RLS-enabled Whale tables;
- both `whale_pending_demo_only` and `whale_trade_demo_only` constraints present;
- `authenticator` is a member of the no-login `whale_feed` role;
- `anon` and `authenticated` have no Whale table access;
- `whale_feed` reads only `wallet,created_at` from the watchlist and public wallet
  state, and executes only `whale_lease` and `whale_commit`;
- owner/settings/users/jobs/events/qualification/trades reads are denied;
- PostgREST returned HTTP 200 for allowed reads and HTTP 403 for owner/settings reads;
- real-setting and Real-function probes failed as required and persisted no row;
- before watchlist seed, settings/jobs/Whale trades all remained zero.

## Runtime identity and service

The rollout created a no-login `signalverse-whale` user and group with no supplementary
application group. The worker environment is mode `0640`, owned by
`root:signalverse-whale`, and contains exactly these key names:

- `DATABASE_API_URL`
- `WHALE_API_BASE`
- `WHALE_DATABASE_KEY`
- `WHALE_WORKER_SECRET`

No exchange credential, service-role key, copy-trade secret or private key is present.
The worker cannot read `/etc/signalverse/signalverse.env`. The JWT carries only role
`whale_feed`, was issued at `2026-09-19T11:11:10Z`, and expires at
`2026-09-20T11:11:10Z`. No token or secret value was printed or published.

The reviewed unit passed `systemd-analyze verify`. Its first start failed before code
execution with `status=200/CHDIR` because the release tree is group-private to the main
application user. The worker was not added to that group. The standard `acl` package
was installed and a named read/execute ACL was applied only to the release tree, with
an inherited ACL for later releases. The user remained unable to read the main env.
The service then started successfully for the bounded observation. It was stopped and
disabled after the unhealthy final state; the unit, user and protected env remain
installed for a later reviewed fix and rerun.

The unit has `NoNewPrivileges`, `PrivateTmp`, `ProtectSystem=strict`, `ProtectHome`,
`ProtectClock`, `UMask=0077` and restricted address families. The final
`systemd-analyze security` score was 7.5 (`EXPOSED`), which remains a hardening
limitation rather than being hidden as a pass.

## Clock and public observation

Immediately before start, `systemd-timesyncd` reported synchronized UTC with public
source `185.125.190.58`, stratum 2, normal leap, +0.550 ms offset, 0.934 ms jitter and
3.531 ms root distance. No time setting was changed.

Three previously observed public Hyperliquid wallets were placed in slots 1–3 for the
existing owner. No settings row was created, so the runtime used the fail-closed
`PUBLIC_OBSERVATION` default. The observation ran from the successful start at
`2026-09-19T11:15:27Z` through the last active snapshot at `11:35:51Z`, a duration of
20 minutes 24 seconds, including a controlled restart at `11:23:33Z`.

| Metric | Actual result |
| --- | --- |
| Wallets | 3 public wallets |
| Events | 28,981 total: 28,881 historical, 100 live |
| Event identity | 28,981 distinct IDs; worker duplicate count 0 |
| Live data quality | 100 `LIVE`, 0 `DELAYED` |
| Live observed latency | 299–580 ms; average 343.2 ms |
| Queue | high-water 2; final ready 0, processing 0, done 100 |
| Decisions | 99 `NOT_QUALIFIED`, 1 startup `CLOCK_NOT_OK` |
| Qualification | 0 `QUALIFIED`; final profiles `WATCHLIST` |
| Settings | 0; Demo enabled rows 0 |
| Pending / Whale trades / Real Whale trades | 0 / 0 / 0 |
| Release identity | exact `8c27da4...`; `realLocked=true` |

One pre-restart interval had all three wallets live, a connected feed, zero queue
backlog, 100 source samples, `CLOCK_OK`, 3.531 ms uncertainty and zero duplicates. The
feed did not remain stable: the first lifecycle reached 10 gap events and 17 recovery
failures. The final lifecycle after restart reached 23 gaps and 23 recovery failures.

The controlled restart changed PID. Four attempted replacement starts were rejected by
the durable 45-second lease with `WORKER_ALREADY_RUNNING`. After lease expiry, systemd
started one new holder automatically; SHA, Real lock and zero pending/trades were
preserved. The new process received no source fill before final audit, so it correctly
did not inherit earlier clock samples and remained `CLOCK_UNKNOWN`.

At the last active snapshot the worker queue was empty, but the feed was disconnected,
one wallet was stale and health was `RECOVERY_REQUIRED`. Two wallet histories remained
incomplete. This blocks a stable observation claim and every Demo gate. The worker was
then stopped and disabled. At `2026-09-19T11:36:59Z`, main/admin/PostgREST/PostgreSQL
were active, main health was HTTP 200, the executable SHA was unchanged, all 28,981
events and 100 jobs were preserved, settings/pending/trades remained zero, and both
Real constraints remained active.

## Real lock and trading impact

- No private exchange credential was provided to the worker.
- No private-account API or execution adapter was invoked.
- No Whale pending signal or trade was created.
- Demo was not enabled.
- Real was rejected by database, service and API boundaries.
- Standard Futures services remained active; no existing trade/protection state was
  changed by the Whale rollout.
- No profitability claim is made.

## Commit and publication state

- Executable PR #86: merged.
- Production CI run 35438837537: success.
- Active executable Production SHA: `8c27da4b8c12917c8e4d9968fe57a5e10f6a66e6`.
- Documentation commit: merged by PR #90 as `2957be4e2ba100ef191d0fbab4f5c9f743c8d0f1`.
- Stop-condition handoff: merged by PR #91 as `ee00db43f01cddb0547ece1e43e09ad5152d603a`.
- The docs merge used `[skip ci]`; no second executable deployment was started.
- Repository handoff: `docs/whale-trading-phase7.md`, `HANDOFF.md`, and
  `docs/AI_HANDOFF.md`.

## Rollback

The immediate operational rollback was performed: `signalverse-whale.service` is
stopped and disabled, and the watchlist plus all audit data are preserved. If full
removal is required, restore the main env from
`/etc/signalverse/signalverse.env.whale-phase7-before.20260919T111110Z`, restart the
main service, remove the worker env/unit/user and named release ACLs, and keep standard
Futures protection running. Application rollback can atomically reactivate
`fff033f...`. Database restore must use the verified native dump during a planned
outage; audit rows must not be deleted to make health look green.

## Remaining gates

1. Keep the worker stopped. Before any restart, issue a fresh restricted JWT if the
   current token has expired.
2. Diagnose recurring WebSocket gaps and recovery failures without relaxing clock,
   completeness or qualification thresholds.
3. Repeat a substantially longer public observation with connected feed, fresh
   checkpoints, bounded recovery, `CLOCK_OK`, zero duplicates and drained queue.
4. Consider Demo only after natural qualification and a separate explicit owner
   authorization. Real Whale Trading remains locked.

This report records a controlled Production infrastructure rollout and Outcome B. It
does not claim a stable feed, authorized Demo lifecycle, Real execution or profit.
