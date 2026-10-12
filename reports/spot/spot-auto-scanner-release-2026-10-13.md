# Opt-in Spot Auto Scanner and independent lists

## Metadata and conclusion

Date 2026-10-13 (Asia/Kuala_Lumpur); work began2026-10-12. Owner-authorized implementation and coordinated release for
native SignalVerse and the shared CrossVerse terminal, Spot Demo and real.
**Deployed and verified on both sites.** All four trading services run the exact reviewed core source.
These tests establish behavior and preservation boundaries, not profitability or
private exchange execution. No live customer scanner was enabled as a test.

## Changes

Manual and scanner lists create their own setups and have independent capacities.
The scanner has a target of1–10; every active authorized Spot plan can access it.
Opening a tab or reading state never enables a profile. Save and Start is explicit.
Same owner, mode, exchange and symbol with active manual/open/uncertain work
blocks automatic duplication and shows a localized explanation. Manual BTC at
Binance does not block automatic BTC at MEXC. SQL uniqueness now includes venue;
original rows and ownership remain intact. Paper manual uses the existing Binance
reference, while its scanner records the confirmation venue.

The existing Futures public-data collector, V3 candidate ranking and AUTO quality
rules are reused for LONG discovery. Rank50/100/200, default100; verified identities,
stablecoin exclusion and actual Spot liquidity checks. Futures funding/OI are
confirmation data, never Spot funding or an independent entry/SL/TP generator.
The existing Spot scenario, ladder, allocation, credit, funding, private execution
and exit engine remains authoritative. A rank or passed quality filter does not
guarantee reduced risk or a profit.

Source classification is server-only. Versioned profiles, owner-scoped runs,
latest-data SQL admission and immutable accepted-cycle snapshots enforce the
boundary. Five-minute server discovery continues while the page is closed.
Missing evidence cannot authorize new work or guess retirement. Open cycles and
nonterminal/uncertain native orders remain managed. Stop/expiry blocks following
analyses, scenarios and cycles; permanent user cancellation retains its cooldown.
Settings apply to new setups, not resizing open allocations.

UI adds separate tabs, preserved drafts/data and translated guidance in seven
languages. PHP keeps signed ownership and active-plan leases; only a confirmed
explicit Paper Start enrolls that member for background lease refresh. No new
identity, purchase, financial history, credential or Futures admin policy changes.

## Verification

- Final independent-list, Native adapter, Paper persistence and closed scope:
  Final official suite:78 tests pass; none fail. Covers same/different venue, independent capacity, concurrent
  manual creation, source forgery, revision/expiry races, holds and cancellation.
- Disposable PostgreSQL:14 checks pass, including final admission, venue
  uniqueness, RLS, immutable snapshots, holds and concurrent disable.
- Type regression: zero introduced diagnostics; legacy Profit Protection gate frontend78 baseline /72 current,
  API30 /30. All inherited CI gates retained.
- Exact CrossVerse PHP archive:31 tests /161 assertions, guide and read-only
  Postman validators pass in a restricted private test schema.
- Exact supplier PHP archive:27 tests /220 assertions pass in a separate restricted
  schema. No production environment loaded by these acceptance tests.
- Private consistent PostgreSQL/SQLite backups and cold restore of actual schema
  pass. Legacy-row fingerprints remain unchanged under the reviewed migration.
  The cold restore loads no application workers, keys or exchange engine.
- Local actual-component mock preview verifies the translated duplicate message;
  prior mobile/RTL checks verify no horizontal overflow. Mock Start is not a live
  profile activation. Pre-existing confirmed tests of collector/quality parity,
  retained source/exit and original execution mutex are preserved in official CI.

## Source / operator handoff

Core:f447bdc1cc6fed2652bad7123b17d9dc5b658b86. Client:
93084e290711b79be159370b278d717c4dacfc9d. Supplier:
f39837edc25d11233b0f233a6d7ff97bf7ebac8b. Fast-forward publication only.

Core changes: api/_shared/spot-auto-scanner*.ts, migrations/spot_auto_scanner.sql,
annotated api/copytrade.ts source adapters, src/app/SpotAutoScanner.tsx,
src/app/spot-scanner-i18n.ts, src/app/App.tsx tabs/venue check,
server/partner-paper/{scanner,store,http,service,market-ports}.mjs,
server/partner-copytrade/{contract.mjs,service.ts}, scoped transports, build scripts,
independent job, exact successor gates and dated strategy/help/handoff.
CrossVerse runtime change: api/app/Http/Controllers/CrossVerse/PaperDemoController.php.
Supplier runtime change: app/Http/Controllers/SignalVerse/PaperDemoController.php.
Tests/docs accompany both; supplier full-source and changed-file ZIPs contain
tracked source only and stay in the owner's workspace, not this public report.

