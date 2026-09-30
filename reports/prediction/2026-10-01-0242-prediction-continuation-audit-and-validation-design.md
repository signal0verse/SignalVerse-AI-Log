# Prediction continuation — production audit and next validation design

## Metadata

- Date: 2026-10-01, Asia/Kuala_Lumpur (2026-09-30 UTC).
- Task ID: prediction-continuation-audit-20261001.
- Module: Prediction Market only.
- Mode: read-only production audit; documentation and design.
- Repository: signal0verse/signalverse-main; report destination: signal0verse/SignalVerse-AI-Log, master, reports/prediction/.
- Branch: main, documentation only.
- Starting checkout: `8858119faa378c67aa86d1092919ddf5e72c703f`.
- Audited main and active runtime: `b211db170dc3e35fd2965cdb74e496df5998d19a`.
- Primary database snapshot: `2026-09-30T18:39:14.332372Z` / `2026-10-01T02:39:14.332372+08:00`.
- Publication commits are recorded in the verified publication receipt/final response. Documentation publication does not change the active runtime above.

## Objective

Continue the supplied Prediction Market handoff by auditing existing architecture, previous phases, deployed state, data coverage and reliability before coding. Determine one minimum next engineering task under the original Phase 9A validation criteria.

## Scope and actions taken

Checked status, preserved all pre-existing untracked work, and synchronized main with `git pull --ff-only`. The received four commits belong to existing concurrent work; they were not authored or deployed by this task. Read the owner instructions and phase reports directly from the repository and AI-Log. Inspected the running release, nonsecret diagnostic switch, scheduler gates and handler source over SSH. Executed aggregate SELECTs in explicitly READ ONLY, REPEATABLE READ transactions, with 20-second statement and 1-second lock limits. Used eleven bounded public CLOB GETs to check actual winner-token mapping. Ran four audited offline test files. No authenticated application action, AI review, trade, account edit or production UPDATE was invoked.

## Answers to the 18 required audit questions

