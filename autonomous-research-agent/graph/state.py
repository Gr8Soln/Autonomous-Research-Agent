from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, Field

# ----- ----- ----- ----- -----
# Enums / Literals
# ----- ----- ----- ----- -----

SubproblemStatus = Literal["pending", "in_progress", "complete", "failed", "skipped"]

NextAction = Literal[
    "plan",
    "select_tool",
    "execute_tool",
    "evaluate",
    "synthesize",
    "end",
    "error",
]

CompletionReason = Literal[
    "sufficient",        # evaluator determined research is complete
    "ceiling_hit",       # max_iterations reached
    "all_subproblems",   # all subproblems marked complete
    "error",             # unrecoverable failure
]


# ----- ----- ----- ----- -----
# Sub-models
# ----- ----- ----- ----- -----

class ToolCall(BaseModel):
    id: str                          # uuid, for deduplication
    tool_name: str
    input: dict[str, Any]
    output: str | None = None
    error: str | None = None
    duration_ms: int | None = None
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    @property
    def succeeded(self) -> bool:
        return self.error is None and self.output is not None


class ResearchFinding(BaseModel):
    """
    Structured finding from a tool call.
    Separating raw tool output from interpreted findings is intentional —
    the Evaluator works on findings, not raw strings.
    """
    subproblem_id: str
    tool_call_id: str               # FK to ToolCall.id
    content: str                    # interpreted/extracted content
    source: str | None = None       # URL, tool name, etc.
    relevance_score: float = 0.0    # Evaluator writes this; 0.0-1.0
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class ResearchSubproblem(BaseModel):
    id: str                          # deterministic: f"sp_{index}"
    question: str                    # the decomposed research question
    status: SubproblemStatus = "pending"
    findings: list[ResearchFinding] = Field(default_factory=list)
    confidence: float = 0.0          # Evaluator writes this per-subproblem
    attempts: int = 0                # tool execution attempts on this subproblem
    max_attempts: int = 3            # per-subproblem hard ceiling

    @property
    def is_researchable(self) -> bool:
        return self.status in ("pending", "in_progress")

    @property
    def finding_count(self) -> int:
        return len(self.findings)


class EvaluationResult(BaseModel):
    """
    Each Evaluator pass produces one of these.
    Keeping history lets you debug why the loop ran N times.
    """
    iteration: int
    subproblem_id: str
    confidence: float
    reasoning: str                   # LLM's justification — critical for debugging
    recommended_action: NextAction
    gaps_identified: list[str] = Field(default_factory=list)


class GraphError(BaseModel):
    node: str
    error_type: str
    message: str
    recoverable: bool
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


# ----- ----- ----- ----- -----
# Root State
# ----- ----- ----- ----- -----

class ResearchState(BaseModel):

    # ----- Input ------------------------------
    topic: str
    objective: str = ""              # Planner expands this from topic

    # ----- Planning -------------------------
    subproblems: list[ResearchSubproblem] = Field(default_factory=list)
    current_subproblem_index: int = 0

    # ----- Execution --------------------
    tool_calls: list[ToolCall] = Field(default_factory=list)
    findings: list[ResearchFinding] = Field(default_factory=list)
    iterations: int = 0
    max_iterations: int = 10

    # ----- Evaluation --------------------
    evaluation_history: list[EvaluationResult] = Field(default_factory=list)
    overall_confidence: float = 0.0
    sufficient: bool = False
    completion_reason: CompletionReason | None = None

    # ----- Routing -------------------------
    next_action: NextAction = "plan"
    selected_tool: str | None = None      # Tool Selector writes, Executor reads
    selected_tool_input: dict | None = None

    # ----- Error Handling --------------------
    errors: list[GraphError] = Field(default_factory=list)
    has_fatal_error: bool = False

    # ----- Output ------------------------------
    final_report: str | None = None

    # ----- Metadata -------------------------
    run_id: str = ""
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    completed_at: str | None = None

    # ----- Derived helpers (not persisted) -----
    @property
    def current_subproblem(self) -> ResearchSubproblem | None:
        if self.current_subproblem_index < len(self.subproblems):
            return self.subproblems[self.current_subproblem_index]
        return None

    @property
    def all_subproblems_done(self) -> bool:
        return all(
            sp.status in ("complete", "failed", "skipped")
            for sp in self.subproblems
        )

    @property
    def tool_call_ids_used(self) -> set[str]:
        return {tc.tool_name for tc in self.tool_calls}