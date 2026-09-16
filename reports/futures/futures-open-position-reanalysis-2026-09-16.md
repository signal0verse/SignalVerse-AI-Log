# Futures Open-Position Re-Analysis

**تاریخ:** ۲۰۲۶-۰۹-۱۶ · **وضعیت:** پیاده‌سازیِ کامل. **Deploy انجام نشد.**
**دامنه:** Real Binance Futures فقط (هم‌راستا با دامنهٔ Liquidation Feasibility Fix). Generic برایِ **هر** نماد/جهت/پوزیشن — TAO/DASH/XRP/BTC/ETH/... هیچ منطقِ symbol-specific ندارد.
**وابسته به:** [futures-liquidation-feasibility-final-2026-09-16.md](futures-liquidation-feasibility-final-2026-09-16.md) — این فیچر کاملاً روی همان `liquidation_safe`/`protection_status`/Fail-Safe Close ساخته شده، آن را دور نمی‌زند.

---

## ۱. UI

دکمهٔ دائمیِ **«تحلیل مجدد / Re-Analyze»** روی کارتِ هر پوزیشنِ بازِ `mode==='real' && exchange==='binance'` در `CopyTradePanel` (`src/app/App.tsx`)، دقیقاً کنارِ دکمهٔ موجودِ «بستن/Close»، هم‌الگو. کلیک → `ReanalyzeModal` (دوزبانه، عیناً هم‌سبکِ `ExchangeConnectModal`):

- **بررسی خودکار تا بسته‌شدن / Automatic — until position closes** (پیش‌فرض، برچسبِ «روشن»/«ON» وقتی از قبل فعال است)
- **فقط همین بار / Once**
- **توقفِ تحلیلِ خودکار / Stop Auto Re-Analyze** (فقط وقتی AUTO از قبل روشن است نشان داده می‌شود)
- **لغو / Cancel**

روی خودِ کارت، یک ردیفِ وضعیتِ دائمی: `Protection: Safe/At Risk/Unverified/Unknown` + `Auto Re-Analyze: ON/OFF` + `Last checked: …`. همهٔ این‌ها از `GET /api/copytrade?mode=real` می‌آیند (یک کوئریِ batch‌شدهٔ اضافه به `futures_reanalysis_policies`، بدونِ round-trip جداگانه per-trade).

## ۲. حالتِ ONCE

`action=reanalyze` با `{id, reanalysisMode:'ONCE'}` — همزمان (synchronous HTTP request/response)، **بدونِ** ساختن/لمسِ هیچ Policy‌ای. زنجیره: پوزیشنِ فعلی → دیتایِ زندهٔ بازار → Engine → AI Supervisor → Risk/Liquidation Gate → (فقط با تاییدِ کامل) به‌روزرسانیِ Protection. بعدِ اتمام: هیچ Auto Monitoringای ایجاد نمی‌شود؛ اگر از قبل یک Policyِ AUTOِ فعال داشت، **دست‌نخورده** می‌ماند.

## ۳. حالتِ AUTO

`action=reanalyze` با `{id, reanalysisMode:'AUTO'}` → یک ردیفِ `futures_reanalysis_policies{status:'ACTIVE'}` upsert می‌شود (`onConflict:'trade_id'` — چون `trade_id` در جدول UNIQUE است، دوباره‌کلیک‌کردن هرگز ردیفِ تکراری نمی‌سازد؛ فقط ردیفِ موجود را دوباره ACTIVE می‌کند).

**پیش‌فرض = AUTOMATIC ON.** هر پوزیشنِ Real Binanceِ **تازه‌باز‌شده** (از این پس، نه پوزیشن‌هایِ ازقبل‌موجود) به‌طورِ خودکار یک Policyِ ACTIVE می‌گیرد — کاربر مجبور نیست دستی فعالش کند. این در هر دو محلِ بازکردنِ واقعیِ Binance سیم‌کشی شده: `activateRealPendingTrade` و `action=open` (`createDefaultReanalysisPolicy`، بلافاصله بعدِ insert موفقِ `copy_trades`، best-effort — شکستِ آن هرگز خودِ ورود را fail نمی‌کند).

## ۴. Auto Lifecycle

Policy تا وقتی `status='ACTIVE'` بماند فعال است. **هر بار** که `syncRealBinanceTrades` (تیکِ ۵دقیقه‌ایِ موجودِ Reconciliation) به آن پوزیشن می‌رسد:

