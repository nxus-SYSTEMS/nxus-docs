#!/usr/bin/env node

import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSyncAdjacentModel } from './sync-adjacent-helper.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));

const fixtureCases = [
  {
    file: 'fixtures/positive/approved-selection-safe.json',
    expected: 'pass',
  },
  {
    file: 'fixtures/positive/transform-output-safe.json',
    expected: 'pass',
  },
  {
    file: 'fixtures/negative/raw-manifest-default.json',
    expected: 'fail',
    expectedRules: ['approved-public-selection-required'],
  },
  {
    file: 'fixtures/negative/hello-provider-production-ready.json',
    expected: 'fail',
    expectedRules: ['hello-provider-profile-required', 'hello-provider-profile-boundary'],
  },
  {
    file: 'fixtures/negative/companion-doc-unapproved.json',
    expected: 'fail',
    expectedRules: ['companion-docs-approved-parent'],
  },
  {
    file: 'fixtures/negative/w198-output-authority.json',
    expected: 'fail',
    expectedRules: ['w198-forbidden-fragment-authority'],
  },
  {
    file: 'fixtures/negative/non-passed-projection-authority.json',
    expected: 'fail',
    expectedRules: ['non-passed-projection-authority'],
  },
  {
    file: 'fixtures/negative/private-surface-public-runtime.json',
    expected: 'fail',
    expectedRules: ['private-surface-boundary'],
  },
  {
    file: 'fixtures/negative/hosted-ai-index-private-spec.json',
    expected: 'fail',
    expectedRules: ['hosted-ai-index-private-artifact'],
  },
];

let failures = 0;

for (const fixture of fixtureCases) {
  const fullPath = path.join(ROOT, fixture.file);
  const parsed = JSON.parse(await readFile(fullPath, 'utf8'));
  const result = validateSyncAdjacentModel(parsed, { source: fixture.file });
  const rules = new Set(result.violations.map((violation) => violation.rule));

  if (fixture.expected === 'pass') {
    try {
      assert.equal(result.ok, true, `${fixture.file} should pass without violations`);
      assert.deepEqual(result.violations, []);
      console.log(`PASS ${fixture.file}`);
    } catch (error) {
      failures += 1;
      console.error(`FAIL ${fixture.file}: ${error.message}`);
      console.error(JSON.stringify(result.violations, null, 2));
    }
    continue;
  }

  try {
    assert.equal(result.ok, false, `${fixture.file} should fail`);
    for (const expectedRule of fixture.expectedRules) {
      assert.equal(rules.has(expectedRule), true, `${fixture.file} should include ${expectedRule}`);
    }
    console.log(`PASS ${fixture.file}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${fixture.file}: ${error.message}`);
    console.error(JSON.stringify(result.violations, null, 2));
  }
}

if (failures > 0) {
  console.error(`sync-adjacent helper fixture tests failed: ${failures}`);
  process.exit(1);
}

console.log(`sync-adjacent helper fixture tests passed: ${fixtureCases.length}`);
