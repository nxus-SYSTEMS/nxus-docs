# W314 ControlDecision Stage 0/1/2 No-deploy Readiness

Private Docs receiver packet for RB-008 / `NXUSKIT-V2-MEGA-20260605`,
Docs W314, RC wave 138 of revised estimated 168-196.

## Purpose

Prepare no-deploy Docs readiness for future Stage 0/1/2 ControlDecision
terminology using SDK W307 and Examples W308 evidence. This packet is private
and non-routed. It does not publish public docs, sync public docs, deploy to
`docs.nxus.systems`, mutate `nxus.systems`, or make public support,
compliance, runtime, provider-registry, release, package, or public API claims.

## Source Evidence

Docs carry-forward posture:

- Docs W305 marker:
  `READY_DOCS_W305_PUBLIC_READY_CONSEQUENCE_BOUNDARY_READINESS`
- Docs W305 checkpoint:
  `f4f062669e605d9def1897a1e94b5a392760a41b`
- W305 consequence-boundary packet:
  `specs/305-public-ready-consequence-boundary-readiness/`

SDK private evidence:

- SDK W307 marker:
  `READY_SDK_W307_CONTROL_DECISION_STAGE012_PRIVATE_SPINE`
- SDK W307 checkpoint:
  `30a54552a13b53fa3a68c04d75171942f068883d`
- SDK W307 branch:
  `codex/w307-control-decision-stage012-private-spine-20260630`
- SDK W307 report path:
  `/Users/ken/codeRepos/nxusKit-internal/tmp/v2-expanded-spec-restart-20260616/specs/115-v2-expanded-spec-restart/reports/w307-control-decision-stage012-private-spine.md`

Examples private evidence:

- Examples W308 marker:
  `READY_EXAMPLES_W308_CONTROL_DECISION_STAGE012_PRIVATE_FIXTURE`
- Examples W308 checkpoint:
  `22acfb891ace2bd232e46bec8a17ab001dfd08ef`
- Examples W308 branch:
  `codex/v2-control-decision-stage012-private-fixture-w308-20260630`
- Examples W308 fixture path:
  `/Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w308-control-decision-stage012-private-fixture/internal/preview/v2-roadmap-integration/w308-control-decision-stage012-private-fixture/fixtures/control-decision-stage012-private-fixture.json`

Examples W313 status:

- Manager log shows Examples W313 launched with expected marker
  `READY_EXAMPLES_W313_W307_CONTROL_DECISION_ALIGNMENT`.
- Local W313 worktree exists at
  `/Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w313-w307-control-decision-alignment`.
- During W314 inspection, that worktree was still at W308 checkpoint
  `22acfb8` and no W313 completion marker or W313 private package was present.
- Docs must treat W313 as pending and avoid final normalized SDK field-name,
  DTO, schema, or public wording claims until Manager supplies the W313 result.

## Evidence Posture

W307 is SDK-private evidence. It reserves an internal Stage 0/1/2 decision
spine across configuration precedence, PARC authorization, entitlement/catalog
posture, consequence-boundary receipts, readiness, and paid-runtime plugin
hardening. It does not authorize public/default/full API exposure, public
schema files, public CLI commands, provider-registry entries, runtime-provider
execution, operation dispatch semantics, release/package/tag publication,
platform expansion, or public support/compliance claims.

W308 is Examples-private evidence. It adds synthetic private ControlDecision
fixture scenarios for:

- Stage 0 configuration precedence and non-overridable critical controls;
- Stage 1 PARC authorization and consequence-boundary receipt review;
- Stage 2 paid-runtime plugin entitlement and signature hardening.

W308 keeps public selection, public export, runtime execution, provider
registry, public API, public schema, generated public artifact, release,
package publication, downstream emission, support, compliance, and sensitive
data gates false. W308 also records SDK W307 alignment as pending, so W314
must not convert W308 private fixture names into stable public docs terms.

## Public-language Constraints

Future routed Docs copy may be considered only after W313 alignment, SDK
schema/API classification, and a separate Docs publication gate. Even then,
copy should stay conceptual unless the supplied SDK gate explicitly authorizes
public/stable field names.

Potentially safe conceptual language after the gate:

- "A local decision can explain why an action continued, stopped, or required
  review."
- "Configuration can be evaluated from stronger authority scopes toward local
  preferences so critical controls are not overridden by lower-scope settings."
- "Authorization can consider the actor, action, resource, and context before a
  workflow crosses a consequence boundary."
- "An entitlement-aware catalog check can decide whether a local capability is
  available in the current context."
- "A plugin action can stay unavailable until local entitlement and signature
  checks pass."
- "Public-facing denial text should be brief, non-sensitive, and focused on
  the safe next action."

Unsafe language before the gate:

- any claim that `ControlDecision` is a shipped SDK API, stable schema, public
  CLI, provider-registry surface, package-ready feature, runtime-ready feature,
  release-ready feature, support-ready feature, or compliance-ready feature;
