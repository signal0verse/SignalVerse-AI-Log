# Binance Real Futures final Funding — Production rollout 2026-09-21

## Result

The narrowly scoped final-Funding accounting fix is deployed on Production at
executable commit `d38ce3f1c39933b747ebf94874e1d6d75dc00924`.

This release affects only newly terminal **Binance Real Futures** lifecycles.
It does not change Spot, in-app Demo, other exchanges, the Engine, Supervisor,
strategy, risk, entry, exit, leverage or SL/TP decisions. No private exchange
request or order was made as part of testing or rollout.

## Database-first gate

1. The standard backup completed with **344,365 rows**.
2. The native backup restored into an isolated PostgreSQL 17 cluster with TCP
   disabled. The drill restored **88 public tables**, reapplied the migration
   twice, preserved all original-column row values and legacy permissions, and
   passed observer/RLS checks.
3. Two restore-runner defects were found before Production and fixed:
   - the isolated cluster now creates the dump-referenced restricted
     `whale_feed` role;
   - row comparison snapshots the pre-migration column list, so an additive
     nullable column does not falsely look like changed row data.
4. The additive migration was applied to Production before application code.
   Direct SQL verified four columns, one status constraint, one partial due
   index, **1,168 existing rows**, and zero non-NULL legacy statuses.
5. PostgREST schema reload succeeded, service-role select/update privileges
   remained available, and a REST selection of the new column returned HTTP
   200.

The backup was retained. Only the exact, stopped temporary release/drill
directories were removed after deployment.

## Test and delivery evidence

- Dedicated final-Funding suite: **10/10 PASS**.
- Adjacent Real Futures execution suites: **115/115 Node cases PASS**, plus the
  Gate/MEXC runner's **32 internal assertions**; zero network calls, database
  calls or real orders.
- Pre-release full allowlist: **363/363 PASS**.
- Isolated VPS migration runner on PostgreSQL 17.11: **10/10 groups PASS**.
- Customer and standalone-admin builds: PASS.
- API bundle: **14/14 handlers PASS** with Node 22 target.
- Production CI run `35526277503`: **success**. It passed the isolated test
  matrix, all three disposable PostgreSQL suites, build, bundle, artifact
  verification and release delivery.

## Post-deployment verification

- Active symlink and `deployed-sha` both equal the executable commit.
- `signalverse.service` is active and the deployed API bundle contains the new
  final-Funding reconciliation routine.
- Public home: HTTP 200.
- Public `/healthz`: HTTP 200 with `ok=true`.
- Error-priority service journal entries since deployment: zero.
- Production `copy_trades`: 1,168 rows and zero non-NULL reconciliation states
  immediately after deployment, as expected because there was no historical
  backfill and no test trade.

## Behavior and limits

Newly terminal Binance Real Futures rows enter `PENDING`, settle after the
configured delay, and become `COMPLETE` only after a bounded exchange read and
successful ledger write/read. Transient failures become retryable `UNKNOWN`;
malformed data remains fail-closed. UI net PnL uses signed final Funding only
after completion. Pending/unknown results are excluded from totals, win rate,
calendar and result sharing rather than treating missing costs as zero.

This release does not prove profitability or private-account execution.
Historical Funding mismatches were not backfilled. Demo parity remains deferred
until the Real path is observed and accepted under the owner's staged plan.
