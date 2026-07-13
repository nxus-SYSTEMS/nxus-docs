# W519 Private D1 Agent Action Gate Buyer/Developer Journey

Private/no-deploy Docs receiver artifact for RB-008 /
`NXUSKIT-V2-MEGA-20260605`, Docs W519, wave W519 of estimated W426-W492.

This buyer/developer journey consumes the Examples W518 executable proof truth
and turns it into a clear private evaluator path: understand the agent-action
problem, run or review the clean local proof, inspect the expected outcomes,
inspect evidence and receipt refs, understand limitations, and route a
qualified conversation into an Agent Action Gate Sprint or design-partner
conversation. It is not routed docs copy and is not public launch copy.

## Source Evidence

Examples proof:

- Examples W518 marker:
  `READY_EXAMPLES_W518_PRIVATE_EXECUTABLE_D1_AGENT_ACTION_GATE_EVIDENCE_PROOF`
- Examples W518 checkpoint:
  `c0ad8cf9cb29ac529e41e024004a5e728c07cd8f`
- Examples W518 branch:
  `codex/v2-private-executable-d1-agent-action-gate-w518-20260713`
- W518 proof package:
  `internal/preview/v2-roadmap-integration/w518-private-executable-d1-agent-action-gate-evidence-proof`
- W518 posture:
  private executable clean local proof, source-visible, using bounded synthetic
  support-playbook fixture data only.

Docs context:

- Docs W509 private public/private SDK surface taxonomy remains active for
  public/private surface boundaries.
- Demo delivery posture remains sandbox-first: Codespaces/devcontainer is the
  near-term default for D1, with clean local checkout also acceptable for a
  private evaluator who can inspect source and fixture data.

## No Public Authority Opened

Docs W519 is private/no-deploy and non-routed. It does not authorize routed
Docs pages, generated docs publication, public sync, deploy, public website
copy, public API/schema/CLI/wrapper availability, package/release/changelog
movement, public demo publication, hosted/public execution, Product Catalog/
Odoo mutation, live entitlement issuance, signing or issuer-secret handling,
production credential handling, customer/production data, provider registry,
runtime-provider behavior, support/compliance/security guarantee, downstream
public publication, or W561+ work.

The safe output is a private buyer/developer journey over the W518 proof. It
may guide an internal reviewer, sales engineer, or design-partner conversation,
but it is not public documentation.

## Evaluator Journey

### 1. Problem

Consequential AI agent actions need a gate before side effects. A useful
evaluator path should show more than a conceptual diagram: it should show a
typed action request, actor/context, consequence, policy input, evidence refs,
receipt refs, and gate refs that produce a deterministic decision before an
agent takes the next action.

The W518 D1 Agent Action Gate proof frames this as a support-playbook action
gate. The evaluator should be able to ask:

- What action is the agent trying to take?
- What consequence is attached to that action?
- What evidence is required before the action may proceed?
- What decision did the gate make?
- What receipt or review packet can a human inspect?

### 2. Run/Review The Private Proof

Preferred private evaluator path:

1. Open in Codespaces/devcontainer from the official org repo at the W518
   commit pin.
2. Inspect source/provenance and run with bounded fixtures.
3. Run the private W518 proof package using the W518 README instructions.
4. Inspect `summary.json`, the `evidence` directory, and the `receipts`
   directory in the local output folder.
5. Run the W518 validator against the local output.

Clean local checkout path:

- use a clean checkout at Examples checkpoint
  `c0ad8cf9cb29ac529e41e024004a5e728c07cd8f`;
- run the package from the repo-relative W518 proof package path above;
- use the expected-output fixture from the W518 package;
- write proof output to a caller-provided local scratch directory;
- do not use arbitrary uploads, secrets, customer/source data, production
  credentials, hosted execution, or live entitlement services.

Sandbox-first controls:

- official org repo;
- commit pin;
- expected-output fixture;
- bounded fixtures;
- no arbitrary uploads;
- no secrets;
- no customer/production data;
- binary packages are gated-later behind signing, provenance, checksum,
  release, and publication authority, or sales-room/private lanes.

### 3. Expected Outcomes

The evaluator should see exactly three deterministic outcomes:

| Case | Expected decision | What it demonstrates |
| --- | --- | --- |
| `d1-support-reply-safe` | `allow` | A bounded support reply can proceed when required evidence and closed-gate refs are present. |
| `d1-account-export-blocked` | `deny` | An account export request is blocked when it would cross the fixture boundary and external-access constraints. |
| `d1-service-credit-review` | `review_required` | A discretionary service-credit action abstains and prepares a human-review path instead of pretending the agent can decide alone. |

The compact outcome statement is: allow, deny, and review_required.

### 4. Evidence And Receipts

