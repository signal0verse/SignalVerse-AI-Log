# Local channel callouts and single-area Analysis presentation

Date: 2026-11-02. Preview: http://127.0.0.1:5193/.
Application HEAD: 2acedfab056262f0157d8b6b9a9ecea447ff2fdf.
Application commit/push/deploy: NONE / NO / NO.

## Owner's final requirement and result

The new Analysis view must not show legacy four-scenario/four-rung buying
lines or cluttered S1/L1-L4/TP1/TP2/REF labels. It should explain one selected
buy-review area and one profit-review area for the displayed daily or weekly
frame. A pinned summary must remain readable below the fullscreen chart.

The earlier requested positive-entry example exposed that the new native chart
still called the legacy confirmedChartLines helper. Even a valid existing DCA
plan is not a proven optimal single-entry plan. The owner explicitly rejected
that presentation. The final implementation removes that chart call, all its
price-line creation and the old line list. Existing campaign records, helpers,
personal purchases and trading authorization remain unchanged.

The final view shows:
- one selected native demand range and one native supply range from the
  existing selectChartEvidence projection for that exact frame;
- only these two ranges as compact axis badges; other native zones remain
  inspectable, without extra right-axis badges;
- conditional closed-candle reaction plus fresh engine entry confirmation;
- supply as a profit-review area if already bought, not a guaranteed target,
  automatic sell, or position-specific profit calculation;
- no price invented when native evidence is absent; invalid/unavailable
  weekly provenance cannot inherit daily zones;
- a pinned, compact two-column summary beneath fullscreen on desktop/phone.

Selection reuses the existing bounded native evidence ordering. It is a selected
technical area, not a statistically proven 'best' entry or a new single-entry
strategy. OPEN/ENGINE_LONG daily accumulation context does not convert a zone
touch into a newly approved single-entry trade. No engine policy was changed.

## Source-linked channel callouts

Actual rising/falling channel direction and boundary status appear in a rounded
two-line callout with a short leader and endpoint circle. Developing and broken
geometry are explicitly distinguished; neither implies entry approval.
Maximum two callouts on desktop and one on phones. Deterministic screen-space
placement avoids visible candles, other labels, Reset and other callouts.
Leader caps: 180px desktop / 220px phone. If no safe placement exists, omit the
callout while retaining the full evidence below. Existing geometry is unchanged.

## Exact files touched in this follow-up

- src/app/components/AnalysisEvidenceChart.tsx: callouts; remove legacy campaign
  price lines/list; selected native entry/profit explanations; two axis badges.
- src/shared/analysis-chart-labels.ts: bounded collision-aware callout layout,
  anchored geometry and exact source status wording.
- src/styles/analysis-evidence-chart.css: compact callout styling.
- src/app/components/AnalysisTradeSummary.tsx: read-only native daily/weekly
  selected-area summary; rejects missing/mismatched frame provenance.
- src/styles/analysis-trade-summary.css: compact readable two-column summary.
- src/app/components/AnalysisWorkspace.tsx: fullscreen summary slot and measured
  remaining chart height; observer cleanup on close.
- src/styles/analysis-workspace.css: fullscreen grid, pinned summary and phone sizing.
- src/app/App.tsx: summary import and native Analysis JSX slot only.
- src/previews/analysis-page.tsx: same real workspace/chart/summary integration.
- scripts/analysis-chart-labels-test.mjs: seven added callout tests.
- scripts/analysis-trade-summary-test.mjs: eight new render/provenance tests.
- scripts/standalone-chart-presentation-test.mjs: replace one obsolete legacy
  presentation-text expectation with explicit fresh-entry and no-ladder checks.
- api/analyze.ts: one descriptive help-knowledge line only; no executable API change.
- HANDOFF.md and this report: evidence and boundaries.

All preceding uncommitted Analysis-page/history/preview work was preserved.
This list describes the follow-up; the complete dirty tree also contains that
prior work. No unrelated local change was discarded or included in a commit.

## Fresh validation

Final audited offline command:
node --test scripts/analysis-page-evidence-test.mjs scripts/analysis-chart-labels-test.mjs scripts/analysis-trade-summary-test.mjs scripts/standalone-analysis-client-test.mjs scripts/standalone-chart-evidence-test.mjs scripts/standalone-chart-review-test.mjs scripts/standalone-chart-presentation-test.mjs scripts/standalone-chart-geometry-test.mjs scripts/standalone-developing-channel-test.mjs scripts/analysis-refresh-reminder-test.mjs

