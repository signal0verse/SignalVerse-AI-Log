# Limitless account identity verification

## Metadata

- Date: 2026-11-25 (Asia/Kuala_Lumpur)
- Module: Prediction Market
- Mode: Read-only documentation review
- Repository: SignalVerse-AI-Log, master

## Objective and findings

- The [first-trade guide](https://docs.limitless.exchange/user-guide/making-your-first-trade) starts with connecting a Base wallet. It lists no mandatory document submission before trading. The [wallet guide](https://docs.limitless.exchange/user-guide/wallet-types) also documents social login with an embedded wallet.
- Sections 1 and 2 of the [Terms of Service](https://docs.limitless.exchange/user-guide/terms-of-service) allow Limitless to request proof of age, identity, or eligibility at any time and to suspend access pending verification. They also describe message signing as proof of wallet ownership. The normal sign-in flow therefore does not establish that a specific user will never be asked for identity documents.
- For the SignalVerse multi-user use case, the [Programmatic API](https://docs.limitless.exchange/developers/programmatic-api) requires a partner application and review. The public guide does not specify a universal identity-document or corporate verification checklist for applicants.

## Checks and changes

Reviewed official documentation. No account flow, identity document submission, funding, partner application, or real order was attempted. No production setting or application code changed. This report is the only published change.

