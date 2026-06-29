# W260 Pre-v2 34-example Docs Consumption Check

Private Docs receiver validation for RB-008 / `NXUSKIT-V2-MEGA-20260605`,
Docs W260, RC wave 84 of revised estimated 96-116.

## Purpose

This no-deploy checkpoint validates that the routed Docs candidate surface can
represent exactly the W257 pre-v2 34-example release-candidate package without
publishing to `docs.nxus.systems`, `nxus.systems`, or any public surface.

The W257 package remains the source of truth. This repo does not vendor the
Examples package, generate a public export, mutate release metadata, or publish
anything in this lane.

## Scope

- Current examples index copy must say `34 approved public examples`.
- Current examples index links must match the W257 `candidate_inventory` set
  exactly.
- Each W257 candidate must have a routed current Docs source page.
- `hello-provider`, `cedar-local-policy`, W233 private candidates, internal
  preview artifacts, generated public artifacts, and v2-only/public-preview
  rows must remain absent from the pre-v2 candidate routed surface.

## Run

```bash
node specs/260-pre-v2-34-no-deploy-consumption-check/validate-pre-v2-34-docs-candidate.mjs \
  --package /path/to/w257-pre-v2-34-release-candidate-package.json
```

## Non-authority

This validation does not authorize deployment, release, public sync generation,
provider registry inclusion, package/tag work, downstream prompts, SDK/Examples
edits, or public claims for any excluded row.
