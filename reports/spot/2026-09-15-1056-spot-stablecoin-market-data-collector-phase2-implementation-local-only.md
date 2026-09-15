# Stablecoin Market Data Collector — Phase 2 Implementation (Read-Only, Isolated, Local Only — No Deploy)

## Metadata

- Date: 2026-09-16 (session continued)
- Task ID: (none assigned by user)
- Module: spot (new, isolated: Stablecoin Market Data Collector — NOT the Stablecoin Trading Engine)
- Mode: **Implementation of Phase 2** per the approved Phase 1 design (`reports/spot/2026-09-15-1036-...readonly-data-collection-plan-design-only.md`). Local-only: code and a prepared-but-**not-executed** migration exist on disk; nothing is committed, pushed, or deployed; the migration was not applied to production (see "Open Decision" below).
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e
- Ending commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e (**unchanged — nothing committed**)

## Objective

Build a fully isolated, Read-Only Binance market-data collector for future Risk Engine calibration, with zero connection to any trading decision, and prove it works against real live data — without touching Decision Logic, without applying any threshold, without writing to production, and without committing/pushing/deploying anything.

---

## ۱. فایل‌های ایجادشده (۳ فایلِ کاملاً جدید — هیچ فایلِ موجودی تغییر نکرد)

| فایل | نقش |
|---|---|
| `api/stablecoin-market-data-collector.ts` | Collectorِ ایزوله — تنها فایلِ حاویِ منطقِ واقعی |
| `migrations/stablecoin_pair_snapshots_market_data_collector.sql` | Migrationِ additive، **آماده‌شده اما اجرا‌نشده** (بخشِ «تصمیمِ باز») |
| `scripts/stablecoin-market-data-collector-test.mjs` | ۲۷ چک، مطابقِ قراردادِ ۲۲موردیِ کاربر + بررسی‌هایِ ساختاریِ اضافه |

## ۲. فایل‌هایِ تغییرکرده

**هیچ‌کدام.** `git status` تأیید می‌کند `api/stablecoin-engine.ts` و `src/app/App.tsx` و هر فایلِ دیگرِ موجود در ریپو **کاملاً دست‌نخورده‌اند** — فقط ۳ فایلِ جدید (بخشِ ۱) اضافه شده‌اند.

---

## ۳. Schema نهایی (طراحی‌شده، پیشنهادِ اعمال — هنوز اجرا نشده)

جدولِ موجودِ `stablecoin_pair_snapshots` (که صفر ردیف دارد) با ۲۹ ستونِ جدید (همه `ADD COLUMN IF NOT EXISTS`، هیچ ستونِ قدیمی حذف/تغییرِنام نشد) و یک Indexِ `UNIQUE` جدید گسترش می‌یابد:

```
symbol_status, best_bid_qty, best_ask_qty, mid_price, spread_bps,
bid_depth_5, ask_depth_5, bid_depth_20, ask_depth_20,
imbalance_5, imbalance_20, depth_concentration, deviation_bps, fee_bps,
exec_buy_{1000,2500,5000,10000}_{usd,vwap,fully_filled}   (۱۲ ستون)
exec_sell_{1000,2500,5000,10000}_{usd,vwap,fully_filled}  (۱۲ ستون)
raw_top20_levels (jsonb), collector_version (text)

+ CREATE UNIQUE INDEX idx_stablecoin_pair_snapshots_unique_tick ON (pair, captured_at)
```

ستون‌هایِ قدیمی (`bid`, `ask`, `fee_verified`, `liquidity_usd`) دست‌نخورده می‌مانند و همچنان توسطِ Collector پر می‌شوند (`bid`/`ask` = بهترین قیمت؛ `liquidity_usd` = مجموعِ عمقِ ۵سطحیِ دو طرف، به‌عنوانِ یک معیارِ کلیِ سازگار با نامِ قدیمیِ ستون).

---

## ۴. Collector Architecture

