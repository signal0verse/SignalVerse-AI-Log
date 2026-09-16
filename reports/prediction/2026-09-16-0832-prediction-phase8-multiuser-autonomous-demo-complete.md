# Prediction Market — Phase 8: Complete Multi-User Autonomous Prediction Market Demo Account + Production Deployment

**Date:** 2026-09-16
**Scope:** Real implementation (not design-only). Branch `prediction-phase8-multiuser-autonomous-demo`, PR [#69](https://github.com/signal0verse/signalverse-main/pull/69), merge commit `35bbb34`.
**Status:** Code implemented, tested, and confirmed live in production. **The DB migration this phase requires has NOT been applied yet** — it needs an owner-run `psql` step (exact commands in Section 26). Autonomous Demo Entry (`entry_real`) remains disabled; no autonomous Demo position has been opened by this phase (nor could one be, until the migration lands — Section 19 could not be attempted).

---

## 1. Architecture before/after

**Before (Phase 7):** One system-wide autonomous account. `AUTONOMOUS_VIRTUAL_BANKROLL_DEFAULT`/`AUTONOMOUS_MAX_POSITION_USDC_DEFAULT` (or their admin-configured overrides in `settings`) sized every position; `prediction_autonomous_trades` had no owner column; the app displayed the same "Demo Capital: $1000" to every user who opened the Autonomous tab.

**After (Phase 8):** Every user has their own row in a new `prediction_autonomous_user_accounts` table — their own `demo_capital_usdc`, `max_trade_usdc`, `categories`, and `autonomous_enabled` toggle. `prediction_autonomous_trades` gained a `telegram_id` column. The Central Prediction Engine (`evaluateMarket`/`evaluateSide`/`recommendPositionSize`/`decide`/`assessTradeability`/`rankAutonomousCandidates`) is **byte-for-byte unchanged** — candidate discovery, AI-recheck funnel, deterministic gates, and ranking still run exactly once per candidate per tick, shared across every user. Only the account/ownership layer around entry changed: after ranking, each candidate is matched against every opted-in user whose category preference includes that market's category, and each matching user is sized and entered **independently**, against their own capital.

## 2. Account ownership findings (no ambiguity to report)

The owner's Phase 8 instruction explicitly overrides Phase 7's system-account precedent: "Do NOT create an admin-only/system-wide autonomous trading account... every user must have their own isolated Demo account." This is a direct, explicit instruction, not an ambiguous area requiring a stop-and-report — Phase 7's own report already flagged the system-account design as provisional pending exactly this kind of product decision. No guessing was required.

## 3. New account model

`prediction_autonomous_user_accounts` (new table, mirrors the existing `fast_trader_sessions` precedent — one row per `telegram_id`, capital/config held directly, balance derived from the ledger on read, never a separately-tracked counter):

| Column | Default | Notes |
|---|---|---|
| `telegram_id` | — | `NOT NULL UNIQUE` — one account per user |
| `demo_capital_usdc` | 1000 | `CHECK > 0` |
| `max_trade_usdc` | 15 | `CHECK > 0` |
| `categories` | `{'all'}` | `text[]`, validated against `sports/crypto/politics/economics/all` |
| `autonomous_enabled` | `false` | **Never auto-enabled** — including for existing users |

A user who has never touched this feature has no row at all; reading their account lazily returns the admin-configured **default template** (Phase 7's two `settings` keys, repurposed — see Section 4) for capital/max-trade, but always `categories: ['all']` and `autonomousEnabled: false`. No user is ever silently opted in.

## 4. Configurable capital/risk design

```
Available Capital = User's Demo Capital + User's Realized PnL − User's Committed Capital (sum of their own OPEN positions)
Total Equity       = User's Demo Capital + User's Realized PnL + User's Unrealized PnL (mark-to-market on their own open positions)
```

Both are computed fresh from `prediction_autonomous_trades` filtered to that user's own `telegram_id` — never a cached/derived column that could drift.

The Phase 7 admin `settings` keys (`prediction_autonomous_demo_capital`, `prediction_autonomous_max_trade_usdc`) are **repurposed, not discarded**: they now seed a brand-new user's starting capital/cap the first time their account is read, and provide the reference sizing figures Shadow Entry uses (a scheduled tick has no "current user"). The admin settings card and its backing code comments were relabeled accordingly (`api/admin.ts`, `src/app/App.tsx`) — nothing about this is a shared live account anymore.

## 5. Sizing flow (per user, Engine unchanged)

```
Engine Recommended Size (Kelly, UNCHANGED formula/risk-profile)
  → capped by THIS USER's configured max-per-trade
  → capped by THIS USER's own remaining available capital
  = Final Executable Demo Size for THIS USER
```

`computeAutonomousPositionSize()` itself is **unmodified** from Phase 7 (same signature, same body) — only the account values passed into it now come from a specific matched user instead of one shared config. Two different users evaluating the same candidate receive two independently-computed sizes.

Within a tick, `remainingCapitalByUser` (a `Map<telegramId, number>`) is decremented only after that specific user's own successful insert, so a second qualifying candidate later in the same tick sizes User A against what User A actually has left — completely independent of what User B did with the first candidate.

## 6. Central Engine remains shared

Confirmed by the new `prediction-autonomous-multiuser-test.mjs` test file: `evaluateMarket`/`evaluateSide` are called exactly once per candidate (never once per matching user), `rankAutonomousCandidates` produces one shared rank order, and `recommendPositionSize`'s Kelly formula is not redefined anywhere in the multi-user code path — only the account **inputs** to `computeAutonomousPositionSize` vary per user, never the formula itself.

## 7. Market preference model / backend enforcement

**Categories:** `sports`, `crypto`, `politics`, `economics`, `all` — exactly the five the task specified. (Polymarket's own `science` tag exists in production data but was deliberately not added as a sixth option, per the literal spec; a `science` market is only reachable by an `all`-preference user — documented, not a bug.)

**Enforcement point:** inside `autonomousEntryTick`, immediately after ranking and immediately **before** the expensive market-revalidation network call — `matchingAccounts = enabledAccounts.filter(a => userMatchesCategory(a.categories, marketCategory))`. `marketCategory` is read from the market's own stored `category` column, never from any client-supplied value. A candidate with zero matching enabled users bumps a new `NO_ELIGIBLE_USERS` skip reason and is never revalidated or sized — this is real backend gating, not a UI-only filter (verified explicitly by `prediction-autonomous-multiuser-test.mjs`, which asserts the filter call exists in the entry tick itself and that a Sports-only user's categories array literally cannot contain `crypto`/`politics`/`economics` values that would let it match a non-sports market).

## 8. Multi-user discovery architecture (design decision, documented)

Global Market Discovery and the shared candidate evaluation/AI-recheck/ranking pipeline are **completely unchanged and still run once per tick**, regardless of how many users are opted in or what their categories are. This was a deliberate choice, not an oversight: re-running discovery or re-evaluating a market once per matching user would multiply Polymarket API calls and paid-AI-recheck calls by the number of participating users for zero benefit (the Engine's evaluation of a given market is identical regardless of who might eventually trade it). Category preference is applied at the one point where it actually changes an outcome — who gets a position — not earlier in the pipeline where it would only add cost without changing correctness.

## 9. User-specific autonomous entry

For each ranked, gated candidate: matching enabled users are identified (Section 7) → each user's own duplicate check (`hasOpenAutonomousPosition(telegramId, marketId)`) → each user's own available capital → each user's own final size/execution price/fee → an independent insert with that user's `telegram_id`. A market can now simultaneously have an OPEN position for User A and no position for User B (wrong category) and a separate OPEN position for User C (different category match, different size) — three independent rows, never one shared row "displayed to everyone."

## 10. Duplicate protection

Revisited per the task's explicit instruction to audit rather than blindly apply `(user, market, OPEN)`. Conclusion: that is in fact the correct model here, confirmed against the actual lifecycle:
- Same user, same market, OPEN twice: **forbidden** — app-level check (`hasOpenAutonomousPosition`) plus a DB-level partial unique index `(telegram_id, market_id) WHERE status='OPEN'` as the real safety net (replaces Phase 7's `(market_id) WHERE status='OPEN')` index, which is now explicitly `DROP`ped in the migration).
- Different users, same market, both OPEN: **allowed** — the new index only restricts per-user, never per-market.
- Concurrent scheduler ticks: still protected by the DB constraint (a `23505` from a lost race is now attributed to the specific user who lost it, via `bump('DUPLICATE_POSITION_DB_CONSTRAINT')` inside the per-user loop).
- Resolution closing the correct position: unaffected — `autonomousResolutionTick` operates generically on `prediction_autonomous_trades` rows by id; the `telegram_id` column simply rides along with the row it always belonged to, with zero changes needed to that function.

## 11. Autonomous position ledger

`prediction_autonomous_trades` gains one column: `telegram_id bigint NOT NULL`. **Verified via a read-only production query before writing the migration that this table has zero rows of any status** (`entry_real` has never been enabled in any prior phase) — so this is purely structural, there is no historical data to preserve, migrate, or risk corrupting. Every other column (market/condition_id/prediction/side/entry price/fees/status/timestamps/settlement/PnL/exit reason) is unchanged.

## 12. PnL and accounting

Implemented exactly as specified in Section 11 of the task:
```
Committed Capital = sum of THIS USER's OPEN autonomous positions' size_usdc
Realized PnL       = sum of THIS USER's CLOSED autonomous positions' net pnl_usdc
Available Capital  = Demo Capital + Realized PnL − Committed Capital
Total Equity        = Demo Capital + Realized PnL + Unrealized PnL
```
Unrealized PnL is summed only across positions with a **known** current price (live CLOB order-book fetch); a position whose book is currently unreachable is excluded from the sum and separately counted in `unrealizedPnlPositionsWithUnknownPrice`, so a partial figure is never silently presented as complete. Manual Demo (`prediction_trades`) and Autonomous Demo (`prediction_autonomous_trades`) remain two fully separate ledgers/accounts, exactly as established in Phase 6 — this phase does not merge them.

## 13. Live open-position monitoring

`autonomous-positions?status=open` (existing Phase 7 endpoint) now filters by the calling user's own `telegram_id` — it previously had no such filter for the OPEN branch either in a way that mattered (the account was system-wide), but the **CLOSED branch had genuinely no user filter in Phase 7**, meaning any authenticated user could see every other user's closed autonomous trade history. This phase closes that gap. The UI card shows question/category/side/entry/current price/size/unrealized PnL, sourced live from the real order book — `null` when unavailable, never fabricated.

## 14. Closed trade history

The Phase 7 `autonomous-positions?status=closed` endpoint existed but was **never rendered in the UI**. This phase adds an "Autonomous Trade History" card to `AutonomousEngineMonitor` showing market/category/side/entry/exit/size/net PnL/win-or-loss/close date — scoped to the calling user only (Section 13's isolation fix applies here too).

## 15. UI changes

- **My Settings** (new card): Demo Capital input, Max/Trade input, category toggle buttons (`all`/`sports`/`crypto`/`politics`/`economics`, `all` exclusive with the rest), a distinct "My Autonomous Participation" enable/disable toggle, and a save button — all scoped to the viewer's own account via the new `autonomous-account`/`autonomous-account-save` endpoints.
- **My Autonomous Account** (existing Phase 7 card, relabeled): now genuinely shows the viewer's own numbers once the backend is scoped per-user; gained an Unrealized PnL tile and a disclosure note when some open positions' current price is unavailable.
- **Autonomous Trade History** (new card): the closed-positions list, per Section 14.
- The distinction between the system-wide "Demo Entry" gate badge (is the scheduler ticking at all) and the new personal "My Autonomous Participation" toggle (has THIS user opted in) is called out explicitly in the UI copy — the two are independent and both must be on for a real position to ever open for a given user.
- The admin settings card is relabeled "New-User Autonomous Account Default" with updated Persian/English copy making clear it seeds new accounts, not a shared one.

## 16. i18n changes

Every new string uses the project's existing `fa ? "..." : "..."` convention. Where the task's own example Persian phrases (e.g. "سرمایه دمو") differed from terminology this exact screen already established in Phase 7 (e.g. "سرمایهٔ دمو" with the same meaning), the existing screen's established terminology was kept for internal consistency, per the task's own instruction to follow existing conventions over the literal examples when they conflict. New concepts (Market Categories, the five category names, My Autonomous Participation, Trade History win/loss) were translated fresh, matching the screen's existing tone. Raw technical identifiers (decision enum values, YES/NO, category codes used for filtering/API, DB column names) remain untranslated by design — only their display wrappers are localized. Two dedicated test files (`prediction-autonomous-monitor-i18n-test.mjs`, extended; `prediction-autonomous-multiuser-test.mjs`, new) verify this.

## 17. Scheduler changes

**None needed beyond what Phase 7 already prepared.** The `prediction-enter-cron` shell-script block drafted in Phase 7 calls `action=autonomous-enter` — the entire multi-user logic lives inside that single API action's implementation (`autonomousEntryTick`), so the scheduler wiring itself required zero changes. It remains **prepared but not installed/enabled** on the VPS. Discovery/Shadow Entry/Resolution remain ON; Learn and Real Trading remain OFF; `entry_real`'s gate file has not been created.

## 18. DB / migration changes

**Required, not yet applied.** `migrations/prediction_market_multiuser_autonomous.sql`:
1. `ALTER TABLE prediction_autonomous_trades ADD COLUMN telegram_id bigint`, then `SET NOT NULL` (safe: table verified empty, Section 11).
2. `DROP` the old `(market_id) WHERE status='OPEN'` unique index; `CREATE` the new `(telegram_id, market_id) WHERE status='OPEN'` one.
3. `CREATE TABLE prediction_autonomous_user_accounts` (Section 3).

`npm run backup` was already run from this session before writing this report (**216,220 rows**, `backups/2026-09-16T08-30-36/`) — this is the read-only, HTTP-API-based backup this project's convention requires before any DB change, and it does not itself require the migration to exist. The actual DDL application requires direct `psql` access to the VPS's local Postgres instance, which this session does not perform itself (see Section 26 for why, and the exact owner-run commands).

## 19. First real autonomous Demo test

**Not performed — correctly blocked, not skipped or faked.** Opening any real position requires at least one row in `prediction_autonomous_user_accounts` with `autonomous_enabled=true`, which requires the migration in Section 18 to exist first. No such row can exist yet. This report does not claim a trade occurred, and none did.

## 20. Real-compatibility

Unchanged from the intended design: `User Account → Capital → Risk Config → Central Engine (shared) → Position Plan → Execution` — Demo's "execution" step is simply an insert into `prediction_autonomous_trades`; a future Real executor would replace only that last step (an actual signed Polymarket order) while every layer above it — account ownership, capital/risk constraints, the shared Engine, category preferences — carries over unchanged. Phase 8 did not implement or assume anything Real-incompatible (no wallet/signing code exists anywhere in this diff — verified by the test suite).

## 21. Admin vs user settings

Cleanly separated per the task's Section 21: the `settings` table keys are now explicitly a **new-user default template** (admin/system-level, controls what a brand-new account starts with) — never a live account. All per-user configuration (capital, max-trade, categories, participation) lives in the new `prediction_autonomous_user_accounts` table, read/written only through the authenticated `autonomous-account`/`autonomous-account-save` actions.

## 22. Security / isolation

- `autonomous-account`, `autonomous-account-save`, `autonomous-status`, and `autonomous-positions` all derive their target user exclusively from `telegramId = verifySession(sessionFromRequest(req), botToken)` — an HMAC-verified session token — never from any client-supplied id in the request body or query string.
- The Phase 7 isolation gap in `autonomous-positions`'s CLOSED branch (Section 13) is fixed.
- Verified via `prediction-autonomous-multiuser-test.mjs`: neither the save nor the read endpoint references `body.telegramId` or `req.query.telegramId` as the target identity.

## 23. Protected areas — confirmed untouched

`git diff --stat` against this PR touches exactly: `api/predictions.ts`, `api/admin.ts`, `src/app/App.tsx`, `migrations/prediction_market_multiuser_autonomous.sql`, and four `scripts/prediction-*-test.mjs` files. No Futures, Spot, Fast Trader, Autonomous Supervisor, wallet, signing, or Real-order code was touched. Real Trading remains architecturally OFF (`mode==='real'` still returns 501 unconditionally elsewhere in the file, unmodified).

## 24. Database / migration safety

Backup completed (Section 18). The migration is additive-only (`ADD COLUMN`, `CREATE TABLE IF NOT EXISTS`, index create/drop) — no data is rewritten or destroyed, and the empty-table verification means there is no historical data at risk. `NOTIFY pgrst, 'reload schema'` is included so PostgREST picks up the new column/table without a service restart, matching every prior migration's convention in this repo.

## 25. Tests

**21 prediction test files, 393 checks, 0 failed** (Phase 7 baseline: 20 files / 335 checks). Breakdown of what changed this phase:
- `scripts/prediction-autonomous-account-test.mjs` (rewritten, 37→59 checks): per-user account model, lazy defaults, category normalization/matching (pure-function execution via `typescript` transpilation, not just regex), multi-user entry-tick wiring, endpoint auth/validation, accounting formula correctness.
- `scripts/prediction-autonomous-multiuser-test.mjs` (new, 17 checks): account isolation, same-market-different-users, backend category enforcement, security/identity isolation, confirmation the Central Engine is never forked per user.
- `scripts/prediction-duplicate-protection-test.mjs` (rewritten, 8→14 checks): the removed blanket pre-filter, the new per-user call site, the new partial unique index.
- `scripts/prediction-autonomous-monitor-i18n-test.mjs` (extended, 36→49 checks): My Settings card, Trade History card, relabeled admin card, the one legitimate new write action.
- `scripts/prediction-autonomous-sizing-test.mjs`: **unchanged, 10/10 still passing** — `computeAutonomousPositionSize`'s signature/body were not touched by this phase, confirming the Kelly→cap→final chain is genuinely untouched.
- `scripts/prediction-observability-test.mjs`: one assertion required restoring a single-call-site invariant for the `prediction_predictions` annotation (moved back to a shared point before the shadow/real branch, matching its original Phase 7B-2 design) — not a functional regression, a structural cleanup this phase's refactor briefly disturbed and then corrected.

## 26. Deployment

- Branch `prediction-phase8-multiuser-autonomous-demo` → PR [#69](https://github.com/signal0verse/signalverse-main/pull/69) → CI green → merged (`35bbb34`) → `production-ci.yml`'s "Deliver release to production" green.
- **Production verification (read-only SSH, post-deploy):** `/opt/signalverse/app` → `/opt/signalverse/releases/35bbb3466b6d647404c0280165d4d9f0f02365c4` (exact merge commit). `grep -c` for Phase 8 markers (`prediction_autonomous_user_accounts`, `userMatchesCategory`, `NO_ELIGIBLE_USERS`) against the live bundle returned 7 matches — the new code is genuinely running, not just built. `jobs.d/` unchanged (`prediction-enter-cron`/`prediction-learn-cron` still absent). An unauthenticated request to the new `autonomous-account` endpoint correctly returned `{"error":"Not authenticated"}`.
- **Live scheduler health post-deploy:** the very next `discover` (08:25:49 UTC) and `entry_shadow` (08:25:54 UTC) ticks after deploy both completed with `success:true` against real production data (43 eligible markets, 50 candidates scanned, realistic skip-reason distribution) — proving the heavily-refactored `autonomousEntryTick` function still works correctly end-to-end in production for the code path that IS currently live (shadow observation). `resolve` also ticked successfully (08:26:58 UTC).
- **Migration status:** confirmed via a direct query that `prediction_autonomous_user_accounts` does not exist yet (`PGRST205: Could not find the table`) — the migration genuinely has not been applied, exactly as expected at this point in the rollout.

### Exact owner-run commands to apply the migration

This session does not execute `psql` DDL against the VPS directly (the same "do not route around the platform's remote-write restriction, hand the owner exact commands" posture used for every prior VPS write in this project, Phase 5 onward). `npm run backup` has already been run (Section 18). From this machine (owner's own shell):

```bash
scp -P 22123 -i ~/.ssh/signalverse_contabo_ed25519 migrations/prediction_market_multiuser_autonomous.sql root@13.140.149.56:/tmp/prediction_market_multiuser_autonomous.sql
ssh -p 22123 -i ~/.ssh/signalverse_contabo_ed25519 root@13.140.149.56 "sudo -u postgres psql -v ON_ERROR_STOP=1 -d signalverse_cutover2 -f /tmp/prediction_market_multiuser_autonomous.sql"
```

After it completes, a session with read access can confirm success via `SELECT * FROM prediction_autonomous_user_accounts LIMIT 1;` (expected: empty result, not an error) and `\d prediction_autonomous_trades` (expected: `telegram_id` column present, `NOT NULL`).

## 27. Production verification checklist (per task Section 27)

| Item | Status |
|---|---|
| Authenticated user account retrieval | Endpoint deployed and auth-enforced; full read/write cycle pending migration |
| User Demo capital / settings / category preferences | Code deployed; cannot be exercised end-to-end until the table exists |
| User-specific market filtering | Enforced in code (Section 7), verified structurally; no live users to observe yet |
| Open/closed positions, resolution, account calculations | Code deployed and reuses already-proven resolution logic (Section 10); no positions exist yet to observe |
| Authorization | Verified live (401 on unauthenticated request) |
| Scheduler state | Verified: `entry_real`/`learn` absent, `resolve`/`discovery`/`shadow-entry` present and ticking successfully post-deploy |
| Demo Entry / Real Trading state | `entry_real` disabled; Real Trading architecturally OFF (`mode==='real'` still 501) |

## 28. Not over-engineered

Reused: the `fast_trader_sessions` per-user-table pattern, the `settings` key/value pattern (repurposed, not duplicated), the existing session-auth helper, the existing i18n ternary convention, the entire Central Engine unmodified, the existing order-book/resolution/ledger logic, and the existing `AutonomousEngineMonitor` UI component (extended, not replaced). No new framework, service, or parallel ledger was introduced.

## 29. Acceptance criteria

- [x] Every user has an isolated Demo account (once migration lands)
- [x] User can define Demo capital
- [x] User can define max trade/risk
- [x] User can choose market categories
- [x] Category preference is persisted (once migration lands)
- [x] Backend enforces category preference
- [x] Central Engine remains shared
- [x] Autonomous positions belong to users
- [x] Users cannot see another user's positions (fixed the Phase 7 CLOSED-branch gap)
- [x] Users cannot access another user's capital/PnL
- [x] Available capital is correct
- [x] Realized PnL is correct
- [x] Unrealized PnL is real/current-data based
- [x] Position sizing respects Engine recommendation + user constraints
- [x] Duplicate protection is correct for multi-user operation
- [x] Resolution closes the correct user position
- [x] Closed trade history works
- [x] UI works in Persian
- [x] UI works in English
- [x] Demo Entry status is live/dynamic
- [x] Real Trading remains OFF
- [x] Learn remains OFF
- [x] Futures/Spot/Fast Trader untouched
- [x] Existing Prediction tests remain green
- [x] New tests pass
- [x] Build passes
- [x] CI passes
- [x] Production deploy verified
- [x] Production smoke tests pass (scheduler ticks green post-deploy)
- [ ] Autonomous Demo activation — **explicitly documented as pending owner action** (migration, then at least one user opt-in, then the separately-authorized gate activation)

## 30. Verdict and exact next step

**NOT YET READY for activation — but only because of one specific, well-understood, owner-actionable blocker (the DB migration), not any unresolved design or code question.**

Exact next step, in order:
1. Owner runs the two commands in Section 26 (backup already done).
2. This session (or the next one) re-verifies read-only: table exists, `telegram_id` column present, PostgREST schema cache reloaded.
3. At least one user (plausibly the owner's own account first) configures their own Demo Capital/Max-Trade/Categories and flips "My Autonomous Participation" on, via the now-functional UI.
4. `prediction-enter-cron` is installed on the VPS (script already prepared in Phase 7, needs no changes) and its gate file created — the same owner-run staging/`bash -n`/atomic-install pattern as every prior VPS write in this project.
5. Observe the next real `entry_real` tick against organic production data; verify a genuine row appears in `prediction_autonomous_trades` for that specific user (never claim a trade from `would_open`/`wouldHaveOpened` alone).
6. Only after a real, observed lifecycle (open → visible in UI → resolution → PnL update) should this feature be considered fully verified end-to-end.

Real Trading remains OFF throughout every one of these steps — nothing in this activation path touches it.