Result: 131 tests, 131 PASS, 0 failed, 0 skipped/cancelled/todo.
An earlier fresh run was 130 PASS / 1 failure: its assertion expected the removed
legacy wording 'No displayable entry confirmed'. The owner-required presentation
now says a zone touch requires fresh engine entry confirmation. The test now
checks this explicitly and retains WAIT/no-buy authorization checks. No engine,
snapshot, authorization, provenance or release gate was weakened.

Eight new summary tests cover:
1. READY legacy campaign cannot display its four entries or TP range;
2. WAIT areas remain conditional and not guaranteed exits;
3. DCA allocation/recorded legs cannot authorize a new single entry;
4. no native zones means no fabricated price or DCA fallback;
5. independent weekly zones cannot inherit daily prices;
6. native chart has no campaign price-line call or rendered legacy labels;
7. missing/mismatched provenance fails closed;
8. App and preview use the same pinned summary slot.

Callout tests cover unchanged anchors, deterministic bounded/no-overlap placement,
desktop/phone limits, candles/Reset occupancy, source statuses, invalid geometry,
phone fallback and short leader limits.

Strict focused TypeScript: PASS, zero diagnostics.
Web build: PASS (28.95s); Admin build: PASS (6.99s).
Existing large-bundle advisory remains; it is not a build failure.
git -c core.autocrlf=false diff --check: PASS.
Full-project TypeScript was not rerun for this UI follow-up. The earlier
baseline comparison (66 -> 66, zero introduced) is historical evidence only.
No official CI/release gate was run, modified or bypassed.

Actual render/AST parity regressions pass: App non-JSX/trading function logic is
unchanged; API bytes match HEAD after excluding the single descriptive help line.
Protected server/migrations/ops/deploy/.github/TRADING_STRATEGY diff is empty.

## Browser evidence

Actual local page/React/chart components were tested with newly fetched public
Binance data. The isolated transport runs the existing standalone daily engine,
without macro-regime, AI-review, account, DB or order ports. This is technical
preview validation, not complete Production or profitability acceptance.

ETH report receipt: 2026-11-02T06:27:25.819Z.
Daily engine context: OPEN / ENGINE_LONG. Native daily input digest:
87f3c0d05c2c7493246613f6bf82823f6b728ecca94548c38941cc57df2e473c.

| View | Selected native demand | Native supply / profit review |
| --- | --- | --- |
| ETH daily | 1,923.27-2,221.54 | 2,262.49-2,323.20 |
| ETH weekly | 1,931.57-2,387.28 | 2,579.88-2,635.69 |

These are observed source ranges, not execution advice/fills/SL/TP orders.
The summary never relabels the first legacy DCA rung as an optimal entry.

Observed desktop fullscreen: 2 native axis badges, no S1/L1-L4/TP1/TP2/REF
text, 2 short channel callouts, visible pinned summary below the chart.
Observed 390x844 phone: no horizontal overflow, 2 axis badges, at most 1
channel callout, readable pinned summary and working Reset.
Switching to weekly changes both summary ranges using independent weekly
provenance. The desktop viewport was restored after phone testing.

Local screenshots:
output/analysis-channel-callouts-20261102/final-eth-daily.jpg
output/analysis-channel-callouts-20261102/final-eth-mobile.jpg
output/analysis-channel-callouts-20261102/final-eth-weekly.jpg

Local DOM proof:
output/analysis-channel-callouts-20261102/final-area-proof.json

Logs:
tmp/analysis-channel-callouts-20261102/regression-final.log
tmp/analysis-channel-callouts-20261102/build-final.log
tmp/analysis-channel-callouts-20261102/types-final.log

## Safety / publication

No application commit, source push, CI dispatch, artifact, Guard or deployment.
No Production/VPS/DB access/change, worker start, PP flag change, scanner action,
account exchange call, order, position, entry, SL or TP mutation.
Public market-data GETs and isolated local memory/cache only.
Strategy, Decision Engine, execution adapters and financial authorization unchanged.

APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI_DISPATCH=NO
DEPLOYMENT=NO
PRODUCTION_CHANGE=NO
DATABASE_CHANGE=NO
WORKER_STARTED=NO
ACCOUNT_EXCHANGE_ACTIONS=0
ORDERS=0
POSITION_CHANGES=0
SL_TP_CHANGES=0

Only this sanitized work report is published separately to AI-Log/master.