| # | Question | Verified answer |
|---|---|---|
| 1 | Exact production state | Engine v2 and Phase 9C.1 are running in Shadow/Validation. Active service, release symlink and deployed-SHA record agree on `b211db170dc3e35fd2965cdb74e496df5998d19a`. Discovery, shadow-entry and resolution are enabled. Autonomous entry and Real execution remain off. |
| 2 | Exact main SHA | `b211db170dc3e35fd2965cdb74e496df5998d19a` at audit time, after ff-only synchronization. Subsequent documentation publication is separate from executable/runtime state. |
| 3 | Prediction commits after 9C | 9C base `dc33a74`, followed by 9C.1 guard `290da5a`. No later change to `api/predictions.ts`, the AI diagnostic reporter or its isolated helper through audited main. The latest Engine release remains Phase 9B `7e744911fe5081b96a1e8cbf6b68e43b97884251`. |
| 4 | Is 9C active? | Yes. 587 recorded diagnostic runs, latest at `2026-09-30T18:36:09.836Z`; live bundle contains the version and both degradation guards. |
| 5 | Diagnostic kill switch | OFF: `PREDICTION_PRICE_AI_DIAGNOSTIC` is unset in the running process. The exact code condition is `!== 'off'`, so the diagnostic is ON. |
| 6 | Entry OFF? | Yes. No prediction-enter gate file, no runner branch, no `entry_real` run, and zero autonomous trade rows. User opt-in is separate from this system gate. |
| 7 | Real OFF? | Yes. `prediction_real_enabled` is absent and therefore defaults false. The authenticated Real wallet-status shell reports `tradingEnabled: false`; the remaining Real branch returns 501. Zero Real prediction-trade rows. No signing/order path was added. |
| 8 | Shadow rows after 9C | 30,350 v2 rows across 253 distinct markets since the 9C release window; zero autonomous v1 rows in that window. First v2 shadow row: `2026-09-28T15:46:09.781581Z`. |
| 9 | Resolved v2 predictions | 14 YES/NO-resolved v2 shadow rows. This is a row count, not 14 independent observations. |
| 10 | Distinct resolved markets | 7 distinct markets with a YES/NO outcome on a v2 shadow row. Only 3 first recorded v2 rows themselves have an outcome; later rows account for the other markets. |
| 11 | Resolved would-open | 0; would-open rows and distinct would-open markets are also 0. |
| 12 | Brier / log loss / ECE | No saved calibration snapshots. An explicitly exploratory first-finite-prior calculation on 7 markets gives model Brier 0.0003253314 vs de-vigged-market Brier 0.0001134643, and log loss 0.0100248848 vs 0.0078432562. ECE with the pre-registered 10 equal-count bins is NOT ESTIMABLE on this sample. These are not official validation scores or grounds for parameter changes. |
| 13 | Calibration collection exists? | Partially. Shadow storage, outcome columns, Brier/log-loss primitives and `autonomousLearningTick()` exist. The learning endpoint is not scheduled. Its legacy selector mixes model versions, counts up to 500 rows rather than distinct markets, and filters only VALID_PREDICTION; it cannot certify Phase 9A. |
| 14 | Validation report generator exists? | The AI A/B/C diagnostic reporter and v1/v2 historical replay exist. The diagnostic reporter deliberately selects no outcomes. No complete Phase 9A resolved-shadow validation generator was found: paired bootstrap, 10-bin ECE, category/type matrices, would-open calibration, fee-adjusted realized edge and all acceptance criteria are not integrated into one report. |
| 15 | Resolution coverage sufficient? | No. Resolver selects only unresolved VALID_PREDICTION rows, LIMIT 200, without ordering or model-version separation. Eleven expired v2-observed markets were confirmed closed with mapped winners by public CLOB GETs; three have no stored outcome on any prediction row. All three are COUNT_BRACKET markets, have zero VALID rows, and have 339 finite-prior v2 rows in the supplemental snapshot. This is a confirmed structural exclusion, not a CLOB outage. |
| 16 | Smallest next engineering task | Add bounded, fair v2 shadow-outcome collection to the existing resolution flow, including the frozen first scorable evaluation and abstained markets, without changing decision/classification/trading semantics. Design below; implementation awaits explicit approval because it changes production outcome-write behavior. |
| 17 | Reliability problems? | In the last 24 hours: 287 shadow runs, 0 explicitly failed, 1 unfinished; 108 completed ticks >90s, p95 185.521s, max 241.149s. One unfinished run began `2026-09-30T06:10:56.221Z`; there is one ~597.487s start-to-start gap. The unordered resolution batch and incomplete first-row outcome coverage can delay or bias validation. |
| 18 | A-mode timeout attention? | Yes, before relying on prolonged unattended collection. Provider HTTP calls have individual 20s timeouts, but the fallback chain and up to 10 sequential A reviews have no review/funnel deadline. B's 25s budget and 90s/degradation skip guards do not bound A. A timeout change needs its own reviewed design and approval. |

## Confirmed architecture and production evidence

The existing engine starts from the de-vigged market prior, retains only PRICE_MODEL and bounded AI_REVIEW groups, routes quantitative evidence through the four verified templates, and applies H1–H8. Base Rate, 30-day trend probability evidence and Spot Scenario 1–9 were not reintroduced.

The local Prediction source normalized to LF and the deployed source have the same SHA-256: `bd6e1be7df0a7b52bb47c7834f774daea614f89b263d02106719079f6c7483d3`. The raw Windows file hash differs because of CRLF; normalized source equality was checked, not assumed.

