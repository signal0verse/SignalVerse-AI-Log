# Futures Profit Protection — latest-main preservation and source promotion

## Metadata

- Date: 2026-10-01; evidence timestamps UTC, owner timezone Asia/Kuala_Lumpur (UTC+8).
- Module: standard Futures opt-in Profit Protection, source-only promotion.
- Repository: signal0verse/signalverse-main.
- Candidate branch: codex/futures-profit-protection-latest2-main-20261001.
- Initial owner-provided main: 6789a2e9457f0c927b8b7ac1dc5f79ef3748dbba.
- Final preserved latest-main base: 8a3524bdf595b4883c0b2fd9e46df8d136be90d6.
- Proposed exact release/source SHA: 9de1fb13966bb4b2c76dc8efa6a21334d86aacdf.
- Single parent: 8a3524bdf595b4883c0b2fd9e46df8d136be90d6.
- Proposed tree: 9a74573baa9d61bb2e3cb815e99ce89ad72ca11c.
- Final source state: exact candidate CI SUCCESS; normal main fast-forward succeeded
  and was read back; automatic exact main/push CI SUCCESS. STOP before deployment.

## Executive result and authorization

The owner explicitly required preserving newest main and ADDING only already-reviewed
PP changes, not restoring an older runtime tree. Current task stops after exact
source CI/main promotion. Production deployment, release preparation, Guard approval,
migration, worker activation, Real opt-in and order/position actions are outside scope.

**SOURCE PROMOTION + EXACT CI PASS — STOPPED BEFORE PRODUCTION DEPLOYMENT.**
Remote main finally reverified at 2026-10-01T11:09:52.7551734Z is exactly
`9de1fb13966bb4b2c76dc8efa6a21334d86aacdf`. Current source is latest main PLUS
approved PP, not an older replacement tree. This is source/CI acceptance only:
the PP worker is not activated and Real PP is not enabled by this task.

Initial main was preserved exactly on remote branch
`codex/main-retained-before-futures-pp-latest-20261001` at
`6789a2e9457f0c927b8b7ac1dc5f79ef3748dbba`, with independent remote readback.
During its first candidate CI, main advanced to documentation-only
`8a3524bdf595b4883c0b2fd9e46df8d136be90d6`. Only HANDOFF.md and docs/AI_HANDOFF.md
gained release receipts. The immediate pre-push check stopped BEFORE any main push.
This newest main was also retained exactly and independently read back on
`codex/main-retained-before-futures-pp-8a3524b-20261001`.
The owner explicitly required newest-main preservation, so the PP delta was
reconstructed once more on this additive docs-only base, preserving both receipts.
The earlier PP-only runtime/staging branches remain preserved, not used as the new
release identity. Prior main/race evidence remains in the earlier dated Phase4 report;
it is not rewritten as a successful promotion.

## Reconstruction method / no lost main work

A new isolated worktree started at the exact newest-main base. Only reviewed PP
implementation/hardening deltas `2c7ad48...` and `070fbad...` were applied without
creating an ordinary merge. The resulting source was committed as ONE new commit,
with newest main as its sole parent. No rebase, amend, squash, force push, existing
commit modification or main-tree replacement occurred. The first candidate remains
preserved at `178d7260ab07c0e80a457577ffe3d65264b01739`; it was never promoted to main.
The final candidate differs from it only in BOTH preserved upstream receipt docs,
PP report metadata and three exact baseline constants in static tests. All approved
PP runtime/application/SQL/worker bytes are identical; new exact-SHA CI was required.

The two latest upstream commits remain in ancestry:

- 2f2703a5c25dc970fe5b50532bfd8ff61ff4fc24 — onboarding / market catalog / member watchlist.
- 6789a2e9457f0c927b8b7ac1dc5f79ef3748dbba — market UI pin / Spot command CI preservation.

Conflict handling was limited to documentation and static parity tests:

- HANDOFF retained BOTH the full newest-main entries and the PP section.
- Full-terminal parity retained the exact approved top-200 picker assertion AND the
  PP delta checker. No action/engine assertion was excluded or weakened.
- The helper reverses eight exact UI hunks obtained from immutable reviewed PP
  commits; the result must equal ALL newest-main App source. An unrelated Spot
  mutation still fails. Thus market/watchlist/onboarding changes cannot silently vanish.
- API/native PP source remains identical to reviewed 070fbad. Other runtime modules,
  SQL migration, worker/unit and PP component also match those reviewed blobs exactly.
