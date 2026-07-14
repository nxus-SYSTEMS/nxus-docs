#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

const README = path.join(__dirname, 'README.md');
const PUBLIC_DOCS_ROOT = path.join(REPO_ROOT, 'src/content/docs');
const DIST_ROOT = path.join(REPO_ROOT, 'dist');

const W526_README_PATH =
  'specs/526-private-w524-w525-agent-action-gate-clean-checkout-journey-refresh/README.md';
const W526_VALIDATOR_PATH =
  'specs/526-private-w524-w525-agent-action-gate-clean-checkout-journey-refresh/validate-w526-w524-w525-clean-checkout-journey.mjs';
const W530_MARKDOWN_RECORD =
  '.codex/rb008/NXUSKIT-V2-MEGA-20260605/c9-w530-private-rc-integration-branch-preflight-over-w529.md';
const W530_YAML_RECORD =
  '.codex/rb008/NXUSKIT-V2-MEGA-20260605/c9-w530-private-rc-integration-branch-preflight-over-w529.yaml';
const W532_BRANCH = 'codex/w532-docs-private-rc-integration-candidate-w428base-20260714';
const W535_BRANCH = 'codex/w535-docs-sdk-normalized-rc-core-20260714';
const SDK_W535_BRANCH = 'codex/w535-sdk-rc-core-normalization-v2base-20260714';
const EXAMPLES_W535_BRANCH = 'codex/w535-examples-sdk-normalized-rc-core-20260714';

const REQUIRED_PACKET_PATTERNS = [
  /\bDocs W531\b/,
  /\bNXUSKIT-V2-MEGA-20260605\b/,
  /\bprivate\/no-deploy\b/i,
  /\bRC candidate-readiness manifest\b/i,
  /\bNo Public Authority Opened\b/,
  /\bSource Evidence\b/,
  /\bW530 Preflight Disposition\b/,
  /\bW526 Candidate Artifacts\b/,
  /\bCurrent Branch And Worktree State\b/,
  /\bCandidate Integration Disposition\b/,
  /\bRequired Validation After Integration\b/,
  /\bRollback\/Backout Criteria\b/,
  /\bHard Gates Still Closed\b/,
  /\bOptions And Recommendation\b/,
];

const REQUIRED_W530_PATTERNS = [
  /\bDevOps W530\b/,
  /\bc984fc9\b/,
  /\bREADY_DEVOPS_W530_PRIVATE_RC_INTEGRATION_BRANCH_PREFLIGHT_OVER_W529\b/,
  new RegExp(escapeRegExp(W530_MARKDOWN_RECORD)),
  new RegExp(escapeRegExp(W530_YAML_RECORD)),
  /\bPRIVATE_RC_PREFLIGHT_READY\b[\s\S]{0,120}\btrue\b/,
  /\bACCEPTED_CHECKPOINTS_EXIST_LOCALLY\b[\s\S]{0,120}\btrue\b/,
  /\bCOMMON_MERGED_RC_BRANCH_SELECTED\b[\s\S]{0,120}\bfalse\b/,
  /\bCOMMON_MERGED_RC_BRANCH_CREATED\b[\s\S]{0,120}\bfalse\b/,
  /\bCOMMON_MERGED_RC_BRANCH_VERIFIED\b[\s\S]{0,120}\bfalse\b/,
  /\bMERGE_OR_CHERRY_PICK_ATTEMPTED\b[\s\S]{0,120}\bfalse\b/,
  /\bno selected, created, and verified\s+common RC artifact branch\b/i,
];

const REQUIRED_W526_PATTERNS = [
  /\bDocs W526\b/,
  /\bDocs W532\b/,
  /\b6f37d231265c1682c463bcf0cc70c20637266cf1\b/,
  new RegExp(escapeRegExp(W532_BRANCH)),
  /\bDocs W535\b/,
  new RegExp(escapeRegExp(W535_BRANCH)),
  new RegExp(escapeRegExp(W526_README_PATH)),
  new RegExp(escapeRegExp(W526_VALIDATOR_PATH)),
  /\bExamples W535\b/,
  /\be0cbf0736d5e65f37b1a91cd9db94af8d845154d\b/,
  new RegExp(escapeRegExp(EXAMPLES_W535_BRANCH)),
  /\bDevOps W525\b/,
  /\b169c654\b/,
  /\bSDK W535\b/,
  /\b51ed2c4e64445f7170775804d4d98feea5ba6acd\b/,
  /\bc1574cdfd1eefa9f8167c52bb3f384678fb12126\b/,
  new RegExp(escapeRegExp(SDK_W535_BRANCH)),
  /\bprivate\/no-deploy\b/i,
];

