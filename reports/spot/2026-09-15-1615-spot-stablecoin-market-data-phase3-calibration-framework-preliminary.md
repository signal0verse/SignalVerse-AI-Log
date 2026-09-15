# Phase 3 — Stablecoin Market Data Calibration Framework (Design + Preliminary, Read-Only)

## Metadata

- Date: 2026-09-15 (session continued)
- Task ID: (none assigned by user)
- Module: spot (Historical Stablecoin Market Observation Dataset — calibration analysis)
- Mode: **Read-only analysis + framework design.** No code changed, no migration run, no Decision Engine/Risk Layer touched, no scheduler touched, no commit/push.
- Repository: signal0verse/signalverse-main
- Branch: main
- Commit: `0e407f8` (unchanged)
- Production: VPS `13.140.149.56` (SSH port `22123`), database `signalverse_cutover2`, PostgreSQL 17.11

## Objective

Design the Calibration Framework for the six eligible pairs and run it once against the real, currently-available dataset to prove it works — **not** to produce final thresholds. Per the task's own governing rule, anywhere the data doesn't genuinely support a number, this report says `INSUFFICIENT_HISTORICAL_DATA` instead of guessing.

**Headline finding, stated up front:** the Collector has been running continuously and healthily (confirmed: zero failures, zero gaps) since `2026-09-15T15:26:41Z`. As of this analysis it is `2026-09-15T16:08:19Z` — **the dataset currently covers ~42 minutes, not weeks.** Nearly every metric below is therefore `INSUFFICIENT_HISTORICAL_DATA` for a *final* threshold, by design and as expected. This report exists to prove the framework is correct and ready, and to state exactly what is still needed.

---

## 0. Pre-Implementation Review (read-only, no changes)

