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

const DOCS_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const EXAMPLES_REPO = process.env.NXUSKIT_EXAMPLES_REPO;
const SDK_REPO = process.env.NXUSKIT_REPO;
const PUBLIC_EXAMPLES_URL = 'https://github.com/nxus-SYSTEMS/nxusKit-examples';
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
const explicitTarget = args.has('--examples') || args.has('--sdk') || args.has('--all');
const shouldSyncExamples = args.has('--all') || args.has('--examples') || !explicitTarget;
const shouldSyncSdk = args.has('--all') || args.has('--sdk');
const skipGenerate = args.has('--skip-generate');

if (args.has('--help') || args.has('-h')) {
  printHelp();
  process.exit(0);
}

const unknownArgs = [...args].filter((arg) => ![
  '--all',
  '--examples',
  '--sdk',
  '--skip-generate',
  '--help',
  '-h',
].includes(arg));

if (unknownArgs.length > 0) {
  console.error(`Unexpected argument(s): ${unknownArgs.join(', ')}`);
  printHelp();
  process.exit(1);
}

const FORBIDDEN_TERMS = [
  ['INTERNAL', 'ONLY'].join('-'),
  ['nxusKit', 'internal'].join('-'),
  ['nxusKit', 'examples', 'internal'].join('-'),
  ['nxusKit', 'plugins', 'internal'].join('-'),
  '../DevOps/',
  'DevOps/sharedStatus/',
  'internal/todos/',
  'peeler/internal/',
];

async function main() {
  const synced = [];

  if (shouldSyncExamples) {
    await syncExamples();
    synced.push('nxusKit examples');
  }

  if (shouldSyncSdk) {
    await syncSdk();
    synced.push('nxusKit SDK');
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

  const exported = toExamplesStarlightPage(raw);
  const target = path.join(DOCS_ROOT, 'src/content/docs/nxuskit/examples/index.md');
  await writeFile(target, exported, 'utf8');
  console.log(`Synced examples README -> ${path.relative(DOCS_ROOT, target)}`);
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
  if (exportMode === 'authoritative') {
    await replaceDirectoryContents(exportRoot, targetRoot, new Set(['examples']));
  } else {
    await copyDir(exportRoot, targetRoot);
  }
  await rm(tmpRoot, { recursive: true, force: true });
  console.log(`Synced SDK docs -> ${path.relative(DOCS_ROOT, targetRoot)}`);
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
    .replace(
      /- \*\*Streaming logprobs\.\*\* `StreamChunk` deliberately has no logprobs\n  surface in v0\.9\.3\. See `specs\/097-sdk-093-release\/deferred-v0\.9\.4\.md`\n  and the regression guard\n  `packages\/nxuskit-engine\/crates\/nxuskit-engine\/tests\/streaming_logprobs_scope_test\.rs`\.\n  When streaming logprobs ship, the contract will be added additively\n  rather than retrofitted into the unary path\./,
      '- **Streaming logprobs.** `StreamChunk` deliberately has no logprobs\n  surface in v0.9.3. Streaming logprobs are deferred to a future additive\n  release rather than retrofitted into the unary path.',
    )
    .replace(
      /- \*\*Public `CapabilityManifest` v2\.\*\* Capability detection is internal in\n  v0\.9\.3; the manifest type and any associated client-side discovery API\n  are deferred to v0\.9\.4\./,
      '- **Public `CapabilityManifest` v2.** Capability detection remains an\n  implementation detail in v0.9.3; the manifest type and any associated\n  client-side discovery API are deferred to a future release.',
    )
    .replace(/\n## Peeler Adoption[\s\S]*$/m, '\n');
}

function scrubChangelog(markdown) {
  return scrubLicenseGuide(markdown)
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
    .replace(
      /### Deferred \(see `specs\/097-sdk-093-release\/deferred-v0\.9\.4\.md`\)/,
      '### Deferred',
    )
    .replace(
      /- `CapabilityManifest` v2 public\/preview surface — kept internal in\n  v0\.9\.3\./,
      '- `CapabilityManifest` v2 public/preview surface — deferred beyond v0.9.3.',
    )
    .replace(/- Peeler adoption PR — post-release; engine warn-and-drop covers the gap\.\n/g, '');
}

function toExamplesStarlightPage(markdown) {
  let body = markdown.replace(/^\uFEFF/, '').trimStart();
  const hasFrontmatter = body.startsWith('---\n');

  if (hasFrontmatter) {
    return rewriteSourceLinks(body);
  }

  body = body.replace(/^# nxusKit Examples\s*\n+/, '');

  return [
    '---',
    'title: Examples',
    'description: 32 production examples for nxusKit in Rust, Go, Python, and CLI/Bash.',
    '---',
    '',
    rewriteSourceLinks(body).trimEnd(),
    '',
  ].join('\n');
}

function rewriteSourceLinks(markdown) {
  return markdown
    .replace(/\]\((examples\/[^)\s]+)\)/g, (_, link) => `](${PUBLIC_EXAMPLES_URL}/tree/main/${link})`)
    .replace(/\]\((conformance\/[^)\s]+)\)/g, (_, link) => `](${PUBLIC_EXAMPLES_URL}/tree/main/${link})`)
    .replace(/\]\((scripts\/[^)\s]+)\)/g, (_, link) => `](${PUBLIC_EXAMPLES_URL}/tree/main/${link})`)
    .replace(/\]\((tools\/[^)\s]+)\)/g, (_, link) => `](${PUBLIC_EXAMPLES_URL}/tree/main/${link})`)
    .replace(/\]\(((?:ACKNOWLEDGEMENTS|NOTICE|THIRD-PARTY-NOTICES|SECURITY|CODE_OF_CONDUCT)\.md)\)/g, (_, link) => `](${PUBLIC_EXAMPLES_URL}/blob/main/${link})`)
    .replace(/\]\((LICENSE(?:-[A-Z]+)?)\)/g, (_, link) => `](${PUBLIC_EXAMPLES_URL}/blob/main/${link})`);
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
  for (const term of FORBIDDEN_TERMS) {
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
  console.log(`Usage: node scripts/sync-local-docs.mjs [--examples|--sdk|--all] [--skip-generate]

Targets:
  --examples       Generate and sync nxusKit examples docs only
  --sdk            Sync nxusKit SDK docs only
  --all            Sync both sources

With no target flag, only the ready examples sync path runs.

Options:
  --skip-generate  Do not run the examples README generator before syncing

Environment:
  NXUSKIT_EXAMPLES_REPO  Path to the local nxusKit examples source repo
  NXUSKIT_REPO           Path to the local nxusKit SDK source repo
`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
