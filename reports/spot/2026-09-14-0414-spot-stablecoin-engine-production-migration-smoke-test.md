# Stablecoin Engine — Production Migration + Smoke Test (STOPPED at Phase 2: environment cannot execute DDL)

## Metadata

- Date: 2026-09-14
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine — Allocation architecture)
- Mode: Production migration + live smoke test (requested), STOPPED before DDL execution for a verified environment reason — no destructive or partial action was taken
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: 67138bcd5d6278f79dfd11524d6ef263bd3e3bf8 (unchanged — nothing was committed/pushed to signalverse-main this task)
- Ending commit: 67138bcd5d6278f79dfd11524d6ef263bd3e3bf8

## Objective

Execute `migrations/stablecoin_pair_allocations.sql` against the production Postgres/PostgREST database (self-hosted on the VPS, `signal.easybitpay.com`), verify schema/constraints, verify zero legacy-data impact, and run a battery of live smoke tests (Asset Conflict, concurrency, non-compounding, profit accounting/withdrawal, ROI, capacity/liquidity, scheduler, real-trading safety) per the user's 21-phase mandate, then report honestly — never guessing or declaring a phase green without having actually run and verified it.

## Scope

Allowed: read-only production queries, running the project's own standard backup, executing the one named migration file, live smoke tests of the new Allocation architecture, regression tests, build, `git diff --check`. Explicitly forbidden: DELETE/DROP/TRUNCATE, touching legacy business data, backfilling `allocation_id`, creating a Legacy/Mixed Allocation, migrating old FDUSD, enabling real trading, pushing/deploying signalverse-main code, creating a PR. Only this report may be committed/pushed, to the AI-Log repo only.

## Actions Taken

1. Re-read `migrations/stablecoin_pair_allocations.sql` end-to-end and re-confirmed (again, literally) it is purely additive: `CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS` / `CREATE OR REPLACE FUNCTION` throughout, plus exactly one `UPDATE` statement, scoped only to backfilling the brand-new `id` surrogate-key column on `stablecoin_demo_inventory` (`SET id = gen_random_uuid() WHERE id IS NULL`) — no business column (`setup_id`, `asset`, `balance`, `updated_at`) is touched by it. Zero `DELETE`/`DROP`/`TRUNCATE` anywhere in the file.
2. Checked git status: clean except the three files already modified/added by the prior Implementation task (`api/stablecoin-engine.ts`, `scripts/stablecoin-engine-test.mjs`, `src/app/App.tsx`, `migrations/stablecoin_pair_allocations.sql`) plus pre-existing unrelated untracked scratch paths (`output/`, `tmp/`, `scripts/generate_analysis_catalog_pdf.mjs`).
3. **Ran `scripts/verify-backup-coverage.mjs` (read-only, live) as the mandatory pre-migration backup-adequacy check** — and it failed to even run at first: a Windows CRLF line-ending bug (the file reads `.env.backup.local` by splitting on `'\n'` instead of `/\r?\n/`) broke its own credential loader — the exact same bug already documented and fixed in `scripts/backup-database.mjs`'s own code comment, just never applied to this sibling script. Fixed with the identical one-line change so the check could actually run.
4. That live check then revealed a real, concrete gap: **all 7 `stablecoin_*` tables that exist on production (`stablecoin_demo_setups`, `stablecoin_demo_inventory`, `stablecoin_demo_trades`, `stablecoin_cycle_decisions`, `stablecoin_fee_verifications`, `stablecoin_verification_accounts`, `stablecoin_pair_snapshots`) were missing from `scripts/backup-database.mjs`'s `TABLES` list** — meaning `npm run backup` was silently NOT covering the exact tables this migration is about to alter (`stablecoin_demo_inventory` gets a PK/constraint change; `stablecoin_demo_trades`/`stablecoin_cycle_decisions` gain a new column). Added all 7 to `TABLES` (scoped strictly to the Stablecoin Engine — two other pre-existing, unrelated gaps the same check surfaced, the archived `arbitrage_*` tables and `prediction_autonomous_*`, were deliberately left alone as out of scope for this task; flagging them separately below).
5. Re-ran `verify-backup-coverage.mjs` — confirmed all 7 stablecoin tables now covered; the one remaining failure is exactly those two unrelated, out-of-scope gaps.
6. **Ran `npm run backup` for real against production** — succeeded, 165,623 rows across 65 tables including all 7 stablecoin tables, written to `backups/2026-09-14T04-02-51/`. This is now a genuine, verified pre-migration backup.
7. Took a read-only PRE-migration snapshot of the Stablecoin Engine's production state (script below, zero writes).
8. Attempted to execute the migration. Discovered — after verifying it is a hard environment/network constraint, not a policy refusal I can appeal or work around — that this sandboxed session's outbound network access allows HTTPS only; a direct connectivity test to the VPS's SSH port was refused at the TCP level (`Connection refused`, port 22), and this project's own history (`HANDOFF.md`) confirms `psql` via SSH to the VPS is the *only* mechanism ever used to apply raw DDL here — PostgREST (the one channel this session *can* reach) cannot execute arbitrary SQL by design, and a live check of the production PostgREST OpenAPI spec confirms no generic SQL-execution RPC exists (24 RPC functions total, none matching `sql|exec|query|ddl|migrate`). **STOPPED here per the mandate's own instruction: do not guess, do not fake a result, report the real blocker.**
9. Re-ran the safe, HTTPS/offline-only checks that do not depend on the migration having been applied: regression test suite, full build (web+admin), `git diff --check`, and a live (unauthenticated, read-only, zero-side-effect) HTTP probe of the currently-deployed production `action=real-execute` endpoint.
10. Took a second read-only snapshot to confirm the session's own activity changed nothing structural.

