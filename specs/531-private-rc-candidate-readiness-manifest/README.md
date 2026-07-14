# W531 Private RC Candidate-Readiness Manifest

Private/no-deploy Docs receiver artifact for RB-008 /
`NXUSKIT-V2-MEGA-20260605`, Docs W531, wave W531 of estimated W426-W492.

This RC candidate-readiness manifest records how the accepted Docs private
buyer/developer journey should be handled after the W535 proof-truth refresh.
It consumes DevOps W530 as private Manager evidence, the W532 Docs-local
candidate as the clean private base, SDK W535 as normalized RC Core truth, and
Examples W535 as the current W521/W524 proof refresh. It keeps all publication,
release, production, live-service, and public-claim gates closed.

This is not routed Docs copy, public website copy, release notes, a generated
docs output, or a branch-merge instruction.

## Source Evidence

Primary private evidence:

- DevOps W530 marker:
  `READY_DEVOPS_W530_PRIVATE_RC_INTEGRATION_BRANCH_PREFLIGHT_OVER_W529`
- DevOps W530 checkpoint:
  `c984fc9`
- DevOps W530 markdown record:
  `.codex/rb008/NXUSKIT-V2-MEGA-20260605/c9-w530-private-rc-integration-branch-preflight-over-w529.md`
- DevOps W530 metadata record:
  `.codex/rb008/NXUSKIT-V2-MEGA-20260605/c9-w530-private-rc-integration-branch-preflight-over-w529.yaml`
- Docs W532 private RC candidate checkpoint:
  `6f37d231265c1682c463bcf0cc70c20637266cf1`
- Docs W532 branch:
  `codex/w532-docs-private-rc-integration-candidate-w428base-20260714`
- Docs W535 branch:
  `codex/w535-docs-sdk-normalized-rc-core-20260714`
- Examples W535 checkpoint:
  `e0cbf0736d5e65f37b1a91cd9db94af8d845154d`
- Examples W535 branch:
  `codex/w535-examples-sdk-normalized-rc-core-20260714`
- DevOps W525 checkpoint:
  `169c654`
- SDK W535 normalized RC Core checkpoint:
  `51ed2c4e64445f7170775804d4d98feea5ba6acd`
- SDK W535 RC Core base:
  `c1574cdfd1eefa9f8167c52bb3f384678fb12126`
- SDK W535 branch:
  `codex/w535-sdk-rc-core-normalization-v2base-20260714`

The Docs candidate remains private/no-deploy. Its evidence value is the private
Docs buyer/developer journey over the W535-normalized W521/W524 clean-checkout
proof, SDK W535 RC Core truth, and W525 prior private release-integration
posture.

## No Public Authority Opened

Docs W531 is private/no-deploy and non-routed. It does not authorize routed
Docs pages, generated docs publication, public sync, deploy, public website
copy, public release or package movement, public API/schema/CLI/wrapper
availability claims, live Product Catalog/Odoo state, live entitlement,
signing, hosted execution, production data, customer data, customer-facing
claims, support/compliance/security claims, downstream publication, or W561+
work.

## W530 Preflight Disposition

W530 recorded the following private RC integration state:

```text
PRIVATE_RC_PREFLIGHT_READY: true
ACCEPTED_CHECKPOINTS_EXIST_LOCALLY: true
COMMON_MERGED_RC_BRANCH_SELECTED: false
COMMON_MERGED_RC_BRANCH_CREATED: false
COMMON_MERGED_RC_BRANCH_VERIFIED: false
MERGE_OR_CHERRY_PICK_ATTEMPTED: false
PUBLIC_RELEASE_GO: false
PRODUCTION_GO: false
PACKAGE_RELEASE_GO: false
PUBLIC_DEFAULT_PROJECTION_GO: false
LIVE_LICENSING_GO: false
CUSTOMER_DATA_GO: false
MATERIAL_PUBLIC_CLAIMS_GO: false
W561_PLUS_GO: false
```

W530’s integration blocker is precise: accepted receiver checkpoints exist
locally, including Docs W526/W532/W535 evidence, but there is no selected, created, and verified common RC artifact branch; in other words, no selected, created, and verified common RC artifact branch exists. Calling the Docs candidate a
merged RC artifact would therefore be inaccurate.

## W526 Candidate Artifacts

Exact Docs artifacts included in the W535 private Docs RC candidate:

| Artifact | Path | Candidate role |
| --- | --- | --- |
| Private buyer/developer journey | `specs/526-private-w524-w525-agent-action-gate-clean-checkout-journey-refresh/README.md` | Include or reference as the Docs C4 journey artifact for Agent Action Gate private evaluation over SDK W535 and Examples W535. |
| Focused private journey validator | `specs/526-private-w524-w525-agent-action-gate-clean-checkout-journey-refresh/validate-w526-w524-w525-clean-checkout-journey.mjs` | Include with the journey artifact so integration validation can re-run claim-boundary, stale-checkpoint, and public-surface scans. |

The W526 artifacts are private specs/checker files only. They should not be
copied into routed Docs pages, generated docs output, release notes, public
website content, or any customer-facing release artifact.

## Current Branch And Worktree State

W535 updates this manifest on:

```text
branch: codex/w535-docs-sdk-normalized-rc-core-20260714
base: 6f37d231265c1682c463bcf0cc70c20637266cf1
```

At W535 start, the tracked tree was clean on the W532 checkpoint. The receiver
checkout, outside this isolated worktree, had preserved untracked files:

- `.vexp/`
- `session-handoff.md`
- `codex-controlled-write-classic-retry-20260711.md`
- `codex-controlled-write-codex-apply-smoke-20260711.md`

These local artifacts are preserved and are not staged for W535. They are not
candidate RC integration artifacts.

## Candidate Integration Disposition

Recommended W535 disposition:

| Strategy | W531 disposition | Reason |
| --- | --- | --- |
| reference-only | No longer sufficient for the Docs-local candidate | W535 updates the Docs-local private candidate branch but still does not claim a common cross-repo RC branch. |
| cherry-pick | Allowed later, after a private integration branch is selected and dirty-state guards pass | A future integrator may cherry-pick the W535-updated W526/W531 private specs/checker commits into an explicit private RC branch. |
| merge | Deferred | Merging a receiver branch is broader than needed until the integration branch, artifact list, and branch hygiene plan are explicit. |
| defer | Required for public, release, production, live-service, and customer-facing paths | Public docs publication, release/package movement, production promotion, live licensing, and customer-facing claims remain closed. |

If a future common private integration branch is approved, the W535-updated W526
and W531 files should be integrated as private specs/checker artifacts only. Do
not integrate unrelated untracked local files or branch-local scratch content.

## Required Validation After Integration

After this W535 branch or any future private integration branch includes W526
and W531, re-run at
least:

```bash
node --check specs/531-private-rc-candidate-readiness-manifest/validate-w531-rc-candidate-readiness-manifest.mjs
node specs/531-private-rc-candidate-readiness-manifest/validate-w531-rc-candidate-readiness-manifest.mjs
node --check specs/526-private-w524-w525-agent-action-gate-clean-checkout-journey-refresh/validate-w526-w524-w525-clean-checkout-journey.mjs
node specs/526-private-w524-w525-agent-action-gate-clean-checkout-journey-refresh/validate-w526-w524-w525-clean-checkout-journey.mjs
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/526-private-w524-w525-agent-action-gate-clean-checkout-journey-refresh/validate-w526-w524-w525-clean-checkout-journey.mjs --dist
node specs/531-private-rc-candidate-readiness-manifest/validate-w531-rc-candidate-readiness-manifest.mjs --dist
git diff --check
git diff --cached --check
```

Also run focused source and built-output scans for denied private evidence,
denied-row wording, stale SDK W517 checkpoint/source tokens, and forbidden-claim
leakage. Those scans should prove that W526/W531/W535 private wave references,
private proof case names, private checkpoints, private RC integration wording,
public-release claims, production claims, live-service claims, public
API/schema/CLI/wrapper claims, support claims, compliance claims, and security
claims do not leak into routed Docs pages or built public output.

## Rollback/Backout Criteria

Back out or skip W526/W531 from a future private RC integration branch if any
of these conditions occur:

- the common RC artifact branch is still not selected, created, and verified
  but someone claims a common merged RC artifact;
- W532 checkpoint `6f37d231265c1682c463bcf0cc70c20637266cf1` is missing or
  not the intended Docs-local private candidate base;
- SDK W535 checkpoint `51ed2c4e64445f7170775804d4d98feea5ba6acd` is replaced by
  a historical SDK W517 validation checkout;
- Examples W535 checkpoint `e0cbf0736d5e65f37b1a91cd9db94af8d845154d` is
  replaced by stale W521/W524 proof-truth checkpoints;
- the integration attempt stages unrelated untracked local artifacts;
- untracked local artifacts are not part of the accepted evidence and must not
  be staged;
- the integration attempt changes routed Docs pages, generated docs output, or
  public website copy;
- validation fails, public-leak checks fail, build checks fail, or
  source/built-output scans find denied private evidence;
- any public, release, production, live-service, customer-facing, support,
  compliance, security, or W561+ gate is opened by accident.

Backout action should be narrow: revert the W535 private specs/checker update,
remove the W535-updated W526/W531 entries from the private RC integration
branch, or fall back to the W532 candidate as reference-only evidence. Do not
rewrite unrelated receiver history, do not discard preserved untracked local
artifacts, and do not claim a merged RC artifact until the integration branch is
selected and verified.

If a candidate branch carries the wrong proof truth, remove the private specs
from that private RC integration branch and rerun the required validation.

## Hard Gates Still Closed

- no routed public docs edits;
- no generated public docs;
- no deploy/public sync;
- no production deployment;
- no public release/package/tag;
- no public API/schema/CLI/wrapper availability claim;
- no Odoo/Product Catalog mutation;
- no live entitlement/signing/credentials;
- no hosted/public execution;
- no customer/production data;
- no production/customer availability/support/compliance/security claim;
- no downstream public publication;
- no W561+ work.

## Options And Recommendation

Recommended next action for Docs is private candidate validation:

1. Keep the W535-updated Docs candidate branch private and non-routed.
2. Use the W535-updated W526/W531 files as the Docs C4/C9 private RC evidence
   for the federated manifest.
3. If a later common private integration branch is selected, cherry-pick only
   the accepted private specs/checker artifacts after dirty-state guards pass.
4. Re-run the required validation set after any integration.
5. Keep public docs publication, public sync, deploy, release/package movement,
   production promotion, live licensing, and customer-facing claims closed
   until separate explicit gates open.

Do not publish or route this candidate solely because W535 exists. This manifest
documents the Docs-local private RC candidate and its validation requirements;
it does not authorize public Docs movement.
