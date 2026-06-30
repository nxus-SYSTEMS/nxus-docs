#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const PUBLIC_DOCS_ROOT = path.join(REPO_ROOT, 'src/content/docs');
const DIST_ROOT = path.join(REPO_ROOT, 'dist');

const EXPECTED_W308_FIXTURE_TYPE = 'w308-control-decision-stage012-private-fixture';
const EXPECTED_SOURCE_BUNDLE = {
  wave: 'w300',
  checkpoint: '04798171d330e71ec836e311273609d7a7a69567',
  bundle_id: 'bundle.consequence.private.w300',
};
const EXPECTED_SDK_CHECKPOINTS = {
  w290: '97c0855f351684476fc1e66e335df28cbb18eb5b',
  w295: '13ad72f72a4bb3faed016b6de51540530a4f3684',
};
const EXPECTED_STAGES = [
  'stage0_vocabulary_contract',
  'stage1_private_receipt_slice',
  'stage2_entitlement_plugin_hardening',
];
const EXPECTED_SCENARIOS = [
  'control.stage0.config-critical-nonoverridable',
  'control.stage1.parc-consequence-boundary',
  'control.stage2.paid-runtime-plugin-hardening',
];
const EXPECTED_NEGATIVE_CASES = [
  'missing-load-dispatch-split',
  'missing-nonoverridable-critical-control',
  'mutable-public-count-prose',
  'public-export-bypass',
  'runtime-provider-claim',
  'sensitive-regulated-data',
  'unknown-control-vocabulary',
  'unsigned-plugin-allowed',
];
const REQUIRED_FALSE_GATE_FIELDS = [
  'public_selection_allowed',
  'public_export_allowed',
  'runtime_executed',
  'provider_registry_ready',
  'public_api_authority',
  'public_schema_authority',
  'runtime_provider_authority',
  'release_authority',
  'generated_public_artifact',
  'package_publication_ready',
  'downstream_emission_authorized',
  'support_ready',
  'compliance_claim_ready',
  'sensitive_or_regulated_data',
];
const REQUIRED_CATALOG_REFS = [
  'nxuskit:enterprise:delegated_trust_roots',
  'nxuskit:enterprise:plugin_config_paths',
  'nxuskit:pro:plugin_loading',
];

const PUBLIC_CONTROL_DECISION_PATTERNS = [
  /\bControlDecision\b/i,
  /\bcontrol[- ]decision\b/i,
  /\bControlDecision Stage\b/i,
  /\bStage 0\/1\/2\b/i,
  /\bStage 0\b/i,
  /\bconfiguration precedence\b/i,
  /\bPARC authorization\b/i,
  /\bplugin entitlements?\b/i,
  /\bpaid[- ]runtime plugin\b/i,
  /\brequired_entitlements\b/i,
  /\brequired_edition\b/i,
  /\bplugin_loading\b/i,
  /\bplugin_runtime\b/i,
  /\bdelegated_trust_roots\b/i,
  /\bplugin_config_paths\b/i,
  /\bpublic[- ]safe denial\b/i,
  /\bruntime readiness\b/i,
];

const CONTROL_AUTHORITY_PATTERN =
  /\b(ControlDecision|control[- ]decision|configuration precedence|PARC authorization|plugin entitlement|paid[- ]runtime plugin|Stage 0\/1\/2)\b[\s\S]{0,160}\b(public[-_ ]ready|release[-_ ]ready|provider[-_ ]registry[-_ ]ready|api[-_ ]ready|runtime[-_ ]ready|package[-_ ]ready|support[-_ ]ready|compliance[-_ ]ready|generated[-_ ]artifact[-_ ]ready|downstream[-_ ]emission)\b/i;

const SCANNED_EXTENSIONS = new Set([
  '.astro',
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.txt',
  '.xml',
]);

function main() {
  const options = parseArgs(process.argv.slice(2));
  const fixture = readJson(options.w308FixturePath);
  validateW308Fixture(fixture, options.w313Status);
  scanPublicDocs(PUBLIC_DOCS_ROOT, 'src/content/docs');
  if (options.checkDist) scanPublicDocs(DIST_ROOT, 'dist');

  console.log('W314 ControlDecision Stage 0/1/2 Docs readiness validation passed');
  console.log(`W308 scenarios: ${EXPECTED_SCENARIOS.length}`);
  console.log(`W313 status: ${options.w313Status}`);
  console.log(`Built output checked: ${options.checkDist}`);
}

