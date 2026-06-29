# W279 Pre-v2 34-example Publication Gate Readiness

Private Docs receiver packet for RB-008 / `NXUSKIT-V2-MEGA-20260605`,
Docs W279, RC wave 103 of revised estimated 96-116.

## Purpose

This packet prepares the approval, validation, deploy-command, and rollback
checklist for a future public publication gate for the W273/W268 pre-v2
34-example Docs candidate.

It does not authorize or perform deploy, public sync, publication to
`docs.nxus.systems`, publication to `nxus.systems`, release/tag/package work, or
downstream prompts beyond the Manager callback.

## Evidence References

Docs evidence:

- Candidate branch:
  `codex/rb008-docs-w260-pre-v2-34-no-deploy-20260629`
- W260 routed candidate checkpoint:
  `e06eebc0b45261d63d43ca53fc7477baa2a10e02`
- W266 private publication-review checkpoint:
  `f2af3daa2bce78e6cca81d3c3d882793a2c0f6a1`
- W273 W268 refresh checkpoint:
  `3286889140c2715070bc61a4785bc251426c8d97`

Examples evidence:

- W268 branch:
  `codex/v2-pre-v2-34-export-rc-package-w268-20260629`
- W268 checkpoint:
  `69e0122c370a1a0d00d43988b754fef720801b02`
- W268 package path:
  `/Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w268-pre-v2-34-export-rc-package/internal/preview/v2-roadmap-integration/w268-pre-v2-34-export-rc-package/w268-pre-v2-34-export-rc-package.json`

W268 is the final Examples export RC evidence for this candidate. W257 remains
the exact inventory source preserved by W268.

## Publication Candidate Disposition

The future deploy candidate is the routed Docs content already present on the
candidate branch after W260, with W266/W273 private evidence packets retained.
W279 does not change routed Docs content.

The candidate must continue to show exactly 34 approved public examples and
must not include:

- `hello-provider`
- `cedar-local-policy`
- W233 private candidates
- internal preview artifacts
- generated public artifacts outside an approved public export lane
- v2-only or public-preview rows

The candidate must not add public claims for provider registry, runtime/provider
execution, source refresh, public API readiness, release readiness, package
readiness, support readiness, SDK v2 public readiness, or equivalent authority
for excluded rows.

## Approval Prerequisites

Before any public Docs publication gate can proceed, the Manager/Operator must
explicitly approve all of these items in the controlling thread:

1. Name this candidate branch and the W273 checkpoint as the intended deploy
   candidate.
2. Accept W268 checkpoint `69e0122c370a1a0d00d43988b754fef720801b02` and the
   W268 package path above as the final Examples export RC evidence.
3. Confirm the future publication scope is Docs-only and uses the normal
   `main` / GitHub Pages path.
4. Confirm no public sync, release/tag/package work, Website, SDK, Examples,
   Celerat/Plugins, Peeler, source refresh, provider registry, runtime/provider
   execution, or downstream receiver prompts are included.
5. Confirm denied rows remain excluded and that no v2/private/internal row is
   made public by the publication gate.
6. Confirm the exact pre-publication validation commands below pass after the
   approval prompt and before merging to `main`.
7. Record the production base SHA from `origin/main` immediately before merge.
8. Assign deployment owner, rollback owner, and rollback response window.
9. Confirm the rollback command choice before merging, based on whether the
   branch will be merged, fast-forwarded, or squashed.

## Required Pre-publication Validation

Run these from the W268 Examples worktree:

```bash
python3 internal/preview/v2-roadmap-integration/w268-pre-v2-34-export-rc-package/test-w268-pre-v2-export-rc-package.py
```

```bash
python3 internal/preview/v2-roadmap-integration/w268-pre-v2-34-export-rc-package/validate-pre-v2-export-rc-package.py \
  --package /Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w268-pre-v2-34-export-rc-package/internal/preview/v2-roadmap-integration/w268-pre-v2-34-export-rc-package/w268-pre-v2-34-export-rc-package.json \
  --w257-package /Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w268-pre-v2-34-export-rc-package/internal/preview/v2-roadmap-integration/w257-pre-v2-34-release-candidate-package/w257-pre-v2-34-release-candidate-package.json \
  --w259-package /Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w268-pre-v2-34-export-rc-package/internal/preview/v2-roadmap-integration/w259-pre-v2-34-export-release-dry-run/w259-pre-v2-34-export-release-dry-run.json \
  --repo-root /Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w268-pre-v2-34-export-rc-package
```

Run these from `/Users/ken/codeRepos/nxus-docs` on the candidate branch:

