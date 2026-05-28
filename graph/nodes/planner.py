from graph.state import ResearchState


async def planner_node(state: ResearchState) -> dict:
    """
    Reads:  topic
    Writes: objective, subproblems, max_iterations, next_action
    """
    # TODO: implement LLM call
    # Stub: return minimal valid state update to prove topology
    return {
        "objective": f"Research objective for: {state.topic}",
        "subproblems": [],
        "max_iterations": 10,
        "next_action": "select_tool",
    }