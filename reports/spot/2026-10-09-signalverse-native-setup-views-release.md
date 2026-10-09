# SignalVerse native Spot setup views — approved production release

Date: 2026-10-09 (owner timezone). The owner approved deployment after reviewing the native SignalVerse preview.

## Change and source integration

- Native SignalVerse Spot Demo and real panels now expose List, Icons and Full, with translated explanations and lifecycle-color, symbol and capital sorting. Default display puts profit-taking and buying first.
- Original detail children, form state, accounting, scenarios, ladders, orders/history, close controls and expiry behavior remain mounted and unchanged. Sorting operates on a copied display collection. Market/News and financial/exchange code are unchanged; no database migration is needed.
- Integrated the concurrent main connection-recovery fix from f34584656664283b4646151deacbc24bc02800fe. The exact-source successor preserves its tests and all older gates. No force push. Prior candidate 908e75737d0aa480e337153d1c933de9e6537827 is retained on codex/rollback-native-views-908e757.
- Source and deployed SHA: c25e41f9e75b3dfa7f3973ebe17f9a5fd5031916. Main was fast-forward promoted; PR 218 was closed as superseded by the integrated main candidate.

## Validation

- 109/109 targeted offline tests passed after integration, covering original controls/source preservation, display modes/locales/stable sorting, scope rejection and session recovery.
- Earlier native browser checks covered all three modes, sort options, retained unsaved demo/real drafts, original detail children, Persian RTL/mobile layout and English labels. Display changes produced no financial POST. Deliberate local save used intercepted fixture data; no exchange order.
- Existing site setup data was inspected in all three modes; draft cancellation kept saved values. No live financial control was submitted. Screenshots/account data are not included in Git or this report.
- Integrated native preview rendered successfully after rebase. Production CI for this exact main-push SHA passed: https://github.com/signal0verse/signalverse-main/actions/runs/37886951670

## Exact artifact and activation

- Preparation run: 37888814098; retained artifact ID: 11597850211.
- Inner archive SHA-256: fd67010710bef9c4055050fc81b54e04fcd71aea44de8ed306293657553c51fa. Independently reproduced from the exact local Git commit and verified against retained bytes, metadata and run/artifact provenance.
- One-use root-owned VPS approval was issued for that exact SHA/digest. Official OIDC delivery used the retained archive without repackaging or weakening the release guard.
- Release workflow succeeded: https://github.com/signal0verse/signalverse-main/actions/runs/37888937158
- Active native, partner and admin release paths and deployed marker all match c25e41f9e75b3dfa7f3973ebe17f9a5fd5031916. Four production services are active. Native/public health and admin auth/static/snapshot/database readiness passed. Local/public shared terminal manifests match the source SHA.
- Public native JS/CSS bytes exactly match the active release assets and contain the native Spot presentation selectors. This confirms the native UI assets were delivered, rather than merely publishing a partner-only page.

## Limits and rollback

This release is presentation-only. It does not assert new private-account order execution or profitability. An authenticated native Telegram session was not available for a production UI walkthrough; native behavior was checked using the actual panel in an isolated intercepted preview, current partner site data and exact served production assets. The prior active release f34584656664283b4646151deacbc24bc02800fe is retained for rollback. Existing opt-in allocation persistence must remain compatible during any rollback.