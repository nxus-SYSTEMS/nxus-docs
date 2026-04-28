---
title: Tier System
description: Feature and limit comparison across Community, Pro, and Enterprise
  editions of nxusKit.
slug: v0.9.2/nxuskit/concepts/tier-system
---

## Overview

nxusKit ships in three editions. **Community** is free and open-source.
**Pro** unlocks advanced reasoning engines, plugin infrastructure, and
deployment-ready licensing for commercial applications. **Enterprise**
adds delegated trust and custom plugin configuration for large organizations.

## Feature Matrix

| Feature Domain | Community | Pro | Enterprise |
|----------------|:---------:|:---:|:----------:|
| LLM Cloud Providers (OpenAI, Claude, Groq, Mistral, Fireworks, Together, OpenRouter, Perplexity) | Yes | Yes | Yes |
| LLM Local Providers (Ollama, LM Studio) | Yes | Yes | Yes |
| CLIPS Rule Engine (ClipsSession API) | Yes | Yes | Yes |
| Bayesian Network Inference | Yes | Yes | Yes |
| Auth Helper (API-key management, credential store) | Yes | Yes | Yes |
| Tool Calling / Function Calling | Yes | Yes | Yes |
| Streaming & Token Usage | Yes | Yes | Yes |
| Retry & Adaptive Rate Limiting | Yes | Yes | Yes |
| Vision / Image Support | Yes | Yes | Yes |
| OAuth Authentication Infrastructure | Yes | Yes | Yes |
| Cross-language Parity (Rust, Go, Python) | Yes | Yes | Yes |
| Static + Dynamic Linking | Yes | Yes | Yes |
| **ZEN Decision Tables** | — | Yes | Yes |
| **Constraint Solver (Z3-backed)** | — | Yes | Yes |
| **Plugin Loading & Trust Policy** | — | Yes | Yes |
| **MCP (Model Context Protocol)** | — | Yes | Yes |
| **CLIPS Advanced (programmatic rules, session persistence)** | — | Yes | Yes |
| **Custom Plugin Configuration Paths** | — | — | Yes |
| **Delegated Trust Roots** | — | — | Yes |
| **Priority Support** | — | — | Yes |

## Numerical Limits

| Limit | Community | Pro | Enterprise |
|-------|:---------:|:---:|:----------:|
| Max concurrent CLIPS sessions | 16 | 64 | 256 |
| Max cached rulebases | 8 | 32 | 128 |
| Max rules per session | 500 | 5,000 | 50,000 |
| Max facts per session | 10,000 | 100,000 | 1,000,000 |
| Max Bayesian network nodes | 50 | 500 | 5,000 |
| Max solver constraints | — | 10,000 | 100,000 |
| Machine activations (developer tokens) | — | 3 | Unlimited |

## SDK Wrapper Availability

All editions provide wrappers for all three languages:

| Language | Package | Install |
|----------|---------|---------|
| Rust | `nxuskit` | `cargo add nxuskit` |
| Go | `nxuskit` | `go get github.com/nxus-SYSTEMS/nxusKit/packages/nxuskit-go` |
| Python | `nxuskit-py` | `pip install nxuskit-py` |

## Example Tier Assignments

| Example | Tier | Reason |
|---------|------|--------|
| LLM basics, streaming, tool calling | Community | Uses cloud/local LLM providers |
| CLIPS basics, CLIPS-LLM hybrid | Community | CLIPS engine is Community-tier |
| Bayesian network inference | Community | BN inference is Community-tier |
| Solver examples | **Pro** | Use the Z3 constraint solver |
| Solver what-if examples | **Pro** | Use scoped Z3 optimization |
| LLM-solver hybrid examples | **Pro** | Combine LLM reasoning with Z3 solving |
| ZEN decision examples | **Pro** | Use ZEN decision tables |

## Licensing

| Aspect | Community | Pro | Enterprise |
|--------|-----------|-----|------------|
| License type | Open-source | Commercial subscription | Commercial subscription |
| Token required | No | Yes (developer or deployment) | Yes |
| Machine activations | N/A | Up to 3 per license | Unlimited |
| Deployment tokens | N/A | Unlimited instances, no per-seat fees | Unlimited |
| Version ceiling | N/A | Locked to major.minor at purchase time | Locked to major.minor |
| Trial | N/A | 30-day trial (registration required) | Contact sales |

## Getting Started with Pro

1. Create an account and register for a trial or purchase a license
2. Authenticate: `nxuskit-cli license login`
3. Activate on your machine: `nxuskit-cli license activate --key <purchase_id>`
4. For CI/CD: set `NXUSKIT_LICENSE_TOKEN` with your deployment token

See [Licensing](/v0.9.2/nxuskit/concepts/licensing/) for the full activation workflow.
