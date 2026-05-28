from graph.state import ResearchState


async def evaluator_node(state: ResearchState) -> dict:
    """
    Reads:  current_subproblem, findings, iterations, max_iterations
    Writes: evaluation_history, overall_confidence, sufficient,
            next_action, completion_reason
    """
    # TODO: implement LLM evaluation + routing decision

    # Stub: force termination after 1 iteration so topology test completes
    return {
        "sufficient": True,
        "overall_confidence": 0.0,
        "completion_reason": "sufficient",
        "next_action": "synthesize",
    }