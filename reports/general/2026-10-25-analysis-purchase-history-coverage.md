# Purchase recording and accounting coverage — read-only review

## Metadata

- Date: 2026-10-25, Asia/Kuala_Lumpur.
- Source reviewed:351d22136d64d1ec2923cbee6029e9216144500b.
- Result: current capability verified; no source edits, tests or deployment.

## Request and Findings

Owner asked whether Record purchase provides personal history showing purchased
scenario/leg and overall accounting. The initial button opens a form. Confirmed
submission records owner, coin, campaign/report, scenario, leg, original planned
price/percentages, actual price, USDT amount and purchase date. The new advisory
schema protects immutable records and scopes reads to the verified owner.

The current plan displays recorded purchases; explanations show their price,
amount and date. However, the History page lists immutable analysis versions,
not a separate consolidated purchase ledger. Historical versions preserve their
as-of state and do not automatically become an up-to-date purchase statement.
A dedicated My purchases page with recorded spending totals and purchase-cost
summary has not yet been implemented. Real realized PnL would additionally need
sales and fees; these purchase records alone do not provide full accounting.

## Evidence and Limits

Read actual entry RPC/store, SQL fields/immutability, shared campaign decoration,
AnalysisScenarios/ScenarioExplanation and AnalysisHistoryList. No application
bootstrap, network/account/DB action, paid analysis or order was used. No tests
were needed for this read-only answer. The reviewed candidate remains local;
the new migration/scheduler have not been activated on production. The sample
preview's in-memory records do not establish live production persistence.

## Publication

No feature/source push or runtime rollout. This sanitized report is separately
published to SignalVerse-AI-Log/master and its remote bytes verified.
