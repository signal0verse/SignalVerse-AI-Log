# PR 293 Prediction Demo entry audit — 2026-11-20

The exact deployed revision was `bcca682604eb3874fd4cb884703e3d000cdc5713`. The read-only production ledger snapshot covers 2026-11-20 01:37:20 to 2026-11-20 16:12:43 MYT. The cutoff includes the first Shadow tick from the verified new process. The official activation marker was 01:37:24 MYT. [Release verification](https://github.com/signal0verse/SignalVerse-AI-Log/blob/master/reports/prediction/2026-11-20-pr293-paired-review-entry-reasons-release.md)

## First production handoff

Both of the first paired Demo evaluations reused the same AI probability as the matching Shadow record with a new evaluation timestamp. Neither produced an entry in the position ledger.

| Market | Side | Demo decision | Recorded result |
| --- | --- | --- | --- |
| Will the price of Bitcoin be above $62,000 on November 21? | NO | OPPORTUNITY | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| Will the price of Ethereum be above $1,700 on November 25? | NO | WATCH | EDGE_BELOW_MIN, CONFIDENCE_BELOW_MIN. Net edge +0.57 percentage points and confidence 0. |

## All recorded post-release decisions

- 149 completed Shadow and 149 completed Demo-entry runs were recorded. No failed or unfinished entry run appeared in this snapshot. The ledger contained 7,442 Shadow and 7,432 Demo v2 observations. All 421 Demo reuse receipts matched a prior fresh Shadow AI probability and a newer Demo evaluation timestamp.
- Demo recorded 79 rows tagged `OPPORTUNITY` across 15 distinct markets. None reached `would_open=true` or created an opportunity-policy position. The recorded rejection groups were 45 insufficient depth, 30 wide spread plus insufficient depth, 2 H5 price-ladder inconsistencies, and 2 H8 failures to confirm the same actionable side on the preceding tick.
- Exactly one position was created during the window under the separate scheduled daily evaluation policy. The outcome is identified here by policy and cadence. Account identifiers and position details are omitted.
- Shadow produced 81 opportunity rows. One passed through to `SHADOW_WOULD_OPEN`, 44 were stopped by depth, 34 by spread plus depth, and 2 by H8. Of those 81 rows, the immediately following Demo had 53 opportunity, 21 neutral, 5 watch and 1 avoid decisions for the same market. One blocked Shadow market had no recorded Demo evaluation in the paired window. It was the ETH $1,900 November 25 market at 04:44 MYT and the Shadow blockers were spread and depth. Its exact Demo worklist exclusion reason was unavailable in persisted data.

## The one Shadow-qualified market

**Will the price of Bitcoin be above $62,000 on November 21? — NO.** At 06:19:18 MYT, Shadow included the AI review, showed +5.60 percentage points net edge and passed the entry checks. At 06:19:27 MYT, Demo assessed the same market and side using fresh data. That market was outside Demo's ten-market AI shortlist, as verified by the persisted `used_ai_recheck=false` field and the absence of an AI evidence group. Both runs had ten AI shortlist records. Demo stored −1.50 points of net edge, a neutral decision and `NO_POSITIVE_EDGE` on both sides. Its book passed the tradeability gate. It stopped before the account admission stage and no opportunity position was persisted.

The running code builds a separate ten-market shortlist from each run's preliminary results. Reuse runs only inside that shortlist. The historical preliminary rank for this market was unavailable, so the exact change in shortlist ordering could not be reconstructed. [Exact deployed entry logic](https://github.com/signal0verse/signalverse-main/blob/bcca682604eb3874fd4cb884703e3d000cdc5713/api/predictions.ts#L2643-L2668)

## Demo rejection totals by market

| Market | Observations | Recorded reasons and counts |
| --- | ---: | --- |
| Will the price of Bitcoin be above $60,000 on November 22? | 13 | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH × 7; INSUFFICIENT_DEPTH × 6 |
| Will the price of Bitcoin be above $62,000 on November 24? | 11 | INSUFFICIENT_DEPTH × 11 |
| Will the price of Bitcoin be above $62,000 on November 23? | 9 | INSUFFICIENT_DEPTH × 9 |
| Will the price of Bitcoin be above $60,000 on November 23? | 7 | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH × 5; INSUFFICIENT_DEPTH × 2 |
| Will the price of Bitcoin be above $60,000 on November 25? | 6 | INSUFFICIENT_DEPTH × 5; SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH × 1 |
| Will the price of Bitcoin be above $62,000 on November 25? | 6 | INSUFFICIENT_DEPTH × 5; SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH × 1 |
| Will the price of Bitcoin be above $60,000 on November 26? | 5 | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH × 5 |
| Will the price of Bitcoin be above $64,000 on November 22? | 5 | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH × 4; INSUFFICIENT_DEPTH × 1 |
| Will the price of Ethereum be above $1,800 on November 25? | 5 | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH × 3; INSUFFICIENT_DEPTH × 2 |
| Will the price of Bitcoin be above $62,000 on November 21? | 4 | INSUFFICIENT_DEPTH × 2; SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH × 1; H8_NOT_STABLE × 1 |
| Will the price of Bitcoin be above $62,000 on November 22? | 2 | H5_LADDER_INCOHERENT × 1; H8_NOT_STABLE × 1 |
| Will the price of Bitcoin be above $64,000 on November 25? | 2 | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH × 1; INSUFFICIENT_DEPTH × 1 |
| Will the price of Ethereum be above $1,900 on November 25? | 2 | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH × 2 |
| Will Ethereum reach $1,900 November 16-22? | 1 | H5_LADDER_INCOHERENT × 1 |
| Will the price of Bitcoin be above $60,000 on November 24? | 1 | INSUFFICIENT_DEPTH × 1 |

## Individual Demo opportunity decisions

All times below are MYT on 2026-11-20.

| Time | Market | Side | Reused Shadow AI | Recorded reasons |
| --- | --- | --- | --- | --- |
| 01:37:42 | Will the price of Bitcoin be above $62,000 on November 21? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 01:50:27 | Will the price of Bitcoin be above $62,000 on November 22? | NO | Yes | H5_LADDER_INCOHERENT |
| 01:55:43 | Will the price of Ethereum be above $1,900 on November 25? | YES | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 02:01:31 | Will the price of Bitcoin be above $62,000 on November 21? | NO | Yes | INSUFFICIENT_DEPTH |
| 02:20:29 | Will the price of Bitcoin be above $62,000 on November 23? | NO | Yes | INSUFFICIENT_DEPTH |
| 02:25:57 | Will the price of Bitcoin be above $62,000 on November 21? | NO | Yes | INSUFFICIENT_DEPTH |
| 02:25:58 | Will the price of Bitcoin be above $62,000 on November 23? | NO | No | INSUFFICIENT_DEPTH |
| 02:40:30 | Will the price of Bitcoin be above $60,000 on November 23? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 02:45:47 | Will the price of Bitcoin be above $60,000 on November 23? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 03:00:35 | Will the price of Bitcoin be above $60,000 on November 23? | NO | No | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 03:16:06 | Will the price of Bitcoin be above $60,000 on November 25? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 03:27:14 | Will the price of Bitcoin be above $60,000 on November 23? | NO | No | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 03:54:41 | Will the price of Bitcoin be above $62,000 on November 23? | NO | Yes | INSUFFICIENT_DEPTH |
| 04:04:43 | Will the price of Bitcoin be above $62,000 on November 23? | NO | Yes | INSUFFICIENT_DEPTH |
| 04:09:42 | Will the price of Bitcoin be above $62,000 on November 25? | NO | Yes | INSUFFICIENT_DEPTH |
| 04:14:39 | Will the price of Bitcoin be above $62,000 on November 24? | NO | No | INSUFFICIENT_DEPTH |
| 04:34:58 | Will the price of Bitcoin be above $60,000 on November 22? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 04:49:25 | Will the price of Bitcoin be above $62,000 on November 23? | NO | Yes | INSUFFICIENT_DEPTH |
| 04:54:00 | Will the price of Bitcoin be above $62,000 on November 23? | NO | Yes | INSUFFICIENT_DEPTH |
| 05:04:48 | Will the price of Bitcoin be above $60,000 on November 22? | NO | Yes | INSUFFICIENT_DEPTH |
| 05:10:33 | Will the price of Bitcoin be above $60,000 on November 22? | NO | Yes | INSUFFICIENT_DEPTH |
| 05:13:57 | Will the price of Bitcoin be above $60,000 on November 22? | NO | Yes | INSUFFICIENT_DEPTH |
| 05:20:16 | Will the price of Bitcoin be above $60,000 on November 22? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 05:25:38 | Will the price of Bitcoin be above $60,000 on November 22? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 05:30:50 | Will the price of Bitcoin be above $60,000 on November 22? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 06:14:24 | Will the price of Bitcoin be above $62,000 on November 21? | NO | Yes | H8_NOT_STABLE |
| 07:09:34 | Will the price of Bitcoin be above $60,000 on November 25? | NO | Yes | INSUFFICIENT_DEPTH |
| 07:24:45 | Will the price of Bitcoin be above $60,000 on November 23? | NO | Yes | INSUFFICIENT_DEPTH |
| 07:39:37 | Will the price of Bitcoin be above $60,000 on November 25? | NO | Yes | INSUFFICIENT_DEPTH |
| 07:59:28 | Will the price of Bitcoin be above $60,000 on November 23? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 08:06:34 | Will the price of Bitcoin be above $62,000 on November 24? | NO | Yes | INSUFFICIENT_DEPTH |
| 08:17:16 | Will the price of Bitcoin be above $62,000 on November 24? | NO | Yes | INSUFFICIENT_DEPTH |
| 08:22:08 | Will the price of Ethereum be above $1,800 on November 25? | YES | No | INSUFFICIENT_DEPTH |
| 08:22:10 | Will the price of Ethereum be above $1,900 on November 25? | YES | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 08:28:15 | Will the price of Bitcoin be above $62,000 on November 24? | NO | Yes | INSUFFICIENT_DEPTH |
| 08:34:24 | Will the price of Bitcoin be above $62,000 on November 25? | NO | Yes | INSUFFICIENT_DEPTH |
| 08:34:25 | Will the price of Bitcoin be above $62,000 on November 24? | NO | Yes | INSUFFICIENT_DEPTH |
| 08:34:26 | Will the price of Bitcoin be above $64,000 on November 25? | YES | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 08:41:24 | Will the price of Bitcoin be above $60,000 on November 22? | NO | Yes | INSUFFICIENT_DEPTH |
| 08:41:24 | Will the price of Bitcoin be above $64,000 on November 22? | YES | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 08:46:13 | Will the price of Bitcoin be above $62,000 on November 25? | NO | Yes | INSUFFICIENT_DEPTH |
| 08:49:25 | Will the price of Bitcoin be above $62,000 on November 25? | NO | Yes | INSUFFICIENT_DEPTH |
| 09:00:51 | Will the price of Bitcoin be above $64,000 on November 22? | YES | No | INSUFFICIENT_DEPTH |
| 09:00:51 | Will the price of Bitcoin be above $62,000 on November 25? | NO | Yes | INSUFFICIENT_DEPTH |
| 09:00:52 | Will the price of Bitcoin be above $62,000 on November 24? | NO | Yes | INSUFFICIENT_DEPTH |
| 09:11:58 | Will the price of Bitcoin be above $62,000 on November 24? | NO | No | INSUFFICIENT_DEPTH |
| 09:11:58 | Will the price of Bitcoin be above $60,000 on November 24? | NO | No | INSUFFICIENT_DEPTH |
| 09:19:58 | Will the price of Bitcoin be above $64,000 on November 25? | YES | No | INSUFFICIENT_DEPTH |
| 09:44:40 | Will the price of Bitcoin be above $62,000 on November 24? | NO | No | INSUFFICIENT_DEPTH |
| 10:09:51 | Will the price of Bitcoin be above $60,000 on November 22? | NO | No | INSUFFICIENT_DEPTH |
| 10:42:43 | Will the price of Ethereum be above $1,800 on November 25? | YES | No | INSUFFICIENT_DEPTH |
| 10:51:23 | Will the price of Bitcoin be above $62,000 on November 23? | NO | No | INSUFFICIENT_DEPTH |
| 11:05:25 | Will Ethereum reach $1,900 November 16-22? | YES | No | H5_LADDER_INCOHERENT |
| 11:40:06 | Will the price of Bitcoin be above $62,000 on November 23? | NO | No | INSUFFICIENT_DEPTH |
| 11:51:19 | Will the price of Bitcoin be above $62,000 on November 24? | NO | No | INSUFFICIENT_DEPTH |
| 12:14:21 | Will the price of Bitcoin be above $62,000 on November 22? | NO | No | H8_NOT_STABLE |
| 12:14:22 | Will the price of Bitcoin be above $62,000 on November 24? | NO | No | INSUFFICIENT_DEPTH |
| 12:38:14 | Will the price of Bitcoin be above $60,000 on November 25? | NO | No | INSUFFICIENT_DEPTH |
| 12:43:54 | Will the price of Ethereum be above $1,800 on November 25? | YES | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 12:49:41 | Will the price of Bitcoin be above $60,000 on November 25? | NO | Yes | INSUFFICIENT_DEPTH |
| 13:01:05 | Will the price of Bitcoin be above $60,000 on November 26? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 13:04:51 | Will the price of Bitcoin be above $60,000 on November 25? | NO | Yes | INSUFFICIENT_DEPTH |
| 13:04:52 | Will the price of Bitcoin be above $64,000 on November 22? | YES | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 13:20:22 | Will the price of Bitcoin be above $62,000 on November 24? | NO | Yes | INSUFFICIENT_DEPTH |
| 13:39:35 | Will the price of Ethereum be above $1,800 on November 25? | YES | No | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 13:51:16 | Will the price of Bitcoin be above $64,000 on November 22? | YES | No | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 13:51:16 | Will the price of Ethereum be above $1,800 on November 25? | YES | No | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 13:53:54 | Will the price of Bitcoin be above $60,000 on November 22? | NO | Yes | INSUFFICIENT_DEPTH |
| 13:57:22 | Will the price of Bitcoin be above $64,000 on November 22? | YES | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 14:29:41 | Will the price of Bitcoin be above $60,000 on November 22? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 14:49:05 | Will the price of Bitcoin be above $62,000 on November 25? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 15:05:36 | Will the price of Bitcoin be above $60,000 on November 22? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 15:10:33 | Will the price of Bitcoin be above $60,000 on November 26? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 15:20:18 | Will the price of Bitcoin be above $60,000 on November 26? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 15:29:42 | Will the price of Bitcoin be above $60,000 on November 23? | NO | Yes | INSUFFICIENT_DEPTH |
| 15:29:42 | Will the price of Bitcoin be above $60,000 on November 26? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 15:34:52 | Will the price of Bitcoin be above $60,000 on November 26? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 15:44:36 | Will the price of Bitcoin be above $60,000 on November 22? | NO | Yes | SPREAD_TOO_WIDE, INSUFFICIENT_DEPTH |
| 16:09:23 | Will the price of Bitcoin be above $62,000 on November 23? | NO | Yes | INSUFFICIENT_DEPTH |

## Safety and scope

The exact running process and release symlink were verified. All 17 gate hashes and 23 protected control hashes matched the release preflight. Real Prediction remained disabled in the running handler and the optional enabling setting was absent. The autonomous learning gate was absent and the audit window had zero learning runs. Production work consisted of read-only SQL and read-only runtime inspection. No source, scheduler, gate, position or production setting was changed. This audit confirms recorded decisions within the stated window. Phase 9A statistical validation remains incomplete.
