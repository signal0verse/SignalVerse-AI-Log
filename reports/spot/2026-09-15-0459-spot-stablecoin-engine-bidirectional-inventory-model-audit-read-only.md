# Stablecoin Engine — Allocation Inventory Model Deep Audit: One-Sided Seeding Structurally Blocks the Unfunded Direction (Read-Only)

## Metadata

- Date: 2026-09-16 (session continued)
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine — Allocation architecture)
- Mode: **Deep, read-only audit only** — per the user's explicit instruction, no code change, no migration, no database write, no Allocation stopped/changed, no trade created, no scheduler change, no Binance order, no commit/push/deploy in this task.
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e
- Ending commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e (**unchanged**)

## Objective

The user observed that a real allocation (`USDCUSDT`, Trading Capital $5,000, Capacity 3, Required Liquidity $15,000) was seeded as `USDT=$15,000 / USDC=$0`, making the `USDC→USDT` direction structurally impossible regardless of market conditions, and that the UI showed several rejected opportunities with a positive estimated profit purely due to this missing balance. The user asked for a full mathematical/architectural audit — not a quick "just do 50/50" fix (already known to be broken for `Capacity=1`) — to determine the correct general inventory model for `Capacity ∈ {1, 2, 3, 5}`, and explicitly asked that this task make **zero** production changes of any kind.

---

## بخش ۱ — نتیجه قطعی ممیزی

**مدل فعلیِ موجودی (کوانتِ کامل به asset مقابل، صفر به asset پایه) نادرست و ناقص است — نه به این دلیل که غلط محاسبه شده، بلکه به این دلیل که یک قید ذاتاً غیرقابل‌حل را با فدا کردنِ کاملِ یک طرف "حل" کرده است.**

مدلِ قبلی (۵۰/۵۰) هم نادرست بود، اما فقط برایِ `Capacity=1` — برایِ `Capacity≥2` عملاً درست کار می‌کرد (هر دو Asset دقیقاً یا بیشتر از یک Trading Capital داشتند). مدلِ فعلی (کاملِ Required Liquidity در یک Asset) دقیقاً برعکس است: `Capacity=1` را درست می‌کند اما `Capacity≥2` را از نظرِ **دوطرفه‌بودن** کاملاً خراب می‌کند — همان‌طور که داده‌یِ واقعیِ Production (بخش ۸) نشان می‌دهد، Allocation واقعیِ کاربر (`Capacity=3`) در تمامِ ۹+ چرخه‌یِ مشاهده‌شده (۴۵+ دقیقه) یک فرصتِ واقعی و مثبت (+$0.70 تا +$0.75 به‌ازایِ هر $5,000) را در جهتِ `SELL_BASE` پشتِ سرِ هم از دست داده، دقیقاً به این دلیل که `USDC=0`.

**نتیجه:** هیچ‌کدام از دو مدل («۵۰/۵۰» یا «کامل در یک Asset») به‌تنهایی صحیح نیست. مدلِ صحیح باید **بسته به Capacity** رفتار کند — نه یک نسبتِ ثابت. جزئیات در بخشِ ۶.

---

## بخش ۲ — ریشه مشکل

فایل: `migrations/stablecoin_allocation_inventory_seed_fix.sql`, تابعِ `create_stablecoin_pair_allocation()`, خطوطِ ۹۴–۹۷:

```sql
INSERT INTO stablecoin_demo_inventory (allocation_id, setup_id, asset, balance, updated_at)
VALUES
  (v_allocation_id, p_setup_id, p_base_asset, 0, now()),
  (v_allocation_id, p_setup_id, p_quote_asset, v_required_liquidity, now());
```

`v_required_liquidity = p_trading_capital_usd * p_opportunity_capacity` (خطِ ۷۱) — یعنی **کلِ** Required Liquidity (نه فقط Trading Capital) در یک مرحله وارد `quote_asset` می‌شود و `base_asset` دقیقاً صفر می‌ماند. این تغییر در فازِ قبلی (۲۰۲۶-۰۹-۱۵) دقیقاً برایِ حلِ باگِ `Capacity=1` (که در مدلِ ۵۰/۵۰، هر دو Asset کمتر از Trading Capital می‌ماندند) اعمال شد — اما اثرِ جانبیِ آن این بود که برایِ **هر** Capacity (نه فقط ۱)، جهتِ `SELL_BASE` تا وقتی حداقل یک معامله‌یِ `BUY_BASE` واقعاً اجرا نشود، **صد در صد** بسته می‌ماند.

خودِ کامنتِ این migration (خطوطِ ۲۱–۳۴) این تصمیم را «قصدی» توصیف می‌کند: «Opportunity Capacity = N فرصتِ **تکراری هم‌جهت** از حالتِ سرد» — یعنی طراحیِ اصلی اصلاً هدفش دوطرفه‌بودن نبوده، فقط تضمینِ N بارِ تکرارِ یک جهت بوده. این دقیقاً همان تعریفِ مبهم/ناسازگاری است که در بخشِ ۶ باز می‌کنم.

