# Gate observer final classification — read-only audit — 2026-09-25

## Metadata

- Date: 2026-09-25
- Task ID: gate-observer-final-classification-20260925
- Module: Futures / Gate existing-position observer
- Mode: READ-ONLY source audit; documentation-only local changes
- Repository: SignalVerse-Main
- Branch: codex/futures-completion-20260925
- Starting/audited candidate commit: fc5a730029e617ee807aae59c722b462501b54ee
- Ending local documentation commit: d92c53c69afb81945847159d595a03150f841947
- Application source delta between these commits: ZERO
- Publication repository/branch: signal0verse/SignalVerse-AI-Log / master
- Production runtime/deployment state: NOT ACCESSED, NOT VERIFIED

## Objective

Classify the remaining Spot-candle Gate observer by actual source and call graph. Separate its impact on existing-position exit/management from the central engine and native NEW-analysis path. Do not implement any fix.

## Scope

Only static source inspection and the requested classification documentation. No VPS, Production, exchange requests, database, account/credential access, workflow dispatch, application push/deploy or position/protection/order changes.

## Actions Taken

1. Preserved the dirty primary checkout and existing untracked temporary work. Used the already-isolated candidate checkout.
2. Read applicable repository instructions and strategy constraints; pinned inspection to fc5a730.
3. Enumerated direct callers with source searches and a static TypeScript AST; no application import or handler was executed.
4. Traced source lookup, hit decision, adapter callback, actual close, fill validation, protection cancellation and accounting.
5. Distinguished source-enabled routing and configuration conditions from unverified live runtime.
6. Added only classification evidence to the completion report and HANDOFF.
7. Committed only those two documentation files locally with skip-ci; no application remote push.
8. Prepared this separate sanitized report. Its remote commit/blob verification is reported in the task response after publication.

## Files Inspected

Primary source:

- api/copytrade.ts
- api/analyze.ts
- api/_shared/futures-market-data.ts
- src/app/App.tsx
- ops/signalverse-deploy (shared-runtime provenance lines only; never executed)

Instructions/context:

- AGENTS.md
- CLAUDE.md
- HANDOFF.md
- docs/AI_HANDOFF.md
- TRADING_STRATEGY.md
- reports/futures/futures-completion-audit-2026-09-25.md

Reporting-only:

- SignalVerse-AI-Log/README.md
- SignalVerse-AI-Log/templates/report-template.md
- SignalVerse-AI-Log/scripts/scan-secrets.mjs

## Files Changed

In the local application candidate branch, documentation only:

- reports/futures/futures-completion-audit-2026-09-25.md
- HANDOFF.md

In AI-Log:

- reports/futures/gate-observer-final-classification-2026-09-25.md (this report)

No application code was changed.

## Root Cause / Findings

CONFIRMED: the source contains a reachable Gate existing-position close path driven by Binance Spot highs/lows. The exact source evidence and scoped classification follow.

UNCONFIRMED: current Production invocation, runtime SHA, scheduler enabled state, actual Gate positions, and any realized economic impact. No runtime evidence was fetched in this task.

## Gate observer final classification — read-only source audit — 2026-09-25

### Executive result / evidence boundary

- **GATE-OBSERVER-ACTIVE-BLOCKER** for Gate **existing-position management / exit behavior**.
- Classification C is proven for the production-facing code path in exact candidate `fc5a730029e617ee807aae59c722b462501b54ee`. It is not dead, reporting-only, historical-only, or gated behind a Gate observer opt-in.
- Source collection completed at **2026-09-25T10:36:35Z**. No VPS, runtime, private account, credentials, database or exchange endpoint was accessed.
- **Current Production invocation, timer enabled state, deployed SHA and presence of live Gate positions: NOT VERIFIED in this task.** Source reachability is not presented as observed live activity.
- This is NOT a blocker to the correctness of the central new-entry decision function or the native Gate NEW-analysis input path. It IS a blocker to certifying/releasing the full Gate-enabled position-management lifecycle as corrected.
- No implementation or repair. Only this classification evidence and HANDOFF are added; previous tests/economics/other acceptance findings are unchanged.

### 1. Complete observer call graph at the audited SHA

