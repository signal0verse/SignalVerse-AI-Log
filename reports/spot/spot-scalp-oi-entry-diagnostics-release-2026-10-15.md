# Spot Scalp observed OI history and actual entry vetoes — production release

Date (UTC): 2026-10-15. Result: completed and verified on SignalVerse and CrossVerse.
Source `a5d8c0f03cd626d2eb74195e095814092e4dcf7c`; predecessor `88c9a1e4a871fd753062f1bebcc7b3308ca15e23`. Existing owner authorization includes publication and deployment.

## Diagnosis and correction

The prior UI promoted the informational OI_HISTORY_UNAVAILABLE note ahead of
actual rejection conditions. The initial read-only audit at 2026-10-15 15:33:33 UTC
had 62 evaluations: 27 primarily low turnover, 24 below-minimum score, and 11 SHORT.
None reached a Spot BUY candidate. The previous release report's OI-first counts
reflected that UI prioritization error; they were not the engine's hard vetoes.
The subsequent 16:05:44 UTC scan had 54 evaluations: 29 below-minimum scores,
23 low turnover, one high-volatility rejection and one wide spread.
The scanner advanced normally without a recorded runtime error.

MEXC provides current contract OI through holdVol and contractSize but does not
list a historical-OI REST route in its official public market catalog. The native
current USD normalization is retained. Independent technical Scalp now reads
three prior, same-owner/mode/venue/project snapshots around 1h, 4h and 24h, at or
before the target with the existing 30-minute tolerance. The original canonical
positioning calculation consumes those recorded observations. New runs preserve
raw current OI values and timestamps. Earlier recorded rounded USD metrics are
explicitly identified as observations, never represented as venue history.
Binance and Gate keep their original historical endpoints unchanged.

Reads retain native/owned tenant scope; Paper retains both partner and subject.
Future, stale, foreign, duplicate-conflicting and nonfinite samples are rejected.
Gaps stay missing; new accounts warm up through normal scheduled scans. No
interpolation, paid provider, foreign-venue substitute or fabricated history is used.
Optional history-read failure preserves current market evidence. Available OI
history affects the existing score/confidence; missing history alone is not a veto.

The report now prioritizes actual blockers, SHORT direction, automatic quality
and final Spot admission. Per-symbol expanded evidence shows saved buy score and
minimum, buy-minus-sell edge and minimum, turnover, current OI, 4h regime, 1h buy
confirmation, buy-side blockers, history source and 1h/4h/24h changes. Optional
data notes are separate. Older runs show unavailable side scores rather than 0.
Native Spot-only evaluations show their own decision reasons and never display
Futures score/OI thresholds. Seven locales retain Latin digits and Gregorian UTC
timestamps.

No threshold, risk preset, capital, balance, protection, durable hold or execution
policy was weakened. Classic Spot remains separate and unchanged. Market-cap200
is a universe filter; the discovery stage precedes native Spot5m/15m checks.
Candidate counts are not fills or private exchange execution evidence.

## Post-release observed scheduled scan

At `2026-10-15T18:38:35.798000+00:00`, the existing scoped scanner recorded 58
evaluations and 0 Spot candidates. Actual primary reason counts:
`{"LOW_TURNOVER": 23, "REGIME_4H_RANGE": 3, "REGIME_HIGH_VOLATILITY": 1, "SCORE_BELOW_MINIMUM": 31}`.
Observed-history coverage: `{"1h": 52, "24h": 54, "4h": 58, "withHistory": 58}`.
The reader reports OBSERVED_SCANS and retains 58 raw OI
snapshots. Saved account settings are byte-fingerprint unchanged. No forced scan,
save, activation or order was used to obtain this acceptance evidence.

Saved discovery thresholds: buy score >= 40,
buy-minus-sell base-score edge >= 20, 24h turnover
>= USD 10,000,000, and current OI
>= USD 5,000,000. Meeting these numeric
thresholds does not override regime, confirmation, spread or quality vetoes.

| Symbol | Primary reason | Buy score | Buy−sell edge | 24h turnover USD | 4h regime | 1h buy confirmation |
|---|---|---:|---:|---:|---|---|
| BTC | SCORE_BELOW_MINIMUM | 6 | 6 | 4,295,032,738 | RANGE | CONFIRMS |
| ETH | SCORE_BELOW_MINIMUM | 7 | 7 | 2,484,916,053 | TRANSITION | CONFIRMS |
| INJ | REGIME_4H_RANGE | 41 | 41 | 34,731,974 | RANGE | CONFIRMS |
| RENDER | LOW_TURNOVER | 17 | 17 | 5,440,049 | RANGE | CONFIRMS |
| SOL | SCORE_BELOW_MINIMUM | 23 | 23 | 1,049,990,543 | TRANSITION | CONFIRMS |


## Verification and release

- Integrated UI, new behavior and complete predecessor chain: 239/239 PASS.
- New focused observed-history/real-core/three-venue/isolation tests: 11/11 PASS.
- Original Futures discovery: 36/36 PASS; original Paper scanner: 22/22 PASS.
- Focused strict TypeScript and all seven locale rendering checks PASS.
  Repository-wide TypeScript still reports pre-existing unrelated dependency/type
  errors; this is not presented as a globally clean type check.
- The earlier candidate run38765327717 was deliberately cancelled before activation
  after final review identified misleading Futures labels on native Spot-only
  evaluations. That display was corrected and tested; no test failed or assertion
  was skipped. The final source completed the entire CI again.
- Exact main CI [38774201603](https://github.com/signal0verse/signalverse-main/actions/runs/38774201603): all 79 steps PASS.
- Official artifact preparation 38784608740; artifact 11996209803.
  Immutable inner SHA256: `484b36b3d508470ba8214dee552c90d0ce5f4431e5798d61c071e8265e6fa58c`.
- Every archived Git blob/mode compared. Exact 21-file delta and reversible
  predecessor projection checked independently before authorization.
- Consistent private PostgreSQL/SQLite backups and cold restores completed.
  The original installed Guard approved only the exact tested SHA and digest.
- Official release [38786027268](https://github.com/signal0verse/signalverse-main/actions/runs/38786027268) PASS.
  Native, owned, admin and Paper services run the new release. Paper's changed
  files are its provenance record, packaged scanner and scoped scanner adapter;
  engine/order service/storage formats are preserved. No schema migration.
- Both origins' manifests and modules and native SignalVerse assets match.
  Actual authenticated browser diagnostics show the saved quantitative evidence.
- All four task JIT registrations and containers are absent. No paid hosted
  Actions, production settings edits or private order acceptance tests.

References: [MEXC public market catalog](https://www.mexc.com/api-docs/futures/market-endpoints),
[current contract ticker](https://www.mexc.com/api-docs/futures/market-endpoints/get-ticker-contract-market-data),
[contract size](https://www.mexc.com/api-docs/futures/market-endpoints/get-contract-info).
