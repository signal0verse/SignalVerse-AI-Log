# Phase 5N-A — Production runtime SHA reconciliation

Date: 2026-10-02. All evidence timestamps below are UTC.

## Executive result

**PHASE 5N-A SAFETY STOP — UNEXPECTED WORKER ACTIVITY DETECTED**

The public application runtime is coherently identified as `84f27c2e40b02b0dbf61c58429cf7c45f4f852da`. Its exact successful Production CI, retained preparation artifact, official Production Release, GitHub deployment, native receiver/Guard consumption and activation journal, delivered-byte digest, marker, links and process working directories reconcile. This was an existing official release, not a deployment performed by this audit.

The canonical dedicated PP Worker remains **inactive/dead, disabled, PID 0, NRestarts 0**. However, a different process was discovered: `signalverse-partner-copytrade.service` is **active/running, enabled, PID 3092803**, with `PARTNER_COPYTRADE_ENABLED=1` and `PARTNER_COPYTRADE_WORKER=1`. Its process working directory resolves to the same `84f27...` release. The inspected source passes this worker flag to the owned service and contains an owned `profit-protection` sweep that calls the exported original PP monitor. This is an additional active worker-mode host, not evidence that the canonical PP unit started.

At that discovery, the operational audit stopped at **2026-10-02T07:19:04.924338695Z**. No service was stopped, no flag was changed, and no further VPS/DB/application-runtime inspection was performed. The alternate scheduler's actual PP invocations, accounts, tenant state and trading effects are **not verified**. The safety-stop classification is conservative; it is not an allegation of an unauthorized deployment or proof of an exchange action.

The bounded public-schema read also found **Real PP ON and Demo PP ON**, with control `updated_at = 2026-10-01T22:02:54.495Z`; all inspected public PP counters were zero. This differs from the prior Phase 5M-C OFF snapshot. The current ON state was not changed by this audit and must not be silently treated as the original OFF safe-idle precondition.

Static compatibility of the **expected canonical PP source** was established before the stop: Worker, deterministic policy, lifecycle, tracked-close admission and relevant engine/risk/discovery/provenance bytes are preserved, the nine bootstrap cases remain intact, and the deployed PP source hashes match the GitHub target. This does not certify the additional active owned scheduler, live safety, effectiveness, profitability, or a future rollout target.

## Scope and evidence collection

This task is forensic and read-only with respect to the application repository history, Production, services/configuration, authorization state, artifacts, DB and exchanges. No tests, Worker imports/execution, builds, CI dispatches, release/preparation calls or trading endpoints were run. The only output writes are this dated report and its documentation-only AI-Log publication under the owner's AGENTS reporting instruction. No application Git commit/push/ref write was performed; existing dirty/private/untracked work was preserved.

| Collection | UTC timestamp/window | Source |
| --- | --- | --- |
| Runtime/services/source/configuration/public PP snapshot | 2026-10-02T07:10:11.582961279Z → 07:10:12.488336514Z | Existing VPS metadata, systemd/proc reads, bounded peer-authenticated DB transaction |
| Public DB counts | 2026-10-02T07:10:12.478298Z | `signalverse_cutover2`, explicit READ ONLY / ROLLBACK |
| Commit/comparison/current main/runs/deployment | 2026-10-02T07:10:54.572Z | GitHub GET APIs, no fetch/ref update |
| Exact job steps/artifact/deployment statuses/diffs | 2026-10-02T07:13:26.766Z onward | Existing GitHub GET APIs |
| Guard receipt/delivered digest/native journal/process flag reads | 2026-10-02T07:14:27.081908546Z → 07:14:31.922614250Z | Existing VPS files/journal/proc |
| Canonical Git byte/function comparison | 2026-10-02T07:15:11.706Z onward | Existing local baseline Git blobs; exact GitHub current blobs; static AST only |
| Native archive embedded commit read | 2026-10-02T07:17:53.409043095Z | Existing incoming archive, stream read only |
| Installed core/tests/static runtime and additional unit discovery | 2026-10-02T07:18:31.493219529Z → 07:18:31.747925492Z | Existing source hashes/runtime text/systemd |
| Minimal alternate-worker flag/provenance confirmation; safety stop | 2026-10-02T07:19:04.747442588Z → 07:19:04.924338695Z | Selected non-secret process flags and unit/proc metadata only |

No credentials, connection strings, private account/trade identifiers or raw private application journal bodies are published. Public commit names/logins, release identities, aggregate counts, service PIDs and Guard UUID are provenance, not credentials. This report does not identify who changed the PP controls; the timestamp alone cannot establish an actor or authorization.

## 1. Current Production identity

| Independent evidence | Observed result |
| --- | --- |
| `/var/lib/signalverse-deploy/deployed-sha` | `84f27c2e40b02b0dbf61c58429cf7c45f4f852da` |
| Marker mtime | 2026-10-01T22:13:41.886470146Z; not used alone as deployment time |
| `/opt/signalverse/app` | `/opt/signalverse/releases/84f27c2e40b02b0dbf61c58429cf7c45f4f852da` |
| `/opt/signalverse-admin/app` | `/opt/signalverse-admin/releases/84f27c2e40b02b0dbf61c58429cf7c45f4f852da` |
| Main process cwd | App release `84f27...` |
| Admin process cwd | Admin release `84f27...` |
| Observer process cwd | Admin release `84f27...` |
| Actual delivered archive native embedded Git commit | `84f27c2e40b02b0dbf61c58429cf7c45f4f852da` |
| Additional owned process cwd | App release `84f27...`, read at safety stop |

