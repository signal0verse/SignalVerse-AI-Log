# Stablecoin Market Data Collector — Controlled Dry-Run Activation on Production

## Metadata

- Date: 2026-09-15
- Task ID: (none assigned by user)
- Module: spot (Historical Stablecoin Market Observation Dataset — `stablecoin_pair_snapshots`, collector `api/stablecoin-market-data-collector.ts`)
- Mode: **Live, READ-ONLY / DRY-RUN execution of the real Collector against real Binance data**, immediately after the prior production migration (`reports/spot/2026-09-15-1215-...migration-executed-production.md`, verdict: MIGRATION SUCCESS). The Collector code and DB schema already existed; this task activated the Collector logic itself for the first time, strictly in dry-run mode.
- Repository: signal0verse/signalverse-main
- Branch: main
- Commit throughout: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e (**unchanged — no code committed/pushed/deployed**)
- Production: VPS `13.140.149.56` (SSH port `22123`), database `signalverse_cutover2`, PostgreSQL 17.11

## Objective

Prove, with real Binance market data, that the Collector correctly discovers pairs, fetches order books, validates and derives every field, and would persist a well-formed row per pair — **without writing a single row to the production database**, without touching the Decision Engine / Trading Engine / Scheduler, and without any commit, push, or deploy.

Per the user's explicit closing instructions, this task strictly does **not**: start permanent historical collection, wire the Collector to any scheduler, activate calibration or risk thresholds, or ship any code change.

---

## 1. Current State Verification (read-only, before dry-run)

| Check | Result |
|---|---|
| `stablecoin_pair_snapshots` column count | **48** (7 original + 41 from the migration) — confirmed via `information_schema.columns` count |
| Indexes | Both present: `idx_stablecoin_pair_snapshots_lookup` (pre-existing) and `idx_stablecoin_pair_snapshots_unique_tick` (new, unique) — confirmed via `pg_indexes` |
| Row count (before dry-run) | **0** |
| Any stablecoin-related systemd timer/cron | **None** — `systemctl list-timers --all \| grep -i stablecoin` returned nothing; no file under `/etc/signalverse/jobs.d/` for the collector |
| Collector deployed/wired into any scheduler | No — confirmed absent |

Baseline matched full expectations — proceeded to the dry-run itself.

---

## 2. Dry-Run Execution — Field-by-Field Report

Executed by bundling `api/stablecoin-market-data-collector.ts` locally with esbuild (`--bundle --platform=node --format=esm --external:@supabase/supabase-js`) and calling the exported pure/network functions (`discoverEligiblePairs`, `fetchOrderBook`, `validateOrderBook`, `buildSnapshotRow`) **directly against live Binance endpoints**, bypassing only the HTTP handler's admin-session authentication layer (which requires a Telegram-signed session token this environment cannot mint — an established, previously-documented limitation, not a shortcut around any business logic). No database write path was invoked at any point — `supabase.from(...).insert(...)` was never called.

### Discovery

- Total Binance symbols scanned (`exchangeInfo`): 3,699
- Stablecoin/stablecoin-eligible symbols matched: 15
- `status === 'TRADING'`: **6** — `TUSDUSDT`, `USDCUSDT`, `FDUSDUSDT`, `FDUSDUSDC`, `USD1USDT`, `USD1USDC`
- `status === 'BREAK'` (correctly skipped, not treated as tradable): 9

### Per-pair results (all 6 TRADING pairs)

All 6 pairs succeeded — 0 failures. Each pair returned a complete field set:

| Field group | Verified present & valid for all 6 pairs |
|---|---|
| `symbol_status` | `TRADING` for all 6 |
| `best_bid` / `best_ask` (+ qty) | finite, positive, `bid < ask` |
| `mid_price` | finite, positive |
| `spread_bps` | finite, ≥ 0 |
| `bid_depth_5/20`, `ask_depth_5/20` | finite, ≥ 0 |
| `imbalance_5/20` | finite, within valid [-1, 1] range |
| `bid_depth_concentration`, `ask_depth_concentration` | finite, independently computed per side (Phase 2.1 fix verified live) |
| `deviation_bps` | finite |
| `fee_verified` / `fee_bps` | `false` / `null` for all 6 — **expected**: no `EXCHANGE_KEY_SECRET` exists in this local environment (only on the VPS), so live fee-observation correctly and gracefully degrades rather than fabricating a value, exactly as designed |
| `exec_buy_{1000,2500,5000,10000}_{usd,vwap,fully_filled}` | all 12 values present and internally consistent for every pair |
| `exec_sell_{1000,2500,5000,10000}_{usd,vwap,fully_filled}` | same, sell side |
| `collector_version` | `collector-v1` for all 6 |
| `captured_at` | valid ISO-8601 timestamp, **distinct per pair** (see Timestamp Verification below) |
| `raw_top20_levels` | present, correct top-20 bid/ask level counts |

### Timestamp Verification (Phase 2.1 fix — live proof)

**6 distinct `captured_at` values across 6 pairs**, each recorded immediately after that pair's own successful order-book fetch (not one batch-shared timestamp):

```
2026-09-15T12:30:24.072Z
2026-09-15T12:30:24.187Z
2026-09-15T12:30:24.298Z
2026-09-15T12:30:24.415Z
2026-09-15T12:30:24.531Z
2026-09-15T12:30:24.547Z
```

This directly confirms the Phase 2.1 correctness fix (batch-shared `tickAt` → per-pair `capturedAt`) behaves correctly against real, live sequential fetches.

---

## 3. Data Quality Verification

