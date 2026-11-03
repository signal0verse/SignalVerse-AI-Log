# Historical CI reader and archive capacity — actual candidate result

Recorded: 2026-11-03T18:22:17.965255+00:00

**Official candidate CI: FAILURE. No deployment.**

## Authorized scope

Owner authorized fixing the specific historical test and archive-capacity blocker without removing tests or weakening safety gates, then rerunning official CI. Source publication was a normal fast-forward on the existing candidate branch only. No main promotion or Production operation was performed.

## Exact source and publication

- Candidate: `a31d803d4396c31cf0d2c693e2a098114056db5d`.
- Branch: `codex/ci-module-routing-20261103`.
- Previous candidate: `418de61b83a915ed19b1f0642e6a45a8c362f8ef`.
- Main before/after: `eacedbb2801c303482b201320968983fce9d93bf` / `eacedbb2801c303482b201320968983fce9d93bf`.
- Five normal successor commits preserve complete source storage ancestry; no amend, rebase, squash, force or history rewrite.
  - `0e9f69691a71aefab182e1e6c70fa2bb5f0b9137`
  - `f95430cba84a0182fb4057a58887b38c2ba903d2`
  - `545fab07666d21b7c4c2f584ba98ca145da9cacc`
  - `e40b906c3504805d1fa2b2bb7a356d918606bac0`
  - `a31d803d4396c31cf0d2c693e2a098114056db5d`

## Historical failure and repair

Prior candidate run41664101646 failed the exact original Linux test `checked source batches execute every original assertion and reject changing snapshots`: it read production-ci directly and compared it to the old released workflow. Four cache/release-authority files still matched. Only the workflow source read now crosses beforeCiScope, which verifies the complete exact current source delta before returning the predecessor view. Unknown or altered bytes remain raw and fail the original assertion.

The complete original Linux-only program remains SHA256 `50eb2b660e1d6e59df6dbda51e4caf81e2b522e9369d85c66a041629068219e4`. Every original assertion, test registration and Linux guard is retained. A regression invokes the exact failed callback: the raw changed workflow reproduces failure; the verified bridge passes. This local callback proof is distinct from complete Linux execution.

## Capacity and lossless source storage

- Exact final-commit original packageCommit: **8,385,561 bytes <= 8,388,608 bytes**; headroom 3,047 bytes.
- Embedded commit matches the exact candidate. Normal Git archive/gzip/EOL/mode settings,8MiB cap, receiver, Guard and release workflows remain unchanged.
- This was an in-memory local exact-commit capacity diagnostic. Bytes were discarded; no official artifact, retained artifact, Guard or release was created.
- Eleven CI/test program bodies and complete policy/manifest data remain verbatim in normal immutable Git ancestry. Canonical current loaders verify fixed commit, full raw SHA256, source length/UTF8, export surface and syntax-only module URL offsets. Missing/corrupt source fails closed with no fetch/fallback. Every test still executes against current source; no test result is cached. Routing parses expanded original test programs. Current source witnesses still hash actual loader/data bytes.

