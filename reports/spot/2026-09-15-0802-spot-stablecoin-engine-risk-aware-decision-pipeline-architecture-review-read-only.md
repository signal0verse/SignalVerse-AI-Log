# Stablecoin Engine — From "Fee=0 + Spread&gt;0" to a Fast, Risk-Aware Opportunity Hunter: Decision Pipeline Architecture Review (Read-Only)

## Metadata

- Date: 2026-09-16 (session continued)
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine — Allocation architecture)
- Mode: **Read-only architecture review** — the user asked for a redesign of the *decision logic* (not the capital/capacity model, which was already audited and is reaffirmed unchanged in this report) to add real risk-awareness, explicitly warning against both under-filtering (naive fee+spread execution) and over-filtering (an overly conservative engine that rejects healthy USDC/USDT opportunities). Zero code changes, zero migrations, zero database writes, zero Allocation/trade/scheduler changes, zero Binance orders, zero commit/push/deploy in this task.
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e
- Ending commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e (**unchanged**)
- Reference (Capital/Capacity contract, reaffirmed unchanged by this report): `reports/spot/2026-09-15-0642-spot-stablecoin-engine-final-strategy-contract-audit-round-trip-model-read-only.md`

## Objective

Audit the current decision logic against a much richer strategy contract — technical/price context, order-book depth beyond a single VWAP walk, a per-stablecoin risk tier, news/event risk, and (as a documented placeholder only, not implemented) concentration risk — and propose a Decision Pipeline architecture for the user's approval before any code is written.

---

## بخشِ صفر — تأییدِ عدمِ تداخل با قراردادِ سرمایه/ظرفیتِ قبلاً تأییدشده

پیش از هرچیز: مدلِ `Initial Capital / Opportunity Unit / Capacity / Reserve` (گزارشِ ۰۶:۴۲ امروز) **کاملاً دست‌نخورده و بدونِ تغییر باقی می‌ماند**. عبارتِ کاربر در بخشِ ۷ همین پیام («Capacity=1 نباید الزاماً آن را رد کند چون ذخیره کافی نیست؛ بلکه... همان وضعیتِ واقعیِ موجودی بررسی شود») **دقیقاً همان نتیجه‌ای است که در گزارشِ ۰۶:۴۲ اثبات شد** — Capacity هرگز به‌عنوانِ یک شمارنده در منطقِ تصمیم‌گیری ظاهر نمی‌شود؛ فقط از طریقِ موجودیِ واقعی (که در لحظه‌یِ Seed از رویِ Capacity ساخته شده) اثر می‌گذارد. **هیچ تناقضی بینِ این پیام و گزارشِ قبلی وجود ندارد** — این گزارش صرفاً یک لایه‌یِ **جدید** (ریسک/تحلیل) را رویِ همان مدلِ تأییدشده اضافه می‌کند.

---

## بخشِ ۱ — وضعیتِ فعلیِ کد (Audit، پاسخ به ۱۶ سؤالِ کاربر)

### ۱ تا ۳. کدام بخش‌ها این منطق را دارند/ندارند؛ کجا فقط به Fee/Spread/Liquidity تکیه شده؟

منطقِ تصمیم‌گیریِ فعلی (`classifyStablecoinExecutability`, `api/stablecoin-engine.ts` خطِ ۱۹۴-۲۲۶) دقیقاً و **فقط** همین زنجیره است:

```
fee تأییدشده؟ → symbol در حالِ معامله؟ → سرمایه ≥ حداقل؟ → موجودیِ Allocation کافی؟
→ دفترِ سفارش کاملاً پر می‌شود؟ → حجم ≥ حداقلِ Binance؟ → اسپردِ ناخالص ≥ کف؟ → سودِ خالص ≥ کف؟
→ EXECUTE
```

**این دقیقاً همان «Fee=0 + Spread>0 = معامله»یِ توصیف‌شده توسطِ کاربر است** (با یک لایه‌یِ اقتصادیِ اضافه — کارمزد و اثرِ اجرا و کفِ سودِ مطلق — اما بدونِ هیچ لایه‌یِ ریسک/تحلیل).

