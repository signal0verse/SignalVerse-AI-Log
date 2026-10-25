# Free Analysis allowance, personal counter and delegated settings

## Metadata

- Date: 2026-10-25
- Task ID: analysis-free-allowance-and-delegation
- Module: Native Telegram Analysis / administrator delegation
- Mode: Explicit owner request and verified gated live release
- Repository: signal0verse/signalverse-main
- Branch: codex/analysis-free-allowance-20261025
- Starting runtime: 62709669e73bfbcc98bbb8d31678fd180c9d9693
- Final source and verified runtime: 100480386067f89d7dd0a367d210852473736db5
- Runtime verification: 2026-10-25T15:15:32.027771+00:00
- Independent Paper source: 2da63dc5441928c5c325067869445e8732bde48c (unchanged)

## Objective

Add a selectable temporary-admin permission for the Analysis card and an admin-configurable genuinely FREE per-user allowance, default 10, when its VIP coin switch is OFF. The owner clarified renewal should follow the last use and requested used/remaining free counts. The implementation renews after 30 actual days from the latest successful free analysis. Failed/blocked work does not advance that deadline. Free ordinary-user slots do not debit monetary credit even when the separate VIP price is positive.

## Scope

Only the three Analysis settings, narrow delegation, native quota/settlement and own-usage display, additive schema, help and verification evidence. General UI work stays with the concurrent UI chat. No live grant, price, flag, user balance, forced analysis or order is set by validation. VIP pricing, the ON-mode lifetime Bitcoin trial, partner plans, other products, strategy and existing safety/timeframe policies retain their rules. Live release and publication coordination were owner-authorized.

## Actions Taken

1. Added the Analysis credit and access checkbox/resource. It exposes exactly the VIP coin flag, VIP per-use price and positive integer free count. Unknown/mixed fields and invalid/expired/revoked scopes cannot write. Existing settings/full grants keep authority; delegation management stays primary-only. No grant is automatically added.
2. Added the count field beneath the switch, effective default 10. Ordinary signed-in native users get free slots with the switch OFF; VIP/primary administrators have no count cap. Existing separate VIP monetary pricing still applies.
3. Added two private quota/request tables and seven namespaced functions. Per-user locking reserves capacity before provider work. One successful consolidated all-timeframe request counts once. Failed work releases its own pending slot; completion is idempotent and retries an uncertain acknowledgement without a second count/deadline shift.
4. Kept usage across devices, limit changes and switch changes. Renewal follows latest-success plus 30 days, never calendar month or first-use anchoring. Limit changes preserve prior use and admitted work. Only these new pending free-analysis leases expire; no existing financial or uncertain-order hold changes.
5. Added authenticated own-status and used/remaining/pending counts, local renewal time and a server-based monotonic countdown. Expiry fetches server state. Exhaustion keeps the page/assets/charts/history accessible; Run explains the cap and offers existing VIP navigation. Existing safety locks remain.
6. Revoked direct table/internal-function access, including explicit client default grants. Only four outer RPCs are executable by service_role; tables use RLS. Verified sessions supply identity. Own-status uses no-store and stale/session-crossing responses are discarded.
7. Completed exact-source CI, independent official artifact verification, fresh private backup/cold restore, exact additive SQL with fresh schema checks, one-use existing Guard authorization, official release, public/runtime checks and full deployed Git proof.

## Files Inspected

Repository entry/CLAUDE/handoff documents, complete strategy and safe runbook, actual auth/delegation/settings/Analysis/settlement/client source, PostgreSQL grants/default privileges and release controls. Production-credential legacy admin/credit tests were inspected and never executed.

## Files Changed

25 reviewed paths across the combined work:

- HANDOFF.md
- api/admin.ts
- api/analyze.ts
- api/public-info.ts
- docs/fixes/standalone-analysis-free-allowance.md
- docs/fixes/standalone-analysis-zero-credit.md
- docs/testing/stability-test-runbook.md
- migrations/standalone_analysis_allowance.sql
- scripts/analysis-admin-delegation-scope-test.mjs
- scripts/analysis-admin-delegation-test.mjs
- scripts/lib/analysis-admin-delegation-delta.json
- scripts/lib/analysis-admin-delegation-parity.mjs
- scripts/lib/standalone-analysis-access-parity.mjs
- scripts/lib/standalone-analysis-allowance-delta.json
- scripts/lib/standalone-analysis-allowance-parity.mjs
- scripts/partner-spot-limit-sql-test.mjs
- scripts/spot-setup-views-test.mjs
- scripts/standalone-analysis-allowance-scope-test.mjs
- scripts/standalone-analysis-allowance-sql-test.mjs
- scripts/standalone-analysis-allowance-test.mjs
- scripts/standalone-zero-credit-test.mjs
- src/app/App.tsx
- src/app/analysis-allowance.ts
- src/app/components/AnalysisAllowanceNotice.tsx
- src/app/components/AnalysisWorkspace.tsx

Release workflows, installed controls, copytrade source and strategy are unchanged.

## Root Cause / Findings

The card had no selectable child grant and depended on the primary-only full-settings loader/general save route. A periodic free allowance did not exist. Correct behavior requires server-authorized settings and durable serialized admission, rather than a local counter or monetary deduction.

Delegation-only c737703d was superseded before activation when the owner added quota; CI40184025611 was canceled, not accepted as a pass. First combined a5f36a29 CI40189645816 failed the unchanged differential TypeScript gate: the same pre-existing chart_from union mismatch printed long instead of plan after prepended imports changed traversal. Only two pure-module imports moved after the existing import block. No route behavior, cast, suppression, comparator, assertion or workflow changed. The failed candidate was never activated; its original receipts/backups are preserved. The final source received a new complete CI.

