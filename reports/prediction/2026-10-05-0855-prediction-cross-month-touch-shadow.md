# Prediction Market — Phase 9B: Cross-Month Weekly Touch, Offline Tests + Shadow-Only Implementation

- **Date:** 2026-10-05. Work started about 08:20 UTC; read-only production checks ran at 08:44:15Z (before) and 08:50:41Z (after); the report was written at about 08:55 UTC.
- **Scope:** offline semantic tests and a bounded **shadow-only** admission path for the exact BTC/ETH cross-month weekly High-Touch family, and nothing else.
- **Base (source) SHA:** `3e92cab7a36cc0021847b1f700b9b5a394c75b37`. This is `origin/main`, and it is also the release Production is running (`/opt/signalverse/app -> releases/3e92cab…`).
- **Implementation commit:** `5e7aac6077aa80e60a25725d14ad7a124fbc040f` on branch `codex/prediction-cross-month-touch-shadow-20261005`. The branch is pushed, but there is no PR and it is **not merged**.
- **Deployment status: NOT DEPLOYED.**
- **Production DB status: NOT MODIFIED.**
- **Real Trading: OFF.**
- **Autonomous Learning: OFF.**

> **This task does NOT establish profitability, model superiority, or missing profitable trades.**
>
> **The cross-month family is SHADOW-ONLY and cannot create an autonomous Demo position.**

---

## 1. Executive Summary

Polymarket names a week that crosses a month boundary like this: `what-price-will-bitcoin-hit-september-28-october-4-2026` ("Will Bitcoin reach $X September 28-October 4?"). The verified weekly template `BINANCE_HIGH_ET_WEEK` only accepts a single month (`…-hit-september-21-27-2026`), so these markets have never received a `PRICE_MODEL` group. Without that group, H3 keeps the production decision an abstention: `PRICE_TEMPLATE_NOT_VERIFIED` leads to `INSUFFICIENT_DATA`.

I checked the public Gamma rule text on 2026-10-05. The full-window "reach" markets of the cross-month events carry a rule that is **byte-identical, apart from the coin, to the supported same-month weekly rule**: any Binance BTC/USDT (or ETH/USDT) 1-minute candle from 12:00 AM ET on the first date to 11:59 PM ET on the last has a final "High" ≥ strike.

The same events also contain markets that are **not** this family, and both must be excluded:

- **Later-added "reach" markets.** These start at around 16:57Z on later days, and their window runs from market creation to the deadline ("from the creation of this market through 11:59 PM ET…").
- **"Dip to" markets.** These settle on the Low ≤ strike, a different payoff.

Autonomous Demo Entry is ON. Adding the family to the production whitelist would therefore send it straight into Demo entry. I proved this with a mutation test: widening the regex makes the end-to-end test fail with "mk-x1 never reaches the Demo insert". So I did the following instead:

- **Explicit parser.** A fail-closed parser, `parseCrossMonthWeeklyTouch`, checks asset, direction, strike, dates, timezone, the 7-calendar-date duration, the window boundaries, the exact rule text, and the token and condition mapping. Each check has its own named rejection reason.
- **Shadow-only observation.** `runCrossMonthTouchShadow` runs **only** inside the Shadow tick (`dryRun`), after every production decision is final. It reuses the production evaluation's captured order books and `asOfMs`, the existing price-input fetcher, and the unchanged price model, prior, fees, H1–H8 calculations, thresholds and Kelly sign.
- **Output location.** The only output is the existing `prediction_autonomous_runs.summary` jsonb, under `crossMonthTouchShadow`. Nothing new goes into the database schema.
- **Kill switch.** `PREDICTION_CROSS_MONTH_TOUCH_SHADOW=off`.
- **The template stays out of production.** The shadow template is deliberately **not** in `RESOLUTION_VERIFIED_TEMPLATES`, so the production path still abstains on these markets.

Results:

- The new test file passes 34/34.
- Every Prediction step in the CI workflow passes.
- No new TypeScript errors.
- The esbuild bundle builds with the CI flags.
- Production is unchanged: the read-only checks before and after match, and the deployed bundle contains 0 occurrences of the new marker.

## 2. Exact Current Weekly Touch Contract (as implemented at `3e92cab`)

