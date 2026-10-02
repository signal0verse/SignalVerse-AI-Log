# PP fast rollout — exact local candidate preflight

## Metadata

- Date: 2026-10-02; evidence collected 09:40–09:48 UTC.
- Task: PP-FAST-ROLLOUT-PREFLIGHT; PREPARE ONLY.
- Repository: signal0verse/signalverse-main.
- Branch: codex/futures-pp-auto-enrollment-20261002.
- Exact candidate: a0455626c0a54fb443f457e0a595a662974623fa.
- Sole parent/base: 43558eb650ac1e5018be14cdf528559f960b0a98.
- Source starting/ending HEAD: identical; no source commit or application push.

## Executive result

READY FOR SEPARATELY AUTHORIZED SOURCE PUSH AND EXACT-SHA CI.
NOT READY FOR PRODUCTION ACTIVATION.

The exact candidate exists, preserves the current remote main as its sole parent,
and adds exactly one commit. All 17 changed paths belong to PP admission, its UI,
tests, numerical API/SQL parity or documentation. No unrelated execution,
Strategy, Decision Engine, Spot, Scanner, scheduler, workflow or worker changes.
No implementation blocker was found in the rerun local gates. Production release
prerequisites below remain pending; local tests do not prove live execution.

## Objective / scope

Verify existing local implementation, without redesigning, fixing, amending,
promoting or activating it. Only this sanitized preflight report was created.
The original dirty checkout and private/untracked work were preserved.

## Git identity and scope evidence

- `git show -s --format='%H%n%P%n%s' <candidate>`: exact SHA above, sole parent
  above, subject `fix(futures): auto-enroll full ONE-TP profit protection safely`.
- `git rev-list --reverse <base>..<candidate>`: ONLY a0455626c0a54fb443f457e0a595a662974623fa.
- `git ls-remote origin refs/heads/main`, initial and final rechecks: exactly
  43558eb650ac1e5018be14cdf528559f960b0a98. No application push/fetch/merge.
- Tracked worktree clean. Only `output/` is untracked: local test/build output,
  not source, not staged, not part of the candidate. No private env copied.
- Exact delta: 17 files; 1,029 insertions and 69 deletions. `git diff --check` PASS.
- Strict scope verification: 403 existing non-admission API functions unchanged;
  current approved byte contract rejects unauthorized mutations. Historical
  preservation assertions remain separate and pass, not silently exempted.
- Parent versus the independently verified active runtime 84f27c2e40b02b0dbf61c58429cf7c45f4f852da:
  only HANDOFF.md and docs/partner-copytrade.md differ, in one documentation-only
  release receipt. Thus no hidden executable feature is inherited by this release
  from the source parent relative to that runtime.

## Exact changed-file inventory

| Path | Classification / necessity |
|---|---|
| api/_shared/futures-profit-protection-enrollment.ts | Shared eligibility and automatic/manual admission; no order/close port |
| api/copytrade.ts | PP admission, bounded discovery inside existing tick, account overlap guard and status metadata only |
| migrations/futures_profit_protection_automatic_enrollment.sql | Public and existing owned admission RPC parity, idempotency and locked mode read |
| src/app/FuturesProfitProtection.tsx | Automatic admission/status; manual Select no longer required |
| src/app/App.tsx | One optional response field; Spot/other UI behavior unchanged |
| api/analyze.ts | Floating-help text ONLY; executable analysis functions identical |
| scripts/futures-profit-protection-enrollment-test.mjs | Actual isolated admission/tick, allocation, native units, HUMA/STRK and restart regressions |
| scripts/futures-profit-protection-ui-test.mjs | Actual UI renders; imports new admission tests into existing CI entrypoint |
| scripts/futures-profit-protection-sql-test.mjs | Disposable SQL parity, RLS, locks, risk, existing-state and HUMA/STRK checks |
| scripts/futures-profit-protection-automatic-scope-test.mjs | New strict current-base scope and protected-function checks |
| scripts/futures-profit-protection-scope-test.mjs | Run new scope while retaining historical assertions |
| scripts/lib/futures-profit-protection-automatic-parity.mjs | Closed before/after byte contract |
| scripts/lib/futures-profit-protection-automatic-delta.json | Exact pinned source hashes |
| scripts/lib/owned-copytrade-parity.mjs | Check new closed contract before unchanged historical owned assertions |
| docs/futures-profit-protection.md | Admission/migration/lifecycle explanation and limitations |
| HANDOFF.md | Dated local implementation handoff |
| reports/futures/futures-profit-protection-automatic-enrollment-2026-10-02.md | Prior implementation report |

