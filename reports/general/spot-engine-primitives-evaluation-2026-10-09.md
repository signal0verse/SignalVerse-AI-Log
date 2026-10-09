# Spot Engine primitives and separate Spot Futures evaluation

## Metadata

- Date: 2026-10-09
- Mode: offline research only; no live account test.
- Frozen application source: `61280af0f123fe8d6bbfb4afe7e0cb6a7d238c91`.
- This is the previously observed runtime reference, not a fresh verification of current Production.
- Primary checkout and concurrent/untracked work were preserved. No pull/reset or source promotion.
- Application commit: NONE. Application push, CI, deployment: NO.
- Reports-only publication follows the repository's standing AI-Log requirement; its commit is reported after remote verification.

## Objective and result

سند جدید مالک با مسیر واقعی موتور تطبیق داده شد؛ تست اسپات و فیوچرز جدا اجرا شد. **هیچ‌یک از گزینه‌های تازه بهبود پایدار را در هر دو دوره و هر دو سطح هزینه نشان نداد.** این نتیجه رد همهٔ ایده‌ها نیست؛ مجوز افزودن آن‌ها به موتور زنده هم نیست.

ورودی: Spot Engine.docx و تصویر همراه؛ SHA-256 فایل Word:

`e04234620037bf910ca73f0c8fd6c82bd11c2b96b388b16be904de8147f8b807`

سند مرجع پژوهش است، نه مشخصات کامل معامله یا مجوز تغییر Production. استخراج کامل متن و جدول با راهنمای اسناد انجام شد؛ نوشتن گزارش طبق راهنمای گزارش و قالب موجود مخزن بود.

## تمام موارد سند

«نیافتیم» محدود به snapshot و مسیرهای موتور استاندارد بررسی‌شده است؛ ادعای نبودن در تمام محصولات نیست. «تست قبلی» نتیجهٔ جدید یا holdout محسوب نمی‌شود.

| مورد | شاهد موجود در موتور | آزمون و وضعیت |
|---|---|---|
| RSI + BB Range | RSI و BB موجود؛ Range مستقل با خروج به میانهٔ باند در مسیر بررسی‌شده نیست | فیلتر ورود در تحقیق قبلی تست شد؛ استراتژی کامل Range تست نشده |
| MACD + BB Swing | رأی هر دو در Futures مشترک و pipeline اندیکاتورها هست | نبود نام مستقل مساوی نبود ابزار نیست؛ ترکیب کامل Swing مستقل تست نشده |
| MACD + Donchian | MACD موجود؛ Donchian مستقل در مسیر بررسی‌شده پیدا نشد | فیلتر breakout قبلی؛ بهبود پایدار اثبات نشد |
| Parabolic SAR + CCI | در مسیر موتور بررسی‌شده پیدا نشد | UNTESTED؛ بدون نتیجهٔ اقتصادی |
| VWAP + A/D | ترکیب مستقل پیدا نشد | فیلتر rolling VWAP/ADL قبلی؛ نه session VWAP یا اجرای سفارش |
| TSF + BOP | ترکیب مستقل پیدا نشد | فیلتر قبلی؛ نه یک استراتژی کامل |
| Stochastic + Williams %R | StochRSI موجود؛ با Stochastic قیمت یکسان نیست | فیلتر Williams/Stochastic قبلی؛ شواهد مستقل دوگانه نیستند |
| Klinger + Mass Index | ترکیب مستقل پیدا نشد | UNTESTED؛ نیازمند قواعد و پارامترهای کامل |
| ADX + Ichimoku | در مسیر تصمیم بررسی‌شده پیدا نشد | فیلتر علّی قبلی با ابر جابه‌جاشده؛ بهبود پایدار اثبات نشد |
| Grid / StepGrid | DCA با خرید پله‌ای موجود؛ معادل Grid بازچرخشی نیست | AUDIT ONLY؛ Grid کامل و Futures hedge grid تست اقتصادی نشد |
| DCA | `computeHorizonAwareSpotLadders → decideSpotScenario → tryAutoAdvanceScenario / tryAutoContinueSpotCycle → evaluateSpotAggregateExit` موجود | ادعای غیبت DCA درست نیست؛ دو تغییر وزن پله با همان موتور اکنون تست شد |
| Trailing Entry/Exit | شبیه‌ساز استاندارد Futures حدضرر ثابت دارد؛ Fast Trader مسیر Smart Exit جدا دارد | Trailing خروج Futures اکنون فقط در wrapper پژوهشی تست شد؛ Spot trailing و trailing entry تست نشد |
| Time-based | clock، freshness و زمان‌بندی موجود؛ به‌خودی‌خود alpha نیستند | فیلتر ورود روز کاری برای هر دو؛ time-stop فیوچرز تست شد |