| Component | Implementation |
|---|---|
| Template | `BINANCE_HIGH_ET_WEEK` in `RESOLUTION_VERIFIED_TEMPLATES` (`api/predictions.ts:707`) |
| Slug | `^what-price-will-(bitcoin\|ethereum)-hit-[a-z]+-\d{1,2}-\d{1,2}-\d{4}$`, so a single month only |
| Classifier | `classifyQuestion` (`:734`): `RE_PRICE_TOUCH` `^will <coin> (reach\|hit\|dip to\|fall to\|drop to) $K`; `reach`/`hit` = up. The coin in the slug must equal the coin in the question (`SLUG_COIN_TO_SYMBOL`) |
| Direction | `touchDirections: ['up']` only; down returns `PRICE_DIRECTION_NOT_VERIFIED` |
| Window | `windowDays: 7`; `buildPriceModelGroup` requires that `floor(startDate to the hour)` is within ±1h of `endDate − 7d` (`PRICE_WINDOW_UNVERIFIED` otherwise); `windowStartMs = floored start` |
| Horizon | 24h ≤ end − asOf ≤ 7d (`OUTSIDE_TIME_HORIZON`) |
| Inputs | `fetchPriceModelInputs` (`:802`): `data-api.binance.vision` 1m spot (closeTime < asOf, age ≤ 2 min), 32 daily candles (≥ 25 required) for the 30-day σ, window High from 1h candles since the window start plus 1m candles for the partial hour, all filtered by `closeTime < asOfMs` |
| Already touched | `windowHigh ≥ strike` gives `PRICE_ALREADY_TOUCHED` and the market abstains |
| Model | `priceModelProbabilityYes` Touch branch (`:857`): `2·(1 − Φ(ln(K/S)/s))`, `s = σ·√τ`, at σ×1.0 and σ×1.5 |
| Evidence | `PRICE_MODEL` β = 0.5, cap 1.5, validation 0.5; combined with the de-vigged market prior |
| Gates | H1–H4, H6 and H7 per side (`evaluateSideGatesV2`, `decide`); H5 (ladder), H8 (two-tick stability), time horizon and tradeability apply at tick level in `autonomousEntryTick` |
| Rule text | `BINANCE_HIGH_ET_WEEK.rule` was manually verified on 2026-09-28; the live rule text is not read at runtime |

## 3. Exact Cross-Month Gap

| Market group | Slug example | Production result at `3e92cab` | Shadow contract |
|---|---|---|---|
| Same-month weekly reach (window start) | `…-hit-september-21-27-2026` | PRICE_MODEL (supported) | `SUPPORTED`, left untouched |
| **Cross-month weekly reach (window start)** | `…-hit-september-28-october-4-2026` | `PRICE_TEMPLATE_NOT_VERIFIED`, abstain | **`SHADOW_ONLY`** |
| Cross-month reach added later | same slug, start 16:57Z on later days | abstain | `REJECTED: WINDOW_START_MISMATCH` (or `RULE_CREATION_WINDOW_NOT_SUPPORTED` if the start happens to align) |
| Cross-month dip to (Low ≤) | same slug | abstain | `REJECTED: DIRECTION_NOT_VERIFIED` |
| Cross-year (Dec→Jan) | `…-december-28-january-3-2026` | abstain | `REJECTED: CROSS_YEAR_UNVERIFIED` (the year semantics are unverified) |

The 2026-10-01 audit measured six such markets (16/150 observations). They are two shared weekly price paths, not 16 independent outcomes.

## 4. Files / Functions Audited

`api/predictions.ts` at `3e92cab`, using HEAD line numbers:

- **Template recognition:** `RESOLUTION_VERIFIED_TEMPLATES` (:700), `BINANCE_HIGH_ET_WEEK` (:707), `classifyQuestion` (:734).
- **Date and month logic:** none existed before. The weekly window was checked only through the `startDate`/`endDate` floor comparison inside `buildPriceModelGroup` (:1401). Month names were never parsed.
- **Binance 1-minute High adapter:** `fetchBinanceKlines` (:786) and `fetchPriceModelInputs` (:802).
- **Touch PRICE_MODEL:** `priceModelProbabilityYes` (:850; Touch branch :857; the terminal `pAbove` with the −s²/2 drift is at :853).
- **Composed engine:** `evaluateMarket` (:1483); `evaluateSide`, `chooseBestSide`, `evaluateSideGatesV2` (:932), `decide` (:1044), `findLadderIncoherentMarkets` (:951).
- **Shadow routing:** the handler action `autonomous-enter-shadow` (:3244) calls `recordAutonomousRun('entry_shadow', … autonomousEntryTick(true))`. The Phase 9C pattern I reused is `evaluateV2Mode` (:2062) and `runPriceAiReviewDiagnostic` (:2090).
- **Autonomous discovery and entry:** `autonomousDiscoveryTick`; `autonomousEntryTick` (:2485); the branch point is marked at :2714; the only Demo insert is at :2753, reachable only when `!dryRun`. Entry is wired through the action `autonomous-enter` (:3229) and the root-owned gate `/etc/signalverse/jobs.d/prediction-enter-cron.enabled`.
- **Resolver and outcomes:** `autonomousResolutionTick` (:2983), `collectV2ShadowOutcomes` (:2837), `assessV2OutcomeObservation` (:2814).
- **Model and version identifiers:** `modelVersion: 'v2'`, `V2_META_PREFIX`, `PRICE_AI_DIAG_VERSION = 'price-ai-review-v1'`; new in this work: `CROSS_MONTH_TOUCH_SHADOW_VERSION = 'CROSS_MONTH_WEEKLY_TOUCH_SHADOW_V1'` (:2236).
- **Existing weekly Touch tests:** `scripts/prediction-engine-v2-test.mjs` (weekly slug at lines 39 and 307), `prediction-ai-price-review-diagnostic-test.mjs`, `prediction-demo-lifecycle-test.mjs`, `prediction-v2-replay-regression-test.mjs`. The isolated harness is `scripts/lib/prediction-isolated-env.mjs`.
- **Replay helper:** `scripts/prediction-v2-replay.mjs` builds the NO book as the complement of the stored YES book. This task forbids that, so I did **not** reuse it for this family. I reused the existing `fetchPriceModelInputs` (closeTime < asOf), the isolated harness and its leaky-future-candle stub instead.

