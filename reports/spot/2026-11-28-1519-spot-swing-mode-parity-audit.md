# Spot Swing Trader account and mode parity audit

- Date: 2026-11-28, Asia/Kuala_Lumpur
- Ending commit: 4b780fdfd6f8f3fd2245fbe33f5d1ecb21bbcb0e

The deployed Telegram release and its shared scanner settings endpoint serve
the capital model in both Demo and Real. Read-only snapshot queries verified
both mode flags and the saved one-percent base policy in both modes for the
requested account. Among other saved Demo profiles, three have the new policy
and a one-percent base. All four Demo profiles passed the current plan or
grant and minimum credit checks. The existing dual-quote exception retains
its prior policy. The existing first-run settings offer the same capital
model for a newly configured eligible account.

The requested open real round has its new base recorded and remains pending
reconciliation. The signed-in exchange account connection has no current
record. Five older snapshots, including the pre-release snapshot and one
from November 6, also show no persisted connection for that exchange.
Retained service logs did not identify the original removal or failure
to save the connection. A private, read-only baseline records fingerprints
of the open cycle, the historical fills, and the matched order-journal
entries for comparison after reconnection.

The verified deployment already serves both modes. The user deferred
reconnection. This audit changed no trading settings, orders, exchange
connections, or application source. Private account identities, symbols,
financial values, and verification fingerprints are omitted here.
