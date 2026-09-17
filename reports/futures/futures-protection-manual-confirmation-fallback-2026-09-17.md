# Binance Protection Replacement — Manual Confirmation Fallback

**Date:** 2026-09-17 · **Scope:** Real Binance Futures Re-Analyze protection replacement only. **NOT DEPLOYED. NOT pushed/merged to `main`. No PR opened. No real Binance order/position touched.** All code committed to the existing feature branch `futures-liquidation-feasibility-fix` only, awaiting explicit review/approval before any deploy step.

> **2026-09-17 correction (pre-approval review):** the initial implementation below used a 0.5% relative tolerance (`REANALYSIS_FORMULA_TOLERANCE_PCT`) to decide whether Binance's actual `triggerPrice` matched the pending proposal. This was flagged as too coarse to represent genuine exchange rounding and was removed before approval - see §8 for the corrected rule (Binance symbol `tickSize` normalization) and §12 for the updated test results. Nothing else in this report changed as a result: the architecture, the `-4130` detection, the state machine, and every other safety property below are exactly as originally implemented.

## 1. Why this exists — forensic background

A real, user-conducted controlled live test on Production (CAKEUSDT LONG) and an independent reproduction on **Binance Futures Testnet** conclusively established:

- Binance rejects a **second same-type `closePosition=true` conditional order** (a new `STOP_MARKET` while the old `STOP_MARKET` is still live, or a new `TAKE_PROFIT_MARKET` while the old one is still live) with **error `-4130`**: *"An open stop or take profit order with GTE and closePosition in the direction is existing."*
- This is **completely unrelated to `timeInForce`** — `GTC` reproduces the identical `-4130` as `GTE_GTC`, tested on both legs, on Binance Futures Testnet, byte-for-byte identical error message to Production.
- Binance's public API has **no in-place modify for Algo orders** (`PUT /fapi/v1/order` and the WebSocket `order.modify` are both documented as LIMIT-order-only) and **no atomic cancel-replace** for `/fapi/v1/algoOrder` — only separate `Cancel` then `Create` calls.
- Binance's own Web/App UI achieves the "edit TP/SL without cancelling first" experience through a **private, undocumented endpoint** (`/bapi/futures/v1/private/future/strategy/place-order`) — confirmed directly by Binance staff on the official developer forum ("`/bapi/` is not for public used ... not advised to use it"; "OTOCO TP/SL not being directly integrated in the API ... other roadblocks"). **This project will never call that endpoint.**
- This project's own standing safety rule forbids a Cancel-first replacement sequence (it creates a real, if brief, protection-gap window).

Conclusion: `-4130` is a **structural** Binance API limitation, not a transient failure the existing bounded-backoff retry (`PROTECTION_UPDATE_DEFERRED`) can ever resolve. The only real fix available within the public API is a **manual confirmation workflow**: the user changes SL/TP directly on Binance (where the UI itself has the private-endpoint access this project refuses to use), and SignalVerse verifies Binance's own resulting state before trusting it.

## 2. Architectural flow (unchanged pipeline, one new terminal branch)

```
Engine → Supervisor → Risk/Liquidation Safety → Proposal Direction Validation → Binance Protection Update Attempt
                                                                                          │
                                                                     ┌────────────────────┴─────────────────────┐
                                                                     │                                            │
                                                            success (both legs)                          failure (either leg)
                                                                     │                                            │
                                                            SL_TP_UPDATED                          is it -4130 (existing same-type order)?
                                                                                                     │                          │
                                                                                                    yes                         no
                                                                                                     │                          │
                                                                                    PROTECTION_UPDATE_PENDING_CONFIRMATION   PROTECTION_UPDATE_DEFERRED
                                                                                    (new pending-proposal row, no Binance    (existing bounded-backoff
                                                                                     retry - the user must act)              retry - UNCHANGED)
```

