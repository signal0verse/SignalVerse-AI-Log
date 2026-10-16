# Technical Spot Scalp: spread and volume participation by risk preset

Date:2026-10-16 (Asia/Kuala_Lumpur).
Implementation commit: `633898244df01f2706c59a1af9c13d9919da8d14` on `codex/scalp-risk-liquidity-20261016` (local feature commit).
Publication state: report only; no source push, deployment or live profile changes.
This report contains only implementation details and synthetic test results.

## Behavior

Explicitly selecting and saving a preset adopts `discoveryPolicy=scalp-risk-v2`.

| Preset | Maximum bid/ask spread | Buy participation must exceed | Minimum24h turnover USD |
| --- | ---: | ---: | ---: |
| Low |0.10%|-0.25|10,000,000|
| Medium |0.15%|-0.50|5,000,000|
| High |0.20%|-0.65|2,000,000|

Spread equality passes only this check; participation equality rejects. Participation
is the existing signed component of relative volume and acceleration, not turnover
or an estimate of order-book depth. The numeric choices describe filter strictness,
not calibrated loss probabilities or a guarantee of purchases/profit.

The collector applies preset ceilings to discovery, native symbol liquidity and the
exact Spot pair. Both discovery and native pair retain their turnover floor. The
LONG quality gate uses the preset participation boundary; its underlying scoring
formula is unchanged. Final JS/SQL admission checks exact version/configuration,
recorded quality, pair liquidity, freshness and account scope. New cycle snapshots
freeze the thresholds. Old undefined/v1 profiles and accepted cycles are unchanged.
A preset selection/Reset edits a draft; Save adopts it explicitly.

Existing current OI, trend/1h, high-volatility, anti-chasing, closed native5m/15m,
costs, funds and uncertain-order guards remain. Native-only metals retain their
Spot confirmation route without invented Futures participation evidence. Generic
Futures, SHORT, classic Spot and ongoing campaign management retain prior behavior.

All7 UI languages display per-preset and effective limits. Scan diagnostics display
observed participation and its recorded strict boundary, preserving precision rather
than rounding a rejected value onto the boundary. Old missing thresholds are not
guessed from current settings.

## Verification

- 397 integrated Spot regression and predecessor-scope checks passed.
- 52 shared discovery/quality tests passed.
- 213 disposable PostgreSQL checks passed, including both namespaces,3 venues,3 new
  presets, frozen snapshots, profile preservation and all old-v1 fixtures rerun after
  the additive migration.
- Scoped strict TypeScript and shared full-terminal build passed.
- Actual React Persian UI inspected in a local synthetic preview; Latin digits and
  exact participation evidence displayed correctly.
- Actual synthetic OHLCV through all3 venue collectors demonstrates that a Medium
  candidate rejected solely by the old participation boundary can pass v2, while
  more adverse participation and insufficient liquidity continue to reject.
- Windows sandbox restrictions prevented PostgreSQL WAL rename and some dependency
  reads. Identical safe tests passed with host access. Integrated files were run
  serially to keep generated fixtures stable during source hashing; no assertion
  or safety check was removed.

These checks are not backtests, evidence of live-account execution or profitability.

## Remaining release work

Official exact-source CI and immutable artifact, private backup/restore rehearsal,
independent Guard, additive `spot_scalp_liquidity_risk.sql` before runtime deployment,
and matching native/owned/Paper/shared terminal versions are required. No live
migration, forced scan, profile update, order or hold manipulation occurred. Coordinate
rollback with version compatibility if any user later saves a v2 profile.
