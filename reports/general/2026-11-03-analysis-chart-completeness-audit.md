# Native Analysis chart — completeness audit and local display repair

Recorded: 2026-11-03T06:40:56.322138+00:00.

## Executive result

**The requested overall chart feature set is INCOMPLETE.** Successful source deployment and CI were not proof that every requested layer rendered correctly inside the native application. The owner's missing FVG/OB report exposed a concrete integration defect that the standalone preview and existing tests did not cover.

Audited published source: `c161955239f24f151fed6a2a08dfcb8bef0e04ac`. The only executable local change in this task is one SVG sizing attribute in `src/app/components/AnalysisEvidenceChart.tsx`. It is uncommitted and NOT deployed. There was no new source promotion, CI dispatch, artifact, Guard or release.

## Proven root cause and minimal local repair

`src/app/App.tsx:17483` wraps the native app in `sv-workspace`. The existing icon rule at `src/styles/telegram-workspace.css:2` is:

```css
.sv-workspace svg { width:20px; height:20px; flex-shrink:0 }
```

This also matches the chart's SVG overlay. CSS dimensions override the SVG width/height presentation attributes. The chart held six or seven valid selected zones, but the overlay's actual bounding box was **20 × 20 px**, despite measured chart attributes of 1100 × 481.333 px. Zone coordinates outside that tiny viewport were clipped. FVG/OB rectangles, their labels, harmonic polylines and channel callouts share this overlay. Candles, event markers and RSI lines use the chart canvas; they are not all explained by this SVG defect.

The original standalone preview lacks `sv-workspace`. With the same unchanged BTC weekly report and evidence, removing only that wrapper produced a full 1100 × 481.333 px overlay. This is why the preview looked correct while the native host could hide the zones. Read-only public report fixtures were used; no private Telegram page or user account payload was accessed.

The local fix binds the **existing measured dimensions** inline:

```tsx
style={{width:scene.totalWidth,height:scene.height}}
```

It does not change drawing geometry, evidence, detector thresholds, selector caps, decisions, orders, CSS icon rules or other app behavior. Source before SHA-256: `cc335b08a39faeed71da3d032e7e176ee2711d6a9efea26bcd54ed5f2bcc757e`. Local source after SHA-256: `dcef1cfbdb6e7ca766a0d4572cf01854cae09769094630877765ab53a587b46d`.

### Actual browser evidence

- Before: ETH/BTC × daily/weekly, four cases, each overlay 20 × 20 px although valid zones existed.
- After: all four native-host cases 1100 × 481.333 px, matching the existing measured chart dimensions. Reset icons remain 20 × 20 px.
- Mobile: 393 × 852 viewport, overlay 378 × 392 px, matching measured dimensions; no horizontal overflow; seven zones remain present. Temporary viewport override was reset.
- A full-page screenshot was visually inspected: zones and the channel callout returned. The report is a fixed public-data replay, not fresh market advice or live-account acceptance.
- Before/after diagnostic previews: http://127.0.0.1:5194/ and http://127.0.0.1:5195/ . The latter is a diagnostic chart, not a replacement full app or a live analysis service.

## Completion matrix for the owner's chart requests

| Requested behavior | Actual status and evidence |
| --- | --- |
| FVG and OB from actual engine data | Detector data and price boundaries exist. Native-host SVG clipping is reproduced and fixed LOCALLY only. Thin zones may still suppress interior text at wide zoom under the existing anti-overlap rules; this does not mean their data is absent. |
| Engulfing and Pin bar | Actual closed-candle detectors and chart markers exist. Global latest-six selection can remove entire detected families. The label-density filter additionally hides overlapping text while keeping markers. Full browse/filter access to the omitted detected events is missing. |
| Harmonics / Live Harmonics / HP-V2 examples | Native Gartley/Bat/Butterfly/Crab ratio/reaction subset exists. ETH daily has one eligible recent harmonic observation that is omitted by latest-six selection. Exact equivalence to the named TradingView scripts and continuously forming/live harmonics is NOT PROVEN. Snapshots are as-of each analysis. |
| SMC and Liquidity Swings | Native structure/sweep/retest evidence exists. It is a bounded internal subset; exact LuxAlgo script parity is NOT PROVEN. SVG callouts/paths were subject to the same host clipping. |
| Supertrend | 240 daily values exist in both saved snapshots, but the new native renderer does not reference/render that series. Native weekly review does not carry an equivalent weekly Supertrend series. INCOMPLETE; it was not silently enabled. |
| Support / Resistance | Daily support/resistance arrays exist in both saved snapshots, but the new renderer does not draw those arrays as dedicated S/R layers. OB/FVG areas are not equivalent to completion of this separate request. |
| Next-Gen Engulfing Retracement | Generic engulfing-at-confirmed-level observations exist; no dedicated retracement study matching the named reference is established. NOT PROVEN / INCOMPLETE as an exact requested indicator. |
| PineCoders Backtesting & Trading Engine | Historical chart evidence is not an executable strategy backtest. No equivalent trade simulation/performance panel is wired into this native analysis chart. INCOMPLETE as that specific requested tool. |
| Engine uses patterns as reasons for its actual decision | `buildStandaloneDailyAnalysis` computes the existing Formula-B accumulation/capital/regime verdict, then appends chart evidence. Four existing momentum votes and structural inputs remain authoritative. Pin/engulfing/harmonic chart markers do not become causal entry votes merely by being drawn. Display connection exists; full pattern-to-decision integration as requested is NOT complete/proven. No policy was changed to pretend otherwise. |
| Seven timeframes reviewed; only daily/weekly displayed | Source implements the seven native intervals and native closed-time checks; both saved reports validate seven available frames. Daily verdict and weekly confluence remain distinct, not unanimous entry approval. |
| Refresh on Analyze and 6–24-hour reminder | Existing request/collector and manual reminder wiring are present. Existing plan/auth/allowance locks remain. A timer alone does not run paid/live analysis. No fresh authenticated Production analysis was triggered in this audit. |
| Remove four scenarios / fake buy ladders from the new view | New native view uses actual conditional buy/profit-review areas. Forty focused and seven page tests pass, including no fabricated confirmed ladder and original financial function preservation. Saved legacy reports remain preserved. “Best” is not proven statistical optimality. |
| Channels, developing channels, wedges, flags and RSI relations | Actual native geometry and RSI studies exist. Qualifying-only logic can legitimately yield no wedge/flag; none is invented. Channel callouts share the now locally repaired overlay. These technical annotations do not independently confirm an engine trade. |
| Fullscreen, Reset, compact labels and phone layout | Components/wiring exist; actual Reset/page regression passes, native-host desktop/mobile dimensions pass. A full private Production fullscreen interaction was NOT performed; full-page end-to-end acceptance under the real host remains required before the next release. |
| Admin/manual/daily Telegram posts and chart links | Composer/config switch, manual preview/publish route, existing cron handler and immutable public chart links exist in source. The PNG is a simpler rendering than the interactive chart. No channel post, daily switch change or natural daily delivery observation was performed here; do not claim those live behaviors newly verified. |

