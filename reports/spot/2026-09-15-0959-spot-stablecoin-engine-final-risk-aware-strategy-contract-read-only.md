# Stablecoin Engine — Final Risk-Aware Strategy Contract: Pipeline, Hard Trip-Wires, and Three Worked Scenarios (Read-Only)

## Metadata

- Date: 2026-09-16 (session continued)
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine — Allocation architecture)
- Mode: **Read-only architecture finalization** — refines `reports/spot/2026-09-15-0802-...` per the user's explicit corrections (critical-event detection must not depend solely on the news cache; risk tier must never itself be a rejection reason; three fully worked scenarios required). Zero code changes, zero migrations, zero database writes, zero Allocation/trade/scheduler changes, zero Binance orders, zero commit/push/deploy in this task.
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e
- Ending commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e (**unchanged**)
- References (both reaffirmed unchanged by this report):
  - Capital/Capacity contract: `reports/spot/2026-09-15-0642-...round-trip-model-read-only.md`
  - Prior pipeline draft: `reports/spot/2026-09-15-0802-...decision-pipeline-architecture-review-read-only.md`

## Objective

Finalize the Risk-Aware Decision Pipeline into a single, unambiguous Strategy Contract per the user's corrections: (1) a fast, independent, market-data-derived path for detecting a genuine crisis (never solely dependent on the slower news cache), (2) an explicit design invariant that a single mild signal can never by itself reject a healthy opportunity, and (3) three fully worked numeric scenarios proving the engine is neither naive nor over-conservative.

---

## ۱ — اصلِ اصلیِ Engine (بازتأیید، بدونِ ابهام)

```
نه: Fee=0 ∧ Spread>0 ⇒ EXECUTE   (بیش‌ازحد ساده)
و نه: هر سیگنالِ ضعیف ⇒ REJECT   (بیش‌ازحد محافظه‌کار)

بلکه: EXECUTE ⇔ (همه‌یِ Hard Gateها عبور کردند) ∧ (هیچ Hard Trip-Wireیی فعال نیست) ∧ (Composite Risk < آستانه‌یِ Tier)
```

این یک قاعده‌یِ واحد و بدونِ استثنایِ پنهان است — دقیقاً همان چیزی که در بخشِ ۱۳ (سه سناریو) با عدد نشان داده می‌شود.

---

## ۲ — Decision Pipeline نهایی (بازبینی‌شده)

پیشنهادِ قبلی (گزارشِ ۰۸:۰۲) بازبینی شد. **یک اصلاحِ ساختاری اعمال می‌شود**، دقیقاً طبقِ اصلاحِ کاربر در بخشِ ۸: تشخیصِ رویدادِ بحرانی **نباید** فقط به News Cache وابسته باشد — باید مستقیماً از رویِ داده‌یِ بازارِ **همان لحظه** (که در مرحله‌یِ Technical/Order Book از قبل دریافت شده) استخراج شود. بنابراین یک مرحله‌یِ جدید («Market Shock Check») بلافاصله بعد از Order Book اضافه می‌شود — این مرحله **هیچ فراخوانیِ جدیدی به بازار ندارد**، فقط یک طبقه‌بندیِ فوریِ Rule-Based رویِ داده‌ای است که برایِ مراحلِ ۵ و ۶ از قبل واکشی شده:

```
1.  Symbol Eligibility           [In-memory/Cached]     — نمادِ TRADING است؟
2.  Stablecoin Risk Tier         [In-memory]             — تعیینِ زمینه (هرگز رد نمی‌کند)
3.  News Cache Read (Normal)     [Background, ۵-۱۵ دقیقه]— فقط خواندن، هرگز فراخوانیِ زنده
4.  Fee Verification             [Real-time, Hard Gate]  — بدونِ تغییر نسبت به امروز
5.  Technical Snapshot           [Cache کوتاه، ۶۰-۹۰ ثانیه]— Deviation/Trend/Momentum/Volatility
6.  Order Book + Executable Liq. [Real-time, غنی‌شده]    — VWAP + عمقِ چندلایه + عدمِ‌تعادل
7.  Market Shock Check           [In-process, صفر تأخیر] — Hard Trip-Wire، مشتق از ۵+۶، مستقلِ از خبر
8.  Opportunity Calculation      [In-process]             — همان ریاضیاتِ فعلی
9.  Composite Risk Score         [In-process]             — ترکیبِ Tier+News+Technical+OrderBook
10. Concentration Signal          [In-memory]              — فقط ثبت، بدونِ اثر
11. Capacity/Reserve Check        [Real-time DB, Hard Gate]— بدونِ تغییر نسبت به امروز
12. Final Decision
```

