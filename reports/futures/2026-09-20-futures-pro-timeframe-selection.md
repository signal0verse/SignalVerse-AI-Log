# Futures Pro per-coin multi-timeframe selection

## Metadata

- Date: 2026-09-20 (Asia/Kuala_Lumpur)
- Task ID: user-requested Futures Copy Trade timeframe selection
- Module: Futures
- Mode: implementation, Production migration, release, and live verification
- Repository: `signal0verse/signalverse-main`
- Branch: `codex/futures-pro-timeframes`
- Starting commit: `c9bc4f5db3983fe62b6c6f9c94695aecae9df648`
- Active Production commit: `6430c450057af53e4a81d4a1a37322a5902b1783`
- Documentation head: `5e56ab7ca92f25d36ea235184c0f267b2c0795cf` (`[skip ci]`)

## Objective

Add simultaneous multi-timeframe selection when a user adds or edits a coin in
Copy Trade > Futures > AI Trading Pro, for both Demo and Real. Keep weekly
available but unselected by default; select every other currently supported
Futures Pro timeframe by default. Do not change unrelated behavior.

## Scope

The allowed product change was limited to per-coin timeframe configuration,
persistence, automatic-analysis routing, its UI/help text, a migration, focused
tests, and the repository-required documentation. The owner subsequently gave
explicit authorization to publish Production. The database migration and
application release were performed; no exchange call, AI call, order, or
position mutation was performed.

## Actions Taken

1. Fast-forwarded the local `main` checkout to `c9bc4f5` while preserving all
   pre-existing untracked files.
2. Traced the Pro-list add/edit UI, `futures_pro_setups` CRUD, and
   `futuresProWatchTick` automatic analysis path.
3. Added a per-row `timeframes` array with an allowlist of
   `15m/1h/4h/1d/1w`, a minimum of two unique selections, and a default of
   `15m/1h/4h/1d`.
4. Added multi-select controls to both add and edit forms for Demo and Real and
   displayed each saved row's selected intervals.
5. Routed the stored selection into the existing automatic multi-timeframe
   candle builder. Other consumers of that builder retain their existing
   default behavior.
6. Added an additive migration for existing installations and aligned the base
   table migration for fresh installations.
7. Updated the floating help knowledge, `TRADING_STRATEGY.md`, and `HANDOFF.md`.
8. Added and executed a no-env/no-network focused regression script.
9. Ran the mandatory JSON backup (315,742 rows, zero failed tables). A live
   coverage audit found the legacy script covered only 65 of 88 Production
   tables, so a native PostgreSQL custom-format backup was additionally taken;
   its checksum and `pg_restore --list` catalog were valid and contained TABLE
   DATA for all 88 tables.
10. Applied `migrations/futures_pro_timeframes.sql` atomically with
    `ON_ERROR_STOP`; 145 existing rows migrated to `15m/1h/4h/1d`. Verified
    the default, NOT NULL constraint, allowlist/cardinality constraint, zero
    invalid rows, zero weekly-enabled rows, schema reload, and PostgREST HTTP
    200 visibility.
11. Opened PR #134, waited for the full pull-request CI gate, merged it, then
    waited for the push-triggered Production workflow run `35454786166` to
    complete successfully, including its delivery step.
12. Verified exact active SHA, release symlink, deployed marker, active service,
    public home and health HTTP 200, deployed source markers, and both new UI
    strings in the public JavaScript bundle.

## Files Inspected

- `AGENTS.md`
- `CLAUDE.md`
- latest entries in `HANDOFF.md`
- `docs/AI_HANDOFF.md`
- all of `TRADING_STRATEGY.md`
- `docs/testing/stability-test-runbook.md`
- `docs/fixes/futures-real-execution-safety.md`
- relevant call sites in `src/app/App.tsx`, `api/copytrade.ts`, and
  `api/analyze.ts`
- existing `futures_pro_setups` migrations and focused Futures Pro tests

## Files Changed

- `src/app/App.tsx`
- `api/copytrade.ts`
- `api/analyze.ts`
- `migrations/futures_pro_setups.sql`
- `migrations/futures_pro_timeframes.sql` (new)
- `scripts/futures-pro-timeframes-test.mjs` (new)
- `TRADING_STRATEGY.md`
- `HANDOFF.md`

Unrelated pre-existing untracked files were not staged or modified.

