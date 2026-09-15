# Stablecoin Market Data Collector — VPS Activation Runbook (user-executed, manual-run-only)

## Metadata

- Date: 2026-09-15
- Task ID: (none assigned by user)
- Module: spot (Historical Stablecoin Market Observation Dataset — production scheduler wiring)
- Mode: **Instruction preparation only.** No command in this report was executed by this session. Every step below must be run by the user directly, from their own terminal, against the VPS.
- Repository: signal0verse/signalverse-main
- Branch: main
- Commit (already deployed): `0e407f8d6bf4f56eefe78771a2fd6e0d12e8184f`
- Production: VPS `13.140.149.56` (SSH port `22123`), database `signalverse_cutover2`, PostgreSQL 17.11

## Why this report exists

Continuing directly from `reports/spot/2026-09-15-1600-...historical-collection-activation-attempt.md` (verdict: `HISTORICAL COLLECTION NOT ACTIVATED`). This environment's own safety classifier blocks this session from performing any write, restart, or state-changing command against the VPS ("Remote Shell Writes"). Per that report's own conclusion, this session prepares exact, copy-pasteable, production-safe commands; the user runs them.

**Values below were confirmed moments ago via read-only checks (not guessed):**
- Current deployed release directory: `/opt/signalverse/releases/0e407f8d6bf4f56eefe78771a2fd6e0d12e8184f` (this is what `/opt/signalverse/app` currently resolves to, confirmed via `readlink -f`).
- Current `stablecoin_pair_snapshots` row count: `0`.

---

## Before you start

Every step below is additive or reversible (a registration line, new independent files, one manual service run). Nothing here touches Trading/Decision code, deletes data, or runs a migration. Each destructive-adjacent step (edits, restarts) includes a backup or a pre-check first.

Run everything in **one SSH session** as root:

```bash
ssh -4 -p 22123 -i ~/.ssh/signalverse_contabo_ed25519 root@13.140.149.56
```

---

## Step 1 — Register the route in `server.mjs`, then restart `signalverse.service`

**What this does:** `.runtime/server.mjs` is a static, VPS-persisted file (not built from git) with a hardcoded allowlist of valid `/api/<name>` routes. `stablecoin-market-data-collector` is missing from it, which is why the endpoint currently 404s. This edits the **canonical shared copy** (`/opt/signalverse/shared/runtime/server.mjs`, copied into every future release) **and** the copy inside the **currently deployed release** (`/opt/signalverse/releases/0e407f8d6bf4f56eefe78771a2fd6e0d12e8184f/.runtime/server.mjs`) so the change takes effect immediately without waiting for a future deploy. Both are backed up before editing.

```bash
# Backup both copies first (timestamped, never overwritten)
cp /opt/signalverse/shared/runtime/server.mjs "/opt/signalverse/shared/runtime/server.mjs.bak-$(date +%Y%m%d-%H%M%S)"
cp /opt/signalverse/app/.runtime/server.mjs "/opt/signalverse/app/.runtime/server.mjs.bak-$(date +%Y%m%d-%H%M%S)"

# Confirm the route is genuinely missing before editing (sanity check, not a change)
grep -c "stablecoin-market-data-collector" /opt/signalverse/shared/runtime/server.mjs
# ^ expected output: 0   (if this is already >0, STOP and tell me before continuing - it means someone already edited this)

# Apply the one-line addition to both copies
sed -i "s/  'stablecoin-engine',/  'stablecoin-engine',\n  'stablecoin-market-data-collector',/" /opt/signalverse/shared/runtime/server.mjs
sed -i "s/  'stablecoin-engine',/  'stablecoin-engine',\n  'stablecoin-market-data-collector',/" /opt/signalverse/app/.runtime/server.mjs

# Syntax-check BEFORE restarting anything (catches a bad edit while the old process is still serving traffic)
node --check /opt/signalverse/shared/runtime/server.mjs && echo "shared copy: SYNTAX OK"
node --check /opt/signalverse/app/.runtime/server.mjs && echo "deployed copy: SYNTAX OK"

# Confirm exactly one new line was added, in the right place, in both files
grep -n "stablecoin" /opt/signalverse/shared/runtime/server.mjs
grep -n "stablecoin" /opt/signalverse/app/.runtime/server.mjs

# Only if both syntax checks above printed OK: restart the service to load the new route
systemctl restart signalverse.service
sleep 2
systemctl is-active signalverse.service
curl -s -o /dev/null -w 'healthz http status: %{http_code}\n' http://127.0.0.1:3000/healthz
```

