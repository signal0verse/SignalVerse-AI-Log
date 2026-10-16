# Spot Scalp entry-policy source review

Date: 2026-10-16 (Asia/Kuala_Lumpur).
Source examined: `52844ba671267b193ac061751427008d58623d26`.
Scope: source-code review of the independent technical Spot Scalp entry filters. This report contains no account observations or account-derived results.

## Findings

- Preset selection edits a browser draft, and Save persists the policy. Legacy settings without an explicit trend policy retain conservative admission. The policy recorded in a completed scan identifies the rule set used by that scan.
- The Balanced preset permits bullish, range and transition 4h regimes, but continues to reject bearish, high-volatility and unknown regimes. It does not lower the existing score, directional-edge or liquidity thresholds.
- A LONG result from the upstream discovery stage is not a final Spot candidate or a filled trade. The native Spot market must separately pass its turnover and spread checks. Insufficient native Spot turnover produces `SPOT_SCANNER_LOW_TURNOVER` even when direction and trend pass.
- `SCORE_BELOW_MINIMUM`, `LOW_TURNOVER` and `REGIME_HIGH_VOLATILITY` are separate blockers. A trend-policy relaxation cannot be assumed to remove an independent score or liquidity failure.
- `SCANNER_RANK_SOURCE_HTTP_429` denotes a ranking-source request failure. It is distinct from a completed scan's per-symbol candidate rejections.
- The evaluated instrument count is distinct from the configured market-cap ranking boundary and from final native Spot candidates. Upstream candidate counts must not be presented as accepted Spot entries.

## Checks and results

Inspected `spot-scalp-trend-policy.ts`, `futures-market-discovery.ts`, `spot-auto-scanner.ts`, the preset definitions and their UI save wiring at the source above. Confirmed the fallback policy, regime admission branches, score threshold independence and separate native Spot liquidity filter. No account records are read by this report publisher.

These are source-level findings, not evidence of a private-account scan, filled trade or profitability. Selecting a new preset requires the user's explicit Save in the intended mode before a subsequent scheduled scan can demonstrate that policy's actual result.

## Changes and publication state

No application code, production settings, saved profiles, orders or durable holds were changed. No scan was forced and no trade was submitted. No new deployment or production CI was started for this audit. This is a documentation-only report; the application source remains the release cited above.

Remaining limitation: source inspection establishes which gates remain, not a counterfactual executed scan or an investment outcome.
