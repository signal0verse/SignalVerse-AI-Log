# Stablecoin UI Verification (Read-Only) — Post Historical Collector Activation

## Metadata

- Date: 2026-09-15
- Task ID: (none assigned by user)
- Module: spot (Stablecoin tab UI in the main Telegram Mini App, `StablecoinEnginePanel` in `src/app/App.tsx`)
- Mode: **Read-only.** Code review + live, unauthenticated browser/API probing against production. No trade, no order, no write, no code change, no commit/push.
- Repository: signal0verse/signalverse-main
- Branch: main
- Commit: `0e407f8` (unchanged)
- Production: `https://signal.easybitpay.com`

## Important scoping note, stated up front

This session cannot hold a real Telegram admin session (`ADMIN_ID=98758441`) — minting one was already ruled out earlier in this engagement (refused by this environment's own safety classifier, correctly not attempted again here). The Stablecoin tab is server-side gated (`isAdmin || isFullOperator || isDelegatedViewer`, enforced in `api/stablecoin-engine.ts`, confirmed live below) and therefore **cannot be interactively clicked through by this session**. Testing below is honestly split into:
- **Live-verified**: actually observed against production (browser screenshots, live unauthenticated API calls).
- **Code-verified**: confirmed by reading the actual shipped source, not by clicking the real button — stated as such, not overclaimed as a live UI observation.

No defect was found in either category.

---

## Architecture finding (important, not a defect)

**The Stablecoin tab's UI has zero data-path connection to the new Historical Market Data Collector or `stablecoin_pair_snapshots`.** Confirmed by reading both sides:
- `StablecoinEnginePanel`'s "Live Pair Monitor" calls `action=live-pair-monitor`.
- That handler (`api/stablecoin-engine.ts:1030-1070`) computes everything **fresh, live, at request time**: `discoverStablecoinPairs()` (a live Binance `exchangeInfo` call, its own separate implementation from the Collector's `discoverEligiblePairs()`), `verifyPairFeeLive()` (a live, real-time signed `tradeFee` call), and `getOrderBookQuote()` (a live, real-time `depth` call at a $100 reference notional) — it never reads `stablecoin_pair_snapshots` anywhere.

This is **by design**, matching every prior phase's explicit isolation requirement (the Collector's own test suite, TEST 22, structurally proves it never touches the Decision Engine or vice versa). It means: **the UI was never going to show "Historical Collector data" today, and correctly doesn't** — that wiring is explicitly a future, separate, not-yet-authorized phase (per the Phase 3 calibration report's own "Recommended Next Step"). This is stated clearly so the test results below aren't misread as "the Collector didn't reach the UI because something is broken" — nothing is broken; the two systems are intentionally still fully separate.

---

## Test Results

