# 2026-11-05 — Complete separation audit and outstanding access

Status: **audit complete; separation NOT executed**. The owner explicitly requested complete SignalVerse/CrossVerse separation. The shared chart release is held. This report is a checkpoint and an access blocker, not a deployment or disconnection acceptance report.

## What is actually coupled

Read-only production observations at 2026-11-04 21:31–21:48 UTC confirm that the SignalVerse app and owned partner engine use executable `c161955239f24f151fed6a2a08dfcb8bef0e04ac`. Both public Trade manifests identify that source. Separate processes and owned storage do not mean independent deployment: the installed coordinator switches the app, admin and owned-engine links together and checks CrossVerse's shared public assets. Supplier signed transport and read-only core tables are additional dependencies. Source publication alone does not automatically activate the two products; the normal manual artifact/release and independent Guard still apply.

A bounded 3.345-second host sample observed about 20.9% CPU use across six CPUs and approximately 8.84 GiB available memory. It does not establish the cause of past slowness. The failed CI runner blocked private/production egress; its actual failure below is an offline callback reference error. No claim that CrossVerse caused that failure is supported.

## Actual safety observations and limits

The consistent read-only owned-schema snapshot found no recorded open/unclosed trades, uncertain entry holds, nonclosed Spot cycles or nonterminal Spot orders. Recorded close intents were flat-confirmed and recorded protection state was reconciled. Two pending signals were expired; no records were cancelled or deleted. A still-valid entry lease exists, so these observations do not freeze future work. This is database evidence, not an independent private-exchange inventory or profitability claim. No private exchange request, order, balance or position action was made.

The concrete private separation review covers public assets, signed API, background producers, release activation and retained data. Full separation needs a coordinated ingress fence, fresh post-fence/in-flight checks, preservation of protection, retirement of CrossVerse dependencies and an independently tested SignalVerse release path retaining the exact SHA/digest Guard, rollback and health checks. An assumed engine migration/new paid server is not part of the request. No production configuration, service, job, PP flag, profile, strategy, database schema or financial row has been changed.

Current CrossVerse management access is unavailable in this environment: only the SignalVerse SSH key is installed, there is no SSH agent, and no existing CrossVerse operator connection/identity is configured. Historical Git endpoint documentation does not verify the current runtime host. The owner has been asked for the existing management connection or key path, or to authorize the existing key on the correct host; private keys/passwords must not be posted to chat. A one-sided unverified shutdown is not being presented as complete separation.

## CI/source/runtime state retained honestly

Repository main and `codex/analysis-live-price-20261105` remain `c88b7b9160c0290a9e07fb3317c255c4265c8705`, with no new source edits or push during this audit. [Official CI 41906932865](https://github.com/signal0verse/signalverse-main/actions/runs/41906932865), main/push, attempt 1, job `126843989495`, failed: 94 actual steps, 27 successful, 2 failed, 65 skipped. Step 7 passed 68 CI selftests and step 8 passed the retained 557 cases. Step 26 had 111 tests, 110 passed and one failed: the unchanged original native live-chart callback supplies `setLivePrice`, while the current extracted effect refers to undefined `setDisplayedMarketPrice`. The final always-audit correctly rejected the incomplete run. Later compiler/SQL/build/artifact gates were skipped. No full official acceptance or new Linux compiler/build acceptance is claimed.

Authoritative logs were saved (ZIP SHA256 `b39778fcf96ea82732f8417a96edd27db503c6c0b83c40351799ff87783a2ba8`). Owned runner 220/container `ci-a511250` registration and container absence were independently verified. No CI, artifact, Guard or release was started during separation auditing. All original tests, expectations, cache/witness policies and the 2 CPU/4 GiB/180 minute/8 MiB limits remain unchanged. The exact c88 local diagnostic archive was 8,388,263 bytes, all 2,745 paths retained; bytes were discarded and no official artifact was created. Historical local passes are not substituted for the failed official run.

The chart setter correction, complete official CI, guarded independent deployment and actual native full-chart/live-price/history verification remain unfinished. The active executable remains separate from repository main. No deployment or complete disconnection has occurred.
