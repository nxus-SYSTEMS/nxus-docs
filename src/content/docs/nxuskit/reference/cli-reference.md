---
title: CLI Input Format Reference
description: Input schemas and examples for every Level 1 nxuskit-cli command.
---

Single source of truth for every Level 1 `nxuskit-cli` command's input schema,
with copy-paste runnable examples using the loopback provider.

All commands accept `--input -` for stdin and `--format json` (default).
Output is wrapped in a `ResponseEnvelope` with `trace_id`, `request_metadata`,
and timing fields.

---

## Table of Contents

- [call](#call)
- [zen eval](#zen-eval)
- [solver solve](#solver-solve)
  - [Solver Format Disambiguation](#solver-format-disambiguation)
- [clips eval](#clips-eval)
- [bn infer](#bn-infer)
- [pipeline run](#pipeline-run)
- [artifact merge](#artifact-merge)
- [artifact summarize](#artifact-summarize)
- [packet validate](#packet-validate)
- [tool-loop run](#tool-loop-run)
- [judge select](#judge-select)
- [branch fork](#branch-fork)
- [branch compare](#branch-compare)

---

### `call`

LLM invocation. Accepts either `prompt` (single-turn) or `messages` (multi-turn).

**Input schema (`CallInput`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | no | Single-turn user prompt (convenience shorthand) |
| `messages` | array of `{role, content}` | no | Multi-turn conversation messages |
| `system` | string | no | System message prepended to the conversation |
| `provider` | string | no | Provider name (default: `loopback`, or `$NXUSKIT_PROVIDER`) |
| `model` | string | no | Model identifier (default: `"default"`) |
| `tool_definitions` | array of JSON objects | no | Tool/function schemas passed to the LLM |
| `max_tokens` | u32 | no | Maximum output tokens |
| `temperature` | f32 | no | Sampling temperature |
| `stream` | bool | no | Enable streaming (JSONL output) |

At least one of `prompt` or `messages` should be provided.

**Example:**

```bash
echo '{"prompt": "Hello", "provider": "loopback"}' \
  | nxuskit-cli call --input - --format json
```

**Common errors:**

- `Invalid call input JSON: missing field ...` -- Fix: ensure the input is valid JSON with at least `prompt` or `messages`.
- `Unknown provider "xyz"` -- Fix: use a valid provider name (`loopback`, `openai`, `claude`, etc.) or set `$NXUSKIT_PROVIDER`.

---

### `zen eval`

ZEN decision table evaluation (Pro-gated).

**Input schema (`ZenEvalInput`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `table` | JSON object | **yes** | JDM (JSON Decision Model) decision table definition |
| `input` | JSON object | **yes** | Context data evaluated against the table |

The `table` field must be a valid JDM model with `nodes` and `edges` arrays.
Decision table nodes have `type: "decisionTableNode"` and contain `rules` in
their `content`.

**Example:**

```bash
echo '{
  "table": {
    "nodes": [
      {
        "id": "1",
        "name": "input",
        "type": "inputNode",
        "content": {}
      },
      {
        "id": "2",
        "name": "decision",
        "type": "decisionTableNode",
        "content": {
          "hitPolicy": "first",
          "rules": [
            {"_id": "r1", "input.age": ">= 18", "output.status": "adult"}
          ],
          "inputs": [{"id": "i1", "name": "age", "field": "input.age"}],
          "outputs": [{"id": "o1", "name": "status", "field": "output.status"}]
        }
      },
      {
        "id": "3",
        "name": "output",
        "type": "outputNode",
        "content": {}
      }
    ],
    "edges": [
      {"id": "e1", "sourceId": "1", "targetId": "2", "type": "edge"},
      {"id": "e2", "sourceId": "2", "targetId": "3", "type": "edge"}
    ]
  },
  "input": {"age": 25}
}' | nxuskit-cli zen eval --input - --format json
```

**Common errors:**

- `Entitlement check failed: zen` -- Fix: ZEN is Pro-gated. Ensure a valid Pro license is active.
- `Invalid ZEN eval input: missing field "table"` -- Fix: both `table` and `input` are required fields.

---

### `solver solve`

Z3 constraint solving (Pro-gated). Auto-detects three input formats.

#### Solver Format Disambiguation

The CLI accepts three distinct input formats, auto-detected at parse time:

| Format | Detection Rule | Best For |
|--------|---------------|----------|
| **Simplified** | JSON with `"type"` on variables and string constraints | Quick CLI one-liners, human-authored problems |
| **Library API** | JSON with `"var_type"` on variables or `"constraint_type"` on constraints | Cross-language scenario sharing with nxuskit-go/nxuskit-py |
| **SMT-LIB 2** | Input starts with `(` | Direct Z3 interaction, academic benchmarks |

The **library API format** uses the same `ConstraintInput` struct as the Rust, Go,
and Python SDKs. This means a JSON file authored for `solver solve` can be loaded
directly by `nxuskit.solve()` in any SDK, enabling cross-language scenario sharing.

---

#### Format 1: Simplified

**Input schema (`SolverInput`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `variables` | array of `SolverVariable` | **yes** | Variable declarations |
| `constraints` | array of strings | **yes** | Constraint expressions (e.g. `"x + y == 10"`) |
| `objective` | string | no | `"minimize"` or `"maximize"` |
| `objective_expr` | string | no | Expression to optimize (requires `objective`) |

**`SolverVariable` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **yes** | Variable identifier |
| `type` | string | **yes** | `"integer"`, `"real"`, or `"boolean"` |
| `bounds` | array of `{"min": n}` / `{"max": n}` | no | Domain bounds |

Supported constraint operators: `==`, `!=`, `>=`, `<=`, `>`, `<`.
Arithmetic in LHS: `x + y == 10`, `x - y == 5`, `x * y == 12`.

**Example (simplified):**

```bash
echo '{
  "variables": [
    {"name": "x", "type": "integer", "bounds": [{"min": 0}, {"max": 10}]},
    {"name": "y", "type": "integer", "bounds": [{"min": 0}, {"max": 10}]}
  ],
  "constraints": ["x + y == 10", "x >= 3"],
  "objective": "maximize",
  "objective_expr": "x"
}' | nxuskit-cli solver solve --input - --format json
```

---

#### Format 2: Library API (`ConstraintInput`)

**Input schema (`ConstraintInput`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `variables` | array of `VariableDef` | no | Variable declarations |
| `constraints` | array of `ConstraintDef` | no | Structured constraint definitions |
| `objective` | `ObjectiveDef` | no | Single optimization objective |
| `objectives` | array of `ObjectiveDef` | no | Multiple objectives (multi-objective mode) |
| `config` | `SolverConfig` | no | Per-request solver configuration overrides |
| `retract` | array of strings | no | Named constraints to remove |
| `assumptions` | array of `ConstraintDef` | no | Temporary constraints (auto-retracted after solve) |

**`VariableDef` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **yes** | Variable identifier |
| `var_type` | string | **yes** | `"integer"`, `"real"`, or `"boolean"` |
| `domain` | `{"min": f64, "max": f64}` or `[min, max]` | no | Domain bounds |
| `label` | string | no | Human-readable description |

**`ConstraintDef` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | no | Identifier for retraction / unsat core |
| `constraint_type` | string | **yes** | `"eq"`, `"neq"`, `"lt"`, `"gt"`, `"le"`, `"ge"`, `"add"`, `"sub"`, `"mul"`, `"div"`, `"and"`, `"or"`, `"not"`, `"implies"`, `"iff"`, `"all_different"`, `"at_most"`, `"at_least"`, `"exactly"`, `"in_range"` |
| `params` / `parameters` | JSON object | no | Type-specific parameters (e.g. `{"left": "x", "right": 3}`). Both field names accepted. If omitted, auto-inferred from `variables` and `expression` fields (see below). |
| `variables` | string[] | no | Variable names involved in the constraint. Used to auto-infer `params` when omitted. |
| `expression` | string | no | Human-readable expression (e.g. `"a * 20 = c"`). Used to auto-infer `params` when omitted. |
| `weight` | f64 | no | Soft constraint penalty (omit for hard constraint) |
| `label` | string | no | Human-readable description |

**`ObjectiveDef` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **yes** | Unique objective identifier |
| `direction` | string | **yes** | `"minimize"` or `"maximize"` |
| `expression` | string | **yes** | Expression to optimize (references variable names) |
| `weight` | f64 | no | Weight for weighted multi-objective mode |
| `label` | string | no | Human-readable description |
| `priority` | u32 | no | Priority for lexicographic mode (lower = higher priority) |

**Params auto-inference**: When `params`/`parameters` is omitted or null, the CLI infers it from the `variables` and `expression` fields — matching the behavior of the Rust SDK's `ensure_parameters()` helper. This means shared `problem.json` scenario files work directly without modification:

- Comparison constraints (`ge`, `le`, `eq`, etc.) with `variables: ["a", "b"]` → infers `params: {"left": "a", "right": "b"}`
- Arithmetic constraints (`add`, `mul`, etc.) with `variables: ["a", "b", "c"]` and `expression: "a * 20 = c"` → infers `params: {"left": "a", "right": 20, "result": "c"}`
- Set constraints (`all_different`, `at_most`, `at_least`, `exactly`) with `variables: ["x", "y", "z"]` → infers `params: {"variables": ["x", "y", "z"]}`
- Partial params (e.g., `{"right": 19000}` with `variables: ["salary"]`) → merges to `{"left": "salary", "right": 19000}`

**Type aliases**: The CLI accepts `equal` (→ `eq`) and `not_equal` (→ `neq`) as long-form constraint type names for compatibility with some scenario files.

**Example (library API):**

```bash
echo '{
  "variables": [
    {"name": "x", "var_type": "integer", "domain": {"min": 0, "max": 10}},
    {"name": "y", "var_type": "integer", "domain": {"min": 0, "max": 10}}
  ],
  "constraints": [
    {"name": "sum", "constraint_type": "add", "params": {"left": "x", "right": "y", "result": 10}},
    {"name": "lower_bound", "constraint_type": "ge", "params": {"left": "x", "right": 3}}
  ],
  "objective": {
    "name": "max_x",
    "direction": "maximize",
    "expression": "x"
  }
}' | nxuskit-cli solver solve --input - --format json
```

---

#### Format 3: SMT-LIB 2

Raw SMT-LIB 2 text. Auto-detected when input starts with `(`.

**Example (SMT-LIB):**

```bash
echo '(declare-const x Int)
(declare-const y Int)
(assert (>= x 0))
(assert (<= x 10))
(assert (>= y 0))
(assert (<= y 10))
(assert (= (+ x y) 10))
(assert (>= x 3))
(check-sat)
(get-model)' | nxuskit-cli solver solve --input - --format json
```

**Common errors (all formats):**

- `Entitlement check failed: solver` -- Fix: solver is Pro-gated. Ensure a valid Pro license.
- `Cannot parse constraint expression: 'x + y = 10'` -- Fix: use `==` for equality, not `=`.
- `Invalid solver input JSON: ...` -- Fix: ensure JSON is well-formed. Check that simplified format uses `"type"` (not `"var_type"`).
- `Invalid solver library format: ...` -- Fix: library format requires `"var_type"` on variables and `"constraint_type"` on constraints.

---

### `clips eval`

CLIPS rule engine evaluation.

**Input schema (`ClipsEvalInput`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rules` | string | **yes** | CLIPS rule definitions (defrule, deftemplate, etc.) |
| `facts` | array of strings | no | Initial facts to assert (default: `[]`) |

> **Newline escaping:** CLIPS rules contain newlines. In JSON strings you must
> use `\n` for line breaks. When piping from a shell, use `$'...'` quoting or
> a heredoc to embed literal newlines, then let `jq` handle escaping.

**Example:**

```bash
echo '{
  "rules": "(defrule greet (person (name ?n)) => (assert (greeting (message (str-cat \"Hello \" ?n)))))",
  "facts": ["(person (name \"World\"))"]
}' | nxuskit-cli clips eval --input - --format json
```

**Multi-line rules (using jq for safe escaping):**

```bash
RULES=$(cat <<'CLIPS'
(deftemplate person (slot name))
(deftemplate greeting (slot message))
(defrule greet
  (person (name ?n))
  =>
  (assert (greeting (message (str-cat "Hello " ?n)))))
CLIPS
)
jq -n --arg rules "$RULES" '{"rules": $rules, "facts": ["(person (name \"World\"))"]}' \
  | nxuskit-cli clips eval --input - --format json
```

**Common errors:**

- `Failed to load CLIPS rules: ...` -- Fix: check CLIPS syntax. Common issues: unbalanced parentheses, missing `=>` in defrule.
- `Failed to assert fact '(foo)': ...` -- Fix: if using deftemplates, facts must match the template signature (e.g. `(person (name "x"))` not `(person "x")`).
- `Invalid CLIPS eval input: missing field "rules"` -- Fix: `rules` is required. Use `"rules": ""` for an empty ruleset.

---

### `bn infer`

Bayesian network inference via variable elimination.

**Input schema (`BnInferInput`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `network` | `NetworkDef` | **yes** | Bayesian network structure and CPDs |
| `evidence` | map of string to string | no | Observed variable states (default: `{}`) |
| `query_nodes` | array of strings | **yes** | Variables to compute posterior probabilities for |
| `algorithm` | string | no | Inference algorithm (default: `"variable_elimination"`) |

**`NetworkDef` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `nodes` | array of `NodeDef` | **yes** | Variable definitions with states |
| `edges` | array of `EdgeDef` | **yes** | Directed edges (parent to child) |
| `cpds` | map of string to `CpdDef` | **yes** | Conditional probability distributions |

**`NodeDef` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **yes** | Variable name |
| `states` | array of strings | **yes** | Possible states for this variable |

**`EdgeDef` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | string | **yes** | Parent node name |
| `to` | string | **yes** | Child node name |

**`CpdDef` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `probabilities` | array of f64 | **yes** | Flat probability table (row-major order over parent states) |

**Example:**

```bash
echo '{
  "network": {
    "nodes": [
      {"name": "Rain", "states": ["yes", "no"]},
      {"name": "Sprinkler", "states": ["on", "off"]},
      {"name": "GrassWet", "states": ["wet", "dry"]}
    ],
    "edges": [
      {"from": "Rain", "to": "GrassWet"},
      {"from": "Sprinkler", "to": "GrassWet"}
    ],
    "cpds": {
      "Rain": {"probabilities": [0.2, 0.8]},
      "Sprinkler": {"probabilities": [0.4, 0.6]},
      "GrassWet": {"probabilities": [0.99, 0.01, 0.9, 0.1, 0.8, 0.2, 0.0, 1.0]}
    }
  },
  "evidence": {"GrassWet": "wet"},
  "query_nodes": ["Rain"]
}' | nxuskit-cli bn infer --input - --format json
```

**Common errors:**

- `Invalid variable name '...': ...` -- Fix: node names must be non-empty alphanumeric identifiers.
- `Failed to set CPD for '...': ...` -- Fix: probability array length must equal the product of the node's state count and all parent nodes' state counts.
- `Invalid BN inference input: missing field "network"` -- Fix: `network` and `query_nodes` are both required.

---

### `pipeline run`

Sequential multi-stage pipeline execution. Accepts YAML or JSON.

**Input schema (`PipelineDefinition`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **yes** | Pipeline name |
| `stages` | array of `Stage` | **yes** | Ordered list of stages to execute |

**`Stage` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **yes** | Stage identifier |
| `type` | string | **yes** | Stage type: `"llm"`, `"clips_eval"`, `"zen_eval"`, `"solver_solve"`, `"bn_infer"` |
| `config` | JSON object | no | Stage-specific configuration (passed to the engine) |
| `output_key` | string | no | Bind stage output to a named key for `{{key}}` interpolation in later stages |

For `llm` stages, `config` accepts `prompt`, `provider`, and `model`.
For `clips_eval` stages, `config` accepts `rules` and `facts`.
For other stage types, `config` mirrors the respective command's input schema.

Stages execute sequentially. Each stage receives the previous stage's output.
String values in `config` support `{{key}}` interpolation from `output_key` bindings.
If a stage fails, all subsequent stages are marked `"skipped"`.

**Example:**

```bash
echo '{
  "name": "demo-pipeline",
  "stages": [
    {
      "name": "generate",
      "type": "llm",
      "config": {"prompt": "Say hello", "provider": "loopback"},
      "output_key": "llm_result"
    },
    {
      "name": "evaluate",
      "type": "llm",
      "config": {"prompt": "Summarize: {{llm_result}}", "provider": "loopback"}
    }
  ]
}' | nxuskit-cli pipeline run --input - --format json
```

**Common errors:**

- `Invalid pipeline definition: ...` -- Fix: ensure input is valid YAML or JSON with `name` and `stages` fields.
- `Unknown stage type: xyz` -- Fix: valid stage types are `llm`, `clips_eval`, `zen_eval`, `solver_solve`, `bn_infer`.
- `PipelineStageFailed { stage: "...", detail: ... }` -- Fix: check the `stages[].result.message` field in the output for the root cause.

---

### `artifact merge`

Deep-merge multiple JSON artifact files with conflict detection.

This command takes multiple `--input` flags (not stdin JSON). Each input must be a
JSON object (not an array or scalar).

**CLI arguments:**

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `--input` | string (repeatable) | **yes** (>= 2) | Paths to JSON files to merge |
| `--merge-strategy` | string | no | Conflict resolution: `"error"` (default), `"first"`, `"last"` |

No JSON input schema -- inputs are arbitrary JSON objects read from files.

**Example:**

```bash
echo '{"a": 1, "b": {"x": 10}}' > /tmp/art1.json
echo '{"b": {"y": 20}, "c": 3}' > /tmp/art2.json

nxuskit-cli artifact merge \
  --input /tmp/art1.json --input /tmp/art2.json \
  --format json
```

**Common errors:**

- `artifact merge requires at least 2 input files` -- Fix: provide at least two `--input` paths.
- `MergeConflict { paths: ["b.x"] }` -- Fix: two files have different values at the same key path. Use `--merge-strategy first` or `--merge-strategy last` to resolve.
- `'...' is not a JSON object` -- Fix: each input file must contain a JSON object (`{...}`), not an array or scalar.

---

### `artifact summarize`

Summarize a JSON artifact's structure and estimated token cost.

**CLI arguments:**

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `--input` | string | **yes** | Path to JSON file or `-` for stdin |

No JSON input schema -- the input is any valid JSON value.

**Output fields:**

| Field | Type | Description |
|-------|------|-------------|
| `field_count` | u32 | Total number of fields (recursive) |
| `top_level_keys` | array of strings | Keys at the root level |
| `estimated_tokens` | u32 | Rough token estimate (byte length / 4) |

**Example:**

```bash
echo '{"name": "test", "data": {"x": 1, "y": 2}}' \
  | nxuskit-cli artifact summarize --input - --format json
```

**Common errors:**

- `Invalid artifact JSON: ...` -- Fix: input must be valid JSON.

---

### `packet validate`

Validate a JSON document against a JSON Schema.

**CLI arguments:**

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `--input` | string | **yes** | Packet data file (JSON) or `-` for stdin |
| `--schema` | string | **yes** | Path to a JSON Schema file |

No custom input schema -- the packet is any JSON value validated against the
provided JSON Schema.

**Example:**

```bash
echo '{"type": "string"}' > /tmp/schema.json
echo '"hello"' | nxuskit-cli packet validate --input - --schema /tmp/schema.json --format json
```

**Output fields:**

| Field | Type | Description |
|-------|------|-------------|
| `valid` | bool | `true` if the packet conforms to the schema |
| `errors` | array of `{path, message, keyword}` | Validation errors (empty when valid) |

**Common errors:**

- `SchemaNotFound { path: "..." }` -- Fix: the `--schema` path must point to an existing file.
- `Invalid JSON Schema: ...` -- Fix: ensure the schema file is a valid JSON Schema draft.
- Exits with code 1 when validation fails (output still written to stdout).

---

### `tool-loop run`

Iterative tool-augmented LLM loop. The model is called repeatedly until it
converges (stops requesting tool calls) or hits `max_iterations`.

**Input schema (`ToolLoopInput`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | **yes** | Initial user prompt |
| `provider` | string | no | Provider name (default: `loopback` or `$NXUSKIT_PROVIDER`) |
| `model` | string | no | Model identifier (default: `"default"`) |
| `max_iterations` | u32 | no | Maximum loop iterations (default: `10`) |
| `tools` | array of strings | no | Tool adapter names: `"file_reader"`, `"calculator"`, `"web_search"` |
| `tool_configs` | JSON object | no | Per-tool configuration |
| `tool_definitions` | array of JSON objects | no | Function/tool schemas passed to the LLM for function calling |

Built-in tool adapters:

- `file_reader` -- reads a file, expects `{"path": "..."}` arguments
- `calculator` -- evaluates a math expression, expects `{"expression": "..."}` arguments
- `web_search` -- searches the web, expects `{"query": "..."}` arguments (MCP-gated)

**Example:**

```bash
echo '{
  "prompt": "What is 2 + 2?",
  "provider": "loopback",
  "tools": ["calculator"],
  "max_iterations": 5
}' | nxuskit-cli tool-loop run --input - --format json
```

**Common errors:**

- `Invalid tool-loop input: missing field "prompt"` -- Fix: `prompt` is the only required field.
- `Unknown tool adapter: xyz` -- Fix: valid adapters are `file_reader`, `calculator`, `web_search`.
- `Entitlement check failed: mcp` -- Fix: the `mcp` tool adapter is Pro-gated.

---

### `judge select`

LLM-based candidate selection. Sends candidates and criteria to an LLM and
parses a structured JSON response with scores and reasoning.

**Input schema (`JudgeSelectInput`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `candidates` | array of `Candidate` | **yes** | Candidates to evaluate |
| `criteria` | string | no | Evaluation criteria description |
| `provider` | string | no | Provider name (default: `"loopback"`) |
| `model` | string | no | Model identifier (default: `"default"`) |

**`Candidate` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | **yes** | Unique candidate identifier |
| `content` | string | **yes** | Candidate text to evaluate |

**Example:**

```bash
echo '{
  "candidates": [
    {"id": "a", "content": "The answer is 42."},
    {"id": "b", "content": "The answer is approximately 42.0."}
  ],
  "criteria": "accuracy and conciseness",
  "provider": "loopback"
}' | nxuskit-cli judge select --input - --format json
```

**Common errors:**

- `Invalid judge select input: missing field "candidates"` -- Fix: `candidates` array is required with at least one entry.
- `Failed to parse judge response as structured JSON: ...` -- Fix: the LLM must return a JSON object with `selected_id`, `reasoning`, and `scores`. The loopback provider may not produce valid judge output; use a real LLM provider for meaningful results.

---

### `branch fork`

Fan out a single prompt to multiple models concurrently.

**Input schema (`BranchForkInput`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | **yes** | Prompt sent to all models |
| `models` | array of strings | **yes** | Model identifiers to invoke in parallel |
| `provider` | string | no | Provider name (default: `"loopback"`) |
| `system` | string | no | System message prepended to each request |

Alternatively, models can be specified via the `--models` CLI flag as a
comma-separated list, which overrides the `models` field in the JSON input.

**Example:**

```bash
echo '{
  "prompt": "Explain recursion in one sentence.",
  "models": ["model-a", "model-b"],
  "provider": "loopback"
}' | nxuskit-cli branch fork --input - --format json
```

**Using `--models` flag:**

```bash
echo '{"prompt": "Explain recursion."}' \
  | nxuskit-cli branch fork --input - --models model-a,model-b --format json
```

**Common errors:**

- `Invalid fork input: missing field "prompt"` -- Fix: `prompt` is required.
- `Invalid fork input: missing field "models"` -- Fix: provide `models` in JSON or via `--models` flag.

---

### `branch compare`

Compare results from a previous `branch fork` invocation. Input is the JSON
output of `branch fork` (the `BranchForkResult` object).

**Input schema (`BranchForkResult`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `results` | array of `BranchModelResult` | **yes** | Results from `branch fork` |

**`BranchModelResult` fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | **yes** | Model identifier |
| `content` | string | **yes** | Model's response text |
| `usage` | `{input_tokens, output_tokens, total_tokens}` | no | Token usage |
| `elapsed_ms` | f64 | **yes** | Response latency in milliseconds |

**Output includes:**

- `comparison`: per-model length and optional quality score
- `diffs`: structural differences (content_length, word_count, sentence_count, elapsed_ms, content_similarity for 2-model comparisons)

**Example (piping fork output to compare):**

```bash
echo '{
  "prompt": "Explain recursion.",
  "models": ["model-a", "model-b"],
  "provider": "loopback"
}' | nxuskit-cli branch fork --input - --format json \
   | jq '.result' \
   | nxuskit-cli branch compare --input - --format json
```

**Common errors:**

- `Invalid fork result input: missing field "results"` -- Fix: input must be a `BranchForkResult` object (the `result` field from a fork envelope, not the full envelope).
