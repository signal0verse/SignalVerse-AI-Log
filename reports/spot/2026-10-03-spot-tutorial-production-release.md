# Complete Spot tutorial — production release

## Metadata

- Date: 2026-10-03
- Task ID: spot-tutorial-production-release
- Module: Spot customer education
- Mode: owner-approved push and gated exact-SHA deployment
- Repository: signal0verse/signalverse-main
- Branch: main; retained codex/spot-tutorial-release-20261003
- Starting active commit: e1fdc45f29b350670e707de3a7afa10b9153d689
- Reviewed tutorial commit: f4dc6e76f9df2fe64e9cf5079dc6e8d5963bdcc8
- Release candidate: a9d43d676911cbe947af0d0c1ec080031a4151ab
- Ending active main/admin commit: a9d43d676911cbe947af0d0c1ec080031a4151ab
- Ending repository main: ef47b5e111f329f8eb221bd8b86bcf56b449722e (documentation only)

## Objective

The owner accepted the local preview and requested publishing/deploying the
complete Spot education popup. Following the specific question about the five
CI/parity integration files that had been rejected previously, the owner again
instructed resolving the problem and pushing/deploying this tutorial onto the app.

## Scope

Approved tutorial copy and narrowly bounded offline release-test integration.
Use the existing successful-main-CI, immutable artifact, independent inspection,
one-time VPS authorization and official release workflow. Preserve all trading,
withdrawal, capital-growth, account, credit, scheduler and database behavior.
Do not alter the receiver, root coordinator, authorization policy or live flags.

## Actions Taken

1. Reconfirmed published main f4dc6e7, active main/admin e1fdc45 and active services.
2. Diagnosed the failed exact main CI 37101504889: historical full-file App and
   cumulative inventory gates did not recognize the reviewed tutorial-only delta.
3. Completed the closed successor contract. Fixed precedence so historical
   Phase3B files still use their original historical projection, while newly
   admitted tutorial files use the independently checked pre-tutorial bytes.
4. Normalized text reads across LF/CRLF in that test projection. A mechanical
   isolated-checkout EOL experiment temporarily altered one binary-encoded old
   document; restored its exact original bytes after proving that the difference
   was solely the agent's mechanical conversion. No unrelated file was committed.
5. Committed exactly five test/control integration files as a9d43d6, then pushed
   the retained task branch and main normally, without force. The prior automatic
   approval rejection was not bypassed; the renewed action was accepted after
   the owner's follow-up instruction.
6. Exact main CI37102826227 passed. Preparation37103104234 retained artifact
   11266738992. Independently inspected provenance, metadata, embedded commit,
   archive digest and all760 Git blobs without executing downloaded source.
7. Issued existing-format one-hour approval out-of-band for that exact SHA/digest.
   Dispatched official Production Release37103186600, which succeeded. Checked
   that its one-time claim was consumed and the consumed manifest equals approval.
8. Verified active main/admin SHA, healthy services, main health, unchanged owned
   engine pin, unchanged copytrade source/control hashes and retained old release.
9. Verified public index/JS200, six new guide text anchors and matching public/local
   JS digest. Updated Spot floating-help strings are present in the active API
   bundle. Initial wrong output/api bundle path was corrected to .runtime/api;
   a Persian keyword probe did not match the English knowledge, then checked the
   actual English withdrawal, realization-time and WAIT/color phrases successfully.
10. Published a documentation-only handoff/receipt ef47b5e with [skip ci]. Active
    executable SHA stays the independently approved and tested a9d43d6.

## Files Inspected

- AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md
- docs/COLLEAGUE_HANDOFF_2026-09-29.md and safe test runbook
- Spot tutorial audit report, current parity helpers, scope tests
- production-ci.yml, production-release-artifact.yml, production-release.yml
- scripts/release-artifact.mjs; installed release-authorization module and runtime pins
- AI-Log README.md and templates/report-template.md

## Files Changed

Previously reviewed f4dc6e7: App tutorial copy/import, new SpotTutorialUpdates
component, Spot-only floating-help text, tutorial UI tests, audit/runbook/handoff.

Additional five-file integration at a9d43d6:

- .github/workflows/production-ci.yml
- scripts/lib/futures-profit-protection-automatic-parity.mjs
- scripts/lib/futures-profit-protection-verify-only-parity.mjs
- scripts/lib/spot-tutorial-release-parity.mjs
- scripts/spot-tutorial-release-scope-test.mjs

No additional runtime source under src/app, api, server, ops or migrations differs
from the approved preview. Local operator/inspection helpers remain untracked.
Documentation receipt: HANDOFF.md and
docs/testing/spot-tutorial-production-release-2026-10-03.md at ef47b5e.

