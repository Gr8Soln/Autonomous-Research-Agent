export type ProjectStatus = "completed" | "planned";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string[];
  architectureSummary: string[];
  interactions: string[];
  techStack: string[];
  status: ProjectStatus;
  capabilities: string[];
  category: string;
  version?: string;
  links?: { github?: string; article?: string };
}

export const projects: Project[] = [
  {
    slug: "research-agent",
    name: "Autonomous Research Agent",
    tagline: "Multi-step research with verifiable citations.",
    description:
      "Plans, executes, and synthesizes research across the open web. Tool-using LLM loops with reflection, retrieval, and structured report generation.",
    longDescription: [
      "A research agent that decomposes an open-ended question into a plan, executes that plan across web search and retrieval tools, and synthesizes a structured report with citations back to source.",
      "Designed around a tight planner-executor-critic loop: every claim in the final report is traceable to a tool call, and every tool call is replayable from the run trace.",
    ],
    architectureSummary: [
      "Planner decomposes the query into sub-questions",
      "Executor runs web search + fetch + extract tools per sub-question",
      "Reflector scores coverage and proposes follow-ups",
      "Synthesizer composes a cited markdown report",
      "Full trace persisted for inspection and replay",
    ],
    interactions: [
      "Submit a research question and watch the plan unfold",
      "Inspect every tool call, prompt, and intermediate artifact",
      "Read the final report with inline citations",
    ],
    techStack: ["Python", "LLM tool-use", "Web retrieval", "Pydantic"],
    status: "completed",
    capabilities: ["Planner", "Tool use", "Retrieval", "Reflection", "Reports"],
    category: "Research",
    version: "v0.4.1",
  },
  {
    slug: "codebase-intelligence",
    name: "Codebase Intelligence Agent",
    tagline: "Semantic understanding for any repository.",
    description:
      "Indexes a repository into a graph of symbols, dependencies, and intents. Powers semantic search, architecture maps, and contextual code Q&A.",
    longDescription: [
      "Given a repository, the agent builds a layered index: an AST graph of symbols and dependencies, an embeddings layer for semantic search, and a summary layer that explains modules in natural language.",
      "The result is an interactive surface for asking questions about an unfamiliar codebase — where a feature lives, why a module exists, what depends on what.",
    ],
    architectureSummary: [
      "Parser produces an AST + symbol graph",
      "Embeddings index over chunks, symbols, and summaries",
      "Retriever blends graph traversal with vector search",
      "LLM answers with file/line citations",
    ],
    interactions: [
      "Browse the indexed file tree",
      "Read syntax-highlighted code with AI-generated summaries",
      "Ask semantic questions and get cited answers",
    ],
    techStack: ["TypeScript", "AST parsing", "Embeddings", "RAG"],
    status: "completed",
    capabilities: ["AST graph", "Embeddings", "Semantic search", "Code Q&A"],
    category: "Engineering",
    version: "v0.3.0",
  },
  {
    slug: "self-correcting-agent",
    name: "Self-Correcting Agent",
    tagline: "Propose, critique, revise — until it holds.",
    description:
      "An execution loop that proposes outputs, critiques them against constraints, and revises until validation passes. Designed for verifiable workflows.",
    longDescription: [
      "A loop architecture where a generator proposes an output, a critic evaluates it against a set of constraints, and a reviser produces the next attempt informed by the critique.",
      "Targets workflows where correctness is verifiable but generation is unreliable — code, structured data, formal specs.",
    ],
    architectureSummary: [
      "Generator proposes a candidate output",
      "Critic validates against constraints and produces a diff",
      "Reviser incorporates critique into the next attempt",
      "Loop terminates on success or bounded retry",
    ],
    interactions: [
      "Submit a task with verifiable constraints",
      "Watch each propose → critique → revise cycle",
      "Inspect the final accepted output",
    ],
    techStack: ["Python", "Constraint solving", "Structured outputs"],
    status: "planned",
    capabilities: ["Critic loop", "Verification", "Constraint solving"],
    category: "Reasoning",
  },
  {
    slug: "workflow-orchestrator",
    name: "Workflow Orchestrator",
    tagline: "Graph-based orchestration for agent fleets.",
    description:
      "Compose agents and tools into a DAG. Branching, retries, parallelism, and human-in-the-loop checkpoints — all observable.",
    longDescription: [
      "A runtime for composing agents and tools as a directed acyclic graph. Nodes are typed (trigger, agent, tool, branch, checkpoint, output), edges carry typed payloads.",
      "Built to make multi-agent workflows legible and debuggable, not just executable.",
    ],
    architectureSummary: [
      "DAG compiled from a declarative spec",
      "Per-node retry, timeout, and parallelism policies",
      "Branching on structured predicates",
      "Human-in-the-loop checkpoint nodes",
    ],
    interactions: [
      "Browse a sample workflow on a canvas",
      "Inspect node specs and edge payload types",
      "Preview a simulated run",
    ],
    techStack: ["TypeScript", "DAG runtime", "Typed messaging"],
    status: "planned",
    capabilities: ["DAG runtime", "Retries", "Branching", "Checkpoints"],
    category: "Orchestration",
  },
  {
    slug: "ai-observability",
    name: "AI Observability Agent",
    tagline: "Traces, evals, and cost for autonomous runs.",
    description:
      "Captures every LLM call as a trace, links them to runs, and surfaces latency, cost, and eval scores in a single timeline.",
    longDescription: [
      "An observability layer for agentic systems: every LLM call, tool call, and retrieval is a span on a trace, linked back to the parent run and to eval outcomes.",
      "Designed to answer the practical questions — which step regressed, where the cost went, what failed silently.",
    ],
    architectureSummary: [
      "Span-based tracing across LLM and tool calls",
      "Run-level cost and latency aggregation",
      "Pluggable evaluators on top of trace data",
      "Waterfall + facet UI for inspection",
    ],
    interactions: [
      "Browse a trace waterfall for a sample run",
      "Filter by status, span type, or eval score",
      "Inspect cost and latency rollups",
    ],
    techStack: ["TypeScript", "OpenTelemetry", "Span aggregation"],
    status: "planned",
    capabilities: ["Traces", "Evals", "Cost", "Latency"],
    category: "Observability",
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const creator = {
  name: "The Engineer",
  role: "AI Systems Engineer · Backend & Systems",
  bio: "I build autonomous AI systems and write about how they work. This repository is a continuous practice: every system here is built, explained, and exposed interactively so it can be read, understood, and tested live.",
  philosophy:
    "Practical AI engineering over speculative AI products. Architecture you can point at. Loops you can step through. Systems you can run.",
  socials: {
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    medium: "https://medium.com/",
    portfolio: "https://example.com/",
  },
};
