#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

const README = path.join(__dirname, 'README.md');
const PUBLIC_DOCS_ROOT = path.join(REPO_ROOT, 'src/content/docs');
const DIST_ROOT = path.join(REPO_ROOT, 'dist');

const W518_PACKAGE_PATH =
  'internal/preview/v2-roadmap-integration/w518-private-executable-d1-agent-action-gate-evidence-proof';

const REQUIRED_PACKET_PATTERNS = [
  /\bDocs W519\b/,
  /\bNXUSKIT-V2-MEGA-20260605\b/,
  /\bprivate\/no-deploy\b/i,
  /\bD1 Agent Action Gate\b/,
  /\bbuyer\/developer journey\b/i,
  /\bNo Public Authority Opened\b/,
  /\bEvaluator Journey\b/,
  /\bProblem\b/,
  /\bRun\/Review The Private Proof\b/,
  /\bExpected Outcomes\b/,
  /\bEvidence And Receipts\b/,
  /\bLimitations\b/,
  /\bPaid Next Step\b/,
  /\bPublication Gates\b/,
  /\bOptions And Recommendation\b/,
];

const REQUIRED_W518_PATTERNS = [
  /\bREADY_EXAMPLES_W518_PRIVATE_EXECUTABLE_D1_AGENT_ACTION_GATE_EVIDENCE_PROOF\b/,
  /\bc0ad8cf9cb29ac529e41e024004a5e728c07cd8f\b/,
  /\bcodex\/v2-private-executable-d1-agent-action-gate-w518-20260713\b/,
  new RegExp(escapeRegExp(W518_PACKAGE_PATH)),
  /\bprivate executable clean local proof\b/i,
  /\bsource-visible\b/i,
  /\bbounded synthetic\s+support-playbook fixture data\b/i,
];

const REQUIRED_OUTCOMES = [
  /\bd1-support-reply-safe\b[\s\S]{0,160}\ballow\b/i,
  /\bd1-account-export-blocked\b[\s\S]{0,160}\bdeny\b/i,
  /\bd1-service-credit-review\b[\s\S]{0,160}\breview_required\b/i,
  /\ballow, deny, and review_required\b/i,
];

const REQUIRED_EVIDENCE_PATTERNS = [
  /\binspectable private evidence JSON\b/i,
  /\bprivate\s+receipt JSON\b/i,
  /\bsummary\.json\b/,
  /\bevidence\b/,
  /\breceipts\b/,
  /\bhuman_review_case\b[\s\S]{0,80}\bd1-service-credit-review\b/i,
  /\bhuman-review path\b/i,
  /\bnegative_cases_fail_closed=True\b/,
];

const REQUIRED_SANDBOX_DEMO_PATTERNS = [
  /\bCodespaces\/devcontainer\b/,
  /\bclean local checkout\b/i,
  /\bofficial org repo\b/i,
  /\bcommit pin\b/i,
  /\bexpected-output fixture\b/i,
  /\bbounded fixtures\b/i,
  /\bno arbitrary uploads\b/i,
  /\bno secrets\b/i,
  /\bno customer\/production data\b/i,
  /\bbinary\b[\s\S]{0,120}\bgated\b/i,
];

const REQUIRED_LIMITATIONS = [
  /\bprivate\/local\/source-visible\b/i,
  /\bbounded fixture data\b/i,
  /\bno hosted\/public execution\b/i,
  /\bno customer\/production data\b/i,
  /\bno live entitlement\b/i,
  /\bno signing\b/i,
  /\bno public release\/package\/publication\b/i,
  /\bno public API\/schema\/CLI\/wrapper availability\b/i,
  /\bno support\/compliance\/security guarantee\b/i,
  /\bno Product Catalog\/Odoo mutation\b/i,
  /\bno W561\+ work\b/i,
];

const REQUIRED_NEXT_STEP_PATTERNS = [
  /\bAgent Action Gate Sprint\b/,
  /\bdesign-partner conversation\b/i,
  /\binternal commercial context\b/i,
  /\bno unsupported public pricing\b/i,
  /\bno availability claim\b/i,
];

