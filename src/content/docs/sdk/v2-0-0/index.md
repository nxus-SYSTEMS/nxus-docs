---
title: Install nxusKit v2.0.0
description: Install nxusKit v2.0.0, try Community Edition locally, verify an eligible Pro Solver license, and migrate from v1.0.5.
pagefind: false
---

This versioned guide covers the nxusKit v2.0.0 bundles. For the previous
release, use the [v1.0.5 documentation](/v1.0.5/nxuskit/getting-started/installation/).

## What changed in v2.0.0

Run Community Edition from one SDK bundle for your platform. The same
installation runs Pro Solver with a valid v2 Pro entitlement. Start with a
local first call that needs no model-provider credentials.

The SDK now provides the versioned v1.1 workflow contract, with typed
definitions and structured results. You can validate a pipeline before
running its LLM steps through a deterministic local loopback fixture. Use the
regular [provider call paths](/nxuskit/concepts/provider-model/) for real model
requests. Try the [v1.1 local loopback example](/nxuskit/reference/cli-reference/#version-11-workflow-contract).

The major version also marks changes to request types and stream completion.
Check the [v1.0.5 migration guide](/nxuskit/migration/upgrade-path/#migrate-from-v105-to-v200)
and [release notes](/nxuskit/reference/changelog/) before moving an existing
application.

## Download and verify

Use the [nxusKit `sdk-v2.0.0` GitHub release](https://github.com/nxus-SYSTEMS/nxusKit/releases/tag/sdk-v2.0.0).
Select the archive for your platform:

| Platform | Archive | SHA-256 |
| --- | --- | --- |
| Linux x86_64 | `nxuskit-sdk-2.0.0-pro-linux-x86_64.tar.gz` | `03188e785222ac68b4ba0a6a678b155904fa6b2feaad9031a6c548dfe016efeb` |
| macOS ARM64 (Apple Silicon) | `nxuskit-sdk-2.0.0-pro-macos-arm64.tar.gz` | `bab483f458abc8eabb6bff5f273fd452b626dd92057ee9f9712dd6b0e069331b` |
| Windows x86_64 | `nxuskit-sdk-2.0.0-pro-windows-x86_64.zip` | `fbb3509a77598b34478d9291f048f5d129f316a5ff36a15418e917e1e67014de` |

The `pro` archives run Community Edition (CE) without an SDK license.
Pro Solver requires a valid v2 Pro entitlement. New Pro purchases remain paused.
The v2.0.0 bundle for macOS requires Apple Silicon. On an Intel Mac, keep
your existing working setup or use a supported v2.0.0 platform.

These checksums identify the selected binary bundles, not GitHub's generated
source archives. The public source release and the binary producer have
separate lineage; a source update does not change these archive bytes.

Use these online instructions for availability, pricing and license setup.
Some guides bundled at build time describe older offers and issuance steps.
New assisted deployment-token issuance and replacement remain deferred,
with no announced date. Already-issued compatible tokens can still be
validated offline.

Calculate the SHA-256 before extracting. Run only the command for your archive:

```bash
# Linux x86_64
sha256sum nxuskit-sdk-2.0.0-pro-linux-x86_64.tar.gz
# macOS ARM64
shasum -a 256 nxuskit-sdk-2.0.0-pro-macos-arm64.tar.gz
```

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'nxuskit-sdk-2.0.0-pro-windows-x86_64.zip'
```

Compare the entire hash with the table (hex letter case does not matter).
If it differs, stop: do not extract or run the archive. After a match,
extract into a new directory, separate from any v1 installation. On Linux or
macOS, use `tar -xzf` with the selected archive; on Windows, use
`Expand-Archive -LiteralPath` with the ZIP and a new destination. Enter the
extracted bundle directory before running the following commands.

## Run a local CE first call

Use a clean profile without a configured SDK license for this check. You do
not need to log in, accept an activation EULA, or supply a provider API key.
The `loopback` provider echoes the input locally; it makes no provider request.

```bash
export NXUSKIT_CLI="$PWD/bin/nxuskit-cli"
"$NXUSKIT_CLI" --version
"$NXUSKIT_CLI" --help
"$NXUSKIT_CLI" call --input - --format json <<'JSON'
{"prompt":"Hello from nxusKit CE","provider":"loopback","model":"echo"}
JSON
```

```powershell
$env:NXUSKIT_CLI = (Join-Path $PWD 'bin\nxuskit-cli.exe')
& $env:NXUSKIT_CLI --version
& $env:NXUSKIT_CLI --help
'{"prompt":"Hello from nxusKit CE","provider":"loopback","model":"echo"}' |
  & $env:NXUSKIT_CLI call --input - --format json
```

The version should be `nxuskit-cli 2.0.0`. The call should exit successfully
and return `response.content` of `Hello from nxusKit CE`, `response.provider`
of `loopback`, and `response.model` of `echo`. If the executable is missing or
reports a different version, check the selected bundle path rather than using
an unrelated global CLI. This checks the local CE call, not Pro activation.

## Activate a purchased Pro license

If you already own an eligible v2 Pro license, open
[My Products](https://nxus.systems/my/products) with the account that made the
purchase. Use the Purchase ID / Activation Key shown for that purchase.

First sign in from the extracted v2 bundle:

```bash
"$NXUSKIT_CLI" license login
```

```powershell
& $env:NXUSKIT_CLI license login
```

The CLI displays a device code in the terminal and opens the authorization
page in your browser. Make sure the browser is signed in with the purchasing
account, enter that code, and authorize the device. Keep the terminal open
until sign-in completes.

Read the [EULA](https://nxus.systems/legal/eula). If you accept it, replace
`<your-purchase-id>` below with your Purchase ID / Activation Key and activate:

```bash
"$NXUSKIT_CLI" license activate --key "<your-purchase-id>" --accept-eula --json
"$NXUSKIT_CLI" license status --json
```

```powershell
& $env:NXUSKIT_CLI license activate --key '<your-purchase-id>' --accept-eula --json
& $env:NXUSKIT_CLI license status --json
```

Activation updates the existing local license cache at
`~/.nxuskit/license.token`. The activation response should report `success`
as `true`. Inspect `license status --json` for a valid local Pro license
and run the Solver check below to confirm access.

### Run a Pro Solver check

From the same bundle, solve this small constraint problem:

```bash
"$NXUSKIT_CLI" solver solve --input - --format json <<'SMT'
(declare-const x Int)
(assert (= x 7))
(check-sat)
(get-model)
SMT
```

```powershell
@'
(declare-const x Int)
(assert (= x 7))
(check-sat)
(get-model)
'@ | & $env:NXUSKIT_CLI solver solve --input - --format json
```

The result should be satisfiable with `x` equal to `7`. This checks the
licensed Solver capability using the installed bundle.

### Recover sign-in or activation

Use the same extracted v2 executable for these recovery commands.

- **Sign-in expired:** repeat `license login` above, authorizing the browser
  with the purchasing account.
- **Wrong account:** run `license logout`, switch the browser to the purchasing
  account, then repeat `license login`. Logging out of authentication does not
  free an activated machine seat.
- **Cached developer token expired or needs refreshing:** run the explicit sync
  below, then inspect status again. If no cached token exists, use the activation
  command above with the same owned Purchase ID / Activation Key.

```bash
"$NXUSKIT_CLI" license sync --json
"$NXUSKIT_CLI" license status --json
```

```powershell
& $env:NXUSKIT_CLI license sync --json
& $env:NXUSKIT_CLI license status --json
```

If the service reports that no seats remain, free a seat only when you intend
to stop using an existing machine: run `nxuskit-cli deactivate` with that
machine's v2 CLI. Wait for success before activating the new machine. Deleting a local token
file does not release the server-side seat. If that machine is unavailable,
contact nxus.SYSTEMS support.

For a network or service error, retry activation with the same purchase after
the connection or service recovers. For an ownership or inactive-purchase error,
check the purchasing account and active purchase in My Products; contact support
if the problem remains. A perpetual purchase's maintenance/support date is
separate from the cached developer token's expiry.

## Migrate from v1.0.5

Keep your [v1.0.5 bundle](https://github.com/nxus-SYSTEMS/nxusKit/releases/tag/sdk-v1.0.5)
and [archived instructions](/v1.0.5/nxuskit/getting-started/installation/) available.
Follow the [v1.0.5 to v2.0.0 migration guide](/nxuskit/migration/upgrade-path/#migrate-from-v105-to-v200)
for code, platform and licensing changes.
