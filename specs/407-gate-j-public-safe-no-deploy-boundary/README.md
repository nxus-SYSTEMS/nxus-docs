# W407 Gate J Public-safe No-deploy Boundary

Private/no-deploy Docs receiver packet for RB-008 /
`NXUSKIT-V2-MEGA-20260605`, Docs W407, wave W407 of estimated W426-W478.

This packet defines public-safe wording boundaries for W401-W403 Product
Catalog/Odoo feature-value Gate J readiness. It does not edit routed docs,
generate public docs, deploy, publish, merge to main, or authorize public
claims. It makes no public support or compliance claim.

## Source Evidence

SDK evidence:

- SDK W400 marker:
  `READY_SDK_W400_PRIVATE_SELECT_GUARD_CONSUMER_PROJECTION_HANDOFF`
- SDK W400 checkpoint: `ca22befe42b0b164576d2e87bcd29fee0c746ad4`
- W400 posture:
  SELECT/readiness rows are private caller-provided evidence only. They do not
  authorize public schema, CLI/API, wrapper exposure, provider registry,
  DataFusion runtime execution, async runtime dispatch, callbacks, webhooks,
  release/package work, public docs/website claims, or support/compliance
  claims.

Licensing evidence:

- Licensing W401 marker:
  `READY_LICENSING_W401_PRODUCT_CATALOG_FEATURE_VALUE_DECISION_PACKET`
- Licensing W401 checkpoint: `183daa97eb45464d63e72d4657c9a85ca27c3498`
- W401 posture:
  six Product Catalog/Odoo feature values are reserved for private/admin-only
  planning. Production population, customer-visible grants, public copy,
  runtime/API/controller/schema implementation, module upgrade or restart,
  release/package work, and support/compliance claims remain closed.
- Licensing W402 marker:
  `READY_LICENSING_W402_GATE_J_NONPROD_FEATURE_VALUE_VALIDATION_PACKET`
- Licensing W402 checkpoint: `9147236c0f463d86fa34290515ca5e47072c19fb`
- W402 posture:
  a future Gate J lane may validate only a named non-production target after
  explicit target, rollback, data-action, module-upgrade, and public-scan
  authorization. Existing deployment tokens receive no implicit grants.

Website evidence:

- Website W403 checkpoint: `62c8f7c411e959bac72ba8f4f4a91eb16b49da7b`
- Website W403 status:
  Private/no-production Gate J validation preflight packet.
- W403 posture:
  no production deploy, release branch movement, dev/staging/prod mutation,
  module upgrade or restart, Odoo/catalog/customer mutation, public route/copy
  publication, support/compliance claims, async runtime dispatch claims,
  DataFusion CE runtime claims, deployment-token issuance, or production feature
  population is authorized.

Docs precedent:

- Docs W376 marker:
  `READY_DOCS_W376_DATAFUSION_ASYNC_TOOL_NO_DEPLOY_BOUNDARY`
- Docs W376 checkpoint: `5f7ba5c818c7e6d5a40c17bf7dc8138c4169709b`
- W376 posture:
  DataFusion gateway and reverse table-provider runtime execution remain
  Pro/Internal. CE remains limited to refs, readiness, validation,
  declaration-only, missing-plugin, and entitlement-denied posture unless a
  future explicit gate opens more.

## No Public Authority Opened

Docs W407 is private/non-routed. It does not make any public v2.0.0 support,
runtime, provider-registry, release, package, public API, public schema,
callback, webhook, DataFusion CE runtime, async runtime-dispatch, entitlement,
or customer-visible feature promise.

The safe output from this wave is a Docs-owned private boundary packet and
validator. It may help future Docs, Website, Licensing, SDK, Celerat/Plugins,
Examples, and Peeler lanes use consistent copy guardrails. It is not a public
launch artifact and is not a Gate J target-selection approval.

## Safe-now Conceptual Wording

Safe now means safe for private copy review, no-deploy planning, and future
gated candidate drafting. It does not mean safe to publish.

| Topic | Safe wording class | Boundary |
| --- | --- | --- |
| Catalog-controlled feature access | Future copy may say, after approval, that token-scoped feature access can be controlled by validated account/catalog authority. | Do not expose raw source fields, private/admin-only values, pricing internals, entitlement internals, or request-side override authority. |
| Deployment-token feature values | Deployment-token feature values may be described privately as source-controlled and fail-closed. | Do not imply existing tokens receive implicit grants, or that feature values alone authorize runtime access. |
| Active support/account coverage | Active support/account coverage may be described privately as part of account-state checks for new token issuance. | Do not make support guarantees, compliance guarantees, SLA promises, renewal promises, customer-success promises, or customer-visible support outcomes. |
| Gate J non-production validation posture | Gate J non-production validation posture means a future named non-production target can validate source behavior only after explicit target, rollback, data-action, module-upgrade, and public-scan authorization. | Do not infer a target, mutate Odoo, restart/upgrade modules, populate production rows, or create customer-visible grants. |
| Product Catalog/Odoo source authority | Validated Product Catalog/Odoo authority remains the private source for feature values. Blank, malformed, unknown, duplicate, or forbidden values should fail closed. | Public Website fields, request-supplied overrides, SELECT denials, and short aliases are not authority. |
| Read-only planning | Until a future Gate J prompt opens a named action, Docs wording should remain read-only planning. | No module upgrade/restart, Odoo mutation, production population, deployment-token issuance, loader rejection, dispatch wiring, or public docs copy. |

## Private Feature-value Boundary

The private/admin-only values reserved by W401/W402 are:

- `cap.tool.async_invocation`: Pro/Internal event-sink-only candidate.
- `cap.arrow.runtime`: internal dependency/readiness only; not
  customer-visible standalone capability.
