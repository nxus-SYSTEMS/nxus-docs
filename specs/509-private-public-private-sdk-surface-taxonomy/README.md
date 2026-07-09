# W509 Private Public/Private SDK Surface Taxonomy

Private/no-deploy Docs receiver packet for RB-008 /
`NXUSKIT-V2-MEGA-20260605`, Docs W509, wave W509 of estimated W426-W492.

This public/private SDK surface taxonomy is a private draft classification
packet only. It is intended to let Docs start public/private surface review in
parallel with SDK W509 while keeping publication, public SDK exposure, release,
package, and runtime claims closed.

## Source Evidence

SDK and Manager evidence:

- SDK W470 marker:
  `READY_SDK_W470_W466_DOWNSTREAM_FIXTURE_INTAKE_SYNTHESIS`
- SDK W470 checkpoint:
  `98d8f2dca7d50ecd7404413f149f9cf38f6f1e6e`
- SDK W507 checkpoint:
  `b165966c52d1d9d8f5b618c82bcd44bbe0423a5b`
- SDK W508 checkpoint:
  `f31dc932baad00330c31caa37bba5ab283779365`
- SDK W509 posture:
  active no-scan proof-decision/model lane. Docs treats SDK W509 as in flight
  and does not rely on final W509 implementation facts.
- DevOps run-log standing approvals:
  the Operator approved six high-leverage acceleration bundles for private or
  draft-gated v2.0.0 work. The approvals are recorded below as private/gated
  context only.

Docs evidence:

- Docs W472 checkpoint:
  `261ba47e57c41427982097e0670475b911e12d62`
- Docs W459 checkpoint:
  `40a3b795f7b4e4732a02aeae373e6cd13ce4cb34`
- Docs W428 checkpoint:
  `82b32ae54e35a1f86885c834f9bdd897fe562f01`
- Docs W418 posture:
  public-safe terminology and claim-boundary guardrails remain active.
- Docs W376 checkpoint:
  `5f7ba5c818c7e6d5a40c17bf7dc8138c4169709b`

## No Public Authority Opened

Docs W509 is private/no-deploy and non-routed. It does not authorize routed
Docs pages, generated docs publication, public sync, Website copy, SDK public
API/schema/CLI/wrapper/prelude exposure, provider registry, runtime-provider
behavior, runtime discovery, DataFusion runtime, async dispatch, release,
package, deploy, changelog publication, Product Catalog/Odoo production work,
customer grants, support/compliance/security statements, or public launch copy.

The safe output from W509 is a Docs-owned taxonomy and validator for private
classification review. It is not a public documentation artifact, not a public
API contract, not release metadata, and not availability evidence.

## Operator Approvals Recorded As Private And Gated

The six Operator approvals are recorded exactly as private/gated context:

1. Private synthetic DataFusion execution bundle.
   - Scope: SDK-internal execution only against local/static/synthetic in-
     memory fixtures, including private provider fixture scan proof, schema-
     only fixture table scan, physical plan execution, and synthetic row
     materialization evidence.
   - Remaining hard gates: no customer/source data, file/network/object-store/
     catalog access, public SDK APIs, live Product Catalog/Odoo authority,
     release/package work, downstream edits, public artifacts, or W561+ work
     unless separately authorized.
2. Private async lifecycle integration bundle.
   - Scope: in-memory task/job model, result refs, terminal receipts, and
     event-sink integration over synthetic execution results only.
   - Remaining hard gates: no webhooks, managed queues, external callbacks,
     telemetry, persistence, public APIs, or live-service mutation unless
     separately authorized.
3. Public/private SDK surface classification bundle.
   - Scope: start immediately in parallel as draft/gated implementation and
     Docs/schema classification work.
   - Remaining hard gates: final public API/schema/CLI/wrapper exposure and
     package/release claims remain separately gated.
