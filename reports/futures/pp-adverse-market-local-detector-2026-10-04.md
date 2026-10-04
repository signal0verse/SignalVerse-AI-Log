# Futures adverse-market profit exit — local detector, live automation blocked

## Metadata

- Date: 2026-10-04; evidence/report assembly at 08:45 UTC.
- Task: owner's request for automatic profit protection before TP when trend,
  momentum and market conditions reverse.
- Module: standard Futures; isolated Binance USDT-perpetual proposal experiment.
- Mode: local implementation and offline validation only.
- Repository: SignalVerse-Main.
- Branch: codex/pp-adverse-trend-proposal-20261004.
- Starting/ending application commit: fca794122a7f235e0a774dbbbb0c6241ce4e10a3.
- Source changes remain uncommitted in the isolated checkout.
- No Production state read or changed in this phase.

## Executive result

LOCAL_DETECTOR=IMPLEMENTED
DEDICATED_OFFLINE_TESTS=71/71_PASS
EXISTING_REGRESSION=142/143_PASS_1_SCOPE_FAIL
LIVE_AUTOMATIC_PROFIT_PROTECTION=NOT_READY
PROFITABILITY_OR_IMPROVEMENT_PROVEN=NO
PRODUCTION_ACTIVATION=NO

Entry evidence can inform an exit hypothesis; successful entry screening does not
prove profitable exits. The requested full automatic live system is NOT completed.
This phase implements only a bounded detector which emits an EXIT_PROPOSAL and
always returns executionAuthorized=false. No proposal can reach a Close executor.

## Scope and actions

1. Read repository instructions, current handoffs, the complete strategy history,
   safe-test runbook, existing PP policy/identity/execution paths and prior relevant
   evidence. Did not restart the broad architecture audit.
2. Read authenticated remote main: fca794122a7f235e0a774dbbbb0c6241ce4e10a3.
3. Preserved the dirty primary checkout and concurrent work. Created a fresh
   isolated worktree from that exact main under
   tmp/pp-adverse-trend-proposal-20261004.
4. Added a pure actual-source detector and synthetic tests. Existing Engine,
   Scanner, PP policy, worker, monitor, execution, UI and DB remain untouched.
5. Ran dedicated tests, existing regressions, strict focused TypeScript and
   Web/Admin builds. Recorded the release-scope failure, without weakening it.
6. Added isolated handoff, research strategy-history entry and detailed contract.
   Publishing this sanitized report is separate from publishing application code.

## Files inspected

Relevant actual sources and evidence:

- AGENTS.md; CLAUDE.md; HANDOFF.md; TRADING_STRATEGY.md; docs/AI_HANDOFF.md;
  docs/COLLEAGUE_HANDOFF_2026-09-29.md; docs/testing/stability-test-runbook.md.
- api/_shared/futures-profit-protection.ts;
  futures-profit-protection-lifecycle.ts; futures-profit-protection-execution.ts;
  futures-economics.ts; futures-indicators.ts; futures-decision-engine.ts;
  futures-market-discovery.ts; futures-risk.ts.
- api/copytrade.ts; server/futures-profit-protection/worker.mjs;
  server/partner-copytrade/service.ts; src/app/App.tsx.
- scripts/futures-profit-protection-test.mjs;
  scripts/futures-shared-engine-test.mjs;
  scripts/futures-market-discovery-test.mjs;
  scripts/lib/futures-reentry-release-parity.mjs.
- package.json; package-lock.json; vite.config.ts; vite.admin.config.ts.
- Prior adverse-trend contract, real manual-close/reentry evidence, negative
  scanner-evidence exit POC and account-control safety report. No private account
  data is reproduced here.

## Exact files changed in isolated application checkout

1. api/_shared/futures-profit-protection-adverse-market.ts — NEW pure detector.
2. scripts/futures-profit-protection-adverse-market-test.mjs — NEW offline tests.
3. docs/futures-profit-protection-adverse-market-proposal.md — NEW hypothesis,
   exact evidence contract and limitations.
4. HANDOFF.md — additive local-only work/test/blocker entry.
5. TRADING_STRATEGY.md — additive unvalidated research history, no live rule change.
6. reports/futures/pp-adverse-market-local-detector-2026-10-04.md — this report.

