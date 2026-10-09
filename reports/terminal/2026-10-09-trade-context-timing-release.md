# Trade context timing recovery — 2026-10-09

## Problem and behavior

Trade used one generic parser error for an expired/out-of-window reply and
malformed identity/privilege data. The controller labeled all of these as an
account change and permanently removed the working view. This is reproduced
with the actual parser/controller offline. A read-only deployed UI observation
also displayed the identity message at bootstrap, before a prior principal was
established; the historical response payload behind the owner's screenshot was
not retained and its precise cause is not independently proven.

Temporal errors now revoke context authority and retain only the last verified
same-member mounted view/drafts, with a translated message and bounded read
retries. Requests stay disabled until a valid context returns. A read-only sample
confirmed that the origin clock led the device by at least 436 milliseconds,
within an observed 3.8-second round trip. On temporal disagreement the browser
uses a fresh public same-origin HTTPS HEAD Date, with no credentials, no-store,
no redirects and conservative second precision/round-trip bounds. The response
is still checked against the original strict sixty-second window. Its remaining
display lifetime is rebased and capped by a monotonic deadline measured from
request start, so backward device-clock changes or a delayed response cannot
extend it. No device time or server setting is changed. Malformed responses clear old
data under accurate verification copy. A genuinely different valid principal or
authentication rejection still clears the old view. Equivalent UUID case is
normalized. All seven terminal languages are covered.

## Scope and validation

- Exact source: `bcc544b1e295ef514f48d7edcba75ce7bb6b3fb8`; predecessor: `c25e41f9e75b3dfa7f3973ebe17f9a5fd5031916`.
- Nineteen-file closed successor; all prior gates and native Spot presentation
  work are preserved. No database/migration, order, quota, plan or privilege change.
- Final targeted offline run: 84 tests, all passed, including parser, recovery,
  unchanged financial dispatch, time bounds, authentication/identity and language
  checks, conservative public-clock validation, skew alignment, monotonic expiry
  and rejection of oversized/private/privileged responses. Additional predecessor
  scope checks passed; counts are not added to
  the targeted total because of overlapping assertions.
- Actual parent/host/session/clock browser QA with clearly labelled inert panel
  and synthetic HEAD headers: a 2.5-second skew aligned automatically with the
  same mount and draft retained; expired
  and future-time replies kept mount 1 and the existing draft visible, disabled
  requests; recovery re-enabled the same mount. An actual member change and
  malformed privilege response cleared the retained fields. Zero business commands.
- Production CI 37894513498: success, 59 successful steps. Artifact
  preparation 37896737035: success. Exact retained archive verified against
  987 committed source files; digest `21c0a12dff729063a9abd66edae43a929bfe6bc6e0a9d26e6cf7b746f7536fe5`.
- Production delivery 37897023895: success, 11 successful
  steps; independent exact-artifact authorization was verified as consumed.
- All three core cohorts use the exact reviewed SHA. Eight core services and
  three application host services are active. Served manifest and both public
  assets match the exact locally rebuilt source. CrossVerse application source,
  Paper and Supplier pins are unchanged.
- The deployed authenticated page was reloaded from the prior identity error:
  the Spot view and its controls became ready. After more than the original
  sixty-second display lifetime, the same page remained ready without a reload
  or business command. Retained screenshots are private, excluded from this report.

## Limits

This fixes false identity classification and safe temporal recovery; it does not
keep a genuinely logged-out or different-account view alive. If fresh trusted
same-origin time is unavailable or a response violates the strict validity
window, requests remain disabled while read retries continue. Synthetic outage tests
and active services are not evidence of funded exchange execution or profitability.
No account identifiers, credentials, private payloads or trading screenshots are
included in this public report. Existing loaded tabs need one reload to receive
the new asset. Deployment and byte verification are complete; real exchange
orders were not created for validation.
