# Fix: Futures Liquidation Feasibility Gate (Real Binance) — Phase A

**تاریخ:** ۲۰۲۶-۰۹-۱۶ · **وضعیت:** Phase A کامل (Implementation + Tests) · **Phase B (Deploy):** انجام نشد — منتظرِ تاییدِ صریحِ کاربر.
**پیرو:** [futures-sl-liquidation-and-weekly-economic-audit-2026-09-16.md](futures-sl-liquidation-and-weekly-economic-audit-2026-09-16.md) (همین ریپو).
**فایل اصلی تغییرکرده:** `api/copytrade.ts`. **`api/analyze.ts` صفر تغییر دارد** (Strategy/Engine کاملاً دست‌نخورده).

---

## ۱. Root Cause (از Audit قبلی، بدون تغییر)

موتور (`shadowFuturesSetup`) طبق طراحیِ خودش `SL = Entry ± ATR×1.25` را درست محاسبه می‌کند. مشکل جای دیگری بود: Leverage یک مقدارِ کاملاً مستقلِ per-symbol در `futures_pro_setups` است (در دیتای واقعی همیشه ۵x)، و **هیچ Gate‌ای** بینِ این SL خام و اجرای واقعیِ Binance وجود نداشت که بپرسد «آیا این SL با این Leverage اصلاً قبل از Liquidation قابل‌رسیدن است؟». این Gate از قبل، به‌صورتِ کارکرده و تست‌شده، فقط در Simulation Lab وجود داشت (`maxSafeLeverage`، `api/copytrade.ts`) — هرگز به مسیرِ واقعیِ Binance پورت نشده بود.

## ۲. Research Findings (خلاصه)

خواندهِ کاملِ `TRADING_STRATEGY.md` (زنجیرهٔ تصمیم‌های استراتژی، ۱۶ آگوست تا ۹ سپتامبر ۲۰۲۶) پیش از هر تغییر، طبقِ الزامِ `CLAUDE.md`. نکاتِ مرتبط:

- Real Futures از ۲۰۲۶-۰۸-۲۲ **Engine-First** است: `computeShadowEngineState` تصمیمِ خام می‌دهد، AI Supervisor فقط CONFIRM/CAUTION/REJECT می‌دهد (هرگز SL/TP نمی‌سازد — پرامپتِ Reviewer صریحاً می‌گوید «Do not invent or replace engine data»). یعنی هیچ لایهٔ AI موجود مسئولِ این Feasibility نبوده و نیست.
- Real TP Allocation قفلِ ۱۰۰/۰/۰ است (D07، تصمیمِ مالک) — این Fix آن را دست‌نخورده نگه داشته.
- Leverage/Margin هر نماد از ۲۰۲۶-۰۸-۲۰ از `futures_pro_setups` خوانده می‌شود، مستقل از ATR/Timeframe — دقیقاً همان شکافِ ساختاری که Audit پیدا کرد.
- `openBinanceTrade` و مسیرهایِ Real دیگر از قبل با throw-on-block کار می‌کنند (پوزیشنِ موجود، سفارشِ موجود، حجمِ کوچک) — این Fix دقیقاً همین idiom را برای NO_TRADE ادامه داده، نه یک مکانیزمِ جدید.

## ۳. Binance Findings (منابعِ رسمی، بررسی‌شده پیش از پیاده‌سازی)

