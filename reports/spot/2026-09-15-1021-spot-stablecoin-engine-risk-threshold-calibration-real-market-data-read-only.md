# Stablecoin Engine — Risk Threshold Calibration Against Real Binance Market Data (Read-Only)

## Metadata

- Date: 2026-09-16 (session continued)
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine — Allocation architecture)
- Mode: **Read-only empirical calibration** — real, live public Binance market data (`api.binance.com`/`data-api.binance.vision`, keyless, the exact same endpoints `api/stablecoin-engine.ts` itself already calls) was fetched for this task only to derive evidence-based threshold ranges. No Threshold is asserted without evidence; where evidence is thin, this report says `INSUFFICIENT_DATA_FOR_THRESHOLD` explicitly rather than guessing. Zero code changes, zero migrations, zero database writes, zero Allocation/trade/scheduler changes, zero Binance orders, zero commit/push/deploy in this task.
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e
- Ending commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e (**unchanged**)
- Reference (architecture, unchanged by this report): `reports/spot/2026-09-15-0959-...final-risk-aware-strategy-contract-read-only.md`

## Objective

Replace the illustrative/placeholder numbers in the previous architecture report with real, defensible ranges derived from actual Binance market data for every currently-eligible stablecoin/stablecoin pair, and honestly flag every metric where the available data is not sufficient to commit to a precise cutoff.

---

## ۱ — داده‌هایِ بررسی‌شده

**کشفِ Dynamic Discovery (زنده، همین امروز):** فراخوانیِ واقعیِ `exchangeInfo` (همان چیزی که `discoverStablecoinPairs` خودِ موتور فراخوانی می‌کند) دقیقاً همان ۶ جفتی را برگرداند که کاربر نام برده بود — هیچ جفتِ اضافه‌ای در حالِ حاضر واجدِ شرایط نیست:

```
["TUSDUSDT", "USDCUSDT", "FDUSDUSDT", "FDUSDUSDC", "USD1USDT", "USD1USDC"]
```

برایِ هرکدام، سه دسته داده‌یِ واقعی جمع‌آوری شد (همه Read-Only، همه Endpointِ Publicِ بدونِ کلید):
- **دفترِ سفارشِ زنده** (`/api/v3/depth`, `limit=100`) — یک بارِ اول، و یک بارِ دوم دقیقاً ۷۵ ثانیه بعد (برایِ مشاهده‌یِ واقعیِ نرخِ تغییرِ عمق).
- **Klineِ ۱ دقیقه‌ای، ۵۰۰ کندل (~۸.۳ ساعتِ اخیر)** — برایِ Deviation/Momentum/Volatilityِ کوتاه‌مدت.
- **Klineِ ۵ دقیقه‌ای، ۵۷۶ کندل (~۴۸ ساعتِ اخیر)** — برایِ بازه‌یِ طبیعیِ بلندمدت‌تر و رویدادهایِ نادر.

همچنین جدولِ `stablecoin_pair_snapshots` مستقیماً Read-Only بررسی شد.

---

## ۲ — کیفیت و کفایتِ داده (صادقانه)

| منبع | کفایت | توضیح |
|---|---|---|
| Klineِ قیمت (۸ ساعت و ۴۸ ساعت) | ✅ کافی برایِ Deviation/Volatility | داده‌یِ واقعی، تاریخی، مستقیماً از Binance |
| دفترِ سفارش (لحظه‌ای) | ✅ کافی برایِ Depth/Imbalance/Executable Liquidityِ **همین لحظه** | — |
| **تاریخچه‌یِ دفترِ سفارش (برایِ Depth Change واقعی در طولِ زمان)** | **❌ ناکافی** | Binance تاریخچه‌یِ Order Book ارائه نمی‌دهد؛ `stablecoin_pair_snapshots` (تنها منبعِ داخلیِ ممکن) **دقیقاً صفر ردیف دارد** (تأییدشده با کوئریِ مستقیم: `content-range: */0`) — هیچ Collectorیِ پیوسته تا امروز هرگز اجرا نشده |
| Momentum (محاسبه‌شده از Kline Close) | ⚠️ ضعیف/کم‌سیگنال برایِ این نوع جفت (بخشِ ۴) | مقادیر واقعی اما بسیار نزدیک به صفر |

**نتیجه‌گیریِ صریح:** هرجا این گزارش رنجِ عددی می‌دهد، آن رنج از رویِ داده‌یِ **واقعیِ همین امروز** است. هرجا داده کافی نبود (به‌ویژه Depth Change در طولِ زمان)، صراحتاً `INSUFFICIENT_DATA_FOR_THRESHOLD` اعلام می‌شود.

