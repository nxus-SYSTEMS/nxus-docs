# Contributing to nxus.SYSTEMS Docs

Thank you for helping improve nxus.SYSTEMS documentation!

## How this repo works

`nxus-docs` is the **documentation site** for nxus.SYSTEMS products.
The Astro Starlight site structure, navigation, and theme live here permanently.

**Documentation content** (under `src/content/docs/nxuskit/`, etc.) is
generated from private source repositories and synced into this repo before
the public docs site is built.
This means:

- **Do not edit files under `src/content/docs/nxuskit/` directly.** Changes
  may be overwritten on the next upstream sync.
- **Do open PRs for content improvements.** We triage all PRs and apply
  accepted changes to the upstream source repo. Your contribution will be
  credited with `Co-authored-by` in the upstream commit, which counts toward
  your GitHub contribution graph.

## What you can contribute here directly

- Fixes to site navigation, sidebar structure, or `astro.config.mjs`
- Theme and CSS improvements (`src/styles/`)
- Custom UI components (`src/components/`)
- Improvements to the docs home page (`src/content/docs/index.mdx`)
- Build scripts and tooling (`scripts/`)

## What to do for content corrections

1. Open a PR with your proposed change to the relevant file under
   `src/content/docs/`. Clearly describe what is incorrect or missing.
2. We will review, accept or discuss, and apply the change upstream.
3. Once applied, the upstream CI will push the corrected content here
   and we will close your PR with a note.

Your GitHub username will appear as a co-author on the upstream commit.

## Development setup

```bash
npm install
npm run dev      # dev server at http://localhost:4321
npm run build    # production build to dist/
```

## Local docs sync

Routine content export should run locally or on a self-hosted runner before
pushing this public repo:

```bash
npm run sync:docs:examples
npm run build
```

The examples sync runs the source repo's README generator and then exports the
GitHub-native README into Starlight-compatible Markdown. The SDK sync command
exists for the same local workflow, but should be run only when the SDK docs
source tree is ready.

## Code of conduct

Please be respectful and constructive. We welcome all contributors.
