# Stablecoin Engine — Read-Only Data Collection Plan for Future Risk-Threshold Calibration (Design Only, No Collector Activated)

## Metadata

- Date: 2026-09-16 (session continued)
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine — Allocation architecture)
- Mode: **Pure design/architecture audit.** No collector is activated, no schema is migrated, no Decision Logic is touched, no Threshold is applied to Production. This report is the blueprint a future, separately-approved implementation phase would follow — nothing here is live.
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e
- Ending commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e (**unchanged**)
- References (all reaffirmed unchanged): the three prior architecture reports (`0802`, `0959`) and the calibration report (`1021`) from earlier today.

## Objective

Design, in full and unambiguous detail, a Read-Only market-data collection system whose sole purpose is to accumulate the historical evidence the `1021` calibration report found missing (Depth Change distribution, Momentum with a real signal, Composite/News Risk weights) — without writing a single line of the collector itself, without touching Decision Logic, and without applying any new threshold anywhere.

---

## ۱ — وضعیتِ فعلیِ Data Availability (بازبینی، بدونِ فراخوانیِ جدید)

| داده | امروز در دسترسِ Engine است؟ | ماندگار (تاریخی) است؟ |
|---|---|---|
| دفترِ سفارشِ زنده (`getOrderBookQuote`) | بله، فقط برایِ لحظه‌یِ همان چرخه | **خیر — Binance هیچ تاریخچه‌ای از Order Book نمی‌دهد؛ اگر ثبت نشود، برایِ همیشه از دست می‌رود** |
| کارمزدِ زنده (`verifyPairFeeLive`) | بله | خیر (اما `stablecoin_fee_verifications` از قبل شواهد را Cache می‌کند) |
| Kline/قیمتِ تاریخی | **امروز اصلاً فراخوانی نمی‌شود** | بله — **Binance خودش تاریخچه‌یِ Kline را نامحدود نگه می‌دارد** — نیازی به ذخیره‌یِ موازیِ آن در پروژه نیست (بخشِ ۴) |
| `stablecoin_pair_snapshots` | جدول موجود، **صفر ردیف** (تأییدشده در گزارشِ قبلی) | طراحی‌شده برایِ این منظور، هرگز متصل نشده |
| خبر/رویداد | هیچ اتصالی به این موتور ندارد | `api/news.ts` خامِ نمادمحور موجود است (بدونِ طبقه‌بندیِ شدت/اعتبار) |

**نتیجه‌یِ صریح:** تنها داده‌ای که واقعاً «در معرضِ ازدست‌رفتنِ دائمی» است، **دفترِ سفارش** است (چون Binance تاریخچه‌اش را نگه نمی‌دارد). Klineِ قیمت را می‌توان **هر زمان در آینده، به‌صورتِ عقب‌گرد**، مستقیماً از Binance گرفت — نیازی به ذخیره‌یِ پیشاپیشِ آن در Snapshotِ ما نیست (این خودش حجمِ داده و پیچیدگی را به‌طورِ قابلِ‌توجهی کاهش می‌دهد — بخشِ ۴).

---

## ۲ — Data Collection Plan (خلاصه‌یِ معماری)

```
هر ۶۰ ثانیه (پیشنهاد؛ توجیه در بخشِ Cadence):
  برایِ هر جفتِ واجدِ شرایط (Dynamic Discovery، همان لیستِ زنده‌یِ Engine):
    ۱. یک فراخوانیِ Depth (همان Endpointِ Read-Only که Engine خودش هم استفاده می‌کند)
    ۲. محاسبه‌یِ Featureهایِ مشتق‌شده (Depth/Imbalance/Executable Liquidity/Deviation)
    ۳. یک ردیف در stablecoin_pair_snapshots (طرحِ جدید، بخشِ ۳) درج می‌شود
  (Klineِ تاریخی جداگانه، فقط در لحظه‌یِ Calibration، مستقیماً از Binance گرفته می‌شود - بخشِ ۴)
```

این یک **Collectorِ کاملاً مستقل** از `runAllocationCycle`/`decideStablecoinTrade` است — هیچ تصمیمی نمی‌گیرد، هیچ Threshold اعمال نمی‌کند، فقط می‌نویسد.

