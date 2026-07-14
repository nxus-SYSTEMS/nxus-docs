# W522 Private W521 SDK-Derived Agent Action Gate Journey Refresh

Private/no-deploy Docs receiver artifact for RB-008 /
`NXUSKIT-V2-MEGA-20260605`, Docs W522, wave W522 of estimated W426-W492.

This buyer/developer journey refreshes the Docs W519 private D1 Agent Action
Gate buyer/developer journey after Examples W521. W519 remains useful prior
journey evidence over the W518 executable proof format. W522 makes W521 the
current private proof truth because W521 derives decisions from SDK W517 typed
facts instead of treating fixture expected outcomes as the decision source.

This is not routed Docs copy, public launch copy, release notes, public website
copy, or a public availability statement.

## Source Evidence

Current proof truth:

- Examples W521 marker:
  `READY_EXAMPLES_W521_PRIVATE_D1_AGENT_ACTION_GATE_SDK_DERIVED_PROOF_REFRESH`
- Examples W521 checkpoint:
  `adfc185fd2c411aa5956da377d5d8e9fa9e4fb3a`
- W521 proof package:
  `internal/preview/v2-roadmap-integration/w521-private-d1-agent-action-gate-sdk-derived-proof-refresh`
- W521 posture:
  private executable SDK-derived clean local proof refresh.

SDK derivation truth:

- SDK W517 checkpoint:
  `fc3d963f96bd51466d19baa5d626697f7da2eb26`
- SDK W517 branch:
  `codex/w517-semantic-agent-action-gate-derivation-20260713`
- SDK semantic gate ref:
  `private_semantic_agent_action_gate_derivation.w517.d1_support_playbook`
- W517 proof meaning:
  the private `runtime_discovery` semantic Agent Action Gate derivation
  consumes typed facts and derives `allow`, `deny`, or `review_required`.

Prior Docs and Examples evidence:

- Docs W519 private journey:
  `specs/519-private-d1-agent-action-gate-buyer-developer-journey`
- Examples W518 prior executable proof checkpoint:
  `c0ad8cf9cb29ac529e41e024004a5e728c07cd8f`
- W518 remains the prior executable proof-format increment. W521 supersedes
  W518's fixture-prescribed outcome limitation by proving SDK-derived decisions
  from typed facts.

## No Public Authority Opened

Docs W522 is private/no-deploy and non-routed. It does not authorize routed
Docs pages, generated docs publication, public sync, deploy, public website
copy, public API/schema/CLI/wrapper availability, package/release/changelog
movement, public demo publication, hosted/public execution, Product Catalog/
Odoo mutation, live entitlement issuance, signing or issuer-secret handling,
production credential handling, customer/production data, provider registry,
runtime-provider behavior, support/compliance/security guarantee, downstream
public publication, or W561+ work.

The safe output is a private buyer/developer journey over W521 and SDK W517.
It may guide an internal reviewer, sales engineer, or design-partner
conversation, but it is not public documentation.

## Evaluator Journey

### 1. Problem

Consequential AI agent actions need a gate before side effects. The buyer
question is not only whether an example can print three expected labels. The
useful evaluator question is whether a source-visible proof can show a typed
action request, actor context, consequence, policy input, evidence refs,
receipt refs, and gate refs that derive a decision before an agent takes the
next action.

W521 improves the journey from W519 by grounding the proof in SDK W517 semantic
derivation. The evaluator should be able to ask:

- What action is the agent trying to take?
- What consequence is attached to that action?
- What evidence and receipt refs are ready before the gate decides?
- Did the SDK-derived gate derive the decision from typed facts?
- Was any expected-output assertion used as a decision source?
- What receipt or review packet can a human inspect?

### 2. Run/Review The SDK-Derived Private Proof

Preferred private evaluator path:

1. Open in Codespaces/devcontainer from the official org repo at the W521
   checkpoint.