---

## بخش ۳ — تعریف فعلی سرمایه و ظرفیت (استخراج‌شده از کد، نه حدس)

از `api/stablecoin-engine.ts`:

```ts
// خط ۱۴۵-۱۴۶
export function computeRequiredLiquidityUsd(tradingCapitalUsd: number, opportunityCapacity: number): number {
  return Math.max(0, tradingCapitalUsd) * Math.max(0, Math.floor(opportunityCapacity));
}
```

**الف) سرمایه هر معامله (Trading Capital):** یک عددِ **ثابت**، مستقیماً از `allocation.trading_capital_usd` خوانده می‌شود و **هرگز** بر اساسِ موجودیِ فعلی، ظرفیت، یا سودِ انباشته تغییر نمی‌کند. هر تصمیم (هر دو جهت، هر چرخه) دقیقاً با همین یک عدد اندازه‌گیری می‌شود:

```ts
// خط ۸۱۹، ۸۲۲ (runAllocationCycle)
const quote = await getOrderBookQuote(sym.symbol, side, tradingCapitalUsd);
...
notionalUsd: tradingCapitalUsd,
```

**ب) ظرفیت فرصت (Opportunity Capacity):** یک عددِ صحیحِ `>= 1` که کاربر در لحظه‌یِ ایجادِ Allocation وارد می‌کند. **در کدِ تصمیم‌گیری (`decideStablecoinTrade`/`classifyStablecoinExecutability`) این مقدار اصلاً استفاده نمی‌شود** — فقط در محاسبه‌یِ `requiredLiquidityUsd` (بخش ج) و در پرچمِ `capacityLimited: true` (که فقط تعیین می‌کند کدام رشته‌یِ متنیِ خطا نمایش داده شود، نه اینکه چه تصمیمی گرفته شود) ظاهر می‌شود.

**ج) نقدینگی موردنیاز (Required Liquidity):** `Trading Capital × floor(Opportunity Capacity)` — یک عددِ **بودجه‌ای** که فقط در لحظه‌یِ ایجادِ Allocation محاسبه و در ستونِ `required_liquidity_usd` ذخیره می‌شود (خطِ ۴۰-۳۹ در `stablecoin_pair_allocations.sql`: «stored, not recomputed... so a historical Allocation's figures never drift»). این عدد **هیچ نقشی در محاسبه‌یِ اندازه‌یِ هر معامله ندارد** — فقط تعیین می‌کند در لحظه‌یِ Seed چقدر سرمایه‌یِ کل باید کنار گذاشته شود.

**د) موجودی اولیه:** طبقِ بخشِ ۲، کاملاً در `quote_asset` (نه ۵۰/۵۰، نه هیچ نسبتِ دیگر).

**هـ) چرا `USDT=15000, USDC=0`:** چون `v_required_liquidity = 5000 × 3 = 15000` و این عدد به‌طورِ کامل (نه بخشی از آن) وارد `quote_asset` (USDT) می‌شود — دقیقاً طبقِ خطِ ۹۷ در migration فوق.

---

## بخش ۴ — شبیه‌سازی عددی (مدلِ فعلیِ مستقر — quote-only)

Trading Capital = C = $5,000. `PAR = $1`. جفت: `base=USDC, quote=USDT`. `BUY_BASE` = `USDT→USDC` (خرجِ quote برایِ گرفتنِ base). `SELL_BASE` = `USDC→USDT` (خرجِ base برایِ گرفتنِ quote).

### Capacity = 1 (Required Liquidity = $5,000؛ Seed: quote=$5,000, base=$0)

| | سناریو A: `USDT→USDC` (BUY_BASE) اول | سناریو B: `USDC→USDT` (SELL_BASE) اول |
|---|---|---|
| موجودیِ موردنیاز قبل | $5,000 از USDT | $5,000 از USDC |
| موجودیِ فعلی | $5,000 USDT | **$0 USDC** |
| قابلِ‌اجرا؟ | **بله** | **خیر** (`INSUFFICIENT_ALLOCATION_INVENTORY`) |
| موجودی بعد | USDT=$0, USDC≈$5,000+سود | (رد شد — بدون تغییر) |
| سرمایه‌یِ آزادشده | ≈$5,000 (به‌شکلِ USDC) | — |
| معامله‌یِ بعدی هم‌جهت؟ | خیر (USDT≈$0 < $5,000) | — |
| معامله‌یِ جهتِ مخالف؟ | **بله** (USDC≈$5,000 ≥ $5,000) | — |

**نتیجه:** با `Capacity=1`، اگر اولین فرصتِ واقعی در جهتِ `BUY_BASE` باشد، سیستم دقیقاً همان‌طور که طراحی شده کار می‌کند (۱ معامله، سپس منتظرِ بازگشت). اما اگر اولین (و تنها) فرصتِ موجود در بازار **همیشه** `SELL_BASE` باشد (دقیقاً همان چیزی که در Production برایِ Allocation واقعیِ کاربر مشاهده شد — بخشِ ۸)، این Allocation **هرگز، تا ابد**، حتی یک معامله هم نمی‌گیرد.