**Expected result:** both `node --check` calls print no error, `grep` shows `'stablecoin-market-data-collector',` present once in each file (right after `'stablecoin-engine',`), the service is `active`, and `healthz` returns `200`.

---

## Step 2 — Create the independent job gate

**What this does:** matches this project's own established convention (every scheduled job has its own on/off switch as a file under `/etc/signalverse/jobs.d/`). Creating this file is what "enables" the job for the wrapper script in Step 3 to actually call the endpoint instead of skipping.

```bash
install -o root -g root -m 0644 /dev/null /etc/signalverse/jobs.d/stablecoin-market-data-collector.enabled
ls -la /etc/signalverse/jobs.d/stablecoin-market-data-collector.enabled
```

**Expected result:** the file exists, empty, `-rw-r--r--`.

---

## Step 3 — Create the wrapper script (gate check + CRON_SECRET auth + non-overlap lock)

**What this does:** this is the actual command the timer will run every 60 seconds. It (a) exits immediately and safely if the gate file from Step 2 is ever removed later, (b) exits immediately if `CRON_SECRET` isn't set (never fabricates auth), (c) uses `flock` so if one tick is still running when the next one would start, the new one skips instead of running concurrently, and (d) calls the collector's real `action=collect` endpoint (this performs a real, permanent DB insert once you run it — that's expected and is exactly what "Historical Collection" means; there is still zero Trading/Order logic anywhere in this path).

```bash
cat > /usr/local/libexec/signalverse-stablecoin-collector <<'SCRIPT'
#!/usr/bin/env bash
set -u
gate_dir='/etc/signalverse/jobs.d'
lock_file='/run/lock/signalverse-stablecoin-collector.lock'

if [[ ! -f "${gate_dir}/stablecoin-market-data-collector.enabled" ]]; then
  echo 'stablecoin-market-data-collector not enabled (jobs.d gate missing); skipping'
  exit 0
fi
if [[ -z "${CRON_SECRET:-}" ]]; then
  echo 'CRON_SECRET is not configured; skipping stablecoin-market-data-collector'
  exit 0
fi

exec 9>"$lock_file"
if ! flock -n 9; then
  echo 'previous tick still running; skipping this tick (non-overlap protection)'
  exit 0
fi

curl --silent --show-error --fail --max-time 55 --request POST \
  --header 'Host: signal.easybitpay.com' \
  --header "Authorization: Bearer ${CRON_SECRET}" \
  'http://127.0.0.1:3000/api/stablecoin-market-data-collector?action=collect'
echo
SCRIPT
chmod 0755 /usr/local/libexec/signalverse-stablecoin-collector
bash -n /usr/local/libexec/signalverse-stablecoin-collector && echo "wrapper script: SYNTAX OK"
```

**Note on secrecy:** this script never echoes `$CRON_SECRET` — it is only used inline inside the `curl` header, and `curl`'s own output (the collector's JSON response) never contains it either.

**Expected result:** `wrapper script: SYNTAX OK`.

---

## Step 4 — Create the systemd service unit

**What this does:** defines *how* to run one tick — as the existing unprivileged `signalverse` user/group, with the same production env file and the same hardening flags already used by `signalverse-fast-jobs.service`, bounded to under 60 seconds so it can never overrun into the next scheduled tick.

