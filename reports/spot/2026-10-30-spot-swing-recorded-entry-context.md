# Spot Swing Trader — recorded entry context per scenario

## Metadata

- Date: 2026-10-30, Asia/Kuala_Lumpur.
- Task ID: Spot Swing recorded-entry information.
- Module: Native technical Spot, demo and real, existing supported assets/venues.
- Mode: Server-isolated validation and guarded main-bot release.
- Repository: signal0verse/signalverse-main.
- Branch: codex/spot-swing-trader-20261028; main.
- Starting commit: 5bf0dcd8d56ae12ca4a4f1728a189c16e889dc08.
- Previous runtime: 60298dfb22a2459b62aefc50d4f5c21972b60a85.
- Active executable: 56e823f009cdfb2d80f7f936c3daa2df1183af08.
- Ending documentary HEAD: 5d5447b407fbc0aa9f78ba367be169a28a18dfc2; separately pinned from runtime.

## Objective

Identify each entered position/scenario's accepted strategy risk, entry and higher
timeframes, market-rank selection scope and the chart's independent display frame.
Provide useful trading context while preserving accepted settings and executions.
Validate on an isolated server and deliver to the main Telegram bot.

## Scope

Read-only presentation and supplemental future provenance in existing native
decision JSON. No strategy, price/quantity, weighted-exit, fee/credit, permission,
schedule, execution-hold, order or historical-record policy change. No new schema
migration or replay of already-installed SQL. Independent Paper remains pinned.

## Actions Taken

1. Added recorded-entry summaries and per-scenario risk/frame badges to entered
   assets, plus a same-round comparison in the position and execution history.
2. Separated strategy/filter risk, timeframe risk group, higher confirmation,
   current live monitoring and the actual chart display timeframe.
3. Added selection cap/rank, revision, confirmation score/minimum and distinct
   analysis, scenario-acceptance and first-recorded-buy UTC timestamps.
4. Added seven-language guidance explaining chart changes, different scenario
   settings, rank cap versus asset count, acceptance versus fills, existing shared
   weighted exits and the meaning of strategy risk labels.
5. Bound historical facts to immutable admission snapshots and original linked
   decisions. A missing cap can use only the exact saved revision/policies, with
   a distinct source label. Changed settings never relabel accepted scenarios.
6. Mirrored already-read future selection metadata into existing native writes.
   No extra database query, financial write path, migration or backfill was added.
7. Completed current-source checks, source/rollback publication, original CI,
   immutable artifact verification and the original one-use guarded release.

## Files Inspected

AGENTS.md, CLAUDE.md, HANDOFF.md, TRADING_STRATEGY.md, docs/AI_HANDOFF.md,
the current fix report, safe test runbook and colleague handoff; actual scanner,
context, decision persistence, frozen admission, history projection, chart/UI,
tests and original isolation/release authorities. Private evidence stays private.

## Files Changed

This task changes 26 paths; the preserved cumulative Spot Swing authority covers
85 paths including its machine-generated manifest.

- `HANDOFF.md`
- `api/_shared/spot-auto-scanner-service.ts`
- `api/_shared/spot-swing-entry-context.ts`
- `api/analyze.ts`
- `api/copytrade.ts`
- `docs/AI_HANDOFF.md`
- `docs/fixes/spot-swing-entry-context-2026-10-29.md`
- `docs/testing/stability-test-runbook.md`
- `scripts/full-terminal-contract-test.mjs`
- `scripts/futures-profit-protection-scope-test.mjs`
- `scripts/futures-tutorial-ui-test.mjs`
- `scripts/lib/checked-source-operation.mjs`
- `scripts/lib/spot-swing-delta.json`
- `scripts/lib/spot-swing-parity.mjs`
- `scripts/partner-spot-limit-scope-test.mjs`
- `scripts/spot-swing-entry-info-test.mjs`
- `scripts/spot-swing-scope-test.mjs`
- `scripts/terminal-view-parity-test.mjs`
- `scripts/trade-onboarding-test.mjs`
- `src/app/SpotScalpOverview.tsx`
- `src/app/SpotScalpWorkspace.tsx`
- `src/app/SpotSwingEntryDetails.tsx`
- `src/app/spot-scalp-presentation.ts`
- `src/app/spot-swing-entry-copy.ts`
- `src/app/spot-swing-entry-info.css`
- `src/app/spot-swing-entry-info.ts`

## Root Cause / Findings

CONFIRMED: entered assets shared mutable live-monitor labels, while the chart
independently defaulted to 5m. Those values did not describe accepted entry settings.
The existing history read already returned frozen snapshots and linked original
decisions, so another account query or reanalysis was unnecessary.

CONFIRMED: older snapshots did not record the market selection cap. An exactly
matching saved revision can confirm it; a later profile cannot reconstruct it.
Older missing/conflicting values now remain explicit rather than using defaults.

CONFIRMED: an early browser fixture overescaped its button selector and ignored
evaluation exceptions. Product source remained unchanged while selector/error
reporting, navigation and real-input handling were corrected;
the final current-component interaction and all layout assertions passed.

UNCONFIRMED: private order execution or profitability; neither is an acceptance
claim of these display/provenance changes.

## Implementation

The display model checks setup, mode, venue, symbol, quote, scenario and revision.
Repeated scenario-one records delimit separate rounds. A chart-only change may
retain the same account's immutable history, while another account/mode/setup/
venue/quote and another chart's bars remain separated. Missing historical evidence,
loading, unavailable reads and conflicting evidence have explicit presentation.

