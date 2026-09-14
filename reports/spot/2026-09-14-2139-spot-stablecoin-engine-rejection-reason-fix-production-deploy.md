# Stablecoin Engine — Rejection-Reason Root-Cause Fix + Persian Localization: DEPLOYED to Production

## Metadata

- Date: 2026-09-16 (session continued from 2026-09-14/15)
- Task ID: (none assigned by user)
- Module: spot (Binance Spot Stablecoin/Stablecoin Arbitrage Engine — Allocation architecture)
- Mode: Deploy of the reviewed-and-approved fix from the local-only report (reference: `reports/spot/2026-09-14-2125-spot-stablecoin-engine-rejection-reason-root-cause-fix-and-persian-localization-local-only.md`), after explicit user review and approval ("گزارش را کامل بررسی کردم و تأیید می‌کنم. حالا همین اصلاحات را برای Production Deploy آماده و اجرا کن."), scoped strictly to the 3 approved files — no migration, no other change.
- Repository: signal0verse/signalverse-main
- Branch: main
- Starting commit: af68aeb1dce64ec3904b21948d1b4d38115a6261
- Ending commit: **c497c6b506bd5838a1c83847f95adbbf9ff9ff1e**

## Objective

Deploy the reviewed rejection-reason root-cause fix (splitting the ambiguous "Allocation capacity/liquidity insufficient" message into two distinct, numerically-backed reasons — allocation-inventory shortfall vs. live market-liquidity shortfall — plus a full Persian-localization pass of the panel) to production, with a full pre-push scope/safety verification and a strictly read-only post-deploy confirmation.

## 1. Pre-Push Verification (local)

- `git status --short` → exactly 3 modified, tracked files: `api/stablecoin-engine.ts`, `src/app/App.tsx`, `scripts/stablecoin-engine-test.mjs`. All other working-tree entries are pre-existing untracked scratch scripts, none staged, none committed.
- `git fetch origin main` → local `main` (`af68aeb`) matched `origin/main` exactly — no divergence.
- Confirmed **no `migrations/*.sql` file** anywhere in the diff or untracked set.
- `node --test scripts/stablecoin-engine-test.mjs` → **PASS**, 44/44 test blocks (251 individual checks), zero failures.
- `npx tsc --noEmit --strict` on `api/stablecoin-engine.ts` → **PASS**.
- `npm run build` (web + admin) → **PASS**, both clean.
- `git diff --check` → **PASS** (only benign Windows LF→CRLF warnings).
- **Inventory-vs-market-liquidity separation verified structurally**: `classifyStablecoinExecutability`'s two shortfall branches now emit distinct reasons (`INSUFFICIENT_ALLOCATION_INVENTORY` / `INSUFFICIENT_MARKET_LIQUIDITY`), confirmed by direct grep against source; the old ambiguous single reason is no longer emitted by the classifier (kept only as a backward-compat type value for historical rows).
- **Diagnostic numbers verified non-fabricated**: `decideStablecoinTrade`'s new fields (`marketLiquidityShortfallUsd`, `inventoryShortfallUsd`, `grossProfitUsd`, `profitShortfallUsd`) are computed via `Math.max(0, ...)` directly from the same `input.quote`/`input.inventoryAvailable`/`input.notionalUsd`/`input.thresholds` already used for the decision itself — confirmed by source inspection, no separate/parallel calculation path exists.
- **Persian text audited**: confirmed via the same grep-based structural checks the local-only report already ran (TEST 44) — every specific English-in-Persian issue named by the user is fixed (bare "Allocation"/"ROI"/"Bid/Ask"/"Binance"/raw enum values/"bps" unit/the "ترید" loanword), and the one deliberately-kept exception (a raw, externally-generated technical error string, e.g. a Binance HTTP-error message) is explicitly framed inside a Persian sentence rather than shown bare — exactly as designed and disclosed to the user.
- **Forbidden-scope guard**: diff review confirmed **zero modified lines** in `runAllocationCycle`, `runStablecoinDemoCycle`, `persistCycleDecisions`, `DEFAULT_THRESHOLDS`, the scheduler/cron-tick claim logic, or trade-sizing/capacity code — this fix touches only reason labeling, purely-additive diagnostic fields, and Persian display text.
- **English-mode guard**: an initial pass had introduced two English-mode display changes (`stablecoinSideLabel`/`stablecoinTradingStatusLabel` translating even when `fa === false`, and `"BREAK"/"HALT"` embedding raw English inside a Persian sentence) — **caught during this pre-push review and corrected before commit**: both helpers now return the raw, byte-identical original value in English mode, and the Persian branch for a non-`TRADING` symbol status uses a generic "غیرِفعال" instead of parenthesizing the English enum code. Re-verified via `git diff` that no English (`fa === false`) ternary branch differs from before this task, re-ran the full test suite and build after the correction — both still green.