---

## ۳ — Baseline رفتارِ USDC/USDT (واقعی، همین لحظه)

| معیار | مقدار |
|---|---|
| Best Bid / Ask | `1.00027` / `1.00028` |
| Spread | `0.10 bps` |
| عمقِ ۵ سطحِ اول (Bid/Ask) | **$12,098,974 / $9,872,306** |
| عمقِ ۲۰ سطحِ اول | $42,747,072 / $13,090,941 |
| Imbalance (۵ سطح) | `0.101` (تقریباً متعادل) |
| Executable @ $5,000 و $10,000 | هر دو جهت، کاملاً پر می‌شود |
| Deviation (۸ ساعتِ اخیر، ۱دقیقه‌ای) | بینِ `0.80` تا `3.10 bps`، میانگین `1.88`، انحرافِ‌معیار `0.57` |
| Deviation (۴۸ ساعتِ اخیر، ۵دقیقه‌ای) | بینِ `-0.40` تا `3.70 bps`، میانگین `2.06`، انحرافِ‌معیار `0.96` |
| **نرخِ تغییرِ عمق (نمونه‌یِ واقعی، ۷۵ ثانیه)** | **Bid: +17.2%، Ask: -16.7%، Imbalance از `0.101` به `0.266`** |

**یافته‌یِ بسیار مهم:** حتی خودِ `USDC/USDT` — نمونه‌یِ اصلیِ «کم‌ریسک» کاربر — در یک بازه‌یِ فقط ۷۵ثانیه‌ای، **بیش از ۱۶٪ تغییرِ عمق** نشان داد. **این مدرکِ مستقیم است که یک آستانه‌یِ سخت‌گیرانه رویِ «درصدِ تغییرِ عمق» (مثلاً «هر افتِ ۱۰٪ = هشدار») حتی خودِ USDC/USDT را هم به‌اشتباه پرچم می‌زد** — دقیقاً همان خطری که کاربر صریحاً هشدار داد.

---

## ۴ — رفتارِ سایرِ استیبل‌کوین‌ها (واقعی)

| جفت | عمقِ ۵سطحی (Bid/Ask) | Imbalance | Spread | Deviation ۸ساعته (min/max/mean/std) | Deviation ۴۸ساعته (min/max) |
|---|---|---|---|---|---|
| USDCUSDT | $12.1M / $9.9M | 0.101 | 0.10bps | 0.80 / 3.10 / 1.88 / 0.57 | -0.40 / 3.70 |
| USD1USDT | $242K / $246K | -0.009 | 0.10bps | -2.10 / 0.00 / -1.16 / 0.49 | -2.20 / 1.70 |
| USD1USDC | $3.83M / $3.42M | 0.057 | 1.00bps | -4.00 / -2.00 / -3.03 / 0.54 | -4.00 / 1.00 |
| TUSDUSDT | $138K / $30K | **0.643** | 1.00bps | -5.00 / -3.00 / -4.62 / 0.49 | **-5.00 / +139.00** |
| FDUSDUSDT | $1.85M / $1.37M | 0.147 | 1.00bps | -13.00 / -11.00 / -12.56 / 0.53 | -13.00 / -6.00 |
| FDUSDUSDC | $636K / $903K | -0.173 | 1.00bps | -16.00 / -12.00 / -14.21 / 0.78 | -16.00 / -6.00 |

**سه یافته‌یِ کلیدی:**

۱. **عمق بینِ جفت‌ها تا ۱۰۰-۳۰۰ برابر فرق دارد** (USDCUSDT ≈ $12M در برابرِ TUSDUSDT ≈ $138K در سمتِ Bid) — تأییدِ مستقیمِ ضرورتِ Tiering (بخشِ ۸).

۲. **`FDUSD` به‌طورِ ساختاری و پایدار حدودِ ۱۲ تا ۱۶ بیسیس‌پوینت زیرِ $1 معامله می‌شود** — نه یک نوسانِ گذرا (هم در بازه‌یِ ۸ساعته، هم ۴۸ساعته، کاملاً سازگار). **این مستقیماً به سؤالِ کاربر در بخشِ ۳ پاسخ می‌دهد: آستانه باید Per-Stablecoin/Per-Pair باشد، نه Global.** یک آستانه‌یِ سراسریِ نزدیک به رفتارِ USDC (مثلاً «۵bps = غیرِعادی») به‌اشتباه رفتارِ کاملاً عادیِ FDUSD را دائماً «غیرِعادی» می‌دید.

