# Prediction Market — Phase 3 Design Audit: Market Lifecycle & Resolution Pipeline

## Metadata

- Date: 2026-09-15
- Task ID: prediction-phase3-lifecycle-resolution-design-audit-2026-09-15
- Module: prediction
- Mode: **DESIGN / ARCHITECTURE AUDIT ONLY** — no code, config, threshold, gate, scheduler, or database change of any kind. Nothing in this report was implemented. No trade of any kind (demo or real) was created or enabled.
- Builds on, and does not re-litigate: [`2026-09-14-1157-...one-week-production-analysis.md`](./2026-09-14-1157-prediction-one-week-production-analysis.md) (Phase 1 forensic audit) and [`2026-09-14-1228-...resolution-orderbook-diagnostic.md`](./2026-09-14-1228-prediction-resolution-orderbook-diagnostic.md) (Phase 2 read-only diagnostics), both read in full before this task began.
- Method: static source analysis of `api/predictions.ts` and `migrations/prediction_market_*.sql` (exact line numbers cited throughout), plus one additional live, read-only Polymarket check (documented in Part B) needed to resolve an open question Phase 2 did not test. No production database was written to; no new production reads were needed beyond what Phase 1/2 already gathered.

---

## 1. Executive Conclusion

The two prior reports establish two independent, confirmed defects. This design audit adds a **third, previously-undetected defect** in the resolution pipeline (Part B, Bug 2) that would silently block sports-market resolution even after Phase 2's endpoint fix — found only by tracing the *full* mapping from CLOB response to `resolved_outcome`, as this task's brief required, rather than stopping at "switch the endpoint."

The recommended architecture is **not** a single status-flag choice or a single endpoint swap. It is a **small number of narrowly-scoped, additive changes**, each independently testable and independently revertible, in this order: (1) stop new closed markets from entering the pool and opportunistically clean the existing 78.8% backlog using data the code already fetches — zero new network calls; (2) fix *both* resolution bugs (endpoint **and** token-mapping) in the same pass, because fixing only the endpoint would appear to work for crypto/politics while continuing to silently fail for sports; (3) keep Base Rate Evidence **structurally gated off** for heterogeneous, non-Yes/No-labeled categories even after resolution is fixed, because this audit finds the evidence formula itself would manufacture unjustified confidence for sports specifically, independent of the lifecycle/resolution fixes. None of this is implemented here.

---

## 2. Confirmed Root Causes From the Two Forensic Reports (restated for traceability, not re-derived)

From Phase 1: zero `OPPORTUNITY`/`STRONG_OPPORTUNITY` across 67,760 evaluations; `resolve`/`learn` never scheduled (0 rows in `prediction_autonomous_runs`); `computeBaseRateEvidence()` therefore permanently null; sports 88.2% `INSUFFICIENT_DATA`.

From Phase 2: the Gamma `condition_ids` settlement lookup finds 0/196 already-closed markets (100% failure specifically on closed markets, 100% success on open ones); the CLOB `/markets/<condition_id>` endpoint finds 196/196; 132/132 sampled sports `INSUFFICIENT_DATA` markets are closed on Polymarket right now, and 104/132 (78.8%) are still `candidate_status='ELIGIBLE'` in production; Discovery's own `/events` response already carries `closed`/`acceptingOrders` per sub-market but `normalizeGammaMarket()` never reads them; simulated Base Rate Evidence for sports would produce confidence 70 / model_probability 74.1% from a 50.6% split that is plausibly noise.

---

## 3. Market Lifecycle Diagnosis

### 3.1 The three Polymarket API surfaces SignalVerse actually calls, and their field shapes (traced, not assumed)

| Call site | Endpoint | Fields available (confirmed live in Phase 2) | Currently read by SignalVerse |
|---|---|---|---|
| `fetchGammaMarketsByCategory()` (`api/predictions.ts:397`) | `gamma-api.polymarket.com/events?...&tag_slug=<cat>` | per sub-market (camelCase): `conditionId`, `clobTokenIds`, `outcomes`, `question`, `endDate`, `resolutionSource`, `volume`, `volume24hr`, `liquidity`, **`closed`, `active`, `acceptingOrders`** | conditionId, clobTokenIds, outcomes, question, endDate, resolutionSource, volume, volume24hr, liquidity — **closed/active/acceptingOrders are silently discarded** |
| `revalidateMarketForEntry()` (`:1172`) and `fetchGammaSettlementOutcome()` (`:1200`) | `gamma-api.polymarket.com/markets?condition_ids=<id>` | same shape as above, singular market | **confirmed broken for closed markets** (Phase 2: returns `[]`) |
| `fetchClobOrderBook()` (`:408`) | `clob.polymarket.com/book?token_id=<id>` | `bids[]`, `asks[]` (200), or HTTP 404 `{"error":"No orderbook exists..."}` when the book genuinely doesn't exist | bids/asks only; **the 404 status itself is discarded** (see 3.3) |
| *(not currently called anywhere in the codebase)* | `clob.polymarket.com/markets/<condition_id>` | snake_case: `active`, `closed`, `archived`, `accepting_orders`, `enable_order_book`, `tokens: [{token_id, outcome, price, winner}]` | not used today — this is the endpoint Phase 2 proved reliable for both closed and open markets |

