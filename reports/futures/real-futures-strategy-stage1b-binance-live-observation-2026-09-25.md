# Real Futures Stage 1B — Binance Production Observation Precheck

## Update 2026-09-25 — isolated candidate; secure path unavailable

- Task ID: Stage 1B isolated-candidate Production Phase 0
- Mode: read-only VPS and local Git precheck; no deployment or live observation
- Application branch: `codex/production-deploy-control-20260924` (documentation only)
- Application report commit: `da5cf68b52a9a721d87d0477232bd41bd5f79cad`
- Isolated candidate branch: `codex/binance-stage1b-isolated-20260925`
- Owner-specified active baseline: `85aedfb944a67c94227ac343e911bc64a581e79e`
- Exact isolated candidate: `4fd7ebf0b276277a767b48b678e0b25cd9d84bf2`
- **Latest status: BINANCE-STAGE1B-OBSERVATION-BLOCKED.** The historical mixed-candidate mismatch report below is preserved as prior evidence.

### Objective, actions and confirmed findings

The task requested secure release of only the isolated candidate, then bounded read-only observation of naturally occurring Binance Real decisions. Phase 0 verified the local candidate SHA, its direct ancestry from the active baseline, and its exact `git diff --name-status`: **10 Stage 1B files** (3 application provenance files, 3 focused tests, `HANDOFF.md`, 3 Stage 1B reports). No `.github`, `ops`, Guard, deploy-control, scheduler or unrelated execution file is in the diff; `git diff --quiet ... -- .github ops` returned 0. The isolated branch working tree was clean. This resolves the older candidate-scope mismatch, not the release gate.

Read-only VPS checks at `2026-09-24T18:21:34Z` and `18:22:15Z` showed the deployed marker and app/admin symlinks on `85aedfb944a67c94227ac343e911bc64a581e79e`. Main, admin and observer services were active. The Guard receiver unit was `loaded` but `inactive/disabled`, `MainPID=0`, `NRestarts=0`; no listener was present on port 3002 and no artifact unit was listed. The adjacent helper filename expected by the receiver was absent, whereas the differently named installed helper existed. A verified secure release path is therefore **not available**. The exact fresh authorization phrase was specified as a gate but was **not provided by the owner as an approval message**. No old receiver was enabled, no alternate path was used and no deployment was attempted.

### Observation, reconciliation and impact

| Item | Result |
|---|---|
| Deployment result | NOT STARTED |
| Observation start/end | NOT STARTED / NOT STARTED |
| Qualifying natural Binance Real decisions | NOT OBSERVED; unknown, not zero |
| Timeframe/symbol counts | NOT AVAILABLE |
| SAFE_CLOSED / FORMING_BAR / UNKNOWN | NOT AVAILABLE / NOT AVAILABLE / NOT AVAILABLE |
| Forming rate excluding UNKNOWN | NOT CALCULABLE |
| Capture errors and persisted-decision reconciliation | NOT ASSESSED |
| Synthetic/fabricated observations | NONE |
| Order/position/leverage/settings impact by this task | No write action; private exchange state not queried |

Only `HANDOFF.md` and the application precheck report were changed and committed as documentation on the development branch, with `[skip ci]`; application `main` was not merged/pushed. No VPS file/service, Production runtime, DB, exchange, Strategy, Spot or Demo was changed by this task. The original untracked workspace files were preserved. `git diff --check` for the two report changes passed. No build or trading test was needed because deployment was blocked before Phase 1. Live forming-bar rate, strategy improvement and profitability remain unknown.

Next step requires a separate approved repair and live verification of the Guard release path, followed by a fresh exact owner authorization and repeated SHA/scope precheck. Do not revive the old receiver or bypass Guard. This report is not release approval.

---

## Metadata

- Date: 2026-09-25 (Asia/Kuala_Lumpur)
- Task ID: Real Futures Stage 1B Binance Production observation precheck
- Module: Real Futures candle provenance
- Mode: read-only Phase 0; no observation started
- Repository: `signal0verse/signalverse-main`
- Branch: `codex/production-deploy-control-20260924`
- Starting commit: `00dfcf6e990c60626b5cadf3c1a29737a443a24e`
- Ending commit: `74b19423941ab144e5278bfc3c7b6883c4ee7de8`

## Objective and scope

Check the active Production SHA and whether the specified Stage 1B candidate is isolated. The explicit mismatch stop rule prevented any release-path work, deployment or natural-decision observation.

## Files inspected

`api/analyze.ts`, `api/copytrade.ts`, the exact Git name/status diff between active and candidate SHAs, the current `HANDOFF.md`, and prior release-control preflight report. No Production application file or private account record was opened.

