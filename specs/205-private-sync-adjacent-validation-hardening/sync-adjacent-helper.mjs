#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateText } from '../204-private-claim-boundary-validation-helper/claim-boundary-helper.mjs';

const APPROVED_SELECTION_TYPE = 'nxuskit-examples-approved-public-selection';
const DOCS_CHANNEL = 'docs';
const DOCS_EXPORT_CONSUMER = 'docs_export';
const SHA256_RE = /^[a-f0-9]{64}$/;

const SELECTION_REQUIRED_FIXTURE_TYPES = new Set([
  'examples-selection',
  'docs-export-manifest',
]);

const EXAMPLE_DOC_PATH_RE = /^examples\/(patterns|integrations|apps)\/([^/]+)\/([^/]+\.md)$/;
const HOSTED_INDEX_PRIVATE_ARTIFACT_RE = /\b(?:specs\/2\d{2}[^/\s]*|private specs?|private dry[- ]run|dry[- ]run packet|private planning artifact)\b/i;
const HOSTED_INDEX_DENIAL_CONTEXT = /\b(?:denied|deny|denies|denial|do not|does not|exclude|excluded|forbidden|must not|reject|rejected|suppress|suppressed|without)\b/i;

export function validateSyncAdjacentModel(model, options = {}) {
  const source = options.source ?? '[inline sync-adjacent model]';
  const violations = [];

  if (!model || typeof model !== 'object' || Array.isArray(model)) {
    addViolation(violations, {
      rule: 'sync-adjacent-model-required',
      source,
      pointer: '$',
      message: 'Sync-adjacent fixtures must be JSON objects.',
    });
    return result(violations);
  }

  const approvedDocsExamples = validateSelection(model, source, violations);
  validateHelloProviderProfiles(model, source, violations);
  validateCompanionDocs(model, approvedDocsExamples, source, violations);
  validateTextSurfaces(model, source, violations);
  validateHostedAiIndexes(model, source, violations);

  return result(violations);
}

