# Prediction autonomous Demo zero-trade forensic audit

Date: **2026-10-01, Asia/Kuala_Lumpur (UTC+08)**. Read-only diagnostic task.

## Evidence-based conclusion

**A. ZERO TRADE IS EXPLAINED BY CURRENT MARKET/ENGINE CONDITIONS.**

This conclusion applies to the exact requested three-cycle sample under the
existing approved model and gates. It does not assert that the model is calibrated,
that its thresholds are optimal, or that no opportunity existed elsewhere in
Polymarket. It does not diagnose an evidence-ingestion outage, classification bug,
or over-restrictive gate as the primary cause without the required evidence.

The 150 records are 58 distinct markets, including 43 seen in all three cycles.
They partition into 44 insufficient-book cases, 54 no-admissible-evidence cases,
31 nonpositive-edge decisions, 20 below-edge/confidence Watch decisions and one
untradeable Avoid decision. There is no hidden qualified decision reaching an
insert failure: neither side has an actionable final decision trace, all three
runs succeeded, and every record was rejected before the downstream entry gates.

Coverage/data limitations are real: 79 evaluations have question types with no
validated quantitative source and 19 Touch evaluations have no approved template
match. Those 98 rows have no quantitative groups. The 44 insufficient-book cases
are entirely inside those already-unsupported 79 rows; repairing their books alone
would not create a supported opportunity. The other 52 rows have complete recorded
price-model evidence, fresh closed-candle inputs, finite priors and consistent
model arithmetic. None has chosen-side net edge >=5 percentage points. All 20
tradeable Watch cases have only 0.01-0.61 pp of executable net edge and confidence
0; the one larger positive edge is 2.63 pp on an untradeable NO book, confidence 25.

No code, configuration, Production schema or Production data was changed by this
audit. Demo Entry stays **ON**, Prediction Real Trading **OFF**, Prediction
Autonomous Learning **OFF**. No deployment, restart, manual job invocation, order,
wallet signing, migration, fixture or manual database write was performed.

## Identity, exact cohort and read-only method

- Verified deployed SHA: **6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d**.
- Source checkout/main at audit start: **2eb410369d4efba1d218e513340c4860c58e319b**, the prior documentation-only handoff. It does not change the deployed engine.

- Activation/observation window requested: **2026-09-30T20:47:28.664Z to
  21:01:49.101528Z** (local 2026-10-01 04:47:28.664-05:01:49.101528 +08).
- Exact evaluation-run span: **20:51:17.453Z to 21:01:23.264Z**; no later
  evaluations were added to the 150-row analysis.
- Audit runtime/ledger snapshot: **2026-10-01T00:48:23Z** / local 08:48:23;
  public evaluation-field extract **00:48:59.456219Z**. Independent SQL counts and
  scheduler/control inventory **00:52:52Z** / local 08:52:52.
- Every operator SQL session explicitly used BEGIN TRANSACTION READ ONLY,
  bounded statement_timeout (15-20s), lock_timeout (2s), SELECT only and ROLLBACK.
  No Production HTTP endpoint capable of writing was invoked.
- Query scope: the three immutable entry_real run IDs below, anonymous
  telegram_id IS NULL, model_version='v2'. The legacy entry_real run label denotes
  the actual Demo insertion branch, not funded Prediction execution.
- All 150 prediction IDs are unique; each run has exactly 50 rows. Per-evaluation
  probabilities, evidence, classification, both-side reasons and asOfMs come from
  saved V2_META and columns. No synthetic engine evaluation was substituted.
- Market titles/condition IDs/slugs/dates and current candidate status come from
  the audit-time market registry. They are not an immutable market-input snapshot.
  The entry selector implies ELIGIBLE at candidate read, while audit-time statuses
  are 136 ELIGIBLE row references / 14 FILTERED_OUT references. Status transitions
  cannot be assigned historical times from this extract.
- Current end_date is used for the per-row horizon reconstruction. All 52 supported
  rows also independently record tauDays in V2_META; they are within 42.98-139.14h.
  Other rows lack a frozen expiry field, so their horizon is a registry reconstruction.


| Cycle | Run ID | Start UTC | End UTC | Recorded / success |
| --- | --- | --- | --- | --- |
| 1 | b44f2164-0ee9-4f80-b285-346d16d366f2 | 2026-09-30 20:51:17.453 | 20:51:23.248 | 50 / true |
| 2 | 4da23a8c-3628-4fa5-a577-9dba932a8d40 | 2026-09-30 20:56:02.808 | 20:56:11.328 | 50 / true |
| 3 | 1ee6dc20-d354-4114-ae4c-61b4a03bf0c5 | 2026-09-30 21:01:18.236 | 21:01:23.264 | 50 / true |


Production deployed-sha and main symlink match the exact target. Running source
api/predictions.ts SHA-256 is
027b07f5ff3fe67fa2fafcb52b7be4d64c934ed7cabd2509cce7d9f4a9599ce8,
matching the locally inspected deployed commit. All 150 rows have model_version
v2; feature_version='v1' is the old column default and is not the engine dispatch
or a v1 probability computation. The execution route is autonomous-enter ->
recordAutonomousRun('entry_real') -> autonomousEntryTick(false, runId).

Installed runner hash remains
e5065de3cca0911815cbab94bfdfa8187d4f26578372e5481690ff6dff46e0c9.
The root-owned 0644/empty prediction-enter-cron.enabled exists. Prediction learn
gate is absent. Prediction Real settings are absent/default false; Real actions
remain unconditional 501. Current Real trades and Prediction learn runs are zero.

The existing signalverse-fast-jobs.timer invokes signalverse-fast-jobs.service,
which invokes signalverse-jobs fast, once per existing five-minute schedule. The
current runner has exactly one autonomous-enter dispatch. Searches found the same
literal in two historical .bak runner files, but the active service refers only to
the current runner; these backups are not additional active scheduler dispatches.
No extra active Prediction entry timer/cron dispatch was found in the inspected
systemd/cron surfaces. A long-running shared oneshot does not imply duplicate
Prediction runs. At 00:52:52Z, 46 natural Demo entry runs since activation had
zero failures, zero opened, zero EVAL_ERROR and zero AI_RECHECK_FAILED exceptions.
These later run counters are context only; their evaluations are not in this cohort.

## Funnel and disjoint rejection accounting

The requested funnel below is a cumulative analytical filter, not a claim that
the runtime calls checks in this presentation order. Resolution-template admissible
means a supported, verified quantitative price template, not just a CLEAR generic
resolution_status. All 52 such cases also have sufficient data and PRICE_MODEL.


| Analytical stage | Remaining evaluations |
| --- | --- |
| Actual Demo evaluations | 150 |
| Verified resolution-template admissible | 52 |
| Sufficient market data / finite prior | 52 |
| Validated quantitative evidence present | 52 |
| Positive chosen executable net edge and EV | 21 |
| Confidence >=40 | 0 |
| All H1-H8 satisfied in actual entry path | 0 |
| Tradeable | 0 |
| would_open | 0 |


At the 21-positive-edge stage, 20 are tradeable Watch and one is untradeable Avoid.
If the explicit point-edge minimum >=5 pp is added before confidence, the funnel
already becomes zero at that stage. The confidence result is coupled to this
same edge threshold, not an independent 20-case evidence outage.

Actual runtime entry funnel: **150 recorded -> 0 actionable decisions -> 0 H5 /
entry-horizon / tradeability checks reached -> 0 H8 candidates -> 0 ranking /
fresh revalidation / per-user insert attempts -> 0 positions**. Therefore H5 or
H8 failures were not the observed blocker; neither may be marked as passed live.

Independent marginal counts are different from the cumulative funnel: 106 finite
priors, 52 validated price groups, 21 positive chosen net edges, 93 tradeable
selected sides, 117 registry-derived 24h-7d horizons, 0 confidence >=40,
0 chosen net edge >=5, 0 would_open=true. All 150 would_open fields are **NULL**,
not false: the column is annotated only after deterministic gates/revalidation/
reference Kelly have passed. A null pre-entry annotation is not a failed insert.


| Disjoint chosen-decision branch | N | Share | Meaning |
| --- | --- | --- | --- |
| INSUFFICIENT_MARKET_DATA | 44 | 29.33% | No valid two-sided selected book; all inside unsupported question types |
| NO_ADMISSIBLE_EVIDENCE | 54 | 36.00% | 35 unsupported-type cases with prior + 19 unverified Touch templates |
| NEUTRAL / NO_POSITIVE_EDGE | 31 | 20.67% | Supported model, chosen net edge/EV nonpositive |
| WATCH | 20 | 13.33% | Positive edge, all below minEdge and minConfidence |
| AVOID / MARKET_UNTRADEABLE | 1 | 0.67% | Supported model, excessive chosen NO spread |
| TOTAL | 150 | 100% | No actionable decision |


Overlapping recorded reason counts (not an additional partition):


| Chosen-side final reason | N |
| --- | --- |
| INSUFFICIENT_MARKET_DATA | 44 |
| NO_ADMISSIBLE_EVIDENCE | 54 |
| NO_POSITIVE_EDGE | 31 |
| EDGE_BELOW_MIN | 20 |
| H6_TAIL_UNSAFE | 17 |
| CONFIDENCE_BELOW_MIN | 20 |
| MARKET_UNTRADEABLE | 1 |


The 17 H6 failures are a subset of the 20 Watch cases and co-occur with both
EDGE_BELOW_MIN and CONFIDENCE_BELOW_MIN. They do not explain 17 extra independent
lost trades. No H1/H3/H4/H7 reason appears in the final chosen-side trace; early
decision returns and deliberate H2 suppression can hide these conditions from
the final reason list. The derived gate table below distinguishes that issue.

Both-side trace cross-check: all **300** YES/NO final reason arrays are nonempty.
The disjoint leading side branches are 88 insufficient-market-data, 108
no-admissible-evidence, 44 untradeable, 40 no-positive-edge and 20 Watch arrays.
The same 20 Watch arrays contain below-edge/below-confidence and 17 H6 codes.
Under chooseBestSide(), an actionable side would be preferred over a nonactionable
side; the stored records therefore do not hide an actionable opposite-side result.

## Question-type and resolution-template analysis

Requested labels TOUCH/RANGE/UP_DOWN/EVENT map to stored CRYPTO_PRICE_TOUCH /
CRYPTO_PRICE_RANGE / CRYPTO_UP_DOWN / CRYPTO_EVENT. Zero-count types are retained.


| Requested type | Stored type | N / markets | Price evidence | Decisions |
| --- | --- | --- | --- | --- |
| CRYPTO_PRICE_AT | CRYPTO_PRICE_AT | 46 / 18 | 46 | NEUTRAL:26; WATCH:19; AVOID:1 |
| TOUCH | CRYPTO_PRICE_TOUCH | 19 / 7 | 0 | INSUFFICIENT_DATA:19 |
| RANGE | CRYPTO_PRICE_RANGE | 6 / 2 | 6 | NEUTRAL:5; WATCH:1 |
| UP_DOWN | CRYPTO_UP_DOWN | 0 / 0 | 0 | None |
| EVENT | CRYPTO_EVENT | 16 / 6 | 0 | INSUFFICIENT_DATA:16 |
| SPORTS_MATCH | SPORTS_MATCH | 26 / 12 | 0 | INSUFFICIENT_DATA:26 |
| SPORTS_LINE | SPORTS_LINE | 5 / 2 | 0 | INSUFFICIENT_DATA:5 |
| COUNT_BRACKET | COUNT_BRACKET | 3 / 1 | 0 | INSUFFICIENT_DATA:3 |
| NUMERIC_BRACKET | NUMERIC_BRACKET | 0 / 0 | 0 | None |
| POLITICAL_EVENT | POLITICAL_EVENT | 21 / 7 | 0 | INSUFFICIENT_DATA:21 |
| ECONOMIC_EVENT | ECONOMIC_EVENT | 0 / 0 | 0 | None |
| OTHER | OTHER | 8 / 3 | 0 | INSUFFICIENT_DATA:8 |


79/150 (52.67%) are question types that cannot originate a v2 autonomous trade
under the existing quantitative-source allowlist. Another 19/150 (12.67%) have
a recognized Touch shape but no resolution-verified template ID. Thus **98/150
(65.33%) cannot form a validated posterior in this sample**, before deciding
whether any otherwise supported market has a sufficiently large executable edge.
This is proven source coverage, not proof that a configured evidence feed is broken.

The 19 Touch records consist of:

- 9 Bitcoin and 7 Ethereum evaluations (six markets) with slugs ending
  september-28-october-4-2026. The current weekly regex accepts one month plus two
  day numbers, so these cross-month slugs do not match BINANCE_HIGH_ET_WEEK.
- 3 evaluations of “Will Ethereum hit $3k by September 30, 2026?” with slug
  when-will-ethereum-hit-3k, which is not the approved daily/weekly Touch template.

These are explicit PRICE_TEMPLATE_NOT_VERIFIED outcomes. The title/coin/strike
classifier itself matches all 150 stored classifications on the extracted public
inputs. A cross-month coverage exclusion is observable; labeling it an accidental
classifier bug or authorizing a new resolution mapping requires separate manual
adjudication of the actual market rule. No template was expanded in this audit.

## Data, evidence and probability reconstruction

All 44 insufficient-book records have market_probability=NULL, p0=NULL,
NO_ORDER_BOOK and INSUFFICIENT_DEPTH. Their 50% model_probability is a display
fallback, not a finite market prior or scorable forecast. Thirty-eight have a
non-null saved YES ask, proving some parsed ask data was available; a valid
midpoint requires both best bid and best ask. “NO_ORDER_BOOK” therefore need not
mean a failed HTTP fetch. Historical 404/timeout/one-sided transport status is not
persisted here. The remaining six cases cannot be separated into empty book,
transient failure or 404 using these records alone. No outage diagnosis is justified.

All 54 no-evidence records have a finite prior and model=prior to stored rounding.
All 52 supported cases have PRICE_MODEL, finite p0/posterior, and source input data.
There are **zero** PRICE_DATA_UNAVAILABLE, PRICE_DATA_STALE,
PRICE_HISTORY_INSUFFICIENT, PRICE_WINDOW_UNVERIFIED or PRICE_MODEL_UNDEFINED
admissibility failures in the 150 records. Spot closed-candle age is 2,943-21,289ms,
below the existing 120,000ms cap; maxCloseTimeUsed < asOfMs in all 52 cases.

Read-only reconstruction from real saved inputs matched:

- 150/150 question type and template ID results;
- 52/52 price-model source q and volatility x1.0/x1.5 bands;
- 52/52 bounded-logit posterior, band, logit budget and rounded stored model;
- 54/54 finite-prior abstentions and 44 unscorable fallback rows;
- zero incoherent market ticks in the three reconstructed price ladders.

No new evaluateMarket calls, AI calls, network calls or engine evaluations were
created during this reconstruction. It reads and recomputes only public fields of
the actual saved sample. Arithmetic consistency does not prove probability accuracy
or calibration. Full book levels and original execution prices are not saved in
these Demo predictions, so historical book walking/fees cannot be independently
replayed from the retained rows. Stored net edge/band and the deployed source are
the evidence for those checks; current live books must not substitute for old books.

30 records are marked used_ai_recheck; only one final record has AI_REVIEW.
The other 29 do not retain provider failure/response status. The free-provider
chain can return null or an unusable probability without throwing, so zero
AI_RECHECK_FAILED is not proof of 30 successful AI responses. This is an
observability gap; it is not shown to be the reason a qualified trade was lost.
All 52 price models are present independently, AI cannot originate an unsupported
trade, and no valid chosen edge >=5 exists in the retained sample.

All 150 rows are v2. No historical outcome is used to tune or score this audit.
The current candidate pool is not fully horizon-clean: 33/150 reconstructed
evaluation horizons were <24h (all in the unsupported/no-evidence group); current
pool at 00:52:52Z has 62 ELIGIBLE and 12 <24h. The bounded safety sweep checks
closed state, while a fresh entry horizon check is later. Stale ELIGIBLE labels
and an unordered limit(50) are sampling/throughput limitations, not proof that a
passing supported opportunity was blocked. All supported cases are within horizon.

## H1-H8, confidence and tradeability

Gate derivations refer to the chosen side. DP/DF are conditions reconstructed from
saved numeric inputs; they are not additional live decision-return reason codes.
NR means not retained after a short-circuit; NE means the entry check was not reached.
Absence of a reason is never indiscriminately counted as PASS.


