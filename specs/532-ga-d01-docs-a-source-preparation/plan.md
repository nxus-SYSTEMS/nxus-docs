# GA-D01 Docs A preparation plan and source map

> GA-first refocus authorized 2026-10-01. Independently ready local correctness
> work may proceed; final GA export and walkthrough await accepted owner inputs.
> Preserve preview revision `0e4e697` and v1.0.5 current/default content.

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
The missing final SDK/source and tested activation/portal instructions are the
remaining release-source blockers. G0 was accepted on 2026-09-28; use the frozen
copy contract rather than requesting a new decision.

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

## GA-first reconciliation — 2026-10-01

This section supersedes historical preparation-only holds above. The tested
preview revision is `0e4e697220e08114cb48ad28fea6311d5c900545`; it is retained
as preparation, with separate preview deployment/publication deferred.

| Reusable improvement | GA use and limit |
| --- | --- |
| Exact Git SHA + source SHA-256 export binding | Reuse input binding/fail-closed pattern for the final S04 export; preview exporter is not the GA sync path |
| Preview banner, self-canonical/noindex, Pagefind/sitemap/LLM exclusions | Reuse for unpublished isolated draft inspection; final current GA routes need normal discovery after separately authorized cutover |
| Current-tree/version invariance regression | Preserve v1.0.5 until authorized final integration; replace the fixed preview baseline assertion only in the future version-switch slice |
| Candidate versus later annotation distinction | Reuse package/source provenance reporting; never relabel preview archive as final GA package |
| Secret-free licensing recovery wording | Reuse only semantics confirmed by GA-L01; no-fee cohort entitlement and explicit cohort GA access do not describe paid GA conversion |
| Solver-only claim boundary | Apply accepted G0 to S04 source, metadata, current-route landing/tier/reference content |

### Remaining repository-qualified handoffs

- **SDK / GA-S04:** final full SDK commit, authoritative Docs A tree/export mode,
  durable first-call source, version/changelog and approved public package links;
  exact CE and Pro artifacts/hashes plus affected qualification receipts. Copied
  install/first-call commands must succeed against those packages, including CE
  no-license operation and denial plus Pro real Solver operation. Preview SDK
  annotation `53be7866533b84bd3420490614f21a4f59904f12` and archive source
  `5e142106f47281f413f2417f8d7461086de3e4dc` are not final GA identities. The
  Linux-only preview proof cannot replace the final GA qualification matrix.
- **Licensing / GA-L01:** final versioned developer contract/source and tested
  purchaser-bound login, purchase-ID activation/EULA, status, sync/refresh,
  expiry, seats/deactivation and safe failure/recovery. Need SDK-valid token
  behavior against the installed final package, not fixtures or a health check.
  `85620733f52cba77e93aca8402e4aad63179a501` is internal-cohort preparation,
  not real activation proof. Assisted-token support text additionally needs
  GA-L03/GA-W03 approved secure request/delivery/replacement/rotation procedure.
- **Website / GA-W02:** final source and exercised Annual/Perpetual Dev
  purchase-to-owned `/my/products` activation handoff, exact public Pro package
  links, CE discovery, processing/failure/wrong-account/stale states and safe
  confirmation/email recovery. Public package visibility and protected
  purchaser/activation information must be distinguished under accepted G0.
- **G0:** decision accepted; consume its frozen contract: Solver-only initial
  Pro claims, public Pro package pages after release authority, self-service
  developer activation, secure operator-assisted durable tokens, v2 major-line
  runtime validity distinct from commercial maintenance/support rights, and no
  general automatic beta conversion. Final approved link targets and owner
  source wording still belong in S04/W02 handoffs.

### Ready local slice and next dependency

The independently ready slice here is correction of the stale dependency/hold
map and task ledger; no demonstrated product defect requires a source rewrite.
First-call mapping and version-aware metadata are the next bounded code slice
once SDK supplies the durable source path/version contract. Adding a mapping to
an absent or unaccepted page would not resolve the current gap. Then test a
second export for byte preservation and link rewriting before final archive/
sync. No current-version switch, ordinary sync, new activation claim or extra
package walkthrough is appropriate before those inputs.

Final G5 exit still requires the versioned unpublished GA draft and fresh CE/Pro
walkthrough using exact final packages and real tested L01/W02 contracts. Preview
success does not accept G5; publication/deployment and gate acceptance remain
separate.

## Source/export contract delta — 2026-10-01

Read SDK ledger `a5bb90e5d541f7e197b06bbe9fffa20ab804712d`, Spec108 evidence
section “Shipped CLI and embedded verifier contract”, at
`/Users/ken/.codex/worktrees/preview-publication-isolation/nxusKit-internal`.
Recommended source remains `53be7866533b84bd3420490614f21a4f59904f12` (unmerged
PR78), exact GA five-cell proof remains `cb7c55b35696fe31900a79fc4ddd2b049ea222d0`,
and preview archive remains `5e142106`; none is relabeled as final GA authority.

Docs tooling now maps `sdk-packaging/docs/first-call.md` to
`getting-started/first-call.md`, rewrites its Markdown links, and derives the
three affected metadata descriptions from the released SDK changelog heading.
The source page is absent at recommended source, so this prepares export without
claiming a completed CE first-call. Other authoritative docs/user exports still
must include their own first-call page. Three pure contract tests, sync-script
syntax, site build and retained preview/current invariance passed; actual sync
repeatability awaits supplied source. Current source pages were untouched.

### Exact SDK source patch requirements