### `stablecoin_pair_snapshots` schema
Confirmed: 48 columns, 3 indexes (`pkey` on `id`; `idx_stablecoin_pair_snapshots_lookup (pair, captured_at DESC)` — the one this whole calibration framework's queries rely on for cheap per-pair time-range scans; `idx_stablecoin_pair_snapshots_unique_tick UNIQUE (pair, captured_at)` — duplicate protection). No schema change made or needed.

### Collector (`api/stablecoin-market-data-collector.ts`)
Re-confirmed (no changes): writes exactly one row per pair per tick to `stablecoin_pair_snapshots` only; fee is fail-closed, never fabricated; `captured_at` is per-pair; every field this calibration reads (`deviation_bps`, `spread_bps`, `bid_depth_5/20`, `ask_depth_5/20`, `imbalance_5/20`, `bid/ask_depth_concentration`, `exec_buy/sell_{1000,2500,5000,10000}_{usd,vwap,fully_filled}`, `fee_verified`, `fee_bps`, `raw_top20_levels`) is genuinely populated (verified below, not assumed).

### Decision Engine (`api/stablecoin-engine.ts`) — read-only review
Confirmed **zero references** to `stablecoin_pair_snapshots`, `RiskTier`, `risk_tier`, or `peg` anywhere in this file (grep-verified). The engine's only existing "deviation" concept is a live, per-trade `computeGrossSpreadPct()` computed from a fresh VWAP quote at decision time — entirely independent of the snapshot history. **This confirms the isolation this project has maintained since Phase 2 is still fully intact**: there is currently no code path anywhere that a future Risk Layer would need to be *removed from* — it would be purely additive, a new function consuming calibrated thresholds, called from the existing decision pipeline. This report does not create that function; it only maps where it would eventually plug in (see Section 12, No-Lookahead).

---

## 1. Dataset Coverage

| Property | Value |
|---|---|
| Total rows | **210** (growing continuously — timer confirmed `active`, zero failures, zero gaps throughout) |
| Time range | `2026-09-15T15:26:41Z` → `2026-09-15T16:08:19Z` (**~42 minutes**) |
| Pairs covered | 6 (`TUSDUSDT, USDCUSDT, FDUSDUSDT, FDUSDUSDC, USD1USDT, USD1USDC`) — dynamically discovered, matches Binance's current TRADING set exactly, no hardcoding |
| Rows per pair | 35 each (perfectly even — confirms zero pair has ever been skipped or failed) |
| Tick cadence observed | ~60-65 seconds, consistent, zero missed ticks (see `reports/spot/2026-09-15-1700-...permanent-60s-activation-verified.md` for the full 12-tick timing proof; collection has continued cleanly since) |

**This is nowhere near the 2-4 week checkpoint** referenced in the original Phase 1 design (`reports/spot/2026-09-15-1036-...data-collection-plan-design-only.md`). Every downstream section reflects this honestly.

---

## 2. Pair-by-Pair Statistics (preliminary, n=33-35 per pair, ~42 minutes)

| Pair | n | Distinct mid_price values | Distinct bid values | Distinct ask values |
|---|---|---|---|---|
| USDCUSDT | 35 | **9** | 9 | 8 |
| USD1USDT | 35 | 4 | 4 | 4 |
| TUSDUSDT | 35 | 3 | 2 | 2 |
| FDUSDUSDC | 35 | 2 | 2 | 2 |
| USD1USDC | 35 | 2 | 2 | 2 |
| FDUSDUSDT | 35 | **1** | 1 | 1 |

**This is the single most important finding in this report.** For most pairs, the top-of-book has changed only 1-4 times in 42 minutes of continuous observation. `FDUSDUSDT`'s best bid/ask has **not moved at all** in this entire window. This is not a collector bug (order books were fetched and validated successfully every single tick — see the 100% success rate above) — it is a genuine, real observation about how infrequently these specific books update at the top level. It directly means: **any volatility or deviation-percentile calculation computed today would mostly be measuring quantization noise from a handful of discrete states, not a real statistical distribution.** `USDCUSDT` is the clear exception — 9 distinct states in the same window, consistent with its already-known status as the most liquid pair.

---

## 3. Price Deviation Calibration (per-pair, preliminary — NOT final)

| Pair | n | min (bps) | max (bps) | mean (bps) | P50 | P90 | P95 | P99 | std |
|---|---|---|---|---|---|---|---|---|---|
| USDCUSDT | 35 | 4.40 | 5.25 | 4.75 | 4.65 | 5.03 | 5.25 | 5.25 | 0.216 |
| USD1USDT | 35 | -0.45 | -0.05 | -0.14 | -0.15 | -0.05 | -0.05 | -0.05 | 0.086 |
| TUSDUSDT | 35 | -4.50 | -3.50 | -3.85 | -3.50 | -3.50 | -3.50 | -3.50 | 0.468 |
| USD1USDC | 35 | -5.50 | -4.50 | -4.74 | -4.50 | -4.50 | -4.50 | -4.50 | 0.429 |
| FDUSDUSDT | 35 | -9.50 | -9.50 | -9.50 | -9.50 | -9.50 | -9.50 | -9.50 | **0.000** |
| FDUSDUSDC | 35 | -14.50 | -13.50 | -14.47 | -14.50 | -14.50 | -14.50 | -13.82 | 0.171 |

**Every one of these ranges is INSUFFICIENT_HISTORICAL_DATA as a threshold.** With only 1-9 distinct underlying states per pair, a "P99" here is not a statistical percentile in any meaningful sense — it is just "the highest of a small number of repeated readings." No Normal/Elevated/Critical range is proposed from this table.

**Historical-reference comparison (directional sanity check only, not a re-validation):**
- The prior calibration report (`reports/spot/2026-09-15-1021-...`) found FDUSD trading persistently at **-12 to -16 bps** structurally. Today's live reading: FDUSDUSDT at -9.5 bps, FDUSDUSDC at ~-14.5 bps. **Directionally consistent** (both negative, same order of magnitude, FDUSDUSDC within the previously-observed band) — but **cannot be statistically re-confirmed** from 35 samples of a book that barely moves. Treat as "not contradicted," not "confirmed."
- USDCUSDT's prior "very liquid" characterization is **supported** by today's data (most distinct states, tightest relative spread — see Section 4).
- The TUSD **+139 bps in 48h event** and the FDUSD **12-16 bps structural deviation** as a *validated range* both remain **NOT re-confirmable** with today's ~42-minute window — that event, by definition, requires observing across a comparable multi-hour/day timescale, which does not yet exist in this dataset. No occurrence of anything resembling that event was seen (expected — the window is far too short to expect a rare event to recur).

---

## 4. Spread Calibration (preliminary)

| Pair | min | max | mean | P50 | P95 |
|---|---|---|---|---|---|
| USD1USDT | 0.100 | 0.100 | 0.100 | 0.100 | 0.100 |
| USDCUSDT | 0.100 | 0.200 | 0.103 | 0.100 | 0.100 |
| USD1USDC | 1.000 | 1.001 | 1.000 | 1.000 | 1.001 |
| FDUSDUSDT | 1.001 | 1.001 | 1.001 | 1.001 | 1.001 |
| FDUSDUSDC | 1.001 | 1.001 | 1.001 | 1.001 | 1.001 |
| TUSDUSDT | 1.000 | 2.001 | 1.030 | 1.000 | 1.000 |

Consistent with Section 3's finding: spread is essentially quantized to 1-2 discrete values per pair over this window (a direct consequence of the book barely updating). USDCUSDT and USD1USDT show the tightest, most Binance-typical spreads (0.1 bps); the other four sit near a structural ~1 bps minimum tick-driven floor for these pairs. **INSUFFICIENT_HISTORICAL_DATA for a P95/P99-based threshold** — the same handful of values repeat.

**Spread-vs-depth/deviation relationship**: not computed as a real correlation this round — with 1-9 distinct values per pair, a correlation coefficient would be a statistical artifact, not a real signal. This is flagged as a metric requiring a much larger dataset (see Section 10).

---

## 5. Volatility Calibration

**`INSUFFICIENT_HISTORICAL_DATA` for all 6 pairs, explicitly.** Short-term and rolling volatility both require enough tick-to-tick returns to be more than the same 1-9 discrete price levels repeating. No fabricated volatility number is produced. Once the dataset spans hours-to-days, this becomes computable directly from `mid_price`/`deviation_bps` tick returns already stored — no new collector field is needed.

---

## 6. Order Book Depth Calibration (preliminary — genuinely informative despite the short window)

Unlike price/spread, **depth is already showing real, large, genuine movement** — because depth-side liquidity provision changes far more often than the best price itself.

| Pair | bid_depth_5 min | bid_depth_5 max | ask_depth_5 min | ask_depth_5 max | imbalance_5 (mean) | bid concentration (mean) | ask concentration (mean) |
|---|---|---|---|---|---|---|---|
| USDCUSDT | 6.04M | 15.29M | 2.49M | 19.96M | 0.115 | 0.092 | 0.094 |
| FDUSDUSDT | 2.70M | 3.24M | 0.96M | 1.36M | 0.411 | 0.040 | 0.029 |
| TUSDUSDT | 0.61M | 0.70M | 10.8K | 11.9K | **0.965** | 0.055 | 0.004 |
| USD1USDC | 2.23M | 2.54M | 2.03M | 2.38M | 0.072 | 0.109 | 0.052 |
| USD1USDT | 0.52M | 1.00M | 0.46M | 0.95M | 0.005 | 0.022 | 0.028 |
| FDUSDUSDC | 0.19M | 0.67M | 0.20M | 0.60M | -0.010 | 0.104 | 0.012 |

**TUSDUSDT's extreme, persistent imbalance (mean 0.965, essentially maximal bid-heavy)** is real and consistent with its already-known thin ask-side liquidity (ask_depth_5 is only ~$11K vs. ~$650K on the bid side) — this matches the prior calibration report's characterization of TUSDUSDT as structurally weaker/more one-sided. This is a genuine, reproducible structural observation, not noise — **candidate for Tier consideration once more data exists (see Section 9)**, but 42 minutes is not enough to call it "always" true.

**Tick-to-tick depth-change extremes** (largest single 60-second swing observed):
| Pair | worst drop | best jump |
|---|---|---|
| FDUSDUSDC | -61.4% | +10.7% |
| USDCUSDT | -36.6% | **+62.4%** |
| USD1USDT | -29.9% | +40.8% |
| FDUSDUSDT | -10.0% | +5.2% |
| USD1USDC | -4.5% | +5.3% |
| TUSDUSDT | -0.02% | +14.8% |

**This reproduces and extends the prior calibration finding** ("a real 17% depth-change was observed in just 75 seconds for USDCUSDT itself") — today's window already shows an even larger 62% single-tick swing for USDCUSDT. This is strong, real, repeated evidence supporting the earlier conclusion that **any depth-change-based Market Shock threshold must be set loose** (a same-pair, healthy, non-shock tick can already swing 30-60%). `INSUFFICIENT_HISTORICAL_DATA` to set the actual cutoff number yet (need to see the full distribution of swings over days, not just the extremes from 34 transitions per pair), but the *qualitative* conclusion ("loose, not tight") is now supported by two independent observation windows.

---

## 7. Executable Liquidity

**Fully populated, zero gaps**: all 6 pairs have non-null `exec_buy/sell_{1000,2500,5000,10000}_{usd,vwap,fully_filled}` on all 35 rows each (210/210 rows, 100%). Every observed tick so far fully filled all four notional sizes on both sides for all 6 pairs (`fully_filled=true` universally in this window) — meaning no pair has yet shown a $10,000 order failing to fill from the top 100 levels. This is a genuinely useful, positive data point (execution risk at these sizes appears low for all 6 pairs so far) but is `INSUFFICIENT_HISTORICAL_DATA` to declare a guaranteed floor — a 42-minute window cannot rule out a rare liquidity-collapse tick that has simply not occurred yet.

---

## 8. Market Shock Candidates (two independent paths, candidates only)

### Path 1 — Price Path (critical deviation + worsening direction)
- **Observed data**: no deviation reading in this window came close to the historical TUSD +139bps reference event; the largest single-pair range seen was FDUSDUSDC's ~1bps spread within its already-structural ~-14.5bps level.
- **Candidate threshold**: none proposed. `INSUFFICIENT_HISTORICAL_DATA` — a "worsening direction" concept requires multiple consecutive readings trending the same way over a meaningful horizon; 35 ticks dominated by 1-9 discrete price states cannot support this.
- **Occurrences**: 0.
- **Confidence**: N/A (no candidate).

### Path 2 — Depth Path (severe depth deterioration + severe selling pressure)
- **Observed data**: real depth swings of -61% (FDUSDUSDC) and -36.6% (USDCUSDT) occurred in this window, none coinciding with a directional price move of note (spot-checked: FDUSDUSDC's -61% bid-depth drop tick did not correspond to a deviation_bps change beyond its normal ~1bps band) — i.e., these look like normal liquidity-provider churn, not a shock.
- **Candidate threshold**: a rough, non-final candidate for future validation: "depth drop beyond ~-60% in one tick AND simultaneous adverse price move beyond the pair's own established normal band" — explicitly a **strawman for the next checkpoint to test against a much larger sample**, not a value to configure anywhere.
- **Occurrences of a *combined* price+depth shock**: **0** observed so far.
- **Confidence**: LOW (single-digit-hours of data; the two independent large depth swings seen were not accompanied by a price shock, which is itself informative but not sufficient to calibrate a joint threshold).

**No cutoff from this section is to be treated as final.**

---

## 9. Dynamic Risk Tier Candidates (directional only, NOT final)

| Pair | Observed depth (bid_depth_5 range) | Distinct price states (proxy for update frequency) | Imbalance character | Directional candidate |
|---|---|---|---|---|
| USDCUSDT | Very deep (6-15M) | High (9) | Balanced (~0.1) | Historically "Tier 1-like" — **supported**, not newly proven |
| USD1USDC | Moderate-deep (2.2-2.5M) | Low (2) | Balanced (~0.07) | Historically "mid-tier" — **not contradicted** |
| FDUSDUSDT | Deep (2.7-3.2M) | **Lowest possible (1)** | Bid-heavy (~0.41) | Historically "mid-tier" — depth looks strong, but the near-zero price update frequency is itself a new observation worth tracking, not previously highlighted this starkly |
| USD1USDT | Thin-moderate (0.5-1.0M) | Low (4) | Balanced (~0.0) | Historically "weaker" — **not contradicted** |
| FDUSDUSDC | Thin (0.19-0.67M) | Low (2) | Roughly balanced (-0.01) | Historically "weaker" — **not contradicted** |
| TUSDUSDT | Moderate bid (0.6-0.7M), **very thin ask (~11K)** | Low (3) | **Extreme (0.965)** | Historically "weaker/different" — **strongly supported**, the ask-side thinness is dramatic and real |

**No Tier 1/2/3 assignment is finalized.** Trading volume data is not available from this Dataset or any currently-connected source (out of scope for this Collector, which observes order books/fees only — flagged, not solved, here). Peg-stability and mechanism/history factors require the multi-week horizon this dataset doesn't yet have. Today's numbers are consistent with — and in TUSDUSDT/USDCUSDT's cases, further reinforce — the qualitative groupings from the prior calibration report, but none of it should be encoded as a Tier constant yet.

---

## 10. Data Sufficiency

| Metric | Snapshots available | Time range | Pairs | Observations/pair | Sufficient for threshold? | Confidence |
|---|---|---|---|---|---|---|
| Price deviation percentiles | 210 | 42 min | 6 | 33-35 | **NO** | LOW |
| Volatility (any horizon) | 210 | 42 min | 6 | 33-35 | **NO** | LOW |
| Spread distribution | 210 | 42 min | 6 | 33-35 | **NO** | LOW |
| Depth level (point-in-time) | 210 | 42 min | 6 | 33-35 | Directionally useful | MEDIUM (for ranking, not thresholds) |
| Depth-change magnitude (qualitative "loose not tight") | 210 (34 transitions/pair) | 42 min | 6 | 34 | Directionally useful, reproduces prior finding | MEDIUM |
| Executable liquidity floor | 210 | 42 min | 6 | 33-35 | **NO** (positive so far, can't rule out rare failure) | LOW |
| Market Shock (either path) | 210 | 42 min | 6 | 0 shock occurrences | **NO** | LOW (no candidate to even have confidence in) |
| Dynamic Risk Tier | 210 | 42 min | 6 | 33-35 | **NO** (directional only) | LOW-MEDIUM |

**`INSUFFICIENT_HISTORICAL_DATA` applies to every metric intended to become a real, configured threshold.** This is the expected, correct outcome for a 42-minute-old dataset and is not a problem with the Collector or this framework — it is exactly why this task was scoped as "framework + preliminary," not "final calibration."

---

## 11. Confidence Levels (summary)

- **HIGH confidence, nothing**: no metric in this report has enough data for HIGH confidence.
- **MEDIUM confidence**: depth-level ranking between pairs (which pairs are relatively deep vs. thin) and the qualitative "depth swings are large and normal, not just during shocks" conclusion — both reproduce/extend prior, independently-gathered findings.
- **LOW confidence**: everything else (deviation ranges, spread ranges, imbalance/concentration means, Risk Tier candidates, Market Shock candidates).

---

## 12. Backtest / Replay Readiness

**Not ready.** Concretely missing:
- **Time span**: need days-to-weeks, not minutes — the original Phase 1 design's own 2-4 week checkpoint target is treated here as the goal, not as data in hand.
- **Genuine price-update events**: for 5 of 6 pairs, need enough elapsed time to observe more than a handful of discrete book states — this is a stronger requirement than "enough rows," since rows accumulate every 60s regardless of whether the book actually moved.
- **At least one real Market Shock candidate occurrence** (or a confident, evidence-based statement that none occurred in N weeks) — cannot backtest a shock-detection path against zero examples of either a shock or a confirmed non-shock baseline distribution.
- **Cadence**: current 60-second cadence is adequate and should not change — the gap is purely elapsed wall-clock time, not sampling frequency.
- **Metrics to keep collecting**: no schema change needed; every field this analysis used is already collected. The one gap noted (trading volume) is out of scope for this Collector and would need a separate, explicitly-approved data source if ever required.

---

## 13. No-Lookahead Validation

The Collector writes exclusively to `stablecoin_pair_snapshots`; the live Decision Engine (`api/stablecoin-engine.ts`) reads exclusively from live Binance calls at decision time and has zero references to this table (Section 0). **These two paths are already fully separated today** — there is no possibility of a future calibration accidentally leaking into a live decision, because no wiring between them exists yet at all. When a Risk Layer is eventually built, the no-lookahead discipline that will matter is: any calibrated threshold must be derived only from snapshot rows with `captured_at` strictly earlier than the historical window being backtested/replayed against — a standard, well-understood requirement this report flags for that future phase's own design, not something to implement now.

---

## 14. Production Query / Performance Impact

All queries in this report were run directly against production via `psql`, timed:
- The heaviest query (per-pair deviation percentiles, 6 groups, ~35 rows/group) completed in **47ms**.
- All other aggregate queries (spread, depth, imbalance, concentration, executable-liquidity population, LAG-based tick-to-tick depth-change) completed in well under 100ms each.
- No `EXPLAIN` showed a sequential scan of concern — `idx_stablecoin_pair_snapshots_lookup (pair, captured_at DESC)` already covers every per-pair time-ordered access pattern this framework needs.

**At current data volume, calibration queries are trivial for production.** This will need re-checking once the dataset reaches weeks of history (tens of thousands of rows) — likely still fine given the index, but not re-verified here since that data doesn't exist yet. **No index or schema change was made or is being requested in this task.**

---

## 15. Recommended Next Step

1. **Do nothing further to the Decision Engine, Risk Layer, or Scheduler** — this task's own scope ends here.
2. **Let the Collector keep running** exactly as-is (60s cadence, `signalverse-stablecoin-collector.timer` unchanged) — it is healthy and this is the only way to accumulate the needed history.
3. **Re-run this exact framework at meaningful checkpoints** (a natural first one: 24-48 hours, to see the first genuine day/night liquidity cycle; the real target remains the original 2-4 week checkpoint for anything resembling a final threshold).
4. **Do not build the Risk Layer's consumption code yet** — Section 0 confirms there is nothing to wire it into prematurely, and doing so before real thresholds exist would only invite exactly the "fabricated threshold" outcome this whole phase was designed to prevent.

---

## Final Table (as requested)

| Metric | Pair | Observations | Time Range | Candidate Threshold | Confidence | Finalized? |
|---|---|---|---|---|---|---|
| Price deviation (bps) | USDCUSDT | 35 | 42 min | INSUFFICIENT_HISTORICAL_DATA | LOW | No |
| Price deviation (bps) | USD1USDT | 35 | 42 min | INSUFFICIENT_HISTORICAL_DATA | LOW | No |
| Price deviation (bps) | TUSDUSDT | 35 | 42 min | INSUFFICIENT_HISTORICAL_DATA | LOW | No |
| Price deviation (bps) | USD1USDC | 35 | 42 min | INSUFFICIENT_HISTORICAL_DATA | LOW | No |
| Price deviation (bps) | FDUSDUSDT | 35 | 42 min | INSUFFICIENT_HISTORICAL_DATA | LOW | No |
| Price deviation (bps) | FDUSDUSDC | 35 | 42 min | INSUFFICIENT_HISTORICAL_DATA | LOW | No |
| Volatility (any) | all 6 | 35 | 42 min | INSUFFICIENT_HISTORICAL_DATA | LOW | No |
| Spread (bps) | all 6 | 35 | 42 min | INSUFFICIENT_HISTORICAL_DATA | LOW | No |
| Depth ranking (relative) | all 6 | 35 | 42 min | Directional only (see Section 9) | MEDIUM | No |
| Depth-change magnitude (qualitative) | USDCUSDT, FDUSDUSDC | 34 transitions | 42 min | "Loose, not tight" (qualitative, no number) | MEDIUM | No |
| Executable liquidity floor | all 6 | 35 | 42 min | INSUFFICIENT_HISTORICAL_DATA | LOW | No |
| Market Shock — Price Path | all 6 | 0 occurrences | 42 min | INSUFFICIENT_HISTORICAL_DATA | LOW | No |
| Market Shock — Depth Path | all 6 | 0 combined occurrences | 42 min | INSUFFICIENT_HISTORICAL_DATA (strawman only) | LOW | No |
| Dynamic Risk Tier | all 6 | 35 | 42 min | Directional only (see Section 9) | LOW-MEDIUM | No |

---

## نتیجه‌یِ نهایی

```
CALIBRATION FRAMEWORK: DESIGNED AND VALIDATED AGAINST REAL DATA
FINAL THRESHOLDS: NONE PRODUCED (INSUFFICIENT_HISTORICAL_DATA, as expected for a 42-minute dataset)
RISK LOGIC / DECISION ENGINE: UNCHANGED, UNCONNECTED
```

چارچوبِ Calibration طراحی و با موفقیت رویِ داده‌یِ واقعی (نه ساختگی) اجرا شد؛ همه‌یِ Queryها سبک و سریع بودند (کمتر از ۱۰۰ میلی‌ثانیه). یافته‌یِ اصلی: مجموعه‌داده فعلاً فقط ~۴۲ دقیقه است، بنابراین طبقِ قاعده‌یِ صریحِ همین فاز، **هیچ Threshold نهایی تولید نشد** — همه‌جا صادقانه `INSUFFICIENT_HISTORICAL_DATA` اعلام شد. دو یافته‌یِ واقعی و قابلِ‌اتکا با این حال به‌دست آمد: (۱) نوسانِ عمقِ Order Book در بازه‌هایِ ۶۰ثانیه‌ای می‌تواند تا ۶۲٪ باشد (تاییدِ مجددِ یافته‌یِ قبلی)، و (۲) TUSDUSDT عدمِ توازنِ شدید و پایدار در سمتِ Ask دارد. هیچ Commit/Push، هیچ تغییرِ Schema/Index، و هیچ اتصالی به Decision Engine/Risk Layer انجام نشد.
