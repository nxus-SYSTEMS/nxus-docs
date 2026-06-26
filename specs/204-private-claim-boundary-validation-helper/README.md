# W204 Private Claim-Boundary Validation Helper

Status: private Docs validation-helper artifact only. This is not routed public
docs content, not a sync script change, not package script configuration, not
generated public docs output, not publication or deploy, not release notes, not
public schemas, not provider-registry or package authority, and not a
downstream prompt.

Run: `NXUSKIT-V2-MEGA-20260605`

Wave: W204-Docs, private claim-boundary validation helper after W203.

Prepared: 2026-06-25

RC sequence: W204 is RC wave 28 of the current estimated 32-45 wave
feature-rich disciplined RC sequence.

## Source Posture Consumed

| Source | Evidence | W204 use |
| --- | --- | --- |
| Docs W203 | `READY_DOCS_W203_PRIVATE_SYNC_DRY_RUN_CHECK`; checkpoint `65feab7be239368f2abbfe5cc52fc6c10efea178`. | Immediate source for turning private sync dry-run checklist classes into executable helper checks. |
| Docs W202 | `READY_DOCS_W202_PUBLICATION_GATED_COPY_DRY_RUN_CHECK`; checkpoint `013b0b016bb90315692dd96aab6022eed578249d`. | Copy/output class boundaries for examples, provider/capability wording, release-note wording, preview labels, warnings, and generated text. |
| Docs W201 | `READY_DOCS_W201_CLAIM_BOUNDARY_WORDING_DRY_RUN_CHECK`; checkpoint `c1d010ab6cf58e3a0dad402397d236c8af270aaa`. | Claim-boundary wording guard for private, internal, licensed-private, preview, unsupported, validation-pending, denied, stale, downgraded, blocked-by-cap, and non-`Passed` classes. |
| SDK W196 | `READY_SDK_W196_PROJECTION_CLAIM_BOUNDARY_POLICY_STATIC_GUARD`; checkpoint `0674a7c98fd7f69e522be160221472b56c0d6328`. | Non-`Passed` projection rows must not produce public docs, release, package, provider-registry, wrapper/API, generated-artifact, or downstream-emission authority. |
| SDK W198 | `READY_SDK_W198_CLAIM_BOUNDARY_FORBIDDEN_FRAGMENT_HARDENING`; checkpoint `e1ececff5b766161d19f74c16e6d42efc976ea68`. | Free-form text, refs, field paths, warning keys, draft output, and transformed text must not use W198 fragments as authority. |
| SDK W199 | `READY_SDK_W199_DOWNSTREAM_RECEIVER_HANDOFF_CHECKLIST_PACKET`; checkpoint `c2e9c96d69d2e208e4d7d390133f3a45a8f9faa5`. | Receiver-specific checks remain private/advisory and do not send prompts, edit downstream repos, publish, package, release, or change support posture. |
| SDK W200 | `READY_SDK_W200_RC_PROCESS_READINESS_PACKET`; checkpoint `5f843263341b2064e2ce28d927563f10e90596b1`. | SDK v2.0.0 remains not RC-ready for public docs, public release, package publication, examples export, Website, Celerat, provider registry, wrappers, APIs, or release notes. |
| Docs W143 | `READY_DOCS_W143_HELLO_PROVIDER_DOCS_CONSUMPTION_PACKET`; checkpoint `3d396786693d791d36d2f98a8fb7a67254e898a7`. | `hello-provider` remains `extension_authoring` / SDK extension authorship, not production-ready, getting-started, onboarding, runtime-provider, registry, or platform-expansion copy. |

## Helper Shape

Files:

- `claim-boundary-helper.mjs`: standalone private Node helper.
- `test-helper.mjs`: private fixture test harness.
- `fixtures/positive/*.md`: snippets that should pass.
- `fixtures/negative/*.md`: snippets that should fail with specific rule ids.

The helper is deliberately not referenced by `package.json`, CI, Astro,
`scripts/sync-local-docs.mjs`, routed docs, generated output, release notes, or
deployment workflows. It is an advisory W204 artifact that future lanes may
promote only after a separate Manager decision.

## Executable Check Classes

