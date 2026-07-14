#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

const README = path.join(__dirname, 'README.md');
const PUBLIC_DOCS_ROOT = path.join(REPO_ROOT, 'src/content/docs');
const DIST_ROOT = path.join(REPO_ROOT, 'dist');

const W524_PACKAGE_PATH =
  'internal/preview/v2-roadmap-integration/w524-private-d1-agent-action-gate-clean-checkout-dx-smoke';
const W521_PACKAGE_PATH =
  'internal/preview/v2-roadmap-integration/w521-private-d1-agent-action-gate-sdk-derived-proof-refresh';
const W522_DOCS_PATH =
  'specs/522-private-w521-sdk-derived-agent-action-gate-journey-refresh';
const W525_EVIDENCE_RECORD =
  '.codex/rb008/NXUSKIT-V2-MEGA-20260605/c9-w525-private-release-integration-review-over-w524.md';
const SDK_W535_BRANCH = 'codex/w535-sdk-rc-core-normalization-v2base-20260714';
const EXAMPLES_W535_BRANCH = 'codex/w535-examples-sdk-normalized-rc-core-20260714';

const REQUIRED_PACKET_PATTERNS = [
  /\bDocs W526\b/,
  /\bNXUSKIT-V2-MEGA-20260605\b/,
  /\bprivate\/no-deploy\b/i,
  /\bD1 Agent Action Gate\b/,
  /\bbuyer\/developer journey\b/i,
  /\bclean-checkout\b/i,
  /\bdeveloper experience\b/i,
  /\bNo Public Authority Opened\b/,
  /\bEvaluator Journey\b/,
  /\bProblem And Audience\b/,
  /\bPrivate Proof Lineage\b/,
  /\bRun\/Review The Clean-Checkout Smoke\b/,
  /\bDeterministic Outcomes\b/,
  /\bEvidence, Receipts, And Summary Output\b/,
  /\bHuman Review Path\b/,
  /\bExpected-Outcome Substitution Rejection\b/,
  /\bPrivate Release-Integration Meaning\b/,
  /\bLimitations\b/,
  /\bPaid Next Step\b/,
  /\bPublication Gates\b/,
  /\bOptions And Recommendation\b/,
];

const REQUIRED_LINEAGE_PATTERNS = [
  /\bSDK W535\b/,
  /\b51ed2c4e64445f7170775804d4d98feea5ba6acd\b/,
  /\bc1574cdfd1eefa9f8167c52bb3f384678fb12126\b/,
  new RegExp(escapeRegExp(SDK_W535_BRANCH)),
  /\bRC Core\b/i,
  /\bgeneric request\b/i,
  /\breview-handoff\b/i,
  /\bExamples W535\b/,
  /\be0cbf0736d5e65f37b1a91cd9db94af8d845154d\b/,
  new RegExp(escapeRegExp(EXAMPLES_W535_BRANCH)),
  /\bExamples W521\b/,
  /\bExamples W524\b/,
  new RegExp(escapeRegExp(W524_PACKAGE_PATH)),
  new RegExp(escapeRegExp(W521_PACKAGE_PATH)),
  /\bDocs W522\b/,
  /\bd3144caf1a1762cd3e93d7a337f01f111897b1ae\b/,
  new RegExp(escapeRegExp(W522_DOCS_PATH)),
  /\bDevOps W525\b/,
  /\b169c654\b/,
  new RegExp(escapeRegExp(W525_EVIDENCE_RECORD)),
  /\bLicensing W522\b/,
  /\b463d1db55a364e89494ca1d2e24e8461d2c226e3\b/,
];

const REQUIRED_W524_DX_PATTERNS = [
  /\bREADY_EXAMPLES_W524_PRIVATE_D1_AGENT_ACTION_GATE_CLEAN_CHECKOUT_DX_SMOKE\b/,
  /\bone-command\b/i,
  /\bsource-visible\b/i,
  /\bclean local checkout\b/i,
  /\bsource-visible proof code\b/i,
  /\bfive-minute-or-less\b/i,
  /\btarget duration\b[\s\S]{0,80}\bfive minutes\b/i,
  /\bno dependency install\b/i,
  /\boutside the repo\b/i,
  /\bw524-clean-checkout-dx-smoke-summary\.json\b/,
  /\bcompact summary output\b/i,
];

const REQUIRED_DERIVATION_PATTERNS = [
  /\bsdk_w535_rc_core_action_gate_from_typed_facts\b/,
  /\bSDK RC Core-derived\b/i,
  /\btyped facts\b/i,
  /\bW521 runner\b/i,
  /\bW521 validator\b/i,
  /\bSDK W535\b[\s\S]{0,80}\bevidence\b/i,
  /\bdecision source\b/i,
  /\bvalidation assertions\b/i,
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
  /\bevidence refs\b/i,
  /\breceipt refs\b/i,
  /\bw524-clean-checkout-dx-smoke-summary\.json\b/,
  /\bsummary\.json\b/,
  /\bsdk_rc_core_verification\.json\b/,
  /\bevidence\b/,
  /\breceipts\b/,
  /\bnegative_cases\b/,
  /\bnegative_cases_fail_closed\b[\s\S]{0,120}\btrue\b/i,
];

const REQUIRED_REVIEW_PATTERNS = [
  /\bd1-service-credit-review\b[\s\S]{0,220}\bhandoff\.d1-service-credit-review\.private_human_review\b/i,
  /\bhuman-review handoff\b/i,
  /\babstain\b[\s\S]{0,160}\bhuman review\b/i,
];