- any hard-coded W307/W308 DTO or fixture field name presented as a public or
  stable SDK field;
- any claim that Stage 2 plugin entitlement hardening is public runtime plugin
  support, provider-registry support, package publication readiness, or
  customer-visible entitlement enforcement;
- any claim that public docs, release notes, generated public artifacts, or
  downstream surfaces may emit W307/W308 terms before W313 and the publication
  gate;
- any customer, legal, safety, medical, compliance, or support guarantee;
- any public claim that consequence boundaries, read-only effects, cascades,
  safe-next actions, or denial messaging are shipped SDK behavior before the
  relevant SDK/publication gates open.

## Concept Readiness Matrix

| Concept | Private evidence | Future Docs framing | Current public authority |
| --- | --- | --- | --- |
| ControlDecision | W307/W308 | Conceptual decision explanation only after W313/publication gate | None; private/no routed copy |
| Configuration precedence | W307/W308 | Higher-authority policy evaluated before local preferences | None; no stable public field names |
| PARC authorization | W307/W308 | Actor/action/resource/context authorization posture | None; no support/compliance claim |
| Entitlement/catalog | W307/W308 | Entitlement-aware availability check if later approved | None; catalog refs stay private/source-ref-only |
| Stage 2 plugin entitlement hardening | W307/W308 | Local plugin action unavailable until entitlement/signature checks pass | None; no public plugin runtime claim |
| Consequence boundary | W305/W307/W308 | Carry W305 conceptual boundary constraints | Pending W313 and SDK classification |
| Runtime readiness | W307/W308 | Denied unless later gate explicitly authorizes runtime behavior | None |
| Public-safe denial messaging | W308 | Short, non-sensitive denial plus safe next action | Conceptual only; no routed copy |

## Future Implementation Gates

Before any routed/public Docs implementation lane, Manager must provide:

1. Examples W313 marker/checkpoint and its alignment disposition, or explicit
   approval to continue with W313 pending and conceptual-only wording.
2. SDK schema/API classification for W307/W313 terms and whether
   `ControlDecision` is public, private, experimental, or denied.
3. Approved public terms and forbidden terms for configuration precedence,
   authorization, entitlement/catalog, Stage 2 plugin hardening, consequence
   boundary, runtime readiness, and denial messaging.
4. Confirmation whether copy belongs in routed docs, release notes, examples
   pages, website copy, or private planning only.
5. Explicit Docs publication/deploy gate if public publication is in scope.

## Validation

Run from `/Users/ken/codeRepos/nxus-docs`:

```bash
node --check specs/314-control-decision-stage012-no-deploy-readiness/validate-w314-control-decision-stage012-readiness.mjs
node specs/314-control-decision-stage012-no-deploy-readiness/validate-w314-control-decision-stage012-readiness.mjs \
  --w308-fixture /Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w308-control-decision-stage012-private-fixture/internal/preview/v2-roadmap-integration/w308-control-decision-stage012-private-fixture/fixtures/control-decision-stage012-private-fixture.json \
  --w313-status pending
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/314-control-decision-stage012-no-deploy-readiness/validate-w314-control-decision-stage012-readiness.mjs \
  --w308-fixture /Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w308-control-decision-stage012-private-fixture/internal/preview/v2-roadmap-integration/w308-control-decision-stage012-private-fixture/fixtures/control-decision-stage012-private-fixture.json \
  --w313-status pending \
  --dist
```

The validator proves:

- W308 remains private, uncleared, and synthetic/non-claim.
- W308 carries W300/W303 and SDK W290/W295 source evidence.
- W308 public-boundary gates remain false.
- W308 still marks W307 alignment as pending when W313 is pending.
- Stage 0/1/2 private scenario coverage is present.
- Stage 2 plugin entitlement/signature checks remain private and
  source-ref-only.
- Current routed Docs source and optional built output do not emit
  ControlDecision, configuration-precedence, PARC, plugin-entitlement, or
  unstable public-ready authority claims.

## Publication Hard Stops

This W314 packet keeps these gates closed:

- deploy or publication to `docs.nxus.systems`, `nxus.systems`, or any public
  surface;
- public docs sync or generated public output publication;
- routed public docs edits;
- release/tag/package work;
- SDK, Examples, Website, Celerat/Plugins, Peeler, or source repo edits;
- downstream prompts beyond the Manager callback;
- provider registry, runtime-provider execution, or runtime plugin support
  claims;
- public support, compliance, legal, medical, or safety claims;
- stable SDK schema/API field claims before W313 and SDK classification.

## Recommended Next Option

Manager should wait for Examples W313 and SDK schema/API classification before
opening any routed Docs implementation lane for ControlDecision terminology. If
W313 supplies stable alignment and the SDK classification opens conceptual
public copy, request a separate no-deploy routed-copy implementation lane with
the W314 validator plus normal Docs build checks. If W313 remains pending or
classification stays private/unstable, keep W314 as private readiness evidence
only.
