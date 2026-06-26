---
title: "Hello Provider"
description: "Extension-authoring example for SDK extension authorship with deterministic local fixtures"
sidebar:
  hidden: true
---

`hello-provider` is an extension-authoring example for SDK extension
authorship. It is approved as public `extension_authoring` content for
developers who are shaping an nxusKit provider extension and need a small,
deterministic reference for metadata, fixture wiring, and response shape.

The example uses a deterministic local manifest fixture and a fixture-backed provider response.
It requires no network calls, no credentials, no provider account, and no third-party SDKs.

## Edition

**Community** — approved public example with the `extension_authoring`
readiness profile.

## What this demonstrates

- Keeping provider extension metadata explicit and reviewable.
- Describing SDK extension authorship separately from ordinary runnable
  implementation examples.
- Using a local fixture to document expected request and response shape without
  external services.
- Preserving the `extension_authoring` profile in docs copy so the example is
  not collapsed into another readiness class.

## Readiness Profile

| Field | Value |
|-------|-------|
| Example id | `hello-provider` |
| Category | Patterns |
| Edition | Community |
| Profile | `extension_authoring` |
| Primary purpose | SDK extension authorship |
| External services | None |
| Credential requirements | None |

## Use This When

Use this page when you are reviewing how an extension-authoring example should
describe its metadata, fixture boundary, and response contract in public docs.
For runnable provider calls, use the existing LLM and local provider examples
that already document supported SDK execution paths.

## Boundaries

This routed copy is intentionally narrow. It documents approved
extension-authoring content for `hello-provider`; it does not expand nxusKit
support posture, source availability, release status, package contents, or
provider execution behavior.
