# Scoped stale Spot ledger reconciliation

- Ending commit: cf498906f59b158485c876dc29ab200ee76adc6b
- Verified active runtime: cf498906f59b158485c876dc29ab200ee76adc6b

The real Spot ledger audit identified 41 nonterminal cycles with positive
book quantities. Of those, 39 were exact legacy simulator fixtures from the
historical Spot LIMIT harness. The fixtures used the documented negative test
actor and simulated symbol, all from one test date. Their parent setups had
already been retired. The scoped production read found no user, exchange
connection, actual order journal, pending claim, capital membership or
notification for the selected fixtures.

A verified private snapshot captured all 39 selected rows and their setups
before the transaction. The transaction rechecked the exact row snapshot,
actor, symbol, residual condition and absence of external links under locks.
It closed 13 accumulating and 26 exiting test rows by changing status and
administrative closure time. The before-and-after comparison verified that
the original buy and sell arrays, synchronization dates, outcome fields
and setup rows were preserved. Other nonterminal test rows without positive
book quantities were outside scope. No code, runtime or exchange orders
were changed.

After the cleanup, two genuine Spot cycle records still held positive book
quantities. The Binance cycle has confirmed historical purchases without a
recorded final exit, and the associated account has no usable Binance
connection. Separately, four Binance orders on a different, already-closed
cycle retain original venue identifiers without a verified terminal status.
The normal reconciliation selector filters out closed cycles, and the missing
connection prevents a direct order lookup. The four rows were retained.

The connected MEXC Spot account returned zero free and locked units for the
relevant asset and no open order for the pair. The ledger contains a partial
exit and a canceled subsequent target. The recent trade endpoint returned no
matching trades, and direct lookups could not verify the older order
identifiers. Wallet-history endpoints were unavailable with the current
credentials. The current balance alone cannot establish how the recorded
remainder exited, so its historical outcome and status were retained.

Verification consisted of read-only database and scoped exchange checks,
the checked fixture-only transaction, and a post-commit database read.
No order was submitted or canceled, and no application deployment was needed.