Date: 2026-09-25 (Asia/Kuala_Lumpur). Read-only evidence collected 2026-09-24T17:28Z. Final status: **BINANCE-STAGE1B-DEPLOY-CANDIDATE-MISMATCH**.

## Executive result

The requested Production observation did **not** start. Phase 0 verified that the VPS active marker and both app/admin release symlinks resolve to `85aedfb944a67c94227ac343e911bc64a581e79e`. The Stage 1B candidate `e323f2758dfb0bccc68f4e1a85ca7ff32eccbdbe` exists locally, but its exact diff from that active SHA includes independent Production deploy-control/workflow/Guard changes. It is therefore **not** an isolated Stage 1B application release. The task's mismatch stop rule was applied immediately; Phase 1 release-path evaluation, deployment, and natural-decision observation were not attempted.

## Deployment identity and exact mismatch

Read-only SSH to the owner-provided VPS address/port returned:

| Evidence | Observed value |
|---|---|
| `/var/lib/signalverse-deploy/deployed-sha` | `85aedfb944a67c94227ac343e911bc64a581e79e` |
| `/opt/signalverse/app` resolved | `/opt/signalverse/releases/85aedfb944a67c94227ac343e911bc64a581e79e` |
| `/opt/signalverse-admin/app` resolved | `/opt/signalverse-admin/releases/85aedfb944a67c94227ac343e911bc64a581e79e` |

Local `git rev-parse` resolves both named commits. `git diff --stat 85aedfb... e323f275...` shows **27 files changed, 2,218 insertions, 62 deletions**. The complete name/status inventory is reproducible with `git diff --name-status` between those exact SHAs. In addition to the Stage 1B files (`api/_shared/futures-candle-provenance.ts`, `api/analyze.ts`, `api/copytrade.ts`, its focused test and report), the candidate changes `.github/workflows/production-ci.yml`, adds `.github/workflows/production-release.yml`, modifies `ops/signalverse-deploy`, and adds receiver, authorization helper, systemd unit, retry/readiness scripts and deploy-control tests/reports. Those files are unrelated to Binance candle-provenance observation and materially affect the release control plane. `HANDOFF.md` and `docs/AI_HANDOFF.md` also differ. No assertion is made that every non-instrumentation line is harmful; their presence alone violates the exact isolated-candidate requirement. The candidate was **not** packaged, built for deployment, merged or deployed.

## Observation window and evidence

| Required result | Result |
|---|---|
| Observation window UTC | NOT STARTED |
| Eligible new Real Binance decisions | NOT OBSERVED; no count claimed |
| Per-decision provenance evidence table | NOT AVAILABLE |
| SAFE_CLOSED / FORMING_BAR / UNKNOWN | NOT AVAILABLE / NOT AVAILABLE / NOT AVAILABLE |
| FORMING_BAR rate and per-timeframe/symbol breakdown | NOT CALCULABLE |
| Earliest/latest forming event and maximum time gaps | NOT AVAILABLE |
| Persistence gaps | NOT ASSESSED; no observation was run |
| Direct order/execution impact | NOT OBSERVED; no exchange or decision ledger was queried |

The absence of a window is **not** zero Real decisions and is **not** evidence of SAFE_CLOSED. Historical Stage 1A remains BLOCKED. No later Binance API call was used to reconstruct old decision inputs.

## Safety and remaining gates

Only local read-only Git checks and one read-only VPS marker/symlink command were performed. No Production code/config/service, Guard, DB/schema, exchange credential, order, position, leverage, Strategy, Risk, Supervisor, Spot or Demo was touched. No old receiver was enabled and no release path was invoked. The current secure release mechanism was **not** evaluated after the mismatch, as required by the stop rule. No owner approval phrase in the attachment's conditional instructions was treated as a release authorization.

The next gate is a separately reviewed **isolated Stage 1B candidate rebased/cherry-picked onto the independently verified active application SHA**, with an exact diff containing only authorized provenance instrumentation and necessary offline tests/reporting. That candidate then needs its own build/non-regression verification and a separate secure-release preflight and explicit owner authorization. Only after a valid release could a bounded, read-only window collect naturally occurring new Real Binance decisions, reconcile every persisted decision ID/input record, and compute SAFE_CLOSED/FORMING_BAR/UNKNOWN. No trade should be manufactured.

**PRODUCTION STRATEGY CHANGED = NO. STRATEGY IMPROVEMENT PROVEN = NO.**

This report and handoff are documentation-only on the development branch. Application `main` was not pushed or merged. AI-Log publication and exact report commit SHAs are verified separately in the final response.
