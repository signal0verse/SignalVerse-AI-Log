# SKY Real Futures entry-quality audit — sanitized

## Metadata

- Date: 2026-10-05 (Asia/Kuala_Lumpur; evidence timestamps below UTC).
- Task ID: sky-real-futures-entry-risk-audit-20261005.
- Module: Standard Real Futures, Binance.
- Mode: read-only diagnosis requested by the owner; no implementation or trading instruction.
- Repository: signal0verse/signalverse-main.
- Inspected runtime marker and active application release: 3e92cab7a36cc0021847b1f700b9b5a394c75b37.
- Primary checkout preserved on codex/prediction-coverage-expansion-audit at 0dbca62357a4adf34240f40ceda3e387356ec4b0. Runtime source was read from the exact Git object, not assumed equal to this older checkout.
- Bounded database evidence collected at 2026-10-05T08:31:25.265339Z and 2026-10-05T08:33:08.031879Z; each transaction explicitly READ ONLY, with statement and lock timeouts.
- Public Binance mark observation: 2026-10-05T08:38:54.001Z.
- Privacy: account identifiers, trade/decision/order UUIDs, account balances, quantity, margin, entry/exit prices and raw private rows are deliberately omitted. They were matched in the bounded audit and explained directly to the owner, not exported into this report.

## Objective and scope

Determine whether one currently open, losing SKY Real Futures entry was justified at execution time and quantify its relative planned risk. Inspect only its linked records and two preceding same-symbol trades. Do not alter any position, strategy, protection, scanner, PP worker, flag, database record or service.

## Actions taken and evidence sources

- Matched the requested owner's open Standard Real Binance SKY trade through an existing owner-bound audit anchor; no guessed owner identity or account-wide export.
- Joined copy_trades, engine_decisions, pending_signals, ai_supervisor_verdicts and futures_execution_attempts by persisted IDs. Inspected that owner's SKY futures_pro_setups history and at most three later same-symbol decisions.
- Read the active runtime marker and application symlink. Inspected exact runtime-version Git source. Relevant copytrade/engine/risk/reentry files have zero diff between the prior f1f4981 release and 3e92cab7.
- One successful unauthenticated public GET to Binance /fapi/v1/premiumIndex?symbol=SKYUSDT; an initial local sandbox socket attempt failed before response. No private exchange request, credential read, application trade handler or test order.
- Independently recomputed risk and timing from the linked records.

## Executive result

CONFIRMED: the original LONG decision met the current engine's rules at analysis time and used closed native candles. This is not the historic forming-candle issue.

CONFIRMED: execution happened 7h 49m 37.934s after that decision. The pending-entry path does not require a fresh full engine/momentum/regime decision at trigger time. The scanner's intervening retirement of the symbol also did not prevent this pending signal from opening.

CONCLUSION: an allowed entry under the current code is not proof of a fresh, high-quality or low-risk entry. There is a concrete stale-pending/candidate-retirement admission gap to address separately. Neither the current loss nor this single example proves the gap caused the loss, or that a SHORT would have been correct.

## Decision evidence

| Check | Recorded result | Interpretation |
|---|---|---|
| Selected direction/timeframe | LONG, 4h | Winning timeframe, not three-frame unanimity |
| Confluence | 4 of 5 votes | Trend, MACD, RSI and Stoch bullish; Bollinger neutral |
| Per-timeframe scores | 15m -1; 1h +2; 4h +4 | Only 4h met the absolute-score >=4 entry threshold |
| Trend alignment | 15m neutral; 1h neutral; 4h bullish | One of three trend classifications aligned |
| Displayed confidence | 0.8 / HIGH | abs(score)/5, NOT an empirically calibrated 80% win probability |
| Market context | Bullish / RISK_ON | Context available at original analysis, not fresh execution-time proof |
| Supervisor | CONFIRM tied to original decision | No newly linked execution-time review |
| Native candles | 3/3 SAFE_CLOSED | Raw Binance inclusive close timestamps precede input selection and decision |
| Risk gate | Passed | Planned RR 2; not a portfolio loss-cap guarantee |

At original analysis, the latest native closes were 11:44:59.999Z (15m), 10:59:59.999Z (1h), and 07:59:59.999Z (4h), all on 2026-10-04. At execution, the 11:59:59.999Z and 15:59:59.999Z 4h boundaries had already elapsed. Provenance correctness at the old decision does not establish decision freshness at execution.

The only subsequent decision returned by the bounded query was about five minutes after entry: LONG on 15m, scores 4/3/3 for 15m/1h/4h, with all three trend classifications bullish. This is evidence against claiming the market was definitively bearish at entry, but it cannot retroactively authorize that earlier 4h entry; its 4h score was below 4.

## Relative risk

- Recorded leverage: 3x isolated. It is not exceptionally high leverage, but leverage alone does not describe trade risk.
- Stop distance from actual fill: 4.3479496% of price.
- Gross loss at the recorded stop: 13.0438487% of that position's recorded margin, before fees, funding, slippage or gaps. This is NOT 13% of account equity; total equity was not inspected.
- Target distance: 8.9381004%; actual-fill reward/risk approximately 2.0557047.
- Original 4h ATR: approximately 3.54% of its analysis price; stop multiplier 1.25 ATR.
- Public mark snapshot implied approximately -6.38% of recorded margin in gross unrealized PnL. It is a timestamped estimate, not an authenticated account PnL reading or final net return.
- Database protection record was SAFE, with both native protection IDs present and liquidation below the stop. This audit did not independently query live exchange orders and does not certify present native protection from a database flag alone.

