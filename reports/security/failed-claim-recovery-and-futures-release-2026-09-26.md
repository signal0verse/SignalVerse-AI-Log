# پایان بازیابی claim و انتشار رسمی Futures

## Metadata

- Date: 2026-09-26، زمان محلی Asia/Kuala_Lumpur؛ شواهد عملیاتی این گزارش به UTC در 2026-09-25 هستند.
- Module: Futures / Production release control.
- Mode: بازیابی محدود با اختیار تازهٔ مالک، انتشار رسمی دقیق، سپس ممیزی فقط‌خواندنی.
- Repository: signal0verse/signalverse-main
- Branch محلی ابزار: codex/failed-claim-recovery-20260926
- Starting commit: b2e52c197dec5936a8924b416a50bb064ff7a42d
- Recovery fix commit: 4a69dc69da70c9163d07ce86790749ac1efefd55
- Application target/runtime: 5eb6094658a692ba32687fccaa9759d20b68d6b5
- Remote main / workflow tooling: 10075341cdca3782cdd254d784afe39d818f7c0d
- Final status: FUTURES-PRODUCTION-RELEASE-PASS

## Executive result / Objective

نسخهٔ دقیق و قبلاً تأییدشدهٔ Futures از مسیر رسمی Production Release منتشر شد. مشکل claim مصرف‌ناپذیرِ تلاش ناموفق، با ابزار بررسی‌شده، قفل موجود، توقف و mask پایدار موقتِ admission و حفظ کامل شواهد حل شد. مجوز قدیمی بازیابی/استفادهٔ مجدد نشد؛ UUID آن tombstone دائمی دارد. یک مجوز تازه برای همان SHA و همان بایت‌های artifact صادر و فقط توسط مسیر رسمی مصرف شد.

این نتیجه، PASS انتشار و سلامت فنیِ مشاهده‌شده است؛ اثبات سودآوری، اثر AI Supervisor یا صحت lifecycle تازهٔ خصوصی صرافی نیست. گزارش 24h قدیمی با 186 ورودی کهنه همچنان FAIL تاریخی است و تغییر نکرد.

## Scope / authorization

مالک در ادامهٔ درخواست اصلاح و deploy، اختیار انجام مراحل اولویت‌دار تا پایان را داد. اجرای نگهداری که در دور قبل قبل از اجرا به علت مجوز متوقف شده بود، این بار با تأیید تازه انجام شد؛ کنترل مجوز دور زده نشد.

مجاز و اجراشده: توقف موقت فقط receiver انتشار، نگهداری دو unit و mask پایدار، retirement همان incident تحت flock، مجوز مستقل دقیق، بازگردانی همان unitها و receiver، dispatch رسمی همان target، بررسی فقط‌خواندنی بعدی.

ممنوع و انجام‌نشده: تغییر سورس برنامه/استراتژی/Spot، push مخزن برنامه/main، تغییر schema یا دادهٔ DB، migration مجدد، اقدام صرافی، معاملهٔ تست، مدیریت دستی پوزیشن، deployment جایگزین/دستی، تغییر کد receiver/helper/coordinator یا ضعیف‌کردن digest.

## Confirmed root causes / implementation

1. مشکل بسته‌بندی قبلی: CRLF در Windows در برابر LF artifact لینوکس. اصلاح نگهداری و استفادهٔ مجدد artifact قبلاً در main منتشر شده بود؛ این دور هیچ بسته‌سازی مجدد انجام نشد.
2. claim قدیمی همان SHA پس از ARTIFACT_SHA_MISMATCH باقی مانده بود؛ منقضی‌شدن approval به‌تنهایی claim را آزاد نمی‌کند. شواهد journal دقیقاً PASS سپس REJECT با consume=NOT_COMPLETED و activation=NOT_STARTED را ثابت کردند.
3. در پیش‌بررسی زندهٔ این دور، ابزار recovery به ARTIFACT_UNIT_UNCERTAIN متوقف شد، بدون تغییر claim. علت تأییدشده: systemd با LC_ALL=C برای واحد ناموفق قدیمی نشانگر ASCII ستاره چاپ می‌کند؛ parser قبلی فقط نشانگر Unicode را حذف می‌کرد و ستون‌ها جابه‌جا می‌شدند. واحد متعلق به SHA دیگری و آخرین شکست آن 2026-09-08 بود، PID صفر داشت و هیچ activation هدفی نبود.
4. اصلاح محلی محدود: درخواست صریح --plain برای list-units و کنترل سخت‌گیرانه نام unit و state. target حتی در حالت failed/inactive، واحد active/transitional، خروجی malformed و نشانگر باقی‌مانده همگی DENY می‌شوند. هیچ invariant برای سبزکردن تست حذف نشد.
5. فایل اصلاح‌شده در محل خصوصی نگهداری با نام نسخهٔ دوم ذخیره شد؛ نسخهٔ اول باقی است. hash نسخهٔ اجراشده:

```text
39f61e99b2fe7c3432b09218c0616a50a9168eea1084f2620814da983b217519
```

## Recovery evidence / chronology

- پیش‌بررسی تازهٔ DB/cache و runtime: 2026-09-25T18:50:37Z.
- receiver و artifact template زیر قفل موجود به‌صورت پایدار fenced شدند؛ main/admin/observer/PostgREST در این مرحله PID و restart count ثابت داشتند.
- نسخهٔ دوم پیش‌بررسی واقعی: RECOVERY-PREFLIGHT-PASS، changed=false.
- intent durable: 2026-09-25T18:55:38.301551596Z.
- tombstone durable: 2026-09-25T18:55:38.312551496Z.
- complete durable: 2026-09-25T18:55:38.523549558Z.
- اجرای retirement: NEW-APPROVAL-ELIGIBLE، changed=true، oldUuidReplayable=false.
- تکرار بلافاصله پیش از صدور مجوز جدید: همان state، changed=false. idempotency زنده تأیید شد.
- دو فایل اصلیِ approval/claim از مسیر فعال فقط توسط پروتکل retirement بازنشسته شدند، نه حذف دستی موردی. بایت‌های کامل هر دو همراه metadata و proof در intent نگهداری شدند.
- evidence و tombstone: root:root، mode 0400، پوشه‌های خصوصی؛ این immutability تحت مدل trusted-root است، نه WORM سخت‌افزاری.
- backup unitها در control-backups/failed-claim-20260926-reviewed نگهداری شد؛ پس از بازیابی دقیقاً همان بایت‌ها بازگردانده شدند.
- receiver در 2026-09-25T18:57:28Z شروع و TCP readiness در 18:57:29Z تأیید شد؛ runtime برنامه هنوز b3195f بود.

```text
OLD_UUID = 3bbbf63d-65c1-45c2-82d1-7be1943c7f52
OLD_APPROVAL_AND_CLAIM_SHA256 = 663b42664e1695ce1ca800e01b46a6bf6e8261ae54d9a9d9ffeb8c44c83af1cb
INTENT_SHA256 = 2016042d7cadd166d94179851d0529a6cb240c7a609ef8710d2cac8b04488bc9
COMPLETE_SHA256 = ac9482c623297f4cce7ec0d6aaa2d1311d78cb1174c2cd57bc676ba33436d71f
TOMBSTONE_SHA256 = b021c0d230a37915a4a509cd84722c3f3ae2e7fecda71ed5240bad4bf7e78fcc
```

## Crash / concurrency model

Admission با توقف کامل receiver و mask پایدار receiver/template بسته شد؛ فقط coordinator flock کافی فرض نشد. نبود socket/process/queued target unit/consume/target build و هویت runtime در پیش‌بررسی و مرزهای لازم کنترل شد. قفل موجود با هویت inode ثابت نگه داشته شد. شواهد کامل ابتدا fsync شد؛ revocation پیش از retirement دو مسیر نوشته شد؛ پس از بازبینی میزبان رسید eligibility نوشته شد. replay UUID قدیمی به revocation می‌خورد. تست‌های قطع process و reboot قبلی در VM ایزوله انجام شده‌اند؛ قطع برق فیزیکی یا مقابله با root مخرب ادعا نمی‌شود.

## Independent artifact and new authorization

```text
TARGET_SHA = 5eb6094658a692ba32687fccaa9759d20b68d6b5
TARGET_CI_RUN = 36152392768
TARGET_CI = main / push / completed / success
PREPARATION_RUN = 36164169421
ARTIFACT_ID = 10875754793
ARTIFACT_BYTES = 3950488
INNER_ARCHIVE_SHA256 = 5a25a166cca27eadaf8281ea783d1cb91cf12e50f62dfb431bfcdb99b683c8be
RETAINED_ZIP_SHA256 = 10619be293e249c61c23f85fc4aac5b0eb3622e3467b738e7a295dd8ea51439e
ARTIFACT_EXPIRY = 2026-10-25T16:58:43Z
NEW_GUARD_UUID = 4b6f95a5-5900-4db8-a17e-5864c0bc3937
ISSUED_AT = 2026-09-25T18:57:13Z
EXPIRES_AT = 2026-09-25T19:57:13Z
NEW_MANIFEST_SHA256 = 7a3cb60fc0f3a5d9b49b3d50862f68bbdb9042decca999bb984731d41e666ed3
```

