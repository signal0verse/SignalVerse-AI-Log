# Prediction Market Autonomous Engine — Phase 7B-2: Monitoring & Observability

## Metadata

- Date: 2026-09-09
- Task ID: prediction-phase7b2-observability
- Module: prediction
- Mode: implement + test (local only — NOT committed, NOT pushed, NOT deployed, NOT migrated, per explicit stop gate)
- Repository: signal0verse/signalverse-main (local checkout `SignalVerse-Main-farzam`, branch `farzam`)
- Branch: farzam (uncommitted working-tree changes on top of local HEAD)
- Starting commit: 7c06744 (local HEAD, Phase 7B-1)
- Ending commit: none - all changes below are uncommitted, awaiting review

## Objective

Build an Autonomous Engine Monitor inside the existing SignalVerse Prediction Market UI so the user can observe the already-running Discovery + Shadow Entry engine (status, activity, decision distribution, side analysis, a filterable live decision table, and per-candidate decision-trace explainability) without changing any trading/decision logic, without enabling Demo or Real entry, and without deploying anything until approved.

## Scope

- Audit existing persistence first; reuse it wherever possible; add only the minimum new schema.
- No changes to Futures, Spot, Fast Trader, Autonomous Supervisor, or Real Trading.
- No change to Decision Engine logic, Kelly sizing, Time Horizon rules, or thresholds.
- UI is strictly read-only - cannot trigger discovery, entry, resolution, or learning.
- Migration presented only, not executed.
- Do not push/merge/deploy/run migrations/change VPS gates until this report is reviewed.

## Actions Taken

