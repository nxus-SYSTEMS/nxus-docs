# W376 DataFusion Async-tool No-deploy Boundary

Private/no-deploy Docs receiver packet for RB-008 /
`NXUSKIT-V2-MEGA-20260605`, Docs W376, RC wave 200 of revised estimated
250-302.

This packet defines public-safe wording boundaries for DataFusion runtime
adapter scope and Pro/Internal async tool invocation. It does not edit routed
docs, generate public docs, deploy, publish, or authorize public claims. It
makes no public support or compliance claim.

## Source Evidence

Manager checkpoint:

- DevOps branch: `codex/v200-pro-internal-scope-expansion-20260702`
- DevOps checkpoint: `3a1379a46c56c4134cfffa0b41c88ac6bfa53b8c`
- Manager scope estimate:
  RC scope expanded by 54-86 waves, with current estimate updated to RC wave
  200 of 250-302.

Requirement inputs consumed:

- `nxuskit-sdk-v200-pro-internal-scope-expansion-addendum-20260702.md`
- `nxuskit-sdk-v200-async-tool-invocation-pro-internal-requirements-20260702.md`
- `nxuskit-sdk-v200-datafusion-runtime-adapter-process-requirements-20260702.md`

The addendum keeps public API/schema/CLI/wrapper exposure, public docs claims,
runtime provider/provider-registry claims, DataFusion SELECT-triggered side
effects, release/package work, support/compliance claims, callbacks/webhooks,
and public projection authority closed. Boundary phrase:
DataFusion SELECT-triggered side effects.

## No Public Authority Opened

Docs W376 is private/non-routed. It does not make any public v2.0.0 support,
runtime, provider-registry, release, package, public API, public schema,
callback, webhook, DataFusion CE runtime, or async runtime-dispatch promise.

The safe output from this wave is a private Docs boundary and validation packet
that future Docs, Website, Celerat/Plugins, Examples, Licensing, and SDK lanes
may use when they need consistent copy guardrails. It is not a public launch
artifact.

## Safe-now Conceptual Wording

Safe now means safe for private copy review, no-deploy planning, and later
gated candidate drafting. It does not mean safe to publish.

| Topic | Safe wording class | Boundary |
| --- | --- | --- |
| CE ordinary tool/function calling | CE ordinary tool/function calling remains distinct from Pro/Internal async invocation. Ordinary host-loop tool calling can be discussed only where existing provider capability evidence already supports it. | Do not reclassify CE ordinary tool calling as managed async jobs, background execution, callbacks, webhooks, provider-registry dispatch, or runtime-provider execution. |
| Pro/Internal async invocation | Async tool invocation may be framed privately as accepted/result/ref semantics with operation references, bounded result references, private event sinks, cancellation, budget, entitlement, deployment-token, and receipt posture. | Do not claim public API, public schema, CLI, provider registry, runtime dispatch, release/package, support/compliance, public event, callback, or webhook availability. Public docs do not promise webhooks. |
| DataFusion runtime adapter | DataFusion gateway and reverse table-provider execution are Pro/Internal runtime-adapter scope. | Do not claim CE DataFusion runtime, Arrow runtime, SQL execution, live gateway execution, reverse table-provider execution, or bundled DataFusion/Arrow dependencies. |
| CE DataFusion posture | CE may carry refs, readiness, validation, fixtures, negative-boundary checks, declaration-only posture, missing-plugin outcomes, entitlement-denied outcomes, and public-safe denial vocabulary. | CE must not link DataFusion. CE must not link Arrow runtime. CE should not expose SQL/query execution as a live runtime surface. |
| Capability Catalog language | Future copy may refer to Capability Catalog and runtime adapter product concepts when mapped by later source authority. | Do not expose private topology, ProviderChannel, ToolCatalog, private plugin paths, runtime dispatch wiring, or provider registry readiness. |
| DataFusion query safety | DataFusion SELECT queries over engine surfaces must not trigger hidden tool dispatch, LLM calls, CLIPS rule firing, BN inference, solver execution, file writes, network calls, or state mutation. | If tool work is needed, describe it privately as a separate nxusKit operation with refs, policy, budget, entitlement, trace, and receipts. |

## Boundary Rules

- CE builds keep existing tool/function calling behavior.
- CE may validate declarations, refs, readiness, missing-plugin posture,
  entitlement-denied posture, and negative boundary fixtures.
