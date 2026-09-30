# Continuous Auto Scanner — Production migration PASS, exact-SHA CI BLOCKED

## Metadata

- Date: 2026-09-30 UTC
- Task ID: continuous-auto-scanner-final-production-authorization-20260930
- Module: Futures Pro Auto Scanner
- Mode: owner-authorized exact migration and CI; stop on failure
- Repository: `signal0verse/signalverse-main`
- Starting application main/runtime: `8858119faa378c67aa86d1092919ddf5e72c703f`
- Approved candidate and ending application main: `e00f5424bf4d1c552919cecaa94721988e9fb35f`
- Ending Production runtime: unchanged `8858119faa378c67aa86d1092919ddf5e72c703f`

## Objective and scope

Execute only the approved scanner schema migration, validate it through real PostgREST, then run the exact-SHA official CI/Guard/release sequence and connect the existing five-minute scheduler only after successful deployment. Stop on any CI, Guard, migration or scheduler failure. No redesign or unrelated fix was authorized.

## Actions and findings

1. Revalidated the existing private native backup of active `signalverse_cutover2` before DDL: 119,192,065 bytes, mode `0600`, SHA-256 `0f4d4f43cd04009e9600bd860c48c8a7ba6b5bb95f74564b08772a5da5622329`. The prior full archive data read and scanner-table listing had passed. No second backup was created.
2. The staged VPS migration file matched the local approved SQL byte-for-byte: SHA-256 `dc8ee48112e2d662de5148d0a42c0147a627e8070c45ac09e0f5d1a1238ce845`. Ran only `migrations/futures_discovery_profile_margin_mode.sql` on `signalverse_cutover2` with `ON_ERROR_STOP` and bounded lock/statement timeouts. It committed successfully. The nonexistent-old-constraint notice was expected. No backfill, unrelated table, trade row, balance, order or position DML was part of the migration.
3. Live PostgreSQL inspection confirmed `futures_discovery_profiles.margin_mode text NOT NULL DEFAULT 'isolated'` with its `cross`/`isolated` CHECK and nullable `futures_discovery_runs.observed_symbols text[]`. Authenticated Production PostgREST OpenAPI returned HTTP 200 and contained both new properties.
4. Verified remote `main` at `8858119...`; the clean approved candidate `e00f542...` was its direct child. One non-force push fast-forwarded remote `main` to exactly `e00f5424bf4d1c552919cecaa94721988e9fb35f`, triggering normal Production CI. No application source was modified in this task.
5. [Production CI run 36711819918](https://github.com/signal0verse/signalverse-main/actions/runs/36711819918) used exact head SHA, branch `main`, event `push`, and concluded **failure** at 2026-09-30 11:59:54 UTC. The failed step was `Test isolated internal paper and exact original UI parity`. In `scripts/full-terminal-contract-test.mjs:95`, the test requires current `api/copytrade.ts` to equal historical `065e117:api/copytrade.ts` byte-for-byte and emitted `Canonical engine must match the reviewed operational reliability revision byte-for-byte`. This candidate changes `api/copytrade.ts` for the scanner, so the official CI gate blocks it. Prior 225/225 local scanner tests are not a substitute for this CI pass.
6. Stopped immediately after documenting the CI failure. No artifact preparation, independent Guard approval, Production Release workflow, VPS job-runner change, gate enablement, controlled profile, natural five-minute tick, or scanner order/position action occurred. At 2026-09-30 12:01:12 UTC, deployed marker and active app symlink both remained `8858119faa378c67aa86d1092919ddf5e72c703f`; the original fast-jobs timer remained active.

## Implementation, tests, Git and limitations

No feature implementation or parity-test change was made. The one Production write was the explicitly authorized additive migration; the one Git change was exact fast-forward of main to the approved candidate. PostgREST schema verification passed; exact-SHA Production CI failed. Scanner runtime behavior, candidate maintenance, two natural ticks, unexpected exchange orders and position changes were **not verified** because no deployment or scanner activation occurred. Do not claim Continuous Production readiness.

The next step requires a separate owner-approved response to the parity gate. A narrowly scoped test correction or a different reviewed candidate would create a new release SHA and require new exact-SHA CI, retained artifact digest and independent Guard approval. This task did not attempt that fix or bypass the gate.
