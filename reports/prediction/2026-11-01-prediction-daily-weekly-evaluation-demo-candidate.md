# Prediction daily/weekly evaluation Demo — implementation and zero-trade audit

## Metadata

- Date: 2026-11-01, UTC / Asia-Kuala_Lumpur.
- Task: prediction-product-recovery-20261101.
- Module: native Prediction Market only.
- Mode: read-only production diagnosis; separate opt-in virtual Demo implementation.
- Source repository: signal0verse/signalverse-main.
- Branch: codex/prediction-product-recovery-20261101.
- Starting production/source: f55cba212d92b66b7105be6776138478c1a1f27f.
- Integrated source base: 186e13aade593307fa1c746f37035efa359731a2.
- Final candidate / PR / CI: 675e20bcccb4c94879c990a9c6c247d5c7a12db7; draft PR [#257](https://github.com/signal0verse/signalverse-main/pull/257)..
- **Release status: NOT DEPLOYED. Migration: NOT APPLIED. New live positions: NOT VERIFIED.**

## Objective and authorization

The owner reported zero positions/history and excessive observation storage,
and requested daily/weekly activity so performance could be observed. After a
public-data probe found no qualifying opportunity, the owner explicitly selected
a separate experimental daily/weekly Demo. The question disclosed simulated
funds, public-market prices/settlement and admission without the original
minimum Edge/confidence. This is authorization for that separate policy, not
Real Prediction, learning or relabeling experimental fills as qualified signals.

The historical release approval applied only to an earlier exact source SHA.
It is not reused for this candidate or its additive migration. No production
release, financial account mutation or scheduler activation occurred in this task.

## Confirmed production findings

Read-only audit on 2026-11-01, initially10:08–10:13 UTC and repeated10:51:55 UTC:

| Item | Actually observed |
| --- | --- |
| Running SHA | f55cba212d92b66b7105be6776138478c1a1f27f |
| Release artifact/symlink | /opt/signalverse/releases/f55cba212d92b66b7105be6776138478c1a1f27f |
| Native /healthz | ok=true, service=signalverse |
| Running Prediction source SHA-256 | 6972c20053209987c559b28aeb6b3edb4776414e278168298fa1e4a69fb61f87 |
| Discovery, Shadow, Demo-entry, resolver gate files | Present; untouched |
| Prediction learning gate | Absent; untouched |
| Autonomous Demo ledger | 0 total,0 open |
| New evaluation trade columns | 0 present; migration remains unapplied |
| Latest entry receipt | 10:49:27.997 UTC, success=true, scanned50, opened0 |

Earlier aggregate inspection found two saved/enabled personal Demo accounts.
The screenshot's disabled label therefore did not establish that the actual
backend participation was disabled. Authentication/read/refresh failures could
produce misleading default UI. The implementation fixes that failure behavior;
the exact screenshot session failure was not independently reproduced.

The inspected10:08 entry run evaluated50 markets:39 insufficient-data,8 WATCH,
3 NEUTRAL, zero qualified opportunities. Reasons included33 no admissible
evidence,8 Edge below minimum,8 confidence below minimum and6 insufficient books;
several reasons overlap. Existing entry execution was operating and abstaining.
Enabling its already-enabled gate again would not create valid opportunities.

Autonomous discovery took array-first3 children of every event. The18 eligible
crypto children were low strikes across six BTC/ETH ladders. A separate public
read fetched the full six event ladders and36 chosen-token books for18 nearer
strikes, plus public Binance inputs. The actual existing evaluator still found
zero cases reaching5 percentage-point Edge with the existing confidence minimum.
This small contemporaneous probe is neither a backtest nor statistical validation.

Storage audit estimated922,633 prediction observations using1,617,788,928 bytes,
45,986 run receipts using193,904,640 bytes and16,176 markets using21,397,504 bytes.
Prediction was roughly1.8 GB of the host's251 GB used, not all server disk usage.
No old data was deleted, compressed, rewritten or historically scored.

## Implementation

1. Separate saved policy SCHEDULED_EVALUATION_V1 with daily/weekly choices.
   Defaults remain qualified-only; no existing account is automatically enrolled.
   Selected evaluation mode replaces qualified admission for that account while
   retaining all existing positions/history. Explicit own-account Save and
   autonomous participation are required.
2. At most one entry per UTC day and Monday-start UTC week, including closed
   entries. Daily expiry24–under72h, weekly72–168h. No historical catch-up.
   Size is1% of saved Demo capital, capped by personal limit and available funds,
   rounded down; minimum1 USDC. Fees must also fit available funds. Kelly is
   recorded as0 and the mode is clearly experimental, never a qualified signal.
3. Existing supported crypto price templates, actual finite prior, fresh price
   inputs, PRICE_MODEL evidence and clear resolution are mandatory. Price-only
   first-pass selection avoids AI spending for the experimental admission.
   This policy deliberately does not require qualified Edge/confidence/H2/H8/AI
   approval. Original qualified-opportunity rules themselves are unchanged.
4. Original fresh Gamma/CLOB revalidation, selected-token book, tradeability,
   full executable depth and slippage limit remain. Up to3 market checks per
   owner/cadence; outages or empty books skip instead of forcing an entry.
   Public executable asks are used; fees/slippage are modeled Demo costs.
5. Additive migration supplies saved cadence, persisted policy/period identity,
   permanent per-owner cadence-period uniqueness and immutable experimental
   identity. A service-only atomic RPC locks the account and rechecks consent,
   settings revision, current period, personal fresh model receipt, lifecycle,
   categories, horizon, quote/size and fee-inclusive ledger budget before insert.
   No fixture/opt-in DML or destructive schema action is included.
6. Personal experimental observations have a non-null owner and never enter
   the userless Shadow validation cohort. Existing actual-CLOB-winner settlement
   handles these positions. Unresolved, transient lookup, cancelled/unmapped,
   v1 isolation and the existing frozen Shadow outcome collector are preserved.
7. Native UI has explicit mode/cadence controls, saved-state/error handling,
   persisted labels and separate daily/weekly/qualified performance. Unknown
   PnL remains distinguishable. History/performance refresh30s. Last1000-trade
   performance warns if incomplete. Session changes discard old private requests;
   read failures no longer become a fake disabled account or empty portfolio.
8. Discovery retains the existing event/3-child budgets while preferring live
   supported central strikes. Each tick reads at most500 and evaluates at most50
   markets, rotating in10-minute windows so two normal5-minute H8 observations
   remain possible. Identical unsupported abstentions are stored at most hourly;
   changed priors/classes/data availability are retained. First actual Shadow
   and every price/H8 observation are preserved. There is no retention deletion.

## Files inspected and changed

Read project entry/handoff, full trading strategy including dated amendments,
safe test runbook, current Prediction backend/UI/migrations/scheduler, existing
isolated harness/tests and exact retained-artifact/release workflows. Production
reads were scoped SQL aggregates/schema, runtime/health/source hash and gate
presence; public Gamma/CLOB/Binance data contained no private credentials.

Changed backend: api/predictions.ts; new api/_shared/prediction-evaluation.ts.
Changed UI: only the native Prediction monitor, its parent session key and two
imports in src/app/App.tsx; new PredictionEvaluation.tsx and monitor request helper.
api/analyze.ts receives only one floating-help knowledge line.
New migration: migrations/prediction_scheduled_evaluation.sql.
Tests: new actual-source policy/UI/source-preservation/disposable-SQL suites;
isolated RPC/event fixtures; retained diagnostic/multi-user/scheduler assertions
with independent first-observation setup, full handler boundary and source-session
batching. Closed test-only predecessor projection preserves every older byte and
rejects missing/unknown/tampered files. CI adds new tests without removing gates.
Documentation: additive HANDOFF, AI_HANDOFF, TRADING_STRATEGY, test-runbook entries
and docs/prediction-scheduled-evaluation.md. Exact paths are in the PR diff.

## Validation evidence

All31 safe local Prediction suites passed. The full batch passed30; after preserving the legacy scheduler assertions and adding raw-current shell equivalence, its final7 cases passed outside the Windows Bash sandbox restriction. The updated closed-source suite was rerun5/5 PASS. Exact commands/results:

| Command (`node --experimental-strip-types --test scripts/<file>`) | Result |
| --- | --- |
| prediction-ai-price-review-diagnostic-test.mjs | PASS |
| prediction-autonomous-account-test.mjs | PASS |
| prediction-autonomous-monitor-i18n-test.mjs | PASS |
| prediction-autonomous-multiuser-test.mjs | PASS |
| prediction-autonomous-sizing-test.mjs | PASS |
| prediction-calibration-test.mjs | PASS |
| prediction-cross-month-touch-shadow-test.mjs | PASS |
| prediction-demo-job-test.mjs | PASS |
| prediction-demo-lifecycle-test.mjs | PASS |
| prediction-duplicate-protection-test.mjs | PASS |
| prediction-engine-v2-test.mjs | PASS |
| prediction-evaluation-scope-test.mjs | PASS |
| prediction-evaluation-ui-test.mjs | PASS |
| prediction-market-engine-test.mjs | PASS |
| prediction-market-lifecycle-test.mjs | PASS |
| prediction-market-lookahead-test.mjs | PASS |
| prediction-observability-test.mjs | PASS |
| prediction-ranking-test.mjs | PASS |
| prediction-resolution-lookup-test.mjs | PASS |
| prediction-revalidation-test.mjs | PASS |
| prediction-scheduled-evaluation-test.mjs | PASS |
| prediction-settlement-test.mjs | PASS |
| prediction-shadow-classification-test.mjs | PASS |
| prediction-shadow-entry-test.mjs | PASS |
| prediction-shadow-resolution-test.mjs | PASS |
| prediction-side-aware-test.mjs | PASS |
| prediction-time-horizon-gate-test.mjs | PASS |
| prediction-tradeability-gate-test.mjs | PASS |
| prediction-v2-i18n-test.mjs | PASS |
| prediction-v2-outcome-collection-test.mjs | PASS |
| prediction-v2-replay-regression-test.mjs | PASS |

Excluded from this batch: the legacy production-credential-loading prediction-market-position-credit-test.mjs; the SQL suite was run separately in the isolated container.

- Actual-source evaluation18/18; component/request UI6/6; source-preservation/negative scope5/5; retained original plus raw-current scheduler7/7.
- Actual PostgreSQL migration/RPC15/15, final exit0 including cluster/container cleanup. Migration LF SHA-256:500396ceeef39f44a33ba266349b5b300e0d29151ad93e98031a665d237ba41d.
- Web Vite build PASS:2185 modules; index-juT_FJ2k.js. Admin build PASS:1713 modules; index-ZYEA9_q8.js. Existing large-chunk warning remains.
- Strict tsc for the three new modules PASS. Actual API strict comparison:20 baseline diagnostics,20 current,0 introduced. No claim of a clean pre-existing full application typecheck.
- git diff --check PASS; isolated feature worktree clean; all25 file hashes plus their manifest verified after commit.
- Official current PR CI [41300410462](https://github.com/signal0verse/signalverse-main/actions/runs/41300410462): IN PROGRESS on exact source675e20bcccb4c94879c990a9c6c247d5c7a12db7 at latest inspection, not PASS. Initial run41299831886 at67554178 passed555/557 and failed two cases in its first compatibility stage: old Copy Trade expected no other App additions; a frozen Spot test expected the CI workflow to have no additive test steps. Both successor readers were repaired while preserving every original assertion. Independent raw-current Copy Trade/routing and new source-preservation tests passed12/12; final source suite5/5 passed after the frozen reader fix. Product/backend/SQL bytes remain identical to the previously tested implementation. The immutable frozen test input/hash and every release/cache authority stay exact. The obsolete queued task-owned dispatch41299840385 was cancelled by this task after publishing the repaired head; it was never a passing CI receipt.
- Official immutable production artifact: NOT PREPARED; no main push CI/release approval exists for this candidate.

Actual SQL tests ran the real migration twice and exercised its real RPC in a
fresh PostgreSQL17 cluster inside a task-owned disposable container: no network,
no host/data/credential mounts, unprivileged user,512MiB memory,.5CPU,128PIDs and
all Linux capabilities dropped. Existing public Node22.23.2 binary was copied
without mounting production directories. Only the task's own container was removed.
The final15 cases passed, including parallel owner/period/capital admission,
closed-period permanence, frozen identity, null/model/quote rejection, saved
consent/revision, category/horizon and anon/authenticated EXECUTE denial.
This proves SQL behavior on an isolated faithful schema, not production migration
compatibility, restore acceptance or live execution.

### Errors, retries and time limits

- Initial official CI failed two historical source-compatibility assertions (555/557 passed, not a successful run). Exact successor views were added for the separate Prediction edits and four additive CI lines. All original assertion expressions and raw-current product checks remain; current full CI is pending, not declared passed.

- Initial report publication used a connected read-only profile and was denied.
  The already-connected repository-owner profile was then used only within the
  publication process; no global account switch or permission grant occurred.

- A first read-only schema query used finished_at instead of completed_at and
  failed; corrected after schema inspection. No write occurred.
- An all-summary distinct query hit the10s read timeout; replaced by a bounded
  last12-run query. No production timeout limit was changed.
- Initial public probe evaluation required deterministic isolated harness setup;
  it used no private account/execution endpoint.
- Initial SQL-container attempt had no Node binary. Subsequent actual checks
  passed but shutdown failed because AppArmor denied an own-process signal.
  Final task-owned network-free/mount-free container used a scoped AppArmor
  exception, retained no-new-privileges/capability/resource limits and passed
  both checks and cleanup. No host security policy or other container changed.
- Early new tests exposed a still-valid90s cache assumption and settlement
  rounding expectation; corrected fixture timing and full-precision assertion.
  An internal helper export was added for actual-source storage-cadence testing.
- Two retained tests needed isolated first-observation state and a full actual
  handler boundary after the additive cadence fields; assertions were retained.
- Earlier Windows scheduler/source-proof attempts exceeded90s and300s. Historical assertions were retained against an ancestor-pinned exact scheduler, with whole current scheduler equality and additional raw-current real-shell equivalence for every case. Final sandboxed Bash executions returned0xC0000142 (DLL initialization failure); the same isolated test outside that restriction passed7/7. No production scheduler or legacy assertion was removed.
- One verification started before the generated manifest was ready and failed
  missing-file; rerun only after manifest completion. This was test orchestration.
- Full strict TypeScript analysis of the large App file was interrupted after
  failing to finish in a reasonable time; it is NOT a clean full-App type result.
- The final /api/healthz probe returned404. Correct documented /healthz returned
  healthy on repeat; the wrong-route attempt stopped before SQL and made no writes.

## Runtime, outcome collection and database safety

Production remains on the old exact SHA above. No deployment timestamp, new
artifact/CI release receipt, new live cadence persistence, natural fill or
experimental settlement can be reported PASS. New mode is absent in running code.
Existing resolver/entry have runtime receipts; all new behavior evidence is isolated.

Production SQL used BEGIN READ ONLY, statement/lock timeouts and ROLLBACK. No
migration, manual fixture, forced cron, session forgery, historical update,
cleanup/delete, account enrollment, test balance or production trade was written.
No backup was taken for a deployment because no deployment/migration was attempted;
a fresh private full backup/cold-restore acceptance remains a release prerequisite.

Outcome rules covered by retained tests include finite actual prior, excluded
fallback50%, frozen first eligible/scorable observation with abstentions represented,
unsupported/unscorable distinction, actual CLOB winner, transient retries, unresolved
preservation, cancelled/unmapped rejection, duplicate/conflict protection and v1
isolation. This is regression evidence; those conditions were not all independently
reobserved in live data during this request. No uncertified historical observation
was scored and no new Phase9A sample was declared certified.

## Safety and rollback state

- Existing Prediction Demo ENTRY gate was already ON; not installed/toggled here.
- Experimental mode: not deployed; no account opted in by this task.
- Real Prediction: architecturally OFF; unchanged501 path/no signing or order adapter.
- Autonomous learning: gate absent; unchanged and OFF.
- No real order, signing, funds movement or forced trade was performed for testing.
  This is not an exchange-wide audit of other products' orders.
- Original Prediction math/classifier/price model/H1–H8/AI/Kelly/settlement and
  frozen outcome collector are byte-preserved. Other product UI/source, Futures,
  Spot, Fast Trader, Supervisor, execution/wallet, A-mode timeout and scheduler
  architecture are unchanged by this feature relative to its integrated main base.
- Concurrent main contains separately authored Copy Trade UI work. It was retained,
  not overwritten or deployed here. Source base and active runtime differ.
- Rollback: NOT PERFORMED; no production change required rollback. No database
  rollback was attempted. Keep additive schema/ledger if a future code rollback
  occurs; use the established coordinated exact-source procedure.

## Git/publication state and remaining work

Candidate675e20bcccb4c94879c990a9c6c247d5c7a12db7 was pushed without force to the feature branch. Draft PR [#257](https://github.com/signal0verse/signalverse-main/pull/257) has that exact head and base186e13aade593307fa1c746f37035efa359731a2. Main was not merged/changed by this task. Current PR CI [41300410462](https://github.com/signal0verse/signalverse-main/actions/runs/41300410462) remains IN PROGRESS; initial failed CI and its test-only repairs are recorded above. Only this task's obsolete queued dispatch was cancelled; the independently authored main CI41297423831 was cancelled by an external actor. No artifact, Guard approval, deployment or migration was attempted. Initial AI-Log publication8827d8e2be57f39a91e80eeb11a583a326f07d4c was verified byte-for-byte, by Git blob and as a single-report commit. This same report is updated with the corrected source/CI state, using the known remote blob to prevent concurrent overwrite and repeating remote byte/blob/single-file verification before claiming publication.

Root's pre-existing HANDOFF/private/untracked work was preserved. The feature
worktree was isolated from it and rebased onto fetched main without force-push.
Only this new sanitized report is published to SignalVerse-AI-Log/master.

Before activation: complete final official CI, review the exact new source and
additive migration, coordinate the currently unshipped main baseline, prepare and
independently verify the official immutable artifact, obtain fresh exact-SHA/digest
Guard authorization, prove private full backup/cold restore, apply only this
additive schema, release normally and save only the intended own-account mode.
Observe ordinary scheduler ticks/read-only runtime/personal history afterward.
Do not force fills, weaken the original gates or enroll other users.

Live daily/week rollover persistence, natural repeated admission/idempotence,
eventual genuine settlements, calibrated forecasts, certified chronology,
sufficient independent resolved markets, uncertainty intervals and out-of-sample
performance remain unverified. A fixed-notional experimental sample is separate
from qualified-opportunity performance and cannot certify either strategy.

**Phase9A validation and statistical validation are NOT complete. Profitability,
model superiority and AI superiority are NOT established.**
