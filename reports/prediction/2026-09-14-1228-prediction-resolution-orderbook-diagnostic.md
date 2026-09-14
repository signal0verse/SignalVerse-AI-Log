# Prediction Market — Phase 2 Read-Only Diagnostics: Resolution Simulation & Order-Book Validation

## Metadata

- Date: 2026-09-14, diagnostics run ~12:00–12:30 UTC
- Task ID: prediction-resolution-orderbook-diagnostic-2026-09-14
- Module: prediction
- Mode: **READ-ONLY diagnostics only** — no code, config, threshold, gate, scheduler, or database write of any kind. No trade of any kind, demo or real. Nothing was fixed, tuned, or deployed.
- Builds directly on: [`2026-09-14-1157-prediction-one-week-production-analysis.md`](./2026-09-14-1157-prediction-one-week-production-analysis.md) (Phase 1 forensic audit), read in full before this task began.
- All production DB reads were `.select()` only, using the project's existing `.env.backup.local` read credential. All Polymarket lookups were plain `GET` requests against Polymarket's own public Gamma and CLOB APIs — the same APIs the production code itself already calls every 5 minutes; nothing about this diagnostic added load beyond a few hundred extra read-only GETs, similarly rate-limited to the app's own existing concurrency conventions.

**One operational note, not acted on**: during this task, two read attempts against the production PostgREST endpoint (`signal.easybitpay.com`) returned Cloudflare 502s (12:15:59 and 12:16:43 UTC). Retries seconds later succeeded, and a direct `GET /api/predictions?action=feed` check three times over the following 15 seconds returned HTTP 200 each time. This reads as a brief, transient blip, not a sustained outage — reported for completeness per this task's read-only mandate, no action taken.

---

## 1. Exact Diagnostic Window

- Same audited production window as Phase 1: **2026-09-09T18:26:04Z → 2026-09-14T11:46:03Z** (113.7 hours / 4.74 days), n = 67,760 fully-instrumented autonomous evaluations.
- Diagnostic A/B live Polymarket lookups were performed **today, 2026-09-14, ~12:00–12:30 UTC** — i.e., these are **current, present-day snapshots** of each market's resolution/order-book state, not a historical replay. Every place below where "as of today" matters for interpretation, this is called out explicitly.
- Population checked: the **227 uniquely-evaluated markets** across the entire autonomous evaluation history (68,964 rows, both pre- and post-instrumentation), broken down as sports 166, crypto 45, politics 16.

---

## 2. Diagnostic A Methodology

1. Reused the already-downloaded `prediction_predictions`/`prediction_markets` production data from Phase 1 (no new DB writes; the one new DB read in this task was a supplemental `token_id_yes`/`token_id_no`/`event_slug` fetch for the same 227 markets, read-only).
2. Built the list of 227 uniquely-evaluated markets with `condition_id`, `category`, `end_date`.
3. **First attempt (v1, later found flawed — reported honestly rather than discarded)**: queried Polymarket's public Gamma API at `https://gamma-api.polymarket.com/markets?condition_ids=<id>` — the *exact same endpoint and parameter* SignalVerse's own `fetchGammaSettlementOutcome()` (the function the disabled `resolve` tick would call) uses. Result: 196 of 227 markets (86.3%) came back "not found" (empty array), including markets known to have real trading history.
4. **Root-caused the v1 anomaly directly** (this is itself a Diagnostic A finding, see Section 5): manually verified with a raw `curl`-equivalent request that Polymarket's Gamma `condition_ids` filter genuinely returns `[]` for closed markets, while the same exact `condition_id` is found immediately via the public CLOB endpoint `https://clob.polymarket.com/markets/<condition_id>`, which also directly reports `closed`/`active`/`accepting_orders`/`enable_order_book` and each outcome token's final settled `price`/`winner`.
5. **v2 (authoritative)**: re-ran resolution lookup for all 227 markets via the CLOB `/markets/<condition_id>` endpoint. Cross-validated against v1: of 31 still-open markets, Gamma's `condition_ids` filter found 31/31 (100%) correctly; of 196 now-closed markets, it found 0/196 (0%) — a clean, reproducible, one-directional failure mode isolated specifically to closed markets, not a general flakiness.
6. Joined the ground-truth closed/winner data with SignalVerse's own `token_id_yes`/`token_id_no` convention to classify each resolved market as YES/NO exactly the way `combineEvidenceToProbability`'s base-rate evidence would need.
7. Simulated `computeBaseRateEvidence()`'s exact formula (read directly from `api/predictions.ts`, not reimplemented from memory) against the real, ground-truth resolved counts per category, entirely offline — no write, no enabling of anything.