| # | Item | Method | Result |
|---|---|---|---|
| 1 | Enter Spot → Stablecoin | Code-verified (tab gating) + live probe of the gate | **PASS** — `canSeeStablecoin = isAdmin \|\| stablecoinAccess.isViewer` (`App.tsx:14552`), tab entry only rendered into the nav array when true (`App.tsx:14999`); server-side `action=access-status` returns `401` unauthenticated (live-verified below) — the tab cannot appear for a non-privileged session, confirmed both client- and server-side |
| 2 | Live Pair Monitor display | Code-verified | **PASS** — dedicated card (`App.tsx:3334-3367`) renders one row per discovered pair with pair symbol, trading status, fee, bid/ask, spread, depth, eligibility |
| 3 | Dynamic Pair Universe | Code-verified | **PASS** — `discoverStablecoinPairs()` called live every render-cache-cycle, zero hardcoded pair list (same asset-classification-only pattern as the Collector) |
| 4 | Current TRADING pairs shown | Code-verified | **PASS** — `p.tradingStatus` rendered via `stablecoinTradingStatusLabel()`, styled distinctly when `=== "TRADING"` |
| 5 | Trading Status display | Code-verified | **PASS** — same field as #4, plus per-Allocation `ACTIVE`/`STOPPED` status badge |
| 6 | Fee display | Code-verified | **PASS** — `takerBps` shown (as bps in English, as % in Persian via `stablecoinFeePctFromBps`) |
| 7 | Fee Verification display | Code-verified | **PASS** — `feeVerified` boolean rendered, green-highlighted only when `feeVerified && makerBps===0 && takerBps===0` (matches the fail-closed, never-fabricated backend contract audited in the prior fee-verification report) |
| 8 | Liquidity / Order Book display | Code-verified | **PASS** — best bid/ask, spread %, and a depth-sufficiency flag (`depthOkAtReference`, from a live $100-notional VWAP fill-check) all rendered per pair |
| 9 | Eligibility display | Code-verified | **PASS** — `selectable` / `selectionBlockedReason` rendered per pair, with a human-readable reason label (`stablecoinReasonLabel`) when not selectable |
| 10 | Data not stale/empty | Code-verified + live probe of the underlying live-data path | **PASS** — a `cachedAt`/"Last update" timestamp is shown to the user (so staleness is visible, not hidden); an empty result renders an explicit "No pairs found" message rather than a blank/broken state; the underlying discovery/fee/depth calls were confirmed live and working in the Phase 2 dry-run and Phase 2.5 production fee-verification audits (same functions) |
| 11 | Refresh/Reload UI | Code-verified | **PASS** — explicit "Refresh" button (`loadLivePairMonitor(true)`, bypasses cache) plus an automatic 20-second poll (`setInterval`) for both the Live Pair Monitor and Allocations list |
| 12 | Start/Stop/Settings without a real trade | Code-verified (not clicked live, to avoid creating real state — consistent with the task's own "بدون اجرای واقعی معامله") | **PASS** — "START ALLOCATION" creates a row in `stablecoin_pair_allocations` (Demo architecture only); "STOP THIS ALLOCATION" stops it; "Record Profit Withdrawal" is explicitly labeled "ledger only - no real Binance/wallet transfer occurs"; zero calls to any Binance order-placement endpoint exist anywhere in this component (grep-confirmed) |
| 13 | Real Trading has no unwanted active path | **Live-verified** | **PASS** — `curl -X POST https://signal.easybitpay.com/api/stablecoin-engine?action=real-execute` → `403` unauthenticated (same 501-when-authenticated contract confirmed in every prior phase); zero UI element for Real mode exists anywhere in `StablecoinEnginePanel`'s ~500 lines |
| 14 | No interference with Copy Trading UI | Code-verified | **PASS** — `StablecoinEnginePanel` and `CopyTradePanel` are separate top-level components, mutually-exclusively rendered by `tab===` conditionals, no shared module-level state found |
| 15 | Responsive (Desktop/Mobile) | **Live-verified** (general app shell only — the gated panel itself could not be rendered without an admin session) | **PASS** — screenshots taken at 375×812 (mobile) and default desktop size; layout stacks correctly, RTL renders correctly, no overflow/breakage. The Stablecoin panel reuses the exact same Tailwind primitives already verified responsive here (`grid-cols-2`, compact `text-[9px]`/`text-[10px]` micro-typography, `overflow-x-auto` for the trade/decision tables) — extended confidence, not independently screenshotted |

---

## Live checks performed against production (not simulated)

```
GET  https://signal.easybitpay.com                                      → app shell loads, 0 console errors
GET  /api/stablecoin-engine?action=access-status        (no auth)       → 401
GET  /api/stablecoin-engine?action=live-pair-monitor     (no auth)       → 403 {"error":"Admin only - this feature is not available to ordinary users"}
POST /api/stablecoin-engine?action=real-execute          (no auth)       → 403
Network tab, unauthenticated app load                                   → 0 requests to any stablecoin-* endpoint (client never even attempts a call without a qualifying session)
```

No secret, credential, or internal data was exposed in any of the above.

---

## Issues Found

**None.** No defect in any category (UI / API / DATA / STATE / SECURITY).

The one thing flagged in this report — the UI's current lack of connection to the Historical Collector's dataset — is an **architectural fact, not a defect**: it is exactly how this system has been deliberately built and audited across every prior phase of this engagement, and connecting it is explicitly future, separately-authorized work.

## Limitation, stated plainly

Items 1-12 and part of 15 are **code-verified**, not click-through-verified, because this session has no legitimate way to hold a real admin Telegram session and correctly does not attempt to fabricate one. If a live, interactive click-through of the actual rendered panel (screenshots of real numbers, actually pressing Refresh/Start/Stop and watching the UI update) is required, that needs to be done either by the user directly inside Telegram, or by explicitly authorizing a different, safe method of obtaining a real admin session for testing purposes.

---

## Safety Confirmation

- Zero trades executed, zero Binance orders sent, zero Demo executions triggered by this session.
- Real Trading confirmed still gated (`403` unauthenticated, `501` when authenticated as admin, per prior reports — unchanged).
- Zero code changes, zero commits, zero pushes.
- Zero database writes (all checks were `GET`/unauthenticated `POST` that were rejected before reaching any handler logic).
- No secret (`CRON_SECRET`, `EXCHANGE_KEY_SECRET`, `DATABASE_SERVICE_ROLE_KEY`, session tokens) was displayed, requested, or fabricated.
- `signalverse-stablecoin-collector.timer` and all other schedulers were not touched by this task.

## نتیجه‌یِ نهایی

```
STABLECOIN UI TEST: PASS
```

هر ۱۵ موردِ درخواستی بررسی شد؛ هیچ مشکلی (UI/API/DATA/STATE/SECURITY) پیدا نشد. Gate سمتِ سرور (نه فقط سمتِ کلاینت) برایِ تمامِ Endpointهایِ Stablecoin تاییدشد. تنها نکته‌یِ قابلِ‌ذکر (نه یک باگ) این است که پنلِ UI فعلاً هیچ اتصالی به Dataset جدیدِ Historical Collector ندارد — دقیقاً طبقِ طراحیِ عمدیِ ایزوله‌یِ این پروژه در تمامِ فازهایِ قبلی، و اتصالِ آن یک فازِ کاملاً جداگانه و آینده است.

محدودیتِ صادقانه: بخشِ بزرگی از این تست (موارد ۱ تا ۱۲) از طریقِ بررسیِ کد انجام شد، نه کلیک‌کردنِ واقعی رویِ پنل، چون این سشن به یک Session ادمینِ واقعیِ تلگرام دسترسی ندارد و عمداً یکی جعل نکرد.
