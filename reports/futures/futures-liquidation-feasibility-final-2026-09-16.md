# Futures Liquidation Feasibility — Final Pass

**تاریخ:** ۲۰۲۶-۰۹-۱۶ · **وضعیت:** Phase A + Phase B (تکمیل منطق) کامل شد. **Deploy انجام نشد.**
**پیرو مستقیمِ:** [futures-sl-liquidation-and-weekly-economic-audit-2026-09-16.md](futures-sl-liquidation-and-weekly-economic-audit-2026-09-16.md) و [futures-liquidation-feasibility-fix-2026-09-16.md](futures-liquidation-feasibility-fix-2026-09-16.md) — این گزارش چیزی را که آن دو قبلاً درست پیاده کرده بودند تکرار/بازنویسی نمی‌کند، فقط شکاف‌های باقی‌مانده‌شان را می‌بندد.

---

## ۱. Root Cause نهایی (بدون تغییر از دو گزارشِ قبلی)

موتور (`shadowFuturesSetup`, `api/analyze.ts`) طبقِ فرمولِ خودش (`SL = Entry ± ATR×1.25`) درست عمل می‌کند. مشکل در نبودِ یک Risk/Execution Feasibility Gate بین این SL خام و اجرایِ واقعیِ Binance بود؛ Leverage (همیشه ۵x در دیتای واقعی) کاملاً مستقل از فاصله‌یِ SL در `futures_pro_setups` تنظیم می‌شد. این علت **تغییر نکرده** و در این پاس هم دست‌نخورده ماند.

## ۲. چه چیزی در Phase A درست بود (حفظ شد، بازنویسی نشد)

- `estimateIsolatedLiquidationPrice`/`computeMaxSafeLeverage` (فرمولِ flat، مشترکِ Demo/Simulation Lab).
- `getBinanceLeverageBrackets`/`selectLeverageBracket`/`computeIsolatedLiquidationPriceFromBracket`/`findMaxSafeLeverageWithBrackets` (Pre-entry، Bracket-aware، واقعی).
- Pre-entry Gate در `openBinanceTrade` (Isolated): NO_TRADE یا کاهشِ Effective Leverage، بدونِ دست‌زدن به Raw SL.
- `getBinanceOpenPosition` پارسِ `liquidationPrice` از `/fapi/v3/positionRisk`.
- Migration اولیه (nullable، اجرا‌نشده).
- ۲۸ تستِ اختصاصی + ۳۳۷ Regression موجود (بدونِ تغییر این پاس، دوباره اجرا نشدند چون هیچ تغییری در Simulation Lab این‌بار داده نشد).

## ۳. چه چیزی در این پاس تکمیل شد

| شکاف (طبقِ گزارشِ Phase A) | راه‌حلِ این پاس |
|---|---|
| Post-fill liquidation safety enforce نمی‌شد | `evaluateLiquidationSafety`/`computeProtectionStatus` + اجرای واقعی در `syncRealBinanceTrades` |
| `protected=true` به‌تنهایی SAFE تلقی می‌شد | `liquidation_safe` مستقل، `protection_status` (SAFE/AT_RISK/UNVERIFIED/UNKNOWN) — `protected` خودش هیچ‌جا معنی‌اش عوض نشد |
| Cross Margin پوشش نداشت | `else if (marginMode==='cross' ...) throw NO_TRADE` — Fail-Closed صریح، بدونِ استفاده از فرمولِ Isolated |
| Funding ردیابی نمی‌شد | جدولِ append-only `futures_funding_events` + `fetchAndRecordBinanceFunding` (فقط Observability) |
| Post-fill خطرناک → اقدام | Alert همیشگی (Telegram+Log) + CLOSE+VERIFY-FLAT پشتِ Kill Switchِ پیش‌فرض-خاموش |

## ۴. Architecture نهایی

