# W428 Production-Ready Wording Scrub

Run: `NXUSKIT-V2-MEGA-20260605`
Wave: Docs W428 production-ready wording public-safe scrub
Branch: `codex/rb008-docs-w428-production-ready-scrub-20260707`

This packet records the public-docs wording scrub for overbroad
`production-ready` / `production ready` / `prod-ready` language. The scope is
public routed docs source plus generated docs output checks. Private claim
boundary specs intentionally keep forbidden phrases in negative fixtures and
denial tables; those are not public product claims.

## Classification

| Surface | Decision | Replacement |
| --- | --- | --- |
| Archived examples index descriptions for v0.9.4, v1.0.0, and v1.0.1 | Public routed metadata; overbroad as a blanket release-quality claim. | `Production-quality nxusKit examples...` because the page body already frames the catalog as production-quality example code. |
| Archived Ruler example tagline | Public routed example copy; `production-ready expert system code` overclaims support/runtime readiness. | `validated CLIPS rule code`. |
| Archived BN/Solver/CLIPS pipeline tagline | Public routed example copy; `production-ready pipeline` overclaims operational readiness. | `repeatable pipeline`. |
| Archived local LLM provider maturity tables | Public routed provider page; `Production-ready` is too absolute for nxus.SYSTEMS support/compliance posture. | `Mature local backend` in status tables and `Mature` in maturity comparisons. |
| Private W201-W205 specs and helper fixtures | Intentional negative/denial vocabulary. | Preserve as private validator evidence. |
| `scripts/sync-local-docs.mjs` trust scrub | Existing conservative generation guard for future examples sync. | Preserve; it already downgrades generated examples copy to runnable/validated/repeatable wording. |

## Validation Intent

`validate-w428-production-ready-scrub.mjs` fails if public routed docs source,
generated HTML, or hosted AI indexes contain overbroad production-ready
variants. It intentionally does not scan private `specs/` or sync script guard
phrases because those use the terms as denied examples or explicit
replacement triggers.

## PoR Notes

- Use `production-quality` only where the claim is about example-code quality
  and nearby content explains the examples are source-backed, runnable, or
  validated.
- Prefer precise non-claim wording such as `validated`, `runnable`,
  `repeatable`, `source-backed`, or `Mature local backend` when the subject is a
  provider, runtime path, pipeline, or expert-system artifact.
- Do not use `production-ready` as public docs copy for support, compliance,
  provider maturity, runtime readiness, release readiness, or operational
  guarantees.