| Current program | Immutable source commit | Full SHA256 |
|---|---|---|
| scripts/analysis-chart-completeness-test.mjs | `545fab07666d21b7c4c2f584ba98ca145da9cacc` | `f4ba3cb462540491293dc8bad8ed7f2ccc258b57dbf37543f24e049cd9c74ed4` |
| scripts/analysis-page-evidence-test.mjs | `545fab07666d21b7c4c2f584ba98ca145da9cacc` | `3351b66945d516148197353a72419ef63fd01088659e909d762effae6c1f569d` |
| scripts/ci-checked-git-test.mjs | `0e9f69691a71aefab182e1e6c70fa2bb5f0b9137` | `4e9d13726a5e0942cb6d959343405f8c2514f049338974c6409d65a8c8a429dd` |
| scripts/ci-module-routing-test.mjs | `0e9f69691a71aefab182e1e6c70fa2bb5f0b9137` | `e5dc47afd4b00f2dabc4f913e75edf8ba4647eca5d475dabe181cabc9016acc6` |
| scripts/ci-module-routing.mjs | `0e9f69691a71aefab182e1e6c70fa2bb5f0b9137` | `66357fa32814109fe4b69b52393fe96415a909557e9a51c1e3a5f6585ecf3b8d` |
| scripts/ci-module-scope-test.mjs | `0e9f69691a71aefab182e1e6c70fa2bb5f0b9137` | `b2d62a5f06e977e6df3a442f8be79b491fa663fe7ea04d289a754f758916535c` |
| scripts/ci-program-test.mjs | `545fab07666d21b7c4c2f584ba98ca145da9cacc` | `e9c4865012953bdb819f336dbac4019b172bcc4b428f337296a84cfc9c4387e9` |
| scripts/lib/ci-checked-git.mjs | `0e9f69691a71aefab182e1e6c70fa2bb5f0b9137` | `a47ad140c755f2ba796de94ca7133f7cb67e1bf0d65277e8fc52ccfb8c9a8f36` |
| scripts/lib/ci-module-routing.mjs | `0e9f69691a71aefab182e1e6c70fa2bb5f0b9137` | `f3f55c42ae573365cec9b6dc45992f387bc2674ac4c48776b7539bb806342812` |
| scripts/lib/ci-module-scope.mjs | `0e9f69691a71aefab182e1e6c70fa2bb5f0b9137` | `21318bb1960e18a57421836f54580d51686352e9011c7cb60c8cdd044500373a` |
| scripts/lib/ci-workflow-contract.mjs | `0e9f69691a71aefab182e1e6c70fa2bb5f0b9137` | `7450dea626460bfd45ac3ee78a2ddbdb3e3b79800e8ecb742493262efb55ed5d` |

## Fresh local validation

- Final frozen source:77/77 tests passed,0 failed/cancelled/skipped; includes11 new storage/transport negatives,33 original CI tests,8 cache tests,18 chart-completion proofs and7 page/runtime cases.
- Seven committed CLI synthetic fixtures passed: full plan/success audit; rejection of failed,cancelled,skipped,missing required gates,tampered plan and mismatched checkout.
- Web/Admin build and all14 API bundles passed. Initial sandbox Vite cache access was denied; authorized rerun passed. No source/test weakening was used.
- One pre-freeze local source-proof run rejected an edit made during validation (76/77); fresh stable stored and final runs each passed77/77. It was not presented as a passing gate.
- LocalNode24 is separate from officialNode22/Linux acceptance. No TypeScript/application source changed; official four compiler results follow.

## Official CI