```
Strategy Decision (api/analyze.ts — صفر تغییر)
        ↓
Raw SL/TP (بدون تغییر)
        ↓
PRE-ENTRY: Bracket-aware Feasibility (Isolated) → ALLOW(leverage) | NO_TRADE
PRE-ENTRY: Cross Margin → همیشه NO_TRADE (فرمولِ معتبر پیاده نشده)
        ↓
Real Execution (Binance)
        ↓
POST-FILL (هر تیکِ syncRealBinanceTrades):
  liquidationSafe = evaluateLiquidationSafety(side, rawSL, actualLiquidationPrice)
  protectionStatus = computeProtectionStatus(protected, liquidationSafe)
  → همیشه: ذخیره + Alert اگر AT_RISK
  → فقط اگر Kill Switch روشن: CLOSE + VERIFY FLAT | UNKNOWN
Funding Observability (موازی، مستقل از تصمیم): fetchAndRecordBinanceFunding
```

## ۵. Pre-entry Formula (بدون تغییر از Phase A)

```
LONG:  Liq = (WB + cum − Qty×Entry) / (Qty×(MMR−1))
SHORT: Liq = (WB + cum + Qty×Entry) / (Qty×(MMR+1))
requiredClearance = stopDist×(1/0.85 − 1) + Entry×0.5%
```
تنها اصلاحِ این پاس نسبت‌به Phase A: حالتِ مرزیِ LONG@لوریج=۱ با margin دقیقاً برابرِ notional (بدونِ اهرمِ واقعی) که Liq≤۰ می‌دهد اکنون صریحاً «بدونِ ریسکِ لیکویید» تفسیر می‌شود، نه «داده‌یِ نامعتبر» (کشف‌شده حینِ تست، فرمول خودش تغییر نکرد).

## ۶. Post-fill Formula/Check (جدید در این پاس)

```ts
function evaluateLiquidationSafety(side, stopLoss, actualLiquidationPrice) {
  if (actualLiquidationPrice == null || actualLiquidationPrice <= 0) return null; // هرگز true
  return side === 'LONG' ? stopLoss > actualLiquidationPrice : stopLoss < actualLiquidationPrice;
}
```
`actualLiquidationPrice` مستقیماً همان مقدارِ **واقعیِ** Binance است (`getBinanceOpenPosition`، همان چیزی که Phase A پارس کرد) — هیچ تخمینی در این لایه نیست. `null` (داده در دسترس نیست) هرگز `true` نمی‌شود — این دقیقاً بندِ ۱۰ معیارِ پذیرشِ کاربر است.

اجرا در `syncRealBinanceTrades` (تیکِ تناوبیِ موجودِ Reconciliation، بلافاصله بعدِ `ensureProtection`): برایِ **هر** پوزیشنِ بازِ واقعیِ Binance، هر بار، `liquidation_safe`/`protection_status`/`actual_liquidation_price` در `copy_trades` نوشته می‌شود.

## ۷. Protection Logic

- `protected` (`ensureBinanceProtectionLeg`) — **معنایش عوض نشد**: «سفارش واقعاً روی صرافی وجود/تایید دارد». تمامِ Call Siteهایِ قدیمی (MEXC/Gate هم همین الگو) دست‌نخورده.
- `liquidation_safe` — مستقل، جدید، بر اساسِ `actualLiquidationPrice` واقعی.
- `protection_status` — فیلدِ خلاصه‌یِ جدید:
  - `SAFE` = protected **و** liquidation_safe
  - `AT_RISK` = liquidation_safe=false (صرف‌نظر از protected — دقیقاً بندِ ۸ کاربر: «protected=true + liquidationSafe=false یک حالتِ معتبر است»)
  - `UNVERIFIED` = liquidation_safe=true ولی protected=false
  - `UNKNOWN` = داده‌یِ liquidation در دسترس نیست (هرگز SAFE)

## ۸. Cross Margin Policy

