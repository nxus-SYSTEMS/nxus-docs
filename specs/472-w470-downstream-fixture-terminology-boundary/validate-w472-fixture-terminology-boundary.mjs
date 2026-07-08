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
  /\bDocs W472\b/,
  /\bNXUSKIT-V2-MEGA-20260605\b/,
  /\bprivate\/no-deploy\b/i,
  /\bdownstream fixture terminology boundary\b/i,
  /\bNo Public Authority Opened\b/,
  /\bFixture-intake Evidence Classification\b/,
  /\bSafe Terminology Classes\b/,
  /\bDenied Public Claims\b/,
  /\bPublication Gates\b/,
  /\bOptions And Recommendation\b/,
  /\bW500\/W501 ceiling guard\b/i,
];

const REQUIRED_EVIDENCE_PATTERNS = [
  /\bSDK W470\b/,
  /\b98d8f2dca7d50ecd7404413f149f9cf38f6f1e6e\b/,
  /\bSDK W466\b/,
  /\badf814a0a8c0894312d701ae54e4dfd3c0fc07b4\b/,
  /\bExamples W467\b/,
  /\bdf5bd773c72f48653c044e6418cba05cefb8d7cc\b/,
  /\bCelerat W468\b/,
  /\b1760b78dc8d78127719189e38adf7c8d709572bf\b/,
  /\bPeeler W469\b/,
  /\b25dd87fbff52701a076fc4985a3fe4dd250766b2\b/,
  /\bDocs W459\b/,
  /\b40a3b795f7b4e4732a02aeae373e6cd13ce4cb34\b/,
  /\bDocs W451\b/,
  /\b01c85ac88ebdfbf5bef1ddb99240e1ef3eb3315a\b/,
  /\bDocs W428\b/,
  /\b82b32ae54e35a1f86885c834f9bdd897fe562f01\b/,
  /\bDocs W418\b/,
];

const REQUIRED_SAFE_TERMS = [
  /\bprivate fixture-intake evidence\b/i,
  /\bdownstream fixture intake\b/i,
  /\bprivate_discovery_terminology_copy_boundary_fixture_check_w466\b/,
  /\bdiscovery_terminology_copy_boundary_private_fixture_check\b/,
  /\bcaller_provided_private_json\b/,
  /\brequest-access wording is future candidate only\b/i,
  /\bProduct Catalog\/Odoo remains future-gated only\b/i,
  /\bW500\/W501 ceiling guard\b/i,
  /\bno W502\+ work\b/i,
];

const REQUIRED_DENIALS = [
  /\bruntime discovery\b/i,
  /\bDataFusion runtime\b/i,
  /\basync dispatch\b/i,
  /\bprovider registry\/runtime-provider\b/i,
  /\bpublic SDK API\/schema\/CLI\/wrapper\b/i,
  /\bCE\/OSS deep discovery\b/i,
  /\bSQL execution\/materialization\/live handles\/inline rows\/Arrow batches\b/i,
  /\bProduct Catalog\/Odoo grant\/population\b/i,
  /\bsupport\/compliance\/security\b/i,
  /\brelease\/package\/deploy\b/i,
  /\bpublic request-access availability\b/i,
  /\bdemo\/general-Pro expansion\b/i,
  /\bproduction-ready overclaims\b/i,
  /\bW502\+ authority\b/i,
];

const REQUIRED_GATE_PATTERNS = [
  /\bManager\/Operator approval\b/i,
  /\bexact customer-facing phrasing\b/i,
  /\bpublic-surface scans\b/i,
  /\bpublication\/deploy authority\b/i,
  /\brollback plan\b/i,
  /\bW451\/W459\/W428\/W418\b/,
  /\bW502\+ work requires explicit operator permission\b/i,
];

const PUBLIC_SURFACE_DENIED_PATTERNS = [
  ['W472 private wave reference', /\bW472\b/],
  ['W470/W466-W469 private wave reference', /\bW470\b|\bW46[6-9]\b/],
  ['W502+ ceiling leak', /\bW502\+\b|\bW50[2-9]\b/],
  ['private receiver marker reference', /\bREADY_(?:SDK|DOCS|EXAMPLES|CELERAT|PEELER)_[A-Z0-9_]+\b/],
  [
    'private checkpoint reference',
    /\b98d8f2dca7d50ecd7404413f149f9cf38f6f1e6e\b|\badf814a0a8c0894312d701ae54e4dfd3c0fc07b4\b|\bdf5bd773c72f48653c044e6418cba05cefb8d7cc\b|\b1760b78dc8d78127719189e38adf7c8d709572bf\b|\b25dd87fbff52701a076fc4985a3fe4dd250766b2\b|\b40a3b795f7b4e4732a02aeae373e6cd13ce4cb34\b|\b01c85ac88ebdfbf5bef1ddb99240e1ef3eb3315a\b|\b82b32ae54e35a1f86885c834f9bdd897fe562f01\b/,
  ],
  ['private fixture ref', /\bprivate_discovery_terminology_copy_boundary_fixture_check_w466\b|\bdiscovery_terminology_copy_boundary_private_fixture_check\b/],
  ['caller private JSON term', /\bcaller_provided_private_json\b/],
  ['public request-access availability claim', /\brequest-access\b[\s\S]{0,220}\b(available|availability|enable|enabled|self-serve|runtime|public)\b/i],
  [
    'public discovery authority overclaim',
    /\b(discovery|fixture intake|terminology fixture)\b[\s\S]{0,220}\b(public API|public schema|public CLI|public wrapper|SDK wrapper|provider registry|runtime-ready|release-ready|package-ready|request-access availability)\b/i,
  ],
  [
    'DataFusion runtime availability claim',
    /\bDataFusion\b[\s\S]{0,220}\b(runtime availability|runtime execution|gateway execution|CE runtime|OSS runtime|public API|public schema|provider registry)\b/i,
  ],
  [
    'Product Catalog/Odoo grant claim',
    /\b(Product Catalog|Odoo)\b[\s\S]{0,220}\b(discovery grant|feature grant|customer-visible grant|SKU grant|production population|grant population)\b/i,
  ],
  ['support/compliance/security authority', /\b(support|compliance|security)[-_ ]ready\b|\bguaranteed safe\b|\bHIPAA-compliant\b|\bSOC 2 compliant\b/i],
  ['production-ready overclaim', /\bprod(?:uction)?[- ]?ready\b|\bProduction-Ready\b/iu],
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
  '.mdx',
  '.mjs',
  '.txt',
  '.xml',
  '.yaml',
  '.yml',
]);

function main() {
  const checkDist = process.argv.includes('--dist');
  validatePacket();
  scanPublicSurface(PUBLIC_DOCS_ROOT, 'src/content/docs');
  if (checkDist) {
    if (!fs.existsSync(DIST_ROOT)) {
      fail('dist output does not exist; run npm run build before --dist validation');
    }
    scanPublicSurface(DIST_ROOT, 'dist');
  }

  console.log('W472 downstream fixture terminology boundary validation passed');
  console.log(`Boundary packet: ${relativePath(README)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validatePacket() {
  const text = readText(README);
  validateRequired(text, EXPECTED_PACKET_PATTERNS, README);
  validateRequired(text, REQUIRED_EVIDENCE_PATTERNS, README);
  validateRequired(text, REQUIRED_SAFE_TERMS, README);
  validateRequired(text, REQUIRED_DENIALS, README);
  validateRequired(text, REQUIRED_GATE_PATTERNS, README);
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
