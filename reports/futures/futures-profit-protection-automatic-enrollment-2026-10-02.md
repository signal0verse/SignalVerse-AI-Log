# Futures Profit Protection — automatic enrollment remediation

## Metadata

- Date: 2026-10-02; implementation/audit evidence collected through 09:24 UTC.
- Task ID: PP-AUTOMATIC-ENROLLMENT-REMEDIATION.
- Module: standard Futures Profit Protection admission / lifecycle / visibility.
- Mode: local implementation and offline/disposable validation ONLY.
- Repository: signal0verse/signalverse-main.
- Branch: codex/futures-pp-auto-enrollment-20261002.
- Starting commit: 43558eb650ac1e5018be14cdf528559f960b0a98.
- Ending commit: a0455626c0a54fb443f457e0a595a662974623fa (local only; not pushed).
- Active Production release, independently read: 84f27c2e40b02b0dbf61c58429cf7c45f4f852da.

## Objective

Correct the API/SQL ONE-TP eligibility bug demonstrated by HUMA/STRK and remove
manual per-position selection as a prerequisite. Reuse the existing PP monitor;
preserve the single deterministic Real/Demo/Simulator policy and all trading
safety gates. Stop before any promotion, deployment, live migration or activation.

## Scope

Admission helper, existing PP-only API branch/monitor, additive local migration,
automatic-status UI, offline regressions, strict scope contract and documentation.
No Strategy, Decision Engine, risk/exit thresholds, close adapter, lifecycle state
machine, scanner, worker/unit, scheduler, Spot, execution or reconciliation change.
The existing dirty original checkout and private/untracked work were not staged.

## Actions Taken

1. Read current contributor/handoff/strategy/testing boundaries; inspected current
   source and deployed service architecture read-only, before implementing.
2. Created a clean isolated local worktree from the current main identity above.
   Installed local dependencies with scripts disabled, Node 22.23.3.
3. Implemented one shared API/manual/automatic admission helper. Explicit
   allocations 100/0/0 qualify independently of analytical TP2/TP3 prices.
4. Added bounded OPEN discovery AFTER existing monitored/uncertain epochs in the
   same PP tick. Next tick uses the unchanged monitor/adapters/policy.
5. Added transactional/idempotent SQL admission and refreshed the already-existing
   owned clone locally. No production migration was executed.
6. Converted position UI to automatic admission/status visibility without a Select
   button or enrollment POST. Retained the compatibility/admin opt-out endpoint.
7. Ran actual offline functions, React rendering, synthetic adapters and a fresh
   disposable PostgreSQL cluster, plus preservation/types/build checks.
8. Re-read runtime marker, app/admin symlinks and service/process provenance; no
   Production activation/restart was performed. Prepared this sanitized report.

## Files Inspected

- AGENTS.md, CLAUDE.md, HANDOFF.md, docs/AI_HANDOFF.md, TRADING_STRATEGY.md,
  docs/COLLEAGUE_HANDOFF_2026-09-29.md, docs/testing/stability-test-runbook.md.
- api/copytrade.ts; api/_shared/futures-profit-protection.ts;
  api/_shared/futures-profit-protection-lifecycle.ts;
  api/_shared/futures-profit-protection-execution.ts;
  api/_shared/partner-copytrade-context.ts; api/analyze.ts.
- src/app/FuturesProfitProtection.tsx; src/app/App.tsx.
- migrations/futures_profit_protection.sql; migrations/partner_copytrade.sql.
- server/futures-profit-protection/worker.mjs; server/partner-copytrade/main.ts,
  http.ts, service.ts, database.mjs; ops/signalverse-futures-profit-protection.service;
  ops/signalverse-deploy; .github/workflows/production-ci.yml (read only).
- Existing PP core/adapters/UI/SQL/scope tests and historical parity helpers.
- Previous sanitized eligibility audit and exact HUMA/STRK fixture representation.
- VPS systemd service metadata, deployment marker and active release symlinks.
  No private-account exchange endpoint or credential value was read for the audit.

