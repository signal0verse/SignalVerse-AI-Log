# Futures Liquidation Feasibility — Final Pass (نسخهٔ اصلاح‌شده)

**تاریخ:** ۲۰۲۶-۰۹-۱۶ · **وضعیت:** منطقِ Fail-Safe کامل شد. **Deploy انجام نشد.**
**پیرو مستقیمِ:** [futures-sl-liquidation-and-weekly-economic-audit-2026-09-16.md](futures-sl-liquidation-and-weekly-economic-audit-2026-09-16.md) و [futures-liquidation-feasibility-fix-2026-09-16.md](futures-liquidation-feasibility-fix-2026-09-16.md) — این گزارش چیزی را که آن دو قبلاً درست پیاده کرده بودند تکرار/بازنویسی نمی‌کند، فقط شکاف‌های باقی‌مانده‌شان را می‌بندد.

> **دو اصلاحِ این نسخه نسبت‌به اولین نسخهٔ همین گزارش:**
> ۱) Auto-Close دیگر پشتِ هیچ Toggleِ پیش‌فرض‌خاموشی نیست — AT_RISK همیشه بی‌قید‌وشرط تلاشِ Close+Verify-Flat را اجرا می‌کند (بخشِ ۱۵ توضیح می‌دهد چرا «کاهشِ Leverage به‌جایِ Close» برایِ یک پوزیشنِ ازقبل‌بازِ Isolated اصلاً مکانیکی معنا ندارد).
> ۲) بخشِ Migration بازنویسی شد: ارجاع به «Supabase SQL Editor» که در نسخهٔ اول از الگویِ تکراریِ کلِ پوشهٔ `migrations/` کپی شده بود، طبقِ اصلاحِ صریحِ مالک حذف شد؛ به‌جایش این گزارش دقیقاً می‌گوید چه چیزی باید پیش از اجرایِ این migration روی زیرساختِ فعلیِ VPS تایید شود — بدونِ حدسِ مکانیزمِ جایگزین.

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
| Post-fill خطرناک → اقدام | Alert همیشگی (Telegram+Log) + CLOSE+VERIFY-FLAT **بی‌قیدوشرط** (بدونِ هیچ Toggle/Kill Switch) |

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
  → همیشه: ذخیره در copy_trades
  → اگر AT_RISK: Alert (Log+Telegram) + بی‌قیدوشرط CLOSE + VERIFY FLAT
      → positionAmt==0 تایید شد → CLOSED_LIQUIDATION_RISK
      → تایید نشد یا خطا → protection_status=UNKNOWN (هرگز CLOSED/SAFE)
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

### چرا «کاهشِ Leverage» جایگزینِ Close نشد (یافتهٔ فنی، نه انتخابِ سلیقه‌ای)