### Capacity = 2 (Required Liquidity = $10,000؛ Seed: quote=$10,000, base=$0)

سناریو B (`SELL_BASE` اول): رد می‌شود (`USDC=0`). سناریو A: تا ۲ معامله‌یِ متوالیِ هم‌جهت (`$10,000/$5,000=2`) ممکن است، سپس منتظرِ بازگشت.

### Capacity = 3 (Required Liquidity = $15,000؛ Seed: quote=$15,000, base=$0) — دقیقاً موردِ گزارش‌شده

سناریو B (`SELL_BASE` اول): رد می‌شود. تا ۳ معامله‌یِ متوالیِ `BUY_BASE` ممکن است، اما `SELL_BASE` تا اجرایِ حداقل یکی از آن‌ها کاملاً بسته است.

### Capacity = 5 (Required Liquidity = $25,000؛ Seed: quote=$25,000, base=$0)

همان الگو، فقط با ۵ معامله‌یِ متوالیِ ممکن در جهتِ `BUY_BASE`. `SELL_BASE` همچنان صفر تا اجرایِ اولین `BUY_BASE`.

### توالیِ ۵ مرحله‌ای (مثالِ کاربر: ۱.BUY ۲.BUY ۳.SELL ۴.SELL ۵.BUY) — `Capacity=3`

اگر بازار **دقیقاً** به همین ترتیب فرصت بدهد (اول ۲ بار BUY_BASE، بعد ۲ بار SELL_BASE، بعد ۱ بار BUY_BASE)، مدلِ فعلی این توالی را **کامل** اجرا می‌کند (چون همیشه جهتِ لازم را دقیقاً وقتی لازم است تأمین می‌کند):

| گام | جهت | USDT قبل | USDC قبل | قابلِ‌اجرا؟ | USDT بعد | USDC بعد |
|---|---|---|---|---|---|---|
| ۱ | BUY_BASE | 15,000 | 0 | بله | 10,000 | ≈5,001 |
| ۲ | BUY_BASE | 10,000 | 5,001 | بله | 5,000 | ≈10,002 |
| ۳ | SELL_BASE | 5,000 | 10,002 | بله | ≈10,003 | 5,002 |
| ۴ | SELL_BASE | 10,003 | 5,002 | بله | ≈15,005 | ≈2 |
| ۵ | BUY_BASE | 15,005 | ≈2 | بله | ≈10,005 | ≈5,007 |

**اما این توالی خودِ فرض را انتخاب کرده که اولین فرصت‌ها BUY_BASE باشند.** واقعیتِ Production دقیقاً برعکس بود: بازار مدام `SELL_BASE` مثبت پیشنهاد می‌داد و `BUY_BASE` مدام منفی بود — یعنی گامِ ۱ در دنیایِ واقعی می‌شد «SELL_BASE اول»، که مدلِ فعلی **رد** می‌کند، و چون گامِ بعدی هم SELL_BASE می‌ماند (بازار عوض نمی‌شود)، کل توالی هرگز شروع نمی‌شود.

---

## بخش ۵ — چرا ۵۰/۵۰ راه‌حلِ عمومی نیست (و کجا واقعاً درست کار می‌کند)

فرمولِ ۵۰/۵۰: هر Asset = `Required Liquidity / 2 = (C × N) / 2`.

این مقدار وقتی **کمتر از C** باشد، آن طرف اصلاً هیچ معامله‌ای نمی‌تواند اجرا کند — یعنی وقتی `N/2 < 1` یعنی **فقط وقتی N=1**. برایِ `N ≥ 2`، `(C×N)/2 ≥ C` همیشه برقرار است، یعنی **هر دو طرف** حداقل یک معامله‌یِ کامل دارند.

| Capacity (N) | هر Asset تحتِ ۵۰/۵۰ | ≥ C ($5,000)? | دوطرفه از لحظه‌یِ صفر؟ |
|---|---|---|---|
| 1 | $2,500 | خیر | **خیر — هر دو طرف بسته (باگِ اصلیِ تأییدشده)** |
| 2 | $5,000 | بله (دقیقاً برابر) | **بله — ۱ معامله هر طرف** |
| 3 | $7,500 | بله | **بله — ۱ معامله هر طرف، با کمی مازاد** |
| 5 | $12,500 | بله | **بله — ۲ معامله هر طرف** |

**شاهدِ واقعی از Production (بخشِ ۸):** Allocation `eea1374a` (`Capacity=2`, ساخته‌شده **قبل از** اصلاحِ اخیر، یعنی هنوز ۵۰/۵۰ دارد) دقیقاً `FDUSD=$5,000 / USDC=$5,000` است و همین حالا **هر دو جهت** قابلِ‌اجراست. این خودش مدرکِ زنده‌ای است که ۵۰/۵۰ برایِ `N≥2` اصلاً خراب نیست.

