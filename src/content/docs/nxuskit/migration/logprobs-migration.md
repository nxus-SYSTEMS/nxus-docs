---
title: "Logprobs Migration"
description: "Migrate to first-class unary chat logprobs in nxusKit SDK v0.9.3."
---

**Audience:** SDK consumers that previously needed to request token log
probabilities through `provider_options` because the SDK had no first-class
field.

## What Changed in v0.9.3

The Rust wrapper, Python SDK, Go SDK, and the C ABI now expose first-class
unary chat logprobs:

- **Request side:** `ChatRequest.logprobs: Option<bool>` and
  `ChatRequest.top_logprobs: Option<u8>` (Rust); equivalents in Python and
  the C ABI envelope. Use the Rust builders `with_logprobs(true)` /
  `with_top_logprobs(n)`, the Python `ChatRequest(..., logprobs=True,
  top_logprobs=5)`, or set the JSON fields directly when calling the C ABI.
- **Response side:** `ChatResponse.logprobs: Option<LogprobsData>` with
  typed `TokenLogprob` (selected token + bytes) and `TopLogprob` (each
  alternative + bytes). The wire path is `logprobs.content[]` (matches
  OpenAI; pinned by
  `packages/nxuskit-engine/crates/nxuskit-core/tests/logprobs_abi_passthrough_test.rs`).
- **Engine behavior:** `parameter_adapter.rs::adapt_logprobs` performs
  warn-and-drop when a provider's `ProviderCapabilities.supports_logprobs`
  is `false`, emits a structured `Info` warning with
  `parameter == "logprobs"`, and drops both first-class fields. It does
  **not** tunnel logprobs through `provider_options`.

## Migration For Existing Callers

If you previously stuffed logprobs into `provider_options` to work around
the missing first-class field:

```rust
// OLD (pre-v0.9.3) — pattern still parses but never reaches the provider
let req = ChatRequest::new("gpt-5.4")
    .with_message(Message::user("..."))
    .with_provider_options(serde_json::json!({
        "logprobs": true,
        "top_logprobs": 5,
    }));
```

Switch to the first-class fields:

```rust
// NEW (v0.9.3+) — first-class, capability-gated, surfaces typed response
let req = ChatRequest::new("gpt-5.4")
    .with_message(Message::user("..."))
    .with_logprobs(true)
    .with_top_logprobs(5);
```

Python:

```python
from nxuskit import ChatRequest

req = ChatRequest(
    model="gpt-5.4",
    messages=[{"role": "user", "content": "..."}],
    logprobs=True,
    top_logprobs=5,
)
```

C ABI / direct JSON:

```json
{
  "model": "gpt-5.4",
  "messages": [{"role": "user", "content": "..."}],
  "logprobs": true,
  "top_logprobs": 5
}
```

## Why The Switch Matters

- **Capability gating:** the engine only forwards logprobs to providers
  whose capability map enables it. The legacy `provider_options` path
  bypasses this check and silently dies on unsupported providers.
- **Typed responses:** `ChatResponse.logprobs` returns a typed
  `LogprobsData` rather than raw provider JSON. Selected token and
  alternative tokens are addressable as fields, including UTF-8 bytes
  when present.
- **Cross-language parity:** Rust, Python, Go, and the C ABI all use the
  same wire shape (`logprobs.content[]` with `token`, `logprob`, `bytes`,
  `top_logprobs`). Switching once works everywhere.
- **No silent drops:** unsupported providers now emit a structured
  warning instead of swallowing the request, so callers can detect and
  fall back.

## Out Of Scope For v0.9.3

- **Streaming logprobs.** `StreamChunk` deliberately has no logprobs
  surface in v0.9.3. Streaming logprobs are deferred to a future additive
  release rather than retrofitted into the unary path.
- **Public `CapabilityManifest` v2.** Capability detection remains an
  implementation detail in v0.9.3; the manifest type and any associated
  client-side discovery API are deferred to a future release.
