---
title: "Install nxusKit Celerat"
description: "Install the nxusKit Celerat Codex Plugin from the public nxus.SYSTEMS marketplace."
---

This repository publishes Codex Plugin packages from nxus.SYSTEMS. The current public plugin is **nxusKit Celerat**.

## Requirements

- Codex app or Codex CLI with plugin support.
- Network access to GitHub for Git-backed marketplace installation.
- nxusKit SDK only when you are ready to build or run nxusKit application code. The Codex Plugin itself does not install the SDK.

## Add the Marketplace

Add the public marketplace at the v0.1.0 release tag:

```bash
codex plugin marketplace add nxus-SYSTEMS/nxus-codex-plugins --ref v0.1.0
```

Then open the Codex plugin directory and install **nxusKit Celerat** from the `nxus.SYSTEMS Codex Plugins` source.

## Verify the Skill

Start a new Codex session in a project that can use nxusKit, then ask:

> Use nxusKit to add basic chat to this app.

Codex should inspect the project before editing, choose a Community Edition path when it fits, avoid asking for secrets in chat, and recommend a project-local verification command.

For a CLI/Bash-first check, ask:

> Use nxuskit-cli to verify my setup before we implement SDK code.

The plugin should guide Codex to probe `nxuskit-cli` availability and use JSON-first setup or smoke commands when supported.

## Remove the Marketplace

```bash
codex plugin marketplace remove nxus-codex-plugins
```

Plugin install and uninstall are handled from the Codex plugin directory UI in current Codex builds. The command above removes the marketplace source from your Codex configuration.
