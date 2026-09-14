# Prediction Market Autonomous Engine — One-Week Production Forensic Audit

## Metadata

- Date: 2026-09-14
- Task ID: prediction-one-week-forensic-audit-2026-09-14
- Module: prediction
- Mode: **READ-ONLY forensic audit** — no code, config, threshold, gate, or scheduler change of any kind; no writes of any kind to production beyond the pre-existing read-only credential already used by prior audits in this series.
- Repository (code): signal0verse/signalverse-main (private) — inspected, not modified
- Database: production `signalverse_cutover2` via PostgREST (`DATABASE_API_URL`/`DATABASE_SERVICE_ROLE_KEY`), read via `.select()` calls only — no insert/update/delete/upsert issued anywhere in this task
- Deployed commit at time of audit: not re-verified via SSH in this task (explicitly out of scope — read-only DB + collaboration-log review only); the most recent prior report (`2026-09-10-0228-...`) recorded production at `035e3303106a61a4574d6855c3f06016c76750d0`

## Objective

Determine, with real production evidence rather than speculation, why the Autonomous Prediction Engine has produced **zero** `OPPORTUNITY`/`STRONG_OPPORTUNITY` decisions and opened zero positions (shadow or real) since Discovery + Shadow Entry went live, and rank the actual causes. Explicitly not authorized to fix, tune, or deploy anything as part of this task.

---

## 1. Collaboration Log Reviewed First

Read in full before any data pull, from `signal0verse/SignalVerse-AI-Log`, `reports/prediction/`:

- `2026-09-09-1756-prediction-phase7a-discovery-only-activation.md`
- `2026-09-09-2133-prediction-phase7b1-shadow-entry-observation.md`
- `2026-09-09-2249-prediction-phase7b2-monitoring-observability-audit.md`
- `2026-09-09-2353-prediction-final-release-vps-deployment.md`
- `2026-09-10-0228-prediction-observability-migration-activation-and-verification.md` (latest available)

Key context those reports establish and this audit treats as historical background, not re-litigated:

- Only two scheduler gates have ever been enabled for Prediction: `prediction-discovery-cron` and `prediction-shadow-entry-cron`. **No `entry_real`, `resolve`, or `learn` gate has ever existed in `jobs.d`.** This audit's own data independently reconfirms this (Section 3) — it is not merely repeated from the prior report.
- The observability migration (`prediction_market_observability.sql`) was applied on 2026-09-09, followed immediately by a genuine production bug (an FK-ordering crash in `entry_shadow`, ~18:05–18:25 UTC) that was root-caused and hotfixed same-day (commit `2f23e4a`, PR #31, merged as `035e330`). Per-candidate columns (`liquidity`, `spread_pct`, `tradeability_eligible`, `tradeability_reasons`, `used_ai_recheck`, `would_open`, `rank`, `kelly_recommended_usdc`, `run_id`) are only reliably populated **after** that hotfix (~18:26:04 UTC, 2026-09-09) — this audit uses that as the "fully-instrumented" cutover (see Section 2) rather than treating pre-hotfix rows as if those columns meant "null = no order book."
- `prediction_autonomous_trades` was confirmed at 0 rows in every prior report. This audit re-confirms 0 rows independently, live, in Section 16.

---

## 2. Observation Window

Determined directly from `prediction_autonomous_runs` (the table did not exist before the observability migration, so its first row **is** the start of tick-level observability) and cross-checked against `prediction_predictions.ts`:

| Boundary | Value (UTC) |
|---|---|
| First `prediction_autonomous_runs` row (any type) | 2026-09-09T18:05:50.831Z |
| First **fully-instrumented** row (`run_id` populated) | 2026-09-09T18:26:04.641Z |
| Last row in window (both tables agree to the minute) | 2026-09-14T11:46:03–08Z |
| **Total window** | **113.7 hours / 4.74 days** |

**This is NOT a full 7-day window and this report does not claim it is.** The user's framing of "approximately one week" is honored as "approximately" — Discovery/Shadow Entry have been live for **4.74 days** of continuous, healthy operation, not 7. All funnel/decision statistics below use the **fully-instrumented population** (`ts >= 2026-09-09T18:26:04Z`), n = **67,760** autonomous evaluation rows, unless stated otherwise. 1,204 earlier rows (13:16–18:26 UTC on 2026-09-09, pre-hotfix) exist in `prediction_predictions` but are excluded from tradeability/liquidity/rank-dependent stats because those specific columns did not yet exist at insert time for those rows (their `NULL` there means "column didn't exist yet," not "no order book" — a distinction this audit will not blur).

---

## 3. Production Health First (Tick-Level)

Directly from `prediction_autonomous_runs`, grouped by `run_type`:

| run_type | rows | success | fail | success % | avg dur (ms) | p50 | p95 | max | expected ticks (5-min cadence) | missing | max consec. failures | gaps >15min |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **discover** | 1,359 | 1,359 | 0 | **100.0%** | 5,912 | 4,718 | 11,910 | 22,522 | 1,364 | ~5 | 0 | 1 (20.6 min) |
| **entry_shadow** | 1,359 | 1,356 | 3 | **99.8%** | 4,658 | 4,416 | 7,891 | 19,477 | 1,364 | ~5 | 3 (consecutive) | 1 (20.6 min, same gap) |
| entry_real | **0 rows** | — | — | — | — | — | — | — | — | — | — | — |
| resolve | **0 rows** | — | — | — | — | — | — | — | — | — | — | — |
| learn | **0 rows** | — | — | — | — | — | — | — | — | — | — | — |

- The only 3 `entry_shadow` failures are the already-known, already-fixed FK-ordering crash (`Cannot read properties of null (reading 'id')`) from the observability-migration hotfix window on 2026-09-09, all 3 consecutive, none since.
- Tick cadence is healthy: ~99.6% of expected 5-minute ticks actually ran for both active gates; the one >15-minute gap (20.6 min, both types simultaneously) coincides with the hotfix deploy window and is explained, not a mystery.
- **Confirmed independently (not just cited from the prior report): `entry_real`, `resolve`, and `learn` have never produced a single row in `prediction_autonomous_runs` — these ticks have never run automatically, at any point, in this window.** This is a scheduler-configuration fact, verified from the run-tracking table itself, and it materially matters for Section 15 and the root-cause ranking (Section 18).

**Verdict: engine tick execution is healthy.** The zero-opportunity outcome is not an uptime/crash/scheduler-reliability problem for the two gates that are actually enabled.

---

## 4. Discovery Funnel — Full Window

From `discover` tick summaries (`{discovered, eligible, filteredOut}` per tick), summed:

| Day (UTC) | ticks | discovered | eligible | filteredOut |
|---|---|---|---|---|
| 2026-09-09 | 70 | 15,408 | 2,385 | 13,023 |
| 2026-09-10 | 288 | 65,342 | 9,446 | 55,896 |
| 2026-09-11 | 288 | 64,899 | 11,012 | 53,887 |
| 2026-09-12 | 283 | 64,839 | 9,518 | 55,321 |
| 2026-09-13 | 288 | 65,261 | 8,259 | 57,002 |
| 2026-09-14 (partial) | 142 | 32,658 | 4,254 | 28,404 |
| **TOTAL** | **1,359** | **308,407** | **44,874** | **263,533** |

**Critical caveat, stated explicitly rather than left implicit**: `discovered` here is **not unique markets** — Discovery re-scans the same top-N-by-24h-volume markets per category on every 5-minute tick (`fetchGammaMarketsByCategory(category, 20)`, `upsert` by `condition_id`). The actual distinct-market universe the engine has ever touched is **1,974 rows total** in `prediction_markets`, of which **1,538 were newly created inside this window**. The 308,407 figure is repeat-scan volume, not discovery breadth — reporting it as "308K markets seen" without this caveat would be misleading, so it is flagged here.

Current (mutable, live-snapshot) `candidate_status` distribution across all 1,974 tracked markets:

| candidate_status | count |
|---|---|
| FILTERED_OUT | 1,643 |
| ELIGIBLE | 268 |
| null (never scanned to completion / new) | 63 |

Current `eligibility_reason` among `FILTERED_OUT` (snapshot, mutable — the reason reflects the most recent scan only, not a time series):

| reason | count |
|---|---|
| TIME_HORIZON_TOO_SOON | 1,251 |
| TIME_HORIZON_TOO_FAR | 256 |
| LOW_LIQUIDITY | 133 |
| TIME_HORIZON_UNKNOWN | 3 |

By category × candidate_status (current snapshot):

| category | FILTERED_OUT | ELIGIBLE | null |
|---|---|---|---|
| sports | 1,122 | 232 | 22 |
| crypto | 310 | 30 | 14 |
| science | **105** | **0** | 0 |
| politics | 104 | 6 | 1 |
| economics | 2 | 0 | 0 |
| (no category) | — | — | 26 |

**Finding**: `science` has never once produced an ELIGIBLE candidate (105/105 filtered), `economics` never has either (2/2), and `culture` never appears in `prediction_markets` at all despite being in `SCAN_CATEGORIES`. Of the 6 scanned categories, only **sports, crypto, and politics** ever reach Shadow Entry in practice — this is a real, verified constraint on the candidate universe, not an engine bug, but it means "6 categories scanned" overstates actual coverage; effectively 3 categories matter.

---

## 5. Shadow Entry Funnel — Full Window

Tick-level (from `entry_shadow` summaries, 1,356 ticks with a recorded summary):

| metric | value |
|---|---|
| scanned per tick | **exactly 50, every tick** (avg 50.0, max 50) — this is the `.limit(50)` cap in the `candidate_status='ELIGIBLE'` query, with no `ORDER BY` |
| recorded per tick | 50 (100% of scanned candidates got a `recordPrediction` row — 0 `EVAL_ERROR`) |
| **wouldHaveOpened, summed over the whole window** | **0** |
| skipped-reason totals (tick-level) | `{"NOT_ACTIONABLE": 67,760}` — **no other skip reason ever fired** |

Per-candidate table (`prediction_predictions`, `telegram_id IS NULL`, fully-instrumented population, n = 67,760):

- Unique markets evaluated: **215** (against a live-eligible pool that has held 268–~300 markets over the window)
- Evaluations per market: mean 315.2, **median 46**, max **1,356** (one market was evaluated on literally every single tick) — heavily right-skewed. The un-ordered `.limit(50)` query means some markets dominate every tick's 50 slots while others in the eligible pool are evaluated far less often; this is a real, verifiable rotation-fairness gap, though (see Section 18) it is not the reason opportunities are zero.
- Evaluations per day: 2026-09-09: 3,310 · 09-10: 14,400 · 09-11: 14,400 · 09-12: 14,150 · 09-13: 14,400 · 09-14 (partial): 7,100
- Evaluations per category: **sports 60,269 (89.0%)**, crypto 4,477 (6.6%), politics 3,014 (4.4%). Economics/science/culture: **0** (never ELIGIBLE, see Section 4).

**Decision distribution (count, % of 67,760):**

| decision | count | % |
|---|---|---|
| INSUFFICIENT_DATA | 59,767 | **88.2%** |
| AVOID | 7,414 | 10.9% |
| WATCH | 579 | 0.9% |
| NEUTRAL | 0 | 0.0% |
| **OPPORTUNITY** | **0** | **0.0%** |
| **STRONG_OPPORTUNITY** | **0** | **0.0%** |

Zero opportunities is confirmed at both the tick-summary level and the per-candidate level — two independent data sources agree exactly.

---

## 6. YES / NO Analysis

| chosen_side | n | % | actionable | avg confidence | avg market_probability | avg liquidity ($) | avg spread % |
|---|---|---|---|---|---|---|---|
| YES | 62,298 | 91.9% | 0 (0.0%) | 15.4 | 27.5% | 344,565 | 36.93% |
| NO | 5,462 | 8.1% | 0 (0.0%) | 19.7 | 60.2% | 250,678 | 31.01% |

Decision breakdown by side: YES = INSUFFICIENT_DATA 59,767 / AVOID 2,510 / WATCH 21. NO = AVOID 4,904 / WATCH 558.

**Both sides are being genuinely evaluated independently** (per the side-aware engine design) and **both are equally starved of opportunities** — 0.0% actionable on either side. The apparent YES/NO imbalance (92%/8%) is a direct consequence of `chooseBestSide()`'s tie-break rule (defaults to YES when neither side is actionable and scores are close) combined with YES being the side with `hasOrderBook=false` far more often (see Section 10) — it is not evidence that NO opportunities are being suppressed by an asymmetric evaluation; **YES and NO are treated identically by the decision engine** (`evaluateSide()` runs unchanged for both, confirmed by reading the source), and the imbalance is a downstream artifact of which side happens to have thinner data, not unequal treatment.

---

## 7. Time Horizon Analysis

Hours-to-resolution at the moment of *evaluation* (not discovery), bucketed:

| bucket | n | actionable |
|---|---|---|
| 5–7 days | 30,967 | 0 |
| 3–5 days | 26,285 | 0 |
| 2–3 days | 7,432 | 0 |
| 24–48h | 3,076 | 0 |
| outside 24h–7d (drift) | **0** | — |

**Finding**: the 24h–7d Time Horizon Gate is working exactly as designed — zero evaluated candidates ever drifted outside the intended window between discovery and evaluation, and the horizon distribution (weighted toward 3–7 days) is unremarkable. Time Horizon is **not** a bottleneck for opportunity generation — no bucket shows a materially different actionable rate because none show any actionable candidates at all.

---

## 8. Edge / EV Distribution

`spread_pct != null` is used as the verified proxy for "chosen-side order book existed" (`hasOrderBook`), since `spread_pct` is populated directly from `r.orderBook.spreadPct` for the chosen side inside `recordPrediction()` — confirmed by reading the source, not assumed.

- Rows **with** a chosen-side order book: 7,993 (11.8%)
- Rows **without** (the `INSUFFICIENT_DATA` majority): 59,767 (88.2%)

Among the 7,993 with a real order book:

| field | min | median | p75 | p90 | max |
|---|---|---|---|---|---|
| net_edge (pp) | -0.20 | 0.00 | 24.71 | 38.86 | 54.95 |
| net_ev | -28.60 | 34.56 | 43.62 | 60.46 | 70.78 |

By decision (order-book population only):

| decision | n | median edge | median EV | median confidence | median spread % | median liquidity | median res-risk score | % tradeable |
|---|---|---|---|---|---|---|---|---|
| AVOID | 7,414 | 0.00 | 32.79 | 15.0 | 18.18% | $34,847 | 60 | 39.7% |
| WATCH | 579 | 40.87 | 45.95 | 14.0 | 9.52% | $32,255 | 60 | 5.9% |
| OPPORTUNITY / STRONG_OPPORTUNITY | 0 | — | — | — | — | — | — | — |

**Top 20 candidates by |net_edge|** (all have a real order book) are dominated by single-strike Bitcoin/Ethereum price-threshold markets ("Will BTC be above $72,000 on Sept 16?"): net_edge 51–55pp, net_ev up to ~71, but **confidence only 14–60 (mostly 14–33)**, and `tradeability_eligible=false` for 19 of the 20 (reasons: `INSUFFICIENT_DEPTH`, `SPREAD_TOO_WIDE`). The one common thread across the entire top-20: **large nominal edge, low confidence, marginal-to-failing tradeability** — never a case of a clean high-confidence high-liquidity trade being blocked by one narrow technicality.

---

## 9. Gate Bottleneck Analysis

The tick's own instrumentation is definitive and blunt: **`skipped = {"NOT_ACTIONABLE": 67,760}` — no other skip key (`TIME_HORIZON_*`, `TRADEABILITY_*`, `DUPLICATE_POSITION`, `REVALIDATION_*`, `ZERO_KELLY_SIZE`) has ever fired, even once, in this entire window.** This is because the code only checks those later gates for candidates whose `decision` is already `OPPORTUNITY`/`STRONG_OPPORTUNITY` — and zero candidates have ever reached that point. **The real bottleneck is entirely upstream, inside `decide()` itself, before any Time Horizon/Tradeability/duplicate/sizing gate is ever consulted.**

Reproducing `decide()`'s branch logic against the persisted columns (in the code's actual check order; a branch requiring `quality.liquidityScore`, which is not a persisted column, is marked as such rather than guessed):

