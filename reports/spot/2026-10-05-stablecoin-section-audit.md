# Stablecoin section audit — 2026-10-05

## Metadata

- Date: 2026-10-05 (Asia/Kuala_Lumpur)
- Task: inspect the Stablecoin home card and its section for bugs.
- Module: Spot / shared Stablecoin Demo.
- Mode: source audit, isolated fault injection, local fixes; no production access.
- Repository: signal0verse/signalverse-main.
- Branch: codex/stablecoin-audit-20261005.
- Starting commit: f71d287167a33fffa9b0af99e6fb2fd1a021c0c5 (authenticated current main at start).
- Ending source commit: 997cc23bdab2b5471e536b479362a01c4f317cc7.

## Objective and scope

The screenshot identifies the shared Stablecoin entry with delegated view-only
access. Inspect its navigation, access gates, snapshots, history, displayed
amounts and the connected demo paths. Preserve other work in the dirty primary
checkout. Work used a separate managed worktree at the pinned main commit.

No production database, private exchange endpoint, trading account, order,
worker, feature flag, migration, service or deployment was touched. The active
runtime SHA and actual user's live page were not inspected. This is not a claim
of successful private-account execution or profitability.

## Findings and implementation

### Confirmed, fixed in the candidate

1. **History can show the wrong allocation.** One decision array was shared
   across allocations, and switching tabs skipped loading if that array was
   nonempty. Out-of-order responses could also overwrite the newly selected
   allocation. Opening/switching now clears stale state and reads the selected
   allocation; request generations reject late responses, including after close
   or unmount. Returned allocation identity is checked before rendering.
2. **Read errors masqueraded as empty/current data; stop failures were hidden.**
   HTTP/application errors cleared allocation/pair lists, while network errors
   silently retained stale snapshots. History errors appeared as no trades.
   Stop ignored response status and had no error handling. Reads now have a
   25-second timeout, validate responses, retain the prior snapshot with an
   explicit stale warning, and guard out-of-order polling. History displays an
   error with tab-based retry. A failed stop reports that stopping is unconfirmed.
3. **View-only users were asked to connect an irrelevant personal account.**
   The shared demo uses the admin's verification account, but the UI read the
   viewer's Copy Trade accounts and prompted a personal Binance connection.
   That request/card is now admin-only; connection errors are not labeled
   disconnected. Entry subtitle/badge and panel banner describe the actual
   view/operator role. Session/role changes remount the panel to clear its data.
4. **Gross opportunity profit was overstated.** The UI multiplied spread by
   full Trading Capital, although the proposed notional is capped at half and
   can be smaller. It now uses `best.notionalUsd`, matching the decision. Fixtures
   with capital 2,000 and spread 0.1% show gross 1.00 for a 1,000 trade and 0.125
   for a 125 trade; the old display showed 2.00 for both.
5. **Stopped history disappeared when its setup stopped or was replaced.**
   Default allocation-status queried only the running setup and returned empty
   without one. It now includes the owner's stopped allocations across setups,
   preserving explicit setup filtering and legacy single-pool exclusion.
   Setup reads are error-checked and explicit setup lookup verifies ownership.
6. **Malformed commission fields were marked verified.** Null/blank values
   coerced to zero and invalid strings produced NaN. Both commissions now must
   be nonblank finite nonnegative numbers. Legitimate zero/positive fees retain
   their values; no zero-fee fallback was introduced.
7. **Parity rebalance bypassed fee verification.** Although the cycle fetched
   fees, rebalance did not require verification and always modeled fee as zero.
   It now returns before market reads/cooldown/mutations unless live fee evidence
   is verified and both commissions are zero. Sizing, direction, price band,
   cooldown and strategy thresholds are unchanged. Rebalance remains opt-in.

### Confirmed, NOT fixed: demo settlement is not atomic (high priority)

`simulateStablecoinTrade` updates the source balance, updates the destination
balance, then inserts a trade through separate PostgREST operations. Its final
insert error is not checked. The actual function, isolated with an in-memory
database fault fixture, reproduced both failures:

| Injected fault | Observed result | Required invariant |
| --- | --- | --- |
| Destination update fails after source succeeds | Source 1,000 → 900; destination remains 1,000; ledger says REJECTED | Rejected settlement must leave both balances unchanged |
| Trade insert fails after both balance updates | Source 900, destination 1,101; no ledger row; function reports executed=true with no trade ID | Success must include durable settlement and matching ledger |

Numbers above are synthetic test values, not account data. The separate
`stablecoin-demo-atomicity-audit.mjs` deliberately exits **1** with both invariant
failures. This negative evidence is not included in passing regression counts.
The same separate-write pattern is present in parity rebalance, whose ledger
insert is also unchecked; that parity failure path was inspected, not separately
fault-executed in this audit.

