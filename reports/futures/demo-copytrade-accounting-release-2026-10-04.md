# Standard Futures Demo accounting — official release completed and independently verified

## Executive result

PASS: the reviewed Demo accounting presentation fix is deployed at exact SHA `f1f4981d48a26ed2aa88af4d46186266b5748dcb`. Official main/push CI, retained artifact verification, separately owner-authorized fresh Guard, official release and independent runtime/public-bundle checks passed. No accounting-backend/financial-data change, migration, PP activation or exchange action was performed. Detailed failed intermediate CI evidence is retained below; it is not final acceptance.

## Metadata / authorization

- Date: 2026-10-04; task: DEMO-COPYTRADE-ACCOUNTING-RELEASE.
- Owner requested the existing Demo accounting display fix be deployed, then explicitly approved the narrowly bounded release-scope contract repair after the previous gate blocked correctly.
- Scope: Standard Futures Demo display, help text, exact-content successor and offline tests. No accounting backend, balance settlement, financial history, exchange execution, PP activation or migration.
- Isolated checkout: `tmp/futures-demo-accounting-20261004`, branch `codex/futures-demo-accounting-20261004`. Primary checkout and concurrent private work preserved.
- Parent / main before: `14c68c785cfbf8fbca34f006d636e3891b2db2de`.
- Initial source commit: `ee419c6fa59b32ccf69d1b1629dec79f1b67957b`.
- Final source/main: `f1f4981d48a26ed2aa88af4d46186266b5748dcb`. Its parent is `9080ff165cb157c583f3aba356c1d61315a8ac1e`, whose parent is the initial source commit.
- Three normal fast-forward pushes, each preceded by exact remote-parent verification; no force, rewrite or merge. Application bytes are identical between all three commits; the latter two repair only historical test integrations.

## Defect and correction

Demo deliberately does not model funding. Its canonical final net PnL is therefore unavailable. The prior UI used the Real confirmed-net gate for Demo too, hiding complete stored gross/fee results from history, aggregate statistics, calendar and closed-trade details.

The display now uses stored gross PnL minus stored modeled fees for closed Standard Demo rows with valid timestamps and complete finite gross/fee evidence. It explicitly labels this as Demo results excluding unmodeled funding, not confirmed real net profit. Missing evidence remains unavailable; zero funding is not invented. Existing virtual balance continues settling gross PnL. No balances/history are recalculated or backfilled.

Real final-net evidence requirements, Fast Trader, Spot, open-position controls, Entry, SL, ONE TP, manual Close, reanalysis and native protection remain unchanged. This task does not certify that every one of the 98 screenshot rows has complete historical fees.

## Exact changed files

1. `src/app/App.tsx`: three existing Standard display consumers plus helper import; unrelated functions and open-position markup preserved.
2. `src/app/copyTradeAccounting.ts`: pure presentation projection and honest Demo cost-basis explanation.
3. `api/analyze.ts`: help-description prose only; no executable handler/analysis change.
4. `scripts/futures-demo-accounting-ui-test.mjs`: 33 offline helper / actual React and UI computation tests.
5. `scripts/futures-demo-accounting-scope-test.mjs`: final 62 exact-tree and negative-scope tests.
6. `scripts/lib/futures-demo-accounting-delta.json`: frozen exact 14-path successor inventory and normalized-content hashes.
7. `scripts/lib/futures-demo-accounting-parity.mjs`: validates actual complete tree before exposing historical test views; proves unrelated source and earlier assertions preserved.
8. `scripts/lib/futures-pp-ui-removal-parity.mjs`: narrow successor integration, retaining prior immutable manifest and checks.
9. `scripts/futures-pp-ui-removal-scope-test.mjs`: run old snapshot assertions through the independently verified historical view.
10. `scripts/futures-profit-protection-ui-cleanup-test.mjs`: same historical-view integration; actual current UI is tested independently.
11. `scripts/futures-profit-protection-ui-test.mjs`: imports new Demo UI/scope and economics tests through the existing official CI step.
12. `HANDOFF.md`: additive task and scope authorization record.
13. `reports/futures/demo-copytrade-accounting-display-2026-10-04.md`: preserved original local-validation report. Its uncommitted/not-deployed statements describe that earlier checkpoint, not the later source promotion.
14. `scripts/futures-manual-profit-reentry-test.mjs`: historical App comparison through the verified successor only; original runtime fixtures and assertions preserved.

