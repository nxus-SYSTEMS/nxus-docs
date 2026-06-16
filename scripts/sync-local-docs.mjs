#!/usr/bin/env node
/**
 * Sync generated product docs from local source repos into this Starlight site.
 *
 * This keeps GitHub focused on building and deploying nxus-docs, while content
 * generation/export can run on a developer machine or another non-GitHub runner.
 */

import { execFileSync } from 'node:child_process';
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { archiveCurrentDocs } from './docs-archive.mjs';
import { compareDocsVersions, latestReleasedVersionFromChangelog } from './docs-version.mjs';
import { FORBIDDEN_PUBLIC_DOCS_TERMS } from './public-docs-policy.mjs';

const DOCS_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const EXAMPLES_REPO = process.env.NXUSKIT_EXAMPLES_REPO;
const SDK_REPO = process.env.NXUSKIT_REPO;
const CODEX_PLUGINS_REPO = process.env.NXUS_CODEX_PLUGINS_REPO;
const PUBLIC_EXAMPLES_URL = 'https://github.com/nxus-SYSTEMS/nxusKit-examples';
const PUBLIC_CODEX_PLUGINS_URL = 'https://github.com/nxus-SYSTEMS/nxus-codex-plugins';
const EXAMPLE_DOC_CATEGORIES = new Set(['patterns', 'integrations', 'apps']);
const EXAMPLES_DOCS_MANIFEST_REL = 'conformance/docs_export_manifest.json';
const EXAMPLES_PUBLICATION_SELECTION_REL = 'conformance/examples_publication_selection.json';
const EXAMPLES_PUBLIC_SELECTION_TYPE = 'nxuskit-examples-approved-public-selection';
const EXAMPLES_DOCS_PUBLIC_CHANNEL = 'docs';
const EXAMPLES_LEGACY_RAW_MANIFEST_ENV = 'NXUSKIT_DOCS_ALLOW_LEGACY_RAW_EXAMPLES_MANIFEST';
const SDK_PACKAGING_DOCS_MAP = [
  ['getting-started.md', 'getting-started/installation.md'],
  ['auth-modes-by-provider.md', 'getting-started/authentication.md'],
  ['api-reference.md', 'reference/api-reference.md'],
  ['cli-input-reference.md', 'reference/cli-reference.md'],
  ['providers/cloud-llms.md', 'reference/providers/cloud-llms.md'],
  ['providers/local-llms.md', 'reference/providers/local-llms.md'],
  ['providers/expert-systems.md', 'reference/providers/expert-systems.md'],
  ['providers/z3-solver.md', 'reference/providers/z3-solver.md'],
  ['rule-authoring.md', 'guides/clips-rule-authoring.md'],
  ['clips-workarounds.md', 'guides/clips-workarounds.md'],
  ['license-activation-guide.md', 'concepts/licensing.md'],
  ['tier-comparison.md', 'concepts/tier-system.md'],
  ['migration-guide.md', 'migration/clips-session-migration.md'],
  ['logprobs-migration.md', 'migration/logprobs-migration.md'],
  ['upgrade-path.md', 'migration/upgrade-path.md'],
];
const SDK_DOC_METADATA = new Map([
  ['getting-started.md', {
    title: 'Installation',
    description: 'Download, install, and configure the nxusKit SDK on macOS, Linux, or Windows.',
  }],
  ['auth-modes-by-provider.md', {
    title: 'Authentication',
    description: 'Configure API keys and credentials for cloud and local LLM providers.',
  }],
  ['api-reference.md', {
    title: 'C ABI Reference',
    description: 'Complete reference for the nxusKit C ABI — all functions, types, and ownership rules.',
  }],
  ['cli-input-reference.md', {
    title: 'CLI Input Format Reference',
    description: 'Input schemas and examples for every Level 1 nxuskit-cli command.',
  }],
  ['providers/cloud-llms.md', {
    title: 'Cloud LLM Providers',
    description: 'Configuration reference for OpenAI, Anthropic, Groq, Mistral, Fireworks, Together, OpenRouter, and Perplexity providers.',
  }],
  ['providers/local-llms.md', {
    title: 'Local LLM Providers',
    description: 'Configuration reference for in-process (llama.cpp, mistral.rs) and HTTP-based (Ollama, LM Studio) local LLM providers.',
  }],
  ['providers/expert-systems.md', {
    title: 'Expert System & Utility Providers',
    description: 'Configuration reference for the CLIPS rule engine, MCP, Mock, and Loopback providers.',
  }],
  ['providers/z3-solver.md', {
    title: 'Z3 Constraint Satisfaction Provider',
    description: 'Configuration and input/output reference for the Z3 SMT solver provider.',
  }],
  ['rule-authoring.md', {
    title: 'CLIPS Rule Authoring Guide',
    description: 'How to write, test, and deploy custom CLIPS rules with the nxusKit SDK.',
  }],
  ['clips-workarounds.md', {
    title: 'CLIPS Excluded Capabilities & Workarounds',
    description: 'Four CLIPS capabilities excluded from the Session API and their working alternatives.',
  }],
  ['license-activation-guide.md', {
    title: 'Licensing',
    description: 'How to activate, manage, and troubleshoot nxusKit Pro licenses.',
  }],
  ['tier-comparison.md', {
    title: 'Tier System',
    description: 'Feature and limit comparison across Community, Pro, and Enterprise editions of nxusKit.',
  }],
  ['migration-guide.md', {
    title: 'CLIPS Session Migration',
    description: 'Migrate from the legacy ClipsEnvironment API to the new ClipsSession API introduced in SDK v0.9.1.',
  }],
  ['logprobs-migration.md', {
    title: 'Logprobs Migration',
    description: 'Migrate to first-class unary chat logprobs in nxusKit SDK v0.9.3.',
  }],
  ['upgrade-path.md', {
    title: 'Upgrade Path',
    description: 'Error messages and resolutions when Pro features are unavailable or licenses need updating.',
  }],
  ['CHANGELOG.md', {
    title: 'Changelog',
    description: 'Release notes for nxusKit SDK versions.',
  }],
]);
const SDK_DOC_LINKS = new Map([
  ['getting-started.md', '/nxuskit/getting-started/installation/'],
  ['auth-modes-by-provider.md', '/nxuskit/getting-started/authentication/'],
  ['api-reference.md', '/nxuskit/reference/api-reference/'],
  ['cli-input-reference.md', '/nxuskit/reference/cli-reference/'],
  ['providers/cloud-llms.md', '/nxuskit/reference/providers/cloud-llms/'],
  ['providers/local-llms.md', '/nxuskit/reference/providers/local-llms/'],
  ['providers/expert-systems.md', '/nxuskit/reference/providers/expert-systems/'],
  ['providers/z3-solver.md', '/nxuskit/reference/providers/z3-solver/'],
  ['rule-authoring.md', '/nxuskit/guides/clips-rule-authoring/'],
  ['clips-workarounds.md', '/nxuskit/guides/clips-workarounds/'],
  ['license-activation-guide.md', '/nxuskit/concepts/licensing/'],
  ['tier-comparison.md', '/nxuskit/concepts/tier-system/'],
  ['migration-guide.md', '/nxuskit/migration/clips-session-migration/'],
  ['logprobs-migration.md', '/nxuskit/migration/logprobs-migration/'],
  ['upgrade-path.md', '/nxuskit/migration/upgrade-path/'],
  ['CHANGELOG.md', '/nxuskit/reference/changelog/'],
]);
const SDK_PUBLIC_SCRUBBERS = new Map([
  ['license-activation-guide.md', scrubLicenseGuide],
  ['logprobs-migration.md', scrubLogprobsMigrationGuide],
  ['CHANGELOG.md', scrubChangelog],
]);