**No other blocking finding — proceeded to commit/push exactly as scoped.** **LOCAL, STRUCTURAL.**

## 2. Commit

```bash
git add api/stablecoin-engine.ts src/app/App.tsx scripts/stablecoin-engine-test.mjs
git commit -m "fix(stablecoin): split ambiguous liquidity-shortfall reason into allocation-inventory vs market-liquidity, add real diagnostic numbers, full Persian localization"
```

Result: commit `c497c6b506bd5838a1c83847f95adbbf9ff9ff1e`, exactly 3 files changed (`465 insertions(+), 87 deletions(-)`). **LOCAL.**

## 3. Push

```bash
git push origin main
```

Result: `af68aeb..c497c6b main -> main`, accepted with no conflict. **LIVE GITHUB EVENT.**

## 4. GitHub Actions (CI/CD)

Run `34899450571` (`Production CI`, triggered by this push), watched to completion via `gh run watch --exit-status`. All gates passed, including `Test stablecoin engine (Binance spot, demo-only) without live services`, the isolated-Postgres test jobs, `Build web application`, `Bundle server API handlers`, `Verify expected artifacts`, `Package verified source`, and `Deliver release to production` — all green. **LIVE CI/PRODUCTION EVENT.**

## 5. Deploy Verification (VPS)

```
/opt/signalverse/app -> /opt/signalverse/releases/c497c6b506bd5838a1c83847f95adbbf9ff9ff1e
```

Deployed release symlink matches the pushed commit exactly. **LIVE PRODUCTION.**

## 6. Production Health