- 6,369 v2 price-model rows: zero future-close violations, zero spot-age violations above two minutes, and zero missing temporal provenance fields. Checks compare stored close times directly against `asOfMs`; they are not reconstructed candle histories.
- 5,692 diagnostic records / 29 distinct markets: A reproduced production in 5,692/5,692, and recorded temporal checks passed in 5,692/5,692.
- B has an applied AI answer on only 41 records / 12 markets. All three modes have zero diagnostic would-open candidates. No mode is promoted and no weight is tuned.
- Latest observed diagnostic skipped B because A was degraded; the guard remains active. Deterministic evaluation and A/C records continue.
- Autonomous trades: 0. Separately, the legacy/manual `prediction_trades` table contains 14 Demo rows. The blanket historical claim that every Prediction trade table is empty is therefore not current evidence; these are not observed autonomous v2 lifecycle trades.
- At the primary snapshot, there are 16,759 unresolved VALID v1 rows across 62 markets and 5,832 unresolved VALID v2 rows across 30 markets. A later unordered 200-row read selected v2 rows across only 10 markets. This demonstrates the small row-based batch; it does not prove that v1 currently monopolizes the queue.

## Root cause / findings

CONFIRMED: classification is reused as an outcome-collection gate. `classifyPrediction()` labels INSUFFICIENT_DATA or evidence-free evaluations INSUFFICIENT_EVIDENCE. `autonomousResolutionTick()` selects only VALID_PREDICTION. Consequently supported observation of a market prior can be retained forever without an outcome when the engine correctly abstains for lack of a validated source. Phase 9A nevertheless requires abstention-quality measurement and representative distinct-market comparisons.

CONFIRMED: resolution processes rows before deduplicating by market. LIMIT 200 can represent very few markets, and there is no explicit rotation/order. Outcomes on later rows do not automatically annotate the first eligible observation.

CONFIRMED: the legacy learning tick is not the required validation process. Simply enabling it would create misleading row-weighted, mixed-version scores, and is not recommended.

CONFIRMED: AI provider timeouts exist. The operational gap is an end-to-end review/funnel deadline. Groq, Gemini and both free OpenRouter attempts can each consume 20s, followed by a variable-length custom-free chain. There is no explicit same-provider retry loop; fallbacks extend total latency. The production funnel re-evaluates reviews sequentially. The scheduler runs every five minutes and uses a 300s curl timeout; that client timeout is not a proven cancellation boundary for the handler. The live generated server does not add a Prediction-specific processing deadline, and systemd's service start timeout is infinite.

CONFIRMED policy nuance: missing AI evidence does not impose an unconditional NO_TRADE. Current code drops the missing AI group, evaluates available quantitative evidence, and retains every deterministic gate. A bare Promise.race followed by an arbitrary forced decision would change existing policy. Cancellation and unchanged fallback semantics must be designed explicitly.

UNCONFIRMED: the exact cause of the unfinished run. No secret-bearing application logs were exported. There are zero v2 prediction rows attached to failed/unfinished runs in the inspected snapshot. Zero explicitly failed recent runs does not erase the unfinished-run observation.

## Next implementation design — bounded v2 outcome coverage

Status: DESIGN ONLY, NOT IMPLEMENTED. This is the one recommended next engineering slice.

1. Preserve the open-Demo settlement path, user ownership, sizing, market lifecycle and every H gate. Add collection for v2 shadow observations in the existing resolver rather than creating an execution scheduler or a second engine.
2. Select the observation cohort independently of actionable/VALID classification. Freeze one first eligible/scorable v2 evaluation per market using stable chronological ordering plus an ID tie-breaker. Require a finite actual market prior and temporal metadata; exclude rows whose fallback 50% was used because no valid book/prior existed. Preserve and disclose separate counts for unsupported/admissibility-failed and genuinely unscorable rows. A resolved abstention remains an abstention; do not relabel it as a validated model forecast.
3. Collect outcomes for evaluated markets needed by abstention analysis, including the three currently excluded COUNT_BRACKET markets. Never infer settlement from `end_date`, current prices or an AI answer. Reuse `fetchClobSettlementOutcome()` and exact stored token-ID mapping; LOOKUP_FAILED / NOT_YET_RESOLVED remain retryable, and unmapped/cancelled outcomes stay outside binary scoring.
4. Bound row scans, distinct market lookups, concurrent requests and elapsed time. Persist a deterministic paging/rotation cursor in existing resolver run-summary JSON, so still-open or lookup-failed markets do not monopolize the next batch. Deduplicate condition IDs before requesting CLOB. Review the concrete Supabase query plan before choosing limits; a row limit alone is insufficient.
5. Persist outcomes idempotently onto the selected existing observation rows, only while unresolved. Do not overwrite a conflicting stored outcome. Check chronology using the frozen evaluation timestamp and retain source/observation provenance in existing JSON fields. No schema migration is presumed; if existing fields cannot represent this safely, stop and present a migration design before applying one.
6. Keep v1 and v2 cohorts separate. Do not switch on `autonomous-learn` or modify its historical snapshots as a shortcut. The subsequent read-only validation reporter must use one market per observation, report missing coverage, and leave unmet criteria NOT YET VALIDATED.

