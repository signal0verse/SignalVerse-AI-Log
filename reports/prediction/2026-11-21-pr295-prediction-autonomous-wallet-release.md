# 2026-11-21 — Prediction autonomous screen and Polymarket wallet release

| Metadata | Value |
| --- | --- |
| Date | 2026-11-21T08:15:13+08:00 |
| Task | [Prediction PR 295](https://github.com/signal0verse/signalverse-main/pull/295) |
| Scope | Prediction Web UI and wallet connection, additive wallet migration, and exact release packaging |
| Previous runtime SHA | `bcca682604eb3874fd4cb884703e3d000cdc5713` |
| Reviewed source SHA | `0c70458abf866e6840252406f27c824b2c3da4a0` |
| Runtime activation | 2026-11-21T08:08:55+08:00 |
| Prior exact source ancestry | `bcca682604eb3874fd4cb884703e3d000cdc5713` is an ancestor of the reviewed SHA |

Published the autonomous Prediction landing page and Polygon Deposit Wallet connection. Runtime healthy at `0c70458abf866e6840252406f27c824b2c3da4a0`.

## Product behavior

- Prediction opens directly to the autonomous engine. The Feed, Simulation, manual Demo and standalone Real tabs were removed from the screen, together with their eager requests. The autonomous account, positions, performance, decisions and evaluation controls remain in the engine.
- A disclosure within the engine mounts the Polymarket wallet connection only when opened. Polygon wallet ownership requires an owner-linked, expiring signature challenge. Account ownership and duplicate wallet controls are enforced by the API and SQL. The account-link signature grants no spending or order authority.
- In a 390 px browser test of the production build using synthetic responses, the engine made its five intended reads, sent zero manual requests, made one wallet status request after the disclosure opened, and raised zero page errors.

## Storage findings

- The read-only 24-hour audit attributed all 25,934 new Prediction rows to autonomous runs. The legacy/manual count was zero in that window. The main predictions relation occupied approximately 2.39 GiB, including its indexes and TOAST. Existing history and automatic telemetry were preserved. Disabling manual UI reads did not reclaim existing production database space.

## Release and test evidence

- Exact PR CI [success](https://github.com/signal0verse/signalverse-main/actions/runs/44799880479). Exact main push CI [success](https://github.com/signal0verse/signalverse-main/actions/runs/44808816878). Manual release [success](https://github.com/signal0verse/signalverse-main/actions/runs/44841342219).
- Earlier PR runs rejected the packager and test reader by exact historical byte comparisons, rejected the additional wallet help line in a historical Analysis assertion, caught a changed HTTP status for disabled Real execution, exposed a localization test tied to the removed Feed, and could not start the wallet PostgreSQL fixture using the runner's system socket. The wallet test uses its own private Unix socket on Linux. The current candidate retains the original assertions and preserves 501 for unsupported Real execution and owner authorization for wallet status. Local runs interrupted by source edits are excluded as passing evidence.
- The official packager preserves default gzip bytes when they fit and retries at Git compression level 9 for overflow. It compares both decompressed tar byte buffers, observes the same 8 MiB receiver cap, and still checks the embedded Git SHA. Local wallet regressions reported 9 passed, release packager tests reported 33 passed, and the Web and Admin builds succeeded. The full local Windows Prediction suite reported 181 passed and two Linux-only PostgreSQL wrappers skipped. Its bilingual trace still removes internal metadata and translates explanations.
- The additive wallet SQL was exercised in a disposable PostgreSQL cluster with 5 passing cases. The cases covered role denial, expiration and challenge replacement, competing confirmations, cross-owner address uniqueness, and disconnect. The private Linux probe passed all five SQL cases before its sandbox denied the normal stop signal and the container was removed. This probe is excluded as a successful Linux run. Production uses a separate cold-restore and migration proof.
- Exact main CI's first isolated attempt reached the 180-minute limit. The same push CI was retried on the existing hosted runner with the verified included Actions allowance. GitHub assigned attempt 2 and the repository routing variable was restored. [Exact attempt](https://github.com/signal0verse/signalverse-main/actions/runs/44808816878/attempts/2)
- The retained artifact contains 8,372,297 bytes and 2,774 verified Git file modes and blobs. Inner SHA-256 `a7613d9c43bbc34ac0de6b3879e9a0321239189c808f241f0cbd789a2d824c0c`. [Official artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/44840916452)
- The private backup was restored in a disposable PostgreSQL cluster with network listeners disabled. The exact wallet SQL was rehearsed on that copy and preexisting Prediction counts were verified. The temporary restore was removed.
- The exact additive wallet schema was applied and its live catalog matched the cold rehearsal. Schema SHA-256 `80930ce7cca44716e65b98ca20f23206dcd8d29dca1cf8e90d1fb2fa853c95a2`. Two service metadata reads returned zero rows after 1 schema-cache retry. The release wrote zero wallet connection rows during verification.
- Installed Git files and runtime, active service, Admin health, and the previous release pointers were verified. 5 public assets matched installed bytes, the public wallet page was served, and the private status API rejected an anonymous request.
- The one-use approval was consumed for this exact artifact. 23 protected controls and 17 scheduler gate files matched the read-only baseline. Successful naturally scheduled engine jobs were discovery, Demo entry, shadow evaluation, resolution.
- The controlled release succeeded and no rollback occurred.

## Changed source files

- `HANDOFF.md`
- `api/_shared/prediction-real-status.ts`
- `api/_shared/prediction-wallet-link.ts`
- `api/analyze.ts`
- `api/predictions.ts`
- `docs/prediction-real-wallet.md`
- `docs/prediction-wallet-connect.md`
- `docs/testing/stability-test-runbook.md`
- `migrations/prediction_wallet_link.sql`
- `scripts/lib/prediction-candidate-delta.json`
- `scripts/lib/prediction-historical-readers.mjs`
- `scripts/lib/spot-cron-read-batches-parity.mjs`
- `scripts/prediction-demo-job-test.mjs`
- `scripts/prediction-real-wallet-test.mjs`
- `scripts/prediction-v2-i18n-test.mjs`
- `scripts/prediction-wallet-link-sql-test.mjs`
- `scripts/release-artifact-test.mjs`
- `scripts/release-artifact.mjs`
- `src/app/App.tsx`
- `src/app/PredictionReal.tsx`
- `src/app/PredictionWalletApproval.tsx`
- `src/app/PredictionWalletLink.tsx`
- `src/prediction-wallet-connect.tsx`
- `vite.config.ts`
- `wallet-connect.html`

## Limits

- Real Prediction orders and autonomous learning are disabled in the verified state. No production wallet was signed, tested with funds, linked on behalf of a user, or used to submit an order.
- Browser fixture verification does not exercise a private Telegram session or prove ownership of a specific user's wallet. Phase 9A statistical validation remains incomplete.
