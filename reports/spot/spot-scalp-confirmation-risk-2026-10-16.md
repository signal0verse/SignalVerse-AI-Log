# Spot Scalp: valid 15-minute confirmation by risk preset

Date: 2026-10-16 (Asia/Kuala_Lumpur).
Implementation commit: `0e4cf4a88e7edd2d7676a8584d50488d7b16de6d` on `codex/scalp-risk-confirmation-20261016` (local feature commit).
Publication state: report only; source not pushed, no deployment or live settings changed.
This report contains implementation facts and synthetic test results only.

## Behavior

The independent 5-minute Spot Scalp previously required a canonical LONG with
at least 4 points on both timeframes. The new, separately saved confirmation
policy allows a lower 15-minute score while retaining positive confirmation.

| Risk preset | Minimum net 15-minute score | Mandatory confirmation |
| --- | ---: | --- |
| Low | 4 out of 5 | Bullish trend and canonical LONG |
| Medium | 3 out of 5 | Bullish trend and valid momentum |
| High | 2 out of 5 | Bullish trend and valid momentum |

All presets require at least two bullish momentum votes and no more than one
opposing vote. The signed score uses the existing trend, MACD, RSI, StochRSI and
Bollinger calculations; negative votes count. Missing or disabled evidence cannot
manufacture votes. Neutral or bearish 15-minute trends do not confirm an entry.

Closed, contiguous native candles, complete finite indicators, EMA200 extension,
capital-flight and risk-off checks remain. An independent engine veto still
blocks entry. The original 15-minute engine output is retained unchanged; the
Spot confirmation result and its score, minimum and reasons are recorded separately.
Only a canonical 5-minute LONG with a valid setup supplies ladder/target geometry.
Price reaction, selected volume checks, liquidity, costs, funding and execution
guards continue to apply. Canonical Futures, classic Spot, exits and holds are unchanged.

Selecting a preset or Reset changes a draft. Explicit Save adopts
`confirmationPolicy={version:'scalp-15m-v1',risk:...}`. Existing profiles without
the field, including liquidity-v2 profiles, retain the prior 4-point confirmation.
Open campaigns preserve their immutable policy, including legacy missing policy.
The native, owned and Paper paths carry the same saved policy. The additive SQL
migration adds validation and consistency checks without updating any user profile.
All seven settings languages show preset/effective thresholds and adoption guidance.

## Verification

- 428 integrated regression and predecessor-scope tests passed.
- 325 checks passed on a disposable PostgreSQL cluster with synthetic
  data, both namespaces, all three venues and presets; legacy checks were rerun
  after the migration. Profile/cycle preservation and immutable policies passed.
- 32 technical, layer-confirmation, replay and tool tests passed
  after rebuilding the isolated Paper artifact from the changed source.
- Scoped strict TypeScript, full shared-terminal build and final scope checks passed.
- Actual React Persian preview verified the effective threshold changing from 4 to 3
  after explicitly selecting Medium, with the recorded acceptance reason visible.
- Synthetic native candles with a 15-minute score of 3 pass Medium across Binance,
  MEXC and Gate, while Low and legacy wait. The actual Medium tool preset still
  rejects insufficient relative volume; stale data, adverse trend, macro conflicts,
  missing evidence and insufficient cost coverage also reject.

These are synthetic correctness checks, not backtests or proof of live execution
or profitability. Risk names describe filter strictness, not calibrated loss odds.

## Remaining release work

Official exact-source CI, immutable artifact, private backup/restore rehearsal,
independent Guard and the new `spot_scalp_confirmation_risk.sql` migration after
the liquidity migration are required before runtime publication. Match the native,
owned, Paper and shared-terminal versions. No account settings, forced scans,
live migration, trade, hold or deployment was changed in this task. Saving new
policies later requires rollback compatibility planning.