```bash
cat > /etc/systemd/system/signalverse-stablecoin-collector.service <<'UNIT'
[Unit]
Description=SignalVerse Stablecoin Market Data Collector tick (independent 60s job)
After=network-online.target signalverse.service
Wants=network-online.target

[Service]
Type=oneshot
User=signalverse
Group=signalverse
EnvironmentFile=-/etc/signalverse/signalverse.env
ExecStart=/usr/local/libexec/signalverse-stablecoin-collector
TimeoutStartSec=58
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6
UNIT
```

**Expected result:** no output (heredoc just writes the file). Verify with `systemctl cat signalverse-stablecoin-collector.service` if you want to see it back.

---

## Step 5 — Create the systemd timer (60-second cadence, independent of every existing timer)

**What this does:** `OnActiveSec=60s` means the timer will **not** fire immediately when enabled — the first automatic tick happens 60 seconds after `systemctl enable --now`. This is deliberate: it gives you a full 60-second gap between the manual test (Step 7) and any future automatic tick, and — critically — **this report does not tell you to enable this timer at all yet.** It only tells you to create the file.

```bash
cat > /etc/systemd/system/signalverse-stablecoin-collector.timer <<'UNIT'
[Unit]
Description=Run SignalVerse Stablecoin Market Data Collector every 60 seconds

[Timer]
OnActiveSec=60s
OnUnitActiveSec=60s
AccuracySec=1s

[Install]
WantedBy=timers.target
UNIT
```

**Expected result:** no output. This file existing does **not** start anything — a `.timer` unit only runs once `systemctl enable --now` (or at least `start`) is applied to it, which is explicitly **not** part of this runbook.

---

## Step 6 — Reload systemd

```bash
systemctl daemon-reload
```

**What this does:** makes systemd aware of the two new unit files from Steps 4-5. This does not start or enable anything by itself.

---

## Step 7 — Run exactly ONE manual test tick (timer stays disabled)

```bash
echo "--- before: snapshot row count ---"
sudo -u postgres psql -d signalverse_cutover2 -t -c "SELECT count(*) FROM stablecoin_pair_snapshots;"

echo "--- manual run ---"
systemctl start signalverse-stablecoin-collector.service
sleep 3
systemctl status signalverse-stablecoin-collector.service --no-pager -l
```

**What this does:** runs the wrapper script exactly once, synchronously enough to check its result a few seconds later. This is a real tick — it will genuinely insert rows into `stablecoin_pair_snapshots` if everything works, exactly as Section 11 of the activation plan calls for ("Job را یک بار manually اجرا کن"). **Do not run `systemctl enable` or `start` on the `.timer` unit** — only the `.service` unit, once, as shown above.

---

## Step 8 — Read-only checks (copy the output of these back to me)

```bash
echo "=== 1) service status (again, full) ==="
systemctl status signalverse-stablecoin-collector.service --no-pager -l

echo "=== 2) journal for this one manual run ==="
journalctl -u signalverse-stablecoin-collector.service -n 50 --no-pager

echo "=== 3) timer status - confirm it is NOT active/enabled ==="
systemctl status signalverse-stablecoin-collector.timer --no-pager -l
systemctl is-enabled signalverse-stablecoin-collector.timer

echo "=== 4) snapshot row count after the manual run ==="
sudo -u postgres psql -d signalverse_cutover2 -t -c "SELECT count(*) FROM stablecoin_pair_snapshots;"

echo "=== 5) distinct captured_at values (per-pair timestamp proof) ==="
sudo -u postgres psql -d signalverse_cutover2 -c "SELECT pair, captured_at FROM stablecoin_pair_snapshots ORDER BY captured_at DESC LIMIT 10;"

echo "=== 6) which pairs were actually collected ==="
sudo -u postgres psql -d signalverse_cutover2 -c "SELECT pair, count(*) FROM stablecoin_pair_snapshots GROUP BY pair ORDER BY pair;"

echo "=== 7) confirm no other stablecoin table changed ==="
sudo -u postgres psql -d signalverse_cutover2 -c "
SELECT 'stablecoin_pair_allocations', count(*) FROM stablecoin_pair_allocations
UNION ALL SELECT 'stablecoin_allocation_assets', count(*) FROM stablecoin_allocation_assets
UNION ALL SELECT 'stablecoin_demo_inventory', count(*) FROM stablecoin_demo_inventory
UNION ALL SELECT 'stablecoin_demo_trades', count(*) FROM stablecoin_demo_trades
UNION ALL SELECT 'stablecoin_cycle_decisions', count(*) FROM stablecoin_cycle_decisions;
"

echo "=== 8) confirm no order was placed / real trading still disabled ==="
grep -A1 'action === "real-execute"' /opt/signalverse/app/.runtime/api/stablecoin-engine.mjs | head -3

echo "=== 9) confirm existing timers/jobs still unchanged ==="
systemctl is-active signalverse-fast-jobs.timer signalverse-alerts.timer
systemctl cat signalverse-fast-jobs.timer | grep OnCalendar
```