Isolated validation commands and installed-PG prerequisite:

```sh
node scripts/build-partner-paper-engine.mjs
node --test scripts/spot-auto-scanner-test.mjs scripts/spot-auto-scanner-native-test.mjs scripts/spot-auto-scanner-discovery-test.mjs scripts/spot-auto-scanner-scope-test.mjs scripts/spot-auto-scanner-job-test.mjs
SPOT_SCANNER_TEST_PG_BIN="$(pg_config --bindir)" node scripts/spot-auto-scanner-sql-test.mjs
node scripts/partner-spot-limit-scope-test.mjs --types
```

PHP acceptance requires the fresh restricted testing environment, blocked external
providers and isolated queue/cache/storage described by the repository runbook;
never run these suites against the normal database. No signed production scanner
commands or private orders are an acceptance requirement.


## Release and runtime proof

Final main-push CI [38269507439](https://github.com/signal0verse/signalverse-main/actions/runs/38269507439) passes every retained gate. Preparation
[38273884564](https://github.com/signal0verse/signalverse-main/actions/runs/38273884564), retained artifact11758675591;
inner archive SHA-256797fd4cbe2a12e7a37c15004b2bf26d339a012f33721fcd3c0cc284fb62ae838.
Independent verification compared all2224 Git blobs and modes with the commit.
Guard-bound deployment [38274579840](https://github.com/signal0verse/signalverse-main/actions/runs/38274579840) succeeded after the checked migration and artifact-specific one-use authorization.

Native, owned copy-trading, admin and existing Paper service are active with the
expected release and process directories. The original runtime, authorization,
proxy and cohort controls remain intact. Paper packaging provenance matches the
active canonical API; existing secrets, service unit and SQLite state are preserved.
Development build tools were installed only in a separate exact-source checkout,
using the locked package file and disabled install scripts. Live dependencies were
not altered. The independent Spot job preserves every existing job byte outside
its reviewed block. Profiles were not enabled by the operator.

Client and supplier PHP controllers were independently deployed with exact-source
test evidence, retained rollback, unchanged config/engine/frontend and guest
denials. Both public manifests name the final core SHA. Both sites serve identical
terminal.js hash3fa33461276debe0f93adf08f80e229291fa80b364a13c85eaeaff90d5268d6b
and public-source.js hashe19140dfccb3464ff71a1a36cefc212c3c205428b1ab5c0bb02eeeb16f0c6eaf.
Unsupported terminal HTML paths remain404. The public projection keeps private
engine metadata private; engine hashes and legacy/scanner markers were verified
separately in their actual native and owned compiled modules.

An initial automatic approval review rejected migration/approval while artifact
folder validation had failed. The exact retained subfolder was then verified,
successful provenance and full-tree proof recorded, and the same guarded action
was accepted on retry. No control or approval requirement was bypassed.

All seven additional SQL groups passed in isolated private-network, process-owned
temporary PostgreSQL clusters: durable claims10 checks, Spot LIMIT12, settlement46,
protection37, re-entry61, Whale14 groups and admin grants. No existing database or
production environment was accepted. Scheduler compatibility retains the exact
historical assertions against the validated predecessor and separately verifies
the current shell's off/on/failure independence.55 symbol/scope and57 scheduler/
scope checks also pass. No safety assertion or compiler gate was relaxed.

## Limits and use

Refresh an existing open site once to load the new shared asset. Spot shows Manual
list and Auto Scanner. Select target/rank/capital settings and explicitly Save and
Start if wanted; runtime access does not itself enable a profile. A manual coin at
the same exchange is explained and skipped, rather than moved/deleted. Different
exchanges may use the same coin. Market-data outages, missing identity/liquidity,
plan/credit/balance/min-order or existing execution guards may deny candidates.
Three supported confirmation venues: Binance, MEXC, Gate. No new Futures Demo.
These checks prove deployment and behavior, not private account order execution,
lower market risk or profitability. No live order or customer profile activation
was used as acceptance evidence.
