# Native Analysis versus admin Telegram chart — read-only findings

Recorded: 2026-11-04T04:51:46.419467+00:00. Owner requested this report before repairing the three
remaining CI failures. No deployment or application change in this audit.

The current admin preview visibly renders six actual zones, two channel callouts,
price candles, volume and RSI. DOM measurement: SVG903x481.333px, no inline width
or height, outside .sv-workspace. No Analyze/Publish/scheduler control was clicked.
The prepared admin preview was preserved.

The separately opened public native Analysis page is inside .sv-workspace. Its
live stylesheet applies `.sv-workspace svg { width:20px;height:20px;flex-shrink:0 }`.
Observed public asset: `/assets/index-CEvbzfUM.js`. The previously verified runtime
c1619552 source has chart width/height attributes without inline style, which lose
to that CSS rule. The candidate's AnalysisEvidenceChart.tsx:135 already binds
measured width/height inline. That fix passed the eighteen direct chart proofs
inside CI41673654138, but the candidate has not been deployed. This explains why
the admin surface can render full overlays while the native host clips them.

Both surfaces use the same AnalysisEvidenceChart renderer: native App.tsx:17638
through NativeAnalysisChart, admin TelegramAnalysisPanel.tsx:16 directly. No
independent admin strategy or copied indicator engine is needed. The native
wrapper validates the report symbol/time/frame/evidence, while admin uses the
fresh prepared report. Native history polls every60seconds. Missing/old/mismatched
saved evidence must remain an explicit unavailable state, never fabricated zones.

Evidence limitation: the separate native tab was unauthenticated and had no saved
analysis report. Therefore this audit does not claim that the owner's native
report and admin preview have identical report ID/time/input hash. No credentials,
session tokens, Telegram authentication fragment or private account history were
copied to compare them. The live CSS rule, live admin dimensions, actual source
paths and earlier local exact-report host regression establish the display defect.
Existing candidate also retains normalized history timestamps/report identity and
the full retained pattern catalog; those improvements remain unreleased.

The next implementation is limited to the three identified CI/test-source
contracts. No new application/backend/engine/Strategy change is required by this
observed CSS defect; reuse the already-tested pending fix. Production remains
untouched, and the new candidate must pass the unchanged official full CI before
any separate future release consideration.

PRODUCTION_MUTATION=NO
DEPLOYMENT=NO
FRESH_ANALYSIS_RUN=NO
TELEGRAM_POST_SENT=NO
WORKER_STARTED=NO
DATABASE_MUTATION=NO
EXCHANGE_ACTIONS=0