1. Supply `sdk-packaging/docs/first-call.md` (or authoritative
   `docs/user/getting-started/first-call.md`) with copied CE no-license CLI and
   supported-language first-call commands from exact final artifacts. Include
   executable expected-result/denial checks and package-native library paths;
   no public latest wildcard or stale v1 package identity. Final catalog is
   unfrozen, so do not invent download links in this patch.
2. Reconcile getting-started, licensing, tier, upgrade, CLI/API and changelog
   source with the shipped contract: activation 2xx is acknowledgment, status
   exit 0 can describe absent/invalid tokens, inspect effective license state
   and guarded Solver operation, `license sync` is refresh (no refresh command),
   and licensing JSON/error handling is command-specific. Do not print token,
   account or token-path values in public/shared examples.
3. Describe immutable embedded release verifier keys accurately: strict-v2
   deployment tokens require exact kid, while legacy non-deployment missing/
   blank-kid tokens have the documented immutable-bundle fallback. No ambient
   signing-key injection claim for release builds. Live issuer/key compatibility
   and positive activation still require L01/final-package proof.
4. Hand off tested L01/W02 activation/portal instructions and exact GA package
   catalog, then run Docs export repeatability and fresh CE/Pro walkthrough.
   No fixture-only token or command acknowledgment substitutes for entitlement.

## Exact first-call export inspection — b6aa86d3

SDK source `b6aa86d3b55bd94850eb202b31f1e866693a0306` now supplies
`sdk-packaging/docs/first-call.md` and installation corrections. The isolated
check reads `git show` blobs, avoiding a concurrent SDK-owned modified
`tests/sdk_docs_first_call_test.py` in its worktree. It performs no SDK sync or
archive/default change and does not download or repackage artifacts.

`check-sdk-draft-export.mjs` verified repeated packaging export byte equality,
v2 metadata, installation/first-call/authentication/CLI route mapping and the
explicit credential-free loopback/echo response-envelope contract. Public
denylist scan was clean. Strict scan returned exit 1 for installation's two
illustrative `/Users/you/...` examples (source remains owner-controlled); these
are generic placeholders, not a secret/private user path. SDK should replace
them with platform-neutral `/absolute/path/to/...` wording at authoritative
`sdk-packaging/docs/getting-started.md` Rust dependency and SDK-dir examples.
The preserved projected failure is `tmp/ga-d01-draft-cFiXvC` (ignored draft).

Three metadata contract tests, site production build, preview/current
invariance and diff check passed. This site build covers unchanged current and
preview content, not the isolated full GA export as a new published route.
Exact export repeatability is source proof only, not fresh package or CE/Pro
runtime qualification. SDK's activation-guide/input-reference corrections,
final public source/package catalog, exercised L01/W02 contracts and full
walkthrough remain pending. G5 remains open.

Correction checkpoint: exact SDK source
`54c52f2733a285886dedfc2956152440ebd05056` (parent `b6aa86d3`) passed the same
isolated committed-blob export check on 2026-10-01, output
`tmp/ga-d01-draft-MmOr1G`. Repeated export bytes, first-call metadata/routes/
envelope, strict path/identity/placeholder scan and full-export public denylist
all pass (exit 0). The upstream generic path finding is resolved. SDK reports
an outstanding pre-existing unquoted `<purchase_id>` shell example outside its
corrected fences; whole-guide copied-command reliability remains owner work.
No new package qualification, live Pro walkthrough, current sync/default switch
or publication is inferred. This status-only checkpoint does not require
rebuilding unchanged site content; the prior site/isolation proof is retained.

Final independent source checkpoint: SDK
`8e91309aa0e5ed5994a2e7d00d88abcf3a1df7cb` (parent `54c52f27`) resolves the
activation-guide source-only audit, including quoted purchase-ID variables and
corrected status/key-resolution/expiry/deactivation/logout claims. Docs exact
committed-blob export at `tmp/ga-d01-draft-QK1NnV` passed repeat equality,
first-call mapping/metadata/links/envelope and strict/public leak checks; three
metadata-contract tests passed. Git diff confirms all current/PRE content,
version data and isolation configuration equal retained `0e4e697`; no redundant
site rebuild ran. SDK's reported seven focused checks and fourteen Bash-fence
syntax checks are source evidence, not live activation or new package proof.

The independent source/export slice is complete. Final GA package/public source
catalog and exact qualification binding, exercised L01 purchaser activation/
verifier/seat/expiry/recovery, exercised W02 Annual/Perpetual owned portal journey
and fresh final-package CE/Pro walkthrough remain genuine dependencies. No
whole-guide runtime or gate acceptance is inferred; G5 stays open. Current v1.0.5
and PRE route remain preserved; final archive/sync/default switch, credential
operations and publication/deployment remain outside this checkpoint.

## Consolidated plan checkpoint — 2026-10-03

Single GA plan at DevOps `87d11707` supersedes former packet/preview mandates.
Preparation is DONE; final exact-input integration is WAITING. Static mapping
inspection found only stale local CLI/licensing capability metadata; descriptions
were made neutral without modifying authoritative bodies. Focused projection
test covers this changed slice; retained Oct1 source/export/build/isolation
checks are reused, not rerun for activity.

Reactivate on changed/final S04 full source SHA/export mode and file set, exact
Linux x86_64/macOS ARM64/Windows x86_64 Pro package/catalog/verifier identities
and approved links, plus exercised L01/W02 purchaser commands/portal contract
and bound installed-Pro walkthrough target. SDK owns authoritative copy changes.
CE is public source-only with accurate source guidance; CE build success is
non-gating. macOS x86_64 is unsupported from v2, not on-demand. Final versioned
render remains independent of the separately authorized default switch; preserve
v1.0.5 and do not archive v2 as an older version. G5 remains open pending actual
final rendered source and installed-Pro journey, not preparation gate acceptance.