1. اول Binance واقعاً چک می‌شود (همان مسیرِ ازقبل‌موجودِ `adapter.getPosition`/`handleVanishedPosition`).
2. اگر `positionAmt==0` (از هر مسیر: ناپدیدشدن، SL/TP-hit، یا Fail-Safe Close): Policy فوراً `STOPPED_POSITION_CLOSED` می‌شود — `stopReanalysisPolicyForTrade(trade_id, ...)`. **سه** نقطهٔ توقف: (الف) مسیرِ vanished-position، (ب) بستنِ عادی با SL/TP، (ج) Fail-Safe Close از Liquidation Fix.
3. اگر هنوز باز است: eligibility چک می‌شود (بخشِ ۵).
4. فقط در صورتِ eligible: تحلیلِ کاملِ Engine+Supervisor+Risk اجرا می‌شود.

**دستی توسط کاربر:** «توقفِ تحلیلِ خودکار» → `STOPPED_BY_USER`، پوزیشن و Protectionِ فعلی کاملاً دست‌نخورده.

## ۵. Trigger / Eligibility (جلوگیری از AI Spam)

`computeReanalysisEligibility` — تابعِ خالص، صفر فراخوانیِ اضافه (از دیتایِ همان تیکِ syncِ موجود استفاده می‌کند، نه Fetchِ جدید):

| شرط | Eligible؟ |
|---|---|
| `protection_status==='AT_RISK'` | همیشه بله (ریسکِ Liquidation ذاتاً meaningful است) |
| هیچ تحلیلِ قبلی برایِ این پوزیشن نیست | بله (اولین بررسی بعدِ فعال‌شدنِ AUTO) |
| `protection_status` نسبت‌به آخرین بررسی عوض شده (مثلاً SAFE→UNVERIFIED) | بله |
| رشدِ `mfe_r` یا `mae_r` (Excursion، از همان تیکِ موجودِ SL/TP-hit) ≥ ۰.۵R نسبت‌به آخرین بررسی | بله |
| بیش از ۲۴ ساعت از آخرین بررسیِ کامل گذشته | بله (سقفِ ایمنی، نه یک Triggerِ «معمولی») |
| هیچ‌کدام | **خیر — بدونِ فراخوانیِ AI** |

فقط وقتی eligible، مسیرِ کامل (Fetchِ کندلِ تازه + Engine + AI Supervisورِ پولی) اجرا می‌شود. این دقیقاً تفکیکِ خواستهٔ کاربر است: «Auto» یعنی نظارتِ هوشمند، نه «هر تیک AI صدا بزن».

## ۶. Engine Flow

تابعِ تازهٔ `computeFuturesReanalysisDecision` (`api/analyze.ts`) — **نه** یک Wrapper رویِ `analyzeOneCoinPro` (آن تابع Entry-Seeking است: گیتِ `openLock` وقتی پوزیشن از قبل باز است رد می‌کند، کردیت مصرف می‌کند، `pending_signals`/`signal_locks` می‌سازد — همهٔ این‌ها side effectِ مخصوصِ ورودِ تازه‌اند که اینجا نباید اجرا شوند). این تابعِ جدید همان توابعِ اصلیِ ازقبل‌موجود را مستقیماً صدا می‌زند (`computeShadowEngineState`, `buildFuturesDecisionRow`, `persistEngineDecision`) — **صفر فرمولِ جدید، صفر Reimplementation**.

`account.hasOpenSignalLock=false` و `account.openRealPositionCount=0` عمداً hardcode شده‌اند — این دو فقط برایِ جلوگیری از یک ورودِ **دومِ** جدید در `shadowRiskGates` هستند، نه برایِ ارزیابیِ SL/TPِ همان پوزیشنِ ازقبل‌مجاز. هر گیتِ دیگر (R:R≥۱.۹، سقفِ اهرم، رژیم/کلان) دقیقاً مثلِ یک تحلیلِ تازه اجرا می‌شود.

هر بارِ Re-Analysis یک ردیفِ `engine_decisions` واقعی ثبت می‌کند (`lifecycle_status='REANALYSIS'`) — دقیقاً همان لجرِ موجود، نه جدولِ جدا.

## ۷. Supervisor Flow

