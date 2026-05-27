# Autonomous Research Agent

> A graph-based autonomous AI research system built with LangGraph, FastAPI, and OpenAI. Accepts a research topic, decomposes it into subproblems, routes tool execution dynamically, evaluates information quality iteratively, and synthesizes a structured report — without human intervention at any step.

---

## What This Is

This is not a chatbot with tools bolted on. It is a **stateful execution graph** where an LLM acts as a control plane — making planning and routing decisions — while deterministic Python orchestrates when, how, and whether to continue executing.

The system is designed around a fundamental architectural principle: **LLMs are unreliable workers but reasonable judges**. The graph exploits this by keeping LLM calls narrow and output-validated, while all state transitions, loop termination, and failure handling are owned by deterministic code.

---

## Architecture

### Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ResearchState (Pydantic)                      │
│         Shared across all nodes — single source of truth         │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │     PLANNER       │  LLM call
                    │                   │  topic → subproblems[]
                    │  - Decomposes     │  - Sets max_iterations
                    │    topic into     │  - Expands objective
                    │    3-6 questions  │
                    └─────────┬─────────┘
                              │ next_action = "select_tool"
                              │
              ┌───────────────▼───────────────┐
              │         TOOL SELECTOR          │  LLM call
              │                               │  subproblem + registry
              │  - Reads tool registry        │  → tool_name + input
              │  - Registry validates name    │
              │  - Input schema validated     │
              └───────────────┬───────────────┘
                              │ next_action = "execute_tool"
                              │
              ┌───────────────▼───────────────┐
              │        TOOL EXECUTOR           │  No LLM
              │                               │  Pure dispatch
              │  - Redis cache check          │
              │  - Tool dispatch              │
              │  - Records ToolCall           │
              │  - Produces ResearchFinding   │
              │  - Increments iterations      │
              └───────────────┬───────────────┘
                              │ next_action = "evaluate"
                              │
              ┌───────────────▼───────────────┐
              │          EVALUATOR             │  LLM call
              │                               │  findings → judgment
              │  ┌────────────────────────┐   │
              │  │  Guard 1: ceiling hit? │   │  Deterministic guards
              │  │  Guard 2: all done?    │   │  run BEFORE LLM
              │  │  Guard 3: no findings? │   │
              │  └────────────────────────┘   │
              │                               │
              │  LLM: confidence score +      │
              │       is_sufficient bool      │
              │                               │
              │  Routing decision (Python):   │
              │  - sufficient → advance/synth │
              │  - insufficient + attempts    │
              │    remain → select_tool       │
              │  - max attempts → best-effort │
              └───────────────┬───────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
    more subproblems    same subproblem    all subproblems
    pending             needs more tools  resolved OR ceiling
           │                  │                  │
           └──────────►  [LOOP] ◄────────────────┘
                              │
                    (when terminal condition)
                              │
                    ┌─────────▼─────────┐
                    │    SYNTHESIZER     │  LLM call
                    │                   │  all findings →
                    │  - Structured      │  structured report
                    │    report output   │
                    │  - Honest about    │
                    │    gaps/failures   │
                    │  - Markdown format │
                    └─────────┬─────────┘
                              │
                           [ END ]
                              │
                    final_report in state