دستورِ این پاس صریحاً گفته: «اگر کاهشِ Leverage واقعی و امن ممکن است، Raw SL دست‌نخورده بماند و Risk calculation معتبر باشد؛ وگرنه مستقیم CLOSE». بررسی شد: برایِ یک پوزیشنِ **ازقبل‌بازِ** Isolated روی Binance، Liquidation Price تابعِ `isolatedWalletBalance / notional / MMR` است (همان فرمولِ بخشِ ۵) — نه خودِ فیلدِ «Leverage». فراخوانیِ `POST /fapi/v1/leverage` روی یک پوزیشنِ باز فقط سقفِ اهرمِ سفارش‌هایِ **آینده** را عوض می‌کند و مقدارِ `isolatedWalletBalance`ِ موجود را تغییر نمی‌دهد — پس Liquidation Price همان پوزیشنِ بازِ فعلی را **جابه‌جا نمی‌کند**. تنها اهرمی که واقعاً Liquidation Price را برایِ یک پوزیشنِ باز دور می‌کند، افزودنِ Margin است (`POST /fapi/v1/positionMargin`) که هم خارج از این Fix است (قانونِ ثابتِ پروژه: افزایشِ خودکارِ Margin ممنوع) و هم قبلاً در پاسِ اول به‌عنوانِ خط‌قرمز رد شده بود. نتیجه: «Risk calculation معتبر»ی برایِ de-risk-in-place از طریقِ Leverage وجود ندارد — پس طبقِ همان دستور («در غیر این صورت مستقیم CLOSE») مسیرِ اجرا **مستقیماً** CLOSE+VERIFY-FLAT است، بدونِ گامِ میانیِ کاهشِ Leverage.

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
| `api/copytrade.ts` | این پاس نسبت‌به آخرین commitِ پاسِ قبلی: حذفِ کاملِ Kill Switch (`isFuturesAutoCloseOnLiquidationRiskEnabled` و خواندنِ `settings.futures_real_auto_close_on_liquidation_risk`) — Close حالا بی‌قیدوشرط زیرِ همان `if (liquidationSafe === false)` اجرا می‌شود؛ کامنتِ توضیحیِ جدید دربارهٔ چرا «کاهشِ Leverage» جایگزین نشد. بقیهٔ آرشیتکتورِ Post-fill (`evaluateLiquidationSafety`, `computeProtectionStatus`, `fetchAndRecordBinanceFunding`, بلوکِ Cross-margin fail-closed، `FuturesPositionSnapshot.liquidationPrice`) بدونِ تغییر از پاسِ قبلی حفظ شد. |
| `migrations/futures_liquidation_feasibility.sql` | فقط بخشِ کامنتِ «چگونه اجرا شود» بازنویسی شد (بخشِ ۱۲ پایین) — **هیچ DDLای تغییر نکرد**. ستون‌ها/جدول همان‌هایِ پاسِ قبلی: `liquidation_safe`, `protection_status` (+CHECK), `requested_margin_usdt`, `cumulative_funding_usdt`, `futures_funding_events`. |
| `scripts/futures-liquidation-feasibility-test.mjs` | چک‌هایِ مربوط به Kill Switch حذف/جایگزین شد با چکِ «هیچ Toggleای وجود ندارد + Close بلافاصله بعدِ Alert اجرا می‌شود». جمعاً ۶۴ چک. |
| `scripts/futures-real-execution-fault-test.mjs` | تستِ «AT_RISK + Kill Switch خاموش → فقط Alert» حذف شد (چون این حالت دیگر در کد وجود ندارد)؛ دو تستِ باقی‌مانده (Closed/Unknown) حالا **بدونِ هیچ ردیفِ settings** اجرا می‌شوند تا اثبات شود Close به هیچ Toggleای وابسته نیست. جمعاً ۳ تستِ Post-fill جدید (به‌جایِ ۴ تایِ پاسِ قبلی). |

`api/analyze.ts`: **صفر تغییر** (`git diff --stat` خالی — تایید شد، در این پاس هم).

## ۱۲. Migration — اصلاحِ معماری دیتابیس

**اصلاحِ صریحِ مالک:** ارجاعِ «Supabase SQL Editor» در نسخهٔ اولِ این گزارش (و در واقع در **تمامِ ۲۵ فایلِ** پوشهٔ `migrations/`، از جمله چند فایلِ خیلی اخیر) دیگر معماریِ فعلی را توصیف نمی‌کند. `CLAUDE.md` صراحتاً می‌گوید Production روی PostgreSQL/PostgREST خودمیزبانِ VPS است و «Supabase/Vercel هیچ مسیرِ فعال یا Rollback اجرایی ندارند». این پاس **هیچ تغییری در خودِ DDL یا معماریِ دیتابیس نداد** — فقط جمله‌یِ راهنمایِ اجرا در کامنتِ بالایِ فایل اصلاح شد.

**Database Migration Requirement (به‌جایِ حدس زدن):** این سشن نتوانست از رویِ کدبیس/مستنداتِ موجود به‌طورِ قطعی تایید کند مسیرِ فعلیِ اجرایِ DDL رویِ Postgresِ VPS دقیقاً چیست — `DATABASE_API_URL`/`DATABASE_SERVICE_ROLE_KEY` (که خودِ این پروژه هم برایِ Backup و هم برایِ همه‌یِ کوئری‌هایِ زمانِ اجرا استفاده می‌کند) فقط دسترسیِ PostgREST (یعنی REST رویِ جدول‌هایِ ازقبل‌موجود) می‌دهند و **نمی‌توانند** `ALTER TABLE`/`CREATE TABLE` اجرا کنند — DDL همیشه به یک اتصالِ SQL مستقیم به خودِ Postgres نیاز دارد. پیش از اجرایِ این migration، دو چیز باید مشخص شود (نه حدس زده):
1. چه چیزی الان دسترسیِ SQL مستقیم به Postgresِ رویِ VPS (`signal.easybitpay.com`) را فراهم می‌کند؟ (مثلاً SSH + `psql`، یک ابزارِ ادمینِ خودمیزبان، یا چیزِ دیگری که در این سشن دیده نشد.)
2. همان مسیر باید بتواند بعدِ DDL، Cache‌یِ Schemaیِ PostgREST را هم Reload کند (`NOTIFY pgrst, 'reload schema'` یا ری‌استارتِ سرویس) تا جدول/ستون‌هایِ تازه فوراً از طریقِ REST قابلِ‌دیدن شوند.
تا این دو مورد تایید نشوند، این migration **نباید** اجرا شود.

