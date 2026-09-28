# Prediction Market — Phase 9A: Engine Calibration Forensic Audit & Fix Design

**Date:** 2026-09-28
**Type:** READ-ONLY forensic audit + implementation design. **Nothing is implemented. Nothing is validated.**
**Inputs:** Phase 9 report (`2026-09-28-1020-prediction-phase9-zero-trades-and-losing-edge-audit.md`), `api/predictions.ts` at `origin/main` (read from a detached snapshot; line numbers below refer to that snapshot), read-only PostgREST SELECTs against production, and public Binance market-data GETs (historical klines only).

---

## 1. Executive summary

The Prediction Engine's probability model is not a calibrated estimator. It is structurally a **"revert-to-50%" machine**: whenever *any* evidence item exists it discards the market price entirely, starts from a 50% prior, and adds fixed, binary-direction pushes. Its output range is mechanically bounded to roughly **[7.2%, 92.8%]**, and with only a full-sample Base Rate item active it can output only **25.9%, 50% or 74.1%**. Any market priced outside that band therefore produces a large, fictitious "edge" pointing toward 50% — i.e. the Engine systematically **bets on long-shots and against favorites**, the direction the well-documented favorite–long-shot bias punishes.

Three independent defects compound this:

1. **Base Rate evidence is statistically invalid in every form it currently takes**: its "200 previously-resolved markets" are **29 distinct markets** (one market contributes 36 rows), the sample is unordered and non-deterministic (its YES rate read 42% → 75% → 90% → **99% today**), it is fed only by rows the Engine itself classified VALID (selection bias), and "YES" means different things across question templates. It is active only for crypto, where it is the single largest input (fixed ±1.05 logit).
2. **The crypto trend signal is not a probability of the question** — it has no notion of strike, horizon or polarity. Proof from production: at 2026-09-21 12:31 UTC the Engine priced *"BTC reaches $96k this week"* (85.5%) **above** *"BTC reaches $92k"* (79.5%) — a logical impossibility.
3. **AI evidence is reduced to ±1 and framed against 50%**, so an AI that *agreed with the market* ("highly unlikely", i.e. ~5% vs market 8%) was encoded as a mild push *down from 50%* and could not bring the model anywhere near the market.

A minimal strike-aware model built only from data SignalVerse already uses (Binance klines: spot, 30-day realized volatility, time to expiry, observed window high) — computed strictly from pre-decision data — shows the market prices of all five price-threshold would-open markets were **fair within model uncertainty**. The 55–75 pp "edges" do not exist. Under the proposed design, **all six historical would-open candidates would have been abstentions.**

**Recommendation:** replace the probability combiner with a **market-anchored, bounded-evidence log-odds posterior**, remove Base Rate from the combiner (replace later with a per-question-type market-calibration curve), route evidence by a deterministic **question-type classifier**, add a **strike-aware price-threshold model** as the only admissible quantitative source for crypto price questions, demote AI to a bounded **reviewer with veto power**, and gate actionability with **principled sanity rules** (evidence budget, robust edge, ladder coherence, independent confirmation). Keep `entry_real` OFF until a pre-registered shadow validation passes.

---

## 2. Root cause

| Layer | Defect | Evidence |
|---|---|---|
| Combiner (`combineEvidenceToProbability`, L603) | Prior = 50%, market price ignored whenever evidence exists; discontinuous switch between "model = market" (0 evidence) and "model ≈ 50% ± pushes" (≥1 evidence) | Code; BTC >$72k case: trend neutral, only Base Rate → model 25.9% vs market 94% |
| Base Rate (`computeBaseRateEvidence`, L567) | Pseudo-replicated rows, unordered `.limit(200)`, self-selected, polarity-blind, binary direction | Production query: 200 rows = 29 markets (top 36/30/28 rows); YES rate now 99.0% |
| Crypto trend (`computeCryptoTrendEvidence`, L543) | Close vs 30-day SMA → ±1; not strike/horizon/polarity aware | Monotonicity violation $92k/$94k/$96k at the same second |
| AI (`computeAiEvidence`, L586) | Numeric probability discarded; direction only; reliability 0.4 fixed; framed vs 50% | AI said "highly unlikely" on $92k/$94k/ETH $3.2k and was outvoted |
| Confidence (L613 + L676) | Mean of weight×reliability — a single irrelevant item yields confidence 70 | Bitget-Sep-27: only Base Rate → confidence 70, rank #1 |
| Activation | Base Rate returns `null` below 10 samples; it switched on automatically once `resolve` produced data | First `resolve` tick 2026-09-14 18:01:03 UTC; first Base Rate evidence 18:11:13 UTC |

---

## 3. Current mathematical model (exact)

