# Spot Swing Trader — verified selectable timeframes and transaction notifications

## Metadata

- Date: 2026-10-29, Asia/Kuala_Lumpur.
- Module: Native technical Spot, Demo and real.
- Mode: Server-isolated validation and guarded main-bot release.
- Repository: signal0verse/signalverse-main.
- Branch: codex/spot-swing-trader-20261028; main.
- Starting source: 73e93267b4b44bdc240b1d0d3ba0bd225fdfbd5d.
- Active executable: 60298dfb22a2459b62aefc50d4f5c21972b60a85.
- Ending documentary HEAD: 5bf0dcd8d56ae12ca4a4f1728a189c16e889dc08; separately pinned from the executable.

## Objective

Continue only Spot Swing Trader and deliver the approved name/icon/subtitle,
selectable buy timeframes, conservative new-user defaults, risk colors and
owner-scoped Telegram purchase/take-profit notifications. Validate on a separate
server environment and activate the reviewed main bot.

## Scope

Native technical Spot retains its existing assets and venues in Demo and real.
Existing saved profiles, accepted snapshots and weighted position exits retain
their authority. Classic Spot, Futures, funding/credit/reviewer policies and
uncertain-order holds remain protected. Independent Paper remains pinned.

## Actions Taken

1. Integrated the approved Spot Swing Trader branding and transparent256px icon.
   Persian subtitle: نوسان‌گیر بازار اسپات با تمرکز بر حرکت‌های قیمتی.
2. Added5m/10m high,15m/30m medium and45m/1h low entry choices. New unconfigured
   native drafts use1h, the original strict conservative strategy and rank50.
   Existing saved absence remains5m; Save/Start stays explicit.
3. Kept risk colors green/yellow/red independently of selection, across seven
   locales. Corrected Persian guidance to describe selected closed buy/higher
   frames; actual rendering is checked for all six intervals.
4. Added versioned native closed-bar transport and admission identity for explicit
   new intervals.10m/45m aggregate contiguous native5m/15m bars. Distinct higher
   confirmations are30m/1h/2h/3h/4h. Original votes, thresholds, costs, capital and
   accepted-position rules remain authoritative.
5. Added independent owner/mode notification preferences and a future-ledger
   outbox. Confirmed buy deltas identify symbol/venue/mode/scenario/rung. TP1/TP2
   messages use recorded sales and final profit uses the complete closed-round
   recorded gross sum. Numeric Telegram ownership determines the recipient.
6. Completed fresh current-source tests, compilers, browser/manual checks, full
   private backup/restore and exact native migration rehearsal; then published
   source/rollback refs, verified the immutable artifact and used the original
   one-use root authorization and release flow.

## Files Inspected

CLAUDE.md, HANDOFF.md, full TRADING_STRATEGY.md, docs/AI_HANDOFF.md, the colleague
handoff, safe test runbook, relevant fix reports and original isolation/release
authorities. Native scanner/context, policy, engine, monitor/UI, notification,
schema, tests and deployed source were inspected. Private evidence stays private.

## Files Changed