Final source delta: 14 files, 630 insertions, 25 deletions. No workflow or Guard changes. Prior reentry and PP UI scope manifests remain byte-identical.

## Why the contract repair is bounded

The old exact PP UI inventory correctly rejected the subsequent Demo fix. The new contract checks every actual changed and untracked source path, exact reviewed content, its own integrity, the preserved App declarations, unchanged open-position markup, help-only API delta and reversible test integrations. Only then may historical tests inspect their unchanged historical snapshot. Altered source is not projected away. Old assertions/manifests are not relaxed to a broad allowlist.

Negative tests reject missing/changed reviewed files, unrelated/protected paths, altered Manual Close, reanalysis, SL/TP, Fast Trader and Spot. Production worker, accounting, strategy, scanner, adapters, migrations, operational tooling and workflows have zero source diff. No runtime source is substituted by a historical test view.

## Local validation

- Existing Demo/economics/simulation UI suite: 230/230 PASS from initial fix; actual regression reproduced 0/2 before, 2/2 after, using complete synthetic gross/fee pairs.
- Fresh official PP UI/policy/adapter plus Spot scope suite: 538/538 PASS; zero failed/skipped.
- Fresh Demo + previous PP UI + reentry scope suite: 133/133 PASS; zero failed/skipped. Suites overlap; totals are not additive unique coverage.
- Official `node scripts/futures-profit-protection-scope-test.mjs --types`: PASS. Frontend 72 historical / 71 candidate diagnostics; API 30 / 30; zero introduced in either comparison. Historical whole-project diagnostics are not misrepresented as a clean TypeScript build.
- Independent exact-parent comparison previously passed: full 71/71, API 65/65, zero introduced; strict new helper check passed. Different baseline scopes explain different counts.
- Web and Admin builds: PASS. Existing Web large-bundle warning remains.
- In-memory Node 22 API bundle check: 14/14 PASS; no handler executed.
- New test/helper syntax and `git diff --check`: PASS.
- Node: local v22.23.3; TypeScript 5.7.3. No live credential/API bootstrap in tests.

## Official CI

- Workflow: `Production CI`, `.github/workflows/production-ci.yml`.
- Run: `37196911666`.
- SHA: `ee419c6fa59b32ccf69d1b1629dec79f1b67957b`; branch `main`; event `push`.
- Initial result: FAILURE. Job 111420592161, step 23 (Test opt-in Futures Profit Protection without private services), exit 1 at 2026-10-04T10:57:35Z. Job completed 10:57:37Z. No artifact/Guard/release followed this failure.
- No manual CI dispatch.

## Read-only Production preflight

Evidence collected 2026-10-04T10:56:08.923778Z–10:56:10.243591Z through the existing official SSH route and bounded read-only checks.

- Marker, app/admin symlinks and main/admin/observer process directories: `14c68c785cfbf8fbca34f006d636e3891b2db2de`.
- Main/admin/observer PIDs: 3429041 / 3429036 / 3429034; active/running; NRestarts=0; start 10:07:44Z.
- PostgREST / receiver PIDs: 1960930 / 2210596; active/running; NRestarts=0.
- Canonical PP worker: disabled / inactive / PID 0; not started.
- PP flags: existing real_enabled=true and demo_enabled=true, unchanged. These stored flags do not demonstrate operational PP; do not misreport them as OFF.
- PP control fingerprint: `411677de88aec39415a53ef1560ff005`; close intents=0.
- SQL explicitly `BEGIN READ ONLY`, 5-second statement timeout, ROLLBACK; aggregate/control metadata only. No account/trade records exposed.
- Official local application health, public-info, admin health, public health and homepage: HTTP 200. Admin exact release and all readiness flags verified.
- An initial read used incorrect guessed marker/admin paths and `/api/health` (404). Correct installed paths and official `/healthz` were subsequently verified; no runtime failure or repair was inferred from those lookup errors.
- Installed receiver/helper/coordinator SHA-256: `c4d421918c57b6667ee317a3dfe51068a5c6dc7f89ea6c8fac8c1c13f7c15baa` / `acfca03b4a4b1d92165efaf937a3217ac609959c3687849f984a00a0795f7c83` / `928eefc39677fe27242f8d2762d7fb3de97bebd2ff8678c20e86ff22188ce308`.

