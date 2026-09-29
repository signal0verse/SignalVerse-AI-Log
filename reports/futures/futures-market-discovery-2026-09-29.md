# کشف خودکار بازار فیوچرز (Market Discovery / Candidate Selection)

## Metadata

- Date: 2026-09-29
- Task ID: futures-market-discovery
- Module: Futures (کشف و انتخاب کاندید پیش از موتور تصمیم فعلی)
- Mode: پیاده‌سازی روی شاخهٔ ویژگی، **بدون انتشار** و بدون migration روی Production
- Repository: `signal0verse/signalverse-main`
- Branch: `feat/futures-market-discovery`
- Starting commit: `b2c48bf24e2caac81bbc20b03c3de024e719136b` (origin/main)
- Ending commit: `1c54268efd000c2eb88e496def61fee1f444b40e` (push شده به همان شاخه، بدون PR)

## Objective

حذف گلوگاه انتخاب دستی نماد در لیست Pro فیوچرز (مثلاً HBAR و ALGO). هدف یک لایهٔ خودکار است که کل
universe فیوچرز را اسکن کند و کاندیدهای LONG و SHORT را به **همان موتور فعلی** بدهد، بدون موتور دوم،
بدون مجوز معاملهٔ واقعی تازه و بدون تبدیل‌شدن به یک استراتژی معاملاتی تازه.

## Scope

- مجاز: لایهٔ کشف pure، آداپتورهای دادهٔ عمومی صرافی، اتصال به لیست دمو، حالت اختیاری شبیه‌ساز،
  observability، UI، تست و مستندات.
- ممنوع و رعایت‌شده: تغییر فرمول موتور یا مسیر تصمیم در `analyze.ts`، مجوز واقعی، credential یا
  پیکربندی صرافی، Spot، Prediction Market، Fast Trader برای Real، و ضعیف‌کردن کنترل‌های امنیتی.

## Actions Taken

1. ممیزی کد موجود: موتور canonical، تیک Pro، مصرف لوپ و کردیت، Fast Trader، شبیه‌ساز، fetcherهای
   کندل بومی، زمینهٔ funding/OI و Market Regime. `TRADING_STRATEGY.md` کامل خوانده شد.
2. بازبینی معماری A تا J پیش از هر کدنویسی (در گفت‌وگو ارائه شد).
3. تأیید شِمای endpointهای عمومی با GET بدون کلید. یافته‌ها: `riseFallRate` در MEXC غلتان نیست؛
   حجم کندل Gate/MEXC به قرارداد است؛ Binance و Gate فاندینگ ۴ساعته دارند.
4. پیاده‌سازی هستهٔ pure، آداپتورها، اتصال زنده، شبیه‌ساز، migration و UI.
5. تست آفلاین کامل، سپس اسکن فقط‌خواندنی روی دادهٔ عمومی واقعی. این اسکن دو باگ آداپتور را نشان
   داد که رفع و دوباره تأیید شد (پایین).
6. به‌روزرسانی مستندات، commit و push شاخه.

## Files Inspected

`api/_shared/futures-decision-engine.ts`، `futures-market-data.ts`، `futures-candle-provenance.ts`،
`futures-indicators.ts`، `api/copytrade.ts` (تیک Pro، `consumeFuturesProCycle`، `fastTraderTick`،
`runSimulation`، `create-pro-setup`، fetcherها، `executeDemoProOpen`)، `api/analyze.ts` (`engine_decisions`،
راهنمای شناور)، `src/app/App.tsx` (لیست Pro و Simulation Lab)، migrationهای `futures_pro_*`،
`.github/workflows/production-ci.yml`، `AGENTS.md`، `CLAUDE.md`، `TRADING_STRATEGY.md`، `HANDOFF.md`،
`docs/testing/stability-test-runbook.md`.

## Files Changed

- جدید: `api/_shared/futures-market-discovery.ts`، `api/_shared/futures-discovery-data.ts`،
  `migrations/futures_market_discovery.sql`، `docs/futures-market-discovery.md`، و چهار فایل تست
  `scripts/futures-market-discovery-test.mjs`، `scripts/futures-discovery-data-test.mjs`،
  `scripts/futures-simulation-discovery-test.mjs`، `scripts/futures-discovery-live-test.mjs`،
  به‌علاوهٔ `scripts/lib/futures-discovery-fixtures.mjs`.
