import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { currentDocsVersionLabel } from './docs-version.mjs';
assert.match(currentDocsVersionLabel(), /1\.0\.5/);
execFileSync('git', ['diff', '--exit-code', '259c4d14f4ba5b67582e9e98630f21043d795879', '--', 'src/content/docs/nxuskit', 'src/content/versions']);
const html = await readFile('dist/preview/nxuskit-v2/index.html', 'utf8');
assert.match(html, /noindex, follow/);
assert.match(html, /Preview preparation draft/);
assert.match(html, /rel="canonical" href="https:\/\/docs.nxus.systems\/preview\/nxuskit-v2\//);
assert.ok(!html.includes('data-pagefind-body'));
assert.match(html, /href="\/nxuskit\/getting-started\/installation\/"/);
await stat('dist/nxuskit/getting-started/installation/index.html');
const installation = await readFile('dist/preview/nxuskit-v2/installation/index.html', 'utf8');
assert.match(installation, /glibc 2.39/);
assert.match(installation, /live activation pending/);
assert.ok(!installation.includes('data-pagefind-body'));
assert.match(installation, /noindex, follow/);
assert.ok(!/[a-f0-9]{40}|36928672954|nxusKit-internal|\/Users\//.test(installation));
for (const file of ['dist/llms.txt', 'dist/llms-full.txt', ...(await readdir('dist')).filter(f => /^sitemap.*\.xml$/.test(f)).map(f => `dist/${f}`)]) {
  assert.ok(!(await readFile(file, 'utf8')).includes('/preview/'), file);
}
console.log('PASS preview banner/canonical/noindex/search exclusion, sitemap/LLM exclusions, current version/source invariance and current link.');
