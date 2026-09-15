# Stablecoin Engine — Final Strategy-Contract Audit: Initial Capital, Opportunity Unit, and Why Capacity=1 Has No Edge Case At All (Read-Only)

## Metadata

- Date: 2026-09-16 (session continued)
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine — Allocation architecture)
- Mode: **Foundational, read-only re-audit** — the user identified that the previous audit (same day, `reports/spot/2026-09-15-0624-...`) still carried a subtly wrong mental model of the relationship between the configured capital field and the per-trade size, and provided a corrected, fully-worked `$10,000` example to re-derive the contract from scratch. Zero code changes, zero migrations, zero database writes, zero Allocation changes, zero trades, zero scheduler changes, zero Binance orders, zero commit/push/deploy in this task.
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e
- Ending commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e (**unchanged**)

## Objective

Re-derive the Stablecoin Engine's inventory/capacity/notional contract **only** from the user's `Initial Capital = $10,000` worked example — explicitly discarding, and not reusing as a starting assumption, any conclusion from prior audits (quote-only seed, floor/ceil seed, "Trading Capital = one trade," "Capacity is just a Required-Liquidity multiplier," "Capacity=1 has an unavoidable edge case"). Produce a complete numeric simulation of every GO/RETURN sequence the user listed, a full code audit of every place `trading_capital_usd` is used as a trade volume, and a final, unambiguous mathematical contract.

---

## بخش ۱ — قرارداد Initial Capital (استخراج‌شده فقط از مثالِ کاربر)

`Initial Capital` = کلِ سرمایه‌یِ اولیه‌یِ Allocation — یک عددِ واحد که کاربر در لحظه‌یِ ایجاد وارد می‌کند (مثال: `$10,000`). این سرمایه بلافاصله و به‌طورِ کامل، **۵۰/۵۰**، بینِ دو داراییِ جفت تقسیم می‌شود:

```
موجودیِ اولیه‌یِ هر طرف = Initial Capital / 2
```

برایِ `Initial Capital=$10,000`: `USDT=$5,000, USDC=$5,000`.

**`Opportunity Unit (U)` = `Initial Capital / 2`** — دقیقاً همان نصفی که به هر طرف داده شد. این عدد، اندازه‌یِ **هر** معامله‌یِ منفرد (چه GO، چه RETURN) است، در `Capacity=1`.

**نکته‌یِ حیاتیِ این اصلاح نسبت به ممیزیِ قبلیِ همین جلسه:** در ممیزیِ قبلی (۰۶:۲۴ امروز)، من `$5,000` را «Trading Capital» نامیدم و `U=$2,500` (نصفِ آن) نتیجه گرفتم — که از نظرِ ریاضی با همین قرارداد سازگار است **اگر** آن `$5,000` را معادلِ همین‌جا «Initial Capital» در نظر بگیریم. اما من در آن گزارش یک نتیجه‌یِ غلط هم گرفتم: گفتم `Capacity=1` یک «محدودیتِ ریاضیِ اجتناب‌ناپذیر» دارد چون «نمی‌توان `۱×C` را به دو سهمِ `≥C` تقسیم کرد». **این نتیجه‌گیری غلط بود** — و علتش دقیقاً همین سردرگمیِ نام‌گذاری بود: من `C` (آنچه امروز کدِ فعلی «Trading Capital» می‌نامد) را هم‌زمان هم به‌عنوانِ «کلِ سرمایه» و هم به‌عنوانِ «واحدِ معامله» به کار می‌بردم. با تفکیکِ صریحِ `Initial Capital = 2×U` (کاملاً مطابقِ مثالِ جدیدِ کاربر)، این مشکل **کاملاً از بین می‌رود**: در `Capacity=1`، `Initial Capital` از ابتدا **دو واحدِ کامل** (`2×$5,000` در مثالِ $10,000، یا `2×$2,500` در مثالِ قدیمی) در خود دارد — یک واحد برایِ هر طرف — پس هیچ کمبودی، هیچ حالتِ مرزی، و هیچ سازشی لازم نیست. **بخشِ ۱۱ِ ممیزیِ قبلی (بخشِ «خطرات») که `Capacity=1` را دارایِ یک محدودیتِ باقی‌مانده می‌دانست، رسماً باطل و جایگزین می‌شود.**

---

## بخش ۲ — اشتباهاتِ موجود در معماریِ فعلی (بازتأییدشده با قراردادِ اصلاح‌شده)

همان یافته‌یِ اصلیِ ممیزیِ قبلی، اما اکنون بدونِ هیچ ابهامِ نام‌گذاری:

فایل `api/stablecoin-engine.ts`، دو نقطه‌یِ **دقیقاً یکسان و هردو اشتباه**:

```ts
// خطِ ۷۵۴ و ۷۵۸ (computeAllocationLivePreview):
const quote = await getOrderBookQuote(sym.symbol, side, tradingCapitalUsd);
...
notionalUsd: tradingCapitalUsd,

// خطِ ۸۱۹ و ۸۲۲ (runAllocationCycle) — عیناً همین دو خط، تکرارشده:
const quote = await getOrderBookQuote(sym.symbol, side, tradingCapitalUsd);
...
notionalUsd: tradingCapitalUsd,
```

`tradingCapitalUsd` در این دو تابع مستقیماً از `allocation.trading_capital_usd` خوانده می‌شود (همان ستونِ دیتابیس که کاربر در لحظه‌یِ ایجادِ Allocation پر می‌کند) — یعنی همان چیزی که این قرارداد «Initial Capital» می‌نامد. کد این عدد را **بدونِ تقسیم بر ۲** مستقیماً به‌عنوانِ حجمِ معامله (`notionalUsd`) به موتورِ تصمیم‌گیری می‌دهد. طبقِ قراردادِ استخراج‌شده در بخشِ ۱، این **اشتباه است**: حجمِ صحیحِ هر معامله باید `tradingCapitalUsd / 2` باشد.

