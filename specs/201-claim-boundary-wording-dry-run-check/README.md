# W201 Docs Claim-Boundary Wording Dry-Run Check

Status: private Docs planning/check artifact only. This is not public docs
content, not generated public docs output, not publication/deploy, not release
notes, not public schemas, not public export, not provider-registry/package/API
authority, and not a downstream prompt.

Run: `NXUSKIT-V2-MEGA-20260605`

Wave: W201-Docs, private claim-boundary wording dry-run/check after SDK W200.

Prepared: 2026-06-25

RC sequence: W201 is RC wave 25 of the current estimated 32-45 wave
feature-rich disciplined RC sequence.

## Source Posture Consumed

| Source | Evidence | Docs use |
| --- | --- | --- |
| SDK W196 | `READY_SDK_W196_PROJECTION_CLAIM_BOUNDARY_POLICY_STATIC_GUARD`; checkpoint `0674a7c98fd7f69e522be160221472b56c0d6328`. | `PublicDocsGuarded` is private planning only. `PublicDocsAllowed` and downstream emission are denied for current non-`Passed` projection rows. |
| SDK W198 | `READY_SDK_W198_CLAIM_BOUNDARY_FORBIDDEN_FRAGMENT_HARDENING`; checkpoint `e1ececff5b766161d19f74c16e6d42efc976ea68`. | Structured enum/value metadata may contain private authority-like values, but free-form copy, refs, warning keys, field paths, fingerprints, downgrade reasons, and draft text must reject public-docs/downstream/provider/package/release/generated-artifact fragments. |
| SDK W199 | `READY_SDK_W199_DOWNSTREAM_RECEIVER_HANDOFF_CHECKLIST_PACKET`; checkpoint `c2e9c96d69d2e208e4d7d390133f3a45a8f9faa5`. | Docs may read only listed private fields/guards for a receiver-specific lane; no downstream prompt, repo edit, publication, release, package, registry, runtime, or support authority is implied. |
| SDK W200 | `READY_SDK_W200_RC_PROCESS_READINESS_PACKET`; checkpoint `5f843263341b2064e2ce28d927563f10e90596b1`. | SDK v2.0.0 remains not RC-ready for public docs, public release, package publication, examples export, Website, Celerat, provider registry, public/default/full wrapper/API, or release notes. Docs wording dry-run is the recommended lowest-risk receiver lane. |
| Docs W143 | `READY_DOCS_W143_HELLO_PROVIDER_DOCS_CONSUMPTION_PACKET`; checkpoint `3d396786693d791d36d2f98a8fb7a67254e898a7`. | `hello-provider` is approved-public selection metadata but must remain `extension_authoring`, not production-ready, getting-started, onboarding, provider-registry, runtime-provider, or broad community-provider intake copy. |

## Copy-Class Wording Map

