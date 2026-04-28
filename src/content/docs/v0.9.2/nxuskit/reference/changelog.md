---
title: Changelog
description: Release notes for nxusKit SDK versions.
slug: v0.9.2/nxuskit/reference/changelog
---

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## \[Unreleased]

## \[0.9.1] - 2026-04-04

### CLI Level 1 Semantic Remediation

* **Real Engine Integration**: `zen eval`, `solver solve`, `clips eval`, and `bn infer` now execute real engine logic — no more placeholder/stub responses
* **Pipeline Execution**: `pipeline run` dispatches all stage types (LLM, CLIPS, ZEN, solver, BN) through real engines with output handoff and partial results on failure
* **Call Envelope**: `call` propagates tool definitions and includes `tool_calls` and `inference_metadata` in responses
* **Artifact Deep Merge**: `artifact merge` performs recursive deep merge with dot-notation conflict paths
* **Models Capabilities**: `models --supports` filter uses real capability inference from model metadata
* **Provider Auth**: `provider status` uses structured auth subsystem; `provider logout` is provider-scoped
* **Judge/Branch**: `judge select` returns structured errors; `branch compare` produces field-level diffs

### CLI Documentation and Solver Format Compatibility

* **CLI Input Reference**: New `docs/user/cli-input-reference.md` covering all 13 Level 1 commands with JSON schemas, working examples, and common errors
* **Enhanced Help Text**: Every engine command's `--help` now shows input format structure
* **Solver Format Compatibility**: `solver solve` accepts library API format (ConstraintInput with `var_type`, structured constraints, domains, objectives) directly from shared `problem.json` scenario files — no format conversion needed
* **SMT-LIB Support**: `solver solve` accepts SMT-LIB 2 format (S-expressions) as convenience input for Z3 experts
* **Auto-Detection**: Solver input format (simplified CLI, library API, SMT-LIB) is auto-detected from content

### Positioning

* **CLI Description**: Updated from "CLI for interacting with multiple LLM providers" to "JSON-first control plane for shell automation, CI, and multi-engine reasoning workflows"
* **README**: Added CLI / Shell Automation section with examples
* **Naming**: Fixed `nxuskit-engine-cli` → `nxuskit-cli` naming drift across all docs and scripts

### Compliance

* **NOTICE**: Regenerated with zen-engine and z3-sys entries; Python section reformatted to remove excessive whitespace padding
* **Constitution v2.4.0**: Added semantic test assertions, stub prohibition, and task verification criteria (Articles II and III)
* **Acceptance Fixtures**: Three PoR 4.1 acceptance workflow scripts (intake-routing, generator-validator-retry, typed-artifact-handoff)

## \[0.9.0] - 2026-03-11

Initial public release of the nxusKit SDK.

### Highlights

* **Polyglot SDK**: Unified LLM interfaces across Rust, Go, and Python
* **14 LLM Providers**: Claude, OpenAI, Ollama, LM Studio, Mistral, OpenRouter, Together, Groq, Fireworks, Perplexity, MCP, CLIPS, Mock, Loopback
* **CLIPS Expert System**: Rule-based inference via embedded CLIPS 6.4.2 engine with FFI bindings
* **Bayesian Network Inference**: Full-featured BN provider with Variable Elimination, Junction Tree, Loopy BP, NUTS/HMC, and structure/parameter learning
* **Z3 Constraint Solver**: Stateful solver sessions with multi-objective optimization, soft constraints, push/pop scoping, and UNSAT core extraction
* **ZEN Decision Tables**: JSON Decision Model evaluation via zen-engine
* **Plugin Architecture**: Signed plugin loading with Ed25519 verification and capability-based sandboxing
* **SDK CLI**: Command-line tool for all providers (`nxuskit-cli`)
* **SDK Installer**: Cross-platform SDK manager (`install.sh`) with version management
* **Cross-Language Conformance**: Shared test vectors ensuring API parity across Rust, Go, and Python

### Platform Support

| Platform | Architecture | Status |
|----------|-------------|--------|
| Linux | x86\_64 | Supported |
| macOS | ARM64 (Apple Silicon) | Supported |
| macOS | x86\_64 | Supported |
| Windows | x86\_64 | Supported |

### Language SDKs

| Language | Package | Description |
|----------|---------|-------------|
| Rust | `nxuskit` | FFI wrapper with safe Rust API |
| Go | `nxuskit-go` | Idiomatic Go with context support |
| Python | `nxuskit-py` | Pure Python with `requests` HTTP client |

### Getting Started

See [Installation](/v0.9.2/nxuskit/getting-started/installation/) for installation and usage instructions.

For runnable examples, see the [nxusKit-examples](https://github.com/nxus-SYSTEMS/nxusKit-examples) repository.
