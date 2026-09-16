# FINAL MIGRATION + ONCE AUDIT

**Date:** 2026-09-17 · **Scope:** VPS migration-path identification (read-only), migration verification, and a minimal ONCE-mode diagnosis data-flow fix for the Futures Open-Position Re-Analysis feature. Continuation of `futures-open-position-reanalysis-2026-09-16.md` and the prior "FINAL PRE-DEPLOY AUDIT" (not previously published). **No deploy, no push to `main`, no VPS write, no order/position touched.**

## 1. Migration verdict

**Supported VPS migration mechanism: FOUND.**

The previous audit ("FINAL PRE-DEPLOY AUDIT", not yet published to this log) concluded the mechanism was "not confidently identified." That conclusion was **incomplete**, not wrong in spirit — it did not check `ops/` or the project's own `HANDOFF.md` history deeply enough. This pass did, and found a real, previously-executed, working precedent.

**The mechanism** (confirmed from `ops/signalverse-deploy` and a real prior execution logged in `HANDOFF.md`, 2026-09-16T08:32Z / 08:50Z, Phase 8 of the Prediction Market work):

- `ops/signalverse-deploy` (the actual VPS-side release script this repo's CI POSTs a release archive to) states explicitly at its own top: **"Migration/service/nginx installation is operator-managed, not automatic on push."** There is no DDL step anywhere in `.github/workflows/production-ci.yml` or `ops/signalverse-deploy` — confirmed by reading both in full.
- The real mechanism used before (verbatim, from the Phase 8 HANDOFF entry, executed successfully with zero errors — `BEGIN`→`ALTER TABLE`×2→`CREATE INDEX`/`DROP INDEX`→`CREATE TABLE`→`GRANT`→`NOTIFY`→`COMMIT`):
  ```
  scp -P 22123 -i ~/.ssh/signalverse_contabo_ed25519 migrations/<file>.sql root@13.140.149.56:/tmp/<file>.sql
  ssh -p 22123 -i ~/.ssh/signalverse_contabo_ed25519 root@13.140.149.56 "sudo -u postgres psql -v ON_ERROR_STOP=1 -d signalverse_cutover2 -f /tmp/<file>.sql"
  ```
- This is governed by an explicit project rule referenced in that same entry as **"Remote-Shell-Write"** (from an earlier Phase 5): no AI session executes this — an AI session prepares the exact SQL/commands, the **account owner** runs them from their own terminal, using their own SSH key. This session did **not** execute either command above, and will not without a separate, explicit instruction, per the standing rule and this task's own final rule.
- Credentials/environment required: SSH private key `~/.ssh/signalverse_contabo_ed25519` (owner-held, not available to any AI session), port `22123`, host `13.140.149.56`, `root` for the `scp`/`ssh` transport, then `sudo -u postgres psql` on the VPS itself against database `signalverse_cutover2`.
- **Is it safe/idempotent?** The mechanism itself (SSH + direct `psql`) is safe and standard. Whether a *specific* migration file is safe to re-run is a property of that file, not the mechanism — see §2.
- This session independently re-confirmed, read-only via `DATABASE_API_URL`/`DATABASE_SERVICE_ROLE_KEY` (PostgREST's own OpenAPI schema endpoint), that as of this audit `engine_decisions` and `copy_trades` already exist in production, but `copy_trades` is still missing every column from `futures_liquidation_feasibility.sql` (`liquidation_safe`, `protection_status`, `actual_liquidation_price`, `requested_leverage`, `estimated_liquidation_price`, `liquidation_risk_decision`, `liquidation_risk_reason`, `requested_margin_usdt`, `cumulative_funding_usdt` — all absent), and `futures_reanalysis_policies`/`futures_reanalysis_audit` do not exist at all. Neither migration has been applied.
- **I did not execute either migration.**

## 2. Migration dependency/order

**DDL-level dependency: none between the two files.** `futures_reanalysis.sql`'s only foreign keys are to `copy_trades(id)` and `engine_decisions(id)` — both already exist in production today (confirmed live). It does not reference any column from `futures_liquidation_feasibility.sql`. Either file could technically be applied alone or in either order from Postgres's point of view.

**Functional dependency: both are required before this branch can be deployed.** Confirmed by direct code inspection: the real-Binance-open `copy_trades.insert(...)` call (`api/copytrade.ts`, the successful-open path) already unconditionally writes `requested_leverage`/`requested_margin_usdt`/`estimated_liquidation_price`/`liquidation_risk_decision`/`liquidation_risk_reason`. If this branch is merged/deployed before `futures_liquidation_feasibility.sql` runs, **every new real Binance Futures trade-open will fail** (insert against non-existent columns) — not a graceful degradation. `futures_reanalysis_policies`/`futures_reanalysis_audit` writes (from `createDefaultReanalysisPolicy`/`getActiveReanalysisPolicy`/`stopReanalysisPolicyForTrade`) fail soft (caught/logged, or a non-throwing Supabase-client error result) against the missing tables, so a missing `futures_reanalysis.sql` alone would not break trade-opening — it would just leave Re-Analyze permanently inert.

**Recommended order:** apply `futures_liquidation_feasibility.sql` first, then `futures_reanalysis.sql` (matches the order they were designed in and documented in prior reports) — but this is a convention for clarity, not a hard DDL requirement.

**Idempotency — precise, not blanket:**
- `futures_reanalysis.sql`: **fully idempotent.** Both `CREATE TABLE IF NOT EXISTS` statements (including the inline `CHECK` constraint inside each) and both `CREATE INDEX IF NOT EXISTS` statements can be re-run any number of times with zero errors.
- `futures_liquidation_feasibility.sql`: **idempotent for its `ADD COLUMN IF NOT EXISTS` and `CREATE TABLE IF NOT EXISTS futures_funding_events` statements — NOT fully idempotent as a whole file.** Its `ALTER TABLE copy_trades ADD CONSTRAINT copy_trades_protection_status_check CHECK (...)` has no `IF NOT EXISTS` form in Postgres (the file's own comment already says this explicitly). A second run after a successful first run will fail at that exact statement with "constraint already exists." With `psql -v ON_ERROR_STOP=1` and no explicit transaction wrapping in the file itself, a second run would stop there — which in this file's specific statement order does not lose anything (everything before that point is already a no-op on a second run, and `futures_funding_events` — which comes *after* the constraint line — would already exist from the first successful run too), but it is not a "safe to blindly re-run" file. **Recommend the owner run it with `psql -1` (or `--single-transaction`)** so a failure anywhere rolls back atomically instead of leaving a partially-applied state — this is a `psql` command-line flag, not a change to the SQL file itself, so it requires no code change.

**Expected production schema objects after both migrations are applied** (exact checklist):

| Object | Type | Notes |
|---|---|---|
| `copy_trades.requested_leverage` | column, numeric | nullable |
| `copy_trades.requested_margin_usdt` | column, numeric | nullable |
| `copy_trades.estimated_liquidation_price` | column, numeric | nullable |
| `copy_trades.actual_liquidation_price` | column, numeric | nullable |
| `copy_trades.liquidation_risk_decision` | column, text | nullable |
| `copy_trades.liquidation_risk_reason` | column, text | nullable |
| `copy_trades.liquidation_safe` | column, boolean | nullable; NULL is never "safe" |
| `copy_trades.protection_status` | column, text | CHECK IN ('SAFE','AT_RISK','UNVERIFIED','UNKNOWN') |
| `copy_trades.cumulative_funding_usdt` | column, numeric | nullable |
| `copy_trades_protection_status_check` | CHECK constraint | on `copy_trades.protection_status` (one-time add, not idempotent) |
| `futures_funding_events` | table | id, trade_id→copy_trades, telegram_id, exchange, symbol, side, exchange_income_id, funding_time, funding_amount_usdt, created_at |
| `futures_funding_events_dedup` | unique index | (exchange, exchange_income_id) |
| `idx_futures_funding_events_trade` | index | (trade_id) |
| `futures_reanalysis_policies` | table | id, trade_id UNIQUE→copy_trades, telegram_id, status CHECK, created_at, updated_at, last_analyzed_at, last_decision_id→engine_decisions, last_snapshot jsonb, processing_started_at, stopped_at, stop_reason + inline CHECK `futures_reanalysis_policies_stopped_fields_consistent` |
| `idx_futures_reanalysis_policies_active` | partial index | (status) WHERE status='ACTIVE' |
| `futures_reanalysis_audit` | table | id, trade_id→copy_trades, policy_id→futures_reanalysis_policies, telegram_id, triggered_by CHECK, trigger_reason, old_stop_loss, old_tp1, new_raw_side/stop_loss/tp1, engine_decision_id→engine_decisions, engine_outcome, supervisor_result/reason, risk_result, estimated_or_actual_liquidation_price, protection_result, final_action, diagnosis_code CHECK (9 values), diagnosis_reason, comparison jsonb, created_at |
| `idx_futures_reanalysis_audit_trade` | index | (trade_id, created_at DESC) |
| `GRANT ... TO service_role` | grants | on `futures_funding_events`, `futures_reanalysis_policies`, `futures_reanalysis_audit` |

**PostgREST schema-cache reload**: both migration files' own headers already flag this — after DDL, the same access path must also issue `NOTIFY pgrst, 'reload schema'` (or restart the PostgREST process) so the new columns/tables are visible over the REST API immediately. The Phase 8 precedent's own statement sequence (`...→GRANT→NOTIFY→COMMIT`) confirms this `NOTIFY` step is already the established convention for this exact mechanism — the owner's prepared commands for these two migrations should include it the same way.

## 3. ONCE Diagnosis Fix

**Exactly what was changed** (`api/copytrade.ts`, both issues, minimal data-flow only):

1. **Regime** (`api/copytrade.ts`): extracted the 6-line regime computation that `syncRealBinanceTrades`'s own per-tick `getTickRegimeOnce()` closure already did (`buildLiveSpotRegimeInputs()` → `computeMarketRegime(...).regime`) into a standalone top-level function, `computeLiveRegimeNow()`. `getTickRegimeOnce()` now just calls it once and memoizes the result exactly as before — **AUTO's behavior and computation are byte-for-byte unchanged**, this is a pure extraction. The `action=reanalyze&reanalysisMode=ONCE` handler now calls `computeLiveRegimeNow()` directly (a ONCE request is a single one-off action, not a per-tick loop, so there is nothing to memoize against — no duplicate fetch is introduced) and passes the result as `runFuturesReanalysis`'s `currentRegime` argument, which it previously omitted (defaulting to `null`).
2. **Protection status**: the ONCE handler previously hardcoded `computeProtectionStatus(true, liquidationSafeNow)` — asserting the SL order was confirmed live without checking. It now issues one additional **read-only** query, `queryBinanceAlgoOrders(apiKey, apiSecret, pair)` (the exact same GET `/fapi/v1/openAlgoOrders` call this file's own protection-leg helper already uses as its first step, before ever deciding whether to place an order), and checks whether an order matching `trade.exchange_sl_order_id` is present with `isLiveAlgoOrder(o)` true. The real result feeds `computeProtectionStatus(slProtectedNow, liquidationSafeNow)`.

**Why it was necessary**: without these two facts, `classifyReanalysisDiagnosis` could never reach `MARKET_REGIME_CHANGED` (currentRegime was always `null`, so the `originalRegime !== currentRegime` check could never be true) or `EXECUTION_OR_PROTECTION_PROBLEM` (protection_status could never be `'UNVERIFIED'` when `slProtected` was hardcoded `true`) for a ONCE-triggered pass — a real diagnostic accuracy gap, though never a safety issue (it never affected any actual SL/TP/order action, only the informational diagnosis label shown for that one pass).

**Confirmed unchanged**: no Engine/Strategy formula, no ATR/multiplier/TP formula, no Supervisor prompt or parsing logic, no liquidation-safety formula, no diagnosis precedence order, no protection-update logic (place-new-then-cancel-old), no eligibility logic, and no order-placing/cancelling/position-modifying call was added — `queryBinanceAlgoOrders` is a pure GET with zero side effects, and `computeLiveRegimeNow` performs the same read-only multi-source fetch AUTO already performs. AUTO's own code path (`getTickRegimeOnce`, the eligibility branches, `runFuturesReanalysis` itself) is unchanged except for the pure-extraction refactor in item 1 above, verified behavior-identical by the unchanged 101/101 fault-test and unchanged AUTO-path tests in the reanalysis suite.

## 4. Tests

```
npx tsc --noEmit -p .                                                 → 0 errors in api/copytrade.ts / api/analyze.ts
npm run build                                                         → PASS (web + admin)
esbuild api/*.ts --bundle --platform=node --format=esm --packages=external → PASS
node --test scripts/futures-reanalysis-test.mjs                       → 70/70 PASS (63 pre-existing + 7 new)
node --test scripts/futures-real-execution-fault-test.mjs             → 101/101 PASS (no regression)
```
`scripts/futures-liquidation-feasibility-test.mjs` was **not** re-run — this pass touched no liquidation-safety formula or function, only Re-Analysis regime/protection wiring, so its path is materially unaffected (last confirmed 64/64 in the prior pass).

**7 new tests**, minimum needed to prove the fix and nothing more:
- `structural`: `computeLiveRegimeNow` exists and `syncRealBinanceTrades`'s own tick-memoization now delegates to it (proves AUTO's regime computation is unchanged, just factored out).
- `structural`: a sanity check that the ONCE-block text slice used by the next two tests actually captured the intended code (bounded length, not the whole file — this project's CRLF line endings previously caused a similar regex-boundary miss in other test files; guarded against here explicitly).
- `structural`: the ONCE branch calls `computeLiveRegimeNow()` and threads its result into `runFuturesReanalysis`'s `currentRegime` argument.
- `structural`: the ONCE branch determines protection via the read-only `queryBinanceAlgoOrders`/`isLiveAlgoOrder`, never `ensureBinanceProtectionLeg`/`placeBinanceProtectionOrder`, and the old hardcoded `computeProtectionStatus(true,` pattern is gone from that branch specifically.
- `structural`: the old hardcoded pattern no longer exists **anywhere** in the file (not just patched over in one spot).
- Functional (via `runFuturesReanalysis` directly, `triggered_by: 'USER_ONCE'`): a call shaped exactly like the fixed handler's now-correct call (real `currentRegime` argument, `protection_status` reflecting a real check) correctly produces `MARKET_REGIME_CHANGED`.
- Functional (same call pattern): correctly produces `EXECUTION_OR_PROTECTION_PROBLEM` when protection is `UNVERIFIED`.

AUTO-unchanged, precedence-unchanged, and no-new-position-path were already covered by the 63 pre-existing tests (all still passing verbatim) and were not re-derived here.

## 5. Safety verification

- No real order was placed, cancelled, or modified. The only two exchange-facing operations introduced (`queryBinanceAlgoOrders` in the fix; the earlier read-only PostgREST schema query for §1) are both plain GET requests with zero side effects.
- No real position was opened, closed, resized, or reversed.
- No deployment occurred; no push to `main`/`master`.
- No VPS write occurred. The one production interaction this session performed was a read-only PostgREST OpenAPI schema fetch (confirming which tables/columns exist) using the same `DATABASE_API_URL`/`DATABASE_SERVICE_ROLE_KEY` this project's other read-only tooling (`npm run backup`, `scripts/standard-futures-migration-test.mjs`) already uses for reads.
- Neither `migrations/futures_liquidation_feasibility.sql` nor `migrations/futures_reanalysis.sql` was executed against any database, by this session or otherwise, during this task.
- All code changes (`api/copytrade.ts`, `scripts/futures-reanalysis-test.mjs`) were committed to the existing feature branch (`futures-liquidation-feasibility-fix`), not `main`.

## 6. Final deployment blocker

**Yes — the only remaining blocker is the actual controlled execution of the two SQL migrations on the VPS**, by the account owner, via the confirmed mechanism in §1 (`scp` + `ssh` + `sudo -u postgres psql -v ON_ERROR_STOP=1 -f ... ` + schema-cache `NOTIFY`), run in the order given in §2, followed by the standard `npm run backup` beforehand per this project's own DDL convention. No code defect, no architectural gap, and no unresolved design question remains in the Re-Analyze/diagnosis/liquidation-safety logic itself. Once both migrations are confirmed applied and the schema cache is reloaded, this branch is deployable through the normal CI → `ops/signalverse-deploy` path with no further changes required.

---
No live trading was performed. No real position or order was touched. No deploy, no push to `main`, no VPS write.
