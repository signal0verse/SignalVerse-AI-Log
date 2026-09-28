# Prediction Market — Phase 9 Audit: Why the Autonomous Demo Has Zero Trades After 12 Days (and Why Turning It On Today Would Lose Money)

**Date:** 2026-09-28
**Type:** Read-only production forensic audit. No code, config, gate, or DB changes.
**Window:** 2026-09-16 08:30 UTC (Phase 8 deploy) → 2026-09-28 10:16 UTC (~12 days)
**Method:** read-only SSH (`jobs.d`, job-runner script, release pointer) + read-only PostgREST queries (exact counts via `count: 'exact'`, no offset-paginated counting on live tables — the Phase 6 lesson).

---

## TL;DR

1. **Zero trades is fully explained and was structurally guaranteed:** `entry_real` has run **0 times** in 12 days. The `prediction-enter-cron` branch was never installed in the VPS job runner (0 references in `/usr/local/libexec/signalverse-jobs`) and the gate file does not exist. Activation was deliberately left as a separate owner step in Phase 7/8, and that step was never performed.
2. **Two users did opt in via the Phase 8 UI** (the config side works end-to-end) — which is why it *looks* like it should be trading. It can't: nothing ever calls `action=autonomous-enter`.
3. **More important:** if the gate *had* been on, the "All categories" user would have opened **6 positions — and all 3 that have since resolved lost (3/3, −$60 hypothetical)**. The remaining 3 follow the identical losing pattern. The Sports-only user would have received **0 trades ever** (sports produced 0 actionable decisions).
4. **Root cause of the bad trades is an Engine calibration defect, not bad luck:** the "Base Rate" evidence ("X% of our past crypto markets resolved YES") — a statistic unrelated to any specific question — is the single largest input to every crypto probability (fixed ±1.05 logit), and it silently switched on **10 minutes after `resolve` was enabled in Phase 5**. It produces fake 55–75pp "edges" on long-shot price-threshold markets. The AI evidence correctly called these "highly unlikely" and was outvoted.
5. **Recommendation: do NOT enable `entry_real` yet.** Fix/neutralize Base Rate evidence first (as the Phase 3 design audit already recommended), re-observe in shadow, then activate.

---

## 1. Production health — infrastructure is fine

| Tick | Runs since 09-16 | Success | Failed | Last run |
|---|---|---|---|---|
| `discover` | 3,470 | 3,470 | 0 | 2026-09-28 10:15 |
| `entry_shadow` | 3,469 | 3,469 | 0 | 2026-09-28 10:16 |
| `resolve` | 3,470 | 3,470 | 0 | 2026-09-28 10:16 |
| **`entry_real`** | **0** | — | — | **NEVER** |
| `learn` | 0 | — | — | NEVER (intended) |

- Deployed release: `5eb6094` (includes all Phase 8 code; later commits by other sessions touched only Futures/Spot/Stablecoin/logging — the one change to `api/predictions.ts`, `b88f25a`, moved `logToGitHub` to a shared logger module and does not affect Engine/entry logic).
- `jobs.d`: only `prediction-discovery-cron`, `prediction-shadow-entry-cron`, `prediction-resolve-cron` present.
- Resolution is working at scale: 56,618 autonomous predictions resolved in the window.
- Manual Demo (separate product) is working: 14 manual demo trades total, 5 opened since 09-16.

## 2. Opt-in state — Phase 8 config side works

| telegram_id | Capital | Max/trade | Categories | Enabled | Since |
|---|---|---|---|---|---|
| 98758441 (owner) | $1,000 | $100 | `all` | true | 2026-09-16 09:49 |
| 471348581 | $1,000 | $100 | `sports` | true | 2026-09-18 15:30 |

`prediction_autonomous_trades`: **0 rows** (ever).

## 3. Why zero trades — primary cause (definitive)

`autonomousEntryTick(dryRun=false)` is only reachable via `POST action=autonomous-enter`, which only the VPS job runner calls, and only if (a) the runner has a branch for it and (b) `jobs.d/prediction-enter-cron.enabled` exists. **Neither exists.** `grep -c 'prediction-enter-cron' /usr/local/libexec/signalverse-jobs` → `0`. The branch drafted in Phase 7 (scratchpad, never installed) and the gate file were an explicitly separate, owner-authorized activation step that did not happen. The UI's "Demo Entry: Disabled" badge was accurate; the per-user "My participation: Enabled" toggle is independent of it by design, which in practice created the expectation that trading had started.

## 4. How much opportunity existed (shadow funnel, every tick aggregated)

- 3,469 shadow ticks, **156,222** candidate evaluations.
- Skip reasons: `NOT_ACTIONABLE` 154,579 (98.9%), `TRADEABILITY_SPREAD_TOO_WIDE` 1,233, `TRADEABILITY_INSUFFICIENT_DEPTH` 353.
- Decisions: STRONG 0 · **OPPORTUNITY 1,643** · WATCH 2,635 · NEUTRAL 42 · AVOID 127,228 · INSUFFICIENT_DATA 24,674.
- OPPORTUNITY by category: **crypto 1,643 · sports 0 · politics 0 · economics 0 · science 0** (29 unique crypto markets).
- `would_open=true`: **57 events across only 6 unique markets** — with per-(user, market) duplicate protection, that is at most 6 positions for an `all` user and **0 for the sports-only user**.

## 5. What would have happened if the gate had been on (HYPOTHETICAL — not real trades)

