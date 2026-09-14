# Stablecoin Engine — Legacy UI Removal, Richer New-Architecture Monitoring, and Production Read-Only Audit (Local Only, No Deploy)

## Metadata

- Date: 2026-09-15 (session continued from 2026-09-14)
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine — Allocation architecture)
- Mode: Read-only production audit + local UI/backend rework, per the user's explicit instruction — **no Deploy, no Push, no Production Write, no change to any real Allocation in this task**. Reference report: `reports/spot/2026-09-14-1913-spot-stablecoin-engine-inventory-seed-fix-and-legacy-separation-production-deploy.md` (the last thing actually deployed).
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: 9cd0d7a90f20eeaab7e2925f75c04f0bbddee3d8
- Ending commit: 9cd0d7a90f20eeaab7e2925f75c04f0bbddee3d8 (**unchanged — nothing was committed or pushed to signalverse-main in this task**)

## Objective

The user reported the Stablecoin panel's UI had become cluttered — legacy/archived-data card, old Monitoring & History tabs, and the old Admin Diagnostic tools were still visible alongside the new Allocation architecture — and asked for: (1) a read-only verification of the current Production state (which Allocations are ACTIVE/STOPPED, whose data is real vs. test), (2) complete removal of every legacy/old-architecture UI surface (nothing hidden, nothing merely de-emphasized), and (3) a materially richer, single, clean New-Architecture UI with more operational detail per Allocation and in the Live Pair Monitor. Explicitly **no Push/Deploy and no Production write** were authorized for this task — verification and local preparation only.

## Scope

Read-only audit against the production database (`signalverse_cutover2`, via SSH + direct RPC read queries — no writes, no Binance orders). Local edits to `api/stablecoin-engine.ts` and `src/app/App.tsx` (UI/monitoring only — no threshold change, no execution-path change). New/updated tests in `scripts/stablecoin-engine-test.mjs`. Build and this report. No SSH write operation, no migration, no deploy, no push to `signalverse-main` in this task.

## Part 1 — Production Read-Only Audit

Connected via `ssh -4 -p 22123 -i ~/.ssh/signalverse_contabo_ed25519 root@13.140.149.56` and ran a dedicated read-only script (`scripts/_tmp-full-audit.mjs`, untracked/local-only — issues only `GET`-style PostgREST reads, zero `INSERT`/`UPDATE`/`DELETE`) against every row of `stablecoin_pair_allocations`, joined with its owning setup, inventory, trades, latest decision, and withdrawals. **LIVE PRODUCTION (read-only)**.

### Classification: mine (test) vs. the real user's data

- **My own test allocations** — `Trading Capital` in the $25–$150 range (plus one isolated $2,000 test allocation created and cleaned up during the prior deploy's smoke test), all already `STOPPED`, all created during earlier smoke-test phases of this project. **Left untouched.**
- **The real user's allocations** — `Trading Capital` in the realistic $2,000–$5,000 range: a mix of one `ACTIVE`-but-currently-dormant allocation, allocations under setups the user has since `STOPPED`, and one allocation the user had just `STOPPED` themselves (under setup `97df1bdc-...`, still `RUNNING`) immediately before asking for this audit ("تست استاپ میکنم" / "استاپ کردم"). **Left untouched — no Stop/Delete/Reset/Binance order was issued by this task on any of these.**
- **Direct confirmation the prior deploy's inventory-seed fix works in real production use**: the real user's newest allocation (`10bbfc15-...`, created 19:22 UTC on 2026-09-14 — **after** the fix in the previous report was deployed) shows the corrected seeding pattern for Capacity=3/$5,000 (`USDC=0`, `USDT=15000`), not the old broken 50/50 split. This is live, real-world evidence the fix is working as designed, observed on the user's own real allocation rather than a synthetic test.

No Allocation's `status` was changed, no inventory row was written, no Binance order was sent anywhere in this audit.

## Part 2 — Legacy/Old-Architecture UI Removed (not just hidden)

From `src/app/App.tsx`'s `StablecoinEnginePanel`, removed entirely: the Legacy/Archived Data card, the old Monitoring & History tabs (status/pairs/trades/decisions sub-tabs), the Cycle Detail (Audit) modal, the Admin Diagnostic Tools card, and every associated dead state/handler (`demoStatus`, `monitorTab`, `pairMonitor`+`loadPairMonitor`, `tradeHistory`/`tradeFilter`/`tradePairFilter`/`tradeOffset`+`loadTradeHistory`, `decisionHistory`/`decisionFilter`/`decisionPairFilter`/`decisionOffset`+`loadDecisionHistory`, `cycleDetail`+`loadCycleDetail`, `discoverPairs`, `stopDemo`, `runTick`, `isRunning`, `report`, `capital`/`customCapital`/`starting`/`startDemo`, `STABLECOIN_CAPITAL_PRESETS`). Confirmed by grep against the final source: no dead identifier, no "START DEMO" string, and no old tab-switcher remains anywhere in the file (the single remaining textual match for "Admin Diagnostic Tools"/"Monitoring & History" is inside this task's own explanatory code comment describing what was removed, not any live code path). **STRUCTURAL (source review + automated test, see Part 5).**

