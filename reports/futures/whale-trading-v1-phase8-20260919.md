# SignalVerse Whale Trading V1 — Phase 8 engineering report

- **Task ID:** `SIGNALVERSE-WHALE-P8`
- **Task:** Hyperliquid Feed Reliability, Gap/Recovery Root-Cause Fix & Stable Public Observation
- **Date:** 2026-09-19 (Asia/Kuala_Lumpur)
- **Branch:** `codex/whale-trading-v1`
- **Starting branch commit:** `1a488d6ca93379fa48c8dcccf1a2c5f1b7d3fcf7`
- **Ending executable branch commits:** `c513ebd9b52aef0de5031161591c1f1608f3037d`, `bce15e97b9484b373a68748fdd6a55c566db7f42`
- **Production SHA before task:** `8c27da4b8c12917c8e4d9968fe57a5e10f6a66e6`
- **Production SHA after executable changes:** `9d3089afce05f00307ba7aee4f3a9e274e082ec6`
- **Executable PRs:** [#92](https://github.com/signal0verse/signalverse-main/pull/92), [#93](https://github.com/signal0verse/signalverse-main/pull/93), [#94](https://github.com/signal0verse/signalverse-main/pull/94), [#95](https://github.com/signal0verse/signalverse-main/pull/95)
- **Production CI:** [35442368964](https://github.com/signal0verse/signalverse-main/actions/runs/35442368964), [35442860581](https://github.com/signal0verse/signalverse-main/actions/runs/35442860581), [35443602521](https://github.com/signal0verse/signalverse-main/actions/runs/35443602521), [35444456044](https://github.com/signal0verse/signalverse-main/actions/runs/35444456044) — all SUCCESS
- **Publication target:** `signal0verse/SignalVerse-AI-Log`, branch `master`, `reports/futures/whale-trading-v1-phase8-20260919.md`
- **Publication state:** committed and pushed to `master` after secret/private-account review; exact report commit and remote content verification are recorded in the task final response

## Engineering narrative`n
Phase 8 continued the deployed Phase 7 foundation. It did not rebuild the Whale
Trading product, change the central Futures strategy, relax qualification, enable Demo,
or enable Real. The work diagnosed the exact Production failure chain, corrected the
provider/recovery contracts, and repeated controlled public-only observation.

## Result

**Outcome A for the Phase 8 data-reliability gate.** The final controlled window met
the defined feed, recovery, checkpoint, clock, queue and Real-lock criteria. The
bounded observation then ended cleanly; the worker is `inactive/disabled`, its lease
is expired, and the audit rows are preserved. This outcome does not enable Demo.

The final executable Production release is
`9d3089afce05f00307ba7aee4f3a9e274e082ec6`, merged through PRs
[#92](https://github.com/signal0verse/signalverse-main/pull/92),
[#93](https://github.com/signal0verse/signalverse-main/pull/93),
[#94](https://github.com/signal0verse/signalverse-main/pull/94), and
[#95](https://github.com/signal0verse/signalverse-main/pull/95). Every executable
change passed pull-request CI and main Production CI before activation.

Demo remained off throughout Phase 8. Real Whale Trading remained locked in UI, API,
database constraints, worker credentials, and runtime health. No qualification was
forced, no history or funding was fabricated, and no private exchange action was used.

## Phase 7 forensic timeline and classification

The Phase 7 journal was aligned with PostgREST and PostgreSQL logs, durable wallet
revisions, source frames, queue metrics, lease state, and clock evidence.

| Evidence | Finding | Classification |
| --- | --- | --- |
| Initial WebSocket snapshots | Hyperliquid sent `isSnapshot=true`; each subscription snapshot contained up to 30 recent fills. The old path treated snapshot-shaped data as live delivery and allowed sink validation to tear down the shared socket. | `PROVIDER_GAP`, `PROVIDER_DISCONNECT` |
| Recurring ~30-second loop | The provider opened, received the subscription snapshot, disconnected within hundreds of milliseconds, and the worker refresh repeated the lifecycle. | provider lifecycle/sink failure; not inactivity |
| Queue | Depth stayed near 1–2 and drained. | no `QUEUE_BACKPRESSURE` |
| Clock | `CLOCK_UNKNOWN` followed reconnect/no fresh accepted source samples. A pre-restart interval reached `CLOCK_OK`. | consequence, not `CLOCK_FAILURE` root cause |
| Lease | Restart fencing rejected competing holders until the durable 45-second lease expired. | expected fencing; no unexplained `LEASE_FAILURE` |
| Recovery REST | Later weighted diagnostics found no 429 or timeout in the failing Production recoveries. | not `RATE_LIMIT`; not provider HTTP root cause |
| Wallet isolation | Two wallets recovered while the high-volume wallet failed; the shared WebSocket remained healthy. | wallet-level `STATE_RECONCILIATION_FAILURE` |

The Phase 7 recurring gaps and recovery failures therefore had more than one concrete
cause. Provider lifecycle handling created shared reconnects; after that was fixed,
the previously hidden recovery errors exposed two persistence defects described below.

## Provider protocol and state-machine changes

The implementation was checked against the official Hyperliquid documentation:

- [WebSocket subscriptions](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/websocket/subscriptions): the first `userFills` delivery is a snapshot; subsequent deliveries are live.
- [WebSocket heartbeats](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/websocket/timeouts-and-heartbeats): liveness uses connection traffic and ping/pong independently from fill activity.
- [Rate limits](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/rate-limits-and-user-limits): REST requests have weighted IP limits; WebSocket connections/subscriptions/messages have separate limits.
- [Info endpoint](https://hyperliquid.gitbook.io/Hyperliquid-docs/for-developers/api/info-endpoint): time-window fill history is inclusive and bounded.

The provider now exposes deterministic `DISCONNECTED`, `CONNECTING`, `CONNECTED`,
`LIVE`, `GAP`, `RECOVERING`, `DEGRADED`, and `HEALTHY` states. Subscription
acknowledgements and initial snapshots are continuity fences. Snapshot rows never
become fresh entry evidence. Heartbeat is 20 seconds and connection staleness is 55
seconds; no-fill activity is not a gap while the socket and heartbeat remain healthy.

A malformed wallet frame produces a wallet gap without closing the shared connection.
An invalid shared envelope or actual socket loss produces a provider gap. Sink failure
stops/degrades delivery instead of creating an automatic refresh storm. Stop sends one
unsubscribe for every wallet.

## Recovery root causes and fixes

### False semantic duplicate

The same economic fill can first arrive live and later appear in REST recovery. Phase
7's SQL comparator ignored receipt timestamps but still compared operational evidence
such as `clockHealth`. Phase 8 added `providerState`, `walletState`, and
`recoveryContext`, which made the mismatch explicit. PostgreSQL correctly emitted
`CONFLICTING_DUPLICATE` under the old comparator, but the worker collapsed the error to
`WHALE_STORAGE_UNAVAILABLE`.

The new comparator excludes only receipt/lifecycle evidence: `receivedAt`,
`normalizedAt`, latency, historical/live label, derived transition fields, clock,
provider, wallet, and recovery context. Economic fields remain semantic. A price
change for the same event ID still raises `CONFLICTING_DUPLICATE`. The worker now
preserves known database error codes and maps a true conflicting duplicate to a
state-reconciliation failure.

### Large final history commit and premature checkpoint

The first controlled Phase 8 Production attempt proved the comparator fix: two wallets
recovered, the shared feed remained healthy, and the high-volume wallet advanced its
durable event batches. It still failed before the final reconciliation commit. The
worker re-sent the entire merged history as one final state JSON. That high-volume
client-side request never reached PostgREST. In-memory `history.endTime`, snapshot and
orders were also assigned before the final commit, so the failed path could publish a
new local checkpoint even though final reconciliation was not durable.

The SQL transaction now appends only newly inserted fill/funding evidence to bounded
history during the same revision-fenced event batches. Duplicate events do not append
again. The final commit carries history metadata without the fill/funding arrays.
Memory checkpoint, snapshot, history and orders are assigned only after that final
commit succeeds. Failure logging occurs before the degraded-state write, so a second
storage failure cannot hide the original stage/classification.

### Recovery behavior

Only one recovery can mutate a wallet at a time. Other wallets and live WebSocket
delivery continue independently. Live fills for a recovering wallet enter a bounded
5,000-item wallet buffer and are processed only after reconciliation. Backoff starts at
30 seconds and doubles to a five-minute cap; success clears it. Initial and periodic
recoveries share the same per-wallet lock. An initial connection fence is idempotent;
a true gap received during recovery schedules one follow-up.

REST recovery uses one serialized request at a time. It models clearinghouse requests
at weight 2, most info requests at weight 20, and historical row weight in blocks of
20 against the documented 1,200-weight/minute budget. HTTP 429 applies a visible
60-second cooldown. Timeout and rate-limit outcomes retain explicit classifications.
Historical recovery rows are durable evidence and never generate fresh entry jobs.

## Checkpoint, queue, and event evidence

The authoritative checkpoint is the final reconciled snapshot time. Event batches can
durably add idempotent history while recovery is in progress, but they do not advance
that checkpoint. A failed final snapshot, reconciliation, or final commit leaves the
previous checkpoint authoritative. Every live event retains source, received,
normalized and persistence times, source event ID, data quality, clock health,
provider state, wallet state, and recovery context.

Recovery runs outside the live event queue. The live queue remains bounded and reports
depth, high-water and drain time. Candidates remain frozen while a wallet is uncertain.
Provider, worker, wallet, recovery, queue, and clock health remain separate metrics.

## Security and systemd

The dedicated no-login `signalverse-whale` user remains outside the main application
group. Its four-key environment contains the restricted `whale_feed` JWT and loopback
worker endpoint only. It has no exchange signing key, service-role key, private key, or
owner settings/trade access, and cannot read the main application environment.

The release-tree named ACL remains the minimum read/execute path required by the
worker, including inherited default ACLs for later releases. The worker was not added
to the main application group. The systemd unit added device, kernel, control-group,
process, capability, namespace, SUID/SGID, realtime, personality, IPC, and syscall
restrictions. `systemd-analyze verify` passed and the security exposure score improved
from 7.5 `EXPOSED` to 2.8 `OK`. This is a measured systemd score, not a claim that the
host or application is fully hardened.

## Tests and failure injection

The safe local suite passed **109/109** Whale cases. It covers connect/disconnect,
heartbeat, subscription/snapshot/unsubscribe, shared and wallet failure isolation,
no-activity false-positive prevention, malformed data, queue bounds, recovery locking,
429, timeout, backfill failure, checkpoint mismatch, 3,000-fill bounded recovery,
buffered live delivery, duplicate/out-of-order/position transitions, restart fences,
clock states, restricted credentials, Real locks, bilingual rendering, RTL, and
responsive single-column/mobile structure.

The isolated PostgreSQL 18.4 suite passed **14/14** groups. It created a private
loopback cluster, applied every Whale migration twice, verified RLS/grants/Real
constraints, preserved receipt-vs-semantic duplicate behavior, appended history in
bounded batches, ran the actual state-to-Futures-to-Demo ledger fixture, checked
concurrency, and completed backup/restore. This is synthetic/isolated evidence, not an
authorized Demo or private exchange test.

Both Vite application builds passed. PR CI and Production CI passed for each deployed
change. The UI operations panel is bilingual and exposes provider/wallet state,
heartbeat/message/live times, gaps/reconnects, recovery attempts/success/failure and
backoff, checkpoint age, REST weighted metrics, queue, clock, data completeness,
release SHA, and Real lock. Structural checks cover English LTR, Persian RTL, desktop,
and the 390 x 844 single-column breakpoint; no authenticated manual mobile screenshot
is claimed.

## Production migration and recovery artifacts

Before the first Phase 8 migration, a native PG17 custom-format dump was created at
`/var/backups/signalverse/whale-phase8-before.8TN6fm/database.dump`: 53,254,567 bytes,
SHA-256 `390afe58e5be189be2c2e99227eed581f50ba650b6f0af8b91aa8fc85d19842d`.

Before the second SQL revision, another dump captured the newly preserved audit rows at
`/var/backups/signalverse/whale-phase8-second-before.s76aEr/database.dump`:
53,685,576 bytes, SHA-256
`5cce098729afc5bbd3e0382ffbd10a3331cd079d6b1d1d6d4e84afcdae9c220e`.
The Phase 8 migration was applied twice with `ON_ERROR_STOP` in both revisions.
Function ACL remained `postgres`, `service_role`, and `whale_feed`; public, `anon`, and
`authenticated` were revoked. Worker state was inactive/disabled during both changes.

## Controlled attempts before the final window

The report retains failed attempts rather than merging them into the final stability
window:

1. Release `de7d777...` stopped on a connection-fence/recovery revision race before
   Demo or Real activity. PR #93 made an in-flight initial fence idempotent.
2. Release `36a1c5d...` exposed the exact PostgreSQL `CONFLICTING_DUPLICATE`; two
   wallets recovered and one failed. Worker was stopped/disabled.
3. Release `6e8d8af...` proved the comparator repair, then exposed the high-volume final
   history payload and premature local checkpoint. It ran from 12:48:32Z to 12:51:30Z,
   retained 35,398 unique events, had a healthy shared feed with zero provider gaps and
   reconnects, but one stale/degraded wallet and three recovery failures. Worker was
   stopped/disabled. Settings, Whale pending signals, Whale trades and Real Whale
   trades remained zero.

These attempts are diagnostic failures and are not counted as stable observation.

## Final live public observation

Pass criteria were defined before the window: duration greater than Phase 7's 20m24s;
Worker running; provider healthy; all three wallets live; no unexplained gap,
reconnect, unresolved recovery failure, stale wallet, duplicate event, or queue
backlog; checkpoints advance; `realLocked=true`; clock evidence remains fail-closed;
and settings/pending/Whale trades/Real Whale trades remain zero. A controlled stop and
restart must resume from durable state without duplicate or false qualification.

The final window ran from `2026-09-19T13:04:23Z` to the pre-stop snapshot at
`13:38:04Z`, or **33 minutes 41 seconds** including one planned 50-second lease wait.
Active worker time was about 32 minutes 49 seconds, over 60% longer than Phase 7's
20m24s. PID `1438800` stopped cleanly at `13:08:54Z`; after the lease expired, PID
`1439643` started at `13:09:44Z` and recovered all three wallets from durable
checkpoints. No competing worker was allowed.

| Metric | Final measured result |
| --- | --- |
| Public wallets | 3; all `LIVE` at the final active snapshot |
| Window events | 3,394 unique: 1,191 recovered historical and 2,203 live |
| Durable total | 38,792 rows: 36,484 historical and 2,308 live; 38,792 distinct IDs |
| Gaps / provider reconnects | 0 / 0 outside the planned process restart |
| Recoveries | 18 attempts, 18 successes, 0 failures across both lifecycles |
| REST | 104 requests, 104 successes, 0 failures/429/timeouts; max concurrency 1; estimated weight 1,946 |
| Stale wallets / duplicates | 0 / 0 |
| Live queue | high-water 2; final depth 0; it repeatedly drained during recovery |
| Checkpoints | all three advanced after durable reconciliation; final recovery checkpoints `1789824801024`, `1789824831137`, `1789824863662` |
| Clock | `CLOCK_OK`; 100 accepted samples, 3.386 ms uncertainty, -0.225 ms estimated drift, maximum source lead -306 ms |
| One-way latency | 2,159 clock-valid live fills; 274–1,221 ms, average 395.98 ms; 44 startup/restart fills correctly remained unmeasured |
| Persistence latency | 2,203 live fills: average 1,231.56 ms, median 343.89 ms, p95 4,856.04 ms, max 29,600.62 ms; recovery buffering explains the tail and stayed below the 30-second entry freshness gate |
| Qualification | 3 `WATCHLIST`, 0 `QUALIFIED`; no threshold or evidence override |
| Settings / pending / Whale trades / Real Whale trades | 0 / 0 / 0 / 0 |
| Release / lock | exact `9d3089af...`; `realLocked=true` |

The opportunity audit queue processed 2,256 rows and ended with 52 `READY` rows after
the feed stopped. The high-volume wallet could produce non-qualified audit jobs faster
than this bounded run fully drained them. They cannot create an entry: there is no
Whale settings row, all profiles are `WATCHLIST`, Demo is off, Real is locked, and
future processing will reject stale events. The live persistence queue itself did not
back up. This non-trading audit backlog is a disclosed capacity limitation for the next
gate; it was not deleted or misreported as zero.

At `13:38:06Z` the worker was `inactive/disabled`; at `13:39:07Z` its durable lease was
confirmed expired. Main, admin, PostgREST and PostgreSQL remained active and loopback
health returned HTTP 200. The stopped state keeps this public observation bounded and
avoids an automatic boot with the current restricted JWT after its
`2026-09-20T11:11:10Z` expiry. A later start must issue a fresh restricted JWT if that
deadline has passed.

### Evidence classes

- **LIVE PUBLIC OBSERVATION:** the final bounded Production window and actual public
  Hyperliquid frames described above.
- **HISTORICAL REPLAY:** recovered public rows, always marked historical; they did not
  become entry jobs and do not count as live fills.
- **SYNTHETIC TEST:** controlled failure injection and the 3,000-fill fixture.
- **ISOLATED POSTGRESQL:** the disposable PG18.4 test cluster and its own restore.
- **AUTHORIZED DEMO:** **NOT RUN**. Demo remained off and no lifecycle was fabricated.
- **PRIVATE ACCOUNT / REAL:** **NOT VERIFIED / NOT RUN**. Real remained locked.

## Rollback and next gate

If final stability fails, the required state is Worker stopped/disabled, audit data
preserved, main services healthy, and Real locked. Application rollback can atomically
reactivate the prior release; database recovery must use a native dump during a planned
outage, not an improvised down migration or deletion of evidence.

Phase 8 does not authorize Demo. The next gate is a separate owner-authorized Demo
observation only after a naturally qualified wallet exists while feed, recovery, queue,
clock, engine, risk and protection gates all remain healthy. Real Whale Trading remains
locked. No profitability claim is made.


