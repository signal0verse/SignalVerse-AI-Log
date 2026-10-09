# Example Custom Strategies — ممیزی ابزار و آزمایش جداگانهٔ Spot/Futures

## Metadata

- Date: 2026-10-09
- Mode: isolated historical research; no live account testing
- Source: SignalVerse detached snapshot `61280af0f123fe8d6bbfb4afe7e0cb6a7d238c91`
- This is the last previously observed runtime source, NOT a fresh verification of current Production.
- Primary checkout HEAD: `0dbca62357a4adf34240f40ceda3e387356ec4b0`; existing dirty/untracked work preserved.
- Application commit: NONE. Application push: NO. CI/deployment: NO.
- Reporting: these sanitized reports are prepared for the standing AI-Log/master publication requirement; publication commit is supplied separately only after remote verification.

## Objective / Executive result

فهرست ۲۰ موردی فایل Word/تصویر مالک با مسیرهای واقعی تحلیل تطبیق داده شد. **بهبود پایدار سودآوری ثابت نشد؛ چیزی به Production اضافه نشد.** ده فرضیهٔ محدود به‌عنوان فیلتر پذیرش تست شد؛ بقیه فقط ممیزی شدند و صریحاً بدون نتیجهٔ اقتصادی‌اند.

فایل Word:
`Example Custom Strategies.docx`
SHA-256:
`0d8f183a3e32833e8bc570e4fa01d671e7f50036597268fc09e55fd96745d8a7`

