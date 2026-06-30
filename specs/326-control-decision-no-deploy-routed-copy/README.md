# W326 Control Decision No-deploy Routed Copy Candidate

Private Docs receiver validation notes for RB-008 /
`NXUSKIT-V2-MEGA-20260605`, Docs W326, RC wave 150 of revised estimated
168-196.

## Purpose

W326 converts the sanitized W317/W322 public-safe candidate copy into the
smallest no-deploy routed Docs candidate. The routed copy is conceptual and
conservative: it explains local decisions before consequence boundaries without
naming private class, stage, schema, package, provider-registry, support, or
compliance authority.

## Changed Surfaces

- `src/content/docs/nxuskit/concepts/local-control-decisions.md`
- `src/content/docs/nxuskit/concepts/architecture.md`
- `specs/326-control-decision-no-deploy-routed-copy/validate-w326-control-decision-routed-copy.mjs`

No deployment, public sync, generated public output publication, release/tag
work, provider registry, runtime/provider execution, support/compliance claim,
SDK edit, Examples edit, Website edit, Celerat edit, or Peeler edit is part of
this packet.

## Validation Intent

The W326 helper validates that:

- the routed copy exists and is linked from the architecture concepts page;
- the routed copy keeps W322's conceptual vocabulary;
- source and optional built output do not introduce class-like private names,
  raw stage labels, private entitlement identifiers, provider-registry-ready,
  runtime-ready, package-ready, release-ready, support-ready, compliance-ready,
  public API, or public schema authority;
- committed W326/W322 materials do not carry local absolute path evidence.

## Commands

Run from the repository root:

```bash
node --check specs/326-control-decision-no-deploy-routed-copy/validate-w326-control-decision-routed-copy.mjs
node specs/326-control-decision-no-deploy-routed-copy/validate-w326-control-decision-routed-copy.mjs
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/326-control-decision-no-deploy-routed-copy/validate-w326-control-decision-routed-copy.mjs --dist
```

## Hard Gates

This is a no-deploy implementation candidate. Publication remains blocked until
Manager/Operator approval explicitly opens deployment to `docs.nxus.systems` or
another public surface.
