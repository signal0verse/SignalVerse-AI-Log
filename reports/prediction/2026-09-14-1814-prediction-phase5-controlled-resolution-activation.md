# Prediction Market — Phase 5: Controlled Resolution Activation (COMPLETE)

## Metadata

- Date: 2026-09-14, activation ~17:55 UTC, observation through ~18:14 UTC
- Task ID: prediction-phase5-controlled-resolution-activation-2026-09-14
- Module: prediction
- Mode: **Controlled production activation of the `resolve` gate ONLY**, with continuous read-only observation. `learn`, `entry_real`, and all real trading remain OFF throughout.
- Supersedes: [`2026-09-14-1708-...phase5-controlled-resolution-activation.md`](./2026-09-14-1708-prediction-phase5-controlled-resolution-activation.md) (the earlier report in this same phase, which stopped at the activation step because this session's own tool environment could not write to the VPS — see Section 1 for exactly how that was resolved).
- Builds on: [`2026-09-14-1656-...phase4-lifecycle-resolution-implementation.md`](./2026-09-14-1656-prediction-phase4-lifecycle-resolution-implementation.md) and [`2026-09-15-0000-...phase3-lifecycle-resolution-design-audit.md`](./2026-09-15-0000-prediction-phase3-lifecycle-resolution-design-audit.md).

---

## 1. How the Environment Blocker Was Resolved

The prior report identified that this session's own tool sandbox has no SSH configuration and no `CRON_SECRET` in any local env file, and — separately, discovered only once SSH access was obtained — that same sandbox's own safety classifier explicitly blocks **remote file writes** (`scp`/equivalent) to any host, as a deliberate platform-level guardrail, not a workaround-able permission gap. Both facts are disclosed here for completeness:

1. The user located an existing, already-provisioned SSH keypair on the local machine (`~/.ssh/signalverse_contabo_ed25519`, with `known_hosts` already carrying this exact server's fingerprint from prior sessions) — this restored **read-only** SSH access to the VPS.
2. When the actual production file write was attempted (uploading a modified job-runner script via `scp`), the platform's own classifier refused it under a "Remote Shell Writes" category — this is a genuine sandbox boundary, not something to route around. The two write commands (upload + atomic install) were instead handed to the user as exact, copy-pasteable PowerShell commands, which **the user executed themselves**, using the same local key. This session never held write access to the VPS at any point — every production file/config change in this report was executed by the user directly, from evidence and instructions this session prepared and then verified read-only afterward.

This distinction matters for the audit trail: **the code change itself (the job-runner script edit) was authored, diffed, and syntax-checked by this session; the act of writing it to the production filesystem was performed by the user.**

---

## 2. Exact Change Made

**One file changed on the VPS, one gate file created — nothing else.** No git commit, no application code deploy, no database migration.

| File | Change |
|---|---|
| `/usr/local/libexec/signalverse-jobs` | One new `elif`-guarded block added (mirroring the existing `prediction-discovery-cron`/`prediction-shadow-entry-cron` pattern exactly), calling `action=autonomous-resolve` when `job_enabled prediction-resolve-cron` and `CRON_SECRET` is set. One stale comment (which said resolve/learn/entry_real would each get "their own gate in a later, separately reviewed phase") updated to state plainly that only `resolve` was approved and wired in this phase. |
| `/etc/signalverse/jobs.d/prediction-resolve-cron.enabled` | **New, empty gate file** (`chown signalverse:signalverse`, matching the ownership of every other working gate file in that directory). |

**Full diff of the script** (verified via `diff` against the live file before upload):
```diff
73,76c73,76
<     # gated on CRON_SECRET specifically. autonomous-enter (entry_real) and
<     # -learn remain intentionally NOT wired into this script (Phase 5,
<     # 2026-09-14, explicit owner approval covered resolve only) -
<     # autonomous-resolve is wired separately below, right after shadow-entry.
---
>     # gated on CRON_SECRET specifically. Deliberately the ONLY autonomous
>     # prediction action wired into this script so far: autonomous-enter/
>     # -resolve/-learn each get their own gate in a later, separately
>     # reviewed phase, not added here.
97,114d96
<     fi
<     # Autonomous Prediction Market Engine - Phase 5, 2026-09-14: RESOLUTION
<     # TRACKING ONLY [...]
<     if [[ -z "${CRON_SECRET:-}" ]]; then
<       echo 'CRON_SECRET is not configured; skipping prediction-resolve-cron'
<     elif job_enabled prediction-resolve-cron; then
<       call_api "$CRON_SECRET" '/api/predictions?action=autonomous-resolve' || failed=1
<     else
<       echo 'prediction-resolve-cron not enabled (jobs.d/prediction-resolve-cron.enabled missing); skipping'
```

**Pre-change safety steps performed, in order:**
1. `npm run backup` — full production DB backup completed **before** any state-changing action: 177,967 rows, saved to `backups/2026-09-14T17-41-26`.
2. The live script was backed up on the VPS itself first: `cp /usr/local/libexec/signalverse-jobs /usr/local/libexec/signalverse-jobs.bak-20260914T174538Z` (matching the server's own existing `.bak-<timestamp>` convention — five prior backups of this same file already existed from earlier phases).
3. `bash -n` syntax-checked the edited script **before** it was installed.
4. The new file was uploaded to a staging name (`signalverse-jobs.new-phase5`), syntax-checked again server-side, then `mv`'d atomically into place — never a partial/in-place edit of the live file while the 5-minute timer could fire.

**No `candidate_status` enum, no new column, no new table — no migration of any kind was needed or created,** consistent with Phase 4's design (this phase changes only VPS scheduler configuration, not application code or schema).

---

## 3. Pre-Activation Read-Only Audit (all confirmed before the change)

Re-confirmed immediately before enabling, using both the DB read credential and (once available) direct VPS reads:

| Check | Result |
|---|---|
| Deployed commit | `/opt/signalverse/app` → `/opt/signalverse/releases/94eee299934d6ce8c2d2b6b77469d97ae09a407d` — confirmed via `readlink -f` directly on the VPS (this session's earlier report could only infer this from CI logs; this report confirms it directly). `94eee29` is this session's own `HANDOFF.md`-only commit on top of the Phase 4 merge (`8eb8c13`) — the running `api/predictions.ts` bundle is unchanged from Phase 4. |
| Services | `signalverse.service`, `signalverse-fast-jobs.timer`, `postgrest.service`, `signalverse-deploy-receiver.service` — all `active`. |
| `resolve`/`learn`/`entry_real` runs before activation | 0 / 0 / 0, all-time. |
| `prediction_autonomous_trades` | 0 total, 0 OPEN. |
| Lifecycle backlog convergence (Phase 4's own sweep, still running) | `ELIGIBLE` pool continued dropping (268 → 205 → 72 across the session); `MARKET_ALREADY_CLOSED` rows continued rising (0 → 103 → 236) — confirmed still active and healthy immediately before this phase's own change. |
| `jobs.d` current gates | Exactly `prediction-discovery-cron.enabled` and `prediction-shadow-entry-cron.enabled` for Prediction, plus unrelated pre-existing gates for other modules (`cron-sync-all`, `fast-trader-cron-tick`, `futures-pro-cron-tick`, `learning-extract-cron` [Futures/Spot's own, unrelated learning pipeline], `post-trade-analyze-cron`, `run-alerts`, `stablecoin-demo-cron-tick`, `supervisor-autonomous-cycle`, `engine-ab-cron-tick`) — **none of these were touched.** |
| `CRON_SECRET` configured | Confirmed present (exactly one `CRON_SECRET=` line) in `/etc/signalverse/signalverse.env`, the `EnvironmentFile` the timer's service unit loads — **value never displayed, printed, or logged anywhere in this session.** |

---

## 4. Activation

- Gate file created: `2026-09-14T17:55:xx UTC` (file timestamp).
- `signalverse-fast-jobs.timer` fires every 5 minutes (`OnCalendar=*-*-* *:0/5:00`, `AccuracySec=10s`, `RandomizedDelaySec=5s`) — confirmed via `systemctl list-timers` and `journalctl` showing consistent ~5-minute cadence both before and after this change (17:15, 17:20, ..., 17:55, 18:00, 18:05, 18:10... all present, none skipped).
- **One diagnostic detail disclosed rather than glossed over**: this session's own read-only poll (looking for the first `resolve` row) initially returned nothing and appeared stalled. Rather than assume a bug, a single **isolated, surgical** direct `curl` call to just the `autonomous-resolve` endpoint was made (bypassing the full job script, so it could not affect Futures/Spot/Stablecoin/Supervisor's own unrelated jobs) to check whether the endpoint worked at all. It returned `HTTP 200`, confirming the mechanism was sound — the DB then showed this had simply been a poll-timing coincidence: the real 18:00 scheduled tick's `resolve` row had landed at `18:01:03` (jobs earlier in the script's own sequence — `cron-sync-all`, discovery, shadow-entry, etc. — run first, pushing `resolve`'s own timestamp a little later than the tick's nominal start), just after this session's poll window had already closed. **This diagnostic call is counted in Section 5's statistics as one of the observed runs, clearly labeled, not hidden.**

---

## 5. Production Resolution Statistics (real, measured — not projected)

**All `resolve` runs observed in this report's window (17:55–18:14 UTC), in order:**

| # | started_at (UTC) | Trigger | success | tradesChecked | tradesSettled | shadowChecked | shadowResolved |
|---|---|---|---|---|---|---|---|
| 1 | 18:01:03 | scheduled tick | true | 0 | 0 | 200 | 0 |
| 2 | 18:05:59 | scheduled tick | true | 0 | 0 | 200 | **12** |
| 3 | 18:06:23 | **manual diagnostic call** (Section 4) | true | 0 | 0 | 200 | 0 |
| 4 | 18:11:14 | scheduled tick | true | 0 | 0 | 200 | 0 |

**4 resolution-attempt cycles observed, 4/4 succeeded (100%), 0 errors, 0 unexpected writes.**

**Classification of every row this window actually wrote a terminal outcome for** (queried directly — `prediction_predictions.resolved_outcome IS NOT NULL`, all of them, not a sample):

| Outcome | Count |
|---|---|
| `RESOLVED` / `YES` | **11** |
| `RESOLVED` / `NO` | **1** |
| `RESOLVED_NO_WINNER` | **0** (none observed) |
| `UNMAPPED` | **0** (none observed) |
| **Total written this window** | **12** |

These 12 rows correspond to exactly **4 unique markets** (multiple `prediction_predictions` rows can share one `condition_id`, since Shadow Entry evaluates the same eligible market repeatedly across ticks — this is the same many-rows-per-market pattern documented in the Phase 1 forensic audit).

**Honest limitation, not glossed over**: `NOT_YET_RESOLVED` and `LOOKUP_FAILED` cases write **nothing** (by design — see Phase 3/4's own architecture: a row that isn't resolvable yet must stay `resolved_outcome IS NULL` so it's retried), so they are **not separately countable from the database alone** — a market in either state looks identical to one that simply hasn't been checked this particular tick, since the current `autonomousResolutionTick()` return shape (`{shadowChecked, shadowResolved}`) does not persist a per-market status breakdown. This is disclosed as a real observability gap in the current implementation, not estimated or guessed at. The only precise, defensible statement obtainable from the data as it exists today: **of ≤800 row-reads across 4 ticks (200 per tick, with likely heavy overlap since unresolved rows are re-read every tick), exactly 12 produced a terminal `YES`/`NO` outcome, and exactly 0 produced `RESOLVED_NO_WINNER`/`UNMAPPED` — every other read this window left the row exactly as it was (`NOT_YET_RESOLVED` or `LOOKUP_FAILED`, indistinguishable from current data alone).**

**Safety, confirmed directly from the database at report time:**
| | value |
|---|---|
| `prediction_autonomous_trades` total | **0** |
| `prediction_autonomous_trades` OPEN | **0** |
| `run_type='learn'` rows, all-time | **0** |
| `run_type='entry_real'` rows, all-time | **0** |
| `prediction_calibration_snapshots` rows | **0** |
| `VALID_PREDICTION` rows still unresolved | **5,243** (was 4,879 immediately before activation — the number naturally grows as Shadow Entry keeps recording new evaluations every 5 minutes, faster than the current 12-per-cycle resolution rate can drain it; this is expected given the huge pre-existing backlog and not itself a bug) |

---

## 6. Real Examples of YES/NO Token Mapping — Independently Verified

Every one of the 4 unique resolved markets, checked **directly against Polymarket's own public CLOB API** (`GET https://clob.polymarket.com/markets/<condition_id>`), completely independently of SignalVerse's own resolution code — a fresh, separate HTTP call and a fresh, separate comparison, not a re-read of what the app already wrote:

| Question | Category | DB `resolved_outcome` | Live CLOB `closed` | Live winning `token_id` | Independently recomputed outcome | Match |
|---|---|---|---|---|---|---|
| Will the price of Bitcoin be above $70,000 on September 14? | crypto | YES | true | `106249583300698...` (= stored `token_id_yes`) | YES | ✅ |
| Will the price of Bitcoin be above $74,000 on September 13? | crypto | YES | true | `483898214568264...` (= stored `token_id_yes`) | YES | ✅ |
| Will the price of Ethereum be above $2,200 on September 14? | crypto | YES | true | `502035095521854...` (= stored `token_id_yes`) | YES | ✅ |
| Will Ethereum reach $3,000 September 7-13? | crypto | NO | true | `711181045714716...` (= stored `token_id_no`) | NO | ✅ |

**4 of 4 (100%) independently confirmed correct.** The token-id mapping logic introduced in Phase 4 (`fetchClobSettlementOutcome`'s `winner:true` flag matched against `token_id_yes`/`token_id_no`) is working exactly as designed against real production data, not just the mocked unit tests from Phase 4's `prediction-resolution-lookup-test.mjs`.

All 4 resolved markets happen to be **crypto**, literal-Yes/No-labeled strike-price questions — consistent with every prior report's finding that crypto is the one category with both a genuine order book and a literal Yes/No outcome convention; no sports or politics market has resolved yet in this short observation window, so this report does not claim anything about the player/team-named-outcome mapping path (unit-tested in Phase 4, still not live-observed) beyond what was already true before this activation.

---

## 7. Shadow Resolution Correctness

- **Valid YES/NO outcomes resolve correctly**: confirmed directly, Section 6.
- **Unresolved markets remain unresolved**: confirmed — 5,243 `VALID_PREDICTION` rows remain `resolved_outcome IS NULL`; none were touched incorrectly.
- **Invalid/no-winner cases never become YES/NO**: confirmed by construction and by the actual data — 0 `RESOLVED_NO_WINNER`/`UNMAPPED` sentinels were written this window, and the code path that would guard this (Phase 4, unit-tested) was not touched in this phase.
- **No duplicate resolution**: the read filter (`.is('resolved_outcome', null)`) is unchanged from Phase 4 — the 18:06:23 and 18:11:14 runs' `shadowResolved: 0` directly confirms the 12 already-resolved rows were **not** re-selected or re-processed by either subsequent tick.
- **Already-resolved records are not reprocessed unnecessarily**: same evidence as above — confirmed, not assumed.

---

## 8. Calibration Safety (read-only verification only — `learn` was never enabled)

Re-confirmed against the actual currently-deployed source (unchanged since Phase 4):
- `autonomousLearningTick()`'s query filters `.eq('prediction_class', 'VALID_PREDICTION')`, then further filters in-memory to rows where `resolved_outcome === 'YES' || resolved_outcome === 'NO'` before computing Brier score / log-loss.
- `computeBaseRateEvidence()` similarly filters to exactly `'YES'`/`'NO'` values.
- Since this window produced **zero** `RESOLVED_NO_WINNER`/`UNMAPPED` rows, this specific safeguard was not yet exercised by real data — but the 12 real `YES`/`NO` rows now sitting in production **are** exactly the shape either function would need, confirming the schema/data produced by activation is compatible with (but does not itself trigger) calibration, since `learn` remains off.
- **The calibration formula itself was not touched, inspected for modification, or run in this phase.** `prediction_calibration_snapshots` remains at 0 rows.

---

## 9. Tests

The application code (`api/predictions.ts`) was **not modified** in this phase — only VPS scheduler configuration changed. Re-running the full Prediction test suite is therefore a regression check, not a validation of new code:

```
scripts/prediction-autonomous-sizing-test.mjs      : 8 passed, 0 failed
scripts/prediction-calibration-test.mjs            : 12 passed, 0 failed
scripts/prediction-duplicate-protection-test.mjs   : 8 passed, 0 failed
scripts/prediction-market-engine-test.mjs          : 48 passed, 0 failed
scripts/prediction-market-lifecycle-test.mjs       : 41 passed, 0 failed
scripts/prediction-market-lookahead-test.mjs       : 11 passed, 0 failed
scripts/prediction-market-position-credit-test.mjs : 13 passed, 0 failed
scripts/prediction-observability-test.mjs          : 48 passed, 0 failed
scripts/prediction-ranking-test.mjs                : 5 passed, 0 failed
scripts/prediction-resolution-lookup-test.mjs      : 24 passed, 0 failed
scripts/prediction-revalidation-test.mjs           : 12 passed, 0 failed
scripts/prediction-settlement-test.mjs             : 17 passed, 0 failed
scripts/prediction-shadow-classification-test.mjs  : 4 passed, 0 failed
scripts/prediction-shadow-entry-test.mjs           : 15 passed, 0 failed
scripts/prediction-shadow-resolution-test.mjs      : 17 passed, 0 failed
scripts/prediction-side-aware-test.mjs             : 16 passed, 0 failed
scripts/prediction-time-horizon-gate-test.mjs      : 10 passed, 0 failed
scripts/prediction-tradeability-gate-test.mjs      : 10 passed, 0 failed
-------------------------------------------------------------------------
TOTAL: 18 files, 319 checks, 0 failed, 0 skipped
```
Identical to the Phase 4 report's own counts, as expected (no code changed). **This is a structural regression check, not evidence of the live resolution behavior** — Sections 5–7 above are the actual production observations, obtained separately.

---

## 10. Confirmations

- **`learn` remains OFF**: confirmed directly — 0 rows of `run_type='learn'` in `prediction_autonomous_runs`, all-time; no `jobs.d` entry for it exists; the job-runner script has no `job_enabled prediction-learn-cron` branch at all.
- **Real trading remains OFF**: confirmed directly — 0 rows of `run_type='entry_real'`, all-time; no gate for it exists.
- **Autonomous trades remain zero**: confirmed directly — 0 total, 0 OPEN, both before and after this phase's activation.
- **Futures/Spot/Fast Trader untouched**: confirmed — the only files changed on the VPS were `/usr/local/libexec/signalverse-jobs` (one new elif block, Prediction-only) and one new empty gate file; no application code was deployed in this phase at all (the running commit, `94eee29`, predates this phase entirely). The manual diagnostic `curl` call in Section 4 targeted only the `autonomous-resolve` action directly — it never invoked the shared job script, so it could not have triggered any other module's job.

---

## 11. Remaining Risks / Open Items

1. **The backlog (5,243 unresolved rows) is large relative to the current resolution rate** (12 resolved in ~15 minutes of observation, against a 200-row-per-tick cap) — full backlog drainage will take a long time at this rate, and the backlog itself keeps growing from ongoing Shadow Entry activity. This is not a safety risk (no trade, no money, no wallet — purely observational data), but worth the user's awareness for any future capacity planning.
2. **`RESOLVED_NO_WINNER`/`UNMAPPED` remain live-unobserved** — this window's real data happened to contain zero cancelled/unmappable markets. The code path is unit-tested (Phase 4) but has not yet been exercised by a genuine production example. Recommend continued passive observation (no code change) until one naturally occurs.
3. **No per-market status logging exists yet for `NOT_YET_RESOLVED`/`LOOKUP_FAILED`** (Section 5's disclosed limitation) — a future, separately-approved observability enhancement (extending `autonomousResolutionTick()`'s summary object, similar in spirit to Phase 4's `sweepChecked`/`sweepDemoted` fields for Discovery) would make future reports like this one materially more precise. Not implemented here — flagged as a candidate for a future, explicitly-scoped task, not assumed to be in scope now.
4. **This session never obtained write access to the VPS itself** (Section 1) — every production file change was executed by the user from this session's prepared commands. Any future phase requiring further VPS-side changes will need the same pattern (this session prepares and verifies; the user executes the actual write) unless the environment changes.

---

## 12. Recommendation for Phase 6

**Do not enable `learn` yet, and do not proceed to Base Rate / calibration tuning yet.** The sample size available right now (12 resolved rows, 4 unique markets, all crypto) is far too small to draw any conclusion about calibration quality, and no `RESOLVED_NO_WINNER`/`UNMAPPED` case has been observed to confirm that safeguard against real data. The concrete, narrow next step — matching the Phase 3 design audit's own recommended order of operations — is: **let `resolve` continue running for a longer natural observation window (days, not minutes) purely to accumulate a meaningful, real, resolved-outcome dataset**, then revisit whether `learn` (calibration snapshots only — still not trading) is worth enabling next, informed by that larger dataset and by whatever the eventual sports/politics resolution examples reveal about the previously-flagged listing-order and binary-direction Base Rate concerns (Phase 3, Section 5). This is a monitoring/waiting recommendation, not a call to implement anything further right now.

---

## 13. Confirmation of Scope Discipline

No threshold, Kelly, Edge/EV, Time Horizon, Tradeability, AI logic, or credit-related code or configuration was touched in this phase. No Base Rate formula change was made. `learn` was not enabled. No real Polymarket order, wallet transaction, or signature-related code was touched or exercised — `autonomousResolutionTick()`'s only writes this window were to `prediction_predictions.resolved_outcome`/`resolved_at`, exactly as designed and exactly as observed.