**چرا این ترتیب:** مرحله‌یِ ۷ (Market Shock) بلافاصله بعد از داده‌هایِ لازمش (۵، ۶) و **قبل از** محاسبه‌یِ سود می‌آید — اگر یک بحرانِ واقعی تشخیص داده شود، موتور فوراً و بدونِ اتلافِ وقت رویِ محاسبه‌یِ سود/ریسکِ ترکیبی، رد می‌کند (Fail-Fast). این دقیقاً پاسخِ مستقیم به اصلاحِ کاربر است: تشخیصِ بحران هرگز منتظرِ رفرشِ بعدیِ Cacheِ خبری نمی‌ماند، چون کاملاً از رویِ همان دفترِ سفارش/قیمتِ لحظه‌ای که هر چرخه واقعاً دریافت می‌شود محاسبه می‌گردد.

مراحلِ ارزان (۱، ۲، ۳، ۱۰) هیچ‌کدام فراخوانیِ شبکه ندارند — عملاً صفر تأخیر، دقیقاً طبقِ الزامِ کاربر که «مراحلِ ارزان نباید باعثِ کندی شوند».

---

## ۳ — Mathematical Model (بدونِ تغییر نسبت به گزارشِ ۰۶:۴۲، فقط بازتأیید)

```
Initial Capital, Opportunity Unit (U = IC/2), Active Capital, Reserve Capital,
Required Liquidity, Per-Trade Notional (=U، مستقل از Capacity)
```

**بدونِ هیچ تغییر.** لایه‌یِ ریسک صرفاً رویِ EXECUTE/REJECT اثر می‌گذارد؛ رویِ اینکه چه مقدار پول در کدام دارایی باشد یا حجمِ معامله چقدر باشد، هیچ اثری ندارد.

---

## ۴ — Risk Model (پنج مؤلفه، عمداً محدود — طبقِ دستورِ کاربر «از ده‌ها Indicator پرهیز کن»)

```
Composite Risk = f(Price Risk, Order Book Risk, Liquidity Risk, Stablecoin Risk, News Risk)
```

هر مؤلفه یک عددِ محدود (مثلاً ۰ تا ۱) است. **قاعده‌یِ ثابتِ طراحی (Invariant):**

> **یک سیگنالِ ضعیف، به‌تنهایی، هرگز نباید Composite Risk را برایِ Tier ۱ یا Tier ۲ از آستانه عبور دهد.** فقط (الف) هم‌زمانیِ **چند** سیگنالِ هم‌زمان مرتفع، یا (ب) یک Hard Trip-Wire، می‌تواند REJECT ایجاد کند.

این دقیقاً پاسخِ ریاضیِ به بخشِ ۱۰ و ۱۳ کاربر است (مثالِ صریح: «کمی Momentum منفی + عدمِ‌تعادلِ جزئی» نباید به‌تنهایی رد کند).

---

## ۵ — Stablecoin Risk Tiers (بازتأیید + اصلاح)

| Tier | نمونه | اثر |
|---|---|---|
| ۱ | USDC, USDT | حساسیتِ کم — آستانه‌یِ ردِ نزدیک به «فقط Hard Trip-Wire» |
| ۲ | FDUSD, TUSD, DAI | حساسیتِ متوسط — نیازمندِ هم‌زمانیِ ≥۲ سیگنالِ مرتفع |
| ۳ | جدید/کم‌سابقه/کم‌حجم | حساسیتِ بالا — یک سیگنالِ حتی متوسط ممکن است کافی باشد |

