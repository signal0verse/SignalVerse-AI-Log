# Futures primitive evaluation

## Metadata and conclusion

Date 2026-10-09; frozen source `61280af0f123fe8d6bbfb4afe7e0cb6a7d238c91`, not freshly runtime-verified. **هیچ‌یک از سه تغییر تازه برای فیوچرز برتر از پایه نبود.** نتیجهٔ مثبت یک فصل برای افزودن به موتور کافی نیست.

## Exact research variants

Actual shared `computeFuturesDecision` and `runSimulation`, pure AST extraction with fixed offline data. No exchange adapters, Worker or PP module activated.

- Baseline: original fixed SL/ONE TP and original accounting.
- Trail: evaluate existing SL/TP/liquidation first. After a completed 4h candle reaches at least +1 original R at CLOSE, trail by two Wilder ATR14 of closed 4h candles from the best CLOSED price. Ratchet only, effective next bar. Original TP unchanged. Not Gunbot TrailMe, not a live PP implementation.
- Time stop: after six signal-timeframe durations, at the next observable 4h OPEN, original gap SL/TP/liquidation first, then model a full exit using the same adverse stop-slippage/fee function. 15m/1h deadlines are rounded upward to this execution clock, not tick-accurate.
- Weekday admission: do not admit a new engine offer Saturday/Sunday UTC; existing exits remain unchanged.

New exit timing can free capacity and produce later entries. Complete chronological replays were rerun; this is not a claim that only one matched closed-trade cohort changed. Simulated trailing/time-stop safety says nothing about native A→FLAT→B or live duplicate-close safety.

## Data and capital

BTC/ETH/SOL Binance USD-M public native candles and actual historical funding, Q3/Q4 2025 independent resets. Each symbol gets 10000 USDT, fixed 250 margin, leverage 2; 30000 total per fold. Decision daily, fills 4h, 15m/1h/4h/1d decision inputs closed at decision time. ONE TP allocation 100/0/0.

Fees 0.05% and slippage 0.02% each side, doubled in stress; funding not artificially doubled. Original risk gate may reject a higher-slippage entry, hence stress trade counts differ. Macro/stablecoin unavailable, no AI, scanner selection or private fills. Data was used in prior research, not a blind holdout.

## Primary results

| Variant | Q3 MTM net | Q4 MTM net | Sum USDT | Closed trades | Closed net | 2x cost sum |
|---|---:|---:|---:|---:|---:|---:|
| Baseline | 192.9386 | 458.4047 | 651.3433 | 100 | 612.6887 | 595.5532 |
| Trail 2ATR | 245.6301 | 223.2483 | 468.8784 | 131 | 470.2857 | 398.6193 |
| Time stop six bars | 248.3952 | 78.6331 | 327.0282 | 152 | 327.7283 | 246.7152 |
| Weekday admission | 131.0774 | 417.2917 | 548.3691 | 86 | 509.7145 | 475.4247 |

Sum is across RESET portfolios, not compound six-month performance. Baseline average closed trade 6.1269 USDT, trailing 3.5900, timeout 2.1561, weekday 5.9269. Symbol/side/timeframe detail and individual fold win rates/PF are in evidence JSON.

| Variant | Q3 DD % | Q4 DD % | Q4 win rate % | Q4 PF |
|---|---:|---:|---:|---:|
| Baseline | 0.3699 | 0.4082 | 51.5152 | 3.3364 |
| Trail | 0.2733 | 0.5390 | 44.4444 | 1.5150 |
| Time stop | 0.2483 | 0.6934 | 42.8571 | 1.1644 |
| Weekday | 0.4114 | 0.3915 | 50.0000 | 3.1018 |

Normal exits: baseline TP=41/SL=59; trail TP=46/original SL=73/research trailing=12; timeout TP=29/SL=53/time=70; weekday TP=35/SL=51. Trailing/time-stop paths were genuinely exercised, not just source-text matched.

Q4 closed SHORT net shrank from 392.0302 baseline to 202.7602 trailing and 78.6407 timeout. Daily-signal closed net shrank from 390.6835 to 185.7916 and 80.0541. This is evidence that these particular early exits cut profitable trend participation; not proof that every trailing design fails. Changed reentry sequence also contributes.

## Test and scope

48 fresh replays, including every arm at doubled costs. 27 new behavioral cases plus 31 point-in-time and 16 simulator-timing cases: 74 logical PASS across the research task. Baseline full trades/curves match previous study. Exact commands/hashes in general report/evidence.

`trailingEnabled` remains an accepted historical simulator field, but `stepPosition` explicitly retains fixed SL; field presence is not operational trailing proof. Fast Trader's separate session-scoped Smart Exit was inspected for distinction, not changed.

No Futures DCA/Grid prototype was represented as an additive ONE-TP feature: those would need different exposure/risk/execution specifications. No app build necessary or run; no source commit/push, no CI/deployment, no SL/TP/position/order changes, no Worker start, no exchange calls.

```text
FUTURES_IMPROVEMENT_PROVEN=NO
FUTURES_CANDIDATE_FOR_PRODUCTION=NONE
LIVE_PROFIT_PROTECTION_IMPLEMENTED=NO
PRODUCTION_CHANGED=NO
```
