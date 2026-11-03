# Native Analysis chart and explanation UX — official release completion

Recorded: 2026-11-03T05:00:42.141715+00:00 (work date 2026-11-03, Asia/Kuala_Lumpur).

## Outcome

The reviewed full-width native Analysis workspace and concise engine explanations were released through the existing official path. Production source moved from `2acedfab056262f0157d8b6b9a9ecea447ff2fdf` to `c161955239f24f151fed6a2a08dfcb8bef0e04ac`. Runtime marker time: `2026-11-03T04:57:00.880184+00:00`. No separate/manual activation was used.

For newly generated native analysis, the page presents daily/weekly evidence, compact chart labels and channel callouts, reset/fullscreen controls, and an engine-derived buy/profit-taking summary rather than the old four-scenario/four-ladder presentation. Existing saved legacy report reasons/reviews and separate host behavior remain preserved. The decision and technical evidence remain distinct; zones do not manufacture an entry confirmation. The approved visual source is `d54db3fd39349510d60f44cd7d033f764173aa58`; intervening release repairs are test/documentation/compatibility changes recorded below.

## Publication and exact scope

- Final source: `c161955239f24f151fed6a2a08dfcb8bef0e04ac`; clean local worktree verified.
- Final normal fast-forward: `63868f319db885c2cdd99885d98ab5452a0e3411` → `d03a5ccf3007bf0082670894a63c5c9f181014e2` → `c161955239f24f151fed6a2a08dfcb8bef0e04ac`.
- Retained source rollback branch: `codex/rollback-analysis-native-ux-validation-unit-20261103` at `63868f319db885c2cdd99885d98ab5452a0e3411`.
- Application rollback source: `2acedfab056262f0157d8b6b9a9ecea447ff2fdf`, retained by the official release coordinator.
- No force push, rebase, squash, amend or rewritten history.
- Closed cumulative release scope: exactly 35 paths. The last two repair commits affect exactly 8 test/docs/metadata paths. One additional precisely pinned historical TEST helper was explicitly added to both closed scope inventories; no wildcard exception or runtime helper was added.

Exact cumulative paths:

- `HANDOFF.md`
- `api/analyze.ts`
- `docs/testing/analysis-native-ux-production-release-2026-11-02.md`
- `reports/general/2026-11-02-analysis-channel-callouts-local.md`
- `reports/general/2026-11-02-analysis-explanation-ux-local.md`
- `reports/general/2026-11-02-analysis-page-reference-ux-local.md`
- `scripts/analysis-chart-labels-test.mjs`
- `scripts/analysis-explanation-ux-test.mjs`
- `scripts/analysis-native-ux-release-test.mjs`
- `scripts/analysis-page-evidence-test.mjs`
- `scripts/analysis-telegram-release-test.mjs`
- `scripts/analysis-trade-summary-test.mjs`
- `scripts/lib/analysis-native-ux-delta.json`
- `scripts/lib/analysis-native-ux-parity.mjs`
- `scripts/lib/analysis-telegram-release-parity.mjs`
- `scripts/lib/spot-release-history-parity.mjs`
- `scripts/preview/serve-analysis-engine-chart.mjs`
- `scripts/standalone-analysis-client-test.mjs`
- `scripts/standalone-chart-evidence-test.mjs`
- `scripts/standalone-chart-geometry-test.mjs`
- `scripts/standalone-chart-presentation-test.mjs`
- `src/app/App.tsx`
- `src/app/components/AnalysisEvidenceChart.tsx`
- `src/app/components/AnalysisRefreshButton.tsx`
- `src/app/components/AnalysisReportAction.tsx`
- `src/app/components/AnalysisTradeSummary.tsx`
- `src/app/components/AnalysisWorkspace.tsx`
- `src/app/components/ChartStudyDetails.tsx`
- `src/app/useAnalysisHistory.ts`
- `src/previews/analysis-page.css`
- `src/previews/analysis-page.tsx`
- `src/shared/analysis-chart-labels.ts`
- `src/styles/analysis-evidence-chart.css`
- `src/styles/analysis-trade-summary.css`
- `src/styles/analysis-workspace.css`

