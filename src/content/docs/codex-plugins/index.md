---
title: "Codex Plugins"
description: "Codex Plugin packages from nxus.SYSTEMS, including nxusKit Celerat."
---

**Codex-ready workflows for nxusKit SDK integrations.**


**[Install](/codex-plugins/install/)** · **[nxusKit SDK](https://github.com/nxus-SYSTEMS/nxusKit)** · **[Examples](https://github.com/nxus-SYSTEMS/nxusKit-examples)** · **[Docs](/nxuskit/)** · **[Website](https://nxus.systems)**

This repository publishes Codex Plugin packages from [nxus.SYSTEMS](https://nxus.systems). The first plugin, **nxusKit Celerat**, helps Codex use the nxusKit SDK and nxusKit Examples to add provider-agnostic LLM integrations, symbolic reasoning, hybrid AI workflows, and `nxuskit-cli` CLI/Bash prototypes to real applications.

nxusKit is a multi-language SDK for LLM providers, CLIPS rule engines, Z3 constraint solvers, Bayesian networks, ZEN decision tables, and JSON-first CLI automation. Celerat packages the product knowledge Codex needs to pick the right nxusKit pattern, explain Community vs. Pro boundaries before implementation, and verify changes using the target project's own build or smoke commands.

> **v0.1 status**: nxusKit Celerat is a skills-only Codex Plugin. It does not ship an MCP server, app connector, lifecycle hook, telemetry, or automatic SDK installer.

## Available Plugins

| Plugin | Display name | Scope |
|--------|--------------|-------|
| [`nxuskit`](/codex-plugins/nxuskit/) | nxusKit Celerat | Helps Codex implement nxusKit SDK integrations for LLMs, reasoning engines, hybrid workflows, and CLI/Bash prototypes. |

## Install

Add this repository as a Git-backed Codex Plugin marketplace:

```bash
codex plugin marketplace add nxus-SYSTEMS/nxus-codex-plugins --ref v0.1.0
```

Then open the Codex plugin directory and install **nxusKit Celerat** from the `nxus.SYSTEMS Codex Plugins` source.

See [INSTALL.md](/codex-plugins/install/) for verification and removal steps.

## What Celerat Helps With

- Add basic chat, streaming, structured output, tool calling, vision, retry/fallback, provider routing, and local-provider support with nxusKit.
- Migrate direct OpenAI, Anthropic, Ollama, or LiteLLM-style code toward a provider-agnostic nxusKit integration.
- Prototype workflows with `nxuskit-cli` and Bash/JSON before changing application code.
- Use nxusKit Examples as canonical implementation references instead of relying on generic invention.
- Stay Community Edition-first when a request can be satisfied without Pro.
- Disclose Pro requirements before solver-backed what-if analysis, ZEN decision tables, runtime plugin loading, or other Pro-gated paths.
- Avoid in-chat secret handling by directing users to environment variables, credential stores, provider dashboards, and nxusKit auth helpers.

## Try It

After installing the plugin, start a Codex session inside a Rust, Go, Python, or CLI-oriented project and ask:

> Use nxusKit to add basic chat to this app.

The skill should inspect the project before editing, choose a Community Edition pattern when it fits, avoid asking for secrets in chat, and recommend an appropriate verification step such as `cargo check`, `go test ./...`, a Python import smoke, or an `nxuskit-cli` setup check.

For more task prompts, see [examples/](/codex-plugins/nxuskit/task-recipes/).

## nxusKit SDK

The plugin is a companion to the [nxusKit SDK](https://github.com/nxus-SYSTEMS/nxusKit), not a replacement for it. Install nxusKit when you are ready to build and run application code:

- [nxusKit documentation](/nxuskit/)
- [Getting started](/nxuskit/getting-started/installation/)
- [nxusKit Examples](https://github.com/nxus-SYSTEMS/nxusKit-examples)
- [CLI reference](/nxuskit/reference/cli-reference/)

Community Edition workflows are available for many LLM, local-provider, CLIPS, Bayesian, and CLI/Bash use cases. Some solver, ZEN, runtime plugin, and advanced workflow capabilities require nxusKit Pro; Celerat is designed to call that out before Codex generates Pro-dependent code.

## Contributing

Public contributions should focus on shipped plugin behavior, installation clarity, prompt examples, documentation, and reproducible validation. See [CONTRIBUTING.md](https://github.com/nxus-SYSTEMS/nxus-codex-plugins/blob/main/CONTRIBUTING.md).

## License

This repository is dual-licensed under MIT or Apache 2.0, at your option. See [LICENSE](https://github.com/nxus-SYSTEMS/nxus-codex-plugins/blob/main/LICENSE), [LICENSE-MIT](https://github.com/nxus-SYSTEMS/nxus-codex-plugins/blob/main/LICENSE-MIT), and [LICENSE-APACHE](https://github.com/nxus-SYSTEMS/nxus-codex-plugins/blob/main/LICENSE-APACHE).

Copyright 2025-2026 nxus.SYSTEMS LLC.
