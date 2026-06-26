# W203 Private Sync Dry-Run Check

Status: private Docs planning/check artifact only. This is not routed public
docs content, not a sync script change, not generated public docs output, not
publication or deploy, not release notes, not public schemas, not public
export, not provider-registry or package authority, and not a downstream
prompt.

Run: `NXUSKIT-V2-MEGA-20260605`

Wave: W203-Docs, private sync dry-run/check after W202.

Prepared: 2026-06-25

RC sequence: W203 is RC wave 27 of the current estimated 32-45 wave
feature-rich disciplined RC sequence.

## Source Posture Consumed

| Source | Evidence | W203 use |
| --- | --- | --- |
| Docs W202 | `READY_DOCS_W202_PUBLICATION_GATED_COPY_DRY_RUN_CHECK`; checkpoint `013b0b016bb90315692dd96aab6022eed578249d`. | Immediate publication-gated copy/output class map for sync-source and transform review. |
| Docs W201 | `READY_DOCS_W201_CLAIM_BOUNDARY_WORDING_DRY_RUN_CHECK`; checkpoint `c1d010ab6cf58e3a0dad402397d236c8af270aaa`. | Claim-boundary wording guard for safe, denied, downgraded, private, licensed-private, preview, and non-`Passed` rows. |
| SDK W196 | `READY_SDK_W196_PROJECTION_CLAIM_BOUNDARY_POLICY_STATIC_GUARD`; checkpoint `0674a7c98fd7f69e522be160221472b56c0d6328`. | `PublicDocsGuarded` is private planning only; `PublicDocsAllowed` remains denied for current non-`Passed` projection rows. |
| SDK W198 | `READY_SDK_W198_CLAIM_BOUNDARY_FORBIDDEN_FRAGMENT_HARDENING`; checkpoint `e1ececff5b766161d19f74c16e6d42efc976ea68`. | Sync-source names, refs, paths, warning keys, copy keys, output names, and generated text must not use authority-like fragments as permission. |
| SDK W199 | `READY_SDK_W199_DOWNSTREAM_RECEIVER_HANDOFF_CHECKLIST_PACKET`; checkpoint `c2e9c96d69d2e208e4d7d390133f3a45a8f9faa5`. | Docs may inspect only named private fields/guards and must keep publication, release, package, registry, runtime, and support gates closed. |
| SDK W200 | `READY_SDK_W200_RC_PROCESS_READINESS_PACKET`; checkpoint `5f843263341b2064e2ce28d927563f10e90596b1`. | SDK v2.0.0 remains not RC-ready for public docs, public release, package publication, examples export, Website, Celerat, provider registry, wrappers, APIs, or release notes. |
| Docs W143 | `READY_DOCS_W143_HELLO_PROVIDER_DOCS_CONSUMPTION_PACKET`; checkpoint `3d396786693d791d36d2f98a8fb7a67254e898a7`. | `hello-provider` may be planned only as approved-public `extension_authoring`; no production-ready, getting-started, onboarding, runtime-provider, registry, or platform-expansion copy. |

## Sync Path Inspection

W203 inspected these current sync-source and transform points without editing
them:

- `scripts/sync-local-docs.mjs` examples path:
  - `readExamplesManifestMetadata()` requires
    `conformance/examples_publication_selection.json` by default;
  - raw `conformance/examples_manifest.json` is available only through
    `NXUSKIT_DOCS_ALLOW_LEGACY_RAW_EXAMPLES_MANIFEST=1`;
  - `readExamplesPublicationSelectionMetadata()` validates selection type,
    schema/source/ledger fields, docs channel, downstream consumer,
    approved-example counts, selected-source hashes, and example content hashes;
  - `readExamplesDocsExportManifest()` limits companion docs to approved
    docs-channel examples;
  - `validateGeneratedExampleDocs()` rejects pages or Markdown outside the
    approved docs-channel set;
  - `toExamplesStarlightPage()` and `toExampleDetailStarlightPage()` render the
    generated index and detail pages;
  - `scrubExamplesTrustWording()` downgrades several production-claim phrases
    before rendering;
  - `rewriteExampleDocLinks()` and `publicExamplesTarget()` rewrite links to
    approved routes or public source targets.
- `scripts/sync-local-docs.mjs` SDK path:
  - `syncSdk()` consumes `docs/user` or `sdk-packaging/docs`, wraps packaging
    docs with known route metadata, archives current docs when changelog
    version increases, and runs leak gates before copy.
- `scripts/public-docs-policy.mjs` and `scripts/check-public-leaks.mjs` provide
  public leak terms for routed content only.
- Current routed surfaces inspected as future targets only:
  `src/content/docs/nxuskit/examples/index.md`,
  `src/content/docs/nxuskit/examples/**/index.md`,
  `src/content/docs/index.mdx`, `src/content/docs/nxuskit/index.md`, and
  `src/content/docs/nxuskit/reference/changelog.md`.

W203 does not run a sync command, change sync scripts, create generated docs,
edit routed content, or write build artifacts.

