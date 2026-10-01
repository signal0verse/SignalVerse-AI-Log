# Futures Profit Protection / Fast Exit — audit, architecture and implementation plan

## Metadata and executive result

- Date: 2026-10-01; final source checkpoint: 2026-10-01T05:37:28Z.
- Repository: SignalVerse-Main; inspected branch: `codex/prediction-coverage-expansion-audit`.
- Inspected source HEAD: `0dbca62357a4adf34240f40ceda3e387356ec4b0`.
- Mode: AUDIT + DESIGN ONLY. No implementation, test orders, live account access or Production action.
- Latest handoff records runtime `6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d`; this audit did NOT independently inspect the live runtime. The `api/copytrade.ts` Git blob is identical at inspected HEAD, that recorded runtime, and `b211db170dc3e35fd2965cdb74e496df5998d19a`: `0e9b76787b7f3b1579c37be6d0daac0b5e0b21b7`.
- Application source changes: NONE. Report and handoff documentation only; pre-existing dirty/untracked work preserved. No application commit/push.

**Confirmed:** ordinary Real Futures synchronization records running MFE/MAE, but does not wire the existing Smart Exit evaluators into profit-activation/giveback closes. It can therefore observe a favorable excursion without acting on its subsequent reversal, until an existing SL/TP or other existing close condition occurs.

**Recommended:** a deterministic, shared position-management policy with a durable original-risk/peak/armed state and full-position close intent. Keep the original native SL and ONE TP in place until the exchange position is independently confirmed flat. No Algo cancel/recreate trailing loop, partial TP, new entry strategy, AI dependency, or scanner-driven close.

**Not established:** the exact PHA incident cause, actual live latency, live MEXC API compatibility, profitability, or an optimal parameter set. No position identity, venue, side, execution timestamps, peak timestamps or order records for that incident were supplied. An entry price around 0.07663 alone cannot prove a trade-specific call sequence.

**Disposition:** audit/design complete; implementation and rollout NOT approved by this task. `IMPROVEMENT PROVEN = NO`.

## Scope, actions and evidence quality

Read project instructions, current handoffs, the complete trading strategy and dated amendments, the safe test runbook, relevant source paths, selected test implementations and existing Smart Exit research. Cross-checked exchange capabilities against official documentation. No SSH, private exchange call, database access, API sync invocation, historical replay execution, build, service operation or migration was performed.

Evidence levels used below:

- **SOURCE-CONFIRMED:** reachable behavior in the inspected source, with function/line references.
- **HISTORICAL RECORD:** a previously recorded run/report, not repeated or independently live-verified today.
- **DOCUMENTED CAPABILITY:** official API specification, not proof that an account/runtime supports it.
- **PROPOSED:** future implementation contract; not an existing capability or permission to implement.
- **UNVERIFIED:** required evidence is absent.

Source references are relative to the inspected repository and its pinned HEAD; line numbers are audit anchors, not claims about future revisions. Reports are sanitized: no credentials, account identities, position dumps or private order IDs.

## 1. Current open-position architecture

`api/_shared/futures-decision-engine.ts` is the central exchange-agnostic decision engine. Its output includes direction, momentum votes, ATR/structure context and regime compatibility. `api/_shared/futures-risk.ts` supplies normalized risk handling. Neither should become an exchange order manager.

The inspected position paths are:

```text
Discovery / Personal List
  -> central Futures Decision Engine -> Risk -> existing execution gates
  -> exchange entry + native protection -> persisted position

cron-sync-all OR authenticated mode=real/action=sync
  -> syncRealMexcTrades / syncRealGateTrades / syncRealBinanceTrades
  -> actual position lookup -> protection/reconciliation + native market window
  -> MFE/MAE accumulation -> SL/ONE-TP observation -> existing close path
```

Call-site anchors: `api/copytrade.ts:14824` (`handleCronSyncAll`), `14864–14916` (Real exchange dispatch), `15912` (cron handler), `18427–18446` (authenticated Real sync). The API sync path is NOT a read-only health probe: it can update records and execute closes. It was not invoked.

One Decision Engine remains authoritative for entry. The proposed policy manages only an already-open, previously profitable position. Candidate retirement, discovery quality and Personal List state are not exit inputs.

## 2. Current SL/ONE-TP lifecycle

`RealTradeAction` and `decideRealTradeAction` (`api/copytrade.ts:2340–2349`) choose SL or TP from the observed price window. Binance has a distinct price-basis observer at `2421`: SL uses contract price, TP uses mark price. Existing native orders can close independently of polling; synchronization subsequently accounts/reconciles the vanished position.

`tp1` and status `TP1_HIT` are legacy field names. They do not authorize a new multi-TP design. The proposed layer leaves the original Entry, SL and single full-position TP unchanged.

If both SL and TP are represented in one aggregate historical window, the existing evaluator prioritizes SL. That is a conservative tie rule, NOT proof of actual intrabar ordering. It cannot establish which event happened first in the PHA incident.

Protection cleanup currently uses broad per-symbol helpers. A new fast-exit path must not assume that every conditional order on the account/symbol belongs to its position epoch. Ownership, flat confirmation and pending cleanup must be explicit before reuse.

## 3. Current Binance Algo implementation

Source anchors in `api/copytrade.ts`:

- `8509–8522`, `buildBinanceProtectionParams`: `/fapi/v1/algoOrder`, `CONDITIONAL`, `STOP_MARKET` / `TAKE_PROFIT_MARKET`, `closePosition=true`, `GTE_GTC`, `priceProtect=true`; SL `CONTRACT_PRICE`, TP `MARK_PRICE`.
- `8525–8532`, `placeBinanceProtectionOrder`: deterministic `clientAlgoId`; actual Algo identity is retained.
- `8551`, `ensureBinanceProtectionLeg`: query/adopt/ensure actual protection; unknown state is not an invitation to duplicate an order.
- `8793–8798`, `closeBinanceTrade`: opposite-side MARKET, actual quantity, `reduceOnly=true`, then strict fill resolution. This close request currently does not add a durable `newClientOrderId`.
- `9016–9030`, `applyRealBinanceAction`: read position, close, independently re-read position at `9021–9022`, and only after flat confirmation cancel native protection at `9023`.
- `8475`, `cancelBinanceTriggerOrders`: queries matching Algo types for the symbol and catches individual cancellation failures. It is not an ownership-scoped, confirmed-cleanup journal.

