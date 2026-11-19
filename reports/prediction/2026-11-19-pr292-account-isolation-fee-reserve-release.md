# PR 292 Prediction account isolation and Demo fee reserve — 2026-11-19

The exact approved source is deployed. Main and admin health, the installed code, and read-only Prediction checks passed at 2026-11-19 22:06:24 MYT.

## Exact source and release

- Production before release: `0578551fa195c17a24d1384bc7579db3a66a824f`. Approved and deployed: `58edc149eea3eba4264a7c4e29fabad5a1fb375b`. [PR 292](https://github.com/signal0verse/signalverse-main/pull/292) was merged by fast-forward to that exact commit.
- Previous production and its release symlinks were verified at 2026-11-19 20:46:08 MYT. The running application SHA, deployed-SHA receipt and main/admin symlinks matched the target after activation at 2026-11-19 22:04:21 MYT. The main process runs from the exact release directory.
- [PR CI](https://github.com/signal0verse/signalverse-main/actions/runs/44511681537) and exact-main push CI [44527066427](https://github.com/signal0verse/signalverse-main/actions/runs/44527066427) succeeded. Main CI completed 94 successful steps on attempt 1, including executed Linux disposable-PostgreSQL Prediction admission coverage, compiler comparisons and builds. The existing hosted route was selected for this run and the repository runner setting was restored after assignment. The CI and deployment workflows and their acceptance checks were unchanged.
- Official retained artifact preparation [44538159956](https://github.com/signal0verse/signalverse-main/actions/runs/44538159956) completed 10 successful steps. Artifact ID 14537715598, 8,385,129 bytes within the unchanged 8 MiB limit, inner SHA-256 `551221579eaa7b7f8275d6cc0f5bfa20eb870b1ef1392f0d8d8b85292d8c9529`, verified Git files and modes 2,762. The artifact was delivered without repacking.
- One-time Guard approval was issued for this SHA and digest and consumed once. Official controlled delivery [44538779507](https://github.com/signal0verse/signalverse-main/actions/runs/44538779507) completed 11 successful steps. The artifact and release used the existing one-job isolated runners. Both exited and were removed.
- All 2,762 installed Git files/modes matched. The Prediction bundle's source map matched the approved API source. The main process, admin health, public HTML and 2 linked public assets matched. The previous main/admin release pointers still retain the prior SHA. No rollback occurred.

## Account isolation and cash calculation

- The live public feed returned 55 unique market rows, all ownerless. Three live routes for private reads returned HTTP 401 without a session. The read-only ledger check confirmed private receipts exist and that direct reads of the six private tables remain denied to the anon/authenticated database roles.
- The actual installed API bundle in a disposable network namespace passed its two-account checks. Each test session could read its own and shared prediction traces. A foreign trace returned 404, and a caller-supplied account ID did not override the session. The public feed excluded private rows before latest-market selection.
- The installed bundle reserved open principal plus entry fees in autonomous Demo and manual Demo. A synthetic settle released the reserve and counted its fee once through net PnL. The existing qualified-entry fee budget regression and scheduled Demo/SQL tests passed in CI.
- Fee-inclusive committed cash, realized net PnL and available cash for 2 production accounts independently matched SQL and the installed bundle. The SQL read used a masked copy of the ledger in memory inside the VPS verification process. At the check there were 4 open rows with positive fees. Orphan positions and cross-owner links from trade to private prediction receipt both numbered zero.
- Results combine actual public HTTP reads, read-only SQL, and installed-bundle execution with synthetic session keys and in-memory rows. No authenticated private production session was minted or used. No private account balances, identities or records were published.

## Operating state and boundaries

- Prediction Real Trading is **OFF** in the live setting and the deployed execution branch. Autonomous learning is **OFF**. Its scheduler gate is absent, and no learning run started after deployment at the time of verification.
- The existing Demo entry and settlement gates remained in place. The release did not force a job, enter a trade, change a user's settings, sign a wallet request or move real funds.
- Schema matched the previous release's reviewed Prediction schema digest in explicit read-only transactions before and after activation. No production migration, manual write or fixture row was applied. No database rollback was performed.
- All 23 protected controls, 17 job gates, 11 service states and the independent Paper pin matched preflight. The source diff leaves the Prediction models, H1–H8, Kelly, scheduled cadence, settlement policy, Futures, Spot, Fast Trader, Supervisor, wallet execution, migrations, CI and release controls unchanged.
- No workflow failure, timeout or retry occurred during delivery. Preflight verification setup corrected a local build command and the simulation history table name. The initial runtime verifier expected the approval file to disappear on consumption. The installed Guard retains that exact file for audit and rejects it as AUTHORIZATION_CONSUMED. The corrected read-only rerun confirmed this rejection and passed all checks. No release, setting or production data was changed by these verification retries.
- Phase 9A statistical validation is **not complete**. This release verifies the privacy and Demo cash fixes. It does not establish profitability or model superiority.
