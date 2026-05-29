---
title: "Codex Plugins"
description: "Codex Plugin packages from nxus.SYSTEMS, including nxusKit Celerat."
---

**Codex-ready workflows for nxusKit SDK integrations and local intelligence.**


**[Install](/codex-plugins/install/)** · **[nxusKit SDK](https://github.com/nxus-SYSTEMS/nxusKit)** · **[Examples](https://github.com/nxus-SYSTEMS/nxusKit-examples)** · **[Docs](/nxuskit/)** · **[Website](https://nxus.systems)**

This repository publishes public Codex Plugin packages from [nxus.SYSTEMS](https://nxus.systems). The current plugin, **nxusKit Celerat**, helps Codex use the nxusKit SDK and nxusKit Examples to add provider-agnostic LLM integrations, symbolic reasoning, hybrid AI workflows, CLI/Bash prototypes, and public-safe local intelligence patterns to real applications.

**Current public release:** `v0.9.4-20260522`

**SDK compatibility note:** nxusKit SDK docs and packages are now `v1.0.0` GA/latest. The currently published nxusKit Celerat Codex Plugin remains `v0.9.4`-based until the next plugin refresh ships.

nxusKit is a multi-language SDK for LLM providers, CLIPS rule engines, Z3 constraint solvers, Bayesian networks, ZEN decision tables, and JSON-first CLI automation. Celerat packages the product knowledge Codex needs to pick the right nxusKit pattern, explain Community vs. Pro boundaries before implementation, discover canonical examples through a bundled local MCP server, and verify changes using the target project's own build or smoke commands.

## Available Plugins

| Plugin | Display name | Scope |
|---|---|---|
| [`nxuskit`](/codex-plugins/nxuskit/) | nxusKit Celerat | Helps Codex implement nxusKit SDK integrations for LLMs, reasoning engines, hybrid workflows, CLI/Bash prototypes, and local intelligence workflows. |

## Install

Add this repository as a Git-backed Codex Plugin marketplace pinned to the current public release:

```bash
codex plugin marketplace add nxus-SYSTEMS/nxus-codex-plugins --ref v0.9.4-20260522
```

Then open the Codex plugin directory and install **nxusKit Celerat** from the `nxus.SYSTEMS Codex Plugins` source.

See [INSTALL.md](/codex-plugins/install/) for verification and removal steps.

## What Celerat Helps With

- Add chat, streaming, structured output, tool calling, vision, retry/fallback, provider routing, and local-provider support with nxusKit.
- Migrate direct OpenAI, Anthropic, Ollama, or LiteLLM-style code toward a provider-agnostic nxusKit integration.
- Prototype workflows with `nxuskit-cli` and Bash/JSON before changing application code.
- Use bundled MCP discovery to pick canonical nxusKit examples and task recipes instead of relying on generic invention.
- Add Community Edition CLIPS guardrails around LLM recommendation workflows.
- Compare model/provider fitness with the model research harness pattern before live calls.
- Keep sensitive local files on the user's machine while returning only schema-level findings to Codex.
- Stay Community Edition-first when a request can be satisfied without Pro.
- Disclose Pro requirements before solver-backed what-if analysis, ZEN decision tables, runtime plugin loading, or other Pro-gated paths.
- Avoid in-chat secret handling by directing users to environment variables, credential stores, provider dashboards, and nxusKit auth helpers.

## Try It

After installing the plugin, start a Codex session inside a Rust, Go, Python, or CLI-oriented project and ask:

> Find the smallest nxusKit example or recipe for this repo with setup, smoke steps, and CE/Pro tier.

Other useful prompts:

> Use common-sense-guardrails to add Community CLIPS checks around an LLM recommendation workflow.

> Use model-research-harness to compare model/provider fitness with dry-run scoring before live calls.

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