### ۴. آیا Technical/Price Analysis وجود دارد؟

**خیر، به‌هیچ‌وجه.** تنها «قیمتِ مرجع» در کل فایل یک ثابتِ صریح است:

```ts
// خطِ ۹۲
const PAR_VALUE = 1.0; // reference value per unit of any recognized stablecoin
```

هیچ Kline (`/api/v3/klines`)، هیچ `ticker/24hr`، هیچ تاریخچه‌یِ قیمت، هیچ محاسبه‌یِ Momentum/Volatility/Trend در هیچ‌کجایِ این فایل وجود ندارد. مقایسه‌شونده با انحراف از `$1` تنها همان یک لحظه‌یِ VWAPِ فعلی است — یک انحرافِ کوچکِ سالم و یک انحرافِ بزرگِ ناشی از بحران، از نظرِ فرمول **کاملاً یکسان** برخورد می‌شوند (فقط عددِ نتیجه فرق دارد، نه نوعِ برخورد).

### ۵. آیا Order Book Analysis کافی است؟

**ناکافی.** `getOrderBookQuote` (خطِ ۴۹۷-۵۱۷) فقط یک عملیات انجام می‌دهد: پیمایشِ سطوحِ دفترِ سفارش تا رسیدن به حجمِ دقیقاً درخواستی، و بازگرداندنِ `bestPrice`/`vwapPrice`/`filledNotional`/`fullyFilled`. هیچ‌کدام از این‌ها بررسی نمی‌شود:
- عمقِ چندلایه (چند سطحِ اول در برابرِ کلِ کتاب)
- عدمِ تعادلِ خرید/فروش (Bid/Ask Imbalance)
- سرعتِ تغییرِ عمق در طولِ زمان (نیاز به Snapshotِ متوالی دارد)
- احتمالِ خالی‌شدنِ ناگهانیِ دفتر

### ۶. آیا Stablecoin Risk Model وجود دارد؟

**خیر.** فقط یک مجموعه‌یِ ثابت و بدونِ رتبه‌بندی:

```ts
// خطِ ۹۱
const STABLE_ASSETS = new Set(['USDT', 'USDC', 'FDUSD', 'TUSD', 'DAI', 'USD1', 'BUSD']);
```

`USDC`/`USDT` (فیات‌پشتوانه، عمیق، باسابقه) و `DAI` (وثیقه‌یِ کریپتویی، مکانیزمِ متفاوت) و `BUSD` (منسوخ‌شده، دیگر توسطِ Binance صادر نمی‌شود) همگی **دقیقاً یک وزنِ ریسکِ یکسان (صفر)** دارند. هیچ معیارِ سن، حجمِ بازار، سابقه‌یِ حفظِ Peg، یا نوعِ مکانیزم بررسی نمی‌شود.

### ۷. آیا News Risk وجود دارد؟

**خیر، در این موتور.** پروژه یک زیرسیستمِ خبریِ عمومی دارد (`api/news.ts`، شاملِ `fetchCoinEnglishNews(symbol)`/`fetchCoinFeedNews(symbol)` از CryptoPanic/RSS + ترجمه‌یِ AIِ رایگان) — اما این ماژول **هرگز** توسطِ `api/stablecoin-engine.ts` فراخوانی نمی‌شود. زیرساختِ خام (دریافتِ خبرِ به‌ازایِ نماد) موجود است؛ لایه‌یِ طبقه‌بندیِ شدت/اعتبار (که برایِ اصلِ ششمِ کاربر لازم است) کاملاً غایب است.

### ۸. آیا Concentration Risk وجود دارد؟

**خیر، هیچ نشانه‌ای.** موجودی می‌تواند صد در صد یک‌طرفه شود بدونِ هیچ پرچم یا هشدارِ جداگانه (فراتر از خودِ اعدادِ خامِ موجودی).

### ۹. آیا Capacity و Reserve درست از هم تفکیک شده‌اند؟