Public data I verified (read-only GETs to `gamma-api.polymarket.com` on 2026-10-05):

- The BTC and ETH "September 28-October 4" events, and the BTC "September 21-27" event.
- The exact rule text for each market group.
- The behaviour of `markets?condition_ids=`: an open market returns `conditionId` and `description`; a closed market returns `[]` by default.

## 5. Implementation Changes

| File | Change |
|---|---|
| `api/predictions.ts` | +270/−3 lines. The body of `buildPriceModelGroup` moved verbatim into `buildPriceModelGroupForTemplate(m, cls, asOf, template)`; `buildPriceModelGroup` still does the whitelist lookup and then calls it, so production behaviour is identical (tested deep-equal). New shadow block (:2222–2471): `CROSS_MONTH_TOUCH_SHADOW_TEMPLATE` (not in the whitelist), `etMidnightUtcMs` (DST-aware, using `Intl` `America/New_York`), `parseCrossMonthWeeklyTouch`, `classifyWeeklyTouchAdmission`, `fetchCrossMonthRuleSource` (bounded GET with an 8 s timeout and a 30-minute per-condition cache), and `runCrossMonthTouchShadow`. A single call site sits inside `if (dryRun && process.env.PREDICTION_CROSS_MONTH_TOUCH_SHADOW !== 'off')`, and the Shadow return value gains `crossMonthTouchShadow`. Exports were added for the tests |
| `scripts/prediction-cross-month-touch-shadow-test.mjs` | New file, 34 tests |
| `.github/workflows/production-ci.yml` | The new test was added to the Prediction step |
| `TRADING_STRATEGY.md` | Chain entry recording a shadow-only observation with no change to the production strategy |
| `HANDOFF.md` | Handoff entry, on the branch only |

Not changed:

- Thresholds (`DEFAULT_THRESHOLDS` minEdge 5, minConfidence 40, …).
- H1–H8 logic.
- Fees (`feeRateForCategory`, `computeTakerFee`).
- Kelly and risk rules (`computeAutonomousPositionSize`).
- β, caps and validation (`ENGINE_V2_GROUP_PARAMS`).
- Touch and AT mathematics.
- RANGE.
- AI providers and models.
- Schedulers, cron jobs, gates.
- Migrations and the database schema.
- Futures, Spot, Fast Trader, Supervisor, Wallet and signing.
- Learning.
- Real trading.
- `HELP_ASSISTANT_APP_DESCRIPTION`: no user-facing feature changed, so it was not updated.

## 6. Shadow Routing Design

The production Shadow tick always runs first, and is unchanged:

```text
autonomous-enter-shadow (existing timer: discovery → shadow → enter → resolve)
  └─ autonomousEntryTick(dryRun=true)
       ├─ evaluateMarket(...) for every ELIGIBLE candidate   ← production decision path, unchanged
       ├─ recordPrediction(...)                             ← production abstention rows, unchanged
       ├─ gates / ranking / revalidation / dryRun branch    ← unchanged, no insert when dryRun
       ├─ runPriceAiReviewDiagnostic (9C, unchanged)
       └─ runCrossMonthTouchShadow(final, …, referenceAccountConfig)   ← NEW, dryRun only
```

For each `final` entry, `runCrossMonthTouchShadow` does the following:

1. It only looks at a market where `questionType = CRYPTO_PRICE_TOUCH`, `templateId = null`, and the slug has the two-month weekly shape. Supported weekly markets are only counted, as `SUPPORTED_EXISTING_WEEKLY`.
2. It runs the structural contract with no network access. Only a market that passes every check is allowed to read its rule source with one GET to the existing `gamma …/markets?condition_ids=` endpoint. That read is cached for 30 minutes, limited to 12 new reads per tick, and covered by a 20 s budget. The overflow is recorded as `INSUFFICIENT_DATA: RULE_FETCH_BUDGET_EXHAUSTED`.
3. It applies the full contract, including `closed` on the source and the exact rule text.
4. It calls `buildPriceModelGroupForTemplate` with the shadow template and the production evaluation's own `asOfMs`, which goes through the same `fetchPriceModelInputs`.
5. It calls `evaluateV2Mode` on the production evaluation's captured inputs (the same YES and NO books, the same prior, the same `dataAgeMs` and thresholds), with `[PRICE_MODEL]` only. AI review is deliberately excluded (`ai_review: 'EXCLUDED_DETERMINISTIC_SHADOW'`): no new AI calls are made, and under H3 an AI review cannot originate a trade anyway.
6. It records tick-level gates with production semantics: H5 across this family's shadow posteriors, H8 against the previous `entry_shadow` run's `crossMonthTouchShadow` record (3–15 min window), the time horizon, tradeability, and the Kelly sign computed against the captured best ask. The resulting field is `would_proceed_if_admitted`. Revalidation is recorded as `NOT_PERFORMED_SHADOW_ONLY`.