## Revalidated local tests / builds

Node v22.23.3, Windows, isolated worktree with local lockfile dependencies.
No private production env, exchange API or production database was used.

| Command / gate | This preflight result |
|---|---|
| Explicit 19-file offline regression command recorded in the implementation report | 568/568 PASS; 0 fail, skip, cancel; 37,008 ms |
| Existing official PP test entrypoint | Includes automatic admission tests through UI-test import; no workflow edit needed |
| `node scripts/futures-profit-protection-scope-test.mjs --types` | PASS; policy/adapters/worker/scanner/workflow unchanged |
| Type diagnostic comparison | Frontend historical baseline 72 / candidate 71; API 30 / 30; introduced = 0 |
| `node scripts/futures-profit-protection-sql-test.mjs`, explicit local PG binary directory | 37/37 PASS, PostgreSQL 18.6; fresh loopback cluster, productionConnections=0; stopped/removed |
| `node scripts/build-partner-copytrade.mjs` | PASS; local bundle only, auto_activation=false |
| Explicit partner contract/transport/native-service test command | 27/27 PASS; 0 fail/skip; no real account/provider |
| `npm run build` | Web + Admin PASS; pre-existing large Web chunk warning only |
| `npm run build:terminal` / `npm run build:terminal:full` | Both PASS; no activation |
| Official standalone Admin strict TypeScript command | PASS, exit 0 |
| CI-equivalent Node22 esbuild API settings with write:false | 14/14 handlers PASS; no runtime file written |
| `node --check` on seven changed test/helper modules | PASS |
| Git whitespace and tracked-clean checks | PASS |

HUMA and STRK exact synthetic fixtures passed actual PostgreSQL admission again.
Explicit full 100/0/0 with analytical TP2/TP3 is accepted; true multi-TP, partial,
unknown allocation/provenance, wrong-account, mode OFF and mismatched native epoch
are rejected. Existing disabled/UNKNOWN/completed state is not reset. SQL/API risk
tolerance matches the unchanged core; materially fabricated original R rejects.
These fixture results are NOT proof current live HUMA/STRK rows are enrolled.

## Exact-SHA CI readiness

Read the complete current `.github/workflows/production-ci.yml`: Ubuntu runner,
Node22, normal main/master push and PR triggers, complete Git history for parity.
GitHub read-only query for the exact candidate returned total_count=0.
EXACT_SHA_GITHUB_CI=NOT_YET_RUN; CI_DISPATCH=NO.

The relevant official PP offline/scope/types/SQL/build gates and additional owned
host compatibility gates were rerun locally. This is NOT a claim that every job
of the entire GitHub workflow (including unrelated admin SQL, Whale, Prediction,
news and paper groups) ran locally or that fresh Linux CI passed. The full normal
official CI on the exact promoted candidate is still required before release.

## Required migration (NOT applied)

Exact source: `migrations/futures_profit_protection_automatic_enrollment.sql`.
SHA-256: 73c1440d8469e8eff8b39a9109f24a8d34186acc2b9cb52f9bf756c0e93408c0.

Prerequisites are the existing base PP schema, execution-attempt provenance and
TP-allocation columns. The migration replaces only admission functions, adds the
narrow locked boolean mode helper and refreshes the owned enrollment clone IF
already installed. SECURITY INVOKER/account RLS and no global-control write
authority are retained for the owned actor. There is no trade UPDATE/backfill,
table DDL, control toggle, balance or order rewrite.

MIGRATION_REQUIRED=YES for this runtime's admission contract.
PRODUCTION_FUNCTION_STATE=NOT_VERIFIED in this preflight: no production DB query
or write was made. Source presence/disposable tests do not establish application
of the migration in Production. Separately authorized backup, exact DB/function
precheck, migration and PostgREST schema/function readiness verification are needed.
Do not rerun the historical base migration automatically.

## Worker and partner execution path