```text
A. Background sync entry:
   external scheduler (current timer/job NOT VERIFIED; no tracked sync unit found)
   -> /api/copytrade?action=cron-sync-all
   -> handler [api/copytrade.ts:15115]
   -> handleCronSyncAll [14526]
      bearer-secret authentication [14531-14535]
      real_accounts.exchange='gate' [14598]
      copy_trades: owner + mode='real' + exchange='gate' + status='OPEN' [14601]
   -> syncRealGateTrades(openTrades, ..., cache) [14605]

B. Authenticated app/API entry:
   App.tsx useEffect: tick immediately and every 20,000ms while sessionToken exists
   -> POST /api/copytrade?mode=real&action=sync [src/app/App.tsx:15545]
   -> handler: verifySession [api/copytrade.ts:15121-15123]
      mode/access gates [16466-16475]
      POST action='sync' [17492]
      all owner's real_accounts + matching OPEN Real trades
   -> syncRealGateTrades(openTrades || [], ...) [17508]

Common live-position path:
   syncRealGateTrades [7849]
   -> getFuturesExchangeAdapter('gate') [7852; resolver10421]
   -> createGateFuturesAdapter [8169]
   -> getPosition -> getGateOpenPosition [8174 / 7591]
      validated native Gate position; malformed read throws (not assumed flat)
   -> ensureProtection using persisted t.stop_loss / t.tp1 [7867]
   -> spotPairFor(t.symbol) + sinceMs=last_synced_at||opened_at [7884-7885]
   -> cache or fetchKlineExtremes(..., 'spot') [7889]
      Binance SPOT /api/v3/klines, 1m [1751-1775]
   -> decideRealTradeAction(t, extremes.high, extremes.low) [7894; definition2325]
   -> adapter.reconcilePosition [7899]
   -> applyRealGateAction [8194 / 7832]
      re-read Gate position
   -> closeGateTrade [7837 / 7774]
   -> Gate POST /futures/usdt/orders:
      price=0, tif=ioc, reduce_only=true, signed current contract size
   -> gateAwaitFill: verify complete actual fill [7779; definition7610]
   -> cancelGateTriggerOrders [7838 / 7708]
      DELETE native price_orders after complete-close confirmation
   -> reconcileGateClosePnl [7842 / 7806]
   -> patch copy_trades, finalized outcome, resolveSignalLock,
      queuePostTradeAnalysis [7901-7903]
```

Exactly **two** direct production-source callers of syncRealGateTrades exist: handleCronSyncAll:14605 and handler:17508. Repository source search and static TypeScript AST traversal agree. None is test-only. The adapter callback, not its name, proves that reconcilePosition actually reaches a reduce-only close.

Alternative branches:

- Confirmed flat at the first position read goes to handleVanishedRealGatePosition:7817 before any Spot candle read: cancel residual triggers, reconcile exchange history, classify and persist closure.
- No candle result: no exit action from this observation; existing protection verification already ran.
- No SL/TP hit: update last_synced_at plus excursion data, no close.
- Position disappears between reads: applyRealGateAction uses the vanished-position branch.
- Unknown/partial close does not pass gateAwaitFill's complete-exit check; cancellation is after that check. This audit does not execute or newly certify exchange behavior.

### 2. All fetchKlineExtremes callers / other Gate lifecycle callers

Static call inventory from api/copytrade.ts:

| Caller | Line | Relationship to this issue |
|---|---:|---|
| syncDemoTrades |2223|Separate Demo consumer; not the Real Gate observer |
| syncRealHyperliquidTrades |2658|Separate venue, not audited/fixed here |
| syncSpotCycles |4399|Spot consumer, unchanged |
| syncSpotCyclesReal |5621|Spot consumer, unchanged |
| syncRealGateTrades |7889|The affected Gate existing-position observer |
| checkPendingSignals |10914|Conditional fallback; Real Gate instead selects getFuturesMarketWindow using exchange='gate', basis='latest' at10906 |

Other relevant Gate calls:

