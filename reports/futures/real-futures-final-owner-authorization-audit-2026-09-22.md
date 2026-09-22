# Real Futures — final pre-authorization audit of exact d58 (2026-09-22)

## Metadata

- Mode: audit and release packaging only; no application-code changes
- Audited executable: `d58dba78184d80818fc1580890a1c85bf2eb7724`
- Previously stated Production base: `3d738da8d32ee61e552646c3d2db14715c1ca6ea`
- **Fresh read-only active Production runtime:** `56aaff32ba003850db2954d9199cd27cdeaf954a` (checked 2026-09-22 UTC)
- Previous Futures executable: `428c2c3bfb4edbf09cf1423f5aa408684341d65f`
- Application files changed in this audit: NONE

## 1. EXACT SHA

Exact Git commit `d58dba78184d80818fc1580890a1c85bf2eb7724` resolved with parent `66a2f1dae44d8962ab6c694a95a53ca1e266c7f9` and tree `40fe740593d41b298e0a029949d8aa6eee4f86e6`. Its `api/copytrade.ts` blob is `1667baa63cfe5f555681af9dbe7d1f59149a4d57`; `git hash-object` on the freshly extracted exact Git archive matched. The isolated candidate checkout was clean; its documentation-only branch HEAD was not used as executable test input. The six code/test paths changed by d58 relative to its parent are `api/analyze.ts`, `api/copytrade.ts`, `scripts/futures-mexc-native-routing-test.mjs`, `scripts/futures-pro-timeframes-test.mjs`, `scripts/futures-real-execution-fault-test.mjs`, and `scripts/futures-real-price-basis-test.mjs`. All runs below used the exact-d58 archive.

## 2. UPLOADED EXPORT DISCREPANCY RESOLUTION

The request states that an independent uploaded `copytrade.ts` is available and contains the older generic `fetchKlineExtremes()` implementation. **No such independent file was present in the accessible attachment directory, workspace, or common local upload locations during this audit.** Consequently its *actual* Git-blob SHA and a byte-level `OLDER EXPORT / DIFFERENT FROM d58` classification are **NOT VERIFIED**. The statement about the export cannot substitute for the file. The previous executable `428c2c3b...` does contain that older generic helper and has blob `69eebdfc70c6b4a4517ae19540c913c17c79420c`, but this is **not** asserted to be the missing uploaded file.

The exact d58 Git archive is authoritative. **The uploaded `copytrade.ts` is not the executable source for d58.** This establishes source authority, but does **not** invent the missing export hash or close the requested forensic comparison. The owner was asked to provide the exact file/path.

## 3. ROUTING VERIFICATION

Static call-path review of exact d58 plus the native-routing tests confirms: Real Binance analysis/Re-Analyze and entry preflight use Binance USD-M Futures Contract; software SL uses Contract Kline and TP uses Mark Kline. Real MEXC Pro analysis uses native MEXC Futures Kline; entry/current-price and R:R checks use native ticker `lastPrice`; both software SL and TP use the native MEXC Latest-price window, matching `trend: 1` in both native protection builders. The exchange-discriminated window cache key includes venue, native symbol, basis and start time. Real MEXC has no reachable Binance/Spot market-data fallback; Real Binance windows fail closed rather than substituting Spot. Existing Spot, Demo and Gate/Hyperliquid legacy Spot feeds remain explicitly separate. This is static/offline verification, not private exchange readback.

## 4. OFFLINE TESTS

Re-run on the exact-d58 archive:

| Gate | Result |
| --- | --- |
| Eight focused Futures scripts | **294 passed / 0 failed / 0 skipped** |
| Six ancillary fault/simulation scripts | **153 passed / 0 failed / 0 skipped** |
| Web Vite build | **PASS**, isolated output |
| Admin Vite build | **PASS**, isolated output; the first attempt used a nonexistent config path and was rerun with the repository's `vite.admin.config.ts` |
| `api/analyze.ts` and `api/copytrade.ts` esbuild bundles, `write:false` | **2/2 PASS** |
| `git diff --check d58^ d58` | **PASS** |

No credential-loading legacy suite, Real order, private exchange test or Production write was run. Offline pass is not evidence of live protection or profitability.

## 5. MIGRATION CLONE

A **fresh schema-only, no-row** dump of the active Production database was taken read-only for this test (SHA-256 `d73555897c0ffb23489dac0c5192f149ff242047799c4e8f5c4eb4b44af21caf`), copied to an isolated local input and removed from VPS immediately after copying. The exact-d58 `scripts/futures-production-schema-clone-test.mjs` used PostgreSQL **18.6** on loopback with a process-owned disposable cluster. It applied exact-d58 `migrations/futures_reanalysis_claims.sql` then `migrations/futures_real_portfolio_capacity.sql`: **PASS**. Reapplication: **PASS**. Public tables: **88→90**; claims/pending/capacity trigger present after application. Primary/unique/foreign-key constraints, request/complete RPCs and service/anon permissions: **PASS**. Two-way and ten-way concurrent claims, manual priority, flat/Auto-off discard, lifecycle separation, consume rollback, ten-way one-slot portfolio capacity, duplicate-symbol atomicity, exchange identity and fail-closed permission error: **PASS**. Fault-injected transaction rollback restored the pre-migration 88-table shape. Production rows copied: **0**; Production migrations run: **0**. Disposable cluster and schema artifacts were removed after verification.

