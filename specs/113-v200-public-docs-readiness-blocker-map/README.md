# W113 Docs v2.0.0 Public-Docs Readiness And Blocker Map

Status: internal docs planning packet only. This is not public documentation,
not a public v2.0.0 capability claim, not a docs deploy, not a release artifact,
and not an SDK, Examples, Celerat, Website, product catalog, Odoo, or public
mirror/export change.

Run: `NXUSKIT-V2-MEGA-20260605`

Wave: W113-Docs, v2.0.0 public-docs readiness and blocker map.

Prepared: 2026-06-23

## Scope

This packet maps what future public docs can and cannot say about v2.0.0 after
the latest internal SDK and Examples readiness lanes. It is intentionally
non-routed under `specs/` and does not alter `src/content/docs/**`, Starlight
navigation, generated docs exports, AI indexes, release metadata, or deployment
state.

## Inputs Consumed

| Input | Evidence consumed | Docs impact |
| --- | --- | --- |
| Docs W112 | `READY_DOCS_W112_GIT_WORKSPACE_HYGIENE`; tracked tree clean on `main` at `3712f41aeb3038bf023e6367dedc5c2f2869b0d3`; `node_modules/` removed; `.vexp/`, `session-handoff.md`, and `dist/` preserved. | W113 starts from a clean tracked docs base with local artifacts preserved. |
| SDK W109 | `READY_SDK_W109_RELEASE_READINESS_CHANGELOG_GATE`; checkpoint `14969a1`; report `specs/115-v2-expanded-spec-restart/reports/w109-release-readiness-changelog-gate.md`. | Public v2.0.0 docs remain blocked by release/changelog hygiene, version-label alignment, public mirror/export consistency, and claim inventory review. |
| SDK W110 | `READY_SDK_W110_PROLOG_SPECULATIVE_PREP`; branch `codex/w110-prolog-scryer-speculative-prep-20260622`; checkpoint `eefa87d3d79ddbb47248d859425d6488b79db046`. | Prolog/Scryer remains private/speculative. It is not public docs input and must not become a routed docs claim. |
| Examples W111A | `READY_EXAMPLES_W111A_V200_CANDIDATE_RESUME_MATRIX`; checkpoint `893e6f7cb0a1a4e40490477199d872c4fca3847d`. | `hello-provider`, `cedar-local-policy`, Regorus/OPA/Rego, Prolog/Scryer, and projection/tool examples remain candidate-held or internal-held. |
| Examples W111B | `READY_EXAMPLES_W111B_PROLOG_SCRYER_PRIVATE_PREFLIGHT`; checkpoint `764689d27479da20d81f5d961b3e4aaf3eef566e`. | Future Prolog/Scryer Examples work is private preflight only; no manifest, approved-public selection, docs export, Celerat, Website, or release-facing metadata is authorized. |
| Docs W106C | `READY_DOCS_W106C_REGORUS_OPA_GATE_ADVISORY`. | Docs sync already blocks Regorus/OPA/Rego exposure unless approved-public selection explicitly includes a docs-channel example. |
| Docs W108C | `READY_DOCS_W108C_HELLO_CEDAR_GATE_ADVISORY`. | Docs sync already blocks `hello-provider` and `cedar-local-policy` exposure while they remain candidate-held. |
| Current docs sync gate | `scripts/sync-local-docs.mjs` requires `conformance/examples_publication_selection.json`, validates `selection_type`, `public_channels`, `downstream_consumers`, approved content hashes, and generated docs routes; raw manifest use requires `NXUSKIT_DOCS_ALLOW_LEGACY_RAW_EXAMPLES_MANIFEST=1`. | Current/public Examples docs sync is fail-closed by default and should remain the docs-side source-of-truth boundary. |
| Current routed docs scan | `src/content/docs/**` has no routed hits for Regorus, OPA/Rego, Cedar, Prolog/Scryer, `hello-provider`, UTCP, `ProviderChannel`, or `ToolCatalog`. | No public docs cleanup is required before a future explicit v2.0.0 docs lane. |

## Readiness Matrix

