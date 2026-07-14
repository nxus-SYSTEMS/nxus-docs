# W526 Private W524/W525 Agent Action Gate Clean-Checkout Journey Refresh

Private/no-deploy Docs receiver artifact for RB-008 /
`NXUSKIT-V2-MEGA-20260605`, Docs W526, wave W526 of estimated W426-W492.

This D1 Agent Action Gate buyer/developer journey refreshes the Docs W522 private Agent Action Gate
journey with the Examples W535 update to the W521/W524 clean-checkout developer experience
proof and the SDK W535 normalized RC Core action-gate primitive.
DevOps W525 remains prior private release-integration posture; W535 is the
current private proof-truth update for this journey.

This is not routed Docs copy, public launch copy, release notes, public website
copy, or a public availability statement.

## Source Evidence

Private proof lineage:

- SDK W535 normalized RC Core checkpoint:
  `51ed2c4e64445f7170775804d4d98feea5ba6acd`
- SDK W535 RC Core base:
  `c1574cdfd1eefa9f8167c52bb3f384678fb12126`
- SDK W535 branch:
  `codex/w535-sdk-rc-core-normalization-v2base-20260714`
- SDK W535 meaning:
  private reusable action-gate primitive over generic request, decision,
  evidence, receipt, policy fact, and review-handoff models, with D1
  support-playbook behavior layered above it.
- Examples W535 checkpoint:
  `e0cbf0736d5e65f37b1a91cd9db94af8d845154d`
- Examples W535 branch:
  `codex/w535-examples-sdk-normalized-rc-core-20260714`
- Examples W521 package:
  `internal/preview/v2-roadmap-integration/w521-private-d1-agent-action-gate-sdk-derived-proof-refresh`
- Examples W521 meaning after W535:
  SDK RC Core-derived private D1 proof refresh, using
  `sdk_w535_rc_core_action_gate_from_typed_facts` and keeping expected
  decisions as validation assertions only.
- Examples W524 marker:
  `READY_EXAMPLES_W524_PRIVATE_D1_AGENT_ACTION_GATE_CLEAN_CHECKOUT_DX_SMOKE`
- Examples W524 package:
  `internal/preview/v2-roadmap-integration/w524-private-d1-agent-action-gate-clean-checkout-dx-smoke`
- Docs W522 prior journey:
  `d3144caf1a1762cd3e93d7a337f01f111897b1ae`
- Docs W522 path:
  `specs/522-private-w521-sdk-derived-agent-action-gate-journey-refresh`
- DevOps W525 checkpoint:
  `169c654`
- DevOps W525 marker:
  `READY_DEVOPS_W525_PRIVATE_RELEASE_INTEGRATION_REVIEW_OVER_W524`
- DevOps W525 evidence record:
  `.codex/rb008/NXUSKIT-V2-MEGA-20260605/c9-w525-private-release-integration-review-over-w524.md`
- Licensing W522 claim-boundary baseline:
  `463d1db55a364e89494ca1d2e24e8461d2c226e3`

Lineage statement:

```text
SDK W535 -> Examples W535 W521/W524 refresh -> DevOps W525 prior posture -> Docs W535 update
```

Examples W535 is the current private clean-checkout/source-visible developer
experience proof truth for the W521/W524 package set. W525 remains prior private
release-integration review posture. This W535 Docs update keeps the W526
buyer/developer journey usable for private evaluator and design-partner
conversations while aligning it to the normalized SDK RC Core checkpoint.

## No Public Authority Opened

Docs W526 is private/no-deploy and non-routed. It does not authorize routed
Docs pages, generated docs publication, public sync, deploy, public website
copy, public API/schema/CLI/wrapper availability, package/release/changelog
movement, public demo publication, hosted/public execution, Product Catalog/
Odoo mutation, live entitlement issuance, signing or issuer-secret handling,
production credential handling, customer/production data, provider registry,
runtime-provider behavior, support/compliance/security guarantee, downstream
public publication, or W561+ work.

The safe output is a private buyer/developer journey over W524 and W525. It
may guide an internal reviewer, sales engineer, or design-partner conversation,
but it is not public documentation.

## Evaluator Journey

### 1. Problem And Audience

Consequential AI agent actions need a gate before side effects. W522 explained
the SDK-derived proof truth. W526 should make that proof easier for a buyer,
developer evaluator, sales engineer, or design partner to try privately from a
clean checkout.

The evaluator path should answer:

- What action is the agent trying to take?
- Which typed facts drive the gate decision?
- Can a clean checkout run a source-visible proof without a dependency install?
- Do the same three decisions still derive from SDK W535 through W521?
- Where are the private evidence refs, receipt refs, compact summary output,
  and human-review handoff?
- What does private release-integration readiness mean, and what gates remain
  closed?

### 2. Private Proof Lineage

The proof chain is intentionally narrow:

