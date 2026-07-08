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
  /\bDocs W451\b/,
  /\bNXUSKIT-V2-MEGA-20260605\b/,
  /\bprivate\/no-deploy\b/i,
  /\bdiscovery envelope\b/i,
  /\bNo Public Authority Opened\b/,
  /\bSafe-now Internal Wording\b/,
  /\bDenied Public Wording\b/,
  /\bPublication Gates\b/,
  /\bOptions And Recommendation\b/,
  /\bno public support or compliance claim\b/i,
];

const REQUIRED_EVIDENCE_PATTERNS = [
  /\bREADY_SDK_W445_PRIVATE_DISCOVERY_ENVELOPE_DOWNSTREAM_HANDOFF\b/,
  /\b927112f410e8704a0e4963d3d6d8928cc2b207c3\b/,
  /\bREADY_SDK_W441_PRIVATE_DISCOVERY_REQUEST_RESPONSE_ENVELOPE\b/,
  /\b1bb2373f9adc2a8cfc3c1e3ff3f4470befcc1129\b/,
  /\bREADY_DOCS_W418_PUBLIC_SAFE_TERMINOLOGY_CLAIM_BOUNDARY_PACKET\b/,
  /\be9d1b990f5f8413d8c3b733136db9be9788c5b39\b/,
  /\bREADY_DOCS_W428_PRODUCTION_READY_WORDING_SCRUB\b/,
  /\b82b32ae54e35a1f86885c834f9bdd897fe562f01\b/,
  /\bLicensing W409\b/,
  /\b36cebf1\b/,
  /\bLicensing W436\b/,
  /\b91ef332\b/,
];

const REQUIRED_SAFE_PATTERNS = [
  /\bcaller-provided private evidence\b/i,
  /\bmetadata-only\b/i,
  /\bprovider\/data-engine discovery\b/i,
  /\bDataFusion-connected metadata\b/i,
  /\bCustom Provider Tables metadata\b/i,
  /\bC ABI bridge planning-only\b/i,
  /\bGo parity deferral\b/i,
  /\bexternal PlanRef-only\b/i,
  /\bno runtime execution\b/i,
  /\bno public schema\b/i,
];

const REQUIRED_DENIAL_PATTERNS = [
  /\bruntime discovery execution\b/i,
  /\bDataFusion runtime availability\b/i,
  /\bpublic API\/schema\/CLI\/wrapper\b/i,
  /\bprovider registry\b/i,
  /\bCE\/OSS deep discovery\b/i,
  /\bsupport\/compliance\/security guarantees\b/i,
  /\bproduction-ready overclaims\b/i,
  /\bProduct Catalog\/Odoo grant claims\b/i,
  /\binline SQL\b/i,
  /\bArrow batches\b/i,
  /\blive handles\b/i,
  /\bD10 expansion\b/i,
];

const REQUIRED_GATE_PATTERNS = [
  /\bexact upstream checkpoints\b/i,
  /\bapproved customer-facing phrasing\b/i,
  /\bpublic-surface scans\b/i,
  /\bpublication\/deploy authority\b/i,
  /\brollback plan\b/i,
];

const PUBLIC_SURFACE_DENIED_PATTERNS = [
  ['W451 private wave reference', /\bW451\b/],
  ['W445/W441 private wave reference', /\bW44[15]\b/],
  ['private receiver marker reference', /\bREADY_(?:SDK|DOCS|LICENSING)_[A-Z0-9_]+\b/],
  [
    'private checkpoint reference',
    /\b927112f410e8704a0e4963d3d6d8928cc2b207c3\b|\b1bb2373f9adc2a8cfc3c1e3ff3f4470befcc1129\b|\be9d1b990f5f8413d8c3b733136db9be9788c5b39\b|\b82b32ae54e35a1f86885c834f9bdd897fe562f01\b/,
  ],
  ['discovery envelope private term', /\bDiscoveryRequestResponseEnvelope\b|\bdiscovery envelope\b/i],
  ['DataFusion-connected metadata term', /\bDataFusion-connected metadata\b/i],
  ['Custom Provider Tables term', /\bCustom Provider Tables\b/i],
  ['external PlanRef-only posture term', /\bexternal PlanRef-only\b/i],
  [
    'discovery public authority overclaim',
    /\b(provider\/data-engine discovery|provider discovery|data-engine discovery|runtime discovery execution)\b[\s\S]{0,220}\b(public API|public schema|public CLI|public wrapper|SDK wrapper|provider registry|runtime-ready|release-ready|package-ready)\b/i,
  ],
  [
    'DataFusion runtime availability claim',
    /\bDataFusion\b[\s\S]{0,220}\b(runtime availability|runtime execution|gateway execution|CE runtime|OSS runtime|public API|public schema|provider registry)\b/i,
  ],
  [
    'C ABI public bridge overclaim',
    /\bC ABI\b[\s\S]{0,180}\b(public C SDK|runtime discovery|public schema|public API)\b/i,
  ],
  [
    'Product Catalog/Odoo grant claim',
    /\b(Product Catalog|Odoo)\b[\s\S]{0,220}\b(discovery grant|feature grant|customer-visible grant|SKU grant|production population)\b/i,
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

  console.log('W451 discovery envelope boundary validation passed');
  console.log(`Boundary packet: ${relativePath(README)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validatePacket() {
  const text = readText(README);
  validateRequired(text, EXPECTED_PACKET_PATTERNS, README);
  validateRequired(text, REQUIRED_EVIDENCE_PATTERNS, README);
  validateRequired(text, REQUIRED_SAFE_PATTERNS, README);
  validateRequired(text, REQUIRED_DENIAL_PATTERNS, README);
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
