# Failed SHA-keyed deploy claim — design, implementation and offline validation

## Metadata / executive result

- Date: 2026-09-26 Asia/Kuala_Lumpur; VPS evidence collected 2026-09-25 UTC.
- Repository: `signal0verse/signalverse-main`.
- Local branch: `codex/failed-claim-recovery-20260926`, isolated checkout.
- Base and unchanged remote main: `10075341cdca3782cdd254d784afe39d818f7c0d`.
- Local implementation commit: supplied in the final task response and AI-Log publication, not substituted for the application SHA.
- **Local implementation / Windows offline suite: PASS, 28/28.**
- **Live recovery readiness: BLOCKED.** Disposable Linux flock/directory-fsync/permissions and real systemd-fence integration remain untested. The mutation CLI is deliberately hard-disabled pending that validation and review.
- **Production claim recovery: NOT EXECUTED. Production NEW-APPROVAL-ELIGIBLE: NO.**
- Installed Guard, existing claim/approval, application runtime and services are unchanged.

## Objective and authorized scope

Design and test safe recovery of the failed SHA-keyed claim without release,
deployment, approval issuance/consumption, installed Guard changes, database or
trading actions. VPS access was read-only. The isolated local implementation is
not an installed command and has no workflow integration. No application push,
main modification or CI dispatch occurred.

Pinned identities remain:

```text
application target = 5eb6094658a692ba32687fccaa9759d20b68d6b5
retained artifact ID = 10875754793
retained archive SHA256 = 5a25a166cca27eadaf8281ea783d1cb91cf12e50f62dfb431bfcdb99b683c8be
old UUID = 3bbbf63d-65c1-45c2-82d1-7be1943c7f52
old approval/claim SHA256 = 663b42664e1695ce1ca800e01b46a6bf6e8261ae54d9a9d9ffeb8c44c83af1cb
```

The retained artifact was neither downloaded again nor rebuilt in this task.
Its independently verified identity comes from the preceding prepare-only
report/run, not from a new packaging claim.

## 1. Read-only findings

Read the complete installed files, not only repository copies:

| Installed path | SHA-256, unchanged at final readback |
| --- | --- |
| `/opt/signalverse/deploy-receiver.mjs` | `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa` |
| `/opt/signalverse/release-authorization.mjs` | `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83` |
| `/usr/local/sbin/signalverse-deploy` | `572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec` |
| `/etc/systemd/system/signalverse-deploy-receiver.service` | `7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1` |
| `/etc/systemd/system/signalverse-deploy-artifact@.service` | `1a95022b391deba37bb3b161c6526fc4423f6966904177a8653e5284e52d82a4` |

The receiver imports `/opt/signalverse/signalverse-release-authorization.mjs`,
verified as a symlink to the same `release-authorization.mjs` (same hash).

Read-only sources: `systemctl cat/show/list-jobs/list-units`; receiver journal
for the actual failed-delivery window; store layout/owners/modes/hashes and exact
old manifest; incoming and target release-directory presence; `ss`; `lslocks`;
active marker, app/admin links and process cwd. No env file, exchange credential,
database connection, private account or trading endpoint was read.

Confirmed call graph:

```text
receiver.verifyToken -> inspectApproval -> claimApproval (wx SHA hold)
 -> receiveArchive -> exact digest comparison
 -> only if successful: systemctl start --no-block artifact@SHA

coordinator -> global flock -> prepare build
 -> helper.consume -> recheck manifest/expiry/revocation/claim/digest
 -> consumed UUID link -> claim unlink -> runtime activation
```

Receiver admission does NOT acquire the coordinator flock. Revocation polling
plus the coordinator flock alone cannot serialize an already-paused admission.
The existing helper has no recovery operation; expiry never removes the hold.

Actual relevant journal MESSAGE text (timestamps are from the recorded events):

