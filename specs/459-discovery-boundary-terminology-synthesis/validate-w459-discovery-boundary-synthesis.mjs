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
  /\bDocs W459\b/,
  /\bNXUSKIT-V2-MEGA-20260605\b/,
  /\bprivate\/no-deploy\b/i,
  /\bdiscovery boundary terminology synthesis\b/i,
  /\bNo Public Authority Opened\b/,
  /\bSafe-now Internal Terminology\b/,
  /\bFuture Candidate Wording Classes\b/,
  /\bDenied Public Claims\b/,
  /\bPublication Gates\b/,
  /\bOptions And Recommendation\b/,
];

const REQUIRED_EVIDENCE_PATTERNS = [
  /\bDocs W451\b/,
  /\b01c85ac88ebdfbf5bef1ddb99240e1ef3eb3315a\b/,
  /\bWebsite W458\b/,
  /\b4bb4ca716315801ddc95ad431ea087c034f9d387\b/,
  /\bWebsite W452\b/,
  /\b7c090451ff315bf748d984546a6b01db047fb65a\b/,
  /\bSDK W457\b/,
  /\ba6afdb13ed5082a01f3013c14ea43940f2949d18\b/,
  /\bSDK W449\b/,
  /\b1593ba406b3be45661ca14b49ec0a3dfd5f2e84a\b/,
  /\bLicensing W450\b/,
  /\bed67214bb6480eb4192f9666e813580678683530\b/,
  /\bLicensing W456\b/,
  /\b7aec9fb2a08956c19688fb07c1c692ef437bd5ff\b/,
  /\bExamples W453\b/,
  /\bf3600a5819ded68630a790a72b6b3440dbe2c1b9\b/,
  /\bCelerat W454\b/,
  /\b4ef4f32c0eed5d919fae2a2edb00eb8ba9598326\b/,
  /\bPeeler W455\b/,
  /\bbedafd7488dc2b7d6aee00743de204cc9fcd0963\b/,
];

const REQUIRED_SAFE_TERMS = [
  /\bdiscovery envelope\b/i,
  /\bprovider discovery\b/i,
  /\bdata-engine discovery\b/i,
  /\bDataFusion-connected metadata\b/i,
  /\bCustom Provider Tables metadata\b/i,
  /\bC ABI bridge planning\b/i,
  /\bGo parity deferral\b/i,
  /\bexternal PlanRef-only posture\b/i,
  /\bcaller_provided_private_json\b/,
  /\bno-public\/no-runtime posture\b/i,
  /\brequest-access\b/i,
];

const REQUIRED_DENIALS = [
  /\bruntime discovery execution\b/i,
  /\bDataFusion runtime\b/i,
  /\bprovider registry\/runtime-provider\b/i,
  /\bpublic API\/schema\/CLI\/wrapper\b/i,
  /\bCE\/OSS deep discovery\b/i,
  /\bSQL execution\/materialization\/live handles\/inline rows\/Arrow batches\b/i,
  /\bProduct Catalog\/Odoo grant\/population\b/i,
  /\bsupport\/compliance\/security\b/i,
  /\brelease\/package\/deploy\b/i,
  /\bproduction-ready overclaims\b/i,
  /\bdemo\/general-Pro entitlement expansion\b/i,
];

const REQUIRED_GATE_PATTERNS = [
  /\bManager\/Operator approval\b/i,
  /\bexact customer-facing phrasing\b/i,
  /\bpublic-surface scans\b/i,
  /\bpublication\/deploy authority\b/i,
  /\brollback plan\b/i,
  /\bW458\/W435 validators\b/i,
];

const PUBLIC_SURFACE_DENIED_PATTERNS = [
  ['W459 private wave reference', /\bW459\b/],
  ['W451-W458 private wave reference', /\bW45[1-8]\b/],
  ['private receiver marker reference', /\bREADY_(?:SDK|DOCS|WEBSITE|LICENSING|EXAMPLES|CELERAT|PEELER)_[A-Z0-9_]+\b/],
  [
    'private checkpoint reference',
    /\b01c85ac88ebdfbf5bef1ddb99240e1ef3eb3315a\b|\b4bb4ca716315801ddc95ad431ea087c034f9d387\b|\b7c090451ff315bf748d984546a6b01db047fb65a\b|\ba6afdb13ed5082a01f3013c14ea43940f2949d18\b|\b1593ba406b3be45661ca14b49ec0a3dfd5f2e84a\b|\bed67214bb6480eb4192f9666e813580678683530\b|\b7aec9fb2a08956c19688fb07c1c692ef437bd5ff\b|\bf3600a5819ded68630a790a72b6b3440dbe2c1b9\b|\b4ef4f32c0eed5d919fae2a2edb00eb8ba9598326\b|\bbedafd7488dc2b7d6aee00743de204cc9fcd0963\b/,
  ],
  ['caller private JSON term', /\bcaller_provided_private_json\b/],
  ['DataFusion-connected metadata term', /\bDataFusion-connected metadata\b/i],
  ['Custom Provider Tables term', /\bCustom Provider Tables\b/i],
  ['external PlanRef-only posture term', /\bexternal PlanRef-only\b/i],
  ['discovery envelope private term', /\bDiscoveryRequestResponseEnvelope\b|\bdiscovery envelope\b/i],
  [
    'public discovery authority overclaim',
    /\b(provider discovery|data-engine discovery|runtime discovery execution)\b[\s\S]{0,220}\b(public API|public schema|public CLI|public wrapper|SDK wrapper|provider registry|runtime-ready|release-ready|package-ready)\b/i,
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

  console.log('W459 discovery boundary terminology synthesis validation passed');
  console.log(`Synthesis packet: ${relativePath(README)}`);
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