For a market with YES-book midpoint `m_Y` and evidence items `e_i = (d_i ∈ {−1,0,+1}, w_i, r_i)`:

- **Crypto trend** (only if a crypto symbol is detected): `dist = (close − SMA30)/SMA30`; `d = sign(dist)` if `|dist| > 2%` else 0; `w = min(1, |dist|/10%)`; `r = 0.6`.
- **Base Rate** (any category, if ≥ 10 YES/NO rows in the sample): `d = sign(yesRate − 0.5)`; `w = min(1, n/100)`; `r = min(0.7, n/200)`; with n = 200 ⇒ `w·r = 0.7`.
- **AI** (only when `useAi`; autonomous path = top-10 funnel): `d = +1 if p > 55, −1 if p < 45, else 0`; `w = AI self-reported confidence`; `r = 0.4`.

```
L        = logit(0.5) + Σ 1.5 · d_i · w_i · r_i          (= Σ 1.5·d_i·w_i·r_i)
p_model  = σ(L)                                          if evidence exists
p_model  = m_Y , confidence = 15                          if no evidence
conf_raw = Σ w_i·r_i / max(1, N)
conf     = conf_raw · (0.5 + 0.5·|P−N|/(P+N))            only if both signs present
```

Per side s ∈ {YES, NO}: `p_mkt,s` = that side's own book midpoint; `p_model,NO = 1 − p_model,YES`;
`rawEdge = p_model,s − p_mkt,s`; `netEdge = rawEdge − sign(rawEdge)·min(|rawEdge|, slippage + spread/2)`;
`netEV = (p_model,s − p_exec,s)·100 − fee`.
`decide()` (L744): INSUFFICIENT_DATA (no book / quality < 25 / resolution INSUFFICIENT) → AVOID (liquidity < 10, spread > 16%, HIGH_RISK, `netEV < 0`) → WATCH/NEUTRAL (`|netEdge| < 5` or `conf < 40`) → STRONG (score ≥ 80 & conf ≥ 70) → OPPORTUNITY.

**Consequences, derived from the equations:**
- Maximum |L| = 0.9 (trend: 1.5·1·0.6) + 1.05 (Base Rate: 1.5·1·0.7) + 0.6 (AI: 1.5·1·0.4) = 2.55 ⇒ `p_model ∈ [7.2%, 92.8%]`. The model *cannot* express "3%" or "97%" once any evidence exists.
- A full-sample Base Rate alone ⇒ `p_model ∈ {25.9%, 50%, 74.1%}` regardless of the question.
- Stored evidence reproduces stored outputs exactly (verified: BTC $94k: 0.762 + 1.050 − 0.420 = 1.392 ⇒ 80.1% ✓; BTC $72k: −1.050 ⇒ 25.9% ✓; Bitget-27: +1.050 ⇒ 74.1%, confidence 0.7 ⇒ 70 ✓). This makes a faithful historical replay possible.

---

## 4. Problems found

### P1 — Market price discarded (Area 2)
The market midpoint is used for edge/display but **never** as the model's prior once evidence exists. The design question "should the model start from the market?" has a clear answer: in a liquid prediction market the price is the best available *prior* (it aggregates all public information). Discarding it means every piece of weak evidence is compared to a coin flip instead of to what is already known. Evidence that *agrees* with a lopsided market is misread as disagreement.

### P2 — Base Rate (Area 1, a–g)

| Question | Finding |
|---|---|
| (a) When valid | Only when (i) the reference class is exchangeable with the question (same template/polarity so "YES" means the same kind of event), (ii) one observation per **market**, (iii) deterministic/representative sample, (iv) no selection by the Engine's own outputs, (v) only markets resolved *before* the decision time, and (vi) it does not double-count information already in the price. Under (vi) the only coherent form is a **calibration of the market price itself**: P(YES \| question type, price bucket). |
| (b) When to ignore | Whenever any of (i)–(vi) fails — i.e. always, as currently implemented. |
| (c) Crypto price-threshold | **Invalid** as a YES-rate: whether a ladder strike resolves YES depends on where it sits relative to the final price; a ladder's YES rate reflects its strike spacing, not a probability. |
| (c) Crypto events | **Invalid**: heterogeneous (exchange withdrawals, ETFs, hacks), tiny n. |
| (c) Sports | **Invalid**: for named-outcome markets "YES" is the first-listed outcome (token-mapping fallback to index 0, Phase 3 finding) — arbitrary polarity. Currently inactive (8 resolved rows, all manual). |
| (c) Politics / economics / science | **Invalid** as a raw rate (heterogeneous; 9 / 3 / 0 resolved rows). |
| (d) YES semantics comparable | **No.** "Above $72k", "reach $94k", "Bitget resumes withdrawals" have unrelated YES meanings. |
| (e) Historical comparable | **No.** The crypto sample is 29 markets dominated by a few weekly ladders. |
| (f) Unordered LIMIT 200 | **Yes, biased and non-deterministic**: heap order changes as rows update; each market contributes up to ~288 rows/day (one per 5-min tick) → pseudo-replication; only `VALID_PREDICTION` rows are ever resolved (L1902), so the sample is exactly the markets the flawed model already liked; manual and autonomous rows are mixed. |
| (g) Binary ±1 direction | **Not justified.** A 50.5% and a 99% rate produce the same push; `weight = n/100` confuses sample size with effect size; `reliability ≤ 0.7` is an unmeasured constant. The coherent quantity is a log-odds difference with Beta-Binomial shrinkage. |