---

## بخش ۳ — تعریف دقیق سرمایه فعال (Active Capital)

`Active Capital = Initial Capital`. این سرمایه دقیقاً پوششِ **یک چرخه‌یِ کاملِ رفت‌وبرگشت** (یک GO + یک RETURN، `Capacity=1`) را می‌دهد. معادلِ `2×U`.

---

## بخش ۴ — تعریف دقیق سرمایه رزرو (Reserve Capital)

`Reserve Capital = Initial Capital × (Capacity − 1)`. برایِ `Capacity=1`، رزرو دقیقاً صفر است — و طبقِ بخشِ ۱، این به‌هیچ‌وجه به‌معنایِ غیرقابلِ‌اجرا بودن نیست؛ فقط یعنی هیچ ظرفیتِ اضافه‌ای فراتر از یک چرخه‌یِ کامل وجود ندارد.

مثالِ کاربر (بخشِ ۴ پیامش، `Initial Capital=$10,000`):

| Capacity | Reserve Capital |
|---|---|
| 1 | $0 |
| 2 | $10,000 |
| 3 | $20,000 |
| 4 | $30,000 |
| 5 | $40,000 |

---

## بخش ۵ — تعریف دقیق Capacity

`Capacity` = تعدادِ `Opportunity Unit`هایِ متوالیِ هم‌جهت که موتور باید بتواند از حالتِ سرد، در **هر یک از دو طرف** جفت، پوشش دهد. Capacity **هرگز** اندازه‌یِ خودِ معامله (`U`) را تغییر نمی‌دهد — طبقِ تأکیدِ صریحِ کاربر در بخشِ ۴ پیامش: «Capacity نباید باعث شود یک معامله $10,000 یا $15,000 یا $20,000 شود.» این تعریف با دو تعریفِ قبلاً بررسی‌شده (ضریبِ بودجه‌یِ بی‌اثر در تصمیم‌گیری؛ یا شمارنده‌یِ معاملات) فرق دارد: اینجا Capacity مستقیماً **موجودیِ لازم برایِ هر طرف** را تعیین می‌کند (بخشِ ۶)، و از طریقِ همان موجودی، به‌طورِ طبیعی تعدادِ معاملاتِ متوالیِ ممکن را محدود می‌کند — بدونِ نیاز به هیچ شمارنده‌یِ جداگانه در کد.

---

## بخش ۶ — Required Liquidity

`Required Liquidity = Initial Capital × Capacity` — دقیقاً مطابقِ اعدادِ صریحِ کاربر (بخشِ ۵ پیامش):

| Capacity | Required Liquidity (IC=$10,000) |
|---|---|
| 1 | $10,000 |
| 2 | $20,000 |
| 3 | $30,000 |
| 4 | $40,000 |
| 5 | $50,000 |

این عدد **صرفاً یک بودجه‌یِ کل** است — نه اندازه‌یِ معامله (که همیشه `U=$5,000` می‌ماند)، و نه لزوماً موجودیِ یک طرف به‌تنهایی (بخشِ ۷ نشان می‌دهد چگونه بینِ دو طرف تقسیم می‌شود).

---

## بخش ۷ — موجودی اولیه برایِ Capacityهایِ ۱ تا ۵ (اثباتِ ریاضی از رویِ توالی‌هایِ GO/RETURN، نه فرضِ کورکورانه)

کاربر صریحاً خواسته این فرمول **اثبات** شود، نه صرفاً ادعا. اثبات از طریقِ الزامِ زیر: **هر طرف باید بتواند دقیقاً `Capacity` معامله‌یِ متوالیِ هم‌جهت را از حالتِ سرد پوشش دهد، به‌علاوه‌یِ دوطرفه‌بودنِ کاملِ اولیه (هر دو طرف باید حداقل یک `U` داشته باشند).**

اگر هر طرف = `X`، برایِ پوششِ `Capacity` معامله‌یِ متوالی با اندازه‌یِ `U`، باید `X = U × Capacity` باشد. چون `U = Initial Capital / 2`:

```
موجودیِ هر طرف = U × Capacity = (Initial Capital / 2) × Capacity = Required Liquidity / 2
```

**این دقیقاً همان فرمولِ ۵۰/۵۰ (تقسیمِ کاملِ Required Liquidity به دو طرفِ مساوی) است — اما این‌بار با اثباتِ صریح از رویِ الزامِ «هر طرف = Capacity واحدِ کامل»، نه یک فرضِ وارداتی.**

| Capacity | Required Liquidity | موجودیِ هر طرف (`= RL/2 = U×Capacity`) | تعدادِ معاملاتِ متوالیِ هم‌جهتِ هر طرف |
|---|---|---|---|
| 1 | $10,000 | **$5,000** | 1 |
| 2 | $20,000 | **$10,000** | 2 |
| 3 | $30,000 | **$15,000** | 3 |
| 4 | $40,000 | **$20,000** | 4 |
| 5 | $50,000 | **$25,000** | 5 |

**دوطرفه‌بودن در همه‌یِ حالت‌ها:** چون `موجودیِ هر طرف = U × Capacity ≥ U` برایِ هر `Capacity ≥ 1`، هر دو طرف **همیشه** حداقل یک `U` کامل دارند — **از جمله `Capacity=1`**. هیچ حالتِ مرزی، هیچ محدودیتِ ذاتی، هیچ سازش باقی نمی‌ماند.

---