const args = new Set(process.argv.slice(2));
const explicitTarget = args.has('--examples') || args.has('--sdk') || args.has('--codex-plugins') || args.has('--all');
const shouldSyncExamples = args.has('--all') || args.has('--examples') || !explicitTarget;
const shouldSyncSdk = args.has('--all') || args.has('--sdk');
const shouldSyncCodexPlugins = args.has('--all') || args.has('--codex-plugins');
const skipGenerate = args.has('--skip-generate');

if (args.has('--help') || args.has('-h')) {
  printHelp();
  process.exit(0);
}

const unknownArgs = [...args].filter((arg) => ![
  '--all',
  '--examples',
  '--sdk',
  '--codex-plugins',
  '--skip-generate',
  '--help',
  '-h',
].includes(arg));

if (unknownArgs.length > 0) {
  console.error(`Unexpected argument(s): ${unknownArgs.join(', ')}`);
  printHelp();
  process.exit(1);
}

async function main() {
  const synced = [];

  if (shouldSyncSdk) {
    await archiveCurrentDocsBeforeSdkSync();
  }

  if (shouldSyncExamples) {
    await syncExamples();
    synced.push('nxusKit examples');
  }

  if (shouldSyncSdk) {
    await syncSdk();
    synced.push('nxusKit SDK');
  }

  if (shouldSyncCodexPlugins) {
    await syncCodexPlugins();
    synced.push('nxus Codex Plugins');
  }

  console.log(`Synced ${synced.join(' and ')} docs into nxus-docs.`);
}

async function syncExamples() {
  assertEnv('NXUSKIT_EXAMPLES_REPO', EXAMPLES_REPO);
  assertDirectory(EXAMPLES_REPO, 'nxusKit examples repo');

  if (!skipGenerate) {
    run('bash', ['scripts/generate-examples-showcase.sh', '--generate'], EXAMPLES_REPO);
  }

  const sourceReadme = path.join(EXAMPLES_REPO, 'README.md');
  const raw = await readFile(sourceReadme, 'utf8');
  leakGate(raw, sourceReadme);

  const examplesMetadata = await readExamplesManifestMetadata(EXAMPLES_REPO);
  const docsManifest = await readExamplesDocsExportManifest(EXAMPLES_REPO, examplesMetadata);
  const routeBySourceRel = examplesDocsRoutes(examplesMetadata, docsManifest);
  const targetRoot = path.join(DOCS_ROOT, 'src/content/docs/nxuskit/examples');

  await rm(targetRoot, { recursive: true, force: true });
  mkdirSync(targetRoot, { recursive: true });

  const exported = toExamplesStarlightPage(raw, examplesMetadata, routeBySourceRel);
  const target = path.join(targetRoot, 'index.md');
  await writeFile(target, exported, 'utf8');
  await exportExampleReadmePages(EXAMPLES_REPO, targetRoot, examplesMetadata, routeBySourceRel);
  await exportExampleCompanionDocs(EXAMPLES_REPO, targetRoot, docsManifest, routeBySourceRel);
  await validateGeneratedExampleDocs(targetRoot, examplesMetadata, docsManifest);
  await leakGateFiles(targetRoot);

  console.log(`Synced examples docs -> ${path.relative(DOCS_ROOT, targetRoot)}`);
}

async function syncSdk() {
  assertEnv('NXUSKIT_REPO', SDK_REPO);
  assertDirectory(SDK_REPO, 'nxusKit SDK repo');

  const tmpRoot = await mkdtemp(path.join(os.tmpdir(), 'nxuskit-docs-export-'));
  const exportRoot = path.join(tmpRoot, 'nxuskit');
  mkdirSync(exportRoot, { recursive: true });

  const docsUserRoot = path.join(SDK_REPO, 'docs/user');
  const packagingDocsRoot = path.join(SDK_REPO, 'sdk-packaging/docs');
  let exportMode = 'authoritative';

  if (existsSync(docsUserRoot)) {
    await copyDir(docsUserRoot, exportRoot);
    console.log(`Exported SDK docs/user -> ${path.relative(tmpRoot, exportRoot)}`);
  } else if (existsSync(packagingDocsRoot)) {
    await exportSdkPackagingDocs(packagingDocsRoot, exportRoot);
    exportMode = 'packaging';
    console.log(`Exported SDK sdk-packaging/docs -> ${path.relative(tmpRoot, exportRoot)}`);
  } else {
    throw new Error(`SDK docs source not found: ${docsUserRoot} or ${packagingDocsRoot}`);
  }

  const changelog = path.join(SDK_REPO, 'CHANGELOG.md');
  if (existsSync(changelog)) {
    const target = path.join(exportRoot, 'reference/changelog.md');
    mkdirSync(path.dirname(target), { recursive: true });
    const raw = await readFile(changelog, 'utf8');
    await writeFile(target, toSdkStarlightPage(raw, 'CHANGELOG.md'), 'utf8');
  }

  await leakGateFiles(exportRoot);

  const targetRoot = path.join(DOCS_ROOT, 'src/content/docs/nxuskit');
  await archiveCurrentDocsForNewSdkVersion(
    path.join(exportRoot, 'reference/changelog.md'),
    'exported SDK docs',
  );

  if (exportMode === 'authoritative') {
    await replaceDirectoryContents(exportRoot, targetRoot, new Set(['examples']));
  } else {
    await copyDir(exportRoot, targetRoot);
  }
  await rm(tmpRoot, { recursive: true, force: true });
  console.log(`Synced SDK docs -> ${path.relative(DOCS_ROOT, targetRoot)}`);
}

async function archiveCurrentDocsBeforeSdkSync() {
  assertEnv('NXUSKIT_REPO', SDK_REPO);
  assertDirectory(SDK_REPO, 'nxusKit SDK repo');

  await archiveCurrentDocsForNewSdkVersion(
    path.join(SDK_REPO, 'CHANGELOG.md'),
    'SDK source changelog',
  );
}

async function archiveCurrentDocsForNewSdkVersion(newChangelogPath, label) {
  const currentChangelogPath = path.join(DOCS_ROOT, 'src/content/docs/nxuskit/reference/changelog.md');

  if (!existsSync(currentChangelogPath) || !existsSync(newChangelogPath)) {
    return;
  }

  const currentVersion = latestReleasedVersionFromChangelog(await readFile(currentChangelogPath, 'utf8'));
  const newVersion = latestReleasedVersionFromChangelog(await readFile(newChangelogPath, 'utf8'));
  const comparison = compareDocsVersions(newVersion, currentVersion);

  if (comparison < 0) {
    throw new Error(`${label} is older than current docs (${newVersion} < ${currentVersion}).`);
  }

  if (comparison === 0) {
    return;
  }

  const archive = await archiveCurrentDocs(currentVersion);
  if (archive.archived) {
    console.log(`Archived current docs ${currentVersion} -> ${path.relative(DOCS_ROOT, archive.path)}`);
  } else {
    console.log(`Archive already exists for current docs ${currentVersion}: ${path.relative(DOCS_ROOT, archive.path)}`);
  }
}

