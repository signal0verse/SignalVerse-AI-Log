# Real Spot scalp workspace and Settings placement — 2026-10-14

Status: DEPLOYED_AND_VERIFIED_ON_BOTH_SITES

The owner requested removing the duplicate exchange-account selector from the
top of Real scalp and moving the existing setup-capital/exchange-balance panel
into Settings directly below Scanning method and entry rules. The existing
selected-account callback and funding summary/refresh are reused. The funding
reader, confirmation dialog and execution guard remain unchanged.

Real without a selected/ready account now displays the actual scalp workspace,
all navigation pages and a Settings entry point. Empty real lists/chart/history
and unavailable accounting are explicit. There are no substitute demo rows or
fabricated balances/profit, implicit account selection, profile enable or order
submission. The presentation page is retained during account loading/reselection.
Settings and Education remain accessible during scanner loading/unavailability.
Native technical scalp funding uses the same placement; classic Spot and Futures
retain their original selector and funding placement. Demo/Real and the two
independent scalp projects retain their existing data/profile isolation.

Nine exact files changed from deployed `789cacdca579de1c10d14b8dbf3599bf6f9b0198` to `7c7e1c9ada3fc16ce541bea2020754de2f70298a`: four presentation
files, append-only handoff/runbook documentation, the exact reviewed inventory,
and the floating help description. Only the help literal changed in the API.
Trading source, database migrations, workers, dependencies, workflows and
protected financial/execution policies remain unchanged.

Verification:91 source/authority checks pass; API/frontend compiler comparison
introduces zero diagnostics; the complete shared terminal build succeeds.
Actual-component desktop and390px mobile checks pass in all7 supported languages,
with no horizontal overflow, correct funding order and44px navigation targets.
English digits and Gregorian dates are retained. Local fixtures are synthetic.
The deployed real account-unselected workspace and live Settings placement were
checked through presentation/read-only navigation. No profile save, scanner
enable, forced tick, private order or profitability test was performed.

Full exact main CI [38510454136](https://github.com/signal0verse/signalverse-main/actions/runs/38510454136)
passed all79 steps. Official immutable artifact preparation
[38516699577](https://github.com/signal0verse/signalverse-main/actions/runs/38516699577)
passed; every Git blob and mode matched the exact source without repackaging.
Archive SHA-256: `a2e8ee2792d9b8446bb4b40b30e3ffc410fcb40f2d4f7565991cdfa2f6ace870`.

Private PostgreSQL and SQLite backups and cold restores passed. Independent
server comparison of the retained old/new source archives proved the exact9-file
presentation scope. No production migration was performed. A fresh one-use
root approval bound the exact source/archive. Official OIDC release
[38517843690](https://github.com/signal0verse/signalverse-main/actions/runs/38517843690)
passed. The compatible Paper engine remains at05dc525 with source provenance and
SQLite integrity verified. Existing PHP adapters remain unchanged.

The first approval-helper attempt stopped before issuing approval because its
CI ID still referred to the preceding release. Only that exact staging-helper
line was corrected to the actual successful79-step CI ID; prior failure evidence
is retained. Root Guard, immutable artifact and production data were unchanged.
The subsequent independent approval passed all original checks.

Both https://signal.easybitpay.com and https://cross-verse.net expose the exact
new shared source and identical terminal assets. Core, Partner copytrade and
Admin services use the new release. Protected configuration and the retained
Paper runtime were checked. Temporary CI runners were cleaned after their jobs.
Rollback releases and private backup proof are retained. There is no new paid
Actions/billing setting or protected production configuration change.
