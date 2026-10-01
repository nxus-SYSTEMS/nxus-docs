#!/usr/bin/env node
// Export only an explicitly reviewed SDK preview source, never the current tree.
import { execFileSync } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
const [repo, candidate] = process.argv.slice(2);
if (!repo || !/^[a-f0-9]{40}$/.test(candidate ?? '')) {
  throw new Error('Usage: node scripts/export-preview-docs.mjs SDK_REPO FULL_COMMIT_SHA');
}
const source = execFileSync('git', ['-C', repo, 'show', `${candidate}:sdk-packaging/docs/preview-linux-pro.md`], { encoding: 'utf8' });
const expectedHash = process.env.PREVIEW_SOURCE_SHA256;
if (!expectedHash || createHash('sha256').update(source).digest('hex') !== expectedHash) {
  throw new Error('PREVIEW_SOURCE_SHA256 must match the exact reviewed source');
}
if (/nxuskit-sdk-\*|1\.1\.0|\/Users\/|TODO|TBD/.test(source)) {
  throw new Error('Preview source contains stale, private or unaccepted instructions');
}
const retrieval = source.split('## Retrieval after distribution approval\n')[1]?.split('## Recipient-bound activation')[0];
const activation = source.split('## Recipient-bound activation\n')[1]?.split('## Publication isolation')[0];
if (!retrieval || !activation) throw new Error('Expected reviewed preview sections absent');
// Keep administrative evidence, internal commits/run IDs and publication machinery
// out of the public participant instructions.
const publicActivation = activation.replace(' and is not an `INT-` CI/QA grant', '');
const output = `---\ntitle: Linux Pro preview installation\ndescription: Qualified package baseline and prepared developer activation instructions.\npagefind: false\nbanner:\n  content: 'v2.0.0 preview draft — qualified package; distribution and live activation pending.'\n---\n\n[Preview overview](/preview/nxuskit-v2/) · [Current v1.0.5 docs](/nxuskit/getting-started/installation/)\n\n## Qualified package baseline\n\nThe qualified package is nxuskit-sdk-2.0.0-pro-linux-x86_64.tar.gz.\nQualification used Linux Mint 22.3 (Zena), Ubuntu Noble lineage, x86_64 and\nglibc 2.39. This is not a claim of support for every Linux distribution.\nExtracted C ABI, Go, Rust dynamic/static, Python wheel/sdist and CLI consumers\npassed package qualification. Pro preview availability claims remain Solver-only.\n\nThe package and this later documentation revision are separate: the qualified\narchive does not contain this subsequent documentation annotation.\n\n## Retrieval after distribution approval\n\n${retrieval}\n## Recipient-bound activation\n\n${publicActivation}`;
const target = resolve('src/content/docs/preview/nxuskit-v2');
await mkdir(target, { recursive: true });
await writeFile(resolve(target, 'installation.md'), output);
console.log('Exported reviewed preview installation source; current docs untouched.');
