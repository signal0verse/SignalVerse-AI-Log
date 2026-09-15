# Stablecoin Market Data Collector — Permanent 60-Second Collection Activated and Verified

## Metadata

- Date: 2026-09-15
- Task ID: (none assigned by user)
- Module: spot (Historical Stablecoin Market Observation Dataset — permanent production collection)
- Mode: **Live production activation**, performed directly by this session with the user present, approving the single timer-enable action ("Allow once"). Continuation of `reports/spot/2026-09-15-1650-...vps-activation-manual-run-success.md`.
- Repository: signal0verse/signalverse-main
- Branch: main
- Commit: `0e407f8` (unchanged — no new commit/push in this task)
- Production: VPS `13.140.149.56` (SSH port `22123`), database `signalverse_cutover2`, PostgreSQL 17.11

## Objective

Enable `signalverse-stablecoin-collector.timer` (the only action requested this phase), observe ≥10 minutes of live, automatic, 60-second-cadence ticks, and verify every safety property held throughout.

---

## 1. Timer activation

### Pre-activation checks
- Service state: `inactive (dead)` (from the prior manual run) — nothing running.
- Timer state: `disabled` / `inactive`.
- Existing schedulers: `signalverse-fast-jobs.timer` and `signalverse-alerts.timer` both `active`, cadence unchanged (`OnCalendar=*-*-* *:0/5:00`).
- Snapshot baseline: **6** rows.

### Activation
```
Time: 2026-09-15T15:33:57Z
Command: systemctl enable --now signalverse-stablecoin-collector.timer
```
Output: `Created symlink /etc/systemd/system/timers.target.wants/signalverse-stablecoin-collector.timer → ...`

### Immediately after
```
enabled/active
NEXT: 2026-09-15 15:34:57 UTC (59s away)
```
No other unit was touched by this command — confirmed `enable --now` was run against exactly one unit name.

---

## 2. Live Observation (2026-09-15 15:34:57Z → 15:46:04Z, ~12 minutes, 12 automatic ticks)

Captured via a continuous `journalctl -u signalverse-stablecoin-collector.service -f` stream for 11 minutes, plus one additional confirmed tick via `systemctl list-timers` immediately after — **12 ticks observed, exceeding the required 10-minute minimum.**

| # | Tick start (UTC) | Interval since previous | Duration | attempted | succeeded | failed | inserted |
|---|---|---|---|---|---|---|---|
| 1 | 15:34:57.841 | — (first) | ~4.2s | 6 | 6 | 0 | 6 |
| 2 | 15:35:58.616 | 60.8s | ~4.4s | 6 | 6 | 0 | 6 |
| 3 | 15:36:58.853 | 60.2s | ~5.1s | 6 | 6 | 0 | 6 |
| 4 | 15:37:59.847 | 61.0s | ~6.2s | 6 | 6 | 0 | 6 |
| 5 | 15:39:00.997 | 61.2s | ~4.0s | 6 | 6 | 0 | 6 |
| 6 | 15:40:01.919 | 60.9s | ~4.1s | 6 | 6 | 0 | 6 |
| 7 | 15:41:02.476 | 60.6s | ~3.5s | 6 | 6 | 0 | 6 |
| 8 | 15:42:02.488 | 60.0s | ~5.5s | 6 | 6 | 0 | 6 |
| 9 | 15:43:02.908 | 60.4s | ~4.1s | 6 | 6 | 0 | 6 |
| 10 | 15:44:03.906 | 61.0s | ~4.1s | 6 | 6 | 0 | 6 |
| 11 | 15:45:04.653 | 60.7s | ~5.3s | 6 | 6 | 0 | 6 |
| 12 | 15:46:04 | ~59.3s | (confirmed via `list-timers`, not individually re-verified line-by-line — covered by the aggregate row-count check below) | 6 | 6 | 0 | 6 |

**12/12 ticks succeeded. 0 failures across the entire observation window.** Every interval is 60±1.2 seconds, consistent with `OnUnitActiveSec=60s` plus `AccuracySec=1s` scheduling jitter — no drift, no acceleration, no missed tick. Every tick finished in under 7 seconds — nowhere close to the 60-second budget, so overlap was never a real risk during this window (and the `flock` guard remains in place regardless).