```bash
node --check specs/260-pre-v2-34-no-deploy-consumption-check/validate-pre-v2-34-docs-candidate.mjs
node specs/260-pre-v2-34-no-deploy-consumption-check/validate-pre-v2-34-docs-candidate.mjs \
  --package /Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w257-pre-v2-34-release-candidate/internal/preview/v2-roadmap-integration/w257-pre-v2-34-release-candidate-package/w257-pre-v2-34-release-candidate-package.json
node --check specs/273-w268-pre-v2-34-no-deploy-refresh/validate-w268-pre-v2-34-docs-refresh.mjs
node specs/273-w268-pre-v2-34-no-deploy-refresh/validate-w268-pre-v2-34-docs-refresh.mjs \
  --package /Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w268-pre-v2-34-export-rc-package/internal/preview/v2-roadmap-integration/w268-pre-v2-34-export-rc-package/w268-pre-v2-34-export-rc-package.json
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/273-w268-pre-v2-34-no-deploy-refresh/validate-w268-pre-v2-34-docs-refresh.mjs \
  --package /Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w268-pre-v2-34-export-rc-package/internal/preview/v2-roadmap-integration/w268-pre-v2-34-export-rc-package/w268-pre-v2-34-export-rc-package.json \
  --dist
rg -n "hello-provider|cedar-local-policy|prolog-scryer-refreshed-source|cedar-protected-boundary|clips-static-fixture|rre-research-internal|pydantic-v2-projection-drift|typescript-zod-projection-drift|node-wrapper-private-diagnostic|35 approved public examples|1 extension-authoring example" src/content/docs/nxuskit/examples dist
rg -n "public[-_ ]ready|release[-_ ]ready|provider[-_ ]registry[-_ ]ready|api[-_ ]ready|runtime[-_ ]ready|package[-_ ]ready|generated[-_ ]artifact[-_ ]ready|support[-_ ]ready|provider registry|runtime/provider execution|source refresh" src/content/docs/nxuskit/examples dist/nxuskit/examples
git diff --check
git diff --cached --check
```

Both `rg` commands above must return exit code `1` with no matches.

## Future Deploy Command Sequence

These commands are for a later explicit deployment prompt only. Do not run them
from this packet lane.

Record the production base:

```bash
git fetch origin
git rev-parse origin/main
```

Re-run the required pre-publication validation on the candidate branch. If it
passes and the Manager/Operator has approved deployment, merge through the
normal `main` / GitHub Pages path:

```bash
git switch main
git pull --ff-only origin main
git merge --no-ff codex/rb008-docs-w260-pre-v2-34-no-deploy-20260629
git push origin main
```

Monitor the normal GitHub Pages deploy workflow and verify the live examples
index and denied-row absence after deployment.

## Rollback And Backout Anchors

Known anchors:

- Pre-W260 routed Docs content anchor:
  `2ccee5eb18e893a21b2d132dd5e34b4cb6c51af5`
- W260 routed candidate checkpoint:
  `e06eebc0b45261d63d43ca53fc7477baa2a10e02`
- W273 evidence checkpoint:
  `3286889140c2715070bc61a4785bc251426c8d97`
- Production base SHA:
  record immediately before any approved merge with `git rev-parse origin/main`

If the candidate is merged and must be backed out before deployment completes,
revert the merge commit selected for `main`.

```bash
git switch main
git pull --ff-only origin main
git revert --no-edit -m 1 <deployed-merge-commit>
git push origin main
```

If the candidate is fast-forwarded or squashed, use the recorded production base
SHA and the deployment log to choose the smallest correct revert. Do not
force-push, reset, clean, or delete evidence unless the Manager/Operator
explicitly authorizes that emergency operation.

## Publication Hard Stops

This packet keeps these gates closed:

- deploy or publication to `docs.nxus.systems`, `nxus.systems`, or any public
  surface;
- public docs sync or public generated-output publication;
- release/tag/package work;
- SDK, Examples, Website, Celerat/Plugins, Peeler, or source repo edits;
- downstream prompts beyond the Manager callback;
- provider registry or runtime/provider execution work;
- source refresh;
- public claims for denied rows or private candidate rows.

## Recommended Next Option

The next safe action is Manager/Operator review of W279 and, if approved later,
a separate deployment-gate prompt that names the candidate branch, W273
checkpoint, W268 package evidence, required validation commands, production
base recording requirement, rollback owner, and exact deployment command
sequence. Without that explicit gate, the correct state remains no deploy and
no public publication.
