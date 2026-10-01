# Prediction Market — Coverage Expansion / Opportunity Availability Audit

Date: **2026-10-01**, started 09:09 Asia/Kuala_Lumpur (01:09 UTC). Investigation measurements: 01:13–01:22 UTC. Report preparation and publication follow those measurements. Scope: **AUDIT + RESEARCH + DESIGN ONLY**.

Production release: **6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d**. Source inspected: **90543d9e29ded2b5650c7ca117a72b64ec1cb9bc**. The source difference from production is documentation only; Prediction executable code is identical. No implementation, deployment, migration, production configuration change, production DB write by this investigation, new gate, scheduler change, threshold change or forced trade.

Concurrent source publication: at 01:33 UTC, remote `main` had advanced independently to **2ac087e618cbde08ca4d46ab3d541c0add31f06b**, nine commits ahead of the inspected source. GitHub's compare lists unrelated terminal/news changes, including executable files, and no `api/predictions.ts` change. These commits were not integrated, reviewed as a release or deployed by this task. The claimed documentation-only difference applies to the inspected SHA above, not to that concurrent main. The task-specific handoff is kept on `codex/prediction-coverage-expansion-audit`; main is not overwritten.

## A. Executive Summary

The engine has a small **admitted evidence surface**, not a demonstrated broken entry executor. Quantitative routing currently admits only three crypto price shapes through four explicitly verified Binance templates. Other classified types have no quantitative adapter; H3 specifically requires a supporting `PRICE_MODEL` group. A sports/forecast/event model cannot be plugged into autonomous entry with H3 literally unchanged by giving it another group, nor may it be mislabeled as a price model to bypass the gate.

The previous 150-row forensic cohort is used as an anchor, not re-audited: **98 lacked admitted quantitative evidence = 19 unverified Touch + 79 other unsupported types**. Of the 98, 44 also lacked sufficient book/prior data. None of these observations proves that its underlying event is mathematically impossible to model. It proves that an admissible, independently validated model and/or exact resolution contract is absent. A public source that can eventually tell the outcome is not necessarily a source that can forecast it.

There is one concrete small coverage gap: **six BTC/ETH weekly Touch markets crossing September/October** use the same Binance one-minute High rule as the existing weekly family, but the whitelist regex permits only a single month. Their stored starts also agree with the proper seven-day ET window after hour flooring. They account for **16/150 observations**. All six are still registered ELIGIBLE in the fresh inventory and have 24h–7d remaining. This is an explicitly documented proposed patch, **not applied**.

An offline use of the existing price functions, with public historical candles filtered before the original timestamps, supplies inputs for all 16 observations and finds no already-hit strike. **0/16 modeled YES edges are positive at the stored best ask; 0 reach 5pp.** Even the unchanged price-only log-odds cap cannot push YES past 5pp in any of the 16. Full original NO books, depth, AI and revalidation receipts are unavailable, so the NO-side confidence/H1–H8/would-open funnel cannot be certified. This coverage fix would make more markets analyzable; it does not promise trades or PnL.

Two separate mathematical/design limitations need review before expanding scope: current Touch uses zero-log-drift reflection while terminal AT uses zero-price-drift lognormal; these are different assumptions, already present in the approved Phase 9A design. RANGE is a valid terminal interval probability, but a band constructed from volatility endpoints alone can miss an interior probability maximum. A deterministic counterexample is recorded in G. Neither was changed.

**Smallest safe next work:** offline tests and a shadow-only proposal for the exact cross-month weekly High family, preserving weights, fees, H1–H8, thresholds and existing modes. A blanket regex extension deployed while Demo Entry is ON would immediately admit these markets to Demo evaluation; it is therefore not a safe substitute for reviewed shadow routing and validation. Non-price models remain research/shadow only. **Phase 9A statistical validation is NOT complete.**

## B. Current Production State

Read-only SSH/SQL at 2026-10-01T01:13:40Z and 01:22:22Z verified the exact deployed marker and release symlink. The service process working directory at the first check selects the same release; health returned `ok:true` at both checks. Core and admin symlinks at the final check both select the exact release above. No restart was issued.

| Control | Observed state / evidence |
|---|---|
| Autonomous Prediction Demo Entry | ON: existing root-owned empty gate, mode default ON; no setting row overrides it |
| Prediction Real Trading | OFF: setting absent/default false; source Real execution remains 501 and status hardcoded disabled |
| Autonomous Prediction Learning | OFF: learn gate absent, no new learn runs since activation |
| Prediction autonomous ledger | 0 total / 0 open at 01:13 and 01:22 UTC |
| Prediction real ledger | 0 rows at both checks |
| Natural runs since activation, first snapshot | discover 49, Demo entry 49, shadow 49, resolve 48; zero failed recorded runs |
| Latest completed Demo run read | 01:16:48.512–01:19:14.291 UTC; success, null run error, 50 recorded, 0 opened |
| Collector registry, final snapshot | 269 registry objects, 159 with an observation, 4 `scoreEligible=true` flags |

The four collector flags are **not independently verified scoring rows in this task**. No calibration score was computed. Normal pre-existing discovery/shadow/entry/resolver jobs continued their authorized writes while this investigation used SELECT-only transactions. “Production not modified” means no modification by this investigation, not that background tables stopped changing.

Prediction source LF Git-blob/production SHA-256: `027b07f5ff3fe67fa2fafcb52b7be4d64c934ed7cabd2509cce7d9f4a9599ce8`. A Windows working-file byte hash differs because of CRLF; the Git blob matches production. Runner: `e5065de3cca0911815cbab94bfdfa8187d4f26578372e5481690ff6dff46e0c9`; fast timer: `bb26913779d6caf74fae0678500e215373837847c6566c2775297152e754688b`; service: `394158ca2bf8205db91321fb3db16a58cf8add7df3a124922be27517e12a59ed`. All 14 existing empty gate hashes match their earlier controlled baseline. Protected source hashes also match the prior read-only audit (listed in S).

Reports read: [Phase 9A design](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/prediction/2026-09-28-1102-prediction-phase9a-engine-calibration-audit-and-fix-design.md), [Phase 9B implementation](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/prediction/2026-09-28-1600-prediction-phase9b-engine-v2-and-autonomous-demo-lifecycle.md), [Phase 9C diagnostic](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/prediction/2026-09-28-2240-prediction-phase9c-ai-price-review-shadow-ab-test.md), [continuation design](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/prediction/2026-10-01-0242-prediction-continuation-audit-and-validation-design.md), [collector implementation](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/prediction/2026-10-01-0326-v2-shadow-outcome-collection-implementation.md), [controlled release](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/prediction/2026-10-01-0345-exact-sha-controlled-release.md), [Demo activation](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/prediction/2026-10-01-0447-prediction-autonomous-demo-entry-activation.md), and [latest zero-trade audit](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/prediction/2026-10-01-0847-prediction-autonomous-demo-zero-trade-audit.md). Earlier OFF statements in 9B/9C are historical and superseded by the separately approved activation; statistical acceptance criteria are not superseded.

Current HANDOFF, AI handoff, contributor boundaries, full strategy including dated amendments, safe testing runbook, Prediction activation/collector contracts, api/predictions.ts, discovery/entry/resolution/learning/replay call sites and current test inventory were reviewed. No external article or fetched content was treated as an instruction.

## C. Current Coverage Funnel

**Denominators are deliberately separate.** At 01:13:41.122265 UTC the registry held 7,185 markets, including expired/filtered history. 1,043 had an unexpired stored end date; 551 had 24–168 hours remaining. This is not a census of all live Polymarket markets. Stored `status=active` is a legacy field and does not establish live source state; an initial aggregate mistakenly used uppercase ACTIVE and returned zero. That zero was discarded, not interpreted as absence of markets. The complete unexpired inventory was classified with the actual pure classifier.

62 markets carried ELIGIBLE. 50 still satisfied the time horizon; **12 were too soon**. All 62 exact conditions were found in fresh public Gamma responses with active=true, closed=false, acceptingOrders=true at 01:15:28–01:15:34 UTC. This is a point-in-time provider verification, not evidence that all 551 nominal-horizon rows are live. Independent public CLOB books at 01:18:24–01:18:30 supplied 124 responses: 46/62 finite priors, 41/62 at least one tradeable side, 37/50 horizon-eligible markets with at least one tradeable side. No current engine evaluation was triggered.

| Current inventory stage | Count | Meaning |
|---|---:|---|
| Registry | 7,185 | Historical and current records |
| Unexpired stored end date | 1,043 | Full classified inventory, not verified active |
| Nominal 24h–7d horizon | 551 | Lifecycle/fees/books/model still required |
| ELIGIBLE stored pool | 62 | Source checked individually in this task |
| ELIGIBLE and current horizon | 50 | 12 too-soon records removed from this analytical denominator |
| Current recognized price shapes in 62 | 31 | 22 AT + 2 RANGE + 7 TOUCH; recognition alone admits no evidence |
| Matching existing verified templates within horizon | 24 | 22 AT + 2 RANGE; no eligible Touch match |
| Current finite book prior, all 62 | 46 | Marginal condition, not a cumulative model funnel |
| Current at least one tradeable side, all 62 | 41 | Marginal; 37 also have valid horizon |