```
discoverEligiblePairs()           [Dynamic — همان منطقِ STABLE_ASSETS، هیچ Pairی Hard-Code نیست]
        ↓
فیلترِ status === 'TRADING'        [نمادهایِ BREAK صرفاً شمارش می‌شوند، پردازش نمی‌شوند]
        ↓
برایِ هر Pair (Sequential — نه Promise.all):
    fetchOrderBook() + withRetry(maxRetries=2)
        ↓
    validateOrderBook()  →  نامعتبر؟ رد شو، به Pairِ بعدی برو (بدونِ Fake Snapshot)
        ↓
    observeFeeBps()      [Best-Effort، هرگز مسدودکننده، هرگز باعثِ Decision]
        ↓
    buildSnapshotRow()   [محاسبه‌یِ همه‌یِ Featureها، فقط از رویِ همان یک Order Bookِ واکشی‌شده]
        ↓
    درج در stablecoin_pair_snapshots (یا فقط بازگرداندن، اگر dryRun=1)
        ↓
خلاصه‌یِ Tick برگردانده می‌شود (pairsAttempted/Succeeded/Failed/rowsInserted/failures)
```

**هیچ مسیری به `decideStablecoinTrade`/`runAllocationCycle`/`createTrade`/`executeOrder` وجود ندارد** — نه به‌صورتِ مستقیم، نه غیرمستقیم؛ این فایل حتی این نام‌ها را import هم نمی‌کند (Testِ ۲۲ این را ساختاری اثبات می‌کند).

---

## ۵. Binance Endpointهایِ استفاده‌شده (فقط سه مورد، همگی Read-Only)

| Endpoint | هدف |
|---|---|
| `GET /api/v3/exchangeInfo` | Dynamic Pair Discovery (Cache ۱ساعته) |
| `GET /api/v3/depth?symbol=X&limit=100` | دفترِ سفارشِ زنده (منبعِ همه‌یِ Featureها) |
| `GET /sapi/v1/asset/tradeFee` (Signed) | فقط Observationِ کارمزد، Best-Effort، هرگز مسدودکننده |

**هیچ Endpointِ سفارش‌دهی (`/api/v3/order`) در هیچ‌کجایِ فایل فراخوانی/حتی نام‌برده نمی‌شود** — تأییدشده ساختاری (Testِ ۲۲).

---

## ۶. Featureهایِ ذخیره‌شده (کاملاً مطابقِ بخشِ ۵ درخواستِ کاربر)

`best_bid/ask`, `mid_price`, `spread_bps`, `best_bid/ask_qty`, `bid/ask_depth_{5,20}`, `imbalance_{5,20}`, `depth_concentration`, `deviation_bps`, و برایِ هر ۴ اندازه‌یِ Notional (`$1,000/$2,500/$5,000/$10,000`) هر دو جهت: مقدارِ اجراپذیر، VWAP، و پرچمِ Fully-Filled.

**عمداً پیاده‌سازی‌نشده در این فاز (طبقِ دستورِ صریحِ کاربر، بخشِ ۲۰):** هیچ Momentum/Trend/Volatility در Snapshot ذخیره نمی‌شود؛ این‌ها در فازِ Calibration مستقیماً از Klineِ تازه‌واکشی‌شده‌یِ Binance محاسبه خواهند شد (طبقِ تصمیمِ خودِ Phase 1). هیچ News در این فاز جمع‌آوری نمی‌شود.

---

## ۷. Raw Order Book Format

```json
"raw_top20_levels": {
  "bids": [[price, qty], ... تا ۲۰ سطح],
  "asks": [[price, qty], ... تا ۲۰ سطح]
}
```

طبقِ تصمیمِ Phase 1: هم Derived Features، هم Raw ذخیره می‌شوند — نه یکی به‌جایِ دیگری.

---

## ۸. Validation Rules (پیاده‌سازی‌شده، تک‌به‌تکِ لیستِ کاربر)

