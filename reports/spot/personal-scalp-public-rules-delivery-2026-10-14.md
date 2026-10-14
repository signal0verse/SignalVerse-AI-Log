# Independent technical Spot scalp — public rules and personal settings

Date: 2026-10-14 (owner local date)
Status: DEPLOYED_AND_VERIFIED_ON_BOTH_SITES

The original automatic Spot scalp scanner remains in its existing Manual /
Automatic tabs. The second technical workspace is independent: its own saved
profiles, revisions, runs, setup identities, list and history. SignalVerse is
the engine authority; CrossVerse uses the shared terminal and owned runtime.
No Prediction Market, Stablecoin or Whale feature implementation was added.

The new workspace has coins on the left, the native five-minute chart on the
right, accepted buy/profit levels, actual fill markers and per-coin history below.
Settings is a separate dashboard. Its navigation includes Scalp, Settings, Total
accounting for this project only, and the existing Exchange API account manager.
Demo and Real use separate profiles, data, chart, history and accounting. Mode
navigation does not itself activate an account or send a trade.

Fresh technical defaults are ten targets, maximum100, top200 verified asset
identities and automatic scenario/ladder allocation. Fiat stablecoins are excluded
as base assets. Verified physical gold/silver token identities do not borrow
unrelated SILVER/XAG derivative symbols. Actual venue metadata determines valid
USDT/USDC pairs; one pair freezes per accepted setup. Same base/venue collisions
across manual and both projects remain blocked; different venues remain allowed.
Quote balances, costs, orders, chart prices, history and profit totals remain
separate. No automatic1:1 stablecoin conversion is invented.

Personal tools-v2 defaults all18 switches on: eight price-confirmation styles,
four canonical momentum votes, Engulfing, Pin Bar, the public NDS node subset,
UTC-day VWAP, prior-ten-bar Relative Volume and estimated Volume Profile.
Save/Reset applies to later analysis; accepted campaigns and older v1 tools remain
frozen. Reduced confirmations and unreachable vote thresholds are explained.
Invalid shapes or volume-only entry selections are rejected. Correlated labels
count as one price event, without a confidence boost. Closed5m data, canonical
15m direction, quote/cost checks and existing credit/plan gates remain mandatory.
Spot remains long-only, with accepted scenarios/averaging and existing profit
exits; no stop-loss or timed purchase/losing-exit rule was introduced.