The existing flat-before-cleanup ordering is the safest existing building block. It still needs shared exit ownership, durable close identity, UNKNOWN/PARTIAL recovery and explicit cleanup status before being exposed to an additional concurrent trigger.

Official Binance documentation separates ordinary orders and Algo conditional orders. Ordinary order modification is not a basis for claiming that a live Algo STOP/TP can be continuously edited. MARKET reduce-only parameters and position-side restrictions also differ by account mode; the inspected adapter is oriented to its current one-way path. No hedge-mode support is inferred. [Binance USD-M trade API](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade).

**Design constraint:** no SL/TP repricing, trailing Algo, or cancel/create cycle. Send a safe full-position close through the existing adapter contract, keep protection while any residual/unknown position remains, then reconcile flat and owned orphan orders.

## 4. Current MEXC implementation

Source anchors: `api/copytrade.ts:311`, `325`, `429`, `506`, `608–662`, `2467–2585`.

The inspected adapter uses `https://contract.mexc.com` and `/api/v1/private/order/submit`. `closeMexcTrade` (`637`) uses close-side LONG=4 / SHORT=2, type=5, contract volume, `openType=1`, optional position ID and strict full-fill polling. It currently sends neither close-specific `externalOid` nor explicit `reduceOnly` / `positionMode`. Do not assume this request provides universal reduce-only safety across modes.

`applyRealMexcAction` obtains position size before the close, awaits a full order fill, cancels remaining stop orders, then composes accounting. It does **not** independently fetch actual position-flat state after the close in that function. Full fill is useful evidence but not sufficient protection against another actor changing/reopening exposure. `cancelMexcStopOrders` is a broad symbol cancellation helper with absorbed errors. Protection includes existing expiry/backoff behavior; it must not be removed by this design.

