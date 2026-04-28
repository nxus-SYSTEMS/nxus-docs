# AGENTS.md

These instructions apply to the full `nxus-docs` repository.

## Repo Purpose

`nxus-docs` is the public Astro Starlight documentation site for
nxus.SYSTEMS products. The deployed site is `https://docs.nxus.systems/`.

The site shell, navigation, theme, components, and build tooling live here.
Product documentation under `src/content/docs/nxuskit/` and archived version
trees is generated from source repositories and synced into this repo before
deployment.

## Commands

- Install dependencies in a fresh checkout: `npm ci`
- Start local docs server: `npm run dev`
- Build the site and hosted AI indexes: `npm run build`
- Generate hosted AI indexes after an existing Astro build: `npm run build:llms`
- Check Astro/TypeScript types: `npm run astro check` or `npx tsc --noEmit`
- Sync default generated docs from local source repos: `npm run sync:docs`
- Sync examples docs only: `npm run sync:docs:examples`
- Sync SDK docs only: `npm run sync:docs:sdk`
- Refresh default docs and rebuild indexes: `npm run refresh:docs`

Run `npm run build` before opening a PR when changing site structure, content,
styles, components, or generation scripts.

## Source Of Truth

- Hosted AI indexes are generated into `dist/llms.txt` and
  `dist/llms-full.txt` by `npm run build`. Do not hand-edit generated files in
  `dist/`.
- The repo-root `llms.txt` is a concise discovery file for agents inspecting the
  GitHub repository. It should point to `https://docs.nxus.systems/llms.txt`
  and `https://docs.nxus.systems/llms-full.txt` rather than duplicating full
  hosted content.
- Keep `llms-full.txt` out of the repo root unless a generated, freshness-
  checked workflow is added for it.
- Product docs under `src/content/docs/nxuskit/` are synced from upstream
  product repos. Prefer fixing product content upstream, then syncing it here.
- Direct edits are appropriate for `astro.config.mjs`, `src/styles/`,
  `src/components/`, `scripts/`, root docs, and the docs landing page.

## Support Boundaries

- Current nxusKit developer surfaces are Rust, Go, Python, the C ABI, and
  CLI/Bash workflows.
- Do not claim current JavaScript, TypeScript, or Node SDK support.
- Describe C integration as the C ABI until first-class C support requirements
  are complete.
- Keep language and support claims aligned with the generated hosted indexes
  and the source product repositories.

## Security And Secrets

- Do not commit secrets, tokens, customer data, private source snapshots, or
  local environment files.
- Keep `.env*`, `node_modules/`, `.astro/`, `dist/`, `internal/`, and other
  ignored/generated directories out of commits.
- Public GitHub Actions in this repo should only validate, build, and deploy
  the public Starlight site. Private source-repo sync should run locally or on a
  trusted self-hosted runner.

## PR Expectations

- Keep changes scoped to the docs site behavior being updated.
- Include generated docs updates only when they come from the expected sync
  workflow or when a reviewer can clearly apply the correction upstream.
- When changing the docs tree, generation script, package scripts, or Starlight
  config, verify `npm run build` so hosted `llms.txt` and `llms-full.txt` are
  refreshed in the build artifact.
- Do not introduce repo-root full-content dumps or custom agent index formats
  unless there is an actual consuming workflow.
