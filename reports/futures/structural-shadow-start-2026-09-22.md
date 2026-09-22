# Real Futures structural shadow: isolated 24-hour start (2026-09-22)

## Metadata and decision status

- Scope: public-data-only, no-order comparison for Standard Real Futures research; **not** Production Real/Demo execution, Spot, or a live LLM Supervisor test.
- Frozen observation window: 2026-09-22 07:30:00 through 2026-09-23 07:30:00 UTC (end exclusive). At publication, the result is **PENDING**.
- Source of pure engine and indicator declarations: active Production executable SHA `cbc64240002d7b491774aafbfa5d650cd9460956`; source SHA remains deployed and the main service remained active after setup.
- Protocol SHA-256: `92227dd218dfced5a968d5e3cfb45414549e49f9e9d38e3d42b3d5121a3068fd`; runner SHA-256: `8ec476e5ecbe3d2b553c5ae1dfacb354a0a8dfbc0c6a52a619975e983c58c2bb`. Local and VPS hashes matched.

## Frozen method

Six public USD-M Futures pairs (BTC, ETH, SOL, BNB, XRP, UNI), four scored timeframes (15m, 1h, 4h, 1d; no weekly), and 96 scheduled 15-minute decisions. Fetch only `GET https://fapi.binance.com/fapi/v1/klines` with exact symbol/timeframe allowlists, 250 fully closed and gap-checked bars per timeframe, 15-second request timeout and at most 900 GETs for the window. No private Binance endpoint, database, AI provider, env file, account credential, order, simulated fill or Product handler is called.

The exact active-SHA pure engine and indicator functions were AST-extracted into self-contained JavaScript without API bootstrap. A predeclared deterministic structural reviewer uses two-bar-confirmed 4h pivot highs/lows: two higher highs plus higher lows = bullish; two lower highs plus lower lows = bearish; otherwise unknown/mixed. It vetoes only an engine candidate opposed by a known 4h structural direction; unknown abstains. 1h support/resistance, OB and FVG counts are recorded diagnostics, not optimized veto rules. Pivot source and knowable times are preserved; no forming or future candle is accepted. Repeated 15-minute proposals of the same side/timeframe remain one candidate episode until a no-trade reset or change. No PnL is estimated in this stability window.

Public-only mode has no historical stablecoin context, Production market-regime snapshot, account holds or real leverage state; those inputs are explicitly absent/null. This is a controlled core proxy, not faithful full Production orchestration. The deterministic reviewer is **not** the AI Supervisor; its effect cannot be credited to AI. Fewer than 30 independent episodes means efficacy is `NOT_MEASURABLE`. Even 30 episodes would not by itself authorize code/strategy promotion.

## Preparation and verification

- Local and VPS Node 22-compatible no-network self-tests: seven structural/causal assertions each passed, including opposite-side veto, same-side pass, unknown abstention and look-ahead rejection.
- Local and VPS public GET-only smoke: 24 successful requests each (six pairs × four timeframes), six `WAIT` outputs each, no ledger event or order. The protocol rules were written before the smoke; the protocol's displayed `frozenAt` is 06:20 UTC, while the local smoke completed shortly before it. This sequencing is disclosed. A later runner edit corrected only loop scheduling, not criteria or engine/structure decisions; its final hash above is the deployed one.
- Isolated VPS directory `/var/lib/sv-futures-shadow-20260922` and one `sv-futures-shadow-20260922.service` unit were created. The unit uses a dynamic non-root user, no credentials, protected filesystem, inaccessible Production release/marker paths, 256 MB/20% CPU limits, no restart and self-termination at the 24-hour boundary. `systemd-analyze verify` passed; exposure score 4.3 (OK). Pre-reload inspection found no pending Demo test timer; no Production service was restarted.
- The observer was active and waiting before the start. At 06:27 UTC, both Production and the isolated unit were active; Production deployed SHA was unchanged. No first scheduled tick or final outcome was claimed at this point.
- A same-thread periodic follow-up was configured to remain silent during normal unchanged operation, inspect the final VPS artifacts after the window, and publish a separate final report. This app follow-up depends on the local Codex host being available; the VPS observer does not.

## Files changed, publication and next gate

Application executable, DB, exchange account, Production settings, Spot and Demo: **NONE**. Local isolated harness/protocol reside only in untracked `tmp/futures-shadow-20260922/`. Main repository changes are documentation-only handoff/report with `[skip ci]`; no executable deployment is intended. Only the exact isolated VPS path and unit were added there.

After 2026-09-23 07:30 UTC, inspect expected 96 ticks and at most 576 symbol events, missing/error/duplicate events, GET budget, candidate episodes and structural `VETO/PASS/ABSTAIN`; label incomplete data honestly. If service fails, do not fabricate results or place orders. Separate owner approval is required before any Real engine/Supervisor code change, with Demo parity deferred and Spot excluded.
