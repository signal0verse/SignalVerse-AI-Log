# Public-source audit: Scalp campaign confirmation and hourly admission

Date: 2026-10-18 (Asia/Kuala_Lumpur).

Source reviewed: `666514422455a56130a8511af4f1f5906484cfd8` in `signal0verse/signalverse-main`.
No source change, commit, deployment or production mutation was made by this audit.

## Separate policy authorities

The [15-minute confirmation module](https://github.com/signal0verse/signalverse-main/blob/666514422455a56130a8511af4f1f5906484cfd8/api/_shared/spot-scalp-confirmation-policy.ts) maps Conservative, Balanced and Aggressive to minimum scores 4, 3 and 2. `scalpCampaignConfirmation` selects accepted decision snapshots when an open campaign exists. The native context builder and Paper scenario analysis reuse this frozen technical policy. Editing the scanner profile does not rewrite accepted campaign evidence.

Hourly admission has a different authority. [Technical entry validation](https://github.com/signal0verse/signalverse-main/blob/666514422455a56130a8511af4f1f5906484cfd8/api/_shared/spot-auto-scanner.ts) reads `profile.options.hourlyPolicy`, requires the current run to carry the same policy and recalculates admission from the recorded numerical context. Native and Paper technical `mayStart` paths use this validation for subsequent scenarios too; the classic-only continuation shortcut does not apply to technical Scalp.

The [preview builder](https://github.com/signal0verse/signalverse-main/blob/666514422455a56130a8511af4f1f5906484cfd8/api/_shared/spot-scalp-scenario-preview.ts) combines frozen-campaign technical analysis with current scanner entry evidence and records the hourly admission separately. Therefore a displayed campaign 15-minute minimum does not identify the risk level used by current hourly admission.

## Focused verification

Three existing offline tests passed: hourly state/numerical boundaries; final JavaScript admission across symbols and venues; and exact policy preservation in native/owned and isolated Paper saves. A pure comparison also confirms that positive-component neutral hourly context is admitted by Balanced and rejected by the legacy strict policy. These checks make no provider or production account calls.

This report describes public source behavior only. It contains no live or Demo observations, selected account settings, asset names, account identifiers, balances, transaction history, screenshots or private audit readings.
