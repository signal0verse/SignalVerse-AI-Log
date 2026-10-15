# Spot Scalp risk trend policies: verified production release

Date: 2026-10-16 (Asia/Kuala_Lumpur). Result: deployed and verified on SignalVerse and the shared CrossVerse terminal.

Source: `52844ba671267b193ac061751427008d58623d26`. Previous core release: `2fa1d1ef0938b77bfbf2ca24b36439318ae7c861`.
Repository: `signal0verse/signalverse-main`, branch `main`.

## Released behavior

The independent technical Spot Scalp project now applies an explicit 4h trend policy in both discovery and final automatic candidate quality:

| Saved preset | 4h trend condition |
|---|---|
| Conservative | Established bullish trend required. |
| Balanced | Bullish, range and transition regimes allowed; bearish rejected. |
| Aggressive | Known direction is contextual; countertrend candidates can be assessed. |

An allowed 4h condition does not itself authorize an entry. Existing scores, minimum score/edge, 1h confirmation, freshness, current OI, liquidity, spread, volatility and anti-chasing checks remain. Closed native 5m/15m confirmations, costs, funds, access and durable holds remain. A bearish candidate may still fail its buy score even in Aggressive mode. Risk labels describe filter strictness, not measured probabilities or promised returns.

Legacy profiles without an explicit saved policy retain strict behavior. Selecting a preset edits the draft; the user must Save. Tool customization does not silently relax the trend policy. No profiles were saved or activated by the deployment operator. Diagnostics show the policy used and each symbol's 4h admission reason. Classic Spot and generic Futures behavior are preserved.

## Release evidence

- [Official exact-source push CI](https://github.com/signal0verse/signalverse-main/actions/runs/38801608189): all 79 steps passed.
- [Official immutable artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/38811670840): successful; artifact ID `12009425394`.
- Retained archive SHA-256: `2abc49e1abde2592d224192a9aecb8e51af3da65d9f9c8ac3ced3e6fc1ec0472`. All 2375 Git blobs and modes matched the exact source; archive bytes were not repackaged.
- Exact 25-file delta and reversible predecessor projection were independently verified before approval. The prior completed-history correction is retained.
- Consistent private PostgreSQL/SQLite backups and cold restores passed before deployment. No production schema migration was performed.
- The installed independent release Guard authorized the exact source and retained archive digest; the Guard was not modified.
- [Official production release](https://github.com/signal0verse/signalverse-main/actions/runs/38812638494): successful.
- Native SignalVerse, the owned runtime, admin and Paper are active at the source above, with process working directories and health checked. Paper's 13 executable files plus provenance matched a fresh comparison build from the published source.
- Both public origins served the new shared manifest and matching `terminal.js` and `public-source.js` hashes and lengths. New policy UI markers were present. SignalVerse's native frontend and analytical worker assets also matched runtime hashes.
- Environment, service unit, schedule, shared-terminal routing and deployment control hashes were preserved. Temporary task runners/containers were removed; no other task resources were cancelled. Existing restricted self-hosted runners were used; no new paid GitHub-hosted Actions jobs were requested.

## Scope and limits

The operator did not force scans, place test trades, change order holds, save user settings or migrate accounts. Existing accepted campaign geometry and user-selected modes remain. Local regression evidence includes 309 integrated tests, 55 discovery/quality tests, focused strict TypeScript and 28 final scope tests; these are not profitability backtests. Runtime and origin checks establish deployment and code provenance, not a private-account fill or investment outcome.

Users who want a different trend policy must select their intended preset and explicitly save it separately in the desired Demo/Real settings. Existing profiles are not silently converted to a more permissive policy.
