# Three unchanged historical assertions and native/admin chart audit

Recorded: 2026-11-04T05:16:58.409078+00:00

**Official candidate CI: IN_PROGRESS_NOT_ACCEPTANCE. Deployment: NO.**

## Scope and chart finding

Owner authorized investigating the native/admin chart discrepancy first, then fixing the three remaining original tests without deletion, expected-result changes or weaker gates, and rerunning official CI. No deployment is authorized.
The read-only browser/source audit was completed and published before implementation: [native versus admin chart evidence](https://github.com/signal0verse/SignalVerse-AI-Log/blob/a9fba8025ccf2dd9c59568062d307ef8d260a1c8/reports/general/2026-11-04-native-analysis-versus-admin-chart-read-only.md). Admin SVG measured903x481px outside the native host. The live native host icon rule constrains SVG to20x20px; the existing candidate inline-dimension fix is pending deployment. Native authenticated saved history and fresh admin reports are different inputs; this audit does not claim a same-report live comparison. No Analyze/Publish/trading control was clicked. No new app/UI/engine change was made in this repair.

## Exact fixes and preserved assertions

Prior official run41673654138 failed1295-case gate with three failed assertions. The same three failed in a fresh local pre-repair reproduction. Both Spot consumers reached cronDocumentarySource before the complete CI-successor projection, so their actual current workflow did not match their original frozen expectation. That one shared documentary reader now sends only exact production-ci bytes through beforeCiScope before older readers. Full current-source verification is mandatory; corrupt/unknown bytes remain raw; Buffer/string identity is preserved.
projectNativeUx and nativeUxDocumentaryTree each now enter the existing checked-source operation when invoked without one. Both original validation bodies execute unchanged under the complete entry/exit source witness. This removes duplicate outer validation work while preserving source checks and the original predecessor4/current2 scan assertions. No cache/witness implementation or policy changed.
The three originally failed test files are byte-identical to a31d803d. No assertion, expected workflow, numeric expectation, test registration or original gate was removed/changed. Three added regressions cover the actual readers, corrupt strings/Buffers, repeated complete witnesses, warm corruption/retry, forged trees and original test/cache-byte identity.

## Exact source and lossless capacity

- Candidate: `ec141d55230e29c052ed017a6b8d17bd20ed4137`.
- Branch: `codex/ci-module-routing-20261103`.
- Main before/after: `eacedbb2801c303482b201320968983fce9d93bf` / `eacedbb2801c303482b201320968983fce9d93bf`.
- Three normal successor commits, no rebase/amend/force/history rewrite:
  - `3f103d902784e82c96bc11083eaf2743d53ab782`
  - `cab835627619840bfa83e3f9928f547a6fbf5b67`
  - `ec141d55230e29c052ed017a6b8d17bd20ed4137`
- The full repaired proof/test bodies remain verbatim at3f103d90. Existing canonical loaders verify full fixed-SHA source digests, exports and syntax-only URL remaps; every assertion executes against current source. The full manifest remains atcab83562. No result is cached as a pass.
- Original exact-commit packageCommit: 8,386,607 <= 8,388,608 bytes; 2,001 bytes headroom. Embedded SHA matches. All2740 tracked paths are present; no source/test/report exclusion. Bytes were discarded, no official/retained artifact was created. The unchanged8MiB cap still requires revalidation for any future SHA.

Task-created changed paths:
- `HANDOFF.md`
- `docs/testing/ci-module-routing-2026-11-03.md`
- `scripts/ci-module-scope-test.mjs`
- `scripts/lib/analysis-native-ux-parity.mjs`
- `scripts/lib/ci-module-delta.json`
- `scripts/lib/ci-module-scope.mjs`
- `scripts/lib/spot-cron-read-batches-parity.mjs`

## Fresh local validation

- Frozen final source:83/83 test executions passed,0 failed/cancelled/skipped. This command includes an explicit storage-test entrypoint also imported by checked-Git tests; those11 storage cases execute twice in separate Node processes, not22 distinct tests.
- Separately:8/8 original cache/witness cases and3/3 originally failed assertions passed on the frozen final source. Original view/tree logs show predecessor4/current2 for both operations.
- Seven exact-commit CLI fixtures passed: full plan/success audit plus rejection of failed,cancelled,skipped,missing mandatory gates,tampered plans and wrong checkout SHA. These are synthetic CLI checks, not official acceptance.
- Web and Admin builds passed; usual Vite large-chunk warning remains. All14 API bundles passed. LocalNode24 is separate from officialNode22/Linux. No TypeScript/application source was changed; official compiler comparisons remain mandatory.

## Official CI

- [Run41778098336](https://github.com/signal0verse/signalverse-main/actions/runs/41778098336)
- Exact SHA `ec141d55230e29c052ed017a6b8d17bd20ed4137`, candidate branch, workflow_dispatch, attempt1; this is not main/push release acceptance.
- Unchanged workflow:90 YAML steps/94 actual auto-post steps,75 original command groups/87 fragments, full selection, original compiler/build/SQL checks and final always-audit. No source or gate change after the final SHA was frozen.
- Existing one-job isolated factory:2CPU/4GiB/180minutes, no mounts/ports, host root unmapped, private/Production egress blocked. Only ci-a511237 belongs to this task.

CI is running; no complete pass, compiler result or runner cleanup is claimed. The final result will be verified from authoritative run/job/step logs and published separately. No duplicate runner/run/rerun is authorized.

## Safety and remaining limits

No task-created diff in src/api/server/admin,migrations,ops/deploy,Strategy,package files,release artifact producer or release/Guard workflow. The CI workflow is byte-identical to a31d803d. Native/Telegram chart improvements remain pending a separately authorized release.
No Production runtime/database/backup/profile/scanner/job/PP flag operation, worker start/enable, private exchange call, order/position/Entry/SL/TP/close action or Telegram post occurred. Only read-only public browser inspection and the isolated CI factory were used. Previously known Production runtime c1619552 and TRUE/TRUE PP flags were not queried or changed; no current-runtime/profitability claim is made.

```text
MAIN_PUSH=NO
DEPLOYMENT=NO
ARTIFACT_CREATED=NO
GUARD_CREATED=NO
PRODUCTION_MUTATION=NO
WORKER_STARTED=NO
PP_FLAGS_CHANGED=NO
DATABASE_MUTATION=NO
EXCHANGE_ACTIONS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_CHANGES=0
TP_CHANGES=0
CLOSE_ACTIONS=0
```