AI Supervisor **فقط** وقتی صدا زده می‌شود که Engine هنوز همان جهتِ پوزیشنِ باز را می‌خواهد (`matchesCurrentSide`) — دقیقاً هم‌الگویِ مسیرِ Real تازه («Engine NO_TRADE همیشه می‌برد، AI حتی پرسیده نمی‌شود»). همان `buildEngineReviewPrompt`/`reviewEngineDecisionWithOpenRouter` ازقبل‌موجود — پرامپتش از قبل صریح می‌گوید AI حق اختراعِ SL/TP/Direction ندارد؛ کدش هم فقط رشتهٔ `CONFIRM/CAUTION/REJECT` را می‌خواند، هیچ فیلدِ عددی از پاسخِ AI هرگز خوانده نمی‌شود. `CAUTION`/`REJECT`/در‌دسترس‌نبودن همه Fail-Closed به «بدونِ تغییر».

## ۸. Risk Flow

قبل از هر تغییرِ واقعی، SL خامِ تازه دوباره با `evaluateLiquidationSafety` (همان تابعِ Liquidation Fix، بدونِ تغییر) در برابرِ `actual_liquidation_price`ِ واقعیِ ثبت‌شده چک می‌شود:
- LONG: `newSL > actualLiquidationPrice`
- SHORT: `newSL < actualLiquidationPrice`

اگر ناامن: `REJECTED_UNSAFE`، Protectionِ قدیمی دست‌نخورده، **و** — اگر این تلاش از مسیرِ AT_RISK بود — Fail-Safe Close دست‌نخوردهٔ Liquidation Fix بلافاصله بعدش اجرا می‌شود (بخشِ ۱۰). Re-Analyze **هرگز** این Fail-Safe را دور نمی‌زند، فقط یک فرصتِ اضافه پیشِ آن می‌دهد.

## ۹. Protection Update

فقط وقتی **همه**: Engine همان‌جهت + Supervisor=CONFIRM + Risk=Safe. ترتیبِ اجرا (برایِ اینکه پوزیشن هرگز یک لحظه هم بدونِ محافظتِ زنده نباشد):

1. سفارش‌هایِ **جدید** SL/TP گذاشته می‌شوند (`ensureBinanceProtectionLeg`، دقیقاً همان تابعِ ازقبل‌تست‌شده).
2. فقط اگر **هر دو** تایید شدند (`protected:true`)، سفارش‌هایِ **قدیمی** با `algoId`یِ دقیق لغو می‌شوند (`cancelBinanceAlgoOrderById` — جدید، لغوِ هدفمند، نه `cancelBinanceTriggerOrders`یِ قبلی که همه‌چیز را پاک می‌کرد).
3. اگر تاییدِ جدید شکست بخورد: قدیمی‌ها هرگز لمس نمی‌شوند — Protectionِ قدیمی همچنان معتبر می‌ماند، وضعیت `ERROR` ثبت می‌شود.

## ۱۰. Position Close Handling

سه مسیرِ بستن، هر سه Policy را متوقف می‌کنند (بخشِ ۴):
- **دستی** (`action=close`) — خارج از این فیچر تغییری نکرد؛ توقفِ Policy از طریقِ همان تشخیصِ `positionAmt==0` در تیکِ بعدی.
- **SL/TP روی Binance** — `decideRealTradeAction`/`adapter.reconcilePosition` (بدونِ تغییرِ منطق) + `stopReanalysisPolicyForTrade` وقتی `result.closed`.
- **Fail-Safe Liquidation Close** — همان مسیرِ بدونِ‌تغییرِ پاسِ قبلی + `stopReanalysisPolicyForTrade`.

**هیچ Inheritance بینِ Lifecycleها**: Policy به `trade_id` (نه Symbol) متصل است. یک BTC Position B بعدِ بسته‌شدنِ BTC Position A یک `trade_id` کاملاً تازه می‌گیرد → `getActiveReanalysisPolicy` برایش `null` برمی‌گرداند تا `createDefaultReanalysisPolicy` خودش (در بازِ شدنِ B) یک ردیفِ کاملاً جدید بسازد.

## ۱۱. Database

`migrations/futures_reanalysis.sql` (**اجرا نشده** — همان محدودیتِ Liquidation Fix دربارهٔ تاییدِ مسیرِ DDL رویِ VPS فعلی، بدونِ حدس؛ ببینید همان گزارش، بخشِ ۱۲):

