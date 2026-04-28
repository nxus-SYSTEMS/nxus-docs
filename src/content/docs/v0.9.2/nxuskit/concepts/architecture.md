---
title: Architecture
description: Technical architecture of nxusKit — component overview and cross-language design.
slug: v0.9.2/nxuskit/concepts/architecture
---

## Overview

nxusKit is organized around a shared provider model with language-specific
wrappers for Rust, Go, and Python, plus a stable C ABI. Each wrapper exposes
native types while keeping the same core concepts: provider configuration, chat
requests, chat responses, streaming chunks, and structured error handling.

The architecture has four practical layers:

1. **Language wrappers** — Idiomatic SDK surfaces for application code.
2. **Provider abstraction** — A common contract for chat, streaming, capability
   discovery, and provider metadata.
3. **Provider implementations** — Cloud LLMs, local LLMs, CLIPS, Z3, Mock,
   Loopback, and MCP adapters.
4. **Native boundary** — C ABI functions and ownership rules for embedding and
   cross-language integration.

## Component Map

| Component | Role |
|-----------|------|
| Rust SDK | Reference implementation, async provider interface, CLI, and native engine integrations. |
| Go SDK | Go-native provider interface with context cancellation and channel-based streaming. |
| Python SDK | Python-friendly provider creation, chat calls, and FFI access. |
| C ABI | Stable native boundary for providers, responses, streams, errors, and CLIPS sessions. |
| CLI | Shell interface for chat, provider checks, structured JSON workflows, and Pro features. |
| Examples | Runnable patterns and applications that demonstrate cross-language usage. |

## Provider Families

nxusKit providers fall into four broad groups:

| Family | Examples | Behavior |
|--------|----------|----------|
| Cloud LLMs | OpenAI, Anthropic, Groq, Mistral, Fireworks, Together, OpenRouter, Perplexity | Hosted model APIs with provider-specific capabilities. |
| Local LLMs | Ollama, LM Studio, in-process GGUF backends | Local inference for development, privacy, or low-latency use cases. |
| Deterministic engines | CLIPS, Z3 | Repeatable rule evaluation, inference, constraint solving, and optimization. |
| Utility providers | Mock, Loopback, MCP | Testing, integration checks, and tool-oriented workflows. |

See the [Provider Model](/v0.9.2/nxuskit/concepts/provider-model/) for the shared
configuration and request flow.

## Cross-Language Design

The SDK keeps concepts aligned across languages:

| Concept | Rust | Go | C ABI |
|---------|------|----|-------|
| Provider configuration | `ProviderConfig` | `ProviderConfig` | provider config JSON |
| Chat request | `ChatRequest` | `ChatRequest` | request JSON |
| Chat response | `ChatResponse` | `ChatResponse` | response handle + JSON |
| Streaming | async stream | channel stream | callback stream |
| Errors | typed errors | typed errors | `nxuskit_last_error()` |

This lets teams choose a language per service without redesigning provider
selection, request structure, credentials, or feature-gating behavior.

## Native Boundary

The C ABI is the stable integration point for native consumers and higher-level
FFI wrappers. It uses opaque handles for providers, responses, and streams. Any
memory returned across the boundary has a matching free function.

Read the [C ABI Reference](/v0.9.2/nxuskit/reference/api-reference/) before
embedding nxusKit in C, C++, Go FFI, Python FFI, or another native runtime.

## Operational Flow

```text
Application code
  -> language wrapper or C ABI
  -> provider configuration
  -> chat or streaming request
  -> provider implementation
  -> response, chunks, metadata, or typed error
```

For Pro features, the same call path also checks license state before executing
the feature. Community-tier features continue to run without a license token.

## What to Read Next

- [Installation](/v0.9.2/nxuskit/getting-started/installation/)
- [Provider Model](/v0.9.2/nxuskit/concepts/provider-model/)
- [Streaming](/v0.9.2/nxuskit/guides/streaming/)
- [C ABI Reference](/v0.9.2/nxuskit/reference/api-reference/)
- [CLI Input Format Reference](/v0.9.2/nxuskit/reference/cli-reference/)
- [Examples](/v0.9.2/nxuskit/examples/)
