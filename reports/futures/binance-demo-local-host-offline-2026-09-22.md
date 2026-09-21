# Binance Futures Demo: local scheduled-test host dependency

## Metadata

- Date: 2026-09-22 (Asia/Kuala_Lumpur)
- Module: external Binance Futures Demo Funding validation schedule
- Mode: scheduling safety only; no exchange credentials, account calls, orders, code changes, or Production deployment
- Application repository: `signal0verse/SignalVerse-Main`, `main` at `306f073106b73c239c507661f79ca220293f7098`
- AI Log repository: `signal0verse/SignalVerse-AI-Log`, `master` from `1ae188edb8e346ad7b47fa64f40020b78fc12f8a`

## Objective

The owner stated that their computer will be off at the scheduled 07:57 local Demo Funding test and asked whether the assistant can continue independently.

## Findings

- **Confirmed:** the existing same-thread scheduled test depends on the local project and scratch execution files. Official OpenAI scheduled-task documentation states that the computer must remain on and the desktop app running for local-file/project tasks. Web scheduled tasks cannot directly use folders on the owner's computer.
- **Confirmed:** scheduled tasks run unattended under default sandbox settings. The earlier public Demo API read required elevated network access after a sandboxed socket denial. Network availability in an unattended local run was not established.
- **Unconfirmed:** whether a separate VPS-hosted one-shot job could safely use the scratch harness and securely provided Demo credentials. Such a job would need an independent close watchdog, exact account preflight, secret handling, and a separate deployment/verification step. It was not created or authorized here.

## Action

Paused the existing one-shot `binance-demo-funding-window-check` local heartbeat (previously scheduled for 2026-09-22 07:57 Asia/Kuala_Lumpur) to prevent a misleading expectation or delayed unexpected trade. Readback of the local automation state showed `PAUSED`. No replacement trading schedule was created.

## Checks and limits

- Official source inspected: `https://learn.chatgpt.com/docs/automations` (local-host and unattended permission sections).
- Application worktree remained dirty with unrelated changes in `api/copytrade.ts`, `src/app/App.tsx`, and untracked work; none were edited or staged.
- No Demo trade, signed account check, Funding income event, or realized PnL occurred in this request.
- The previously reported offline tests remain historical evidence only, not evidence of live Demo execution.

## Next decision

Ask the owner whether to keep the computer and desktop app on for the narrowly bounded local test, or separately authorize a VPS/cloud-hosted design. Do not copy previously shared exchange credentials to the VPS, resume the old schedule, or promise unattended closing until hosting, secret storage, permissions, and watchdog behavior are verified.