**اصلاحِ مهمِ این دور:** «الگوریتمی بودن» **به‌تنهایی** معیارِ Tier نیست — طبقِ دستورِ صریحِ کاربر در بخشِ ۴، مکانیزم فقط **یکی** از چند وردی‌یِ تعیینِ Tier است (در کنارِ سن، حجم، سابقه‌یِ Peg) و **هرگز به‌تنهایی** تعیین‌کننده نیست. **Tier در هیچ شرایطی، به‌تنهایی، یک دلیلِ REJECT نیست** — فقط ضریبِ حساسیتِ لایه‌یِ Weighted را تنظیم می‌کند.

---

## ۶ — Technical Inputs (حداقلیِ عمدی، پنج مورد — پاسخ به سؤالِ Timeframe)

**Timeframe پیشنهادی: فقط دو بازه، هردو کوتاه‌مدت** — چون خودِ فرصت‌هایِ این موتور عمرِ کوتاه دارند و بحرانی که باید تشخیص داده شود (Depeg) هم در مقیاسِ دقیقه توسعه می‌یابد، نه ساعت/روز:
- **بسیار‌کوتاه‌مدت (~۱ تا ۳ دقیقه، Klineِ ۱ دقیقه‌ای):** برایِ Momentum/Rate of Change لحظه‌ای.
- **کوتاه‌مدت (~۱۵ تا ۳۰ دقیقه):** برایِ تعیینِ «بازه‌یِ طبیعیِ اخیر» (مبنایِ تشخیصِ Outlier).

بازه‌هایِ بلندمدت‌تر (۱ساعته، ۴ساعته، روزانه) **عمداً پیشنهاد نمی‌شوند** — نه فقط چون کندتر هستند، بلکه چون رفتارِ «طبیعیِ» یک استیبل‌کوین در آن مقیاس‌ها اصلاً قدرتِ تفکیک‌کنندگی ندارد (تقریباً همیشه نزدیکِ `$1` است) — برخلافِ یک دارایی‌یِ معمولی.

پنج ورودی (نه بیشتر):
۱. **Price Deviation** — انحرافِ فعلی از `$1` (از قبل موجود، `computeGrossSpreadPct`).
۲. **Short-term Trend** — جهتِ میانگینِ انحراف در بازه‌یِ کوتاه‌مدت (به‌سمتِ Par یا دورشونده از آن؟).
۳. **Momentum / Rate of Change** — سرعتِ تغییرِ انحراف در بازه‌یِ بسیار‌کوتاه‌مدت.
۴. **Volatility** — پراکندگیِ انحرافِ اخیر نسبت به هنجارِ خودش.
۵. **Distance from Recent Normal Range** — آیا انحرافِ فعلی درونِ بازه‌یِ معمولِ اخیرِ همین نماد است یا یک Outlierِ واقعی؟

---

## ۷ — Order Book Inputs (هشت مورد، محدود — تفکیکِ صریحِ Displayed vs Executable)

| ورودی | نقش |
|---|---|
| Best Bid / Best Ask | مبنایِ اسپرد و Imbalance |
| Multi-level Depth (۳-۵ سطحِ اول، نه کلِ کتاب) | آیا عمق پلکانی است یا "پرتگاهی"؟ |
| **Executable Liquidity** (`getOrderBookQuote`ی موجود، در اندازه‌یِ دقیقِ Opportunity Unit) | **تنها معیارِ Hard Gate** |
| **Displayed Liquidity** (مجموعِ خامِ عمقِ نمایش‌داده‌شده) | فقط ورودیِ Weighted (Order Book Risk)، هرگز Hard Gate |
| VWAP | از قبل موجود |
| Bid/Ask Imbalance | نسبتِ عمقِ خرید به فروش در چند سطحِ اول |
| Depth Concentration | آیا عمق فقط دقیقاً رویِ بهترین قیمت متمرکز است (شکننده) یا پخش است؟ |
| Rate of Depth Change / نشانه‌یِ خالی‌شدن | مقایسه با Snapshotِ ۳۰-۶۰ ثانیه‌یِ قبل (از `stablecoin_pair_snapshots`) |