- [Run41673654138](https://github.com/signal0verse/signalverse-main/actions/runs/41673654138)
- SHA: `a31d803d4396c31cf0d2c693e2a098114056db5d`; event `workflow_dispatch`; attempt1; branch `codex/ci-module-routing-20261103`.
- Job `Build web and API runtime`: **failure**.
- Actual step results: `{'success': 48, 'failure': 2, 'skipped': 44}`.
- Workflow/command inventory remains90 YAML steps,75 original command groups and87 rendered fragments. Timeout180minutes and isolated runner2CPU/4GiB remain unchanged. No assertion, original command, compiler/build/SQL prerequisite or final audit was removed.

- Official CI did not pass. No further code change, push or rerun was performed. This was an assertion failure, not the180-minute timeout. Job duration111minutes15seconds; failed gate duration33minutes14seconds.
- All44 CI selftests passed. The557/557 retained scanner/navigation cases passed, including the exact formerly failed historical Linux test. The original unchanged producer also successfully packaged exact HEAD within its8MiB limit in Linux; diagnostic bytes were discarded.
- The failed gate ran1295 cases:1292 passed,3 failed,0 cancelled/skipped. All18 direct chart-completion proofs and the five original source/negative proofs listed below passed inside that failed gate. These partial successes do not turn the gate green.
- All four original compiler comparisons and subsequent official builds were NOT_RUN/skipped. No zero-introduced-diagnostics or complete build acceptance is claimed. Local builds remain separate evidence.
- The final always-audit correctly rejected required gate_038. No gate was bypassed or weakened.

### Exact three failing assertions

| File / line | Test | Actual failure |
|---|---|---|
| `scripts/spot-external-exit-proof-scope-test.mjs:35` | actual current runtime changes only the stricter native proof and preserves every other Git blob/mode | raw production-ci.yml no longer equals frozen predecessor workflow |
| `scripts/spot-release-history-scope-test.mjs:39` | committed runtime, strategies and original producer/workflows retain every predecessor blob and mode | raw production-ci.yml no longer equals frozen predecessor workflow |
| `scripts/analysis-native-ux-release-test.mjs:108` | Telegram view and documentary tree each use one checked operation with identical output | telegramView beforeScans actual=6 expected=4; afterScans=2 |

The first two consumers still read the current production-ci bytes directly and compare them with their frozen predecessor workflow, despite the independently validated CI successor. Their complete tree and unchanged-authority assertions remain intact; no expected workflow or allowlist was changed to mask the mismatch. The third test expected four predecessor source-witness scans and observed six, while the current checked operation remained two. That additional predecessor-path work is measured; its exact trace still requires a narrow follow-up. Do not raise the expected count or delete the assertion.

Required follow-up, not implemented: connect the two specific historical source reads to the exact CI-successor proof while retaining raw-current negatives, then trace/remove redundant complete-witness work using the existing checked-operation architecture without changing the original4-to-2 assertion. Fresh full exact-SHA CI remains mandatory. No further push or rerun is authorized by this stopped follow-up.

Direct chart proofs passed:
- regression: six latest events cannot erase other actual families or older retained observations
- catalog is input-order independent, same-bar levels remain one correlated event and report is immutable
- selection brings exactly one omitted real event into view, not all indicators or a new vote
- retired zones are auditable but never admitted back into current buy geometry
- forming, foreign interval or missing exact harmonic geometry cannot become selectable patterns
- real catalog buttons forward the exact source ID and never call analysis or trading
- daily and weekly context reuses the actual native structure authority and full-input Supertrend recurrence
- weekly trend times belong to weekly candles, never a relabelled daily series
- invalid native context rejects the complete frame review rather than drawing invented levels
- nearest contextual levels are real signed-side values and never fabricated buy allocations
- missing optional ports remain unavailable rather than fabricated or substituted from another timeframe
- context and catalog never rewrite the actual daily verdict, entry prices, votes or financial report
- missing, tampered or foreign snapshots explain price-only fallback instead of silently claiming analysis
- native-host SVG sizing is explicitly bound to measured scene dimensions, preserving icon CSS
- financial execution, strategy, scanners, workflow, Guard and native App are untouched
- normal standalone daily refresh saves the same native weekly/daily evidence instead of losing it on history polling
- selected historical pattern remains the exact picker value, never a misleading fallback to the first FVG
- identical history JSON retains chart instance inputs; changed identity, evidence or verdict never uses the old report

Original source/negative proofs passed:
- all five original native UI gate tests and assertions remain byte-identical
- one-read historical source operation rejects corruption in either full validator
- every direct Telegram operation rejects corruption in either complete validator after success
- all original historical validator statements and all five original tests remain exact
- complete historical operations reject changed raw source after a successful warm proof

Authoritative log SHA256: `ebd102f956c5ba87a5e7b156d9fb767b3fbb1c0863e80d18ffac1155fd39914c`.

Failed/cancelled workflow steps:
- Test Spot setup display and complete detail preservation offline: failure
- Require every selected and mandatory gate to succeed: failure

Every actual job step:

| Step | Result |
|---|---|
| Set up job | success |
| Check out repository | success |
| Set up Node.js | success |
| Test isolated runner routing and exact predecessor preservation | success |
| Install dependencies | success |
| Plan exact-source module and dependent tests | success |
| Test CI routing, checked Git reads and source preservation | success |
| Test retained Spot scanner and independent chart workspace navigation | success |
| Install isolated admin runtime dependencies | success |
| Test independent admin auth and live transport offline | success |
| Test partner host context and unchanged Telegram authentication offline | success |
| Test owned worker cadence and closed scope offline | success |
| Test native and owned Futures freshness, final admission and closed scope offline | success |
| Test native Spot and Futures funding review offline | success |
| Test owned setup funding and closed successor scope offline | success |
| Test retained charts, origin clock and no queued writes offline | success |
| Test temporal context recovery and accurate identity errors offline | success |
| Test trade connection recovery and retained view offline | success |
| Prepare original build prerequisite (gate_017, 1) | success |
| Test technical pattern confirmation and separate Spot scalp workspace offline | success |
| Prepare original build prerequisite (gate_018, 1) | success |
| Test scanner-only Spot scalp horizon, costs and retained campaigns offline | success |
| Prepare original build prerequisite (gate_019, 1) | success |
| Test opt-in Spot scanner data, lifecycle and source preservation offline | success |
| Test real Futures pending analysis locks and preserved entry scope offline | success |
| Test permanent SignalVerse and owned Futures confirmation offline | success |
| Test expired-plan management and exact successor scope offline | success |
| Prepare original build prerequisite (gate_023, 1) | success |
| Test saved Spot completion and closed source scope offline | success |
| Test Spot Demo catalog search and closed source scope offline | success |
| Test all active plan Market access and closed source scope offline | success |
| Prepare original build prerequisite (gate_026, 1) | success |
| Test opt-in Spot allocation policy and frozen cohorts offline | success |
| Test SignalVerse app Spot allocation and immutable cycles offline | success |
| Prepare original setup prerequisite (gate_027, 1) | success |
| Test SignalVerse app Spot allocation and immutable cycles offline (continued) | success |
| Test Spot scanner final admission in disposable PostgreSQL | success |
| Test partner admin Futures feature authority offline | success |
| Test bounded Trade continuity and verified access offline | success |
| Test owned scanner access and scoped retirement offline | success |
| Test command receipt recovery without replay offline | success |
| Test MEXC automatic capital account evidence offline | success |
| Test selectable Futures universe and opt-in capital policy offline | success |
| Test Futures capital reservations in a disposable PostgreSQL cluster | success |
| Test Spot local logos and closed presentation scope offline | success |
| Test native SignalVerse Spot presentation preservation offline | success |
| Test Spot setup display and complete detail preservation offline | failure |
| Build reusable partner terminal (no activation) | skipped |
| Prepare original build prerequisite (gate_040, 1) | skipped |
| Test isolated internal paper and exact original UI parity | skipped |
| Test owner-reviewed Spot tutorial and closed release scope offline | skipped |
| Build full terminal candidate (no activation) | skipped |
| Prepare original build prerequisite (gate_043, 1) | skipped |
| Test owned native copy-trading without accounts or provider access | skipped |
| Compare original frontend and API diagnostics (gate_043) | skipped |
| Prepare original build prerequisite (gate_043, 3) | skipped |
| Typecheck standalone admin UI | skipped |
| Test MEXC native history accounting and closed scope offline | skipped |
| Test owned discovery admission feedback and closed scope offline | skipped |
| Test learning extraction without live services | skipped |
| Test GitHub event transport without live services | skipped |
| Test historical timing without live services | skipped |
| Test futures simulation exits without live services | skipped |
| Test futures simulation chronology without live services | skipped |
| Test futures simulation accounting without live services | skipped |
| Test futures simulation capital reservation without live services | skipped |
| Test versioned simulation analytics without live services | skipped |
| Test real execution faults with isolated transports | skipped |
| Test opt-in Futures Profit Protection without private services | skipped |
| Compare original frontend and API diagnostics (gate_056) | skipped |
| Test Futures Pro scheduler deadlines and failure rotation without services | skipped |
| Test manual-profit re-entry admission and closed successor scope offline | skipped |
| Test Futures Market Discovery (pure core, venue adapters, simulator, Demo list upkeep) without services | skipped |
| Test whale data and watchlist without live services | skipped |
| Test stablecoin engine (Binance spot, demo-only) without live services | skipped |
| Test stablecoin owner-confirmed manual rebalance (demo-only) without live services | skipped |
| Test stablecoin automatic parity rebalance cap and live status (demo-only) without live services | skipped |
| Test stablecoin market data collector (read-only, no trading) without live services | skipped |
| Test prediction market autonomous engine without live services | skipped |
| Install disposable SQL test runtime | skipped |
| Test durable entry claims in a new private PostgreSQL cluster | skipped |
| Test owned Spot LIMIT durable claims and CAS in disposable PostgreSQL | skipped |
| Test stablecoin settlement rollback and concurrency in disposable PostgreSQL | skipped |
| Test Profit Protection close ownership in disposable PostgreSQL | skipped |
| Test manual-profit re-entry serialization in disposable PostgreSQL | skipped |
| Test Whale Demo pipeline and transactions in disposable PostgreSQL | skipped |
| Test admin monitoring grants in a new private PostgreSQL cluster | skipped |
| Build web application | skipped |
| Bundle server API handlers | skipped |
| Verify expected artifacts | skipped |
| Require every selected and mandatory gate to succeed | failure |
| Post Set up Node.js | skipped |
| Post Check out repository | success |
| Complete job | success |

## Exact changed paths

- `.github/workflows/production-ci.yml`
- `HANDOFF.md`
- `docs/testing/ci-module-routing-2026-11-03.md`
- `scripts/analysis-chart-completeness-test.mjs`
- `scripts/analysis-page-evidence-test.mjs`
- `scripts/ci-checked-git-preload.mjs`
- `scripts/ci-checked-git-test.mjs`
- `scripts/ci-module-routing-test.mjs`
- `scripts/ci-module-routing.mjs`
- `scripts/ci-module-scope-test.mjs`
- `scripts/ci-program-test.mjs`
- `scripts/lib/analysis-native-ux-parity.mjs`
- `scripts/lib/ci-checked-git.mjs`
- `scripts/lib/ci-module-delta.json`
- `scripts/lib/ci-module-policy.json`
- `scripts/lib/ci-module-routing.mjs`
- `scripts/lib/ci-module-scope.mjs`
- `scripts/lib/ci-program-source.mjs`
- `scripts/lib/ci-program.mjs`
- `scripts/lib/ci-workflow-contract.mjs`
- `scripts/spot-swing-entry-info-test.mjs`

## Safety, cleanup and remaining limits

- Product paths src/api/server/admin,migrations,ops/deploy,Strategy,package files and release-artifact producer have zero task-created diff. The CI workflow itself is byte-identical to prior candidate418de61b; only CI/test/source-transport tooling and documentation changed.
- Own one-job runner214/containerci-a511236 automatically exited/was removed. Independent exact-container and GitHub registration checks passed. No other runner/container was removed. Main remained the frozen base.
- Previous Production runtime was last verified in the prior task as c161955239f24f151fed6a2a08dfcb8bef0e04ac; Production was not queried or mutated in this CI-only task. No current-runtime assertion or private-account execution/profit claim is made.
- No Production migration/database write/backup, worker start/enable, PP flag/profile/scanner/job/strategy/risk change, exchange call, order/position/SL/TP/close action occurred.
- This branch workflow_dispatch result is not exact-main/push release acceptance. Main promotion, any new release identity review, official artifact preparation/Guard and deployment remain separate future gates; none is performed here.

```text
MAIN_PUSH=NO
DEPLOYMENT=NO
ARTIFACT_CREATED=NO
GUARD_CREATED=NO
PRODUCTION_MUTATION=NO
WORKER_STARTED=NO
PP_FLAGS_CHANGED=NO
DATABASE_MUTATION=NO
EXCHANGE_ACTIONS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_CHANGES=0
TP_CHANGES=0
CLOSE_ACTIONS=0
```