| قانون | پیاده‌سازی |
|---|---|
| Invalid Price / Zero-Negative Depth / Crossed Bid-Ask / Incomplete Book | `validateOrderBook()` — رد کاملِ Snapshot، بدونِ درجِ هیچ ردیف |
| Duplicate Snapshot | `UNIQUE INDEX (pair, captured_at)` در سطحِ دیتابیس (نه فقط یک چکِ سمتِ کد) |
| Missing Snapshot | به‌طورِ طبیعی قابلِ‌تشخیص است — نبودِ ردیف برایِ یک Tick یعنی آن Pair در آن Tick شکست خورده (در `failures` ثبت می‌شود)، هرگز با یک ردیفِ جعلی پر نمی‌شود |
| Binance API Failure | `withRetry` (حداکثر ۲ تلاشِ اضافی، Backoffِ فزاینده)؛ شکستِ نهایی → آن Pair در همان Tick رد می‌شود، بدونِ توقفِ کلِ Collector |
| Stale Data | Binance هیچ Timestampِ سمتِ سرور برایِ دفترِ سفارش نمی‌دهد؛ «تازگی» عملاً از طریقِ Timeout+Retry تضمین می‌شود (مستندشده در کد) |

---

## ۹. Error Handling & Sequential Isolation

هر Pair در `try/catch`یِ خودش پردازش می‌شود؛ شکستِ یک Pair (`TUSDUSDT` مثلاً) هرگز رویِ Pairهایِ دیگر اثر نمی‌گذارد — دقیقاً طبقِ دستورِ کاربر، بدونِ Snapshotِ جعلی برایِ Pairِ ناموفق. `Promise.all` در هیچ‌کجا استفاده نشده (پردازش کاملاً Sequential، هماهنگ با هدفِ «تحقیقاتی، نه HFT»).

---

## ۱۰. نتیجه‌یِ تست‌ها

| Suite | نتیجه |
|---|---|
| `node --test scripts/stablecoin-market-data-collector-test.mjs` (۲۷ چک، شاملِ هر ۲۲ موردِ درخواستی + بررسی‌هایِ ساختاریِ اضافه) | **PASS** |
| `node --test scripts/stablecoin-engine-test.mjs` (رگرسیونِ کاملِ موتورِ موجود — تأییدِ صفر اثرِ جانبی) | **PASS** (بدونِ تغییر نسبت به قبل) |
| `npx tsc --noEmit --strict` رویِ فایلِ جدید | **PASS** |
| `npm run build` (وب+ادمین) | **PASS** |
| `git diff --check` (رویِ ۳ فایلِ جدید، موقتاً Stage و سپس Unstage شده — بدونِ Commit) | **PASS** |
| **Smoke Testِ زنده** (Bundleِ محلی با esbuildِ موجود، بدونِ نیاز به Session/Credential، بدونِ لمسِ DB) رویِ داده‌یِ واقعیِ Binance | **PASS** — Dynamic Discovery واقعاً ۱۵ نماد (نه فقط ۶ موردِ TRADING) پیدا کرد، شاملِ چند نمادِ BREAK (`USDCTUSD`, `BUSDUSDT`, `DAIUSDT`, ...) که خودشان درگذشته Hard-Code نشده بودند — اثباتِ زنده‌یِ Item ۳؛ هر ۶ جفتِ TRADING با اعدادِ واقعی و معقول پردازش شدند |

**تستِ ویژه‌یِ Isolation (Testِ ۲۲):** ساختاری تأیید شد که فایل هرگز به `stablecoin_pair_allocations`/`stablecoin_demo_inventory`/`stablecoin_demo_trades`/`stablecoin_cycle_decisions` کوئری نمی‌زند و هرگز `decideStablecoinTrade`/`classifyStablecoinExecutability`/`runAllocationCycle`/`simulateStablecoinTrade`/`recordRejectedOpportunity` را صدا نمی‌زند.

---

## ۱۱. نتیجه‌یِ Build

