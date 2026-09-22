# Real Futures — owner authorization checklist (prepared, not approved)

Date: 2026-09-22 UTC. Reference audit: [final pre-authorization audit](real-futures-final-owner-authorization-audit-2026-09-22.md). **Current status: BLOCKED.** This is a decision package, not permission to execute any item.

**Precondition:** active Production is `56aaff32ba003850db2954d9199cd27cdeaf954a` and includes a Spot change absent from standalone Futures candidate `d58dba78184d80818fc1580890a1c85bf2eb7724`. Do not deploy d58 over the active runtime. First review a Spot-preserving integrated candidate with its own exact SHA and re-run the gates. Recheck the active SHA at the eventual authorization time.

| Item requiring separate owner authorization | Exact decision to record | Current state |
| --- | --- | --- |
| A. Executable SHA | Approve a reviewed **integrated** SHA; d58 is the audited Futures source but is not a safe direct replacement for current Production | NOT APPROVED |
| B. Migrations | Approve exact filenames/bytes and order: `futures_reanalysis_claims.sql`, then `futures_real_portfolio_capacity.sql` | NOT APPROVED; these Futures migrations are not applied in Production |
| C. Backup | Approve scope, location, retention and successful restore verification before change | NOT APPROVED |
| D. Rollback | Approve prior-runtime target, schema/write compatibility, responsible operator and abort procedure | NOT APPROVED |
| E. Deployment window | Approve dated UTC window, operator and service-health criteria | NOT APPROVED |
| F. Real trading flags | Specify exact existing/new-entry flag state throughout migration, deploy and validation | NOT APPROVED |
| G. Binance live scope | Authorize only bounded native protection replacement/read-back on a naturally suitable existing Real position, if one exists | NOT APPROVED; no sample verified |
| H. MEXC live scope | Authorize only bounded native protection replacement/read-back on a naturally suitable existing Real position, if one exists | NOT APPROVED; no sample verified |
| I. Fresh accounting scope | Define fee/funding/PnL/app-ledger reconciliation for a naturally newly closed Real trade | NOT APPROVED; no sample verified |
| J. Emergency stop | Define measurable stop conditions, who can stop new entries, and how protection/reconciliation remain active | NOT APPROVED |

Proposed order after all prerequisites are satisfied: freeze exact integrated SHA → verified backup → controlled transactional migrations → schema/index verification → exact deploy → runtime/health verification → authorized flag state → naturally available private-account read-backs → naturally closed-trade accounting → monitoring/stop decision. **No test trade is to be invented to satisfy a gate.**

No merge, Production push/deploy/migration, Real order or Spot/Demo/Shadow change was performed for this checklist.