۳. **`TUSDUSDT` یک رویدادِ واقعیِ +۱۳۹bps را در ۴۸ ساعتِ اخیر ثبت کرده** — این تنها نمونه‌یِ واقعیِ یک انحرافِ بزرگ در کلِ داده‌یِ جمع‌آوری‌شده و **مبنایِ اصلیِ کالیبراسیونِ ناحیه‌یِ «بحرانی»** در بخشِ ۵ می‌شود (نه یک عددِ حدسی).

---

## ۵ — کالیبراسیونِ Price Deviation

| ناحیه | رنج (بر اساسِ داده‌یِ واقعی) | شاهد |
|---|---|---|
| **Normal (پایه‌یِ Per-Pair)** | هر جفت حولِ میانگینِ خودش، در محدوده‌یِ `mean ± 2×std` (که برایِ همه‌یِ ۶ جفت، این یعنی زیرِ ~۱۶bps) | مستقیماً از میانگین/انحرافِ‌معیارِ واقعیِ هر ۶ جفت (بخشِ ۴) |
| **Elevated** | فراتر از `mean ± 2×std` تا ~۵۰bps | **درون‌یابی‌شده، شواهدِ مستقیم ندارد — Confidenceِ پایین** |
| **Critical/Shock** | فراتر از ~۱۰۰bps | لنگرگاهِ واقعی: رویدادِ +۱۳۹bpsِ TUSDUSDT (بخشِ ۴) |

**تصمیمِ صریح: `Per-Pair`، نه `Global`** — طبقِ شاهدِ بخشِ ۴ (تفاوتِ FDUSD).

---

## ۶ — کالیبراسیونِ Momentum / Rate of Change (یافته‌یِ صادقانه)

محاسبه‌یِ Momentum (تفاوتِ میانگینِ ۱۵ کندلِ اخیر با ۱۵ کندلِ قبل‌از‌آن، از رویِ Kline Close) برایِ **هر ۶ جفت، عملاً نزدیکِ صفر** بازگشت. بررسیِ داده‌یِ خام (نمونه: ۳۰ کلوزِ اخیرِ USDCUSDT) نشان داد:

```
1.00024, 1.00024, 1.00025, 1.00025, 1.00024, ... 1.00029, 1.00029
```

قیمت‌هایِ Close واقعاً حرکت می‌کنند، اما دامنه‌یِ حرکت در مقیاسِ **زیرِ نیم بیسیس‌پوینت در هر دقیقه** است — به‌قدری کوچک که یک محاسبه‌یِ Momentumِ ۱۵-در-برابرِ-۱۵ روی داده‌یِ فقط ۸ ساعته، عملاً چیزی برایِ تشخیص ندارد (سیگنال در نویز گم می‌شود).

**نتیجه:** `INSUFFICIENT_DATA_FOR_THRESHOLD` برایِ یک **آستانه‌یِ دقیقِ عددی**. آنچه واقعاً می‌توان گفت (کیفی، نه یک عددِ قطعی): «تحتِ شرایطِ عادی، Momentumِ کوتاه‌مدت برایِ این جفت‌ها در مرتبه‌یِ زیرِ ۰.۱bps در هر بازه‌یِ ۱۵ دقیقه است — پس حتی یک مقدارِ نسبتاً کوچکِ غیرِصفر (مثلاً ۱-۲bps) از نظرِ **نسبی** یک تغییرِ بزرگ محسوب می‌شود.» برایِ یک آستانه‌یِ قابلِ‌دفاع، به داده‌یِ Tickِ معاملاتی (نه فقط Kline Close) یا مشاهده‌یِ یک دوره‌یِ واقعاً پرنوسان نیاز است — که در این جلسه در دسترس نبود.

---

## ۷ — کالیبراسیونِ Volatility

انحرافِ‌معیارِ واقعیِ Deviation (۸ ساعته): بینِ `0.49bps` (TUSDUSDT) تا `0.96bps` معادلِ USDCUSDTِ ۴۸ساعته. همه‌یِ ۶ جفت، در بازه‌یِ عادیِ فعلیِ بازار، **زیرِ ۱ بیسیس‌پوینت انحرافِ‌معیار** دارند.

