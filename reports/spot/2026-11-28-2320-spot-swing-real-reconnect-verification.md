# Real Spot Swing reconnect verification

- Ending commit: cf498906f59b158485c876dc29ab200ee76adc6b
- Verified active runtime: cf498906f59b158485c876dc29ab200ee76adc6b

Read-only PostgreSQL checks matched the account by its stable Telegram
identity. All 41 scoped Real table queries returned zero, including Spot
setups, cycles and orders, Futures setups and trades, and scanner profiles.
Scoped Demo setup and cycle queries remained populated. The bot and its
database API were active.

The live capital-status RPC returned the current Spot Swing capital policy
version with no saved Real profile. Under the application database role,
the live calculation validated a synthetic 10,000-unit capital policy at
1 percent and returned a 100-unit base allocation without writing rows.
In the checked source, a fresh native Spot Swing settings form defaults to
the total-capital policy with 1 percent base entry per scenario. Saving and
starting the scanner is an explicit action in the Real settings panel.

The Binance account connection was absent at verification. A live setup or
order cannot establish end-to-end configuration or execution evidence until the
owner reconnects and enables the scanner with the chosen capital. The
verification used reads only. Application source, settings and the venue
were left unchanged.