- تغییریافته: `api/copytrade.ts`، `src/app/App.tsx`، `api/analyze.ts` (**فقط** متن
  `HELP_ASSISTANT_APP_DESCRIPTION`)، `.github/workflows/production-ci.yml` (یک مرحلهٔ تست)،
  `HANDOFF.md`، `TRADING_STRATEGY.md`، `docs/testing/stability-test-runbook.md`.

## Root Cause / Findings

- CONFIRMED: ورودی موتور فقط از ردیف‌های `futures_pro_setups` می‌آید، شبیه‌ساز فقط `symbols[]` ثابت
  دارد و Fast Trader فقط نمادهای جلسه را می‌گیرد. هیچ اسکنر فیوچرزی وجود نداشت.
- CONFIRMED: فرستادن نماد کشف‌شده مستقیم به موتور، `consumeFuturesProCycle` را دور می‌زد (بدون ردیف
  فعال، لوپ یا کردیت مصرف نمی‌شود). به همین دلیل اتصال از طریق ردیف لیست دمو ساخته شد.
- CONFIRMED: fill و SL/TP دمو از spot mirror Binance قیمت می‌گیرد. ارز فقط‌فیوچرز در دمو باز می‌شد و
  دیگر پایش نمی‌شد، پس فیلتر «قابل‌قیمت‌گذاری در دمو» اضافه شد.
- CONFIRMED (اسکن زنده): snapshot universe چند میلی‌ثانیه بعد از `asOfMs` ثبت می‌شد و گارد look-ahead
  همهٔ ۴۰ نماد Binance را `STALE_SNAPSHOT` کرد. رفع شد: زمان تصمیم اسکن زمانِ مشاهدهٔ universe است.
- CONFIRMED (اسکن زنده): MEXC در انفجار درخواست HTTP 200 با کد 510 برمی‌گرداند و ۲۵ نماد از ۴۰ از
  دست رفت. رفع شد با فاصله‌گذاری درخواست (MEXC ۱۵۰، Gate ۶۰، Binance ۴۰ میلی‌ثانیه)؛ اکنون ۴۰ از ۴۰.
- CONFIRMED: MEXC تاریخچهٔ OI عمومی منتشر نمی‌کند و لیکوئیدیشن فقط در Gate عمومی است.

## Implementation

**معماری:** `Universe (آداپتور) → Discovery (pure) → Ranking → ردیف لیست دمو (source='discovery') →
futuresProWatchTick → موتور → Risk → اجرا`. همهٔ مراحل بعد از Ranking بدون تغییرند.

**امتیازدهی** (قطعی، نرمال‌شده با ATR، LONG و SHORT جدا):
- رژیم ۴ساعته مرجع است: BULLISH/BEARISH_TREND، RANGE، TRANSITION، HIGH_VOLATILITY، UNCERTAIN.
- ۱ساعته فقط تأیید می‌کند: CONFIRMS، NEUTRAL (×۰٫۹)، OPPOSES (تعویق) و هرگز خلاف روند قوی ۴ساعته
  جهت نمی‌سازد.
- وزن‌ها: ساختار روند ۰٫۳۵، مومنتوم ۱H/4H/24H/7D برابر ۰٫۲۵، مشارکت حجم ۰٫۱۵، جایگاه OI و قیمت ۰٫۲۵.
  در جایگاه OI، پوزیشن تازه قوی است و رشد با بستن شورت یا افت با لیکوئید لانگ ضعیف.
- فاندینگ فقط اصلاح‌گر ازدحام است (×۰٫۷۵ تا ×۱٫۱۰) و ≥ ۰٫۱۰٪ در ۸ ساعت در سمت شلوغ رد می‌شود.
- گیت‌ها: گردش ≥ ۱۰ میلیون دلار، OI ≥ ۵ میلیون دلار، اسپرد ≤ ۱۰ bps، سن ≥ ۱۴ روز، snapshot یا کندل
  تازه، و رد جهش در نقدشوندگی پایین.
- ضد chasing: فاصله از EMA20 چهارساعته ≥ ۳ ATR تعویق و ≥ ۴٫۵ ATR رد؛ حرکت ۲۴ساعتهٔ بزرگ و کندل
  ضربه‌ای تعویق.
- انتخاب: امتیاز ≥ ۴۰ و حداقل ۲۰ واحد برتری بر سمت مقابل؛ وگرنه «برتری جهت‌دار ندارد».
- خروجی: `symbol, direction, discoveryScore, confidence, reasons, blockers, metrics, detectedRegime,
  timestamp, rank`. هیچ سطح ورود یا حد ضرری ندارد.

