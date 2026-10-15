# Spot Scalp chart evidence and actual analysis tools — 2026-10-15

Status: READ_ONLY_SOURCE_AUDIT_COMPLETE. No executable changes or deployment.

The owner asked whether the five cards under chart technical evidence are the
only engine inputs, or whether the enabled tools in Settings also participate.

Both public shared-terminal manifests were read successfully and identified
source `1eec576d814a2349ec11c75d5cd61e30abebfc90`. The inspected chart monitor,
read model, shared technical adapter, tool normalizer, pattern detector and
additional confirmation module are byte-identical to this source. The local
checkout also contains a subsequent classic-scanner continuation change; that
change was not deployed or modified by this audit.

## Findings

1. `SpotScalpMonitor.tsx:123` filters the evidence cards to layers with a `vote`.
   `scalp-monitor-model.ts:56-70` assigns that field only to MA, Bollinger, RSI,
   MACD and StochRSI. This is a partial directional summary, not a complete
   engine-decision explanation. The separate layer panel contains 21 display
   layers, including structures, patterns and volume context.
2. Eye buttons update only the local `visible` set. They do not save or disable
   analysis tools. The card votes are raw public-candle observations; they are
   not the complete effective per-account score or proof of an executed order.
3. Saved personal tools are actual engine inputs. The technical scanner accepts
   the tools in validated profile options. The native context obtains frozen
   campaign tools for open campaigns or saved discovery metadata for a fresh
   campaign. The monitor reads the existing authenticated profile and uses its
   tools only on a matching venue; otherwise its initial all-on defaults remain.
4. `evaluateSpotTechnicalScalp` applies the selected MACD/RSI/StochRSI/Bollinger
   votes to the canonical direction engine. Both closed 5m and closed 15m must
   already confirm LONG. The new confirmation layer is an admission gate after
   direction; it is not run on every rejected early direction branch.
5. For tools-v2, `confirmSpotScalpLayers` filters evidence for the eight enabled
   styles, includes selected engulfing/pin-bar/NDS evidence, and applies selected
   VWAP, relative-volume and estimated Volume Profile checks. A valid supporting
   price event is required; opposing evidence or failed/unavailable required
   volume context prevents new admission. Correlated labels share one event;
   counts do not raise confidence. Turning a tool on does not manufacture a
   detected pattern or require every enabled style to confirm simultaneously.
6. These are explicitly defined automated rule subsets. NDS is the public
   three-node reversal subset, and RTM/ICT are bounded pattern adaptations.
   Volume Profile is an OHLCV estimate, not actual tick/order-flow distribution.
7. Legacy tools-v1 campaigns retain the older rules. Saving new preferences does
   not rewrite an open campaign's frozen configuration. The screenshot cannot
   establish which tools were used by a particular historical private order.
8. The monitor uses public Binance reference candles and estimated model fees.
   It has `canSubmit=false`; its live observations and conditional scenario
   graphics are separate from authoritative account orders and recorded fills.

The chart heading therefore overstates completeness: the engine is not limited
to five indicators, but that particular evidence section omits the other layers.
The owner asked for an explanation, so no UI or trading behavior was changed.

## Validation and limits

Ran the existing safe offline suites `spot-scalp-tools-test.mjs`,
`spot-scalp-confirmation-test.mjs` and `technical-pattern-confirmation-test.mjs`
using Node 22 with type stripping: 41 passed, 0 failed, 0 skipped. Fixtures cover
actual toggle effects, volume availability, pattern conflict, immutable tools,
canonical score preservation and no lookahead. The tested shared rule modules
and these test files match the observed deployed source.

Initial default-user-agent manifest reads returned HTTP 403. Both reads succeeded
with the same normal browser headers used by the existing release verifier.
No authenticated account records, keys, orders, balances, profile writes, forced
analysis, paid AI calls, database operations or financial execution were used.
No private identifiers, assets, transaction amounts or snapshots are included.
Offline functional tests do not prove private execution or profitability.

Source references at the observed public version:

- [Chart evidence UI](https://github.com/signal0verse/signalverse-main/blob/1eec576d814a2349ec11c75d5cd61e30abebfc90/src/app/SpotScalpMonitor.tsx#L123)
- [Display read model](https://github.com/signal0verse/signalverse-main/blob/1eec576d814a2349ec11c75d5cd61e30abebfc90/src/app/scalp-monitor-model.ts#L27)
- [Technical entry adapter](https://github.com/signal0verse/signalverse-main/blob/1eec576d814a2349ec11c75d5cd61e30abebfc90/api/_shared/spot-technical-scalp.ts#L46)
- [Pattern and volume gate](https://github.com/signal0verse/signalverse-main/blob/1eec576d814a2349ec11c75d5cd61e30abebfc90/api/_shared/spot-scalp-confirmation.ts#L80)
- [Frozen campaign configuration](https://github.com/signal0verse/signalverse-main/blob/1eec576d814a2349ec11c75d5cd61e30abebfc90/api/_shared/spot-scanner-scalp-context.ts#L15)

Publication is limited to this dated audit under the standing owner instruction
in AGENTS.md (2026-09-18). Successful publication requires exact remote byte
verification; the local publication receipt records that outcome separately.
