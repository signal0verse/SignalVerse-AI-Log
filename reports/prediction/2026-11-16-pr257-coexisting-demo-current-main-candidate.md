# PR 257 current-main revision for coexisting Demo entries

## Metadata

- Date: 2026-11-16, Asia/Kuala_Lumpur.
- Module: Telegram Prediction Market.
- Source: [draft PR 257](https://github.com/signal0verse/signalverse-main/pull/257).
- Current main base and live runtime: `59fb9e17a26dcae3eaaee1b58ec6af5efa2f48cd`.
- Earlier PR SHA: `675e20bcccb4c94879c990a9c6c247d5c7a12db7`.
- Current candidate: `0578551fa195c17a24d1384bc7579db3a66a824f`.

## Objective and implementation

The owner asked to revise the existing PR on current main, preserve qualified
entries, add daily and weekly virtual evaluation for later personal activation,
resolve the archive and CI blockers, and submit the new SHA before deployment.

Qualified v2 admission continues for opted-in accounts with the original
classification, evidence, H1–H8, ranking, Kelly calculation and settlement.
The existing scheduler processes qualified candidates first. Scheduled
evaluation excludes actionable markets awaiting H8 and uses other eligible
markets with fresh model evidence, a bounded full quote and modeled fees.
The daily and weekly checkboxes are independent and start unchecked. The
authenticated settings write remains scoped to its user. A user may save both
and continue receiving qualified opportunities while participation is enabled.

The additive PostgreSQL migration keeps one evaluation per owner and UTC
cadence period and preserves each entry's admission identity. Qualified
and evaluation admissions share the fee-inclusive virtual balance and
serialize on the account row while evaluation is enabled or remains open.
Existing trades keep their labels, receipts and outcomes. Real Prediction
and autonomous learning remain off. Neither the scheduler nor its gates changed.

## Packaging and CI repair

The starting main archive was 8,388,556 bytes, 52 bytes below the 8 MiB cap.
Higher gzip compression was investigated. The implementation kept the existing
release producer and limits and instead moved the complete CI-only Futures
reanalysis and Prediction cross-month test bodies behind the repository's
existing immutable Git source loader. The tests verify complete SHA-256 source
bytes and continue running their original assertions. There is no runtime
dependency on retrieving these test bodies.

The exact candidate inventory is verified against working, index and committed
Git bytes before supplying predecessor inputs to old exactness assertions.
The original CI workflow, release workflows, receiver, Guard, packager and
scheduler are byte-identical to the current main base. The current Prediction
API, SQL, UI and archive tests run against the actual candidate.

Local exact-source archive is 8,382,475 bytes, 6,133 below the unchanged ceiling, with 2,762 Git blobs and executable modes independently matched. SHA-256 `dd8691bfddc4f2097ad65043de061d5424ab3cd02b2c108968ed261fe75f2bb6`. The local archive is a verification artifact for review.

## Validation

- 46 actual Prediction coexistence, lifecycle and UI cases passed.
- 16 actual migration and concurrency checks passed in disposable PostgreSQL
  with no host mounts or network and no connection to the production database.
- 92 additional Engine v2, Shadow outcome, AI diagnostic and per-user checks passed.
- 174 cases executed from the two immutable test programs and passed.
- Web and admin builds passed. All 14 API entry points bundled for Node 22.
- 228 protected Prediction declarations, non-Prediction UI, other Analysis/help code, and existing scheduler and release workflows matched current main. Git diff whitespace checks passed. The feature source is tracked and clean.
- Nine exact-source historical archive and preservation checks passed locally, including all three assertions that rejected the previous PR package.
- [Exact source PR CI](https://github.com/signal0verse/signalverse-main/actions/runs/43867865322) recorded **in_progress** and 4 passed steps. The tested GitHub merge tree matches the candidate tree `9485bd9b356ac3d062e67a449c3bc1818f352dd7`. Most recent active or failed steps: Install dependencies. The first new run failed six historical scope and type assertions. The revision restored rejection of injected unreviewed source, preserved prior input inventories, and retained the original import order for shared React and chart dependencies. The targeted frontend diagnostic test then passed with 66 original and 66 current diagnostics, with zero introduced or dropped. The second run passed the formerly failing source gate, then was superseded by the child-test correction. The final child suite independently executed and passed all 25 cases after removing Node’s inherited test context. The original assertions and workflow remain in force. The [third run](https://github.com/signal0verse/signalverse-main/actions/runs/43861548174) passed 1,294 of 1,295 Spot preservation cases, including the prior archive failures. Its sole remaining failure was an Analysis historical source comparison that included the new Prediction-only help line. This revision proves that removing just that line recovers current-main Analysis source byte for byte, then runs the original comparison. All 135 nested Analysis cases passed locally on the revision. The current Spot preservation gate was pending. The current Prediction gate was pending.

During archive work an alternate legacy Stablecoin suite exposed four existing
panel-related assertions under a supplemental local run. That alternate
transport was discarded and the Stablecoin file stayed byte-identical to main.
An official packaging CLI invocation requires CI provenance. The package check
instead used the unchanged producer's local library API, independently verified
every committed file and executable bit, and did not produce a release receipt.

## Production and publication state

Read-only verification returned healthy runtime at the main base at 19:30 MYT,
with matching release symlink. Existing Demo entry/resolution were enabled and
the learning gate was absent. The verified runtime source continued disabling
Real Prediction. Evaluation columns were absent. No migration, account save,
production deploy, forced tick, live evaluation position, wallet action or
rollback occurred. First future genuine evaluation and statistical validation
remain pending. The migration and per-user settings await the subsequent
controlled production release. Production still requires
official exact-main CI and independent release authorization.

Source was pushed only to the existing PR branch with fast-forward history.
The dated sanitized report is a single-file publication to AI-Log master.
