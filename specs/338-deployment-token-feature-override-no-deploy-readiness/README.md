# W338 Deployment-token Feature-override No-deploy Readiness

Private/non-routed Docs receiver packet for RB-008 /
`NXUSKIT-V2-MEGA-20260605`, Docs W338, RC wave 162 of revised estimated
168-196.

## Purpose

Prepare Docs-owned public-safe wording boundaries for future deployment-token,
active-support, and feature-override documentation after the Licensing W330,
Licensing W331, and Website W332 private implementation checkpoints. This
packet does not publish routed docs and does not authorize any customer-facing
claim. It makes no public support or compliance claim.

## Source Evidence

Licensing evidence:

- W330 marker:
  `READY_LICENSING_W330_DEPLOYMENT_TOKEN_SUPPORT_AGREEMENT_IMPLEMENTATION`
- W330 checkpoint:
  `150bcd3b382a8bbb3593779b16378ac4ee1dd100`
- W330 posture:
  new deployment-token issuance is gated on active commercial period and active
  support status; request-supplied feature overrides are rejected; existing
  deployment-token continuity is unchanged.

Licensing consumer evidence:

- W331 marker:
  `READY_LICENSING_W331_PRODUCT_CATALOG_FEATURE_OVERRIDE_CONSUMER`
- W331 checkpoint:
  `033686d607da8b7d106237c0b31c22ed0ecbf4d0`
- W331 posture:
  deployment-token feature overrides are emitted only from validated
  Product Catalog/Odoo authority; malformed or non-authoritative source data
  fails closed; request-supplied feature overrides remain forbidden.

Website/Product Catalog evidence:

- W332 marker:
  `READY_WEBSITE_W332_PRODUCT_CATALOG_FEATURE_OVERRIDE_SOURCE`
- W332 checkpoint:
  `8faa7e4442c2a8133c60ff9364b53e93a08b7445`
- W332 posture:
  Product Catalog/Odoo holds the private source path for optional feature
  source data, with no Website deploy, catalog/customer mutation, pricing
  claim, public Website copy, or licensing backend integration in that lane.

## Readiness Decision

W338 keeps Docs output private and non-routed.

Reasons:

- The evidence is implementation-side and private. It proves source/consumer
  behavior, not customer-facing release, support, compliance, runtime,
  provider-registry, package, or public API authority.
- The latest Manager log keeps SDK W335 active for exact SDK call-site mapping,
  so Docs should not publish routed copy that implies SDK-side consumption is
  fully stabilized.
- Public wording about account coverage and support status carries customer
  expectation risk. It needs a separate publication gate and final support
  wording review before routed docs change.

## Public-safe Copy Boundary

Reusable candidate copy lives in
`specs/338-deployment-token-feature-override-no-deploy-readiness/public-safe-candidate-copy.md`.

Future public copy may say, after a separate approval gate:

- deployment tokens are for shipping or embedded-use account flows;
- new issuance depends on current commercial coverage and an active support
  agreement;
- account identity should be checked against validated account data;
- token-scoped feature access may be catalog-controlled;
- invalid or unavailable account state should fail closed with short safe
  denial text.

Future public copy must not expose or imply:

- raw private field names or internal DTO fields;
- customer-data source details;
- request-side feature override authority;
- provider registry, runtime provider, package, release, public API, or public
  schema readiness;
- public support or compliance readiness;
- legal, medical, safety, or customer-success guarantee claims.

## Publication Hard Gates

This packet keeps closed:

- deploy or publication to `docs.nxus.systems`, `nxus.systems`, or any public
  surface;
- public sync or generated public docs publication;
- routed docs edits;
- release/tag/package work;
- SDK, Examples, Website, Celerat/Plugins, Peeler, or source repo edits;
- provider registry, runtime/provider execution, dependency changes, or source
  refresh;
- customer-visible support, compliance, legal, medical, safety, entitlement, or
  account-service claims.

## Future Publication Preconditions

Before routed Docs copy should be requested, Manager should supply:

1. final SDK call-site/consumer posture for deployment-token feature overrides;
2. approved customer-facing wording for active support agreement and account
   coverage checks;
3. confirmation that public copy may mention catalog-controlled feature access
   without exposing private source fields;
4. explicit publication/deploy authority if `docs.nxus.systems` is in scope;
5. rollback and customer-support coordination plan for any account-facing
   deployment-token wording.

## Validation

Run from the repository root:

```bash
node --check specs/338-deployment-token-feature-override-no-deploy-readiness/validate-w338-deployment-token-readiness.mjs
node specs/338-deployment-token-feature-override-no-deploy-readiness/validate-w338-deployment-token-readiness.mjs
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/338-deployment-token-feature-override-no-deploy-readiness/validate-w338-deployment-token-readiness.mjs --dist
git diff --check
git diff --cached --check
```

The validator checks this packet, candidate copy, current public docs source,
and optional built output for the W338 evidence markers, safe candidate wording,
placeholder tokens, local path evidence, raw private feature/source fields, and
unsupported public authority claims.

## Recommended Next Option

Keep W338 as reusable Docs/private wording evidence until Manager supplies the
SDK W335 disposition and an explicit routed-docs or publication gate. If a
future lane opens, start with route-adjacent public copy and source/dist scans
before editing any generated product docs or deploying.