---

## 3. Diagnostic A Results

| | value |
|---|---|
| Unique markets checked | 227 |
| **CLOSED (resolved) on Polymarket, as of TODAY** | **196 (86.3%)** |
| Open (unresolved), as of TODAY | 31 (13.7%) |
| Gamma `condition_ids` lookup success rate on OPEN markets (sanity check) | 31/31 = 100% |
| Gamma `condition_ids` lookup success rate on CLOSED markets | **0/196 = 0%** |

**This 0% finding is the single most important fact in Diagnostic A** and is addressed on its own in Section 5 below, since it bears directly on the "Most important question."

---

## 4. Category-by-Category Resolution Counts

| category | total checked | closed (resolved) today | % closed | usable YES/NO-classified resolved rows* |
|---|---|---|---|---|
| sports | 166 | 162 | 97.6% | 160 (81 YES / 79 NO, 2 unmapped) |
| crypto | 45 | 28 | 62.2% | 28 (21 YES / 7 NO) |
| politics | 16 | 6 | 37.5% | 6 (0 YES / 6 NO) |

*"Usable" = the winning token's id was matched back to SignalVerse's own stored `token_id_yes`/`token_id_no` for that market — this is the exact same YES/NO convention `computeBaseRateEvidence()` and `resolved_outcome` would use.

---

## 5. Base Rate Evidence Simulation

`computeBaseRateEvidence(category)` requires ≥10 rows with `resolved_outcome` populated for that category (`if (rows.length < 10) return null`). Read directly from source: `weight = min(1, rows.length/100)`, `reliability = min(0.7, rows.length/200)`, `direction = yesRate > 0.5 ? 1 : yesRate < 0.5 ? -1 : 0` (a **binary sign**, not scaled by how far `yesRate` is from 50% — this matters, see below).

| category | crosses ≥10 threshold (sample size only) | simulated weight | simulated reliability | simulated confidence (this evidence alone) | simulated model_probability (this evidence alone, no other signal) |
|---|---|---|---|---|---|
| **sports** | **YES** (160 usable) | 1.000 | 0.700 | **70** | 74.1% |
| crypto | YES (28 usable) | 0.280 | 0.140 | 4 | 51.5% |
| politics | **NO** (only 6 usable) | — | — | — | — |

**Three separate, independently-confirmed reasons this is not a simple "turn on resolve and it would have worked" story:**

1. **Sample size alone (politics)**: politics has genuinely not accumulated enough resolved outcomes yet (6 of 10 needed) — for this one category, "future-data-accumulation problem" is the accurate, literal description, independent of anything else.

2. **The settlement-lookup mechanism itself would likely fail regardless of the scheduler gate (sports, crypto, and politics alike)**: Section 3's 0/196 finding means that even if `resolve` had been enabled for this entire window, `autonomousResolutionTick`'s own settlement check (`fetchGammaSettlementOutcome`, which uses the exact Gamma `condition_ids` query tested here) would very likely have returned `null` for essentially every one of these 196 already-closed markets — **not because they hadn't resolved, but because of an apparently unrelated, separate limitation in the lookup method itself**, confirmed live and reproducibly in this diagnostic. Turning on the scheduler gate alone would not have been sufficient; the settlement-lookup code would independently need to query the CLOB `/markets/<condition_id>` endpoint instead (which this diagnostic confirms works reliably) for `resolved_outcome` to actually populate at scale.