```ts
} else if (marginMode === 'cross' && stopLoss && stopLoss > 0) {
  throw new Error('NO_TRADE: cross margin liquidation feasibility is not modeled ...');
}
```
هیچ فرمولِ Isolated برایِ Cross استفاده نشده (تست ساختاری این را صریحاً تایید می‌کند — بدونِ فراخوانیِ `findMaxSafeLeverageWithBrackets`/`computeIsolatedLiquidationPriceFromBracket` در این شاخه). طبقِ داده‌یِ Audit، هیچ معامله‌یِ واقعی امروز از Cross استفاده نمی‌کند (`margin_mode` همه‌جا null/isolated) — یعنی این تغییر صفر رگرسیون رویِ رفتارِ فعلی دارد و فقط یک مسیرِ آینده را از قبل می‌بندد.

## ۹. Weekly Policy

**دست‌نخورده.** ATR، ATR Multiplier، Raw SL/TP، Timeframe Scoring، LONG/SHORT — هیچ‌کدام در این پاس (یا پاسِ قبلی) لمس نشدند. مسئله‌یِ Weekly همچنان فقط از طریقِ همان Feasibility Gate حل می‌شود (کاهشِ Leverage یا NO_TRADE)، نه با تغییرِ خودِ Weekly.

## ۱۰. Funding Observability

جدولِ append-only جدید `futures_funding_events` (id, trade_id FK, telegram_id, exchange, symbol, side, exchange_income_id [dedup]، funding_time, funding_amount_usdt) + ستونِ خلاصه‌یِ `copy_trades.cumulative_funding_usdt`. منبع: `GET /fapi/v1/income?incomeType=FUNDING_FEE` (مستندِ رسمیِ Binance). **هیچ Economic Gate ساخته نشد** — طبقِ دستورِ صریحِ کاربر، فقط Observability. Dedup روی `exchange_income_id` (tranId خودِ Binance) تضمین می‌کند تیکِ تکراری داده را دوبار نشمارد. شکستِ این فراخوانی هرگز کلِ تیکِ sync را متوقف نمی‌کند (try/catch مستقل).

## ۱۱. Files Changed

| فایل | تغییر |
|---|---|
| `api/copytrade.ts` | +۴۲۸/−۱۹ (تجمعیِ Phase A+B). این پاس اضافه کرد: `evaluateLiquidationSafety`, `computeProtectionStatus`, `fetchAndRecordBinanceFunding`, `isFuturesAutoCloseOnLiquidationRiskEnabled`؛ بلوکِ Cross-margin fail-closed در `openBinanceTrade`؛ منطقِ کاملِ Post-fill+Close+Alert در `syncRealBinanceTrades`؛ `FuturesPositionSnapshot.liquidationPrice` (additive) + پاس‌دادنش در آداپترِ Binance. |
| `migrations/futures_liquidation_feasibility.sql` | به‌روزرسانیِ همان فایلِ اجرا‌نشده‌یِ Phase A: +`liquidation_safe`, `protection_status` (+CHECK), `requested_margin_usdt`, `cumulative_funding_usdt`, و جدولِ `futures_funding_events`. |
| `scripts/futures-liquidation-feasibility-test.mjs` | +۳۵ چکِ جدید (Post-fill safety، Protection separation، Cross fail-closed، Funding، Migration). جمعاً ۶۳ چک. |
| `scripts/futures-real-execution-fault-test.mjs` | Mock جدید برایِ `/fapi/v1/income` و `liquidationPrice`، متدِ `upsert` روی دیتابیسِ فیکسچر، Extraction Listِ چهار تابعِ تازه + چند تابعِ ازقبل‌موجودِ گم‌شده (`cancelBinanceTriggerOrders` و ۴ تایِ دیگر که Phase A هم به آن‌ها نیاز داشت ولی هیچ تستی تا این پاس واقعاً آن مسیر را اجرا نکرده بود). **۴ تستِ کاملاً جدید** برایِ سناریوهایِ SAFE/AT_RISK-no-autoclose/CLOSED/UNKNOWN. |