**Verdict: remove from the combiner now; replace later** (not "just disable"): a per-question-type **market-calibration adjustment** — "of past markets of this type priced ≈x%, what fraction resolved YES?" — computed per market (one fixed-lead-time snapshot per market, e.g. the first eligible evaluation), deterministic, over *all* evaluated markets (not only VALID ones), shrunk toward the price, and activated per type only above a minimum number of distinct resolved markets. This is the only base-rate form that is polarity-free and does not double-count the price; it directly measures favorite–long-shot bias if present.

### P3 — Crypto trend is not a question probability (Area 3)
`close vs SMA30` says "the coin trended up" — identical for "reach $92k", "reach $96k" and "above $72k". Production ladder snapshot (same second, same event):

| Time (UTC) | $92k model | $94k model | $96k model | $92k mkt | $94k mkt | $96k mkt |
|---|---|---|---|---|---|---|
| 12:26:07 | 32.4% | 32.4% | 85.7% | 13.05% | 7.55% | 3.75% |
| 12:31:13 | 79.5% | 79.5% | **85.5%** | 13.05% | 7.20% | 3.85% |
| 12:36:13 | 80.1% | 80.1% | **86.0%** | 13.05% | 7.95% | 3.95% |

The model is non-monotone in strike (impossible for "reach" questions) and swings 32% → 80% within five minutes (the Base Rate sample flips and AI rechecks vary). The market ladder is monotone and stable.

### P4 — AI outvoted (Area 6)
Why AI lost in the observed cases: (1) its numeric probability is discarded — only ±1 survives; (2) it is framed against 50%, so "~5%, agreeing with an 8% market" is encoded as "somewhat below 50%"; (3) fixed reliability 0.4 < Base Rate 0.7; (4) AI only runs on the top-10 funnel of candidates the flawed model already flagged; (5) confidence averaging let the combined decision stay ≥ 40. AI must stay a reviewer (not the probability authority), but the framework must be able to hear it.