None of the commands in Step 8 write anything — they only read service status, logs, and the database.

---

## بعد از اجرای دستی چه چیزی را برای بررسی من بفرست

لطفاً کل خروجیِ **Step 8** را (هر ۹ بخش) عیناً کپی کنید و برایم بفرستید — به‌خصوص:

1. آیا `systemctl status` سرویس را `Active: inactive (dead)` با **`Main PID` و کدِ خروجیِ ۰`** نشان می‌دهد (یعنی اجرای موفق) یا خطا؟
2. متنِ کاملِ `journalctl` — این دقیقاً همان چیزی است که مشخص می‌کند چند Pair موفق/ناموفق بودند (فیلدِ خلاصه‌یِ خودِ Collector: `attempted=... succeeded=... failed=...`).
3. تاییدِ صریح که `systemctl is-enabled signalverse-stablecoin-collector.timer` چیزی غیر از `enabled` نشان می‌دهد (مثلاً `disabled` یا `static`) — یعنی Timer هنوز شروع نشده.
4. تعدادِ ردیف‌هایِ جدولِ `stablecoin_pair_snapshots` بعد از اجرا (انتظار: تعدادی برابر با تعدادِ Pairهایِ TRADING فعلی، نه صفر).
5. خروجیِ query شماره ۵ و ۶ (captured_at و شمارشِ هر Pair).
6. خروجیِ query شماره ۷ (پنج جدولِ دیگر باید دقیقاً بدونِ تغییر باشند).
7. خروجیِ چکِ شماره ۸ (تاییدِ ۵۰۱ برایِ Real Trading).

**هرگز مقدارِ `CRON_SECRET` یا `EXCHANGE_KEY_SECRET` را کپی نکنید** — هیچ‌کدام از دستورهایِ بالا این مقادیر را چاپ نمی‌کنند، ولی اگر خروجیِ اضافه‌ای (مثلاً از تاریخچه‌یِ ترمینال) کپی می‌کنید، قبل از فرستادن یک‌بار چک کنید.

بعد از دریافتِ این خروجی‌ها، من (بدونِ اجرایِ هیچ دستورِ Write) نتیجه را تحلیل می‌کنم و اگر همه‌چیز تمیز بود، دستورِ دقیقِ یک‌خطیِ فعال‌سازیِ دائمیِ Timer (`systemctl enable --now signalverse-stablecoin-collector.timer`) را برایتان می‌فرستم — نه زودتر.

## نتیجه‌یِ نهایی

```
HISTORICAL COLLECTION NOT ACTIVATED
```

این مرحله فقط تهیه‌یِ دستورالعملِ دقیق بود؛ هیچ دستوری توسطِ این سشن رویِ VPS اجرا نشد (طبقِ محدودیتِ صریحِ کاربر و محدودیتِ خودِ محیط). Timer دائمی هنوز فعال نشده، هیچ Snapshotِ جدیدی نوشته نشده، و هیچ Commit/Push جدیدی انجام نشد.
