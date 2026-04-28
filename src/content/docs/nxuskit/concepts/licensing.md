---
title: Licensing
description: How to activate, manage, and troubleshoot nxusKit Pro licenses.
---

## Overview

nxusKit Pro features require a valid license token. This guide covers the
full lifecycle: authentication, activation, deployment, renewal, and
deactivation.

## Quick Start

```bash
# 1. Authenticate with your nxus.systems account
nxuskit-cli license login

# 2. Activate with your purchase ID (received via email)
nxuskit-cli license activate --key <purchase_id>

# 3. Verify activation
nxuskit-cli license status

# 4. Use Pro features — they just work
```

## Token Types

The SDK manages three types of tokens:

| Token | Storage | Purpose | Expiry | Machine-bound? |
|-------|---------|---------|--------|----------------|
| **Auth** | `~/.config/nxuskit/auth.json` | Authenticates you with the licensing service | 30 days | No |
| **Developer** | `~/.nxuskit/license.token` | Authorizes Pro features for local development | Subscription period | Yes (up to 3 machines) |
| **Deployment** | `NXUSKIT_LICENSE_TOKEN` env var | Authorizes Pro features in CI/CD and production | Never expires | No (org-scoped) |

## Step-by-Step Activation

### 1. Authenticate

Before activating a license, you must authenticate with your nxus.systems
account:

```bash
nxuskit-cli license login
```

This opens your browser to the nxus.systems login page. After logging in,
enter the code shown in your terminal. The auth token is stored at
`~/.config/nxuskit/auth.json` and used automatically for subsequent commands.

Check auth status:

```bash
nxuskit-cli license status
```

### 2. Activate

With authentication complete, activate your license:

```bash
nxuskit-cli license activate --key <purchase_id>
```

On success you will see:

```
Activated. 1/3 machines used.
Token stored: ~/.nxuskit/license.token
```

The developer token is stored locally and validated on each SDK initialization.

### 3. Verify

Check your license status at any time:

```bash
nxuskit-cli license status
```

Output includes token type, edition, expiry date, and machine count.

For JSON output (useful in scripts):

```bash
nxuskit-cli license status --json
```

### 4. Use Pro Features

Once activated, Pro features work transparently:

```python
# Python — ZEN decision tables (Pro)
from nxuskit import zen_evaluate
result = zen_evaluate(table_path, input_data)

# Python — Solver (Pro)
from nxuskit import SolverConfig
```

```rust
// Rust — ZEN evaluation (Pro)
let result = nxuskit::zen_evaluate(&table, &input)?;
```

```go
// Go — Solver (Pro)
session, err := nxuskit.NewSolverSession(config)
```

## Trial Activation

To start a 30-day Pro trial, first register for an account and authenticate:

```bash
nxuskit-cli license login
nxuskit-cli license activate --trial
```

The trial provides full Pro-tier access for 30 days.

## Deployment Tokens

Deployment tokens are designed for production, CI/CD, and containerized
environments. They have no expiry and no machine binding.

### Setup

Set the deployment token as an environment variable:

```bash
export NXUSKIT_LICENSE_TOKEN="<deployment_token>"
```

This works for:
- CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins)
- Docker containers
- Kubernetes pods
- Production servers
- Serverless functions

### Version Ceiling

Deployment tokens include a **version ceiling** (e.g., `0.9`). The token
is valid for any SDK version at or below that ceiling:

- Token ceiling `0.9` → works with v0.9.0, v0.9.1, v0.9.5
- Token ceiling `0.9` → does NOT work with v0.10.0+

When you upgrade the SDK past the ceiling, you will see:

```
Deployment token covers up to v0.9.x. Update your deployment token for v0.10+ support.
```

Organizations with active support subscriptions receive updated deployment
tokens when new major.minor versions are released.

## Token Resolution Chain

The SDK resolves tokens from multiple sources in this precedence order:

| Priority | Source | Use Case |
|----------|--------|----------|
| 1 (highest) | `NXUSKIT_LICENSE_TOKEN` env var | CI/CD, containers |
| 2 | `~/.nxuskit/license.token` file | Local development |
| 3 (lowest) | API parameter | Embedded / programmatic |

The first valid token found is used. This order is the same for static and
dynamic linking modes.

## Multiple Machines

Each developer license supports up to 3 machine activations:

```bash
# Activate on machine 1
nxuskit-cli license activate --key <purchase_id>
# → Activated. 1/3 machines used.

# Activate on machine 2
nxuskit-cli license activate --key <purchase_id>
# → Activated. 2/3 machines used.

# If all 3 slots are used, deactivate one first:
nxuskit-cli deactivate
# → Deactivated. 2/3 machines used.
```

## Renewal

When your subscription approaches expiry (7 days out), the SDK logs a
once-per-session reminder:

```
Pro license expires in 7 days. Renew at your account dashboard.
```

After expiry, Pro features return:

```
License installation required.
```

Community features continue working without interruption.

## Deactivation

To free a machine activation slot:

```bash
nxuskit-cli deactivate
```

The local token file is removed and the activation count is decremented.

To revoke your auth session:

```bash
nxuskit-cli license logout
```

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `License installation required.` | No valid license token found | Run `nxuskit-cli license login`, then `nxuskit-cli license activate --key <id>` |
| `LicenseExpired` | Subscription lapsed | Renew at your account dashboard |
| `EditionInsufficient` | Community binary | Download Pro binary |
| `VersionCeilingExceeded` | SDK upgraded past token ceiling | Request updated deployment token |
| `FeatureUnavailable` | Multiple possible causes | Run `nxuskit-cli license status` for details |
| Auth token expired | 30-day auth session ended | Run `nxuskit-cli license login` again |