## Private Sync Dry-Run Matrix

| Class | Safe sync input | Denied sync input | Safe transform output | Denied transform output | Missing source authority / gate |
| --- | --- | --- | --- | --- | --- |
| Examples selection metadata | `examples_publication_selection.json` with selection type `nxuskit-examples-approved-public-selection`, docs public channel, docs export consumer, approved status, selected-source hash match, and content hash match. | Raw manifest as default; candidate, held, internal, excluded, missing docs channel, mismatched hash, missing source/ledger, or unapproved companion docs. | Route/list only approved docs-channel examples; preserve approved source hash provenance in private checks. | Routable candidate/internal pages, search-indexed unapproved pages, companion docs outside approved set, or generated copy implying selection is publication authority. | Manager-selected Examples checkpoint and approved-public selection/profile artifact. |
| Examples README/index copy | Source README from approved selection source; trust scrub still applied. | Blanket production-ready count, publication-gated handoff language copied into public page without scrub decision, or unapproved v2 examples. | "Runnable examples", profile-aware production-ready vs extension-authoring distinction, edition note bounded by source metadata. | `hello-provider` as production-ready, getting-started, onboarding, or new-user path; raw candidate count; v2 release-readiness claim. | Public-safe source wording or Manager-approved Docs scrub for source wording that still says handoff/export/publication remains gated. |
| Example detail pages | README for each approved docs-channel example and approved companion docs only. | Missing README, source under internal/dot/private path, companion doc for unapproved parent, Cedar/RRE/Prolog candidate detail from private evidence. | Detail page with source-truth title/description, local fixture wording, no secrets, no raw payloads, no local absolute paths. | Runtime provider loader, provider registry, package/API, platform support, live/prod support, generated-output, or public release claim. | Future sync dry-run diff and public-copy review before any routed page commit. |
| `hello-provider` profile | Approved docs-channel record with `public_readiness_profile` or equivalent field showing `extension_authoring`. | Missing profile rendered as production-ready without assertion, getting-started label, broad provider intake, engine discovery, CLIPS smoke, real-smoke, Windows, or macOS x86_64 wording. | "Extension-authoring example for SDK extension authorship; deterministic local fixture; no network, credentials, provider account, license key, or third-party provider SDK." | Production-ready, getting-started, onboarding/new-user, runtime provider loader, public wrapper/API, provider registry, generalized mesh. | Profile-aware transform assertion and source wording handoff closure. |
| Provider/capability docs | Current v1.x SDK source docs and existing public provider docs, source-truth bound. | v2 private provider rows, RRE/Prolog/Cedar runtime/provider candidates, projection-preview rows, provider registry hints. | Existing v1.x CLIPS/BN/Solver/ZEN/local-provider copy only when already source-backed and version appropriate. | New public provider availability, support commitment, provider registry, runtime execution, default/full API, generalized mesh, package dependency. | Explicit public provider/support/API decision and source checkpoint. |
| SDK packaging/changelog sync | Current v1.x changelog and packaging docs through `syncSdk()` with archive/version policy and leak gates. | v2 RC planning rows, release-process packet text, private projection diagnostics, internal-only rows, release notes without Operator authority. | Current public v1.x install/reference/changelog updates when source release facts are final. | SDK v2 release-ready, public-ready, package-ready, provider-ready, npm-ready, generated-artifact-ready, or public support claim. | Operator release/changelog authority, final SDK source/tag/assets, and docs implementation gate. |
| Warning/callout/copy keys | Internal denial labels such as "validation pending", "non-emitted", and "private planning evidence only" inside private artifacts. | Warning keys or copy keys containing authority-like fragments as permission, readiness, publication, package, registry, or downstream emission. | Future validation-helper errors that fail closed before routed output. | Public callouts that turn guarded/private metadata into a customer-facing preview, support, entitlement, or package claim. | W198 fragment scan over source names, refs, field paths, warning keys, and generated text. |
| Hosted AI indexes | Normal build-generated `dist/llms.txt` and `dist/llms-full.txt` after approved routed docs changes. | Hand-edited root or `dist` indexes, indexes from private dry-run content, or indexes containing internal planning artifacts. | Generated indexes from approved public docs only. | Private specs indexed as product docs, generated package/API/provider-ready claims in hosted indexes. | Separate build/deploy gate after approved public docs implementation. |

## Surface-Specific Sync Boundaries

