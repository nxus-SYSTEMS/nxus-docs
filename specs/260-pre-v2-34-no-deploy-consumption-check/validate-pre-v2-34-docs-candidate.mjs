#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const EXAMPLES_ROOT = path.join(REPO_ROOT, 'src/content/docs/nxuskit/examples');
const INDEX_PATH = path.join(EXAMPLES_ROOT, 'index.md');
const CATEGORIES = ['patterns', 'integrations', 'apps'];
const DENIED_SURFACE_IDS = [
  'hello-provider',
  'cedar-local-policy',
  'prolog-scryer-refreshed-source',
  'cedar-protected-boundary',
  'clips-static-fixture',
  'rre-research-internal',
  'pydantic-v2-projection-drift',
  'typescript-zod-projection-drift',
  'node-wrapper-private-diagnostic',
];

function main() {
  const packagePath = parsePackagePath(process.argv.slice(2));
  const pkg = readJson(packagePath);
  const candidateIds = validateW257Package(pkg);
  const index = fs.readFileSync(INDEX_PATH, 'utf8');
  validateIndexCopy(index);
  validateIndexLinks(index, candidateIds);
  validateCandidateRoutes(candidateIds);
  validateDeniedSurfacesAbsent();

  console.log('W260 pre-v2 34 docs candidate validation passed');
  console.log(`W257 candidates: ${candidateIds.length}`);
  console.log(`Docs index links: ${candidateIds.length}`);
  console.log(`Denied surfaces absent: ${DENIED_SURFACE_IDS.join(', ')}`);
}

function parsePackagePath(args) {
  const packageFlagIndex = args.indexOf('--package');
  const fromFlag = packageFlagIndex >= 0 ? args[packageFlagIndex + 1] : undefined;
  const packagePath = fromFlag || process.env.W257_PACKAGE;
  if (!packagePath) {
    fail('Usage: validate-pre-v2-34-docs-candidate.mjs --package /path/to/w257-pre-v2-34-release-candidate-package.json');
  }
  const resolved = path.resolve(packagePath);
  if (!fs.existsSync(resolved)) {
    fail(`W257 package not found: ${resolved}`);
  }
  return resolved;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function validateW257Package(pkg) {
  assertEqual(pkg.fixture_type, 'w257-pre-v2-34-release-candidate-package', 'fixture_type');
  assertEqual(pkg.release_candidate_type, 'pre_v2_public_safe_34_v1_compatible_approved_examples', 'release_candidate_type');
  assertEqual(pkg.candidate_count, 34, 'candidate_count');
  assertEqual(pkg.public_export_mutation, false, 'public_export_mutation');
  assertEqual(pkg.public_selection_mutation, false, 'public_selection_mutation');
  assertEqual(pkg.release_candidate_publication_authorized, false, 'release_candidate_publication_authorized');

  const inventory = requireArray(pkg.candidate_inventory, 'candidate_inventory');
  assertEqual(inventory.length, 34, 'candidate_inventory length');
  const candidateIds = inventory.map((entry, index) => {
    const id = requireString(entry.example_id, `candidate_inventory[${index}].example_id`);
    assertEqual(entry.pre_v2_release_candidate_state, 'included_v1_compatible_approved_public', `${id}.pre_v2_release_candidate_state`);
    assertEqual(entry.source_classification, 'v1_compatible_now', `${id}.source_classification`);
    return id;
  });
  assertUnique(candidateIds, 'candidate_inventory.example_id');

  const deniedInInventory = DENIED_SURFACE_IDS.filter((id) => candidateIds.includes(id));
  if (deniedInInventory.length > 0) {
    fail(`Denied surface ids appeared in W257 candidate inventory: ${deniedInInventory.join(', ')}`);
  }

  const excludedRows = requireArray(pkg.excluded_rows, 'excluded_rows');
  const excludedIds = new Set(excludedRows.map((row) => row.surface_id).filter(Boolean));
  for (const requiredExcluded of ['hello-provider', 'cedar-local-policy', 'w233-private-candidates']) {
    if (!excludedIds.has(requiredExcluded)) {
      fail(`W257 excluded_rows must include ${requiredExcluded}`);
    }
  }

  return candidateIds.sort();
}

function validateIndexCopy(index) {
  if (!index.includes('34 approved public examples')) {
    fail('Docs examples index must state "34 approved public examples".');
  }
  for (const deniedText of [
    '35 approved public examples',
    '1 extension-authoring example',
    '## Extension Authoring',
    'hello-provider',
  ]) {
    if (index.includes(deniedText)) {
      fail(`Docs examples index contains pre-v2 denied text: ${deniedText}`);
    }
  }
}

function validateIndexLinks(index, candidateIds) {
  const linkIds = new Set();
  const linkPattern = /\]\(\/nxuskit\/examples\/(?:patterns|integrations|apps)\/([^/)]+)\/\)/g;
  for (const match of index.matchAll(linkPattern)) {
    linkIds.add(match[1]);
  }
  assertSetEqual([...linkIds].sort(), candidateIds, 'docs examples index links');
}

function validateCandidateRoutes(candidateIds) {
  const missing = [];
  for (const id of candidateIds) {
    if (!findRoutePath(id)) missing.push(id);
  }
  if (missing.length > 0) {
    fail(`W257 candidates missing routed Docs source pages: ${missing.join(', ')}`);
  }
}

function validateDeniedSurfacesAbsent() {
  const sourceFiles = listMarkdownFiles(EXAMPLES_ROOT);
  const findings = [];
  for (const filePath of sourceFiles) {
    const text = fs.readFileSync(filePath, 'utf8');
    for (const deniedId of DENIED_SURFACE_IDS) {
      if (text.includes(deniedId)) {
        findings.push(`${path.relative(REPO_ROOT, filePath)} contains ${deniedId}`);
      }
    }
  }

  for (const deniedId of DENIED_SURFACE_IDS) {
    const route = findRoutePath(deniedId);
    if (route) {
      findings.push(`${path.relative(REPO_ROOT, route)} is a denied pre-v2 route`);
    }
  }

  if (findings.length > 0) {
    fail(`Denied pre-v2 surfaces are present:\n- ${findings.join('\n- ')}`);
  }
}

function findRoutePath(id) {
  for (const category of CATEGORIES) {
    const routePath = path.join(EXAMPLES_ROOT, category, id, 'index.md');
    if (fs.existsSync(routePath)) return routePath;
  }
  return null;
}

function listMarkdownFiles(root) {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function requireArray(value, pointer) {
  if (!Array.isArray(value)) fail(`${pointer} must be an array`);
  return value;
}

function requireString(value, pointer) {
  if (typeof value !== 'string' || value.length === 0) {
    fail(`${pointer} must be a non-empty string`);
  }
  return value;
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    fail(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
  }
}

function assertUnique(values, label) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  if (duplicates.size > 0) {
    fail(`${label} has duplicates: ${[...duplicates].join(', ')}`);
  }
}

function assertSetEqual(actual, expected, label) {
  const missing = expected.filter((value) => !actual.includes(value));
  const extra = actual.filter((value) => !expected.includes(value));
  if (missing.length > 0 || extra.length > 0) {
    fail(`${label} mismatch\nMissing: ${missing.join(', ') || '(none)'}\nExtra: ${extra.join(', ') || '(none)'}`);
  }
}

function fail(message) {
  console.error(`W260 validation failed: ${message}`);
  process.exit(1);
}

main();
