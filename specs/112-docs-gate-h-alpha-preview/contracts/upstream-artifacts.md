# Upstream Artifact Ledger

This ledger records W12/S14c docs planning inputs. It does not copy upstream
files into `nxus-docs`.

## Git-Verified Inputs

| Lane | Branch | Commit | Artifact classes | Future docs use |
| --- | --- | --- | --- | --- |
| SDK Gate H projection conformance alpha | `110-v2-projection-conformance-alpha` | `c1574cdfd1eefa9f8167c52bb3f384678fb12126` | Projection provenance, Pydantic alpha validators, Zod alpha validators, conformance tests, downstream-consumption note | Projection validation page, source/provenance notes, future conformance matrix |
| Examples Gate H preview alpha | `codex/rb008-s13-gate-h-examples-alpha` | `6d27f582b88a28c747bcbd83f9630615f2203efd` | Internal preview README, positive fixture mirrors, smoke scripts, provenance copy | Example-driven docs smoke plan and future public-safe example references |
| Peeler Gate H conformance refinement | `codex/rb008-peeler-gate-h-conformance-20260606` | `d8103b7` | Peeler sample export tests, Pydantic/Zod validation scripts, conformance consumption note | Peeler migration notes and downstream validation posture |
| Celerat Gate H alpha preview package | `codex/rb008-s13b-celerat-gate-h-alpha-20260607` | `0ea90d1` | Preview package metadata, contract-v2 CLI probe recipe, Pydantic/Zod validation recipe, Peeler validation recipe | Celerat recipe coordination and future public-safe agent-plugin docs |
| Licensing runtime local slice | `015-nxus-licensing-runtime-local-runtime` | `1ce699517a0e0afe23f83cce2e2145014740271a` | Runtime status, redaction, product profile contracts, local runtime tests | Licensing runtime and tier disclosure notes |

## Input Use Rules

- Reference upstream commits and artifact classes; do not vendor generated
  validators, fixtures, dependency caches, or preview package outputs.
- Treat Gate H artifacts as alpha conformance inputs, not product-final API
  contracts.
- Keep Celerat recipe references validation-only until public-safe package
  sign-off.
- Keep licensing runtime context to public-safe status and tier vocabulary. Do
  not document internal commercial integration topology.
