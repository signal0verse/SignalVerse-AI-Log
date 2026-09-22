# Real Futures release-candidate freeze audit — 2026-09-22

## 1. EXECUTABLE CANDIDATE

Requested executable SHA `428c2c3bfb4edbf09cf1423f5aa408684341d65f` exists, has parent `751819782fd31376a4745acdce657a5e92a11b42`, and the isolated `codex/futures-correctness-2026-09-22` worktree is clean. The next commit, `66a2f1dae44d8962ab6c694a95a53ca1e266c7f9`, changes only `HANDOFF.md` and `docs/testing/real-futures-final-correctness-gate-2026-09-22.md`; it is not the executable candidate. The exact seven-script focused matrix was rerun on that code and reported 287 pass / 0 fail / 0 skip. The two pending SQL files are `migrations/futures_reanalysis_claims.sql` and `migrations/futures_real_portfolio_capacity.sql`.

**Freeze finding:** the SHA and test-count identity match, but the claimed Real Binance software price-source behavior does not match the actual call sites. The candidate must not be treated as release-approved merely because 287 tests pass.

## 2. DIFF AUDIT

Against Production SHA `3d738da8d32ee61e552646c3d2db14715c1ca6ea`, 24 files changed over three executable commits. Areas: Re-Analyze concurrency and durable pending (`api/copytrade.ts`, claims migration and tests); protection lifecycle and liquidation safety (`api/copytrade.ts`, fault tests); price source and timeframe provenance (`api/analyze.ts`, `api/copytrade.ts`, price-basis/correctness tests); portfolio capacity (capacity migration, SQL fixtures/tests and fail-closed count read); Supervisor same-direction alignment and WAIT provenance (`api/analyze.ts`, correctness tests); accounting (final funding test and read-only query); typecheck tooling (`scripts/futures-typecheck-delta.mjs`); UI help/labels (`api/analyze.ts`, `src/app/App.tsx`); documentation and tests (HANDOFF, AI_HANDOFF, reports, test scripts). No `TRADING_STRATEGY.md`, Spot implementation, Demo implementation, Shadow observer, exchange credential or account-setting file changed. Engine score selection formula and Supervisor authority code did not change; corrected Real alignment metadata can change Supervisor input, which is intentional and not an authority change.

**P0 release blocker discovered in this audit:** `syncRealMexcTrades` at `api/copytrade.ts:2484-2505` now fetches Binance USD-M Contract/Mark candles and calls `decideBinanceRealTradeAction`, then may call `applyRealMexcAction`. Conversely, `syncRealBinanceTrades` at `api/copytrade.ts:9916-9927` still fetches Spot candles and calls the old `decideRealTradeAction`. Thus the intended Binance software SL/TP basis was wired into the wrong exchange path, changing Real MEXC behavior and leaving Real Binance's software observer on Spot. This is a material scope/correctness mismatch, not an assertion that Spot or Demo code changed. `scripts/futures-real-price-basis-test.mjs` checks the new helper in isolation and finds a Mark fetch somewhere in the file, but does not assert the two synchronizer call-site boundaries. The 287 green tests therefore do not cover this wiring defect. No code was edited during this freeze audit.

## 3. OFFLINE GATES

Prior evidence: 287/287 focused tests, web/admin builds, both changed API bundles, disposable PostgreSQL structure clone and transactional concurrency/capacity checks passed. The 287-test matrix was rerun during this audit with the same count. TypeScript full diagnostic delta was baseline 52, candidate 52, new 0; targeted API was baseline 35, candidate 30, new 0. The TypeScript commands themselves remain red on pre-existing diagnostics. The newly discovered call-site defect is a **failed release-diff gate** despite those passes; a revised executable SHA and new exchange-specific call-site regression tests are necessary before requesting release approval.

## 4. MIGRATION PLAN

**Not executed.** Conditional order after a corrected candidate, backup and separate migration authorization: (1) `migrations/futures_reanalysis_claims.sql`; (2) `migrations/futures_real_portfolio_capacity.sql`. Each file has its own `BEGIN`/`COMMIT`; apply in that order and verify each transaction, never halfway through a failed statement. Production-schema-only clone evidence: before 88 public tables with claims/pending/capacity trigger absent; after 90 public tables with both claim and pending tables, request/complete RPCs, service-only RLS/grants, and capacity trigger present. New unique indexes arise from `futures_reanalysis_claims.trade_id` PK, `claim_token` UNIQUE, `futures_reanalysis_pending.trade_id` PK and `pending_version` UNIQUE. The existing `futures_execution_attempts_active_symbol` partial unique index remains required for duplicate-symbol exclusion. Capacity trigger uses a per-owner transaction advisory lock and preserves the five-slot limit. No Production rows were copied or rewritten in the clone.

Post-migration **read-only** verification queries, proposed only:

```sql
SELECT to_regclass('public.futures_reanalysis_claims') AS claims,
       to_regclass('public.futures_reanalysis_pending') AS pending,
       to_regprocedure('public.request_futures_reanalysis_run(uuid,bigint,text,text)') AS request_rpc,
       to_regprocedure('public.complete_futures_reanalysis_run(uuid,uuid,boolean)') AS complete_rpc;
SELECT conrelid::regclass, conname, contype FROM pg_constraint
 WHERE conrelid IN ('public.futures_reanalysis_claims'::regclass,
                   'public.futures_reanalysis_pending'::regclass) ORDER BY 1,2;
SELECT indexname FROM pg_indexes WHERE schemaname='public'
 AND tablename IN ('futures_reanalysis_claims','futures_reanalysis_pending','futures_execution_attempts') ORDER BY 1;
SELECT tgname, tgenabled FROM pg_trigger
 WHERE tgrelid='public.futures_execution_attempts'::regclass
 AND tgname='guard_futures_portfolio_capacity';
SELECT has_table_privilege('service_role','public.futures_reanalysis_pending','INSERT,UPDATE,DELETE') AS service_write,
       has_table_privilege('anon','public.futures_reanalysis_pending','SELECT') AS anon_read;
```

