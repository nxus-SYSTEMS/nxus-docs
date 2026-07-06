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
  /\bDocs W418\b/,
  /\bNXUSKIT-V2-MEGA-20260605\b/,
  /\bprivate\/no-deploy\b/i,
  /\bNo Public Authority Opened\b/,
  /\bCanonical Action-gate Lead\b/,
  /\bAllowed Phrases\b/,
  /\bBanned Phrases\b/,
  /\bPydantic And D10 Preview Wording\b/,
  /\bDemo And Reviewer-kit Wording\b/,
  /\bSupport And Compliance Non-claim Posture\b/,
  /\bArchitecture-section Fallback Language\b/,
  /\bPublication Gates\b/,
  /\bOptions And Recommendation\b/,
  /\bno public support or compliance claim\b/i,
];

const REQUIRED_EVIDENCE_PATTERNS = [
  /\b8e0d8f98071f0f55d8fac04db350f2e9e6ec2f55\b/,
  /\b1fb703e32b2c8ff01be1e230416b0069b2cfa21c\b/,
  /\bnxuskit-v200-managed-waves-synthesis-and-demo-surface-plan-20260706\.md\b/,
  /\bnxus-product-line-public-safe-brief-for-adversarial-review-20260706\.md\b/,
  /\bREADY_DOCS_W407_GATE_J_PUBLIC_SAFE_NO_DEPLOY_BOUNDARY\b/,
  /\b12905eae66b635cfa436e984f9bef25bdf01cb78\b/,
];

const REQUIRED_ACTION_GATE_PATTERNS = [
  /\bGate AI agent actions before they execute\b/,
  /\btyped facts\b/i,
  /\bdeterministic policy\b/i,
  /\breviewable receipts\b/i,
  /\baction authorization before side effects\b/i,
];

const REQUIRED_ALLOWED_PATTERNS = [
  /\bprovider-flexible\b/i,
  /\breviewable\b/i,
  /\bfixture-backed\b/i,
  /\bpolicy-gated\b/i,
  /\blocal-first where appropriate\b/i,
  /\bpublic-safe synthetic examples\b/i,
  /\bexpert-review draft\b/i,
  /\bplanned \/ preview \/ internal validation\b/i,
];

const REQUIRED_BANNED_PATTERNS = [
  /\bautonomous compliance\b/i,
  /\bguaranteed safe\b/i,
  /\bHIPAA-compliant\b/i,
  /\bSOC 2 compliant\b/i,
  /\bproduction governance platform\b/i,
  /\bpublic marketplace\b/i,
  /\bProviderChannel\b/,
  /\bToolCatalog\b/,
  /\bDataFusion\b/,
  /\basync\b/i,
  /\bdiscovery\b/i,
];

const REQUIRED_PREVIEW_PATTERNS = [
  /\bDemo D10 Typed Inspection Gateway\b/,
  /\btyped-inspection-gateway\b/,
  /\bpreview at v2\.0\.0\b/i,
  /\bno runnable public `nxuskit-py\[pydantic\]` typed-parse demo\b/i,
  /\bnot a PydanticAI adapter claim\b/i,
  /\bnot a compliance or regulated-determination claim\b/i,
];

const REQUIRED_DEMO_PATTERNS = [
  /\brunnable proof\b/i,
  /\bimplementation sprint\b/i,
  /\breviewer kit\b/i,
  /\bno-credential demo\b/i,
  /\bknown limitations\b/i,
  /\bnxus-demos\b/,
  /\bDemoPackage\b/,
  /\bpublic_approved\b/,
  /\bsales_room_only\b/,
];

const REQUIRED_GATE_PATTERNS = [
  /\bexact upstream checkpoints\b/i,
  /\bapproved customer-facing phrasing\b/i,
  /\bpublic-surface scans\b/i,
  /\bpublication\/deploy authority\b/i,
  /\brollback plan\b/i,
  /\bno routed docs edits\b/i,
];

const PUBLIC_SURFACE_DENIED_PATTERNS = [
  ['W418 private wave reference', /\bW418\b/],
  ['DevOps private checkpoint reference', /\b8e0d8f98071f0f55d8fac04db350f2e9e6ec2f55\b|\b1fb703e32b2c8ff01be1e230416b0069b2cfa21c\b/],
  ['action-gate unreleased hero claim', /\bGate AI agent actions before they execute\b/i],
  ['Demo D10 private preview term', /\bDemo D10\b|\btyped-inspection-gateway\b/i],
  ['unreleased pydantic typed-parse claim', /\bnxuskit-py\[pydantic\]\b|\bPydanticAI adapter\b/i],
  ['demo metadata private terms', /\bDemoPackage\b|\bpublic_approved\b|\bsales_room_only\b|\bnxus-demos\b/i],
  ['forbidden compliance phrase', /\bautonomous compliance\b|\bguaranteed safe\b|\bHIPAA-compliant\b|\bSOC 2 compliant\b/i],
  ['unreleased production governance claim', /\bproduction governance platform\b/i],
  ['private topology term', /\bProviderChannel\b|\bToolCatalog\b/i],
  [
    'unreleased scope lead term',
    /\b(DataFusion|async tool invocation|Gate J|runtime adapter|cap\.arrow\.runtime|cap\.datafusion|OD-008 SQL\/Plan|Typed Inspection Gateway)\b/i,
  ],
  [
    'W418 contextual public authority overclaim',
    /\b(action gate|typed inspection|Pydantic|Demo D10|DataFusion|async|discovery|demo|reviewer kit|Gate J|v2\.0\.0)\b[\s\S]{0,220}\b(public API|public schema|provider registry|runtime provider|release-ready|package-ready|support-ready|compliance-ready|support readiness|compliance readiness)\b/i,
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

  console.log('W418 terminology claim-boundary validation passed');
  console.log(`Boundary packet: ${relativePath(README)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validatePacket() {
  const text = readText(README);
  validateRequired(text, EXPECTED_PACKET_PATTERNS, README);
  validateRequired(text, REQUIRED_EVIDENCE_PATTERNS, README);
  validateRequired(text, REQUIRED_ACTION_GATE_PATTERNS, README);
  validateRequired(text, REQUIRED_ALLOWED_PATTERNS, README);
  validateRequired(text, REQUIRED_BANNED_PATTERNS, README);
  validateRequired(text, REQUIRED_PREVIEW_PATTERNS, README);
  validateRequired(text, REQUIRED_DEMO_PATTERNS, README);
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