- createGateFuturesAdapter:8194 -> applyRealGateAction, :8195 -> handleVanishedRealGatePosition.
- applyRealGateAction:7834 -> vanished handler; :7837 -> closeGateTrade; :7838 -> cancelGateTriggerOrders.
- handleVanishedRealGatePosition:7818 -> cancelGateTriggerOrders.
- Manual close handler:17353 /17360 /17361 separately calls vanished/close/cancel helpers. It is not a caller of the Spot observer and is not evidence that Spot controls manual close.
- getFuturesExchangeAdapter:10423 routes the actual Gate branch; capabilities are descriptive, not a disabling gate.

The Spot data in question is specifically **Binance Spot**, not a native Gate Futures or Gate Spot feed. Its high/low, not its returned close field, drives this observer's hit tests.

### 3. Configuration / scheduling / reachability

| Question | Exact source conclusion |
|---|---|
| Enabled by default? | No Gate-observer enable flag guards either observer call. It runs when invoked and eligible account/trade data exists. Do not confuse this with default permission for new Real trading. |
| Real mode flag? | getFlags:2713-2727 sets realEnabled only when copytrade_real_enabled==='true' (missing defaults false). Manual sync access for non-admin/non-granted users requires VIP and enabled mode at16468-16475. Admin/test-grant bypass is explicit. |
| Does that flag disable background Gate management? | **No.** handleCronSyncAll dispatches before those session/mode gates and its Gate loop does not consult realEnabled, engine-first, Futures Pro setup status, or a Gate capability flag. |
| Account/trade preconditions? | Background loop needs a real_accounts Gate row plus matching OPEN Real Gate copy_trades. It does not filter the account query by connected=true. Actual API credentials must work, and the position response must confirm nonzero native quantity for the candle-triggered close branch. These are execution preconditions, not an optional dormant-feature flag. |
| Gate supported for Real Futures? | YES in candidate routing: explicit connect allowlist at16963, getFuturesExchangeAdapter Gate branch, createGateFuturesAdapter and capabilities at8147. No current account/config values were read. |
| Scheduled? | Handler comments intend a roughly five-minute cron cadence; CLAUDE/AI_HANDOFF describe VPS systemd scheduling. **No tracked Gate/copytrade sync timer/job configuration was found** in the inspected candidate. Current enabled state/cadence/service health cannot be proved without out-of-scope host evidence. Old GitHub/Vercel comments are not runtime proof. |
| Active API/UI integration? | YES in candidate source: authenticated POST real sync plus the app-wide20s useEffect (not confined to an open Copy Trade tab). Whether a client is currently open/authenticated is unverified. |
| Called by Futures NEW-analysis runner? | **No.** handleFuturesProCronTick:14758 -> futuresProWatchTick:11827 is separately dispatched at15117. Its native analysis path does not call syncRealGateTrades. |
| Historical/reconciliation-only? | No. It can issue a native close and cancel protection, then write reconciliation/accounting state. The word “sync” does not make this endpoint read-only. |

The local ops/signalverse-deploy source (read only, never executed) shows runtime server code is supplied from an external shared runtime directory; it does not establish current scheduler state. No deployment/control-plane investigation or change was undertaken.

**Why not CONDITIONALLY-ACTIVE?** No single optional observer feature flag makes this a dormant path: the independent background route bypasses the manual Real-enabled gate. Authentication, an account and an open position are normal reachability prerequisites, not proof of a disabled feature. The audit labels the demonstrated hazardous production-facing path ACTIVE-BLOCKER without inventing current live activity.

### 4. What the Spot candles can influence