**اصلِ صریح (طبقِ تأکیدِ مکررِ کاربر):** هدف «Liquidity Cafe کافی برایِ اجرایِ امنِ همین Opportunity Unit»، نه «حداکثرِ عمقِ ممکن». یک دفترِ نسبتاً کم‌عمق که هنوز Opportunity Unit را کامل پر می‌کند، هرگز فقط به‌خاطرِ «می‌توانست عمیق‌تر باشد» رد نمی‌شود.

---

## ۸ — News/Event Inputs (دو لایه‌یِ کاملاً مجزا، طبقِ اصلاحِ صریحِ کاربر)

| لایه | منبع | تازگی | نقش |
|---|---|---|---|
| **A. Normal News Risk** | `api/news.ts` (موجود، فقط نیازمندِ اتصال) | Cacheِ پس‌زمینه، ۵-۱۵ دقیقه | Weighted فقط |
| **B. Critical Event / Market Shock** | **مستقیماً از Technical Snapshot + Order Book (مرحله‌یِ ۷ Pipeline)** — نه از News | همان لحظه (صفر تأخیرِ اضافه، چون داده از قبل واکشی شده) | **Hard Trip-Wire** |

این دقیقاً پاسخِ مستقیم به اصلاحِ کاربر است: یک بحرانِ واقعی (Depeg شدید، سقوطِ سریع، خالی‌شدنِ دفتر) **هرگز منتظرِ خبر نمی‌ماند** — چون قبل از اینکه هر خبری منتشر شود، خودِ بازار (قیمت + دفترِ سفارش) این الگو را نشان می‌دهد. News (لایه‌یِ A) فقط یک منبعِ **مکملِ** Weighted است، نه مسیرِ اصلیِ تشخیصِ بحران.

**تعریفِ دقیقِ «Market Shock» (مرحله‌یِ ۷، همه‌یِ شرایطِ زیر هم‌زمان):**
```
Deviationِ بزرگ (فراتر از بازه‌یِ طبیعیِ اخیر)
∧ جهت‌گیریِ رو‌به‌وخامت (نه Mean-Reverting، بلکه شتاب‌گیرنده)
∧ نشانه‌یِ خالی‌شدنِ دفترِ سفارش (کاهشِ Depth نسبت به Snapshotِ اخیر)
```
اگر این سه هم‌زمان برقرار باشند → REJECT فوری، مستقلِ از سودِ محاسبه‌شده، مستقلِ از وجود یا نبودِ خبر. اگر یک خبرِ بسیارمعتبر و تأییدشده هم (لایه‌یِ A) هم‌زمان موجود باشد، به‌عنوانِ تأییدِ اضافی ثبت می‌شود، اما **شرطِ لازم نیست**.

---

## ۹ — Concentration Signal (فقط معماری، بدونِ Limitِ عددی — بدونِ تغییر نسبت به دستورِ قبلی)

پیشنهادِ معماریِ آینده (بدونِ پیاده‌سازی در این فاز): هر چرخه، پس از هر معامله، نسبتِ تمرکز (`max(baseBalance, quoteBalance) / (baseBalance+quoteBalance)`) محاسبه و در پاسخِ API/گزارش ثبت می‌شود — صرفاً یک عدد، بدونِ هیچ اثر بر تصمیم. در Implementationِ آینده (و فقط با تأییدِ جداگانه)، این عدد می‌تواند یک ورودیِ ششمِ اختیاری به Composite Risk اضافه شود.

---

## ۱۰ — Hard Gates (بدونِ تغییر نسبت به امروز + Capacity)

