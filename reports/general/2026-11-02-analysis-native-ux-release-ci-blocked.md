# Native Analysis UI release — blocked by exact-SHA official CI

Recorded: 2026-11-02T09:05:10.928780+00:00

## Executive result

DEPLOYMENT=NOT_PERFORMED
NEW_CHART_AND_EXPLANATIONS_ACTIVE_IN_PRODUCTION=NO
FINAL_CLASSIFICATION=OFFICIAL_CI_FAILED_RELEASE_STOPPED

Owner approved deploying the reviewed local native Analysis chart and concise
explanation UX. Source was normally fast-forwarded to main, but the required
normal main/push Production CI failed. Stop conditions were honored. No artifact
preparation, Guard creation, release dispatch or activation followed that failure.

## Exact identities and publication

- Original main and still-active Production: `2acedfab056262f0157d8b6b9a9ecea447ff2fdf`.
- Reviewed product source: `d54db3fd39349510d60f44cd7d033f764173aa58`.
- Final pushed main/candidate: `41c257651ae8a24cdfa829ee2802f3b3263dc55a`.
- Normal local test-only follow-ups: `4e398cd86b95ff240e6f3e201c19ae811f3d3af7`
  and the final candidate above. Reviewed product bytes in src/api remain exact.
- Retained source branch: `codex/analysis-native-ux-release-20261102`.
- Retained previous main: `codex/rollback-analysis-native-ux-20261102`.
- Atomic normal source push, no force, rewrite, amend, squash or rebase.
- Current authenticated remote main remains the candidate above.
- Official CI: [41405278916](https://github.com/signal0verse/signalverse-main/actions/runs/41405278916).
- head_branch=main, event=push, attempt=1, conclusion=failure.

## Actual current results

Fresh local reviewed UI suite: 135/135 PASS.
Historical publisher suite: 140/140 PASS.
Clean final local closed release suite: 14/14 PASS.
Focused TypeScript, Web/Admin build and diff check passed locally.
These local results did not substitute for the required complete official CI.

Official job `Build web and API runtime`: FAILURE.
Official step inventory: 79 unchanged steps; 39 success, 1 failure, 39 skipped,
0 cancelled. Skipped later gates/builds are NOT claimed as passed.

Failed step #38:
`Test Spot setup display and complete detail preservation offline`.
Started 2026-11-02T08:18:50Z; failed 2026-11-02T08:44:13Z.
Commands:

```sh
node --test scripts/spot-setup-views-test.mjs scripts/spot-setup-views-scope-test.mjs
```

The step's test process reported 1,268 tests: 1,267 PASS, 1 FAIL, 0 skipped/cancelled.
This is the count for this failed step, not the entire CI test population.

Exact failing subtest:
`actual legacy restore renders native saved plan and review without inventing technical evidence`

Exact authoritative error:

```text
location: scripts/analysis-scenarios-release-test.mjs:53:1
The expression evaluated to a falsy value:
  assert(html.includes('LEGACY_STORED_REASON'))
code: 'ERR_ASSERTION'
name: 'AssertionError'
expected: true
actual: false
at scripts/analysis-scenarios-release-test.mjs:60:62
Process completed with exit code 1.
```

CI log ZIP SHA-256: `6361441c17142829b45eeab7539bf148870aa05e6db835435af0668d31a6b93f`.
The complete authoritative step log is preserved locally in
`tmp/analysis-ux-ci-blocked-20261102/failed-step.log`.

## Narrow source finding; no repair performed

`src/app/App.tsx:17645` passes `evidenceOnly` to the native AnalysisPanel,
including the legacy stored-report branch. `src/app/App.tsx:1712` wraps the
old panel material in `!evidenceOnly`. The actual saved-report render therefore
does not include the stored reason. The test reads a synthetic saved legacy
report and renders the real source; it is not a live account or exchange test.

The release cannot be accepted by dropping this assertion or treating the local
135-test suite as complete CI. A future narrow repair must preserve stored legacy
reason/review/values in read-only history while retaining the new native chart UX
and its removal of misleading active four-rung scenarios. It must revalidate the
actual legacy consumer, raw native UI, closed scope, builds/types, then obtain a
new exact-SHA official CI acceptance before preparation/Guard/release.

No source/test fix, new application commit, follow-up push or CI rerun was done
after this official failure. No claim that later CI gates would pass is made.

## Production hard-stop readback

Verified at 2026-11-02T09:03:38.317218+00:00:

- Runtime marker and app/admin/partner symlinks remain `2acedfab056262f0157d8b6b9a9ecea447ff2fdf`.
- All eight inspected service PIDs, start stamps, restart counts and enable states
  match the pre-release baseline exactly.
- App/admin/observer/partner/receiver/Paper/PostgREST remain active.
- Canonical PP worker remains disabled/inactive/PID0.
- Existing Real/Demo PP flags preserved exactly; no flag changes.
- All 22 control fingerprints match the prior successful release.
- Target approval absent, target claim absent, target release directory absent.
- No exact-SHA prepare-only or Production Release run exists.
- One-job CI runner exited; its isolated container was automatically removed.
- Production egress was blocked in that CI container; no production directories
  or credentials were mounted. No trading fixture used Production.

Existing complete cold-backup evidence was checked, including full dump/SQLite
checksums within the established 24-hour window; no new backup or migration was
performed. Only operational preflight receipts were written on the server.

## Scope and verification limits

The intended 34-path source change implements the reviewed full-width persistent
native chart, daily/weekly evidence, compact conditional buy/profit-review summary,
soft centered zones, bounded labels, reset/fullscreen and closed disclosures.
It does not change engine decisions, Strategy, Risk, Scanner, execution, financial
schema or worker behavior; API analyze changes one descriptive help line only.

Automatic browser review rejected private authenticated Telegram-origin
observation because private-session reading was not explicitly authorized.
No bypass was attempted. No already-published public chart report was available,
and no live analysis/message was created merely to obtain a screenshot.
No Production appearance of the new UI is claimed: it was never activated.

## Safety

SOURCE_PUSH=YES
MAIN_CANDIDATE=41c257651ae8a24cdfa829ee2802f3b3263dc55a
CI=FAIL
ARTIFACT_PREPARATION=NO
GUARD_CREATED=NO
RELEASE=NO
DEPLOYMENT=NO
MIGRATION=NO
DATABASE_DDL_DML_BY_OPERATOR=0
PP_WORKER_STARTED=NO
PP_FLAGS_CHANGED=NO
EXCHANGE_ACTIONS_BY_OPERATOR=0
ORDER_POSITION_SL_TP_CLOSE_ACTIONS_BY_OPERATOR=0
APPLICATION_SOURCE_CHANGED_AFTER_CI_FAILURE=NO

The failed CI is the release blocker. Production remains healthy on its original
release. Offline tests/health are not profitability or exchange execution proof.