**This is not one field, read in two places — it is two different Polymarket APIs with two different casing/shape conventions for overlapping concepts.** Any fix must not assume `m.closed` (Gamma/events, camelCase) and `closed` (CLOB, snake_case-siblings) are the same call or the same trust level; they happen to agree in every sample checked, but only one of them (CLOB) was proven reliable specifically for *closed* markets.

### 3.2 Classification of the four fields (per the task's explicit request — not treated as interchangeable)

| Field | Source | Meaning (as evidenced) | Recommended bucket |
|---|---|---|---|
| `closed === true` | Gamma events (`m.closed`) or CLOB (`closed`) | Market has settled; a winner exists or the market was voided. Confirmed authoritative on CLOB (196/196); confirmed **unreliable to detect via the Gamma `condition_ids` singular lookup once true** (0/196) — but reliable when read directly off the `/events` listing SignalVerse already fetches during Discovery (that's a different call, not affected by the singular-lookup bug — Discovery never re-fetches a market it already stored by condition_id, it just re-lists the category). | **RESOLVED/CLOSED — definitely not eligible.** |
| `acceptingOrders === false` (Gamma) / `accepting_orders === false` (CLOB) | Both | Can occur *with* `closed=true` (trading has stopped because it's over — redundant with the row above) or *with* `closed=false` (a live market where Polymarket has paused trading for some other reason — not observed in either diagnostic's sample, so this diagnostic has no direct evidence of what that co-occurrence looks like in practice). | **When `closed=false`: TEMPORARILY UNAVAILABLE** (do not permanently filter; re-check on the next scan the same as any other candidate). **When `closed=true`: redundant, folds into RESOLVED/CLOSED above.** |
| `active === false` | Both | Distinct from `closed` per this project's own prior, already-recorded finding (comment at `api/predictions.ts:702-707`): *"a market's `endDate` can pass while `closed` stays false for days"* — the same kind of lag/mismatch is plausible between `active` and `closed`, and this diagnostic has no sample where they disagreed, so their exact relationship is **not fully characterized by available evidence**. | **Treat conservatively as RESOLVED/CLOSED-equivalent (not eligible)** — Discovery's own top-level query already assumes `active=true` as a precondition (`/events?active=true&closed=false`), so a sub-market surfacing `active=false` inside an otherwise-active event is already an anomaly worth excluding, not worth building trading logic on top of. |
| `enable_order_book === false` | CLOB only — **not present in the Gamma `/events` response Discovery already fetches** | Structural signal that Polymarket has torn down (or never built) the book. | **INSUFFICIENT DATA, not a Discovery-time classification** — see 3.4: fetching this at Discovery time would require a *new* per-candidate network call to the CLOB endpoint, duplicating information Shadow Entry's existing order-book fetch already surfaces for free via `decide()`'s `INSUFFICIENT_DATA` branch. Not worth the extra call; see the opportunistic-demotion design in 3.5 instead. |

None of the four are proposed as literally interchangeable; `closed`/`active` are proposed to be treated the same *only* because no case was found where they disagree and Discovery already gates on `active` at the event level.

### 3.3 A precision detail the fix must get right: `fetchClobOrderBook()` currently throws away the HTTP status

```ts
// api/predictions.ts:408-416 (current)
async function fetchClobOrderBook(tokenId: string): Promise<OrderBook | null> {
  try {
    const r = await fetchWithTimeout(`https://clob.polymarket.com/book?token_id=${encodeURIComponent(tokenId)}`);
    if (!r.ok) return null;              // <-- 404 "no orderbook" and a 500/timeout collapse to the SAME `null`
    ...
  } catch { return null; }               // <-- network exception also collapses to the SAME `null`
}
```

Any design (3.5) that wants to use "the order book fetch already told us this market is dead" as a **demotion signal** must **not** reuse this function's return value as-is, because a `null` today is ambiguous between "definitively closed (404, permanent)" and "transient failure (should retry, not demote)". This is a small, precisely-scoped change: the function (or a new sibling used only by the autonomous path) needs to surface the HTTP status, not just null-or-book.

### 3.4 Where should the fix live? (smallest correct architecture)

**Combination, asymmetric — not one file:**

1. **`normalizeGammaMarket()` (`:361`)** — additive only: read `m.closed`, `m.active`, `m.acceptingOrders` off the *sub-market* object (not the *event* object `e` — Phase 2's live check showed a still-active event can contain both a closed and a non-closed sub-market side by side) and add them to `NormalizedMarket` as new optional fields (e.g. `closedOnSource`, `activeOnSource`, `acceptingOrdersOnSource`) so they're distinguishable from SignalVerse's own unrelated `status` column. **Zero new network calls** — this data is already in the response Discovery fetches today.
2. **`autonomousDiscoveryTick()` (`:1224`)** — add the classification from 3.2 **before** the existing time-horizon/liquidity check (cheapest, most certain signal first): a market with `closedOnSource===true` or `activeOnSource===false` is `FILTERED_OUT` with a new `eligibility_reason`, without spending the time-horizon/liquidity computation on it.
3. **Shadow Entry (`autonomousEntryTick()`, `:1270`)** — see 3.5 for the backlog-specific mechanism; no change to its `.eq('candidate_status','ELIGIBLE').limit(50)` query shape itself is required by this fix (that unordered-`.limit(50)` issue is Phase 1's separate, lower-priority rotation finding, unaffected by this design).
4. **`enable_order_book`/`enableOrderBook` (CLOB-only field)** — **not fetched anywhere new**, per 3.2's reasoning.

### 3.5 The critical question: markets already `ELIGIBLE` that later become `closed`

**This cannot be solved by Discovery alone, and the evidence proves it, not just suggests it.** `fetchGammaMarketsByCategory()` only ever returns the **top-20-by-24h-volume events per category** (`order=volume24hr&ascending=false`, `:398`). A market that has already resolved and **fallen out of the top-20** for its category will **never be re-fetched by Discovery again** — the fix in 3.4 only corrects markets Discovery *happens to still be looking at*. This is exactly consistent with Phase 1's own finding that evaluation counts per market are heavily skewed (median 46, max 1,356) — some markets are re-scanned constantly, others effectively age out of view while their stale `ELIGIBLE` row sits untouched.

Therefore, the options as posed need refinement, not a single letter:

- **(A) alone — insufficient.** "Next Discovery tick" only ever revisits the volume-ranked window; it will never clean a market that has scrolled out of it, even after 3.4 ships.
- **(B) a dedicated CLOSED/RESOLVED `candidate_status`** — conceptually the cleanest, but the most invasive: requires an `ALTER TABLE ... CHECK` migration and an audit of every call site that reads `candidate_status` (`autonomousEntryTick`'s `.eq(...,'ELIGIBLE')`, `autonomous-status`'s admin counts at `:1721-1723`, any future analytics). Not recommended as the primary path given a materially smaller alternative exists (below), but documented here as a legitimate future upgrade if richer historical/calibration segmentation is ever wanted.
- **(C) leave ELIGIBLE, block in Shadow Entry** — necessary as a **complement**, precisely because of the scroll-out-of-window gap above, but should not require a *new* per-candidate network call every tick (cost) if it can instead reuse traffic Shadow Entry already generates (below).
- **(D) — recommended hybrid, combining a corrected (A) with a corrected (C):**
  1. **Discovery-time correction (3.4)** stops new pollution and opportunistically fixes any already-`ELIGIBLE` market that still happens to be in the top-20 scan window (a meaningful share, given how volume-persistent a just-concluded popular match's Gamma listing can be).
  2. **Shadow-Entry-time opportunistic demotion, using data it already fetches, zero new calls**: `evaluateMarket()` already calls `fetchClobOrderBook()` for **both** YES and NO tokens on every one of the 50 sampled candidates, every tick. If **both** calls return the specific, distinguishable "404, no orderbook exists" signal (not a timeout, not a 500 — see 3.3's fix), that is Polymarket's own book-teardown signal reaching SignalVerse anyway; the tick can cheaply write `candidate_status='FILTERED_OUT'` / the new `eligibility_reason` for that market **using data it already paid for**, without any additional API traffic.
  3. **A bounded, low-frequency full-pool sweep, as a safety net for candidates neither (1) nor (2) happens to touch soon** (e.g., a market with a genuinely thin book that never gets sampled into the unordered 50-per-tick draw before it closes): periodically iterate the **entire current `ELIGIBLE` set** (a small, bounded number — 268 today) against the CLOB `/markets/<condition_id>` endpoint. This directly and deterministically closes the gap that (1) and (2) cannot guarantee, independent of Discovery's volume-window or Shadow Entry's sampling luck.

  None of 1–3 requires a schema migration; all three reuse the existing `FILTERED_OUT` status with a distinguishing `eligibility_reason`, per the "smallest correct architecture" instruction.

**Status naming recommendation**: reuse `FILTERED_OUT` (no `candidate_status` schema migration needed — `eligibility_reason` is already free text) with a *new*, clearly distinct reason value (e.g. `MARKET_ALREADY_CLOSED`, separate from the existing `TIME_HORIZON_*`/`LOW_LIQUIDITY` discovery-criteria reasons) rather than adding a new `candidate_status` enum value. This keeps `candidate_status`'s existing binary "currently in the active pool or not" semantics unchanged everywhere it's already read, while still making "concluded naturally" distinguishable from "we chose not to evaluate this" for any future historical analysis that wants the distinction — at zero migration cost.

### 3.6 Consequence review, per the task's explicit checklist

| Area | Consequence of the 3.5(D) design |
|---|---|
| Discovery | Adds one cheap, pre-time-horizon check per candidate; writes a new `eligibility_reason` string; no new network call. |
| Shadow Entry | Adds a write (not a read) using data already fetched; no change to query shape, gate order, or decision logic (`decide()`/`evaluateSide()` untouched). |
| Resolution | **No conflict.** `autonomousResolutionTick`'s trade-path only updates `candidate_status` on settlement of an *open trade* (none exist today); its shadow-path never touches `candidate_status` at all — confirmed by reading the full function body (`:1447-1495`). A market demoted by 3.5 was, by construction, never going to open a trade anyway. |
| Historical analysis | Becomes possible to exclude "concluded naturally" from "we filtered it" via `eligibility_reason` text, without a schema change. |
| Calibration | **Zero interaction** — `autonomousLearningTick()` (`:1507`) reads only `prediction_predictions` filtered on `prediction_class`/`resolved_outcome`, never `candidate_status`. Confirmed by reading the full function body. |
| Duplicate protection | **Zero interaction** — `hasOpenAutonomousPosition()` (`:1141`) checks `prediction_autonomous_trades` by `market_id`/`status`, never `candidate_status`. The fix's entire point is that a demoted market should never reach that code path in the first place; this is the intended effect, not a new consequence. |
| Observability | `autonomous-status`'s `eligibleCount`/`filteredOutCount` (`:1721-1723`) will shift materially on first deploy (ELIGIBLE dropping from ~268 toward the true tradeable remainder, FILTERED_OUT rising by roughly the same amount) — **this should be called out to whoever reviews the first post-deploy dashboard as an expected, one-time correction, not a regression**, to avoid it being mistaken for a new bug. |

---

## 4. Resolution Diagnosis

### 4.1 Full current pipeline, traced end to end

```
autonomousResolutionTick() (:1447)
 ├─ Path A (OPEN prediction_autonomous_trades — currently always 0 rows):
 │    for each open trade → fetchGammaSettlementOutcome(t.condition_id)
 │      → on non-null result: settle trade (status/PnL), update
 │        prediction_predictions.resolved_outcome, set
 │        prediction_markets.candidate_status='EXPIRED'
 └─ Path B (VALID_PREDICTION shadow rows, resolved_outcome IS NULL,
            grouped by condition_id to dedupe calls):
      for each unique condition_id → fetchGammaSettlementOutcome(conditionId)
        → on non-null result: update ALL matching rows' resolved_outcome/resolved_at

