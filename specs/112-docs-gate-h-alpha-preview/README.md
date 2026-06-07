# Docs Gate H Alpha Preview Package

Status: internal preview package. Not routed documentation.

Run: `NXUSKIT-V2-MEGA-20260605`

Wave: W12/S14c Docs Gate H alpha preview package

This package prepares the docs implementation plan for consuming Gate H alpha
projection-conformance work after the remaining launch gates. It is intentionally
kept outside `src/content/docs/` so it does not publish public pages, change the
docs version selector, alter generated product docs, or affect hosted AI
indexes.

## Scope

- Record the upstream alpha checkpoints by branch and commit.
- Map source artifacts to future public docs pages after Gate N and Gate O.
- Outline preview-only docs work for v1 freeze and v2 alpha positioning,
  `contract-v2` CLI schema commands, fixture and conformance docs, projection
  validation docs, Peeler migration notes, licensing runtime and tier disclosure
  notes, Celerat recipe coordination, and public/private boundary checks.
- Preserve Gate G, Gate N, and Gate O locks.

## Non-Scope

- No edits under `src/content/docs/**`.
- No edits to `astro.config.mjs`, changelog/version state, root `llms.txt`,
  `dist/`, `.astro/`, `node_modules/`, generated sync output, or website copy.
- No vendored generated validators, fixture corpora, dependency caches, build
  output, local install paths, or data-plane payload examples.
- No current JavaScript, TypeScript, or Node SDK support claims.

## Package Files

- `spec.md` - requirements and gate posture.
- `plan.md` - future docs implementation and validation plan.
- `tasks.md` - staged checklist for the finalization wave.
- `contracts/upstream-artifacts.md` - artifact ledger and verification notes.
- `contracts/source-to-public-page-matrix.md` - source-to-page mapping.
- `contracts/public-boundary-checklist.md` - public-safe docs checklist.
