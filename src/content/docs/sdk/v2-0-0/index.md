---
title: Install nxusKit v2.0.0
description: Verify and install the v2.0.0 SDK bundle, run a local Community Edition first call, and migrate from v1.0.5.
pagefind: false
---

nxusKit v2.0.0 is rolling out. This versioned guide covers the v2 bundles;
v1.0.5 remains the current/default documentation.

## Download and verify

Use the [nxusKit `sdk-v2.0.0` GitHub release](https://github.com/nxus-SYSTEMS/nxusKit/releases/tag/sdk-v2.0.0).
Select the archive for your platform:

| Platform | Archive | SHA-256 |
| --- | --- | --- |
| Linux x86_64 | `nxuskit-sdk-2.0.0-pro-linux-x86_64.tar.gz` | `03188e785222ac68b4ba0a6a678b155904fa6b2feaad9031a6c548dfe016efeb` |
| macOS ARM64 (Apple Silicon) | `nxuskit-sdk-2.0.0-pro-macos-arm64.tar.gz` | `bab483f458abc8eabb6bff5f273fd452b626dd92057ee9f9712dd6b0e069331b` |
| Windows x86_64 | `nxuskit-sdk-2.0.0-pro-windows-x86_64.zip` | `fbb3509a77598b34478d9291f048f5d129f316a5ff36a15418e917e1e67014de` |

`pro` in the filename means the bundle can run Pro features when licensed.
Community Edition (CE) works from the same bundle without an SDK license.
New Pro purchases are temporarily closed during this rollout. When purchases
reopen, an eligible Pro license activates Pro on the same installation.
macOS x86_64 is not supported in v2.0.0.

**v2.0.0 Launch Party Pricing:** details to follow. No new price or sales
reopening date is announced here.

These checksums identify the selected binary bundles, not GitHub's generated
source archives. The public source release and the binary producer have
separate lineage; a source update does not change these archive bytes.

The bundles' included guides still contain older issuance or replacement
instructions. Those instructions are superseded: new assisted deployment-token
issuance and replacement are deferred until after v2.0.0 GA, with no announced
date. Existing compatible offline verification and ordinary developer
activation are unchanged.

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

## Migrate from v1.0.5

1. Keep your working [v1.0.5 bundle](https://github.com/nxus-SYSTEMS/nxusKit/releases/tag/sdk-v1.0.5)
   and configuration intact so you can return to them. While v1.0.5 is the
   default, its [installation guide](/nxuskit/getting-started/installation/)
   still applies to that bundle.
2. Install v2 side by side and run the CE check above. Point your application
   and any native library or wrapper paths at the same extracted v2 bundle.
   Do not mix a v1 native library with v2 headers or wrappers.
3. Check the application before switching it over. A legacy deployment token's
   version ceiling does not satisfy the strict v2 deployment release-line
   requirement. An already-issued compatible token is still verified under
   the existing rules. New assisted deployment-token issuance and replacement
   are deferred until after v2.0.0 GA, with no announced date. Developer
   activation and existing commercial rights are unchanged.
