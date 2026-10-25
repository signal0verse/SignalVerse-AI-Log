# My purchases — local Analysis candidate

## Metadata

- Date: 2026-10-25
- Task ID: my-purchases-local-20261025
- Module: Native Telegram Analysis / personal purchase history
- Mode: Local implementation and review; no production rollout
- Repository: signal0verse/signalverse-main
- Branch: codex/analysis-scenarios-history-20261025
- Starting commit: 351d22136d64d1ec2923cbee6029e9216144500b
- Ending commit: f9231522c45c11db9c0a25139db58ee33cbc2c4c

## Objective

Build “My purchases” so each user can see purchase history, scenario and leg,
total spending and average purchase price for every asset together. Show locally
first, as explicitly requested by the owner.

## Scope

Extend the existing local four-scenario candidate with a native personal ledger,
read-only authenticated API/RPC, separate unapplied SQL migration, isolated preview,
targeted tests and documentation. Preserve other contributors' work and existing
financial, credit, provider, order, access and release controls. No cross-chat
coordination, source push, production DB access, scheduler activation or deployment.

## Actions Taken

- Added Analysis and report-history shortcuts to one consolidated purchase page.
- Read immutable personal entry records directly, including closed/older campaigns.
  Analysis versions are not purchase records and are never counted as purchases.
- Displayed complete totals, per-asset cards/filter, actual price/amount/date,
  scenario and leg, plus expandable original plan and record references.
- Implemented PostgreSQL numeric aggregation and exact decimal-string display.
- Added owner checks, abort/race guards, coherent versioned pagination, refresh,
  explicit loading/empty/error states and retained data on failed reads.
- Verified the same component and hook in an isolated local synthetic preview.
- Updated floating help, handoffs, relevant feature docs and the safe test runbook.
- Created the local source commit above. Source was not pushed.

## Files Inspected

AGENTS.md, CLAUDE.md, current HANDOFF.md and docs/AI_HANDOFF.md,
docs/analysis-scenarios-history.md, docs/testing/stability-test-runbook.md,
the existing advisory migration/store/history hooks, native Analysis/history
components, API action/auth boundary, closed successor scope contract,
preview config/fixture, and the files listed below. The AI Log report template
was read before preparing this report.

## Files Changed

22 task files in the local commit:

- HANDOFF.md
- api/analyze.ts
- api/_shared/standalone-purchases.ts
- docs/AI_HANDOFF.md
- docs/analysis-scenarios-history.md
- docs/my-purchases.md
- docs/testing/stability-test-runbook.md
- migrations/standalone_analysis_purchases.sql
- scripts/lib/standalone-scenarios-delta.json
- scripts/lib/standalone-scenarios-parity.mjs
- scripts/preview/analysis-scenarios-fixture.ts
- scripts/spot-setup-views-test.mjs
- scripts/standalone-purchases-sql-test.mjs
- scripts/standalone-purchases-test.mjs
- src/app/App.tsx
- src/app/components/AnalysisHistory.tsx
- src/app/components/AnalysisWorkspace.tsx
- src/app/components/MyPurchases.tsx
- src/app/components/my-purchases.css
- src/app/useStandalonePurchases.ts
- src/previews/analysis-scenarios.tsx
- src/shared/purchase-ledger.ts

## Root Cause / Findings

CONFIRMED: The candidate already stored immutable personal completed-entry
records but lacked a consolidated view across campaigns/assets. Summing analysis
reports would duplicate purchases. Summing only the visible page would omit older
purchases. Averaging quoted prices arithmetically would give the wrong cost basis.

CONFIRMED: This implementation calculates average purchase price as total recorded
USDT spending divided by sum(amount_usdt / actual_price). Complete-owner totals
remain complete when filtering one asset or displaying only the first 50 records.

UNCONFIRMED: Production installation and production user persistence. Neither new
candidate migration has been applied to production, and no live runtime was
inspected or advanced for this request.

## Implementation

The verified native session supplies the actor; body owner fields have no
authority. The standalone-purchases action runs before provider/credit work and
cannot create orders or record another purchase. The new STABLE SECURITY INVOKER
RPC explicitly filters the actor and is executable only by service_role.

One SQL statement/MVCC snapshot returns whole-ledger totals and a 50-row keyset
page. Immutable entry count versions subsequent pages. A new or backdated purchase
invalidates an old page; the client fetches one fresh first page instead of mixing
snapshots. Timestamp/id cursor precision includes PostgreSQL microseconds.

