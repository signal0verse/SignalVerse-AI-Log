# Native real Spot Delete availability and retained history — verified deployment

## Metadata

- Date: 2026-10-28 (Asia/Kuala_Lumpur; technical evidence times below are UTC)
- Task ID: native-spot-manual-delete-20261028
- Module: Spot / native Telegram UI
- Mode: Real Spot UI correction; read-only case verification; owner-authorized deployment
- Repository: signal0verse/signalverse-main
- Branch: codex/spot-manual-delete-20261028
- Starting commit: 2bded5497bfb23417447857abcd6c510e170e38b
- Ending commit: 73e93267b4b44bdc240b1d0d3ba0bd225fdfbd5d (documentation only)
- Active executable: dc44dd763badf80a563b4226b6c1f4266d63cf4a

## Objective

Keep confirmed Delete available for native real Spot, remove stopped/deleted setups from the main list, and preserve each user's original purchases, sales, accounting and history. Verify the affected case after installation.

## Scope

Five product files: App, the new deletion presentation helper, two Scalp views, and floating-help text. Existing Stop/confirmation, backend order handling, strategy, funding, credit, mode and reservation policies remain unchanged. No operator trade, new setup, paid analysis, forced job or live financial repair was executed for this correction.

## Actions Taken

1. Confirmed that a deleted parent with no remaining pending buys permanently disabled the trash control while its management card remained visible.
2. Made native real Delete unavailable only during a request; introduced primary/deleted views with scoped state and retained full snapshots.
3. Kept the original confirmation and POST. Only an acknowledged stop updates the matching local snapshot; failures, cancellation and account changes cannot falsely hide the next account's data.
4. Fixed the original VM harness dependencies and added an actual native/legacy overview-action regression. Original assertion bodies remain unchanged.
5. Completed the original CI, immutable artifact verification, backup/coldrestore and guarded release. Independently checked installed source, public assets, services, the original scoped stored facts and temporary-runner cleanup.
6. Published the verified handoff and runbook notes as a separate documentation-only commit with skip ci. Rechecked that runtime still uses the executable commit above.

## Files Inspected

AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md, the full TRADING_STRATEGY.md and safe test runbook; the five product files below; manual-delete, setup-reliability, external-exit, cron-batch and release-history test/parity files; the original CI, artifact and release workflows; deployment diagnostics and narrowly scoped read-only case evidence. Private evidence stayed on its original host.

## Files Changed

- Product: src/app/App.tsx; src/app/SpotSetupDeletion.tsx; src/app/SpotScalpOverview.tsx; src/app/SpotScalpWorkspace.tsx; api/analyze.ts (help text only).
- Tests/bindings: scripts/spot-manual-delete-ui-test.mjs; scripts/spot-manual-delete-scope-test.mjs; scripts/spot-setup-reliability-ui-test.mjs; scripts/spot-setup-views-test.mjs; scripts/spot-cron-read-batches-test.mjs; scripts/lib/spot-manual-delete-parity.mjs; scripts/lib/spot-manual-delete-delta.json; scripts/lib/spot-cron-read-batches-parity.mjs; scripts/lib/spot-external-exit-parity.mjs.
- Documentation: HANDOFF.md; docs/AI_HANDOFF.md; docs/fixes/spot-manual-delete-2026-10-28.md; docs/testing/stability-test-runbook.md; docs/history/contributor-handoffs-through-2026-10-28T0518.json.xz.

## Root Cause / Findings

CONFIRMED: The old disabled condition combined the deleted-parent flag with pending-buy status. That prevented a second deliberate Delete while retaining an exit-management card in the main list.

CONFIRMED: Post-install read-only verification at 11:48 UTC preserved the original case's parents/settings, journal financial fields and prior buy/sell facts. Actual installed pure UI functions excluded the old stopped IDs from the primary view, retained deleted/history access and returned an enabled native Delete when no request was busy. Public JavaScript contained the new deletion UI.

UNCONFIRMED / NOT CLAIMED: Financial settlement, a released symbol reservation, profitability, or a private-account browser click. Existing protection and genuine reconciliation remain authoritative.

## Implementation

Native real mode alone selects the new behavior. Full setup/archive data continues to feed history, accounting and reservations; presentation filters only the visible list. Partner/demo behavior remains intact. Controls include seven locales, readable direction, counts and selected-state accessibility. No fill, quantity, price, fee or historical record is fabricated or erased.

Earlier handoffs were preserved byte-for-byte in a lossless archive to fit the unchanged producer limit. The full strategy and safe test runbook remain directly readable. No original workflow, cache, 180-minute CI limit or 8 MiB producer limit was relaxed.

## Tests Executed