API رسمی GitHub run/artifact دوباره خوانده شد؛ فایل محلی نگهداری‌شده، metadata و embedded commit با verifier موجود تأیید شدند. مجوز خارج از HTTP/CI، با ساخت exclusive و fsync، root:root 0600 و دقیقاً شش field موردقبول helper ایجاد شد. helper نصب‌شده inspectApproval آن را بدون claim/consume معتبر دانست. سازوکار موجود امضای جداگانه ندارد؛ امنیت بر مالکیت root، ایجاد خارج از CI، محدودیت زمان و binding دقیق است.

وضعیت نهایی مجوز تازه: مصرف‌شده توسط coordinator رسمی؛ claim فعال هدف دیگر وجود ندارد؛ consumed record همان hash manifest را دارد. eligibility مربوط به پیش از صدور مجوز بود و اجازهٔ مجوز تکراری بعدی نیست. UUID قدیمی همچنان revoked است.

## Official release / build result

[Production Release run 36176740596](https://github.com/signal0verse/signalverse-main/actions/runs/36176740596)

- dispatch: 2026-09-25T18:58:00Z؛ main، workflow_dispatch.
- workflow tooling head: 10075341cdca3782cdd254d784afe39d818f7c0d؛ input application SHA دقیقاً 5eb609 است. این دو هویت عمداً متفاوت‌اند.
- exact target CI، lineage، retained artifact provenance، download و byte/metadata/embedded-commit verification همگی success.
- receiver PASS: 18:58:18.722Z.
- receiver CLAIMED / QUEUED: 18:58:19.195Z.
- coordinator consume PASS: 18:59:36.588212Z.
- main/admin/observer فقط توسط activation رسمی در 18:59:36Z restart شدند.
- marker publish mtime: 18:59:38.424333488Z.
- deploy_activation PASS: 18:59:38.431658Z.
- delivery step success: 18:59:40Z؛ job complete: 18:59:43Z؛ run completed success: 18:59:44Z.
- web/admin build و API bundleها توسط coordinator رسمی ساخته شدند؛ archive تحویلی دوباره بسته‌بندی نشد. ساخت dist/runtime از سورس، تغییر byte stream ورودی Guard نیست.
- unit انتشار نهایی inactive/dead، PID 0، Result=success، ExecMainStatus=0، NRestarts=0. systemd پس از unload بعضی زمان‌های Exec را خالی گزارش کرد؛ زمان فعال‌سازی از journal مستقل خوانده شد.

در startup رسمی یک curl exit 7 قبل از آماده‌شدن پورت main ثبت شد. coordinator از قبل readiness loop محدود 120ثانیه‌ای دارد؛ probe بعدی موفق و activation PASS شد. این مورد با شکست تست قدیمیِ بدون انتظار تفاوت دارد و به‌عنوان crash پنهان یا گزارش نشده تلقی نشد.

## Read-only post-deploy verification

ممیزی کامل 2026-09-25T19:02:33Z و تکرار وضعیت و journal تا 19:03:08Z:

```text
DEPLOYED_MARKER = 5eb6094658a692ba32687fccaa9759d20b68d6b5
APP_LINK = /opt/signalverse/releases/5eb6094658a692ba32687fccaa9759d20b68d6b5
ADMIN_LINK = /opt/signalverse-admin/releases/5eb6094658a692ba32687fccaa9759d20b68d6b5
PROCESS_CWD = target release for main/admin/observer
SOURCE_ARCHIVE_FILES_COMPARED = 574
SOURCE_MISMATCHES = 0
DELIVERED_ARCHIVE_SHA256 = 5a25a166cca27eadaf8281ea783d1cb91cf12e50f62dfb431bfcdb99b683c8be
```

| سرویس | PID پیش از نگهداری | PID نهایی | وضعیت | NRestarts |
| --- | ---: | ---: | --- | ---: |
| main | 2177526 | 2211145 | active/running | 0 |
| admin | 2177522 | 2211141 | active/running | 0 |
| observer | 2177519 | 2211139 | active/running | 0 |
| PostgREST | 1960930 | 1960930 | active/running | 0 |
| Guard receiver | 2166041 | 2210596 | active/running | 0 |

NRestarts صفر به‌تنهایی عدم restart دستی را ثابت نمی‌کند؛ journal systemd مستقل فقط restart موردانتظار activation رسمی را برای سه سرویس برنامه نشان داد. هیچ loop مشاهده نشد. PostgREST PID و start monotonic ثابت بود.

Health داخلی main، public-info و admin همگی HTTP 200. admin مقدار releaseSha دقیق و authReady/staticReady/snapshotReady/databaseReady=true داشت. health عمومی و صفحه اصلی از میزبان کاربر و curl سرور HTTP 200 دادند.

در نخستین probe، urllib پایتون به health عمومی پشت Cloudflare پاسخ 403 گرفت، درحالی‌که health داخلی پاس بود. این شکست پنهان نشد: curl عادی همان URL از دو میزبان 200 گرفت. علت دقیق policy شبکه/Cloudflare احراز نشد؛ هیچ تنظیمی تغییر نکرد و از آن 403 نتیجهٔ crash برنامه گرفته نشد.

GET بدون احراز هویت به چهار مسیر محدود copytrade برای Binance/MEXC/Gate inputs و pending-list، HTTP 401 موردانتظار داد. source handler قبلاً بازبینی شد: این درخواست‌ها پیش از دریافت دادهٔ بازار/حساب رد می‌شوند. این فقط اثبات بارگذاری و مرز auth مسیر است، نه اجرای تحلیل معتبر یا معامله.

در bundle فعال، computeFuturesDecision، fetchGateFuturesObserverWindow، selectClosedNativeFuturesCandles، composeFuturesEconomics و سه handler ورودی بومی Binance/MEXC/Gate موجود بودند. همراه تطابق 574 فایل و process provenance، سیم‌کشی نسخهٔ هدف تأیید شد؛ هیچ چرخهٔ صرافی ساخته نشد.

### Schema/cache

DB همان signalverse_cutover2 است. بررسی در تراکنش READ ONLY با timeout محدود و ROLLBACK:

- copy_trades موجود؛ economics نوع jsonb و nullable.
- CHECK با نام copy_trades_economics_contract_v1 موجود و validated.
- تعریف CHECK و comment پیش/پس یکسان.
- authenticated OpenAPI HTTP 200 و economics visible.
- SELECT فقط economics با limit=0: HTTP 200 و صفر ردیف.
- migration اجرا/تکرار نشد؛ coordinator بررسی‌شده مسیر SQL migration ندارد.

این بررسی تغییرنکردن object اقتصادیِ موردنیاز و نبود DDL/DML صادرشده توسط این کار را ثابت می‌کند؛ ادعای snapshot کامل تمام schema یا بی‌تغییری فعالیت عادی DB برنامه نیست.

### Installed Guard integrity

receiver/helper/coordinator و دو unit پس از انتشار hash قبلی را داشتند:

```text
receiver = c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa
helper = acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83
coordinator = 572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec
receiver unit = 7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1
artifact unit = 1a95022b391deba37bb3b161c6526fc4423f6966904177a8653e5284e52d82a4
```

## Tests executed

- این دور: python -B scripts/failed_claim_recovery_test.py؛ 34 مورد، 33 PASS و 1 skip صریح POSIX در Windows؛ exit 0، 12.748 ثانیه. case تازه parse خروجی plain و DENY برای حالت target/active/malformed را پوشش می‌دهد.
- git diff --check: PASS.
- syntax ابزارهای محدود operator و verifier با ast.parse: PASS.
- خروجی واقعی Linux با/بدون --plain مقایسه شد؛ default preflight واقعی PASS، سپس recovery و idempotent repeat PASS.
- verifier موجود artifact: SHA/digest/metadata/embedded commit PASS؛ بدون package.
- شواهد قبلیِ هستهٔ recovery، نه اجرای مجدد در این دور: Linux NIC-less VM، 33/33 regression و 29/29 supplemental PASS و reboot persistence PASS. case تازهٔ parser در VM مجدداً اجرا نشد؛ Windows regression و read-only Linux live preflight اجرا شد.
- regression بزرگ Futures قبلاً در target/CI تأیید شده بود؛ این دور همهٔ suiteهای استراتژی دوباره اجرا نشدند. هیچ fixture روی Production اجرا نشد.

## Files inspected / changed / Git status

بازبینی‌ها: recovery Python و تست/README؛ HANDOFF؛ CLAUDE؛ runbook؛ workflow رسمی release؛ verifier artifact؛ helper و coordinator نصب‌شده؛ unit/journal/stateهای دقیق؛ copytrade source/auth guards؛ admin health؛ public-info؛ source/bundleهای release؛ schema/cache؛ GitHub run/artifact/main metadata.

تغییرات committed محلی:

- ops/recovery/failed_claim_recovery.py
- scripts/failed_claim_recovery_test.py
- ops/recovery/README.md
- HANDOFF.md و همین گزارش در commit مستندات جداگانه.

ابزارهای محدود و خارج از git زیر tmp/recovery-linux-validation-20260926 برای fence/restore، صدور مجوز و ممیزی فقط‌خواندنی باقی ماندند. این‌ها مسیر deployment جایگزین نیستند؛ برنامه فقط با workflow رسمی فعال شد. تغییرات نامرتبط و گزارش untracked قبلی دست‌نخورده ماندند.

هیچ push به مخزن برنامه انجام نشد؛ remote main همچنان 100753 است. گزارش پاک‌سازی‌شده تنها به SignalVerse-AI-Log/master ارسال می‌شود و remote content/hash مستقلاً کنترل می‌شود؛ SHA انتشار گزارش در پاسخ نهایی درج می‌شود.

## Remaining issues / limitations / next step

- blocker بسته‌بندی/claim برای همین release حل و انتشار انجام شد؛ هیچ release/approval تکراری لازم نیست.
- بهبود پایدار سودآوری و برتری AI Supervisor هنوز اثبات نشده است.
- native protection و fresh Real accounting برای Binance/MEXC بدون lifecycle واقعی واجدشرایط، NATURALLY PENDING باقی‌اند؛ معامله برای بستن gate ساخته نشد.
- Shadow 24h ناموفق قبلی تغییر/پاک/بازطبقه‌بندی نشد؛ این انتشار آن تست را به PASS تبدیل نمی‌کند.
- GitHub Environment reviewer policy در این کار تغییر نکرد؛ نبود/نیاز reviewer مستقل، موضوع سیاست دسترسی جداگانه است، نه نتیجهٔ کیفیت استراتژی.
- هیچ schema/account-wide snapshot یا ممیزی تراکنش‌های عادی هم‌زمان اجرا نشد. صفر سفارش/پوزیشن در زیر به اقدامات خود این عملیات اشاره دارد، نه تضمین توقف فعالیت طبیعی برنامه.
- قدم بعدی مرتبط با استراتژی، جمع‌آوری شواهد طبیعی نسخهٔ تازه و مقایسهٔ هم‌شرایط کیفیت تصمیم/ریسک و accounting است؛ در این کار آغاز نشد.

## Explicit final accounting

```text
FINAL_STATUS = FUTURES-PRODUCTION-RELEASE-PASS
RELEASE_EXECUTED = YES (official workflow only)
DEPLOYMENT = YES (exact 5eb6094658a692ba32687fccaa9759d20b68d6b5)
CLAIM_RECOVERY_EXECUTED = YES (fresh owner authorization)
OLD_CLAIM_REUSED = NO
OLD_EVIDENCE_PRESERVED = YES
OLD_UUID_REPLAYABLE = NO
NEW_APPROVAL_CREATED = YES (one; now consumed by official coordinator)
ARTIFACT_REBUILT = NO
GUARD_CODE_CHANGED = NO
APPLICATION_SOURCE_CHANGED_DURING_THIS_TASK = NO
STRATEGY_EDITED_DURING_THIS_TASK = NO
SPOT_EDITED_DURING_THIS_TASK = NO
MAIN_PUSH = NO
DATABASE_DDL = NO
DATABASE_DML_BY_THIS_TASK = NO
MIGRATION_REAPPLIED = NO
POSTGREST_RESTART = NO
ORDERS_BY_THIS_TASK = 0
POSITIONS_MODIFIED_BY_THIS_TASK = 0
EXCHANGE_ACTIONS_BY_THIS_TASK = 0
IMPROVEMENT_PROVEN = NO
UNEXPECTED_RELEASE_CHANGES_OBSERVED = NO
```
