# Spot — Custom Strategies incremental-value pilot

## Metadata

- Date: 2026-10-09
- Mode: isolated historical research; no live account testing
- Source: SignalVerse detached snapshot `61280af0f123fe8d6bbfb4afe7e0cb6a7d238c91`
- This is the last previously observed runtime source, NOT a fresh verification of current Production.
- Primary checkout HEAD: `0dbca62357a4adf34240f40ceda3e387356ec4b0`; existing dirty/untracked work preserved.
- Application commit: NONE. Application push: NO. CI/deployment: NO.
- Reporting: these sanitized reports are prepared for the standing AI-Log/master publication requirement; publication commit is supplied separately only after remote verification.

## Executive result

نتیجه برای تغییر استراتژی **ناکافی** است. baseline اولیه هیچ چرخهٔ بسته‌ای نداشت؛ سود MTM آن 2.3411 USDT است، نه سود تحقق‌یافته. نسخهٔ حساسیت با سابقهٔ 400 روز، تنها پنج چرخهٔ بسته داشت؛ این هم برای اثبات بهبود کافی نیست.

فقط Spot long-only با دادهٔ native Spot اجرا شد؛ دادهٔ Futures جای Spot استفاده نشد. سه ارز BTC/ETH/SOL، سرمایهٔ هر ارز1000 و جمع3000 در هر فصل. همان سناریوها/پله‌های 10/20/35/35، compound خاموش؛ fee هر سمت0.1% و impact هزینه‌ای هر سمت0.02%. هیچ SL جدید یا short مصنوعی به Spot اضافه نشد.

## اجرای اصلی با قرارداد فعلی شبیه‌ساز

| Filter | Closed trades | Closed net USDT | Terminal MTM net USDT | Delta vs baseline | Q3 MTM | Q4 MTM | 2x costs MTM |
|---|---:|---:|---:|---:|---:|---:|---:|
| baseline | 0 | 0.0000 | 2.3411 | 0.0000 | 0.0000 | 2.3411 | 1.9359 |
| adx-ichimoku | 0 | 0.0000 | 0.0000 | -2.3411 | 0.0000 | 0.0000 | 0.0000 |
| chaikin-envelope | 1 | 1.2449 | 1.2449 | -1.0962 | 0.0000 | 1.2449 | 1.2193 |
| keltner-obv | 0 | 0.0000 | 0.0285 | -2.3126 | 0.0000 | 0.0285 | 0.0105 |
| macd-donchian | 0 | 0.0000 | 0.0000 | -2.3411 | 0.0000 | 0.0000 | 0.0000 |
| tsf-bop | 1 | 0.0454 | -7.4039 | -9.7450 | 0.0000 | -7.4039 | -7.5907 |
| williams-stochastic | 0 | 0.0000 | 1.2545 | -1.0866 | 0.0000 | 1.2545 | 1.1983 |
| rsi-ma | 0 | 0.0000 | 0.0000 | -2.3411 | 0.0000 | 0.0000 | 0.0000 |
| range-rsi-bb | 1 | 1.1364 | 1.1364 | -1.2047 | 0.0000 | 1.1364 | 1.1110 |
| rsi-only | 0 | 0.0000 | 0.0000 | -2.3411 | 0.0000 | 0.0000 | 0.0000 |
| vwap-ad | 1 | 1.2449 | 2.1478 | -0.1933 | 0.0000 | 2.1478 | 2.0795 |

برای Q3 همهٔ بازوها بدون fill/نتیجهٔ اقتصادی مؤثر ماندند. صفر PnL، PASS سودآوری نیست.

نکتهٔ حسابداری: finalEquity داخلی این مسیر عمداً TP آیندهٔ پوزیشن باز را projected می‌کند. در این پژوهش آن عدد به‌عنوان سود استفاده نشد؛ cash/qty از fillهای واقعی شبیه‌ساز بازسازی و فقط با آخرین close در دسترس ارزش‌گذاری شد. net چرخه‌های بسته با لجر تطبیق داده شد. اثر impact یک هزینهٔ اضافی است، نه شبیه‌سازی عمق orderbook.

## محدودیت warmup و حساسیت مستقل

در api/copytrade.ts:13975، warmup فعلی220روز است. در همان سورس:12344، حداقل سابقهٔ ADEQUATE_HISTORY برابر400کندل است. این اختلاف کیفیت داده را محدود می‌کند، ولی ادعا نمی‌کنیم علت قطعی همهٔ کم‌معامله‌بودن‌هاست.

آزمون حساسیت **پس از دیدن نتیجهٔ اولیه ثبت شد**، پس confirmatory/holdout محسوب نمی‌شود. فقط transport پژوهشی برای baseline و همهٔ بازوها400روز سابقه تحویل داد. کد Simulator/موتور/Production دست‌نخورده ماند. دادهٔ عمومی دو capture قبلی و جدید merge شد، ردیف‌های overlap دقیقاً برابر و پیوستگی روزانه کنترل شد؛ دادهٔ آینده همچنان ممنوع.

| Arm | Closed trades | Closed net | Terminal MTM | 2x costs MTM |
|---|---:|---:|---:|---:|
| baseline | 5 | 14.1250 | 1.0086 | -0.1511 |
| adx-ichimoku | 0 | 0.0000 | 0.0000 | 0.0000 |
| chaikin-envelope | 2 | 12.6757 | -14.8882 | -15.3598 |
| keltner-obv | 0 | 0.0000 | 0.0000 | 0.0000 |
| macd-donchian | 0 | 0.0000 | 0.0000 | 0.0000 |
| tsf-bop | 0 | 0.0000 | -7.4493 | -7.6120 |
| williams-stochastic | 0 | 0.0000 | 1.2545 | 1.1983 |
| rsi-ma | 0 | 0.0000 | 0.0000 | 0.0000 |
| range-rsi-bb | 0 | 0.0000 | 0.0000 | 0.0000 |
| rsi-only | 0 | 0.0000 | 0.0000 | 0.0000 |
| vwap-ad | 1 | 1.2449 | 2.1478 | 2.0795 |

Q3 همچنان بی‌معامله ماند. Q4 baseline پنج چرخهٔ بسته و سه سناریوی باز دارد: closed net=14.1250 ولی MTM=1.0086؛ با دوبرابر هزینه MTM=-0.1511. بنابراین نادیده‌گرفتن موجودی باز یا استفاده از TP فرضی می‌توانست نتیجه را گمراه‌کننده مثبت نشان دهد.

VWAP/AD در حساسیت MTM=2.1478 با تنها یک چرخهٔ بسته دارد؛ این شاهد ضعیف/اکتشافی است، نه برتری قابل اتکا. Chaikin با همان سابقهٔ کامل‌تر MTM=-14.8882 شد؛ پس نتیجه به زمینهٔ ورودی حساس است. هیچ پارامتر فیلتر برای بهترکردن نتیجه تغییر نکرد.

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

## Commands

```text
node research/custom-strategies/run.mjs spot
node research/custom-strategies/spot-warmup-sensitivity.mjs spot
node research/custom-strategies/audit-results.mjs
```

Node used: v22.23.3. [All evidence](../general/custom-strategies-engine-evidence-2026-10-09.json) and [full work report](../general/custom-strategies-engine-evaluation-2026-10-09.md).

IMPROVEMENT_PROVEN=NO
SPOT_CONCLUSION=INSUFFICIENT_ECONOMIC_SAMPLE
PRODUCTION_STRATEGY_CHANGED=NO
APPLICATION_COMMIT=NONE
