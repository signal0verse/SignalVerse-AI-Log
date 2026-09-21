# Binance Real Futures Funding — read-only post-deployment observation

Date: 2026-09-21 UTC  
Executable Production SHA: `d38ce3f1c39933b747ebf94874e1d6d75dc00924`

## Scope and result

This was a read-only observation of the already-deployed final-Funding fix.
No code, database rows, settings, job gates, account mode or exchange orders
were changed. No private exchange API request was made.

At 2026-09-21 12:15 UTC, Production had **no Binance Real Futures lifecycle
closed after the deployment** and no currently open Binance Real Futures
position recorded in the application ledger. Consequently, the live
`PENDING → COMPLETE` transition and final net-PnL display for a newly closed
real lifecycle remain **NOT_VERIFIED**, not PASS or FAIL. Historical closed
rows were intentionally not backfilled by the release.

The five-minute maintenance timer was active and enabled. Its dedicated
`cron-sync-all` gate was present, and recent natural service runs finished
successfully. The old global `jobs.enabled` file is intentionally obsolete;
its absence is not a disabled-cron finding. Trading setup enablement was
unchanged and no new trading was initiated for observation.

## Next gate

Wait for an ordinary, owner-authorized Binance Real Futures lifecycle to
close, then read the new row after the settlement delay and verify the bounded
Funding ledger, status, signed amount, fee and displayed net PnL. Do not
start/restore a Real trading loop or place a test order merely to generate
evidence. Demo parity remains deferred until the Real result is accepted.