Required acceptance before any release: synthetic multi-tick fairness and retry tests; first-row preservation; actual-prior vs fallback-50 exclusion; abstention coverage without class/decision mutation; winner-token / cancelled / unmapped / transient tests; idempotency and conflict handling; v1 isolation; temporal tests; unchanged multi-user Demo settlement; the audited offline Prediction CI suite; build and CI; protected-module diff audit. Production DB reads remain separate from fixtures. Release and any bounded historical outcome catch-up require exact-SHA owner approval. Entry and Real must remain OFF throughout.

The A-mode deadline is a separate reliability follow-up, not silently bundled into outcome collection. It should propagate cancellation through all provider requests, constrain the entire fallback chain/funnel, preserve missing-AI behavior and frozen deterministic inputs, record timeout reasons, and prevent late background work from writing decisions. Its budgets and rollout must be reviewed before implementation.

## Pre-registered validation status

The original Phase 9A section 10 remains authoritative: at least 28 days, 300 distinct resolved markets overall, 100 per allowed trading question type, 30 resolved would-open markets; paired Brier/log-loss with the stated bootstrap upper bound; ECE <=0.03 with 10 equal-count bins and bin uncertainty checks; fee-adjusted realized edge; zero H1/H5 violations; <=5% one-hour side flips; category/type breakdowns, abstention comparison and the other original criteria.

Current collection age is approximately 2.120 days; samples and would-open coverage fail the minima. The seven-market exploratory scores use the first finite-prior v2 row per market and join a consistent later v2 outcome, without using that outcome in selection. Four such first rows lack their own stored outcome. This descriptive calculation uses the stored rounded YES posterior, the frozen de-vigged prior, and the existing 0.001 log-loss clamp. It does not establish the complete eligible cohort, equal-count calibration bins, bootstrap evidence or profitability. No inference of engine superiority/inferiority or B/C superiority is warranted.

## Files inspected

`AGENTS.md`, `CLAUDE.md`, `HANDOFF.md`, `docs/AI_HANDOFF.md`, `docs/COLLEAGUE_HANDOFF_2026-09-29.md`, `TRADING_STRATEGY.md`, `docs/testing/stability-test-runbook.md`; `api/predictions.ts`; `scripts/prediction-ai-price-diagnostic-report.mjs`; `scripts/prediction-v2-replay.mjs` presence/history; the four test files below; `scripts/lib/prediction-isolated-env.mjs`; `migrations/prediction_market_observability.sql`; `.github/workflows/production-ci.yml`; relevant Prediction commit history. AI-Log Phase 9A, 9B and 9C reports and its report template. On VPS: deployed-SHA record, release symlink, active service properties, only the nonsecret diagnostic environment value, Prediction gate names, relevant job-runner sections, generated server and Prediction source/bundle markers. Database table/column metadata and aggregate Prediction-only SELECTs.

## Files changed / implementation

- This report and the dated entry in `HANDOFF.md`.
- Local audit scripts and aggregate receipts under `tmp/prediction-continuation-audit-20261001/`; not staged, not used as test fixtures, not published as DB exports.
- Executable application code: NONE. Migrations: NONE. Production database writes: NONE. Scheduler/configuration changes: NONE. Deployment by this task: NONE. User settings: unchanged.

