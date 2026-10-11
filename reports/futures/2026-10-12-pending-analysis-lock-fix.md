# Futures pending analysis lock correction — 2026-10-12

## Problem and correction

An unfilled real Futures decision could create an OPEN analysis lock before an exchange fill. That lock then prevented the normal worker from obtaining fresh analysis. When entry was eventually reached, the unchanged freshness guard rejected the old decision.

Real analysis now derives its lock from confirmed OPEN real copy-trades and durable PREPARED, SUBMITTED or UNKNOWN execution attempts, scoped to the existing owner and symbol. It no longer creates an OPEN analysis lock merely because real analysis returns a direction. Database uncertainty fails closed. Demo and unscoped legacy behavior is retained.

This allows the existing worker to revisit an unfilled setup through the same decision engine. It does not revive a failed entry or authorize a trade. The current analysis, Supervisor and final entry admission must still approve it. The ten-minute freshness ceiling, newest scored candle, atomic claim, duplicate-order protections, sizing, capital policy and protection rules remain unchanged. Existing positions and uncertain attempts retain their holds, exits and reconciliation. No rows or old locks were deleted.

## Verification

- Actual helper, analyzer wrapper/writer and closed scope checks, together with entry freshness and predecessor gates: 189 passed, zero failures or skips.
- Native/owned final entry, admission integration, execution fault and command journal/service checks: 369 passed using inert transports, no live exchange or production database.
- Type comparison and preserved predecessor scope: two passed; no new frontend or API diagnostics relative to the reviewed baseline. Existing baseline diagnostics remain.
- Native web/admin build, full shared terminal build and owned copy-trade runtime build passed. The existing bundle size warning remains.
- Complete exact main-push CI passed, including all predecessor scope gates, disposable PostgreSQL ownership/concurrency tests, final web/admin build and API bundling.
- Independent immutable artifact verification passed: embedded commit, provenance, digest and all 2,205 Git blobs/symlinks and executable bits matched without extracting or executing archive code.
- Read-only runtime acceptance passed: native SignalVerse, owned copy-trade and admin services were active from the exact release directories. Main/admin health and owned manifest checks passed; compiled native analysis and owned engine bundles both contained the correction. Existing release controls and prior release were retained.
- Both public origins served the new manifest and the exact two versioned public assets. Hashes/byte lengths matched their manifest; both host pages returned HTTP 200. The initial operator probe used an unsupported directory URL and correctly received 404; the probe was corrected to the declared versioned routes, with no website change.

## Publication and release

- Source: `18dabf37b5d954f246a1016b1b7244793ddd2405`, published on main with a normal fast-forward push.
- Reviewed predecessor: `42d30b6c7c71851b45ac45a1ffd9a8d856081172`; its complete main CI passed. All its chart, admin and automatic confirmation work is preserved.
- Exact main-push CI: [38176277308](https://github.com/signal0verse/signalverse-main/actions/runs/38176277308), success.
- Immutable preparation: [38179099628](https://github.com/signal0verse/signalverse-main/actions/runs/38179099628), attempt 1, artifact `11716748564`, success.
- Inner archive SHA-256: `777353f512d16eb6ce20310d87f37db9ecc2cb09cecea33007eef5f90734578e`, 6,633,009 bytes.
- Official release: [38179221553](https://github.com/signal0verse/signalverse-main/actions/runs/38179221553), success, after an independent one-use authorization bound to that SHA and archive digest and a verified private receipt backup.
- Active native SignalVerse and owned shared-engine source: `18dabf37b5d954f246a1016b1b7244793ddd2405`.
- Public manifest source: the same SHA at `https://signal.easybitpay.com/trade-terminal/manifest.json` and `https://cross-verse.net/trade-terminal/manifest.json`.
- The correction is active in both sites through the native and owned shared engine. CrossVerse uses the fixed shared engine; its Laravel host and the supplier transport required no code changes for this backend correction.

## Limits

Offline tests and runtime health do not prove private-account execution or profitability. No operator-triggered analysis, live test order, forced entry, profile change, reset, migration or trading policy adjustment was performed. The normal opted-in worker may refresh eligible unfilled setups; a new decision can still legitimately wait or reject entry.

Private backups, execution details, user identifiers and credentials are excluded from this report.