ویژگی‌هایِ خودِ DDL (بدونِ تغییر از پاسِ قبلی):
- تمامِ `ADD COLUMN`/`CREATE TABLE`/`CREATE INDEX` با `IF NOT EXISTS` (idempotent، بجز CHECK constraint که خودِ PostgreSQL این فرم را ندارد — مثلِ بقیه‌یِ migrationهایِ این پروژه).
- هیچ `UPDATE`/`ALTER ... stop_loss/tp1/tp2/tp3` در کلِ فایل نیست (تستِ ساختاری این را تایید می‌کند).
- همه‌یِ ستون‌هایِ جدید nullable؛ هیچ ردیفِ موجود بازنویسی/rewrite نمی‌شود.
- **هنوز اجرا نشده.**

## ۱۳. Tests اجراشده

طبقِ دستورِ صریحِ کاربر (فقط تست‌هایِ هدفمند/مستقیماً‌متاثر + build + type-check):

```
npx tsc --noEmit                                          → 0 خطا در api/
esbuild api/copytrade.ts api/analyze.ts --bundle          → موفق (722.0kb/272.0kb)
node --test scripts/futures-real-execution-fault-test.mjs → 101/101 PASS
node scripts/futures-liquidation-feasibility-test.mjs     → 64/64 PASS
```

Simulation Lab (۳۳۷ کیس) در این پاس دوباره اجرا نشد — کدِ آن این پاس دست‌نخورده ماند (فقط `api/copytrade.ts`ی مربوط به Real Execution تغییر کرد). هیچ تستِ زنده/سرمایه‌دار اجرا نشد.

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
| ۹ | Post-fill خطرناک → ایمن‌سازی یا CLOSE+VERIFY FLAT | **✅ بی‌قیدوشرط پیاده شد** — بدونِ Toggle/Kill Switch (بخشِ ۶ برایِ چرا «ایمن‌سازی با کاهشِ Leverage» مکانیکاً روی پوزیشنِ باز اثری ندارد) |
| ۱۰ | UNKNOWN هرگز SAFE/CLOSED نیست | ✅ (تستِ close-verification-failed) |
| ۱۱ | Cross بدونِ منطقِ معتبر عبور نکند | ✅ (Fail-Closed صریح) |
| ۱۲ | Weekly Strategy دست‌نخورده | ✅ |
| ۱۳ | Funding قابلِ‌ردیابی، بدونِ تغییرِ Strategy | ✅ (فقط Observability) |
| ۱۴ | بدونِ Deploy زودرس | ✅ (این پاس هم Push/Deploy نکرد) |

## ۱۵. Remaining Risks — صادقانه

