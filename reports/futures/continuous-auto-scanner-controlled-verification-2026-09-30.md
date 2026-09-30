# Continuous Auto Scanner — controlled Production verification (2026-09-30)

## Result

Controlled one-profile Production validation completed and all temporarily disabled profiles were exactly restored. **Continuous five-minute revalidation did not pass.** The active application remains `b8f66cbc138f53d083ef8ff827cc39e86b00f54c`; the scanner gate is OFF. No additional release was performed. A narrow local correction is commit `b211db170dc3e35fd2965cdb74e496df5998d19a`, but pushing executable code to main was rejected by the safety review pending explicit owner authorization; no push, CI or deployment occurred for that commit.

## Isolation and restoration evidence

- At `2026-09-30T13:56:48Z`, all four then-enabled `futures_discovery_profiles` rows were captured verbatim as private JSON in `/var/backups/signalverse/continuous-auto-scanner-four-profiles-20260930T1356Z.json` (postgres:postgres 0600 in a 0700 directory). SHA-256: `77eb8cd74ecc39dc8066515fe467e8346d63b5a9d1a54290594ca9e732612107`; a fresh query's hash matched before modification. Aggregate composition: three Demo Binance, one Real Binance.
- A bounded transactional script verified the complete snapshot under row locks, retained the lowest-ID Demo Binance profile, and changed only `enabled` to false for the other three rows. Post-check: one enabled Demo Binance, zero enabled Real. No private account ID is included in this report.
- Independent gate file `/etc/signalverse/jobs.d/futures-discovery-cron-tick.enabled` was on only for the bounded natural-timer window. The existing single `signalverse-fast-jobs.timer` was used; no manual tick or second scheduler was created.
- After the third natural invocation completed, the empty gate file was removed. A separate bounded transactional restore required all three disabled rows to match the private snapshot in every column other than `enabled`, then restored only that field. Full JSON/hash of all four enabled rows again equaled `77eb8cd74ecc39dc8066515fe467e8346d63b5a9d1a54290594ca9e732612107`; final aggregate: three Demo Binance and one Real Binance. The next natural timer logged the scanner gate as missing/skipped and run count stayed at two. Gate remains OFF.

## Natural timer and ledger

| Natural timer start (UTC) | Persisted scanner run | Independent outcome |
| --- | --- | --- |
| 14:05:04 | 14:05:57.736, run `8337c38c-1f91-4ded-ba1a-53f61bdd8e28` | `OK`; 520 observed symbols, 123 shortlisted, three final Discovery candidates, zero run errors. The selected Demo profile retired PHA and PUMP with recorded `NOT_CANDIDATE:SCORE_BELOW_MINIMUM` and added eligible HYPE and NOM. |
| 14:10:02 | none | The job completed successfully but the strict `now - last.as_of < 5m` guard skipped a new scan/maintenance pass: the previous scan's `as_of` was late within its timer slot. HYPE and NOM remained active, but were **not freshly revalidated** on this tick. |
| 14:15:03 | 14:15:53.674, run `c0ff9f45-f88e-4942-bb0c-4677a94a8c8e` | `OK`; 520 observed symbols, 125 shortlisted, three final candidates, zero run errors. HYPE and NOM were present in the new candidate set and remained active. Capacity was 10, yet only two priceable/eligible Demo rows stayed active; weak symbols were not forced into empty slots. |

The first and second actual scan `as_of` values were nearly ten minutes apart despite five-minute natural timer starts. This is a genuine cadence defect, not a timer failure or a DATA_ERROR. The initial scan, invalid retirement, eligible replacement, retention on the later full scan, and no forced weak candidates have live evidence. The requested **every-five-minute revalidation does not**.

## Trading and Real isolation

- The selected Demo account's `copy_trades` remained 401 rows with unchanged latest open/close timestamps from 2026-09-28. Across the whole database, Demo/Real trade openings and closings in the gate-on window were both zero. No test order was placed. Scanner code has no direct order or position-close call; local tests cover this, but no claim of private exchange execution is made.
- During the gate-on window, direct bounded query found **zero** `updated_at` changes to Real discovery setups. The Real profile was disabled throughout. Ordinary Real setup updates after gate removal and restoration are outside this scanner validation, not evidence of Real scanner execution.

## Narrow correction candidate and current gate

Candidate `8d97433bb119bd0bcecdfeb23e227e065aac47ee` changes only Cron Discovery's age guard to tolerate at most 60 seconds of timer-to-`as_of` phase offset; user START/refresh, V3, Engine, Risk, Execution, Protection, Reconciliation and Spot are unchanged. Follow-up commit `b211db170dc3e35fd2965cdb74e496df5998d19a` pins the exact reviewed Discovery slice in the architecture parity test, proves the only difference from the prior scanner is that constant/condition, and records this incident. LF-isolated local tests: affected parity/live 49/49, scanner/V3 suite 225/225, V3 coverage 15/15, Web/Admin build PASS. These tests do **not** substitute for official CI or a renewed natural Production test.

Attempted main promotion of `b211db1` was denied by the execution safety reviewer because the owner's conditional authorization for a needed deployment was not accepted as explicit authorization for the **new executable SHA**. The operation did not run. A specific owner question for fast-forward push and CI is pending. A later exact-SHA artifact, separate Guard approval and release authorization would still be needed before any second deployment. Production runtime and gate state remain as stated above.

Final controlled-verification status: **FAIL (five-minute cadence)**. Profile restoration: **PASS**. Unexpected scanner-created orders/position closures observed: **0**. Profitability and Real execution: **NOT TESTED**.
