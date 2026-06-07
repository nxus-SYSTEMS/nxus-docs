# Implementation Plan: Docs Gate H Alpha Preview

## Approach

Create a non-routed planning package that docs can consume later. The package
records upstream inputs and maps them to future public docs pages without
touching Starlight content, site navigation, generated output, or version state.

## RB-005 Readiness Summary

- Workspace: clean isolated `nxus-docs` worktree on the S14c branch.
- Base: refreshed `origin/main` at `ba8a0c2`.
- Package manager: npm.
- Runtime observed: Node `v22.14.0`, npm `10.9.2`.
- Supervisor tooling observed: tmux `3.6a`.
- Disk space observed: sufficient for docs validation and build.
- Dirty-state caution: the original checkout has untracked local files that are
  intentionally not touched by this worktree.

## RB-006 Application

This slice is an M implementation checkpoint. The supervisor executes directly
because the requested output is a bounded docs-spec package and does not need a
separate worker process. RB-006 gates still apply:

- source inputs are recorded by branch and commit;
- no public docs finalization is performed;
- validation is run before commit;
- checkpoint commit is created and pushed only after validation passes;
- no PR is created.

## Future Public Docs Shape

After Gate N and Gate O, a public docs implementation wave can add routed pages
under `src/content/docs/nxuskit/` and regenerate hosted AI indexes through the
normal build. Candidate future sections:

1. v1 freeze and v2 alpha positioning.
2. Contract v2 CLI schema commands.
3. Contract fixtures and conformance.
4. Projection validation.
5. Peeler migration and compatibility notes.
6. Licensing runtime and tier disclosure notes.
7. Celerat recipe and agent-plugin guidance.
8. Public/private boundary checklist.

## Gate Lock Handling

Gate G remains locked. Do not document protected Solver/ZEN execution as
available from non-Rust projections or downstream tools.

Gate N remains locked. Do not publish final v2/v1 naming, migration guide,
release notes, changelog entries, or version-selector changes.

Gate O remains locked. Do not publish launch-ready docs, website copy, public
example claims, or AI indexes for this alpha material.

## Validation Plan For This Package

Required now:

- `git diff --check`
- Markdown scan for local absolute paths and prohibited topology terms.
- JSON/YAML syntax checks if such files are added.
- `npm run check:docs-version`
- `npm run check:public-leaks`
- `npm run build` when dependencies are available.
- Confirm no changes under `src/content/docs/**`, `astro.config.mjs`, `dist/`,
  `.astro/`, `node_modules/`, root `llms.txt`, or generated sync outputs.

Required later for public finalization:

- `npm run build`
- inspect generated `dist/llms.txt` and `dist/llms-full.txt`;
- route smoke for each new page;
- boundary scan for unsupported language claims, private topology, local paths,
  private workflow content, and payload leakage;
- deployment only after Gate N and Gate O sign-off.
