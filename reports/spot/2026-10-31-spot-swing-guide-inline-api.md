# Spot Swing Trader — dedicated education and inline exchange settings

## Metadata

- Date: 2026-10-31, Asia/Kuala_Lumpur.
- Task ID: Spot Swing guide and inline exchange API.
- Module: Native Telegram Spot Swing Trader.
- Mode: Isolated server validation and guarded main-bot release.
- Repository: signal0verse/signalverse-main.
- Branch: codex/spot-swing-trader-20261028; main.
- Starting commit: 5d5447b407fbc0aa9f78ba367be169a28a18dfc2.
- Ending commit: 1aad4de8c31ad8c03eee6f7b1f145a4e8cdb0875 (documentation); executable f55cba212d92b66b7105be6776138478c1a1f27f.
- Previous runtime: 56e823f009cdfb2d80f7f936c3daa2df1183af08.

## Objective

Teach this feature in its own Education page and keep exchange API management
inside Spot Swing Trader, so users do not have to navigate to Dashboard.
Test on the isolated server and apply to the main Telegram bot.

## Scope

Native technical-workspace presentation, the lifetime of its existing exchange
list read and floating-help knowledge. No financial, strategy, fee, credit,
permission, credential, database, execution-hold or scheduler policy change.
Classic Spot and partner routes retain their existing behavior.

## Actions Taken

1. Added a dedicated Persian/English text guide with twelve collapsible chapters,
   local Settings/API actions and green/yellow/red risk references.
2. Explained explicit Demo/Real and Save/Start, separate strategy/timeframe risk,
   canonical entry/higher-frame mappings, independent chart display, rank scope
   versus active-coin count, staged averaging/common exits, recorded entry
   context, whole-round history, confirmed notifications and Stop semantics.
3. Kept the original shared exchange connection panel inside this workspace,
   with active-tab and return controls. An adjacent notice explains its shared
   account scope and separates Futures margin/leverage from Spot capital.
4. Refreshed the existing authenticated exchange-list GET upon entering/leaving
   the native API page, with a native-only stale-response lifetime guard.
5. Clearly labelled the existing Standard Spot video as supplementary. It loads
   after an explicit click; fallback fullscreen supports exit/Escape and restores
   the prior body scroll without recreating the player.
6. Updated floating-help knowledge, direct tests and release documentation;
   published source/rollback refs and completed the original guarded release.

## Files Inspected

AGENTS.md, CLAUDE.md, HANDOFF.md, current AI handoff, colleague handoff, safe test
runbook, the actual workspace/navigation, exchange components, canonical timeframe
specification, guide, related regression/parity programs, original CI/artifact/
release workflows and existing isolated-runner/release authorities.

## Files Changed

Eighteen task paths; cumulative preserved Spot Swing scope is93 paths including
the generated manifest. The final documentation-only commit changes four report/
handoff paths and the generated manifest; executable source remains pinned.

- `HANDOFF.md`
- `api/analyze.ts`
- `docs/AI_HANDOFF.md`
- `docs/fixes/spot-swing-guide-inline-api-2026-10-30.md`
- `docs/testing/stability-test-runbook.md`
- `scripts/futures-discovery-live-test.mjs`
- `scripts/lib/scalp-confirmation-policy-delta.json`
- `scripts/lib/scalp-confirmation-policy-parity.mjs`
- `scripts/lib/spot-swing-delta.json`
- `scripts/lib/spot-swing-guide-parity.mjs`
- `scripts/lib/spot-swing-parity.mjs`
- `scripts/spot-swing-current-regression-test.mjs`
- `scripts/spot-swing-guide-test.mjs`
- `scripts/spot-swing-scope-test.mjs`
- `src/app/App.tsx`
- `src/app/SpotScalpWorkspace.tsx`
- `src/app/SpotSwingTutorial.tsx`
- `src/app/spot-swing-tutorial.css`

## Root Cause / Findings

CONFIRMED: native technical Education previously opened the Standard Spot tutorial
and its API action navigated to Dashboard. The original authenticated connection
components can be reused in place without another endpoint or credential store.

CONFIRMED: keeping API management local requires refreshing the existing venue
list when returning. Tests with deferred replies also proved that old native-page
responses must not replace newer results. All original GET/filter/selection
statements and every connection/write/validation/confirmation body remain exact.

CONFIRMED: manual Persian layout review found the inline timeframe arrows unclear.
The final guide uses a canonical six-row entry/confirmation table with isolated
number direction. Missing historical fields and synthetic examples are explicit.

UNCONFIRMED: private exchange execution, remote video playback and profitability.
No such claim is derived from isolated UI tests or service health.

## Implementation

ScalpAccountsPage wraps the unchanged ExchangeConnectionsPanel. Only native
technical callbacks select the local accounts page. Classic/partner navigation,
session authentication, API writes, storage, financial payloads and scanner
activation remain unchanged. The read-only GET response guard is native-only.