**پس چرا ممیزیِ قبلی گفت ۵۰/۵۰ برایِ N=3 هم مشکل دارد؟** چون آن ممیزی معیارِ «۳ معامله‌یِ متوالیِ هم‌جهت از صفر» را سنجید (`floor(7500/5000)=1`, نه ۳) — این معیار درست است اما **معیارِ اشتباهی برایِ بهینه‌سازی است**، چون هزینه‌اش این است که یک طرف را کاملاً می‌بندد. داده‌یِ واقعیِ Production ثابت می‌کند «دوطرفه‌بودن» عملاً مهم‌تر از «N تکرارِ کاملِ هم‌جهت» است — چون بازار جهتِ فرصت را انتخاب نمی‌کند، Allocation باید انتخاب کند.

**نتیجه‌گیریِ صریح:** ۵۰/۵۰ تنها برایِ `Capacity=1` معیوب است. مشکلِ آن یک قانونِ ثابت (نصف‌نصفِ همیشگی) بودنِ آن نیست — مشکل این است که برایِ `N=1` نمی‌توان همزمان «حداقل C در هر دو طرف» را با «مجموع = فقط ۱×C» برآورده کرد؛ این یک **محدودیتِ ریاضیِ واقعی**، نه نقصِ فرمول.

---

## بخش ۶ — مدل صحیح پیشنهادی

### تعریفِ دقیقِ Capacity (پاسخِ صریح به بخشِ ۶ درخواستِ کاربر)

از رویِ کد (نه اسمِ متغیر)، `Capacity` دقیقاً یعنی: **«ضریبِ بودجه‌یِ کل» — چند برابرِ Trading Capital باید به‌عنوانِ سرمایه‌یِ کلِ این Allocation کنار گذاشته شود.** هیچ معنایِ دیگری (تعدادِ معاملاتِ همزمان، تعدادِ دفعاتِ مجازِ استفاده، حجمِ گردش) در منطقِ تصمیم‌گیری اعمال **نمی‌شود** — تنها اثرش `requiredLiquidityUsd = C × N` است. تعریفِ «N فرصتِ تکراریِ هم‌جهت» فقط در **کامنتِ کد و در فرمولِ Seed** وجود دارد، نه در خودِ موتورِ تصمیم‌گیری؛ بنابراین **این تعریف در حالِ حاضر ناسازگار است**: کاربر انتظار دارد N به معنایِ «چند بار می‌توانم پشتِ سرِ هم در یک جهت معامله کنم» باشد، اما موتور اصلاً این محدودیت را اعمال نمی‌کند (محدودیتِ واقعی صرفاً از موجودیِ فیزیکی می‌آید، نه از یک شمارنده). این ابهام باید صراحتاً به‌عنوانِ یک یافته گزارش شود: **Capacity یک "ضریبِ بودجه" است، نه یک "شمارنده‌یِ فرصت"، هرچند اسم و کامنت‌های کد چنین القا می‌کنند.**

### فرمولِ پیشنهادی: تقسیمِ `floor`/`ceil` به‌جایِ ۵۰/۵۰ یا «همه در یک Asset»

```
base_seed  = Trading Capital × floor(Opportunity Capacity / 2)
quote_seed = Trading Capital × ceil(Opportunity Capacity / 2)
```

(جهتِ اختصاصِ مازاد به `quote` یک قراردادِ صریح است — دقیقاً چون `BUY_BASE` همان جهتی است که موتور همیشه **اول** ارزیابی می‌کند، طبقِ کامنتِ موجودِ کد. این قرارداد قابلِ‌تغییر است، اما باید **صریح و مستند** باشد، نه ضمنی.)

بررسیِ ویژگی‌هایِ موردنیازِ کاربر:

- **بودجه‌یِ واحد، بدون تولیدِ سرمایه‌یِ مصنوعی:** `base_seed + quote_seed = C×⌊N/2⌋ + C×⌈N/2⌋ = C×N = Required Liquidity` **دقیقاً**، برایِ هر N — هیچ دلاری از هیچ کجا اضافه نمی‌شود.
- **هر دو جهت را پوشش می‌دهد (برایِ N≥2):** چون `⌊N/2⌋ ≥ 1` وقتی `N≥2`، هر دو طرف حداقل یک C کامل دارند.
- **با ظرفیت سازگار است:** طرفِ غالب (`quote`) هرچه N بزرگ‌تر شود، سهمِ بیشتری از تکرارِ هم‌جهت می‌گیرد (`⌈N/2⌉`).
- **سود را با سرمایه ترکیب نمی‌کند:** این فرمول فقط در لحظه‌یِ Seed اجرا می‌شود؛ منطقِ عدمِ ترکیبِ سود (بخشِ ۹) کاملاً دست‌نخورده می‌ماند.
- **با اجرایِ متوالی سازگار است:** دقیقاً همان مکانیزمِ فعلیِ «موجودیِ خروجیِ یک معامله، ورودیِ معامله‌یِ بعدی در جهتِ مخالف می‌شود» را حفظ می‌کند — فقط نقطه‌یِ شروع را دوطرفه می‌کند.

