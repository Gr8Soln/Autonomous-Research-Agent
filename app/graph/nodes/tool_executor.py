import uuid

from app.graph.state import ResearchState, ToolCall


async def tool_executor_node(state: ResearchState) -> dict:

    # Deep copy mutable fields before modifying
    # LangGraph's merge is a shallow dict merge —
    # nested list mutation requires explicit copy-and-replace
    updated_tool_calls = list(state.tool_calls)

    new_call = ToolCall(
        id=str(uuid.uuid4()),
        tool_name=state.selected_tool,
        input=state.selected_tool_input or {},
        output="stub output",
    )
    updated_tool_calls.append(new_call)

    return {
        "tool_calls": updated_tool_calls,   # full list replacement, not append
        "iterations": state.iterations + 1,
        "next_action": "evaluate",
    }