# VPS Production release control-plane rollout — 2026-09-25

Final status: **VPS-RELEASE-CONTROL-ROLLOUT-PASS** for the control-plane-only migration. No application release or valid Guard admission was attempted.

## Authorization and scope

The owner supplied the exact fresh phrase `APPROVE VPS PRODUCTION RELEASE CONTROL PLANE ROLLOUT`. This supersedes the earlier authorization-gate report at this path. The authorized task changed only GitHub Actions control-plane state, the `Production` Environment branch policy, and two workflow files on `main`. No application source, strategy, risk, supervisor, Spot, Demo, database, exchange, credential, scheduler, VPS Guard file/service, or Stage 1B candidate was changed by this task.

## Initial evidence

At the 2026-09-24 UTC preflight, remote `main` was `85aedfb944a67c94227ac343e911bc64a581e79e`, matching the active Production marker and both app/admin release symlinks. The existing `.github/workflows/production-ci.yml` was active and its push path requested GitHub OIDC, packaged `$GITHUB_SHA`, POSTed to `/_deploy/$GITHUB_SHA`, and polled activation. `.github/workflows/production-release.yml` did not exist on `main`. GitHub Actions reported zero queued/in-progress runs. The `Production` Environment existed with no protection rules or branch policy. The VPS Guard receiver was inactive/disabled, with no loopback listener; the previously authorized helper-path symlink resolved to `/opt/signalverse/release-authorization.mjs`.

## Migration sequence and exact patch

1. Created a clean branch from the exact old `main` SHA. The reviewed commit `3e3703dc6a4211ca02c5850d113af3caa00abb83` changes **only** `.github/workflows/production-ci.yml` and `.github/workflows/production-release.yml` (90 insertions, 52 deletions). `git diff --check` and local static assertions passed. The CI diff removes `id-token: write`, automatic archive packaging, OIDC exchange, receiver POST, and status polling; its tests/build remain. The new release workflow has only `workflow_dispatch`, a required full 40-character SHA, `main` ref guard, successful `Production CI` push-run check for that SHA, exact checkout plus ancestor check, `git archive` of the exact SHA and SHA-256 computation, `Production` Environment, OIDC, and Guard delivery/status verification. No release was dispatched.
2. Disabled legacy workflow ID `345798582` through GitHub Actions. A separate read confirmed `disabled_manually` **before** touching remote `main`; the remote head was still `85aed...`.
3. Tried to configure owner `signal0verse` as a required reviewer. GitHub returned HTTP 422: `Failed to create the environment protection rule. Please ensure the billing plan supports the required reviewers protection rule.` No reviewer rule was installed. The Environment was instead restricted with a custom deployment branch policy; its sole allowed branch is `main` (`type=branch`, policy ID `60946656`). This does **not** substitute for a required reviewer.
4. Pushed only commit `3e3703d...` to `main` while the legacy workflow remained disabled. Remote `main` was then verified at the same full SHA. GitHub Contents API returned blob SHA `66c3d1c93366183be6786ab1ee355f54de16ee53` for the now non-deploying CI workflow and `ac63f98be6e5dd24a239ddbab25b769645ad52d4` for the manual release workflow, exactly matching the reviewed commit. The new manual workflow was registered active; no Actions run existed for the migration commit.
5. Only after remote blob verification, re-enabled the **non-deploying CI** workflow. Final GitHub states: `Production CI` ID `345798582` active; `Production Release (manual exact SHA)` ID `366395695` active. Both are workflow registrations, not executed releases. The migration commit still had zero Actions runs when checked. There is no push-to-main path from CI to OIDC credential, Guard POST, artifact admission, or activation in the reviewed remote CI blob.

The Guard independently validates an out-of-band exact-SHA/digest approval on receipt; the workflow computes the archive digest and transmits its exact bytes to the SHA-specific Guard endpoint. No real approval manifest was created and this end-to-end valid-release path remains **UNTESTED**. A manual dispatch and separate VPS approval are still required for a future application release. The Guard receiver intentionally remains disabled; this task did not make a live release request.

## VPS verification and application non-deployment

Final read-only VPS sample: `2026-09-24T19:51:09Z`. The deployed marker was still `85aedfb944a67c94227ac343e911bc64a581e79e`, inode/mtime `609128:1790197100`. App link resolved to `/opt/signalverse/releases/85aedfb944a67c94227ac343e911bc64a581e79e`; admin link resolved to `/opt/signalverse-admin/releases/85aedfb944a67c94227ac343e911bc64a581e79e`. Main/admin/observer PIDs remained `1962862`/`1962858`/`1962856`, with `NRestarts=0` and their original `2026-09-23 20:58:18 UTC` start time. Receiver: inactive/disabled, PID 0. A listed failed artifact unit for `eee238bcd3cf437a9233aac3378e8fc6062d3665` started and exited on **2026-09-08**, so it is historical, not a rollout event; no active artifact unit was found.

Installed Guard SHA-256 values at `2026-09-24T19:49:05Z`:

| Component | SHA-256 |
|---|---|
| receiver | `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa` |
| authorization helper | `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83` |
| coordinator | `572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec` |
| receiver unit | `7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1` |

These match the approved hashes. Existing 18/18 offline and invalid-bearer HTTP 401 DENY results belong to the earlier Guard repair, not to a new valid release test. This task made **no** DB or exchange API calls, order/position/leverage changes, or credential reads/writes. It did not independently audit third-party DB or exchange activity; therefore it cannot prove that no other actor changed those systems.

## Limitations, recovery and next gate

- Required GitHub Environment reviewers are unavailable for this private repository on its current plan (HTTP 422); `protection_rules` contains only the branch policy. Do not describe it as reviewer-protected. Manual dispatch plus separately owner-created, exact-SHA/digest, expiring VPS Guard approval is the actual human authorization chain.
- No successful CI run exists for the migration commit, because CI was intentionally disabled during its push. This commit is **not** automatically eligible for manual release. A later application commit needs its own successful main push CI and separate owner approval; no such release was attempted here.
- The Guard receiver remains disabled. Starting it for a future release, creating a real approval, and testing a valid release require a separately scoped authorization; this report authorizes none of them. Stage 1B and Futures strategy remain unreleased.
- Recovery if a later workflow regression appears: disable the affected GitHub workflow through the Actions control plane first; leave Guard disabled; inspect remote blobs and audit evidence before any new commit or re-enable. Do **not** force-push, restore the old push-deploy workflow, improvise a VPS rollback, or dispatch a release.

Remote control-plane commit: `3e3703dc6a4211ca02c5850d113af3caa00abb83`. Final remote main SHA: the same. Active Production application SHA: `85aedfb944a67c94227ac343e911bc64a581e79e`. No application deployment occurred in this task.