### مثال‌هایِ عددی (C = $5,000)

| Capacity | `base_seed` (USDC) | `quote_seed` (USDT) | جمع | هر دو جهت از لحظه‌یِ صفر؟ |
|---|---|---|---|---|
| 1 | $0 | $5,000 | $5,000 | خیر (محدودیتِ ریاضیِ واقعی — توضیح در ادامه) |
| 2 | $5,000 | $5,000 | $10,000 | **بله — ۱ معامله هر طرف** |
| 3 | $5,000 | $10,000 | $15,000 | **بله — ۱ معامله در SELL_BASE، ۲ معامله در BUY_BASE** |
| 5 | $10,000 | $15,000 | $25,000 | **بله — ۲ معامله در SELL_BASE، ۳ معامله در BUY_BASE** |

**موردِ `Capacity=1`:** هیچ فرمولی نمی‌تواند `1×C` را به دو سهمِ `≥C` تقسیم کند — این یک محدودیتِ فیزیکیِ سرمایه است، نه ضعفِ فرمول. `floor/ceil` در این حالت دقیقاً همان رفتارِ فعلی (کاملِ `quote`) را می‌دهد؛ این عمداً و صادقانه یک موردِ مرزیِ باقی‌مانده است (بخشِ ۱۱).

---

## بخش ۷ — رفتار بعد از چند معامله (شبیه‌سازیِ ۵ معامله‌ای، مدلِ پیشنهادی، `Capacity=3`)

Seed: `USDC=$5,000, USDT=$10,000`. فرضِ واقعی‌تر (مطابقِ داده‌یِ Production): بازار **اول** فرصتِ `SELL_BASE` می‌دهد.

| گام | جهت | USDT قبل | USDC قبل | قابلِ‌اجرا؟ | USDT بعد | USDC بعد |
|---|---|---|---|---|---|---|
| ۱ | SELL_BASE | 10,000 | 5,000 | **بله** (مدلِ فعلی: رد می‌شد) | ≈15,001 | 0 |
| ۲ | SELL_BASE | 15,001 | 0 | خیر (`INSUFFICIENT_ALLOCATION_INVENTORY` — درست، موجودی تمام شده) | — | — |
| ۳ | BUY_BASE | 15,001 | 0 | بله | 10,001 | ≈5,002 |
| ۴ | BUY_BASE | 10,001 | 5,002 | بله | 5,001 | ≈10,004 |
| ۵ | SELL_BASE | 5,001 | 10,004 | بله | ≈10,005 | 5,004 |

**تفاوتِ کلیدی با مدلِ فعلی:** در گامِ ۱، مدلِ فعلی این معامله‌یِ **واقعاً سودآور** را برایِ مدتِ نامعلوم (در Production واقعی: حداقل ۴۵ دقیقه، همچنان درحالِ ادامه) از دست می‌دهد؛ مدلِ پیشنهادی همان لحظه آن را می‌گیرد.

---

## بخش ۸ — تخصیص‌های واقعی فعلی (فقط‌خواندنی، بدونِ هیچ تغییر)

خواندنِ مستقیم از `stablecoin_pair_allocations` + `stablecoin_demo_inventory` (Read-Only، `SELECT` تنها). هر ۴ Allocation فعالِ Production:

| allocation_id | setup_id | pair | Trading Capital | Capacity | Required Liquidity | base/quote | موجودیِ فعلی (base/quote) | ایجادشده | قبل/بعدِ Seed-Fix | دوطرفه‌یِ ساختاری؟ | علتِ دقیقِ عدمِ‌امکان |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `3cc778cd-...` | `97df1bdc-...` | USDCUSDT | $5,000 | 3 | $15,000 | USDC/USDT | $0 / $15,000 | 2026-09-14 20:29 UTC | **بعد** (مدلِ جدید) | **خیر** | `SELL_BASE` همیشه `INSUFFICIENT_ALLOCATION_INVENTORY` (موردِ دقیقِ گزارش‌شده توسطِ کاربر) |
| `eea1374a-...` | `6a175e0e-...` | FDUSDUSDC | $5,000 | 2 | $10,000 | FDUSD/USDC | $5,000 / $5,000 | 2026-09-14 08:11 UTC | قبل (مدلِ ۵۰/۵۰) | **بله** | — هر دو جهت هم‌اکنون قابلِ‌اجراست |
| `a857cbdc-...` | `6a175e0e-...` | TUSDUSDT | $5,000 | 1 | $5,000 | TUSD/USDT | $2,500 / $2,500 | 2026-09-14 08:09 UTC | قبل (مدلِ ۵۰/۵۰) | **خیر** | هیچ‌کدام از دو طرف به $5,000 نمی‌رسد (باگِ اصلیِ Capacity=1، هنوز اصلاح‌نشده روی این Allocation) |
| `09b1c1ae-...` | `2b249bf2-...` | USDCUSDT | $5,000 | 1 | $5,000 | USDC/USDT | $2,500 / $2,500 | 2026-09-14 08:03 UTC | قبل (مدلِ ۵۰/۵۰) | **خیر** | همانِ بالا |