async function syncCodexPlugins() {
  assertEnv('NXUS_CODEX_PLUGINS_REPO', CODEX_PLUGINS_REPO);
  assertDirectory(CODEX_PLUGINS_REPO, 'nxus Codex Plugins repo');

  const exportRoot = path.join(DOCS_ROOT, 'src/content/docs/codex-plugins');
  await rm(exportRoot, { recursive: true, force: true });
  mkdirSync(path.join(exportRoot, 'nxuskit/task-recipes'), { recursive: true });

  await exportCodexPluginDoc(
    path.join(CODEX_PLUGINS_REPO, 'README.md'),
    path.join(exportRoot, 'index.md'),
    {
      title: 'Codex Plugins',
      description: 'Codex Plugin packages from nxus.SYSTEMS, including nxusKit Celerat.',
      sourceRel: 'README.md',
    },
  );

  await exportCodexPluginDoc(
    path.join(CODEX_PLUGINS_REPO, 'INSTALL.md'),
    path.join(exportRoot, 'install.md'),
    {
      title: 'Install nxusKit Celerat',
      description: 'Install the nxusKit Celerat Codex Plugin from the public nxus.SYSTEMS marketplace.',
      sourceRel: 'INSTALL.md',
    },
  );

  await exportCodexPluginDoc(
    path.join(CODEX_PLUGINS_REPO, 'plugins/nxuskit/README.md'),
    path.join(exportRoot, 'nxuskit/index.md'),
    {
      title: 'nxusKit Celerat',
      description: 'Use nxusKit Celerat to accelerate nxusKit SDK integrations in Codex.',
      sourceRel: 'plugins/nxuskit/README.md',
    },
  );

  const recipesRoot = path.join(CODEX_PLUGINS_REPO, 'examples/codex-task-recipes');
  assertDirectory(recipesRoot, 'nxus Codex Plugins task recipes');

  for (const entry of await readdir(recipesRoot, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    const sourcePath = path.join(recipesRoot, entry.name);
    const targetName = entry.name === 'README.md' ? 'index.md' : entry.name;
    const targetPath = path.join(exportRoot, 'nxuskit/task-recipes', targetName);

    await exportCodexPluginDoc(sourcePath, targetPath, {
      sourceRel: path.posix.join('examples/codex-task-recipes', entry.name),
    });
  }

  await leakGateFiles(exportRoot);
  console.log(`Synced Codex Plugins docs -> ${path.relative(DOCS_ROOT, exportRoot)}`);
}

async function exportCodexPluginDoc(sourcePath, targetPath, options = {}) {
  if (!existsSync(sourcePath)) {
    throw new Error(`Codex plugin doc source not found: ${sourcePath}`);
  }

  const raw = await readFile(sourcePath, 'utf8');
  leakGate(raw, sourcePath);
  mkdirSync(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, toCodexPluginStarlightPage(raw, options), 'utf8');
}

function toCodexPluginStarlightPage(markdown, options = {}) {
  let body = markdown.replace(/^\uFEFF/, '').trimStart();
  const existingFrontmatter = parseFrontmatter(body);
  const sourceRel = options.sourceRel ?? '';

  if (existingFrontmatter) {
    body = existingFrontmatter.body;
  }

  const title = options.title ?? existingFrontmatter?.title ?? extractMarkdownTitle(body);
  const description = options.description ?? existingFrontmatter?.description ?? '';

  body = body.replace(/^#\s+.+\n+/, '');
  body = rewriteCodexPluginLinks(body, sourceRel).trimEnd();

  return [
    '---',
    `title: ${JSON.stringify(title)}`,
    ...(description ? [`description: ${JSON.stringify(description)}`] : []),
    '---',
    '',
    body,
    '',
  ].join('\n');
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\s*/);
  if (!match) return null;

  const frontmatter = match[1];
  const body = markdown.slice(match[0].length).trimStart();
  return {
    title: readSimpleFrontmatterValue(frontmatter, 'title'),
    description: readSimpleFrontmatterValue(frontmatter, 'description'),
    body,
  };
}

function readSimpleFrontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

function rewriteCodexPluginLinks(markdown, sourceRel) {
  return markdown
    .replace(/\[!\[[^\]]*\]\(https:\/\/img\.shields\.io\/badge\/[^)\s]+\)\]\([^)]+\)/g, '')
    .replace(/!\[[^\]]*\]\(https:\/\/img\.shields\.io\/badge\/[^)\s]+\)/g, '')
    .replace(/^\s*\n{2,}/gm, '\n\n')
    .replace(/\]\(([^)\s#]+)(#[^)\s]+)?\)/g, (_, rawLink, hash = '') => {
      const rewritten = codexPluginLinkTarget(rawLink, sourceRel, hash);
      return `](${rewritten})`;
    });
}

function codexPluginLinkTarget(rawLink, sourceRel, hash = '') {
  if (/^(?:https?:|mailto:)/.test(rawLink)) {
    return rawLink
      .replace('https://docs.nxus.systems/nxuskit/', '/nxuskit/')
      .replace('https://docs.nxus.systems/nxuskit', '/nxuskit')
      + hash;
  }

  const normalized = path.posix.normalize(path.posix.join(path.posix.dirname(sourceRel), rawLink));
  const withoutTrailingSlash = normalized.replace(/\/$/, '');

  const internalRoutes = new Map([
    ['README.md', '/codex-plugins/'],
    ['INSTALL.md', '/codex-plugins/install/'],
    ['plugins/nxuskit', '/codex-plugins/nxuskit/'],
    ['plugins/nxuskit/README.md', '/codex-plugins/nxuskit/'],
    ['examples', '/codex-plugins/nxuskit/task-recipes/'],
    ['examples/README.md', '/codex-plugins/nxuskit/task-recipes/'],
    ['examples/codex-task-recipes', '/codex-plugins/nxuskit/task-recipes/'],
    ['examples/codex-task-recipes/README.md', '/codex-plugins/nxuskit/task-recipes/'],
  ]);

  const internalRoute = internalRoutes.get(withoutTrailingSlash);
  if (internalRoute) return `${internalRoute}${hash}`;

  const recipeMatch = withoutTrailingSlash.match(/^examples\/codex-task-recipes\/(.+)\.md$/);
  if (recipeMatch) {
    return `/codex-plugins/nxuskit/task-recipes/${recipeMatch[1]}/${hash}`;
  }

  if (/^(?:CONTRIBUTING|LICENSE(?:-[A-Z]+)?)\.md$/.test(withoutTrailingSlash) || withoutTrailingSlash === 'LICENSE') {
    return `${PUBLIC_CODEX_PLUGINS_URL}/blob/main/${withoutTrailingSlash}${hash}`;
  }

  if (withoutTrailingSlash.startsWith('examples/fixtures/') || withoutTrailingSlash.startsWith('plugins/')) {
    return `${PUBLIC_CODEX_PLUGINS_URL}/tree/main/${withoutTrailingSlash}${hash}`;
  }

  return `${PUBLIC_CODEX_PLUGINS_URL}/blob/main/${withoutTrailingSlash}${hash}`;
}