Direct raw-current tests exercise routes, actual local callbacks, authenticated
GET dependencies and stale replies, canonical mappings, shared components and
financial parity, including deliberate source corruption. Two older App byte
checks use an exact source-checked predecessor projection; every old assertion
remains, and the new raw-current checks execute independently.

The first source archive exceeded the original8MiB limit. A duplicate complete
confirmation-policy JSON fixture is now referenced by immutable Git commit/path
and full SHA256 through the existing lossless loader. The exact full JSON and all
original assertions still execute; altered references/hashes/extra fields fail.
No cached test results or old application code substitutes for current execution.

## Tests Executed

- PASS, server: `node --test scripts/spot-swing-guide-test.mjs`, all9 direct cases.
- PASS, server: `node --test scripts/spot-swing-scope-test.mjs scripts/spot-tutorial-ui-test.mjs scripts/telegram-workspace-ui-test.mjs`, all268 cases,
  including those9 direct cases; standalone reruns are not extra unique cases.
- PASS, server: `node --test scripts/futures-discovery-live-test.mjs`, all48
  cases. A fixed September fixture had aged beyond the existing1000-bar bound
  on October30 and caused the superseded817 candidate's original CI step59 to
  fail with0 evaluated rather than2. Production correctly refused oversized
  candle retrieval. Its clock, retrieval cap and every financial body remain
  unchanged. The fixture now uses a recent completed horizon. All original
  assertions remain byte-exact after undoing only fixture additions. Three fixed
  calendar clocks, including the failure date and a2032 leap date, directly test
  recent COMPLETE/expired UNAVAILABLE/young PENDING and the unrelaxed cap.
  The failed prior run was not deployed and is not final release evidence.
- PASS, server Chrome: six actual-component cases, Persian/English at320/360/
  1200px. Native pointer/Enter, local API/back/active tab, masked modal, table
  direction/mappings, lazy video and fallback fullscreen/exit/Escape/player/scroll
  passed. All24 screenshots manually reviewed. Reads were synthetic; writes
  rejected. Media was intercepted, so no playback acceptance is claimed.
- PASS: [exact main CI](https://github.com/signal0verse/signalverse-main/actions/runs/41097333319), all79 original steps. Four original frontend/API
  compiler comparisons independently verified in authoritative step43/56 logs;
  none introduced diagnostics. Original workflows, timeouts and assertions retained.
- PASS: full148-relation consistent backup and private socket-only cold restore,
  all counts/catalog definitions,6CHECK parser roundtrips,4identical owner-default
  ACL representations and complete bounded-key hashes for7tables. Both SQLite
  snapshots passed integrity/gzip roundtrip; no production SQL replay or backfill.
- PASS: [artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/41121698677), independent full Git blobs/modes/metadata/digest
  verification and original8MiB bound. Archive was neither repacked nor executed
  by the independent operator verifier.
- PASS: [guarded release](https://github.com/signal0verse/signalverse-main/actions/runs/41122636260), one-use root authorization consumed, all
  2650 deployed Git blobs/modes, sanitized admin copy and public assets
  including current guide/API/help markers verified. Existing function hashes,
  privileges, RLS, triggers/index and REST schema cache freshly read back.
- PASS: all22 original control fingerprints,17 job gates,six services and the
  independent Paper pin preserved. No local Windows Docker was started.

Superseded package/browser attempts remain historical. Private harness module,
result serialization and trusted-input/hit-test issues were corrected; the final
tests and screenshots belong to the exact active executable above. No earlier
source receipt was relabelled as final release evidence.

The local status observer temporarily lost repository access after the globally
active GitHub account changed. The same existing run continued on the server.
Observation and later operator commands used the saved repository-owner credential
only in child-process scope; no global login switch, secret file, test rerun or
cancellation was required. This was an observer access failure, not a CI failure.

## Build Result

PASS: focused web/API builds and all original official/release builds.
Canonical source archive:8355267 bytes, unchanged limit8388608.

## Git Status

Reviewed executable, feature branch and rollback refs published without force.
Later documentation-only main/feature HEAD uses skip-ci and remains separate from
the active executable. Current task worktree changes are committed.

## Commit

Executable:f55cba212d92b66b7105be6776138478c1a1f27f
Documentary HEAD:1aad4de8c31ad8c03eee6f7b1f145a4e8cdb0875

## Remaining Issues

No outstanding release action. The older Standard Spot video remains explicitly
supplementary; the dedicated text guide is the reference for new settings.

## Risks / Limitations

Exchange connections remain shared across account features, including original
Futures controls; this is explained beside the inline panel and in the guide.
Risk labels describe selected filter/timeframe groups, not calibrated loss
probability or guaranteed profit. Missing historical values are not invented.
No private-account/order/profile changes, forced scans, paid analysis, forged production
session, Telegram test message or financial-hold removal were used for acceptance.

## Recommended Next Step

Reopen the Telegram mini app. Education contains the dedicated text guide, and
Exchange API settings opens inside Spot Swing Trader with a local return control.
