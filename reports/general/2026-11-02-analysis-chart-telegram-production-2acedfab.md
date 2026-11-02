# Real engine chart and admin Telegram analysis — production release verified

Date: 2026-11-02 (Asia/Kuala_Lumpur). Operational times below are UTC.
Result: ANALYSIS-CHART-TELEGRAM-PRODUCTION-RELEASE-PASS.

## Executive result

The normal analysis page now serves the native daily/weekly evidence chart from
the real engine result. The existing in-app Telegram admin panel contains manual
symbol analysis/preview, explicit chart publication, selected-symbol daily
publication controls, language selection, history and frozen public chart links.
The daily Telegram publisher remains OFF and unconfigured. No message was sent
to a real channel for acceptance. The owner can select coins/languages and enable
daily publication in that existing panel.

The release used the original CI, immutable artifact preparation, independent
one-use Guard and official production release workflow. No application copy,
alternate activation, repackaging, forced push or history rewrite was used.

```text
REVIEWED_BASE=ada0d1ec0571d7a5537833043be2158b8313bac0
EXECUTABLE_MAIN=2acedfab056262f0157d8b6b9a9ecea447ff2fdf
ACTIVE_RUNTIME_BEFORE=51018151e58ed8e23c6b5dbe2081fee0f69ff1ca
ACTIVE_RUNTIME_AFTER=2acedfab056262f0157d8b6b9a9ecea447ff2fdf
CI_RUN=41348038175
CI_EVENT=push
CI_BRANCH=main
CI_RESULT=SUCCESS / 79 success / 0 failure / 0 skipped
ARTIFACT_PREPARE_RUN=41371413496
ARTIFACT_PREPARE_RESULT=SUCCESS / 10 success
ARTIFACT_ID=13109695186
EMBEDDED_COMMIT=2acedfab056262f0157d8b6b9a9ecea447ff2fdf
ARCHIVE_BYTES=8346920
OUTER_ZIP_SHA256=2adf5792de891746a97cba487cf75bb00cf8608bc5175ec0fd6052ae955ce187
INNER_RELEASE_SHA256=38bb74a41e9584085f92a2d6882a2b0710fe172ad73ec3979ba49375134ff760
RELEASE_RUN=41372333200
RELEASE_RESULT=SUCCESS
RELEASE_STEPS=11 success / 0 failure / 0 skipped
DELIVERY_WINDOW=2026-11-02T01:26:23Z .. 2026-11-02T01:27:56Z
RELEASE_JOB_COMPLETED=2026-11-02T01:28:02Z
RUNTIME_VERIFIED_AT=2026-11-02T01:31:55.743819+00:00
MAIN_LAST_RECHECKED_AT=2026-11-02T01:35:38.635338+00:00
```

