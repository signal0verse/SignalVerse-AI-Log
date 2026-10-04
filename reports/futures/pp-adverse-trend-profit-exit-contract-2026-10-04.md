# PP policy selection: profitable-position adverse-trend exit

## Metadata

- Date: 2026-10-04, Asia/Kuala_Lumpur.
- Mode: owner requirement clarification and narrow local source/evidence review.
- Owner selected: early exit on weakening trend, momentum and market conditions while the position remains profitable and has not completed its original TP.
- This resolves the policy-choice question in the preceding PP readiness report. It does not claim implementation or activation.

## Intended behavior / minimal contract

1. Apply only to the same currently open, eligible position. For Long, adverse evidence is directional selling/weakening bullish structure; for Short the direction is reversed. Lower candidate rank, removal from a scanner list, an ordinary pullback or lack of data must not alone imply a close.
2. Assess estimated executable net profit for the remaining quantity, including known fees/funding and conservative execution impact. A green mark-price display is not sufficient. The objective is to preserve profit before the original TP, not to replace ordinary loss-side SL or guarantee a positive eventual fill.
3. Use timestamped fresh native observations for the fast signal. Reuse existing trend/momentum/volume/market features where their timestamp and meaning are valid. Discovery's 1h/4h closed-bar context is contextual evidence, not a seconds-fast trigger. Do not change the five-minute scanner schedule or entry Decision Engine.
4. Require directional confirmation on distinct observations, with stale/out-of-order/duplicate/gap handling. Exact fast windows, confirmation thresholds, net-profit floor and achievable latency remain UNVALIDATED; no invented live thresholds are authorized by this report. Do not reuse the old giveback threshold as if it implemented the new requirement.
5. A qualifying signal is only a close proposal. It is not execution authorization. Native account/position association, one durable cross-path execution authority and the unresolved old-position/new-position fence must still pass before any exchange submission. Concurrent manual/native TP/SL wins, uncertain outcomes and restarts must fail closed for a new submission while retaining existing protection/reconciliation.
6. Never widen or remove SL, change ONE TP, entry, quantity policy, Strategy, risk, enrollment, scanner or Fast Trader to manufacture PP success. Missing evidence means no new PP action, not disabled native protection.
7. After a durably recorded profitable full manual/PP close, retain the deployed same-setup re-entry admission barrier. That barrier alone is not a native close-lifecycle fence and is not a permanent symbol ban.

The minimal implementation direction is an isolated versioned signal change in the existing PP architecture, reusing its executable-depth/cost/freshness utilities and lifecycle ports. Do not create another scheduler, another independent close engine, or directly connect Scanner rejection to a market order. No implementation was made in this clarification step.

## Existing evidence and why it is not deployable acceptance

Inspected the previous `2026-10-04-scanner-evidence-exit-offline-poc.md` and its frozen protocol. The previous experiment used two completed five-minute bars, therefore approximately five-to-ten-minute confirmation, not seconds-fast reversal recognition. It also required fixed giveback/profit conditions and is not the newly selected pure adverse-market trigger.

Its already-recorded 112-episode result had 7 hypothetical exits: 3 improved endpoints, 4 worsened, 1 later-SL avoidance and 4 sacrificed later baseline TPs. Aggregate improvement was NOT_PROVEN. These are historical results, not tests rerun now and not a basis to tune on the same exposed sample until it passes.

Missing acceptance evidence: an unseen event/receive-time tape with executable price/depth and the selected momentum/participation inputs; causal feature construction; measured signal/queue/fill latency; comparison of saved SL versus sacrificed TP and net results after costs; the separately unresolved lifecycle/single-executor execution gate. Missing OI/depth/quote-volume cannot be invented or silently treated as neutral.

## Exact local sources inspected

- reports/futures/2026-10-04-scanner-evidence-exit-offline-poc.md.
- tmp/pp-scanner-exit-poc-20261004/protocol.json (unchanged historical protocol).
- Released source snapshot under tmp/futures-manual-close-reentry-20261004: api/_shared/futures-profit-protection.ts; api/_shared/futures-market-discovery.ts; api/copytrade.ts enrollment/native position/funding/observation call sites.
- Prior selected-policy/readiness evidence from the preceding request remains applicable; no new native exchange API claim was made.

## Changes / tests / limitations

Only this sanitized requirements/evidence report was created. No test/replay/build/CI was run, no POC threshold was retuned, and no application source was changed. No Production/DB/exchange access occurred in this request. The previous worker state is historical, not a fresh check in this step. Primary dirty/concurrent work was preserved.

```text
PP_POLICY_SELECTION=ADVERSE_TREND_MOMENTUM_MARKET_WEAKNESS_WHILE_PROFITABLE_BEFORE_TP
EXISTING_GIVEBACK_POLICY_SELECTED=NO
FAST_SIGNAL_IMPLEMENTED=NO
IMPROVEMENT_PROVEN=NO
EXECUTION_SAFETY=NOT_PROVEN
REAL_PP_ACTIVATION=NO
WORKER_STARTED=NO
FLAGS_CHANGED=NO
APPLICATION_COMMIT=NONE
APPLICATION_PUSH=NO
CI=NOT_RUN
DEPLOYMENT=NO
PRODUCTION_CHANGE=NO
DATABASE_MUTATION=NO
EXCHANGE_CALLS=0
ORDER_POSITION_SL_TP_CLOSE_ACTIONS=0
FINAL_CLASSIFICATION=POLICY_DEFINED_LIVE_ACTIVATION_NOT_READY
NEXT_PHASE=BOUNDED_CAUSAL_FAST_SIGNAL_POC_WITH_SEPARATE_EXECUTION_GATE
```

Only report publication to AI-Log/master is performed under the repository reporting instruction; it is not an application release. A fast exit can still slip or fill at a loss during a gap; preventing every profitable position from ever reaching SL is not promised.