---

## ۳ — Snapshot Schema پیشنهادی (طراحی، بدونِ Migration)

جدولِ فعلیِ `stablecoin_pair_snapshots` (`pair, bid, ask, fee_verified, liquidity_usd, captured_at`) برایِ این هدف **ناکافی** است. طرحِ پیشنهادی (فقط طراحی؛ می‌تواند بعداً همین جدول را — که صفر ردیف دارد — به‌صورتِ یک Migrationِ additive گسترش دهد، یا جایگزینِ آن شود):

```
stablecoin_pair_snapshots (نسخه‌یِ ۲، پیشنهادی):
  id, pair, captured_at, symbol_status,
  best_bid, best_ask, mid_price, spread_bps,
  best_bid_qty, best_ask_qty,
  bid_depth_5, ask_depth_5, bid_depth_20, ask_depth_20,
  imbalance_5, imbalance_20, depth_concentration,
  -- Executable Liquidity در چند اندازه‌یِ نمونه (نه فقط یک عدد):
  exec_buy_1000, exec_buy_2500, exec_buy_5000, exec_buy_10000,
  exec_sell_1000, exec_sell_2500, exec_sell_5000, exec_sell_10000,
  exec_buy_5000_fully_filled (bool), exec_sell_5000_fully_filled (bool), ... (مشابه برایِ سایرِ اندازه‌ها)
  deviation_bps (از رویِ mid_price نسبت به $1),
  fee_verified (bool), fee_bps,
  raw_top20_levels (jsonb، اختیاری — بخشِ ۱۴)
```

**عمداً حذف‌شده از این جدول:** هیچ ستونِ Momentum/Volatility/Trend اینجا ذخیره نمی‌شود — این‌ها در لحظه‌یِ Calibration از رویِ Klineِ تاریخیِ خودِ Binance محاسبه می‌شوند (بخشِ ۴)، نه در هر Snapshot تکرار.

---

## ۴ — Kline/Technical History — چرا نیازی به ذخیره‌یِ پیشاپیش نیست

Binance تاریخچه‌یِ Klineِ ۱، ۵، ۱۵، ۳۰ دقیقه‌ای را **نامحدود و همیشه در دسترس** نگه می‌دارد (برخلافِ Order Book). بنابراین:

- **در لحظه‌یِ Snapshot:** هیچ Klineی ذخیره نمی‌شود — فقط `captured_at` (timestamp) دقیق ثبت می‌شود.
- **در لحظه‌یِ Calibration (آینده):** برایِ هر بازه‌یِ زمانیِ موردِ بررسی، Klineهایِ همان بازه مستقیماً و تازه از Binance گرفته می‌شوند و با Snapshotهایِ Order Bookِ همان بازه (بر اساسِ `captured_at`) Join می‌شوند.

**مزیت:** حجمِ داده به‌طورِ چشمگیری کمتر می‌شود (بخشِ ۷)، و هیچ خطرِ «داده‌یِ Klineِ منسوخ/فراموش‌شده» وجود ندارد — همیشه از منبعِ اصلی (Binance) تازه گرفته می‌شود.

---

## ۵ — Cadence پیشنهادی: هر ۶۰ ثانیه (با توجیه)

| گزینه | نرخِ تفکیک | هزینه (Binance + DB) | مناسب برایِ |
|---|---|---|---|
| ۳۰ ثانیه | بالاتر | هنوز ناچیز (بخشِ ۷) | تحقیقِ متمرکز و کوتاه‌مدت رویِ رفتارِ خیلی‌سریعِ Depth (اختیاری، نه پیش‌فرض) |
| **۶۰ ثانیه (پیشنهادِ اصلی)** | کافی برایِ تشخیصِ تغییرِ Depth در بازه‌یِ ۱-۵ دقیقه (۵ نمونه در ۵ دقیقه) | بسیار کم | Collectorِ دائمیِ پیش‌فرض |
| ۵ دقیقه | کم | حداقل | فقط اگر حجم/نرخِ محدودیت مسئله شود (که طبقِ بخشِ ۷ نیست) |

