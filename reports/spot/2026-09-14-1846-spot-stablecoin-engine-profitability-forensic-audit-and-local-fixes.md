# Stablecoin Engine — Profitability Forensic Audit + Legacy/New Separation Fixes (Local Only, No Deploy)

## Metadata

- Date: 2026-09-14 (session continued into 2026-09-15)
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine — Allocation architecture)
- Mode: Forensic audit + local code fix + test, per the user's explicit instruction — **no Deploy, no Push, no Migration execution in this task**. Reference report: `reports/spot/2026-09-14-0750-spot-stablecoin-engine-production-application-deploy-e2e-smoke-test.md`.
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: fd0909ec34e7ba78f2794d13a0805bf676154f98
- Ending commit: fd0909ec34e7ba78f2794d13a0805bf676154f98 (**unchanged — nothing was committed or pushed to signalverse-main in this task**)

## Objective

Two problems were reported from the live production deploy: (1) apparently-profitable opportunities are being rejected constantly, and (2) the Legacy/Old architecture and the New Allocation architecture are still visibly mixed in the UI/flow. Trace the full decision path with real data, determine whether each rejection is a genuine market-conditions non-opportunity or an engine defect, and separately determine exactly where Old/New are mixed — fixing only confirmed bugs, never lowering a threshold merely to produce more trades, and stopping before any deploy for the user's review.

## Scope

Code review of `api/stablecoin-engine.ts`/`src/app/App.tsx`, read-only live Binance market data (public endpoints, one live signed fee re-verification via the VPS using existing admin credentials — no orders, no writes), local code fixes, a new (unapplied) migration file, new/updated tests, build, and this report. No SSH write operations, no database writes, no migration execution, no deploy, no push to `signalverse-main` in this task.

## Part 1 — Profitability Forensic Audit

### The exact production case (TUSDUSDT, $50, "Fees eliminate profit")

Traced field-by-field using the pure engine functions in `api/stablecoin-engine.ts`, against the real production values from the prior deploy report:

| Field | Value | Formula |
|---|---|---|
| `notionalUsd` | $50 | Trading Capital (fixed tranche) |
| `grossSpreadPct` | +0.02% | from live VWAP vs. $1 par |
| `grossProfitUsd` | $0.01 | `notionalUsd × grossSpreadPct / 100` |
| `feeUsd` | $0.00 | pair was live-verified zero-fee |
| `executionImpactUsd` | $0.00 | VWAP == bestPrice (book fully absorbed the $50 at the top level) |
| `netProfitUsd` | $0.01 | `grossProfitUsd − feeUsd − executionImpactUsd` |
| `minNetProfitUsd` | $0.05 | `DEFAULT_THRESHOLDS.minNetProfitUsd`, `api/stablecoin-engine.ts` |
| Result | REJECTED | `$0.01 < $0.05` |

**CONFIRMED: the rejection decision itself is mathematically correct** — $0.01 genuinely is below the $0.05 floor. **CONFIRMED BUG: the reported reason, `"Fees eliminate profit"`, was wrong** — with `feeUsd = $0` and `executionImpactUsd = $0`, nothing was "eliminated by fees"; the gross profit itself, with zero deductions, was already short of the floor. This is a real mislabeling bug in `classifyStablecoinExecutability`, now fixed (see Part 3).

### Is the $0.05 absolute minimum-profit threshold itself wrong?

