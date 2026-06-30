# W317 Control Decision Public-safe No-deploy Copy

Private Docs receiver packet for RB-008 / `NXUSKIT-V2-MEGA-20260605`,
Docs W317, RC wave 141 of revised estimated 168-196.

## Purpose

Create a no-deploy, route-adjacent public-safe copy candidate for Stage 0/1/2
ControlDecision concepts after Examples W313 alignment, without publishing
docs, syncing generated public docs, or making support, compliance, runtime,
provider-registry, release, package, public API, or public schema claims.

This packet is intentionally non-routed. It does not edit
`src/content/docs/**`, `scripts/sync-local-docs.mjs`, Astro config, generated
docs output, release notes, or deploy paths.

## Source Evidence

Docs carry-forward:

- Docs W305 marker:
  `READY_DOCS_W305_PUBLIC_READY_CONSEQUENCE_BOUNDARY_READINESS`
- Docs W314 marker:
  `READY_DOCS_W314_CONTROL_DECISION_STAGE012_NO_DEPLOY_READINESS`
- Docs W314 checkpoint:
  `3e57fa080601d6201bc41a438b4d90ae71e44c8e`

SDK evidence:

- SDK W301 marker:
  `READY_SDK_W301_PUBLIC_READY_FEATURE_RICH_BOUNDARY_CLASSIFICATION`
- SDK W301 checkpoint:
  `9b99495933bb58e04da7da3999297cc468d08827`
- SDK W307 marker:
  `READY_SDK_W307_CONTROL_DECISION_STAGE012_PRIVATE_SPINE`
- SDK W307 checkpoint:
  `30a54552a13b53fa3a68c04d75171942f068883d`
- SDK W312 marker:
  `READY_SDK_W312_STAGE2_RUNTIME_PLUGIN_HARDENING_SCOPE`
- SDK W312 checkpoint:
  `2edb2c9c175ba0eced335798016936473c9e942a`

Examples evidence:

- Examples W313 marker:
  `READY_EXAMPLES_W313_W307_CONTROL_DECISION_ALIGNMENT`
- Examples W313 checkpoint:
  `db1dae21093a2e5dd132a744b855b06f84b010b7`
- Examples W313 package path:
  `/Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w313-w307-control-decision-alignment/internal/preview/v2-roadmap-integration/w313-w307-control-decision-alignment/`

## W317 Decision

W317 uses a route-adjacent copy candidate instead of editing routed docs.

Reasons:

- `AGENTS.md` states that product docs under `src/content/docs/nxuskit/` are
  generated from upstream product repos, so direct edits there should be
  reserved for explicitly authorized routed-docs implementation or upstream
  sync correction.
- W301 classifies feature-rich public-readiness boundaries but grants no
  public API, public schema, CLI public schema, provider-registry, runtime,
  release, package, support, or compliance authority.
- W312 keeps Stage 2 plugin hardening private/conformance-only, with no public
  API, schema, runtime, provider-registry, release, package, support, or
  compliance authority.
- W313 supersedes the earlier W308 pending-alignment state, but still keeps
  public selection, public export, runtime execution, provider registry,
  generated public artifact, support, compliance, release, package, public API,
  and public schema gates closed.

The safe product increment is therefore a reusable public-safe copy candidate
and validator that a later hard-gated routed Docs lane can consume after SDK
schema/API classification and publication authority stabilize.

## Candidate Copy Posture

Candidate copy lives in
`specs/317-control-decision-public-safe-no-deploy-copy/candidate-copy.md`.

The candidate:

- uses conceptual terms such as local control decisions, stronger policy,
  local preferences, capability availability, consequence boundary, and safe
  next step;
- avoids the class-like `ControlDecision` spelling in proposed public copy;
- avoids W307/W313 private identifiers, raw stage labels, entitlement field
  names, provider-registry wording, runtime wording, support/compliance claims,
  package/release posture, and public API/schema claims;
- keeps advanced extension wording conceptual and unavailable-by-default until
  a later gate supplies public authority.

## Public-safe Constraints

