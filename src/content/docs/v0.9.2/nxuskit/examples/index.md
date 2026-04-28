---
title: Examples
description: 32 production examples for nxusKit in Rust, Go, and Python — LLM
  patterns, CLIPS, Z3, Bayesian networks, and ZEN decision tables.
slug: v0.9.2/nxuskit/examples
---

**[nxus.SYSTEMS](https://nxus.systems)** · **[Examples Portfolio](https://nxus.systems/examples)** · **[nxusKit SDK](https://github.com/nxus-SYSTEMS/nxusKit)**

32 production examples for the nxusKit SDK in Rust, Go, and Python — covering LLM patterns, CLIPS rule engines, Z3 constraint solvers, Bayesian networks, and ZEN decision tables.

## Quick Start

```bash
# 1. Install the SDK (see nxusKit Getting Started guide)
# 2. Set up this project
source ~/.nxuskit/sdk/current/scripts/setup-sdk.sh

# 3. Run an example
cargo run --manifest-path examples/patterns/basic-chat/rust/Cargo.toml    # Rust
go run -tags nxuskit ./examples/patterns/basic-chat/go                    # Go
python examples/patterns/basic-chat/python/main.py                        # Python
```

## Examples

### Patterns — Reusable SDK integration patterns

| Example | Description | Languages |
|---------|-------------|-----------|
| [basic-chat](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/patterns/basic-chat/) | Simple chat with any LLM provider | Rust, Go, Python |
| [streaming](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/patterns/streaming/) | Streaming responses | Rust, Go, Python |
| [multi-provider](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/patterns/multi-provider/) | Switch between providers | Rust, Go, Python |
| [auth-helper](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/patterns/auth-helper/) | OAuth and credential management | Rust (CLI + GUI), Go |
| [vision](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/patterns/vision/) | Image/vision capabilities | Rust, Go, Python |
| [solver](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/patterns/solver/) | Z3 constraint solving | Rust, Go, Python |
| [cost-routing](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/patterns/cost-routing/) | Route requests by cost/capability | Rust, Go |
| [retry-fallback](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/patterns/retry-fallback/) | Retry with provider fallback | Rust, Go |

### Integrations — Combining SDK features

| Example | Description | Languages |
|---------|-------------|-----------|
| [clips-basics](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/integrations/clips-basics/) | CLIPS expert system fundamentals | Rust, Go |
| [clips-llm-hybrid](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/integrations/clips-llm-hybrid/) | CLIPS rules + LLM reasoning | Rust, Go |
| [zen-decisions](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/integrations/zen-decisions/) | ZEN decision table evaluation | Rust, Go |
| [bn-solver-clips-pipeline](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/integrations/bn-solver-clips-pipeline/) | Bayesian → Solver → CLIPS pipeline | Rust, Go |
| [ollama](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/integrations/ollama/) | Local LLM via Ollama | Rust, Go |

### Apps — Complete applications

| Example | Description | Languages |
|---------|-------------|-----------|
| [racer](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/apps/racer/) | CLIPS vs LLM head-to-head race | Rust, Go |
| [arbiter](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/apps/arbiter/) | Auto-retry LLM with CLIPS validation | Rust, Go |
| [puzzler](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/apps/puzzler/) | Sudoku and Set Game solving via CLIPS | Rust, Go |
| [ruler](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/apps/ruler/) | LLM-generated CLIPS rules | Rust, Go |
| [riffer](https://github.com/nxus-SYSTEMS/nxusKit-examples/tree/main/examples/apps/riffer/) | Music analysis with CLIPS + LLM | Rust, Go |

## SDK Editions

| Badge | Meaning |
|-------|---------|
| **Community** | Runs with the free OSS SDK |
| **Pro** | Requires a Pro license ([activation guide](https://github.com/nxus-SYSTEMS/nxusKit)) |

See `conformance/example-tiers.json` for the full tier map.

## Project Structure

```
examples/
├── patterns/       Community-tier reusable patterns
├── integrations/   SDK feature combinations
├── apps/           Complete applications (mostly Pro tier)
└── shared/         Shared libraries (Rust, Go, interactive utilities)
conformance/        Example manifest and tier definitions
scripts/            Build and test helpers
```

## Building

All examples require the nxusKit SDK. Run `setup-sdk.sh` once after cloning:

```bash
source ~/.nxuskit/sdk/current/scripts/setup-sdk.sh
```

This creates the necessary symlinks and sets environment variables for Rust (`packages/nxuskit`), Go (`go.work`), and native library paths.

### Rust

```bash
export NXUSKIT_SDK_DIR=~/.nxuskit/sdk/current
cargo run --manifest-path examples/<category>/<name>/rust/Cargo.toml
```

### Go

```bash
go run -tags nxuskit ./examples/<category>/<name>/go/cmd
```

### Python

```bash
python examples/<category>/<name>/python/main.py
```

## License

Dual-licensed under [MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE).