1. **Audit** (Step 1): read `recordPrediction()`, `evaluateMarket()`, `autonomousEntryTick()`, `autonomousDiscoveryTick()`, `assessTradeability()`, `decide()`, and the full `prediction_predictions`/`prediction_markets`/`prediction_autonomous_trades` schemas directly. Findings below.
2. **Designed** the minimum data model: one new table (tick/run health, which structurally cannot exist anywhere else) + ten new nullable columns on the *existing* `prediction_predictions` table (everything else).
3. Wrote the migration file (presented, not executed) matching this project's required `BEGIN; ... IF NOT EXISTS ... NOTIFY pgrst, 'reload schema'; COMMIT;` pattern, plus a documented (not enabled) retention policy.
4. Extended `recordPrediction()` with an optional, backward-compatible `autonomous` parameter - existing manual call sites (scan/analyze) pass nothing and are completely unaffected.
5. Added `annotatePredictionWithEntryOutcome()` - one targeted `UPDATE ... WHERE id=...` backfilling rank/Kelly/cap/would-open onto a row `recordPrediction()` already inserted, called from the exact point in `autonomousEntryTick()` where those values become known - no restructuring of the existing evaluate→gate→rank→size order.
6. Added `recordAutonomousRun()` - a generic wrapper around all five tick-dispatch call sites (discover/entry-real/entry-shadow/resolve/learn) recording duration/success/error/summary. None of the four tick functions' own bodies were touched for this - only the dispatch layer.
7. Added three new, strictly read-only GET actions: `autonomous-status`, `autonomous-decisions` (filterable/paginated), `autonomous-decision-trace` (single candidate, with a checklist *derived* from `decide()`'s own real thresholds - not fabricated).
8. Built `AutonomousEngineMonitor`, a self-contained React component (not embedded inline into the already-14.5k-line `App.tsx` body) covering Steps 4-6: status/health, engine activity, decision distribution, side analysis, a filterable live decision table, and a decision-trace modal. Wired into the existing Prediction tab as a fifth subtab (`'autonomous'`), alongside the existing `feed`/`simulation`/`demo`/`real` subtabs.
9. Wrote `scripts/prediction-observability-test.mjs` (48 checks) and fixed two pre-existing tests whose source-position anchors shifted because of my edits (`prediction-duplicate-protection-test.mjs`, `prediction-shadow-entry-test.mjs` - both were genuine test-authoring fixes, not engine changes).
10. Ran the full local verification: `tsc --noEmit`, `esbuild`, `npm run build` (client + admin), all 16 prediction test files, and attempted live UI verification in a browser (see Root Cause / Findings for what could and couldn't be confirmed this way).

## Files Inspected

`api/predictions.ts` (in full detail: `recordPrediction`, `evaluateMarket`, `EngineResult`/`SideEvaluation`/`EdgeResult`/`EvResult`/`TradeabilityResult` interfaces, `decide()`, `assessTradeability()`, `autonomousDiscoveryTick`, `autonomousEntryTick`, the five action-dispatch call sites), `src/app/App.tsx` (`PredictionPanel`, `PredictionSubTab`, the home-tile VIP-gating logic at `HOME_GROUPS.map(...locked=vip&&!isVip...)`), `migrations/prediction_market_autonomous.sql` (style/convention reference), existing prediction test files (to find and fix position-dependent anchors).

## Files Changed

- `api/predictions.ts` - `recordPrediction()` extended (optional param), new `annotatePredictionWithEntryOutcome()`, new `recordAutonomousRun()`, `autonomousEntryTick()` gains a `runId` param + one annotate call, all five tick dispatch call sites wrapped, three new GET actions added.
- `src/app/App.tsx` - `PredictionSubTab` type gains `'autonomous'`, tab bar updated, new `AutonomousEngineMonitor` component (~180 lines) added after `PredictionPanel`.
- `migrations/prediction_market_observability.sql` (new) - presented, **not executed**.
- `scripts/prediction-observability-test.mjs` (new) - 48 structural checks.
- `scripts/prediction-duplicate-protection-test.mjs`, `scripts/prediction-shadow-entry-test.mjs` - two small anchor-string fixes (test-authoring only, see Root Cause / Findings).

**No file belonging to Futures, Spot, Fast Trader, or Autonomous Supervisor was touched. No line inside `evaluateMarket()`, `decide()`, `assessTradeability()`, `computeAutonomousPositionSize()`, `timeHorizonGate()`, or any threshold constant was modified.**

## Root Cause / Findings

### Audit result (Step 1) - see the conversation for the full 10-point table; summary:
**CONFIRMED:** evaluated candidates, decisions, and prediction_class were already fully persisted in `prediction_predictions`. **CONFIRMED gap:** tick/run-level health (duration, success/failure, "last successful tick") was persisted *nowhere* - only obtainable via SSH + `journalctl` on the VPS, which is exactly why the user couldn't monitor this from inside the app. **CONFIRMED gap:** liquidity, spread, tradeability pass/fail, AI-recheck usage, rank, Kelly recommendation, and capped position size were all computed by the engine during evaluation/sizing and discarded after the HTTP response - never persisted. **CONFIRMED:** `prediction_markets`/`prediction_autonomous_trades` already fully support the Discovery-status and Demo-trade panels respectively.

### Implementation correctness (CONFIRMED via 48 structural checks in the new test, plus manual code reading):
- `recordPrediction()`'s new `autonomous` parameter is optional; every original column it wrote is still written unconditionally; the new fields are added via a conditional spread that can never replace the base insert object.
- `annotatePredictionWithEntryOutcome()` only ever calls `.update()` targeted by `id` - never an insert, never a bulk update.
- The annotate call in `autonomousEntryTick()` happens *before* "THE ONLY BRANCH POINT BETWEEN SHADOW AND REAL ENTRY" comment (i.e., identically for `dryRun=true` and `dryRun=false`), is wrapped in `.catch(() => {})` (cannot block or fail a real entry), and `rank`/`wouldOpen` are derived directly from the candidate's own position in the `ranked` array - not invented.
- `recordAutonomousRun()` re-throws a genuine tick failure unchanged (existing error-handling behavior preserved exactly) and its own run-record insert is itself best-effort (`.then(() => {}, () => {})`) - observability can never turn a working tick into a failing one, nor hide a real failure from the caller.
- All three new GET actions require `req.method === 'GET'` and `telegramId` auth, and contain zero `.insert(`/`.update(`/`.delete(`/`.upsert(` calls anywhere in their blocks (checked programmatically, not just read).
- The decision-trace checklist reproduces `decide()`'s *real* branches (`quality.overall < 25`, `netEv < 0`, `Math.abs(netEdge) < t.minEdge`, `confidence < t.minConfidence`) using the *real* `DEFAULT_THRESHOLDS` constants and the row's own stored values - verified by the test reading `decide()`'s actual source and cross-checking the trace code references the same constants, not hardcoded duplicate numbers. Tradeability checklist items are read verbatim from `assessTradeability()`'s own reason codes (`LOW_LIQUIDITY_SCORE`/`SPREAD_TOO_WIDE`/`INSUFFICIENT_DEPTH`/`NO_ORDER_BOOK`), stored as-is.

### Live browser verification - CONFIRMED and UNCONFIRMED, stated honestly:
**CONFIRMED:** the app builds successfully with the new component; `tsc --noEmit` reports zero new diagnostics (the same 3 pre-existing, unrelated `App.tsx` errors remain, confirmed by line number); the compiled production bundle demonstrably contains the new code (`grep` for `autonomous-status` and `SHADOW MODE` found matches in the built JS).
**UNCONFIRMED - stated explicitly, not glossed over:** I could not complete a live, authenticated, end-to-end browser walkthrough of the new UI. I started the real dev server and opened the app in a browser, but the Prediction tab is gated behind a **pre-existing, unrelated VIP check** (`src/app/App.tsx`: `onClick={()=>{ if(locked) return; ...}}`, `locked = vip && !isVip`) that has nothing to do with this phase's changes - confirmed by reading the exact gating code, and by confirming that a *different*, non-gated tile (`تحلیل`/Analysis) navigates correctly in the same session. No real Telegram/VIP session is available in this local, unauthenticated dev preview, and separately, no backend `api/predictions.ts` handler runs under the plain Vite dev server (confirmed via 404s in the browser console) - so even bypassing the VIP gate would not have exercised the real new endpoints locally. Per explicit instruction, I am stating this rather than claiming a success I did not actually observe.

## Implementation

See Actions Taken #4-8. Summarized: additive backend wiring (two new persistence helpers + one generic run-tracking wrapper + three read-only endpoints) and one new, self-contained React component consuming them. Zero forked engine logic anywhere.

## Tests Executed

| Command | Result | Pass/Fail |
|---|---|---|
| `npx tsc --noEmit` | 0 errors in `api/predictions.ts`; 3 pre-existing, unrelated errors in `App.tsx` (same lines as before this task) | PASS |
| `esbuild api/predictions.ts` | bundles cleanly, 87.4kb | PASS |
| `npm run build` (client + admin) | both succeed | PASS |
| All 16 `scripts/prediction-*-test.mjs` files (including the new one) | all pass | PASS |
| New `scripts/prediction-observability-test.mjs` | 48/48 | PASS |
| Live dev server + browser: app loads, console has no React errors (only expected 404s for the unrunnable-locally API and the pre-existing VIP gate) | confirmed | PASS (environment-limited) |
| Live dev server + browser: full authenticated walkthrough of the new Autonomous Engine Monitor UI | not completed - VIP gate + no local backend (see Findings) | **NOT TESTED, stated explicitly** |
| Built bundle contains the new code (`grep` for `autonomous-status`/`SHADOW MODE`) | found | PASS |

### Additional required verifications
1. UI cannot trigger autonomous trades - **CONFIRMED**: the component only calls the three new GET actions; grepped the component's own source for any POST call - none exists.
2. UI is read-only regarding engine decisions - **CONFIRMED** (same basis).
3. Shadow mode remains dry-run - **CONFIRMED**: zero lines inside `autonomousEntryTick`'s `dryRun` branch or the shadow dispatch were touched beyond adding the `runId` parameter/observability calls, which are themselves proven (48 checks) to never reach the trade insert.
4. Demo Entry remains disabled - **CONFIRMED**: no `jobs.d` gate for `autonomous-enter` exists (unchanged from Phase 7A/7B-1's own verification; this task did not touch the VPS at all).
5. Real Trading remains disabled - **CONFIRMED**: `mode==='real'` still unconditionally returns 501 (unchanged, not touched this phase).
6. Existing autonomous tick still works unchanged - **CONFIRMED** structurally (all 15 pre-existing prediction tests, including duplicate-protection and shadow-entry, still pass); NOT re-verified live against production this phase (no deploy occurred).
7. Monitoring data matches actual engine output - **CONFIRMED** by construction: every new column is populated from a value the engine already computed in the same request (`r.market.liquidity`, `r.orderBook.spreadPct`, `chosen.tradeability`, `toRecheck.has(...)`, the candidate's real rank/Kelly/cap) - nothing is a client-side or server-side re-derivation using different math.
8. No duplicate or fabricated monitoring records - **CONFIRMED**: `annotatePredictionWithEntryOutcome` is a single `UPDATE ... WHERE id = X`, never an insert; `recordAutonomousRun` inserts exactly one row per tick invocation.
9. No sensitive AI/API data reaches the frontend - **CONFIRMED**: the three new GET actions never select or return API keys, prompts, or raw provider responses - only the same `evidence`/`explanation` jsonb columns already exposed by every other prediction-reading action in this file (e.g. the existing feed).

## Build Result

`npm run build` (both `vite build` invocations - main app and admin) succeed with zero errors. Bundle size increase from this phase: main app JS ~1,315.77kB → ~1,336.69kB (~21kB, mostly the new component; the pre-existing 500kB chunk-size warning is unrelated and pre-dates this change).

## Git Status

Working tree in `SignalVerse-Main-farzam` (branch `farzam`) has 4 modified files and 2 new files, all uncommitted:
```
 M api/predictions.ts
 M scripts/prediction-duplicate-protection-test.mjs
 M scripts/prediction-shadow-entry-test.mjs
 M src/app/App.tsx
?? migrations/prediction_market_observability.sql
?? scripts/prediction-observability-test.mjs
```
`git diff --check`: no whitespace/conflict-marker issues. Local `farzam` is 3 commits behind `origin/main` (a concurrent session added colleague-invitation and cycle-history features since this task started) - `git diff` shows this concurrent work touched `src/app/App.tsx` (54 lines) but **not** `api/predictions.ts`, the migration, or any of the modified test files. A merge (not expected to be difficult, but not yet attempted) will be needed before this can be pushed.

## Commit

**None.** Per the explicit stop gate, nothing was committed, pushed, merged, deployed, or migrated. All work above exists only as uncommitted local changes, exactly as required for review.

## Remaining Issues

1. Live, authenticated, end-to-end UI verification was not possible in this environment (VIP gate + no local backend) - recommend verifying against a real staging/authenticated session before or immediately after deployment, not skipping this step entirely.
2. `farzam` needs a merge with `origin/main` before any future push (only `App.tsx` has a real, but modest, overlap - 54 lines from an unrelated feature).
3. The retention policy for `prediction_predictions`/`prediction_autonomous_runs` growth is documented in the migration file's own comments but intentionally **not implemented** (no scheduled deletion job exists) - a future, separately-reviewed task per the explicit instruction not to implement destructive cleanup without dedicated review.

## Risks / Limitations

- This is a substantial, real code change (206 lines in `api/predictions.ts`, 230 in `App.tsx`) touching the file that runs the live production autonomous engine - it has NOT been deployed, and per instruction will not be until separately approved.
- The new `prediction_predictions` columns are all nullable and additive; existing rows are unaffected and will simply show NULL for the new fields until re-evaluated by a tick that runs after this migration is applied.
- Untested end-to-end (see Remaining Issues #1) - structural/build/unit-level confidence is high, but a real live walkthrough with actual Discovery/Shadow-Entry data flowing into the rendered UI has not been observed by a human or by me.

## Recommended Deployment Sequence (if/when approved)

1. Merge `origin/main` into `farzam` locally, resolve the expected `App.tsx` overlap (unrelated feature, low risk), re-run the full test/build suite.
2. Apply `migrations/prediction_market_observability.sql` to production (after `npm run backup`, per this project's standing rule) - purely additive (new table + nullable columns), no existing data touched.
3. Commit, push, open a PR, let CI run, merge, let the existing deploy pipeline deliver to the VPS (same pattern as Phases 2-6/7A/7B-1).
4. Post-deploy: confirm the three new GET actions respond correctly with a real authenticated session, confirm `prediction_autonomous_runs` starts accumulating rows on the next real tick, confirm the UI's new "Autonomous" subtab actually renders with a real VIP/admin session (closing the one gap this local environment couldn't verify).
5. Continue Discovery + Shadow Entry exactly as before - this phase changes nothing about when/whether Demo or Real Entry activate; that remains a separate, future, explicitly-approved phase.

## Final Verdict

**Implementation and local testing complete. Stopping here per the explicit stop gate — nothing pushed, merged, deployed, or migrated. Awaiting review and approval before proceeding to the deployment sequence above.**
