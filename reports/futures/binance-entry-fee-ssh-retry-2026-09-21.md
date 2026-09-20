# Production VPS SSH retry — 2026-09-21

## Scope

Owner-requested, read-only retry of direct SSH verification after the Binance Real Futures lifecycle-fee Production rollout. No code, configuration, service, database or exchange mutation was authorized or performed.

## Checks and results

- The documented alias `servers.signal` was retried and could not resolve because the current Windows SSH profile has no alias configuration.
- The expected dedicated project key and pinned `known_hosts` file both exist; key material was never displayed or copied.
- A direct IPv4 connection to the known Production origin was then attempted with the dedicated key, strict host-key checking, batch mode and a 10-second timeout.
- Direct SSH failed during banner exchange because port 22 actively refused the connection.
- A same-session TCP comparison showed port 22 actively refused while ports 80 and 443 on the same VPS were reachable.
- The public Production health endpoint remained successful with `ok=true` for service `signalverse` at `2026-09-20T16:27:36.517Z`.

## Conclusion

The VPS and web service are reachable, but direct SSH from this host remains blocked at the network/firewall layer before authentication. Therefore the active symlink, `deployed-sha` file and systemd status could not be independently read over SSH. Prior authenticated deployment-coordinator evidence still reports executable commit `e5ce65c2bcb824804fec4c2ebb9a8dd113f3d6e6` as deployed.

## Publication state and limitations

This sanitized report is published to `signal0verse/SignalVerse-AI-Log`, branch `master`. No SignalVerse application repository file was changed. No alternate-port scan, firewall change, restart or workaround was attempted.