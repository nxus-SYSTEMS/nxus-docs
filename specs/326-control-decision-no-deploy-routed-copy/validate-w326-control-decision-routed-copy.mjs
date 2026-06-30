#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

const ROUTE_FILE = path.join(
  REPO_ROOT,
  'src/content/docs/nxuskit/concepts/local-control-decisions.md',
);
const ARCHITECTURE_FILE = path.join(
  REPO_ROOT,
  'src/content/docs/nxuskit/concepts/architecture.md',
);
const DIST_ROUTE_FILE = path.join(
  REPO_ROOT,
  'dist/nxuskit/concepts/local-control-decisions/index.html',
);
const PUBLIC_DOCS_ROOT = path.join(REPO_ROOT, 'src/content/docs');
const DIST_ROOT = path.join(REPO_ROOT, 'dist');

const REQUIRED_ROUTE_PATTERNS = [
  /\btitle:\s*Local Control Decisions\b/,
  /\blocal control decision\b/i,
  /\bconsequence boundary\b/i,
  /\bstronger policy\b/i,
  /\blocal preferences\b/i,
  /\bactor, action, resource, and context\b/i,
  /\bcapability is not available\b/i,
  /\bsafe next step\b/i,
  /\badvanced extension action\b/i,
  /\bNo external action was taken\./,
];

const SOURCE_ROUTE_DENIED_PATTERNS = [
  ['class-like private name', /\bControlDecision\b/],
  ['raw stage label', /\bStage\s*0\/1\/2\b|\bStage\s+[012]\b|\bstage[012]\b/i],
  ['private spine ref', /\bprivate_control_decision_stage012_spine\b/i],
  ['private projection ref', /\bprivate_stage012_control_decision_non_claim\b/i],
  ['configuration precedence', /\bconfiguration precedence\b/i],
  ['PARC authorization', /\bPARC authorization\b/i],
  ['provider registry', /\bprovider[-_ ]registry\b/i],
  ['runtime provider', /\bruntime[-_ ]provider\b/i],
  ['runtime ready', /\bruntime[-_ ]ready\b/i],
  ['public ready', /\bpublic[-_ ]ready\b/i],
  ['release ready', /\brelease[-_ ]ready\b/i],
  ['package ready', /\bpackage[-_ ]ready\b/i],
  ['support ready', /\bsupport[-_ ]ready\b/i],
  ['compliance ready', /\bcompliance[-_ ]ready\b/i],
  ['public API', /\bpublic API\b/i],
  ['public schema', /\bpublic schema\b/i],
  ['plugin', /\bplugin\b/i],
  ['private entitlement key', /\bplugin_loading\b|\bdelegated_trust_roots\b|\brequired_entitlements\b|\brequired_edition\b/i],
  ['signed bundle authority', /\bsigned_manifest\b|\bsigned_binary\b/i],
  ['dispatch-time authority', /\bdispatch[-_ ]time\b/i],
  ['support claim', /\bsupport\b/i],
  ['compliance claim', /\bcompliance\b/i],
  ['shipped claim', /\bshipped\b/i],
  ['available-now claim', /\bavailable now\b/i],
];

const PUBLIC_SURFACE_DENIED_PATTERNS = [
  ['class-like private name', /\bControlDecision\b/],
  ['raw Stage 0/1/2 label', /\bStage\s*0\/1\/2\b/i],
  ['private spine ref', /\bprivate_control_decision_stage012_spine\b/i],
  ['private projection ref', /\bprivate_stage012_control_decision_non_claim\b/i],
  ['configuration precedence', /\bconfiguration precedence\b/i],
  ['PARC authorization', /\bPARC authorization\b/i],
  ['private entitlement key', /\bplugin_loading\b|\bdelegated_trust_roots\b|\brequired_entitlements\b|\brequired_edition\b/i],
  ['provider-registry-ready authority', /\bprovider[-_ ]registry[-_ ]ready\b/i],
  ['runtime-ready authority', /\bruntime[-_ ]ready\b/i],
  ['api-ready authority', /\bapi[-_ ]ready\b/i],
  ['package-ready authority', /\bpackage[-_ ]ready\b/i],
  ['release-ready authority', /\brelease[-_ ]ready\b/i],
  ['support-ready authority', /\bsupport[-_ ]ready\b/i],
  ['compliance-ready authority', /\bcompliance[-_ ]ready\b/i],
  ['generated-artifact-ready authority', /\bgenerated[-_ ]artifact[-_ ]ready\b/i],
  ['downstream-emission authority', /\bdownstream[-_ ]emission\b/i],
  [
    'control-decision public API/schema authority',
    /\b(ControlDecision|control[- ]decision|Stage\s*0\/1\/2|configuration precedence|PARC authorization)\b[\s\S]{0,180}\b(public API|public schema)\b/i,
  ],
];

