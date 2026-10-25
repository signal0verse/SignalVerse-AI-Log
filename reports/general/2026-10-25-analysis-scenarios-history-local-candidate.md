# Analysis scenarios, saved history and explanations — local review candidate

## Metadata

- Date: 2026-10-25T18:32:36.751920+08:00, Asia/Kuala_Lumpur.
- Task ID: analysis-scenarios-history-20261025.
- Repository: signal0verse/signalverse-main.
- Branch: codex/analysis-scenarios-history-20261025.
- Exact local feature commit: `5d2d36ba7f5dc734f4feefa3883a05c45391e116`.
- Source base: `62709669e73bfbcc98bbb8d31678fd180c9d9693`.
- Result: LOCAL REVIEW READY. No feature/main push or production deployment.
- Local compiled sample preview: http://127.0.0.1:4320/previews/analysis-scenarios.html

## Objective and Scope

The owner requested four scenarios with four automatic entry allocations, fully
shown on the Analysis cards/chart, retained per-user reports and history, and
automatic reviews. The owner clarified that completed entries must remain fixed,
only unentered points should be reviewed against daily market conditions, and
all16 legs should be visible upfront as conditional previews requiring fresh
future engine confirmation. A follow-up requested an Analysis details popup on
each scenario. The new behavior is presented locally for review before release.

This is an advisory-only native Analysis lane. Existing real Copy Trade/Futures
execution, accepted campaigns, accounts, financial holds and risk/exit policies
remain independent. Existing access/VIP/zero-credit/provider/manual settlement
rules remain. Partners and older clients keep the original analyzer. No real
analysis, order, account/profile edit or Telegram post was used for acceptance.

## Actions Taken

1. Added four scenarios x four legs using the existing canonical daily
   MarketMap/FormulaB port and automatic allocation authority. The live allocation
   function bodies and api/copytrade.ts are unchanged. A pure appended helper
   exposes the same geometry-weight math for remaining advisory shares.
2. Future geometry uses actual closed daily structure/ATR and a disclosed
   hypothetical deeper-price reference. It never fabricates future candles or
   stores hypothetical OPEN as an accepted execution decision. Later actual
   readiness still requires four prior recorded legs, real depth and a fresh
   engine decision. WAIT/absent valid allocation stays explicitly pending.
3. Personally recorded completed purchases freeze original planned price/share,
   the scenario allocation cohort, and actual purchase price/amount/date. A
   price touch cannot infer a fill. Entry registration creates no exchange order
   and is never labeled exchange verification. Daily remaining-leg references
   are separately disclosed from saved entered-scenario references.
4. Cards and both chart paths use one16-leg model. Plans are dashed; actual
   personal purchase records have separate solid lines. All lines remain;
   entry-axis labels take priority in all-view and single-scenario selection
   reveals exit/reference labels. Conditional share captions disclose provenance.
5. Added immutable full reports, owned latest pointers, personal entry records
   and paginated history in four advisory-only tables. RLS/service-role controls,
   owned deterministic Spot modeNULL decision linkage, revision CAS, idempotent
   entry IDs and exact advisory refresh leases prevent cross-owner/lost writes.
   Financial PREPARED/SUBMITTED/UNKNOWN holds are untouched.
6. Native pages restore by verified owner and coin, ignore late scope replies,
   retain a visibly stale report on read failure and keep token-free bounded
   owner caches. Last chosen coin is owner-scoped. Genuine old stored DCA restores
   only saved fields; old missing indicators/entries are not reconstructed. The
   existing server engine-history panel is retained.
7. Added a bounded secret-protected daily job with no AI-provider/credit/order
   capabilities, and an independent opt-in gate in the existing scheduler
   candidate. Closing advisory tracking/all16 entered stops recomputation without
   deleting history or closing a trade. The migration and scheduler are unapplied.
8. Added one read-only explanation popup per scenario: saved level sources,
   percentages, actual daily indicators, reasons, risk note and optional saved
   AI review. Future scenarios explicitly reuse report-day observations, not
   invented future indicators. Missing data remains unavailable. Opening a popup
   runs no analysis/charge. Full daily indicators now persist with the report;
   the original panel uses that snapshot. Popup state is owner/coin scoped.
9. Updated handoffs, advisory-only strategy amendment, floating help, safe test
   runbook and activation/rollback instructions. Added a closed reversible
   successor for35 explicit reviewed paths plus its manifest. All prior source
   assertions remain; arbitrary/missing/modified inputs reject.

## Checks and Evidence

| Check | Result |
| --- | --- |
| Current projection/UI/popup/owner/cache/auth/job functional checks |25/25 PASS; actual source, no application bootstrap/env/network/account |
| Actual migration in fresh disposable PostgreSQL17 |12/12 PASS: roles/RLS, owned linkage, immutability, leases, idempotence, concurrent save/entry/initial races, close/all16 behavior |
| Unchanged prior Analysis/Telegram UI/access plus exact-scope negatives |52/52 PASS via six actual synchronous entry modules inside the repository's existing complete-source checked session |
| Strict new modules, popup and isolated preview types |PASS |
| Full App/API diagnostic comparison to exact627 source |baseline18/current18/new0; only equivalent quoted-literal-union member order normalized; complete actual texts retained |
| Compiled preview/Web/Admin builds |PASS; existing monolithic frontend size warning remains |
| API bundle compilation |PASS, no API execution |
| Local browser |Persian desktop/390px popup, indicator expansion, Escape/close; earlier360px English/full chart, sample frozen entry/daily reweight/history/owner isolation/read-failure retention |
| Production DB migration/scheduler/CI/release |NOT APPLIED/ACTIVATED/RUN for this candidate |

The database run used a reviewed existing image, a process-owned private cluster,
network none, zero host mounts/inbound ports, non-root user and explicit resource
limits. The exact task container was removed. No production database or restored
customer data was used. Migration SHA256: `b33e6caf973c87cd53ed89631ce700e8f6d8f6e0214bcc9ad92c7b0a16972852`.

Host build/test Node is24.19.0; disposable SQL harness Node24.21.0/PG17. Official
Linux Node22 CI is a separate later release gate. The unmodified broad historical
Windows UI entry was stopped for excessive runtime, not counted as passed. A
temporary synchronous whole-entry loader rejected top-level await. The narrower
six-entry run above executes the original tests without removing assertions or
changing validation; complete source/Git controls are checked around imports.
No legacy credential-loading test or wildcard sweep was run.

The sample fixture history is in-memory and resets if its local server restarts;
the durability implementation is validated separately in disposable SQL tests;
live production durability is not yet verified. Browser screenshots contain synthetic sample data only and
remain local. No private Telegram/account evidence is published here.

## Publication and Runtime State

The feature is committed locally and not pushed. Existing main/runtime were not
advanced by this task. No live SHA is inferred from local source or another chat.
The source base is recorded above; later release must integrate current main and
complete normal exact-source CI/artifact, backup/cold-restore and independent Guard
gates. Install/apply the matching migration and reviewed scheduler through the
normal release process, then explicitly activate only its independent job gate.
No installed control-plane file or global Docker/Windows setting was changed.

This sanitized report is separately published to SignalVerse-AI-Log/master and
its remote bytes are verified by the publication receipt. This is not a feature
deployment or a claim of authenticated private-account execution/profitability.

## Remaining Limitations

Physical Telegram mobile keyboard/safe-area behavior and every old account state
are not exhaustively covered. Incomplete historical data remains unavailable.
The new migration and daily scheduler require later authorized activation, and
the full official Linux release gates remain mandatory. Existing large frontend
bundle and pre-existing strict App diagnostics remain separate work.