Backend: `action=start-demo` was already retired to `410 Gone` in the prior deployed commit (unchanged by this task) — verified still structurally unable to `INSERT` anything.

Only **Allocations (New Architecture)** and **Live Pair Monitor** remain in the panel.

## Part 3 — Richer New-Architecture Monitoring Added

### Backend (`api/stablecoin-engine.ts`)

- **`computeAllocationLivePreview()` / `getAllocationLivePreview()`** (new): a read-only mirror of `runAllocationCycle`'s evaluation step (discover pair → verify fee live → get real order-book VWAP both directions at the allocation's own fixed Trading Capital → `decideStablecoinTrade`) that **never executes or persists anything** — deliberately kept as a separate function from `runAllocationCycle` so this new monitoring feature carries zero risk to the already-tested, already-deployed execution path. Cached per-`allocationId` for 30 seconds (`allocationPreviewCache`) so the UI's periodic polling cannot spam Binance.
- **`live-pair-monitor` enhanced** with `bestBid`/`bestAsk`/`spreadPct`/`depthOkAtReference` per `TRADING` pair (order book at a fixed $100 reference notional, informational only — never the real trade size), computed only inside the existing 2-minute `pairMonitorCache` refresh, not on every request.
- **`computeAllocationReport` extended** with `losingTrades`, `maxDrawdownUsd`, `maxDrawdownPct`, reusing the same already-tested pure `computeMaxDrawdown` function, fed a chronologically-sorted series of `[Trading Capital, ...executed trades' portfolio_value_after]`.
- **`allocation-status` extended** to also return scheduler state (`setupStatus`, `setupLastTickAt`, `cadenceMinutes`, `nextCycleEtaAt`) and, per allocation, its most recent persisted decision and most recent trade — all from data already being fetched, no new query pattern introduced beyond what the handler already does elsewhere.

Typechecked clean throughout (`npx tsc --noEmit --strict --target es2020 --module esnext --moduleResolution node --esModuleInterop --skipLibCheck api/stablecoin-engine.ts` → exit 0, every time this file was touched).

### UI (`src/app/App.tsx`)

Each Allocation card now shows, in a compact summary: Pair, Status, an executable-now badge (from the live preview) with its blocked reason when not executable, Trading Capital / Opportunity Capacity / Required Liquidity / ROI, Base/Quote Balance labeled with the allocation's actual asset symbols, and Realized/Available Profit. A "Show Details" toggle reveals: **Live Market Preview** (Best Bid/Ask, Spread, Fee Status + verification time, Estimated Gross/Net Profit), **Latest Persisted Cycle** (the most recent actual scheduler decision), **Last Trade**, a **Performance Summary** (Trade Count, Winning/Losing trades, Max Drawdown $/%, Withdrawn, Capture Rate, Liquidity-Constrained/Missed opportunity counts), and an on-demand **Trade/Decision History** scoped to that one allocation (using the pre-existing `allocation-trade-history`/`allocation-decision-history` actions, which existed in the backend already but were never wired into the UI before this task) with enhanced columns: Time, Direction/Side, Notional, Entry/Exit price, Gross P/L, Fee, Execution Impact, Net P/L, Decision + Reason.

The **Live Pair Monitor** list now also shows, per pair: a TRADING status badge, fee (colored when zero+verified), Bid/Ask, Spread%, an order-book depth OK/thin indicator, the selection-blocked reason (its own sub-line), and the cache's last-refreshed time.

Fixed a JSX structural bug introduced mid-edit (a block-body arrow function inside `allocations.map(...)` whose closing braces/`</div>` were not updated to match, causing esbuild errors `"}" is not valid inside a JSX element` / `Expected "}" but found ")"`) — resolved by adding the missing closing `</div>` and correcting the map's closing to `);})}`. Also removed a duplicate "Show History" toggle left over from an intermediate edit, merging its content into the single new "Show Details" section.

## Part 4 — Density / No-Clutter Rule

Per the user's explicit instruction, only the compact summary line is shown by default per Allocation; every deeper field (Live Market Preview, Latest Persisted Cycle, Last Trade, Performance Summary, History) sits behind the one "Show Details" toggle, loaded on demand (trade/decision history is only fetched when a user actually opens that tab, not eagerly for every allocation on every poll).

## Files Changed

