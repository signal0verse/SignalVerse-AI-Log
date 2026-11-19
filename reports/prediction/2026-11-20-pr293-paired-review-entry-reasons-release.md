# PR 293 Prediction paired AI reviews and entry reasons — 2026-11-20

The exact approved revision bcca682604eb3874fd4cb884703e3d000cdc5713 went live at 2026-11-20 01:37:24 MYT. The previous deployed revision was 58edc149eea3eba4264a7c4e29fabad5a1fb375b.

## Controlled release

- [PR 293](https://github.com/signal0verse/signalverse-main/pull/293) was fast-forwarded to its exact approved head. [Exact PR CI](https://github.com/signal0verse/signalverse-main/actions/runs/44546302609) and exact-main push CI [44561158084](https://github.com/signal0verse/signalverse-main/actions/runs/44561158084) passed; the latter completed 94 stages including an executed disposable PostgreSQL Prediction case. The hosted fallback was used for main CI and the runner variable was restored after assignment.
- A disposable Linux Git archive check before the main push verified 8,388,603 bytes. The official retained preparation [44576844629](https://github.com/signal0verse/signalverse-main/actions/runs/44576844629) completed 10 stages. Artifact ID 14556633846 contained 8,388,603 bytes, within the unchanged 8 MiB ceiling. Inner SHA-256 e4f4e155ce598694ee87011eedfe50cee8241d3394aca5df93aef9cea350ca2a. It matched the exact file/mode inventory and the preflight Linux archive: true.
- The one-time Guard matched the SHA and retained archive digest. Controlled release [44577613120](https://github.com/signal0verse/signalverse-main/actions/runs/44577613120) completed 11 stages and consumed it once. Both ephemeral release runners exited and were removed. The valid previous main and admin rollback pointers remain; no rollback occurred.
- Main and admin health passed at 2026-11-20 01:38:37 MYT. The running process, release symlinks, success receipt, all 2,762 Git files and modes, and the Prediction bundle source map matched the exact revision. The public HTML and 2 linked assets matched the installed web release and contained the new decision outcome labels.

## AI handoff and table

- At 2026-11-20 01:43:50 MYT, natural successful runs after activation included 1 Shadow tick(s) and 1 Demo-entry tick(s). The first Shadow tick started after the exact new process was running and before the release success marker. Its paired Demo tick started after the marker, so the pairing window begins at the verified new process start. The ledger contained 2 Demo reuse receipts. For 2 matched pair(s), the exact persisted AI probability agreed and the Demo evaluation time was new.
- The live PostgREST projection used by the decision table returned the same recorded reasons as the read-only SQL ledger. Demo shared rejection counts: {"CONFIDENCE_BELOW_MIN": 2, "EDGE_BELOW_MIN": 2, "INSUFFICIENT_DEPTH": 1, "NO_POSITIVE_EDGE": 7, "SPREAD_TOO_WIDE": 1}. Rejected observations still labeled as opportunities in this sample: 1.
- Representative matched Demo observation: 2026-11-20 01:37:42 MYT, 10.45 seconds after the Shadow row, decision OPPORTUNITY, recorded reason(s) SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH.
- The installed API bundle passed an isolated test with the provider unavailable during Demo after a usable Shadow review. The paired evidence was reused, the new thin book still blocked entry, and the authenticated decision response contained that specific reason. H8 also still rejected an unconfirmed observation. Separate synthetic accounts received only their own results; shared status omitted internal admission receipts.
- All seven installed UI render tests passed, including the Persian rejection, pair provenance, and missing-history text. This confirms installed UI code and live data wiring. No private live browser session was fabricated or read. Historical rows expose only reasons recorded originally.

## Safety

- Real Prediction remained OFF in the live setting and execution branch. The learning gate remained absent and no learning tick appeared after deployment. The existing scheduler, every admission predicate, and all unrelated runtime controls remained unchanged.
- The live Prediction schema digest matched before and after the release. No migration, setting change, manual trade or forced job was performed. Production checks were read-only and fixture writes were confined to an in-memory process with a private network namespace. 23 protected controls, 17 job gates, 11 service states and the Paper pin matched preflight.
- The release run briefly appeared in transition before the self-hosted queue indexed it. The initial runner precheck stopped before registration. After the exact run was the only queued production workflow, its same execution continued. No second dispatch, deployment retry or rollback occurred. This confirms operational behavior. Phase 9A statistical validation remains incomplete.
