# W266 Pre-v2 34-example No-deploy Publication Review Packet

Private Docs receiver packet for RB-008 / `NXUSKIT-V2-MEGA-20260605`,
Docs W266, RC wave 90 of revised estimated 96-116.

## Purpose

This packet reviews the W260 exact 34-example Docs candidate for future
publication readiness without deploying to `docs.nxus.systems`, `nxus.systems`,
or any public surface.

The publication candidate remains the W260 routed Docs candidate at checkpoint
`e06eebc0b45261d63d43ca53fc7477baa2a10e02` on branch
`codex/rb008-docs-w260-pre-v2-34-no-deploy-20260629`.

The authoritative Examples source remains W257:

- Branch: `codex/v2-pre-v2-34-release-candidate-w257-20260629`
- Checkpoint: `6d6d87ccca9a88c445e8f46c485317cdac2b255b`
- Package path:
  `/Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w257-pre-v2-34-release-candidate/internal/preview/v2-roadmap-integration/w257-pre-v2-34-release-candidate-package/w257-pre-v2-34-release-candidate-package.json`

## Publication Candidate Summary

W260 prepares a no-deploy Docs candidate that:

- shows exactly `34 approved public examples` in
  `src/content/docs/nxuskit/examples/index.md`;
- links exactly the 34 W257 `candidate_inventory` example ids;
- keeps a routed current Docs source page for every W257 candidate;
- removes the pre-v2-excluded `hello-provider` routed current page;
- keeps `hello-provider`, `cedar-local-policy`, W233 private candidates,
  internal preview artifacts, generated public artifacts, and v2-only or
  public-preview rows absent from the pre-v2 routed candidate surface;
- adds a private W260 validator that reads the external W257 package path
  without vendoring private Examples package data into this repo.

## Approval Gate Checklist

Before any public Docs deploy, Manager/Operator/Leadership must explicitly
approve all of these gates in the controlling thread:

- [ ] Use W257 as the authoritative source for the exact 34-example pre-v2
      inventory.
- [ ] Approve W260 checkpoint
      `e06eebc0b45261d63d43ca53fc7477baa2a10e02` as the Docs publication
      candidate.
- [ ] Confirm `hello-provider` stays excluded from this pre-v2 public surface
      unless a separate public-preview/v2-alpha or SDK v2 gate opens.
- [ ] Confirm `cedar-local-policy`, W233 private candidates, internal preview
      artifacts, generated public artifacts, and v2-only/public-preview rows
      remain excluded.
- [ ] Confirm publication scope is Docs-only and does not authorize Website,
      SDK, Examples, Celerat/Plugins, Peeler, release/tag/package, provider
      registry, runtime/provider execution, source refresh, or downstream
      receiver prompts.
- [ ] Confirm the exact pre-publication validation commands below have passed
      on the candidate branch after the final Manager approval.
- [ ] Confirm the deploy path is the repo's normal `main` / GitHub Pages path
      and that no direct production mutation or manual artifact upload is used.
- [ ] Record the current production `origin/main` SHA before merge/deploy.
- [ ] Confirm rollback owner and response window before deployment.

## Required Pre-publication Validation

Run these commands immediately before any separately authorized merge/deploy:

```bash
python3 internal/preview/v2-roadmap-integration/w257-pre-v2-34-release-candidate-package/test-w257-pre-v2-release-candidate-package.py
```

Run from the Examples W257 worktree:
`/Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w257-pre-v2-34-release-candidate`.

```bash
python3 internal/preview/v2-roadmap-integration/w257-pre-v2-34-release-candidate-package/validate-pre-v2-release-candidate-package.py \
  --package internal/preview/v2-roadmap-integration/w257-pre-v2-34-release-candidate-package/w257-pre-v2-34-release-candidate-package.json \
  --w249-package internal/preview/v2-roadmap-integration/w249-pre-v2-public-safe-release-eligibility/w249-pre-v2-public-safe-release-eligibility.json \
  --w253-evidence internal/preview/v2-roadmap-integration/w253-hello-provider-pre-v2-compatibility/w253-hello-provider-pre-v2-compatibility.json \
  --selection conformance/examples_publication_selection.json \
  --ledger conformance/examples_publication_ledger.json \
  --manifest conformance/examples_manifest.json \
  --w233-bundle internal/preview/v2-roadmap-integration/w233-private-consumer-prep-bundle/w233-private-consumer-prep-bundle.json
```