**بله — طبقِ گزارشِ ۰۶:۴۲، این تفکیک از نظرِ ریاضی کاملاً درست طراحی شده (فقط دو خطِ کد نیاز به اصلاح دارند، بدونِ ارتباط به این گزارش).** این سؤال در این گزارش دوباره بازبینی نشد چون قبلاً به‌طورِ کامل و با اثباتِ عددی پاسخ داده شده بود.

---

## بخشِ ۲ — دارایی‌هایِ از‌قبل‌آماده اما استفاده‌نشده (یافته‌یِ مهم)

یک کشفِ مهمِ این ممیزی: جدولِ `stablecoin_pair_snapshots` (`migrations/stablecoin_engine.sql`، خطِ ۱۱۸-۱۲۷) **از همان روزِ اولِ این پروژه دقیقاً برایِ همین منظور طراحی شده** («raw per-tick market observation... collected from now on only») — شاملِ `bid, ask, fee_verified, liquidity_usd, captured_at` — اما **هرگز حتی یک ردیف در آن نوشته نشده است** (هیچ `INSERT` به این جدول در کلِ `api/stablecoin-engine.ts` وجود ندارد). این جدول دقیقاً همان زیرساختِ داده‌یِ تاریخی است که یک لایه‌یِ Technical Analysis به آن نیاز دارد — **از قبل در دیتابیس وجود دارد، فقط متصل نشده.**

همچنین، تابعِ `getStablecoinTrend30d` (`api/analyze.ts`، خطِ ۳۷۸) در موتورِ اصلیِ تحلیلِ AI وجود دارد — اما این یک معیارِ **کاملاً متفاوت** است (روندِ ۳۰-روزه‌یِ عرضه‌یِ کلِ استیبل‌کوین در کلِ بازار، از DefiLlama، به‌عنوانِ سیگنالِ کلانِ Risk-On/Risk-Off) — **نه** پایداریِ Peg یا قیمتِ یک جفتِ خاص. قابلِ استفاده نیست به‌عنوانِ جایگزین، اما به‌عنوانِ یک ورودیِ کمکیِ اختیاریِ کلان قابلِ‌بررسی است (خارج از محدوده‌یِ این گزارش).

---

## بخشِ ۳ — معماریِ پیشنهادیِ Decision Pipeline

پیشنهادِ کاربر:

```
Market Data → Price/Technical → Order Book → Executable Liquidity → Opportunity Calc
→ Stablecoin Risk → News Risk → Concentration/Capacity → Final Decision
```

**پیشنهادِ اصلاح‌شده (با توجیه):**

```
1. Symbol Eligibility        (ارزان، Cache شده — آیا این نماد اصلاً TRADING است؟)
2. Stablecoin Risk Tier      (ارزان، به‌کندی تغییر می‌کند — تعیینِ "زمینه"یِ ریسک، پیش از هر تحلیلِ دیگر)
3. News / Event Risk (خواندنِ Cache) (بدونِ فراخوانیِ زنده در مسیرِ حیاتی — رفرشِ پس‌زمینه)
4. Fee Verification           (زنده، fail-closed، بدونِ تغییر نسبت به امروز)
5. Price / Technical Snapshot (Cache کوتاه‌مدت، به‌اشتراک‌گذاشته‌شده بینِ هر دو جهت و بینِ چرخه‌ها)
6. Order Book + Executable Liquidity (زنده، بدونِ تغییر نسبت به امروز، فقط غنی‌شده با معیارهایِ بیشتر)
7. Opportunity Calculation     (همان ریاضیاتِ فعلی — اسپرد/کارمزد/اثرِاجرا/سودِخالص)
8. Composite Risk Gate         (لایه‌یِ جدید — ترکیبِ ۲+۳+۵+۶ به یک تصمیمِ Context-Aware)
9. Concentration Signal (فقط ثبت، بدونِ اِعمالِ محدودیت در این فاز)
10. Capacity/Reserve Check     (همان بررسیِ موجودیِ فعلی — بدونِ تغییر)
11. Final Decision             (EXECUTE یا REJECT: [دلیلِ دقیق])
```

