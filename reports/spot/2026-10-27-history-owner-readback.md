# Spot history — owner-scoped readback verification

## Metadata

- Date: 2026-10-27, Asia/Kuala_Lumpur.
- Task ID: history-owner-readback-20261027.
- Module: Native Spot history and deployed presentation.
- Mode: Read-only production observation; isolated offline rendering.
- Repository: signal0verse/signalverse-main.
- Branch: Existing published source; no source change.
- Starting and ending executable commit: a2ee12c0f260d22eea05cf32376bb5142e66655a.

## Objective

Check the requesting owner's current registered history against the actual
deployed round grouping and displayed amount. Verify ownership before using a
previously inspected case. Keep account identity, instruments, financial values,
record IDs and private evidence out of this public report.

## Scope

Owner-filtered SELECT statements, deployed pure display model/component and
read-only public asset comparison. No trading, analysis, settings, migrations,
source changes or deployment were authorized or performed for this readback.

## Actions Taken

Verified the requested database owner and enumerated only scoped records.
Retained recorded round boundaries and distinguished ongoing records from
closed history. Executed the deployed pure grouping and actual React card
renderer in a transient process with private networking, no application secret
environment, strict filesystem protection, CPU 25% and memory 256 MiB limits.
Matched served HTML and owned JavaScript bytes against the active release.
Private results were provided only in the owner conversation.

## Files Inspected

- src/app/spot-history-rounds.ts
- src/app/SpotHistoryPanel.tsx
- src/app/App.tsx
- api/copytrade.ts authentication and Spot dispatch
- Current deployed HTML and owned entry JavaScript
- Existing handoff and safe-test runbook

## Files Changed

NONE in the application repository. Only private operator evidence/helpers and
this sanitized report were created.

## Root Cause / Findings

CONFIRMED: history must be matched to the authenticated owner before reusing an
earlier case. Native real/Demo dispatch retains that authenticated identity.
Recorded scenario-one boundaries remain authoritative; the number of returned
rows alone does not establish one shared round. The active renderer preserves
those boundaries and keeps scenario contributions in collapsed details.
UNCONFIRMED: no authenticated Telegram browser session was opened in this check;
the display result comes from the deployed component with current scoped data.

## Implementation

No application change. Operator verification used the actual deployed model,
esbuild/React SSR card and read-only database evidence. Initial assumptions about
owner reuse, React boolean data attributes and third-party script inclusion were
rejected by checks. The private verifier was corrected to require the owner,
actual emitted attributes and only owned asset paths; prior failed checks were
retained. No financial record or application assertion was changed to pass.

## Tests Executed

- Scoped PostgreSQL SELECT inside BEGIN READ ONLY: PASS.
- Deployed grouping and card rendered with current scoped records: PASS.
- Current served HTML/owned JavaScript byte comparison: PASS.
- Financial writes, orders and analyses submitted: zero.
- No full regression suite was rerun for this observation.

## Build Result

No build or deployment performed. Active executable remained a2ee12c0f260d22eea05cf32376bb5142e66655a.

## Git Status

Application tracked files unchanged; unrelated output preserved. No credentials,
exports, private account data or rendering artifacts committed.

## Commit

No new application commit. Public report publication is verified separately by
retrieving the exact remote file bytes at its resulting commit.

## Remaining Issues

None for this read-only verification.

## Risks / Limitations

This verifies stored results, owner scope and deployed display output. It does
not recalculate past fees, imply private exchange execution or profitability,
merge separate recorded rounds, or establish what an already-open cached
Telegram WebView currently paints.

## Recommended Next Step

Use the recorded owner, mode and scenario-one boundaries when interpreting
history. Reopen the Mini App if its existing WebView retains older assets.