Nothing upstream of the Binance placement attempt changed — Engine, Supervisor, Risk, and the entry-direction validation (`evaluateProtectionProposalDirection`) all still run exactly as before and still gate everything below them.

## 3. Files changed

| File | What changed |
|---|---|
| `migrations/futures_protection_proposals.sql` | **New migration** (not yet applied to Production). Adds `futures_protection_proposals`. |
| `api/copytrade.ts` | New helpers (`floatEq`, `appendProposalHistory`, `getActivePendingProtectionProposal`, `reconcilePendingProtectionProposal`, `createPendingProtectionProposal`, `expirePendingProtectionProposal`, `confirmProtectionProposal`) + new constant `BINANCE_ERROR_EXISTING_SAME_TYPE_PROTECTION = -4130`. `runFuturesReanalysis`'s protection-failure branch now detects `-4130` specifically and routes to the new pending-proposal path instead of the bounded-backoff `DEFERRED` path (every other Binance error keeps the exact old `DEFERRED` behavior, byte-for-byte unchanged). New `action=confirm-protection-proposal` HTTP handler. The 3 existing "stop the AUTO policy on position close" call sites (vanished-position, SL/TP-hit close, liquidation-fail-safe close) each gained a parallel `expirePendingProtectionProposal` call. The `GET` real-trades-list handler now batch-attaches `pending_protection_proposal` the same way it already attaches `reanalyze_status`. |
| `src/app/App.tsx` | `CopyTrade` type gained `pending_protection_proposal`. New `handleConfirmProtectionProposal` handler (sends only the trade `id`, nothing else). New bilingual (fa/en) banner rendered under an OPEN real Binance position card when a proposal is pending, with the "Confirm Binance Changes" button, reusing the existing `reanalyzeToast` mechanism for the result message. |
| `scripts/futures-reanalysis-test.mjs` | 7 new functions/1 new constant added to the AST-extraction lists; harness extended with a configurable `openAlgoOrders` mock; **20 new tests**. |
| `scripts/futures-real-execution-fault-test.mjs` | Same 7 functions/1 constant added to its own extraction lists; **2 new end-to-end tests** through the real (non-mocked) `syncRealBinanceTrades`. |

## 4. Database changes — migration required, NOT yet applied

