# Specification: Docs Gate H Alpha Preview Package

## Status

Internal preview specification for W12/S14c. This is not public docs
finalization and does not create routed Starlight content.

## User Story

As the docs lane, we need a compact, public-safe preview package that records how
Gate H alpha projection-conformance artifacts will be turned into public docs
after Gate N and Gate O, without publishing those pages early or leaking private
implementation details.

## Requirements

### FR-001: Upstream Checkpoint Ledger

The package MUST list each current upstream input by repo lane, branch, commit,
artifact class, and docs use.

### FR-002: Future Page Outlines

The package MUST include preview-only outlines for these future page groups:

- v1 freeze and v2 alpha positioning.
- `contract-v2` CLI schema commands.
- Contract fixture and conformance documentation.
- Projection validation documentation.
- Peeler migration notes.
- Licensing runtime and tier disclosure notes.
- Celerat recipe and agent-plugin guidance.
- Public/private boundary checklist.

### FR-003: Boundary Preservation

The package MUST NOT add routed public docs pages or modify generated docs,
generated AI indexes, version-selector/changelog release state, docs sync
outputs, website copy, storefront/catalog materials, or deployment artifacts.

### FR-004: Support Claim Accuracy

The package MUST keep current public support claims aligned to Rust, Go, Python,
the C ABI, and CLI/Bash workflows. It MAY refer to TypeScript/Zod alpha
projection artifacts as validation artifacts only. It MUST NOT claim current
JavaScript, TypeScript, or Node SDK support.

### FR-005: Gate Locks

The package MUST explicitly preserve these locks:

- Gate G locked: no protected Solver/ZEN execution proof claims.
- Gate N locked: no final version/migration naming or public release guidance.
- Gate O locked: no launch-ready public docs or public boundary sign-off.

### FR-006: No Vendored Alpha Payloads

The package MUST NOT vendor generated validators, dependency lockfiles from
upstream preview packages, fixtures, data-plane payloads, record batches, blob
examples, SQL bodies, unpublished assets, or local absolute paths.

## Acceptance Criteria

1. The package exists under `specs/112-docs-gate-h-alpha-preview/`.
2. No file under `src/content/docs/**` is changed.
3. No generated output or dependency directory is changed.
4. Future page mappings are concrete enough for Gate N/O implementation.
5. Gate locks and public-boundary exclusions are explicit.
6. Validation commands pass or record exact caveats.

## Gate Posture

Gate H is alpha-consumable for planning. Gate G, Gate N, and Gate O remain
locked. This package does not unblock public docs finalization.
