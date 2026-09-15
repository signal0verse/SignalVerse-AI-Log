# Stablecoin Engine — Foundational Strategy-Contract Audit: the Round-Trip Model, Capacity=1 as the Base Case, and the REAL Root Cause (Read-Only)

## Metadata

- Date: 2026-09-16 (session continued)
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine — Allocation architecture)
- Mode: **Foundational, read-only strategy audit** — the user explicitly stated the last two "fixes" (quote-only seeding, and this session's own floor/ceil proposal) were built on a **misunderstanding of the core strategy**, and asked for a from-scratch extraction of the real strategy contract before any further code is touched. Zero code changes, zero migrations, zero database writes, zero Allocation changes, zero trades, zero scheduler changes, zero Binance orders, zero commit/push/deploy in this task.
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e
- Ending commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e (**unchanged**)

## Objective

The user provided a detailed, numbered description of the intended strategy and asked for a ground-up re-derivation: extract the exact strategy contract, compare it field-by-field against the current code, and produce a precise mathematical model for `Capacity ∈ {1,2,3,5}` — explicitly warning that **Capacity=1 must be the fully valid base case**, not a degenerate edge case, and that "Required Liquidity" must never be confused with "per-trade size." Critically, the user's own numeric example (see بخش ۹) reveals something neither of this session's two prior proposals (quote-only seed, floor/ceil seed) considered: **the per-trade size itself was wrong**, not just the seeding split.

---

## بخش ۱ — قرارداد استراتژی که از توضیحات کاربر استخراج شد

۱. موتور یک جفتِ استیبل‌کوین/استیبل‌کوین را رصد می‌کند و بینِ دو دارایی‌اش سرمایه جابه‌جا می‌کند («شکارِ فرصت»، نه یک برنامه‌ی معاملاتیِ زمان‌بندی‌شده).
۲. جهت‌ها دقیقاً بر مبنایِ دارایی پایه نام‌گذاری می‌شوند: `BUY {base} = quote→base`، `SELL {base} = base→quote`. برایِ `USDCUSDT`: `BUY USDC = USDT→USDC`، `SELL USDC = USDC→USDT`.
۳. `Trading Capital` نشان‌دهنده‌یِ سرمایه‌یِ **یک چرخه‌یِ کاملِ رفت‌وبرگشت** است، نه اندازه‌یِ یک معامله‌یِ منفرد. اندازه‌یِ هر معامله‌یِ منفرد **نصفِ** آن است.
۴. `Capacity=1` حالتِ پایه و کاملاً معتبر است — نباید هرگز غیرقابل‌اجرا تلقی شود.
۵. یک چرخه‌یِ کاملِ «یک رفت + یک برگشت» به‌تنهایی یک عملکردِ صحیح و کافی برایِ `Capacity=1` است؛ نباید انتظارِ فرصت‌هایِ متعددِ متوالی وجود داشته باشد.
۶. ظرفیت‌هایِ بالاتر **اختیاری‌اند** و فقط سرمایه‌یِ رزرو برایِ جذبِ فرصت‌هایِ متوالیِ بیشتر در یک جهت فراهم می‌کنند — هرگز شرطِ اجرایِ اصلِ چرخه‌یِ رفت‌وبرگشت نیستند.
۷. سود جداگانه محاسبه و ثبت می‌شود؛ هرگز اندازه‌یِ معامله/سرمایه/ظرفیت/نقدینگیِ موردنیاز را به‌صورتِ خودکار افزایش نمی‌دهد (اصلِ عدمِ ترکیب که پیش‌ازاین هم در معماری وجود داشت و باید حفظ شود).
۸. `Required Liquidity` صرفاً یک **بودجه‌یِ کلِ رزروشده** است — نه اندازه‌یِ معامله، و نه موجودیِ یک طرف.
۹. موتور مجبور به معامله‌یِ دائمی نیست؛ ممکن است ساعت‌ها/روزها منتظر بماند.

---

## بخش ۲ — اشتباهات موجود در معماری فعلی

**یافته‌یِ اصلیِ این ممیزی (که در دو دورِ قبلیِ بررسی، از جمله توسطِ من، دیده نشده بود):**

کدِ فعلی (`runAllocationCycle`, `computeAllocationLivePreview` در `api/stablecoin-engine.ts`) اندازه‌یِ **هر** معامله را همیشه برابرِ **کاملِ** `trading_capital_usd` قرار می‌دهد:

```ts
// خطِ ۸۱۹، ۸۲۲ (runAllocationCycle) و خطِ ۷۵۴، ۷۵۸ (computeAllocationLivePreview) — عیناً یکسان:
const quote = await getOrderBookQuote(sym.symbol, side, tradingCapitalUsd);
...
notionalUsd: tradingCapitalUsd,
```

طبقِ قراردادِ استخراج‌شده (بخشِ ۱، بندِ ۳)، این **اشتباه** است: `Trading Capital` باید کلِ سرمایه‌یِ یک چرخه‌یِ رفت‌وبرگشت باشد، و اندازه‌یِ هر معامله‌یِ منفرد باید **نصفِ** آن باشد. مثالِ عددیِ خودِ کاربر این را با قطعیتِ ریاضی ثابت می‌کند:

- شروع: `USDT=2500, USDC=2500` (یعنی Trading Capital=$5,000 دقیقاً به‌صورتِ ۵۰/۵۰ تقسیم شده).
- معامله‌یِ رفت: **$2,500** (نه $5,000) از USDT به USDC.
- معامله‌یِ برگشت: **$2,500** (نه تمامِ ~$5,000 موجودیِ USDC در آن لحظه) از USDC به USDT.

این دقیقاً نشان می‌دهد `notionalUsd` باید `trading_capital_usd / 2` باشد، نه `trading_capital_usd`.

**نتیجه‌یِ مستقیم:** هر دو «اصلاحِ» قبلی در این پروژه (Seed کاملاً در Quote — فازِ دیروز؛ و پیشنهادِ `floor`/`ceil` من در همین امروز، قبل از این پیام) **هر دو، ریشه‌یِ واقعیِ مشکل را نادیده گرفته بودند.** هر دو تلاش کردند با تغییرِ **نحوه‌یِ Seed کردن** مشکل را حل کنند، درحالی‌که مشکلِ واقعی در جایِ دیگری بود: **عددی که به‌عنوانِ اندازه‌یِ معامله به موتورِ تصمیم‌گیری داده می‌شود، اشتباه است.**

مدلِ ۵۰/۵۰ (مدلِ اصلی، از اولین migration) با اندازه‌یِ معامله‌یِ **درست** (نصفِ Trading Capital)، دقیقاً همان چیزی است که کاربر توصیف کرده — و همان‌طور که در بخشِ ۹ ثابت می‌شود، برایِ **همه‌یِ** مقادیرِ Capacity (شاملِ ۱) کاملاً درست کار می‌کند. **۵۰/۵۰ هرگز اشتباه نبود؛ عددی که با آن مقایسه می‌شد اشتباه بود.**

---

## بخش ۳ — تعریف دقیق سرمایه فعال (Active Capital)

**سرمایه‌یِ فعال = `Trading Capital`.** این سرمایه‌یِ اختصاص‌یافته به **یک چرخه‌یِ کاملِ رفت‌وبرگشت** است. در `Capacity=1`، سرمایه‌یِ فعال دقیقاً برابرِ کلِ سرمایه‌یِ Allocation است (هیچ رزروی وجود ندارد). در `Capacity>1`، سرمایه‌یِ فعال همچنان همان یک `Trading Capital` باقی می‌ماند — چیزی که با Capacity تغییر می‌کند، سرمایه‌یِ **رزرو** است (بخشِ ۴)، نه سرمایه‌یِ فعال.

---

## بخش ۴ — تعریف دقیق سرمایه رزرو (Reserve Capital)

**سرمایه‌یِ رزرو = `Trading Capital × (Capacity − 1)`.** این سرمایه برایِ جذبِ فرصت‌هایِ **اضافی و متوالی در یک جهت**، فراتر از آنچه سرمایه‌یِ فعال به‌تنهایی پوشش می‌دهد، کنار گذاشته می‌شود. در `Capacity=1`، سرمایه‌یِ رزرو دقیقاً صفر است — این خودش دلیلِ ریاضیِ اینکه چرا `Capacity=1` باید کاملاً معتبر باشد: نبودِ رزرو به‌معنایِ نبودِ امکانِ معامله نیست؛ فقط به‌معنایِ نبودِ ظرفیتِ اضافی برایِ **بیش از یک** فرصتِ متوالیِ هم‌جهت است.

جمعِ سرمایه‌یِ فعال و رزرو دقیقاً برابرِ `Required Liquidity` است — این رابطه، تعریفِ صحیحِ `Required Liquidity` را می‌سازد (بخشِ ۱۶).

---

## بخش ۵ — تعریف دقیق Capacity

**`Capacity` = تعدادِ واحدِ معامله‌یِ هم‌جهتِ متوالی که هر یک از دو طرفِ جفت می‌تواند از حالتِ سرد اجرا کند، پیش از نیاز به یک فرصتِ برگشت.** این تعریف — برخلافِ تعریفِ فعلیِ کد (که Capacity را صرفاً یک ضریبِ محاسبه‌یِ `Required Liquidity`، بدونِ هیچ اثری در منطقِ تصمیم‌گیری، در نظر می‌گیرد) — واقعاً در کد **اِعمال نمی‌شود**، چون اندازه‌یِ معامله (که باید `Trading Capital/2` باشد) اصلاً به Capacity وابسته نیست؛ Capacity فقط تعیین می‌کند **چند برابرِ** آن واحدِ ثابت در هر طرف موجود باشد.

با اصلاحِ اندازه‌یِ معامله (بخشِ ۶)، این تعریف **به‌طورِ خودکار و بدونِ نیاز به هیچ شمارنده‌یِ جداگانه‌ای** از رویِ موجودیِ واقعی برآورده می‌شود: اگر هر طرف `Trading Capital × Capacity / 2` داشته باشد و هر معامله `Trading Capital/2` مصرف کند، دقیقاً `Capacity` معامله‌یِ متوالیِ هم‌جهت ممکن است — نه بیشتر، نه کمتر.

---

## بخش ۶ — تعریف دقیق اندازه هر فرصت (Opportunity Unit Size)

**`U = Trading Capital / 2`.** این عددِ **ثابت** (نه وابسته به موجودیِ لحظه‌ای، نه وابسته به سودِ انباشته‌شده، نه وابسته به Capacity) دقیقاً همان چیزی است که در هر معامله — چه رفت، چه برگشت، چه در `Capacity=1`، چه در `Capacity=5` — بایستی به‌عنوانِ `notionalUsd` به موتورِ تصمیم‌گیری داده شود.

**اثباتِ عددیِ مستقیم از مثالِ کاربر:** `Trading Capital=$5,000 → U=$2,500`، دقیقاً برابرِ حجمِ معامله‌یِ رفت **و** برگشت در مثالِ بخشِ ۱۲ کاربر.

---

## بخش ۷ — فرمول موجودی اولیه

```
هر طرف = Required Liquidity / 2 = (Trading Capital × Capacity) / 2
```

یعنی **دقیقاً همان فرمولِ ۵۰/۵۰ اصلی** (اولین migration، `stablecoin_pair_allocations.sql`، خطِ ۱۹۷-۱۹۸) — با این تفاوتِ حیاتی که این‌بار در کنارِ اندازه‌یِ معامله‌یِ **درست** (`U = Trading Capital/2`، نه `Trading Capital`) استفاده می‌شود.

| Capacity | Required Liquidity | هر طرف (Seed) | U (اندازه‌یِ هر معامله) | تعدادِ معاملاتِ متوالیِ هم‌جهتِ ممکن هر طرف |
|---|---|---|---|---|
| 1 | $5,000 | $2,500 | $2,500 | 1 |
| 2 | $10,000 | $5,000 | $2,500 | 2 |
| 3 | $15,000 | $7,500 | $2,500 | 3 |
| 5 | $25,000 | $12,500 | $2,500 | 5 |

**نکته‌یِ کلیدی:** با این اصلاح، دیگر هیچ نیازی به راه‌حلِ نامتقارن (Seed کاملاً در یک Asset، یا `floor`/`ceil` نامتقارن) نیست — ۵۰/۵۰ به‌تنهایی، برایِ **هر** Capacity، هم دوطرفه‌بودن را از لحظه‌یِ صفر تضمین می‌کند (چون `Required Liquidity/2 ≥ U` همیشه برقرار است — `Capacity×TradingCapital/2 ≥ TradingCapital/2` که برایِ `Capacity≥1` همیشه درست است) و هم دقیقاً `N` معامله‌یِ متوالیِ هم‌جهت را در **هر دو طرف به‌طورِ همزمان** فراهم می‌کند (نه فقط طرفِ غالب، برخلافِ پیشنهادِ `floor`/`ceil` که فقط یک طرف را کاملِ N می‌کرد).

---

## بخش ۸ — فرمول تغییر موجودی بعد از معامله

بدونِ تغییر نسبت به منطقِ فعلیِ `simulateStablecoinTrade` (این بخش از کد **صحیح** است — فقط عددی که به آن داده می‌شود اشتباه بوده):

```
fromAsset.balance -= U
toAsset.balance   += U + netProfitUsd
```

سود (`netProfitUsd`) دقیقاً همان‌جا، به‌عنوانِ واحدهایِ اضافیِ داراییِ مقصد، فیزیکی می‌شود — اما `U` برایِ معامله‌یِ **بعدی** ثابت می‌ماند (از `trading_capital_usd/2` دوباره محاسبه می‌شود، نه از موجودیِ رشدکرده) — این دقیقاً همان اصلِ «عدمِ ترکیبِ سود با اندازه‌یِ معامله» (بخشِ ۱ بندِ ۷) است که از قبل هم در طراحی وجود داشته و باید حفظ شود.

---

## بخش ۹ — شبیه‌سازی کامل Capacity = 1 (دقیقاً مثالِ اجباریِ کاربر، بخشِ ۱۲)

Trading Capital=$5,000 → `U=$2,500`. Seed: `USDT=2500, USDC=2500`.

| مرحله | جهت | موجودیِ مبدأ قبل | نیاز (`U`) | قابلِ‌اجرا؟ | موجودی بعد |
|---|---|---|---|---|---|
| ۰ (Seed) | — | — | — | — | USDT=2500, USDC=2500 |
| ۱ (رفت) | `USDT→USDC` (BUY USDC) | USDT=2500 | 2500 | **بله** (2500≥2500) | USDT=0, USDC≈5003 |
| ۲ (برگشت) | `USDC→USDT` (SELL USDC) | USDC≈5003 | 2500 | **بله** (5003≥2500) | USDC≈2503, USDT≈2502 |

**تعادل عملاً برگشته** (≈2500/2500 با اضافه‌یِ سودِ تجمعیِ ~$5). این چرخه با `Capacity=1` **کاملاً معتبر** است — دقیقاً هر دو معامله (رفت و برگشت) بدونِ هیچ ردِ کاذبی اجرا می‌شوند، چون در هر دو لحظه موجودیِ مبدأ (`2500` سپس `≈5003`) بزرگ‌تر یا مساویِ `U=2500` است.

**چرا کدِ فعلی این سناریو را رد می‌کند:** چون کدِ فعلی به‌جایِ `U=2500`، مقدارِ `notionalUsd=5000` (کاملِ Trading Capital) را طلب می‌کند. در مرحله‌یِ ۱، `2500 < 5000` → رد با `INSUFFICIENT_ALLOCATION_INVENTORY`. **این دقیقاً همان منطقِ اشتباهی است که در دو اصلاحِ قبلی (Seed کاملاً در Quote، سپسِ `floor`/`ceil` من) به‌جایِ اصلاحِ این عدد، سعی شد با تغییرِ موجودیِ اولیه دور زده شود** — که کارساز نبود چون خودِ عددِ ۵۰۰۰ (نه فقط توزیعِ Seed) اشتباه بود.

---

## بخش ۱۰ — شبیه‌سازی Capacity = 2

Required Liquidity=$10,000. Seed: `USDT=5000, USDC=5000`. `U=$2,500` (ثابت، مستقلِ از Capacity).

| مرحله | جهت | موجودیِ مبدأ قبل | نیاز | قابلِ‌اجرا؟ | موجودی بعد |
|---|---|---|---|---|---|
| ۱ | BUY USDC | USDT=5000 | 2500 | بله | USDT=2500, USDC≈7503 |
| ۲ | BUY USDC (دومین، متوالی، هم‌جهت) | USDT=2500 | 2500 | **بله** (دقیقاً کافی) | USDT=0, USDC≈10006 |
| ۳ | BUY USDC (سومین — فراتر از Capacity) | USDT=0 | 2500 | **خیر** (`INSUFFICIENT_ALLOCATION_INVENTORY` — درست، ظرفیت تمام شده) | — |
| ۴ | SELL USDC (برگشت) | USDC≈10006 | 2500 | بله | USDC≈7506, USDT≈2501 |

دقیقاً همان‌طور که بخشِ ۶ کاربر خواسته بود: «اگر بازار دو فرصتِ متوالی در یک جهت بدهد، ظرفیتِ دوم باید فرصتِ دوم را پوشش دهد» — مرحله‌یِ ۲ این را عیناً برآورده می‌کند، و مرحله‌یِ ۳ به‌درستی نشان می‌دهد که ظرفیت (نه بازار، نه یک باگ) مرزِ سومین معامله‌یِ متوالی است.

---

## بخش ۱۱ — شبیه‌سازی Capacity = 3

Required Liquidity=$15,000. Seed: `USDT=7500, USDC=7500`. `U=$2,500`.

سه معامله‌یِ متوالیِ `BUY USDC` ممکن است (`7500/2500=3`)، دقیقاً همان‌طور که آخرین بار (`3cc778cd` واقعی در Production) امیدِ رسیدن به آن را داشت — با این تفاوتِ حیاتی که اینجا `SELL USDC` **هم از همان لحظه‌یِ صفر** با `7500≥2500` کاملاً قابلِ‌اجراست، نه فقط بعد از اولین معامله‌یِ `BUY`.

اگر بازار (دقیقاً مثلِ داده‌یِ واقعیِ مشاهده‌شده در بخشِ ۸ ممیزیِ قبلی) از همان چرخه‌یِ اول `SELL USDC` مثبت بدهد: `USDC=7500≥2500` → **بلافاصله اجرا می‌شود** — برخلافِ مدلِ فعلی که تا ابد آن را رد می‌کرد.

---

## بخش ۱۲ — شبیه‌سازی Capacity = 5

Required Liquidity=$25,000. Seed: `USDT=12500, USDC=12500`. `U=$2,500`. هر طرف تا ۵ معامله‌یِ متوالیِ هم‌جهت را پوشش می‌دهد؛ هر دو طرف از لحظه‌یِ صفر کاملاً قابلِ‌اجرا (`12500≥2500`).

---

## بخش ۱۳ — رفت و برگشت یک‌فرصتی

دقیقاً بخشِ ۹ (بالا) — یک رفت + یک برگشت، هیچ نیازی به فرصتِ سوم نیست، `Capacity=1` را کاملاً ارضا می‌کند. **مهم:** موتور نباید هرگز تصور کند که چون `Capacity=1` است، «باید» فرصتِ بیشتری اتفاق بیفتد — همان یک چرخه، یک عملکردِ کاملاً موفق و پایان‌یافته است.

---

## بخش ۱۴ — دو فرصت متوالی در یک جهت

فقط با `Capacity≥2` ممکن است (بخشِ ۱۰، مراحلِ ۱-۲). با `Capacity=1`، دومین فرصتِ هم‌جهت (بدونِ برگشتِ میانی) به‌درستی با `INSUFFICIENT_ALLOCATION_INVENTORY` رد می‌شود — این **رد شدن** خودش رفتارِ صحیح است (سرمایه‌یِ رزرو کافی وجود ندارد)، نه یک باگ؛ کاربر باید Capacity را افزایش دهد اگر می‌خواهد این حالت را پوشش دهد.

---

## بخش ۱۵ — چند رفت و برگشت متوالی

توالیِ دلخواه (`رفت→رفت→برگشت`، `برگشت→برگشت→رفت`، `رفت→برگشت`، فقط `رفت`، فقط `برگشت`) همگی بدونِ نیاز به هیچ فرضِ ترتیبی به‌درستی مدیریت می‌شوند، چون تصمیم‌گیری در هر چرخه فقط به «آیا موجودیِ مبدأ ≥ U است؟» وابسته است — کاملاً بی‌حالت نسبت به توالیِ گذشته، دقیقاً همان‌طور که کاربر در بخشِ ۱۴ درخواستِ خود تأکید کرده بود.

---

## بخش ۱۶ — تفاوت Required Liquidity با حجم معامله

سه مفهومِ کاملاً مجزا (طبقِ درخواستِ صریحِ بخشِ ۱۰ کاربر):

| مفهوم | فرمول | نقش |
|---|---|---|
| **اندازه‌یِ هر فرصت (U)** | `Trading Capital / 2` | مقداری که در **هر** معامله (رفت یا برگشت) واقعاً جابه‌جا می‌شود |
| **سرمایه‌یِ فعال** | `Trading Capital` | بودجه‌یِ یک چرخه‌یِ کاملِ رفت‌وبرگشت (`=2×U`) |
| **سرمایه‌یِ رزرو** | `Trading Capital × (Capacity−1)` | بودجه‌یِ اضافی برایِ فرصت‌هایِ متوالیِ فراتر از یک چرخه |
| **نقدینگیِ موردنیازِ کل** | `Trading Capital × Capacity` (= فعال + رزرو) | فقط یک عددِ **بودجه‌ایِ کل**، هرگز اندازه‌یِ معامله، هرگز موجودیِ یک طرف |
| **موجودیِ اولیه‌یِ هر طرف** | `Required Liquidity / 2` | نتیجه‌یِ تقسیمِ بودجه‌یِ کل، نه یک مفهومِ مستقل |

---

## بخش ۱۷ — تفاوت موجودی داخلی با نقدینگی دفتر سفارش بایننس

این تمایز از قبل، در فازِ دیروز (commit `c497c6b`، همین امروز Deploy شد)، به‌درستی در کد پیاده شده و **توسطِ این ممیزی تأیید می‌شود که همچنان درست است** و نیازی به تغییر ندارد:

- `INSUFFICIENT_ALLOCATION_INVENTORY` = موجودیِ داخلیِ Allocation (این جدولِ `stablecoin_demo_inventory`) کافی نیست.
- `INSUFFICIENT_MARKET_LIQUIDITY` = دفترِ سفارشِ زنده‌یِ بایننس نمی‌تواند حجمِ درخواستی را پر کند (کاملاً مستقل از موجودیِ Allocation).

با اصلاحِ اندازه‌یِ معامله (بخشِ ۶)، این تمایز **دقیق‌تر و کاربردی‌تر** هم می‌شود: چون `U` نصفِ مقدارِ قبلی است، احتمالِ برخورد به کمبودِ نقدینگیِ **بازار** (که برایِ جفت‌هایِ استیبل‌کوینِ پرحجم بسیار نادر است) حتی کمتر می‌شود، و علتِ غالبِ رد شدن به‌طورِ طبیعی به سمتِ «موجودیِ Allocation» یا «اسپرد/سودِ ناکافی» متمرکز می‌ماند — دقیقاً آنچه از یک موتورِ درستْ‌طراحی‌شده انتظار می‌رود.

---

## بخش ۱۸ — تمام Allocationهای فعلی فقط به صورت خواندنی

(همان داده‌یِ Read-Only که در ممیزیِ قبلیِ همین جلسه جمع‌آوری و گزارش شد — بدونِ هیچ تغییرِ جدید در این مرحله؛ اینجا فقط از منظرِ مدلِ **جدیدِ** تصحیح‌شده بازخوانی می‌شود، بدونِ کوئریِ اضافیِ Production.)

| allocation_id | Trading Capital | Capacity | Seed فعلی (base/quote) | با مدلِ فعلیِ نادرست، دوطرفه؟ | با مدلِ صحیح (۵۰/۵۰ + `U=TC/2`)، اگر از نو Seed می‌شد، دوطرفه؟ |
|---|---|---|---|---|---|
| `3cc778cd-...` (USDCUSDT, Cap=3) | $5,000 | 3 | $0 / $15,000 | خیر | بله (`$7,500/$7,500`, `U=$2,500`) |
| `eea1374a-...` (FDUSDUSDC, Cap=2) | $5,000 | 2 | $5,000 / $5,000 | **بله (تصادفاً درست!)** | بله — دقیقاً همین Seed، فقط `U` باید `$2,500` باشد نه `$5,000` در محاسبه‌یِ کد |
| `a857cbdc-...` (TUSDUSDT, Cap=1) | $5,000 | 1 | $2,500 / $2,500 | خیر (چون کد `U=$5,000` می‌خواهد) | **بله — این Seed از قبل کاملاً درست است!** فقط عددِ مقایسه در کد باید اصلاح شود |
| `09b1c1ae-...` (USDCUSDT, Cap=1) | $5,000 | 1 | $2,500 / $2,500 | خیر | **بله — همین وضع** |

**نکته‌یِ بسیار مهم:** ۳ مورد از ۴ Allocation فعال (همه به‌جز `3cc778cd`) از قبل دقیقاً با فرمولِ Seed صحیح (۵۰/۵۰ اصلی، پیش از فازِ «Quote-Only») ساخته شده‌اند و **موجودیِ فعلیِ آن‌ها نیازی به هیچ تغییری ندارد** — تنها چیزی که باید اصلاح شود، مقایسه‌یِ اشتباه در `classifyStablecoinExecutability`/`decideStablecoinTrade` است (`notionalUsd` باید `trading_capital_usd/2` باشد). اگر این اصلاح انجام شود، این ۳ Allocation **بلافاصله و بدونِ نیاز به هیچ migration دیتایی**، هر دو جهت را به‌درستی ارزیابی خواهند کرد. تنها `3cc778cd` (تنها Allocationِ ساخته‌شده در بازه‌یِ کوتاهِ فازِ «Quote-Only») واقعاً به یک Seedِ جدید نیاز دارد (که طبقِ سیاستِ ثابتِ پروژه — «هیچ Allocation موجودی دستکاری نمی‌شود» — تصمیمی است که فقط با تأییدِ صریحِ کاربر و با Stop-and-recreate انجام می‌شود، نه به‌صورتِ خودکار).

هیچ‌کدام از این ۴ Allocation در این ممیزی لمس، تغییر، متوقف، یا بازسازی نشد.

---

## بخش ۱۹ — کدام بخش‌های کد فعلی باید کنار گذاشته شوند

- **فرمولِ Seedِ «کاملاً در Quote»** (`migrations/stablecoin_allocation_inventory_seed_fix.sql`) — نتیجه‌یِ برداشتِ اشتباه، باید کنار گذاشته شود.
- **پیشنهادِ `floor`/`ceil`** (پیشنهادِ این جلسه، همین امروز، پیش از دریافتِ این پیام) — نیز نتیجه‌یِ همان برداشتِ اشتباه (چون بر مبنایِ فرضِ غلطِ «هر معامله = کاملِ Trading Capital» بنا شده بود)، باید کنار گذاشته شود.
- **مقدارِ `notionalUsd: tradingCapitalUsd`** در `runAllocationCycle`/`computeAllocationLivePreview` — این خطِ اصلیِ اشتباه است.
- **تعریفِ ضمنیِ Capacity به‌عنوانِ «صرفاً ضریبِ بودجه، بدونِ اثر در تصمیم‌گیری»** — باید جایگزین شود با تعریفِ صحیح (بخشِ ۵): «تعدادِ واحدهایِ `U` که هر طرف در خود جای می‌دهد.»
- **هرگونه فرض که `Capacity=1` باید رد شود یا کمتر معتبر است** — کاملاً باید کنار گذاشته شود؛ این فرض هرگز در کدِ فعلی به‌صراحت نوشته نشده، اما نتیجه‌یِ **عملیِ** باگِ اندازه‌یِ معامله دقیقاً همین بوده است.

---

## بخش ۲۰ — کدام بخش‌ها قابل حفظ هستند

- **نام‌گذاریِ `BUY_BASE`/`SELL_BASE`** — تأییدشده، دقیقاً منطبق با قراردادِ کاربر (بخشِ ۱، بندِ ۲؛ کدِ خطِ ۱۱۰-۱۱۱ و ۵۰۶ در `api/stablecoin-engine.ts`، شاملِ `getOrderBookQuote`ای که واقعاً asks/bids را طبقِ همین قرارداد راه می‌رود). **هیچ تغییری در این بخش لازم نیست.**
- **فرمولِ `Required Liquidity = Trading Capital × Capacity`** — تأییدشده، صرفاً به‌عنوانِ بودجه‌یِ کل (بخشِ ۱۶)، بدونِ تغییر.
- **منطقِ `simulateStablecoinTrade` (تغییرِ موجودی بعدِ معامله)** — تأییدشده، منطقاً درست (بخشِ ۸)، فقط عددِ ورودی (`decision.notionalUsd`) باید از یک منبعِ درست تغذیه شود.
- **اصلِ عدمِ ترکیبِ سود** (`toQty = fromQty + netProfitUsd`، بدونِ اثر روی `notionalUsd` معامله‌یِ بعدی) — تأییدشده، دقیقاً همان‌طور که باید باشد.
- **تفکیکِ `INSUFFICIENT_ALLOCATION_INVENTORY` از `INSUFFICIENT_MARKET_LIQUIDITY`** (فازِ دیروز) — تأییدشده، همچنان صحیح و حتی مفیدتر می‌شود (بخشِ ۱۷).
- **رتبه‌بندیِ دو جهت بر اساسِ `netProfitUsd` و اجرایِ فقط بهترین در هر چرخه** (`rankStablecoinDecisions`) — بدونِ تغییر، سازگار با هر دو مدل.
- **قانونِ «no forced rebalancing, wait for a reverse opportunity»** — بدونِ تغییر، دقیقاً همان اصلی که کاربر در بخشِ ۷ توضیح داد.
- **Asset Conflict Rule، جدولِ `stablecoin_allocation_assets`، تمامِ منطقِ توقف/برداشتِ سود** — هیچ‌کدام به این ممیزی مربوط نیستند، بدونِ تغییر.

---

## بخش ۲۱ — مدل ریاضی نهایی پیشنهادی

```
U (اندازه‌یِ هر فرصت)     = Trading Capital / 2                [ثابت، مستقل از Capacity و سود]
سرمایه‌یِ فعال            = Trading Capital = 2 × U
سرمایه‌یِ رزرو            = Trading Capital × (Capacity − 1)
Required Liquidity        = Trading Capital × Capacity          [بدونِ تغییر نسبت به کدِ فعلی]
Seed هر طرف                = Required Liquidity / 2             [بازگشت به فرمولِ ۵۰/۵۰ِ اصلی]
اندازه‌یِ هر معامله (notionalUsd) = U                            [تنها خطِ کدی که باید تغییر کند]
```

**تأییدِ ریاضیِ کامل بودن:** هر طرف = `Trading Capital × Capacity / 2 = U × Capacity` → دقیقاً `Capacity` معامله‌یِ متوالیِ هم‌جهت در **هر دو طرف همزمان**، از لحظه‌یِ صفر، بدونِ فدا کردنِ هیچ جهتی، بدونِ تولیدِ سرمایه‌یِ مصنوعی (مجموعِ دو طرف همیشه دقیقاً `Required Liquidity` است).

---

## بخش ۲۲ — تست‌های لازم برای اثبات مدل

(فقط پیشنهاد؛ هیچ‌کدام در این ممیزی نوشته یا اجرا نشد.)

۱. `U = tradingCapitalUsd / 2` — تستِ واحدِ ساده برایِ چند مقدارِ Trading Capital.
۲. تکرارِ دقیقِ مثالِ بخشِ ۹ (Capacity=1، رفت+برگشت) با اعدادِ عینیِ کاربر، تأییدِ اینکه هر دو معامله `EXECUTABLE` می‌شوند.
۳. تکرارِ بخشِ ۱۰ (Capacity=2، دو رفتِ متوالی سپس سومی که رد می‌شود، سپس یک برگشت) — تأییدِ مرزِ دقیقِ Capacity.
۴. تستِ رگرسیون: با مدلِ جدید، هر Allocation موجود که از قبل ۵۰/۵۰ دارد (۳ از ۴ موردِ Production) بدونِ نیاز به Migration دیتایی، بلافاصله دوطرفه شود (شبیه‌سازی با داده‌یِ واقعیِ Read-Only، بدونِ نوشتن در DB).
۵. تستِ ساختاری: `grep`ی روی `api/stablecoin-engine.ts` که تأیید کند `notionalUsd`/`getOrderBookQuote` هرگز مستقیماً از `tradingCapitalUsd`/`trading_capital_usd` بدونِ تقسیم‌بر‌۲ استفاده نمی‌کنند.
۶. تستِ حفظِ عدمِ ترکیبِ سود: چند معامله‌یِ متوالیِ سودآور، تأییدِ اینکه `U` برایِ معامله‌یِ Nام همچنان دقیقاً برابرِ `U` معامله‌یِ اول است.

---

## بخش ۲۳ — آیا هنوز ابهام معماری وجود دارد؟

**سه تصمیمِ محصولی (نه ریاضی) باقی می‌ماند** که باید صریحاً توسطِ کاربر تأیید شود:

۱. **آیا فیلدِ ورودیِ کاربر («سرمایه‌یِ معامله») باید همچنان به‌معنایِ «سرمایه‌یِ کلِ یک چرخه» باشد (و UI به‌طورِ ضمنی بگوید «هر معامله نصفِ این خواهد بود»)، یا بهتر است این فیلد مستقیماً «اندازه‌یِ هر معامله» را از کاربر بگیرد و `Trading Capital` داخلی = ۲× آن باشد؟** از نظرِ ریاضی هر دو معادل‌اند؛ این صرفاً یک تصمیمِ UX است.
۲. **آیا Allocationِ `3cc778cd-...` (تنها موردی که واقعاً با Seedِ اشتباه ساخته شده) باید Stop و دوباره با Seedِ صحیح ساخته شود، یا کاربر تصمیمِ دیگری دارد؟** این یک تصمیمِ عملیاتی است که این ممیزی هرگز خودسرانه اجرا نمی‌کند.
۳. **آیا Trading Capital بسیار کوچک (مثلِ $25-$50 در Allocationهایِ آزمایشیِ قدیمی) باید همچنان مجاز باشد، با توجه به اینکه `U` (نصفِ آن) ممکن است سودِ واقعی را به زیرِ آستانه‌یِ حداقلِ $0.05 ببرد؟** این ممیزی هیچ تغییری در آستانه پیشنهاد نمی‌دهد؛ صرفاً این اثرِ جانبیِ عددی را گزارش می‌کند.

**از نظرِ ریاضی/فنی، هیچ ابهامِ معماریِ حل‌نشده‌ای باقی نمی‌ماند** — مدلِ بخشِ ۲۱ کاملاً مشخص، خودسازگار، و مستقیماً از رویِ مثال‌هایِ عددیِ خودِ کاربر اثبات‌شده است.

---

## Production Safety

Zero code changes, zero migrations, zero database writes (all queries in this task and its referenced prior audit were `SELECT`-only), zero Allocations touched/stopped/created, zero trades created, zero scheduler changes, zero Binance orders, zero commits, zero pushes, zero deploys. `signal0verse/signalverse-main` remains at commit `c497c6b`, unchanged.

---

## FINAL STATUS TABLE

```
STRATEGY CONTRACT EXTRACTED FROM USER'S DESCRIPTION: YES
REAL ROOT CAUSE IDENTIFIED: YES — NOT the seeding split (as both prior fixes assumed), but the per-trade notional
  being hardcoded to the FULL Trading Capital instead of Trading Capital / 2
PRIOR "QUOTE-ONLY" SEED FIX VERDICT: BUILT ON A MISUNDERSTANDING — should be reverted
PRIOR "floor/ceil" PROPOSAL (this session, same day) VERDICT: ALSO BUILT ON THE SAME MISUNDERSTANDING — should be discarded
ORIGINAL 50/50 SEED FORMULA VERDICT: CORRECT ALL ALONG, for every Capacity including 1 — once paired with the
  correct per-trade unit size (Trading Capital / 2)
CAPACITY=1 VALIDITY: CONFIRMED AS THE BASE CASE — fully executable go+return cycle, exactly as the user specified
BUY_BASE/SELL_BASE NAMING CONVENTION: CONFIRMED ALREADY CORRECT in code (matches "BUY {base} = quote->base" exactly)
MATHEMATICAL MODEL FOR CAPACITY 1,2,3,5: FULLY DERIVED AND NUMERICALLY VALIDATED against the user's own worked example
3 OF 4 REAL ACTIVE ALLOCATIONS: ALREADY SEEDED CORRECTLY (50/50) — need zero inventory change, only the engine's
  notional-size bug needs fixing for them to immediately become bidirectional
1 OF 4 REAL ACTIVE ALLOCATIONS (3cc778cd): SEEDED UNDER THE NOW-DISCREDITED "quote-only" MODEL — would need an
  explicit, user-approved stop-and-recreate to get the correct seed (not something this or any future task should
  do without direct authorization)
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
REMAINING ARCHITECTURAL AMBIGUITY: NONE MATHEMATICALLY — 3 product-policy decisions remain (بخش ۲۳), not technical gaps
AWAITING: user confirmation of the model in بخش ۲۱ and the 3 product decisions in بخش ۲۳ before any implementation
```
