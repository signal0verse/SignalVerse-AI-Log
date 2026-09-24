# Production deploy-control hardening — branch-only candidate, 2026-09-24 UTC

## 1. Executive summary

**CONTROL-HARDENING-PARTIAL.** A fail-closed, exact-SHA, one-time release-control candidate was implemented and tested **only** on `codex/production-deploy-control-20260924`, implementation commit `677bc19d94cbf64b18a7e80adad68d1f9a967a83`. Nothing was merged or pushed to application `main`; no VPS control-plane file or Production runtime was changed. The installed VPS receiver and current `main` workflow remain the old, push-deploying versions, so the candidate is **not active** and is **not Production Ready**. The Real Futures release remains `BLOCKED` independently of this work.

At the read-only check during this task, Production marker and active runtime remained `85aedfb944a67c94227ac343e911bc64a581e79e`; the main service and receiver were active with no reported restart. No trade, exchange API, credential, DB write, migration, service restart, rollback, new Shadow or application release was initiated.

## 2. Existing vulnerability and verified path

The existing `.github/workflows/production-ci.yml` triggers on `push` to `main`/`master`, pull requests and manual dispatch, but its package/deliver steps ran automatically on **push**. A push received an OIDC token and POSTed `git archive` bytes to `/_deploy/<sha>`. The installed `/opt/signalverse/deploy-receiver.mjs` checked GitHub OIDC signature, issuer/audience, repository, branch, `event_name=push`, workflow reference and token SHA/path consistency; it did not require independent owner approval or bind an owner-computed artifact digest. It wrote `incoming/<sha>.tar.gz` and started `signalverse-deploy-artifact@<sha>.service`. That unit ran `/usr/local/sbin/signalverse-deploy <sha>`, which validated/extracted/built the archive, created main and admin release directories, swapped `/opt/signalverse/app` and the admin symlink, restarted services, checked health, then wrote the active marker. Its global `flock` serialized deploys but was not an authorization gate.

