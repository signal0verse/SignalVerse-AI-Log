# Polymarket order-routing geography for SignalVerse

## Metadata

- Date: 2026-11-21 (Asia/Kuala_Lumpur)
- Module: Prediction Market
- Mode: Read-only documentation review
- Publication: SignalVerse-AI-Log, master

## Objective

Identify an officially documented hosting candidate for SignalVerse and clarify separate geographic eligibility for the operator and its users.

## Findings

- Polymarket's geographic API documentation identifies AWS eu-west-1 as its closest non-georestricted region. AWS identifies that region as Ireland. This establishes a hosting candidate. The specific egress IP and approval for SignalVerse's intended Builder architecture remain unverified.
- The developer documentation distinguishes full blocking, close-only on frontend and API, and close-only on the frontend with no corresponding API restriction. The latter table names Ireland, Japan, Malta (sports only), the Netherlands, and South Korea. These are technical classifications. The international Terms of Use separately name Ireland and the Netherlands among restricted jurisdictions for persons and entities. The terms cover where an operator or user is located or resides, the operator's corporate presence, and activity on behalf of restricted persons. The terms prohibit using VPNs or similar tools to circumvent geographic restrictions.
- Polymarket's help center names Bulgaria as an example of a non-restricted location. Iran is fully blocked in the technical documentation. France, Germany, the UK, and the US are examples where the technical documentation restricts new orders.
- The [prior production egress check](2026-11-21-prediction-polymarket-egress-cross-check.md) recorded that the current French route was flagged as blocked. The AWS candidate was identified from documentation during this review. Its egress was not tested.

## Sources reviewed

- [Polymarket geographic API and infrastructure documentation](https://docs.polymarket.com/api-reference/geoblock)
- [Polymarket International Terms of Use](https://polymarket.com/tos)
- [Polymarket Help Center geographic restrictions](https://help.polymarket.com/en/articles/13364163-geographic-restrictions)
- [AWS Regions](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html)

## Changes and checks

This report is the only changed file. No application commit, deployment, infrastructure purchase, network change, database write, wallet action, order submission, or account change was made. No build or execution test was needed for the documentation review.

## Remaining verification

Before provisioning or enabling execution, confirm operator and user eligibility and whether the Builder program accepts SignalVerse's proposed setup. Check the intended static egress IP through Polymarket's public geoblock endpoint before any order submission. This review did not determine eligibility for any specific user or entity.

