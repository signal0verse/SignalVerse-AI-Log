# SignalVerse app Spot allocation — 2026-10-09

## Correction and scope

The earlier existing-release verification described the CrossVerse/partner surface.
The owner correctly identified that the original SignalVerse app still lacked
that UI. This change exposes the same shared capital-allocation controls in
SignalVerse's own Spot Demo and real setup add/edit forms, with native API
persistence and native automatic admission. It is not merely a CrossVerse rollout.

Independent scenario and buy-rung choices are manual, pyramid (10/20/30/40),
reverse (40/30/20/10), diamond (15/35/35/15), equal (25 each), and engine auto.
Manual edits affect only their own row. Percentages must total 100; displayed
amounts do not round the budget upward. Auto waits for fresh valid native engine
analysis, freezes scenario shares/budget for the active cohort, and derives each
new scenario's rung shares from that scenario's analysis. Existing manual arrays
are preserved. Public database guards freeze admitted allocations, including
zero-fill/open cycles, while keeping monitoring, closing and reconciliation paths.

Existing exchange adapters, order precision/minimums, account checks, accounting,
compound calculation, credit/plan/expiry policy and manual closing remain the
authoritative execution paths. No real account or funded order was used for tests.

## Source

- Initial feature commit: `bb0da69211d7e3fb9b676ae7660adfb2bcaf70ec`.
- Latest main Market access changes (`4d11ed83a89acf5ca8c13d2805e8eec6d2be04fb`)
  were integrated, preserving their UI, help and closed source gates.
- Published combined commit: `2a3cf0e7116e774aacef76a175031d2182b68ecd`.
- PR: https://github.com/signal0verse/signalverse-main/pull/216 (merged).
- Unrelated primary-worktree edits/untracked files were preserved.

## Validation

- 21 synthetic native API create/edit/admission cases across Demo/real and
  Binance/MEXC/Gate; original declarations are exercised without API bootstrap.
- Shared allocation policy and actual React component tests, including seven
  component locales, RTL, disabled/pending states and conservative cent display.
- 8 checks against a fresh private PostgreSQL cluster: repeatable migration,
  legacy manual preservation, immutable allocations, stale admission and locking.
- 69 isolated Binance LIMIT execution assertions passed. These are simulations,
  not proof of live private-account execution or profitability.
- Native-service and owned Spot LIMIT integration/UI suites passed.
- Original feature type comparison introduced no diagnostics beyond the existing
  frontend/API baselines (72 and 38 respectively).
- After main integration: all 83 selected allocation/UI/Market cases and all
  66 closed-scope tests passed; web and admin production builds passed.
- Interactive browser preview mounted the actual original SpotCopyTradePanel
  without a partner host; tested independent models, manual edits, auto waiting,
  Demo/real save/reopen, and Persian RTL at 390px. Preview uses synthetic local
  storage/transport and cannot submit a real order.

## Backup and deployment evidence

Existing VPS access was found through the dedicated SSH key and documented port.
A fresh private production database backup was made before the schema change,
with mode 0600, archive list verification and complete pg_restore read validation.
The backup stays on the VPS; it is not included in this public report or Git.
Backup size: 239206331 bytes.
Backup SHA-256: `1bee1df0d738ef79b6a2367bb69eb4bdfc23b27058efdd3315f86a929da179cd`.

- Full main-push CI succeeded, including all existing gates, private SQL suites,
  web/admin builds and API bundles: https://github.com/signal0verse/signalverse-main/actions/runs/37835841270
- Final combined type comparison: frontend 72/72 and API 38/38 baseline/candidate
  diagnostics, with no introduced or removed diagnostics.
- The exact uploaded public-schema migration was hash-checked and applied in one
  transaction after the verified backup. Three columns and both enabled allocation
  guards were confirmed. Existing setups with a non-null model after migration: 0,
  so previous manual configuration was not converted.
- Migration emitted the PostgREST schema reload notification.

- Retained artifact preparation succeeded:
  https://github.com/signal0verse/signalverse-main/actions/runs/37838526281
- Immutable artifact ID: `11577150293`; inner archive size: 5184379 bytes.
- Inner archive SHA-256: `7d4f610902a6479d75d365232d9aa04f21f640b730fd010a331c55ae39a3ade5`.
  Provenance, metadata, embedded commit and digest were verified. An independent
  local Git archive of the reviewed commit matched the retained bytes exactly.
- Existing independent VPS guard received a one-time authorization for only this
  SHA/digest; no guard, service permission or production risk policy was bypassed.
- Official exact-artifact release succeeded:
  https://github.com/signal0verse/signalverse-main/actions/runs/37838754025
- Active native, partner and admin runtime links and the deployed marker all
  resolve to `2a3cf0e7116e774aacef76a175031d2182b68ecd`.
- Native, partner, admin and observer services are active. Native/public health
  checks passed; admin reported the exact SHA with auth/static/snapshot/database
  readiness. The coordinated release also passed its shared terminal health gate.
- The public SignalVerse page serves `index-nn_xWUUC.js` and `index-CchYhYW1.css`.
  Both response bodies exactly match the active release's built files by SHA-256.
- Read-only PostgREST requests selecting the new public setup and cycle columns
  with `limit=0` succeeded. No user rows were returned or modified by this check.
- Final verification: 2026-10-08 UTC / 2026-10-09 Asia/Kuala_Lumpur.

## Practical limits

The original app form was interactively verified with synthetic local transport;
authenticated production create/edit and funded exchange execution were not used
as release probes. CI, HTTP health and asset identity do not prove profitability
or private-account execution. Original app languages remain Persian/English;
the shared allocation component retains its seven supported partner locales.
Existing baseline type diagnostics and the existing large-bundle build warning
were not expanded by this change.

## Rollback boundary

After any setup opts into a model, do not activate an old backend that ignores
model identity. Retain the compatible resolver and database guards during any
UI rollback. Do not remove uncertain-order holds or protection/reconciliation.
