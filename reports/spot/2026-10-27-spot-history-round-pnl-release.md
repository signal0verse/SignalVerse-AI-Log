# Telegram Spot — combined historical round P&L released

## Metadata

- Date: 2026-10-27, Asia/Kuala_Lumpur.
- Task ID: spot-history-round-pnl-20261027.
- Module: Native Telegram Standard Spot and scalp history.
- Mode: Real and Demo; all supported assets, scoped by account/setup/venue/quote.
- Repository: signal0verse/signalverse-main.
- Branch: codex/spot-history-round-pnl-20261027; published to main.
- Starting source commit: 9e3da71a6a3176c21abb8f401e117696640f5a98.
- Starting executable commit: 952eb6201594fb3c5a5ef462e30b4215c74cd8e4.
- Active executable commit: a2ee12c0f260d22eea05cf32376bb5142e66655a.
- Ending documentation commit: 588cbe1b85292d2524638b59eec8f58be521acf8 ([skip ci]).

## Objective

Show the total recorded profit/loss of all scenarios belonging to one round as
the primary history result, so individual allocation losses are not mistaken
for a separate strategy stop. Apply on the main Telegram bot for every asset,
Standard Spot/scalp, real and Demo. Run tests only on the isolated server and
keep local Docker off.

## Scope

Read-only history presentation, exact authenticated GET completeness metadata,
floating help, direct current-source tests and predecessor-preservation checks.
Existing financial ledger, entry/exit, accepted levels, credit, risk, venue,
schema, dependencies, workflows, root controls and scheduler gates remain exact.

## Actions Taken

- Grouped original history records by recorded scenario 1 opening boundaries,
  never by shared closure timestamps or calendar dates.
- Added one main recorded P&L card per round; original contributions and saved
  scenario navigation remain inside collapsed details.
- Sum original unrounded stored amounts, then format once. Synthetic stored
  contributions -4.1445 and 7.5077 display 3.36 for the round, rather than adding
  separately rounded rows into 3.37. This example contains no account data.
- Retained open members as context; distinguish recorded-so-far from final
  results. Missing anchors/gaps/duplicates/overlap/nonfinite values and unknown
  or truncated server coverage cannot become an authoritative total or zero.
- Added count/completeness metadata only to the original authenticated history
  GET, preserving owner/mode/setup filters and original cycle records.
- Recognized genuinely recorded aggregate target fills as target sales;
  unfilled orders and generic closures do not invent target/stop evidence.
- Kept seven-language text, RTL and isolated Latin amounts. Scenario counters
  explicitly describe scenarios rather than fabricated round counts.
- Published and verified the controlled release after complete official CI,
  a fresh backup/cold restore and independent retained artifact verification.

## Files Inspected

The native App's separate classic/scalp history branches (both use this same
component and explicit real/Demo mode), actual history model/component/reader/CSS,
API history and help sections,
scope chain, earlier history tests, strategy/handoff/runbook, original CI and
release tooling, installed source/layout and read-only historical evidence.

## Files Changed

- HANDOFF.md
- api/analyze.ts
- api/copytrade.ts
- docs/AI_HANDOFF.md
- docs/fixes/spot-history-round-pnl-2026-10-27.md
- docs/testing/stability-test-runbook.md
- scripts/lib/spot-history-round-delta.json
- scripts/lib/spot-history-round-parity.mjs
- scripts/lib/spot-position-parity.mjs
- scripts/spot-compact-navigation-test.mjs
- scripts/spot-history-round-scope-test.mjs
- scripts/spot-history-round-test.mjs
- scripts/spot-setup-views-test.mjs
- src/app/SpotHistoryPanel.tsx
- src/app/spot-history-rounds.ts
- src/app/spot-scalp-workspace.css

## Root Cause / Findings

- CONFIRMED: history rendered one independent primary result per scenario,
  although multiple scenarios belong to one round. Rounded per-scenario
  allocations can differ from the round's once-rounded precise sum.
- CONFIRMED: implicit server row caps require explicit completeness evidence;
  an incomplete read must not masquerade as a complete position result.
- CONFIRMED: the existing configured database bridge supports exact scoped
  count headers, including legitimate ranged HTTP 206 responses.
- UNCONFIRMED: this release does not claim exchange execution or profitability
  from UI, mocks, successful builds or active processes.