`Fee unverified`, `Symbol not trading`, `Capital insufficient`, `INSUFFICIENT_ALLOCATION_INVENTORY`, `INSUFFICIENT_MARKET_LIQUIDITY`, `Notional too small`, `Spread too small`, `Profit below minimum`/`Fees eliminate profit`.

## ۱۱ — Weighted Signals

Price Risk (بخشِ ۶)، Order Book Risk + Liquidity Risk (بخشِ ۷، فقط از `Displayed Liquidity`/Imbalance/Concentration — نه از Executable Liquidity که خودش Hard Gate است)، Stablecoin Risk (Tier، بخشِ ۵)، Normal News Risk (بخشِ ۸-A).

## ۱۲ — Hard Trip-Wires (دقیقاً دو مورد، مستقل از Composite Risk)

۱. **Market Shock** (بخشِ ۸-B) — مشتق از داده‌یِ بازارِ لحظه‌ای، بدونِ وابستگی به خبر.
۲. **Confirmed Critical News** (خبرِ بسیارمعتبر و تأییدشده، مثلِ توقفِ رسمیِ بازخرید توسطِ ناشر) — از لایه‌یِ A، اما فقط در بالاترین سطحِ اعتبار/شدت.

## ۱۳ — تعاملِ Concentration/Capacity

بدونِ تغییر نسبت به گزارشِ ۰۶:۴۲ — `Capacity` فقط موجودیِ اولیه را تعیین می‌کند؛ بررسیِ اجراپذیریِ هر معامله همچنان صرفاً از رویِ موجودیِ واقعیِ لحظه‌ای انجام می‌شود (نه یک شمارنده‌یِ Capacity). Concentration Signal (بخشِ ۹) کاملاً informational، بدونِ اثر بر این بررسی.

## ۱۴ — Latency Model

| مرحله | نوع | هزینه (Cache سرد) | هزینه (Cache گرم) |
|---|---|---|---|
| Symbol Eligibility | In-memory/Cached (۱ساعته، موجود) | ~۰ | ~۰ |
| Stablecoin Risk Tier | In-memory | ~۰ | ~۰ |
| News Cache Read | Background | ~۰ | ~۰ |
| Fee Verification | Real-time | ۱۰۰-۲۵۰ms | همیشه تازه (بدونِ تغییر) |
| Technical Snapshot | Cache ۶۰-۹۰ثانیه‌یِ مشترک | ۱۰۰-۲۵۰ms (یک Kline) | ~۰ |
| Order Book (هر جهت ×۲) | Real-time | ۲۰۰-۵۰۰ms | همیشه تازه (بدونِ تغییر) |
| Market Shock Check | In-process | ~۰ | ~۰ |
| Opportunity + Composite Risk | In-process | ~۰ | ~۰ |
| Concentration Signal | In-memory | ~۰ | ~۰ |
| Capacity/Reserve | DB Read (موجود) | ۲۰-۵۰ms | ۲۰-۵۰ms |
| **جمعِ کل هر چرخه** | | **~۴۵۰-۱۰۰۰ms** | **~۳۵۰-۸۰۰ms** |

**مقایسه با امروز (بدونِ لایه‌یِ ریسک):** ~۳۰۰-۹۰۰ms. **افزوده‌یِ خالص:** عملاً یک فراخوانیِ Klineِ اضافه، فقط در حالتِ Cacheِ سرد (~هر ۶۰-۹۰ ثانیه یک‌بار، نه هر چرخه) — کاملاً منطبق با هدفِ «Fast Trader».

## ۱۵ — Decision Output

`EXECUTE` یا `REJECT: [فهرستِ دلایلِ واقعاً برقرار]` — هرگز یک دلیلِ عمومی/جایگزین. هر دلیل با عددِ محاسبه‌شده‌یِ خودش همراه است (طبقِ الگویِ از‌قبل‌پیاده‌شده‌یِ `StablecoinRejectionDetailRows`، فازِ دیروز).

## ۱۶ — Reject Reasons (نهایی)