Each record carries:

- `version`, `market_id`, `condition_id`, `prediction_id` (the production abstention row), `ts` (= asOf);
- `admission` (status, family, ET window start and end, hours, `rule_sha256`);
- `params`;
- `production` (decision, template_id = null, admissibility, has_price_model = false);
- `p0`, `price_model_q` and its band;
- `exec` per side (book CAPTURED/UNAVAILABLE, exec_price, fee_per_share, market_prob, decision, net_edge);
- `no_look_ahead` (as_of, spot, spot_close_time, max_close_time_used, ok, tau_days, window_high);
- `evaluation` (decision, chosen_side, YES/NO reasons, net_edge, edge_band, confidence, resolution_status, tradeability);
- `tick_gates`;
- `entry_reachable: false`.

Status vocabulary:

| Status | Meaning |
|---|---|
| `SUPPORTED` | Existing production template |
| `SHADOW_ONLY` | The admission contract passed |
| `REJECTED` | A named contract violation |
| `INSUFFICIENT_DATA` | Rule or source input missing |
| `EVALUATED`, `ABSTAIN`, `INSUFFICIENT_DATA`, `REJECTED` | Evaluation stage |

## 7. Why Demo Entry Cannot Reach It

1. **The whitelist is the only route to production evidence.** `classifyQuestion` and `buildPriceModelGroup` only use `RESOLUTION_VERIFIED_TEMPLATES`. The shadow template is not in it, and a test asserts both that the list contains exactly the four ids and that no entry matches the cross-month slugs.
2. **Without PRICE_MODEL, production abstains.** With no group, `decide` returns `INSUFFICIENT_DATA` (`NO_ADMISSIBLE_EVIDENCE`), and H3 would fail in any case. `gatedNow` requires `PREDICTION_ACTIONABLE_DECISIONS`, so these markets never reach ranking, revalidation or the insert.
3. **The shadow code runs only in `dryRun`.** Its single call site is guarded by `dryRun && kill-switch`. The insert sits behind `if (dryRun) { … continue; }`, so a `dryRun` tick never reaches it.
4. **The shadow code cannot write.** A static test checks the whole shadow block. It finds exactly one database access (a `SELECT` of the previous `prediction_autonomous_runs.summary`) and no `.insert(`, `.upsert(`, `.delete(`, `.rpc(`, or `.update({`. It also finds none of these references: `prediction_autonomous_trades`, `prediction_predictions`, `recordPrediction`, `annotatePredictionWithEntryOutcome`, `autonomousEntryTick`, `revalidateMarketForEntry`, `computeAiEvidence`, `callFreeAiJson`, `fetchClobOrderBook*`, `fetchClobSettlementOutcome`, `fetchClobMarketState`, `resolved_outcome`, `deductPredictionCredit`, `ai_credit_balance`.
5. **The real handler path was tested end to end.** In the isolated environment, two `autonomous-enter` ticks open a Demo position for the supported same-month control market. In those same ticks the cross-month markets get **0** positions, and their production rows are `INSUFFICIENT_DATA` with `PRICE_TEMPLATE_NOT_VERIFIED`. Two Shadow ticks then mark the cross-month market `would_proceed_if_admitted = true` (H8 holds, Kelly > 0). A further Enter tick **still opens nothing** for it.
6. **The test detects the danger.** I temporarily widened the weekly regex (`…-\d{1,2}-(?:[a-z]+-)?\d{1,2}-\d{4}`). 30 of 34 tests failed, including "mk-x1 never reaches the Demo insert". The file was then restored to the identical hash.

## 8. Historical Replay / Look-Ahead Validation

- **Every price input uses the existing `fetchPriceModelInputs`.** Requests end at `floor(asOf/1m) − 1 ms`, and every candle is filtered by `closeTime < asOfMs`.
- **Leaky API test.** A stub returns future candles priced at 1.5× after asOf. Their High would exceed the strike and produce `PRICE_ALREADY_TOUCHED`. Instead the record shows `EVALUATED`, `no_look_ahead.ok = true`, spot = 100,000, `window_high ≤ 100,200`, and `max_close_time_used < asOf`. The test asserts that the 1h and 1m window candles were actually requested, so a cache hit cannot make it pass vacuously.
- **Historical asOf test.** The clock is set two days after the decision time with the leaky stub active. The record `ts` equals the historical asOf, and every close time used is earlier than it.
- **No synthetic NO book.** With the NO book returning 404, `exec.NO` is UNAVAILABLE: exec_price is null, market_prob is null, and the decision is INSUFFICIENT_DATA. The prior is the YES midpoint alone, following the existing `deViggedMarketPrior` rule; no NO price is fabricated.
- **No later books.** The shadow code makes zero CLOB book calls; a test checks that the network log contains only `gamma:` and `klines:` entries during a runner call. The books are those captured by the production evaluation of that same tick.
- **No future resolution data.** The shadow code makes no settlement or CLOB market-state calls and reads no `resolved_outcome` (static and network assertions).
- **The 16-row retrospective was not re-run.** Historical NO books and depth are incomplete, so NO-side edge, confidence, H1–H8 and would-open stay **UNKNOWN**. The 2026-10-01 numbers stand unchanged: 16 rows, 0 positive modeled YES edges, 0 YES edges ≥ 5pp. Retrospective feasibility is not statistically validated performance.
- **Rule versions are not archived historically.** The rule text is read live, so it applies prospectively. A historical replay cannot prove which rule version applied at a past time.