```

### Termination Guarantees

The loop cannot run forever. Every iteration increments `state.iterations` by exactly 1 (Tool Executor). The Evaluator checks `iterations >= max_iterations` before any LLM call. Each subproblem has an independent attempt ceiling (`max_attempts=3`). Both ceilings degrade toward termination on every cycle — provable by inspection of the state machine.

### State Model

All nodes communicate through a single typed state object. No implicit coupling. No side channels.

```
ResearchState
├── topic, objective                    ← input
├── subproblems[]                       ← planning output
│   └── ResearchSubproblem
│       ├── id, question, status
│       ├── confidence, attempts
│       └── findings[]
├── tool_calls[]                        ← execution history
│   └── ToolCall (id, input, output, error, duration_ms)
├── findings[]                          ← interpreted results
│   └── ResearchFinding (content, source, relevance_score)
├── evaluation_history[]                ← evaluator audit log
│   └── EvaluationResult (confidence, reasoning, gaps)
├── iterations, max_iterations          ← loop control
├── sufficient, completion_reason       ← termination signals
├── selected_tool, selected_tool_input  ← selector→executor handoff
├── errors[], has_fatal_error           ← error envelope
├── next_action                         ← routing signal
└── final_report                        ← output
```

---

## Stack

| Layer | Technology | Role |
|---|---|---|
| Graph engine | LangGraph | Stateful execution graph, checkpointing |
| API | FastAPI | Async HTTP, background task execution |
| LLM | OpenAI GPT-4o | Planner, selector, evaluator, synthesizer |
| State validation | Pydantic v2 | Input/output contracts on every LLM call |
| Persistence | PostgreSQL | Run records + LangGraph checkpoint store |
| Cache | Redis | Tool result deduplication |
| Tracing | LangSmith | Full graph trace per run |
| Search | Tavily | Web search tool |

---

## Tools

Three tools registered in the tool registry:

**`web_search`** — Tavily-powered web search. Returns structured excerpts with source URLs. Non-deterministic, cached with 1-hour TTL.

**`calculator`** — Safe mathematical expression evaluator. Explicit allowlist of builtins, no `eval()` on raw LLM strings. Deterministic, cached.

**`reasoning`** — Structured LLM-powered analysis over accumulated findings. Applies `analyze | compare | critique | synthesize | identify_gaps` reasoning modes. Not cached (non-deterministic).

Adding a new tool requires: implementing `async def tool_fn(input: dict) -> str`, defining a `ToolSchema` with description and JSON Schema input spec, and calling `tool_registry.register()`. The Tool Selector discovers it automatically on the next run.

---

## Project Structure

```
autonomous-research-agent/
├── api/
│   ├── routes.py          # POST /research/run, GET /{id}, GET /{id}/stream
│   └── schemas.py         # API-layer Pydantic models (separate from state)
├── db/
│   ├── checkpointer.py    # AsyncPostgresSaver singleton
│   ├── database.py        # Async SQLAlchemy engine
│   ├── models.py          # ResearchRun table
│   ├── run_repository.py  # Run CRUD
│   └── cache.py           # Redis tool result cache
├── graph/
│   ├── engine.py          # StateGraph assembly, routing function
│   ├── state.py           # ResearchState + all sub-models
│   └── nodes/
│       ├── planner.py
│       ├── tool_selector.py
│       ├── tool_executor.py
│       ├── evaluator.py
│       └── synthesizer.py
├── tools/
│   ├── registry.py        # ToolRegistry singleton
│   ├── web_search.py
│   ├── calculator.py
│   └── reasoning.py
├── llm/
│   ├── client.py          # Retry logic, structured output, token tracking
│   └── prompts/           # Prompt templates isolated from node logic
│       ├── planner.py
│       ├── tool_selector.py
│       ├── evaluator.py
│       └── synthesizer.py
├── config.py
├── logging_config.py
├── main.py
├── docker-compose.yml
├── Dockerfile
└── tests/
    ├── test_nodes/
    └── test_graph/
```

---

## API

### Create a research run

```bash
POST /research/run
Content-Type: application/json

{
  "topic": "Impact of LLM coding tools on developer productivity",
  "max_iterations": 10
}
```

Returns `HTTP 202` immediately:

```json
{
  "run_id": "3f8a2c1d-...",
  "status": "queued",
  "message": "Research run enqueued. Poll GET /research/{run_id} for status."
}
```

### Poll for status

```bash
GET /research/{run_id}
```

```json
{
  "run_id": "3f8a2c1d-...",
  "status": "complete",
  "iterations": 7,
  "overall_confidence": 0.81,
  "subproblem_count": 4,
  "completion_reason": "all_subproblems",
  "final_report": "# Research Report: ...",
  "completed_at": "2025-01-15T14:23:07Z"
}
```

Status values: `queued` → `running` → `complete | failed | ceiling_hit`

### Stream progress

```bash
GET /research/{run_id}/stream
```

Server-Sent Events. One event per completed node, replayed from LangGraph checkpoints:

```
data: {"iteration": 3, "next_action": "evaluate", "overall_confidence": 0.61, ...}
data: {"iteration": 4, "next_action": "select_tool", "overall_confidence": 0.61, ...}
data: {"event": "complete", "run_id": "3f8a2c1d-..."}
```

### Inspect checkpoint state

```bash
GET /research/{run_id}/state
```

Returns the raw LangGraph checkpoint — full `ResearchState` at the last node boundary. Intended for debugging.

---

## Running Locally

### Prerequisites

- Docker + Docker Compose
- OpenAI API key
- Tavily API key (free tier available at tavily.com)
- LangSmith API key (optional, for tracing)

### Setup

```bash
git clone https://github.com/your-username/autonomous-ai-systems
cd autonomous-ai-systems/autonomous-research-agent

