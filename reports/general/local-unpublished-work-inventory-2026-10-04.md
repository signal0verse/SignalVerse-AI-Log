# Local unpublished work inventory — SignalVerse
Date: 2026-10-04, Asia/Kuala_Lumpur. Read-only inventory, not publication/release authorization.

## Executive result

The completed Demo accounting release is already on origin/main at f1f4981d48a26ed2aa88af4d46186266b5748dcb. Unpublished local material is not one deployable feature bundle: it includes experimental PP source, obsolete UI/test worktrees, historical commit identities, diagnostic scripts, documentation, personal configuration and generated media/test products. No application code was edited, staged, committed or pushed by this audit.

## Evidence and limitations

Authenticated origin fetch refreshed remote branch references without moving local branches. Inspected registered worktrees, tracked diffs, untracked paths, local branch ancestry and report blob hashes. No tests, private runtime/database/credentials or exchange APIs were executed/accessed. No file contents from personal .claude settings or temporary credential-related files were read. Temporary dependency trees produced access warnings during the initial broad listing; the final inventory deliberately excludes bulk tmp/output/node_modules trees from source-worktree counts. This is not a certification of every scratch file or every separate repository on the computer.

Primary checkout: codex/prediction-coverage-expansion-audit at 0dbca62357a4adf34240f40ceda3e387356ec4b0. Its only tracked modification is HANDOFF.md (+323/-0 lines), largely accumulated coordination/release receipts. No tracked api/src/server modification exists in the primary checkout. That does not mean the separate experimental worktrees are clean.

## Uncommitted experimental application work

### Native exit ownership prototype
Worktree: tmp/futures-pp-auto-enrollment-20261002.
- Modified api/copytrade.ts: five added lines.
- Untracked api/_shared/futures-native-exit-ownership.ts.
- Untracked migrations/futures_native_exit_authority_candidate.sql.
These draft identity/ownership objects are absent from current main. No migration or release is authorized by their presence.

### Exclusive-writer / shared close safety prototype
Worktree: tmp/pp-exclusive-writer-20261003.
Seven tracked modifications:
- api/_shared/futures-profit-protection-execution.ts
- api/_shared/partner-copytrade-context.ts
- api/copytrade.ts
- scripts/futures-gate-mexc-fault-test.mjs
- scripts/futures-real-execution-fault-test.mjs
- server/partner-copytrade/network.mjs
- server/partner-copytrade/service.ts

Nine untracked files:
- api/_shared/futures-exclusive-writer.ts
- migrations/futures_exclusive_writer_candidate.sql
- reports/futures/pp-binance-native-fence-exclusive-writer-2026-10-03.md
- scripts/futures-exclusive-writer-inventory.mjs
- scripts/futures-exclusive-writer-proof.mjs
- scripts/futures-exclusive-writer-quarantine-test.mjs
- scripts/futures-exclusive-writer-scope-test.mjs
- scripts/futures-exclusive-writer-validation.mjs
- scripts/lib/isolated-signed-transport.mjs

The existing report explicitly classifies this prototype BLOCKED_NOT_PROVEN. Synthetic race proof is not proof of a real enforced account boundary. It must not be merged/deployed merely to clear local changes. Core new helper and candidate migration are absent from origin/main.

### Adverse-trend PP detector proposal
Worktree: tmp/pp-adverse-trend-proposal-20261004.
- Modified HANDOFF.md and TRADING_STRATEGY.md.
- Untracked api/_shared/futures-profit-protection-adverse-market.ts.
- Untracked scripts/futures-profit-protection-adverse-market-test.mjs.
- Untracked docs/futures-profit-protection-adverse-market-proposal.md.
- Two local reports: pp-adverse-market-data-gate-2026-10-04.md and pp-adverse-market-local-detector-2026-10-04.md.
Existing reports record 71 offline detector tests, a historical scope failure and missing matched evidence for economic comparison. Automatic Production protection remains BLOCKED/NOT_PROVEN. Detector source/test are absent from main. No new test was run in this inventory.

## Obsolete / deliberate fixture worktrees, not missing release features

