# Failed-claim recovery fixes and exact Futures release gate

## Metadata / executive result

- Date: 2026-09-26 Asia/Kuala_Lumpur; execution timestamps below are UTC, 2026-09-25.
- Request: fix the three recovery defects, finish safe work and deploy the healthy approved Futures release through its official path.
- Branch: `codex/failed-claim-recovery-20260926`, isolated local checkout.
- Starting executable commit: `39217bd67a75d96daa278740366382517385e631`.
- Fixed executable commit: `e75f9264e0963c8ebdcb68c23a54b2e2649cefbb` (local only).
- **RECOVERY IMPLEMENTATION / LINUX TESTS: PASS.**
- **LIVE RECOVERY AND PRODUCTION RELEASE: BLOCKED BY FRESH MAINTENANCE APPROVAL.**

The execution authorization reviewer rejected the live maintenance-fence command
before execution. It required fresh explicit authorization for stopping/fencing
the deployment receiver and recovering the Production claim. No retry or indirect
workaround was attempted. No approval, claim, unit or application was changed on
the VPS. Successful local tests are not a claim of completed live recovery.

## Exact identities

| Identity | Value |
| --- | --- |
| Application target, unchanged | `5eb6094658a692ba32687fccaa9759d20b68d6b5` |
| Read-only remote main observation | `10075341cdca3782cdd254d784afe39d818f7c0d` |
| Exact target CI | `36152392768`, main, push, completed/success |
| Artifact preparation run | `36164169421` |
| Retained artifact | `10875754793`, not expired; expiry `2026-10-25T16:58:43Z` |
| Exact retained inner archive SHA-256 | `5a25a166cca27eadaf8281ea783d1cb91cf12e50f62dfb431bfcdb99b683c8be` |
| Retained archive size | 3,950,488 bytes |
| Old UUID, unchanged | `3bbbf63d-65c1-45c2-82d1-7be1943c7f52` |
| Old approval and claim SHA-256, each | `663b42664e1695ce1ca800e01b46a6bf6e8261ae54d9a9d9ffeb8c44c83af1cb` |
| Actual runtime, before and after | `b3195f788e14e393464e93aa9545cc7614a1caaf` |

Remote main contains the reviewed release-packaging tooling. It is not substituted
for the target application SHA. The workflow permits an exact approved ancestor
with exact-SHA successful CI and retained-artifact provenance. No main write or
history rewrite was performed.

## Files inspected / changed

Inspected project entry instructions, current handoff, safe test runbook, recovery
design/source/tests and previous Linux failure evidence, exact release workflow,
installed Guard helper/units and hashes, pinned receiver source, recorded artifact
provenance and old approval mechanism. Also inspected GitHub run/artifact metadata,
read-only VPS runtime/units/claim state and economics/PostgREST readiness.

Executable commit changes ONLY:

1. `ops/recovery/failed_claim_recovery.py` — recovery fixes and reviewed local build gate.
2. `scripts/failed_claim_recovery_test.py` — regression cases and upload-fixture synchronization.
3. `ops/recovery/README.md` — design and evidence boundaries.

Documentation follows in this report and `HANDOFF.md`. Local disposable tooling
under `tmp/recovery-linux-validation-20260926` was updated separately; it is not
part of the application artifact or main. No Futures/Strategy/Spot/DB source or
installed receiver/helper/coordinator/workflow was modified.

## Corrections and exact coverage

### 1. Late lock substitution detection

`exclusive_lock` now yields a held-lock verifier checking dev/inode/type/owner/
group/mode/link count for both path and open descriptor. Recovery calls it before
each mutation boundary and before eligibility, not merely on entry and exit.
Regression injects actual POSIX inode replacement at preflight, intent,
tombstone, approval-retired and claim-retired. No subsequent retirement proceeds
and no completion is published. At preflight both sources remain untouched.

This remains trusted-root maintenance, not protection from a hostile root actor
replacing paths between arbitrary syscalls. Durable admission fencing and the
coordinator lock are both still mandatory.

