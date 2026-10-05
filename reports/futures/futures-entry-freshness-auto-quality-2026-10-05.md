# Futures entry freshness and AUTO candidate quality — local implementation

## Metadata

- Date: 2026-10-05.
- Task: investigate recurring SKY-style entry issues over the preceding 24 hours; repair new-entry admission and tighten AUTO discovery quality.
- Repository: SignalVerse; isolated branch `codex/futures-entry-freshness-20261005`.
- Starting commit: `3e92cab7a36cc0021847b1f700b9b5a394c75b37`.
- Local implementation commit: `a4ba3246672c3db35b61f56ed5600ba20fb9a0f1`.
- Mode: bounded read-only Production evidence collection, then isolated local implementation/offline validation. No application push or deployment.
- Frozen evidence window: `[2026-10-04T08:55:41Z, 2026-10-05T08:55:41Z)`; end-exclusive.
- Evidence collection: `2026-10-05T08:57:20.763773Z`.
- Runtime marker at collection: `3e92cab7a36cc0021847b1f700b9b5a394c75b37`. This is a timestamped observation, not a claim about all subsequent runtime activity.
- Last remote-main recheck during this task: `3e92cab7a36cc0021847b1f700b9b5a394c75b37`.

## Objective and scope

The owner authorized repairs after the SKY entry audit and requested stricter automatic candidate selection. The implementation is limited to standard Real Futures new-entry freshness and AUTO candidate admission/maintenance. It does not redesign the Decision Engine, V3 scoring, risk sizing, SL/ONE TP, exchange adapters, open-position management, Partner, Spot, Prediction Market, Whale or Fast Trader.

No account identifiers, credentials, private row IDs, quantities, balances, margins, raw account records or database exports are included here. Raw evidence is not committed. The primary dirty checkout and unrelated work were preserved.

## Actions taken / evidence sources

1. Read project contributor, strategy, current handoff and safe-test instructions.
2. Compared persisted Real trade entry timestamps with associated engine-decision/native-input provenance and discovery setup lifecycle records. Used a bounded `REPEATABLE READ`, `READ ONLY` database transaction with 10-second statement and 2-second lock limits; transaction ended with rollback. No exchange request was required.
3. Inspected the standard entry path in `api/analyze.ts`, `api/copytrade.ts`, discovery/market-data helpers, durable execution journal and historical scope contracts.
4. Created an isolated branch from exact current main, implemented the narrow repairs, and added behavioral/integration/negative scope tests.
5. Validated builds, independent TypeScript deltas, API bundles and preserved-source contracts.
6. Reproduced the one extra historical Gate assertion failure on a clean checkout of the exact starting commit.
7. Recorded one normal local implementation commit only. AI-Log publication is documentation-only and separate from application promotion.

## Confirmed findings

| Observation | Count |
| --- | ---: |
| Standard Real entries inspected | 12 |
| Symbols | 11 |
| Binance entries | 12 |
| MEXC / Gate entries in the window | 0 / 0 |
| Recorded native inputs fully closed at computation | 36 / 36 |
| Entries with a newer fully closed contributing candle by actual entry | 6 / 12 |
| Stale input comparisons at entry | 11 |
| Entries after the matching discovery setup was retired | 3 / 12 |
| Union of the two entry-timing findings | 7 / 12 |

The three post-retirement entries involved IMX, NMR and SKY. Reasons recorded by discovery included wide spread and score below the existing minimum. One entry decision was approximately 469.6 minutes old; another approximately 189.5 minutes old. The defect is therefore not simply “a forming candle at decision time”: all recorded inputs were closed at computation, but some decisions/setup eligibility were no longer current at execution time.

**Linkage limitation:** the historical decision metadata did not explicitly bind its originating setup ID. Retirement linkage uses the same owner, symbol and venue plus the absence of an active replacement at entry. It is not an immutable historical setup-origin proof. The new code records that binding before computation.