| Gate | Exact existing rule | Observed / derived result |
| --- | --- | --- |
| H1 | Absolute posterior logit shift <= sum(group caps) +1e-9 | 52 derived pass; 98 N/A (no posterior) |
| H2 | Both executable edge-band endpoints >=effective minEdge (5pp; UNCLEAR 10pp) | 52 chosen-side conditions fail; 98 N/A. Final reason can be suppressed by EDGE_BELOW_MIN or earlier return |
| H3 | PRICE_MODEL delta supports the chosen side (>1e-12 after direction sign) | 36 derived pass / 16 derived fail; 98 N/A. The 16 are already NEUTRAL early returns |
| H4 | AI q must not oppose prior by >5pp for chosen side | 1 AI-present chosen-side condition compatible; 149 have no AI group. No recorded chosen veto |
| H5 | Monotone strike ladder for same event/template/direction | 0 incoherent reconstructed market ticks; actual candidate filter not reached for all 150 |
| H6 | Low-price pLow >=1.5*execPrice; high-price complement risk <=(1-execPrice)/1.5 | 17 recorded failures, 3 Watch with no H6 failure; other 130 final traces do not certify H6 |
| H7 | HIGH_RISK avoids; UNCLEAR doubles minEdge | 83 CLEAR / 67 UNCLEAR; all 52 price models CLEAR; no chosen H7 final rejection |
| H8 | Same market/side actionable v2 previous tick, 3-15min gap | Not reached in all 150; no H8 rejection or live pass observed |


Confidence is **C=round(100*V*A*R)**. R is the fraction of the two edge-band
endpoints meeting the same effective minEdge. PRICE_MODEL validation V=.5;
agreeing, fully robust price evidence can reach 50 and clear minConfidence=40.
It is not structurally impossible for the current engine to produce opportunities.
In this sample, the 20 Watch cases have neither endpoint >=5, so R=0 and C=0.
The one Avoid has R=0.5 and C=25, but has excessive spread. Across all rows,
confidence values are 149 zeros and one 25. Lowering confidence alone would
not solve the observed below-edge condition. Disabling H6 alone also creates
no qualified trade from these recorded cases: its 17 failures still fail edge
and confidence. H5/H8 do not explain the preceding loss of actionability.

Tradeability is independent of score: valid midpoint, liquidity score>=30,
spread<=6%, and combined bid/ask depth within 1%>=50 USDC. 93 selected sides
are tradeable; 57 are not. Recorded tradeability reasons: NO_ORDER_BOOK 44,
INSUFFICIENT_DEPTH 57, SPREAD_TOO_WIDE 2 (overlap). Among supported cases,
47 are tradeable and 5 are not. All 20 Watch cases are tradeable; the lone
positive-edge Avoid has NO spread 26.08696%, beyond both the decision-time
16% avoid limit and the separate 6% tradeability limit.

## Concrete Production examples


### Record 2: Supported book but unsupported sports probability

- Market: Will China PR win on 2026-10-02? (M44); evaluation 2026-09-30T20:51:17.492000+00:00.
- Prediction ID: 3cb73ad2-fbd7-411d-95da-0a433d16e749; cycle 1.
- Type/template: SPORTS_MATCH / NONE. Finite prior YES: 2.75%; model YES: 2.75%; chosen side: NO.
- Chosen raw/net edge: 0/-0.28 pp; chosen edge band [-0.28, -0.28]; confidence 0; tradeable True; spread 0.3085%.
- Decision INSUFFICIENT_DATA; chosen reasons NO_ADMISSIBLE_EVIDENCE; admissibility NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH.


### Record 14: Cross-month Touch template excluded

- Market: Will Bitcoin reach $98,000 September 28-October 4? (M50); evaluation 2026-09-30T20:51:17.719000+00:00.
- Prediction ID: 3ba7e3df-4851-40c2-9e6d-e290a5280df8; cycle 1.
- Type/template: CRYPTO_PRICE_TOUCH / NONE. Finite prior YES: 0.6%; model YES: 0.6%; chosen side: NO.
- Chosen raw/net edge: 0/-0.13 pp; chosen edge band [-0.13, -0.13]; confidence 0; tradeable True; spread 0.2012%.
- Decision INSUFFICIENT_DATA; chosen reasons NO_ADMISSIBLE_EVIDENCE; admissibility PRICE_TEMPLATE_NOT_VERIFIED.


### Record 22: Tradeable tiny positive edge, multiple overlapping failures

- Market: Will the price of Bitcoin be above $76,000 on October 3? (M27); evaluation 2026-09-30T20:51:19.683000+00:00.
- Prediction ID: ef81332e-b875-4207-82f0-bacc791cf6ff; cycle 1.
- Type/template: CRYPTO_PRICE_AT / BINANCE_CLOSE_NOON_ET_ABOVE. Finite prior YES: 98.85%; model YES: 99.31%; chosen side: YES.
- Chosen raw/net edge: 0.46/0.33 pp; chosen edge band [-1.14, 0.33]; confidence 0; tradeable True; spread 0.1012%.
- Decision WATCH; chosen reasons EDGE_BELOW_MIN, H6_TAIL_UNSAFE, CONFIDENCE_BELOW_MIN; admissibility none.


### Record 44: Tradeable tiny edge; H6 is not its blocker

- Market: Will the price of Ethereum be above $2,300 on October 2? (M29); evaluation 2026-09-30T20:51:18.448000+00:00.
- Prediction ID: c1b03550-33c1-46b8-9cdd-436f057a609f; cycle 1.
- Type/template: CRYPTO_PRICE_AT / BINANCE_CLOSE_NOON_ET_ABOVE. Finite prior YES: 99.45%; model YES: 99.77%; chosen side: YES.
- Chosen raw/net edge: 0.32/0.14 pp; chosen edge band [0.14, 0.14]; confidence 0; tradeable True; spread 0.3017%.
- Decision WATCH; chosen reasons EDGE_BELOW_MIN, CONFIDENCE_BELOW_MIN; admissibility none.


### Record 111: Largest chosen positive edge and largest prior/posterior gap

- Market: Will the price of Bitcoin be above $78,000 on October 4? (M49); evaluation 2026-09-30T21:01:18.863000+00:00.
- Prediction ID: cc1fe278-5ac0-4e22-bfbc-a497b8c18b18; cycle 3.
- Type/template: CRYPTO_PRICE_AT / BINANCE_CLOSE_NOON_ET_ABOVE. Finite prior YES: 97.7%; model YES: 94.6%; chosen side: NO.
- Chosen raw/net edge: 3.1/2.63 pp; chosen edge band [2.63, 6.42]; confidence 25; tradeable False; spread 26.087%.
- Decision AVOID; chosen reasons MARKET_UNTRADEABLE; admissibility none.


### Record 16: Model probability differs from market but the buy edge is negative

- Market: Will the price of Bitcoin be above $78,000 on October 6? (M52); evaluation 2026-09-30T20:51:19.330000+00:00.
- Prediction ID: cd352cd2-5e5e-4a88-9a8f-f7e2eaec8856; cycle 1.
- Type/template: CRYPTO_PRICE_AT / BINANCE_CLOSE_NOON_ET_ABOVE. Finite prior YES: 95.25%; model YES: 93.32%; chosen side: YES.
- Chosen raw/net edge: -1.93/-2.67 pp; chosen edge band [-5.89, -2.67]; confidence 0; tradeable True; spread 0.9449%.
- Decision NEUTRAL; chosen reasons NO_POSITIVE_EDGE; admissibility none.


### Record 1: One-sided/missing valid book, fallback must not be scored

- Market: Ethereum all time high by September 30, 2026? (M53); evaluation 2026-09-30T20:51:17.487000+00:00.
- Prediction ID: aae1255f-0632-41cd-836d-d3e95526f89d; cycle 1.
- Type/template: CRYPTO_EVENT / NONE. Finite prior YES: NULL%; model YES: 50%; chosen side: YES.
- Chosen raw/net edge: 0/0 pp; chosen edge band [-0.18, -0.18]; confidence 0; tradeable False; spread NULL%.
- Decision INSUFFICIENT_DATA; chosen reasons INSUFFICIENT_MARKET_DATA; admissibility NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT.


Record 111 has prior YES 97.7%, posterior YES 94.5969% (3.1031 pp gap), chosen
NO edge 2.63 pp, confidence 25, and an untradeable NO book. PRICE_MODEL q is
95.1493% with band 86.1879%-95.1493%; the optional AI q=5% contributes only
the capped -0.5 logit shift. This is a real admissible/sufficient case where a
posterior moves meaningfully, but other constraints prevent entry. It does not
meet the point-edge minimum either, and is not evidence for model/AI superiority.

## Autonomous-enter insert reachability and current ledger

Source ordering is: read ELIGIBLE candidates -> evaluate v2 -> top-10 optional AI
recheck -> save every prediction -> decision actionability -> H5 -> horizon ->
tradeability -> H8 -> rank -> enabled users/category match -> fresh Gamma/chosen
CLOB book -> positive Kelly -> annotate would_open -> per-user duplicate/capital/
book fill -> existing prediction_autonomous_trades insert. Dry-run returns through
a separate shadow branch; autonomous-enter passes false and can reach the insert.

The existing isolated actual-handler lifecycle suite was re-run, unchanged, in a
credential-sanitized local process: **21 tests passed, 0 failed/skipped**. It uses
in-memory DB and blocked/stubbed transports; its second stable tick creates five
per-user Demo positions, then verifies fresh revalidation, both-side execution,
bounded sizing, duplicate protection, marks, settlement, gross/fees/net PnL,
history, idempotency and account isolation. Shadow never inserts; Real returns 501;
no request leaves the isolated environment. Synthetic local test positions are
not Production evidence or fixtures in Production. No new test was written.

Thus the insert path is structurally reachable and existing tests demonstrate
that it works when gates pass in isolation. It has **not** been demonstrated with
a qualified natural Production opportunity. No real-sample candidate reached
fresh revalidation/insert, so one cannot claim a live insert acceptance or identify
an insert-path bug from this empty sample.

Current Production ledger at 00:48:23Z: total autonomous Demo trades=0, open=0,
closed=0, gross PnL=0, entry fees=0, net PnL=0. Prediction Real trade count=0;
Prediction learn runs since activation=0. Zero trades is neither profitability
nor a performance-loss result. There is no live win rate, average holding time
or trade-level PnL distribution to assess.

## Recommendations and remaining limits

Keep the current Demo gate ON and all Real/Learning protections OFF. No threshold
is proven excessively restrictive by this 150-evaluation sample. Three repeated
cycles cannot estimate population opportunity frequency or the best risk threshold.

Recommended separate controlled work, in priority order:

1. Continue a larger prospective read-only cohort with unchanged gates. Cover
   supported-template near-money strikes and measure actual distinct-market
   coverage; do not interpret unordered 50-slot repeated samples as the entire
   market. No monitoring automation was created by this audit.
2. Separately adjudicate the six cross-month weekly Touch markets (16 evaluations)
   against their real resolution rules. Only after independent rule verification
   and a controlled implementation/test approval could that mapping be expanded.
   Expected effect: eligibility to attempt a price-model build for those markets,
   **not** guaranteed positive edge/trades. Remaining horizon/window/high and
   H1-H8 still apply. Risk: mapping the wrong date window/source/polarity creates
   incorrect probabilities and outcome attribution. The three long-horizon/by-date
   Touch evaluations should not inherit a weekly rule merely to increase coverage.
3. Investigate candidate-pool horizon hygiene and unordered LIMIT sampling in a
   separate task. Current stale/unsupported slots waste bounded evaluation capacity;
   changing ordering/filtering can alter which markets are observed and must retain
   bounds/fail-closed/first-observation statistical semantics. No passing opportunity
   missed outside this cohort has been proven.
4. If AI reliability must be diagnosed, add separately approved sanitized provider
   outcome telemetry or use existing response logs without secrets. 29/30 rechecks
   lack final AI evidence, but no causal diagnosis of credentials/provider/network
   failure is possible here, and reviewers cannot originate unsupported trades.
5. Any threshold experiment must be separate, preregistered, offline against
   temporally defensible observations with unchanged risk and held-out evaluation.
   Rule minEdge=5pp rejects all 20 tradeable Watch cases (0.01-0.61pp); lowering a
   point filter to 1pp admits zero of them, 0.5pp admits three, 0.1pp admits 14.
   These are static point-filter counts, **not** predicted trades: confidence R,
   H2/H6/H8, executable costs and subsequent books/users interact. Reducing
   confidence or disabling H6 alone changes no existing qualified result. Risks
   include trading costs/model error/swings dominating tiny apparent edges.
   No production or offline strategy-threshold experiment was executed here.

Historical CLOB transport statuses, complete original per-side books/execution
prices, initial pre-AI evaluation results, and AI response failures are not retained
in the sampled rows. Gate conditions hidden by early decisions are distinguished
from recorded reasons; all downstream H8/insert claims remain limited accordingly.
Registry fields updated since the sample cannot prove their old exact values.

**Phase 9A statistical validation is NOT COMPLETE.** No profitability, model
accuracy, calibration or AI superiority claim is made. No chronology-uncertified
historical outcomes are scored or used to tune anything.

## Source and verification references

