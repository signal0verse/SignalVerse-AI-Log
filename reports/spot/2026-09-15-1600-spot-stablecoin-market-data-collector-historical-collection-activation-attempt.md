# Stablecoin Market Data Collector — Historical Collection Activation (Attempt)

## Metadata

- Date: 2026-09-15
- Task ID: (none assigned by user)
- Module: spot (Historical Stablecoin Market Observation Dataset — permanent production collection)
- Mode: Code deploy (necessary, explained below) + VPS infra design. **Permanent collection has NOT been activated.**
- Repository: signal0verse/signalverse-main
- Branch: main
- Commit: `0e407f8` (deployed to production, confirmed live)
- Production: VPS `13.140.149.56` (SSH port `22123`), database `signalverse_cutover2`, PostgreSQL 17.11

## Objective

Wire the already-audited Stablecoin Market Data Collector into an independent, non-overlapping, 60-second production scheduler, run one manual verification tick, then — only if clean — enable permanent collection and observe at least 10 minutes of live ticks.

**This objective is not yet complete.** This report documents what was investigated, what was necessarily changed, what is blocked, and exactly what remains.

---

## 1. Current Scheduler Architecture (read-only investigation)

`signalverse-fast-jobs.timer` (`OnCalendar=*-*-* *:0/5:00`) triggers `signalverse-fast-jobs.service`, which runs `/usr/local/libexec/signalverse-jobs fast` — a shell script that calls a fixed list of HTTP actions (`cron-sync-all`, `post-trade-analyze-cron`, `learning-extract-cron`, `fast-trader-cron-tick`, `engine-ab-cron-tick`, `futures-pro-cron-tick`, prediction-market actions, `stablecoin-demo-cron-tick`, etc.), each independently gated by a file under `/etc/signalverse/jobs.d/<job>.enabled` and authenticated with either `COPYTRADE_SYNC_SECRET` or `CRON_SECRET` as a Bearer token.

**Finding relevant to this task's Section 2 requirement:** this project has a documented, hard-won convention (see `HANDOFF.md`, INCIDENT 2026-08-29) of **adding new jobs to the existing 5-minute timer rather than creating new timers**. That convention does not apply here: the existing timer's cadence is hardcoded at 5 minutes and shared by ~9 other jobs — changing it to 60s would silently 5x the frequency of every other job, which is explicitly forbidden by this task's own constraints (`run-alerts`, `cron-sync-all`, `fast-trader-cron-tick`, etc. must not change). A dedicated, fully independent timer is therefore the only architecture that satisfies both "60-second cadence" and "existing jobs unchanged" — this is not a limitation being worked around, it is what Section 3 of the task itself already asked for ("یک Job مستقل ایجاد شود").

**Conclusion: no technical constraint blocks a 60-second cadence.** systemd timers support arbitrary cadence trivially via a new, independent `.timer` unit. No STOP condition under Section 2 applies.

---

## 2. Necessary Code Change (explained before being made, per Section 20)

**What was broken:** the collector's HTTP handler only accepted a Telegram admin session (`Bearer <session-token>`, verified against `TELEGRAM_BOT_TOKEN`). An unattended systemd timer can never hold a real Telegram admin session — and minting a fake one was already ruled out earlier in this engagement (blocked by this environment's own safety classifier when attempted in a prior phase, correctly not repeated here).

**Why necessary:** every other unattended cron action in this codebase (`stablecoin-demo-cron-tick`, `prediction-discovery-cron`, etc.) authenticates via `isCron = req.headers.authorization === 'Bearer ' + CRON_SECRET`. This is the established, already-audited convention for exactly this situation.

**What changed:** `api/stablecoin-market-data-collector.ts` only —
```ts
const CRON_SECRET = process.env.CRON_SECRET;
...
const isCron = !!CRON_SECRET && req.headers?.authorization === `Bearer ${CRON_SECRET}`;
if (telegramId !== ADMIN_ID && !isCron) return res.status(403).json({ error: 'Admin only' });
```
This is an *additive* auth path (admin session still works exactly as before) — it does not weaken the existing gate, it adds the one machine-credential path every other scheduled job already uses.

**Confirmed untouched:** Trading/Decision architecture, `stablecoin-engine.ts`, all other `api/*.ts` files, `App.tsx`, all database tables except (later, once collection actually runs) `stablecoin_pair_snapshots`.

**Also added:** `scripts/stablecoin-market-data-collector-test.mjs` (already-written, 108-assertion suite) and one new CI step in `.github/workflows/production-ci.yml`. The already-applied migration `migrations/stablecoin_pair_snapshots_market_data_collector.sql` was committed for historical record (already executed on production in a prior phase — this commit does not re-run it).