fetchGammaSettlementOutcome(conditionId) (:1200)
 1. GET gamma-api.polymarket.com/markets?condition_ids=<id>
 2. mk = list[0]                                    <-- BUG 1: list is [] for closed markets (Phase 2, 0/196)
 3. if !mk || mk.closed !== true → return null
 4. outcomes = mk.outcomes; prices = mk.outcomePrices
 5. yesIdx = outcomes.findIndex(o => /yes/i.test(o))  <-- BUG 2 (new in this report): -1 for
                                                          player/team-named outcomes (Phase 2's
                                                          entire 15-market sample: outcomes like
                                                          ["Zverev","Zandschulp"], never "Yes"/"No")
 6. yesPrice = yesIdx >= 0 ? prices[yesIdx] : null    <-- null whenever step 5 was -1
 7. if yesPrice == null → return null                <-- fails again here, independently of BUG 1
 8. return yesPrice >= 0.5 ? 'YES' : 'NO'
```

**Bug 2 is confirmed by reading the source against the exact sample Phase 2 already gathered — not a new live test.** Every one of Phase 2's 15 sampled sports markets had player/team-named outcomes, not literal "Yes"/"No" (e.g., `outcomes: ["Zverev","Zandschulp"]`, confirmed in that report's Section 7 CLOB `tokens[]` dump). This means **fixing only Bug 1 (the endpoint) would make crypto and politics resolvable (both are literally Yes/No-labeled on Polymarket, per Phase 2's own samples) while sports would continue to silently fail resolution forever, for a second, completely independent reason.** This is precisely the kind of thing the task asked this audit to catch by tracing the full mapping rather than stopping at "switch the endpoint."

### 4.2 One additional live check needed to close a gap Phase 2 left open — result: could NOT find a counter-example, which is itself informative

Phase 2 did not check what the CLOB endpoint returns for a market with **no winner at all** (cancelled/invalid) or genuinely **more than two outcomes**. This audit ran an additional, read-only, public search to avoid guessing:

```
GET https://gamma-api.polymarket.com/events?tag_slug=<category>&closed=true&limit=30&order=volume
```
across all five active `SCAN_CATEGORIES` (politics, crypto, sports, economics, culture), inspecting every sub-market's `outcomes` array — **133 closed markets checked, zero had more than 2 outcomes.** This is a negative result, reported honestly rather than replaced with an invented positive one.

**This negative result is itself a meaningful finding, not a non-finding**: it is consistent with Polymarket's individual-market data model always being binary by construction — a "multi-candidate" question (e.g. "who wins the election") is modeled by Polymarket as **one event containing N separate binary Yes/No sub-markets** ("Will Candidate X win?", "Will Candidate Y win?", ...), exactly the same pattern already observed in Phase 2's sports sample ("Will Djokovic win?", "Will Sinner win?" as separate markets under one "2026 Men's US Open" event) — **not** as a single market object with more than two `tokens[]`. Every individual `condition_id` SignalVerse ever normalizes therefore appears to always be binary at the API level.

**Consequence for Section 4.3's design**: the `UNMAPPED`/multi-outcome branch below should be kept as a **defensive safeguard against an unproven edge case**, not presented as a fix for a confirmed, observed problem — this audit found no evidence such markets exist in the categories SignalVerse actually scans. It is retained in the design purely because "the winning token matches neither stored id" is a cheap, always-safe check to keep regardless of how rare its trigger condition turns out to be, and because this audit's negative search (133 samples) is not a proof of absence for markets outside the categories/volume range checked.

### 4.3 Recommended resolution architecture

**Replace the two-part guess (Gamma lookup + name-regex) with the CLOB endpoint's explicit `winner` flag, and thread the market's own stored token ids through so the result maps unambiguously to SignalVerse's YES/NO convention — not just "switch the URL":**

```
fetchClobSettlementOutcome(conditionId, tokenIdYes, tokenIdNo):
  1. GET clob.polymarket.com/markets/<conditionId>
  2. if request fails (network/5xx/timeout) → return { status: 'LOOKUP_FAILED' }         (retry next tick)
  3. if closed !== true → return { status: 'NOT_YET_RESOLVED' }                          (retry next tick, normal case)
  4. winnerToken = tokens.find(t => t.winner === true)
  5. if !winnerToken → return { status: 'RESOLVED_NO_WINNER' }                           (cancelled/invalid — STOP retrying, see below)
  6. if winnerToken.token_id === tokenIdYes → return { status: 'RESOLVED', outcome: 'YES' }
  7. if winnerToken.token_id === tokenIdNo  → return { status: 'RESOLVED', outcome: 'NO' }
  8. otherwise (winning token matches NEITHER stored id — a >2-outcome market SignalVerse
     mis-normalized at discovery time, a PRE-EXISTING, out-of-scope limitation, not something
     this fix can or should silently paper over) → return { status: 'UNMAPPED' }         (log, do not guess, do not write resolved_outcome)
