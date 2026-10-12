# Spot scanner Binance metadata failure — 2026-10-13

Date: 2026-10-13, Asia/Kuala_Lumpur. Scope: repair newly introduced Paper
Spot scanner catalog transport; no trading strategy change.

## Diagnosis

Read-only inspection found repeated FAILED runs with SPOT_SYMBOLS_UNAVAILABLE,
zero evaluations and zero buy candidates. Public GETs reproduced the cause:
Binance Spot exchangeInfo was 17,744,065 bytes, beyond the existing Paper 4M response
cap. ticker/24hr was 1,910,702 bytes and worked. A prior CoinGecko HTTP 429 was a separate
provider quota outage, not a missing user API connection.

The Binance documented query showPermissionSets=false and symbolStatus=TRADING
reduced metadata to 2,495,853 bytes / 1,375 active pairs. The original catalog already
requires TRADING and does not consume permissionSets; order types, Spot permission,
identity and quote checks remain. [Official Binance reference](https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#exchange-information).

## Exact change

Source commit: 1301bd65c35b49ec4e1404c1954ab7be496120ab. Only runtime change is a ten-line
annotated block in server/partner-paper/market-ports.mjs to compact the unqualified
public Binance Spot catalog GET. Explicit filtered queries, all other routes,
timeouts, redirect refusal, credential/private/mutation denial and the original
response-size cap remain. The unchanged Futures discovery/ranking/confirmed-trend
rules and canonical Spot decision/allocation/cycle/credit/exit engine remain.
No new API/UI/DB/schema/strategy changes, settings reset, profile activation,
forced scanner run, private order or paid AI acceptance test.

## Evidence

All 86 Spot scanner tests passed in official Linux CI, including the six new
actual transport/catalog tests for oversized metadata reproduction, exact eligible-symbol equality, all 3 venue catalogs,
cap/429/503 preservation and denied credential/private/mutation requests.
The combined Windows suite passed 83/86; three unchanged Bash scheduler cases
could not start inside the Windows sandbox (DLL 0xc0000142). All four actual
scheduler cases then passed outside that sandbox, with unchanged source and no
network/environment-file access. All unchanged Linux scheduler gates and every inherited official CI gate passed.

Pure public-data collector test on the service host, without PaperService/DB/tick:
status OK, errors [],504 Spot symbols,72 evaluations, zero buy candidates,24 seconds.
All 72 failed AUTO quality. Discovery reasons included 57 below score,11 low turnover,
3 high-volatility regime,9 low OI and1 missing 1h confirmation; reasons overlap.
This is healthy filtering, not permission to force a buy or promise performance.

## Publication and limits

**Deployed and verified.** Only the shared Paper runtime was upgraded. Native,
owned/admin and both PHP/terminal runtimes remain pinned to their earlier source;
this fix is served through the existing shared Paper backend for both hosts.
Existing market-provider outages/429 and legitimately zero qualifying buys remain
possible. No claim of real order execution, profitability or lower risk is made.


## Release and actual scheduled result

Exact main-push [CI 38280632910](https://github.com/signal0verse/signalverse-main/actions/runs/38280632910) succeeded with every inherited gate, including 86/86 Spot scanner checks. Retained preparation [38285403778](https://github.com/signal0verse/signalverse-main/actions/runs/38285403778) succeeded; immutable artifact 11762648894, inner archive SHA-256
40751fb1690e7329520130d4d271cffebf00872d94a50cf0dedeeabdd22a67ee,
6,705,696 bytes. Independently compared all 2,226 archived Git blobs and modes.

The new Paper package contains the exact same 14 files; all 13 other file hashes
are unchanged. The original canonical API and packaged 85 declarations match the
active engine. Fresh consistent private SQLite backup and cold restore verified
integrity, foreign keys, schema and all table counts before activation. Existing
env, unit, data path, scheduler and controls were preserved. Atomic release
switch retains the previous f447bdc package for rollback; unsigned private HTTP 401.
No PostgreSQL migration, core/owned/admin/PHP/frontend rollout was needed.

Actual four-service cwd/health checks pass: Paper 1301bd6, native/owned/admin f447bdc.
Both public host manifests still correctly identify their unchanged f447bdc frontend
and respond 200. The deployed Paper public catalog returns 504 symbols with valid
BTC/ETH reference metadata and liquidity. No customer command or exchange action
was used for acceptance.

The user's already enabled normal server scan then completed after deployment:
2026-10-12T17:44:59.813Z (2026-10-13 in the stated local timezone), status OK,
errors [],73 evaluations,0 buy candidates,73 rejected. Reported reasons: 58 below-score,
12 low-turnover,10 low-open-interest,3 high-volatility; reasons overlap. This was
passively read, never operator-triggered. Profile stayed enabled with its prior
settings. Thus the earlier catalog failure is repaired in actual scheduled use;
zero candidates now means no confirmed buying opportunity in that scan.