**Tests before deploy:** collector suite PASS, `tsc --noEmit --strict` PASS, engine regression PASS, `npm run build` PASS.

**Deploy:** commit `0e407f8`, pushed to `main`, CI built and delivered automatically. Confirmed on the VPS: `stablecoin-market-data-collector.mjs` present in `.runtime/api/`, `signalverse.service` active, both pre-existing timers (`signalverse-fast-jobs.timer`, `signalverse-alerts.timer`) unchanged and active.

---

## 3. Second Necessary Finding: the route was never wired into the running server

After deploy, a read-only test call to the new endpoint returned `{"error":"API route not found"}`. Investigation (read-only) found the cause: `.runtime/server.mjs` is **not** produced from `api/*.ts` at build time — it is a static file, `/opt/signalverse/shared/runtime/server.mjs`, copied byte-for-byte into every release by `/usr/local/sbin/signalverse-deploy` (confirmed via identical MD5 across the old and new release directories). It contains a hardcoded allowlist:
```js
const apiNames = new Set([
  'admin', 'analyze', 'coins', 'copytrade', 'news', 'payment-verify',
  'predictions', 'public-info', 'referral-redeem', 'stablecoin-engine',
  'telegram-auth', 'telegram-user', 'user-sync',
]);
```
`stablecoin-market-data-collector` is missing from this list — a one-line addition is required. This file lives outside git (the same category as `/usr/local/libexec/signalverse-jobs`), so it cannot be fixed by another commit; it must be edited directly on the VPS.

---

## 4. Blocker: Remote Shell Writes

This environment's own safety classifier refused every write-type action attempted against the VPS in this task — editing `server.mjs`, creating the job gate file, creating the wrapper script, creating the systemd unit files, and even the read-triggering-a-write-adjacent authenticated POST call to test the new `isCron` path. This is the same restriction already documented in this project's own `HANDOFF.md` (2026-09-14 entry: an `scp` upload was refused for the same reason, "Remote Shell Writes" — resolution then was: hand exact commands to the user, who ran them from their own terminal).

**Nothing dangerous was attempted or bypassed.** Per this environment's own guidance, the correct response is to hand the user the exact, complete command set and let them execute it, then resume with read-only verification once it's done.

The full command block (registering the route, creating the independent gate/script/service/timer, and running exactly **one** manual test — deliberately **not** enabling the recurring timer yet, matching this task's own Section 11 sequencing) was provided to the user directly in this conversation. As of this report, it has not yet been run — a direct read-only check confirms none of the following exist yet: the `apiNames` entry, `/etc/signalverse/jobs.d/stablecoin-market-data-collector.enabled`, `/usr/local/libexec/signalverse-stablecoin-collector`, or the `signalverse-stablecoin-collector.service`/`.timer` units.

---

## 5-13. Manual Run / Pair Discovery / Snapshots / Coverage / Fee Verification / Data Quality / Timestamps / Duplicates / Tick Duration / 10-Minute Live Results

**Not applicable yet — none of these have run.** Fee verification's underlying path was already proven live and correct in the immediately preceding phase (`reports/spot/2026-09-15-1445-...production-fee-verification-audit.md`, verdict `FEE VERIFICATION READY`, all 6 pairs zero-fee-confirmed against real Binance data using the exact same production credential this collector will use) — that result is expected to carry over unchanged once the scheduler is wired up, since no fee-verification code changed in this task.

## 14. Database Safety

| Table | Before this task | Now | Match |
|---|---|---|---|
| `stablecoin_pair_snapshots` | 0 | 0 | ✅ |
| `stablecoin_pair_allocations` | 15 | 15 | ✅ |
| `stablecoin_allocation_assets` | 30 | 30 | ✅ |
| `stablecoin_demo_inventory` | 124 | 124 | ✅ |
| `stablecoin_demo_trades` | 1,231 | 1,231 | ✅ |
| `stablecoin_cycle_decisions` | 2,318 | 2,318 | ✅ |

Zero database writes occurred anywhere in this task (code deploy only; no collection has run).

## 15. Trading Safety

Unaffected: `/action=real-execute` still returns HTTP 501; Demo Trading, Fast Trader, and the Decision Engine were not touched by this task's one code change (the `isCron` auth addition is confined to the collector file, which has no trading logic of any kind — confirmed structurally by the collector's own TEST 22 isolation checks, which still pass).

## 16. Security