async function exportSdkPackagingDocs(sourceRoot, exportRoot) {
  for (const [sourceRel, targetRel] of SDK_PACKAGING_DOCS_MAP) {
    const sourcePath = path.join(sourceRoot, sourceRel);
    const targetPath = path.join(exportRoot, targetRel);

    if (!existsSync(sourcePath)) {
      console.warn(`Skipping missing SDK packaging doc: ${sourceRel}`);
      continue;
    }

    mkdirSync(path.dirname(targetPath), { recursive: true });
    const raw = await readFile(sourcePath, 'utf8');
    await writeFile(targetPath, toSdkStarlightPage(raw, sourceRel), 'utf8');
  }
}

function toSdkStarlightPage(markdown, sourceRel) {
  let body = markdown.replace(/^\uFEFF/, '').trimStart();
  if (body.startsWith('---\n')) {
    body = body.replace(/^---\n[\s\S]*?\n---\s*/, '').trimStart();
  }

  const metadata = SDK_DOC_METADATA.get(sourceRel) ?? {
    title: extractMarkdownTitle(body),
    description: '',
  };

  body = body.replace(/^#\s+.+\n+/, '');
  body = scrubSdkDocForPublicSite(body, sourceRel);
  body = rewriteSdkDocLinks(body, sourceRel).trimEnd();

  return [
    '---',
    `title: ${JSON.stringify(metadata.title)}`,
    ...(metadata.description ? [`description: ${JSON.stringify(metadata.description)}`] : []),
    '---',
    '',
    body,
    '',
  ].join('\n');
}

function extractMarkdownTitle(markdown) {
  const h1 = markdown.match(/^#\s+(.+)$/m);
  return h1 ? h1[1].trim() : 'Untitled';
}

function rewriteSdkDocLinks(markdown, sourceRel) {
  return markdown
    .replace(/\[[^\]]+\]\((\.\.\/examples\/[^)\s]*)(#[^)\s]+)?\)/g, '[nxusKit examples](/nxuskit/examples/)')
    .replace(/\[[^\]]+\]\((\.\.\/rust\/README\.md)(#[^)\s]+)?\)/g, '[Rust SDK API documentation](/nxuskit/reference/api/)')
    .replace(/\[([^\]]+)\]\(([^)\s#]+\.md)(#[^)\s]+)?\)/g, (_, text, link, hash = '') => {
      const normalized = path.posix.normalize(path.posix.join(path.posix.dirname(sourceRel), link));
      const target = SDK_DOC_LINKS.get(normalized);
      return target ? `[${text}](${target}${hash})` : `\`${text.replace(/`/g, '')}\``;
    });
}

function scrubSdkDocForPublicSite(markdown, sourceRel) {
  const scrubber = SDK_PUBLIC_SCRUBBERS.get(sourceRel);
  return scrubber ? scrubber(markdown) : markdown;
}

function scrubLicenseGuide(markdown) {
  return markdown
    .replace(
      /The production ES256 public key is embedded at compile time from the DevOps\nrelease artifact at `\.\.\/DevOps\/sharedData\/keys\/es256-production-pubkey\.pem`\.\nStandard users do not configure the key or endpoint\./,
      'The production ES256 public key is embedded in release builds. Standard users do not configure the key or endpoint.',
    )
    .replace(
      /\| \*\*Leased\*\* \| `~\/\.nxuskit\/license\.token` or `NXUSKIT_LICENSE_TOKEN` \| Internal CI\/automation license that can be revoked server-side \| Short lease, default 72 hours \| Yes \|/,
      '| **Leased** | `~/.nxuskit/license.token` or `NXUSKIT_LICENSE_TOKEN` | CI/automation license that can be revoked server-side | Short lease, default 72 hours | Yes |',
    )
    .replace(
      /For CI automations that need a working Pro license but also need routine\nrevocation control, prefer an internally issued leased activation key over a\nlong-lived deployment token\./,
      'For CI automations that need a working Pro license but also need routine\nrevocation control, prefer a leased activation key over a long-lived deployment\ntoken.',
    )
    .replace(
      /Internally issued `leased` tokens are designed for CI\/automation where\nrevocation control matters/,
      '`leased` tokens are designed for CI/automation where revocation control matters',
    );
}

function scrubLogprobsMigrationGuide(markdown) {
  return markdown
    .replace(
      /\*\*Audience:\*\* SDK consumers — Peeler in particular — that previously needed\nto request token log probabilities through `provider_options` because the\nSDK had no first-class field\./,
      '**Audience:** SDK consumers that previously needed to request token log\nprobabilities through `provider_options` because the SDK had no first-class\nfield.',
    )
    .replace(/\n## Out Of Scope For v0\.9\.3 \(historical - now shipped in v0\.9\.4\)[\s\S]*?(?=\n## |$)/, '\n')
    .replace(/\n## Peeler Adoption[\s\S]*$/m, '\n');
}

function scrubChangelog(markdown) {
  return scrubLicenseGuide(markdown)
    .replace(
      /\(no full Responses API migration; see\n  the deferral register\)/,
      '(no full Responses API migration)',
    )
    .replace(
      /\(Community edition;\n  structure search `hill_climb`\/`k2` remains engine-only - see the deferral\n  register\.\)/,
      '(Community edition.)',
    )
    .replace(
      /\n- A deferral register \(`internal\/v0\.9\.4-deferral-register\.md`\) lists items\n  deferred from v0\.9\.4[\s\S]*? with owners and target releases\.\n/,
      '\n',
    )
    .replace(/\n### Deferred\n\n[\s\S]*?(?=\n### Test counts|\n## \[)/m, '\n')
    .replace(/\n+(?=## \[0\.9\.3\])/, '\n\n')
    .replace(
      /  - Release builds embed\n    `\.\.\/DevOps\/sharedData\/keys\/es256-production-pubkey\.pem` with\n    `kid: es256-v1`\./,
      '  - Release builds embed the production ES256 public key with\n    `kid: es256-v1`.',
    )
    .replace(
      /> Published SDK release `sdk-v0\.9\.3`\. Production licensing real-purchase\n> activation\/recovery, PR readiness, and supported-platform SDK build checks\n> passed before release publication; see\n> `specs\/097-sdk-093-release\/release-scorecard\.md` for evidence\./,
      '> Published SDK release `sdk-v0.9.3`. Production licensing real-purchase\n> activation/recovery, PR readiness, and supported-platform SDK build checks\n> passed before release publication.',
    )
    .replace(
      /    Rust \+ Python \+ C ABI before\/after with capability-gating rationale\n    and Peeler adoption \(post-release, not a v0\.9\.3 ship gate\)\./,
      '    Rust + Python + C ABI before/after with capability-gating rationale.',
    )
    .replace(
      /  - \*\*Migration guide:\*\* `sdk-packaging\/docs\/logprobs-migration\.md` covers\n    Rust \+ Python \+ C ABI before\/after with capability-gating rationale\./,
      '  - **Migration guide:** The [logprobs migration guide](/nxuskit/migration/logprobs-migration/) covers\n    Rust + Python + C ABI before/after with capability-gating rationale.',
    )
    .replace(/- Peeler adoption PR — post-release; engine warn-and-drop covers the gap\.\n/g, '');
}

async function readExamplesManifestMetadata(examplesRepo) {
  const selectionPath = path.join(examplesRepo, EXAMPLES_PUBLICATION_SELECTION_REL);
  if (existsSync(selectionPath)) {
    return readExamplesPublicationSelectionMetadata(selectionPath);
  }

  if (process.env[EXAMPLES_LEGACY_RAW_MANIFEST_ENV] === '1') {
    console.warn(
      `${EXAMPLES_PUBLICATION_SELECTION_REL} not found; using legacy raw manifest because ${EXAMPLES_LEGACY_RAW_MANIFEST_ENV}=1.`,
    );
    return readExamplesRawManifestMetadata(examplesRepo);
  }

  throw new Error(
    `${EXAMPLES_PUBLICATION_SELECTION_REL} is required for public/current Examples docs sync. ` +
    `Set ${EXAMPLES_LEGACY_RAW_MANIFEST_ENV}=1 only for legacy/local raw-manifest sync.`,
  );
}

async function readExamplesPublicationSelectionMetadata(selectionPath) {
  const raw = await readFile(selectionPath, 'utf8');
  leakGate(raw, selectionPath);

  const selection = JSON.parse(raw);
  const publication = requireObject(selection.publication_selection, `${EXAMPLES_PUBLICATION_SELECTION_REL}.publication_selection`);

  requireString(publication.schema_version, `${EXAMPLES_PUBLICATION_SELECTION_REL}: publication_selection.schema_version`);
  requireString(publication.source_manifest, `${EXAMPLES_PUBLICATION_SELECTION_REL}: publication_selection.source_manifest`);
  requireString(publication.publication_ledger, `${EXAMPLES_PUBLICATION_SELECTION_REL}: publication_selection.publication_ledger`);
  requireString(publication.generated_by, `${EXAMPLES_PUBLICATION_SELECTION_REL}: publication_selection.generated_by`);

  if (publication.selection_type !== EXAMPLES_PUBLIC_SELECTION_TYPE) {
    throw new Error(`${EXAMPLES_PUBLICATION_SELECTION_REL}: publication_selection.selection_type must be ${EXAMPLES_PUBLIC_SELECTION_TYPE}`);
  }

  const publicChannels = requireArray(publication.public_channels, `${EXAMPLES_PUBLICATION_SELECTION_REL}: publication_selection.public_channels`);
  if (!publicChannels.includes(EXAMPLES_DOCS_PUBLIC_CHANNEL)) {
    throw new Error(`${EXAMPLES_PUBLICATION_SELECTION_REL}: publication_selection.public_channels must include "${EXAMPLES_DOCS_PUBLIC_CHANNEL}"`);
  }

  const downstreamConsumers = requireArray(
    publication.downstream_consumers,
    `${EXAMPLES_PUBLICATION_SELECTION_REL}: publication_selection.downstream_consumers`,
  );
  if (!downstreamConsumers.includes('docs_export')) {
    throw new Error(`${EXAMPLES_PUBLICATION_SELECTION_REL}: publication_selection.downstream_consumers must include "docs_export"`);
  }

  const approvedRecords = requireArray(publication.approved_examples, `${EXAMPLES_PUBLICATION_SELECTION_REL}: publication_selection.approved_examples`);
  const approvedDocsRecords = new Map();

  if (!Number.isInteger(publication.approved_examples_count) || publication.approved_examples_count !== approvedRecords.length) {
    throw new Error(
      `${EXAMPLES_PUBLICATION_SELECTION_REL}: publication_selection.approved_examples_count must match approved_examples length`,
    );
  }

  for (const [index, record] of approvedRecords.entries()) {
    const label = `${EXAMPLES_PUBLICATION_SELECTION_REL}: approved_examples[${index}]`;
    const exampleId = requireString(record.example_id, `${label}.example_id`);
    const recordChannels = requireArray(record.public_channels, `${label}.public_channels`);
    if (record.publication_status !== 'approved' || !recordChannels.includes(EXAMPLES_DOCS_PUBLIC_CHANNEL)) {
      continue;
    }

    requireString(record.approved_release, `${label}.approved_release`);
    const approvedHash = requireSha256(record.approved_content_hash, `${label}.approved_content_hash`);
    const selectedSource = requireObject(record.selected_source, `${label}.selected_source`);
    requireString(selectedSource.kind, `${label}.selected_source.kind`);
    const selectedHash = requireSha256(selectedSource.content_hash, `${label}.selected_source.content_hash`);

    if (selectedHash !== approvedHash) {
      throw new Error(`${label}: selected_source.content_hash must match approved_content_hash for docs publication`);
    }

    approvedDocsRecords.set(exampleId, record);
  }

  const selectedMetadata = new Map();
  const examples = requireArray(selection.examples, `${EXAMPLES_PUBLICATION_SELECTION_REL}.examples`);

  for (const [index, example] of examples.entries()) {
    const label = `${EXAMPLES_PUBLICATION_SELECTION_REL}: examples[${index}]`;
    if (!example?.name || !approvedDocsRecords.has(example.name)) continue;

    const record = approvedDocsRecords.get(example.name);
    const exampleHash = requireSha256(example.content_hash, `${label}.content_hash`);
    if (exampleHash !== record.approved_content_hash) {
      throw new Error(`${label}: content_hash must match approved_content_hash for ${example.name}`);
    }

    selectedMetadata.set(example.name, manifestExampleMetadata(example, label));
  }

  const missingExamples = [...approvedDocsRecords.keys()]
    .filter((name) => !selectedMetadata.has(name))
    .sort();
  if (missingExamples.length) {
    throw new Error(
      `${EXAMPLES_PUBLICATION_SELECTION_REL}: approved docs-channel examples missing from examples array: ${missingExamples.join(', ')}`,
    );
  }

  return selectedMetadata;
}

async function readExamplesRawManifestMetadata(examplesRepo) {
  const manifestPath = path.join(examplesRepo, 'conformance/examples_manifest.json');
  if (!existsSync(manifestPath)) return new Map();

  const raw = await readFile(manifestPath, 'utf8');
  leakGate(raw, manifestPath);

  const manifest = JSON.parse(raw);
  return new Map(
    (manifest.examples ?? [])
      .filter((example) => example?.name && example?.tier && example?.category)
      .map((example) => [example.name, manifestExampleMetadata(example, manifestPath)]),
  );
}

async function readExamplesDocsExportManifest(examplesRepo, examplesMetadata) {
  const manifestPath = path.join(examplesRepo, EXAMPLES_DOCS_MANIFEST_REL);
  if (!existsSync(manifestPath)) return { companionDocs: [] };

  const raw = await readFile(manifestPath, 'utf8');
  leakGate(raw, manifestPath);

  const manifest = JSON.parse(raw);
  if (manifest.schema_version !== 1) {
    throw new Error(`${EXAMPLES_DOCS_MANIFEST_REL}: schema_version must be 1`);
  }

  const routeKeys = new Set();
  const companionDocs = [];

  for (const [index, doc] of (manifest.companion_docs ?? []).entries()) {
    const sourceRel = normalizeRepoRelPath(doc.source);
    const parsed = parseExampleDocPath(sourceRel);
    const label = `${EXAMPLES_DOCS_MANIFEST_REL}: companion_docs[${index}]`;

    if (!parsed || parsed.isReadme || parsed.remainder.includes('/')) {
      throw new Error(`${label}: source must be an immediate non-README Markdown file under examples/{patterns,integrations,apps}/{example}/`);
    }
    const parentMetadata = examplesMetadata.get(parsed.name);
    if (!parentMetadata) {
      throw new Error(`${label}: parent example is not approved for docs export: ${parsed.name}`);
    }
    if (parentMetadata.category !== parsed.category) {
      throw new Error(`${label}: companion category does not match manifest category for ${parsed.name}`);
    }
    if (!doc.title || !doc.description) {
      throw new Error(`${label}: title and description are required`);
    }

    const sourcePath = path.join(examplesRepo, sourceRel);
    if (!existsSync(sourcePath)) {
      throw new Error(`${label}: source not found: ${sourceRel}`);
    }

    const slug = doc.slug ? slugify(doc.slug) : slugFromMarkdownSource(sourceRel);
    const routeKey = `${parsed.category}/${parsed.name}/${slug}`;
    if (routeKeys.has(routeKey)) {
      throw new Error(`${label}: duplicate docs route slug: ${routeKey}`);
    }
    routeKeys.add(routeKey);

    companionDocs.push({
      sourceRel,
      category: parsed.category,
      name: parsed.name,
      slug,
      title: doc.title,
      description: doc.description,
    });
  }

  return { companionDocs };
}

async function validateGeneratedExampleDocs(targetRoot, examplesMetadata, docsManifest) {
  const expectedPages = new Set();

  for (const metadata of examplesMetadata.values()) {
    if (EXAMPLE_DOC_CATEGORIES.has(metadata.category)) {
      expectedPages.add(`${metadata.category}/${metadata.name}`);
    }
  }

  const actualPages = new Set();
  for (const category of EXAMPLE_DOC_CATEGORIES) {
    const categoryRoot = path.join(targetRoot, category);
    if (!existsSync(categoryRoot)) continue;

    for (const entry of await readdir(categoryRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (existsSync(path.join(categoryRoot, entry.name, 'index.md'))) {
        actualPages.add(`${category}/${entry.name}`);
      }
    }
  }

  const unexpectedPages = [...actualPages].filter((route) => !expectedPages.has(route)).sort();
  if (unexpectedPages.length) {
    throw new Error(`Generated Examples docs include pages outside approved docs-channel selection: ${unexpectedPages.join(', ')}`);
  }

  const unexpectedMarkdown = [];
  for await (const filePath of walkMarkdown(targetRoot)) {
    const relative = path.relative(targetRoot, filePath).split(path.sep).join('/');
    if (relative === 'index.md') continue;

    const [category, name] = relative.split('/');
    if (!EXAMPLE_DOC_CATEGORIES.has(category) || !name || !expectedPages.has(`${category}/${name}`)) {
      unexpectedMarkdown.push(relative);
    }
  }
  if (unexpectedMarkdown.length) {
    throw new Error(`Generated Examples docs include Markdown outside approved docs-channel examples: ${unexpectedMarkdown.sort().join(', ')}`);
  }

  const missingPages = [...expectedPages].filter((route) => !actualPages.has(route)).sort();
  if (missingPages.length) {
    throw new Error(`Approved docs-channel Examples pages were not generated: ${missingPages.join(', ')}`);
  }

  for (const doc of docsManifest.companionDocs) {
    const parentRoute = `${doc.category}/${doc.name}`;
    if (!expectedPages.has(parentRoute)) {
      throw new Error(`${EXAMPLES_DOCS_MANIFEST_REL}: companion doc references unapproved docs-channel example: ${parentRoute}`);
    }
  }
}

function manifestExampleMetadata(example, label) {
  if (!example?.name || !example?.tier || !example?.category) {
    throw new Error(`${label}: name, tier, and category are required for docs publication`);
  }

  return {
    name: example.name,
    category: example.category,
    description: example.description ?? '',
    scenario: example.scenario ?? '',
    tier: example.tier,
    editionNote: example.edition_note ?? '',
    tierProfile: example.tier_profile ?? null,
    contentHash: example.content_hash ?? null,
  };
}

function requireObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value;
}

function requireArray(value, label) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array`);
  }
  return value;
}

function requireString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value;
}

function requireSha256(value, label) {
  const hash = requireString(value, label);
  if (!/^[a-f0-9]{64}$/.test(hash)) {
    throw new Error(`${label} must be a lowercase SHA-256 content hash`);
  }
  return hash;
}

function examplesDocsRoutes(examplesMetadata, docsManifest) {
  const routes = new Map();

  for (const metadata of examplesMetadata.values()) {
    if (!EXAMPLE_DOC_CATEGORIES.has(metadata.category)) continue;

    const sourceRel = `examples/${metadata.category}/${metadata.name}/README.md`;
    const directoryRel = `examples/${metadata.category}/${metadata.name}`;
    const route = `/nxuskit/examples/${metadata.category}/${metadata.name}/`;
    routes.set(sourceRel, route);
    routes.set(`${directoryRel}/`, route);
    routes.set(directoryRel, route);
  }

  for (const doc of docsManifest.companionDocs) {
    routes.set(doc.sourceRel, `/nxuskit/examples/${doc.category}/${doc.name}/${doc.slug}/`);
  }

  routes.set('examples/README.md', '/nxuskit/examples/');
  routes.set('examples', '/nxuskit/examples/');
  routes.set('examples/', '/nxuskit/examples/');

  return routes;
}

async function exportExampleReadmePages(examplesRepo, targetRoot, examplesMetadata, routeBySourceRel) {
  const examples = [...examplesMetadata.values()]
    .filter((metadata) => EXAMPLE_DOC_CATEGORIES.has(metadata.category))
    .sort((a, b) => `${a.category}/${a.name}`.localeCompare(`${b.category}/${b.name}`));

  for (const metadata of examples) {
    const sourceRel = `examples/${metadata.category}/${metadata.name}/README.md`;
    const sourcePath = path.join(examplesRepo, sourceRel);
    if (!existsSync(sourcePath)) {
      throw new Error(`Example README missing for ${metadata.name}: ${sourceRel}`);
    }

    const raw = await readFile(sourcePath, 'utf8');
    leakGate(raw, sourcePath);

    const targetPath = path.join(targetRoot, metadata.category, metadata.name, 'index.md');
    mkdirSync(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, toExampleDetailStarlightPage(raw, {
      sourceRel,
      routeBySourceRel,
      description: metadata.description || metadata.scenario,
    }), 'utf8');
  }
}

async function exportExampleCompanionDocs(examplesRepo, targetRoot, docsManifest, routeBySourceRel) {
  for (const doc of docsManifest.companionDocs) {
    const sourcePath = path.join(examplesRepo, doc.sourceRel);
    const raw = await readFile(sourcePath, 'utf8');
    leakGate(raw, sourcePath);

    const targetPath = path.join(targetRoot, doc.category, doc.name, `${doc.slug}.md`);
    mkdirSync(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, toExampleDetailStarlightPage(raw, {
      sourceRel: doc.sourceRel,
      routeBySourceRel,
      title: doc.title,
      description: doc.description,
    }), 'utf8');
  }
}

function toExamplesStarlightPage(markdown, examplesMetadata = new Map(), routeBySourceRel = new Map()) {
  let body = scrubExamplesTrustWording(markdown);
  body = preserveExamplesIndexBacklinks(body).replace(/^\uFEFF/, '').trimStart();
  const hasFrontmatter = body.startsWith('---\n');

  if (hasFrontmatter) {
    return transformExamplesDocsBody(body, examplesMetadata, routeBySourceRel);
  }

  body = body.replace(/^# nxusKit Examples\s*\n+/, '');

  return [
    '---',
    'title: nxusKit Examples',
    'description: Runnable nxusKit examples across Rust, Go, Python, and CLI/Bash.',
    '---',
    '',
    transformExamplesDocsBody(body, examplesMetadata, routeBySourceRel).trimEnd(),
    '',
  ].join('\n');
}

function toExampleDetailStarlightPage(markdown, options) {
  let body = scrubExamplesTrustWording(markdown).replace(/^\uFEFF/, '').trimStart();
  const existingFrontmatter = parseFrontmatter(body);

  if (existingFrontmatter) {
    body = existingFrontmatter.body;
  }

  const title = options.title ?? existingFrontmatter?.title ?? extractMarkdownTitle(body);
  const description = scrubExamplesTrustWording(options.description ?? existingFrontmatter?.description ?? '');

  body = scrubExamplesTrustWording(body.replace(/^#\s+.+\n+/, ''));
  body = preserveExampleDetailBacklinks(body, options.sourceRel);
  body = rewriteExampleDocLinks(body, options.sourceRel, options.routeBySourceRel).trimEnd();

  return [
    '---',
    `title: ${JSON.stringify(title)}`,
    ...(description ? [`description: ${JSON.stringify(description)}`] : []),
    'sidebar:',
    '  hidden: true',
    '---',
    '',
    body,
    '',
  ].join('\n');
}

// Temporary public-docs guard while upstream examples source wording catches up
// to the v1.0.2 production-claim policy.
function scrubExamplesTrustWording(markdown) {
  return markdown
    .replace(/Production-ready nxusKit examples across Rust, Go, Python, and CLI\/Bash\./g, 'Runnable nxusKit examples across Rust, Go, Python, and CLI/Bash.')
    .replace(/A curated collection of \*\*(\d+) production-ready examples\*\*/g, 'A curated collection of **$1 runnable examples**')
    .replace(/(\d+) production-quality examples for the nxusKit SDK/g, '$1 runnable examples for the nxusKit SDK')
    .replace(/get production-ready expert system code/g, 'get validated CLIPS rule code')
    .replace(/single production-ready pipeline/g, 'single repeatable pipeline')
    .replace(/production-grade expert system/g, 'structured expert system');
}

function preserveExamplesIndexBacklinks(markdown) {
  const examplesLinks = '**[Examples Portfolio](https://nxus.systems/examples)**';
  const fieldNotesLink = '**[Field Notes](https://nxus.systems/field-notes)**';

  if (markdown.includes(fieldNotesLink)) return markdown;

  return markdown.replace(
    `${examplesLinks} · **[Website](https://nxus.systems)**`,
    `${examplesLinks} · ${fieldNotesLink} · **[Website](https://nxus.systems)**`,
  );
}

function preserveExampleDetailBacklinks(markdown, sourceRel) {
  if (sourceRel !== 'examples/integrations/common-sense-guardrails/README.md') {
    return markdown;
  }

  const fieldNotesSentence = 'For related engineering notes and release-adjacent writeups, see [nxus.SYSTEMS Field Notes](https://nxus.systems/field-notes).';
  if (markdown.includes(fieldNotesSentence)) return markdown;

  return markdown.replace(
    '\n## Scope Exclusions',
    `\n${fieldNotesSentence}\n\n## Scope Exclusions`,
  );
}

function transformExamplesDocsBody(markdown, examplesMetadata, routeBySourceRel) {
  const withEditionColumn = addExamplesEditionColumn(markdown, examplesMetadata);
  return rewriteSourceLinks(
    examplesMetadata.size === 0 ? withEditionColumn : addExamplesEditionCopy(withEditionColumn),
    routeBySourceRel,
  );
}

function addExamplesEditionColumn(markdown, examplesMetadata) {
  if (examplesMetadata.size === 0) return markdown;

  const lines = markdown.split('\n');
  const updated = [];
  let inExamplesTable = false;
  let pendingExamplesTableSeparator = false;

  for (const line of lines) {
    if (line.trim() === '| Example | Description | Languages |') {
      updated.push('| Example | Edition | Description | Languages |');
      inExamplesTable = true;
      pendingExamplesTableSeparator = true;
      continue;
    }

    if (pendingExamplesTableSeparator && /^\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|$/.test(line.trim())) {
      updated.push('|---------|---------|-------------|-----------|');
      pendingExamplesTableSeparator = false;
      continue;
    }

    if (inExamplesTable && line.startsWith('|')) {
      updated.push(addEditionCellToExamplesRow(line, examplesMetadata));
      continue;
    }

    inExamplesTable = false;
    pendingExamplesTableSeparator = false;
    updated.push(line);
  }

  return updated.join('\n');
}

function addEditionCellToExamplesRow(line, examplesMetadata) {
  const cells = markdownTableCells(line);
  if (cells.length !== 3) return line;

  const exampleName = extractExampleName(cells[0]);
  const metadata = exampleName ? examplesMetadata.get(exampleName) : null;
  const edition = metadata ? formatExampleEdition(metadata) : '';

  return `| ${cells[0]} | ${edition} | ${cells[1]} | ${cells[2]} |`;
}

function markdownTableCells(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return [];
  return trimmed.slice(1, -1).split('|').map((cell) => cell.trim());
}

function extractExampleName(exampleCell) {
  const match = exampleCell.match(/\[([^\]]+)\]\(examples\/(?:patterns|integrations|apps)\/([^/)]+)\/\)/);
  return match ? match[2] : null;
}

function formatExampleEdition(metadata) {
  const tier = formatTierLabel(metadata.tier);
  const note = metadata.editionNote || summarizeTierProfile(metadata.tierProfile);
  if (!note) return tier;
  return `${tier}<br/>${escapeMarkdownTableCell(note)}`;
}

function formatTierLabel(tier) {
  if (tier === 'community') return 'Community';
  if (tier === 'pro') return 'Pro';
  return escapeMarkdownTableCell(String(tier));
}

function escapeMarkdownTableCell(value) {
  return String(value).replace(/\r?\n/g, ' ').replace(/\|/g, '\\|');
}

function summarizeTierProfile(tierProfile) {
  if (!tierProfile?.tiers?.includes('pro')) return '';

  const proCapabilities = [
    ...new Set((tierProfile.stages ?? [])
      .filter((stage) => stage.tier === 'pro' && stage.required === false)
      .flatMap((stage) => stage.capabilities ?? [])),
  ];

  if (proCapabilities.length === 0) return 'Pro enhancements available.';
  return `Pro enhancements available: ${proCapabilities.join(', ')}.`;
}

function addExamplesEditionCopy(markdown) {
  const editionCopy = [
    'Edition labels describe the minimum runnable edition for the default path. A Community example can still list optional Pro enhancements; those stages are disabled by default and require a Pro entitlement only when you run them.',
    '',
  ].join('\n');

  if (markdown.includes(editionCopy.trim())) return markdown;

  return markdown.replace(
    /(See `conformance\/example-tiers\.json` for the full tier map\.\n)/,
    `${editionCopy}$1`,
  );
}

function rewriteSourceLinks(markdown, routeBySourceRel = new Map()) {
  return rewriteExampleDocLinks(markdown, 'README.md', routeBySourceRel);
}

function rewriteExampleDocLinks(markdown, sourceRel, routeBySourceRel = new Map()) {
  return markdown
    .replace(/\[(!\[[^\]]*\]\([^)]+\))\]\(([^)\s]+)\)/g, (match, image, rawLink) => {
      const rewritten = rewriteExampleLinkTarget(rawLink, sourceRel, routeBySourceRel);
      return rewritten ? `[${image}](${rewritten})` : match;
    })
    .replace(/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g, (match, imagePrefix, text, rawLink) => {
      const rewritten = rewriteExampleLinkTarget(rawLink, sourceRel, routeBySourceRel);
      return rewritten ? `${imagePrefix}[${text}](${rewritten})` : match;
    });
}

function rewriteExampleLinkTarget(rawLink, sourceRel, routeBySourceRel = new Map()) {
  if (/^(?:https?:|mailto:)/.test(rawLink) || rawLink.startsWith('#') || rawLink.startsWith('/')) {
    return null;
  }

  const { target, hash } = splitMarkdownLink(rawLink);
  const normalized = normalizeRepoRelPath(path.posix.join(path.posix.dirname(sourceRel), target));
  const route = routeBySourceRel.get(normalized) ?? routeBySourceRel.get(`${normalized}/`);
  return route ? `${route}${hash}` : publicExamplesTarget(normalized, hash);
}

function publicExamplesTarget(normalized, hash = '') {
  if (normalized === 'README.md') return `${PUBLIC_EXAMPLES_URL}${hash}`;
  if (normalized === 'examples/README.md' || normalized === 'examples') return `/nxuskit/examples/${hash}`;

  if (isPublicExamplesBlobPath(normalized)) {
    return `${PUBLIC_EXAMPLES_URL}/blob/main/${normalized}${hash}`;
  }

  return `${PUBLIC_EXAMPLES_URL}/tree/main/${normalized}${hash}`;
}

function isPublicExamplesBlobPath(normalized) {
  const basename = path.posix.basename(normalized);
  if (/^(?:LICENSE(?:-[A-Z]+)?|NOTICE|SECURITY|CODE_OF_CONDUCT|CONTRIBUTING|ACKNOWLEDGEMENTS|THIRD-PARTY-NOTICES)$/.test(basename)) {
    return true;
  }
  return /\.(?:md|mdx|json|ya?ml|toml|txt|clp|sh|py|go|rs|c|h)$/i.test(normalized);
}

function splitMarkdownLink(rawLink) {
  const hashIndex = rawLink.indexOf('#');
  if (hashIndex === -1) return { target: rawLink, hash: '' };
  return {
    target: rawLink.slice(0, hashIndex),
    hash: rawLink.slice(hashIndex),
  };
}

function parseExampleDocPath(sourceRel) {
  const match = sourceRel.match(/^examples\/(patterns|integrations|apps)\/([^/]+)\/(.+\.md)$/);
  if (!match) return null;
  return {
    category: match[1],
    name: match[2],
    remainder: match[3],
    isReadme: match[3] === 'README.md',
  };
}

function normalizeRepoRelPath(value) {
  const normalized = path.posix.normalize(String(value ?? '').replace(/\\/g, '/'));
  if (!normalized || normalized === '.' || normalized.startsWith('../') || path.posix.isAbsolute(normalized)) {
    throw new Error(`Invalid repo-relative path: ${value}`);
  }
  if (normalized.includes('/.tmp/') || normalized.includes('/internal/') || normalized.includes('/.')) {
    throw new Error(`Path is not eligible for public docs export: ${value}`);
  }
  return normalized;
}

function slugFromMarkdownSource(sourceRel) {
  return slugify(path.posix.basename(sourceRel, '.md'));
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function replaceDirectoryContents(source, target, preserveNames = new Set()) {
  mkdirSync(target, { recursive: true });

  for (const entry of await readdir(target, { withFileTypes: true })) {
    if (preserveNames.has(entry.name)) continue;
    await rm(path.join(target, entry.name), { recursive: true, force: true });
  }

  await copyDir(source, target);
}

async function copyDir(source, target) {
  mkdirSync(target, { recursive: true });

  for (const entry of await readdir(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      await copyDir(sourcePath, targetPath);
    } else if (entry.isFile()) {
      mkdirSync(path.dirname(targetPath), { recursive: true });
      copyFileSync(sourcePath, targetPath);
    }
  }
}

async function leakGateFiles(root) {
  for await (const filePath of walkMarkdown(root)) {
    leakGate(await readFile(filePath, 'utf8'), filePath);
  }
}

async function* walkMarkdown(root) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      yield* walkMarkdown(fullPath);
    } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      yield fullPath;
    }
  }
}

