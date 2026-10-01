# Futures Profit Protection Phase 4 — implementation and PP-only release scope

## Metadata

- Date: 2026-10-01 (UTC evidence timestamps below)
- Task ID: futures-profit-protection-phase4
- Module: Standard Futures exit-only Profit Protection
- Mode: implementation, isolated/offline validation; owner-approved PP-only Git staging; Production read-only preflight
- Repository: signal0verse/signalverse-main
- Branch: codex/futures-profit-protection-runtime-20261001
- Starting commit / live runtime: 6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d
- Ending source commit: cdae6075886ba2d2cae3415f1241fa9510231bae
- Prepared release commit: c793099714c7787fb231e1963acd11c2560440ec (published feature branch, NOT on main)

## Objective / scope

Implement, test and safely release one deterministic full-position profit-giveback exit, shared Real/Demo/timestamped replay, without entry/SL/ONE TP/Spot/scanner/AI changes. Owner subsequently required a PP-only runtime tree and rejected unrelated pending main changes. No historical optimization is a release prerequisite.

## Actions taken / implementation / inspected and changed files

The complete canonical engineering snapshot below contains the exact per-file inventory, architecture, thresholds, native evidence sources, checks and failure boundaries. Original dirty work and reviewed full main work remain preserved. The owner subsequently approved preserving main and staging the exact PP-only tree as a new main-descendant commit. That commit and a retained-main branch were published. The attempted main promotion was rejected because another contributor advanced main during the operation. No main promotion, Production migration, worker activation or release was performed by this task.

## Git status / commits

