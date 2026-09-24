# SignalVerse VPS Guard LF package rebuild — pre-install only, 2026-09-24 UTC

## Decision

**PACKAGE-BLOCKED.** A byte-exact LF package was built locally and passed two independent local self-test invocations (four fresh extraction directories total), but the required extraction and executable-mode validation on a genuine Linux filesystem and `systemd-analyze verify` have **not** run. This Windows host has no installed WSL distribution, Docker, Podman or `systemd-analyze`. The owner prohibited any VPS action in this task, so the VPS was not used as a Linux test host. Do not equate the successful Windows/Git-Bash checks with the missing Linux gates. The package is **not approved for installation**, the VPS Guard is **not installed or live-verified**, and the prior failed package must never be reused.

Source branch: `codex/production-deploy-control-20260924`. Exact implementation source commit: `677bc19d94cbf64b18a7e80adad68d1f9a967a83`. The previous stopped installation is documented in `reports/futures/production-deploy-control-vps-installation-2026-09-24.md`. The expected Production runtime is `85aedfb944a67c94227ac343e911bc64a581e79e`; it was last verified in that prior task at `2026-09-24T13:45:15Z`. **No new VPS connection or current-runtime read was made here**, per the explicit no-VPS instruction. Production impact caused by this task: **NONE**. No service, marker, symlink, approval store, database, exchange account, CI workflow, main branch or deployment was touched.

## Previous failure and corrected byte source

The prior Windows-generated `git archive` had `CRLF` instead of the approved `LF` bytes. For example, its extracted receiver had 8,752 bytes and 151 `CR`/151 `LF`; the exact Git blob has 8,601 bytes and zero `CR`/151 `LF`. Global Git `core.autocrlf=true` was observed. The old archive SHA-256 `ccc165b6af37eba65272ce98e966609b655f794d482bf393d2e7e4389a408c3a` does not identify the new package and must not be installed. The hash guard correctly stopped the prior attempt before any live cutover.

The new offline self-test `scripts/production-deploy-guard-package-selftest.mjs` uses Node `execFileSync('git', ['cat-file', 'blob', '<commit>:<path>'], { encoding: null })`. It handles the returned `Buffer` directly—no Windows checkout, text pipeline, editor or character decoding. It builds a deterministic **uncompressed ustar** in memory from those buffers with fixed root ownership metadata, zero mtime and explicit `0644`/`0755` mode fields. This package is not a Git archive and is not an application release artifact.

| File | Git blob SHA-256 = packaged SHA-256 = extracted SHA-256 | Bytes | CR | LF | BOM | Archive mode |
| --- | --- | ---: | ---: | ---: | --- | --- |
| `ops/signalverse-deploy-receiver.mjs` | `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa` | 8,601 | 0 | 151 | none | `0644` |
| `ops/signalverse-release-authorization.mjs` | `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83` | 7,324 | 0 | 136 | none | `0644` |
| `ops/signalverse-deploy` | `572651086ee6e622cc858bb1be4db3954115fa09d2ea46e122fc8f9c1b499dec` | 9,973 | 0 | 172 | none | `0755` |
| `ops/signalverse-deploy-receiver.service` | `7a3d5bdd90472e989578dfdc0747954b4f6847c47a9be07ab8f54459450188b1` | 889 | 0 | 33 | none | `0644` |

Archive: `tmp/guard-package-677bc19/guard-677bc19-lf.tar`, **30,720 bytes**, SHA-256 `5a491d635c1018ef86f360a3ce2cfbb0c0444b8aa674dff48bc07f79a4fde352`. The archived entry list contains exactly the four paths above in that order; no symlink, device, directory entry, credential or extra file is included. The archive's executable mode for the coordinator was confirmed from GNU tar's verbose listing; **actual mode after Linux extraction remains untested**.

## Reproducibility and checks actually run

