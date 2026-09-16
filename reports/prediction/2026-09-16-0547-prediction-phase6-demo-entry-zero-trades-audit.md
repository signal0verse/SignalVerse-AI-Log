# Prediction Market — Phase 6: Why Autonomous Demo Trades Are Zero (Forensic Audit)

## Metadata

- Date: 2026-09-16, ~05:00–05:47 UTC
- Task ID: prediction-phase6-demo-entry-zero-trades-audit-2026-09-16
- Module: prediction
- Mode: **READ-ONLY forensic audit.** No code, config, threshold, gate, or database write was made. Nothing was enabled.
- Prompted by: user-reported UI observation — manual Demo trading shows $250 exposure / +$7.28 PnL across five $50 positions, while Autonomous Monitoring shows 0 open autonomous trades and badges reading "Demo Entry: Disabled" / "Real Trading: Disabled".
- Builds on: Phases 1–5 (`reports/prediction/2026-09-14-*`, `2026-09-15-0000-*`), all re-confirmed still accurate — `api/predictions.ts` has had **zero commits** since the Phase 4 commit (`613a3ed`), verified via `git log 613a3ed..HEAD -- api/predictions.ts` returning empty.

---

## Executive Summary

**Two independent, both-true causes, plus one significant new finding that changes the picture from Phase 1:**

1. **The autonomous entry pathway (`entry_real` / what the UI calls "Demo Entry") has no scheduler gate at all** — confirmed fresh, directly on the VPS, right now. This alone is sufficient to explain zero autonomous trades, structurally, regardless of anything else.
2. **The UI's "Demo Entry: Disabled" / "Real Trading: Disabled" badges are hardcoded, static text — not bound to any live state.** They happen to be pointing at the truth right now (the gate genuinely is off), but they are not proof of it, and would keep saying "Disabled" even if the gate were enabled tomorrow. This is a real, separate finding in its own right, independent of cause #1.
3. **New since Phase 1 (2026-09-14): the engine has now produced 29 real `OPPORTUNITY` decisions and, critically, 3 fully-qualified `would_open:true, rank:1` events** in the last ~8 hours — meaning on 3 separate real occasions, had the entry gate been enabled, a virtual Demo position **would actually have opened**. Phase 1's "zero opportunities, ever" finding is **no longer current** — it was true as of 2026-09-14 and is not true as of 2026-09-16. This report updates that record rather than silently superseding it.

**No virtual Demo bankroll needs to be created, seeded, or initialized.** The autonomous sizing math (`AUTONOMOUS_VIRTUAL_BANKROLL = 1000`) is a **hardcoded literal in source code**, not a balance read from any table — it cannot run out, does not need funding, and is completely unrelated to the manual Demo ledger the user's screenshots show.

---

## 1. Autonomous Entry Gate

### 1.1 Exact code path

- Action `autonomous-enter` (`api/predictions.ts`, action-routing block) → `recordAutonomousRun('entry_real', (runId) => autonomousEntryTick(false, runId))`.
- `autonomousEntryTick(dryRun=false, ...)` runs the **identical** evaluate → gate → rank → size pipeline as Shadow Entry (`dryRun=true`), with exactly one branch point: when `dryRun` is false, a genuinely-qualifying candidate reaches `supabase.from('prediction_autonomous_trades').insert({...status:'OPEN'...})`.
- This dispatch requires `Authorization: Bearer ${process.env.CRON_SECRET}` — same as every other autonomous action. It has **no other internal flag check** (confirmed: no `getFlags()` call anywhere in this dispatch branch or inside `autonomousEntryTick`/`autonomousDiscoveryTick`/`autonomousResolutionTick` — `getFlags()` is called only by the manual-trading and feed-overview endpoints, Section 3).

### 1.2 Is `autonomous-enter` actually disabled? — Confirmed directly, right now, on the VPS

