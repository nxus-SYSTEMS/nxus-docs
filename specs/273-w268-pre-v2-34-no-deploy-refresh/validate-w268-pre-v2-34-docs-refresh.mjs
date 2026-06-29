#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const EXAMPLES_ROOT = path.join(REPO_ROOT, 'src/content/docs/nxuskit/examples');
const INDEX_PATH = path.join(EXAMPLES_ROOT, 'index.md');
const DIST_EXAMPLES_ROOT = path.join(REPO_ROOT, 'dist/nxuskit/examples');
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

const REQUIRED_EXCLUSION_FLAGS = [
  'cedar_local_policy_present_in_export',
  'generated_public_artifacts_committed',
  'hello_provider_present_in_export',
  'internal_preview_artifacts_present_in_export',
  'v2_only_public_preview_rows_present_in_export',
  'w233_private_candidates_present_in_export',
];

const EXPECTED_FALSE_FLAGS = [
  'public_selection_expansion',
  'public_export_push',
  'public_mirror_push',
  'generated_public_artifact_mutation',
  'generated_public_artifact_committed',
  'downstream_prompts_sent',
  'release_tag_package_mutation',
  'sdk_runtime_provider_registry_mutation',
];

const FORBIDDEN_READY_PATTERNS = [
  /\bpublic[-_ ]ready\b/i,
  /\brelease[-_ ]ready\b/i,
  /\bprovider[-_ ]registry[-_ ]ready\b/i,
  /\bapi[-_ ]ready\b/i,
  /\bruntime[-_ ]ready\b/i,
  /\bpackage[-_ ]ready\b/i,
  /\bgenerated[-_ ]artifact[-_ ]ready\b/i,
  /\bsupport[-_ ]ready\b/i,
  /\bprovider registry\b/i,
  /\bruntime\/provider execution\b/i,
  /\bsource refresh\b/i,
];

function main() {
  const options = parseArgs(process.argv.slice(2));
  const pkg = readJson(options.packagePath);
  const expectedIds = validateW268Package(pkg);
  validateDocsSource(expectedIds);
  if (options.checkDist) validateBuiltOutput(expectedIds);

  console.log('W273 W268 pre-v2 34 docs refresh validation passed');
  console.log(`W268 examples_count: ${expectedIds.length}`);
  console.log(`Docs source candidate links: ${expectedIds.length}`);
  console.log(`Built output checked: ${options.checkDist}`);
}

function parseArgs(args) {
  const packageFlagIndex = args.indexOf('--package');
  const packagePath = packageFlagIndex >= 0 ? args[packageFlagIndex + 1] : process.env.W268_PACKAGE;
  if (!packagePath) {
    fail('Usage: validate-w268-pre-v2-34-docs-refresh.mjs --package /path/to/w268-pre-v2-34-export-rc-package.json [--dist]');
  }
  const resolvedPackagePath = path.resolve(packagePath);
  if (!fs.existsSync(resolvedPackagePath)) {
    fail(`W268 package not found: ${resolvedPackagePath}`);
  }
  return {
    packagePath: resolvedPackagePath,
    checkDist: args.includes('--dist'),
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function validateW268Package(pkg) {
  assertEqual(pkg.fixture_type, 'w268-pre-v2-34-export-release-candidate-package', 'fixture_type');
  for (const field of EXPECTED_FALSE_FLAGS) {
    assertEqual(pkg[field], false, field);
  }
  const sourcePackages = requireObject(pkg.source_packages, 'source_packages');
  requireString(sourcePackages.w257_package, 'source_packages.w257_package');
  requireString(sourcePackages.w259_package, 'source_packages.w259_package');
  assertEqual(sourcePackages.w267_commit, '78437af167741ae385b22b06558ade19d7fab04b', 'source_packages.w267_commit');

  const inventory = requireObject(pkg.final_export_inventory, 'final_export_inventory');
  assertEqual(inventory.candidate_count, 34, 'final_export_inventory.candidate_count');
  assertEqual(inventory.exported_manifest_count, 34, 'final_export_inventory.exported_manifest_count');
  assertEqual(inventory.exported_selection_approved_count, 34, 'final_export_inventory.exported_selection_approved_count');
  assertEqual(inventory.exported_selection_excluded_count, 0, 'final_export_inventory.exported_selection_excluded_count');
  const expectedIds = requireStringArray(inventory.expected_example_ids, 'final_export_inventory.expected_example_ids');
  assertEqual(expectedIds.length, 34, 'final_export_inventory.expected_example_ids length');
  assertUnique(expectedIds, 'final_export_inventory.expected_example_ids');

  const snapshotCounts = requireObject(pkg.release_snapshot_counts, 'release_snapshot_counts');
  assertEqual(snapshotCounts.examples_count, 34, 'release_snapshot_counts.examples_count');
  assertEqual(snapshotCounts.approved_count, 34, 'release_snapshot_counts.approved_count');
  assertEqual(snapshotCounts.excluded_count, 0, 'release_snapshot_counts.excluded_count');
  assertEqual(snapshotCounts.matches_export_inventory, true, 'release_snapshot_counts.matches_export_inventory');

  const excludedRowsProof = requireObject(pkg.excluded_rows_proof, 'excluded_rows_proof');
  for (const field of REQUIRED_EXCLUSION_FLAGS) {
    assertEqual(excludedRowsProof[field], false, `excluded_rows_proof.${field}`);
  }
  const generatedDisposition = requireObject(pkg.generated_output_disposition, 'generated_output_disposition');
  assertEqual(generatedDisposition.committed_generated_public_artifacts, false, 'generated_output_disposition.committed_generated_public_artifacts');

  const deniedInInventory = DENIED_SURFACE_IDS.filter((id) => expectedIds.includes(id));
  if (deniedInInventory.length > 0) {
    fail(`Denied surface ids appeared in W268 final export inventory: ${deniedInInventory.join(', ')}`);
  }

  return [...expectedIds].sort();
}

function validateDocsSource(expectedIds) {
  const index = fs.readFileSync(INDEX_PATH, 'utf8');
  if (!index.includes('34 approved public examples')) {
    fail('Docs examples index must state "34 approved public examples".');
  }
  validateNoDeniedText(index, 'src/content/docs/nxuskit/examples/index.md');
  validateIndexLinks(index, expectedIds);
  validateCandidateRoutes(expectedIds);
  validateNoDeniedTextInFiles(listMarkdownFiles(EXAMPLES_ROOT), 'source examples docs');
}

function validateBuiltOutput(expectedIds) {
  if (!fs.existsSync(DIST_EXAMPLES_ROOT)) {
    fail('dist/nxuskit/examples does not exist; run npm run build before --dist validation');
  }
  const indexPath = path.join(DIST_EXAMPLES_ROOT, 'index.html');
  if (!fs.existsSync(indexPath)) {
    fail('dist examples index is missing');
  }
  const builtIndex = fs.readFileSync(indexPath, 'utf8');
  if (!builtIndex.includes('34 approved public examples')) {
    fail('Built examples index must state "34 approved public examples".');
  }
  validateNoDeniedTextInFiles(listFiles(DIST_EXAMPLES_ROOT), 'built examples output');
  for (const id of expectedIds) {
    if (!findBuiltRoutePath(id)) {
      fail(`W268 candidate missing built route: ${id}`);
    }
  }
}

function validateIndexLinks(index, expectedIds) {
  const linkIds = new Set();
  const linkPattern = /\]\(\/nxuskit\/examples\/(?:patterns|integrations|apps)\/([^/)]+)\/\)/g;
  for (const match of index.matchAll(linkPattern)) {
    linkIds.add(match[1]);
  }
  assertSetEqual([...linkIds].sort(), expectedIds, 'docs examples index links');
}