**شاهدِ واقعیِ Production برایِ `3cc778cd`** (۲۰ ردیفِ آخرِ `stablecoin_cycle_decisions`، ۹ چرخه‌یِ کاملِ ۵ دقیقه‌ای، ۲۰۲۶-۰۹-۱۵ ۰۴:۱۱ تا ۰۴:۵۶ UTC): **در تمامِ ۹ چرخه، بدونِ استثنا**، `SELL_BASE` سودِ خالصِ مثبت (بینِ +$0.70 تا +$0.75 روی $5,000، یعنی حدودِ ۰.۰۱۴٪ تا ۰.۰۱۵٪ اسپردِ خالص) داشته اما با `INSUFFICIENT_ALLOCATION_INVENTORY` رد شده، درحالی‌که `BUY_BASE` در همان چرخه‌ها همیشه اسپردِ منفی داشته (`Spread too small`، واقعاً بدونِ فرصت). یعنی این Allocation **حداقل ۴۵ دقیقه، پشتِ سرِ هم، یک فرصتِ واقعیِ کوچک را از دست داده — نه به‌خاطرِ نبودِ فرصت، بلکه صرفاً به‌خاطرِ صفر بودنِ USDC.**

هیچ‌کدام از این ۴ Allocation تغییر، متوقف، یا لمس نشد.

---

## بخش ۹ — تأثیر روی کد (در صورتِ تأییدِ مدلِ پیشنهادی)

**تنها یک تابع نیاز به تغییر دارد** — `create_stablecoin_pair_allocation()` (دو migration فایل، آخری فعال است: `migrations/stablecoin_allocation_inventory_seed_fix.sql`، خطوطِ ۹۴–۹۷)، دقیقاً همان دو خطِ `INSERT ... stablecoin_demo_inventory`:

```sql
-- به‌جای:
(v_allocation_id, p_setup_id, p_base_asset, 0, now()),
(v_allocation_id, p_setup_id, p_quote_asset, v_required_liquidity, now());
-- می‌شود (مثلاً):
(v_allocation_id, p_setup_id, p_base_asset, p_trading_capital_usd * floor(p_opportunity_capacity / 2), now()),
(v_allocation_id, p_setup_id, p_quote_asset, p_trading_capital_usd * ceil(p_opportunity_capacity / 2), now());
```

**هیچ فایلِ دیگری نیاز به تغییر ندارد:**
- `classifyStablecoinExecutability`/`decideStablecoinTrade`/`runAllocationCycle` (`api/stablecoin-engine.ts`) — بدونِ تغییر؛ این توابع فقط موجودیِ **موجود** را می‌خوانند، فرقی نمی‌کند آن موجودی چگونه Seed شده.
- محاسبه‌یِ `requiredLiquidityUsd`/ROI/گزارش — بدونِ تغییر (این عدد همان می‌ماند، فقط توزیعِ آن بینِ دو Asset تغییر می‌کند).
- UI (`src/app/App.tsx`) — بدونِ تغییر (همان فیلدهایِ موجودیِ Base/Quote را نشان می‌دهد؛ فقط اعدادِ نمایش‌داده‌شده برایِ Allocationهایِ **جدید** فرق می‌کند).
- **این تغییر روی Allocationهایِ موجود هیچ اثری ندارد** — دقیقاً مثلِ اصلاحِ قبلی، فقط رفتارِ Allocationِ **جدید** را عوض می‌کند؛ Allocationهایِ فعلی (چه ۵۰/۵۰، چه quote-only) دست‌نخورده می‌مانند مگر اینکه Stop و دوباره ساخته شوند (تصمیمی که کاملاً به‌عهده‌یِ کاربر است).

---

## بخش ۱۰ — برنامه اصلاح (پیشنهادی، اجرا‌نشده)