## 9. Tests (new file: `node scripts/prediction-cross-month-touch-shadow-test.mjs`, 34/34 PASS)

| # | Required case | Input | Exact result |
|---|---|---|---|
| 1 | Same-month BTC weekly | `…-hit-september-21-27-2026` | `SUPPORTED` (`BINANCE_HIGH_ET_WEEK`) |
| 2 | Same-month ETH weekly | `…ethereum…-september-21-27-2026` | `SUPPORTED` |
| 3 | Sep→Oct BTC | `…september-28-october-4-2026`, $98,000 | `SHADOW_ONLY`; window 2026-09-28T04:00Z → 2026-10-05T04:00Z, 168h |
| 4 | Sep→Oct ETH | $3,400 | `SHADOW_ONLY` |
| 5 | Oct→Nov BTC | `…october-26-november-1-2026` | `SHADOW_ONLY`; window 04:00Z → 2026-11-02T05:00Z, **169h** (DST ends Nov 1) |
| 6 | Oct→Nov ETH | same | `SHADOW_ONLY`, 169h |
| 7 | Invalid month transition | Sep→Nov; Oct→Sep; Dec→Jan; Sep 31; "septober"; Sep→Sep | `INVALID_MONTH_TRANSITION` ×2; `CROSS_YEAR_UNVERIFIED`; `INVALID_CALENDAR_DATE`; `INVALID_MONTH_NAME`; `SAME_MONTH_NOT_THIS_FAMILY` |
| 8 | Wrong duration | Sep 28–Oct 5; Sep 29–Oct 4 | `WRONG_WINDOW_DURATION` ×2 |
| 9 | Wrong timezone | end 00:00Z; start 00:00Z; start 16:57Z (later-created); missing start; invalid end | `WINDOW_END_NOT_ET_MIDNIGHT`; `WINDOW_START_MISMATCH` ×3; `WINDOW_END_NOT_ET_MIDNIGHT` |
| 10 | Wrong feed | Coinbase in place of Binance | `RULE_FEED_NOT_BINANCE` |
| 11 | Wrong candle timeframe | 1-hour/"1h"; "5m" | `RULE_TIMEFRAME_NOT_1M` ×2 |
| 12 | Wrong asset | solana; xrp; Ethereum question on a bitcoin slug; ETH/USDT rule on a bitcoin slug | `ASSET_NOT_SUPPORTED` ×2; `ASSET_MISMATCH`; `RULE_PAIR_MISMATCH` |
| 13 | Wrong payoff | Close; strict >; dip to; Low rule; creation-window rule; PM/AM window; extra sentence | `RULE_PAYOFF_NOT_HIGH_GTE`; `RULE_PAYOFF_NOT_HIGH_GTE`; `DIRECTION_NOT_VERIFIED`; `RULE_PAYOFF_NOT_HIGH_GTE`; `RULE_CREATION_WINDOW_NOT_SUPPORTED`; `RULE_WINDOW_NOT_TITLE_DATE_RANGE`; `RULE_TEXT_UNRECOGNIZED`. Whitespace or typographic-quote changes alone still give `SHADOW_ONLY` |
| 14 | Unknown or unparseable title | "What price will…"; "$98k"; title/slug date mismatch; empty; other slug; null slug | `QUESTION_UNPARSEABLE` ×3; `QUESTION_SLUG_DATE_MISMATCH`; `SLUG_NOT_CROSS_MONTH_WEEKLY` ×2 |
| 15 | Already resolved | `closed: true` on the source | `MARKET_ALREADY_RESOLVED` (parser and runner) |
| 16 | Outside 24h–7d | 16h left; window not yet started (7.67d) | `OUTSIDE_TIME_HORIZON` ×2 (24h01m left is still admitted) |
| 17 | Missing token mapping | missing NO, missing YES, duplicate token, missing condition | `MISSING_TOKEN_MAPPING` ×4 (parser and runner) |
| 18 | Missing historical input | rule text null or blank; Gamma has no market; Binance down | `INSUFFICIENT_DATA: RULE_TEXT_UNAVAILABLE` ×3; evaluation `INSUFFICIENT_DATA: PRICE_DATA_UNAVAILABLE` |

Additional tests in the same file:

- The DST-aware ET midnight helper, including an impossible date returning null.
- The production whitelist is unchanged and matches no cross-month slug.
- `classifyQuestion` still returns `templateId: null` for these markets.
- `buildPriceModelGroup` and `buildPriceModelGroupForTemplate` give deep-equal results for the supported weekly market, and production evaluation still uses `BINANCE_HIGH_ET_WEEK`.
- The production evaluation of a cross-month market abstains.
- The shadow evaluation equals an independent recomputation (prior, q, β/cap, decision, edge, confidence, fee per share).
- The runner writes nothing to the database (byte-identical), makes no book, AI or settlement calls, and does not mutate the production result object.
- Leaky future candles, a historical asOf, and a missing NO book.
- `PRICE_ALREADY_TOUCHED` gives ABSTAIN.
- Rejected markets read no rule source.
- The rule-read cap of 12 per tick, with the overflow as INSUFFICIENT_DATA.
- The 169h DST week passes the existing ±1h window check.
- End to end through the real handler: two Enter ticks, two Shadow ticks, and a third Enter tick.
- The kill switch removes the observation; with the switch on and off at the same clock time, `shadowDecisions`, `skipped` and `wouldHaveOpened` are deep-equal.
- The static call-graph test.

Mutation check (required to show the isolation test is not vacuous):

- **Change:** temporarily widen the `BINANCE_HIGH_ET_WEEK` slug to `-\d{1,2}-(?:[a-z]+-)?\d{1,2}-\d{4}$`, then run the new test file.
- **Result:** FAIL. 4 pass and 30 fail, including `AssertionError: mk-x1 never reaches the Demo insert` (the cross-month market got a Demo trade).
- **Restore:** the file was restored to its pre-mutation SHA-256 (`dffa450a…`), and 34/34 pass again.

## 10. Regression Results

All tests ran locally on Node v24.19.0, Windows, in the isolated worktree. **No `.env.backup.local` exists in that worktree, so no test could reach the production database.** I ran exactly the Prediction list from `production-ci.yml`. `prediction-market-position-credit-test.mjs` is excluded by the safe-test runbook and is not in CI, so it was not run.

| Command | Result |
|---|---|
| `node scripts/prediction-market-engine-test.mjs` | PASS ("ALL PREDICTION MARKET ENGINE TESTS PASSED") |
| `node scripts/prediction-market-lookahead-test.mjs` | PASS ("NO LOOK-AHEAD BIAS DETECTED") |
| `node scripts/prediction-time-horizon-gate-test.mjs` | PASS 10/10 |
| `node scripts/prediction-tradeability-gate-test.mjs` | PASS 10/10 |
| `node scripts/prediction-ranking-test.mjs` | PASS 5/5 |
| `node scripts/prediction-shadow-classification-test.mjs` | PASS 4/4 |
| `node scripts/prediction-side-aware-test.mjs` | PASS 19/19 |
| `node scripts/prediction-settlement-test.mjs` | PASS 17/17 |
| `node scripts/prediction-calibration-test.mjs` | PASS 12/12 |
| `node scripts/prediction-duplicate-protection-test.mjs` | PASS 14/14 (entry safety) |
| `node scripts/prediction-revalidation-test.mjs` | PASS 12/12 (entry safety) |
| `node scripts/prediction-shadow-resolution-test.mjs` | PASS 17/17 |
| `node scripts/prediction-autonomous-sizing-test.mjs` | PASS 10/10 |
| `node scripts/prediction-shadow-entry-test.mjs` | PASS 15/15 (entry safety: shadow never inserts) |
| `node scripts/prediction-observability-test.mjs` | PASS 49/49 |
| `node scripts/prediction-engine-v2-test.mjs` | PASS 45/45 (includes existing weekly Touch) |
| `node scripts/prediction-demo-lifecycle-test.mjs` | PASS 21/21 (entry safety: actual handler Demo lifecycle) |
| `node scripts/prediction-v2-replay-regression-test.mjs` | PASS 9/9 |
| `node scripts/prediction-v2-i18n-test.mjs` | PASS 121/121 |
| `node scripts/prediction-ai-price-review-diagnostic-test.mjs` | PASS 19/19 |
| `node scripts/prediction-v2-outcome-collection-test.mjs` | PASS 27/27 |
| `node scripts/prediction-cross-month-touch-shadow-test.mjs` | **PASS 34/34 (new)** |
| `node --test scripts/prediction-demo-job-test.mjs` | PASS 7/7 (gated runner) |
| `tsc --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --types node --lib ES2022,DOM api/predictions.ts` | Exit 2 from **1 pre-existing error** (`TS2322`, `autonomousLearningTick` return type, line 3231; the same error is on `origin/main` at line 2964). **0 new errors.** |
| `esbuild api/predictions.ts --bundle --platform=node --format=esm --target=node22 --packages=external --sourcemap` (CI flags) | PASS (181,808-byte bundle; contains the new marker) |
| `npm run build` (web) | NOT APPLICABLE: no web or UI change |
| CI on GitHub (Node 22) | **SKIPPED / NOT RUN**: a feature-branch push does not trigger CI (`on: push: main/master`, `pull_request`), and no PR was opened |

