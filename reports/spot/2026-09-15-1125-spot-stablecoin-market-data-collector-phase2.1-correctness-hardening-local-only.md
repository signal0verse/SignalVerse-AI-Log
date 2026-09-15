# Stablecoin Market Data Collector — Phase 2.1 Correctness Hardening (Read-Only, Local Only — No Deploy)

## Metadata

- Date: 2026-09-16 (session continued)
- Task ID: (none assigned by user)
- Module: spot (Stablecoin Market Data Collector — isolated from the Stablecoin Trading Engine)
- Mode: **Correctness/data-integrity hardening of Phase 2**, per the user's own review of the three Phase 2 files. Local-only: no commit, no push, no deploy, no migration executed, no scheduler change.
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e
- Ending commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e (**unchanged**)

## Objective

Fix three real correctness issues the user found in the Phase 2 collector (batch-shared `captured_at`, an `Infinity`-tolerant validation check, and a bid-only depth-concentration metric), harden the test suite to prove each fix with real evidence, and re-verify total isolation from the trading engine — without touching `api/stablecoin-engine.ts`, Decision Logic, or any Production data.

---

## ۱. چه ایرادهایی پیدا شد

| ایراد | چرا واقعاً یک باگ بود |
|---|---|
| **`captured_at` مشترک برایِ کلِ Batch** | یک `tickAt` قبل از Loop ساخته می‌شد و برایِ هر ۶ Pair یکسان بود — یعنی `captured_at` نشان‌دهنده‌یِ لحظه‌یِ **شروعِ کلِ Tick** بود، نه لحظه‌یِ واقعیِ دریافتِ موفقِ هر Order Book. برایِ محاسباتِ آینده‌یِ Rate-of-Change (که دقیقاً به فاصله‌یِ زمانیِ واقعی بینِ دو نمونه نیاز دارد)، این خطا می‌توانست نتایج را منحرف کند. |
| **Validationِ `price > 0` در برابرِ `Infinity`** | در جاوااسکریپت `Infinity > 0` مقدارِ `true` برمی‌گرداند — یعنی یک قیمتِ خراب/نامعتبر (`Infinity`) از این چک به‌اشتباه **عبور** می‌کرد و می‌توانست وارد Dataset شود. یک باگِ واقعیِ Data Integrity، دقیقاً همان‌طور که کاربر پیش‌بینی کرده بود. |
| **`depth_concentration` فقط برایِ Bid** | تنها یک ستون، محاسبه‌شده فقط از `ob.bids` — یعنی هیچ اطلاعاتی درباره‌یِ شکنندگی/پایداریِ سمتِ Ask هرگز ثبت نمی‌شد. یک شکافِ یک‌طرفه در اولین نسخه. |

هر سه مورد **واقعی** بودند و در بخشِ ۲ همین گزارش اصلاح شدند.

---

## ۲. چه اصلاحاتی انجام شد

### الف) `captured_at` per-pair

`tickAt` (قبل از Loop) به `tickStartedAt` تغییرِ نام داد و **فقط** برایِ Logging/Summary استفاده می‌شود — هرگز درونِ هیچ ردیفی نوشته نمی‌شود. یک `capturedAt` جدید **درونِ Loop**، بلافاصله بعد از موفقیتِ `withRetry(() => fetchOrderBook(...))` و **قبل از** Validation/Fee/DB-Write محاسبه می‌شود:

```ts
const ob = await withRetry(() => fetchOrderBook(sym.symbol));
const capturedAt = new Date().toISOString(); // درست همین‌جا — لحظه‌یِ واقعیِ دریافتِ موفق
```

**چرا از Timestampِ محلی استفاده شد، نه Timestampِ Binance:** پاسخِ `GET /api/v3/depth` هیچ فیلدِ Timestampِ سمتِ سرور ندارد (فقط `bids`/`asks`/`lastUpdateId` — که یک شماره‌یِ توالی است، نه زمان). این تصمیم و دلیلش مستقیماً در کامنتِ کد مستند شده.