```

This is a genuine **signature change**, not a drop-in URL swap: both call sites need the market's `token_id_yes`/`token_id_no` threaded in, which they don't currently have in scope —
- **Path A** (open-trade settlement) has `t.market_id`; needs a join to `prediction_markets` for the token ids (it doesn't currently select them).
- **Path B** (shadow resolution) already does `.select('id, market_id, prediction_markets(condition_id)')` (`:1471`) — this needs to become `prediction_markets(condition_id, token_id_yes, token_id_no)`, a one-line, additive select change.

**Return-status handling, mapped to the task's explicit list:**

| Case | Design |
|---|---|
| Resolved YES / Resolved NO | Write `resolved_outcome` (unchanged downstream shape — still just `'YES'`/`'NO'`, so `computeBaseRateEvidence()`/`autonomousLearningTick()` need no change). |
| Unresolved | Leave null, retry next tick — same as today. |
| Invalid/cancelled (no winner) | **New behavior needed**: today's code would retry such a market forever (never finding a winner). Recommend marking it so it stops being polled (reuse the `EXPIRED`-style transition path A already has, or the 3.5 `eligibility_reason` mechanism) — a small, explicit design decision, not left implicit. |
| Missing winner | Same as invalid/cancelled above — treated identically, since this diagnostic found no evidence they're distinguishable from the CLOB response alone. |
| Multi-outcome | `UNMAPPED` — logged, never guessed, never written as YES/NO (protects `computeBaseRateEvidence()`'s `yesRate` from being polluted by a wrong guess on a market SignalVerse's binary schema wasn't designed for in the first place). |
| Token mismatch | Same `UNMAPPED` path as multi-outcome — the two are indistinguishable from the caller's side and don't need separate handling. |
| Repeated resolution tick | **Already idempotent by construction** — Path B's read filter (`.is('resolved_outcome', null)`) means an already-resolved row is never re-selected. This property is unchanged by the redesign and should be explicitly asserted in a test (Part 9), not just assumed to survive the refactor. |
| Already-resolved row | Same idempotency guarantee — never re-written, confirmed unaffected. |

**Rate-limit implications**: one CLOB GET per unique still-unresolved `condition_id` per tick — same call shape and same existing dedup-by-`condition_id` grouping as today; no new rate profile introduced.

**`revalidateMarketForEntry()` (`:1172`)** uses the same broken Gamma `condition_ids` lookup, but its failure mode there is *already safe* (a closed market returns `MARKET_NOT_FOUND` → entry is correctly refused) — this is flagged as a **nice-to-have accuracy improvement** (switching it would produce a correctly-labeled `ALREADY_CLOSED` rejection reason instead of the misleading `MARKET_NOT_FOUND`), **not a required fix**, and explicitly out of this design's critical path.

---

## 5. Base Rate Evidence Safety Assessment (no formula change proposed or made)

Direct answers to the five questions, as a technical assessment only:

1. **Is aggregating all Sports outcomes into one category-level base rate statistically meaningful?** No, not as currently scoped. "Sports" bundles tennis, esports, cricket, and outright-tournament markets with no shared underlying probability process; a category-level "51% YES" rate measures the aggregate of an arbitrary per-market labeling convention, not a real base rate of anything.
2. **Does the current YES/NO convention create a directional artifact?** Plausibly, yes — `normalizeGammaMarket()` assigns `tokenIdYes` to whichever outcome Polymarket happens to list first when no literal "Yes" exists (`:369`, `yesIdx >= 0 ? yesIdx : 0`). If Polymarket's own listing convention correlates with anything systematic (alphabetical, favorite/underdog, home/away), that correlation would masquerade as signal. This diagnostic cannot prove or disprove such a correlation from available data — it identifies the mechanism, not a measured bias.
3. **Does the binary direction (`+1`/`-1`) create excessive confidence?** Yes, demonstrated numerically in Phase 2: a 50.6%-YES sample of 160 rows produced simulated confidence 70 — the same strength a 90/10 split would receive, because `direction` encodes sign only, never magnitude.
4. **Could a 51/49 split receive effectively the same directional strength as 90/10?** Yes, confirmed — `weight`/`reliability` depend only on sample *size* (`min(1, rows.length/100)`, `min(0.7, rows.length/200)`), never on how far `yesRate` sits from 50%; only `direction`'s sign changes between a 51/49 and a 90/10 split, not its magnitude.
5. **Should Base Rate Evidence eventually be category-specific / market-type-specific / question-template-specific / outcome-type-specific / or disabled for heterogeneous categories?** Technical assessment, not a recommendation to implement now: today's category-level granularity is defensible for more homogeneous, literally-Yes/No-labeled categories (politics, crypto) but not for sports as currently bundled. A genuinely useful sports base rate (e.g., a real favorite/underdog effect) would need to be **outcome-type-specific** (favorite vs. underdog, not an arbitrary Yes/No label) — a materially different design from today's formula, not a parameter tweak. **Recommended safe default for any future activation**: gate Base Rate Evidence on whether a market has a literal Yes/No outcome labeling (a cheap, already-available check — `yesIdx >= 0` in the existing normalization) rather than a blanket per-category switch, until a magnitude-aware, non-binary-direction design is separately reviewed. **Not implemented here.**

---

## 6. Recommended Implementation Order

The task's proposed 7-step sequence is sound; two refinements are recommended based on this audit's findings, not a different order:

1. **Fix the closed/stale candidate lifecycle (Section 3.5[D])** — first: highest measured impact (78.8%), purely subtractive (can only shrink the pool, cannot cause a false-positive trade), and has zero dependency on anything else.
2. **Fix the resolution lookup — both Bug 1 (endpoint) and Bug 2 (token-mapping) in the same pass** (refinement: the task's phrasing risks reading as "just the endpoint"; this audit's Section 4.1 shows fixing only the endpoint leaves sports resolution silently broken for an independent reason).
3. **Add/extend the tests in Section 9** before either fix ships — consistent with this project's own established convention (every prior Prediction phase shipped its structural test alongside its code, never after).
4. **Ship the lifecycle + resolution code, but do not enable `resolve`/`learn` in the same action** (refinement: per this project's own demonstrated practice — Phase 7B-2's observability code shipped 2026-09-09 evening, the schema migration and gate activation happened as a **separate, later, explicitly-approved** step — this design recommends the same separation here: ship the corrected code first, with `resolve`/`learn` still disabled, then request separate explicit approval to enable the scheduler gate, preceded by `npm run backup` per this project's standing rule).
5. **Run resolution in controlled observation mode** once explicitly approved and enabled — accumulate real resolved outcomes.
6. **Evaluate Base Rate quality on the real accumulated data**, explicitly re-checking for the listing-order artifact and binary-direction over-confidence identified in Section 5 — not just trusting Phase 2's snapshot simulation.
7. **Only then consider opportunity-generation tuning** (thresholds, gates, Kelly, etc.) — and even then, as its own separately-approved decision, per this project's standing convention, not an automatic consequence of steps 1–6.

---

## 7. Test Plan

Consistent with this project's own established idiom for Prediction (source-string/structural checks against the compiled `api/predictions.ts`, run via `node scripts/*.mjs`, no live network/DB calls in the automated suite — see `scripts/prediction-shadow-resolution-test.mjs`/`prediction-duplicate-protection-test.mjs`, both read in full for this audit).

### 7.1 New: `scripts/prediction-market-lifecycle-test.mjs`
- `normalizeGammaMarket()` reads `closed`/`active`/`acceptingOrders` off the **sub-market** object, not the event object.
- `autonomousDiscoveryTick()` checks closed/active **before** the time-horizon/liquidity check (order-of-checks assertion, source-anchor based).
- A market with `closed===true` is classified `FILTERED_OUT` with the new, distinct `eligibility_reason` (not reused from `TIME_HORIZON_*`/`LOW_LIQUIDITY`).
- A market with `acceptingOrders===false` and `closed===false` is classified distinctly from the `closed===true` case (temporarily-unavailable path exists and is not conflated with permanent closure).
- `active===false` is treated as not-eligible.
- `fetchClobOrderBook()` (or its autonomous-path sibling) surfaces the HTTP status distinctly for 404 vs. other failures (Section 3.3) — assert the transient-vs-permanent distinction exists in source, not collapsed to one `null`.
- The Shadow-Entry opportunistic-demotion write path (3.5, step 2) exists and only fires when **both** YES and NO book checks return the specific "no orderbook" signal, never on a single-sided or transient failure.
- The bounded full-pool sweep (3.5, step 3) is present and scoped to `candidate_status='ELIGIBLE'` only (never touches `MONITORING`/`EXPIRED`/`FILTERED_OUT` rows).
- A previously-`ELIGIBLE` market that becomes closed is demoted via **either** the Discovery-rescan path **or** the Shadow-Entry opportunistic path **or** the sweep — assert at least one path's source exists and none of them can insert into `prediction_autonomous_trades` (a demotion must never itself be an entry).
- A multi-outcome market (>2 `clobTokenIds`) is defensively handled (not silently truncated into a wrong YES/NO pair) at normalization time.

### 7.2 New: `scripts/prediction-resolution-lookup-test.mjs`
- Resolved YES / resolved NO: winner-token-id mapped correctly to `tokenIdYes`/`tokenIdNo`, **not** via outcome-name regex (assert the `/yes/i` regex approach is gone from the settlement path specifically, distinguishing it from `classifyPrediction`'s unrelated, still-valid use of evidence).
- Unresolved: `closed!==true` → `NOT_YET_RESOLVED`, no write.
- Invalid/cancelled (no `winner:true` token found): distinct `RESOLVED_NO_WINNER` status, and a source-level assertion that this status stops future polling of that market (not an infinite retry).
- Missing winner: same path as invalid/cancelled, not a crash (defensive `tokens.find(...)` with a null-check before `.token_id` access).
- Multi-outcome: `UNMAPPED` when the winning token matches neither stored id — assert `resolved_outcome` is never written in this branch.
- Token mismatch: same `UNMAPPED` path.
- Repeated resolution tick: assert the read filter (`.is('resolved_outcome', null)`) is unchanged (idempotency preserved by construction, not by new logic).
- Already-resolved row: same assertion — never re-selected, never re-written.
- Both call sites (Path A trade settlement, Path B shadow resolution) are updated to select/join `token_id_yes`/`token_id_no`, and both call the **same** shared settlement function (preserve the existing `prediction-shadow-resolution-test.mjs` assertion that trade and shadow paths can never disagree — extend, don't replace, that test).

### 7.3 Existing tests to extend, not replace (source-anchor updates only, matching this project's own established pattern for this kind of change)
- `scripts/prediction-shadow-resolution-test.mjs` — its core assertions (single shared settlement source of truth, shadow path never inserts a trade, shadow path only updates `prediction_predictions`) remain valid; extend to assert the shared function is the new CLOB-based one and that both call sites pass token ids.
- `scripts/prediction-duplicate-protection-test.mjs` — unaffected by this design; re-run unchanged to confirm no regression.
- `scripts/prediction-observability-test.mjs` — extend to assert `autonomous-status`'s eligible/filtered-out counts still compute correctly given the new `eligibility_reason` value (no new columns needed, just a new string value).
- `scripts/prediction-calibration-test.mjs` — re-run unchanged; confirm zero interaction with `candidate_status` (Section 3.6) holds.

### 7.4 Integration-level verification (repeatable, read-only, NOT part of automated CI — matching this project's own demonstrated split between "structural test suite" and "separate live verification," as seen in every prior Prediction phase report)
Recommend a new, explicitly-manual, explicitly-read-only script, e.g. `scripts/prediction-lifecycle-live-verify.mjs`, that institutionalizes exactly what Phase 2's diagnostic did by hand:
- Sample N current `ELIGIBLE` rows, confirm 0 are `closed` on Polymarket (the inverse of Phase 2's finding — this becomes the regression check for 3.5's fix).
- Sample N resolved shadow predictions (once `resolve` is separately approved and enabled), confirm `resolved_outcome` is actually populated for a literal-Yes/No market **and** for at least one player/team-named market (regression check for Bug 2's fix specifically).
- Discovery → Candidate Registry → Shadow Entry: confirm a freshly-discovered, already-closed market never reaches `candidate_status='ELIGIBLE'` even transiently.
- Resolution → Base Rate Evidence: confirm `computeBaseRateEvidence()` remains gated off (Section 5's recommended default) for any category without a literal Yes/No convention, even once resolved rows exist.
- Calibration after resolution: confirm `autonomous-learn`, if separately enabled, only counts `VALID_PREDICTION` rows and produces a sane sample size — no fabricated accuracy claim.

No step above executes a trade, demo or real, or writes anything beyond what `resolve`/`learn` (once separately approved) already would.

---

## 8. Files/Functions Likely Affected

| File | Function(s) | Nature of change |
|---|---|---|
| `api/predictions.ts` | `normalizeGammaMarket()` (`:361`) | Additive: read 3 already-available fields. |
| `api/predictions.ts` | `autonomousDiscoveryTick()` (`:1224`) | Add a check before time-horizon/liquidity; write new `eligibility_reason` value. |
| `api/predictions.ts` | `fetchClobOrderBook()` (`:408`) or a new autonomous-path sibling | Surface HTTP status distinctly (404 vs. other) instead of collapsing to `null`. |
| `api/predictions.ts` | `autonomousEntryTick()` (`:1270`) | Add opportunistic demotion write using data already fetched; no query-shape change. |
| `api/predictions.ts` | `fetchGammaSettlementOutcome()` (`:1200`) | Replace with CLOB-based, token-id-mapped equivalent (Section 4.3) — signature change, both call sites updated. |
| `api/predictions.ts` | `autonomousResolutionTick()` (`:1447`) | Both paths updated to select/join `token_id_yes`/`token_id_no` and call the new settlement function; add the "stop polling on `RESOLVED_NO_WINNER`" transition. |
| `api/predictions.ts` | `revalidateMarketForEntry()` (`:1172`) | Optional, non-critical accuracy improvement only (Section 4.3) — not required. |
| `scripts/prediction-market-lifecycle-test.mjs` | new file | Section 7.1. |
| `scripts/prediction-resolution-lookup-test.mjs` | new file | Section 7.2. |
| `scripts/prediction-lifecycle-live-verify.mjs` | new file, manual/read-only only | Section 7.4. |
| `scripts/prediction-shadow-resolution-test.mjs`, `prediction-observability-test.mjs` | existing | Extend assertions (Section 7.3), do not rewrite. |
| (possible, optional) a new small migration | `eligibility_reason` values are free text — **no schema/migration change is required** for the recommended design (Section 3.5's "reuse FILTERED_OUT" choice). A migration would only be needed if the dedicated-status Option (B) is chosen instead, which this audit does not recommend as the primary path. |

---

## 9. Files/Areas That MUST Remain Untouched

- `jobs.d` / any systemd timer / scheduler configuration — no gate is enabled by this design; enabling `resolve`/`learn` is Section 6's separately-approved step 4, not part of the code change itself.
- `decide()`, `assessTradeability()`, `computeAutonomousPositionSize()`, `timeHorizonGate()`, `DEFAULT_THRESHOLDS`, `TRADEABILITY_*` constants, Kelly sizing — zero changes proposed anywhere in this design.
- `computeBaseRateEvidence()`'s formula itself — Section 5 is an assessment, not a change; no line of that function is proposed to change.
- `api/copytrade.ts`, `api/analyze.ts` (Futures/Spot/Fast Trader/Autonomous Supervisor) — entirely separate files, not referenced by any change proposed here.
- `ai_providers` / credit balance / `recordCreditTransaction` — Prediction's autonomous engine has never been part of the credit-gated AI-cost lanes (CLAUDE.md's own documented separation); nothing here touches that boundary.
- `prediction_trades` (the user-facing manual demo/real table) — architecturally distinct from `prediction_autonomous_trades` per the original migration's own design comment; untouched by this design.
- The `entry_real` action/gate (`autonomous-enter`) — this design's lifecycle/resolution fixes apply identically to shadow and (if ever separately approved) real entry, but **do not themselves enable, wire up, or add a gate for** real autonomous trading.

---

## 10. Risks and Rollback Considerations

- **Lifecycle fix (Section 3.5)**: purely subtractive — it can only remove candidates from the pool or refuse new closed ones entry; it cannot cause a trade that wouldn't otherwise have happened. Rollback is trivial (revert the code; `eligibility_reason` values are additive strings, no migration to reverse).
- **Resolution fix (Section 4.3)**: the main risk is the `UNMAPPED`/multi-outcome branch silently under-populating `resolved_outcome` for a market type SignalVerse's binary schema doesn't fully support — mitigated by explicitly never guessing in that branch (Section 4.3, step 8) rather than making the risk worse by forcing a wrong YES/NO. Rollback: the function is swapped, not the schema; reverting the code fully reverts behavior.
- **Enabling `resolve`/`learn` (a separate, later step, not part of this design's code change)**: per this project's standing rule, must be preceded by `npm run backup`. The main residual risk this design cannot fully retire is the `RESOLVED_NO_WINNER` (cancelled/invalid market) path — if that classification is ever wrong, a market could either be polled forever (low-severity, wasted calls) or prematurely stopped (low-severity, a rare cancelled-market outcome never gets marked, which is already true today). Neither failure mode touches money, credits, or any other subsystem.
- **Base Rate Evidence remaining structurally gated (Section 5)**: the risk of *not* activating it is only the status quo (zero edge for sports/politics) — already fully described in Phase 1. The risk of activating it without the safeguard this section recommends is manufactured false confidence feeding into a real trading decision once `entry_real` is ever separately approved — this is exactly why Section 5 recommends keeping it gated by outcome-labeling type, not by a blanket per-category flag, as the safe default.

---

## 11. Explicit List of Things That Should NOT Be Changed Yet

1. Do not enable the `resolve` or `learn` scheduler gates (Section 6, step 4 is separate and requires its own explicit approval).
2. Do not enable `entry_real` / real autonomous trading — untouched by, and unrelated to, this design.
3. Do not modify `computeBaseRateEvidence()`'s formula (Section 5 is assessment-only).
4. Do not modify Time Horizon, Tradeability, Kelly, or any `DEFAULT_THRESHOLDS` constant.
5. Do not add a dedicated `CLOSED`/`RESOLVED` `candidate_status` enum value (Option B) — the recommended design achieves the same outcome via `eligibility_reason` without a migration; revisit only if a future need for richer historical segmentation is explicitly identified.
6. Do not change `fetchClobOrderBook()`'s use anywhere outside the autonomous lifecycle path without separately reviewing the manual scan/feed/Simulation Lab call sites that also use it (out of scope for this design, not audited here).
7. Do not touch `revalidateMarketForEntry()` — it is safe as-is (Section 4.3); improving its rejection-reason accuracy is optional and not required for correctness.
8. Do not deploy any of the above without the tests in Section 7 passing first, per this project's own established practice for every prior Prediction phase.

---

## 12. Production Safety Confirmation (explicit, per the task's requirement)

Confirmed, by direct source inspection (not by inference), that the design in this report does not and must not:
- Enable real Prediction trading — `entry_real` is dispatched by its own separate `action==='autonomous-enter'` branch (`:1677`), gated by its own separate `jobs.d` entry that this design does not propose adding.
- Create real orders or sign transactions — `autonomousResolutionTick()`'s only writes are to `prediction_autonomous_trades` (status/PnL on an already-open row), `prediction_predictions`, and `prediction_markets`; zero exchange/signing calls anywhere in its body, confirmed by reading the full function.
- Move funds — no wallet/exchange code is touched anywhere in this design.
- Modify Futures, Spot, Fast Trader, or Autonomous Supervisor — `api/copytrade.ts`/`api/analyze.ts` are separate files, not referenced.
- Change AI provider settings or global billing/credits — Prediction's autonomous engine is outside the credit-gated AI-cost lanes per CLAUDE.md's own documented boundary; nothing here crosses it.
- Prediction Demo (`prediction_trades`, user-facing) remains architecturally separate from the system-owned `prediction_autonomous_trades` table this design touches.

---

This report contains the design only. Nothing described above has been implemented, deployed, or enabled.
