---
title: First Call
description: Make your first LLM call with nxusKit in Rust, Go, Python, or the C ABI.
slug: v0.9.2/nxuskit/getting-started/first-call
---

This guide assumes you have installed the SDK and configured at least one
provider credential. If you have not done that yet, start with
[Installation](/v0.9.2/nxuskit/getting-started/installation/) and
[Authentication](/v0.9.2/nxuskit/getting-started/authentication/).

## Fastest Path: CLI

Set a provider API key, then send a single chat request:

```bash
export OPENAI_API_KEY="sk-..."

nxuskit-cli chat \
  --provider openai \
  --model gpt-4o \
  "Say hello from nxusKit in one sentence."
```

For structured shell workflows, use the Level 1 `call` command:

```bash
echo '{"provider":"openai","model":"gpt-4o","prompt":"Say hello from nxusKit."}' \
  | nxuskit-cli call --input - --format json
```

## Rust

Use the Rust wrapper bundled with the SDK as a path dependency:

```toml
# Cargo.toml
[dependencies]
nxuskit = { path = "/absolute/path/to/nxuskit-sdk-{version}-{platform}/rust" }
```

```rust
use nxuskit::{ChatRequest, Message, NxuskitProvider, ProviderConfig};

fn main() -> Result<(), nxuskit::NxuskitError> {
    let provider = NxuskitProvider::new(ProviderConfig {
        provider_type: "openai".into(),
        ..Default::default()
    })?;

    let request = ChatRequest::new("gpt-4o")
        .with_message(Message::user("Say hello from Rust."))
        .with_max_tokens(100);

    let response = provider.chat(request)?;
    println!("{}", response.content);
    Ok(())
}
```

## Go

Add the Go wrapper and alias the package as `nxuskit` in your import block:

```bash
go get github.com/nxus-SYSTEMS/nxusKit/packages/nxuskit-go
```

```go
package main

import (
    "context"
    "fmt"
    "os"

    nxuskit "github.com/nxus-SYSTEMS/nxusKit/packages/nxuskit-go"
)

func main() {
    provider, err := nxuskit.NewOpenAIProvider(
        nxuskit.WithAPIKey(os.Getenv("OPENAI_API_KEY")),
    )
    if err != nil {
        panic(err)
    }

    req := nxuskit.ChatRequest{
        Model: "gpt-4o",
        Messages: []nxuskit.Message{
            {Role: nxuskit.RoleUser, Content: "Say hello from Go."},
        },
    }

    resp, err := provider.Chat(context.Background(), req)
    if err != nil {
        panic(err)
    }

    fmt.Println(resp.Content)
}
```

## Python

Install the Python wrapper, then create a provider and call it:

```bash
pip install nxuskit-py
```

```python
from nxuskit import Provider

provider = Provider.create("openai")
response = provider.chat(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Say hello from Python."}],
    max_tokens=100,
)

print(response.content)
```

## C

The SDK bundle includes `include/nxuskit.h` and platform libraries under
`lib/`. Compile against those files and set the provider API key in the
environment:

```bash
export OPENAI_API_KEY="sk-..."
cc -I "$NXUSKIT_SDK_DIR/include" \
  -o basic_chat basic_chat.c \
  -L "$NXUSKIT_SDK_DIR/lib" \
  -lnxuskit \
  -Wl,-rpath,"$NXUSKIT_SDK_DIR/lib"
```

Use the [C ABI Reference](/v0.9.2/nxuskit/reference/api-reference/) for function,
ownership, and error-handling details.

## Local Providers

Local providers do not require API keys:

```bash
# Ollama default
export OLLAMA_HOST="http://localhost:11434"

# LM Studio default
export LMSTUDIO_HOST="http://localhost:1234/v1"
```

Use [Local LLM Providers](/v0.9.2/nxuskit/reference/providers/local-llms/) for
model setup and provider-specific options.

## Next Steps

| Goal | Read |
|------|------|
| Configure credentials | [Authentication](/v0.9.2/nxuskit/getting-started/authentication/) |
| Browse runnable projects | [Examples](/v0.9.2/nxuskit/examples/) |
| Stream responses | [Streaming](/v0.9.2/nxuskit/guides/streaming/) |
| Choose a provider | [Provider Model](/v0.9.2/nxuskit/concepts/provider-model/) |
| Use CLI JSON contracts | [CLI Input Format Reference](/v0.9.2/nxuskit/reference/cli-reference/) |
| Integrate through native boundaries | [C ABI Reference](/v0.9.2/nxuskit/reference/api-reference/) |