const REQUIRED_BRANCH_PATTERNS = [
  new RegExp(escapeRegExp(W535_BRANCH)),
  /\bbase\b[\s\S]{0,120}\b6f37d231265c1682c463bcf0cc70c20637266cf1\b/i,
  /\btracked tree\b[\s\S]{0,160}\bclean\b/i,
  /\.vexp\//,
  /\bsession-handoff\.md\b/,
  /\bcodex-controlled-write-classic-retry-20260711\.md\b/,
  /\bcodex-controlled-write-codex-apply-smoke-20260711\.md\b/,
  /\bpreserved\b[\s\S]{0,120}\bnot staged\b/i,
];

const REQUIRED_DISPOSITION_PATTERNS = [
  /\breference-only\b/i,
  /\bcherry-pick\b/i,
  /\bmerge\b/i,
  /\bdefer\b/i,
  /\breference-only\b[\s\S]{0,240}\bNo longer sufficient\b/i,
  /\bcherry-pick\b[\s\S]{0,260}\bafter\b[\s\S]{0,160}\bprivate integration branch\b/i,
  /\bmerge\b[\s\S]{0,220}\bdeferred\b/i,
  /\bdefer\b[\s\S]{0,220}\bpublic\b/i,
];

const REQUIRED_VALIDATION_COMMANDS = [
  /\bnode --check\b[\s\S]{0,180}validate-w531-rc-candidate-readiness-manifest\.mjs\b/,
  /\bnode\b[\s\S]{0,180}validate-w531-rc-candidate-readiness-manifest\.mjs\b/,
  /\bnode --check\b[\s\S]{0,180}validate-w526-w524-w525-clean-checkout-journey\.mjs\b/,
  /\bnode\b[\s\S]{0,180}validate-w526-w524-w525-clean-checkout-journey\.mjs\b/,
  /\bnpm run check:docs-version -- --explain\b/,
  /\bnpm run check:public-leaks\b/,
  /\bnpm run astro check\b/,
  /\bnpm run build\b/,
  /--dist/,
  /\bgit diff --check\b/,
  /\bgit diff --cached --check\b/,
  /\bdenied-row\b|\bdenied private\b|\bforbidden-claim\b/i,
];

const REQUIRED_ROLLBACK_PATTERNS = [
  /\brollback\b|\bbackout\b/i,
  /\bW532 checkpoint\b[\s\S]{0,160}\bmissing\b/i,
  /\bSDK W535 checkpoint\b[\s\S]{0,200}\bhistorical SDK W517\b/i,
  /\bExamples W535 checkpoint\b[\s\S]{0,200}\bstale W521\/W524\b/i,
  /\brevert\b[\s\S]{0,160}\bprivate specs\b/i,
  /\bremove\b[\s\S]{0,160}\bprivate RC integration branch\b/i,
  /\bvalidation\b[\s\S]{0,120}\bfail/i,
  /\bpublic\b[\s\S]{0,140}\bgate\b[\s\S]{0,80}\bopened\b/i,
  /\buntracked\b[\s\S]{0,140}\bnot\b[\s\S]{0,80}\bstaged\b/i,
];

const REQUIRED_CLOSED_GATES = [
  /\bno routed public docs edits\b/i,
  /\bno generated public docs\b/i,
  /\bno deploy\/public sync\b/i,
  /\bno production deployment\b/i,
  /\bno public release\/package\/tag\b/i,
  /\bno public API\/schema\/CLI\/wrapper availability claim\b/i,
  /\bno Odoo\/Product Catalog mutation\b/i,
  /\bno live entitlement\/signing\/credentials\b/i,
  /\bno hosted\/public execution\b/i,
  /\bno customer\/production data\b/i,
  /\bno production\/customer availability\/support\/compliance\/security claim\b/i,
  /\bno downstream public publication\b/i,
  /\bno W561\+ work\b/i,
];

