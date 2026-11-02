# Analysis page: restore the reviewed chart experience — local only

Date: 2026-11-02. Task base: `2acedfab056262f0157d8b6b9a9ecea447ff2fdf`.
Application source is uncommitted. No application push, CI dispatch, artifact,
Guard, release, deployment, VPS, database or trading operation was performed.

## Owner request and result

The owner identified the earlier localhost5191 evidence chart as the intended
experience, rather than a new design. Reuse that actual chart on the full native
Analysis page, remove the old ladder-card presentation, fix disappearance and
fullscreen, provide a local whole-page preview, then stop before deployment.
Follow-up requirements: compact the price-axis rectangles for phones; restore
the original view after zoom/panning; extend valid zone rectangles through the
last observed candle, without extending into the empty future area.

Preview: `http://127.0.0.1:5193/`. Existing localhost5191 reference was preserved.
This preview mounts the actual AnalysisWorkspace, NativeAnalysisChart,
AnalysisReportAction and useAnalysisHistory used by the application. Its server
extracts the actual existing analysis client and daily engine, makes public
market-data GETs only, and retains preview history only in memory. It does not
bootstrap App sessions, account sync, real DB, providers or exchange execution.
The macro-regime and AI-review ports are explicitly not connected in this public
preview. It is evidence of UI/input behavior, not live trading or profitability.

## Findings and fixes

1. **Integration mismatch:** App had embedded the full evidence component in the
   old two-column asset/chart layout and also mounted AnalysisScenarios beneath
   it. The native Analysis page now selects a full-width evidence layout and the
   same evidence chart. Its existing holdings input, personal purchases/history,
   risk/AI review and advisory-tracking controls are retained. The old four-card
   ladder/indicator presentation is suppressed only in this native page, not
   deleted from stored reports or other trading views.
2. **Reproducible 60-second disappearance:** useAnalysisHistory polls every
   60 seconds. PostgREST timestamptz spelling (`+00:00`) differs from the JSON
   snapshot's original ISO `Z` spelling. The strict chart validator compares
   those strings and falls back to price-only despite identical instants. The
   read boundary now canonicalizes only the report envelope timestamp. Saved
   chart JSON, digest, bar/venue/time/decision validation stay unchanged; a truly
   different instant still rejects. A newly accepted analysis also invalidates
   an already pending history request, preventing a late old response from
   overwriting it. This mechanism was reproduced offline and in local polling;
   no new Production trace/SSH investigation was performed in this task.
3. **Fullscreen measurement:** fitting while a dialog is display:none creates
   a zero-width view and compresses candles at the edge on opening. Initial fit
   and RSI-pane sizing now wait for measurable width. The native fullscreen
   view uses the viewport, with supporting explanations still scrollable below.
4. **Phone/readability:** compact axis boxes use 23px height and 26px separation,
   smaller type, and an 88px phone / 124px desktop minimum price-axis width.
   Mobile begins with fewer visible candles; full history remains accessible.
   Source price bounds and evidence identifiers are unchanged. Final colors are pale fluorescent green / light pink; chart-zone outlines are removed and fill opacity is 6% for green (12% selected) and 11% for pink (18% selected), with the owner-requested slightly stronger pink.
5. **Reset view:** the actual chart handler restores the initial time window and
   automatic price scaling for both candles and RSI. It does not rerun analysis
   or alter report/zone data. It is available in both inline and fullscreen views.
6. **Zone extension:** valid OB/FVG rectangles retain their origin and actual
   high/low, but their right edge now follows the last observed candle plus its
   half-width, clipped to the visible plot. FVG/OB names are centered inside the visible zone rectangle when there is sufficient room; compact axis labels retain full price bounds. No extension beyond the observed
   candle range or reinstatement of filled/broken zones is introduced.

7. **Distant-view text density:** a pure pixel-space collision selector reduces overlapping price-event, channel, zone and RSI labels while zoomed out. Zooming in reveals labels where space permits. All original evidence remains in the pattern/explanation list; this is not a detector or decision filter. Channel captions are abbreviated on-chart; their full status and anchors remain in the details.

## Exact task files

- `src/app/App.tsx`: native-only workspace integration and suppression of old
  presentation; all application functions' non-JSX logic remains identical.
- `src/app/components/AnalysisWorkspace.tsx`: wide native layout/action slot,
  one mounted chart at a time, existing guide/search/history/purchases retained.
- `src/app/components/AnalysisReportAction.tsx`: existing reminder logic, no
  automatic analysis; original busy/open-plan gate passed through.