**No — not for the capital sizes this architecture is actually designed for.** A live, read-only Binance market audit (all 6 currently-`TRADING` zero-fee-verified stablecoin pairs, both directions, at $50 and at $2,000 — the mandate's own worked-example capital size) found:

| Pair | Side | Gross spread | Net profit @ $50 | Net profit @ $2,000 | Verdict |
|---|---|---|---|---|---|
| `TUSDUSDT` | BUY_BASE | +0.02–0.04% | $0.01–0.02 | $0.49 | Reject @$50, executable @$2,000 |
| `FDUSDUSDT` | BUY_BASE | **+0.09%** | **$0.045** | **$1.80** | **Reject @$50 (by $0.005), clearly executable @$2,000** |
| `FDUSDUSDC` | BUY_BASE | **+0.09%** | **$0.045** | **$1.80** | Same as above (mirrored pair) |
| `USDCUSDT`, `USD1USDT`, `USD1USDC` | both | negative or below the 0.01% gross-spread floor | — | — | **Genuinely no opportunity right now, honestly reported** |

A live signed `tradeFee` re-verification (via the VPS, using the already-connected admin Binance credential, read-only) at the time of this audit confirmed `FDUSDUSDT`, `FDUSDUSDC`, and `TUSDUSDT` are all still zero-fee (`maker: 0, taker: 0`).

**Conclusion: the market has a real, currently-live 0.09% opportunity on FDUSDUSDT/FDUSDUSDC.** The engine correctly captures it at realistic Trading Capital ($2,000+, exactly this project's own worked example) and correctly rejects it at $50 — by a margin of exactly half a cent. **This is not a threshold defect; it is a direct, expected consequence of using an unrealistically small Trading Capital ($25–$50) for this task's own smoke tests.** The threshold was NOT changed.

### The user's proposed `MAX(absolute floor, ROI% × capital)` model — evaluated mathematically, not adopted

Worked through with real numbers: `MAX` always selects the **larger** of the two candidate thresholds. For small capital ($50), `ROI% × capital` is smaller than the $0.05 absolute floor for any reasonable ROI% (e.g. 0.1% × $50 = $0.05, roughly equal; anything lower and the absolute floor still wins) — so `MAX` **cannot lower** the effective bar for small capital; it can only raise the bar for large capital. It does not solve the reported problem and was not adopted. (A `MIN`-based hybrid would lower it for small capital, but was rejected on the merits: the $0.05 floor functions as a "worth the real-world execution risk" filter — mis-estimated VWAP, latency, tick-size rounding — and that risk is roughly constant in dollar terms regardless of trade size, which argues for keeping an absolute floor, not scaling it down with capital.)

### Round-trip / fee-double-counting check

Traced explicitly: a single decision (one `BUY_BASE` or `SELL_BASE` leg) is charged its fee **exactly once** (`computeFeeUsd(notionalUsd, feeBps)`, called once per `decideStablecoinTrade` call). "Round trip" in this engine's design means two **separate** decisions/trades over time (a `BUY_BASE` capture now, a `SELL_BASE` capture later) — never one order paying two fees. Confirmed correct, no bug found here.

## Part 2 — Required Liquidity / Initial Inventory — CONFIRMED ARCHITECTURAL BUG, FIXED

### The exact production case (FDUSDUSDC, Trading Capital=$25, Capacity=1, Required Liquidity=$25)

The `create_stablecoin_pair_allocation()` function (already applied to production) seeded inventory as a 50/50 split: `v_required_liquidity / 2` into each of the base and quote assets. For this case: `$25 / 2 = $12.50` per asset.

A single trade of Trading-Capital size (`$25`) in **either** direction needs the **full** `$25` available in **one** asset (whichever is being spent). With only `$12.50` per side, **`$12.50 < $25` is mathematically guaranteed in both directions, permanently, regardless of market conditions** — this exactly reproduces the live production symptom (`FDUSDUSDC` returning `INSUFFICIENT_OPPORTUNITY_LIQUIDITY` on both `BUY_BASE` and `SELL_BASE` in the real deployed E2E test).

Generalized: for **any** `opportunityCapacity = 1`, a 50/50 split always yields exactly `Trading Capital / 2` per side — always less than the `Trading Capital` needed for one trade. Even at `opportunityCapacity = 2`, one side holds exactly `Trading Capital` (enough for exactly one trade, zero buffer for a **second same-direction** capture) — never actually delivering the documented semantic "Opportunity Capacity = N repeated same-direction opportunities." **This is a confirmed architectural bug, not a market-conditions issue.**

### The fix

`create_stablecoin_pair_allocation()` now seeds the **entire** Required Liquidity amount into the **quote** asset (a deterministic, documented choice — `BUY_BASE`, spending quote to acquire base, is this engine's first-evaluated direction), leaving the base asset at `$0` initially:

- Required Liquidity itself is **unchanged** — still `Trading Capital × Capacity`, still the total capital reserved, still never the ROI denominator.
- For Capacity=1, Trading Capital=$25: quote=`$25`, base=`$0` — now sufficient for exactly one `BUY_BASE` trade. `SELL_BASE` correctly stays unavailable until a `BUY_BASE` trade first produces some base balance — matching, not contradicting, the already-established "no forced rebalancing, wait for a reverse opportunity" design.
- For Capacity=3, Trading Capital=$2,000 (the mandate's own worked example): quote=`$6,000`, base=`$0` — genuinely supports exactly 3 consecutive `BUY_BASE` captures before needing a reversal (`floor($6,000 / $2,000) = 3`), where the old 50/50 seeding would have supported only 1 (`floor($3,000 / $2,000) = 1`).

**Prepared, reviewed, NOT applied to production**: `migrations/stablecoin_allocation_inventory_seed_fix.sql` — a single `CREATE OR REPLACE FUNCTION` on the already-existing `create_stablecoin_pair_allocation`, purely additive, touches zero existing rows, changes future allocation-creation behavior only.

## Part 3 — Legacy vs. New Architecture — Three Confirmed Mixing Points, Fixed

1. **UI**: the "Demo Status" card still had a fully operational capital-preset picker and "START DEMO" button, sitting right next to the new Allocations section.
2. **API**: `action=start-demo` could still create a new `stablecoin_demo_setups` row — but since `runStablecoinDemoCycle` (the new orchestrator) only ever processes a setup's `ACTIVE` allocations, a setup created this way would sit forever as an apparently-`RUNNING`, functionally-dead entity: the scheduler silently does zero work for it, with no error to signal the problem.
3. **A subtler bug found during this audit**: because `select-pair` also creates brand-new setups (when no `RUNNING` setup exists), the four legacy read actions' "most recent setup for ADMIN_ID" auto-discovery (`demo-status`, `trade-history`, `decision-history`, `pair-monitoring`) could — and in production, did — surface a **current, allocation-owning** setup, mislabeled as "Legacy" (shown with `capital_usd=0`, `initial_allocation={}`, for what is actually today's live operational setup). This is the precise mechanism behind the reported Old/New mixing, not merely a UI-labeling oversight.

### Fixes applied

- **`start-demo` retired**: now unconditionally returns `410 Gone` with a message pointing at the real flow (`select-pair` via `live-pair-monitor`). Zero `INSERT` statements remain reachable in this action. The action itself was kept (not removed, matching this project's "don't gratuitously remove actions" convention) purely to explain the retirement.
- **New helper `getMostRecentLegacyOnlySetupId()`**: explicitly excludes any `setup_id` that owns a `stablecoin_pair_allocations` row before picking "most recent" — used by all four legacy read actions, replacing their old unfiltered query. This is a structural exclusion (a real query filter), not a UI convention someone could forget.
- **UI**: the capital-preset picker and "START DEMO" button — along with their now-fully-dead state (`capital`, `customCapital`, `starting`, `startDemo`, `STABLECOIN_CAPITAL_PRESETS`) — were removed entirely, not merely hidden. The Legacy card is now visually distinct (dashed border, muted background), explicitly labeled **"Legacy / Archived Data"**, states plainly that it is no longer operational and points at Live Pair Monitor/Allocations for new capital, and offers only a Stop button (administrative cleanup for any setup still `RUNNING` from before this fix) — never a way to start new legacy activity. The New Architecture sections (Allocations, Live Pair Monitor) remain the first, primary content in the panel.

## Files Changed

- `api/stablecoin-engine.ts` — reason-label fix (`'Profit below minimum'` vs `'Fees eliminate profit'`); `getMostRecentLegacyOnlySetupId()` + its use in all 4 legacy read actions; `start-demo` retired to `410`.
- `src/app/App.tsx` — removed the Start/capital-picker UI and its dead state; restyled the Legacy card as explicitly archival; added the `'Profit below minimum'` bilingual label.
- `migrations/stablecoin_allocation_inventory_seed_fix.sql` (**new, NOT applied**) — corrected inventory seeding in `create_stablecoin_pair_allocation()`.
- `scripts/stablecoin-engine-test.mjs` — 3 existing checks updated to match `start-demo`'s new retired behavior; 9 new test blocks (TEST 30–38) added, covering: the exact TUSDUSDT reason-label bug and its fix; the FDUSDUSDT/FDUSDUSDC $50-vs-$2,000 real-market comparison; round-trip fee semantics; the exact $25/Capacity=1 Required-Liquidity/inventory mismatch and its fix; the Capacity=3/$2,000 generalization; Legacy-read-action isolation; `start-demo`'s retirement; scheduler behavior on allocation-less setups; and UI Old/New separation.

## Tests Executed

| Suite | Result |
|---|---|
| `node --test scripts/stablecoin-engine-test.mjs` | **PASS** — all checks, including the 9 new blocks (30–38) |
| `npm run build` (web + admin) | **PASS** |
| `git diff --check` | **PASS** (one benign Windows LF→CRLF warning, not a whitespace error) |
| Live Binance market audit (6 pairs × 2 sides × 2 capital sizes, read-only) | **PASS** — real data captured and traced, see Part 1 |
| Live signed fee re-verification (VPS, read-only, existing admin credential) | **PASS** — FDUSDUSDT/FDUSDUSDC/TUSDUSDT still zero-fee at audit time |

No pure-function test was blended with a live/structural one in the reporting above — see each test's own description in `scripts/stablecoin-engine-test.mjs` for which category it falls into.

## Production Safety

No SSH write operation, no database write, no migration execution, and no deploy occurred in this task. The only production/VPS interaction was one read-only, signed `tradeFee` call (via the existing admin Binance credential already used for exactly this purpose) and standard read-only Binance public market-data calls. Real Trading remains fully disabled (unaffected by this task). `signal0verse/signalverse-main` remains at commit `fd0909e` — nothing committed, nothing pushed.

## Remaining Issues / Awaiting Approval

1. **Awaiting explicit user approval before deploying** the two application-code fixes (`api/stablecoin-engine.ts`, `src/app/App.tsx`) and before applying `migrations/stablecoin_allocation_inventory_seed_fix.sql` to production.
2. The $0.05 absolute minimum-profit threshold was deliberately left unchanged — flagged here in case the user wants a separate, explicit discussion about whether smoke-testing with more realistic Trading Capital (rather than $25–$50) would better reflect real behavior going forward.
3. Two backup-coverage gaps and the stale `postgrest.service` unit description flagged in earlier reports remain open and out of scope for this task.

---

## FINAL STATUS TABLE

```
FORENSIC AUDIT COMPLETED: YES
PROFITABILITY REJECTION (TUSDUSDT $50 case): CORRECT (mathematically verified)
REASON LABEL BUG ("Fees eliminate profit" when fee=$0): CONFIRMED AND FIXED
MINIMUM PROFIT THRESHOLD: UNCHANGED (verified appropriate for realistic capital; not miscalibrated)
REQUIRED LIQUIDITY / INVENTORY SEEDING: CONFIRMED BUG, FIXED (migration prepared, NOT applied)
LEGACY/NEW UI MIXING: CONFIRMED AND FIXED (Start button removed, Legacy card restyled/relabeled)
LEGACY/NEW API MIXING (start-demo): CONFIRMED AND FIXED (retired to 410)
LEGACY/NEW DATA MIXING ("most recent setup" bug): CONFIRMED AND FIXED (structural exclusion added)
LEGACY DATA CHANGED: NO
LEGACY DATA DELETED: NO
LEGACY DATA BACKFILLED: NO
NEW MIGRATION EXECUTED: NO (prepared only)
REAL TRADING ENABLED: NO
REAL BINANCE ORDER SENT: NO
BUILD: PASS
REGRESSION TESTS: PASS (38 blocks, including 9 new)
GIT DIFF CHECK: PASS
CODE COMMITTED: NO
CODE PUSHED: NO
PRODUCTION DEPLOYED: NO
AWAITING: user approval before deploy
```
