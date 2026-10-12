# Technical scalp confirmation and Spot workspace — source published, release blocked

Date: 2026-10-13

Published main source: `f2fed11b92487767626ae6ce4ddaa9b968f711b4`

Review: https://github.com/signal0verse/signalverse-main/pull/226

Production remains on the previously verified `087e4cb611feee6a05bcc7aa1dfc2684bfdcbcf4` release. This report records tested source publication, not a deployment or a verified private-account trade.

## Implemented

- A separate Spot scalp entry on CrossVerse plan features and SignalVerse home. Ordinary Spot/manual lists remain separate. Existing source/mode/venue symbol collision and capital rules stay authoritative.
- Coins at the physical left, native Spot 5m chart at the right and execution history beneath it. Mobile places a horizontal coin selector above the chart. Original setup controls remain accessible in a management section.
- Saved four buy ladders, two profit targets and average buy on the chart. Actual recorded fills alone receive price/time markers. History-row selection focuses its saved scenario and candle when present. Chart and history timestamps are explicitly UTC.
- Optional chart data on the existing owned cycle-history read. Missing or invalid reads retain previous same-scope data with a notice; no command retry, profile activation or new order is triggered by navigation, refresh or chart selection.
- Existing open-work management remains reachable after plan completion without authorizing new entry.
- New Spot scanner campaigns adapt the unchanged canonical Futures technical engine on closed native 5m Spot bars with exact closed 15m direction confirmation. The eight-style shared confirmation/veto layer can pause an existing directional setup but does not create an independent direction, boost confidence or change accepted Futures Entry/SL/TP/risk.
- Spot keeps finite budgets, scenarios and averaging, with no executed stop-loss or forced timed/losing exit. Open daily/v1 campaigns retain their saved models. Manual Spot and unrelated Futures execution/protection paths are preserved through a pinned successor source contract.

## Validation

- 171 offline functional, pattern, source-preservation, display-retention and expired-plan checks passed at the principal candidate checkpoint.
- Final shared-style/UTC and management subsets passed (84 and 64 checks respectively); these overlap and are not summed as independent coverage.
- 25 pattern cases passed, including both directions, harmonic ratios, first-return invalidation, closed-bar timing and correlated-event handling.
- Shared production UI build passed. The actual scalp stylesheet is embedded inside the shared terminal's isolated CrossVerse shadow root.
- The earlier complete frontend/API type comparison introduced no new diagnostics (API34/34; frontend77/73). Final official CI is required for the exact candidate source.
- Desktop/mobile synthetic preview verified physical column order, history below chart, coin/venue switching, UTC labels and absence of page-wide horizontal overflow. Preview values are synthetic, never customer balances or returns.
- Full candidate CI found a missing import in the historical simulator's isolated AST harness. The harness now loads the actual pattern function. Execution/clock fixtures explicitly supply causal MA-retest strategy history to that real function, while retaining their original execution candles and assertions; no always-true confirmation stub is used. Historical timing16/16, simulation mechanics136/136, discovery simulation11/11 and the final combined timing/discovery/scope64/64 checks passed (overlapping coverage).
- Full CI run38316994689 passed all77 workflow steps for the exact candidate revision, including the previously failing historical harness, unchanged protection/re-entry, disposable SQL cases, frontend/API diagnostic comparison and final web/API build. No test assertion was removed to pass the historical cases.
- All predecessor manifests and CI gates remain pinned. The reviewed successor reconstructs the deployed source exactly and rejects unrelated or unreviewed changes. No migration, production database edit, private exchange test order, profile enable, forced refresh or operator tick was performed.

## Limits and release state

These are reproducible v1 educational rule subsets, not ML training, the complete private RTM/ICT methods or a profitability backtest. OHLC patterns do not prove institutional intent or exchange stop orders. Per-sell PnL is explicitly calculated gross against its scenario average; unknown/ambiguous basis displays a dash. The chart covers up to1000 recent closed5m bars; older fills remain in history. Paper retains its existing last50-cycle limit. No return or holding-time guarantee.

An earlier direct default-branch publication was rejected by automatic approval review after failed tests. After the correction and complete successful CI, a guarded normal fast-forward publication was approved and verified. PR226 is merged and remote main is exactly the tested source above. No force push was used.

The required main-push CI run38319635870 could not start a runner. GitHub's check annotation says the account has a payment/spending-limit restriction; the job failed before any step ran, with no code/test failure log. The owner must resolve that account restriction before the exact main run can be rerun. The release gate requiring successful main-push CI was not bypassed. Artifact preparation, independent retained-byte/Guard approval and both-site runtime cutover remain pending. No production settings, database/account state or exchange actions were changed for this stage.

Primary technical references used in defining the explicit rule interpretation: Fidelity's Fibonacci guide, IG's candlestick guide, Harmonic Trader's published pattern definitions and the respective RTM/ICT authors' public material. The owner's supplied scalp article/images guide intent; they are not performance evidence.