- Scope/type checks now use exact newest main as baseline, not stale 2ac or old runtime.

Independent committed-tree proof (read-only `git ls-tree -r` mode/type/blob mapping):
**689 non-PP tracked files unchanged**, no deleted paths, direct parent equals latest
main, exact 27 approved delta paths, all executable PP files equal the first passed
candidate, zero lines removed from either new upstream receipt document. Git's native
clean/diff contract is used so Windows CRLF checkout conversion does not create a
false byte-level failure against LF blobs. An initial local raw-buffer check failed
on that EOL mismatch; it was replaced BEFORE CI with the canonical Git comparison,
not with a feature exclusion. Exact approved UI hunks and full adapter source checks
remain separate and fail-closed.

The following newest-main paths are byte-identical to base: ALL `src/terminal/`,
SpotWaitDetailsModal, customer-host, api/coins, api/news, native news translation,
and all other paths outside the 27 PP inventory. App retains all latest-main text
after reversing only the eight approved PP hunks. All existing executable analysis
functions remain equal; only one PP help paragraph was added.

Decision Engine, Risk, economics core, discovery/scanner, Prediction and stablecoin
modules are unchanged. Of 391 existing copytrade functions, only the same 11 approved
PP integration functions differ; other Spot/Fast Trader/scanner functions stay intact.
Native original full-close payload bodies, accepted entry/direction/SL/ONE TP,
credit/risk/mode policies and PP OFF defaults are preserved.

## Exact latest main → proposed release inventory

27 paths; 2374 insertions / 24 deletions inside approved PP paths; ZERO path deletions.
The inventory equals the previously approved PP inventory exactly. The final CI
commit is frozen: no source edits will be made after CI dispatch to disguise a failure.

| Path | PP-only reason |
|---|---|
| .github/workflows/production-ci.yml | Add the already-reviewed PP policy/type/SQL checks; retain ALL upstream steps |
| HANDOFF.md | PP source/preservation/promotion-only gates; retain main history |
| TRADING_STRATEGY.md | Existing reviewed exit-only PP amendment; no formula rewrite |
| api/_shared/futures-profit-protection-execution.ts | Reviewed full-close admission and independent FLAT |
| api/_shared/futures-profit-protection-lifecycle.ts | Reviewed durable CAS/UNKNOWN/cleanup orchestration |
| api/_shared/futures-profit-protection.ts | Reviewed shared deterministic policy/replay |
| api/analyze.ts | One PP help paragraph, no analysis function change |
| api/copytrade.ts | Reviewed PP opt-in/monitor/state/close/settlement integration |
| docs/AI_HANDOFF.md | Current PP source-only release gates |
| docs/futures-profit-protection.md | Reviewed operational PP documentation |
| migrations/futures_profit_protection.sql | Reviewed additive PP schema source; NOT executed |
| ops/signalverse-futures-profit-protection.service | Reviewed worker unit SOURCE; NOT installed/activated |
| reports/futures/futures-profit-protection-phase4-2026-10-01.md | PP implementation and newest-main preservation evidence |
| scripts/full-terminal-contract-test.mjs | Exact PP delta handling while retaining newest-main picker/engine assertions |
| scripts/futures-gate-observer-native-test.mjs | Native outcome/payload assertions; current main scope pin |
| scripts/futures-profit-protection-adapters-test.mjs | Reviewed native adapters/funding/depth/cleanup harness |
| scripts/futures-profit-protection-scope-test.mjs | Newest-main full preservation and baseline diagnostics |
| scripts/futures-profit-protection-sql-test.mjs | Reviewed disposable SQL races/ownership/settlement |
| scripts/futures-profit-protection-test.mjs | Reviewed PP/lifecycle/replay and unrelated-edit rejection |
| scripts/futures-profit-protection-ui-test.mjs | Reviewed actual React rendering checks |
| scripts/futures-real-execution-fault-test.mjs | Reviewed optional PP durable-close fixture |
| scripts/lib/futures-profit-protection-parity.mjs | Exact approved UI-hunk reversal and full reviewed adapter equality |
| scripts/lib/futures-pure-test-context.mjs | Reviewed isolated pure adapter import |
| scripts/terminal-view-parity-test.mjs | PP delta handling, all newest-main localization/market assertions retained |
| server/futures-profit-protection/worker.mjs | Reviewed independent worker SOURCE; not activated |
| src/app/App.tsx | Exactly eight previously approved PP UI hunks; no unrelated source removal |
| src/app/FuturesProfitProtection.tsx | Reviewed PP UI component |

