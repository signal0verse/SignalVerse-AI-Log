# Continuous Auto Scanner — exact-SHA Production release and controlled-verification gate (2026-09-30)

## Executive state

The reviewed Auto Scanner is deployed at application SHA `b8f66cbc138f53d083ef8ff827cc39e86b00f54c`. The existing five-minute VPS runner has exactly one new, independently gated `futures-discovery-cron-tick` invocation. Its gate remains **OFF**. Controlled initial-scan and two-natural-tick acceptance is **NOT COMPLETE**: four profiles were already enabled (three Demo Binance, one Real Binance), and the current cron handler processes all enabled profiles. A single-profile Production test would therefore require an owner decision on temporarily isolating the other three; none has been changed. Do not label this feature continuously verified yet.

## Source, CI and retained artifact

- The original official CI failure on `e00f5424bf4d1c552919cecaa94721988e9fb35f` was an obsolete whole-file equality assertion against historical `065e117:api/copytrade.ts`. Scanner code legitimately added two Discovery-only islands to that file. Protected non-Discovery runtime remained byte-for-byte historical.
- Commit `b8f66cbc138f53d083ef8ff827cc39e86b00f54c` updates only the parity test and `HANDOFF.md`: it pins all non-Discovery slices to the historical source and pins both new Discovery slices to the reviewed `e00f542` source. Missing/duplicate boundaries fail. No Strategy, Risk, Execution, Protection, Spot, or application code changed in this parity fix.
- Local isolated LF checkout: affected parity 14/14, scanner/V3/lifecycle 225/225, V3 coverage 15/15, Web/Admin build PASS. Production CI push/main exact-SHA [run 36719541901](https://github.com/signal0verse/signalverse-main/actions/runs/36719541901) concluded success.
- Official prepare-only [run 36720030387](https://github.com/signal0verse/signalverse-main/actions/runs/36720030387) succeeded. Retained artifact ID `11098026722`; independently verified inner `release.tar.gz` SHA-256 `92a17809b093a97bc63ab5fe19fe805e37b2cdc4dd2bfd30b4c3472627f54be3`, metadata and embedded commit all matched. No repackaging occurred for delivery.

## Production migration and release

- Pre-existing approved full DB backup: `/var/backups/signalverse/pre-continuous-auto-scanner-e00f542-20260930T1145Z.dump`, SHA-256 `0f4d4f43cd04009e9600bd860c48c8a7ba6b5bb95f74564b08772a5da5622329`; native dump listing and read-through verified.
- Owner-approved exact additive migration `migrations/futures_discovery_profile_margin_mode.sql` was previously applied transactionally to `signalverse_cutover2`; `futures_discovery_profiles.margin_mode` and `futures_discovery_runs.observed_symbols` were re-read after deployment. No migration was replayed during release.
- The owner separately confirmed one root-owned, expiring Guard manifest for exactly the SHA/digest above. Manifest UUID `7f6fd64e-04f6-4501-b47a-e967275c5af7`, `issuedAt=1790774718`, `expiresAt=1790778318`, root:root 0600; no pre-existing claim for this target. A separate explicit owner response authorized the official Production Release invocation.
- Official [Production Release run 36722060446](https://github.com/signal0verse/signalverse-main/actions/runs/36722060446) for the exact retained artifact completed successfully. Guard journal at `2026-09-30T13:30:13.983Z` recorded validation PASS; at `13:30:15.159Z` admission CLAIMED/QUEUED. Coordinator journal recorded consume PASS and activation PASS. The VPS incoming archive hash matched the approved digest exactly; consumed manifest exists root:root 0600; no live target claim remained.
- Runtime marker mtime `2026-09-30T13:32:39.032831834Z`; marker, app symlink and admin symlink all resolve to `b8f66cbc138f53d083ef8ff827cc39e86b00f54c`. Main/admin/observer process CWDs resolve to the corresponding target releases. Main, admin, observer and PostgREST were active/running, each `NRestarts=0`; internal main and admin health returned HTTP 200 and admin `releaseSha` matched. PostgREST PID `1960930` remained active.

## Existing five-minute scheduler, gate OFF

- The only timer is `signalverse-fast-jobs.timer` (`OnCalendar=*-*-* *:0/5:00`), active/waiting. No second timer or service was created.
- Original `/usr/local/libexec/signalverse-jobs` hash `b4d38951eca9bf86777c584c5c1eef9748af7a4a9ea7c537579379a9c9c18356`; recovery copy `/var/backups/signalverse/signalverse-jobs.pre-scanner-20260930T1335Z` has the same hash.
- The installed runner hash is `7654afb73c73c1035d8e0d0900aaf1d7c066f675d8c46be3d21faa22d66d9188`, root:root 0755, LF without BOM. `bash -n` passed on VPS. Exact diff adds only a five-line `job_enabled futures-discovery-cron-tick` branch using the existing `COPYTRADE_SYNC_SECRET` and `call_api` pattern; other jobs were unchanged. The endpoint is present in active application source.
- `/etc/signalverse/jobs.d/futures-discovery-cron-tick.enabled` is absent. Natural timer invocation at `2026-09-30T13:40:02Z` logged `futures-discovery-cron-tick not enabled ... skipping`; the scanner was not invoked. Before gate activation, aggregate Production DB query returned zero discovery runs.
- Read-only aggregate inventory: enabled profiles = three Demo Binance and one Real Binance. The deployed `futuresDiscoveryTick()` selects all enabled profiles and calls `applyFuturesDiscoveryToProfiles(view)` without a scope argument. Turning on the gate now would process all four, including Real. The requested controlled one-profile test therefore remains blocked pending the owner's choice to isolate the others or leave the gate off. No profile was toggled, no initial scan was triggered, no natural scanner tick was run, and no order/position action was initiated by this task.

## Acceptance and limits

Code deployment: **PASS**. Exact SHA / CI / retained artifact / Guard / activation: **PASS**. Existing scheduler connection with independent gate: **PASS**. Controlled one-profile initial scan, two actual scanner ticks, candidate upkeep, order/position non-effect under scanner execution: **PENDING**. Continuous Production readiness: **NOT CLAIMED**. The absence of scanner runs means no claim is made about live maintenance quality or trade outcomes. No Spot, Futures Engine, Real Trading gate, credential, exchange setting, or unrelated job was changed by the scheduler integration.

The application rollback SHA was `8858119faa378c67aa86d1092919ddf5e72c703f`; application code stays on the exact released SHA unless a separate authorized rollback occurs. The guarded scanner gate remains off until safe controlled validation is authorized.