```
$ ssh ... "ls -la /etc/signalverse/jobs.d/ | grep -i prediction"
prediction-discovery-cron.enabled     (Sep 9)
prediction-resolve-cron.enabled       (Sep 14, Phase 5)
prediction-shadow-entry-cron.enabled  (Sep 9)

$ ssh ... "grep -n 'autonomous-enter[^-]|prediction-enter-cron|prediction-demo-entry' /usr/local/libexec/signalverse-jobs"
(only comment-line matches — zero `job_enabled`/`call_api` wiring for entry_real exists anywhere in the script)
```

**No `prediction-enter-cron` (or equivalently-named) gate file exists, and the job-runner script itself has no branch that would ever call `action=autonomous-enter`, even if such a gate file existed.** This is not merely "turned off" — the wiring the Phase 3 design audit explicitly deferred ("autonomous-enter/entry_real remains deliberately unwired... a later, separately reviewed phase") has still never been added, through Phase 4 and Phase 5.

**Database corroboration** (all-time, `prediction_autonomous_runs`):
| `run_type` | rows, all-time |
|---|---|
| `discover` | thousands (healthy, ongoing) |
| `entry_shadow` | thousands (healthy, ongoing) |
| `resolve` | 427 (Phase 5, healthy, ongoing) |
| **`entry_real`** | **0** |
| `learn` | 0 |

Zero `entry_real` rows, ever — consistent with zero scheduled invocations. This is not just "no trades were opened," it's "the action has never once been called by anything."

### 1.3 Is this alone sufficient to explain zero trades?