**چرا این ترتیب بهتر است:**
- **مرحله‌یِ ۲ (Risk Tier) زودتر می‌آید** چون باید **زمینه**‌یِ ارزیابیِ مراحلِ بعدی را فراهم کند (طبقِ تأکیدِ صریحِ کاربر: «وزنِ ریسک برایِ USDC/USDT با یک استیبل‌کوینِ جدید یکسان نباشد») — اگر این مرحله بعد از محاسبه‌یِ فرصت بیاید (طبقِ پیشنهادِ اولیه‌یِ کاربر)، آستانه‌هایِ مراحلِ قبلی نمی‌توانند بر اساسِ آن تنظیم شوند.
- **News Risk فقط از Cache خوانده می‌شود**، هرگز یک فراخوانیِ زنده در مسیرِ حیاتی نیست (بخشِ ۵ توضیح می‌دهد چرا).
- **Concentration به‌عنوانِ یک «سیگنالِ ثبت‌شونده» جدا شده**، نه یک Gate — دقیقاً طبقِ دستورِ صریحِ کاربر که در این فاز نباید محدودیتی اِعمال شود.
- ترتیبِ داخلیِ ۴ تا ۷ **عیناً همانِ امروز** باقی می‌ماند — هیچ تغییری در منطقِ اثبات‌شده و تست‌شده‌یِ فعلی لازم نیست.

---

## بخشِ ۴ — خروجیِ Decision Engine (واژگانِ REJECT، فقط با وجودِ واقعیِ شرط)

طبقِ دستورِ صریحِ کاربر، هر دلیل **فقط** وقتی ثبت می‌شود که آن شرطِ خاص واقعاً برقرار باشد — هیچ Reject Reason عمومی/جایگزین وجود ندارد:

| دسته | دلیل | نوع (بخشِ ۵) |
|---|---|---|
| اقتصادی (بدونِ تغییر) | `Fee unverified`, `Capital insufficient`, `Notional too small`, `Spread too small`, `Profit below minimum`/`Fees eliminate profit` | Hard Gate |
| موجودی/نقدینگی (بدونِ تغییر، از فازِ دیروز) | `INSUFFICIENT_ALLOCATION_INVENTORY`, `INSUFFICIENT_MARKET_LIQUIDITY` | Hard Gate |
| **جدید — تکنیکال/قیمت** | `Negative Momentum`, `Abnormal Deviation` (انحرافِ شدیدِ غیرِطبیعی از رفتارِ اخیر) | Weighted؛ فقط در موردِ شدیدِ صریح، Hard |
| **جدید — استیبل‌کوین** | `High Stablecoin Risk` | همیشه Weighted (هرگز Hard به‌تنهایی) |
| **جدید — خبری** | `Negative News Risk` (کم‌شدت) / `Confirmed Depeg/Event Risk` (تأییدشده، شدید) | کم‌شدت=Weighted؛ تأییدشده‌یِ شدید=Hard (تعلیقِ موقتِ نماد) |
| **جدید — دفترِ سفارش** | `Order Book Instability` (عدمِ‌تعادل/تغییرِ سریع، نه کمبودِ حجم) | Weighted |
| **جدید — تمرکز (فقط ثبت)** | `Concentration Signal` (هرگز REJECT در این فاز) | فقط اطلاع‌رسانی — بدونِ اثر بر تصمیم |
| موجود (بدونِ تغییر) | `Capacity / Reserve Unavailable` (= همان `INSUFFICIENT_ALLOCATION_INVENTORY` با واژه‌یِ گویاتر برایِ حالتِ خاصِ اتمامِ ظرفیت) | Hard Gate |

---

## بخشِ ۵ — Hard Gate در برابرِ Weighted/Risk Score (پاسخ به سؤالِ ۱۳ کاربر)

