#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const W198_FORBIDDEN_FRAGMENTS = [
  'public-docs',
  'public_docs',
  'docs-allowed',
  'docs_allowed',
  'downstream-emission',
  'downstream_emission',
  'downstream-emission-authorized',
  'downstream_emission_authorized',
  'provider-registry',
  'provider_registry',
  'package-publication',
  'package_publication',
  'npm-ready',
  'npm_ready',
  'release-ready',
  'release_ready',
  'public-ready',
  'public_ready',
  'generated-artifact',
  'generated_artifact',
  'generated-artifact-ready',
  'generated_artifact_ready',
];

const DENIAL_CONTEXT = /\b(?:blocked|bounded|closed|denied|deny|denies|denial|do not|does not|fail closed|forbidden|hard stop|internal|must not|no|non-emitted|not|only as|private|reject|rejected|scan vocabulary|source-trace|suppress|suppressed|unsafe|without)\b/i;
const AUTHORITY_CONTEXT = /\b(?:allowed|api|approved|available|availability|default|emission|entry|generated|package|public|ready|readiness|registry|release|runtime|shipped|stable|support|supported|wrapper)\b/i;
const NEGATED_BOUNDARY_ESCAPE = /\bnot\s+(?:private|internal|gated|bounded|blocked|denied|unsupported|validation[- ]pending|non-emitted)\b/i;

const HELLO_PROVIDER_DENIED = [
  /\bproduction[- ]ready\b/i,
  /\bgetting[- ]started\b/i,
  /\bonboarding\b/i,
  /\bnew[- ]user\b/i,
  /\bbroad provider intake\b/i,
  /\bprovider intake\b/i,
  /\bengine (?:inventory|discovery)\b/i,
  /\bclips smoke\b/i,
  /\bprovider[- ]registry\b/i,
  /\bruntime provider\b/i,
  /\bpublic (?:wrapper|api)\b/i,
  /\bgeneralized mesh\b/i,
  /\breal smoke\b/i,
  /\bwindows\b/i,
  /\bmacos x86_64\b/i,
];

const NON_PASSED_AUTHORITY = [
  /\bpublic docs? allowed\b/i,
  /\bpublic[-_]docs[-_]?allowed\b/i,
  /\brelease[- ]ready\b/i,
  /\bpackage[- ]ready\b/i,
  /\bprovider[- ]registry[- ]ready\b/i,
  /\bwrapper\/api[- ]ready\b/i,
  /\bapi[- ]ready\b/i,
  /\bgenerated[- ]artifact[- ]ready\b/i,
  /\bdownstream[- ]emission[- ]authorized\b/i,
];

const PRIVATE_SURFACES = [
  /\brre\b/i,
  /\brust[- ]rule[- ]engine\b/i,
  /\bprolog\b/i,
  /\bscryer\b/i,
  /\bcedar\b/i,
  /\bclips\b/i,
  /\bpydantic v?2\b/i,
  /\btypescript\/zod\b/i,
  /\btypescript\b/i,
  /\bzod\b/i,
  /\bnode wrapper\b/i,
];

const PRIVATE_SURFACE_AUTHORITY = [
  /\bpublic\b/i,
  /\bshipped\b/i,
  /\bruntime\b/i,
  /\bprovider[- ]registry\b/i,
  /\bpackage\b/i,
  /\bnpm\b/i,
  /\bapi\b/i,
  /\bdefault\b/i,
  /\bfull\b/i,
  /\brelease\b/i,
  /\bsupport(?:ed)?\b/i,
  /\bavailable\b/i,
  /\bavailability\b/i,
  /\bdependency\b/i,
  /\breplacement\b/i,
];

const BOUNDED_STATUS_CLASSES = [
  /\binternal[- ]only\b/i,
  /\blicensed[- ]private\b/i,
  /\bresearch\b/i,
  /\bexperimental\b/i,
  /\bpreview\b/i,
  /\bunsupported\b/i,
  /\bvalidation[- ]pending\b/i,
  /\bdenied\b/i,
  /\bstale\b/i,
  /\bdowngraded\b/i,
  /\bblocked[- ]by[- ]cap\b/i,
];

const STATUS_OVERCLAIM = [
  /\bpublic\b/i,
  /\bavailability\b/i,
  /\bce availability\b/i,
  /\bcustomer support\b/i,
  /\bstable\b/i,
  /\bsupported\b/i,
  /\bfeature\b/i,
  /\brelease\b/i,
];

export function validateText(text, options = {}) {
  const source = options.source ?? '[inline text]';
  const violations = [];
  const lines = String(text).split(/\r?\n/);

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const normalized = line.trim();
    if (!normalized) return;

    checkHelloProvider(normalized, source, lineNumber, violations);
    checkW198Fragments(normalized, source, lineNumber, violations);
    checkNonPassedProjection(normalized, source, lineNumber, violations);
    checkPrivateSurfaceBoundary(normalized, source, lineNumber, violations);
    checkBoundedStatusClasses(normalized, source, lineNumber, violations);
  });

  return {
    ok: violations.length === 0,
    violations,
  };
}

