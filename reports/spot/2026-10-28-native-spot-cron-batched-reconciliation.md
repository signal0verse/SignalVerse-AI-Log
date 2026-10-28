# Native Binance Spot external-sale recovery and bounded reconciliation reads

## Metadata

- Date: 2026-10-28 (Asia/Kuala_Lumpur)
- Task ID: native-spot-stopped-setup-recovery
- Module: spot
- Mode: real Binance Spot; production repair with scoped acceptance
- Repository: signal0verse/signalverse-main
- Branch: codex/spot-dash-deletion-sync-20261027
- Starting active runtime: a2ee12c0f260d22eea05cf32376bb5142e66655a
- Intermediate released verifier: 0353ec418ead940c2a18ad2b2462e4a1b593b86f
- Ending executable/runtime commit: 8e245f8dfe3ad1377090d9a08f73e075cc58cea8
- Later documentation-only HEAD: 2bded5497bfb23417447857abcd6c510e170e38b
- Status: deployed; actual ordinary-cadence closure and released reservation verified

## Objective

Resolve a stopped native Binance Spot setup left reserved after remaining inventory
was manually sold on the exchange. Preserve original purchases, target sales, fees,
manual-sale identity and accounting history; allow adding the settled asset again.

## Scope

Native stopped-cycle discovery, strict external-sale attribution, canonical
projection and settled-only reservations. Existing strategy, risk, funding,
credits, authentication, modes and uncertain-order holds remain unchanged.

## Actions Taken

1. Confirmed that app Stop had persisted. The disabled trash control reflected a
   stopped parent whose open cycle still required exit management.
2. Verified the genuine external sale using signed GET-only venue evidence.
   Delivered strict native-fill/fee and whole-symbol-history verification as 0353.
   Its release passed; the actual case remained open, so acceptance was withheld.
3. Identified an oversized extra-cycle filter rejected with414 by the local REST
   proxy's 8 KiB URI limit. The affected cycle matched the predicates and belonged
   to that skipped set. No trading job was forced during diagnosis.
4. Reused existing 25-ID reads for active-parent and extra-cycle discovery and
   checked both errors. Delivered 8e through fresh original release gates.
5. Verified ordinary-cadence closure at 05:06:25 UTC: genuine external-sale
   provenance, CLOSED/archived case, actual-fill-time manual intent and released
   settled reservation. Original financial identities, buys, native target sale
   and parent settings remain exact; proceeds, fees and accounting match evidence.
6. Removed only the three own ephemeral runners/containers. Windows Docker stayed
   off. No operator order, new setup, paid analysis, forced job, live-row RPC,
   financial reset or uncertain-hold clearing was performed.

## Files Inspected

`AGENTS.md`, `CLAUDE.md`, handoffs, complete `TRADING_STRATEGY.md` and amendments,
the safe runbook, relevant native verifier/controller/journal/UI selector code,
release/source tests, narrow routing/job metadata and private on-host evidence.

## Files Changed

The final 0353-to-8e batching successor has exactly 11 source paths:

- `HANDOFF.md`
- `api/copytrade.ts`
- `docs/AI_HANDOFF.md`
- `docs/fixes/spot-external-exit-2026-10-27.md`
- `docs/testing/stability-test-runbook.md`
- `scripts/lib/spot-cron-read-batches-delta.json`
- `scripts/lib/spot-cron-read-batches-parity.mjs`
- `scripts/lib/spot-external-exit-proof-parity.mjs`
- `scripts/spot-cron-read-batches-test.mjs`
- `scripts/spot-external-exit-proof-scope-test.mjs`
- `scripts/spot-external-exit-test.mjs`

Earlier related changes include `api/_shared/binance-external-spot-exit.ts`,
`migrations/spot_external_exits.sql`, the position controller, app list observer,
settled-reservation selector and their tests. Their full history is retained in
Git and the fix report. Final documentation publication changes only four relevant
documents and the new batching manifest.

## Root Cause / Findings

CONFIRMED: the external sale originally lacked native journal provenance. After
that verifier was delivered, the normal stopped-cycle lookup still exceeded the
proxy limit. HTTP 414 occurred before backend logging; the extra read's error was
ignored. Synthetic 7 KiB requests reached the backend while 10 KiB requests returned HTTP 414.
Scoped reads independently confirmed the case's query membership.

CONFIRMED: 8e ordinary reconciliation closed/archived the actual case and released
the installed selector's reservation without deleting prior history.

