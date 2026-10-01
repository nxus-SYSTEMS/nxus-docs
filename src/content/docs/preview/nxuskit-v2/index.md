---
title: nxusKit v2.0.0 Pro Linux preview
description: Preparation draft for the internal nxusKit Pro Linux preview.
pagefind: false
banner:
  content: 'Preview preparation draft — v2.0.0; package qualified, distribution and live activation pending. Current documentation remains v1.0.5.'
---

This route is a preparation draft for the no-fee internal Linux x86_64 Pro
cohort. It is not a GA release or a ready-to-install package announcement.
Use the [current v1.0.5 documentation](/nxuskit/getting-started/installation/)
for the current release.

## Package and activation status

The Linux Pro package has completed package qualification on the measured
baseline described in the [prepared installation guide](/preview/nxuskit-v2/installation/).
The repository download destination, recipient grant and real installed-package
activation remain pending. No purchase or portal flow is required or promised
by this draft. Use the exact checksum supplied with the approved distribution.

## Prepared developer access journey

The internal grant owner supplies a no-fee grant bound to your authenticated
account, with an approved expiry and machine limit. No Annual or Perpetual
checkout is required. The instructions below describe the supported source
contract; they still require confirmation with the qualified preview package
and a real issued grant before distribution.

After installing that package, sign in using its device flow. Activate using
the purchase identifier supplied securely by the grant owner, then check and
sync your license:

```bash
nxuskit-cli license login
nxuskit-cli license activate --key <operator-supplied-purchase-id> --accept-eula --json
nxuskit-cli license status --json
nxuskit-cli license sync --json
```

The identifier is not a token and does not authorize another account. Use the
SDK's protected local storage for credentials and returned tokens. Never paste
tokens or device credentials into support messages, public documentation or Git.

Developer access is machine-bound and expires at the grant's approved period
end. Keep online sync available. If your login session expires, log in again
and repeat activation with the same purchase identifier on the same machine;
this recovers the existing seat when the grant remains eligible. If the grant
has expired, been suspended or cancelled, ask its owner to review or renew it.
Repeated activation cannot bypass an ineligible grant.

A new machine uses another allowed slot. Ask support for the qualified
package's seat-release procedure when retiring or losing a machine. No-fee
access does not imply unlimited machines or production/offline rights.

## Support and transition to GA

The cohort's support contact and renewal owner will be supplied before
distribution. Report the package checksum, CLI version, safe error code and
OS/ABI, and whether login or activation failed. Do not send raw tokens, device
credentials or machine identifiers. For a temporary service outage, retry with
bounded backoff using the same activation identity.

Internal no-fee GA access is maintained through the explicit internal grant.
At GA, its owner reviews eligibility and the package owner supplies the GA
package. Preview-token acceptance by GA and rollback compatibility remain
subject to package verification; keep the prior qualified package available.

The intended preview use is development and pre-production with online
developer activation. Production use and offline or durable deployment tokens
require separately approved exceptions. Public Pro preview claims are limited
to Solver; compiled capabilities do not establish supported availability.

## Discovery treatment

Preview pages are excluded from the sitemap, site search and hosted LLM
indexes. They remain accessible by direct URL. The noindex directive is not
access control; this page must contain only public-safe information.