cp .env.example .env
# Edit .env with your API keys

docker compose up --build
```

### Environment variables

```bash
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...
LANGCHAIN_API_KEY=ls__...          # optional
LANGCHAIN_TRACING_V2=true          # optional
LANGCHAIN_PROJECT=research-agent
DATABASE_URL=postgresql://research_agent:research_agent@postgres:5432/research_agent
REDIS_URL=redis://redis:6379/0
```

### Run a query

```bash
# Create run
curl -X POST http://localhost:8000/research/run \
  -H "Content-Type: application/json" \
  -d '{"topic": "The engineering tradeoffs of vector databases vs traditional search"}'

# Poll (replace with your run_id)
curl http://localhost:8000/research/3f8a2c1d-...

# Stream
curl -N http://localhost:8000/research/3f8a2c1d-.../stream
```

### Run tests

```bash
pip install -r requirements.txt
pytest tests/ -v
```

Tests use mocked LLM calls. No API keys required. No network calls.

---

## Engineering Design Decisions

**Why LangGraph over custom graph execution?**
LangGraph provides first-class cycle support (standard LangChain can't loop without hacks), built-in checkpointing at node boundaries, and the `Send` API for parallel fan-out. The alternative — a hand-rolled executor — would need to reimplement all three.

**Why is `next_action` a state field rather than hardcoded graph edges?**
Routing logic belongs to the Evaluator, not the graph topology. When the Evaluator writes `next_action = "synthesize"`, the graph's single routing function reads it. This means routing behavior can change without touching graph wiring — and all routing decisions are inspectable in state.

**Why does the Evaluator run deterministic guards before the LLM call?**
Iteration ceiling checks, "no findings" guards, and "all subproblems done" checks are deterministic. Burning a token-priced LLM call to discover you've hit your iteration ceiling is wasteful and adds latency. The LLM is only called when human-quality judgment is actually required.

**Why separate `ResearchFinding` from raw `ToolCall` output?**
`ToolCall` records what happened — input, raw output, error, latency. `ResearchFinding` records what was learned — interpreted content, source, relevance. The Evaluator works on findings, not raw tool output. This separation prevents the Evaluator prompt from receiving 3,000 characters of raw HTML-stripped search results.

**Why does `call_llm_structured` feed validation errors back to the LLM?**
Blind retry sends the same prompt and gets the same malformed output. Feeding the Pydantic validation error back as a correction prompt is materially more effective — the LLM knows specifically what was wrong and corrects it. Structured output compliance improves significantly on second attempt with error context.

**Why is the tool executor the only place `iterations` is incremented?**
Because the executor runs exactly once per loop cycle — after selection, before evaluation. This makes `iterations` a reliable loop counter regardless of which tool was selected or whether it succeeded. Any other increment point risks double-counting on retry paths.

---

## Known Limitations

- **Synchronous tool execution within a cycle.** Tools execute sequentially within each iteration. Parallel subproblem execution (LangGraph `Send` API) is the next planned capability.
- **Context window management is simple.** Findings are truncated to 800 chars in the Synthesizer prompt. A production system would implement token-aware truncation with summarization fallback.
- **No document ingestion.** Web search, calculator, and reasoning are the initial tool set. PDF/document tools and a vector retrieval tool are planned.
- **Single-worker background execution.** FastAPI `BackgroundTasks` runs in-process. For high-volume deployments, replace with Celery + Redis queue or equivalent.

---

## Part of

This project is the first system in the [`autonomous-ai-systems`](../README.md) repository — an engineering lab for production-inspired autonomous AI architectures.