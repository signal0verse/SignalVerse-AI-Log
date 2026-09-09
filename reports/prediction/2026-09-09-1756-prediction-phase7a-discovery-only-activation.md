# Prediction Market Autonomous Engine — Phase 7A: Discovery-Only Activation

## Metadata

- Date: 2026-09-09
- Task ID: prediction-phase7a-discovery-only
- Module: prediction
- Mode: implement + activate (real production change - real jobs.d gate enabled, real live ticks observed)
- Repository: signal0verse/signalverse-main (code fix) + production VPS (orchestration script + gate file, not git-tracked)
- Branch: farzam → merged into main via PR #26
- Starting commit: 745716886d4bf21d6a8d759e8f0c1847f9aa3883 (deployed at end of Phases 2-6)
- Ending commit: 198f2b99a0f610bd29cb3ab608302b60f709a4b1 (deployed, currently live)

## Objective

Enable ONLY the autonomous Prediction Market Discovery scheduler gate, following the existing VPS jobs.d convention, and observe real live behavior across multiple ticks - without enabling entry/resolve/learn, without touching Real Trading, Futures, Spot, Fast Trader, or Autonomous Supervisor, and without opening any autonomous trade.

## Scope

- Inspect existing scheduler/jobs.d architecture before making any change.
- Fix only what is strictly necessary for Discovery to actually function (see Root Cause / Findings - a real bug was found blocking this).
- Add exactly one new gate-checking block to the VPS orchestration script, for `autonomous-discover` only.
- Create exactly one new gate file: `prediction-discovery-cron.enabled`.
- Do not manually invoke autonomous-enter/resolve/learn. Do not manually simulate scheduler behavior - let the real systemd timer fire naturally.
- Read-only verification of Futures/Spot/Fast Trader/Autonomous Supervisor (no changes made to any of them).

## Actions Taken

1. Inspected `signalverse-fast-jobs.service`/`.timer` (systemd `Type=oneshot`, `OnCalendar=*-*-* *:0/5:00`, `Persistent=true`) and the orchestration script it runs (`/usr/local/libexec/signalverse-jobs`, not git-tracked - confirmed by searching the repo, zero matches - it has always been hand-maintained directly on the VPS for every prior job addition).
2. **Found a blocking bug** before enabling anything: the four `autonomous-*` actions in `api/predictions.ts` checked a nonstandard `x-cron-secret` header that the real caller (`signalverse-jobs`'s `call_api()` helper) never sends - it sends `Authorization: Bearer <secret>`, the same convention every other cron action in this codebase already uses (`copytrade.ts`'s `cron-sync-all`/etc., `coins.ts`'s `run-alerts` on the same `CRON_SECRET` variable). Left as-is, enabling the gate would have been a silent no-op (every real call 401'd, never caught before because these actions had never actually been invoked by the real orchestrator).
3. Fixed the header check to match the established convention. Verified: `tsc --noEmit` (0 new diagnostics), `esbuild api/predictions.ts` (bundles cleanly), all prediction tests unaffected (none asserted on the old header).
4. Committed, pushed, opened PR #26, watched CI to green, merged into `main`, watched the production deploy to completion, verified the deployed SHA directly on the VPS (`readlink -f /opt/signalverse/app` → `.../releases/198f2b99a0f610bd29cb3ab608302b60f709a4b1`, `signalverse.service active`).
5. Backed up the live orchestration script (`/root/signalverse-jobs.bak-20260909T173854`) before editing it.
6. Constructed the new script version locally, diffed against the live original (14 added lines, zero lines changed/removed elsewhere), validated syntax with `bash -n` both locally and on the VPS itself before installing.
7. Installed the new script, verified byte-identical to what was intended.
8. Created the gate file `prediction-discovery-cron.enabled` (**activation time: 2026-09-09T09:40:35Z**), matching the naming/ownership convention of the 8 existing gate files.
9. Captured a pre-activation database snapshot, then waited ~12 minutes (no manual scheduler invocation) to allow the real systemd timer to fire naturally across at least two ticks.
10. Performed full post-observation verification: systemd journal, database state, other-service health, endpoint auth behavior.

## Files Inspected

`api/predictions.ts` (autonomous action handlers), `/usr/local/libexec/signalverse-jobs` (VPS, not git-tracked), `signalverse-fast-jobs.service`/`.timer` unit files, `/etc/signalverse/jobs.d/` (all 9 gate files after this change), `journalctl -u signalverse-fast-jobs.service`, `prediction_markets`/`prediction_autonomous_trades`/`prediction_calibration_snapshots` tables (read-only queries).

## Files Changed