| Item | Influence | Exact mechanism / limit |
|---|---|---|
| TP detection | YES, direct | decideRealTradeAction:2331-2332: LONG uses windowHigh>=tp1; SHORT uses windowLow<=tp1. |
| SL detection | YES, direct | :2327-2330: LONG uses windowLow<=stop_loss; SHORT uses windowHigh>=stop_loss. SL wins when both were touched in the aggregated window. |
| Exit price | YES indirectly through timing; NOT direct price substitution | Spot selects whether/when to close and SL-vs-TP expectedPrice hint. closeGateTrade returns validated fill_price; reconcileGateClosePnl prefers native position-close history. The Spot candle close is not assigned as exit price. |
| Close-position action | YES, direct trigger | action -> applyRealGateAction -> closeGateTrade -> reduce-only IOC POST, even if native protection was previously verified. |
| Reconciliation state | YES | finalStatus comes from action.kind; successful result writes status/closed_at/qty_remaining_pct and clears stored protection IDs. No-hit also changes last_synced_at/excursion. |
| Realized PnL | YES indirectly; no claim of measured loss | Different close timing changes actual fill/PnL. Accounting prefers Gate close history; fallback uses pnlOf(entry, actual fill, underlying quantity). Spot-derived excursion/outcome attribution is also persisted. |
| Protection state | YES after exit; not SL/TP geometry | ensureProtection uses stored SL/TP before the candle read, so Spot does not calculate replacement levels. A Spot-triggered successful close then cancels native triggers and clears IDs. If the close is unconfirmed, the complete-fill check stops that subsequent cancellation. |

Thus native SL/TP orders do not make the observer harmless: the server can request an independent market-style exit based on Spot before/without a native trigger being hit. This is source-level causal evidence, not an observed current incident.

### 5. Separate NEW analysis and indirect state effects

Gate NEW analysis uses:

- api/analyze.ts:3029 loadRealFuturesMarketInputs -> internal real-gate-market-inputs.
- api/copytrade.ts:11723 handleRealGateMarketInputs -> buildFuturesProTimeframeInputs(...,'gate').
- builder:11652 -> fetchGateNativeFuturesCandles in api/_shared/futures-market-data.ts:12.
- native Gate Futures candlesticks -> closed selection/provenance -> shared indicators -> central engine. There is no call to syncRealGateTrades in this input graph.
- Real Gate pending entry uses getFuturesMarketWindow, not the fallback Spot helper (10906-10914).

**Direct effect on NEW Gate input/scoring/setup: NO.** The observer neither rewrites Engine strategy nor supplies Spot candles to that new-analysis pipeline.

**Indirect eligibility effect: YES.** A persisted closure changes OPEN counts, resolves signal locks, and frees a symbol. futuresProWatchTick:11881-11883 excludes symbols with OPEN positions; analyzeOneCoinPro:3158-3161 reads open count/lock into risk state. Both sync routes subsequently call checkPendingSignals (14627 and17528). Therefore it would be too strong to claim the observer can never affect whether a later new trade is eligible. The analysis input remains native; account-state consequences remain real.

### 6. Acceptance / deployment impact (this issue only)

| Scope | Blocked by this observer? | Rationale |
|---|---|---|
| Central Futures NEW ENTRY ENGINE | NO, for deterministic logic/input acceptance | No observer/Spot input dependency; normal account-state changes can affect later eligibility. |
| Futures Strategy | NO direct strategy-math blocker | No scoring/level rewrite; execution-based economic validation for Gate is confounded until exit behavior is resolved. |
| Demo | NO from this Real Gate observer | These callers select mode=real Gate records; independent Demo behavior is not certified here. |
| Simulator | NO | This live adapter/observer is not its fill/decision path. No Simulator change or test run in this audit. |
| Gate NEW analysis | NO direct input blocker | Native Gate data path is separate; do not downgrade it to Spot because of an old exit observer. |
| Gate existing-position management | **YES** | Spot hit can trigger real native close, trigger cancellation and state/accounting changes. |
| Unrestricted deployment/activation including Gate live management | **YES, safety acceptance blocker** | Cannot certify full Gate lifecycle as corrected while shipping/continuing this unresolved path. This is a recommendation/gate, not an action to disable current protection. |
| Unrelated isolated engine-only acceptance | NOT automatically blocked by this issue | Other release gates remain separate; no deployment authorization is implied. |

No broad status is collapsed into one “all Futures broken” label. This classification does not resolve or expand the separate cost/accounting findings from the previous task.

### 7. Exact sources / checks / changes

Primary source files inspected:

1. api/copytrade.ts — observer, all callers, Spot transport, position validation, protection, close/fill, accounting, access flags, native-input bridge, independent Futures Pro runner.
2. api/analyze.ts — native Gate input bridge/provenance checks and open-count/lock risk reads.
3. api/_shared/futures-market-data.ts — native Gate public candle/context transport.
4. src/app/App.tsx — app-wide authenticated real-sync20s trigger.
5. ops/signalverse-deploy — shared runtime-server provenance only; no execution or modifications.

