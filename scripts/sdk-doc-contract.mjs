import { latestReleasedVersionFromChangelog } from './docs-version.mjs';

export const firstCallMapping = ['first-call.md', 'getting-started/first-call.md'];
export const firstCallRoute = '/nxuskit/getting-started/first-call/';

export function versionedSdkMetadata(sourceRel, changelog) {
  const version = latestReleasedVersionFromChangelog(changelog);
  const descriptions = {
    'getting-started.md': `Install nxusKit SDK ${version} and configure the supported developer surfaces.`,
    'first-call.md': `Run a first call with nxusKit SDK ${version} using the authoritative package instructions.`,
    'CHANGELOG.md': `Release notes for nxusKit SDK ${version} and earlier versions.`,
  };
  return sourceRel in descriptions ? descriptions[sourceRel] : undefined;
}
