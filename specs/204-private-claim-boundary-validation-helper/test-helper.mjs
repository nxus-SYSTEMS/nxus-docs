#!/usr/bin/env node

import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateText } from './claim-boundary-helper.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));

const fixtureCases = [
  {
    file: 'fixtures/positive/safe-extension-authoring.md',
    expected: 'pass',
  },
  {
    file: 'fixtures/positive/safe-denial-vocabulary.md',
    expected: 'pass',
  },
  {
    file: 'fixtures/negative/hello-provider-overclaim.md',
    expected: 'fail',
    expectedRules: ['hello-provider-profile-boundary'],
  },
  {
    file: 'fixtures/negative/forbidden-fragment-authority.md',
    expected: 'fail',
    expectedRules: ['w198-forbidden-fragment-authority'],
  },
  {
    file: 'fixtures/negative/non-passed-projection-authority.md',
    expected: 'fail',
    expectedRules: ['non-passed-projection-authority'],
  },
  {
    file: 'fixtures/negative/private-surface-expansion.md',
    expected: 'fail',
    expectedRules: ['private-surface-boundary'],
  },
  {
    file: 'fixtures/negative/private-surface-negated-boundary.md',
    expected: 'fail',
    expectedRules: ['private-surface-boundary'],
  },
  {
    file: 'fixtures/negative/status-class-overclaim.md',
    expected: 'fail',
    expectedRules: ['bounded-status-class-overclaim'],
  },
];

let failures = 0;

for (const fixture of fixtureCases) {
  const fullPath = path.join(ROOT, fixture.file);
  const text = await readFile(fullPath, 'utf8');
  const result = validateText(text, { source: fixture.file });
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
  console.error(`claim-boundary helper fixture tests failed: ${failures}`);
  process.exit(1);
}

console.log(`claim-boundary helper fixture tests passed: ${fixtureCases.length}`);