4. Product Catalog/Odoo nonproduction entitlement bundle.
   - Scope: first target is `dev` only.
   - Remaining hard gates: scratch, staging, and production are not implied;
     production mutation, customer grants, and public claims remain closed.
5. Downstream refresh bundle.
   - Scope: Examples, Celerat/Plugins, Peeler, and Docs may consume private or
     gated artifacts in parallel after relevant SDK proof/surface inputs are
     available.
   - Remaining hard gates: public publication remains separately gated.
6. Release readiness dry-run bundle.
   - Scope: changelog, package metadata, license notice, and dry-run checks may
     proceed privately.
   - Remaining hard gates: no tag, publish, deployment, or public artifact
     publication.

## Draft Classification Matrix

| Surface | Draft classification | Boundary |
| --- | --- | --- |
| Rust engine/private module internals | private-now/internal-only | Internal module wiring, private runtime context, SQL logical planning, schema-only fixture rows, physical plan metadata, fail-closed execution contracts, provider data-source boundary, provider scan authorization, and provider scan fixture authorization remain implementation evidence only. |
| public SDK/API/schema/CLI/wrapper/prelude candidates | public-candidate-draft | Candidate names and surface groupings may be tracked privately, but public API availability promise, public schema availability promise, public CLI availability promise, wrapper availability promise, and prelude availability promise remain denied until final classification and release gates open. |
| DataFusion runtime and proof surfaces | gated-until-execution-proof | Synthetic/private execution proof, physical plan evidence, fixture table scans, and synthetic row materialization must complete before any public wording can mention more than private planning. CE runtime claims remain closed. |
| async lifecycle/result-ref/receipt/event surfaces | gated-until-execution-proof | In-memory lifecycle and receipt semantics may be modeled privately. Public callbacks, webhooks, managed queues, telemetry, persistence, external lifecycle promises, and runtime dispatch claims remain closed. |
| Product Catalog/Odoo entitlement surfaces | gated-until-entitlement/dev-Odoo proof | Dev-only entitlement proof may proceed under separate authority. No production Odoo/customer grant claim, no customer-visible grant, and no live catalog mutation follows from this taxonomy. |
| Examples, Docs, Website, Celerat/Plugins, and Peeler refresh | downstream-refresh-candidate | Downstream receivers may consume private/gated proof inputs after exact checkpoints exist. This does not authorize public publication, generated public docs, Website copy, marketplace metadata, or public example promotion. |
| Demos public wording boundaries | downstream-refresh-candidate | Future demo wording should be sandbox-first by default. Binary packages are gated-later or sales-room-only unless separate signing, provenance, and publication authority opens them. |
| Release notes, package metadata, license notices, and dry-run bundle artifacts | release-dry-run-candidate | Private dry-run checks may prepare consistency evidence. Tagging, publishing, package release, changelog publication, public artifact upload, and deployment remain closed. |
| Unsupported public claims and live-state actions | forbidden/publication-closed | Support/compliance/security guarantee, production readiness wording, provider-registry readiness claim, runtime-provider readiness claim, release/publish/deploy claim, public request-access availability, live Product Catalog/Odoo mutation, and W561+ work are closed unless separately authorized. |

## Surface Coverage

Rust engine/internal module surfaces:

- classify implementation modules, private runtime context, SQL logical plan
  handling, schema-only placeholders, physical plan metadata/proof, and fail-
  closed execution contracts as private-now/internal-only;
- do not expose module paths, private feature names, internal JSON shapes,
  private table-provider topology, or fixture row details in public copy.

Public SDK/API/schema/CLI/wrapper/prelude candidates:

- classify future names and groupings as public-candidate-draft only;
- avoid promising any public API, public schema, public CLI, public wrapper,
  prelude export, provider registry entry, or stable SDK surface until SDK
  classification and release gates approve the exact surface.

Python/Go wrapper considerations:

- Python and Go wording should remain aligned to currently released public
  surfaces until a later v2.0.0 gate supplies exact wrapper authority;