## بخش ۸ — شبیه‌سازیِ کاملِ توالی‌هایِ GO/RETURN (`Initial Capital=$10,000`, `U=$5,000`)

قرارداد: `GO = BUY USDC = USDT→USDC` (خرجِ `U` از USDT). `RETURN = SELL USDC = USDC→USDT` (خرجِ `U` از USDC). موجودیِ اولیه در Capacity=N: `USDT=USDC=5000×N`. سود از اعدادِ نمایش‌داده‌شده حذف شده (برایِ خوانایی) — سود فقط موجودیِ طرفِ **مقصد** را اندکی بیشتر می‌کند، هرگز شرطِ اجرا را سخت‌تر نمی‌کند، و طبقِ اصلِ عدمِ ترکیب (بخشِ ۹) هرگز `U` را برایِ معامله‌یِ بعدی تغییر نمی‌دهد.

برایِ هر توالی، حداقلِ Capacity موردنیاز برایِ اجرایِ **کاملِ** توالی مشخص شده است؛ در Capacityهایِ کمتر از این حد، دقیقاً همان قدم که رد می‌شود مشخص شده.

### توالی A: `GO`
| قدم | جهت | BUY/SELL | مبدأ (قبل) | نیاز | حداقلِ Capacity |
|---|---|---|---|---|---|
| ۱ | USDT→USDC | BUY USDC | USDT=5000N | 5000 | **N≥1 (همیشه)** |

### توالی B: `GO → RETURN`
| قدم | جهت | BUY/SELL | مبدأ قبل | نیاز | حداقلِ Capacity |
|---|---|---|---|---|---|
| ۱ | USDT→USDC | BUY | USDT=5000N | 5000 | N≥1 |
| ۲ | USDC→USDT | SELL | USDC=5000(N+1) | 5000 | N≥1 (چون `5000(N+1)≥5000` همیشه) |

**نتیجه:** بعدِ این دو قدم، موجودی دقیقاً به `(5000N, 5000N)` برمی‌گردد (تعادلِ کامل) — **این توالی برایِ هر Capacity، از جمله `Capacity=1`، صد در صد معتبر و کامل است.** این دقیقاً همان چرخه‌یِ اصلیِ استراتژی (بخشِ ۳ پیامِ کاربر) است.

### توالی C: `GO → GO`
| قدم | جهت | مبدأ قبل | نیاز | حداقلِ Capacity |
|---|---|---|---|---|
| ۱ | USDT→USDC | USDT=5000N | 5000 | N≥1 |
| ۲ | USDT→USDC | USDT=5000(N−1) | 5000 | **N≥2** |

**در `Capacity=1`، قدمِ دوم رد می‌شود** (`USDT=0<5000`) — این **رد شدنِ درست** است (Reserve ندارد)، نه یک باگ. نیازمندِ `Capacity≥2`.

### توالی D: `RETURN → RETURN`
تصویرِ آینه‌ایِ دقیقِ C (تقارنِ کامل، طبقِ الزامِ کاربر که هیچ جهتی نباید ترجیحِ ساختاری داشته باشد):
| قدم | جهت | مبدأ قبل | نیاز | حداقلِ Capacity |
|---|---|---|---|---|
| ۱ | USDC→USDT | USDC=5000N | 5000 | N≥1 |
| ۲ | USDC→USDT | USDC=5000(N−1) | 5000 | **N≥2** |

### توالی E: `GO → RETURN → GO`
| قدم | جهت | مبدأ قبل | نیاز | حداقلِ Capacity |
|---|---|---|---|---|
| ۱ | USDT→USDC | USDT=5000N | 5000 | N≥1 |
| ۲ | USDC→USDT | USDC=5000(N+1) | 5000 | N≥1 |
| ۳ | USDT→USDC | USDT=5000N (تعادل برگشته) | 5000 | N≥1 |

**کاملاً معتبر برایِ همه‌یِ Capacityها، از جمله ۱** — چون هر «رفت» بلافاصله با یک «برگشت» جبران می‌شود، هرگز بیش از یک واحد کسری ایجاد نمی‌شود.

### توالی F: `GO → GO → RETURN`
| قدم | جهت | مبدأ قبل | نیاز | حداقلِ Capacity |
|---|---|---|---|---|
| ۱ | USDT→USDC | USDT=5000N | 5000 | N≥1 |
| ۲ | USDT→USDC | USDT=5000(N−1) | 5000 | **N≥2** |
| ۳ | USDC→USDT | USDC=5000(N+2) اگر قدمِ۲ اجرا شد | 5000 | N≥2 (وابسته به قدمِ ۲) |

**در `Capacity=1`:** قدمِ ۲ رد می‌شود؛ قدمِ ۳ (RETURN) سپس رویِ موجودیِ **بعدِ قدمِ ۱ تنها** ارزیابی می‌شود (`USDC=5000(1+1)=10000≥5000`) → **اجرا می‌شود** — یعنی توالیِ واقعی‌شده برایِ `N=1` عملاً معادلِ توالیِ B (`GO→RETURN`) می‌شود، نه سه قدمِ کامل. این رفتار **درست** است: موتور هرگز به‌خاطرِ نبودِ Reserve، فرصتِ RETURNِ در دسترس را از دست نمی‌دهد.

### توالی G: `RETURN → GO → RETURN`
تصویرِ آینه‌ایِ E — کاملاً معتبر برایِ همه‌یِ Capacityها، از جمله ۱ (همان استدلال، جهتِ معکوس).