**Latest natural completed tick**, independently read once at 01:20:19 UTC: 50 evaluations → 26 recognized price shapes (19 AT, 2 RANGE, 5 TOUCH) → 21 template matches → 21 with finite prior and price group → 10 positive chosen edges → **0 edge >=5pp / 0 confidence >=40** → 0 actionable/H1–H8 complete → 0 cumulative surviving tradeable candidates → 0 would-open true → 0 opened. There were **30 marginal chosen-side tradeable evaluations**, and all 50 `would_open` values were NULL. NULL is “annotation stage not reached”, not a recorded false. This is a current coverage anchor, not another full zero-trade forensic audit. The run took about 145.8 seconds; a successful run alone does not certify every upstream AI response or timeout. H4 veto was reported for two rows; missing provider response/error details were not reconstructed.

The prior cohort funnel remains 150 → 52 verified/data/price-group rows → 21 positive chosen edge → 0 confidence → 0 complete-gate candidates. Its **93 marginal tradeable rows** must not be confused with zero cumulative survivors after the confidence/gate filters.

## D. Complete Question-Type Inventory

“Current markets” below means the complete unexpired registry at the stated inventory time. “Horizon” is stored end date 24h–7d, regardless of current source lifecycle. “Pool H” means ELIGIBLE and within horizon. Cohort counts are the existing first-three-run 150-row dataset; latest counts refer only to the single new completed run. “Evidence” means an admitted `PRICE_MODEL` group, **not completed statistical validation**.

| Type | Unexpired | Horizon | Pool | Pool H | Prior cohort markets / evaluations / evidence | Latest evaluations / evidence |
|---|---:|---:|---:|---:|---|---|
| CRYPTO_PRICE_AT | 29 | 22 | 22 | 22 | 18 / 46 / 46 | 19 / 19 |
| CRYPTO_PRICE_TOUCH | 39 | 6 | 7 | 6 | 7 / 19 / 0 | 5 / 0 |
| CRYPTO_PRICE_RANGE | 4 | 2 | 2 | 2 | 2 / 6 / 6 | 2 / 2 |
| CRYPTO_UP_DOWN | 1 | 0 | 0 | 0 | 0 / 0 / 0 | 0 / 0 |
| CRYPTO_EVENT | 82 | 3 | 6 | 0 | 6 / 16 / 0 | 5 / 0 |
| SPORTS_MATCH | 573 | 494 | 8 | 8 | 12 / 26 / 0 | 4 / 0 |
| SPORTS_LINE | 7 | 6 | 2 | 2 | 2 / 5 / 0 | 2 / 0 |
| COUNT_BRACKET | 14 | 6 | 2 | 1 | 1 / 3 / 0 | 1 / 0 |
| NUMERIC_BRACKET | 1 | 0 | 0 | 0 | 0 / 0 / 0 | 0 / 0 |
| POLITICAL_EVENT | 130 | 9 | 10 | 9 | 7 / 21 / 0 | 9 / 0 |
| ECONOMIC_EVENT | 4 | 0 | 0 | 0 | 0 / 0 / 0 | 0 / 0 |
| OTHER | 159 | 3 | 3 | 0 | 3 / 8 / 0 | 3 / 0 |

The unexpired columns sum to 1,043; horizon to 551; pool to 62; pool H to 50. Counts of evaluated markets do not imply independent statistical observations: sibling strikes share a path and repeated ticks share information.

| Type | Resolution/model/data requirements and present rejection | H1–H8 compatibility / execution / disposition |
|---|---|---|
| CRYPTO_PRICE_AT | 29 current template matches, 22 in horizon. Exact pair, title date, noon ET candle final Close and strict comparator. Existing zero-price-drift terminal lognormal with closed spot and 25+ daily candles; no extra directional trend. Unknown template/data/horizon must abstain. | Existing PRICE_MODEL/H1–H8 apply. Both own token books, walked ask, fees and all freshness/depth checks remain required. Existing Demo behavior retained; new symbols/templates shadow first. Test date/coin mismatch, noon candle close and boundary polarity. |
| CRYPTO_PRICE_TOUCH | 39 unexpired; 6 nominal-horizon cross-month weekly, all unverified by regex. Six existing daily template matches are outside horizon. Requires complete past rule-window High/Low plus first-passage probability for the remaining window. Missing rule/window/direction/history fails closed. | Verified Binance High crypto family can reuse PRICE_MODEL without changing gates. New lower barriers, long windows or other feed rules need separate validation. New coverage shadow-only initially; current already-touched rejection preserved. Tests F/R. |
| CRYPTO_PRICE_RANGE | 4 current matches, 2 in horizon. Terminal Close interval, not “stays inside” path event. Existing difference of terminal CDFs is appropriate under its assumptions; empirical calibration unknown; band caveat G. | Same PRICE_MODEL and execution path. No duplicate group for AT and RANGE derived from one history. Existing Demo behavior retained; no new current family gain identified. Boundary, probability partition, volatility-interior and rounding tests required. |
| CRYPTO_UP_DOWN | One Binance daily market, 14.77h remaining at inventory, zero in horizon/pool/cohort. Reference candle + final candle; equality pays half. Intraday Chainlink variants are separate sources/templates, not assumed equivalent. No adapter, reference input or tie representation currently admitted. | Return model can share terminal mathematics after reference price is known. Hard 24h gate excludes present market and typical short intervals. Binary-only settlement contract cannot treat ties as a guessed win. SHADOW ONLY; no horizon/settlement changes authorized. |
| CRYPTO_EVENT | 82 heterogeneous current questions; three nominal-horizon Jumper sale records are already marked closed by discovery, zero Pool H. Missing symbol/shape routing for some price barriers; other types concern launch, listing, law, posts, supply/value or specific actors. No validated adapter. | PRICE_MODEL only for a separately verified price event; non-price groups cannot pass current H3 unchanged. Historical book availability does not fix absence of model. SHADOW/research only, precise family-specific tests required. |
| SPORTS_MATCH | 573 nominal current records, 494 in horizon but only 8 in actual pool; 26 prior evaluations, no quantitative group. Classification works for match shapes; source mapping, forecasts and rule exceptions are missing. Named two-outcome pairs and explicit Yes/No markets both occur. | Independent sport model is feasible for selected competitions; cannot pass literal current H3 as SPORTS_MODEL. Must not reuse crypto model or raw YES base rates. SHADOW ONLY; exact participants, rules, time, result source and public forecast vintage required. Own books/fee checks feasible (J). |
| SPORTS_LINE | 7 current, 6 horizon, 2 pool/H; 5 prior evaluations, no group. Current examples NFL Colts -0.5/-1.5; discrete score margin, integer boundaries, overtime/tie/cancel conditions. | Need sport-specific score distribution, not match-win probability alone. Same H3 restriction, named-token/tie risk. SHADOW ONLY; line monotonicity, pushes and settlement mapping tests. |
| COUNT_BRACKET | 14 current, 6 horizon, 2 pool/1 H; 3 prior evaluations, no group. Process-specific counts, inclusion rules, start/end timezone, publication and counting delay. Exact-count launch siblings presently fall into OTHER. | Candidate conditional count model exists, but Poisson assumption is not established for tweets/launches/weather. New COUNT_MODEL fails literal H3. SHADOW ONLY; duplicate/deleted posts, clock, overdispersion, integer partition/source receipts tests. |
| NUMERIC_BRACKET | One current classification is a Climate Clock deadline-change event, not a daily temperature bracket. “°C” alone caused numeric routing. Zero horizon/evaluations/group. | This is a classification overreach to document, not evidence a temperature model applies. Future genuine weather brackets need forecast ensembles, station/time/rounding and issue-time archives. New WEATHER_MODEL fails H3; SHADOW ONLY. |
| POLITICAL_EVENT | 130 current, 9 horizon, 10 pool/9 H; 21 prior evaluations, no group. Events include removal from office, conflict/covert decisions and public policy. Sources often narrative/fallback; deadlines are not outcome time. | Poll/election model possible for specified elections, not a universal incident probability. Event hazard models require comparable timestamped training and objective authority. SHADOW ONLY; source hierarchy, publication delay, cancellation and revision tests. |
| ECONOMIC_EVENT | 4 current, 0 horizon/pool/evaluations. Actual examples are yen-intervention announcements and AAA state gas threshold. Official announcement time differs from underlying intervention time; unrounded gas values/release delay matter. | Specific vintage-aware numeric model possible; opaque discretionary decisions lack demonstrated quantitative source. New ECONOMIC_MODEL fails current H3. SHADOW ONLY; authoritative release/vintage and union-of-state event tests. |
| OTHER | 159 current, 3 horizon but all three F1 outright records; zero Pool H. Prior sample contains launch exact counts and hottest-month rank, demonstrating incomplete specialized classification. | No blanket OTHER model. Reclassifying cannot by itself provide evidence; semantic family and outcome source must come first. Unsupported until separately reviewed. Exact-count and genuine numeric parsers can later improve audit coverage without automatically authorizing Demo. |

