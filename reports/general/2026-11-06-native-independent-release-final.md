# Independent Native SignalVerse release: actual final result

Verified on 2026-11-06, through approximately 13:57 UTC.

**The official release succeeded and the active Native runtime was independently
verified at `59fb9e17a26dcae3eaaee1b58ec6af5efa2f48cd`. Full official CI passed.
Actual daily/weekly chart, live-quote and saved-history checks were performed in
the existing Telegram Mini App. The remaining visual limitations are stated below.**

## Source and unchanged acceptance gates

Seven normal commits after `515a58eed3f42a487cd5e8033ac39adff49d05a4` were normally
published once to main and `codex/ci-fixed-object-transport-20261106`. Rollback
references and earlier branches were retained; no force push or rewrite occurred.
Only five CI/documentation leaves differ from that immediate predecessor. The
application/chart work already present in that predecessor is now deployed.

The CI repair preserves original test bodies, numeric expectations and frozen
source contracts. The original checked-Git raw loader and expanded program were
restored exactly; two new transport regressions live in the existing boundary
suite. The immutable-object transport changes data I/O only, executes the complete
canonical programs freshly, and clears transient staged data. It does not cache
test passes, intercept tests, wrap old asynchronous callbacks or bypass witnesses.
All original cache/witness implementations and policies, workflow commands,
producer, Guard, resource limits and 8 MiB archive cap remain in force.

