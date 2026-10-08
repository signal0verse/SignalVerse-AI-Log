# Spot allocation: existing release and live UI verification

## Metadata
- Date: 2026-10-09 (Asia/Kuala_Lumpur)
- Task ID: spot-allocation-existing-release-verification
- Module: spot
- Mode: read-only release verification and unsaved UI preview
- Repository: signal0verse/signalverse-main
- Branch: main release inspected; reporting targets AI-Log master
- Starting commit: primary checkout 0dbca62357a4adf34240f40ceda3e387356ec4b0
- Ending commit: primary checkout unchanged; fetched main eeb04b7ea76de4808ac204bb5842fde1675411aa

## Objective
Owner requested independent scenario/ladder allocation presets and engine-auto for Spot Demo and owned real Binance/MEXC/Gate, tests, interactive preview and deployment. A follow-up explicitly authorized deployment once ready.

## Scope
Preserve private/untracked work and existing accounts/orders. Inspect the current implementation and release, avoid duplicate publication if already deployed, verify the live UI without saving setups or placing orders.

## Actions Taken
1. Checked existing dirty primary checkout and preserved it. Retrieved origin/main using the existing GitHub CLI credential helper after the default credential dialog failed.
2. Found the exact feature already committed by other work in 4f8ee60 and eeb04b7. Did not claim authorship or recreate it.
3. Inspected allocation policy, owned bridge, UI, tests, migration test harness, frozen source scope and release workflow.
4. Created a managed inspection checkout at the exact main SHA; no source edits there.
5. Read official CI, artifact preparation and release runs. All succeeded; release log reports deployed exact SHA at 2026-10-08T19:05:51Z, equivalent to 2026-10-09 03:05:51 in the owner's timezone.
6. Public core health returned ok=true at 2026-10-08T19:16:40.732Z. The guessed CrossVerse /api/health path returned404; this is not evidence of an application outage.
7. Opened the current authenticated member UI through the browser. The actual Spot Demo and owned MEXC setup forms contain both independent allocation controls.
8. In an unsaved Demo form, checked diamond scenarios15/35/35/15 with reverse ladders40/30/20/10; displayed amounts matched the form budget. Editing a ladder percentage selected manual and exposed invalid-sum feedback. Engine-auto showed waiting text rather than invented percentages.
9. At viewport390x844, both auto fieldsets were RTL and had clientWidth=scrollWidth=308, with no local horizontal overflow. Reset the viewport.
10. Cancelled unsaved forms. No create/update setup, account changes, purchase, order, funded execution or DB mutation was performed by this verification.

## Files Inspected
AGENTS.md, CLAUDE.md, latest HANDOFF.md and docs/AI_HANDOFF.md entries; strategy and safe-runbook excerpts; docs/INTERNAL_SPOT_PAPER_2026-09-29.md; api/_shared/spot-capital-allocation.ts; api/_shared/partner-spot-allocation.ts; src/app/SpotCapitalAllocation.tsx; scripts/spot-capital-allocation-test.mjs; scripts/spot-capital-allocation-sql-test.mjs; scripts/spot-capital-allocation-browser.mjs; scripts/lib/spot-capital-allocation-parity.mjs; .github/workflows/production-release.yml. CrossVerse coordination/deployment documentation was read only. No credentials were read or published.

## Files Changed
Only this report in the primary workspace. No application changes.

## Root Cause / Findings
- CONFIRMED: the local checkout used earlier in this conversation was behind current main and did not represent the already published feature.
- CONFIRMED: fixed presets, legacy-manual defaults, engine-auto validation, immutable active allocation snapshots and owned-only bridge are in the inspected release source.
- CONFIRMED: allocation controls are served by the live member UI in Demo and the existing MEXC Spot route.
- UNCONFIRMED: exact current server-process SHA via SSH, private Binance/Gate live-form acceptance, live migration inventory and actual funded order execution. Do not equate CI or HTTP health with those checks.

## Implementation
No new implementation or redeployment. Reused and verified the existing released implementation. Automatic v1 is a deterministic policy based on engine confidence/bias and rung geometry, not a demonstrated optimal-return allocation algorithm.

## Tests Executed
- Official CI evidence inspected (not rerun locally):77 allocation/policy/scope tests pass,0 failures;7 isolated PostgreSQL migration/cohort/concurrency checks pass.
- Inspected native admission test coverage for Binance/MEXC/Gate with synthetic ports, not private exchange execution.
- Fresh live-browser unsaved checks: independent selection, amount display, manual transition, sum error, auto waiting, Persian/mobile layout, Demo and MEXC controls PASS.
- Other six locales were present in source/browser test coverage; not changed or retested in the production member profile in this verification.

## Build Result
Official Production CI37826230059 successful for exact eeb04b7. Artifact preparation37828067443 and release37828748692 successful. No local build rerun.

## Git Status
Existing primary HANDOFF.md modification and untracked work preserved. No application staging/commit/push. The initial Windows SSH alias was unavailable and WSL was not installed; neither was configured or bypassed.

## Commit
Existing source eeb04b7ea76de4808ac204bb5842fde1675411aa.
- CI: https://github.com/signal0verse/signalverse-main/actions/runs/37826230059
- Preparation: https://github.com/signal0verse/signalverse-main/actions/runs/37828067443
- Release: https://github.com/signal0verse/signalverse-main/actions/runs/37828748692
- Retained artifact11572417257; release archive SHA256 f9ad043d2a7b2e6ce8991d397d220ed58b0848fcb898b00d8ada0e9f8817a47f.
This report alone is published to AI-Log master and read back before success is claimed.

## Remaining Issues
No duplicate deployment needed. Private live order acceptance and complete server identity checks remain outside the evidence collected here.

## Risks / Limitations
No production order, allocation-setting save, plan/account change, migration or service restart was used as a test. Account details observed incidentally in the UI are omitted from this report. Synthetic tests do not prove private-account execution or profitability.

## Recommended Next Step
Use the existing Spot forms. Keep old/manual setups and open allocations intact; any future private trading acceptance requires its own bounded scope.