Future routed Docs copy may be requested only when Manager supplies a separate
hard gate. Until then, Docs copy should:

- explain local decisions as conceptual decision boundaries, not SDK API
  objects;
- describe configuration as stronger policy evaluated before local
  preferences, not as stable field names or a shipped schema;
- describe authorization through actor, action, resource, and context without
  compliance or support guarantees;
- describe capability availability without publishing private entitlement keys;
- carry the W305 consequence-boundary framing that read-only operations can
  still create observable traces or review obligations;
- describe denial text as short, non-sensitive, and focused on a safe next
  step;
- keep Stage 2 plugin hardening as private readiness evidence, not public
  runtime, package, provider-registry, entitlement, or support posture.

Unsafe before a later gate:

- shipped `ControlDecision` API/schema/CLI wording;
- W307/W313 private identifiers presented as public terms;
- Stage 0/1/2 labels in routed public copy;
- provider-registry, runtime-provider, package-ready, release-ready,
  support-ready, compliance-ready, public-ready, public API, or public schema
  wording;
- public claims for plugin loading, delegated trust roots, signed manifest or
  binary enforcement, dispatch-time checks, or Enterprise override behavior;
- public support, compliance, legal, medical, safety, or customer-visible
  entitlement guarantees.

## Future Implementation Gates

Before any routed/public Docs implementation lane, Manager must provide:

1. explicit permission to edit routed docs or an upstream generated-docs source
   path to sync from;
2. SDK schema/API classification for whether `ControlDecision` may be named
   publicly or must remain conceptual/private;
3. approved public terms for configuration precedence, authorization,
   capability availability, consequence boundary, advanced extension checks,
   and denial messaging;
4. confirmation that W312 Stage 2 plugin hardening remains conceptual/private
   or has gained a separate public runtime/package authority;
5. deploy/publication approval if the lane includes publication to
   `docs.nxus.systems` or related public surfaces.

## Validation

Run from `/Users/ken/codeRepos/nxus-docs`:

```bash
node --check specs/317-control-decision-public-safe-no-deploy-copy/validate-w317-control-decision-copy.mjs
node specs/317-control-decision-public-safe-no-deploy-copy/validate-w317-control-decision-copy.mjs \
  --w313-fixture /Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w313-w307-control-decision-alignment/internal/preview/v2-roadmap-integration/w313-w307-control-decision-alignment/fixtures/w307-control-decision-alignment.json
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/317-control-decision-public-safe-no-deploy-copy/validate-w317-control-decision-copy.mjs \
  --w313-fixture /Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w313-w307-control-decision-alignment/internal/preview/v2-roadmap-integration/w313-w307-control-decision-alignment/fixtures/w307-control-decision-alignment.json \
  --dist
```

The validator proves:

- W313 is aligned to SDK W307 but remains private, uncleared, and non-claim;
- W313 public and authority gates remain false;
- W313 covers the expected decision kinds, precedence order, plugin-hardening
  denial posture, and negative cases;
- W317 candidate copy uses only the approved conceptual vocabulary;
- current routed Docs source and optional built output do not emit W317
  ControlDecision, Stage 0/1/2, private entitlement, runtime, provider-registry,
  support, compliance, release, package, public API, or public schema claims.

## Publication Hard Stops

This packet keeps closed:

- deploy or publication to `docs.nxus.systems`, `nxus.systems`, or any public
  surface;
- public sync or generated public output publication;
- routed public docs edits;
- release/tag/package work;
- SDK, Examples, Website, Celerat/Plugins, Peeler, or source repo edits;
- downstream prompts beyond the required Manager callback;
- provider registry, runtime/provider execution, source refresh, dependency
  changes, or plugin runtime claims;
- public support, compliance, legal, medical, safety, or customer-visible
  entitlement claims.

## Recommended Next Option

The next safe Docs lane is a hard-gated routed-copy implementation request only
if Manager supplies explicit routed-docs authority plus SDK/public-term
classification. Without that, keep this packet as reusable public-safe copy and
validation evidence for Website, Examples, Celerat/Plugins, and release-note
review without sending downstream prompts.
