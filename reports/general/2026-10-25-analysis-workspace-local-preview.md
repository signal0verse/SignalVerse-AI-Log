# Analysis workspace UI/UX — local preview ready

## Metadata

- Date: 2026-10-25, Asia/Kuala_Lumpur.
- Task ID: analysis-workspace-local-preview-20261025.
- Repository: signal0verse/signalverse-main.
- Local branch: `codex/analysis-ui-preview-20261025`.
- Base: `3f6a657316e694e834e4c9c76966edc4d96c744b`.
- Local source commit: `cdf67dbd9bc6274eafc905469b3c02dbc2af9696`.
- Result: LOCAL PREVIEW READY. Source branch is not pushed; no merge/deployment.
- This task is separate from the earlier successful general Telegram shell release.

## Objective

The owner requested inspecting the Telegram Analysis page and first showing a
local design that keeps Run Analysis visible, places asset search inside the
page, and provides an inline chart that can expand to the whole Mini App
viewport. Additional UX improvements should reduce visual clutter. The current
request explicitly limits this stage to local review.

## Scope and observed evidence

Read-only inspection confirmed that the current Analysis action is below the
initial viewport, a chart is hidden behind a button, and stacked selection,
tutorial, holdings and indicator content delays the primary task. No live Run
Analysis, message, account/settings change, mode switch or order action was used
to inspect the page. Private Telegram URL parameters, account figures and live
screenshots are excluded from both this report and the prototype.

## Actions Taken

1. Created a separate branch from the existing deployed-shell source and preserved
   the unrelated original checkout. Eight task files are committed locally.
2. Added a pure Analysis presentation component and a separate HTML preview entry.
   The main App, global stylesheet imports, backend and running product are unchanged.
3. Kept a fixed Run Analysis action immediately above the existing main navigation.
   Short mobile layouts compact supporting content so search, chart and action
   are visible together in the first viewport.
4. Put asset search directly below the Analysis title. Symbol, English/Persian
   names and aliases work; Arabic/Persian letters and whitespace normalize.
   Keyboard selection, clear, outside/blur dismissal and an empty/reset state
   are supported. Selection closes the list and updates the chart/asset summary.
5. Reused the original supplied SignalVerse logo and bundled currency-icon
   registry, header and navigation, without installing dependencies.
6. Added a preview-only candlestick chart with three view intervals and a native
   fullscreen modal. Initial chart sizing waits for a visible container. Close
   and Escape restore focus; background page scrolling is locked while open.
7. Collapsed optional holdings and indicator groups, positioned the sample report,
   and kept Guide/History secondary. Icon-only controls retain accessible names.
   Preview controls offer regular mobile, small mobile, desktop and both languages.
8. Added explicit synthetic-data labels. All 10 asset records, prices, deterministic
   candles, history and report states are design samples. Local Run only waits
   one second and displays a labeled sample result; it calls no analysis engine,
   account, credit or order endpoint. Other navigation targets show a preview notice.
9. Recorded scope, verification, integration requirements and local-only approval
   boundary in HANDOFF.md, docs/AI_HANDOFF.md and the new design handoff. Floating
   help is not changed for an isolated prototype; it must describe actual behavior
   when the approved UI is integrated later.
10. Left the loopback Vite preview open for the owner and preserved local synthetic
    screenshots. No private/live screenshot is saved or published in this report.

## Files Changed

- `src/app/components/AnalysisWorkspace.tsx` — presentational Analysis workspace.
- `src/previews/AnalysisSampleChart.tsx` — deterministic design-only chart.
- `src/previews/analysis-workspace.tsx` — isolated sample data/actions and review host.
- `src/styles/analysis-workspace.css` — scoped layout and responsive styles.
- `previews/analysis-workspace.html` — separate preview entry.
- `docs/analysis-workspace-ui-preview.md` — design, checks, limits and next stage.
- `HANDOFF.md`, `docs/AI_HANDOFF.md` — newest local-only handoff entries.

## Checks and Results

| Check | Result |
| --- | --- |
| Strict TypeScript for the new preview entry | PASS, exit 0 |
| Production-mode Vite build of only this HTML entry | PASS |
| Output dependency-scope audit | PASS: only preview/new presentation, existing Telegram/coin presentation, styles and libraries; no App/auth/session/Telegram SDK/API/analysis engine |
| Persian mobile and 360×600 small-mobile first view | PASS: search, whole chart and Run visible; Run is y476–523, navigation starts at about y533 |
| Original logo and BTC icon | Loaded successfully from existing bundled assets |
| Persian name, Arabic-normalized name and symbol search | PASS; ETH/SOL selection updates chart; Enter closes list |
| Empty search and reset | PASS |
| Chart interval and fullscreen | PASS; chart fills available area, close/Escape and focus return verified |
| Guide, History and back | PASS in Persian; History/back also checked in English |
| Local Run busy/result flow | PASS: temporarily disabled busy state, then explicitly synthetic sample report |
| English desktop rendering | PASS |
| Browser warnings/errors after final reload and final fullscreen flow | None captured |
| Existing App/backend/workers/scripts/workflows/global styles diff | Unchanged against base |
| Git diff whitespace check and task-only local commit | PASS; worktree clean after commit |

The targeted type command uses `--noEmit --strict --skipLibCheck --jsx react-jsx
--target ES2022 --module ESNext --moduleResolution bundler` against
`src/previews/analysis-workspace.tsx`. Build and dependency-audit helpers/output
remain local task artifacts, outside the committed application. Full release CI
was not run and is not claimed for this isolated prototype.

## Publication and Runtime State

- New executable source: committed locally only; no source push or main merge.
- New UI deployment: NOT PERFORMED. No release workflow, server or production
  configuration was changed during this task.
- Prior deployment receipt identifies the general-shell active source as the
  base above. Runtime pins were not revalidated during this local design task;
  no new runtime activation or financial acceptance is claimed.
- This sanitized report is published separately to SignalVerse-AI-Log/master,
  as required by the owner's standing reporting instruction. The publication
  helper verifies the remote file bytes before reporting success.

## Remaining Limitations and Next Step

This is a reviewable design prototype, not authenticated product integration.
The catalog has 10 sample assets; history and indicator values are placeholders.
Physical mobile keyboard, touch gestures/safe areas and full authenticated flows
were not tested. Host Node is24.19.0; the specified Node22 release runtime was
not independently tested for this prototype.

After owner design review, integrate the chosen layout around the existing real
catalog, chart provider, holdings, reports/indicators, history and tour hooks.
Keep the exact existing analysis callback, disabled/permission/credit conditions,
provider and financial/risk policies. Remove design fixtures instead of treating
them as a fallback for failed real data. Update floating help for actual behavior.
Any later production release still needs the established preservation, exact-SHA
CI/artifact, private backup/restore and independent approval gates.

No strategy change, profile/account edit, credit-policy change, migration, forced
scan, live test analysis/order, worker activation, durable-hold change or claim of
profitability/private-account execution is part of this task.
