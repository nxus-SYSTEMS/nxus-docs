import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, readdir, writeFile, symlink, stat } from 'node:fs/promises';
import { openSync, closeSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { FORBIDDEN_PUBLIC_DOCS_TERMS } from './public-docs-policy.mjs';
const source = resolve(process.env.SDK_DRAFT_EXPORT ?? 'tmp/ga-d01-draft-Hzms2R');
const route = '/preview/nxuskit-v2-ga/';
async function files(root, prefix = '') {
  const result = [];
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const rel = join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await files(root, rel));
    else result.push(rel);
  }
  return result.sort();
}
async function digest(root) {
  const hash = createHash('sha256');
  for (const file of await files(root)) hash.update(file).update('\0').update(await readFile(join(root, file)));
  return hash.digest('hex');
}
const currentBefore = await digest('src/content/docs');
const stage = resolve(await mkdtemp('tmp/ga-d01-render-'));
for (const path of ['src', 'public', 'scripts', 'astro.config.mjs', 'tsconfig.json', 'package.json', 'package-lock.json']) {
  await cp(path, join(stage, path), { recursive: true });
}
await symlink(resolve('node_modules'), join(stage, 'node_modules'), 'dir');
const sourceFiles = await files(source);
const routes = new Set(sourceFiles.map(file => file.replace(/\.mdx?$/, '/') ));
for (const file of sourceFiles) {
  let markdown = await readFile(join(source, file), 'utf8');
  markdown = markdown.replace(/^---\n/, "---\npagefind: false\nbanner:\n  content: 'Unpublished v2.0.0 GA source draft — purchaser/package walkthrough pending.'\n");
  markdown = markdown.replace(/\]\(\/nxuskit\/([^)#]+)(#[^)]*)?\)/g, (match, path, hash = '') =>
    routes.has(path) ? `](${route}${path}${hash})` : match);
  const target = join(stage, 'src/content/docs', route, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, markdown);
}
for (const args of [['run', 'astro', 'check'], ['run', 'build']]) {
  const log = join(stage, args.includes('build') ? 'build.log' : 'astro-check.log');
  const fd = openSync(log, 'w');
  const result = spawnSync('npm', args, { cwd: stage, stdio: ['ignore', fd, fd] });
  closeSync(fd);
  assert.equal(result.status, 0, `Failed ${args.join(' ')}; inspect ${log}`);
}
let links = 0;
for (const file of sourceFiles) {
  const htmlPath = join(stage, 'dist', route, file.replace(/\.mdx?$/, '/index.html'));
  const html = await readFile(htmlPath, 'utf8');
  assert.match(html, /noindex, follow/);
  assert.match(html, /Unpublished v2.0.0 GA source draft/);
  assert.ok(!html.includes('data-pagefind-body'));
  for (const term of FORBIDDEN_PUBLIC_DOCS_TERMS) assert.ok(!html.includes(term), `${file}: ${term}`);
  assert.ok(!/\/Users\/|\/home\/|[a-f0-9]{40}|codex\//.test(html), `${file}: private path/identity`);
  for (const match of html.matchAll(/href="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    const path = match[1];
    if (!path.endsWith('/')) continue;
    await stat(join(stage, 'dist', path, 'index.html'));
    links++;
  }
}
for (const file of ['llms.txt', 'llms-full.txt', ...(await readdir(join(stage, 'dist'))).filter(f => /^sitemap.*\.xml$/.test(f))]) {
  assert.ok(!(await readFile(join(stage, 'dist', file), 'utf8')).includes(route), file);
}
assert.equal(await digest('src/content/docs'), currentBefore);
const current = await readFile(join(stage, 'dist/nxuskit/getting-started/installation/index.html'), 'utf8');
assert.match(current, /v1\.0\.5 \(latest\)/);
console.log(JSON.stringify({ stage, exportSha256: await digest(source), outputSha256: await digest(join(stage, 'dist', route)), renderedPages: sourceFiles.length, checkedLinks: links, result: 'PASS Astro/build/render/links/leaks/search/sitemap/LLM/current invariance' }));