`Fee unverified`, `Symbol not trading`, `Capital insufficient`, `INSUFFICIENT_ALLOCATION_INVENTORY`, `INSUFFICIENT_MARKET_LIQUIDITY`, `Notional too small`, `Spread too small`, `Profit below minimum`, `Fees eliminate profit`, **`Market Shock (Depeg Risk)`**, **`Confirmed Critical Event`**, **`High Composite Risk`** (وقتی هیچ Trip-Wireیی نیست ولی چند سیگنالِ Weighted هم‌زمان از آستانه‌یِ Tier عبور کرده‌اند).

---

## ۱۷ — سه سناریویِ کامل (مهم‌ترین بخشِ این گزارش)

### سناریویِ ۱ — USDC/USDT سالم → چرا EXECUTE؟

| ورودی | مقدار |
|---|---|
| Tier | ۱ (حساسیتِ کم) |
| Fee | تأییدشده، صفر |
| Deviation | کوچک، درونِ بازه‌یِ طبیعیِ اخیر |
| Trend/Momentum | خنثی/Mean-Reverting |
| Order Book | متعادل، Executable Liquidity کاملِ Opportunity Unit را پر می‌کند |
| News | چیزی یافت نشد |
| Market Shock | فعال نشد |
| Composite Risk | بسیار پایین (همه‌یِ مؤلفه‌ها پایین) |

**نتیجه: `EXECUTE`.** همه‌یِ Hard Gateها عبور، هیچ Trip-Wireیی فعال نیست، Composite Risk به‌مراتب زیرِ آستانه‌یِ (سست‌ترینِ) Tier ۱ — موتور بدونِ هیچ تأخیرِ اضافی معامله می‌کند، دقیقاً طبقِ اصلِ «فرصتِ سالم = اجرایِ سریع».

### سناریویِ ۲ — استیبل‌کوینِ جدید در بحران → چرا REJECT؟

| ورودی | مقدار |
|---|---|
| Tier | ۳ (حساسیتِ بالا) |
| Fee | صفر (به‌تنهایی کافی نیست) |
| Spread | بسیار بزرگ (به‌تنهایی وسوسه‌انگیز) |
| Deviation | بزرگ، شتاب‌گیرنده (نه Mean-Reverting) |
| Order Book | نشانه‌یِ خالی‌شدنِ فعال (کاهشِ Depth نسبت به Snapshotِ اخیر) |
| News | منفیِ معتبر موجود |
| **Market Shock** | **فعال** (هر سه شرطِ بخشِ ۸-B هم‌زمان برقرار) |

**نتیجه: `REJECT: Market Shock (Depeg Risk)`.** موتور حتی به مرحله‌یِ محاسبه‌یِ سود نمی‌رسد (Fail-Fast در مرحله‌یِ ۷). **نکته‌یِ حیاتی:** رد شدن به‌خاطرِ سودِ بالا نیست — به‌خاطرِ الگویِ بحران است؛ اگر همین Spreadِ بزرگ بدونِ شتاب‌گیریِ قیمت و بدونِ خالی‌شدنِ دفتر مشاهده می‌شد، Market Shock فعال نمی‌شد و پرونده به Composite Risk می‌رفت (که خودش، به‌خاطرِ Tier۳، همچنان حساس است اما نه لزوماً Reject).

### سناریویِ ۳ — استیبل‌کوینِ معتبر، فقط یک سیگنالِ ضعیف → EXECUTE یا REJECT؟

| ورودی | مقدار |
|---|---|
| Tier | ۱ یا ۲ |
| Fee, Order Book, Liquidity, News | همه سالم |
| **تنها استثنا** | Momentumِ کمی منفی (یک نوسانِ کوچک و معمول) |
| Market Shock | فعال نشد (فقط یک شرط از سه شرطِ لازم برقرار است، نه هر سه) |
| Composite Risk | یک افزایشِ کوچک، فقط از یک مؤلفه — طبقِ Invariantِ بخشِ ۴، این **به‌تنهایی** آستانه را عبور نمی‌دهد |