### توالی H: `GO → GO → GO → RETURN`
| قدم | جهت | مبدأ قبل | نیاز | حداقلِ Capacity برایِ اجرایِ این قدم |
|---|---|---|---|---|
| ۱ | USDT→USDC | USDT=5000N | 5000 | N≥1 |
| ۲ | USDT→USDC | USDT=5000(N−1) | 5000 | N≥2 |
| ۳ | USDT→USDC | USDT=5000(N−2) | 5000 | **N≥3** |
| ۴ | USDC→USDT | USDC=5000(N+قدم‌هایِ موفقِ قبلی) | 5000 | همیشه (اگر حداقل یک USDC داشته باشیم) |

**خلاصه:** `N=1` → فقط قدمِ ۱ اجرا می‌شود، قدمِ ۴ (RETURN) رویِ موجودیِ بعدِ قدمِ ۱ ارزیابی و اجرا می‌شود (معادلِ توالیِ B). `N=2` → قدم‌هایِ ۱-۲ اجرا، قدمِ ۳ رد، قدمِ ۴ رویِ موجودیِ بعدِ قدمِ ۲ اجرا (معادلِ توالیِ F). `N≥3` → هر ۴ قدم دقیقاً همان‌طور که نوشته شده اجرا می‌شود.

**نتیجه‌یِ کلیِ بخشِ ۸:** موتور **هرگز** به‌خاطرِ نبودِ Capacity کافی، یک فرصتِ RETURNِ واقعاً در‌دسترس را از دست نمی‌دهد — Capacity فقط سقفِ تعدادِ معاملاتِ **هم‌جهتِ متوالیِ بدونِ بازگشتِ میانی** را تعیین می‌کند، دقیقاً طبقِ خواسته‌یِ صریحِ کاربر در بخشِ ۷ پیامش («Capacity را بر اساسِ رفتارِ واقعیِ موجودی تعریف کنیم»).

---

## بخش ۹ — سود و Non-Compounding

`netProfitUsd` هر معامله جداگانه محاسبه و در `stablecoin_demo_trades.net_profit_usd` ثبت می‌شود (بدونِ تغییر — این بخش از کد از قبل درست است، طبقِ `simulateStablecoinTrade`). موجودیِ داراییِ **مقصد** واقعاً به‌اندازه‌یِ `U + netProfitUsd` افزایش می‌یابد (سود فیزیکاً به‌شکلِ واحدهایِ بیشترِ آن دارایی ظاهر می‌شود) — اما `U` برایِ معامله‌یِ **بعدی** همیشه از رویِ `trading_capital_usd/2` (ثابت) دوباره محاسبه می‌شود، **هرگز** از رویِ موجودیِ لحظه‌ایِ رشدکرده. این اصل از قبل در کدِ فعلی رعایت شده (`simulateStablecoinTrade` هرگز `notionalUsd` را از رویِ `balances` بازمحاسبه نمی‌کند) — تنها چیزی که تغییر می‌کند، **منبعِ** `notionalUsd` است (`trading_capital_usd` باید به `trading_capital_usd/2` اصلاح شود)، نه نحوه‌یِ استفاده از آن.

---

## بخش ۱۰ — Audit دقیق رویِ `api/stablecoin-engine.ts` (هر مسیر، طبقِ چک‌لیستِ کاربر)

| مسیر | خط(هایِ) کد | آیا `trading_capital_usd` به‌عنوانِ حجمِ معامله (بدونِ تقسیم بر ۲) استفاده شده؟ | سازگار با قراردادِ جدید؟ |
|---|---|---|---|
| **Create Allocation** (`create_stablecoin_pair_allocation`, `migrations/stablecoin_pair_allocations.sql`) | خطِ ۱۷۵-۱۹۸ | خیر — این تابع فقط `v_required_liquidity=TC×Capacity` را می‌سازد و ۵۰/۵۰ Seed می‌کند؛ هرگز حجمِ معامله را تعیین نمی‌کند | **بله، کاملاً سازگار (بدونِ نیاز به تغییر)** |
| **Inventory Seed (نسخه‌یِ فعلاً فعال)** (`stablecoin_allocation_inventory_seed_fix.sql`) | خطِ ۹۴-۹۷ | کاملِ `v_required_liquidity` در quote، صفر در base | **ناسازگار — باید کنار گذاشته شود** (بازگشت به نسخه‌یِ ۵۰/۵۰ اصلی) |
| **runAllocationCycle** (تعیینِ حجمِ معامله، دریافتِ Order Book/VWAP) | خطِ ۸۱۹، ۸۲۲ | **بله — مستقیماً `tradingCapitalUsd` بدونِ تقسیم** | **ناسازگار — قلبِ اصلیِ باگ** |
| **computeAllocationLivePreview** (همان منطق، برایِ پیش‌نمایشِ زنده) | خطِ ۷۵۴، ۷۵۸ | **بله — عیناً همان اشتباه، تکرارشده** | **ناسازگار — همان باگ، دو بار پیاده‌سازی‌شده** |
| **decideStablecoinTrade / classifyStablecoinExecutability** (تصمیمِ نهایی) | خطِ ۱۹۴-۲۲۶، ۲۴۴-۲۷۵ | خیر — این توابع فقط `input.notionalUsd`ی را که از بیرون داده می‌شود مصرف می‌کنند، خودشان `trading_capital_usd` را نمی‌خوانند | **بله، کاملاً سازگار (بدونِ نیاز به تغییر در خودِ منطق؛ فقط ورودی‌شان باید درست شود)** |
| **getOrderBookQuote / VWAP** | خطِ ۴۹۷-۵۱۷ | خیر — این تابع فقط `requestedNotional` را که بهش داده می‌شود می‌پیماید؛ کاملاً عمومی است | **بله، کاملاً سازگار (بدونِ نیاز به تغییر)** |
| **Inventory Validation** (`inventoryAvailable < notionalUsd`) | خطِ ۲۰۶ | خیر — فقط مقایسه می‌کند؛ درستیِ این مقایسه کاملاً به درستیِ `notionalUsd` بستگی دارد | **منطقِ مقایسه سازگار است؛ اما چون ورودی‌اش (`notionalUsd`) اشتباه است، نتیجه اشتباه می‌شود** |
| **Capacity Validation** (`opportunity_capacity >= 1` در DB Check Constraint) | `stablecoin_pair_allocations.sql` خطِ ۳۶ | خیر | **بله، کاملاً سازگار** |
| **Required Liquidity** (`computeRequiredLiquidityUsd`) | خطِ ۱۴۵-۱۴۶ | `TC × floor(Capacity)` — این خودِ فرمولِ Required Liquidity است، نه حجمِ معامله | **بله، کاملاً سازگار (بدونِ نیاز به تغییر)** |
| **Profit Calculation** (`computeNetProfitUsd`, `simulateStablecoinTrade`) | خطِ ۱۳۲-۱۳۵، ۵۸۲-۶۳۹ | خیر — این توابع رویِ `decision.notionalUsd` (ورودیِ بیرونی) کار می‌کنند؛ هرگز مستقیماً `trading_capital_usd` را نمی‌خوانند | **بله، کاملاً سازگار (بدونِ نیاز به تغییر در خودِ منطق)** |
| **Trade Persistence** (`stablecoin_demo_trades`, `persistCycleDecisions`) | خطِ ۶۰۷-۶۲۰، ۶۴۳-۶۶۰ | خیر — فقط `decision.notionalUsd` را که از قبل محاسبه شده ثبت می‌کند | **بله، کاملاً سازگار (بدونِ نیاز به تغییر در خودِ منطق؛ فقط عددِ ذخیره‌شده برایِ معاملاتِ **جدید** درست‌تر خواهد شد)** |
| **Allocation Status / ROI** (`computeAllocationReport`) | خطِ ۳۶۸-۴۰۸ | خیر — `roiPct = totalRealizedProfitUsd / tradingCapitalUsd × 100`؛ این مخرجِ ROI عمداً `Initial Capital` (نه `U`) است، طبقِ اصلِ «ROI همیشه از رویِ کلِ سرمایه محاسبه شود، نه رزرو یا واحدِ معامله» | **بله، کاملاً سازگار (بدونِ نیاز به تغییر)** |

