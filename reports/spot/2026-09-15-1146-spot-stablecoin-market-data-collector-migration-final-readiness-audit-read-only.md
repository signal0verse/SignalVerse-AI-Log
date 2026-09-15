# Stablecoin Market Data Collector — Final Migration Readiness Audit Against Live Production Schema (Read-Only)

## Metadata

- Date: 2026-09-16 (session continued)
- Task ID: (none assigned by user)
- Module: spot (Historical Stablecoin Market Observation Dataset — Phase 2/2.1 Collector)
- Mode: **Final read-only readiness audit** — comparing the prepared, unexecuted migration against the REAL, live production schema of `stablecoin_pair_snapshots`, column-by-column. Zero code changes, zero migration execution, zero database writes of any kind (only `SELECT`/`\d`/`pg_constraint`/`information_schema` reads), zero commit/push/deploy, zero scheduler changes.
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e
- Ending commit: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e (**unchanged**)
- Production: VPS `13.140.149.56` (SSH port `22123`), database `signalverse_cutover2`, PostgreSQL 17.11

## Objective

Verify, against the **actual live production schema** (not assumptions), that the Phase 2.1 migration is byte-for-byte additive, introduces zero naming/type conflicts, matches the collector's own field names exactly, and is genuinely safe to run — then give one explicit verdict: `READY`, `READY AFTER FIX`, or `NOT READY`.

---

## الف) آیا `stablecoin_pair_snapshots` در Production از قبل وجود دارد؟

**بله.** خروجیِ مستقیمِ `\d stablecoin_pair_snapshots` رویِ دیتابیسِ واقعیِ Production:

```
                      Table "public.stablecoin_pair_snapshots"
    Column     |           Type           | Collation | Nullable |      Default
---------------+--------------------------+-----------+----------+-------------------
 id            | uuid                     |           | not null | gen_random_uuid()
 pair          | text                     |           | not null |
 bid           | numeric                  |           |          |
 ask           | numeric                  |           |          |
 fee_verified  | boolean                  |           | not null | false
 liquidity_usd | numeric                  |           |          |
 captured_at   | timestamp with time zone |           | not null | now()
Indexes:
    "stablecoin_pair_snapshots_pkey" PRIMARY KEY, btree (id)
    "idx_stablecoin_pair_snapshots_lookup" btree (pair, captured_at DESC)
```

## ب) تمامِ ستون‌هایِ فعلی (استخراج‌شده، نه فرض‌شده)

دقیقاً **۷ ستون**: `id, pair, bid, ask, fee_verified, liquidity_usd, captured_at` — عیناً همان چیزی که Migrationِ اولیه (`migrations/stablecoin_engine.sql`) ساخته بود، بدونِ هیچ تغییرِ دستیِ اضافه‌ای در Production.

## ج) نوعِ داده، Nullable، Default، Constraint، Index

| ستون | نوع | Nullable | Default |
|---|---|---|---|
| id | uuid | خیر | `gen_random_uuid()` |
| pair | text | خیر | — |
| bid | numeric | **بله** | — |
| ask | numeric | **بله** | — |
| fee_verified | boolean | خیر | `false` |
| liquidity_usd | numeric | **بله** | — |
| captured_at | timestamptz | خیر | `now()` |

**Constraintها** (از `pg_constraint`، مستقیماً از Production): **فقط یک مورد** — `stablecoin_pair_snapshots_pkey PRIMARY KEY (id)`. هیچ Check Constraint، هیچ Unique Constraintِ دیگر، هیچ Foreign Key.

**Indexها**: `stablecoin_pair_snapshots_pkey` (PK, بر رویِ `id`) + `idx_stablecoin_pair_snapshots_lookup` (btree، غیرِیکتا، بر رویِ `(pair, captured_at DESC)`).

**Grants** (از `information_schema.role_table_grants`): `service_role` از قبل `SELECT, INSERT, UPDATE, DELETE` دارد — دقیقاً همان چیزی که Collector نیاز دارد؛ Migrationِ جدید هیچ `GRANT` اضافه‌ای نیاز ندارد (و ندارد).

**نسخه‌یِ PostgreSQL**: `17.11` — پشتیبانیِ کاملِ `ADD COLUMN IF NOT EXISTS` (از نسخه‌یِ ۹.۶) و `CREATE UNIQUE INDEX IF NOT EXISTS` (از نسخه‌یِ ۹.۵) تأییدشده، بدونِ هیچ نگرانیِ سازگاریِ نحوی.

---

