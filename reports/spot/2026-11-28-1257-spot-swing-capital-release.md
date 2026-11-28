# Spot Swing Trader capital recovery release verification

- Date: 2026-11-28, Asia/Kuala_Lumpur
- Branch: `codex/spot-swing-capital-release-20261127`
- Integrated repository base: 60464bf2f70d3fcacb76a544422eeb2436c08a99
- Verified previous live source: 7faa83a0353b47f380a180612751c8101227f267
- Ending commit: 4b780fdfd6f8f3fd2245fbe33f5d1ecb21bbcb0e

## Scope

The owner requested the complete production test suite in a separate server
environment and authorized release only after every required gate passed. This
work covers the native Telegram Spot Swing Trader capital and recovery model.
The owner opted to keep the dual-quote Demo profile on its existing policy.

The candidate was integrated on the latest published retirement state. Existing
CI, release workflows and deploy authority byte comparisons are preserved. Exact
legacy comparison inputs are checked against the committed successor inventory.
Raw behavioral, SQL, browser and compiler checks use actual candidate source.
No local Docker or app test was used.

## Evidence before the final workflow

- Integrated subject `79ebda505262` passed 999 isolated tests (44 capital SQL,
  579 scanner admission, 21 notification SQL, 151 direct and 204 engine/display
  cases). Web, admin and API builds passed. Frontend 66/66 and API 30/30 original
  diagnostics matched their full predecessor baselines, with zero introduced.
- Subject `1f0daed56134` passed all 12 actual Persian/English mobile/desktop
  component browser cases. All 12 screenshots were byte-identical to the
  previously manually reviewed images. The only app-source difference after
  the 999-case subject is one floating-help prose line. Changes after the
  browser subject are test-only, checked by an exact file inventory.
- The exact migration was committed on a restored server snapshot. Counts for
  all 140 restored relations matched. The 12 financial/history relation digests,
  legacy settings for blocked profiles, existing account switches, protected
  functions and immutable guard matched the prior state. Two SQLite backups
  passed integrity checks. Five profiles adopted and one dual-quote Demo profile
  kept its policy and quotes in the rehearsal. The temporary cluster was removed.
- The first official run reached 84/84 in the historical routing/source gate.
  The subsequent 607-case scanner/navigation gate passed 605 and failed two
  original retirement diagnostics. The test readers were corrected without
  changing any app or infrastructure bytes. Direct isolated verification on
  `4797bff8766f` passed four cases including both corrections.
