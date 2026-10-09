# Futures — Custom Strategies incremental-value pilot

## Metadata

- Date: 2026-10-09
- Mode: isolated historical research; no live account testing
- Source: SignalVerse detached snapshot `61280af0f123fe8d6bbfb4afe7e0cb6a7d238c91`
- This is the last previously observed runtime source, NOT a fresh verification of current Production.
- Primary checkout HEAD: `0dbca62357a4adf34240f40ceda3e387356ec4b0`; existing dirty/untracked work preserved.
- Application commit: NONE. Application push: NO. CI/deployment: NO.
- Reporting: these sanitized reports are prepared for the standing AI-Log/master publication requirement; publication commit is supplied separately only after remote verification.

## Executive result

بهبود پایدار تأیید نشد. Keltner/OBV در جمع دو فصل فقط 13.1568 USDT بهتر از baseline بود؛ در فصل چهارم 44.2753 USDT عقب افتاد. صرف مثبت‌بودن سود یک بازو، دلیل برتری بر موتور موجود نیست.

سرمایه در هر فصل: سه sleeve مستقل 10000 USDT؛ هر ورود مارجین ثابت 250 و اهرم 2. baseline همان موتور shared و اجرای تاریخی موجود است؛ تصمیم روزانه، اجرای 4h، تایم‌فریم انتخابی 15m/1h/4h/1d. مدل ONE TP برابر 100/0/0 و SL دست‌نخورده. مقایسهٔ raw dollar با Spot به دلیل سرمایه/ریسک متفاوت معتبر نیست.

هزینه هر سمت: fee=0.05%، slippage=0.02%؛ funding از رخدادهای native واقعی. stress هر دو هزینه را دوبرابر می‌کند. افزایش هزینه می‌تواند گیت R:R را تغییر دهد و تعداد معاملات عوض شود؛ این stress شبیه‌سازی مجدد است نه کسر هزینه از یک لجر ثابت.

## تمام بازوها

اعداد جمع دو فصل مستقل‌اند؛ MTM شامل ارزش پوزیشن باز است، closed net جداست.

| Filter | Closed trades | Closed net USDT | Terminal MTM net USDT | Delta vs baseline | Q3 MTM | Q4 MTM | 2x costs MTM |
|---|---:|---:|---:|---:|---:|---:|---:|
| baseline | 100 | 612.6887 | 651.3433 | 0.0000 | 192.9386 | 458.4047 | 595.5532 |
| adx-ichimoku | 41 | 278.6550 | 373.8188 | -277.5245 | 44.6443 | 329.1744 | 370.9661 |
| chaikin-envelope | 0 | 0.0000 | 0.0000 | -651.3433 | 0.0000 | 0.0000 | 0.0000 |
| keltner-obv | 70 | 625.4955 | 664.5001 | 13.1568 | 250.3707 | 414.1295 | 606.7889 |
| macd-donchian | 11 | 35.0144 | 35.0144 | -616.3289 | -43.3245 | 78.3389 | 12.0915 |
| tsf-bop | 53 | 62.5624 | 62.5624 | -588.7809 | 204.6830 | -142.1207 | 68.0837 |
| williams-stochastic | 0 | 0.0000 | 0.0000 | -651.3433 | 0.0000 | 0.0000 | 0.0000 |
| rsi-ma | 90 | 562.2088 | 601.2135 | -50.1298 | 131.1152 | 470.0983 | 557.8343 |
| range-rsi-bb | 0 | 0.0000 | 0.0000 | -651.3433 | 0.0000 | 0.0000 | 0.0000 |
| rsi-only | 99 | 601.6280 | 640.2826 | -11.0607 | 181.8779 | 458.4047 | 585.1005 |
| vwap-ad | 82 | 390.2232 | 500.0773 | -151.2660 | 135.2243 | 364.8530 | 439.0263 |

## Keltner/OBV در برابر پایه؛ معیار شکست پایداری

| بازه | هزینه | baseline MTM | Keltner/OBV MTM | baseline DD% | Keltner/OBV DD% |
|---|---|---:|---:|---:|---:|
| Q3 | normal | 192.9386 | 250.3707 | 0.3699 | 0.2294 |
| Q4 | normal | 458.4047 | 414.1295 | 0.4082 | 0.4082 |
| Q3 | 2x | 197.5781 | 239.3742 | 0.3813 | 0.2465 |
| Q4 | 2x | 397.9751 | 367.4148 | 0.4086 | 0.4085 |

تعداد معاملات بسته baseline عادی 100 و Keltner/OBV برابر70 است. Q3: نرخ برد 35.82%→39.13%، PF=1.4481→1.8717. Q4: نرخ برد 51.52%→54.17%، PF=3.3364→3.3772، ولی سود کمتر است. بهترشدن نرخ برد به‌تنهایی کافی نیست.

در Q3 بخش عمدهٔ رشد از SOL و تایم‌فریم روزانه آمده است؛ شواهد مستقل برای همهٔ ارزها/تایم‌فریم‌ها وجود ندارد. تفکیک دقیق LONG/SHORT و تایم‌فریم در evidence منتشر شده است. بازوهای mean-reversion که صفر معامله دادند، ناسازگاری با پذیرش فعلی را نشان می‌دهند؛ این نه «سود بدون ریسک» است و نه اثبات شکست استراتژی مستقل‌شان.

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
node --test research/custom-strategies/filters.test.mjs
node --test scripts/historical-point-in-time-test.mjs scripts/historical-simulation-timing-test.mjs
node research/custom-strategies/capture.mjs --public-history
node research/custom-strategies/run.mjs futures
node research/custom-strategies/summarize.mjs
node research/custom-strategies/audit-results.mjs
```

Node used: v22.23.3. Hash/run details in [machine evidence](../general/custom-strategies-engine-evidence-2026-10-09.json). Inventory, changed files and untested strategies in [work report](../general/custom-strategies-engine-evaluation-2026-10-09.md).

IMPROVEMENT_PROVEN=NO
RECOMMEND_PRODUCTION_ACTIVATION=NO
APPLICATION_COMMIT=NONE
