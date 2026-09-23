# Real Futures Shadow boundary candidate — preparation, 2026-09-23 UTC

## Metadata

- Date: 2026-09-23 UTC; last VPS preflight evidence 13:13:35Z.
- Module: isolated public-data Futures Shadow observer.
- Mode: offline deterministic tests plus prospective, read-only market-data service preparation; no Production release.
- App repository branch: `codex/futures-shadow-boundary-2026-09-23`, based on executable `b88f25ac760b5af7cd6d3b626530fb1b3e9e5397`.
- Candidate local commit: `937f4aebb4613bb321b6becd1724aa985f0b2649`. Branch publication to GitHub was rejected by the local safety reviewer; it was not bypassed. The candidate is therefore committed locally and is **not** on app `main`.

## Objective and scope

Correct only the failed Shadow observer's boundary cache selection in a new isolated candidate; test it offline and observe a short future window crossing 1h, 4h and 1d boundaries. Do not change the frozen failed run, Production, trading accounts, database, Spot, Demo or Fast Trader. Do not start another 24-hour run.

## Confirmed root cause and correction

The original 24-hour Shadow ledger was complete but **FAIL**: 186 stale symbol/timeframe inputs at exact boundaries (1h 144, 4h 36, 1d 6). The frozen cache key `floor((decisionTime - 1) / timeframeMs)` reused a previous-period entry at a boundary even though the newly closed candle already qualified. `MISSED_TICK` was a separate false telemetry warning, not this defect.

The new candidate uses the canonical last closed boundary `floor(decisionTime / timeframeMs) * timeframeMs` as its cache key. Both cached and fetched data must have `lastClosedAt` equal to that boundary; the raw kline close timestamp must equal its opening timestamp plus the interval minus one millisecond. Requests still use `endTime=decisionTime-1`, and the existing closed-bar, OHLC, gap and structural look-ahead checks remain. If the source is late, the runner emits `DATA_ERROR` instead of accepting stale data. No decision, score, chosen timeframe, structural veto or sleep rule was changed. This arithmetic is valid for the protocol's UTC-aligned intervals; weekly/monthly are not included or claimed.

| Case | Frozen behavior | Corrected expected behavior |
| --- | --- | --- |
| 08:00 UTC, 1h | pre-08:00 cache entry reused, latest close 07:00 | new key 08:00, latest close 08:00 |
| 08:00 UTC, 4h | pre-08:00 cache entry reused, latest close 04:00 | new key 08:00, latest close 08:00 |
| 00:00 UTC, 1d | prior day's entry reused | new key 00:00, latest close 00:00 |
| Between boundaries | prior fully closed candle reused | same valid candle reused; no look-ahead |

## Files changed

Only the isolated branch: `tools/futures-shadow-boundary/{runner.mjs,protocol.json,manifest.json,analyze-core.mjs,indicator-core.mjs,build-core.mjs,sv-futures-boundary-20260923.service,README.md}`, `scripts/futures-shadow-boundary-test.mjs`, and `HANDOFF.md`. The historical frozen runner, protocol and ledger were not edited. The pure core was built from the exact b88 lineage; Production Engine files were not edited.

## Checks executed

- `node scripts/futures-shadow-boundary-test.mjs`: **12/12 PASS**, mock public GET, no network/account/DB; exact 1h/4h/1d boundaries, six symbols, preboundary cache, ±1 ms, stale/malformed source, no-look-ahead, full and short request models.
- `node runner.mjs --self-test` on VPS: **7 assertions PASS**, zero network requests and ledger events.
- Read-only public smoke on VPS at 13:12:05–13:12:15Z: **6/6 symbols completed**, 24 public GET, zero ledger events, no account/order access. The smoke is a separate process and does not consume the prospective service's budget.
- Complete 96-tick key model: **780/900 GET**; prospective three-tick key model: **54/60 GET**. These are deterministic models, not completed live-window counts.
- Candidate code and protocol SHA-256 on VPS: runner `e1e8256d36e3c4aff4e8c0f3a2c2c4d68012056e766947faadb35dfabdd447ed`; protocol `f734c7307391369767f091c989be04b279481a94ae29cc40738b793c52eefe3b`; manifest `d34f416435a0361360cafaafca43b82220e661dce18e0c205f2b9272e8e3309b`. All matched local bytes.
- Independent VPS unit `sv-futures-boundary-20260923.service` started 13:12:49Z with `Restart=no`, separate state directory and no Production path access. At 13:13:35Z it was active, `NRestarts=0`, with no event file yet. It is waiting for the future window, not running another 24-hour test.
- Production deploy marker and active app symlink both identified executable `b88f25ac760b5af7cd6d3b626530fb1b3e9e5397`; `signalverse.service` remained active. No Production code/config/DB/trading write was performed by this task.

## Prospective gate still pending

The new exact window is **2026-09-23T23:45:00Z to 2026-09-24T00:30:00Z**, end-exclusive. Three decisions at 23:45, 00:00 and 00:15 UTC should produce 18 unique events. The 00:00 tick crosses 1h, 4h and 1d simultaneously. The post-window audit must independently inspect ledger, journal, hashes, raw close timestamps, last-closed boundaries, request count and service continuity. No PASS/FAIL is asserted before this window completes. Even a passing short window would not replace a fresh 24-hour gate.

## Status and next step

- Corrected candidate preparation and deterministic tests: **PASS**.
- Prospective boundary validation: **NATURALLY PENDING** until the exact window ends and its evidence is audited.
- Previous 24-hour Shadow: **FAIL**, immutable.
- Overall Real Futures release: **BLOCKED**; native protection and fresh Real accounting are also **NATURALLY PENDING**.
- After a passing short validation, prepare—but do not start—a separately frozen prospective 24-hour protocol and ledger. No profitability or AI Supervisor benefit is inferred from this observer; it makes no LLM call or exchange fill.