## Local validation and reused implementation evidence

The 98 PP/UI boundary checks and complete scope proof were rerun successfully on
the final 8a-based worktree before committing 9de1fb1. Broader local checks below
were run on first 6789-based candidate 178d726; they are recorded implementation
evidence, NOT exact-SHA CI acceptance for 9de1fb1. The only intervening executable
differences are three static baseline pins; the new official CI validates the exact
final commit independently.

| Check | Actual result |
|---|---|
| PP policy/native adapters/React UI + historical UI boundaries | 98/98 PASS |
| Latest news/catalog/watchlist/onboarding/owned Spot transport | 24/24 PASS |
| Full Futures regression suite (16 named allowlisted files) | 916/916 PASS |
| Real execution faults / Gate-MEXC / Binance funding | 131/131 runner tests PASS |
| PP SQL ownership/settlement in fresh local PostgreSQL | 16/16 PASS; cluster stopped and removed |
| Scope proof | 689 non-PP Git files unchanged; 391 existing functions inspected; eight exact approved UI hunks |
| Frontend diagnostic baseline | 71 baseline / 71 candidate, zero introduced |
| API diagnostic baseline | 30 baseline / 30 candidate, zero introduced |
| Whitespace / candidate worktree | PASS / clean after commit |

Local Node v24.19.0 / PostgreSQL18.6; not represented as Node22. Exact Linux/Node22
CI is independently required below. No private API/bootstrap/.env/Production DB
was loaded by these tests. Passing mocks/rendering/SQL are not private exchange
execution, profitability or live PP acceptance.

## Exact CI and promotion gate

Before FINAL candidate-branch push, remote main still equalled preserved 8a3524b, the worktree
was clean, all 27 paths matched the approved inventory, no paths were deleted, all
reviewed runtime files matched 070fbad, and latest-main feature preservation passed.

Candidate official workflow: Production CI, `.github/workflows/production-ci.yml`.
First run **36851289684**, exact head SHA **178d7260ab07c0e80a457577ffe3d65264b01739**,
branch `codex/futures-profit-protection-latest-main-20261001`, event workflow_dispatch.
SUCCESS: 38/38 steps, zero failed/skipped, Node22.23.3; job started
2026-10-01T10:47:21Z and completed 2026-10-01T10:51:35Z. Its main push was not
executed because the newest-main recheck detected the receipt-only advancement.

Final exact candidate run **36852518826**, exact head SHA
**9de1fb13966bb4b2c76dc8efa6a21334d86aacdf**, branch
`codex/futures-profit-protection-latest2-main-20261001`, event workflow_dispatch.
Created 2026-10-01T10:59:18Z; job began 2026-10-01T10:59:24Z and completed
2026-10-01T11:03:24Z. SUCCESS: one job `Build web and API runtime`, all **38/38**
steps successful, zero failed/skipped. Node **v22.23.3**, disposable PostgreSQL
16.15, PP SQL **16/16**, frontend diagnostic baseline71/candidate71 and API30/30,
zero introduced. This is the official candidate workflow,
NOT a main/push release-artifact gate. Neither prior cdae607 nor 178d726 CI is used
as acceptance for this final SHA.

AFTER candidate CI succeeded, all exact identity, clean tree, direct parent,
single added commit, retained-branch and immediate remote-main gates were rechecked.
The normal command was `git push origin 9de1fb13966bb4b2c76dc8efa6a21334d86aacdf:refs/heads/main`.
No force/lease flag, merge commit, squash, amend or rewritten history was used.
Push started 2026-10-01T11:04:36.4961819Z; remote readback at
2026-10-01T11:04:43.6863138Z proved main exactly **9de1fb13966bb4b2c76dc8efa6a21334d86aacdf**.
Before push main and retained ref both exactly equalled **8a3524bdf595b4883c0b2fd9e46df8d136be90d6**.

Automatic official main/push CI **36853090043** was created
2026-10-01T11:04:42Z, head SHA **9de1fb13966bb4b2c76dc8efa6a21334d86aacdf**,
head branch **main**, event **push**. No manual dispatch on main was performed.
Job began 2026-10-01T11:04:46Z, completed 2026-10-01T11:09:06Z, conclusion **success**.
One job `Build web and API runtime`, job ID110339103794: **38/38 successful steps,
zero failed, zero skipped**. Actual main-run Node version was **v22.23.2**, not
the candidate-run v22.23.3. Disposable PostgreSQL16.15 PP assertions **16/16**;
frontend baseline71/candidate71 and API30/30, introduced diagnostics **zero**.
Both exact-SHA runs therefore satisfy their respective source gates independently.

