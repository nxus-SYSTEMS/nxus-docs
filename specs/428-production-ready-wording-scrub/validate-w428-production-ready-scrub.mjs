#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const publicRoots = [
  'src/content/docs',
  'dist',
  'llms.txt',
];

const deniedProductionReady = /\bprod(?:uction)?[- ]?ready\b|\bProduction-Ready\b/iu;
const allowedIntentionalPrivatePaths = ['specs/'];
const allowedIntentionalGuardFiles = new Set(['scripts/sync-local-docs.mjs']);

function fail(message) {
  console.error(`W428 production-ready wording validation failed: ${message}`);
  process.exitCode = 1;
}

function isTextFile(filePath) {
  return /\.(?:md|mdx|html|txt|json|mjs|js|ts|astro|yaml|yml)$/iu.test(filePath);
}

function collectFiles(entryPath) {
  const fullPath = path.join(repoRoot, entryPath);
  if (!fs.existsSync(fullPath)) return [];

  const stat = fs.statSync(fullPath);
  if (stat.isFile()) return isTextFile(fullPath) ? [fullPath] : [];

  const files = [];
  for (const name of fs.readdirSync(fullPath)) {
    const child = path.join(entryPath, name);
    const childFullPath = path.join(repoRoot, child);
    const childStat = fs.statSync(childFullPath);
    if (childStat.isDirectory()) files.push(...collectFiles(child));
    if (childStat.isFile() && isTextFile(childFullPath)) files.push(childFullPath);
  }
  return files;
}

function scanFile(filePath) {
  const relativePath = path.relative(repoRoot, filePath);
  if (allowedIntentionalPrivatePaths.some((prefix) => relativePath.startsWith(prefix))) {
    return [];
  }
  if (allowedIntentionalGuardFiles.has(relativePath)) {
    return [];
  }

  const text = fs.readFileSync(filePath, 'utf8');
  const findings = [];
  const lines = text.split(/\r?\n/u);
  lines.forEach((line, index) => {
    if (deniedProductionReady.test(line)) {
      findings.push(`${relativePath}:${index + 1}: ${line.trim()}`);
    }
  });
  return findings;
}

const findings = publicRoots.flatMap((root) => collectFiles(root).flatMap(scanFile));

if (findings.length) {
  fail(`public routed/generated surfaces contain overbroad production-ready wording:\n${findings.join('\n')}`);
} else {
  console.log('W428 production-ready wording validation passed');
}