- `systemctl is-active signalverse.service signalverse-fast-jobs.timer postgrest.service nginx` → all four `active`.
- `curl http://127.0.0.1:3000/healthz` → `200`.
- `journalctl -u signalverse.service` around the deploy window shows a clean restart: `Stopping` → `SIGTERM received; shutting down` → `Deactivated successfully` → `Started` → `SignalVerse listening on http://127.0.0.1:3000`, zero errors from the new process. The only log noise (`logToGitHub: comment failed 403`, the daily-log GitHub Issue's pre-existing 2,500-comment cap) is the same unrelated, already-flagged issue from prior reports.

**LIVE PRODUCTION.**

## 7. Scheduler Health

`systemctl list-timers signalverse-fast-jobs.timer` → next fire `21:40:02 UTC`, last fire `21:35:03 UTC` — the unchanged 5-minute cadence, firing normally both immediately before and after the `21:36:29 UTC` restart, with no gap or duplicate. A read-only DB query confirmed the one `RUNNING` setup's `last_tick_at` (`21:36:09 UTC`) is current and advancing. **LIVE PRODUCTION.**

## 8. Read-Only Application-Level Verification

- **Old ambiguous UI text genuinely absent from the served bundle**: `grep 'ظرفیت.نقدینگی' dist/assets/*.js` on the live server → **0 matches**.
- **New split-reason vocabulary present in the deployed API bundle**: `grep -c 'INSUFFICIENT_ALLOCATION_INVENTORY\|INSUFFICIENT_MARKET_LIQUIDITY' .runtime/api/stablecoin-engine.mjs` → **8 occurrences** (classifier, report counters, execution-time recheck).
- **New Persian UI strings present in the deployed frontend bundle**: `اختصاص‌هایِ سرمایه` ("Allocations") and `پایشِ زنده‌یِ جفت‌ها` ("Live Pair Monitor") both found.
- **Inventory-vs-market-liquidity separation confirmed live in the deployed code**, not just locally.
- **Real allocations unchanged by this deploy**: read-only query against `stablecoin_pair_allocations` found 4 currently-`ACTIVE` allocations (all realistic $5,000 capital) — the 3 already known from prior reports (`eea1374a-.../FDUSDUSDC`, `a857cbdc-.../TUSDUSDT`, `09b1c1ae-.../USDCUSDT`) are present unchanged, same IDs, same capital. **One new allocation** (`3cc778cd-.../USDCUSDT`, `$5,000`) is now also `ACTIVE` — this was **not** created by this task (this task made zero database writes and zero calls to any admin action); it reflects independent, ordinary use of the already-deployed feature by the real user between the last audit and this check. Flagged here as an observed state change for transparency, explicitly **not** attributable to this deploy.
- **No Binance order sent**: Real Trading remains hard-disabled — `grep -A1 'action === "real-execute"'` on the live deployed bundle confirms it still unconditionally returns `501 {"error":"Real execution is not available - Phase 1 is demo-only..."}`, byte-identical to before this deploy (confirmed zero modified lines in this code path during the pre-push diff review). This task issued zero HTTP calls to any admin action and zero direct Binance calls.

**LIVE PRODUCTION (read-only DB queries + deployed-bundle inspection).**

## Exactly What Changed in Production

- **Code**: the deployed application bundle and server runtime now reflect commit `c497c6b` — the Stablecoin panel's rejection reasons are split into `INSUFFICIENT_ALLOCATION_INVENTORY`/`INSUFFICIENT_MARKET_LIQUIDITY` with a real numeric breakdown shown for each (and for a profit-below-minimum rejection), both in the live preview and in persisted-history views; the Persian UI no longer shows any of the specific English-word issues the user reported.
- **Data**: **nothing** — zero rows inserted/updated/deleted by this deploy itself. The one new `ACTIVE` allocation observed in Section 8 is independent real-user activity, unrelated to and not caused by this deploy.
- **Behavior**: **nothing execution-relevant** — `runAllocationCycle`, `persistCycleDecisions`, `DEFAULT_THRESHOLDS`, fee/execution-impact math, trade sizing/capacity, and the scheduler's cadence/claim logic are all unchanged, byte-identical to the previously-deployed `af68aeb`. This deploy is reason-labeling/diagnostics/UI-text-only.

## Tests

| Suite | Result |
|---|---|
| `node --test scripts/stablecoin-engine-test.mjs` (pre-push, final run after the English-mode correction) | **PASS** — 44/44 blocks, 251 checks |
| `npm run build` (web + admin, pre-push, final run) | **PASS** |
| `npx tsc --noEmit --strict` (pre-push, final run) | **PASS** |
| `git diff --check` (pre-push) | **PASS** |
| GitHub Actions `Production CI` run `34899450571` (all gates, incl. stablecoin-engine test step) | **PASS** |

## Production Safety

No migration executed, no database write of any kind by this task, no real Allocation Stopped/Deleted/Reset by this task, no Binance order sent, no live/execute action called. The only production-facing actions in this task were: (1) the push itself (triggering the standard, already-authorized CI/CD pipeline), and (2) read-only verification (service status, `healthz`, `journalctl`, timer status, deployed-bundle grep, and read-only DB queries). Real Trading remains fully disabled (`501`, unchanged, re-confirmed live in Section 8).

## Anomalies / Notable Observations

1. **One new real-user `ACTIVE` allocation appeared between the last audit and this deploy's verification** (`3cc778cd-.../USDCUSDT`, `$5,000`) — confirmed independent of this task (zero DB writes made here). Not a concern, but disclosed per the user's "report anything unusual" instruction.
2. **A scope self-correction occurred during pre-push review**: the first draft of the Persian-localization helpers (`stablecoinSideLabel`/`stablecoinTradingStatusLabel`) inadvertently altered English-mode (`fa === false`) display text, which the user explicitly required to stay unchanged. This was caught by this task's own pre-push diff review (before any commit/push), corrected, and re-verified (tests + build re-run green) — disclosed here in full per the instruction to report anything found outside scope before proceeding. No incorrect version was ever committed or deployed.
3. No other anomaly found.

## Files Changed

`api/stablecoin-engine.ts`, `src/app/App.tsx`, `scripts/stablecoin-engine-test.mjs` — no other file.

```
 api/stablecoin-engine.ts           | 141 ++++++++++++++++++++---
 scripts/stablecoin-engine-test.mjs | 176 +++++++++++++++++++++++++---
 src/app/App.tsx                    | 233 ++++++++++++++++++++++++++++---------
 3 files changed, 465 insertions(+), 87 deletions(-)
```

## Remaining Issues

1. The real, pre-fix `71013bfd-.../USDCUSDT` allocation (structurally unable to execute under its original 50/50-seeded inventory, flagged in earlier reports) remains unchanged — still the user's decision whether to replace it.
2. No live interactive UI/Telegram click-through was performed in this task (matches prior deploy reports' own convention) — verification here is structural (deployed bundle) + data-level (DB), not an actual browser session.
3. The pre-existing, unrelated `logToGitHub: comment failed 403` log noise persists — out of scope for this task.
4. A small number of truly dynamic, runtime-generated reason strings (raw Binance HTTP-error/network-exception text) remain in their original language after a Persian framing prefix — a deliberate, disclosed design boundary (see the local-only report), not a gap.

---

## FINAL STATUS TABLE

```
PRE-PUSH SCOPE VERIFIED: YES (exactly 3 files, no migration, no threshold/execution-path change)
ENGLISH-MODE REGRESSION CAUGHT AND FIXED BEFORE COMMIT: YES (disclosed in Anomalies)
COMMIT: c497c6b506bd5838a1c83847f95adbbf9ff9ff1e
PUSHED TO MAIN: YES
CI/CD RUN: 34899450571 — SUCCESS (all gates, incl. stablecoin engine tests)
DEPLOYED SHA MATCHES COMMIT: YES
HEALTHZ: PASS (200)
SERVICE RESTART: CLEAN (no errors from new process)
SCHEDULER HEALTHY: YES (unchanged 5-min cadence, ticking before and after restart)
OLD AMBIGUOUS UI TEXT IN DEPLOYED BUNDLE: ABSENT (0 matches)
NEW SPLIT-REASON VOCABULARY IN DEPLOYED BUNDLE: PRESENT (8 occurrences)
NEW PERSIAN UI STRINGS IN DEPLOYED BUNDLE: PRESENT
INVENTORY VS MARKET-LIQUIDITY SEPARATION VERIFIED LIVE: YES
REAL ALLOCATIONS CHANGED BY THIS DEPLOY: NO (3 known ACTIVE allocations unchanged; 1 new ACTIVE allocation observed, confirmed independent real-user activity, not caused by this deploy)
BINANCE ORDER SENT: NO
REAL TRADING ENABLED: NO (still 501, re-confirmed live)
EXECUTION LOGIC / THRESHOLDS / SCHEDULER CHANGED: NO
ENGLISH UI MODE CHANGED: NO (final, post-correction state verified unchanged)
MIGRATION EXECUTED: NO (none included in this deploy)
PRODUCTION DEPLOYED: YES
```
