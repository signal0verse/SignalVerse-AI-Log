# Native Telegram MEXC Spot LIMIT parity — production release

## Metadata

- Date: 2026-10-26 UTC
- Module: Native Telegram ordinary/classic Spot; official @SignalVerse_AI_bot
- Repository: signal0verse/signalverse-main
- Branch: codex/native-mexc-spot-limit-20261026
- Published source base: 7f05ead31b9d4b9e381e8b22c74202ee9ef85614
- Previous active runtime: 55ad6648e8b730bc535ba37d86c54daa8b9245b6
- Final executable and verified active runtime: 2995922a2a4ab264f1356a93de0c39c6ba6ef0fb
- Later documentation-only repository HEAD: a64ce64690e5f9d6ec357479e3195135fcf387fd ([skip ci]); executable, tests and workflows unchanged
- Mode: Explicit owner-approved source publication and official production release

## Objective and finding

Native Telegram MEXC ready/blue scenarios previously used the legacy MARKET-after-price-trigger path. Native Binance used journaled exchange-native resting LIMIT buys. Existing owned/partner MEXC LIMIT support did not cover native Telegram. The owner requested equivalent native MEXC buy-order registration and application to the official bot.

## Changes

Reuse the existing unchanged LIMIT engine and MEXC venue adapter for eligible native real ordinary/classic Spot. Both scenario-creation paths deploy accepted ladder orders immediately; normal scheduler reconciliation can safely adopt an old empty/prepaid scenario. Preserve accepted prices, allocations, Formula B, capacity/access/risk checks and native scenario-open credit charging. No second first-fill charge is introduced.

Partition execution families durably. Existing MARKET fills, sells or any legacy claim remain on their original execution path; mixed-family records remain held and cannot suppress another cycle's reconciliation. Never blindly adopt or resubmit uncertain orders. Stop cancels remaining buys through the existing engine while fills and exit protection continue to be observed. New LIMIT campaigns use the existing LIMIT exit implementation; old MARKET campaigns retain their original exit family.

Read the actual owner/mode order journal and reuse truthful resting, partially filled, blocked or unknown UI states. Preserve Binance, owned customers, Demo and independent technical Scalp behavior. Update floating help, handoff, strategy history, fix report and safe test map. No schema migration, account activation, grant, balance, credit-price, accepted-level, risk-control or scheduler-setting change.

## Files changed

Nineteen paths: api/copytrade.ts; three native MEXC test files; native successor parity helper and exact reversible manifest; the existing latest Analysis release-parity entry and Spot setup test entry; four existing inert extraction fixtures for technical edit, Spot setup reads, allocation admission and scenario continuation; the existing native UI status function; floating help; HANDOFF.md, TRADING_STRATEGY.md, docs/AI_HANDOFF.md, the dated fix document and stability runbook. The established engine, adapter, SQL, workflows and release controls remain unchanged.

## Checks and retained failures

