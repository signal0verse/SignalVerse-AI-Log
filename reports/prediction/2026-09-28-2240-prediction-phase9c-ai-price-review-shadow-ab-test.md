# Phase 9C — AI Price-Review Shadow A/B/C Diagnostic

**Date:** 2026-09-28 22:40 UTC
**Status:** Deployed to Production, collecting data, Entry OFF
**PRs:** #173 (9C base), #174 (9C.1 guard)
**Commits on main:** `dc33a74` (9C), `290da5a` (9C.1)
**Kill switch:** `PREDICTION_PRICE_AI_DIAGNOSTIC=off` (env var on VPS)
**Model version tag:** `price-ai-review-v1`

---

## 1. Why this diagnostic exists

Phase 9A forensic audit found that the free AI reviewer returns probability
estimates 50-70 pp away from the quantitative price model on price-type
questions. When the market/model agree at ~96-100 %, the AI returns 12-35 %.
This causes:

- **H4 vetoes** on the engine's chosen side (the AI "disagrees" with the
  model), blocking otherwise valid opportunities.
- **Wrong-direction posterior shifts** where the bounded-evidence caps limit
  drift to 2-3 pp max, but the direction is harmful.

The root cause is that the free AI chain (Groq → Gemini → OpenRouter) has no
access to live market prices, orderbook data, or the engine's own quantitative
inputs. It answers from general knowledge, which is inadequate for narrow
price-band questions like "Will BTC be above $65,000 on Dec 31?"

## 2. What was built

A **read-only shadow diagnostic** that runs inside the existing Shadow tick,
after the production decision is final and immutable. It compares three
evaluation policies on `PRICE_QUESTION_TYPES` only:

| Mode | Policy | AI calls | Description |
|------|--------|----------|-------------|
| A (CURRENT) | Re-run with identical inputs | Same as production | Baseline reproduction |
| B (AI_WITH_CONTEXT) | AI receives engine's quantitative context | Free AI chain | Tests whether giving the AI price-model data fixes the divergence |
| C (NO_AI_PRICE_REVIEW) | Skip AI evidence entirely | Zero | Tests pure quantitative-only posterior |

### Key design decisions

- **Non-enumerable `v2Inputs`**: The `EngineResult` object carries a
  `v2Inputs` property (set via `Object.defineProperty` with `enumerable: false`)
  so the evaluation inputs survive the function boundary but do not appear in
  JSON serialization, API responses, or database writes.
- **No migration**: Results go into the existing `prediction_autonomous_runs.summary`
  JSONB column under the key `priceAiDiagnostic`.
- **B target selection**: SHA-256 hash of `${marketId}|${5-minute-slot}` selects
  up to `PRICE_AI_DIAG_MAX_B_CALLS` (4) markets per tick for mode-B evaluation.
  This caps AI cost while ensuring rotation across markets.
- **Budget enforcement**: Mode B has a 25-second wall-clock budget
  (`PRICE_AI_DIAG_BUDGET_MS`). Markets that don't start within budget get
  `status: 'SKIPPED_BUDGET'`.
- **Concurrency**: Up to 3 mode-B AI calls run in parallel
  (`PRICE_AI_DIAG_B_CONCURRENCY`).

### Safety properties (by construction)

1. Diagnostic runs **after** `decide()` returns — production decision is frozen.
2. Mode A re-evaluates with identical inputs; cannot originate a different
   decision.
3. Mode B **cannot originate** — even if B says "opportunity", the production
   path already decided. B's `decision` field is for comparison only.
4. Mode C has zero AI calls — purely deterministic from cached inputs.
5. No mode writes to `prediction_trades`, `prediction_positions`, or any
   table other than the existing `summary` JSONB.
6. No mode modifies any gate threshold, cap, beta, or engine parameter.
7. Kill switch `PREDICTION_PRICE_AI_DIAGNOSTIC=off` disables the entire
   diagnostic in < 1 second (env var check at entry).

## 3. Temporal correctness (no look-ahead)

All three modes receive **exactly the same market snapshot** that was available
at decision time:

- `marketData`: the Polymarket CLOB midpoint fetched at tick start
- `binancePrice`: the Binance spot price fetched at tick start
- `aiEvidence`: (mode A only) the AI reviews already collected for this tick
- `priceModel`: the strike-aware price model output from `evaluateMarket()`

