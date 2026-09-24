# VPS Guard receiver readiness test sequencing — offline fix, 2026-09-24 UTC

**RECEIVER-READINESS-TEST-FIXED — LOCAL ONLY.** No VPS action occurred in this task. No SSH, upload, installation, service start/stop, live DENY, application deploy, GitHub workflow dispatch, `main` merge/push, database, exchange, credential or real-approval operation occurred. The previous VPS Guard remains installed-but-disabled and its live HTTP `401`/helper `AUTHORIZATION_MISSING` behavior remains **unproven**. The last prior read-only VPS observation was at `2026-09-24T14:50:08Z`, with active application SHA `85aedfb944a67c94227ac343e911bc64a581e79e`; this task deliberately did **not** re-read the VPS.

The local implementation/test/report was committed only on branch `codex/production-deploy-control-20260924` as `acc9ea107a14d3d336d38bc37ed1efb1d8c1166d`. This is not an application `main` merge, push or Production delivery.

## Confirmed previous test failure and exact changed point

The failed cutover harness was the local `tmp/sv-guard-retry-install-677bc19.sh`, staged as `/var/tmp/sv-guard-retry-install-677bc19.sh` in the prior task. It performed `systemctl start "$receiver"`, checked `ActiveState=active`/PID, and immediately issued `curl` to `127.0.0.1:3002` with synthetic SHA `ffffffffffffffffffffffffffffffffffffffff` and `Authorization: Bearer invalid`. `Type=simple` reports a started process before its TCP `listen` callback. The receiver was intentionally stopped only ~152 ms after systemd's `Started` record; there was no `READY` event and `curl` returned exit 7, not an HTTP status. **The confirmed cause of that test failure is its premature readiness assumption.** This does not prove that the live receiver can eventually bind or return HTTP `401`; no new live test was authorized.

The previously untracked harness is now preserved as a reviewed, **not deployed** branch file `ops/signalverse-guard-install-retry.sh`. Its installation, hash, owner/mode, runtime-invariant, invalid-bearer and fail-closed steps were retained. The only functional sequencing addition is between receiver start and the existing `curl`:

1. Record startup time and require the sibling readiness helper to be readable before starting.
2. After `systemctl start` and the existing active/PID checks, run `ops/signalverse-guard-receiver-readiness.mjs` against **only** `127.0.0.1:3002`, with a maximum **10,000 ms** and **200 ms** poll interval. It opens and closes a TCP socket without sending HTTP or a token. It uses monotonic elapsed time and caps each connection attempt at 250 ms; it emits `RECEIVER_READY` with the exact UTC `readyAt` timestamp only after a real connection succeeds.
3. Only after `RECEIVER_READY` does the original invalid-bearer `curl` execute. The synthetic SHA, bearer, required HTTP `401`, rejection body, no-artifact checks, marker/link/PID checks, and helper `AUTHORIZATION_MISSING` expectation are unchanged.
4. On timeout, the helper emits `RECEIVER_NOT_READY` and nonzero exit. **Before any DENY request**, the harness records `systemctl status`, selected `systemctl show`, startup-window journal and `ss` listener state, then invokes its existing failure handler to stop/disable the new receiver. The old push receiver is never re-enabled automatically. Timeout is not labeled a false DENY rejection.

The helper is an **installation-test utility**, not receiver/application/coordinator authorization logic. The four deployed control-plane source files (`ops/signalverse-deploy-receiver.mjs`, `ops/signalverse-release-authorization.mjs`, `ops/signalverse-deploy`, `ops/signalverse-deploy-receiver.service`) and Production workflow/sandbox policy were not edited. The future harness must be staged with its sibling helper under a **separate fresh owner authorization**; this commit is not permission to run it.

## Changed files and local evidence

| File | Change |
| --- | --- |
| `ops/signalverse-guard-install-retry.sh` | Tracked copy of the prior one-off installer harness with explicit bounded readiness gate, timestamp and timeout diagnostics before `curl`; no live execution. |
| `ops/signalverse-guard-receiver-readiness.mjs` | Loopback-only monotonic TCP readiness checker; max timeout 10 s, default interval 200 ms; emits exact `RECEIVER_READY` or explicit `RECEIVER_NOT_READY`. |
| `scripts/guard-receiver-readiness-test.mjs` | Offline regression: static start→wait→DENY ordering and timeout diagnostics; delayed loopback listener; no premature HTTP; timeout status; local synthetic HTTP `401` after readiness; non-loopback/overlong settings rejected. |
| `reports/futures/production-deploy-control-receiver-readiness-fix-2026-09-24.md`, `HANDOFF.md` | Dated evidence and coordination only. |

Local Windows Node `v24.19.0` checks: `node --check` on helper and new test **PASS**; Git Bash `bash -n` on tracked harness **PASS**; `git diff --check` **PASS**. Targeted offline suites `node --test scripts/deploy-control-test.mjs scripts/guard-receiver-readiness-test.mjs` gave **18/18 PASS**, including the four new readiness cases. Existing release-control/OIDC/approval semantics tests passed unchanged. A first new-test run failed because it measured the helper's own elapsed time from process startup while the test's 180 ms delay began before the child emitted its waiting event; the test was made deterministic by waiting for `RECEIVER_WAITING`, then rerun successfully. No production credential or endpoint is loaded by these tests; the dynamic tests use only disposable local loopback ports. `shellcheck` was not installed, so no shellcheck result is claimed.

## Remaining release gates

This is **not** a live receiver fix or proof of successful `401`. The installed VPS receiver remains disabled from the prior failed cutover; the old push receiver remains disabled. A future owner-approved supervised run must separately stage and hash the revised harness/helper, maintain the global deploy lock and runtime checks, prove receiver readiness within 10 seconds, then run **only** the invalid-bearer DENY and helper `AUTHORIZATION_MISSING` checks. It must leave Production SHA `85aedfb944a67c94227ac343e911bc64a581e79e` and main/admin/observer processes untouched, and fail closed on timeout or any unexpected result. The GitHub Environment reviewer configuration and later workflow merge remain separate gates. No real approval or valid release should be manufactured.

**RECEIVER-READINESS-TEST-FIXED**
