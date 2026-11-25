# Limitless Demo and venue switches

Date 2026-11-25, Asia/Kuala_Lumpur.

## Source and publication

- SignalVerse source candidate `fd7418aa19625d657ed5082ca09ff7d9467920cc` on `codex/prediction-limitless-demo-20261125`. The GitHub branch was fetched and verified at that exact commit. It is one commit ahead of the unchanged base `0c70458abf866e6840252406f27c824b2c3da4a0`.
- The live SignalVerse service reported `active` and deployed SHA `0c70458abf866e6840252406f27c824b2c3da4a0`. No release or database migration was executed for this candidate. No production flags, schedules, users or wallets were modified. A read-only Real status probe returned HTTP 501 with execution disabled. The existing discovery, shadow, Demo entry and resolution job gates were present. No Prediction learning gate or cron/systemd invocation was found.
- GitHub returned HTTP 500 for both draft pull request creation and manual CI dispatch. The branch exists. GitHub showed no PR or CI run for this SHA at the last check. The full hosted CI result is unverified.

## Implementation

- The Prediction engine has two independent view switches. Polymarket and Limitless can mount and refresh concurrently. Turning a view off stops its browser reads. Polymarket's account entry controls remain separate, and its wallet data still loads on demand.
- Limitless uses authorized read-only access to a bounded public catalog and a maximum of twelve order books per snapshot. Concurrent sessions reuse a 45-second server snapshot. Users see book quality, an estimated 10 USDC fill and standard collateral fee when calculable, and observable reasons for abstention.
- The native Limitless books are passed to the existing Engine v2 assessment. The tested daily examples settle using Chainlink TWAP. The Polymarket evidence template is unchanged. Limitless has no validated settlement evidence model, background entry, ledger, wallet connection, transaction signing, real order submission, or learning path in this release.
- The historical test source readers verify both the exact prior Prediction delta and the committed Limitless successor before projecting the reviewed predecessor inputs. Production workflow and release controls have no diff.

## Verification

- `npm run build` passed under Node 22.23.5 for the web and admin applications, with existing bundle-size warnings. `git diff --check` passed. Raw TypeScript checking reported the same 66 inherited diagnostics as the verified base after normalizing shifted line numbers.
- All 38 tests in the targeted Limitless, scheduled Demo, and wallet run passed under Node 22.23.5. Coverage included simultaneous panel mounts, either switch off, on-demand wallet, read-only access, public request isolation, retry, fee math, and existing owner-scoped Polymarket behavior.
- Node 22 verified the exact source delta in a clean checkout. CI planning selected all 75 original gates, including Prediction. Planning does not establish a hosted run result. Additional historical source-reader and scheduler suites did not finish in the Windows verification window. No full CI pass or disposable PostgreSQL result is claimed.
- The production host could read the public Limitless catalog with HTTP 200. In a separate live-public-data probe, the exact candidate API returned HTTP 200 from an isolated in-memory account. The tracked crypto set contained 16 active markets, with four daily and zero weekly labels. Twelve books were examined. All four daily books supported an estimated 10 USDC fill on both sides in that snapshot. Their spreads were 6.0, 15.7, 8.4, and 49.3 percentage points for BTC, ETH, Solana, and XRP respectively. All abstained for insufficient admissible evidence, and the isolated position count was zero.

## Open verification

- Live market coverage and spreads are time-specific. Runtime continuity over a week and settlement/PnL are unverified. The quotes do not establish profitability, calibrated probabilities, or reliable weekly coverage.
- Public market access from the host does not establish authenticated venue execution eligibility. Trust Wallet connection and any real execution require separate work and verification after the Demo evaluation.

[Limitless order books](https://docs.limitless.exchange/api-reference/trading/orderbook)
[Limitless venue fees](https://docs.limitless.exchange/developers/migrate-to-new-trading-venues)