const PACKET_FORBIDDEN_PATTERNS = [
  ['production-ready wording', /\bprod(?:uction)?[- ]?ready\b/iu],
  ['public-ready wording', /\bpublic[-_ ]ready\b/iu],
  ['customer-available wording', /\bcustomer[-_ ]available\b|\bgenerally available\b|\bGA\b/iu],
  ['support/compliance/security ready wording', /\b(?:support|compliance|security)[-_ ]ready\b/iu],
  ['support/compliance/security guarantee', /\bguaranteed (?:support|compliance|security|safe|safety|outcome)\b/iu],
  ['HIPAA/SOC2 claim', /\bHIPAA[- ]compliant\b|\bSOC ?2[- ]compliant\b/iu],
  ['availability-now claim', /\bavailable now\b|\bnow available\b|\bpublicly available\b|\bis shipped\b|\bare shipped\b/iu],
  ['public API availability promise', /\bpublic API\b[\s\S]{0,120}\b(available|released|shipped|supported)\b/iu],
  ['public schema availability promise', /\bpublic schema\b[\s\S]{0,120}\b(available|released|shipped|supported)\b/iu],
  ['public CLI availability promise', /\bpublic CLI\b[\s\S]{0,120}\b(available|released|shipped|supported)\b/iu],
  ['wrapper availability promise', /\bwrapper\b[\s\S]{0,120}\b(available|released|shipped|supported)\b/iu],
  ['release/publish/deploy claim', /\b(?:released|published|deployed|tagged)\b[\s\S]{0,120}\b(?:public|package|artifact|changelog)\b/iu],
  ['production Odoo/customer grant claim', /\bproduction (?:Odoo|customer|catalog)[\s\S]{0,120}\bgrant(?:s|ed|ing)?\b/iu],
];

const PUBLIC_SURFACE_DENIED_PATTERNS = [
  ['W519 private wave reference', /\bW519\b/],
  ['W518 private wave reference', /\bW518\b/],
  ['W518 checkpoint reference', /\bc0ad8cf9cb29ac529e41e024004a5e728c07cd8f\b/],
  ['W518 private package path', new RegExp(escapeRegExp(W518_PACKAGE_PATH))],
  ['D1 private proof leak', /\bD1 Agent Action Gate Evidence Proof\b/i],
  ['private proof case leak', /\bd1-support-reply-safe\b|\bd1-account-export-blocked\b|\bd1-service-credit-review\b/],
  ['private proof output leak', /\bhuman_review_case\b|\bnegative_cases_fail_closed\b/i],
  ['production-ready overclaim', /\bprod(?:uction)?[- ]?ready\b/iu],
  ['public-ready overclaim', /\bpublic[-_ ]ready\b/iu],
  ['customer availability claim', /\bcustomer[-_ ]available\b|\bgenerally available\b|\bavailable now\b|\bnow available\b/iu],
  ['support/compliance/security authority', /\b(support|compliance|security)[-_ ]ready\b|\bguaranteed safe\b|\bHIPAA-compliant\b|\bSOC 2 compliant\b/i],
  [
    'W519 public API/schema/CLI/wrapper availability',
    /\b(D1 Agent Action Gate|W518|W519)\b[\s\S]{0,220}\b(public API|public schema|public CLI|wrapper)\b[\s\S]{0,120}\b(available|released|shipped|supported)\b/i,
  ],
  [
    'W519 release/publish/deploy claim',
    /\b(D1 Agent Action Gate|W518|W519)\b[\s\S]{0,220}\b(released|published|deployed|tagged|package|artifact|changelog)\b/i,
  ],
  ['production Odoo/customer grant claim', /\bproduction (Odoo|customer|catalog)\b[\s\S]{0,160}\bgrant/i],
];

const LOCAL_OR_SECRET_PATTERNS = [
  ['home absolute path', /\/Users\//],
  ['private tmp path', /\/private\/tmp\b|\/tmp\/worktrees\b/],
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

  console.log('W519 D1 Agent Action Gate buyer/developer journey validation passed');
  console.log(`Journey packet: ${relativePath(README)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validatePacket() {
  const text = readText(README);
  validateRequired(text, REQUIRED_PACKET_PATTERNS, README);
  validateRequired(text, REQUIRED_W518_PATTERNS, README);
  validateRequired(text, REQUIRED_OUTCOMES, README);
  validateRequired(text, REQUIRED_EVIDENCE_PATTERNS, README);
  validateRequired(text, REQUIRED_SANDBOX_DEMO_PATTERNS, README);
  validateRequired(text, REQUIRED_LIMITATIONS, README);
  validateRequired(text, REQUIRED_NEXT_STEP_PATTERNS, README);
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