const CODE_REPOS_FRAGMENT = new RegExp(String.raw`\bcode${'Repos'}\b`);
const PRIVATE_SDK_REPO_NAME = new RegExp(String.raw`\bnxusKit-${'internal'}\b`);
const PRIVATE_EXAMPLES_REPO_NAME = new RegExp(String.raw`\bnxusKit-examples-${'internal'}\b`);

const LOCAL_EVIDENCE_PATTERNS = [
  ['home absolute path', /\/Users\//],
  ['repo absolute path fragment', CODE_REPOS_FRAGMENT],
  ['private tmp path', /\/private\/tmp\b|\/tmp\/worktrees\b/],
  ['internal preview package path', /\binternal\/preview\b/],
  ['private SDK repo name', PRIVATE_SDK_REPO_NAME],
  ['private Examples repo name', PRIVATE_EXAMPLES_REPO_NAME],
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
  validateRouteCopy();
  validateRouteLink();
  scanTree(PUBLIC_DOCS_ROOT, PUBLIC_SURFACE_DENIED_PATTERNS, 'src/content/docs');
  scanLocalEvidence([
    ROUTE_FILE,
    ARCHITECTURE_FILE,
    path.join(REPO_ROOT, 'specs/317-control-decision-public-safe-no-deploy-copy'),
    path.join(REPO_ROOT, 'specs/326-control-decision-no-deploy-routed-copy'),
  ]);

  if (checkDist) {
    if (!fs.existsSync(DIST_ROUTE_FILE)) {
      fail(`built route not found: ${relativePath(DIST_ROUTE_FILE)}`);
    }
    scanTree(DIST_ROOT, PUBLIC_SURFACE_DENIED_PATTERNS, 'dist');
  }

  console.log('W326 no-deploy routed copy validation passed');
  console.log(`Route: ${relativePath(ROUTE_FILE)}`);
  console.log(`Architecture link: ${relativePath(ARCHITECTURE_FILE)}`);
  console.log(`Built output checked: ${checkDist}`);
}

function validateRouteCopy() {
  const text = readText(ROUTE_FILE);
  for (const pattern of REQUIRED_ROUTE_PATTERNS) {
    if (!pattern.test(text)) {
      fail(`route copy missing required pattern ${pattern}`);
    }
  }
  validatePatterns(text, SOURCE_ROUTE_DENIED_PATTERNS, ROUTE_FILE);
}

function validateRouteLink() {
  const text = readText(ARCHITECTURE_FILE);
  const link = '/nxuskit/concepts/local-control-decisions/';
  if (!text.includes(link)) {
    fail(`architecture page does not link to ${link}`);
  }
}

function scanLocalEvidence(paths) {
  for (const entryPath of paths) {
    if (!fs.existsSync(entryPath)) continue;
    const stat = fs.statSync(entryPath);
    if (stat.isDirectory()) {
      for (const file of walkTextFiles(entryPath)) {
        validatePatterns(readText(file), LOCAL_EVIDENCE_PATTERNS, file);
      }
    } else {
      validatePatterns(readText(entryPath), LOCAL_EVIDENCE_PATTERNS, entryPath);
    }
  }
}

function scanTree(root, patterns, label) {
  if (!fs.existsSync(root)) return;
  for (const file of walkTextFiles(root)) {
    validatePatterns(readText(file), patterns, file, label);
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
  } catch (error) {
    fail(`failed to read ${relativePath(file)}: ${error.message}`);
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