- `api/stablecoin-engine.ts` — `computeAllocationLivePreview`/`getAllocationLivePreview` + 30s cache (new); `live-pair-monitor` extended with bid/ask/spread/depth (new, cache-gated); `computeAllocationReport` extended with `losingTrades`/`maxDrawdownUsd`/`maxDrawdownPct`; `allocation-status` extended with scheduler info + per-allocation last trade/decision/live preview.
- `src/app/App.tsx` — full removal of the Legacy/Archived Data card, old Monitoring & History tabs, Cycle Detail modal, Admin Diagnostic Tools card, and all associated dead state; per-Allocation card rewritten with the richer summary + Details block described in Part 3; Live Pair Monitor list enhanced with bid/ask/spread/depth.
- `scripts/stablecoin-engine-test.mjs` — TEST 38 updated twice (once to check for the *absence* of legacy code identifiers rather than presence, once to match the renamed "Live Market Preview"/"Latest Persisted Cycle"/"Max Drawdown" section headers after the UI rewrite); 4 new test blocks added (TEST 39–42) covering: `allocation-status`'s new scheduler/last-trade/last-decision fields; the live-preview function's read-only isolation from the execution path (never calls `simulateStablecoinTrade`/`recordRejectedOpportunity`/`persistCycleDecisions`) and its per-allocation caching; the enhanced `live-pair-monitor`'s cache-gated bid/ask/spread/depth computation; and `computeAllocationReport`'s new win/loss + Max Drawdown arithmetic (real numeric trace: peak $1,010 → trough $997 → drawdown exactly $13, verified order-independent).

No other file in the repository was touched.

## Tests Executed

| Suite | Result |
|---|---|
| `node --test scripts/stablecoin-engine-test.mjs` | **PASS** — all 42 checks (4 new: TEST 39–42) |
| `npm run build` (web + admin) | **PASS** |
| `npx tsc --noEmit --strict` on `api/stablecoin-engine.ts` | **PASS** |
| `git diff --check` | **PASS** (benign Windows LF→CRLF warnings only, not whitespace errors) |
| Grep of final `App.tsx` for dead legacy identifiers/strings | **PASS** — zero live-code matches (one match is this task's own explanatory comment) |

```
 api/stablecoin-engine.ts           | 147 +++++++-
 scripts/stablecoin-engine-test.mjs |  68 +++-
 src/app/App.tsx                    | 736 +++++++++++++------------------------
 3 files changed, 459 insertions(+), 492 deletions(-)
```

## Production Safety

No SSH write operation, no database write, no migration, and no deploy occurred in this task. The only production/VPS interaction was the read-only audit script in Part 1 (`SELECT`-only PostgREST reads, no `INSERT`/`UPDATE`/`DELETE`). No Allocation's `status` was changed, no inventory was modified, no Binance order was sent. `signal0verse/signalverse-main` remains at commit `9cd0d7a` — nothing committed, nothing pushed. Real Trading remains fully disabled (unaffected by this task).

## Remaining Issues / Awaiting Approval

1. **Awaiting explicit user approval before deploying** the UI/monitoring changes in this task (`api/stablecoin-engine.ts`, `src/app/App.tsx`, `scripts/stablecoin-engine-test.mjs`) — no code has been pushed.
2. The real `$5,000` pre-fix `USDCUSDT` allocation flagged in the prior report (structurally unable to execute under its original 50/50-seeded inventory) remains unchanged — still the user's decision whether to stop it and create a fresh one under the corrected seeding.
3. Backup-coverage gaps and the stale `postgrest.service` description flagged in earlier reports remain open and out of scope for this task.

---

## FINAL STATUS TABLE

```
PRODUCTION AUDIT COMPLETED: YES (read-only)
REAL VS TEST ALLOCATIONS CLASSIFIED: YES
REAL ALLOCATION STATUS/INVENTORY CHANGED: NO
REAL ALLOCATION STOPPED/DELETED/RESET BY THIS TASK: NO
BINANCE ORDER SENT: NO
INVENTORY-SEED FIX RE-CONFIRMED LIVE (on a NEW real allocation): YES
LEGACY UI REMOVED: YES (card, tabs, modal, admin diagnostics — fully removed, not hidden)
NEW ARCHITECTURE UI RICHNESS ADDED: YES (live market preview, scheduler info, win/loss, drawdown, on-demand history)
LIVE PAIR MONITOR ENHANCED: YES (bid/ask/spread/depth, cache-gated)
EXECUTION PATH (runAllocationCycle) MODIFIED: NO (live preview is a separate, read-only function)
MINIMUM PROFIT THRESHOLD CHANGED: NO
BUILD: PASS
REGRESSION TESTS: PASS (42/42, 4 new)
GIT DIFF CHECK: PASS
CODE COMMITTED: NO
CODE PUSHED: NO
PRODUCTION DEPLOYED: NO
AWAITING: user approval before deploy
```
