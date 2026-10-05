# Futures entry freshness / AUTO quality — official Production deployment

## Metadata

- Date: 2026-10-05; evidence times UTC.
- Module: standard Real Futures new-entry freshness and AUTO candidate quality.
- Mode: exact retained-artifact release plus read-only post-deployment verification.
- Source repository: signal0verse/signalverse-main, main.
- Source/released commit: f71d287167a33fffa9b0af99e6fb2fd1a021c0c5.
- Previous runtime/rollback reference: 3e92cab7a36cc0021847b1f700b9b5a394c75b37.
- Final classification: **PRODUCTION_DEPLOYMENT_VERIFIED**; this is not profitability or private-account execution acceptance.

## Objective / authorization

After the exact SHA/artifact ID/digest confirmation question and the prior successful CI/artifact report, the owner explicitly authorized deployment: «دپلو کن اجازه داری». Issued ONE fresh approval for exactly those reviewed bytes and invoked ONLY the existing official Production Release workflow. No other source, manually rebuilt archive, alternative transport or ad-hoc installation was used.

The prior receipt remains an accurate historical record of the earlier authorization wait:
[retry, CI and artifact verification](https://github.com/signal0verse/SignalVerse-AI-Log/blob/2e2d4082958d5d66962a94bcea4c4bee879a0c4e/reports/futures/futures-entry-freshness-release-retry-2026-10-05.md).

## Pre-release checks

At2026-10-05T10:40:01Z, remote main and the clean isolated source checkout were exactly f71d287. Marker/main/admin symlinks remained3e92cab. Main/Admin health and read-only public-info passed. PP Worker was disabled/inactive/PID0. No target approval, claim, incoming archive or active/queued artifact activation existed. Natural fast-jobs/platform jobs were left untouched.

Installed control-plane hashes matched the previous read-only receipt:

```text
receiver=c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa
authorization_helper=acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83
coordinator=928eefc39677fe27242f8d2762d7fb3de97bebd2ff8678c20e86ff22188ce308
```

No control-plane code, workflow, service definition or persistent configuration was changed.

## CI / immutable artifact

- [Production CI37294274363](https://github.com/signal0verse/signalverse-main/actions/runs/37294274363): exact f71d287, main/push, SUCCESS,42/42 steps; Node22.23.3. Revalidated, not rerun during this deployment request.
- [Prepare-only37295268881](https://github.com/signal0verse/signalverse-main/actions/runs/37295268881): SUCCESS,10/10 steps; retained artifact11337594856.
- Artifact: production-release-f71d287167a33fffa9b0af99e6fb2fd1a021c0c5-37295268881-1.
- Embedded commit:f71d287167a33fffa9b0af99e6fb2fd1a021c0c5.
- Inner release.tar.gz SHA-256:90ab26a6e809f437743064c1a152f0a3c343a388db1f92159fc04fcaa81edb1f;4,830,900 bytes.
- Outer GitHub ZIP SHA-256:4693de0df783223721aca5fea6542fbd5649fb0a0cad6d6fc8d9a540f73d004e;4,831,845 bytes.
- Independent source/run/metadata/digest verification repeated before approval:PASS.
- Independent archive-to-canonical-Git verification repeated:820 regular blobs,54 directories and executable modes match. No archive extraction/execution in operator verification.
- Exact delivered VPS archive digest at10:41:53Z equals the approved inner digest. No repackaging between authorization and delivery. The existing coordinator's normal server-side build from that approved source archive is distinct from creating a second release archive.

## One-time Guard

Existing out-of-band root operator procedure was used under the existing global deployment lock; target absence and old-runtime identity were rechecked. Approval was written crash-safely, then inspected by the installed unchanged helper. No approval was claimed or consumed manually.

```text
GUARD_ID=9b6cf366-ed1e-41c4-895a-2d1a6ade788f
GUARD_SHA=f71d287167a33fffa9b0af99e6fb2fd1a021c0c5
GUARD_DIGEST=90ab26a6e809f437743064c1a152f0a3c343a388db1f92159fc04fcaa81edb1f
ISSUED_AT=2026-10-05T10:40:45Z
EXPIRES_AT=2026-10-05T11:40:45Z
OWNER=root:root
MODE=0600
MANIFEST_SHA256=29d2ebb8d47e318964a4a03704b7f8e20bf4167c7a6eb1986b6f2fb9c7b7ebde
INITIAL_STATUS=VALID_UNUSED_UNCLAIMED
```

The receiver claimed it through the official request. Final coordinator gate at10:43:13Z recorded validation PASS / consume PASS for the same UUID and SHA. Readback after deployment: original approval and consumed record have identical manifest hashes; consumed record remains root:root0600; SHA-keyed claim is absent after normal consumption. Old approvals/claims were not edited, removed, renewed or reused.

## Official release result

- [Production Release37298140947](https://github.com/signal0verse/signalverse-main/actions/runs/37298140947): SUCCESS;11/11 steps.
- Job:release,2026-10-05T10:41:12Z–10:43:20Z.
- Inputs: exact SHA f71d287; artifact run37295268881; ID11337594856; inner digest90ab26a6…81edb1f (full value above).
- Receiver accepted exact SHA at10:41:22.657639Z.
- Coordinator activation PASS at**2026-10-05T10:43:18Z**.
- Workflow received status=deployed for exact SHA at10:43:19.542216Z.
- Artifact service:Result=success / ExecMainStatus=0; inactive/dead after normal oneshot completion.
- During normal application restart, one readiness probe at10:43:16Z got curl7; the existing bounded readiness loop succeeded by10:43:18Z. This transient was not hidden, was not a crash diagnosis and did not require a manual restart or second deployment.

## Post-deployment verification

First detailed snapshot2026-10-05T10:44:02Z:

```text
DEPLOYED_MARKER=f71d287167a33fffa9b0af99e6fb2fd1a021c0c5
APP_LINK=/opt/signalverse/releases/f71d287167a33fffa9b0af99e6fb2fd1a021c0c5
ADMIN_LINK=/opt/signalverse-admin/releases/f71d287167a33fffa9b0af99e6fb2fd1a021c0c5
MAIN_PROCESS_CWD=APP_LINK_TARGET
ADMIN_PROCESS_CWD=ADMIN_LINK_TARGET
OBSERVER_PROCESS_CWD=ADMIN_LINK_TARGET
```

| Service | Before PID | After PID | NRestarts before/after | After state |
| --- | ---: | ---: | --- | --- |
| signalverse |3487230|3566043|0/0|active/running|
| signalverse-admin |3487183|3566002|0/0|active/running|
| signalverse-observer |3487181|3566001|0/0|active/running|
| postgrest |1960930|1960930|0/0|active/running|
| signalverse-partner-copytrade |3092803|3092803|0/0|active/running|
| signalverse-deploy-receiver |2210596|2210596|0/0|active/running|
| signalverse-futures-profit-protection |0|0|0/0|disabled/inactive|

Only the existing official coordinator restarted main/admin/observer for normal activation. NRestarts counts automatic restarts, not those intentional deployment restarts. No manual service restart, Worker activation, PostgREST restart or Partner activation occurred.

Local main/Admin health passed at10:44:03Z; admin reported exact new SHA and authReady/snapshotReady/staticReady/databaseReady=true. Public /healthz passed at10:44:30Z; public home and read-only /api/public-info returned HTTP200. No analysis, scan, trade, sync or exchange endpoint was invoked for these checks.

Final stability snapshot2026-10-05T10:46:27Z (3min9s after activation): exact marker/main remained f71d287, all seven post-release PIDs and NRestarts remained as above, and main/Admin health passed again. No startup restart loop was observed in this bounded window. Installed receiver/helper/coordinator hashes remained unchanged. Existing signalverse-fast-jobs.timer was active with OnCalendar=*-*-* *:00/5:00. This confirms the configured cadence, not two new observed scanner executions or private-account outcomes.

Canonical Git SHA-256 values matched deployed source:

```text
api/_shared/futures-entry-freshness.ts
4ee7ef9488855d0f7997fcc8367a17f460641c41ecef3dd2be4957cb6c0fde67
api/_shared/futures-auto-candidate-quality.ts
642a29a2b44a655aa9a9e705ce6a7f97aa7beb6989dd13ed563d6ec25af08774
api/copytrade.ts
bf227f231b71a7434a4f63bad3ffcfdf9b39f844e2217ba7eb0e5461cf9d2c40
api/analyze.ts
a1c846699c989b23b89b57af1bf087ace977d06cc5921cff24e4a876604a6437
```

Active compiled copytrade runtime contains native-fresh-entry-v1 and confirmed-trend-v1. This verifies code presence/provenance, not a manufactured live trade. Previous main/admin release pointers both retain3e92cab for operator-controlled rollback; no rollback was performed.

## Files changed / Git status

No application source or application commit changed in this request. Source remains clean at f71d287; main readback matches. The prior test-integration commit and its23-path total release delta are documented in the linked retry report. No additional app push occurred.

Created one local uncommitted operator helper under tmp/ for the existing exact-identity approval procedure, and this sanitized report. Runtime filesystem changes are only the approved Guard state and normal official release/build/activation outputs. Primary unrelated dirty work and the report checkout's unrelated untracked report are preserved.

## Safety / limitations

- No Production SQL, migration, backfill or deliberate database mutation was performed by this task. Official coordinator has no migration step. No claim is made that the live database stopped changing under ordinary application activity.
- Direct exchange API calls, test orders, manual position/close/SL/TP actions:0. Existing autonomous services were not globally stopped; zero normal account activity is not inferred from deployment success.
- PP Worker remained disabled/inactive/PID0. REAL_PP/DEMO_PP and scanner gates/profiles/timer configuration were not changed by this task; their database values were not queried or inferred.
- Existing open-position management/protection, SL/ONE TP, execution adapters, core Decision Engine/V3, Partner, Spot, Fast Trader, Whale and Prediction logic remain outside this runtime delta. Only new-entry admission and AUTO-list quality were intentionally changed.
- The five-minute scan cadence is not changed. Valid candidates are not retired merely because time passes; weak/unknown evidence does not force replacement acceptance.
- **Residual limit:** final read checks are not serialized atomically with concurrent scanner/profile/decision writers. The previously documented SELECT-to-submit race still exists; this release does not prove full atomic admission. No profit, improved realized R:R or prevention of every losing trade is claimed. Live behavior and economic outcomes need natural observation, not test trades.

## Final result

```text
SOURCE_SHA=f71d287167a33fffa9b0af99e6fb2fd1a021c0c5
CI_RUN=37294274363
CI=PASS
ARTIFACT_ID=11337594856
GUARD_ID=9b6cf366-ed1e-41c4-895a-2d1a6ade788f
GUARD=VALIDATED_AND_CONSUMED_ONCE_BY_OFFICIAL_RELEASE
RELEASE_RUN=37298140947
RELEASE=PASS
DEPLOYED_SHA=f71d287167a33fffa9b0af99e6fb2fd1a021c0c5
ROLLBACK_SHA=3e92cab7a36cc0021847b1f700b9b5a394c75b37
SERVICE_HEALTH=PASS
POST_DEPLOY_PROVENANCE=PASS
MIGRATION=NO
PP_WORKER_STARTED=NO
PP_FLAGS_CHANGED_BY_TASK=NO
SCANNER_GATE_CHANGED=NO
DIRECT_EXCHANGE_ACTIONS=0
TEST_ORDERS=0
MANUAL_POSITION_SL_TP_CLOSE_ACTIONS=0
FINAL_CLASSIFICATION=PRODUCTION_DEPLOYMENT_VERIFIED
```

Next step: observe new natural decisions/results separately. Do not activate PP, force scans/trades, or extend this release into unrelated fixes.
