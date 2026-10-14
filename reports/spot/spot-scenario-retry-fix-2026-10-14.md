# Spot scenario retry repair — 2026-10-14

Status: DEPLOYED_AND_VERIFIED.

The owner requested repairing the next-scenario reanalysis defect and ensuring
all supported Spot exchange paths continue correctly. Native Binance LIMIT
reconciliation skipped scenario evaluation when no new buy/sell fill arrived.
A saved WAIT therefore could remain the final analysis until a different fill.

Normal unchanged ticks now retry the original next-scenario authority after
four verified full native buy orders. FILLED status, finite positive requested
size and completed executed size are mandatory; four partial buy records do not
count as full ladders. The changed-fill branch shares the completion predicate.
Pending manual close, unresolved journal orders and untracked native open orders
block new admission while original reconciliation/protection continues.

Original depth, scanner on/off and current qualifying evidence, plan, capacity,
allocation, fee/minimum order, credit, duplicate-scenario and final admission
gates remain authoritative. A WAIT is re-evaluated, never forced to OPEN. Existing
levels, targets, cash allocation, fees, compound policy, user settings and holds
are not rewritten. No AI formula, Spot stop/time exit, migration or forced tick
was introduced. Deployment does not enable any user scanner.

Actual source regression fixtures pass:27 functional cases across native
Binance, all-venue native candle Demo/MARKET paths and in-memory Paper;16 exact
source/negative checks. The old deployed source deliberately fails exactly the
unchanged-tick retry assertion (26 pass/1 fail), while the repaired source passes.
Original native LIMIT69 assertions plus all43 new tests pass. Owned LIMIT69
tests pass, including consecutive unchanged callbacks on Binance/MEXC/Gate with
no extra BUY. Existing exit boundaries are preserved. Type comparison introduced
zero frontend/API diagnostics.13 generated Paper execution files remain exactly
equal to the retained runtime, including its original source provenance.

These checks are synthetic/offline, not proof of funded private-account execution,
profitability or a missed qualifying historical trade. No user's private financial
data, identifiers, amounts, symbols, keys or order IDs are included in this report.

Source `145eef80e25ec1536b6faf582cf025a905cfd8e2` is on signal0verse/signalverse-main main. Exact main CI
[38558498410](https://github.com/signal0verse/signalverse-main/actions/runs/38558498410)
passed all79 existing steps. Earlier CI38557525421 is retained: it stopped before
npm ci because the new source verifier imported TypeScript too early. The verifier
now uses only built-in exact reversal plus complete protected API prefix/suffix
checks; no workflow order or original assertion was removed. Actual TypeScript
extraction remains in later functional tests. The original trading fix bytes
were not changed by this verifier correction.

The initial read-only runtime checker assumed deployment's intermediate Paper
directory persisted. It did not. The checker was corrected to build a comparison
package from the exact published source in separate private temporary staging;
all13 execution files and retained original provenance then passed. No deployed
source, active Paper package or user data was changed to repair the checker.

Official immutable artifact preparation
[38569858590](https://github.com/signal0verse/signalverse-main/actions/runs/38569858590)
passed. Every Git blob and file mode matched the exact source without repackaging.
Archive SHA-256: `3846f4a09f4368be9f89cf93b0f5c102babbe8a9ad5c0d609a3b1f10651e2917`.

Private consistent PostgreSQL/Paper/receipt backups and cold restores passed.
An independent Root audit compared complete retained predecessor/current archives,
all13 exact changed files/modes, five fixed native API edits and help-only insertion.
Original unrelated source/control bytes were retained; no production migration
was run. A fresh one-use approval bound the exact source/archive. Official OIDC
release [38571488576](https://github.com/signal0verse/signalverse-main/actions/runs/38571488576)
passed. Core, owned adapter and Admin use the new release; Paper remains at its
prior release with byte-identical execution, original provenance and SQLite
integrity. Runtime/control/public proofs passed on both sites. CrossVerse receives
the SignalVerse release through its existing engine/terminal adapters; no PHP host
change was necessary. Temporary bounded runners were cleaned after their jobs.

No profile activation, private exchange test order, account mutation, hold reset,
force analysis/cycle, credential change or paid hosted Actions was performed.
New scenarios still require enabled automation and a fresh qualified engine result.
