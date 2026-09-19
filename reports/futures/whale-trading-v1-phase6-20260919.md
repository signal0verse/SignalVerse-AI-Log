# SignalVerse Whale Trading V1 — Phase 6 engineering handoff

- **Task ID:** Whale Trading V1 Phase 6 — Controlled VPS Observation, CLOCK_OK Verification & Natural Qualification
- **Date:** 2026-09-19 (Asia/Kuala_Lumpur)
- **Application repository:** `signal0verse/signalverse-main`
- **Branch:** `codex/whale-trading-v1`
- **Starting commit:** `c82f675707ddb98045a57dc0efaf159b115b514d`
- **Ending commit:** `ece949192fc1e542564665eb863bbcb40c5b6e4b`
- **Draft PR:** [#86 — Prepare Whale Trading Phase 6 VPS observation](https://github.com/signal0verse/signalverse-main/pull/86)
- **CI:** [Production CI run 35437918690](https://github.com/signal0verse/signalverse-main/actions/runs/35437918690) — SUCCESS in 2m21s
- **Outcome:** B — production prerequisites absent; no forced qualification, VPS worker observation, Demo lifecycle or Real execution

## Result

Phase 6 audited the actual production VPS before any change and prepared the branch for
a reviewed observation rollout. The host is healthy and its `systemd-timesyncd`
evidence is within the existing clock thresholds, but the active production release
contains no Whale code or migration files and the host has no Whale schema, database
role, OS user, environment or service. Starting the requested VPS observation would
therefore require release, database and service changes for which this task did not
contain explicit production-rollout authorization.

The work stopped before those writes. No production release, database, service, clock,
credential, account or order was changed. A live VPS observation, natural qualification
and authorized Demo lifecycle did not occur. Real Whale Trading remains hard-locked.

## Actual read-only VPS audit

The audit ran over the configured SSH endpoint at `2026-09-19T10:26Z`. It used only
read commands and did not print environment or configuration secret values.

| Audit item | Actual result |
| --- | --- |
| Host | `vmi3541699`, Ubuntu 24.04.4 LTS, Linux 6.8.0-136, UTC |
| Active release symlink | `/opt/signalverse/releases/fff033f996e8cb9087c65c605823c82a1b3d5289` |
| Deployment marker | `fff033f996e8cb9087c65c605823c82a1b3d5289` |
| Node | 22.23.2 |
| Main application | `signalverse.service` active/running and enabled as `signalverse` |
| Admin application | `signalverse-admin.service` active/running as `signalverse_monitor` |
| Public health | loopback `/healthz` HTTP 200; `/api/healthz` HTTP 404 because it is not the configured health route |
| PostgREST | 16.2, active/running as `postgrest` |
| PostgREST config metadata | `/etc/postgrest/postgrest.conf`, mode 0640, owner `root`, group `postgrest`; contents not printed |
| PostgreSQL | `signalverse_cutover2`, server/client 17.11, cluster 17/main online |
| Whale files in active release | worker, clock module, unit and all four Whale migrations absent |
| Whale system identity | `signalverse-whale` user absent |
| Whale service | `signalverse-whale.service` not installed |
| Whale environment | `/opt/signalverse/shared/whale-worker.env` absent |
| Whale schema | `whale_watchlist`, `whale_wallets`, `whale_events`, `whale_jobs`, `whale_qualification_events` absent |
| Whale DB role/functions/RLS/policies | `whale_feed` absent; 0 Whale functions, RLS tables and policies |
| Existing `copy_trades` | present from standard application; not evidence of Whale migration |
| Backup/restore tooling | `pg_dump` and `pg_restore` present |
| Most recent observed full dump | 2026-09-08, 10,958,743 bytes; no Phase 6 pre-migration dump was created |

## Clock synchronization

The VPS uses `systemd-timesyncd`; chrony is not installed. Authoritative evidence from
`timedatectl status`, `timesync-status` and `show-timesync` reported:

- system clock synchronized: yes;
- NTP service active, UTC timezone, RTC not in local time;
- source `185.125.190.58 (ntp.ubuntu.com)`, stratum 2, leap normal;
- offset `-290 µs` (`-0.29 ms`);
- jitter `1.173 ms`;
- root distance `3.554 ms`;
- packet count 349 and poll interval 34m08s at audit time.

The host reading is inside the existing absolute-offset threshold of 100 ms and
uncertainty threshold of 50 ms. Phase 6 adds a fail-closed parser for detailed
`systemd-timesyncd` evidence. It requires `NTPSynchronized=yes`, a normal leap state
and a named server, and conservatively uses the larger of jitter and root distance as
uncertainty. The existing thresholds, minimum three source samples and maximum 50 ms
source lead were not changed.

**Production runtime clock status remains `CLOCK_UNKNOWN / NOT VERIFIED`.** The parser
is not deployed, the worker is absent and no Hyperliquid source samples were processed
on VPS. Host NTP evidence alone cannot satisfy the source-sample/source-lead gate.
One-way latency is therefore `NULL / NOT MEASURED`, not 0 ms.

## Delivered repository changes

- Added detailed `systemd-timesyncd` parsing while preserving chrony, Windows and
  incomplete-evidence fallbacks.
- Added clock uncertainty and maximum source lead to the English/Persian operations UI.
- Added worker queue maximum/high-water/drain time, recovery failures, feed gaps and
  exact duplicate-event counters to health output and the bilingual UI.
- Preserved idempotent duplicate handling while making identical duplicates countable.
- Added `scripts/whale-vps-audit.sh`, a read-only evidence collector that never sources
  env files, prints secret values, changes services/time or writes to PostgreSQL.
- Added Phase 6 test coverage and included it in Production CI.
- Added the Phase 6 handoff, safe runbook and exact reviewed rollout/rollback boundary.

Qualification thresholds, score weights, history/funding rules, Central Futures Engine,
AI reviewer role, user sizing, user leverage/margin, protection, Demo authorization and
Real execution paths were not changed.

## Evidence by class

### LIVE PUBLIC OBSERVATION

**NOT VERIFIED on VPS in Phase 6.** No worker/schema exists in production. Phase 5's
local public observation remains prior evidence and was not relabelled as VPS evidence.

| Required metric | Phase 6 result |
| --- | --- |
| Observation start/end | NOT RUN |
| Wallets observed / public fills | NOT VERIFIED / NOT VERIFIED |
| Reconnects / feed errors / worker errors | NOT VERIFIED |
| Stale wallets / queue depth / queue max / drain | NOT VERIFIED |
| Checkpoints / recovery results | NOT VERIFIED |
| Gap / duplicate events | NOT VERIFIED |
| Qualification transitions / Qualified Whale count | NOT VERIFIED / 0 observed in Phase 6 |
| Engine candidates / approvals / rejections | NOT VERIFIED / NOT VERIFIED / NOT VERIFIED |
| Demo entries / exits | 0 / 0 |
| Protection / lifecycle events | 0 / 0 |
| T0–T6 latency / entry drift | NOT MEASURED / NOT APPLICABLE |
| Real orders | 0 caused by this task |

No zero is used above as a substitute for an unavailable health or latency measurement.

### AUTHORIZED DEMO E2E

**NOT VERIFIED.** No natural qualified Whale appeared in a VPS window, no Demo mode was
enabled and no production Demo account was used. No entry, protection modification,
partial/full exit or post-trade evaluation occurred.

### SYNTHETIC INTEGRATION

- **96/96 PASS** in the allowlisted Whale suite.
- Coverage includes `CLOCK_OK`, `CLOCK_DEGRADED`, `CLOCK_UNKNOWN`, actual captured VPS
  timesync parsing, offset/uncertainty/source-lead thresholds, monotonic timing, queue
  bound/high-water/drain, worker restart, isolated recovery/backoff, gap/duplicate
  counters, singleton lease paths, Central Engine integration, protection and Real lock.
- **348/348 PASS** in the workflow-aligned safe Futures/history/simulation regression.
  This included isolated real-execution fault paths and MEXC fault paths with zero
  network, database or real order calls in their harnesses.

### ISOLATED POSTGRESQL

- **13/13 PASS** on a disposable PostgreSQL 18.4 cluster.
- All four Whale migrations applied twice.
- Dedicated `whale_feed` denial, RLS, owner scoping, singleton lease, revision fencing,
  atomic commit/deduplication, qualification audit, forged Real lock, concurrent Demo
  activation/close, actual state→Engine→Demo→protection flow, and backup/restore passed.
- The initial sandboxed Windows run could not create a restricted PostgreSQL token; the
  same isolated loopback test passed with the approved execution context. Production
  PostgreSQL was never used for tests or writes.

### HISTORICAL REPLAY

Unchanged and separate. No historical replay result is reported as a public observation,
natural qualification or authorized Demo lifecycle.

## Build, UI and CI verification

- Strict TypeScript for the Whale UI: PASS.
- Main web production build: PASS.
- Standalone admin production build: PASS.
- Production-shaped API bundling: 14/14 handlers PASS.
- `git diff --check` and audit-script bash syntax: PASS.
- Persian RTL at 390×844: PASS; new clock/operations labels visible; no document-level horizontal overflow.
- English LTR at 390×844: PASS; new labels visible; no document-level horizontal overflow.
- English desktop at 1440×900: PASS; eight tabs and no document-level horizontal overflow.
- GitHub Production CI run 35437918690: SUCCESS. Packaging and production delivery
  steps were correctly skipped for a pull-request run.

## Security verification

- Proposed unit still runs only as `signalverse-whale`, with `UMask=0077`,
  `NoNewPrivileges=true`, `ProtectSystem=strict`, `ProtectHome=true`,
  `ProtectClock=true`, restart-on-failure and application-env inaccessible paths.
- Worker config still accepts only `DATABASE_API_URL`, restricted `WHALE_DATABASE_KEY`,
  dedicated loopback `WHALE_WORKER_SECRET` and loopback `WHALE_API_BASE`.
- Worker code rejects broad database role tokens, external dispatch origins, exchange
  keys/secrets, service-role key and copy-trade sync secret.
- VPS environment did not exist, so production file permissions/JWT role isolation are
  prerequisites rather than claimed passes.
- No service-role, exchange, signer/private-account, internal copy-trade or frontend
  secret was read, logged or published.

## Real-lock verification

Branch tests passed the UI, API, pending validation, execution and database Real locks.
`PUBLIC_OBSERVATION` remains the required first mode. The production VPS has no Whale
runtime, so a public Whale event cannot currently reach either Demo or Real there. No
private exchange credentials or execution adapter was invoked.

## Commit, PR and publication state

- Phase 6 commit `ece949192fc1e542564665eb863bbcb40c5b6e4b` was pushed to
  `codex/whale-trading-v1`.
- PR #86 remains open and draft; title/body now describe Phase 6.
- CI passed on the exact ending commit.
- The application branch was not merged into `main` and was not deployed.
- Active production SHA remained `fff033f996e8cb9087c65c605823c82a1b3d5289`.
- No production migration, backup, restore, user/env/service installation or activation
  was performed.

## Required reviewed production action

**WHY REQUIRED:** production has no reviewed Whale release files, schema, role, OS
identity, environment or service, so a VPS observation cannot start.

**EXACT CHANGE:** after explicit rollout authorization, merge PR #86 so CI deploys the
reviewed SHA and verify both active symlink and deployment marker. Create a fresh
custom-format dump of `signalverse_cutover2`, restore it into a disposable database and
run integrity/constraint checks. Apply with `ON_ERROR_STOP` and a single transaction:

1. `migrations/whale_watchlist.sql`
2. `migrations/whale_trading_v1.sql`
3. `migrations/whale_trading_phase3.sql`
4. `migrations/whale_trading_phase4.sql`

Then verify RLS/grants and database Real locks, create the `signalverse-whale` system
user, install a dedicated restricted env at
`/opt/signalverse/shared/whale-worker.env`, install
`ops/signalverse-whale.service`, reload systemd and start only in
`PUBLIC_OBSERVATION`. Re-run the read-only audit and record a bounded multi-hour window.

**RISK:** release or migration regression, incorrect grants or env ownership, secret
exposure, duplicate worker processing, storage/feed failure, or invalid latency/entry
safety when clock/source evidence is incomplete.

**ROLLBACK:** stop new Whale entries; keep standard Futures monitoring/protection
running; stop and disable only the Whale worker; preserve audit ledgers; verify the Real
lock; revert the application symlink if the release regresses. Restore the verified
pre-change database dump only under a planned outage. Do not delete audit rows or apply
an improvised down migration to make health metrics appear clean.

## Outcome B and next gates

No wallet was manually qualified, no threshold was reduced and no public activity was
manufactured. The blocker is deployment readiness, not an attempt to force a trade.

The next gate is explicit authorization for the reviewed production rollout above.
After installation, the worker must demonstrate a multi-hour `PUBLIC_OBSERVATION`
window with runtime `CLOCK_OK`, a singleton lease, connected feed, bounded/drained
queue, fresh checkpoints, successful recovery, no unsafe gaps and trustworthy source
ordering. A separately authorized Demo window may follow only after natural
qualification and every existing Engine, risk and protection gate passes. Real Whale
Trading remains locked.

This report makes no profitability, private-account execution, live Demo or production
rollout claim.