No existing executable file was edited. The new API shared module is unwired;
this is not a claim that no source was added. No UI or floating-help behavior
changed. All primary-checkout changes belonging to other work remain preserved.

## Implementation

Exports: createAdverseMarketState, restartAdverseMarketState,
evaluateAdverseMarket, ADVERSE_MARKET_EXPERIMENT.

- Reuse unchanged futuresProComputeIndicators, shadowTrend, shadowMomentum;
  fullPositionExecutablePrice and existing economics functions.
- Match accepted position identity and account reference. Require fresh OPEN
  evidence; uncertain/pending exits deny, FLAT retires local state. Binance
  USDT-perpetual only; unsupported venues deny.
- Require 220–300 consecutive fully closed native one-minute candles; latest
  raw native close is exactly the current minute boundary minus 1 ms. Forming
  and future-received candles never enter indicators.
- Require adverse trend OR actual confirmed swing break, adverse momentum vote,
  adverse movement over 12-second and recent four-second native trade windows,
  recent adverse taker flow >=65%, and notional-rate acceleration >=1.25.
- Require a fresh full-position executable book with <=10 bps spread and known
  costs. Compute net estimate after entry/exit fees, funding and reserve; require
  >=0.25 original R. Do not substitute last/mark price for executable depth.
- Preserve original Entry, SL and ONE TP. At/beyond TP does not propose a new exit.
- Use existing PP bounds: <=3 s evidence age, >=1 s spacing, <=6 s observation
  gap, three observations spanning >=4 s. Restart/reconnect/gap clears debounce.
- Require advancing native timestamps/IDs, unchanged overlapping trades and
  conservative consecutive trade IDs. Missing/gapped/uncertain evidence denies.
- One proposal latch per research position state, retained by the pure restart
  helper. No timer, network, credentials, DB, durable intent or Close capability.

The flow/spread/time windows are frozen research hypotheses, not validated live
risk settings. One-minute context is not a verbatim reuse of the full multi-
timeframe entry/scanner strategy. Four-second debounce is NOT a four-second
end-to-end reversal-detection or fill guarantee.

## Native data semantics and proof boundary

Current official [Binance USD-M market-data documentation](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data)
was consulted for native Kline close time, aggregate trade ID/time/price/quantity/
buyer-is-maker and book fields. No actual exchange API call occurred.

Exact trade IDs are strings. Consecutive-ID validation is a conservative research
input rule, not a claim that Binance guarantees complete delivered streams.
The caller's continuity=COMPLETE and accountRef fields are assertions to be proven
by future collection/authenticated binding, not proof themselves.

Local A/B identity tests and restart latches do NOT prove native lifecycle fencing
or durable exactly-once execution. A local mutex and the now-deployed profitable
manual-close reentry gate cannot make an old native Close safe after A→FLAT→B
caused by another writer. That execution problem remains a live-release blocker.

## Tests executed

Runtime: Node v22.23.3. Existing dependency lock is unchanged, SHA-256:
fe938f4bc16dfbf034f15ad3ed3dda69fd2556889938536a82fbfa6d5eca6858.
No dependency installation or production environment loading was needed.

### Dedicated actual-module suite

Command:
```text
node --test --test-reporter=spec scripts/futures-profit-protection-adverse-market-test.mjs
```

71 tests PASS, zero failed/skipped/cancelled.

Covers mirrored Long/Short proposal behavior; unchanged Engine function reuse;
temporary recovery/reset; insufficient flow; full-size execution price versus
misleading profitable last price; TP precedence; malformed/stale/gapped evidence;
cost completeness; identity/account mismatch; replaced position; repeated native
IDs/timestamps; restart/reconnect; retired FLAT; proposal replay; future-data
prefix invariance; no mutation and no network; unchanged existing runtime sources.

These are synthetic behavior tests, not measured trading outcomes. The checkpoint
test serializes local state; it is not a durable production restart experiment.

Initial harness runs exposed three issues: a crossed synthetic Short book, a
too-small git-show output buffer and an incorrect Partner file path. Fixtures/
test plumbing were corrected, not policy assertions relaxed; final runs pass.

### Existing compatibility suites

Command:
```text
node --test --test-concurrency=1 --test-reporter=spec scripts/futures-profit-protection-test.mjs scripts/futures-shared-engine-test.mjs scripts/futures-market-discovery-test.mjs
```

