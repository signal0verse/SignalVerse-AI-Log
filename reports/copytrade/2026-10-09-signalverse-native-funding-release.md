# SignalVerse native real Spot/Futures funding review — approved release

Date: 2026-10-09. The owner requested native SignalVerse setup balance/fee review with a local sample preview, then explicitly approved deployment after completion.

## Delivered behavior

- Native real MEXC, Binance and Gate Spot/Futures create/edit forms show fresh available USDT, selected capital/margin, leveraged notional, remaining budgets, own/other entry fees, entry minimum, shortfall and suggested own/other exit reserves. Effective Spot equity is shown when compound/frozen budgets differ from selected principal.
- Remaining commitments are owner/product/exchange scoped and paginated. Already purchased Spot principal, exchange-locked orders and funded Futures margin are not counted twice. Pending-order entry fees and removed-setup open Futures exit estimates remain included. Compound edits use retained net profits/losses and preserve frozen scenario budgets.
- A human summary is followed by another fresh read; changed balance, rates, commitments or account identity require another confirmation. The server rechecks the submitted review key before the original setup handler. Insufficient/invalid/unknown data produces no UI save request; last-minute server changes are rejected before mutation.
- Visible selected-account pages poll every 15 seconds. Inline and top notices show prior/current available balances and effect on account setup funding; no unproven withdrawal/transfer cause is asserted. The owner-requested retain-capital-and-fees reminder appears before and after saving.
- All new messages have explicit fa/en/zh/ar/ja/es/it translations, isolated USD number direction and responsive dark/green sufficient/warning/shortfall states.
- Native strategy, execution, protection, risk, credit, plan/expiry and original form payload/control paths are preserved by exact source projection. No migration, settings change, order, balance transfer or uncertain-hold release was performed. Legacy callers without the new review field, owned CrossVerse transport and Hyperliquid retain their existing paths.
- Source commits: 1f7e8e88feaab54984756b90ab46277e049287ae and 005cf73159c030435679ed1bf17cf1068e983f96. Main was fast-forward updated without force push. Previous active SHA c68a5709c0cbec0cef9420e09c405227cece87e1 is preserved on codex/before-native-funding-20261009.

## Validation

- 44 targeted offline calculation/reader/confirmation/server-route/translation/closed-scope checks passed. Includes six venue/product GET adapters, pagination beyond 1000 rows, read errors, rate changes, compound toggles, frozen budgets, duplicate commitments and durable uncertain intents.
- 75 earlier funding/native Spot preservation checks passed. The historical frontend/API comparison retained 72/38 existing diagnostics and introduced none; final complete CI passed all required gates.
- Actual native components were previewed locally with intercepted sample data. Spot creation required a second confirmation after available balance changed 1000→990 and sent exactly one fixture POST. Spot edit at 50 balance showed 150.22 shortage and sent no save; unknown rates showed blank fees and blocked. Futures create/edit preserved 100/300 margin at 5x and transmitted review keys only after confirmation. These were local fixture saves, not exchange executions.
- 390px Persian RTL had no horizontal overflow; the confirmation modal fit the viewport. Balance-change notices and the exact retain-funds reminder were visible. Sample screenshots and fixture account data remain local, excluded from Git/report uploads.
- Web/admin builds and isolated API bundles passed. Exact main-push CI: https://github.com/signal0verse/signalverse-main/actions/runs/37937077507

## Immutable artifact and activation

- Preparation run: 37940301837; immutable artifact ID: 11621267034.
- Inner archive SHA-256: 6c1927f5785d0702410df5b2852ea7c1e9008ff81128edf9959b6cbb7f85b0c5. The retained archive, metadata and run/artifact provenance matched an independently reproduced exact Git archive.
- A one-use root-owned VPS approval bound the exact SHA/digest. Official OIDC delivery used the retained bytes without repackaging or modifying release authorization.
- Release workflow: https://github.com/signal0verse/signalverse-main/actions/runs/37940515094
- Active native, partner and admin release paths and deployed marker match 005cf73159c030435679ed1bf17cf1068e983f96. Four services are active. Native/public health and admin auth/static/snapshot/database readiness passed. Local/public shared manifests match the source SHA.
- Public native JS/CSS bytes exactly match active assets and contain native-funding-status/fundingApproval and sv-native-funding. The native handler source and compiled API bundle are present in the same release, including the fresh-review rejection path. This verifies native SignalVerse delivery.

## Limits

The review is an observation, not an exchange reservation or atomic lock across concurrent trading. Later balance changes can still affect scenarios. Exit reserves are recommended separately. Conservative undiscounted authenticated rates do not assume an unfunded fee-token discount. MEXC Futures non-NORMAL leverage/tier schedules stay UNKNOWN until a complete applicable schedule is established; missing/invalid data or uncertain execution intents block rather than fabricate fees or release holds.

No private-account order execution or profitability was verified or claimed. An authenticated native Telegram production UI walkthrough was unavailable; native form behavior was checked with actual components and isolated fixtures, while active release identity, public assets and service readiness were checked separately on production.