Canonical: `server/futures-profit-protection/worker.mjs` (unchanged blob
f4f2d788b05951dabf774159559d5b9d9649cf3a) resolves the actual entrypoint and loads
the release `.runtime/api/copytrade.mjs` ONLY with explicit worker configuration.
`profitProtectionMonitorTick` handles existing/uncertain epochs first, then
`discoverOpenProfitProtection` -> shared enrollment -> next same monitor tick ->
unchanged `runProfitProtectionPosition` / `driveProfitProtection` / adapters.
API/browser/scanner requests do not start a second loop. No worker was started.

Partner: `main.ts` rejects the legacy worker flag; existing owned worker option
in `http.ts` schedules its 1000ms PP sweep, guarded against overlap; `service.ts`
uses protectionBusy and account AsyncLocalStorage, then the SAME monitor only
for market=usdm. Tenant namespace/JWT/RLS separate it from public legacy rows.
Account-keyed tick guard plus durable SQL identity/locks/CAS preserve ownership.
This is a legitimate separately scoped shared host, not duplicate PP execution
against public positions. No partner source/service/timer was modified.

## Production safety evidence

Fresh SSH metadata-only snapshot at 2026-10-02T09:47:37Z:

- Marker/app symlink/admin symlink/main process cwd all equal
  84f27c2e40b02b0dbf61c58429cf7c45f4f852da.
- Marker mtime: 2026-10-01T22:13:41.886470146Z, unchanged from prior read-only audit.
- Main/admin/observer: active; PIDs 3092054/3092050/3092049; NRestarts=0;
  start still 2026-10-01T22:13:39Z.
- Canonical PP: inactive/dead, disabled, PID0, NRestarts=0.
- Existing partner: active, PID3092803, NRestarts=0; start22:15:48Z on October1.
- These match the implementation task's recorded 09:19–09:21 snapshots.

No production file/config/DB write, service start/restart/enable, PP flag change,
live scanner or exchange API call occurred. Orders/positions/SL/TP/close actions
by THIS task are zero. This does not claim independently running services had
zero natural trading activity; no private exchange/account journal was queried.

## Files inspected / changed in THIS task

Inspected contributor/handoff/strategy/runbook, target Git tree/diffs, previous
implementation report, PP admission/monitor/worker/owned host, SQL/tests/parity,
complete CI workflow/build configuration and read-only GitHub/runtime metadata.
The source target and all branches stayed unchanged. Only this report was added
to the separate AI-Log clone; any report publication commit is not a source
promotion or deployment. Build/test output remains unstaged outside the commit.

## Remaining gates / promotion route

1. Separate owner authorization for exact a045... normal source promotion/push;
   recheck remote main immediately. Do not rewrite or silently rebuild if it moves.
2. Full normal official exact-SHA Linux CI PASS.
3. Authorized backup + exact admission migration + schema/function cache/readiness.
4. Official retained artifact preparation, independently verified SHA/digest,
   fresh exact independent Guard and separate official release authorization.
5. Authorized canonical worker rollout/start (currently inactive), explicitly
   scoped PP mode/admission validation; no implicit PP flag/position action here.

Local green tests are not profitability/private-fill/production-activation proof.
No Guard/artifact/release/migration operation is authorized by this preflight.

## Final status

```text
PHASE=PP-FAST-ROLLOUT-PREFLIGHT
TARGET_COMMIT=a0455626c0a54fb443f457e0a595a662974623fa
READY_FOR_COMMIT_PUSH=YES
READY_FOR_CI=YES
READY_FOR_PRODUCTION=NO
BLOCKERS=EXACT_SHA_LINUX_CI; AUTHORIZED_BACKUP_MIGRATION_SCHEMA_READINESS; OFFICIAL_ARTIFACT_GUARD_RELEASE; AUTHORIZED_CANONICAL_WORKER_ROLLOUT
APPLICATION_PUSH=NO
APPLICATION_CODE_CHANGED=NO
APPLICATION_COMMIT_CHANGED=NO
CI_DISPATCH=NO
PRODUCTION_MUTATION=NO
MIGRATION_APPLIED=NO
WORKER_STARTED=NO
PP_ACTIVATED=NO
EXCHANGE_ACTIONS=0
ORDERS=0
POSITIONS_CHANGED=0
SL_CHANGES=0
TP_CHANGES=0
CLOSE_ACTIONS=0
STOP
```