**Outcome limitation:** the affected group also contains a TP winner. This audit does not establish how many losses a repair would have prevented, whether stricter selection improves returns, or whether stored post-entry SL/TP values equal the original entry risk/reward. No profitability or better-R:R claim is made.

## Implementation

### New-entry validity

`api/_shared/futures-entry-freshness.ts` implements `native-fresh-entry-v1`:

- Capture the originating setup before analysis. Inspect the newest applicable setup, including retired/deleted history; a retired discovery setup cannot silently become a manual origin. Fail closed on unavailable or inconsistent origin evidence.
- Require the exact persisted decision identity, direction, timeframe, deterministic risk result, origin version, native input hashes and valid chronology.
- Require every contributing native candle to remain the latest fully closed candle at entry, not merely the winning timeframe. Preserve Binance native inclusive-close semantics and MEXC/Gate boundary semantics, including weekly anchoring.
- Require the latest matching decision; a later WAIT/opposite decision invalidates an old entry decision.
- Require the original setup to remain active with the same identity/source/venue. Discovery origins additionally require current AUTO-quality PASS, direction and an enabled matching profile.
- Bound decision and discovery freshness to ten minutes, aligned to two existing five-minute checks. This is a freshness safety boundary, not an optimized trading signal.
- Recheck after awaited reads and at admission, durable attempt claim, and immediately before marking a new attempt SUBMITTED.
- Preserve existing PREPARED/SUBMITTED/UNKNOWN recovery before new-entry checks. Never free an uncertain hold to get a fresh submission. A late uncertain failure retains a durable hold for existing reconciliation.

No new migration is required. Origin metadata uses the existing `engine_decisions.multi_timeframe` JSON structure; AUTO quality uses existing discovery JSON fields.

### AUTO selection quality and retention

`api/_shared/futures-auto-candidate-quality.ts` adds `confirmed-trend-v1` only to AUTO admission:

- Preserve the existing core eligibility, liquidity/spread/funding and score gates.
- Require established matching four-hour trend and confirming one-hour direction.
- Require eligible directional evidence and reject adverse volume participation at the existing component threshold.
- Require finite, positive current open interest plus available spread/funding/interval evidence. Do not fabricate zero values. MEXC open-interest history is not required because that history is unavailable from the current provider.
- Missing/incomplete data is UNKNOWN, not PASS and not a forced weak candidate.
- Allow otherwise-qualified ranked-out candidates to fill capacity after the stricter filter. Do not change raw V3 ranking or the manual/simulator result.
- Retain valid candidates. Retain unknown/open-position rows while replacing any old PASS with current UNKNOWN/REJECT, so list retention does not grant fresh entry permission.
- Retire invalid candidates where the existing maintenance rules permit it. Never close a position because discovery retires a candidate. A wholly failed scan leaves the list intact; old entry permission expires.
- Keep the existing five-minute timer and cadence. No duplicate scheduler, time-only churn or forced replacement was added.

This changes AUTO candidate selection policy, not the shared strategy/entry signal calculations or risk/reward formulas. It does not guarantee the “best” candidate or future profits.

### Concurrency boundary — not solved atomically

Admission uses separate read-only database SELECTs. Scanner retirement, profile changes or a newer decision can still occur after the last read and before submission. Rechecking narrows this gap but does **not** make admission atomic with those writers. An offline counterexample explicitly preserves this limitation in the test record. A strict no-race guarantee requires separately reviewed transactional admission synchronized with those mutation paths; it is not included in this local change.

## Exact files changed

Runtime/input admission (4):

- `api/_shared/futures-auto-candidate-quality.ts`
- `api/_shared/futures-entry-freshness.ts`
- `api/analyze.ts`
- `api/copytrade.ts`

Documentation (3):

- `HANDOFF.md`
- `TRADING_STRATEGY.md`
- `docs/testing/futures-entry-freshness-2026-10-05.md`

Tests and bounded historical-scope compatibility (14):

