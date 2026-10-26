# Native MEXC existing campaign recovery — confirmed LIMIT orders

## Metadata

- Date: 2026-10-26 UTC
- Module: Native Telegram ordinary/classic MEXC Spot, official @SignalVerse_AI_bot
- Operation: Explicit owner-requested recovery of the existing rejected attempt
- Verified executable during recovery: 2995922a2a4ab264f1356a93de0c39c6ba6ef0fb
- Documentation branch: codex/native-mexc-cake-recovery-20261026
- Documentation commit: 932446340739943e0f3e761283a9078023026c4e
- Shared source base: 623225675adaa102b05924d28a506514f772777d; preserved for the other chat's ongoing release
- Application code/deployment changes in this recovery: none

## Problem and evidence

The prior native LIMIT release correctly preserved legacy execution claims. While
that release's CI was running, the old MARKET path created a claim with a
36-character client ID. MEXC explicitly rejected it as outside its accepted
identifier range. Both recorded attempts generated the same invalid ID because
the old formatter truncated the attempt suffix. That legacy row consequently
kept this already accepted campaign out of the new LIMIT family.

The owner explicitly requested fixing this remaining existing-campaign problem.
Before mutation, signed read-only MEXC lookup of the exact prior identity returned
order-not-found. Complete bounded order and trade history from before campaign
creation through the observation, plus current open orders, were empty. The
account was connected and could trade. All four unchanged accepted order sizes
passed the deployed adapter's actual venue rules, with sufficient free quote
funds. These were GET-only checks, not test orders.

API reference: [MEXC Spot v3 order lookup and history](https://mexcdevelop.github.io/apidocs/spot_v3_en/#query-order).

## Recovery performed

Created a fresh consistent private PostgreSQL backup and restored it into an
isolated disk-backed PostgreSQL 17 cluster. Verified all 145 relation counts and
the complete catalog, RLS, owners, ACLs, indexes, functions and triggers; retained
the original six CHECK parser roundtrips and two equivalent owner ACL checks.
Both SQLite snapshots passed integrity/compressed-byte verification. The temporary
restore cluster was stopped and removed. No production schema change occurred.

The exact recovery transaction passed 26 synthetic PostgreSQL 17 cases, including
two concurrent callers with exactly one winner. It rejects missing/unknown venue
proof, CLAIMED/FILLED/permanent states, any recorded order/fill, a valid or different
client ID, a different attempt count, stale accepted levels, foreign owner/venue,
Demo/technical scope, inactive/manual setup, close request and competing orders,
claims or campaigns. The namespace setup and SQL-parenthesis failures encountered
during rehearsal were corrected before any production write; their logs remain.

The operator rechecked the fresh backup, exact tested SQL hash, unchanged controls
and source, acquired the existing deployment coordination lock, and used a natural
idle scheduler window. A fresh signed venue reconciliation again confirmed no
old order. The original complete claim and supporting evidence were fsynced into
private root-owned archives before the serializable transaction removed exactly
that one definitively rejected row with exact-snapshot/CAS checks.

The accepted campaign and setup remained identical: no level, allocation, capital,
credit, settings, profile or scenario replacement. No UNKNOWN or filled hold was
cleared. Existing timers and all 22 control fingerprints remained unchanged. There
was no forced scheduler/analysis request or operator exchange POST/DELETE.

## Actual result

On normal scheduler cadence, the already deployed engine created all four LIMIT
BUY orders for the original accepted campaign. Signed MEXC GETs matched each
application-created order by identity, side, type, accepted rounded price and
quantity. A later observation after another natural tick found the same four
identities, no duplicate buy journal, and no recreated legacy claim.

- Confirmed LIMIT BUY orders: 4, one per original ladder
- Observed exchange states at the final check: NEW
- Active executable during verification: 2995922a2a4ab264f1356a93de0c39c6ba6ef0fb
- Operator-submitted exchange orders: 0
- Production mutation by recovery: one rejected legacy claim archived/removed
- Existing campaign/setup/credit/settings mutations by recovery: 0
- Runtime deploy/restart, forced analysis or forced cron: 0

The earlier report accurately recorded this campaign as unresolved at that time.
This later recovery resolves that specific limitation. Exchange confirmation is
separate from mock tests and service health; no profitability or future-fill claim
is made. Accepted orders can subsequently fill, cancel or expire normally.

## Publication and remaining boundaries

No general automatic claim-clearing exception was added. Other legacy campaigns,
uncertain submissions and filled history keep their existing protections. Original
exchange order identities and holds must be reconciled before any future recovery;
neither a timeout nor an empty app display establishes absence of an order.
The archived rejected claim is retained as audit evidence. Do not blindly put it
back into an active campaign once LIMIT journals exist; mixed execution families
would block reconciliation. Preserve the current order ledger and protection.

Both documentation scope checks passed. Documentation and exact manifest metadata
were published on the separate branch
above, preserving the other chat's main commit and CI/artifact identity. Runtime,
tests, workflows and financial code bytes were not changed by this recovery.
Private account identifiers, balances, order identities, credentials and backup
contents are excluded from this public report. Synthetic clusters were removed;
failure logs, private snapshots and recovery proofs remain available privately.
