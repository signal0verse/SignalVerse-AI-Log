# Adverse-market profit exit — data gate and bounded public observation

## Metadata

- Date: 2026-10-04; independent inspection completed after 09:08 UTC.
- Request: perform the proposed no-trade comparison and say whether to proceed.
- Scope: existing local evidence, unchanged detector tests, bounded public Binance
  capture. No access to a private exchange account, Production DB or VPS.
- Application base unchanged: fca794122a7f235e0a774dbbbb0c6241ce4e10a3.
- Isolated proposal branch: codex/pp-adverse-trend-proposal-20261004.
- Primary dirty checkout and concurrent work preserved.

## Executive decision

```text
DATA_ACQUISITION_SMOKE=COMPLETED
EXACT_STRATEGY_PROFIT_COMPARISON=BLOCKED_MISSING_MATCHED_EVIDENCE
COMPLETED_COMPARABLE_EPISODES=0
PROPOSAL_EVALUATIONS=0
NET_RETURN_DIFFERENCE=NOT_AVAILABLE
IMPROVEMENT_PROVEN=NO
REAL_AUTOMATIC_ACTIVATION=NO_GO
```

This is NOT a completed profitability experiment or evidence that the idea cannot
work. The proposed real-position comparison could not be admitted with the
available evidence. Public feed receipt and passing software tests are not
substituted for a measured profitable outcome. No invented position/entry/cost
was supplied merely to generate an exit signal.

## Existing dataset check

Read-only inspected all 16 existing normalized native Futures minute files under
tmp/real-futures-validation-20260920/data matching futures-*-1m.json. All 16 raw
file hashes matched the existing data-validation.json receipt.

- Rows: 203,498.
- Retained row keys: t, o, h, l, c, v.
- Explicit raw native close-time fields: 0 rows.
- Receive-time fields: 0 rows.
- Bid/ask depth fields: 0 rows.
- Aggregate-trade direction/tape fields: 0 rows.

These are valid existing minute research inputs, but not the event/receipt/depth
evidence required by the exact new seconds-scale detector. Candle extrema cannot
reconstruct a factual within-minute trade/depth sequence.

The existing historical result.json was read, not rerun or changed. Its DIFFERENT
five-minute proxy had 112 episodes and seven early exits: three better, four
worse, with paired endpoint delta -0.677154 USDT. Its known negative result is
preserved. The dataset was already exposed and cannot become a fresh holdout.

## Bounded public capture performed

One standalone local collector, no service, scheduler, account key, app import,
PP worker or order capability.

- Setup started: 2026-10-04T09:05:12.684Z.
- Observation clock started: 2026-10-04T09:05:14.227Z.
- Finished: 2026-10-04T09:08:15.542Z.
- First received event: 2026-10-04T09:05:14.833Z.
- Last received event: 2026-10-04T09:08:14.493Z.
- Actual first-to-last event span: 179.660 seconds.
- Planned observation: 180 seconds; total hard deadline: 240 seconds.
- Symbols chosen before capture: BTCUSDT, ETHUSDT, APEUSDT.
- Choice is a bounded acquisition sample, not evidence of representative performance.
- Capture REST requests: 7, all HTTP 200; cap 8.
- Separate preceding public connectivity GET: 1, HTTP 200.
- Total public REST requests this turn: 8.
- WebSocket connections: 2, no reconnect attempts, public-data routes only.
- Capture storage: 6,428,469 bytes, 6,604 JSONL records.
- Raw WebSocket payloads: 6,594.
- Record budget: 100,000 / 64 MiB, neither reached.
- Exit reason WINDOW_ENDED; process exited 0 and is no longer running.
- An extra Windows process-inventory check via Get-CimInstance was denied by
  local permissions. Termination evidence is the foreground tool session's exit
  code 0; the reviewed collector creates no child process or service.

