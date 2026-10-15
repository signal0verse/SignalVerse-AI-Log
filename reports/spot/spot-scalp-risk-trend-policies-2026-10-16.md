# Spot Scalp: explicit 4h trend policy for each risk preset

Date: 2026-10-16. Result: implemented, locally verified, committed and pushed to a feature branch. This change is not deployed.

Source: `52844ba671267b193ac061751427008d58623d26`.
Branch: `codex/scalp-risk-trend-20261016` in `signal0verse/signalverse-main`.
Base: `2fa1d1ef0938b77bfbf2ca24b36439318ae7c861`.

## Diagnosis and scope

The existing Low/Medium/High presets varied volume confirmations but shared the same established 4h trend requirement in both discovery and automatic candidate quality. Consequently, a valid short-horizon opportunity could be rejected specifically because the 4h market was ranging. This correction applies only to the independent technical Spot Scalp project. The original Spot scanner, default Futures discovery, SHORT evaluations and existing financial execution paths retain their behavior.

## Implemented behavior

| Preset | 4h direction admission |
|---|---|
| Conservative | Requires an established bullish trend. |
| Balanced | Permits bullish, range and transition regimes; rejects a bearish trend. |
| Aggressive | Treats known 4h direction as context, permitting assessment of countertrend candidates. |

Both discovery and automatic quality consume the same explicit personal `options.trendPolicy`. The original scores and discounts, minimum score 40, minimum edge 20, 1h confirmation, data freshness, current OI, liquidity, spread, high-volatility and anti-chasing checks remain. Closed native 5m/15m confirmation, patterns, cost, funds, access and durable execution holds also remain. A bearish regime may still produce an insufficient buy score in Aggressive mode. Risk labels describe filter strictness, not measured loss probabilities or promised returns.

Selecting a preset edits the settings draft and requires an explicit Save. Missing legacy policy remains conservative, including old volume-only Medium/High combinations. Tool customization never silently lowers trend strictness. Reset restores strict defaults. No existing profile, activation, balance or accepted campaign geometry was changed.

The native and owned services retain the policy in their existing JSON profile settings; Paper retains its existing owner-scoped settings. Demo and Real remain separate. A run generated under another policy cannot authorize an entry. No database migration is required.

Runs record the policy actually used and each symbol's 4h admission outcome. Seven-language settings and diagnostics distinguish passing this condition from passing all entry checks or placing an order. Public chart analysis remains separate from account discovery and has no execution authority.

## Verification

- Integrated UI, new behavior and full predecessor scope chain: 309/309 PASS; no skipped or cancelled tests.
- Discovery, quality and original Spot discovery tests: 55/55 PASS.
- Focused trend/preset/OI set: 30/30 PASS; these overlap the integrated suite and are not an additional unique total.
- Final closed-source scope check after documentation-only edits: 28/28 PASS.
- Focused strict TypeScript: PASS. This is not a claim of a clean repository-wide type check.
- Actual component rendering and Persian RTL browser inspection: PASS. The static preview uses clearly identified synthetic data and does not save settings or place orders.
- Synthetic functional tests exercise both real calculation gates and the actual collector for Binance, MEXC and Gate, persistence by mode, Paper owner isolation, stale revisions, legacy defaults, malformed policies and remaining vetoes. These are not market backtests or evidence of private-account execution or profitability.
- The first sandboxed integrated run encountered access restrictions at the shared dependency junction. The identical suite passed with the required local access; no assertions were removed or skipped.
- Exact 25-file inventory, reversible predecessor projection and negative mutation checks passed. The previously published completed-history correction is retained in the base.
- Git diff whitespace check passed. Remote feature-branch SHA was read back and matches the source above.

## Publication and remaining work

The feature branch is pushed. No main-branch merge, CI dispatch, production deployment, account save, forced scan or test trade was performed for this change. Another main-branch Production CI was already running; it was left intact. A main push would cancel that same-ref run under the repository's concurrency policy.

Exact-source production CI, immutable artifact preparation, independent release Guard approval and runtime verification remain before rollout to SignalVerse and the shared CrossVerse terminal. Local checks do not substitute for those gates. Users' live profiles continue to use their existing settings until this change is released and a preset is explicitly saved.
