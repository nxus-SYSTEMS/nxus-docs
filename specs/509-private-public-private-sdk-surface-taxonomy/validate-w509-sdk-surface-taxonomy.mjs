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
  /\bDocs W509\b/,
  /\bNXUSKIT-V2-MEGA-20260605\b/,
  /\bprivate\/no-deploy\b/i,
  /\bpublic\/private SDK surface taxonomy\b/i,
  /\bNo Public Authority Opened\b/,
  /\bOperator Approvals Recorded As Private And Gated\b/,
  /\bDraft Classification Matrix\b/,
  /\bSurface Coverage\b/,
  /\bDenied Public Claims\b/,
  /\bPublication Gates\b/,
  /\bOptions And Recommendation\b/,
];

const REQUIRED_SOURCE_PATTERNS = [
  /\bSDK W470\b/,
  /\b98d8f2dca7d50ecd7404413f149f9cf38f6f1e6e\b/,
  /\bSDK W507\b/,
  /\bb165966c52d1d9d8f5b618c82bcd44bbe0423a5b\b/,
  /\bSDK W508\b/,
  /\bf31dc932baad00330c31caa37bba5ab283779365\b/,
  /\bSDK W509\b/,
  /\bDocs W472\b/,
  /\b261ba47e57c41427982097e0670475b911e12d62\b/,
  /\bDocs W459\b/,
  /\b40a3b795f7b4e4732a02aeae373e6cd13ce4cb34\b/,
  /\bDocs W428\b/,
  /\b82b32ae54e35a1f86885c834f9bdd897fe562f01\b/,
  /\bDocs W418\b/,
  /\bDocs W376\b/,
  /\b5f7ba5c818c7e6d5a40c17bf7dc8138c4169709b\b/,
  /\bDevOps run-log standing approvals\b/,
];

const REQUIRED_APPROVALS = [
  /\bPrivate synthetic DataFusion execution bundle\b/,
  /\bPrivate async lifecycle integration bundle\b/,
  /\bPublic\/private SDK surface classification bundle\b/,
  /\bProduct Catalog\/Odoo nonproduction entitlement bundle\b/,
  /\bDownstream refresh bundle\b/,
  /\bRelease readiness dry-run bundle\b/,
];

const REQUIRED_CLASSIFICATIONS = [
  /\bprivate-now\/internal-only\b/,
  /\bpublic-candidate-draft\b/,
  /\bgated-until-execution-proof\b/,
  /\bgated-until-entitlement\/dev-Odoo proof\b/,
  /\bdownstream-refresh-candidate\b/,
  /\brelease-dry-run-candidate\b/,
  /\bforbidden\/publication-closed\b/,
];

const REQUIRED_SURFACES = [
  /\bRust engine\/internal module surfaces\b/,
  /\bpublic SDK\/API\/schema\/CLI\/wrapper\/prelude candidates\b/,
  /\bPython\/Go wrapper considerations\b/,
  /\bDataFusion runtime\/proof surfaces\b/,
  /\basync lifecycle\/result-ref\/receipt\/event surfaces\b/,
  /\bprovider\/source\/fixture surfaces\b/,
  /\bProduct Catalog\/Odoo entitlement surfaces\b/,
  /\bexamples\/docs\/website public wording boundaries\b/,
  /\bDemos public wording boundaries\b/,
  /\brelease\/package metadata boundaries\b/,
];

const REQUIRED_DEMO_PATTERNS = [
  /\bsandbox-first\b/i,
  /\bRun in an official sandbox\b/,
  /\bOpen in\s+Codespaces\/devcontainer\b/,
  /\binspect source\/provenance and run with\s+bounded fixtures\b/,
  /\bbinary packages\b[\s\S]{0,120}\bgated-later\b/i,
  /\bsales-room-only\b/i,
  /\bunsigned zips\b/i,
  /\bsource-less executables\b/i,
  /\bsigning\/provenance\/release gates\b/i,
];

const REQUIRED_DENIALS = [
  /\bpublic API availability promise\b/i,
  /\bpublic schema availability promise\b/i,
  /\bpublic CLI availability promise\b/i,
  /\bwrapper availability promise\b/i,
  /\bprelude availability promise\b/i,
  /\bproduction readiness wording\b/i,
  /\bsupport\/compliance\/security guarantee\b/i,
  /\brelease\/publish\/deploy claim\b/i,
  /\bproduction Odoo\/customer grant claim\b/i,
  /\bprovider-registry readiness claim\b/i,
  /\bruntime-provider readiness claim\b/i,
];

const REQUIRED_GATE_PATTERNS = [
  /\bexact SDK checkpoints\b/i,
  /\bpublic\/private classification owner\b/i,
  /\bexecution proof\b/i,
  /\bnonproduction entitlement proof\b/i,
  /\bpublic wording approval\b/i,
  /\bsource and built-output scans\b/i,
  /\bpublication\/deploy authority\b/i,
  /\brollback plan\b/i,
];