New table `futures_protection_proposals` (see the migration file's own extensive comments for the full column-by-column rationale). Key design decisions, stated explicitly per your requirements:

- **No new column on `copy_trades`** — `stop_loss`/`tp1`/`exchange_sl_order_id`/`exchange_tp_order_id` remain the single source of truth for "what protection is live now," exactly as the existing Re-Analysis feature already guarantees.
- `status` is one of `PENDING_CONFIRMATION` / `CONFIRMED` / `EXPIRED` / `INVALIDATED`. **There is deliberately no persisted `NOT_CONFIRMED` terminal status** — your own requirement 8 says a failed confirm attempt must "keep the proposal pending," which is logically incompatible with also treating `NOT_CONFIRMED` as a status the row settles into. Resolved by adding `last_check_result` (`CONFIRMED` | `NOT_CONFIRMED`) + `last_checked_at` as separate columns recording the outcome of the most recent confirm *attempt*, while `status` itself stays `PENDING_CONFIRMATION` until an actual match is found. This is called out explicitly so it can be revisited if this interpretation isn't what was intended.
- A partial unique index enforces **at most one `PENDING_CONFIRMATION` row per trade** — this is both the concurrency guard and the mechanism `reconcilePendingProtectionProposal` uses to "reuse the existing pending proposal instead of creating a duplicate," mirroring `futures_reanalysis_policies`'s own `ACTIVE`-row uniqueness pattern.
- An append-only `history` jsonb column captures every lifecycle event (`created`, `invalidated`, `confirmed`, `not_confirmed`, `expired`) with a timestamp and detail payload, so the full lifecycle can be reconstructed without a second audit table — matching the "smallest possible migration" instruction.

**Migration status: written, reviewed, NOT applied to Production.** Must go through this project's own established VPS migration path (`scp` + `ssh` + `sudo -u postgres psql`, documented in `HANDOFF.md`) with a `npm run backup` first — never a "Supabase SQL Editor."

## 5. State machine

```
                 ┌─────────────────────┐
  -4130 hit  ───▶│ PENDING_CONFIRMATION │
                 └──────────┬───────────┘
                             │
        ┌────────────────────┼─────────────────────┬───────────────────────┐
        │                    │                      │                       │
  user confirms,       user confirms,        position closes        a materially different
  Binance matches      Binance does NOT       before confirmation     new proposal supersedes
  (within 0.5%          match                                         this one
   rounding tolerance)        │                      │                       │
        │              (stays PENDING,        ┌─────────────┐        ┌──────────────┐
        ▼              last_check_result=      │   EXPIRED   │        │  INVALIDATED  │
  ┌───────────┐         NOT_CONFIRMED)         └─────────────┘        └──────────────┘
  │ CONFIRMED │
  └───────────┘
```

## 6. Binance API behavior confirmed (Testnet-verified, not guessed)

| Question | Answer | Evidence |
|---|---|---|
| Does `PUT /fapi/v1/order` or WS `order.modify` support Algo orders? | **No** — LIMIT orders only | Official docs, quoted verbatim in the forensic report this implementation follows |
| Is there an atomic cancel-replace for Algo orders? | **No** | Official docs — only separate `POST`/`DELETE` |
| Does Binance's own UI use the public API for its "edit TP/SL" feature? | **No** — a private `/bapi/` endpoint | Confirmed by Binance staff on the official dev forum |
| Is `-4130` about `GTE_GTC` specifically? | **No** — `GTC` produces the identical error | Binance Futures Testnet, both legs, both `timeInForce` values, identical `-4130` message |
| Is `-4130` about SL-vs-TP coexisting? | **No** — SL+TP already coexist fine in every observed case; the conflict is specifically **same-type** (new `STOP_MARKET` vs. an existing live `STOP_MARKET`, or new `TAKE_PROFIT_MARKET` vs. an existing live `TAKE_PROFIT_MARKET`) | Testnet: SL+TP both live simultaneously throughout; only the *duplicate-type* attempts failed |

## 7. `-4130` handling in `runFuturesReanalysis`

Detection: after both `ensureBinanceProtectionLeg` calls, if either leg's structured `rawError.exchangeCode === -4130`, the pending-proposal path is taken instead of the generic `DEFERRED` path. Every other Binance error (timeout, `-2021` "would immediately trigger," etc.) is **completely unaffected** and keeps the exact pre-existing bounded exponential-backoff retry (`FUTURES_REANALYSIS_DEFERRED_RETRY_BASE_MS`/`_MAX_MS`/`_MAX_ATTEMPTS`, all unchanged).

Before ever attempting the Binance call, `reconcilePendingProtectionProposal` checks for an existing `PENDING_CONFIRMATION` row for the same trade:
- **Identical** proposed SL/TP (exact float equality, the same convention this codebase already uses for "did anything actually change") → the existing proposal is reused, Binance is **not** called again.
- **Materially different** → the stale row is marked `INVALIDATED` (history preserved, never deleted/overwritten) and a genuine new attempt proceeds.

## 8. Confirmation flow (`action=confirm-protection-proposal`)

The client sends **only the trade `id`** — verified structurally by a dedicated test that the handler's only body destructure is `const { id } = body;` and no SL/TP/trigger-price field is ever read from the request. `confirmProtectionProposal(trade, apiKey, apiSecret, proposal)`:

1. Re-reads `queryBinanceAlgoOrders` (the exact same read-only function this feature already uses elsewhere) — never trusts anything cached.
2. Finds the live `STOP_MARKET`/`TAKE_PROFIT_MARKET` matching the position's close side.
3. **[Corrected 2026-09-17]** Reads the pair's real `tickSize`/price precision via the existing `getSymbolInfo` (the same call `runFuturesReanalysis` already makes before ever sending a proposal to Binance), then normalizes **both** the proposal's value and Binance's actual `triggerPrice` to that exact tick grid via the existing `binanceRoundStep` helper, and requires the two normalized values to be equal (`floatEq`'s own `1e-9` epsilon - IEEE floating-point noise only, never a price tolerance). A relative percentage tolerance was deliberately rejected: it would accept a materially different price as "confirmed" merely because it happened to be numerically close, which is not the same thing as genuine exchange-precision rounding. Applied **independently to each leg** — a matching SL can never compensate for a mismatched TP or vice versa.
4. **Match on both legs:** persists Binance's **actual** `triggerPrice`/`algoId` values (never the theoretical proposal, and never the tick-rounded value either - the literal number Binance returned) into `copy_trades`, marks the proposal `CONFIRMED`.
5. **No match:** records `last_check_result: 'NOT_CONFIRMED'` on the (still-`PENDING_CONFIRMATION`) proposal row; `copy_trades` is untouched.

