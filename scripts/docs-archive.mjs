import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { DOCS_CONTENT_URL, normalizeDocsVersion } from './docs-version.mjs';

const CURRENT_DOCS_ENTRIES = ['index.mdx', 'github', 'nxuskit'];

export async function archiveCurrentDocs(version, options = {}) {
  const normalizedVersion = normalizeDocsVersion(version);
  const docsRoot = DOCS_CONTENT_URL.pathname;
  const archiveRoot = path.join(docsRoot, normalizedVersion);

  if (existsSync(archiveRoot)) {
    if (!options.overwrite) {
      return { version: normalizedVersion, archived: false, path: archiveRoot };
    }
    await rm(archiveRoot, { recursive: true, force: true });
  }

  await mkdir(archiveRoot, { recursive: true });

  for (const entryName of CURRENT_DOCS_ENTRIES) {
    const sourcePath = path.join(docsRoot, entryName);
    if (!existsSync(sourcePath)) continue;
    await copyArchiveEntry(sourcePath, path.join(archiveRoot, entryName), normalizedVersion, archiveRoot);
  }

  return { version: normalizedVersion, archived: true, path: archiveRoot };
}

async function copyArchiveEntry(sourcePath, targetPath, version, archiveRoot) {
  const statsEntries = await readdir(path.dirname(sourcePath), { withFileTypes: true });
  const sourceName = path.basename(sourcePath);
  const sourceEntry = statsEntries.find((entry) => entry.name === sourceName);

  if (!sourceEntry) return;

  if (sourceEntry.isDirectory()) {
    await mkdir(targetPath, { recursive: true });
    for (const entry of await readdir(sourcePath, { withFileTypes: true })) {
      await copyArchiveEntry(path.join(sourcePath, entry.name), path.join(targetPath, entry.name), version, archiveRoot);
    }
    return;
  }

  await mkdir(path.dirname(targetPath), { recursive: true });

  if (sourceEntry.isFile() && /\.(md|mdx)$/.test(sourceName)) {
    const archived = toArchivedMarkdown(await readFile(sourcePath, 'utf8'), targetPath, version, archiveRoot);
    await writeFile(targetPath, archived, 'utf8');
  } else if (sourceEntry.isFile()) {
    await copyFile(sourcePath, targetPath);
  }
}

function toArchivedMarkdown(markdown, targetPath, version, archiveRoot) {
  const route = archiveRouteForFile(targetPath, version, archiveRoot);
  const withSlug = upsertFrontmatterValue(markdown, 'slug', route);

  return withSlug
    .replace(/(^|[^A-Za-z0-9.:_-])\/nxuskit(?=\/|#|\)|"|'|\s|$)/g, `$1/${version}/nxuskit`)
    .replace(/(^|[^A-Za-z0-9.:_-])\/github(?=\/|#|\)|"|'|\s|$)/g, `$1/${version}/github`);
}

function archiveRouteForFile(targetPath, version, archiveRoot) {
  let relativePath = path.relative(archiveRoot, targetPath).replace(/\\/g, '/').replace(/\.mdx?$/, '');
  if (relativePath === 'index') return version;
  if (relativePath.endsWith('/index')) relativePath = relativePath.slice(0, -6);
  return `${version}/${relativePath}`;
}

function upsertFrontmatterValue(markdown, key, value) {
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---\s*/);

  if (!frontmatter) {
    return ['---', `${key}: ${value}`, '---', '', markdown.trimStart()].join('\n');
  }

  const body = markdown.slice(frontmatter[0].length);
  const lines = frontmatter[1].split('\n');
  const keyPattern = new RegExp(`^${key}:\\s*`);
  const existingIndex = lines.findIndex((line) => keyPattern.test(line));

  if (existingIndex >= 0) {
    lines[existingIndex] = `${key}: ${value}`;
  } else {
    lines.push(`${key}: ${value}`);
  }

  return ['---', ...lines, '---', '', body.trimStart()].join('\n');
}
