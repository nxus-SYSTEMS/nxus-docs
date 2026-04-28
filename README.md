# nxus-docs

Documentation site for [nxus.SYSTEMS](https://nxus.systems) products,
built with [Astro Starlight](https://starlight.astro.build/).

Live at: **[docs.nxus.systems](https://docs.nxus.systems)**

## Products

- **nxusKit SDK** — multi-language SDK for LLMs, rule engines, solvers, and decision tables
- **Peeler** — desktop application *(coming soon)*
- **nxusTide** — SaaS platform *(coming soon)*

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Development

```bash
npm install
npm run dev      # dev server at http://localhost:4321
npm run build    # production build to dist/
```

## Architecture

Site scaffolding and navigation live in this repo permanently.
Documentation content under `src/content/docs/<product>/` is generated
from each product source repo, then synced into this repo before the
public site build runs.

The preferred process keeps private source-repo work off GitHub-hosted
Actions:

```bash
npm run sync:docs:examples  # generate + sync nxusKit examples docs locally
npm run sync:docs:sdk       # sync nxusKit SDK docs locally when ready
npm run sync:docs           # current default: examples only
npm run sync:docs:all       # run both local sync paths
npm run build               # build Starlight + generate llms.txt files
npm run refresh:docs        # sync default docs, then build and regenerate indexes
npm run refresh:docs:all    # sync examples + SDK, then build and regenerate indexes
```

`sync:docs:examples` runs
the examples source repo's `scripts/generate-examples-showcase.sh --generate`
and exports that repo's root README as `src/content/docs/nxuskit/examples/index.md`
with Starlight frontmatter and public-source links. Set
`NXUSKIT_EXAMPLES_REPO=/path/to/examples/source` before running it.

`sync:docs:sdk` mirrors the existing publish-to-docs contract from
the SDK source repo. It prefers `docs/user/` as the authoritative Starlight
tree and can fall back to mapping `sdk-packaging/docs/` into the public sidebar.
Set `NXUSKIT_REPO=/path/to/sdk/source` before running it.

`npm run build` is the only generator for the public AI index files. It runs
Astro first, then `scripts/generate-llms-txt.mjs`, producing both `dist/llms.txt`
and `dist/llms-full.txt`. Use `refresh:docs` or `refresh:docs:all` when the
content source and the deployed AI index files should be refreshed together.

GitHub Actions in this public repo should only validate/build the Starlight
site and deploy GitHub Pages. The final target is `docs.nxus.systems`, so
`astro.config.mjs` intentionally does not set a `base` path by default. For a
temporary project-page build, set `SITE_URL=https://nxus-systems.github.io` and
`BASE_PATH=/nxus-docs`.

## Custom domain

`public/CNAME` keeps `docs.nxus.systems` in the Pages artifact, but workflow
deploys also need the repository Pages settings to claim the domain. If
`https://docs.nxus.systems` shows GitHub's generic Pages 404, check:

```bash
gh api repos/nxus-SYSTEMS/nxus-docs/pages
gh api repos/nxus-SYSTEMS/nxus-docs/pages/health
```

The Pages response should include `"cname": "docs.nxus.systems"` and HTTPS
should be enforced after GitHub provisions the certificate.
