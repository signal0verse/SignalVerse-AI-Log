# Failed-claim recovery — isolated Linux validation

## Metadata

- Date: 2026-09-26, Asia/Kuala_Lumpur; execution evidence uses UTC on 2026-09-25.
- Task: validation only; no production recovery, no installation, no release.
- Module: Security / deployment control, not Futures strategy.
- Repository: `signal0verse/signalverse-main`.
- Candidate branch: `codex/failed-claim-recovery-20260926`.
- Starting and ending executable commit: `39217bd67a75d96daa278740366382517385e631`.
- Local candidate checkout: `C:/Projects/SignalVerse-Main/tmp/failed-claim-recovery-20260926`.
- Disposable validation workspace: `C:/Projects/SignalVerse-Main/tmp/recovery-linux-validation-20260926`.

## Executive result

**LINUX VALIDATION = BLOCKED. LIVE EXECUTION ENABLEMENT = NOT PROVEN.**

The existing **28/28 tests passed unchanged on Linux**, in **71.490 seconds**.
The supplementary Linux harness completed **29 cases: 26 PASS, 3 FAIL**.
These failures are not hidden by the original suite's success:

1. Lock inode replacement during preflight is detected **after** retirement and completion publication.
2. The candidate's `systemctl show` query against an uninstantiated template is invalid on real systemd.
3. An unexpected extra file in the recovery incident directory is accepted rather than denied.

The candidate and its existing tests were not repaired or weakened. The literal
`LIVE_EXECUTION_VALIDATED = False` remains unchanged. No enablement patch was
prepared, installed or executed. Production is not declared recovery-ready.

## Objective and scope

Validate the reviewed local candidate using actual Linux filesystem/process
primitives and real PID-1 systemd, with disposable synthetic state. The target
release identities remain metadata only:

```text
TARGET_SHA=5eb6094658a692ba32687fccaa9759d20b68d6b5
OLD_UUID=3bbbf63d-65c1-45c2-82d1-7be1943c7f52
OLD_APPROVAL_CLAIM_SHA256=663b42664e1695ce1ca800e01b46a6bf6e8261ae54d9a9d9ffeb8c44c83af1cb
RETAINED_ARTIFACT_SHA256=5a25a166cca27eadaf8281ea783d1cb91cf12e50f62dfb431bfcdb99b683c8be
PRODUCTION_RUNTIME_REQUIRED=b3195f788e14e393464e93aa9545cc7614a1caaf
```

No retained release artifact was downloaded or rebuilt. No real approval/claim
was read, copied, modified or replayed. No connection to Production was made;
therefore this report does **not** assert a newly observed Production SHA, PID,
claim checksum, service status or account state.

## Environment identity and isolation proof

Environment evidence captured at **2026-09-25T17:49:07Z**:

| Property | Observed value |
| --- | --- |
| Hostname | `sv-recovery-disposable-20260926` |
| OS | Ubuntu 24.04.5 LTS, Noble |
| Kernel | `6.8.0-139-generic`, x86_64 |
| PID 1 | `1 systemd /sbin/init` |
| systemd | `255.4-1ubuntu8.17`, unified cgroup hierarchy |
| Guest root filesystem | `/dev/vda1`, ext4, `rw,relatime,discard,errors=remount-ro,commit=30` |
| User | root inside disposable VM only |
| Python / Node / Git | Python 3.12.3 / Node v22.23.2 / Git 2.43.0 |
| Test source root | `/opt/recovery-validation/repo` |
| Synthetic stores | `/tmp/sv-claim-recovery-offline-*`, individually owned temporary directories |
| Emulator | Portable QEMU 11.1.0, software TCG, 2 vCPU, 2 GiB RAM |
| Network | QEMU `-nic none`; guest interface inventory contains only `lo`; no external route |
| Control | Local serial and QMP sockets bound to Windows loopback only; **no SSH** |
| Storage | Disposable QCOW2 overlay, read-only source ISO; no shared host directory, credentials or production disk |

