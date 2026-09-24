# Binance Futures Stage 1B main-based candidate — 2026-09-25

Final status: **STAGE1B-MAIN-BASED-CANDIDATE-BLOCKED**. A clean candidate branch was created and pushed, but the requested exact-SHA CI gate did not run. No Production release, Guard request, database write or exchange write was performed.

## Baseline and identities

| Item | Fresh result |
|---|---|
| Previous Production/main base | `85aedfb944a67c94227ac343e911bc64a581e79e` |
| Current remote `main` / new candidate base | `3e3703dc6a4211ca02c5850d113af3caa00abb83` before and after branch push |
| Local `main` branch pointer | `85aedfb944a67c94227ac343e911bc64a581e79e` (not used as candidate base) |
| Old isolated Stage 1B candidate | `4fd7ebf0b276277a767b48b678e0b25cd9d84bf2` |
| Old candidate merge-base with previous base | `85aedfb944a67c94227ac343e911bc64a581e79e` |
| New branch | `codex/binance-stage1b-main-based-20260925` |
| New candidate SHA | `1cbd0f7572905588d9335ffd426685693ee5df58` |
| New candidate parent / merge-base with current main | exactly `3e3703dc6a4211ca02c5850d113af3caa00abb83` |

The original checkout contained unrelated untracked user files; they were not edited. A separate clean managed worktree was created from the exact remote-main SHA. The existing package-lock Git blob was identical to the original checkout (`02586ddc814ab43eb12d9995660f2f841cda4ad2`), so local tests/build used a junction to that already installed dependency tree; the junction is ignored and not committed.

## Exact transfer and diff

The ten Stage 1B paths were identical between the old Production base and current control-plane `main` before transfer. Nine app/test/historical-report paths were transferred from the old isolated candidate byte-for-byte, confirmed by an empty staged diff against `4fd7...` for `api/`, `scripts/`, and `reports/futures/`. The old `HANDOFF.md` Stage 1B entries were preserved as historical evidence, with one new top entry clearly distinguishing the new main-based branch and the old candidate. The three old dated reports remain historical; none was rewritten to claim a new SHA or Production observation.

Exact final candidate diff against `3e3703d...` (one commit, **10 files**, 776 insertions/10 deletions):

| Status | File |
|---|---|
| M | `HANDOFF.md` |
| A | `api/_shared/futures-candle-provenance.ts` |
| M | `api/analyze.ts` |
| M | `api/copytrade.ts` |
| A | `reports/futures/real-futures-strategy-stage1b-binance-isolated-candidate-2026-09-25.md` |
| A | `reports/futures/real-futures-strategy-stage1b-binance-validation-2026-09-25.md` |
| A | `reports/futures/real-futures-strategy-stage1b-candle-provenance-instrumentation-2026-09-25.md` |
| A | `scripts/futures-binance-provenance-validation-test.mjs` |
| A | `scripts/futures-candle-provenance-test.mjs` |
| M | `scripts/futures-mexc-native-routing-test.mjs` |

No `.github`, `ops`, Guard, deploy-control, scheduler, migration, exchange execution, Strategy/Risk/Supervisor formula, Spot, Demo or unrelated file changed relative to current `main`; `git diff --cached --check` passed. The application files retain Binance Kline native close field `k[6]`, open/close provenance, `inputSelectedAt`, decision computation start/end, `scoringInputSha256`, and `SAFE_CLOSED`/`FORMING_BAR`/`UNKNOWN` classification. MEXC change remains diagnostic provenance only. The LONG/SHORT offline fixture comparison preserved direction, score, chosen timeframe, Entry/SL/TP, risk/Engine result and simulated Supervisor prompt/verdict; this is not live parity or profitability evidence.

## Fresh local verification

| Check | Result |
|---|---|
| Focused Stage 1B provenance | 6/6 PASS |
| Binance provenance validation and LONG/SHORT parity | 35/35 PASS |
| Related Real Futures/Binance price-basis/correctness | 15/15 PASS |
| Futures Pro timeframe checks | 18/18 PASS |
| Syntax checks for both new test scripts | PASS |
| Web/admin `npm run build` | PASS; only pre-existing large-chunk warning |
| esbuild bundles, `api/analyze.ts` and `api/copytrade.ts`, `write:false` | zero errors, zero warnings each; first sandbox-only read denial resolved by rerunning with worktree access |

Local Node was **v24.19.0**, not the Node 22.x runbook target. No AI, DB, exchange or Production API was used by these focused fixture tests. The candidate worktree remained Git-clean after commit; build artifacts and dependency junction were ignored.

## Branch push and CI blocker

Exactly one candidate commit was created with the required message `feat(futures): rebuild isolated Binance Stage1B on current main`, then **only** `codex/binance-stage1b-main-based-20260925` was pushed. Remote verification showed branch `1cbd0f7572905588d9335ffd426685693ee5df58` and unchanged `main` `3e3703dc6a4211ca02c5850d113af3caa00abb83`.

The active `.github/workflows/production-ci.yml` has `push.branches` limited to `main` and `master`; `pull_request` also targets those bases. A push of this feature branch therefore does **not** start the expected normal push CI. GitHub Actions queries for the exact new SHA returned **zero runs**, so `CI_RUN = NONE` and `CI_RESULT = NOT_TRIGGERED`, not success. No CI workflow was manually dispatched, no PR was created, and no workflow file was changed to bypass this. The manual Production Release workflow additionally demands a successful **push CI on main** for the target SHA and main ancestry; the branch-only candidate does not yet satisfy that release gate. If `main` remains at `3e3703d...`, a separately authorized future fast-forward to this direct-child SHA could preserve the exact candidate SHA and then trigger main CI. That was **not** done here.

## No-side-effect evidence, limits and next gate

Final read-only VPS sample at `2026-09-24T20:35:09Z`: active marker and both app/admin symlinks still resolve to `85aedfb944a67c94227ac343e911bc64a581e79e`; main/admin/observer PIDs are `1962862`/`1962858`/`1962856`, all `NRestarts=0`. Guard receiver is `inactive/disabled`, PID 0, with no listener on port 3002. No Guard release endpoint or valid approval manifest was used. No application deployment, Stage 1B live observation, order, position, leverage, DB write, exchange write, or strategy change was performed by this task. Independent private-account and DB-state reconciliation was not performed, so activity by other actors is not ruled out.

**Next gate requiring owner direction:** decide whether to obtain branch validation via a separately authorized PR or explicit CI dispatch, or to authorize a controlled fast-forward of this reviewed direct-child SHA to `main` so the normal main push CI runs. Neither option was taken here. A successful branch CI alone would still not satisfy the manual Production Release workflow's main-push CI requirement; actual application release requires a further separate authorization. No merge, main push, Production Release dispatch, Guard action, or Binance observation is authorized by this report.