- `node --test scripts/spot-manual-delete-ui-test.mjs scripts/spot-manual-delete-scope-test.mjs scripts/spot-setup-reliability-ui-test.mjs`: PASS, 35 targeted UI/scope/original-harness cases.
- `node --test --test-concurrency=1 scripts/spot-manual-delete-ui-test.mjs scripts/spot-manual-delete-scope-test.mjs scripts/spot-cron-read-batches-test.mjs scripts/spot-external-exit-proof-scope-test.mjs scripts/spot-external-exit-scope-test.mjs scripts/spot-release-history-scope-test.mjs`: PASS on frozen source, 35 cases (15 UI, 2 current scope, 18 prior source cases). The first local attempt hit its 1,200-second operator timeout; its log remains retained. A duplicate full local UI run was interrupted and was never counted as green.
- `node type-block-only.mjs spot --types` and `node type-block-only.mjs profit --types` executed the original two type-gate blocks in a private Node 22 workspace: PASS, four comparisons with zero introduced diagnostics. Actual 314 compiler/configuration/lock/gate inputs matched the target. Existing baseline diagnostics remain; this is not a globally clean typecheck claim.
- [Original production CI](https://github.com/signal0verse/signalverse-main/actions/runs/40665428791): PASS, 79/79 steps. Independent completed-log verification of `node --test scripts/spot-setup-views-test.mjs scripts/spot-setup-views-scope-test.mjs`: 1,251/1,251 pass, zero fail/skip/cancel. These suites overlap; counts must not be added together.
- `run_server.py backup.py backup.log`, full backup and private coldrestore: PASS, 145 relations/catalog/counts and both SQLite stores. The already installed, unchanged schema was rehearsed only in the private copy; original application financial rows remained exact. No live migration, data reset or financial RPC occurred.
- [Artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/40681582327): PASS, 10/10. Independently verified every one of 2,613 Git blobs and modes, metadata, embedded commit and digest. No repackaging or archived-code execution by the verifier.
- [Guarded release](https://github.com/signal0verse/signalverse-main/actions/runs/40682109694): PASS, 11/11, exact digest-bound original one-use approval consumed.
- `verify_installed_source.py`, `post_release_verify.py`, `verify_scoped_deletion_view.py post`, `read_existing_schema.py post 12813246129` and `verify_own_cleanup.py`: PASS. Six services active; 22 control fingerprints, 17 job gates and the independent Paper pin unchanged. All three own ephemeral runners/containers removed; others untouched; Windows Docker unused.
- `node --test --test-concurrency=1 scripts/spot-manual-delete-scope-test.mjs`, documentation follow-up: PASS, 2 current/historical binding cases, original assertions and all archived history bytes preserved. All other Git blobs/modes equal the active source. Original producer diagnostics remain below the unchanged cap.

Failures retained honestly: candidate b893adcc had two locale TDZ diagnostics before withdrawal; controls now initialize after locale. C8 source reached main but [CI 40647174793](https://github.com/signal0verse/signalverse-main/actions/runs/40647174793) failed three missing VM-dependency cases (two mode-flag references and the actual disabled helper). Neither candidate was independently deployed. The later executable includes the actual dependency bindings and a separate native action regression; fresh CI succeeded.

## Build Result

PASS: empty-environment web/admin and 14 API handler builds, followed by the original official builds and verified production delivery. Existing large-bundle warnings and baseline TypeScript diagnostics were not misreported as eliminated.

Retained archive: 8,388,227 bytes; SHA-256 `450a6d05234b482d70610a2fe1eb222cbb1dcab5191c76f9494e5a366718a330`. Documentation-only producer diagnostic: 8,387,703 bytes, below the same 8 MiB cap.

## Git Status

Main and the task branch were normally fast-forward published, without force. Original rollback reference retained. Documentation HEAD is separate from the active executable; runtime was rechecked after documentation publication. Unrelated pre-existing untracked output was preserved. No pull request was created.

## Commit

- Executable/runtime: dc44dd763badf80a563b4226b6c1f4266d63cf4a
- Documentation HEAD: 73e93267b4b44bdc240b1d0d3ba0bd225fdfbd5d

## Remaining Issues

No remaining implementation or deployment work for the requested native Delete UI and historical-record retention. Closure of held/uncertain financial exposure and new-entry reservation release are separate facts and were not forced or claimed.

## Risks / Limitations

Acceptance combines exact installed source/public bundle verification with scoped read-only stored facts and actual pure UI functions. No private-account click, new order or paid analysis was used as a test. A previously open Mini App may retain its old JavaScript until normally reopened. No account identifiers, private values, raw venue responses, credentials or database exports are included here.

## Recommended Next Step

Normally close and reopen the Mini App to load the new UI; use Deleted setups/history for retained records.
