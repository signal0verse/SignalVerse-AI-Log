# Stablecoin Market Data Collector — VPS Activation Executed, Manual Run Successful (Timer Still Disabled)

## Metadata

- Date: 2026-09-15
- Task ID: (none assigned by user)
- Module: spot (Historical Stablecoin Market Observation Dataset — production scheduler wiring)
- Mode: **Live production execution**, performed directly by this session with the user present via Claude Code's own VPS connection, approving each write/restart individually ("Allow once" per action, no blanket approval used). Continuation of `reports/spot/2026-09-15-1630-...vps-activation-runbook.md`.
- Repository: signal0verse/signalverse-main
- Branch: main
- Commit: `0e407f8` (unchanged — no new commit/push in this task)
- Production: VPS `13.140.149.56` (SSH port `22123`), database `signalverse_cutover2`, PostgreSQL 17.11

## Objective

Execute the previously-prepared runbook exactly: register the collector's route, create the independent job (gate + wrapper + service + timer), run **exactly one** manual tick, verify it read-only, and leave the recurring timer disabled pending a separate, explicit go-ahead.

---

## Step-by-Step Result

### 1-2. Backup + confirm route absent
Both `server.mjs` copies backed up with timestamps:
- `/opt/signalverse/shared/runtime/server.mjs.bak-20260915-152323`
- `/opt/signalverse/app/.runtime/server.mjs.bak-20260915-152323`

Confirmed the route was genuinely absent beforehand (`grep -c` → `0` on both copies) — no pre-existing edit was overwritten.

### 3-4. Route added, both files syntax-checked
`'stablecoin-market-data-collector',` inserted at line 20, immediately after `'stablecoin-engine',` (line 19), in both the shared canonical file and the currently-deployed release's copy. `node --check` passed on both **before** any restart.

### 5-6. Service restarted, health confirmed
```
signalverse.service: active
healthz: HTTP 200
```

### 7. Job gate created
`/etc/signalverse/jobs.d/stablecoin-market-data-collector.enabled` — empty, `-rw-r--r--`, root:root.

### 8. Wrapper script created
`/usr/local/libexec/signalverse-stablecoin-collector`, `0755`, `bash -n` passed. Verified by reading it back: gate-checks, fails closed if `CRON_SECRET` is unset, uses `flock -n` on `/run/lock/signalverse-stablecoin-collector.lock` for non-overlap, calls `POST /api/stablecoin-market-data-collector?action=collect` with `Host: signal.easybitpay.com` and `Authorization: Bearer ${CRON_SECRET}`, `--max-time 55`. The secret is used only inline inside the `curl` header — never echoed anywhere in the script.

### 9-10. Service and timer units created
Both unit files created exactly matching the runbook (`Type=oneshot`, `User=signalverse`, `Group=signalverse`, `EnvironmentFile=-/etc/signalverse/signalverse.env`, `TimeoutStartSec=58`, full hardening flag set; timer with `OnActiveSec=60s`, `OnUnitActiveSec=60s`, `AccuracySec=1s`). Verified by reading both back via `systemctl cat`.

### 11. `systemctl daemon-reload` run
Confirmed immediately after: `signalverse-stablecoin-collector.timer` → `disabled` / `inactive`.

### 12. Timer NOT enabled or started
Confirmed — neither `systemctl enable` nor `systemctl start` was ever run against the `.timer` unit, at any point in this task.

### 13-14. Manual run
Pre-run row count: `0`. Ran `systemctl start signalverse-stablecoin-collector.service` exactly once:

```json
{"ok":true,"tickStartedAt":"2026-09-15T15:26:39.328Z","dryRun":false,"pairsTotal":15,"pairsAttempted":6,"pairsSkippedNotTrading":9,"pairsSucceeded":6,"pairsFailed":0,"rowsInserted":6,"failures":[]}
```

`systemctl status` confirmed: `Deactivated successfully`, `Finished`. Total wall-clock time from `Starting...` to `Finished`: **5 seconds** (15:26:39 → 15:26:44).

---

## Read-Only Verification (Step 15)

### Timer status
```
disabled
inactive
```
Confirmed still off.

### Snapshot row count
**6** (from 0) — exactly one row per currently-TRADING pair, zero extra, zero missing.

### Per-pair, per-timestamp detail
| Pair | captured_at (UTC) |
|---|---|
| TUSDUSDT | 15:26:41.357 |
| USDCUSDT | 15:26:41.955 |
| FDUSDUSDT | 15:26:42.502 |
| FDUSDUSDC | 15:26:43.118 |
| USD1USDT | 15:26:43.663 |
| USD1USDC | 15:26:44.218 |

**6 distinct `captured_at` values, strictly increasing, ~0.55-0.6s apart** — confirms the Phase 2.1 per-pair timestamp fix is working correctly in a genuine, permanent production tick (not just a dry-run harness).

