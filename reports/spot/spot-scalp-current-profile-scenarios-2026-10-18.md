# Current saved policies for prospective Scalp scenarios

Date: 2026-10-18 (Asia/Kuala_Lumpur).

## Implemented scope

All assets in independent technical Spot Scalp use the same prospective policy
selection on SignalVerse and CrossVerse native/owned/Paper paths. Unaccepted
scenarios 2–4 read the account's current saved tools and explicit 15m/hourly
policies. Saved Medium scalp-15m-v1 requires minimum score 3. Other accounts keep
their own saved selection; missing explicit confirmation policy remains legacy 4.
Accepted scenario 1 and every accepted later decision, purchase, allocation,
price ladder and exit rule remain unchanged.

Preview records the policy source (current saved settings), settings revision,
target scenario, 15m minimum/risk/version, hourly policy and tools version in
all seven locales. Changing the saved revision invalidates the preview cache.
Preview analysis must match its recorded source and never authorizes an order,
capital reservation or credit charge.

Native/owned entry rechecks the current revision. Transactional Paper persistence
rejects stale newly accepted snapshots. The additive migration changes only two
technical admission wrappers and their two cycle triggers, without updating any
user row. It verifies previous ladder fills and a fresh matching engine decision,
then freezes the current policy provenance. Original discovery, hourly, liquidity,
plan, capital, depth, costs and uncertain-order protection remain mandatory.
Canonical 5m LONG and valid closed 15m trend/momentum/data confirmation remain
the entry authority; no manufactured LONG or symbol-specific exception was added.

## Verification

- 691 integrated functional/UI and retained assertion checks: PASS.
- 15 focused scenario-policy tests, covering assets, venues and modes: PASS.
- 70 committed closed-scope/predecessor checks: PASS.
- All 382 predecessor PostgreSQL checks passed. A new local migration test caught
  ambiguous SQL subtraction precedence. Parentheses alone repaired it; 43 new
  migration checks then passed in a fresh process-owned PostgreSQL cluster.
  These are separate isolated runs, not a claim that the initially failing run passed.
- Final SQL bytes match that repaired tested candidate by hash:
  `65a791c21a21d60f91f16ea1a779299c1d12aa06be313743dcded18c32849c41`.
- Strict scoped TypeScript: PASS. Whole API retains exactly 33 prior diagnostics,
  with zero additional diagnostics at the original ES2020 compatibility target.
- Native/admin, owned/shared terminal and Paper builds: PASS. Owned/shared source
  revision agrees with the commit; all 57 owned source-file hashes were verified.
- Synthetic local Persian browser review: current Medium, minimum 3, policy source
  and unchanged accepted purchases are readable for prospective scenarios 2–4.
- Original retry/technical/tools/owned-LIMIT regression: 47 PASS; durable native
  MARKET batch and immutable-level checks: 14 PASS.

Initial sandboxed checks could not read shared dependencies or rename temporary
PostgreSQL WAL. The same local isolated commands ran with ordinary host access;
failed-attempt evidence was retained. Temporary clusters and the task preview
server were cleaned up. No private account data or live provider/exchange calls
were used as test fixtures. These checks do not establish profitability or funded
private-account execution.

## Git and release state

Local commit: `5886eb77f0e4165839c7bc1763bc1f8841f5c1dc`.
Branch: `codex/scalp-scenario-policy-20261018`. Tracked tree clean; unrelated/private output preserved.
Application source has **not been pushed or deployed** in this request. No live
profile save, forced scan, production migration, order or hold change occurred.
Official exact-source CI/artifact, private backup/full isolated restore rehearsal,
capacity gates, independent Guard and matching runtime/public verification are
still required before rollout. This report publishes only implementation and
synthetic validation details; account records, screenshots and private evidence
remain local.