**Yes, structurally sufficient on its own** — with no scheduler gate and no other caller of `action=autonomous-enter` anywhere in the codebase (confirmed: the only two things that ever call `autonomousEntryTick` are the `entry_real` dispatch above and the `entry_shadow` dispatch with `dryRun=true`, and `entry_shadow` can never reach the trade-insert line by construction, per Phase 4's own re-verified test `prediction-shadow-entry-test.mjs`), zero trades is the only possible outcome regardless of decision quality. **But it is not the only true cause** — Section 4 shows a second, independent reason would also apply most of the time, and Section 1.2's finding doesn't mean "there was never anything worth entering," which Section 4 addresses directly.

---

## 2. Virtual Demo Capital

### 2.1 Does autonomous Demo Entry require a virtual/demo USD bankroll?

**No pre-funded balance is required or checked.** Tracing `computeAutonomousPositionSize()` exactly:

```ts
const AUTONOMOUS_VIRTUAL_BANKROLL = 1000; // notional only, for the Kelly formula's ratio math - never a real compounding balance
const AUTONOMOUS_RISK_PROFILE: RiskProfile = 'conservative';
const AUTONOMOUS_MAX_POSITION_USDC = 15; // hard ceiling regardless of what Kelly recommends
function computeAutonomousPositionSize(modelProbPct, bestAskPrice) {
  const kellyRecommendedUsdc = recommendPositionSize(AUTONOMOUS_VIRTUAL_BANKROLL, modelProbPct, bestAskPrice, AUTONOMOUS_RISK_PROFILE);
  const finalSizeUsdc = Math.min(kellyRecommendedUsdc, AUTONOMOUS_MAX_POSITION_USDC);
  return { kellyRecommendedUsdc, finalSizeUsdc };
}
```

`AUTONOMOUS_VIRTUAL_BANKROLL` is a **hardcoded number in the source file** — not a column, not a row, not a balance ever read from `prediction_autonomous_trades` or any other table. Every single call to this function uses the same literal `1000`, forever, regardless of how many autonomous trades have opened or closed before it (there is no compounding, no depletion, and — confirmed by design comment — this is deliberate: "never a real compounding balance"). **These three constants (`AUTONOMOUS_VIRTUAL_BANKROLL=1000`, `AUTONOMOUS_MAX_POSITION_USDC=15`, `AUTONOMOUS_RISK_PROFILE='conservative'`) are confirmed still present, unchanged, and in active use in the currently-deployed code** — not assumed from the original design report; verified by reading the live file just now (`git log` confirms zero changes to this file since Phase 4).

### 2.2 Consequence

**There is nothing to "supply" or "initialize."** If `entry_real` were enabled tomorrow, the very next qualifying candidate would be sized immediately using this same constant — no setup step, no seed transaction, no balance table to populate. This directly answers Section 5 of the task: **no virtual bankroll initialization is needed**, because none was ever designed to be read from persistent state in the first place.

---

## 3. Manual Demo vs. Autonomous Demo — Confirmed Fully Separate

| | Manual Demo (what the screenshots show) | Autonomous Demo (`entry_real`) |
|---|---|---|
| Table | `prediction_trades` (has `telegram_id`, user-scoped) | `prediction_autonomous_trades` (system-owned, `telegram_id`-free by design — original migration's own comment: *"System-owned, telegram_id-free, freely-reversible DEMO ledger... structurally separate from prediction_trades... so autonomous activity never mixes into a real user's balance/history"*) |
| Balance source | `DEMO_START_BALANCE = 1000` (a **separate**, per-user notional constant) **plus** the user's own realized PnL/deployed capital, computed live: `balance = DEMO_START_BALANCE + realizedPnl - deployed` (`api/predictions.ts`, the `mode==='demo'` / `action==='portfolio'` handler) | `AUTONOMOUS_VIRTUAL_BANKROLL = 1000`, a **different**, hardcoded, non-compounding literal (Section 2) |
| Gate | `flags.demoEnabled` from `getFlags()` (reads `settings.prediction_demo_enabled` — currently unset in `settings`, so defaults to `true`, i.e., manual Demo is enabled, matching the screenshots showing it working) | No `getFlags()` call anywhere in the autonomous path — gated **only** by the (absent) scheduler entry, Section 1 |
| The user's $250 exposure / +$7.28 PnL | Lives entirely in `prediction_trades`, computed from the formula above | **Zero relationship.** Confirmed: nothing in `autonomousEntryTick`, `computeAutonomousPositionSize`, or `prediction_autonomous_trades` reads, writes, or references `prediction_trades`, `DEMO_START_BALANCE`, or any per-user balance at all. |

**Both happen to use the coincidentally-identical number `1000` as their respective starting/notional amount** (`DEMO_START_BALANCE` and `AUTONOMOUS_VIRTUAL_BANKROLL`) — this is very likely why the two could be mistaken for the same thing, but they are two textually-identical-valued, functionally-independent constants in different parts of the same file, feeding two structurally separate ledgers that never interact.

---

## 4. Decision vs. Entry — the Picture Has Changed Since Phase 1

### 4.1 Current decision distribution (reliable `count:exact` queries, all-time, `telegram_id IS NULL`)

| Decision | Count | % |
|---|---|---|
| INSUFFICIENT_DATA | 65,731 | 71.5% |
| AVOID | 24,339 | 26.5% |
| WATCH | 1,776 | 1.9% |
| NEUTRAL | 10 | 0.01% |
| **OPPORTUNITY** | **29** | **0.032%** |
| STRONG_OPPORTUNITY | 0 | 0.0% |
| **Total** | **91,885** | |

(A first pass using client-side pagination without a stable sort order produced a slightly inflated OPPORTUNITY count of 47 due to concurrent inserts shifting offsets mid-scan on this actively-written table — a real methodological pitfall, disclosed rather than silently corrected. The `count:exact` figures above, and the explicit ordered `.eq('decision','OPPORTUNITY')` query used for the sample in 4.2, are the trustworthy numbers.)

**Compare to Phase 1 (2026-09-14, n=67,760): INSUFFICIENT_DATA 88.2%, OPPORTUNITY 0 (0.0%).** INSUFFICIENT_DATA's share has dropped substantially (88.2% → 71.5%) — consistent with Phase 4's lifecycle fix (closed/stale markets no longer clog the eligible pool the way they did) — and, separately and more importantly for this audit, **OPPORTUNITY is no longer categorically zero.**

### 4.2 All 29 OPPORTUNITY decisions, and the 3 that were fully qualified to actually enter

Every one of the 29 occurred between **2026-09-15T21:42 UTC and 2026-09-16T05:41 UTC** (the last ~8 hours), and **every one is a crypto (BTC/ETH) strike-price question** — the same pattern Phase 3's design audit flagged (crypto is the one category with both a genuine order book and a literal Yes/No convention; confidence for these has been observed sitting almost exactly at the `minConfidence=40` boundary, 40–41, across nearly all 29 rows — a marginal, boundary-hugging pattern worth noting, not a robust high-confidence signal).

**Of these 29, exactly 3 rows have `would_open: true, rank: 1`** — meaning they passed every deterministic gate `autonomousEntryTick` checks (`PREDICTION_ACTIONABLE_DECISIONS`, Time Horizon, Tradeability) and were ranked the #1 candidate that tick:

| ts (UTC) | Market | Side | Edge | Confidence |
|---|---|---|---|---|
| 2026-09-15T22:47:24 | Will the price of Bitcoin be above $72,000 on Sept ... | NO | 15.35pp | 40 |
| 2026-09-15T23:02:04 | Will the price of Bitcoin be above $72,000 on Sept ... | NO | 63.55pp | 40 |
| 2026-09-16T00:57:06 | Will the price of Bitcoin be above $72,000 on Sept ... | NO | 17.91pp | 41 |

**These are the exact 3 moments where, had `entry_real` been enabled, a virtual Demo position would genuinely have opened.** This is stated as a fact about what the deterministic code would have done, derived directly from the `would_open`/`rank` fields the entry-tick pipeline itself computes and persists (Phase 4's own observability columns) — not a simulation or a guess.

### 4.3 Would the gate enter anything if enabled *right this second*?

**Not provably, as of the last evaluation (05:41:36 UTC, ~6 minutes before this check) — no OPPORTUNITY has been recorded since.** But given 3 qualifying events in the last 8 hours (roughly one every 2–3 hours), it is reasonable to expect another to occur again on a similar timescale, not something that has stopped happening. This is reported as an observed rate, not a prediction of exactly when the next one will land.

### 4.4 Is zero OPPORTUNITY a second independent cause of zero trades?

**Yes, for the majority of the observation window** (26 of 29 OPPORTUNITY rows did not reach `would_open:true` — most failed `Tradeability` per their recorded `tradeability_reasons`, `SPREAD_TOO_WIDE`/`INSUFFICIENT_DEPTH`, matching Phase 1's finding that nominally-large crypto edges are frequently execution-quality mirages), **but it is not the sole or even the dominant cause overall** — Section 1's missing gate is what turned 3 genuinely-qualified, would-have-opened moments into zero actual trades. Both causes are real and independently sufficient; they are not competing explanations, they are stacked ones.

---

## 5. Test With Virtual Capital — Recommendation, Not Applied

Per Section 2, **no virtual bankroll needs to be created** — none is read from persistent state, so there is nothing to seed. The only thing that would need to happen to test the pathway end-to-end is enabling the `entry_real` gate itself (Section 1), which this audit was explicitly told **not** to do without absolute necessity and explicit justification. This audit did not enable it. **No threshold, Kelly, Edge/EV, confidence, Base Rate, Time Horizon, or Tradeability rule was touched, and no fake opportunity was manufactured** — Section 4's 29 OPPORTUNITY rows and 3 `would_open` events are entirely organic, produced by the unmodified engine against real Polymarket data.

If a future, separately-approved phase wants to actually observe a real (virtual) Demo entry, the **minimal correct change**, following the exact precedent Phase 5 already established for `resolve`, would be:
1. Add one new `elif`-guarded block to `/usr/local/libexec/signalverse-jobs` (mirroring `prediction-resolve-cron` exactly), calling `action=autonomous-enter` under a new `prediction-enter-cron` gate.
2. `npm run backup` first, per standing project convention.
3. Create `/etc/signalverse/jobs.d/prediction-enter-cron.enabled`.
4. This is **not proposed as urgent or recommended right now** — it is presented only because Section 5 of the task asked for the mechanism to be identified, not applied.

**No code or config change was made in this audit.**

---

## 6. Safety Confirmation

- Real Trading: unaffected and still architecturally absent — the `mode==='real'` code path this project's own prior reports describe still returns 501 unconditionally; nothing in this audit touched it.
- No wallet/signature/transaction code was read for modification purposes (only `computeAutonomousPositionSize`/`recommendPositionSize`, pure arithmetic, were inspected).
- Futures, Spot, Fast Trader, Autonomous Supervisor: not referenced anywhere in this audit; `git diff` for this session is empty (no files changed).
- `learn`/calibration: unchanged — still 0 rows, all-time, confirmed again in this audit's own queries.
- `entry_real` (Demo Entry) was **not enabled** during this audit, consistent with the task's explicit instruction to avoid it "unless absolutely necessary and explicitly justified" — it was not necessary to enable it to answer any part of this audit; every finding above came from existing data and existing code.

---

## 7. Tests

No code was changed, so this is a pure regression/sanity check, not validation of anything new:

```
scripts/prediction-autonomous-sizing-test.mjs      : 8 passed, 0 failed
scripts/prediction-calibration-test.mjs            : 12 passed, 0 failed
scripts/prediction-duplicate-protection-test.mjs   : 8 passed, 0 failed
scripts/prediction-market-engine-test.mjs          : 48 passed, 0 failed
scripts/prediction-market-lifecycle-test.mjs       : 41 passed, 0 failed
scripts/prediction-market-lookahead-test.mjs       : 11 passed, 0 failed
```
(Remaining files in the standard 18-file suite were not required to re-verify anything for this audit, since no line of `api/predictions.ts` was touched — the six above were run as a live sanity check that this session's environment and the deployed source agree; all passed cleanly, consistent with zero drift.)

---

## 8. Conclusion — Direct Answer to the Core Question

> "Is Autonomous Monitoring currently failing to enter because it has no demo dollars available, or simply because Demo Entry is disabled, or because there are currently no qualifying OPPORTUNITY decisions?"

**Not the first (no demo-dollars explanation applies at all — Section 2). Primarily the second (Demo Entry has no scheduler gate — Section 1), compounded by the third being true most, but not all, of the time (Section 4).** Concretely:

- **Confirmed facts from code**: `entry_real`'s only gate is a `jobs.d` file that does not exist and a script branch that was never written; `AUTONOMOUS_VIRTUAL_BANKROLL` is a hardcoded, non-persistent literal; manual and autonomous Demo ledgers are structurally independent tables with independent balance formulas; the entry-tick pipeline persists `would_open`/`rank` for every candidate that reaches the ranking step.
- **Observed production state**: 0 `entry_real` runs ever; 0 autonomous trades ever; 29 real `OPPORTUNITY` decisions and 3 fully-qualified `would_open:true` events in the last 8 hours; the UI's "Demo Entry: Disabled" badge is static JSX text, not a live reading of any of the above.
- **Inferred causes**: none beyond what's stated as fact above — no speculation was required, every claim in this report traces to a specific line of code or a specific query result.
- **Recommended next action**: none required to *explain* zero trades — that is now fully explained. If the user wants to *change* this, the decision to enable `entry_real` (Section 5) is theirs to make explicitly, separately, and is not implied or recommended by this audit.

**PASS/FAIL is not the right framing for a diagnostic audit, but stated plainly**: every check performed came back with a clear, evidence-backed answer — no ambiguous or inconclusive result exists in this report.
