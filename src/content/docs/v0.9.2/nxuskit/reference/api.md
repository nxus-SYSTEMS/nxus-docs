---
title: API Reference
description: Complete nxusKit SDK API reference.
slug: v0.9.2/nxuskit/reference/api
---

## Overview

nxusKit APIs are organized around a small set of shared contracts:

- **Provider configuration** creates a backend connection.
- **Chat requests** carry model names, messages, and provider options.
- **Chat responses** return content, metadata, usage, and errors.
- **Streaming calls** emit incremental chunks for interactive workflows.
- **Specialized providers** such as CLIPS and Z3 use structured JSON payloads
  inside the same request/response pattern.

Use this page as the entry point for API-level reference material.

## Core References

| Reference | Use for |
|-----------|---------|
| [C ABI Reference](/v0.9.2/nxuskit/reference/api-reference/) | C functions, ownership rules, FFI handles, CLIPS session calls, and memory management. |
| [CLI Input Format Reference](/v0.9.2/nxuskit/reference/cli-reference/) | Structured JSON/YAML/JSONL input contracts for `nxuskit-cli`. |
| [Cloud LLM Providers](/v0.9.2/nxuskit/reference/providers/cloud-llms/) | Provider configuration for hosted LLM APIs. |
| [Local LLM Providers](/v0.9.2/nxuskit/reference/providers/local-llms/) | Ollama, LM Studio, and in-process local model configuration. |
| [Expert System & Utility Providers](/v0.9.2/nxuskit/reference/providers/expert-systems/) | CLIPS, MCP, Mock, and Loopback configuration. |
| [Z3 Constraint Satisfaction Provider](/v0.9.2/nxuskit/reference/providers/z3-solver/) | Z3 input, output, optimization, and streaming contracts. |

## Shared Chat Shape

The language wrappers expose native types, but the shared request shape is:

```json
{
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "You are concise."},
    {"role": "user", "content": "Summarize nxusKit."}
  ],
  "max_tokens": 512,
  "temperature": 0.2,
  "stream": false
}
```

Responses include provider content plus optional metadata:

```json
{
  "content": "nxusKit is a multi-language SDK...",
  "model": "gpt-4o",
  "finish_reason": "stop",
  "usage": {
    "input_tokens": 24,
    "output_tokens": 12
  }
}
```

Provider-specific options belong in the configuration object or provider options
map. See the provider reference pages before relying on a field across multiple
backends.

## Memory and Ownership

When calling through the C ABI, every returned provider handle, response handle,
stream handle, and allocated string has an explicit free function. Use the
[ownership summary](/v0.9.2/nxuskit/reference/api-reference/#ownership-summary)
before integrating from C, C++, Go FFI, Python FFI, or another native boundary.