### 2. Bare-template systemd query

The invalid `systemctl show ...@.service` is replaced by querying a never-started
`@recovery-fence-probe.service` instance. It must be loaded as persistently masked,
inactive/dead and PID zero. The original root-owned `/dev/null` template-mask
check remains. Both mocked rejection cases and actual PID-1 systemd verification
passed. The probe is not an artifact activation.

### 3. Unknown incident-directory entry

An explicit inventory permits only `intent.json`, `complete.json` and correctly
named pending hardlinks to those exact published inodes with identical metadata.
Unknown files/directories, orphan pending files and entries appearing after
intent or after completion cause DENY. Valid crash-leftover hardlinks still
resume; the crash protocol was not weakened.

### Fixture synchronization

The old in-flight-upload test waited only for existence of the partial file.
Linux exposed its race with the receiver's first asynchronous write. It now waits
up to the existing three-second bound for the exactly one synthetic byte sent,
then checks unchanged state during denied recovery. The actual receiver remains
running during that check; no real artifact/approval is used.

## Validation executed

Same NIC-less disposable Ubuntu 24.04.5 / ext4 / systemd 255 / Node 22.23.2 VM.
No Production directories, credentials, disk, network device or SSH route were
mounted into it. The original failed evidence remains preserved.

| Check | Result |
| --- | --- |
| Repaired core before live-build-gate enablement | 33/33 Linux PASS, 57.588 s |
| Supplemental repaired-core harness | 29/29 PASS |
| Final executable build regression | 33/33 Linux PASS, 50.357 s, zero skips |
| Final executable supplemental repeat | 29/29 PASS, completed `2026-09-25T18:39:37Z` |
| Final Windows suite | 32 PASS, 1 explicit POSIX-only skip; 33 cases, 14.620 s |
| Static Python parse / Git whitespace | PASS |
| Retained archive independent SHA-256 + helper verification | PASS; no repackaging |
| Actual disposable-VM reboot and persistent fence recheck | PASS; both units masked/inactive, PID 0, no socket/job |

Supplemental cases cover actual Linux flock contenders, live inert systemd
admission races, loaded persistent masks, no listeners/jobs/processes, file and
directory fsync, ownership/symlinks/hardlinks, eight real child-process crash
boundaries, replay denial and idempotent recovery. They are not physical
power-loss certification or full live Production adapter proof.

Recorded intermediate failures are retained: first Linux rerun had two errors
because its sanitized PATH omitted the existing Node installation; the next
exposed the upload-fixture race described above. One supplemental repeat was
interrupted while waiting for systemd; the complete repeat passed. Serial-console
transport handling was adjusted locally; incomplete runs were not counted as
passing evidence.

Exact final tested source SHA-256:

```text
recovery.py: 826fdad956ddb721bb1aadac7fa810f94972d293f5aa23d1fddd137fc2c40af7
test.py: dd69008f28e0de3a5d773463a381e58f91b43e65556cfd8b89532c42aa57a964
supplemental harness: bbfbd56ea3c283a30f178c66ece56371961cf2489ed881f9bc1ebab614432ee1
```

This run's reboot changed boot ID from `ab90f37b-67af-4a31-821b-b89db27012f1`
to `489974ec-9d15-4340-a419-c2b322b5f501`. New evidence was exported separately
under `tmp/recovery-linux-validation-20260926/retry-evidence/`; historical failed
evidence was not overwritten on the host. Export archive SHA-256:
`f2f6b24782daa6e93be1469dcc753b3f7ec6cd224e4acf9dc342da034f919ece`.
The archive also retains clearly named original environment/baseline records;
new final results are `final-phase1.*`, `final-extra2.*`, `extra-results.json`,
`retry-source-hashes.txt` and `retry-post-reboot.json`. The VM was then sent an
orderly poweroff; no running VM is needed for approval or release.