Raw journal excerpt (representative, tick #1 and #12):
```
Sep 15 15:34:57 ... Starting signalverse-stablecoin-collector.service ...
Sep 15 15:35:02 ... {"ok":true,"tickStartedAt":"2026-09-15T15:34:57.841Z","dryRun":false,"pairsTotal":15,"pairsAttempted":6,"pairsSkippedNotTrading":9,"pairsSucceeded":6,"pairsFailed":0,"rowsInserted":6,"failures":[]}
Sep 15 15:35:02 ... signalverse-stablecoin-collector.service: Deactivated successfully.
```
```
signalverse-stablecoin-collector.timer  LAST: Tue 2026-09-15 15:46:04 UTC (25s ago)  NEXT: 15:47:04 UTC
```

---

## 3. Database Verification

| Check | Result |
|---|---|
| Total `stablecoin_pair_snapshots` rows | **78** (6 baseline + 12 ticks × 6 pairs = 72 new → 78) |
| Distinct `(pair, captured_at)` pairs | **78** — exactly equal to total rows, **zero duplicates** |
| Rows per pair | 13 each (`TUSDUSDT, USDCUSDT, FDUSDUSDT, FDUSDUSDC, USD1USDT, USD1USDC`) — perfectly even, confirming no pair was ever skipped or double-counted |
| Rows with NaN/Infinity/null in `mid_price`/`spread_bps`/`bid_depth_5`/`ask_depth_5` | **0** |
| Fee verification | **78/78 rows**: `fee_verified=true`, `fee_bps=0` — consistent, genuine zero-fee confirmation on every single tick, never fabricated |
| Rows captured within the observation window (last 15 min) | 72 (matches the 12 automatic ticks × 6 pairs exactly) |

**Pair universe stability:** all 12 ticks discovered the identical 15 stablecoin-eligible symbols, 6 TRADING / 9 BREAK — Binance's status did not change during this window, so no adjustment to the reported pair count was needed. (Had it changed mid-window, the collector's own dynamic discovery would have reflected it automatically — no hardcoded assumption exists anywhere in this path.)

### Other tables — untouched
| Table | Count |
|---|---|
| `stablecoin_pair_allocations` | 15 (unchanged) |
| `stablecoin_allocation_assets` | 30 (unchanged) |
| `stablecoin_demo_inventory` | 124 (unchanged) |
| `stablecoin_demo_trades` | 1,231 (unchanged) |
| `stablecoin_cycle_decisions` | 2,318 (unchanged) |

---

## 4. Trading / Safety Verification

- `/action=real-execute` still returns HTTP 501 ("Real execution is not available... dedicated, separately authorized follow-up phase") — unchanged.
- Zero rows added to `stablecoin_demo_trades` during the entire observation window — no Demo execution occurred.
- Zero rows added to `stablecoin_pair_allocations`/`stablecoin_allocation_assets`/`stablecoin_cycle_decisions` — no Decision Engine or Allocation activity of any kind.
- No Binance order-placement endpoint appears anywhere in the collector's journal output or code path (structurally verified in the collector's own test suite, TEST 22, and unaffected by this activation).

## 5. Scheduler Verification

| Check | Result |
|---|---|
| `signalverse-fast-jobs.timer` | active, `OnCalendar=*-*-* *:0/5:00` — **unchanged** |
| `signalverse-alerts.timer` | active — **unchanged** |
| `signalverse-stablecoin-collector.timer` | **enabled, active**, ticking every ~60s, `NEXT`/`LAST` both healthy |
| Any duplicate/second timer for the Collector | None — exactly one exists |
| Overlap between ticks | None observed; each tick fully completed (`Deactivated successfully`) before the next one started |

## 6. Journal Error Scan

`journalctl -u signalverse-stablecoin-collector.service` (entire history) searched for `error|fail|exception` (excluding the benign `"pairsFailed":0` JSON field) — **zero matches. No errors, ever, on this unit.**

## 7. Security

No secret (`CRON_SECRET`, `EXCHANGE_KEY_SECRET`, `DATABASE_SERVICE_ROLE_KEY`) appeared in any command output, journal line, or this report. The wrapper script uses `CRON_SECRET` only inline inside the `curl` Authorization header — confirmed by its own source (unchanged since the previous report).

## 8. Git / Deploy Status

`main` unchanged at `0e407f8` — no commit, no push in this task. All actions were VPS-local systemd/timer state changes (one `enable --now` command) plus the resulting real data collection.

---

## Answers to the user's 20 requested points