**جمع‌بندیِ Audit:** از حدودِ ۱۲ مسیرِ بررسی‌شده، **فقط دو نقطه** (که هردو دقیقاً همان یک خطِ اشتباه را در دو تابعِ موازی تکرار می‌کنند) با قراردادِ جدید مغایرت دارند. بقیه‌یِ معماری — شاملِ فرمولِ Seedِ اصلی، تشخیصِ موجودیِ ناکافی، محاسبه‌یِ سود، ثبتِ معامله، و ROI — از قبل کاملاً سازگار است.

---

## بخش ۱۱ — Audit فرمول‌ها (فعلی vs موردانتظار)

| مفهوم | فرمولِ فعلیِ کد | فرمولِ موردِ انتظار (قراردادِ جدید) | صحیح؟ | چرا |
|---|---|---|---|---|
| Initial Capital | `trading_capital_usd` (ستونِ DB) | همین، بدونِ تغییرِ نام/ساختار | ✅ درست | فیلد از قبل دقیقاً همین مقدار را نگه می‌دارد؛ فقط برداشتِ کدنویسی از **معنایِ** آن اشتباه بود |
| Opportunity Unit (U) | **وجود ندارد — کد به‌جایش مستقیماً `trading_capital_usd` را به‌عنوانِ حجمِ معامله استفاده می‌کند** | `trading_capital_usd / 2` | ❌ غلط | تنها فرمولِ غایب/اشتباهِ کل معماری |
| Capacity | ضریبِ بی‌اثر در تصمیم‌گیری، فقط در Required Liquidity ظاهر می‌شود | تعدادِ واحدهایِ `U` که هر طرف باید پوشش دهد | ⚠️ ناقص (نه غلط) | تعریف در Seed درست اِعمال می‌شود (چون Seed از Required Liquidity می‌آید)، اما در منطقِ تصمیم‌گیری اصلاً استفاده نمی‌شود (که نیازی هم ندارد — موجودی خودش محدودیت را اعمال می‌کند) |
| Required Liquidity | `trading_capital_usd × floor(opportunity_capacity)` | همین، بدونِ تغییر | ✅ درست | دقیقاً مطابقِ اعدادِ کاربر در بخشِ ۵ |
| Initial Inventory (Seed) | **نسخه‌یِ فعلاً فعال:** کاملاً در quote / **نسخه‌یِ اصلی (کنارگذاشته‌شده):** `Required Liquidity/2` هر طرف | `Required Liquidity/2` هر طرف | نسخه‌یِ فعلی ❌ / نسخه‌یِ اصلی ✅ | نسخه‌یِ اصلی (۵۰/۵۰) دقیقاً با قراردادِ جدید مطابق است؛ فقط باید **جایگزینِ** نسخه‌یِ Quote-Only شود |
| Reserve | مفهومی جدا در کد وجود ندارد (ضمنی، در دلِ Required Liquidity) | `Initial Capital × (Capacity−1)` | ⚠️ فقط به‌صورتِ ضمنی موجود است | نتیجه‌یِ نهایی (موجودیِ هر طرف) درست است اگر Seedِ اصلی استفاده شود؛ نیازی به یک ستونِ جداگانه در DB نیست |
| Notional (حجمِ هر معامله) | `trading_capital_usd` (کاملِ آن) | `trading_capital_usd / 2` | ❌ غلط | همان یافته‌یِ اصلیِ این ممیزی |
| ROI | `totalRealizedProfitUsd / trading_capital_usd × 100` | همین، بدونِ تغییر | ✅ درست | مخرج باید Initial Capital باشد، نه U یا Required Liquidity — دقیقاً همین‌طور پیاده شده |
| Profit | `netProfitUsd` مستقل، جداگانه ثبت‌شده، هرگز `notionalUsd` را برایِ معامله‌یِ بعدی تغییر نمی‌دهد | همین | ✅ درست | بدونِ تغییر |
| Executable Liquidity (نقدینگیِ بازار، مستقل از موجودیِ Allocation) | `getOrderBookQuote`/`quote.filledNotional` — کاملاً جدا از موجودیِ Allocation | همین | ✅ درست | این تفکیک از فازِ دیروز (`INSUFFICIENT_MARKET_LIQUIDITY` در برابرِ `INSUFFICIENT_ALLOCATION_INVENTORY`) از قبل صحیح پیاده شده و بدونِ تغییر می‌ماند |

