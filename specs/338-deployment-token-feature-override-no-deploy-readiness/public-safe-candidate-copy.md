# Deployment-token Public-safe Candidate Copy

This candidate text is not routed and is not published.

## Account Coverage

Deployment tokens are for shipping or embedded-use account flows. New token
issuance should be requested through the account flow that verifies current
commercial coverage and an active support agreement.

## Account Identity

If an account email is supplied during the request, it should match validated
account data. If the account record cannot confirm that identity, the safe
response is to stop issuance and explain the next account step without exposing
private record details.

## Catalog-controlled Feature Access

Some commercial accounts may receive token-scoped feature access based on
catalog-controlled purchase records and validated account data. That access is
derived from the account record, not from request-provided feature claims.

## Safe Denial Text

Use short safe denial text that explains the local outcome without exposing
private account or catalog details:

- "A deployment token cannot be issued for the current account state."
- "Review account coverage or choose an allowed account action."
- "No customer action was taken."