- `HANDOFF.md`
- `TRADING_STRATEGY.md`
- `api/_shared/spot-auto-scanner-service.ts`
- `api/_shared/spot-auto-scanner.ts`
- `api/_shared/spot-scalp-scenario-policy.ts`
- `api/_shared/spot-scalp-scenario-preview.ts`
- `api/_shared/spot-scanner-scalp-context.ts`
- `api/_shared/spot-scanner-scalp.ts`
- `api/_shared/spot-swing-candles.ts`
- `api/_shared/spot-swing-engine.ts`
- `api/_shared/spot-swing-notification-preferences.ts`
- `api/_shared/spot-swing-notification-worker.ts`
- `api/_shared/spot-swing-notifications.ts`
- `api/_shared/spot-swing-timeframe.ts`
- `api/analyze.ts`
- `api/copytrade.ts`
- `docs/AI_HANDOFF.md`
- `docs/fixes/spot-swing-trader-2026-10-28.md`
- `docs/testing/stability-test-runbook.md`
- `migrations/spot_swing_notifications.sql`
- `migrations/spot_swing_timeframes.sql`
- `scripts/lib/pinned-scope-fixture.mjs`
- `scripts/lib/spot-manual-delete-parity.mjs`
- `scripts/lib/spot-scalp-projects-delta.json`
- `scripts/lib/spot-scalp-projects-parity.mjs`
- `scripts/lib/spot-swing-delta.json`
- `scripts/lib/spot-swing-parity.mjs`
- `scripts/scalp-hourly-policy-test.mjs`
- `scripts/scalp-presets-diagnostics-test.mjs`
- `scripts/spot-cron-read-batches-test.mjs`
- `scripts/spot-manual-delete-scope-test.mjs`
- `scripts/spot-scalp-projects-scope-test.mjs`
- `scripts/spot-scalp-projects-sql-test.mjs`
- `scripts/spot-scalp-projects-test.mjs`
- `scripts/spot-scanner-scalp-test.mjs`
- `scripts/spot-swing-current-regression-test.mjs`
- `scripts/spot-swing-integration-test.mjs`
- `scripts/spot-swing-notification-preferences-test.mjs`
- `scripts/spot-swing-notification-sql-test.mjs`
- `scripts/spot-swing-notifications-test.mjs`
- `scripts/spot-swing-scope-test.mjs`
- `scripts/spot-swing-timeframe-sql-fixtures.mjs`
- `scripts/spot-swing-timeframe-test.mjs`
- `scripts/spot-technical-scalp-test.mjs`
- `scripts/telegram-workspace-ui-test.mjs`
- `src/app/App.tsx`
- `src/app/ScalpMonitorEvidence.tsx`
- `src/app/ScalpOverviewShell.tsx`
- `src/app/ScalpStrategyPresets.tsx`
- `src/app/SpotAutoScanner.tsx`
- `src/app/SpotScalpMonitor.tsx`
- `src/app/SpotScalpOverview.tsx`
- `src/app/SpotScalpTools.tsx`
- `src/app/SpotSwingNotificationPreference.tsx`
- `src/app/SpotSwingTimeframeControl.tsx`
- `src/app/assets/spot-swing-trader-icon.webp`
- `src/app/scalp-account-diagnostics.ts`
- `src/app/scalp-confirmation-copy.ts`
- `src/app/scalp-monitor-copy.ts`
- `src/app/scalp-monitor-evidence.ts`
- `src/app/scalp-monitor-inputs.ts`
- `src/app/scalp-monitor-model.ts`
- `src/app/scalp-monitor-policy.ts`
- `src/app/scalp-monitor-worker-client.ts`
- `src/app/scalp-overview-copy.ts`
- `src/app/scalp-strategy.css`
- `src/app/spot-scanner-i18n.ts`
- `src/app/spot-swing-settings.css`
- `src/terminal/spot-scalp-navigation.tsx`

## Root Cause / Findings

CONFIRMED: the earlier technical feature fixed analysis to5m/15m. Selectable
entries require native closed-bar transport and separate profile/run/decision
identity. The previous five-minute adapter remains byte-identical. Fresh defaults
and semantic risk colors are independent of a previously saved selection.

CONFIRMED: notifications require committed ledger deltas and whole-round
accounting. Analysis colors and individual scenario contributions are not
execution evidence. Preferences must remain separate from financial profiles.