Required backup method and restore validation must be approved by the owner before any Production SQL; this task did not choose a live backup target or run one.

## 5. LIVE-ONLY GATES

Protection: only on a naturally eligible OPEN Real Binance position and with fresh bounded exchange-write authorization: read position/native SL/TP/lifecycle provenance; calculate and validate candidate, monetary and liquidation risk; submit replacement; read Binance again and confirm both legs; only then retire old orders; verify DB acknowledgment and subsequent reconciliation. Never create a trade merely for this check. Accounting: only after a naturally newly closed Real Binance lifecycle; reconcile entry/exit fills, both commissions including asset/direction, funding income, realized PnL and app ledger with duplicate suppression. The last read-only account aggregate at 09:25 UTC had zero suitable open and newly closed Real trades; no later live state is claimed. These gates remain unverified.

## 6. OWNER AUTHORIZATION REQUIRED

Release cannot be approved on the current SHA because of the call-site blocker. For a **future corrected executable SHA**, the owner must separately approve: A exact SHA; B backup method and tested restore; C migration window; D rollback method; E deployment window; F allowed live Binance write scope; G exact protection-replacement scope; H actual-trade accounting verification scope; I emergency stop conditions (uncertain exchange response, missing/changed native protection, unverified DB acknowledgment, capacity/provenance failure or unexpected position). Migration authorization, deploy authorization and live Binance write authorization are distinct; none is implied by this packaging request.

## 7. ROLLBACK PLAN

Before commit, a failed SQL statement rolls back its migration transaction; the clone verified injected failures leave the pre-migration shape. After migration commit, do **not** blindly drop claims/pending tables or clear unresolved `PREPARED`/`SUBMITTED`/`UNKNOWN` attempts: those are durable safety holds. Use the preapproved database backup and a tested restore plan only with position/order reconciliation and a maintenance window. For an executable deploy failure, stop new Real entries, inspect exchange-native protection and pending holds, and roll back runtime to the pre-deploy executable only after compatibility review; additive schema can remain while holds are reconciled. No rollback action was executed.

## 8. EXACT COMMANDS

These are **offline/pre-deploy commands only**, to run on a clean frozen checkout after the wiring defect is fixed and a new SHA is tested. The clone requires explicitly supplied local PostgreSQL binaries and an approved schema-only dump; it must not connect to an existing Production database. No command below migrates or deploys Production.

```powershell
git status --porcelain=v1 --untracked-files=all
git rev-parse HEAD
git diff --check 3d738da8d32ee61e552646c3d2db14715c1ca6ea HEAD
node --test --test-reporter=spec scripts/futures-reanalysis-test.mjs scripts/futures-real-execution-fault-test.mjs scripts/futures-correctness-test.mjs scripts/binance-final-funding-test.mjs scripts/futures-real-price-basis-test.mjs scripts/futures-liquidation-feasibility-test.mjs scripts/futures-pro-timeframes-test.mjs
$env:FUTURES_CLONE_PG_BIN = '<approved absolute local PostgreSQL bin directory>'
$env:FUTURES_CLONE_SCHEMA_FILE = '<approved absolute schema-only dump path>'
node scripts/futures-production-schema-clone-test.mjs
npx vite build --outDir '<isolated web output directory>'
npx vite build --config vite.admin.config.ts --outDir '<isolated admin output directory>'
node -e "const e=require('esbuild');e.build({entryPoints:['api/analyze.ts','api/copytrade.ts'],bundle:true,platform:'node',format:'esm',target:'node22',packages:'external',write:false,outdir:'discard',outExtension:{'.js':'.mjs'}}).then(()=>console.log('API_BUNDLE_PASS')).catch(x=>{console.error(x);process.exit(1)})"
$env:FUTURES_TSC_BASELINE_ROOT = '<clean absolute Production-SHA checkout>'
$env:FUTURES_TSC_BASELINE_SHA = '3d738da8d32ee61e552646c3d2db14715c1ca6ea'
node scripts/futures-typecheck-delta.mjs
```

The 287-test matrix alone is insufficient until both exchange synchronizer call sites are asserted by new regression tests. Placeholder paths must be replaced with verified local paths; no Production credential belongs in the clone environment.

## 9. SHA VERIFICATION

Executable `428c2c3bfb4edbf09cf1423f5aa408684341d65f`; parent `751819782fd31376a4745acdce657a5e92a11b42`; documentation-only successor `66a2f1dae44d8962ab6c694a95a53ca1e266c7f9`; Production comparison SHA `3d738da8d32ee61e552646c3d2db14715c1ca6ea`. Candidate worktree clean. Only two documentation files differ after the executable commit. This proves SHA identity, **not** correctness of the mistaken exchange wiring.

## 10. FINAL RELEASE STATUS

**BLOCKED — NOT READY FOR OWNER RELEASE AUTHORIZATION.** The requested literal status `READY FOR OWNER AUTHORIZATION` would conceal the newly verified cross-exchange call-site defect. Owner direction is needed for a separate, corrected candidate and exchange-specific regression tests; do not approve this frozen SHA for release. No merge, Production push, Production migration, deployment or Real Binance order was executed. No Spot, Demo or Shadow observer change was made during this audit.
