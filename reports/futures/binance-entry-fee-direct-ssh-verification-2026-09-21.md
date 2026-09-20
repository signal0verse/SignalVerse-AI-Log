# Binance Futures Production direct SSH verification — 2026-09-21

## Scope

Owner-requested, read-only direct verification of the Binance Real Futures lifecycle-fee Production rollout. No service, configuration, database, exchange or application runtime mutation was performed.

## Evidence

After the owner supplied the current non-default SSH port, the existing dedicated project key and pinned host identity were used with strict host-key checking, batch mode and a bounded timeout. The read-only command returned:

- active application symlink: release `e5ce65c2bcb824804fec4c2ebb9a8dd113f3d6e6`;
- `/var/lib/signalverse-deploy/deployed-sha`: `e5ce65c2bcb824804fec4c2ebb9a8dd113f3d6e6`;
- `signalverse.service`: `active`.

This independently confirms the exact executable SHA previously reported as `deployed` by Production CI run `35521461654`. No restart, write, alternate-port scan or private-account request occurred.

## Repository and publication state

The earlier rollout report and `HANDOFF.md` were corrected to include this direct evidence. Documentation-only commit `bbeac50` was pushed to `main` with `[skip ci]`; it does not replace or redeploy executable SHA `e5ce65c2bcb824804fec4c2ebb9a8dd113f3d6e6`.

This sanitized report is published to `signal0verse/SignalVerse-AI-Log`, branch `master`. Credentials, key material, account data and the non-default SSH port are intentionally omitted.

## Remaining limitations

This verifies deployment identity and primary service activity only. It does not prove profitability, private-account execution, engine signal quality, Supervisor usefulness or resolve the separate lifecycle-history and pagination limitations documented in the rollout report.