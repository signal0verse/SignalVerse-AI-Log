# Historical CI reader and archive capacity — verified checkpoint

Recorded: 2026-11-03T16:36:13.929574+00:00. This is an in-progress checkpoint, not full CI acceptance.

Owner scope: fix the historical test and source archive capacity without removing
tests or weakening gates; rerun official CI. No deployment.

Candidate: `a31d803d4396c31cf0d2c693e2a098114056db5d` on `codex/ci-module-routing-20261103`. Normal candidate-only push succeeded.
Main before/after: `eacedbb2801c303482b201320968983fce9d93bf` / `eacedbb2801c303482b201320968983fce9d93bf`.
Five normal successor commits preserve all program source in Git; no history rewrite.

The old immutable Linux test program and every assertion remain intact. Only its
production-ci source read crosses the complete exact-current CI delta proof.
Unknown bytes fail closed. The original Linux platform guard is retained.

Eleven CI/test programs use the repository's lossless immutable-Git source pattern:
fixed commit and full raw SHA256, canonical loaders, AST-only module-URL transport,
and fresh execution against current source on every run. Routing inspects expanded
original code; current source witnesses still pin actual loader/data bytes.
No test result is loaded from storage. Cache/witness implementations, all original
command groups/assertions, workflow418, compiler/build/SQL checks and final audit
remain unchanged. Original runner limits2CPU/4GiB/180minutes are preserved.

Fresh frozen-source local validation:77/77 tests passed,0 failed/cancelled/skipped;
seven committed CLI synthetic cases passed. Web/Admin and all14 API bundles passed
on localNode24. A pre-freeze proof rejected a concurrent local edit; stable final
reruns passed without weakening any check. Local results are not Node22/Linux CI.

Exact original packageCommit capacity: **8,385,561 <= 8,388,608 bytes**,
headroom3,047 bytes, embedded commit matches. All2740 tracked
files are archived; excluded paths=[]; no export-ignore/packaging/cap change.
These in-memory diagnostic bytes were discarded. No official artifact was created.

[Official Production CI run41673654138](https://github.com/signal0verse/signalverse-main/actions/runs/41673654138)
uses exact candidate SHA, workflow_dispatch, attempt1. Both CI selftests and the
retained historical scanner/navigation gate are now **success** on isolated Linux.
The previously failed historical gate has therefore passed this official run.
The complete CI is still IN_PROGRESS: {'success': 10, 'null': 83}. Four compiler comparisons
and all remaining gates must still be independently verified before full PASS.
This branch dispatch is not main/push release acceptance.

Product/backend/worker/Strategy/Scanner/SQL/release-artifact protected paths have
zero task-created diff. No main promotion, Production query/mutation, migration,
backup, worker start/enable, PP flag change, exchange/order/position/SL/TP/close action,
official artifact/Guard/release/deployment occurred. Prior runtime evidence is not
presented as a fresh Production query.

The existing one-job runner214/ci-a511236 and read-only watcher continue. The
owner-authorized same-chat follow-up will independently verify final job/step logs,
all44 CI selftests, original557 cases, four compiler comparisons,18 chart proofs,
full final audit and own runner/container cleanup, then publish the final report.
No duplicate runner/run/dispatch or further source push is authorized.
