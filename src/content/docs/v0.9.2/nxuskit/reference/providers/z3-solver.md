---
title: Z3 Constraint Satisfaction Provider
description: Configuration and input/output reference for the Z3 SMT solver provider.
slug: v0.9.2/nxuskit/reference/providers/z3-solver
---

The Z3 provider integrates [Microsoft Z3](https://github.com/Z3Prover/z3), an industry-grade SMT (Satisfiability Modulo Theories) solver, into the nxusKit provider interface. It enables constraint satisfaction, optimization, and formal verification problems to be expressed and solved using the same `chat()` / `chat_stream()` API as LLM providers.

Unlike LLM providers, Z3 is deterministic — the same input always produces the same output.

## Configuration

```json
{
  "provider_type": "z3",
  "timeout_ms": 30000,
  "random_seed": 42,
  "produce_unsat_core": true,
  "logic": "QF_LIA"
}
```

**Configuration options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `timeout_ms` | integer | 30000 | Solver timeout in milliseconds |
| `random_seed` | integer | none | Seed for search heuristics (for reproducibility) |
| `produce_unsat_core` | boolean | false | Extract conflicting constraints when problem is unsatisfiable |
| `logic` | string | auto | SMT logic preset (e.g., `"QF_LIA"`, `"QF_LRA"`, `"QF_BV"`) |
| `max_conflicts` | integer | none | Maximum conflict (branch) limit for search |
| `model_paths` | string\[] | none | Directories to scan for `.smt2` and `.z3` model files |

**Capabilities:** System messages, streaming, JSON mode, seed

## Input Format

The Z3 provider accepts structured JSON as the user message content. The JSON describes variables, constraints, and optionally an optimization objective.

### Variables

```json
{
  "variables": [
    {"name": "x", "var_type": "integer"},
    {"name": "y", "var_type": "integer", "domain": {"min": 1, "max": 100}},
    {"name": "flag", "var_type": "boolean"},
    {"name": "ratio", "var_type": "real", "domain": {"min": 0.0, "max": 1.0}}
  ]
}
```

**Variable types:** `integer`, `real`, `boolean`

**Domain constraints** (optional): `min`, `max` for numeric types.

### Constraints

```json
{
  "constraints": [
    {"constraint_type": "eq", "params": {"left": "x", "right": 42}},
    {"constraint_type": "gt", "params": {"left": "y", "right": "x"}},
    {"constraint_type": "all_different", "params": {"variables": ["x", "y", "z"]}},
    {"constraint_type": "in_range", "params": {"variable": "x", "min": 1, "max": 10}}
  ]
}
```

**Supported constraint types:**

| Type | Description | Parameters |
|---|---|---|
| `eq` | Equal | `left`, `right` |
| `neq` | Not equal | `left`, `right` |
| `lt` | Less than | `left`, `right` |
| `gt` | Greater than | `left`, `right` |
| `le` | Less than or equal | `left`, `right` |
| `ge` | Greater than or equal | `left`, `right` |
| `add` | Addition expression | `left`, `right` (or `operands` list) |
| `sub` | Subtraction expression | `left`, `right` |
| `mul` | Multiplication expression | `left`, `right` |
| `div` | Division expression | `left`, `right` |
| `and` | Logical AND | `operands` list |
| `or` | Logical OR | `operands` list |
| `not` | Logical NOT | `operand` |
| `implies` | Logical implication | `left`, `right` |
| `iff` | If and only if | `left`, `right` |
| `all_different` | All variables must differ | `variables` list |
| `at_most` | At most N true | `variables`, `n` |
| `at_least` | At least N true | `variables`, `n` |
| `exactly` | Exactly N true | `variables`, `n` |
| `in_range` | Value within range | `variable`, `min`, `max` |

Parameters can reference variable names (strings), literal values (numbers, booleans), or nested expressions.

### Optimization

Add an `objective` field to minimize or maximize a variable:

```json
{
  "variables": [...],
  "constraints": [...],
  "objective": {
    "direction": "minimize",
    "expression": "cost"
  }
}
```

**Directions:** `"minimize"` or `"maximize"`

### Named Constraints

Constraints can be named for unsat core extraction:

```json
{
  "constraints": [
    {"name": "budget_limit", "constraint_type": "le", "params": {"left": "cost", "right": 1000}},
    {"name": "quality_req", "constraint_type": "ge", "params": {"left": "quality", "right": 8}}
  ]
}
```

When the problem is unsatisfiable and `produce_unsat_core` is enabled, the response includes the names of conflicting constraints.

## Output Format

The response `content` field contains JSON:

### Satisfiable (SAT)

```json
{
  "status": "sat",
  "assignments": {
    "x": 42,
    "y": 58,
    "flag": true
  },
  "stats": {
    "solve_time_ms": 2,
    "num_conflicts": 0,
    "num_decisions": 5
  }
}
```

### Unsatisfiable (UNSAT)

```json
{
  "status": "unsat",
  "unsat_core": ["budget_limit", "quality_req"],
  "stats": {
    "solve_time_ms": 1,
    "num_conflicts": 3
  }
}
```

### Optimal (Optimization)

```json
{
  "status": "optimal",
  "assignments": {
    "cost": 150,
    "quality": 8
  },
  "objective_value": 150.0,
  "stats": {
    "solve_time_ms": 15,
    "num_solutions_found": 4
  }
}
```

## Streaming

* **Satisfaction problems**: Single result chunk (solve is typically \< 1ms).
* **Optimization problems**: Progressive improvement — each improving solution is emitted as a `StreamChunk`, with the final chunk containing `finish_reason` and complete stats.

## Examples

### Basic Satisfaction

```rust
use nxuskit-engine::{Z3Provider, ChatRequest, Message};

let provider = Z3Provider::builder()
    .timeout_ms(5_000)
    .build()?;

let problem = r#"{
    "variables": [
        {"name": "x", "var_type": "integer", "domain": {"min": 1, "max": 9}},
        {"name": "y", "var_type": "integer", "domain": {"min": 1, "max": 9}},
        {"name": "z", "var_type": "integer", "domain": {"min": 1, "max": 9}}
    ],
    "constraints": [
        {"constraint_type": "all_different", "params": {"variables": ["x", "y", "z"]}},
        {"constraint_type": "eq", "params": {"left": {"add": ["x", "y", "z"]}, "right": 15}}
    ]
}"#;

let request = ChatRequest::new("z3-solver")
    .with_message(Message::user(problem));
let response = provider.chat(&request).await?;

let output: serde_json::Value = serde_json::from_str(&response.content)?;
assert_eq!(output["status"], "sat");
```

### Via C ABI (Go)

```go
provider, err := nxuskit.NewZ3FFIProvider(
    nxuskit.WithZ3Timeout(5000),
    nxuskit.WithZ3UnsatCore(true),
)

response, err := provider.Chat(ctx, &nxuskit.ChatRequest{
    Model: "z3-solver",
    Messages: []nxuskit.Message{
        {Role: "user", Content: problemJSON},
    },
})
```

### Via C ABI (Python)

```python
from nxuskit-py._ffi_provider import create_ffi_provider

provider = create_ffi_provider({
    "provider_type": "z3",
    "timeout_ms": 5000,
    "produce_unsat_core": True,
})

response = provider.chat(model="z3-solver", messages=[
    {"role": "user", "content": problem_json}
])
```

## Model Discovery

The Z3 provider can discover pre-defined constraint model files:

```rust
let models = provider.list_models().await?;
// Returns built-in models ("z3-solver", "z3-optimizer") plus
// any .smt2 and .z3 files found in configured model_paths
```

## Use Cases

* **Scheduling**: Resource allocation, timetabling, shift planning
* **Configuration**: Product configuration with constraints, compatibility checking
* **Puzzles**: Sudoku, N-Queens, logic puzzles
* **Verification**: Property checking, invariant validation
* **Optimization**: Cost minimization, resource optimization with constraints
* **Planning**: Task sequencing with dependency and resource constraints