- draft wrapper parity notes may be private, but public wrapper availability
  and package claims are denied.

DataFusion runtime/proof surfaces:

- classify private synthetic DataFusion execution, schema-only fixture table
  scan, physical plan execution, and synthetic row materialization as gated-
  until-execution-proof;
- no public DataFusion runtime, CE runtime, SQL execution, file/network/object-
  store/catalog access, customer data access, live provider scan, or Arrow
  payload exposure is opened.

Async lifecycle/result-ref/receipt/event surfaces:

- classify in-memory jobs, result refs, terminal receipts, and event sinks as
  gated-until-execution-proof;
- public callbacks, webhooks, managed queues, persistence, telemetry,
  external lifecycle commitments, and runtime dispatch remain denied.

provider/source/fixture surfaces:

- classify provider data-source boundary, provider scan authorization, and
  provider scan fixture authorization as private-now/internal-only unless a
  later SDK proof and public classification gate changes the surface;
- no runtime provider inventory, provider registry, live source scan, source
  refresh, object-store access, external database access, or customer record
  access is opened.

Product Catalog/Odoo entitlement surfaces:

- classify dev-only Product Catalog/Odoo entitlement proof as gated-until-
  entitlement/dev-Odoo proof;
- no scratch/staging/production implication, no production mutation, no
  customer grant, no public request-access grant, and no public entitlement
  copy is opened.

examples/docs/website public wording boundaries:

- classify copy work as downstream-refresh-candidate until exact SDK proof,
  public/private classification, public wording approval, source scans, built-
  output scans, and publication authority exist;
- future copy should reuse W418, W428, W459, W472, and this W509 guard before
  it becomes routed or customer-facing.

Demos public wording boundaries:

- classify future demos copy as sandbox-first by default because evaluator
  trust depends on source/provenance inspection before execution;
- preferred future wording classes are "Run in an official sandbox", "Open in
  Codespaces/devcontainer", and "inspect source/provenance and run with
  bounded fixtures";
- avoid public copy that leads with binary downloads, unsigned zips, or
  source-less executables;
- binary packages are gated-later or sales-room-only unless separate approval
  opens signing/provenance/release gates and publication authority;
- do not treat a demo artifact, demo download, or demo package as public launch
  evidence without exact release and provenance authority.

release/package metadata boundaries:

- classify changelog, package metadata, license notice, and dry-run checks as
  release-dry-run-candidate;
- no tag, publish, package upload, release note publication, deploy, public
  artifact publication, or public launch statement is authorized.

## Safe Draft Language

Safe now means safe for private classification work, no-deploy planning, and
later gated candidate drafting. It does not mean safe to publish.

- private classification evidence;
- draft public/private surface map;
- candidate surface grouping;
- gated synthetic execution proof;
- gated dev-only entitlement proof;
- downstream refresh candidate;
- release dry-run candidate;
- publication-closed class;
- currently internal runtime evidence;
- no-public/no-runtime/no-release posture;
- exact-surface approval required before routed copy.

## Denied Public Claims

The following classes are denied for routed Docs, generated docs, Website copy,
request-access route text, release notes, marketplace metadata, provider
registry, package metadata, public schema/API surfaces, Product Catalog/Odoo
copy, customer support materials, compliance/security materials, hosted AI
indexes, SEO metadata, structured data, and social metadata:

- public API availability promise;
- public schema availability promise;
- public CLI availability promise;
- wrapper availability promise;
- prelude availability promise;
- production readiness wording;
- support/compliance/security guarantee;
- release/publish/deploy claim;
- production Odoo/customer grant claim;
- provider-registry readiness claim;
- runtime-provider readiness claim;
- DataFusion runtime, CE DataFusion runtime, SQL execution, file access,
  network access, object-store access, catalog access, live source scan, or
  customer/source data access;
- async dispatch, public callback, public webhook, managed queue, persistence,
  telemetry, external lifecycle promise, or live-service mutation;
