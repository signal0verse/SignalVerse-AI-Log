# Prediction Market Autonomous Engine — Phase 7B-1: Shadow Entry Observation

## Metadata

- Date: 2026-09-09
- Task ID: prediction-phase7b1-shadow-entry
- Module: prediction
- Mode: implement + activate (real production change - new shadow-only endpoint, real jobs.d gate, real live ticks observed)
- Repository: signal0verse/signalverse-main + production VPS (orchestration script/gate, not git-tracked)
- Branch: farzam → merged into main via PR #27
- Starting commit: 198f2b99a0f610bd29cb3ab608302b60f709a4b1 (deployed at end of Phase 7A)
- Ending commit: 2c2c0719f787c9f2d5b053dd9afb4844351a21b0 (deployed, currently live - includes my merge `be4a3902` plus one unrelated concurrent-session commit, see Root Cause / Findings)

## Objective

Implement and activate a SHADOW Entry observation path that runs the complete real autonomous entry decision pipeline on live discovered candidates, without ever opening a trade, to validate the engine's real-world behavior before any DEMO Entry activation is considered.

## Scope

- Reuse the exact existing entry decision logic - no forked math, no second engine.
- No insert into `prediction_autonomous_trades`, no position opened, ever.
- No `autonomous-enter` gate created. No real trading touched. No Futures/Spot/Fast Trader/Autonomous Supervisor change.
- One new, clearly-named, separately-gated action, following the existing jobs.d convention.
- Prove (not assert) that no code path from this phase can insert a trade.
- Read-only/non-mutating verification of the observation results.

## Actions Taken

1. Read `autonomousEntryTick()` in full to understand its exact structure before changing anything.
2. Added a `dryRun: boolean = false` parameter to `autonomousEntryTick()`. Every stage before the single trade-insert call (candidate read, two-stage AI funnel, shadow-prediction recording via the existing `recordPrediction()`, deterministic gates, ranking, duplicate check, revalidation, Kelly/cap sizing) runs identically regardless of `dryRun`. The only branch point, explicitly commented in the source as "THE ONLY BRANCH POINT BETWEEN SHADOW AND REAL ENTRY", is: when `dryRun` is true, the loop `continue`s (recording a structured observation object instead) before ever reaching the `prediction_autonomous_trades` insert; `candidate_status` is never flipped to `MONITORING`. The return value hard-codes `opened: 0` for `dryRun` and separately reports `wouldHaveOpened`, so no caller can conflate a shadow count with a real trade count.
3. Added action `autonomous-enter-shadow` as its own dispatch block (not folded into the four existing autonomous actions), same `Authorization: Bearer CRON_SECRET` auth, calling `autonomousEntryTick(true)` only.
4. Wrote `scripts/prediction-shadow-entry-test.mjs` - 15 source-structure checks proving (not just asserting) that exactly one insert call exists in the function, the `dryRun` branch precedes it and unconditionally `continue`s, the branch contains no insert and no `MONITORING` write, and the new action calls only the `dryRun=true` form.
5. Verified locally: `tsc --noEmit` (0 new diagnostics), `esbuild` (bundles cleanly), all 14 pre-existing prediction tests unaffected, new test 15/15 pass. Added the new test to CI alongside the other 14.
6. Committed, pushed, opened PR #27, watched CI green, merged into `main`.
7. **The resulting production deploy was canceled** (see Root Cause / Findings) by a concurrent session's later push to `main` - re-verified the newer, actually-successful deploy run separately and confirmed my merge commit is an ancestor of what was actually delivered, before proceeding.
8. Live-smoke-tested both `autonomous-enter-shadow` and `autonomous-enter` (both correctly 401 without auth).
9. Recorded the mandatory pre-activation baseline: `prediction_autonomous_trades` count = 0, `status='OPEN'` count = 0.
10. Backed up the VPS orchestration script again, constructed the new version (adding the `prediction-shadow-entry-cron` gate block only), diffed against the live original, validated syntax locally and on the VPS, installed.
11. Created the gate file `prediction-shadow-entry-cron.enabled` (**activation time: 2026-09-09T13:10:47Z**). Confirmed no `autonomous-enter`/`-resolve`/`-learn` gate exists.
12. Observed 4 real scheduler ticks (~24 minutes) without manually invoking anything. Performed full verification: journal, database, GitHub log, endpoint auth, other-service health, discovery-compatibility.

## Files Inspected

`api/predictions.ts` (`autonomousEntryTick`, action dispatch), `/usr/local/libexec/signalverse-jobs` (VPS), `/etc/signalverse/jobs.d/`, `journalctl -u signalverse-fast-jobs.service`, `prediction_predictions` schema and rows, `prediction_autonomous_trades`, `prediction_markets` candidate fields, GitHub Issue #24 (today's daily log) comments, `/etc/signalverse/signalverse.env` (variable-name presence only).