## Files Inspected

`migrations/stablecoin_pair_allocations.sql`, `api/stablecoin-engine.ts`, `scripts/stablecoin-engine-test.mjs`, `src/app/App.tsx`, `scripts/backup-database.mjs`, `scripts/verify-backup-coverage.mjs`, `HANDOFF.md`, `CLAUDE.md`, `.github/workflows/production-ci.yml`, production PostgREST OpenAPI spec (live, read-only), production `stablecoin_demo_setups`/`stablecoin_demo_inventory` (live, read-only).

## Files Changed

- `scripts/backup-database.mjs` — added the 7 missing `stablecoin_*` tables to `TABLES` (additive only).
- `scripts/verify-backup-coverage.mjs` — one-line Windows CRLF parsing fix in its env-file loader (identical to the already-applied fix in `backup-database.mjs`), needed to make the mandatory pre-migration backup-coverage check actually runnable.
- `scripts/_tmp-stablecoin-snapshot.mjs` — new, temporary, **not committed**, read-only snapshot helper used for Phase 1/final-state checks in this task (left on disk for reuse once the migration is applied; safe to delete any time).
- No changes to `api/stablecoin-engine.ts`, `src/app/App.tsx`, or the migration SQL file itself in this task — those are exactly as delivered by the prior Implementation stage.
- **Nothing was committed or pushed to `signal0verse/signalverse-main`.** This report is the only thing pushed, and only to `SignalVerse-AI-Log`.

## Root Cause / Findings

**CONFIRMED:** `scripts/backup-database.mjs` never covered any of the 7 `stablecoin_*` production tables — a real, pre-existing gap in this project's own backup tooling, discovered by actually running its own coverage verifier rather than assuming it was fine. Fixed (additive) before running the real backup.

**CONFIRMED:** `scripts/verify-backup-coverage.mjs` had the exact same Windows CRLF `.env.backup.local`-parsing bug that `scripts/backup-database.mjs`'s own code comment already documents and fixes — meaning this specific safety-verification script had never actually been runnable on Windows since it was written. Fixed with the identical one-line change.