- `futures_reanalysis_policies` — یک ردیف به‌ازایِ هر lifecycle پوزیشن (`trade_id UNIQUE`). `status`, `last_analyzed_at`, `last_decision_id`, `last_snapshot` (jsonb، برایِ eligibility)، `processing_started_at` (قفلِ نرم)، `stopped_at`, `stop_reason`.
- `futures_reanalysis_audit` — append-only، **هرگز overwrite نمی‌شود**. هر تلاشِ واقعیِ Re-Analysis (نه هر چکِ eligibility): `old_stop_loss/old_tp1`، `new_raw_side/stop_loss/tp1` (همیشه ثبت می‌شود، حتی اگر اعمال نشود)، `engine_decision_id`, `engine_outcome`, `supervisor_result/reason`, `risk_result`, `protection_result`, `final_action`.
- `copy_trades` هیچ ستونِ جدیدی نگرفت — `stop_loss`/`tp1` همان منبعِ حقیقتِ موجودِ «وضعیتِ فعلی» می‌مانند؛ تاریخچه فقط در audit.

## ۱۲. Concurrency

- `trade_id UNIQUE` رویِ `futures_reanalysis_policies` → `action=reanalyze&mode=AUTO` تکراری هرگز ردیفِ دوم نمی‌سازد (`upsert` با `onConflict:'trade_id'`).
- `processing_started_at` (قفلِ نرم، هم‌الگویِ `futures_execution_attempts` این پروژه): قبل از هر تلاش ست می‌شود؛ یک تیکِ دیگر که این را «تازه» (کمتر از ۳ دقیقه) ببیند رد می‌شود، نه دوباره پردازش.

## ۱۳. AI Cost Control

- ONCE: دقیقاً یک فراخوانیِ Supervisor.
- AUTO: فقط وقتی `computeReanalysisEligibility` مثبت بدهد (بخشِ ۵) — پیشِ آن هیچ فراخوانیِ AI/Engine‌ای نیست.
- Re-Analysis **کردیت مصرف نمی‌کند** — طبقِ همان قاعدهٔ actionable-only پروژه (کردیت فقط روی نقطهٔ ورود/خروجِ واقعی کم می‌شود؛ یک به‌روزرسانیِ SL/TP روی پوزیشنِ ازقبل‌باز نه ورود است نه خروج). این یک تصمیمِ صریح است، نه فراموشی — در گزارش ثبت شد تا بعداً به‌عنوانِ «باگ» گزارش نشود.

## ۱۴. Tests اجراشده

```
npx tsc --noEmit                                          → 0 خطایِ جدید
npm run build                                              → موفق (وب + ادمین)
esbuild api/copytrade.ts api/analyze.ts --bundle          → موفق
node --test scripts/futures-real-execution-fault-test.mjs → 101/101 PASS (بدونِ رگرسیون)
node --test scripts/futures-reanalysis-test.mjs (جدید)    → 30/30 PASS
node scripts/futures-liquidation-feasibility-test.mjs     → 64/64 PASS (بدونِ رگرسیون)
```

Simulation Lab (۳۳۷ کیس) دوباره اجرا نشد — این پاس آن کد را لمس نکرد. هیچ تستِ زنده/سرمایه‌دار انجام نشد؛ هیچ TAO/DASH/XRP لمس نشد.

## ۱۵. Results — پوششِ سناریوهایِ خواسته‌شدهٔ کاربر

| سناریو | وضعیت |
|---|---|
| Re-Analyze ONCE | ✅ |
| Re-Analyze AUTO | ✅ |
| Duplicate prevention | ✅ (`trade_id UNIQUE` + upsert + soft lock) |
| Position close stops AUTO | ✅ |
| Manual close stops AUTO | ✅ (همان مسیرِ تشخیصِ positionAmt==0) |
| SL/TP close stops AUTO | ✅ |
| Engine first | ✅ (Supervisor فقط بعدِ Engineِ هم‌جهت صدا زده می‌شود) |
| Supervisor reviewer only | ✅ (نمی‌تواند SL/TP/Direction بسازد — تست ساختاری+رفتاری) |
| Unsafe SL rejected | ✅ |
| Safe SL update | ✅ |
| Protection preservation | ✅ (ترتیبِ Place-New-then-Cancel-Old) |
| No new position | ✅ (تستِ ساختاری: `runFuturesReanalysis` هیچ ارجاعی به `openBinanceTrade` ندارد) |
| Direction conflict | ✅ |
| Audit trail | ✅ (append-only، حتی برایِ NO_ACTIONABLE_CHANGE) |
| User Stop Auto | ✅ (پوزیشن/Protection دست‌نخورده) |
| i18n | ✅ (تستِ ساختاری رویِ متنِ دوزبانهٔ Modal) |
| TypeScript / Build | ✅ |
| Regressionِ مستقیماً‌متاثر | ✅ (۱۰۱/۱۰۱ فالت‌تست) |

