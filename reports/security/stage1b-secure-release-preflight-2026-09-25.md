# Stage 1B secure release preflight — 2026-09-25

Final status: **STAGE1B-SECURE-PREFLIGHT-BLOCKED**. This was a dry-run only. Stage 1B was not deployed, the manual Production Release workflow was not dispatched, and no valid authorization or artifact was admitted.

## Exact identities and scope

| Item | Fresh evidence |
|---|---|
| Remote `main` | `3e3703dc6a4211ca02c5850d113af3caa00abb83` (`git ls-remote`) |
| Active Production marker and app/admin symlinks | `85aedfb944a67c94227ac343e911bc64a581e79e` at `2026-09-24T20:07:39Z` and again `20:18:18Z` |
| Isolated candidate | `4fd7ebf0b276277a767b48b678e0b25cd9d84bf2`, clean worktree |
| Candidate merge-base with active Production | exactly `85aedfb944a67c94227ac343e911bc64a581e79e` |
| Candidate/main relationship | `git merge-base --is-ancestor 4fd7... 3e3703d...` returned **1**: candidate is **not** on `main` |
| Successful `Production CI` push runs for candidate SHA | **0**, GitHub Actions query |

The candidate diff against active Production is exactly 10 files: `HANDOFF.md`, `api/_shared/futures-candle-provenance.ts`, `api/analyze.ts`, `api/copytrade.ts`, three dated Stage 1B reports, `scripts/futures-binance-provenance-validation-test.mjs`, `scripts/futures-candle-provenance-test.mjs`, and `scripts/futures-mexc-native-routing-test.mjs`. It contains no `.github`, `ops`, Guard, scheduler, database migration, Spot/Demo strategy, or unrelated application files. The three API-file changes attach native candle time/hash provenance to Real decision inputs and persistence; inspected diffs contain no order-execution, Strategy, Risk, or Supervisor formula edit. This is source-scope evidence, not live equivalence.

## GitHub control plane and blocking gate

The remote blobs match the reviewed control-plane commit: `production-ci.yml` blob `66c3d1c93366183be6786ab1ee355f54de16ee53` and `production-release.yml` blob `ac63f98be6e5dd24a239ddbab25b769645ad52d4`. Both workflows are active registrations. CI has only tests/build on ordinary `main` push: no `id-token: write`, archive-delivery step, `/_deploy` POST, or status-polling path. The release workflow has only `workflow_dispatch`, requires a full 40-character SHA, runs only on `refs/heads/main`, checks a successful `Production CI` **push** run on `main` for that exact SHA, checks out the exact SHA, verifies its ancestry on `origin/main`, archives that SHA, computes archive SHA-256, references the `Production` Environment, and uses OIDC only in that manual job. No workflow was dispatched during this task.

The `Production` Environment has exactly one branch policy, `main`; it has **no required reviewer**. GitHub previously rejected the attempted reviewer rule with HTTP 422 for this repository plan. It must not be called reviewer-protected. The independent, expiring, exact-SHA/digest Guard approval remains a separate manual human gate.

**Decisive blocker:** the requested candidate SHA `4fd7...` is not an ancestor of the new `main` and has no successful `main` push CI run. The actual manual workflow would reject it before checkout, OIDC or Guard delivery. Preparing an equivalent candidate on the new `main` would produce a **new SHA**, which requires its own scope review, successful CI and separate release authorization. The exact old candidate cannot be described as release-ready.

## Guard installation and DENY evidence

Read-only VPS preflight at `2026-09-24T20:07:39Z`: receiver unit loaded, inactive/disabled, PID 0, `NRestarts=0`, `ExecStart=/usr/bin/node /opt/signalverse/deploy-receiver.mjs`, `UMask=0077`, `ReadWritePaths` limited to `incoming` and `claims`; port 3002 had no listener. Helper symlink resolved to `/opt/signalverse/release-authorization.mjs`. `approvals`, `claims`, `revoked`, and `consumed` were root:root `0700` and each had zero files. Approved installed SHA-256 values:

| File | SHA-256 |
|---|---|
| receiver | `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa` |
| authorization helper | `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83` |
| coordinator | `572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec` |
| receiver unit | `7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1` |

