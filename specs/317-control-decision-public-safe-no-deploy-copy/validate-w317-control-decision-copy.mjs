#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const PUBLIC_DOCS_ROOT = path.join(REPO_ROOT, 'src/content/docs');
const DIST_ROOT = path.join(REPO_ROOT, 'dist');
const DEFAULT_CANDIDATE = path.join(__dirname, 'candidate-copy.md');

const EXPECTED_W313_FIXTURE_TYPE = 'w313-w307-control-decision-alignment';
const EXPECTED_W313_POSTURE = 'private_local_synthetic_non_claim';
const EXPECTED_W313_CANDIDATE_STATE = 'private_uncleared_candidate';
const EXPECTED_W313_CLEARANCE = 'uncleared';
const EXPECTED_W307_CHECKPOINT = '30a54552a13b53fa3a68c04d75171942f068883d';
const EXPECTED_W307_SPINE_REF = 'private_control_decision_stage012_spine';
const EXPECTED_W307_PROJECTION_BOUNDARY = 'private_stage012_control_decision_non_claim';
const EXPECTED_DECISION_KINDS = [
  'configuration',
  'authorization',
  'entitlement',
  'consequence_boundary',
  'readiness',
  'composite',
];
const EXPECTED_PRECEDENCE = [
  'enterprise',
  'system',
  'installation',
  'workspace',
  'application',
  'user',
  'environment',
  'runtime_session',
];
const EXPECTED_FALSE_PUBLIC_GATES = [
  'public_selection_allowed',
  'public_export_allowed',
  'runtime_executed',
  'provider_registry_ready',
  'generated_public_artifact',
  'sensitive_or_regulated_data',
];
const EXPECTED_FALSE_AUTHORITY_GATES = [
  'public_api_authority',
  'public_schema_authority',
  'cli_exposure_authorized',
  'provider_registry_authority',
  'runtime_provider_authority',
  'release_authority',
  'package_authority',
  'support_claim_authority',
  'compliance_claim_authority',
];
const EXPECTED_NEGATIVE_CASES = [
  'community-paid-plugin-overclaim',
  'missing-plugin-entitlement',
  'missing-w307-checkpoint',
  'missing-w308-source-link',
  'mutable-public-count-prose',
  'public-api-authority-bypass',
  'runtime-provider-authority-bypass',
  'sensitive-regulated-data',
  'support-claim-authority-bypass',
  'unknown-sdk-vocabulary-value',
  'w308-pending-alignment-not-superseded',
  'wrong-precedence-order',
];

const REQUIRED_CANDIDATE_PATTERNS = [
  /\blocal control decision/i,
  /\bconsequence boundary/i,
  /\bstronger policy\b/i,
  /\blocal preferences\b/i,
  /\bactor, action, resource, and context\b/i,
  /\bcapability is not available\b/i,
  /\bsafe next step\b/i,
  /\badvanced extension action\b/i,
];

const CANDIDATE_DENIED_PATTERNS = [
  /\bControlDecision\b/,
  /\bStage\s*0\/1\/2\b/i,
  /\bStage\s+[012]\b/i,
  /\bstage[012]\b/i,
  /\bprivate_control_decision_stage012_spine\b/i,
  /\bprivate_stage012_control_decision_non_claim\b/i,
  /\bprovider[-_ ]registry\b/i,
  /\bruntime[-_ ]provider\b/i,
  /\bruntime[-_ ]ready\b/i,
  /\bpublic[-_ ]ready\b/i,
  /\brelease[-_ ]ready\b/i,
  /\bpackage[-_ ]ready\b/i,
  /\bsupport[-_ ]ready\b/i,
  /\bcompliance[-_ ]ready\b/i,
  /\bpublic API\b/i,
  /\bpublic schema\b/i,
  /\bplugin\b/i,
  /\bplugin_loading\b/i,
  /\bdelegated_trust_roots\b/i,
  /\brequired_entitlements\b/i,
  /\brequired_edition\b/i,
  /\bsigned_manifest\b/i,
  /\bsigned_binary\b/i,
  /\bdispatch[-_ ]time\b/i,
  /\bEnterprise\b/,
  /\bsupport\b/i,
  /\bcompliance\b/i,
  /\bshipped\b/i,
  /\bavailable now\b/i,
];

const PUBLIC_DOCS_DENIED_PATTERNS = [
  /\bControlDecision\b/,
  /\bcontrol[- ]decision(s)?\b/i,
  /\bStage\s*0\/1\/2\b/i,
  /\bconfiguration precedence\b/i,
  /\bPARC authorization\b/i,
  /\bprivate_control_decision_stage012_spine\b/i,
  /\bprivate_stage012_control_decision_non_claim\b/i,
  /\bplugin entitlement(s)?\b/i,
  /\bpaid[- ]runtime plugin\b/i,
  /\brequired_entitlements\b/i,
  /\brequired_edition\b/i,
  /\bplugin_loading\b/i,
  /\bdelegated_trust_roots\b/i,
  /\bplugin_config_paths\b/i,
  /\bpublic[- ]safe denial\b/i,
];

