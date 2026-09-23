# Real Futures structural Shadow — final 24-hour audit, 2026-09-23 UTC

## Scope and evidence time

- Frozen window: `2026-09-22T07:30:00Z` to `2026-09-23T07:30:00Z` (end exclusive).
- Final decision: **Shadow 24h = FAIL**. The ledger is complete, but 186 logged symbol/timeframe inputs omit the candle that had just fully closed at the decision boundary. This violates the protocol's closed-bar data completeness/chronology gate.
- Overall release gate: **RELEASE BLOCKED**. This describes the requested final verification gate; the already deployed executable was not rolled back or changed.
- Evidence collected after the window, from `2026-09-23T08:16:06Z` through `08:23:53Z`, by read-only inspection of the isolated VPS state directory, the unit journal, systemd metadata and Production runtime markers.
- No order, exchange write, leverage or balance change, exchange-credential use, database write, service restart, runner edit, application code or Production configuration change was made in this audit.

## Frozen artifacts and runtime

| Artifact | Observed SHA-256 | Expected / outcome |
| --- | --- | --- |
| `protocol.json` | `92227dd218dfced5a968d5e3cfb45414549e49f9e9d38e3d42b3d5121a3068fd` | Equal; PASS |
| `runner.mjs` | `8ec476e5ecbe3d2b553c5ae1dfacb354a0a8dfbc0c6a52a619975e983c58c2bb` | Equal; PASS |
| `analyze-core.mjs` | `3add500616c13bdc8d395777a2388968fabde1332e66781c45db5032b2df3922` | Equal to frozen manifest |
| `indicator-core.mjs` | `fc40e80659fdf4a490385ad61524e6dd7e614f3cb0e4564105d501407b2636e5` | Equal to frozen manifest |

The manifest's protocol/source hashes matched the files. The observer used the pure engine source derived from `cbc64240002d7b491774aafbfa5d650cd9460956`; this is a controlled proxy, not complete Production orchestration. The Production deploy marker, application symlink and live process working directory each resolved to executable SHA `b88f25ac760b5af7cd6d3b626530fb1b3e9e5397`; `signalverse.service` was active. The deploy marker mtime remained `2026-09-22T17:17:30Z`, and the effective runtime env file mtime remained `2026-09-19T11:11:10Z`. **Unauthorized Production change during this audit: NO observed.** These marker/mtime checks do not prove that no unrelated actor can ever change another file.

## Ledger and service completion

| Required measurement | Final result |
| --- | --- |
| Scheduled decision times | **96 / 96**, first `2026-09-22T07:30:00Z`, last `2026-09-23T07:15:00Z` |
| Ledger records | **576 / 576**, all `OK`, each tick has the six expected symbols |
| Data errors / JSON parse errors / other statuses | **0 / 0 / 0** |
| Duplicate event IDs / duplicate symbol-time pairs | **0 / 0** |
| Missing decision times / incomplete six-symbol ticks | **0 / 0** |
| Decision order / event ID derivation / protocol identity | **PASS / PASS / PASS** |
| Future-dated bars / structural look-ahead | **0 / 0** |
| Latest-closed-bar completeness at decision boundary | **FAIL: 186 symbol/timeframe omissions at 24 decision times** |
| Public GET budget | **780 / 900**, from final `WINDOW_COMPLETE` journal record; no budget or public-data error status |
| Service restarts | **0** (`Restart=no`) |
| Service continuity | One Node PID and one systemd invocation; started `2026-09-22T06:23:59Z`, emitted `WINDOW_COMPLETE` at `2026-09-23T07:30:25.056Z`, then deactivated successfully with `Result=success` and `ExecMainStatus=0` |

The first ledger observation was `2026-09-22T07:30:28.672Z` and the last was `2026-09-23T07:15:29.332Z`. The journal contained 96 full six-event summaries, one per scheduled decision, plus 96 empty repeat summaries from the loop. The final `WINDOW_COMPLETE` reported 576 events and 780 requests. The ledger SHA-256 at audit time was `b05ba2866f60fab919150418d01ba4a657b94f176bbc836310f25ce54e0cd4e1`.

