import uuid

from fastapi import APIRouter, HTTPException

from graph.engine import research_graph
from graph.state import ResearchState
from api.schemas import ResearchRequest, ResearchResponse

router = APIRouter(prefix="/research", tags=["research"])


@router.post("/run", response_model=ResearchResponse)
async def run_research(request: ResearchRequest) -> ResearchResponse:
    """
    Executes a full research run synchronously.

    Production note: for long-running topics this will timeout.
    In V2, replace with background task + polling endpoint.
    For now, synchronous is correct for development validation.
    """
    run_id = str(uuid.uuid4())

    initial_state = ResearchState(
        topic=request.topic,
        max_iterations=request.max_iterations,
        run_id=run_id,
    )

    try:
        result = await research_graph.ainvoke(initial_state.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return ResearchResponse(
        run_id=run_id,
        topic=request.topic,
        final_report=result.get("final_report"),
        completion_reason=result.get("completion_reason"),
        iterations=result.get("iterations", 0),
        overall_confidence=result.get("overall_confidence", 0.0),
        subproblem_count=len(result.get("subproblems", [])),
    )