The current official [Binance USD-M connection documentation](https://developers.binance.com/en/docs/products/derivatives-trading-usds-futures/websocket-market-streams/Connect)
and [stream-routing notice](https://developers.binance.com/en/docs/products/derivatives-trading-usds-futures/websocket-market-streams/Important-WebSocket-Change-Notice)
were checked. Depth uses /public; aggregate trades and candles use /market.
No private stream was connected. Obsolete individual stream URLs redirected to
the documentation homepage; they were not used as evidence of current schemas.

| Symbol | Top-20 depth payloads | Aggregate trades | Kline updates |
| --- | ---: | ---: | ---: |
| BTCUSDT | 1,681 | 1,031 | 275 |
| ETHUSDT | 1,704 | 737 | 355 |
| APEUSDT | 720 | 53 | 38 |
| Total | 4,105 | 1,821 | 668 |

Independent raw-file inspection, not summary.json alone:

- All nine expected streams observed; independently recomputed counts/bytes/rows match.
- Three initial Kline GETs: 900 raw candles; native open/close relation violations 0.
  Forming initialization candles are retained as raw evidence, not admitted as closed.
- Closed live Kline notifications: 9.
- Malformed/nonempty book array-shape failures: 0.
- Observed aggregate-ID jumps: 0; duplicates/reorder: 0.
- Observed partial-depth previous-update linkage mismatches: 0.
- Local monotonic timestamp regressions: 0; wall-clock regressions: 0.
- These sequence checks are NOT proof of complete exchange event delivery,
  reconstructable full depth, full-size execution or native lifecycle identity.
- Partial top-20 payloads were NOT turned into a claimed full executable order book.
- WebSocket open records: both routes. No close-handshake records were received
  during the one-second shutdown grace. Process exit ended both connections;
  graceful server-acknowledged closure is NOT claimed.

## Actual chronology blocker found

All 6,594 stream payloads had native transaction/event timestamps ahead of their
raw local receipt timestamp. Four server-time probes give the following bounds
for server clock minus local clock, assuming only send/receive bracketing:

| Probe | RTT ms | Offset lower ms | Offset upper ms |
| --- | ---: | ---: | ---: |
| Initial 1 | 531 | 274 | 805 |
| Initial 2 | 324 | 276 | 600 |
| Initial 3 | 157 | 280 | 437 |
| Final | 152 | 344 | 496 |

This is not future market knowledge or negative network latency. Raw clocks are
not directly interchangeable. The frozen detector requires native time <= receive
time on a common timebase. Feeding these unadjusted observations would violate
that contract. No OS clock, production setting or detector guard was changed,
and no silently corrected timestamp was invented. A bounded clock-normalization/
uncertainty contract is necessary before causal proposal evaluation.

## Why there is still no profit comparison

The new public tape is current; the historical positions/outcomes are from an
earlier period. They cannot be joined by symbol alone or by fabricating an entry.

Missing matched evidence:

1. Exact naturally occurring position, accepted entry/quantity, original SL/ONE TP
   and native trigger references covering the captured interval.
2. Applicable fee/funding/cost evidence for that position.
3. Continuous eligible market observations with a validated common clock basis.
4. Proposal followed through to the original baseline exit/outcome.
5. An untouched evaluation sample with adequate independent coverage.

The collector deliberately has no private credentials and no current account
position input. This report does not claim that the owner's account has zero
positions or zero trades; the number ZERO is the count of admitted complete
research comparisons in this task.

A three-minute feed smoke cannot establish sustained protection benefit, false
exit frequency, sacrificed TP, drawdown improvement or safe native Close. Those
metrics remain unavailable, not zero. No threshold was tuned on this capture.

## Changes and checks

New disposable local files (outside application source):

- tmp/pp-public-evidence-20261004/capture.mjs.
- tmp/pp-public-evidence-20261004/capture.test.mjs.
- tmp/pp-public-evidence-20261004/inspect.mjs.
- Generated tmp/pp-public-evidence-20261004/capture-sbpwBu/events.jsonl.
- Generated tmp/pp-public-evidence-20261004/capture-sbpwBu/summary.json.

In the existing isolated proposal checkout only: additive HANDOFF.md and this
dated report. The primary checkout was not edited.

Executed with Node v22.23.3:

```text
node --test capture.test.mjs
node --check capture.mjs
node --check inspect.mjs
node capture.mjs --public-capture
node inspect.mjs <exact local capture directory>
node --test --test-reporter=spec scripts/futures-profit-protection-adverse-market-test.mjs
git diff --check
```

- Collector helper/safety tests: 8/8 PASS (synthetic contract checks, not trading proof).
- Frozen detector tests re-run: 71/71 PASS; zero skipped/failed.
- Syntax, independent capture inspection and whitespace checks: PASS.
- Detector source unchanged:
  6a734aa245b9042ce052837501eb2539e186ab8b443ca021b14b0b2c13c7fe5a.
- Detector test source unchanged:
  c61cc54e30417a63a2dfec96a104595891c1495d0794652cba5c93e2ed72d6dd.
- Prior release-scope failure remains unresolved and unchanged; it was not
  weakened, and the full compatibility suite/build/official CI was not rerun here.

## Evidence hashes

- Raw public capture:
  58d7a1595c39d5dadb9baef04648de24344ee3e3bed8614caa7b41ee678e8996.
- Collector:
  c99cf4ad9bf8665a81f03aec5d51e5ff8154939ea895c7742d6cb7eed85c97bf.
- Collector tests:
  13f2bddd6e34627268eb79419ecbaf011b9c1e95499d0031e0e49e55b067e492.
- Independent inspector:
  4bb4f10c232860c282ee4e47995b9e36aeaa82aac1c0c1ab42cc1ffadfabc796.

Public raw data remains local and is not committed. No private account data or
credentials are present in this published report.

## Final operational decision / remaining step

Do not activate real automatic exits based on this result. The exact new method's
profit effect is NOT_PROVEN, not FAIL from an economic comparison that never ran.

Required next experiment is a separately bounded, read-only natural-position
observation with matched accepted plan/cost/outcome data, validated clock mapping,
frozen policy and a predeclared evaluation window. It must not create trades to
obtain samples. Execution authorization/single-executor/lifecycle fencing remains
a separate unresolved gate even if statistical benefit is later demonstrated.

No observer remains running and no recurring job was created. Application commit,
push, CI, artifact, Guard, release, deployment, production DB/VPS access, Worker
start, PP flag changes, order/position/SL/TP/Close actions: NONE. Public market-data
reads occurred as counted above; private calls and exchange writes: ZERO.

Only this sanitized AI-Log report is published under the standing AGENTS.md
instruction. Publication commit and remote byte verification are returned
separately; source is not published and production readiness is not claimed.
