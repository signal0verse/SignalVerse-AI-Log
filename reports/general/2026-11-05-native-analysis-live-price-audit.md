# SignalVerse — native Analysis live-price audit

Recorded 2026-11-05T00:07:14.353025+08:00 (Asia/Kuala_Lumpur). Owner asked to finish the guarded chart release, then highlighted that the native Analysis header price changes while the chart's green price label does not follow it.

## Confirmed cause

The supplied screenshots show a header near80250/80264 and a saved chart close near77454. These are screenshot observations, **not independently verified current market prices**.

Read-only audit of exact main `9380b72318f7c6ca41ab927ff6bca8f5c89ce72c` confirms: the existing public Binance Spot ticker updates App.livePrice every15seconds; that value reaches the selected asset header. NativeAnalysisChart receives no live quote. AnalysisEvidenceChart draws the immutable report's closed daily candles or its independent saved weekly frame, so its default candlestick price line shows the report's last close. A real saved close can therefore be mistaken for the current quote. The live candle refresh does not replace this report snapshot. No provider/account/analysis call was made for this audit.

## Required display correction and limits

Show a separate clearly labelled current public-price line and the saved last-close value. Bind live quote identity to symbol/pair/actual receive time; reject invalid/stale/future/cross-symbol responses and suppress the overlay on historical reports. Update its line without replacing report candles, moving saved patterns/zones, resetting pan/zoom or changing any engine/trading decision. Show a truthful stale/unavailable state; fabricate no quote or candle. The report remains the same closed-candle analysis until the ordinary authorized analysis flow produces another report.

A private display-only draft outside the repository now has **3/3 isolated local unit cases PASS** for quote identity/freshness/history denial, display-range extension without report mutation, and reusing/removing one price line. This is **not integrated into the app**, is not an actual live-market/browser verification and is not added to the existing80/41/official test counts. Actual React/feed/race/viewport integration, capacity, full tests and official exact-SHA acceptance remain required. No fix or deployment completion is claimed.

## Current release state

The current source remains frozen. [Official main/push CI41861617945](https://github.com/signal0verse/signalverse-main/actions/runs/41861617945), attempt1 at `9380b72318f7c6ca41ab927ff6bca8f5c89ce72c`, reports `queued` at this read. The single existing owned isolated runner219/ci-a511247 has received the job; read-only masked worker diagnostics show progression into the original CI routing/source-preservation step. The API still lacks completed authoritative acceptance, so no Linux gate or final pass is inferred from worker diagnostics. No duplicate runner/run, cancellation, limit reset or workflow change.

The earlier fresh local80/80 and full unchanged historical41/41 results,7CLI fixtures and original8MiB-capacity evidence remain as recorded in the [verified main-CI checkpoint](https://github.com/signal0verse/SignalVerse-AI-Log/blob/5216108291446839a01afc7b15c9fe9169a01006/reports/general/2026-11-04-raw-validator-recognition-main-ci-checkpoint.md). Original historical failures/timeouts remain preserved. No test/expectation/cache/witness/compiler/SQL/build/artifact/Guard gate has been removed or relaxed.

Any live-price source successor requires its **own** exact-SHA capacity/full official CI proof before release; this running SHA cannot accept later bytes. Do not declare the native chart complete while this additional owner requirement is unresolved. Official retained artifact/full tree/modes/provenance/digest, fresh valid backup/readiness, one independent exact-SHA/digest Guard, normal release, complete runtime/chart verification and stable-process observations remain pending.

No new source push, official/retained artifact, approval, application activation, ProductionDDL/DML/migration,scanner/profile/Strategy/Risk/job/PPflagchange,workerstart/enable,privateexchange/order/position/Entry/SL/TP/close action resulted from this audit or private draft. TRUE/TRUE PP flags and disabled canonical worker remain outside this display task. No private-account execution or profitability claim.
