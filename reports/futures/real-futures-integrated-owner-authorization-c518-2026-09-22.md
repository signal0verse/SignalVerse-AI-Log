# Real Futures — integrated owner-authorization audit, 2026-09-22

## Metadata and source authority

- Mode: local candidate construction + offline audit; **no release authorization**
- Active Production runtime, read-only reconfirmed 2026-09-22 15:45 UTC: `56aaff32ba003850db2954d9199cd27cdeaf954a`; deploy marker and symlink agreed; service active
- Original isolated Futures executable: `d58dba78184d80818fc1580890a1c85bf2eb7724`
- **New integrated local executable:** `c518c3e66a68afc5c7e8e45d8ed32d198364419a`
- New parent: `56aaff32ba003850db2954d9199cd27cdeaf954a`
- New tree: `f8a5b5955dc3692e767ab1185267540503213c45`
- New `api/copytrade.ts` blob: `544d4486c2337950b09bac09b781f27c74f65847`
- New `api/analyze.ts` blob: `67e9f7449ba749d09b827c46ec2a022e9125585c` (exact d58 blob)
- Local branch: `codex/futures-integrated-2026-09-22` in an isolated checkout; commit clean; **not pushed to any application remote**

## 1. Lineage and integration decision

`git merge-base(56aaff32,d58dba7)` is `3d738da8d32ee61e552646c3d2db14715c1ca6ea`. The active Production-only commit `56aaff32` adds Spot P0-1/P0-2/F1 commission capture/accounting in `api/copytrade.ts`, its Spot migration, tests and documentation. The d58-only chain contains Real Futures Re-Analyze/correctness, exchange-native routing, two Futures migrations, tests and Real-only UI labels. The only executable-file overlap is `api/copytrade.ts`.

Starting from exact `56aaff32`, the cumulative Futures patch from ancestor `3d738da` through d58 was applied to the existing `api/copytrade.ts` with a clean three-way *content* application; the Production Spot file was **not** replaced by d58. Twenty-three other cumulative d58 paths (excluding the common file and two handoffs) were copied with exact d58 blob identities. The two handoffs were adapted and one integration handoff was added. No Git branch merge, blind cherry-pick, main/master push or Production action occurred.

## 2. Uploaded export forensic classification

The owner supplied an independently obtained Git-blob hash `e444f5cda37d52c66e21909e8b03723b678eae18` for an older exported `copytrade.ts` containing the generic historical market helper. It differs from the exact d58 blob `1667baa63cfe5f555681af9dbe7d1f59149a4d57` and the new integrated blob `544d4486c2337950b09bac09b781f27c74f65847`. Classification **OLDER/DIFFERENT EXPORT, NOT EXECUTABLE AUTHORITY** follows the supplied hash and description. The physical exported file was still not accessible locally, so its bytes were **not independently re-hashed in this run**; do not present that limitation as a local forensic measurement. The new committed Git archive is the executable authority.

## 3. Exact Spot preservation proof

- All **10 Production-only non-overlap paths**, including `migrations/spot_commission_capture.sql`, `scripts/spot-commission-pnl-test.mjs` and `scripts/spot-tp-free-balance-clamp-test.mjs`, retained their exact `56aaff32` Git blobs.
- All **232 added lines** of the active Spot `api/copytrade.ts` correction were present in the exact new-SHA archive. A diff from `56aaff32` to the new SHA removed **zero** Spot-correction-related lines (commission, fee, closure or myTrades helpers). This line check is corroborating evidence, not a substitute for behavior tests.
- Against the new-SHA archive, the isolated Spot commission/accounting suite passed **64/64**, with zero unexpected outbound requests; the Spot free-balance clamp suite passed **25/25**, including its network-isolation assertion. Existing Spot commission capture, net-base accounting, closure/dust decision and fee/PnL behavior remained exercised.
- Mechanical common-helper adaptations pass explicit `'spot'` source at `syncSpotCycles`, `syncSpotCyclesReal`, `syncDemoTrades`, legacy Gate/Hyperliquid observers and the non-Binance/MEXC legacy pending path. Their actual source remains Binance Spot; no Spot or Demo strategy/market-source change is claimed.

## 4. Exact Futures integration and routing