The receiver was briefly started solely for negative tests. Its journal recorded `READY` at `2026-09-24T20:13:12.772Z`; TCP check observed only `127.0.0.1:3002` at `20:13:56Z`. A synthetic missing-bearer POST returned HTTP **401**. A syntactically correct `Authorization: Bearer invalid` POST returned HTTP **401** with `OIDC_MALFORMED` during the second bounded check (`READY_AT=20:17:37Z`). An earlier malformed header also returned 401 but is not counted as proof of OIDC parsing. The installed helper's read-only `inspectApproval` for exact candidate SHA returned `AUTHORIZATION_MISSING` (expected). Both brief receiver runs ended with stop/disable; no valid OIDC token, real approval manifest, admission, or release request was used.

Offline `node --test scripts/deploy-control-test.mjs` on the Guard development branch passed **14/14** with disposable OS-temp fixtures. The covered DENY matrix includes wrong/missing SHA approval, malformed/expired/revoked approval, wrong artifact digest, consumed/replay/partial claim, wrong repository/ref/branch, push event, wrong workflow identity, and final coordinator consume gate. The same suite includes a synthetic success-path fixture, but it never contacts VPS and is **not** a valid Production release. These fixture results do not prove every negative case against the live receiver; only the live 401 and installed-helper missing-approval checks above were performed on VPS. In particular, no expired/revoked/replay fixture was planted on VPS.

## Candidate tests and simulated chain

Focused candidate tests ran from clean isolated worktree `codex/binance-stage1b-isolated-20260925`:

| Check | Fresh result |
|---|---|
| `futures-candle-provenance-test.mjs` | 6/6 PASS |
| `futures-binance-provenance-validation-test.mjs` | 35/35 PASS |
| `futures-real-price-basis-test.mjs` + `futures-correctness-test.mjs` | 15/15 PASS |
| `futures-pro-timeframes-test.mjs` | 18/18 PASS |
| esbuild, `api/analyze.ts` and `api/copytrade.ts`, `write:false` | 0 errors, 0 warnings each |
| `npm run build` | PASS for web and admin; initial sandbox-restricted attempt failed with `EPERM` while creating isolated `dist`, then succeeded with write permission to that isolated worktree |

Local Node was **v24.19.0**, not the runbook's Node 22.x; this is an environment-parity limitation. The isolated worktree remained Git-clean after its ignored build outputs.

Dry-run chain: manual workflow configuration and exact-SHA/CI checks were statically inspected; candidate identity/diff and synthetic Guard rejection behavior were tested. The chain stops **before** artifact creation for admission and before OIDC because the candidate lacks `main` ancestry and successful CI. No disposable fixture was submitted to Production. The actual OIDC issuance, Production Environment job admission, valid Guard approval, coordinator activation, and final release check were **NOT TESTED** and cannot be called PASS. The Guard's OIDC identity proves the manual workflow/ref, while target SHA and artifact digest are bound by workflow input/URL and the independent Guard approval; the OIDC `sha` is the workflow commit, not necessarily the target application commit.

## No-side-effect verification and next gate

Final read-only VPS check at `2026-09-24T20:18:18Z`: marker still `85aedfb944a67c94227ac343e911bc64a581e79e`, unchanged marker inode/mtime `609128:1790197100`, both app/admin symlinks still point to that release, main/admin/observer PIDs `1962862`/`1962858`/`1962856` with `NRestarts=0`. Receiver inactive/disabled, PID 0, no port-3002 listener. There were zero files newly modified since `20:12Z` in approval/claim/revocation/consumption/incoming top-level directories. No active deploy artifact unit existed; the only listed failed artifact unit dates to **2026-09-08**. This task made no DB or exchange API calls and no order, position, leverage, Strategy, Spot, Demo, scheduler, credential, or Production application change. Independent DB-schema/data and private-account reconciliation were not performed and cannot be claimed from these checks.

**Exact next gate:** prepare a newly identified Stage 1B candidate on top of current `main`, re-review its exact diff and SHA, obtain a successful `main` push CI run, and request a separate owner authorization before any real approval, Guard enablement, manual workflow dispatch, or application deployment. This report is **not** that authorization. It does not prove Binance live observation, strategy improvement, profitability or AI Supervisor effectiveness.
