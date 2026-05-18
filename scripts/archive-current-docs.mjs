#!/usr/bin/env node

import { archiveCurrentDocs } from './docs-archive.mjs';
import { currentDocsVersion } from './docs-version.mjs';

const overwrite = process.argv.includes('--force');
const versionArg = process.argv.find((arg) => /^v?\d+\.\d+\.\d+$/.test(arg));
const version = versionArg ?? currentDocsVersion();
const result = await archiveCurrentDocs(version, { overwrite });

if (result.archived) {
  console.log(`Archived current docs as ${result.version}: ${result.path}`);
} else {
  console.log(`Archive already exists for ${result.version}: ${result.path}`);
}
