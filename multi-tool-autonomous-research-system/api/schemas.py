from pydantic import BaseModel


class ResearchRequest(BaseModel):
    topic: str
    max_iterations: int = 10


class ResearchResponse(BaseModel):
    run_id: str
    topic: str
    final_report: str | None
    completion_reason: str | None
    iterations: int
    overall_confidence: float
    subproblem_count: int
    error: str | None = None