Authoritative runs:
[Production CI](https://github.com/signal0verse/signalverse-main/actions/runs/41348038175),
[artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/41371413496),
[official release](https://github.com/signal0verse/signalverse-main/actions/runs/41372333200).

## Source preservation and behavior

The other chat's completed main was preserved as the exact reconstruction base
above. The executable delta is exactly 63 reviewed paths, listed below. The final
normal fast-forward was from 293312eec7c8f4a8ecf1f07d6772440f273842df to the
released commit. The isolated release checkout has no tracked changes; generated
output remains untracked and was preserved. The original dirty preview checkout
and primary checkout were preserved, with no reset, clean or automatic stash.

Retained rollback branches preserve the reviewed base and old executable:
`codex/rollback-analysis-telegram-main-20261102` and
`codex/rollback-analysis-telegram-runtime-20261102`.

The chart reuses the native closed-candle engine evidence, with seven timeframe
inputs and daily/weekly display. Zones, patterns, channels and RSI evidence carry
their source context and reasons. Conditional demand/supply regions do not imply
an executed buy or engine-approved entry. A preliminary OPEN with ENGINE_WAIT
remains WAIT in the chart, caption and PNG. Engine policy, risk, SL/ONE-TP,
execution, scanner configuration, Fast Trader, Spot trading behavior and PP
execution were not changed. The floating help knowledge was updated.

The public post route returns a curated immutable snapshot after publication;
it excludes customer holdings, accounts, credits and private AI/session data.
Manual analysis requires the existing owner/full delegation or both settings
and Telegram image-post permissions. Suspended, Partner and ordinary users are
denied. The cron uses the existing nonempty bearer secret. There is no new
scheduler or worker: the existing run-alerts hook is independently gated by the
new daily configuration.

The durable request key, build token/CAS, immutable READY snapshot and per-channel
SENDING reservation prevent automatic replay. SENDING/UNKNOWN deliveries remain
held after uncertainty. This establishes at-most-once submission attempts, not
guaranteed exactly-once network delivery.

## Fresh validation on this executable

The final isolated Linux focus proof belongs to this exact SHA and completed at
2026-11-01T20:38:43.200473+00:00. It passed 140 focused functional/regression cases,
9 raw-current release checks, 17 historical scope checks, 8 real disposable
PostgreSQL publication tests, Web/Admin/API builds and the unchanged packager.
The genuine PNG test renders with Sharp and checks the 1200-by-1080 output.
No Production credentials, account, order or database were used by these tests.

All original 79 official CI steps passed on this exact main/push source. Both
original typed commands were also run verbatim in isolated Linux preflight:

```text
node scripts/partner-spot-limit-scope-test.mjs --types
node scripts/futures-profit-protection-scope-test.mjs --types

Official step43 frontend: baseline70 -> candidate66; introduced=[]
Official step43 API:      baseline34 -> candidate34; introduced=[]
Official step56 frontend: baseline74 -> candidate66; introduced=[]
Official step56 API:      baseline30 -> candidate30; introduced=[]
```

Baseline TypeScript diagnostics remain; this is zero introduced diagnostics,
not an assertion that the entire repository has zero diagnostics. Historical
assertions remain intact through exact predecessor proofs and lossless pinned
fixture reads. Independent raw-current checks exercise the actual successor and
negative variants. No workflow, compiler option, original gate, 8 MiB limit or
Guard digest check was relaxed.

An earlier CI on 293312ee failed with four TS2550 diagnostics from Array.at under
the inherited ES2020 API lib. Four equivalent last-index accesses fixed this;
the source and all final proofs were regenerated and retested. That failed run
was not used as acceptance. Earlier queued/cancelled source evidence is also
historical.

## Immutable artifact and Guard

The official producer created the archive once with its LF-preserving contract.
Independent verification compared all 2705 Git blobs and
their executable modes, all 68 directories, metadata and
the embedded commit. The inner digest equals the fresh Linux preflight digest.
The exact retained bytes were delivered; archived code was not executed by the
independent verifier and the archive was not repackaged.

One fresh root-owned, private one-use approval was issued through the established
out-of-band mechanism at 2026-11-02T01:23:59+00:00, expiring at 2026-11-02T02:23:59+00:00.
The installed inspector validated its exact SHA/digest/format and ownership.
The official release consumed that approval once; post-checks matched its
consumed evidence and found no residual target claim. No old approval was reused,
renewed, recovered or manually removed. Its UUID remains in the private server
audit evidence. Installed Guard/helper/coordinator code and configuration match
the original control fingerprints.

The official delivery log reports status=deployed for the exact SHA. The existing
GitHub Production environment's main-only branch rule was read and preserved;
no environment/reviewer/security setting was changed.

## Backup and exact nonfinancial migration

```text
DATABASE=signalverse_cutover2
BACKUP_ID=spot-swing-trader-20261101T202332Z-1d1bdcc3
BACKUP_FINISHED=2026-11-01T20:55:27.817463+00:00
DATABASE_DUMP_BYTES=1308363995
DATABASE_DUMP_SHA256=a1228e1fbfe88170e7f64657c899f85471614299bc9670c3201866c24b275a1e
MIGRATION=migrations/telegram_analysis_posts.sql
MIGRATION_SHA256=a81ac3b969c52642405ef9238485bd257bdbb513e9707fffea101fa87c2a22d4
MIGRATION_COMMITTED_AT=2026-11-02T01:18:39.442570+00:00
MIGRATION_EXECUTIONS=1
```

The existing approved full backup/restore procedure verified 148 original
relations, both SQLite snapshots, checksums, owners/ACLs and a cold rehearsal of
this exact migration in an isolated temporary cluster. Seven complete financial/
profile table digests remained identical in the rehearsal. The cluster was
removed. Dump and compressed snapshot checksums were read again before DDL and
before approval; no new backup system was introduced.

Only the two dedicated tables telegram_analysis_posts and
telegram_analysis_deliveries, their constraints/indexes, private RLS policies and
immutable-snapshot trigger/function were added. All prior catalog objects remain
exact. No financial table, historical row, balance, order, position or enrollment
was backfilled or modified by this migration.

The authenticated OpenAPI includes both models/all expected columns. Both
zero-row JSON SELECTs return 200. RLS denies direct anon/authenticated access;
service_role has SELECT/INSERT/UPDATE and no DELETE. The snapshot trigger is
SECURITY INVOKER with the exact reviewed body/search path. Both new tables were
empty in the post-check. One existing NOTIFY reload was sent; PostgREST was not
restarted and SQL was not replayed.

## Actual runtime verification

The deployed marker, app/admin/partner symlinks and process working directories
match the released SHA. All 2705 deployed main Git
blobs/modes, 9 sanitized admin source
files and 3 compiled admin files passed.
The installed deployer matches its protected Git source. Public HTML and hashed
assets match the active release, including the actual chart/publisher UI. HTML
remains no-cache. All existing native market-entry/Spot guide/history markers
and the public shared-terminal manifests passed their original checks.

Application, admin, observer, partner runtime, receiver and independent Paper
services are active. Restart counters are zero. Runtime PIDs:

```text
APPLICATION_PID=1498067
ADMIN_PID=1498030
OBSERVER_PID=1498029
PARTNER_PID=1498051
PAPER_PID=1120 (unchanged)
PAPER_SHA=2da63dc5441928c5c325067869445e8732bde48c (unchanged)
POSTGREST_PID=1039 (unchanged)
POSTGREST_RESTARTS=0 (unchanged)
```

On both loopback and the official HTTPS host, the actual shipped UI admin route
rejects unauthenticated access with 403/FORBIDDEN, the actual cron rejects with
401, and a nonexistent report UUID returns 404/POST_NOT_FOUND. All six checks
returned the expected JSON. No session was forged and no post, Telegram message
or trading action was manufactured for verification.

The existing signalverse-fast-jobs.timer is active/enabled with the original
five-minute OnCalendar. All 17 job gates and the job runner hash are unchanged;
run-alerts remains present. The exact delivered enabled-config guard calls
tickAnalysisPublishing. The observed natural timer trigger at 01:30:02 UTC is
evidence for the existing timer only; it is not a daily Telegram delivery test.

## PP and financial safety

Read-only preflight found both pre-existing PP flags TRUE. The owner explicitly
authorized preserving that exact state while the canonical worker remains OFF.
All checks compare the exact saved baseline; no flag was toggled.

```text
REAL_PP=TRUE / UNCHANGED
DEMO_PP=TRUE / UNCHANGED
CANONICAL_PP_WORKER=disabled / inactive / PID0 / NRestarts0
WORKER_STARTED=NO
WORKER_ENABLED=NO
PP_POLICY_CHANGED=NO
STRATEGY_OR_DECISION_ENGINE_CHANGED=NO
RISK_OR_SL_ONE_TP_CHANGED=NO
SCANNER_GATES_OR_PROFILES_CHANGED=NO
SPOT_TRADING_BEHAVIOR_CHANGED=NO
EXCHANGE_ACTIONS_BY_THIS_TASK=0
ORDER_ACTIONS_BY_THIS_TASK=0
POSITION_ACTIONS_BY_THIS_TASK=0
SL_TP_CHANGES_BY_THIS_TASK=0
CLOSE_ACTIONS_BY_THIS_TASK=0
PAID_AI_OR_CREDIT_MUTATION_BY_THIS_TASK=NO
TELEGRAM_TEST_MESSAGES=0
DAILY_TELEGRAM_PUBLISHER=OFF_UNCONFIGURED
```

These zero-action statements concern this task. Normal existing production
activity was not paused or rewritten to obtain an artificial zero-row result.
Financial rows were not inspected unnecessarily or exported into this report.

## Operator-check corrections and preserved evidence

The CI archive supplied an authenticated aggregate master plus system log,
without individual step members. Verification checks exactly four compiler JSON
results in the separate official step43/56 timestamp windows and original Run
groups, as well as every successful official step and exact SHA. The original
individual-log-only verifier and failure evidence were retained. No source test
or CI requirement changed.

The CI observer SSH ended with255 after the job itself succeeded. That exit was
preserved. Read-only independent checks proved the exact runner registration and
container already absent; no cleanup mutation was needed. Final checks found all
four owned official registrations/containers absent, with other containers
untouched. Local Windows Docker was not used.

The first migration readiness operator reused the OpenAPI Accept header on a
table SELECT, reproducing 406/PGRST107. OpenAPI and JSON SELECTs were actually
ready. Only the read-only SELECT media type was corrected. Three initial post-
checks also used assumed identifiers: telegram-analysis-admin instead of the
actual UI's telegram-analysis/403 route, and runTelegramAnalysisCronTick instead
of the actual tickAnalysisPublishing import/guard. Only those operator probes
were corrected from the fully verified source. All original runtime, asset,
authentication, schema and safety checks then passed. Initial scripts/logs and
both media-type diagnoses remain preserved privately. There was no SQL replay,
second notification, application patch, second Guard or redeployment.

## Remaining scope and publication state

Daily publishing is available but intentionally OFF/unconfigured. The owner must
choose coins/languages and enable it in the existing Telegram admin panel. Manual
analysis/preview and explicit publication are separate. A real channel send or
natural daily publication cycle has not been observed by this task. Offline tests,
service health and HTTP responses do not establish trading profitability or
private-account execution.

The six-to-24-hour reanalysis reminder remains a local preview prototype; this
release does not claim that its normal-app activation is complete. No additional
feature was enabled to make the deployment report green.

Application main and the executable remain frozen on the same released SHA.
No post-CI source change or additional application commit/push was made. Final
report/HANDOFF updates are retained locally in the original working checkout;
the dated report is published separately to SignalVerse-AI-Log/master. This
avoids altering the closed executable scope solely for a documentary successor.
The report's publication commit and verified URL are recorded in the separate
publication receipt and returned to the owner, without embedding private evidence.

## Exact executable changed-file inventory (63 paths)

- HANDOFF.md
- api/_shared/standalone-chart-evidence.ts
- api/_shared/standalone-chart-geometry.ts
- api/_shared/standalone-chart-review.ts
- api/_shared/telegram-analysis-handler.ts
- api/_shared/telegram-analysis-image.ts
- api/_shared/telegram-analysis.ts
- api/analyze.ts
- api/coins.ts
- migrations/telegram_analysis_posts.sql
- reports/general/2026-11-01-analysis-chart-channels-rsi-fresh-local.md
- reports/general/2026-11-01-analysis-chart-confirmed-evidence-btc-eth.md
- reports/general/2026-11-01-analysis-chart-fresh-btc-eth-local-validation.md
- reports/general/2026-11-01-analysis-chart-pattern-scenarios-local.md
- reports/general/2026-11-01-analysis-reminder-developing-channels-zones-local.md
- reports/general/2026-11-02-admin-telegram-analysis-local.md
- scripts/analysis-refresh-reminder-test.mjs
- scripts/analysis-telegram-release-test.mjs
- scripts/copytrade-market-entry-test.mjs
- scripts/lib/analysis-scenarios-release-delta.json
- scripts/lib/analysis-scenarios-release-parity.mjs
- scripts/lib/analysis-telegram-release-delta.json
- scripts/lib/analysis-telegram-release-parity.mjs
- scripts/lib/copytrade-market-entry-parity.mjs
- scripts/lib/scalp-discovery-policy-delta.json
- scripts/lib/scalp-discovery-policy-parity.mjs
- scripts/lib/scalp-liquidity-policy-delta.json
- scripts/lib/scalp-liquidity-policy-parity.mjs
- scripts/lib/standalone-chart-harness.mjs
- scripts/lib/telegram-analysis-harness.mjs
- scripts/preview/capture-analysis-public-candles.mjs
- scripts/preview/public-analysis-data.mjs
- scripts/preview/serve-analysis-engine-chart.mjs
- scripts/preview/serve-telegram-analysis.mjs
- scripts/standalone-analysis-geometry-test.mjs
- scripts/standalone-chart-evidence-test.mjs
- scripts/standalone-chart-fresh-data-test.mjs
- scripts/standalone-chart-geometry-test.mjs
- scripts/standalone-chart-presentation-test.mjs
- scripts/standalone-chart-review-test.mjs
- scripts/standalone-developing-channel-test.mjs
- scripts/telegram-analysis-boundary-test.mjs
- scripts/telegram-analysis-publishing-test.mjs
- scripts/telegram-analysis-sql-test.mjs
- src/app/App.tsx
- src/app/components/AnalysisEvidenceChart.tsx
- src/app/components/AnalysisRefreshButton.tsx
- src/app/components/ChartStudyDetails.tsx
- src/app/components/PublicTelegramAnalysis.tsx
- src/app/components/TelegramAnalysisPanel.tsx
- src/main.tsx
- src/previews/analysis-engine-chart.css
- src/previews/analysis-engine-chart.tsx
- src/previews/latest-analysis-request.ts
- src/previews/telegram-analysis.tsx
- src/shared/analysis-chart-presentation.ts
- src/shared/analysis-chart-review.ts
- src/shared/analysis-chart-studies.ts
- src/shared/analysis-chart.ts
- src/shared/analysis-refresh-reminder.ts
- src/styles/analysis-evidence-chart.css
- src/styles/analysis-refresh-button.css
- src/styles/telegram-analysis.css

## Evidence locations

Private operator receipts/logs are under tmp/telegram-analysis/rollout in the
preserved analysis-chart-engine working checkout. Relevant receipts include
source-publication.json, official-ci-result.json, official-ci-type-comparisons.json,
official-artifact-result.json, artifact-coordinates.json, the retained artifact's
verification-proof.json, backup-2acedfab.log, telegram-schema-post.log,
official-release-result.json, post-release-2acedfab.log, deployed-tree-proof.json,
api-smoke-2acedfab.log, post-existing-scheduler.log, ci-disconnect-readback.json and
release-cleanup-proof.json. Private server audit evidence remains in
/var/lib/signalverse-deploy/operations/analysis-telegram-20261102-2acedfab.
Backups, approval UUIDs, credentials, raw account data and test artifacts were not
added to Git or this published report.
