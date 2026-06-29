# W273 W268 Pre-v2 34-example No-deploy Refresh

Private Docs receiver refresh for RB-008 / `NXUSKIT-V2-MEGA-20260605`,
Docs W273, RC wave 97 of revised estimated 96-116.

## Purpose

This packet refreshes the W260/W266 no-deploy Docs candidate evidence from the
final Examples W268 pre-v2 34-example export RC package.

W268 remains external Examples evidence. This repo does not vendor the W268
package, publish generated public docs, deploy to `docs.nxus.systems`, mutate
`nxus.systems`, tag, release, package, source-refresh, or edit SDK/Examples/
Website/Celerat/Peeler repos in this lane.

## Source Evidence

- Docs W260 checkpoint:
  `e06eebc0b45261d63d43ca53fc7477baa2a10e02`
- Docs W266 checkpoint:
  `f2af3daa2bce78e6cca81d3c3d882793a2c0f6a1`
- Examples W268 checkpoint:
  `69e0122c370a1a0d00d43988b754fef720801b02`
- W268 package path:
  `/Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w268-pre-v2-34-export-rc-package/internal/preview/v2-roadmap-integration/w268-pre-v2-34-export-rc-package/w268-pre-v2-34-export-rc-package.json`

## Validation

```bash
node specs/273-w268-pre-v2-34-no-deploy-refresh/validate-w268-pre-v2-34-docs-refresh.mjs \
  --package /path/to/w268-pre-v2-34-export-rc-package.json
```

After `npm run build`, include `--dist` to validate built output as well:

```bash
node specs/273-w268-pre-v2-34-no-deploy-refresh/validate-w268-pre-v2-34-docs-refresh.mjs \
  --package /path/to/w268-pre-v2-34-export-rc-package.json \
  --dist
```

The validator proves:

- W268 final export inventory count is exactly 34.
- W268 `exported_manifest_count`, `exported_selection_approved_count`, and
  release snapshot `examples_count` / `approved_count` are 34.
- W268 exported excluded count is 0.
- W268 excluded-row proof keeps `hello-provider`, `cedar-local-policy`, W233
  private candidates, internal preview artifacts, generated public artifacts,
  and v2-only/public-preview rows out of the export.
- Docs current examples index links match W268 `expected_example_ids` exactly.
- Every W268 example id has a routed current Docs source page.
- Current Docs source and optional built output have no denied-row strings or
  forbidden ready/provider/runtime/API/release/package/support claims.

## Non-authority

This refresh does not authorize public deploy, public sync, release/tag/package
work, downstream prompts beyond the Manager callback, provider registry,
runtime/provider execution, source refresh, or public claims for excluded rows.
