# Spot Scalp Balanced policy: authorized Demo save and observation

Date: 2026-10-16 (Asia/Kuala_Lumpur).
Application source: `de7e1e85b791ac3af3f048b960a4c481b8dbb68d`.

The owner explicitly requested saving the released Balanced preset in CrossVerse Demo and inspecting the next scheduled scan. The normal authenticated application UI was used to select the preset and save. The saved-policy indicator and subsequent recorded scan both confirmed Balanced with `scalp-risk-v1`. Other form settings were retained. Account identifiers, budgets, scan timestamps, instrument observations and private history are intentionally excluded from this report and retained only in private task evidence.

## Verified contract

- Balanced discovery floors are score 30, directional edge 15 and USD 5000000 of 24h turnover. Exact native Spot pair turnover is validated separately. The spread ceiling remains 10 basis points (0.1%).
- Balanced accepts bullish, range and transition 4h regimes. A passed 4h gate does not override independent score, native market liquidity, volume participation or closed 5m/15m confirmation requirements.
- The source rejects adverse volume participation at `components.participation <= -0.25` with `AUTO_ADVERSE_VOLUME_PARTICIPATION`.
- The configured market-ranking boundary, number of evaluations, number of LONG discovery results, final Spot candidates and executed buys are distinct counts. A candidate is not a filled order. One asset can have more than one evaluation when native fallback is checked.
- Save confirmation was verified through the UI. The subsequent scheduled scan's persisted policy and effective thresholds were checked using a query-only SQLite snapshot scoped to the same previously identified Demo profile. Its actual blockers and execution-history result were reported privately to the owner.

## Changes and limits

Only the explicitly requested Demo preset was saved through the existing application handler. No Real-mode setting, code, release, credential, schedule or durable order hold was changed. No scan was forced and no manual test purchase or sale was submitted. No background deployment automation was restarted. The observation describes one recorded scan, not a guarantee of entry or profitability in future scans.

This report publisher validates private evidence locally but does not embed or transmit that evidence. The published report is read back and compared byte for byte.