NOT EXECUTED: interaction in the affected user's browser; no forced reload or
account impersonation was used. UNCONFIRMED: parity for every private account,
other venues or profitability.

## Implementation

Use the unchanged 25-ID reader for both lookups; abort on any failed chunk before
processing partial discovery. All filters remain exact. Strict native fee/fill,
complete-history, 24-hour sale/60-second observation, snapshot/account revision,
zero-balance/open-order and immutable-ledger fences stay unchanged. The existing
additive schema was read-only verified for 8e; this successor applied no live DDL.

The final acceptance helper initially assumed array insertion order. Actual
snapshot sell order is unspecified. An independent saved-snapshot comparison
confirmed all prior sell fields exactly by native order identity and one unique
manual fill. Only that local readback comparison was corrected to exact identity
matching, also requiring new fill quantity, quote and actual timestamp. No live
values, fees, timestamps or runtime criteria were relaxed.

## Tests Executed

- `<validated Node 22.23.4 binary> --test scripts/spot-external-exit-test.mjs`: PASS 91 cases, retaining all 85
  preceding functional cases. Four REST regressions first reproduced 0353's bug.
  The failure fixture was corrected to sustain 503 across existing GET retries.
- `<validated Node 22.23.4 binary> --test scripts/spot-cron-read-batches-test.mjs scripts/spot-external-exit-proof-scope-test.mjs scripts/spot-external-exit-scope-test.mjs scripts/spot-release-history-scope-test.mjs`:
  PASS 18 current/historical source checks, including the final documentation run.
  Original assertions use checked exact predecessor reconstruction; independent
  current-tree checks reject forged trees, altered or extra paths and runtime drift.
- Original four Node22 compiler comparisons: zero introduced diagnostics; 313 real
  inputs matched. Existing baseline diagnostics are not a clean global typecheck.
- Fresh 145-relation PostgreSQL and dualSQLite backup/coldrestore/catalog/ACL checks
  and private actual-layout schema/projector rehearsal: PASS. Raw evidence stays
  on the original server and is not included in this report.
- [Exact-main CI](https://github.com/signal0verse/signalverse-main/actions/runs/40622205010): PASS 79/79, attempt1.
- [Official artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/40634042554): PASS 10/10, attempt1.
- Artifact 12792279305: 8387337 bytes;
  SHA256 `3022948cc2f62746a61b1512cc626b2637eb1383813c27c0d172219c67c26120`. All 2606 blobs/modes and metadata/commit
  independently verified; no repack or archived-code execution.
- [Guarded release](https://github.com/signal0verse/signalverse-main/actions/runs/40634640753): PASS 11/11, attempt1; original approval consumed.
- Installed-source/runtime/public-assets, actual scoped recovery and own cleanup:
  PASS. Original 22 control fingerprints / 17 job gates and Paper pin unchanged.

## Build Result

PASS: final-source web / admin / 14 API builds with an empty environment directory and
no application/database/exchange bootstrap. Original workflows, caches,
180-minute CI and 8 MiB cap remain. Isolated runners retained resource/network reserves.

## Git Status

Source and later documentation published by normal fast-forward on main and the
feature branch; rollback refs retained, no force push. Only task paths staged.
Pre-existing untracked output preserved. Runtime remains 8e after docs-only HEAD.

## Commit

- [Executable/runtime](https://github.com/signal0verse/signalverse-main/commit/8e245f8dfe3ad1377090d9a08f73e075cc58cea8)
- [Later documentation only](https://github.com/signal0verse/signalverse-main/commit/2bded5497bfb23417447857abcd6c510e170e38b)

Earlier 6af passed CI but its oversized artifact was refused. Historical handoff
bytes were losslessly archived without raising the cap. Unreleased 1a66 first hit
the original 180-minute limit; its second attempt was withdrawn after review found
a complete-history/native-fee gap. Neither was deployed; no receipt was relabeled.
0353 was deployed, but actual case acceptance awaited the separate 8e batching fix.

## Remaining Issues

No unresolved settled-reservation lock remains in the reported case. A later
real active setup may legitimately reserve the asset again. Ordinary browser list
refresh may still be needed; actual-user UI interaction was not independently run.

## Risks / Limitations

Incomplete, stale, multiple-exit or ambiguous history stays held. CI/service health
alone is not private-account execution proof; this result uses actual scoped
readback plus independently signed venue evidence.

## Recommended Next Step

Use normal app list refresh. Preserve uncertain holds and inspect any unmatched
future case without deleting its history or resetting financial rows.
