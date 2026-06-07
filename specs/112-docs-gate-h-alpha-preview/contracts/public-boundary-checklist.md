# Public Boundary Checklist

Use this checklist before any future Gate N/O docs implementation moves content
from this package into routed public docs.

## Required Public-Safe Checks

- [ ] The page does not claim current JavaScript, TypeScript, or Node SDK
      support.
- [ ] TypeScript/Zod is described only as an alpha projection validation
      artifact unless a later gate explicitly changes support status.
- [ ] Gate G protected Solver/ZEN proof is not described as available.
- [ ] No generated validators, fixture corpora, dependency caches, build
      outputs, or unpublished assets are copied into docs.
- [ ] No local absolute paths appear in page prose or examples.
- [ ] No inline data-plane payloads, record batches, blob bodies, or SQL bodies
      are included.
- [ ] No private Peeler persona content, private workflow-pack content, or
      private downstream topology is included.
- [ ] No protected Pro or Enterprise internals are described as public product
      topology.
- [ ] Licensing language uses only approved public tier/status vocabulary.
- [ ] Website, catalog, storefront, and deployment references remain
      approval-gated.
- [ ] Hosted AI indexes are generated only through `npm run build`.
- [ ] Gate N and Gate O sign-off is recorded before public publication.

## Preferred Public Wording

- Use "Gate H alpha projection validation" for the current artifact posture.
- Use "future docs implementation" for routed docs plans.
- Use "validation artifact" for Pydantic and Zod outputs.
- Use "C ABI" when referring to C integration until first-class C support is
  separately approved.

## Avoid

- Product-final phrases for alpha artifacts.
- Claims that preview artifacts are stable public API.
- Claims that non-current SDK language surfaces are available.
- Details about private implementation topology or commercial backends.
