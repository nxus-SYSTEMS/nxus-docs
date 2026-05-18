#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { currentDocsVersionLabel } from './docs-version.mjs';

const DIST_URL = new URL('../dist', import.meta.url);
const shouldCheckDist = process.argv.includes('--dist');
const expectedLabel = currentDocsVersionLabel();
const versionLabelPattern = /v\d+\.\d+\.\d+ \(latest\)/g;

if (shouldCheckDist) {
  await checkRenderedDist();
} else {
  console.log(`Docs version selector label: ${expectedLabel}`);
}

async function checkRenderedDist() {
  if (!existsSync(DIST_URL)) {
    throw new Error('dist/ does not exist. Run Astro build before checking rendered docs version labels.');
  }

  const labels = new Set();

  for await (const filePath of walkHtml(DIST_URL.pathname)) {
    const html = await readFile(filePath, 'utf8');
    for (const label of html.matchAll(versionLabelPattern)) {
      labels.add(label[0]);
    }
  }

  if (labels.size === 0) {
    throw new Error('No rendered docs version selector labels found in dist/.');
  }

  const unexpected = [...labels].filter((label) => label !== expectedLabel);
  if (unexpected.length > 0) {
    throw new Error(
      `Rendered docs version label mismatch. Expected ${expectedLabel}; found ${unexpected.join(', ')}.`,
    );
  }

  console.log(`Rendered docs version selector label: ${expectedLabel}`);
}

async function* walkHtml(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      yield* walkHtml(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      yield fullPath;
    }
  }
}