CONFIRMED: actual public GET-only sampling passed all15 venue/new-interval
combinations:1000 valid closed primary bars and300 coherent native1m profile
bars per sample. Provider rules were checked against primary documentation:
[Binance](https://developers.binance.com/en/docs/catalog/core-trading-spot-trading/api/rest-api/market),
[MEXC](https://www.mexc.com/api-docs/spot-v3/public-api-definitions) and the
[Gate SDK](https://raw.githubusercontent.com/gateio/gateapi-nodejs/master/docs/SpotApi.md).

UNCONFIRMED: a universally best or most profitable timeframe. Risk groups are
owner-selected settings, not calibrated loss probabilities. Repeated historical
selection can overfit; see the primary
[backtest-overfitting paper](https://www.davidhbailey.com/dhbpapers/backtest-prob.pdf).

## Implementation

Explicit new intervals use a separate versioned engine/policy and saved profile
revision. A prospective unaccepted scenario may read an explicitly saved new
selection; accepted levels, fills, allocations and order identities stay fixed.
Volume Profile retains its original300-minute native lower-frame evidence.
Missing, stale, forming or gapped data rejects without inventing candles or
switching venue/quote. No Spot stop-loss or timed losing exit is introduced.

Notifications capture future confirmed events without history backfill. Their
worker has no exchange/order port. Partial fills coalesce, tiny prices retain
precision and sends are independently paced. Unknown send outcomes remain
durable holds. Only an explicit429 no-message result allows bounded retry;
muted/blocked recipients are suppressed without another recipient fallback.

## Tests Executed

- PASS:500 expanded focused cases on Node22 in the bounded isolated server,
  zero failures/cancellations/skips. Includes four retained historical comparison
  files and independent raw-current deletion/cron/navigation/settings checks.
- PASS:529 original/new admission SQL checks and21 outbox checks in private PG.
- PASS: all four original compiler comparisons, without introduced diagnostics;
  also independently verified from each authoritative official CI step log.
- PASS:11 original history browser cases plus12 current cases, seven locales,
  semantic risk colors, new1h/rank50 defaults, approved icon and Persian guidance.
  All11 history images, three risk representatives and the guidance image were
  manually reviewed. CJK fonts were installed inside the isolated environment.
- PASS: public venue/frame/profile conformance matrix, all15 samples.
- PASS: fresh145-relation full restore/catalog/count/owner/ACL checks, six CHECK
  parser round trips, two equivalent owner-ACL representations, dualSQLite
  integrity/compression round trips and complete before/after hashes of every
  row in seven relevant tables. No row sampling or original-row migration.
- PASS: [original main CI](https://github.com/signal0verse/signalverse-main/actions/runs/40760328408), all79 original steps retained,
  four exact Node22 compiler results from authoritative individual-step logs.
- PASS: original8MiB producer, source archive8365273bytes, SHA256
  `18d960d5100e8fb75c6326538639429f8e7ad1e315e72d08cfc600021d1f89df`; immutable artifact full Git blob/mode/metadata/digest
  verification, original root authorization consumption and deployed/public readback.
- PASS: all2637 deployed Git blobs/modes, sanitized admin copy, original22
  controls/17job gates/six services and independent Paper pin.
- Every final focused/compiler/browser/backup/CI/artifact/runtime proof belongs
  to this exact executable source. Earlier receipts were preserved separately
  and were not relabelled or substituted. Windows Docker was not used.

Earlier official runs stopped at missing legacy extraction dependencies and four
historical source/tree/JSX comparisons. Automatic review rejected the first
historical-adapter proposal because it could conceal current-source errors. The
owner then explicitly approved four narrow adapters with every original assertion
retained and separate raw-current checks with deliberately invalid mutations.
Those checks remain in the regular test graph. A subsequent obsolete run was
cancelled before production to correct the Persian5m/15m guidance. All final
evidence was rerun at the corrected source. No original workflow,180-minute
limit,8MiB bound, compiler comparison or financial/uncertain-execution control
was weakened to obtain acceptance.

The operator's first install check stopped locally because its reader expected
CREATE OR REPLACE FUNCTION. After correcting that reader, both additive SQL
transactions committed exactly once. A missing remote verifier import and an
incorrect zero-row REST route then stopped readiness. The durable receipt was
preserved and all original function/privilege checks were reconciled without
replaying DDL. The probe was corrected to the SDK's /rest/v1 route and readiness
passed. No application SQL, artifact, tests or release gate changed.

## Build Result

PASS: web/admin and API bundles, original full CI builds and expected artifacts.

## Git Status

Source, feature branch and rollback refs published without force. Active runtime
verified at60298dfb22a2459b62aefc50d4f5c21972b60a85; later documentary HEAD5bf0dcd8d56ae12ca4a4f1728a189c16e889dc08 contains final evidence notes.

## Commit

Executable: 60298dfb22a2459b62aefc50d4f5c21972b60a85
Documentary source: 5bf0dcd8d56ae12ca4a4f1728a189c16e889dc08

## Remaining Issues

No natural confirmed Telegram notification was observed in the bounded read-only window. Future ordinary confirmed ledger events exercise delivery; no forced scan, test message or order was used.

## Risks / Limitations

Tests, public data and active-service checks do not establish private execution
or profitability. Deterministic tests use synthetic component/ledger inputs.
Actual customer rows stayed on-server for private consistent backup/rehearsal
and were unchanged by the migrations. No private account test order, paid
analysis, forced scan, forged session or Telegram test message was used.
Existing profiles are not automatically changed. Preserve supported protection
and reconciliation whenever new-version exposure exists; use reviewed forward fixes.

## Recommended Next Step

Reload the Telegram mini app to receive the new assets. Use its normal explicit
settings Save/Start flow; accepted positions retain their original policy.
