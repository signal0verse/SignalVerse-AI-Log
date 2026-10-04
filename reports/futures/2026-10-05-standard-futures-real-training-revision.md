# Standard Futures Real-first bilingual training revision

## Metadata

- Date: 2026-10-05 (Asia/Kuala_Lumpur)
- Task ID: Standard Futures Real education and narration revision
- Module: Futures customer tutorial and Persian/English voice scripts
- Mode: Local education-only implementation and offline validation; report publication only
- Repository: signal0verse/SignalVerse
- Branch: codex/futures-tutorial-20261004
- Starting commit: 677c2df251bfe533581afca4d8cf702062183773
- Ending commit: 69ea2b1902302ba9bd253a24530957bdfd9df3a9
- Trading/source scope baseline: f1f4981d48a26ed2aa88af4d46186266b5748dcb
- Production/runtime SHA: not inspected in this request; no deployment performed

## Objective

The owner requested a complete Standard Futures tutorial focused on the Real workflow, only a short Demo note at the end, and no Fast Trader or Simulation Lab material. Both the site text and Persian/English narration had to be corrected. The brand name must not appear in spoken scripts. Earlier instructions require receiving the owner's recordings before editing Futures video.

## Scope

Revise the existing local education implementation, not the trading strategy, feature availability, user accounts or runtime configuration. Preserve primary-workspace edits and existing untracked media. No source push to a delivery branch was requested in this turn. The standing owner instruction authorizes publication of this work report to SignalVerse-AI-Log/master independently of executable-source delivery.

## Actions Taken

1. Inspected status and reused the existing education checkout, rather than touching the unrelated dirty primary tree.
2. Read the project contribution/release boundaries, current handoff and safe test runbook. The full strategy and current call-site audit from the immediately preceding education task remain the unchanged source basis.
3. Revised the shared bilingual lesson source from 26 chapters to 24: 23 Standard Futures Real chapters and one brief concluding Demo note.
4. Rewrote workflow/access, Real scanner profile, Real exit and final-check wording. Removed the separate detailed Demo accounting, Fast Trader and Simulation Lab chapters, then added the short Demo conclusion.
5. Changed only the tutorial button/modal labels in App.tsx and the dated tutorial-description paragraph in floating-help knowledge. Preserved actual Fast Trader and Simulation Lab features and all financial controls.
6. Regenerated the four exact text exports and extended scope/content tests. Updated training documentation and HANDOFF.md.
7. Completed offline render/scope checks, strict education-module type checks, production builds and non-executed API syntax bundles.
8. Verified the actual isolated tutorial in the local browser in both languages and retained current screenshots outside Git.
9. Committed only the 12 task files locally. Prepared the dated public work report with no account data, credentials or generated test artifacts.

The writing-quality skill guided the practical, recordable prose and connected workflow explanations. No cloud Page or new media asset was created.

## Files Inspected

- AGENTS.md, CLAUDE.md, latest HANDOFF.md entries, docs/AI_HANDOFF.md and docs/COLLEAGUE_HANDOFF_2026-09-29.md.
- docs/testing/stability-test-runbook.md.
- src/app/futuresTutorialLessons.ts and src/app/FuturesTutorialContent.tsx.
- src/app/App.tsx, specifically FuturesCustomerCatalog.
- api/analyze.ts floating-help tutorial description.
- scripts/futures-tutorial-export.mjs and scripts/futures-tutorial-ui-test.mjs.
- docs/training/futures/README.md and both dialogue/chapter exports.
- vite.config.ts and vite.admin.config.ts.
- The existing isolated preview entry/configuration and the AI-Log report template.
- Read-only test assertions inspect api/copytrade.ts, TRADING_STRATEGY.md and src/app/copyTradeAccounting.ts against the exact source baseline; these files were not changed.
- Official Binance margin-mode and Futures-fee articles, reopened on 2026-10-05. App-specific behavior remains grounded in the inspected source, not inferred from those exchange articles.

## Files Changed

Executable source repository, all committed locally:

- HANDOFF.md
- api/analyze.ts (one education-description paragraph only)
- docs/training/futures/README.md
- docs/training/futures/fa-dialogue.txt
- docs/training/futures/en-dialogue.txt
- docs/training/futures/fa-chapters.txt
- docs/training/futures/en-chapters.txt
- scripts/futures-tutorial-export.mjs
- scripts/futures-tutorial-ui-test.mjs
- src/app/App.tsx (tutorial catalog text only)
- src/app/FuturesTutorialContent.tsx (tutorial introduction)
- src/app/futuresTutorialLessons.ts

This report is mirrored locally under reports/futures/2026-10-05-standard-futures-real-training-revision.md and published separately in the reporting repository. Build outputs and screenshots stay local and untracked.

## Root Cause / Findings

### CONFIRMED

- The previous 26-chapter guide interleaved Demo and Real and included separate Fast Trader and Simulation Lab chapters. It therefore did not meet the owner's narrower Real-first training request.
- The revised source has 24 paired chapters in the same order in both languages.
- The first 23 chapters contain no Demo mention. The final Demo paragraph is under 100 words in each language.
- No excluded topic or brand name appears in the tutorial lesson text or generated voice scripts.
- Full Standard Real coverage remains: access and connection, Personal List, margin/leverage and supported margin modes, timeframes, cycles/credit, start/stop, decision/WAIT, Auto Scanner discovery/ranking/profile/maintenance/timing, pending execution, protection, exit, eligible Binance Re-Analysis, manual closure/reentry, finalized accounting, history/posts and risk.
- The app text and scripts come from one lesson source and match exactly.
- Outside the educational catalog/import, App.tsx is unchanged from the exact trading/source baseline. API handlers outside help knowledge, trading API, strategy and accounting source are unchanged.
- Relative to the previous tutorial commit, the analyze API change is limited to its single dated tutorial-description paragraph.