| ناحیه | رنج | Confidence |
|---|---|---|
| Normal | std زیرِ ~۱bps (دقیقاً محدوده‌یِ مشاهده‌شده در هر ۶ جفت) | بالا (مستقیماً از داده) |
| Elevated | std بینِ ۱ تا ۵bps | متوسط (درون‌یابی) |
| Critical | std فراتر از ۵bps (نزدیک به std واقعیِ ۴۸ساعته‌یِ TUSDUSDT=7.69، که خودش ناشی از همان رویدادِ ۱۳۹bpsی است) | بالا (لنگرگاهِ واقعی) |

---

## ۸ — کالیبراسیونِ Order Book

| معیار | رنجِ مشاهده‌شده (واقعی) |
|---|---|
| عمقِ ۵سطحی (کمترین تا بیشترین، بینِ ۶ جفت) | $30K (TUSD Ask) تا $12.1M (USDC Bid) |
| Bid/Ask Imbalance | `-0.173` تا `+0.643` |
| Executable @ $5,000/$10,000 | **۱۰۰٪ جفت‌ها، هر دو جهت، همین حالا کاملاً پر می‌شود** — هیچ‌کدام محدودیتِ نقدینگیِ اجراپذیر ندارند در این لحظه |

**نتیجه‌یِ مهم:** برایِ Opportunity Unitهایِ واقع‌بینانه (۱,۰۰۰ تا ۱۰,۰۰۰ دلار)، `Executable Liquidity` در حالِ حاضر **هرگز** محدودکننده نیست برایِ هیچ‌کدام از این ۶ جفت — این خودش شاهدِ تجربی برایِ سیاستِ «Liquidity-Maximalist نباش» است: سخت‌گیریِ اضافی رویِ نقدشوندگی، در عمل چیزی را که این جفت‌ها واقعاً دارند محدود نمی‌کند.

**Depth Change:** طبقِ بخشِ ۳، حتی یک تغییرِ ~۱۷٪ در ۷۵ ثانیه برایِ USDCUSDT مشاهده شد. **آستانه‌یِ دقیقِ عددی برایِ "کاهشِ غیرِعادیِ عمق" → `INSUFFICIENT_DATA_FOR_THRESHOLD`** (فقط یک نمونه‌یِ ۷۵ثانیه‌ای در دسترس بود، نه یک توزیعِ آماری). آنچه با اطمینان می‌توان گفت: **کاهش‌هایِ تا مرتبه‌یِ ۱۰-۲۰٪ در بازه‌هایِ کوتاه، به‌تنهایی، طبیعی‌اند و نباید Trip-Wire باشند.**

---

## ۹ — مدلِ Market Shock پیشنهادی (اصلاح‌شده طبقِ سؤالِ کاربر: آیا هر سه شرط لازم است؟)

با توجه به کمبودِ داده‌یِ تاریخیِ Depth (بخشِ ۲)، طراحیِ «هر سه شرط هم‌زمان» (گزارشِ قبلی) در عمل **به‌ندرت قابلِ ارزیابیِ کامل خواهد بود** (چون معیارِ سوم، Depth Change، هنوز کالیبره نشده). پیشنهادِ اصلاح‌شده — **دو مسیرِ مستقل**، دقیقاً طبقِ پیشنهادِ خودِ کاربر در بخشِ ۷ پیامش:

```
مسیرِ الف (مبتنی‌بر قیمت، مستقلِ از Depth):
    Deviationِ فراتر از ناحیه‌یِ Critical (بخشِ ۵، لنگرشده به ~۱۰۰bps+)
    ∧ جهت‌گیریِ رو‌به‌وخامت (نه Mean-Reverting)
    ⇒ Market Shock (بدونِ نیاز به تأییدِ Depth)

مسیرِ ب (مبتنی‌بر Depth، مستقلِ از شدتِ Deviation):
    سقوطِ بسیارشدیدِ Depth (فراتر از آنچه در بخشِ ۸ "طبیعی" شناخته شد — یعنی فراتر از، مثلاً، ۵۰٪+ در یک بازه‌یِ کوتاه؛ این عدد خودش هنوز نیازمندِ داده‌یِ بیشتر است)
    ∧ فشارِ فروشِ شدید (Imbalanceِ به‌شدت یک‌طرفه، فراتر از رنجِ مشاهده‌شده در بخشِ ۸)
    ⇒ Market Shock (حتی اگرِ Deviation هنوز به آستانه نرسیده)
```

این دقیقاً پاسخِ کاربر است: بله، هر شرط به‌تنهایی (اگر به‌قدرِ کافی شدید باشد) می‌تواند مستقل از دیگری Market Shock را فعال کند — نه یک AND سه‌گانه‌یِ سخت. **آستانه‌هایِ دقیقِ مسیرِ ب همچنان `INSUFFICIENT_DATA_FOR_THRESHOLD` هستند** (بخشِ ۱۴).

