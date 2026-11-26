# Spot Swing Trader capital recovery — candidate verification; deployment withheld

## Metadata

- Date: 2026-11-27 01:24, Asia/Kuala_Lumpur; request started 2026-11-26
- Task ID: 01a171bc-b222-7133-9398-5df7a6f22ef6
- Module: spot
- Mode: native Telegram Demo and Real; candidate only
- Repository: signal0verse/signalverse-main
- Branch: codex/spot-swing-capital-rotation-20261126
- Starting commit: fd7418aa19625d657ed5082ca09ff7d9467920cc
- Ending commit: 8cd833098d1b40028f7e0b86f902b94a7a5c9e8d

## Objective

Replace per-coin budgets with declared total capital and a configurable fresh
allocation. After a closed recorded-entry candle invalidates S1–S3, sell half
of that scenario's own remaining inventory once. Confirmed net proceeds plus
one fresh allocation fund the immediate successor; S4 holds. Shared targets
must recover whole-round realized losses and fees. Include existing exposure
without rewriting accepted facts. Owner chose old budget × saved target count
and 1% entry for legacy profiles, with advisory macro filters only for recovery.

## Scope

Only native Spot Swing runtime/integration, UI/help, tests and documentation.
No deployment, application source push, main merge, production SQL/profile/
configuration/order change, Telegram test message or Windows Docker/app test.
The owner explicitly withholds deployment until a later instruction. Other chat
work is excluded; authorized messages only coordinated the shared runner slot.

## Actions Taken

Implemented versioned scoped pools, four-entry reservations, immutable recovery
intent/receipt consumption, atomic Demo events and separate existing-position
adoption. Composed Real execution with the original journal and venue adapters.
Preserved UNKNOWN/prepared holds, original accepted snapshots and historical
facts. Added whole-round cash/fee settlement, scoped net history and delayed
completion notices. Updated controls, guide, floating help, strategy and runbook.

Ran fresh SQL/direct/current-wrapper/legacy tests in original disposable server
pods with unchanged capacity/isolation preflight. Fixed actual fee aggregation,
guard integration, locale and type errors encountered during development.
Retained failed receipts and every original assertion; fixture-only defects
were corrected precisely. No checkpoint replay counted as fresh original tests.

## Files Inspected

AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md, all TRADING_STRATEGY.md,
safe test runbook, original CI routing (read-only), scanner/admission/fee/position/venue implementations, original
closed-history/external-sale/notification migrations, renderers, original test
harnesses and the changed files below. Official MEXC/Gate API contracts informed
the read-only historical execution view; no private execution was used as a test.

## Files Changed

- `HANDOFF.md`
- `TRADING_STRATEGY.md`
- `api/_shared/partner-spot-allocation.ts`
- `api/_shared/spot-auto-scanner-service.ts`
- `api/_shared/spot-auto-scanner.ts`
- `api/_shared/spot-swing-candles.ts`
- `api/_shared/spot-swing-capital-adoption.ts`
- `api/_shared/spot-swing-capital-limit-policy.ts`
- `api/_shared/spot-swing-capital-position.ts`
- `api/_shared/spot-swing-capital-read.ts`
- `api/_shared/spot-swing-capital-stop.ts`
- `api/_shared/spot-swing-capital.ts`
- `api/_shared/spot-swing-demo-engine.ts`
- `api/_shared/spot-swing-native-engine.ts`
- `api/_shared/spot-swing-notifications.ts`
- `api/_shared/spot-swing-recovery-entry.ts`
- `api/analyze.ts`
- `api/copytrade.ts`
- `docs/AI_HANDOFF.md`
- `docs/fixes/spot-swing-capital-rotation-2026-11-26.md`
- `docs/testing/stability-test-runbook.md`
- `migrations/spot_swing_capital_rotation.sql`
- `scripts/spot-scalp-projects-sql-test.mjs`
- `scripts/spot-swing-capital-admission-sql-fixtures.mjs`
- `scripts/spot-swing-capital-adoption-test.mjs`
- `scripts/spot-swing-capital-browser.mjs`
- `scripts/spot-swing-capital-display-test.mjs`
- `scripts/spot-swing-capital-engine-test.mjs`
- `scripts/spot-swing-capital-limit-policy-test.mjs`
- `scripts/spot-swing-capital-sql-test.mjs`
- `scripts/spot-swing-capital-sql-test.py`
- `scripts/spot-swing-capital-stop-test.mjs`
- `scripts/spot-swing-capital-test.mjs`
- `scripts/spot-swing-capital-types-test.mjs`
- `scripts/spot-swing-capital-wrapper-test.mjs`
- `scripts/spot-swing-demo-engine-test.mjs`
- `scripts/spot-swing-invalidation-candles-test.mjs`
- `scripts/spot-swing-recovery-entry-test.mjs`
- `scripts/spot-technical-scalp-test.mjs`
- `server/partner-copytrade/position-limit-engine.ts`
- `server/partner-copytrade/spot-limit-engine.ts`
- `server/partner-copytrade/spot-limit-venue.ts`
- `src/app/App.tsx`
- `src/app/SpotAutoScanner.tsx`
- `src/app/SpotHistoryPanel.tsx`
- `src/app/SpotPositionSummary.tsx`
- `src/app/SpotScalpOverview.tsx`
- `src/app/SpotScalpWorkspace.tsx`
- `src/app/SpotSwingCapitalControl.tsx`
- `src/app/SpotSwingTutorial.tsx`
- `src/app/spot-swing-exit-label.ts`
- `src/app/spot-swing-round-result.ts`
- `src/app/spotDecisionDetails.ts`

