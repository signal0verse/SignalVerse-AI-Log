# Prediction Market per-user information and accounting audit — 2026-11-19

The owner requested verification that Prediction Market information and accounting are calculated independently for each account.

Active production source was `0578551fa195c17a24d1384bc7579db3a66a824f`. Its installed predictions.ts SHA-256 matched the exact Git blob. The working desktop checkout remains detached at `59fb9e17a26dcae3eaaee1b58ec6af5efa2f48cd`. All source review and behavioral reproduction used the deployed commit.

Personal account, trade history and performance use the server-verified Telegram identity. Complete information isolation is not satisfied because two read endpoints lack ownership filters. Available-cash reporting also omits open-position fees.

## Verified behavior

- The API derives the owner from the signed session. Account settings and personal open/closed positions, performance, watchlist, manual Demo portfolio and saved simulations use the authenticated Telegram identity.
- Autonomous entry uses separate per-owner capital maps and distinct trade rows. Users have separate capital, trade cap, category selection and cadence preferences. Daily, weekly and qualified entries share the same owner's autonomous Demo ledger.
- Production has two autonomous accounts. The observed trade ledger currently has one distinct owner, which limits live cross-account behavioral evidence. Read-only aggregate checks found no ownerless trades, orphaned account owners, duplicate account rows, duplicate open user/market rows, duplicate cadence/period rows, or private prediction-receipt owner mismatches.
- The live unique indexes include account identity in both open-market and evaluation-period keys. Direct SELECT grants for the anon/authenticated database roles were absent on all six inspected Prediction tables. Autonomous account/trade tables rely on backend ownership filtering and do not have RLS enabled.
- Account-changing UI sessions remount the autonomous monitor and discard personal responses from an old session.
- Engine activity totals, shared market decisions and market data are system-wide. The activity card's open/total trade counts include all users. The separate My Autonomous Account panel uses the caller's own ledger.

## Findings requiring correction

### Personal prediction data can escape through two read endpoints

The anonymous feed queries all prediction columns without restricting the owner. Its current production sample returned 56 rows and zero owner-bearing rows. That snapshot does not prove the endpoint excludes private rows.

The authenticated decision-trace endpoint queries a prediction by ID without validating the prediction's owner, then returns the complete row. Anonymous trace requests return HTTP 401, but an authenticated account can request another account's private prediction when its ID is known.

The existing isolated network/database harness executed the actual deployed handler against synthetic accounts. An anonymous feed returned a private prediction. A different authenticated synthetic account read that same private prediction through decision-trace. This is a reproduced authorization defect in the active source. No cross-user production session was fabricated or used, and no production exposure incident is claimed.

Repair requires keeping shared ownerless market predictions visible through an explicit shared path and authorizing every private prediction row against the session owner. A private feed needs authentication plus an owner filter. Selecting only fields intended for the caller reduces accidental disclosure. The existing tests miss these two cases.

[Trace handler source](https://github.com/signal0verse/signalverse-main/blob/0578551fa195c17a24d1384bc7579db3a66a824f/api/predictions.ts#L3548)
[Feed handler source](https://github.com/signal0verse/signalverse-main/blob/0578551fa195c17a24d1384bc7579db3a66a824f/api/predictions.ts#L3600)

### Available-capital reporting omits fees on open positions

The committed-capital helper sums position notional only. Available capital consequently equals configured capital plus closed net PnL minus open notional. Open entry fees are omitted. The isolated actual-handler fixture reproduced a 0.20 Demo-dollar overstatement for one account with a 10-dollar open position and a 0.20 entry fee.

The additive migration's admission checks already subtract open notional plus modeled entry fees under an account row lock when evaluation is enabled or remains open. This avoids mistaking the inaccurate display for demonstrated overspending through that guarded path. Existing closed net PnL and mark-to-market formulas include the stored entry fee. Displayed available cash, the experimental preflight, and qualified sizing should use a consistent fee-inclusive per-owner balance. Historical/default entry behavior outside the evaluation budget guard needs its own review before any broader accounting assurance.

[Committed-capital helper](https://github.com/signal0verse/signalverse-main/blob/0578551fa195c17a24d1384bc7579db3a66a824f/api/predictions.ts#L1259)
[Account snapshot](https://github.com/signal0verse/signalverse-main/blob/0578551fa195c17a24d1384bc7579db3a66a824f/api/predictions.ts#L1316)

## Validation and boundaries

- Actual-handler synthetic two-user audit passed 22 assertions covering identity, personal balances, open/closed positions, performance, unauthenticated rejection, and global activity counts. It independently reproduced both privacy defects.
- All 19 existing scheduled-evaluation tests passed with zero failures and zero skips.
- All 17 existing structural multi-user checks passed. Those passes do not cover the reproduced privacy defects.
- Production checks used bounded SELECT transactions, installed-source reads, health reads, and anonymous read-only GET requests. No fixture rows, migrations, account settings, or trades were created or changed.
- The production service was healthy at verification. Learning's scheduler gate was absent. The verified deployed source retains the disabled Real Prediction execution branch.
- No executable source, deployment, feature branch or main commit was changed. The only repository publication is this sanitized dated report on AI-Log master. The independent settlement watch remains stopped per the owner's prior instruction.
- These findings remain open. Statistical validation, profitability and model superiority were outside this audit.

