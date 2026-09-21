# Binance Futures Demo Funding — isolated VPS one-shot scheduled

## Metadata

- Date: 2026-09-22 (Asia/Kuala_Lumpur); setup verified through 2026-09-21 17:00 UTC
- Task: one external ETHUSDT Binance USDⓈ-M Futures Demo funding-crossing technical test
- Mode: scheduled, **not yet executed**; no new exchange order in this report
- Application repository: `signal0verse/signalverse-main`, documentation-only HEAD `7a8f2a5` (`[skip ci]`)
- Active executable Production SHA observed before setup: `d38ce3f1c39933b747ebf94874e1d6d75dc00924` (unchanged by this work)
- AI Log repository: `signal0verse/SignalVerse-AI-Log`, `master` from `ed8493d2c9fe95a9f4535da994071f232712766d`

## Objective and scope

The owner said their desktop would be off at the settlement window and authorized moving the previously bounded Demo test to the VPS. The original one-entry envelope remains: ETHUSDT only, at most 25 USDT notional, leverage 1, native stop/target, intended stop loss under 1 USDT, confirmed flat within ten minutes. This does not authorize Real, Spot, application strategy changes, repeat orders, or a Production deploy.

## Actions taken

1. Read the repository safety/trading handoffs and safe test runbook. Preserved other contributors' dirty worktree changes.
2. Verified the pinned VPS SSH destination and port, Node 22.23.2, UTC/NTP, disk capacity, exact active Production SHA, and public connectivity to `demo-fapi.binance.com`. Created only `/var/lib/sv-demo-funding-20260922` and a dedicated no-login `svdemofund` account. The package is outside the Production release, runtime, database and app scheduler.
3. Added an isolated one-shot watchdog that cannot submit an entry. It reads the durable entry identity and exchange position, can submit at most one uniquely identified reduce-only close for verified owned exposure, resolves uncertain acknowledgments by client ID without a second POST, cleans only owned protection, and restores the recorded ETHUSDT leverage after flat. A wrong/unrelated identity stops without mutation.
4. Packed only the scratch Demo harness, four offline test files, the TypeScript parser and `api/copytrade.ts` as data for actual-function extraction. No application bootstrap, Production environment file, database URL, token, or private account artifact was packed. Transfer SHA-256 matched on the VPS before extraction.
5. Used systemd encrypted credential transport for the previously supplied Demo-only key; no plaintext credential file, source file, Git commit, or unit contains the key. The encrypted file is root-only (mode 0600). A first read-only service start failed because of a Windows carriage return in the transported credential; the encrypted credential was normalized without printing the secret and the preflight was rerun successfully. The system warned that its host credential-secret file is not on encrypted media, so at-rest protection is not equivalent to a hardware-backed vault. The owner should rotate the Demo key after testing.
6. Installed independent systemd units with `svdemofund`, no new privileges, read-only system filesystem except their scratch results, explicit network families, and runtime limits. Enabled one-shot timers: main 2026-09-21 23:57:35 UTC, watchdog 2026-09-22 00:06:20 and 00:07:15 UTC, read-only reconciliation 00:20:00 UTC. `Persistent=false`; no recurring trade. The local Codex heartbeat remains paused.
7. Added a documentation-only entry to `HANDOFF.md`, committed/pushed as `7a8f2a5` with `[skip ci]`. No executable application file was staged or committed.

## Tests and evidence

- Local offline: funding rules 3/3, execution cycle 5/5, watchdog 4/4, post-funding reconciliation 2/2; total 14/14.
- Same 14/14 passed on the VPS under the restricted `svdemofund` user with Node 22.23.2; no exchange credential needed for those tests.
- `systemd-analyze verify` passed for all seven service/timer definitions; VPS calendar parser resolved exact UTC times and NTP was synchronized.
- Authenticated Demo read-only preflight on VPS at 2026-09-21 16:57:55 UTC: 14/14 GET responses HTTP 200; account can trade, no open position/regular order/algo order, one-way position mode, positive available collateral, ETHUSDT perpetual TRADING and exchange filters compatible with the envelope. This is a point-in-time check; the main harness rechecks immediately before any entry.
- Manual watchdog smoke before any execution journal returned `NO_JOURNAL_NO_ACTION`, zero mutation. Production service remained active after timer activation.

## Result and limits

**SCHEDULED_NOT_EXECUTED.** No new Demo order, fill, Funding income, realized PnL or ten-minute closure has occurred yet. Offline mocks and a clean preflight do not prove exchange execution or profitability. If network, credential, account state, Funding schedule/rate, order identity or protection is uncertain at the event, the one-shot entry must stop without trade. Native protection plus process-timeout and independent watchdog reduce exposure but cannot guarantee closure during a total exchange/network outage. An inconclusive or missing Funding event must not be called PASS.

The server will retain its private execution journal and read-only reconciliation output for inspection after the event. No automatic message can be promised from this local Codex task while the owner's computer is off. The final result must be read back from VPS and exchange before any main-code change is considered.