---

## ۱۰ — کالیبراسیونِ Stablecoin Risk Tier

عواملِ پیشنهادی برایِ تعیینِ Tier (طبقِ دستورِ کاربر، نه صرفاً اسمی):

| عامل | نقش |
|---|---|
| عمقِ بازار (میانگینِ عمقِ ۵-۲۰ سطحی) | معیارِ **واقعاً اندازه‌گیری‌شده** در این گزارش (بخشِ ۴) — قوی‌ترین سیگنالِ موجود |
| سابقه‌یِ Depeg/انحرافِ بزرگ | معیارِ **واقعاً مشاهده‌شده** (رویدادِ TUSDUSDT) |
| سن/سابقه‌یِ بازار | نیازمندِ داده‌یِ خارجی (مثلاً تاریخِ راه‌اندازی) — این جلسه بررسی نکرد |
| حجمِ معاملاتِ ۲۴ساعته | قابلِ‌استخراج از `ticker/24hr` (این جلسه واکشی نشد — پیشنهادِ افزودن) |
| مکانیزم (فیات‌پشتوانه/وثیقه‌یِ‌کریپتویی/الگوریتمی) | **فقط یکی از چند ورودی، هرگز به‌تنهایی** — طبقِ تأکیدِ صریحِ کاربر |

**بر اساسِ عمقِ واقعاً اندازه‌گیری‌شده (تنها معیارِ کاملاً کمّی‌شده‌یِ این جلسه):**

| Tier | جفت‌هایِ این‌جلسه | عمقِ ۵سطحیِ Bid (واقعی) |
|---|---|---|
| ۱ | USDCUSDT | $12.1M |
| ۲ | USD1USDC, FDUSDUSDT | $3.83M, $1.85M |
| ۳ | USD1USDT, FDUSDUSDC, TUSDUSDT | $242K–$903K |

سه Tier **کافی به‌نظر می‌رسد** طبقِ این توزیعِ واقعی (شکافِ طبیعی بینِ ~$۱۲M، ~$۱-۴M، و زیرِ $۱M).

---

## ۱۱ — کالیبراسیونِ News Risk

این جلسه هیچ خبرِ واقعی واکشی نکرد (خارج از محدوده‌یِ داده‌یِ بازارِ Binance). ساختارِ پیشنهادی (بدونِ عددِ قطعی، چون هیچ داده‌یِ خبریِ واقعی جمع‌آوری نشد):

```
Severity × Credibility × Recency × Confirmation × EventTypeWeight = News Risk Score
```

معیارِ Hard Trip-Wire (`Confirmed Critical Event`): **فقط** وقتی `Credibility=بالا` **و** `EventType ∈ {توقفِ بازخرید, مشکلِ ذخایرِ تأییدشده, هکِ تأییدشده}` **و** `Confirmation ≥ ۲ منبعِ مستقل`. یک شایعه یا یک منبعِ‌ِتنها، حتی با شدتِ بالا، هرگز Hard نیست — فقط Weighted.

`INSUFFICIENT_DATA_FOR_THRESHOLD` برایِ اعدادِ دقیقِ وزن‌دهی — این جلسه هیچ نمونه‌یِ خبریِ واقعی نداشت تا رویِ آن کالیبره شود.

---

## ۱۲ — Composite Risk Model پیشنهادی

```
Composite Risk = w_price × PriceRisk + w_book × OrderBookRisk + w_liq × LiquidityRisk
                + w_stable × StablecoinRisk + w_news × NewsRisk
```

**وزن‌ها نباید حدسی باشند — و این جلسه داده‌یِ کافی برایِ کالیبرِ دقیقِ وزن‌ها نداشت** (نیازمندِ Backtest رویِ داده‌یِ تاریخیِ چندهفته‌ای/چندماهه با رویدادهایِ واقعیِ EXECUTE/REJECT، که در بخشِ ۱۴ توضیح داده می‌شود چرا در دسترس نیست). آنچه از رویِ داده‌یِ واقعیِ همین جلسه **قابلِ‌توجیه** است:

- `LiquidityRisk` باید وزنِ **کم** داشته باشد برایِ ۶ جفتِ فعلی (چون Executable Liquidity در عمل هرگز محدودکننده نبود — بخشِ ۸).
- `StablecoinRisk` (Tier) باید به‌عنوانِ **ضریبِ آستانه** عمل کند (نه یک جمعِ خطی) — دقیقاً طبقِ Invariantِ گزارشِ قبلی.
- بله، وزن‌ها باید **متفاوت برایِ هر Tier** باشند (تأییدِ مجددِ گزارشِ قبلی): برایِ Tier۱ (مثلِ USDCUSDT)، حتی `PriceRisk` و `OrderBookRisk`ِ بالا هم باید وزنِ کمی در Composite داشته باشند، چون رفتارِ پایه‌ایِ این جفت (بخشِ ۳) خودش نشان می‌دهد نوساناتِ کوچک (حتی ۱۷٪ در Depth) کاملاً عادی‌اند.

---

## ۱۳ — سناریوهایِ تحلیلی (با اعدادِ واقعیِ همین امروز)

### سناریویِ A — `EXECUTE` (با داده‌یِ واقعیِ USDCUSDT)
Spread=0.10bps، Fee=فرضِ صفر، Liquidity=$12.1M (بسیار بالا)، Deviation=۲.۸bps (کاملاً درونِ رنجِ عادیِ ۸ساعته‌یِ خودش)، Momentumِ کمیِ منفی (در مرتبه‌یِ نویز، طبقِ بخشِ ۶) → همه‌یِ Hard Gateها عبور، Composite Risk بسیار پایین (Tier۱) → **`EXECUTE`**.

### سناریویِ B — `REJECT / Market Shock` (لنگرشده به رویدادِ واقعیِ TUSDUSDT)
اگر یک استیبل‌کوینِ جدید امروز دقیقاً رفتارِ لحظه‌یِ اوجِ رویدادِ TUSDUSDT (+۱۳۹bps، به‌همراهِ شتاب‌گیریِ فرضیِ رو‌به‌وخامت و کاهشِ فرضیِ Depth) را نشان دهد → مسیرِ الفِ بخشِ ۹ فعال می‌شود → **`REJECT: Market Shock`** — مستقلِ از سودِ محاسبه‌شده.

### سناریویِ C — `EXECUTE` (یک سیگنالِ ضعیف)
یک جفتِ Tier۱/۲ با همه‌چیزِ سالم بجز یک Momentumِ خیلی‌کوچک — طبقِ بخشِ ۶، این مقدار در مرتبه‌یِ نویزِ طبیعیِ خودِ USDCUSDT است → نمی‌تواند به‌تنهایی Composite Risk را از آستانه عبور دهد → **`EXECUTE`**.

### سناریویِ D — Spreadِ بزرگ + همه‌چیزِ دیگر سالم؟
با داده‌یِ این جلسه: `FDUSDUSDT`/`FDUSDUSDC` دقیقاً این الگو را نشان می‌دهند — Deviationِ نسبتاً بزرگ (۱۱-۱۶bps) اما Depth، Imbalance، و Executable Liquidity همگی سالم، و این انحراف **پایدار** است (نه شتاب‌گیرنده، بینِ ۸ساعته و ۴۸ساعته سازگار). طبقِ بخشِ ۵ (Per-Pair Baseline)، این **درونِ رفتارِ عادیِ خودِ FDUSD** است، نه یک Outlier. **نتیجه: یک Opportunityِ واقعی محسوب می‌شود** (با Tierِ حساس‌ترِ FDUSD، اما بدونِ Reject).

### سناریویِ E — Spreadِ بزرگ + نشانه‌هایِ Depeg؟
دقیقاً سناریویِ B — تفاوتِ D و E **صرفاً** در «آیا انحراف پایدار/عادیِ خودِ نماد است یا در حالِ شتاب‌گیریِ رو‌به‌وخامت است» — این دقیقاً همان تمایزی است که Per-Pair Baseline (بخشِ ۵) + Trend/Momentum (بخشِ ۶) با هم می‌سازند.

---

## ۱۴ — Backtest / Replay

**`INSUFFICIENT_HISTORICAL_DATA` برایِ یک Backtestِ واقعی.** `stablecoin_pair_snapshots` صفر ردیف دارد (بخشِ ۲)؛ `stablecoin_cycle_decisions`/`stablecoin_demo_trades` فقط از لحظه‌ای شروع می‌شوند که موتور اجرا شده (و آن هم بدونِ هیچ‌کدام از این معیارهایِ ریسکِ جدید) — پس هیچ داده‌یِ تاریخیِ «اگر این Threshold وجود داشت، این تصمیم چه می‌شد» موجود نیست. **طرحِ پیشنهادی برایِ آینده (فقط طرح، بدونِ اجرا):** فعال‌کردنِ نوشتنِ واقعیِ `stablecoin_pair_snapshots` (هر ۶۰-۹۰ ثانیه، Read-Only از بازار) برایِ حداقل ۲ تا ۴ هفته، سپس یک Replayِ واقعیِ Read-Only رویِ آن داده.