## د) مقایسه‌یِ Column-by-Column: Migration در برابرِ Schemaِ واقعیِ Production

Migrationِ پیشنهادی **۴۱ ستونِ جدید** اضافه می‌کند (شمارشِ دقیق از رویِ فایل). **هیچ‌کدام از این ۴۱ نام با هیچ‌کدام از ۷ ستونِ موجود همپوشانی ندارد** — بررسیِ کاملِ اسمی انجام شد، صفر برخورد:

| دسته | تعداد | نمونه |
|---|---|---|
| فیلدهایِ پایه‌یِ بازار | ۱۴ | `symbol_status, best_bid_qty, best_ask_qty, mid_price, spread_bps, bid/ask_depth_5, bid/ask_depth_20, imbalance_5, imbalance_20, bid/ask_depth_concentration, deviation_bps, fee_bps` |
| Executable Liquidity (۴ اندازه × ۲ جهت × ۳ فیلد) | ۲۴ | `exec_buy_1000_usd, exec_buy_1000_vwap, exec_buy_1000_fully_filled, ...` |
| فراداده | ۲ | `raw_top20_levels (jsonb), collector_version (text)` |
| **جمع** | **۴۱** | — |

چون هیچ‌کدام از این ۴۱ ستون از قبل در Production وجود ندارد، **هر ۴۱ عبارتِ `ADD COLUMN IF NOT EXISTS` واقعاً یک ستونِ جدید اضافه می‌کند** — هیچ‌کدام یک No-op خاموش نیست، و هیچ‌کدام باعثِ تعارضِ نام/نوع نمی‌شود.

---

## هـ) هماهنگیِ اصلاحِ Phase 2.1 (`depth_concentration` → `bid/ask_depth_concentration`)

**تأییدشده، کاملاً هماهنگ در هر سه لایه:**

۱. **Migration**: خطِ `ADD COLUMN IF NOT EXISTS depth_concentration` هرگز اجرا نشده بود (چون کلِ Migration هرگز اجرا نشده)، پس هیچ ستونِ قدیمی‌ای در Production برایِ حذف/تغییرِنام وجود ندارد — نسخه‌یِ فعلیِ فایل مستقیماً `bid_depth_concentration`/`ask_depth_concentration` را تعریف می‌کند، بدونِ هیچ اثرِ جانبی.
۲. **Collector**: `buildSnapshotRow()` دقیقاً `bid_depth_concentration: computeDepthConcentration(ob.bids, 20)` و `ask_depth_concentration: computeDepthConcentration(ob.asks, 20)` را مستقل محاسبه و در ردیف قرار می‌دهد — نامِ فیلد در کد **حرف‌به‌حرف** با نامِ ستون در Migration یکسان است.
۳. **Test**: `scripts/stablecoin-market-data-collector-test.mjs` (بخشِ C) هردو فیلد را جداگانه، با سناریویِ Asymmetric، تست می‌کند و صریحاً تأیید می‌کند نامِ قدیمیِ تک‌ستونی دیگر در کد ظاهر نمی‌شود.

هیچ ناهماهنگی یافت نشد.

---

## و) آیا Migration واقعاً Additive و Safe است؟

**بله.** هر ۴۱ عبارت دقیقاً `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...` است — هیچ `DROP`, `ALTER COLUMN TYPE`, `RENAME`, یا `NOT NULL` جدید (که می‌توانست رویِ ردیف‌هایِ فرضیِ موجود شکست بخورد) وجود ندارد. تنها عبارتِ غیرِ`ADD COLUMN`، `CREATE UNIQUE INDEX IF NOT EXISTS idx_stablecoin_pair_snapshots_unique_tick ON (pair, captured_at)` است — این هم صرفاً یک Index جدید می‌سازد، هیچ داده‌ای را نمی‌خواند/نمی‌نویسد/تغییر نمی‌دهد.

## ز) آیا اجرایِ Migration ممکن است Duplicate Column/Index یا Constraint Conflict ایجاد کند؟

**خیر.** طبقِ بخشِ «د»، صفر برخوردِ نام با ستون‌هایِ موجود. نامِ Indexِ جدید (`idx_stablecoin_pair_snapshots_unique_tick`) **متفاوت** از نامِ Indexِ موجود (`idx_stablecoin_pair_snapshots_lookup`) است — هیچ برخوردِ نامِ Index هم وجود ندارد. هیچ Constraintِ دیگری در Production نیست که با یک Unique Indexِ جدید تداخل کند.