| Class / signal | Safe Docs wording | Unsafe Docs wording | Docs action |
| --- | --- | --- | --- |
| `PublicDocsGuarded` | "Private planning evidence for later Docs review." | "Docs-approved", "publishable", "docs-ready", "safe for public docs". | Keep non-routed and non-emitted. |
| `PublicDocsAllowed` on a non-`Passed` row | "Denied until passed evidence and explicit public-docs gate exist." | Any public docs permission, publication approval, or downstream emission claim. | Hard-fail future public wording. |
| `private_only` | "Private/internal evidence only." | Public feature, public support, public docs, release note, product page, package, or provider catalog claim. | Suppress from public docs. |
| `internal_use_only` | "Internal-use-only planning row." | Customer-facing availability, support, entitlement, or setup language. | Suppress from public docs and generated indexes. |
| Licensed-private | "Licensed-private preview/evidence, subject to entitlement and approval." | Public CE feature, broadly available provider, public support, default/full API, or package claim. | Use only in internal planning unless an entitlement/public-copy gate opens. |
| Research | "Research or due-diligence evidence." | Roadmap promise, supported provider, release commitment, or implementation schedule. | Keep as internal context. |
| Experimental | "Experimental/private validation path." | Stable feature, production-ready feature, supported API, or release-ready surface. | Keep non-claim; require future source-truth and support review. |
| Preview | "Private preview/projection-preview posture." | Public preview program, package availability, SDK wrapper support, or public API readiness. | Keep gated and distinguish from release preview. |
| Unsupported | "Unsupported in current public SDK posture." | Workaround as support commitment, partial support, or customer-visible support pledge. | Public docs may only state absence if Manager opens a public correction lane. |
| Validation-pending | "Validation pending; no public claim." | Passed, docs-ready, release-ready, generated-artifact-ready, package-ready. | Suppress public docs until passed evidence and gate. |
| Denied | "Denied or not eligible for public emission." | Available with caveats, hidden preview, opt-in support. | Fail closed. |
| Stale | "Stale/private evidence; do not use for current public copy." | Current status, latest docs, support statement, install guidance. | Require fresh source-truth before any copy. |
| Downgraded | "Downgraded from earlier private posture." | Feature improvement, readiness progression, release confidence. | Explain internally only; do not market. |
| Blocked-by-cap | "Blocked by capability cap or explicit risk limit." | Available with limits, cap-raised, entitlement-enabled, supportable. | Keep closed until cap decision changes. |
| Any non-`Passed` row | "Not public-docs-authoritative." | Public docs allowed, downstream emission, package/release/provider readiness. | Do not publish or generate public copy. |

## Surface-Specific Boundaries

| Surface | Safe internal wording | Hard-stop wording |
| --- | --- | --- |
| `hello-provider` | "`extension_authoring` / extension-authoring example for SDK extension authorship; community extension manifest tutorial; deterministic local fixture; no network, credentials, provider account, or third-party provider SDK." | Production-ready, getting-started, onboarding/new-user path, engine inventory/discovery, CLIPS smoke, provider registry, runtime provider loader/interrogation, public API/wrapper, generalized mesh, broad community intake, real smoke, Windows, macOS x86_64. |
| RRE / `rust-rule-engine` | "Private validation-pending rule-engine/resource-bearing candidate; static/planning evidence; no dependency/package/provider adoption." | Shipped RRE provider, public rule runtime, package dependency, public support, provider-registry entry, generalized engine mesh, CLIPS replacement. |
| Prolog / Scryer | "Private/local-variant or upstream-pending evidence; optional private `provider-prolog` posture; no public dependency decision." | Public Prolog support, provider registry, default/full feature, release dependency, public examples/docs, package/API support, runtime provider claim. |
| Cedar | "Licensed-private preview/protected-boundary evidence; static proof posture; validation-pending or guarded." | Public Cedar provider, runtime evaluator, public policy engine, CE availability, provider-registry entry, release support, public docs/tutorial claim outside approved selection. |
| CLIPS | "Existing public v1.x CLIPS docs remain source-truth bound; private resource/model mapping and freshness rows are static/fixture-only." | New `rule-evaluate` implementation, production inventory collection, live CLIPS interrogation, broad runtime inventory, unsupported operation support. |
| Pydantic v2 | "Private projection-preview/static diagnostic/freshness rows; validation-pending." | Pydantic runtime/import execution, generated package/artifact, public schema docs, wrapper/API readiness, release-ready projection. |
| TypeScript/Zod | "Private TypeScript/Zod projection-preview/static fixture rows; no generated code authority." | TypeScript SDK support, Zod generation availability, npm-ready, generated artifact, public wrapper/API, Node SDK support. |
| Node wrapper preview | "Private Node wrapper preview projection row; static evidence only." | Current Node SDK support, Node wrapper implementation, npm package, generated artifact emission, public/default/full API, package readiness. |

## W198 Free-Form Fragment Guard For Docs

W198 permits structured private metadata values in typed rows, but Docs must
treat authority-like words in free-form copy as unsafe unless a later public
gate explicitly authorizes them. This applies to draft prose, table notes,
links, references, warning/copy keys, field paths, generated-output refs,
diagnostic refs, downgrade reasons, metadata captions, release-note drafts, and
cross-surface handoff snippets.