## Files Changed

| Path | Reason |
|---|---|
| api/_shared/futures-profit-protection-enrollment.ts | Shared strict eligibility and injected read-only admission ports; no close/order port |
| api/copytrade.ts | Shared admission wrapper, bounded automatic discovery in existing PP tick, per-account overlap guard, response eligibility and compatibility endpoint reuse |
| migrations/futures_profit_protection_automatic_enrollment.sql | Additive local admission replacement, idempotency, mode lock and existing owned clone refresh; no backfill |
| src/app/FuturesProfitProtection.tsx | Automatic status display instead of per-position selection; honest stale-state labels retained |
| src/app/App.tsx | Only optional PP eligibility response typing |
| api/analyze.ts | Only floating-help product description; executable analysis functions unchanged |
| scripts/futures-profit-protection-enrollment-test.mjs | Pure/actual-function automatic admission, HUMA/STRK, mode/native units, repeated/restart and ownership regressions |
| scripts/futures-profit-protection-ui-test.mjs | Actual bilingual status renders and no selection/POST; imports admission cases into existing official test entrypoint |
| scripts/futures-profit-protection-sql-test.mjs | Actual allocation/RLS/concurrency/provenance/risk/idempotency checks in disposable PostgreSQL |
| scripts/futures-profit-protection-automatic-scope-test.mjs | Strict new-phase inventory and policy/403 non-admission function preservation |
| scripts/futures-profit-protection-scope-test.mjs | Invoke new-phase scope; preserve old historical scope/financial/type checks separately |
| scripts/lib/futures-profit-protection-automatic-parity.mjs | Exact closed byte contract before historical-only normalization; unauthorized mutations reject |
| scripts/lib/futures-profit-protection-automatic-delta.json | Pinned base/candidate byte hashes for authorized admission/UI/help/documentation delta |
| scripts/lib/owned-copytrade-parity.mjs | Apply exact new-phase byte contract before existing unchanged owned/historical assertions |
| docs/futures-profit-protection.md | Dated architecture, migration and validation/rollout limits |
| HANDOFF.md | Append dated local-only implementation handoff; retain previous history |
| reports/futures/futures-profit-protection-automatic-enrollment-2026-10-02.md | This report |

## Root Cause / Findings

### CONFIRMED: analytical prices were mistaken for executing legs

Both old API and SQL required null TP2/TP3 prices. The authoritative allocation
representation is TP1/TP2/TP3 percentages. Explicit 100/0/0 means ONE executing TP,
even with analytical prices populated. No price, SL/TP or stored trade is rewritten.
50/50/0, 50/0/50, 0/100/0, 100/100/0, 0/0/0, partial remaining quantity and missing,
null, malformed or unknown allocation are denied. Missing remaining quantity now
fails closed instead of being silently defaulted to 100.

HUMA TP prices: 0.036565449012468214 / 0.03807553577181938 / 0.03958562253117054.
STRK TP prices: 0.04574190809492551 / 0.04716833916611964 / 0.048594770237313775.
Both exact 100/0/0, full-quantity fixtures pass shared API admission AND actual SQL
admission. Analytical prices and immutable original stops/TP1 remain intact.

### CONFIRMED: decimal-vs-JavaScript identity comparison also rejected those fixtures

After fixing the allocation rule, exact decimal equality for originalRisk still
rejected HUMA/STRK float-computed identity R. SQL now applies the identical 1e-9
relative identity tolerance already enforced by the UNCHANGED pure core. A
materially fabricated R is still rejected. Original accepted request, entry,
quantity, SL/ONE TP, positive finite numeric identity, supported venue and epoch
checks remain; stop geometry and required MEXC exact native position ID are checked.
This is admission numerical parity, NOT a change to risk or PP policy thresholds.

### CONFIRMED: two legitimate scoped hosts, not two public PP loops

