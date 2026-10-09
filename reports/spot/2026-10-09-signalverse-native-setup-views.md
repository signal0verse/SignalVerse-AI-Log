# SignalVerse native Spot setup views — 2026-10-09

## Requested result and actual change

The owner requested List, Icons and Full views for Spot Demo and real copy-trade
setups, with existing SignalVerse styling, status/symbol/capital sorting and full
preservation of details, form drafts, execution order and expiry controls.

Current main already contained these views for CrossVerse managed hosts only.
This task enables that same presentation in the original SignalVerse app, imports
the styles there and extends their scope specifically to the native Spot panel.
Default sort remains taking-profit/buying first. The shared component, seven
locale dictionaries, stable clone-based sorting and original detail subtree are
reused. The native application keeps its existing Persian/English language scope.

Every pre-existing financial callback, form, status decision, accounting value,
entry/expiry/manual-close guard and execution array is unchanged. The only API
source edit updates the floating help description. No Market/News implementation,
trading engine, order adapter, database migration or financial policy changed.

## Verification

- 67 offline tests passed under Node 22: native integration preservation,
  all original detail children/callbacks, frozen-input stable sorts, component
  rendering across seven locales, and predecessor/current closed-source gates.
- Production web and admin builds passed. Existing large-chunk warning remains.
- Actual native SpotCopyTradePanel mounted without a partner host, with an
  intercepted local test transport. Demo and real forms retained unsaved capital,
  cycle and allocation edits across List/Icons/Full and sort changes.
- Display changes sent zero save requests. A deliberate local Demo save sent
  exactly the entered model/percentages/capital/cycle count; no real endpoint was
  used. Real-mode unsaved edits were cancelled.
- Persian mobile at 390px and desktop were inspected; no horizontal overflow
  was observed. English controls and status text were verified in browser.
- The current authenticated CrossVerse page was inspected using its ten existing
  setups. All three views retained the accounting, ladders, take-profit range,
  history and manual-close control in the active setup. A temporary unsaved draft
  survived all three views and sort changes, then was cancelled without saving.
- The live page temporarily displayed a transport-unavailable message. A normal
  reload recovered it, after which the live checks above completed. This task did
  not modify server configuration or claim to diagnose that transient condition.
- Screenshots and preview transport/data are local ignored artifacts, excluded
  from application Git and this sanitized report. No funded order or production
  setup mutation was submitted by this task.

## Source and publication state

- Base main: `daa6eb6d8d776daa8dd427a3b80e8e0ce2d1f295`.
- Candidate: `908e75737d0aa480e337153d1c933de9e6537827`.
- Branch: `codex/spot-setup-display-modes`, pushed and preserved separately.
- Draft PR: https://github.com/signal0verse/signalverse-main/pull/218
- Unrelated primary-worktree edits and generated files were preserved.
- This task delivered a tested interactive preview and reviewable source. It did
  not merge to main, dispatch a release, modify the production database or claim
  that the native-app change is deployed. Full release CI/Guard activation remains
  a separate publication step. The existing online CrossVerse presentation is a
  predecessor, not evidence of this candidate's native runtime activation.

## Limits

Financial effects are protected by source-preservation tests, not validated by
placing orders. The native candidate was browser-tested with isolated fixtures;
live existing-data checks exercised the shared predecessor presentation on the
current site. Neither is a claim of profitability or private exchange execution.