- First official run [45976016979](https://github.com/signal0verse/signalverse-main/actions/runs/45976016979)
  failed, so no release was attempted from that SHA.
- The second run [45987712797](https://github.com/signal0verse/signalverse-main/actions/runs/45987712797)
  passed all 607 scanner/navigation cases and 23 successful steps before a raw
  isolated legacy evaluator fixture failed because its function parameter list
  lacked the actual capital policy reader. The four related fixture groups now
  use the actual reader and retain every original assertion. An isolated rerun
  on `697979abd919` passed 141 Spot fixtures, the native order test (including
  43 reported Node cases), and all 14 original entry-gate cases. Existing policy
  and production code are unchanged from the first integrated app subject except
  for the single help line. Hashing the canonical Git blob and reusing immutable
  predecessor diff inventories preserve the original checked witnesses.
- The third official run [46005462844](https://github.com/signal0verse/signalverse-main/actions/runs/46005462844)
  passed 46 substantive steps before GitHub canceled it at the previous
  three-hour limit. Its interrupted Spot presentation log surfaced seven
  legacy fixture references to runtime readers. The candidate supplies the
  actual managed-cycle, membership and native capital-read builders in the
  offline harness. The 85 narrow regression cases and both historical
  workflow-reader checks passed on the isolated candidate.
- The owner authorized a longer run for this release. The workflow gives the
  exact first-party main push from the pinned predecessor up to 360 minutes on
  the isolated runner. The 180-minute default stays in effect for other pushes.
  Test commands and artifact and Guard delivery workflows retain their original
  checks.
- The wider isolated follow-up passed 1,209 of its 1,210 registered Spot
  presentation and history cases. The only failing fixture used the prior cron branch as its
  slice delimiter. The candidate uses the current source delimiter, runs
  the same assertions, and preserves the exact legacy reader under the
  source witness. Four exact follow-up checks passed, including the stopped
  native holdings and reserved-capital reads. The other isolated groups
  passed all 60 Paper/terminal cases, 22 tutorial cases, 246 owned Spot
  cases, 43 native-order Node cases and all 69 native-order assertions.
- The first extended CI definition [46044732478](https://github.com/signal0verse/signalverse-main/actions/runs/46044732478)
  was rejected before job creation. A colon in the release-subject predicate
  broke the unquoted YAML scalar. The whole expression is now YAML-quoted.
  A static parse and an exact comparison verified that the one timeout
  field is the only workflow change.
- The YAML-corrected official run [46045501338](https://github.com/signal0verse/signalverse-main/actions/runs/46045501338)
  started on the isolated runner. The exact-source planning and audit command
  rejected the timeout-only delta to the canonical workflow. Its preserved
  assertion now admits that single digest-witnessed timeout. The real workflow
  digest remains in the plan and every original command remains required.
- The next official attempt [46047592356](https://github.com/signal0verse/signalverse-main/actions/runs/46047592356)
  passed the real full-route planner. The first 84-case self-test gate passed
  82 and identified two older checks that still expected the prior raw
  workflow. The exact historical comparison now reads the verified original
  workflow, and the recognition predicate accepts only the manifest-bound
  timeout successor without walking source. Their original assertions and
  negative cases remain in place.
- Run [46055503530](https://github.com/signal0verse/signalverse-main/actions/runs/46055503530)
  passed all 84 routing/source checks and all 608 scanner/navigation checks,
  followed by the next 38 original steps. The scoped timeout allowed execution
  past 180 minutes. All 1,210 individual Spot display/history assertions then
  reported success, but Node failed the enclosing file because an older compact
  history VM raised an undeclared round-accounting dependency after a test.
  The fixture now loads the real round-accounting module and still rejects
  undeclared imports. Trading runtime and migration bytes remain identical.
- On the final subject `4b780fdfd6f8`, the exact Spot display/history
  command passed 1,295 cases, with zero failures, cancellations, skips or
  post-suite asynchronous errors, on the same Node v22.23.5 build used by the
  official runner. This included the previously unregistered compact-history
  and complete-card tests. The exact release archive was 8,377,532 bytes.
  The full routing plan selected all 75 original gates, and the original
  audit rejected the rehearsal when a mandatory result was absent.

## Production release and acceptance

- [Production CI 46084178099](https://github.com/signal0verse/signalverse-main/actions/runs/46084178099)
  passed all 94 original steps on the isolated server. Exact step names
  and order match the published original run. Both original compiler commands
  passed their four diagnostics comparisons with zero introduced findings.
  The source log reported 1,295 successful Spot display/history cases.
- [Release artifact 46109212598](https://github.com/signal0verse/signalverse-main/actions/runs/46109212598)
  passed all 10 steps. The artifact ZIP and inner Git archive
  were verified against their digests. All 2,810 paths match the exact
  Git blobs and executable modes. The archive was 8,377,532 bytes and
  was delivered using the original independent, single-use deployment authorization.
- [Guarded delivery 46109409471](https://github.com/signal0verse/signalverse-main/actions/runs/46109409471)
  passed all 11 steps. The main SignalVerse Telegram application and admin
  service are both active on the ending commit. The verified additive migration
  committed on 2026-11-28 04:55:27 UTC.
- Five of six existing profiles adopted the new capital model. The
  remaining dual-quote Demo profile kept both USDT and USDC, its saved
  settings, and its prior model as the owner requested. Existing data
  preservation was verified in the isolated restore rehearsal.
- Live acceptance matched all 2,810 installed Git blobs, checked
  17 existing job gates and 4 deployment controls,
  verified both live services, and exercised the read-only capital status
  RPC with a synthetic identity. The publicly served entry JavaScript
  matches the running release. The serving network returned HTTP 403 to
  an initial server-origin probe. An independent public client returned
  the expected entry and exact production JavaScript digest.
- No real order or manually triggered strategy job was used for acceptance.
  The evidence covers the deployed code, migration, data preservation,
  public assets, and the read path.

