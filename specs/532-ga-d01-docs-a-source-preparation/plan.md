# GA-D01 Docs A preparation plan and source map

> Execution is held by the Operator's source/dependency-only assignment.
> Future implementation must read this packet and the then-accepted owner inputs.

**Goal:** Prepare a precise map for a later unpublished v2.0.0 Docs A preview.
**Architecture:** SDK owns product truth; Docs projects accepted source into
Starlight and owns version routing and build checks. Current v1 is archived
before replacement. **Tech stack:** Astro/Starlight, Node scripts, Markdown.
**Spec:** [spec.md](spec.md).

## Current-route inventory

All paths below are relative to `src/content/docs/nxuskit/` at base `504a169`.
Line numbers describe that immutable baseline, not a remote site inspection.

| Source / lines | Current content requiring future v2 reconciliation |
| --- | --- |
| `getting-started/installation.md:21-27` | v1.0.5 release and 17-asset CE/Pro availability claims |
| same, 33-38 | `gh release download sdk-v1.0.5`; macOS OSS archive/checksum/extract |
| same, 49-54 | v1.0.5 Linux OSS download/checksum/extract |
| same, 60-65 | v1.0.5 Windows OSS download and Expand-Archive |
| same, 84 | v1.0.5 SDK directory export |
| same, 95-97 | v1.0.5 macOS Pro download/checksum patterns |
| same, 108, 112, 236-242 | `python -m pip install "nxuskit-py==1.0.5"`, release linkage, native bundle path |
| same, 193, 201 | Rust path dependency and SDK path fixed to v1.0.5 |
| `getting-started/first-call.md:108` | Python install fixed to 1.0.5; also audit Go module download at 65 and CLI/Rust/C examples against final candidate |
| `examples/patterns/solver/index.md:93` | Python install fixed to 1.0.5 |
| `examples/patterns/bayesian-inference/index.md:95` | Python install fixed to 1.0.5 |
| `concepts/tier-system.md:61` | Python install fixed to 1.0.5 |
| `concepts/licensing.md:276-289,362` | token ceiling 1.0 accepts patches, rejects 1.1+, regenerate on major.minor, VersionCeilingExceeded recovery |
| `concepts/tier-system.md:85` | Pro/Enterprise runtime ceiling described as locked to major.minor |
| `migration/upgrade-path.md:78-89,205` | lower-ceiling error, update token or pin SDK, old recovery decision tree |
| `reference/api-reference.md:17` | version-string example 1.0.5 (not an install command) |
| `reference/changelog.md:17-38,130` | v1.0.5 release history and current selector source; preserve as history rather than mass replacement |

`scripts/sync-local-docs.mjs:52,112` still emits v1.x Installation/Changelog
metadata. Landing text, tier availability, activation/EULA/status/refresh/seats,
assisted token request, support lapse/rotation/v1 transition and pricing links
need a future claim audit even where no literal 1.0.5 appears.

## Authoritative source and durable first-call mapping

`NXUSKIT_REPO` must point to the accepted final SDK checkout; the script does
not itself establish that checkout's accepted commit. It prefers `docs/user/`
and replaces current SDK content (preserving examples) if that tree exists.
Otherwise it copies mapped `sdk-packaging/docs/` content into the existing tree;
unmapped stale pages can therefore survive. SDK root `CHANGELOG.md` separately
becomes `reference/changelog.md` in either mode.

Observed SDK root HEAD is `732b99599eb3b94ffdb58ca004f6041c36084ed5`;
`docs/user` is absent and the following packaging files exist. This observation
does not select or accept that revision as the final candidate.

| SDK source under `sdk-packaging/docs/` | Docs output |
| --- | --- |
| `getting-started.md` | `getting-started/installation.md` |
| `auth-modes-by-provider.md` | `getting-started/authentication.md` |
| `license-activation-guide.md` | `concepts/licensing.md` |
| `tier-comparison.md` | `concepts/tier-system.md` |
| `upgrade-path.md` | `migration/upgrade-path.md` |
| `api-reference.md` | `reference/api-reference.md` |
| `cli-input-reference.md` | `reference/cli-reference.md` |