**دلیل: در گزارشِ کالیبراسیونِ امروز، یک تغییرِ واقعیِ ۱۷٪ در Depthِ USDCUSDT دقیقاً در یک بازه‌یِ ۷۵ثانیه‌ای مشاهده شد.** برایِ اینکه بتوانیم چنین تغییراتی را به‌طورِ قابلِ‌اعتماد اندازه‌گیری کنیم (نه فقط یک نمونه‌یِ تصادفی)، Cadenceِ Collector باید **کوتاه‌تر از پنجره‌یِ زمانیِ موردِ علاقه** باشد — ۶۰ ثانیه دقیقاً این را می‌دهد (۵ نمونه در پنجره‌یِ ۵ دقیقه‌ای، کافی برایِ محاسبه‌یِ یک Rate-of-Changeِ معنادار، نه یک مقایسه‌یِ تک‌نمونه‌ای مثلِ گزارشِ قبلی).

نرخِ فراخوانیِ Binance با این Cadence: `۶ جفت ÷ ۶۰ثانیه = ۰.۱ درخواست/ثانیه` — کاملاً ناچیز در برابرِ محدودیتِ نرخِ Public Endpointهایِ Binance.

---

## ۶ — Per-Pair Baseline Plan

هیچ Mean/Std/Threshold مشترک بینِ جفت‌ها استفاده نمی‌شود (طبقِ اثباتِ گزارشِ قبلی — تفاوتِ ساختاریِ FDUSD). برایِ **هر جفت جداگانه** (`USDCUSDT`, `FDUSDUSDT`, `FDUSDUSDC`, `TUSDUSDT`, `USD1USDT`, `USD1USDC`، به‌علاوه‌یِ هر جفتِ جدیدِ کشف‌شده در آینده)، این Baselineها از رویِ Snapshotهایِ جمع‌آوری‌شده محاسبه می‌شوند:

```
mean_deviation_bps, std_deviation_bps, normal_range (mean ± 2σ),
volatility_baseline (std در بازه‌هایِ غلطان),
normal_spread_bps, normal_executable_depth (میانگینِ exec_buy/sell در چند اندازه),
normal_imbalance (mean ± std)، normal_depth_concentration
```

این محاسبه یک **Batch Job در لحظه‌یِ Calibration** است (بخشِ ۹) — نه چیزی که در لحظه‌یِ نوشتنِ هر Snapshot محاسبه/به‌روزرسانی شود.

---

## ۷ — Data Volume / Retention (برآوردِ عددی)

فرض: ۶۰ثانیه Cadence، ۶ جفت. هر ردیفِ Featureِ مشتق‌شده (بدونِ `raw_top20_levels`) ≈ ~۵۰۰ بایت (شاملِ Overheadِ ایندکس). با `raw_top20_levels` (JSONB، ۲۰ سطح × ۲ طرف) ≈ ~۱.۵-۲ کیلوبایت.

| بازه | تعدادِ ردیف | حجمِ فقط-Feature | حجمِ Feature+Raw۲۰سطح |
|---|---|---|---|
| ۱ روز | ۸,۶۴۰ | ~۴ MB | ~۱۵ MB |
| ۱ هفته | ۶۰,۴۸۰ | ~۳۰ MB | ~۱۰۰ MB |
| ۲ هفته | ۱۲۰,۹۶۰ | ~۶۰ MB | ~۲۰۰ MB |
| ۴ هفته | ۲۴۱,۹۲۰ | ~۱۲۰ MB | ~۴۰۰ MB |

**نتیجه‌یِ صریح: حجمِ داده، حتیٰ با گزینه‌یِ گران‌تر (ذخیره‌یِ خامِ ۲۰ سطح)، برایِ چند ماه کاملاً ناچیز است.** محدودیتِ واقعی، حجمِ دیتابیس نیست — کیفیتِ طراحیِ Schema و Cadence است.

---

## ۸ — مدتِ جمع‌آوریِ لازم