- `scripts/futures-auto-quality-test.mjs`
- `scripts/futures-auto-scanner-integration-test.mjs`
- `scripts/futures-discovery-live-test.mjs`
- `scripts/futures-entry-admission-integration-test.mjs`
- `scripts/futures-entry-freshness-test.mjs`
- `scripts/futures-entry-release-scope-test.mjs`
- `scripts/futures-entry-types-check.mjs`
- `scripts/futures-manual-profit-reentry-test.mjs`
- `scripts/futures-real-execution-fault-test.mjs`
- `scripts/futures-training-release-scope-test.mjs`
- `scripts/lib/futures-entry-release-delta.json`
- `scripts/lib/futures-entry-release-parity.mjs`
- `scripts/lib/futures-pure-test-context.mjs`
- `scripts/lib/futures-training-release-parity.mjs`

Total: 21 files, 1,035 insertions and 12 deletions. No task-created source diff under `src/`, `server/`, `migrations/`, `ops/`, `deploy/` or `.github/`. Core engine, risk, native providers/adapters and existing exit/reconciliation functions are preserved by the closed-scope checks.

Historical contracts are not silently disabled. A closed successor verifies the entire current changed-file inventory, content hashes and permitted AST/function changes before presenting the pinned predecessor to older contracts. The existing downstream execution fault suite isolates the new admission port; separate integration tests use the actual helper and actual pending/claim/pre-submit functions. Neither static text checks nor mocked fault tests alone are claimed as runtime proof.

## Tests executed

Local Node: `v24.19.0`. No GitHub CI was dispatched. Official Linux Node 22 execution remains pending.

### Primary selected tests: 905 / 905 PASS

Group 1 — 377 PASS, zero failed/skipped/cancelled:

```text
node --experimental-strip-types --test scripts/futures-manual-profit-reentry-test.mjs scripts/futures-reentry-release-scope-test.mjs scripts/futures-training-release-scope-test.mjs scripts/spot-tutorial-release-scope-test.mjs
```

This includes 98 new entry-freshness tests, 65 actual-path admission integration tests, 16 AUTO-quality tests and 49 closed-scope tests, together with existing manual re-entry/Spot/training contracts. The counts are included in 377, not added again.

Group 2 — 528 PASS, zero failed/skipped/cancelled:

```text
node --experimental-strip-types --test scripts/futures-market-discovery-test.mjs scripts/futures-discovery-data-test.mjs scripts/futures-simulation-discovery-test.mjs scripts/futures-discovery-evaluation-test.mjs scripts/futures-gate-mexc-fault-test.mjs scripts/futures-shared-engine-test.mjs scripts/futures-economics-contract-test.mjs scripts/futures-pro-scheduler-reliability-test.mjs scripts/futures-discovery-live-test.mjs scripts/futures-real-execution-fault-test.mjs scripts/futures-auto-scanner-integration-test.mjs
```

Coverage includes native close chronology and fresh-at-entry boundaries; origin identity; latest decision; retirement and profile checks; stale proof/DB failure; late clock advancement; preservation of uncertain attempts; expired quality; LONG/SHORT quality; no forced candidate; open-position retention; ranked-out replacement; and preservation of existing execution/economics behavior.

### Additional historical Gate test — inherited failure, not green

```text
node --experimental-strip-types --test scripts/futures-gate-observer-native-test.mjs
```

Result: 110 PASS / 1 FAIL on both the candidate and a clean checkout of exact base `3e92cab7a36cc0021847b1f700b9b5a394c75b37`.

Failing test: `legacy exit bodies and non-accounting functions preserve reviewed main; fc5 Gate lifecycle remains separate`. The `getCreditConfig` historical byte comparison predates an existing Partner credit-cost branch. This is not introduced by the new repair. The assertion was not removed/weakened and the unrelated Partner code was not changed. It remains an explicitly recorded baseline failure; this report does not claim every repository test passed.

### Types, static scope and diff

```text
node --experimental-strip-types scripts/futures-entry-types-check.mjs
node --experimental-strip-types scripts/futures-profit-protection-scope-test.mjs --types
git diff --check
git diff --cached --check
```