**اصلِ طراحی:** فقط شرایطِ **عینی و قطعی** (نه قضاوتی) باید Hard Gate باشند — چون این‌ها هرگز false-positive ندارند (یا کارمزد صفر است یا نیست؛ یا موجودی کافی است یا نیست). هر شرطی که ذاتاً یک **قضاوتِ درجه‌بندی‌شده** است (چقدر ریسکناک؟ چقدر خبر معتبر است؟ چقدر انحرافِ قیمت نگران‌کننده است؟) باید **Weighted** باشد — تا از دقیقاً همان مشکلی که کاربر صریحاً هشدار داد جلوگیری شود: «Engine نباید بیش از حد سخت‌گیر شود».

**نکته‌یِ طراحیِ حیاتی (پاسخ به بخشِ ۱۶ سؤالِ کاربر):** لایه‌یِ Weighted باید یک **امتیازِ ترکیبیِ محدود** (مثلاً بینِ ۰ تا ۱) باشد، **نه** یک زنجیره‌یِ AND شده از فیلترهایِ مستقل. اگر هر سیگنالِ ضعیف (مثلاً کمی Momentumِ منفی + یک خبرِ کم‌اعتبار + کمی عدمِ‌تعادلِ دفترِ سفارش) به‌طورِ مستقل بتواند رد کند، این سه سیگنالِ **بی‌ضرر** ترکیب می‌شوند و یک فرصتِ کاملاً سالم را رد می‌کنند — دقیقاً همان خطایِ بیش‌محافظه‌کاری که باید اجتناب شود. طراحیِ صحیح: هر سیگنال یک **وزنِ عددی** به امتیازِ ترکیبی اضافه می‌کند؛ فقط عبورِ امتیازِ **کل** از یک آستانه (که خودش بر اساسِ Risk Tier تنظیم می‌شود — بخشِ ۶) باعثِ Reject می‌شود.

**استثنایِ صریح (Hard Trip-Wire داخلِ لایه‌یِ Weighted):** دو حالت باید مستقل از امتیازِ ترکیبی، به‌تنهایی کافی برایِ توقفِ موقتِ معامله باشند — دقیقاً چون این‌ها «شدتِ غیرِقابلِ‌چشم‌پوشی» دارند: (الف) یک رویدادِ خبریِ **تأییدشده و بسیار معتبر** (مثلاً توقفِ رسمیِ بازخرید توسطِ ناشر) — نه یک شایعه؛ (ب) یک الگویِ قیمتیِ **کاملاً غیرِمبهم و شدید** (سقوطِ سریع، شتاب‌گیرنده، بدونِ بازگشت — دقیقاً الگویِ UST/LUNA که کاربر مثال زد). این دو مورد در طراحی به‌صراحت جدا نگه داشته می‌شوند تا هرگز به‌اشتباه با سیگنال‌هایِ ضعیف‌ترِ روزمره یکی تلقی نشوند.

---

## بخشِ ۶ — Context-Aware بودن: تفاوتِ USDC/USDT با استیبل‌کوینِ جدید (پاسخ به سؤالِ ۱۴)

پیشنهاد: `Stablecoin Risk Tier` یک عددِ ضریب (مثلاً `1.0` برایِ لایه‌یِ کم‌ریسک، بزرگ‌تر از `1.0` برایِ لایه‌هایِ پرریسک‌تر) تولید می‌کند که **فقط** رویِ آستانه‌هایِ Weighted اثر می‌گذارد — هرگز رویِ Hard Gateها (کارمزد/موجودی/سرمایه که برایِ همه یکسان می‌مانند):

| لایه (مثال، فقط تصویری) | نمونه | اثر بر آستانه‌یِ Weighted |
|---|---|---|
| Tier 1 — عمیق، باسابقه، فیات‌پشتوانه | USDC, USDT | آستانه‌یِ رد نزدیک به صفر — یک سیگنالِ ضعیف به‌تنهایی هرگز رد نمی‌کند |
| Tier 2 — تثبیت‌شده اما با مکانیزمِ متفاوت یا کم‌حجم‌تر | FDUSD, TUSD, DAI | آستانه‌یِ متوسط — چند سیگنالِ هم‌زمان لازم است |
| Tier 3 — جدید/کم‌سابقه/الگوریتمی | (هر نمادِ خارج از فهرستِ شناخته‌شده) | آستانه‌یِ پایین‌تر (حساس‌تر) — یک سیگنالِ حتی متوسط کافی است تا امتیازِ ترکیبی رد کند؛ ولی **هنوز** یک Reject قطعیِ خودکار نیست |