```json
{"event":"deploy_receiver","at":"2026-09-25T16:07:05.781Z","requestedSha":"5eb6094658a692ba32687fccaa9759d20b68d6b5","approvedSha":"5eb6094658a692ba32687fccaa9759d20b68d6b5","authorizationId":"3bbbf63d-65c1-45c2-82d1-7be1943c7f52","version":1,"validation":"PASS","consume":"NOT_STARTED","activation":"NOT_STARTED"}
{"event":"deploy_receiver","at":"2026-09-25T16:07:06.278Z","requestedSha":"5eb6094658a692ba32687fccaa9759d20b68d6b5","approvedSha":"5eb6094658a692ba32687fccaa9759d20b68d6b5","authorizationId":"3bbbf63d-65c1-45c2-82d1-7be1943c7f52","version":1,"validation":"REJECT","consume":"NOT_COMPLETED","activation":"NOT_STARTED","reason":"ARTIFACT_SHA_MISMATCH"}
```

The old manifest was issued `2026-09-25T15:51:36Z`, expired
`2026-09-25T16:51:36Z`; it is actually expired at both current forensic reads.
Both approval and claim remain 236 bytes, root:root 0600, with the pinned hash.
The old manifest binds the previous Windows digest, not the corrected artifact.
No consumed/revoked record for its UUID and no target incoming/partial/release
path were found. No queued/running target activation was observed. One unrelated
historical failed artifact unit remains; it was not cleared or reinterpreted.

The receiver is still active/listening. Thus these are timestamped observations,
**not a durable no-future-admission proof**. Actual recovery cannot run in this
state. No lock was acquired or maintenance fence established on the VPS.

## 2. Recovery design

Full design and state/failure tables: local candidate `ops/recovery/README.md`.

Chosen model: an externally authorized durable maintenance fence excludes the
receiver and new artifact-unit starts; the existing global coordinator flock
excludes execution and consumption. Both are required. No receiver/helper or
coordinator behavior change is needed. The recovery tool never establishes or
removes the service fence and contains no start/stop/restart capability.

Required future preconditions are persistent root-owned, loaded systemd masks
for the receiver and artifact template; fully stopped receiver; no receiver,
coordinator or consume process/cgroup tasks; no sockets, deployment jobs or
target artifact/build; complete exact rejection journal; unchanged known
runtime; exact installed hashes; expired, unconsumed, unchanged old manifest.
Unknown/missing/ambiguous evidence is DENY before mutation.

Retirement ordering under the flock:

1. Write durable read-only `intent.json`, preserving complete original approval
   and claim bytes, SHA-256 and filesystem metadata plus forensic proof.
2. Write/fsync permanent `revoked/<old UUID>` tombstone bound to the intent hash.
3. Recheck and retire only the old approval path, then fsync its directory.
4. Recheck and retire only the old claim path, then fsync its directory.
5. Recheck unchanged runtime/fence/evidence and publish `complete.json` binding
   intent/tombstone and the future retained-artifact digest.
6. Report NEW-APPROVAL-ELIGIBLE and STOP, keeping maintenance fences intact.

This is an ordered crash-safe transaction protocol, not an assertion that two
path removals are a single atomic syscall. Old Guard always sees the old claim,
a revoked UUID, or a missing approval. No temporary state grants a release.
The completion receipt is not an approval. Old UUID revival, old digest fallback,
claim reuse, expiry bypass and automatic release are never permitted.

The trusted-root threat model is explicit: root-private 0400/no-overwrite records
and cryptographic hashes are audit immutability, not hardware WORM against
hostile root. A future execution must publish sanitized evidence hashes off-host.
Uncoordinated privileged operators are not permitted during maintenance.

## 3. Exact files changed

1. `ops/recovery/failed_claim_recovery.py` — new uninstalled incident-specific
   recovery core and read-only production evidence adapter, fixed identity/path,
   existing-inode nonblocking lock and hard-disabled live mutation gate.
2. `ops/recovery/README.md` — design, trust/locking/crash/replay model, scope and
   future separately authorized validation/maintenance requirements.
3. `scripts/failed_claim_recovery_test.py` — disposable synthetic fixtures and
   child-process tests; pinned unchanged Guard helper/receiver integration.
4. `reports/security/failed-sha-claim-recovery-design-validation-2026-09-26.md` — this report.
5. `HANDOFF.md` — local candidate, evidence and live-blocked state only.

No existing Guard/receiver/helper/coordinator/unit, application, Futures, Spot,
workflow, schema or migration file was modified. No artifact was repackaged.