| بازه | چه چیزی را پوشش می‌دهد | محدودیت |
|---|---|---|
| ۱ هفته | ریتمِ روزانه/هفتگی، احتمالاً ۱-۲ رویدادِ کوچک | **ناکافی** برایِ Std/Normal Rangeِ قابلِ‌اعتماد؛ تقریباً قطعاً هیچ رویدادِ نادرِ بزرگ را نمی‌بیند |
| ۲ هفته | Baselineِ کمی پایدارتر | همچنان بعیدِ دیدنِ رویدادِ نادر |
| **۴ هفته (حداقلِ پیشنهادی برایِ اولین Checkpoint)** | Baselineِ قابلِ‌دفاع برایِ نواحیِ Normal/Elevated | **حتیٰ ۴ هفته هم برایِ ناحیه‌یِ Critical/Shock کافی نیست** — رویدادهایِ واقعیِ Depeg نادرند (طبقِ خودِ رویدادِ TUSD که در ۴۸ ساعتِ اتفاقی پیدا شد، چنین رویدادهایی می‌توانند رخ دهند، اما فراوانی‌شان برایِ آماردهیِ قابلِ‌اعتماد در یک بازه‌یِ کوتاه کافی نیست) |

**توصیه:** جمع‌آوری باید **مستمر و همیشگی** باشد (نه یک‌بار و متوقف)؛ ۴ هفته فقط اولین Checkpoint برایِ کالیبراسیونِ اولیه است، و نواحیِ Critical همیشه بیشتر به رویدادهایِ شناخته‌شده‌یِ صنعت (مثلِ UST/LUNA، یا همان رویدادِ TUSDِ کشف‌شده) متکی می‌مانند تا صرفاً به دیتاستِ خودمان.

---

## ۹ — روشِ Calibration بعد از جمع‌آوری (بدونِ اعمالِ فوری)

برایِ هر متریک، یک اسکریپتِ Read-Only (که فقط از جدولِ Snapshot و Klineِ تازه‌واکشی‌شده می‌خواند، هرگز چیزی نمی‌نویسد):

```
۱. واکشیِ همه‌یِ Snapshotهایِ یک Pair در بازه‌یِ کالیبراسیون
۲. محاسبه‌یِ Baseline (بخشِ ۶) از رویِ آن
۳. محاسبه‌یِ percentileهای واقعی (p50, p90, p95, p99) برایِ هر متریک
۴. مقایسه با نمونه‌هایِ شناخته‌شده‌یِ رویدادِ واقعی (مثلِ TUSD) اگر در بازه رخ داده باشد
۵. تولیدِ یک گزارشِ پیشنهادیِ Threshold (دقیقاً همان جدولِ Metric/Normal/Elevated/Critical/Evidence/Confidence گزارشِ ۱۰:۲۱) — نه اعمالِ خودکار
```

**هیچ Thresholdی در این مرحله در Production اعمال نمی‌شود** — خروجی فقط یک گزارشِ پیشنهادی است، دقیقاً مثلِ همین گزارش‌هایِ امروز، منتظرِ تأییدِ صریحِ کاربر.

---

## ۱۰ — Order Book History (محاسبه از چند Snapshotِ متوالی)

طبقِ تأکیدِ صریحِ کاربر: **هیچ‌کدام از این‌ها از یک Snapshotِ منفرد محاسبه نمی‌شوند** — همیشه Snapshotِ فعلی در برابرِ N نمونه‌یِ قبلی (پنجره‌یِ پیشنهادی: ۳ تا ۵ نمونه‌یِ اخیر = ۳ تا ۵ دقیقه):

```
Depth Change (٪)         = (depth_now - depth_(t-k)) / depth_(t-k)
Bid/Ask Depth Change      = همان، جداگانه برایِ هر طرف
Imbalance Change          = imbalance_now - imbalance_(t-k)
VWAP Change               = تغییرِ VWAPِ اجراپذیر بینِ دو Snapshot
Executable Liquidity Change = تغییرِ exec_buy/sell بینِ دو Snapshot
Liquidity Deterioration    = یک روندِ **پیوسته و یک‌جهته‌یِ کاهشی** در چند Snapshotِ متوالی (نه یک افتِ تکی) — این دقیقاً تمایزِ «نویزِ طبیعی» (مشاهده‌شده در USDCUSDT) از «الگویِ واقعیِ تخلیه‌یِ دفتر» است
```

---

## ۱۱ — News Data Plan (فقط طراحی، بدونِ Decision Logic)

جدولِ جدیدِ پیشنهادی (طراحی، بدونِ Migration): `stablecoin_news_events`:

```
id, asset (نه pair — خبر معمولاً مربوط به یک دارایی است، نه یک جفتِ خاص),
event_type, severity (۰-۱ یا سطح‌بندیِ گسسته), credibility (۰-۱ یا سطح‌بندی),
source, published_at, captured_at, confirmation_count, raw_headline, raw_url
```

**Joinِ زمانی با Market Snapshot:** برایِ هر Snapshotِ بازار، «آخرین رویدادِ خبریِ **تا همان لحظه** (نه بعدِ آن)» جفت می‌شود — دقیقاً یک Point-in-Time Join، هرگز رو‌به‌جلو (این جلویِ Lookahead Bias را می‌گیرد، نکته‌یِ حیاتیِ Data Integrity، بخشِ ۱۲). این مرحله **فقط داده را برایِ Calibration آماده می‌کند** — هیچ تصمیمِ معامله‌ای از رویِ آن گرفته نمی‌شود، دقیقاً طبقِ تأکیدِ صریحِ کاربر.

---

## ۱۲ — Data Integrity Rules

| بررسی | قانون |
|---|---|
| Timestamp Ordering | هر Snapshot باید `captured_at` بزرگ‌تر از آخرین Snapshotِ همان Pair داشته باشد؛ در غیرِاین‌صورت رد شود (نه ذخیره با ترتیبِ اشتباه) |
| Duplicate Snapshot | یک Unique Index رویِ `(pair, captured_at)` از تکرار جلوگیری می‌کند |
| Missing Snapshot | یک شکاف (Gap) در توالیِ زمانی باید **صراحتاً قابلِ‌تشخیص** باشد (نه یک مقدارِ درون‌یابی‌شده/جعلی) — Calibration باید بتواند این شکاف‌ها را ببیند و دورشان بزند |
| Stale Order Book / Kline | اگر پاسخِ Binance قدیمی‌تر از یک آستانه‌یِ منطقی باشد (مثلاً Timestampِ خودِ پاسخ)، آن Snapshot با یک پرچمِ `stale=true` ذخیره شود، نه نادیده گرفته شود بی‌صدا |
| Invalid Price / Zero-Negative Depth | هرگونه قیمت/عمقِ نامعتبر → آن Snapshot **کاملاً حذف** می‌شود (نه جایگزینیِ آن با صفر یا میانگین) |
| Inconsistent Bid/Ask (bid ≥ ask) | Snapshot رد می‌شود، با لاگِ خطا |
| Incomplete Order Book | اگر تعدادِ سطوحِ برگشتی کمتر از حداقلِ لازم برایِ محاسبه‌یِ Executable Liquidityِ بزرگ‌ترین اندازه باشد، آن اندازه‌هایِ خاص `null` ثبت شوند (نه یک عددِ حدسی) |
| Binance API Failure | Retry با Backoff محدود؛ اگر باز هم شکست خورد، آن دوره صرفاً **بدونِ Snapshot** رد می‌شود — هرگز یک Snapshotِ جعلی/میانگین‌گیری‌شده جایگزین نمی‌شود |

**اصلِ کلی، عیناً طبقِ دستورِ کاربر: اگر داده ناقص است، Dataset باید همین را صادقانه نشان دهد — هرگز یک عددِ جعلی تولید نکند.**

---

## ۱۳ — Replay/Backtest Readiness

```
Historical Snapshot (از جدولِ بخشِ ۳)
  + Kline تازه‌واکشی‌شده از Binance برایِ همان بازه (بخشِ ۴)
  + News Event نزدیک‌ترین (Point-in-Time Join، بخشِ ۱۱)
→ محاسبه‌یِ Risk Featureهایِ همان لحظه (دقیقاً همان فرمول‌هایی که Engineِ زنده در آینده استفاده خواهد کرد)
→ محاسبه‌یِ Risk Score با هر مجموعه Threshold/Weightِ فرضی (بدونِ اعمال در Production)
→ مقایسه‌یِ Decisionِ فرضی با آنچه واقعاً رخ داده (اگر آن لحظه یک تصمیمِ واقعی هم ثبت شده باشد)
```