## ۱۶. Files Changed

| فایل | تغییر |
|---|---|
| `api/analyze.ts` | **Additive only** — دو تابعِ جدید (`computeFuturesReanalysisDecision`, `handleFuturesReanalyze`) + یک خطِ routing. صفر خطِ موجود تغییر کرد؛ `computeShadowEngineState`/ATR/Multiplier/فرمول‌ها دست‌نخورده. |
| `api/copytrade.ts` | توابعِ جدید: `computeReanalysisEligibility`, `cancelBinanceAlgoOrderById`, `runFuturesReanalysis`, `createDefaultReanalysisPolicy`, `getActiveReanalysisPolicy`, `stopReanalysisPolicyForTrade`, `reanalysisLockIsFree`. سیم‌کشی در `syncRealBinanceTrades` (AT_RISK-path + eligibility-path + سه نقطهٔ stop-on-close)، دو محلِ insert در `openBinanceTrade`'s callers (`createDefaultReanalysisPolicy`)، `action=reanalyze` جدید، و GET `mode=real` برایِ ضمیمه‌کردنِ `reanalyze_status`. |
| `migrations/futures_reanalysis.sql` | **جدید، اجرا نشده.** دو جدولِ additive. |
| `scripts/futures-reanalysis-test.mjs` | **جدید.** ۳۰ تست (Pure + Orchestration + Structural). |
| `scripts/futures-real-execution-fault-test.mjs` | Extraction list/mockهایِ جدید برایِ توابعِ تازه (بدونِ تغییرِ رفتار). |
| `scripts/futures-liquidation-feasibility-test.mjs` | دو Regex اصلاح شد (فاصله‌یِ کدِ جدیدِ بینِ نشانه‌ها) — بدونِ تغییرِ ادعایِ خودِ تست. |
| `src/app/App.tsx` | دکمهٔ Re-Analyze + `ReanalyzeModal` (کاملاً جدید) + گسترشِ `interface CopyTrade`. |

## ۱۷. Remaining Risks — صادقانه

- **این فیچر هرگز رویِ حسابِ واقعی اجرا نشده** — فقط تستِ Mock/آفلاین.
- **مسیرِ اجرایِ Migration رویِ VPS هنوز تایید نشده** — همان شکافِ بازِ گزارشِ Liquidation Fix.
- **eligibility فعلاً Regime/Momentum را در چکِ ارزان لحاظ نمی‌کند** (فقط excursion/protection-status/staleness) — عمداً، برایِ صفر‌هزینه‌ماندنِ pre-check؛ خودِ Engine (وقتی واقعاً اجرا می‌شود) این‌ها را کامل می‌بیند، فقط به‌عنوانِ Trigger پیش از فراخوانی حساب نمی‌شوند.
- **کردیت مصرف نمی‌شود** — تصمیمِ صریح، ولی یعنی هزینهٔ AI Supervisorِ پولی برایِ AUTOِ پیش‌فرض‌روشن روی هر پوزیشنِ تازه، مستقیماً روی هزینهٔ زیرساختِ ادمین است، نه کاربر؛ در مقیاسِ بالا (کاربرانِ VIP زیاد) این می‌تواند قابلِ‌توجه شود — قبل از فعال‌سازیِ گسترده ارزیابیِ هزینه لازم است.
- **هیچ سقفِ کلیِ «حداکثر Re-Analysis در روز به‌ازایِ هر پوزیشن» وجود ندارد** — فقط سقفِ Stalenessِ ۲۴ساعته (که خودش یک Trigger است، نه یک محدودکننده). در بازارِ بسیار پرنوسان، تئوریاً می‌تواند در یک روز چند بار Eligible شود؛ رفتارِ واقعی هنوز رصد نشده.
- **افزودنِ ستونِ `reanalyze_status`یِ Batch به GET همه‌ی `mode=real`** یک کوئریِ اضافه (کوچک) به ازایِ هر بارِ بازکردنِ تبِ کپی‌ترید اضافه می‌کند — هزینه‌اش ناچیز است ولی اندازه‌گیری نشده.
- **دو تستِ Regressionِ ازقبل‌ناموفقِ بی‌ربط** (گزارشِ Phase A قبلی) هنوز در ریپو باقی‌اند — این پاس هم آن‌ها را لمس نکرد.

هیچ Push/Deploy/تغییرِ VPS/تغییرِ پوزیشنِ موجود در این کار انجام نشد.
