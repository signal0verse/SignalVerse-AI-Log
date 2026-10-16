# Spot Scalp Balanced v2: authorized Demo save and scheduled-scan verification

Date: 2026-10-16 (Asia/Kuala_Lumpur).
Application source: `633898244df01f2706c59a1af9c13d9919da8d14`.

The owner requested selecting and saving the released Balanced liquidity preset in CrossVerse Demo, then observing the next scheduled scan. The normal authenticated application UI was used. The loaded saved-policy indicator and a query-only snapshot scoped to the previously identified Demo profile confirmed Balanced with `scalp-risk-v2`. Other form settings were retained.

## Verified behavior

- Balanced uses a spread ceiling of 15 bps (0.15%) and LONG volume participation strictly greater than -0.50. Its discovery floors remain score 30, directional edge 15 and USD 5,000,000 in 24-hour turnover. Exact native Spot-pair liquidity is independently checked.
- The subsequent scheduled scan persisted the new policy and effective limits. Discovery eligibility, final Spot candidacy and executed trades were checked separately. Private instrument observations and execution history were reported directly to the owner.
- Native technical entry requires confirmed LONG decisions on closed 5m and 15m candles. The canonical confluence threshold remains 4 in absolute value; a net score below it does not generate a qualified setup. Relaxed discovery liquidity limits do not bypass this independent gate.
- The implementation preserves the distinction between the market-ranking boundary, evaluation count, candidate count and recorded buys. Public chart simulation is not proof of account execution.

## Changes and limits

Only the explicitly requested Demo preset was saved. No application code, deployment, Real setting, credential, schedule, open-campaign rule or durable order hold was changed. No scan was forced and no manual test trade was submitted. Verification describes a recorded scan and decision, not a guarantee of future entry or profitability.

Account identifiers, budgets, exact scan times, symbols, instrument measurements, screenshots and private history are excluded from this public report. Those records remain in private local evidence. Publication is verified by reading back and comparing the exact report bytes.