const PACKET_FORBIDDEN_PATTERNS = [
  ['stale SDK W517 checkpoint', /\bfc3d963f96bd51466d19baa5d626697f7da2eb26\b/],
  ['stale Examples W521 checkpoint', /\badfc185fd2c411aa5956da377d5d8e9fa9e4fb3a\b/],
  ['stale Examples W524 checkpoint', /\b1b3bf5dd01f92e642b570f1c25d33372470f8f3c\b/],
  ['stale SDK W517 decision source', /\bsdk_w517_semantic_derivation_from_typed_facts\b/],
  ['stale SDK W517 verification file', /\bsdk_w517_verification\.json\b/],
  ['production-ready wording', /\bprod(?:uction)?[- ]?ready\b/iu],
  ['customer availability wording', /\bcustomer[-_ ]available\b|\bgenerally available\b|\bGA\b/iu],
  ['support/compliance/security ready wording', /\b(?:support|compliance|security)[-_ ]ready\b/iu],
  ['support/compliance/security guarantee', /\bguaranteed (?:support|compliance|security|safe|safety|outcome)\b/iu],
  ['HIPAA/SOC2 claim', /\bHIPAA[- ]compliant\b|\bSOC ?2[- ]compliant\b/iu],
  ['availability-now claim', /\bavailable now\b|\bnow available\b|\bpublicly available\b|\bis shipped\b|\bare shipped\b/iu],
  [
    'public API/schema/CLI/wrapper availability promise',
    /\b(public API|public schema|public CLI|wrapper)\b[\s\S]{0,120}\b(available|released|shipped|supported)\b/iu,
  ],
  [
    'release/publish/deploy claim',
    /\b(?:released|published|deployed|tagged)\b[\s\S]{0,120}\b(?:public|package|artifact|changelog)\b/iu,
  ],
  ['production Odoo/customer grant claim', /\bproduction (?:Odoo|customer|catalog)[\s\S]{0,120}\bgrant(?:s|ed|ing)?\b/iu],
];

const PUBLIC_SURFACE_DENIED_PATTERNS = [
  ['W531 private wave reference', /\bW531\b/],
  ['W530 private wave reference', /\bW530\b/],
  ['W535 private wave reference', /\bW535\b/],
  ['W532 private wave reference', /\bW532\b/],
  ['W526 private wave reference', /\bW526\b/],
  ['W532 checkpoint reference', /\b6f37d231265c1682c463bcf0cc70c20637266cf1\b/],
  ['Examples W535 checkpoint reference', /\be0cbf0736d5e65f37b1a91cd9db94af8d845154d\b/],
  ['SDK W535 checkpoint reference', /\b51ed2c4e64445f7170775804d4d98feea5ba6acd\b/],
  ['W530 checkpoint reference', /\bc984fc9\b/],
  ['W526 private spec path', new RegExp(escapeRegExp(W526_README_PATH))],
  ['W531 private RC manifest phrase', /\bRC candidate-readiness manifest\b/i],
  ['private RC branch phrase', /\bprivate RC integration branch\b/i],
  ['D1 private proof case leak', /\bd1-support-reply-safe\b|\bd1-account-export-blocked\b|\bd1-service-credit-review\b/],
  ['production-ready overclaim', /\bprod(?:uction)?[- ]?ready\b/iu],
  ['customer availability claim', /\bcustomer[-_ ]available\b|\bgenerally available\b|\bavailable now\b|\bnow available\b/iu],
  ['support/compliance/security authority', /\b(support|compliance|security)[-_ ]ready\b|\bguaranteed safe\b|\bHIPAA-compliant\b|\bSOC 2 compliant\b/i],
];

const LOCAL_OR_SECRET_PATTERNS = [
  ['home absolute path', /\/Users\//],
  ['private tmp path', /\/private\/tmp\b|\/tmp\/worktrees\b|\/tmp\/w53/i],
  ['repo absolute path fragment', /\bcodeRepos\b/],
  ['private repo name', /\bnxusKit-examples-internal\b|\bnxusKit-internal\b/],
  [
    'sensitive token',
    /\b(?:AWS_SECRET|PASSWORD|SECRET|TOKEN|BEGIN RSA PRIVATE KEY|BEGIN OPENSSH PRIVATE KEY|BEGIN PRIVATE KEY)\b/,
  ],
];

const UNFINISHED_MARKER_PATTERNS = [
  ['unfinished marker token', /\b(?:TODO|TBD|FIXME|CHANGEME|REPLACE_ME|PLACEHOLDER|XXX)\b/],
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

  console.log('W531 private RC candidate-readiness manifest validation passed');
  console.log(`Readiness packet: ${relativePath(README)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validatePacket() {
  const text = readText(README);
  validateRequired(text, REQUIRED_PACKET_PATTERNS, README);
  validateRequired(text, REQUIRED_W530_PATTERNS, README);
  validateRequired(text, REQUIRED_W526_PATTERNS, README);
  validateRequired(text, REQUIRED_BRANCH_PATTERNS, README);
  validateRequired(text, REQUIRED_DISPOSITION_PATTERNS, README);
  validateRequired(text, REQUIRED_VALIDATION_COMMANDS, README);
  validateRequired(text, REQUIRED_ROLLBACK_PATTERNS, README);
  validateRequired(text, REQUIRED_CLOSED_GATES, README);
  validatePatterns(text, PACKET_FORBIDDEN_PATTERNS, README);
  validatePatterns(text, LOCAL_OR_SECRET_PATTERNS, README);
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main();