## Files Changed

- `api/predictions.ts` - `autonomousEntryTick(dryRun)` + new `autonomous-enter-shadow` action (source-controlled, via PR/CI/deploy)
- `.github/workflows/production-ci.yml` - added the new test to the existing prediction CI step
- `scripts/prediction-shadow-entry-test.mjs` (new)
- `/usr/local/libexec/signalverse-jobs` (VPS-only, not git-tracked) - added one new gated block for `autonomous-enter-shadow`
- `/etc/signalverse/jobs.d/prediction-shadow-entry-cron.enabled` (new, empty gate file)

No file belonging to Futures, Spot, Fast Trader, or Autonomous Supervisor was touched. No `autonomous-enter`/`-resolve`/`-learn` gate was created.

## Root Cause / Findings

**CONFIRMED - safety guarantees (the core requirement of this phase):**
- Source-structure proof (15/15 checks, `prediction-shadow-entry-test.mjs`): exactly one insert call against `prediction_autonomous_trades` exists in `autonomousEntryTick()`; the `dryRun` branch sits before it and unconditionally `continue`s with no fallthrough; that branch contains neither an insert nor a `candidate_status: 'MONITORING'` write; the return value hard-codes `opened: 0` for `dryRun`.
- Live confirmation: `prediction_autonomous_trades` count was 0 before activation, and remained exactly 0 through 4 real ticks (~24 minutes) and immediately after - checked 4 separate times, never once nonzero. `status='OPEN'` count: 0 throughout.
- `autonomous-enter`, `autonomous-resolve`, `autonomous-learn` all still return `401 unauthorized` live, and no `jobs.d` gate exists for any of them.

**CONFIRMED - a real, non-safety-critical wrinkle found during this phase:** the production deploy for PR #27's merge (`be4a3902`) was **canceled** mid-flight by GitHub Actions' own `concurrency: cancel-in-progress` policy, because a *different, concurrent session* (per this project's known multi-session workflow - HANDOFF.md shows a separate "Codex" session active on this same repo) pushed a further commit (`2c2c071`, an unrelated one-line admin-panel refresh-interval fix) to `main` while my deploy's "Deliver release to production" step was still running. Verified `be4a3902` is an ancestor of `2c2c071` (`git merge-base --is-ancestor`), then confirmed the *newer* run actually succeeded and that `2c2c071` (containing my changes) is what's live on the VPS (`readlink -f /opt/signalverse/app`). No data was lost or misapplied - this is a normal, expected interaction of the existing concurrency-group CI design with genuine multi-session concurrent development, not a bug in this task's own work. Worth noting for future phases: **always re-check for a newer push superseding an in-flight deploy**, rather than trusting a "completed" watch result alone - a canceled run reports "completed" too.

**CONFIRMED - live scheduler behavior, 4 real ticks (2026-09-09T13:15-13:31 UTC):**
| Tick start → end | Duration |
|---|---|
| 13:15:03 → 13:16:07 | 64s |
| 13:20:08 → 13:21:13 | 65s |
| 13:25:01 → 13:26:04 | 63s |
| 13:30:03 → 13:31:17 | 74s |

All four ran the FULL fast-jobs set (copytrade sync, post-trade-analyze, learning-extract, fast-trader, engine-ab, futures-pro, prediction-discovery, **and now prediction-shadow-entry**) sequentially, well inside the 5-minute window - shadow-entry evaluation (order books + up to 10 AI rechecks/tick) added no measurable overhead versus Phase 7A's discovery-only ticks (52-65s then vs. 63-74s now). Zero `journalctl -p err` entries. No overlapping "Starting" events (systemd `Type=oneshot` semantics, same as Phase 7A). `signalverse.service` and `signalverse-model-proxy.service` remained `active` throughout.

**CONFIRMED - real evaluation results, from `prediction_predictions` rows created in the window (the authoritative source - not GitHub-log text, see below):**