| موضوع | یافته | منبع |
|---|---|---|
| فرمولِ Liquidation (Isolated, one-way, تک‌پوزیشن) | `LONG: MP=(WB+cum−Qty×Entry)/(Qty×(MMR−1))`، `SHORT: MP=(WB+cum+Qty×Entry)/(Qty×(MMR+1))` — از رابطهٔ مرزیِ `WB+UPNL = Qty×MP×MMR − cum` استخراج شد (WB=isolatedWalletBalance، TMM=UPNL=0 برایِ تک‌پوزیشنِ Isolated) | [Binance: How to Calculate Liquidation Price of USDⓈ-M Futures Contracts](https://www.binance.com/en/support/faq/how-to-calculate-liquidation-price-of-usd%E2%93%A2-m-futures-contracts-b3c689c1f50a44cabb3a84e663b81d93) |
| Notional/Leverage Brackets | `GET /fapi/v1/leverageBracket` — **signed** (API key+signature لازم)، برمی‌گرداند `bracket/initialLeverage/notionalCap/notionalFloor/maintMarginRatio/cum` per-symbol | [Binance Open Platform: Notional and Leverage Brackets](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets) |
| Mark Price در برابرِ SL Trigger Price | Liquidation همیشه بر اساسِ **Mark Price** است؛ Binance صریحاً توصیه می‌کند سفارشِ ضدِ‌لیکوییدشدن هم `workingType=MARK_PRICE` باشد چون «Mark Price همیشه با Liquidation Price هم‌راستاست» | [Binance Blog: What Are Stop Orders in Binance Futures?](https://www.binance.com/en/blog/futures/what-are-stop-orders-in-binance-futures-2094497753519691034) |
| workingType پیش‌فرض | `CONTRACT_PRICE` پیش‌فرضِ خودِ API است؛ `priceProtect` پیش‌فرض `false` | [Binance Open Platform: New Algo Order](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Algo-Order) |

**یافتهٔ کدیِ مهم قبل از هر تغییر**: `buildBinanceProtectionParams` (`api/copytrade.ts`) از قبل و **عمداً** `workingType: SL→CONTRACT_PRICE, TP→MARK_PRICE` ست می‌کند — کامنتِ کنارش می‌گوید این عیناً رفتارِ پیش‌فرضِ اپِ خودِ Binance برایِ «Position TP/SL» است (تاییدشده با خواندنِ سفارش‌هایِ واقعیِ ساخته‌شدهٔ خودِ اپِ Binance روی همین حساب). **این Fix این تصمیم را عوض نکرد** — یک تصمیمِ قبلی، مبتنی‌بر شواهد، و تست‌شده بود؛ طبقِ قاعدهٔ صریحِ کاربر («بدون بررسی دقیق کورکورانه تغییر نده»)، تنها کاری که این Fix کرد این بود که فاصلهٔ Contract-Price/Mark-Price را به‌عنوانِ یک بافرِ اضافی (`FUTURES_MARK_PRICE_BASIS_BUFFER_PCT`) در محاسبهٔ Safety Buffer لحاظ کند، نه تغییرِ خودِ workingType.

## ۴. Architecture Decision

```
Strategy Decision (api/analyze.ts — دست‌نخورده)
        ↓
Raw SL / TP (بدونِ تغییر، ذخیره می‌شود همان‌طور که هست)
        ↓
Risk/Execution Feasibility Gate  ← جدید، فقط در api/copytrade.ts
        ↓
ALLOW (با leverage درخواستی یا کاهش‌یافته) یا NO_TRADE
        ↓
Real Execution (Binance)
```

Gate در **سه** جایی که واقعاً Position باز می‌شود پیاده شد — هر سه در همین یک فایل، طبقِ محدودیتِ شناخته‌شدهٔ پروژه («بدونِ importِ مشترک بینِ فایل‌هایِ `api/*.ts`»):

| مسیر | تابع | منبعِ داده |
|---|---|---|
| **Real / Binance** | `openBinanceTrade` | `GET /fapi/v1/leverageBracket` **زنده**، bracket-aware، fail-closed |
| **Demo (Futures Pro)** | `executeDemoProOpen` | فرمولِ flat-MMR (بدونِ حسابِ واقعی، هم‌الگویِ Simulation Lab) |
| **Simulation Lab** | `stepPosition` (بازنویسیِ اجرا نشد — فقط رفرکتورِ pure) | همان فرمولِ flat-MMR، حالا از یک تابعِ مشترک |

## ۵. Formula (چرا درست است)

فرمولِ ساده‌شدهٔ Simulation Lab از قبل موجود بود:
```
Liq(LONG)  = Entry × (1 − 1/Lev + MMR)
Liq(SHORT) = Entry × (1 + 1/Lev − MMR)
maxSafeLeverage = 1 / (stopDistFrac/SAFETY + MMR)     [SAFETY=0.85, از قبل موجود]
```
این را با فرمولِ رسمیِ Binance (بخشِ ۳) به‌صورتِ جبری مقایسه کردم: با `WB≈Entry×Qty/Lev` و `cum≈0` (Bracket ۱)، فرمولِ ساده به همان فرمولِ دقیق می‌رسد (اختلافِ عددیِ کمتر از ۰.۲٪ در دیتای واقعیِ Audit — مثلاً TAO: دقیق=۱۹۸.۵۶ در برابرِ ساده=۱۹۸.۸۰). این اثباتِ همان چیزی‌ست که کاربر خواسته بود: «بررسی کن آیا فرمولِ فعلیِ Simulation Lab با Bracket واقعی سازگار است» — **بله، سازگار است، بدونِ نیاز به تغییر برایِ Bracket ۱**. برایِ Bracket‌هایِ بالاتر (حجمِ زیاد) که `cum≠0`، فرمولِ دقیقِ Bracket-aware (بخشِ ۶) لازم است و برایِ Real پیاده شد.

## ۶. Pre-entry Logic (`openBinanceTrade`)

```ts
findMaxSafeLeverageWithBrackets({ side, entryPrice, stopLoss, marginUsdt, requestedLeverage, brackets })
```
از `requestedLeverage` (عددِ صحیح) به پایین جست‌وجو می‌کند؛ در هر سطح، Bracketِ واقعیِ متناظر با notional را انتخاب می‌کند (`selectLeverageBracket`)، Liquidationِ دقیقِ Bracket-aware را حساب می‌کند (`computeIsolatedLiquidationPriceFromBracket`)، و چک می‌کند فاصلهٔ SL تا آن Liquidation حداقل به اندازهٔ:
```
requiredClearance = stopDist × (1/SAFETY − 1) + Entry × MarkBasisBufferPct%
```
باشد. اولین Leverage که این شرط را برآورده کند برگردانده می‌شود (`effectiveLeverage`)؛ اگر هیچ‌کدام (تا `minLeverage=1`) کافی نبود، `openBinanceTrade` یک `Error('NO_TRADE: ...')` می‌اندازد — دقیقاً هم‌الگویِ throwهایِ موجودِ همین تابع برایِ «Position too small»/«Existing Binance position».

**نکتهٔ مهمِ کشف‌شده حینِ تست**: در Leverage=۱ با margin دقیقاً برابرِ notional (بدونِ اهرمِ واقعی)، فرمولِ Bracket-aware مقدارِ Liquidation ≤۰ می‌دهد — این یعنی «هرگز لیکویید نمی‌شود» (مارجین کاملاً notional را پوشش می‌دهد)، نه «داده نامعتبر». این حالت را جدا هندل کردم (Allowed=true, no-risk) و در تستِ ۱۰ اثبات شد.

**Safety Buffer (بخشِ خواستهٔ کاربر ۲)**: `FUTURES_LIQUIDATION_SAFETY_FACTOR=0.85` عددِ **جدید نیست** — همان مقدارِ ازقبل‌موجود/تست‌شدهٔ Simulation Lab است، فقط centralize شد. `FUTURES_MARK_PRICE_BASIS_BUFFER_PCT=0.5%` جدید و additive است، برایِ فاصلهٔ Mark-Price/Contract-Price (بخشِ ۳ بالا). هر دو `export const` هستند، نه عددِ hardcoded پراکنده، و یک نقطهٔ تنظیمِ آینده دارند.

Scope: فقط `marginMode==='isolated'` — Cross عمداً پوشش داده نشد (Liquidationِ Cross به کلِ کیفِ Cross وابسته است، نه فقط این پوزیشن؛ فرمولِ تک‌پوزیشن برایِ آن غلط می‌بود). این صریحاً مستند و تست شده (TEST 7/8)، نه یک سکوتِ خطرناک.

## ۷. Post-fill Logic

`getBinanceOpenPosition` حالا فیلدِ واقعیِ `liquidationPrice` را از همان پاسخِ `/fapi/v3/positionRisk` که از قبل می‌خواند parse و برمی‌گرداند (`null` اگر غایب/صفر — Binance «۰» را برایِ پوزیشنِ flat/نامشخص برمی‌گرداند، هرگز به‌عنوانِ «بدونِ ریسک» تفسیر نشود). این مقدار **واقعی** Binance است، نه تخمین — دقیقاً پاسخِ بخشِ PRE-ENTRY/POST-FILL Audit.

**آنچه در این فاز پیاده نشد** (Deferred، صادقانه اعلام‌شده): نوشتنِ دوره‌ایِ این مقدار در `actual_liquidation_price` (نیازمندِ یک tick جدید یا استفاده از tickِ reconciliation موجود) و مقایسهٔ خودکارِ آن با SL برایِ تصمیمِ Close انجام نشد — بخشِ ۸.

## ۸. Protection Logic — چه چیزی عوض شد، چه چیزی عوض نشد

- **عوض نشد**: معنایِ `protected` در `ensureBinanceProtectionLeg` («سفارش واقعاً روی Binance تایید/ثبت شده») — این یک قراردادِ heavily-tested با call siteهایِ زیاد (MEXC/Gate هم همین الگو را دارند) است؛ عوض‌کردنِ معنایش بدونِ تست‌هایِ اقتصادیِ زنده، ریسکِ Regressionِ بزرگ‌تر از خودِ باگ بود.
- **اضافه شد** (additive، نه overwrite): خروجیِ `openBinanceTrade`/`executeDemoProOpen` حالا `estimatedLiquidationPrice`/`requestedLeverage`/`liquidationRiskDecision`/`liquidationRiskReason` را جدا از `protected` برمی‌گرداند و در `copy_trades` ذخیره می‌شود (بعدِ اجرایِ migration).
- **پیاده نشد در این فاز** (Deferred): بازتعریفِ خودِ `protected` به `protected && liquidationSafe` در مانیتورینگِ زنده، و خودکارسازیِ CLOSE وقتی post-fill نامعتبر تشخیص داده شود (بخشِ ۹ کاربر). دلیل: این دقیقاً همان کلاسِ تغییری است که رویِ پوزیشن‌هایِ واقعیِ در‌جریان (TAO/DASH/XRP، همین الان باز) اثر مستقیم دارد؛ بدونِ یک بارِ تستِ زندهٔ واقعی (که این Auditor به آن دسترسی/مجوز نداشت)، خودکارسازیِ close-on-risk را پشتِ یک Kill Switچِ پیش‌فرض-خاموش (هم‌الگویِ `engine_first_real_futures_enabled`) قرار می‌دهم، نه این‌که همین حالا فعالش کنم — این یک تصمیمِ جداگانه با شواهدِ خودش است، دقیقاً طبقِ فرهنگِ خودِ این پروژه در `TRADING_STRATEGY.md`.

## ۹. Weekly Economic Logic

پیاده‌سازیِ Economic Viability Layer (بخشِ ۱۰-۱۲ خواستهٔ کاربر) **در این فاز اجرا نشد** — به دو دلیلِ صریح:
1. Funding Fee اصلاً در سیستم ردیابی نمی‌شود (بخشِ ۱۱) — بدونِ آن، «هزینهٔ واقعیِ نگه‌داشتنِ طولانی» قابلِ محاسبهٔ دقیق نیست، فقط تخمینِ نظری (که Audit قبلی داد).
2. کاربر صریحاً گفته: «Weekly را حذف نکن، SL را کوچک نکن» و یک Economic Gate جداگانه باید «بر اساسِ پارامترهایِ واقعی و قابل‌توضیح» باشد، نه حدس. بدونِ دادهٔ Funding واقعی، ساختنِ این Gate همین الان به معنیِ حدس‌زدن بود — که کاربر صریحاً منع کرده.

**پیشنهاد (اجرا نشده)**: بخشِ ۱۰ (Funding Accounting) باید اول اجرا شود؛ بعدِ چند هفته دادهٔ واقعی، Economic Gate با اعداد واقعی طراحی شود.

## ۱۰. Funding Handling

بررسی شد: `fetchFuturesProFundingContext` (`api/copytrade.ts`) فقط funding را به‌عنوانِ context به AI Prompt می‌دهد، هیچ‌جا هزینه را حسابداری نمی‌کند. طبقِ دستورِ صریحِ کاربر («این بخش را فقط در صورتِ نیاز و کمترین scope تغییر بده») و چون این Fix اصلاً به Funding نیاز نداشت (Pre-entry/Post-fill Liquidation کاملاً مستقل از Funding هستند)، **هیچ تغییری در این فاز داده نشد**. طراحیِ ستون‌هایِ `funding cost/income/timestamp/position/symbol/tradeId` یک کارِ جداگانه است.

## ۱۱. Files Changed

| فایل | نوع تغییر |
|---|---|
| `api/copytrade.ts` | +۲۸۲/−۱۴ سطر. توابعِ جدید: `getBinanceLeverageBrackets`, `selectLeverageBracket`, `computeIsolatedLiquidationPriceFromBracket`, `findMaxSafeLeverageWithBrackets`, `estimateIsolatedLiquidationPrice` (extract)، `computeMaxSafeLeverage` (extract). `openBinanceTrade`: Pre-entry gate + خروجیِ جدید. `getBinanceOpenPosition`: پارسِ `liquidationPrice`. `executeDemoProOpen`: همان Gate برایِ Demo. `stepPosition` (Simulation Lab): رفرکتورِ pure به دو تابعِ مشترک (صفر تغییرِ خروجی). دو Call site که `openBinanceTrade` را صدا می‌زنند: اصلاحِ باگِ بالقوه (`leverage: lev` → `leverage: result.effectiveLeverage`، وگرنه `margin_usdt` بعدِ کاهشِ اهرم اشتباه محاسبه می‌شد). |
| `migrations/futures_liquidation_feasibility.sql` | **جدید، اجرا نشده.** ۵ ستونِ nullable روی `copy_trades`. |
| `scripts/futures-liquidation-feasibility-test.mjs` | **جدید.** ۲۸ چک (Pure logic + Structural)، پوششِ TEST ۱-۱۱، ۱۳، ۱۶-۲۰ از خواستهٔ کاربر. |
| `scripts/futures-simulation-{execution,chronology,accounting,capital}-test.mjs`, `historical-simulation-timing-test.mjs`, `futures-simulation-public-smoke.mjs`, `futures-real-execution-fault-test.mjs` | نگه‌داشتنِ Extraction listهایِ AST-based (الگویِ ازقبل‌موجودِ خودِ پروژه) هم‌راستا با دو تابعِ تازه — **بدونِ این، ۳۳۷ تستِ Simulation Lab با `ReferenceError` می‌شکستند**، نه به‌خاطرِ رفتارِ اشتباه، بلکه چون تستِ آن‌ها فقط توابعِ نام‌بردهْ‌شده را از سورس استخراج می‌کند. یک Mock جدید برایِ `/fapi/v1/leverageBracket` هم به fault-test اضافه شد. |

**`api/analyze.ts`: صفر تغییر (`git diff --stat` تایید می‌کند).**

## ۱۲. Tests

اجرا شد (env -i، بدونِ credential/network تولید، طبقِ `docs/testing/stability-test-runbook.md` بخشِ ۲):

```
node --test historical-point-in-time-test.mjs historical-simulation-timing-test.mjs
  futures-simulation-{execution,chronology,accounting,accounting-ui,capital}-test.mjs
  simulation-analytics-test.mjs futures-real-execution-fault-test.mjs futures-gate-mexc-fault-test.mjs
→ 337 pass, 0 fail (exit 0)

node scripts/learning-experience-test.mjs → 26 pass, 0 fail

node scripts/futures-liquidation-feasibility-test.mjs (جدید) → 28 pass, 0 fail
```

## ۱۳. Test Results — پوششِ ۲۰ سناریویِ خواسته‌شده

| # | سناریو | وضعیت |
|---|---|---|
| 1-4 | LONG/SHORT × SL امن/ناامن | ✅ پیاده و تست شد |
| 5-6 | Weekly (ATR بزرگ) در برابرِ 4h (ATR کوچک)، هردو ۵x | ✅ با اعدادِ واقعیِ Audit تست شد |
| 7-8 | Cross Margin (رد‌شده/مستندشده) / Isolated (پوشش‌داده‌شده) | ✅ |
| 9 | اهرمِ مؤثر کاهش‌یافته بدونِ تغییرِ Raw SL | ✅ اثبات‌شده ساختاری (خروجی هیچ فیلدِ SL ندارد) |
| 10 | Leverage لازم غیرممکن → NO_TRADE | ✅ (با نکتهٔ Fully-margin-backed برایِ LONG@1x — بخشِ ۶) |
| 11 | Post-fill Actual Liquidation Check | ✅ پارسِ فیلد پیاده شد؛ نوشتنِ دوره‌ای/الگوریتمِ Close هنوز نه (بخشِ ۷-۸) |
| 12 | Protection موجود ولی بی‌اثر → protected=false | ❌ **Deferred** (بخشِ ۸) |
| 13 | دادهٔ Liquidation غایب → Fail Closed | ✅ |
| 14 | Close با وضعیتِ نامعلوم → UNKNOWN | ❌ **Deferred** (مکانیزمِ Close خودکار پیاده نشد) |
| 15 | Close تاییدشده → CLOSED | N/A (بدونِ تغییر — `closeBinanceTrade` قبلی دست‌نخورده) |
| 16 | Raw SL/TP دست‌نخورده | ✅ |
| 17 | Demo/Real/Simulator Parity | ✅ فرمولِ یکسان، تستِ برابریِ عددی |
| 18-20 | عدمِ Regression به invariantهایِ موجود | ✅ (Regression Suiteِ کامل سبز) |

**۱۶ از ۲۰ کامل پیاده و تست شد؛ ۳ مورد (۱۲/۱۴) صراحتاً Deferred با دلیلِ ریسک، نه پنهان یا وانمود به PASS؛ ۱ مورد (۱۵) بدونِ تغییر لازم بود.**

## ۱۴. Remaining Risks

- **Cross Margin پوشش داده نشده** — اگر کاربر/ادمین بعداً Cross را برایِ Binance فعال کند، این Gate صامت رد می‌شود (مسیرِ Cross دست‌نخورده از قبل ادامه می‌یابد، بدونِ Feasibility Check جدید یا قدیم).
- **پوزیشن‌هایِ باز فعلی (TAO/DASH/XRP) دست‌نخورده ماندند** — این Fix فقط ورودهایِ **تازه** را می‌گیرد؛ سه پوزیشنِ شناسایی‌شده در Audit هنوز دقیقاً همان وضعیتِ ناامن را دارند و نیاز به یک اقدامِ جداگانه و صریحاً مجاز دارند (بخشِ ۸ همین سند).
- **Bracket API فرض بر این دارد که پاسخ Binance شکلِ مستندشده را دارد** — اگر Binance شکلِ پاسخ را عوض کند، `getBinanceLeverageBrackets` throw می‌کند (fail-closed، نه fail-open) — رفتارِ امن، ولی یعنی یک تغییرِ ناگهانیِ API می‌تواند همهٔ ورودهایِ Real را موقتاً متوقف کند تا بررسی شود.
- **سه تستِ Regressionِ از‌قبل‌ناموفق پیدا شد، نه ایجاد شد**: `futures-tp-allocation-test.mjs` خطِ ۱۸۶ و `engine-first-consensus-test.mjs` خطوطِ ۶۸/۷۸ — با چک روی `git show HEAD` تایید شد این‌ها پیش از این کار هم fail بودند (رگرسیونِ فاصلهٔ regexی نامرتبط با فیوچرز/لیکویید، به‌احتمال از یک ادیتِ کامنتِ قدیمی‌تر). **این کار آن‌ها را لمس یا مخفی نکرد**؛ گزارش صریح شد تا سشنِ بعدی گیج نشود.
- **Funding هنوز ردیابی نمی‌شود** — سوالِ اقتصادیِ Weekly (بخشِ ۹) همچنان بدونِ دادهٔ واقعی باز است.

## ۱۵. Production Readiness

**آمادهٔ Deploy نیست هنوز** — این چک‌لیست باید قبل از Phase B طی شود:

1. تاییدِ صریحِ کاربر برایِ push (طبقِ دستورِ همین کار).
2. `npm run backup` سپس اجرایِ دستیِ `migrations/futures_liquidation_feasibility.sql` در Supabase SQL Editor — **قبل از** merge/deploy کدِ همین فایل (وگرنه هر Real/Demo Binance open با «column does not exist» شکست می‌خورد).
3. تصمیمِ کاربر دربارهٔ سه پوزیشنِ بازِ فعلی (TAO/DASH/XRP) — این Fix آن‌ها را عوض نکرده.
4. در صورتِ تمایل، فعال‌سازیِ تدریجی (مثلاً فقط حساب ادمین، مطابقِ الگویِ قبلیِ `engine_first_real_futures_enabled`) پیش از باز شدن به همهٔ کاربرانِ VIP آینده.

هیچ Push/Deployی در این دور انجام نشد.
