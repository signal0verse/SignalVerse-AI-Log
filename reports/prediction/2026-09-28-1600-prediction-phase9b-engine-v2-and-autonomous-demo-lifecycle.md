# Prediction Market — Phase 9B: Engine v2 Calibration + Autonomous Demo End-to-End

**Date:** 2026-09-28 (UTC)
**Repository:** `signal0verse/signalverse-main`
**Design implemented:** Phase 9A (`2026-09-28-1102-prediction-phase9a-engine-calibration-audit-and-fix-design.md`), root causes from Phase 9 (`2026-09-28-1020-prediction-phase9-zero-trades-and-losing-edge-audit.md`)
**Release:** `7e744911fe5081b96a1e8cbf6b68e43b97884251` (squash of PR #171), live since **2026-09-28T15:44:49Z**
**Entry state after this task:** Real Trading **OFF** · `prediction-enter-cron` **OFF** (no gate file, and the live runner has no branch for it) · no production Demo trade exists

---

## Status legend and overall status

| Label | Meaning in this report |
|---|---|
| **IMPLEMENTED** | Code exists on `main` |
| **TESTED** | Exercised by an automated test in the isolated environment (in-memory DB, stubbed network) and/or CI |
| **DEPLOYED** | Running in the Production release `7e74491` |
| **OBSERVED IN PRODUCTION** | Seen in real Production data or behaviour, read-only |
| **NOT YET VALIDATED** | Not proven — by tests, production data, or outcomes |
| **PASS** | Used only where a stated check actually ran and succeeded |

| Area | Implemented | Tested | Deployed | Observed in production |
|---|---|---|---|---|
| Engine v2 probability model | yes | yes (45 + 9 + updated suites) | yes | **yes** — 100 v2 shadow rows, 20 with a live price model |
| Base Rate / trend evidence removed | yes | yes | yes | **yes** — 0 v1 autonomous rows after deploy |
| Question classification + admissibility | yes | yes | yes | **yes** — 7 question types seen, reasons recorded |
| H1–H8 gates | yes | yes | yes | partially — H4, H6, EDGE/CONFIDENCE codes seen; H5/H8 not triggered in production yet |
| Demo lifecycle (open → mark → settle → history) | yes | yes (21 end-to-end) | yes | **NOT YET OBSERVED IN PRODUCTION** (entry is off; 0 trades) |
| Multi-user isolation / category filtering | yes (Phase 8) + v2 wiring | yes | yes | NOT YET OBSERVED IN PRODUCTION (no entries) |
| UI (v2 trace, positions, history, fa/en) | yes | yes (121 i18n checks) | yes (bundle verified) | served bundle verified; **not visually inspected in Telegram by me** |
| Profitability / calibration of v2 | — | — | — | **NOT YET VALIDATED** |

---

## 1. What changed in Engine v2

IMPLEMENTED · TESTED · DEPLOYED · OBSERVED IN PRODUCTION

All in `api/predictions.ts`; no other API file changed except a help-text string in `api/analyze.ts`.

- The probability starts from the **market's own de-vigged price** (`p0 = yesMid / (yesMid + noMid)`). Evidence only moves it by a bounded amount. v1 discarded the market whenever any evidence existed.
- **Base Rate** (`own-resolved-history`) and **crypto 30-day trend** (`binance-daily-klines:*`) evidence were **removed**, not down-weighted.
- There is a deterministic, fail-closed **question classifier**. Only four manually verified price templates can carry quantitative evidence.
- A **strike-aware crypto price model** (zero-drift lognormal, realized 30-day σ, reflection principle for "touch") replaces the strike-blind trend.
- The **AI is a bounded reviewer**. It needs a numeric probability, has a capped shift and a veto, and can never originate a trade.
- **Confidence** is redefined as `C = 100·V·A·R`, and **gates H1–H8** carry explicit reason codes.
- **Edge is measured against the executable price + taker fee per share**, not against the midpoint.
- "No admissible evidence" is `INSUFFICIENT_DATA`, never `AVOID`. `AVOID` is reserved for untradeable or `HIGH_RISK` markets. A non-positive edge is `NEUTRAL`. A positive edge that fails any rule is `WATCH`, listing **every** failing rule.
- `model_version = 'v2'` is written to the existing column. Question type, parameters, groups, posterior band, per-side reasons and price-model inputs are written to the existing `explanation` jsonb as one machine-readable `V2_META:` line, which the UI hides. **No migration.**
- Settlement UPDATEs are now guarded with `.eq('status','OPEN')` (idempotent under concurrent resolvers).

## 2. Old vs new probability architecture

| | v1 (Phase 1–9) | v2 (this release) |
|---|---|---|
| Starting point | fixed 50 % | de-vigged market price `p0` |
| Evidence form | `±1 × weight × reliability × 1.5` pushes | per group `Δg = clip(βg·(logit qg − logit p0), ±cg)`; one Δ per independent group |
| Output range | mechanically ≈ [7 %, 93 %] | any probability; `|L − L0| ≤ Σ cg` |
| No evidence | still 50 % | `p* = p0` (model = market) → `INSUFFICIENT_DATA` |
| Evidence equal to market | pushes away from 50 % | zero shift |
| Groups (constants, explicit, **never fit to outcomes**) | — | `PRICE_MODEL` β 0.5, c 1.5 · `AI_REVIEW` β 0.25, c 0.5 |
| Edge | model − mid, minus spread/slippage "friction" | `model − (walked-book exec price + feeRate·p·(1−p))`, with a band from the price-model uncertainty |
| Confidence | evidence-weight average + contradiction penalty | `100 · V(strongest supporting group) · A(agreement) · R(share of band edge ≥ min)`; V = 0.5 unvalidated / 0.8 shadow / 1.0 production |

The v1 combiner is retained, unused by the live engine, **only** so the replay can reconstruct old decisions exactly.

## 3. Base Rate handling

IMPLEMENTED · TESTED · DEPLOYED · OBSERVED IN PRODUCTION

- `computeBaseRateEvidence` and `computeCryptoTrendEvidence` were deleted. A structural test asserts that neither function nor either source string exists in the live source.
- Production bundle check: `own-resolved-history` occurs **0** times in `/opt/signalverse/app/.runtime/api/predictions.mjs`.
- Production data: after the deploy there are **0** new autonomous v1 rows and 100 v2 rows. None carries Base Rate or trend evidence (v2 evidence items have `group` ∈ {`PRICE_MODEL`, `AI_REVIEW`} only).
- Why it was removed rather than down-weighted: see Phase 9A §4 P2. It was pseudo-replicated (29 markets counted as 200 rows), polarity-blind, non-deterministic, and not a probability of the question.

## 4. Question classification

IMPLEMENTED · TESTED · DEPLOYED · OBSERVED IN PRODUCTION

`classifyQuestion(category, question, event_slug)` → `{type, params}`, deterministic; anything not positively recognised is `OTHER`.

Types:
- `CRYPTO_PRICE_AT` / `_TOUCH` / `_RANGE` / `CRYPTO_UP_DOWN` / `CRYPTO_EVENT`
- `SPORTS_MATCH` / `SPORTS_LINE`
- `COUNT_BRACKET` / `NUMERIC_BRACKET`
- `POLITICAL_EVENT` / `ECONOMIC_EVENT` / `OTHER`

Verified price templates. Rules were read manually from Polymarket's own market rules text on 2026-09-28, one live market per template. The slug coin must equal the question coin. **Binance is not assumed to be the resolution source** unless the template says so.

| Template | Slug pattern | Types | Rule (summary) |
|---|---|---|---|
| `BINANCE_CLOSE_NOON_ET_ABOVE` | `(bitcoin\|ethereum\|xrp)-above-on-<date>` | AT | Binance COIN/USDT 1m candle close at 12:00 ET > strike |
| `BINANCE_CLOSE_NOON_ET_BRACKETS` | `(bitcoin\|ethereum)-price-on-<date>` | RANGE, AT | same candle; boundary belongs to the higher bracket |
| `BINANCE_HIGH_ET_DAY` | `what-price-will-(bitcoin\|ethereum\|xrp)-hit-on-<date>` | TOUCH up, 1-day window | any 1m high ≥ strike in the ET day |
| `BINANCE_HIGH_ET_WEEK` | `what-price-will-(bitcoin\|ethereum)-hit-<m>-<d>-<d>-<y>` | TOUCH up, 7-day window | any 1m high ≥ strike in the ET week |

Routing:
- Only verified price templates reach the price model.
- Sports, politics, economics, crypto events, up/down, count and numeric brackets, and long-horizon "hit/dip … by <date>" markets get `NO_VALIDATED_SOURCE_FOR_<TYPE>` or `PRICE_TEMPLATE_NOT_VERIFIED` → `INSUFFICIENT_DATA`.
- A market's category never overrides admissibility.
- A user's category preference only filters which users may enter.

Production, first two v2 shadow ticks (100 rows):

| Type | Rows |
|---|---|
| `POLITICAL_EVENT` | 30 |
| `CRYPTO_PRICE_TOUCH` | 24 (all long-horizon → `PRICE_TEMPLATE_NOT_VERIFIED`) |
| `CRYPTO_PRICE_AT` | 16 |
| `CRYPTO_EVENT` | 12 |
| `OTHER` | 10 |
| `SPORTS_MATCH` | 4 |
| `CRYPTO_PRICE_RANGE` | 4 |

## 5. Crypto price model

IMPLEMENTED · TESTED · DEPLOYED · OBSERVED IN PRODUCTION (20 rows)

- **Data:** Binance public klines (`data-api.binance.vision`). Spot = last *closed* 1m candle (≤ 2 min old). σ = sample std-dev of log returns of the last ≤ 31 *closed* daily candles (≥ 25 required). Touch templates also take the observed window high from closed 1h candles plus the partial-hour 1m candles.
- **Formulas:**
  - AT above: `Φ((ln(S/K) − s²/2)/s)`, with `s = σ·√τ`; below = 1 − above.
  - RANGE = `P(above lo) − P(above hi)`.
  - TOUCH-up: `min(1, 2·(1 − Φ(ln(K/S)/s)))`, and 1 once S ≥ K.
  - The uncertainty band re-evaluates with σ×1.0 and σ×1.5.
- **Admissibility (fail closed, each a named reason):**
  - `PRICE_TEMPLATE_NOT_VERIFIED`, `PRICE_DIRECTION_NOT_VERIFIED`, `PRICE_END_DATE_INVALID`, `OUTSIDE_TIME_HORIZON` (24 h–7 d), `PRICE_WINDOW_UNVERIFIED` (start_date must match end − window ± 1 h), `PRICE_DATA_UNAVAILABLE`, `PRICE_DATA_STALE`, `PRICE_HISTORY_INSUFFICIENT`, `PRICE_ALREADY_TOUCHED`, `PRICE_MODEL_UNDEFINED`.
  - A market already decided by its own rule is never modelled.
- **Monotonicity:** P(above K) is non-increasing in K, and touch-up likewise (tested over a strike sweep); the brackets partition to 1.
- **Production:** 20 v2 rows used the live price model. Examples (verbatim from stored `V2_META`, 2026-09-28 ≈15:46–15:51Z, BTC spot 83,314, 30-day σ 2.15 %/day):

| Market | p0 | model q | posterior | decision |
|---|---|---|---|---|
| BTC between $74k–$76k on Oct 2 | 1.4 % | 1.4 % | 2.3 % | NEUTRAL (NO side, no positive edge) |
| BTC between $76k–$78k on Oct 2 | 3.3 % | 4.8 % | 6.4 % | NEUTRAL |
| BTC above $80k on Sep 29 | 97.8 % | 96.9 % | 95.8 % | NEUTRAL |
| ETH above $2,300 on Sep 30 (spot 2,677.78, σ 2.33 %) | 99.5 % | 100 % | 99.6 % | NEUTRAL |
| BTC above $78k on Sep 29 | 99.45 % | 99.9 % | — | WATCH: `EDGE_BELOW_MIN`, `H4_AI_VETO`, `H6_TAIL_UNSAFE`, `CONFIDENCE_BELOW_MIN` |

The market prices of these liquid BTC/ETH ladders were close to the strike-aware model, the same finding as the Phase 9A worked examples. This is **one hour of data**, not a calibration result.

## 6. AI reviewer behaviour

IMPLEMENTED · TESTED · DEPLOYED · OBSERVED IN PRODUCTION

- Uses only the existing **free** AI chain (Groq → Gemini → OpenRouter → custom free). No paid provider was added; the structural test for that still passes.
- The AI's numeric `probabilityYes` is required. A non-numeric answer is discarded (tested).
- Bounded: β 0.25, cap ±0.5 logit. A 99 % AI view moves a 50 % market to at most 62.2 % (tested).
- **Cannot originate a trade:** without a supporting `PRICE_MODEL` shift the side fails H3. A 95 % AI view on a 20 % politics market with a clear resolution source stays `WATCH [H3_NO_INDEPENDENT_CONFIRMATION]` (tested).
- **Veto (H4):** YES is vetoed if AI < p0 − 5 pp; NO is vetoed if AI > p0 + 5 pp (tested; seen once in production).
- **Production finding (not acted on; no parameter was tuned after seeing it):** the free AI has no live market data. On BTC/ETH price questions where spot price, model and market all put YES near 96–100 %, it returned **12–35 %**. Consequences:
  - it nudges posteriors by up to its 0.5-logit cap in the wrong direction;
  - it can veto correct price-model trades.

  It cannot create a trade by itself, so the failure mode is *conservative* (missed trades), not losses. A recommendation is in §24.

## 7. H1–H8

IMPLEMENTED · TESTED · DEPLOYED · partially OBSERVED IN PRODUCTION

| Gate | Rule | Tested | Seen in production (first 2 ticks) |
|---|---|---|---|
| H1 `H1_EVIDENCE_BUDGET` | `|L − L0| ≤ Σ caps` | yes | no (cannot fire by construction; kept as a bug detector) |
| H2 `H2_NOT_ROBUST` | edge ≥ min at both ends of the band | yes | no |
| H3 `H3_NO_INDEPENDENT_CONFIRMATION` | a `PRICE_MODEL` shift must support the side | yes | no |
| H4 `H4_AI_VETO` | AI ≥ 5 pp against the side | yes | **yes** (1) |
| H5 `H5_LADDER_INCOHERENT` | posteriors monotone in strike per event/template/direction; any violation removes the whole ladder | yes (pure + inside the real entry tick) | no (ladders coherent) |
| H6 `H6_TAIL_UNSAFE` | exec < 0.10 needs pLow ≥ 1.5·exec; exec > 0.90 needs (1 − pLow) ≤ (1 − exec)/1.5 | yes | **yes** (1) |
| H7 `H7_RESOLUTION_RISK` | `HIGH_RISK` → AVOID; `UNCLEAR` doubles the min edge | yes | no |
| H8 `H8_NOT_STABLE` | the previous autonomous v2 tick (3–15 min earlier) must have been actionable on the same side | yes (DB-backed, 8 cases + end-to-end tick 1 → tick 2) | not reached (nothing actionable) |

Other codes: `INSUFFICIENT_MARKET_DATA`, `MARKET_PRIOR_UNAVAILABLE`, `NO_ADMISSIBLE_EVIDENCE`, `MARKET_UNTRADEABLE`, `NO_POSITIVE_EDGE`, `EDGE_BELOW_MIN`, `CONFIDENCE_BELOW_MIN`.

The shadow tick's `skipped` summary now counts `REASON_<code>`. Production tick at 15:51Z:
- `NOT_ACTIONABLE` 50
- `REASON_NO_ADMISSIBLE_EVIDENCE` 27
- `REASON_INSUFFICIENT_MARKET_DATA` 14
- `REASON_NO_POSITIVE_EDGE` 8
- `REASON_H4_AI_VETO` 1, `REASON_H6_TAIL_UNSAFE` 1, `REASON_EDGE_BELOW_MIN` 1, `REASON_CONFIDENCE_BELOW_MIN` 1

## 8. Historical replay results

TESTED (read-only on production data) · PASS for the stated checks

Tool: `scripts/prediction-v2-replay.mjs`.
- Production access is **SELECT-only**, enforced by a fetch guard that throws on any non-GET/HEAD.
- Order books come from the stored YES bid/ask; live Binance public klines are used as of each decision time.
- It runs the **real** `evaluateMarket` at the original timestamp.

Approximations:
- the NO book is the complement of the YES book;
- book depth is a fixed 5,000 shares (it affects quality/tradeability, not p0/p*);
- the AI reviewer is excluded, since it can't be reproduced as of a past time.

| Set | Count | v1 reconstructed exactly | v2 actionable |
|---|---|---|---|
| Would-open markets (Phase 9) | 6 | 6/6 | **0** |
| Their ladder siblings | 5 | 5/5 | 0 |
| All markets v1 ever rated OPPORTUNITY/STRONG (autonomous + manual; 42 autonomous-only) | 53 | all with stored evidence | **0** |
| **Total rows replayed** | 58 | **58/58, 0 mismatches** | **0** |

The six would-open cases:

| Market (decision time, UTC) | v1 (stored) | v2 |
|---|---|---|
| BTC above $72k Sep 18 (09-15 22:47) | OPPORTUNITY NO, model 74.1 % vs mkt 90.0 % | p0 90.0 %, q 88.4 %, post 89.2 % → NEUTRAL |
| BTC reach $92k Sep 21–27 (09-21 12:31) | OPPORTUNITY YES, 79.5 % vs 13.1 % | p0 13.1 %, q 11.5 %, post 12.3 % → NEUTRAL |
| BTC reach $94k Sep 21–27 (09-21 12:36) | OPPORTUNITY YES, 80.1 % vs 8.0 % | p0 8.0 %, q 5.2 %, post 6.4 % → WATCH (edge < min) |
| ETH reach $3,200 Sep 21–27 (09-21 21:46) | OPPORTUNITY YES, 81.9 % vs 6.4 % | p0 6.4 %, q 1.6 %, post 3.3 % → WATCH (edge < min, NO side) |
| Bitget resume withdrawals by Sep 27 (09-26 05:07) | OPPORTUNITY YES, 74.1 % vs 8.0 % | CRYPTO_EVENT → INSUFFICIENT_DATA |
| Bitget resume withdrawals by Sep 30 (09-26 05:11) | OPPORTUNITY NO, 80.4 % vs 94.0 % | CRYPTO_EVENT → INSUFFICIENT_DATA |

The 47 other OPPORTUNITY-only markets under v2 break down as:
- AT: 11 NEUTRAL, 10 WATCH
- TOUCH: 15 INSUFFICIENT_DATA (long-horizon, template not verified), 1 NEUTRAL, 4 WATCH
- CRYPTO_EVENT: 2 INSUFFICIENT_DATA
- 4 skipped (no stored book / market row)

Every stored v1 decision here was driven by the removed evidence: all include `own-resolved-history`. In the ETH $3,200 case the AI had correctly said "unlikely" (−1) and was outvoted by the two removed items.

Outcomes appear in the tool output **for context only**. They are not inputs, and no parameter was chosen from them.

The count differs from Phase 9's "29 OPPORTUNITY markets": rows kept accumulating after that audit, and this count includes manual scans (42 are autonomous-only).

The regression fixture (11 cases, Binance responses frozen, outcomes omitted) is `scripts/fixtures/prediction-v2-replay-fixture.json`. It is re-run offline by `prediction-v2-replay-regression-test.mjs` (9/9 in CI).

`decide()` was changed after the replay to report every WATCH reason rather than only the first. Decisions are unchanged: the deterministic replay test re-derives the same decision and side for all 11 cases with the final code.

## 9. No-look-ahead verification

TESTED · OBSERVED IN PRODUCTION · PASS

- **Code:** kline requests end at `floor(asOf/60 s)·60 s − 1` ms. Every candle is additionally filtered with `closeTime < asOf`. The in-progress daily candle is always dropped. `maxCloseTimeUsed` is recorded in `V2_META`.
- **Tests:**
  - a "leaky" stub API that appends future candles at a 50 % different price changes nothing (spot, σ within 0.002, window high);
  - all 11 replay cases have `maxCloseTimeUsed < decision ts` and spot ≤ 2 min old;
  - the replay tool found 0 violations over 58 rows.
- **Production:** all 20 live price-model rows have `maxCloseTimeUsed < asOfMs` (**0 violations**) and spot age ≤ 2 min (**0 stale**).

## 10. Demo account implementation

IMPLEMENTED (Phase 8, unchanged schema) · TESTED · DEPLOYED · NOT YET OBSERVED IN PRODUCTION with an entry

- Per-user accounts live in `prediction_autonomous_user_accounts`: capital, max trade, categories, `autonomous_enabled`. The server-verified session is the only identity; a client-supplied id is ignored (tested).
- Sizing chain: `min(Kelly(conservative 0.1×, cap 2 %) on the user's own capital, the user's max trade, the user's available capital)`. There is no hardcoded $1,000/$15 in sizing; those are only the admin default template for users who never saved settings.
- Production (read-only): 2 accounts, both `autonomous_enabled = true` (allowed: the user-level setting may remain ON). `prediction_real_enabled` is not set, so it defaults to OFF.

## 11. Demo entry lifecycle

IMPLEMENTED · TESTED end-to-end · DEPLOYED · **NOT YET OBSERVED IN PRODUCTION**

`scripts/prediction-demo-lifecycle-test.mjs` drives the **real handler** through the same cron actions the VPS runner uses (`autonomous-enter`, `autonomous-resolve`) and the same user actions the app uses. It runs in the isolated environment, with no production contact.

Fixture:
- Markets: 2 verified crypto price markets, 1 sports, 1 politics.
- Users:
  - A: $1,000 / $100 / crypto
  - B: $1,000 / $100 / sports
  - C: $2,000 / $10 / all
  - D: opted out
  - E: $995 already committed

Checks:
- **Tick 1:** 4 v2 shadow rows, 0 opened, `H8_NOT_STABLE` = 2, sports/politics `REASON_NO_ADMISSIBLE_EVIDENCE` = 2, run recorded as a successful `entry_real`.
- **Tick 2 (+5 min):** 5 DEMO positions open: A×2, C×2, E×1 (then `INSUFFICIENT_AVAILABLE_CAPITAL`). B (sports only) gets 0 and D (opted out) gets 0. There is a fresh Gamma revalidation before entry.
- **Each row:** own `telegram_id`, side from the v2 decision (BTC YES, ETH NO), `prediction_id` linked to the actionable v2 row, entry = walked-book ask, real taker fee, status OPEN, `opened_at`; market set to MONITORING.

## 12. Unrealized PnL

IMPLEMENTED · TESTED · DEPLOYED · NOT YET OBSERVED IN PRODUCTION

- The mark is the held side's **own** order-book midpoint; a NO position is marked from the NO book, not 1 − YES (tested).
- `unrealized = shares·(mark − entry) − entry fee`, plus `%` of size. Tested with exact figures after YES rallied 0.20 → 0.30.
- If the book is unreachable: `current_price = null`, `price_unavailable = true`, PnL null. The account snapshot excludes it from equity and reports `unrealizedPnlPositionsWithUnknownPrice = 1`. **Never fabricated** (tested).
- Account while OPEN: committed / available (`capital + realized − committed`) / equity (`capital + realized + unrealized`), each per user (tested).

## 13. Resolution and settlement

IMPLEMENTED · TESTED · DEPLOYED · resolution tick OBSERVED IN PRODUCTION (no trades to settle)

- Settlement uses the CLOB `markets/<condition_id>` winner token (Phase 4 design). "Not yet closed" leaves the market untouched (tested).
- **Idempotent:** two resolution ticks run concurrently settle each of the 5 trades exactly once, and a third tick leaves every closed row byte-identical (tested). This is enforced by the new `.eq('status','OPEN')` guard on both settlement UPDATEs.
- **Production:** `resolve` runs every 5 min and succeeded on both ticks after deploy; there were 0 trades to settle.

## 14. Realized PnL

IMPLEMENTED · TESTED · DEPLOYED · NOT YET OBSERVED IN PRODUCTION

- Win (BTC, YES resolved YES): `close 1`, `gross = shares·(1 − entry)`, `net = gross − fee`.
- Loss (ETH NO position, market resolved YES): `close 0`, `net = −size − fee` (tested exactly).
- After settlement, per user: realized = Σ own net PnL; committed 0; available = equity = capital + realized; B stays at exactly $1,000; E still shows $995 committed on an unrelated position (tested).
- **No production PnL exists.** None is reported here.

## 15. Trade History

IMPLEMENTED · TESTED · DEPLOYED · NOT YET OBSERVED IN PRODUCTION

`autonomous-positions?status=closed` returns, per row:
- market, category, side
- entry, exit, size
- gross PnL, fees, net PnL, net %
- win/loss
- `opened_at`, `closed_at`
- settlement outcome, exit reason
- `model_version` (via the `prediction_id` join)

All fields are asserted non-null for settled rows (tested).

**Production schema check:** the exact select strings used by the deployed open-positions, closed-history, resolution and H8 queries (including the `prediction_predictions(model_version)` embed) all executed against the production PostgREST schema without error, read-only.

## 16. Multi-user isolation

TESTED · DEPLOYED · NOT YET OBSERVED IN PRODUCTION

- Separate capital, sizes and PnL per user.
- A and C hold the same markets independently with different sizes and different realized PnL.
- B's snapshot and history are unaffected.
- B requesting `?telegramId=<A>` still sees only B.
- Duplicate protection is per (user, market): the app check finds OPEN rows (`DUPLICATE_POSITION` ≥ 5 on re-discovery), and the DB partial unique index returns `23505` (tested at DB level in the in-memory store).

## 17. Category filtering

TESTED · DEPLOYED · NOT YET OBSERVED IN PRODUCTION

- Backend-enforced (`userMatchesCategory` on the market's stored category): the crypto-only and `all` users entered crypto markets; the sports-only user got nothing.
- Under v2, sports markets are never actionable (no validated source), so a **sports-only user will not receive Demo trades at all** until a validated sports source exists. This is expected, not a bug.

## 18. Test counts

TESTED · PASS

Full prediction suite, local (Node 24.19.0): **24 files, 655 checks, 0 failures.** Before Phase 9B the suite was 21 files / 409 checks.

New files:

| File | Checks |
|---|---|
| `prediction-engine-v2-test.mjs` | 45 |
| `prediction-demo-lifecycle-test.mjs` | 21 |
| `prediction-v2-replay-regression-test.mjs` | 9 |
| `prediction-v2-i18n-test.mjs` | 121 (runs App.tsx's real translators on real v2 engine output) |

Updated (with inline explanations, nothing deleted):

| File | Checks | What changed |
|---|---|---|
| `prediction-market-engine-test.mjs` | 48 | v1 edge mirror → v2 exec+fee edge; v1 combiner kept as replay-only; Base-Rate guard → "removed" structural check; AVOID-on-netEV → NEUTRAL |
| `prediction-side-aware-test.mjs` | 19 | now imports the real `evaluateSide` with the v2 context instead of slicing the removed `computeEdge` |
| `prediction-observability-test.mjs` | 49 | v2 `decide()` signature; v2 rows traced from stored reasons, v1 rows keep v1 re-derivation |

Also added:
- `scripts/lib/prediction-isolated-env.mjs`: reuses the repo's `postgrest-memory.mjs` unchanged, plus a controllable clock and stubbed CLOB/Gamma/Binance/AI; every other request throws.
- An `isolation: no request left the test environment` check in each new file.

Not run: `prediction-market-position-credit-test.mjs`. It writes to the real database via `.env.backup.local` and is not in CI.

Local gate simulation for the prepared runner: 7/7 (§22).

## 19. Build/CI result

TESTED · PASS

- `npm run build` passes (web + admin).
- API bundle (esbuild) passes.
- Standalone typecheck of `api/predictions.ts`: **9 errors, identical to `origin/main`** (pre-existing non-strict narrowing on `creditCheck.balance/required` and `revalidation.reason`), **0 new**.
- `production-ci.yml`: the four new test files were added to the existing prediction step.
- PR #171 CI run `36443323504`: **success** on Node **22.23.2**. The logs show 45/45, 21/21, 9/9 (TAP) and 121/121, plus all previous prediction files.
- `main` push CI run `36444383478` for `7e74491`: **success**.
- Scope check of the merged diff: only prediction files, `App.tsx` (hunks only inside Prediction components), the CI list, `TRADING_STRATEGY.md` (strategy-chain entry) and one help string in `api/analyze.ts`. No Futures / Spot / Fast Trader / Supervisor / wallet / signing / real-execution file, and no migration.

## 20. Deployment commit/release

DEPLOYED · PASS

The controlled release chain was followed exactly; nothing was bypassed.

| Step | Identifier |
|---|---|
| Branch commits | `9c18f8a` (engine/tests), `7bbf991` (CI list, strategy chain, help text) |
| PR | #171, squash-merged; merged tree byte-identical to `7bbf991` |
| `main` SHA | `7e744911fe5081b96a1e8cbf6b68e43b97884251` |
| Artifact preparation run | `36444781497` (prepare only) |
| Artifact ID | `10981045040` (4,025,644-byte inner archive) |
| Inner `release.tar.gz` SHA-256 | `14e76e2589f5eb125536bd5e7106cdab7381fa94805fcf13b7aae9f52580c87b` |
| Independent verification | `scripts/release-artifact.mjs source` + `verify` passed; 585/585 archive files equal the git tree; key files hash-equal |
| Approval | issued **by the owner** on the VPS (`approvals/<sha>.json`, id `0865d198-4eb7-4250-86a1-e9a1bf73f67c`, expiry 16:41:51Z) with an owner-run helper that re-checked it with the installed `inspectApproval` |
| Release run | `36445603401`: `accepted` 15:43:10Z, **`deployed` 15:44:49Z** |
| Runtime | `/opt/signalverse/app → /opt/signalverse/releases/7e74491…`; approval consumed exactly once (claims 0, consumed 1) |
| Previous release (retained) | `5eb6094658a692ba32687fccaa9759d20b68d6b5` |

## 21. Production verification

OBSERVED IN PRODUCTION (read-only)

All checks were read-only: SSH `ls/readlink/grep/sha256sum`, PostgREST SELECT through a GET-only guard, and public HTTPS GETs plus unauthenticated POSTs that are rejected before any work.

| Check | Result |
|---|---|
| Runtime release | `7e74491…` |
| Running bundle markers | `V2_META:` ✓, `classifyQuestion` ✓, `combineMarketAnchored` ✓, `BINANCE_HIGH_ET_WEEK` ✓, `H8_NOT_STABLE` ✓, `own-resolved-history` **absent** |
| Served frontend (`/assets/index-CP3QAgJg.js`) | contains the v2 UI strings (`V2_META:` filter, `Engine v2`, `NO_VALIDATED_SOURCE_FOR_`, price-unavailable text) |
| Services | `signalverse`, `postgrest`, `deploy-receiver`, `admin`, `observer`, worker units: active/running |
| Shadow ticks after deploy (to 15:53Z) | `entry_shadow` 2/2 success, `discover` 2/2, `resolve` 2/2, **0 run errors** |
| New prediction rows | **100 v2**, 0 v1 autonomous |
| v2 decisions | INSUFFICIENT_DATA 82 · NEUTRAL 17 · WATCH 1 · OPPORTUNITY 0 · `would_open` 0 |
| INSUFFICIENT_MARKET_DATA rows | 28 (no usable order book / quality < 25 — same first rule as v1) |
| Price-model rows | 20; look-ahead violations 0; stale spot 0 |
| Autonomous trades | **0 total, 0 open, 0 closed**; 0 since deploy; `entry_real` has **never** run |
| Deployed query shapes vs production schema | open positions ✓, closed history ✓, resolution ✓, H8 ✓ |
| Endpoint auth (public) | `autonomous-positions/account/status` → 401; POST `autonomous-enter` / `-enter-shadow` / `-resolve` without auth → 401; with a wrong secret → 401; `mode=real` without auth → 401. `mode=real` with a session → 501 is covered by the test (§11); not exercised in production |
| Storage | v2 row explanation+evidence ≈ 1,034 B vs v1 ≈ 936 B |

**The Demo lifecycle is NOT YET OBSERVED IN PRODUCTION.** No production Demo position was created, marked, settled or shown, because entry is intentionally off. Production readiness for it rests on: the tests, the schema-shape checks, the auth checks and the served UI bundle.

Not done, deliberately: calling authenticated user endpoints in production. That would require minting a session token with the production bot secret for a synthetic user.

## 22. What remains OFF

OBSERVED IN PRODUCTION

- **Real Trading OFF:**
  - `prediction_real_enabled` is not set (defaults to false);
  - `mode=real` returns 501;
  - there is no Real Polymarket order path, wallet signing, private-key handling or blockchain transaction in the code.
- **`prediction-enter-cron` OFF**, in two independent ways:
  - no `/etc/signalverse/jobs.d/prediction-enter-cron.enabled` (13 gate files, the same as before the deploy);
  - the **live runner has no branch for it at all**: `/usr/local/libexec/signalverse-jobs`, SHA-256 `b4d38951…c18356`, unchanged.
- **`entry_real` has never run** (`prediction_autonomous_runs` has no `entry_real` row).
- `autonomous-learn` is not wired.
- **Prepared, NOT installed:** a copy of the live runner with exactly one added `prediction-enter-cron` branch (local only, SHA-256 `d72fcca7…378a5`). It passes `bash -n` and a local simulation (stub server + temp gate dir), 7/7:
  - absent gate → no call;
  - present gate → exactly one `POST /api/predictions?action=autonomous-enter` with `Bearer CRON_SECRET` and the production Host header;
  - other gates independent;
  - missing secret → skip;
  - 401 → exit 1, no retry.

  The API side was also checked: `autonomous-enter` rejects missing, wrong and user-session credentials (tested, and 401 observed in production) and opens Demo rows only.
- **ON (unchanged, allowed):** `prediction-discovery-cron`, `prediction-shadow-entry-cron`, `prediction-resolve-cron`; the 2 users' "My Autonomous Participation" settings.

## 23. What is NOT yet validated

NOT YET VALIDATED

1. **Whether v2 finds any real edge.** In the replay and in the first production hour it found none: 0 actionable. It is shown to stop the v1 losing pattern; it is not shown to make money.
2. **Calibration of v2 posteriors.** It needs resolved v2 shadow rows under the pre-registered Phase 9A §10 criteria: ≥ 28 days, ≥ 300 distinct resolved markets, ≥ 30 resolved would-open markets, paired Brier/log-loss vs market, ECE ≤ 0.03, positive realized edge after fees, and the other criteria in that table. None of these are met yet (1 hour of data).
3. **The Demo lifecycle in production** (open → mark → settle → history → UI) — NOT YET OBSERVED IN PRODUCTION.
4. **The UI in the Telegram app**: verified by source tests and the served bundle only; I did not visually inspect it.
5. **Authenticated production endpoints** — not exercised (see §21).
6. **The verified-template rules** were each confirmed from one live market's rules text. A rule change by Polymarket is not detected automatically, other than by the slug pattern no longer matching (which fails closed).
7. **Replay approximations**: NO book = complement of YES; synthetic depth; AI excluded.
8. **Validation levels** are all `unvalidated` (V = 0.5). STRONG_OPPORTUNITY (C ≥ 70) is unreachable until a source is promoted by evidence.
9. **H5/H8 have not fired in production yet**; they are verified only in tests.
10. **The prepared runner branch** was not run on the VPS.

## 24. Risks

- **The Demo may stay at zero trades for a long time.** That is the correct abstention while no validated edge exists, but it can look like "nothing works". Sports / politics / economics / crypto-event users will see only abstentions.
- **The AI reviewer is uninformed on price questions** (observed 12–35 % where market and model say ~99 %). Its bounded shift biases posteriors, and H4 can veto valid price-model trades. Recommendation for a later, separately approved phase — **not done here, and not tuned on outcomes**: either give the reviewer the spot/strike/horizon inputs in its prompt, or exclude `AI_REVIEW` for `PRICE_QUESTION_TYPES`; decide before any entry is enabled.
- **Template drift:** if Polymarket changes its slugs or rules, the price model silently stops being admissible. This is safe (abstains) but reduces coverage. Rules are not re-verified automatically.
- **Binance availability from the VPS:** it worked (20 rows). An outage yields `PRICE_DATA_UNAVAILABLE` (abstain), never a fabricated price.
- **Help text** (`HELP_ASSISTANT_APP_DESCRIPTION`) now tells users that abstaining is expected. If entry is later enabled, the text must be revisited.
- **Operational:** `prediction-enter-cron` is inert until the runner is updated; enabling entry is therefore a two-step owner action (install the runner, then the gate file).

## 25. Rollback procedure

No database migration was made. v2 rows are additive (`model_version = 'v2'`), and v1 code reads them without error, so **no data rollback is needed** in any option below. One cosmetic effect: the v1 UI does not hide the machine-readable `V2_META:` line, so after a rollback it would appear as raw text in those rows' explanations.

1. **Preferred (controlled):**
   1. `git revert 7e744911fe5081b96a1e8cbf6b68e43b97884251` on `main`.
   2. Wait for `main` push CI to succeed.
   3. Dispatch *Production Release Artifact (prepare only)* for the revert SHA.
   4. Download the artifact and verify it (`scripts/release-artifact.mjs source/verify`).
   5. The owner issues a new approval for that SHA and digest.
   6. Dispatch *Production Release* with the new coordinates.
2. **Emergency, owner-only, on the VPS:** the previous release `/opt/signalverse/releases/5eb6094658a692ba32687fccaa9759d20b68d6b5` is retained. The owner can atomically repoint `/opt/signalverse/app` to it and restart `signalverse.service` — the same symlink swap the coordinator's own `rollback()` performs — then update `/var/lib/signalverse-deploy/deployed-sha`. This bypasses the approval chain and is for incidents only.
3. **Mitigation without any code change:** removing `/etc/signalverse/jobs.d/prediction-shadow-entry-cron.enabled` stops v2 shadow evaluation. Entry is already off, so v2 currently has no path to create any trade.

---

```text
ENGINE_V2                         = IMPLEMENTED, TESTED, DEPLOYED (7e744911fe5081b96a1e8cbf6b68e43b97884251)
V2_SHADOW_IN_PRODUCTION           = OBSERVED (100 v2 rows, 2 successful ticks, 0 errors)
BASE_RATE_AND_TREND_EVIDENCE      = REMOVED (observed: 0 v1 autonomous rows after deploy)
NO_LOOK_AHEAD                     = PASS (tests, 58-row replay, 20 production rows)
REPLAY_V1_RECONSTRUCTION          = 58/58 EXACT
REPLAY_V2_ACTIONABLE              = 0/58 (6/6 would-open cases abstain)
DEMO_LIFECYCLE                    = TESTED END-TO-END (isolated) — NOT YET OBSERVED IN PRODUCTION
PRODUCTION_DEMO_TRADES            = 0 (none created; none claimed)
TEST_SUITE                        = 24 files / 655 checks PASS locally; PR + main CI success (Node 22.23.2)
MIGRATION                         = NONE
REAL_TRADING                      = OFF
PREDICTION_ENTER_CRON             = OFF (no gate file; live runner has no branch; prepared copy NOT installed)
PROFITABILITY / CALIBRATION       = NOT YET VALIDATED
```