**نکته‌یِ کلیدی:** این معماری اجازه می‌دهد بارها و بارها، با Threshold/Weightهایِ مختلف، رویِ **همان** داده‌یِ تاریخی Replay انجام شود — بدونِ فراخوانیِ دوباره‌یِ Binance (چون Order Book تاریخی همان‌جا ذخیره شده) و بدونِ لمسِ Production.

---

## ۱۴ — Raw Order Book در برابرِ Derived Features (مقایسه‌یِ صریح)

| گزینه | مزیت | عیب |
|---|---|---|
| **فقط Derived Features** | حجمِ کمتر، پرس‌وجویِ سریع‌تر، Schemaِ ساده‌تر | اگر بعداً یک Featureِ جدید لازم شد که پیش‌بینی نشده بود (مثلاً عمقِ سطحِ ۱۰ به‌جایِ ۵/۲۰)، **قابلِ بازسازی نیست** — باید از نو جمع‌آوری کرد |
| **Derived + Rawِ ۲۰سطحِ اول (JSONB)** | همان مزیتِ بالا، **به‌علاوه‌یِ** توانِ بازمحاسبه‌یِ هر Featureِ جدید بعداً، بدونِ نیازِ به جمع‌آوریِ دوباره | حجمِ ~۳-۴ برابر (هنوز طبقِ بخشِ ۷ ناچیز) |

**پیشنهاد برایِ SignalVerse: گزینه‌یِ دوم (Derived + Raw۲۰سطح).** با توجه به اینکه حجمِ اضافه‌شده (بخشِ ۷) عملاً بی‌اهمیت است، و این پروژه دقیقاً در مرحله‌ای است که **هنوز مطمئن نیستیم کدام Feature نهایی خواهد بود** (طبقِ خودِ این گزارش‌هایِ متعددِ کالیبراسیون)، توانِ بازمحاسبه ارزشِ بسیار بیشتری از صرفه‌جوییِ چند صد مگابایت دارد.

---

## ۱۵ — Final Recommendation: نقشه‌یِ راهِ ۶فازی

| فاز | چه چیزی مجاز است | چه چیزی ممنوع است |
|---|---|---|
| **۱ — طراحیِ جمع‌آوریِ داده (همین گزارش)** | فقط سند/معماری | هرگونه کد/Migration/Collector |
| **۲ — پیاده‌سازیِ Collectorِ Read-Only** | نوشتنِ کدِ Collector (جدا از Engine)، Migrationِ Schemaِ Snapshot (additive) | هرگونه اتصال به `decideStablecoinTrade`، هرگونه Threshold، هرگونه معامله |
| **۳ — اعتبارسنجیِ کیفیتِ داده** | اجرایِ Collector در Production **فقط برایِ نوشتن**، بررسیِ قوانینِ بخشِ ۱۲ رویِ داده‌یِ واقعیِ جمع‌آوری‌شده | هرگونه استفاده از این داده در تصمیمِ معامله |
| **۴ — Calibration** | تحلیلِ Read-Only رویِ داده‌یِ جمع‌آوری‌شده (بخشِ ۹)، تولیدِ گزارشِ Thresholdِ پیشنهادی | اعمالِ خودکارِ هر Thresholdی در کد |
| **۵ — Replay تاریخی** | اجرایِ Risk Engineِ فرضی رویِ داده‌یِ تاریخی (بخشِ ۱۳)، بدونِ فراخوانیِ Binanceِ زنده | هرگونه اثر رویِ Production |
| **۶ — فعال‌سازیِ Risk Engine** | فقط پس از تأییدِ صریحِ کاربر رویِ Thresholdهایِ نهایی؛ Risk Engine به‌عنوانِ **Reviewer/Guard** داخلِ همان `decideStablecoinTrade`ی مشترکِ Demo/Real اضافه می‌شود (نه یک مسیرِ جدا) | جایگزینیِ Decision Engineِ اصلی؛ هرگونه رفتارِ متفاوت بینِ Demo و Real |

هر فاز نیازمندِ **تأییدِ جداگانه‌یِ کاربر** پیش از شروع است — این گزارش فقط فازِ ۱ را تمام می‌کند.

---

## ریسک‌ها و ابهام‌هایِ باقی‌مانده