**اثباتِ زنده (نه فقط ادعا):** یک Smoke Test واقعی روی هر ۶ Pair نشان داد **هر ۶ مقدارِ `captured_at` کاملاً متفاوت‌اند** (`2026-09-15T11:25:16.009Z` تا `...16.471Z` — فاصله‌یِ واقعیِ چند صد میلی‌ثانیه‌ای، دقیقاً متناظر با زمانِ واقعیِ هر Fetch).

### ب) Validationِ سخت‌گیرانه‌تر

```ts
function isValidPrice(price) { return Number.isFinite(price) && price > 0; }
function isValidQty(qty) { return Number.isFinite(qty) && qty > 0; }
```

حالا `NaN`, `Infinity`, `-Infinity`, `0`, و مقادیرِ منفی — برایِ **هم Price هم Qty، هم Bid هم Ask، در هر سطح (نه فقط بهترین سطح)** — رد می‌شوند. تستِ صریح اضافه شد که دقیقاً همین باگِ فرضی را بازتولید و تأیید می‌کند که دیگر رخ نمی‌دهد.

### ج) تفکیکِ `bid_depth_concentration` / `ask_depth_concentration`

```ts
bid_depth_concentration: computeDepthConcentration(ob.bids, 20),
ask_depth_concentration: computeDepthConcentration(ob.asks, 20),
```

**تصمیمِ Schema (طبقِ درخواستِ کاربر برایِ کمترین پیچیدگی):** چون Migration هرگز اجرا نشده بود (صفر ردیف، هیچ داده‌یِ Production متأثر نیست)، ستونِ قدیمیِ `depth_concentration` به‌جایِ نگه‌داشتنِ به‌عنوانِ Backward-Compatible، **مستقیماً با دو ستونِ صحیح جایگزین شد** — چون این کار سادگیِ بیشتری دارد و ستونی با معنایِ ناقص/گمراه‌کننده باقی نمی‌گذارد. این تصمیم و دلیلش در کامنتِ Migration مستند شده است.

**اثباتِ زنده:** برایِ `FDUSDUSDT`، `bid_depth_concentration=0.389` در برابرِ `ask_depth_concentration=0.0496` — دو عددِ کاملاً متفاوت و مستقل، دقیقاً همان‌طور که از یک دفترِ سفارشِ واقعی و نامتقارن انتظار می‌رود.

---

## ۳. فایل‌هایِ تغییرکرده (فقط همان ۳ فایلِ Phase 2 — هیچ فایلِ دیگری لمس نشد)

| فایل | نوعِ تغییر |
|---|---|
| `api/stablecoin-market-data-collector.ts` | اصلاحِ هر ۳ ایراد + کامنت‌هایِ مستندسازی + بررسیِ Binance Host + تقویتِ مستنداتِ Fee |
| `migrations/stablecoin_pair_snapshots_market_data_collector.sql` | جایگزینیِ `depth_concentration` با `bid_depth_concentration`/`ask_depth_concentration` (هنوز اجرا‌نشده) |
| `scripts/stablecoin-market-data-collector-test.mjs` | از ۲۷ چک به **۱۰۸ چک** — ۶ بخشِ جدید (A تا F) دقیقاً طبقِ چک‌لیستِ کاربر |

`api/stablecoin-engine.ts`، `src/app/App.tsx`، Scheduler، و هر فایلِ دیگر **کاملاً دست‌نخورده** (`git status` تأییدشده).

---

## ۴. آیا Migration تغییر کرد؟

**بله** — فقط یک بخش: خطِ `ADD COLUMN IF NOT EXISTS depth_concentration numeric` با دو خطِ `bid_depth_concentration`/`ask_depth_concentration` جایگزین شد. **بدونِ حذفِ هیچ ستونِ قدیمی**، **بدونِ حذفِ هیچ داده‌یِ تاریخی** (چون صفر ردیف وجود دارد)، **بدونِ اثر بر هیچ Allocation/Trade/Inventory**.

## ۵. Migration اجرا شده یا نه؟

**`MIGRATION EXECUTED = NO`** — دقیقاً طبقِ دستورِ صریحِ کاربر. فایل فقط آماده و اصلاح شده است.