This is the route that activated the owner-unapproved `85aedfb` in [Production CI run 35919072919](https://github.com/signal0verse/signalverse-main/actions/runs/35919072919). At this task's read-only inventory, the receiver unit was active, its source SHA-256 was `a2be21974760cde9fb7658d73787840603fd27410166f3c791c6d1b6142e0e8d`, the installed coordinator SHA-256 was `b3f4f5a6f2698cc7001059e28d7fbf628d40538bb9e4bba758538acc4f453c80`, and the only deployment-state child directory seen was `incoming` (root:signalverse, mode 0750). No approval/claim/consumed/revocation store existed. The GitHub `Production` environment returned `protection_rules=[]` and no branch deployment policy. Branch-protection API access returned HTTP 403 with an account-plan message; no branch-protection conclusion was inferred from that denial. The repository had one deploy-related workflow before this candidate.

## 3. Threat model and chosen control architecture

The in-scope adversary can push to main or compromise a CI job/OIDC-bearing workflow, replay requests, substitute archive bytes, race duplicate requests or trigger an interruption. They cannot write root-controlled VPS approval files or modify the trusted receiver/coordinator binaries. A compromised VPS root or forged owner approval is outside this control's guarantee and needs host/identity controls.

The candidate uses two independent gates and no new external service:

1. Push/PR/manual `Production CI` continues testing and building but has no OIDC permission, package-delivery step or deploy URL. A separate `production-release.yml` runs only by `workflow_dispatch` on `main`, requires an explicitly supplied full 40-character SHA, verifies a successful push CI run for that SHA, checks out exactly that commit, checks main ancestry, packages that commit and sends it with a manual-workflow OIDC principal. Its `Production` Environment is defense in depth; current reviewer rules are **not configured**.
2. An owner-controlled, out-of-band, root-owned approval manifest on VPS binds a fresh UUIDv4 authorization ID, exact commit SHA, independently computed archive SHA-256, issue time and expiration (maximum one hour). CI cannot issue approvals. The candidate receiver only accepts OIDC from the manual release workflow on `main`, validates this approval **before archive admission**, exclusively creates a claim, verifies the uploaded artifact digest, and only then queues the artifact unit.
3. Under the existing global deploy `flock`, the candidate coordinator calls the authorization helper **immediately before the first symlink swap**. The helper rechecks manifest, claim, revocation, expiry, exact SHA and incoming artifact SHA-256. It exclusively creates a durable consumed hard link before activation, then removes the claim. A crash after consumed-link creation leaves the authorization spent, even if no application activation occurred. Rejection occurs with `activated=false`, before any symlink swap, service restart or marker update.

The receiver unit candidate restricts writable paths to `incoming/` and `claims/`; `approvals/`, `revoked/` and `consumed/` must be provisioned root-only and remain unwritable to the receiver's mount namespace. JSON audit lines identify requested/approved SHA, authorization ID/version, validation/claim/consume/activation state and rejection reason without logging OIDC tokens, credentials or private account data. The operator must compute the archive digest from a trusted checkout rather than copying a potentially compromised CI log. [The staged rollout protocol](../../ops/release-control-rollout.md) explicitly forbids merging to main before a separately authorized VPS guard installation.

## 4. Exact implementation and guarantees

| Candidate file | Change |
| --- | --- |
| `.github/workflows/production-ci.yml` | Removes push package/delivery and OIDC permission; adds offline control tests while retaining existing build/test path. |
| `.github/workflows/production-release.yml` | New manual exact-SHA workflow, main-only, CI-success/ancestry checks, manual OIDC delivery, `Production` environment binding. |
| `ops/signalverse-deploy-receiver.mjs` | Tracked replacement for previously VPS-only receiver; manual OIDC provenance, pre-admission approval, exclusive claim, exact artifact digest, no overwrite, sanitized audit. |
| `ops/signalverse-release-authorization.mjs` | Strict root-owned manifest and directory validation, one-hour expiry, revocation, single-use claim, activation-time recheck, consumed hard-link with crash-safe replay denial. |
| `ops/signalverse-deploy` | Final consume gate placed after build/validation but directly before `activated=true` and first symlink swap; successful activation audit line. |
| `ops/signalverse-deploy-receiver.service` | Candidate receiver sandbox with writes limited to incoming and claims. |
| `scripts/deploy-control-test.mjs` | Offline deterministic tests on disposable local directories and stubbed unit starts. |
| `ops/release-control-rollout.md`, `HANDOFF.md`, `docs/AI_HANDOFF.md` | Trust assumptions, required manual sequencing and candidate-only warning. |

Candidate properties, **conditional on correct future installation**, are: missing/wrong/malformed/expired/revoked/consumed approval rejects; wrong archive digest rejects; normal push OIDC rejects; a successful claim is exclusive; two simultaneous requests cannot both claim; consumption is recorded before activation; an interruption after consumption cannot replay; rejection leaves application symlinks, marker and service restart path untouched. These are code/fixture guarantees, **not** live Production verification. The consumed record intentionally survives a failed activation; another attempt requires a fresh owner decision.

## 5. Offline test matrix

Executed at approximately 2026-09-24T12:01Z on local Node `v24.19.0`, with disposable OS-temp directories, fake archive bytes and stubbed systemd calls. `node --test scripts/deploy-control-test.mjs`: **14/14 test groups PASS, 0 FAIL**. `node --check` for both new JavaScript control files, Git Bash `bash -n ops/signalverse-deploy`, and staged `git diff --check`: **PASS**. No application build, private-account integration, VPS install or live deploy test was run; the intended Node 22/Linux service environment remains untested.

| Required case | Offline evidence / status |
| --- | --- |
| 1–2. Push builds/tests but cannot deliver or activate | Static workflow assertions: no deploy URL/OIDC permission in push CI; push OIDC rejected by receiver. **PASS** |
| 3. Manual release without authorization | Receiver returns rejection before archive or unit start. **PASS** |
| 4. Approval for different SHA | Strict manifest SHA comparison rejects. **PASS** |
| 5. Expired approval | Admission and activation-time expiration checks reject. **PASS** |
| 6. Revoked approval | Admission and activation-time revocation checks reject. **PASS** |
| 7. Reused approval | Claim and consumed records reject reuse. **PASS** |
| 8. Malformed approval | Invalid JSON, fields, UUID, digest and version reject. **PASS** |
| 9. Valid exact SHA and archive | Receiver queues one stub unit and helper accepts exact bytes. **PASS** |
| 10. Consume exactly once | Consumed record created; second consume rejects. **PASS** |
| 11. Concurrent duplicates | Two local processes raced exclusive claim; one succeeded, one rejected. **PASS** |
| 12. Artifact SHA mismatch | Receiver refuses start; activation helper also rejects changed bytes. **PASS** |
| 13. OIDC provenance mismatch | Push event, other ref/repository/workflow/audience/expired token claims reject. **PASS** |
| 14. Receiver/consume interruption | Persistent partial claim and consumed-link-before-unlink crash fixtures deny replay. **PASS** |
| 15–16. Activation-time missing approval or SHA mismatch | Helper rejects before consumption and active-state changes. **PASS** |
| 17–19. No restart/symlink/marker change on rejection | Stubbed receiver records zero unit starts; marker/link sentinels remain; shell source places consume gate before all swap/restart/marker writes. **PASS in fixture/static scope; live integration NOT APPLICABLE** |
| Existing non-Production CI | Push/PR triggers and build/test steps retained by static assertions. **PASS in static scope; CI runner NOT APPLICABLE** |

## 6. Remaining manual configuration and Production safety

This task performed **no Production action**. The existing deployed receiver still accepts push-origin OIDC and the existing main workflow can still auto-deliver on a future main push. Consequently, the system is **not yet protected** merely because the branch candidate passed tests. The safe future sequence requires separate owner approval to provision root-only directories, install/verify the helper/receiver/coordinator and receiver sandbox on VPS without changing the active application SHA, validate denials, **then** merge the workflow change to main. Reversing that order could trigger the old push-deploy path. No such sequence was initiated here.

GitHub Environment `Production` still needs a required reviewer and main-only branch restriction if the repository plan allows it; private-repository branch-rule API returned 403, so neither rule nor reviewer is claimed configured. A trusted owner process must create/revoke short-lived, exact-SHA-and-artifact-hash manifests out of band. Linux/Node 22 integration, a safe VPS receiver-denial test, the actual unit sandbox and the merged manual release workflow all need separate validation. Any future operator action must recheck active marker, symlink and process and obtain distinct authorization; this report grants none.

Branch: `codex/production-deploy-control-20260924`. Implementation commit: `677bc19d94cbf64b18a7e80adad68d1f9a967a83`. The branch is local only: **not pushed, not merged, not deployed**. The root report and its AI-Log publication are documentation, not active control. Production SHA observed remained `85aedfb944a67c94227ac343e911bc64a581e79e`; unauthorized-change incident and Futures release gates remain open.

CONTROL-HARDENING-PARTIAL