Sizing for the owner's account ($1,000 / $100 max): conservative Kelly caps at 2% of capital = $20, below the $100 cap, so ~$14–$20 per position.

| Market | Side | Market YES | Model YES | "Edge" | Resolved | Hypo PnL |
|---|---|---|---|---|---|---|
| BTC above $72k on Sep 18 | NO | 94.0% | 25.9% | 61pp | **YES** | **−$20** |
| BTC reach $92k Sep 21–27 | YES | 13.1% | 79.5% | 55pp | **NO** | **−$20** |
| BTC reach $94k Sep 21–27 | YES | 8.0% | 80.1% | 67pp | **NO** | **−$20** |
| ETH reach $3,200 Sep 21–27 | YES | 6.4% | 81.9% | 75pp | not yet | — |
| Bitget resumes withdrawals by Sep 27 | YES | 8.0% | 74.1% | 64pp | not yet | — |
| Bitget resumes withdrawals by Sep 30 | NO | 94.0% | 80.4% | 13pp | not yet | — |

**Resolved: 3 · Wins 0 · Losses 3 · −$60.** The unresolved three share the same profile (model claims ~74–82% on outcomes the market prices at 6–8%).

## 6. Root cause of the losing "edges" — Engine calibration defect

Model probability (`combineEvidenceToProbability`) = logistic of a **50% prior** (ignores the market price) plus Σ `direction × weight × reliability × 1.5` over evidence items with **binary** direction. Stored evidence on the six would-open decisions:

- **`own-resolved-history` (Base Rate) is the largest term in every case: fixed ±1.050 logit** (weight 1.00 × reliability 0.70 × 1.5). Its statistic — "X% of 200 previously-resolved crypto markets settled YES" — has nothing to do with the specific question, strike, or polarity.
  - "BTC above $72k": the BTC trend was neutral (0); the **only** non-zero input was Base Rate "42% settled YES" → model 25.9% YES vs market 94% → bet NO → lost.
  - "Bitget by Sep 27": the **only** evidence was Base Rate "73% YES" → model 74.1%, and because confidence = mean(weight × reliability), a single 0.7 item yields **confidence 70** → ranked #1.
- **The statistic is unstable:** it read 42% → 75% → 90% → 78% → 73% within ~10 days (currently 64%). `computeBaseRateEvidence` uses an **unordered** `.limit(200)`, so it samples whatever 200 resolved rows PostgREST returns first — dominated by bursts of near-duplicate markets resolving together.
- **Crypto trend evidence** (`computeCryptoTrendEvidence`) is "last close vs 30-day SMA", direction ±1 at ±2% — it has no notion of distance to the question's strike (the Engine's own explanation text already discloses this: "not a dedicated price-target probability model").
- **The AI evidence was right and got outvoted:** on BTC $92k / $94k / ETH $3.2k the AI said "highly unlikely/improbable" (−0.42 logit), overwhelmed by Base Rate (+1.05) + trend (+0.72 to +0.90).

**Timeline proof (unintended consequence of Phase 5):** first `resolve` tick ever = **2026-09-14 18:01:03 UTC**; first decision ever carrying Base Rate evidence = **2026-09-14 18:11:13 UTC**. `computeBaseRateEvidence` returns `null` below 10 resolved samples, so it was dormant until `resolve` produced data — then it switched on with no code change and immediately became the dominant input. The Phase 3 design audit (2026-09-15 report) had flagged exactly this binary-direction risk and recommended keeping Base Rate disabled for categories without genuine Yes/No semantics; Base Rate is not gated behind `learn`, so keeping `learn` off did not contain it.

The Tradeability Gate did its job: it rejected the vast majority of these fake edges (thin books, 7–10% spreads). Six slipped through.

## 7. Why the Sports-only user can never get a trade today

Sports produced **0** OPPORTUNITY decisions in 12 days. The Engine has no sports-specific evidence source, so a sports-only preference currently maps to "never trades". This is correct behavior of the category filter, but a product-level expectation gap.

## 8. Verdict

| Question | Answer |
|---|---|
| Is Production up? | Yes — 10,409 ticks, 0 failures. |
| How many opportunities? | 1,643 OPPORTUNITY decisions (29 crypto markets); 57 would-open events on 6 markets. |
| Did it enter? | **No — 0 entries.** `entry_real` never ran (runner branch + gate file never installed). |
| Would it have profited? | **No.** 3/3 resolved hypothetical positions lost; remaining 3 same pattern. |
| Is enabling the gate the fix? | **No.** It would mostly reproduce these losing entries. |

## 9. Recommended next steps (each requires explicit owner authorization — Engine logic)

1. **Neutralize Base Rate evidence** for the autonomous path (minimum: disable it; better: only use it for question types with real Yes/No semantics, make its direction proportional to |yesRate − 50%|, and order the sample deterministically). This matches the Phase 3 recommendation.
2. **Crypto price-threshold realism:** either incorporate distance-to-strike/volatility (a real price-target probability), or exclude price-threshold crypto questions from autonomous entry until such a model exists.
3. **Re-observe in shadow** for a meaningful window after the fix; require that would-open decisions show plausible edges (not 55–75pp) and a non-negative resolved track record.
4. **Only then** install the prepared `prediction-enter-cron` runner branch + create the gate file (owner-run, same staging / `bash -n` / atomic install procedure as Phase 5).
5. **UX:** make it explicit to users who enable "My participation" that system-wide autonomous entry is not yet active, so the empty history is not mistaken for a malfunction.

Real Trading remains architecturally OFF. No gate, config, code, or data was changed by this audit.