- `cap.datafusion.gateway`: Pro/Internal gateway candidate.
- `cap.datafusion.table_provider`: Pro/Internal read-only table-provider
  candidate.
- `cap.datafusion.table_provider.clips`: Pro/Internal CLIPS table-provider
  candidate; existing CLIPS local reasoning remains CE-clean.
- `cap.datafusion.table_provider.bn`: Pro/Internal BN table-provider candidate;
  existing BN local reasoning remains CE-clean.

These values must remain private/admin-only unless a later public wording gate
explicitly changes visibility. They are not customer-facing plan names, pricing
labels, public catalog copy, SEO terms, support terms, compliance terms,
structured data, sitemap data, or public entitlement promises.

Raw `features_json` and `features_override` terminology is private technical
evidence only. Public copy must avoid exposing those raw names or any private
capability value.

Boundary phrase: `cap.arrow.runtime` is internal dependency/readiness only and
not customer-visible standalone capability.

## Denied Claim Terms

The following wording classes are denied for routed public docs, public sync,
generated public docs, Website copy, release notes, product catalog copy,
provider registry, package metadata, and public schema/API surfaces until a
later explicit gate opens them:

- no production population;
- no implicit existing-token grants;
- no module upgrade/restart;
- no Odoo mutation;
- no public support/compliance claims;
- no runtime/async dispatch claims;
- no customer-visible grants, feature promises, pricing labels, support labels,
  compliance labels, SEO metadata, structured data, sitemap data, or robots data
  for the private values;
- no public exposure of raw `features_json`, `features_override`, private
  capability values, Product Catalog internals, entitlement internals, or
  request-side override authority;
- no DataFusion CE runtime, Arrow CE runtime, SQL execution, gateway execution,
  reverse table-provider execution, or standalone Arrow runtime capability;
- no callbacks, webhooks, managed queues, runtime provider, provider registry,
  public API, public schema, public CLI, wrapper exposure, release/package
  authority, loader rejection claim, dispatch wiring claim, or support/compliance
  outcome claim.

W394/W400 SELECT denials remain non-grantable denials. Hidden dispatch denial,
write/mutation denial, materialization denial, runtime-resolution denial,
inline row/SQL/plan/Arrow-body denial, D10 expansion denial, and public
API/schema/provider/release/support denial are not Product Catalog feature
values and must not be represented as grantable capabilities.

## Gate J Stop Conditions

A future Gate J prompt should stop before any action if it lacks:

1. target mode and target identity;
2. branch-to-instance mapping;
3. exact upstream checkpoints for SDK, Licensing, Website, and Docs evidence;
4. rollback owner, rollback window, and rollback anchor;
5. allowed data action;
6. explicit module-upgrade authorization or denial;
7. Licensing readiness inputs and fail-closed acceptance criteria;
8. public-surface scans for raw feature fields, private values, support claims,
   compliance claims, runtime claims, async dispatch claims, DataFusion CE
   runtime claims, callbacks, and webhooks;
9. no-production posture covering production population, customer-visible
   grants, public copy, release/deploy, and support/compliance claims.

Absent those fields, the safe Docs posture is private read-only planning only.

## Publication Gates

Before any public Docs, Website, release-note, Celerat/Plugins, Examples, SDK,
or Product Catalog surface may use this wording externally, Manager/Operator
should require:

1. exact upstream checkpoints for SDK W400-or-later, Licensing W401/W402-or-
   later, Website W403-or-later, and Docs W407-or-later;
2. approved customer-facing phrasing for catalog-controlled feature access,
   deployment-token feature values, active support/account coverage, and any
   denial text;
3. public-surface scans proving no raw feature fields, private/admin-only
   values, dispatch/runtime claims, support/compliance claims, callbacks,
   webhooks, public API/schema claims, or customer-visible grant promises leak;
4. docs-version and public-leak checks;
5. Astro check/build if Docs routes change;
6. Website route/auth/agent/sitemap/robots/structured-data checks if Website is
   in scope;
7. corrected interactive Claude/tmux QA on the exact public diff;
8. explicit publication/deploy authority and rollback plan.

## Options And Recommendation

Option A: keep W407 private as the Docs boundary reference for W401-W403 Gate J
public-safe wording.

- Lowest risk.
- Recommended now.
- Aligns with the current no-production Gate J posture.

Option B: request a later no-deploy routed Docs candidate after Gate J target
selection and non-production validation have been explicitly authorized and
completed.

- Useful only if Manager wants customer-facing wording staged before launch.
- Must remain source/dist-validator guarded.
- Requires approved customer-facing phrasing and exact public-surface scan
  evidence.

Option C: request coordinated public Docs plus Website wording.

- Not safe from W407 alone.
- Requires public wording approval, deployment authority, rollback plan, Website
  public-surface scans, and support/account/customer-communication review.

Recommendation: choose Option A now. Treat W407 as private boundary evidence
until Gate J target selection, non-production validation, public phrasing, and
publication authority are separately approved.

## Validation

Run from the repository root:

```bash
node --check specs/407-gate-j-public-safe-no-deploy-boundary/validate-w407-gate-j-boundary.mjs
node specs/407-gate-j-public-safe-no-deploy-boundary/validate-w407-gate-j-boundary.mjs
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/407-gate-j-public-safe-no-deploy-boundary/validate-w407-gate-j-boundary.mjs --dist
git diff --check
git diff --cached --check
```

The validator checks this private packet, current public docs source, and
optional built output for required source evidence, safe-now conceptual
classes, denied public authority terms, public-surface leakage, placeholder
tokens, local path evidence, private repo names, and secret-like tokens.
