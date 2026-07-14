#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

const README = path.join(__dirname, 'README.md');
const PUBLIC_DOCS_ROOT = path.join(REPO_ROOT, 'src/content/docs');
const DIST_ROOT = path.join(REPO_ROOT, 'dist');

const W521_PACKAGE_PATH =
  'internal/preview/v2-roadmap-integration/w521-private-d1-agent-action-gate-sdk-derived-proof-refresh';
const W519_PACKAGE_PATH =
  'specs/519-private-d1-agent-action-gate-buyer-developer-journey';

const REQUIRED_PACKET_PATTERNS = [
  /\bDocs W522\b/,
  /\bNXUSKIT-V2-MEGA-20260605\b/,
  /\bprivate\/no-deploy\b/i,
  /\bD1 Agent Action Gate\b/,
  /\bbuyer\/developer journey\b/i,
  /\bSDK-derived\b/i,
  /\bNo Public Authority Opened\b/,
  /\bEvaluator Journey\b/,
  /\bProblem\b/,
  /\bRun\/Review The SDK-Derived Private Proof\b/,
  /\bExpected Outcomes\b/,
  /\bEvidence And Receipts\b/,
  /\bHuman Review Path\b/,
  /\bLimitations\b/,
  /\bPaid Next Step\b/,
  /\bPublication Gates\b/,
  /\bOptions And Recommendation\b/,
];

const REQUIRED_SOURCE_PATTERNS = [
  /\bREADY_EXAMPLES_W521/i,
  /\badfc185fd2c411aa5956da377d5d8e9fa9e4fb3a\b/,
  new RegExp(escapeRegExp(W521_PACKAGE_PATH)),
  /\bSDK W517\b/,
  /\bfc3d963f96bd51466d19baa5d626697f7da2eb26\b/,
  /\bcodex\/w517-semantic-agent-action-gate-derivation-20260713\b/,
  /\bprivate_semantic_agent_action_gate_derivation\.w517\.d1_support_playbook\b/,
  /\bDocs W519\b/,
  /\bc0ad8cf9cb29ac529e41e024004a5e728c07cd8f\b/,
  new RegExp(escapeRegExp(W519_PACKAGE_PATH)),
  /\bW518\b[\s\S]{0,160}\bprior\b/i,
];

const REQUIRED_DERIVATION_PATTERNS = [
  /\bsdk_w517_semantic_derivation_from_typed_facts\b/,
  /\btyped facts\b/i,
  /\baction_request\b/,
  /\bactor_context\b/,
  /\bconsequence\b/,
  /\bpolicy_input\b/,
  /\bevidence_refs\b/,
  /\breceipt_refs\b/,
  /\bgate_refs\b/,
  /\bexpected decisions\b[\s\S]{0,180}\bvalidation-only assertions\b/i,
  /\bnot\b[\s\S]{0,120}\bdecision source\b/i,
  /\bexpected_outcome\b[\s\S]{0,180}\bmust not\b/i,
  /\bfixture-expected-outcome substitution\b/i,
];

const REQUIRED_OUTCOMES = [
  /\bd1-support-reply-safe\b[\s\S]{0,180}\ballow\b/i,
  /\bd1-account-export-blocked\b[\s\S]{0,180}\bdeny\b/i,
  /\bd1-service-credit-review\b[\s\S]{0,180}\breview_required\b/i,
  /\ballow, deny, and review_required\b/i,
];

const REQUIRED_EVIDENCE_PATTERNS = [
  /\binspectable private evidence JSON\b/i,
  /\bprivate\s+receipt JSON\b/i,
  /\bsummary\.json\b/,
  /\bsdk_w517_verification\.json\b/,
  /\bevidence\b/,
  /\breceipts\b/,
  /\bnegative_cases\b/,
  /\bdecision_derived_from_typed_facts\b/i,
  /\bused_fixture_expected_outcomes_as_decision_source\b[\s\S]{0,120}\bfalse\b/i,
  /\bnegative_cases_fail_closed\b[\s\S]{0,120}\btrue\b/i,
];

const REQUIRED_REVIEW_PATTERNS = [
  /\bd1-service-credit-review\b[\s\S]{0,220}\bhandoff\.d1-service-credit-review\.private_human_review\b/i,
  /\bhuman-review path\b/i,
  /\babstain\b[\s\S]{0,140}\bprivate human review\b/i,
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
  /\bSDK-derived proof\b/i,
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
  ['W522 private wave reference', /\bW522\b/],
  ['W521 private wave reference', /\bW521\b/],
  ['W521 checkpoint reference', /\badfc185fd2c411aa5956da377d5d8e9fa9e4fb3a\b/],
  ['SDK W517 checkpoint reference', /\bfc3d963f96bd51466d19baa5d626697f7da2eb26\b/],
  ['W521 private package path', new RegExp(escapeRegExp(W521_PACKAGE_PATH))],
  ['SDK-derived D1 private proof leak', /\bD1 Agent Action Gate SDK-derived Evidence Proof Refresh\b/i],
  ['private proof case leak', /\bd1-support-reply-safe\b|\bd1-account-export-blocked\b|\bd1-service-credit-review\b/],
  ['private proof output leak', /\bsdk_w517_verification\b|\bdecision_derived_from_typed_facts\b|\bnegative_cases_fail_closed\b/i],
  ['private semantic gate ref leak', /\bprivate_semantic_agent_action_gate_derivation\.w517\.d1_support_playbook\b/],
  ['production-ready overclaim', /\bprod(?:uction)?[- ]?ready\b/iu],
  ['public-ready overclaim', /\bpublic[-_ ]ready\b/iu],
  ['customer availability claim', /\bcustomer[-_ ]available\b|\bgenerally available\b|\bavailable now\b|\bnow available\b/iu],
  ['support/compliance/security authority', /\b(support|compliance|security)[-_ ]ready\b|\bguaranteed safe\b|\bHIPAA-compliant\b|\bSOC 2 compliant\b/i],
  [
    'W522 public API/schema/CLI/wrapper availability',
    /\b(D1 Agent Action Gate|W521|W522|SDK-derived)\b[\s\S]{0,220}\b(public API|public schema|public CLI|wrapper)\b[\s\S]{0,120}\b(available|released|shipped|supported)\b/i,
  ],
  [
    'W522 release/publish/deploy claim',
    /\b(D1 Agent Action Gate|W521|W522|SDK-derived)\b[\s\S]{0,220}\b(released|published|deployed|tagged|package|artifact|changelog)\b/i,
  ],
  ['production Odoo/customer grant claim', /\bproduction (Odoo|customer|catalog)\b[\s\S]{0,160}\bgrant/i],
];

const LOCAL_OR_SECRET_PATTERNS = [
  ['home absolute path', /\/Users\//],
  ['private tmp path', /\/private\/tmp\b|\/tmp\/worktrees\b|\/tmp\/w52/i],
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

  console.log('W522 W521 SDK-derived Agent Action Gate journey validation passed');
  console.log(`Journey packet: ${relativePath(README)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validatePacket() {
  const text = readText(README);
  validateRequired(text, REQUIRED_PACKET_PATTERNS, README);
  validateRequired(text, REQUIRED_SOURCE_PATTERNS, README);
  validateRequired(text, REQUIRED_DERIVATION_PATTERNS, README);
  validateRequired(text, REQUIRED_OUTCOMES, README);
  validateRequired(text, REQUIRED_EVIDENCE_PATTERNS, README);
  validateRequired(text, REQUIRED_REVIEW_PATTERNS, README);
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
