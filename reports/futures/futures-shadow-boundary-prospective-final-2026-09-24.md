# Real Futures isolated Shadow boundary validation — final audit, 2026-09-24 UTC

## Scope and status

- Frozen prospective window: `2026-09-23T23:45:00Z` to `2026-09-24T00:30:00Z` (end-exclusive); scheduled decisions 23:45, 00:00 and 00:15 UTC.
- Corrected isolated boundary gate: **PASS**. All naturally exercised 1h, 4h and 1d exact boundaries selected the newly closed candle for all six symbols; zero stale or future bars were logged.
- Overall Real Futures release: **BLOCKED**. During this task, Production's active runtime changed from the required `b88f25ac760b5af7cd6d3b626530fb1b3e9e5397` to `85aedfb944a67c94227ac343e911bc64a581e79e` at approximately `2026-09-23T20:58:18Z`, before the prospective window. This task did not initiate that deployment or change Production. The freeze requirement is violated; no rollback is attempted here. The earlier 24-hour Shadow remains permanently **FAIL** with 186 stale inputs.
- Evidence collected read-only at approximately `2026-09-24T10:35:35Z`–`10:40Z` from the separate service's ledger, complete unit journal, file hashes and Production runtime markers/process.

## Candidate and service identity

| Item | Observed evidence |
| --- | --- |
| Local candidate commit | `937f4aebb4613bb321b6becd1724aa985f0b2649`; independent branch, not app `main` |
| Protocol SHA-256 | `f734c7307391369767f091c989be04b279481a94ae29cc40738b793c52eefe3b`, unchanged |
| Runner SHA-256 | `e1e8256d36e3c4aff4e8c0f3a2c2c4d68012056e766947faadb35dfabdd447ed`, unchanged |
| Manifest SHA-256 | `d34f416435a0361360cafaafca43b82220e661dce18e0c205f2b9272e8e3309b`, unchanged |
| Ledger SHA-256 | `1ac79946ad8c8628342d62608899c0fd93c7b8b7d243e9462463e509bd259edf` at audit |
| Service | `sv-futures-boundary-20260923.service`, separate dynamic user/state; `Result=success`, `ExecMainStatus=0`, `NRestarts=0`, inactive after successful completion |

The unit began waiting at `2026-09-23T13:12:49.344Z` with no ledger file before the window. Its sole Node PID was `1924541`. The first recorded event was observed at `2026-09-23T23:45:27.186Z`, the last at `2026-09-24T00:15:26.820Z`; journal `WINDOW_COMPLETE` was emitted at `2026-09-24T00:30:25.059Z` and systemd deactivated the unit successfully at about `00:30:25.151Z`. The journal has one start and one successful deactivation, with no failure, interruption or restart.

## Independent ledger and journal audit

| Check | Result |
| --- | --- |
| Unique decision times | 3/3, exactly 23:45, 00:00 and 00:15 UTC; missing/unexpected 0/0 |
| Ledger events | 18/18, all `OK`, exactly BTC, ETH, SOL, BNB, XRP, UNI at each time |
| Duplicate event IDs / symbol-time pairs | 0 / 0 |
| `DATA_ERROR` / other non-OK statuses | 0 / 0 |
| Missing bar metadata / invalid bar SHA fields | 0 / 0 among 72 symbol-timeframe inputs |
| Stale latest-closed bar / future bar / raw-close mismatch | 0 / 0 / 0 among 72 inputs |
| Decision order / premature observation / structural evidence from future | no violations / 0 / 0 |
| Public GET count | 24 after 23:45, 48 after 00:00, 54 after 00:15 and final `WINDOW_COMPLETE`; **54/60**, no budget/public-data error |

For each of the 72 recorded symbol/timeframe inputs, independent ledger parsing checked `lastClosedAt == floor(decisionTime/timeframeMs)*timeframeMs`, `rawLastCloseTimeMs + 1 == lastClosedAt`, and `lastClosedAt <= decisionTime`. The runner itself also validates all 250 closed rows per request for OHLC, continuity and raw close-time consistency. The ledger stores the terminal timestamps and bar-data SHA, not all 250 source rows, so the full rows were not independently replayed in this post-run audit.

At the naturally occurring `2026-09-24T00:00:00.000Z` boundary, all six symbols had the same correct result separately for **1h: PASS**, **4h: PASS** and **1d: PASS**: raw Binance close timestamp `1790207999999` (`2026-09-23T23:59:59.999Z`), selected `lastClosedAt=2026-09-24T00:00:00.000Z`, equal to decision time. Each timeframe had six exact-boundary observations, none stale. The corrected cache key derives from the immutable runner as `symbol:timeframe:1790208000000` at that boundary; the key itself is not separately emitted in the ledger. The 24 additional GETs at midnight (cumulative 24 to 48) corroborate that all six symbols fetched each of the four newly closed timeframes rather than reusing the pre-midnight cache. The 00:15 tick added only six 15m GETs. No 1h/4h/1d boundary is marked untested in this window; all three occurred together at midnight.

The old frozen runner used `floor((decisionTime-1)/timeframeMs)` and reused a prior-period entry at exact boundaries, yielding 186 stale inputs over its failed 24-hour run (1h 144, 4h 36, 1d 6). The corrected runner keys to the canonical latest closed boundary, checks both cache hits and fresh responses, retains `endTime=decisionTime-1` and fails closed when a newly due candle is absent. It did not alter the Decision Engine or hide chronology failures.

## `MISSED_TICK` separation

The complete journal contains **39** `MISSED_TICK` records: 13 for each of the three decision times. All **39/39** point to a decision time with six complete `OK` ledger events; **0** point to a genuine missing decision/event. They are an **OBSERVABILITY DEFECT** of the unchanged sleep loop, not the boundary result or an execution failure. The runner was not modified to suppress them.

## Production boundary and limitations

Pre-window checks through `2026-09-23T20:23:36Z` showed the required active SHA `b88f25ac760b5af7cd6d3b626530fb1b3e9e5397`. Post-window checks at `2026-09-24T10:38:30Z` found deploy marker, active symlink and live process cwd all at `85aedfb944a67c94227ac343e911bc64a581e79e`; the Production service restarted at `2026-09-23T20:58:18Z`. Its env-file mtime remained `2026-09-19T11:11:10Z` and service-unit mtime remained `2026-09-07T01:11:03Z`. **Production runtime change relative to the frozen requirement: YES. Change caused by this audit: NO.** No Production rollback, code/config/DB/account change, exchange write, order, leverage change or credential access was performed by this task. Unrelated Production database/trading state was not independently audited and cannot be certified unchanged.

The short boundary correction is **PASS**, but a fresh 24-hour run from the b88 candidate is **BLOCKED** until the owner resolves the active runtime lineage mismatch. No new 24-hour service/window was started. Native Binance/MEXC protection and fresh Real accounting remain **NATURALLY PENDING**. The structural observer makes no LLM call or exchange fill and proves neither profitability nor AI Supervisor effectiveness. The full Real Futures release remains **BLOCKED**.
