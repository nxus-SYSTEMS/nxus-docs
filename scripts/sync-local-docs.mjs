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
    copyFileSync(changelog, target);
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
    copyFileSync(sourcePath, targetPath);
  }
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
