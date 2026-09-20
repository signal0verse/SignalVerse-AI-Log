# Binance Futures lifecycle-fee Production rollout — 2026-09-21

## Metadata

- Date: 2026-09-21 (Asia/Kuala_Lumpur)
- Task ID: binance-futures-lifecycle-fee-production-20260921
- Repository / branch: signal0verse/signalverse-main / main
- Executable commit: `e5ce65c2bcb824804fec4c2ebb9a8dd113f3d6e6`
- Production CI run: `35521461654`
- CI result: success in 3 minutes 28 seconds
- Production coordinator result: `deployed` for the exact executable commit
- Database migration: none
- Exchange/account mutation during rollout: none

## Authorized scope

The owner explicitly approved committing, pushing and publishing the already
tested Binance Real Futures lifecycle-commission fix. The change attributes
entry and exit commission to a complete position lifecycle using exact order
identity and fail-closed quantity validation.

This rollout did not change Spot, in-app Demo, engine direction, Supervisor,
allocation, leverage or SL/TP policy. It did not submit an exchange order, read
new private exchange data, modify Production database rows or run a migration.
Historical rows were not rewritten.

## Commit and publication

Before staging, local `main` and `origin/main` were exactly synchronized. Only
the following task files were staged; unrelated scratch, output and private
evidence remained untracked and were excluded:

- `api/copytrade.ts`
- `scripts/futures-real-execution-fault-test.mjs`
- `scripts/binance-algo-protection-test.mjs`
- `HANDOFF.md`
- four sanitized testing reports for this investigation and implementation

The staged diff passed `git diff --check` and a credential-pattern scan reported
zero hits. Commit `e5ce65c2bcb824804fec4c2ebb9a8dd113f3d6e6` was pushed to `main`, triggering
the existing Production CI workflow.

## CI and deployment evidence

GitHub Actions run
[35521461654](https://github.com/signal0verse/signalverse-main/actions/runs/35521461654)
completed successfully. Its single Production job passed:

- the isolated real-execution fault suite containing the new Binance lifecycle
  cases and the adjacent Gate/MEXC cases;
- the repository's other offline engine, simulation, admin and SQL gates;
- disposable PostgreSQL checks;
- the main and standalone-admin production builds;
- API bundling and artifact verification; and
- the Production release-delivery step.

The authenticated deployment coordinator first returned `accepted` and then
returned `status=deployed`, both for the exact full executable commit above.
Afterward, the public health endpoint returned `ok=true` for `signalverse`, and
the public application root returned HTTP 200.

The documented read-only SSH command could not be completed from this host
because its local SSH configuration did not define the `servers.signal` alias.
Therefore symlink, `deployed-sha` file and `systemctl` were not independently
read over SSH in this session. The active release assertion here is limited to
the authenticated coordinator's exact-SHA `deployed` response plus the public
health checks; it does not claim a separate SSH verification.

## Functional verification already completed before rollout

- Node 22 runtime-equivalent suite: 127/127 passed.
- Tracked Binance isolated suite: 114/114 passed, including five new lifecycle
  fee and fail-closed cases.
- Exact implementation replay: 12/12 passed over two bounded Binance Demo
  lifecycles and 144 independently reconciled historical Real lifecycles.
- Both Vite builds passed locally.
- All 14 API handlers bundled for Node 22 locally.
- CI repeated the repository's release gates against the pushed commit.

These checks validate fee attribution and release integrity. They do not prove
future profitability, trading-signal quality or private-account execution.

## Remaining limitations and next gate

- Missing or rounded historical entry-order IDs remain unknown and are not
  guessed.
- Binance account-trade history has availability/window constraints; long-lived
  cycles can still fail closed. Pagination and an archival lifecycle journal
  remain separate work.
- Funding finalization, partial-position basis journaling, estimated fallback
  labeling, protection replacement, profit locking, concurrency, market
  structure analysis and Supervisor usefulness were not changed.
- In-app Futures Demo parity is intentionally deferred until the Real path is
  observed and accepted as stable. Spot remains outside this work.
- No new live order is authorized by this rollout report.

## Publication state

The executable commit is pushed and the authenticated Production coordinator
reports that exact SHA as deployed. This post-rollout document is a documentation
record only and must use `[skip ci]`; publishing it does not replace the active
executable SHA described above.