### UNCONFIRMED

- Presence of this revised guide in production: not deployed.
- Physical Telegram Android behavior, actual private-account execution and profitability: not tested or claimed.
- Current active runtime SHA: not observed during this request.
- Full official Linux CI/release acceptance: not run; narrow local tests are not a substitute.

## Implementation

The Real workflow now starts with Standard/Real selection, exchange eligibility, account readiness and usable trading funds, separately from service credit. The scanner chapters keep the difference between one-off discovery, a persistent Real profile, later analysis and verified entry. Disabling scanning, stopping analysis and closing a position remain distinct actions.

The Real exit chapter explains the existing full first-target take-profit policy, distinguishes analytic later targets from live exit orders, and warns that a partial fill or a chart touch is not confirmed full closure. Existing exchange costs and pending finalization remain explicit in Real accounting.

The last chapter gives only a brief Demo note: virtual funds, no live orders, different target allocations, after-modeled-fee display with unmodeled funding and gross-settled virtual balance. It does not present Demo results as confirmed Real net profit.

No internal score weights, numeric engine formula, private data or promise of profits is disclosed. No voice, video, timestamped subtitles or Futures YouTube embed was created. Audio timing will follow the recordings supplied by the owner.

## Tests Executed

- node scripts/futures-tutorial-export.mjs — PASS. 24 chapters exported per language; 1,855 Persian spoken words and 1,800 English spoken words.
- node --test scripts/futures-tutorial-ui-test.mjs — PASS, 12/12, run twice after content and handoff completion. Checks: bilingual inventory/brand exclusions, Real-only main chapters, brief last Demo chapter, practical rule coverage, actual RTL/LTR accordion render, actual catalog shell, exact App/API preservation, single dated help-paragraph delta and exact script parity without invented timestamps.
- Strict TypeScript createProgram for the two education modules, with noEmit/strict/skipLibCheck/React JSX/bundler resolution — PASS, zero diagnostics.
- git diff --check and staged diff check — PASS. Git emitted existing LF/CRLF normalization notices; no whitespace errors.
- esbuild bundles of api/analyze.ts and api/copytrade.ts with platform=node, packages=external, write=false — PASS. These are syntax bundles, not API execution.
- Current browser QA at the existing 781 by 954 viewport — PASS for Persian RTL, English LTR, 24 chapters, final-only Demo, accordion expansion, no horizontal document overflow, close via Escape and restored body scrolling.

The preview extracts only the actual tutorial component. It does not bootstrap account/trading code and rejects fetch. No database, account endpoint, order, scanner job, paid analysis, dotenv loader or timer activation was executed.

## Build Result

- Web production build — PASS: 2,038 transformed modules, 16.57 seconds. Existing large-chunk warning remains. Output retained locally under build-web-real-20261005.
- Correctly rooted separate admin build — PASS: 1,713 transformed modules, 7.59 seconds; JS entry 298.65 kB, CSS 17.50 kB. Output retained locally under build-admin-real-verified-20261005.
- Important correction: an initial combined build invocation passed the web root into the admin config, building the web entry a second time. That output was not accepted as admin verification; the actual admin build was rerun without the root override. Earlier generic build summaries are not evidence of the separately rooted admin entry.
- Build envDir points to the isolated local preview directory rather than repository credential files.
- Host Node is 24.19.0; production Node 22 and full Linux CI were not exercised.

## Git Status

- Source branch: codex/futures-tutorial-20261004.
- Source tracked tree clean after the local commit; existing untracked public/ media preserved.
- Primary dirty workspace not consolidated, reset or staged.
- No source-branch push, main merge or VPS deployment performed.
- Reporting checkout was clean and fast-forward synchronization reported already up to date before creating this report. Only this report is staged/published there; final remote-content verification is reported in the user handoff.

## Commit

Local source commit: 69ea2b1902302ba9bd253a24530957bdfd9df3a9

Message: docs: focus bilingual futures tutorial on standard real trading

This is a local education commit, not a production rollout.

## Remaining Issues

- Waiting for the owner to record and supply Persian and English narration before video editing/synchronization.
- Existing form loop labels that describe analysis attempts remain outside scope; the guide accurately describes confirmed-opening consumption.
- Production publication requires a separately authorized promotion, reviewed exact release-contract successor and full CI. Historical hashes/financial assertions must not be weakened to accept this education delta.

## Risks / Limitations

Educational changes do not prove exchange execution, protection, finalized private-account profit or current production availability. Feature eligibility and exchange limits still apply. No financial policy, existing record, scanner profile, subscription, worker, credit balance or protective order was changed.

Screenshots are current local render evidence only, not a real customer-account capture. No new viewport override was set. No private account screenshots, credentials, database exports or media/build artifacts are included in the report or source commit.

## Recommended Next Step

Have the owner use the revised brand-free narration files for voice recording. Then synchronize the educational video and chapter timing to the supplied audio. Keep any production promotion separate from this completed local text revision.

## Public Reference Check

General margin and cost wording was rechecked using:

- [Binance Futures margin modes](https://www.binance.com/en/support/faq/detail/360038075852)
- [Binance Futures fees](https://www.binance.com/en/support/faq/detail/98488a516eb84e3eb34605683dffd554)

These references support general education only, not claims about this app's live account execution.