The future entry-context helper is pure and optional. Existing reads, scheduling,
financial operations and callbacks remain exact after removing only literal
supplemental metadata additions. Original assertions remain, with independent
raw-current and deliberately corrupted-source checks. The generated manifest was
compacted without removing a key, value, hash, projection or assertion; the
original 8MiB receiver limit was retained.

## Tests Executed

- PASS, isolated server: `node --test scripts/spot-swing-entry-info-test.mjs`;
  all125 direct cases, including108 frame/strategy/mode/venue combinations and
  actual compiled components in seven locales.
- PASS, original expanded regression command in the server focus launcher:
  all641 cases, no failures/cancellations/skips. This total includes the125 direct
  cases; it is not an additional125 unique tests.
- PASS: `SPOT_SCANNER_TEST_PG_BIN="$(pg_config --bindir)" node scripts/spot-scalp-projects-sql-test.mjs`;
  original529 admission checks and21 isolated notification SQL checks retained.
- PASS: original `node scripts/partner-spot-limit-scope-test.mjs --types` and
  `node scripts/futures-profit-protection-scope-test.mjs --types`; all four
  frontend/API comparisons introduced no diagnostics. All four original compiler
  command bodies executed freshly on the exact candidate and again in official CI.
- PASS: actual compiled Chrome fixtures,47 automatic browser cases:11 original
  history,12 prior settings/guidance and24 entry-context cases across seven
  locales and320/360/1200px. All24 new images plus11 history images, three risk
  representatives and guidance were manually reviewed. Scenario and chart
  interactions preserve accepted entry facts; no account/order port is used.
- PASS: all15 public-only venue/new-frame data samples; source and raw metrics
  retained. No private trading execution is inferred from these reads.
- PASS: full current148-relation consistent private backup and socket-only cold
  restore, all counts/catalog checks, six CHECK parser roundtrips, four identical
  explicit-owner-default ACL representations and complete bounded-key row hashes
  in seven relevant tables. Both SQLite snapshots passed cold integrity and gzip
  roundtrip verification. No production SQL or customer-row backfill occurred.
- PASS: [original main CI](https://github.com/signal0verse/signalverse-main/actions/runs/40964002208); all79 original steps retained and all
  four compiler results independently verified from authoritative step43/56 logs.
- PASS: [artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/40981655546) and independent full Git
  blobs/modes/metadata/digest verification; original8MiB bound retained.
- PASS: [guarded release](https://github.com/signal0verse/signalverse-main/actions/runs/40982047950); one-use root authorization
  consumed, active source/public assets, all2645
  Git blobs/modes and sanitized admin copy verified. All six services,22 original
  controls,17 job gates and independent Paper pin were preserved. Existing schema
  functions, privileges, RLS, trigger/index and REST cache were freshly read back.

The earlier published candidate hit the original180-minute CI ceiling before
all steps; zero assertion failures did not make that incomplete run a pass. It
was never deployed. A later private package attempt exceeded8MiB by1659bytes,
and stopped before tests. Complete test code was stored losslessly in an immutable
Git blob, fullSHA256 checked, with three import-resolution bindings to CURRENT
modules; all125 test cases still execute, never cached results or old app code.

Two old compiler programs and five named synchronous test callbacks now use the
unchanged full-source entry/exit verifier. Exact inverse-source checks preserve
all old executable bodies, imports, assertions and unrelated asynchronous tests.
Unique keys force callbacks to rerun; independent disposable-source tests prove
mutation/failure/async rejection and nesting/context behavior. No workflow, cache,
resource, timeout,8MiB limit, protection or financial authority was weakened.
All app/API/SQL/strategy bytes equal the originally reviewed display candidate.
Fresh current-source focused, compiler, browser and all79official steps above
passed. Superseded receipts remain private and were not relabeled as release
proof. No local Windows Docker, forced scan, paid analysis or private test order.

## Build Result

PASS: web, admin and API bundles; original full CI and release builds. Canonical
source archive:8386552 bytes, original limit8388608.

## Git Status

Exact tested source, feature branch and rollback refs published without force.
Runtime remains at56e823f009cdfb2d80f7f936c3daa2df1183af08; later documentation-only HEAD5d5447b407fbc0aa9f78ba367be169a28a18dfc2 uses skip-ci
and is reported separately. Current task worktree changes are committed.

## Commit

Executable:56e823f009cdfb2d80f7f936c3daa2df1183af08
Documentary source:5d5447b407fbc0aa9f78ba367be169a28a18dfc2

## Remaining Issues

No outstanding release action. Historically unrecorded values remain explicitly
unknown; this task does not invent or backfill missing past entry settings.

## Risks / Limitations

Risk labels describe selected filter strictness, not calibrated loss probability.
Historical data cannot prove missing original settings. Synthetic tests and public
data do not establish private execution or profit. No operator account/order or
profile change, forged session, Telegram test message or financial hold removal
was used. Ordinary protection/reconciliation and scheduled jobs remained running.

## Recommended Next Step

Reopen the Telegram mini app and inspect an entered asset or recorded scenario.
Use the separate entry, chart and per-scenario fields; current monitoring remains
explicitly labeled. Future accepted scenarios retain the supplemental context.
