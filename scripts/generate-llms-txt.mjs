#!/usr/bin/env node
/**
 * generate-llms-txt.mjs
 *
 * Generates /llms.txt and /llms-full.txt in the Astro build output (dist/).
 * Run after `astro build` as a post-build step.
 *
 * llms.txt   — one-line summary + URL per page (lightweight index for AI tools)
 * llms-full.txt — full Markdown content of all pages (for deep LLM indexing)
 *
 * Standard: https://llmstxt.org/
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, relative } from 'path';

const CONTENT_DIR = new URL('../src/content/docs', import.meta.url).pathname;
const DIST_DIR = new URL('../dist', import.meta.url).pathname;
const SITE_URL = 'https://docs.nxus.systems';
const PRODUCT_SUMMARY = [
  'nxus.SYSTEMS documentation covers products and services from nxus.SYSTEMS.',
  'nxusKit is a multi-engine intelligence SDK for hosted and local LLMs, CLIPS rule engines, Z3 constraint solving, Bayesian network inference, ZEN decision tables, and utility/test providers.',
  'Current developer surfaces are Rust, Go, Python, the C ABI, and CLI/Bash workflows.',
];

async function* walkMarkdown(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkMarkdown(full);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      yield full;
    }
  }
}

function fileToUrl(filePath) {
  let rel = relative(CONTENT_DIR, filePath)
    .replace(/\\/g, '/')
    .replace(/\.mdx?$/, '');
  if (rel === 'index') rel = '';
  if (rel.endsWith('/index')) rel = rel.slice(0, -6);
  return `${SITE_URL}/${rel}`.replace(/\/$/, '') || SITE_URL;
}

function extractTitle(content) {
  const fm = content.match(/^---[\s\S]*?^title:\s*(.+)$/m);
  if (fm) return fm[1].trim().replace(/^['"]|['"]$/g, '');
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  return 'Untitled';
}

function extractDescription(content) {
  const fm = content.match(/^---[\s\S]*?^description:\s*(.+)$/m);
  if (fm) return fm[1].trim().replace(/^['"]|['"]$/g, '');
  return '';
}

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?^---\s*/m, '').trim();
}

function isArchivedPage(page) {
  const pathname = page.url.slice(SITE_URL.length);
  return /^\/v\d+\.\d+\.\d+(?:\/|$)/.test(pathname);
}

async function main() {
  const pages = [];

  for await (const filePath of walkMarkdown(CONTENT_DIR)) {
    // Skip .keep placeholder files
    if (filePath.endsWith('.keep')) continue;

    const raw = await readFile(filePath, 'utf-8');
    const url = fileToUrl(filePath);
    const title = extractTitle(raw);
    const description = extractDescription(raw);
    const body = stripFrontmatter(raw);

    pages.push({ url, title, description, body });
  }

  // Sort: index first, then alphabetical by URL
  pages.sort((a, b) => {
    if (a.url === SITE_URL) return -1;
    if (b.url === SITE_URL) return 1;
    return a.url.localeCompare(b.url);
  });

  const currentPages = pages.filter(p => !isArchivedPage(p));
  const archivedPages = pages.filter(isArchivedPage);

  // llms.txt — lightweight index
  const llmsTxt = [
    `# nxus.SYSTEMS Documentation`,
    `> Documentation for nxus.SYSTEMS products and services.`,
    ``,
    `## Product Summary`,
    ``,
    ...PRODUCT_SUMMARY.map(line => `- ${line}`),
    ``,
    `## Current Pages`,
    ``,
    ...currentPages.map(p => {
      const desc = p.description ? `: ${p.description}` : '';
      return `- [${p.title}](${p.url})${desc}`;
    }),
    ...(archivedPages.length > 0 ? [
      ``,
      `## Archived Pages`,
      ``,
      ...archivedPages.map(p => {
        const desc = p.description ? `: ${p.description}` : '';
        return `- [${p.title}](${p.url})${desc}`;
      }),
    ] : []),
  ].join('\n');

  // llms-full.txt — full content
  const llmsFullTxt = [
    `# nxus.SYSTEMS Documentation — Full Content`,
    ``,
    `## Product Summary`,
    ``,
    ...PRODUCT_SUMMARY.map(line => `- ${line}`),
    ``,
    ...pages.map(p => [
      `---`,
      ``,
      `# ${p.title}`,
      `URL: ${p.url}`,
      ``,
      p.body,
    ].join('\n')),
  ].join('\n\n');

  await writeFile(join(DIST_DIR, 'llms.txt'), llmsTxt, 'utf-8');
  await writeFile(join(DIST_DIR, 'llms-full.txt'), llmsFullTxt, 'utf-8');

  console.log(`Generated llms.txt (${pages.length} pages)`);
  console.log(`Generated llms-full.txt (${pages.length} pages)`);
}

main().catch(err => { console.error(err); process.exit(1); });