`api/analyze.ts`: **صفر تغییر** (`git diff --stat` خالی — تایید شد).

## ۱۲. Migration

بررسی و به‌روزرسانیِ همان فایلِ Phase A (هنوز اجرا نشده روی هیچ محیطی، پس ادیت مستقیم امن بود). ویژگی‌ها:
- تمامِ `ADD COLUMN`/`CREATE TABLE`/`CREATE INDEX` با `IF NOT EXISTS` (idempotent، بجز CHECK constraint که خودِ PostgreSQL این فرم را ندارد — مثلِ بقیه‌یِ migrationهایِ این پروژه).
- هیچ `UPDATE`/`ALTER ... stop_loss/tp1/tp2/tp3` در کلِ فایل نیست (تستِ ساختاری این را تایید می‌کند).
- همه‌یِ ستون‌هایِ جدید nullable؛ هیچ ردیفِ موجود بازنویسی نمی‌شود.
- **هنوز اجرا نشده.** باید قبل از هر Deploy، بعدِ `npm run backup`، دستی در Supabase SQL Editor اجرا شود.

## ۱۳. Tests اجراشده

طبقِ دستورِ صریحِ کاربر («تست‌هایِ ۳۹۱گانه را دوباره بی‌دلیل اجرا نکن»)، فقط موارد زیر اجرا شد (هیچ‌کدام Simulation Lab را در این پاس دوباره اجرا نکردند چون این پاس آن کد را لمس نکرد):

```
npx tsc --noEmit                                          → 0 خطا در api/
esbuild api/copytrade.ts api/analyze.ts --bundle          → موفق (722.3kb/272.0kb)
node --test scripts/futures-real-execution-fault-test.mjs → 102/102 PASS (شاملِ ۴ تستِ کاملاً جدید)
node scripts/futures-liquidation-feasibility-test.mjs     → 63/63 PASS (۳۵ چکِ جدید)
```

## ۱۴. Test Results — چک‌لیستِ Acceptance Criteria کاربر

| # | معیار | وضعیت |
|---|---|---|
| ۱ | Raw Strategy SL/TP دست‌نخورده | ✅ (`api/analyze.ts` صفر تغییر؛ تستِ ساختاری) |
| ۲ | Pre-entry feasibility فعال برایِ Real Binance | ✅ (Phase A، تایید مجدد) |
| ۳ | Leverage با Stop Distance ناسازگار نباشد | ✅ |
| ۴ | Effective Leverage کاهش، نه Raw SL | ✅ (تستِ ۱۶) |
| ۵ | بدونِ Leverageِ امن → NO_TRADE | ✅ (با نکته‌یِ fully-margin-backed@1x — بخشِ ۵) |
| ۶ | بعدِ Fill، liquidationPrice واقعیِ Binance خوانده شود | ✅ (Phase A: parse؛ این پاس: enforce واقعی در تیکِ زنده) |
| ۷ | liquidationSafe جدا از protected | ✅ |
| ۸ | وجودِ Algo Order به‌تنهایی SAFE نیست | ✅ (`AT_RISK` حتی با `protected=true`) |
| ۹ | Post-fill خطرناک → ایمن‌سازی یا CLOSE+VERIFY FLAT | **✅ مکانیزم کامل پیاده شد، پشتِ Kill Switchِ پیش‌فرض‌خاموش** (بخشِ ۱۵) |
| ۱۰ | UNKNOWN هرگز SAFE/CLOSED نیست | ✅ (تستِ close-verification-failed) |
| ۱۱ | Cross بدونِ منطقِ معتبر عبور نکند | ✅ (Fail-Closed صریح) |
| ۱۲ | Weekly Strategy دست‌نخورده | ✅ |
| ۱۳ | Funding قابلِ‌ردیابی، بدونِ تغییرِ Strategy | ✅ (فقط Observability) |
| ۱۴ | بدونِ Deploy زودرس | ✅ (این پاس هم Push/Deploy نکرد) |