function validateCandidateRoutes(expectedIds) {
  const missing = [];
  for (const id of expectedIds) {
    if (!findSourceRoutePath(id)) missing.push(id);
  }
  if (missing.length > 0) {
    fail(`W268 candidates missing routed Docs source pages: ${missing.join(', ')}`);
  }
}

function validateNoDeniedTextInFiles(filePaths, label) {
  const findings = [];
  for (const filePath of filePaths) {
    const text = fs.readFileSync(filePath, 'utf8');
    const relative = path.relative(REPO_ROOT, filePath);
    const fileFindings = deniedFindings(text, relative);
    findings.push(...fileFindings);
  }
  if (findings.length > 0) {
    fail(`${label} contains denied pre-v2 text:\n- ${findings.join('\n- ')}`);
  }
}

function validateNoDeniedText(text, label) {
  const findings = deniedFindings(text, label);
  if (findings.length > 0) {
    fail(`${label} contains denied pre-v2 text:\n- ${findings.join('\n- ')}`);
  }
}

function deniedFindings(text, label) {
  const findings = [];
  for (const deniedId of DENIED_SURFACE_IDS) {
    if (text.includes(deniedId)) findings.push(`${label} contains ${deniedId}`);
  }
  for (const deniedText of ['35 approved public examples', '1 extension-authoring example']) {
    if (text.includes(deniedText)) findings.push(`${label} contains ${deniedText}`);
  }
  for (const pattern of FORBIDDEN_READY_PATTERNS) {
    if (pattern.test(text)) findings.push(`${label} matches forbidden claim pattern ${pattern}`);
  }
  return findings;
}

function findSourceRoutePath(id) {
  for (const category of CATEGORIES) {
    const routePath = path.join(EXAMPLES_ROOT, category, id, 'index.md');
    if (fs.existsSync(routePath)) return routePath;
  }
  return null;
}

function findBuiltRoutePath(id) {
  for (const category of CATEGORIES) {
    const routePath = path.join(DIST_EXAMPLES_ROOT, category, id, 'index.html');
    if (fs.existsSync(routePath)) return routePath;
  }
  return null;
}

function listMarkdownFiles(root) {
  return listFiles(root).filter((filePath) => filePath.endsWith('.md'));
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

function requireObject(value, pointer) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${pointer} must be an object`);
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
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string' && item.length > 0)) {
    fail(`${pointer} must be an array of non-empty strings`);
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
  console.error(`W273 validation failed: ${message}`);
  process.exit(1);
}

main();
