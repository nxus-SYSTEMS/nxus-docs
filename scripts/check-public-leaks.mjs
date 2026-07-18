#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORBIDDEN_PUBLIC_DOCS_PATTERNS, FORBIDDEN_PUBLIC_DOCS_TERMS } from './public-docs-policy.mjs';

const DOCS_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const CONTENT_ROOT = path.join(DOCS_ROOT, 'src/content/docs');
const DIST_ROOT = path.join(DOCS_ROOT, 'dist');
const CHECK_DIST = process.argv.includes('--dist');

const failures = [];

const sourceFiles = [];
for await (const filePath of walkPublicFiles(CONTENT_ROOT, /\.(md|mdx)$/i)) sourceFiles.push(filePath);
const builtFiles = [];
if (CHECK_DIST) {
  for await (const filePath of walkPublicFiles(DIST_ROOT, /\.(html|txt|xml|json)$/i)) builtFiles.push(filePath);
}

for (const filePath of [...sourceFiles, ...builtFiles]) {
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

  for (const [term, pattern] of FORBIDDEN_PUBLIC_DOCS_PATTERNS) {
    const match = content.match(pattern);
    if (!match || match.index === undefined) continue;

    failures.push({
      filePath,
      term,
      line: 1 + content.slice(0, match.index).split('\n').length - 1,
    });
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`${path.relative(DOCS_ROOT, failure.filePath)}:${failure.line}: forbidden public-docs term "${failure.term}"`);
  }
  process.exit(1);
}

console.log(CHECK_DIST ? 'public docs leak check: clean source and built output' : 'public docs leak check: clean source');

async function* walkPublicFiles(root, extensions) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      yield* walkPublicFiles(fullPath, extensions);
    } else if (entry.isFile() && extensions.test(entry.name)) {
      yield fullPath;
    }
  }
}