## Root Cause / Findings

- CONFIRMED: old successor authority requires four completed rungs plus normal
  discovery/market vetoes. It cannot implement this requested recovery policy.
- CONFIRMED: retained-inventory average alone cannot recover prior realized
  partial-exit losses; a round cash/fee floor must govern effective targets.
- CONFIRMED: the ordinary journal parser intentionally requires stored client
  identity and rejects MARKET buys. Historical MARKET fills need a separate
  observation of actual executed base/quote, not requested-size inference.
- CONFIRMED: existing missing identity/fee/history fields must not be invented
  or rewritten. Durable adoption, uncertainty holds and net settlement are needed.
- UNCONFIRMED: private exchange execution or profitability of the candidate.

## Implementation

Owner/mode/venue/quote isolation, current permissions/credit/cost/funds/quota
checks and independent SQL proof remain hard gates. Initial entry and unrelated
products keep original authority. Recovery S2–S4 uses a fresh native closed
reversal while bearish/capital-flight conditions remain visible warnings.

Historical facts are confirmed before resting protection is canceled. Exact
half intents survive partial fills and retry without repeated halving. S4 has
no invalidation sale. Recovery sells never advance profit stages. Net proceeds
cannot be consumed twice or transferred across owners/modes/venues/pairs.

Legacy conversion preserves switch, saved risk/frame/rank, IDs, buys and history.
Uncertain origin, multiple quotes, insufficient funds/quota or missing facts
retain the previous state and a visible block. No automatic capital/quota increase.

## Tests Executed

Full behavioral/type/build subject:
`51331f3a69b20907ff9cdabe00b9a3b5b4604e3c5ea063c9461ea3665325ef23`.
All application commands below ran as an unprivileged disposable server runner,
without production mounts/private egress or copied private environment files.

| Command/group | Observed result |
| --- | --- |
| Explicit PostgreSQL bin + `node scripts/spot-swing-capital-sql-test.mjs` | PASS: 44 actual migration/guards/adoption/accounting/concurrency cases |
| Explicit PostgreSQL bin + `node scripts/spot-scalp-projects-sql-test.mjs` | PASS: 579 admission cases: 529 original + 50 new; no replay |
| Actual original outbox SQL imported by that harness | PASS: 21 checks |
| `node --test` capital/recovery-entry/timeframe/invalidation-candles/capital-limit-policy/capital-adoption/demo-engine/capital-stop suites | PASS: 151; skipped 0/cancelled 0 |
| `node --test` capital-engine/display/wrapper plus original position/position-engine/partner-limit/notifications/preferences suites | PASS: 204; skipped 0/cancelled 0 |
| Total behavioral/SQL | PASS: 999 checks |
| `node scripts/spot-swing-capital-types-test.mjs /absolute/exact-baseline` | PASS: frontend 66/66 and API 34/34; introduced 0 in both |