**CONFIRMED:** `npm run backup` now succeeds and covers all 7 stablecoin tables (165,623 total rows, `backups/2026-09-14T04-02-51/`).

**CONFIRMED (live, read-only production query):** Pre-migration state —
- `stablecoin_demo_setups`: 41 total, 1 RUNNING, 40 STOPPED.
- `stablecoin_demo_inventory`: 94 rows.
- `stablecoin_demo_trades`: 937 rows (at snapshot time; see note below).
- `stablecoin_cycle_decisions`: 1,716 rows (at snapshot time; see note below).
- The single currently-**RUNNING** setup is `91c730c2-f029-4d76-86ab-2a40a5fb78c8` (created 2026-09-13T12:55:05Z, `capital_usd=5000`, `last_tick_at` updating every ~5 minutes) — its inventory has already drifted to `USDC=0, USDT=0, FDUSD≈5006.25` via the same pre-redesign shared-pool bug documented in the earlier audits. This is the setup that must be stopped via `stop-demo` before any new Allocation is created (mandate Phase 6) — **not yet done, since the migration itself hasn't been applied and there is nothing to conflict with yet.**
- The originally-documented legacy setup `e7ea4738-7502-419b-8cbc-ea8605fb468e` (FDUSD 5006.50) is present, **STOPPED**, byte-identical to its previously-documented state.
- **12 total setups** show the identical FDUSD-drift signature (~$2,500–$5,006 in FDUSD, `USDT=0, USDC=0`), all from earlier testing of the pre-redesign engine — all `STOPPED` except the one above. None of this was touched, and none of it will ever be touched by the new migration (verified structurally in the prior Implementation stage's report).
- `stablecoin_pair_allocations` does not exist yet (migration not applied) — trivially, zero Allocations, zero Legacy/Mixed Allocations, confirmed by the query itself failing with `column ... does not exist` / the table being absent from the live PostgREST OpenAPI spec.
- The trades/decisions row counts increased slightly between the two read-only snapshots taken in this task (937→940 trades, 1,716→1,722 decisions) — **this is the pre-existing `signalverse-fast-jobs.timer` cron continuing to tick the still-RUNNING legacy setup every 5 minutes, completely independent of anything this task did.** No write of any kind was issued by this session against any Stablecoin table.

**CONFIRMED (the actual blocker, verified directly, not assumed):** This session's Bash tool can reach the production PostgREST HTTPS endpoint (used successfully for the backup, both snapshots, and the coverage check) but a direct TCP connection to the VPS's SSH port was refused (`ssh ... root@13.140.149.56`: `Connection refused`, port 22) — a network-layer restriction of this sandboxed environment, not a permission prompt that can be approved. Cross-checked against this project's own `HANDOFF.md`: every prior production migration on this VPS (post-2026-09-01 cutover) was applied via `psql -v ON_ERROR_STOP=1` over SSH — there is no other path. A live query of the production PostgREST OpenAPI spec confirms zero generic SQL-execution RPC functions exist (24 RPC functions total; none match `sql|exec|query|ddl|migrate`) — PostgREST itself cannot run arbitrary DDL by design, so this is not a workaround-able gap, it is the correct, secure behavior of PostgREST.

**CONFIRMED (live, read-only, zero side effects):** `GET https://signal.easybitpay.com/api/stablecoin-engine?action=real-execute` (no auth) → `HTTP 403 {"error":"Admin only - this feature is not available to ordinary users"}`. This proves the currently-deployed production code's admin gate is in front of `real-execute` and cannot be bypassed unauthenticated — it does **not** independently re-prove the `501` response itself (that requires a valid admin session this task does not have), which remains confirmed by source-code inspection only (unchanged since the prior Implementation report). Also note: this probe hit the **currently-deployed** (pre-redesign) code — the new Allocation-architecture code has not been deployed (per this stage's explicit no-deploy instruction), so this result says nothing new about the new code's `real-execute` handler; that stays verified only via the regression-test/structural checks below.