- `api/predictions.ts` - cron auth header fix (source-controlled, went through the normal PR/CI/deploy pipeline)
- `/usr/local/libexec/signalverse-jobs` (VPS-only, not git-tracked) - added one new gated block for `autonomous-discover`; nothing else in the script changed (verified via diff)
- `/etc/signalverse/jobs.d/prediction-discovery-cron.enabled` (new, empty gate file)

No file belonging to Futures, Spot, Fast Trader, or Autonomous Supervisor was touched. No other prediction gate (`autonomous-enter`/`-resolve`/`-learn`) was created or wired.

## Root Cause / Findings

**CONFIRMED - scheduler architecture (answers the architectural question):**
- The VPS scheduler is a single systemd `Type=oneshot` service (`signalverse-fast-jobs.service`) fired every 5 minutes by `signalverse-fast-jobs.timer` (`OnCalendar=*-*-* *:0/5:00`, `RandomizedDelaySec=5s`). All "fast" jobs (copytrade sync, post-trade-analyze, learning-extract, fast-trader, engine-ab, futures-pro, and now prediction-discovery) run sequentially inside one script invocation per tick, each independently gated by its own `.enabled` file.
- **Overlap prevention**: provided by systemd itself, not application code - a `Type=oneshot` unit cannot have two simultaneous "active" instances under the same unit name; a timer firing while the previous run is still active does not spawn a parallel execution. Not stress-tested (no artificial overlap was manufactured, per instruction not to manually simulate scheduler behavior), but this is standard, well-defined systemd unit-activation semantics, not a guess.
- **Bounded concurrency inside discovery itself**: `autonomousDiscoveryTick()` uses a 3-worker bounded pool (`AUTONOMOUS_DISCOVERY_CONCURRENCY = 3`) across 6 categories, up to 20 markets/category (120 max/tick) - the same reused worker-pool pattern as `copytrade.ts`, never unbounded.
- **Empirically observed tick duration**: all three real ticks captured in the observation window (09:40:02→09:41:04, 09:45:07→09:46:00, 09:50:02→09:50:54) completed in 52-64 seconds **total for the entire job set including discovery** - well inside the 5-minute window, no indication a scan can currently exceed the interval. This is real measured data, not an estimate, though only from 2 post-activation ticks - not a long-run guarantee under different network/API-latency conditions.
- **Current effective cadence for discovery specifically: 5 minutes**, shared with every other fast job - no dedicated cadence exists (none was requested; not changed, per instruction).

**CONFIRMED - a real, necessary bug fix (not scope creep):** see Actions Taken #2. Without this fix, Phase 7A could not have functioned at all - the gate would have existed but every real call would have been silently rejected. Verified end-to-end: the two post-activation ticks show real `prediction_markets` writes (see below), not 401 failures, proving the fix works against the real production secret (which was never read or printed).

**CONFIRMED - live discovery behavior, from real database state after 2 ticks:**
| Metric | Value |
|---|---|
| Total `prediction_markets` rows (before → after) | 113 → 285 (+172 new, from real Polymarket categories never scanned before) |
| `candidate_status = ELIGIBLE` | 30, `time_horizon_days` range 1.3-6.9 (correctly inside the 24h-7d window) |
| `candidate_status = FILTERED_OUT` | 189, `time_horizon_days` range -131.2 to 844.8 (correctly excludes already-past and far-future markets) |
| `candidate_status` still NULL (not yet scanned) | 66 - pre-existing rows from before this task, not yet re-surfaced by Gamma's per-category top-20 ranking; expected to fill in over more ticks, not a defect |
| `eligibility_reason` breakdown | `TIME_HORIZON_TOO_FAR`: 115, `TIME_HORIZON_TOO_SOON`: 72, `LOW_LIQUIDITY`: 2, `NULL` (=eligible): 30 - sums exactly to 189+30 |
| Duplicate rows | **Zero** - `count(*) = count(DISTINCT condition_id) = 285`, exact match |
| `last_scanned_at` | all 219 touched rows show the latest tick's timestamp (09:50:00 UTC) - confirms UPDATE/UPSERT semantics, not append-only duplication |

**CONFIRMED - trade safety:** `prediction_autonomous_trades` count = 0 both before and after. `prediction_calibration_snapshots` count = 0 both before and after. Discovery never touches either table (confirmed by source reading and by direct observation).

**CONFIRMED - other-module regression:** `signalverse.service` (main app) and `signalverse-model-proxy.service` both `active` throughout. `signalverse-fast-jobs.service` returns to `inactive` (its correct resting state) between ticks - one transient `activating` read was re-checked 20 seconds later and confirmed to be a normal mid-tick snapshot, not a stuck/hung state. Zero `journalctl -p err` entries for `signalverse-fast-jobs.service` across the entire observation window.

**CONFIRMED - endpoint safety:** `autonomous-enter`, `autonomous-resolve`, `autonomous-learn` all still return `401 unauthorized` live - defense in depth, since even a correctly-authenticated call would still do nothing (no `jobs.d` gate exists for any of them, so the orchestrator never calls them).