Instruction/context files read: AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md, TRADING_STRATEGY.md and the existing reports/futures/futures-completion-audit-2026-09-25.md. Search-only inventory covered tracked api/server/lib/src, ops, .github/workflows, scripts and documentation; no matching tracked sync timer/job was found. The two incidental historical Spot documents returned by search were not used as proof of current runtime.

Checks executed: git status/rev-parse/diff; scoped rg/git ls-files; TypeScript AST read-only caller enumeration. No application imports/handlers or strategy/regression tests were executed. Prior917/917 results were NOT rerun and are not new evidence here.

Only requested documentation is updated:

- reports/futures/futures-completion-audit-2026-09-25.md
- HANDOFF.md

**Application code changes=0; orders placed/cancelled/modified=0; position changes=0; SL/TP/protection/execution changes=0; Production/VPS/DB/config changes=0.** No secret values were read or disclosed. Existing untracked tmp/ is untouched. A separate sanitized report is prepared for publication to AI-Log/master; no application main push, merge, deploy or workflow dispatch is authorized.

Final classification: **GATE-OBSERVER-ACTIVE-BLOCKER**, precisely scoped to existing-position management. Current live occurrence remains unverified.


## Implementation

NONE. No repair, native-candle replacement, feature switch, execution/protection change or deployment. Existing open-position logic remains byte-for-byte unchanged.

## Checks Executed

- git status --short --branch / git rev-parse HEAD: confirmed isolated branch and pinned fc5a730 candidate; pre-existing untracked tmp/ preserved.
- Scoped rg / git ls-files: located observer callers, native NEW path and scheduler references. No tracked sync timer/job configuration found.
- Static TypeScript AST caller enumeration: two syncRealGateTrades callers, six fetchKlineExtremes callers; exact inventory above.
- git diff --check: PASS, no whitespace errors.
- git diff --quiet fc5a730029e617ee807aae59c722b462501b54ee -- . ':!HANDOFF.md' ':!reports/futures/futures-completion-audit-2026-09-25.md': exit 0, no other tracked changes.
- git diff --cached --name-only / --stat: exactly two documentation files, 179 added lines, zero removed lines.
- No application/strategy regression suite, handler, exchange probe or order simulation was run. Previous 917/917 is historical evidence, NOT rerun here.
- node scripts/scan-secrets.mjs reports/futures/gate-observer-final-classification-2026-09-25.md: PASS, no obvious secret patterns. Full staged diff reviewed; no account IDs, secret values or private account records are included.

## Build Result

NOT RUN — documentation-only classification; no executable code change.

## Git Status

- Application branch: codex/futures-completion-20260925.
- Local docs commit: d92c53c69afb81945847159d595a03150f841947.
- Post-commit tracked worktree clean; pre-existing untracked tmp/ untouched.
- Application main: no merge/push; no deployment/CI dispatch.
- AI-Log master: reports-only publication; remote commit and blob to be verified and returned in the task response.

## Commit

Local documentation: d92c53c69afb81945847159d595a03150f841947.

Audited executable candidate remains fc5a730029e617ee807aae59c722b462501b54ee. This audit does not assert either SHA is active in Production.

## Remaining Issues

- Gate existing-position observer still reads Binance Spot and can trigger a native Gate close; intentionally NOT fixed.
- No live runtime/scheduler/account evidence was requested or collected.
- This audit does not resolve separate economic/accounting or other release gates.

## Risks / Limitations

Source reachability proves potential influence, not a measured live incident, current loss, profitability or actual scheduler execution. The close callback can affect native protection and accounting after a successful exit; native protection alone does not neutralize the Spot-triggered close path.

## Recommended Next Step

Keep acceptance of the central engine and native NEW-analysis separate from Gate lifecycle acceptance. Any later repair to existing-position observation requires a separate, explicitly scoped owner authorization and dedicated isolated validation. No such repair or deployment is authorized by this classification.

## Final Classification

GATE-OBSERVER-ACTIVE-BLOCKER

Scope: Gate existing-position management/exit safety acceptance. Current live occurrence is unverified.
