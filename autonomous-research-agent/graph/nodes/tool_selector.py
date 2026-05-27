from graph.state import ResearchState


async def tool_selector_node(state: ResearchState) -> dict:
    """
    Reads:  current_subproblem, tool_calls, registry schemas
    Writes: selected_tool, selected_tool_input, next_action
    """
    # TODO: implement LLM call with tool schemas
    return {
        "selected_tool": "web_search",
        "selected_tool_input": {"query": "stub query"},
        "next_action": "execute_tool",
    }