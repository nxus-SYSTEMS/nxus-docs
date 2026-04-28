---
title: Provider Model
description: How nxusKit abstracts over LLM providers.
slug: v0.9.2/nxuskit/concepts/provider-model
---

## Overview

nxusKit presents LLMs, local inference servers, rule engines, solvers, and test
adapters through one provider interface. Your application chooses a
`provider_type`, sends a `ChatRequest`, and receives a structured response. The
same request/response pattern works whether the backend is OpenAI, Anthropic,
Ollama, CLIPS, Z3, Mock, or Loopback.

The goal is portability: application code can switch providers without changing
its surrounding orchestration, logging, retry, or licensing logic.

## Provider Types

| Category | Provider types | Use when |
|----------|----------------|----------|
| Cloud LLMs | `openai`, `claude`, `groq`, `mistral`, `fireworks`, `together`, `openrouter`, `perplexity` | You need hosted models, managed scaling, or provider-specific model quality. |
| Local LLMs | `ollama`, `lmstudio`, `local` | You need local inference, data locality, lower latency, or offline development. |
| Reasoning engines | `clips`, `z3` | You need deterministic rule evaluation, constraint solving, or explainable decisions. |
| Utility providers | `mock`, `loopback`, `mcp` | You need tests, integration checks, or model-context tooling. |

## Configuration Shape

All providers use the same high-level configuration fields:

```json
{
  "provider_type": "openai",
  "model": "gpt-4o",
  "api_key": "sk-...",
  "base_url": "https://api.openai.com/v1",
  "timeout_ms": 30000,
  "options": {}
}
```

Only `provider_type` is always required. API keys can come from explicit
configuration, environment variables, or the credential store. See
[Authentication](/v0.9.2/nxuskit/getting-started/authentication/) for the
precedence rules.

## Request Flow

1. Create a provider from configuration.
2. Build a chat request with a model name and messages.
3. Call `chat()` for a complete response or `chat_stream()` for incremental chunks.
4. Read response content and provider metadata.

```rust
use nxuskit::{ChatRequest, Message, NxuskitProvider, ProviderConfig};

let provider = NxuskitProvider::new(ProviderConfig {
    provider_type: "openai".into(),
    ..Default::default()
})?;

let request = ChatRequest::new("gpt-4o")
    .with_message(Message::user("Summarize the provider model."));

let response = provider.chat(request)?;
println!("{}", response.content);
```

## Capabilities

Providers advertise capabilities such as streaming, vision, JSON mode, tool
calling, deterministic seeds, and local model discovery. Use the capability
metadata to choose a provider at runtime instead of hard-coding assumptions.

For provider-specific details, see:

- [Cloud LLM Providers](/v0.9.2/nxuskit/reference/providers/cloud-llms/)
- [Local LLM Providers](/v0.9.2/nxuskit/reference/providers/local-llms/)
- [Expert System & Utility Providers](/v0.9.2/nxuskit/reference/providers/expert-systems/)
- [Z3 Constraint Satisfaction Provider](/v0.9.2/nxuskit/reference/providers/z3-solver/)

## Choosing a Provider

| Need | Start with |
|------|------------|
| General hosted chat, tools, and JSON output | Cloud LLM provider |
| Local development without external API calls | Ollama or LM Studio |
| Embedded local inference with direct model lifecycle control | In-process local provider |
| Deterministic business rules | CLIPS |
| Constraint solving and optimization | Z3 |
| Unit tests with predictable responses | Mock or Loopback |