The client validates response owner and DTO, hides another session/filter scope
immediately and aborts/ignores late replies. Failed reads retain the last same-scope
data visibly stale. Ledger records and bearer tokens are not persisted to browser
storage. Display formatting uses decimal strings/BigInt, retains raw precision in
tooltips and does not turn a tiny positive into zero.

## Tests Executed

- PASS: node --test scripts/standalone-purchases-test.mjs scripts/standalone-scenarios-test.mjs scripts/standalone-analysis-client-test.mjs scripts/standalone-scenarios-scope-test.mjs
  — 41/41 actual-source offline tests, zero failures/skips. Includes 12 new ledger
  tests, 25 existing advisory/client tests and four exact scope/negative tests.
- PASS: scripts/standalone-purchases-sql-test.mjs in a fresh process-owned PG17
  cluster — 8/8 actual SQL checks. Non-root reviewed existing container, no host
  mounts, no network or published ports, private AF_UNIX. The exact task container
  was removed. No existing/private database or env file was used. An initial
  test-catalog string-concatenation ambiguity was corrected with explicit ::text
  before the successful complete rerun; it was not a production migration failure.
- SQL coverage: confirmed empty ledger; anonymous/authenticated role denial;
  correct numeric average; closed campaigns; two owners; filtered rows with
  complete totals; invalid cursors; 105 purchases across three pages including
  microsecond/id ties; new/backdated purchase invalidation; unchanged immutable
  entries and synthetic UNKNOWN financial hold.
- PASS: strict TypeScript for shared model, hook, ledger, Analysis/history
  components and preview/fixture. NoEmit/strict/ES2022/Bundler/react-jsx.
- PASS: App/API diagnostic comparison against the starting candidate: 18 baseline,
  18 current, zero added diagnostics. Existing errors remain; this is not a claim
  of a globally clean TypeScript project. Only quoted literal union member order
  was normalized; compiler source identity was checked.
- PASS: git diff --check and staged diff check. The closed reversible successor
  verifies the cumulative exact 45-path candidate inventory against its retained
  predecessor; original financial/access/release controls and assertions remain.

Browser acceptance used only the loopback synthetic fixture:

- Opened from Analysis and report history; round-trip navigation retained data.
- Initial sample account A: three buys, two assets, 325 USDT. BTC total 250 with
  quantity-weighted average displayed as 80,019.73. ETH filter showed one record
  while global totals stayed 325/three/two. Expanded original record details.
- Recorded a synthetic scenario 1 / leg 3 BTC buy: 50 USDT at 79,500. History
  became four buys / 375 USDT, BTC total 300 and average 79,932.64. Refresh/reopen
  did not duplicate it.
- Switched to synthetic account B: only its SOL buy / 40 USDT appeared. Switching
  back restored A's four buys / 375, without sharing the other owner's records.
- Simulated read failure: prior records/totals remained with a visible warning;
  restored the fixture and refreshed successfully.
- Visually checked desktop, 390px mobile and 360px compact English layouts and
  scrolled purchase rows. Returned the deliverable to Persian desktop My purchases.
- Saved a labeled synthetic screenshot locally. No real analysis/provider call,
  exchange order, account transaction or Telegram message was executed.

## Build Result

PASS: final isolated preview build; final Web Vite build; final Admin Vite build;
bundled API analyze handler. Build output remains local outside tracked source.
The existing large frontend chunk warning remains. Host/test runtime was Node24;
official Linux Node22 CI was not run for this local-only request.

## Git Status

Task source committed locally on the branch above; no source push or release.
No tracked/staged changes remain. Unrelated untracked output/ was preserved.
This sanitized report alone is intended for AI Log/master and is verified there
separately. Source HEAD is not evidence of an active runtime.

## Commit

f9231522c45c11db9c0a25139db58ee33cbc2c4c — feat: add personal analysis purchase ledger

## Remaining Issues

Local owner design review. An approved future release must apply the advisory
schema and new ledger migration in order and pass existing exact-source CI,
artifact, private backup/restore, independent Guard and runtime verification gates.

## Risks / Limitations

These are personal gross purchase records, not exchange-verified fills, current
wallet balances or PnL. Sales/fees are absent. Missing old purchases are not
fabricated from price touches or legacy reports. No sale/edit/delete/export was
added. The preview middleware uses fictional owners and approximate sample-only
aggregation; actual SQL numeric aggregation was separately tested in disposable
PostgreSQL. Sample memory survives page navigation but resets on local server
restart. This does not prove live account execution, profitability or rollout.

## Recommended Next Step

Owner reviews the local My purchases page with the sample data. Continue from
this exact committed candidate if changes or an authorized release are requested.