## Remaining gates / safety

Exact-SHA successful CI, official retained artifact preparation, independent byte/provenance verification, fresh exact-SHA/digest owner-authorized Guard, official release and independent post-deployment verification are separate gates. No earlier approval/claim may be reused. No migration is required.

At this checkpoint:

SOURCE_PUSH=YES
DATABASE_MUTATION=NO
MIGRATION=NO
DEPLOYMENT=NO
GUARD_CREATED=NO
WORKER_STARTED=NO
PP_FLAGS_CHANGED=NO
ACCOUNTING_BACKEND_CHANGED=NO
EXCHANGE_CALLS=0
ORDER_CHANGES=0
POSITION_CHANGES=0
SL_TP_CHANGES=0
CLOSE_ACTIONS=0

Zero actions refers to this task; unrelated autonomous production trading was not paused or claimed absent.

## Exact first-CI failure and narrow correction

The new scope collector incorrectly treated three untracked files produced by earlier official CI steps as extra source:

- `output/partner-copytrade/main.mjs`
- `output/partner-copytrade/manifest.json`
- `output/partner-copytrade/native-service-test.mjs`

Actual assertion: `Exact Demo accounting inventory`, at `scripts/lib/futures-demo-accounting-parity.mjs:76`. Failed tests: legacy PP parity, historical App preservation, historical protected-path preservation. CI test process recorded 227 passed / 3 failed / 0 skipped before abort; later tests/steps were not accepted as run. Initial CI had 24 successful job steps, 1 failed, 17 skipped (42 including setup/cleanup).

The generated paths are explicitly emitted by unchanged `scripts/build-partner-copytrade.mjs` and `scripts/partner-copytrade-native-service-test.mjs`, before PP validation in the official workflow. Reproduced locally by running those exact offline generators: build PASS, native tests 7/7 PASS, then the same scope inventory failure. These were absent in the earlier local test order. This is a task-created test integration defect, not a Production accounting/Worker failure.

Correction remains inside the authorized release-contract repair: exclude only those three exact **untracked** test products from the source collector; never exclude tracked/staged changes or any other output path. Do not blanket-ignore output/, alter generators, remove assertions, or change workflows/application code. Ten additional regressions prove untracked exact products are accepted, tracked versions remain rejected, and unknown/lookalike/nested outputs remain rejected. Exact source hashes and self/manifest integrity are renewed for the corrected test contract. Historical manifests remain unchanged. Full official local PP suite/scope checks are rerun with the generated products present before the subsequent normal commit/CI gate.

Read-only Guard preflight at 2026-10-04T10:58:12.001Z for the initial source SHA found approval=false, claim=false, incoming archive=false; installed inspectApproval returned AUTHORIZATION_MISSING. Nothing was issued or consumed.

Correction validation: 595/595 PASS (0 failed/skipped) across official PP policy/adapters/UI, Demo UI/economics, reentry and Spot scope tests with the actual generated products present. Official scope `--types` PASS again: frontend 72/71, API 30/30, zero introduced. Ten new output-source distinction tests are included. Build/API source remained byte-identical to the already-built initial commit. No generated test product was staged, committed or published.