Canonical path: dedicated worker -> release-bundled copytrade ->
profitProtectionMonitorTick -> existing runProfitProtectionPosition -> shared
driveProfitProtection -> unchanged adapters/CAS/durable close ownership.

Owned path: partner main worker mode -> existing HTTP-owned profit-protection sweep
(1000ms) -> service protectionBusy/account context -> SAME profitProtectionMonitorTick,
only for market=usdm. AsyncLocalStorage selects the independent owned DB namespace
and account RLS. Partner bootstrap rejects FUTURES_PROFIT_PROTECTION_WORKER=1.
Classification C: legitimate shared host with separate account ownership, NOT an
unintended duplicate public monitor. No service path is added/moved/removed.
Account-keyed tick guards supplement existing owned guards; SQL identity/row locks
and unchanged lifecycle CAS still protect across processes/restarts.

The already-installed owned enrollment RPC is a separate function clone. Updating
only public would leave it broken. The new local migration refreshes ONLY that RPC,
preserving SECURITY INVOKER and account RLS. Its only cross-namespace call is the
narrow boolean global-mode reader with FOR SHARE: owned actors receive no control
table UPDATE privilege. Wrong-account enrollment and global-control writes reject
under actual PostgreSQL tests.

## Implementation

OPEN -> shared strict eligibility/entitlement -> immutable original accepted basis
-> native side/entry/full quantity/contract-unit/MEXC-ID admission -> SQL transaction
-> persisted DISARMED state -> next SAME PP monitor tick -> unchanged PP lifecycle.

Discovery pages at most 25 OPEN rows; at most 5 attempts, or one Real attempt, per
tick. Keyset cursor advances through candidates and wraps; cursor is not a lease.
Existing monitored and uncertain epochs run before new enrollment. Existing native
observation budget is shared with admission; no new scanner cadence or timer.
Polling uses the existing configured PP interval while discovery is allowed and
disabled interval when modes are off. These are target intervals, not latency guarantees.

Persisted state wins: no phase/peak/identity/revision reset, no implicit re-enable
after opt-out, no duplicate close intent or exchange protection action. SQL locks
the trade and rechecks OPEN/full/source/allocation, independent mode switch and
existing exit owner. Concurrent repeats return the existing same identity without
UPDATE. Flat positions do not enroll. Native failures/missing admission evidence
deny, never infer a position. Automatic/manual paths share identical API admission.

Real/Demo mode flags are untouched. Demo admission never accesses a Real account;
Simulator remains on the unchanged pure PP policy. Original SL/ONE TP and full-close
execution are unchanged. UI waiting is NOT proof native admission succeeded.

## Tests Executed

- Node 22.23.3, Windows, isolated worktree: the selected explicit offline test list
  below ran **568/568 PASS**, zero failures/skips. No API bootstrap/.env/real account.
- PP core + actual mocked native close adapters + actual React UI + automatic
  admission cases are included. 59 NEW admission/UI cases are reached through the
  existing official UI test entrypoint; no workflow changes are needed.
- Actual AST-extracted monitor, discovery, admission wrapper and entitlement
  functions execute with injected synthetic DB/native ports. Pure fixtures alone
  are not counted as live monitor proof. Native Binance/Gate/MEXC units and exact
  MEXC ID, Demo isolation, mode off, VIP/suspension, budget, concurrent/restart,
  existing disabled/UNKNOWN/completed state and no manual selection are covered.
- `FUTURES_PROFIT_PROTECTION_TEST_PG_BIN=<local PostgreSQL 18 bin> node
  scripts/futures-profit-protection-sql-test.mjs`: **37/37 PASS**, PostgreSQL 18.6.
  Fresh loopback-only disposable cluster, explicitly verified data directory,
  stopped/removed afterward; productionConnections=0, exchangeActions=0.