**UNCONFIRMED:** whether `action=scan`'s pre-existing manual path or any Futures/Spot/Fast Trader/Supervisor *business logic* (not just service liveness) behaved identically to before - only service-level health (active/inactive, no errors) was checked; no independent authenticated functional test of those systems was performed in this task (correctly out of scope - not touched, not requested).

## Implementation

- One-header-check fix in `api/predictions.ts` (see above), deployed via the normal PR/CI pipeline.
- One new gated block in the VPS's `/usr/local/libexec/signalverse-jobs`, calling `POST /api/predictions?action=autonomous-discover` with `Authorization: Bearer $CRON_SECRET`, only when `prediction-discovery-cron.enabled` exists.
- One new empty gate file.

## Tests Executed

| Command / Check | Result | Pass/Fail |
|---|---|---|
| `npx tsc --noEmit` (post header-fix) | 0 new diagnostics | PASS |
| `esbuild api/predictions.ts` | bundles cleanly, 76.2kb | PASS |
| All prediction test scripts (post header-fix) | unaffected, all pass | PASS |
| PR #26 CI | green | PASS |
| Production deploy (PR #26 merge) | 26/26 steps green | PASS |
| VPS: `readlink -f /opt/signalverse/app` | `.../198f2b99a0f610bd29cb3ab608302b60f709a4b1` | PASS (matches merge SHA) |
| VPS: `bash -n` on new orchestration script (local + remote) | no syntax errors | PASS |
| VPS: `diff` old vs new orchestration script | only the intended 14-line addition | PASS |
| Live: 3 real scheduler ticks in observation window | all "Finished"/"Deactivated successfully", zero errors | PASS |
| DB: row-count vs distinct-condition_id | 285 = 285 | PASS (no duplicates) |
| DB: `prediction_autonomous_trades` count | 0 | PASS |
| DB: `prediction_calibration_snapshots` count | 0 | PASS |
| Live: `autonomous-enter`/`-resolve`/`-learn` still 401 | confirmed | PASS |
| Service health: `signalverse.service`, `signalverse-model-proxy.service` | active | PASS |

## Build Result

Client + API build succeeded as part of PR #26's CI run (same steps as Phases 2-6, unchanged otherwise).

## Git Status

- `main`: HEAD `198f2b99a0f610bd29cb3ab608302b60f709a4b1`, deployed and live.
- `farzam`: in sync with `main` at the same commit.
- VPS orchestration script and gate file: not git-tracked (consistent with all 8 prior job additions); backed up before editing at `/root/signalverse-jobs.bak-20260909T173854`.

## Commit

- Cron-auth header fix: `33da5de`
- **PR #26 merge commit (deployed): `198f2b99a0f610bd29cb3ab608302b60f709a4b1`**

## Remaining Issues

1. The 66 markets still showing `candidate_status = NULL` after 2 ticks are expected to resolve over further ticks as Gamma's per-category rankings rotate - not verified beyond this observation window (would require a longer run to confirm they eventually get classified).
2. Tick-duration measurement (52-64s) is based on only 2 post-activation samples - a longer observation period would give more confidence for the "can a scan exceed the interval" question, though nothing in the current data suggests a problem.
3. `scripts/futures-tp-allocation-test.mjs`'s identical hardcoded-path bug (noted in the Phases 2-6 report) remains unfixed - still out of scope, still not currently causing any failure.
4. The Postgres `authenticator` credential exposure (Phase 1 report) remains open and unrelated - rotation still recommended, still not performed, per explicit instruction not to rotate without separate authorization.

## Risks / Limitations

- This is real production behavior change: Discovery is now live, scanning real Polymarket data and writing real (non-trade) metadata into `prediction_markets` every 5 minutes. It does not and cannot open trades - confirmed both by code (no code path from discovery to trade insertion) and by direct observation (zero rows in `prediction_autonomous_trades`).
- The database will continue to grow via `prediction_markets` upserts at each tick (real, expected behavior of a discovery loop) - growth rate should be monitored over a longer period than this session covered before Phase 7B is considered.
- No stop condition was triggered: no autonomous trade opened, `autonomous-enter` not invoked, Real Trading untouched, only the one intended gate active, no duplication observed, no abnormal DB growth pattern, no service instability, no safety-gate behavior deviating from the Phase 1 audit's expectations.

## Recommended Next Step

**PASS.** Discovery-only activation is confirmed working correctly, safely, and in isolation. Per explicit instruction, this phase stops here for review - Phase 7B (Entry) is NOT started and should only proceed after this report is reviewed and separately approved, along with a decision on whether a longer discovery-only observation period is wanted first (to further validate the NULL-candidate backfill and tick-duration stability under more samples).