143 tests total: 142 PASS, 1 FAIL; zero skipped/cancelled.

Exact failed test:
```text
scripts/futures-profit-protection-test.mjs:301
legacy parity permits only the exact approved PP delta and rejects unrelated Spot edits

AssertionError: Exact reentry inventory; missing/unexpected file
scripts/lib/futures-reentry-release-parity.mjs:89
```

The frozen fca reentry release inventory includes untracked paths and exact
reviewed bytes. New research files/additive documentation are not in that
inventory. This is an unresolved candidate scope failure, NOT an inherited
baseline failure. No parity helper, allowlist, expected hash or test was changed.
Passing pure tests must not be represented as passing the release gate.

### TypeScript and whitespace

Focused strict diagnostic command:
```text
node ../../node_modules/typescript/lib/tsc.js --noEmit --target ES2022 --module ESNext --moduleResolution bundler --allowImportingTsExtensions --strict --skipLibCheck api/_shared/futures-profit-protection-adverse-market.ts
git diff --check
```

Focused TypeScript PASS with zero diagnostics. This includes the imported pure
dependencies, not a claim of zero diagnostics across the entire repository.
Tracked diff whitespace check PASS; new text files checked for trailing whitespace.

## Build result

```text
node ../../node_modules/vite/bin/vite.js build --mode pp-offline-validation
node ../../node_modules/vite/bin/vite.js build --config vite.admin.config.ts --mode pp-offline-validation
```

Web PASS (2,036 modules); Admin PASS (1,713 modules). Existing Web chunk-size
warning remains. An initial attempt with --configLoader runner failed because
the existing configuration uses __dirname; normal bundled-loader commands above
passed without editing configuration. Build outputs are ignored, not published.

## What is not proven

- Reliable distinction between ordinary pullbacks and durable reversals in real
  unseen market data; profitability or sustained improvement.
- Live timestamped depth/tape collection, fresh real costs, native account binding,
  sequence gap recovery or operational latency.
- Durable cross-path single executor and protection against stale native Close.
- Release-scope acceptance or exact-SHA CI for these uncommitted changes.

The previous exposed five-minute proxy replay remains negative: seven hypothetical
exits, three better/four worse, one avoided later SL, four sacrificed TP outcomes,
paired endpoint net delta -0.677154 USDT. It lacked the required seconds-scale
receipt/depth tape and untouched holdout. It was not retuned or relabeled here.

No strategy can guarantee that a sudden reversal/gap still permits a profitable
fill. The detector checks an observed executable estimate, not a future guarantee.

## Git / publication state

Application HEAD unchanged, no application commit, push, CI or release.
Only this sanitized report is authorized for AI-Log master publication; its remote
commit and byte verification are returned separately after publication.

The last previous production report recorded fca794... and an inactive disabled
canonical worker. This phase did NOT recheck Production. REAL_PP/DEMO_PP flags
were not read or changed; do not infer OFF from an inactive worker.

## Recommended next step / hard stop

Obtain a separately scoped read-only causal market-data capture and freeze an
untouched evaluation set. Evaluate this exact hypothesis against existing exits,
including sacrificed TP, false exit/missed reversal, costs and latency. Resolve
shared durable execution authority/native lifecycle safety before executor wiring.
Review a narrow successor scope contract rather than weakening the old one.

Do not activate the worker or attach this detector to an exchange Close now.
Fully automatic production protection remains BLOCKED/NOT_PROVEN.

## Safety record for this phase

```text
EXISTING_ENGINE_OR_SCANNER_CHANGED=NO
EXISTING_PP_POLICY_OR_EXECUTOR_CHANGED=NO
UI_CHANGED=NO
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI=NOT_STARTED
VPS_ACCESS=NO
DEPLOYMENT=NO
WORKER_STARTED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
DATABASE_MUTATION=NO
EXCHANGE_CALLS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_CHANGES=0
TP_CHANGES=0
CLOSE_ACTIONS=0
```

## Local source hashes (raw file SHA-256)

- api/_shared/futures-profit-protection-adverse-market.ts:
  6a734aa245b9042ce052837501eb2539e186ab8b443ca021b14b0b2c13c7fe5a
- scripts/futures-profit-protection-adverse-market-test.mjs:
  c61cc54e30417a63a2dfec96a104595891c1495d0794652cba5c93e2ed72d6dd
