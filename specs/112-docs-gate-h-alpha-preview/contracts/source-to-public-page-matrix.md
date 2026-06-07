# Source To Future Public Page Matrix

These are preview-only target mappings. Do not implement routed pages until Gate
N and Gate O are unlocked.

| Future page area | Candidate route after Gate N/O | Source inputs | Required gate before publishing | Public-safe notes |
| --- | --- | --- | --- | --- |
| v1 freeze and v2 alpha positioning | `nxuskit/migration/v2-alpha-positioning` | DevOps decision memo, SDK Gate H status | Gate N and Gate O | Say v1.0.x remains the stable baseline only after naming is approved. |
| Contract v2 CLI schema commands | `nxuskit/reference/contract-v2-cli` | SDK Gate E and Gate H CLI/projection notes | Gate N and Gate O | Document command shape after final CLI naming; use probe-first language. |
| Contract fixtures and conformance | `nxuskit/reference/contract-fixtures` | SDK fixture corpus and conformance harness commits | Gate H finalization plus Gate O | Describe fixture classes, not raw payload bodies. |
| Projection validation | `nxuskit/reference/projection-validation` | SDK Pydantic and Zod alpha projection artifacts | Gate H finalization plus Gate O | Present as validation artifacts; do not claim TypeScript SDK support. |
| Peeler migration notes | `nxuskit/migration/peeler-contract-bridge` | Peeler Gate H conformance refinement | Peeler contract lock plus Gate O | Keep product-specific private workflows out of public docs. |
| Licensing runtime and tier disclosure | `nxuskit/concepts/licensing-runtime` or existing licensing/tier pages | Licensing runtime local slice | Gate G if protected proof is discussed; Gate N/O for public wording | Explain tier/status vocabulary only after public terms are approved. |
| Celerat recipe and agent-plugin guidance | `codex-plugins/nxuskit/gate-h-alpha-recipes` | Celerat Gate H alpha preview package | Gate N/O plus Celerat public-safe package sign-off | Keep recipes probe-first and validation-only until launch approval. |
| Public/private boundary checklist | `nxuskit/reference/public-boundary` | Gate O scan criteria and docs policy | Gate O | Include checklist only after scan rules are final. |

## Non-Routed Holding Area

Until Gate N/O, this `specs/112-docs-gate-h-alpha-preview/` package is the only
docs-lane artifact for these mappings.
