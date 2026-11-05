# CrossVerse Trade erasure and separation — actual progress checkpoint

Date: 2026-11-05. Owner explicitly authorized removal of CrossVerse Trade data
and Trade archives, complete disconnection, unchanged-test CI and guarded
deployment. Forex must remain intact. **Progress checkpoint, not final acceptance.**

## Actual operator changes and erasure

- CrossVerse's dedicated Trade/Paper lease timers and services are disabled and
  inactive. Its nine old/V3 integration flags are false and the corresponding
  endpoint/key/license fields are empty. Every unrelated environment line was
  preserved. Shared Trade assets and member Trade API prefixes return410;
  ordinary account and health requests return200.
- Dedicated Core CrossVerse engines, PostgREST, Paper and the signal-only queue
  worker are stopped/disabled. Paper backup/market timers are retired. B2B and
  shared-asset ingress return410. Native application/admin/observer PIDs, starts,
  restart counts, environment and main vhost were verified unchanged at cutover.
- CrossVerse live tables: two live owners and three Paper memberships removed;
  two exact signing secrets, one Trade watchlist,706 dedicated external/secret
  events and two Trade audit events removed. Unrelated accounts, payments,
  wallets, memberships, entitlements, profile fields and secrets were preserved.
- Core owned PostgreSQL:23,230 rows in36 explicitly enumerated dedicated tables
  erased atomically. Their schema, constraints and guards remain. No CASCADE,
  constraint/trigger disable or Native public-row deletion was used. Fresh checks
  before retirement found no recorded open/unclosed work or uncertain holds;
  no private exchange call or order/position action was made.
- Dedicated receipts SQLite:207 rows erased. Dedicated Paper SQLite:48,004 rows
  erased. Empty databases retain their exact original schema and file ownership;
  old WAL/journal data was removed. No Trade-data backup was created.
- Supplier's sole verified CrossVerse partner: eight dedicated tables emptied,
  six associated encrypted secrets and733 secret-event records removed. All
  other secret rows and unrelated user/payment/wallet records were preserved.

## Archives actually processed

-73 mixed CrossVerse SQL archives reviewed;34 changed. Historical copies of40
  signing-secret rows,4,806 Trade events,32 live owners,41 Paper members,16
  watchlists and12 Trade audit records removed. These are aggregate archive
  copies, not counts of unique current customers. Unrelated row tokens and all
  schema statements were retained. All3,319 protected Forex archive/incoming
  files were hash-identical after this operation.
-18 mixed supplier SQL archives reviewed;14 changed. Only dedicated CrossVerse
  rows and their associated secrets/events were removed. A tested lexical
  parser never executed archive SQL; it rejects unknown target syntax and proves
  unrelated statements/rows remain. Every changed archive has a privacy sidecar;
  old digests are historical evidence, not current acceptance.
-42 dedicated Paper snapshot files removed:29,858,196,370bytes. Another392
  verified Paper/receipts copies and38 empty verification sidecars removed:
  115,634,106,357bytes. All733 unrelated Native sibling backup files were retained
  without modification. No Forex file was a deletion target.
-18 CrossVerse and15 supplier/operator environment backups scrubbed:105+35
  exact retired Trade key/URL/flag occurrences cleared/disabled. Every nonTrade
  line, including Forex settings, stayed exact. No live environment was rewritten
  by this archive operation.
- Mixed PostgreSQL privacy conversion is still running:79 custom archives were
  catalogued;59 contain2,062 dedicated owned table-data entries. The official
  tool emits standard SQL retaining every other data/schema/ACL/policy/guard
  entry. Output is compressed and byte-verified before deleting its original
  mixed custom archive. These become explicitly indexed compressed SQL backups,
  rather than pretending the old custom-format digest still applies. No database
  restore or SQL execution is involved. This uses the documented
  [pg_restore script-output and use-list modes](https://www.postgresql.org/docs/17/app-pgrestore.html).
  Full completion and subsequent independent restore verification remain pending.

## Source, tests and remaining work

CrossVerse active source remains `c68b94ca00d14a30001d674abe05f5ec59978d4f`.
The unreleased PHP-boundary candidate is preserved on its original branch and
is not deployed. A separate static retirement candidate adds an account entry
without Trade/V3 menus or Trade scripts, plus narrow old Trade browser-storage
cleanup. Forex module/assets and authorization logic remain unchanged.

The new retired-layout browser program and unchanged original Forex program
passed locally with synthetic intercepted APIs. The unchanged legacy routing
program then exposed a320px hidden-menu ordering defect on the original portal
bytes. A generic two-line menu-order repair is being checked; its assertion and
every original test remain intact. A first browser launch lacked module
resolution; the existing cached Playwright dependency was subsequently selected
only in the child process. These are local Windows checks, not official Linux
CI or live UI acceptance. No private source upload/test database/systemd test
unit was used to circumvent the earlier rejected regression command.

SignalVerse source remains `c88b7b9160c0290a9e07fb3317c255c4265c8705`;
last verified Native runtime remains `c161955239f24f151fed6a2a08dfcb8bef0e04ac`.
Official CI41906932865 failed its original chart callback; no new official CI
has been started for a repaired successor. The actual setter repair, independent
release coordinator, complete source/capacity/local proof and full official CI
remain required. Every original test, expected result, compiler/SQL/build/archive
gate and resource limit remains mandatory.

**No deployment of a new Native or CrossVerse application source has occurred.**
Visible retired-layout activation, final archive sweep, independent release
backup/cold restore/readiness, retained artifact and one-use exact SHA/digest
Guard, normal deployment, actual full native chart/live-quote/history verification
and the final report are unfinished. Native PP flags, disabled canonical worker,
Forex services/relay/snapshots, strategies and financial policies were not changed.
