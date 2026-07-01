# W370 Public-safe Launch-readiness Synthesis

Private/no-deploy Docs receiver packet for RB-008 /
`NXUSKIT-V2-MEGA-20260605`, Docs W370, RC wave 194 of revised estimated
196-216.

This packet synthesizes public-safe wording boundaries for Local Control
Decisions, deployment tokens, active support/account coverage, and
catalog-controlled feature access. It is private/no-deploy and makes no public
support or compliance claim. Boundary phrase: no public support or compliance claim.

## Source Evidence

Docs evidence:

- Docs W326 marker:
  `READY_DOCS_W326_CONTROL_DECISION_NO_DEPLOY_ROUTED_COPY_CANDIDATE`
- Docs W326 checkpoint: `a16e332`
- W326 posture:
  conceptual Local Control Decisions copy is a no-deploy routed candidate. It
  avoids private class names, raw stage labels, public API/schema authority,
  provider registry, runtime provider, package, release, support, and
  compliance claims.
- Docs W338 marker:
  `READY_DOCS_W338_DEPLOYMENT_TOKEN_FEATURE_OVERRIDE_NO_DEPLOY_READINESS`
- Docs W338 checkpoint: `6aed16e`
- W338 posture:
  private/non-routed copy boundary for deployment tokens, active support
  agreement/account coverage, validated account data, catalog-controlled
  feature access, and safe denial text.

Website evidence:

- Website W324 marker:
  `READY_WEBSITE_W324_PRIVATE_CONTROL_DECISION_COPY_BOUNDARY_DRAFT`
- Website W324 checkpoint:
  `a4e11613773687a47b541592550021dd4cbb8cdc`
- W324 posture:
  private Website copy-boundary packet only; no public Website route,
  production deploy, public copy implementation, or public claim.
- Website W332 marker:
  `READY_WEBSITE_W332_PRODUCT_CATALOG_FEATURE_OVERRIDE_SOURCE`
- Website W332 checkpoint:
  `8faa7e4442c2a8133c60ff9364b53e93a08b7445`
- W332 posture:
  private Product Catalog/Odoo feature-source path evidence only; no Website
  deploy, catalog/customer mutation, pricing claim, public Website copy, or
  licensing backend integration.
- Website W369:
  manager-declared private evidence in the W370 assignment. Local W370
  inspection did not resolve a checkpoint or marker in the checked-out logs.
  Treat W369 as confirmation-required before any public docs or Website wording
  gate.

SDK evidence:

- SDK W364 marker:
  `READY_SDK_W364_PRIVATE_DEPENDENCY_MODE_DECISION_PACKET`
- SDK W364 checkpoint:
  `c03e3007d4691c3e2dddd7127817f370fe6c0c1d`
- W364 posture:
  caller-provided private JSON remains the accepted downstream dependency mode;
  public API, public schema, CLI, wrapper, provider registry, runtime provider,
  release/package, support, and compliance gates remain closed.
- SDK W367:
  manager-declared private evidence in the W370 assignment. Local W370
  inspection did not resolve a checkpoint or marker in the checked-out logs.
  Treat W367 as confirmation-required before public SDK-consumption wording.

Licensing evidence:

- Licensing W330 marker:
  `READY_LICENSING_W330_DEPLOYMENT_TOKEN_SUPPORT_AGREEMENT_IMPLEMENTATION`
- Licensing W330 checkpoint:
  `150bcd3b382a8bbb3593779b16378ac4ee1dd100`
- W330 posture:
  new deployment-token issuance is gated on active commercial period and active
  support status; request-supplied feature overrides are rejected; existing
  deployment-token continuity is unchanged.
- Licensing W331 marker:
  `READY_LICENSING_W331_PRODUCT_CATALOG_FEATURE_OVERRIDE_CONSUMER`
- Licensing W331 checkpoint:
  `033686d607da8b7d106237c0b31c22ed0ecbf4d0`
- W331 posture:
  deployment-token feature overrides are emitted only from validated Product
  Catalog/Odoo authority; malformed or non-authoritative source data fails
  closed; request-supplied feature overrides remain forbidden.
- Licensing W368:
  manager-declared private evidence in the W370 assignment. Local W370
  inspection did not resolve a checkpoint or marker in the checked-out logs.
  Treat W368 as confirmation-required before public account/support wording.

## Safe Now

Safe now means safe for private Docs/Website copy review and no-deploy candidate
planning. It does not mean safe to publish.

The following wording classes are safe for future review drafts:

| Topic | Safe wording class | Boundary |
| --- | --- | --- |
| Local Control Decisions | Conceptual local control decisions before consequence boundaries. | No SDK object, public API, public schema, CLI, wrapper, runtime provider, provider registry, release, or package claim. |
| Consequence boundaries | Read-only actions can still create observable effects or follow-on obligations. | No support, compliance, legal, medical, safety, or operational guarantee. |
| Deployment tokens | Deployment tokens are for shipping or embedded-use account flows. | No claim that issuance is automatic, universally available, or release-ready. |
| Active support/account coverage | New token issuance can be described as depending on current commercial coverage and an active support agreement. | No support readiness, compliance readiness, SLA, renewal, refund, revocation, or guaranteed support outcome. |
| Validated account data | Account identity can be described as checked against validated account data. | No customer-data source details or raw private field names. |
| Catalog-controlled feature access | Token-scoped feature access may be catalog-controlled. | No request-side feature override authority and no public source-field details. |
| Safe denial text | Denial text should be short, non-sensitive, and focused on the next allowed account step. | No internal error taxonomy, private field names, or customer support promise. |

## Needs Confirmation

These items must be resolved before any routed public Docs or Website wording
gate:

1. SDK W367: checkpoint, marker, and final SDK consumer posture for
   deployment-token feature access and dependency mode.
2. Licensing W368: checkpoint, marker, and final licensing behavior for active
   support/account coverage and deployment-token issuance semantics.
3. Website W369: checkpoint, marker, and final Website/catalog wording posture.
4. Approved customer-facing wording for active support agreement and commercial
   coverage checks.
5. Confirmation that public copy may mention catalog-controlled feature access
   without exposing private source fields.
6. Separate publication gate for any docs.nxus.systems or nxus.systems edit.
7. Rollback, support-channel, and customer-communication plan if account-facing
   deployment-token wording is published.

## Must Remain Private

The following stay private until a later explicit gate changes the authority:

- raw private source fields, internal DTOs, and customer-data source details;
- request-side feature override authority;
- `ControlDecision` as a shipped public SDK object;
- raw Stage 0/1/2 labels;
- public API or public schema for these concepts;
- runtime provider or provider registry readiness;
- release/package readiness;
- support readiness or compliance readiness;
- guaranteed support outcomes, legal guarantees, safety guarantees, medical
  claims, renewal/refund/revocation promises, or entitlement guarantees;
- SDK dependency-mode graduation, runtime artifact consumption, loader wiring,
  real rejection/dispatch behavior, or product/app-loop integration;
- Website pricing/catalog copy, structured data, sitemap/robots changes, or
  public article/launch copy.

## Publication Gates

Before public docs or Website copy may publish, Manager/Operator should require:

1. exact SDK W367, Licensing W368, and Website W369 checkpoints;
2. final public/private terminology authority for local control decisions,
   deployment-token account flows, active support agreement, commercial
   coverage, account identity, and catalog-controlled feature access;
3. source and built-output scans for denied raw fields, private wave names,
   public API/schema claims, provider registry, runtime provider,
   release/package readiness, support readiness, and compliance readiness;
4. docs-version and public-leak checks;
5. Astro check/build if Docs routes change;
6. Website route/agent/sitemap/robots/structured-data checks if Website is in
   scope;
7. corrected interactive Claude/tmux QA on the exact public diff;
8. explicit deploy/publication approval and rollback instructions.

## Options And Recommendation

Option A: keep all W370 output private until SDK W367, Licensing W368, and
Website W369 checkpoints are supplied.

- Lowest risk.
- Recommended now.
- Preserves W326/W338 as reusable candidate wording without implying launch
  readiness.

Option B: request a no-deploy routed Docs candidate after the missing
checkpoints are supplied.

- Useful if Manager wants docs.nxus.systems wording staged before publication.
- Must remain no-deploy and source/dist-validator guarded.
- Requires final customer-facing support/account coverage wording.

Option C: request coordinated Docs plus Website public copy implementation.

- Highest coordination value.
- Requires separate publication authority, Website checks, rollback plan, and
  support-channel review.
- Not safe from W370 alone.

Recommendation: choose Option A now. Launch a later public wording gate only
after SDK W367, Licensing W368, and Website W369 are locally consumable by
marker and checkpoint, and after Manager approves exact customer-facing support
and account coverage wording.

## Validation

Run from the repository root:

```bash
node --check specs/370-public-safe-launch-readiness-synthesis-no-deploy/validate-w370-launch-readiness.mjs
node specs/370-public-safe-launch-readiness-synthesis-no-deploy/validate-w370-launch-readiness.mjs
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/370-public-safe-launch-readiness-synthesis-no-deploy/validate-w370-launch-readiness.mjs --dist
git diff --check
git diff --cached --check
```

The validator checks source evidence markers, W367/W368/W369
manager-declared/pending-local-checkpoint posture, safe-now copy classes,
confirmation gates, private boundaries, placeholder tokens, local path evidence,
and current source/dist public-surface leakage.