Second commit: `9080ff165cb157c583f3aba356c1d61315a8ac1e`; only scripts/futures-demo-accounting-scope-test.mjs, scripts/lib/futures-demo-accounting-delta.json and scripts/lib/futures-demo-accounting-parity.mjs changed (33 insertions / 6 deletions). Main fast-forward from ee419c6 to 9080ff1 verified. No release follows unless the new exact-SHA automatic CI succeeds.

## Second CI: historical reentry consumer

Run 37197536324 on exact 9080ff1, main/push, failed in step 25, `Test manual-profit re-entry admission and closed successor scope offline`. The preceding complete official PP test + scope/TypeScript step PASSED. Job 111422387976 completed after 3m34s; the failed test group recorded 72/73 PASS, one failure, zero skipped. No deployment/Guard/artifact followed.

Actual failing assertion: `src/app/App.tsx`, test `exact base: every non-admission API function and protected module is byte-preserved`, `scripts/futures-manual-profit-reentry-test.mjs:111`. This directly compared the entire current App against the older reentry parent, bypassing the existing successor projection. The approved Demo import/render changes alone broke that historical equality; entry/hold/recovery runtime tests passed.

Narrow repair: import the already-verified successor view in that test and apply it ONLY to its historical App equality. All API/backend comparisons keep reading actual current files. No fixture, expected behavior or assertion is removed. Extend the successor's exact inventory by this one test file and prove that reversing precisely those two integration edits restores its complete old content. The application and every runtime path remain exact ee419c6 bytes. The combined fresh test invocation now includes the complete manual-reentry suite, not merely its scope companion. The original narrower local acceptance missed this consumer; this report retains that limitation and the failed CI evidence.

Final repair validation: 623/623 PASS, zero failures/skips; fresh full scope command PASS. TypeScript/application sources did not change from the immediately preceding successful local and Linux official TypeScript gate. Third commit `f1f4981d48a26ed2aa88af4d46186266b5748dcb` changes only the reentry test and two successor-contract files (9 insertions / 3 deletions). Exact main push verified; final automatic CI run 37198070073, job 111423944414. No artifact/Guard/release was attempted for either failed CI SHA.

## Final exact-SHA CI — PASS