`npm run build` (Vite، وب و ادمین) هر دو **بدونِ خطا** — این Buildِ فرانت‌اند اصلاً به فایل‌هایِ جدید ربطی ندارد (هیچ فایلِ `src/`ی تغییر نکرد)، فقط برایِ اطمینانِ کاملِ از عدمِ اثرِ جانبی اجرا شد.

---

## ۱۲. نتیجه‌یِ Production Safety (پاسخِ دقیق به هر سؤالِ بخشِ ۲۳ کاربر)

```
آیا هیچ Order API فراخوانی می‌شود؟           NO
آیا هیچ Trade Insert انجام می‌شود؟            NO
آیا Inventory تغییر می‌کند؟                   NO
آیا Allocation تغییر می‌کند؟                  NO
آیا Profit تغییر می‌کند؟                      NO
آیا Decision Logic تغییر کرده؟                NO
آیا Scheduler معاملاتی تغییر کرده؟             NO
آیا Real Trading فعال شده؟                    NO
```

---

## ۱۳. دقیقاً چه چیزی تغییر نکرد

`api/stablecoin-engine.ts` (موتورِ معاملاتی)، `src/app/App.tsx` (UI)، هر Migrationِ قبلی، هر جدولِ دیگر بجز افزودنِ ستون‌هایِ جدید به `stablecoin_pair_snapshots` (که خودش هنوز **اجرا نشده** — بخشِ بعد)، Schedulerِ Production، هیچ Allocationِ واقعی، و هیچ تنظیمِ محیطی/Credential جدید.

---

## ۱۴. تصمیمِ باز — Migration اجرا نشد (نیازمندِ تأییدِ صریحِ شما)

پیامِ این فاز، برخلافِ **همه‌یِ** فازهایِ قبلیِ همین پروژه، در فهرستِ «محدودیت‌هایِ قطعی»اش صریحاً «هیچ Migration اجرا نکن» را تکرار نکرده بود (فقط موارد مربوط به Trading/Decision/Inventory/Real Trading را فهرست کرده بود)، و حتی صراحتاً گفته بود «Migration را فقط اگر واقعاً لازم است ... آماده/اجرا کن». **با این‌حال**، با توجه به اینکه **تمامِ** فازهایِ قبلیِ این تعامل (حداقل ۸ مرحله‌یِ متوالی) به‌طورِ ثابت و صریح «هیچ Production Database Write» را ممنوع اعلام کرده بودند، و یک Migration رویِ دیتابیسِ Production یک عملِ نسبتاً غیرِقابلِ‌بازگشت است، **تصمیم گرفتم Migration را فقط آماده کنم و اجرا نکنم** — تا از یک برداشتِ اشتباه از یک عبارتِ مبهم جلوگیری شود.

**اگر تأیید می‌کنید که Migration اجرا شود:** فایل `migrations/stablecoin_pair_snapshots_market_data_collector.sql` آماده و بازبینی‌شده است؛ طبقِ روالِ همیشگیِ پروژه (`npm run backup` قبل از هر Migration) اجرا خواهد شد و نتیجه‌یِ دقیق (before/after row counts، تأییدِ ستون‌هایِ جدید) در یک گزارشِ جداگانه ثبت می‌شود.

---

## ۱۵. آیا Collector برایِ اجرایِ Read-Only در Production آماده است؟

**از نظرِ کد: بله.** فایل کامل، تست‌شده، Type-Safeیِ Strict، و ساختاری اثبات‌شده که هیچ اثرِ جانبیِ معاملاتی ندارد.

**اما هنوز اجرا نشده در Production، به دو دلیل:**
۱. Migration (بخشِ ۱۴) هنوز اجرا نشده — بدونِ آن، تلاش برایِ درج ("insert") با ستون‌هایِ ناموجود شکست می‌خورد (بخشِ زیادی از این را `dryRun=1` دور می‌زند، اما درجِ واقعی نیاز به این ستون‌ها دارد).
۲. کد Commit/Push/Deploy نشده (طبقِ دستورِ صریحِ کاربر) — بنابراین حتی اگر Migration اجرا شود، خودِ Endpointِ `/api/stablecoin-market-data-collector` هنوز روی VPS در دسترس نیست.

