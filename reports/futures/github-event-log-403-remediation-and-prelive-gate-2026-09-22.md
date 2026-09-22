# Real Futures — GitHub event-log 403 remediation and pre-live gate, 2026-09-22 UTC

## Metadata

- Date: 2026-09-22 UTC
- Task ID: Production GitHub event-log 403 blocker remediation
- Module: shared GitHub event transport and Real Futures pre-live safety gate
- Mode: code fix, isolated tests, established CI/CD deployment, bounded read-only Production audit, one non-trading logging smoke
- Application repository: `signal0verse/signalverse-main`
- Branch: `main`
- Starting Production executable: `c518c3e66a68afc5c7e8e45d8ed32d198364419a`
- Ending Production executable: `b88f25ac760b5af7cd6d3b626530fb1b3e9e5397`
- Documentation follow-up commit: `8cc826bb848a93ff673a5b349f082e6331a8cd80` (`[skip ci]`; not the runtime SHA)
- CI: [Production CI 35759284086](https://github.com/signal0verse/signalverse-main/actions/runs/35759284086)

## Objective and safety scope

Find and repair the exact repeated `logToGitHub` HTTP 403 cause without changing
Strategy, Engine, Futures/Spot/Demo/Shadow behavior, risk, Supervisor authority,
exchange credentials or fail-closed policy. Re-run the no-repeated-API-error
pre-live gate. Native Binance/MEXC protection and accounting were allowed only
if qualifying Real lifecycles occurred naturally; no trade could be manufactured.

## Confirmed root cause

Six duplicated logging helpers sent one event per request to
`POST /repos/signal0verse/signalverse-main/issues/{number}/comments`. They used
the runtime `GITHUB_LOG_TOKEN`; the credential kind was checked without reading
out or publishing its value and was a fine-grained PAT. The operation needs
**Issues: write** on the app repository. There is no Git ref, branch, Contents,
commit or workflow write in this event transport. `SignalVerse-AI-Log` remains
the human work-report repository, not the app's event destination.

Production `settings` pointed to Issue #148 for `2026-09-22`. GitHub reported
the Issue open/unlocked with exactly **2500** comments. The retained Production
response was HTTP 403 with `Commenting is disabled on issues with more than 2500 comments`.
The prior logger stored no response headers. The fault is therefore concrete
category **L: per-Issue comment capacity**, not an auth/scope/repository/ref or
rate-limit guess. The old code had no same-day rotation, capacity check,
cooldown or consistent error handling; independent jobs kept producing new
failed calls (42 in a later ten-minute diagnostic sample, after 44/ten minutes
in the previous release audit).

## Implementation

New `api/_shared/github-event-log.ts` keeps the existing destination, token and
comment format while centralizing all six callers. It:

- reads current Issue metadata and rotates at 2400 comments;
- creates a linked continuation Issue while retaining all previous evidence;
- conditionally swaps the shared DB pointer to reduce cross-worker races;
- handles the exact capacity-specific 403 by retrying only the comment GitHub
  definitively rejected, once, on the continuation Issue;
- classifies 401, generic 403, 404, 429, 5xx and network ambiguity separately;
- retries a transient read-only GET at most once after 250 ms;
- never blindly retries an ambiguous POST, preventing duplicate comments;
- applies ten-minute cooldown to deterministic auth/not-found failures and a
  one-minute cooldown to transient/unknown failures;
- emits one safe structured diagnostic per cooldown window with operation,
  path, status and selected non-secret headers, never the token, event body or
  raw error body.

The existing `admin.ts` `{ok,error}` contract and durable-first
`supervisor_notifications` behavior remain intact. Other calls remain
best-effort and cannot alter a trading decision. No generic durable event outbox
was added; recovery after an ambiguous POST/restart is not claimed.

## Files changed

- `.github/workflows/production-ci.yml`
- `api/_shared/github-event-log.ts`
- `api/admin.ts`
- `api/analyze.ts`
- `api/coins.ts`
- `api/copytrade.ts`
- `api/news.ts`
- `api/predictions.ts`
- `scripts/github-event-log-test.mjs`
- `docs/admin-monitoring-expansion.md`
- `docs/testing/github-event-log-403-remediation-2026-09-22.md`
- `HANDOFF.md`

No `src/`, `lib/`, migration, database schema, trading setting or exchange
credential file changed. The six API-file edits replace only local logging
helpers with thin calls to the shared transport; their trading call sites and
return behavior are preserved.

## Tests and builds

| Check | Result |
| --- | --- |
| Focused event transport | **PASS — 11/11**: success, preemptive rotation, capacity race, 401/403/404, 5xx/read backoff, timeout/ambiguous POST, cooldown, missing token, redaction/isolation |
| Futures/historical/analytics focused group | **PASS — 369/369** |
| Spot commission accounting | **PASS — 64/64** |
| Spot free-balance clamp | **PASS — 25/25 assertions** (26 runner cases including wrapper) |
| Shared transport strict TypeScript check | **PASS** |
| All top-level API esbuild bundle, Node 22 target | **PASS** |
| Vite web and admin build | **PASS** |
| Established Linux/Node 22 Production CI | **PASS**, exact b88, including admin, Futures, Whale, Stablecoin, Prediction, disposable PostgreSQL, builds, packaging and delivery |

The local global TypeScript command still reports unrelated pre-existing UI and
missing-dependency diagnostics. Some older local scripts require the absent
`.env.backup.local`; Windows admin-auth tests require POSIX file modes/symlink
privileges; two old `engine-first-consensus` Spot source-shape assertions also
fail in an untouched trading region. Production credentials were not copied in
to make local tests green. The authoritative established Linux CI passed fully.

## Deployment and Production verification

`b88f25a...` was fast-forward pushed to `main`. CI run 35759284086 completed
successfully and delivered that exact archive through the established OIDC
receiver. VPS deploy marker and live process cwd both identified exact b88;
main, admin, observer, PostgREST, PostgreSQL and the independent Shadow unit
were active. The runtime env file mtime remained `2026-09-19 11:11:10 UTC`, so
the release did not change credentials.

After no immediate natural event was available, one explicitly labelled,
non-trading smoke invoked the exact deployed transport with the effective
runtime configuration. It returned `{ok:true}`. The DB pointer moved from full
#148 to continuation [Issue #149](https://github.com/signal0verse/signalverse-main/issues/149),
and GitHub readback confirmed the smoke comment at `2026-09-22T17:21:46Z`.
By final readback, #149 had **52** comments, so natural application events also
flowed. The temporary `/tmp` smoke/diagnostic files were then removed.

From deploy marker `2026-09-22 17:17:30 UTC` through final gate check at
`17:28:03 UTC`, journal aggregation found:

- repeated legacy GitHub 403: **0**
- new structured logger failure: **0**
- PostgREST error lines: **0**
- broad HTTP/API 4xx/5xx lines: **0**

Thus the previous logging blocker is gone and the pre-live API-error gate passed.
This is not evidence of exchange-side protection or profitability.

## Final audit matrix

| Gate | Status | Evidence / remaining condition |
| --- | --- | --- |
| Exact 403 diagnosis | **PASS** | #148 at 2500 plus capacity-specific GitHub response |
| Logging code/tests/build | **PASS** | evidence above |
| Exact Production runtime | **PASS** | marker/cwd b88; CI exact SHA |
| Production event delivery | **PASS** | #149 + smoke readback + 52 events |
| Pre-live API-error gate | **PASS** | clean >10-minute window |
| Spot bounded regression | **PASS** | focused suites; no Spot behavior/config change |
| Demo bounded regression | **PASS** | established CI/build; no Demo behavior/config change |
| Shadow regression/service | **PASS** | no Shadow change; independent service active |
| Binance native protection | **NATURALLY PENDING** | zero eligible app OPEN Real Binance trade |
| MEXC native protection | **NATURALLY PENDING** | four old DB OPEN rows lack a matching current account/native protection proof and are not presumed live |
| Fresh Real accounting | **NATURALLY PENDING** | zero newly closed Real Futures trade since b88 deploy |
| 24-hour Shadow protocol | **NATURALLY PENDING** | frozen window ends `2026-09-23T07:30:00Z`; liveness is not completion |
| Profitability / AI Supervisor effectiveness | **NOT APPLICABLE** | no sample or completed lifecycle; no claim made |

DB aggregates at final collection: open Real Binance = 0; old open Real MEXC
rows = 4; newly closed Real since deploy = 0; new entry attempts since deploy = 0.
No operator-initiated exchange create/modify/cancel request occurred. No leverage,
position, balance, exchange credential, Production trading setting or migration
was touched. The stale MEXC rows require independent native reconciliation; they
are not permission to place/cancel protection.

## Final status

**RELEASE UNBLOCKED — LIVE NATURAL GATES PENDING**

The next action is to wait for natural eligible Binance/MEXC/accounting
lifecycles and separately complete the frozen Shadow audit after its end time.
Do not manufacture a trade or describe service activity as protection,
profitability or AI effectiveness.