---

## ۶. تعدادِ تست‌ها و نتیجه

`node --test scripts/stablecoin-market-data-collector-test.mjs` → **۱۰۸/۱۰۸ چک، PASS** (از ۲۷ چکِ Phase 2 به ۱۰۸ چک — ۶ بلاکِ جدید: A=Timestamp، Validationِ گسترده (بخشِ B، شاملِ NaN/Infinity/-Infinity/صفر/منفی برایِ Bid و Ask)، C=Depth Concentration، D=Snapshot Row کامل، E=Raw Data Integrity، F=Retry Timestamp).

---

## ۷. نتیجه‌یِ Build

`npm run build` (وب+ادمین) → **PASS**، بدونِ خطا (این Build اصلاً به فایل‌هایِ Collector ربطی ندارد، فقط برایِ اطمینانِ کامل اجرا شد).

## ۸. نتیجه‌یِ TypeScript

`npx tsc --noEmit --strict` رویِ فایلِ اصلاح‌شده → **PASS**.

## ۹. نتیجه‌یِ Diff Check

`git diff --check` (رویِ ۳ فایل، موقتاً Stage و بلافاصله Unstage شده — بدونِ Commit) → **PASS** (فقط هشدارهایِ بی‌ضررِ LF→CRLF).

## ۱۰. نتیجه‌یِ Live Dry-Run

Bundleِ محلی (esbuild، بدونِ نیاز به Session/Credential/DB) رویِ داده‌یِ **واقعیِ زنده‌یِ Binance** اجرا شد:

```
Distinct captured_at values: 6 out of 6 pairs   ← اثباتِ مستقیمِ رفعِ ایرادِ الف
FDUSDUSDT: bidConc=0.389, askConc=0.0496        ← اثباتِ مستقیمِ رفعِ ایرادِ ج
```

هیچ DB Write، هیچ Order، هیچ Credentialی درگیر نشد.

---

## ۱۱. بررسیِ Binance Host (فقط بررسی، بدونِ تغییرِ معماری)

`exchangeInfo`/`tradeFee` رویِ `api.binance.com` هستند چون این دو Endpoint رویِ Mirrorِ عمومی (`data-api.binance.vision`) ارائه نمی‌شوند؛ `depth` رویِ همان Mirror است چون بسیار پرتکرارتر فراخوانی می‌شود و دقیقاً همان دلیلِ از‌قبل‌مستندشده‌یِ خودِ `api/stablecoin-engine.ts` است (کامنتِ خودِ آن فایل). هر دو Host آینه‌یِ **همان** موتورِ تطبیقِ Binance هستند (طبقِ مستنداتِ خودِ Binance، Mirror یک کپیِ تأخیردار نیست). **نتیجه: هیچ مشکلی برایِ Dataset ایجاد نمی‌کند؛ هیچ شاهدی از واگرایی یافت نشد؛ معماریِ فعلی بدونِ تغییر باقی می‌ماند** — دقیقاً طبقِ دستورِ کاربر.

---

## ۱۲. نتیجه‌یِ Isolation (بازبینیِ کامل بعدِ اصلاحات)

تستِ ۲۲ (بدونِ تغییر در هدف، فقط دوباره اجرا شد) هنوز تأیید می‌کند: **صفر** ارجاعِ اجرایی به `stablecoin_pair_allocations`, `stablecoin_allocation_assets`, `stablecoin_demo_inventory`, `stablecoin_demo_trades`, `stablecoin_cycle_decisions`, `stablecoin_profit_withdrawals`؛ **صفر** فراخوانیِ `decideStablecoinTrade`/`classifyStablecoinExecutability`/`runAllocationCycle`/`simulateStablecoinTrade`/`recordRejectedOpportunity`/`persistCycleDecisions`/`runStablecoinDemoCycle`/RPCهایِ Allocation؛ **صفر** ارجاع به `/api/v3/order`.

---

## ۱۳. چه چیزهایی عمداً تغییر نکردند