- `node scripts/futures-profit-protection-scope-test.mjs --types`: PASS. Historical
  checks retained, new current-main scope explicit; 403 existing non-admission
  API functions and policy/adapters/workers/scanner/workflows unchanged. Historical
  type comparison: frontend baseline 72, candidate 71; API baseline 30, candidate
  30; zero introduced diagnostics. This is NOT a globally clean TypeScript claim.
- Syntax checks on changed test modules and `git diff --check`: PASS.

Selected regression command (explicit safe offline list):

```text
node --test scripts/futures-profit-protection-test.mjs scripts/futures-profit-protection-adapters-test.mjs scripts/futures-profit-protection-ui-test.mjs scripts/futures-real-execution-fault-test.mjs scripts/futures-gate-mexc-fault-test.mjs scripts/binance-final-funding-test.mjs scripts/futures-simulation-execution-test.mjs scripts/futures-simulation-chronology-test.mjs scripts/futures-simulation-accounting-test.mjs scripts/futures-simulation-accounting-ui-test.mjs scripts/futures-simulation-capital-test.mjs scripts/futures-market-discovery-test.mjs scripts/futures-discovery-data-test.mjs scripts/futures-simulation-discovery-test.mjs scripts/futures-discovery-live-test.mjs scripts/futures-discovery-evaluation-test.mjs scripts/full-terminal-contract-test.mjs scripts/terminal-view-parity-test.mjs scripts/trade-onboarding-test.mjs
```

Failures encountered and resolved locally (not suppressed): initial sandbox local
PostgreSQL launch restriction; an SQL CASE parenthesis syntax error; malformed-risk
test fixtures reached the new OFF-mode gate before their intended assertion (local
fixture now explicitly permits admission for that assertion); exact decimal R
rejection on HUMA/STRK; owned fixture initially lacked the row-lock UPDATE privilege
already present in the real owned namespace; then owned read-only control view
could not use FOR SHARE without UPDATE permission (resolved with boolean-only mode
reader, NOT a global write grant); legacy tamper test expected its old error text
(kept rejection and preserved its recognized error wording). Final tests above pass.

## Build Result

`npm run build`: Web PASS, Admin PASS. Existing large-Web-chunk warning retained.
`esbuild api/*.ts --bundle --platform=node --format=esm --target=node22
--packages=external`: 14/14 bundles PASS, local output only, not committed.
No build artifact, credential, private account export or database dump is staged.

## Production Safety Evidence

Read-only snapshot before implementation: 2026-10-02T08:54:27Z.
Final snapshots: 09:19:36Z services; 09:20:34Z paths/process cwd;
09:21:25Z exact marker. App marker/cwd/app/admin all remain
84f27c2e40b02b0dbf61c58429cf7c45f4f852da. Marker mtime remains
2026-10-01T22:13:41.886470146Z.

| Service | Final PID | Restarts | State |
|---|---:|---:|---|
| signalverse | 3092054 | 0 | active, unchanged from precheck |
| signalverse-admin | 3092050 | 0 | active, start still 2026-10-01T22:13:39Z |
| signalverse-observer | 3092049 | 0 | active, start still 2026-10-01T22:13:39Z |
| futures-profit-protection | 0 | 0 | inactive; not started/enabled by this task |
| partner-copytrade | 3092803 | 0 | active, unchanged from precheck |

All exchange/order/position/SL/TP/close counters mean **actions by this task**.
Synthetic offline calls are not live actions. No private exchange account journal
was queried, and this report does not claim that independently running existing
services performed zero natural actions throughout the window. No Production DB
write or mode-toggle command was issued. SQL writes were ONLY disposable fixtures.

## Git Status / Commit

Local candidate only, based on the pinned current main. Stage only the 17 paths
listed above; retain local build output unstaged and original checkout changes.
No application-source push, main merge, CI dispatch, artifact/Guard or deploy.
The sanitized report is separately published to SignalVerse-AI-Log/master per
AGENTS.md; that reports-only publication is not an application push or release.

## Remaining Issues / Risks / Limitations

