# Continuous Auto Scanner — protected parity repair, CI and artifact preflight

## Metadata

- Date: 2026-09-30 UTC
- Module: Futures Pro Continuous Auto Scanner
- Repository: `signal0verse/signalverse-main`
- Starting source SHA: `e00f5424bf4d1c552919cecaa94721988e9fb35f`
- Final reviewed source SHA: `b8f66cbc138f53d083ef8ff827cc39e86b00f54c`
- Production runtime SHA at last check: `8858119faa378c67aa86d1092919ddf5e72c703f`
- Status: CI/retained artifact pass; Production deployment and controlled scanner validation blocked on independent owner Guard/profile decisions

## Objective and scope

Resolve the real official-CI parity conflict without bypassing its historical protection, validate the exact final SHA, and prepare the official retained artifact. Do not claim deployment or live scanner readiness without Guard and controlled natural five-minute ticks. No strategy, V3 core, Risk, Execution, Protection, Reconciliation, Spot, Personal List or Real Trading gate change was authorized or performed.

## Root cause and exact correction

Failed prior CI run `36711819918` compared the entire `api/copytrade.ts` with `065e117:api/copytrade.ts` byte-for-byte. The pre-scanner production source `8858119...` has exactly that historical blob. The approved scanner candidate `e00f542...` changes 79 lines/adds and removes 30 lines **only inside the top-level discovery implementation and discovery handler actions**; the old test could not accept any legitimate scanner evolution.

The rejected simplistic alternative of moving the entire-file baseline to `e00f542...` was not used. Instead, `scripts/full-terminal-contract-test.mjs` now partitions the entire file into five contiguous, exhaustive slices using unique checked boundaries. All three non-Discovery slices are still required to equal the historical `065e117` source byte-for-byte, and the test also proves the reviewed scanner candidate did not change them. The two Discovery slices are required to equal exact approved `e00f542...` bytes. Thus no runtime byte is omitted and all historical risk/execution/Spot/engine behavior remains pinned to the old reviewed source. This is an architecture-aware strengthening, not a skip/mock/exception for protected behavior. Only that test and `HANDOFF.md` changed in final commit `b8f66cbc138f53d083ef8ff827cc39e86b00f54c`; `api/copytrade.ts` and all executable source remain byte-identical to `e00f542...`.

## Verification

- In an isolated LF checkout, affected paper/terminal parity contract: **14/14 PASS**.
- Combined Scanner/V3/discovery/lifecycle/multi-horizon suites: **225/225 PASS**.
- Separate V3 coverage audit: **15/15 PASS**.
- Local Web/Admin Vite build: **PASS**. These are offline checks, not Production behavior proof.
- Remote `main` was fast-forwarded without force to exact final SHA `b8f66cbc138f53d083ef8ff827cc39e86b00f54c`. Official Production CI [run 36719541901](https://github.com/signal0verse/signalverse-main/actions/runs/36719541901) used event `push`, branch `main`, exact head SHA, and concluded **success** at 2026-09-30 13:12:03 UTC, including the previously failing parity step, Futures suites, Web build and API bundles.
- Official prepare-only [run 36720030387](https://github.com/signal0verse/signalverse-main/actions/runs/36720030387) concluded success. Immutable artifact ID `11098026722`, name `production-release-b8f66cbc138f53d083ef8ff827cc39e86b00f54c-36720030387-1`, attempt 1. The independently downloaded **inner** `release.tar.gz` SHA-256 is `92a17809b093a97bc63ab5fe19fe805e37b2cdc4dd2bfd30b4c3472627f54be3`, 4,416,482 bytes. Metadata, run/repository provenance and embedded Git commit verified against the exact SHA. No archive was repackaged.
- Earlier owner-authorized additive migration on `signalverse_cutover2` remains successful and both scanner columns were visible through authenticated Production PostgREST OpenAPI. Backup SHA-256 before DDL was `0f4d4f43cd04009e9600bd860c48c8a7ba6b5bb95f74564b08772a5da5622329`.

## Remaining gates and safety

No exact-SHA/digest owner-created Guard manifest existed at the last read-only check. The installed release design requires a **separate manual human gate**: root-owned, expiring, unused authorization for the exact final SHA and retained inner artifact digest; CI/HTTP cannot issue it. The user has been asked to bind the precise SHA/digest before release. No manifest was created or consumed, no Production Release workflow dispatched, and no app deployment occurred.

Read-only profile inventory found **three enabled Demo profiles and one enabled Real profile**. The current `futures-discovery-cron-tick` processes all enabled profiles, not one selected profile. Activating its VPS gate would therefore violate the requested one-profile controlled validation and could affect the enabled Real account. The owner has been asked whether temporary disabling/reverting the other profiles is allowed; absent that decision, the scanner gate remains off. No VPS job runner/timer, user profile, order, position or exchange setting was changed.

The active runtime and rollback SHA remained `8858119faa378c67aa86d1092919ddf5e72c703f` at the last read-only check. A passed CI and retained artifact do **not** prove live scanner maintenance, two natural ticks, Real execution safety or profitability. Do not report Continuous Production readiness until the independent Guard and controlled-profile gates are resolved, official release succeeds, one existing gated scheduler is wired, and two natural five-minute cycles plus non-interference are observed.
