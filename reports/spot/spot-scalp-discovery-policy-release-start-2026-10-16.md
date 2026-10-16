# Spot Scalp discovery policy release started

Date: 2026-10-16. Status: source pushed; official CI pending, deployment not yet completed.

Owner-approved source `de7e1e85b791ac3af3f048b960a4c481b8dbb68d` was fast-forward pushed to `signal0verse/signalverse-main` main and `codex/scalp-risk-discovery-20261016`, preserving predecessor `52844ba671267b193ac061751427008d58623d26`.

[Official push CI](https://github.com/signal0verse/signalverse-main/actions/runs/38849678558) is running on the existing restricted free runner route (2 CPU, 3 GiB). No duplicate CI dispatch or paid hosted job was requested. At this checkpoint 16 steps have completed without a reported failure; this is not a final CI result.

The exact additive SQL release operator additionally passed isolated PostgreSQL rehearsal, complete transaction rollback on an intentionally incorrect expected function digest, profile-byte preservation and predecessor restoration. All 101 accompanying disposable PostgreSQL regression checks passed. No production data was used by these local tests.

The supervised pipeline and existing 10-minute thread follow-up are active. They require full official CI, retained immutable artifact verification, private backup and cold restore, rehearsed additive SQL, independent installed Guard authorization, formal release, matching Paper runtime, both public origin hashes, health and task-only cleanup before claiming completion. Disk headroom was low at preflight; the pipeline enforces space for the database restore, backup and a 2 GiB reserve after CI container cleanup. It stops on any failed gate.

No production database migration, profile save, account activation, forced scan, test trade or order-hold change has occurred at this checkpoint. The verified prior runtime remains active. A separate completion report will be published only after both destinations pass final verification.
