---
title: Streaming
description: How to use streaming chat completions with nxusKit.
---

## Overview

Streaming lets your application receive partial model output as it is produced.
Use it for chat UIs, long-running responses, progress reporting, and command-line
tools that should show output immediately instead of waiting for the final
message.

Most LLM providers support token-by-token streaming. Deterministic providers
such as CLIPS and Z3 may emit a single result chunk or a small number of status
updates, depending on the operation.

## When to Use Streaming

| Use streaming when | Use a regular call when |
|--------------------|-------------------------|
| Users should see output immediately | You need one complete JSON response |
| Responses may be long | Responses are small and predictable |
| You want progress or partial results | You need simpler error handling |
| You are building CLI or chat interfaces | You are running batch jobs |

## Rust

```rust
use futures::StreamExt;
use nxuskit::{completion_stream, NxuskitError};

#[tokio::main]
async fn main() -> Result<(), NxuskitError> {
    let mut stream = completion_stream("gpt-4o", "Count from one to five.").await?;

    while let Some(chunk) = stream.next().await {
        print!("{}", chunk?);
    }

    Ok(())
}
```

## CLI

```bash
nxuskit-cli chat \
  --provider openai \
  --model gpt-4o \
  --stream \
  "Explain streaming responses in one paragraph."
```

For machine-readable output, use the Level 1 `call` command with JSONL:

```bash
echo '{"provider":"openai","model":"gpt-4o","prompt":"Count to five."}' \
  | nxuskit-cli call --input - --format jsonl --stream
```

## Stream Events

Streaming APIs generally emit:

- **Content chunks** — Partial text or structured deltas.
- **Metadata** — Provider, model, token usage, timing, or trace information when available.
- **Completion** — Final status, finish reason, or terminal error.

The exact fields vary by provider. Code that handles multiple providers should
append content chunks as they arrive and treat metadata as optional.

## Error Handling

Handle errors in the stream loop, not only at stream creation time. A provider
can accept a request and still fail later because of rate limits, network
interruptions, token limits, or a cancelled operation.

## Related Reference

- [Provider Model](/nxuskit/concepts/provider-model/)
- [Cloud LLM Providers](/nxuskit/reference/providers/cloud-llms/)
- [Local LLM Providers](/nxuskit/reference/providers/local-llms/)
- [CLI Input Format Reference](/nxuskit/reference/cli-reference/)
