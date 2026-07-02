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
  /\bDocs W376\b/,
  /\bNXUSKIT-V2-MEGA-20260605\b/,
  /\b3a1379a46c56c4134cfffa0b41c88ac6bfa53b8c\b/,
  /\bprivate\/no-deploy\b/i,
  /\bDataFusion\b/,
  /\basync tool invocation\b/i,
  /\bCE ordinary tool\/function calling\b/i,
  /\bPro\/Internal\b/,
  /\bNo Public Authority Opened\b/,
  /\bSafe-now Conceptual Wording\b/,
  /\bDenied Claim Terms\b/,
  /\bPublication Gates\b/,
  /\bOptions And Recommendation\b/,
  /\bno public support or compliance claim\b/i,
];

const REQUIRED_SOURCE_PATTERNS = [
  /\bnxuskit-sdk-v200-pro-internal-scope-expansion-addendum-20260702\.md\b/,
  /\bnxuskit-sdk-v200-async-tool-invocation-pro-internal-requirements-20260702\.md\b/,
  /\bnxuskit-sdk-v200-datafusion-runtime-adapter-process-requirements-20260702\.md\b/,
  /\bpublic API\/schema\/CLI\/wrapper exposure\b/i,
  /\bDataFusion SELECT-triggered side effects\b/i,
  /\bcallbacks\/webhooks\b/i,
];

const REQUIRED_SAFE_NOW_PATTERNS = [
  /\bordinary host-loop tool calling\b/i,
  /\baccepted\/result\/ref semantics\b/i,
  /\boperation references\b/i,
  /\breadiness\b/i,
  /\bmissing-plugin\b/i,
  /\bentitlement-denied\b/i,
  /\bdeclaration-only\b/i,
  /\bCapability Catalog\b/,
  /\bruntime adapter\b/i,
];

const REQUIRED_BOUNDARY_PATTERNS = [
  /\bCE builds keep existing tool\/function calling behavior\b/i,
  /\bCE must not link DataFusion\b/i,
  /\bCE must not link Arrow runtime\b/i,
  /\bDataFusion gateway\b[\s\S]{0,160}\bPro\/Internal\b/i,
  /\breverse table-provider\b[\s\S]{0,160}\bPro\/Internal\b/i,
  /\bSELECT queries\b[\s\S]{0,220}\bmust not\b[\s\S]{0,220}\btool dispatch\b/i,
  /\bseparate nxusKit operation\b/i,
  /\bprivate event sinks\b/i,
  /\bpublic docs do not promise webhooks\b/i,
];

const PUBLIC_SURFACE_DENIED_PATTERNS = [
  ['W376 private wave reference', /\bW376\b/],
  ['manager checkpoint reference', /\b3a1379a46c56c4134cfffa0b41c88ac6bfa53b8c\b/],
  [
    'async runtime dispatch claim',
    /\basync tool invocation\b[\s\S]{0,220}\b(runtime dispatch|runtime[-_ ]ready|provider registry|public API|public schema|CLI command|package|release|webhooks?|callbacks?)\b/i,
  ],
  [
    'DataFusion CE runtime claim',
    /\b(CE|Community Edition|community)\b[\s\S]{0,220}\b(DataFusion|Arrow)\b[\s\S]{0,220}\b(runtime|gateway|table[- ]provider|SQL execution|query execution)\b/i,
  ],
  [
    'DataFusion hidden dispatch claim',
    /\bDataFusion\b[\s\S]{0,220}\b(dispatch tools?|call LLMs?|fire CLIPS|run BN|execute solvers?)\b/i,
  ],
  ['DataFusion runtime-ready authority', /\bDataFusion\b[\s\S]{0,120}\bruntime[-_ ]ready\b/i],
  ['async release/package authority', /\basync tool\b[\s\S]{0,160}\b(release[-_ ]ready|package[-_ ]ready)\b/i],
  ['callback/webhook public promise', /\b(public|managed|customer-facing)\b[\s\S]{0,120}\b(callbacks?|webhooks?)\b/i],
  ['support/compliance authority', /\b(support|compliance)[-_ ]ready\b|\bsupport readiness\b|\bcompliance readiness\b/i],
  ['public projection authority', /\bpublic projection authority\b/i],
];

const LOCAL_PACKET_DENIED_PATTERNS = [
  ['support/compliance readiness authority', /\b(support|compliance)[-_ ]ready\b|\bsupport readiness\b|\bcompliance readiness\b/i],
  ['release/package readiness authority', /\b(release|package)[-_ ]ready\b|\brelease readiness\b|\bpackage readiness\b/i],
  ['runtime dispatch authority', /\bruntime dispatch (?:is|now|will|can|may|should|must)\b/i],
  ['DataFusion CE runtime authority', /\bCE\b[\s\S]{0,160}\bDataFusion\b[\s\S]{0,160}\bruntime (?:is|now|will|can|may|should|must)\b/i],
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

  console.log('W376 DataFusion async-tool boundary validation passed');
  console.log(`Boundary packet: ${relativePath(README)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validatePacket() {
  const text = readText(README);
  validateRequired(text, EXPECTED_PACKET_PATTERNS, README);
  validateRequired(text, REQUIRED_SOURCE_PATTERNS, README);
  validateRequired(text, REQUIRED_SAFE_NOW_PATTERNS, README);
  validateRequired(text, REQUIRED_BOUNDARY_PATTERNS, README);
  validatePatterns(text, LOCAL_PACKET_DENIED_PATTERNS, README);
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