## Root Cause / Findings

- CONFIRMED: the automatic Pro-list tick always requested all five hard-coded
  intervals, including `1w`; no per-coin timeframe setting existed.
- CONFIRMED: Demo and Real use the same `futuresProWatchTick` analysis path, so
  storing the selection on `futures_pro_setups` is the narrow shared solution.
- CONFIRMED: the tick already refuses to analyse when fewer than two timeframe
  inputs are available, so the new UI/API/database minimum of two preserves the
  existing multi-timeframe contract.
- USER-REPORTED: weekly Futures analysis can produce excessively distant
  entry/stop/target geometry and costly holding periods. This task changes the
  default selection only; it does not claim an independent statistical audit of
  weekly performance.

## Implementation

`futures_pro_setups.timeframes` is a non-null `text[]`. Existing and new rows
default to `['15m','1h','4h','1d']`; `1w` remains available as an explicit opt-in.
The backend canonicalizes order, rejects duplicates/unknown intervals, and
requires at least two. Create, read, and update return/persist the setting. The
automatic tick fetches only the selected intervals for that row and passes those
unchanged into the existing analyzer.

No Engine formula, ATR, risk/reward, stop/target calculation, leverage, TP
allocation, credit rule, loop consumption, order adapter, protection policy or
Demo/Real execution policy was changed.

## Tests Executed

- `node scripts/futures-pro-timeframes-test.mjs`
  - PASS: 18/18 offline source/migration/UI/help checks.
- `npm run build`
  - PASS: main Vite build and standalone admin Vite build.
  - Existing large-chunk warning remained.
- production-equivalent esbuild command from the safe test runbook with
  `write:false`, target Node 22
  - PASS: 14 API handlers bundled without writing runtime files.
- `git diff --check`
  - PASS.
- `npx tsc --noEmit`
  - NOT CLEAN: 52 repository diagnostics were emitted, primarily missing UI
    dependencies and existing unrelated types.
  - Focused filter found zero diagnostics in the changed App implementation
    ranges and none in `api/copytrade.ts` or `api/analyze.ts`.

Tests ran on local Node `v24.19.0`, not the Production Node 22 runtime. The API
bundle itself targeted Node 22.

The official GitHub Production CI then repeated the repository suite, disposable
PostgreSQL tests, both builds, all API bundles, packaging, and Production
delivery on Node 22. Run `35454786166` completed successfully in 3m48s.

## Build Result

PASS for both Vite builds and all 14 API bundles. The focused offline regression
suite passed. Full-project TypeScript was not a green gate for the reason above.

## Git Status

The task branch was pushed, PR #134 was merged into `main`, and executable SHA
`6430c450057af53e4a81d4a1a37322a5902b1783` was deployed. A later documentation-
only commit `5e56ab7` used `[skip ci]`; repository HEAD is therefore intentionally
ahead of the active runtime by documentation only. Existing unrelated untracked
user files were not staged or modified.

## Commit

Feature commit: `b6a7c15` — `feat(futures): add per-coin timeframe selection`.
Migration evidence commit: `eb0b315`.
PR #134 merge / active runtime: `6430c450057af53e4a81d4a1a37322a5902b1783`.
Post-release documentation-only head: `5e56ab7` (`[skip ci]`).

PR: `https://github.com/signal0verse/signalverse-main/pull/134`
Production run: `https://github.com/signal0verse/signalverse-main/actions/runs/35454786166`

## Remaining Issues

- The new UI was build-verified but not exercised inside an authenticated
  Telegram/browser session.
- The legacy JSON backup table list currently covers only 65 of 88 exposed
  Production tables. The release was protected by an additional complete native
  PostgreSQL backup, but the script coverage gap remains a separate maintenance
  item and was not mixed into this narrowly scoped product change.
- No private account, real exchange order, live AI analysis or profitability
  test was run.

## Risks / Limitations

The safe rollout order was followed: backup, migration, verification, then the
matching application release. Weekly remains user-selectable; the change is a
safer default, not a hard ban or an Engine repair. Repository HEAD is the later
documentation-only commit while the active executable SHA remains the verified
merge commit stated above.

## Recommended Next Step

Verify the authenticated Demo and Real add/edit flows in the app, including an
existing selected coin, without placing a real order merely to test the setting.
Handle the legacy JSON backup coverage gap as a separate maintenance change.
