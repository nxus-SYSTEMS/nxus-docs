import { readFileSync } from 'node:fs';

export const NXUSKIT_CHANGELOG_URL = new URL(
  '../src/content/docs/nxuskit/reference/changelog.md',
  import.meta.url,
);

export function latestReleasedVersionFromChangelog(markdown) {
  const releaseHeading = markdown.match(/^## \[(\d+\.\d+\.\d+)\](?:\s+-\s+\d{4}-\d{2}-\d{2})?\s*$/m);

  if (!releaseHeading) {
    throw new Error('Could not find a released semver heading in nxusKit changelog.');
  }

  return `v${releaseHeading[1]}`;
}

export function currentDocsVersion() {
  return latestReleasedVersionFromChangelog(readFileSync(NXUSKIT_CHANGELOG_URL, 'utf8'));
}

export function currentDocsVersionLabel() {
  return `${currentDocsVersion()} (latest)`;
}