**زنده:**
- action جداگانهٔ `futures-discovery-cron-tick` با بودجهٔ خودش. هر صرافی حداکثر هر ۱۵ دقیقه و فقط وقتی
  کاربری آن را فعال کرده باشد اسکن می‌شود.
- endpointهای `futures-discovery` (فقط‌خواندنی، دمو و واقعی) و `futures-discovery-refresh`.
- `set-futures-discovery-profile` فقط برای دمو است؛ واقعی پاسخ ۴۰۳ می‌گیرد و یک CHECK دیتابیسی هم
  همین را اجباری می‌کند.
- ارزهای دستی مقدم‌اند و دست نمی‌خورند. ردیف کشف‌شده فقط وقتی برداشته می‌شود که نمادش قطعاً کاندید
  نباشد؛ هرگز زیر پوزیشن باز یا با اسکن ناموفق یا کهنه.

**شبیه‌ساز:** گزینهٔ `discovery` با پیش‌فرض خاموش؛ حداکثر ۸ ارز و ۱۸۰ روز. گزارش هر تصمیم کاندیدها و
تصمیم بعدی موتور (موافق یا مخالف) را جدا ثبت می‌کند.

**Observability:** جدول `futures_discovery_runs` (نگهداری ۱۴ روز) و ستون
`futures_pro_setups.discovery_meta`. پیوند به `engine_decisions` خطای اسکنر را از خطای موتور جدا
می‌کند.

## Tests Executed

همه از ریشهٔ worktree با `env -i PATH=... LANG=C.UTF-8 TZ=UTC`؛ بدون env، DB واقعی، کلید یا سفارش.

- `node --test scripts/futures-market-discovery-test.mjs scripts/futures-discovery-data-test.mjs scripts/futures-simulation-discovery-test.mjs scripts/futures-discovery-live-test.mjs`
  → **۶۱/۶۱ PASS**:
  - هسته ۳۱: هر ۱۵ سناریو، تقارن LONG/SHORT، «لیست برندگان نیست»، فیلترهای ایمنی، نبود داده، ۴
    تست look-ahead، قطعیت، اعتبارسنجی config، ساختار exchange-agnostic.
  - آداپتور ۱۱.
  - شبیه‌ساز ۶: پیش‌فرض خاموش برابر رفتار قبل، نهایی‌بودن موتور، look-ahead.
  - نگهداری زنده ۱۳.
- مجموعهٔ آفلاین CI (۲۳ فایل) → **۴۷۸/۴۷۹**. تنها شکست، `stablecoin-engine-test`، روی `origin/main`
  هم با همان ۱۰ خطا شکست می‌خورد و به این کار مربوط نیست.
- `learning-experience-test` → ۱۶ ساختاری و ۲۶/۲۶ PASS.
- `futures-pro-scheduler-reliability-test` → ۱۷/۱۷ PASS.
- `futures-shared-engine-test` → ۵۵/۵۵ PASS.
- baseline پیش از تغییر برای همین مجموعه‌ها: ۳۵۹/۳۵۹، ۵۵/۵۵، ۱۷/۱۷ و ۲۶/۲۶.
- اجرا نشد (طبق AGENTS.md، چون env بکاپ یا DB تولید یا شبکه را می‌خوانند):
  `futures-pro-credit-reservation`، `futures-pro-cycle-consumption`، `futures-pro-real-automation`،
  `strategy-engine-parity`، `futures-engine-macro-gate-parity` و سه تست Fast Trader.
- `futures-completion-scope-check` به baseline قدیمی `a4c1edc` قفل است و روی `origin/main` از قبل
  شکست می‌خورد، پس برای این کار سیگنال معتبری نیست.

## Build Result

- `npm run build` → موفق.
- esbuild همهٔ `api/*.ts` مثل CI → ۱۴ از ۱۴ bundle.
- `tsc` روی `src` → ۶۰ خطای ازپیش‌موجود، بدون خطای تازه.
- tsc سخت‌گیر روی `api/copytrade.ts` و دو ماژول جدید → مجموعهٔ خطا دقیقاً برابر `origin/main`
  (۲۲ خطای ازپیش‌موجود، صفر خطای تازه).
- `git diff origin/main -- api/_shared/futures-decision-engine.ts` → خالی.

## Git Status

شاخهٔ `feat/futures-market-discovery` تمیز است و به origin push شده (`1c54268`). روی `main` چیزی
push نشده، PR باز نشده و Production تغییری نکرده است.

## Commit