| classification | count | % |
|---|---|---|
| INSUFFICIENT_DATA: no order book (`spread_pct` null) | 59,767 | 88.2% |
| AVOID: spread > 16% (2× `maxSpreadPct`) | 3,788 | 5.6% |
| AVOID: `net_ev` < 0 | 3,540 | 5.2% |
| WATCH/NEUTRAL: confidence < 40 | 579 | 0.9% |
| AVOID: resolution `HIGH_RISK` | 86 | 0.1% |

(Rows can match multiple `decide()` conditions in principle; this table assigns each row to the first-checked condition it matches, matching the code's actual `if`/`else` short-circuit order.)

**Funnel, using only what the code actually measures (not an invented intermediate stage list that the engine doesn't itself compute):**

```
ALL EVALUATIONS                          67,760  (100%)
  ↓ has order book (chosen side)          7,993  (11.8%)   [88.2% lost: no CLOB book]
  ↓ passes decide()'s AVOID checks          579  (0.9% of 67,760 / 7.2% of 7,993)  [remaining 91.1% of order-book rows lost to AVOID]
  ↓ passes edge/confidence (WATCH exit)       0  (0.0%)   [100% of WATCH rows lost to confidence<40]
  ↓ Time Horizon gate (entry-tick)      never reached — 0 candidates got this far
  ↓ Tradeability gate (entry-tick)      never reached — 0 candidates got this far
  ↓ Final decision = OPPORTUNITY/STRONG      0  (0.0%)
```

---

## 10. INSUFFICIENT_DATA Forensics

All 59,767 `INSUFFICIENT_DATA` rows have `spread_pct = null` — **100% of INSUFFICIENT_DATA in this window is attributable to a missing chosen-side order book**, verified directly, not inferred: zero rows fall into the `market_quality_score < 25` or `resolution_status = 'INSUFFICIENT_INFORMATION'` branches of `decide()` instead.

By category:

| category | total evaluated | INSUFFICIENT_DATA | % |
|---|---|---|---|
| sports | 60,269 | 58,991 | **97.9%** |
| crypto | 4,477 | 33 | 0.7% |
| politics | 3,014 | 743 | 24.7% |

**Answer to the section's core question**: this is **overwhelmingly a Polymarket data-adequacy issue, not an over-strict engine requirement** — sports markets on Polymarket, at the volume/liquidity tier this engine's discovery surfaces, simply do not have live CLOB order books on the token being evaluated 97.9% of the time. The engine's own INSUFFICIENT_DATA threshold (`quality.overall < 25`) never even gets exercised for these rows because the harder, binary "is there a book at all" check fires first. Crypto (0.7%) shows the gate is not universally over-strict — when Polymarket genuinely has a book, the engine finds it and proceeds.

---

## 11. AI Funnel Analysis

| metric | value |
|---|---|
| candidates entering AI stage-2 recheck (`used_ai_recheck=true`) | 672 (1.0% of 67,760) |
| decision distribution among AI-rechecked candidates | WATCH 579, AVOID 93 |

AI recheck (`AUTONOMOUS_AI_FUNNEL_TOP_N = 10`) only ever applies to the top-10-by-|edge| stage-1 candidates per tick that are **not already** `AVOID`/`INSUFFICIENT_DATA`. Given Section 5's decision distribution, the only category that ever supplies such candidates is **crypto** (579 WATCH rows are 100% crypto, per Section 6-derived cross-tab) — **AI involvement is not, and structurally cannot be, the bottleneck**: stage-1 (pure math, free) already produces zero OPPORTUNITY/STRONG_OPPORTUNITY before AI is ever consulted, so AI has no candidates to promote or fail to promote past the actionable line in this window. This maps to option **(A)**: AI is rarely used because deterministic filters reject candidates first — not (B) overuse, and there is no evidence of (C) AI evidence insufficiency mattering here, since AI is barely in the loop at all.

---

## 12. Tradeability Analysis

`tradeability_eligible`/`tradeability_reasons` are persisted for **every** evaluated candidate (not only actionable ones — confirmed from source), so this can be measured across the full population:

| | count | % |
|---|---|---|
| tradeability_eligible = true | 2,981 | 4.4% |
| tradeability_eligible = false | 64,779 | 95.6% |

Rejection reasons (a row may carry more than one):

| reason | count |
|---|---|
| INSUFFICIENT_DEPTH | 64,779 |
| NO_ORDER_BOOK | 59,767 |
| SPREAD_TOO_WIDE | 4,312 |

**High-edge-but-untradeable check** (|net_edge| ≥ 20pp, has an order book): 2,361 such candidates exist; **2,327 of them (98.6%) are `tradeability_eligible=false`**, almost entirely for `INSUFFICIENT_DEPTH` and `SPREAD_TOO_WIDE`. This directly confirms the hypothesis this section asks about: a meaningful slice of the "big edge numbers" in Section 8's top-20 are **execution-quality mirages** — the book is too thin/too wide to actually fill a trade at anything near the quoted price, so the nominal edge is not a real capturable opportunity even where the decision engine's own AVOID/WATCH classification didn't already rule it out for other reasons.

---

## 13. Near-Miss Analysis

Top 50 non-actionable candidates by `opportunity_score` (range 68–69, all with a verified order book):

| | count |
|---|---|
| decision = WATCH | 45 |
| decision = AVOID | 5 |

Rejection reason (derived deterministically from `decide()`'s thresholds against the persisted fields — not guessed):

| reason | count |
|---|---|
| WATCH: confidence < 40 | 45 |
| AVOID: spread > 16% | 5 |

**Every single one of the top-15 near-miss candidates in detail is a Bitcoin single-strike-price market** ("Will the price of Bitcoin be above $72,000/$74,000 on September …") on the **NO** side, with net_edge 41–46pp, net_ev 41–47, **confidence pinned at 14–17**, spread 1.3–2.7% (tight), liquidity $23K–$34K, and — critically — **several of these rows have `tradeability_eligible=true`**. This is the cleanest, most concrete near-miss pattern in the whole dataset: real liquidity, real tight spread, real tradeable book, large nominal edge — and the **sole** thing standing between these and `OPPORTUNITY` is `confidence < 40`.

This directly answers the section's A-vs-B question for this specific, recurring pattern: it is **(B) — one gate (the confidence floor) blocking otherwise-tradeable candidates** — but see Section 18 for why this is not necessarily a mistuned gate: the confidence number itself is suspect (Section 14 explains why).

---

## 14. Market-vs-Engine Baseline

Grouped by category, comparing `model_probability` to `market_probability` (both YES-referenced, so directly comparable regardless of `chosen_side`), among the 7,993 rows with both populated:

| category | n | avg |model − market| (pp) | avg market_probability | avg model_probability |
|---|---|---|---|---|
| crypto | 4,444 | **46.7pp** | 66.3% | 58.7% |
| politics | 2,271 | **0.0pp** | 21.8% | 21.8% |
| sports | 1,278 | **0.0pp** | 42.2% | 42.2% |

**This is the single most important structural finding in the audit.** For politics and sports, `model_probability` equals `market_probability` **exactly**, at essentially every row. Reading the source explains why with certainty (not speculation): `modelProbabilityYes = evidence.length ? combineEvidenceToProbability(evidence).probability : marketProbability.mid ?? 50`. When `evidence.length === 0`, the "model" **literally copies the market's own price** and reports `confidence: 15`. Tracing the two evidence sources:

- `computeCryptoTrendEvidence()` only fires for markets where `detectCryptoSymbol()` matches (crypto category only) — this is why crypto alone shows a non-zero, non-trivial model/market divergence (46.7pp average, driven by the strike-price markets discussed in Sections 8/13).
- `computeBaseRateEvidence(category)` requires **at least 10 rows with `resolved_outcome` populated for that category** (`if (rows.length < 10) return null`). Per Section 15, `resolved_outcome` is **null for 100% of all 67,760 rows, with no exception** — because the `resolve` tick has never run (Section 3). **`computeBaseRateEvidence()` can therefore never return non-null evidence for any category, structurally, for as long as the resolve tick stays disabled** — this is not "not enough history yet," it is a hard zero that cannot change on its own.

**Consequence**: for sports (89.0% of all evaluation volume) and politics (4.4%) — 93.4% of everything the engine evaluates — there is currently **no possible source of an independent signal at all**. The engine is not failing to find edge in these categories; it is structurally incapable of computing a non-zero edge for them until either (a) the resolve tick is enabled long enough to accumulate ≥10 resolved outcomes per category, or (b) a category-specific evidence source other than base-rate/crypto-trend is added. This is a scheduler-configuration consequence, traced through to its exact mechanism in the decision math — not an inference.

Accuracy/calibration cannot be assessed here since it requires resolved outcomes (see Section 15) — correctly not claimed.

---

## 15. Resolution / Learning Status

| | value |
|---|---|
| `resolved_outcome` populated | **0 / 67,760 (0.0%)** |
| `resolved_outcome` null | 67,760 (100.0%) |
| `prediction_calibration_snapshots` rows | **0** |
| `resolve`/`learn` run_type rows in `prediction_autonomous_runs` | **0** (confirmed in Section 3) |

**"Accuracy cannot yet be measured"** — stated exactly as the audit brief requires, with the specific mechanism: it is not that outcomes haven't happened yet in the real world (many of the evaluated markets, being 1–7 days out, have almost certainly resolved on Polymarket by now); it is that **nothing in this deployment ever checks Polymarket for settlement and writes `resolved_outcome`**, because the `resolve` scheduler gate was never turned on. This is the same root mechanism identified in Section 14 — it is worth stating once, precisely, rather than re-deriving it per section: **one missing scheduler gate (`resolve`) is simultaneously the reason there is zero calibration data AND (via `computeBaseRateEvidence`) a structural reason 93%+ of evaluation volume can never show a non-zero edge.**

---

## 16. Autonomous Trades Safety Check

Directly queried, read-only, in this task:

| | value |
|---|---|
| `prediction_autonomous_trades` total rows | **0** |
| OPEN | 0 |
| CLOSED | 0 |

**CONFIRMED: no autonomous position — shadow or real — has ever been opened.** This matches every prior report in this series and this task's own independent read.

---

## 17. Performance / System Health

Already covered quantitatively in Section 3 (durations, success rates, gap analysis). Summary:

- `discover`: avg 5.9s, p95 11.9s, max 22.5s per tick — healthy for scanning 6 categories × up to 20 markets each with `AUTONOMOUS_DISCOVERY_CONCURRENCY=3`.
- `entry_shadow`: avg 4.7s, p95 7.9s, max 19.5s per tick — healthy for evaluating 50 candidates with `AUTONOMOUS_ENTRY_CONCURRENCY=4` plus up to 10 AI rechecks.
- No duplicate/overlapping-tick evidence found (each `run_id` is unique, `started_at` values for the same `run_type` are consistently ~5 minutes apart outside the one known hotfix-window gap).
- No PostgREST/database-layer failures observed in `error` text beyond the 3 already-explained FK crashes.
- **Engine is operationally healthy.** This audit found no infrastructure, latency, or reliability problem contributing to the zero-opportunity result.

---

## 18. THE CORE QUESTION — Why Has the Engine Found Zero Opportunities?

Ranked by evidence strength and by how much of the 67,760-row population each cause actually explains:

**#1 — Base-rate evidence is structurally dead, starving 93.4% of evaluation volume of any independent signal (ENGINE FILTERING + SCHEDULER/SYSTEM HEALTH, compounded).** `computeBaseRateEvidence()` requires ≥10 resolved outcomes per category; `resolved_outcome` is 0% populated because the `resolve` tick has never been scheduled (Section 3, Section 15). For sports (89.0%) and politics (4.4%) of all volume, the model literally mirrors the market price (0.0pp average divergence, exactly) and reports confidence 15 — these rows can only ever land on AVOID (net_ev<0 after fees, since edge≈0) or, for sports, INSUFFICIENT_DATA first. **This is the single largest, most mechanically-certain, and most directly fixable-in-principle cause** — though fixing it (enabling `resolve`) is explicitly out of scope for this task.

**#2 — Missing live order books on Polymarket for the sports category specifically (DATA QUALITY, real/external).** 97.9% of sports evaluations (58,991 of 60,269 — 87% of the entire 67,760-row population) hit `INSUFFICIENT_DATA` purely because there is no CLOB book on the evaluated token. This is external to SignalVerse — Polymarket genuinely does not carry deep, active order books for most of the sports markets this engine's discovery surfaces. Verified: crypto's INSUFFICIENT_DATA rate is 0.7% under the identical check, proving the engine's own threshold is not universally too strict.

**#3 — Confidence gate blocking a real, recurring, tradeable pattern in crypto (ENGINE FILTERING, but arguably correctly conservative).** The near-miss population (Section 13) is dominated by single-strike BTC/ETH markets with large nominal edge (41–55pp), tight spreads, real liquidity, and `tradeability_eligible=true` — blocked solely by `confidence < 40`. However, the confidence number itself is built from a single evidence item (`computeCryptoTrendEvidence`, a generic 30-day-SMA trend signal) that the code's own comments explicitly say is **"NOT a strike-price-specific probability model."** The large nominal edge these rows show is therefore itself suspect — a generic trend signal has no real basis for asserting a 45pp edge on a specific dollar threshold, and the confidence gate is arguably correctly refusing to trust it, not miscalibrated. This cause explains essentially 100% of the 579 WATCH rows (all crypto) but only 0.9% of total evaluation volume.

**#4 — Tradeability (execution quality) independently invalidates a meaningful share of the highest-edge candidates (TRADEABILITY, real/external).** Among order-book candidates with |edge|≥20pp, 98.6% fail tradeability (`INSUFFICIENT_DEPTH`/`SPREAD_TOO_WIDE`) — this overlaps with #3's crypto near-misses in some rows but is a distinct, independently-confirmed constraint (some AVOID-classified rows are also untradeable, so even a confidence-gate change wouldn't unlock all of them).

**#5 — Candidate-pool sampling is capped and unordered (minor, secondary).** `.limit(50)` with no `ORDER BY` against a 215–300-market eligible pool produces uneven rotation (median 46, max 1,356 evaluations per market) — a real inefficiency, but it does not change the conclusion: even the markets evaluated 1,356 times never produced an OPPORTUNITY, so pool coverage is not what's suppressing opportunities.

**#6 — Candidate universe is narrower than "6 scanned categories" implies (minor, real/external).** `science` (105/105) and `economics` (2/2) have never once produced an ELIGIBLE candidate; `culture` never appears at all. Effectively only 3 of 6 scanned categories ever reach evaluation. This compounds #1/#2 rather than independently explaining the zero-opportunity result.

**Direct answers to the checklist:**
- (A) Genuinely no good trades existed — **partially true for crypto** (Section 13's near-misses may or may not be real edge; unresolved without fixing #1/#3).
- (B) Engine too conservative — **true specifically for the crypto confidence gate**, arguably by correct design given the weak evidence basis.
- (C) Data quality preventing opportunities — **true and dominant for sports** (88% of all volume).
- (D) Tradeability eliminating theoretical edges — **true for a meaningful subset**, confirmed independently of (B).
- (E) A gate misconfigured — **the clearest single misconfiguration is the missing `resolve`/`learn` scheduler gate**, which cascades into #1.
- (F) Candidate universe too small — **contributing, not dominant** (#6).
- (G) AI/evidence layer eliminating too much — **not supported**; AI is barely invoked and is not where candidates are lost (Section 11).
- (H) Some combination — **yes, specifically #1 (structural, 93%+ of volume) + #2 (external data gap, sports) + #3/#4 (crypto-specific, confidence and execution quality) together fully account for the observed 0.0% opportunity rate**, with #5/#6 as minor compounding factors.

---

## 19. Confirmation: No Changes Made

No code, threshold, Kelly parameter, Time Horizon constant, Tradeability constant, AI provider/model setting, scheduler/jobs.d entry, or database row was modified, inserted, updated, or deleted by this task. Every database access in this task was a `.select()` call against production via the existing read-only-in-practice service-role credential (the same credential every prior audit in this series has used for read verification). No trade of any kind (shadow or real) was created. This report itself is the only artifact this task produced.

---

## 20. Final Verdict

```
OVERALL ENGINE HEALTH:        PASS (uptime/reliability) — NEEDS INVESTIGATION (decision output)
DATA COLLECTION:               PASS
DISCOVERY:                     NEEDS INVESTIGATION (candidate universe narrower than intended; repeat-scan volume overstates breadth)
SHADOW ENTRY:                  PASS (mechanically — runs cleanly, records every candidate, zero crashes since hotfix)
OPPORTUNITY GENERATION:        FAIL (0.0% actionable rate across 67,760 evaluations; root cause identified, not cosmetic)
TRADEABILITY:                  NEEDS INVESTIGATION (98.6% of high-edge candidates fail tradeability — may be correct or may be miscalibrated depth/spread thresholds; unresolved by this audit)
AI FUNNEL:                     PASS (working as designed; not the bottleneck)
SCHEDULER:                     NEEDS INVESTIGATION (resolve/learn gates were never enabled — this is a configuration gap, not a crash)
SAFETY:                        PASS (zero autonomous trades of any kind, confirmed independently)
```

**MOST IMPORTANT FINDING:** The Autonomous Prediction Engine has never enabled its `resolve` scheduler gate, which means `resolved_outcome` has been null for literally every one of the 67,760 evaluations in this window; because `computeBaseRateEvidence()` hard-requires ≥10 resolved outcomes per category to return anything, this single missing gate structurally guarantees that sports (89.0% of volume) and politics (4.4%) — 93.4% of everything the engine looks at — can never produce a model probability that differs from the market's own price, and therefore can never clear the edge/EV bar regardless of real market conditions. Layered on top of this, sports independently fails 97.9% of the time on missing Polymarket order-book data (a real, external data-adequacy limit), and crypto (the one category with genuine evidence and often-tradeable books) is instead blocked by a confidence floor that is arguably correctly distrusting its own single, generic, non-strike-specific evidence source. The zero-opportunity result is real, well-explained, and traceable to specific, mostly non-mysterious mechanisms — it is not an unexplained anomaly.

**TOP 5 PROBLEMS:**
1. `resolve`/`learn` scheduler gates have never been enabled, permanently starving `computeBaseRateEvidence()` (structural, affects 93.4% of volume).
2. Sports markets (89.0% of evaluation volume) predominantly lack live Polymarket order books for the evaluated token (external data limit, not an engine misconfiguration).
3. Crypto's only evidence source (30-day SMA trend) is explicitly documented as unfit for strike-price questions, yet produces large nominal edges at low confidence — inflated, unreliable "edge" numbers that the confidence gate is right to distrust, but that also pollute Section 8/13's raw edge statistics if read without this context.
4. `entry_shadow`'s eligible-candidate query (`.limit(50)`, no `ORDER BY`) produces uneven, non-guaranteed rotation across the eligible pool (median 46 vs max 1,356 evaluations per market).
5. Effective candidate universe is 3 categories (sports/crypto/politics), not 6 — `science`/`economics`/`culture` contribute nothing.

**TOP 5 THINGS THAT ARE WORKING:**
1. Discovery and Shadow Entry tick execution: 100% and 99.8% success respectively, healthy durations, only one already-explained, already-fixed failure cluster.
2. The side-aware (YES/NO independent) evaluation design is functioning correctly and fairly — no asymmetric treatment found.
3. The Time Horizon gate (24h–7d) is working exactly as designed with zero drift violations across 67,760 evaluations.
4. Tradeability and decision fields are being persisted correctly and completely for every candidate (not just actionable ones), which is precisely what made this audit possible.
5. Safety holds: zero autonomous trades of any kind, in shadow or real mode, confirmed independently.

**NEXT DIAGNOSTIC STEP (not a fix):**
1. Before touching any gate, get a precise, minimal-risk answer to: "if `resolve` had been running since 2026-09-09, how many resolved outcomes would exist per category today, and would any category have crossed the ≥10-row `computeBaseRateEvidence` floor?" This is answerable **read-only**, without enabling anything in production: fetch `condition_id`/`end_date` for the 215 uniquely-evaluated markets from Polymarket's own public Gamma API (already-closed/resolved status is public data) and simulate what `resolved_outcome` would have been, entirely offline. This would tell us whether root cause #1 is actually blocking today or would only start mattering more once resolve has run for a while.
2. Separately and independently, obtain a manual, one-off sample of Polymarket order-book depth for 10–15 of the highest-volume sports markets in `prediction_markets` (read-only, external API, no production DB write) to confirm root cause #2's "no CLOB book" finding isn't itself an artifact of how this engine fetches order books (e.g., wrong token id, wrong endpoint) rather than a genuine absence of a book on Polymarket's side.
3. Only after both of the above are confirmed should any threshold/gate/scheduler change be considered — and that decision explicitly belongs to the user, not to this audit.

---

## Appendix: Raw Query Provenance

All numbers in this report were computed from four read-only PostgREST pulls against production `signalverse_cutover2` on 2026-09-14 (UTC), using the project's existing `.env.backup.local` credential (same one `npm run backup` uses) and only `.select()` calls:

- `prediction_autonomous_runs`: 2,718 rows (all columns)
- `prediction_predictions` (`telegram_id IS NULL`, joined to `prediction_markets` for question/category/end_date): 68,964 rows, plus a supplemental fetch of `market_quality_score`/`resolution_risk_score` per row
- `prediction_markets`: 1,974 rows (full snapshot)
- `prediction_autonomous_trades`: 0 rows
- `prediction_calibration_snapshots`: 0 rows

No table was written to. All temporary fetch/aggregation scripts used for this audit were run from a scratch location and were not committed to the repository.
