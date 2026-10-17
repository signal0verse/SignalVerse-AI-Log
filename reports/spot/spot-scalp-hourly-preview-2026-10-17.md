# Shared Scalp hourly confirmation and scenario previews — 2026-10-17

The independent five-minute Spot Scalp engine now has explicit risk-specific
hourly admission for every asset on both SignalVerse and CrossVerse. The same
policy applies to prospective entries in scenarios one through four; there is
no symbol-specific exception.

Low risk requires full hourly confirmation. Medium also accepts neutral context
with a positive component. High additionally permits a bounded opposing pullback;
strong opposition, flat or invalid evidence still blocks. Canonical five-minute
LONG and valid fifteen-minute confirmation, liquidity, score, costs, depth, funds,
permissions and execution holds remain independent requirements. Old preferences
are unchanged until a preset is explicitly selected and saved.

Following the first confirmed purchase of each preceding scenario, normal engine
reconciliation can analyze its immediately following scenario, through scenario
four. The separately stored provisional preview shows its time, actual blockers,
depth and engine-supplied conditional levels when available. It can exist while
entry is blocked. It cannot create a cycle, reserve funds, charge credit or submit
orders. Four completed previous ladders and fresh final checks remain mandatory
for actual advancement. Accepted campaign settings and prices stay unchanged.

Both database namespaces recompute hourly admission from recorded evidence and
validate the current profile/run policy. The additive migration changes no user
rows. Native persistence compares owner, mode, metadata and revision; the internal
demo uses its existing version-checked state. Missing/stale previews are explicit.
Settings and account previews support all seven existing interface languages.

Verification: 642 integrated checks, 382 checks in a process-owned
disposable PostgreSQL cluster, 57 additional focused SQL checks, 12 policy/preview checks and 57 engine/data/
replay/tool checks passed. Scoped strict TypeScript, the shared terminal build,
Paper packaging and Persian UI inspection passed. The final compatibility/RTL refinements passed 62 focused functional/rendering/scope checks and 36 committed-source scope checks. API checks retain their existing diagnostics (28 for ES2022 and 33 for the retained ES2020 target), with zero additions. Closed successor
checks retain the complete preceding source and assertions.

This report describes local implementation and verification. Executable changes
have not been pushed or deployed. No live account preferences were saved, scans forced,
orders placed or production migration run. Release still requires official CI,
immutable artifact, private backup/restore rehearsal, migration, independent Guard
and verification of every service and both public origins.

This summary includes no account identifiers, positions, prices, balances,
credentials, private observations or database artifacts.
