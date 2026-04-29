---
title: "Expert System & Utility Providers"
description: "Configuration reference for the CLIPS rule engine, MCP, Mock, and Loopback providers."
---

## CLIPS Rule Engine

The CLIPS provider runs rules against a CLIPS 6.4.1 expert system engine.
Unlike LLM providers, CLIPS uses deterministic rule-based reasoning.

```json
{
  "provider_type": "clips",
  "model": "/path/to/rules/directory"
}
```

**Configuration:**
- `model` field is used for the rules directory path (contains `.clp` rule files or `.bin` binary images)

**Capabilities:** System messages

**Note:** No API key required. The CLIPS engine runs in-process.

For writing custom rules, see the [Rule Authoring Guide](/nxuskit/guides/clips-rule-authoring/).

## MCP (Model Context Protocol)

Connects to an MCP server for tool-augmented model interactions.

```json
{
  "provider_type": "mcp",
  "base_url": "http://localhost:3000",
  "model": "model-name"
}
```

**Configuration:**
- `base_url` — MCP server URI (required)
- `model` — Model name to use on the server

**Capabilities:** System messages, streaming

## Mock (Testing)

Returns deterministic responses for unit testing.

```json
{
  "provider_type": "mock"
}
```

**Capabilities:** System messages, streaming

**Note:** No API key or configuration required. Returns fixed responses.

## Loopback (Testing)

Echoes back the user's input for integration testing.

```json
{
  "provider_type": "loopback"
}
```

**Capabilities:** System messages, streaming

**Note:** Use `"model": "echo"` in the chat request to echo back the user's
message content. Other model names return an empty response.
