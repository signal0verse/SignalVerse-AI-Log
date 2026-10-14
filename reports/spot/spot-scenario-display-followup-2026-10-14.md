# Spot scenario display follow-up — 2026-10-14

Status: INVESTIGATION_OPEN; no new source or runtime activation.

The owner reports a second scenario appearing and subsequently disappearing
from the UI. Follow-up clarification identifies the application display, rather
than a confirmed exchange cancellation, as the observed surface.

Read-only diagnosis was restricted to previously verified owned setup references
and the explicitly supplied native ownership scope. PostgreSQL transactions were
READ ONLY with statement timeouts; Paper SQLite used mode=ro and query_only.
The persisted cycles, decisions and order journals in the verified scope did not
contain a matching accepted second-scenario purchase/cancellation. That does not
disprove the observed UI event or identify its cause. Its exact event reference
or occurrence time is still needed to connect the observation to a transaction.

Active Core source remains145eef80e25ec1536b6faf582cf025a905cfd8e2. The previously
released no-fill retry repair remains active. No profiles, settings, holds,
cycles, balances, keys or orders were changed during this follow-up.

Independent offline reproduction extracts the actual loadSetups callback from
SpotCopyTradePanel. Two synthetic successful list responses arrive out of order:
the newer response contains two scenarios, then the older response overwrites it
with one. This confirms a UI response-order race in current source. It does not
confirm that this race caused the owner's specific incident. The reproduction
uses no network, production bootstrap, credentials, private records or trades.
No patch or new CI/deployment is claimed for this newly identified display race.

Funded transaction acceptance requires the owner to perform the final financial
action. No forced scenario activation, real test purchase, private exchange order
request, admission bypass or retry of an uncertain execution was performed.
An exchange-confirmed purchase alone would not rule out a later display or
cancellation defect; transaction history and subsequent UI refresh must agree.

Private evidence remains local. This public report includes no account, user,
setup/cycle identifiers, asset names, order IDs, amounts, credentials or snapshots.
Next work: reproduce the precise reported event and fix the confirmed display
race within the repository's existing source, CI and guarded-release boundaries.