## Measured evidence-selection gap

Data is from saved public Binance reports: ETH `2026-11-02T06:46:04.770Z`, BTC `2026-11-02T06:09:37.655Z`. Their hashes and raw detector counts are retained privately. They are not current account decisions or new market observations. Multiple same-bar detector observations may share correlated levels; do not count them as independent confirmations.

| Symbol | Interval | Selected zones | Eligible recent event groups | Selected event groups | Omitted groups |
| --- | --- | ---: | ---: | ---: | ---: |
| ETH | 1d | 7 | 17 | 6 | 11 |
| ETH | 1w | 7 | 13 | 6 | 7 |
| BTC | 1d | 6 | 18 | 6 | 12 |
| BTC | 1w | 7 | 15 | 6 | 9 |

For ETH daily, eligible recent observations include ENG, PIN, STRUCTURE, LIQUIDITY and one exact-geometry HARMONIC. Selection retains only three ENG and three LIQUIDITY groups. Thus lack of a visible Pin/Harmonic is not always lack of a detected pattern. `selectChartEvidence` retains only events within the last 30 bars, then globally slices to six. The UI inspector also uses that selected list, so it does not currently provide an archive of all omitted detections.

`NativeAnalysisChart` additionally falls back silently to a price-only chart when `chartForReport` rejects/misses a snapshot or the interval is outside daily/weekly. This path needs explicit user-facing provenance/error explanation; changing validation to accept malformed evidence would be incorrect. It is a proven code path, not the verified cause of a particular private account's report in this audit.

## Fresh local checks and limits

- Four existing focused files: **40/40 PASS**, zero failed/cancelled/skipped, rerun after the local fix.
- Existing full-page/history/source-preservation/Reset file: **7/7 PASS**, zero failed/cancelled/skipped.
- Native-host actual browser regression: four desktop cases and one mobile case PASS, following the reproduced four-case failure before the fix. These measure actual computed CSS/bounding boxes, not only source text or SSR.
- Web build PASS (30.77s); Admin build PASS (10.09s). Existing large-chunk warning remains; no limit was raised.
- Full unchanged project TypeScript comparison: baseline **66**, candidate **66**, introduced **0**, changed component diagnostics **0**. Same ES2020 tsconfig and existing `allowImportingTsExtensions=true`. An initial ad-hoc component command failed TS5097 because it omitted that existing setting; its log is preserved and is not described as a source regression or a passing run.
- Local Node v24.19.0. This is not a substitute for official Node22 CI.
- `git diff --check` PASS. Protected backend/config/strategy/App paths have zero task-created diff.
- Official full CI/release scope/artifact-size checks were NOT rerun for this uncommitted repair. Previous 79-step official success belongs to the unchanged published SHA, not to this local candidate. The previous archive had only 109 bytes of headroom; the next exact committed package must be measured with the original cap, never waived.

## Actual changes and next boundaries

Application code changed: `src/app/components/AnalysisEvidenceChart.tsx` only, one inline sizing attribute. `HANDOFF.md` records the finding/local state. Diagnostic scripts, fixed public fixtures, browser measurements and logs remain outside application source under the private audit directory; the report is published separately in AI-Log.

The safe next implementation order is: retain this narrow host sizing fix; add actual full-page native-host/fullscreen/history-poll regression coverage; make rejected/missing snapshot provenance explicit; provide deliberate access to omitted valid patterns without lighting every indicator or inventing evidence. Supertrend/SR and the requested named-script/decision integration need explicit, evidence-backed completion rather than a claim that the current generic display is already equivalent. No new trading rule or active indicator was silently introduced during this audit.

COMMIT=NONE
PUSH=NO
CI_DISPATCH=NO
DEPLOYMENT=NO
PRODUCTION_CHANGE_BY_THIS_TASK=NO
PRODUCTION_PRIVATE_ACCOUNT_INSPECTION=NO
DATABASE_CHANGE=NO
PP_WORKER_STARTED=NO
PP_FLAGS_CHANGED=NO
STRATEGY_DECISION_ENGINE_CHANGED=NO
EXCHANGE_CALLS=0
ORDERS_POSITIONS_SL_TP_CHANGES=0
FINAL_STATUS=CHART_INCOMPLETE__ROOT_CAUSE_REPRODUCED__LOCAL_DISPLAY_FIX_VALIDATED_NOT_DEPLOYED
