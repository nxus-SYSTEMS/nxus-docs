---
title: "Hello Provider"
description: "Community extension manifest tutorial for a deterministic local provider"
sidebar:
  hidden: true
---

Validate a deterministic local provider contribution contract using the v2 community extension manifest shape.

> Review a no-credential community provider contribution with a deterministic local manifest fixture before any runtime integration exists.

## Edition

**Community** — this example uses local fixtures only and does not require Pro features or entitlement.

## Release status

This example is limited to a deterministic local manifest fixture. It does not assert public distribution, a release, or runtime availability.

## What this demonstrates

**Difficulty: Starter** 🟢 · LLM

- **Summary:** Community extension manifest tutorial for a deterministic local provider
- **Scenario:** Validate a no-credential deterministic local provider contribution contract
- **`tech_tags` in manifest:** `LLM` — example id **`hello-provider`** in `conformance/examples_manifest.json`.

## Prerequisites

- **SDK:** The tutorial follows the SDK v2 `CommunityExtensionManifest` contract shape. It does not call an SDK runtime provider loader.
- **Language:** Python 3.
- **Services:** None. The example makes no network calls and needs no credentials, tokens, provider accounts, or third-party provider SDKs.

## Real-World Application

Community provider contribution review.

## Technologies

LLM, community extension manifest fixture, deterministic local response fixture.

## Language Implementations

| Language | Path | Status |
|----------|------|--------|
| Python | `python/` | Available |

## Build

No package install is required for the focused tutorial path.

```bash
cd python
python3 main.py --help
```

## Run

```bash
cd python
python3 main.py --json --prompt "hello"
python3 main.py --check
python3 main.py --show-manifest
```

## Contribution Boundary

This is a tutorial fixture for reviewing the community extension manifest shape. It does not distribute packages, call live services, or create broad contribution intake.

The checked-in manifest declares:

- deterministic local behavior;
- no network access;
- no credentials;
- no third-party provider SDK;
- Community tier posture;
- local non-claim receipt posture.

## Validation

From the repository root:

```bash
python3 scripts/validate-hello-provider-example.py
python3 examples/patterns/hello-provider/python/main.py --check
python3 examples/patterns/hello-provider/python/main.py --json --prompt hello
```
