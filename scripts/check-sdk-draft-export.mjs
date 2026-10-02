import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { exportSdkPackagingDocs, toSdkStarlightPage } from './sync-local-docs.mjs';
import { FORBIDDEN_PUBLIC_DOCS_TERMS } from './public-docs-policy.mjs';
const repo = process.env.NXUSKIT_REPO;
const commit = process.env.NXUSKIT_DOCS_COMMIT;
assert.ok(repo && /^[a-f0-9]{40}$/.test(commit ?? ''), 'Set exact repo and NXUSKIT_DOCS_COMMIT');
const show = (file) => execFileSync('git', ['-C', repo, 'show', `${commit}:${file}`], { encoding: 'utf8' });
const changelog = show('CHANGELOG.md');
await mkdir('tmp', { recursive: true });
const root = await mkdtemp('tmp/ga-d01-draft-');
const sourceRoot = await mkdtemp('tmp/ga-d01-source-');
const files = execFileSync('git', ['-C', repo, 'ls-tree', '-r', '--name-only', commit, 'sdk-packaging/docs'], { encoding: 'utf8' }).trim().split('\n');
for (const file of files) {
  const target = join(sourceRoot, file.slice('sdk-packaging/docs/'.length));
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, show(file));
}
async function snapshot(dir) {
  const result = {};
  async function walk(base, prefix = '') {
    for (const entry of await readdir(base, { withFileTypes: true })) {
      const rel = join(prefix, entry.name);
      if (entry.isDirectory()) await walk(join(base, entry.name), rel);
      else result[rel] = await readFile(join(base, entry.name), 'utf8');
    }
  }
  await walk(dir);
  return result;
}
await exportSdkPackagingDocs(sourceRoot, root, changelog);
await mkdir(join(root, 'reference'), { recursive: true });
await writeFile(join(root, 'reference/changelog.md'), toSdkStarlightPage(changelog, 'CHANGELOG.md', changelog));
const first = await snapshot(root);
await exportSdkPackagingDocs(sourceRoot, root, changelog);
assert.deepEqual(await snapshot(root), first, 'Repeated packaging export changes bytes');
const page = first['getting-started/first-call.md'];
assert.match(page, /title: "First Call"/);
assert.match(page, /nxusKit SDK v2\.0\.0/);
assert.match(page, /\]\(\/nxuskit\/getting-started\/installation\/\)/);
assert.match(page, /\]\(\/nxuskit\/reference\/cli-reference\/\)/);
assert.match(page, /"provider":"loopback","model":"echo"/);
assert.match(page, /under `response`/);
assert.match(first['getting-started/installation.md'], /\]\(\/nxuskit\/getting-started\/first-call\/\)/);
const failures = [];
for (const [file, content] of Object.entries(first)) {
  for (const term of FORBIDDEN_PUBLIC_DOCS_TERMS) if (content.includes(term)) failures.push(`${file}: ${term}`);
  if (/\/Users\/|\/home\/|[a-f0-9]{40}|codex\/|TODO|TBD/.test(content)) failures.push(`${file}: strict path/identity/placeholder scan`);
}
console.log(`PASS repeated export, first-call metadata/links/envelope; source ${commit}; output ${root}`);
if (failures.length) {
  console.error('HELD full-source leak scan:\n' + failures.join('\n'));
  process.exitCode = 1;
} else console.log('PASS full-source public leak scan');
