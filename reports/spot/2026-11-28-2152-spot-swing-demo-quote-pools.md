# Spot Swing Trader Demo quote budgets

- Ending commit: cf498906f59b158485c876dc29ab200ee76adc6b
- Verified active runtime: cf498906f59b158485c876dc29ab200ee76adc6b
- Previous active runtime: 4b780fdfd6f8f3fd2245fbe33f5d1ecb21bbcb0e
- Scope: native Telegram Spot Swing Trader Demo

The Demo scanner stores its capital, reservations, losses and base entry
separately for USDT and USDC. A setup uses the pool for its recorded settlement
currency. The requested total budget is allocated as 16,000 USDT and 4,000
USDC, with respective 1% base entries of 160 USDT and 40 USDC. The split
accommodates the outstanding USDT commitments and leaves an independent USDC
budget. No default trading profile was automatically converted by the schema.

The isolated application suite passed 1,005 tests. The final source passed 26
historical source compatibility checks. The web, admin and API built without
new compiler diagnostics. The isolated private restore covered 149 database
relations and verified both SQLite copies. The restore rehearsed the exact
Demo profile conversion with the existing financial rows intact.

Official CI passed all 94 steps and all four baseline compiler comparisons.
The owner-approved six-hour window applies to the exact isolated release push.
The prior three-hour run was superseded after approval. The exact package
passed all 10 workflow stages and all 2,813 source blobs and modes were
verified. Independent VPS delivery passed all 11 stages. Runtime and admin
health, installed files, public assets, the schema read, and 17 job gates were
checked.

The reviewed Demo profile kept both quote preferences. All 11 previous
cycles became active under the new policy through normal scheduling. All
12 original scenario buy arrays were verified against the preserved snapshots,
including 48 recorded buy-rung entries. No forced run or private order was
used for acceptance.

Read-only production verification found 41 nonterminal real Spot cycle
records with remaining quantities and four orders requiring exchange
reconciliation. The exchange connection for those four orders was absent.
No real data, connection, order, history or profile was erased.

- [Official CI](https://github.com/signal0verse/signalverse-main/actions/runs/46125627556)
- [Verified artifact](https://github.com/signal0verse/signalverse-main/actions/runs/46150643314)
- [Guarded release](https://github.com/signal0verse/signalverse-main/actions/runs/46150958144)
