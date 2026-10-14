# Compact Spot navigation and separate history — 2026-10-15

Status: DEPLOYED_AND_VERIFIED.

The owner requested the compact navigation used by the independent Scalp workspace
across Standard Spot and the classic Auto Scanner, and a History category with
deleted setups separate from completed cycles. Large tutorial, accounting and
scanner settings blocks no longer crowd the main trading list. Existing tutorials
share Education; each source has its own Accounting and History pages. Classic
scanner controls are in Settings, while a compact original status/warning strip
remains on the workspace. Technical Scalp stays a separate project.

The keyed classic scanner remains mounted while hidden, preserving unsaved options,
in-flight commands and unknown-result holds. Browser review changed a synthetic
draft, navigated through Education and back, and confirmed it remained. No save,
start, order or live financial button was used. Its original props and all action
callbacks remain unchanged. API navigation uses existing host/account callbacks.

History is read-only. Only explicit paperDeleted markers identify deleted setups;
positive safe recorded cycle counts identify completed history. Counts represent
cycles, not setup rows. Current snapshot wins duplicate IDs. Existing scoped,
authenticated GET history is identity-validated, abortable and protected against
late unmounted replies; completed details admit CLOSED records only. A target label
requires a valid recorded target sell and does not assert causal closure. Open
orders, price touches, malformed or conflicting simultaneous fills cannot become
target evidence. Deleted setups with holdings retain original management.

Limitations: history displays records returned by existing readers. Unavailable
older deleted records are not reconstructed. The existing latest-50 history bound
remains visible. Demo/Real, account/principal, project and source separation remain;
digits are Latin and dates Gregorian across seven languages. No financial data is
invented. The existing read-only mode restrictions are retained.

Local validation: 17 actual-module/transport/preservation cases plus 22 exact-scope
negative cases passed; the existing view entry passed all 85 assertions. Full
terminal build passed. Frontend and affected API compiler comparison introduced
zero diagnostics relative to the deployed baseline; inherited diagnostics remain.
The initial history type cast was corrected to the actual shared setup type.
One preview fixture initially omitted original scanner allocation arrays; only
that synthetic fixture was corrected. No production engine repair was hidden in
this UI change. Browser reviewed compact source navigation, separate Settings,
Education, draft preservation and completed history with synthetic blocked writes.

Source `e084f4d14bb16b83a2beb61807b5a226ba4c7056` is published to signal0verse/signalverse-main main and retained
branch codex/spot-compact-navigation-20261015. Exact main CI
[38607441695](https://github.com/signal0verse/signalverse-main/actions/runs/38607441695)
passed all 79 steps. Immutable artifact preparation
[38618877874](https://github.com/signal0verse/signalverse-main/actions/runs/38618877874)
passed; every Git blob and mode matched. Archive SHA-256:
`ada7e8e04cf12707f45f41f78c90219b845132372134884b34a6b1ea2db073f1`.

Independent root audit compared the complete predecessor archive and exactly
19 changed files, 6 new files and 13 complete UTF-16 reversals. Independent AST
inspection preserved App code outside the two reviewed panels, financial callbacks,
setup card action bodies and original scanner props. api/copytrade.ts and every other engine,
storage, strategy and workflow file are unchanged; api/analyze.ts changes only
the floating-help description. Private consistent backups and cold restore passed.
One-use approval bound the exact archive with UI_ONLY_NO_MIGRATION. Official OIDC
release [38620233527](https://github.com/signal0verse/signalverse-main/actions/runs/38620233527)
passed. Core/owned adapter/Admin run this source. Paper retains its original release
and provenance; all 13 execution files match an isolated build of published source.
Runtime/control checks, both hosts' shared manifest/assets and native homepage
JavaScript/CSS matched. All three temporary runners and containers were removed.

No profile activation, real exchange order/test, forced analysis, account/hold
mutation, database migration, strategy/risk/fee/credit change or paid hosted Actions
was performed. No private account identifiers, assets, transaction amounts, order
IDs, credentials or snapshots appear in this report. Synthetic UI checks and
healthy runtimes do not prove private funded execution or profitability. Reloading
the page adopts the published navigation and History grouping.
