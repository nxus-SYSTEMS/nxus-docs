#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

const README = path.join(__dirname, 'README.md');
const PUBLIC_DOCS_ROOT = path.join(REPO_ROOT, 'src/content/docs');
const DIST_ROOT = path.join(REPO_ROOT, 'dist');

const EXPECTED_PACKET_PATTERNS = [
  /\bREADY_DOCS_W326_CONTROL_DECISION_NO_DEPLOY_ROUTED_COPY_CANDIDATE\b/,
  /\bREADY_DOCS_W338_DEPLOYMENT_TOKEN_FEATURE_OVERRIDE_NO_DEPLOY_READINESS\b/,
  /\bREADY_WEBSITE_W324_PRIVATE_CONTROL_DECISION_COPY_BOUNDARY_DRAFT\b/,
  /\bREADY_WEBSITE_W332_PRODUCT_CATALOG_FEATURE_OVERRIDE_SOURCE\b/,
  /\bREADY_SDK_W364_PRIVATE_DEPENDENCY_MODE_DECISION_PACKET\b/,
  /\bREADY_LICENSING_W330_DEPLOYMENT_TOKEN_SUPPORT_AGREEMENT_IMPLEMENTATION\b/,
  /\bREADY_LICENSING_W331_PRODUCT_CATALOG_FEATURE_OVERRIDE_CONSUMER\b/,
  /\ba16e332\b/,
  /\b6aed16e\b/,
  /\ba4e11613773687a47b541592550021dd4cbb8cdc\b/,
  /\b8faa7e4442c2a8133c60ff9364b53e93a08b7445\b/,
  /\bc03e3007d4691c3e2dddd7127817f370fe6c0c1d\b/,
  /\b150bcd3b382a8bbb3593779b16378ac4ee1dd100\b/,
  /\b033686d607da8b7d106237c0b31c22ed0ecbf4d0\b/,
  /\bW367\b[\s\S]{0,120}\bmanager-declared\b/i,
  /\bW368\b[\s\S]{0,120}\bmanager-declared\b/i,
  /\bW369\b[\s\S]{0,120}\bmanager-declared\b/i,
  /\bprivate\/no-deploy\b/i,
  /\bSafe Now\b/,
  /\bNeeds Confirmation\b/,
  /\bMust Remain Private\b/,
  /\bPublication Gates\b/,
  /\bOptions And Recommendation\b/,
  /\bno public support or compliance claim\b/i,
];

const REQUIRED_SAFE_NOW_PATTERNS = [
  /\blocal control decisions\b/i,
  /\bconsequence boundaries\b/i,
  /\bdeployment tokens\b/i,
  /\bactive support agreement\b/i,
  /\bcommercial coverage\b/i,
  /\bcatalog-controlled feature access\b/i,
  /\bvalidated account data\b/i,
  /\bsafe denial text\b/i,
];

const REQUIRED_CONFIRMATION_PATTERNS = [
  /\bSDK W367\b/i,
  /\bLicensing W368\b/i,
  /\bWebsite W369\b/i,
  /\bapproved customer-facing wording\b/i,
  /\bseparate publication gate\b/i,
];

const PRIVATE_BOUNDARY_PATTERNS = [
  /\bpublic API\b/i,
  /\bpublic schema\b/i,
  /\bruntime provider\b/i,
  /\bprovider registry\b/i,
  /\brelease\/package\b/i,
  /\bsupport readiness\b/i,
  /\bcompliance readiness\b/i,
  /\bguaranteed support outcomes\b/i,
];

const PUBLIC_SURFACE_DENIED_PATTERNS = [
  ['W370 private wave reference', /\bW370\b/],
  ['W367/W368/W369 private wave reference', /\bW36[789]\b/],
  ['W330/W331/W332 raw private wave reference', /\bW33[012]\b/],
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
    'launch public API/schema authority',
    /\b(local control decisions?|deployment tokens?|feature access|account coverage)\b[\s\S]{0,180}\b(public API|public schema)\b/i,
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

const UNFINISHED_MARKER_PATTERNS = [
  [
    'unfinished marker token',
    new RegExp(
      String.raw`\b(?:TO${'DO'}|T${'BD'}|FIX${'ME'}|CHANGE${'ME'}|REPLACE_${'ME'}|PLACE${'HOLDER'}|X${'XX'})\b`,
    ),
  ],
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
  validatePacket();
  scanPublicSurface(PUBLIC_DOCS_ROOT, 'src/content/docs');
  if (checkDist) scanPublicSurface(DIST_ROOT, 'dist');

  console.log('W370 launch-readiness synthesis validation passed');
  console.log(`Readiness packet: ${relativePath(README)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validatePacket() {
  const text = readText(README);
  validateRequired(text, EXPECTED_PACKET_PATTERNS, README);
  validateRequired(text, REQUIRED_SAFE_NOW_PATTERNS, README);
  validateRequired(text, REQUIRED_CONFIRMATION_PATTERNS, README);
  validateRequired(text, PRIVATE_BOUNDARY_PATTERNS, README);
  validatePatterns(text, LOCAL_EVIDENCE_PATTERNS, README);
  validatePatterns(text, UNFINISHED_MARKER_PATTERNS, README);
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