All **23 non-overlap d58 paths** matched their original d58 blobs exactly; in shared `api/copytrade.ts`, all **600 d58-added lines** were present in the new archive. `api/analyze.ts` is byte-identical to d58. Static call tracing and routing fixtures verify:

| Real route | Source/basis in new SHA | Failure behavior |
| --- | --- | --- |
| MEXC Pro analysis | Native MEXC contract Kline, server-reobserved for manual/batch input | Bad/unavailable source rejects analysis |
| MEXC current/min-margin/entry/R:R | Native MEXC contract ticker `lastPrice` | No Binance Spot substitution |
| MEXC pending + software SL/TP | Native MEXC Latest-price contract Kline for **both** | Malformed/incomplete/unavailable window fails closed |
| Binance analysis/Re-Analyze/entry | Binance USD-M Futures Contract candles/ticker | Unverified legacy provenance rejects new entry/change |
| Binance software SL / TP | Contract Kline / Mark Kline respectively | Both windows required; no Spot fallback |

Real window cache keys encode `exchange:nativeSymbol:basis:sinceMs`, isolating Binance Contract, Binance Mark and MEXC Latest. Native MEXC SL and TP plan-order builders still use `trend: 1` (Latest); Binance protection semantics remain SL=Contract/TP=Mark. `fetchKlineExtremes` is explicitly Spot-only. No Real MEXC call path reaches Binance market data. The unchanged Re-Analyze path is protection-only and does not open or reverse a position.

## 5. Complete changed-path list

Exactly 27 paths differ from parent `56aaff32`:

```text
HANDOFF.md
api/analyze.ts
api/copytrade.ts
docs/AI_HANDOFF.md
docs/testing/real-futures-correctness-followup-2026-09-22.md
docs/testing/real-futures-correctness-remediation-2026-09-22.md
docs/testing/real-futures-final-correctness-gate-2026-09-22.md
docs/testing/real-futures-integrated-candidate-2026-09-22.md
migrations/futures_real_portfolio_capacity.sql
migrations/futures_reanalysis_claims.sql
scripts/binance-final-funding-test.mjs
scripts/futures-accounting-production-readonly.sql
scripts/futures-capacity-pg-claim.sql
scripts/futures-capacity-pg-fixture.sql
scripts/futures-capacity-pg-query-failure.sql
scripts/futures-correctness-test.mjs
scripts/futures-liquidation-feasibility-test.mjs
scripts/futures-mexc-native-routing-test.mjs
scripts/futures-pro-timeframes-test.mjs
scripts/futures-production-schema-clone-test.mjs
scripts/futures-real-execution-fault-test.mjs
scripts/futures-real-price-basis-test.mjs
scripts/futures-reanalysis-pg-claim.sql
scripts/futures-reanalysis-pg-release.sql
scripts/futures-reanalysis-test.mjs
scripts/futures-typecheck-delta.mjs
src/app/App.tsx
```

`TRADING_STRATEGY.md`, `lib/strategyEngine.ts`, Spot-only files, Demo/Shadow code and live-account settings do not differ from `56aaff32`. The `src/app/App.tsx` delta is Real Re-Analyze result labeling only. The Engine's score/vote expression is unchanged; the Real-only multi-timeframe alignment *diagnostic* is corrected without changing scoring. Engine remains primary and AI Supervisor remains reviewer-only.

## 6. Exact-SHA offline gates

The committed candidate was archived with `git archive`; extracted `api/copytrade.ts` and `api/analyze.ts` hashes matched the Git blobs above. All results below were **rerun in that clean archive**, not inherited from d58 or the working checkout:

| Gate | Result |
| --- | --- |
| Eight focused Futures scripts | **294 passed / 0 failed / 0 skipped** |
| Six ancillary fault/simulation scripts | **153 passed / 0 failed / 0 skipped** |
| Spot commission/accounting (active Production correction) | **64 passed / 0 failed** |
| Spot free-balance clamp | **25 passed / 0 failed / 0 skipped** |
| Web Vite build | **PASS** (large chunk warning only) |
| Admin Vite build | **PASS** |
| esbuild `api/analyze.ts` and `api/copytrade.ts`, `write:false` | **2/2 PASS** |
| `git diff --check parent newSHA` | **PASS** |

Credential-loading legacy suites were not run. Passing offline mocks/fixtures or builds does not verify private exchange execution or profitability.