Environment: Windows `win32/x64`, Node `v24.19.0`, Git for Windows `2.55.0.windows.5`, GNU tar `1.35` from Git for Windows, and Git Bash for `bash -n`. WSL reported no installed Linux distribution; Docker, Podman and `systemd-analyze` were unavailable. The self-test invocation was:

```bash
node scripts/production-deploy-guard-package-selftest.mjs
```

It was run **twice**. Each invocation created two fresh temporary directories, built two archives from independently reread Git blobs, extracted each archive with GNU tar, verified exact four hashes/sizes/CR/LF/BOM values and `Buffer.equals` against each Git blob, checked the exact entry list and tar mode strings, ran Node `--check` for both `.mjs` files, and ran Git Bash `bash -n` for the coordinator. The four clean archive builds were byte-identical; the final archive SHA-256 was independently checked by PowerShell and listed by Windows BSD tar. The first harness invocation before this result failed only because GNU tar interpreted an absolute `C:` path as a remote archive; the harness was corrected to pass a relative archive path. That failed harness invocation did not change any candidate bytes or VPS state.

**Local results:** source hashes PASS; packaged/extracted hashes PASS; binary equality PASS; zero CR/BOM PASS; expected LF counts PASS; archive entry list PASS; archive metadata mode PASS; Node syntax PASS; Bash syntax PASS; two independent self-test invocations and four clean builds identical PASS. **Linux filesystem extraction/actual executable mode: NOT TESTED. `systemd-analyze verify`: NOT TESTED.** Therefore the required all-gates status is PACKAGE-BLOCKED despite a locally byte-exact artifact. No live DENY request was sent.

The exact local extraction command used by the self-test was GNU tar with a relative archive filename and a fresh directory:

```bash
tar -xf guard-677bc19-lf.tar -C extracted
```

## Remaining gate and next safe installation sequence

First, use an **isolated Linux environment that is not the Production VPS** to copy this exact archive, extract it into a newly created disposable Linux filesystem, recompute and binary-compare all four Git blobs, prove zero CR/BOM and correct LF counts, run `/usr/bin/node --check` on both `.mjs` files, `bash -n` and executable-mode check on the coordinator, and `systemd-analyze verify` on the extracted unit. Rebuild twice there or verify this archive against two clean runs; record the Linux environment, commands, hashes, modes and exit codes. A failed Linux check is PACKAGE-BLOCKED, not a reason to loosen hashes or normalize bytes. The old Windows `git archive` and its installer script must not be reused: they reference different archive bytes and format.

Only after **all** package gates pass, a separate future installation attempt must follow this order, with fresh owner approval specifically for that attempt:

1. Acquire the global deploy lock and check no in-flight or queued deploy artifact; record active marker, both links, main/admin/observer PID/start/restart values and expected runtime SHA.
2. Stop and disable the **old push receiver only**; verify it is fully inactive. Hold the lock and recheck all runtime and queued-unit evidence; abort on any mismatch.
3. Back up existing control-plane files; install only the verified LF guard files and provision root:root `0700` `approvals`, `revoked`, `claims`, `consumed` directories, with no approval records.
4. Verify installed hashes, owners, modes, syntax, systemd sandbox and exact receiver writable paths before starting the new receiver. Never restart main/admin/observer or alter application links/marker.
5. Start only the new receiver; run **only** a no-authorization DENY test. Require HTTP `401`/rejection, helper `AUTHORIZATION_MISSING`, zero artifact acceptance/unit activation, unchanged marker/links and zero main/admin/observer restarts.
6. Independently verify active runtime SHA still exactly `85aedfb944a67c94227ac343e911bc64a581e79e`. If any check fails, stop immediately. Do not automatically re-enable the old push receiver; any control-plane-only rollback restores verified backups under the lock while keeping the old receiver disabled.

No branch merge, push to application `main`, Production CI trigger, production deployment or VPS installation is authorized by this report. The GitHub Environment reviewer configuration and separate workflow merge remain later gates.

**PACKAGE-BLOCKED**