- tmp/pp-ui-control-cleanup-20261004: earlier HANDOFF/docs/UI/test edits and three untracked test/report files.
- tmp/pp-ui-current-main-20261004: earlier FuturesProfitProtection.tsx/UI-test edits plus cleanup test.
- The final replacement UI removal was already published as 14c68c7 and is inherited by current f1f4981; do not publish these stale working copies over it.
- tmp/futures-pp-worker-main-current-20261002: old scope-test modification.
- tmp/pp-scope-contract-negative-20261002: deliberately modified scope/test/worker files used as negative fixtures; not a release candidate.
- Two historical Futures release/completion checkouts have HANDOFF edits and a local final-release report.
- Other reviewed task checkouts contain report-only leftovers.
- Demo accounting checkout has no tracked diff; its only three untracked files are generated output/partner-copytrade/main.mjs, manifest.json and native-service-test.mjs. They are not omitted application changes.

## Historical local commit identities

Exactly 42 commits reachable from local branches are not reachable from refreshed remote refs:

| Local branch | Commit count | Tip |
| --- | ---: | --- |
| codex/binance-stage1b-isolated-20260925 | 4 | 4fd7ebf0b276277a767b48b678e0b25cd9d84bf2 |
| codex/failed-claim-recovery-20260926 | 5 | fe07a9a855178e1208c426107aaa5972243c64db |
| codex/futures-completion-20260925 | 1 | e9edb886f24fe693243ac9e8776ca87820bf9fd5 |
| codex/futures-correctness-2026-09-22 | 6 | 9f088fe809c77afed3644fcc133413302d786a27 |
| codex/production-deploy-control-20260924 | 26 | 01601ee84b2152b88831d5f8f156f82d52115d65 |

The last branch includes historical Guard/control reports and the old Parity Inventory Rebalance Demo implementation. git cherry reports no identical patch IDs against current main for these commits. Neither ancestry nor patch-ID inequality proves that their functionality is missing from newer reconstructed/integrated releases. They need a semantic comparison before any proposed integration; this audit did not recommend blindly merging 42 commits.

## Primary untracked files outside tmp

126 paths:
- 93 reports.
- 26 scripts: 24 scripts/_tmp-* audit/replay/backtest/VPS/DB diagnostic utilities, scripts/diagnostics/pp-account-serialization-close-safety-proof.mjs, scripts/generate_analysis_catalog_pdf.mjs. None executed. Some names identify potentially mutating utilities; they are not safe merely because named test/audit.
- 2 personal files: .claude/launch.json and .claude/settings.local.json. Contents not inspected or published.
- 5 generated media/prompt/PDF files: two Spot YouTube covers, their prompt files, and output/pdf/signalverse-analysis-catalog-fa.pdf.

Report comparison with AI-Log HEAD 2753597911d60a58f399df65ba8cc5f6dbc6e405:
- 65/93 have identical canonical Git blob content at the same published path.
- 4/93 exist at the same path with different local content: continuous-auto-scanner-production-ci-blocked-2026-09-30.md, continuous-auto-scanner-production-preflight-2026-09-30.md, real-futures-strategy-stage1a-real-candle-provenance-2026-09-25.md, prediction/2026-10-01-0909-prediction-coverage-expansion-audit.md.
- 24/93 were not found at the same AI-Log path. Different filenames or other repositories were not searched, so this is NOT proof they were never published elsewhere.
Therefore “untracked in the application checkout” must not be reported as “all 93 reports were never published.”

## Media / scratch work

The Spot tutorial release checkout retains two untracked Persian video exports and poster.jpg. Primary tmp also contains isolated checkouts, downloaded runtimes/dependencies, builds, diagnostic evidence and older candidate snapshots. Those are local artifacts, not automatically application-source commits. No bulk staging, cleanup or private-file publication is appropriate.

## Disposition

- Completed Demo display fix: already published and deployed; nothing omitted from that reviewed source release.
- Experimental PP source: local, uncommitted, not approved for Production.
- Old UI/negative fixtures: preserve as historical/test evidence, not main changes.
- Old local commits: preserve; do not infer all should be merged.
- Reports: many already on AI-Log; reconcile differences separately if requested.
- Personal configs/generated products: keep out of blind source publication.

APPLICATION_CHANGE=NO
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI=NOT_RUN
DEPLOYMENT=NO
VPS_DB_EXCHANGE_ORDER_POSITION_ACTIONS=0

Only this sanitized inventory report is published to AI-Log under the standing reporting instruction.
