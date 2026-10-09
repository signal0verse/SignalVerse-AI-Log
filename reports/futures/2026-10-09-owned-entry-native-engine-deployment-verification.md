# Independent verification of native SignalVerse fresh-entry release

Date: 2026-10-09 (Asia/Kuala_Lumpur). Scope: read-only verification of the owner-supplied REPORT.md and current production delivery; no implementation or new deployment was requested or performed.

## Result

CONFIRMED: the native SignalVerse engine service and the separately owned CrossVerse CopyTrade worker are running the report's exact release, b18d35403bdc71274bb18bfbf135bec50d15a6c9. This is a deployed backend entry-admission correction, with unchanged signal-generation formulas; it is not a claim of improved trading profitability.

## Independent evidence

- The production deployed marker and both application release paths match the exact SHA. The actual working directories of both running processes resolve to that release as well, rather than merely relying on a symlink or repository HEAD.
- Native signalverse.service and signalverse-partner-copytrade.service were active. Their main processes started at 15:07:15 and 15:07:13 UTC respectively on 2026-10-09. Native local and public health responses reported ok=true during this audit.
- The shared terminal manifest identifies the same source SHA. The native compiled analyze/copytrade modules and owned worker compiled bundle contain the origin-capture and final-submission freshness-rejection paths.
- Native deployed api/analyze.ts SHA-256 is 338218d1d83603b1db42021dd40a9fc439e17ce2ba19b58c42d8840f7f42000a (456159 bytes). Native deployed api/copytrade.ts SHA-256 is a3e780011c80767dfded0fb07518a8fcedd6bb1312bc7bdaa2d9ccaf6e1c3028 (1508583 bytes). Both exactly match independently retrieved GitHub blobs from the reported commit.
- Exact main CI run [37945296112](https://github.com/signal0verse/signalverse-main/actions/runs/37945296112) completed successfully at that SHA. All 63 recorded workflow steps have success conclusions.
- Official guarded release run [37948814734](https://github.com/signal0verse/signalverse-main/actions/runs/37948814734) completed successfully at that SHA. Current server checks corroborate that release independently of its workflow conclusion.

## Actual correction scope

The reviewed [released fix document](https://github.com/signal0verse/signalverse-main/blob/b18d35403bdc71274bb18bfbf135bec50d15a6c9/docs/fixes/owned-futures-entry-2026-10-09.md) and commit diff show that the native fresh-entry helper already existed. This release removes four PartnerCopytrade exclusions so standard LIVE Binance/MEXC/Gate owned entries use the same native guard. Native SignalVerse retains that guard in the same active release.

Real analysis captures the persisted setup origin. Pending activation, durable intent claim and the final PREPARED-to-SUBMITTED transition check the decision reference and current evidence. Decisions/scanner observations older than ten minutes, newer fully closed scored candles, missing identity/origin, superseded decisions and retired or direction-mismatched AUTO candidates fail admission. Known fills and uncertain holds keep their reconciliation path.

The executable diff is limited to origin capture, entry gates and persisted decision references. Signal votes, ATR stop/TP formulas, leverage, open-position protection, risk and credit policies are outside this correction. This verification does not assert that every product or market received a new strategy.

## Limits and publication state

The supplied report states 610 local tests. Those local runs were not independently rerun or their local logs inspected during this deployment audit; that number remains report-provided evidence. The exact official 63-step CI result was independently checked. Source/provenance, compiled code presence and service health were verified separately from private-account behavior. No private exchange request, order, position action, database mutation, service restart or new deployment was performed. Profitability has not been established by this audit.

Application source was not edited, committed or pushed; unrelated primary-worktree changes were preserved. Only this sanitized verification report is published to SignalVerse-AI-Log. Report publication is complete only after decoded remote contents equal the local bytes.