---

## ۱۵ — جدولِ نهاییِ Threshold (فقط با شاهد، طبقِ دستورِ صریحِ کاربر)

| Metric | Normal | Elevated | Critical | Proposed Threshold | Evidence | Confidence |
|---|---|---|---|---|---|---|
| Price Deviation (Per-Pair) | `mean ± 2σ` خودِ نماد | تا ~۵۰bps فراتر از baseline | فراتر از ~۱۰۰bps | Per-Pair baseline + آستانه‌یِ مطلقِ ۱۰۰bps | واقعی (۶ جفت + رویدادِ TUSD) | **بالا برایِ Normal/Critical، متوسط برایِ Elevated** |
| Volatility (std) | زیرِ ~۱bps | ۱-۵bps | فراتر از ۵bps | همان | واقعی (۸ساعته/۴۸ساعته) | بالا |
| Momentum (دقیق) | — | — | — | — | ناکافی (بخشِ ۶) | **`INSUFFICIENT_DATA_FOR_THRESHOLD`** |
| Depth (سطحِ Tier) | فراتر از $۵M | $۱-۵M | زیرِ $۱M | همان (بخشِ ۱۰) | واقعی (۶ جفت) | بالا |
| Bid/Ask Imbalance | زیرِ ~۰.۳ | ۰.۳-۰.۶ | فراتر از ۰.۶ | همان | واقعی (رنجِ مشاهده‌شده) | متوسط (فقط یک نمونه‌یِ لحظه‌ای در دسترس) |
| Depth Change (٪ در بازه‌یِ کوتاه) | — | — | — | — | ناکافی (فقط یک نمونه‌یِ ۷۵ثانیه‌ای) | **`INSUFFICIENT_DATA_FOR_THRESHOLD`** (اما: ۱۰-۲۰٪ قطعاً Normal است) |
| Executable Liquidity @ Opportunity Unit | کاملاً پر می‌شود | جزئی پر می‌شود | پر نمی‌شود | همان (بدونِ تغییر، از قبل Hard Gate) | واقعی (۶ از ۶ جفت، همین حالا) | بالا |
| Composite Risk Weights | — | — | — | — | ناکافی (نیازمندِ Backtest، بخشِ ۱۴) | **`INSUFFICIENT_DATA_FOR_THRESHOLD`** |
| News Risk Weights | — | — | — | — | ناکافی (هیچ نمونه‌یِ خبریِ واقعی بررسی نشد) | **`INSUFFICIENT_DATA_FOR_THRESHOLD`** |

---

## ۱۶ — تأثیرِ Latency

بدونِ تغییر نسبت به گزارشِ ۰۹:۵۹ — این کالیبراسیون هیچ مرحله‌یِ جدیدی به Pipeline اضافه نکرد، فقط اعدادِ داخلِ مراحلِ موجود را با شاهد جایگزین کرد.

---

## ۱۷ — ریسکِ False Reject در برابرِ False Accept (خلاصه)

- **False Reject** (رد کردنِ یک فرصتِ سالم): بیشترین خطر از یک آستانه‌یِ **Global** (نه Per-Pair) رویِ Deviation می‌آمد — FDUSD به‌طورِ ساختگی همیشه رد می‌شد. **کاهش‌یافته** با تصمیمِ Per-Pair (بخشِ ۵).
- **False Accept خطرناک** (اجرایِ معامله در یک بحرانِ واقعی): بیشترین خطر از تکیه‌یِ صرف بر Fee+Spread (وضعِ فعلی) است — رویدادِ واقعیِ +۱۳۹bpsِ TUSD دقیقاً نمونه‌ای است که یک موتورِ ساده می‌توانست به اشتباه «فرصتِ عالی» تلقی کند. **کاهش‌یافته** با Market Shockِ دومسیره (بخشِ ۹).

---

## Production Safety

Zero code changes, zero migrations, zero database writes (only one read-only `SELECT ... limit=1` with `Prefer: count=exact` against `stablecoin_pair_snapshots`), zero Allocations touched, zero trades, zero scheduler changes, zero Binance orders (only public, keyless market-data GET requests — `exchangeInfo`, `depth`, `klines` — identical in kind to what the engine itself already calls), zero commits, zero pushes, zero deploys. `signal0verse/signalverse-main` remains at commit `c497c6b`, unchanged.

