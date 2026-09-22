# Futures review status, excluding the 24-hour shadow observation (2026-09-22)

## Metadata

- Date: 2026-09-22 UTC
- Scope: Standard Futures copy trading, with Real Binance evidence and isolated Binance Futures Demo component tests. Spot is excluded.
- Application repository HEAD inspected: `6d4b735f0f555bc499c30a73a70a148779ae8e2a` (documentation successor); last independently verified active executable: `cbc64240002d7b491774aafbfa5d650cd9460956`.
- Latest account-scoped Real decision capture available for this summary: 2026-09-22 05:53:13 UTC. This status request did not perform a new live account capture.

## Objective and scope

Answer which Futures checks passed and which remain, without counting the separate 24-hour public-data shadow observation as a result. This was a read-only synthesis of dated project evidence. No exchange order, account/settings mutation, application-code change, database write, Production deployment, or Spot change was performed.

## Evidence inspected

- `docs/fixes/futures-real-execution-safety.md`
- `docs/fixes/futures-real-readonly-audit-2026-09-20.md`
- `docs/testing/real-futures-remediation-simulation-2026-09-20.md`
- `docs/testing/binance-demo-execution-2026-09-20.md`
- `docs/testing/binance-entry-fee-production-2026-09-21.md`
- `docs/testing/binance-final-funding-production-2026-09-21.md`
- `docs/testing/binance-demo-watchdog-recovery-2026-09-22.md`
- `docs/testing/binance-demo-watchdog-live-fault-2026-09-22.md`
- `docs/testing/futures-engine-supervisor-assessment-2026-09-22.md`
- The dated Demo funding-crossing final-result report in this AI Log, plus project strategy, handoff and safe test runbook.

## Passed within their stated boundaries

1. Real execution safety contracts: durable one-use entry attempt holds, no blind resubmission after uncertain responses, actual-fill/partial-close handling, exact large IDs and protection readback. The latest isolated fault suite reported **114/114 passed**. This is offline contract coverage, not a full private-account lifecycle certificate.
2. Two bounded, manually directed Binance Futures Demo LONG/SHORT technical cycles exercised the current application protection-construction functions, native SL/TP placement/readback, repeated ensure idempotence, reduce-only closure and clean final account state. Their entry orchestration was a separate harness, not the full SignalVerse engine/reviewer path. Native trigger fills were not tested.
3. One isolated Demo trade crossed an actual funding event; the funding income row, both commissions, terminal flatness and timed backup checks were independently reconciled. Its original immediate stop hook **failed** before account checks. The hook's credential-lifecycle failure class was reproduced and replaced by independent `OnSuccess`/`OnFailure` wiring; no-trade probes passed, but that replacement was not exercised with a live position in that step.
4. A later bounded Demo live-fault test deliberately failed the main process after verified native protection. The separate `OnFailure` watchdog made exactly one reduce-only close and independent exchange checks found the account flat, orders cleared and leverage restored. Backup watchdogs made no additional close. This proves that one recovery scenario, not all unattended failure modes.
5. Binance Real Futures full lifecycle commission attribution and terminal signed funding reconciliation were implemented and released. Their release CI, migration/restore gates and offline tests passed; the dedicated funding suite was **10/10 passed**. Historical rows were not backfilled. No newly closed Real trade on the active SHA was available in the last account capture to confirm the new accounting behavior against fresh private exchange records.
6. Per-coin multi-timeframe selection exists for Real and in-app Demo entry lists, with weekly opt-in rather than default. This is an implemented UI/entry-selection behavior, not evidence that weekly has been removed from open-position reanalysis.

## Open or not verified

1. **Engine quality/profitability:** Earlier account exchange reconciliation covered 144 complete Real cycles and showed a narrow aggregate net with more net losses than wins. Timeframe and side breakdowns were descriptive, not controlled experiments. On the last observed active release window, repeated decisions for one symbol were all `WAIT`, with no Real trade or reviewer opportunity; there is no current-release financial effectiveness result.
2. **Supervisor incremental value:** The Real `CONFIRM` entry gate exists and fails closed, but all earlier recorded entry verdicts were `CONFIRM`; no beneficial entry veto or independently measured management improvement was observed. The isolated deterministic structure filter is not the LLM Supervisor. The Supervisor does not independently replace side, entry, stop or target.
3. **Structure-first signal and risk policy:** The default entry direction remains indicator-vote led; S/R, OB and FVG are not independent entry/stop anchors. The proposed simple profit-lock worsened modeled validation net, while one structural variant yielded only one validation trade and the zone filter yielded zero. No proposed strategy arm met the frozen promotion criteria. A higher win rate alone was insufficient.
4. **Confirmed code-level risk gaps:** Open-position reanalysis can reintroduce weekly input despite the selected entry list; stop updates can widen loss risk while break-even/profit-side stops are rejected; account-equity fixed monetary risk sizing, atomic portfolio capacity reservation, and complete protection-replacement/exit journaling remain incomplete. Tick-sensitive proposal churn, concurrency errors, price-basis mismatch between Spot candles and Futures triggers, and a liquidation fail-safe protection gap were documented. These are not all proven historical loss causes.
5. **Observability and integrated verification:** `alignedCount` can describe opposing trends as aligned; `WAIT` rows can carry a fallback timeframe and zero score that are not genuine ranking evidence. Real fee/funding post-release account verification, native SL/TP trigger and replacement races, full in-app Demo parity, multi-venue private execution, timeout/network-failure recovery and an agreed Real pilot remain not verified. The disclosed Demo credential should be rotated before another unattended test.
6. The separate 24-hour public-data shadow observation is explicitly **excluded** from this status. It cannot establish AI Supervisor value, private execution or profitability even when complete.

## Tests, changes and publication

- No test suite or build was rerun for this status request; counts above are dated results from the cited reports, not new passes.
- Application source, database, exchange accounts, Spot, in-app Demo and Production: **unchanged**.
- The application worktree had unrelated dirty/untracked work; it was preserved. This sanitized AI Log report is the only intended new tracked artifact for the request.

## Recommended next gate

Keep correctness and economic hypotheses separate. First require exact integrated Real-only tests for selected-timeframe propagation, no-widening monetary-risk policy, proposal/replace concurrency and price-source reconciliation, without silently changing trading policy. Independently compare prospective engine candidates and actual Supervisor veto/management decisions with a precommitted acceptance rule. Only after a Real change is approved and verified should the corresponding behavior be transferred to in-app Demo; Spot remains out of scope. Do not promote the losing profit-lock variant or call a no-trade filter profitable.
