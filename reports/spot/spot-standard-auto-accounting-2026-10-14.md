# Classic Spot names and separate list accounting — 2026-10-14

Status: DEPLOYED_AND_VERIFIED_ON_BOTH_SITES

The owner requested two classic Spot list labels: Standard Spot (Persian:
اسپات استاندارد) and Spot - Auto Scanner (Persian: اسپات - اسکنر خودکار).
The former manual and automatic lists retain their existing setup actions and
scanner behavior. Titles are localized in all7 supported languages.

Accounting now appears immediately below the list selector and identifies the
selected list and Demo/Real mode. It sums only that classic source's confirmed
per-setup capital, orders, recorded profit and withdrawals, including its own
completed history. Duplicate IDs cannot inflate sums. Completed/deleted rows
retain P&L and withdrawals but no inactive spendable budget; open retained work
still contributes its actual capital snapshot. Independent technical scalp
never contributes to either classic list. Its own accounting is unchanged.

The UI uses the selected user/mode/account snapshot, not the API's account-wide
aggregate. Missing evidence is shown as unavailable, not as invented zero or a
different mode's totals. Same-scope prior reads remain retained after a failed
refresh. Existing immutable server financial records and execution rules are
unchanged. This is display accounting, not exchange wallet reconciliation.
The server-wide average holding duration is omitted because the list response
does not supply attributable closed-cycle duration for each source.

Eleven exact files changed from deployed `7c7e1c9ada3fc16ce541bea2020754de2f70298a` to `e80c41c3b7cb1fa490d66e3569a37c3ea64b41c9`. These include
presentation, pure display projection, offline fixtures, append-only documentation,
the exact scope inventory and the floating-help literal. No trading source,
schema/migration, order action, funding allocation, policy, workflow or dependency
change was made. Core engine source remains compatible with the retained Paper
release05dc525. Existing PHP adapters remain unchanged.

Verification:6 semantic projection fixtures pass, covering mixed sources,
technical exclusion, archived/deleted history, duplicate IDs, loss/withdrawal,
unknown evidence and capital identities. The fixtures are imported by the
existing project suite without removing original checks.91 focused source/authority
checks pass. API/frontend compiler comparison introduced zero diagnostics;
the shared terminal build passed. Actual built terminal tests with synthetic
read-only transports pass in all7 languages and390px mobile width, with no
horizontal overflow, outside network calls or browser errors. English digits
and Gregorian dates are retained. Synthetic fixtures are not real execution proof.

Full exact main CI [38523781725](https://github.com/signal0verse/signalverse-main/actions/runs/38523781725)
passed all79 steps. Official immutable artifact preparation
[38530719553](https://github.com/signal0verse/signalverse-main/actions/runs/38530719553)
passed; every Git blob and mode matched the exact source, without repackaging.
Archive SHA-256: `0ed238c69a15554cad5c1bf68c4c35117b1ec8a0b0a0774b068df170a8136d92`.

Private PostgreSQL/SQLite backups and cold restores passed. Independent server
comparison of retained source archives verified the exact11-file presentation
scope and unchanged protected/trading source. No production migration was run.
Fresh one-use Root approval bound the exact source/archive. Official OIDC release
[38531904644](https://github.com/signal0verse/signalverse-main/actions/runs/38531904644)
passed. Core, Partner copytrade and Admin use the new release; Paper stays at
05dc525 with exact source provenance, unchanged controls and SQLite integrity.

Both public sites expose the new source and identical terminal assets. The live
classic UI was checked by read-only list navigation: both requested labels,
accounting below the selector and accounting source change were confirmed.
No profile save/start, forced scan, account mutation, private order, cash transfer
or profitability test was performed. Temporary bounded runners were removed
after each job. No paid hosted Actions or billing changes were required.