const CONTROL_AUTHORITY_PATTERN =
  /\b(ControlDecision|control[- ]decision|configuration precedence|PARC authorization|plugin entitlement|paid[- ]runtime plugin|Stage 0\/1\/2)\b[\s\S]{0,180}\b(public[-_ ]ready|release[-_ ]ready|provider[-_ ]registry[-_ ]ready|api[-_ ]ready|runtime[-_ ]ready|package[-_ ]ready|support[-_ ]ready|compliance[-_ ]ready|generated[-_ ]artifact[-_ ]ready|downstream[-_ ]emission)\b/i;

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
  validateW313Fixture(readJson(options.w313FixturePath));
  validateCandidateCopy(options.candidatePath);
  scanPublicDocs(PUBLIC_DOCS_ROOT, 'src/content/docs');
  if (options.checkDist) scanPublicDocs(DIST_ROOT, 'dist');

  console.log('W317 ControlDecision public-safe copy validation passed');
  console.log(`W313 fixture: ${options.w313FixturePath}`);
  console.log(`Candidate copy: ${options.candidatePath}`);
  console.log(`Built output checked: ${options.checkDist}`);
}

function parseArgs(args) {
  const fixtureFlagIndex = args.indexOf('--w313-fixture');
  const fixturePath = fixtureFlagIndex >= 0 ? args[fixtureFlagIndex + 1] : process.env.W313_FIXTURE;
  if (!fixturePath) {
    fail('Usage: validate-w317-control-decision-copy.mjs --w313-fixture /path/to/w307-control-decision-alignment.json [--candidate /path/to/candidate-copy.md] [--dist]');
  }
  const resolvedFixturePath = path.resolve(fixturePath);
  if (!fs.existsSync(resolvedFixturePath)) {
    fail(`W313 fixture not found: ${resolvedFixturePath}`);
  }

  const candidateFlagIndex = args.indexOf('--candidate');
  const candidatePath = candidateFlagIndex >= 0 ? args[candidateFlagIndex + 1] : DEFAULT_CANDIDATE;
  const resolvedCandidatePath = path.resolve(candidatePath);
  if (!fs.existsSync(resolvedCandidatePath)) {
    fail(`W317 candidate copy not found: ${resolvedCandidatePath}`);
  }

  return {
    w313FixturePath: resolvedFixturePath,
    candidatePath: resolvedCandidatePath,
    checkDist: args.includes('--dist'),
  };
}

function validateW313Fixture(fixture) {
  assertEqual(fixture.fixture_type, EXPECTED_W313_FIXTURE_TYPE, 'fixture_type');
  assertEqual(fixture.package_posture, EXPECTED_W313_POSTURE, 'package_posture');
  assertEqual(fixture.candidate_publication_state, EXPECTED_W313_CANDIDATE_STATE, 'candidate_publication_state');
  assertEqual(fixture.publication_clearance_state, EXPECTED_W313_CLEARANCE, 'publication_clearance_state');

  const alignment = requireObject(fixture.alignment_result, 'alignment_result');
  assertEqual(alignment.status, 'w307_aligned_private_evidence', 'alignment_result.status');
  assertEqual(alignment.w308_pending_alignment_superseded, true, 'alignment_result.w308_pending_alignment_superseded');
  assertEqual(alignment.sdk_w307_fields_mapped, true, 'alignment_result.sdk_w307_fields_mapped');
  assertEqual(alignment.public_boundary_preserved, true, 'alignment_result.public_boundary_preserved');

  const sdkW307 = requireObject(fixture.sdk_w307, 'sdk_w307');
  assertEqual(sdkW307.checkpoint, EXPECTED_W307_CHECKPOINT, 'sdk_w307.checkpoint');
  assertEqual(sdkW307.spine_ref, EXPECTED_W307_SPINE_REF, 'sdk_w307.spine_ref');
  assertEqual(sdkW307.projection_boundary, EXPECTED_W307_PROJECTION_BOUNDARY, 'sdk_w307.projection_boundary');
  assertEqual(sdkW307.source_public_readiness_classification_ref, 'private_feature_rich_boundary_classification', 'sdk_w307.source_public_readiness_classification_ref');

  const vocabulary = requireObject(fixture.w307_vocabulary, 'w307_vocabulary');
  assertArrayEquals(requireStringArray(vocabulary.decision_kinds, 'w307_vocabulary.decision_kinds'), EXPECTED_DECISION_KINDS, 'w307_vocabulary.decision_kinds');
  assertArrayEquals(requireStringArray(vocabulary.precedence_order, 'w307_vocabulary.precedence_order'), EXPECTED_PRECEDENCE, 'w307_vocabulary.precedence_order');
  for (const deniedAuthority of ['public_api', 'public_schema', 'provider_registry', 'runtime_provider_execution', 'release', 'package_publication', 'support_claim', 'compliance_claim']) {
    if (!requireStringArray(vocabulary.denied_authorities, 'w307_vocabulary.denied_authorities').includes(deniedAuthority)) {
      fail(`w307_vocabulary.denied_authorities missing ${deniedAuthority}`);
    }
  }

  validateFalseGates(requireObject(fixture.public_boundary_gates, 'public_boundary_gates'), EXPECTED_FALSE_PUBLIC_GATES, 'public_boundary_gates');
  validateFalseGates(requireObject(fixture.w307_authority_gates, 'w307_authority_gates'), EXPECTED_FALSE_AUTHORITY_GATES, 'w307_authority_gates');
  validateAlignmentRecords(fixture);
  validateNegativeCases(fixture);
}