function parseArgs(args) {
  const fixtureFlagIndex = args.indexOf('--w308-fixture');
  const fixturePath = fixtureFlagIndex >= 0 ? args[fixtureFlagIndex + 1] : process.env.W308_FIXTURE;
  if (!fixturePath) {
    fail('Usage: validate-w314-control-decision-stage012-readiness.mjs --w308-fixture /path/to/control-decision-stage012-private-fixture.json [--w313-status pending|complete] [--dist]');
  }
  const resolvedFixturePath = path.resolve(fixturePath);
  if (!fs.existsSync(resolvedFixturePath)) {
    fail(`W308 fixture not found: ${resolvedFixturePath}`);
  }

  const statusFlagIndex = args.indexOf('--w313-status');
  const w313Status = statusFlagIndex >= 0 ? args[statusFlagIndex + 1] : 'pending';
  if (!['pending', 'complete'].includes(w313Status)) {
    fail(`--w313-status must be pending or complete, got ${w313Status}`);
  }

  return {
    w308FixturePath: resolvedFixturePath,
    w313Status,
    checkDist: args.includes('--dist'),
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function validateW308Fixture(fixture, w313Status) {
  assertEqual(fixture.fixture_type, EXPECTED_W308_FIXTURE_TYPE, 'fixture_type');
  assertEqual(fixture.package_posture, 'private_local_synthetic_non_claim', 'package_posture');
  assertEqual(fixture.candidate_publication_state, 'private_uncleared_candidate', 'candidate_publication_state');
  assertEqual(fixture.publication_clearance_state, 'uncleared', 'publication_clearance_state');
  assertObjectEquals(fixture.source_bundle, EXPECTED_SOURCE_BUNDLE, 'source_bundle');
  assertObjectEquals(fixture.sdk_checkpoints, EXPECTED_SDK_CHECKPOINTS, 'sdk_checkpoints');
  validateW307Alignment(fixture, w313Status);
  validateFalseGates(requireObject(fixture.public_boundary_gates, 'public_boundary_gates'), 'public_boundary_gates');
  validateStageCoverage(fixture);
  validateConfigurationPrecedence(fixture);
  validateCatalogRefs(fixture);
  validateScenarios(fixture);
  validateNegativeCases(fixture);
}

function validateW307Alignment(fixture, w313Status) {
  const followUp = requireObject(fixture.sdk_alignment_follow_up, 'sdk_alignment_follow_up');
  if (w313Status === 'pending') {
    assertEqual(followUp.w307, 'pending_alignment_follow_up', 'sdk_alignment_follow_up.w307');
    const reason = requireString(followUp.reason, 'sdk_alignment_follow_up.reason');
    if (!/awaits SDK W307 authority/i.test(reason)) {
      fail('sdk_alignment_follow_up.reason must continue to record W307 authority as awaited while W313 is pending');
    }
  }
}

function validateStageCoverage(fixture) {
  const stageIds = requireArray(fixture.stage_coverage, 'stage_coverage').map((stage, index) => {
    const stageObject = requireObject(stage, `stage_coverage[${index}]`);
    requireString(stageObject.stage_label, `stage_coverage[${index}].stage_label`);
    requireString(stageObject.coverage_summary, `stage_coverage[${index}].coverage_summary`);
    return requireString(stageObject.stage_id, `stage_coverage[${index}].stage_id`);
  });
  assertArrayEquals(stageIds, EXPECTED_STAGES, 'stage_coverage stage_id order');
}

function validateConfigurationPrecedence(fixture) {
  const precedence = requireObject(fixture.configuration_precedence, 'configuration_precedence');
  const scopes = requireStringArray(precedence.highest_to_lowest, 'configuration_precedence.highest_to_lowest');
  for (const scope of ['enterprise_tenant_policy', 'system_policy', 'workspace_policy', 'user_preference']) {
    if (!scopes.includes(scope)) fail(`configuration_precedence.highest_to_lowest missing ${scope}`);
  }
  const criticalLockRule = requireString(precedence.critical_lock_rule, 'configuration_precedence.critical_lock_rule');
  if (!/override_allowed=false/.test(criticalLockRule)) {
    fail('configuration_precedence.critical_lock_rule must preserve non-overridable control language');
  }
  const controls = requireArray(precedence.nonoverridable_controls, 'configuration_precedence.nonoverridable_controls');
  if (controls.length < 2) fail('configuration_precedence.nonoverridable_controls must retain at least two controls');
  for (const [index, controlValue] of controls.entries()) {
    const control = requireObject(controlValue, `nonoverridable_controls[${index}]`);
    requireString(control.control_id, `nonoverridable_controls[${index}].control_id`);
    assertEqual(control.override_allowed, false, `nonoverridable_controls[${index}].override_allowed`);
    requireStringArray(control.blocked_lower_scopes, `nonoverridable_controls[${index}].blocked_lower_scopes`);
  }
}

function validateCatalogRefs(fixture) {
  const refs = requireArray(fixture.catalog_refs, 'catalog_refs').map((refValue, index) => {
    const ref = requireObject(refValue, `catalog_refs[${index}]`);
    assertEqual(ref.catalog_path, 'sharedData/product-catalog-v1.yaml', `catalog_refs[${index}].catalog_path`);
    assertEqual(ref.posture, 'catalog_source_ref_only', `catalog_refs[${index}].posture`);
    return `${requireString(ref.product_id, `catalog_refs[${index}].product_id`)}:${requireString(ref.edition, `catalog_refs[${index}].edition`)}:${requireString(ref.feature, `catalog_refs[${index}].feature`)}`;
  }).sort();
  assertArrayEquals(refs, REQUIRED_CATALOG_REFS, 'catalog_refs');
}

function validateScenarios(fixture) {
  const scenarios = requireArray(fixture.control_decision_scenarios, 'control_decision_scenarios');
  const scenarioIds = scenarios.map((scenario, index) => requireString(requireObject(scenario, `control_decision_scenarios[${index}]`).scenario_id, `control_decision_scenarios[${index}].scenario_id`));
  assertArrayEquals(scenarioIds, EXPECTED_SCENARIOS, 'control_decision_scenarios scenario order');

  for (const scenario of scenarios) {
    validateFalseGates(requireObject(scenario.public_boundary_gates, `${scenario.scenario_id}.public_boundary_gates`), `${scenario.scenario_id}.public_boundary_gates`);
    requireString(scenario.public_safe_message, `${scenario.scenario_id}.public_safe_message`);
    requireString(scenario.safe_next_action, `${scenario.scenario_id}.safe_next_action`);
    requireStringArray(scenario.consequence_boundary_refs, `${scenario.scenario_id}.consequence_boundary_refs`);
    requireStringArray(scenario.readiness_refs, `${scenario.scenario_id}.readiness_refs`);
    const decisionIds = validateDecisionRecords(scenario);
    if (scenario.stage_id === 'stage2_entitlement_plugin_hardening') {
      validatePluginRuntimeChecks(requireObject(scenario.plugin_runtime_checks, `${scenario.scenario_id}.plugin_runtime_checks`), decisionIds);
    }
  }
}

function validateDecisionRecords(scenario) {
  const records = requireArray(scenario.decision_records, `${scenario.scenario_id}.decision_records`);
  const decisionIds = new Set();
  for (const [index, recordValue] of records.entries()) {
    const record = requireObject(recordValue, `${scenario.scenario_id}.decision_records[${index}]`);
    const decisionId = requireString(record.decision_id, `${scenario.scenario_id}.decision_records[${index}].decision_id`);
    decisionIds.add(decisionId);
    requireString(record.decision_kind, `${decisionId}.decision_kind`);
    requireString(record.outcome, `${decisionId}.outcome`);
    requireStringArray(record.evidence_refs, `${decisionId}.evidence_refs`);
    requireStringArray(record.readiness_refs, `${decisionId}.readiness_refs`);
    assertEqual(record.override_allowed, false, `${decisionId}.override_allowed`);
    requireString(record.public_message, `${decisionId}.public_message`);
    requireString(record.safe_next_action, `${decisionId}.safe_next_action`);
    requireString(record.receipt_ref, `${decisionId}.receipt_ref`);
  }
  return decisionIds;
}

function validatePluginRuntimeChecks(pluginRuntimeChecks, decisionIds) {
  assertEqual(pluginRuntimeChecks.required_edition, 'pro', 'plugin_runtime_checks.required_edition');
  const entitlements = requireStringArray(pluginRuntimeChecks.required_entitlements, 'plugin_runtime_checks.required_entitlements');
  if (!entitlements.includes('plugin_loading')) {
    fail('plugin_runtime_checks.required_entitlements must include plugin_loading');
  }
  assertEqual(pluginRuntimeChecks.signed_manifest_required, true, 'plugin_runtime_checks.signed_manifest_required');
  assertEqual(pluginRuntimeChecks.signed_binary_required, true, 'plugin_runtime_checks.signed_binary_required');
  const coveredFields = requireStringArray(pluginRuntimeChecks.signed_manifest_covered_fields, 'plugin_runtime_checks.signed_manifest_covered_fields');
  for (const field of ['required_edition', 'required_entitlements', 'plugin_domain', 'abi_version', 'binary_hash', 'capability_declarations']) {
    if (!coveredFields.includes(field)) fail(`plugin_runtime_checks.signed_manifest_covered_fields missing ${field}`);
  }
  const loadDecision = requireString(pluginRuntimeChecks.load_time_decision_id, 'plugin_runtime_checks.load_time_decision_id');
  const dispatchDecision = requireString(pluginRuntimeChecks.dispatch_time_decision_id, 'plugin_runtime_checks.dispatch_time_decision_id');
  if (!decisionIds.has(loadDecision)) fail('plugin_runtime_checks.load_time_decision_id must match a decision record');
  if (!decisionIds.has(dispatchDecision)) fail('plugin_runtime_checks.dispatch_time_decision_id must match a decision record');
  if (loadDecision === dispatchDecision) fail('plugin_runtime_checks must keep load and dispatch decisions split');
}

function validateNegativeCases(fixture) {
  const ids = requireArray(fixture.negative_cases, 'negative_cases').map((negativeCase, index) => {
    const value = requireObject(negativeCase, `negative_cases[${index}]`);
    assertEqual(value.expected_result, 'rejected', `negative_cases[${index}].expected_result`);
    return requireString(value.case_id, `negative_cases[${index}].case_id`);
  }).sort();
  assertArrayEquals(ids, EXPECTED_NEGATIVE_CASES, 'negative_cases');
}

function scanPublicDocs(root, label) {
  if (!fs.existsSync(root)) {
    fail(`${label} does not exist`);
  }
  const findings = [];
  for (const filePath of listFiles(root)) {
    if (!SCANNED_EXTENSIONS.has(path.extname(filePath))) continue;
    const text = fs.readFileSync(filePath, 'utf8');
    const relative = path.relative(REPO_ROOT, filePath);
    for (const pattern of PUBLIC_CONTROL_DECISION_PATTERNS) {
      if (pattern.test(text)) findings.push(`${relative} matches ControlDecision claim pattern ${pattern}`);
    }
    if (CONTROL_AUTHORITY_PATTERN.test(text)) {
      findings.push(`${relative} contains ControlDecision-adjacent authority wording`);
    }
  }
  if (findings.length > 0) {
    fail(`${label} contains unsupported ControlDecision/Stage 0/1/2 public claim text:\n- ${findings.join('\n- ')}`);
  }
}

function listFiles(root) {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function validateFalseGates(gates, label) {
  assertArrayEquals(Object.keys(gates).sort(), [...REQUIRED_FALSE_GATE_FIELDS].sort(), label);
  for (const field of REQUIRED_FALSE_GATE_FIELDS) {
    assertEqual(gates[field], false, `${label}.${field}`);
  }
}

function requireObject(value, pointer) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${pointer} must be an object`);
  }
  return value;
}

function requireArray(value, pointer) {
  if (!Array.isArray(value)) {
    fail(`${pointer} must be an array`);
  }
  return value;
}

function requireString(value, pointer) {
  if (typeof value !== 'string' || value.length === 0) {
    fail(`${pointer} must be a non-empty string`);
  }
  return value;
}

function requireStringArray(value, pointer) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.length === 0)) {
    fail(`${pointer} must be an array of non-empty strings`);
  }
  return value;
}

function assertEqual(actual, expected, pointer) {
  if (actual !== expected) {
    fail(`${pointer} expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertObjectEquals(actual, expected, pointer) {
  requireObject(actual, pointer);
  assertArrayEquals(Object.keys(actual).sort(), Object.keys(expected).sort(), pointer);
  for (const [key, expectedValue] of Object.entries(expected)) {
    assertEqual(actual[key], expectedValue, `${pointer}.${key}`);
  }
}

function assertArrayEquals(actual, expected, pointer) {
  if (actual.length !== expected.length || actual.some((item, index) => item !== expected[index])) {
    fail(`${pointer} expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main();
