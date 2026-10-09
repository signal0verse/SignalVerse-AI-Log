# Spot primitive evaluation

## Metadata and conclusion

Date 2026-10-09. Frozen application source `61280af0f123fe8d6bbfb4afe7e0cb6a7d238c91`. Isolated offline research, not live-account testing. **بهبود سودآوری اسپات ثابت نشد.** DCA در موتور موجود است؛ این تست فقط وزن‌های قابل‌تنظیم موجود و یک فیلتر زمانی پژوهشی را می‌سنجد.

## Method

Actual `runSpotSimulation` and Market Map/Formula B/ladder/aggregate-exit declarations loaded through the pure AST boundary; no API bootstrap, DB or credentials. BTC/ETH/SOL native daily history, Q3/Q4 2025 independent resets, 3000 USDT portfolio, no compound, scenario 10/20/35/35. Native candle close strictly precedes each decision.

Spot transport intentionally receives 400 warmup days, compared with source default 220 and `ADEQUATE_HISTORY` threshold 400. This is an explicitly labelled sensitivity, not proof that warmup alone causes sparse entries. Q3 has no filled cycles in every arm. Missing macro/stablecoin context remains unavailable equally.

Fees 0.10% and impact 0.02% per side, both doubled in stress. Price MTM and actual fills reconstruct equity; hypothetical TP profit is excluded. Existing daily OHLC buy-before-sell ambiguity remains. Prices are Binance public Spot, fee model is an assumption rather than a specific private account's actual tier.

## Results

All activity below is Q4; Q3 equals zero.

| Variant | Closed cycles | Closed net USDT | Net including open MTM | Max DD % | 2x cost MTM |
|---|---:|---:|---:|---:|---:|
| Base 10/20/35/35 | 5 | 14.1250 | 1.0086 | 1.3133 | -0.1511 |
| Equal 25/25/25/25 | 5 | 14.9765 | 0.7336 | 1.4967 | -0.7054 |
| Front 40/30/20/10 | 5 | 15.3547 | 0.3912 | 1.6890 | -1.3297 |
| Weekday admission only | 8 | 21.0759 | 21.9788 | 1.2545 | 20.6011 |

Baseline/equal/front each retain three open cycles; weekday arm retains one. Open-cycle count is not necessarily three funded positions. Weekday win rate 87.5%, PF 3.2343, average closed trade 2.6345 USDT; baseline 5/5 winners but PF undefined with no closed loss. This illustrates why closed-trade win rate alone is misleading while inventory remains open.

**نتیجه:** سنگین‌کردن خریدهای اولیه سود بسته‌شده را بیشتر نشان داد ولی سرمایهٔ درگیر/زیان باز، نتیجهٔ کل و DD را بدتر کرد. فیلتر آخر هفته فقط یک سرنخ پژوهشی است: 8 چرخه و یک فصل فعال برای نتیجه‌گیری کافی نیست؛ علت اقتصادی یا قابلیت تعمیم آن اثبات نشده است.

## Coverage and limits

16 fresh replay runs = four variants × two folds × two cost levels. Baseline ledger/curve parity with the previous 400-day sensitivity passed. Shared 74 logical tests are documented in the general report; they are not 74 Spot profit tests.

Prior RSI/BB, Donchian/MACD, VWAP/ADL, TSF/BOP, Williams/Stochastic and ADX/Ichimoku admission-filter results remain prior evidence, not newly executed here. Full Range/Swing, SAR/CCI, Klinger/Mass, Grid/StepGrid and Spot trailing were NOT economically tested; no profitability assertion is made for them.

No new DCA engine, risk change, UI, API, order path, allocation setting or application source was modified. Research configuration cannot reach Production.

## Artifacts and safety

Full protocol, source/data hashes, portfolio metrics, test commands and file inventory: `reports/general/spot-engine-primitives-evaluation-2026-10-09.md` and `reports/general/spot-engine-primitives-evidence-2026-10-09.json`.

Application build NOT_RUN (no app changes). App commit NONE; app push/CI/deployment NO. Production, DB, Worker and exchange/account/order/position actions: zero. Reports-only publication is separate.

```text
SPOT_IMPROVEMENT_PROVEN=NO
SPOT_CANDIDATE_FOR_PRODUCTION=NONE
SPOT_NEXT_RESEARCH=Independent larger-sample weekday-filter validation
```
