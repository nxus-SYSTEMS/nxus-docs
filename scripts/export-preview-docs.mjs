#!/usr/bin/env node
// Export only an explicitly reviewed SDK preview source, never the current tree.
import { execFileSync } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const [repo, candidate] = process.argv.slice(2);
if (!repo || !/^[a-f0-9]{40}$/.test(candidate ?? '')) {
  throw new Error('Usage: node scripts/export-preview-docs.mjs SDK_REPO FULL_COMMIT_SHA');
}
const source = execFileSync('git', ['-C', repo, 'show', `${candidate}:sdk-packaging/docs/preview-linux-pro.md`], { encoding: 'utf8' });
if (!source.startsWith('---\n') || !source.includes('pagefind: false') || !source.includes('banner:')) {
  throw new Error('Reviewed preview source must provide frontmatter, pagefind: false and a preview banner');
}
if (/nxuskit-sdk-\*|1\.1\.0|\/Users\/|nxusKit-internal|purchase_id|TODO|TBD/.test(source)) {
  throw new Error('Preview source contains stale, private or unaccepted instructions');
}
const target = resolve('src/content/docs/preview/nxuskit-v2');
await mkdir(target, { recursive: true });
await writeFile(resolve(target, 'installation.md'), source);
console.log('Exported reviewed preview installation source; current docs untouched.');
