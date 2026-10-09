# Trade connection and chart usability — 2026-10-09

Temporary connection errors no longer replace the Trade screen or close an open
chart. Notices appear above the current view. Drafts and view settings remain
available, and failed chart refreshes retain previously validated candles with
their last-received time. Mobile notice wrapping and selected-language guidance
were checked.

Connection renewal uses the authenticated issuer's clock and a fresh read
correlation, with a bounded lifetime. Local editing continues while renewal is
pending; financial operations are not queued or automatically replayed on
reconnection. Genuine logout and account changes still clear previous private
display state.

Targeted offline tests, isolated API tests, existing compatibility gates and the
complete release checks passed. Desktop and mobile browser tests used synthetic
data and no real exchange orders. The fixes were committed, published to the
project repositories and deployed. Post-deployment file and health verification
passed. The authenticated Trade page remained available beyond its first renewal
window; selecting Trade again kept the existing view. The user's existing tab
was not reloaded for verification.

Retained data can be stale during an outage and is labelled accordingly. Financial
actions require valid server authorization. Test success does not establish
private-account execution or profitability. No real order was opened, closed,
cancelled or resubmitted to test this change.

Exact release identifiers, artifact digests and internal infrastructure evidence
are retained locally and intentionally omitted from this public note.