### Per-pair row count
Exactly 1 row per pair, 6 pairs — no duplicates.

### Full data quality (all 6 rows)
| Pair | mid_price | spread_bps | fee_verified | fee_bps | raw bids/asks |
|---|---|---|---|---|---|
| TUSDUSDT | 0.99965 | 1.0003 | true | 0 | 20/20 |
| USDCUSDT | 1.000475 | 0.09995 | true | 0 | 20/20 |
| FDUSDUSDT | 0.99905 | 1.0009 | true | 0 | 20/20 |
| FDUSDUSDC | 0.99865 | 1.0013 | true | 0 | 20/20 |
| USD1USDT | 0.999955 | 0.10000 | true | 0 | 20/20 |
| USD1USDC | 0.99945 | 1.0005 | true | 0 | 20/20 |

All 6 rows: `fee_verified=true`, `fee_bps=0` (genuine, live, zero-fee confirmation from the same production credential audited in the prior fee-verification phase), `collector_version='collector-v1'`, exactly 20 raw bid levels + 20 raw ask levels each. No NaN, no Infinity, no null price/depth field anywhere.

### Other stablecoin tables — byte-identical, before vs. after
| Table | Count |
|---|---|
| `stablecoin_pair_allocations` | 15 (unchanged) |
| `stablecoin_allocation_assets` | 30 (unchanged) |
| `stablecoin_demo_inventory` | 124 (unchanged) |
| `stablecoin_demo_trades` | 1,231 (unchanged) |
| `stablecoin_cycle_decisions` | 2,318 (unchanged) |

### Trading safety
```
if (action === "real-execute") {
  return res.status(501).json({ error: "Real execution is not available - Phase 1 is demo-only..." });
}
```
Unchanged, still disabled. No order, no trade, no demo execution occurred anywhere in this task.

### Existing schedulers
```
signalverse-fast-jobs.timer: active
signalverse-alerts.timer: active
OnCalendar=*-*-* *:0/5:00   (unchanged)
```

### Git/deploy status
`main` unchanged at `0e407f8` — no commit, no push, no new deploy in this task. All changes in this task were VPS-local infrastructure (systemd units, one config file, one gate file) plus one real data-writing tick, none of which touch the git repository.

---

## Answers to the user's specific closing questions

1. **نتیجه‌یِ دقیقِ هر مرحله**: همه‌یِ ۱۵ مرحله‌یِ Runbook دقیقاً طبقِ برنامه اجرا شدند، صفر خطا، صفر انحراف از دستورالعمل.
2. **چند Pair موفق جمع‌آوری شدند**: **۶ از ۶** (`TUSDUSDT, USDCUSDT, FDUSDUSDT, FDUSDUSDC, USD1USDT, USD1USDC`) — همان ۶ Pairِ TRADING فعلی، Discovery کاملاً Dynamic (۱۵ نامزدِ اولیه، ۹ تا BREAK/غیرقابل‌معامله به‌درستی Skip شدند).
3. **چند Snapshot نوشته شد**: **۶** (یک ردیف به‌ازایِ هر Pair، صفر Duplicate، صفر Missing).
4. **Timer فعال است یا نیست**: **غیرفعال** (`disabled`/`inactive`) — طبقِ دستورِ صریح، در این مرحله فعال نشد.
5. **هیچ Trading/Orderی انجام نشده**: تاییدشد — `real-execute` همچنان ۵۰۱، هیچ جدولِ Trading/Demo/Allocation تغییر نکرد.
6. **Test/Validation نهایی**: تمامِ ۹ چکِ Read-Only (Timer، Row Count، Pair+Timestamp، Per-Pair Count، ۵ جدولِ دیگر، Real Trading، Schedulerهایِ قبلی) بدونِ استثنا موفق بودند.

---

## نتیجه‌یِ نهایی

```
MANUAL VALIDATION RUN: SUCCESS (6/6 pairs, 6/6 snapshots inserted, 0 failures)
PERMANENT 60-SECOND COLLECTION: NOT YET ENABLED (deliberately, per explicit instruction)
```

زیرساخت (Route، Gate، Wrapper، Service، Timer) کاملاً آماده و تک‌تک تاییدشده است. یک Tickِ واقعی و دائمی (نه Dry-Run) با موفقیتِ کامل اجرا شد. طبقِ دستورِ صریحِ کاربر، Timer در این مرحله فعال نشد — فعال‌سازیِ دائمیِ ۶۰ثانیه‌ای و مشاهده‌یِ ≥۱۰ دقیقه‌یِ زنده، موضوعِ یک تاییدِ جداگانه و بعدی است.

هیچ Commit/Push جدیدی انجام نشد. هیچ Secret (`CRON_SECRET`/`EXCHANGE_KEY_SECRET`) در هیچ خروجی، Log، یا این گزارش چاپ نشد.