Exact final repair paths:

- `HANDOFF.md`
- `docs/testing/analysis-native-ux-production-release-2026-11-02.md`
- `reports/general/2026-11-02-analysis-page-reference-ux-local.md`
- `scripts/analysis-native-ux-release-test.mjs`
- `scripts/lib/analysis-native-ux-delta.json`
- `scripts/lib/analysis-native-ux-parity.mjs`
- `scripts/lib/analysis-telegram-release-parity.mjs`
- `scripts/lib/spot-release-history-parity.mjs`

## CI duration diagnosis and narrow repair

Prior run 41472375609 stopped at the unchanged 180-minute cap: 60 successful steps, one cancelled step 59, 18 skipped, zero assertion failures. That incomplete run was not accepted and produced no release. Earlier archive and TypeScript failures are documented separately; they were not hidden or waived.

Repeated complete source proofs were being entered at nested test-helper call boundaries. The repair reuses the existing checked-source operation at each semantic Telegram read/view/tree and historical validation/before/project/read operation. Previously independent direct operations ran 4 scans; they now run 2. The original one-read 6→2 cases remain covered. Returned historical reads are guarded only for paths already admitted by the complete proof; other paths retain the raw behavior.

The four complete historical operations each perform 2 full scans and 2 again on repeat. The actual validation still invokes its raw read callback 21 times on each validation. Both raw source validators still reject corrupted input after a warm success. Original validator statements, all five original native tests and all five original historical tests are preserved byte-for-byte after declared boundary adapters. No cache implementation, compiler, workflow, timeout, CPU limit, Guard, receiver or runtime logic was changed by these two repair commits.

## Local acceptance before source promotion

The following fresh local runs were completed before the already-recorded source promotion, not rerun during this final retry. The source was unchanged; the new complete official Linux attempt 2 below is the current release acceptance. No historical partial CI result was substituted.

| Suite | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| Native and historical operation regression | 23 | 0 | 0 |
| Raw UI/evidence child suite | 135 | 0 | 0 |
| Publisher/auth/native child suite | 140 | 0 | 0 |
| Original cache suites | 8 | 0 | 0 |
| Unchanged original history/scope suite on final commit | 5 | 0 | 0 |

These suites overlap and are not a unique-test total. All are fresh completed runs. An earlier local diagnostic was intentionally stopped before the returned-read boundary was finished; its retained partial log is not counted as acceptance. Web and Admin builds, Node syntax and `git diff --check` passed. The Vite large-chunk warning remains a warning. Windows timings were not represented as a full Linux CI duration guarantee.

The unchanged producer repeated twice for the committed source: 8,388,499 bytes, original cap 8,388,608 bytes, 109-byte headroom, identical complete digest, correct embedded SHA. This was a discarded in-memory diagnostic, not a retained release artifact and not the approval input. The actual official artifact proof below is authoritative.

## Exact official CI

The owner separately requested continuation after attempt 1 hit the three-hour cap at the Web build (75 successful steps, zero assertion failures). One complete normal rerun of the same original main/push run was authorized: **attempt 2**, same exact commit, all 79 steps, original three-hour bound, 2 CPUs/4 GiB and all four compiler comparisons. No source, workflow, test or runner-resource change was made for the retry. It is not a workflow-dispatch acceptance run and no partial results from attempt 1 were substituted. The first read-only GitHub queue request transiently hit a TLS handshake timeout before any runner creation; the unchanged verified operator then proceeded once. TLS and proxy configuration were not changed.

