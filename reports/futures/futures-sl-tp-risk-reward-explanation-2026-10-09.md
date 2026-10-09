# Futures SL / TP and risk-reward: current runtime source explanation

## Metadata

- Date: 2026-10-09
- Module: standard Futures Pro / copy-trade
- Mode: read-only investigation; reports-only publication
- Repository: signal0verse/signalverse-main
- Primary checkout HEAD: 0dbca62357a4adf34240f40ceda3e387356ec4b0; unrelated dirty work preserved
- Remote main observed: c68a5709c0cbec0cef9420e09c405227cece87e1
- Active runtime marker and resolved app release path: 61280af0f123fe8d6bbfb4afe7e0cb6a7d238c91, read at 2026-10-09T11:49:02Z
- Application starting/ending commits: unchanged by this task

## Objective and scope

Explain how the deployed standard Futures Engine calculates SL, TP and R:R for each timeframe. No strategy, settings, deployment, private-account inspection or order action was requested/performed. Fast Trader, Whale and Spot are outside this explanation.

## Actions Taken / Files Inspected

- Read contributor instructions and strategy history including active-runtime amendments.
- Read authenticated remote main and fetched its history into an existing isolated checkout without changing its HEAD or the primary worktree.
- Read only the deployed marker and app symlink on the host; no DB, credentials, account rows or exchange requests.
- Inspected the following at active runtime commit 61280af0f123fe8d6bbfb4afe7e0cb6a7d238c91:
  - api/_shared/futures-indicators.ts:76-86, 126-155
  - api/_shared/futures-risk.ts:5-27, 30-36
  - api/_shared/futures-decision-engine.ts:96-108, 338-397, 492-518
  - api/analyze.ts:677-721, 2185-2230, 3071-3075, 3216-3240
  - api/copytrade.ts:1675-1693, 10925-10947, 18972-18991
- Confirmed the three shared indicator/risk/engine files have no committed difference from the isolated checkout used to read them. analyze.ts and copytrade.ts were read directly from the active Git object, not the older checkout versions.

## Confirmed Findings

1. The standard live analysis calls the shared engine without strategy overrides. Default stop multiplier is 1.25 ATR. No separate R:R multiplier is configured per timeframe in this path.
2. ATR normally uses period 14 and Wilder-style recursive smoothing of true range. True range is the maximum of high-low, absolute high-previous close, and absolute low-previous close. Period refers to bars on that timeframe, not 14 minutes or a strict rolling-window-only average.
3. Engine ranks selected timeframes by absolute confluence score (threshold 4); equal scores prefer the higher timeframe. The chosen timeframe supplies price and ATR. It does not average every timeframe's ATR to determine one stop.
4. For risk distance D = 1.25 * chosen ATR:
   - LONG: SL = entry - D; TP1 = entry + 2D.
   - SHORT: SL = entry + D; TP1 = entry - 2D.
   - Analytical TP2 and TP3 are 3.5D and 5D from entry respectively.
5. Allowed standard live intervals are 15m, 1h, 4h, 1d and optional 1w. Every interval uses the same multipliers; ATR itself differs. Defaults exclude 1w.
6. Initial TP1 reward/risk is 2.0 (risk:reward = 1:2). The shared risk gate and watch-setup sanitizer require at least 1.9 and correct price-side geometry. Real direct and pending entry paths separately recheck at least 1.9 using current native Futures price before submission. This is not an atomic fill-price guarantee; slippage/latency can change realized geometry.
7. Standard Real Futures uses one full exit at TP1 (100/0/0). TP2/TP3 do not justify a larger live R:R claim. Demo's configured allocation can produce an allocation-weighted reward in its entry validator; that is not the Real exit model.
8. The setup formula does not place stops behind market-structure levels or place targets at resistance/support. Structure is recorded as evidence and the returned smcDecisionWeight is 0 in this engine path. Do not describe the current SL/TP generator as a structural placement algorithm.
9. Entry R:R gate is gross price geometry, not net of fees/funding/slippage. Economics calculation separately subtracts fees and funding. Leverage changes exposure/margin returns, not the generated price-distance ratio.
10. ATR error fallback exists: calculate from last20 candles; if still unavailable/nonpositive use 2% of chosen price and record a data issue. That fallback implies D=2.5% of entry, but this investigation did not establish any actual trade used it.

## Illustrative arithmetic (not a trade/test order)

Entry 100 and ATR 2 imply D=2.5. LONG SL=97.5 and TP1=105; SHORT SL=102.5 and TP1=95. In either direction gross reward/risk is 5/2.5=2. If a LONG entry quote moves to 101 while levels remain 97.5/105, reward/risk becomes 4/3.5=1.142857 and fails the 1.9 pre-submission gate.

## Files Changed / Implementation

Only this AI-Log report. No application source, strategy documentation, settings or runtime changed. No repair implemented.

## Tests Executed / Build Result

No application tests or builds run: explanation-only task. Evidence is actual source inspection and runtime identity read, not a profitability test or private-account execution verification.

## Git Status / Commit

- No application commit, application push or deployment.
- Primary unrelated dirty changes left untouched.
- Existing unrelated untracked AI-Log report preserved.
- This sanitized report alone is intended for master publication; publication success and remote blob identity are verified separately before the final answer.

## Risks / Limitations / Recommended Next Step

- This explains code at the observed runtime identity, not actual SL/TP provenance or fills for any specific historical position.
- R:R 1:2 does not establish a 2x expected return, win rate or positive net expectancy.
- No new strategy recommendation or authorization for a strategy change follows from these findings.
- No action needed to answer the question; any per-position audit or modification would be a separate task.

PRODUCTION_CHANGE=NO; DATABASE_CHANGE=NO; WORKER_START=NO; EXCHANGE_CALLS=0; ORDER_ACTIONS=0; POSITION_ACTIONS=0; SL_TP_CHANGES=0.