The local build gate is enabled only in this reviewed candidate; it does not
grant operator authority or bypass the CLI/live checks. It was not installed or
executed on Production. The mutation CLI still denies without the actual root,
existing lock, exact identities, durable masks and complete live evidence.

## Production read-only evidence

Before: `2026-09-25T18:26:39Z`. Final readback: `2026-09-25T18:42:38Z`.
Marker and both app/admin symlinks stayed at the exact runtime above.

| Service | Before PID | After PID | NRestarts before/after | State |
| --- | ---: | ---: | --- | --- |
| Main | 2177526 | 2177526 | 0 / 0 | active/running |
| Admin | 2177522 | 2177522 | 0 / 0 | active/running |
| Observer | 2177519 | 2177519 | 0 / 0 | active/running |
| Guard receiver | 2166041 | 2166041 | 0 / 0 | active/running |
| PostgREST | 1960930 | 1960930 | 0 / 0 | active/running |

Old approval/claim hashes still match. Receiver and artifact unit hashes still
match their installed baselines. No queued deployment jobs. The one unrelated
historical failed artifact unit remains unchanged; no target unit was activated.
The proposed maintenance backup and target recovery-evidence directories do not
exist: the denied command did not run. The final shell returned nonzero because
these two deliberately checked paths were absent, not because recovery ran.

Database verification used a bounded `BEGIN READ ONLY` transaction and ROLLBACK
on `signalverse_cutover2`. `copy_trades.economics` is nullable JSONB; the v1 CHECK
is validated and its comment exists. Authenticated OpenAPI on the existing
application `/rest/v1` route returned 200 and exposed economics; the zero-row
SELECT returned 200 and `[]`. No rows, DDL or migration were written. An initial
read used the gateway root instead of `/rest/v1` and failed JSON parsing; it did
not mutate anything and was corrected to the existing application route.

GitHub Production environment currently reports branch policy only, no required
reviewer rule. This was observed, not changed or treated as a substitute for the
independent Guard approval. No incomplete Release run was found.

## Exact live blocker and next authorization

The execution authorization reviewer denied the requested SSH maintenance write
as needing fresh explicit owner approval. That operation would hold the global
deploy lock, prove no eligible/in-flight delivery, preserve the two unit files,
stop ONLY the deploy receiver and establish persistent admission/template masks.
Application/admin/observer/PostgREST services would stay running. Recovery would
then independently re-prove the live invariants before any retirement.

Required explicit scope for continuation:

1. Establish that limited deployment maintenance fence, preserving original units.
2. Run the reviewed exact-incident recovery only after live preflight PASS; preserve
   complete old evidence and permanent UUID tombstone, with no claim reuse.
3. Issue one fresh out-of-band approval for the exact target and retained digest;
   restore the identical Guard units and receiver after successful checks.
4. Invoke only the official exact-SHA release using retained artifact ID 10875754793;
   then perform read-only runtime/health/schema verification.

Any changed identity, unknown state, failed preflight or missing external approval
still requires STOP. No approval or release follows automatically from this report.

## Safety / publication

```text
APPLICATION_SOURCE_CHANGED=NO
APPLICATION_MAIN_CHANGED=NO
APPLICATION_PUSH=NO
CI_DISPATCH=NO
RELEASE_EXECUTED=NO
DEPLOYMENT=NO
VPS_STATE_CHANGED=NO
APPROVAL_CREATED=NO
CLAIM_MODIFIED=NO
CLAIM_REUSED=NO
CLAIM_RECOVERY_EXECUTED=NO
DATABASE_DDL=NO
DATABASE_DML=NO
ORDERS=0
POSITIONS_CHANGED=0
EXCHANGE_ACTIONS=0
```

Counts describe this task's actions, not autonomous application activity. No
profitability or AI Supervisor improvement is claimed. Publish only this sanitized
report to SignalVerse-AI-Log/master after secret scan/diff review and verify its
remote blob. Application commits remain local; publication commit is reported
separately in the task response.