## Tests executed

Command:

```powershell
node --experimental-strip-types --test scripts/prediction-calibration-test.mjs scripts/prediction-resolution-lookup-test.mjs scripts/prediction-shadow-resolution-test.mjs scripts/prediction-ai-price-review-diagnostic-test.mjs
```

PASS, exit 0, Node `v24.19.0` locally: 19 diagnostic tests + 12 calibration checks + 24 resolution-mapping checks + 17 shadow-resolution checks = 72 checks. Node's runner reports 22 test entries because three assertion scripts are each one runner entry; do not substitute 22 for the underlying checks or claim 72 native node:test cases. Offline source extraction/in-memory transports only; no production data were used as fixtures. These tests confirm current behavior, including the existing VALID-only restriction; passing them does not close that design gap.

Full Prediction suite/build/typecheck: NOT RUN locally for this documentation-only audit. The production-writing legacy position-credit test was explicitly excluded. No test guard or expectation was changed.

One supplemental aggregate SQL statement exceeded its enforced 20s timeout; its read-only transaction was aborted. Previously returned primary results remain from the stated snapshot. The supplemental question was rerun with a materialized distinct-outcome join and completed successfully in a separate read-only snapshot. An initial exploratory query had an ambiguous timestamp alias and was corrected before use. An initial bash audit had Windows CRLF transport errors; final verification used LF bytes via subprocess stdin and exited 0. These failures are not reported as PASS.

## CI / build / deployment evidence

Existing audited SHA `b211db170dc3e35fd2965cdb74e496df5998d19a`:

- [Production CI 36735237158](https://github.com/signal0verse/signalverse-main/actions/runs/36735237158): completed/success.
- [Artifact preparation 36736844117](https://github.com/signal0verse/signalverse-main/actions/runs/36736844117): completed/success.
- [Production release 36741930581](https://github.com/signal0verse/signalverse-main/actions/runs/36741930581): completed/success.

These runs predate this task. No CI workflow or production release was dispatched by this audit. The documentation-only core publication uses `[skip ci]`; active runtime remains the verified SHA above.

## Status / remaining limits

- IMPLEMENTED: existing v2 engine/lifecycle/diagnostic; no new runtime implementation in this task.
- TESTED: 72 focused local checks; existing exact-SHA CI verified separately.
- DEPLOYED: existing runtime `b211db170dc3e35fd2965cdb74e496df5998d19a`; no deployment by this task.
- OBSERVED IN PRODUCTION: counts, temporal metadata, active diagnostic, gates, runtime source parity and missing outcome coverage above.
- NOT YET VALIDATED: probability calibration, profitable fee-adjusted edge, independent AI evidence, B/C superiority and autonomous Demo lifecycle in production.
- REMAINS OFF: autonomous Demo entry / prediction-enter-cron; Real orders, trading wallet signing and blockchain execution; autonomous learning scheduler.
- Protected modules were not edited. Existing unrelated/untracked work was preserved. No private account identifiers, keys, environment files, raw account data or DB exports are included in this publication.

## Recommended next step and approval boundary

Approve the bounded v2 outcome-collection implementation described above, with Entry and Real OFF and a separate release approval after tests/CI. Do not force trades, lower gates or enable learning to compensate for missing outcomes.

The supplied continuation prompt section 29 says: “If the next task would alter Production behavior, create a design/implementation report first and wait for explicit approval.” Outcome-write coverage and A-mode cancellation both change production behavior, so this audit stops at a concrete design rather than implementing them without that approval.

## Verified core publication receipt

- Documentation commit/main: f5c843ef7bb32293255ea1a52308bc74fc388caf; remote refs/heads/main verified after normal push.
- Commit contains only HANDOFF.md and this report; [skip ci].
- Audited executable source and active production runtime remain b211db170dc3e35fd2965cdb74e496df5998d19a.
- AI-Log publication uses the GitHub contents API on master; its returned commit and remote-content verification are recorded in the local publication receipt and final response.