- Main-based source archived on codex/futures-profit-protection-20261001: 2c7ad48c7e5d9b5a7454b6cb60f8fbcf8eb502c6 -> 070fbad6d401a03a1f116ade1a1a0f5c9eda2ad1; [draft PR #189](https://github.com/signal0verse/signalverse-main/pull/189), NOT PP-only deployment eligible.
- PP-only source: b5e1f9ac348b4a1538f7dc07a6b9dff1a5f7d1f7 -> 27421c458e420cc11b0d4ab9ce230722dc6e4eb6 -> cdae6075886ba2d2cae3415f1241fa9510231bae. Published feature branch; clean worktree.
- Retained prior main: `codex/main-retained-before-futures-pp-20261001` points to exactly 2ac087e618cbde08ca4d46ab3d541c0add31f06b; remote verified.
- Prepared release: `codex/futures-profit-protection-release-20261001` points to exactly c793099714c7787fb231e1963acd11c2560440ec; remote verified. First parent 2ac087e618cbde08ca4d46ab3d541c0add31f06b; second parent cdae6075886ba2d2cae3415f1241fa9510231bae; tree 32d4acfa8c93fa291a1f1dbab55f95eb9d763ba1 equals the PP-only source tree exactly.
- Concurrent remote main at 2026-10-01T10:20:59Z: 6789a2e9457f0c927b8b7ac1dc5f79ef3748dbba. Main push of c793099... was rejected, not forced. No rebase, squash, amend or history rewrite.
- PP-only branch CI [36847683958](https://github.com/signal0verse/signalverse-main/actions/runs/36847683958): workflow_dispatch, exact cdae607...; SUCCESS, completed 2026-10-01T10:17:02Z, single job `Build web and API runtime` successful, 38/38 steps successful, zero failed steps. This is NOT the official main/push release gate.
- Main-based PR CI [36846736042](https://github.com/signal0verse/signalverse-main/actions/runs/36846736042): success, exact 070fbad..., pull_request. No release acceptance claimed.
- Initial PR CI [36845651680](https://github.com/signal0verse/signalverse-main/actions/runs/36845651680): failure, exact 2c7ad48..., two historical source-parity assertions; later checks skipped. Subsequent exact-delta handling and tamper rejection are documented below.

## Remaining issues / recommended next step

MAIN PROMOTION BLOCKED BY CONCURRENT CHANGE. Obtain a new owner decision on retaining the new main and preparing a fresh main-descendant commit with the same tested PP-only tree; do not substitute a new release identity silently. Then exact main/push CI, immutable artifact preparation and independent exact-SHA/digest Guard approval are required. Verified existing backup, additive migration/schema cache, official release and explicit worker installation/health/OFF checks remain gates. No manual alternate application install or Guard/workflow bypass is permitted. No automatic Real activation or test trade.

## Safety

Deployment=NO; Production code/config writes=NO; database changes=NO; exchange actions=0; orders=0; positions changed=0; native SL/ONE TP modified=NO; partial exit=NO; real feature enabled=NO. Independent runtime marker/symlinks/process and unchanged service evidence are in the report. No private exchange lifecycle or profitable fill was tested or claimed.

## Authorized release-staging result and exact blocker

The owner authorized preserving prior main while staging an exact PP-only release tree. This superseded only the earlier Git-staging gate; it did not waive CI, artifact identity, independent Guard authorization, backup or deployment gates.

Commands/results (from the clean isolated PP-only worktree):

```text
git rev-parse 'cdae6075886ba2d2cae3415f1241fa9510231bae^{tree}'
=> 32d4acfa8c93fa291a1f1dbab55f95eb9d763ba1
git status --short
=> empty
git ls-remote origin refs/heads/main
=> 2ac087e618cbde08ca4d46ab3d541c0add31f06b before writes
git push origin 2ac087e618cbde08ca4d46ab3d541c0add31f06b:refs/heads/codex/main-retained-before-futures-pp-20261001
=> new retained branch; remote readback exact
git commit-tree 32d4acfa8c93fa291a1f1dbab55f95eb9d763ba1 -p 2ac087e618cbde08ca4d46ab3d541c0add31f06b -p cdae6075886ba2d2cae3415f1241fa9510231bae -m <reviewed release-staging description>
=> c793099714c7787fb231e1963acd11c2560440ec
git diff --exit-code cdae6075886ba2d2cae3415f1241fa9510231bae c793099714c7787fb231e1963acd11c2560440ec
=> exit 0; identical complete trees
git merge-base --is-ancestor 2ac087e618cbde08ca4d46ab3d541c0add31f06b c793099714c7787fb231e1963acd11c2560440ec
=> exit 0
git push origin c793099714c7787fb231e1963acd11c2560440ec:refs/heads/codex/futures-profit-protection-release-20261001
=> new feature branch; remote readback exact
git push origin c793099714c7787fb231e1963acd11c2560440ec:refs/heads/main
=> rejected (fetch first); stopped immediately
git fetch --no-tags origin main
=> origin/main advanced 2ac087e... -> 6789a2e...
git merge-base origin/main c793099714c7787fb231e1963acd11c2560440ec
=> 2ac087e618cbde08ca4d46ab3d541c0add31f06b
```

The two concurrent commits are:

- 2f2703a5c25dc970fe5b50532bfd8ff61ff4fc24 — Integrate approved Trade onboarding, top market catalog and member watchlist.
- 6789a2e9457f0c927b8b7ac1dc5f79ef3748dbba — Pin approved market UI and verify unchanged Spot commands in CI (commit timestamp 2026-10-01T18:19:12+08:00).

The new delta contains 24 changed paths, including workflow/tests, App, onboarding, market/watchlist, news, Spot UI and terminal files. Its overlap with the scoped PP files makes an automatic ordinary merge inappropriate. The rejected push did not update main. No extra integration/rewrite was attempted. No CI exists for prepared c793099... at the final query. The successful cdae607... branch CI does not substitute for the missing exact main/push gate.

Final read-only Production verification at **2026-10-01T10:21:31Z**:

| Evidence | Result |
|---|---|
| deployed-sha marker | 6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d |
| app release path | /opt/signalverse/releases/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d |
| admin release path | /opt/signalverse-admin/releases/6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d |
| signalverse.service | active; PID 2919736; NRestarts 0 |
| signalverse-admin.service | active; PID 2919732; NRestarts 0 |
| signalverse-observer.service | active; PID 2919729; NRestarts 0 |
| postgrest.service | active; PID 1960930; NRestarts 0 |

These PIDs/counts match the earlier read-only checkpoints. No service command changed runtime. Production orders, private positions and balances were not queried to manufacture a zero-activity claim; the zero figures above mean **zero actions performed by this task**, not a claim that the live system performed no natural trading.

FINAL STATUS: **PP-ONLY RELEASE PREPARED; MAIN PROMOTION BLOCKED BY CONCURRENT MAIN CHANGE; DEPLOYMENT NOT PERFORMED.**

## Canonical engineering evidence

The following is the implementation-time snapshot committed in the candidate. Its original "main remained 2ac... / separate Git agreement needed" statements are superseded by the timestamped release-staging result above, not rewritten as successful deployment evidence.

# Futures Profit Protection Phase 4 — controlled operational candidate

Date: 2026-10-01. Report authored after offline engineering checks, NOT a
Production execution/profitability acceptance report. No historical optimization
or further research prerequisite is imposed.

## Executive result

The requested deterministic exit-only feature is implemented. The first
main-based branch `codex/futures-profit-protection-20261001` is preserved at
`070fbad6d401a03a1f116ade1a1a0f5c9eda2ad1`. Following the owner's explicit scope
decision, ONLY `codex/futures-profit-protection-runtime-20261001`, based on actual
runtime `6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d`, is a deployment candidate.
Production deployment is NOT performed.
Existing private/untracked contributor work in the original checkout is preserved.
Publication/CI coordinates are recorded in the final AI-Log addendum, not guessed
in advance. The executable candidate does not alter Entry, Direction, accepted SL,
single TP, Decision Engine, Spot, scanner, Fast Trader or Prediction algorithms.

## Architecture / files

- Pure policy and executable timestamped replay:
  `api/_shared/futures-profit-protection.ts`.
- Durable injected lifecycle:
  `api/_shared/futures-profit-protection-lifecycle.ts`.
- Shared close-admission / independently confirmed flat ordering:
  `api/_shared/futures-profit-protection-execution.ts`.
- Existing native adapters, API status/opt-in/admin kill switches, settlement and
  read-only reconciliation integration: `api/copytrade.ts`.
- Immutable accepted basis, service-only state, close ownership and atomic Demo
  settlement: `migrations/futures_profit_protection.sql`. Additive, no backfill,
  both Real/Demo switches default OFF, original basis cannot be fabricated later.
- Dedicated worker `server/futures-profit-protection/worker.mjs` and proposed
  operator-installed `ops/signalverse-futures-profit-protection.service`. Existing
  app user/env; native adapters imported from the exact compiled release, not copied.
  No new entry mechanism, scanner job, Guard/coordinator/security modification.
- UI `src/app/FuturesProfitProtection.tsx` and standard Futures-only placements in
  `src/app/App.tsx`; help knowledge only in `api/analyze.ts`.
- Tests: `scripts/futures-profit-protection-{test,adapters-test,ui-test,sql-test,scope-test}.mjs`.
  Existing fault/AST fixtures were extended to model the approved optional path;
  original TP/SL/order size/settlement outcome assertions remain. The Gate scope
  test now checks exact legacy payload bodies inside the new orchestration and
  pins source preservation to reviewed current main, while its historical native
  candle/lifecycle comparison remains fc5. Earlier approved Spot changes are not
  misreported as a new Futures regression.
- `.github/workflows/production-ci.yml`: only new isolated test/type/SQL steps;
  existing official release/immutable artifact/Guard workflows unchanged.
- Docs: `docs/futures-profit-protection.md`, `HANDOFF.md`, `docs/AI_HANDOFF.md`,
  `TRADING_STRATEGY.md`, this report. No unrelated files staged.

Fast Trader Smart Exit is NOT reused: it has environment-specific policy and
different monitoring/execution assumptions. Existing canonical economics math,
native full-close adapters, position readers, original execution-attempt evidence,
reconciliation and owned protection IDs are reused instead.

## Initial policy — operational parameters, not optimal thresholds

Central `PROFIT_PROTECTION_CONFIG`: ARM at cost/reserve-adjusted 1R, three distinct
observations spanning four seconds. Peak moves only favorably. Giveback must be
both at least 0.5R and 30% of gross favorable peak, sustained for three observations
over four seconds, with estimated retained net at least 0.25R. Fee reserve 0.06%
per leg plus 0.10R additional buffer. Known signed funding is included; unavailable
funding is not zero and prevents ARM/CLOSE. Original R is actual accepted entry to
original accepted SL times base quantity, not leverage or a subsequently moved SL.

Native full-size LONG bids / SHORT asks produce an executable VWAP estimate.
Quote age at most three seconds, spacing at least one second; gaps over six seconds
reset confirmations. No last/mark/mid substitution, future bar or invented OHLC
path. Simulator event-tape replay uses the identical function; the existing OHLC
Simulation Lab UI/runtime is deliberately not rewritten or presented as a new
verified historical PP mode. Estimated profit does NOT guarantee a profitable fill.

Dedicated monitoring targets two seconds with no overlapping loop and bounded
round-robin processing, independent of scanner/browser. Native observation cycles
are capped at 24 per venue per rolling minute/process. Backlog/API errors can reduce
actual cadence; stale stored UI values are labelled and cannot substitute for
fresh confirmations. This is not a rate-limit guarantee across unrelated processes.
Production's current lazy API loader was inspected: a worker really is required,
not merely a top-level timer in a lazily loaded HTTP handler. API requests never
bootstrap a duplicate worker. Unit source presence is not worker activation proof.

## Execution safety / state

DISARMED → ARMED → EXIT_PREPARED → EXIT_SUBMITTED → UNKNOWN → FLAT_CONFIRMED →
CLEANUP_PENDING → RECONCILED. Native/manual exits can win before policy admission.
CAS and single-use durable close ownership elect one submitter. Enrolled existing
manual/observer exits share admission; unenrolled legacy exits retain their original
native payload path. Missing migration cannot invent an enrolled epoch.

Binance uses its existing full opposite-side reduce-only market path. Gate retains
its native signed full-size IOC/reduce-only semantics. MEXC retains close-side codes,
native contract volume and exact position ID. Admission compares the persisted
MEXC epoch ID too, not merely a newly fetched position ID with matching price/size.
Actual adapter payload/fill bodies are
preserved. Independent native quantity/epoch reads, not HTTP success or order fill
alone, authorize FLAT. Only then may owned SL/TP IDs be cleaned up, with independent
owned-order absence readback. No partial TP or replacement/native SL/TP placement
is introduced by PP. No position/protection modification occurs on kill-switch OFF.

Partial, timeout, lost persistence ack and SUBMITTED/PREPARED restart retain a
durable non-expiring hold, never repeat a market close. A stale quote after native
preflight cannot obtain new admission. A reconciler's early FLAT may be enriched
with the same submitter's exact late fill/reference; it cannot overwrite a known
order/fill or transition back to SUBMITTED. Uncorrelated disappearance/timeout is
not falsely labelled a PP-caused trade. Disabling prevents new durable admission;
it cannot recall an already admitted/in-flight order. New position opt-in retains
existing owner/auth/VIP/test-grant/mode/Demo-credit policy; emergency OFF is available.

Demo managed settlement locks the trade and position, records a canonical reason
and credits existing gross virtual settlement exactly once. Reported modeled fees
remain separate as in current Demo economics; no new balance policy. Real realized
economics uses existing native reconciliation/funding queues, not quote estimates.
UI shows persisted Entry/original SL/ONE TP/R/current/peak/giveback, decision,
trigger/reference/fill/FLAT and canonical PROFIT_PROTECTION, with source-aware
pending/estimated economics and stale-monitor warning.

## Actual verification

Host Node v24.19.0, PostgreSQL 18.6; GitHub target runtime is Node 22. Local evidence
is not represented as Node-22 CI or private exchange execution.

| Check | Actual result |
| --- | --- |
| PP policy/lifecycle/native adapter/UI render | 84/84 PASS, including persisted MEXC epoch admission and parity tamper rejection |
| Fresh disposable PostgreSQL | 16/16 PASS; stopped and removed |
| Runtime-isolated Futures regression suites (16 files, including full whole-decision suite) | 916/916 PASS |
| Real execution faults | 119/119 PASS; final combined fault/funding/Gate rerun 242/242 PASS |
| Gate/MEXC native faults | 32/32 internal checks PASS |
| Binance final funding | 11/11 PASS |
| New-module strict typecheck | PASS |
| Frontend runtime-baseline comparison | 60 baseline / 60 candidate; zero introduced (earlier main-based check was 62/62) |
| API baseline comparison | 30 baseline / 30 candidate; zero introduced |
| Runtime-isolated Web production build | PASS, 2032 modules; existing large-chunk warning |
| Admin production build | PASS, 1713 modules |
| API bundles | 14/14 PASS, target node22 |
| Worker JS syntax | PASS |
| Unit Git source CR/BOM | LF / CR=0, no BOM; installed Linux unit not yet verified |
| Full-terminal/paper/legacy UI parity after exact PP-delta validation | Main-based local 36/36 PASS; isolated historical boundaries included in 98/98, corresponding isolated branch CI step PASS |
| Lint | NOT CONFIGURED |
| Live worker/systemd verification | NOT PERFORMED |
| Real/Demo production lifecycle/order test | NOT PERFORMED |

Demo LONG/SHORT end-to-end lifecycle is injected/offline plus actual transactional
SQL settlement, NOT an exchange Demo trade. UI checks render the actual React
component in both languages and modes, not just source text. Native adapter tests
AST-extract actual functions with all network/DB substituted; no application
bootstrap/env/private account is loaded. Tests cover noise, rising profit without
exit, small profit, rebound, stale/out-of-order/duplicates, native/manual wins,
concurrent workers, partial/timeout/restart/DB error, kill switch, flat-first cleanup
and early-flat/late-fill journal races. Global project typecheck retains baseline
diagnostics; do not claim the whole repository is type-clean.

## Read-only Production / deployment boundary

At 2026-10-01T09:23:36Z app/admin symlinks independently resolved to
`6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d`; main/admin/observer/PostgREST were active,
restart counts zero. Main PID 2919736, admin 2919732, observer 2919729, PostgREST
1960930. Schema read-only transaction confirmed the intended current database,
economics present, new PP control/close-intent tables and accepted basis/reason
columns absent. No private trade/account rows or exchange credentials inspected.

Final read-only recheck at 2026-10-01T09:52:23Z: deployed-sha marker, both release
symlinks and the main process cwd all equal `6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d`.
All four service PIDs/restart counts are unchanged from the earlier checkpoint;
all remain active. No worker unit installation or Production write occurred.

Current main `2ac087e...` is ahead of active runtime with previously published
CrossVerse/Spot UI/news work in 26 files. Our scope preserves current-main Spot
logic, but deploying the whole current-main tree would also ship inherited pending
work. This broader runtime change must be explicitly accepted, not silently hidden
under a Futures-only label. No main promotion, official release, Guard manifest,
backup/migration/schema refresh, worker installation or service restart is claimed.

Remaining official route: settle inherited release scope; exact-main normal CI on
Node22; one retained immutable artifact and independent byte verification; a NEW
exact SHA/digest Guard authorization; existing verified backup and additive
migration/schema cache readiness; official release; explicit normal operator
worker installation; read-only exact runtime/process/service/health/OFF verification.
No alternate app installation, approval reuse, Guard weakening or test trade.

## Manual checklist AFTER authorized rollout only

1. Confirm worker healthy/fresh and Real global switch remains OFF at rollout.
2. Owner enables Real deliberately and opts in ONE qualifying standard full
   single-TP position with original accepted evidence; no forced entry is needed.
3. Observe DISARMED → ARMED; compare original R, peak/giveback and fresh timestamps.
4. Confirm CLOSE_PROFIT_PROTECTION, exact actual fill/reference, independent FLAT,
   owned cleanup and canonical close reason; UNKNOWN means no retry, not success.
5. Read final source-aware realized economics separately. Disable PP for emergency
   new-admission stop; native SL/ONE TP remain untouched.

## Safety / limitations

Historical improvement/profitability proven: NO. Optimal parameter claim: NO.
Native private lifecycle proof: NO. No funds/order/position test manufactured.
Production changes made by this task: NONE at report authoring.
Orders=0; positions changed=0; exchange actions=0; credentials changed=NO;
native SL/ONE TP changed=NO; partial exit introduced=NO; AI exit=NO;
Guard/security/coordinator changed=NO; database changed=NO; deployment=NO.

The rollout is pending actual release prerequisites, not historical statistical
validation. Complete Git/CI/publication state must be verified in the final
sanitized AI-Log addendum and owner response.

## Owner-requested pre-deploy scope inventory

Initial source candidate `2c7ad48...` versus pinned runtime changes exactly 46
paths: 24 PP implementation paths plus 22 other inherited paths; four of the PP
paths contain both inherited and PP hunks. Final hardening touches three more test
paths, two already in the inherited inventory and one new helper. The unique union
is therefore 47 (verified by sorted Git paths), NOT 49 or silently still 46.
Full publication is rejected: unrelated functional news/Spot/partner changes
exist. Owner instruction requires a runtime-based PP-only reconstruction before
any deployment, preserving the already-published source work and history.

| Required PP path | Reason / scope |
| --- | --- |
| `.github/workflows/production-ci.yml` | Isolated PP tests and transactional SQL checks only |
| `HANDOFF.md` | PP implementation/safety handoff; mixed inherited documentation |
| `TRADING_STRATEGY.md` | Exit-only dated amendment, original strategy unchanged |
| `api/_shared/futures-profit-protection.ts` | Pure shared policy/immutable risk/executable replay |
| `api/_shared/futures-profit-protection-lifecycle.ts` | Durable CAS/state/race/restart orchestration |
| `api/_shared/futures-profit-protection-execution.ts` | Single-use native full-close admission and independent FLAT |
| `api/analyze.ts` | PP help description only; inherited partner help hunk excluded from rollout |
| `api/copytrade.ts` | Standard Futures opt-in integration, native monitoring, adapters and reconciliation |
| `docs/AI_HANDOFF.md` | PP release gates; mixed inherited documentation |
| `docs/futures-profit-protection.md` | Operational parameters/architecture/manual checklist |
| `migrations/futures_profit_protection.sql` | Additive durable state, close ownership and OFF defaults |
| `ops/signalverse-futures-profit-protection.service` | Independent open-position worker bootstrap, not scanner |
| `reports/futures/futures-profit-protection-phase4-2026-10-01.md` | Actual evidence and pending deployment scope |
| `scripts/futures-gate-observer-native-test.mjs` | Existing native outcome assertions plus reviewed wrapper parity |
| `scripts/futures-profit-protection-adapters-test.mjs` | Actual extracted native adapter/funding/depth/cleanup tests |
| `scripts/futures-profit-protection-scope-test.mjs` | Existing-function/engine preservation and baseline type checks |
| `scripts/futures-profit-protection-sql-test.mjs` | Fresh private local PostgreSQL transaction/race tests |
| `scripts/futures-profit-protection-test.mjs` | Policy/Demo/replay/restart/ownership and parity rejection tests |
| `scripts/futures-profit-protection-ui-test.mjs` | Actual React rendering in two modes/languages |
| `scripts/futures-real-execution-fault-test.mjs` | Durable-close DB fixture for approved optional orchestration |
| `scripts/lib/futures-pure-test-context.mjs` | Isolated actual pure adapter module, no API bootstrap |
| `server/futures-profit-protection/worker.mjs` | Dedicated exact compiled-adapter host with explicit worker flag |
| `src/app/App.tsx` | PP display/toggles/polling only; inherited unrelated UI hunks must be excluded |
| `src/app/FuturesProfitProtection.tsx` | State/peak/giveback/kill switch/canonical close reason UI |

Three additional PP-only test paths: `scripts/full-terminal-contract-test.mjs`,
`scripts/terminal-view-parity-test.mjs`, `scripts/lib/futures-profit-protection-parity.mjs`.
The first two are mixed with inherited parity revisions. In the final isolated
candidate the helper demands equality of the ENTIRE current source to immutable
commit `27421c458e420cc11b0d4ab9ce230722dc6e4eb6` (which already includes MEXC epoch
hardening), then returns the pre-feature `6e3cef7...` source for historical
comparison. It does not waive arbitrary changes. A runtime tamper test rejects
unrelated Spot source edits.
Initial PR CI `36845651680` failed two old byte-parity assertions at the required
PP display addition; later steps were skipped, NOT accepted. Those exact approved
delta boundaries were integrated, all 36 affected checks rerun locally green.

| Inherited non-PP-only path — exclude from deployment | Reason |
| --- | --- |
| `api/_shared/news-language.ts` | Seven-language news contract |
| `api/news.ts` | Translation/language/cache/deadline behavior |
| `docs/CROSSVERSE_PLAN_NAVIGATION_2026-10-01.md` | Partner plan navigation |
| `docs/CROSSVERSE_TRADE_STRUCTURE_PREVIEW_2026-09-30.md` | Partner Trade workspace preview |
| `docs/FULL_CUSTOMER_TERMINAL_CANDIDATE_2026-09-29.md` | Earlier terminal candidate documentation |
| `scripts/news-language-test.mjs` | Non-PP news tests |
| `scripts/paper-transport-test.mjs` | Non-PP internal Spot transport tests |
| `src/app/components/TradingShell.tsx` | Partner shared navigation/Back control |
| `src/app/host/customer-host.tsx` | Partner route/language/plan types |
| `src/terminal/full-mount.tsx` | Partner plan screens/routing/paper transport |
| `src/terminal/full-route.ts` | Partner feature route changes |
| `src/terminal/full-terminal.css` | Partner skin/plan layout |
| `src/terminal/market-languages.ts` | Market/news localization |
| `src/terminal/mount.tsx` | Partner market/analysis navigation |
| `src/terminal/paper-mount.tsx` | Partner Spot/demo transport integration |
| `src/terminal/paper-transport.ts` | Internal Spot virtual command transport |
| `src/terminal/plan-navigation.tsx` | Partner plan/feature screens |
| `src/terminal/plan-policy.ts` | Partner plan route policy |
| `src/terminal/spot-demo.tsx` | Partner-owned Spot Demo workspace |
| `vite.full-terminal.config.ts` | Earlier terminal packaging |

The two remaining inherited-only paths counted above are the pre-PP changes to
`scripts/full-terminal-contract-test.mjs` and `scripts/terminal-view-parity-test.mjs`:
their unrelated localization/host baseline revisions are excluded; only exact
PP delta handling is required. Thus the original 46-path union is fully accounted
for, with mixed paths explicitly separated at hunk level, not shipped wholesale.

## PP-only reconstruction / actual release blocker

The 27 required PP paths above (24 initial plus three exact-delta parity paths)
were reconstructed from pinned live runtime. App changed only 18 lines of PP
imports/types/card/toggles/polling/close-reason presentation; analysis help adds
only the PP description. Native news, all partner/Spot/terminal files and the
older partner-help paragraph remain byte-identical to runtime, with no PP source
dependency on the omitted localization/plan files. Incoming conflicting HANDOFF
and test-baseline hunks were resolved to retain runtime contents plus PP only.
No old source branch/history was rewritten or removed. Disposable SQL 16/16,
PP+historical UI boundaries 98/98, full Futures regressions 916/916, Web/Admin/API
builds and zero introduced diagnostics were reverified on this separated tree.

The existing official prepare/release workflows require an exact successful
**main/push** CI and target ancestry on main. The runtime-based candidate diverges
from current main at `6e3cef7...`; pushing it directly to main is not fast-forward.
A PR merge that automatically keeps main's pending files would violate the owner's
PP-only runtime instruction. No force push, alternate artifact, manual application
installation, Guard bypass or unrelated source rollback is authorized implicitly.
Main remains `2ac087e...`. A separately agreed release-staging Git operation that
preserves pending main work while making the PP-only tree eligible for the official
main/push route is needed BEFORE exact artifact/Guard/backup/migration/deployment.
The PP-only branch may be validated by normal branch CI; that is not main/push
release acceptance. Report this concrete Git/release gate, not a research blocker.