- `src/app/components/AnalysisRefreshButton.tsx`: preserve disabled reason/lock.
- `src/app/components/AnalysisEvidenceChart.tsx`: measurable sizing, compact
  labels, reset and latest-observed-candle rectangle extent.
- `src/shared/analysis-chart-labels.ts`: deterministic label collisions per pane, with no change to detector data.
- `scripts/analysis-chart-labels-test.mjs`: crowded vs zoomed spacing, pane separation, offscreen rejection, deterministic ordering and input preservation.
- `src/app/useAnalysisHistory.ts`: timestamp-envelope normalization and pending
  read invalidation on acceptance; no transport/owner-policy change.
- `src/styles/analysis-workspace.css`: scoped wide/fullscreen/responsive styles.
- `src/styles/analysis-evidence-chart.css`: compact labels and reset control.
- `src/previews/analysis-page.tsx`, `src/previews/analysis-page.css`: whole-page
  local entry using the same production components, with explicit local limits.
- `scripts/preview/serve-analysis-engine-chart.mjs`: optional whole-page mode,
  memory-only history using database timestamp spelling, local public assets.
- `scripts/analysis-page-evidence-test.mjs`: actual render, timestamp failure,
  App logic preservation, reset execution and zone-extent tests.
- `scripts/standalone-analysis-client-test.mjs`: immutable read restoration,
  old-response suppression and failed-refresh preservation tests.
- `api/analyze.ts`: **one descriptive help-knowledge line only**; no API/engine
  behavior change. The test compares all remaining bytes with task HEAD.
- `HANDOFF.md` and this report: evidence and remaining release boundary.

Operator logs, public snapshot files and screenshots remain local under
`tmp/analysis-page-ux-20261102`, `tmp/analysis-chart/live` and
`output/analysis-page-ux-20261102`; they are not application commits.

## Validation

- Fresh focused suite: **116/116 PASS**, 0 failed/cancelled/skipped.
- Tests execute actual engine/chart projection, actual history hook, actual
  rendered workspace and actual reset handler against an offline chart port.
  They do not treat a source-text assertion as proof of runtime chart behavior.
- Actual reset handler restores its recorded initial range after artificial
  zoom; both scales auto-reset; repeat reset is safe; report bytes stay equal.
- Actual draw projection reaches the final candle coordinate for every rendered
  valid rectangle, without changing source data.
- Web and Admin builds: **PASS**. Existing large-bundle advisory remains.
- Strict targeted TypeScript: **PASS**, 0 diagnostics in changed components.
- Full project: **66 diagnostics**. Independent HEAD compiler overlay: 66;
  candidate: 66; introduced: **0**, removed: 0. Full project is not type-clean.
- `git diff --check`: PASS.
- Official CI / historical release scope gates: **NOT RUN**; no gate was
  changed, bypassed or represented as accepted for this uncommitted work.
- No API executable behavior, server/worker, migration, ops, workflow, trading
  strategy or exchange-adapter change. No change to saved financial records.

Browser verification and final screenshots are recorded with local timestamps
in `output/analysis-page-ux-20261102`. Desktop/mobile, D/W, fullscreen/exit,
per-zone explanation and persistence through natural history polling were
checked with public BTC/ETH reports. Reference data and current reports differ
when new native candles close; the old screenshot's prices are not hardcoded.

Final browser receipt: BTC data captured at 05:55:25.607 UTC remained available
at 05:57:49.418 UTC (over 143 seconds); the weekly snapshot still rendered,
its canvas width was 1129px, no legacy scenario card or horizontal overflow was
present. Actual pointer panning changed rendered rectangle coordinates; Reset
restored the exact preceding coordinates. Final 390x844 phone and desktop
screenshots include centered zone names, softened borderless fills and reduced
price/RSI label density. The temporary viewport override was reset. ETH daily
and weekly were also rendered from fresh public inputs.

## Safety and publication

APPLICATION_COMMIT=NONE; APPLICATION_PUSH=NO; DEPLOYMENT=NO; CI_DISPATCH=NO.
PRODUCTION_CHANGE=NO; VPS_ACTION=NO; DATABASE_CHANGE=NO; WORKER_STARTED=NO.
PP_FLAGS_CHANGED=NO; STRATEGY_CHANGED=NO; SCANNER_CHANGED=NO.
ACCOUNT_EXCHANGE_CALLS=0; ORDERS=0; POSITION_CHANGES=0; SL_TP_CHANGES=0.
Only the required redacted work report is eligible for AI-Log publication.
Production acceptance and deployment require a later authorized release; this
report does not claim that the live Telegram application already has the fix.