---

## مواردی که برای تأییدِ کاربر باقی مانده

۱. آستانه‌یِ دقیقِ عددیِ ناحیه‌یِ «Elevated» برایِ Price Deviation (فقط درون‌یابی‌شده، نه مشاهده‌شده).
۲. آستانه‌یِ دقیقِ عددیِ Depth Change (نیازمندِ فعال‌شدنِ Collector و چند هفته داده — بخشِ ۱۴).
۳. آستانه‌یِ دقیقِ Momentum (نیازمندِ داده‌یِ Tick یا یک دوره‌یِ واقعاً پرنوسان برایِ کالیبره‌شدنِ معنادار).
۴. وزن‌هایِ دقیقِ Composite Risk (نیازمندِ Backtestِ تاریخی که هنوز داده‌اش وجود ندارد).
۵. ساختارِ دقیقِ News Risk Weighting (هیچ نمونه‌یِ خبریِ واقعی در این جلسه بررسی نشد).
۶. آیا `Collector`ِ پیشنهادیِ بخشِ ۱۴ (نوشتنِ دوره‌ای در `stablecoin_pair_snapshots`) برایِ فازِ بعدی تأیید می‌شود؟ (این خودش نیازمندِ Implementation و تصمیمِ جداگانه است.)

---

## FINAL STATUS TABLE

```
REAL MARKET DATA FETCHED: YES - all 6 currently-eligible pairs (exchangeInfo-confirmed), depth (2 passes,
  75s apart), 1m klines (500, ~8.3h), 5m klines (576, ~48h) - all public, keyless, read-only
stablecoin_pair_snapshots ROW COUNT: 0 (confirmed via direct read-only query) - zero historical depth data exists
BASELINE (USDCUSDT): documented with real numbers - $12.1M/$9.9M top-5 depth, 0.10bps spread, 0.8-3.1bps
  deviation range (8h), and a REAL 17% depth swing observed within just 75 seconds (proves depth-change
  thresholds must be loose, not tight)
PER-PAIR VS GLOBAL DEVIATION THRESHOLD: RESOLVED WITH EVIDENCE - Per-Pair required (FDUSD trades at a
  persistent, structurally normal -12 to -16bps, which a global USDC-scale threshold would misclassify forever)
REAL CRITICAL-TAIL EVENT FOUND: TUSDUSDT +139bps deviation within the last 48h - used as the real anchor for
  the "Critical" zone, not a guessed number
MOMENTUM THRESHOLD: INSUFFICIENT_DATA_FOR_THRESHOLD - kline-close-based momentum is near-zero/degenerate for
  these pairs at this liquidity; a different data source (tick-level or order-book mid-price) would be needed
DEPTH-CHANGE THRESHOLD: INSUFFICIENT_DATA_FOR_THRESHOLD (only one 75s sample per pair) - but real evidence
  shows 10-20%+ swings are normal even for USDCUSDT and must not trip a hard gate
COMPOSITE RISK WEIGHTS: INSUFFICIENT_DATA_FOR_THRESHOLD - requires a historical backtest dataset that does not
  yet exist (stablecoin_pair_snapshots is empty, cycle_decisions predates any risk logic)
NEWS RISK WEIGHTS: INSUFFICIENT_DATA_FOR_THRESHOLD - no real news samples were gathered in this task
3 TIERS CONFIRMED SUFFICIENT: YES, based on a real, natural gap in measured depth across the 6 real pairs
MARKET SHOCK MODEL: REVISED to two INDEPENDENT paths (price-only, depth-only) per the user's own suggestion -
  no longer a rigid 3-condition AND
FALSE REJECT / FALSE ACCEPT ANALYSIS: DONE, each tied to a specific real data point (FDUSD baseline; TUSD event)
CODE CHANGED: NO
MIGRATION EXECUTED: NO
DATABASE WRITE: NO
ALLOCATION CHANGED/STOPPED/CREATED/RESET: NO
TRADE CREATED: NO
SCHEDULER CHANGED: NO
BINANCE ORDER SENT: NO
CODE COMMITTED: NO
CODE PUSHED: NO
PRODUCTION DEPLOYED: NO
AWAITING: user decision on the 6 open items above, most notably whether to approve activating a real
  stablecoin_pair_snapshots collector to gather the multi-week history needed for the still-uncalibrated
  thresholds (Depth Change, Momentum, Composite Risk weights, News Risk weights)
```
