import test from 'node:test';
import assert from 'node:assert/strict';
import { firstCallMapping, firstCallRoute, versionedSdkMetadata } from './sdk-doc-contract.mjs';
import { toSdkStarlightPage } from './sync-local-docs.mjs';

test('first-call has a durable packaging target and public route', () => {
  assert.deepEqual(firstCallMapping, ['first-call.md', 'getting-started/first-call.md']);
  assert.equal(firstCallRoute, '/nxuskit/getting-started/first-call/');
});
test('metadata follows the authoritative released heading, ignoring Unreleased', () => {
  const changelog = '# Changelog\n## [Unreleased]\n## [2.0.0]\n## [1.0.5]\n';
  for (const source of ['getting-started.md', 'first-call.md', 'CHANGELOG.md']) {
    const description = versionedSdkMetadata(source, changelog);
    assert.match(description, /v2\.0\.0/);
    assert.doesNotMatch(description, /v1\.x|v1\.0\.5|ZEN|BN|FFI/);
  }
  assert.match(versionedSdkMetadata('getting-started.md', '## [1.0.5]\n'), /v1\.0\.5/);
});
test('missing release identity fails rather than inventing a version', () => {
  assert.throws(() => versionedSdkMetadata('first-call.md', '## [Unreleased]\n'), /semver/);
});
test('local licensing and CLI metadata do not invent Pro capability availability', () => {
  for (const file of ['license-activation-guide.md', 'cli-input-reference.md']) {
    const page = toSdkStarlightPage('# Source title\n\nAuthoritative body.\n', file, '## [2.0.0]\n');
    assert.doesNotMatch(page, /ZEN|runtime plugins|Pro-gated/);
    assert.match(page, /Authoritative body\./);
  }
});