۱. آیا `raw_top20_levels` (JSONB) از همینِ فازِ ۲ فعال شود، یا با یک نسخه‌یِ ساده‌ترِ Derived-Only شروع و بعداً گسترش یابد؟
۲. آیا Collector باید رویِ همان سرویسِ VPSِ اصلی اجرا شود یا یک Jobِ کاملاً مجزا (برایِ تضمینِ صفر تداخل با Scheduler موجود)؟
۳. منبعِ نهاییِ خبر (`api/news.ts`یِ موجود در برابرِ سرویسِ اختصاصی) هنوز تعیین نشده (از گزارشِ قبلی نیز باز مانده).
۴. آیا فازِ ۲ (Collectorِ Read-Only) هم‌اکنون تأیید می‌شود، یا این گزارش فقط برایِ بررسیِ طراحی است و تصمیمِ فازِ بعدی جداگانه گرفته خواهد شد؟

## پیشنهادِ نهایی: آیا آماده‌یِ رفتن به مرحله‌یِ Collector هستیم؟

**بله، از نظرِ طراحی آماده‌ایم** — هیچ ابهامِ معماریِ حل‌نشده‌ای باقی نمانده که مانعِ شروعِ فازِ ۲ شود؛ Schema، Cadence، قوانینِ Integrity، و مرزهایِ Production Safety همگی مشخص و مستند هستند. **اما شروعِ فازِ ۲ نیازمندِ یک تأییدِ صریحِ جداگانه است** — این گزارش خودش هیچ Collectorی فعال نمی‌کند.

---

## Production Safety

Zero code changes, zero migrations, zero database writes, zero collector activated, zero Decision Logic touched, zero threshold applied, zero Allocations touched, zero trades, zero scheduler changes, zero Binance orders, zero commits, zero pushes, zero deploys. `signal0verse/signalverse-main` remains at commit `c497c6b`, unchanged.

---

## FINAL STATUS TABLE

```
DATA AVAILABILITY AUDIT: DONE - only Order Book history is genuinely perishable; Kline history is retained
  indefinitely by Binance itself and need not be duplicated in our own storage
SNAPSHOT SCHEMA (v2, DESIGN ONLY): proposed, ~28 scalar columns + optional raw top-20-level JSONB
CADENCE RECOMMENDATION: 60 seconds, justified directly by the real 75s/17% depth-change observation in the
  1021 report - fine enough resolution, negligible Binance/DB cost
VOLUME ESTIMATE: ~30MB/week (features-only) to ~100MB/week (features+raw-20-levels) for all 6 pairs - storage
  is not a real constraint at any reasonable retention length
MINIMUM COLLECTION WINDOW: 4 weeks for a first Normal/Elevated calibration checkpoint; Critical/Shock zone
  confidence will remain lower indefinitely (rare-event problem) regardless of window length
PER-PAIR BASELINE: mandatory, no shared/global statistics across pairs (reaffirmed from the 1021 report)
KLINE STORAGE DECISION: NOT stored redundantly at snapshot time - fetched fresh from Binance at calibration
  time, keyed by captured_at, reducing both volume and staleness risk
NEWS PLAN: separate stablecoin_news_events table (design only), joined to market snapshots via a strict
  point-in-time (never-lookahead) join
RAW VS DERIVED STORAGE: recommend BOTH (derived scalars + raw top-20 JSONB) - re-computability is worth far
  more than the marginal storage cost given thresholds are still unsettled
6-PHASE ROADMAP: produced, with explicit allowed/forbidden actions per phase - this report completes only
  Phase 1
CODE CHANGED: NO
MIGRATION EXECUTED: NO
DATABASE WRITE: NO
COLLECTOR ACTIVATED: NO
DECISION LOGIC TOUCHED: NO
THRESHOLD APPLIED: NO
ALLOCATION CHANGED/STOPPED/CREATED/RESET: NO
TRADE CREATED: NO
SCHEDULER CHANGED: NO
BINANCE ORDER SENT: NO
CODE COMMITTED: NO
CODE PUSHED: NO
PRODUCTION DEPLOYED: NO
AWAITING: user approval to proceed to Phase 2 (Read-Only Collector implementation), plus resolution of the
  4 open items listed above
```