3. **Even where evidence *could* theoretically compute (sports), its meaningfulness is genuinely questionable, not simply "the fix that was missing"**: sports' 160 resolved rows come from completely unrelated individual matches (tennis, esports, football, cricket) where "YES" is an arbitrary convention (SignalVerse's own code assigns it to whichever outcome happens to be listed first when no outcome is literally named "Yes"/"No" — confirmed by reading `normalizeGammaMarket()`). Aggregating a "51% YES rate" across unrelated matches under an arbitrary labeling convention is not a meaningful real-world base rate the way it might be for a more homogeneous category. Yet because `direction` is a **binary sign** rather than scaled by distance from 50%, this marginal, likely-noise 50.6% split gets the *same full-strength* directional push as a genuine 90%/10% split would — producing a simulated confidence of 70 (well above the gate's 40) and a simulated model_probability of 74.1% from what is very plausibly statistical noise, not signal. **This is flagged as an important caveat for any future decision, not as something to change now**: enabling `resolve` for sports specifically could plausibly manufacture *false* confidence rather than genuine edge, given the current formula's binary-direction design and sports' inherently heterogeneous candidate pool.

**Direct answer to the "Most important question"**: *"Was the missing resolve scheduler actually blocking opportunity generation during this observation window, or is it mainly a future-data-accumulation problem?"*

**Neither, cleanly — it is category-dependent, and even where the gate would matter, it is not sufficient by itself:**
- **Politics**: genuinely a future-data-accumulation problem — not enough resolved history exists yet even in principle.
- **Crypto**: partially data-accumulation (only 28 resolved rows so far, producing negligible weight/reliability) — and separately, crypto's real, already-identified bottleneck (Phase 1, Section 18) is the confidence gate on its *existing* trend evidence, which base-rate evidence at this sample size would barely move.
- **Sports**: has *technically* accumulated enough resolved history (160 rows) that `computeBaseRateEvidence()` would return a non-null item — **but two independent, confirmed blockers stand between "resolve is enabled" and "this evidence actually gets used": (a) the settlement-lookup method itself fails to find 0/196 of these closed markets via its current Gamma query, and (b) even if it worked, the resulting evidence signal is of doubtful quality given the category's heterogeneity and the formula's binary-direction design.**

**RESOLVE GATE IMPACT verdict for this section: PARTIAL** (see final verdict, Section 10 of this report's summary block, for the consolidated statement).

---

## 6. Diagnostic B Methodology

1. From the fully-instrumented population, isolated all `category='sports'` rows with `decision='INSUFFICIENT_DATA'` and `spread_pct IS NULL` (Phase 1's exact proxy for "no chosen-side order book") — 132 unique markets.
2. Selected a diverse 15-market sample by Gamma-reported liquidity: 5 highest-liquidity (up to $2.67M), 5 mid-range, 5 near-zero/zero — spanning tennis (Grand Slam singles winners, ATP/WTA Challenger-level set-winner props), esports is representable in the wider category but not in this specific 15 (the wider 132-market scale-check below covers it implicitly), and cricket.
3. Fetched, for each, the real `token_id_yes`/`token_id_no` from production (read-only), then directly queried:
   - `https://clob.polymarket.com/book?token_id=<id>` for **both** YES and NO tokens independently (not just the chosen side).
   - `https://clob.polymarket.com/markets/<condition_id>` for authoritative `active`/`closed`/`accepting_orders`/`enable_order_book`/per-outcome settled price.
   - `https://gamma-api.polymarket.com/markets?condition_ids=<id>` (the same endpoint the app uses elsewhere) for cross-reference.
   - `https://clob.polymarket.com/prices-history?market=<token>&startTs=...&endTs=...` (the same endpoint SignalVerse's own `fetchClobPriceHistory` uses) to look for any historical trade activity.
4. Scaled the `closed`-status check (step 3's second bullet only) across **all 132** unique sports INSUFFICIENT_DATA markets, not just the 15-sample, to get a real percentage.
5. Cross-referenced every checked market's **current** `candidate_status` in the production snapshot to test directly, not by inference, whether already-closed markets are still sitting in the ELIGIBLE pool that `entry_shadow` reads every 5 minutes.
6. Read the actual Discovery source code (`fetchGammaMarketsByCategory`, `normalizeGammaMarket`, `autonomousDiscoveryTick`) to determine whether a `closed`/`acceptingOrders` check exists anywhere in the eligibility pipeline, and independently confirmed via a fresh live call to the exact endpoint Discovery uses (`/events?active=true&closed=false&tag_slug=sports`) that Polymarket's own response already includes a per-sub-market `closed`/`acceptingOrders` field that the code never reads.

---

## 7. Order-Book Validation Table (15-market sample)

All 15 markets, independently and unanimously, returned the same picture. Representative rows shown in full; the remaining follow an identical pattern (full raw data available on request — every one of the 15 hit the identical classification):

| question | liquidity (Gamma) | chosen side | CLOB `closed` | CLOB `accepting_orders` | `enable_order_book` | YES book (`/book`) | NO book (`/book`) | still `candidate_status=ELIGIBLE` today? |
|---|---|---|---|---|---|---|---|---|
| US Open WTA: Qinwen Zheng vs Elena Rybakina | $2,667,668 | YES | **true** | false | false | HTTP 404 "No orderbook exists for the requested token id" | HTTP 404 (same) | **YES** |
| Will Jannik Sinner win the 2026 Men's US Open? | $887,871 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | no (FILTERED_OUT, TIME_HORIZON_TOO_SOON) |
| Will Carlos Alcaraz win the 2026 Men's US Open? | $362,483 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | no (FILTERED_OUT, TIME_HORIZON_TOO_SOON) |
| Will Novak Djokovic win the 2026 Men's US Open? | $892,351 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | no (FILTERED_OUT, TIME_HORIZON_TOO_SOON) |
| Set 1 Winner: Zverev vs Zandschulp | $1,741,004 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | **YES** |
| Seville: Facundo Acosta vs Sebastian Ofner | $205,294 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | **YES** |
| Antalya 4: Rositsa Dencheva vs Maria Lourdes Carle | $167,198 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | **YES** |
| Set 1 Winner: Gjorcheska vs Zantedeschi | $157,933 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | **YES** |
| Istanbul 3: Harold Mayot vs Max Basing | $155,018 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | **YES** |
| Antalya 4: Lina Gjorcheska vs Aurora Zantedeschi | $154,722 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | **YES** |
| Set 1 Winner: Acosta vs Ofner | $2,616 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | no (FILTERED_OUT, LOW_LIQUIDITY) |
| Set 1 Winner: Varillas vs Wild | $4,178 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | no (FILTERED_OUT, LOW_LIQUIDITY) |
| US Open WTA: **Completed Match**: Aryna Sabalenka vs Elena Rybakina | $46,714 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | no (FILTERED_OUT, LOW_LIQUIDITY) |
| T20 Asia Cup, Women: India vs Sri Lanka | $58,163 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | no (FILTERED_OUT, LOW_LIQUIDITY) |
| Set 1 Winner: Pacheco vs Callejon | $76,881 | YES | **true** | false | false | HTTP 404 (same) | HTTP 404 (same) | no (FILTERED_OUT, LOW_LIQUIDITY) |

**Note the market literally titled "Completed Match"** in the sample — direct, unambiguous confirmation that SignalVerse's discovery/eligibility pipeline has evaluated a market whose own question text says the event is already over.

`prices-history` check (looking for any historical trade activity, 30 days back from each market's own evaluation timestamp through today): **zero data points for all 15 tokens checked, at every window tried**, including a $2.67M-liquidity market. This means Gamma's `liquidity` field for these markets does **not** correspond to realized CLOB trade volume — it reflects a different (likely AMM-provisioning-style) metric — and this diagnostic could **not** pin down exactly when each book disappeared relative to SignalVerse's evaluation timestamp using this method. **Stated honestly as a limitation**: this diagnostic cannot prove, market-by-market, that every one was *already* closed at the moment SignalVerse evaluated it (versus closing shortly after) — but Section 8's independent, code-level evidence (Discovery never checks `closed` at all, and several of these are still `ELIGIBLE` in production *right now*, well after their own resolution) makes the "already closed at evaluation time" explanation for a large share of them the best-supported reading of the combined evidence, not a guess.

---

## 8. Root Cause Classification (per market and at scale)

**All 15 sampled markets classify identically**: `enable_order_book=false` and `closed=true` on Polymarket's own CLOB, with an explicit, Polymarket-authored error (`"No orderbook exists for the requested token id"`, HTTP 404) on **both** YES and NO tokens — this rules out hypotheses (B) wrong token and (C) wrong endpoint/parameter definitively: SignalVerse's `fetchClobOrderBook()` (`https://clob.polymarket.com/book?token_id=<id>`) is exactly the correct endpoint and exactly the correct token ids, confirmed by cross-referencing the same ids against the CLOB's own `/markets/<condition_id>` response, which lists the identical token ids under `tokens[]`. Hypothesis (D) (parser incorrectly treats an existing book as missing) is also ruled out: `fetchClobOrderBook()`'s `if (!r.ok) return null;` on an HTTP 404 is the *correct* handling of a genuinely-nonexistent book, not a parsing bug.

**Scaled to all 132 unique sports INSUFFICIENT_DATA markets** (not just the 15-sample):

| | count | % |
|---|---|---|
| Confirmed `closed=true` on Polymarket right now | **132 / 132** | **100%** |
| Of those, still `candidate_status='ELIGIBLE'` in production right now | **104 / 132** | **78.8%** |

**This reframes, and sharpens, Phase 1's root cause #2** ("Polymarket genuinely lacks order books for sports"). The immediate technical fact — no CLOB book exists — is confirmed **externally true** with Polymarket's own explicit error message, for every market checked. But the *reason SignalVerse keeps asking* is a separable, **internal, code-verified gap**: Discovery's `/events?active=true&closed=false&tag_slug=sports` call (confirmed live, fresh, in this diagnostic) returns nested sub-markets that **already carry their own `closed`/`acceptingOrders` fields** — for example, one live event checked during this diagnostic showed "Game 1 Winner: closed=true, acceptingOrders=false" sitting directly alongside "Game 2 Winner: closed=false, acceptingOrders=true" **in the identical API response**. `normalizeGammaMarket()` reads `conditionId`, `clobTokenIds`, `outcomes`, `question`, dates, `resolutionSource`, `volume`, `liquidity` from each sub-market object — but **never reads `closed` or `acceptingOrders`**, and `autonomousDiscoveryTick`'s eligibility logic checks only Time Horizon and liquidity, never settlement status. The practical, measured consequence: **78.8% of the sports markets that produce `INSUFFICIENT_DATA` are markets that have already resolved and are, right now, still sitting in the exact pool `entry_shadow` reads every 5 minutes.**

**SPORTS ORDER-BOOK ISSUE verdict: MIXED.** The absence of a book, in the moment, is a genuine external Polymarket fact. But a substantial, precisely-measured majority (78.8%, code-verified via a field Polymarket already hands over for free) of *why the engine keeps hitting that external fact* is an internal SignalVerse candidate-lifecycle gap, not an inherent, unavoidable property of Polymarket's sports market liquidity in general.

---

## 9. Final Determinations

**Sports missing books — external Polymarket reality or SignalVerse retrieval behavior?**
Both, in a specific, measured proportion, not an either/or: the book-absence fact is externally real and confirmed (Polymarket's own 404s); the reason the engine collides with that fact so often is a SignalVerse-side lifecycle gap (no `closed` check in Discovery) affecting a measured 78.8% majority of the specific markets sampled. Neither half of this should be read as the whole story on its own.

**Is missing `resolve` an actual current opportunity bottleneck?**
**PARTIAL, and category-dependent** — confirmed as a real, necessary, and currently-active blocker (evidence.length permanently 0 for base-rate purposes today, for every category), but demonstrably **not sufficient on its own**: even with the gate enabled, (a) politics doesn't yet have enough resolved history regardless, (b) the settlement-lookup mechanism (`fetchGammaSettlementOutcome`) independently fails to find 0/196 already-closed markets via its current Gamma query — a second, separate bug/limitation that would need its own fix, and (c) even where sample size is sufficient (sports), the resulting signal's quality is questionable given the category's heterogeneity and the evidence formula's binary-direction design.

---

## 10. Updated Root-Cause Ranking (supersedes Phase 1's Section 18 with this diagnostic's more precise evidence)

1. **Discovery never checks settlement status, despite Polymarket handing it over for free** — code-verified, and measured at 78.8% of the specific sports INSUFFICIENT_DATA population sampled. This is now the most concrete, most precisely-measured, and most directly-traceable-to-a-specific-code-gap finding in either audit.
2. **The `resolve` scheduler gate is genuinely disabled and this genuinely matters** — but as a *partial*, not total, explanation, and layered with a second, independent settlement-lookup defect (0/196 find rate) that would block the same outcome even if the gate were flipped on.
3. **Crypto's confidence gate on a single, generic, non-strike-specific evidence source** (Phase 1, Section 18, #3) — unaffected by either diagnostic here, still stands as previously described.
4. **Genuine, real order-book/liquidity thinness on Polymarket** for the sports markets that are NOT stale-eligible (the other 21.2% / 28 of 132 in the sampled set) — a real, external, residual factor, smaller than Phase 1 assumed but not zero.
5. **Base-rate evidence, even if fully unlocked, may not be a high-quality signal for a heterogeneous category like sports** — a new caveat this diagnostic surfaces, relevant to any future decision about whether "just enable resolve" is actually the right next step for sports specifically.
6. Phase 1's #4 (tradeability) and #5 (unordered `.limit(50)` candidate sampling) are unaffected by this diagnostic and stand as previously reported.

---

## 11. What Should NOT Be Changed

Per this task's explicit mandate, and independent of any technical merit either fix might have: no code, threshold, gate, scheduler entry, database row, or deployment was touched, and none should be based on this report alone. Specifically **not done and not recommended from this diagnostic alone**:
- Enabling the `resolve` or `learn` scheduler gates.
- Modifying `fetchGammaSettlementOutcome()` to use the CLOB endpoint instead of Gamma's `condition_ids` filter (even though this diagnostic's evidence would support it).
- Adding a `closed`/`acceptingOrders` check to `normalizeGammaMarket()`/`autonomousDiscoveryTick()` (even though this diagnostic's evidence would support it).
- Changing `computeBaseRateEvidence()`'s binary-direction formula.
- Any threshold (`minEdge`, `minConfidence`, `maxSpreadPct`, Kelly, Time Horizon, Tradeability) change of any kind.

---

## 12. What the Next Implementation Phase Should Investigate (not implemented here)

1. Whether switching the settlement-check mechanism from Gamma's `condition_ids` filter to the CLOB `/markets/<condition_id>` endpoint (confirmed reliable in this diagnostic, including for closed markets) would actually let `resolve`, once separately approved and enabled, populate `resolved_outcome` correctly at scale — this diagnostic strongly suggests yes, but a dedicated, scoped implementation review should verify this doesn't have other side effects (e.g. rate limits, response-shape differences for edge cases like multi-outcome markets) before touching production.
2. Whether Discovery should read the already-available `closed`/`acceptingOrders` fields from its existing `/events` response to demote/skip already-settled sub-markets — this diagnostic shows the data is already present in the response SignalVerse fetches today; the question for a future phase is precisely how conservative such a check should be (e.g. treat `acceptingOrders=false` the same as `closed=true`? re-check periodically for already-ELIGIBLE rows, not just at initial discovery?).
3. Whether `computeBaseRateEvidence()`'s direction should be scaled by the magnitude of `yesRate`'s deviation from 50% rather than a binary sign, particularly before ever relying on it for a heterogeneous category like sports.
4. A dedicated look at the 21.2% of sports INSUFFICIENT_DATA markets that are **not** stale-eligible (i.e., genuinely still open on Polymarket but still without a usable order book) — this diagnostic did not deeply investigate this residual subset beyond confirming it exists.

None of the above is authorized or recommended to be implemented by this report; they are candidate next steps for the user to weigh and explicitly approve.

---

## 13. Concise Verdict

```
RESOLVE GATE IMPACT:        PARTIAL
SPORTS ORDER-BOOK ISSUE:    MIXED  (external fact + a measured 78.8% SignalVerse lifecycle gap)
CONFIDENCE GATE ISSUE:      LIKELY CORRECT  (unchanged from Phase 1 — not re-tested here, no new evidence against it)
TRADEABILITY ISSUE:         CONFIRMED  (unchanged from Phase 1 — not re-tested here)
CANDIDATE ROTATION ISSUE:   SECONDARY  (unchanged from Phase 1 — not re-tested here)

ZERO OPPORTUNITY ROOT CAUSE (updated ranking):
1. Discovery never checks settlement status despite Polymarket providing it for free — 78.8% of sampled sports INSUFFICIENT_DATA markets are stale-eligible, already-resolved candidates.
2. resolve/learn scheduler gates disabled — real but partial; a second, independent settlement-lookup defect (0/196 find rate via the current Gamma query) would block the same fix even if the gate were enabled.
3. Crypto confidence gate distrusting a single generic, non-strike-specific evidence source (unchanged from Phase 1).
4. Genuine residual Polymarket order-book thinness for the ~21% of sports candidates that are not stale-eligible.
5. Base-rate evidence's binary-direction formula may manufacture false confidence for heterogeneous categories like sports if enabled without this caveat in mind.
```

No code, threshold, gate, or production state was changed by this task. This report is the only artifact produced.