function validateSelection(model, source, violations) {
  const approvedDocsExamples = new Map();
  const selectionRequired = SELECTION_REQUIRED_FIXTURE_TYPES.has(model.fixture_type);
  const selection = model.selection;

  if (model.legacy_raw_manifest_default === true || model.source_manifest === 'conformance/examples_manifest.json') {
    addViolation(violations, {
      rule: 'approved-public-selection-required',
      source,
      pointer: '$.source_manifest',
      message: 'Raw examples manifest input cannot be the default current/public docs sync source.',
      text: model.source_manifest ?? 'legacy_raw_manifest_default=true',
    });
  }

  if (!selection) {
    if (selectionRequired) {
      addViolation(violations, {
        rule: 'approved-public-selection-required',
        source,
        pointer: '$.selection',
        message: 'Current/public Examples docs sync must use an approved-public selection artifact.',
      });
    }
    return approvedDocsExamples;
  }

  const publication = selection.publication_selection;
  if (!publication || typeof publication !== 'object' || Array.isArray(publication)) {
    addViolation(violations, {
      rule: 'approved-public-selection-required',
      source,
      pointer: '$.selection.publication_selection',
      message: 'Selection fixtures must include publication_selection metadata.',
    });
    return approvedDocsExamples;
  }

  if (publication.selection_type !== APPROVED_SELECTION_TYPE) {
    addViolation(violations, {
      rule: 'approved-public-selection-required',
      source,
      pointer: '$.selection.publication_selection.selection_type',
      message: `publication_selection.selection_type must be ${APPROVED_SELECTION_TYPE}.`,
      text: publication.selection_type,
    });
  }

  if (!includesString(publication.public_channels, DOCS_CHANNEL)) {
    addViolation(violations, {
      rule: 'approved-public-selection-required',
      source,
      pointer: '$.selection.publication_selection.public_channels',
      message: 'publication_selection.public_channels must include docs.',
      text: publication.public_channels,
    });
  }

  if (!includesString(publication.downstream_consumers, DOCS_EXPORT_CONSUMER)) {
    addViolation(violations, {
      rule: 'approved-public-selection-required',
      source,
      pointer: '$.selection.publication_selection.downstream_consumers',
      message: 'publication_selection.downstream_consumers must include docs_export.',
      text: publication.downstream_consumers,
    });
  }

  for (const field of ['schema_version', 'source_manifest', 'publication_ledger', 'generated_by']) {
    if (typeof publication[field] !== 'string' || publication[field].trim() === '') {
      addViolation(violations, {
        rule: 'selection-provenance-required',
        source,
        pointer: `$.selection.publication_selection.${field}`,
        message: `publication_selection.${field} is required for provenance.`,
      });
    }
  }

  const approvedRecords = Array.isArray(publication.approved_examples) ? publication.approved_examples : [];
  if (!Number.isInteger(publication.approved_examples_count) || publication.approved_examples_count !== approvedRecords.length) {
    addViolation(violations, {
      rule: 'selection-hash-provenance',
      source,
      pointer: '$.selection.publication_selection.approved_examples_count',
      message: 'approved_examples_count must match approved_examples length.',
      text: publication.approved_examples_count,
    });
  }

  for (const [index, record] of approvedRecords.entries()) {
    const pointer = `$.selection.publication_selection.approved_examples[${index}]`;
    const exampleId = typeof record?.example_id === 'string' ? record.example_id : '';
    if (!exampleId) {
      addViolation(violations, {
        rule: 'selection-hash-provenance',
        source,
        pointer: `${pointer}.example_id`,
        message: 'approved_examples entries require example_id.',
      });
      continue;
    }

    if (record.publication_status !== 'approved' || !includesString(record.public_channels, DOCS_CHANNEL)) {
      continue;
    }

    const approvedHash = record.approved_content_hash;
    const selectedHash = record.selected_source?.content_hash;
    if (typeof record.approved_release !== 'string' || record.approved_release.trim() === '') {
      addViolation(violations, {
        rule: 'selection-provenance-required',
        source,
        pointer: `${pointer}.approved_release`,
        message: 'approved docs-channel examples require approved_release provenance.',
      });
    }
    if (!isSha256(approvedHash)) {
      addViolation(violations, {
        rule: 'selection-hash-provenance',
        source,
        pointer: `${pointer}.approved_content_hash`,
        message: 'approved_content_hash must be a lowercase SHA-256 hash.',
        text: approvedHash,
      });
    }
    if (typeof record.selected_source?.kind !== 'string' || record.selected_source.kind.trim() === '') {
      addViolation(violations, {
        rule: 'selection-provenance-required',
        source,
        pointer: `${pointer}.selected_source.kind`,
        message: 'selected_source.kind is required.',
      });
    }
    if (!isSha256(selectedHash) || selectedHash !== approvedHash) {
      addViolation(violations, {
        rule: 'selection-hash-provenance',
        source,
        pointer: `${pointer}.selected_source.content_hash`,
        message: 'selected_source.content_hash must match approved_content_hash.',
        text: selectedHash,
      });
    }

    approvedDocsExamples.set(exampleId, record);
  }

  const selectedMetadata = new Map();
  const examples = Array.isArray(selection.examples) ? selection.examples : [];
  for (const [index, example] of examples.entries()) {
    if (!example?.name || !approvedDocsExamples.has(example.name)) continue;
    const pointer = `$.selection.examples[${index}]`;
    const approvedRecord = approvedDocsExamples.get(example.name);
    if (!isSha256(example.content_hash) || example.content_hash !== approvedRecord.approved_content_hash) {
      addViolation(violations, {
        rule: 'selection-hash-provenance',
        source,
        pointer: `${pointer}.content_hash`,
        message: `Selected example content_hash must match approved_content_hash for ${example.name}.`,
        text: example.content_hash,
      });
    }
    selectedMetadata.set(example.name, example);
  }

  for (const exampleId of approvedDocsExamples.keys()) {
    if (!selectedMetadata.has(exampleId)) {
      addViolation(violations, {
        rule: 'selection-hash-provenance',
        source,
        pointer: '$.selection.examples',
        message: `Approved docs-channel example is missing from examples array: ${exampleId}.`,
      });
    }
  }

  return selectedMetadata;
}

function validateHelloProviderProfiles(model, source, violations) {
  for (const { example, pointer } of examplesFromModel(model)) {
    if (example?.name !== 'hello-provider') continue;
    const profile = example.public_readiness_profile ?? example.readiness_profile ?? example.publicReadinessProfile;
    if (profile !== 'extension_authoring') {
      addViolation(violations, {
        rule: 'hello-provider-profile-required',
        source,
        pointer: `${pointer}.public_readiness_profile`,
        message: 'hello-provider must remain public_readiness_profile=extension_authoring for docs sync planning.',
        text: profile,
      });
    }
  }
}

function validateCompanionDocs(model, approvedDocsExamples, source, violations) {
  const companionDocs = Array.isArray(model.companion_docs) ? model.companion_docs : [];
  for (const [index, doc] of companionDocs.entries()) {
    const pointer = `$.companion_docs[${index}]`;
    const sourceRel = typeof doc?.source === 'string' ? doc.source : '';
    const parsed = sourceRel.match(EXAMPLE_DOC_PATH_RE);
    if (!parsed) {
      addViolation(violations, {
        rule: 'companion-docs-approved-parent',
        source,
        pointer: `${pointer}.source`,
        message: 'Companion docs must be immediate Markdown files below examples/{patterns,integrations,apps}/{example}/.',
        text: sourceRel,
      });
      continue;
    }

    const category = parsed[1];
    const exampleName = parsed[2];
    const parent = approvedDocsExamples.get(exampleName);
    if (!parent) {
      addViolation(violations, {
        rule: 'companion-docs-approved-parent',
        source,
        pointer: `${pointer}.source`,
        message: `Companion doc parent is not an approved docs-channel example: ${exampleName}.`,
        text: sourceRel,
      });
      continue;
    }

    const selectedCategory = parent.category ?? findExample(model, exampleName)?.category;
    if (selectedCategory && selectedCategory !== category) {
      addViolation(violations, {
        rule: 'companion-docs-approved-parent',
        source,
        pointer: `${pointer}.source`,
        message: `Companion doc category does not match selected example category for ${exampleName}.`,
        text: sourceRel,
      });
    }
  }
}