The remaining repair needs one transactional database operation for inventory
and ledger, coordinated with reserve/manual-capital writers and idempotent
retry semantics. Merely checking another error or performing compensating
client writes would not make this atomic. No such migration or activation was
attempted in this bounded audit. The section cannot be certified fully healthy.

## Files inspected

AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md, all of TRADING_STRATEGY.md
including current-main additions, colleague handoff, safe test runbook; the
stablecoin engine/collector, App panel and access wiring, fee verification,
allocation/reserve/rebalance migrations, existing stablecoin test suites,
2026-09-16 capital-model report, package/build configuration and AI-Log template.

## Files changed

- src/app/App.tsx — view/history/error/profit display repairs and role labels.
- api/stablecoin-engine.ts — historical reads, ownership/error checks and fee guards.
- api/analyze.ts — floating-help knowledge only; no AI/trading algorithm changes.
- scripts/stablecoin-panel-regression-test.mjs — actual-function/TSX regressions.
- scripts/stablecoin-demo-atomicity-audit.mjs — retained negative fault evidence.
- scripts/stablecoin-engine-test.mjs — CRLF-compatible extraction regex only.
- HANDOFF.md and this document — findings, evidence and remaining blocker.

## Tests executed

Node **22.23.3** with existing local dependencies; no dependency installation,
dotenv loading, real transport or API bootstrap in the tests. New tests extract
actual TypeScript declarations through the AST, use in-memory transports/hooks,
and render actual JSX with React DOM. They are not a live browser E2E test.

| Command/check | Result |
| --- | --- |
| node scripts/stablecoin-panel-regression-test.mjs | PASS: 30/30 |
| Same tests with STABLECOIN_TEST_BASELINE=f71d287167a33fffa9b0af99e6fb2fd1a021c0c5 | 27 failures, 3 passes: defects reproduced on unchanged source |
| node scripts/stablecoin-engine-test.mjs | PASS: 395 internal checks; node:test reports one aggregate test |
| node scripts/stablecoin-market-data-collector-test.mjs | PASS: 107 internal checks |
| node scripts/stablecoin-demo-atomicity-audit.mjs | FAIL/exit 1: both documented settlement invariants fail |
| Strict isolated TypeScript check of api/stablecoin-engine.ts | PASS, zero diagnostics |
| Frontend TypeScript baseline/current comparison | 71 → 71, zero introduced diagnostic messages |
| Vite web build and Vite admin build | PASS; existing large web-chunk warning |
| esbuild of changed API handlers, write:false | PASS; handlers not executed |
| git diff --check | PASS |

Initial test setup issues were corrected transparently: the first two gross
render assertions omitted the existing `dir="ltr"` attribute; the initial
baseline reader needed a larger buffer for App.tsx. Old structural tests assumed
LF line endings and failed extraction on this Windows checkout; only their
newline matching was corrected, preserving the substantive assertions. An old
exact response-shorthand assertion briefly failed and the API response retained
its compatible shorthand shape. The initial sandboxed build could not traverse
the managed worktree parent; the authorized local build then completed.

## Git / publication / limitations

Application changes belong only to the named feature branch. No main merge,
production release or runtime update is part of this audit. The final sanitized
report is published separately to SignalVerse-AI-Log/reports/spot and verified by
remote byte comparison; its receipt records the source commit and push state.
Primary-checkout unrelated files, private work and temporary utilities remain.

Not verified: live Telegram rendering with the user's session; deployed schema,
private Binance commissions; real scheduler execution; database concurrency or
rollback under the current production schema. Existing frozen-mirror tests are
not transaction proof. Reserve/rebalance aggregate reporting and complete
historical pagination were not certified by this focused review.

## Recommended next step

Review this candidate and the preserved atomicity counterexamples. Prepare and
validate transactional demo settlement on an isolated PostgreSQL instance before
any database migration or claim that Demo balances/history are reliable under
failure. Release remains a separate exact-SHA process; do not infer deployment
or readiness from the passing UI tests.

## Final source publication receipt

- Application source committed and pushed to codex/stablecoin-audit-20261005.
- GitHub branch readback equals local commit 997cc23bdab2b5471e536b479362a01c4f317cc7.
- Main was not merged or pushed by this task. No deployment or production change.
- Application runtime SHA: NOT_VERIFIED (no server access in this audit).
- Report destination: SignalVerse-AI-Log, master, reports/spot/2026-10-05-stablecoin-section-audit.md.
- Report byte-readback verification is recorded in the publication receipt and final response, independently of this document.
