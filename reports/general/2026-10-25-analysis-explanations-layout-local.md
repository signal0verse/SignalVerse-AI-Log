# Analysis explanation layout and aligned actions — local refinement

## Metadata

- Date: 2026-10-25T18:50:31.055053+08:00, Asia/Kuala_Lumpur.
- Repository: signal0verse/signalverse-main.
- Branch: codex/analysis-scenarios-history-20261025.
- Parent candidate: `5d2d36ba7f5dc734f4feefa3883a05c45391e116`.
- Exact local refinement commit: `351d22136d64d1ec2923cbee6029e9216144500b`.
- Result: LOCAL PREVIEW UPDATED; source not pushed, no deployment.

## Objective and Scope

Owner found the scenario explanation popup cluttered and requested the previous
version's organized layout. A second comment requested Explanation and Record
purchase actions at the bottom, aligned with neighboring scenario cards.

## Actions Taken

- Replaced the long initial popup with a compact scenario summary and separate
  collapsed topic rows: plan/entries, SMC, momentum, Bollinger, EMA, confirmation
  context, volume, reasoning, risk, saved AI review and report information.
- Only one topic opens at a time. Accessible buttons expose expanded state and
  their controlled panel. Header close and Escape remain available; popup is
  centered and fits mobile width with internal scrolling when needed.
- Retained original saved data, reasons, risk note, conditional future premise,
  personally recorded purchase evidence and explicit missing values. The same
  report snapshot is used; no new analysis, provider request or credit action.
- Grouped both actions at the bottom of equal-height scenario cards. Ready,
  conditional and recorded content can vary without moving neighboring actions.
  Existing callbacks and all entry/history/engine behavior remain.
- Updated handoff, user help and feature documentation; refreshed the existing
  explicit36-file candidate contract without admitting new arbitrary paths.

## Checks and Evidence

| Check | Result |
| --- | --- |
| Existing actual scenario/data/explanation checks |14/14 PASS; no bootstrap/env/network/accounts |
| Strict modified component types |PASS |
| Compiled local preview |PASS |
| API compilation after help-only edit |PASS; no API execution |
| Complete closed candidate source inventory |PASS:36 exact paths; original predecessor assertions retained |
| Browser |Persian desktop/mobile popup, initial collapsed rows, momentum values, opening EMA closes momentum, Escape/close |
| Card action geometry |All four desktop cards: Explanation top1244/Record top1292 and equal card bottoms1345 before scrolling; both actions40px high |

Screenshots stay local and contain only explicitly synthetic preview data. The
existing local compiled preview at
http://127.0.0.1:4320/previews/analysis-scenarios.html was rebuilt and verified.
No new tests mirroring a reversible CSS change were added. No production DB,
account/profile/provider/order action, migration or job activation occurred.
The earlier candidate's PostgreSQL and broader regression evidence is separate;
those checks were not needlessly repeated for this presentation-only refinement.

## Publication and Runtime State

Eight exact task files were committed locally; unrelated output/private work is
preserved. No source/main push or runtime rollout was performed. The new advisory
migration/scheduler and full official release gates still require later authorized
release. The existing installed runtime is not inferred from this local HEAD.
This sanitized report is published separately to SignalVerse-AI-Log/master and
remote bytes are verified in its publication receipt.

## Remaining Limitations

The review uses sample data and does not establish private-account execution or
profitability. Physical Telegram mobile keyboards and every device are not
exhaustively tested. This task changes presentation only; the previous candidate's
release limitations remain.