| Metric | Value |
|---|---|
| Total candidates evaluated | 108 |
| Decision: AVOID | 62 (33 chosen-side NO, 29 chosen-side YES) |
| Decision: INSUFFICIENT_DATA | 39 (all chosen-side YES) |
| Decision: WATCH | 7 (6 NO, 1 YES) |
| Decision: OPPORTUNITY / STRONG_OPPORTUNITY | **0 / 0** |
| `prediction_class`: VALID_PREDICTION | 36 |
| `prediction_class`: INSUFFICIENT_EVIDENCE | 72 |
| `chosen_side` = YES / NO | 69 / 39 |
| `net_edge` range (avg) | 0.00 to 48.96 (avg 7.70) |
| `net_ev` range (avg) | -2.21 to 68.10 (avg 20.77) |
| `confidence` range | 15.0 to 55.0 |
| `opportunity_score` range | 50.0 to 69.0 |
| AI-stage evidence used | 8/108 (7.4%) |
| Crypto-trend evidence used | 36/108 (matches 100% of crypto-category candidates) |
| Category breakdown | sports: 45, crypto: 36, politics: 27, economics/culture/science: 0 |
| `wouldHaveOpened` | **0** across all 4 ticks (logically certain: zero candidates reached `PREDICTION_ACTIONABLE_DECISIONS`, so `gated`/`ranked` were empty every tick - the sizing/would-open branch never executed) |
| Scheduler overlap | None observed |
| Duplicate-evaluation problem | None - `AUTONOMOUS_ENTRY_CONCURRENCY=4` bounded pool, same as real entry, and the candidate set is read fresh (`ELIGIBLE`, limit 50) each tick, not accumulated |

**CONFIRMED - Discovery (Phase 7A) unaffected, still running independently:** `time_horizon_days`, category logic, gate file, and duplicate protection untouched. Total `prediction_markets` rows grew 285 → 335 over this session; `ELIGIBLE` count grew 30 → 38; **the 66 `candidate_status IS NULL` rows remained at exactly 66** across this entire phase too - now confirmed stable across two separate observation windows (Phase 7A and 7B-1), strengthening the earlier hypothesis that these are structurally unreachable by the current 6-category discovery loop (not a transient backlog).

**UNCONFIRMED - GitHub daily-log posting:** searched Issue #24 (today's daily report) for any comment matching `"Autonomous Prediction"` (the literal string both the discovery and shadow-entry `logToGitHub` calls use) - zero matches, despite `GITHUB_LOG_TOKEN` being configured. `logToGitHub(...).catch(() => {})` swallows failures by design, so this doesn't affect correctness of the core pipeline (fully verified via direct DB evidence instead), but the *reason* the log post isn't landing is unconfirmed and worth a separate, low-priority look. Not blocking.

## Implementation

See Actions Taken #2-3. No mathematical logic was forked; `dryRun` is a mode of the existing function, not a second engine.

## Tests Executed

| Command / Check | Result | Pass/Fail |
|---|---|---|
| `npx tsc --noEmit` | 0 new diagnostics | PASS |
| `esbuild api/predictions.ts` | bundles cleanly, 78.3kb | PASS |
| All 14 pre-existing prediction tests | unaffected | PASS |
| New `prediction-shadow-entry-test.mjs` | 15/15 | PASS |
| PR #27 CI | green | PASS |
| Production deploy (first attempt) | **canceled** by a concurrent push (see findings) | N/A - superseded |
| Production deploy (superseding run, `2c2c071`) | 26/26 steps green | PASS |
| VPS: `readlink -f /opt/signalverse/app` | `.../2c2c0719f787c9f2d5b053dd9afb4844351a21b0` | PASS (my merge confirmed an ancestor) |
| Live: `autonomous-enter-shadow` / `autonomous-enter` without auth | both 401 | PASS |
| Pre-activation baseline: `prediction_autonomous_trades` | 0 | PASS |
| Post-activation (4 checks across the window): `prediction_autonomous_trades` | 0, every time | PASS |
| `status='OPEN'` count | 0 | PASS |
| Journal error scan | zero entries | PASS |
| Service health: `signalverse.service`, `signalverse-model-proxy.service` | active | PASS |

## Build Result

Client + API build succeeded as part of PR #27's CI run.

## Git Status

- `main`: HEAD `2c2c0719f787c9f2d5b053dd9afb4844351a21b0`, deployed and live; contains my merge `be4a3902` plus one unrelated concurrent-session commit.
- `farzam`: in sync with `main`.
- VPS orchestration script: backed up before this edit at `/root/signalverse-jobs.bak-20260909T210808` (in addition to Phase 7A's earlier backup).

## Commit

- Shadow-entry implementation: `7c06744`
- **PR #27 merge commit: `be4a3902bfc419cd6d44d67ee83540faf2b540ed`**
- Actually-deployed HEAD (supersedes, includes the above): `2c2c0719f787c9f2d5b053dd9afb4844351a21b0`

## Remaining Issues

1. GitHub daily-log posting for both discovery and shadow-entry ticks could not be confirmed as landing (see Unconfirmed above) - separate, low-priority investigation recommended, not blocking.
2. Zero candidates reached an actionable decision in this specific 108-evaluation/4-tick window - this is itself a valid, informative result (see Important Analysis below), but it means questions H (is the $15 cap appropriate relative to real Kelly sizing) and I (is opportunity frequency sufficient for DEMO Entry) remain genuinely unanswered by live data, not just theoretically unaddressed.
3. The AI funnel's actual *value-add* (whether the 8 AI-touched candidates' decisions differed from what stage-1-only would have produced) isn't preserved per-candidate in the current schema - only the final decision is recorded, not a stage1-vs-stage2 diff. Not required by this phase, but would need a schema/logging addition to answer definitively in the future.