The compiler check uses the entire exact baseline and raw current source,
retaining diagnostics/codes/messages/multiplicity. Only the exact temporary
checkout prefix is normalized; raw messages are retained. Existing 66/34 errors
remain; this is not a zero-diagnostic or all-repository compiler claim.

That run's overall exit was 1 at browser harness bootstrap, before UI execution:
Node could not resolve a direct TS import's extensionless dependency. A follow-up
browser-only source 7219c664caf0 rebuilt Web/admin successfully but found a missing
esbuild CSS output path, also before UI. Both defects were corrected only in
`scripts/spot-swing-capital-browser.mjs`, with no assertion removed. The held-
capital assertion additionally waits for loaded server status instead of loading.

Browser subject:
`b9d76b4b4e38d64c0e9cfbae922b15e8649e1761838273b996dc3b9569d30aa3`.
Per-file hashes establish that only the browser harness changed between these
subjects; application source/SQL and all remaining test-authority files are identical.

PASS: all 12 browser cases at 375/1280px, Persian/English, covering actual React
settings/position/history components with synthetic transport. No page errors,
horizontal overflow or private/account/order/Telegram requests. Saved-policy
Stop discards an unsaved financial draft; loaded reserved capital stays locked.
Fresh Web/admin builds passed again in 26.87s/7.42s with identical asset names.
Manual layout review passed all 12 original screenshots: changed labels, RTL,
control fit, low/medium/high colors and shared-position/net-history presentation.
These are not signed-in private account tests or a full content audit of
unchanged generic strategy-help strings; SQL independently checks cash math.

Five documentation-only files were updated after these archives. Their changed
text is not relabelled as runtime test evidence. Private proof/log/image files
are retained outside Git. Earlier failed or replay-only receipts stay distinct.

## Build Result

`npm ci --no-audit --no-fund`: PASS: 278 packages.
`npm run build`: PASS Web/admin, 46.16s/12.43s on the full subject.
API esbuild Node 22/external-packages ESM bundle: PASS, 1.6MB.
The first browser-only follow-up rebuilt the identical runtime successfully
(30.44s/9.42s). No local application build/test or Docker was used.

## Git Status

Clean working tree after one local commit on the feature branch. Exactly 53
task files, 4533 insertions/82 deletions. No application source push, main merge,
production migration or deployment. High-confidence added-line secret patterns
and staged whitespace checks passed. No credentials or test artifacts staged.
All three original workflow files remain unchanged.

## Commit

`8cd833098d1b40028f7e0b86f902b94a7a5c9e8d` (local only); parent `fd7418aa19625d657ed5082ca09ff7d9467920cc`.

## Remaining Issues

Implementation and focused candidate verification are finished. Production
release remains explicitly withheld. The complete original release sequence
listed below has not been completed for this candidate and must precede any
later rollout. Existing ambiguous/insufficient legacy conversions retain their
visible safety block rather than invented funds, quota or execution facts.

## Risks / Limitations

No private exchange order/balance migration or Telegram test message verified
execution. Synthetic regressions/public documentation do not establish profit.
Entry percentage sizes allocation, not maximum loss. S4 holds and can incur
further losses. Ambiguous/insufficient legacy conversions remain visibly blocked.

Original complete release CI, historical source-parity compatibility review,
all four original compiler comparisons, cold restore, current-main integration,
artifact/Guard and runtime acceptance are not supplied by the focused suite.
They remain mandatory before a later owner-approved release. The earlier guide's
backend-byte-identity assumptions require explicit review for this intentionally
changed scope; do not silently drop assertions or call all repository tests clean.

This task does not re-verify the live runtime SHA and makes no rollout claim.
After eventual activation, rollback must keep reconciliation/protection and
immutable new-policy records. Removing its engine/ledger or clearing uncertain
holds is not a safe financial rollback. Documentation/report publication is
separate from application source and production delivery.

## Recommended Next Step

Keep the prepared candidate without deployment until the owner later requests
release. Then integrate current main and complete every original release CI,
source-parity/guide compatibility review, four compiler comparisons, cold restore,
artifact/Guard and runtime-acceptance gate. Do not activate from these focused
test receipts alone.
