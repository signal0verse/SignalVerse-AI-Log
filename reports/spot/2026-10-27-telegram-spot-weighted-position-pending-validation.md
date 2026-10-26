# Telegram Spot weighted position — source prepared, Docker stopped

## Metadata

- Date: 2026-10-27, Asia/Kuala_Lumpur.
- Module: Native Telegram Standard/scalp Spot, Demo and real.
- Repository: signal0verse/signalverse-main.
- Branch: codex/spot-position-weighted-exits-20261026, also published to main.
- Starting and active production commit: 623225675adaa102b05924d28a506514f772777d.
- Ending source commit: 27b410e57f24273ad8f5f03ffd705f8cc524020c.
- Delivery status: PENDING VALIDATION; no production release or Spot migration.

## Objective and Scope

The owner requested one weighted position across scenarios for all Telegram
assets, Demo/real and Standard/scalp. The latest instruction was to close Docker
because it slowed the computer. That instruction superseded the earlier
temporary restart approval. This report records the actual unfinished delivery
state; it does not claim the source candidate is active.

## Actions Taken

- Prepared a common remaining-quantity-weighted buy average and both saved
  scenario target means, cumulative first-half selling, remainder selling and
  partial/rounded fill handling. Real LIMIT exits use a durable pooled allocation
  journal; legacy MARKET receipts keep their execution family.
- Prepared shared Standard/scalp position/history display and the additive
  migration with immutable allocation, concurrency, owner/RLS and unknown-hold
  protections. Entry budgets, credit and existing risk policies stay unchanged.
- Restored the exact native Binance four-confirmed-rung continuation guard,
  independently of the owned engine's configured-rung selection. Added direct
  current factory tests for three/partial/zero/nonfinite/unconfirmed buys and
  unknown orders, including a stored zero-percentage boundary.
- Preserved previous assertions through exact predecessor compatibility, as
  explicitly approved by the owner, and kept direct new-code tests separate.
- Closed Docker Desktop using its normal stop command, exit0; verified no
  Desktop/backend/build process and no running Docker WSL distribution remained.
- Cancelled only this task's unassigned queued final CI, so it cannot consume
  another task's runner later. No new runner was registered for that final run.
- Read-only server verification confirmed the production pointer is still the
  earlier commit and the candidate Spot migration has not been installed.

## Files Inspected / Changed

Reviewed the common policy, native/owned controller/factories, actual-source
tests, additive migration, shared UI/history and existing release controls.
The complete candidate scope has44 paths. The final admission-preservation
commit changes only api/copytrade.ts, scripts/spot-position-factories-test.mjs
and its exact scripts/lib/spot-position-delta.json binding. The Docker stop
itself changed no repository source, image, volume, credential or global setting.
Generated outputs and unrelated/private work were preserved.

## Confirmed Findings / Implementation

The earlier exit bookkeeping was aggregate while trigger choice/display still
used individual scenario targets. The prepared policy uses the owner-selected
weighted saved references. Synthetic2@100 and3@80 yield average88 and targets
98/108; no private portfolio values are included here. Unknown execution or fee
evidence remains a hold. Native Binance retains its original four-rung gate.

Docker was stopped at the owner's request. No automatic restart, follow-up or
scheduled run was created. Final delivery remains unconfirmed.

## Tests Executed and Build Result

- node --test scripts/spot-position-factories-test.mjs
  scripts/spot-position-engine-test.mjs:23/23 PASS on the final code, including
  the actual native four-rung admission callback and existing controller cases.
- Earlier focused current-policy/MARKET/UI suite:69/69 PASS on its recorded
  predecessor candidate. Retained retry/current-controller suite:47/47 PASS on
  its recorded candidate. These results are not relabelled as full final CI.
- Corrected recursive scalp fixture dependencies:16/16 targeted checks PASS on
  that predecessor candidate. Original assertions were retained.
- Earlier actual PostgreSQL17 policy checks:56/56 PASS. Earlier private145-table
  and both SQLite cold restores and actual-layout migration rehearsal passed for
  their recorded candidate. The final commit has no fresh direct-target backup
  yet; earlier proof is not relabelled.
- Earlier builds and four compiler comparisons passed on their recorded source;
  baseline diagnostics remain. They do not replace the final exact-source CI.
- Initial official candidate CI40371555121 FAILED on a missing imported planner
  in a fixture, then the dependency was corrected. A local run had109 passes
  and3 source-signature failures after a concurrent local Git commit; it was
  preserved as invalid. Later candidate CI40376214671 attempt1 was interrupted
  by Docker shutdown; attempt2 was cancelled after the final native guard fix.
- Final exact-source [CI 40383281408](https://github.com/signal0verse/signalverse-main/actions/runs/40383281408) was queued and
  unassigned, then cancelled to respect the latest Docker-stop request. Final
  complete CI, retained artifact and production build/release are NOT PASSED.

## Git Status / Commit

Source 27b410e57f24273ad8f5f03ffd705f8cc524020c is committed and remotely verified on main and the feature
branch, without force push. Rollback refs preserve the earlier main/runtime.
Tracked work is committed; generated outputs remain. The active production SHA
is 623225675adaa102b05924d28a506514f772777d. No artifact approval or release was dispatched,
no candidate SQL was applied, and no operator analysis/job/order was forced.

## Remaining Issues / Risks and Limitations

The requested weighted-position behavior is not yet applied to the live bot.
Before activation it still needs complete original exact-source CI, a fresh
final-target backup/cold restore, immutable official artifact verification,
reviewed migration installation/verification, original one-use Guard delivery
and normal-cadence live execution/history verification. Keep unknown holds and
all original release controls. Earlier native signed GET observations retained
existing order identities; they are not evidence of final-candidate execution
or profitability. Private account IDs, balances/levels, keys, database exports
and test artifacts are not published.

## Recommended Next Step

Keep Docker closed as requested. Resume the remaining validation and deployment
only on the owner's instruction; do not silently restart Docker or bypass the
original CI/release controls to claim completion.