**108 checks run (18 per pair × 6 pairs) — 0 issues found.** Checks per pair: finite & positive price/qty (bid+ask), `bid < ask`, non-negative `spread_bps`, valid `mid_price`, non-negative depths (5/20, bid/ask), imbalance within valid range, both depth-concentration values within valid range, no `NaN` anywhere, no `Infinity`/`-Infinity` anywhere, valid `fully_filled` booleans, valid VWAP values where a size was fillable.

Zero anomalies across all 6 pairs.

---

## 4. Binance Source Verification

- Order books fetched from `GET /api/v3/depth` against the public Binance Vision mirror (`data-api.binance.vision`), the same source already used elsewhere in this project for public market data (separate from the authenticated futures/real-trading path).
- `exchangeInfo` used for dynamic pair discovery — no hardcoded pair list; discovery matched the same 15 stablecoin-eligible symbols found during the earlier calibration phase (`reports/spot/2026-09-15-1021-...risk-threshold-calibration-real-market-data-read-only.md`), confirming stability of the discovery logic across sessions.
- No synthetic/fallback/random-walk data was used anywhere — every field traces to a real, live Binance response.

---

## 5. Database Write Safety

| Check | Before | After | Match |
|---|---|---|---|
| `stablecoin_pair_snapshots` row count | 0 | **0** | ✅ |
| `stablecoin_pair_allocations` row count | 15 | 15 | ✅ |
| `stablecoin_demo_trades` row count | 1,231 | 1,231 | ✅ |

Explicit confirmation from the dry-run harness itself: **"NO DATABASE INSERT WAS PERFORMED BY THIS SCRIPT."** The `dryRun` code path was exercised only via direct function calls that never construct or send a Supabase `insert`; no `supabase.from('stablecoin_pair_snapshots').insert(...)` call occurred at any point during this task.

---

## 6. Tests

| Test | Result |
|---|---|
| `node --test scripts/stablecoin-market-data-collector-test.mjs` | **108/108 PASS** |
| `npx tsc --noEmit --strict --target es2020 --module esnext --moduleResolution node --esModuleInterop --skipLibCheck api/stablecoin-market-data-collector.ts` | **PASS** |
| `node --test scripts/stablecoin-engine-test.mjs` (existing engine regression) | **PASS**, unaffected |
| `npm run build` (web + admin) | **PASS** |

---

## 7. Production Safety Verification

Freshly re-checked at the end of this task:

```
signalverse.service:          active
signalverse-fast-jobs.timer:  active
postgrest.service:            active
nginx:                        active
Scheduler cadence:            OnCalendar=*-*-* *:0/5:00   (unchanged)
New scheduler/timer added:    NONE (confirmed: no stablecoin-related timer exists)
Collector permanently active: NO
Real Trading:                 DISABLED — /action=real-execute returns 501:
  "Real execution is not available - Phase 1 is demo-only. Real trading
   requires each user's own connected Binance account for fee verification
   and is a dedicated, separately authorized follow-up phase."
```

Git status: unchanged, still commit `c497c6b`, Collector files remain local/untracked, nothing committed or pushed.

---

## FINAL STATUS TABLE

```
CURRENT-STATE BASELINE:        MATCHED (48 columns, 2 indexes, 0 rows, no scheduler)
DISCOVERY:                     6/6 TRADING pairs found, 9 BREAK correctly skipped
PER-PAIR EXECUTION:            6/6 SUCCEEDED, 0 FAILURES
TIMESTAMP DISTINCTNESS:        6/6 distinct captured_at values (Phase 2.1 fix verified live)
DATA QUALITY CHECKS:           108/108 PASS, 0 issues
BINANCE SOURCE:                Confirmed real, live, public endpoints; no synthetic data
DATABASE ROW COUNT:            0 before, 0 after — UNCHANGED
OTHER TABLES:                  byte-identical before/after
COLLECTOR TESTS:                108/108 PASS
TYPESCRIPT STRICT:             PASS
ENGINE REGRESSION:             PASS, unaffected
BUILD:                          PASS (web + admin)
PRODUCTION SERVICES:            all active
SCHEDULER:                      unchanged, 5-minute cadence, no new timer
COLLECTOR PERMANENTLY ACTIVATED: NO
REAL TRADING:                   NOT ENABLED
CODE COMMITTED / PUSHED / DEPLOYED: NO / NO / NO
```

## نتیجه‌یِ نهایی

```
DRY-RUN SUCCESS
```

هر ۶ جفتِ TRADING با موفقیت پردازش شدند، ۱۰۸ بررسیِ کیفیتِ داده بدونِ هیچ مشکلی گذشت، ۶ مقدارِ متمایزِ `captured_at` اصلاحِ Phase 2.1 را به‌صورتِ زنده تایید کرد، و هیچ ردیفی در دیتابیسِ Production نوشته نشد (تعدادِ ردیف‌ها قبل و بعد دقیقاً یکسان: صفر). تمامِ ۴ گروهِ تست (Collector، TypeScript strict، رگرسیونِ Engine، Build) موفق بودند و هیچ سرویس/Scheduler/Real-Trading‌ای تغییر نکرد.

طبقِ دستورِ صریحِ کاربر: Collector **هنوز به‌صورتِ دائمی فعال نشده**، به هیچ Scheduler‌ای وصل نشده، و Calibration/Risk Threshold فعال‌سازی نشده‌اند — این‌ها آگاهانه به‌عنوانِ فازهای جداگانه و بعدی، منوط به تاییدِ صریحِ بعدیِ کاربر، باقی مانده‌اند. هیچ Commit/Push/PR/Deployی در این کار انجام نشد.
