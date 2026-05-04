---
title: "nxusKit Celerat"
description: "Use nxusKit Celerat to accelerate nxusKit SDK integrations in Codex."
---

nxusKit Celerat is a skills-only Codex Plugin for accelerating nxusKit SDK integrations across LLMs, symbolic reasoning, and hybrid AI workflows in Rust, Go, Python, and CLI/Bash.

## Scope

This plugin ships:

- one Codex Plugin manifest at `.codex-plugin/plugin.json`
- one primary skill at `skills/nxuskit/SKILL.md`
- curated reference docs under `skills/nxuskit/references/`
- plugin assets under `assets/`

It provides Codex-facing guidance and references. It does not install nxusKit runtime extensions, app connectors, lifecycle hooks, or MCP tools.

## Codex Plugins vs. nxusKit Runtime Plugins

These are distinct product surfaces:

- Codex Plugins package skills, references, and install metadata for OpenAI Codex.
- nxusKit runtime plugins are signed shared-library SDK extensions loaded by nxusKit itself.

This plugin helps developers use nxusKit. It is not a nxusKit runtime plugin.

## Install

After the `v0.1.0` release tag is available:

```bash
codex plugin marketplace add nxus-SYSTEMS/nxus-codex-plugins --ref v0.1.0
```

Then install `nxusKit Celerat` from the Codex plugin directory.

## Verify

Ask Codex:

> Use nxusKit to add basic chat to this app.

The skill should:

- inspect your project before editing
- choose a Community Edition example when it satisfies the request
- read credentials from environment variables or credential stores, never from chat
- recommend a verification step that fits your project
- disclose nxusKit Pro requirements before generating Pro-dependent code

## Remove

```bash
codex plugin marketplace remove nxus-codex-plugins
```

Plugin install and uninstall are handled from the Codex plugin directory in current Codex builds. The CLI command above removes the marketplace source if you added it directly.

## License

`MIT OR Apache-2.0`.