- public request-access availability, self-service enablement, public
  entitlement grant, Product Catalog/Odoo grant/population, or customer-visible
  grant;
- binary-first demo copy, unsigned zips, source-less executables, or public
  demo package download language before signing/provenance/release gates open;
- release notes publication, changelog publication, tag, package upload,
  deployment, public artifact publication, public mirror export, or launch
  announcement;
- W561+ work without separate Operator authority.

## Publication Gates

Before any public Docs, Website, Examples, Celerat/Plugins, Peeler, SDK,
Licensing, Product Catalog/Odoo, release-note, package metadata, or request-
access surface may use W509 taxonomy externally, Manager/Operator should
require:

1. exact SDK checkpoints for W509-or-later classification, synthetic execution
   proof, async lifecycle proof, provider fixture proof, and surface decisions;
2. public/private classification owner for each SDK API, schema, CLI, wrapper,
   prelude, DataFusion, async, provider, entitlement, downstream, and release
   metadata surface;
3. execution proof for any DataFusion, provider scan, physical plan, result-
   ref, receipt, event, or fixture-scan statement;
4. nonproduction entitlement proof for any Product Catalog/Odoo or deployment-
   token wording, with target identity, rollback owner, and data-action scope;
5. public wording approval for exact customer-facing copy;
6. source and built-output scans proving no private wave references, checkpoint
   refs, private fixture names, public SDK availability language, support/
   compliance/security guarantee, production readiness wording, provider-
   registry claim, runtime-provider claim, release/publish/deploy claim,
   public request-access availability, or production Odoo/customer grant claim;
7. docs-version and public-leak checks if Docs is in scope;
8. Astro check/build if Docs routes or generated output change;
9. Website validators if Website or request-access copy is in scope;
10. Sonnet or Opus Claude QA if available, otherwise the approved Codex QA
    fallback with the limitation recorded;
11. explicit publication/deploy authority and rollback plan.

## Options And Recommendation

Option A: keep W509 private as the current public/private SDK surface taxonomy.

- Lowest risk.
- Recommended now.
- Preserves public SDK, runtime, release, package, provider-registry, Product
  Catalog/Odoo, support/compliance/security, publication, and W561+ gates.

Option B: request a later no-deploy routed Docs candidate after SDK W509-or-
later finalizes surface classifications and execution proof exists.

- Useful only if Manager wants customer-facing wording staged for review.
- Must remain source/dist-validator guarded.
- Requires exact public/private classifications and customer-facing phrasing.

Option C: request public Docs or Website implementation.

- Not safe from W509 taxonomy alone.
- Requires explicit public wording approval, publication authority, deploy
  authority, rollback plan, and downstream public-surface scans.

Recommendation: choose Option A now. Treat W509 as a private taxonomy baseline
until SDK proof, surface classification, entitlement proof, downstream refresh
inputs, release dry-run evidence, and publication authority are separately
approved.

## Validation

Run from the repository root:

```bash
node --check specs/509-private-public-private-sdk-surface-taxonomy/validate-w509-sdk-surface-taxonomy.mjs
node specs/509-private-public-private-sdk-surface-taxonomy/validate-w509-sdk-surface-taxonomy.mjs
node specs/472-w470-downstream-fixture-terminology-boundary/validate-w472-fixture-terminology-boundary.mjs
node specs/459-discovery-boundary-terminology-synthesis/validate-w459-discovery-boundary-synthesis.mjs
node specs/428-production-ready-wording-scrub/validate-w428-production-ready-scrub.mjs
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/509-private-public-private-sdk-surface-taxonomy/validate-w509-sdk-surface-taxonomy.mjs --dist
git diff --check
git diff --cached --check
```

The validator checks this private packet, current routed docs source, and
optional built output for required W509 source references, six private/gated
approvals, classification categories, surface coverage, denied public claims,
publication gates, placeholder tokens, local path evidence, private repo names,
and secret-like tokens.
