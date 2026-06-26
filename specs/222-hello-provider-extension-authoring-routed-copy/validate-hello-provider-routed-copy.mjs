#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { validateText } from '../204-private-claim-boundary-validation-helper/claim-boundary-helper.mjs';

const DOC_ROOT = 'src/content/docs/nxuskit/examples';
const PAGE_PATH = path.join(DOC_ROOT, 'patterns/hello-provider/index.md');
const INDEX_PATH = path.join(DOC_ROOT, 'index.md');

const requiredPageSnippets = [
  'extension_authoring',
  'extension-authoring example',
  'SDK extension authorship',
  'deterministic local manifest fixture',
  'fixture-backed provider response',
  'no network calls',
  'no credentials',
  'no third-party SDKs',
];

const deniedHelloProviderPatterns = [
  /\bhello-provider\b[\s\S]{0,160}\bproduction[- ]ready\b/i,
  /\bproduction[- ]ready\b[\s\S]{0,160}\bhello-provider\b/i,
  /\bhello-provider\b[\s\S]{0,160}\bgetting[- ]started\b/i,
  /\bgetting[- ]started\b[\s\S]{0,160}\bhello-provider\b/i,
  /\bhello-provider\b[\s\S]{0,160}\bonboarding\b/i,
  /\bonboarding\b[\s\S]{0,160}\bhello-provider\b/i,
  /\bhello-provider\b[\s\S]{0,160}\bnew[- ]user\b/i,
  /\bnew[- ]user\b[\s\S]{0,160}\bhello-provider\b/i,
  /\bhello-provider\b[\s\S]{0,160}\bprovider[- ]registry\b/i,
  /\bprovider[- ]registry\b[\s\S]{0,160}\bhello-provider\b/i,
  /\bhello-provider\b[\s\S]{0,160}\bruntime[- ]ready\b/i,
  /\bruntime[- ]ready\b[\s\S]{0,160}\bhello-provider\b/i,
  /\bhello-provider\b[\s\S]{0,160}\bpublic api[- ]ready\b/i,
  /\bpublic api[- ]ready\b[\s\S]{0,160}\bhello-provider\b/i,
  /\bhello-provider\b[\s\S]{0,160}\brelease[- ]ready\b/i,
  /\brelease[- ]ready\b[\s\S]{0,160}\bhello-provider\b/i,
  /\bhello-provider\b[\s\S]{0,160}\bwindows\b/i,
  /\bwindows\b[\s\S]{0,160}\bhello-provider\b/i,
  /\bhello-provider\b[\s\S]{0,160}\bmacos x86_64\b/i,
  /\bmacos x86_64\b[\s\S]{0,160}\bhello-provider\b/i,
];

const deniedPublicSurfacePatterns = [
  /\b(?:CLIPS|RRE|rust-rule-engine|Prolog|Scryer|Cedar|Pydantic v?2|TypeScript\/Zod|Node wrapper)\b[\s\S]{0,160}\b(?:public|routed|runtime|provider|package|support|API|release)\b/i,
  /\b(?:public|routed|runtime|provider|package|support|API|release)\b[\s\S]{0,160}\b(?:CLIPS|RRE|rust-rule-engine|Prolog|Scryer|Cedar|Pydantic v?2|TypeScript\/Zod|Node wrapper)\b/i,
];

const failures = [];

if (!existsSync(PAGE_PATH)) {
  failures.push(`${PAGE_PATH} is missing`);
} else {
  const page = await readFile(PAGE_PATH, 'utf8');
  for (const snippet of requiredPageSnippets) {
    if (!page.includes(snippet)) {
      failures.push(`${PAGE_PATH} missing required snippet: ${snippet}`);
    }
  }
  assertNoPatterns(page, deniedHelloProviderPatterns, PAGE_PATH);
  assertNoPatterns(page, deniedPublicSurfacePatterns, PAGE_PATH);
  assertTextGuard(page, PAGE_PATH);
}

if (!existsSync(INDEX_PATH)) {
  failures.push(`${INDEX_PATH} is missing`);
} else {
  const index = await readFile(INDEX_PATH, 'utf8');
  for (const snippet of [
    '35 approved public examples',
    '1 extension-authoring example',
    '[hello-provider](/nxuskit/examples/patterns/hello-provider/)',
  ]) {
    if (!index.includes(snippet)) {
      failures.push(`${INDEX_PATH} missing required snippet: ${snippet}`);
    }
  }
  assertNoPatterns(index, deniedHelloProviderPatterns, INDEX_PATH);
  assertTextGuard(extractHelloProviderLines(index), `${INDEX_PATH}:hello-provider-lines`);
}

if (failures.length > 0) {
  console.error('hello-provider routed copy validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('hello-provider routed copy validation passed');

function assertNoPatterns(text, patterns, label) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      failures.push(`${label} contains denied pattern: ${match[0].replace(/\s+/g, ' ')}`);
    }
  }
}

function assertTextGuard(text, label) {
  const result = validateText(text, { source: label });
  for (const violation of result.violations) {
    failures.push(`${label} failed ${violation.rule}: ${violation.text}`);
  }
}

function extractHelloProviderLines(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => /hello-provider|extension-authoring|35 approved public examples|1 extension-authoring example/i.test(line))
    .join('\n');
}
