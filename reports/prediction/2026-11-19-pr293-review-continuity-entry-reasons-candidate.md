# Prediction paired review and entry explanation candidate — 2026-11-19

The fix is ready for exact-source review in [PR 293](https://github.com/signal0verse/signalverse-main/pull/293). Candidate SHA bcca682604eb3874fd4cb884703e3d000cdc5713. Active production and main remained 58edc149eea3eba4264a7c4e29fabad5a1fb375b. This task delivered source before deployment.

## Incident and repair

The read-only [opportunity audit](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/prediction/2026-11-19-pr292-missed-opportunity-entry-audit.md) matched seven pairs with identical market priors. The previous code independently called the free reviewer in Shadow and Demo entry. The recorded used_ai_recheck flag showed selection for review. Only Shadow received admissible AI evidence for those pairs. Historical provider-level failure details are absent, so there is no evidence to assign a specific outage or rate limit.

The next Demo scan can consume the immediately preceding successful Shadow scan's valid review once. The handoff is in memory, scoped to identical market/question/reviewer inputs, and expires before 90 seconds. Missing or invalid prior responses, changed inputs, expiry or a process restart use the normal fresh review. Evidence and ambiguity status travel together. Both price evidence and books are fetched for the new scan. H1–H8, the same funnel, tradeability, fresh market revalidation, Kelly, account eligibility, duplicate checks and fee-inclusive admission remain required. The recorded result cannot create a trade directly or satisfy H8 across separate evaluation intervals.

The decision table shows Shadow or Demo, AI response status, and the actual recorded blocker or the caller's own entry outcome. Historical rows use their stored tradeability reasons or state that the outcome was not recorded. Per-account results are keyed in the internally stored run receipt and projected to the verified session. The shared status response drops the receipt. Anonymous and authenticated database roles cannot read the runs table directly. No new data column or migration was added.

## Evidence

- Exact-source [Production CI](https://github.com/signal0verse/signalverse-main/actions/runs/44546302609) passed all 94 steps, including the isolated Prediction gate, its executed disposable PostgreSQL child, compiler comparisons and builds. GitHub's test merge tree equals the candidate tree.
- Local handler/UI/lifecycle run passed 55 cases with zero skips. New checks cover provider response reuse with H8 still rejecting, age/identity/one-use limits, distinct owner admission reasons and removal from shared status, and Persian/English rendering. Web and admin builds passed. A separate isolated probe recorded an invalid AI probability and confirmed that a reused valid review still failed when the fresh book became too thin. The deployed runtime loader caches its API handlers in-process.
- The exact source bundle verified all 2,762 Git files and modes. It is 8,388,603 bytes, five bytes below the unchanged 8 MiB limit, with SHA-256 e4f4e155ce598694ee87011eedfe50cee8241d3394aca5df93aef9cea350ca2a. This is local package evidence; the official retained artifact still belongs to the separately controlled release step.
- One early candidate exceeded the cap. Shorter explanatory text and shared labels brought the bundle within the existing cap. A historical source assertion was updated to recognize the new reason write and still require the revalidation rejection and continue. The superseded PR CI was cancelled by the new SHA. No test, gate or package limit was loosened.
- Exact declarations and admission predicates were compared with production. Scheduler, release, CI, migration, strategy, other module and existing execution controls are unchanged.

## Operating boundary

Production stayed on the previous healthy release. Prediction Real Trading and autonomous learning were independently confirmed OFF in a read-only check. No production writes, forced ticks, new position, order, wallet action, gate change, merge or deployment occurred. Phase 9A statistical validation remains incomplete.
