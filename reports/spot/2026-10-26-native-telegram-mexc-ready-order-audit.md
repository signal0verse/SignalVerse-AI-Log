# Native Telegram Spot: ready state versus exchange LIMIT orders

## Metadata

- Date: 2026-10-26 (Asia/Kuala_Lumpur)
- Task ID: native-mexc-ready-order-audit-20261026
- Module: Native Telegram real Spot / exchange-order observability
- Mode: Read-only investigation and Binance comparison
- Repository: signal0verse/signalverse-main
- Inspection branch: codex/analysis-free-allowance-20261025
- Local starting/ending commit: 100480386067f89d7dd0a367d210852473736db5
- Verified active runtime: 55ad6648e8b730bc535ba37d86c54daa8b9245b6
- Remote main observed: 41113c4c (later documentation commit; not runtime evidence)
- Final private observation: 2026-10-26T05:32:24Z

## Objective

Investigate a ready/blue native MEXC Spot scenario that has no visible resting buy orders. The owner expects the same ready-to-resting-LIMIT behavior as native Binance and requests a comparison with an existing Binance asset using server records.

## Scope

Read installed source identity, narrowly scoped owner-authorized database records and the relevant execution dispatch. No account activation, price edit, order submission/cancellation, forced analysis, scheduler invocation, grant, balance edit, schema or runtime change. Private identities, holdings, amounts, order identifiers and account-level observations are omitted from this public report.

## Actions Taken

1. Checked the clean inspection worktree and fetched main without overwriting other work. Pull without a tracking branch reported that no upstream is configured; explicit fetch succeeded. No global Git configuration was changed.
2. Read repository instructions, current handoffs and execution documentation. The strategy had already been read in this conversation; the newer runtime amendment was inspected separately and concerns standalone advisory tracking, not native Copy Trade execution.
3. Verified the live marker, release directory and active main service. Compared the installed copytrade source bytes to the exact active Git blob.
4. Matched the user-specified account to the primary administrator without retrieving credentials. Queried only the requested native real MEXC scenario and Binance comparison in a READ ONLY transaction with a bounded statement timeout.
5. Inspected the real LIMIT selector, scheduler dispatch and MARKET trigger. Recorded a private local comparison receipt; no private account receipt is published.
6. Opened the existing Telegram mini-app read-only. Its profile belongs to a different signed-in account, so it is not claimed as visual proof of the requested administrator's trades. No login, message or trade action was performed. An initial reading of the owner's comparison-asset name as “dashboard” was corrected; the final comparison used server data as explicitly requested.

## Files Inspected

- AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md
- TRADING_STRATEGY.md and the active-runtime amendment
- docs/COLLEAGUE_HANDOFF_2026-09-29.md
- docs/testing/stability-test-runbook.md, docs/admin-console-v1.md
- docs/fixes/partner-spot-limits-2026-10-06.md
- docs/fixes/spot-scenario-retry-2026-10-14.md
- api/copytrade.ts: usesRealSpotLimitOrders, ownedSpotLimitEngine, evaluateSpotCycleStepReal, syncSpotCyclesReal and cron dispatch
- Native Spot lifecycle presentation and the AI Log reporting template

## Files Changed

NONE in the product repository. Only a private local observation helper/receipt and this sanitized report were created.

## Root Cause / Findings

**CONFIRMED:** Native Telegram and owned/partner Spot select different execution paths. `usesRealSpotLimitOrders` selects Binance unconditionally. Its MEXC/Gate extension requires an active owned Spot context; ordinary native Telegram does not have that context.

**CONFIRMED:** Native MEXC therefore reaches `syncSpotCyclesReal` / `evaluateSpotCycleStepReal`. This path waits for a ladder trigger and then submits a MARKET buy, subject to the existing funding, durable claim and admission checks. It does not pre-place resting LIMIT ladders just because the analysis is ready.

**CONFIRMED:** The narrowly scoped live records corroborate the difference: the requested MEXC ready cycle has no durable exchange-order or ladder-claim records, while the requested Binance comparison has recorded native LIMIT buy orders, including filled and pending orders. Account-specific counts, identities, quantities, prices and identifiers remain private.

**CONFIRMED:** This is an existing native-versus-owned implementation boundary. The October 6 owned LIMIT documentation explicitly leaves ordinary Telegram behavior unchanged. The evidence does not support blaming the new standalone free-analysis allowance or the later advisory display.

**UNCONFIRMED:** Private exchange order inventories were not independently queried in this investigation. Database receipts are not proof that an arbitrary external/manual order is absent from the exchange. Missing funds, API permissions, the current trigger price and future fill timing were not independently established and are not presented as the cause.

## Implementation

No product fix or deployment was performed. The requested behavior requires extending the native MEXC lifecycle to journaled exchange LIMIT placement, not changing a color label or raising an orderbook score. Existing accepted prices, allocations, monetary-credit rules, funding checks and all durable/unknown holds must be preserved. Existing MARKET fills and uncertain claims must retain safe reconciliation rather than being resubmitted or guessed into a new lifecycle.

## Tests Executed

- Read-only installed-source/Git-blob comparison: PASS. SHA256 of api/copytrade.ts is cf81d64d735551a002049c88981a9bb2ad5e6421e927c4255dcfc511756cdee3.
- Account identity and current owner/venue/mode scoped server comparison: PASS in BEGIN READ ONLY / COMMIT, with statement timeout. No production DDL/DML or exchange request was made by the helper.
- Static dispatch and ladder-trigger checks against the exact active source: PASS.
- Initial diagnostic-only mistakes: the first marker lookup used an outdated path; the installed control's actual marker path was then used. A first JSON aggregate parser expected one line per result; PostgreSQL's multiline json_agg formatting caused an assertion, corrected using jsonb_agg. Both attempts were read-only and caused no account/database changes.
- No mutation-capable legacy tests, trading endpoint, scheduler or test order was run.

## Build Result

NOT RUN: no executable source was changed. No build, functional test suite, private-account execution or profitability claim is made.

## Git Status

Inspection worktree remains clean. Its historical branch and the later active runtime are reported separately. No product source commit, main push, force push or deployment was performed.

## Commit

No product commit. Publication of this report is independently byte-verified after creation.

## Remaining Issues

Native Telegram MEXC still uses triggered MARKET execution and does not yet provide the owner's requested Binance-style resting LIMIT behavior at readiness.

## Risks / Limitations

This is a source-and-records diagnosis, not a direct live exchange inventory audit. No test operation was performed on the user's funds or positions. The inspected Telegram browser profile was not the requested trading identity and is excluded as trading evidence.

## Recommended Next Step

Implement and validate the native MEXC LIMIT lifecycle through the existing exchange adapter/journal boundaries. Cover placement at readiness, partial fills, insufficient funding, uncertain acknowledgements, first-fill credit, TP lifecycle, stop/expiry and legacy MARKET compatibility in isolated tests before the established exact-source CI/artifact/backup/Guard release process. Do not create live test orders or clear old holds to obtain a passing check.
