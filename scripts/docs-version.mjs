import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { skippedArchivedDocsVersions } from './docs-version-policy.mjs';

export const NXUSKIT_CHANGELOG_URL = new URL(
  '../src/content/docs/nxuskit/reference/changelog.md',
  import.meta.url,
);
export const DOCS_CONTENT_URL = new URL('../src/content/docs', import.meta.url);

export function latestReleasedVersionFromChangelog(markdown) {
  const [releaseHeading] = releasedVersionsFromChangelog(markdown);

  if (!releaseHeading) {
    throw new Error('Could not find a released semver heading in nxusKit changelog.');
  }

  return releaseHeading;
}

export function releasedVersionsFromChangelog(markdown) {
  return [...markdown.matchAll(/^## \[(\d+\.\d+\.\d+)\](?:\s+-\s+\d{4}-\d{2}-\d{2})?\s*$/gm)]
    .map((match) => normalizeDocsVersion(match[1]));
}

export function currentDocsVersion() {
  return latestReleasedVersionFromChangelog(readFileSync(NXUSKIT_CHANGELOG_URL, 'utf8'));
}

export function currentDocsVersionLabel() {
  return `${currentDocsVersion()} (latest)`;
}

export function archivedDocsVersions() {
  if (!existsSync(DOCS_CONTENT_URL)) return [];

  return readdirSync(DOCS_CONTENT_URL, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isDocsVersion(entry.name))
    .map((entry) => entry.name)
    .sort(compareDocsVersionsDesc);
}

export function archivedStarlightVersions() {
  return archivedDocsVersions().map((version) => ({
    slug: version,
    label: version,
  }));
}

export function skippedDocsVersions() {
  return skippedArchivedDocsVersions.map((record) => ({
    ...record,
    version: normalizeDocsVersion(record.version),
  }));
}

export function isDocsVersion(version) {
  return /^v\d+\.\d+\.\d+$/.test(version);
}

export function normalizeDocsVersion(version) {
  const normalized = version.startsWith('v') ? version : `v${version}`;
  if (!isDocsVersion(normalized)) {
    throw new Error(`Invalid docs version: ${version}`);
  }
  return normalized;
}

export function compareDocsVersions(a, b) {
  const aParts = normalizeDocsVersion(a).slice(1).split('.').map(Number);
  const bParts = normalizeDocsVersion(b).slice(1).split('.').map(Number);

  for (let index = 0; index < 3; index += 1) {
    if (aParts[index] !== bParts[index]) {
      return aParts[index] - bParts[index];
    }
  }

  return 0;
}

export function compareDocsVersionsDesc(a, b) {
  return compareDocsVersions(b, a);
}