| Area | Current evidence | Public docs may say now | Public docs must not say yet | Blockers before public docs can change | Next docs action |
| --- | --- | --- | --- | --- | --- |
| Release and changelog hygiene | SDK W109 identifies public changelog `[Unreleased]` top-heading and release-state alignment as blockers. | Current public docs remain v1.x-oriented. Any internal planning may say v2.0.0 release/changelog hygiene is not complete. | Do not say v2.0.0 is released, current, latest, installable, generally available, or public-ready. Do not publish v2.0.0 release notes from internal staging headings. | Public SDK changelog top entry normalized, public mirror/export verified, package metadata aligned, release notes/tags/assets consistent, docs version selector source updated through the approved release process. | Wait for SDK release-process/public-mirror hygiene closure before preparing public v2.0.0 docs diffs. |
| Cedar | SDK W69/W70 produced optional internal Cedar validation evidence; Examples W107C/W111A keeps `cedar-local-policy` release-targeted, unpublished, and excluded from approved-public selection. | Internal docs planning may track Cedar as a candidate release-targeted policy example. | Do not claim public Cedar support, a shipped Cedar provider, routed Cedar tutorials, public SDK inclusion, or public recommendation metadata. | SDK public Cedar posture, tier/disclosure review, per-example approved-public selection with `docs` channel, release-copy approval, and downstream public-consumption approval. | If approved later, consume only the filtered Examples export or approved-public selection, not raw manifests. |
| Regorus / OPA / Rego | SDK W104/W106A/W107B and Examples W105E/W111A keep this lane private/internal-held; Docs W106C found no public docs change needed. | Internal planning may say Regorus/OPA/Rego remains held and docs-gated. | Do not claim public Regorus, OPA, or Rego provider support, public runtime/package inclusion, public tutorials, or shipped policy-as-code examples. | Explicit SDK provider exposure decision, public wrapper/API posture, bounded builtin/support wording, per-example approved-public selection, Docs/Celerat/Website public gate, and release-copy approval. | No docs code/content action now. Keep relying on approved-public selection and public-leak scans. |
| Prolog / Scryer | SDK W110 proves only a private branch-local `provider-prolog` adapter against Scryer PR `#3394`; Examples W111B is private preflight only. PR state at W110 was open, mergeable, not draft, with `CHANGES_REQUESTED`. | Internal planning may reference a private speculative/preflight posture. | Do not claim Prolog/Scryer support, a public dependency decision, SDK default/full feature inclusion, public Examples, routed docs pages, public tier posture, or release readiness. | Upstream PR merge plus SDK post-merge refresh, or explicit Manager local-variant/fork decision; SDK stable status contract; licensing/tier review; private Examples implementation approval; later approved-public selection if public. | Keep Prolog out of public docs until SDK and Examples produce an explicit public-safe artifact chain. |
| `hello-provider` community candidate | SDK W97 defines internal community-extension contract foundation; Examples W107A/W111A keeps `hello-provider` release-targeted, unpublished, and excluded from approved-public selection. | Internal planning may say a safe-base candidate exists. | Do not publish `hello-provider`, do not imply broad community provider intake is open, and do not expose provider templates as current public support. | Release/changelog hygiene, public contribution/posture decision, revalidation, approved-public selection with `docs` channel, and downstream public-copy approval. | Later docs lane should consume the approved selection/export only after Manager approval. |
| UTCP / projection / tool surfaces | SDK W109 and Examples W111A keep UTCP, MCP, OpenAPI, CLI JSON, Pydantic, Zod, and tool-landscape surfaces as generated projection or validation evidence, not public runtime authorities. | Existing v1.x docs may continue to describe current CLI/API surfaces already published. Internal planning may track projection blockers. | Do not claim public v2.0.0 UTCP support, public tool runtime topology, `ProviderChannel`, `ToolCatalog`, private adapter internals, generated projection evidence as runtime support, or Node/TypeScript SDK support. | Stable public SDK surface names, generated artifact stability, public-safe schemas, docs-source handoff, examples approved-public selection if examples are involved, and claim inventory review. | Future docs dry-run should scan for internal topology terms before any public content diff. |
| Existing CLIPS / BN / Solver / ZEN / local-provider coverage | Current routed docs already cover CLIPS, BN, Pro-gated Solver/ZEN, and local providers in v1.x docs. Common Sense Guardrails remains the approved public/commercial proof path with BN only where modeled. | Public docs may keep current v1.x wording tied to shipped v1.x SDK facts and precise CE/Pro disclosures. | Do not turn current v1.x coverage into new v2.0.0 availability claims. Do not broaden Solver/ZEN beyond Pro-disclosed usage. Do not imply BN applies to scenarios where it is not modeled. | v2.0.0 public source truth, examples selection/versioned content hash, licensing/tier approval, and normal docs sync validation. | Preserve current pages until a v2.0.0 public docs sync lane is opened. |

## Docs Source-Of-Truth Rules For Future v2.0.0 Work

- SDK docs content should come from the approved SDK source truth after the
  release/changelog hygiene gate closes. Do not hand-write public v2.0.0 SDK
  support claims in `src/content/docs/nxuskit/**` from internal planning notes.
