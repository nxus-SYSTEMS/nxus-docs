import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cp, mkdtemp, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { toSdkStarlightPage } from './sync-local-docs.mjs';
const repo = process.env.NXUSKIT_REPO;
const commit = 'fbd4b3bf0c63a0b0672246a6b85ec9f5bb61e874';
const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' });
const file = 'sdk-packaging/docs/api-reference.md';
assert.equal(git('diff', '--name-only', '6c0412668b063c0d8da4110389cb31aa6b98dc58', commit, '--', 'sdk-packaging/docs', 'CHANGELOG.md').trim(), file);
const raw = git('show', `${commit}:${file}`);
const hash = text => createHash('sha256').update(text).digest('hex');
assert.equal(hash(raw), 'c13f06a467cd0258aae818cb30a2372d7b4d3df702210c0a973549aa11d6b7aa');
assert.match(raw, /\[Provider Reference\]\(providers\/cloud-llms\.md\)/);
git('show', `${commit}:sdk-packaging/docs/providers/cloud-llms.md`);
const page = toSdkStarlightPage(raw, 'api-reference.md', git('show', `${commit}:CHANGELOG.md`));
assert.match(page, /\[Provider Reference\]\(\/nxuskit\/reference\/providers\/cloud-llms\/\)/);
const target = await mkdtemp('tmp/ga-d01-fbd-export-');
await cp('tmp/ga-d01-6c-export-ZGEU27', target, { recursive: true });
await writeFile(`${target}/reference/api-reference.md`, page);
console.log(JSON.stringify({ commit, target, sourceSha256: hash(raw), pageSha256: hash(page), result: 'PASS existing converter normalizes package link; no converter repair' }));
const result = spawnSync(process.execPath, ['scripts/check-sdk-draft-render.mjs'], {
  env: { ...process.env, SDK_DRAFT_EXPORT: target, SDK_DRAFT_AFFECTED_PAGE: 'reference/api-reference.md' }, stdio: 'inherit',
});
process.exit(result.status ?? 1);