1. SDK W535 provides the normalized private RC Core action-gate primitive.
2. Examples W535 refreshes W521 to use SDK W535 as semantic truth and derive
   decisions from typed facts.
3. Examples W535 refreshes W524 as a one-command clean-checkout developer
   experience smoke over that W521 proof.
4. DevOps W525 reviews W524 as current private release-integration evidence
   while keeping release, public, and production gates closed.
5. Docs W535 updates the W526 journey without turning it into public Docs copy.

This preserves the W522 distinction: expected decisions are validation
assertions, not decision authority. The current evaluator proof is W524 over
W521 over SDK W535 RC Core.

### 3. Run/Review The Clean-Checkout Smoke

Preferred private evaluator path:

1. Open a clean local checkout or source-visible Codespaces/devcontainer from
   the official org repo at the Examples W535 checkpoint.
2. Inspect the W535-updated W524 source/provenance, then inspect the W521
   package and SDK W535 checkpoint references.
3. Run the W524 one-command smoke using the W524 README instructions.
4. Provide a local SDK worktree at SDK W535 when running the smoke.
5. Keep all output in a caller-provided temporary scratch location outside the
   repository.
6. Inspect the compact summary output:
   `w524-clean-checkout-dx-smoke-summary.json`.
7. Inspect the wrapped W521 proof output, including `summary.json`,
   `sdk_rc_core_verification.json`, `evidence`, `receipts`, and
   `negative_cases`.
8. Run the W524 validator against the local output.

Clean-checkout DX meaning:

- one-command runner;
- source-visible proof code;
- clean local checkout friendly;
- no dependency install required;
- output outside the repo;
- five-minute-or-less intent, with a target duration of five minutes;
- no arbitrary uploads;
- no secrets;
- no customer/production data;
- no hosted/public execution.

### 4. Deterministic Outcomes

The evaluator should see the same three decisions, now through the W524
clean-checkout smoke over W521:

| Case | Decision | What W524 demonstrates |
| --- | --- | --- |
| `d1-support-reply-safe` | `allow` | The W524 smoke can invoke W521 and preserve the bounded support-reply allow decision. |
| `d1-account-export-blocked` | `deny` | The W524 smoke can invoke W521 and preserve the account-export denial. |
| `d1-service-credit-review` | `review_required` | The W524 smoke can invoke W521 and preserve the private human-review handoff path. |

The compact outcome statement is: allow, deny, and review_required.

### 5. Evidence, Receipts, And Summary Output

W524 emits `w524-clean-checkout-dx-smoke-summary.json`, then points back to the
wrapped W521 proof output. The evaluator should inspect:

- compact summary output for W524 marker, W521 checkpoint, SDK W535 checkpoint,
  decision source, case decisions, duration target, and closed gates;
- `summary.json` from the wrapped W521 proof for typed-fact decision source and
  case outcomes;
- `sdk_rc_core_verification.json` from the wrapped W521 proof for SDK W535
  verification;
- inspectable private evidence JSON files in `evidence`;
- private receipt JSON files in `receipts`;
- fail-closed negative case records in `negative_cases`;
- evidence refs and receipt refs for each case.

The key fields to keep visible in private review are
`sdk_w535_rc_core_action_gate_from_typed_facts`,
`negative_cases_fail_closed=true`, and the W524 summary pointer to W521
evidence and receipts.

### 6. Human Review Path

The `d1-service-credit-review` case preserves `review_required` and the private
handoff ref `handoff.d1-service-credit-review.private_human_review`.

The journey should frame this as abstain until human review, not as an
automated permission to issue a credit, mutate a customer account, use live
entitlement, or access Product Catalog/Odoo state.

### 7. Expected-Outcome Substitution Rejection

The W524 smoke must reject proof cases that try to turn expected outputs into
decision authority. W524 checks that W521 proof cases do not carry these fields:

- `expected_outcome` is rejected as proof-case decision authority.
- `expected_decision` is rejected as proof-case decision authority.
- `outcome_override` is rejected as proof-case decision authority.
- `decision_override` is rejected as proof-case decision authority.

Expected decisions remain validation assertions only. They are not decision
authority. This protects the buyer/developer journey from becoming a scripted
expected-output demo instead of a typed-fact derivation proof.

### 8. Private Release-Integration Meaning

DevOps W525 records the private release-integration posture over W524:

```text
PRIVATE_RELEASE_INTEGRATION_REVIEW_READY: true
CLEAN_CHECKOUT_DX_SMOKE_READY: true
COMMON_MERGED_RC_BRANCH_READY: false
PUBLIC_RELEASE_GO: false
PRODUCTION_GO: false
PACKAGE_RELEASE_GO: false
PUBLIC_DEFAULT_PROJECTION_GO: false
LIVE_LICENSING_GO: false
```

This means private review can use W524 as current C3/C9 developer-experience
proof evidence. The common merged RC branch is not ready and not claimed.
It does not mean public release, production promotion, packages, tags,
hosted execution, Odoo/Product Catalog mutation, live licensing, customer data,
or material support/compliance/security claims are authorized.