## Implementation

Quota and monetary credit are separate. A successful final consolidated result completes a bounded reservation once and sets latest-success plus 30 days. Failed/blocked attempts do not move it. Lowering the limit preserves previous usage and admitted work but blocks later admission. Missing/invalid stored limits use 10; saved values are positive safe integers up to 2147483647. Old usage is not guessed/backfilled. Existing users begin the new allowance when first eligible.

## Tests Executed

- Final actual-source behavior/SSR/UI/preservation suites: 93/93 PASS, repeated after the import correction.
- Disposable PostgreSQL17.11: 11/11 PASS, including 20 concurrent admissions, concurrent idempotent completion, last-success renewal, failures/releases/expiry, limit changes, identity isolation, RLS/direct permissions/client default grants and idempotent DDL rerun. No production database used for these tests. SQL unchanged by the import fix.
- Both mandatory comparison blocks prechecked on disposable Linux with official-vendor/checksum-verified Node22.23.4: Spot frontend68 to64/API34 to34; Profit frontend72 to64/API30 to30; all zero introduced diagnostics. Existing diagnostics remain; this is not a clean full-tsc claim.
- Windows compiler rows also showed zero introduced frontend/API diagnostics. Its optional slow parent-negative phase was stopped after those comparisons; it is not claimed as whole-script success. The unchanged complete checks ran in final CI.
- Direct unprojected audit: 500 existing functions exact outside the explicit changed handlers/integrations; copytrade unchanged.
- Web/Admin production builds and affected API bundles PASS. Existing large-bundle warning remains. Actual counter component/production CSS visually checked at narrow mobile widths without account data or API calls.
- Setup-only errors involving embedded Node PATH, private receipt paths, inert fixture dependencies and temporary npm ownership/cache were corrected before successful isolated runs. They caused no production writes.
- Final full exact-main CI: [40196168994](https://github.com/signal0verse/signalverse-main/actions/runs/40196168994), SUCCESS, attempt 1. No canceled/failed predecessor substitutes for this gate.
- Whitespace and clean-source checks PASS.

## Build Result

Official exact-source CI and release builds SUCCESS. Immutable preparation run 40204978894, artifact 12603058049 independently matched all Git blobs/modes, directories, PAX source comment, metadata and ZIP/inner digests. No repack or archived-code execution during independent verification.

- Archive SHA256: 876dcf29eeac69eb7ed18f4d2fa8dd2b8bbe394f163057bf52d634328d65b1fd
- Git blobs verified in artifact and deployed source: 2509
- Official release: [40205533960](https://github.com/signal0verse/signalverse-main/actions/runs/40205533960), SUCCESS.

## Release Verification

Fresh private consistent backup/cold restore finished 2026-10-25T13:24:59.222702+00:00, pinned to source62709669 and this exact final target. All139 relation counts and the complete owner/ACL/index/function/trigger catalog matched, including six CHECK parser-format semantic roundtrips. Two SQLite backups passed cold integrity and compressed roundtrip checks. Temporary restore cluster removed. Earlier receipts retain their original source/target identities.

The exact reviewed additive migration applied transactionally only after full CI/artifact/backup proof. SQL SHA256 81a2475bae3223817792e0118aaeec0957b73f50721efbddcb4ce5ca411c3583. All seven live function bodies/arguments/SECURITY DEFINER/GUC/ACL states and two table RLS/ACL states were verified, then rechecked immediately before authorization and after activation. Unexpected grantees/service grant options are rejected. Validation made no actual-user RPC/grant/forced analysis.

The existing Guard consumed a one-use authorization for this exact source/archive. Main/admin/owned process directories match 100480386067f89d7dd0a367d210852473736db5. Independent Paper source/process pin remains unchanged. Six services are active; all22 control fingerprints are unchanged. Rollback pointers remain valid. Three shared-terminal manifests, public HTML/assets/logo and new scope/free-limit/status/counter bundle strings match the active release. Public setting type/range is valid; anonymous status POST returns401/no-store without user data. Every tracked deployed Git blob/executable bit matches the source.

## Git Status

Main and feature published by fast-forward; codex/rollback-analysis-allowance-20261025 preserves actual runtime predecessor62709669. Source and runtime verified separately. Worktree clean; unrelated/private and concurrent UI work retained. No force push or installed control/workflow change.

## Commit

100480386067f89d7dd0a367d210852473736db5

## Remaining Issues

No release gate remains for this scope. Selecting an actual temporary recipient and changing the VIP switch/count remain administrator actions; this implementation does not choose recipients or flip live settings. Reopen the mini-app for the new bundle.

## Risks / Limitations

No actual delegated user was granted/exercised and no user analysis/balance adjustment/order was forced by validation. Actual-source tests and disposable SQL do not establish private-account execution or profitability. VIP removes the count cap; existing separate VIP monetary price still applies. Other products, partner plans and safety/timeframe rules retain their behavior. Pre-existing TypeScript diagnostics remain; strict differential gates pass without newly introduced diagnostics.

## Recommended Next Step

Select Analysis credit and access for the intended temporary delegate/duration. With the Analysis VIP coin switch OFF, default10 free slots are available and configurable; ordinary users see their own used/remaining credits and renewal/wait time. VIP count is unlimited through the existing purchase flow.