## ۱۵. Remaining Risks — صادقانه

- **Kill Switchِ Auto-Close پیش‌فرض خاموش است.** یعنی معیارِ ۹ از نظرِ *مکانیزم* کامل پیاده شده و تست شده، ولی تا وقتی ادمین صریحاً `settings.futures_real_auto_close_on_liquidation_risk='true'` را ست نکند، سیستم فقط Alert می‌دهد و پوزیشن را خودکار نمی‌بندد. این یک تصمیمِ عمدی است (این Fix هرگز رویِ حسابِ واقعی تست نشده)، نه یک شکافِ فراموش‌شده — ولی باید صریحاً دانسته شود.
- **سه پوزیشنِ بازِ فعلی (TAO/DASH/XRP از Audit) دست‌نخورده ماندند** — طبقِ دستورِ صریحِ کاربر. حتی بعدِ Deploy، تا وقتی Kill Switch روشن نشود، این سه (و هر پوزیشنِ مشابهِ آینده) فقط رصد و Alert می‌شوند.
- **این کدِ کاملاً جدید هرگز رویِ یک حسابِ واقعیِ Binance اجرا نشده** — فقط تستِ آفلاین/Mock. طبقِ دستورِ صریحِ کاربر، هیچ Live Test با سرمایه انجام نشد.
- **Cross Margin همچنان بدونِ منطقِ واقعی مانده** — فقط Fail-Closed شد، نه پیاده‌سازی شد؛ اگر کاربر بعداً Cross را واقعاً بخواهد، این یک کارِ جداگانه است (نیازمندِ مدل‌سازیِ کلِ کیفِ Cross، نه فقط یک پوزیشن).
- **Funding فقط Real Binance را پوشش می‌دهد** — MEXC/Gate/Hyperliquid هنوز هیچ ردیابیِ Funding ندارند.
- **Economic Viability Gate (سوالِ اصلیِ هزینه‌یِ Weekly) هنوز ساخته نشده** — عمداً، طبقِ دستورِ کاربر («تا داده‌یِ واقعیِ کافی نداریم فقط Observability»). بعدِ چند هفته دادهٔ Fundingِ واقعی، این می‌تواند طراحی شود.
- **دو تستِ Regressionِ از‌پیش‌ناموفق (بی‌ربط به این کار) هنوز در ریپو باقی‌اند** — `futures-tp-allocation-test.mjs` خطِ ۱۸۶، `engine-first-consensus-test.mjs` خطوطِ ۶۸/۷۸ (گزارشِ Phase A قبلی تاییدِ `git show HEAD` را ثبت کرد که این‌ها قبل از این کار هم fail بودند). این پاس آن‌ها را لمس یا مخفی نکرد.

## ۱۶. Production Readiness

**هنوز آماده‌یِ Deploy نیست.** چک‌لیست پیش از Phase B:

1. تاییدِ صریحِ کاربر برایِ commit/push.
2. `npm run backup` → اجرایِ دستیِ `migrations/futures_liquidation_feasibility.sql` در Supabase SQL Editor (**قبل از** deploy کد).
3. تصمیمِ کاربر درباره‌یِ روشن‌کردنِ `futures_real_auto_close_on_liquidation_risk` (پیشنهاد: خاموش بماند تا اولین چند تیکِ زنده با Alert-only رصد شود).
4. تصمیمِ کاربر درباره‌یِ سه پوزیشنِ بازِ فعلی (این کار هیچ اقدامی رویِ آن‌ها نکرد).
5. در صورتِ تمایل، یک بارِ محدود Live Verification با حسابِ Admin و مبلغِ ناچیز (طبقِ خواستِ صریحِ کاربر: فقط بعدِ سبزشدنِ کامل کد/تست/build).

هیچ Push/Deploy/تغییرِ VPS/فعال‌سازیِ Real Trading/تغییرِ پوزیشنِ موجود در این پاس انجام نشد.
