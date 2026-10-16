# Spot Scalp 15-minute confirmation: verified production release

Date: 2026-10-16. Deployed and verified on SignalVerse and the shared CrossVerse terminal.

Source: `0e4cf4a88e7edd2d7676a8584d50488d7b16de6d`. Predecessor: `633898244df01f2706c59a1af9c13d9919da8d14`.
Repository: `signal0verse/signalverse-main`, branch `main`.

## Released behavior

The independent 5-minute technical Spot Scalp project supports the explicit opt-in `confirmationPolicy` version `scalp-15m-v1`:

| Preset | Minimum signed 15-minute score | Additional directional condition |
|---|---:|---|
| Conservative | 4 | Canonical 15-minute LONG required |
| Balanced | 3 | Valid bullish 15-minute evidence required |
| Aggressive | 2 | Valid bullish 15-minute evidence required |

All presets still require bullish 15-minute trend, at least two bullish momentum confirmations, at most one bearish momentum confirmation, complete finite input data and closed native candles. Existing macro protections, 5-minute LONG/setup, candle/structure/selected volume confirmation, fees, liquidity, funds, permissions and durable order holds remain enforced. The canonical signed scores and raw 15-minute WAIT result are preserved; this policy evaluates an independent admission path rather than relabeling canonical analysis.

Selecting a preset or Reset updates a draft; an explicit Save adopts the new policy. Missing-policy profiles retain their existing confirmation behavior. Accepted campaigns retain their frozen policy, including the absence of a legacy policy. Deployment did not save, activate or migrate user settings, force a scan, submit a test trade or alter an order hold. Futures, classic Spot and existing technical discovery/liquidity contracts remain unchanged. Seven-language settings, help and stored reasons display the applicable threshold.

## Verification

- [Official exact-source CI](https://github.com/signal0verse/signalverse-main/actions/runs/38894885358): all 79 steps passed.
- [Immutable artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/38919245677): artifact `12053063742`; all 2400 blobs and modes match the commit. Retained archive SHA-256: `0d9bcf4d502e0b251105990412fc80fd6ea69e1586474a42b66cb814278051f3`.
- Closed 31-file scope, 9 additions and 22 reversible predecessor projections verified.
- Private PostgreSQL/SQLite backups and full isolated cold restores passed. The temporary PostgreSQL cluster had no network or production-directory access and retained 2 CPU / 3 GiB limits and 2 GiB reserves.
- `spot_scalp_confirmation_risk.sql`, SHA-256 `862102cdf6e012ac0f6497ae7e98a88f163149ce014d62a33c91c23f5056f87b`, was rehearsed and applied under the deployment lock. Scope: one new security-invoker validator, two new profile CHECK constraints and changes to two native/owned admission wrappers. Existing function privileges, unrelated catalog objects and all profile bytes were preserved. Local failure-injection checks proved complete rollback on both definition and constraint mismatch.
- Installed independent Guard approved the exact source/archive digest.
- [Official production release](https://github.com/signal0verse/signalverse-main/actions/runs/38920714998): successful.
- Native, owned, admin and Paper processes/health verified at this source. Paper's 13 executable files and provenance matched a fresh exact-source build. Both public origins served matching terminal manifests and asset hashes/lengths; native frontend/analytical worker assets also matched.
- The initial CI attempt stopped at the disk-reserve guard. With explicit owner approval, three older task release directories were retained in a verified private local archive and removed only after full live-tree comparison and no-active-reference checks. Active and immediate predecessor releases and every backup were preserved. The same CI was retried; no gate was bypassed, unrelated job cancelled or paid GitHub runner requested. Task runner/container and temporary restore resources were cleaned up.

Before push: 428 integrated, 325 isolated PostgreSQL, 32 technical/layer/replay/tool and 34 scope checks passed, along with scoped strict TypeScript, terminal build and Persian UI inspection. Official CI above remains the release gate.

This verifies deployed code and database contracts. It does not claim a private account filled an order or that any strategy is profitable.