- **Auto-Close حالا بی‌قیدوشرط است — یعنی خودِ ریسکِ اصلیِ این پاس، احتمالِ False Positive در `evaluateLiquidationSafety` است.** اگر به هر دلیلی (مثلاً فرمتِ غیرمنتظره‌یِ پاسخِ Binance، باگِ کشف‌نشده در فرمول، یا race condition بینِ خواندنِ SL/Entry/Liquidation) این تابع یک پوزیشنِ واقعاً سالم را AT_RISK تشخیص دهد، سیستم فوراً آن را می‌بندد — بدونِ فرصتِ بازبینیِ انسانی پیش از اقدام. Alert (Log+Telegram) هم‌زمان با Close ارسال می‌شود، نه پیشاپیش. این دقیقاً همان trade-off ای‌ست که کاربر صریحاً پذیرفت («ریسکِ نبستنِ پوزیشنِ ناامن از ریسکِ اقدامِ خودکار بزرگ‌تر است»)، ولی باید آگاهانه دانسته شود.
- **این کدِ کاملاً جدید هرگز رویِ یک حسابِ واقعیِ Binance اجرا نشده** — فقط تستِ آفلاین/Mock (فرمول‌ها با مستنداتِ رسمیِ Binance تطبیق داده شد، ولی رفتارِ زنده‌یِ API - از جمله شکلِ دقیقِ پاسخِ `/fapi/v1/leverageBracket`/`/fapi/v1/income` - تایید نشده). طبقِ دستورِ صریحِ کاربر، هیچ Live Test با سرمایه انجام نشد.
- **سه پوزیشنِ بازِ فعلی (TAO/DASH/XRP از Audit) دست‌نخورده ماندند** — طبقِ دستورِ صریحِ کاربر، این پاس هیچ اقدامی رویِ آن‌ها انجام نداد. اگر این کد Deploy شود، در همان تیکِ Reconciliationِ اول، همین سه پوزیشن (که Audit ثابت کرد SLشان از Liquidationِ تخمینی ناامن است) می‌توانند خودکار بسته شوند — این دقیقاً نتیجه‌یِ مطلوبِ این Fix است، ولی باید پیش از Deploy صریحاً به کاربر گفته شود، نه غافل‌گیرکننده باشد.
- **مکانیزمِ اجرایِ Migration رویِ VPS هنوز تایید نشده** (بخشِ ۱۲) — تا وقتی مسیرِ SQL مستقیم و روشِ Reloadِ Schema‌یِ PostgREST مشخص نشود، این migration قابلِ‌اجرایِ امن نیست.
- **Cross Margin همچنان بدونِ منطقِ واقعی مانده** — فقط Fail-Closed شد، نه پیاده‌سازی شد؛ اگر کاربر بعداً Cross را واقعاً بخواهد، این یک کارِ جداگانه است (نیازمندِ مدل‌سازیِ کلِ کیفِ Cross، نه فقط یک پوزیشن).
- **Funding فقط Real Binance را پوشش می‌دهد** — MEXC/Gate/Hyperliquid هنوز هیچ ردیابیِ Funding ندارند.
- **Economic Viability Gate (سوالِ اصلیِ هزینه‌یِ Weekly) هنوز ساخته نشده** — عمداً، طبقِ دستورِ کاربر («تا داده‌یِ واقعیِ کافی نداریم فقط Observability»). بعدِ چند هفته دادهٔ Fundingِ واقعی، این می‌تواند طراحی شود.
- **دو تستِ Regressionِ از‌پیش‌ناموفق (بی‌ربط به این کار) هنوز در ریپو باقی‌اند** — `futures-tp-allocation-test.mjs` خطِ ۱۸۶، `engine-first-consensus-test.mjs` خطوطِ ۶۸/۷۸ (گزارشِ Phase A تاییدِ `git show HEAD` را ثبت کرد که این‌ها قبل از این کار هم fail بودند). این پاس آن‌ها را لمس یا مخفی نکرد.

## ۱۶. Production Readiness

**هنوز آماده‌یِ Deploy نیست.** چک‌لیست پیش از Deploy:

1. چهار commitِ پاسِ قبلی از قبل رویِ برنچِ جداگانه‌یِ `futures-liquidation-feasibility-fix` push شده‌اند (نه `main` — بدونِ اثرِ Deploy). تغییراتِ همین پاس (حذفِ Kill Switch + اصلاحِ Migration) هنوز فقط در working tree هستند و منتظرِ تاییدِ صریحِ کاربر برایِ commit/push به همان برنچ‌اند.
2. **تعیینِ مسیرِ واقعیِ اجرایِ DDL رویِ VPS** (بخشِ ۱۲) — پیش‌نیازِ اجرایِ خودِ Migration.
3. `npm run backup` → اجرایِ `migrations/futures_liquidation_feasibility.sql` از همان مسیرِ تاییدشده (**قبل از** deploy کد).
4. **تصمیمِ آگاهانه‌یِ کاربر دربارهٔ رفتارِ بی‌قیدوشرطِ Auto-Close** — از اولین تیکِ Reconciliation بعدِ Deploy، هر پوزیشنِ Real Binanceِ AT_RISK (شاملِ احتمالاً TAO/DASH/XRP) خودکار بسته می‌شود؛ این باید عمداً پذیرفته شود، نه غیرمنتظره.
5. در صورتِ تمایل، یک بارِ محدود Live Verification با حسابِ Admin و مبلغِ ناچیز (طبقِ خواستِ صریحِ کاربر: فقط بعدِ سبزشدنِ کامل کد/تست/build).

هیچ Push/Deploy/تغییرِ VPS/فعال‌سازیِ Real Trading/تغییرِ پوزیشنِ موجود در این پاس انجام نشد.
