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
  /\bDocs W407\b/,
  /\bNXUSKIT-V2-MEGA-20260605\b/,
  /\bprivate\/no-deploy\b/i,
  /\bGate J\b/,
  /\bProduct Catalog\/Odoo\b/,
  /\bNo Public Authority Opened\b/,
  /\bSafe-now Conceptual Wording\b/,
  /\bDenied Claim Terms\b/,
  /\bPublication Gates\b/,
  /\bOptions And Recommendation\b/,
  /\bno public support or compliance claim\b/i,
];

const REQUIRED_EVIDENCE_PATTERNS = [
  /\bREADY_SDK_W400_PRIVATE_SELECT_GUARD_CONSUMER_PROJECTION_HANDOFF\b/,
  /\bca22befe42b0b164576d2e87bcd29fee0c746ad4\b/,
  /\bREADY_LICENSING_W401_PRODUCT_CATALOG_FEATURE_VALUE_DECISION_PACKET\b/,
  /\b183daa97eb45464d63e72d4657c9a85ca27c3498\b/,
  /\bREADY_LICENSING_W402_GATE_J_NONPROD_FEATURE_VALUE_VALIDATION_PACKET\b/,
  /\b9147236c0f463d86fa34290515ca5e47072c19fb\b/,
  /\bWebsite W403\b/,
  /\b62c8f7c411e959bac72ba8f4f4a91eb16b49da7b\b/,
  /\bREADY_DOCS_W376_DATAFUSION_ASYNC_TOOL_NO_DEPLOY_BOUNDARY\b/,
  /\b5f7ba5c818c7e6d5a40c17bf7dc8138c4169709b\b/,
];

const REQUIRED_SAFE_NOW_PATTERNS = [
  /\bcatalog-controlled feature access\b/i,
  /\bdeployment-token feature values\b/i,
  /\bactive support\/account coverage\b/i,
  /\bGate J non-production validation posture\b/i,
  /\bprivate\/admin-only\b/i,
  /\bread-only planning\b/i,
  /\bvalidated Product Catalog\/Odoo authority\b/i,
  /\bfail closed\b/i,
];

const REQUIRED_DENIAL_PATTERNS = [
  /\bno production population\b/i,
  /\bno implicit existing-token grants\b/i,
  /\bno module upgrade\/restart\b/i,
  /\bno Odoo mutation\b/i,
  /\bno public support\/compliance claims\b/i,
  /\bno runtime\/async dispatch claims\b/i,
  /\bW394\/W400 SELECT denials\b/i,
  /\bnon-grantable denials\b/i,
  /\bcap\.arrow\.runtime\b[\s\S]{0,160}\binternal dependency\/readiness only\b/i,
  /\bnot customer-visible standalone capability\b/i,
  /\bfeatures_json\b/,
  /\bfeatures_override\b/,
];

const REQUIRED_FUTURE_GATE_PATTERNS = [
  /\bexact upstream checkpoints\b/i,
  /\bapproved customer-facing phrasing\b/i,
  /\bpublic-surface scans\b/i,
  /\bpublication\/deploy authority\b/i,
  /\brollback plan\b/i,
];

const PUBLIC_SURFACE_DENIED_PATTERNS = [
  ['W407 private wave reference', /\bW407\b/],
  ['W401-W403 private wave reference', /\bW40[123]\b/],
  ['W394/W400 private SELECT reference', /\bW394\b|\bW400\b/],
  ['raw feature source field', /\bx_nxus_features_json\b|\bfeatures_json\b|\bfeatures_override\b/],
  ['private capability value', /\bcap\.(?:tool\.async_invocation|arrow\.runtime|datafusion\.gateway|datafusion\.table_provider(?:\.clips|\.bn)?)\b/],
  ['Odoo Product Catalog internals', /\bOdoo\b|\bProduct Catalog\/Odoo\b/i],
  ['Gate J private validation reference', /\bGate J\b/],
  ['async runtime dispatch claim', /\basync\b[\s\S]{0,120}\b(runtime dispatch|dispatch wiring|managed queue)\b/i],
  [
    'Gate J callback/webhook claim',
    /\b(Gate J|feature values?|deployment tokens?|DataFusion|Arrow|Product Catalog)\b[\s\S]{0,180}\b(callbacks?|webhooks?)\b/i,
  ],
  ['DataFusion CE runtime claim', /\b(CE|Community Edition|community)\b[\s\S]{0,180}\b(DataFusion|Arrow)\b[\s\S]{0,180}\b(runtime|gateway|table[- ]provider|SQL execution|query execution)\b/i],
  [
    'Gate J runtime/API/provider authority',
    /\b(Gate J|feature values?|deployment tokens?|DataFusion|Arrow|async)\b[\s\S]{0,220}\b(runtime[-_ ]ready|provider[-_ ]registry|public API|public schema|public CLI|runtime provider)\b/i,
  ],
  ['release/package authority', /\b(release[-_ ]ready|package[-_ ]ready|release\/package authority)\b/i],
  ['support/compliance authority', /\b(support|compliance)[-_ ]ready\b|\bsupport readiness\b|\bcompliance readiness\b|\bsupport\/compliance claims\b/i],
  ['customer-visible capability promise', /\bcustomer-visible (?:grant|capability|promise|feature|SKU)\b/i],
  [
    'SELECT grant confusion',
    /\b(SELECT|hidden side effects?|denials?)\b[\s\S]{0,180}\b(grantable|feature values?|capabilities?|customer-visible)\b/i,
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

  console.log('W407 Gate J boundary validation passed');
  console.log(`Boundary packet: ${relativePath(README)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validatePacket() {
  const text = readText(README);
  validateRequired(text, EXPECTED_PACKET_PATTERNS, README);
  validateRequired(text, REQUIRED_EVIDENCE_PATTERNS, README);
  validateRequired(text, REQUIRED_SAFE_NOW_PATTERNS, README);
  validateRequired(text, REQUIRED_DENIAL_PATTERNS, README);
  validateRequired(text, REQUIRED_FUTURE_GATE_PATTERNS, README);
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
