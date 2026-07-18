import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function sanitizePublicDocsTree(root) {
  let changed = 0;

  for await (const filePath of walkMarkdown(root)) {
    const source = await readFile(filePath, 'utf8');
    const sanitized = sanitizePublicDocsMarkdown(source);
    if (sanitized === source) continue;

    await writeFile(filePath, sanitized, 'utf8');
    changed += 1;
  }

  return changed;
}

export function sanitizePublicDocsMarkdown(markdown) {
  return markdown
    .replaceAll('`internal/tests/parity/stream_logprobs/run_parity.sh`', 'the cross-language parity harness')
    .replace(/\b(?:the )?full internal manifest(?: is)? unchanged/g, 'the complete manifest remains outside this public documentation')
    .replace(/\binternal\/pro-authenticated\b/g, 'authorized')
    .replaceAll('Historical 2.x changelog preserved in the internal archive', 'Historical 2.x changelog preserved in a separate historical archive')
    .replaceAll('DevOps Ollama model-testing notes', 'dated local model-testing notes')
    .replaceAll('same DevOps notes', 'same local test notes')
    .replaceAll('DevOps-style report shapes', 'public-safe report shapes')
    .replaceAll('| Rust | `nxuskit` | `cargo add nxuskit` |', '| Rust | bundled `nxuskit` source | Use a Cargo path dependency from an authorized SDK bundle |')
    .replaceAll('| Go | `nxuskit` | `go get github.com/nxus-SYSTEMS/nxusKit/packages/nxuskit-go` |', '| Go | bundled `nxuskit-go` source | Configure the bundled module source after an authorized release |')
    .replaceAll('| Python | `nxuskit-py` | `pip install nxuskit-py` |', '| Python | bundled `nxuskit` source | Configure `PYTHONPATH` from an authorized SDK bundle |')
    .replaceAll('pip install -e ../../../../packages/nxuskit-py   # if not already installed', 'export PYTHONPATH="$NXUSKIT_SDK_DIR/python/src:${PYTHONPATH:-}"')
    .replace(/\bbranch \d{3}\b/g, 'prior checkpoint')
    .replace(/\s*\(branch \d{3}\)/g, '')
    .replace(/\s*\/ branch \d{3}/g, '')
    .replace(/in the \d{3} artifacts/g, 'in the associated public documentation')
    .replace(
      /\n\| `nxuskit-harness-devops-ollama-parity\.yaml` \|[^\n]*\|\n/g,
      '\n',
    )
    .replace(
      /\nThe fixture config runs only checked-in deterministic fixture commands\. The DevOps parity config[\s\S]*?may be repeated\.\n/g,
      '\nExternal command fixtures run only checked-in deterministic commands. Use `--only-test` or `--exclude-test` to select public-safe fixture coverage.\n',
    )
    .replace(
      /The public adapter normalizes public-safe report shapes for common-sense curation, prompted\/native tool intent, direct structured extraction, two-stage OCR or VLM pipelines, safe-labs row-level scoring, and CSV\/TSV comparison helpers\. The DevOps parity template also includes non-mutating `ollama-cache status`, `list`, and `plan-evict` checks\./g,
      'The public adapter normalizes report shapes for common-sense curation, prompted/native tool intent, direct structured extraction, two-stage OCR or VLM pipelines, safe-labs row-level scoring, and CSV/TSV comparison helpers.',
    )
    .replace(
      /Approved for generated approved-public selection metadata and local public-selection\/export validation in W221\. External public mirror push, release\/tag, Docs\/Celerat\/Website handoff, and broad community provider intake remain gated\./g,
      'This example is limited to a deterministic local manifest fixture. It does not assert public distribution, a release, or runtime availability.',
    )
    .replace(
      /The tutorial follows the SDK v2 `CommunityExtensionManifest` contract shape from the W97 checkpoint\./g,
      'The tutorial follows the SDK v2 `CommunityExtensionManifest` contract shape.',
    );
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