Official current documentation advertises a different base (`api.mexc.com`) and a current create endpoint. This is a **compatibility discrepancy**, not proof that the legacy endpoint currently fails. No private compatibility request was made. [MEXC integration guide](https://www.mexc.com/api-docs/futures/integration-guide), [MEXC update log](https://www.mexc.com/api-docs/futures/update-log).

The current documented `/api/v1/private/order/create` supports market type=5, the close-side values above, position identity, external order identity, and position-mode-dependent reduce-only. Its documented order response carries an order ID and timestamp; its published rate is 4 requests/2 seconds. These are not silently substituted into the existing adapter in this audit. A future implementation must establish one exact supported native contract, account mode and response shape before enabling MEXC fast closes. Old “under maintenance” wording in legacy documentation is not current capability proof. [Official MEXC place-order specification](https://www.mexc.co/api-docs/futures/account-and-trading-endpoints/place-order).

## 5. Current Gate implementation

Source anchors: `api/copytrade.ts:7641`, `7660`, `7743–7762`, `7792`, `7824–7953`; `api/_shared/gate-futures-observer.ts`.

`closeGateTrade` sends full signed contract quantity, MARKET-style `price=0`, `tif=ioc`, `reduce_only=true`; strict `gateAwaitFill` checks contract, size, execution and remaining quantity. Terminal partial fill is not counted as full success. `applyRealGateAction` currently cancels protection after a full fill but does **not** independently re-read position-flat state at that point. That is an additional prerequisite for a new concurrent exit source.

The current Gate observer at `7935` already uses native Futures data; the old Spot observer defect is not the current source path. It observes intrabar native 1m windows and preserves MFE/MAE. It does not implement armed profit giveback exits. Cancellation currently enumerates the symbol’s active trigger orders, rather than proving every order belongs to this position.

Official Gate documentation distinguishes signed-quantity reduce-only closes, one-way close-all, and hedge-side auto-size close semantics. IOC completion alone need not mean the position is flat. Current quantity contracts also require attention to decimal/string precision; an older integer-oriented API example is not a universal precision contract. Keep the exact currently supported adapter mode; do not introduce account-wide close-all. [Gate REST reference](https://www.gate.com/docs/developers/apiv4/en/), [Gate order endpoint reference](https://www.gate.com/docs/apiv4/index.html).

## 6. Current position monitoring

The existing Real observers already own the relevant position-management responsibility. They share native price fetching, protection and accounting functions, but run as synchronization handlers rather than as a demonstrated always-on fast market worker.

`getFuturesMarketWindow` (`api/copytrade.ts:2350–2419`) returns aggregate high/low/close. The Gate native observer similarly returns a window. Neither result is an ordered bid/ask event stream with a durable peak timestamp. High/low alone cannot reconstruct whether the peak preceded a reversal within the window, nor prove an executable full-size exit price.

A future layer needs timestamped, venue-native executable quotes, side/position identity and freshness. It must NOT apply “fully closed entry candle only” to every live exit observation: a current, timestamped forming-bar movement can legitimately trigger risk management. The prohibition is look-ahead in historical evaluation, not reacting to a live price.

## 7. Current reconciliation

Binance resolves Algo executions into their actual order identity (`8822`), aggregates real close fills (`8845`), reconciles close accounting (`8957`) and handles vanished positions (`9001`). Funding/economics readiness has separate known/pending states (`9041`, `9074`, `9137`). Near-SL/TP price classification is not a reliable new exit-intent identifier.

MEXC and Gate use native position/history plus normalized economics; latest-per-symbol history is not sufficient by itself to uniquely attribute a new close to a trade epoch when other actors trade that contract. Strengthen future close correlation without altering historical rows or pretending estimated accounting is confirmed.

`migrations/futures_execution_attempts.sql` is a durable **entry** attempt contract. PREPARED/SUBMITTED/UNKNOWN are holds, not expiring leases. It is not a ready-made exit journal. A distinct exit-intent contract must coordinate with those holds and preserve terminal accounting immutability (`migrations/immutable_ledger_triggers.sql`).

Safety completion has separate milestones: actual flat, owned protection cleanup, and verified accounting. A position can be flat while cleanup/accounting is still pending; do not turn those pending states into another close request or a fake finalized PnL.

## 8. Current event / WebSocket paths

No wired Binance/MEXC/Gate market-plus-private position stream for this Real exit path was found in the inspected source. `supportsWebSocket` in the capabilities declarations (`8032`, `8077`, `8131`, `10317`) is currently metadata, not an active subscription implementation. `server/whale-trading/hyperliquid-provider.mjs` concerns a different venue/lifecycle; admin-console WebSocket is dashboard infrastructure, not a Futures execution feed.

Binance documents private order/account/Algo events. Account updates are event-triggered, not a per-price-tick PnL feed. The current stream documentation specifies the private stream base, listen-key renewal and connection lifetime; a future worker must implement reconnect/snapshot repair and include public contract-price/book data rather than depend only on account updates. Algo FINISHED is not proof that its position is flat. [Binance user-data streams](https://developers.binance.com/en/docs/products/derivatives-trading-usds-futures/user-data-streams).

MEXC documents personal order and position streams. Availability, login permissions and compatibility for this runtime/account remain untested. [MEXC order stream](https://www.mexc.com/api-docs/futures/websocket-api/order), [MEXC position stream](https://www.mexc.com/api-docs/futures/websocket-api/position).

Gate documents public Futures market streams and authenticated order/position/user-trade channels. This is a feasible adapter input, not an already-running SignalVerse monitor. [Gate Futures WebSocket API](https://www.gate.com/docs/developers/futures/ws/).

## 9. Current polling, cadence and latency

`src/app/App.tsx:16053–16063` sends Demo/Real synchronization immediately and at a nominal 20,000ms interval when a session and browser sync are enabled. Browser presence, background throttling and overlapping requests prevent calling this an autonomous 20-second Production SLA.

The existing VPS fast-jobs timer is recorded as every five minutes in `reports/futures/futures-auto-scanner-continuous-2026-09-30.md`. Current live timer/runner state was NOT inspected today. `handleCronSyncAll` also processes serial work and can invoke slow protection/reanalysis; network or job time adds to nominal detection delay. The Auto Scanner’s separate `futures-discovery-cron-tick` concerns candidates, not position profit management.

Actual market-move → detection → close-submit → fill → flat latency is **UNVERIFIED**. Neither source intervals nor a healthy service prove this distribution. A nominal five-minute path can wait almost an interval before observing a change, plus processing time; it supplies no proven hard upper bound.

Proposed cadence: event-driven public market monitoring, private order/position events, bounded periodic native position repair, and rate-budgeted fallback polling on stream loss. Do NOT speed up the whole mixed `cron-sync-all` handler or reuse the discovery timer as the emergency loop. Polling interval remains an unselected engineering parameter, requiring account/symbol load measurements.

Gate publishes distinct public/private/order endpoint budgets and response headers; MEXC order limits above and Binance order-count/IP budgets are not interchangeable. Reserve capacity for native protection, emergency closes and reconciliation; adapt to documented limits and live headers, not a universal per-position REST loop. [Gate current rate-limit overview](https://www.gate.com/docs/developers/apiv4/en/).

## 10. PHA profit → SL: what can and cannot be established

The entry price supplied is approximately 0.07663. No unique trade, exchange, direction, fill time, quantity, SL/TP, peak path, sync times or order statuses were supplied or found in the targeted existing handoff/Futures report inspection. No private trade rows were queried. **Exact incident root cause remains UNVERIFIED.**

The source explains a possible and concrete failure class: favorable excursions are persisted, but the standard Real observer only turns SL/TP observations into ordinary exit actions. Recording a peak does not create a giveback trigger. Native SL can then close after profit has been surrendered. Whether this was the precise PHA lifecycle requires the missing evidence below.

| Required incident question | Source-backed answer; incident limitation |
|---|---|
| 1. Was peak PnL tracked? | Standard Real has no demonstrated durable, timestamped executable net-PnL peak. Fast Trader Smart Exit state is a different scope. PHA state unknown. |
| 2. Was MFE tracked? | Real sync merges running MFE/MAE; whether/how often that particular trade was synchronized is unknown. |
| 3. Profit activation? | No Smart Exit activation call in the standard Real observers. V1 is Fast Trader Demo-specific; V2 is unwired research. |
| 4. Break-even/profit lock? | No wired standard Real profit-lock policy. Existing reanalysis is not a deterministic rapid giveback lock. |
| 5. Giveback detection? | Implemented only in scoped/experimental evaluators, not the standard Real close decision. |
| 6. Adverse reversal? | Entry engine exposes context; no wired Real armed-peak reversal exit found. Liquidation-risk checks serve another purpose. |
| 7. Immediate close capability? | Native market-close helpers exist, but capability is not a wired profit trigger or a latency guarantee. |
| 8. Reaction speed? | Nominal browser/cron intervals are known from source/records; actual PHA event-to-flat latency is not. |
| 9. Scanner involved? | No direct candidate/scanner → profit-exit call chain found. Same jobs runner does not imply a shared lifecycle. Incident scheduling unknown. |
| 10. Proper owner? | Existing Futures position monitoring/protection/reconciliation domain, with one shared deterministic policy and exchange execution adapters. |

To establish the incident: trade/position epoch and venue/mode/side, exact runtime identity, actual entry fills, original risk snapshot, native SL/TP IDs and executions, causal market quotes, synchronization/intent/submission timestamps, final position and fill/accounting evidence. Missing evidence is not replaced with reconstructed peaks or rounded candles.

## 11. Existing peak / MFE state

`computeRMultiple` (`1494`), `computeExcursionR` (`1513`) and `mergeRunningExcursion` (`1526`) exist. `migrations/engine_outcome_fields.sql` stores MFE/MAE. Real observers update these fields, including Gate `7937` and Binance `10248`.

Limits: MFE is derived from observed window extremes; it has no ordered peak event timestamp, executable depth, fee/funding basis or persistent armed state. The passed risk denominator uses the trade’s current `stop_loss`; an existing reanalysis can change it. It must not become the profit policy’s “original R” denominator. Missed observations cannot be backfilled with an assumed live peak.

Future policy needs a frozen entry-risk basis and causal price/net-value peak, stored separately. Retain current MFE reporting semantics unless a separately authorized accounting change is made.

## 12. Existing profit lock / break-even

Smart Exit V1 (`1910–2079`) supports break-even/fixed-lock/dynamic/adaptive behavior. `getSmartExitConfigForTrade` (`2049`) requires a Fast Trader session; its integration is in Demo sync (`2230–2334`), after the basic SL/TP evaluation. Some paths change a local stop or simulate a full close. This is NOT a standard Real full-close profit-protection implementation.

Do not copy local Demo stop adjustments into Binance Algo management. The proposed “profit lock” is a software decision to close the entire position, not a moved native stop, guaranteed price floor, or guarantee of positive realized PnL.

## 13. Existing giveback logic and prior research

Smart Exit V1 has giveback-style logic; Smart Exit V2 (`2081–2222`, evaluator `2154`) contains activation/retracement/ATR/stall rules but has no execution call in the inspected source. V2 comments and HANDOFF’s historical Smart Exit entry (`781–791`) identify research-only, disabled behavior.

Historical evidence inspected: `SignalVerse-Data/snapshots/smart-exit-position-intelligence-2026-09-03T15-06-22Z/HISTORICAL_COMPARISON.md` and `OPEN_RISKS.md`. That evaluation rejected blanket V2 activation: improvements were concentrated in Short combinations; most Long combinations worsened; some higher-timeframe gains depended on a few outliers. Nested one-/three-month samples were not independent holdouts. The research used Spot historical inputs and fixed costs, so it does not validate a new native-Futures live exit policy.

These are historical records, not new results. Existing arbitrary legacy defaults are NOT proposed parameters. V2’s emergency/stall paths and stop adjustment output do not satisfy this task’s “previously profitable, full-close only, unchanged native SL/TP” contract wholesale.

## 14. Existing emergency close

Binance sync has an existing liquidation-risk failsafe (`10140–10234`), including a close path at `10204` with subsequent flat checking. Depending on existing policy it can attempt Engine/Supervisor reanalysis first. This is not a profit-giveback emergency path and must not be redefined or disabled here.

Existing manual/SL/TP/native-close handling demonstrates market-close building blocks across venues. It does not establish durable exit idempotency for a new trigger. The proposed emergency profit exit is armed only after significant positive excursion and requires no AI, scanner or fresh entry decision.

## 15. Recommended additive architecture

```text
Existing entry Decision Engine / Risk / native SL + ONE TP — unchanged
                         |
               actual open-position epoch
                         |
     native public quotes + private order/position events
                         |
       persisted peak / original-risk / freshness state
                         |
        ONE pure deterministic position-exit policy
                         |
              durable FULL_CLOSE intent
                         |
     existing exchange close adapter, safely coordinated
                         |
  independent FLAT confirmation -> owned-order cleanup -> accounting
```

Reuse existing adapter, native-protection and reconciliation primitives; extend their contracts only where required. A small continuously running Futures position worker is justified because no suitable wired three-venue fast watcher was found. This is not a second scanner/strategy. Exact service reuse versus a dedicated worker must be confirmed in a later authorized runtime inventory; no service is created now.

Keep expensive discovery, AI/reanalysis and funding-history retrieval off the market-event critical path. Serialize their position-affecting actions with the same durable ownership contract. A browser request, cron task, native order execution, manual close and fast worker may all observe the same position; only one close intent may own unresolved execution.

Outputs: `HOLD`, `CLOSE_FULL`, or `DATA_UNKNOWN`, plus policy version, timestamped evidence and reason. No target, stop-price, entry, leverage, partial allocation or order-placement strategy output.

## 16. Exact proposed deterministic logic

All identities and quantities below refer to one linear-USDT position epoch. Contract quantities must be converted to underlying exposure with the existing validated contract multiplier; never treat contracts and coins as interchangeable.

```text
s = +1 for Long, -1 for Short
E = actual average entry fill price
S0 = original accepted stop at entry; immutable risk snapshot
q0 = original underlying exposure; d0 = abs(E - S0) > 0
R0 = q0 * d0                       # USDT original price-risk basis
ATR0 > 0 = causally available native ATR at entry, with timeframe/provenance

P(t) = fresh executable side price: bid for Long, ask for Short
N(t) = s*q0*(P(t)-E) - entryFees - expectedExitFees
       + signedAccruedFunding - additionalExecutionImpact
```

The first version applies only while actual side/quantity remain consistent with this epoch. External quantity changes require reconciliation/rebasing under a separately defined contract, not silent rescaling. Leverage is not another multiplier on underlying PnL/R; margin percentages may be displayed but are not comparable normalized risk.

Use actual fees/funding when known and explicit conservative intervals when estimable. Price already adjusted for impact must not subtract that same slippage again. Require full-size depth/impact bounds, not a tiny best bid/ask as guaranteed full-size liquidity.

```text
[Nlo(t), Nhi(t)] = comparable, timestamped conservative net-PnL interval
Hlo(t) = max(previous Hlo, Nlo(t))   # causal lower-bound peak, persisted
Pstar = causal most-favorable observed executable-side price
Dlo(t) = max(0, Hlo(t) - Nhi(t))     # conservative proven giveback
GR(t) = Dlo(t)/R0
GF(t) = Dlo(t)/Hlo(t), only when Hlo(t)>0
A(t) = max(0, s*(Pstar-P(t))/ATRref)
V(t) = max(0, s*(P(t-h)-P(t))/(ATRref*h))
```

`ATRref` initially means frozen `ATR0`; a later causal, closed-candle volatility refresh is a separately validated policy version, not an unbounded live denominator change. `h` uses a monotonic observation interval; unavailable ordered observations cannot supply velocity. Cost-basis revisions must preserve/recompute comparable peak bounds from recorded components or mark the comparison UNKNOWN; do not compare a cheap historical gross peak with an expensive current net value.

```text
ARM if Hlo/R0 >= alphaR
       AND Hlo/(q0*ATR0) >= alphaATR
       AND Hlo exceeds documented cost/quote uncertainty

normalBudget = max(betaR*R0, betaATR*q0*ATRref,
                   betaFraction*Hlo, noiseAndCostBound)
normalReversal = A>=gammaA OR V>=gammaV
NORMAL_CLOSE if ARMED AND Dlo>=normalBudget AND normalReversal
                AND condition persists for confirmation duration

emergencyBudget = max(emergencyR*R0, emergencyATR*q0*ATRref,
                      emergencyFraction*Hlo, noiseAndCostBound)
EMERGENCY_CLOSE if ARMED AND Dlo>=emergencyBudget
                   AND (A>=emergencyA OR V>=emergencyV)
                   # no normal debounce, still freshness/identity checks

otherwise HOLD; missing mandatory identity/price/risk evidence => DATA_UNKNOWN
```

Emergency thresholds must represent a stronger reversal than the normal branch and be preregistered as one configuration. Arming is latched within the epoch; it does not disappear just because current profit declined. Do not require current PnL to remain positive after a gap: this could suppress the needed exit. Zero/invalid ATR/R, stale quotes, out-of-order events or unbounded costs cannot be interpreted as zero risk/cost. A finite conservative cost bound may permit evaluation; otherwise profit-specific logic reports UNKNOWN, leaves native protection intact and alerts. Existing independent liquidation safety remains unchanged.

Evaluation, peak update, arming and close-intent acquisition must be atomic/CAS-ordered. Record inputs and policy version so replay yields exactly the same verdict. Structural/momentum context may be logged or tested in a preregistered ablation; it is not a mandatory new Engine/AI round trip in the fast trigger.

This is an exact **parameterized proposal**, not a calibrated production policy. No values are selected and no numerical effectiveness is claimed.

## 17. Parameterization proposal

| Group | Parameters / source | Selection rule |
|---|---|---|
| Identity/risk | Actual entry, original SL, quantity/multiplier, entry timeframe and ATR provenance | Freeze per epoch; reject missing/invalid snapshots. |
| Activation | `alphaR`, `alphaATR`, uncertainty bound | Calibrate on training only; prevents fee/noise activation immediately after entry. |
| Normal giveback | R/ATR/fraction budgets; adverse distance/velocity; confirmation duration | One versioned configuration; no symbol-specific PHA rule. |
| Emergency | Stronger normalized giveback/reversal budgets | Separate strong condition, not a universal fixed percentage or AI opinion. |
| Data quality | Quote age, clock skew, spread/depth bounds, observation continuity | Engineering acceptance from measured native feeds and cost uncertainty. |
| Runtime | Fallback interval, repair interval, concurrency and per-venue reserves | Load/rate-budget validation, not profitability tuning. |

Existing engine ATR, timeframe, regime and risk information is sufficient to start a normalized research design. Presence of those features is not proof of a useful parameter value. Start with a small transparent parameter family; preregister Long/Short and timeframe analysis. Add regime-dependent parameters only if independent evidence justifies complexity.

## 18. Race conditions and durable state

```text
DISARMED -> ARMED -> EXIT_PREPARED -> EXIT_SUBMITTED
                                   -> UNKNOWN / PARTIAL
                                   -> FLAT_CONFIRMED
                                   -> CLEANUP_PENDING -> RECONCILED
```

- **Duplicate signals / concurrent browser, cron, worker:** durable unique unresolved intent and fenced account+contract+side+epoch ownership. Peak CAS monotonicity. In-memory mutex alone is insufficient across processes.
- **TP/SL fills concurrently:** re-read position before submission; reduce-only / verified native close-side semantics; reconcile native order events. If already flat, do not submit. If a request races after the snapshot, rejection is reconciled, not retried as an opening order.
- **Manual close/reopen or quantity/side change:** reject epoch mismatch. Same symbol and quantity are not proof of the same position. Position lifecycle/order evidence must exclude ABA reopen; uncertainty blocks automated close.
- **Timeout after POST:** persist intent/client identity before submission; state UNKNOWN, no expiry-based retry. Resolve order and position through native queries/events. Client-ID uniqueness among open orders alone is not lifetime exactly-once proof.
- **Partial fill:** keep native protection; resolve whether the old IOC/market order is terminal. Only after proving no in-flight remainder may a linked child intent close the confirmed residual. Full-close intent is not partial TP.
- **Fill but position not flat:** no terminal CLOSED flag, no protection cancellation; reconcile other fills/actors and residual. Gate/MEXC need an explicit post-close actual-position check in the future path.
- **Flat but orphan protection:** cancel only owned IDs after verifying epoch/scope; query to confirm absence. Cancellation errors leave CLEANUP_PENDING, retain identities/evidence and block unsafe same-symbol re-entry.
- **Restart/crash:** restore durable ARMED/peak and unresolved intents; do not recompute armed state from post-hoc MFE. Recover submitted requests before accepting another close owner.
- **Native/order/position events reordered:** monotonic sequence/time checks, duplicate suppression and snapshot repair. A FINISHED order or missing event alone is not flat proof.
- **Accounting delayed:** actual-flat safety can finish while fees/funding attribution remains pending; never invent zero funding, fill price or exit cause to finalize.

The account-side lock must coordinate admission, close, protection/reanalysis mutation and reconciliation ownership. No lock is held while waiting indefinitely on AI; no new close is accepted when earlier entry/exit state remains uncertain. Document fencing/CAS failure behavior before implementation.

## 19. Exchange-specific requirements before implementation acceptance

| Requirement | Binance | MEXC | Gate |
|---|---|---|---|
| Current full-close primitive | MARKET + quantity + reduceOnly | Close-side/type=5 + actual volume/position ID | Signed full quantity + price=0/IOC/reduce_only |
| Current native protection | Algo closePosition SL/TP | Native stop/profit orders | Native Futures price orders |
| Full-close identity gap | Durable new close client ID needed | Durable external identity and supported mode/API contract needed | Native text/identity correlation and quantity precision contract needed |
| Flat-after-close | Already checked in Binance action path | Add independent position verification for new path | Add independent position verification for new path |
| Cleanup | Scope existing broad helper to owned epoch; confirm absence | Same; do not treat cancel-all acknowledgement as completion | Same; swallowed DELETE failures remain pending |
| Mode | Current one-way integration; do not presume hedge compatibility | Verify actual positionMode/openType and close semantics | Verify one-way versus dual position path |
| Rate/event readiness | Account/IP order budgets + reconnectable public/private feeds | Current/legacy compatibility + published order limit + streams | Current decimal precision, UID/IP limits + streams |

These are prerequisite gaps, not code changes performed now. Do not silently switch MEXC endpoints, enable hedge mode, or use account-wide close-all. If a venue cannot guarantee non-opening close semantics plus identity/flat verification, keep its new layer disabled while preserving existing native protection.

## 20. Demo / Real / Simulator parity

One pure function and versioned state transition must consume equivalent normalized evidence in all three modes. Engine Entry/SL/ONE-TP remains shared and unchanged. Execution adapters differ, policy verdicts do not.

- **Demo:** synthetic fills through the existing isolated accounting path; realistic delayed/partial/unknown adapter fixtures, no exchange calls. Do not equate this with verified private execution.
- **Simulator:** causal event replay; same armed/peak/cost state. Current `stepPosition` (`12723`, fixed-stop comment `12755`) does not supply this policy. Four-hour stepping cannot validate a fast intrabar reaction. Post-hoc 1h MFE (`13340–13353`) is analytics, not an available historical exit input.
- **Real:** timestamped native market and private position evidence, durable execution ownership, native full-close and independent flat/reconciliation checks.

Identical normalized event tapes must produce identical policy verdicts. Exact price/PnL equality across modes is not assumed where native fills, fees, depth or funding differ. Missing cost/path coverage remains UNKNOWN rather than a fabricated parity PASS.

Do not auto-arm existing Real positions from their historical MFE. Any later controlled enrollment needs explicit owner authorization and a complete causal state/epoch snapshot; initial rollout should be opt-in for newly opened eligible positions.

## 21. Testing plan and inspected coverage

No application tests or builds were executed in this audit. Existing test files were inspected for relevant behavior; not every assertion in every legacy test was certified. In particular, some Smart Exit scripts read local environment files with Production database credentials. They were intentionally not run or used as evidence of a safe new test suite.

Inspected relevant suites include Gate/MEXC fault and Gate native observer tests; relevant portions/setup/cases of Real execution fault, simulation chronology, economics contract and Smart Exit test/research scripts. Existing adapter mocks cover malformed positions, fill checks and errors; they do not prove live flat-after-close, stream latency or a new durable profit-exit journal.

Required isolated/offline cases for future implementation:

| Case | Required assertion |
|---|---|
| A. Normal TP | Existing ONE TP unchanged; no premature close on an unreversed trend. |
| B. SL without meaningful profit | Profit policy never arms; original SL behavior preserved. |
| C. Profit then reversal | Causal peak/activation/giveback; one full-close intent with auditable reason. |
| D. Large MFE then moderate giveback | Threshold boundary tests; harmless pullback retained, sufficient reversal closes. |
| E. Very fast reversal | Armed emergency path bypasses normal debounce, not identity/freshness or reconciliation. |
| F. Low-volatility noise | Costs/spread/uncertainty prevent spurious activation/exits. |
| G. High volatility | R/ATR normalization, depth/slippage uncertainty, gap behavior. |
| H. Long | Bid-side executable valuation and adverse-price direction correct. |
| I. Short | Ask-side valuation and inverse direction correct; no asymmetric accidental rule. |
| J. Concurrent native/manual close | Flat before submit; TP/close race; no reversal/reopen; owned cleanup only. |
| K. API delay | Delayed, dropped, accepted-but-timeout and partial fills; persistent UNKNOWN, no blind resubmit. |
| L. Duplicate signal | Browser/cron/worker races and restart yield one owned unresolved intent. |

Also require crash injection at each state boundary; stale/malformed/out-of-order prices; clock drift; quantity multiplier/decimal precision; original-R immutability; zero R/ATR; funding unknown; cost-basis revision; stream reconnect/missing-event repair; lock fencing failure; orphan cancellation failure; position ABA reopening; same-SHA policy replay determinism; and mode-parity property tests.

Regression allowlist must preserve existing Real gates, native protections, entry durable holds, shared Decision Engine, Gate native observer, futures economics, simulation chronology/accounting and Fast Trader behavior. Compile/build only after authorized implementation, with mocks preventing credential/network/Production writes. No claim that existing historical test counts validate this proposed feature.

## 22. Native historical / backtest / comparative plan

1. Freeze baseline source and proposed policy/config identities before replay. Pair the same actual entry/SL/TP/quantity trajectory inputs; do not optimize entry or size at the same time.
2. Collect native Futures timestamped trade/book/mark events and order/funding/cost evidence where available, including PHA only if its real lifecycle is identifiable. Reuse existing persisted evidence first; no account-data publication.
3. When only OHLC exists, mark unknown peak/reversal/SL/TP ordering as AMBIGUOUS, or publish preregistered conservative bounds. Do not let a candle’s final high arm an earlier event. Such data cannot validate sub-second/few-second live behavior.
4. Model detection delay, spread, executable size/depth, fill delay/partial/rejection, fee tier and funding at causal times. Native protection remains active during simulated close delay. Unsupported cost coverage is explicitly excluded/UNKNOWN.
5. Train a small parameter family; freeze it before temporally separated validation and untouched test. Nested one-/three-month windows are not independent. Group/bootstrap by trade episode and time blocks; avoid counting correlated symbols/events as independent trades.
6. Stratify Long/Short, timeframe, liquidity and volatility/regime; evaluate untouched symbols as well as time holdouts. No PHA-specific rule, cherry-picked subgroup or post-test parameter tuning.
7. Compare net return, max drawdown, win rate, SL/TP hit rates, average trade, profit factor, funding/fees/slippage, full-close count, realized peak capture, remaining giveback, premature-exit opportunity cost and UNKNOWN coverage. Show confidence intervals, tail outcomes and sample sizes, not a single average.
8. Repeat outlier sensitivity and parameter-neighborhood stability; then prospective shadow with native timestamps and no exchange writes. Shadow can establish verdict/latency/data coverage, not realized private fills/profitability.

Acceptance values and minimum independent samples must be approved/preregistered before evaluation. Require no safety regressions and robust held-out net/giveback evidence without unacceptable lost-winner cost. `IMPROVEMENT PROVEN` remains NO until that evidence exists. No new replay was run here.

## 23. False-exit risk

Normal pullbacks in a profitable trend can trigger an over-sensitive policy and destroy future winners. Existing V2 historical rejection is concrete reason not to assume giveback rules improve all Long/Short/timeframe combinations.

Other risks: spread widening mistaken for price reversal; stale or isolated quote spikes inflating peak; cost/funding revision changing the net basis; thin books; ATR denominator changes; very short velocity windows; overly broad regime exceptions; and using a final candle high before it existed.

Mitigations to test, not assurances: meaningful normalized activation, conservative comparable net bounds, valid full-size liquidity, monotonic peak updates, normal-path persistence/hysteresis, stronger emergency evidence, and independent holdouts with premature-exit cost. Do not add re-entry/chasing behavior to compensate for false exits.

## 24. Delayed-exit risk and measurable latency

Sources of delay: polling/browser absence, event disconnects, processing backlog, synchronous reanalysis, lock contention, rate limits, position snapshots, exchange acknowledgement/fills and market gaps. Even perfect detection cannot guarantee an execution price or retained profit.

Future telemetry must record native event time, receive time, evaluation time, durable intent time, submit time, acknowledgement, first/last fill, actual-flat confirmation and cleanup/accounting completion. Use monotonic elapsed timing locally and explicit clock-skew uncertainty across hosts.

Measure p50/p95/p99, worst observed delay, disconnections/gaps, queue age, stale-event drops, rate-limit errors, close reject/unknown/partial counts and residual exposure. Define stage-specific latency budgets after load measurement. Normal stream repair and fallback polling must reserve priority for urgent risk actions without bypassing safety checks.

Current latency is NOT measured and no “fast enough” Production claim is made. A profit-specific data outage must keep original native protection, preserve UNKNOWN execution holds and alert; it must not invent a profitable exit decision from stale PnL.

## 25. Proposed files/code paths requiring later authorized change

These paths are a plan, not files created or changed today:

| Proposed path / existing touchpoint | Purpose and boundary |
|---|---|
| New `api/_shared/futures-profit-protection.ts` | Pure normalized policy/state transitions only; not another entry engine. |
| New shared profit-protection state/exit-attempt module | Durable risk snapshot, peak, arming, CAS/fencing and unresolved close intent. |
| `api/copytrade.ts` Real observer/close/cleanup touchpoints | Reuse native adapters; coordinate every close actor; add missing flat/owned-cleanup guarantees for new path without redesigning entry/SL/TP. |
| New `server/futures-position-monitor/` module, if runtime inventory confirms need | Public/private event orchestration and bounded fallback; Futures-only, not scanner jobs. |
| Existing Demo sync and Simulator `stepPosition` integration | Same policy and causal event contract; no post-hoc MFE as live evidence. |
| Shared economics sources, only if a new read contract is needed | Expose timestamped estimates/bounds; preserve realized accounting semantics. |
| New isolated policy/journal/adapter/event/parity tests | Cases above; mock network and credentials. |
| Later additive persistence migration + documentation | Separate owner authorization and schema review required. |

Existing `FuturesPositionSnapshot` (`7996–8006`) lacks the full normalized account/mode/side/epoch/observed-time evidence required by the proposed policy. Any future extension must be adapter-specific and validated, not guessed from symbol alone. A UI switch/audit display is optional later; it must not be an unreviewed behavioral prerequisite.

## 26. Files and policies that must NOT change for this feature

- Central entry Decision Engine, strategy votes, original Entry/SL/ONE-TP calculation, risk/credit/reviewer/Real authorization and position sizing policies.
- Spot logic, Personal List semantics, discovery/V3/scanner candidate lifecycle and its existing timer/gates.
- Existing Fast Trader defaults/Smart Exit behavior; no implicit V2 enablement or replacement.
- GitHub workflows, Guard/control-plane, release-artifact generation and approvals.
- Existing migration/history content, credentials, exchange/account mode/leverage, and historic ledger/backfills.
- Native SL/TP repricing policy: no new cancellation/recreation or reanalysis-based trailing mechanism.

Future tests may assert these boundaries. Code changes today: ZERO, including all paths listed above.

## 27. Future persistence migration requirements

The existing MFE fields and Fast Trader `smart_exit_*` migration are insufficient for a robust standard Real state machine. An additive migration is proposed, NOT applied:

- One tenant/mode/account/contract/side/position-epoch scoped state record with immutable original fill/risk/ATR provenance, policy version, causal quote/cost-basis peak, arming and last processed event.
- One durable exit-attempt journal with unique unresolved ownership, pre-submit client identity, submission/UNKNOWN/PARTIAL/flat/cleanup states, linked residual attempts and exact evidence timestamps.
- Append-only audit events recording policy inputs/verdicts, native order correlations, cleanup and accounting readiness; RLS/ownership protections and constraints matching existing ledger rules.
- Transactions/CAS prevent backward peak/armed transitions and duplicate unresolved closes. Entry admission must respect unresolved exposure/cleanup without expiring uncertain holds.

No automatic historical state backfill, terminal-row rewriting, risk-denominator change or balance mutation. Existing economics contract remains authoritative. A feature-off default and separately reviewed enrollment policy are required. Persistence failure means no unjournaled close submission by this new policy; existing protection remains active.

## 28. Future scheduler / service requirements

No scheduler/service/configuration was changed. The five-minute Auto Scanner timer must remain exactly as it is.

If later inventory confirms no appropriate existing autonomous position watcher, add one Futures-only long-running worker under the established supervision model, with market event subscriptions and bounded repair/fallback. Reuse the existing execution/account security mechanism; no keys in client/UI/report, no parallel unmanaged order authority.

One market subscription per venue/symbol can serve multiple positions; private position/order state remains account-scoped. Do not multiply REST polls by every UI browser or candidate. Existing sync remains as reconciliation/repair under the same durable ownership. Rollout needs measured resource/rate budgets, heartbeat/queue/freshness telemetry and independent feature gating; native protection must not depend on worker availability.

No production enablement or runtime validation is authorized now. This design does not certify installed services or accounts.

## 29. Rollback and staged implementation plan

Safest future sequence, each requiring its own applicable authorization:

1. Approve pure policy and state contract; preregister comparative acceptance and parameter-selection plan.
2. Implement/test offline policy, durable journal and adapter safety using disposable fixtures. Resolve MEXC native contract and Gate/MEXC flat verification before eligibility.
3. Validate native causal replay, independent holdouts and outlier/false-exit sensitivity; retain a feature-off build if improvement is not demonstrated.
4. Prospective shadow with no orders; measure event/quote/cost/epoch coverage and latency. Then controlled Demo with the same policy.
5. Only after safety/effectiveness evidence and explicit owner release/enrollment approval, permit a limited new-position Real cohort with native protection intact. Never manufacture Real trades to satisfy a gate.

Rollback disables **new profit-exit decisions**, not native protection or reconciliation. Already submitted/UNKNOWN/PARTIAL intents retain a compatible reconciler until resolved; no TTL clearing, repeated close, schema drop or return to older code that ignores holds. Preserve policy/peak/intent/audit evidence. Do not restore data from a backup over legitimate trading history. Abort rollout on identity uncertainty, ownership failure, protection gap, replay/non-opening failure, unbounded queue, or unexplained venue state.

## Files inspected and publication record

Main project instructions and handoffs: `AGENTS.md`, `CLAUDE.md`, `HANDOFF.md`, `docs/AI_HANDOFF.md`, `TRADING_STRATEGY.md`, `docs/COLLEAGUE_HANDOFF_2026-09-29.md`, `docs/testing/stability-test-runbook.md`.

Relevant source inspected: `api/copytrade.ts` (targeted functions/callers), `api/_shared/futures-decision-engine.ts`, `api/_shared/futures-risk.ts`, `api/_shared/futures-market-data.ts`, `api/_shared/gate-futures-observer.ts`, `api/_shared/futures-economics.ts`, `api/_shared/futures-economics-sources.ts`, `src/app/App.tsx` (sync caller), `server/whale-trading/hyperliquid-provider.mjs`, `server/admin-console/server.mjs`, `server/admin-console/observer.mjs` (relevant event/runtime paths).

Persistence inspected: `migrations/engine_outcome_fields.sql`, `migrations/fast_trader_smart_exit.sql`, `migrations/futures_execution_attempts.sql`, `migrations/immutable_ledger_triggers.sql` (relevant contracts).

Test/research inspection: `scripts/futures-gate-mexc-fault-test.mjs`, `scripts/futures-gate-observer-native-test.mjs`, relevant setup/cases in `scripts/futures-real-execution-fault-test.mjs`, `scripts/futures-simulation-chronology-test.mjs`, `scripts/futures-economics-contract-test.mjs`, and Smart Exit test/historical scripts identified in section 21. Historical comparison/risk files in the 2026-09-03 Smart Exit snapshot and existing continuous-scanner report were read as records. This list is source inspection, not a claim of exhaustive test execution.

Files changed by this task: this report and a documentation-only HANDOFF entry. No application implementation commit. AI-Log report publication is separate documentation-only work required by project instructions; its actual commit/link and remote verification result are supplied with the final response, not invented inside this pre-publication report.

Tests/builds: NOT RUN. Report validation/secret review: performed separately before publication; no Production credentials or account data are used. Existing research/mocks are not converted into live acceptance.

```text
IMPLEMENTATION = NO
APPLICATION CODE CHANGED = NO
PRODUCTION ACTION = NO
DEPLOYMENT = NO
DATABASE CHANGE = NO
MIGRATION = NO
SETTINGS / GATES / SERVICES CHANGED = NO
EXCHANGE ACTIONS = 0
ORDERS = 0
POSITIONS CHANGED = 0
STRATEGY / ENTRY / SL / ONE TP CHANGED = NO
SPOT CHANGED = NO
AI REQUIRED FOR EXIT = NO (proposed design)
PHA EXACT INCIDENT CAUSE = UNVERIFIED
LIVE REACTION LATENCY = UNVERIFIED
PARAMETERS CALIBRATED = NO
IMPROVEMENT PROVEN = NO
```

Stop after this audit/design. No implementation or activation is implied by publication.