[گزارش ده فیلتر قبلی](https://github.com/signal0verse/SignalVerse-AI-Log/blob/4cf22ae4511c3268dc0ed56bb6018fdbe40494a9/reports/general/custom-strategies-engine-evaluation-2026-10-09.md) شامل 176 بازپخش اصلی و 44 حساسیت اسپات است؛ این اعداد به 64 اجرای تازه اضافه نشده‌اند.

## سازوکار واقعی Gunbot و مرز مقایسه

[StepGrid رسمی](https://www.gunbot.com/support/docs/built-in-strategies/spot-strategies/stepgrid/) خرید/فروش پله‌ای با trailing و مدیریت موجودی/سقف سرمایه دارد؛ افزودن یک فیلتر اندیکاتور آن را بازسازی نمی‌کند. [DCA رسمی](https://www.gunbot.com/support/docs/built-in-strategies/spot-strategies/builder/dca/) میانگین‌کم‌کردن را با خطر افزایش exposure توضیح می‌دهد. DCA موجود SignalVerse را نباید با Martingale یا Grid یکسان گرفت.

[TrailMe رسمی](https://www.gunbot.com/support/docs/built-in-strategies/spot-strategies/builder/trailme/) به bid/ask و هم‌زمانی شرایط وابسته است. دادهٔ فعلی OHLC است؛ آزمون 2ATR ما نسخهٔ Gunbot یا اثبات اجرای native نیست. [StepGridHedge](https://www.gunbot.com/support/docs/built-in-strategies/futures-hedge-strategies/stepgridhedge/) نیز ساختار exposure لانگ/شورت مخصوص خود را دارد. تبدیل آن به Futures استاندارد نیازمند تعریف مستقل سرمایه، margin، liquidation و lifecycle است؛ در این کار ساخته نشد.

## آزمایش تازه

- 64 replay: 16 اجرای portfolio اسپات، 48 اجرای مستقل نماد در فیوچرز.
- BTC/ETH/SOL، سه‌ماههٔ سوم و چهارم 2025؛ سرمایه و پوزیشن‌ها در ابتدای هر فصل reset می‌شوند.
- دادهٔ native عمومی Binance از cache هش‌شده؛ این نوبت صفر درخواست بازار/صرافی داشت.
- داده قبلاً دیده شده است: **نه holdout ناشناخته و نه forward test**. هیچ بهینه‌سازی پارامتر بر اساس خروجی این آزمایش انجام نشد.
- Spot: سرمایه 3000 USDT در هر فصل، روزانه، warmup پژوهشی 400 روز، scenario برابر 10/20/35/35، بدون compound.
- Futures: سه sleeve هرکدام 10000 USDT در هر فصل، margin ثابت 250، leverage=2، تصمیم روزانه و اجرای OHLC چهارساعته؛ ONE TP.
- هزینهٔ Spot در هر سمت 0.10% fee + 0.02% impact؛ Futures هر سمت 0.05% fee + 0.02% slippage و funding تاریخی بومی.
- همهٔ حالت‌ها با هزینهٔ دوبرابر نیز از ابتدا اجرا شدند؛ بالا رفتن هزینه/لغزش ممکن است پذیرش و تعداد معاملات را تغییر دهد.
- سود باز با قیمت آخر mark-to-market شد؛ TP آینده یا projected Spot finalEquity سود تحقق‌یافته تلقی نشد.
- Macro/stablecoin context و AI در این آزمایش در دسترس نیستند و برای تمام حالت‌ها یکسان حذف/خاموش‌اند. اجرای حساب واقعی، scanner universe و MEXC/Gate آزمون نشده‌اند.

## نتایج مستقل

| بازار و حالت | بسته‌شده در هزینه عادی | جمع سود خالص با ارزش‌گذاری باز، USDT | همان معیار در هزینه دوبرابر |
|---|---:|---:|---:|
| Spot پایه | 5 | 1.0086 | -0.1511 |
| Spot پله برابر | 5 | 0.7336 | -0.7054 |
| Spot پله جلو‌سنگین | 5 | 0.3912 | -1.3297 |
| Spot بدون ورود آخر هفته | 8 | 21.9788 | 20.6011 |
| Futures پایه | 100 | 651.3433 | 595.5532 |
| Futures trailing 2ATR | 131 | 468.8784 | 398.6193 |
| Futures خروج پس از 6 کندل سیگنال | 152 | 327.0282 | 246.7152 |
| Futures بدون ورود آخر هفته | 86 | 548.3691 | 475.4247 |

اعداد جمع دو فصل مستقل‌اند، نه سود یک حساب پیوسته و نه مقایسهٔ بازده Spot با Futures. تعداد نمونه مستقل نیز برابر تعداد تمام replayها نیست؛ همه از تاریخچهٔ مشترک استفاده می‌کنند.

اسپات: تمام حالت‌ها در Q3 بدون معامله‌اند؛ برتری فیلتر زمان تنها در Q4 و با 8 چرخه مشاهده شد. افزایش سود بسته‌شده با وزن جلو‌سنگین، پس از حساب موجودی باز به بهبود کل تبدیل نشد. هنوز نمونه کافی نداریم.

فیوچرز: trailing در Q3 از 192.9386 به 245.6301 رسید، اما Q4 از 458.4047 به 223.2483 افت کرد و drawdown بدتر شد. Time-stop هم همین ناپایداری را نشان داد. فیلتر زمان در هر دو فصل ضعیف‌تر شد.

جزئیات مستقل: `reports/spot/spot-engine-primitives-evaluation-2026-10-09.md` و `reports/futures/spot-engine-primitives-evaluation-2026-10-09.md`.

## شواهد و تست

Node v22.23.3؛ فرمان‌ها از checkout ایزوله، بدون API bootstrap یا env:

```text
node --experimental-strip-types --test research/spot-engine-primitives/policies.test.mjs
27/27 PASS
node --experimental-strip-types --test scripts/historical-point-in-time-test.mjs scripts/historical-simulation-timing-test.mjs
31 + 16 logical cases PASS (runner reports 32: second file is one wrapper)
node --experimental-strip-types research/spot-engine-primitives/run.mjs spot
16 replays PASS
node --experimental-strip-types research/spot-engine-primitives/run.mjs futures
48 replays PASS
node research/spot-engine-primitives/summarize.mjs
PASS
node research/spot-engine-primitives/verify.mjs
PASS
```

مجموع 74 تست منطقی تازه اجرا شد. پوشش: parity خروج پایه LONG/SHORT، عدم استفادهٔ stop تازه در همان کندل، gap و fee، تقدم SL/TP/liquidation، عدم استفاده از کندل آینده، stop یک‌طرفه، timeout در open قابل‌مشاهده، UTC، جمع allocation، عدم خروج دوباره.

تطبیق 112 قلم baseline با نتایج قبلی، 20 مقایسهٔ هش سورس، 684 بررسی close-time تصمیم و 36 هش فایل cache پاس شد. مجموع 151089 ردیف cache شامل هم‌پوشانی و فایل‌های بررسی‌شده ولی مصرف‌نشده است؛ تعداد مشاهدات مستقل آزمایش نیست. شواهد تفصیلی در فایل JSON همراه است.

Web/Admin build: NOT_RUN؛ کد برنامه/رابط تغییر نکرده و این آزمایش build/release candidate نیست. اعتبار تست رفتاری به معنی سودآوری نیست.

## فایل‌های بررسی‌شده و تغییرکرده

بررسی: فایل Word و PNG، دستورهای پروژه، `api/copytrade.ts` (DCA، خروج تجمعی، Smart Exit، دو simulator)، `api/_shared/futures-decision-engine.ts`، `futures-indicators.ts`، `futures-risk.ts`، `scripts/lib/actual-futures-core.mjs`، runner و شواهد دو تحقیق قبلی، مستندات رسمی Gunbot.

تغییر جدید فقط در checkout پژوهشی:
- `research/spot-engine-primitives/protocol.json`
- `research/spot-engine-primitives/policies.mjs`
- `research/spot-engine-primitives/policies.test.mjs`
- `research/spot-engine-primitives/run.mjs`
- `research/spot-engine-primitives/summarize.mjs`
- `research/spot-engine-primitives/verify.mjs`
- خروجی‌های `spot-results.json`، `futures-results.json`، `summary.json`، `evidence.json`
- این گزارش، دو گزارش بازار و JSON شواهد
- یادداشت فقط در HANDOFF همان checkout ایزوله

هیچ import از این پژوهش به برنامه اضافه نشد. مسیرهای `api/server/src/lib/migrations/ops/deploy/.github` صفر diff برنامه دارند. فایل‌های موقت تحقیق به مخزن برنامه commit/push نشدند.

## محدودیت و تصمیم

OHLC روزانهٔ اسپات ترتیب دقیق خرید و فروش درون روز را اثبات نمی‌کند؛ فرض موجود buy-before-sell حفظ شد. تاریخچهٔ 400 روزه فقط حساسیت transport است، نه برابری کامل simulator فعلی با live. Futures trailing صرفاً ratchet شبیه‌سازی‌شده است؛ مسئلهٔ native lifecycle، restart، ownership و stale close Production را حل یا آزمایش نمی‌کند. خروج زودتر می‌تواند به ورودهای بعدی بیشتری منجر شود؛ نتایج کل توالی دوباره اجرا شده‌اند.

هیچ گزینه‌ای از screen ثبت‌شده عبور نکرد: بهبود مثبت در هر دو فصل/هر دو هزینه، DD نه‌بدتر و حداقل 30 معاملهٔ بسته‌شده. حتی عبور از این screen نیز اثبات سودآوری نبود.

قدم مفید بعدی: فقط آزمون ازپیش‌ثبت‌شدهٔ فیلتر زمانی اسپات روی دادهٔ مستقل و نمونهٔ بزرگ‌تر؛ نه فعال‌سازی آن. Grid، Spot trailing و استراتژی‌های کاملِ تست‌نشده نیازمند مشخصات و مدل اجرای جدا هستند.

```text
IMPROVEMENT_PROVEN=NO
APPLICATION_CODE_CHANGED=NO
PRODUCTION_CHANGED=NO
STRATEGY_CHANGED_IN_APPLICATION=NO
DATABASE_CHANGED=NO
WORKER_STARTED=NO
EXCHANGE_ACTIONS=0
ORDER_POSITION_ACTIONS=0
APP_COMMIT=NONE
APP_PUSH=NO
DEPLOYMENT=NO
```