This is NOT a Production fix yet. A separately authorized exact-candidate review,
promotion/fresh Linux CI, approved migration (public AND owned), schema readiness
and official deployment/worker activation remain necessary. Existing Real/Demo PP
flags are not silently toggled. The canonical PP service is currently inactive;
public legacy rows cannot automatically enroll without its separately authorized
running lifecycle. The existing owned host remains separately active and scoped.
Local SQL 18.6 does not replace a Production-version preflight. Mode OFF, unreadable
schema/native position, missing original risk/allocation or account entitlement
still deny admission. Rate limits/backlog can delay enrollment/observations; no
per-position two-second guarantee. No profitability/live fill guarantee or policy
threshold optimization is asserted. No fresh Linux CI was dispatched in this phase.

## Required Final Status

```text
PHASE=PP-AUTOMATIC-ENROLLMENT-REMEDIATION
BUG_FIXED=YES (LOCAL CANDIDATE ONLY)
ONE_TP_SEMANTICS=EXPLICIT_TP_ALLOCATIONS_100_0_0
100_0_0_WITH_ANALYTICAL_TP2_TP3=PASS
TRUE_MULTI_TP=REJECTED
FULL_POSITION_CHECK=PRESERVED (MISSING NOW FAILS CLOSED)
STANDARD_FUTURES_CHECK=PRESERVED
API_ELIGIBILITY=ONE_SHARED_ADMISSION_HELPER
SQL_ELIGIBILITY=TRANSACTIONAL_PUBLIC_AND_OWNED_RPC
API_SQL_PARITY=PASS
AUTOMATIC_ENROLLMENT=IMPLEMENTED
MANUAL_OPT_IN_REQUIRED=NO
AUTOMATIC_LIFECYCLE=EXISTING_PP_TICK_DISCOVERY_THEN_SAME_MONITOR
IDEMPOTENCY=PASS
RESTART_SAFETY=PASS
DUPLICATE_PP_PATHS=NONE (OWNED HOST IS SEPARATELY SCOPED)
CANONICAL_PP_WORKER_PATH=EXISTING_WORKER_TO_PROFIT_PROTECTION_MONITOR_TICK
PARTNER_COPYTRADE_INTERACTION=SAME_TICK_SEPARATE_NAMESPACE_ACCOUNT_RLS
UI_MANUAL_BUTTON=REMOVED_FROM_REQUIRED_FLOW
UI_STATUS=AUTOMATIC_WAITING_MONITORING_ARMED_CONFIRMING_COMPLETE_INELIGIBLE
HUMA_REGRESSION=PASS
STRK_REGRESSION=PASS
TESTS=568_568_OFFLINE_AND_37_37_DISPOSABLE_SQL_SCOPE_TYPES_SYNTAX_PASS
BUILD=PASS (WEB_ADMIN_14_14_API)
DATABASE_MUTATION=NO (PRODUCTION; DISPOSABLE_SQL_FIXTURES_ONLY)
EXCHANGE_ACTIONS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_ACTIONS=0
TP_ACTIONS=0
CLOSE_ACTIONS=0
DEPLOYMENT=NO
WORKER_STARTED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
COMMIT=a0455626c0a54fb443f457e0a595a662974623fa
PUSH=NO (APPLICATION; AI_LOG_REPORT_ONLY_PUBLISHED_SEPARATELY)
```

## Recommended Next Step

Separate owner review of this exact local candidate and additive admission migration.
Do not promote, migrate, start/enable a worker, activate PP or deploy on this task's
authority. No next-phase operation is performed automatically.


## Publication supplement

Source commit was created locally at 2026-10-02T09:28Z on the isolated feature
branch; parent is exactly 43558eb650ac1e5018be14cdf528559f960b0a98. Its 17-file
inventory is above. This reports-only AI-Log publication is separate from source
promotion; no application push/CI/deployment is performed. The source checkout's
only untracked content is its generated local output directory, not staged.
