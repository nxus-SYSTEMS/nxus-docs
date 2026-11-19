---
title: nxusKit SDK
description: Install nxusKit v2.0.0, run a Community Edition first call, and activate Pro Solver across the supported developer surfaces.
---

nxusKit is a unified, type-safe SDK for calling LLM providers (Claude, OpenAI, Ollama, and more),
CLIPS rule engines, Z3 constraint solvers, and Bayesian networks — from Rust, Go, Python, and the C ABI.

This is the v2.0.0 documentation. The initial Pro launch capability is Solver;
new Pro purchases remain paused.

## Start Here

Install the SDK, configure credentials, and run your first request:

- [Installation](/nxuskit/getting-started/installation/)
- [First Call](/nxuskit/getting-started/first-call/)
- [Authentication](/nxuskit/getting-started/authentication/)
- [Pro activation and recovery](/sdk/v2-0-0/#activate-a-purchased-pro-license)

## High-Value References

- [CLI input format reference](/nxuskit/reference/cli-reference/) - JSON schemas and local loopback examples for `nxuskit-cli`.
- [Local LLM providers](/nxuskit/reference/providers/local-llms/) - Ollama, LM Studio, llama.cpp, and mistral.rs setup.
- [Licensing](/nxuskit/concepts/licensing/) - Pro activation, entitlement checks, and offline-first license validation.
- [Changelog](/nxuskit/reference/changelog/) - v2.0.0 and retained historical release notes.
- [Examples catalog](/nxuskit/examples/) - runnable patterns and integrations across supported languages and CLI/Bash.

## Browse by Task

- **Build an integration** — Start with [installation](/nxuskit/getting-started/installation/), then use the [provider model](/nxuskit/concepts/provider-model/) to choose the right backend.
- **Explore working code** — Browse [examples](/nxuskit/examples/) for reusable patterns, local model setup, solver workflows, and complete applications.
- **Author rules** — Use the [CLIPS rule authoring guide](/nxuskit/guides/clips-rule-authoring/) and the [CLIPS session API](/nxuskit/reference/api-reference/#clips-session-api).
- **Look up contracts** — Use the [API reference](/nxuskit/reference/api/), [C ABI reference](/nxuskit/reference/api-reference/), [CLI reference](/nxuskit/reference/cli-reference/), and [provider references](/nxuskit/reference/providers/cloud-llms/).
- **Manage editions** — Review [feature tiers](/nxuskit/concepts/tier-system/) and [license activation](/nxuskit/concepts/licensing/).
- **Use Codex workflows** — Install [nxusKit Celerat](/codex-plugins/nxuskit/) and browse [task recipes](/codex-plugins/nxuskit/task-recipes/) for Codex-ready implementation prompts.