Run these from `/Users/ken/codeRepos/nxus-docs` on the candidate branch:

```bash
node --check specs/260-pre-v2-34-no-deploy-consumption-check/validate-pre-v2-34-docs-candidate.mjs
node specs/260-pre-v2-34-no-deploy-consumption-check/validate-pre-v2-34-docs-candidate.mjs \
  --package /Users/ken/codeRepos/nxusKit-examples-internal/tmp/worktrees/w257-pre-v2-34-release-candidate/internal/preview/v2-roadmap-integration/w257-pre-v2-34-release-candidate-package/w257-pre-v2-34-release-candidate-package.json
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
rg -n "hello-provider|cedar-local-policy|prolog-scryer-refreshed-source|cedar-protected-boundary|clips-static-fixture|rre-research-internal|pydantic-v2-projection-drift|typescript-zod-projection-drift|node-wrapper-private-diagnostic|35 approved public examples|1 extension-authoring example" src/content/docs/nxuskit/examples dist
git diff --check
git diff --cached --check
```

The `rg` command above must return exit code `1` with no matches.

## Denied Rows And Claims

The following rows and surfaces must remain absent from current routed Docs
source and built output for this pre-v2 candidate:

- `hello-provider`
- `cedar-local-policy`
- `prolog-scryer-refreshed-source`
- `cedar-protected-boundary`
- `clips-static-fixture`
- `rre-research-internal`
- `pydantic-v2-projection-drift`
- `typescript-zod-projection-drift`
- `node-wrapper-private-diagnostic`
- W233 private candidates as a group
- internal preview artifacts
- generated public artifacts not produced by an approved public export lane
- v2-only or public-preview rows without a later explicit gate

The candidate must not introduce provider registry, runtime/provider execution,
source refresh, release-ready, package-ready, public API, public-preview, or SDK
v2 public-readiness claims for excluded rows.

## Rollback And Backout Anchors

Known anchors:

- Pre-W260 routed Docs content anchor:
  `2ccee5eb18e893a21b2d132dd5e34b4cb6c51af5`
- W260 candidate content checkpoint:
  `e06eebc0b45261d63d43ca53fc7477baa2a10e02`

Before any deployment, record the production base:

```bash
git fetch origin
git rev-parse origin/main
```

If W260 is merged and must be backed out before deploy, revert the candidate
content commit on the deployment branch:

```bash
git revert --no-edit e06eebc0b45261d63d43ca53fc7477baa2a10e02
```

If a merge commit is deployed to `main`, revert that deployed merge commit
instead, then let the normal Pages workflow redeploy:

```bash
git switch main
git pull --ff-only origin main
git revert --no-edit -m 1 <deployed-merge-commit>
git push origin main
```

If the branch is fast-forwarded or squashed into `main`, use the production base
SHA recorded before deployment to choose the smallest correct revert. Do not
force-push or reset `main` unless the Manager/Operator explicitly authorizes
that emergency operation.

## Publication Hard Stops

This packet does not authorize:

- deploy/publication to `docs.nxus.systems`, `nxus.systems`, or any public
  surface;
- generated public Docs output publication;
- release/tag/package work;
- SDK, Examples, Website, Celerat/Plugins, or Peeler edits;
- downstream prompts beyond the Manager callback;
- provider registry work;
- runtime/provider execution;
- source refresh;
- public claims for denied rows.

## Recommended Next Option

The safest next lane is a Manager/Operator deploy-gate prompt that names the
candidate branch, W260 checkpoint, W257 package checkpoint, required validation
commands, production base recording requirement, and rollback owner. Without
that explicit gate, the correct state is no deploy and no public publication.