function validateAlignmentRecords(fixture) {
  const records = requireArray(fixture.w307_alignment_records, 'w307_alignment_records');
  if (records.length !== 6) fail(`w307_alignment_records expected 6 records, got ${records.length}`);
  const kinds = [];
  const stages = new Set();
  let foundPluginHardening = false;

  for (const [index, recordValue] of records.entries()) {
    const record = requireObject(recordValue, `w307_alignment_records[${index}]`);
    kinds.push(requireString(record.decision_kind, `w307_alignment_records[${index}].decision_kind`));
    stages.add(requireString(record.stage, `w307_alignment_records[${index}].stage`));
    requireString(record.decision_ref, `w307_alignment_records[${index}].decision_ref`);
    requireString(record.outcome, `w307_alignment_records[${index}].outcome`);
    requireString(record.scope, `w307_alignment_records[${index}].scope`);
    requireString(record.public_message_key, `w307_alignment_records[${index}].public_message_key`);
    requireString(record.safe_next_action, `w307_alignment_records[${index}].safe_next_action`);
    requireStringArray(record.source_w308_scenario_refs, `w307_alignment_records[${index}].source_w308_scenario_refs`);

    if (record.decision_ref === 'decision.control.stage2.paid_plugin_readiness') {
      foundPluginHardening = true;
      assertEqual(record.outcome, 'deny', 'stage2 paid plugin outcome');
      const hardening = requireObject(record.plugin_hardening, 'stage2 paid plugin hardening');
      assertEqual(hardening.required_edition, 'enterprise', 'plugin_hardening.required_edition');
      const entitlements = requireStringArray(hardening.required_entitlements, 'plugin_hardening.required_entitlements');
      for (const entitlement of ['plugin_loading', 'delegated_trust_roots']) {
        if (!entitlements.includes(entitlement)) fail(`plugin_hardening.required_entitlements missing ${entitlement}`);
      }
      assertEqual(hardening.signed_manifest_required, true, 'plugin_hardening.signed_manifest_required');
      assertEqual(hardening.signed_binary_required, true, 'plugin_hardening.signed_binary_required');
      for (const denial of ['missing_entitlement', 'bad_signature', 'tampered_manifest', 'dispatch_denied']) {
        if (!requireStringArray(hardening.denial_classes, 'plugin_hardening.denial_classes').includes(denial)) {
          fail(`plugin_hardening.denial_classes missing ${denial}`);
        }
      }
    }
  }

  assertArrayEquals(kinds, EXPECTED_DECISION_KINDS, 'w307_alignment_records decision_kind order');
  for (const stage of ['stage0', 'stage1', 'stage2']) {
    if (!stages.has(stage)) fail(`w307_alignment_records missing ${stage}`);
  }
  if (!foundPluginHardening) fail('w307_alignment_records missing stage2 paid plugin readiness denial record');
}

function validateNegativeCases(fixture) {
  const ids = requireArray(fixture.negative_cases, 'negative_cases').map((negativeCase, index) => {
    const value = requireObject(negativeCase, `negative_cases[${index}]`);
    assertEqual(value.expected_result, 'rejected', `negative_cases[${index}].expected_result`);
    return requireString(value.case_id, `negative_cases[${index}].case_id`);
  }).sort();
  assertArrayEquals(ids, EXPECTED_NEGATIVE_CASES, 'negative_cases');
}

function validateCandidateCopy(candidatePath) {
  const text = fs.readFileSync(candidatePath, 'utf8');
  const findings = [];
  for (const pattern of REQUIRED_CANDIDATE_PATTERNS) {
    if (!pattern.test(text)) findings.push(`missing required conceptual phrase ${pattern}`);
  }
  for (const pattern of CANDIDATE_DENIED_PATTERNS) {
    if (pattern.test(text)) findings.push(`contains denied public-copy phrase ${pattern}`);
  }
  if (findings.length > 0) {
    fail(`W317 candidate copy failed guard checks:\n- ${findings.join('\n- ')}`);
  }
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
    for (const pattern of PUBLIC_DOCS_DENIED_PATTERNS) {
      if (pattern.test(text)) findings.push(`${relative} matches W317 denied public-docs pattern ${pattern}`);
    }
    if (CONTROL_AUTHORITY_PATTERN.test(text)) {
      findings.push(`${relative} contains ControlDecision-adjacent authority wording`);
    }
  }
  if (findings.length > 0) {
    fail(`${label} contains unsupported W317 ControlDecision/Stage 0/1/2 public claim text:\n- ${findings.join('\n- ')}`);
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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function validateFalseGates(gates, expectedFields, label) {
  assertArrayEquals(Object.keys(gates).sort(), [...expectedFields].sort(), label);
  for (const field of expectedFields) {
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
