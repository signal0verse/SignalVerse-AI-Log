# SignalVerse modular CI recommendation — 2026-11-03

Status: DESIGN RECOMMENDATION ONLY; no implementation or gate modification.

## Owner request
Explain how module changes can be validated faster without unnecessarily rerunning independent domains.

## Current verified evidence
- Inspected .github/workflows/production-ci.yml at eacedbb2801c303482b201320968983fce9d93bf.
- One build job runs domain tests sequentially, including Analysis, Spot, Futures, stablecoin, Prediction Market, Whale, admin and disposable SQL tests.
- There is no changed-path/dependency selection for these steps.
- Original job timeout remains 180 minutes. No workflow, gate, resource, or timeout setting was changed for this recommendation.
- This test grouping alone does not prove all product engines are functionally dependent on each other.
- The ongoing chart release remains subject to its original full exact-SHA gates; a cancelled partial run is not acceptance.

## Proposed incremental approach
1. Inventory existing module boundaries and direct/transitive imports, shared API helpers, SQL/RPC dependencies, dynamic consumers, shared UI and lockfiles. Do not treat filename filters alone as dependency proof.
2. Keep the existing repository, define per-module test groups and a small always-required common safety/integration layer. Each group retains its existing assertions.
3. Add conservative change selection. A known module-local change selects its own tests plus all dependent consumers; common, unknown, or ambiguous changes select the full suite. Verify routing with explicit positive and negative cases.
4. Run genuinely independent groups in isolated jobs with separate disposable databases and bounded total resources. Parallelism on the same two CPUs is not a guaranteed speedup.
5. Measure and remove repeated build/compiler setup where evidence permits. Any cache must bind exact inputs, toolchain and lockfiles, preserve corruption checks, and never substitute another commit's acceptance.
6. Compare proposed selection against the unchanged full pipeline in a shadow-validation phase across representative changes before altering required gates. Retain scheduled full integration runs and an explicit full-run fallback.
7. Consider independent build/release units only after their API/schema compatibility and runtime ownership are proven. Keep exact-SHA CI, immutable artifact, byte digest and Guard release guarantees.

## Expected benefit and limits
A UI-only chart change could validate its UI and proven consumers without all unrelated domain tests once the routing contract is validated. No runtime or profitability guarantee, time estimate, or completed modularization is claimed. This task's chart changes also include read-only Analysis API metadata, so their applicable scope cannot be inferred from UI filenames alone.

## Safety/publication state
- Application source changes for this recommendation: NONE.
- CI/workflow/gate changes: NONE.
- New application commit/push: NONE.
- Production/database/service/worker/flag changes: NONE.
- Exchange/order/position/SL/TP/close actions: 0.
- Only this sanitized design note is authorized for AI-Log publication by the repository contributor instructions.