| Official run | Exact SHA / event / branch | Job and step result | Actual Node | UTC job window |
|---|---|---|---|---|
| [36851289684](https://github.com/signal0verse/signalverse-main/actions/runs/36851289684), historical first candidate | 178d7260ab07c0e80a457577ffe3d65264b01739 / workflow_dispatch / first candidate branch | Build web and API runtime PASS; 38/38; not acceptance for final SHA | 22.23.3 | 10:47:21–10:51:35 |
| [36852518826](https://github.com/signal0verse/signalverse-main/actions/runs/36852518826), final candidate BEFORE main push | 9de1fb13966bb4b2c76dc8efa6a21334d86aacdf / workflow_dispatch / codex/futures-profit-protection-latest2-main-20261001 | Build web and API runtime PASS; 38/38, failed0/skipped0 | 22.23.3 | 10:59:24–11:03:24 |
| [36853090043](https://github.com/signal0verse/signalverse-main/actions/runs/36853090043), automatic promoted-main CI | 9de1fb13966bb4b2c76dc8efa6a21334d86aacdf / push / main | Build web and API runtime PASS; 38/38, failed0/skipped0 | 22.23.2 | 11:04:46–11:09:06 |

All UTC times in this table are on 2026-10-01. Full exact step records are retained
in the linked official runs, including original upstream onboarding/watchlist tests,
PP policy/type/SQL, isolated engine/scanner tests, web build, API bundles and output
validation. A passed step named verify artifacts is build validation, not a release
artifact preparation workflow or Production delivery.

Final identity readback at 2026-10-01T11:09:52.7551734Z:

```text
INITIAL_MAIN=6789a2e9457f0c927b8b7ac1dc5f79ef3748dbba
INITIAL_MAIN_RETAINED=codex/main-retained-before-futures-pp-latest-20261001
NEWEST_MAIN_BASE=8a3524bdf595b4883c0b2fd9e46df8d136be90d6
NEWEST_MAIN_RETAINED=codex/main-retained-before-futures-pp-8a3524b-20261001
FINAL_MAIN=9de1fb13966bb4b2c76dc8efa6a21334d86aacdf
PP_COMMIT_PARENT=8a3524bdf595b4883c0b2fd9e46df8d136be90d6
PP_TREE=9a74573baa9d61bb2e3cb815e99ce89ad72ca11c
CHANGED_PATHS=27
UNCHANGED_NON_PP_PATHS=689
DELETED_PATHS=0
UPSTREAM_RECEIPT_LINES_REMOVED=0
SOURCE_WORKTREE=CLEAN
MAIN_PUSH=SUCCESS
SOURCE_HISTORY_REWRITE=NO
EXACT_CANDIDATE_CI=PASS
EXACT_MAIN_PUSH_CI=PASS
```

## Safety / remaining gates

PRODUCTION_DEPLOYED_BY_THIS_TASK=NO
PRODUCTION_RELEASE_DISPATCH=NO
PRODUCTION_RELEASE_ARTIFACT_DISPATCH=NO
GUARD_APPROVAL_CREATED=NO
MIGRATION=NO
PRODUCTION_DATABASE_WRITE=NO
WORKER_INSTALLED_OR_ACTIVATED=NO
REAL_PP_ENABLED=NO
SERVICE_RESTART=NO
EXCHANGE_ACTIONS=0
ORDERS=0
POSITIONS_CHANGED=0
HISTORY_REWRITE=NO
FORCE_PUSH=NO

These zero figures describe actions performed by this task, not an assertion that
the live application performed no natural trading. No Production account rows or
exchange credentials were inspected. Unrelated dirty/private work and all prior
source/rollback refs remain preserved.

No VPS or live-runtime inspection was performed in this source-only task. Newest
main's preserved receipt reports a separate concurrent publication; that is not
reverified here and is not represented as a PP deployment. Repository HEAD and
active executable/runtime identity remain distinct. No claim is made that active
Production still equals an older SHA merely because an earlier audit saw it.

Later deployment still requires separate authorization, exact retained artifact
identity, independent Guard approval, existing verified backup/additive migration/
schema readiness, official release and explicit worker/OFF verification. None is
performed by this source-promotion request.