The runner validates that each input has 250 contiguous, fully closed OHLC bars and writes their hashes; raw bars were not retained in the ledger, so this audit can independently verify the recorded close times and the immutable validator code, not reconstruct every raw OHLC value. Every recorded close time was at or before its decision time. The failed condition is freshness of the *latest* already-closed bar at the exact timeframe boundary.

## Actual chronology defect

At `2026-09-22T08:00:00Z`, the 1h candle closing at 08:00 and the 4h candle closing at 08:00 were available to the scheduled decision. All six symbol records instead used bars last closed at 07:00 (1h) and 04:00 (4h). At `2026-09-23T00:00:00Z`, all six records used the daily bar last closed at the previous midnight rather than the one just closed at 00:00.

| Timeframe | Affected symbol/timeframe records | Distinct boundary decisions | Staleness |
| --- | ---: | ---: | --- |
| 1h | 144 | 24 | Exactly one 1h bar |
| 4h | 36 | 6 | Exactly one 4h bar |
| 1d | 6 | 1 | Exactly one 1d bar |
| **Total** | **186** | **24 distinct decision times** | Some affected decisions overlap across timeframes |

All six symbols were affected at each of those 24 decision times (144 of 576 ledger events). The frozen runner's cache key uses `floor((decisionTime - 1) / timeframeMs)`. At a timeframe boundary this selects the previous period's cache entry, which was populated by the preceding 15-minute decision, and reuses it once more. The next 15-minute decision fetches the newly closed bar. Thus the runner's `OK` status and contiguous historical bars missed a boundary-specific freshness requirement. This defect is separate from the journal warning problem below. The frozen runner was not edited or restarted. Any corrected candidate needs an isolated fix and a new prospective run; this failed window must not be relabelled PASS.

## `MISSED_TICK` warnings, evaluated separately

The unit journal contained **1,248** `MISSED_TICK` messages referring to **96** decision times. Every one of the 1,248 messages mapped to a decision time with all six unique `OK` ledger events. Warnings mapping to a genuinely absent or incomplete tick: **0**; warnings outside the frozen window: **0**. The 60-second sleep cap wakes the loop repeatedly after a successful decision and it labels the already-recorded tick missed once it is over 90 seconds late. These messages are an **OBSERVABILITY DEFECT**, not missing execution. They do not cause the final FAIL; the stale candle inputs do.

## Structural counts and limitations

- Independent candidate episode starts: **91**.
- Engine decisions by ledger observation: 161 LONG, 54 SHORT, 361 WAIT.
- Structural reviewer verdicts: **16 VETO, 109 PASS, 90 ABSTAIN, 361 NOT_APPLICABLE**.
- Verdicts are repeated observations and must not be interpreted as 576 independent trades. The reviewer was a deterministic 4h pivot rule; S/R, order blocks and fair value gaps were only diagnostics. No LLM, exchange fill, simulated fill or PnL was produced. Profitability and incremental AI Supervisor effectiveness are **NOT APPLICABLE / NOT VERIFIED**, regardless of episode count.
- Binance/MEXC native protection and fresh Real accounting remain **NATURALLY PENDING**. The previous signed read-only snapshot on `2026-09-22T17:42:48Z` found no qualifying current natural lifecycle; this final Shadow audit did not requery private accounts and cannot promote those gates. Four legacy MEXC database `OPEN` rows were not changed and are not evidence of a current connected native position.

## Gate matrix and action

| Gate | Status |
| --- | --- |
| Production executable identity and previous logger pre-live gate | **PASS** |
| 24-hour Shadow count, uniqueness, errors, budget and service continuity | **PASS** |
| 24-hour Shadow latest-closed-bar chronology/data completeness | **FAIL** |
| Final Shadow 24h | **FAIL** |
| Binance native protection | **NATURALLY PENDING** |
| MEXC native protection | **NATURALLY PENDING** |
| Fresh Real accounting | **NATURALLY PENDING** |
| Profitability / AI Supervisor benefit | **NOT APPLICABLE** |

**Overall: RELEASE BLOCKED.** The blocker is the demonstrated Shadow boundary-cache chronology defect under the owner's final gate, not a missing tick or service interruption. Review a corrected isolated observer and repeat a newly frozen prospective test before changing the Shadow verdict. Do not manufacture a Real trade or infer strategy profitability from this run.