No mode receives resolution data, future prices, or post-decision information.
Verified by test (`no-look-ahead: A, B, C all use only pre-decision data`).

## 4. Tests

**19 tests** in `scripts/prediction-ai-price-review-diagnostic-test.mjs`:

1. mode-A reproduces production evaluation exactly
2. mode-B uses enriched AI prompt with price context
3. mode-C skips AI entirely (zero calls)
4. B cannot originate (H3 gate still blocks)
5. B and C only run for PRICE_QUESTION_TYPES
6. no look-ahead: all modes use only pre-decision data
7. non-price markets are unchanged (passthrough)
8. gates are not weakened by any mode
9. no mode can write a trade
10. budget enforcement (25s cap)
11. B target rotation (deterministic hash selection)
12. AI failure in B is non-fatal (status: 'AI_FAILED')
13. mode-A on/off consistency (same evidence, same result)
14. H3 amplification property (B.net_edge > C.net_edge when AI agrees with model)
15. 9C.1: degradation guard skips B when ≥2 and ≥25% of A reviews failed
16. 9C.1: slow-tick guard skips B when tick elapsed > 90s
17. 9C.1: degradation info recorded in summary
18. 9C.1: A and C always run even when B is skipped
19. 9C.1: B fallback covers all SKIPPED_* statuses

All 19 pass. Added to `production-ci.yml`. Full prediction suite (25 files,
674 checks) passes on Node 22.

## 5. Phase 9C.1 — Degradation and slow-tick guard

**Problem discovered after initial deploy:** The free AI chain (Groq) became
throttled from ~17:06 UTC on 2026-09-28. Shadow ticks grew from ~10s to
116-290s. Mode B's original 60s budget produced 0-2 answers while stretching
ticks further toward the 300s function timeout.