- SHA: `f1f4981d48a26ed2aa88af4d46186266b5748dcb`; main; push event.
- Run: [37198070073](https://github.com/signal0verse/signalverse-main/actions/runs/37198070073).
- Job 111423944414, Build web and API runtime: SUCCESS, 2026-10-04T11:14:45Z–11:20:57Z (6m12s).
- All 42 steps successful; failed=0, skipped=0. Node v22.23.3.
- Exact-SHA Linux official TypeScript: frontend 72 historical / 71 candidate, API 30/30, zero introduced.
- Both formerly failing steps passed: PP policy/adapters/UI + complete scope/TypeScript; manual-profit reentry + closed scope.
- Admin auth, partner transport, terminals/UI parity, Spot scope, owned copy-trading fixtures, historical timing, Futures simulation exits/chronology/accounting/capital/analytics, Real fault fixtures, scanner, Whale, stablecoin, prediction, all disposable PostgreSQL gates, Web/Admin/API builds and artifact-presence checks succeeded.
- SQL tests used new disposable CI clusters; no Production DB migration/write.
- Only runner-image Ubuntu migration notice remained; not a test failure.

## Official retained artifact — independently verified

- Official workflow `production-release-artifact.yml`, prepare-only run [37198514368](https://github.com/signal0verse/signalverse-main/actions/runs/37198514368), attempt 1, exact final SHA, main/workflow_dispatch: SUCCESS. Created 2026-10-04T11:22:20Z; completed 11:22:40Z.
- Artifact ID `11301677493`, name `production-release-f1f4981d48a26ed2aa88af4d46186266b5748dcb-37198514368-1`; created 11:22:36Z; expiry 2026-11-03T11:22:35Z.
- Outer GitHub ZIP: 4,752,964 bytes; SHA-256 `dbacee50f964cb5ce46531a52e886bd353fcea1dd9b252d4a9597bf89a1999ad`.
- Inner `release.tar.gz`: 4,752,019 bytes; SHA-256 `544f693f8289763df936e2e3079f3b886aa18c13dd82f17a052bb519028c8981`.
- Embedded and workflow commit: `f1f4981d48a26ed2aa88af4d46186266b5748dcb`; packaging contract `git-archive-lf-v1`.
- Independently downloaded official retained bytes, validated run/artifact provenance and metadata through the reviewed validator; compared all 790 regular archive members against canonical Git blobs and executable modes. PASS. No extracted archive code executed, no local repackaging or alternate artifact.

## Fresh independent Guard and official release

Immediately before creation, authenticated remote main still equaled the exact final SHA; exact-SHA CI/artifact checks passed again. Read-only preflight at 2026-10-04T11:23:59.171698Z–11:23:59.753507Z confirmed old runtime `14c68c785cfbf8fbca34f006d636e3891b2db2de`, healthy services, unchanged PP control and worker disabled/inactive/PID 0. At 11:24:03.383Z, the target approval, claim and incoming archive were absent; installed helper returned AUTHORIZATION_MISSING.

The owner then explicitly authorized one fresh Guard and official release only for the final SHA, artifact 11301677493 and inner digest above. One approval was created through the existing out-of-band root procedure under the existing deployment lock: exclusive creation, fsync, no-clobber publication, readback and installed helper verification. No old approval/claim was reused or recovered.

- Guard UUID: `ec91d835-c22b-4d41-bb93-42a353852346`.
- issuedAt: `1791113121` / 2026-10-04T11:25:21Z.
- expiresAt: `1791116721` / 2026-10-04T12:25:21Z.
- Exact target/digest verified; root:root, 0600; unused/unclaimed at issuance.
- Manifest SHA-256: `e3a8cfe7b7236e4de1a787104a8378ee8a4174514b88000ace108a3ab963449b`.
- One official `production-release.yml` dispatch used SHA f1f4981, artifact_run_id 37198514368, artifact_id 11301677493 and the exact inner digest.
- Release run [37198705452](https://github.com/signal0verse/signalverse-main/actions/runs/37198705452), job 111425798811: SUCCESS. Run created 11:25:41Z; job 11:25:58Z–11:28:44Z; updated 11:28:45Z. All 11 actual job steps successful; none failed/skipped.
- Exact unit journal: authorization validation=PASS, consume=PASS at 2026-10-04T11:28:39.651549Z; deployment activation=PASS at 11:28:42.008794Z, before Guard expiry.
- No duplicate dispatch, silent Guard renewal, manual application copy, alternate deploy route or deployment-control modification.

## Independent post-deployment evidence

First runtime check: 2026-10-04T11:29:25.798497Z–11:29:26.370044Z. Delivery/source/public-bundle check: 11:29:51.507250Z–11:29:54.876659Z. Final stability check: 11:30:30.275535Z–11:30:31.793671Z.

- `deployed-sha`, app symlink, admin symlink, process cwd and admin health release identity all exactly `f1f4981d48a26ed2aa88af4d46186266b5748dcb`.
- App path `/opt/signalverse/releases/f1f4981d48a26ed2aa88af4d46186266b5748dcb`; admin path `/opt/signalverse-admin/releases/f1f4981d48a26ed2aa88af4d46186266b5748dcb`. Observer runs from that admin release, as configured.
- Main/admin/observer PIDs changed only through official activation: 3429041→3437425 / 3429036→3437420 / 3429034→3437418. Starts 11:28:40Z / 11:28:39Z / 11:28:39Z. All active/running, Result=success, NRestarts=0; PIDs unchanged between both post-checks.
- PostgREST PID 1960930 and receiver PID 2210596 unchanged, active/running, NRestarts=0. No restart of either.
- Canonical PP worker still disabled/inactive/dead/PID 0/NRestarts 0. No worker activation.
- Existing stored real_enabled=true and demo_enabled=true unchanged; control fingerprint remains `411677de88aec39415a53ef1560ff005`; PP close intents remain 0. Explicit READ ONLY transaction and 5-second SQL timeout. Flags are not reported as OFF; worker inactivity and absence of PP close intents are separately verified.
- Application health, public-info, admin health, public health and public homepage all HTTP 200. Admin ok/authReady/snapshotReady/staticReady/databaseReady all true with exact release SHA.
- Delivered incoming archive digest exactly equals the independently approved inner digest; all 790 active source files match its bytes.
- 181 protected source files including PP UI module match the retained prior release. API help prose is the sole reviewed api/analyze.ts exception; all approved source bytes match the artifact. Full source diff independently proves no protected additions/deletions. Worker, accounting backend, migrations, operational and workflow sources unchanged.
- Consumed Guard record retains the exact original manifest hash and root:root 0600; target claim absent, no revocation. Artifact unit now inactive/dead with Result=success, ExecMainStatus=0, PID=0. Its transient start/exit timestamp fields are blank after completion; exact activation timing is supported independently by the journal, not invented from those fields.
- All five installed receiver/helper/coordinator/unit hashes match pre-release; no Guard implementation change.
- Public homepage serves `/assets/index-DvZ6rIYa.js`; SHA-256 `50e6705c336508aeb91fd499a47374356811c82fd5b76b23cdf27d7803871732`, byte-identical to active dist file. Both new Demo coverage labels and honest fee/funding explanation present. Seven removed decorative PP markers remain absent; both independent Fast Trader Smart Exit labels preserved.
- Remote main rechecked after release: exact final SHA. Candidate tracked tree unchanged; only the three known untracked generated CI-test products remain and were excluded from publication.

## Safety and remaining limits

This was a presentation release, not a financial-data repair. No Production DDL/DML, migration, backfill, balance change, account enumeration or exchange endpoint invocation was performed. No order/position/Entry/SL/TP/Close action was requested by this task. Existing autonomous activity was not paused and is not asserted absent. No test trade was manufactured. Normal official application/admin/observer activation is the only service restart in scope.

The delivered public bundle and server source are verified. Local tests exercised the actual React rendering and calculations. An authenticated private Demo account was not opened and its 98 historical rows were not inspected; rows lacking required stored gross/fee evidence correctly remain unavailable. Modeled fees exclude unmodeled funding; this is not confirmed Real net profit and does not change gross virtual-balance settlement.

```text
FINAL_STATUS=DEMO_ACCOUNTING_DISPLAY_DEPLOYED_AND_VERIFIED
SOURCE_SHA=f1f4981d48a26ed2aa88af4d46186266b5748dcb
CI_RUN=37198070073 SUCCESS
ARTIFACT_PREPARE_RUN=37198514368 SUCCESS
ARTIFACT_ID=11301677493
RELEASE_RUN=37198705452 SUCCESS
DEPLOYED_SHA=f1f4981d48a26ed2aa88af4d46186266b5748dcb
PREVIOUS_RELEASE_SHA=14c68c785cfbf8fbca34f006d636e3891b2db2de
OFFICIAL_DEPLOYMENT=YES
PUBLIC_BUNDLE_AND_RUNTIME_VERIFIED=YES
AUTHENTICATED_PRIVATE_UI_VERIFIED=NO
ACCOUNTING_BACKEND_CHANGED=NO
DATABASE_MUTATION=NO
MIGRATION=NO
BALANCE_HISTORY_BACKFILL=NO
PP_WORKER_STARTED=NO
REAL_PP_CHANGED=NO
DEMO_PP_CHANGED=NO
EXCHANGE_CALLS=0
ORDER_CHANGES=0
POSITION_CHANGES=0
SL_CHANGES=0
TP_CHANGES=0
CLOSE_ACTIONS=0
UNEXPECTED_TASK_CHANGES=NONE
```

Counts of actions above are task actions, not a claim of account-wide inactivity. This sanitized report is published separately to SignalVerse-AI-Log/master; the publication receipt is recorded in the task handoff/final response rather than creating an additional application commit.