## 4. Tests executed

Environment: Windows, Python 3.14, Node 24 local. WSL is not installed; Docker's
Linux daemon is not running. Neither was installed or started for this task.

```text
python -B scripts/failed_claim_recovery_test.py
28 tests; 28 PASS; zero skips; final run 14.611s
```

Additional syntax: Python AST parse of both source/test files PASS; `git diff
--check` PASS. No unrelated application tests/builds or production scripts ran.

| Coverage | Actual evidence |
| --- | --- |
| Expired claimed failed authorization | Fixture transitions to eligibility with exact original bytes/stat/hash preserved. |
| Stale but unexpired authorization | DENY. Expiry alone without terminal failure proof also DENY. |
| Concurrent receiver admission/upload | Unmodified byte-pinned receiver runs on random loopback port, synthetic auth and incomplete upload. Recovery rejects the active receiver, does not interrupt it or change its files; activation callback is inert/forbidden. |
| Receiver state changes between checks | DENY before first recovery write. |
| Concurrent coordinator | Real separate process owns the lock; recovery fails busy. On Windows this exercises msvcrt locking, NOT Linux flock. |
| Crash at retirement boundaries | Six actual child-process terminations: preflight, intent, tombstone, approval retirement, claim retirement, completion; resumable under unchanged proof, duplicate no-op. |
| Link/fsync publication interruption | Injected interruptions for intent, tombstone and completion, including preserved pending hard link; safe resume. Not a physical power-loss test. |
| Replay old UUID | Actual pinned helper rejects restored synthetic old manifest as REVOKED even using a pre-expiry clock. |
| Replay old SHA / later fresh claim | SHA alone gets MISSING. Only fixture-issued fresh UUID/digest can claim once; second claim is rejected. Recovery itself issues nothing. |
| Duplicate / new manifest / malformed / tamper | No-op duplicate; new manifest preserved/denied; malformed/duplicate-key JSON, altered source/tombstone, missing claim and unknown revocation denied. |
| Uncertain deployment/consumption | Twenty false/missing safety-flag subcases plus queued/consumed/runtime-changed cases denied. |
| No activation/service side effects | Core succeeds with subprocess execution replaced by a failing spy; write service commands, journal mutations, socket-kill, shell/deploy/curl calls rejected by command allowlist. |
| Live execution gate | `--execute-retirement` rejects with LINUX_VALIDATION_AND_REVIEW_REQUIRED before any Production access. |

Permission/symlink distinction: the Windows fixture uses real files/child
processes but explicitly does not model POSIX directory fsync or permission
bits. The unsafe-file branch is injected on Windows; the same test creates an
actual symlink on Linux. Those checks are not represented as Linux validation.

Early test failures exposed Windows stat/fstat ctime semantics, the mandatory
Windows lock preventing fixture snapshot reads of its lock byte, and the old
Node helper CLI detecting its module path in the fixture argv. Corrected the
Windows-only metadata adapter/test harness; Linux source checks remain strict.
The final complete rerun passed. No failed invariant was bypassed on Production.

## 5. Crash/concurrency review and remaining gate

Read-back/self-review confirmed: the admission fence is independent of flock;
the source is not an online-recovery substitute; revocation precedes all SHA
hold retirement; originals are preserved before removal; no rollback un-revokes
UUID; missing/changed evidence stops; new approval encountered by duplicate
recovery is never removed; all service commands are read-only; no shell execution
or install step exists.

The live CLI cannot execute retirement yet. Required next validation is an
isolated non-Production Linux run with real flock contention, directory fsync,
ownership and symlink behavior, plus synthetic systemd units exercising the
maintenance/read-only adapter. Windows tests and source review cannot prove
those OS integration properties. Independent security review and separate owner
authorization must precede enabling/installing/executing this candidate.

No external independent reviewer or Linux runtime test is claimed in this task.

## 6. Zero deployment side-effect evidence

VPS initial reads: `2026-09-25T17:08:48Z` and `17:09:15Z`.
Final comparison: **`2026-09-25T17:22:18Z`**.

