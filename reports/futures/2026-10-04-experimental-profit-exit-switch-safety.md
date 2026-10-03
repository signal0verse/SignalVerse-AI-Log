# Futures experimental automatic exit switch safety decision

## Metadata

- Date: 2026-10-04, Asia/Kuala_Lumpur.
- Evidence checkpoint: 2026-10-03T20:50:17Z.
- Module: Futures experimental Profit Protection.
- Author and audience: Codex for the SignalVerse owner.
- Mode: local source and existing evidence review; no live account access.
- Application branch: codex/prediction-coverage-expansion-audit.
- Application HEAD before and after review: 0dbca62357a4adf34240f40ceda3e387356ec4b0.

## Objective

The owner requested an operational ON/OFF switch to apply the experimental adverse-trend profit exit to all open positions, then personally evaluate the results. This request is for actual automatic exits, not decorative UI or an observation-only substitute.

## Executive finding

**LIVE AUTO EXIT SWITCH = BLOCKED. No switch was implemented or activated.**

Owner authorization is explicit. The blocker is technical execution safety, not another missing generic approval. Existing evidence does not prove that a delayed close for position A cannot affect a newly opened position B on the same native account/symbol/side. Applying the rule to all open positions would expand that unresolved risk. A toggle cannot supply the missing position-lifecycle fence or account execution boundary.

The owner may choose to research an unproven strategy. Uncertain profitability alone is not the execution-safety blocker. The separate unresolved stale-close risk must not be hidden by an experimental label or an ON indicator.

## Scope and actions taken

Checked local Git state, project instructions and the existing safety/replay evidence. Inspected the already-existing isolated execution authority and Partner final network sink. Did not run another broad audit, replay, test trade or financial test.

Primary HANDOFF.md was already dirty and remains preserved without task edits. Unrelated source experiments, reports and private/untracked work were not staged, reset, overwritten or deleted. No synchronization of the application checkout or remote main was performed.

## Files inspected

- AGENTS.md, CLAUDE.md, latest HANDOFF.md, docs/AI_HANDOFF.md, docs/COLLEAGUE_HANDOFF_2026-09-29.md and complete TRADING_STRATEGY.md.
- reports/futures/pp-final-safety-account-control-2026-10-03.md, relevant existing account-boundary findings and conclusion.
- reports/futures/2026-10-04-scanner-evidence-exit-offline-poc.md.
- tmp/pp-exclusive-writer-20261003/api/_shared/futures-exclusive-writer.ts.
- tmp/pp-exclusive-writer-20261003/server/partner-copytrade/network.mjs.
- tmp/pp-ui-current-main-20261004/src/app/FuturesProfitProtection.tsx.
- AI-Log README.md, templates/report-template.md and scripts/scan-secrets.mjs.

Initial searches using assumed filenames found no such files; repository file inventory identified the actual isolated authority module. No missing-file search was treated as proof about Production.

## Confirmed local findings

The isolated authority module explicitly states that it is a candidate, not proof of native generation fencing or account exclusivity. executeExclusiveNativeWrite requires original close basis, source association, native-account evidence, native-state agreement and durable claim/spend authorization. It rejects unproved/held account state. ENTRY is quarantined because its durable protection authority is not implemented. Its comments explicitly prohibit installing the quarantine candidate over live position management.

The Partner ownedFetch final forwarding path requires assertExclusiveNativeForward for native Futures mutations. This proves an internal candidate boundary, not control over another native API key or the customer's native exchange UI. The previous synthetic SQL race tests did not establish the real external-writer guarantee. No safety gate was weakened or bypassed here.

The existing local UI-cleanup component returns null. Reintroducing a switch without an operational safe executor would recreate misleading UI. Connecting it to the unsafe independent Market Close would be a different, consequential backend/execution change, not a small UI patch.

Existing historical research covered Binance only. It was a closed five-minute momentum/base-volume proxy, not exact Scanner V3 scoring or seconds-fast reversal detection. The recorded 112-episode result had seven hypothetical exits, one later-SL avoidance, four later-TP sacrifices and a cost-adjusted endpoint delta of approximately -0.677154 USDT versus unchanged SL/ONE TP. These are previous offline results, not tests rerun during this task and not realized Production profit. MEXC/Gate acceptance cannot be inferred.

## Implementation and files changed

No application implementation. Only this dated safety-decision report and its identical AI-Log copy were added. No source, UI, Worker, policy, thresholds, enrollment, adapters, Strategy, Decision Engine, Scanner, SL, ONE TP, migrations or financial records changed.

## Checks and build result

- Local Git HEAD and tracked-change inventory inspected.
- Existing authority and final sink reviewed with exact function evidence.
- Existing local cleanup component inspected; no new UI rendered.
- Report secret scan and publication byte verification are recorded separately in the delivery receipt.
- Application tests/build/CI: NOT RUN. There is no application candidate change to validate.
- VPS/Production/account/runtime/flag verification: NOT PERFORMED. No current runtime SHA, actual current Worker state or account-wide lack of natural trading is claimed.

## Remaining issues

1. The stale A to flat to B execution fence and shared real execution boundary remain unproved for the current customer-controlled account arrangement.
2. No operational all-position experimental exit path has been accepted or deployed.
3. The tested signal has not demonstrated improved net results; the sample is small and previously exposed.
4. The owner has not yet selected a reduced-scope experiment. No such substitute was implemented silently.

## Recommended next step

Ask whether the owner wants a functional, clearly labeled observation-only test switch: monitor the owner's open Binance positions, record would-exit decisions and comparative outcomes, and submit no exchange Close. This is a proposal, not completed work or automatic authorization to access accounts. Alternatively, define a bounded Demo experiment separately. Live all-position exits remain blocked until the actual lifecycle/execution safety gate is met; merely accepting financial risk or disabling a toggle does not prove that gate.

## Git status and publication

Application commit: NONE. Application push: NO. Dirty HANDOFF and concurrent work remain preserved. Only the sanitized report is published to SignalVerse-AI-Log/master under the repository's report instruction. The verified report commit and link are returned separately; no publication success is inferred in advance.

## Final safety statement

```text
LIVE_SWITCH_IMPLEMENTED=NO
LIVE_SWITCH_ACTIVATED=NO
APPLICATION_SOURCE_CHANGED=NO
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
UI_CHANGED=NO
PRODUCTION_ACCESS=NO
PRODUCTION_CHANGED_BY_TASK=NO
DATABASE_ACCESS=NO
DATABASE_MUTATION=NO
PP_WORKER_STARTED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
EXCHANGE_REQUESTS=0
EXCHANGE_ACTIONS=0
ORDERS_CHANGED=0
POSITIONS_CHANGED=0
SL_TP_CHANGES=0
CLOSE_ACTIONS=0
DEPLOYMENT=NO
OBSERVATION_ONLY_ALTERNATIVE_IMPLEMENTED=NO
IMPROVEMENT_PROVEN=NO
FINAL_CLASSIFICATION=BLOCKED_UNPROVEN_REAL_CLOSE_SAFETY
```

