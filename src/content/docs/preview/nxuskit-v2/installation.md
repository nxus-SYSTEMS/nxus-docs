---
title: Linux Pro preview installation
description: Qualified package baseline and prepared developer activation instructions.
pagefind: false
banner:
  content: 'v2.0.0 preview draft — qualified package; distribution and live activation pending.'
---

[Preview overview](/preview/nxuskit-v2/) · [Current v1.0.5 docs](/nxuskit/getting-started/installation/)

## Qualified package baseline

The qualified package is nxuskit-sdk-2.0.0-pro-linux-x86_64.tar.gz.
Qualification used Linux Mint 22.3 (Zena), Ubuntu Noble lineage, x86_64 and
glibc 2.39. This is not a claim of support for every Linux distribution.
Extracted C ABI, Go, Rust dynamic/static, Python wheel/sdist and CLI consumers
passed package qualification. Pro preview availability claims remain Solver-only.

The package and this later documentation revision are separate: the qualified
archive does not contain this subsequent documentation annotation.

## Retrieval after distribution approval


The cohort invitation must provide the approved private repository, exact qualified run, checksum, support contact, and supported host baseline. Do not substitute a public latest release or another workflow run. This source document does not authorize download or deployment.

Verify the provided archive checksum before extraction. Use the package's `bin/nxuskit-cli --version` to confirm the installed version, and use the packaged consumer instructions for the selected language. Native wrappers must resolve the libraries from this exact extracted package, not an ambient SDK installation. The fresh qualification receipt must record those wrapper paths and host architecture/glibc facts.


## Recipient-bound activation


The approved Licensing runbook defines a no-fee, finite-period, recipient-bound Pro entitlement using the existing commercial entitlement flow. It does not require Annual/Perpetual checkout. The grant owner must supply the purchase ID, machine cap, expiry/renewal policy, and support route before distribution.

The following commands are confirmed by current CLI source, but real installed activation has not yet been qualified for this preview. Execute them only after the separate grant and activation approval:

```bash
: "${NXUSKIT_SDK_DIR:?Set the verified extracted package directory}"
"$NXUSKIT_SDK_DIR/bin/nxuskit-cli" license login
"$NXUSKIT_SDK_DIR/bin/nxuskit-cli" license activate --key "$NXUSKIT_PREVIEW_PURCHASE_ID" --accept-eula --json
"$NXUSKIT_SDK_DIR/bin/nxuskit-cli" license status --json
"$NXUSKIT_SDK_DIR/bin/nxuskit-cli" license sync --json
```

Do not include tokens, purchase IDs, account/device identifiers, or private keys in support logs. Renewal uses the approved existing entitlement; there is no documented `license refresh` command. Do not invent a deactivation command. Fixture signing keys are not proof of customer activation. Production signing, offline licensing, and any conversion to GA entitlement remain separately governed.

