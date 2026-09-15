# Stablecoin — Capital/Capacity Model Correction, Deployed and Ready to Test in the App

## Metadata

- Date: 2026-09-16 (session continued)
- Task ID: (none assigned by user)
- Module: spot (Stablecoin Allocation architecture, `api/stablecoin-engine.ts` + `StablecoinEnginePanel` UI)
- Mode: **Live code fix + database migration + production deploy**, explicitly authorized after a clarifying question was resolved. No Real Trading touched.
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: `0e407f8`
- Ending commit: `de752d6`
- Deployed SHA (verified on VPS): `de752d6184a8ed200ee3f15bb107552f50a7a1cb`
- Production: VPS `13.140.149.56` (SSH port `22123`), database `signalverse_cutover2`

## A) Repository State Before Any Change

`git status`/`git log` confirmed a clean tree at `0e407f8` (matching the last known deployed SHA), plus the same long-standing, unrelated untracked scratch files noted in every prior report (`scripts/_tmp-*.mjs`, `output/`, `tmp/`) — untouched throughout.

## B) Implementation Review — a real conflict found and resolved before writing any code

Reading the actual shipped `StablecoinEnginePanel` (from the immediately preceding UI-verification task) already confirmed: **the Live Pair Monitor described in your item 2 already exists and is already live** — Pair, Trading Status, Fee, Fee Verification, Order Book/Liquidity, Eligibility, Selection state, Last-update timestamp, and a Refresh button are all already shipped (`src/app/App.tsx:3330-3367`, backed by `action=live-pair-monitor` in `api/stablecoin-engine.ts`). Items 2-5, 9-15 of your request were therefore **already satisfied by currently-deployed code** — nothing needed to change there, and nothing was changed there (per your own instruction not to touch what's already correct).

**Item 7's worked example, however, exposed a real, live discrepancy.** Reading `create_stablecoin_pair_allocation()` directly on production revealed it currently seeds **100% of Required Liquidity into ONE asset** (base asset starts at $0) — not the 50/50 split your message described. This came from `migrations/stablecoin_allocation_inventory_seed_fix.sql`, a migration whose own header still says "NOT YET APPLIED... per explicit instruction not to deploy this turn," but which had in fact been applied to production at some point without that comment ever being corrected. Its own committed test additions (`stablecoin-engine-test.mjs` TEST 33/34, plus two structural regex checks) explicitly asserted the 50/50 model as "the bug" and the single-asset model as "the fix."

This is a genuine conflict between two different, each internally self-consistent, capital models — not something resolvable by guessing. **I stopped and asked you directly** which model was authoritative. You confirmed: **50/50 seeding, with the per-trade notional corrected to Trading Capital / 2 (the Opportunity Unit)** — matching your message's own worked example exactly.

## C) Implementation

**`api/stablecoin-engine.ts`** (2 functions changed, both structurally identical fix):
- `computeAllocationLivePreview()`: added `const opportunityUnitUsd = tradingCapitalUsd / 2;`; both the order-book quote size and `notionalUsd` passed to `decideStablecoinTrade` now use `opportunityUnitUsd` instead of the full `tradingCapitalUsd`.
- `runAllocationCycle()`: identical fix — this is the function the automatic scheduler actually executes real (Demo) trades through.
- One stale comment corrected (previously claimed notional was fixed at the full Trading Capital — now accurately describes the Opportunity Unit).
- `simulateStablecoinTrade`, ROI calculation (`roiPct = realizedProfit / tradingCapitalUsd`), and `computeRequiredLiquidityUsd` (`tradingCapitalUsd × capacity`) were **not touched** — they already matched your spec (ROI on full Trading Capital; Required Liquidity = Capital × Capacity).

**`migrations/stablecoin_allocation_seeding_5050_restore.sql`** (new): restores `create_stablecoin_pair_allocation()` to the original 50/50 seeding (`v_required_liquidity / 2` into each asset), explicitly documented as superseding the erroneously-deployed single-asset migration. Purely additive (`CREATE OR REPLACE FUNCTION`), touches zero existing rows — only changes future allocation-creation behavior.

**`scripts/stablecoin-engine-test.mjs`**: TEST 28 (structural, `runAllocationCycle`) and the live-preview structural check now assert `opportunityUnitUsd = tradingCapitalUsd / 2` and its use in both the notional and the order-book quote. TEST 33/34 rewritten with the real worked numbers for the corrected model (Capacity=1, $25 Trading Capital → $12.50 Opportunity Unit, $12.50 seeded per side, exactly sufficient; Capacity=3, $2,000 Trading Capital → $1,000 Opportunity Unit, $3,000 seeded per side → exactly 3 consecutive same-direction trades, matching Capacity).

**Verified worked example (your item 7, now true end-to-end):** Trading Capital=$5,000, Capacity=1 → Required Liquidity=$5,000 → seeded $2,500 USDT / $2,500 USDC. A USDT→USDC opportunity trades exactly the $2,500 Opportunity Unit (never the full $5,000) → balances move to ≈USDT=$0 / USDC≈$5,000. A subsequent USDC→USDT opportunity trades the same $2,500 unit → balances return to ≈USDC=$2,500 / USDT=$2,500. Capacity=1 requires no reserve and is never rejected (`opportunityCapacity >= 1` is the only check, unchanged).

## No Threshold / Risk Layer / New Decision Engine Introduced

Confirmed structurally (unchanged from every prior audit): `stablecoin-engine.ts` still has zero references to `stablecoin_pair_snapshots`, `RiskTier`, or `risk_tier`. This fix touches only the Capital/Capacity notional-sizing math inside the already-existing, already-approved Central Decision Engine — no new engine, no new threshold, no Historical Collector wiring of any kind.

## D) TypeScript

```
npx tsc --noEmit --strict --target es2020 --module esnext --moduleResolution node --esModuleInterop --skipLibCheck api/stablecoin-engine.ts
```
**PASS** (zero errors).

## E) Build

`npm run build` (web + admin) — **PASS**, both bundles produced successfully.

## F) Tests

`node --test scripts/stablecoin-engine-test.mjs` — **PASS**, all 44 test blocks green, including the rewritten TEST 28/33/34 validating the corrected model with real numeric traces. `node --test scripts/stablecoin-market-data-collector-test.mjs` (unrelated file, sanity re-run) — **PASS**, unaffected.

## G) E2E / Route Tests

No committed E2E or route-level test exists for this specific flow (only untracked, non-committed scratch scripts from earlier ad-hoc sessions, e.g. `scripts/_tmp-vps-e2e.mjs`, which are not part of the official suite and were not run/relied upon here). This is stated plainly rather than fabricating an E2E result.

## H) `git diff --check`

Clean — zero whitespace errors. Exactly 3 files changed: `api/stablecoin-engine.ts`, `scripts/stablecoin-engine-test.mjs`, plus the one new migration file. No file outside this scope was touched.

## I) Real Trading / Binance Order Path

`grep -n "action === 'real-execute'"` confirms the handler is unchanged, still returns HTTP 501 with the same message. No new UI element, no new endpoint, no new code path to Real execution was created anywhere in this change.

## J) Out-of-Scope Check

`git diff --stat` shows exactly 2 modified files + 1 new file — nothing else. The pre-existing untracked scratch files were left untouched, as in every prior task.

---

## Database Migration — Applied to Production

1. **Backup**: `npm run backup` — SUCCESS, 197,526 rows across 65 tables, `backups/2026-09-15T17-06-11`.
2. **Pre-migration state confirmed**: the live function was genuinely the single-asset-seeding version (not assumed).
3. **Migration executed**: `migrations/stablecoin_allocation_seeding_5050_restore.sql` via `psql -v ON_ERROR_STOP=1 --single-transaction` — `CREATE FUNCTION` / `REVOKE` / `GRANT`, zero errors.
4. **Post-migration verified**: `pg_get_functiondef` confirms the restored 50/50 (`v_required_liquidity / 2`) seeding is now live.
5. **Other tables untouched**: `stablecoin_pair_allocations`=15, `stablecoin_demo_trades`=1,231 — unchanged before/after. (`stablecoin_pair_snapshots` grew naturally from the still-running, unaffected Historical Collector: 558→570.)
6. **Existing allocation rows**: deliberately **not** retroactively re-seeded — this migration only changes future allocation-creation behavior, matching your own instruction not to alter existing data.

---

## Deploy

- Committed (`de752d6`) and pushed to `main`.
- CI/CD (GitHub Actions → deploy-receiver) built and delivered automatically — no manual VPS intervention needed for the code deploy itself.
- Verified deployed SHA on the VPS via `readlink -f /opt/signalverse/app` → `de752d6184a8ed200ee3f15bb107552f50a7a1cb`, matching the pushed commit exactly.
- Post-deploy health: `signalverse.service` active, `healthz` → `200`.
- Confirmed the earlier phase's `stablecoin-market-data-collector` route registration (a VPS-persistent shared file edit, not part of git) survived this fresh deploy, since it lives in `/opt/signalverse/shared/runtime/server.mjs`, copied unchanged into every release.
- All 3 relevant schedulers confirmed still active and unaffected: `signalverse-fast-jobs.timer`, `signalverse-alerts.timer`, `signalverse-stablecoin-collector.timer`.
- Real Trading still `501`, confirmed on the freshly-deployed bundle.

## Observation (pre-existing, unrelated to this fix — not touched)

The 3 currently-`ACTIVE` allocations (`USDCUSDT`, `TUSDUSDT`, `FDUSDUSDC`) belong to Demo *setups* that are themselves `STOPPED` at the setup level (`status='STOPPED'` on `stablecoin_demo_setups`, last ticked 2026-09-14 ~08:10) — an existing inconsistency between setup-level and allocation-level status that predates this session and was not created or touched by this task. Practically: those 3 allocations will not receive an automatic cron tick until their parent setup is resumed. **For your own testing, the cleanest path is to create a brand-new Allocation from the UI** (`Live Pair Monitor → Select → START ALLOCATION`) — that creates its own fresh, `RUNNING` setup and will tick automatically on the existing 5-minute cadence, now under the corrected 50/50 + Opportunity-Unit model.

---

## Answers to your 8 closing questions

1. **آیا کد ساخته شد؟** بله — دقیقاً ۲ تابع در `api/stablecoin-engine.ts` اصلاح شد (Notional)، به‌علاوهٔ یک Migration جدید (Seeding).
2. **آیا تست‌ها Run شدند؟** بله — کاملِ `stablecoin-engine-test.mjs` (۴۴ بلوک، همه PASS) و `stablecoin-market-data-collector-test.mjs` (sanity، PASS).
3. **آیا Build موفق بود؟** بله — Web + Admin هردو موفق.
4. **آیا Commit/Push انجام شد؟** بله — کامیت `de752d6`، Push به `main`.
5. **آیا Deploy موفق بود؟** بله — CI/CD خودکار، تاییدشده رویِ خودِ VPS.
6. **Commit SHA و Deployed SHA چیست؟** هردو یکسان: `de752d6184a8ed200ee3f15bb107552f50a7a1cb`.
7. **آیا الان می‌توانید داخلِ Telegram Mini App تست کنید؟** بله.
8. **دقیقاً از کدام مسیر UI شروع کنم؟** از داخلِ اپِ تلگرام: صفحه‌یِ اصلی ← دکمه‌یِ Stablecoin (فقط اگر ادمین/دارایِ دسترسیِ ویژه باشید) ← بخشِ «پایشِ زنده‌یِ جفت‌ها» (Live Pair Monitor) ← رویِ یک جفتِ Eligible «انتخاب» را بزنید ← Trading Capital و Opportunity Capacity را وارد کنید (پیشنهاد برایِ تستِ همین Worked Example: Capital=$5000، Capacity=1) ← «شروعِ اختصاصِ سرمایه» (START ALLOCATION) را بزنید. این یک Setup و Allocation کاملاً تازه و RUNNING می‌سازد که با Cadence ۵دقیقه‌ایِ موجود خودکار Tick می‌خورد و اکنون زیرِ مدلِ صحیح (۵۰/۵۰ + Notional=Capital/۲) عمل می‌کند.

## نتیجه‌یِ نهایی

```
CODE: BUILT AND FIXED
TESTS: PASS (44/44 stablecoin-engine, unaffected collector suite also PASS)
BUILD: PASS
COMMIT: de752d6
PUSH: DONE
DEPLOY: SUCCESS (verified SHA matches on VPS)
DATABASE MIGRATION: APPLIED (backup-first, verified, additive only)
REAL TRADING: STILL 501, UNCHANGED
DEMO: FUNCTIONAL, NOW CORRECTLY MODELED
COLLECTOR / SCHEDULER: UNCHANGED, UNAFFECTED, STILL HEALTHY
READY FOR YOUR TELEGRAM MINI APP TEST: YES
```