`1c54268efd000c2eb88e496def61fee1f444b40e`

## نمونهٔ زنده (دادهٔ عمومی، ۲۰۲۶-۰۹-۲۹ حدود ۱۳:۰۲ UTC، فقط‌خواندنی)

| صرافی | Universe | بررسی عمیق | کاندید LONG | کاندید SHORT |
|---|---|---|---|---|
| Binance | ۵۲۰ | ۴۰ | AVAX 48، CRV 48، XLM 44، ALGO 41 | — |
| Gate | ۵۶۵ | ۲۸ | AVAX 44 | — |
| MEXC | ۶۴۸ | ۴۰ | CRV 56، ALGO 45 | SILVER 65 |

- انتخاب‌نشده‌ها با علت واقعی:
  - 0G با +۳۸٫۶٪ (بزرگ‌ترین حرکت روز) → رد با `REGIME_HIGH_VOLATILITY`.
  - US با −۲۱٫۹٪ → رد، نوسان بیش از حد.
  - AAVE با +۱۵٫۵٪ → تعویق، `EXTENDED_FROM_4H_MEAN_WAIT_PULLBACK`.
  - PAXG، XAU و XAUT → روند ۴ساعتهٔ نزولی ولی `1H_NOT_CONFIRMING`، پس تعویق.
  - NMR و QNT در Gate → `LOW_OPEN_INTEREST`.
- BTC در حالت RANGE بود و breadth نزدیک صفر. در Binance و Gate هیچ SHORT اجباری ساخته نشد.
- اینها **کاندیدند، نه معامله**؛ موتور ممکن است روی هیچ‌کدام وارد نشود.

## تأییدها

- موتور canonical و مسیر تصمیم `analyze.ts` بدون تغییرند؛ موتور تصمیم‌گیرندهٔ نهایی است و مخالفتش فقط
  ثبت می‌شود.
- الگوریتم برای دمو، واقعی و شبیه‌ساز یکی است؛ تست برابری سه صرافی تصمیم یکسان داد.
- هیچ مجوز واقعی اضافه نشد: واقعی فقط پیشنهاد می‌بیند (۴۰۳ به‌علاوهٔ CHECK دیتابیسی).
- Fast Trader دست‌نخورده و فقط دمو است.
- هیچ credential، پیکربندی صرافی، Spot یا Prediction تغییر نکرد.

## Remaining Issues

- هیچ سنجش سودآوری انجام نشده. کشف فقط انتخاب نماد را خودکار می‌کند و شواهد کیفیت باید از گزارش
  کشف در برابر موتور در شبیه‌ساز و دمو جمع شود.
- فعال‌سازی زنده به کار مالک نیاز دارد: backup، اجرای `migrations/futures_market_discovery.sql` روی
  `signalverse_cutover2`، انتشار SHA تأییدشده، و افزودن `action=futures-discovery-cron-tick` به
  `signalverse-fast-jobs.timer`. تا آن زمان endpointها `DISCOVERY_NOT_CONFIGURED` برمی‌گردانند.
- دسترسی `fapi.binance.com` از VPS باید پیش از فعال‌سازی Binance زنده تأیید شود.

## Risks / Limitations

- MEXC OI ندارد، پس confidence کمتر است.
- شبیه‌ساز OI و اسپرد تاریخی ندارد (`null`، ساختگی نیست) و فقط فاندینگ تسویه‌شده دارد.
- رد HIGH_VOLATILITY و تعویق حالت کشیده محافظه‌کارانه است و برخی breakoutها را از دست می‌دهد.
- آستانهٔ کشیدگی بعد از کالیبراسیون از ۲٫۵ به ۳ ATR رفت. علت: آستانهٔ ۲٫۵ هر روند سالمِ قوی را
  «کشیده» می‌کرد. این یک انتخاب طراحی مستند است، نه برازش برای عبور تست.
- قراردادهای کالایی/توکنی (PAXG، XAUT، SILVER) در صورت دسته‌بندی کریپتو در universe هستند.

## Recommended Next Step

مالک تصمیم بگیرد که آیا migration اجرا شود و SHA `1c54268` از مسیر artifact و تأیید VPS منتشر شود.
پس از آن، ابتدا برای یک کاربر دمو فعال شود و دست‌کم دو هفته گزارش کشف در برابر موتور (نرخ موافقت و
نتیجهٔ معاملات دمو) بررسی شود، پیش از هر بحثی دربارهٔ گسترش. واقعی عمداً خارج از این کار ماند.
