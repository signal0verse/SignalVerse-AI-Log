# Real Futures — MEXC native market-data routing correction (2026-09-22)

## 1. ROOT CAUSE

The previous tested executable candidate `428c2c3bfb4edbf09cf1423f5aa408684341d65f` selected candle transport by a generic `contract`/`mark` basis with no exchange discriminator. Its Real MEXC software exit path consequently read Binance Futures Contract/Mark candles; Real Binance software exits still read Binance Spot. Passing helper-only tests did not detect the wrong synchronizer wiring.

## 2. OFFICIAL MEXC BASIS

The [official MEXC Contract API documentation](https://mexcdevelop.github.io/apidocs/contract_v1_en/) defines native contract Kline `GET /api/v1/contract/kline/{symbol}`, ticker `GET /api/v1/contract/ticker`, `trend=1` Latest Price, `trend=2` Fair Price and `trend=3` Index Price. Existing SignalVerse MEXC SL **and** TP plan-order builders both submit `trend: 1`; neither builder was changed. The native `BTC_USDT` symbol, MEXC interval names (`Min1`, `Min15`, `Min60`, `Hour4`, `Day1`, `Week1`) and Kline seconds timestamps are used explicitly.

## 3. BEFORE

Real MEXC software SL/TP detection used Binance Contract/Mark, although MEXC native SL and TP trigger on Latest. Real Binance software detection still used Binance Spot, despite native Binance SL/TP having Contract/Mark bases. Manual Real MEXC analysis and Real MEXC current-price preflight could also consume Binance Spot market data. The cache did not encode exchange identity.

## 4. AFTER

An exchange-discriminated Futures window request now owns venue, native symbol and price basis. Real MEXC uses only `contract.mexc.com` native contract Kline for candle-based analysis, pending-trigger detection and software exits, and native ticker `lastPrice` for current-price eligibility/preflight/R:R and read-only trade detail. Source/provenance mismatch, failed GET, malformed response or incomplete Real window fails closed without a Binance/Spot substitute. Manual and automated Real MEXC Pro analysis are server-reobserved through the authenticated native-data bridge. No Engine score, strategy or Supervisor authority changed.

## 5. BINANCE ROUTING

Real Binance analysis/Re-Analyze and entry preflight use Binance USD-M Contract candles/ticker. The software SL observer uses Binance Futures Contract Kline; software TP uses Binance Futures Mark Kline. Native protection remains **SL=Contract, TP=Mark**. No Binance Real order was placed.

## 6. MEXC ROUTING

Real MEXC initial analysis → native contract Kline; min-margin/current-price/entry preflight → native ticker `lastPrice`; pending-signal trigger → native `Min1` Kline; software SL and TP → the **same native Latest contract-price window**. LONG SL probes low, LONG TP high; SHORT SL high, SHORT TP low; the existing conservative SL-first behavior is retained. Native MEXC plan orders remain `trend=1` for both SL and TP. No MEXC Fair/Index series is used for these decisions.

## 7. CACHE ISOLATION

The Real Futures key is `exchange:nativeSymbol:basis:sinceMs`, e.g. `binance:BTCUSDT:contract`, `binance:BTCUSDT:mark` and `mexc:BTC_USDT:latest` with their timestamp suffix. Legacy Spot keys are separately prefixed `spot:`. Same logical symbol cannot reuse another venue's window. A missing Real window never falls through to Spot.

## 8. READ-ONLY MEXC VERIFICATION

Public unauthenticated GETs on 2026-09-22 returned HTTP 200 and `success:true, code:0`: ticker `BTC_USDT` returned `lastPrice` (sample `85899.9`), `fairPrice`, `indexPrice` and timestamp; contract `Min1` Kline returned arrays `time/open/high/low/close` with 2,000 records and seconds timestamps; fair-price `Min1` Kline returned the same response shape and 2,000 records. A one-hour contract Kline query using `start/end` seconds returned 60 rows. Fair-price was read **only for source-shape comparison**, not used by the Real observer. The private `GET /api/v1/private/planorder/list/orders` was **not attempted**: no naturally safe verified credential/order context was established in this task. This report does not claim a natural live protection-order sample or private-account verification. No credentials were used for the public checks.

## 9. TEST RESULTS

The previously selected seven-script focused matrix was 287/287; with seven new native-routing tests, the eight-script run is **294 passed, 0 failed, 0 skipped**. New tests exercise actual MEXC URL selection, source-unavailable fail-closed, native ticker `lastPrice` instead of Fair/Index, interval mapping/provenance, rejection of client-provided prices, both existing `trend=1` protection builders and MEXC/Binance synchronizer source wiring. The old Binance price-basis and fault fixtures were updated to the new exchange-aware boundary, without relaxing the safety assertions. Six additional offline MEXC/Gate fault and simulation/accounting suites: **153 passed, 0 failed, 0 skipped**. Web and admin Vite builds passed; both changed API bundles passed. `git diff --check` passed. Full TypeScript baseline/candidate: 52→52 diagnostics, zero new; affected API: 35→30, zero new. `tsc` itself remains red on pre-existing project diagnostics. PostgreSQL clone/concurrency checks were **not rerun** for this change because no schema/SQL file changed; earlier results are historical only. Legacy credential-loading tests were not run.

## 10. STATIC AUDIT

Repository-wide searches covered `BINANCE_FAPI`, both `/fapi/v1` Kline endpoints, `data-api.binance.vision`, `fetchKlineExtremes`, `spotPairFor`, `futuresPairFor`, `MEXC_CONTRACT`, MEXC Kline/ticker and `trend: 1`. Caller/source matrix:

| Caller | Exchange | Purpose | Source after correction | Audit |
| --- | --- | --- | --- | --- |
| `syncRealMexcTrades` | MEXC Real | SL and TP observation | MEXC native Latest Kline | Corrected |
| `syncRealBinanceTrades` | Binance Real | SL / TP observation | Binance Futures Contract / Mark | Corrected |
| Pro manual, batch and automatic analysis | MEXC Real | Entry analysis | MEXC native Kline, server-verified | Corrected |
| Real pending trigger | MEXC / Binance | Trigger detection | MEXC Latest / Binance Contract | Corrected |
| Real entry and min-margin preflight | MEXC / Binance | Live price and R:R | MEXC `lastPrice` / Binance Contract ticker | Corrected |
| Position Re-Analyze | Binance Real only | Protection proposal | Binance Contract candles | Preserved; no MEXC expansion |
| `syncRealGateTrades`, Hyperliquid observer | Gate / Hyperliquid | Legacy observer | Explicit Binance Spot | Preserved, **not** native parity claim |
| Demo, Spot, Shadow/experimental paths | Non-Real-MEXC | Existing behavior | Existing feeds | Unchanged |

The remaining `data-api.binance.vision` references in unrelated Spot/Demo/Shadow and legacy Gate/Hyperliquid paths are not claimed to be native Futures feeds. The Real MEXC call graph reviewed here has no Binance/Spot market-data fallback.

## 11. NEW EXECUTABLE SHA

New isolated executable commit: `d58dba78184d80818fc1580890a1c85bf2eb7724` on `codex/futures-correctness-2026-09-22`. Previous tested executable: `428c2c3bfb4edbf09cf1423f5aa408684341d65f`. A later documentation-only `[skip ci]` commit `9f088fe` is **not** the executable SHA. Production reference remained `3d738da8d32ee61e552646c3d2db14715c1ca6ea`; no active-runtime update is claimed.

## 12. REMAINING LIVE-ONLY GATES

Public GET and offline fixtures cannot verify private MEXC plan-order `trend` readback, real Binance/MEXC protection replacement or reconciliation, exact fee/funding/PnL accounting after a naturally closed trade, runtime reachability, or profitability. The prior candidate's separate PostgreSQL migrations and owner-approved backup/restore/deployment audit remain pending. No order was manufactured to obtain a live sample.

## 13. RELEASE STATUS

**BLOCKED — AWAITING RELEASE AUDIT.** Invariants: `REAL_BINANCE SL=CONTRACT, TP=MARK`; `REAL_MEXC SL=LATEST_NATIVE_MEXC_FUTURES_PRICE, TP=LATEST_NATIVE_MEXC_FUTURES_PRICE`; `REAL_MEXC_MARKET_DATA_MUST_NEVER_CALL_BINANCE=TRUE`; `REAL_FUTURES_MUST_NEVER_SILENTLY_FALLBACK_TO_SPOT=TRUE` for the corrected Binance/MEXC routes. No merge, Production push, Production migration, deployment, Real order, Spot/Demo/Shadow code change, or account-setting change occurred. This candidate is **not** ready to deploy without a separate release audit and owner authorization.