const PACKET_FORBIDDEN_PATTERNS = [
  ['production-ready wording', /(?<!428-)\bprod(?:uction)?[- ]?ready\b/iu],
  ['public-ready wording', /\bpublic[- ]ready\b/iu],
  ['support/compliance/security ready wording', /\b(?:support|compliance|security)[- ]ready\b/iu],
  ['guaranteed support/compliance/security outcome', /\bguaranteed (?:support|compliance|security|safe|safety|outcome)\b/iu],
  ['HIPAA/SOC2 claim', /\bHIPAA[- ]compliant\b|\bSOC ?2[- ]compliant\b/iu],
  ['availability-now claim', /\bavailable now\b|\bnow available\b|\bshipped today\b|\bis shipped\b|\bare shipped\b/iu],
  [
    'production Odoo/customer grant claim',
    /\bproduction (?:Odoo|customer|catalog)[\s\S]{0,120}\bgrant(?:s|ed|ing)?\s+(?:is|are|becomes|become|remains|remain)?\s*(?:available|enabled|issued|active|live)\b/iu,
  ],
];

const PUBLIC_SURFACE_DENIED_PATTERNS = [
  ['W509 private wave reference', /\bW509\b/],
  ['W507/W508 private wave reference', /\bW50[7-8]\b/],
  ['W470/W472 private wave reference', /\bW470\b|\bW472\b/],
  [
    'private checkpoint reference',
    /\b98d8f2dca7d50ecd7404413f149f9cf38f6f1e6e\b|\bb165966c52d1d9d8f5b618c82bcd44bbe0423a5b\b|\bf31dc932baad00330c31caa37bba5ab283779365\b|\b261ba47e57c41427982097e0670475b911e12d62\b|\b40a3b795f7b4e4732a02aeae373e6cd13ce4cb34\b|\b82b32ae54e35a1f86885c834f9bdd897fe562f01\b|\b5f7ba5c818c7e6d5a40c17bf7dc8138c4169709b\b/,
  ],
  ['private classification category leak', /\bprivate-now\/internal-only\b|\bpublic-candidate-draft\b|\bgated-until-execution-proof\b|\bgated-until-entitlement\/dev-Odoo proof\b|\bdownstream-refresh-candidate\b|\brelease-dry-run-candidate\b|\bforbidden\/publication-closed\b/],
  ['private SDK taxonomy phrase leak', /\bpublic\/private SDK surface taxonomy\b/i],
  ['sandbox-first demo wording leak', /\bRun in an official sandbox\b|\bCodespaces\/devcontainer\b|\bsandbox-first\b/i],
  ['binary demo trust posture leak', /\bunsigned zips?\b|\bsource-less executables?\b|\bbinary packages\b[\s\S]{0,120}\bgated-later\b/i],
  ['DataFusion runtime public authority', /\bDataFusion\b[\s\S]{0,220}\b(runtime availability|runtime execution|gateway execution|public API|public schema|provider registry|released|shipped)\b/i],
  ['async lifecycle public authority', /\basync lifecycle\b[\s\S]{0,220}\b(public API|public schema|public CLI|callback|webhook|released|shipped|available)\b/i],
  ['provider scan public authority', /\bprovider scan\b[\s\S]{0,220}\b(runtime|public API|public schema|provider registry|available|released|shipped)\b/i],
  ['Product Catalog/Odoo public grant claim', /\b(Product Catalog|Odoo)\b[\s\S]{0,220}\b(production grant|customer grant|customer-visible grant|public grant|live grant)\b/i],
  ['public SDK availability claim', /\b(public SDK|public API|public schema|public CLI|wrapper|prelude)\b[\s\S]{0,120}\b(available now|now available|is shipped|are shipped|released|release-ready|package-ready)\b/i],
  ['support/compliance/security authority', /\b(support|compliance|security)[-_ ]ready\b|\bguaranteed safe\b|\bHIPAA-compliant\b|\bSOC 2 compliant\b/i],
  ['production-ready overclaim', /\bprod(?:uction)?[- ]?ready\b|\bProduction-Ready\b/iu],
];

const CODE_REPOS_FRAGMENT = new RegExp(String.raw`\bcode${'Repos'}\b`);
const PRIVATE_SDK_REPO_NAME = new RegExp(String.raw`\bnxusKit-${'internal'}\b`);
const PRIVATE_EXAMPLES_REPO_NAME = new RegExp(String.raw`\bnxusKit-examples-${'internal'}\b`);
const INTERNAL_PREVIEW_PATH = new RegExp(String.raw`\b${'internal'}/preview\b`);
const SENSITIVE_TOKEN_TEXT = new RegExp(
  String.raw`\b(?:AWS_${'SEC'}${'RET'}|PASS${'WORD'}|SE${'CR'}${'ET'}|TOKEN|BEGIN RSA ${'PRIVATE'} KEY|BEGIN OPENSSH ${'PRIVATE'} KEY|BEGIN ${'PRIVATE'} KEY)\b`,
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

  console.log('W509 private public/private SDK surface taxonomy validation passed');
  console.log(`Taxonomy packet: ${relativePath(README)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validatePacket() {
  const text = readText(README);
  validateRequired(text, EXPECTED_PACKET_PATTERNS, README);
  validateRequired(text, REQUIRED_SOURCE_PATTERNS, README);
  validateRequired(text, REQUIRED_APPROVALS, README);
  validateRequired(text, REQUIRED_CLASSIFICATIONS, README);
  validateRequired(text, REQUIRED_SURFACES, README);
  validateRequired(text, REQUIRED_DEMO_PATTERNS, README);
  validateRequired(text, REQUIRED_DENIALS, README);
  validateRequired(text, REQUIRED_GATE_PATTERNS, README);
  validatePatterns(text, PACKET_FORBIDDEN_PATTERNS, README);
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