**هیچ Timerِ جدید ایجاد نشد و Schedulerِ موجود لمس نشد** — طبقِ دستورِ صریحِ بخشِ ۱۸.

---

## هر ریسک یا ابهامِ باقی‌مانده

۱. آیا Migration اکنون اجرا شود؟ (بخشِ ۱۴)
۲. آیا این ۳ فایل اکنون Commit/Push شوند؟ (کاربر صراحتاً گفته «مگر بعداً جداگانه درخواست کنم»)
۳. آیا فعال‌سازیِ واقعیِ یک Timerِ VPS برایِ اجرایِ دوره‌ایِ این Collector (هر ۶۰ ثانیه) یک فازِ جداگانه‌یِ بعدی خواهد بود؟ (این پیام صریحاً گفته «فعلاً Scheduler را فعال نکن»، پس بله — این کاملاً به‌عنوانِ فازِ بعدی باقی مانده.)
۴. منبعِ نهاییِ Credential برایِ Fee Observation: اگر `real_accounts` یا `stablecoin_verification_accounts` در Productionِ فعلی موجود نباشد، `fee_verified=false, fee_bps=null` ذخیره می‌شود (Best-Effort، بدونِ شکستِ کلِ Snapshot) — این رفتار قبلاً تست شده (Testِ Additional).

---

## Production Safety (خلاصه)

Zero database writes, zero migrations executed, zero Allocations touched, zero trades created, zero scheduler changes, zero Binance orders, zero commits, zero pushes, zero deploys. `signal0verse/signalverse-main` remains at commit `c497c6b`, unchanged. Three new, untracked files exist locally only.

---

## FINAL STATUS TABLE

```
FILES CREATED: 3 (api/stablecoin-market-data-collector.ts, migrations/stablecoin_pair_snapshots_market_data_collector.sql,
  scripts/stablecoin-market-data-collector-test.mjs)
FILES MODIFIED: 0 (api/stablecoin-engine.ts and src/app/App.tsx confirmed byte-identical via git status)
DYNAMIC PAIR DISCOVERY: CONFIRMED via a real live run - discovered 15 real symbols (not just the 6 TRADING ones),
  including several BREAK-status pairs never hard-coded anywhere
COLLECTOR ISOLATION FROM TRADING LOGIC: STRUCTURALLY PROVEN (Test 22, 9 forbidden tables/functions checked)
LIVE SMOKE TEST: PASS - real Binance data, real VWAP/depth/imbalance/deviation numbers, zero DB writes, zero
  credentials used (fee observation gracefully returns unverified/null without one)
UNIT TESTS: 27/27 PASS (new collector) + 44/44 PASS (existing engine regression, unaffected)
TYPESCRIPT: PASS (strict)
BUILD: PASS (web + admin, unaffected)
GIT DIFF CHECK: PASS (new files, temporarily staged then unstaged - no commit made)
MIGRATION: PREPARED, NOT EXECUTED (see "Open Decision", section 14 - deliberately conservative given every prior
  phase's consistent "no Production Database Write" instruction)
NEW SCHEDULER/TIMER: NONE CREATED
EXISTING SCHEDULER: UNTOUCHED
REAL TRADING: NOT ENABLED
DECISION LOGIC: NOT TOUCHED
THRESHOLD APPLIED: NONE
ALLOCATION/TRADE/INVENTORY/PROFIT: UNCHANGED
CODE COMMITTED: NO
CODE PUSHED: NO
PRODUCTION DEPLOYED: NO
READY FOR READ-ONLY PRODUCTION EXECUTION: Code-wise YES; blocked only on (a) migration approval, (b) commit/push/
  deploy approval - both explicitly reserved for the user's separate decision
AWAITING: explicit user decision on the 4 open items in "هر ریسک یا ابهامِ باقی‌مانده" above, most importantly
  whether to apply the prepared migration now
```
