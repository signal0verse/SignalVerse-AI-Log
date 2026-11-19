# Prediction account privacy and fee-inclusive cash — 2026-11-19

Status: tested source candidate; official CI passed. No deployment or production write was performed.

## Source

- Repository: signal0verse/signalverse-main.
- Base and separately active production: `0578551fa195c17a24d1384bc7579db3a66a824f` (released PR257).
- Candidate: `58edc149eea3eba4264a7c4e29fabad5a1fb375b`.
- Branch: `codex/prediction-user-isolation-fees-20261119`.
- Draft PR: https://github.com/signal0verse/signalverse-main/pull/292.
- Production CI: https://github.com/signal0verse/signalverse-main/actions/runs/44511681537.

## Repairs

The public feed now selects only shared, ownerless observations before ordering, limiting and latest-market selection. Private records cannot displace shared observations during deduplication. Anonymous users and either authenticated account see only the shared feed.

The decision-trace endpoint authenticates the session and returns an account-owned prediction only to its owner. Shared observations remain readable to authenticated users. Foreign and missing IDs return the same 404 result. Supplied query/body owner IDs cannot override the verified session.

Autonomous Demo committed capital now includes open principal plus modeled entry fees, scoped to the authenticated owner. The per-user qualified-entry budget includes the same fees, rejects entries whose full cost exceeds available cash, and deducts the full successful entry cost before considering subsequent candidates. The Kelly recommendation, user limit, probability model and gates are unchanged. Legacy null fees count as zero.

Manual Demo portfolios also subtract open fees from available cash. Closed rows contribute their existing net PnL, so a fee is not charged again on settlement. Manual and autonomous ledgers remain separate.

## Regression evidence

Six new actual-handler regressions cover shared-feed privacy/deduplication, own/shared/foreign traces and session spoofing, distinct two-account cash and legacy fees, reserve release with net settlement PnL, multiple qualified candidates with fee-constrained cash, and owner-scoped manual portfolios. All six fail against the released API and pass against the candidate with the same final isolated fixtures. Existing fixtures now assert fee-inclusive cash; the budget-edge lifecycle fixture chooses an affordable notional rather than overspending fees.

The actual-handler/UI/lifecycle run passed 52 tests, zero failures, zero skips. The existing autonomous-account and multiuser suites passed 59 and 17 assertions respectively. The in-memory test helper adds only the existing manual-trade/market relation needed to execute the manual portfolio route. Test traffic is restricted to synthetic in-memory DB/network routes; no production users, credentials, fixture rows or private sessions are used.

All 23 original commands in the existing Prediction CI gate passed locally. The final scheduler gate passed eight cases and skipped only the Linux/GitHub-Actions disposable-PostgreSQL case on Windows. That SQL case remains required in official CI. Its nested actual API/UI child asserted 31 passes and zero skips, so a silently skipped child cannot produce a green parent. The local assertions do not replace the official Linux/SQL CI result.
Official Production CI completed successfully on `58edc149eea3eba4264a7c4e29fabad5a1fb375b` (pull_request run `44511681537`, attempt 1). Its job completed with 94 successful steps and 0 explicitly skipped steps. No failure/cancelled step was observed. The Prediction gate, its executed native disposable-PostgreSQL case, web/API builds, compiler checks and final selected-gate acceptance passed. Run URL: https://github.com/signal0verse/signalverse-main/actions/runs/44511681537. The GitHub PR test merge has the same tree as the exact candidate (71f32c3e2f257c9a071c31f412ee8e521f92a1f1). No main-push or production release run is claimed.

CI ran once. Downloading the finished job log initially hit GitHub CLI terminal-escape filtering; log retrieval uses its explicit escape-sequence opt-in and captures bytes directly to a local file, without emitting the log to the terminal. This did not require a CI rerun or any production change.

## Package and protected scope

The exact-source archive built with the unchanged release producer settings is 8,385,129 bytes, with 3,479 bytes remaining below the unchanged 8 MiB ceiling. Archive SHA-256: `551221579eaa7b7f8275d6cc0f5bfa20eb870b1ef1392f0d8d8b85292d8c9529`. All 2,762 Git blobs and executable modes match the candidate; its archive comment identifies the exact SHA. This is local source-archive verification, not an official production release artifact.

Only eleven files changed from the released source: the Prediction API, one existing floating-help description line, the candidate content manifest, the isolated helper, five existing test files, HANDOFF.md and the Prediction evaluation document. The manifest seals all candidate changes relative to its existing historical base; historical assertions and inventory checks remain active. No gate or test is removed. The scheduler, CI/release workflows and packaging limit are unchanged.

Independent source comparison verified 228 protected Prediction declarations unchanged, exact unrelated analysis/help and non-Prediction UI bytes after the previously reviewed component exclusions, and exact scheduler/release/CI source. No migration, wallet/signing/order code, gate file, scheduler activation, real mode, learning, model/classifier/price/Kelly/H1–H8/risk policy, Futures, Spot, Fast Trader or Supervisor change was made. No strategy-history amendment is required for this privacy/accounting repair.

## Production safety (read-only)

At `2026-11-19T11:08:00.946336+00:00`, the deployed-SHA receipt and release symlink still identified the previous production source `0578551fa195c17a24d1384bc7579db3a66a824f`, and the service health check passed. The Real Prediction setting was OFF, the running source retained its hard disabled real-execution branch, and no Prediction learning gate existed. The setting query ran in an explicit READ ONLY transaction, then rolled back. No production mutation, migration, fixture, signing, real order or funds movement was performed. Existing Demo settings and positions were left unchanged. No rollback occurred because nothing was deployed.

## Limits and next release boundary

This candidate fixes reproduced source defects. It does not establish that private data was exposed in production; the earlier live anonymous-feed sample contained no owner-bearing rows. Synthetic account-isolation evidence is not private-account execution or production concurrency proof. No new production cross-user session was fabricated.

This task delivers the tested SHA before deployment, as requested. This work does not merge to main or deploy. The production fixes take effect only after that separately controlled release. No database migration is introduced by this repair.

Phase 9A statistical validation is NOT complete. No profitability, model/AI superiority or uncertified historical scoring claim is made. Settlement monitoring previously stopped at the owner's instruction is not resumed by this repair.

## Report publication

Published as this single dated report to SignalVerse-AI-Log master. No other log file or report was changed by this publication.
