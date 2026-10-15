# Spot Scalp personal presets and scanner diagnostics — production release

Date: 2026-10-15. Result: completed and verified on SignalVerse and CrossVerse.
Source `88c9a1e4a871fd753062f1bebcc7b3308ca15e23`; predecessor `b493a05b61beb8fc320883eeeb96f1e6e6a34d0b`. Owner explicitly authorized deployment.

## Delivered behavior and diagnosis

The monitor now reads personal settings from the actual nested profile.options
response and accepts native/demo exchange profiles without imposing a Binance
venue. An explicitly selected owned-live venue remains scoped. Late responses
cannot overwrite another scope; a failed read retains prior same-scope data with
an unavailable notice. Missing preferences are not presented as saved defaults.

Settings offer three draft-only, explicitly saved personal templates: Low risk
retains all tools, Medium disables estimated Volume Profile gating, High also
disables Relative Volume gating. VWAP, all price styles and momentum checks stay
enabled. These labels describe relative confirmation strictness, not measured
financial risk or profitability. Existing saved profiles and accepted campaigns
are unchanged by release. Engine thresholds, capital, protection, execution and
discovery logic are preserved.

The chart and Settings display actual account-scanner scope, saved template,
timestamp, evaluated records, BUY/SELL/no-direction and Spot candidate counts,
and primary per-symbol reasons. A read-only scoped investigation found no BUY
candidates in consecutive discovery runs; the engine had not reached a purchase.
Generic Futures candidate counts and the public top-200 chart list are not Spot
entry decisions. Ordinary-token discovery precedes native Spot 5m/15m checks.
All 18 tools do not require simultaneous positive patterns: supporting price
events are deduplicated, with separate opposing evidence and enabled volume gates.
No fill history is fabricated. Presets cannot manufacture an upstream BUY.

The actual post-release read-only browser check showed 62 evaluated records,
0 BUY, 11 SELL, 51 without BUY direction, and 0 Spot candidates. The primary
reasons were 34 unavailable open-interest-history records, 27 low-turnover
records and 1 below-threshold discovery score. This remains upstream of the
personal confirmation templates; this release does not resolve missing market
data or claim that a purchase now occurs. The UI exposes the recorded reason
codes and preserves unavailable-data distinctions instead of fabricating fills.

## Validation and exact release evidence

- Integrated offline UI and predecessor tests: all 204 PASS.
- Eight new tests exercise the actual canonical engine under missing-profile,
  thin-volume and bearish fixtures, existing settings validation, scoped reads,
  cleanup and failed-read retention, status rendering and draft-only selection.
- Focused TypeScript checks and preview build PASS; shared inline CSS test PASS.
- Initial CI attempt failed an unchanged admin observer timing test under load.
  The isolated suite passed all 10 tests; the same source was rerun without
  skipping or weakening assertions.
- Attempt2 passed the Scalp/UI suites and 66 pre-cleanup steps, then failed while
  initdb created a disposable test cluster before SQL assertions (30-second
  timeout). The unchanged SQL suite passed all10 checks on three fresh offline
  clusters using bounded tmpfs. Runner scratch changed to768MiB tmpfs inside the
  same3GiB memory/2CPU limit; no assertion, timeout, network isolation or source
  changed. This validates process/session behavior, not hardware power-loss durability.
- Exact main push CI 38728087776: every 79 step PASS.
- Official preparation 38758153505; immutable artifact
  11984512051; inner SHA256 `107798acac35162b12b0b68b21ca77a4dd7e1a2674bf7b4095ac2e467a936d9d`.
- Every archived Git blob/mode independently verified. Exact 24-file source
  delta and reversible predecessor projections validated before approval.
- Consistent private PostgreSQL/SQLite backup and cold restore completed before
  exact-digest approval through the unchanged installed Guard.
- Official release 38759784891; active runtimes, original Paper execution
  files and production controls verified. No production schema migration.
- Both public manifests/modules and native SignalVerse assets match release.
- Actual authenticated CrossVerse presets and diagnostics are styled and visible;
  saved preferences remain unchanged. All five temporary JIT registrations and
  all four distinct task container names are absent, including failed attempts
  and the isolated SQL scratch probe.

No forced scan, account profile activation, setting save or private order test
was performed. Synthetic engine tests and deployment checks do not establish
private exchange execution or profit. The public analytical chart remains distinct
from account-scanner decisions.