The W518 clean-local proof emits inspectable private evidence JSON, private
receipt JSON, and `summary.json`. The output includes evidence refs and receipt
refs for each case, plus the proof-level result that
`human_review_case=d1-service-credit-review` and
`negative_cases_fail_closed=True`.

What the evaluator should inspect:

- `summary.json` for the proof summary and deterministic case outcomes;
- `evidence` files for the private evidence refs used by the policy input;
- `receipts` files for decision receipts that can be reviewed after the gate;
- the `d1-service-credit-review` human-review path, which shows abstention and
  handoff rather than unauthorized action.

This is the core buyer/developer signal: the proof is not only an allow/deny
demo. It shows that a medium-consequence action can produce a review packet
instead of bypassing a human.

### 5. Limitations

This journey is private/local/source-visible and uses bounded fixture data. It
does not use hosted/public execution, customer/production data, arbitrary
uploads, secrets, live entitlement, signing, production credentials, customer
records, public package assets, or live Product Catalog/Odoo state.

Closed claims and gates:

- no hosted/public execution;
- no customer/production data;
- no live entitlement;
- no signing or issuer-secret handling;
- no public release/package/publication;
- no public API/schema/CLI/wrapper availability;
- no support/compliance/security guarantee;
- no Product Catalog/Odoo mutation;
- no production credential handling;
- no provider registry or runtime-provider behavior;
- no downstream public publication;
- no W561+ work.

The proof supports a private evaluator conversation. It does not make a public
availability claim, public pricing claim, public support claim, public
compliance claim, public security claim, or public SDK surface claim.

### 6. Paid Next Step

The natural private commercial next step is an Agent Action Gate Sprint or a
design-partner conversation. Keep this in internal commercial context only:

- use the W518 proof as the source-visible anchor for why the sprint matters;
- ask the buyer to identify one consequential agent action they want gated
  before side effects;
- map the action to required evidence, receipt refs, human-review rules, and
  closed gates;
- define the smallest private proof scope using synthetic or customer-approved
  non-production data only;
- no unsupported public pricing and no availability claim.

The sprint framing should sell an executable path from risk to evidence to
review, not a binary download or a source-less demo.

## Publication Gates

Before any public Docs, Website, Examples, Celerat/Plugins, SDK, Licensing,
release-note, package metadata, or request-access surface may use this journey
externally, Manager/Operator should require:

1. exact upstream checkpoints for W518-or-later proof and Docs W519-or-later
   journey;
2. confirmation that public/private SDK surface classification has stabilized;
3. approved customer-facing phrasing for the action-gate problem, proof path,
   evidence/receipt refs, human-review path, and paid next step;
4. source and built-output scans proving no private wave refs, W518 checkpoint
   refs, W518 package paths, private case ids, public API/schema/CLI/wrapper
   promises, hosted execution claims, release/package/publication claims,
   Product Catalog/Odoo production claims, support/compliance/security claims,
   customer data claims, or binary-first demo language leaks;
5. sandbox-first delivery plan with official org repo, commit pin,
   expected-output fixture, bounded fixtures, no arbitrary uploads, no secrets,
   no customer/source data, and checksum/provenance where applicable;
6. explicit publication/deploy authority and rollback plan.

## Options And Recommendation

Option A: use W519 privately as the current D1 Agent Action Gate
buyer/developer journey over W518 proof.

- Recommended now.
- Gives evaluators a clear problem-to-proof-to-next-step path.
- Preserves all publication, release, runtime, entitlement, support, and W561+
  gates.

Option B: request a later no-deploy routed candidate after SDK/public surface
classification and demo delivery posture are approved for exact customer-facing
copy.

- Useful only if Manager wants public Docs copy staged for review.
- Must remain sandbox-first and source-visible.
- Must not lead with binary packages or source-less executables.

Option C: request public publication.

- Not authorized by W519.
- Requires explicit publication authority, public wording approval, public
  surface scans, release/provenance decisions, and rollback plan.

Recommendation: choose Option A. Treat this as the private buyer/developer
journey that connects D1 proof evidence to an Agent Action Gate Sprint or
design-partner conversation.

## Validation

Run from the repository root:

```bash
node --check specs/519-private-d1-agent-action-gate-buyer-developer-journey/validate-w519-d1-agent-action-gate-journey.mjs
node specs/519-private-d1-agent-action-gate-buyer-developer-journey/validate-w519-d1-agent-action-gate-journey.mjs
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/519-private-d1-agent-action-gate-buyer-developer-journey/validate-w519-d1-agent-action-gate-journey.mjs --dist
git diff --check
git diff --cached --check
```

The validator checks this private journey, routed docs source, and optional
built output for W518 provenance, deterministic outcomes, inspectable evidence
and receipt refs, human-review path, fail-closed negative posture,
sandbox-first controls, limitations, paid-next-step wording, placeholder
tokens, local path evidence, private repo names, and secret-like tokens.