[Official main/push CI 42198770488](https://github.com/signal0verse/signalverse-main/actions/runs/42198770488),
attempt 1, completed successfully at 12:53 UTC. Independent authoritative-log
verification confirmed all 90 YAML / **94 ordered actual steps succeeded**, all
75 original command groups / 87 fragments, 84 selftests, 557 retained cases,
1,295 original cases including all three former failures, 18 chart proofs,
13 catalog cases, all SQL/build/artifact gates and the final FULL audit.
All four individual original compiler comparisons reported `introduced=[]`;
this does not claim that historical baseline TypeScript diagnostics are zero.
The owner allowed longer server testing if necessary, but this run passed within
the unchanged 180-minute workflow; no timeout increase or logical-gate change was used.

Historical cancellations, Windows nonpasses, the earlier 83/84 source-preflight
failure and retained SSH-255 cleanup exceptions remain recorded as such. They
were not converted into passes. Current CI/artifact/release controllers exited
normally with zero and their owned cleanup was independently verified.

## Retained artifact, backup and guarded deployment

[Official artifact preparation 42221678563](https://github.com/signal0verse/signalverse-main/actions/runs/42221678563)
passed all six mandatory / ten actual ordered steps. Artifact **13503054072** was
independently retained and checked against all **2,751 Git blobs and executable
modes**, metadata, embedded commit and provenance. Its original archive is
8,388,556 bytes against the unchanged 8,388,608-byte cap: 52 bytes of headroom,
zero excluded paths, no repackaging. Archive SHA-256:

`2594bd00807eb396277e1e03b71fd2cb3654dd5ff77e5bf8ede3fcab771535f9`

A single new consistent backup and isolated cold restore passed at 13:41 UTC:
all 150 relations and counts/catalog, seven complete paged row-hash comparisons,
both SQLite snapshots, six parser roundtrips and four owner-ACL representation
checks. The temporary cluster was removed. Private data remained on the host;
Production DDL/DML and migrations were zero. The expired historical backup was
not reused or overwritten.

Only the authorized Native Root coordinator and independent prerequisite marker
were transitioned after backup verification. The marker uses six actual retained
retirement receipts, with no CrossVerse network dependency. The 20 other Native
control files, all 17 job gates and retired code pins remained unchanged. A single
readiness capture and fresh full revalidation preceded one exclusive Root-only
0600, one-hour, exact-SHA/exact-digest Guard. It was consumed once; the independent
read-only replay check returned `AUTHORIZATION_CONSUMED`.

[Official release 42227829781](https://github.com/signal0verse/signalverse-main/actions/runs/42227829781),
attempt 1, succeeded at 13:47 UTC: all seven mandatory / eleven actual ordered
steps passed. No duplicate release, renewed approval, bypass or manual archive
upload was used. The deployed Native tree matched all 2,751 Git blobs/modes;
the sanitized admin copy matched its nine allowed source files and three compiled
files. Public JavaScript/CSS bytes matched the installed build, including the
actually loaded `/assets/index-CtKOtV5F.js`.

Two real post-release samples, at 13:48:54 and 13:50:56 UTC, were 121.64 seconds
apart. App, admin and public API health passed both; service PIDs, start times and
restart counts were identical. Runtime marker and release pins matched the exact
source. Schema and all protected controls/job gates remained unchanged. PP flags
remain TRUE/TRUE; the canonical worker remains disabled, inactive and PID zero.
All **25 actual owned registrations and 27 containers**, including the two
source-only preflights, were independently absent. Unused plans were not counted;
unrelated containers were untouched and historical exit codes were not rewritten.

## CrossVerse separation and Forex preservation

The already-completed CrossVerse Trade logical erasure/separation was not replayed.
The final read-only check, at 13:56 UTC, confirmed ten retired Trade routes/assets
return 410, while account, Forex static asset and health routes return 200.
Legacy Trade scripts remain absent from the account entry point.

Later legitimate owner Forex work advanced CrossVerse to
`26209a72ccee1609c6a49d9d7110fc790d116757`. It was inspected and preserved, not
reset to the old retirement commit. The exact known Forex source/cache-key and
vhost differences were reconciled read-only. Latest served Forex bytes, protected
settings and two bounded FPM observations matched. No CrossVerse source, Forex
configuration, service or database was changed by these verification steps.
This is logical retirement/separation, not a new claim of forensic media erasure.

## Actual chart, live quote and history observations

The existing Telegram Mini App was reloaded through its own Reload Page control.
No Analyze, Publish, trading, account-order or private-provider action was invoked.
No hidden application state, network injection or viewport override was used.

The daily full chart displayed candles, volume, RSI, zones, channel callouts and
event markers. Its overlay measured **995 × 420.67 CSS pixels**, with explicit
inline sizing, rather than the former icon-size constraint. The current panel
listed six zones/six recent events and a retained catalog of 251 detections.
Reset view was exercised. Screenshots were visually inspected in the current chat;
no private chat screenshots were published to this repository.

Fresh chart quotes changed from 75,925.07 to 75,948, 75,945.40, 75,847.22 and
75,880 during observation. The regular preview quote and receipt timestamp
matched the header, including 75,847.22 at 13:56:31 UTC. The separate live and
closed price lines were visibly present; the closed reference remained 76,088.01.
The daily input digest remained
`8e6a7cd41a1146b653283b4aa53d02e4431338f91ead4d94fdf68668ca8028be`
through live updates and reload. The displayed report/closed-candle times remained
2026-11-06 00:19 / 2026-11-05 00:00 UTC; current quotes did not rewrite that history.

A saved report was opened without executing it again. Its daily input digest
`8751771d4b09e02f23e3e6aae4d522cf1014ab52d5d7366ccc7b45368e224a8d`
was identical after switching to weekly and back. The independent weekly input
`0382791525ecdc0b9c98e4214d1f9c43dde7761f714a33c2a39ade5db261f231`
rendered its own full candles/zones/volume/channels/RSI view, with RSI 52.27 and
the actual weekly closed-candle time 2026-11-01 23:59 UTC. Historical chart views
contained no live-quote overlay; the separate current header continued updating.
The current live daily full chart was left open for the owner.

Observed limitations: the latest stored daily report lacks independent weekly
evidence, and correctly shows unavailable rather than inventing it; the separate
saved report with real weekly evidence rendered successfully. Close/live/FVG
price-axis labels can crowd when their values are close. The regular preview's
separate current quote and timestamp were readable and matched the header. This
report does not claim perfectly collision-free labels or fresh weekly data for
reports that did not originally store it.

No private exchange execution, profitability, scanner/profile/strategy/risk/job
change, worker activation, order, position, Entry/SL/TP or close action is claimed.
The remaining operation is publication/readback of this actual final report and
removal of the existing follow-up; no further source push or release is planned.