این سند نام ترکیب‌ها را می‌دهد، نه پارامترها و قرارداد کامل معامله. [صفحهٔ رسمی نمونه‌ها](https://www.gunbot.com/support/docs/custom-strategies/example-strategies/overview/) آن‌ها را نمونهٔ سفارشی معرفی می‌کند. در [ADX/Ichimoku](https://www.gunbot.com/support/docs/custom-strategies/example-strategies/adx-ichimoku/) و [Chaikin](https://www.gunbot.com/support/docs/custom-strategies/example-strategies/chaikin/) نیز هشدار تولیدشدن نمونه با AI و ضرورت شبیه‌سازی آمده است؛ وجود کد نشانهٔ سودآوری نیست.

## ممیزی تمام ۲۰ مورد

«یافت نشد» محدود به سورس تحلیل/موتورِ snapshot بالا است؛ نام مشابه در UI یا تست سایر محصولات، استراتژی فعال محسوب نمی‌شود.

| مورد سند | شاهد در SignalVerse | وضعیت این پژوهش |
|---|---|---|
| ADX + Ichimoku | هیچ پیاده‌سازی در مسیر تصمیم بررسی‌شده پیدا نشد | فیلتر روند ADX14 + ابر علّی 9/26/52 تست شد؛ نه نمونهٔ کامل Gunbot |
| Chaikin + Envelopes | ADL/Chaikin/Envelope پیدا نشد | EMA3/10 روی سری ADL + SMA20 با envelope 2.5% تست شد |
| Contrarian | StochRSI موجود است؛ معادل Stochastic قیمت نیست؛ Williams پیدا نشد | فیلتر مشترک Williams/Stochastic تست شد؛ استراتژی Contrarian مستقل تست نشد |
| Choppiness + DPO | پیدا نشد | UNTESTED؛ نیاز به مشخصات نسخهٔ DPO و زمان تأیید، نه استفاده از دادهٔ آینده |
| Elder Ray + ZigZag | Swing موجود است، ولی Elder Ray/ZigZag این استراتژی نیست | UNTESTED؛ نقطهٔ pivot باید در زمان تأیید شناخته شود، نه با تاریخ pivot بازنویسی‌شده |
| Ergodic | پیدا نشد | UNTESTED؛ [صفحهٔ رسمی](https://www.gunbot.com/support/docs/custom-strategies/example-strategies/ergodic/) ترکیب Ergodic با Center of Gravity است، نه صرفاً smoothing سند |
| Fibonacci + Stochastic | استراتژی این ترکیب پیدا نشد | UNTESTED؛ anchor/تأیید pivot و ابطال ستاپ باید منجمد شود |
| Gann + Williams Fractal | پیدا نشد | UNTESTED؛ scale قیمت/زمان و تأخیر تأیید fractal مشخص نشده |
| Keltner + ATR + OBV | ATR موجود؛ Keltner/OBV در مسیر تصمیم پیدا نشد | فیلتر anti-chase با EMA20±2ATR20 و تغییر OBV پنج‌بار تست شد |
| Klinger + Mass | پیدا نشد | UNTESTED؛ محاسبه/پارامتر و قاعدهٔ reversal باید جدا اعتبارسنجی شود |
| MACD + Donchian | MACD موجود؛ Donchian پیدا نشد | شکست کانال ۲۰ کندل قبلی با جهت histogram تست شد |
| McClellan + Aroon | پیدا نشد | UNTESTED؛ McClellan استاندارد به breadth تاریخی universe نیاز دارد؛ OHLC یک ارز جای آن نیست |
| PSAR + CCI | پیدا نشد | UNTESTED؛ reversal/state initialization و قاعدهٔ ورود/خروج کامل این دور پیاده نشد |
| Range RSI + BB | RSI و BB در رأی موتور موجودند؛ استراتژی Range مستقل اثبات نشد | فیلتر mean-reversion RSI30/70 و band 2σ تست شد |
| RSI | محاسبه و رأی موجود | فیلتر کنترلی RSI14 در محدودهٔ 50..75 / 25..50 تست شد؛ افزودن «ابزار جدید» نیست |
| RSI + MA | EMA9/21/50/200 و RSI موجود | فیلتر RSI جهت‌دار + EMA50 تست شد |
| Swing MACD + BB | Swing/MACD/BB موجود؛ این استراتژی مستقل با همین نام نیست | UNTESTED به‌عنوان ترکیب کامل؛ تغییر exit در این پژوهش انجام نشد |
| TSF + BOP | پیدا نشد | پیش‌بینی OLS از ۱۴ close گذشته و BOP14 تست شد |
| VWAP + AD | UI قیمت اجرای VWAP دارد، نه ورودی تصمیم این ترکیب | rolling native quote/base VWAP20 + ADL پنج‌بار تست شد |
| Williams | Williams %R پیدا نشد | همان بازوی Williams/Stochastic؛ دو اسم جدول به‌عنوان دو آزمایش مستقل شمرده نشد |

Williams %R و Stochastic خام با یک پنجره رابطهٔ خطی دارند؛ شمارش آن‌ها به‌عنوان دو تأیید مستقل، اطلاعات تازه ایجاد نمی‌کند. RSI موجود نیز «اضافه‌شدن استراتژی RSI» نیست. Chaikin پژوهشی از فرمول سری زمانی متعارف استفاده می‌کند؛ کد نمونهٔ وب، داده‌های seed دیگری دارد و عیناً کپی نشده است.

## نتیجهٔ اجرایی

- Futures: baseline جمع MTM دو فصل +651.3433 USDT. تنها Keltner/OBV در جمع بهتر شد: +664.5001؛ اختلاف +13.1568. ولی Q3 بهتر و Q4 بدتر بود، حتی با هزینهٔ دوبرابر. بنابراین معیار پایداری رد شد.
- Spot: baseline دقیق شبیه‌ساز ۰ معاملهٔ بسته؛ نتیجهٔ MTM +2.3411 عمدتاً موجودی باز است. حساسیت جدا با warmup400 فقط ۵ معاملهٔ بستهٔ baseline داشت و برای نتیجه‌گیری کافی نیست.
- همهٔ ده overlay از معیار غربال عبور نکردند؛ این به معنی اثبات بی‌فایدگی همیشگی اندیکاتورها نیست. بهبود با این قواعد/نمونه ثابت نشد.
- گزارش‌های عددی مستقل: [Spot](../spot/custom-strategies-engine-evaluation-2026-10-09.md)، [Futures](../futures/custom-strategies-engine-evaluation-2026-10-09.md).
- فرمول‌ها، تمام foldها، جهت‌ها، تایم‌فریم‌ها، داده‌های عمومی و checksumها: [evidence JSON](custom-strategies-engine-evidence-2026-10-09.json).

## روش و حدود اعتبار

دادهٔ بومی عمومی Binance برای BTC، ETH و SOL، دو بازهٔ مستقل سه‌ماههٔ سوم و چهارم ۲۰۲۵. در ابتدای هر بازه سرمایه و پوزیشن‌ها بازنشانی شده‌اند؛ جمع دو سود **بازده یک پرتفوی پیوسته یا سود حساب واقعی نیست**. سه ارز بزرگ انتخاب گذشته‌نگر دارند و نمایندهٔ همهٔ آلت‌کوین‌ها نیستند.

ده فیلتر از پیش تعریف‌شده، به‌علاوهٔ baseline بدون فیلتر. این آزمایش ارزش افزودهٔ فیلتر **روی همان موتور** را می‌سنجد؛ بازسازی کامل استراتژی‌های Gunbot، تغییر خروج، یا ارزیابی همهٔ ۲۰ استراتژی مستقل نیست. همهٔ بازوها با هزینهٔ عادی و دوبرابر اجرا شدند. هیچ پارامتری بعد از نتیجه تنظیم نشد.

تصمیم فقط با کندل بستهٔ native، شرط strict closeTime < decisionTime؛ ابر Ichimoku با جابه‌جایی صحیح ۲۶ کندل، Donchian بدون کندل جاری. هیچ دادهٔ حساب، کلید، سفارش، AI/LLM یا DB وارد تست نشده است. زمینهٔ تاریخی macro/stablecoin در دسترس این آزمایش نبود و برای همهٔ بازوها یکسان غیرفعال/null بود؛ ادعای برابری کامل با معاملات زنده نداریم.

معیار غربال از پیش ثبت شد: MTM مثبت و بهتر از baseline در **هر دو فصل**، در هر دو هزینه؛ DD بدتر نشود، net معاملات بسته مثبت و حداقل ۳۰ معاملهٔ بسته. عبور احتمالی هم اثبات سودآوری آینده نیست.

## اعتبارسنجی و ایمنی

- تست جدید اندیکاتور/مرز زمان/رفتار فیلتر: 38/38.
- تست point-in-time موجود: 31/31.
- تست زمان‌بندی واقعی Simulator: 16/16 داخلی؛ Node آن فایل را یک تست پوششی می‌شمارد، دوباره‌شماری نشده.
- جمع منطقی: 85/85؛ این تعداد با تعداد معاملات یا اثبات سود یکی نیست.
- 7 فایل پژوهشی JavaScript: syntax PASS. git diff --check: PASS.
- 30 تطبیق hash سورس و 3435 بررسی timestamp ورودی در لاگ‌های تصمیم عادی سه دستهٔ اجرا: PASS؛ این شمار شامل تصمیم‌های stress که runner لاگ جزئی‌شان را نگه نمی‌دارد نیست.
- دادهٔ جدید: 76134 ردیف در 18 فایل، 84 درخواست GET عمومی؛ capture از 2026-10-09T13:02:35.743Z تا 2026-10-09T13:03:02.930Z.
- 176 بازپخش اصلی = 44 اسپات + 132 فیوچرز؛ 44 حساسیت اضافی فقط اسپات؛ جمع 220 اجرای تاریخی، نه 220 معامله.
- Build اپ اجرا نشد: هیچ سورس اپ تغییر نکرد؛ فقط runnerهای ایزوله اجرا شدند.
- API/server/src/lib/migrations/ops/deploy/.github: صفر diff این کار.
- Production/VPS/DB/Worker/flags/orders/positions/SL/TP: هیچ اقدام یا تغییری توسط این کار انجام نشد. عدم فعالیت خودکار سایر سرویس‌ها ادعا نمی‌شود.

## Files inspected

- api/_shared/futures-indicators.ts: محاسبات EMA/RSI/MACD/BB/StochRSI/ATR، FVG/OB/Swing.
- api/_shared/futures-decision-engine.ts: shadowMomentum و computeFuturesDecision؛ رأی و تایم‌فریم واقعی.
- api/copytrade.ts: runSimulation، runSpotSimulation، computeSpotMarketMapFromCandles، decideSpotScenario و computeHorizonAwareSpotLadders.
- scripts/lib/actual-futures-core.mjs و futures-pure-test-context.mjs: AST isolation؛ عدم bootstrap.
- research/engine-tools/{protocol,capture,core,run,summarize} و خروجی‌های قبلی برای reuse، بدون بازنویسی.
- TRADING_STRATEGY.md، AGENTS.md، CLAUDE.md، HANDOFF.md، docs/AI_HANDOFF.md و runbook تست ایمن.

## Files changed / implementation

فقط در checkout ایزوله:
`C:/Projects/SignalVerse-Main/tmp/engine-tools-research-20261009`

- research/custom-strategies/protocol.json
- research/custom-strategies/capture.mjs
- research/custom-strategies/filters.mjs
- research/custom-strategies/filters.test.mjs
- research/custom-strategies/run.mjs
- research/custom-strategies/summarize.mjs
- research/custom-strategies/spot-warmup-sensitivity.json
- research/custom-strategies/spot-warmup-sensitivity.mjs
- research/custom-strategies/audit-results.mjs
- خروجی‌های محلی داده/نتایج/checksum در همین پوشه؛ دادهٔ خام یا کد اپ به AI-Log فرستاده نمی‌شود.
- همین سه گزارش، evidence JSON و یادداشت HANDOFF ایزوله.

Runner پژوهشی قبلی با تطبیق دقیق متن قرارداد reuse شد؛ قبل از import، فقط مسیرهای فایل، فیلتر پژوهشی و ماتریس آزمایش عوض می‌شود. بدنهٔ actual engine/Simulator در سورس اپ تغییر نکرد. شبکه در replay ممنوع است.

## خطاهای حین کار

اولین capture در sandbox با DNS ENOTFOUND متوقف شد؛ بدون داده/نتیجهٔ جعلی. اجرای مجاز GET عمومی سپس 84 درخواست را کامل کرد. اولین bootstrap آزمون حساسیتِ جدید خطای syntax در تبدیل مسیر داشت؛ فقط wrapper پژوهشی اصلاح شد و اجرای نهایی کامل شد. هیچ تست اپ یا معیار پذیرش برای PASS ضعیف نشد.

## Remaining limitations / next step

۱. برای Spot ابتدا پوشش داده/پاریتی مدل تاریخی را کامل و تعداد معاملات را بزرگ‌تر کنید؛ ۵ معامله اثبات نیست.
۲. از میان موارد آزموده‌شدهٔ Futures، فرضیهٔ Keltner/OBV اولویت آزمون مستقل گسترده‌تر دارد؛ انتخاب پس از دیدن داده است، نه توصیهٔ فعال‌سازی یا قضاوت دربارهٔ موارد آزموده‌نشده.
۳. موارد UNTESTED بالا هنوز نتیجهٔ سود/زیان ندارند. هیچ‌کدام به صرف نام اندیکاتور به موتور اضافه نشوند.
۴. این پژوهش full universe/scanner، تمام سیاست‌های حساب، AI Supervisor، کارایی fill یا سود Production را اثبات نمی‌کند.

IMPROVEMENT_PROVEN=NO
PRODUCTION_STRATEGY_CHANGED=NO
DEPLOYMENT=NO
APPLICATION_COMMIT=NONE