For **every type**, the proposed model must return a numeric probability of its exact payout event, preserve the independent market prior, and incorporate that side's actual executable price, fees, slippage and liquidity. That capability is technically available through shared pure functions but was not demonstrated for unimplemented models. No type is labeled best/worst. Demo eligibility is conditional on exact semantics, a valid quantitative adapter, all unchanged gates and separate approval; source existence alone never grants eligibility.

## E. Resolution Coverage Analysis

Current registry-template coverage: **39/1,043 matches** (29 AT, 4 RANGE, 6 daily TOUCH); **1,004 unsupported by the existing template whitelist**. Within nominal horizon **24/551 match**, 527 do not. Within the ELIGIBLE 62, 24 match and 38 do not. Unsupported does not equal ambiguous or non-binary.

111 exact-condition public Gamma GETs were attempted at 01:15 UTC: **100 uniquely matched**, 11 returned no unique matching condition. Those 11 are unknown, not closed or invalid. All 62 ELIGIBLE conditions matched. The wider sample intentionally includes all current Touch, Up/Down, numeric/economic records plus selected crypto event families; it is not random or complete for the 1,043.

All 100 matched responses contain two labeled outcomes: 92 literal Yes/No, 7 named sport pairs, one Up/Down. The 62 pool rows are 55 literal Yes/No + 7 named pairs; **all 62 stored token pairs equal the source's token order**. This verifies pair identity, not forecast polarity or a winner. No >2-outcome condition appeared in this sampled set. Non-binary outcome cardinality for the remaining registry is **unknown**. Events with several binary child markets must not be miscounted as one multi-outcome condition.

11 matched rules mention 50–50 payout, 23 mention a reporting-consensus fallback and 8 postponement; these are overlapping dimensions, not mutually exclusive or a complete ambiguity census. Two token outcomes do not guarantee a binary terminal payout. A 50–50 tie/cancel payout is outside the current collector's binary probability scoring contract; it must not become inferred YES/NO. Outcome observability, semantic authority, token mapping, and certified timing are separate checks.

| Family | Deterministic outcome check possible? | Current disposition |
|---|---|---|
| Verified noon Binance AT/RANGE | Exact pair/one-minute final Close/date/comparator; higher-bracket equality rule for ranges | Existing templates admitted; source rules receipt still needed for each new family |
| Cross-month weekly BTC/ETH Touch | Same Binance final High >= strike, seven ET calendar dates | Public semantics verified now; implementation whitelist unsupported; shadow-first proposal |
| ETH hit 3k by date | Binance High since market creation through deadline | Known source, but long historical window not current seven-day template; current 2.77h horizon rejects it |
| Daily Binance Up/Down | Two exact noon Close values; equality pays half | Deterministic observation, non-binary tie payout; unsupported |
| Soccer win/draw | Regular 90 minutes plus stoppage; postponement changes event time; cancelled win=No but cancelled draw=Yes; source hierarchy includes fallbacks | Cannot infer polarity/closure from title. Template and probability of all rule branches required; shadow only |
| NFL named match/spread | Different win/tie/line rules; cancelled or tied match may pay half | Named-label contract and exception receipts needed; no automatic index-based forecast mapping |
| Crypto ATH | Binance High exceeds complete prior historical High, particular window | Requires authoritative pre-window maximum and complete history, not generic “ATH” text |
| Token launch/listing/law/posts | Source-specific official action/definition; sometimes narrative consensus | Objective source for some families; probability adapter/temporal capture absent |
| Economic AAA/yen | Specified unrounded state data/date; official announcement satisfying conditions | Objectively checkable conditions with delay/context; insufficient current forecast inputs |
| Climate Clock | Exact machine-feed deadline changes beyond +/-30 days, not thermometer | Source-checkable event; temperature model semantically wrong |

Settlement remains the actual CLOB winner-token receipt through the existing resolver, not an audit-inserted Binance answer. Independently observing the rule source is a semantic cross-check; it does not authorize overwriting CLOB or historical outcomes. No CLOB winner/settlement census was performed here. Historical chronology remains uncertified unless the collector observed open after prediction and closed later; end date alone is not proof. The collector freezes first eligible finite-prior v2 shadow observations across abstention classes, excludes fallback-prior rows, isolates v1 and protects conflicts. New families must fit that contract or remain non-scoring; this task does not extend it.

## F. Touch Investigation

The exact event is an extremum over a **specified source window**, not terminal direction:

```text
UP:   Y = 1{ max over source window [a,b] of final one-minute High >= K }
DOWN: Y = 1{ min over source window [a,b] of final one-minute Low  <= K }
```

For the six verified cross-month markets, a=2026-09-28T04:00:00Z (midnight ET), last candle opens 2026-10-05T03:59:00Z (October 4 23:59 ET). Its final value becomes known at the minute close. Stored end=04:00Z is consistent with that boundary. Starts are 04:00:12–19Z on September 28; existing hour flooring agrees with a. The source rules use the date range, not arbitrary market-creation time. Future rules must parse ET calendar dates with `America/New_York`, including DST/month/year boundaries, rather than assuming every week is 168 elapsed hours or creation always equals window start.

The current approved model already computes a Touch probability. For sigma in daily units, tau in days, s=sigma*sqrt(tau), upper log distance d=ln(K/S)>0, it uses `2*Phi(-d/s)`; lower d=ln(S/K) is symmetric. This is the reflection-principle probability for **zero log drift**. Consequently the 19 absent groups in the anchor are primarily **template-admissibility gaps**, not absence of Touch math. The six weekly markets (16 rows) are one verified gap; the seventh creation-to-deadline ETH market (3 rows) has different window semantics and is currently too soon.

A coherent drift-aware formulation for future mathematical review is:

```text
dS/S = muPrice dt + sigma dW
X(t) = ln(S(t)/S0) = nu*t + sigma*W(t)
nu = muPrice - sigma^2/2
tau = remaining duration in the same time units as sigma
h = ln(K/S0) > 0

P(max X(t) >= h before tau)
 = Phi((nu*tau - h)/(sigma*sqrt(tau)))
 + exp(2*nu*h/sigma^2) * Phi((-nu*tau - h)/(sigma*sqrt(tau)))

Lower barrier: h = ln(S0/K)>0 and replace nu with -nu.
nu=0 reduces to 2*Phi(-h/(sigma*sqrt(tau))).
```

