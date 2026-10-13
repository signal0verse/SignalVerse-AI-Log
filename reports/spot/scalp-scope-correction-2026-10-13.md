# Independent Spot scalp — scope correction

Date: 2026-10-13
Status: CANDIDATE_CI_IN_PROGRESS / NOT_DEPLOYED

The owner's task remains preserving the existing automatic Spot scalp scanner
in its original location and delivering a second, independent technical Spot
scalp workspace on CrossVerse and SignalVerse. The new workspace has coins on
the left, the native chart on the right, buy/profit ladder annotations and
per-coin executed history below. Its profiles, settings, lists and history are
separate. No Prediction Market, Stablecoin or Whale feature work is in scope.

Those module names appeared in the repository's pre-existing full release
workflow. Candidate94's Signal-host run passed the complete original Profit
Protection gate (640 tests plus scope/type comparison), then failed a pre-existing
shadow diagnostic H5 test. The runner did not run out of memory. Neither site
was deployed from that failed run.

The unchanged main handler and test reproduced that failure offline: the test
expected every mode's ladder to be incoherent, although mode B's posteriors
(.3996 for the lower strike, .3912 for the higher strike) were correctly coherent.
Only the test's clock and synthetic inputs were corrected, keeping every original
H5 rejection assertion and adding an explicit incoherent-input precondition.
The test now isolates two points below the B call cap, supplies neutral stub AI
answers and restores its input state in finally. No production handler, shared
environment, trading strategy, release control or other-module UI was changed.

Actual focused checks: all19 existing diagnostic cases and103 project/infrastructure
scope cases passed, with zero failures or skips. Seven rendered release operator
and rollback fixtures also passed. These are test results, not private-account
execution or evidence of profitability.

Core source e8cc99c3b4df5f2021abfc27b9619afc4d36a26d was committed and normally
pushed to the existing private candidate branch. It changes four test/document/
closed-manifest files relative94, with zero executable runtime changes.
[New full candidate CI](https://github.com/signal0verse/signalverse-main/actions/runs/38399580197)
is running on the owner-approved temporary bounded SignalVerse runner. The two
tested PHP source archives were retained; a separately named source-pinned deploy
operator was staged privately on both hosts without runtime activation.

Main promotion, full exact main/push CI, immutable artifact verification, private
backup/cold restore, reviewed additive migration, independent release approval,
and both-site runtime cutover/provenance checks remain required. No profile was
enabled, forced scanner tick or private exchange order was sent, and no billing
limit/payment was changed.