`RUNTIME_IDENTITY_MATCH=YES`; `RUNTIME_IDENTITY_CONFLICT=NO` in the collected evidence. GitHub main was already newer, `43558eb650ac1e5018be14cdf528559f960b0a98`, at the read. Repository HEAD is not being substituted for the pinned active runtime. No final full after-snapshot was taken after the mandated safety stop; later/external changes are not ruled out.

| Service | State | PID | NRestarts | ExecMainStartTimestamp UTC |
| --- | --- | ---: | ---: | --- |
| `signalverse.service` | active/running | 3092054 | 0 | 2026-10-01 22:13:39 |
| `signalverse-admin.service` | active/running | 3092050 | 0 | 2026-10-01 22:13:39 |
| `signalverse-observer.service` | active/running | 3092049 | 0 | 2026-10-01 22:13:39 |
| `postgrest.service` | active/running | 1960930 | 0 | 2026-09-23 20:37:29 |
| Canonical `signalverse-futures-profit-protection.service` | inactive/dead; disabled | 0 | 0 | none |
| Additional `signalverse-partner-copytrade.service` | active/running; enabled | 3092803 | 0 | 2026-10-01 22:15:48 |
| `signalverse-partner-copytrade-postgrest.service` | active/running; enabled | 3092801 | 0 | not collected |

The public app/admin/observer process Worker flag was absent. The dormant canonical unit has Worker flag `1`; its actual environment file has no override for that flag. Neither is proof the unit is running.

## 2. Git identity and relationship