## 9. Reconciliation behavior

The existing regular reconciliation tick (`syncRealBinanceTrades`'s protection-verification path) is **completely unchanged** — it continues protecting whatever `copy_trades.stop_loss`/`tp1` currently says (the OLD, still-valid values, since a pending proposal never writes there), and will still detect/recover a genuinely `EXPIRED` leg exactly as before. The only new wiring is the 3 expiry call sites so a pending proposal never outlives the position it was for.

## 10. Safety behavior — explicit confirmations

- ✅ **No Cancel-first replacement was implemented.** The existing "place new, verify, only then cancel old" ordering is completely untouched; the new branch is reached only when that ordering's *placement* step already failed.
- ✅ **No private Binance `/bapi/` endpoint was used or referenced anywhere in the implementation** — confirmed by a full-text search of the diff.
- ✅ **Existing Binance protection remains untouched while a proposal is pending** — `cancelBinanceAlgoOrderById` is never reached on this path (tests 2/12).
- ✅ **`copy_trades.stop_loss`/`tp1` are not updated until `confirmProtectionProposal` finds a genuine Binance-side match** (tests 4–6).
- ✅ **Actual Binance values, not theoretical proposal values, are stored after successful verification** (test 18: genuinely tick-normalizable actual values 94.004/124.006 are stored, not the proposed 94/124).
- ✅ **`-4130` alone cannot trigger the liquidation fail-safe close** — `resolvedByReanalysis = reResult.finalAction === 'SL_TP_UPDATED'` still only matches that one literal value; `PROTECTION_UPDATE_PENDING_CONFIRMATION` is just another non-`SL_TP_UPDATED` outcome, structurally proven (test 10/13) and end-to-end proven (2 new tests: AT_RISK still closes via the *same, unmodified* fail-safe; SAFE stays fully `OPEN`).
- ✅ **The Supervisor cannot bypass or influence confirmation** — `confirmProtectionProposal`'s source contains no reference to the Supervisor/Engine at all (test 11).
- ✅ **The browser cannot spoof a confirmation** — only `id` is ever read from the request body (test 14).

## 11. Bilingual/i18n

This project's i18n architecture is the inline `fa ? "…" : "…"` ternary convention used throughout `App.tsx` (there is no separate keyed-dictionary system) — the new banner follows this exact pattern, including the RTL `text-right`/`flex-row-reverse` gating already used everywhere else in the same file. All 8 suggested phrases (title, Current/Proposed SL/TP, waiting status, confirm button, not-confirmed message) exist in both languages — verified by a dedicated test that scans the actual rendered banner source for every required Persian/English pair (test 16), plus a separate test confirming the RTL convention is followed (test 17). Internal enum values (`PENDING_CONFIRMATION`, `CONFIRMED`, `STOP_MARKET`, `-4130`, etc.) are correctly left untranslated.

## 12. Tests executed (post-correction)

```
node --test scripts/futures-reanalysis-test.mjs            → 120/120 PASS (98 pre-existing + 20 original new + 3 tick-size-correction tests, 1 test rewritten in place)
node --test scripts/futures-real-execution-fault-test.mjs  → 109/109 PASS (no regression - this file's 2 end-to-end -4130 tests use exact/materially-different values, unaffected by the tolerance rule change)
node scripts/futures-liquidation-feasibility-test.mjs      → 64/64 PASS (no regression)
npx tsc --noEmit -p .                                       → 0 errors in api/copytrade.ts / src/app/App.tsx (same 3 pre-existing, unrelated errors elsewhere in App.tsx, untouched by this change)
npm run build                                                → PASS (web + admin)
esbuild api/copytrade.ts --bundle --platform=node --format=esm --packages=external → PASS
```

**Tick-size-correction regression tests added to `scripts/futures-reanalysis-test.mjs`:**
- Test 18 (rewritten from the original test 5): a genuine tick-size-normalization difference (both values floor to the identical `0.01` tick bucket) → `CONFIRMED`, and the exact actual values (94.004/124.006) are persisted, not the theoretical proposal (94/124).
- Test 19 (new): a value that is only 0.32% away from the proposal — well inside the OLD, now-removed 0.5% tolerance — but rounds to a genuinely different tick bucket (94.3 vs. proposed 94.0 at `tickSize=0.01`) → `NOT_CONFIRMED`, `copy_trades` unchanged. This is the specific regression test proving the old percentage rule is gone.
- Test 20 (new): SL matches exactly; TP is materially different (a different tick bucket) → overall `NOT_CONFIRMED` — proves both legs are checked independently and one matching leg can never compensate for the other.
- Tests 4/6/6b (unchanged, still passing): exact match → `CONFIRMED`; genuinely different values → `NOT_CONFIRMED` with `copy_trades` unchanged and the proposal remaining `PENDING_CONFIRMATION`; no live orders found at all → `NOT_CONFIRMED`, no crash.

No lint script exists in this project's `package.json` (`tsc`/`build`/the `.mjs` test suites are the full existing validation surface) — all of it was run, none skipped.

New tests cover, mapped to your own 17-item list: actionable proposal + `-4130` → proposal created (1); existing Binance SL/TP untouched (2, 12); DB SL/TP unchanged (3); confirm with matching values → `CONFIRMED` (4); confirm with rounded values → actual values saved (5); confirm with different values → `NOT_CONFIRMED`, DB unchanged (6, +6b for "nothing live at all"); position closes → `EXPIRED` (7, +7b no-op case, + a structural test proving all 3 real close sites call the expiry); duplicate suppression (8, +8b end-to-end proving zero extra Binance calls); materially-different-proposal transition (9); liquidation `AT_RISK` behavior unchanged (10, 13, + 2 full end-to-end `syncRealBinanceTrades` proofs); Supervisor cannot bypass (11); client cannot spoof (14); Binance-as-source-of-truth (15, same as 4/5); bilingual keys exist (16); RTL convention followed (17).

## 13. What was intentionally NOT changed

Strategy/Engine decision logic, ATR/multiplier/TP formulas, leverage logic, `evaluateProtectionProposalDirection`'s entry-direction gate, the liquidation-feasibility gate and its formula, the AI Supervisor's reviewer-only architecture, credit/cycle logic (verified — no new function references any credit/cycle identifier), `openBinanceTrade` (never called from this path), the existing `PROTECTION_UPDATE_DEFERRED` bounded-backoff behavior for every non-`-4130` Binance failure, and the "place-new-before-cancel-old" ordering itself.

## 14. Deployment status

**NOT DEPLOYED.** Committed to `futures-liquidation-feasibility-fix` only. No PR opened, no merge to `main`, no push-triggered production deploy, no Production database migration applied, no real Binance order/position touched at any point during this implementation. Awaiting explicit review and approval before any of the above.
