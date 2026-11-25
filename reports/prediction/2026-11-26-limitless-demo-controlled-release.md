# 2026-11-26 — Limitless Demo and independent venue switches controlled release

The owner authorized exactly `fd7418aa19625d657ed5082ca09ff7d9467920cc` after successful CI. Production activated this SHA on 2026-11-26 at 02:47:04 MYT. The prior production SHA was `0c70458abf866e6840252406f27c824b2c3da4a0`. The candidate was its direct child. No rollback occurred.

## GitHub recovery and release evidence

- GitHub reported an incident affecting Pull Requests and Actions. PR creation returned HTTP 500 and 502 during retries. CI dispatch eventually succeeded. Temporary runner registration retried until it succeeded. The initial branch workflow was canceled once the exact PR workflow was running on GitHub-hosted infrastructure. Its isolated runner was removed. [GitHub incident](https://www.githubstatus.com/incidents/qn8mfv6q5hlx) · [Canceled duplicate CI](https://github.com/signal0verse/signalverse-main/actions/runs/45652324719).
- PR 308 targeted the previous SHA and its merge tree matched the approved source tree. All 94 steps passed. The branch was fast-forwarded to the approved commit. GitHub recorded that same SHA as the PR merge commit. [PR 308](https://github.com/signal0verse/signalverse-main/pull/308) · [PR CI](https://github.com/signal0verse/signalverse-main/actions/runs/45653776858).
- The exact main push workflow passed all 94 steps, including Prediction, retained source checks, and disposable database tests. The hosted runner was selected using the included allowance and the runner routing variable was restored and verified. Billing settings were untouched. [Exact main CI](https://github.com/signal0verse/signalverse-main/actions/runs/45664697833).
- Official preparation retained artifact `15051139666`. The inner archive was 8,379,793 bytes, under the 8 MiB cap. Its SHA-256 was `fb197cfe27df54445effba8929ffa3444f7dc7d9f10a110787c5a1610a20287f`. The ZIP digest and all 2,779 Git blobs and modes were independently checked. The release used those retained bytes through the existing one-use authorization, which was consumed for the exact archive. [Artifact preparation](https://github.com/signal0verse/signalverse-main/actions/runs/45676741830) · [Production release](https://github.com/signal0verse/signalverse-main/actions/runs/45677436313).

## Production and Telegram verification

- Main and Admin health, the active release symlinks, process working directory, and the deployed SHA matched the approved source. All 2,779 installed source blobs and modes matched Git. Five public assets matched the installed files. The running API bundle contains the exact Limitless adapter and read-only Demo handler. Anonymous Limitless reads returned 401, Limitless Real mode returned 405, and general Real execution returned 501.
- The live SignalVerse mini app was opened inside Telegram. With both switches on, the Polymarket engine panel and a live Limitless sample appeared together. Each switch was turned off independently and the other venue remained visible. Both were restored to on and the Limitless sample was visible again.
- The Limitless sample at 02:49:03 MYT showed 16 tracked crypto markets, four daily, and zero weekly. The Polymarket panel displayed Demo entry active and Real trading disabled during the check. Counts describe the sampled market set at that time.
- Real trading remained off, confirmed by the live endpoint and a read-only database check. No autonomous-learning gate or scheduled invocation was enabled, and the latest read-only 24-hour count was zero. No post-activation scheduled run had completed at the time of this read.
- All 23 protected operational controls and 17 job gates matched the pre-release snapshot. The separate Paper runtime pin stayed unchanged. No database migration, manual production fixture, wallet signing, or order submission was performed during verification. The isolated preparation and delivery runners were removed.

## Scope

Limitless is a read-only Demo assessment. It displays executable quote estimates and reasons for abstention. Opening and settling Limitless Demo positions still requires validated venue-specific settlement evidence. Statistical validation remains incomplete.
