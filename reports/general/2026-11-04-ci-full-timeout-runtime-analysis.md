# SignalVerse — actual full-CI timeout and runtime investigation

Recorded 2026-11-04T12:54:38.030950+00:00. This is a failure checkpoint, not release acceptance or a completion report. The owner authorized preserving all tests and gates and continuing this chart/CI work through the normal guarded deployment.

[Official main/push CI 41808165473](https://github.com/signal0verse/signalverse-main/actions/runs/41808165473), attempt 1, exact source `9e5ca3caf0b2b683676b50b73bb3ca21a6063267`, was **cancelled at the unchanged 180-minute limit**. All 94 actual steps are present: 80 success, 1 cancelled, 12 skipped and 1 failure. The final always-running required-gate audit correctly failed after cancellation; it did not accept incomplete execution.

## Actual completed evidence

- All 52 CI selftests, all 557 retained scanner/navigation cases, and all 1295 cases in the original Spot display/history group passed, with no failures, cancellations or skips in those completed groups. The three formerly failing original assertions and all 18 chart-completion proofs passed in that full original group. These results do not authorize release by themselves.
- All four individual original frontend/API compiler comparisons actually ran on this exact Linux CI source and reported `introduced=[]`. Existing baseline diagnostics remain; no globally clean TypeScript claim.
- The isolated copy-trading and Profit Protection test steps completed successfully. No private account/provider or production runtime was used as a test fixture.
- The prediction-market step was cancelled. Later disposable SQL groups, final web/API builds and artifact checks did not run. Their absence remains a release blocker; no local or previous-run result substitutes for these gates.
- The original isolated runner retained 2 CPU, 4 GiB, no host mounts/ports, host-root mapping isolation, and private/production egress blocks. Its own container and GitHub runner registration are independently verified absent. Main remains the exact SHA above. No duplicate CI/rerun/source push/runner was created during this investigation.

## Runtime finding and next work

Authoritative per-step logs show repeated historical source-validation work dominates the full run. The 1295-case Spot display/history group took 1857 seconds; copy-trading 861 seconds; Profit Protection 634 seconds. Some unchanged negative source tests take several minutes while validating altered supplied bytes. This identifies the area to measure; it is not yet a proven performance fix.

A private read-only diagnostic compares actual source-projection results and complete source-witness counts using the existing synchronous checked-operation boundary. It does not replace any test, cache a passing result, mutate source or provide acceptance. No production, cache/witness implementation, workflow, assertion or expected result has been changed in this investigation. Any resulting narrow repair still requires fresh frozen-source regression checks and full official exact-main/push CI.

The exact original producer capacity on the unchanged source remains 8,388,221 <= 8,388,608 bytes (387 bytes headroom), with all 2740 tracked paths retained and no exclusions. Diagnostic bytes were discarded; no official retained artifact, Guard authorization, release or deployment exists for this source. Capacity must be rechecked for any successor. No cap, timeout, CPU/memory allowance, packaging rule or safety gate is relaxed.

## Deployment status and boundaries

Production remains last verified at c161955239f24f151fed6a2a08dfcb8bef0e04ac. This checkpoint performs no new production inspection or activation. The earlier fresh backup/cold-restore and exact-target readiness receipts remain historical proofs; fresh full readiness and backup age/checksum/schema verification are still mandatory before any future Guard. No backup was duplicated.

Deployment remains pending complete official CI, exact retained-byte/full-tree/provenance verification, fresh readiness, one independent exact-SHA/digest Guard, normal official release, complete post-verification, two stable process observations and owned-runner cleanup. No failed/expired approval is renewed and no gate is bypassed.

No migrations, production DDL/DML, scanner/profile/strategy/risk/job or PP-flag change, worker start/enable, private exchange call, or order/position/Entry/SL/TP/close action was performed. The existing TRUE/TRUE PP flags are not changed and the canonical worker is not started. No private-account execution or profitability is claimed. Work remains in progress.