## 11. Production Safety Verification (read-only SSH; no write)

Commands used: `readlink`, `ls /etc/signalverse/jobs.d`, `systemctl list-timers`, `grep -c` on the deployed bundle, and `psql` with `default_transaction_read_only=on` and `statement_timeout=5000` (SELECT only) on `signalverse_cutover2`.

| Check | Before (08:44:15Z) | After (08:50:41Z) |
|---|---|---|
| Running release | `/opt/signalverse/app -> releases/3e92cab…` | same |
| New marker in the deployed `predictions.mjs` | 0 (the 9C marker is present: 1) | 0 |
| Prediction gates | discovery, **enter (ON since Sep 30 20:47)**, resolve, shadow-entry | same |
| Prediction learn gate | none (the only `learn`-named gate is `learning-extract-cron`, which is not Prediction) | none |
| Prediction settings | `prediction_autonomous_demo_capital=1000`, `prediction_autonomous_max_trade_usdc=100`; no Real flags (default OFF) | same |
| REAL `prediction_trades` | 0 | 0 |
| Learn runs in the last 7 days | — | 0 |
| Latest `entry_shadow` / `entry_real` run | — | 08:47:37Z / 08:47:47Z (normal cadence) |
| Timers | existing `signalverse-*` timers only | unchanged |

No deployment, restart, VPS state change, migration, scheduler, cron, or gate change was made.

## 12. Existing Behaviour Preservation

- `RESOLUTION_VERIFIED_TEMPLATES` is unchanged (the 4 ids are asserted).
- `classifyQuestion` is unchanged.
- `buildPriceModelGroup` gives deep-equal output for the supported weekly market after the extraction.
- `evaluateMarket` is unchanged.
- The shadow and real branches of `autonomousEntryTick` are unchanged except for the additive, `dryRun`-only call at the end.
- The 9C diagnostic is unchanged.
- With the switch on and off at the same clock time, `shadowDecisions`, `skipped` and `wouldHaveOpened` are deep-equal.
- The entry return shape is unchanged: `crossMonthTouchShadow` is absent from Enter ticks.
- All 22 existing Prediction CI steps still pass.

## 13. Known Limitations

1. **The rule source is read live** from Gamma (30-minute cache, at most 12 new reads per tick). Gamma returns `[]` for closed markets by default, which records `RULE_TEXT_UNAVAILABLE` and fails closed. Rule versions at past instants are not archived.
2. **No continuity certificate for window candles.** The window High comes from the existing fetcher, which has no candle-continuity or cadence certificate (a missing middle candle would not be detected). The supported weekly family has the same limitation. Not changed here.
3. **The shadow is deterministic only.** The AI reviewer is excluded, whereas production can add an AI review for top-10 recheck candidates. AI can only veto or nudge (H3/H4), never originate.
4. **No fresh revalidation.** The Kelly sign uses the captured best ask. `would_proceed_if_admitted` is an upper bound on production behaviour, not a guarantee.
5. **H8 depends on the previous Shadow run summary** (3–15 min). If that run is missing or failed, H8 is false, which is conservative.
6. **Outcome joins are deferred.** Shadow records live only in the run summaries, so `collectV2ShadowOutcomes` does not score them. Outcomes must be joined later by `condition_id` through the existing resolver or CLOB. That collector was not extended (out of scope).
7. **Cross-year weeks (Dec→Jan) are rejected.** The year semantics in the slug are unverified. "Dip to" (Low) markets are rejected, as in the existing weekly family.
8. **Pre-existing weakness in the supported family, reported separately and not fixed:** the existing `BINANCE_HIGH_ET_WEEK` admission tells full-window markets from creation-window markets only through the ±1h start-date floor. A later-created market whose start fell inside the first hour of the window would pass that heuristic while having creation-to-deadline semantics. The shadow contract closes this gap for its own family by also matching the exact rule text. Fixing the production family needs a separate, reviewed change.
9. **No CI run on Node 22 for this branch yet.** Local runs used Node 24.19. The new code uses only erasable TypeScript syntax already present in the file.
10. **Nothing is observed until deployment.** Production sees none of this until a separately approved exact-SHA release. The next cross-month weeks are **Oct 26–Nov 1, 2026** (169h DST week, tested) and **Nov 30–Dec 6, 2026**. Dec 28–Jan 3 is cross-year and will be rejected.

## 14. Touch Mathematical Assumption Note

