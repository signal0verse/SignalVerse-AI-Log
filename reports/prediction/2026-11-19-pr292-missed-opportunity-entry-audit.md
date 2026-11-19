# Prediction opportunity and Demo-entry audit — 2026-11-19

Read-only production review of the decision-table screenshot on deployed source 58edc149eea3eba4264a7c4e29fabad5a1fb375b. Times below are MYT.

## Screenshot reconstruction

The 50 most recent rows under the Opportunity filter at the screenshot cutoff, 22:15:19, covered six distinct public markets and all selected NO. Forty-seven came from Shadow scans and three from Demo-entry scans. None had would_open=true, the recorded indication that the candidate reached the final admission stage. The UI counts repeated observation rows after filtering by decision; it does not count unique executable entries.

All seven visible rows matched recorded Shadow evaluations of three public markets. Each had a positive fee-adjusted model edge, with tradeability false. Spread or depth blocked the rows that reached the order-book gate. The 21:52 November 22 observation was the only actionable row of its tick and the tick recorded a ladder-coherence rejection before order-book admission.

| Public market | Visible Shadow net edge | Confirmed reason at observation |
|---|---:|---|
| BTC above $62,000 on November 21 | 6.80–7.87 percentage points | Spread and depth at each visible observation |
| BTC above $62,000 on November 22 | 8.42–9.36 percentage points | Depth on every visible observation, plus spread in two and ladder coherence at 21:52 |
| BTC above $64,000 on November 24 | 5.92 percentage points | Insufficient depth |

## Demo admission and current evidence

- Each of the seven visible observations had a matching Demo-entry re-evaluation seconds later. These had the same recorded market prior, without an admissible AI review group. The corresponding Shadow evaluations had an AI review group. All seven Demo decisions were neutral, with negative net edge, so did not enter. The source attempts review independently during both runs and does not persist the provider-level failure reason when the group is absent. A rate limit or a provider outage was not inferred.
- The other three Opportunity rows in the reconstructed sample did appear in the Demo-entry run itself. At 17:04, 18:00 and 20:34 those ticks had exactly one actionable observation, every one was rejected on insufficient depth, and each tick opened zero positions. No qualified entry was skipped in this bounded evidence.
- The latest completed Demo-entry run used for this check was at about 22:26, succeeded and opened zero. The three named markets all recorded neutral decisions. Separate public NO books around 22:27 showed spread of 6.06%, 10.53% and 1.98%, respectively. The first two had no depth inside the engine's 1% band around midpoint. The last passed the public spread and depth check at that instant, with no positive edge in the latest Demo decision. This public book read was not a new model evaluation and does not recreate historical execution.
- The requesting account's entry eligibility and trade-ledger join were checked without including any account details in this report. No position existed for the three screenshot markets. Current scheduled Demo period limits were already recorded and are a separate policy. No capital, duplicate-position or insert rejection accounted for the audited skips.

## Operating state

Prediction Real Trading and autonomous learning remained OFF. The Demo entry gate remained present. No manual scan, forced tick, position, settings change, production write or deployment was performed. Two initial broad read-only queries hit a statement timeout. Narrow indexed reads and a bounded latest-row sample completed and produced the evidence above.

No claim is made that the six markets never offer an executable entry outside this sample. These records do not establish profitability or complete Phase 9A statistical validation.