Forbidden authority fragments for free-form Docs wording include both hyphen
and underscore variants where applicable:

- `public-docs`, `public_docs`;
- `docs-allowed`, `docs_allowed`;
- `downstream-emission`, `downstream_emission`;
- `downstream-emission-authorized`, `downstream_emission_authorized`;
- `provider-registry`, `provider_registry`;
- `package-publication`, `package_publication`;
- `npm-ready`, `npm_ready`;
- `release-ready`, `release_ready`;
- `public-ready`, `public_ready`;
- `generated-artifact`, `generated_artifact`;
- `generated-artifact-ready`, `generated_artifact_ready`;
- any close phrase that implies public docs, generated artifacts, downstream
  emission, provider registry, package publication, npm, release, or public
  support authority.

Future Docs checks should fail closed if these fragments appear as authority in
free-form copy. They may appear inside an internal guard artifact only as
quoted forbidden fragments, denial text, scan vocabulary, or source-trace
evidence.

## Reusable Cross-Surface Copy Guard

Website, Examples, Celerat/Plugins, and release-note lanes may reuse these
phrases when their own Manager-approved planning/check lanes open:

- "private planning evidence only";
- "not public-docs-authoritative";
- "non-`Passed` rows remain non-emitted";
- "projection-preview/static evidence only";
- "extension-authoring example";
- "validation pending; no public claim";
- "licensed-private preview; entitlement and public-copy gates remain closed";
- "structured metadata is not free-form public-copy authority";
- "no provider-registry, package, runtime, public API, generated-artifact, or
  release-note authority follows from this row."

Reusable copy must not be copied into public pages, release notes, Website
cards, Examples export text, plugin prompts, or catalog metadata until that
surface has its own explicit implementation/publication authorization.

## Missing Inputs Before Future Docs Implementation

Docs implementation or publication remains blocked until Manager provides:

1. A specific source-truth set for Docs to consume, including SDK checkpoint(s),
   Examples checkpoint(s), and any Website/Celerat/release-note dependencies.
2. A public/private classification table for each row intended for public copy.
3. Passed evidence and explicit approval for any row that would use
   `PublicDocsAllowed`.
4. A rule for whether the future lane is sync-only, draft-only, or publication
   eligible.
5. Confirmation that `hello-provider` source wording has a publication-safe
   handoff state, or approval for a Docs scrub that removes "handoff remains
   gated" from the published detail page.
6. Final decisions for whether any RRE, Prolog/Scryer, Cedar, CLIPS
   `rule-evaluate`, Pydantic v2, TypeScript/Zod, or Node wrapper text may be
   mentioned publicly at all.
7. Separate Operator approval for deploy/publication, if publication is in
   scope.

## Future Docs Lane Posture

Safe to request next:

- a private Docs implementation-prep lane that adds wording checks or local
  validation helpers under `scripts/` or `specs/` only;
- a private sync dry-run lane that computes diffs without deployment or public
  publication, if source-truth and branch isolation are explicit.

Not safe without a new hard gate:

- routed public docs page edits;
- generated public docs output;
- public schema docs;
- release-note text;
- provider-registry/provider catalog wording;
- public package/wrapper/API docs;
- docs deploy/publication;
- any statement that SDK v2.0.0 is RC-ready, release-ready, public-ready, npm-
  ready, package-ready, provider-ready, or generated-artifact-ready.

Hard stop if a future lane requires public docs routes, generated docs output,
release notes, public schemas, support/provider/package/API wording, public
Examples export, Website/Celerat publication, runtime/projection execution, or
platform expansion.

## W201 Outcome

W201 creates a reusable private Docs wording map and copy guard. It does not
edit routed public docs, generate docs output, publish/deploy, draft release
notes, change SDK/Examples/Website/Celerat/Peeler/Licensing repos, send
downstream prompts, expose provider registry/package/API surfaces, execute
runtime/projection behavior, or claim SDK v2.0.0 is RC-ready.
