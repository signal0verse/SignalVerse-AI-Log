# Analysis explanations: local UX simplification

Date: 2026-11-02 (Asia/Kuala_Lumpur).
Preview: http://127.0.0.1:5193/.
Application HEAD remains 2acedfab056262f0157d8b6b9a9ecea447ff2fdf.
Application commit/push/deployment: NONE / NO / NO.

## Request and result

The owner found the Analysis explanations crowded and confusing.
The chart, selected native areas, underlying report and actual engine decisions
remain unchanged. Presentation now starts with one short result card:
selected buy-review range, profit-review range and the existing requirement
for closed-candle reaction plus fresh engine entry confirmation.

Three native, initially closed disclosures follow:
1. Why the engine reached this result, with its technical vote count.
2. Chart areas and patterns, with counts and a compact native evidence picker.
3. Trend and momentum, including RSI and existing channel/formation details.

Source/provenance remains a separate closed disclosure. Fullscreen retains its
pinned summary and hides the duplicate inline result. No entry approval,
optimal-entry claim, price, target or trade is fabricated.

## Changes

- Replaced the long horizontal evidence-card strip with an accessible select.
  Every original projected zone/event is still selectable. Chart evidence IDs,
  source ranges and inspection selection remain connected.
- Reduced the selected area's explanation to its actual reason, reaction
  condition and touched/untouched state. Source times, invalidation boundary,
  detector model and raw facts are available on demand.
- Removed repeated buy/exit cards from the engine-reason body; the primary
  summary already contains these areas. Actual engine reasons/votes remain.
- Removed empty channel/wedge/flag cards and the large empty developing-channel
  panel. Existing developing/confirmed/broken patterns still have their exact
  source status and facts, initially collapsed.
- Moved pattern calculation and RSI-method prose behind its own disclosure.
- Shortened Persian summary wording without changing its conditions.
- Desktop summary has two columns; phone inline summary stacks buying and
  taking-profit review vertically, with unbroken readable price ranges.
- Existing soft zones, channel callouts, RSI, Reset and daily/weekly provenance
  are preserved.

## Exact files touched in this follow-up

- src/app/components/AnalysisEvidenceChart.tsx
- src/app/components/ChartStudyDetails.tsx
- src/app/components/AnalysisTradeSummary.tsx
- src/styles/analysis-evidence-chart.css
- scripts/analysis-explanation-ux-test.mjs
- scripts/standalone-chart-evidence-test.mjs
- scripts/standalone-chart-geometry-test.mjs
- api/analyze.ts: descriptive help-knowledge line only, no executable API change.
- HANDOFF.md
- reports/general/2026-11-02-analysis-explanation-ux-local.md

Previous uncommitted chart/page/history changes were preserved. No other
contributor work was reset, discarded, staged or committed.

## Fresh local validation

Final audited suite:
135 tests / 135 PASS / 0 failures / 0 skipped / 0 cancelled / 0 todo.

Command:
node --test scripts/analysis-explanation-ux-test.mjs scripts/analysis-page-evidence-test.mjs scripts/analysis-chart-labels-test.mjs scripts/analysis-trade-summary-test.mjs scripts/standalone-analysis-client-test.mjs scripts/standalone-chart-evidence-test.mjs scripts/standalone-chart-review-test.mjs scripts/standalone-chart-presentation-test.mjs scripts/standalone-chart-geometry-test.mjs scripts/standalone-developing-channel-test.mjs scripts/analysis-refresh-reminder-test.mjs

Four new offline React tests verify default collapsed groups, primary summary,
preservation of every projected evidence choice and native source identity,
unchanged engine reasons/report bytes in both languages, and omission of empty
formation cards while keeping the calculation method accessible.

Two existing render assertions initially failed because they expected the
removed duplicate entry/exit wrapper and empty-formation placeholder.
They now verify the actual report-backed summary/engine disclosure and the
exact count of real formations with no empty cards. Engine parity, no-trade,
snapshot, closed-bar and source-provenance assertions were retained.
An initial new-test assumption about a supply range was also corrected:
that actual fixture has no valid supply, so it must say no target is invented.

Focused strict TypeScript: PASS, zero diagnostics.
Final Web build: PASS (24.32s).
Final Admin build: PASS (10.76s).
Existing bundle-size advisory remains; not a build failure.
git -c core.autocrlf=false diff --check: PASS.

Full-project TypeScript and official CI/release gates were not run in this
UI-only task. Earlier full-project baseline diagnostics are not reported as
fresh results. No gate was modified or bypassed.

Actual regression checks still prove App non-JSX/trading function parity and
API byte parity after excluding the one descriptive help-knowledge line.
Protected trading/server/migrations/ops/deploy/.github/strategy paths remain
without task-created changes.

## Actual browser checks

Used the existing local page and real public-data-only engine transport.
No account, DB or order port is connected; macro-regime and AI-review ports
remain absent in this preview. This is not Production execution acceptance.

- All three evidence groups were initially closed.
- Engine-reason expansion displayed the actual four technical votes and the
  existing caution about weakening medium-term structure; closing hid the prose.
- Selecting the bearish order block updated the inspector to the same evidence
  identity: OB:SHORT:1793232000000:2350.35:2391.55.
- Trend expansion retained detected channels and RSI relations, omitted absent
  wedge/flag/developing cards, and kept method text collapsed.
- Phone 390x844: one-column primary summary, no horizontal overflow, Enter
  opens/closes the engine disclosure.
- Fullscreen: pinned summary remains; duplicate inline summary is hidden.
- Default desktop viewport restored, disclosures closed, preview left open.

Local screenshots:
output/analysis-explanation-ux-20261102/desktop-summary.jpg
output/analysis-explanation-ux-20261102/mobile-summary.jpg

Local browser evidence:
output/analysis-explanation-ux-20261102/browser-proof.json

Local logs:
tmp/analysis-explanation-ux-20261102/regression.log
tmp/analysis-explanation-ux-20261102/types.log
tmp/analysis-explanation-ux-20261102/build.log

## Safety and publication

Strategy, Decision Engine, risk, scanner, PP, execution and financial behavior
are unchanged. No VPS/Production/DB access or mutation, worker/flag change,
account exchange action, order, position, entry, SL/TP or close action.
Only public market-data GETs and isolated local memory/cache were used.

APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI_DISPATCH=NO
DEPLOYMENT=NO
PRODUCTION_CHANGE=NO
DATABASE_CHANGE=NO
WORKER_STARTED=NO
ACCOUNT_EXCHANGE_ACTIONS=0
ORDER_CHANGES=0
POSITION_CHANGES=0
SL_TP_CHANGES=0
CLOSE_ACTIONS=0

Only this sanitized report is published to SignalVerse-AI-Log/master, with
remote and immutable-commit readback verification.