این جدول **فقط تصویری/مثال است**، نه یک فرمولِ نهایی — دقیقاً همان‌طور که کاربر خواسته، قبل از هر Implementation باید توسطِ او تأیید شود.

---

## بخشِ ۷ — داده‌هایِ لازم (پاسخ به سؤالِ ۱۱ و ۱۲)

| داده | تازگیِ لازم | منبع | وضعیتِ فعلی |
|---|---|---|---|
| کارمزد | زنده، هر چرخه | `verifyPairFeeLive` (موجود) | ✅ از قبل پیاده شده |
| دفترِ سفارش/VWAP | زنده، هر چرخه | `getOrderBookQuote` (موجود) | ✅ از قبل پیاده شده |
| موجودیِ Allocation | زنده، هر چرخه | `stablecoin_demo_inventory` (موجود) | ✅ از قبل پیاده شده |
| **تاریخچه‌یِ قیمت/عمق (برایِ Trend/Momentum)** | نیمه‌زنده (~۶۰-۹۰ ثانیه Cache، مشترک بینِ دو جهت و بینِ چرخه‌ها) | **جدید — نیاز به `/api/v3/klines` (فراخوانیِ Binanceِ تازه) + نوشتن در جدولِ ازقبل‌موجودِ `stablecoin_pair_snapshots`** | ❌ هیچ‌کدام موجود نیست؛ زیرساختِ جدول آماده است (بخشِ ۲) |
| رتبه‌بندیِ ریسکِ استیبل‌کوین | کند‌تغییر (ساعت‌ها تا روزها؛ می‌تواند یک جدولِ کوچکِ استاتیک یا پیکربندی‌شده باشد) | **جدید — نیاز به یک منبعِ داده (حتی یک جدول/فهرستِ دستیِ اولیه کافی است؛ بعداً می‌تواند از سنِ نماد/حجمِ بازار/CoinGecko و مشابه غنی شود)** | ❌ فقط یک فهرستِ تخت (`STABLE_ASSETS`) بدونِ رتبه |
| ریسکِ خبری | Cacheِ میان‌مدت (۵ تا ۱۵ دقیقه — رویدادهایِ واقعاً بحرانی در این بازه هم قابلِ‌تشخیص‌اند) | **جدید — `api/news.ts` به‌عنوانِ منبعِ خام از قبل موجود است؛ لایه‌یِ طبقه‌بندیِ شدت/اعتبار باید ساخته شود** | ❌ ماژول موجود، اتصال و طبقه‌بندی غایب |

---

## بخشِ ۸ — Latency و جلوگیری از کندشدنِ بیش‌ازحد (پاسخ به سؤالِ ۱۵ و ۱۶)

وضعیتِ فعلی: هر چرخه‌یِ یک Allocation ≈ ۲ تا ۳ فراخوانیِ Binance (یک `verifyPairFeeLive` + دو `getOrderBookQuote`، برایِ هر دو جهت)، تقریباً ۳۰۰ میلی‌ثانیه تا ۱ ثانیه.