| Surface | Safe sync posture | Deny or downgrade |
| --- | --- | --- |
| `hello-provider` | Approved docs-channel example only if rendered as `extension_authoring` / SDK extension authorship with local deterministic fixture language. | Production-ready, getting-started, onboarding, engine inventory/discovery, CLIPS smoke, provider registry, runtime provider loader, public wrapper/API, generalized mesh, real smoke, Windows, macOS x86_64. |
| RRE / `rust-rule-engine` | Private validation-pending candidate in internal matrices only. | Public example route, provider docs, package dependency, public rule runtime, provider registry, support commitment, CLIPS replacement. |
| Prolog / Scryer | Private/local-variant or upstream-pending evidence only. | Public Prolog provider, default/full feature, registry entry, release dependency, public examples/docs, package/API/runtime claim. |
| Cedar | Licensed-private preview/protected-boundary evidence only unless separately approved. | Public Cedar tutorial, CE availability, runtime evaluator, public policy engine, provider registry, release support. |
| CLIPS | Existing public v1.x CLIPS docs remain source-truth bound; v2 private mapping/freshness rows remain private/static. | New `rule-evaluate` implementation, live inventory, runtime interrogation, broad provider inventory, unsupported operation support. |
| Pydantic v2 | Private projection-preview/static diagnostic row only. | Runtime/import execution, public schema docs, generated package/artifact, wrapper/API readiness, release-ready projection. |
| TypeScript/Zod | Private projection-preview/static fixture row only. | TypeScript SDK support, Zod generation availability, npm output, generated artifact, public wrapper/API, Node SDK support. |
| Node wrapper preview | Private projection-preview/static row only. | Current Node SDK support, Node wrapper implementation, npm package, generated artifact emission, public/default/full API, package readiness. |

## W201 / W202 Guard Application

W203 applies W201 and W202 to sync classes as follows:

1. Treat all `PublicDocsGuarded`, private, internal, licensed-private,
   research, preview, unsupported, validation-pending, denied, stale,
   downgraded, blocked-by-cap, and non-`Passed` rows as non-emitted unless a
   later public gate changes the row.
2. Require approved-public Examples selection and docs-channel eligibility
   before any examples source can become routable.
3. Keep raw-manifest sync as legacy/local only; it is not a future public
   current-docs source.
4. Require profile-aware handling before `hello-provider` can be synced, so
   `extension_authoring` is not collapsed into production-ready copy.
5. Keep provider/capability, release/changelog, warning/callout, generated
   output, and AI-index text inside W202's publication-gated copy classes.
6. Treat private dry-run matrices as advisory and non-publishing; they do not
   authorize sync execution, generated output, routed commits, or deployment.

## W198 Sync Fragment Exercise

W203 treats the following fragments as forbidden authority in sync-source names,
refs, field paths, warning keys, copy keys, output refs, draft output, and
transform-output text. Hyphen and underscore variants are equivalent:

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
- `generated-artifact-ready`, `generated_artifact_ready`.

These fragments may appear in this internal artifact only as quoted scan
vocabulary, denied examples, or source-trace evidence. A future sync helper
should fail closed if any fragment appears as source or transform authority.

## Recommendation For Next Docs Lane

Safer next step: a private validation-helper lane before any routed
implementation lane.

Rationale:

- current sync already has strong approved-public selection gates, but W143
  identified gaps around `public_readiness_profile` preservation and explicit
  assertions that `extension_authoring` examples cannot render as
  production-ready;
- W202/W203 fragment exercises are currently private checklists, not executable
  sync assertions;
- a small validation-helper lane could add tests or script checks without
  committing routed docs or generated output.

Minimum inputs for that validation-helper lane:

1. The exact Examples checkpoint intended for future dry-run testing.
2. Expected profile counts and an explicit `hello-provider` profile row.
3. The W198 fragment list as executable scan vocabulary for source refs,
   warning keys, output refs, and transformed text.
4. A fixture or source snapshot that includes candidate/excluded examples to
   prove fail-closed behavior without publishing them.
5. Manager confirmation that the lane may edit `scripts/` or test fixtures but
   still may not edit routed docs or generated output.

Minimum inputs before a hard-gated Docs implementation lane:

1. Manager-selected SDK and Examples source checkpoints.
2. Approved-public selection/profile metadata and source wording that is safe
   to publish, or explicit Docs scrub authorization.
3. Passed evidence for each row intended to render publicly.
4. Public/private classification for provider/capability and changelog rows.
5. Separate Operator deploy/publication gate if publication is in scope.

## Reusable Cross-Surface Implications

Website, Examples, Celerat/Plugins, and release-note lanes may reuse W203 only
as private sync/check vocabulary:

- approved-public selection is a required input, not publication authority;
- raw manifests are legacy/local only for current public sync;
- selected-source hashes and approved content hashes must match;
- companion docs must be parented by approved docs-channel examples;
- `extension_authoring` must remain separate from production-ready;
- source names, refs, warning keys, and output names must not carry W198
  authority fragments;
- generated output remains denied unless its surface has a separate hard gate.

No downstream receiver prompt, repo edit, public export, release note, catalog,
plugin, Website, Celerat, SDK, Examples, Peeler, package, provider-registry, or
deploy action follows from W203.

## W203 Outcome

W203 creates a private sync-source and transform-output dry-run matrix. It
identifies a validation-helper lane as the safer next Docs step before any
hard-gated implementation/publication lane. It does not change routed docs,
sync scripts, generated output, release notes, provider/package/API/support
wording, or deployment state.