## 7. TypeScript baseline/delta

The machine-checkable comparison used a separate clean checkout at **current Production parent `56aaff32`** against the exact new-SHA archive. Full diagnostics: **52→52, zero new**. Affected API diagnostics: **35→30, zero new, five removed**. No `tsconfig.json` change or suppression was introduced. Global `tsc` remains **red** on pre-existing baseline diagnostics; it is not called green.

## 8. Fresh disposable PostgreSQL migration gate

A read-only **schema-only/no-row** dump from active Production (SHA-256 `152722d591a0b4fd67013b8d5e24935ae62c1f4b6310e7c695d17da0c96d2f9a`) was used only as input to a fresh loopback disposable PostgreSQL **18.6** cluster. Exact new-SHA migration files retained d58 blobs `6499ce0b254b49e345330a914c25afd5825c9555` (claims, first) and `51dc89f4b0010c16dd23edc3f047785f0e40a69b` (portfolio capacity, second). The new-SHA clone runner passed first application, reapplication, **88→90** public tables, required primary/unique/foreign-key constraints, RPCs, service/anon permissions, 2- and 10-way claim concurrency, manual priority, flat/Auto-off/lifecycle separation, consume rollback, 10-way one-slot capacity, duplicate-symbol atomicity, exchange identity and fail-closed permission error. Fault-injected transaction rollback restored the 88-table pre-migration shape. Production rows copied: **0**; Production Futures migrations executed: **0**. Temporary schema files on VPS/local and the disposable cluster were removed after verification. This is compatibility evidence, not a Production migration or full PG17 live validation.

## 9. Live-only gates — separate from release-candidate correctness

| Gate | Status | Evidence required after distinct owner authorization |
| --- | --- | --- |
| A. Binance native protection replacement/read-back | **UNVERIFIED** | Naturally suitable open Real Binance position; bounded approved replacement plus authenticated exchange read-back and app-state reconciliation |
| B. MEXC native protection replacement/read-back | **UNVERIFIED** | Naturally suitable open Real MEXC position; bounded approved replacement plus native plan-order read-back and app-state reconciliation |
| C. Fresh fee/funding/PnL/app-ledger reconciliation | **UNVERIFIED** | Naturally newly closed Real trade with exchange fills/fees/funding and matching immutable app ledger |
| D. Runtime executing new candidate | **UNVERIFIED** | After authorized deploy, symlink + deploy marker + service/health all show the **new** SHA; currently they show `56aaff32` |
| E. Profitability | **NO CONCLUSION** | Adequate prospective net-of-cost sample and predeclared evaluation; not derivable from correctness tests |

No Real trade or position was created to satisfy any gate.

## 10. Owner decisions and proposed release order

The owner must separately approve: (A) exact new executable SHA, (B) exact Futures migration bytes/order, (C) backup and restore verification, (D) rollback plan, (E) UTC deployment window/operator, (F) Real trading flag state, (G) bounded Binance live-verification scope, (H) bounded MEXC scope, (I) fresh accounting scope and (J) emergency stop conditions. This report approves none of them.

**Proposed only:** freeze `c518c3e...` and reconfirm active Production SHA → verified backup → reviewed transactional migrations → schema/index/RPC verification → deploy exactly the approved SHA → verify runtime marker/symlink/service/health → maintain explicitly authorized Real trading flag state → use only naturally suitable positions for protection read-backs → use only naturally closed trades for accounting → monitor predefined stop conditions. Preserve durable uncertain entry holds and ongoing protection/reconciliation. Do not improvise destructive down-migrations or manufacture a live trade.

## 11. Final classification

**READY FOR OWNER AUTHORIZATION.** The integrated candidate is a clean, reproducible **new** SHA directly descended from active Production, preserves the active Spot correction, integrates the d58 Futures routing and prior correctness changes, and passes the complete specified offline gates including the fresh exact-SHA migration clone. This classification is **not** `READY TO DEPLOY`, `READY FOR PRODUCTION`, `LIVE VERIFIED` or a profitability conclusion. If Production advances or the authorization scope changes, re-evaluate the release delta before any action.

**No application merge. No application push to main/master. No Production push/deploy/migration. No Real order or exchange mutation. No Spot, Demo or Shadow behavior change.** Only this sanitized AI-Log report was published.