Current commit: [84f27c2e40b02b0dbf61c58429cf7c45f4f852da](https://github.com/signal0verse/signalverse-main/commit/84f27c2e40b02b0dbf61c58429cf7c45f4f852da).

- Exists on GitHub: YES. It was not present in the local Git object store; no fetch/ref creation was used to obtain it.
- Reachable from current remote `main`: YES, independently verified by GitHub compare; the merge base for current SHA → current main is the current runtime SHA.
- Parent: `047da57853d4cef0c519c8b945ae27729e3b1e6c`.
- Author/committer: public commit name `kia taghipour`, GitHub login `kiaxar`; emails omitted.
- Author and committer timestamp: `2026-10-01T21:57:04Z`.
- Subject: `test: inspect native authenticated handler for final funding routing`.
- Tip is a merge commit: NO (one parent). An intermediate integration commit is a merge.
- GitHub signature verification: false, reason `unsigned`. This alone is not an authorization finding.
- No branch has this exact SHA as its current HEAD in `branches-where-head`; remote `main` contains it. Other branches' full ancestry was not exhaustively enumerated.
- No direct matching tag was found in the inspected tags result; no GitHub Release explicitly targeting this SHA was found in the inspected release listing. Official Actions deployment evidence exists independently of a tag/Release.

[Exact base-to-current comparison](https://github.com/signal0verse/signalverse-main/compare/66f3ac2e89d1c40543851c6a9b1f46318d6f6a12...84f27c2e40b02b0dbf61c58429cf7c45f4f852da): current is ahead by 5, behind by 0; common ancestor is exactly `66f3ac2e89d1c40543851c6a9b1f46318d6f6a12`.

| Commit in set difference | Parent(s) | Subject |
| --- | --- | --- |
| `3bba09accbb8e54314f01909e0c232322fce6bdf` | `da992966f52b7a68dcaf6a4c9cf4e1c2b6501e6f` | Add owned native copy-trading bridge for CrossVerse |
| `ca68bcc4e2f6e1dffcf56fca02c4cefcc17efc6c` | `3bba09accbb8e54314f01909e0c232322fce6bdf`, `66f3ac2e89d1c40543851c6a9b1f46318d6f6a12` | merge: preserve current main worker hardening in owned copytrade |
| `4ecfd02638ee5d1b429c668acd65e2d8bc12d2ca` | `ca68bcc4e2f6e1dffcf56fca02c4cefcc17efc6c` | test: preserve exact onboarding parity through frozen owned adapter |
| `047da57853d4cef0c519c8b945ae27729e3b1e6c` | `4ecfd02638ee5d1b429c668acd65e2d8bc12d2ca` | test: follow authenticated native handler extraction in offline route gates |
| `84f27c2e40b02b0dbf61c58429cf7c45f4f852da` | `047da57853d4cef0c519c8b945ae27729e3b1e6c` | test: inspect native authenticated handler for final funding routing |

This is not a claim that all five are a linear chain from `66f3...`: the owned bridge side branch was integrated by the two-parent commit.

## 3. Official deployment origin and exact artifact

`DEPLOYMENT_ORIGIN=OFFICIAL_PRODUCTION_RELEASE`.

| Stage | Exact identity/result |
| --- | --- |
| [Production CI](https://github.com/signal0verse/signalverse-main/actions/runs/36932028039) | Run `36932028039`, exact current SHA, `main`, push, attempt 1, success |
| [Preparation](https://github.com/signal0verse/signalverse-main/actions/runs/36932516764) | Run `36932516764`, exact current SHA, `main`, workflow_dispatch, attempt 1, success |
| [Retained artifact](https://github.com/signal0verse/signalverse-main/actions/runs/36932516764/artifacts/11195959952) | ID `11195959952`, name `production-release-84f27c2e40b02b0dbf61c58429cf7c45f4f852da-36932516764-1` |
| Retained outer Actions ZIP | 4,609,430 bytes; SHA-256 `3e2e6e7c78f37491a1de1bf1d0551d6c2997e3736f48f8f0307e3acd0736921f` |
| Exact inner release archive | 4,608,485 bytes; SHA-256 `fc6b2e6bb49f78fbc1263ac73aa592eaf6207d621d88079e3456475fb4140afb` |
| [Official Production Release](https://github.com/signal0verse/signalverse-main/actions/runs/36933506630) | Run `36933506630`, `production-release.yml`, exact current SHA, `main`, workflow_dispatch, success; actor `signal0verse` |
| GitHub Production deployment | ID `6796376408`, created 2026-10-01T22:11:20Z, success status 2026-10-01T22:13:47Z, log URL points to release job `110608242359` |
| Existing Guard | UUID `036343a0-cc66-40e9-b6c1-a894e8904cb6`, exact current SHA and inner digest; root:root regular file mode 0600 |
| Existing consumed receipt | Present with same UUID/SHA/digest/issued-at/expiry; target claim absent; revocation absent |
| Actual incoming archive | `/var/lib/signalverse-deploy/incoming/84f27c2e40b02b0dbf61c58429cf7c45f4f852da.tar.gz`, root:root 0600, same exact inner digest and size |

Preparation metadata logged at 22:02:03.8436128Z identifies contract `git-archive-lf-v1`, exact commit, inner digest/size, run `36932516764`, attempt `1` and identical workflow SHA. Release logs independently identify the same retained artifact/run and inner digest; retained-byte verification logged at 22:11:34.1481376Z identifies the exact SHA, digest and 4,608,485 bytes. The native archive embedded commit read returned the exact target. This audit did not download, replace, unpack to disk, rebuild or repackage any artifact.

The Guard was issued at `2026-10-01T22:11:04Z`, expiry `2026-10-01T23:11:04Z` (native integer values 1790892664 / 1790896264). It was consumed during its validity, and is now historical consumed evidence; this report does not create/renew/inspect it through a mutating helper or claim that it is available for reuse.

Exact relevant journal records (timestamps from journal; inner messages retained verbatim):

```text
2026-10-01T22:11:34.734Z signalverse-deploy-receiver.service
{"event":"deploy_receiver","at":"2026-10-01T22:11:34.731Z","requestedSha":"84f27c2e40b02b0dbf61c58429cf7c45f4f852da","approvedSha":"84f27c2e40b02b0dbf61c58429cf7c45f4f852da","authorizationId":"036343a0-cc66-40e9-b6c1-a894e8904cb6","version":1,"validation":"PASS","consume":"NOT_STARTED","activation":"NOT_STARTED"}
2026-10-01T22:11:35.464Z signalverse-deploy-receiver.service
{"event":"deploy_receiver","at":"2026-10-01T22:11:35.463Z","requestedSha":"84f27c2e40b02b0dbf61c58429cf7c45f4f852da","approvedSha":"84f27c2e40b02b0dbf61c58429cf7c45f4f852da","authorizationId":"036343a0-cc66-40e9-b6c1-a894e8904cb6","version":1,"validation":"PASS","consume":"CLAIMED","activation":"QUEUED"}
2026-10-01T22:13:39.203Z signalverse-deploy-artifact@84f27c2e40b02b0dbf61c58429cf7c45f4f852da.service
{"event":"release_authorization","requestedSha":"84f27c2e40b02b0dbf61c58429cf7c45f4f852da","approvedSha":"84f27c2e40b02b0dbf61c58429cf7c45f4f852da","authorizationId":"036343a0-cc66-40e9-b6c1-a894e8904cb6","version":1,"validation":"PASS","consume":"PASS","activation":"NOT_STARTED"}
2026-10-01T22:13:41.902Z signalverse-deploy-artifact@84f27c2e40b02b0dbf61c58429cf7c45f4f852da.service
{"event":"deploy_activation","requestedSha":"84f27c2e40b02b0dbf61c58429cf7c45f4f852da","activation":"PASS"}
```

The artifact unit completed successfully, final inactive/dead, PID 0, Result success, ExecMainStatus 0, NRestarts 0. Its final start/exit fields were empty; exact times come from journal, not fabricated unloaded fields. Activation at 22:13:41.902Z agrees with marker mtime and the application/admin/observer lifecycle at 22:13:39Z.

The coordinator's separate `BUILT` record at 22:13:35.193Z contained digest `fbd6312f1d9d0ba501eaed4ef4cf0bda1732cfe6ca00acab676a405538a8b1f1` and `auto_activation:false`. The inspected owned-bundle builder logs that digest for compiled `output/partner-copytrade/main.mjs`; it is **not** the release archive/Guard digest and is not an identity mismatch.

Installed control-plane files were only hashed: coordinator `928eefc39677fe27242f8d2762d7fb3de97bebd2ff8678c20e86ff22188ce308`; receiver `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa`; both installed authorization-helper paths `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83`. No Guard/control-plane repair or modification was made.

## 4. Exact existing CI evidence

CI run `36932028039` has one successful job, `Build web and API runtime` (`110603445348`), from 21:57:18Z to 22:01:23Z. **39/39 executed API step records succeeded, 0 failed, 0 skipped**; step numbers are sparse because post-actions use numbers 71–73, not 39 contiguous numbers. Existing log reports Node `v22.23.3`. No new CI/test was run by this audit.

| Step number | Name | Result |
| ---: | --- | --- |
| 1 | Set up job | success |
| 2 | Check out repository | success |
| 3 | Set up Node.js | success |
| 4 | Install dependencies | success |
| 5 | Install isolated admin runtime dependencies | success |
| 6 | Test independent admin auth and live transport offline | success |
| 7 | Test partner host context and unchanged Telegram authentication offline | success |
| 8 | Build reusable partner terminal (no activation) | success |
| 9 | Test isolated internal paper and exact original UI parity | success |
| 10 | Build full terminal candidate (no activation) | success |
| 11 | Test owned native copy-trading without accounts or provider access | success |
| 12 | Typecheck standalone admin UI | success |
| 13 | Test learning extraction without live services | success |
| 14 | Test GitHub event transport without live services | success |
| 15 | Test historical timing without live services | success |
| 16 | Test futures simulation exits without live services | success |
| 17 | Test futures simulation chronology without live services | success |
| 18 | Test futures simulation accounting without live services | success |
| 19 | Test futures simulation capital reservation without live services | success |
| 20 | Test versioned simulation analytics without live services | success |
| 21 | Test real execution faults with isolated transports | success |
| 22 | Test opt-in Futures Profit Protection without private services | success |
| 23 | Test Futures Pro scheduler deadlines and failure rotation without services | success |
| 24 | Test Futures Market Discovery (pure core, venue adapters, simulator, Demo list upkeep) without services | success |
| 25 | Test whale data and watchlist without live services | success |
| 26 | Test stablecoin engine (Binance spot, demo-only) without live services | success |
| 27 | Test stablecoin market data collector (read-only, no trading) without live services | success |
| 28 | Test prediction market autonomous engine without live services | success |
| 29 | Install disposable SQL test runtime | success |
| 30 | Test durable entry claims in a new private PostgreSQL cluster | success |
| 31 | Test Profit Protection close ownership in disposable PostgreSQL | success |
| 32 | Test Whale Demo pipeline and transactions in disposable PostgreSQL | success |
| 33 | Test admin monitoring grants in a new private PostgreSQL cluster | success |
| 34 | Build web application | success |
| 35 | Bundle server API handlers | success |
| 36 | Verify expected artifacts | success |
| 71 | Post Set up Node.js | success |
| 72 | Post Check out repository | success |
| 73 | Complete job | success |

Preparation had 10/10 successful executed steps; official release had 11/11; both zero failed/skipped. Existing CI's PP suite log reports **93 tests, 93 passed**, and explicitly records all nine Worker bootstrap cases as `ok 38` through `ok 46` at 21:59:20Z. These are real prior Linux child-process/filesystem tests against disposable fake imports, **not** a Production Worker smoke or private-account execution proof.

## 5. Complete base-to-current file inventory

**47 paths: 26 added, 21 modified, 0 removed, 0 renamed; 1,793 added lines and 54 deleted lines.** This is the existing Git delta, not changes made in this task. The release is broader than PP-only: it adds the owned CrossVerse bridge/UI/schema/unit sources, updates integration/test parity and adds a coordinator build step. Nothing in this audit approves or activates those additional features.

| Status | Path | + | − |
| --- | --- | ---: | ---: |
| modified | `.github/workflows/production-ci.yml` | 5 | 0 |
| modified | `HANDOFF.md` | 12 | 0 |
| added | `api/_shared/partner-copytrade-context.ts` | 33 | 0 |
| modified | `api/analyze.ts` | 10 | 2 |
| modified | `api/copytrade.ts` | 35 | 9 |
| modified | `docs/AI_HANDOFF.md` | 12 | 0 |
| added | `docs/partner-copytrade.md` | 157 | 0 |
| added | `migrations/partner_copytrade.sql` | 168 | 0 |
| modified | `ops/signalverse-deploy` | 4 | 0 |
| added | `ops/signalverse-partner-copytrade-postgrest.service` | 20 | 0 |
| added | `ops/signalverse-partner-copytrade.service` | 29 | 0 |
| modified | `scripts/binance-final-funding-test.mjs` | 1 | 1 |
| added | `scripts/build-partner-copytrade.mjs` | 15 | 0 |
| modified | `scripts/full-terminal-contract-test.mjs` | 3 | 2 |
| modified | `scripts/futures-profit-protection-scope-test.mjs` | 32 | 8 |
| modified | `scripts/futures-profit-protection-test.mjs` | 4 | 3 |
| modified | `scripts/futures-real-execution-fault-test.mjs` | 1 | 1 |
| modified | `scripts/futures-simulation-accounting-test.mjs` | 1 | 1 |
| modified | `scripts/futures-simulation-capital-test.mjs` | 1 | 1 |
| modified | `scripts/lib/futures-pure-test-context.mjs` | 2 | 1 |
| added | `scripts/lib/owned-copytrade-analyze-delta.patch` | 57 | 0 |
| added | `scripts/lib/owned-copytrade-api-delta.patch` | 157 | 0 |
| added | `scripts/lib/owned-copytrade-delta.json` | 22 | 0 |
| added | `scripts/lib/owned-copytrade-parity.mjs` | 24 | 0 |
| added | `scripts/lib/owned-copytrade-pp-test-delta.patch` | 20 | 0 |
| added | `scripts/lib/owned-copytrade-ui-delta.patch` | 142 | 0 |
| added | `scripts/live-copytrade-transport-test.mjs` | 42 | 0 |
| added | `scripts/partner-copytrade-contract-test.mjs` | 70 | 0 |
| added | `scripts/partner-copytrade-native-service-test.mjs` | 50 | 0 |
| added | `scripts/partner-copytrade-sql-test.py` | 97 | 0 |
| modified | `scripts/terminal-view-parity-test.mjs` | 2 | 1 |
| modified | `scripts/trade-onboarding-test.mjs` | 2 | 1 |
| modified | `scripts/whale-watchlist-test.mjs` | 2 | 1 |
| added | `server/partner-copytrade/contract.mjs` | 53 | 0 |
| added | `server/partner-copytrade/database.mjs` | 74 | 0 |
| added | `server/partner-copytrade/http.ts` | 29 | 0 |
| added | `server/partner-copytrade/main.ts` | 12 | 0 |
| added | `server/partner-copytrade/network.mjs` | 60 | 0 |
| added | `server/partner-copytrade/receipts.mjs` | 16 | 0 |
| added | `server/partner-copytrade/service.ts` | 114 | 0 |
| modified | `src/app/App.tsx` | 19 | 16 |
| modified | `src/app/host/customer-host.tsx` | 1 | 0 |
| modified | `src/terminal/full-mount.tsx` | 11 | 6 |
| modified | `src/terminal/full-terminal.css` | 7 | 0 |
| added | `src/terminal/live-copytrade-i18n.ts` | 20 | 0 |
| added | `src/terminal/live-copytrade.tsx` | 70 | 0 |
| added | `src/terminal/live-transport.ts` | 75 | 0 |

CI adds an isolated owned-native integration gate. `ops/signalverse-deploy` adds compilation/syntax checking of the owned bundle from the same approved archive; the source patch itself does not install a unit or activate a worker. Source documentation describing a candidate as not activated is **not runtime evidence**: the actual owned units were found active during this audit.

## 6. PP compatibility and exact source changes

Static AST comparison of `api/copytrade.ts` found **404 baseline named function declarations, 406 current, no missing functions**. Twelve functions changed: `getCreditConfig`, `logToGitHub`, `getFlags`, `isVipUser`, `deployRealSpotLimitLadders`, `evaluateSpotCycleStepReal`, `tryAutoContinueSpotCycle`, `tryAutoAdvanceScenario`, `checkPendingSignals`, `handleCronSyncAll`, `ensureProfitProtectionMonitor`, `handler`. Two were added: `profitProtectionMonitorTick`, `handleAuthenticatedCopytrade`.

The owned context uses AsyncLocalStorage and proxies DB/fetch/log/pricing for owned calls; without an owned context it selects the existing legacy client/transports. Authentication is split into the existing session-authenticating wrapper and an exported authenticated handler. Existing owned maintenance/entry gates and isolation are source changes, not a claim of verified operational equivalence across all products.

PP monitor extraction was checked directly, not accepted from a test name: the old nested tick's **try block and catch clause are text-identical** to the exported `profitProtectionMonitorTick`; the latter returns the calculated interval, and the existing timer host schedules the next non-overlapping tick. Original `finally` scheduling was moved to the host after the awaited exported tick. The bootstrap remains guarded only by the explicit Worker flag. The change makes the monitor callable by a separate owned-context service; therefore a stopped canonical Worker cannot establish that every PP-capable host is stopped.

AST byte comparison independently confirmed unchanged native `closeMexcTrade` (current line 644), `closeGateTrade` (7859), `closeBinanceTrade` (8834), all corresponding apply/sync Real functions, `getFuturesExchangeAdapter` (10512), `futuresProWatchTick` (11926), `cleanupProfitProtection` (16122), and `runProfitProtectionPosition` (16147). `runProfitProtectionPosition` rejects Fast Trader and whale jobs, reads the persisted native epoch, passes the full native quantity to the existing adapter, requires durable close ownership and performs flat-first cleanup/reconciliation. No partial-close/replacement-SL/TP/AI exit branch was added to these functions.

| Required source property | Static finding/evidence |
| --- | --- |
| Canonical Worker entrypoint fix | PRESENT; Worker bytes identical to `66f3...`; canonical realpath entry/module URLs, invalid-path fail-closed, explicit flag requirement |
| Nine bootstrap cases | All nine case source bytes unchanged; prior exact-SHA Linux CI explicitly passed all nine |
| Deterministic PP policy | `futures-profit-protection.ts` unchanged; pure evaluation/configuration and executable full-depth quote calculation |
| State machine | Lifecycle unchanged: DISARMED/ARMED/PREPARED/SUBMITTED/UNKNOWN/FLAT/CLEANUP/RECONCILED; no uncertain resubmission |
| Full-position close model | Tracked execution/lifecycle and native close functions unchanged; fresh full-size epoch before durable admission and independent flat read |
| Native SL / ONE TP | Existing native apply/sync/close functions preserved; immutable original stop/TP identity; cleanup only after flat, no replacement path |
| No partial-close model | Full native quantity only; unexpected remainder retained UNKNOWN, no blind remainder retry |
| No dynamic SL/TP | Policy/lifecycle contain no replacement stop/TP mechanism; cleanup remains flat-only |
| No AI-generated PP exit | Pure policy/lifecycle/execution unchanged and do not call an AI/reviewer/entry engine |
| Scanner independence | Discovery core and watcher function unchanged; canonical PP bootstrap separate; no scanner hook introduced in PP policy/lifecycle |
| Fast Trader separation | Explicit Fast Trader/whale rejection in unchanged PP position driver; no pure-policy/lifecycle dependency |
| Exchange adapter architecture | Existing venue-specific position/funding/depth/full-close/reconciliation routing preserved; only an additional owned transport/context host was added |

`PP_SOURCE_COMPATIBILITY=COMPATIBLE` means **only the expected canonical architecture/Worker source is present and preserved**. It is not a sign-off on the additional owned runtime or its live behavior. The final task result remains SAFETY STOP, not PASSED.

PP tests changed only the historical parity assertion to first reverse the exact owned adapter patch. Scope tests add explicit owned-path inventory/frozen patch reversal and preserve current-main onboarding bytes; they are no longer a PP-only path inventory. The frozen reverse-patch helper checks the patch digest, exact hunk text and original complete source bytes, not a wildcard trading-function exemption. The nine canonical Worker bootstrap cases themselves are unchanged. Static inspection and prior CI evidence are distinct from new/runtime testing, which was prohibited and not performed.

## 7. Git-to-installed source hashes

Each hash below is SHA-256 of exact canonical source bytes, not a Windows normalized checkout estimate. All listed current values matched installed VPS files. Unchanged means equality to baseline `66f3...`.

| Path | Current SHA-256 | Baseline relationship |
| --- | --- | --- |
| `server/futures-profit-protection/worker.mjs` | `fa8a6ec35b007515876387eebd04aa31bb0d5c81cb63ad14dcfd744a62aabe17` | identical |
| `api/_shared/futures-profit-protection.ts` | `832a06acc20a4ec47fc89d564c4f30c7e0b44357a11ba93a144a9dd12fe6950d` | identical |
| `api/_shared/futures-profit-protection-lifecycle.ts` | `5e4e23f7a0f69310993666940b27f18c23bb0b4a98d05d7071fd0efb356dbab4` | identical |
| `api/_shared/futures-profit-protection-execution.ts` | `224ca45ff2b89c1475cb28160faad871cc36ab5e2cd21abdeef9e83b149f0c7c` | identical |
| `docs/futures-profit-protection.md` | `7bdd6bacb9c603ba2fa3a2d75a382ad0ff9c9fcbdf24da3d117f94cf9eff6b6c` | identical |
| `ops/signalverse-futures-profit-protection.service` / installed base unit | `d562e0803f18a0972f8f643dc6998c7cef478f2b922236ed0eb923600233f66d` | identical |
| `api/_shared/futures-decision-engine.ts` | `8313b5618859675e15d09fc5565de5fc4a2ebd934754eda6f04a844335ea926b` | identical |
| `api/_shared/futures-risk.ts` | `1c93cfe14b16796c0333cca260a21d6f54f7d694b93ebc50f9a977131015bc03` | identical |
| `api/_shared/futures-market-discovery.ts` | `899d5aaf900cc81fed6a651e1dd5f8238f8f9d08db3c47792604c363b23ede39` | identical |
| `api/_shared/futures-candle-provenance.ts` | `dbd0f68a2027337277b2c7f1e715102b4146379d682f7c72515e0212e9b4a829` | identical |
| `api/copytrade.ts` | `d6f78b8055197486fddf0e7f1cb603c8fcc27efca0529c7e64ec66936fc82731` | changed by inspected owned-context/handler/monitor extraction |
| `scripts/futures-profit-protection-test.mjs` | `0dc5f56b5fed975a81568d38b86d54b6ba9b17a86ff021ecca4a7f359f40e6d3` | parity wrapper change; bootstrap cases unchanged |
| `scripts/futures-profit-protection-scope-test.mjs` | `64690dd4adf5b8e8932ef83f82671d5252fb6f42fbf386bac84fd171217bdc45` | inspected broader owned integration scope |

The deployed Worker path is `/opt/signalverse/app/server/futures-profit-protection/worker.mjs`, resolving inside `84f27...`. Git blob is `f4f2d788b05951dabf774159559d5b9d9649cf3a`. Identical Worker bytes occur in both commits; a hash alone cannot say the file originated exclusively in one commit. Its current release container is `84f27...`, with unchanged `66f3...` implementation.

The compiled public API hash was `ac58cc110159ba3e4da0bc7adf6c64c07fa357f28a2462738caa029d2678cb25`, 1,128,799 bytes. Static text contains pure policy/lifecycle/tracked close, canonical position driver/exported monitor, three native close functions, explicit Worker flag guard and owned context. This confirms code presence, not execution or fresh bundle rebuild verification.

Existing Worker override hash `8abd593c611846bf1d2a3967bdf3a970d3fb85e00d277bec9deb2e41abf16695` and environment-file hash `8f6532d0ab00e69e1b0f9637e5ec896724563ae34126a3830f8ceb232cfa0af3` equal the recorded earlier Phase 5M-C values. No environment contents/secrets were exposed or changed.

## 8. Worker state and read-only DB/activity findings

Canonical unit: `/etc/systemd/system/signalverse-futures-profit-protection.service`, override `signalverse-futures-profit-protection.service.d/override.conf`.

```text
WORKER_EXECSTART=/usr/bin/node /opt/signalverse/app/server/futures-profit-protection/worker.mjs
WORKER_WORKINGDIRECTORY=/opt/signalverse/app
WORKER_ENABLED=NO (disabled)
WORKER_ACTIVE=NO (inactive/dead)
WORKER_PID=0
WORKER_RESTARTS=0
```

The base unit is Type=simple, user/group signalverse, BindsTo/PartOf main, Restart=on-failure, UMask 0077, NoNewPrivileges/PrivateTmp/ProtectSystem=strict/ProtectHome. The existing override points EnvironmentFile to `/etc/signalverse/signalverse.env`. No unit/configuration changes were made.

Public database checks used exactly `BEGIN READ ONLY`, transaction-local lock timeout 2 seconds, statement timeout 5 seconds, aggregate SELECT and `ROLLBACK`. Observed database `signalverse_cutover2`, `transaction_read_only=on`.

| Public-schema observation | Count/value |
| --- | --- |
| Control rows | 1 |
| Real PP | true / ON |
| Demo PP | true / ON |
| Control updated_at | 2026-10-01T22:02:54.495Z |
| PP state rows | 0 |
| PP-enabled rows | 0 |
| PP close intents | 0 |
| PP-closed copy-trade records | 0 |
| All public close intents | 0 |
| Uncertain EXIT_SUBMITTED/UNKNOWN public close intents | 0 |

Prior Phase 5M-C evidence at 2026-10-01T21:20:28Z recorded both controls OFF with updated_at 11:30:19.817Z. The current ON timestamp is a proven **control/configuration state change**, not evidence that PP closed a position. No actor is inferred. No private trade/account rows were enumerated.

Journal aggregate for selected **public app/admin/observer/canonical PP Worker** units from 2026-10-01T21:20:28Z to the read at 2026-10-02T07:14:31Z: 612 records, 0 canonical Worker records, 0 messages containing `PROFIT_PROTECTION`. The ordinary three-service stop/start at 22:13:39Z belongs to the existing official release. These aggregates exclude the newly discovered private owned service; they cannot prove absence of all PP execution across every runtime.

At 07:18:31Z the additional owned services were discovered active. Minimal confirmation at 07:19:04Z found:

```text
ALTERNATE_UNIT=signalverse-partner-copytrade.service
ALTERNATE_ACTIVE=active/running
ALTERNATE_ENABLED=enabled
ALTERNATE_PID=3092803
ALTERNATE_RESTARTS=0
ALTERNATE_START=2026-10-01T22:15:48Z
ALTERNATE_WORKINGDIRECTORY=/opt/signalverse/partner-copytrade
ALTERNATE_PROCESS_CWD=/opt/signalverse/releases/84f27c2e40b02b0dbf61c58429cf7c45f4f852da
FUTURES_PROFIT_PROTECTION_WORKER=0
PARTNER_COPYTRADE_ENABLED=1
PARTNER_COPYTRADE_WORKER=1
```

Inspected `server/partner-copytrade/main.ts` passes `worker: process.env.PARTNER_COPYTRADE_WORKER === '1'` to its service host. Inspected `service.ts` has a `profit-protection` sweep: for a USDM account, within the owned AsyncLocalStorage context it calls the exported original `profitProtectionMonitorTick`. Thus the active separate worker-mode host has a PP-capable source path. **Actual loop invocations, mode controls/position counts in its private namespace, trading activity and complete scheduler runtime behavior were not audited**, because the unexpected-worker safety stop takes precedence. No inference of an actual PP submission is made.

`RECENT_PP_ACTIVITY=DETECTED` refers to the confirmed mode-control change and active alternate worker configuration; **public PP execution evidence is NONE in the bounded inspected sources, alternate execution is UNKNOWN**. It must not be read as a confirmed order/close. No system-wide zero-trading claim is made.

## 9. Required final fields

```text
PHASE=5N-A
PREVIOUS_APPROVED_SHA=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
CURRENT_PRODUCTION_SHA=84f27c2e40b02b0dbf61c58429cf7c45f4f852da
RUNTIME_IDENTITY_MATCH=YES
RUNTIME_IDENTITY_CONFLICT=NO
CURRENT_SHA_COMMIT_EXISTS=YES (GitHub; absent locally; no refs changed)
CURRENT_SHA_BRANCHES=origin/main contains it; no exact-tip branch returned; other ancestry not exhaustively listed
CURRENT_SHA_PARENT=047da57853d4cef0c519c8b945ae27729e3b1e6c
CURRENT_SHA_COMMIT_TIMESTAMP=2026-10-01T21:57:04Z
CURRENT_SHA_COMMIT_SUBJECT=test: inspect native authenticated handler for final funding routing
CURRENT_SHA_IS_MERGE=NO
DEPLOYMENT_ORIGIN=OFFICIAL_PRODUCTION_RELEASE
DEPLOYMENT_EVIDENCE=release 36933506630; deployment 6796376408; native Guard receipt/journal; matching delivered digest/embedded SHA/runtime
PRODUCTION_ARTIFACT_ID=11195959952
PRODUCTION_ARTIFACT_DIGEST=fc6b2e6bb49f78fbc1263ac73aa592eaf6207d621d88079e3456475fb4140afb (inner archive)
PRODUCTION_RELEASE_TIMESTAMP=2026-10-01T22:13:41.902Z (native activation journal)
CI_RUN_ID=36932028039
CI_SHA=84f27c2e40b02b0dbf61c58429cf7c45f4f852da
CI_RESULT=PASS
CI_JOBS=1/1 success
CI_STEPS=39/39 executed success
CI_FAILED=0
CI_SKIPPED=0
COMMON_ANCESTOR=66f3ac2e89d1c40543851c6a9b1f46318d6f6a12
BASE_TO_CURRENT_COMMIT_COUNT=5
BASE_TO_CURRENT_FILE_COUNT=47
CHANGED_FILES=complete 47-path inventory in section 5; 26 added/21 modified/0 removed/0 renamed
PP_SOURCE_COMPATIBILITY=COMPATIBLE (canonical source only; alternate runtime not accepted)
WORKER_ENTRYPOINT_FIX_PRESENT=YES
WORKER_SOURCE_SHA256=fa8a6ec35b007515876387eebd04aa31bb0d5c81cb63ad14dcfd744a62aabe17
WORKER_SOURCE_GIT_SHA=84f27c2e40b02b0dbf61c58429cf7c45f4f852da release container; identical canonical Worker bytes in 66f3...
WORKER_UNIT=signalverse-futures-profit-protection.service
WORKER_ENABLED=NO
WORKER_ACTIVE=NO
WORKER_PID=0
WORKER_RESTARTS=0
REAL_PP=ON
DEMO_PP=ON
PP_STATE_ROWS=0 (public schema)
PP_ENABLED_ROWS=0 (public schema)
PP_CLOSE_INTENTS=0 (public schema)
PP_CLOSED_RECORDS=0 (public schema)
RECENT_PP_ACTIVITY=DETECTED (control change and alternate worker configured; no confirmed exchange execution)
UNEXPECTED_WORKER_ACTIVE=YES (alternate owned worker-mode service, not the canonical unit)
DATABASE_MUTATION=NO
EXCHANGE_ACTIONS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_ACTIONS=0
TP_ACTIONS=0
CLOSE_ACTIONS=0
FINAL_CLASSIFICATION=PHASE 5N-A SAFETY STOP — UNEXPECTED WORKER ACTIVITY DETECTED
```

All zero action counters above refer to **this audit's own actions**, not every other process/operator on the system.

## 10. Limits, operational stop and publication

- No target SHA selected or newly approved. No rollback to `66f3...`, no deployment of `84f27...` or newer main, no restart, no Worker/PP enable/disable, no source/config/DB/authorization/artifact mutation, no exchange test/call.
- Current ON controls and the alternate worker-mode host mean an original OFF/no-worker smoke cannot be resumed by assumption. The owner must decide the next separately scoped action; this audit does not disable the live host or inspect/change its accounts.
- Source compatibility is not live Worker initialization, blanket no-I/O/no-DML behavior, native protection effectiveness, private execution, profitability, or acceptance of CrossVerse integration. Existing uncertain-close reconciliation is present and must not be reset/removed to make a test green.
- Discovery interrupted final full after-snapshot and alternate scheduler/namespace inspection, intentionally. Evidence collection stopped immediately after confirming its worker flags/provenance. Reporting/secret review and AI-Log documentation publication do not continue the operational audit.
- A read-only archive pipeline returned the correct embedded SHA but exited nonzero after the consumer closed the stream under pipefail; remaining checks were not treated as executed. Installed static/service reads were then collected by a separate read-only command. No artifact was changed and no Production defect was inferred from that diagnostic pipeline exit. The first local scanner-path lookup was absent; the existing AI-Log pinned scanner was instead read completely, not recreated in the app.
- Prior Phase 5M-C and Phase 5N reports remain unchanged; their OFF/blocked findings describe their own timestamps and are not retroactively rewritten.
- Publish only this sanitized report under `SignalVerse-AI-Log/master/reports/futures/`, verify exact remote bytes and report-only commit, then provide the verified publication SHA/link in the conversation. No application commit exists for this task; the AI-Log publication SHA is separate and not an application release identity.

**Hard stop retained: no automatic continuation after this report.**