### P5 — Confidence is not confidence
`mean(w·r)` rewards having *one* strong-looking item and penalizes adding a second. A single irrelevant item gave confidence 70 (Bitget-Sep-27, ranked #1).

### P6 — Abstention mislabeled as AVOID (Areas 8, 9)
When no evidence exists, `p_model = m_Y` ⇒ buying at the ask above the mid plus fee ⇒ `netEV < 0` ⇒ **AVOID**. 127,228 of 156,222 evaluations are AVOID; most are really "no information", not a negative judgment. This contaminates abstention-quality measurement.

### P7 — Sports (Area 9)
Zero sports OPPORTUNITY decisions is **correct abstention for the wrong-looking reason**: sports has no admissible evidence (no crypto symbol; Base Rate null because sports rows are `INSUFFICIENT_EVIDENCE` and therefore never resolved — a circularity; AI never reached because the funnel excludes AVOID). It is **not** a filtering issue (0 opportunities exist before the category filter) and **not** fixable by calibration alone; it is a missing-evidence-source issue plus a product-configuration expectation gap (a Sports-only user will never trade today). Do not force sports trades.

### P8 — Resolution rules unverified for price questions
`resolution_source` is empty for all stored crypto TOUCH (191), ABOVE/BELOW-AT (153) and BETWEEN (80) markets; only "Up or Down" markets name `binance.com` (228) / `data.chain.link` (124). The Engine cannot currently verify which price feed/candle resolves a price-threshold market (the rule lives in the market description, which is not stored). A Binance-based model therefore carries **basis risk** unless the template's resolution rule is verified.

### P9 — Question types exist in the data but not in the Engine (Area 4)
Only `category` + `detectCryptoSymbol` exist. Actual distinct-question shapes (production):
- **crypto (887):** reach/hit/dip ≈ 191 · above/below-on-date ≈ 153 · between ≈ 80 · "Up or Down" intraday ≈ 352 · other/events ≈ 112
- **sports (2,640):** "A vs B" 1,819 · spread / O-U / props 442 · ≈379 remainder, predominantly "Will X win on DATE"
- **politics (253):** events/elections ≈ 207 · count brackets (tweet counts) 46
- **economics (5):** threshold ("gas below $3.75") and event
- **science (132):** numeric brackets (temperature), count brackets (tornadoes, launches), events

---

## 5. Proposed corrected model (Areas 2, 6)

### 5.1 Market-anchored bounded-evidence posterior

```
p0      = m_Y / (m_Y + m_N)          de-vigged mid when both books exist, else m_Y
L0      = logit(p0)
for each admissible evidence GROUP g (sources sharing information collapse to one group):
    q_g   = the group's standalone YES probability
    Δ_g   = clip( β_g · (logit(q_g) − L0) , −c_g , +c_g )
L*      = L0 + Σ_g Δ_g
p*      = σ(L*)
```

- `β_g ∈ [0,1]` (trust/shrinkage) and `c_g = ln(LRmax_g)` (maximum odds ratio a source may justify) are **per source and per validation status**, not global constants.
- **Initial (unvalidated) values:** price-threshold model `β = 0.5, c = 1.5` (LR ≤ 4.5); AI reviewer `β = 0.25, c = 0.5` (LR ≤ 1.65); Base Rate/trend: **not admissible** (β = 0).
- **Calibration of β and c from data (the principled route):** after shadow, fit a logistic regression of the resolved outcome on `[L0, logit(q_g) − L0]` over distinct resolved markets (one row per market). The fitted coefficient on the difference term *is* β_g; if its 95% CI includes 0 the source has no demonstrated information and β_g := 0. `c_g` is set from the largest log-odds shift the source has been observed to predict correctly (e.g. the 95th percentile of |Δ| among correctly-signed resolved cases).
- **Properties:** no evidence ⇒ `p* = p0` (no discontinuity); evidence equal to the market ⇒ no shift; agreement with a lopsided market stays lopsided; the posterior cannot move by more than the evidence budget `Σ c_g`.

### 5.2 Correlated evidence
Sources sharing an information set form one group and are **not summed**: {price-threshold model, crypto trend} (both from Binance history) → price model only; trend becomes explanation text, never a probability input.

### 5.3 Resolution risk
Not directional, so it does not change `p*`. It raises the bar: CLEAR → base minimum edge; UNCLEAR → 2× minimum edge; HIGH_RISK → not actionable (unchanged behavior).

### 5.4 Confidence (redefined, still 0–100 for `decide()`)

```
C = 100 · V · A · R
V = validation level of the strongest supporting group: unvalidated 0.5 · shadow-validated 0.8 · production-validated 1.0
A = agreement = 1 − |opposing Δ| / (|supporting Δ| + |opposing Δ|)          (contradiction)
R = robustness = fraction of the model's uncertainty band for which the edge exceeds the minimum
```

A single unvalidated source can therefore never exceed 50; contradiction and fragility reduce it.

### 5.5 AI as reviewer (Area 6)
- Keep the AI's numeric `probabilityYes` in the evidence object (additive field in the existing `evidence` jsonb — no migration).
- Bounded contribution (β = 0.25, c = 0.5).
- **Cannot create a trade alone** (see H3).
- **Veto:** if the AI's `q_AI` sits on the opposite side of `p0` from the proposed trade by more than δ (initial 5 pp), the decision becomes non-actionable. AI can stop a trade; it cannot start one.

---

## 6. Question-type design (Area 4)

Deterministic classifier `classifyQuestion(category, question, event_slug)` → `{type, params}`, regex-based on the actual shapes above, **default `OTHER` (abstain)**. Types are introduced only where production data shows the shape exists:

| Type | Recognizer (examples from production) | Params |
|---|---|---|
| `CRYPTO_PRICE_AT` | "Will the price of Bitcoin be above/below $72,000 on September 18?" | symbol, K, direction, T=end_date |
| `CRYPTO_PRICE_TOUCH` | "Will Bitcoin reach/hit/dip to $94,000 September 21-27?" | symbol, K, up/down, window=[start_date,end_date] |
| `CRYPTO_PRICE_RANGE` | "…between $X and $Y…" | symbol, K1, K2, T |
| `CRYPTO_UP_DOWN` | "Bitcoin Up or Down - September 10, 2PM ET" | (intraday) |
| `CRYPTO_EVENT` | "Will Bitget resume withdrawals by…" | — |
| `SPORTS_MATCH` | "A vs B", "Will X win on DATE" | — |
| `SPORTS_LINE` | "Spread: …", "O/U …", "leading at halftime" | — |
| `COUNT_BRACKET` | "Elon Musk post 20-39 tweets", "40 to 59 tornadoes", "<100 launches" | — |
| `NUMERIC_BRACKET` | "temperature increase by between 1.30ºC and 1.33ºC" | — |
| `POLITICAL_EVENT` / `ECONOMIC_EVENT` | remaining politics / economics | — |
| `OTHER` | anything unmatched | — |

**Admissible evidence per type:**

| Type | Price model | AI reviewer | Market-calibration (future) | Trend | Raw Base Rate | Autonomous entry now |
|---|---|---|---|---|---|---|
| CRYPTO_PRICE_AT / TOUCH / RANGE (whitelisted template) | ✅ primary | ✅ bounded + veto | ✅ when available | ❌ | ❌ | allowed only via H1–H8 |
| CRYPTO_UP_DOWN | ❌ | ❌ | ❌ | ❌ | ❌ | abstain (<24 h, no model) |
| CRYPTO_EVENT, SPORTS_*, COUNT/NUMERIC_BRACKET, POLITICAL/ECONOMIC_EVENT, OTHER | ❌ | ✅ bounded + veto (cannot trade alone) | ✅ when available | ❌ | ❌ | **abstain** until a validated source exists |

Question type is recomputed deterministically from the stored question text for analytics — **no new column required**. It is also written into the explanation for UI transparency.

---

## 7. Crypto price-threshold design (Area 3)

### 7.1 Data already available (no new vendor)
Binance public klines (the Engine already calls `data-api.binance.vision`): 1-minute (spot), 1-hour (window extremes), 1-day (volatility). Market fields: question text (strike, polarity), `start_date`, `end_date`, `event_slug`.

### 7.2 Minimum viable model (zero drift, lognormal, realized volatility)

```
S   = close of the last fully CLOSED 1-minute candle with closeTime < decision ts
σd  = sample std-dev of 30 daily log returns from candles closed before ts
τ   = (end_date − ts) in days ;  s = σd · √τ

CRYPTO_PRICE_AT (above K at T):   q = Φ( (ln(S/K) − s²/2) / s )        below: 1 − q
CRYPTO_PRICE_RANGE [K1, K2):      q = q_above(K1) − q_above(K2)
CRYPTO_PRICE_TOUCH (reach K↑):    if max(high since window start — 1h candles plus 1m candles for the current partial hour,
                                         all with closeTime < ts) ≥ K → touched (skip: already decided)
                                  else q = min(1, 2 · (1 − Φ( ln(K/S) / s )))      (reflection principle)
                                  dip K↓: symmetric with lows and ln(S/K)
Uncertainty band: evaluate at σd × 1.0 and σd × 1.5 (fat-tail / realized-lags-implied stress)
```

By construction, q is monotone in K for TOUCH and AT questions — the ladder incoherence of §4 P3 becomes impossible.

### 7.3 Worked examples (computed for this audit from pre-decision data only; illustrative, NOT validation)

| Market | Decision ts | Spot | Strike distance | τ | σd | Mkt YES | Old model | Price model σ×1 .. σ×1.5 | Proposed p* (β .5, c 1.5) | Proposed YES edge (before costs) | Outcome (joined after) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| BTC > $72k Sep 18 | 09-16 11:41 | 76,020.7 | −5.29% | 2.18 d | 2.58% | 94.0% | 25.9% | 92.0% .. 82.2% | 93.0% .. 89.4% | −0.9 .. −4.5 pp | YES |
| BTC reach $92k | 09-21 12:31 | 85,085.4 | +8.13% | 6.64 d | 1.92% | 13.1% | 79.5% | 11.5% .. 29.4% | 12.3% .. 20.0% | −0.8 .. +6.9 pp | NO |
| BTC reach $94k | 09-21 12:36 | 85,350.0 | +10.13% | 6.64 d | 1.92% | 8.0% | 80.1% | 5.2% .. 19.4% | 6.4% .. 12.6% | −1.5 .. +4.7 pp | NO |
| BTC reach $96k (sibling) | 09-21 12:31 | 85,085.4 | +12.83% | 6.64 d | 1.92% | 3.9% | 85.5% | 1.5% .. 10.5% | 2.4% .. 6.4% | −1.4 .. +2.6 pp | n/a |
| ETH reach $3,200 | 09-21 21:46 | 2,774.8 | +15.32% | 6.26 d | 2.38% | 6.3% | 81.9% | 1.6% .. 11.0% | 3.3% .. 8.4% | −3.1 .. +2.0 pp | not yet |

In every case the market lies **inside** (or at the edge of) the model's uncertainty band. For the four touch markets the edge changes sign across the band; for BTC > $72k the NO-side edge stays positive but only +0.9 .. +4.5 pp, below the 5 pp minimum even before spread and fee. Every case is therefore an abstention under H2. Window highs from hourly candles (85,299.87 BTC; 2,807.34 ETH) and the 1-minute spot confirmed none of the touch strikes had been hit at decision time.

The two Bitget markets are `CRYPTO_EVENT`: there is no admissible quantitative source, and AI alone cannot originate a trade (H3), so both are abstentions regardless of what the AI said. Hence **0 of the 6 historical would-open candidates would be actionable** under the proposed design. This is an expectation from hand-computed examples, not a validated result — it must be re-confirmed by the implemented replay (§9, §11 I).

### 7.4 Admissibility conditions (fail closed → abstain)
Supported symbol with a Binance USDT pair · strike parsed unambiguously (single "$" figure, k/m handled) · date consistent with `end_date` · ≥ 25 closed daily candles · spot freshness ≤ 2 min · τ inside the existing [24 h, 7 d] Time Horizon Gate · **template whitelisted by `event_slug` prefix with a manually verified resolution rule** (e.g. `bitcoin-above-on-…`, `what-price-will-bitcoin-hit-…`, and the ETH equivalents), with the resolution feed recorded next to the whitelist entry.

### 7.5 Explicitly excluded from autonomous entry
`CRYPTO_UP_DOWN` (intraday, < 24 h) · any non-whitelisted template · stablecoin/de-peg questions · `CRYPTO_EVENT` (Bitget, ETFs, hacks, listings) · anything where §7.4 fails.

---

## 8. Edge sanity design (Area 5)

No arbitrary edge cap. Each rule has a stated principle.

| # | Rule | Principle |
|---|---|---|
| H1 | **Evidence budget:** `|L* − L0| ≤ Σ c_g` (structural, §5.1) | An evidence source may move the odds only by the likelihood ratio its track record supports. "8% → 80%" is an odds ratio of **46×**; no unvalidated source is allowed more than 4.5×, so it is impossible by construction. |
| H2 | **Robust edge:** the edge vs the executable price (ask + fee) must exceed the minimum across the **entire** model uncertainty band (σ×1.0 and σ×1.5) | A decision must not depend on which plausible volatility is true. |
| H3 | **Independent confirmation:** actionable only if ≥ 1 admissible quantitative/validated group supports the side; AI alone never suffices; generic evidence never suffices | Prevents a single weak or generic item from creating a trade. |
| H4 | **AI veto** (δ = 5 pp initially) | Reviewer can block, never originate. |
| H5 | **Ladder coherence:** for markets sharing `event_slug` + template, model outputs must be monotone in strike (TOUCH/AT) and brackets must sum to ≈ 1; violation → abstain the whole event and log an alert | A coherent probability model cannot violate these identities; a violation is a model bug detector (the old Engine fails it). |
| H6 | **Tail region:** if `p_exec < 10%` or `> 90%`, additionally require the **low** end of the band to exceed `1.5 × p_exec` (long-shot buy) or the symmetric condition for favorites | In the tails small absolute errors are large odds errors, and the empirical favorite–long-shot bias works against buying long-shots. |
| H7 | **Friction & resolution:** edge measured against the executable price including fee; UNCLEAR resolution doubles the minimum edge; HIGH_RISK blocks | Edge must be real after costs and resolution uncertainty. |
| H8 | **Stability:** the same side must be actionable on ≥ 2 consecutive ticks | Production showed 32% ↔ 80% flips within 5 minutes; a genuine edge does not vanish between ticks. |

"No admissible evidence" becomes **INSUFFICIENT_DATA** (existing enum value — no schema change), not AVOID, so abstention is measured honestly.

---

## 9. Historical replay methodology (Area 7)

**Scope:** the 6 would-open markets, their ladder siblings (`event_slug` groups), and — for statistical context — the first eligible decision of every one of the 29 OPPORTUNITY markets (and, later, of all resolved markets).

**Inputs per decision (all stored or reconstructible without look-ahead):** `ts`, stored YES midpoint (`market_probability`), stored `evidence` items (direction/weight/reliability/summary), market row (`question`, `start_date`, `end_date`, `event_slug`), Binance klines fetched with `endTime < ts` and filtered to `closeTime < ts`.

**Procedure:**
1. **Fidelity check:** recompute the OLD model from stored evidence; it must reproduce stored `model_probability` and `confidence` exactly (verified manually in §3 for three cases). Any mismatch aborts the replay.
2. Classify the question (§6); compute price-model inputs strictly from pre-`ts` data; compute the NEW posterior, band, gates H1–H8 and decision.
3. **Only after** all decisions are computed and written to the replay output, join `resolved_outcome` / `resolved_at` and assert `resolved_at > ts` for every row.
4. Score both engines (Brier, log loss, would-open outcomes) on **one observation per market**.

**Output columns (per decision):** market · question type · ts · market probability · old model probability · new model probability (band) · old edge · new edge (band) · old decision · new decision · evidence used (old) · evidence used (new) · gate that blocked (if any) · outcome · `resolved_at > ts` assertion.

**Known limitation (documented, not hidden):** the AI's numeric probability was never stored (only ±1 direction and a text summary), so the replay can use AI only as a direction-based veto. Going forward the numeric value must be stored (§5.5).

**Anti-cherry-picking:** the replay set, parameters (β, c, δ, band, minimum edge) and scoring rules are fixed **before** running it; parameter changes after seeing results require re-running on a held-out time window.

---

## 10. Shadow validation criteria (Area 8)

Pre-registered; **all** must pass before `entry_real` can be considered. Success is *not* "more trades".

| Criterion | Requirement |
|---|---|
| Unit of analysis | **One observation per distinct market** (first eligible v2 evaluation) — never per 5-minute row (the pseudo-replication in §4 P2 f) |
| Duration | ≥ 28 days of v2 shadow (≥ 4 weekly crypto ladder cycles) |
| Resolved sample | ≥ 300 distinct resolved markets overall; ≥ 100 for every question type allowed to trade |
| Qualified opportunities | ≥ 30 distinct **resolved** would-open markets before any activation decision (a minimum to detect gross miscalibration, not proof of profitability; ≥ 100 recommended for a profitability claim) |
| Brier vs market | Paired on the same markets: `Brier(v2) ≤ Brier(market price)`; 95% bootstrap CI upper bound of the difference ≤ +0.002 |
| Log loss vs market | Same paired test |
| Calibration | ECE (10 equal-count bins) ≤ 0.03; no bin off by > 2 SE; reliability diagram published |
| Would-open calibration | Σ outcomes vs Σ p* within 95% CI; mean realized edge `mean(outcome − p_exec)` lower 95% bound > −0.02 and point estimate > 0 **after fees** |
| False positives | Reported against the loss rate *implied by entry prices* (a long-shot bettor expects frequent losses — raw loss rate alone is misleading) |
| Edge distribution | Zero would-opens violating H1 (would indicate a bug); edges > 25 pp flagged for manual review |
| Ladder coherence | Zero H5 violations |
| Breakdowns | Every metric by category and by question type; any type with Brier worse than market → disabled for entry |
| Abstention quality | Share and reasons of abstention; realized edge on abstained markets ≈ 0 while would-open set shows positive realized edge |
| Stability | ≤ 5% of would-open decisions flip side within 1 hour |
| Old vs new | v1 recomputed from stored evidence on the same markets, reported side by side |

---

## 11. Exact implementation plan (Area 10, A–L)

### A. What must change
1. Add `classifyQuestion()` (pure, deterministic, default `OTHER`).
2. Add `priceThresholdProbability()` (pure) and `fetchPriceModelInputs()` (reuses the existing Binance klines endpoint; adds high/low and 1m/1h intervals; per-tick per-symbol cache; fails closed).
3. Replace `combineEvidenceToProbability()` with a market-anchored combiner (§5.1) and redefine confidence (§5.4).
4. Stop adding Base Rate and crypto-trend items as probability evidence in `evaluateMarket()` (trend remains explanation text only).
5. `computeAiEvidence()`: retain numeric `probabilityYes`; apply bounded contribution + veto.
6. `evaluateMarket()`: de-vigged `p0` from both books; call the classifier; route admissible evidence by type.
7. `decide()`: add H1–H4, H6, H7 gates with reason codes; "no admissible evidence" → INSUFFICIENT_DATA.
8. `autonomousEntryTick()`: add H5 (ladder coherence per `event_slug`) and H8 (two-tick stability) before ranking.
9. `recordPrediction()`: write `model_version = 'v2'` (existing column, currently always DB default `'v1'`); include question type and gate reasons in `explanation`.
10. UI: Persian/English labels for the new reason codes and question types (existing `fa ? … : …` convention).

### B. What must NOT change
Kelly sizing (`recommendPositionSize`, `computeAutonomousPositionSize`) · multi-user accounts, category preferences, duplicate protection · Tradeability Gate thresholds · Time Horizon Gate · resolution/settlement logic and CLOB lookups · lifecycle sweeps · credit policy semantics · scheduler, `jobs.d` gates (entry stays OFF) · database schema (no migration needed) · Real Trading, wallet/signing/order execution · Futures, Spot, Fast Trader, Autonomous Supervisor.

### C. Functions/modules affected (all in `api/predictions.ts`, snapshot line numbers)
`computeCryptoTrendEvidence` (543, demoted to explanation), `computeBaseRateEvidence` (567, removed from the combiner; redesign deferred), `computeAiEvidence` (586), `combineEvidenceToProbability` (603, replaced), `applyContradictionPenalty` (676, folded into §5.4), `decide` (744), `evaluateSide` (1026), `evaluateMarket` (1073), `recordPrediction` (1171), `autonomousEntryTick` (AI funnel at 1596; H5/H8), plus new `classifyQuestion`, `priceThresholdProbability`, `fetchPriceModelInputs`; `src/app/App.tsx` for labels only.

### D. Equations
§5.1 (posterior), §5.4 (confidence), §7.2 (price model), §8 (gates).

### E. Evidence weighting changes
Base Rate β: 0.7-equivalent → **0** (removed) · crypto trend: up to 0.9 logit → **0** (explanation only) · AI: ±0.42 direction-only → bounded numeric (β 0.25, c 0.5) + veto · price model: new, β 0.5, c 1.5 (unvalidated), to be re-fit from shadow data.

### F. Question-type routing
§6 tables.

### G. Price-threshold handling
§7.

### H. Edge validation
§8 H1–H8.

### I. Tests required
- Classifier: every production shape in §4 P9 (≥ 3 real examples each) plus negatives ("Ethiopia", "solar", intraday "Up or Down").
- Price model: known values (touch with S ≥ K → touched; q monotone decreasing in K; AT at S = K ≈ 50% − convexity; RANGE sums; band ordering).
- Combiner: no evidence → p0; q = p0 → p0; H1 budget never exceeded; β = 0 → p0; lopsided agreement stays lopsided.
- Gates: H2 robustness, H3 AI-alone blocked, H4 veto, H5 incoherent ladder blocked, H6 tail rule, H7 UNCLEAR doubling, H8 stability.
- **Regression:** with the stored inputs of the six Phase 9 would-open cases, v2 must not produce `would_open = true` (expected per §7.3; must be confirmed by the implemented code, not assumed).
- **No-look-ahead guard:** any price input with `closeTime ≥ ts` fails the test.
- i18n: Persian/English for every new reason/type label.
- Existing suite stays green; tests encoding the old combiner/Base Rate behavior (`scripts/prediction-market-engine-test.mjs` L162–195 mirror of `combineEvidenceToProbability` and the ≥ 10 Base Rate guard; L222 wording about AI arithmetic) are updated with a documented reason, not silently deleted.

### J. Historical replay tests
§9, as a read-only script (SELECT + public klines only), with the fidelity check as a hard precondition.

### K. Shadow validation criteria
§10.

### L. Rollback strategy
- Entry stays OFF throughout, so v2 cannot open positions; its live impact is limited to decisions/explanations (including manual analysis).
- Every v2 row carries `model_version = 'v2'`, so v1/v2 rows are always separable for analysis.
- Rollback = `git revert` of the single implementation PR and redeploy through the existing CI (no schema or data to undo).
- Abort criteria during shadow: any H1 or H5 violation (bug), Brier worse than market beyond the §10 bound, or unexplained decision instability.

---

## 12. Risks

| Risk | Mitigation |
|---|---|
| Resolution-feed basis risk (Polymarket may resolve on a different pair/candle than Binance spot) | Template whitelist with manually verified rules (§7.4); unknown → abstain |
| Realized volatility lags implied volatility; lognormal underestimates tails | σ×1.5 stress band + H2 robustness + H6 tail rule |
| Initial β/c values are judgment calls until fitted | Conservative values; §5.1 fit from shadow data; pre-registered |
| Classifier misroutes a question | Default `OTHER` → abstain; whitelist-only for quantitative routing |
| Binance data unavailable | Fail closed (abstain), never fall back to stale or fabricated data |
| **Product/revenue impact:** manual analysis charges credit only on OPPORTUNITY/STRONG decisions; a truthful Engine will produce far fewer, so manual-analysis credit deductions will fall | Flag to owner before implementation; this is the intended consequence of honest decisions |
| Users expect trades after opting in | Very few trades by design; UI must state that the Engine abstains when it has no validated edge |
| Additional API calls per tick | Per-tick per-symbol cache (~6 symbols ⇒ ~18 extra GETs per tick) |

---

## 13. Explicit statement of no changes

This phase was **read-only**. No change was made to `api/predictions.ts` or any other source file, the database (SELECT queries only), migrations, the VPS, the scheduler or `jobs.d` gate files, production configuration, user account settings, Futures, Spot, Fast Trader, the Autonomous Supervisor, wallet/signing/order execution, or Real Trading. `prediction-enter-cron` was not installed or enabled. No test production records were created. Nothing was deployed. The worked examples in §7.3 were computed locally from public historical market data and stored production rows for design illustration only; **no fix is implemented and nothing is validated**. The next step is owner review of this design; implementation requires a separate, explicit instruction.