**هدفِ پیشنهادی:** افزودنِ لایه‌هایِ جدید نباید بیش از **~۳۰۰ میلی‌ثانیه** (بدترین حالت، وقتی Cacheها سرد باشند) به مسیرِ حیاتی اضافه کند، و در حالتِ معمول (Cacheِ گرم) عملاً **صفر**. این با سه اصل تضمین می‌شود:
۱. **News Risk هرگز در مسیرِ چرخه فراخوانیِ زنده ندارد** — فقط از یک Cacheِ پس‌زمینه‌ای (رفرش‌شونده هر ۵-۱۵ دقیقه، مستقل از چرخه‌یِ ۵ دقیقه‌ایِ Scheduler) خوانده می‌شود.
۲. **Stablecoin Risk Tier یک محاسبه/Lookupِ درون‌حافظه‌ای است** (نه یک فراخوانیِ شبکه) — عملاً بدونِ تأخیر.
۳. **Kline/Technical Snapshot با یک Cacheِ کوتاه‌مدتِ مشترک** (۶۰-۹۰ ثانیه، مشترک بینِ دو جهت و بینِ چند Allocationِ هم‌جفت) — دقیقاً همان الگویِ Cachingِ از‌قبل‌اثبات‌شده در این فایل (`pairMonitorCache`, `allocationPreviewCache`, `discoverStablecoinPairsCache`).

**جلوگیری از ازدست‌رفتنِ فرصت:** طبقِ بخشِ ۵، امتیازدهیِ ترکیبی (نه زنجیره‌یِ AND) و آستانه‌یِ وابسته به Tier، تضمین می‌کند یک فرصتِ USDC/USDT با تمامِ سیگنال‌هایِ سالم (طبقِ مثالِ صریحِ کاربر) **هرگز** فقط به‌خاطرِ یک شاخصِ ضعیفِ نامرتبط رد نشود.

---

## بخشِ ۹ — Migrationهایِ قبلی و برداشت‌هایِ اشتباه (بازتأیید، بدونِ تکرار)

طبقِ گزارشِ ۰۶:۴۲ امروز: `stablecoin_allocation_inventory_seed_fix.sql` (Seedِ کاملاً در Quote) بر مبنایِ برداشتِ اشتباه بود؛ `stablecoin_pair_allocations.sql` (فرمولِ ۵۰/۵۰ِ اصلی) درست بود. **این گزارش هیچ تغییری در این نتیجه‌گیری ایجاد نمی‌کند** — لایه‌یِ ریسکِ جدید کاملاً مستقل از فرمولِ Seed/Capacity عمل می‌کند (رویِ تصمیمِ EXECUTE/REJECT اثر می‌گذارد، نه رویِ اینکه چقدر پول در کدام Asset باشد).

---

## بخشِ ۱۰ — تأثیرِ معماری (اگر تأیید شود؛ فقط فهرست، بدونِ Implementation)

- `discoverStablecoinPairs`/`STABLE_ASSETS` → افزودنِ یک Lookup Table برایِ Risk Tier (بدونِ حذفِ فهرستِ فعلی).
- تابعِ جدید: `getPriceTechnicalSnapshot(symbol)` — فراخوانیِ Klines، محاسبه‌یِ Trend/Momentum/Deviation، نوشتن در `stablecoin_pair_snapshots` (جدولِ ازقبل‌موجود)، Cacheِ ۶۰-۹۰ ثانیه‌ای.
- تابعِ جدید: `getStablecoinEventRisk(symbol)` — خواندنِ Cacheِ پس‌زمینه (که خودش از `api/news.ts` یا مشابه، با رفرشِ مستقلِ ۵-۱۵ دقیقه‌ای، تغذیه می‌شود).
- تابعِ جدید: `computeCompositeRiskScore(...)` — ترکیبِ خروجیِ سه تابعِ بالا + معیارهایِ غنی‌شده‌یِ دفترِ سفارش، تولیدِ یک امتیازِ محدود + دلیلِ Weighted (در صورتِ عبور از آستانه).
- `classifyStablecoinExecutability`/`decideStablecoinTrade` → افزودنِ یک مرحله‌یِ جدید (بعد از محاسبه‌یِ سود، قبل از تصمیمِ نهایی) که نتیجه‌یِ `computeCompositeRiskScore` را می‌خواند — **بدونِ تغییر در هیچ‌کدام از مراحلِ Hard Gateِ فعلی**.
- `StablecoinDecision`/`persistCycleDecisions` → افزودنِ فیلدهایِ جدید برایِ ثبتِ امتیازِ ریسک و دلیلِ دقیق (برایِ شفافیتِ کاملِ گزارش‌شده در بخشِ ۴).
- **هیچ تغییری در:** فرمولِ Seed، `notionalUsd`، `runAllocationCycle`ی اصلی، `simulateStablecoinTrade`، Asset Conflict Rule، Scheduler.