2. Inspect W521 source/provenance and the SDK W517 checkpoint reference.
3. Run the private W521 proof package using the W521 README instructions.
4. Provide a local SDK worktree at SDK W517 when running the proof.
5. Inspect `summary.json`, `sdk_w517_verification.json`, the `evidence`
   directory, the `receipts` directory, and the `negative_cases` directory in
   the caller-provided local output folder.
6. Run the W521 validator against the local output.

Clean local checkout path:

- use a clean Examples checkout at W521 checkpoint
  `adfc185fd2c411aa5956da377d5d8e9fa9e4fb3a`;
- use a clean SDK checkout at SDK W517 checkpoint
  `fc3d963f96bd51466d19baa5d626697f7da2eb26`;
- run the repo-relative W521 proof package path above;
- write proof output to a caller-provided local scratch directory;
- do not use arbitrary uploads, secrets, customer/source data, production
  credentials, hosted execution, live entitlement services, signing keys, or
  public release artifacts.

Sandbox-first controls:

- official org repo;
- checkpoint pin;
- source-visible proof code;
- bounded fixture data;
- no arbitrary uploads;
- no secrets;
- no customer/production data;
- binary packages are gated-later behind signing, provenance, checksum,
  release, and publication authority, or private/sales-room lanes.

### 3. SDK-Derived Decision Source

W521's main buyer/developer improvement is decision-source integrity.

The decision source is
`sdk_w517_semantic_derivation_from_typed_facts`. The proof cases carry typed
facts for `action_request`, `actor_context`, `consequence`, `policy_input`,
`evidence_refs`, `receipt_refs`, and `gate_refs`. SDK W517 derives the gate
decision from those facts and policy/consequence predicates.

Expected decisions remain in W521 only as validation-only assertions. They are
not the decision source. `expected_outcome` must not appear in proof cases, and
proof cases must not carry `expected_decision`, `outcome_override`, or similar
outcome override fields.
The W521 negative coverage includes fixture-expected-outcome substitution so a
mutated assertion does not become decision authority.

This distinction is the core refresh over W519:

- W519/W518 proved an executable private proof format and private evidence/
  receipt artifacts.
- W522/W521 preserves that journey and moves the proof posture to
  SDK-derived typed-fact decisions.

### 4. Expected Outcomes

The evaluator should still see exactly three outcomes, now derived from SDK
W517 typed facts:

| Case | SDK-derived decision | What it demonstrates |
| --- | --- | --- |
| `d1-support-reply-safe` | `allow` | A bounded support reply can proceed when typed facts show low consequence, required evidence refs, receipt refs, and closed-gate refs. |
| `d1-account-export-blocked` | `deny` | An account export request is blocked when typed facts show an export consequence and public/export bypass remains denied. |
| `d1-service-credit-review` | `review_required` | A service-credit action abstains and creates a private human-review handoff instead of pretending the agent can decide alone. |

The compact outcome statement is: allow, deny, and review_required.

### 5. Evidence And Receipts

The W521 clean-local proof emits inspectable private evidence JSON, private
receipt JSON, `summary.json`, `sdk_w517_verification.json`, and per-case
negative case records. The output includes evidence refs and receipt refs for
each case. It also records that `decision_derived_from_typed_facts` is true,
`used_fixture_expected_outcomes_as_decision_source` is false, and
`negative_cases_fail_closed` is true.

What the evaluator should inspect:

- `summary.json` for the proof summary, decision source, case outcomes, and
  fail-closed negative posture;
- `sdk_w517_verification.json` for SDK W517 checkpoint/source/test/report
  verification;
- `evidence` files for private evidence refs used by the policy input;
- `receipts` files for decision receipts that can be reviewed after the gate;
- `negative_cases` files for fail-closed coverage, including
  fixture-expected-outcome substitution and public-claim posture.

### 6. Human Review Path

The `d1-service-credit-review` case derives `review_required` and carries the
private handoff ref `handoff.d1-service-credit-review.private_human_review`.
The journey should frame this as abstain until private human review, not as an
automated permission to issue a credit or mutate a customer account.

