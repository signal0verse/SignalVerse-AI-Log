# Spot list refresh ordering repair — 2026-10-15

Status: DEPLOYED_AND_VERIFIED.

Overlapping Spot list requests could complete in reverse order. The older
successful reply then replaced newer scenarios, confirmed fills and archived
history. An actual-source synthetic reproduction demonstrated this defect;
the old deployed callback fails exactly with one scenario replacing two.
This establishes a display race, not the cause of a particular private incident.

The panel now holds one accepted current/archive snapshot and accepts only the
latest live request's complete HTTP-success list for its current session, mode,
principal and venue scope. Delayed success/denial/loading updates and unmounted
callbacks are ignored. Switching scope hides old rows immediately; keyed owned
account remounts retain their existing isolation. Failed/malformed same-scope
refreshes preserve valid prior data. Genuine fresh empty/closed results remain
authoritative. No rows, fills or history are synthesized or forcibly merged.

The GET endpoint, authentication, existing actions, financial calculations,
scenario/order authority, scanner gates, fees, credit, plan policies and stored
records are unchanged. API change is floating-help text only. No real scenario
activation, private exchange order/test, account/profile/hold mutation, forced
analysis, database migration, workflow edit or paid hosted Actions was performed.

Validation:21 actual-callback functional cases and14 exact-scope negative checks
PASS; existing11 view assertions plus these35 yield46PASS. The prior retry scope's
16 assertions PASS. The original source deliberately fails the one reversed-reply
test; repaired source passes. Type comparison adds zero frontend/API diagnostics.
Initial local scope verification failed because the external snapshot generator
used code-point offsets rather than JavaScript UTF-16 offsets; complete reversible
projections were corrected and strict original assertions retained. Failures are
preserved as evidence, not treated as release approval.

Source `dcac00680b80131f63fb7b914507ed2cb83dcec3` is published to signal0verse/signalverse-main main and retained
feature branch codex/spot-list-refresh-order-20261014. Exact main CI
[38581647017](https://github.com/signal0verse/signalverse-main/actions/runs/38581647017)
passed all79 steps. Official artifact preparation
[38593120551](https://github.com/signal0verse/signalverse-main/actions/runs/38593120551)
passed. Every Git blob/mode matched exact source with no repackaging. Archive
SHA-256: `2df49e77f377f54d8efcc73fcf542dccce69af6d3147477cf09ade0a63bc5d66`.

Private consistent backups/cold restores passed. Independent Root review compares
the complete prior/current archive, exactly11 changed files and five new files,
fixed App patches and help-only insertion. Its separate AST review proves all
other top-level App source and original panel action/form/policy/rendering bodies
unchanged. A fresh one-use approval binds the exact immutable archive; no migration.
Official OIDC release
[38595115359](https://github.com/signal0verse/signalverse-main/actions/runs/38595115359)
passed. Core/owned adapter/Admin use new source; Paper retains its original release
and provenance. All13 Paper execution files match an isolated build from published
source. Runtime/control checks, both-site shared manifests/asset bytes and native
homepage JavaScript/CSS bytes passed. Temporary runners/containers are absent.

No private account or transaction data, identifiers, asset names, amounts, keys,
order IDs or snapshots appear in this report. Synthetic tests and healthy services
are not proof of funded private execution or profitability. The user's historical
display event has not been tied to a confirmed transaction/cancellation; this fix
prevents the independently reproduced response-order defect. Reloading the page
loads the published UI. Original enabled-automation/qualified-analysis rules still
govern new scenarios; deployment does not force or enable them.
