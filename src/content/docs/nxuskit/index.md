---
title: nxusKit SDK
description: Install nxusKit v2.0.0, run a local first call in Community Edition, and check Pro Solver with an eligible v2 entitlement.
---

Use nxusKit SDK v2.0.0 to call model providers, apply CLIPS rules and run
Bayesian inference from Rust, Go, Python, the C ABI or the CLI. Start with a
local Community Edition first call. Run Pro Solver from the same SDK bundle
with a valid v2 Pro entitlement. New Pro purchases remain paused.

The v1.1 workflow contract gives downstream tools typed definitions and
structured results. Try v1.1 LLM pipeline steps locally with the deterministic
loopback provider. For existing projects, review the
[v1.0.5 migration guide](/nxuskit/migration/upgrade-path/#migrate-from-v105-to-v200)
before upgrading.

## Start Here

Install the SDK and run your first request locally. Configure provider
credentials when you are ready to make real model requests.

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
- **Explore working code** — Browse [examples](/nxuskit/examples/) for reusable patterns, local model setup, Solver workflows, and complete applications. Check the SDK version and prerequisites for each example.
- **Author rules** — Use the [CLIPS rule authoring guide](/nxuskit/guides/clips-rule-authoring/) and the [CLIPS session API](/nxuskit/reference/api-reference/#clips-session-api).
- **Look up contracts** — Use the [API reference](/nxuskit/reference/api/), [C ABI reference](/nxuskit/reference/api-reference/), [CLI reference](/nxuskit/reference/cli-reference/), and [provider references](/nxuskit/reference/providers/cloud-llms/).
- **Manage editions** — Review [feature tiers](/nxuskit/concepts/tier-system/) and [license activation](/nxuskit/concepts/licensing/).
- **Use Codex workflows** — Install [nxusKit Celerat](/codex-plugins/nxuskit/) and browse [task recipes](/codex-plugins/nxuskit/task-recipes/) for Codex-ready implementation prompts.