W525 is a private release-integration review, not a publication artifact.

### 9. Limitations

This journey is private/local/source-visible and uses bounded fixture data. It
does not use hosted/public execution, customer/production data, arbitrary
uploads, secrets, live entitlement, signing, production credentials, customer
records, public package assets, or live Product Catalog/Odoo state.

Closed claims and gates, aligned with the Licensing W522 claim-boundary
baseline:

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

### 10. Paid Next Step

The natural private commercial next step is an Agent Action Gate Sprint or a
design-partner conversation. Keep this in internal commercial context only:

- use the W524 clean-checkout smoke as the source-visible anchor for the
  conversation;
- show that the W524 wrapper invokes the W521 runner, runs the W521 validator,
  and verifies SDK W535 RC Core evidence through W521 output;
- ask the buyer to identify one consequential agent action they want gated
  before side effects;
- map the action to typed facts, evidence refs, receipt refs, human-review
  rules, and closed gates;
- define the smallest private proof scope using synthetic or customer-approved
  non-production data only;
- no unsupported public pricing and no availability claim.

The sprint framing should sell a clean-checkout path from risk to SDK-derived
decision evidence to review, not a binary download or a source-less demo.

## Publication Gates

Before any public Docs, Website, Examples, Celerat/Plugins, SDK, Licensing,
release-note, package metadata, or request-access surface may use this journey
externally, Manager/Operator should require:

1. exact upstream checkpoints for W524-or-later clean-checkout smoke,
   W521-or-later proof, SDK W535-or-later RC Core derivation evidence, DevOps
   W525-or-later release-integration review, Licensing W522-or-later
   claim-boundary review, and Docs W526-or-later journey;
2. confirmation that public/private SDK surface classification has stabilized;
3. approved customer-facing phrasing for the action-gate problem,
   clean-checkout proof path, SDK-derived typed-fact proof path,
   evidence/receipt refs, human-review path, release-review posture, and paid
   next step;
4. source and built-output scans proving no private wave refs, W524/W521/SDK
   W535 checkpoint refs, W524/W521 package paths, private case ids, public
   API/schema/CLI/wrapper promises, hosted execution claims,
   release/package/publication claims, Product Catalog/Odoo production claims,
   support/compliance/security claims, customer data claims, or binary-first
   demo language leaks;
5. sandbox-first delivery plan with official org repo, checkpoint pin,
   source-visible proof code, bounded fixtures, no arbitrary uploads, no
   secrets, no customer/source data, and checksum/provenance where applicable;
6. explicit publication/deploy authority and rollback plan.

## Options And Recommendation

Option A: use this W535-updated W526 packet privately as the current D1 Agent
Action Gate buyer/developer journey over the W535-normalized W521/W524 proof and
the W525 prior release-integration posture.

- Recommended now.
- Gives evaluators a clean-checkout path over current SDK-derived proof truth.
- Preserves W522 as prior journey evidence.
- Preserves all publication, release, runtime, entitlement, support, and W561+
  gates.

Option B: request a later no-deploy routed candidate after SDK/public surface
classification, public copy, release posture, and demo delivery posture are
approved for exact customer-facing text.

- Useful only if Manager wants public Docs copy staged for review.
- Must remain sandbox-first and source-visible.
- Must not lead with binary packages or source-less executables.

Option C: request public publication.

- Not authorized by W526.
- Requires explicit publication authority, public wording approval, public
  surface scans, release/provenance decisions, and rollback plan.

Recommendation: choose Option A. Treat this as the private buyer/developer
journey that connects the W535-normalized W524 clean-checkout proof and W525
prior private release-integration posture to an Agent Action Gate Sprint or
design-partner conversation.

## Validation

Run from the repository root:

```bash
node --check specs/526-private-w524-w525-agent-action-gate-clean-checkout-journey-refresh/validate-w526-w524-w525-clean-checkout-journey.mjs
node specs/526-private-w524-w525-agent-action-gate-clean-checkout-journey-refresh/validate-w526-w524-w525-clean-checkout-journey.mjs
npm run check:docs-version -- --explain
npm run check:public-leaks
npm run astro check
npm run build
node specs/526-private-w524-w525-agent-action-gate-clean-checkout-journey-refresh/validate-w526-w524-w525-clean-checkout-journey.mjs --dist
git diff --check
git diff --cached --check
```

The validator checks this private journey, routed docs source, and optional
built output for W535-normalized W524 provenance, W525 release-integration
posture, W522 prior journey link, W521 and SDK W535 provenance,
clean-checkout one-command DX
wording, deterministic outcomes, inspectable evidence and receipt refs,
human-review path, expected-outcome substitution rejection, limitations,
paid-next-step wording, placeholder tokens, local path evidence, private repo
names, and secret-like tokens.