---

## بخش ۱۲ — کدام فرض‌هایِ قبلی نباید مبنا قرار گیرند (طبقِ دستورِ صریحِ کاربر، تک‌به‌تک بررسی شد)

| فرضِ قبلی | نتیجه‌یِ این ممیزی |
|---|---|
| Seedِ کاملاً در Quote | **رد شد** — مغایرِ صریح با قراردادِ ۵۰/۵۰ِ بخشِ ۱ |
| مدلِ `floor`/`ceil` (پیشنهادِ خودِ من در ممیزیِ ۰۶:۲۴ امروز) | **رد شد** — بر مبنایِ همان برداشتِ اشتباهِ «هر معامله = کاملِ Trading Capital» بنا شده بود؛ با اصلاحِ ریشه‌ای (تقسیمِ `U` بر ۲)، اصلاً نیازی به تقسیمِ نامتقارنِ بینِ دو دارایی نیست — ۵۰/۵۰ِ ساده کافی و بهینه است |
| «Trading Capital حتماً برابرِ یک معامله است» | **رد شد** — دقیقاً همان باگِ اصلی |
| «Capacity فقط یک ضریبِ Required Liquidity است، بدونِ معنایِ عملیاتی» | **رد شد** — Capacity معنایِ عملیاتیِ دقیقی دارد (بخشِ ۵)، فقط از طریقِ **موجودی**، نه یک شمارنده‌یِ جداگانه، اعمال می‌شود |
| «Capacity=1 مشکل دارد / یک موردِ مرزیِ باقی‌مانده است» | **کاملاً رد شد** — این ادعا حتی در ممیزیِ **خودِ من** در همان روز هم اشتباه بود (بخشِ ۱ همین گزارش)؛ با قراردادِ صحیح، `Capacity=1` هیچ محدودیتی ندارد |
| هر محدودیتی که مانعِ چرخه‌یِ رفت‌وبرگشت شود | **رد شد** — بخشِ ۸ (توالی‌هایِ B، E، G) ثابت کرد که چرخه‌یِ رفت‌وبرگشت (و حتی رفت‌برگشت‌رفت/برگشت‌رفت‌برگشت) برایِ **هر** Capacity، از جمله ۱، کاملاً معتبر است |

---

## بخش ۱۳ — تاریخچه Production (فقط‌خواندنی، هیچ تغییری)

هیچ داده‌ای حذف، اصلاح، Backfill، یا لمس نشد. طبقِ بررسیِ Read-Only پیشین (ممیزیِ ۰۴:۵۹ و ۰۶:۲۴ همین روز)، ۴ Allocationِ فعالِ Production موردِ بررسی قرار گرفتند؛ نتیجه دوباره با قراردادِ اصلاح‌شده صادق است:

- **۳ از ۴ Allocation** (`eea1374a`, `a857cbdc`, `09b1c1ae`) از قبل با فرمولِ **صحیح** (۵۰/۵۰ِ `Required Liquidity`) Seed شده‌اند — موجودیِ فعلیِ آن‌ها نیازی به هیچ تغییری ندارد. فقط اصلاحِ `notionalUsd` در کد لازم است تا این‌ها بلافاصله هر دو جهت را درست ارزیابی کنند.
- **۱ Allocation** (`3cc778cd-...`) با مدلِ اکنون کنارگذاشته‌شده‌یِ «کاملاً در Quote» Seed شده و برایِ اصلاح، نیازمندِ تصمیمِ صریحِ کاربر (Stop-and-recreate) است — این ممیزی چنین تصمیمی **اتخاذ یا اجرا نمی‌کند**.

**دربابِ داده‌هایِ یادگیری/حافظه:** هیچ زیرسیستمِ «یادگیری» یا «حافظه»یِ مخصوصِ Stablecoin Engine در کدبیس یافت نشد (زیرسیستمِ یادگیریِ موجود در پروژه، طبقِ نامِ Job در CI — `Test learning extraction` — مربوط به موتورِ **Futures**ی است، کاملاً جدا و بی‌ربط به این موتور). تنها «تاریخچه» موجود، جدولِ خامِ `stablecoin_demo_trades`/`stablecoin_cycle_decisions` است. معاملاتِ **قبلاً اجراشده** با `allocation_id` غیرِخالی (اگر وجود داشته باشند) با حجمِ اشتباه (کاملِ `trading_capital_usd`) ثبت شده‌اند — این ردیف‌ها به‌عنوانِ سابقه‌یِ حسابداری معتبر می‌مانند (طبقِ دستورِ صریحِ کاربر، حذف/اصلاح نمی‌شوند)، اما **هر تحلیلِ آماریِ آینده** (مثلاً «میانگینِ حجمِ معامله» یا مقایسه‌یِ عملکردِ پیش/پس از اصلاح) باید صراحتاً بدانند این ارقام بازتابِ مدلِ **قدیمی و اشتباه** هستند، نه معیارِ استراتژیِ جدید.

