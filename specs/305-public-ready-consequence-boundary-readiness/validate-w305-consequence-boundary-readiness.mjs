#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const PUBLIC_DOCS_ROOT = path.join(REPO_ROOT, 'src/content/docs');
const DIST_ROOT = path.join(REPO_ROOT, 'dist');

const EXPECTED_SDK_CHECKPOINTS = {
  w290: '97c0855f351684476fc1e66e335df28cbb18eb5b',
  w295: '13ad72f72a4bb3faed016b6de51540530a4f3684',
};

const EXPECTED_SCENARIOS = [
  'scenario.consequence.read-only-receipt',
  'scenario.consequence.trajectory-fold-policy',
  'scenario.consequence.sdk-aligned-mapping',
];

const REQUIRED_PUBLIC_GATE_FIELDS = [
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

const REQUIRED_NEGATIVE_CASES = [
  'missing-source-checkpoint',
  'unknown-sdk-vocabulary-value',
  'missing-public-boundary-gate',
  'public-export-bypass',
  'runtime-provider-claim',
  'sensitive-regulated-data',
  'mutable-public-count-prose',
];

const PUBLIC_CONSEQUENCE_CLAIM_PATTERNS = [
  /\bconsequence[- ]boundary\b/i,
  /\bconsequence[- ]control\b/i,
  /\bread[- ]only side[- ]effects?\b/i,
  /\bcurrent[- ]state reevaluation\b/i,
  /\bbackward[- ]reasoning\b/i,
  /\bsafe[- ]next[- ]actions?\b/i,
  /\bdenied[- ]authority\b/i,
  /\bconsequence[- ]aware receipts?\b/i,
];

const PUBLIC_AUTHORITY_CLAIM_PATTERNS = [
  /\bpublic[-_ ]ready\b/i,
  /\brelease[-_ ]ready\b/i,
  /\bprovider[-_ ]registry[-_ ]ready\b/i,
  /\bapi[-_ ]ready\b/i,
  /\bruntime[-_ ]ready\b/i,
  /\bpackage[-_ ]ready\b/i,
  /\bsupport[-_ ]ready\b/i,
  /\bcompliance[-_ ]ready\b/i,
];

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
  const fixture = readJson(options.fixturePath);
  validateW300Fixture(fixture);
  scanPublicDocs(PUBLIC_DOCS_ROOT, 'src/content/docs');
  if (options.checkDist) scanPublicDocs(DIST_ROOT, 'dist');

  console.log('W305 consequence boundary Docs readiness validation passed');
  console.log(`W300 scenarios: ${EXPECTED_SCENARIOS.length}`);
  console.log(`Built output checked: ${options.checkDist}`);
}