Primary source research replaced unclear third-party descriptions. Actual-body
engulfing/context and rejection principles follow
[IG's education](https://www.ig.com/en/trading-strategies/how-to-trade-using-bullish-and-bearish-engulfing-candlesticks-191114).
The pin thresholds are declared engineering choices, not universal profitable
constants. NDS uses only the publicly described three-node reversal and higher
timeframe confirmation from the
[original author's public paper](https://www.academia.edu/129627974/NDS_Strategy_English_Version),
not its proprietary mathematical/time model or promotional performance claims.

Volume calculations follow the definitions in TradingView's official
[VWAP](https://www.tradingview.com/support/solutions/43000502018-volume-weighted-average-price-vwap/),
[Relative Volume](https://www.tradingview.com/support/solutions/43000635874-how-do-we-calculate-relative-volume-and-relative-volume-at-time/)
and [Volume Profile](https://www.tradingview.com/support/solutions/43000502040-volume-profile-indicators-basic-concepts/)
references. The implemented profile verifies300 native closed1m candles against
the last60 closed5m candles, uses32 uniform OHLC-range bins and an at-least70%
value area. It is explicitly an estimate, not actual trade-at-price/order flow
or an exact TradingView clone. Missing enabled evidence keeps new entry WAIT.

Harmonic confluence was checked against
[Scott Carney's original definitions](https://harmonictrader.com/harmonic-patterns/gartley-pattern/).
RTM and ICT remain explicitly public-rule adaptations, referenced to
[ReadTheMarket](https://readthemarket.com/what-is-rtm/) and
[the original ICT author's site](https://www.theinnercircletrader.com/).
The source documentation distinguishes these subsets from complete private
methods. This is deterministic rule implementation, not fitted ML training or
evidence of live profitability.

The cash forecast preserves configured capital and accepted percentages. It
does not shrink a5000-unit budget because only110 units are free. A sequential
read-only estimate shows covered accepted stages and the next deposit shortfall,
including the observed buy fee. Filled/resting/cancelled legs are not counted as
new buys; future automatic ladder splits await their own analysis. Unknown/stale
cash, fees or execution never become zero or an invented balance. Demo reads no
real balance. The preview's110/5000/40.15 numbers are synthetic, not account data.

Native second-project MEXC/Gate MARKET dispatch has a durable server-only campaign
batch. Actual acknowledgements and all cycle projections must persist before its
hold completes. Lost/malformed ACKs, crashes or failed projection writes retain
PREPARED indefinitely, without automatic retry/clearing. Concurrent and stale
accepted-state dispatch is rejected. Known BUY claims can backfill without buying
again; bounded deterministic client IDs preserve slot/attempt identity. Admission,
retirement and funding respect uncertainty, including a partially closed cycle.
The old cycle-edit route rejects technical campaigns before mutation. Classic /
manual edits and owned LIMIT execution retain their prior behavior.

Actual display-source isolated checks:424 PASS (181 engine/tool/quote/forecast/native and
LIMIT checks plus243 UI/namespace/source-scope checks), zero failures/skips.
Original allocation/scope comparison:293 PASS, with all70 existing allocation
assertions retained. Complete API/UI type comparison:2 PASS with no introduced
diagnostics and no compiler-library or diagnostic-comparator weakening.
The durable-batch suite includes14 actual-helper/AST cases. Disposable PostgreSQL
tests and the independently witnessed migration each passed34 checks using no
production data. Full terminal built successfully; API and owned runtime compiled
without service initialization. Both PHP source snapshots had passed isolated
fixtures: client34 tests/177 assertions, supplier29 tests/228 assertions.
These are functional/code checks, not private order execution or a market backtest.

Fully passed trading/runtime parent: ab3e07aa75718ea0118eff62c1aa20bc8055d356.
Parent full CI: https://github.com/signal0verse/signalverse-main/actions/runs/38448596839
Presentation source: d45be3239c48310fa639490625a37bd4d83f1799.
First test/documentation-only source: 30888cfc4a3215622026f1d70f603227981fadf8.
Final test/documentation-only source: 05dc5253bfc3bf22c370037b26682aeb752adedf.
Exact main CI: https://github.com/signal0verse/signalverse-main/actions/runs/38479658445

The second main CI38471127634 passed the repaired cap fixture and stopped at an
existing shared UI translation check: the application correctly used Latin2,
but its version-label expectation still required Persian2. Only that exact label
expectation changed; all121 original translation/explanation/no-guessed-price/
history checks remain. Remaining offline fixtures and current project/scheduler
scope passed358 cases (121+19+27+34+157) with no failure/skip. A source-only AST
audit of tests referencing all25 edited UI modules found no remaining positive
Persian/Arabic digit expectations. The initial Windows sandbox could not start
Bash (0xC0000142); the same fake-curl/temp-gate tests passed outside that startup
restriction with no source/assertion changes. Both failed main runs remain failed
evidence, never approval. All frontend/API/server/SQL/workflow/dependency bytes
are unchanged from the reviewed display source; full exact new-main CI is still
required. The earlier424/293/2type/build/seven-language checks are evidence for
this unchanged frontend/runtime, while the additional358 checks cover the final
display-expectation/current source-scope successor.

The first exact display-source main CI38462249600 failed at its existing parity
UI cap explanation: it still expected Persian digits while the owner-approved
UI correctly displayed Latin50/50. The original maximum/zone/financial/property
and release-scope checks remain. Only that exact display expectation changed,
with an additional non-Latin digit rejection in the same form;206 focused
functional/scope/source checks passed with zero failures/skips. Its four-file
successor changes only this test, append-only handoff/runbook and the current
exact reversible manifest. UI, all API/server/runtime/SQL/workflow/dependency
bytes remain identical to the display source. Failed CI evidence was retained;
it is not release approval. New exact-source full main CI remains mandatory.

The owner's final display instruction uses Latin0–9 digits and Gregorian dates
in every supported language. Shared UI formatting, numeric/date input language,
localized numeric labels and scalp chart/select typography now implement it.
The actual preview's seven language views and English numeric inputs passed;
Persian cycle/history show2026 rather than a Persian calendar year. Existing
UTC/local zones and stored ISO instants stay unchanged. Independent source AST
comparison proves the29-file successor changes only these declared display
exceptions/documentation/manifest: API/server, SQL, trading logic, dependencies
and CI remain byte-identical to the fully passed parent. Source was published by
normal fast-forward only. Complete exact-source main CI remains mandatory before
any activation. Full terminal2120 modules built in19.77 seconds; all original
type/source safety assertions were retained. No profile or settings reset.
The prior dc9df3c full CI failed because two existing AST allocation harnesses
omitted actual quote/project helper dependencies. The final candidate imports
those real pure helpers; no financial formulas or assertions changed. That failed
run remains failed evidence and is not release approval. Two additional isolated
allocation SQL suites passed7+8 checks without production data.
The preceding a655537 CI was intentionally cancelled when the final accepted-level
guard was added. Completed checks had no failed assertion; it is not release
approval. The complete candidate/main CI, exact immutable artifact, private backup/cold
restore, empty additive namespace witness, independent root Guard, official
release and both-site runtime/byte verification have now passed.

**Deployed and verified on both sites.** No customer profile was enabled and no
private exchange order was used for acceptance.


## Exact release proof — 2026-10-14, Asia/Kuala_Lumpur

The first Paper operator stopped before cutover because its diagnostic expected scanner-owned SQLite table names in store.mjs. The checked source places them in scanner.mjs. Only that operator diagnostic was corrected, with added source-byte and read-only schema checks; no application, strategy, guard or financial assertion was changed. The corrected operator then passed and the old attempt remains retained.

Core and all four live trading services: `05dc5253bfc3bf22c370037b26682aeb752adedf`.

[Full trading/runtime parent CI (ab3e07a)](https://github.com/signal0verse/signalverse-main/actions/runs/38448596839) passed.
[Full main push CI](https://github.com/signal0verse/signalverse-main/actions/runs/38479658445) passed.
[Official immutable artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/38486092924) passed.
[Guard-bound official release](https://github.com/signal0verse/signalverse-main/actions/runs/38487389802) passed.

Retained artifact ID `11860012284`; inner archive SHA-256
`696405bdb60fd454bdf1d4ab3c08251aa892e48bef10768a1d5a25d3b24ffcd0`. All `2285` archived Git blobs
and modes matched the exact source; bytes were not repackaged.

Private PostgreSQL/SQLite backups and cold restores preceded the empty
additive migration. Existing scanner and financial rows were witnessed unchanged.
New profiles/runs stayed empty, server-only MARKET journal privileges and durable
hold guards were verified, and the independent one-use root approval bound the
exact archive. No profile/setup enable, order, hold clearing or account reset was
performed. Existing jobs, credentials, service settings and cohort controls stayed
unchanged. Paper source/provenance and its SQLite integrity matched the release;
its operator refuses an incompatible old rollback after new technical state.

Client PHP source `2393c4d3e74f3e1fa10d055d9e4beeda640fe075`; supplier PHP source
`c85e6d40939013bc8305b2bd48db76e1320dc3d5`. Only the independently tested Paper controller
changed. Existing config, static frontend and engine stayed unchanged; guest
commands still received401/419. Rollback releases were retained.

[https://cross-verse.net](https://cross-verse.net) serves source `05dc5253bfc3bf22c370037b26682aeb752adedf` and the exact verified
shared terminal bytes. Unsupported terminal HTML remains404.
[https://signal.easybitpay.com](https://signal.easybitpay.com) serves source `05dc5253bfc3bf22c370037b26682aeb752adedf` and the exact verified
shared terminal bytes. Unsupported terminal HTML remains404.

Refresh an already open site to load the new asset. The original Manual/Auto
scanner remains in its existing section. The second Scalp workspace is separate;
use its Settings to Save and explicitly enable Demo or Real if desired. Demo/Real
profiles, charts, history and accounting remain separate, as do USDT/USDC totals.
Actual supported native pairs, current data, fees, funding, plan/credit and durable
execution uncertainty may still deny an entry. No market backtest, private order
execution, full proprietary NDS reproduction, ML training or profitability was
claimed or verified.
