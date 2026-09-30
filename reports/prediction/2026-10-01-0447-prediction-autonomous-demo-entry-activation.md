# Prediction Autonomous Demo Entry — controlled activation and natural observation

## Identity / authorization

- Date: 2026-10-01, Asia/Kuala_Lumpur (UTC+08).
- Owner's new explicit instruction: enable autonomous **DEMO ONLY**, retain all
  existing engine/risk/allowlist/fail-closed rules, keep Prediction Real OFF.
  This supersedes the previous collector-only prohibition on the entry gate.
- Starting production SHA: **d8a52c019a00dd4add9b8153cd8c684a3ee00806**.
- Final deployed production SHA: **6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d**.
- [PR #185](https://github.com/signal0verse/signalverse-main/pull/185): head and
  merge_commit_sha equal this exact target. Normal fast-forward from its direct
  parent; no replacement merge, force push, unrelated work or moving-HEAD release.
- Application release completed: **2026-09-30T20:44:33Z** / 2026-10-01 04:44:33 +08.
- Demo gate activation: **2026-09-30T20:47:28.664Z** / 2026-10-01 04:47:28.664 +08.
- Entry state: **OFF -> ON**, Prediction Real: **OFF -> OFF**, Prediction
  Autonomous Learning: **OFF -> OFF**.
- After verification, the mandatory documentation-only HANDOFF commit
  **2eb410369d4efba1d218e513340c4860c58e319b** was normally fast-forwarded to main
  with **[skip ci]**. It changes only the new activation note in HANDOFF.md.
  Source main is therefore newer than deployed source; runtime remains pinned to
  **6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d**. No second application release.

Statistical validation / Phase 9A: **NOT COMPLETE**. This task enables the existing
Demo path; it does not validate profitability, calibration or model/AI superiority.

## Audit before changes / exact minimal issue

Live read-only preflight at 2026-09-30T20:23:53Z verified the starting runtime,
healthy service, previous release, scheduler configuration and production schema.

The existing fast runner dispatched discovery, shadow-entry and resolve, but
contained **no autonomous-enter dispatch**. Creating prediction-enter-cron alone
would have been a no-op. The existing per-user account table already had two
opted-in accounts; their preferences and risk limits were preserved, not enabled
or edited by this task. The autonomous Demo ledger had zero rows of any status.
Prediction Real trades and calibration snapshots were also zero.

The actual timer is signalverse-fast-jobs.timer/service, not the reversed
signalverse-jobs-fast name initially probed. Its existing calendar is every five
minutes, existing oneshot service runs the existing fast runner. No timer/service
was added, restarted or manually triggered for Demo activation.

The only functional change is one independent prediction-enter-cron block in
the **same** /usr/local/libexec/signalverse-jobs runner. It calls the existing
cron-authenticated /api/predictions?action=autonomous-enter once per fast cycle,
after existing shadow entry and before existing resolution. The legacy database
run-type label **entry_real means actual Demo ledger inserts**, not funded
Polymarket execution. Shadow remains enabled independently; this is not a
replacement with more shadow-only work.

## Production-readiness evidence / preserved behavior

| Requirement | Verified existing implementation / limit |
| --- | --- |
| Supported markets | v2 admissible verified BTC/ETH/XRP price templates only; unsupported questions abstain |
| Gates | Original H1-H8, 24h-7d horizon, tradeability and ranking unchanged |
| Stability | Same-side actionable previous v2 tick, 3-15 minutes old; same-tick duplicates excluded |
| Fresh revalidation | Current Gamma active/closed/horizon/liquidity/token mapping plus current chosen-side CLOB asks; failure prevents entry |
| Per-user sizing | Existing conservative Kelly -> own account per-trade cap -> own available capital; no parameters edited |
| Ownership | Existing opted-in user's own telegram_id, category preferences and isolated balance/positions/PnL |
| Ledger | Existing prediction_autonomous_trades; no second ledger or migration |
| Duplicate protection | Application check plus verified production partial unique (telegram_id, market_id) WHERE status='OPEN' |
| Trade reconstruction | Existing market/condition/prediction link, side, book-walk simulated entry price, entry fee/slippage, size, Kelly amount, opened_at default |
| Monitoring | Existing read-only user-scoped positions API gets current chosen-side CLOB bids and computes unrealized PnL; unavailable price is null |
| Settlement | Existing natural resolver gets actual CLOB winner, idempotent OPEN->CLOSED update, close time/price/outcome/reason and gross/net PnL |
| UI/history | Existing open marks and closed history expose entry/size/side/fee/gross/net PnL/timestamps/settlement and win/loss |
| Real boundary | Prediction Real position actions remain unconditionally 501; this path has no wallet/order/signing adapter |

All fields required to reconstruct an entry and settlement already exist in the
production schema. SQL index/constraints/column inspection passed without applying
DDL. UI/API and lifecycle are verified structurally and by isolated actual-handler
tests; a live empty ledger cannot demonstrate a position's changing price or closure.

Detailed aggregate trade/category/YES-NO/question-type and average holding time
are derived read-only from this same ledger. The existing UI does not already
provide a complete all-time drawdown/performance dashboard; no missing metric is
fabricated or represented as a completed dashboard. Max drawdown is NOT_IMPLEMENTED
for this autonomous ledger.

## Files / tests / protected-source audit

Exact source commit changes only four files:

- deploy/prediction/signalverse-jobs.sh: reviewed current runner plus the one Demo block.
- scripts/prediction-demo-job-test.mjs: real shell, temporary gates and mocked curl;
  no production bootstrap, env file, network or DB.
- .github/workflows/production-ci.yml: invoke this new test in existing CI.
- docs/prediction-autonomous-demo-activation.md: activation/reversal contract.

The shell test removes the added block and reproduces the installed baseline's
SHA-256 exactly. Thus every original scheduler byte, including all unrelated
jobs, is preserved. Git diff from the previous runtime is empty for all api,
src, migrations and server paths. No engine math, classifier, crypto model,
H1-H8, AI/provider policy, risk/Kelly/sizing, fresh revalidation, duplicate
protection, resolution, user isolation, A-mode timeout, Futures, Spot,
Fast Trader, Supervisor or wallet code changed.

| Check | Result |
| --- | --- |
| Local isolated Prediction suite | 25 explicit safe files, 147 node-runner entries, 147 PASS, zero failed/skipped; includes 7 new shell cases |
| Demo lifecycle | Actual handler in memory with synthetic feeds/accounts; entry, fresh revalidation, per-user creation, duplicate prevention, marks, settlement, fees/PnL, idempotency, auth/isolation and Real 501 covered |
| Scheduler behavior | Absent/present gate, one Demo call, missing secret fail-closed, entry failure preserves resolver, alerts unchanged, gate removal preserves resolve |
| Local builds | Web, admin and all 14 API handlers PASS; local Node 24.19.0, API target Node22 |
| [PR CI 36773636083](https://github.com/signal0verse/signalverse-main/actions/runs/36773636083) | Exact target, completed/success, CI Node22 |
| [Main-push CI 36773793571](https://github.com/signal0verse/signalverse-main/actions/runs/36773793571) | Exact target, completed/success; all existing checks retained |

No production-writing legacy position-credit test was run. The first sanitized
Windows subprocess environment omitted standard OS variables: Node crypto startup
then Vite homedir lookup failed locally. Required OS variables were restored,
the isolated tests and builds passed; CI independently passed on Node22. Failed
local environment attempts are not counted as PASS or production failures.

Automatic approval initially rejected the main push by interpreting the older
entry prohibition as current. The exact new owner attachment and manual-only
release workflow were read as authorization evidence; the same normal push was
then approved. No workaround or bypass occurred; no approval blocker remains.

## Immutable artifact / controlled deployment / runtime

- [Prepare-only run 36774315582](https://github.com/signal0verse/signalverse-main/actions/runs/36774315582): success, exact target.
- Immutable artifact ID: **11124768229**, attempt 1, non-expired.
- Inner release archive: **4,445,962 bytes**.
- Independently computed inner SHA-256:
  **392605e5eae808e499dcb0328f221066b3c8ae9ce6da9d6fc5437bce39ea02c9**.
- Existing release-artifact verifier confirmed repository/run/artifact/metadata
  and embedded Git commit. Independent archive audit checked all **684 files**
  against exact committed blobs; no private/untracked/env/test-output entries.
- Existing VPS authorization bound only this SHA/digest, consumed once by the
  unchanged controlled receiver/coordinator. No guard modification or bypass.
- [Release run 36774524557](https://github.com/signal0verse/signalverse-main/actions/runs/36774524557): completed/success, exact target.

Runtime check at 2026-09-30T20:45:11Z confirmed deployed-sha and both main/admin
release symlinks equal target, running process cwd equals the target release,
main/admin/observer active, main health ok, admin exact releaseSha and all
readiness flags true, public-info HTTP 200. Installed coordinator recorded
authorization consume PASS and activation PASS; exit 0. Received archive digest
matches inspected bytes, release-ready markers exist. All **684 deployed files**
match the approved artifact. Runtime delta is exactly the four reviewed files.

Prediction API source hash before/after is identical:
027b07f5ff3fe67fa2fafcb52b7be4d64c934ed7cabd2509cce7d9f4a9599ce8.

## Configuration activation / reversal state

Application release alone did not enable entry. After source/runtime checks, the
configuration install used the existing global deployment lock, exact SHA/source
and baseline runner hash checks, a retained root-private rollback directory,
syntax/byte verification and atomic file replacement. It exclusively created
only /etc/signalverse/jobs.d/prediction-enter-cron.enabled, root-owned 0644, empty.
No env, account, settings, other gate or timer edit occurred.

- Previous installed runner SHA-256:
  7654afb73c73c1035d8e0d0900aaf1d7c066f675d8c46be3d21faa22d66d9188.
- New installed runner SHA-256:
  e5065de3cca0911815cbab94bfdfa8187d4f26578372e5481690ff6dff46e0c9.
- All 13 previous gate content hashes and both existing fast service/timer
  file hashes verified unchanged. No autonomous-learn gate or dispatcher exists.
- One activation attempt was deliberately deferred while a natural cycle was
  in-flight; it exited before creating a backup or modifying any file. The next
  attempt installed successfully at the timestamp above. No manual job trigger.
- No application or configuration rollback occurred. Application previous main/
  admin pointers retain d8a52c019a00dd4add9b8153cd8c684a3ee00806.
- Exact previous runner and preactivation gate/timer hashes retained under
  /var/lib/signalverse-deploy/prediction-demo-entry-rollback-6e3cef7e1c50c69be43f5f4a9cd53bc6a2fa050d/.

If activation must be reversed, remove only the new Demo entry gate through
controlled operations; preserve resolution/monitoring for any open Demo rows.
Use the retained exact runner and existing application rollback procedure as
appropriate. Do not erase, fabricate, backfill or roll back the production DB.

## Natural production observation / actual performance

Observation window: **2026-09-30T20:47:28.664Z to 21:01:49.101528Z**
(local 2026-10-01 04:47:28.664 to 05:01:49.101528 +08). Three complete natural
fast cycles were observed; no scheduler or entry endpoint was manually invoked.
Each cycle completed discovery -> shadow -> actual Demo entry -> resolver, with
zero failed runs and no recorded run error. Times below are UTC; Discovery
eligibility means a scan candidate, not a qualified entry opportunity.

| Cycle | Discovery start / candidates / eligible | Actual Demo entry interval | Entry evaluated / recorded / opened | Resolver completion |
| --- | --- | --- | --- | --- |
| 1 | 20:50:58.999 / 229 / 33 | 20:51:17.453-20:51:23.248 (5,795 ms) | 50 / 50 / 0 | 20:51:25.815 |
| 2 | 20:55:48.601 / 229 / 35 | 20:56:02.808-20:56:11.328 (8,520 ms) | 50 / 50 / 0 | 20:56:13.922 |
| 3 | 21:00:59.806 / 231 / 36 | 21:01:18.236-21:01:23.264 (5,028 ms) | 50 / 50 / 0 | 21:01:26.753 |

These are **150 evaluations**, including repeat evaluations of markets across
cycles, not 150 unique markets. All 150 actual Demo decisions were NOT_ACTIONABLE:
98 INSUFFICIENT_DATA, 31 NEUTRAL, 20 WATCH and 1 AVOID. Qualified actionable
opportunities / would_open were **0**; actual autonomous Demo entries were **0**.
Separately, the unchanged shadow dispatcher evaluated/recorded 150 observations
and would have opened 0. The autonomous-enter path was actually invoked naturally
and completed, even though no opportunity passed the retained gates.

| Main Demo rejection code | Count |
| --- | --- |
| NOT_ACTIONABLE | 150 |
| REASON_NO_ADMISSIBLE_EVIDENCE | 54 |
| REASON_INSUFFICIENT_MARKET_DATA | 44 |
| REASON_NO_POSITIVE_EDGE | 31 |
| REASON_CONFIDENCE_BELOW_MIN | 20 |
| REASON_EDGE_BELOW_MIN | 20 |
| REASON_H6_TAIL_UNSAFE | 17 |
| REASON_MARKET_UNTRADEABLE | 1 |

Reason codes overlap; they must not be added into a distinct rejection total.
No trade was forced, no gate was loosened and no fixture was inserted.

| Actual autonomous Demo performance at observation end | Result |
| --- | --- |
| Total trades / positions opened | 0 |
| Current open / closed positions | 0 / 0 |
| Wins / losses / breakeven | 0 / 0 / 0 |
| Gross closed PnL / total entry fees / net closed PnL | 0 / 0 / 0 USDC |
| Win rate / average closed PnL per trade / average holding time | NULL / undefined: no closed trades |
| PnL by market category / YES-NO / question type | Empty cohorts: no trades |
| Max drawdown | NOT_IMPLEMENTED in the existing autonomous ledger UI |
| Invalid provenance / duplicate open groups | 0 / 0; empty-ledger checks, not live position acceptance |

**Activation is complete, but no natural qualified Demo Entry occurred during
the observation window.** The full natural entry -> inserted position -> marks ->
closure -> win/loss -> fees/net PnL -> history lifecycle is **NOT VERIFIED LIVE**.
Its isolated actual-handler tests passed; these do not replace a natural trade.
No profitability or nonzero-sample win-rate claim is justified by the empty ledger.

All three resolvers ran normally, with 0 Demo trades checked or settled. The
already-deployed bounded shadow collector remained active independently:

| Cycle | Markets / rows / lookups | Collector elapsed | Binary results / terminal nonbinary | Still unresolved / conflicts / errors / deadline |
| --- | --- | --- | --- | --- |
| 1 | 9 / 256 / 7 | 1,426 ms | 1 / 0 | 6 / 0 / 0 / false |
| 2 | 10 / 214 / 8 | 1,475 ms | 3 / 1 | 4 / 0 / 0 / false |
| 3 | 10 / 184 / 8 | 2,357 ms | 4 / 0 | 4 / 1 / 0 / false |

All observed work stayed within existing caps (12 markets, 256 rows, 8 lookups,
30 seconds). Rotation cursors advanced on each completed resolver. Unresolved
markets remained retryable; lookup-failure counters were 0. Eight binary outcomes
were explicitly chronology-unverified and must not be scored; one nonbinary
terminal outcome is not a binary score or Demo trade settlement.

The third-cycle conflict was independently inspected read-only at
2026-09-30T21:03:12Z: **PREEXISTING_OUTCOME**, terminal true, scoreEligible false,
no collector receipt. Existing YES and resolved_at **2026-09-30T00:58:48.542Z**
were identical to the preserved metadata values and predated activation. It was
not overwritten or scored. One initial diagnostic SELECT had an ambiguous column
alias and failed in a READ ONLY transaction; after qualifying the alias, the same
query succeeded. It did not alter production data. No production resolver error,
lookup failure, collection deadline timeout or Demo run retry occurred in these
three cycles. Future natural opportunities and retries are outside this window.

Final read-only safety check at **2026-09-30T21:01:49Z** confirmed the exact deployed
SHA, both symlinks and process cwd, healthy main service, active main/admin/observer
and existing fast timer waiting. Current runner hash and rollback runner matched
their expected hashes; all 13 previous gate hashes and service/timer file hashes
were unchanged. Exactly one Demo dispatcher is present, no Prediction learn gate
or dispatcher, and the new entry gate is root:root 0644/zero bytes. All audited
protected-source hashes match preactivation. The two existing enabled account
configurations were unchanged; new Prediction learn runs 0, calibration 0,
Prediction real trades 0, and Prediction-specific logged errors 0. These Learning
statements concern Prediction; unrelated preexisting learning jobs were preserved.

## Database / execution safety

All operator SQL transactions were explicitly READ ONLY with bounded statement/
lock timeouts. No manual DB UPDATE/INSERT/DELETE, migration, fixture/test user,
balance/risk/account edit or manually invoked resolver/entry endpoint occurred.
Normal existing scheduled discovery, shadow, Demo entry and resolver can write
their own approved application records; these are not operator-created fixtures.

Prediction Real settings remain absent/default OFF, architectural Real 501 is
unchanged, no Prediction real trade rows exist, learn remains unwired and
calibration empty. This task used no wallet private key, seed phrase, signer,
Polymarket order call, blockchain transaction, deposit or withdrawal. No such
execution capability exists in the activated route. Independent on-chain/private
wallet auditing was not performed; no claim is made about unrelated modules'
funded activity or wallets outside this task.

## Remaining limits / next engineering step

Activation is not full live trade-lifecycle acceptance. If no qualified opportunity
occurs, no live entry, mark progression, settlement, win/loss or fees/PnL lifecycle
can be certified. Keep the original allowlist/horizons/freshness/H1-H8/liquidity and
NO_TRADE behavior. Do not loosen gates, fabricate a fill or insert a test row.

Next engineering step: observe the first naturally qualified opted-in user's Demo
trade end to end and independently reconcile its decision/revalidation/book size/
fee/marks/CLOB outcome and gross-to-net settlement. Add a separate read-only
cohort performance reporter over the existing ledger if all-time grouped metrics
are needed; no second ledger, migration or strategy rewrite is authorized here.

**Phase 9A statistical validation remains NOT COMPLETE.** No profitability,
model/AI superiority or validation conclusion follows from initial Demo trades
or an empty sample. Chronology-uncertified historical observations are not scored;
all existing statistical minima and acceptance criteria remain unchanged.

Publication destination: SignalVerse-AI-Log, branch master, only
reports/prediction/2026-10-01-0447-prediction-autonomous-demo-entry-activation.md.
The report is reviewed for secrets/private account data; publication uses a new
file creation and compares the remotely returned Base64 content and Git blob
identity with the local file. The publication receipt is retained locally and
the verified report link is included in the final response. Unrelated files,
reports and the preexisting local HANDOFF changes are preserved; only the new
eight-line activation handoff note was committed in the source repository.