## Implementation

No implementation changes to the Stablecoin Engine itself in this task — this stage is migration execution + verification only. The two incidental fixes (backup coverage gap, CRLF parser bug) are backup-tooling hygiene, not engine changes, and are additive/safe by construction (verified: `git diff --check` clean, both scripts still run and produce more-correct output than before).

## Tests Executed

| # | Test | Command | Result |
|---|---|---|---|
| 1 | Backup coverage verifier (before fix) | `node scripts/verify-backup-coverage.mjs` | Crashed — CRLF env-parsing bug |
| 2 | Backup coverage verifier (after CRLF fix) | `node scripts/verify-backup-coverage.mjs` | Ran; 13 passed / 1 failed (7 stablecoin tables + 7 unrelated tables missing) |
| 3 | Backup coverage verifier (after adding stablecoin tables) | `node scripts/verify-backup-coverage.mjs` | 13 passed / 1 failed (only the 2 unrelated, out-of-scope gaps remain) |
| 4 | Real production backup | `npm run backup` | ✅ 165,623 rows / 65 tables, incl. all 7 stablecoin tables |
| 5 | Pre-migration read-only snapshot | ad hoc script (see below) | ✅ captured, see Findings |
| 6 | SSH connectivity to VPS | `ssh ... root@13.140.149.56 echo hi` | ❌ `Connection refused` (port 22) — network-layer, not a permission prompt |
| 7 | Production PostgREST RPC inventory (read-only) | fetch OpenAPI spec | ✅ 24 RPC functions, none generic-SQL-capable |
| 8 | Stablecoin regression suite | `node --test scripts/stablecoin-engine-test.mjs` | ✅ all checks passed |
| 9 | Full build (web + admin) | `npm run build` | ✅ both succeeded |
| 10 | git diff --check | `git diff --check` | ✅ clean (only a benign CRLF-will-be-replaced warning, not a whitespace error) |
| 11 | Live real-execute probe (unauthenticated) | `curl .../action=real-execute` | ✅ `403` (correctly gated; does not itself prove 501, see Findings) |
| 12 | Post-attempt read-only snapshot | ad hoc script (see below) | ✅ confirms zero structural change from this session |

The ad hoc snapshot script used for tests 5/12 (read-only, zero writes — `count`/`select` only, no `insert`/`update`/`delete` anywhere in it):

```js
// scripts/_tmp-stablecoin-snapshot.mjs (temporary, not committed)
// counts stablecoin_demo_setups (total/RUNNING/STOPPED), stablecoin_demo_inventory,
// stablecoin_demo_trades, stablecoin_cycle_decisions; selects all setups and all
// inventory rows for the FDUSD-drift audit above.
```

## Build

`npm run build` — both `vite build` (web) and `vite build --config vite.admin.config.ts` (admin) succeeded. No new warnings beyond the pre-existing chunk-size notice.

## Git Status

Clean except: `scripts/backup-database.mjs` (modified, additive), `scripts/verify-backup-coverage.mjs` (modified, one-line bugfix), the three files from the prior Implementation stage (`api/stablecoin-engine.ts`, `scripts/stablecoin-engine-test.mjs`, `src/app/App.tsx`), `migrations/stablecoin_pair_allocations.sql` (untracked, unchanged since prior stage), and pre-existing unrelated untracked scratch paths. `signalverse-main`: nothing committed, nothing pushed, `HEAD` unchanged.

## Commit

None in `signal0verse/signalverse-main`. This report's own commit SHA will be in `SignalVerse-AI-Log` (see end-of-task announcement).

## Remaining Issues

