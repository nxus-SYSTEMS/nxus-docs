# W205 Private Sync-Adjacent Validation Hardening

Status: private Docs validation-hardening artifact only. This is not routed
public docs content, not a sync script change, not package script
configuration, not generated public docs output, not publication or deploy, not
release notes, not public schemas, not provider-registry or package authority,
and not a downstream prompt.

Run: `NXUSKIT-V2-MEGA-20260605`

Wave: W205-Docs, private sync-adjacent validation hardening after W204.

Prepared: 2026-06-25

RC sequence: W205 is RC wave 29 of the current estimated 32-45 wave
feature-rich disciplined RC sequence.

## Source Posture Consumed

| Source | Evidence | W205 use |
| --- | --- | --- |
| Docs W204 | `READY_DOCS_W204_PRIVATE_CLAIM_BOUNDARY_VALIDATION_HELPER`; checkpoint `bb2c78541d2e5881ce374a614782dd0cacc4bf2d`. | Immediate source for reusable private text checks and the negated-private regression posture. |
| Docs W203 | `READY_DOCS_W203_PRIVATE_SYNC_DRY_RUN_CHECK`; checkpoint `65feab7be239368f2abbfe5cc52fc6c10efea178`. | Sync-source and transform classes to model: approved-public selection, raw-manifest override, docs export manifest, companion docs, example rendering, trust scrub, SDK packaging/changelog, warnings/callouts, and hosted AI indexes. |
| Docs W202 | `READY_DOCS_W202_PUBLICATION_GATED_COPY_DRY_RUN_CHECK`; checkpoint `013b0b016bb90315692dd96aab6022eed578249d`. | Candidate copy/output classes and denial text posture. |
| Docs W201 | `READY_DOCS_W201_CLAIM_BOUNDARY_WORDING_DRY_RUN_CHECK`; checkpoint `c1d010ab6cf58e3a0dad402397d236c8af270aaa`. | Claim-boundary wording map for public/private copy classes. |
| SDK W196 | `READY_SDK_W196_PROJECTION_CLAIM_BOUNDARY_POLICY_STATIC_GUARD`; checkpoint `0674a7c98fd7f69e522be160221472b56c0d6328`. | Non-`Passed` projection rows cannot create public-docs, release, package, provider-registry, wrapper/API, generated-artifact, or downstream authority. |
| SDK W198 | `READY_SDK_W198_CLAIM_BOUNDARY_FORBIDDEN_FRAGMENT_HARDENING`; checkpoint `e1ececff5b766161d19f74c16e6d42efc976ea68`. | Free-form text, refs, field paths, warning keys, draft output, transformed text, and generated labels must not turn forbidden fragments into authority. |
| SDK W199 | `READY_SDK_W199_DOWNSTREAM_RECEIVER_HANDOFF_CHECKLIST_PACKET`; checkpoint `c2e9c96d69d2e208e4d7d390133f3a45a8f9faa5`. | Receiver handoff remains private/advisory and does not send prompts, edit downstream repos, publish, package, release, or change support posture. |
| SDK W200 | `READY_SDK_W200_RC_PROCESS_READINESS_PACKET`; checkpoint `5f843263341b2064e2ce28d927563f10e90596b1`. | SDK v2.0.0 remains not RC-ready for public docs, public release, package publication, examples export, Website, Celerat, provider registry, wrappers, APIs, or release notes. |
| Docs W143 | `READY_DOCS_W143_HELLO_PROVIDER_DOCS_CONSUMPTION_PACKET`; checkpoint `3d396786693d791d36d2f98a8fb7a67254e898a7`. | `hello-provider` remains `extension_authoring` / SDK extension authorship, not production-ready, getting-started, onboarding, runtime-provider, registry, public API, or platform-expansion copy. |

## Current Sync Points Inspected

Read-only inspection of `scripts/sync-local-docs.mjs` identified these guard
points that W205 models privately:

| Sync-adjacent point | Current repo behavior | W205 fixture model |
| --- | --- | --- |
| Approved-public Examples selection | `readExamplesManifestMetadata()` requires `conformance/examples_publication_selection.json` for current/public Examples sync. Raw manifest use is only a named legacy/local env override. | `approved-public-selection-required` rejects raw-manifest default posture and validates selection type, docs channel, and docs export consumer. |
| Selection provenance and hashes | `readExamplesPublicationSelectionMetadata()` checks schema/source/ledger/generated metadata, approved count, docs-channel records, selected-source hash, and example content hash. | `selection-provenance-required` and `selection-hash-provenance` assert representative provenance and hash constraints. |
| Docs export manifest and companion docs | `readExamplesDocsExportManifest()` limits companion docs to immediate Markdown under approved examples and `validateGeneratedExampleDocs()` rejects pages outside the approved docs-channel set. | `companion-docs-approved-parent` rejects companion docs for unapproved/candidate examples. |
| Example index/detail rendering | `toExamplesStarlightPage()` and `toExampleDetailStarlightPage()` apply trust-wording scrub, source-link rewrite, and edition copy. | Text-block fixtures exercise safe index/detail language and deny unsafe authority via the W204 helper. |
| Trust wording scrub | `scrubExamplesTrustWording()` downgrades selected production-ready/production-quality/production-grade phrases to runnable or structured copy. | Positive transform fixture keeps runnable wording; negative fixtures prove `hello-provider` cannot collapse into production-ready/getting-started copy. |
| SDK packaging/changelog sync | `syncSdk()` consumes generated SDK docs and changelog version posture through the existing repo release/version checks. | W205 treats SDK sync text as a text surface subject to W198, non-`Passed`, private-surface, and bounded-status checks; it does not validate SDK release artifacts. |
| Warning/callout text | Sync warnings and future callout keys can carry free-form claim-boundary fragments. | Warning-key and generated-label fixtures are scanned with W204 fragment checks. |
| Hosted AI indexes | Hosted indexes are build artifacts and must reflect routed public docs only. | `hosted-ai-index-private-artifact` rejects index output that exposes private specs or dry-run packets. |

## Helper Shape

Files:

- `sync-adjacent-helper.mjs`: standalone private JSON fixture helper.
- `test-sync-adjacent-helper.mjs`: private fixture test harness.
- `fixtures/positive/*.json`: representative models that should pass.
- `fixtures/negative/*.json`: representative models that should fail with
  specific rule ids.

The helper imports the W204 private `validateText()` helper for claim-boundary
text checks. It is deliberately not referenced by `package.json`, CI, Astro,
`scripts/sync-local-docs.mjs`, routed docs, generated output, release notes, or
deployment workflows.

The fixture harness intentionally asserts several W204 rule ids so W205 fails
closed if the imported helper's rule names or semantics drift. A future lane
that promotes this helper beyond private specs should either preserve those
rule ids or update the W205 assertions in the same reviewed change.

## Executable Check Classes

| Rule id | Positive posture | Negative posture caught |
| --- | --- | --- |
| `approved-public-selection-required` | Current/public Examples sync uses `nxuskit-examples-approved-public-selection`, includes `docs` in public channels, and includes `docs_export` as downstream consumer. | Raw-manifest default posture, missing approved selection, wrong selection type, missing docs channel, or missing docs export consumer. |
| `selection-provenance-required` | Selection has schema version, source manifest, publication ledger, generator, approved release, and selected-source kind. | Missing provenance fields that make selection source-trace weak. |
| `selection-hash-provenance` | Approved count matches records, selected-source hashes match approved hashes, and selected current content hashes match approved content hashes. | Count drift, malformed hashes, hash mismatch, or approved docs-channel record missing from the selected examples array. |
| `hello-provider-profile-required` | `hello-provider` stays `public_readiness_profile=extension_authoring`. | Missing profile or production-ready/getting-started/onboarding profile collapse. |
| `companion-docs-approved-parent` | Companion docs belong to approved docs-channel examples. | Companion docs for candidate, held, excluded, or unapproved examples such as `cedar-local-policy`. |
| W204 text rules | Text blocks, refs, field paths, warning keys, generated-output labels, and hosted-index text stay bounded. | W198 fragment authority, non-`Passed` projection authority, private-surface public/runtime expansion, bounded-status overclaims, and the negated-private false-positive regression. |
| `hosted-ai-index-private-artifact` | Hosted AI index wording says private specs and dry-run packets must not be included. | Hosted AI index output that includes private specs, dry-run packets, or internal planning artifacts as content. |