۱. تأییدِ مدلِ `floor`/`ceil` (یا هر مدلِ جایگزینِ موردِ تأییدِ کاربر) — شاملِ تصمیمِ صریح دربابِ اینکه کدام Asset «مازاد» را می‌گیرد (پیشنهاد: `quote`، مطابقِ قراردادِ موجودِ «BUY_BASE اول ارزیابی می‌شود»).
۲. تصمیمِ صریح دربابِ موردِ مرزیِ `Capacity=1` — آیا همان رفتارِ فعلی (کاملاً یک‌طرفه) پذیرفته می‌شود، یا سیاستِ محصول تغییر می‌کند (مثلاً حداقلِ مجازِ `Capacity=2` برایِ Allocationهایِ جدید، یا اجازه‌یِ انتخابِ دستیِ جهتِ اولیه توسطِ کاربر).
۳. نوشتنِ یک migration جدید (`CREATE OR REPLACE FUNCTION` روی همان تابع، دقیقاً مطابقِ قراردادِ موجودِ پروژه — additive، بدونِ backfill رویِ Allocationهایِ موجود).
۴. افزودنِ تست‌هایِ واحد (frozen mirror، مطابقِ قراردادِ `scripts/stablecoin-engine-test.mjs`) که دقیقاً همینِ جدولِ بخشِ ۶ را برایِ `N=1,2,3,5` تأیید کنند.
۵. `npm run build` + `tsc` + `git diff --check` (بدونِ تغییر در فایل‌هایِ TypeScript، این مرحله صرفاً برایِ اطمینان از عدمِ Regression در بقیه‌یِ سیستم).
۶. اجرایِ migration رویِ Production (طبقِ روالِ همیشگی: `npm run backup` قبل از هر migration).
۷. یک تستِ زنده‌یِ Read-Only (مشابهِ همین ممیزی) بلافاصله بعد از Deploy، برایِ تأییدِ اینکه یک Allocation **جدید** واقعاً به‌شکلِ دوطرفه Seed می‌شود — بدونِ لمسِ هیچ Allocation واقعیِ موجود.

---

## بخش ۱۱ — خطرات و حالت‌های مرزی

- **`Capacity=1`:** همان‌طور که بخشِ ۶ نشان داد، هیچ مدلی نمی‌تواند این حالت را کاملاً دوطرفه کند. باقی می‌ماند به‌عنوانِ یک محدودیتِ شناخته‌شده و مستند، نه یک باگِ حل‌نشده.
- **`Capacity` بزرگ (مثلاً ۵۰):** فرمولِ `floor`/`ceil` بدونِ مشکل مقیاس می‌شود (`base=25×C, quote=25×C`)؛ هیچ سرریز یا رفتارِ غیرمنتظره‌ای پیش‌بینی نمی‌شود.
- **فرصتِ فقط یک‌طرفه (بازار همیشه یک جهت را می‌دهد):** مدلِ پیشنهادی این حالت را کاملاً حل می‌کند برایِ `N≥2` (حداقل یک معامله در هر جهت هرگز از دست نمی‌رود)؛ برایِ `N=1` همچنان وابسته به اینکه کدام جهت اول Seed شود.
- **فرصتِ دوطرفه (بازار هر دو جهت را می‌دهد):** هر دو مدل (فعلی و پیشنهادی) به‌خوبی کار می‌کنند، چون تنها یکی از دو تصمیم در هر چرخه واقعاً اجرا می‌شود (رتبه‌بندی بر اساسِ `netProfitUsd`، `runAllocationCycle`، خطِ ۸۲۹-۸۳۰) — این بخش از منطق کاملاً بدونِ تغییر می‌ماند.
- **چند معامله پشتِ سرِ هم در یک جهت:** هر دو مدل به‌طورِ طبیعی محدودیت را از رویِ موجودیِ واقعی اعمال می‌کنند (بدونِ نیاز به شمارنده‌یِ جداگانه) — دقیقاً همان رفتارِ «هیچ Rebalancing اجباری، منتظرِ فرصتِ برگشت» که در کدِ فعلی مستند شده و باید حفظ شود.
- **تغییرِ جهت:** بدونِ تغییر در منطق — همان مکانیزمِ فعلی (موجودیِ خروجیِ یک معامله = ورودیِ معامله‌یِ بعدی در جهتِ مخالف) دقیقاً حفظ می‌شود.
- **سودِ مثبت/منفی:** بدونِ اثر روی مدلِ موجودی — سود همچنان طبقِ بخشِ ۹ کاملاً جدا از سرمایه/ظرفیت/نقدینگیِ موردنیاز محاسبه می‌شود (این ممیزی هیچ تغییری در این بخش پیشنهاد نمی‌دهد).
- **موجودیِ صفر (دقیقاً موردِ گزارش‌شده):** با مدلِ پیشنهادی، «صفرِ کامل» فقط برایِ `Capacity=1` (و فقط در یکی از دو Asset) باقی می‌ماند؛ برایِ `Capacity≥2` هرگز هیچ Asset صفر نمی‌ماند.
- **کمبودِ جزئیِ موجودی (مثلاً $4,999 به‌جایِ $5,000):** رفتارِ فعلی (رد کاملِ معامله، بدونِ اجرایِ جزئی) طبقِ طراحیِ مستندِ «no partial-size trade» درست و بدونِ تغییر باقی می‌ماند — این ممیزی به این بخش دست نمی‌زند.
- **نقدینگیِ کافیِ بازار ولی موجودیِ ناکافیِ تخصیص:** این دقیقاً همان تمایزی است که فازِ قبلی (commit `c497c6b`، همین امروز Deploy شد) با تفکیکِ `INSUFFICIENT_ALLOCATION_INVENTORY` از `INSUFFICIENT_MARKET_LIQUIDITY` **از قبل حل کرده است** — موردِ `3cc778cd` در بخشِ ۸ دقیقاً با علتِ صحیح (`INSUFFICIENT_ALLOCATION_INVENTORY`) ثبت می‌شود، نه با کمبودِ نقدینگیِ بازار. **این ممیزی هیچ مشکلی در تشخیصِ علت پیدا نکرد** — مشکل صرفاً در مدلِ Seed است که باعث می‌شود این علتِ (درست‌تشخیص‌داده‌شده) اصلاً پیش بیاید.

