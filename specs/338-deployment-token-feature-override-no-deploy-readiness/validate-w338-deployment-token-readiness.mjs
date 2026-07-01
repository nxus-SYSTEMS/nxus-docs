#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

const README = path.join(__dirname, 'README.md');
const CANDIDATE_COPY = path.join(__dirname, 'public-safe-candidate-copy.md');
const PUBLIC_DOCS_ROOT = path.join(REPO_ROOT, 'src/content/docs');
const DIST_ROOT = path.join(REPO_ROOT, 'dist');

const EXPECTED_README_PATTERNS = [
  /\bREADY_LICENSING_W330_DEPLOYMENT_TOKEN_SUPPORT_AGREEMENT_IMPLEMENTATION\b/,
  /\bREADY_LICENSING_W331_PRODUCT_CATALOG_FEATURE_OVERRIDE_CONSUMER\b/,
  /\bREADY_WEBSITE_W332_PRODUCT_CATALOG_FEATURE_OVERRIDE_SOURCE\b/,
  /\b150bcd3b382a8bbb3593779b16378ac4ee1dd100\b/,
  /\b033686d607da8b7d106237c0b31c22ed0ecbf4d0\b/,
  /\b8faa7e4442c2a8133c60ff9364b53e93a08b7445\b/,
  /\bno-deploy\b/i,
  /\bprivate\/non-routed\b/i,
  /\bno public support or compliance claim\b/i,
];

const REQUIRED_CANDIDATE_PATTERNS = [
  /\bdeployment token\b/i,
  /\bactive support agreement\b/i,
  /\bcommercial coverage\b/i,
  /\bcatalog-controlled\b/i,
  /\bvalidated account data\b/i,
  /\baccount email\b/i,
  /\bfeature access\b/i,
  /\bsafe denial\b/i,
  /\bNo customer action was taken\b/,
];

const CANDIDATE_DENIED_PATTERNS = [
  ['W330/W331/W332 wave name', /\bW33[012]\b/],
  ['raw source field', /\bfeatures_json\b|\bfeatures_override\b|\bsupport_active\b|\bcustomer_email\b/],
  ['Odoo name', /\bOdoo\b/i],
  ['class-like control name', /\bControlDecision\b/],
  ['raw stage label', /\bStage\s*0\/1\/2\b|\bStage\s+[012]\b|\bstage[012]\b/i],
  ['provider registry', /\bprovider[-_ ]registry\b/i],
  ['runtime provider', /\bruntime[-_ ]provider\b/i],
  ['runtime ready', /\bruntime[-_ ]ready\b/i],
  ['release ready', /\brelease[-_ ]ready\b/i],
  ['package ready', /\bpackage[-_ ]ready\b/i],
  ['support ready', /\bsupport[-_ ]ready\b|\bsupport readiness\b/i],
  ['compliance claim', /\bcompliance\b/i],
  ['public API', /\bpublic API\b/i],
  ['public schema', /\bpublic schema\b/i],
  ['guarantee claim', /\bguarantee(?:d|s)?\b/i],
  ['support promise', /\bsupport (?:will|must|shall|can)\b/i],
];

const PUBLIC_SURFACE_DENIED_PATTERNS = [
  ['W338 private wave reference', /\bW338\b/],
  ['W330/W331/W332 private wave reference', /\bW33[012]\b/],
  ['raw feature source field', /\bfeatures_json\b|\bfeatures_override\b|\bsupport_active\b|\bcustomer_email\b/],
  ['Odoo name', /\bOdoo\b/i],
  ['class-like control name', /\bControlDecision\b/],
  ['raw stage label', /\bStage\s*0\/1\/2\b/i],
  ['provider-registry-ready authority', /\bprovider[-_ ]registry[-_ ]ready\b/i],
  ['runtime-ready authority', /\bruntime[-_ ]ready\b/i],
  ['release-ready authority', /\brelease[-_ ]ready\b/i],
  ['package-ready authority', /\bpackage[-_ ]ready\b/i],
  ['support-ready authority', /\bsupport[-_ ]ready\b|\bsupport readiness\b/i],
  ['compliance-ready authority', /\bcompliance[-_ ]ready\b|\bcompliance readiness\b/i],
  [
    'deployment-token public API/schema authority',
    /\bdeployment token\b[\s\S]{0,180}\b(public API|public schema)\b/i,
  ],
];

const UNFINISHED_MARKER_PATTERNS = [
  [
    'unfinished marker token',
    new RegExp(
      String.raw`\b(?:TO${'DO'}|T${'BD'}|FIX${'ME'}|CHANGE${'ME'}|REPLACE_${'ME'}|PLACE${'HOLDER'}|X${'XX'})\b`,
    ),
  ],
];