---

## بخشِ ۱۱ — سؤالاتی که هنوز نیاز به تأییدِ کاربر دارند

۱. **آیا ترتیبِ پیشنهادیِ بخشِ ۳ (Risk Tier زودتر از Opportunity Calculation) تأیید می‌شود، یا ترتیبِ اصلیِ خودِ کاربر ترجیح داده می‌شود؟**
۲. **منبعِ اولیه‌یِ Risk Tier چه باشد؟** یک فهرستِ دستیِ ساده (مثلِ `STABLE_ASSETS` فعلی، اما با سه سطح)، یا یک معیارِ محاسبه‌شده (سن/حجم/API خارجی)؟
۳. **منبعِ News Risk کدام باشد؟** استفاده از `api/news.ts`یِ موجود (با افزودنِ یک لایه‌یِ طبقه‌بندیِ شدت)، یا یک سرویسِ اختصاصی؟
۴. **آستانه‌هایِ دقیقِ عددیِ Weighted Score** (مثلِ جدولِ تصویریِ بخشِ ۶) — این‌ها باید صراحتاً توسطِ کاربر تعیین/تأیید شوند، نه توسطِ من به‌طورِ یک‌جانبه.
۵. **آیا افزودنِ فراخوانیِ Klines (یک Endpointِ جدیدِ Binance که تا امروز هرگز توسطِ این موتور استفاده نشده) مجاز است؟**

---

## Production Safety

Zero code changes, zero migrations, zero database writes, zero Allocations touched/stopped/created, zero trades created, zero scheduler changes, zero Binance orders, zero commits, zero pushes, zero deploys. `signal0verse/signalverse-main` remains at commit `c497c6b`, unchanged.

---

## FINAL STATUS TABLE

```
CAPITAL/CAPACITY CONTRACT (0642 report): REAFFIRMED UNCHANGED, no contradiction found in this message
CURRENT DECISION LOGIC VERDICT: "Fee=0 + Spread>0 (net of fee/impact) = EXECUTE" - confirmed exactly as the user described, zero risk layer
TECHNICAL/PRICE ANALYSIS: ABSENT (no klines, no ticker, no trend/momentum/volatility anywhere in the file)
ORDER BOOK ANALYSIS: SINGLE-POINT VWAP ONLY - no multi-layer depth, no imbalance, no rate-of-change
STABLECOIN RISK MODEL: ABSENT (flat, unranked asset set)
NEWS RISK: ABSENT in this engine (a general news module exists in api/news.ts, never wired to this engine)
CONCENTRATION RISK: ABSENT (by design, not implemented in this phase per explicit user instruction)
UNUSED EXISTING ASSET FOUND: stablecoin_pair_snapshots table (provisioned since day one, zero rows ever written) -
  directly usable as the technical-analysis history store
PROPOSED PIPELINE: 11 stages, reordered from the user's draft to move Stablecoin Risk Tier earlier (for
  context-aware downstream thresholds) and to make News Risk a pure cache-read (zero hot-path latency)
HARD GATE vs WEIGHTED CLASSIFICATION: DONE (bخش ۵) - only objective/binary facts stay Hard; all judgment-based
  signals are Weighted via a single bounded composite score, with 2 explicit hard trip-wires (confirmed severe
  news event; unambiguous extreme price-collapse pattern)
LATENCY TARGET PROPOSED: +300ms worst-case (cold cache), ~0ms typical (warm cache), via background-refreshed
  News cache, in-memory Risk Tier lookup, and a shared 60-90s Technical Snapshot cache
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
AWAITING: user approval of the pipeline ordering, Hard/Weighted classification, and the 5 open questions in بخش ۱۱
  before any implementation
```