**Fix (PR #174, commit `290da5a`):**

```
AI degradation guard:
  aiDegraded = (aiFailedN >= 2) && (aiFailedN >= 0.25 * aiAttemptedN)

Slow-tick guard:
  tickElapsed > PRICE_AI_DIAG_MAX_TICK_ELAPSED_MS (90_000)
```

When either triggers, mode B is entirely skipped (`b_skip_reason:
'SKIPPED_AI_DEGRADED'` or `'SKIPPED_TICK_SLOW'`). Modes A and C always run
(A is a re-evaluation of already-collected data; C makes zero AI calls).

**Result:** With the guard active, diagnostic overhead dropped from 25-60s to
14-35ms per tick.

### Summary fields added by 9C.1

- `b_skip_reason`: why B was skipped (null if it ran)
- `a_ai_attempted`: count of A-mode AI review attempts in this tick
- `a_ai_failed`: count of A-mode AI review failures in this tick
- `tick_elapsed_ms_at_start`: wall-clock ms elapsed when diagnostic started

## 6. Deployment record

### Timeline

| Time (UTC) | Event |
|------------|-------|
| 14:41 | PR #173 merged (9C base) |
| 15:25 | CI passes, artifact prepared for `dc33a74` |
| 15:41 | Owner VPS approval issued |
| 15:43 | Release delivered to VPS — 9C live |
| 17:06 | Free AI chain (Groq) begins throttling |
| 17:25 | First Shadow tick with diagnostic observed |
| 19:30 | PR #174 merged (9C.1 guard, commit `290da5a`) |
| 21:21 | 9C.1 confirmed running on VPS (via Spot release `c5896ca`) |
| 22:19 | My own release attempt for 9C.1 — approval expired (AUTHORIZATION_EXPIRED). SHA not burned (rejected before claim). Did not retry because `c5896ca` already superseded `290da5a`. |

### The expired-approval incident

My session was paused (context window management) past the 1-hour approval
window. The VPS receiver rejected the delivery before claiming the SHA, so
it is not burned. Another session's Spot release (`c5896ca`, "fix(spot): size
stablecoin trade to available balance") was built on top of `290da5a` and
carried 9C.1 to production. Verified by checking the running bundle for 9C.1
markers (`PRICE_AI_DIAG_VERSION`, `b_skip_reason`, `SKIPPED_AI_DEGRADED`).

## 7. Production observations (59 ticks, 547 records)

**Collection window:** ~17:25 – ~22:19 UTC, 2026-09-28

### Reproduction fidelity
- Mode A reproduced the exact production decision in **547/547** records.
- No-look-ahead check passed in **547/547** records.

### AI divergence (median)
- Mode A: AI ~50 pp from price model (confirms the Phase 9A finding)
- Mode B: AI ~0.2 pp from price model (context injection works)

### H4 vetoes on chosen side
- Mode A: **285/547** records (52%) — over half of evaluations vetoed
- Mode B: **0/25** paired records — zero vetoes when AI has context

### Mode C (no AI)
- Pure quantitative posterior tracked the price model closely
- No actionable opportunity surfaced in either B or C during this window
  (all markets were near 0% or 100%, i.e., deep in the money or worthless)

### B sample size caveat
- Only **25 records across 11 markets** received mode-B evaluation
- All were extreme-probability markets (near 0 or 100%)
- The AI chain was degraded for most of the window
- **This sample is too small and too homogeneous to draw conclusions**

### Design note
Mode B's AI tends to echo the price-model number it receives in the prompt,
raising the question of whether the AI evidence is truly independent or just
double-counting the same price information. This is expected and noted for
the Phase 9A validation committee to consider.

## 8. What remains OFF

| Item | Status | Evidence |
|------|--------|----------|
| `prediction-enter-cron` | OFF (not installed) | No gate file, no systemd unit |
| Entry logic | OFF | `PREDICTION_ENTRY_ENABLED` not set |
| Real Trading | OFF | `PREDICTION_REAL_ENABLED` not set |
| Demo trade creation | OFF | Zero rows in `prediction_trades` |

## 9. Not yet validated

- [ ] B performance on **diverse markets** (not just 0%/100% extremes)
- [ ] B performance during **healthy AI chain** (non-degraded)
- [ ] Whether B's context injection makes AI truly independent vs. echo
- [ ] Long-term drift comparison (A vs C posterior over resolution)
- [ ] Report script (`prediction-ai-price-diagnostic-report.mjs`) run on
      ≥7 days of data

## 10. Risks and recommendations

1. **Free AI chain reliability**: Groq throttling is frequent. The 9C.1 guard
   handles this gracefully, but it means B data collection is slow. Consider
   letting the diagnostic collect for 2+ weeks before drawing conclusions.

2. **B echo effect**: If B always agrees with the price model, it adds no
   information and doubles the model's weight in the posterior. The validation
   process should test whether B ever *usefully disagrees* with the model.

3. **A-mode timeout**: Production path A currently has no per-review timeout.
   When the AI chain is slow, individual reviews can take 30-60s. Recommend
   adding a per-review timeout in a future phase (not touched in 9C).

4. **No mode promoted**: Per the Phase 9C charter, no mode is promoted and no
   parameter is tuned from these observations. The policy choice belongs to
   the Phase 9A pre-registered validation process.

## 11. Rollback / kill switch

- **Instant disable**: Set `PREDICTION_PRICE_AI_DIAGNOSTIC=off` on VPS.
  Next tick will skip the diagnostic entirely.
- **Full rollback**: Revert commits `290da5a` and `dc33a74`. The diagnostic
  code is fully additive — removing it does not affect any production path.
- **No migration to revert**: All data lives in the existing `summary` JSONB
  column.

## 12. Files changed

| File | Change |
|------|--------|
| `api/predictions.ts` | Added `runPriceAiReviewDiagnostic()`, `evaluateV2Mode()`, `buildPriceContextAiPrompt()`, `computeAiEvidenceWithPriceContext()`, non-enumerable `v2Inputs`, 9C.1 guards |
| `scripts/lib/prediction-isolated-env.mjs` | Extended AI stub for per-prompt answers + `net.aiPrompts` |
| `scripts/prediction-ai-price-review-diagnostic-test.mjs` | 19 tests |
| `scripts/prediction-ai-price-diagnostic-report.mjs` | Read-only analyzer (GET-only guard) |
| `.github/workflows/production-ci.yml` | Added diagnostic test to CI |
| `TRADING_STRATEGY.md` | Engine v2 chain entry |
| `api/analyze.ts` | Updated `HELP_ASSISTANT_APP_DESCRIPTION` prediction section |

---

*Entry OFF. Real OFF. No mode promoted. No parameter tuned.*
