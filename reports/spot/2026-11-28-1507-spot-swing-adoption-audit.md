# Spot Swing Trader live adoption audit

- Date: 2026-11-28, Asia/Kuala_Lumpur
- Ending commit: 4b780fdfd6f8f3fd2245fbe33f5d1ecb21bbcb0e

The deployed application's source matches the previously verified capital
migration. A repeatable-read, read-only transaction on the live database
checked the current policy, migration journal, exchange connection records,
open rounds, and recorded fills. The existing profile allocation matched the
saved legacy budget multiplied by the target count. Its independently
calculated one-percent entry matched both the database function and the
open round's recorded base.

A legacy real Swing round had joined the new ledger in pending state. The
recorded fills match the terminal order journal and there are zero unresolved
order claims in its snapshot. The round lacks a current connection record
for its exchange, which causes the normal real reconciliation path to skip it.
Its historical allocation and fills remain recorded. Standard Spot rounds
continue under their own policy.

New-model selection also exists on other Telegram accounts. One deliberately
excluded dual-quote Demo configuration retains its two settlement currencies
and prior model. This report omits account identities, trade symbols, and
account-level amounts.

This was a read-only production audit. The deployed commit, account settings,
and orders were left intact.