This formula is an analytical proposal, not code implemented in this task. Brownian hitting/maxima assumptions are covered in [Columbia's Brownian motion notes](https://www.columbia.edu/~ks20/FE-Notes/4700-07-Notes-BM.pdf). A zero-price-drift assumption would set nu=-sigma²/2, unlike the existing reflection approximation; do not silently change the approved model when fixing a slug. Real-world conditional probabilities require empirical assessment of drift/jumps/volatility, not risk-neutral option valuation presented as a physical forecast.

If the barrier already hit inside the rule window, its event is absorbing. Current policy returns `PRICE_ALREADY_TOUCHED` and abstains; retain that policy. A spot beyond strike is not proof of a qualifying historical candle without a source receipt. If a future window has not started, probability integrates over the distribution of its starting price; applying a first-passage formula from now would incorrectly count pre-window hits. If past window coverage is incomplete, fail closed even when spot is fresh.

Required inputs: exact asset/pair/source, upper/lower comparator and equality, verified calendar boundaries, spot from last fully closed source candle, spot receipt/availability time, 25+ valid consecutive daily candles for sample daily log-return volatility, complete historical extrema since a, remaining duration, symbol trading status, and all book/prior/fee data. The current fetcher has a candle-count check but not a complete cadence/continuity certificate. Full-hour High/Low plus remaining closed minute candles can reconstruct past extrema only if the hour aggregation and window alignment are exact. Non-hour-aligned creation windows require exact partial boundaries, not inclusion of an earlier whole hour.

[Binance kline documentation](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints) defines open/High/Low/Close and close timestamps, UTC query bounds and 1,000-row limits. Binance suffices for the verified six markets. Chainlink, Kraken or another pair must not substitute for that resolution feed. Longer windows need bounded pagination or an independently verified archive; existing 1,000-hour/1,000-minute caps cannot certify arbitrary creation-to-date history.

Failure conditions: unknown/changed rule, mismatched coin, unverified down direction, absent/invalid end, outside 24h–7d, unverified window, unavailable/stale/invalid price data, too few or discontinuous candles, zero/nonfinite volatility, prior absent, already touched, source outage, partial-window gaps, ambiguous tie/cancel/mapping. All remain abstentions.

Calibration risks: constant-volatility diffusion misses jumps, volatility clustering and intraminute discontinuities; 30-day realized volatility can lag current risk; siblings share the same path; selecting only late unhit barriers induces survivorship; higher sigma is not a universal uncertainty interval for every payoff. Walk-forward calibration by window/asset/direction, event-clustered uncertainty, pre-registered holdout and objective minute High/Low outcomes are mandatory. Initial expansion should be shadow only; autonomous Demo is conditional on unchanged gate success and a separately reviewed acceptance decision, never on a desire for PnL.

## G. Range Investigation

Current RANGE evaluates **terminal Close in [L,U)**. At the existing zero-price-drift lognormal assumption:

```text
v = sigmaDaily*sqrt(tauDays)
P(S_T > K) = Phi((ln(S/K) - v^2/2)/v)
q_RANGE = P(S_T > L) - P(S_T > U)
```

For a continuous distribution, strict/inclusive endpoint choices have zero mass and the difference is valid. Actual Binance prices are tick-discrete; exact boundary values go to the higher bracket. A future verified adapter must preserve [L,U), numeric precision and rounding; the continuous approximation must not be used to justify the wrong discrete settlement comparator. An “inside throughout the window” market instead requires survival between two barriers and is **not covered** by this formula.

The four existing range rows in the current registry already match; two within horizon are BTC 74k–76k and 76k–78k October 2. No additional current Range family was demonstrated. Six anchor rows reached evidence; none cleared the opportunity gates. Probability expression correctness is not calibration. Conditional volatility and tail adequacy need paired prospective scoring against market prior.

**Separate proposed correction, not applied — endpoint-only stress is not generally an envelope.** Current qBand takes q(sigma) and q(1.5sigma). Terminal interval probability can peak at an intermediate volatility. Calling the existing pure function offline with synthetic analytical inputs S=100, L=105, U=110, sigmaDaily=.05, tau=1 yields:

| Multiplier | q_RANGE |
|---|---:|
| 1.0 | 0.13173209615982778 |
| 1.5 | 0.15032968743378106 |
| 1.412 (grid maximum) | **0.15082317135562118** |

The intermediate probability exceeds the reported endpoint maximum by about 0.04935pp. This is a deterministic mathematical counterexample, not a production opportunity or proof that a current trade passed incorrectly. For NO, missing a larger YES q can overstate the worst-case NO probability. The intended meaning of qBand (two scenarios vs continuous volatility uncertainty) must be decided. If intended as an envelope, a separately reviewed correction must include stationary points or conservative interval bounds and explicit numerical tolerance; it must not just add a grid and claim guaranteed bounds. Keep thresholds unchanged; test both sides. No correction was implemented.

Market de-vigged book probability stays the prior. Each exact payoff model contributes at most one PRICE_MODEL delta; AT/RANGE/realized-vol/trend derived from the same history are correlated and must not be added as independent groups. Mutually exclusive child brackets can have a common distribution, but posteriors anchored to separate market priors need not partition perfectly; audit partition/coherence without changing H5, which presently covers threshold ladders, not arbitrary range partitions. Buying NO uses its own walked ask, not one minus YES ask. Fees, spread and depth remain the existing shared checks.

## H. Up/Down Investigation

The sole current registered Up/Down market is [Bitcoin Up or Down on October 1](https://polymarket.com/event/bitcoin-up-or-down-on-october-1-2026). Its rules compare final Binance BTC/USDT one-minute Close at September 30 noon ET with October 1 noon ET. Up means later > earlier, Down later < earlier; equal values pay 50–50. It is 14.77h from its stored end at the inventory timestamp, hence outside the unchanged 24h minimum. There is zero measured current opportunity coverage from adding this adapter while preserving the horizon.

When reference R is observed before decision, the same terminal distribution gives `P(S_T>R)`; this is a terminal strike R, not a new trend vote. If R is still in the future, the event is a forward-window return and requires its start/end contract and volatility conditional on that interval; current spot is not a fabricated reference. Spot, R, reference finalization and availability, exact settlement timestamp, source/pair, direction and tie event must be stored separately. Tiny return horizons are sensitive to tick rounding, microstructure, feed timing and drift estimation.

Expected Up payout is P(up)+.5*P(tie), and Down similarly. That is not the current binary Bernoulli scoring target. Do not change Demo settlement or the collector to conceal this. Intraday Chainlink markets cannot use Binance reference values; authenticated report history, source observation/validity times and access requirements must be verified separately. [Chainlink report schema](https://docs.chain.link/data-streams/reference/report-schema-v3) exposes timestamp fields, but this investigation did not establish free complete as-of historical reports. No duplicate price evidence group, relaxed horizon or universal Up/Down template is proposed. Remain shadow/research only until those boundaries are reviewed.

## I. Crypto Event Investigation

Actual current CRYPTO_EVENT questions are heterogeneous. No ETF market was established in this current inventory; it would be inappropriate to claim generic ETF coverage. The following grouping is derived from all 82 current question titles and 33 event slugs, with selective direct rule verification:

| Semantic group | Current registered markets | Examples and model/source boundary |
|---|---:|---|
| Price/relative valuation/ATH | 47 | BTC/ETH/XRP ATH; Hyperliquid/Pump.fun/Zcash barriers; FDV one day after launch; relative LAPTOP/TRUMP value; STRC. Numeric appearance does not mean Binance template. Missing symbol recognition is an ingestion gap for some barriers. FDV requires circulating/fully diluted supply and launch-time contract, often endogenous/unreliable. ATH needs complete historical maximum; race-to-FDV and relative prices need joint first passage. |
| Actor posts | 3 | Trump-family posts about LAPTOP. Specific platform/account, repost/reply/delete/counting definition and archived receipt needed. Market sentiment is not independent quantitative evidence. |
| Launch/airdrop/chain/listing | 18 | Base/MetaMask/Predict.fun/Ink launch, LAPTOP airdrop, selected chain, exchange listing. Official contract/public release/listing receipts can settle conditions; company timing/definition is not a calibrated probability. Hazard model only with comparable historical announcements and timestamped covariates. |
| Exchange withdrawals | 2 | Bitget resumes withdrawals. Official service status plus definition of partial/full/token/network availability; past v1 YES rates are invalid. Do not transact to test service. |
| Public-sale commitments | 3 | Jumper amount thresholds. Exact auction/commitment state and time; all three nominal-horizon rows already filtered as MARKET_ALREADY_CLOSED. Source-verifiable values do not make them current opportunities. |
| Law/legislative votes | 7 | Clarity Act law, Senate totals, named senator votes. Classification by crypto category masks legal/vote semantics. Congress/roll-call/signature sources and exact bill version needed; do not apply price math. |
| Protocol/wallet action | 2 | SHA-256 replacement or Satoshi movement. Chain action may be observable but attribution and protocol-activation definition can be uncertain. Reorg/finality and actor attribution required; no comparable validated rate currently exists. |

Price-like crypto events can sometimes be expressed probabilistically using terminal/joint barrier models, but each feed, asset, supply definition and window must be verified. A directly read rule for LAPTOP uses **Kraken LAPTOP/USD** one-minute High/Low, not Binance. [Kraken OHLC documentation](https://docs.kraken.com/api/docs/rest-api/get-ohlc-data/) limits recent retrieval to 720 bars and includes a current unfinished bar. It cannot retrospectively prove a long missing minute window from one request. Such a source needs prospective capture or a verified archive; replacing it with Binance would create basis error.

ATH and newly recognized crypto symbols are feasible research candidates; present near-deadline ATH and token events have no Pool H coverage. Different event semantics must not share one generic probability model. Raw historical YES rate, direction-only AI, or sentiment is not an independent model. Default shadow/unsupported until exact semantics, source vintage and calibration are proven.

## J. Sports Investigation

Sports are present and classified; absence of markets is **not** the explanation. Nominal 573 MATCH/7 LINE records include stale source history despite future stored end dates. Only 8 MATCH + 2 LINE are currently ELIGIBLE/horizon-valid; fresh public books make at least one side tradeable for 5 MATCH + 1 LINE at the captured time. The previous 26+5 evaluations had no admitted quantitative group. Classification does not reject all sports; there is no sports probability adapter and H3 admits only PRICE_MODEL.

Actual eligible events include China–Turkmenistan soccer win/draw, NFL Colts–Commanders match/-0.5/-1.5 spread, tennis participant matchups, cricket South Africa–Australia, and MLB Red Sox–Yankees. These cannot share a single score model. Rules inspected for soccer count regular 90 minutes plus stoppage; cancellation resolves draw Yes but a named win No; postponement leaves it open; late official result may use Flashscore/Sofascore/credible consensus; missing acceptable results can pay half. NFL match, spread and tie conditions differ. A two-token named market needs explicit modeled-event-to-token labeling, not a YES-frequency shortcut.

A feasible bounded research scope is one soccer competition with pre-match score distribution, or one tennis competition with calibrated binary win probabilities. The [original Dixon–Coles paper](https://academic.oup.com/jrsssc/article-abstract/46/2/265/6990546) provides a Poisson regression approach for football scores; it is methodological evidence, not proof of edge in today's markets. Soccer goals X,Y can yield home/draw/away, totals and spread probabilities from one coherent joint distribution, with low-score dependence and truncation-tail controls. Tennis may use Bradley–Terry/logistic strength with surface and format, but player retirement/walkover rules need explicit treatment. NFL/MLB/cricket require their own sport-specific models and data.

Exact data contract for any future sports model:

1. Stable competition/event/participant identifiers, home/away/neutral location, scheduled/actual start, regulation/overtime/innings/sets format, exact modeled outcome, line and payout exceptions.
2. Complete historical results and schedule with original publication/availability timestamps; opponent strength/context, venue/rest/travel, confirmed lineup/starting pitcher/roster and injuries/status where relevant. Information published after decision is excluded even if describing an earlier injury.
3. Official competition result/status sources (FIFA/organizer for soccer, NFL, MLB, ATP/WTA, ICC as applicable) and market's exact fallback hierarchy. This task did not certify a complete free archive/API with as-of injury/lineup coverage for every sport. Website presence is not such certification.
4. Independent forecasts or time-stamped external bookmaker odds if proposed. De-vig by exact outcome set and retain receipt/odds time. Closing odds fetched later, or the same Polymarket book passed as “independent evidence”, would leak/recycle information.
5. Exact side-specific CLOB depth/asks, category/market fees and size-dependent slippage at evaluation, repeated on entry revalidation; no synthetic complementary book.

Look-ahead risks include season-final strength fitted to earlier games, revised results, post-match roster/injury facts, closing odds, live score in a pre-match model and rescheduled start times. Capture source availability before decision, use chronological train/calibration/test partitions and freeze forecast before kickoff. New SPORTS_MODEL cannot pass current literal H3. A future general independent-model contract is a separately approved architecture change preserving H3's policy, not within this audit or a crypto-template patch. Sports remains SHADOW ONLY. No numeric count of valid sports evidence or would-open opportunities is justified from participant titles and books alone.

## K. Political/Economic/Event Investigation

Political markets are a mix of formal public acts and events with narrative conditions. An official election result or roll-call can define a clear target; diplomatic/covert/removal incidents may use consensus or later authoritative statements. Announcement timing, event occurrence, deadlines and resolution publication are separate. A poll-based election forecast needs election/office/jurisdiction, poll fieldwork and release times, sampling/house effects and correlated errors; it does not model an arbitrary bill, arrest or ceasefire. Hazard forecasts need event-specific exposure and comparable censored histories, which have not been established here. Autonomous Demo is presently unsuitable for these families.

Actual economic questions are narrower than “Fed/inflation markets”: two yen-intervention announcement dates and two AAA gas threshold dates. Yen rules require an official US announcement establishing actual yen purchases for intervention; readiness or another country's intervention does not count. Event and public announcement time can differ. Gas rules use unrounded state average regular prices, exclude DC, and permit a two-day publication delay before default No. Public [AAA fuel prices](https://gasprices.aaa.com/) were inspected but complete unrounded historical release vintages were not established. A joint state-price forecast would be required for “any state below”, not one aggregate national point estimate.

Future macro release brackets require exact indicator/units/seasonal adjustment/first-release vs revision and publication schedule. [FRED/ALFRED real-time periods](https://fred.stlouisfed.org/docs/api/fred/realtime_period.html) distinguish what was known at a past date; today's revised series is not an as-of forecast input. [BLS seasonal revision documentation](https://www.bls.gov/cpi/notices/2024/seasonal-adjustment-eoy.htm) illustrates why vintage matters. Intraday availability requires publication-time receipts in addition to a date-level vintage. No such macro family was found with current 24h–7d opportunity coverage.

COUNT/OTHER: SpaceX exact 12/13 launch questions fall into OTHER while fewer-than-12 is COUNT_BRACKET. Public rules specify September ET calendar counting and SpaceX launches as source. This is parser incompleteness, not permission to invent a Poisson probability for a scheduled industrial process. [SpaceX launch page](https://www.spacex.com/launches/) returned no parseable body to the research browser; a usable timestamped archive was not certified. Hottest-month rank requires exact global data series, reference archive, release/revision and rank convention. NUMERIC_BRACKET's current Climate Clock question is a deadline-change event, with a specified machine-feed reference timestamp and +/-30-day change threshold; a weather-temperature forecast would be inappropriate.

Future genuine temperature brackets require station/geography/timezone/daily extremum, units/rounding and specified settlement source; ensemble forecasts need original issue time and archived members. [NWS API documentation](https://www.weather.gov/documentation/services-web-api) provides forecast/observation interfaces, but availability of forecasts does not establish the exact source used by an unverified market or a complete as-of archive. These families stay shadow/research only.

## L. Look-Ahead Risk Analysis

| Layer | Required temporal rule | Present evidence / remaining limitation |
|---|---|---|
| Market rules | Retain exact condition, tokens, title, description, source, version/hash and receipt time before forecast | Public rule receipts captured now; old title/slug stored, full historical description not frozen; current rules do not prove prior rule version |
| Price candles | Close time < asOf, publication/receipt <= decision, correct clock/finalization | Current code enforces close-time and spot age. Historical candles fetched today do not certify original publication availability; retained as hypothetical only |
| Touch window | Complete pre-decision extrema, no hit before window counted; boundary partial minutes exact | Offline High inputs computed with existing functions; prospective continuity/availability certificate still required |
| Sports/news | Availability time <= decision, not event date alone | No complete archived lineup/injury/news input sets demonstrated |
| Macro/weather | Original forecast/release vintage + issue/available time <= decision | Revised series/reanalysis or today's forecast cannot populate old input sets |
| Outcome | Only later labels; true temporal bracket, not end_date assumption | Existing collector contract; 4 flags not independently rescored here |
| Cohort | First eligible finite-prior shadow observation, all decisions retained, one per market | Entry-real sample is coverage evidence, not automatically the collector's shadow scoring cohort |
| Dependence | Repeated ticks and same-asset/event strike ladders clustered | Six Touch markets are only two shared weekly source paths; 16 rows are not 16 independent outcomes |
| Calibration | Train/calibrate/test split chronological and event-separated; weights fixed before holdout | No outcome-selected tuning performed; retrospective reconstructed inputs not official statistical validation |

No historical chronology was upgraded by assigning today's receipt time. No historical observations were scored. A leaky-candle unit test can check filtering without certifying source vintages, semantic changes, as-of sports facts or true outcome timing. The older `prediction-market-lookahead-test` mirrors simulation query logic and assumes resolution at end_date; its pass would not settle these real-world concerns.

## M. Data Source Analysis

| Source | Legitimate role | Access / quality / temporal boundary |
|---|---|---|
| Public Gamma exact conditions | Current rules, token/outcome pairs, source lifecycle | 111 GETs, 100 matches/11 unknown; all 62 pool matched. Does not prove historic rule version or final winner |
| Public CLOB books | Own YES/NO execution/prior/depth | 124 GETs/124 responses, 46 finite priors; thin/one-sided/empty data remain failure. 01:18 capture differs from historical decision times |
| CLOB winner helper | Authoritative platform settlement mapping | Existing bounded resolver; no winner census or writes here. Actual settlement timestamp not supplied by current helper |
| Binance public klines | Verified BTC/ETH/XRP source math and High/Close cross-check | 24 historical requests/24 responses for the offline Touch sample; all strict pre-asOf inputs, spot age 3.083–18.500s. Prospective receipt/cadence needed; no source interchangeability |
| Kraken OHLC | Exact LAPTOP/USD source family where rules demand it | Recent 720-bar cap and unfinished last bar; long-window archive not established. Requires new reviewed adapter/capture |
| Chainlink reports | Resolution feed for specific Up/Down templates | Timestamp schema exists; free complete historical/as-of access not verified, source/pair basis risk prevents Binance substitution |
| Sport governing bodies / organizer | Event identity/status/results and source cross-check | Public result websites exist; complete free timestamped roster/injury/odds archive not verified. Secondary fallbacks need explicit precedence |
| Congress / official government | Bills, votes, signatures, official announcements | [Congress legislation documentation](https://www.congress.gov/help/legislation) distinguishes legislative stages. Bill version and announcement publication must be retained; an outcome page is not a probability model |
| AAA, FRED/ALFRED, BLS | Defined economic targets/vintages | Unrounded gas history gap; macro revised values need original vintage and intraday publication proof |
| NWS / specified weather source | Issue-time forecast ensembles and observations | Station/rounding/source match required; generic point forecast is not an extremum probability distribution |
| Specific public event/chain feeds | Launch/count/protocol conditions | Definitions, duplicates/finality/attribution and issue-time archive required; not a universal YES rate |

[Polymarket fee documentation](https://docs.polymarket.com/trading/fees) currently supports the code's shares × category rate × p(1-p) structure and rates (.07 crypto, .05 sports/economics, .04 politics). This is a documentation-level comparison, not certification of every market's exact fee configuration; each future template must verify market parameters and rounding. No fee code changed. Executable net edge must use actual walked-book price and charged fee; no rebate or fee-free assumption is used to manufacture an opportunity.

## N. Hypothetical Offline Coverage Expansion

Scope fixed before calculation: the six cross-month weekly BTC/ETH High conditions, 16 original observations. We used the **existing** `fetchPriceModelInputs`, `priceModelProbabilityYes`, `combineMarketAnchored`, fee and confidence contracts through an isolated in-memory transport. The existing classifier remains unchanged; hypothetical admissibility is explicitly a scenario, not a production decision. Frozen public response data were routed only to stub Binance endpoints; no engine evaluations, trade inserts or production calls were made by that replay.

24 public historical candle requests cover the three original evaluation minutes for BTC/ETH (closed-minute spot, daily history, complete closed hours and partial hour). 16/16 existing input builders succeed, all have valid strict pre-asOf candle times, all strikes exceed observed window High. Replay data were fetched retrospectively; publication-at-original-decision and historic rule version are uncertified. Results can show feasibility and likely continued abstention under assumptions; they cannot enter Phase 9A scores.

| Scenario | Additional analysis markets / anchor rows | Data/evidence reach | Positive edge | Confidence / all H1–H8 / would-open |
|---|---|---|---|---|
| Current coverage | 0 extra; anchor 20 supported markets / 52 rows | 52 admitted groups | 21 chosen positive; 0 >=5pp | 0 >=40; 0 complete candidates; 0 true annotation |
| Exact cross-month weekly Touch | **+6 markets / +16 rows**; potential anchor price coverage 68/150 vs 52/150 | **16/16 retrospective input success**, 0 already touched; up to 16 model groups under hypothetical admission, not statistical validation | **YES 0/16 positive**, 0/16 >=5pp at stored best ask. NO unknown because complete historical own-side books absent | YES cannot clear 5pp even at full price-only positive cap. Full two-side confidence/all-gates/would-open unknown; not counted as zero or positive |
| Add current daily Up/Down | +1 unexpired raw-analysis market, **0 inside unchanged horizon**; 0 anchor rows | No admitted reference/tie adapter; future model research | Not estimable; no eligible current opportunity gain | No current candidate under horizon; settlement and H3 routing review needed |
| Additional current Range support | **0 demonstrated new markets**, four existing template matches/two horizon | Existing model already routes them; uncertainty review separate | No new forecast claimed | No new count claimed |
| Remap price-like crypto events | 82 crypto-event titles include several price families; **0 live Pool H** (3 nominal-horizon sale rows closed) | Exact source/history/supply/adapters absent; no validated evidence count | Not estimable | Shadow/research; no opportunity estimate |
| One specified sports model | Raw nominal ceiling 494 MATCH +6 LINE, but measured actual pool **8+2**; original unsupported cohort **14 markets /31 rows** | New model not implemented, inputs/vintages absent; literal H3 incompatible | Not estimable; current books alone insufficient | Shadow only; no passing opportunities claimed |
| Count/weather/political/economic | Family-specific upper bounds in D; count Pool H 1, political 9, numeric/economic 0 | No admissible independent model or full source receipt set | Not estimable | Shadow only; generic group cannot pass H3 |

The latest natural tick included only five Touch markets, so current per-tick evidence coverage could rise **from 21 to at most 26** under that same sampled worklist and successful inputs. The current pool's horizon-valid template ceiling could rise **24→30**. These are coverage ceilings, not counts of gate-qualified opportunities.

## O. Additional Opportunity Estimates

The only defensible measured expansion count is six market conditions (two event/path clusters) and 16 anchor rows for verified cross-month Touch. Model-admitted anchor rows could rise 34.7%→45.3%, a 10.7 percentage-point gain. Retrospective price-only YES outputs are negative after best ask/fee in all 16. Books walked at realistic size can cost more than best ask; this cannot improve the YES result. The largest possible cap-only YES edge ignoring costs across these priors also stays below 5pp.

This does **not** prove no NO trade existed. Complementing the historical YES book would invent execution data; current NO books are later snapshots. AI numeric responses, full historical side-depth and exact revalidation receipts are missing. Numerical counts for positive NO edges, confidence, complete H1–H8, Kelly, per-user would-open or extra PnL would therefore be fabricated. A healthy separately validated expansion may still produce zero trades.

Daily Touch templates currently have zero horizon-valid markets; their absence from opportunity flow is explained by the unchanged minimum horizon at this capture, not a new modeling defect. The one current Up/Down is too short. Adding a sports model could improve coverage of the actual 10 pool conditions, but there is no evidence here of incremental predictive information versus market or of fee-adjusted edge. The 500 nominal-horizon sports records are not a promised opportunity pool.

## P. Recommended Safe Expansion Sequence

These are **proposals requiring a separate implementation task and review**, not actions authorized or performed here. Sequence reflects dependencies and smallest scope, not a best/worst market ranking.

| Stage | Exact scope/model/source/group | Validation and acceptance | Safety / rollback |
|---|---|---|---|
| 0 — Offline semantic and input contract | Six cross-month BTC/ETH weekly final-High >=K contracts, exact ET dates/pair/token mapping. Reuse existing reflection PRICE_MODEL with its disclosed drift assumption, .5 beta/1.5 cap/.5 validation; no new independent trend source. Define full-window cadence/receipt contract | Positive and negative calendar/template tests, no broadening to down/other feeds/long windows; fixed replay before outcome join. Explicit decision on Touch drift assumptions. Model/rules receipt version fixed | Offline only; no production effect. Keep current Demo pipeline and gates unchanged |
| 1 — Bounded prospective shadow for the exact new family | Reviewed **shadow-only admission routing** for new template version using existing shadow/resolver jobs. Freeze standalone q/band, current prior, both books and source receipts. No extra scheduler or gate file | >=28 days including >=4 weekly cycles, >=100 distinct resolved Touch conditions plus event-cluster uncertainty, global >=300; collect abstentions and would-open counterfactuals. All chronology and registered 9A criteria below | Must prove new family cannot enter Demo while existing families retain current behavior. Simply widening shared regex is insufficient. Revert only reviewed admission changes through existing exact-SHA process; retain observation/outcome history and existing resolver |
| 2 — Demo eligibility review for exact family | Same math/group/weights unless separately reviewed; no threshold change. Require every existing side/tick/risk/user gate plus fresh Gamma/CLOB | Paired Brier/log-loss vs market, registered bootstrap/ECE/stability/fees, exact mapping, no H1/H5 violations, required distinct would-open outcomes. If zero sample reaches opportunities, acceptance remains incomplete; do not force it | Separate exact-SHA release/activation authorization; can disable only new template admission. Existing position settlement continues; no database rollback |
| 3 — Additional verified crypto terminal/barrier families | Range only if genuinely new rule; below/other symbols/ATH/other feeds only per exact semantic/data contract. Terminal CDF reused where payoff equivalent; drift-aware/jump/continuous-vol band changes each separately reviewed. Same underlying price information one group | Fix and test range envelope interpretation before claiming continuous robust bounds. At least type/template sample requirements and heldout walk-forward outcomes; prospective data/source agreement | Default shadow only; unknown source/calendar/past extrema fail closed. No wholesale crypto-event template |
| 4 — Reference-price Up/Down research | Terminal return with observed R, exact Binance or Chainlink feed; tie payout explicit, no short-horizon exemption | Real rule/reference-finalization snapshots; separate payout/collector compatibility design. No current horizon opportunity gain to validate | No implementation until tie/settlement and H3-compatible price routing reviewed; existing settlement unchanged |
| 5 — One non-price competition/process pilot | One sport score/win model or one well-defined count/forecast process. SPORTS_MODEL/COUNT_MODEL/WEATHER_MODEL/ECONOMIC_MODEL only after independently reviewed generalized group contract; not relabeled PRICE_MODEL | Original as-of public/licensed data, chronological heldout training, calibration vs market, >=100 per allowed type and global 9A criteria; uncertainty from parameters/source/missingness, all exceptions mapped | Shadow only under current H3. Generalizing independent-model admission preserves H3 policy but changes literal framework and requires separate approval; no risk/policy/trading activation bundled |

Each shadow period is evidence-driven: no promise that calendar time alone or project deadline suffices. If event-cluster sample is small despite 100 sibling conditions, disclose that and extend evidence collection. No autonomous learning is needed or enabled to fit offline calibration; proposed coefficients cannot be updated online from this cohort. All production release, routing and kill-switch changes remain outside this task.

Sampling/discovery proposal, separately documented: current discovery queries six categories, top-volume event slices (up to 20 per category in discovery) and only first three children per event. Entry selects `.eq('candidate_status','ELIGIBLE').limit(50)` without deterministic rotation. Registry has 62 and 12 stale-too-soon candidates; latest tick reaches 21 of 24 available verified price templates. A bounded ordered/rotating worklist with time-horizon eligibility and explicit fair category coverage could improve exposure to already admissible markets without weakening gates. It must preserve budgets, source lifecycle, retries and H8's 3–15min confirmation interval. With more than 50 candidates, rotation slower than H8 can itself prevent stability; benchmark max intervisit delay before selecting cadence. No new timer, gate, schema migration or forced evaluation is proposed. No guarantee of fairness deficit frequency or additional trades is claimed from one snapshot; no sampling code changed.

## Q. Exact Mathematical Models Needed

**Preserve the current posterior, confidence, caps and quality gates:**

```text
p0 = YES_mid/(YES_mid+NO_mid), with existing finite one-side handling
L0 = logit(p0)
delta_g = clip(beta_g*(logit(q_g)-L0), -cap_g,+cap_g)
p* = logistic(L0 + sum(one delta per independent group))
C_side = 100*V_support*A_agreement*R_robustness
netEdge_side(pp) = 100*(p*_side - own_walked_ask - fee_per_share)
fee_per_share = categoryRate * execPrice*(1-execPrice)
PRICE_MODEL: beta=.5, cap=1.5, validation=.5
AI_REVIEW: beta=.25, cap=.5, validation=.5
minEdge=5pp; minConfidence=40; current horizon=24h..7d
```

One unvalidated model can reach confidence 50 if its band is robust; the unchanged 40 threshold is not mathematically impossible. That does not validate its reliability. AI alone cannot originate a trade, and a contextual AI echo of the same price model is correlated. Phase 9C does not authorize switching policy B/C or removing H4. No such change is proposed in a coverage patch.

Models, only when semantically matched:

1. **Terminal AT / reference-known Up/Down:** log return Normal(nu*tau,sigma²*tau), q=Phi((ln(S/K)+nu*tau)/(sigma*sqrt(tau))); current zero-price drift uses nu=-sigma²/2. K=R for Up/Down; equality separate if discrete payout.
2. **Terminal RANGE:** difference of the two tail probabilities; [L,U) on discrete source ticks. Parameter uncertainty must include interior extrema if claimed as a continuous band.
3. **Touch:** drift-aware upper/lower first-passage formula in F, conditional on no prior qualifying hit. Existing zero-log-drift approximation remains explicit until a separate model review. Before a future window begins, integrate the window-start price distribution; path Range survival is a different two-barrier problem.
4. **Football joint scores:** P(X=i,Y=j|pre-match inputs) from fitted Poisson attack/defense/home strengths with a validated low-score dependence correction. q_home=sum(i>j), q_draw=sum(i=j), q_away=sum(i<j); over/under/spread sum exactly matching payout indicator. Parameter posterior/bootstrap uncertainty and omitted score-tail bound must propagate to q, not a point opinion.
5. **Binary participant win:** Bradley–Terry/logistic q=logistic(theta_A-theta_B+validated covariates); calibrated separately by sport/competition/surface/format. Does not by itself model a point/run spread. Retirement/tie/cancel events need modeled mixture branches or exclusion, not guessed complements.
6. **Process counts:** conditional remaining count N_rem with exposure and process-specific covariates; q=sum P(N_rem=n) over integers where N_seen+n satisfies the bracket. Poisson is only an initial hypothesis; negative-binomial/overdispersion or scheduled-launch cancellation mixture may be necessary. Exact integer brackets partition consistently. Do not infer a raw YES rate across templates.
7. **Weather/numeric forecast:** q=P(L<=rounded(T_station,date)<U | original issue-time ensemble and prevalidated calibration). Estimate full predictive distribution/ensemble weights, station bias and tail uncertainty; monthly global rank/Climate Clock are different targets.
8. **Economic numeric thresholds:** vintage-aware conditional distribution for a specified release/value; any-state gas uses a joint distribution or defensible dependence bounds. Official event occurrence can be a cause-specific hazard q=1-exp(-integral lambda(t|available covariates)dt), but only if comparable histories/definitions/publication times validate it. Competing outcomes/censoring/source-unavailability branches must be explicit.

These mathematical possibilities establish feasibility classes, not incremental information, calibrated edge or approval. Six crypto Touch conditions share only two source paths; a calibrated q is still compared against a market prior and fees. No model is optimized here to yield a desired trade count.

## R. Testing/Validation Requirements

Static test review covers **28 Prediction test files, 3,631 lines**, plus isolated transport, replay fixture/tool and diagnostic reporter. The unsafe credential-loading position-credit test was **read but not executed**. No full test suite, build, CI or deployment was rerun for this documentation/audit task. Earlier collector/activation/zero-trade test passes are historical receipts, not new PASS claims. This task ran the pure-classifier inventory diagnostic and the frozen-public-input offline diagnostic successfully; they create only local audit artifacts. No new production tests or fixtures were implemented.

| Current test file | Review scope |
|---|---|
| `prediction-ai-price-review-diagnostic-test.mjs` | 305 lines; static review; no fresh suite result claimed |
| `prediction-autonomous-account-test.mjs` | 162 lines; static review; no fresh suite result claimed |
| `prediction-autonomous-monitor-i18n-test.mjs` | 117 lines; static review; no fresh suite result claimed |
| `prediction-autonomous-multiuser-test.mjs` | 63 lines; static review; no fresh suite result claimed |
| `prediction-autonomous-sizing-test.mjs` | 95 lines; static review; no fresh suite result claimed |
| `prediction-calibration-test.mjs` | 72 lines; static review; no fresh suite result claimed |
| `prediction-demo-job-test.mjs` | 52 lines; static review; no fresh suite result claimed |
| `prediction-demo-lifecycle-test.mjs` | 290 lines; static review; no fresh suite result claimed |
| `prediction-duplicate-protection-test.mjs` | 63 lines; static review; no fresh suite result claimed |
| `prediction-engine-v2-test.mjs` | 448 lines; static review; no fresh suite result claimed |
| `prediction-market-engine-test.mjs` | 256 lines; static review; no fresh suite result claimed |
| `prediction-market-lifecycle-test.mjs` | 136 lines; static review; no fresh suite result claimed |
| `prediction-market-lookahead-test.mjs` | 105 lines; static review; no fresh suite result claimed |
| `prediction-market-position-credit-test.mjs` | 177 lines; unsafe production-credential/write path — NOT RUN |
| `prediction-observability-test.mjs` | 123 lines; static review; no fresh suite result claimed |
| `prediction-ranking-test.mjs` | 55 lines; static review; no fresh suite result claimed |
| `prediction-resolution-lookup-test.mjs` | 141 lines; static review; no fresh suite result claimed |
| `prediction-revalidation-test.mjs` | 48 lines; static review; no fresh suite result claimed |
| `prediction-settlement-test.mjs` | 72 lines; static review; no fresh suite result claimed |
| `prediction-shadow-classification-test.mjs` | 50 lines; static review; no fresh suite result claimed |
| `prediction-shadow-entry-test.mjs` | 80 lines; static review; no fresh suite result claimed |
| `prediction-shadow-resolution-test.mjs` | 83 lines; static review; no fresh suite result claimed |
| `prediction-side-aware-test.mjs` | 89 lines; static review; no fresh suite result claimed |
| `prediction-time-horizon-gate-test.mjs` | 50 lines; static review; no fresh suite result claimed |
| `prediction-tradeability-gate-test.mjs` | 58 lines; static review; no fresh suite result claimed |
| `prediction-v2-i18n-test.mjs` | 97 lines; static review; no fresh suite result claimed |
| `prediction-v2-outcome-collection-test.mjs` | 225 lines; static review; no fresh suite result claimed |
| `prediction-v2-replay-regression-test.mjs` | 119 lines; static review; no fresh suite result claimed |

Current tests cover classifier positives/negatives, terminal/Touch/range properties, posterior caps/group de-duplication, H1–H8, both-side execution/fees/depth, real handler Demo lifecycle, user auth/ownership/category/duplicate/capital/sizing, settlement idempotency, CLOB lookup failures, frozen outcomes/chronology/cursor/bounds and i18n. Legacy source-regex/math-mirror assertions have weaker proof scope than actual-handler tests; calibration tests cover Brier/log-loss primitives and legacy learning filters, not the complete Phase 9A reporter.

Required tests before any proposed implementation:

- Cross-month/year weekly parser: exact six observed BTC/ETH contracts; valid same-month regression; day/month ambiguity, impossible dates, leap days, DST 167/169-hour windows, mismatched question/slug coin, wrong feed/pair/threshold/comparator, changed rule hash, unknown symbol, creation-to-date not admitted. Actual declared span must be seven local dates; optional month text alone is insufficient.
- High/Low window inputs: final minute High vs Close, past hit despite below-strike current spot, down direction distinct, full-hour/partial-minute alignment, no pre-window/future candles, missing middle/first candles, pagination bound, empty/incomplete response, stale clock and retrospective revision receipt. Every failure abstains.
- Model assumptions: exact zero-log-drift reduction, drift-aware upper/lower formula known cases/monotonicity/short-time limits, numerical stability for exponential-normal-tail products. These would accompany a separately approved model change, not a template-only patch.
- RANGE: existing partition/complements and tick-boundary assignment; deterministic G counterexample; continuous uncertainty interval extrema and both-side worst edge; keep H2 strict. No shared evidence counted twice.
- Up/Down: known/future reference, final candle availability, equality half payout, source mismatch, missing original Chainlink reports, unsupported short horizon. No manufactured binary score.
- Non-price: exact team/player/process identifiers, historical availability receipts, cancellation/postponement/push/draw/fallback rules, score-line monotonicity/partition, source outage and refusal to treat correlated odds as independent.
- Shadow-only routing: new family never reaches Demo insertion; existing family decisions unchanged for same inputs; one frozen first eligible observation, actual prior not fallback, collector chronology and unsupported flags remain objective. H3 blocks arbitrary new group names and AI-only originations.
- Existing per-user lifecycle/duplicate/auth/revalidation/credit/Kelly/risk behavior, protected module/source scope, no Real/signing/funded endpoint, no migration/new gate/job, unchanged A-mode deadline. Run only reviewed isolated tests; never legacy production-writing scripts.
- Candidate selection: deterministic bounded rotation under >50 markets, every eligible market visited within declared bound, no closed/too-soon admission, transient errors retryable, H8 revisit remains within 3–15min, original budgets/entry safety unchanged.

Replay needs original as-of rules, full own YES/NO levels/receipt time, fee config, model parameters, candle/history availability and AI policy receipts; outcome joins happen later. Missing NO book is UNKNOWN, never a synthetic complement. Training/calibration windows must precede a heldout deployment-like window, with event/asset-path clustering and one frozen observation per market. Reconstructed today's historical candles may check mathematics but not certify no look-ahead.

**Remaining Phase 9A acceptance gaps:** >=28 days/4 weekly cycles; >=300 distinct chronology-certified resolved markets; >=100 per allowed type; >=30 distinct resolved would-open markets; paired Brier and log-loss comparisons vs frozen market prior with registered 95% bootstrap bound; 10 equal-count-bin ECE<=.03 and bin error criteria; would-open calibration and fee-adjusted edge CI; zero H1/H5 violations; type/category/abstention/stability matrices; <=5% one-hour side flips; complete audited reporter and source/payout contract. Today’s four registry eligibility flags, zero production positions and retrospective Touch math do not fill these gaps. Statistical validation, profitability and model/AI superiority are **NOT established**.

## S. Production Safety / Rollback

No rollback occurred; there was no production change to roll back. Exact running SHA and symlinks remain the same. Entry Demo ON, Real OFF, Prediction learn OFF. No new order, signing, funds movement, migration, fixture, scheduler, gate, risk change or protected-module edit was performed by this task. No SSH script writes a remote file; SQL uses explicit READ ONLY transactions, SELECTs, local statement/lock limits and ROLLBACK. Public research used GET only. Existing natural resolver/background activity continued normally.

Protected production hash evidence at 01:22 UTC, equal to the previous audit baseline:

| Source | SHA-256 |
|---|---|
| api/copytrade.ts | cbf12d8264609e3d73b4b416f4c5cec86b7d649d700acb400a5da25467b551ca |
| api/analyze.ts | a755e0652e9a128e9ca803e6714e70a844454ceacafe3041bafca1f7d6cd267a |
| api/admin.ts | 62429dbeaf02c03646e1fba307d6b8861ba96059b4c6a171a9eb2117246167dd |
| src/app/App.tsx | 4dbb632a603fb5c70960b6986a7299c71f2261b9eca78d8846ad4e9ec86f18ef |

Local executable/source diff is empty. All unrelated dirty/untracked work is preserved, including the pre-existing eight HANDOFF lines. Only this report, private local diagnostic receipts/scripts and a task-specific documentation note are produced. Private account IDs, credentials and raw DB exports are not published. The inventory/public receipts stay in ignored/untracked tmp, not as production fixtures.

Future proposed rollback: revert/disable only separately reviewed new template admission through existing controlled exact-SHA release, keeping current collector/resolver and existing open-position protection/settlement. If broader entry must stop, use existing controlled Demo gate procedure only after approval; do not remove settle/discovery jobs or rewrite ledger/outcomes. There is no database rollback in this plan, and no new gate file/scheduler.

Observed limitations/errors: 11 public Gamma no-unique-match responses; zero HTTP failures among 24 Binance and 124 CLOB requests. Latest natural run success/null error does not certify individual upstream timeouts; per-response AI diagnostics were not completely inspected. Research browser could not parse SpaceX or several optional reference URLs; no complete sport/Chainlink/unrounded-AAA archive was claimed. Local diagnostic development briefly had a Python spacing syntax error and a JS brace error; corrected before the successful local runs, never executed in production. No manual retry of production jobs occurred.

## T. Explicit Do Not Change List

- Prediction Real Trading, wallet/Polymarket order execution, signing or funds movement; Autonomous Learning.
- minEdge, minConfidence, H1–H8, resolution validation, time horizon, tradeability/liquidity/spread/depth, freshness, duplicate/user isolation or mandatory revalidation.
- Probability posterior/caps/validation coefficients, classifier/model behavior, AI policy or A-mode timeout merely to increase activity. Proposed model and classification issues above are recorded for separate review only.
- Kelly, risk, sizing, capital/credit policies, per-user preferences, Demo settlement, resolution semantics outside a separately approved exact collector/admission scope.
- Historical outcomes/chronology, fallback-prior scoring, v1 isolation, database schema/migrations, synthetic production markets/predictions, forced trades.
- Futures, Spot, Fast Trader, Autonomous Supervisor, Wallet, shared scheduler architecture, gate files or job cadence; concurrent contributors' work.
- Phase 9A acceptance criteria, declared holdout/analysis unit, fees, unknown data or no-trade labels to obtain a desired report result.

## U. Final Decision

**Can be implemented next only in a separate reviewed task:** the exact cross-month BTC/ETH weekly High template contract and its offline/isolated tests, with bounded prospective **shadow-only** admission. The measured semantic gap is concrete; it does not require lowering any gate or changing probability math. Do not deploy a shared whitelist change into an ON Demo runtime without proving the new family stays shadow-only until accepted. A subsequent exact-SHA release remains a separate owner decision.

**Requires more research/review:** Touch drift assumption consistency, minute/window/cadence/source-receipt contract, continuous-volatility Range envelope, bounded fair sampling preserving H8, any new asset/source/ATH semantics, Up/Down reference/tie payout, and one carefully scoped non-price model plus an explicit general independent-model contract. Sports/count/weather/economic models are feasible in principle but no valid quantitative opportunity count has been demonstrated.

**Must remain unsupported for autonomous Demo now:** unknown or changed rules, unidentified feed/pair/participants, incomplete long Touch history, short-horizon Up/Down under existing gate, non-binary payout without an approved contract, generic CRYPTO_EVENT/OTHER or political incident probability based solely on opinions/raw YES history, correlated market/AI information presented as independent evidence, and every new model lacking pre-decision inputs/calibration/objective scoring.

The 98/150 missing-evidence rows are implementation/data/semantic support gaps with differing feasibility, not proof that 98 safely tradable opportunities were missed. The smallest proven coverage candidate supplies six extra analyzable conditions; the offline YES result remains zero qualifying edges. **Statistical validation is NOT complete. No profitability, model superiority or AI superiority claim is made. Production was not modified by this investigation. Prediction Real Trading and Autonomous Learning remained OFF.**

### Command and evidence record

All diagnostic files reside locally under `tmp/prediction-coverage-expansion-audit-20261001/`; raw receipts are not published. Reproducible command families, without credentials/private host details:

```text
git status --short
git rev-parse HEAD
git diff HEAD -- api src deploy migrations .github
git show HEAD:api/predictions.ts  (LF blob SHA-256 comparison)
rg --files scripts docs reports  (bounded Prediction scope)
gh api repos/signal0verse/SignalVerse-AI-Log/git/trees/master?recursive=1
gh api repos/signal0verse/SignalVerse-AI-Log/contents/<required-report>?ref=master
python fetch-reports.py / review-tests.py / public-rules.py / public-inputs.py
node --experimental-strip-types classify-inventory.mjs
node --experimental-strip-types offline-coverage.mjs
read-only SSH: deployed marker, readlink/process cwd, health GET, sha256sum, gate stat
read-only SQL: BEGIN ... READ ONLY; SET LOCAL timeouts; SELECT ...; ROLLBACK;
  inventory.sh: full current public market fields + aggregate controls/runs
  latest-funnel.sh: one latest natural completed Demo run + per-type aggregates
  final-controls.sh: exact identity/controls and aggregate outcome registry flags
```

The public-input diagnostic made 24 **mocked** Binance transport calls backed by 24 already fetched public responses; router blocked list empty. Classification made zero transport calls. No `evaluateMarket`, handler, autonomous tick or trade function was called by either new offline diagnostic. Pure calculations are hypothetical; they were not persisted to Production.

### Evidence integrity receipts

| Local receipt | SHA-256 |
|---|---|
| inventory.txt | 5596990c7d419af85bbdfcb1254aaa9e0b3ce4a5bca500022f036c75928461c5 |
| inventory-derived.json | 90e41705c022622b5756f1a97d80f8642409349e9dba75ad3e191632ab1aa48d |
| public-rules.json | 75728859827bea810a5c8ea5e804b7ff69997a208776a180fdda4026f953c2a1 |
| public-inputs.json | 98c751117aed0103fac63344e2b048bd8943a6f0e23b53a81de5ab30310270da |
| public-books.json | 6270a8bc0f6c100bb363a0dabc4f9238997f2f5bc263529c1fc0a307ba88df16 |
| offline-results.json | bb8b299c9589ab8280b459c4214ca9582e769805f4dc76edcb7053f5d091078d |
| latest-funnel.txt | 43c1e9bc5cccdf8a3c6c9ce1ce792b17dc503484510efb0ba8bb8c469781eb26 |
| final-controls.txt | d8625140c3d2d1bc005f75df10e8304750100bb322ce1fab492ef591c7472d71 |
| test-review.json | 5afa76efdc76ce9ad02c6c73b5cbdf9c66d0d314f73ef617728657d6847190dc |

### Publication state

This complete report is published to the mandatory `signal0verse/SignalVerse-AI-Log` repository, branch `master`, at the report path below. The publisher reads back the exact content bytes/blob and verifies the publication commit changes **only this report**. Its commit/hash verification receipt is retained locally and the verified link is returned to the owner. No unrelated report is changed. The source handoff, if published, is documentation-only `[skip ci]`; it does not change the running production SHA or executable source reviewed here.

[Full report publication](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/prediction/2026-10-01-0909-prediction-coverage-expansion-audit.md)