- **Current Touch:** `P = 2·(1 − Φ(ln(K/S)/(σ√τ)))`. This is the reflection-principle first-passage probability for **zero log drift** (ν = 0).
- **Current terminal AT:** `P(S_T > K) = Φ((ln(S/K) − s²/2)/s)`. This is a **zero price drift** lognormal (ν = −σ²/2 in log space).
- **These are different assumptions.** Under a consistent zero-price-drift assumption, Touch would use the drift-aware formula `Φ((ντ − h)/(σ√τ)) + e^{2νh/σ²}·Φ((−ντ − h)/(σ√τ))` with ν = −σ²/2.
- **The cross-month family uses exactly the existing Touch model.** `priceModelProbabilityYes` is unchanged, with the same σ×1.0 and σ×1.5 band. Nothing about the mathematics was altered.
- **Does it block shadow admission? No.** The shadow is observation-only, and the same assumption is already approved for the supported weekly family. Consistency across families is preserved.
- **Phase 9C research item (not implemented):** reconcile the drift assumption between Touch and AT. Any change must be a separately reviewed model change, with known-case, monotonicity and numerical-stability tests, and must never be bundled with a template fix.

## 15. Range Issue Remains Untouched

`priceModelProbabilityYes`'s RANGE branch, `PRICE_BAND_SIGMA_MULTS`, and the H2 band logic are byte-identical to `3e92cab`; the diff touches none of them. The 2026-10-01 counterexample still stands: a band built only from the volatility endpoints can miss an interior probability maximum. That remains an open research item, with **no Range change in this task**.

## 16. Statistical Validation Status

Phase 9A statistical validation is **NOT complete**. The following gaps remain:

- at least 28 days, or 4 weekly cycles;
- at least 300 distinct chronology-certified resolved markets, and at least 100 per allowed type;
- at least 30 distinct resolved would-open markets;
- paired Brier and log-loss comparisons against the frozen market prior, with the registered 95% bootstrap bound;
- 10-bin ECE ≤ 0.03;
- would-open calibration and a fee-adjusted edge confidence interval;
- zero H1/H5 violations;
- ≤ 5% one-hour side flips;
- a complete audited reporter.

The shadow observations added here are not evidence of any of these. The six 2026-10-01 markets are two correlated price paths. **No profitability, model superiority, missing profitable trades, future Demo trades, improved PnL or improved win rate is claimed.** The NO-side historical opportunity remains **UNKNOWN**.

## 17. Exact Git SHA

- Base: `3e92cab7a36cc0021847b1f700b9b5a394c75b37` (`origin/main`, which is also the running production release).
- Commit: `5e7aac6077aa80e60a25725d14ad7a124fbc040f`. Branch: `codex/prediction-cross-month-touch-shadow-20261005`, pushed to origin with no PR and no merge.
- The isolated worktree is `tmp/prediction-cross-month-touch-20261005`.
- The main checkout (branch `codex/prediction-coverage-expansion-audit`, which has an uncommitted `HANDOFF.md` change from another session plus many untracked files) and every other worktree were **not touched**.

## 18. Changed Files

```text
 .github/workflows/production-ci.yml                |   1 +
 HANDOFF.md                                         |   6 +
 TRADING_STRATEGY.md                                |   2 +
 api/predictions.ts                                 | 273 ++++++++++-
 scripts/prediction-cross-month-touch-shadow-test.mjs | 529 +++++++++++++++++++++
 5 files changed, 808 insertions(+), 3 deletions(-)
```

The three removed lines are the old `buildPriceModelGroup` signature, the old `autonomousEntryTick` return type, and the old `dryRun` return object. All three were replaced by additive equivalents.

## 19. Deployment Status = NOT DEPLOYED

There was no artifact preparation, no VPS approval, no release workflow run and no restart. The deployed bundle has 0 occurrences of `CROSS_MONTH_WEEKLY_TOUCH_SHADOW_V1`.

## 20. Production DB Status = NOT MODIFIED

Only explicit read-only SELECTs were run (`default_transaction_read_only=on`). There was no migration and no schema change.

## 21. Real Trading = OFF

Prediction Real settings are absent, which means the default OFF. There are 0 REAL `prediction_trades` rows. The Real position actions remain architecturally 501. No order, signing or funds movement occurred.

## 22. Autonomous Learning = OFF

There is no Prediction learn gate or dispatcher, and there were 0 learn runs in the last 7 days. No Learning was activated.

Confirmations: **no Real Trading occurred, no Learning was activated, and Demo Entry could not be reached by the new family.** Demo Entry itself remains ON, exactly as before.

## 23. Recommended Next Step

1. **Owner decision on release.** If the owner wants observations, release `5e7aac6` (or a merge that keeps it intact) through the existing exact-SHA pipeline: CI on Node 22, artifact, owner VPS approval, release. Do this before **Oct 26, 2026**, so the Oct 26–Nov 1 cross-month week, including the 169h DST case, is observed in shadow. The kill switch stays available.
2. **Add an outcome join** for `crossMonthTouchShadow` records by `condition_id`, through the existing resolver. This would be a separate reviewed change, so the family can enter Phase 9A scoring with one frozen observation per market and event-cluster uncertainty.
3. **Treat Demo admission as a separate decision.** Any move to Demo must be a separately reviewed acceptance decision under the pre-registered Phase 9A criteria, never a response to a desire for trades or PnL.
4. **Open two separate research items:**
   - the Touch/AT drift-assumption consistency (Phase 9C item);
   - a window-candle continuity certificate plus exact-rule matching for the existing weekly family (§13 item 8).