## ح) آیا `stablecoin_pair_snapshots` در Production واقعاً خالی است؟

**بله، دقیقاً صفر ردیف** — تأییدشده با یک کوئریِ مستقیمِ Read-Only:

```sql
SELECT count(*) AS row_count, min(captured_at), max(captured_at) FROM stablecoin_pair_snapshots;
-- row_count=0, min/max=NULL
```

## ط) اگر داده‌ای وجود داشت...

موردی ندارد — جدول کاملاً خالی است (بخشِ ح). هیچ داده‌ای خوانده، تغییر داده، یا حذف نشد.

## ی) Index/Uniqueness موردنیاز در برابرِ هدفِ Phase 1/2

طرحِ Phase 1 (`(pair, captured_at)` به‌عنوانِ کلیدِ یکتایِ منطقی) دقیقاً همان چیزی است که Migration اضافه می‌کند. Indexِ موجودِ `idx_stablecoin_pair_snapshots_lookup` (غیرِیکتا، `DESC`) برایِ Range Queryهایِ آینده (Calibration/Replay) نگه داشته می‌شود؛ Indexِ جدید (یکتا، `ASC`) مسئولِ جلوگیریِ Duplicate است. این دو Index **هم‌زیستیِ کاملاً بی‌مشکل** دارند (Postgres چند Index رویِ همان ستون‌ها را بدونِ محدودیت می‌پذیرد).

## ک) Timestamp Uniqueness و ترتیبِ زمانی

Unique Indexِ `(pair, captured_at)` یک **کلیدِ ترکیبی** است — دو Pairِ متفاوت هرگز باهم تداخل نمی‌کنند، حتیٰ اگر Timestampِ آن‌ها میلی‌ثانیه‌ای برابر باشد. طبقِ اصلاحِ Phase 2.1 (تأییدشده با Smoke Testِ زنده، گزارشِ قبلی)، هر Pair یک `captured_at` واقعاً مجزا و اختصاصیِ خودش می‌گیرد — این دقیقاً با معناییِ Unique Indexِ ترکیبی سازگار است، نه در تعارض.

## ل) آیا Migration ۱۰۰٪ Contract-Compatible با Collector است؟

**بله، تأییدِ حرف‌به‌حرف انجام شد:** نامِ هر ۴۱ ستون در Migration با نامِ فیلدِ متناظرش در `SnapshotRow`/`buildSnapshotRow()` (`api/stablecoin-market-data-collector.ts`) مقایسه شد — **صفر اختلافِ نام‌گذاری**. اندازه‌هایِ Notional در کد (`[1000, 2500, 5000, 10000]`) دقیقاً با نام‌هایِ ستونِ `exec_buy_{size}_*`/`exec_sell_{size}_*` در Migration یکی است.

## م) آیا Migration چیزی خارج از این Dataset تغییر می‌دهد؟

**خیر.** هر یک از ۴۲ عبارتِ SQL در فایل (۴۱ `ADD COLUMN` + ۱ `CREATE INDEX`) دقیقاً `stablecoin_pair_snapshots` را هدف قرار می‌دهد — هیچ ارجاعی به `stablecoin_pair_allocations`, `stablecoin_demo_inventory`, `stablecoin_demo_trades`, `stablecoin_cycle_decisions`, یا هر جدولِ دیگری وجود ندارد.

---

## نیازمندیِ Backup (بدونِ اجرا در همین مرحله)

طبقِ قاعده‌یِ ثابتِ خودِ پروژه (`CLAUDE.md`: «بک‌آپِ دیتابیس قبل از هر تغییرِ دیتابیسی: `npm run backup`»)، این یک **الزامِ استانداردِ از‌قبل‌موجود** است، مستقل از ریسکِ خاصِ این Migration — باید **قبل از** اجرایِ این (یا هر) Migration اجرا شود. با توجه به اینکه جدول اکنون صفر ردیف دارد، نقشِ Backup اینجا کمتر «بازیابیِ داده‌یِ ازدست‌رفته‌یِ همین جدول» و بیشتر «نقطه‌یِ بازگشتِ کلِ دیتابیس، طبقِ رویه‌یِ همیشگی» است — این تفاوت اهمیتِ Backup را کم نمی‌کند، فقط دلیلِ آن را برایِ این موردِ خاص روشن می‌کند. **این مرحله هیچ Backupی اجرا نکرد** — فقط الزامش مستند شد.

---

## نتیجه‌یِ Compatibility

