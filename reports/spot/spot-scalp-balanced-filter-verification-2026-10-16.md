# Balanced Spot Scalp: persistence and blocker interpretation

Date: 2026-10-16 (Asia/Kuala_Lumpur).
Source reviewed: `52844ba671267b193ac061751427008d58623d26`.
This report contains source-code findings only. It intentionally excludes account-derived observations and outcomes.

## Source checks

- Balanced requires both the explicit `balanced` trend policy and its matching tool configuration: Volume Profile off, the remaining preset tools on. A draft selection and a persisted profile are different states.
- The actual scan records its policy. A subsequent scan using that policy establishes which rules were executed; a preset label alone does not establish a trade.
- Range and transition 4h regimes are admitted by Balanced. Separate score and directional-edge conditions still apply, along with native Spot market validation.
- Native Spot turnover is checked before native Spot spread. If both fail, `SPOT_SCANNER_LOW_TURNOVER` is the first reported reason; the spread may independently remain above its maximum. Resolving or relaxing only the first condition would not establish eligibility.
- A preliminary LONG discovery result is distinct from a final Spot candidate. Final candidates precede native closed-candle entry analysis and any simulated fill.
- Existing scheduled scanning is sufficient to verify a saved policy. A forced scan, artificial fill or repeated unchanged profile save is not necessary to demonstrate normal behavior.

## Work and limitations

Reviewed preset identification, trend admission and native Spot filter ordering. No application source or threshold was modified, and no new deployment or CI was started. This documentation-only publication does not claim a private-account transaction, a successful fill or profitability. Private runtime evidence is excluded from this report. The exact report bytes are verified after publication.
