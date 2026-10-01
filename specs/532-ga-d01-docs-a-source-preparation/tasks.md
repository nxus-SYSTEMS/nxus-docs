# GA-D01 task ledger

This ledger distinguishes completed preparation from held product execution.
Spec: [spec.md](spec.md). Source/dependency map: [plan.md](plan.md).

- [x] T001 [US1] Specify preparation scope and clarify settled versus open claims.
- [x] T002 [US1] Reconcile canonical root, local refs and preserved worktrees.
- [x] T003 [US1] Inventory current v1.0.5 commands and major.minor ceiling claims.
- [x] T004 [US1] Map SDK sources, export precedence and durable first-call proposal.
- [x] T005 [US1] Record GA-S04, GA-L01, GA-W02 and G0 accepted-input requirements.
- [x] T006 [US1] Analyze packet coverage and review planning-only diff.
- [ ] T007 [US1] Receive accepted final source/commands, activation/portal contracts
  and G0 copy; select Docs integration base. HELD: external acceptance absent.
- [ ] T008 [US1] Implement upstream mapping/metadata corrections and archive/sync
  accepted current source. HELD: no product execution authority in this slice.
- [ ] T009 [US1] Run source, version, leak, Astro, build, built-output and applicable
  journey checks, then exact-package CE/Pro walkthrough. HELD: depends on T008.
- [ ] T010 [US1] Return unpublished Docs A preview and source identities for G5
  review. HELD: depends on T009; no G5 acceptance or publication authority.

Preparation validation: repository/file inspection and planning diff review only.
Product builds, sync, preview, credential access, deployment and GA punchlist
updates were not performed.

## PRE-D01 approved parallel preparation

- [x] P001 Add isolated `/preview/nxuskit-v2/` preparation draft with banner and dependency status.
- [x] P002 Exclude preview from sitemap, search and hosted LLM indexes; retain self-canonical/noindex.
- [x] P003 Add exact-commit SDK preview export entry point without current sync/archive.
- [x] P004 Verify site build, links and current-tree invariance.
- [ ] P005 Receive PRE-S02 qualified package/source and PRE-L01 exercised activation prose.
- [ ] P006 Resolve exact public deployment boundary before publishing.

This lane does not satisfy GA G5. Installation source must come from
`sdk-packaging/docs/preview-linux-pro.md` at the accepted SDK candidate; the
currently inspected SDK HEAD `732b99599eb3b94ffdb58ca004f6041c36084ed5` has stale
ordinary installation instructions and is not an accepted preview candidate.

PRE-L01 preparation adapted from nxus-licensing commit
`85620733f52cba77e93aca8402e4aad63179a501`,
`internal/runbooks/internal-pro-linux-preview.md`. Public draft covers no-fee
recipient-bound developer login/activate/status/sync, finite expiry, seat and
recovery behavior and explicit GA grant continuity. Grant values, support owner,
real positive activation and installed verifier proof remain pending. No leased
CI/QA path or internal administrative fields were exported.

Qualified draft integration: SDK annotation source
`53be7866533b84bd3420490614f21a4f59904f12`, preview source SHA-256
`9a2b0b840d3d435cb5c562d899b4ea82717127ec192217299191d29ab45bfe08`;
archive source `5e142106f47281f413f2417f8d7461086de3e4dc`, run `36928672954`,
artifact `11194753051`, tar SHA-256
`d21601277aba5c28219c3bcee89a420273e33173ef8bfd8aafc7635b80d28bb6`.
The archive does not contain the later annotation. Export hash verification,
production build, preview isolation checks and diff review passed. Measured
Linux Mint 22.3/Ubuntu Noble x86_64 glibc 2.39 is a qualification baseline,
not general distribution support. Public export omits private commit/run IDs.
Real grant/activation, secure recipient parameter delivery, support/renewal
owner, prerelease download destination and effective future-tag guards remain
pending; deployment and PRE-D01 acceptance remain unresolved.

Validation: `npm run astro check`, `npm run build`,
`node scripts/check-preview-docs.mjs` and `git diff --check` passed on 2026-10-01.
The build reports `v1.0.5 (latest)` and the regression check verifies current
source invariance, preview canonical/banner/noindex/search behavior, sitemap and
LLM exclusions, and the current installation link. No public deployment occurred.
