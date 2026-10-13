# Independent Spot scalp projects — clarification and release preparation

Date: 2026-10-13
Status: SOURCE_PUBLISHED / FINAL_DEPLOYMENT_IN_PROGRESS

## Confirmed owner requirement

Keep the previously deployed automatic Spot scalp scanner in its original location,
with its original Manual/Automatic tabs, settings and classic strategy. Add the new
chart/history workspace as an independent second project at the CrossVerse Trade
plan cards and SignalVerse home. The second project must not replace the first or
operate as another view over the first project's scanner profile.

## Implemented separation

The second project has separate profiles, revisions, enable/disable commands,
discovery runs, setup identities, coin lists and history filtering. New classic
campaigns keep the deployed native-5m Formula-B/scenario-v1 model. New technical
campaigns use the reviewed canonical Futures technical analysis on closed native
Spot 5m candles with closed 15m agreement and the eight-style confirmation layer.
Existing immutable decisions and open campaigns retain their original versions.

Account ownership, plan/credit authority, exchange wallet availability and durable
uncertain-order protection remain common safety controls. Competing work on the
same owner, mode, exchange and symbol is blocked. The same symbol on another
exchange is allowed. Deployment does not copy or enable either project's profiles.

## Verified checks

- Native/Paper project and technical engine/pattern checks: 55 passed.
- Reviewed source scope/cache checks: 132 passed; complete shared terminal build passed.
- Original full frontend/API type gate: no introduced diagnostics.
- Disposable PostgreSQL migration fixture: 23 checks passed. The additional release
  operator's row-preservation witness passed those same 23 checks independently.
- CrossVerse PHP: 34 tests / 177 assertions passed on a fresh restricted schema.
- Supplier PHP: 29 tests / 228 assertions passed on a fresh restricted schema.
- Both PHP archives match their tested committed source. Product guides, assistant
  draft and read-only Postman examples validated.
- Seven release operator templates compile in an offline rendering fixture.
- Read-only installed-function preflight confirms the supported migration anchors.

Tests used isolated fixtures and synthetic data. No private exchange acceptance
order, production account command or profile activation was submitted.

## Source and publication

Core candidate: `f92996be5b12fd4f57a656c429482b4a13b51f4f`, on
`codex/free-isolated-actions-20261013`.

CrossVerse PHP: `2393c4d3e74f3e1fa10d055d9e4beeda640fe075`, published normally
to its existing private `main` after ancestry and compare-and-swap checks.

Supplier PHP: `c85e6d40939013bc8305b2bd48db76e1320dc3d5`, published normally
to its existing private `master` after the same checks. No force push.

The exact tested PHP delivery bytes are privately staged on the existing hosts.
Neither PHP runtime was switched. The active Core and Paper release remains
`087e4cb611feee6a05bcc7aa1dfc2684bfdcbcf4`. The new production PostgreSQL storage
does not yet exist. No migration or release approval has been applied.

## Remaining release work

[Exact candidate CI](https://github.com/signal0verse/signalverse-main/actions/runs/38356557130)
is still running; a partial test run is not release approval. After full success,
normal Core main promotion and the exact main/push CI must complete. The official
immutable artifact must then pass source/digest verification, private backup and
cold restore, the additive project migration, the independent one-use release
approval and official OIDC delivery. Paper and both PHP adapters require their
atomic cutovers, followed by all runtime and both public asset provenance checks.

The independent migration creates empty tables and verifies existing rows remain
unchanged. Existing profiles, history, holdings and uncertain execution journals
are retained. Original release authorization and exit protections remain enforced.

This is a separation/preparation checkpoint, not a claim that the new workspace
has already been deployed or that simulated tests establish live profitability.
