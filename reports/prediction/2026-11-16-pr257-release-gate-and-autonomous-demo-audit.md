# Prediction Demo position audit and PR 257 release decision

## Metadata

- Date: 2026-11-16, Asia/Kuala_Lumpur.
- Module: Telegram Prediction Market.
- Source: `signal0verse/signalverse-main`, draft PR 257.
- Approved candidate, conditional on CI: `675e20bcccb4c94879c990a9c6c247d5c7a12db7`.
- Production before and after this review: `59fb9e17a26dcae3eaaee1b58ec6af5efa2f48cd`.

## Objective and scope

Audit the two owner-selected Demo positions before release. The owner conditioned deployment, its migration and personal daily/weekly activation on passing CI for the exact PR SHA. Production checks used read-only SQL, existing health and release metadata, and public CLOB requests. Account identifiers, account balances and personal trade amounts are omitted from this repository report.

## Position findings

- Both records joined to a v2 `OPPORTUNITY` prediction with `would_open=true` and a successful scheduled entry run recording one opening each. The existing run type is named `entry_real` and writes to the autonomous virtual Demo ledger. The runtime API keeps Real execution disabled. The account had one settled row and one open row when inspected.
- The November 15 BTC range position bought No. Polymarket's public market record set No as the sole winner and stopped taking orders. The Demo resolver recorded market resolution at a unit payout of 1. Recomputing shares from stake and average entry, then subtracting the recorded modeled entry fee, matched the gross and net ledger results. Decision confidence was 50 and the recorded net edge was 12.35 percentage points.
- The November 18 BTC threshold position also bought No. At 19:10 MYT the public market remained open and the No book showed bid 0.373, ask 0.380 and midpoint 0.3765. The open-position monitor marks the held side at midpoint and subtracts the modeled entry fee. This explains how a midpoint above the entry can still show a net unrealized loss. Decision confidence was 50 and recorded net edge was 8.81 percentage points.
- At 19:09 MYT the previously enabled entry and resolver gate files were present and the learning gate file was absent. The most recent audited entry run evaluated 50 and opened zero. The observed reasons included inadequate market data, edge and confidence, with overlapping counts. The resolver returned a successful recent run receipt. The scheduled evaluation RPC and saved evaluation cadence were absent in production.

Public sources: [settled market](https://clob.polymarket.com/markets/0xf00b542484c29dbce3d7124709b3955c7961d4231a12b5ba756cb9d5c34b7308), [open market](https://clob.polymarket.com/markets/0x58a65e14256121c9e987bfe0392ee4faf302adc53092cd1bd9eebc7c9b1a08ac). The web viewer could not open these JSON endpoints. A separate unauthenticated HTTPS GET returned their data and the live book.

## Release evidence

- [Production CI 41300410462](https://github.com/signal0verse/signalverse-main/actions/runs/41300410462) was the only exact-SHA Production CI receipt returned. It completed with failure. The failing Spot setup/display stage had 1,248 passes and 3 failures out of 1,251, including two predecessor Git blob/mode assertions and an `INVALID_ARCHIVE_SIZE` failure. The earlier stage repaired in the previous task passed all 557 checks.
- A local read-only execution of the exact archive producer's Git command generated 8,402,790 bytes, 14,182 bytes above the reviewed candidate's 8,388,608-byte limit. Archive SHA-256 `13c39850d34364ff259721a7a1a241b7f61d3b8a5c12b503bf9c9ea4f578ff15`. This verifies the byte count, not an official artifact or a passed build.
- [PR 257](https://github.com/signal0verse/signalverse-main/pull/257) remained open, draft and unmerged at the approved head. GitHub comparison showed main and the approved head diverged, with 92 commits specific to main and three specific to the candidate. The controlled release workflows in the candidate require a main ancestor and successful exact main-push CI.
- The live SHA marker and symlink pointed to `59fb9e17a26dcae3eaaee1b58ec6af5efa2f48cd`, also current GitHub main when read. `/healthz` returned healthy at 19:09 MYT. Prediction runtime source SHA-256 was `6972c20053209987c559b28aeb6b3edb4776414e278168298fa1e4a69fb61f87`.

## Outcome and remaining work

The exact release condition did not pass. Deployment timestamp and official artifact are unavailable. No merge, source commit, rerun of the deterministic failed candidate, production migration, account save, forced cycle, gate change or rollback was performed. Daily/weekly activation and its first future position remain pending. Production queries ran inside `BEGIN READ ONLY` with statement and lock timeouts and `ROLLBACK`. No fixtures or history writes were issued.

The captured positions demonstrate that the currently deployed strategy can select a qualifying opportunity and settle it. The draft's evaluation selection would replace qualified-opportunity admission for an enrolled account, so a higher cadence of similar qualified trades needs separate consideration from a schedule of experimental positions. The observed settled win is a sample of one. Phase 9A and statistical validation are incomplete. Profitability and model or AI superiority are unverified.

A compatible successor based on current main, with the exact artifact inside the installed release limit and full CI passing, would need its own SHA review and authorization. This review changes only the sanitized dated AI-Log report. The local working tree's pre-existing changes are preserved.
