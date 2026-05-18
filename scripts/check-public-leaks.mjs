#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORBIDDEN_PUBLIC_DOCS_TERMS } from './public-docs-policy.mjs';

const DOCS_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const CONTENT_ROOT = path.join(DOCS_ROOT, 'src/content/docs');

const failures = [];

for await (const filePath of walkMarkdown(CONTENT_ROOT)) {
  const content = await readFile(filePath, 'utf8');
  for (const term of FORBIDDEN_PUBLIC_DOCS_TERMS) {
    const index = content.indexOf(term);
    if (index === -1) continue;

    failures.push({
      filePath,
      term,
      line: 1 + content.slice(0, index).split('\n').length - 1,
    });
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`${path.relative(DOCS_ROOT, failure.filePath)}:${failure.line}: forbidden public-docs term "${failure.term}"`);
  }
  process.exit(1);
}

console.log('public docs leak check: clean');

async function* walkMarkdown(root) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      yield* walkMarkdown(fullPath);
    } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      yield fullPath;
    }
  }
}