function leakGate(content, filePath) {
  for (const term of FORBIDDEN_PUBLIC_DOCS_TERMS) {
    if (content.includes(term)) {
      throw new Error(`Forbidden term "${term}" found in ${filePath}`);
    }
  }
}

function run(command, commandArgs, cwd) {
  console.log(`Running: ${command} ${commandArgs.join(' ')} (${cwd})`);
  execFileSync(command, commandArgs, { cwd, stdio: 'inherit' });
}

function assertDirectory(directory, label) {
  if (!existsSync(directory)) {
    throw new Error(`${label} not found: ${directory}`);
  }
}

function assertEnv(name, value) {
  if (!value) {
    throw new Error(`${name} must point to the local source repo before syncing.`);
  }
}

function printHelp() {
  console.log(`Usage: node scripts/sync-local-docs.mjs [--examples|--sdk|--codex-plugins|--all] [--skip-generate]

Targets:
  --examples       Generate and sync nxusKit examples docs only
  --sdk            Sync nxusKit SDK docs only
  --codex-plugins  Sync nxus Codex Plugins docs only
  --all            Sync all sources

With no target flag, only the ready examples sync path runs.

Options:
  --skip-generate  Do not run the examples README generator before syncing

SDK release archives:
  When --sdk sees a newer SDK changelog than the current docs, it archives the
  previous current docs under src/content/docs/vX.Y.Z/ before replacing them.

Environment:
  NXUSKIT_EXAMPLES_REPO  Path to the local nxusKit examples source repo
  NXUSKIT_REPO           Path to the local nxusKit SDK source repo
  NXUS_CODEX_PLUGINS_REPO Path to the local nxus Codex Plugins source repo
  ${EXAMPLES_LEGACY_RAW_MANIFEST_ENV}=1
                         Legacy/local only: allow raw examples_manifest.json sync
                         when examples_publication_selection.json is absent
`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