[Production CI run 41515024448, attempt 2](https://github.com/signal0verse/signalverse-main/actions/runs/41515024448/attempts/2) — `c161955239f24f151fed6a2a08dfcb8bef0e04ac`, branch `main`, event `push`, conclusion `success`, all 79 original steps retained. The final exact-source job, rather than a previous/partial/manual run, was accepted.

Actual step conclusions: `{"success": 79}`. Job start/end: `2026-11-03T02:05:42Z` / `2026-11-03T04:49:04Z`.

| Job | Result |
| --- | --- |
| Build web and API runtime | success |

All four original independent compiler comparisons were extracted from the authoritative individual step 43 and 56 logs:

| Official step log | Scope | Baseline diagnostics | Candidate diagnostics | Introduced |
| --- | --- | ---: | ---: | ---: |
| Build web and API runtime/43_Test owned native copy-trading without accounts or provider access.txt | frontend | 70 | 66 | 0 |
| Build web and API runtime/43_Test owned native copy-trading without accounts or provider access.txt | API | 34 | 34 | 0 |
| Build web and API runtime/56_Test opt-in Futures Profit Protection without private services.txt | frontend | 74 | 66 | 0 |
| Build web and API runtime/56_Test opt-in Futures Profit Protection without private services.txt | API | 30 | 30 | 0 |

Existing baseline diagnostics are not claimed to be zero. Actual Linux step 38 output independently proves the 6→2 and 4→2 cases, all four complete-operation 2+2 rows, repeated validation callbacks, original test preservation and warm-corruption rejection. Full CI and authoritative log digests are retained privately.

## Backup and readiness

The existing approved Production backup mechanism completed at `2026-11-02T19:28:22.879077+00:00`: full PostgreSQL custom dump, 150 relations with complete catalog/count verification, full bounded unique-key row hashes for seven original tables, plus both SQLite cold integrity and compressed-roundtrip checks. The private disk-backed PostgreSQL cold restore used 1 CPU/1 GiB and no Production network/paths; it was cleaned up. Six parser roundtrip cases and four equivalent owner ACL representations were checked privately without altering Production privileges or schema.

The full immutable backup proof retains historical target `d03a5ccf3007bf0082670894a63c5c9f181014e2` and actual source `2acedfab056262f0157d8b6b9a9ecea447ff2fdf`; it was not relabelled. The final test/docs-only descendant reused it only after immediate checksum/age/runtime/schema/control revalidation. No second backup or migration was invented. The backup database SHA-256 is `fd7d471c4c6e380748452bc5a6f40bc03bcdad2391de3b5de79ce2db3efc2d60`. Backup IDs, dumps and row/catalog details remain private.

## Immutable artifact, Guard and official activation

- [Official prepare-only run 41580397032](https://github.com/signal0verse/signalverse-main/actions/runs/41580397032).
- Retained GitHub artifact ID: `13205426652`.
- Embedded commit: `c161955239f24f151fed6a2a08dfcb8bef0e04ac`.
- Outer retained ZIP SHA-256: `5d133f183da55cd2ddafac823b9c281a8feac48162b72e93ab4f5309e5cc9fff`.
- Exact inner release SHA-256: `5defb95dc635411ba077ed81543dee6e4a0013fe7bd0c7f5650ae68d5ea23444`; bytes: 8388499.
- Every 2722 Git blob, executable mode, directory and metadata identity was independently verified without executing or repackaging archived source.
- One fresh root-owned mode 0600 Guard: `0d3bd75b-9c89-483a-9779-7b5595adeb25`, exact commit and exact retained inner digest. Issued `1793681612`, expiry `1793685212` (Unix seconds).
- Guard code/configuration unchanged. No old claim/approval was overwritten, renewed, recovered or reused. The new approval was consumed once by the official release.
- [Official Production Release run 41580730929](https://github.com/signal0verse/signalverse-main/actions/runs/41580730929) passed its 11 original steps.

The first private post-release verifier incorrectly expected the approval file to be deleted. It stopped at that assertion after already confirming the exact runtime/pointers and consumed receipt. Read-only inspection proved that the unchanged installed helper (SHA-256 `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83`) intentionally retains the original approval as audit evidence, exclusively links the claim into consumed, and unlinks only the claim. The initial failure log/script were preserved. Only the private read-only checker was corrected to require the actual stricter contract: exact matching approval/consumed bytes, both root-owned mode 0600, claim absent, and read-only `inspectApproval` rejection `AUTHORIZATION_CONSUMED`. No Guard, official gate, approval, claim or Production source was changed and no release was retried. A preliminary forensic check also used an incorrect revoked filename suffix; its original evidence was retained and the corrected read-only inspection used the installed helper's actual path. Actual replay verification did not submit any release request or consume anything.

## Post-deployment read-only evidence

Marker, app/admin/partner release pointers and running process working directories match `c161955239f24f151fed6a2a08dfcb8bef0e04ac`.

| Service | PID | Source working directory |
| --- | ---: | --- |
| signalverse.service | 2778187 | `/opt/signalverse/releases/c161955239f24f151fed6a2a08dfcb8bef0e04ac` |
| signalverse-admin.service | 2778114 | `/opt/signalverse-admin/releases/c161955239f24f151fed6a2a08dfcb8bef0e04ac` |
| signalverse-observer.service | 2778113 | `/opt/signalverse-admin/releases/c161955239f24f151fed6a2a08dfcb8bef0e04ac` |
| signalverse-partner-copytrade.service | 2778146 | `/opt/signalverse/releases/c161955239f24f151fed6a2a08dfcb8bef0e04ac` |

Application/admin/public API health: `{"admin": "200", "app": "200", "public_api": "200"}`. Public HTML, JS and CSS match the installed build bytes; ten native Analysis selectors and both required Persian explanation headings are present. All 2722 installed Git blobs and executable modes match the exact source. The sanitized Admin source and compiled Admin copy were verified. All three shared terminal manifests match the source. These checks establish delivered/runtime provenance; they do not assert trading profitability.

The canonical PP worker remains disabled, inactive and PID 0. Existing Real/Demo PP flags remain TRUE/TRUE exactly as expressly authorized; they were not represented as OFF. Paper, PostgREST and receiver PIDs/restart counters remain unchanged. All 22 protected control fingerprints and 17 job gates are unchanged. Schema hash unchanged; no migration or Production DDL/DML. Only the normal official application/admin/observer/partner activation occurred.

Two full read-only samples at `2026-11-03T04:59:21.003327+00:00` and `2026-11-03T05:00:31.820804+00:00`, 70.817477 seconds apart, show identical service PIDs/start times/restart counters and passing health. The disabled/inactive canonical PP worker, unchanged flags/schema and consumed-authorization rejection pass in both samples.

The three owned ephemeral runners and containers were verified absent after completion; unrelated containers/registrations were not removed. Local preview remains available separately. Direct private Telegram-screen inspection was blocked by automatic approval review and was not retried or bypassed; local render evidence plus public installed assets, source and process provenance are the available UI proof. No live analysis, Telegram test post, forced scanner action or exchange lifecycle was manufactured for verification.

## Safety and limitations

OPERATOR_EXCHANGE_ACTIONS=0
OPERATOR_ORDER_CHANGES=0
OPERATOR_POSITION_CHANGES=0
OPERATOR_SL_TP_CHANGES=0
PP_WORKER_STARTED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
MIGRATION=NO
DATABASE_DDL_DML=NO
GUARD_CODE_CHANGED=NO
MANUAL_DEPLOYMENT=NO
STRATEGY_RISK_EXECUTION_CHANGED=NO

These zeroes describe this operation, not a claim that unrelated pre-existing automatic trading was frozen. Ordinary runtime activity is outside this UI release proof. The charts explain actual analysis inputs; no improvement/profitability claim follows from test/build/HTTP success.

FINAL_STATUS=OFFICIAL_NATIVE_ANALYSIS_UX_RELEASE_VERIFIED