- Examples pages should come from `conformance/examples_publication_selection.json`
  and the filtered docs export. Do not use `examples_manifest.json` for current
  public sync unless the explicit legacy/local override is used for local
  diagnosis only.
- Celerat, Website, product catalog, Odoo, and public mirror/export are separate
  downstream consumers. This docs lane does not authorize them.
- If an example is candidate-held or internal-held, docs must either continue
  serving the prior approved public variant or fail closed. Current unapproved
  source must not silently replace public output.
- Public docs must not include private overlays, Medical Coding Auditor content,
  PHI-sensitive workflows, private Peeler persona/workflow packs, protected
  Pro/Enterprise internals, local absolute paths, unpublished assets, inline
  data-plane payloads, record batches, blobs, SQL bodies, `ProviderChannel`, or
  `ToolCatalog` as public product topology.

## Blockers

| Blocker | Blocks | Closure evidence needed |
| --- | --- | --- |
| SDK W109 release/changelog hygiene remains open | Any public v2.0.0 docs latest/current posture, release notes, install pages, or version selector change. | Public changelog top heading/version/date, public mirror/export, release tags/assets, package metadata, docs version label, and release ledger agree. |
| Candidate Examples are excluded from approved-public selection | Cedar, `hello-provider`, Regorus/OPA/Rego, Prolog/Scryer, projection/tool examples. | Approved-public selection records with `publication_status: approved`, `docs` in `public_channels`, matching content hashes, and filtered docs export. |
| Prolog/Scryer dependency posture is private/speculative | Prolog docs, examples, release notes, public claims, Celerat/Website surfaces. | Upstream merge plus SDK refresh, or explicit local-variant/fork approval, then separate private/public Examples and docs gates. |
| Public capability/tier wording is unresolved for new v2 providers | Cedar, Regorus/OPA/Rego, Prolog/Scryer, rust-rule-engine, projection/tool surfaces. | SDK surface owner and Manager approve CE/Pro/public wording, runtime/package inclusion, and supported-platform evidence. |
| Full docs build dependencies were intentionally removed by W112 hygiene | Any future route/content/site-code change requiring Astro diagnostics/build. | Run `npm ci` in the docs repo, then run normal docs validation before public merge/deploy. |

## Future Validation Plan

For a later public v2.0.0 docs implementation lane, run at minimum:

1. `npm ci` if `node_modules/` is absent.
2. `npm run sync:docs:sdk` from the approved SDK source truth, if SDK docs are
   in scope.
3. `npm run sync:docs:examples` from the approved Examples selection/export, if
   examples are in scope.
4. `npm run check:docs-version -- --explain`.
5. `npm run check:public-leaks`.
6. `npm run astro check`.
7. `npm run build`.
8. Targeted scans on current docs surfaces for forbidden or held terms:
   Regorus, OPA, Rego, Cedar, Prolog, Scryer, `hello-provider`,
   `ProviderChannel`, `ToolCatalog`, public v2.0.0 availability claims,
   JavaScript/TypeScript/Node SDK support claims, and broad Enterprise claims.
9. Route checks confirming candidate-held examples do not become routable or
   search-indexed pages.

## Options And Recommendation

| Option | Description | Recommendation |
| --- | --- | --- |
| A | Keep public docs unchanged and use this packet as the current W113 blocker map. | Recommended now. The routed docs tree already avoids the held v2.0.0 terms and the sync gate is fail-closed. |
| B | Open a docs-only v2.0.0 public-content draft branch before SDK/Examples gates close. | Not recommended. It would invite unsupported public claims and duplicate source-of-truth work. |
| C | After SDK release/changelog hygiene closes, run a docs sync dry-run against approved SDK and Examples artifacts without deploy. | Recommended next docs lane once upstream gates exist. |
| D | Add hard-coded deny-lists for candidate example ids in docs sync. | Not recommended unless the approved-public selection gate regresses. Current selection validation is more durable than deny-lists. |

Recommended next docs lane:

> W114-Docs v2.0.0 source-of-truth sync dry-run and public-claim QA. Start only
> after SDK release/changelog hygiene closes and Examples publishes the approved
> public selection/export for any examples that may be public. Scope: sync/diff
> prep, public-boundary scans, version-selector checks, and build validation; no
> deploy unless a separate Manager/Operator deployment gate is present.

## W113 Outcome

W113 should remain an internal readiness packet. No public docs publication,
public content claim, website/Celerat prompt, SDK/Examples mutation,
release/tag/package work, public mirror/export, or provider exposure should be
derived from this packet.