| Rule id | Positive posture | Negative posture caught |
| --- | --- | --- |
| `hello-provider-profile-boundary` | `hello-provider` may be `extension_authoring`, SDK extension authorship, deterministic local fixture, no-network/no-credential wording. | Production-ready, getting-started, onboarding/new-user, broad provider intake, engine discovery, provider registry, runtime provider, public API/wrapper, generalized mesh, real smoke, Windows, or macOS x86_64 wording. |
| `w198-forbidden-fragment-authority` | W198 fragments may appear only as quoted denied scan vocabulary or source-trace evidence. | `public-docs`, `docs-allowed`, `downstream-emission`, `provider-registry`, `package-publication`, `npm-ready`, `release-ready`, `public-ready`, `generated-artifact`, and snake/kebab variants used as authority. |
| `non-passed-projection-authority` | Non-`Passed` projection rows remain non-emitted and non-authoritative. | Non-Passed rows described as public-docs allowed, release-ready, package-ready, provider-registry-ready, wrapper/API-ready, generated-artifact-ready, or downstream-emission-authorized. |
| `private-surface-boundary` | RRE, Prolog/Scryer, Cedar, CLIPS v2 rows, Pydantic v2, TypeScript/Zod, and Node wrapper preview remain private/static/planning/source-truth-bound. | Public runtime/provider/package/API/registry/release/support expansion for those surfaces. |
| `bounded-status-class-overclaim` | Internal-only, licensed-private, research, experimental, preview, unsupported, validation-pending, denied, stale, downgraded, and blocked-by-cap stay private/gated/non-claim. | Public availability, CE availability, customer support, stable feature, supported feature, or release language attached to bounded status classes. |

## Fixture Coverage

Positive fixtures:

- `safe-extension-authoring.md`: allows `hello-provider` extension authorship
  and keeps RRE/Prolog/Scryer/Cedar/Pydantic/TypeScript/Zod/Node wrapper preview
  private/static.
- `safe-denial-vocabulary.md`: allows W198 fragments only as quoted denied scan
  vocabulary and keeps bounded status classes private.

Negative fixtures:

- `hello-provider-overclaim.md`: catches production-ready/getting-started/
  onboarding misuse.
- `forbidden-fragment-authority.md`: catches W198 fragment authority.
- `non-passed-projection-authority.md`: catches authority on Non-Passed
  projection rows.
- `private-surface-expansion.md`: catches public runtime/provider/API/package
  expansion for private surfaces.
- `private-surface-negated-boundary.md`: catches "not private" phrasing that
  would otherwise mask a public runtime/provider expansion.
- `status-class-overclaim.md`: catches bounded status classes turning into
  public availability/support/release copy.

Run:

```bash
node specs/204-private-claim-boundary-validation-helper/test-helper.mjs
```

Optional direct check over files expected to pass:

```bash
node specs/204-private-claim-boundary-validation-helper/claim-boundary-helper.mjs \
  specs/204-private-claim-boundary-validation-helper/fixtures/positive/safe-extension-authoring.md \
  specs/204-private-claim-boundary-validation-helper/fixtures/positive/safe-denial-vocabulary.md
```

## What This Helper Does Not Prove

This helper does not prove that any source row is ready for public Docs. It does
not parse the Examples selection schema, does not run docs sync, does not
inspect generated routes, does not validate hosted AI indexes, does not execute
SDK/provider/runtime/projection behavior, and does not establish package,
provider-registry, release-note, public API, support, entitlement, or deployment
authority.

Before any hard-gated Docs implementation/publication lane, Manager must still
provide:

1. Exact SDK and Examples source checkpoints.
2. Approved-public selection/profile metadata and source wording that is safe
   to publish, or explicit Docs scrub authorization.
3. Passed evidence for rows intended to render publicly.
4. Public/private classification for provider/capability and changelog rows.
5. Separate Operator deploy/publication approval if publication is in scope.

## Recommended Next Lane

The safest next Docs lane is additional private validation hardening only if
Manager wants executable checks closer to `scripts/sync-local-docs.mjs`. That
lane would need explicit approval to touch shared scripts or fixtures and must
still avoid routed docs, generated output, package scripts, CI, and deploy.

A hard-gated Docs implementation-prep lane is possible only after Manager
provides the source checkpoints and public/private classification inputs above.
Public implementation or publication remains closed.

## W204 Outcome

W204 creates a standalone advisory helper and representative fixture suite for
W201-W203 claim-boundary checks. It does not change routed docs, sync scripts,
package scripts, generated output, release notes, provider/package/API/support
wording, downstream repos, prompts, or deployment state.
