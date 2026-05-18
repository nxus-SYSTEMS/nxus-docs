#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  archivedDocsVersions,
  compareDocsVersions,
  currentDocsVersion,
  currentDocsVersionLabel,
  NXUSKIT_CHANGELOG_URL,
  releasedVersionsFromChangelog,
  skippedDocsVersions,
} from './docs-version.mjs';

const DIST_URL = new URL('../dist', import.meta.url);
const shouldCheckDist = process.argv.includes('--dist');
const shouldExplain = process.argv.includes('--explain');
const expectedLabel = currentDocsVersionLabel();
const versionLabelPattern = /v\d+\.\d+\.\d+ \(latest\)/g;

await checkArchivePolicy();

if (shouldCheckDist) {
  await checkRenderedDist();
} else {
  console.log(`Docs version selector label: ${expectedLabel}`);
  if (shouldExplain) {
    console.log(`Archived docs versions: ${archivedDocsVersions().join(', ') || '(none)'}`);
    console.log(`Skipped archive versions: ${skippedDocsVersions().map((record) => record.version).join(', ') || '(none)'}`);
  }
}

async function checkArchivePolicy() {
  const changelog = await readFile(NXUSKIT_CHANGELOG_URL, 'utf8');
  const releases = releasedVersionsFromChangelog(changelog);
  const current = currentDocsVersion();
  const archived = archivedDocsVersions();
  const skipped = skippedDocsVersions();
  const releaseSet = new Set(releases);
  const archivedSet = new Set(archived);
  const skippedSet = new Set(skipped.map((record) => record.version));

  if (releases[0] !== current) {
    throw new Error(`Current docs version mismatch. Expected ${releases[0]} from changelog; got ${current}.`);
  }

  for (const version of archived) {
    if (!releaseSet.has(version)) {
      throw new Error(`Archived docs version ${version} is not present in the current nxusKit changelog.`);
    }

    if (compareDocsVersions(version, current) >= 0) {
      throw new Error(`Archived docs version ${version} must be older than current ${current}.`);
    }
  }

  for (const { version } of skipped) {
    if (!releaseSet.has(version)) {
      throw new Error(`Skipped archive version ${version} is not present in the current nxusKit changelog.`);
    }

    if (archivedSet.has(version)) {
      throw new Error(`Skipped archive version ${version} also has an archive directory. Remove the skip record.`);
    }
  }

  if (archived.length === 0) return;

  const oldestArchived = archived.at(-1);
  const missing = releases
    .filter((version) => compareDocsVersions(version, current) < 0)
    .filter((version) => compareDocsVersions(version, oldestArchived) >= 0)
    .filter((version) => !archivedSet.has(version) && !skippedSet.has(version));

  if (missing.length > 0) {
    throw new Error(
      `Released docs versions need archive directories or skip records: ${missing.join(', ')}. ` +
      'Run npm run archive:docs before syncing a newer SDK release, or add a deliberate skip record in scripts/docs-version-policy.mjs.',
    );
  }
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