---

## بخش ۱۴ — پاسخِ صریح به ۲۰ سؤالِ کاربر

۱. **قراردادِ نهاییِ Initial Capital چیست؟** کلِ سرمایه‌یِ اولیه‌یِ Allocation؛ همان مقدارِ ذخیره‌شده در `trading_capital_usd`؛ در لحظه‌یِ Seed، ۵۰/۵۰ بینِ دو دارایی تقسیم می‌شود.
۲. **آیا Opportunity Unit = Initial Capital/2 است؟** بله، دقیقاً و بدونِ استثنا.
۳. **Trading Capital دقیقاً چه معنایی دارد؟** همان `Initial Capital` — نامِ فعلیِ فیلد (و برچسبِ UI «سرمایه‌یِ معامله») گمراه‌کننده است چون القا می‌کند «حجمِ هر معامله»، درحالی‌که واقعاً «کلِ سرمایه‌یِ یک چرخه‌یِ رفت‌وبرگشت» است.
۴. **آیا Trading Capital باید با Initial Capital یکی باشد؟** بله — همان کمیتِ زیرینِ واحد است؛ فقط تغییرِ نام (اختیاری، خارج از محدوده‌یِ این ممیزی) می‌تواند ابهامِ آینده را برطرف کند.
۵. **Capacity دقیقاً چه چیزی را کنترل می‌کند؟** تعدادِ `Opportunity Unit`هایِ متوالیِ هم‌جهت که هر طرف باید پوشش دهد — از طریقِ تعیینِ موجودیِ اولیه (`U × Capacity` هر طرف)، نه از طریقِ هیچ شمارنده‌یِ مستقیم در منطقِ تصمیم‌گیری.
۶. **Required Liquidity دقیقاً چیست؟** بودجه‌یِ کلِ رزروشده = `Initial Capital × Capacity`؛ هرگز حجمِ معامله، هرگز موجودیِ یک طرف به‌تنهایی.
۷. **Reserve Capital چگونه محاسبه می‌شود؟** `Initial Capital × (Capacity−1)`.
۸. **موجودیِ اولیه برایِ Capacityهایِ ۱ تا ۵ چگونه تعیین می‌شود؟** `Required Liquidity/2` هر طرف — بخشِ ۷ همین گزارش.
۹. **Opportunity Unit برایِ Capacityهایِ ۱ تا ۵ چگونه تعیین می‌شود؟** ثابت و مستقل از Capacity: همیشه `Initial Capital/2`.
۱۰. **آیا Opportunity Unit با Capacity تغییر می‌کند؟** خیر، هرگز.
۱۱. **رفتارِ صحیحِ GO/RETURN چیست؟** بخشِ ۸، توالیِ B — همیشه معتبر، برایِ هر Capacity.
۱۲. **رفتارِ صحیحِ GO→GO چیست؟** بخشِ ۸، توالیِ C — نیازمندِ `Capacity≥2`.
۱۳. **رفتارِ صحیحِ RETURN→RETURN چیست؟** بخشِ ۸، توالیِ D — تصویرِ آینه‌ایِ C، نیازمندِ `Capacity≥2`.
۱۴. **رفتارِ صحیحِ GO→RETURN→GO چیست؟** بخشِ ۸، توالیِ E — همیشه معتبر، برایِ هر Capacity.
۱۵. **آیا مدلِ Capacity=1 کاملاً قابلِ‌اجراست؟** **بله، بدونِ هیچ استثنا** — این تصحیحِ اصلیِ همین گزارش نسبت به ممیزیِ قبلی.
۱۶. **کدام قسمت‌هایِ `api/stablecoin-engine.ts` با این قرارداد مغایرت دارند؟** فقط دو نقطه (بخشِ ۲/۱۰): `notionalUsd: tradingCapitalUsd` در `runAllocationCycle` و `computeAllocationLivePreview`.
۱۷. **کدام Migrationهایِ قبلی بر اساسِ برداشتِ اشتباه ساخته شده‌اند؟** فقط `stablecoin_allocation_inventory_seed_fix.sql` (Seedِ کاملاً در Quote). Migrationِ اصلی (`stablecoin_pair_allocations.sql`، فرمولِ ۵۰/۵۰) **درست** بود و اشتباهاً به‌عنوانِ «باگ» شناسایی و جایگزین شده بود.
۱۸. **کدام بخش‌ها باید در Implementationِ بعدی کاملاً بازطراحی شوند؟** هیچ بازطراحیِ ساختاری لازم نیست — فقط (الف) بازگرداندنِ Seedِ ۵۰/۵۰ (لغوِ Migrationِ اخیر یا اعمالِ یک Migrationِ جدید که همان فرمولِ اصلی را بازمی‌گرداند)، و (ب) اصلاحِ دو خطِ `notionalUsd`/`getOrderBookQuote` به `tradingCapitalUsd/2`.
۱۹. **چه بخش‌هایی از معماریِ فعلی می‌توانند حفظ شوند؟** تقریباً همه‌چیزِ دیگر: `decideStablecoinTrade`/`classifyStablecoinExecutability`/`getOrderBookQuote`/`simulateStablecoinTrade`/`computeAllocationReport`/تفکیکِ `INSUFFICIENT_ALLOCATION_INVENTORY` از `INSUFFICIENT_MARKET_LIQUIDITY`/Asset Conflict Rule/همه‌یِ منطقِ توقف و برداشتِ سود — بدونِ تغییر (بخشِ ۱۰).
۲۰. **قبل از هر Implementation چه مواردی هنوز نیاز به تأییدِ کاربر دارند؟** سه مورد، دقیقاً همان‌طور که در بخشِ «FINAL STRATEGY CONTRACT» زیر تکرار می‌شود.