The Windows host had no usable Linux VM already prepared. Portable tooling and
an official Ubuntu image were downloaded into the isolated local workspace.
7-Zip was administratively extracted to that folder, not globally installed;
QEMU was unpacked rather than installed as a host service. No Windows hypervisor
feature or global network/security setting was enabled.

Official input sources:
[QEMU Windows distribution](https://qemu.weilnetz.de/w64/2026/),
[Ubuntu cloud image](https://cloud-images.ubuntu.com/noble/current/),
[Node v22.23.2](https://nodejs.org/dist/v22.23.2/SHASUMS256.txt), and
[7-Zip download index](https://www.7-zip.org/download.html).
Downloaded input checksums were checked against their published checksum files:

```text
Ubuntu image SHA256:
612b2c0cc1bc413a6cb8c38fd611794caf0f2b436c50013d8b3794db12ad7354
Node Linux archive SHA256:
d60acfe00a2932254bb0ad20e01b0d74397a0875595de719654b214f4b03f307
QEMU distribution SHA512:
5bcf9eed634e8575a37b74f445af41a2fe4106da512d0c30c368301d4c105037fdfab40a5287367a28a957624cddebbc8c07e16c88ab6634f554cdf3d16bf543
```

The seed ISO used a strict source allowlist: the two exact candidate Python
files, only the Git objects needed for the tests' two pinned historical Guard
source blobs, minimal credential-free Git metadata, Node and bootstrap data.
It did not copy the checkout's `.env`, Git remotes/auth configuration, SSH keys,
approvals, claims, database data or application runtime. The historical Guard
source is a **fixture**, not the installed real Guard. Its production-related
source constants are not runtime connection configuration: tests inject the
synthetic OIDC callback, temporary store and inert activation callback. There is
no guest network device through which external endpoints could be contacted.

Guest source hashes match exact Git blobs, not Windows EOL-converted exports:

```text
ops/recovery/failed_claim_recovery.py
4896eb0f4e8d29c7a9dab232ac9da57c48982555e9d106f24856941066502a9c
scripts/failed_claim_recovery_test.py
1c26e690140f717c7daf346811105fa5e1d6428c80b52153f4f9cdf1e8bac136
```

Setup limitations are preserved, not counted as passing tests: the first boot
waited for a nonexistent network; direct kernel boot initially hit an emulated
IO-APIC/timer panic. The final disposable VM boots its original verified kernel
with `noapic` and masks only its network-wait boot service via kernel arguments.
A secondary console `tee` reported I/O error during the synthetic guest's serial
getty restart. The environment and complete unittest result files were retained
and independently read back; unittest exit was 0. These environment adjustments
did not change the recovery source, test source, timeout assertions or expected
results. Performance/timing under TCG is not Production performance evidence.

## Tests executed and exact results

### Phase 1 — unchanged existing suite

```text
env -i PATH=/usr/local/bin:/usr/bin:/bin HOME=/root LANG=C.UTF-8 TZ=UTC \
  python3 -B scripts/failed_claim_recovery_test.py

Ran 28 tests in 71.490s
OK
PHASE1_RESULT=0
```

All 28 completed before the supplementary harness was run. Existing fixture
tests still use synthetic runtime/terminal proof objects where designed; their
success is not presented as real systemd adapter proof. Filesystem permissions,
directory fsync, Linux flock and child processes took the real Linux branch.
The byte-pinned historical helper and receiver were exercised only on synthetic
state, ephemeral loopback, incomplete invalid content and inert activation.

### Phases 2–7 — independent supplementary harness

Executed from **2026-09-25T17:52:11Z through 17:54:04Z**:

```text
env -i PATH=/usr/local/bin:/usr/bin:/bin HOME=/root LANG=C.UTF-8 TZ=UTC \
  python3 -B /opt/recovery-validation/linux_extra.py
EXTRA_TOTAL=29 EXTRA_FAILED=3
```

The reviewed local harness was serial-transferred and its complete SHA256
matched before execution:
`664cab37261da74254fad06f597664894713e1fb7d4a282605c9f065f1e04adb`.
It is external validation support, not a modification of the candidate.

| Phase | PASS | FAIL | Evidence |
| --- | ---: | ---: | --- |
| 2 — POSIX | 4 | 0 | root ownership; 0700 directories; 0600 source; 0400 published evidence; exact bytes/hash; file/directory fsync; O_NOFOLLOW errno 40; real same-directory hardlink/no-overwrite; size limit |
| 3 — flock | 4 | 1 | actual util-linux flock and Python fcntl in separate processes, both contention directions; pre-critical-section inode replacement denied; no missing-lock creation; **late replacement detection fails no-mutation requirement** |
| 4 — systemd | 1 | 1 | real persistent masks/reload/cgroup/socket/job checks and denied competing starts pass; **candidate-shaped bare-template show command fails** |
| 5 — admission race | 1 | 0 | actual paused receiver-like process; absent fence denied; mask alone with live PID denied; stopped/masked state passes read-only preflight |
| 6 — process crashes | 8 | 0 | actual child exit at all eight boundaries; old UUID denied; evidence reconstructible; resume and duplicate idempotence pass |
| 7 — attacks | 8 | 1 | source/evidence symlinks, wrong owner/mode, extra hardlink, lstat/read race and altered published evidence denied; **unexpected extra incident file accepted** |
| Total | 26 | 3 | No failures converted to PASS |

Real flock test details: util-linux coordinator holder made candidate return
`COORDINATOR_BUSY`; candidate holder made competing util-linux flock exit 1 and
a second Python recovery lock return `COORDINATOR_BUSY`. In uncontended/control
cases the existing lock inode and bytes did not change. Fault-injection hooks
deliberately replaced only the synthetic lock inode; locking itself was real
`fcntl.flock(LOCK_EX | LOCK_NB)`, not mocked.

Real systemd units were strictly synthetic:

```text
sv-recovery-lab-receiver.service
sv-recovery-lab-artifact@.service
sv-recovery-lab-artifact@synthetic.service
```

Receiver code only bound `127.0.0.1:43187`, recorded a pause marker and waited.
The artifact template's only executable was `/usr/bin/true`; its start was
rejected while masked. Neither unit contained application or deployment code.
Their packaged unit definitions were under `/usr/local/lib/systemd/system` in
the disposable guest; persistent masks were root-owned `/etc/systemd/system`
symlinks to `/dev/null`. No real SignalVerse unit was created or modified.

At **17:52:25Z**, the initially inactive/static unit could still be explicitly
started, demonstrating why inactivity/non-enablement alone is not a fence.
The paused receiver had PID 1444. Recovery denied without persistent masks.
Masking while PID 1444 remained alive also denied. Only after stopping that
synthetic unit, observing the PID gone, empty control-group state, no listener,
no job and reloading systemd did read-only fixture preflight pass. No synthetic
admission marker or claim was created by that paused receiver.

### Crash/resume matrix

Each child exited 72 at a real execution boundary. Real file/directory fsync
and hardlinks executed before the injected process termination where applicable.
The unchanged, pinned old helper was then invoked with a clock **before old
expiry**, so denial did not rely only on expiration.

| Crash boundary | Old UUID replay result immediately after crash | Resume / duplicate |
| --- | --- | --- |
| Before intent (`preflight`) | AUTHORIZATION_CLAIMED | PASS / no change |
| After intent | AUTHORIZATION_CLAIMED | PASS / no change |
| After tombstone | AUTHORIZATION_REVOKED | PASS / no change |
| After approval retirement | AUTHORIZATION_MISSING | PASS / no change |
| After claim retirement | AUTHORIZATION_MISSING | PASS / no change |
| After completion | AUTHORIZATION_MISSING | PASS / no change |
| After intent directory fsync | AUTHORIZATION_CLAIMED | PASS / no change |
| Immediately after evidence hardlink publication | AUTHORIZATION_CLAIMED | PASS / no change |

Original approval and claim bytes reconstructed from published intent matched
the fixture's original byte stream. Missing completion was not reported as
completed eligibility. Duplicate recovery did not change evidence snapshots.
Malformed/uncertain state rejection is also covered by the unchanged 28-test
suite. This is process-crash evidence, **not physical power-loss durability**.

## Confirmed failures and source mapping

### F1 — lock replacement detected after mutation

At **2026-09-25T17:52:15Z**, a real inode replacement injected at the candidate's
`preflight` checkpoint produced:

```json
{"result":"LOCK_REPLACED","sourcesRemaining":[false,false],"completeExists":true}
```

`exclusive_lock` checks path identity immediately before `yield`, then only
after the entire yielded recovery operation returns (source lines 155–176).
`Recovery.run` can retire both source names and publish `complete.json`
(lines 289–304) before that last check. The CLI would deny, but a completed
eligibility receipt has already been written. This fails the requested
inode-race/no-retirement invariant.

Boundary: this experiment deliberately introduces a privileged filesystem
writer inside the disposable fixture. It does **not** demonstrate an
unprivileged attack or observed Production race. The design currently excludes
hostile root/other privileged writers; that trust assumption must not be
silently substituted for the expressly requested replacement-race test.
Tombstone replay protection remained intact in this case. The finding concerns
late detection and published eligibility, not successful old-UUID reuse.

### F2 — bare-template query invalid on real systemd

At **2026-09-25T17:53:08Z**, while persistent masks and a masked synthetic
instance were proven, the same command shape as candidate line 338 returned:

```text
systemctl show sv-recovery-lab-artifact@.service -p LoadState -p UnitFileState
exit=1
stdout=<empty>
stderr=Failed to get properties: Unit name sv-recovery-lab-artifact@.service is neither a valid invocation ID nor unit name.
```

The candidate uses this against `signalverse-deploy-artifact@.service` and
`read_command` invokes `subprocess.run(check=True)`. Therefore a valid mask can
still be rejected before recovery. We tested the exact syntax with a synthetic
name; no real SignalVerse unit or ProductionHost fixture installation was used.
This is a fail-closed availability defect, not a Guard bypass. A valid
template/unit-file inspection method needs a separately reviewed fix; this task
does not replace the failing command or mock a successful response.

### F3 — unknown incident file ignored

At **2026-09-25T17:54:03Z**, a private root-owned incident directory containing
`unexpected-state.json` before first execution produced:

```json
{"result":{"state":"NEW-APPROVAL-ELIGIBLE","changed":true,"oldUuidReplayable":false},"error":null,"sourcesRemaining":[false,false],"extraPreserved":true,"completeExists":true}
```

`Recovery.run` checks the directory and known intent/complete/tombstone paths,
but does not reject unknown directory entries (source lines 228–244 onward).
The extra file was preserved, but the requested uncertain-state DENY did not
occur. A future fix would need a strict state inventory while still allowing
only proven legitimate same-inode `.pending-*` publication remnants. No such
fix was implemented here.

## Phase 8 — disposable reboot persistence

Reboot requested through the local VM console at **2026-09-25T17:54:39Z** after
synthetic tests completed and evidence was exported. Pre-reboot boot ID:
`ef0a65bf-799c-4b52-b6c2-f41a502b2384`.

**REBOOT PERSISTENCE = PASS.** Post-reboot boot ID:
`2cb86c42-cc26-4c0f-aad5-0db37058c61f`.
The read-only post-reboot fence probe verified both persistent mask symlinks,
receiver and instance `LoadState=masked`, `UnitFileState=masked`,
`ActiveState=inactive`, `SubState=dead`, `MainPID=0`, empty control-group state,
no synthetic listener and no synthetic deployment job. This is an actual guest
reboot with a changed Linux boot ID, not daemon-reload or a simulated reboot.
It cannot upgrade the three failed candidate checks to PASS.

Final isolated-environment evidence was captured at
**2026-09-25T18:01:02Z**: PID 1 remained systemd; only loopback/no routes;
no Production paths or SignalVerse unit files; no synthetic receiver listener;
both candidate source hashes unchanged; execution gate still false. The guest
SSH service was inactive with MainPID=0/NRestarts=0; its socket was inactive.

The separate final read-only evidence collector initially treated the empty
match from `systemctl list-unit-files signalverse*` (exit 1, no entries) as an
execution error. It was corrected to retrieve the successful full unit inventory
and independently assert zero matching names. Only that new evidence collector
changed; no candidate code, baseline tests, supplementary assertions or three
failed results changed. Its corrected read-back passed. After export, graceful
poweroff of the disposable VM was requested. Final console evidence shows
`Finished systemd-poweroff.service`, `Reached target poweroff.target`, and
`reboot: Power down`; its host QEMU PID 23316 no longer exists. No VM disks or
evidence were deleted.

## Zero-side-effect proof and limitations

- No SSH command/session was used. No VPS, Contabo, production receiver,
  database, exchange or real authorization store was contacted.
- QEMU was created with no guest NIC from its first boot; guest inventory
  independently confirmed loopback only and no external routing.
- No host directory or existing disk was mounted into the guest. Only the
  allowlisted source ISO and a fresh writable overlay were attached.
- Synthetic test state uses unrelated all-`a` SHA and test UUIDs; the real
  incident identifiers occur only as source/metadata, never loaded approval data.
- Candidate subprocess allowlist rejection and unchanged live-execution gate
  tests passed. No deploy executable or application source was included in the
  fixture payload. The sole inert artifact unit could not start while masked.
- Report publication to the separate AI-Log repository is an allowed reporting
  action, not an application push, CI dispatch, release or Guard operation.
- Production processes and claim state were deliberately **not re-read** because
  the task prohibits that access. Zero actions taken is not a fresh claim that
  independently running Production cannot have changed for other reasons.
- Full `ProductionHost.prove()` with production paths/journal/runtime was not
  executed. Synthetic terminal/runtime proof is explicitly separate from real
  systemd fencing and POSIX primitive evidence.
- Passing process-kill tests and a clean VM reboot do not prove physical
  power-loss durability, storage-controller behavior or every filesystem race.

## Files inspected

- `ops/recovery/failed_claim_recovery.py`
- `scripts/failed_claim_recovery_test.py`
- `ops/recovery/README.md`
- `reports/security/failed-sha-claim-recovery-design-validation-2026-09-26.md`
- `HANDOFF.md`, `AGENTS.md`, `CLAUDE.md`, `docs/AI_HANDOFF.md`
- `docs/testing/stability-test-runbook.md`
- Pinned historical helper/receiver Git objects at `677bc19d94cbf64b18a7e80adad68d1f9a967a83`
- AI-Log README, report template and secret scanner; generated VM evidence.

## Files changed / implementation

**No candidate executable, existing test, application, Guard, workflow, main or
Production file changed.** Only validation support and documentation:

1. This new report.
2. A dated documentation-only entry in candidate `HANDOFF.md`.
3. Local-only scratch harnesses under `tmp/recovery-linux-validation-20260926/`:
   `prepare_vm.py`, `start_vm.ps1`, `console.py`, `linux_extra.py`,
   `export_evidence.py`, `final_audit.py`.
4. Generated scratch image/overlay/ISO, locally unpacked tooling, source input
   manifest and logs/evidence. These binaries and test artifacts are **not
   committed or published**.

Candidate executable HEAD remains `39217bd67a75d96daa278740366382517385e631`.
Before documentation, that isolated checkout was clean. The unrelated original
checkout's existing changes were preserved. No application commit/push or main
write occurred. No application build or GitHub CI was requested or executed.

Final candidate Git state is documentation-only and **uncommitted**:

```text
 M HANDOFF.md
?? reports/security/failed-claim-recovery-linux-validation-2026-09-26.md
```

`git diff --check` passed; explicit diff of the recovery executable and the
existing test file was empty. The report's secret scan found no matching
credential patterns; manual review found only permitted source/digest/incident
identifiers and synthetic test evidence. The separate reporting checkout was
clean and fast-forwarded to AI-Log master `73b70fe34279c3f1d7b502f120ed8f9ce4651399`
before adding this report. Only this report is included in the new reporting
commit. Its publication commit and remote byte verification are returned in the
task's final response; no application commit is created.

AI-Log report location:
`signal0verse/SignalVerse-AI-Log`, branch `master`,
`reports/security/failed-claim-recovery-linux-validation-2026-09-26.md`.

## Evidence checksums

Exported directly from the guest over local serial, independently read on host:

| Evidence file | SHA256 |
| --- | --- |
| `environment.txt` | `56dab5f760decf350676a04715f2fb31406770f425f4c72a11891e2b7fa87ff5` |
| `phase1.txt` | `0f81a91899e2cfd87fcbdcc0c0deeac6725f699455f5a90f74c12daab383562d` |
| `extra-results.json` | `2f01a207fe2fcb57c635e4ccd1cb4910011c28f8bdf9e9e90bd00cd7bb4fc504` |
| `extra.log` | `02705b941240b4670e856853f6debd875f80b238fe1107d1b3bbe69b7ae9585a` |
| `exact-template-query.json` | `33a05a504fff1ba98ab34acfe28f01140f178244ac2f2e6496ef3d647cfed433` |
| `lock-late-replacement-reproducer.json` | `9ccf492b2df61f9dd6ecae95cab6d40a3a2392bff55fc59b425b70a0cb1af50d` |
| `unexpected-extra-reproducer.json` | `23d1e6c64e7ffff8822716e238d91fca52c20fd0077930f17362776d3ca7d5c1` |
| `post-reboot.json` | `a0993a897d94a8c69e30b66a5b45eda250127008069ddf6044065a90fcd5b6c8` |
| `final-isolation.txt` | `a45ffbec933de7b128b19e0912d659053c87416bcab1feb3c8d986398e316dbb` |

Raw local evidence is in the validation workspace's `evidence/` directory.
The final serial-export archive SHA256 is
`90216ed44d3b9d611731e8dfed7eb7eb652de36ade782aae6a012ee46065028a`.
Only this sanitized report is to be published to AI-Log, not the VM, raw console
log, historical source code, fixture store or executable harness.

## Enablement decision / recommended next step

```text
LINUX_VALIDATION=BLOCKED
LIVE_EXECUTION_VALIDATED=False
LIVE_EXECUTION_VALIDATION_PROVEN=NO
PRODUCTION_NEW_APPROVAL_ELIGIBLE=NOT_ESTABLISHED
ENABLEMENT_CHANGE_PREPARED=NO
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
MAIN_PUSH=NO
```

Separate owner review should address F1/F2/F3 in a new local candidate, retain
these failed results, and rerun the unchanged baseline plus these regressions
on Linux. Do not flip the execution flag, install anything, run recovery, issue
an approval or release the retained artifact based on this validation.

```text
PRODUCTION_RECOVERY_EXECUTED=NO
VPS_TOUCHED=NO
REAL_APPROVAL_CREATED=NO
REAL_APPROVAL_MODIFIED=NO
REAL_CLAIM_MODIFIED=NO
RELEASE_EXECUTED=NO
DEPLOYMENT=NO
DATABASE_CHANGED=NO
ORDERS=0
POSITIONS_CHANGED=0
EXCHANGE_ACTIONS=0
```