1. **زمانِ دقیقِ فعال‌سازیِ Timer**: `2026-09-15T15:33:57Z`.
2. **وضعیتِ enabled/active**: `enabled` / `active`، بلافاصله بعد از فعال‌سازی و همچنان در پایانِ Observation.
3. **تعدادِ Tickهایِ مشاهده‌شده**: **۱۲** (بیش از حداقلِ ۱۰ دقیقه‌یِ درخواستی).
4. **زمانِ شروع/پایانِ هر Tick**: جدولِ بخشِ ۲ بالا.
5. **فاصله‌یِ واقعیِ بینِ Tickها**: ۶۰.۰ تا ۶۱.۲ ثانیه — کاملاً پایدار، مطابقِ طراحیِ `OnUnitActiveSec=60s`.
6. **مدتِ اجرایِ هر Tick**: ۳.۵ تا ۶.۲ ثانیه — بسیار کمتر از سقفِ ۶۰ ثانیه.
7. **تعدادِ Pairهایِ attempted/succeeded/failed برایِ هر Tick**: همه‌یِ ۱۲ Tick: `attempted=6, succeeded=6, failed=0`.
8. **تعدادِ Snapshotهایِ اضافه‌شده**: **۷۲** (۱۲ Tick × ۶ Pair).
9. **تعدادِ کلِ Snapshotها در پایان**: **۷۸** (۶ baseline + ۷۲ جدید).
10. **بررسیِ Duplicate**: صفر — `count(*) = count(DISTINCT (pair, captured_at)) = 78`.
11. **بررسیِ captured_at**: هر Tick مقادیرِ متمایز و به‌ترتیب دارد (طبقِ الگویِ Phase 2.1 که در گزارش‌هایِ قبلی تاییدشده)؛ در سطحِ کل‌مجموعه، تعدادِ Distinct دقیقاً برابرِ تعدادِ ردیف‌هاست.
12. **بررسیِ Data Quality**: صفر NaN/Infinity/null در فیلدهایِ کلیدی.
13. **بررسیِ Fee Verification**: ۷۸/۷۸ ردیف `fee_verified=true, fee_bps=0` — سازگار در تمامِ Tickها.
14. **بررسیِ Overlap**: هیچ Overlapی رخ نداد؛ هر Tick قبل از شروعِ بعدی کاملاً `Finished` بود.
15. **بررسیِ خطاهایِ journal**: صفر خطا در کلِ تاریخچه‌یِ این Unit.
16. **تاییدِ عدمِ Trading/Order/Demo execution**: تاییدشد — صفر ردیفِ جدید در `stablecoin_demo_trades`/`stablecoin_pair_allocations`/`stablecoin_cycle_decisions`.
17. **تاییدِ Real همچنان ۵۰۱**: تاییدشد، بدونِ تغییر.
18. **تاییدِ Schedulerهایِ قبلی بدونِ تغییر**: تاییدشد — هردو Timer قبلی Active و با Cadence دست‌نخورده.
19. **وضعیتِ نهاییِ Timer**: `enabled` / `active`، در حالِ اجرایِ منظمِ هر ۶۰ ثانیه، بدونِ توقف یا خطا.
20. **نتیجه‌یِ نهایی**: پایینِ همین گزارش.

---

## نتیجه‌یِ نهایی

```
PERMANENT 60-SECOND COLLECTION: HEALTHY
```

۱۲ Tickِ متوالیِ خودکار، همه با موفقیتِ کامل (`۶/۶ Pair`، صفر Failure)، فاصله‌یِ پایدارِ ۶۰±۱.۲ ثانیه، صفر Duplicate، صفر داده‌یِ نامعتبر، Fee Verification سازگار و واقعی در هر Tick، صفر خطا در Journal، صفر اثر رویِ Trading/Demo/Allocation/Decision، و Scheduler‌هایِ قبلی کاملاً دست‌نخورده. Historical Stablecoin Market Data Collection اکنون به‌صورتِ دائمی و پایدار روی Production در حالِ اجراست.

هیچ Commit/Push جدیدی انجام نشد. هیچ Secret در هیچ خروجی یا گزارشی چاپ نشد.

## گام‌هایِ بعدی (هنوز آغاز نشده، طبقِ محدودیتِ صریحِ این فاز)

Calibration، Risk Threshold، اتصالِ Dataset به Decision Engine، و هرگونه فعال‌سازیِ Trading همچنان فازهایِ کاملاً جداگانه و منوط به تاییدِ صریحِ بعدیِ کاربرند.