**نتیجه: `EXECUTE`.** این سناریو دقیقاً همان چیزی است که کاربر خواسته بود اثبات شود: موتور **بیش‌ازحد سخت‌گیر نیست** — یک سیگنالِ ضعیفِ منفرد، برایِ یک داراییِ کم‌ریسک، هرگز به‌تنهایی یک فرصتِ سالم را از بین نمی‌برد.

---

## کدام بخش‌ها فقط پیشنهادند و هنوز نیازِ تأییدِ صریحِ کاربر دارند

- عددِ دقیقِ آستانه‌هایِ Composite Risk به‌ازایِ هر Tier (این گزارش فقط ساختار و رفتارِ نسبی را مشخص کرده، نه اعدادِ قطعی).
- شرایطِ دقیقِ عددیِ «Deviationِ بزرگ»/«شتاب‌گیرنده»/«خالی‌شدنِ دفتر» در تعریفِ Market Shock (بخشِ ۸-B) — این‌ها مفهوماً مشخص شدند، اما مقادیرِ آستانه باید توسطِ کاربر تأیید شوند.
- منبعِ نهاییِ Stablecoin Risk Tier (فهرستِ دستی در برابرِ محاسبه‌شده).
- منبعِ نهاییِ Normal News Risk (اتصال به `api/news.ts` موجود در برابرِ سرویسِ اختصاصی).
- معیارِ دقیقِ «اعتبارِ بسیاربالا»یِ خبر برایِ Hard Trip-Wireِ بخشِ ۱۲-۲.

---

## Production Safety

Zero code changes, zero migrations, zero database writes, zero Allocations touched/stopped/created, zero trades created, zero scheduler changes, zero Binance orders, zero commits, zero pushes, zero deploys. `signal0verse/signalverse-main` remains at commit `c497c6b`, unchanged.

---

## FINAL STATUS TABLE

```
CAPITAL/CAPACITY CONTRACT (0642 report): REAFFIRMED UNCHANGED
PIPELINE ORDER: REVISED - added an explicit "Market Shock Check" stage (in-process, zero added latency) right
  after Technical Snapshot + Order Book, so critical-event detection is fully independent of the news cache
CRITICAL EVENT DETECTION: NOW TWO INDEPENDENT PATHS - (A) fast, market-data-derived Market Shock (Hard
  Trip-Wire, zero extra latency), (B) confirmed high-credibility news (Hard Trip-Wire, separate, slower channel)
DESIGN INVARIANT ADDED: a single weighted signal, at mild severity, can NEVER by itself cross the rejection
  threshold for Tier 1/2 assets - only multiple simultaneous elevated signals or a Hard Trip-Wire can reject
STABLECOIN RISK TIER: CONFIRMED NEVER A STANDALONE REJECTION REASON - only adjusts Weighted-layer sensitivity;
  "algorithmic mechanism" alone is no longer sufficient to raise Tier - it's one of several inputs
TECHNICAL INPUTS: kept to 5, using only two short timeframes (~1-3 min and ~15-30 min) - no long-timeframe
  indicators, matching the "stay fast, avoid indicator bloat" requirement
ORDER BOOK INPUTS: 8, with an explicit Displayed-vs-Executable-Liquidity split; only Executable Liquidity is
  ever a Hard Gate
LATENCY MODEL: per-stage cold/warm cost table produced; net addition over today ~= one Kline fetch every
  60-90s (not per cycle), ~0ms in the typical (warm-cache) case
THREE WORKED SCENARIOS: PRODUCED (healthy USDC/USDT -> EXECUTE; new-stablecoin market shock -> REJECT via the
  fast market-data path, not profit-driven; single mild signal on a low-risk asset -> EXECUTE, proving no
  over-conservatism)
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
REMAINING OPEN ITEMS (listed explicitly above): exact numeric thresholds per Tier, exact Market Shock magnitude/
  velocity/depth-drop cutoffs, final data source for Risk Tier and News Risk, credibility bar for the news
  Hard Trip-Wire
AWAITING: user approval of this finalized contract, and resolution of the open numeric items, before any
  implementation
```
