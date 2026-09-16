# Prediction Market — Phase 7: User-Configurable Autonomous Demo Account + Real-Compatible Execution Architecture + Persian/English UI

**Date:** 2026-09-16
**Scope:** Architecture change + real implementation (not design-only). Branch `prediction-phase7-autonomous-demo-account`, PR [#68](https://github.com/signal0verse/signalverse-main/pull/68), merge commit `30732a8`.
**Status:** CI passed, PR merged, deploy confirmed live in production (see Section 13). Gate left disabled per instruction — this report is a deployment record, not an activation.

---

## 1. Architecture audit — what existed before this phase

`AUTONOMOUS_VIRTUAL_BANKROLL` (=1000) and `AUTONOMOUS_MAX_POSITION_USDC` (=15) were module-level `const` in `api/predictions.ts`, used directly inside `autonomousEntryTick()`'s sizing call. No settings-table entry, no admin UI, no per-account state. `entry_shadow` (the only currently-active entry-adjacent tick) already exercised this exact sizing math on every 5-minute tick, so any change to the constants' *default* values would have changed live Shadow Entry telemetry — the phase was scoped to keep defaults numerically identical to avoid this.

## 2. Account model findings

`prediction_autonomous_trades` (`migrations/prediction_market_autonomous.sql`) is explicitly documented in its own migration comment as a **system-owned, `telegram_id`-free, freely-reversible DEMO ledger**, structurally separate from `prediction_trades` (the per-user manual ledger) "so autonomous activity never mixes into a real user's balance/history." This is a pre-existing, already-decided design precedent — not an open question. Per the task's explicit "do not guess, stop and report ambiguity" instruction: **there was no ambiguity to report here**, because the precedent already answers the account-ownership question. This phase extends the same precedent to capital configuration: the Autonomous Demo account's capital is **system-level** (one shared virtual account for the whole autonomous engine), configured by an admin via the `settings` table — not per-Telegram-user, and not mixed into any user's manual Demo balance.

## 3. New account model

No new table. Two new `settings` rows (read via the existing `getFlags()`-style key/value pattern):
- `prediction_autonomous_demo_capital` (default 1000 if unset)
- `prediction_autonomous_max_trade_usdc` (default 15 if unset)

`getAutonomousDemoAccountConfig()` reads both with `Number.isFinite(...) && > 0` validation, falling back to the original hardcoded constants (now named `..._DEFAULT`) when unset or invalid — guaranteeing zero behavior change until an admin actually edits these settings.

Two new derived reads against the existing `prediction_autonomous_trades` table (no new columns):
- `getAutonomousCommittedCapitalUsdc()` — sum of `size_usdc` where `status='OPEN'`
- `getAutonomousRealizedPnlUsdc()` — sum of `pnl_usdc` where `status='CLOSED'`

## 4. Configurable capital/risk design

```
Available Capital = Demo Capital (setting) + Realized PnL (sum of CLOSED trades) − Committed Capital (sum of OPEN trades' size_usdc)
```

This makes the account self-consistent purely from ledger data plus one configured number — no separate "balance" column to drift out of sync.

## 5. Sizing flow (unchanged Kelly math, new outer constraint)

```
Engine Recommended Size (Kelly, recommendPositionSize(), UNCHANGED formula/risk-profile)
  → capped by user's configured max-per-trade (Math.min)
  → capped by currently available account capital (Math.min)
  = Final Executable Demo Size
```

`computeAutonomousPositionSize()` signature changed from reading module constants to accepting `(modelProbPct, bestAskPrice, demoCapitalUsdc, maxTradeUsdc, availableCapitalUsdc)` explicitly — the underlying `recommendPositionSize()` Kelly call and `AUTONOMOUS_RISK_PROFILE` ('conservative') are **byte-for-byte unchanged**. No threshold, Edge/EV, Confidence, Base Rate, or Decision-engine logic was touched anywhere in this phase.

Within a single tick, `autonomousEntryTick()` now tracks `remainingCapitalUsdc` as a running total, fetched once at tick start and decremented only after each successful **real** insert (never in the shadow/dry-run branch) — this prevents two ranked candidates in the same tick from jointly over-committing beyond total available capital.

## 6. Ledger design

Reused `prediction_autonomous_trades` as-is — no new columns, no new table. The task's instruction to "reuse... don't create a redundant ledger without proving insufficiency" was followed: the existing `size_usdc`/`status`/`pnl_usdc` columns are sufficient to derive committed capital and realized PnL without any schema change.

## 7. PnL / position lifecycle visibility

New GET action `autonomous-positions` (read-only):
- `?status=open` — each row's *current* price fetched live from the real Polymarket CLOB order book (`fetchClobOrderBook`/`analyzeOrderBook`, the same functions the engine itself uses), with `unrealizedPnlUsdc` computed on the fly. If the book is unavailable, `unrealizedPnlUsdc` is `null` — **never fabricated or estimated**.
- `?status=closed` — historical rows with `win: pnl_usdc > 0` (or `null` if `pnl_usdc` is itself null).

## 8. UI changes (`AutonomousEngineMonitor`, `src/app/App.tsx`)

- New "Account" card: Demo Capital, Max/Trade, Available, Committed (Open), Realized PnL, Total Equity — all read from `autonomous-status`'s new `account` object.
- New "Open Autonomous Positions" card: question, side, entry/current price, size, unrealized PnL (colored red/green), empty state.
- "Demo Entry" and "Real Trading" badges — previously static text (the exact Phase 6 audit finding) — now read `status.entryGateStatus` / `status.realTradingGateStatus` respectively, via two independent expressions (never the same value driving both).
- `decisionLabel()` / `gateStatusLabel()` / `entryGateBadgeColor()` helpers added for full Persian/English coverage of every decision enum value and every gate state, without altering the raw values used for `<option value>`, filtering, or API calls.

## 9. i18n changes

Every new UI string added in this phase uses the project's existing `fa ? "..." : "..."` inline-ternary convention — no hardcoded single-language string was introduced. Raw technical identifiers (decision enum values, side YES/NO, DB column names, API action names) remain untranslated by design, per the task's explicit instruction — only their *display* wrapper is localized.

## 10. Scheduler changes

**Prepared, not activated.** A new guarded block for `prediction-enter-cron` was drafted, mirroring the exact pattern of the existing `prediction-resolve-cron` block in `/usr/local/libexec/signalverse-jobs` (same `job_enabled()` gate check, same `CRON_SECRET`-authenticated `call_api` pattern, calling `action=autonomous-enter`). This diff has **not** been applied to the VPS and the gate file has **not** been created — activation would need only `touch jobs.d/prediction-enter-cron.enabled` after the script itself is installed, exactly like the Phase 5 `resolve` activation pattern (staging upload + `bash -n` syntax check + atomic `mv` install, run by the owner from their own shell — this session never writes to the VPS directly, consistent with the sandbox's "Remote Shell Writes" restriction honored in Phase 5).

## 11. DB / migration changes

**None required.** Two new `settings` key/value rows are inserted via the existing `settings` table's generic upsert pattern (same mechanism as every other admin-configurable flag in this codebase) — no `ALTER TABLE`, no new table, no new column.

## 12. Tests

20 prediction test files, **335 checks, 0 failed** (Phase 6 baseline: 18 files / 319 checks). New/changed files this phase:
- `scripts/prediction-autonomous-account-test.mjs` (new, 37 checks) — account config defaults/validation, committed-capital/realized-PnL math, sizing-flow wiring, live entry-gate status computation, `autonomous-positions` endpoint shape, admin settings validation, safety checks (no wallet/signing code, no scheduler string present in the deployed API file).
- `scripts/prediction-autonomous-monitor-i18n-test.mjs` (new, 36 checks) — Persian/English coverage of every new UI string, live-badge wiring (not the old static text), decision-label mapping for every enum value, raw-value preservation for filtering/API.
- `scripts/prediction-autonomous-sizing-test.mjs` (updated, 10 checks, was 8) — re-validated the Kelly → cap → final flow against the new function signature with capital effectively unlimited, so the pre-existing sizing-cap behavior is proven unchanged.
- `scripts/prediction-duplicate-protection-test.mjs` (fixed, 8 checks) — a source-search assertion broke because Phase 7 added an earlier, unrelated `.eq('status','OPEN')` call elsewhere in the file; fixed by scoping the search to `hasOpenAutonomousPosition`'s own definition. Not a functional regression — verified the actual duplicate-guard logic is untouched.

## 13. Production verification

**Pre-deploy read-only SSH check (~07:15 UTC):**
- `jobs.d/prediction-enter-cron.enabled`: absent; `jobs.d/prediction-learn-cron.enabled`: absent; `jobs.d/prediction-resolve-cron.enabled`: present.
- Deployed release at that point: commit `5ba22b7` (the Phase 6 docs commit) — confirmed via `grep -c getAutonomousDemoAccountConfig` returning `0` against the then-live bundle, i.e. none of this phase's code was live yet.

**Post-deploy read-only SSH check (~07:25 UTC, after CI passed and merge triggered the production delivery job):**
- `/opt/signalverse/app` now points to `/opt/signalverse/releases/30732a8b242068e23cad0a2e12e74fc35da0a83a` — the exact merge commit of PR #68.
- `signalverse.service` restarted at `2026-09-16 07:23:59 UTC` (`ActiveEnterTimestamp`), matching the deploy job's timing.
- `grep -c 'getAutonomousDemoAccountConfig\|entryGateStatus\|autonomousPositions\|autonomous-positions' /opt/signalverse/app/.runtime/api/predictions.mjs` → **8 matches** — this phase's code is genuinely running in production, not just built.
- `jobs.d/`: unchanged — only `prediction-discovery-cron.enabled`, `prediction-resolve-cron.enabled`, `prediction-shadow-entry-cron.enabled` present; `prediction-enter-cron`/`prediction-learn-cron` still absent.
- An unauthenticated `curl` against `action=autonomous-status` correctly returned `{"error":"Not authenticated"}` — no auth regression introduced.

**Post-deploy read-only production DATABASE check** (via `DATABASE_API_URL`/`DATABASE_SERVICE_ROLE_KEY`, the same credentials `npm run backup` uses — no write performed):
- `settings` table rows for `prediction_autonomous_demo_capital` / `prediction_autonomous_max_trade_usdc`: **empty** — confirms no admin has configured these yet, so the code is currently running on its `_DEFAULT` fallbacks (1000 / 15), identical to the pre-Phase-7 hardcoded values.
- `prediction_autonomous_trades` with `status='OPEN'`: **0** — confirms `entry_real` has never opened a position (consistent with the gate being disabled this entire time).
- `prediction_autonomous_runs` with `run_type IN ('entry_real','learn')`: **0 total rows in history** — confirms these gates have never fired, not even once, at any point across all prior phases.
- Most recent `resolve` run: `started_at: 2026-09-16T07:26:54Z, success: true` — confirms the Phase 5 `resolve` gate is still actively ticking on the new release, undisturbed by this deploy.

## 14. Safety verification

- Real Trading: architecturally OFF — no order placement, signing, wallet, deposit/withdrawal code exists anywhere in this diff or the wider codebase for Prediction Market Real.
- `entry_real` (Autonomous Demo Entry) and `learn` gates: left disabled; not touched by this phase's scheduler prep (diff drafted but not applied).
- No changes to Futures, Spot, Fast Trader, or Autonomous Supervisor modules — confirmed via `git status`/`git diff --stat`: only `api/predictions.ts`, `api/admin.ts`, `src/app/App.tsx`, and prediction test scripts were modified.
- Decision Engine thresholds, Kelly formula, Edge/EV, Confidence, Time Horizon, Tradeability, Base Rate: byte-for-byte unchanged.
- Default capital/cap values unchanged from the prior hardcoded constants — Shadow Entry's live sizing telemetry is unaffected by this deploy.

## 15. Current gate state (as of this report)

| Gate | State |
|---|---|
| `prediction-discovery-cron` | ENABLED (unchanged) |
| `prediction-shadow-entry-cron` | ENABLED (unchanged) |
| `prediction-resolve-cron` | ENABLED (unchanged, Phase 5) |
| `prediction-enter-cron` (Autonomous Demo Entry / entry_real) | **DISABLED** — not created |
| `prediction-learn-cron` | **DISABLED** — never created |
| Real Trading (any Prediction Market real order path) | **OFF** — does not exist in code |

## 16. READY / NOT-READY verdict

**READY FOR CONTROLLED DEMO ACTIVATION** (of `prediction-enter-cron` only — this is a separate future authorization, not granted by this report). Basis: code is deployed and confirmed running in production (Section 13), the full 20-file/335-check prediction suite is green, `tsc`/build/esbuild are all clean, no unrelated module was touched, and defaults keep Shadow Entry's live telemetry numerically identical to before this deploy. The scheduler wiring itself is prepared but intentionally not applied — that is the one remaining manual step before activation, by design.

## 17. Exact next step (owner-authorized activation only)

1. Owner (or a session with SSH write access) installs the prepared `prediction-enter-cron` block into `/usr/local/libexec/signalverse-jobs`, mirroring the exact Phase 5 `resolve` activation procedure: `npm run backup` first, upload the new script to a staging path, `bash -n` syntax-check, atomic `mv` install, `bash -n` re-check.
2. `touch /etc/signalverse/jobs.d/prediction-enter-cron.enabled`.
3. First qualifying position sizing: up to $15 (or the admin's configured `prediction_autonomous_max_trade_usdc`, currently unset → default 15) against a $1000 (or configured `prediction_autonomous_demo_capital`) Demo Capital pool — Kelly-recommended, capped by whichever of the three constraints binds tightest.
4. Visibility: immediately after an entry_real tick opens a position, it appears in the "Open Autonomous Positions" card in `AutonomousEngineMonitor`, with live current price and unrealized PnL pulled from the real CLOB order book on every 30-second UI refresh.
5. Real Trading confirmation: activating this gate has **no effect** on Real Trading — that gate does not exist in code at all (no order/signing/wallet path anywhere in the Prediction Market module) and remains structurally OFF regardless of this activation.

Recommendation before flipping the gate: let it run for at least one full day of `entry_shadow` observation on the newly-deployed code first (even though the sizing math is unchanged, this is the first production run of the new capital-derivation queries) to catch anything Section 12's structural tests couldn't — the same caution `resolve` activation used in Phase 5.

## 18. What must NOT be touched (preserved)

Kelly/Edge/EV/Confidence/Time-Horizon/Tradeability/Base-Rate/Decision-threshold logic; Futures/Spot/Fast Trader/Autonomous Supervisor modules; `learn`/calibration behavior; any real order/wallet/signing code (none exists); the `resolve` gate's current enabled state.