| Runtime evidence | Before | After |
| --- | --- | --- |
| marker SHA | `b3195f788e14e393464e93aa9545cc7614a1caaf` | identical |
| `/opt/signalverse/app` | `/opt/signalverse/releases/b3195f788e14e393464e93aa9545cc7614a1caaf` | identical |
| `/opt/signalverse-admin/app` | `/opt/signalverse-admin/releases/b3195f788e14e393464e93aa9545cc7614a1caaf` | identical |
| main PID / NRestarts | `2177526 / 0` | identical |
| admin PID / NRestarts | `2177522 / 0` | identical |
| observer PID / NRestarts | `2177519 / 0` | identical |
| receiver PID / NRestarts | `2166041 / 0` | identical |
| main/admin/observer start | `2026-09-25 12:53:35 UTC` | identical |
| receiver start | `2026-09-25 10:48:00 UTC` | identical |
| service state | all four active/running | identical |
| target incoming/partial/release paths | absent | absent |
| target consumed/revoked records | absent | absent |
| target artifact unit queued/running | none observed | none observed |
| installed control-plane hashes | table above | identical |
| old approval/claim hashes, sizes, owners/modes | pinned hash, 236 bytes, root:root 0600 | identical |

Main/admin/observer process cwd resolved to the corresponding recorded releases
in the initial read. No runtime changing command was issued. At final read the
receiver still listened on 127.0.0.1:3002, with no established upload connection
shown, and `systemctl list-jobs` showed no jobs. These observations do not establish
a durable maintenance fence; they confirm why live recovery remains blocked.

Remote main was re-read at completion as `10075341cdca3782cdd254d784afe39d818f7c0d`.
Local main remains `85aedfb944a67c94227ac343e911bc64a581e79e`; it was not synchronized.
No application push occurred. The only external write is this sanitized report
to the separate AI-Log repository after local commit; remote bytes/commit are
verified and recorded in the final response.

## 7. Old claim final state

**UNCHANGED, EXPIRED, CLAIMED, UNCONSUMED.** The old authorization was not reused,
renewed, revoked or removed. Its exact bytes and metadata remain on the VPS.
It cannot be used through the current Guard because it is expired and the
SHA-keyed hold still exists. No claim of a newly created permanent tombstone is
made: that only exists in synthetic offline fixtures at this stage.

## 8. NEW-APPROVAL-ELIGIBLE state

- Offline synthetic fixture: YES, proven with durable-step model and old UUID
  rejection plus one new synthetic claim.
- Actual Production SHA: **NO**. Old hold remains; no recovery receipt/tombstone
  or new approval was created. Live execution stays hard-disabled and requires
  Linux validation plus separate maintenance/recovery authorization.

## 9. Git / publication

Five scoped files are committed only to the isolated local branch. No main merge,
push, CI, release or deployment. Exact implementation and AI-Log publication
commit SHAs are supplied with the final verified report link in the task response.
Existing owner workspace and other contributors' work remain untouched.

## 10. Final boundaries / next action

Stop after this local candidate and report. Do not issue an approval or release.
The next technical gate is **disposable Linux + systemd-fence validation**, not
live claim deletion. Then review/authorize the maintenance-fence operation and
recovery separately. Recovery must stop again before approval issuance or release.

```text
RELEASE_EXECUTED=NO
DEPLOYMENT=NO
APPROVAL_CREATED=NO
CLAIM_REUSED=NO
CLAIM_RECOVERY_EXECUTED=ONLY_IF_SEPARATELY_AUTHORIZED
ACTUAL_CLAIM_RECOVERY_EXECUTED=NO
DATABASE_CHANGED=NO
ORDERS=0
POSITIONS_CHANGED=0
EXCHANGE_ACTIONS=0
GUARD_CHANGED=NO
APPLICATION_CHANGED=NO
MAIN_CHANGED=NO
```

Action counts describe this task; no claim is made that unrelated autonomous
Production activity or all database/account rows were globally frozen/audited.

## Verified implementation identity at publication

```text
LOCAL_IMPLEMENTATION_COMMIT=39217bd67a75d96daa278740366382517385e631
BRANCH=codex/failed-claim-recovery-20260926
APPLICATION_REPOSITORY_PUSH=NO
PRODUCTION_RECOVERY_EXECUTED=NO
```