## Implementation

The pure display model validates scope and scenario boundaries, retains source
records unchanged and uses compensated summation of original recorded P&Ls.
The component exposes a single total and expandable contributions. The API
change is a scoped SELECT count only. Strict full-file and replacement-slice
bindings reconstruct the complete reviewed predecessor before older assertions;
separate direct tests exercise the actual new model/API/component.

## Tests Executed

- Server-only focused command: node --test scripts/spot-history-round-test.mjs
  scripts/spot-history-round-scope-test.mjs
  scripts/spot-compact-navigation-test.mjs scripts/spot-retired-history-test.mjs.
  PASS 87/87; zero failures, cancellations or skipped cases. Covers immutable
  sums/rounding, boundaries, ongoing/incomplete evidence, both modes, all three
  venue scopes, generic asset symbols, USDC, seven-language actual SSR, the
  actual authenticated GET branch and unchanged original assertions.
- Server-only Chrome rendering of the actual bundled component and actual CSS:
  PASS 11 cases, including seven locales, 360px mobile, expanded details,
  open/incomplete states and desktop. No horizontal overflow; Persian/mobile
  and English/desktop screenshots were manually viewed. Synthetic data only.
- Original official exact-main CI: [40438130258](https://github.com/signal0verse/signalverse-main/actions/runs/40438130258), SUCCESS
  for a2ee12c0f260d22eea05cf32376bb5142e66655a, all 79 original steps retained. Both original compiler steps were
  checked in the authoritative attempt ZIP, requiring frontend/API results
  in each: all four comparisons PASS with no introduced diagnostics.
- Fresh consistent 145-relation PostgreSQL backup, private cold restore and
  both SQLite cold integrity/compressed round trips: PASS. Existing schema
  bodies/privileges/RLS/triggers/indexes verified; no migration executed.
- Original package/artifact full-tree metadata/PAX/blob/mode/digest: PASS.
  Archive 8387927 bytes within unchanged 8 MiB bound.
- Actual deployed pure history projection of existing read-only records: PASS.
  Original records stayed identical; their precise recorded sum produced one
  round result. No account/order/analysis write was used for verification.
- Final documentation fixed-commit scope and original package check: PASS on
  the isolated server before documentation publication.

The first unpublished candidate 618ca997 exceeded the original archive bound
before tests began. Exact replacement-slice SHA256 bindings removed duplicated
manifest text while retaining whole-file hashes and full predecessor equality.
The failed packaging outcome was preserved. Limits, compression contract,
original assertions, controls and workflows were not loosened.

## Build Result

Original official Web/Admin/terminal/runtime builds and expected-artifact checks
passed. All 2578 deployed native Git blobs and
executable modes match the tested commit. Sanitized admin contains only the
reviewed allowlisted source files and matching compiled assets. Served HTML,
JavaScript/CSS markers, runtime processes and consumed one-use approval match
the exact verified release. Independent Paper remains separately pinned.

## Git Status

Feature and main executable source published without force. Rollback refs for
the previous main/runtime retained. Final documentation-only publication was
verified remotely; it does not change the active executable. Unrelated output
was preserved; no credentials, exports, account fixtures or test artifacts were
committed. Tests and browser rendering ran on the capped, mapped-user server
environment with no host mounts/ports or production egress; local Docker stayed
off. Temporary own test containers were removed after use.

## Commit

- Executable: a2ee12c0f260d22eea05cf32376bb5142e66655a.
- Documentation: 588cbe1b85292d2524638b59eec8f58be521acf8.
- Original artifact preparation: 40451231394.
- Original guarded release: 40451515608.

## Remaining Issues

No outstanding implementation or rollout item for this history request.

## Risks / Limitations

Incomplete/ambiguous history deliberately shows an unavailable total. An open
round shows recorded-so-far rather than final profit. This is the sum of existing
recorded results, not a retrospective recalculation of trading fees or a rewrite
of past allocations. Generic cross-mode/venue checks do not prove private real
orders for every asset. Original compiler baseline diagnostics remain; passing
differential checks are not a claim of zero pre-existing TypeScript diagnostics.

## Recommended Next Step

Reopen history in the main bot to load the released assets. Expand scenario
details when individual recorded contributions are needed.