## Risks / Limitations

- This observation window is short (~24 minutes, 4 ticks, 108 evaluations) relative to how many candidates would need to be seen to reliably estimate true opportunity frequency. A quiet window with zero actionable decisions is consistent with either "the engine is well-calibrated and these particular candidates were genuinely not mispriced" or "thresholds are calibrated too conservatively" - this data cannot distinguish between the two, and more observation is the only way to find out, not code changes.
- Shadow entry is now live and will continue running every 5 minutes (reading real Polymarket data, recording real shadow predictions) until this gate is disabled - this is intentional per the phase design, but worth noting it is an ongoing, not one-time, production behavior change.
- The Postgres `authenticator` credential exposure (Phase 1 report) and the `scripts/futures-tp-allocation-test.mjs` path-portability bug (Phases 2-6 report) both remain open and unrelated - neither touched, neither blocking.

## Important Analysis

**A. Is the Engine finding genuinely actionable opportunities?** Not in this window - 0/108 reached `OPPORTUNITY`/`STRONG_OPPORTUNITY`. Sample is too small to generalize to "never."

**B. Is the Engine too conservative?** Cannot be determined from this window alone. Evidence cuts both ways: at least one candidate had a 48.96pp edge yet still landed in `AVOID`/`WATCH`, meaning confidence/quality/tradeability sub-thresholds are doing real, non-trivial gating beyond edge magnitude alone - consistent with a deliberately conservative, deterministic-gates-first design rather than obvious miscalibration, but this cannot be confirmed as "correctly conservative" vs. "too conservative" without a longer sample.

**C. Is the Engine too permissive?** No evidence of this - if anything, the opposite concern (B) is the only one this data could support.

**D. Is the AI funnel adding meaningful evidence?** AI was invoked for exactly 8/108 (7.4%) candidates, confirming the two-stage funnel is economically operating as designed (never blanket AI calls). Whether those 8 calls actually *changed* the outcome versus a stage-1-only decision cannot be confirmed from the current schema (see Remaining Issues #3).

**E. Are YES and NO both realistically evaluated?** Yes, confirmed directly: 39/108 (36%) of evaluations chose NO as the engine's side, proving the side-aware evaluation genuinely produces both outcomes rather than defaulting to YES.

**F. Are one-sided opportunities appearing?** With zero actionable results in this window, there is no opportunity (one-sided or otherwise) to observe yet.

**G. Does the 24h-7d horizon provide enough candidate supply?** The `ELIGIBLE` pool grew from 30 to 38 over the session and produced 108 evaluations across 4 ticks without running dry - supply appears adequate for continuous operation, though whether it's enough to eventually surface an actionable candidate isn't confirmed by this window.

**H. Is the $15 autonomous cap appropriate relative to recommended Kelly sizing?** **Not observable in this window** - the sizing calculation only runs for gated/ranked candidates, and none existed. Genuinely unanswered, not just untested.

**I. Is there enough opportunity frequency to justify moving to DEMO Entry?** **Not yet demonstrated.** Zero actionable opportunities in 108 evaluations over ~24 minutes doesn't mean the engine is broken (efficient-market behavior is a legitimate real-world outcome), but it does mean this specific question - the central one Phase 7B-1 exists to answer - remains open. A longer observation period, not a code change, is what would resolve it.

## Recommended Next Step

**PASS** - for the safety/architecture/mechanism dimension: Shadow Entry Observation is correctly implemented, provably safe (zero code path to a trade insert), zero trades opened, zero regressions to any other system, zero scheduler instability, and behaves exactly per its design.

**However**, per the analysis above, the readiness question for actual DEMO Entry (H and I) is not yet answered by live data. Recommendation: **keep `prediction-shadow-entry-cron` running for a substantially longer observation period** (hours to days, spanning more of the market/category cycle) before considering Phase 7B-2 (DEMO Entry), so that questions H and I can be answered from real evidence rather than a single short window. Do not proceed to Phase 7B-2 automatically - this stops here for review, per explicit instruction.