There is no first-call entry in `SDK_PACKAGING_DOCS_MAP`. Proposed durable
contract for GA-S04 agreement: SDK adds `sdk-packaging/docs/first-call.md` with
tested CE/Pro steps; Docs adds its mapping to `getting-started/first-call.md`,
metadata and link mapping. If the final SDK uses `docs/user`, it must carry
`docs/user/getting-started/first-call.md`. Verify a second sync preserves the
accepted first-call bytes. These are proposed source paths, not existing files.
An explicitly accepted Docs-owned page is an alternative only if its ownership,
tested source and survival in both export modes are documented before editing.

Examples pages are a separate source lane: `NXUSKIT_EXAMPLES_REPO`,
`conformance/docs_export_manifest.json` and
`conformance/examples_publication_selection.json` gate approved Docs selection.
SDK-only sync preserves Examples. The two stale Python examples must therefore
be handled explicitly in the future scope: accepted upstream export or a
documented bounded projection correction. This does not turn standalone Examples
refresh into a new GA dependency.

## Required accepted inputs

| Owner | Exact handoff needed before dependent Docs implementation |
| --- | --- |
| GA-S04 | Repository-qualified final SDK full commit/version and clean source location; authoritative Docs A file list/export mode and first-call contract; exact CE/Pro package names, hashes and approved download/install channels; copied-command results on installed candidate for CE no-license success, Pro activation/status/real operation and denial/recovery; release notes and affected requalification identity |
| GA-L01 | Accepted versioned purchase-ID developer activation API and source commit; authentication/subject ownership, EULA, status/refresh/deactivate/idempotency/seat semantics; typed wrong-owner/unpaid/cancelled/suspended/outage denials and tested safe recovery examples. No live token or credentials in handoff |
| GA-W02 | Accepted Website source commit and tested Dev journey for authenticated `/my/products`, owned exact Pro package and activation handoff for Annual and Perpetual; CE discoverability; processing/failure/wrong-account/stale-entitlement behavior; confirmation/email recovery and approved public link targets |
| G0 / GA-M00 | Approved catalog/offer revision: eligible markets, package access/channel, advertised capability set, developer versus deployment-token copy, Annual renewal/grace and Perpetual update/support rights versus v2 major-line runtime validity, beta-to-GA treatment, EULA/price/tax/support links and removal/disposition of expired founding offers |

Assisted-token prose must also cite the accepted GA-L03/GA-W03 secure support
procedure when supplied through S04/G0; do not invent an issuance endpoint,
promise online revocation of offline tokens, or expose raw-token delivery data.
The missing final SDK/source, tested activation/portal instructions and remaining
G0 copy are the precise release-source blockers for this assignment.

## Held future validation sequence

1. Pin accepted Docs integration base and SDK candidate; compare retained W538
   script fixes against final source without importing dirty worktree state.
2. Preserve the selected current v1.0.5 tree as `src/content/docs/v1.0.5/` with
   `src/content/versions/v1.0.5.json`. Archive helper copies index/github/nxuskit,
   rewrites archive routes, and refuses overwrite by default. Inspect any existing
   archive provenance before reuse; keep historical claims labeled as history.
3. Bind `NXUSKIT_REPO` and run `npm run sync:docs:sdk` only after authorization
   and accepted inputs. Default `npm run sync:docs` selects Examples, not SDK.
   Inspect first-call and all inventory rows; check sync repeatability.
4. Run `node scripts/check-docs-version.mjs --explain`, source public-leak check,
   `npm run astro -- check`, and `npm run build`. Build performs version/source
   leak checks, Astro, hosted AI index generation and rendered version check.
5. Inspect strict source and generated HTML/AI-index leaks, private paths/IDs,
   unfinished text and unsupported availability. Canonical source's existing
   leak checker is a finite denylist and does not prove all these conditions;
   W538 has later sanitizer/built-scan work to evaluate, not assume present.
6. Run applicable W526/W531 validators both source and `--dist`; separately
   verify no current-route v1 install/major.minor runtime claim, navigation and
   archive links. Cross-version indexes legitimately retain labeled v1 history.
7. Fresh CE/Pro installed-package walkthrough uses exact accepted packages and
   tested L01/W02 flow. Report unpublished preview and full source identities
   for owning review. Only Manager can accept G5; publication remains separate.

## Preparation analysis

Coverage includes every literal v1.0.5 command family and old ceiling location
found in the current tree, source precedence and persistent first-call gap,
archive ownership, validation gaps and four external handoffs. No test/build or
preview result is claimed. No product page or sync script is changed by this
preparation; G5 remains OPEN.