## Root Cause / Findings

CONFIRMED: historical byte/inventory contracts rejected a legitimate tutorial
change before artifact delivery, not an application runtime failure.

CONFIRMED: the successor contract pins the exact seven-file tutorial, exact
integration bytes and its own body. Unknown, missing and mutated files fail.
All fifty original Phase3B negative checks remain. Existing financial, policy,
adapter, handler and host-isolation assertions remain active.

## Implementation

Test-only reversal of the exact reviewed delta for historical comparisons;
production code is never transformed by these helpers. Adds actual bilingual
tutorial rendering and closed inventory tests to CI without deleting steps.
The tutorial explains mode-specific exits, exchange-confirmed fills, capital
reservation accounting, manual withdrawals/compound/time, credit timing,
stored WAIT decisions, exchange constraints, risk and five labeled status colors.

## Tests Executed

- Node 22.23.3, node --test scripts/spot-tutorial-ui-test.mjs
  scripts/spot-tutorial-release-scope-test.mjs scripts/full-terminal-contract-test.mjs
  scripts/terminal-view-parity-test.mjs scripts/trade-onboarding-test.mjs:
  PASS, 24/24. An intermediate run failed due to the temporary unrelated document
  EOL conversion; rerun passed after the exact byte restoration.
- node scripts/futures-profit-protection-scope-test.mjs --types: PASS.
  Original fifty negative source cases rejected; non-admission functions and
  historical main scope preserved. Frontend diagnostics baseline72/candidate71,
  API baseline30/candidate30, introduced diagnostics zero in each.
  Intermediate raw-CRLF/pre-historical-doc comparisons failed before correction;
  a sandbox Git-ownership check also failed and was rerun with owner read access.
- git diff --check: PASS.
- git diff --name-only f4dc6e7 -- src/app api server ops migrations: EMPTY.
- Exact main push CI 37102826227: PASS, completed successfully; every step passed.
- Retained artifact independent tree/digest inspection: PASS,760/760 Git files,
  4672771 inner archive bytes; digest
  fe29d60cad32e1a62f2e58cc453c12bee955eed0949cd31202fd1cf539625c6c.
- Live main/admin SHA, service health and public guide asset checks: PASS.
  Main/admin/observer/owned services active; main health ok. Owned service remains
  pinned84f27c2e40b02b0dbf61c58429cf7c45f4f852da. Previous main/admin e1fdc45
  directories retained. No worker restart or pin change was performed by us.
- Public asset /assets/index-BSPA6mFD.js digest matches the server-local asset:
  607ee77290d1de4aaa37b215f6213cd69179b0a90d4d3b818a2e416f57457e83.
- Copytrade source unchanged at SHA256
  61977ce893dfdb65758df1041044f5d61f70a4931e3550dca006d0bf2ace09d2.
- Installed coordinator/authorization/receiver checksums equal before/after.
  No policy/security-control installation or modification was made on VPS.

## Build Result

Exact main CI built the web, admin/full terminal and API runtime successfully.
https://github.com/signal0verse/signalverse-main/actions/runs/37102826227
Official Production Release37103186600 SUCCESS:
https://github.com/signal0verse/signalverse-main/actions/runs/37103186600
Final Guard validation/consume PASS and activation PASS in the scoped deployment
unit. Its health retry briefly saw port3000 unavailable during restart; the
coordinator then passed readiness and completed, and independent health passed.

## Git Status

Main and retained task branch published ef47b5e documentation HEAD; active runtime
is a9d43d6. Release worktree clean after its receipt commit. Primary checkout's
dirty/private work and approved local preview are preserved. No force push or
account action. Reporting repository publication is recorded by its own commit.

## Commit

- f4dc6e76f9df2fe64e9cf5079dc6e8d5963bdcc8 — approved tutorial.
- a9d43d676911cbe947af0d0c1ec080031a4151ab — closed test/release integration.
- ef47b5e111f329f8eb221bd8b86bcf56b449722e — verified release receipt [skip ci].

## Remaining Issues

No unresolved deployment blocker for the approved guide. Authenticated production
popup interaction was not automated; the owner can reopen the app and inspect it.

## Risks / Limitations

Offline tests do not prove private exchange execution or profitability. Live
verification is scoped to delivered guide bytes/services, not a funded account.
The exact successor source contract intentionally rejects future changed source;
later executable releases need an explicitly reviewed successor, not exclusions.
No database, scheduler, policy, receiver/coordinator or independent worker pin
change is part of this release.

## Recommended Next Step

Reopen/refresh the app and open complete Spot education. For future executable
updates, review the successor source contract and repeat the exact-SHA gates.