| بررسی | نتیجه |
|---|---|
| نام‌گذاریِ ستون (Migration ↔ Collector) | ✅ ۱۰۰٪ مطابق |
| نوعِ داده (Migration ↔ نیازِ Collector) | ✅ مطابق (`numeric` برایِ اعداد، `boolean` برایِ Fully-Filled، `jsonb` برایِ Raw Levels، `text` برایِ Status/Version) |
| برخوردِ نامِ ستون با Schemaِ موجود | ✅ صفر برخورد |
| برخوردِ نامِ Index | ✅ صفر برخورد |
| Constraint Conflict | ✅ هیچ Constraintِ دیگری در Production نیست که تداخل کند |
| Additivity | ✅ فقط `ADD COLUMN IF NOT EXISTS` + یک `CREATE INDEX IF NOT EXISTS` |
| تأثیر بر داده‌یِ موجود | ✅ بدونِ اثر (جدول صفر ردیف دارد؛ حتیٰ اگر نداشت، هیچ عبارتی داده‌یِ موجود را نمی‌خواند/نمی‌نویسد) |
| تأثیر بر جداولِ دیگر | ✅ صفر |
| سازگاریِ نسخه‌یِ PostgreSQL | ✅ کاملاً پشتیبانی‌شده (۱۷.۱۱) |

## Conflict/Risk

**هیچ Conflict یا Riskِ فنی یافت نشد.** تنها موردِ عملیاتی (نه فنی)، الزامِ استانداردِ Backupِ پیش‌ازِ Migration است که بالاتر مستند شد.

## Required Fixes

**هیچ‌کدام.** فایلِ Migration، فایلِ Collector، و فایلِ تست هر سه از نظرِ محتوا بدونِ نیاز به هیچ تغییرِ اضافه، آماده‌یِ اجرا هستند.

---

## Production Safety

Zero database writes of any kind in this task (only `\d`, `pg_constraint`, `information_schema.role_table_grants`, `SELECT count/min/max`, and `SELECT version()` — all pure reads). Zero migration executed. Zero tables/columns/indexes/constraints created, dropped, or altered. Zero commits, pushes, PRs, or deploys. Zero scheduler/job changes. `signal0verse/signalverse-main` remains at commit `c497c6b`, unchanged; no project file was modified by this audit.

---

## FINAL STATUS TABLE

```
PRODUCTION TABLE EXISTS: YES (7 original columns, exactly as expected)
PRODUCTION ROW COUNT: 0 (confirmed via direct read-only query)
PRODUCTION CONSTRAINTS: 1 (primary key on id) - no other constraint exists
PRODUCTION INDEXES: 2 (pkey + the original non-unique (pair, captured_at DESC) lookup index)
PRODUCTION GRANTS: service_role already has full SELECT/INSERT/UPDATE/DELETE - no new GRANT needed
POSTGRESQL VERSION: 17.11 - full syntax compatibility confirmed
MIGRATION NEW COLUMNS: 41, zero name collisions with the 7 existing columns
MIGRATION NEW INDEX: 1 (unique, differently named from the existing index - zero collision)
PHASE 2.1 FIX (bid/ask_depth_concentration) COMPATIBILITY: 100% - migration, collector, and test all match
  exactly, verified field-by-field
COLUMN-BY-COLUMN NAME MATCH (migration <-> collector SnapshotRow): 100%, including all 24 dynamically-named
  exec_buy_{size}_*/exec_sell_{size}_* columns
OUT-OF-SCOPE TABLES TOUCHED BY MIGRATION: 0
BACKUP REQUIREMENT: YES, per standing project policy - NOT executed in this task, only documented as required
  before the migration is ever applied
CONFLICTS FOUND: NONE
RISKS FOUND: NONE (technical) - only the standard backup-before-migration operational step, already policy
REQUIRED FIXES: NONE
CODE CHANGED: NO
MIGRATION EXECUTED: NO
DATABASE WRITE: NO
COMMIT/PUSH/DEPLOY: NO
SCHEDULER CHANGED: NO
```

## نتیجه‌یِ نهایی

```
READY
```

Migration از نظرِ ساختاری، نام‌گذاری، سازگاریِ نوعِ داده، و عدمِ تداخل با Schemaِ واقعیِ Production **کاملاً آماده‌یِ اجراست**. تنها پیش‌نیازِ باقی‌مانده، اجرایِ `npm run backup` بلافاصله پیش از اجرایِ Migration است — طبقِ رویه‌یِ همیشگیِ پروژه، نه به‌دلیلِ یافتنِ ریسکِ خاصی در همین Migration.
