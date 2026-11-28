# Owner-authorized Real trading data cleanup

- Ending commit: cf498906f59b158485c876dc29ab200ee76adc6b
- Verified active runtime: cf498906f59b158485c876dc29ab200ee76adc6b

The account owner asked to erase the account's Real trading records and confirmed
that its positions and orders had been closed on the exchanges. The bot's ledger
identified the account through its stable Telegram identity. The owner confirmation
covered specifically identified stale exchange records that lacked venue
reconciliation through the current connection.

A scoped snapshot was restored in an isolated PostgreSQL instance on the server.
The rehearsal caught a serialization precision issue, deferred foreign-key
events, and a slow foreign-key lookup. The final transaction passed against the
exact schema and restored row hashes. Foreign keys stayed active, transactional
helper indexes were removed, and the original ledger trigger definitions and
enabled states were verified before commit.

The production transaction deleted the account's Real Spot and Futures data,
including execution records, order history, and dependent trading records.
An independent database read confirmed zero in all 41 scoped table queries.
Before-and-after hashes verified retention of sampled account, exchange
configuration, Demo, and credit data. Both bot and database API services were
active after the transaction. The temporary isolated database and the
operation-specific data snapshot were verified removed after completion.

The application remained on the verified runtime SHA. This operation used
database transactions. Existing service backup retention was left intact.