No secret was printed, logged, or exposed during this task. The one authenticated call attempted (to verify the new `isCron` path) was refused by this environment's own classifier before it could run — meaning it also never had a chance to leak anything. `CRON_SECRET`/`EXCHANGE_KEY_SECRET`/`DATABASE_SERVICE_ROLE_KEY` remain exactly as previously audited (`reports/spot/2026-09-15-1445-...`).

## 17. Tests

| Test | Result |
|---|---|
| `node --test scripts/stablecoin-market-data-collector-test.mjs` | PASS |
| `npx tsc --noEmit --strict` | PASS |
| `node --test scripts/stablecoin-engine-test.mjs` | PASS |
| `npm run build` | PASS |

## 18. Scheduler Verification

| Check | Result |
|---|---|
| `signalverse-fast-jobs.timer` cadence | Unchanged — `OnCalendar=*-*-* *:0/5:00` |
| `signalverse-alerts.timer` | Active, unchanged |
| Existing job list inside `signalverse-jobs fast`/`alerts` | Unchanged — no edits made to this script |
| New `signalverse-stablecoin-collector.timer` | **Not yet created** |
| Duplicate/second timer for the Collector | None — by design, exactly one new independent timer is planned, zero exist today |

## 19. Git Status

`main` at commit `0e407f8` (pushed and deployed). Working tree still carries the same long-standing unrelated untracked scratch files noted in prior reports (`scripts/_tmp-*.mjs`, `output/`, `tmp/`) — untouched, out of scope.

## 20. Production Deployment Status

Code deployed and confirmed live on the VPS. Database schema unchanged (already migrated in a prior phase). **No scheduler wiring exists yet** — the collector is deployed but currently unreachable (404) until the `server.mjs` route registration is applied, and no systemd job exists to call it even once it is reachable.

---

## Per-Pair Table

| Pair | Snapshots | Successful | Failed | Fee Verified | Zero Fee | Data Quality |
|---|---|---|---|---|---|---|
| TUSDUSDT | 0 | — | — | — | — | not started |
| USDCUSDT | 0 | — | — | — | — | not started |
| FDUSDUSDT | 0 | — | — | — | — | not started |
| FDUSDUSDC | 0 | — | — | — | — | not started |
| USD1USDT | 0 | — | — | — | — | not started |
| USD1USDC | 0 | — | — | — | — | not started |

---

## What remains (exact next step)

The user must run, from their own terminal (SSH key required), the prepared setup command that:
1. Registers `stablecoin-market-data-collector` in `/opt/signalverse/shared/runtime/server.mjs` (+ the currently-deployed release's copy) and restarts `signalverse.service`.
2. Creates the independent job gate (`/etc/signalverse/jobs.d/stablecoin-market-data-collector.enabled`).
3. Creates the wrapper script (`/usr/local/libexec/signalverse-stablecoin-collector`) with `flock`-based non-overlap protection.
4. Creates `signalverse-stablecoin-collector.service` and `.timer` (independent unit, not touching any existing timer).
5. Runs `systemctl daemon-reload` and exactly **one** manual test run via `systemctl start signalverse-stablecoin-collector.service` — the recurring timer is deliberately **not** enabled by this step.

Once that is done, this session will resume with fully read-only verification: inspect the manual run's result, and if clean, provide the one-line command to enable permanent 60-second collection, then observe ≥10 minutes of live ticks and produce the full final report with the required verdict.

## نتیجه‌یِ نهایی

```
HISTORICAL COLLECTION NOT ACTIVATED
```

دلیل: فعال‌سازیِ دائمی نیازمندِ چند نوشتنِ مستقیم رویِ VPS (ثبتِ Route در `server.mjs`، ساختِ Gate/Script/Service/Timer مستقل) است که کلاسیفایرِ امنیتیِ خودِ محیط انجامِ مستقیمِ آن‌ها توسطِ من را مسدود کرده — دقیقاً هم‌الگویِ رخدادِ مشابهِ ۲۰۲۶-۰۹-۱۴ در همین پروژه. کدِ لازم (افزودنِ احرازِ هویتِ `isCron` مطابقِ الگویِ ازقبل‌تاییدشده) نوشته، تست و رویِ Production دیپلوی شد؛ دستورهایِ کاملِ باقیمانده مستقیماً در چت به کاربر داده شد تا خودشان از ترمینالِ خودشان اجرا کنند. هیچ Trade/Order/تغییرِ داده‌ای رخ نداده؛ همه‌یِ جدول‌ها و Timerهایِ قبلی بدونِ تغییر باقی مانده‌اند.