- CE must not link DataFusion.
- CE must not link Arrow runtime.
- DataFusion gateway execution is Pro/Internal.
- Reverse table-provider execution is Pro/Internal.
- SELECT queries over DataFusion surfaces must not trigger hidden tool dispatch.
- Async accepted states and terminal results should use operation references
  and bounded result references rather than unbounded payloads.
- Private event sinks may support lifecycle observation, but public docs do not
  promise webhooks, callbacks, managed queues, EventBus, Zenoh, or distributed
  transport.
- DataFusion-related workflows that need tool work must represent that work as
  a separate nxusKit operation.

## Denied Claim Terms

The following wording classes are denied for routed public docs, public sync,
generated public docs, public Website copy, release notes, provider registry,
package metadata, and public schema/API surfaces until a later explicit gate
opens them:

- CE DataFusion runtime, CE Arrow runtime, CE SQL execution, or CE table-provider
  execution;
- DataFusion gateway execution in CE;
- reverse table-provider execution in CE;
- DataFusion SELECT-triggered tools, LLM calls, CLIPS rule firing, BN
  inference, solver execution, file writes, network calls, or state mutation;
- async runtime dispatch, managed background tool jobs, managed queues,
  customer-facing callbacks, or customer-facing webhooks;
- public callback or webhook vocabulary for async invocation lifecycle events;
- provider registry, runtime provider, public API, public schema, public CLI,
  wrapper, release, or package authority;
- support, compliance, SLA, safety, legal, medical, entitlement, or customer
  outcome guarantees;
- private topology, private plugin paths, local filesystem paths, unbounded
  result bodies, Arrow row payloads, DataFusion plan bodies, raw provider error
  bodies, or customer records.

## Publication Gates

Before any public Docs, Website, release-note, Celerat/Plugins, Examples, or
SDK surface may use this wording externally, Manager/Operator should require:

1. exact SDK intake and DataFusion/async checkpoints after the first receiver
   callbacks sharpen scope;
2. final naming decisions for async invocation DTOs, statuses, operation refs,
   result refs, event sinks, DataFusion runtime domains, gateway posture, and
   reverse table-provider posture;
3. explicit CE/public/private classification for every DataFusion and async
   tool-invocation surface;
4. confirmation of any future `DataViewRef` or `WorkingSetRef` decision as
   absent, declaration-only without live runtime handle, or deferred;
5. source and built-output scans for denied async, DataFusion, callback,
   webhook, provider-registry, runtime, package, release, support, compliance,
   public API, and public schema claims;
6. docs-version and public-leak checks;
7. Astro check/build if Docs routes change;
8. corrected interactive Claude/tmux QA on the exact public diff;
9. explicit no-deploy candidate approval or explicit publication/deploy
   approval, plus rollback instructions.

## Options And Recommendation

Option A: keep W376 private and use it as the Docs boundary reference for the
first-round receiver callbacks.

- Lowest risk.
- Recommended now.
- Aligns with the addendum's first-round private planning/readiness strategy.

Option B: request a later no-deploy routed Docs candidate after SDK, Licensing,
Examples, Celerat/Plugins, Website, and Peeler first callbacks converge.

- Useful only if Manager wants customer-facing wording staged before launch.
- Must remain no-deploy, source/dist-validator guarded, and conservative.
- Requires final CE/public/private classification.

Option C: request coordinated public Docs plus Website wording.

- Not safe from W376 alone.
- Requires publication authority, public terminology approval, rollback plan,
  and support/account/customer-communication review.

Recommendation: choose Option A now. Treat W376 as private boundary evidence
until SDK and cross-receiver checkpoints prove exact names, classifications,
and safe customer-facing terminology.

## Validation

Run from the repository root:

```bash
node --check specs/376-datafusion-async-tool-no-deploy-boundary/validate-w376-datafusion-async-boundary.mjs
node specs/376-datafusion-async-tool-no-deploy-boundary/validate-w376-datafusion-async-boundary.mjs
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/376-datafusion-async-tool-no-deploy-boundary/validate-w376-datafusion-async-boundary.mjs --dist
git diff --check
git diff --cached --check
```

The validator checks this private packet, current public docs source, and
optional built output for required source references, safe-now conceptual
classes, CE/Pro/Internal boundary rules, denied public authority terms,
placeholder tokens, local path evidence, private repo names, and secret-like
tokens.
