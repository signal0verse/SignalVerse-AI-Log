# Spot history — recorded-pair owner and combined display readback

## Metadata

- Date: 2026-10-27, Asia/Kuala_Lumpur.
- Task ID: history-pair-owner-resolution-20261027.
- Module: Native Spot history and deployed presentation.
- Mode: Read-only production observation and isolated UI rendering.
- Repository: signal0verse/signalverse-main.
- Branch: Existing published source; no source change.
- Starting and ending executable commit: a2ee12c0f260d22eea05cf32376bb5142e66655a.

## Objective

Resolve the owner of a specifically identified historical record pair, compare
its precise recorded sum with the deployed card and verify current identity.
Private identity, instruments, account IDs, financial values, timestamps and
record-level evidence are deliberately excluded from this public report.

## Scope

Scoped PostgreSQL SELECT, existing private evidence, deployed pure grouping/card
and read-only public asset comparison. Current Telegram identity was obtained
using the configured official bot's read-only identity methods. No message,
order, analysis, financial write, configuration change or deployment occurred.

## Actions Taken

Matched the preserved record IDs to the current database using the setup,
owner, mode and venue relationships. Verified that the closed records remained
identical. Calculated the decimal sum of original stored amounts and matched
the database aggregate before formatting. Executed the actual deployed model
and React card in a transient process with private networking, no application
secrets, read-only filesystem protection, CPU 25% and memory 256 MiB bounds.
Verified one aggregate card, original contributions in collapsed details and
served HTML/owned JavaScript bytes matching the active release.

The live Telegram owner identifier was matched to the records. The stored
profile label and the current Telegram handle were checked separately, avoiding
an assumption that a historical username remains the current one. Private
results were returned only in the owner's conversation.

## Files Inspected

- src/app/spot-history-rounds.ts
- src/app/SpotHistoryPanel.tsx
- Existing readback helpers and handoff
- Current deployed HTML and owned entry JavaScript
- Scoped database records and minimal Telegram identity result

## Files Changed

NONE in the application repository. Private operator helpers/evidence and this
sanitized report only.

## Root Cause / Findings

CONFIRMED: exact record ownership and recorded scenario boundaries resolve the
case; a presumed username or separately rounded row values are insufficient.
Current identity can differ from a historical stored profile label. Original
unrounded values produce the aggregate; formatting happens afterward. The
actual deployed renderer returned one card with collapsed scenario details.
UNCONFIRMED: no authenticated Telegram WebView was opened in this verification.

## Implementation

No application change. Used the previously validated deployed-card reader,
current owner join and read-only identity methods. No records were repaired,
reclassified, merged in storage or rewritten for this observation.

## Tests Executed

- Scoped SELECT inside a repeatable-read, read-only transaction: PASS.
- Original record equality and decimal/database/model sum comparison: PASS.
- Actual deployed model and card SSR with current records: PASS.
- Current public HTML/owned JavaScript byte comparison: PASS.
- Current Telegram identity matched to the record owner: PASS; zero messages.
- No full application regression suite was rerun for this observation.

## Build Result

No build or deployment. Active executable remained a2ee12c0f260d22eea05cf32376bb5142e66655a.

## Git Status

Application source unchanged; unrelated output preserved. No credentials,
account data, exports or rendering artifacts committed.

## Commit

No application commit. This report is verified by retrieving its exact remote
bytes at the resulting report commit.

## Remaining Issues

None for this read-only ownership, recorded-sum and display verification.

## Risks / Limitations

The result concerns recorded data and the deployed presentation. It does not
recompute past fees or prove private exchange execution/profitability. A cached
already-open Telegram WebView may retain older assets until it is reopened.

## Recommended Next Step

Interpret the card as the once-formatted sum of original records. Use the
verified current identity and expand details for scenario contributions.
