# Auto Scanner engine opportunity activation precheck

## Metadata

- Client date: 2026-10-04, Asia/Kuala_Lumpur (UTC+08:00).
- Evidence window: 2026-10-03T16:06:58Z–16:10:56Z, client 2026-10-04 00:06:58–00:10:56.
- Workspace HEAD: 0dbca62357a4adf34240f40ceda3e387356ec4b0, existing dirty/private work preserved.
- Production marker/app symlink: a9d43d676911cbe947af0d0c1ec080031a4151ab.

## Objective and scope

The owner initially authorized enabling the existing automatic scanner, then added two conditions before activation: avoid rapid list churn and give the Engine enough opportunity to analyze candidates before replacement. Valid candidates must stay; candidates that cease to qualify should be retired/replaced according to existing scanner rules.

The new condition cannot be guaranteed by merely creating the existing five-minute gate. Activation was therefore not performed. No application fix is claimed.

## Read-only actions and findings

SSH inspected the existing gate directory, installed runner, runtime provenance, fast timer/service and main/admin/observer metadata. Bounded PostgreSQL READ ONLY transactions inspected aggregate profile, setup, run and decision metadata. No private identifier, credential or account/trade row was published.

| Check | Result |
| --- | --- |
| Scanner gate before / final | OFF / OFF |
| Existing fast timer | active/waiting, next trigger 16:10:04Z at initial snapshot |
| Latest completed fast service | Result=success, ExecMainStatus=0 |
| Enabled scanner profiles | 5 Demo Binance, 1 Real Binance |
| Active Discovery setups | 14 Demo, 8 Real |
| Active Discovery loops | 14 Demo, 8 Real |
| Other active manual Demo loops | 15, out of 29 active manual Demo rows |
| Total active loops across these rows | 37 |
| Demo Discovery rows with matching persisted Engine decision | 6 of 14 |
| Real Discovery rows with matching persisted Engine decision | 8 of 8 |
| Production SHA before / final | a9d43d676911cbe947af0d0c1ec080031a4151ab / same |

The decision read checks for an existing engine_decisions row with the same user, mode, symbol and asset_class=futures, created after the setup was created. It is not a durable foreign-key proof of which caller analyzed that setup. Eight Demo Discovery rows had no record matching even this predicate. Their exact eligibility, provider outcome and elapsed future analysis time were not inferred.

The Engine's deployed source has FUTURES_PRO_MAX_ANALYSES_PER_TICK=3 and a Real cap of 2, plus admission deadlines, data, membership, credit and open-position gates. Three is an upper bound, not a guarantee that three finish. A five-minute scan therefore cannot guarantee that all listed candidates receive an analysis in that interval.

The installed runner places futures-pro-cron-tick before futures-discovery-cron-tick. This is useful ordering, but does not eliminate the capped queue. Simply choosing a slower fixed scan interval cannot itself prove analysis opportunity for every candidate.

The existing maintenance code preserves valid/ranked-out candidates and candidates with open positions; it does not replace the full list solely because time passed. However, an explicit notCandidate result can retire a Discovery row without checking whether its first Engine decision has occurred. This is the concrete gap relative to the owner's added condition.

The already-deployed 60-second cron phase tolerance is present. The prior gate-OFF diagnosis remains valid and unchanged.

## Integrity and operational state

- Gate file /etc/signalverse/jobs.d/futures-discovery-cron-tick.enabled was absent in the initial snapshot and again at16:10:56Z. No directory or gate file was created.
- Installed /usr/local/libexec/signalverse-jobs SHA-256: e5065de3cca0911815cbab94bfdfa8187d4f26578372e5481690ff6dff46e0c9. Runner was read, not edited.
- Deployed api/copytrade.ts Git blob: 0d8741a9592974bc27b043f72aeef20636dd2a93, matching the observed release commit.
- Initial main/admin/observer PIDs3275208/3275171/3275169, each active and NRestarts=0. No restart command was issued; continuous PID monitoring was not performed.
- All six profile rows snapshot MD5 at16:07:29.938972Z:1e88c0a373102d92fd6bbcd6fbd48d92. No profile mutation was performed. This digest is a snapshot checksum, not a security signature.
- Latest precheck run remained the previously recorded successful15:42:26.629Z scan,521contracts,125shortlisted,0errors.

An initial diagnostic SELECT referenced a nonexistent last_decision_at column and failed inside a READ ONLY transaction; connection exit rolled it back. The corrected query used actual engine_decisions fields. No schema repair, DDL or DML was performed.

## Files inspected and changed

Inspected AGENTS.md, CLAUDE.md, latest HANDOFF.md, prior scanner diagnosis report, docs/futures-auto-scanner-continuous-2026-09-30.md, scanner/watch-tick sections of api/copytrade.ts and the exact deployed source, installed VPS job runner, and headers/relevant assertions of scanner offline test files. Current strategy/AI handoff/test safety documents were read in the immediately preceding diagnostic turn; no strategy work or tests were performed here.

Only this sanitized report and an additive HANDOFF entry were authored. No application source, test, migration, scheduler, profile or Production file changed.

## Required narrow follow-up

Proposed contract, not implemented: keep the five-minute review separate from list replacement; preserve valid candidates and manual rows; protect open positions; add a durable, testable first-analysis-opportunity guard before replacing a newly admitted candidate. Continue retiring genuinely invalid previously-analyzed candidates and select only eligible replacements. An exact time-only delay is not a proven substitute for recorded analysis opportunity.

The failure/timeout/no-credit/no-decision cases must be defined without silently keeping an invalid candidate forever or forcing an order. The existing engine_decisions linkage is not yet an execution-grade setup association. Do not claim this guard exists or enable the Real-inclusive scanner based on that assumption.

Any necessary source change and release must preserve Engine/Strategy/Risk/SL/TP/execution behavior and use the established CI/artifact/Guard release gates. This task created no new candidate, commit, deployment authorization or financial action.

## Final result

ACTIVATION=NOT_PERFORMED
SCANNER_GATE=OFF
FIRST_ANALYSIS_OPPORTUNITY_GUARD=NOT_PRESENT
APPLICATION_CODE_CHANGED=NO
PROFILE_CHANGED=NO
SCHEDULER_CHANGED=NO
DATABASE_MUTATION_BY_AGENT=NO
DEPLOYMENT=NO
SERVICE_RESTART=NO
MANUAL_SCANNER_TICK=NO
EXCHANGE_CALLS_BY_AGENT=0
ORDER_ACTIONS_BY_AGENT=0
POSITION_ACTIONS_BY_AGENT=0

Final classification: ACTIVATION BLOCKED BY NEW ENGINE OPPORTUNITY REQUIREMENT. Profitability or guaranteed prevention of user losses is not claimed. The owner's initial activation request remains incomplete.