- `api/stablecoin-engine.ts` — کاملاً دست‌نخورده.
- منطقِ Fee Observation — بدونِ تغییرِ رفتار (فقط کامنتِ توضیحیِ قوی‌تر اضافه شد که `fee_bps` مالِ یک حسابِ خاص است، نه نرخِ عمومیِ Binance).
- معماریِ دو-Hostِ Binance — بدونِ تغییر (بخشِ ۱۱).
- تصمیمِ Phase 1 («هم Derived، هم Raw Top-20») — بدونِ تغییر، هر دو همچنان ذخیره می‌شوند.
- Scheduler، VPS Jobs، Real Trading، Demo Trading، UI، Capacity/Inventory/Profit/ROI Logic — هیچ‌کدام لمس نشدند.

---

## ۱۴. آیا Collector آماده‌یِ فازِ بعدی است؟

**از نظرِ Correctness: بله، اکنون قوی‌تر از Phase 2.** سه ایرادِ واقعی رفع شدند، هرکدام با تستِ اختصاصی و یک اثباتِ زنده. Isolation دوباره تأیید شد. هنوز دو پیش‌نیازِ عملیاتی باقی است (بدونِ تغییر نسبت به گزارشِ Phase 2): (۱) اجرایِ Migration، (۲) Commit/Push/Deploy — هردو عمداً و صراحتاً خارج از محدوده‌یِ همین مرحله.

## ۱۵. هر ابهامِ باقی‌مانده

هیچ ابهامِ فنیِ جدیدی از این اصلاحات به‌وجود نیامد. ابهام‌هایِ بازِ Phase 2 (اجرایِ Migration، Commit/Push، فعال‌سازیِ Timerِ VPS) بدونِ تغییر باقی می‌مانند و منتظرِ تصمیمِ جداگانه‌یِ کاربرند.

---

## Production Safety

Zero database writes, zero migrations executed, zero Allocations/Trades/Inventory touched, zero scheduler changes, zero Binance orders, zero commits, zero pushes, zero deploys. `signal0verse/signalverse-main` remains at commit `c497c6b`, unchanged. Only the same 3 Phase 2 files (still entirely local/untracked) were edited.

---

## FINAL STATUS TABLE

```
BUGS FOUND: 3 (batch-shared captured_at; Infinity-tolerant price validation; bid-only depth concentration)
BUGS FIXED: 3/3, each with a dedicated test AND a live-data proof
FILES CHANGED: exactly the 3 Phase 2 files (api/stablecoin-market-data-collector.ts,
  migrations/stablecoin_pair_snapshots_market_data_collector.sql, scripts/stablecoin-market-data-collector-test.mjs)
TRADING ENGINE FILES TOUCHED: 0 (api/stablecoin-engine.ts, src/app/App.tsx confirmed unchanged)
MIGRATION CHANGED: YES (depth_concentration -> bid_depth_concentration + ask_depth_concentration, additive,
  no existing column dropped, zero historical rows affected since the table still has zero rows)
MIGRATION EXECUTED: NO
TEST COUNT: 27 -> 108 checks, all PASS
BUILD: PASS
TYPESCRIPT: PASS (strict)
GIT DIFF CHECK: PASS
LIVE DRY-RUN: PASS - 6/6 pairs, genuinely distinct per-pair captured_at values, genuinely independent
  bid/ask depth concentration values, zero DB writes, zero credentials used
BINANCE HOST INVESTIGATION: NO BUG FOUND - architecture unchanged, as instructed
ISOLATION FROM TRADING LOGIC: RE-CONFIRMED (0 forbidden table/function references)
CAPACITY/INVENTORY/PROFIT/ROI/DECISION LOGIC: UNCHANGED
REAL TRADING: NOT ENABLED
SCHEDULER: UNTOUCHED, NO NEW TIMER CREATED
CODE COMMITTED: NO
CODE PUSHED: NO
PRODUCTION DEPLOYED: NO
REMAINING OPEN ITEMS: unchanged from Phase 2 - migration execution approval, commit/push/deploy approval, and
  future VPS timer wiring all remain separate, explicit decisions for the user
```