1. **The migration has not been applied to production.** It cannot be applied from this sandboxed session — SSH (the only mechanism this project has ever used for raw DDL) is refused at the network layer here. **The user must run it themselves**, from a machine with real network access to the VPS (their own machine already has the SSH key and already has this exact file on disk, since it's the same checkout):
   ```bash
   ssh -i ~/.ssh/signalverse_contabo_ed25519 root@13.140.149.56 \
     "psql -v ON_ERROR_STOP=1 -d signalverse_cutover2" < migrations/stablecoin_pair_allocations.sql
   ```
   (`signalverse_cutover2` is the production database name per this project's own `HANDOFF.md`, 2026-09-09 entry — worth a quick live confirmation, e.g. `\l`, before running if there's any doubt it has since been renamed.)
2. Once applied, **every remaining phase of the user's 21-phase mandate (Phases 3–21: schema verification, legacy-integrity re-check, stopping the currently-RUNNING legacy setup, live Allocation smoke test, real Asset Conflict DB test, concurrency test, non-compounding/profit-accounting/withdrawal/idempotency/ROI/capacity tests, final state check) is directly resumable from this same kind of session** — all of them go through PostgREST (HTTPS, already proven reachable) via `supabase-js`, including calling the new `create_stablecoin_pair_allocation`/`stop_stablecoin_pair_allocation`/`record_stablecoin_profit_withdrawal` RPC functions directly, independent of whether the new API code (`api/stablecoin-engine.ts`) is deployed — which it deliberately is not yet, per this stage's own no-deploy instruction.
3. Two **unrelated** backup-coverage gaps were discovered as a side effect and deliberately left alone (out of this task's scope): the archived `arbitrage_*` tables (`arbitrage_fee_snapshots`, `arbitrage_market_snapshots`, `arbitrage_opportunities`, `arbitrage_simulation_runs`) and `prediction_autonomous_runs`/`prediction_autonomous_trades`/`prediction_calibration_snapshots`. Worth a separate, dedicated fix.
4. `scripts/_tmp-stablecoin-snapshot.mjs` is left on disk (untracked, harmless, read-only) for reuse in the resumed phases; delete it whenever convenient.

## Risks / Limitations

- Every "NOT RUN" item below is genuinely not run — none were assumed, simulated, or reported as passing without real execution, per the user's explicit instruction.
- The live `real-execute` 403 probe used the OLD (currently-deployed, pre-redesign) code, not the new Allocation-architecture code — it is weaker evidence than it would be post-deploy, and is reported as such above.

## Recommended Next Step

User runs the migration command above (or confirms the DB name first). Once done, resume this same task at Phase 3 (schema verification) — no re-explanation needed, this report plus the prior Implementation report cover full context.

---

## FINAL STATUS TABLE

```
MIGRATION EXECUTED: NO
BACKUP VERIFIED: YES
LEGACY DATA CHANGED: NO
LEGACY DATA BACKFILLED: NO
LEGACY ALLOCATION CREATED: NO
OLD FDUSD USED BY NEW ENGINE: NO
FRESH ALLOCATION CREATED: NO
ASSET CONFLICT REAL DB TEST: NOT RUN
REAL CONCURRENCY TEST: NOT POSSIBLE (blocked upstream of this test — migration not applied)
PROFIT ACCOUNTING TEST: NOT RUN (pure-function version already PASS in the prior Implementation stage)
PROFIT WITHDRAWAL TEST: NOT RUN
IDEMPOTENCY TEST: NOT RUN
NON-COMPOUNDING TEST: NOT RUN (live) / PASS (pure-function + structural, prior stage)
ROI TEST: NOT RUN (live) / PASS (pure-function, prior stage)
CAPACITY TEST: NOT RUN (live) / PASS (pure-function, prior stage)
SCHEDULER VERIFIED: YES (code-level, unchanged — no new per-pair scheduler/lock exists; live allocation-processing behavior NOT RUN since no allocation exists yet)
REAL TRADING ENABLED: NO
REAL BINANCE ORDER SENT: NO
BUILD: PASS
REGRESSION TESTS: PASS
GIT DIFF CHECK: PASS
PRODUCTION DEPLOYED: NO
```