function parseArgs(args) {
  const fixtureFlagIndex = args.indexOf('--fixture');
  const fixturePath = fixtureFlagIndex >= 0 ? args[fixtureFlagIndex + 1] : process.env.W300_FIXTURE;
  if (!fixturePath) {
    fail('Usage: validate-w305-consequence-boundary-readiness.mjs --fixture /path/to/private-consequence-scenario-bundle.json [--dist]');
  }
  const resolvedFixturePath = path.resolve(fixturePath);
  if (!fs.existsSync(resolvedFixturePath)) {
    fail(`W300 fixture not found: ${resolvedFixturePath}`);
  }
  return {
    fixturePath: resolvedFixturePath,
    checkDist: args.includes('--dist'),
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function validateW300Fixture(fixture) {
  assertEqual(fixture.fixture_type, 'w300-private-consequence-scenario-bundle', 'fixture_type');
  assertEqual(fixture.candidate_publication_state, 'private_uncleared_candidate', 'candidate_publication_state');
  assertEqual(fixture.publication_clearance_state, 'uncleared', 'publication_clearance_state');
  assertEqual(fixture.fixture_posture, 'private_local_synthetic_non_claim', 'fixture_posture');
  assertObjectEquals(fixture.sdk_checkpoints, EXPECTED_SDK_CHECKPOINTS, 'sdk_checkpoints');
  validateFalseGates(requireObject(fixture.public_boundary_gates, 'public_boundary_gates'), 'public_boundary_gates');
  validateDocsConsumerHint(fixture);
  validateScenarios(fixture);
  validateNegativeCases(fixture);
}

function validateDocsConsumerHint(fixture) {
  const hints = requireArray(fixture.consumer_hints, 'consumer_hints');
  const docsHint = hints.find((hint) => hint && hint.consumer_id === 'docs');
  if (!docsHint) fail('consumer_hints must include docs');
  const allowed = requireString(docsHint.allowed_private_use, 'docs.allowed_private_use');
  const denied = requireString(docsHint.denied_public_use, 'docs.denied_public_use');
  const boundary = requireString(docsHint.authority_boundary, 'docs.authority_boundary');
  if (!/private/i.test(allowed) || !/planning|validation/i.test(allowed)) {
    fail('docs allowed_private_use must remain private planning/validation only');
  }
  if (!/do not publish public docs/i.test(denied)) {
    fail('docs denied_public_use must deny public docs publication');
  }
  if (!/private docs planning only/i.test(boundary)) {
    fail('docs authority_boundary must remain private docs planning only');
  }
}

function validateScenarios(fixture) {
  const scenarios = requireArray(fixture.scenarios, 'scenarios');
  const ids = scenarios.map((scenario, index) => requireString(scenario.scenario_id, `scenarios[${index}].scenario_id`)).sort();
  assertArrayEquals(ids, [...EXPECTED_SCENARIOS].sort(), 'scenarios ids');
  for (const scenario of scenarios) {
    validateFalseGates(requireObject(scenario.public_boundary_gates, `${scenario.scenario_id}.public_boundary_gates`), `${scenario.scenario_id}.public_boundary_gates`);
    const dispositions = requireStringArray(scenario.boundary_control_dispositions, `${scenario.scenario_id}.boundary_control_dispositions`);
    if (!dispositions.includes('guarded_allow_read_only') && !dispositions.includes('defer_for_human_review')) {
      fail(`${scenario.scenario_id} must carry a guarded read-only or human-review boundary disposition`);
    }
    const deniedAuthorities = requireStringArray(scenario.denied_authority_flags, `${scenario.scenario_id}.denied_authority_flags`);
    for (const denied of deniedAuthorities) {
      if (typeof denied !== 'string' || denied.length === 0) {
        fail(`${scenario.scenario_id} denied_authority_flags must be non-empty strings`);
      }
    }
  }
}

function validateNegativeCases(fixture) {
  const negativeCases = requireArray(fixture.negative_cases, 'negative_cases');
  const ids = negativeCases.map((negativeCase, index) => requireString(negativeCase.case_id, `negative_cases[${index}].case_id`)).sort();
  assertArrayEquals(ids, [...REQUIRED_NEGATIVE_CASES].sort(), 'negative case ids');
  for (const negativeCase of negativeCases) {
    assertEqual(negativeCase.expected_result, 'rejected', `${negativeCase.case_id}.expected_result`);
  }
}

function scanPublicDocs(root, label) {
  if (!fs.existsSync(root)) {
    fail(`${label} does not exist`);
  }
  const findings = [];
  for (const filePath of listFiles(root)) {
    const extension = path.extname(filePath);
    if (!SCANNED_EXTENSIONS.has(extension)) continue;
    const text = fs.readFileSync(filePath, 'utf8');
    const relative = path.relative(REPO_ROOT, filePath);
    for (const pattern of PUBLIC_CONSEQUENCE_CLAIM_PATTERNS) {
      if (pattern.test(text)) findings.push(`${relative} matches consequence claim pattern ${pattern}`);
    }
    for (const pattern of PUBLIC_AUTHORITY_CLAIM_PATTERNS) {
      if (pattern.test(text)) findings.push(`${relative} matches public authority pattern ${pattern}`);
    }
  }
  if (findings.length > 0) {
    fail(`${label} contains public consequence/authority claim text:\n- ${findings.join('\n- ')}`);
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
  const fields = Object.keys(gates).sort();
  assertArrayEquals(fields, [...REQUIRED_PUBLIC_GATE_FIELDS].sort(), label);
  for (const field of REQUIRED_PUBLIC_GATE_FIELDS) {
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