const CODE_REPOS_FRAGMENT = new RegExp(String.raw`\bcode${'Repos'}\b`);
const PRIVATE_SDK_REPO_NAME = new RegExp(String.raw`\bnxusKit-${'internal'}\b`);
const PRIVATE_EXAMPLES_REPO_NAME = new RegExp(String.raw`\bnxusKit-examples-${'internal'}\b`);
const INTERNAL_PREVIEW_PATH = new RegExp(String.raw`\b${'internal'}/preview\b`);
const SENSITIVE_TOKEN_TEXT = new RegExp(
  String.raw`\b(?:AWS_${'SEC'}${'RET'}|PASS${'WORD'}|SE${'CR'}${'ET'}|BEGIN RSA ${'PRIVATE'} KEY|BEGIN OPENSSH ${'PRIVATE'} KEY|BEGIN ${'PRIVATE'} KEY)\b`,
);

const LOCAL_EVIDENCE_PATTERNS = [
  ['home absolute path', /\/Users\//],
  ['repo absolute path fragment', CODE_REPOS_FRAGMENT],
  ['private tmp path', /\/private\/tmp\b|\/tmp\/worktrees\b/],
  ['internal preview package path', INTERNAL_PREVIEW_PATH],
  ['private SDK repo name', PRIVATE_SDK_REPO_NAME],
  ['private Examples repo name', PRIVATE_EXAMPLES_REPO_NAME],
  ['sensitive token', SENSITIVE_TOKEN_TEXT],
];

const TEXT_EXTENSIONS = new Set([
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
  const checkDist = process.argv.includes('--dist');
  validateReadinessPacket();
  validateCandidateCopy();
  scanLocalEvidence([README, CANDIDATE_COPY, path.join(__dirname, 'validate-w338-deployment-token-readiness.mjs')]);
  scanPublicSurface(PUBLIC_DOCS_ROOT, 'src/content/docs');
  if (checkDist) scanPublicSurface(DIST_ROOT, 'dist');

  console.log('W338 deployment-token feature-override readiness validation passed');
  console.log(`Readiness packet: ${relativePath(README)}`);
  console.log(`Candidate copy: ${relativePath(CANDIDATE_COPY)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validateReadinessPacket() {
  const text = readText(README);
  validateRequired(text, EXPECTED_README_PATTERNS, README);
  validatePatterns(text, UNFINISHED_MARKER_PATTERNS, README);
}

function validateCandidateCopy() {
  const text = readText(CANDIDATE_COPY);
  validateRequired(text, REQUIRED_CANDIDATE_PATTERNS, CANDIDATE_COPY);
  validatePatterns(text, CANDIDATE_DENIED_PATTERNS, CANDIDATE_COPY);
  validatePatterns(text, UNFINISHED_MARKER_PATTERNS, CANDIDATE_COPY);
}

function scanLocalEvidence(paths) {
  for (const entryPath of paths) {
    if (!fs.existsSync(entryPath)) continue;
    const stat = fs.statSync(entryPath);
    if (stat.isDirectory()) {
      for (const file of walkTextFiles(entryPath)) {
        validatePatterns(readText(file), LOCAL_EVIDENCE_PATTERNS, file);
      }
    } else {
      validatePatterns(readText(entryPath), LOCAL_EVIDENCE_PATTERNS, entryPath);
    }
  }
}

function scanPublicSurface(root, label) {
  if (!fs.existsSync(root)) return;
  for (const file of walkTextFiles(root)) {
    validatePatterns(readText(file), PUBLIC_SURFACE_DENIED_PATTERNS, file, label);
  }
}

function validateRequired(text, patterns, file) {
  for (const pattern of patterns) {
    if (!pattern.test(text)) {
      fail(`${relativePath(file)} missing required pattern ${pattern}`);
    }
  }
}

function validatePatterns(text, patterns, file, treeLabel = '') {
  for (const [label, pattern] of patterns) {
    if (pattern.test(text)) {
      const scope = treeLabel ? `${treeLabel}: ` : '';
      fail(`${scope}${relativePath(file)} contains denied ${label}`);
    }
  }
}

function* walkTextFiles(root) {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      yield* walkTextFiles(entryPath);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!TEXT_EXTENSIONS.has(path.extname(entry.name))) continue;
    yield entryPath;
  }
}

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    fail(`failed to read ${relativePath(file)}`);
  }
}

function relativePath(file) {
  return path.relative(REPO_ROOT, file);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main();