---

## FINAL STRATEGY CONTRACT

```
Initial Capital              = مقدارِ پیکربندی‌شده توسطِ کاربر در لحظه‌یِ ایجادِ Allocation
                                (همان ستونِ فعلیِ trading_capital_usd)

Initial Balance per Asset    = Initial Capital / 2      [برایِ Capacity=1؛ به‌طورِ کلی‌تر ببینید Required Liquidity/2]

Opportunity Unit (U)         = Initial Capital / 2       [ثابت — هرگز با Capacity یا سود تغییر نمی‌کند]

Active Capital                = Initial Capital = 2 × U

Reserve Capital                = Initial Capital × (Capacity − 1)

Required Liquidity            = Initial Capital × Capacity   (= Active + Reserve)

Initial Balance per Asset
(فرمِ عمومی، هر Capacity)      = Required Liquidity / 2 = U × Capacity

Per-Trade Notional             = U = Initial Capital / 2      [مستقل از Capacity، مستقل از سود]

Capacity                       = تعدادِ واحدِ U که هر طرف باید متوالیاً پوشش دهد

Profit Treatment               = هر معامله جداگانه محاسبه و ثبت می‌شود؛ فیزیکاً به موجودیِ داراییِ مقصد اضافه می‌شود

Non-Compounding Rule           = U همیشه از Initial Capital/2 محاسبه می‌شود، هرگز از موجودیِ لحظه‌ایِ رشدکرده
```

### نمایشِ عددی — `Initial Capital = $10,000`

| Capacity | Active Capital | Reserve Capital | Required Liquidity | موجودیِ هر طرف (USDT=USDC) | Opportunity Unit (U) | تعدادِ معاملاتِ متوالیِ هر طرف |
|---|---|---|---|---|---|---|
| **1** | $10,000 | $0 | $10,000 | **$5,000** | $5,000 | 1 |
| **2** | $10,000 | $10,000 | $20,000 | **$10,000** | $5,000 | 2 |
| **3** | $10,000 | $20,000 | $30,000 | **$15,000** | $5,000 | 3 |
| **4** | $10,000 | $30,000 | $40,000 | **$20,000** | $5,000 | 4 |
| **5** | $10,000 | $40,000 | $50,000 | **$25,000** | $5,000 | 5 |

**در همه‌یِ ردیف‌ها:** هر دو طرف از لحظه‌یِ صفر حداقل یک `U=$5,000` کامل دارند — دوطرفه‌بودنِ صد در صد، بدونِ استثنا، بدونِ سازش، بدونِ نیاز به هیچ فرمولِ نامتقارن.

---

## Production Safety

Zero code changes, zero migrations, zero database writes (all references in this task are read-only re-derivations from the same data already gathered in the two prior audits today), zero Allocations touched/stopped/created, zero trades created, zero scheduler changes, zero Binance orders, zero commits, zero pushes, zero deploys. `signal0verse/signalverse-main` remains at commit `c497c6b`, unchanged.

---

## FINAL STATUS TABLE

```
STRATEGY CONTRACT RE-DERIVED FROM USER'S $10,000 EXAMPLE ONLY: YES
PRIOR AUDIT'S "Capacity=1 has an unavoidable edge case" CLAIM: FORMALLY RETRACTED - was an artifact of conflating
  Initial Capital with a single Opportunity Unit; with Initial Capital correctly understood as 2xU, Capacity=1 has
  ZERO residual limitation
ROOT CAUSE (RECONFIRMED, SAME AS BEFORE): notionalUsd hardcoded to the FULL trading_capital_usd instead of
  trading_capital_usd / 2, in exactly 2 code locations (runAllocationCycle, computeAllocationLivePreview)
ORIGINAL 50/50 SEED FORMULA: CONFIRMED CORRECT for every Capacity 1-5, proven via explicit GO/RETURN sequence
  simulation (section 8), not merely asserted
QUOTE-ONLY SEED MIGRATION: CONFIRMED INCORRECT, should be superseded
FLOOR/CEIL PROPOSAL (this session's own earlier proposal): CONFIRMED UNNECESSARY - built on the same
  Trading-Capital-equals-one-trade misunderstanding; plain 50/50 with the corrected U is sufficient and symmetric
FULL GO/RETURN SEQUENCE MATRIX (A through H) SIMULATED: YES, for Initial Capital=$10,000 across Capacity 1-5
CODE AUDIT: 12 execution-path locations checked; only 2 (both identical) are inconsistent with the contract
FORMULA AUDIT: 11 concepts checked; only "Per-Trade Notional" is currently wrong in code
3 OF 4 REAL PRODUCTION ALLOCATIONS: ALREADY SEEDED CORRECTLY per this contract - zero inventory change needed
1 OF 4 (3cc778cd): seeded under the now-superseded quote-only model - requires explicit user-approved
  stop-and-recreate, not performed by this or any task without direct authorization
NO STABLECOIN-SPECIFIC LEARNING/MEMORY SUBSYSTEM FOUND: confirmed - only raw ledger tables, which are kept as-is
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
REMAINING ARCHITECTURAL AMBIGUITY: NONE MATHEMATICALLY
AWAITING: user confirmation of the FINAL STRATEGY CONTRACT above before any implementation
```