- Final focused behavior/UI/read/scope: 34/34 PASS; final integration across every related native caller and preserved legacy fixture: 201/201 PASS after the final cache-call correction. Earlier integrated 130 cases passed before the final per-cycle isolation improvement; that historical run is not relabeled as the final run.
- Web/Admin build passed; existing large-chunk warning remains. Final API bundle build for Node22 passed.
- Four unchanged official Linux compiler comparison blocks on checksum/vendor-verified Node22.23.4: zero introduced diagnostics. The final test-only correction preserves every compiler input/configuration/lock byte; the exact final CI reruns these original comparisons. Existing baseline diagnostics remain; globally clean TypeScript is not claimed.
- Initial test harness/module/fixture and private metadata-preparation errors were corrected before publication. An initial Node22 harness had literal-newline encoding and failed before compiler comparisons. The next check caught a genuine new cache-type mismatch; the wrapper now uses its own optional cache, 33 tests passed again, and all four original comparisons passed. Preserve failed receipts and do not weaken the comparators.
- Docker Desktop initially failed on stale zero-byte Windows AF_UNIX endpoints. The existing runtime was recovered by preserving only verified temporary socket parents and starting the existing app hidden. No reset, VHD/image/data deletion, security-setting change or reboot. Task containers use reviewed image identity, no host mounts/ports/devices, limited CPU/memory and denied private-network egress.
- Source archive size rehearsal: 8304134 bytes, below the unchanged 8 MiB limit. This operator rehearsal was never uploaded or executed as a production artifact.
- Fresh consistent private PostgreSQL backup and isolated disk-backed cold restore: all 145 relation counts, full catalog/RLS/owners/ACL/indexes/functions/triggers, six exact CHECK parser roundtrips and two faithful redundant existing-owner ACL representations PASS. Both SQLite snapshots passed cold integrity and compressed-byte roundtrips. Temporary cluster removed. No production DDL/DML.
- A second fresh full backup and cold restore is directly pinned to the final source, with original backup/restore checks unchanged. Earlier backup snapshots, successful bindings and failed CI receipts remain preserved under their original identities; no earlier proof is relabeled.
- First official CI40281599151 at2315 failed before dependency installation because the new parity helper eagerly imported TypeScript. The corrected candidate keeps complete file/history/control checks dependency-free and moves every original AST assertion verbatim to the unchanged post-install test entry. No original assertion or workflow gate was removed. A local overlap attempt correctly rejected a changed HEAD; the fixed-source rerun and final CI retain that protection. Earlier failure evidence remains separate.
- Second official CI40283483198 atf194 passed the preceding gates and141/142 cases in the technical/scalp step; its synthetic legacy edit fixture lacked the new native helper. Three existing inert extraction fixtures now receive the actual helper/context they require. Original allocation assertions still run against the exact checked predecessor, and seven additional current-source admission cases verify all mode/venue combinations and the next real MEXC scenario. Every original assertion is retained; no runtime policy or workflow changed. Final combined115/115 passed before publication, and the entire final CI reruns all steps.
- Third official CI40285780737 at7f05 passed the repaired technical/scalp step and stopped at another old continuation extraction fixture missing the same helper. All related actual-call fixtures were then reviewed together; the complete201-case native caller group passed. Additional final-source isolated Linux rehearsals passed: large Spot setup/Analysis UI1004/1004, owned LIMIT91/91 and original Binance69/69 custom plus43/43 TAP cases. Groups overlap and are not summed. No original assertion, workflow, runtime source or policy was changed for these fixture repairs.
- Exact final-main official CI: [40290433126](https://github.com/signal0verse/signalverse-main/actions/runs/40290433126) — SUCCESS; all79 steps passed, zero skipped.
- Official immutable artifact preparation: [40300976872](https://github.com/signal0verse/signalverse-main/actions/runs/40300976872) — SUCCESS. Independently verified every Git blob, executable mode, directory, PAX commit, metadata, ZIP digest and inner archive digest; no operator repacking/upload or archived-code execution.
- Official release: [40301795916](https://github.com/signal0verse/signalverse-main/actions/runs/40301795916) — SUCCESS using exact SHA/digest and independent one-use root approval. Approval consumed, rollback predecessor pointers verified.
- Actual process source/public HTML and assets, all six services and three shared manifests PASS. Every one of the 2552 main-release Git blobs and executable modes matched. The isolated admin runtime matched the unchanged coordinator's exact projection: all nine source files, all copied build entries, layout, owners and modes. The first verifier incorrectly expected the full repository in that intentionally isolated runtime; the original failure is retained. A second read-only verifier checked the real install contract against the reviewed and unchanged installed coordinator, without changing deployed files. All22 control fingerprints, independent Paper pin/PID and all17 existing job gates preserved. Existing advisory schema/function privileges/RLS/triggers reverified read-only, never reapplied.
- Exact task JIT runners, containers and task network removed after completion; diagnostics retained. Unrelated resources preserved.

## Actual execution observation

No exchange-confirmed new LIMIT BUY was observed in the scoped post-release check. There were no new app-created order identities to query, so no signed order GET was made. Read-only inspection found that, while CI was running before activation, the old executor had created a legacy attempt claim. The venue rejected its malformed client-order identifier, and the claim remains in the legacy execution family. That pre-existing campaign is not automatically converted by this release. No claim was cleared, scenario replaced, or retry forced. Runtime delivery and offline tests do not prove execution of that campaign; actual new LIMIT submission remains unverified.

Observation used the owner's narrowly scoped existing account/cycle and normal scheduler cadence. No operator POST/DELETE exchange request, forced cron/scan/analysis, test order, level edit, account activation, hold clearing, credit adjustment or fabricated fill. Private account identifiers, amounts, order identities, credentials, backups and logs are excluded from this public report.

## Risks and limitations

Only ordinary/classic native Telegram MEXC Spot is extended. Independent technical Scalp retains its separate immutable campaign/batch execution policy. Actual submissions still require valid connected credentials, venue permissions/rules, current native admission and available funds. Blue/ready indicates an accepted scenario; order confirmation comes from the exchange journal and actual exchange status. A marketable LIMIT may fill immediately. Legacy uncertain/market campaigns are preserved, never converted to manufacture proof. No profitability claim.

The immediate predecessor uses the legacy native MEXC MARKET executor. After new native LIMIT journals exist, do not blindly restart that executor: retain every real order and durable hold, and use a LIMIT-compatible forward repair or an owner-approved, fully reconciled recovery. Preserved rollback refs, pointers and cold backups alone do not prove that reverting trading execution is safe.

## Publication state and next step

Executable source and actual official runtime were verified at the final commit above. Preserve rollback refs and existing historical data. The owner can reopen the mini-app to load the updated status wording. Use the unchanged official release process for future changes.