function validateTextSurfaces(model, source, violations) {
  for (const surface of collectTextSurfaces(model)) {
    const textResult = validateText(surface.text, { source: `${source}:${surface.pointer}` });
    for (const violation of textResult.violations) {
      violations.push({
        ...violation,
        pointer: surface.pointer,
      });
    }
  }
}

function validateHostedAiIndexes(model, source, violations) {
  const hostedIndexes = Array.isArray(model.hosted_ai_indexes) ? model.hosted_ai_indexes : [];
  for (const [index, entry] of hostedIndexes.entries()) {
    for (const field of ['label', 'text']) {
      const value = entry?.[field];
      if (typeof value !== 'string' || !HOSTED_INDEX_PRIVATE_ARTIFACT_RE.test(value) || HOSTED_INDEX_DENIAL_CONTEXT.test(value)) {
        continue;
      }

      addViolation(violations, {
        rule: 'hosted-ai-index-private-artifact',
        source,
        pointer: `$.hosted_ai_indexes[${index}].${field}`,
        message: 'Hosted AI index output must not expose private specs, dry-run packets, or internal planning artifacts.',
        text: value,
      });
    }
  }
}

function collectTextSurfaces(model) {
  const surfaces = [];

  if (Array.isArray(model.text_blocks)) {
    for (const [index, block] of model.text_blocks.entries()) {
      if (typeof block?.label === 'string') {
        surfaces.push({ pointer: `$.text_blocks[${index}].label`, text: block.label });
      }
      if (typeof block?.text === 'string') {
        surfaces.push({ pointer: `$.text_blocks[${index}].text`, text: block.text });
      }
    }
  }

  for (const field of ['source_refs', 'field_paths', 'warning_keys', 'generated_output_labels']) {
    if (!Array.isArray(model[field])) continue;
    for (const [index, value] of model[field].entries()) {
      if (typeof value === 'string') {
        surfaces.push({ pointer: `$.${field}[${index}]`, text: value });
      }
    }
  }

  if (Array.isArray(model.hosted_ai_indexes)) {
    for (const [index, entry] of model.hosted_ai_indexes.entries()) {
      if (typeof entry?.label === 'string') {
        surfaces.push({ pointer: `$.hosted_ai_indexes[${index}].label`, text: entry.label });
      }
      if (typeof entry?.text === 'string') {
        surfaces.push({ pointer: `$.hosted_ai_indexes[${index}].text`, text: entry.text });
      }
    }
  }

  return surfaces;
}

function examplesFromModel(model) {
  const examples = [];
  const selectionExamples = Array.isArray(model.selection?.examples) ? model.selection.examples : [];
  for (const [index, example] of selectionExamples.entries()) {
    examples.push({ example, pointer: `$.selection.examples[${index}]` });
  }

  const topLevelExamples = Array.isArray(model.examples) ? model.examples : [];
  for (const [index, example] of topLevelExamples.entries()) {
    examples.push({ example, pointer: `$.examples[${index}]` });
  }

  return examples;
}

function findExample(model, exampleName) {
  return examplesFromModel(model)
    .map((entry) => entry.example)
    .find((example) => example?.name === exampleName);
}

function includesString(values, expected) {
  return Array.isArray(values) && values.includes(expected);
}

function isSha256(value) {
  return typeof value === 'string' && SHA256_RE.test(value);
}

function addViolation(violations, violation) {
  violations.push({
    text: '',
    ...violation,
  });
}

function result(violations) {
  return {
    ok: violations.length === 0,
    violations,
  };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(args.length === 0 ? 1 : 0);
  }

  let totalViolations = 0;
  for (const filePath of args) {
    const model = JSON.parse(await readFile(filePath, 'utf8'));
    const resultForFile = validateSyncAdjacentModel(model, { source: filePath });
    if (resultForFile.ok) {
      console.log(`PASS ${filePath}`);
      continue;
    }

    totalViolations += resultForFile.violations.length;
    console.error(`FAIL ${filePath}`);
    for (const violation of resultForFile.violations) {
      const pointer = violation.pointer ? ` ${violation.pointer}` : '';
      const line = violation.line ? `:${violation.line}` : '';
      console.error(`${violation.source}${line}${pointer}: ${violation.rule}: ${violation.message}`);
      if (violation.text) console.error(`  ${stringifyText(violation.text)}`);
    }
  }

  if (totalViolations > 0) {
    console.error(`sync-adjacent helper found ${totalViolations} violation(s)`);
    process.exit(1);
  }
}

function stringifyText(value) {
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function printHelp() {
  const self = path.relative(process.cwd(), fileURLToPath(import.meta.url));
  console.log(`Usage: node ${self} FILE [FILE...]

Private W205 sync-adjacent helper for advisory checks over JSON dry-run
fixtures. It is intentionally not wired into package scripts, sync scripts,
routed docs generation, CI, release, deploy, or public docs publication.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