This is the strongest buyer/developer signal in W521: the proof demonstrates
that a medium-consequence action can produce a review path while the proof
stays private, bounded, source-visible, and synthetic.

### 7. Limitations

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
compliance claim, public security claim, public SDK surface claim, production
deployment claim, or customer-availability claim.

### 8. Paid Next Step

The natural private commercial next step is an Agent Action Gate Sprint or a
design-partner conversation. Keep this in internal commercial context only:

- use the W521 SDK-derived proof as the source-visible anchor for why the
  sprint matters;
- ask the buyer to identify one consequential agent action they want gated
  before side effects;
- map the action to typed facts, evidence refs, receipt refs, human-review
  rules, and closed gates;
- define the smallest private proof scope using synthetic or customer-approved
  non-production data only;
- no unsupported public pricing and no availability claim.

The sprint framing should sell an executable path from risk to SDK-derived
decision evidence to review, not a binary download or a source-less demo.

## Publication Gates

Before any public Docs, Website, Examples, Celerat/Plugins, SDK, Licensing,
release-note, package metadata, or request-access surface may use this journey
externally, Manager/Operator should require:

1. exact upstream checkpoints for W521-or-later proof, SDK W517-or-later
   derivation evidence, and Docs W522-or-later journey;
2. confirmation that public/private SDK surface classification has stabilized;
3. approved customer-facing phrasing for the action-gate problem,
   SDK-derived typed-fact proof path, evidence/receipt refs, human-review
   path, and paid next step;
4. source and built-output scans proving no private wave refs, W521 or SDK
   W517 checkpoint refs, W521 package paths, private case ids, semantic gate
   refs, public API/schema/CLI/wrapper promises, hosted execution claims,
   release/package/publication claims, Product Catalog/Odoo production claims,
   support/compliance/security claims, customer data claims, or binary-first
   demo language leaks;
5. sandbox-first delivery plan with official org repo, checkpoint pin,
   source-visible proof code, bounded fixtures, no arbitrary uploads, no
   secrets, no customer/source data, and checksum/provenance where applicable;
6. explicit publication/deploy authority and rollback plan.

## Options And Recommendation

Option A: use W522 privately as the current D1 Agent Action Gate
buyer/developer journey over W521 and SDK W517.

- Recommended now.
- Gives evaluators a clear problem-to-SDK-derived-proof-to-next-step path.
- Preserves W519 as prior journey evidence.
- Preserves all publication, release, runtime, entitlement, support, and W561+
  gates.

Option B: request a later no-deploy routed candidate after SDK/public surface
classification and demo delivery posture are approved for exact customer-facing
copy.

- Useful only if Manager wants public Docs copy staged for review.
- Must remain sandbox-first and source-visible.
- Must not lead with binary packages or source-less executables.

Option C: request public publication.

- Not authorized by W522.
- Requires explicit publication authority, public wording approval, public
  surface scans, release/provenance decisions, and rollback plan.

Recommendation: choose Option A. Treat this as the private buyer/developer
journey that connects W521 SDK-derived proof evidence to an Agent Action Gate
Sprint or design-partner conversation.

## Validation

Run from the repository root:

```bash
node --check specs/522-private-w521-sdk-derived-agent-action-gate-journey-refresh/validate-w522-w521-sdk-derived-journey.mjs
node specs/522-private-w521-sdk-derived-agent-action-gate-journey-refresh/validate-w522-w521-sdk-derived-journey.mjs
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/522-private-w521-sdk-derived-agent-action-gate-journey-refresh/validate-w522-w521-sdk-derived-journey.mjs --dist
git diff --check
git diff --cached --check
```

The validator checks this private journey, routed docs source, and optional
built output for W521 provenance, SDK W517 provenance, the W519 prior journey
link, SDK-derived typed-fact decision wording, deterministic outcomes,
inspectable evidence and receipt refs, human-review path, fail-closed negative
posture, limitations, paid-next-step wording, placeholder tokens, local path
evidence, private repo names, and secret-like tokens.