- Fresh exact-parent comparison: API 30 -> 30 diagnostics; Web 71 -> 71; introduced diagnostics = 0.
- Existing release scope/type gate: exit 0; API 30 -> 30; historical frontend 72 -> 71; introduced diagnostics = 0.
- These are zero-regression comparisons, not claims of a zero-error full-project TypeScript baseline.
- Exact 21-file scope and diff checks passed. Independent read-only source/test review found no additional local blocker and retained the non-atomic admission limitation.

## Build result

```text
node C:/Projects/SignalVerse-Main/node_modules/vite/bin/vite.js build
node C:/Projects/SignalVerse-Main/node_modules/vite/bin/vite.js build --config vite.admin.config.ts
```

- Web: PASS, 2,040 modules; existing large-chunk warning only.
- Admin: PASS, 1,713 modules.
- All 14 top-level API entry points bundled successfully with esbuild: `--bundle --platform=node --target=node22 --format=esm --packages=external --sourcemap --outdir=.runtime/api --out-extension:.js=.mjs`.
- Bundles/build output were not committed.

## Selected canonical-LF SHA-256 values

| File | SHA-256 |
| --- | --- |
| `api/_shared/futures-entry-freshness.ts` | `4ee7ef9488855d0f7997fcc8367a17f460641c41ecef3dd2be4957cb6c0fde67` |
| `api/_shared/futures-auto-candidate-quality.ts` | `642a29a2b44a655aa9a9e705ce6a7f97aa7beb6989dd13ed563d6ec25af08774` |
| `api/analyze.ts` | `a1c846699c989b23b89b57af1bf087ace977d06cc5921cff24e4a876604a6437` |
| `api/copytrade.ts` | `bf227f231b71a7434a4f63bad3ffcfdf9b39f844e2217ba7eb0e5461cf9d2c40` |
| `scripts/lib/futures-entry-release-delta.json` | `b51070f43083b97e0a904669459a368f9dc69bc0dfcbcb77227ff081954ab7bd` |

## Git status / commit

- One normal local commit: `a4ba3246672c3db35b61f56ed5600ba20fb9a0f1`.
- Sole parent: `3e92cab7a36cc0021847b1f700b9b5a394c75b37`.
- Candidate checkout clean after commit. Primary unrelated dirty work preserved.
- Application push: NO. Application main write: NO. CI dispatch: NO.
- AI-Log report publication is separate documentation-only work; publication receipt must be verified remotely before claiming it was published.

## Safety / remaining issues

```text
LOCAL_IMPLEMENTATION=COMPLETE
OFFICIAL_EXACT_SHA_CI=NOT_RUN
APPLICATION_PUSH=NO
ARTIFACT_OR_GUARD_CREATED=NO
DEPLOYMENT=NO
PRODUCTION_MUTATION_BY_TASK=NO
MIGRATION=NO
SCANNER_GATE_OR_PROFILE_CHANGE=NO
WORKER_START=NO
REAL_PP_OR_DEMO_PP_CHANGE=NO
EXCHANGE_CALLS=0
ORDER_ACTIONS=0
POSITION_ACTIONS=0
SL_TP_ACTIONS=0
CLOSE_ACTIONS=0
IMPROVEMENT_IN_PROFIT_OR_RR_PROVEN=NO
ATOMIC_ADMISSION_WITH_SCANNER_WRITERS_PROVEN=NO
```

Natural background production activity was not halted; zero-action statements describe this task, not the absence of all external trading activity. Offline tests do not prove live exchange execution or future economic improvement. MEXC/Gate behavioral coverage is synthetic because the 24-hour sample contained no entries from those venues.

## Recommended next step

Review this exact local commit and the explicit residual concurrency boundary. Before any rollout, recheck current main, obtain the applicable source/release authorization, run exact-SHA official CI and use the established artifact/Guard/release gates. Do not silently merge concurrent main changes or infer deploy permission from passing local tests. Any stronger atomic admission guarantee requires a separate bounded schema/locking design and validation. Observe natural entry behavior after a separately approved rollout; do not manufacture trades to claim acceptance.
