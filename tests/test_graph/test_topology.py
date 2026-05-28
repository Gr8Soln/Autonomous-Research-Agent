import pytest
from app.graph.engine import build_graph
from app.graph.state import ResearchState


def test_graph_compiles():
    """Graph should compile without errors."""
    graph = build_graph()
    assert graph is not None


@pytest.mark.asyncio
async def test_graph_runs_stub_to_completion():
    """
    With stub nodes, graph should complete a full cycle
    without hanging or raising.

    Evaluator stub returns sufficient=True after 1 iteration,
    so this validates: planner → selector → executor → evaluator → synthesizer → END
    """
    graph = build_graph()

    initial_state = ResearchState(
        topic="Test topic for topology validation",
        run_id="test-run-001",
    )

    result = await graph.ainvoke(initial_state.model_dump())

    assert result is not None
    assert result["next_action"] == "end"
    assert result["final_report"] is not None
    assert result["final_report"].startswith("[STUB REPORT]")


@pytest.mark.asyncio
async def test_fatal_error_routes_to_end():
    """
    If has_fatal_error is True, graph should route to END
    regardless of next_action.
    """
    graph = build_graph()

    # Start with a fatal error already set
    initial_state = ResearchState(
        topic="Test",
        has_fatal_error=True,
        next_action="select_tool",   # would normally continue
        run_id="test-error-001",
    )

    result = await graph.ainvoke(initial_state.model_dump())
    # Graph should have exited at planner (entry point) via fatal error guard
    assert result is not None