const REQUIRED_EXPECTED_OUTCOME_PATTERNS = [
  /\bexpected_outcome\b[\s\S]{0,180}\brejected\b/i,
  /\bexpected_decision\b[\s\S]{0,180}\brejected\b/i,
  /\boutcome_override\b[\s\S]{0,180}\brejected\b/i,
  /\bdecision_override\b[\s\S]{0,180}\brejected\b/i,
  /\bexpected decisions\b[\s\S]{0,180}\bvalidation assertions\b/i,
  /\bnot\b[\s\S]{0,140}\bdecision authority\b/i,
];

const REQUIRED_W525_PATTERNS = [
  /\bREADY_DEVOPS_W525_PRIVATE_RELEASE_INTEGRATION_REVIEW_OVER_W524\b/,
  /\bPRIVATE_RELEASE_INTEGRATION_REVIEW_READY\b[\s\S]{0,80}\btrue\b/,
  /\bCLEAN_CHECKOUT_DX_SMOKE_READY\b[\s\S]{0,80}\btrue\b/,
  /\bCOMMON_MERGED_RC_BRANCH_READY\b[\s\S]{0,80}\bfalse\b/,
  /\bPUBLIC_RELEASE_GO\b[\s\S]{0,80}\bfalse\b/,
  /\bPRODUCTION_GO\b[\s\S]{0,80}\bfalse\b/,
  /\bPACKAGE_RELEASE_GO\b[\s\S]{0,80}\bfalse\b/,
  /\bPUBLIC_DEFAULT_PROJECTION_GO\b[\s\S]{0,80}\bfalse\b/,
  /\bLIVE_LICENSING_GO\b[\s\S]{0,80}\bfalse\b/,
  /\bprivate release-integration review\b/i,
  /\bnot a publication artifact\b/i,
  /\bcommon merged RC branch\b[\s\S]{0,140}\bnot\b[\s\S]{0,80}\bclaimed\b/i,
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
  /\bclean-checkout smoke\b/i,
];

const PACKET_FORBIDDEN_PATTERNS = [
  ['stale SDK W517 checkpoint', /\bfc3d963f96bd51466d19baa5d626697f7da2eb26\b/],
  ['stale Examples W521 checkpoint', /\badfc185fd2c411aa5956da377d5d8e9fa9e4fb3a\b/],
  ['stale Examples W524 checkpoint', /\b1b3bf5dd01f92e642b570f1c25d33372470f8f3c\b/],
  ['stale SDK W517 decision source', /\bsdk_w517_semantic_derivation_from_typed_facts\b/],
  ['stale SDK W517 verification file', /\bsdk_w517_verification\.json\b/],
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
  ['W526 private wave reference', /\bW526\b/],
  ['W525 private wave reference', /\bW525\b/],
  ['W535 private wave reference', /\bW535\b/],
  ['W524 private wave reference', /\bW524\b/],
  ['Examples W535 checkpoint reference', /\be0cbf0736d5e65f37b1a91cd9db94af8d845154d\b/],
  ['SDK W535 checkpoint reference', /\b51ed2c4e64445f7170775804d4d98feea5ba6acd\b/],
  ['SDK W535 base reference', /\bc1574cdfd1eefa9f8167c52bb3f384678fb12126\b/],
  ['W524 private package path', new RegExp(escapeRegExp(W524_PACKAGE_PATH))],
  ['W521 private package path', new RegExp(escapeRegExp(W521_PACKAGE_PATH))],
  ['D1 clean-checkout private proof leak', /\bD1 Agent Action Gate Clean-checkout DX Smoke\b/i],
  ['private proof case leak', /\bd1-support-reply-safe\b|\bd1-account-export-blocked\b|\bd1-service-credit-review\b/],
  ['private proof output leak', /\bw524-clean-checkout-dx-smoke-summary\b|\bsdk_rc_core_verification\b|\bnegative_cases_fail_closed\b/i],
  ['production-ready overclaim', /\bprod(?:uction)?[- ]?ready\b/iu],
  ['public-ready overclaim', /\bpublic[-_ ]ready\b/iu],
  ['customer availability claim', /\bcustomer[-_ ]available\b|\bgenerally available\b|\bavailable now\b|\bnow available\b/iu],
  ['support/compliance/security authority', /\b(support|compliance|security)[-_ ]ready\b|\bguaranteed safe\b|\bHIPAA-compliant\b|\bSOC 2 compliant\b/i],
  [
    'W526 public API/schema/CLI/wrapper availability',
    /\b(D1 Agent Action Gate|W524|W525|W526|clean-checkout)\b[\s\S]{0,220}\b(public API|public schema|public CLI|wrapper)\b[\s\S]{0,120}\b(available|released|shipped|supported)\b/i,
  ],
  [
    'W526 release/publish/deploy claim',
    /\b(D1 Agent Action Gate|W524|W525|W526|clean-checkout)\b[\s\S]{0,220}\b(released|published|deployed|tagged|package|artifact|changelog)\b/i,
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

  console.log('W526 W524/W525 clean-checkout Agent Action Gate journey validation passed');
  console.log(`Journey packet: ${relativePath(README)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validatePacket() {
  const text = readText(README);
  validateRequired(text, REQUIRED_PACKET_PATTERNS, README);
  validateRequired(text, REQUIRED_LINEAGE_PATTERNS, README);
  validateRequired(text, REQUIRED_W524_DX_PATTERNS, README);
  validateRequired(text, REQUIRED_DERIVATION_PATTERNS, README);
  validateRequired(text, REQUIRED_OUTCOMES, README);
  validateRequired(text, REQUIRED_EVIDENCE_PATTERNS, README);
  validateRequired(text, REQUIRED_REVIEW_PATTERNS, README);
  validateRequired(text, REQUIRED_EXPECTED_OUTCOME_PATTERNS, README);
  validateRequired(text, REQUIRED_W525_PATTERNS, README);
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
