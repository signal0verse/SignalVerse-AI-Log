# Technical Spot Scalp: discovery and liquidity risk presets

Date: 2026-10-16 (Asia/Kuala_Lumpur).
Implementation commit: `de7e1e85b791ac3af3f048b960a4c481b8dbb68d` on `codex/scalp-risk-discovery-20261016` (local feature commit).
Publication state: report only. This change has not been pushed to main or deployed.
This report contains only source-code findings and synthetic-test results.

## Implemented behavior

The independent technical5m Spot Scalp now accepts an explicitly saved `discoveryPolicy=scalp-risk-v1` with the selected trend preset.

| Preset | Minimum discovery score | Minimum directional edge | Minimum24h turnover USD |
| --- | ---: | ---: | ---: |
| Low |40|20|10,000,000|
| Medium |30|15|5,000,000|
| High |20|10|2,000,000|

Both upstream discovery and the exact native Spot pair use the relevant turnover floor. The maximum bid/ask spread stays10bps (0.1%). Fresh valid data, current OI5M for Futures-backed discovery,1h confirmation, the existing4h policy, high-volatility/anti-chasing checks, closed native5m/15m analysis, costs/funds, account/mode gates and execution holds remain. Native metals retain their existing Spot analysis path with the same exact-pair liquidity checks. This is a filter policy, not a measured loss probability or a promise of purchases/profit.

Legacy profiles retain40/20/10M until the user reselects and explicitly saves a preset. Custom tool edits preserve policy. Preset selection and Reset edit a draft. No user profile is automatically rewritten or activated.

Scans retain exact version and configuration. Final JavaScript and additive native/owned SQL admission reject mismatched versions/configuration, low pair turnover or excessive spread. New cycle snapshots retain policy and thresholds. Accepted cycles remain immutable. Classic Spot and generic Futures keep their previous rules.

Seven-language settings display preset and effective floors, including legacy guidance. Diagnostics show recorded discovery limits and exact Spot-pair turnover/spread rather than assuming current settings describe an older scan. Numeric output uses Latin digits.

## Verification

- 73 offline discovery/trend/settings/native/Paper and shared discovery tests passed.
- 101 disposable PostgreSQL checks passed on a process-owned random loopback port; no production database used. Both namespaces,3 venues and3 presets are covered.
- 345 integrated Spot regression checks passed with process exit0, including closed successor/mutation checks preserving predecessor source assertions.
- Scoped strict TypeScript check passed.
- Shared full-terminal production build passed.
- Actual React component render visually inspected in the local browser with Persian layout and Latin threshold digits.

The Windows sandbox initially blocked PostgreSQL WAL rename and bundled React reads. The same safe tests were rerun with ordinary host permissions and passed; no production or execution gate was bypassed. A previous wiring assertion was updated to verify the new third callback argument while retaining its predecessor in the exact reversible scope proof.

## Release boundary

Source is ready on the local feature branch. No main push, deployment, production migration, forced scan, profile update or test trade occurred. Official CI, immutable artifact, private backup/restore, independent Guard and migration-before-runtime ordering remain required for deployment. Native, owned and Paper runtimes must use the same release; do not roll back runtime alone while new-policy profiles are active. Protect existing positions and uncertain orders during any coordinated rollback.