## Fixture Coverage

Positive fixtures:

- `approved-selection-safe.json`: approved-public selection with docs channel,
  docs export consumer, matching content hashes, approved companion docs, and
  `hello-provider` as `extension_authoring`.
- `transform-output-safe.json`: safe transform text for trust wording scrub,
  SDK packaging/changelog sync posture, private-surface boundaries, W198 denial
  vocabulary, warning keys, generated labels, and hosted AI index boundaries.

Negative fixtures:

- `raw-manifest-default.json`: raw manifest becomes default current/public sync
  input instead of approved-public selection.
- `hello-provider-production-ready.json`: `hello-provider` collapses into
  production-ready/getting-started/onboarding copy and profile.
- `companion-doc-unapproved.json`: companion docs target
  `cedar-local-policy`, which remains candidate/excluded.
- `w198-output-authority.json`: W198 fragments appear as warning keys,
  generated labels, field paths, and transformed copy authority.
- `non-passed-projection-authority.json`: non-`Passed` projection rows become
  public/release/package/provider/wrapper/generated/downstream authority.
- `private-surface-public-runtime.json`: Cedar and projection-preview surfaces
  become public runtime/provider/package/API/support claims, including the W204
  negated-private regression class.
- `hosted-ai-index-private-spec.json`: hosted index output exposes private
  specs and dry-run packet content.

Run:

```bash
node specs/205-private-sync-adjacent-validation-hardening/test-sync-adjacent-helper.mjs
```

Optional direct positive check:

```bash
node specs/205-private-sync-adjacent-validation-hardening/sync-adjacent-helper.mjs \
  specs/205-private-sync-adjacent-validation-hardening/fixtures/positive/approved-selection-safe.json \
  specs/205-private-sync-adjacent-validation-hardening/fixtures/positive/transform-output-safe.json
```

Optional direct negative check:

```bash
node specs/205-private-sync-adjacent-validation-hardening/sync-adjacent-helper.mjs \
  specs/205-private-sync-adjacent-validation-hardening/fixtures/negative/w198-output-authority.json
```

## What W205 Still Does Not Prove

W205 does not prove that any source row is ready for public Docs. It does not
run `npm run sync:docs`, does not modify or test `scripts/sync-local-docs.mjs`,
does not inspect generated routes, does not build hosted AI indexes, does not
execute SDK/provider/runtime/projection behavior, and does not establish
package, provider-registry, release-note, public API, support, entitlement, or
deployment authority.

Before any hard-gated Docs implementation/publication lane, Manager must still
provide:

1. Exact SDK and Examples source checkpoints.
2. Approved-public selection/profile metadata and safe source wording, or
   explicit Docs scrub authorization.
3. Passed evidence for rows intended to render publicly.
4. Public/private classification for provider/capability, projection, and
   changelog rows.
5. Separate Operator deploy/publication approval if publication is in scope.

## Recommended Next Lane

The safest next lane is a hard-gated Docs implementation-prep slice only after
Manager supplies the source checkpoints and classifications above. If Manager
wants additional private hardening first, it should be a design-only or
explicitly authorized helper lane; integrating these checks into
`scripts/sync-local-docs.mjs`, package scripts, CI, generated docs, or routed
content requires a separate approval because W205 intentionally does not touch
shared sync or publication paths.

## Reusable Cross-Surface Implications

Website, Examples, Celerat/Plugins, and release-note lanes may reuse the W205
rule vocabulary as private QA guidance:

- Require approved-public docs-channel selection before public examples copy.
- Preserve profile-aware wording for `extension_authoring` examples.
- Treat W198 fragments as denied scan vocabulary unless a later hard gate
  supplies explicit authority.
- Keep non-`Passed`, private-only, internal-use-only, licensed-private,
  research, experimental, preview, unsupported, validation-pending, denied,
  stale, downgraded, and blocked-by-cap states bounded.
- Keep RRE, Prolog/Scryer, Cedar, CLIPS v2, Pydantic v2, TypeScript/Zod, and
  Node wrapper preview private/static/planning/source-truth-bound unless a
  later hard gate supplies publication authority.