The two migration Git blobs match the prior tested candidate byte-for-byte: `6499ce0b254b49e345330a914c25afd5825c9555` and `51dc89f4b0010c16dd23edc3f047785f0e40a69b`. PostgreSQL 18.6 compatibility is shown; it does not prove a Production 17.x migration has been executed.

## 6. TYPECHECK DELTA

The machine-checkable delta gate ran against exact d58 twice: first against the original Production base `3d738da...`, then against **fresh active** Production `56aaff32...`. Both comparisons yielded full diagnostics **52→52, zero new**, and affected API diagnostics **35→30, zero new, five removed**. No TypeScript suppression or config change was introduced by d58. Global `tsc` remains red on existing diagnostics; it is **not** called green. The delta result does not resolve the diverged code lineages or preserve the active Spot fix.

## 7. SCOPE AUDIT

The exact d58 commit changes Real Futures venue routing and its tests, with no Strategy/Engine score/indicator-vote/Supervisor-authority or Spot/Demo/Shadow **strategy/behavior** change. It does mechanically update existing Spot/Demo/legacy call sites to pass an explicit `spot` source to the refactored helper; those code lines are not claimed untouched. **The active Production SHA changed during the release context.** The fresh read-only symlink and deploy marker both identify `56aaff32ba003850db2954d9199cd27cdeaf954a`, not the previously asserted `3d738da...` and not d58. The active commit descends from `3d738da...` and adds a Spot commission-accounting correction in **the same `api/copytrade.ts`**, plus `migrations/spot_commission_capture.sql`; d58 and that active commit diverge at `3d738da...`. A direct replacement of active Production by exact d58 would omit that Spot correction, violating the requested Spot-preservation boundary. This audit did **not** merge, rebase or modify either line. A new integrated executable SHA, followed by fresh review/tests/authorization, would be required before a safe release plan can be evaluated.

## 8. LIVE-ONLY GATES

| Gate | Status |
| --- | --- |
| Real Binance protection replacement and native read-back on d58 | **NOT VERIFIED** |
| Real MEXC protection replacement and native read-back on d58 | **NOT VERIFIED** |
| Fresh Real fee/funding/PnL/app-ledger reconciliation | **NOT VERIFIED** |
| Production runtime d58 | **NOT VERIFIED**; runtime is `56aaff32...` |
| Profitability | **NO CONCLUSION** from correctness tests |

No Real position was manufactured. An active service is not proof of exchange protection or correct accounting.

## 9. OWNER AUTHORIZATION

The [separate exact authorization checklist](real-futures-owner-authorization-checklist-d58-2026-09-22.md) records ten independent owner decisions: executable SHA, migrations, backup, rollback, deployment window, Real trading flags, Binance scope, MEXC scope, accounting scope and emergency stop. **None is treated as approved by this audit.** Because Production now includes a Spot fix absent from d58, the owner must first decide how that change is preserved in a newly reviewed executable candidate; approval of d58 alone is not a safe direct-deployment instruction.

## 10. RELEASE ORDER

**Proposed only; not executed:** freeze the eventual integrated SHA, re-run its exact tests and schema clone, obtain fresh owner approvals, back up and verify Production, transactionally apply reviewed migrations, verify schema/indexes, deploy the exact approved SHA, verify runtime SHA and health, maintain only explicitly authorized Real trading flag state, validate protection/read-back only on naturally suitable positions, reconcile fees/funding/PnL only after naturally new closed trades, and monitor predefined stop conditions. The d58 test evidence cannot be transferred automatically to a future integrated SHA.

## 11. ROLLBACK

Before any future release, agree on a verified backup, exact prior runtime SHA (currently `56aaff32...`, subject to recheck), rollback owner/window and stop criteria. A service/code rollback must preserve or explicitly account for already-applied additive schema and any subsequent writes; do not improvise destructive down-migrations or clear durable `PREPARED`, `SUBMITTED` or `UNKNOWN` holds. If live protection state is uncertain, keep reconciliation/protection operating and stop new entries under the approved emergency procedure. No rollback was executed here.

## 12. FINAL STATUS

**BLOCKED.** Exact-d58 routing, tests, builds, TypeScript delta and a fresh disposable migration clone passed. Nevertheless, the requested independent export hash remains unavailable, and the actual Production runtime has advanced to a diverged Spot-fix commit that exact d58 would not preserve if deployed directly. These are material release-package gaps; therefore `READY FOR OWNER AUTHORIZATION`, `READY TO DEPLOY`, `READY FOR PRODUCTION` and `LIVE VERIFIED` are **not** claimed. The next safe step is forensic access to the actual export (if that check is still required) and a separate, owner-approved integration plan preserving active Spot code, with a new executable SHA and full repeat audit.

**No merge. No Production push. No Production deploy. No Production migration. No Real order. No Spot change. No Demo change. No Shadow change.** Only this sanitized AI-Log audit and checklist were published.