---

## پاسخِ صریح به سؤالِ پایانی

**«آیا اکنون می‌توان فرمول موجودی را با اطمینان پیاده‌سازی کرد یا هنوز یک ابهام معماری وجود دارد؟»**

فرمول (`floor`/`ceil`) از نظرِ ریاضی کاملاً مشخص، آزمون‌پذیر، و بدونِ ابهام است — **می‌توان با اطمینان پیاده‌سازی کرد**. اما **دو تصمیمِ محصولی (نه فنی)** باقی می‌ماند که باید صریحاً توسطِ کاربر تأیید شود، نه به‌صورتِ ضمنی توسطِ من انتخاب شود:

۱. **کدام Asset «مازاد» را بگیرد؟** (پیشنهادِ من: `quote`، هم‌راستا با قراردادِ موجودِ «BUY_BASE اول ارزیابی می‌شود» — اما این یک انتخاب است، نه یک ضرورتِ ریاضی.)
۲. **رفتارِ `Capacity=1` چه باید باشد؟** (پذیرفتنِ محدودیتِ ذاتیِ یک‌طرفه‌بودن، یا تغییرِ سیاست به حداقلِ `Capacity=2`، یا هر گزینه‌یِ دیگر.)

با تعیینِ این دو مورد، **هیچ ابهامِ معماریِ باقی‌مانده‌ای وجود ندارد** و پیاده‌سازی می‌تواند بدونِ حدس آغاز شود.

---

## Production Safety

Zero database writes, zero migrations executed, zero Allocations stopped/deleted/reset, zero trades created, zero scheduler changes, zero Binance orders, zero commits, zero pushes, zero deploys in this task. All queries were `SELECT`-only against `stablecoin_pair_allocations`, `stablecoin_demo_inventory`, and `stablecoin_cycle_decisions` via the same established read-only credential path used in prior audits. `signal0verse/signalverse-main` remains at commit `c497c6b` — unchanged.

---

## FINAL STATUS TABLE

```
AUDIT COMPLETED: YES (read-only)
CURRENT MODEL VERDICT: INCORRECT (structurally one-sided for all Capacity values, not just Capacity=1)
ROOT CAUSE IDENTIFIED: YES (create_stablecoin_pair_allocation seeds 100% of Required Liquidity into quote_asset only)
50/50 MODEL VERDICT: PARTIALLY CORRECT (broken ONLY for Capacity=1; genuinely correct for Capacity>=2, confirmed by live production data)
CAPACITY DEFINITION CLARIFIED: YES (a total-budget multiplier, NOT a trade-count limiter enforced anywhere in decision logic - the "N repeated same-direction" semantic exists only in seeding/comments, creating a real architectural ambiguity, now explicitly documented)
PROPOSED MODEL: floor(N/2) to base asset, ceil(N/2) to quote asset - preserves total budget exactly, guarantees bidirectional readiness for Capacity>=2
NUMERIC SIMULATION FOR N=1,2,3,5: DONE
50-TRADE-SEQUENCE SIMULATION: DONE (5-step sequence, both current and proposed models)
REAL PRODUCTION ALLOCATIONS AUDITED: YES (4 ACTIVE allocations, read-only, zero changes)
REAL BUG CONFIRMED LIVE: YES (allocation 3cc778cd-..., 9 consecutive cycles / 45+ minutes, SELL_BASE rejected with positive net profit +$0.70-0.75 every single cycle due to $0 USDC balance)
CODE IMPACT IF APPROVED: 1 function (create_stablecoin_pair_allocation, 2 lines) - no TypeScript/UI change needed
ARCHITECTURAL AMBIGUITY REMAINING: 2 product decisions only (which asset gets the surplus; how to handle Capacity=1) - NOT a mathematical/technical ambiguity
DATABASE WRITE: NO
MIGRATION EXECUTED: NO
ALLOCATION CHANGED/STOPPED/DELETED/RESET: NO
TRADE CREATED: NO
SCHEDULER CHANGED: NO
BINANCE ORDER SENT: NO
CODE COMMITTED: NO
CODE PUSHED: NO
PRODUCTION DEPLOYED: NO
AWAITING: user decision on the 2 product-policy questions before any implementation
```