- [Deterministic question/template classifier](https://github.com/signal0verse/signalverse-main/blob/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/api/predictions.ts#L734)
- [Bounded market-anchored posterior](https://github.com/signal0verse/signalverse-main/blob/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/api/predictions.ts#L892)
- [Confidence formula](https://github.com/signal0verse/signalverse-main/blob/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/api/predictions.ts#L909)
- [H1/H2/H3/H4/H6 formulas](https://github.com/signal0verse/signalverse-main/blob/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/api/predictions.ts#L934)
- [Decision ordering / threshold reasons](https://github.com/signal0verse/signalverse-main/blob/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/api/predictions.ts#L1044)
- [Independent tradeability](https://github.com/signal0verse/signalverse-main/blob/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/api/predictions.ts#L1074)
- [Actual evaluation and stored V2_META](https://github.com/signal0verse/signalverse-main/blob/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/api/predictions.ts#L1475)
- [Persisted anonymous evaluation columns](https://github.com/signal0verse/signalverse-main/blob/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/api/predictions.ts#L1611)
- [Autonomous candidate selection and entry gates](https://github.com/signal0verse/signalverse-main/blob/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/api/predictions.ts#L2226)
- [Per-user Demo insertion](https://github.com/signal0verse/signalverse-main/blob/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/api/predictions.ts#L2494)
- [Cron entry route](https://github.com/signal0verse/signalverse-main/blob/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/api/predictions.ts#L2962)

- [Existing isolated lifecycle suite](https://github.com/signal0verse/signalverse-main/blob/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/scripts/prediction-demo-lifecycle-test.mjs).

- Independent SQL reconciliation: 150 rows, finite prior 106, price groups 52,
  positive edge 21, edge>=5 0, confidence>=40 0, tradeable 93,
  would_open=true 0 / NULL 150, no valid book 44. Cohort fingerprint:
  b47f872bc0da16e441932eca84c0d9ce (excludes outcome mutations/private user ID).
- Local forensic receipts remain under tmp/prediction-demo-zero-trade-audit-20261001/.
  No raw database export, credentials or private account data is published; the
  appendices are the requested derived audit of anonymous public-market evaluations.

## Appendix A — all 150 actual evaluations

Numbers are stable in ts/id order. Market keys resolve in Appendix D, including
full condition_id and question. All rows were selected as ELIGIBLE by the entry
source; current registry candidate status appears separately. p0, YES book midpoint
and model are YES percentages; raw/net edge and edge band refer to the **chosen
side**, so a NO model side probability is 100 minus the listed model YES. No
display fallback 50 is treated as a real prior. Eval time is saved asOfMs; row ts
is recorded separately. Class V=VALID_PREDICTION, I=INSUFFICIENT_EVIDENCE.
Evidence P=PRICE_MODEL, A=AI_REVIEW, NONE=no quantitative group. W=NULL in every
row denotes the not-yet-reached would_open annotation, never fabricated false.


<details>
<summary>Cycle 1: 50 actual Demo evaluations</summary>


| # / prediction ID | Market / type | Eval / row time UTC | p0 / YES mid / model % | Side / raw / net pp | Conf / edge band pp | Tradeable / resolution | Class / current status | Horizon h / evidence | Decision / reasons / W |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 / aae1255f-0632-41cd-836d-d3e95526f89d | M53 / CRYPTO_EVENT | 20:51:17.487000 / 20:51:21.511977 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.18, -0.18] | False / UNCLEAR | I / ELIGIBLE | 7.1285 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 2 / 3cb73ad2-fbd7-411d-95da-0a433d16e749 | M44 / SPORTS_MATCH | 20:51:17.492000 / 20:51:21.527865 | 2.75 / 2.75 / 2.75 | NO / 0 / -0.28 | 0 / [-0.28, -0.28] | True / CLEAR | I / ELIGIBLE | 38.7285 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 3 / 760613a7-f784-427d-9e3a-e617ee95097f | M47 / CRYPTO_EVENT | 20:51:17.488000 / 20:51:21.537608 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.13, -0.13] | False / UNCLEAR | I / ELIGIBLE | 7.1285 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 4 / 5c2591ca-4005-4853-bcc1-f81b3ab8fbd0 | M58 / CRYPTO_EVENT | 20:51:17.552000 / 20:51:21.551124 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.11, -0.11] | False / UNCLEAR | I / ELIGIBLE | 7.1285 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 5 / 5cf61598-e644-409f-9912-976064897d8a | M21 / SPORTS_MATCH | 20:51:17.497000 / 20:51:21.563073 | 19.5 / 19.5 / 19.5 | NO / 0 / -1.27 | 0 / [-1.27, -1.27] | True / CLEAR | I / FILTERED_OUT | 162.1451 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 6 / f0371a80-f26f-4639-a5c3-634d226bcf2b | M46 / POLITICAL_EVENT | 20:51:17.611000 / 20:51:21.575185 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.1, -0.1] | False / UNCLEAR | I / ELIGIBLE | 103.1284 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 7 / 6f3d07c8-ad29-466d-a41a-f811e6c18b3a | M57 / CRYPTO_PRICE_RANGE | 20:51:17.628000 / 20:51:21.589389 | 0.35 / 0.35 / 0.19 | NO / 0.16 / 0 | 0 / [-0.46, 0] | True / CLEAR | V / ELIGIBLE | 43.1451 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 8 / fc0a5cfe-1880-47ab-a336-418e48c59d01 | M39 / CRYPTO_EVENT | 20:51:17.632000 / 20:51:21.607181 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-7.73, -7.73] | False / UNCLEAR | I / ELIGIBLE | 7.1284 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 9 / d3f6e928-76ed-4023-bfa9-2ee646ff8e10 | M45 / POLITICAL_EVENT | 20:51:17.634000 / 20:51:21.621889 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.1, -0.1] | False / UNCLEAR | I / ELIGIBLE | 7.1284 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 10 / 89a8c9c2-04b1-4a91-9211-b02914031c67 | M43 / OTHER | 20:51:17.674000 / 20:51:21.635916 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-1.76, -1.76] | False / UNCLEAR | I / ELIGIBLE | 7.1284 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 11 / 2d75b78e-bbbe-4160-88f8-7102d0902237 | M48 / POLITICAL_EVENT | 20:51:17.677000 / 20:51:21.647267 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.1, -0.1] | False / UNCLEAR | I / ELIGIBLE | 103.1284 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 12 / 024fd522-b1fe-4d09-a2e8-59faa21c77dc | M49 / CRYPTO_PRICE_AT | 20:51:18.618000 / 20:51:21.662782 | 97.65 / 97.65 / 96.56 | YES / -1.09 / -1.58 | 0 / [-4.04, -1.58] | True / CLEAR | V / ELIGIBLE | 91.1448 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 13 / 507677e0-a1e4-41e7-ae8d-cbe2f57bb827 | M37 / CRYPTO_PRICE_AT | 20:51:19.106000 / 20:51:21.678846 | 97.8 / 97.8 / 97.55 | YES / -0.25 / -0.68 | 0 / [-3.06, -0.68] | True / CLEAR | V / ELIGIBLE | 67.1447 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 14 / 3ba7e3df-4851-40c2-9e6d-e290a5280df8 | M50 / CRYPTO_PRICE_TOUCH | 20:51:17.719000 / 20:51:21.694741 | 0.6 / 0.6 / 0.6 | NO / 0 / -0.13 | 0 / [-0.13, -0.13] | True / UNCLEAR | I / ELIGIBLE | 103.1451 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 15 / 9f9ca3d7-bc5e-4c14-822d-3e4738f9b008 | M41 / COUNT_BRACKET | 20:51:17.722000 / 20:51:21.705804 | 99.75 / 99.75 / 99.75 | YES / 0 / -0.06 | 0 / [-0.06, -0.06] | True / UNCLEAR | I / ELIGIBLE | 7.1284 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 16 / cd352cd2-5e5e-4a88-9a8f-f7e2eaec8856 | M52 / CRYPTO_PRICE_AT | 20:51:19.330000 / 20:51:21.716993 | 95.25 / 95.25 / 93.32 | YES / -1.93 / -2.67 | 0 / [-5.89, -2.67] | True / CLEAR | V / ELIGIBLE | 139.1446 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 17 / 843942c9-f3dd-4981-8584-23ee82c0d124 | M56 / CRYPTO_PRICE_TOUCH | 20:51:17.742000 / 20:51:21.734125 | 0.35 / 0.35 / 0.35 | NO / 0 / -0.07 | 0 / [-0.07, -0.07] | True / UNCLEAR | I / ELIGIBLE | 103.1451 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 18 / f48d14ad-4d49-471e-8aee-028db4a89499 | M55 / CRYPTO_PRICE_TOUCH | 20:51:17.810000 / 20:51:21.746305 | 1.25 / 1.25 / 1.25 | NO / 0 / -0.31 | 0 / [-0.31, -0.31] | True / UNCLEAR | I / ELIGIBLE | 103.1451 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 19 / 84223ac5-7ce9-4e88-a16f-441863dcaa45 | M17 / POLITICAL_EVENT | 20:51:17.811000 / 20:51:21.765557 | 38.5 / 38.5 / 38.5 | NO / 0 / -1.44 | 0 / [-1.44, -1.44] | True / UNCLEAR | I / ELIGIBLE | 103.1284 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 20 / eb7bcc16-232d-4b7e-a197-8fe789ae4225 | M36 / CRYPTO_PRICE_TOUCH | 20:51:17.828000 / 20:51:21.783917 | 0.4 / 0.4 / 0.4 | NO / 0 / -0.21 | 0 / [-0.21, -0.21] | True / UNCLEAR | I / ELIGIBLE | 103.145 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 21 / d5af19bc-cc45-4076-a504-1002feee8235 | M38 / SPORTS_LINE | 20:51:17.832000 / 20:51:21.796157 | 60.5 / 60.5 / 60.5 | YES / 0 / -1.69 | 0 / [-1.69, -1.69] | True / CLEAR | I / ELIGIBLE | 88.645 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 22 / ef81332e-b875-4207-82f0-bacc791cf6ff | M27 / CRYPTO_PRICE_AT | 20:51:19.683000 / 20:51:21.810947 | 98.85 / 98.85 / 99.31 | YES / 0.46 / 0.33 | 0 / [-1.14, 0.33] | True / CLEAR | V / ELIGIBLE | 67.1445 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 23 / 781f6ea3-ee42-4e92-be60-f20fc7ce80a6 | M51 / CRYPTO_PRICE_TOUCH | 20:51:17.876000 / 20:51:21.825281 | 0.8 / 0.8 / 0.8 | NO / 0 / -0.33 | 0 / [-0.33, -0.33] | True / UNCLEAR | I / ELIGIBLE | 103.145 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 24 / 0e4a5760-3ee5-4a34-b37e-72f38671fabf | M02 / CRYPTO_PRICE_TOUCH | 20:51:17.878000 / 20:51:21.837087 | 1.15 / 1.15 / 1.15 | NO / 0 / -0.5 | 0 / [-0.5, -0.5] | True / UNCLEAR | I / ELIGIBLE | 103.145 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 25 / 8b68c53b-4c9d-47f0-92b2-973b779d9a48 | M05 / CRYPTO_PRICE_AT | 20:51:19.906000 / 20:51:21.847946 | 98.2 / 98.2 / 97.99 | YES / -0.21 / -0.61 | 0 / [-2.78, -0.61] | True / CLEAR | V / ELIGIBLE | 115.1445 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 26 / 0649bdcb-853b-4ac6-8e94-b3d4da24d70d | M09 / CRYPTO_PRICE_AT | 20:51:20.185000 / 20:51:21.858611 | 98.95 / 98.95 / 99.68 | YES / 0.73 / 0.61 | 0 / [-0.04, 0.61] | True / CLEAR | V / ELIGIBLE | 43.1444 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 27 / 626c5469-02fd-409d-9ce7-69d108644385 | M42 / CRYPTO_PRICE_AT | 20:51:20.438000 / 20:51:21.873015 | 99.1 / 99.1 / 99.06 | YES / -0.04 / -0.2 | 0 / [-1.66, -0.2] | True / CLEAR | V / ELIGIBLE | 139.1443 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 28 / 23866876-131b-4d94-8bb2-488efc0923ed | M10 / CRYPTO_PRICE_AT | 20:51:18.264000 / 20:51:21.888787 | 99.75 / 99.75 / 99.84 | YES / 0.09 / 0.03 | 0 / [-0.07, 0.03] | True / CLEAR | V / ELIGIBLE | 43.1449 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 29 / de1b9999-e940-4f99-998e-1e1029a219e5 | M11 / CRYPTO_PRICE_AT | 20:51:20.664000 / 20:51:21.900237 | 98.85 / 98.85 / 99.23 | YES / 0.38 / -0.2 | 0 / [-1.73, -0.2] | True / CLEAR | V / ELIGIBLE | 115.1443 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 30 / ac8db51d-af31-4312-84c6-2d7a19492675 | M08 / POLITICAL_EVENT | 20:51:18.306000 / 20:51:21.912738 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.11, -0.11] | False / UNCLEAR | I / ELIGIBLE | 103.1282 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 31 / a2d34ced-20d9-4d09-ba75-67636ad8195d | M06 / CRYPTO_PRICE_AT | 20:51:21.020000 / 20:51:21.924713 | 98.5 / 98.5 / 99.61 | YES / 1.11 / -0.3 | 0 / [-0.3, -0.3] | False / CLEAR | V / ELIGIBLE | 43.1442 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 32 / 8ce4a48b-4dd4-4777-8c4b-3330f81e2d95 | M16 / CRYPTO_PRICE_AT | 20:51:18.313000 / 20:51:21.935937 | 99.2 / 99.2 / 99.61 | YES / 0.41 / -0.2 | 0 / [-1.31, -0.2] | True / CLEAR | V / ELIGIBLE | 91.1449 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 33 / 6c621c80-a0e9-4b69-a235-84aa249e0dca | M12 / SPORTS_MATCH | 20:51:18.316000 / 20:51:21.951254 | 39.5 / 39.5 / 39.5 | YES / 0 / -1.7 | 0 / [-1.7, -1.7] | False / CLEAR | I / FILTERED_OUT | 165.1449 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 34 / 213d2d1e-634a-474f-8a47-495f3ad9fbcd | M14 / CRYPTO_PRICE_AT | 20:51:18.345000 / 20:51:21.971687 | 99.35 / 99.35 / 99.74 | YES / 0.39 / 0.12 | 0 / [-0.53, 0.12] | True / CLEAR | V / ELIGIBLE | 67.1449 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 35 / 09f348bf-9fcc-43e4-8ac4-9d173ea8f9db | M04 / SPORTS_MATCH | 20:51:18.352000 / 20:51:21.992594 | 63.5 / 63.5 / 63.5 | YES / 0 / -1.65 | 0 / [-1.65, -1.65] | True / CLEAR | I / ELIGIBLE | 88.6449 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 36 / 43a7d28c-8299-4f79-91dc-534d6b7a1b0c | M19 / POLITICAL_EVENT | 20:51:18.358000 / 20:51:22.010310 | 29.55 / 29.55 / 29.55 | NO / 0 / -1.54 | 0 / [-1.54, -1.54] | False / UNCLEAR | I / ELIGIBLE | 103.1282 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 37 / 43edb66c-2b98-441c-bf66-3d53963f1253 | M23 / CRYPTO_PRICE_AT | 20:51:18.371000 / 20:51:22.026944 | 99.55 / 99.55 / 99.79 | YES / 0.24 / 0.07 | 0 / [0.07, 0.07] | True / CLEAR | V / ELIGIBLE | 43.1449 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 38 / 71aae7aa-6a29-451c-b32b-26d85a9eaec7 | M20 / POLITICAL_EVENT | 20:51:18.384000 / 20:51:22.060635 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.1, -0.1] | False / UNCLEAR | I / ELIGIBLE | 103.1282 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 39 / ed2ecf72-f8ef-4b32-91b4-a444c8200534 | M35 / SPORTS_MATCH | 20:51:18.396000 / 20:51:22.079365 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [0, 0] | False / CLEAR | I / FILTERED_OUT | 162.1449 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 40 / c7ce7797-aa86-4155-9150-f9529d305539 | M22 / SPORTS_MATCH | 20:51:18.409000 / 20:51:22.092346 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.13, -0.13] | False / CLEAR | I / ELIGIBLE | 158.6449 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 41 / 7e139781-aed0-4761-b736-0e1df48c06bf | M03 / OTHER | 20:51:18.422000 / 20:51:22.106851 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-2.3, -2.3] | False / UNCLEAR | I / ELIGIBLE | 7.1282 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 42 / b93eeee8-5613-4017-9769-4ef86c6f9db5 | M18 / CRYPTO_PRICE_AT | 20:51:21.288000 / 20:51:22.116795 | 99.15 / 99.15 / 98.99 | YES / -0.16 / -0.35 | 0 / [-1.79, -0.35] | True / CLEAR | V / ELIGIBLE | 91.1441 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 43 / e1f3a53b-5818-4719-ae3c-7232bb22d1e9 | M28 / SPORTS_MATCH | 20:51:18.446000 / 20:51:22.132054 | 96.7 / 96.7 / 96.7 | YES / 0 / -0.59 | 0 / [-0.59, -0.59] | True / CLEAR | I / ELIGIBLE | 38.7282 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 44 / c1b03550-33c1-46b8-9cdd-436f057a609f | M29 / CRYPTO_PRICE_AT | 20:51:18.448000 / 20:51:22.150323 | 99.45 / 99.45 / 99.77 | YES / 0.32 / 0.14 | 0 / [0.14, 0.14] | True / CLEAR | V / ELIGIBLE | 43.1449 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,CONFIDENCE_BELOW_MIN / NULL |
| 45 / 6d9181b8-52c7-4c3d-9684-4c478e9a1bcf | M13 / OTHER | 20:51:18.460000 / 20:51:22.169496 | 1.95 / 1.95 / 1.95 | NO / 0 / -1.12 | 0 / [-1.12, -1.12] | True / UNCLEAR | I / ELIGIBLE | 7.1282 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 46 / 299e991e-740c-4b04-9959-dfc6aa70fbcf | M30 / CRYPTO_PRICE_TOUCH | 20:51:18.471000 / 20:51:22.185829 | 0.2 / 0.2 / 0.2 | NO / 0 / -0.11 | 0 / [-0.11, -0.11] | True / UNCLEAR | I / ELIGIBLE | 7.1449 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 47 / 695ae84d-e321-40ad-b729-5a6882ac61e6 | M26 / CRYPTO_PRICE_RANGE | 20:51:18.551000 / 20:51:22.199931 | 0.85 / 0.85 / 0.8 | NO / 0.05 / -0.06 | 0 / [-1.14, -0.06] | True / CLEAR | V / ELIGIBLE | 43.1448 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 48 / 501e6011-db97-4faa-bf30-6afbe59e2ec7 | M32 / CRYPTO_EVENT | 20:51:18.548000 / 20:51:22.214605 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.74, -0.74] | False / UNCLEAR | I / ELIGIBLE | 7.1282 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 49 / 06192280-5263-4624-bb95-5158572603e5 | M01 / SPORTS_LINE | 20:51:18.550000 / 20:51:22.232183 | 64 / 64 / 64 | YES / 0 / -2.14 | 0 / [-2.14, -2.14] | False / CLEAR | I / ELIGIBLE | 88.6448 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 50 / 3fd32614-87a5-4b0e-9d3e-332f28a68f2b | M07 / CRYPTO_PRICE_AT | 20:51:18.553000 / 20:51:22.255426 | 0.45 / 0.45 / 0.21 | NO / 0.24 / 0.16 | 0 / [0.03, 0.16] | True / CLEAR | V / ELIGIBLE | 43.1448 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |


</details>


<details>
<summary>Cycle 2: 50 actual Demo evaluations</summary>


| # / prediction ID | Market / type | Eval / row time UTC | p0 / YES mid / model % | Side / raw / net pp | Conf / edge band pp | Tradeable / resolution | Class / current status | Horizon h / evidence | Decision / reasons / W |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 51 / 9994521c-78d5-4661-b10a-a378642f690e | M53 / CRYPTO_EVENT | 20:56:02.848000 / 20:56:09.466732 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.18, -0.18] | False / UNCLEAR | I / ELIGIBLE | 7.0492 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 52 / 54a0cfd3-9e99-400f-966c-f1f05e22d948 | M47 / CRYPTO_EVENT | 20:56:02.849000 / 20:56:09.483234 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.13, -0.13] | False / UNCLEAR | I / ELIGIBLE | 7.0492 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 53 / 15774a77-0252-4754-85da-91cb45b9cce7 | M44 / SPORTS_MATCH | 20:56:02.851000 / 20:56:09.499547 | 2.95 / 2.95 / 2.95 | NO / 0 / -0.48 | 0 / [-0.48, -0.48] | True / CLEAR | I / ELIGIBLE | 38.6492 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 54 / 3c9b58bb-7493-4ff4-b0d0-7eafcc72799f | M21 / SPORTS_MATCH | 20:56:02.853000 / 20:56:09.513147 | 34.5 / 34.5 / 34.5 | NO / 0 / -1.62 | 0 / [-1.62, -1.62] | True / CLEAR | I / FILTERED_OUT | 162.0659 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 55 / 5cfed58f-01df-47c6-93ab-3bb01c2c0890 | M58 / CRYPTO_EVENT | 20:56:02.908000 / 20:56:09.525708 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.11, -0.11] | False / UNCLEAR | I / ELIGIBLE | 7.0492 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 56 / 47ea26fb-c8cd-4490-a957-5a45fc867f74 | M39 / CRYPTO_EVENT | 20:56:02.943000 / 20:56:09.536680 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-7.73, -7.73] | False / UNCLEAR | I / ELIGIBLE | 7.0492 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 57 / 0b39f135-4695-4bf5-9162-0d8bb558d7ad | M46 / POLITICAL_EVENT | 20:56:02.941000 / 20:56:09.548285 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.1, -0.1] | False / UNCLEAR | I / ELIGIBLE | 103.0492 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 58 / 67f82d9c-d988-4bb7-a33a-4bee93606d83 | M45 / POLITICAL_EVENT | 20:56:02.965000 / 20:56:09.562249 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.1, -0.1] | False / UNCLEAR | I / ELIGIBLE | 7.0492 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 59 / 9b586401-de45-43ea-bdbe-3db3eb895f86 | M43 / OTHER | 20:56:03.019000 / 20:56:09.576983 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-1.76, -1.76] | False / UNCLEAR | I / ELIGIBLE | 7.0492 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 60 / c2988249-1d10-4059-847e-06d0f11b4182 | M48 / POLITICAL_EVENT | 20:56:03.030000 / 20:56:09.594101 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.1, -0.1] | False / UNCLEAR | I / ELIGIBLE | 103.0492 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 61 / 3785d331-829d-4d03-9c32-23ae95562996 | M41 / COUNT_BRACKET | 20:56:03.084000 / 20:56:09.611347 | 99.75 / 99.75 / 99.75 | YES / 0 / -0.06 | 0 / [-0.06, -0.06] | True / UNCLEAR | I / ELIGIBLE | 7.0491 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 62 / ae8a2a4e-c163-4a83-adeb-fe81a9288adb | M50 / CRYPTO_PRICE_TOUCH | 20:56:03.082000 / 20:56:09.624397 | 0.6 / 0.6 / 0.6 | NO / 0 / -0.23 | 0 / [-0.23, -0.23] | True / UNCLEAR | I / ELIGIBLE | 103.0658 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 63 / 0bd36c27-6de9-4da2-931e-fa1e4c1a878e | M56 / CRYPTO_PRICE_TOUCH | 20:56:03.170000 / 20:56:09.637069 | 0.35 / 0.35 / 0.35 | NO / 0 / -0.07 | 0 / [-0.07, -0.07] | True / UNCLEAR | I / ELIGIBLE | 103.0658 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 64 / 82d5f536-e662-486c-9fba-9b7ee8100bf1 | M55 / CRYPTO_PRICE_TOUCH | 20:56:03.219000 / 20:56:09.652485 | 1.25 / 1.25 / 1.25 | NO / 0 / -0.22 | 0 / [-0.22, -0.22] | True / UNCLEAR | I / ELIGIBLE | 103.0658 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 65 / 464d55bf-28f9-4be1-96e7-875c61b981e4 | M17 / POLITICAL_EVENT | 20:56:03.266000 / 20:56:09.667355 | 38.5 / 38.5 / 38.5 | NO / 0 / -1.44 | 0 / [-1.44, -1.44] | True / UNCLEAR | I / ELIGIBLE | 103.0491 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 66 / b08fa31b-8a0f-4904-a6de-631ee0f22616 | M38 / SPORTS_LINE | 20:56:03.312000 / 20:56:09.680239 | 60.5 / 60.5 / 60.5 | YES / 0 / -1.69 | 0 / [-1.69, -1.69] | True / CLEAR | I / ELIGIBLE | 88.5657 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 67 / 8a6ff6ef-c267-4381-bff4-6f080622bc16 | M57 / CRYPTO_PRICE_RANGE | 20:56:02.942000 / 20:56:09.693501 | 0.55 / 0.55 / 0.23 | NO / 0.32 / -0.05 | 0 / [-0.62, -0.05] | True / CLEAR | V / ELIGIBLE | 43.0658 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 68 / cbb90b72-3d38-4df1-9000-bb7c4fd838d7 | M49 / CRYPTO_PRICE_AT | 20:56:06.071000 / 20:56:09.708575 | 97.7 / 97.7 / 96.6 | YES / -1.1 / -1.53 | 0 / [-3.97, -1.53] | True / CLEAR | V / ELIGIBLE | 91.065 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 69 / 6f254624-c343-4ddd-bdeb-84ee23ae711b | M52 / CRYPTO_PRICE_AT | 20:56:06.477000 / 20:56:09.718857 | 95.25 / 95.25 / 93.33 | YES / -1.92 / -2.66 | 0 / [-5.88, -2.66] | True / CLEAR | V / ELIGIBLE | 139.0649 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 70 / eb3208dd-3636-4e02-9a85-9604e3a7e15a | M27 / CRYPTO_PRICE_AT | 20:56:06.773000 / 20:56:09.728613 | 98.85 / 98.85 / 99.31 | YES / 0.46 / 0.34 | 0 / [-1.14, 0.34] | True / CLEAR | V / ELIGIBLE | 67.0648 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 71 / d5cecb9b-db8c-488e-9921-831c828876d3 | M51 / CRYPTO_PRICE_TOUCH | 20:56:04.785000 / 20:56:09.745821 | 0.8 / 0.8 / 0.8 | NO / 0 / -0.33 | 0 / [-0.33, -0.33] | True / UNCLEAR | I / ELIGIBLE | 103.0653 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 72 / 65d2f788-52ea-4855-8f5a-673fe465f3a2 | M42 / CRYPTO_PRICE_AT | 20:56:07.506000 / 20:56:09.762938 | 99.1 / 99.1 / 99.06 | YES / -0.04 / -0.19 | 0 / [-1.65, -0.19] | True / CLEAR | V / ELIGIBLE | 139.0646 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 73 / c3a77f98-2480-457a-b05c-98e7edd59858 | M02 / CRYPTO_PRICE_TOUCH | 20:56:04.786000 / 20:56:09.775853 | 1.35 / 1.35 / 1.35 | NO / 0 / -0.33 | 0 / [-0.33, -0.33] | True / UNCLEAR | I / ELIGIBLE | 103.0653 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 74 / 5097f3d0-9f07-4192-a95b-642791443fc6 | M05 / CRYPTO_PRICE_AT | 20:56:07.757000 / 20:56:09.802859 | 98.2 / 98.2 / 98 | YES / -0.2 / -0.61 | 0 / [-2.77, -0.61] | True / CLEAR | V / ELIGIBLE | 115.0645 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 75 / c96a4ff3-6512-485a-b052-0f6f3bd2af78 | M10 / CRYPTO_PRICE_AT | 20:56:04.852000 / 20:56:09.817996 | 99.75 / 99.75 / 99.84 | YES / 0.09 / 0.03 | 0 / [-0.06, 0.03] | True / CLEAR | V / ELIGIBLE | 43.0653 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 76 / e5daf076-c7d4-45e3-a8f5-58b8cb36048a | M11 / CRYPTO_PRICE_AT | 20:56:04.851000 / 20:56:09.834660 | 98.95 / 98.95 / 99.27 | YES / 0.32 / -0.17 | 0 / [-1.63, -0.17] | True / CLEAR | V / ELIGIBLE | 115.0653 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 77 / 36d3896f-80d6-4486-bd08-b3836a96fa46 | M08 / POLITICAL_EVENT | 20:56:04.923000 / 20:56:09.849524 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.11, -0.11] | False / UNCLEAR | I / ELIGIBLE | 103.0486 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 78 / 9193d924-43ec-44cd-8ea1-9228bd124e99 | M16 / CRYPTO_PRICE_AT | 20:56:07.973000 / 20:56:09.864891 | 99.2 / 99.2 / 99.61 | YES / 0.41 / -0.2 | 0 / [-1.31, -0.2] | True / CLEAR | V / ELIGIBLE | 91.0645 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 79 / 4d7f12f1-59b6-4ae3-8057-01e8b24dbc78 | M14 / CRYPTO_PRICE_AT | 20:56:04.988000 / 20:56:09.877527 | 99.35 / 99.35 / 99.74 | YES / 0.39 / 0.12 | 0 / [-0.53, 0.12] | True / CLEAR | V / ELIGIBLE | 67.0653 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 80 / 4158a345-3fad-44de-9d2c-ac948022d5ec | M12 / SPORTS_MATCH | 20:56:04.984000 / 20:56:09.910700 | 44.5 / 44.5 / 44.5 | NO / 0 / -1.73 | 0 / [-1.73, -1.73] | True / CLEAR | I / FILTERED_OUT | 165.0653 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 81 / f50bb9f4-98b1-4105-b92c-8cedcee5b93d | M04 / SPORTS_MATCH | 20:56:05.047000 / 20:56:09.926332 | 63.5 / 63.5 / 63.5 | YES / 0 / -1.65 | 0 / [-1.65, -1.65] | True / CLEAR | I / ELIGIBLE | 88.5653 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 82 / c5760142-36f9-4901-9eec-fa5e0bb48907 | M19 / POLITICAL_EVENT | 20:56:05.048000 / 20:56:09.948281 | 29.3 / 29.3 / 29.3 | NO / 0 / -1.41 | 0 / [-1.41, -1.41] | True / UNCLEAR | I / ELIGIBLE | 103.0486 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 83 / ddc220c3-03c8-453a-b6f5-f0ba63842a52 | M20 / POLITICAL_EVENT | 20:56:05.096000 / 20:56:09.963480 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.1, -0.1] | False / UNCLEAR | I / ELIGIBLE | 103.0486 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 84 / af161ef4-e56b-4e7a-ac11-ff042b2bdbea | M35 / SPORTS_MATCH | 20:56:05.132000 / 20:56:09.994508 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [0, 0] | False / CLEAR | I / FILTERED_OUT | 162.0652 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 85 / 4b462785-e6dd-48d3-bf51-a2cd64e5bb80 | M09 / CRYPTO_PRICE_AT | 20:56:08.272000 / 20:56:10.010434 | 98.95 / 98.95 / 99.68 | YES / 0.73 / 0.61 | 0 / [-0.04, 0.61] | True / CLEAR | V / ELIGIBLE | 43.0644 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 86 / c523fdc1-e0f7-4c62-a1b3-0446a6c6fb94 | M23 / CRYPTO_PRICE_AT | 20:56:05.094000 / 20:56:10.030758 | 99.55 / 99.55 / 99.79 | YES / 0.24 / 0.07 | 0 / [0.07, 0.07] | True / CLEAR | V / ELIGIBLE | 43.0653 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 87 / 45bca918-64a6-4b75-9009-f756a98201e3 | M18 / CRYPTO_PRICE_AT | 20:56:08.544000 / 20:56:10.058331 | 99.15 / 99.15 / 99 | YES / -0.15 / -0.35 | 0 / [-1.79, -0.35] | True / CLEAR | V / ELIGIBLE | 91.0643 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 88 / 5b99b3ab-0de2-4fce-88f9-af6875ec09ff | M54 / SPORTS_MATCH | 20:56:05.186000 / 20:56:10.070957 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [0, 0] | False / CLEAR | I / FILTERED_OUT | 165.5652 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 89 / 909f5d4e-b4f1-466d-a5c7-3590a9f11de7 | M22 / SPORTS_MATCH | 20:56:05.177000 / 20:56:10.087730 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.13, -0.13] | False / CLEAR | I / ELIGIBLE | 158.5652 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 90 / be351555-9b5d-4395-9dbe-ebe4ad57e4c5 | M03 / OTHER | 20:56:05.231000 / 20:56:10.106306 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-2.3, -2.3] | False / UNCLEAR | I / ELIGIBLE | 7.0485 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 91 / 70471c96-fce5-4d32-b0ee-d983a6cbf2b4 | M29 / CRYPTO_PRICE_AT | 20:56:05.232000 / 20:56:10.118486 | 99.45 / 99.45 / 99.77 | YES / 0.32 / 0.14 | 0 / [0.14, 0.14] | True / CLEAR | V / ELIGIBLE | 43.0652 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,CONFIDENCE_BELOW_MIN / NULL |
| 92 / 3536e8cf-0ecd-4613-9618-fdc3ec4cce34 | M31 / SPORTS_MATCH | 20:56:05.245000 / 20:56:10.133142 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [0, 0] | False / CLEAR | I / FILTERED_OUT | 165.5652 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 93 / eb7d215a-2df1-49bb-bd7f-78bb60c20f7e | M28 / SPORTS_MATCH | 20:56:05.286000 / 20:56:10.147228 | 96.65 / 96.65 / 96.65 | YES / 0 / -0.62 | 0 / [-0.62, -0.62] | True / CLEAR | I / ELIGIBLE | 38.6485 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 94 / 05062797-31c8-4fbd-9665-48ed20c2d359 | M13 / OTHER | 20:56:05.275000 / 20:56:10.159766 | 1.95 / 1.95 / 1.95 | NO / 0 / -1.12 | 0 / [-1.12, -1.12] | True / UNCLEAR | I / ELIGIBLE | 7.0485 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 95 / 0749b7a7-bea7-426d-9f54-57f8ed76d1cc | M15 / CRYPTO_EVENT | 20:56:05.285000 / 20:56:10.173039 | 0.15 / 0.15 / 0.15 | NO / 0 / -0.06 | 0 / [-0.06, -0.06] | True / UNCLEAR | I / ELIGIBLE | 7.0485 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 96 / 863a08ce-acd4-420b-8ae3-7104abcc28ee | M01 / SPORTS_LINE | 20:56:05.340000 / 20:56:10.184030 | 64 / 64 / 64 | YES / 0 / -2.14 | 0 / [-2.14, -2.14] | False / CLEAR | I / ELIGIBLE | 88.5652 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 97 / 34ac2067-3e5e-44d1-b2d6-5e8c46d64b39 | M32 / CRYPTO_EVENT | 20:56:05.339000 / 20:56:10.196069 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.74, -0.74] | False / UNCLEAR | I / ELIGIBLE | 7.0485 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 98 / 4298154d-6b16-4ee3-ba21-306b95f16926 | M30 / CRYPTO_PRICE_TOUCH | 20:56:05.333000 / 20:56:10.209669 | 0.2 / 0.2 / 0.2 | NO / 0 / -0.11 | 0 / [-0.11, -0.11] | True / UNCLEAR | I / ELIGIBLE | 7.0652 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 99 / 290d0566-c3c4-4896-9b85-951cf3195c2d | M26 / CRYPTO_PRICE_RANGE | 20:56:08.842000 / 20:56:10.221511 | 1 / 1 / 0.87 | NO / 0.13 / -0.12 | 0 / [-1.3, -0.12] | True / CLEAR | V / ELIGIBLE | 43.0642 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 100 / 915858e5-8da1-4201-aa35-dabea501ff8a | M06 / CRYPTO_PRICE_AT | 20:56:09.208000 / 20:56:10.232673 | 98.5 / 98.5 / 99.61 | YES / 1.11 / -0.3 | 0 / [-0.3, -0.3] | False / CLEAR | V / ELIGIBLE | 43.0641 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |


</details>


<details>
<summary>Cycle 3: 50 actual Demo evaluations</summary>


| # / prediction ID | Market / type | Eval / row time UTC | p0 / YES mid / model % | Side / raw / net pp | Conf / edge band pp | Tradeable / resolution | Class / current status | Horizon h / evidence | Decision / reasons / W |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 101 / 83808876-3c34-412f-9330-23e06d941e46 | M53 / CRYPTO_EVENT | 21:01:18.271000 / 21:01:21.366298 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.18, -0.18] | False / UNCLEAR | I / ELIGIBLE | 6.9616 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 102 / 1cd46c6d-5b0f-4c51-ba00-9ad10d1a6c67 | M47 / CRYPTO_EVENT | 21:01:18.271000 / 21:01:21.385283 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.13, -0.13] | False / UNCLEAR | I / ELIGIBLE | 6.9616 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 103 / 5a7da60a-147e-4582-aeec-258b8dfe23b8 | M21 / SPORTS_MATCH | 21:01:18.275000 / 21:01:21.401691 | 28.5 / 28.5 / 28.5 | NO / 0 / -1.51 | 0 / [-1.51, -1.51] | True / CLEAR | I / FILTERED_OUT | 161.9783 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 104 / 4deee551-37b6-4d0e-a3fa-ce39f39a8482 | M44 / SPORTS_MATCH | 21:01:18.273000 / 21:01:21.420226 | 3.05 / 3.05 / 3.05 | NO / 0 / -0.49 | 0 / [-0.49, -0.49] | True / CLEAR | I / ELIGIBLE | 38.5616 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 105 / 2c80c921-9d03-4099-ad53-0088edabb0b8 | M58 / CRYPTO_EVENT | 21:01:18.316000 / 21:01:21.437716 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.11, -0.11] | False / UNCLEAR | I / ELIGIBLE | 6.9616 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 106 / bad45f6c-6d28-453a-bcd4-00f8b89d0416 | M43 / OTHER | 21:01:18.365000 / 21:01:21.452777 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-1.84, -1.84] | False / UNCLEAR | I / ELIGIBLE | 6.9616 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 107 / cd96c3a1-020e-41ec-a255-1620ae6bc9a5 | M46 / POLITICAL_EVENT | 21:01:18.351000 / 21:01:21.466671 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.1, -0.1] | False / UNCLEAR | I / ELIGIBLE | 102.9616 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 108 / 25975e01-7efe-457e-8f3b-9b867bd612c8 | M57 / CRYPTO_PRICE_RANGE | 21:01:18.361000 / 21:01:21.478321 | 0.3 / 0.3 / 0.17 | NO / 0.13 / 0.01 | 0 / [-0.4, 0.01] | True / CLEAR | V / ELIGIBLE | 42.9782 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 109 / cd527942-5c40-4a2d-9203-6edb521c8fa1 | M45 / POLITICAL_EVENT | 21:01:18.364000 / 21:01:21.492888 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.1, -0.1] | False / UNCLEAR | I / ELIGIBLE | 6.9616 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 110 / 9ac35909-d098-4691-a864-cf905c4978b7 | M48 / POLITICAL_EVENT | 21:01:18.404000 / 21:01:21.504478 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.1, -0.1] | False / UNCLEAR | I / ELIGIBLE | 102.9616 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 111 / cc1fe278-5ac0-4e22-bfbc-a497b8c18b18 | M49 / CRYPTO_PRICE_AT | 21:01:18.863000 / 21:01:21.520566 | 97.7 / 97.7 / 94.6 | NO / 3.1 / 2.63 | 25 / [2.63, 6.42] | False / CLEAR | V / ELIGIBLE | 90.9781 / PRICE_MODEL,AI_REVIEW | AVOID / MARKET_UNTRADEABLE / NULL |
| 112 / c424bdb3-4ecc-428d-ae5e-95e929eb5c54 | M41 / COUNT_BRACKET | 21:01:18.410000 / 21:01:21.535365 | 99.75 / 99.75 / 99.75 | YES / 0 / -0.06 | 0 / [-0.06, -0.06] | True / UNCLEAR | I / ELIGIBLE | 6.9616 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 113 / d9ef630f-6513-48ca-8259-af9ea70cc3d8 | M50 / CRYPTO_PRICE_TOUCH | 21:01:18.409000 / 21:01:21.548668 | 0.55 / 0.55 / 0.55 | NO / 0 / -0.18 | 0 / [-0.18, -0.18] | True / UNCLEAR | I / ELIGIBLE | 102.9782 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 114 / a856aba6-3d04-466b-a200-976d9330025a | M17 / POLITICAL_EVENT | 21:01:18.457000 / 21:01:21.567662 | 38.5 / 38.5 / 38.5 | NO / 0 / -1.44 | 0 / [-1.44, -1.44] | True / UNCLEAR | I / ELIGIBLE | 102.9615 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 115 / 6ea5fbc6-9ea0-417f-a7ae-53e162fdc30b | M27 / CRYPTO_PRICE_AT | 21:01:19.416000 / 21:01:21.586831 | 98.85 / 98.85 / 99.33 | YES / 0.48 / 0.35 | 0 / [-1.11, 0.35] | True / CLEAR | V / ELIGIBLE | 66.9779 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 116 / 64b29242-9dff-4b3f-8a30-1929d789edb7 | M55 / CRYPTO_PRICE_TOUCH | 21:01:18.456000 / 21:01:21.603889 | 1.3 / 1.3 / 1.3 | NO / 0 / -0.27 | 0 / [-0.27, -0.27] | True / UNCLEAR | I / ELIGIBLE | 102.9782 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 117 / 07e5e16a-e4a6-43d5-bd85-f0272912e61d | M56 / CRYPTO_PRICE_TOUCH | 21:01:18.455000 / 21:01:21.620810 | 0.35 / 0.35 / 0.35 | NO / 0 / -0.07 | 0 / [-0.07, -0.07] | True / UNCLEAR | I / ELIGIBLE | 102.9782 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 118 / 409ea530-0942-41d0-81c0-79f31d3b90df | M05 / CRYPTO_PRICE_AT | 21:01:19.775000 / 21:01:21.642543 | 98.2 / 98.2 / 98.02 | YES / -0.18 / -0.58 | 0 / [-2.74, -0.58] | True / CLEAR | V / ELIGIBLE | 114.9778 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 119 / d1aa05fa-a7b0-442b-90af-6cb33f208944 | M51 / CRYPTO_PRICE_TOUCH | 21:01:18.498000 / 21:01:21.658549 | 0.8 / 0.8 / 0.8 | NO / 0 / -0.33 | 0 / [-0.33, -0.33] | True / UNCLEAR | I / ELIGIBLE | 102.9782 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 120 / d1f7a72d-1008-4c5d-8929-eca307eb91a8 | M42 / CRYPTO_PRICE_AT | 21:01:18.504000 / 21:01:21.671350 | 99.1 / 99.1 / 99.08 | YES / -0.02 / -0.18 | 0 / [-1.64, -0.18] | True / CLEAR | V / ELIGIBLE | 138.9782 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 121 / 40c3ceb2-15a0-460e-90f7-9b0750d59ed0 | M02 / CRYPTO_PRICE_TOUCH | 21:01:18.499000 / 21:01:21.688306 | 1.15 / 1.15 / 1.15 | NO / 0 / -0.5 | 0 / [-0.5, -0.5] | True / UNCLEAR | I / ELIGIBLE | 102.9782 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 122 / 8af7219d-42cf-45c0-a53e-e381f229ff84 | M10 / CRYPTO_PRICE_AT | 21:01:18.542000 / 21:01:21.703678 | 99.65 / 99.65 / 99.81 | YES / 0.16 / 0 | 0 / [-0.1, 0] | True / CLEAR | V / ELIGIBLE | 42.9782 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 123 / 587a7cef-b3fd-4253-9fcb-ad5032325e88 | M11 / CRYPTO_PRICE_AT | 21:01:18.541000 / 21:01:21.721599 | 98.95 / 98.95 / 99.28 | YES / 0.33 / -0.15 | 0 / [-1.61, -0.15] | True / CLEAR | V / ELIGIBLE | 114.9782 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 124 / 19aa377d-c7d7-4c47-9f49-7c701e48b3ff | M09 / CRYPTO_PRICE_AT | 21:01:19.973000 / 21:01:21.742580 | 98.95 / 98.95 / 99.68 | YES / 0.73 / 0.61 | 0 / [-0.01, 0.61] | True / CLEAR | V / ELIGIBLE | 42.9778 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 125 / 52b0d186-7cff-4d60-bdf0-4bb9c4ddd6d6 | M06 / CRYPTO_PRICE_AT | 21:01:20.188000 / 21:01:21.761232 | 98.5 / 98.5 / 99.61 | YES / 1.11 / -0.3 | 0 / [-0.3, -0.3] | False / CLEAR | V / ELIGIBLE | 42.9777 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 126 / aec3d268-b23d-4284-a38e-738a033d3ff5 | M08 / POLITICAL_EVENT | 21:01:18.585000 / 21:01:21.777399 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.11, -0.11] | False / UNCLEAR | I / ELIGIBLE | 102.9615 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 127 / d5143040-5188-4d78-af92-0361248ba57c | M16 / CRYPTO_PRICE_AT | 21:01:20.412000 / 21:01:21.790971 | 99.2 / 99.2 / 99.62 | YES / 0.42 / -0.19 | 0 / [-1.29, -0.19] | True / CLEAR | V / ELIGIBLE | 90.9777 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 128 / e146162d-ec29-4a50-a7a2-57b69f05df38 | M14 / CRYPTO_PRICE_AT | 21:01:18.589000 / 21:01:21.811379 | 99.35 / 99.35 / 99.74 | YES / 0.39 / 0.12 | 0 / [-0.52, 0.12] | True / CLEAR | V / ELIGIBLE | 66.9782 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 129 / 18e8ca00-eecf-4fb4-b31d-2e2fc3c572c7 | M12 / SPORTS_MATCH | 21:01:18.588000 / 21:01:21.823024 | 41.5 / 41.5 / 41.5 | YES / 0 / -1.72 | 0 / [-1.72, -1.72] | False / CLEAR | I / FILTERED_OUT | 164.9782 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 130 / 4908d673-5b68-4070-a6fe-5d7ab098029a | M04 / SPORTS_MATCH | 21:01:18.625000 / 21:01:21.838848 | 63.5 / 63.5 / 63.5 | YES / 0 / -1.65 | 0 / [-1.65, -1.65] | True / CLEAR | I / ELIGIBLE | 88.4782 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 131 / 8a00e5c3-00c0-4de1-bf18-7bbb2545388e | M23 / CRYPTO_PRICE_AT | 21:01:18.630000 / 21:01:21.849617 | 99.55 / 99.55 / 99.79 | YES / 0.24 / 0.07 | 0 / [0.07, 0.07] | True / CLEAR | V / ELIGIBLE | 42.9782 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |
| 132 / 87edb54e-7647-4be9-b3a9-9aa4bdb9779f | M19 / POLITICAL_EVENT | 21:01:18.629000 / 21:01:21.860866 | 29.45 / 29.45 / 29.45 | NO / 0 / -1.18 | 0 / [-1.18, -1.18] | True / UNCLEAR | I / ELIGIBLE | 102.9615 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 133 / e35dcc79-4c1a-4fac-80cd-71141425e5f2 | M20 / POLITICAL_EVENT | 21:01:18.636000 / 21:01:21.873019 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.1, -0.1] | False / UNCLEAR | I / ELIGIBLE | 102.9615 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 134 / 59c8ecc2-bdb3-440f-956e-30aa19fd7951 | M25 / SPORTS_MATCH | 21:01:18.665000 / 21:01:21.886706 | 41.5 / 41.5 / 41.5 | YES / 0 / -1.72 | 0 / [-1.72, -1.72] | False / CLEAR | I / FILTERED_OUT | 167.9781 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 135 / b8836444-a879-472f-9f2e-d708bd376452 | M40 / SPORTS_MATCH | 21:01:18.669000 / 21:01:21.897995 | 47.5 / 47.5 / 47.5 | NO / 0 / -10.5 | 0 / [-10.5, -10.5] | False / CLEAR | I / FILTERED_OUT | 167.9781 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 136 / ce8d2929-1b53-4a9d-bf78-430c2afc2ca1 | M35 / SPORTS_MATCH | 21:01:18.683000 / 21:01:21.909021 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [0, 0] | False / CLEAR | I / FILTERED_OUT | 161.9781 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 137 / 3f0bf1df-16b4-473f-b07d-a172b4eba6b5 | M22 / SPORTS_MATCH | 21:01:18.691000 / 21:01:21.921608 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.13, -0.13] | False / CLEAR | I / ELIGIBLE | 158.4781 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 138 / 5a8829ba-21f0-4f57-af31-99d54e51f318 | M18 / CRYPTO_PRICE_AT | 21:01:20.597000 / 21:01:21.934277 | 99.15 / 99.15 / 99.02 | YES / -0.13 / -0.33 | 0 / [-1.77, -0.33] | True / CLEAR | V / ELIGIBLE | 90.9776 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 139 / 2bc7a973-65d4-4295-a00f-d38dcfb8f9a0 | M32 / CRYPTO_EVENT | 21:01:18.710000 / 21:01:21.951226 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-0.74, -0.74] | False / UNCLEAR | I / ELIGIBLE | 6.9615 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 140 / 4ece0ee8-5e0d-435e-bc90-7837aa662ba7 | M54 / SPORTS_MATCH | 21:01:18.718000 / 21:01:21.964892 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [0, 0] | False / CLEAR | I / FILTERED_OUT | 165.4781 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 141 / bd1e5328-3f3b-4867-bed0-a3a502f4b889 | M03 / OTHER | 21:01:18.737000 / 21:01:21.980336 | NULL / NULL / 50 | YES / 0 / 0 | 0 / [-2.39, -2.39] | False / UNCLEAR | I / ELIGIBLE | 6.9615 / NONE | INSUFFICIENT_DATA / INSUFFICIENT_MARKET_DATA / NULL |
| 142 / 3cac8c80-1c8d-4d02-b69f-bac9ac25cb20 | M29 / CRYPTO_PRICE_AT | 21:01:18.743000 / 21:01:22.004339 | 99.5 / 99.5 / 99.78 | YES / 0.28 / 0.15 | 0 / [0.15, 0.15] | True / CLEAR | V / ELIGIBLE | 42.9781 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,CONFIDENCE_BELOW_MIN / NULL |
| 143 / a98f0b81-9e94-4cd0-b407-badac6c7d89f | M30 / CRYPTO_PRICE_TOUCH | 21:01:18.752000 / 21:01:22.031786 | 0.2 / 0.2 / 0.2 | NO / 0 / -0.11 | 0 / [-0.11, -0.11] | True / UNCLEAR | I / ELIGIBLE | 6.9781 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 144 / 59395b59-02f7-41b2-9651-fb84dd480f27 | M15 / CRYPTO_EVENT | 21:01:18.749000 / 21:01:22.047606 | 0.15 / 0.15 / 0.15 | NO / 0 / -0.06 | 0 / [-0.06, -0.06] | True / UNCLEAR | I / ELIGIBLE | 6.9615 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 145 / f3bc4254-5f7f-471b-92f5-72da85daedb1 | M26 / CRYPTO_PRICE_RANGE | 21:01:20.778000 / 21:01:22.061737 | 0.6 / 0.6 / 0.65 | NO / -0.05 / -0.37 | 0 / [-1.29, -0.37] | True / CLEAR | V / ELIGIBLE | 42.9776 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 146 / 0c426ced-c0a5-48b4-8d6f-3681893673e2 | M52 / CRYPTO_PRICE_AT | 21:01:20.968000 / 21:01:22.079707 | 95.25 / 95.25 / 93.4 | YES / -1.85 / -2.59 | 0 / [-5.83, -2.59] | True / CLEAR | V / ELIGIBLE | 138.9775 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 147 / 131387dc-889a-475c-956e-f0a76fac9790 | M01 / SPORTS_LINE | 21:01:18.788000 / 21:01:22.114576 | 64 / 64 / 64 | YES / 0 / -2.14 | 0 / [-2.14, -2.14] | False / CLEAR | I / ELIGIBLE | 88.4781 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 148 / 8ffdc240-6bee-415e-8c1e-15cbdd267209 | M34 / CRYPTO_PRICE_AT | 21:01:21.163000 / 21:01:22.137757 | 98.45 / 98.45 / 99.24 | YES / 0.79 / -0.67 | 0 / [-2.38, -0.67] | False / CLEAR | V / ELIGIBLE | 42.9775 / PRICE_MODEL | NEUTRAL / NO_POSITIVE_EDGE / NULL |
| 149 / c68a2354-f615-4092-81a3-f6a54db2adbb | M24 / SPORTS_MATCH | 21:01:18.821000 / 21:01:22.163668 | 1.15 / 1.15 / 1.15 | NO / 0 / -0.39 | 0 / [-0.39, -0.39] | True / CLEAR | I / ELIGIBLE | 38.5614 / NONE | INSUFFICIENT_DATA / NO_ADMISSIBLE_EVIDENCE / NULL |
| 150 / 7b47e822-9fb1-49df-9a21-3e433232f0e0 | M33 / CRYPTO_PRICE_AT | 21:01:18.825000 / 21:01:22.190462 | 98.75 / 98.75 / 99.03 | YES / 0.28 / 0.15 | 0 / [-1.5, 0.15] | True / CLEAR | V / ELIGIBLE | 42.9781 / PRICE_MODEL | WATCH / EDGE_BELOW_MIN,H6_TAIL_UNSAFE,CONFIDENCE_BELOW_MIN / NULL |


</details>


## Appendix B — H1-H8 and evidence coverage for every evaluation

DP/DF=derived pass/fail from saved inputs (H2 uses the stored rounded edge-band,
far enough below threshold that rounding cannot flip the result). NA=no posterior
or no AI group; RF=recorded final failure; RP=Watch branch computed H6 with no
failure; NR=not retained after an earlier decision; NE=entry gate not reached.
H5 numeric ladder consistency was reconstructed separately, not a live actionable
filter acceptance. H7 C=CLEAR / U=UNCLEAR doubled edge rule. Each row references
its full identity in Appendix A and market in Appendix D.


| # | H1 | H2 | H3 | H4 | H5 | H6 | H7 | H8 | Template | Admissibility / tradeability reasons |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 2 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 3 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 4 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 5 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 6 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 7 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_BRACKETS |  / none |
| 8 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 9 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 10 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_OTHER / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 11 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 12 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 13 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 14 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 15 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_COUNT_BRACKET / none |
| 16 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 17 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 18 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 19 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / none |
| 20 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 21 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_LINE / none |
| 22 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 23 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 24 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 25 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 26 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 27 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 28 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 29 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 30 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 31 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / INSUFFICIENT_DEPTH |
| 32 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 33 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / INSUFFICIENT_DEPTH |
| 34 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 35 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 36 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / INSUFFICIENT_DEPTH |
| 37 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 38 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 39 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 40 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 41 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_OTHER / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 42 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 43 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 44 | DP | DF | DP | NA(no AI) | NE | RP | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 45 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_OTHER / none |
| 46 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 47 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_BRACKETS |  / none |
| 48 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 49 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_LINE / INSUFFICIENT_DEPTH |
| 50 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_BRACKETS |  / none |
| 51 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 52 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 53 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 54 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 55 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 56 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 57 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 58 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 59 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_OTHER / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 60 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 61 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_COUNT_BRACKET / none |
| 62 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 63 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 64 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 65 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / none |
| 66 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_LINE / none |
| 67 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_BRACKETS |  / none |
| 68 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 69 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 70 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 71 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 72 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 73 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 74 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 75 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 76 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 77 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 78 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 79 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 80 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 81 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 82 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / none |
| 83 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 84 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 85 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 86 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 87 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 88 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 89 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 90 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_OTHER / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 91 | DP | DF | DP | NA(no AI) | NE | RP | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 92 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 93 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 94 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_OTHER / none |
| 95 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / none |
| 96 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_LINE / INSUFFICIENT_DEPTH |
| 97 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 98 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 99 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_BRACKETS |  / none |
| 100 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / INSUFFICIENT_DEPTH |
| 101 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 102 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 103 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 104 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 105 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 106 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_OTHER / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 107 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 108 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_BRACKETS |  / none |
| 109 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 110 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 111 | DP | DF | DP | DP | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 112 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_COUNT_BRACKET / none |
| 113 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 114 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / none |
| 115 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 116 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 117 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 118 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 119 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 120 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 121 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 122 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 123 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 124 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 125 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / INSUFFICIENT_DEPTH |
| 126 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 127 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 128 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 129 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / INSUFFICIENT_DEPTH |
| 130 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 131 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 132 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / none |
| 133 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_POLITICAL_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 134 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / INSUFFICIENT_DEPTH |
| 135 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 136 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 137 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 138 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 139 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 140 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 141 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_OTHER / NO_ORDER_BOOK, INSUFFICIENT_DEPTH |
| 142 | DP | DF | DP | NA(no AI) | NE | RP | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 143 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | PRICE_TEMPLATE_NOT_VERIFIED / none |
| 144 | NA | NA | NA | NA(no AI) | NE | NR | U | NE | NONE | NO_VALIDATED_SOURCE_FOR_CRYPTO_EVENT / none |
| 145 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_BRACKETS |  / none |
| 146 | DP | DF | DF | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |
| 147 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_LINE / INSUFFICIENT_DEPTH |
| 148 | DP | DF | DP | NA(no AI) | NE | NR | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / INSUFFICIENT_DEPTH |
| 149 | NA | NA | NA | NA(no AI) | NE | NR | C | NE | NONE | NO_VALIDATED_SOURCE_FOR_SPORTS_MATCH / none |
| 150 | DP | DF | DP | NA(no AI) | NE | RF | C | NE | BINANCE_CLOSE_NOON_ET_ABOVE |  / none |


## Appendix C — all 52 supported crypto price evaluations

All have verified resolution templates, finite priors and sufficient model data.
Source q/band is the PRICE_MODEL before bounded anchoring; posterior band is YES;
chosen executable edge band is already in Appendix A. Market YES bid/ask/mid are
saved display inputs, not the walked-book execution price. Entry expiry comes
from the registry; tauDays and spot/sigma come from the frozen model metadata.


| # / market | Symbol / direction / strike | Spot / daily sigma | Expiry UTC / tauDays | YES bid / ask / mid % | Source q / qBand % | Posterior YES / band % | Prior-to-posterior pp | Chosen side / net edge / conf | Temporal input age ms |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 7 / M57 | BTC / range / 74000-76000 | 83666 / 2.1613% | 2026-10-02T16:00:00+00:00 / 1.7977 | 0.2 / 0.5 / 0.35 | 0.0468 / 0.0468-1.176 | 0.1872 / 0.1872-0.6423 | -0.1628 | NO / 0 / 0 | 17629 |
| 12 / M49 | BTC / above / 78000 | 83666 / 2.1613% | 2026-10-04T16:00:00+00:00 / 3.7977 | 97.3 / 98 / 97.65 | 94.9898 / 85.9564-94.9898 | 96.5598 / 94.0995-96.5598 | -1.0902 | YES / -1.58 / 0 | 18619 |
| 13 / M37 | BTC / above / 78000 | 83666 / 2.1613% | 2026-10-03T16:00:00+00:00 / 2.7977 | 97.5 / 98.1 / 97.8 | 97.2679 / 89.7258-97.2679 | 97.548 / 95.1699-97.548 | -0.252 | YES / -0.68 / 0 | 19107 |
| 16 / M52 | BTC / above / 78000 | 83666 / 2.1613% | 2026-10-06T16:00:00+00:00 / 5.7977 | 94.8 / 95.7 / 95.25 | 90.6828 / 80.4913-90.6828 | 93.3201 / 90.095-93.3201 | -1.9299 | YES / -2.67 / 0 | 19331 |
| 22 / M27 | BTC / above / 76000 | 83666 / 2.1613% | 2026-10-03T16:00:00+00:00 / 2.7977 | 98.8 / 98.9 / 98.85 | 99.5858 / 95.9517-99.5858 | 99.3092 / 97.8325-99.3092 | 0.4592 | YES / 0.33 / 0 | 19684 |
| 25 / M05 | BTC / above / 76000 | 83666 / 2.1613% | 2026-10-05T16:00:00+00:00 / 4.7977 | 97.9 / 98.5 / 98.2 | 97.7589 / 90.6218-97.7589 | 97.9913 / 95.8264-97.9913 | -0.2087 | YES / -0.61 / 0 | 19907 |
| 26 / M09 | ETH / above / 2400 | 2681.14 / 2.3034% | 2026-10-02T16:00:00+00:00 / 1.7977 | 98.9 / 99 / 98.95 | 99.9822 / 99.106-99.9822 | 99.6751 / 99.0311-99.6751 | 0.7251 | YES / 0.61 / 0 | 20186 |
| 27 / M42 | BTC / above / 74000 | 83666 / 2.1613% | 2026-10-06T16:00:00+00:00 / 5.7977 | 99 / 99.2 / 99.1 | 99.0178 / 93.7448-99.0178 | 99.0598 / 97.5975-99.0598 | -0.0402 | YES / -0.2 / 0 | 20439 |
| 28 / M10 | BTC / above / 74000 | 83666 / 2.1613% | 2026-10-02T16:00:00+00:00 / 1.7977 | 99.7 / 99.8 / 99.75 | 99.9988 / 99.7466-99.9988 | 99.8419 / 99.7483-99.8419 | 0.0919 | YES / 0.03 / 0 | 18265 |
| 29 / M11 | BTC / above / 74000 | 83666 / 2.1613% | 2026-10-05T16:00:00+00:00 / 4.7977 | 98.4 / 99.3 / 98.85 | 99.491 / 95.4808-99.491 | 99.2344 / 97.7072-99.2344 | 0.3844 | YES / -0.2 / 0 | 20665 |
| 31 / M06 | XRP / above / 1.1 | 1.4909 / 3.823% | 2026-10-02T16:00:00+00:00 / 1.7977 | 97.1 / 99.9 / 98.5 | 100 / 99.9955-100 | 99.6111 / 99.6111-99.6111 | 1.1111 | YES / -0.3 / 0 | 21021 |
| 32 / M16 | BTC / above / 74000 | 83666 / 2.1613% | 2026-10-04T16:00:00+00:00 / 3.7977 | 98.7 / 99.7 / 99.2 | 99.8097 / 97.2038-99.8097 | 99.6094 / 98.4997-99.6094 | 0.4094 | YES / -0.2 / 0 | 18314 |
| 34 / M14 | BTC / above / 74000 | 83666 / 2.1613% | 2026-10-03T16:00:00+00:00 / 2.7977 | 99.1 / 99.6 / 99.35 | 99.9635 / 98.7354-99.9635 | 99.7447 / 99.0929-99.7447 | 0.3947 | YES / 0.12 / 0 | 18346 |
| 37 / M23 | ETH / above / 2200 | 2681.14 / 2.3034% | 2026-10-02T16:00:00+00:00 / 1.7977 | 99.5 / 99.6 / 99.55 | 100 / 99.9989-100 | 99.7877 / 99.7877-99.7877 | 0.2377 | YES / 0.07 / 0 | 18372 |
| 42 / M18 | BTC / above / 76000 | 83666 / 2.1613% | 2026-10-04T16:00:00+00:00 / 3.7977 | 99 / 99.3 / 99.15 | 98.8108 / 93.1824-98.8108 | 98.9945 / 97.5568-98.9945 | -0.1555 | YES / -0.35 / 0 | 21289 |
| 44 / M29 | ETH / above / 2300 | 2681.14 / 2.3034% | 2026-10-02T16:00:00+00:00 / 1.7977 | 99.3 / 99.6 / 99.45 | 100 / 99.9493-100 | 99.7653 / 99.7653-99.7653 | 0.3153 | YES / 0.14 / 0 | 18449 |
| 47 / M26 | BTC / range / 76000-78000 | 83666 / 2.1613% | 2026-10-02T16:00:00+00:00 / 1.7977 | 0.8 / 0.9 / 0.85 | 0.7597 / 0.7597-4.1451 | 0.8036 / 0.8036-1.889 | -0.0464 | NO / -0.06 / 0 | 18552 |
| 50 / M07 | BTC / below / 74000 | 83666 / 2.1613% | 2026-10-02T16:00:00+00:00 / 1.7977 | 0.4 / 0.5 / 0.45 | 0.0012 / 0.0012-0.2534 | 0.2123 / 0.2123-0.3378 | -0.2377 | NO / 0.16 / 0 | 18554 |
| 67 / M57 | BTC / range / 74000-76000 | 83672 / 2.1613% | 2026-10-02T16:00:00+00:00 / 1.7944 | 0.2 / 0.9 / 0.55 | 0.0459 / 0.0459-1.1659 | 0.2347 / 0.2347-0.8012 | -0.3153 | NO / -0.05 / 0 | 2943 |
| 68 / M49 | BTC / above / 78000 | 83672 / 2.1613% | 2026-10-04T16:00:00+00:00 / 3.7944 | 97.4 / 98 / 97.7 | 95.015 / 85.9928-95.015 | 96.6049 / 94.1687-96.6049 | -1.0951 | YES / -1.53 / 0 | 6072 |
| 69 / M52 | BTC / above / 78000 | 83672 / 2.1613% | 2026-10-06T16:00:00+00:00 / 5.7944 | 94.8 / 95.7 / 95.25 | 90.7123 / 80.524-90.7123 | 93.331 / 90.1043-93.331 | -1.919 | YES / -2.66 / 0 | 6478 |
| 70 / M27 | BTC / above / 76000 | 83672 / 2.1613% | 2026-10-03T16:00:00+00:00 / 2.7944 | 98.8 / 98.9 / 98.85 | 99.5901 / 95.9725-99.5901 | 99.3128 / 97.8382-99.3128 | 0.4628 | YES / 0.34 / 0 | 6774 |
| 72 / M42 | BTC / above / 74000 | 83672 / 2.1613% | 2026-10-06T16:00:00+00:00 / 5.7944 | 99 / 99.2 / 99.1 | 99.0232 / 93.7618-99.0232 | 99.0624 / 97.6009-99.0624 | -0.0376 | YES / -0.19 / 0 | 7507 |
| 74 / M05 | BTC / above / 76000 | 83672 / 2.1613% | 2026-10-05T16:00:00+00:00 / 4.7944 | 97.9 / 98.5 / 98.2 | 97.7708 / 90.6468-97.7708 | 97.9966 / 95.8323-97.9966 | -0.2034 | YES / -0.61 / 0 | 7758 |
| 75 / M10 | BTC / above / 74000 | 83672 / 2.1613% | 2026-10-02T16:00:00+00:00 / 1.7944 | 99.7 / 99.8 / 99.75 | 99.9988 / 99.7499-99.9988 | 99.8419 / 99.75-99.8419 | 0.0919 | YES / 0.03 / 0 | 4853 |
| 76 / M11 | BTC / above / 74000 | 83672 / 2.1613% | 2026-10-05T16:00:00+00:00 / 4.7944 | 98.6 / 99.3 / 98.95 | 99.4945 / 95.4962-99.4945 | 99.2711 / 97.8119-99.2711 | 0.3211 | YES / -0.17 / 0 | 4852 |
| 78 / M16 | BTC / above / 74000 | 83672 / 2.1613% | 2026-10-04T16:00:00+00:00 / 3.7944 | 98.7 / 99.7 / 99.2 | 99.8115 / 97.2167-99.8115 | 99.6112 / 98.5032-99.6112 | 0.4112 | YES / -0.2 / 0 | 7974 |
| 79 / M14 | BTC / above / 74000 | 83672 / 2.1613% | 2026-10-03T16:00:00+00:00 / 2.7944 | 99.1 / 99.6 / 99.35 | 99.964 / 98.7441-99.964 | 99.7447 / 99.096-99.7447 | 0.3947 | YES / 0.12 / 0 | 4989 |
| 85 / M09 | ETH / above / 2400 | 2680.9 / 2.3034% | 2026-10-02T16:00:00+00:00 / 1.7943 | 98.9 / 99 / 98.95 | 99.9823 / 99.1068-99.9823 | 99.6751 / 99.0315-99.6751 | 0.7251 | YES / 0.61 / 0 | 8273 |
| 86 / M23 | ETH / above / 2200 | 2680.9 / 2.3034% | 2026-10-02T16:00:00+00:00 / 1.7944 | 99.5 / 99.6 / 99.55 | 100 / 99.9989-100 | 99.7877 / 99.7877-99.7877 | 0.2377 | YES / 0.07 / 0 | 5095 |
| 87 / M18 | BTC / above / 76000 | 83672 / 2.1613% | 2026-10-04T16:00:00+00:00 / 3.7943 | 99 / 99.3 / 99.15 | 98.8192 / 93.2063-98.8192 | 98.998 / 97.5612-98.998 | -0.152 | YES / -0.35 / 0 | 8545 |
| 91 / M29 | ETH / above / 2300 | 2680.9 / 2.3034% | 2026-10-02T16:00:00+00:00 / 1.7944 | 99.3 / 99.6 / 99.45 | 100 / 99.9495-100 | 99.7653 / 99.7653-99.7653 | 0.3153 | YES / 0.14 / 0 | 5233 |
| 99 / M26 | BTC / range / 76000-78000 | 83672 / 2.1613% | 2026-10-02T16:00:00+00:00 / 1.7943 | 0.8 / 1.2 / 1 | 0.7502 / 0.7502-4.123 | 0.8662 / 0.8662-2.0416 | -0.1338 | NO / -0.12 / 0 | 8843 |
| 100 / M06 | XRP / above / 1.1 | 1.49 / 3.823% | 2026-10-02T16:00:00+00:00 / 1.7943 | 97.1 / 99.9 / 98.5 | 100 / 99.9954-100 | 99.6111 / 99.6111-99.6111 | 1.1111 | YES / -0.3 / 0 | 9209 |
| 108 / M57 | BTC / range / 74000-76000 | 83715.63 / 2.1613% | 2026-10-02T16:00:00+00:00 / 1.7908 | 0.2 / 0.4 / 0.3 | 0.0426 / 0.0426-1.1266 | 0.1733 / 0.1733-0.5821 | -0.1267 | NO / 0.01 / 0 | 18362 |
| 111 / M49 | BTC / above / 78000 | 83715.63 / 2.1613% | 2026-10-04T16:00:00+00:00 / 3.7908 | 97.4 / 98 / 97.7 | 95.1493 / 86.1879-95.1493 | 94.5969 / 90.8045-94.5969 | -3.1031 | NO / 2.63 / 25 | 18864 |
| 115 / M27 | BTC / above / 76000 | 83715.63 / 2.1613% | 2026-10-03T16:00:00+00:00 / 2.7907 | 98.8 / 98.9 / 98.85 | 99.6093 / 96.0652-99.6093 | 99.329 / 97.8637-99.329 | 0.479 | YES / 0.35 / 0 | 19417 |
| 118 / M05 | BTC / above / 76000 | 83715.63 / 2.1613% | 2026-10-05T16:00:00+00:00 / 4.7907 | 97.9 / 98.5 / 98.2 | 97.8326 / 90.7776-97.8326 | 98.0247 / 95.8632-98.0247 | -0.1753 | YES / -0.58 / 0 | 19776 |
| 120 / M42 | BTC / above / 74000 | 83715.63 / 2.1613% | 2026-10-06T16:00:00+00:00 / 5.7908 | 99 / 99.2 / 99.1 | 99.051 / 93.8495-99.051 | 99.0758 / 97.6185-99.0758 | -0.0242 | YES / -0.18 / 0 | 18505 |
| 122 / M10 | BTC / above / 74000 | 83715.63 / 2.1613% | 2026-10-02T16:00:00+00:00 / 1.7908 | 99.6 / 99.7 / 99.65 | 99.9989 / 99.7612-99.9989 | 99.8128 / 99.7109-99.8128 | 0.1628 | YES / 0 / 0 | 18543 |
| 123 / M11 | BTC / above / 74000 | 83715.63 / 2.1613% | 2026-10-05T16:00:00+00:00 / 4.7908 | 98.6 / 99.3 / 98.95 | 99.5118 / 95.5717-99.5118 | 99.2837 / 97.8307-99.2837 | 0.3337 | YES / -0.15 / 0 | 18542 |
| 124 / M09 | ETH / above / 2400 | 2683.22 / 2.3034% | 2026-10-02T16:00:00+00:00 / 1.7907 | 98.9 / 99 / 98.95 | 99.9843 / 99.1565-99.9843 | 99.6751 / 99.0589-99.6751 | 0.7251 | YES / 0.61 / 0 | 19974 |
| 125 / M06 | XRP / above / 1.1 | 1.4925 / 3.823% | 2026-10-02T16:00:00+00:00 / 1.7907 | 97.1 / 99.9 / 98.5 | 100 / 99.9959-100 | 99.6111 / 99.6111-99.6111 | 1.1111 | YES / -0.3 / 0 | 20189 |
| 127 / M16 | BTC / above / 74000 | 83715.63 / 2.1613% | 2026-10-04T16:00:00+00:00 / 3.7907 | 98.7 / 99.7 / 99.2 | 99.8196 / 97.275-99.8196 | 99.6197 / 98.5192-99.6197 | 0.4197 | YES / -0.19 / 0 | 20413 |
| 128 / M14 | BTC / above / 74000 | 83715.63 / 2.1613% | 2026-10-03T16:00:00+00:00 / 2.7908 | 99.1 / 99.6 / 99.35 | 99.9661 / 98.7798-99.9661 | 99.7447 / 99.109-99.7447 | 0.3947 | YES / 0.12 / 0 | 18590 |
| 131 / M23 | ETH / above / 2200 | 2683.22 / 2.3034% | 2026-10-02T16:00:00+00:00 / 1.7908 | 99.5 / 99.6 / 99.55 | 100 / 99.999-100 | 99.7877 / 99.7877-99.7877 | 0.2377 | YES / 0.07 / 0 | 18631 |
| 138 / M18 | BTC / above / 76000 | 83715.63 / 2.1613% | 2026-10-04T16:00:00+00:00 / 3.7907 | 99 / 99.3 / 99.15 | 98.8601 / 93.3236-98.8601 | 99.0156 / 97.5833-99.0156 | -0.1344 | YES / -0.33 / 0 | 20598 |
| 142 / M29 | ETH / above / 2300 | 2683.22 / 2.3034% | 2026-10-02T16:00:00+00:00 / 1.7908 | 99.4 / 99.6 / 99.5 | 100 / 99.9534-100 | 99.7762 / 99.7762-99.7762 | 0.2762 | YES / 0.15 / 0 | 18744 |
| 145 / M26 | BTC / range / 76000-78000 | 83715.63 / 2.1613% | 2026-10-02T16:00:00+00:00 / 1.7907 | 0.3 / 0.9 / 0.6 | 0.71 / 0.71-4.0224 | 0.6527 / 0.6527-1.5656 | 0.0527 | NO / -0.37 / 0 | 20779 |
| 146 / M52 | BTC / above / 78000 | 83715.63 / 2.1613% | 2026-10-06T16:00:00+00:00 / 5.7907 | 94.8 / 95.7 / 95.25 | 90.8849 / 80.7156-90.8849 | 93.395 / 90.1588-93.395 | -1.855 | YES / -2.59 / 0 | 20969 |
| 148 / M34 | XRP / above / 1.3 | 1.4925 / 3.823% | 2026-10-02T16:00:00+00:00 / 1.7907 | 97 / 99.9 / 98.45 | 99.6248 / 96.0888-99.6248 | 99.2359 / 97.531-99.2359 | 0.7859 | YES / -0.67 / 0 | 21164 |
| 150 / M33 | BTC / above / 78000 | 83715.63 / 2.1613% | 2026-10-02T16:00:00+00:00 / 1.7908 | 98.7 / 98.8 / 98.75 | 99.2464 / 94.6122-99.2464 | 99.0291 / 97.3854-99.0291 | 0.2791 | YES / 0.15 / 0 | 18826 |


## Appendix D — public-market identity dictionary (58 markets)

These condition IDs identify public Prediction markets, not wallet addresses.
No private account identifiers or balances are included.


| Key | Market ID | Condition ID | Question | Category | Event slug | Start UTC | End UTC |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M01 | 0064e406-6c21-4e70-b4af-d96fd9c35760 | 0xb3bd48fe0740321fbaafa55f2a8b3e1159dbc564fc82112e646e85b3a5d6f4e2 | Spread: Colts (-0.5) | sports | nfl-ind-was-2026-10-04 | 2026-08-25T16:01:11+00:00 | 2026-10-04T13:30:00+00:00 |
| M02 | 0977fbe2-41fc-4836-9374-7b245878811c | 0x60b7e0bd165ec6fa666c50553da09e93f916f8569de1aa625de8bc3e2847c350 | Will Ethereum reach $3,200 September 28-October 4? | crypto | what-price-will-ethereum-hit-september-28-october-4-2026 | 2026-09-28T04:00:18+00:00 | 2026-10-05T04:00:00+00:00 |
| M03 | 0e375682-05c9-4a30-ae44-5a979c1b4a73 | 0xc7f1b29c4cc30d3adb2742302d8f7ca1d9ea3709ba42fbc94dfcc8691ececc8e | Will SpaceX have exactly 12 launches in September 2026? | science | how-many-spacex-launches-in-september-2026 | 2026-08-26T21:57:24+00:00 | 2026-10-01T03:59:00+00:00 |
| M04 | 103a7c47-359b-40d6-8fe8-f44be795f04e | 0x0dc7d4a71a89164e7b02e2cb34911d5365895444c9da507436993ea47a6b06d3 | Colts vs. Commanders | sports | nfl-ind-was-2026-10-04 | 2026-08-25T12:00:47+00:00 | 2026-10-04T13:30:00+00:00 |
| M05 | 104f96df-a6fe-47cd-8f75-ee1200d23782 | 0x0ef21b3071aefa5d820ddc9b3e042620b00a50566b1452ab5994d5b17d3ca607 | Will the price of Bitcoin be above $76,000 on October 5? | crypto | bitcoin-above-on-october-5-2026 | 2026-09-28T16:00:14+00:00 | 2026-10-05T16:00:00+00:00 |
| M06 | 1264a1e9-a5d8-454c-b2ce-7456aaede243 | 0xdf7a60577270d2021a62825150a4215dd0b9288f2fd0438790fa4f5decbe6958 | Will the price of XRP be above $1.10 on October 2? | crypto | xrp-above-on-october-2-2026 | 2026-09-25T16:00:22+00:00 | 2026-10-02T16:00:00+00:00 |
| M07 | 142d0957-fc39-405c-b13b-feb32efa2d81 | 0x2aaf5a27f5d9edc44da1ba7e6c2af20cd345a7f77a87e89db0472f348cc2c992 | Will the price of Bitcoin be less than $74,000 on October 2? | crypto | bitcoin-price-on-october-2-2026 | 2026-09-25T16:00:19+00:00 | 2026-10-02T16:00:00+00:00 |
| M08 | 16d324d9-5762-4f71-ac2a-5aadabbe70e4 | 0x63d8f3a34c90bd5342dda8acf62b6a898dfa52f86475efaf180b66493ef6af80 | Will Jair Bolsonaro win the 2026 Brazilian presidential election? | politics | brazil-presidential-election | 2025-09-18T20:07:59.985103+00:00 | 2026-10-05T03:59:00+00:00 |
| M09 | 1dd28000-feac-434f-a9bb-ca6423b61f33 | 0xb28a581e6e08096a83ece0f0de3646f5ab408965d91008a6f02da1b3c5872def | Will the price of Ethereum be above $2,400 on October 2? | crypto | ethereum-above-on-october-2-2026 | 2026-09-25T16:00:10+00:00 | 2026-10-02T16:00:00+00:00 |
| M10 | 1f13b2ad-7652-40bd-a2f3-5a3b95063053 | 0x7503b4d712b45394adaa56eb244113742daddf5fcb7ca32aaee606648032910e | Will the price of Bitcoin be above $74,000 on October 2? | crypto | bitcoin-above-on-october-2-2026 | 2026-09-25T16:00:17+00:00 | 2026-10-02T16:00:00+00:00 |
| M11 | 20e36cec-5e93-4783-9aa8-7f8c1d525f64 | 0x2ebd864919bd149475d00db8aa75a70768a6ad3f33a0ab56a2ee0d54cbad9e3e | Will the price of Bitcoin be above $74,000 on October 5? | crypto | bitcoin-above-on-october-5-2026 | 2026-09-28T16:00:14+00:00 | 2026-10-05T16:00:00+00:00 |
| M12 | 31ffdf33-7f70-4918-a929-f915f6010d72 | 0x3c80445e6248383d45606d5c8cde91ffc86f8312fa366b68e62d18d8b5019322 | Philadelphia Phillies vs. Atlanta Braves | sports | mlb-phi-atl-2026-09-30 | 2026-09-28T13:00:16+00:00 | 2026-10-07T18:00:00+00:00 |
| M13 | 335dc1f6-c3c6-429d-b899-2ced2de7a6de | 0x82de02eaf046cd3f44b8e52eab5e9934af75c442225f5c88b24d122dee1a4230 | Will September 2026 be the 1st hottest on record? | science | september-2026-1st-2nd-or-3rd-hottest-on-record | 2026-08-28T15:14:21+00:00 | 2026-10-01T03:59:00+00:00 |
| M14 | 3ef27fc4-09c2-4126-9017-540ebe504bb5 | 0xc7a476fe989c0de7082251c6374e64c2f91eace74f7c1bf022b64a2d3030a40b | Will the price of Bitcoin be above $74,000 on October 3? | crypto | bitcoin-above-on-october-3-2026 | 2026-09-26T16:00:15+00:00 | 2026-10-03T16:00:00+00:00 |
| M15 | 446f5c99-8e6e-4bcc-aa50-88fa34939743 | 0xa0e62cbab46117319c51b5f1f42f1475b502c47e0676b0e4b49b95970d52b8c4 | Will Predict.fun launch a token by September 30, 2026? | crypto | will-predictfun-launch-a-token-by | 2026-03-12T22:17:38.428281+00:00 | 2026-10-01T03:59:00+00:00 |
| M16 | 45634348-c407-4dc1-b12c-c7c3ceda9667 | 0x8764f7431ad942e3b2e25441bbe6fd2cce61935895fb5710719665c0b18d1894 | Will the price of Bitcoin be above $74,000 on October 4? | crypto | bitcoin-above-on-october-4-2026 | 2026-09-27T16:00:15+00:00 | 2026-10-04T16:00:00+00:00 |
| M17 | 48dd6dc1-f3c4-4064-a669-553dd3934803 | 0xdf8e2dc5860027decbe6164555c3c1c9645c3bd33e16b9dc57ca87125047d4a8 | Will Luiz Inácio Lula da Silva win the 2026 Brazilian presidential election? | politics | brazil-presidential-election | 2025-09-18T20:07:59.727557+00:00 | 2026-10-05T03:59:00+00:00 |
| M18 | 4d030ef3-ad4c-44c8-852c-3161d71581f5 | 0xa00acdb68f51b405d6243570dc05b0375a5f664e402266571b182ec129a4ad82 | Will the price of Bitcoin be above $76,000 on October 4? | crypto | bitcoin-above-on-october-4-2026 | 2026-09-27T16:00:15+00:00 | 2026-10-04T16:00:00+00:00 |
| M19 | 4f245d6f-ca63-4955-8a9e-4a9069955574 | 0x8ee27c276a1bee094293751285d8a6697674b023196cb21fdd14bf3ca12f6ec0 | Will Luiz Inácio Lula da Silva finish in second place in the first round of the 2026 Brazilian presidential election? | politics | brazil-presidential-election-first-round-2nd-place | 2026-02-11T22:50:26.863498+00:00 | 2026-10-05T03:59:00+00:00 |
| M20 | 5480fc25-53f2-4842-a2a5-3fd1b094f788 | 0x61fc517c2b0d6f945868070a3ac722bfa35f07154d34bec2f9bfe41436098bce | Will Jair Bolsonaro finish in second place in the first round of the 2026 Brazilian presidential election? | politics | brazil-presidential-election-first-round-2nd-place | 2026-02-11T22:50:35.462746+00:00 | 2026-10-05T03:59:00+00:00 |
| M21 | 5615f8fe-9538-4db6-b262-90eed570d695 | 0xc92d378903796b5837cc4b82e35a12d3d4f86be6eeb27166d1cda12d4699d1c8 | Adana: Cagla Buyukakcay vs Lucrezia Stefanini | sports | wta-buyukak-stefani-2026-09-30 | 2026-09-29T22:14:10+00:00 | 2026-10-07T15:00:00+00:00 |
| M22 | 59a38285-a155-45be-be93-299a15edbb14 | 0xc28fbee0c6f5a24ec7b9badf29e704a49aa063e1494206e9a78f7a001078910d | Australia Tour of South Africa ODIs: South Africa vs Australia | sports | crint-zaf-aus-2026-09-30 | 2026-09-23T14:03:48+00:00 | 2026-10-07T11:30:00+00:00 |
| M23 | 5abb9ee4-58f0-4dba-8d57-2377a834e323 | 0x87e21f18ac3b07cd4a33cc3905059ef0221bc1166fae86b9ded1e857824a338e | Will the price of Ethereum be above $2,200 on October 2? | crypto | ethereum-above-on-october-2-2026 | 2026-09-25T16:00:10+00:00 | 2026-10-02T16:00:00+00:00 |
| M24 | 61a24be4-fac0-4bdb-af33-2c48f40b9584 | 0xe0aae564ef9769452b31a9c85a092e5bb04f791cd50da37c93179669a15ebca0 | Will Turkmenistan win on 2026-10-02? | sports | fif-chn-tkm-2026-10-02 | 2026-09-18T13:00:17+00:00 | 2026-10-02T11:35:00+00:00 |
| M25 | 679cc3c2-e1c2-44bc-97a5-7e1b9cf6d7d0 | 0x26f0870ce04043d458ea2f8b185d5b83ee8a95b9001d7cd45d2fe5834d2588c1 | Chicago White Sox vs. Houston Astros | sports | mlb-cws-hou-2026-09-30 | 2026-09-28T13:00:18+00:00 | 2026-10-07T21:00:00+00:00 |
| M26 | 69063063-f717-43ce-8843-bcb28d4fdae1 | 0xc843789de0ca433d725266457461090d29e5dfdfe86831f050888bd5b7ba9631 | Will the price of Bitcoin be between $76,000 and $78,000 on October 2? | crypto | bitcoin-price-on-october-2-2026 | 2026-09-25T16:00:19+00:00 | 2026-10-02T16:00:00+00:00 |
| M27 | 6b394fd6-c5b9-42ed-9891-19f05e583989 | 0x27be67654f627fe41b8c1f0a85b7ce81cf57c4cb196331b2d8a6758d189a8d6a | Will the price of Bitcoin be above $76,000 on October 3? | crypto | bitcoin-above-on-october-3-2026 | 2026-09-26T16:00:15+00:00 | 2026-10-03T16:00:00+00:00 |
| M28 | 6c65f301-797a-40fc-8c59-e0e7505b5cac | 0x76322f091999b26f468b93b158f1b1dd259e2127ac9e39b6afa6b5e99bc453af | Will China PR vs. Turkmenistan end in a draw? | sports | fif-chn-tkm-2026-10-02 | 2026-09-18T13:00:17+00:00 | 2026-10-02T11:35:00+00:00 |
| M29 | 74c9becf-d39a-4047-aaf7-50b8b0c959b8 | 0x156aa9bd40ad2edb02dce50f0beeb4fa45ac47df2fa70ef61531f0c199b86012 | Will the price of Ethereum be above $2,300 on October 2? | crypto | ethereum-above-on-october-2-2026 | 2026-09-25T16:00:10+00:00 | 2026-10-02T16:00:00+00:00 |
| M30 | 7d39229c-c2b4-4b8d-ade3-ae6baa2e3339 | 0x3c16fd3f5a3e73deb74dd910e4d1240b2022c6a88a29358ea2f656b4e986ab2d | Will Ethereum hit $3k by September 30, 2026? | crypto | when-will-ethereum-hit-3k | 2026-08-20T18:23:07+00:00 | 2026-10-01T04:00:00+00:00 |
| M31 | 7fb1a881-ea0a-484d-94ab-ed5b9c625000 | 0xc420e07846559743bdaf8c75b2fb576d08ed22b31e22fe0f5866deb6fb0a9e6e | Mouilleron-Le-Captif: Completed Match: Lucas Poullain vs Remy Bertola | sports | atp-poullai-bertola-2026-09-30 | 2026-09-29T23:05:28+00:00 | 2026-10-07T18:30:00+00:00 |
| M32 | 8fb94b8a-c0e9-4783-a71b-5d39c3e621b3 | 0x404da036e872fe1c9bdb2176564502a43f12831ddcc346395aca3146f9e71bdc | Will MetaMask launch a token by September 30, 2026? | crypto | will-metamask-launch-a-token-in-2025 | 2025-11-04T15:20:27.106118+00:00 | 2026-10-01T03:59:00+00:00 |
| M33 | 9d50a614-4947-4045-807b-aba60619a546 | 0xc0557fe16b895dc57660639b904368c4d4a44f935fb6094e95d73061b1b9cd3a | Will the price of Bitcoin be above $78,000 on October 2? | crypto | bitcoin-above-on-october-2-2026 | 2026-09-25T16:00:17+00:00 | 2026-10-02T16:00:00+00:00 |
| M34 | a2586e21-d434-422a-ae19-b8d56c5d9db4 | 0x28d89d32bf9aad530d096f0dcd7908363d0efa9ea734c5485239526a0a647bf2 | Will the price of XRP be above $1.30 on October 2? | crypto | xrp-above-on-october-2-2026 | 2026-09-25T16:00:22+00:00 | 2026-10-02T16:00:00+00:00 |
| M35 | a4af8258-7a10-45c2-9d5d-dfcf05732456 | 0x67db289b2935b782721b426fbead91355b6e84b7084863bc42edccc30e476a3a | Adana: Completed Match: Cagla Buyukakcay vs Lucrezia Stefanini | sports | wta-buyukak-stefani-2026-09-30 | 2026-09-29T22:14:10+00:00 | 2026-10-07T15:00:00+00:00 |
| M36 | aa382791-0865-4a15-8bd1-29b28de872e6 | 0xa20f73e354e88c5138bdf45bc2dbba583003df9af8d1e19489e84d0b743cff14 | Will Ethereum reach $3,400 September 28-October 4? | crypto | what-price-will-ethereum-hit-september-28-october-4-2026 | 2026-09-28T04:00:16+00:00 | 2026-10-05T04:00:00+00:00 |
| M37 | aa8bfd5a-f2e9-40fd-85f9-6fb765af9a1b | 0x0763bde732d56961d1deeb9bd4dd2dc2448bb3ecce0863c26c2dbcef9971dd05 | Will the price of Bitcoin be above $78,000 on October 3? | crypto | bitcoin-above-on-october-3-2026 | 2026-09-26T16:00:15+00:00 | 2026-10-03T16:00:00+00:00 |
| M38 | aad448e2-149e-4d6e-8e05-aa151faa388e | 0x825f54c890fed7f6e7d0653f10b8c4eb9e22bf0f9536aacaa6686d32ac562d61 | Spread: Colts (-1.5) | sports | nfl-ind-was-2026-10-04 | 2026-08-25T16:01:11+00:00 | 2026-10-04T13:30:00+00:00 |
| M39 | b26bf63e-0e4b-47ad-b4c0-4b4b3315c7a1 | 0x31d34dbc0cbb4915124cd8eee12178aefb0f79fead659e2c05d0985f5837d30d | Will Donald Trump post about $LAPTOP by September 30? | crypto | who-will-post-about-laptop-by-september-30 | 2026-09-07T19:40:30+00:00 | 2026-10-01T03:59:00+00:00 |
| M40 | b5998f66-47a4-4777-9e63-99f5cb91bbcf | 0xb4376fc53bfb85b6e29ade61ee54352004e46aa2d68b977a7f7d5d7b9b2438f5 | Will there be a run scored in the first inning?: Chicago White Sox vs. Houston Astros | sports | mlb-cws-hou-2026-09-30 | 2026-09-28T13:00:18+00:00 | 2026-10-07T21:00:00+00:00 |
| M41 | b5b57f80-1b6d-4c7c-8029-832073c0f419 | 0x6a47ac8c9cc9ff85ff3b3ba79e62265586c8fd0307c635ca64d3af466be490f6 | Will SpaceX have fewer than 12 launches in September 2026? | science | how-many-spacex-launches-in-september-2026 | 2026-08-26T21:57:24+00:00 | 2026-10-01T03:59:00+00:00 |
| M42 | b68639d4-5dd2-4de0-894e-1e872d75c927 | 0x51ae59b024d788642210d8c113f5bbcd13a782948d3d1df1c4dc38e37f8c9abe | Will the price of Bitcoin be above $74,000 on October 6? | crypto | bitcoin-above-on-october-6-2026 | 2026-09-29T16:00:22+00:00 | 2026-10-06T16:00:00+00:00 |
| M43 | c74d5e64-8c33-4a7b-af46-d949a675503a | 0x4a36dbb4d2def2c21723aeea59583c927ea736809ef180afcb8c3b7c6eb42098 | Will SpaceX have exactly 13 launches in September 2026? | science | how-many-spacex-launches-in-september-2026 | 2026-08-26T21:57:24+00:00 | 2026-10-01T03:59:00+00:00 |
| M44 | c8cf9046-a626-485b-9b45-d687b2c2c57c | 0x3db3630ec8a5eba003416f0a4735b241ef76c971b56bd34872f808af6f5a1d97 | Will China PR win on 2026-10-02? | sports | fif-chn-tkm-2026-10-02 | 2026-09-18T13:00:17+00:00 | 2026-10-02T11:35:00+00:00 |
| M45 | ca9906ea-85a9-4186-8859-563f28b88d80 | 0xc3794a8d3a34d04b9f39773e35c4cecdac89d32eab93e8589d9a6f03e04e9490 | Trump out as President by September 30? | politics | dtrump-out-as-president-by-september-30 | 2026-09-02T21:12:57+00:00 | 2026-10-01T03:59:00+00:00 |
| M46 | cbe00a83-df0e-4d27-95f4-d54a82fe48e3 | 0x81a537b379a35e4e17c286d3b37394e94bd74c1779bbe9a13670eb991b201a3a | Will Tarcisio de Freitas win the 2026 Brazilian presidential election? | politics | brazil-presidential-election | 2025-09-18T20:07:57.76+00:00 | 2026-10-05T03:59:00+00:00 |
| M47 | cf5cb8ee-42dd-4e9a-8e7b-4e06310dc90e | 0x86d0232cd2d07900e00a49c1606863ad760618fa36861add2777839bd05b06af | XRP all time high by September 30, 2026? | crypto | xrp-all-time-high-by | 2025-12-17T17:40:57.882+00:00 | 2026-10-01T03:59:00+00:00 |
| M48 | de3a2fc6-81ec-404d-a30a-6c3e10568fc2 | 0xfe963a6028277fed1de25b6ca8f640bc7c028e4ef0d0e4f4ff4f5daf5f9ae824 | Will Tarcisio de Freitas finish in second place in the first round of the 2026 Brazilian presidential election? | politics | brazil-presidential-election-first-round-2nd-place | 2026-02-11T22:50:20.967509+00:00 | 2026-10-05T03:59:00+00:00 |
| M49 | dfca5c40-360c-437b-ab0b-c2eb4ab13562 | 0xf7da65a07f793333740d646d632a8cd1172d03cb4461d42d48d78660e83c3629 | Will the price of Bitcoin be above $78,000 on October 4? | crypto | bitcoin-above-on-october-4-2026 | 2026-09-27T16:00:15+00:00 | 2026-10-04T16:00:00+00:00 |
| M50 | e1237bc5-02f1-4ac3-8be6-2050413b0146 | 0xc7d9f574c3c987da9e3dab7eb6e8ea7c763a6882f576023622127bb9e643bd61 | Will Bitcoin reach $98,000 September 28-October 4? | crypto | what-price-will-bitcoin-hit-september-28-october-4-2026 | 2026-09-28T04:00:12+00:00 | 2026-10-05T04:00:00+00:00 |
| M51 | f11437f0-07fc-4578-adbb-fe6a5e8901fa | 0x04c9d8765393a49409aaeb9c7fed990cb32aa37ccd24e2e68effc63987b8cd25 | Will Ethereum reach $3,300 September 28-October 4? | crypto | what-price-will-ethereum-hit-september-28-october-4-2026 | 2026-09-28T04:00:19+00:00 | 2026-10-05T04:00:00+00:00 |
| M52 | f4fa84e5-86a4-4794-8b77-0618c790dc00 | 0x2f0287ff7fc7443a5a3e33a17714a56744ab6860fe77c64b75d9d15db78f5017 | Will the price of Bitcoin be above $78,000 on October 6? | crypto | bitcoin-above-on-october-6-2026 | 2026-09-29T16:00:22+00:00 | 2026-10-06T16:00:00+00:00 |
| M53 | f6cd246c-b955-4e31-b0ca-0a58b1f7bb3a | 0x710ce15deba099608dd256df512394d11f8d02e5c38644cf88c9cf0752254d7f | Ethereum all time high by September 30, 2026? | crypto | ethereum-all-time-high-by | 2025-12-16T21:59:26.739+00:00 | 2026-10-01T03:59:00+00:00 |
| M54 | f770901d-691b-44d7-8431-c8a3659f4558 | 0x14219327c42469dc2b2f9fb45af0106204604b8af364ef3f450b304336c78b06 | Mouilleron-Le-Captif: Lucas Poullain vs Remy Bertola | sports | atp-poullai-bertola-2026-09-30 | 2026-09-29T23:05:28+00:00 | 2026-10-07T18:30:00+00:00 |
| M55 | f7d2cda8-a0ee-45f4-b677-5cdf53a1b2f6 | 0x162192430008e1a48d5a7ab536f1ae42c6687bae00bbc645100c93ec7653225b | Will Bitcoin reach $94,000 September 28-October 4? | crypto | what-price-will-bitcoin-hit-september-28-october-4-2026 | 2026-09-28T04:00:12+00:00 | 2026-10-05T04:00:00+00:00 |
| M56 | fa859045-cf4f-4004-ae7d-983613e5aa81 | 0x4acce2ce696e9a5aa69847e128fba93adadcdb5f6efcb05d5c548a80c72f2342 | Will Bitcoin reach $96,000 September 28-October 4? | crypto | what-price-will-bitcoin-hit-september-28-october-4-2026 | 2026-09-28T04:00:12+00:00 | 2026-10-05T04:00:00+00:00 |
| M57 | ff06e900-4051-470f-95ab-c1561a39e798 | 0xd1068052a3e704861abb5e30646f7a9167c0f4631a7d7267de7fa44e4a7d0677 | Will the price of Bitcoin be between $74,000 and $76,000 on October 2? | crypto | bitcoin-price-on-october-2-2026 | 2026-09-25T16:00:19+00:00 | 2026-10-02T16:00:00+00:00 |
| M58 | ffe79599-afe5-4e6a-b80c-c509786bacae | 0x6123b5cc75c38ba9783f6c8ea260107b546c7d3454a8f9b5280c9921cc39f3d9 | Bitcoin all time high by September 30, 2026? | crypto | bitcoin-all-time-high-by | 2025-12-16T15:55:10.21+00:00 | 2026-10-01T03:59:00+00:00 |


## Audit artifact / publication state

Mandatory source HANDOFF publication: documentation-only commit
**90543d9e29ded2b5650c7ca117a72b64ec1cb9bc**, changes only eight new audit lines
in HANDOFF.md, normally fast-forwarded to source main with **[skip ci]**.
All preexisting local HANDOFF bytes were preserved and left uncommitted; unrelated
files and reports were not staged. This documentation changes source main only;
Production remains pinned to **6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d**.
No new application CI/release/build is required or claimed for a read-only audit.

Final Production recheck at **2026-10-01T00:59:46Z** / local 08:59:46 confirmed
the same exact deployed release and process cwd, health ok, unchanged runner /
timer / service / all 14 existing gate hashes, and the same Prediction/Futures /
Spot / admin / App source hashes as the activation baseline. No additional entry
dispatch was found in user crontabs. Demo Entry remains ON; Real and Prediction
Learning remain OFF. The ledger is still empty (trades/open/closed/gross/fees/net
all zero), and the 150-row fingerprint remains exactly
b47f872bc0da16e441932eca84c0d9ce. No audit SQL write or Production state change.

This dated report is the only new report for this task. It is published under the
same reports/prediction path in SignalVerse-AI-Log/master, after secret/private
data review, and remotely returned file bytes and Git blob identity are compared
with this local report. No raw query receipt is published. Documentation handoff
work is separate from the immutable deployed runtime; no application release or
configuration update is part of this audit. Any publication limitation must be
reported explicitly in the final response.