## Timing and stale-pending evidence

| Relative event | Evidence |
|---|---|
| Prior same-symbol 4h trade | Closed as SL_HIT, not profitable manual close |
| New pending signal created | Shortly after that stop; then refreshed to the linked decision |
| Linked decision | Reused the same most-recent closed 4h candle/window hash and identical SL/TP setup as the earlier stopped trade |
| Scanner retirement | About 16 minutes after this decision, reason NOT_CANDIDATE:SCORE_BELOW_MINIMUM |
| Actual pending execution | About 7h34m after scanner retirement; original decision age about 7h50m |
| Later scanner re-addition | About 26 minutes after execution, not evidence of prior approval |

The existing manual-profit reentry fix addresses CLOSED_MANUAL profitable exits; the earlier SKY trade was SL_HIT, so this is a distinct condition, not proof that the manual-profit fix failed.

## Exact source path and missing gate

Source references use runtime SHA 3e92cab7a36cc0021847b1f700b9b5a394c75b37:

1. api/copytrade.ts:10994 checkPendingSignals selects PENDING rows; enforces expires_at (normally up to 48h), native price/timeframe provenance, fresh native price-window trigger touch, and atomic status claim.
2. api/copytrade.ts:10913 activatePendingSignal checks account/mode eligibility, existing open position, account connection and confirmation policy, then invokes activateRealPendingTrade.
3. api/copytrade.ts:10611 activateRealPendingTrade checks durable attempt recovery, reentry admission, persisted provenance, original Supervisor CONFIRM, position count, balance and fresh price-based RR >=1.9 before the execution claim/submission path. It does NOT recompute the original indicators/score/regime, require latest closed-bar hashes, or require a currently eligible discovery row.
4. api/copytrade.ts:9549 hasVerifiedRealFuturesTimeframeProvenance validates DIRECT/FALLBACK shape and selection identity; it does not compare decision age or candle boundary to current execution time.
5. api/copytrade.ts:15471 maintainFuturesDiscoveryRows retires invalid discovery rows at 15518 but does not cancel their outstanding pending_signals. The pending activation path has no compensating discovery-eligibility check.
6. api/_shared/futures-decision-engine.ts computeCanonicalFuturesDecision chooses the highest qualifying individual timeframe (ties prefer larger timeframe); alignedCount is recorded but is not a mandatory multi-timeframe agreement gate. confidence is abs(effectiveScore)/5. SMC decision weight is zero in this authority.
7. api/_shared/futures-risk.ts validates geometry/RR, open count/lock and leverage range, not maximum position-margin-loss percentage or total-account equity risk.
8. api/_shared/futures-reentry-admission.ts delegates to futures_reentry_admission_v1; migrations/futures_manual_profit_reentry.sql selects CLOSED_MANUAL exits, leaving actual TP/SL status semantics distinct.
9. api/analyze.ts upsertPendingSignal refreshes the existing pending row and 48h expiry. An older row creation timestamp than the linked updated decision is therefore not itself an error.

## Files inspected / changed

Inspected: the sources above, project AGENTS/CLAUDE/HANDOFF/AI handoff/trading-strategy/test instructions and the AI-Log report template/security scanner. No exchange adapter or financial source was executed.

Changed: this sanitized dated report and a short local HANDOFF audit receipt. Two bounded, local diagnostic scripts under tmp were used only to send read-only Python/SQL over the existing SSH path; not application code, not published. Preexisting dirty/untracked work preserved.

## Checks, build and publication state

- Read-only transaction assertions: PASS; owner/trade linkage count exactly one.
- Native candle timestamp classifications: 3/3 SAFE_CLOSED for the linked decision.
- Risk and delay arithmetic: independently recomputed; values above.
- Source trace: completed without executing entry/protection handlers.
- Build/tests: NOT RUN / not applicable to diagnosis; no application change or claim of backtest profitability.
- Report secret scan: PASS (no obvious patterns); exact staged-file privacy/content review completed. Final conversation records verified publication commit/link.
- Application commit/push: NONE. Only the reports repository may receive this report-only commit.

## Limitations and recommended next step

No point-in-time fresh engine decision was persisted for the instant immediately before entry. A five-minute-later decision cannot fill that gap. Public mark data is not signed private-account state. Open orders, current net fees, full account equity and native position state were not independently inspected. Do not infer that reducing the pending TTL or adding a filter will improve profitability without independent tests.

Recommended separate repair scope: bind pending admission to fresh same-symbol/venue setup evidence at execution, and to the originating candidate's current eligibility or explicit invalidation. Preserve native SL/TP and management of existing positions. Specify and test stale decision, retired candidate, fresh requalification, price RR and concurrent claim cases before any implementation/release. No repair is authorized or performed by this audit.

## Safety

PRODUCTION_MUTATION=NO; APPLICATION_CODE_CHANGED=NO; DATABASE_WRITE=NO; PRIVATE_EXCHANGE_CALLS=0; PUBLIC_MARKET_GET_SUCCESS=1; ORDERS_CHANGED=0; POSITIONS_CHANGED=0; SL_CHANGED=NO; TP_CHANGED=NO; WORKER_STARTED=NO; DEPLOYMENT=NO.

Official public-data reference: [Binance USD-M Futures market data: native kline close-time and mark-price endpoints](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data). These documents describe data semantics, not the correctness or profitability of this private trade.