function checkHelloProvider(line, source, lineNumber, violations) {
  if (!/\bhello-provider\b/i.test(line)) return;
  if (isDenialContext(line)) return;

  for (const pattern of HELLO_PROVIDER_DENIED) {
    if (pattern.test(line)) {
      violations.push({
        rule: 'hello-provider-profile-boundary',
        source,
        line: lineNumber,
        message: '`hello-provider` must remain extension_authoring / SDK extension authorship, not onboarding or production-ready copy.',
        text: line,
      });
      return;
    }
  }
}

function checkW198Fragments(line, source, lineNumber, violations) {
  const found = W198_FORBIDDEN_FRAGMENTS.filter((fragment) => line.toLowerCase().includes(fragment));
  if (found.length === 0 || isDenialContext(line) || isQuotedFragmentVocabulary(line)) return;

  violations.push({
    rule: 'w198-forbidden-fragment-authority',
    source,
    line: lineNumber,
    message: `W198 fragment(s) appear as possible authority: ${found.join(', ')}`,
    text: line,
  });
}

function checkNonPassedProjection(line, source, lineNumber, violations) {
  if (!/\bnon[- ]`?passed`?\b/i.test(line) || isDenialContext(line)) return;

  const found = NON_PASSED_AUTHORITY.filter((pattern) => pattern.test(line));
  if (found.length === 0 && !AUTHORITY_CONTEXT.test(line)) return;

  violations.push({
    rule: 'non-passed-projection-authority',
    source,
    line: lineNumber,
    message: 'Non-Passed projection rows must not produce public docs, release, package, registry, wrapper/API, generated artifact, or downstream authority.',
    text: line,
  });
}

function checkPrivateSurfaceBoundary(line, source, lineNumber, violations) {
  if (!PRIVATE_SURFACES.some((pattern) => pattern.test(line)) || isDenialContext(line)) return;
  if (!PRIVATE_SURFACE_AUTHORITY.some((pattern) => pattern.test(line))) return;

  violations.push({
    rule: 'private-surface-boundary',
    source,
    line: lineNumber,
    message: 'Private/static/planning surfaces must not expand to public runtime, provider, package, API, registry, release, or support copy.',
    text: line,
  });
}

function checkBoundedStatusClasses(line, source, lineNumber, violations) {
  if (!BOUNDED_STATUS_CLASSES.some((pattern) => pattern.test(line)) || isDenialContext(line)) return;
  if (!STATUS_OVERCLAIM.some((pattern) => pattern.test(line))) return;

  violations.push({
    rule: 'bounded-status-class-overclaim',
    source,
    line: lineNumber,
    message: 'Bounded status classes must stay private/gated/non-claim and not become public availability, release, support, or stable feature copy.',
    text: line,
  });
}

function isDenialContext(line) {
  if (NEGATED_BOUNDARY_ESCAPE.test(line)) return false;
  return DENIAL_CONTEXT.test(line);
}

function isQuotedFragmentVocabulary(line) {
  const stripped = line
    .replace(/`(?:public-docs|public_docs|docs-allowed|docs_allowed|downstream-emission|downstream_emission|downstream-emission-authorized|downstream_emission_authorized|provider-registry|provider_registry|package-publication|package_publication|npm-ready|npm_ready|release-ready|release_ready|public-ready|public_ready|generated-artifact|generated_artifact|generated-artifact-ready|generated_artifact_ready)`/gi, '')
    .replace(/[,\s.;:()[\]-]/g, '')
    .replace(/\band\b/gi, '');

  return stripped === '';
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(args.length === 0 ? 1 : 0);
  }

  let totalViolations = 0;
  for (const filePath of args) {
    const text = await readFile(filePath, 'utf8');
    const result = validateText(text, { source: filePath });
    if (result.ok) {
      console.log(`PASS ${filePath}`);
      continue;
    }

    totalViolations += result.violations.length;
    console.error(`FAIL ${filePath}`);
    for (const violation of result.violations) {
      console.error(`${violation.source}:${violation.line}: ${violation.rule}: ${violation.message}`);
      console.error(`  ${violation.text}`);
    }
  }

  if (totalViolations > 0) {
    console.error(`claim-boundary helper found ${totalViolations} violation(s)`);
    process.exit(1);
  }
}

function printHelp() {
  const self = path.relative(process.cwd(), fileURLToPath(import.meta.url));
  console.log(`Usage: node ${self} FILE [FILE...]

Private W204 helper for advisory claim-boundary checks over dry-run text or
fixtures. It is intentionally not wired into package scripts, sync scripts,
routed docs generation, CI, release, deploy, or public docs publication.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
