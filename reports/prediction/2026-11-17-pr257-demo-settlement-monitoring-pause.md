# PR 257 Demo settlement monitoring paused — 2026-11-17

At 20:12 MYT on November 17, an owner-scoped, read-only check matched both
original scheduled Demo positions. Both were open, with no final outcome or
net PnL recorded. The active deployment was `0578551fa195c17a24d1384bc7579db3a66a824f`. The latest
resolver run succeeded. Real Prediction was disabled and no automated learning
run was observed after the positions opened. This monitoring task changed no
production settings or rows.

The recorded market end times are November 20 at 01:00 MYT for the daily
market and November 23 at 13:00 MYT for the weekly market. Actual settlement
depends on the official market outcome and the next successful resolver run.

Monitoring stopped at the owner’s request. The owner plans to return on the
settlement date. The final read-only reconciliation of outcome, gross PnL,
modeled fee and net PnL is pending. No statistical validation was performed.

[Deployment and activation report](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/prediction/2026-11-17-pr257-controlled-release-and-owner-demo.md)
