# Partner admin Futures feature switches

## Metadata

- Date: 2026-10-12
- Task ID: admin-futures-access-20261012
- Module: partner terminal / admin access
- Mode: implementation, isolated tests and coordinated release
- Repository: signalverse-main; CrossVerse and supplier private repositories
- Branch: codex/admin-futures-access-20261012
- Starting core commit: 47e9c8e
- Ending core commit: ef1324e

## Objective

Add API/Futures admin categories and independent member-access switches for Auto Scanner, Personal List and automatic capital management within the scanner. OFF retains verified administrator access.

## Scope

Access/UI/transport only. Preserve native engine formulas, sizing, existing plans, credentials, trade history, manual closing, reconciliation and protective exits. No exchange order or member scanner activation is used for acceptance.

## Actions Taken

Added signed, scoped policy transport and a private durable partner policy with strict booleans, optimistic version comparison and UUID receipts. CrossVerse requires an admin session, TLS and fresh password/Google confirmation, then records credential-free audit events. Added UI categories and three independently confirmed switches. Preserved the colleague’s latest read-rate, queue, account-read-budget and active signed partner transport fixes. The new admin-only route retains its explicit framework rate budget independent of the existing transport exemption.

## Files Inspected

Core owned service/context, entry-admission helper, scheduler eligibility, shared React lists/capital controls, terminal host and closed scope/test adapters. Supplier controller/routes/core client. CrossVerse admin controller/routes/transport, admin HTML/CSS/JavaScript and operational guides/Postman examples. Deployment helpers are private local artifacts.

## Files Changed

- Core: `server/partner-copytrade/futures-access.mjs`, `service.ts`, partner context and Futures entry-admission checks; shared Futures capital/list controls and translations; closed-scope test adapters and CI gate.
- Supplier: `AdminFuturesAccessController.php`, signed core client, private routes, tests and operator docs.
- CrossVerse: `AdminFuturesAccessController.php`, private transport/routes, `admin.html`, `admin-futures.js`, admin navigation/styles and operator docs/Postman contract.

## Root Cause / Findings

CONFIRMED: prior scanner access was a fixed owner policy and did not expose persistent admin controls. Test execution caught and fixed a supplier route-name prefix mismatch. Caller-provided admin/partner fields do not grant authority. Release checks also caught a fixed-origin TLS chain-depth incompatibility after web-server reload. Verified OpenSSL depth1 fails with a chain-length error; depth3 succeeds against the existing system CA. Only the fixed Trade proxy depth is corrected; verification, CA, SNI, hostname, origin and removed user headers remain unchanged. See the [official Nginx directive](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_ssl_verify_depth).

## Implementation

Defaults preserve owner-only scanner and existing personal/automatic configuration. Policies affect old-client commands, scheduled new analysis and fresh entry. An already running request reads updated policy again before final admission. Disabling automatic capital pauses new work for automatic scanner profiles until the member explicitly saves manual settings or access returns; existing position amounts are never changed.

## Tests Executed

- Core entry points recorded in `core-targeted-tests.json`: admin-futures-access, owned-scanner-access, partner-discovery, futures-entry-freshness, closed-scope successors, futures-capital-policy/entry, trade-continuity, owned-futures-entry and scheduler reliability: 304 PASS.
- `php8.3 artisan test --filter=AdminFuturesTest|AdminTradeTest|OperationsTest|ExchangeAccountTest|AuthenticatedThrottleOrderTest` in a restricted disposable database: 30 PASS / 318 assertions.
- `php8.3 artisan test --filter=SignalVerseAdminFuturesTest|SignalVerseAdminExchangeTest|SignalVerseExchangeAccountTest|SignalVerseDemoAccountTest|SignalVerseLiveCopytradeTest` in a restricted disposable database: 31 PASS / 304 assertions, including signed admin-policy rate enforcement.
- Admin desktop/mobile: category navigation, three independent switches, confirmation before write, no overflow or JavaScript errors: PASS.
- Existing host read-rate/queue and shared release regressions: PASS.
- Full Production CI: PASS ([run38162215640](https://github.com/signal0verse/signalverse-main/actions/runs/38162215640)). Immutable artifact provenance/digest and 2187 Git file comparisons: PASS. Official Guard release: PASS ([run38165583014](https://github.com/signal0verse/signalverse-main/actions/runs/38165583014)). Client/supplier final live acceptance: PASS. Guest401; exact served admin-asset hashes; signed read-only policy receipt; unchanged shared manifest; actual admin browser three enabled switches with expected saved state and no horizontal overflow. No production toggle or provider order was performed.

## Build Result

`node scripts/build-partner-copytrade.mjs` and `npm run build:terminal:full`: PASS. Full official CI build and exact-artifact release: PASS. Final client code matches the tested API/admin file bytes exactly; added deployment notes and verified proxy configuration do not change application bytes.

## Git Status

Core ef1324e, CrossVerse c9891ef (includes the colleague’s account-read-limit release), supplier 9543106 published without force push. Unrelated generated artifacts remain unstaged.

## Commit

- Core: `ef1324ef13351463e016c0b3fcfc835ab4850bb3`
- CrossVerse: `c9891ef16fa24af57454242243b3867bdf580af2`
- Supplier: `95431064f7d25ee77ae71431be8ae168aa95ad1a`

## Remaining Issues

NONE for the requested feature. A proposed removal of the new admin-only policy budget was rejected by automatic approval review as a security weakening without explicit authorization; the dedicated 20/minute admin budget is retained. Existing signed trading transport remains unchanged.

## Risks / Limitations

Tests use synthetic records and disposable databases. Live acceptance uses signed read-only policy/health and browser inspection, without placing orders or toggling member trading profiles. These switches never grant a plan or exchange execution permission.

## Recommended Next Step

Use the admin controls to manage member feature availability; eligible members still select and save their own trading settings.
