# 2026-11-05 — Separation boundary prepared; Forex preserved; test approval required

Status: **reviewed local candidate, not disconnected or deployed**. The owner requests complete SignalVerse/CrossVerse separation, full official CI without deleting tests or weakening gates, guarded deployment and actual app-chart verification. The latest explicit restriction is to leave CrossVerse Forex untouched.

## Access correction and actual current source

The prior access blocker was resolved by locating the existing release SSH configuration. Its configured key and strict pinned-host checks successfully authenticated to the documented CrossVerse host; no new credential or host-key exception was created. The old current-symlink path is obsolete: the active application is a clean main checkout at `c68b94ca00d14a30001d674abe05f5ec59978d4f`. Both active/available vhosts and the existing shared-asset snippet were read. The previous report's missing-access status is historical, not the current blocker.

That exact active source was fetched read-only as its actual Git owner, preserving the existing local main and other work. Local branch `codex/signalverse-separation-20261105` now contains the single normal candidate commit `2353d4daa345db7eb386c14b83913032dc980635`. It has not been pushed or deployed. A managed worktree request did not return an operation result; no created/attached worktree was found during reconciliation, so creation was not repeated and the clean existing checkout was reused.

## Actual local changes

An operator-only `CROSSVERSE_SIGNALVERSE_DISCONNECTED` latch defaults false, preserving the original enabled-path behavior until explicit retirement. The three real legacy/V3 transport boundaries reject disconnected calls before secret resolution or HTTP. Both existing SignalVerse lease commands return before database access when disconnected. The original method statements and policies remain after these narrow guards. A separate retired shared-asset Nginx template returns 410 locally. Original proxy templates and every original test/expectation remain intact. Append-only collaboration/product/assistant documentation and synthetic Postman examples describe the retired connection honestly; no replacement functioning engine is claimed.

Exactly twelve candidate paths change. Git comparison proves **all original Feature/Unit test files and all Forex source/assets are byte-identical to the active base**. No Forex configuration, relay, binding, activation, snapshot, service or runtime file was written. Read-only production anchors confirm the original clean active source, unchanged running PHP-FPM PID/start/restart counters and five protected configuration/activation hashes. No vhost, FPM service or Forex module was modified or restarted.

## Checks actually completed

Thirty-three fresh PHP boundary checks passed on Linux in a separate network namespace with PHP INI disabled. They execute the actual three client methods and two lease commands, including forced-enabled old feature flags, and verify no application/secret, database or HTTP dependency is reached while disconnected. No production environment or application bootstrap was loaded. Syntax checks passed for the seven staged PHP inputs. These checks are not a substitute for full Laravel regressions or official SignalVerse CI.

The committed-source archive is 19,038,142 bytes and 3,302 entries, SHA256 `3b6bf5fd989ed307c34c1c4cdfe130578d13c1a50d1dd334de5a442651661f32`. Local inspection confirms tracked source only, with no runtime environment, compiled production configuration or private storage. The full test controller has been reviewed and syntax-checked without execution; cleanup tracks its own test schema/user creation separately.

Independent unaffected chart work reproduced the exact unchanged original failing callback against current c88 source: `ReferenceError: setDisplayedMarketPrice is not defined`. A private App draft restores the old `setLivePrice` call contract and mirrors quote metadata at the setter. The same unmodified original callback passed against those draft bytes, with no app/API initialization or network. This is **draft red/green diagnostic evidence only**: the SignalVerse repository is still unchanged, no new full source manifest, compiler, local-suite or official-CI acceptance is claimed.

## Actual automatic-review blocker

Automatic approval review rejected the proposed full CrossVerse regression command **before execution**. Its stated reason was that uploading the private full-source archive and creating temporary MySQL/systemd resources on a production host needed explicit authorization, and that safer local or separately isolated alternatives existed. The rejected command was not rerouted or retried indirectly. No archive upload, test schema/user creation or transient test unit occurred from that command.

The concrete pending request is one bounded run of the original CrossVerse test wrapper against the frozen source: test-only MySQL schema and schema-restricted identity, nonproduction OS user, a private network namespace with loopback only, 2 CPU/4 GiB and a 30-minute bound, plus cleanup of only its own temporary resources. It does not load production environment/data, mutate existing databases, or touch Forex. This is separate from the unchanged official SignalVerse 180-minute gate. Owner approval is needed for this precise source transfer and temporary host-side test setup; no repeat deployment/scope/credential permission is being requested.

## Remaining release state

CrossVerse still runs `c68b94c`; SignalVerse still runs the separately pinned `c161955239f24f151fed6a2a08dfcb8bef0e04ac`. Signed transports, lease timers and shared assets have not yet been retired. No database, profile, risk, strategy, PP flag, financial ledger, private exchange, order, position, Entry/SL/TP/close action has occurred. Historical records and protection remain intact.

SignalVerse main remains `c88b7b9160c0290a9e07fb3317c255c4265c8705`. Its [official main/push CI 41906932865](https://github.com/signal0verse/signalverse-main/actions/runs/41906932865), attempt 1, remains failed: 94 actual steps, 27 successful, 2 failed, 65 skipped. The original callback failure and final audit failure remain saved. Its owned runner/container cleanup was verified; no new CI, artifact, Guard, release or deployment was started here. Original tests, expectations, cache/witness policies and the 2 CPU/4 GiB/180 minute/8 MiB gates remain unchanged.

After the pending test gate: complete reversible two-sided retirement with fresh in-flight/open/uncertain-work checks and Forex preservation, then finish the legitimate chart successor and independent release coordinator, pass full exact-source official CI, retain exact artifact bytes/tree/provenance/digest, obtain fresh readiness/backup and independent SHA/digest Guard, perform normal guarded deployment, and verify the actual full native chart/live quote/history and all owned cleanup. No final acceptance is claimed by this checkpoint.
