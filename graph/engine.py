from langgraph.graph import END, StateGraph

from graph.nodes.evaluator import evaluator_node
from graph.nodes.planner import planner_node
from graph.nodes.synthesizer import synthesizer_node
from graph.nodes.tool_executor import tool_executor_node
from graph.nodes.tool_selector import tool_selector_node
from graph.state import ResearchState

# ─────────────────────────────────────────────
# Routing Function
# ─────────────────────────────────────────────

def route_from_state(state: ResearchState) -> str:
    """
    Reads state.next_action and returns the next node name.
    This is the ONLY routing function. All conditional edges use it.

    WHY a single function: makes routing auditable. If your agent
    makes unexpected jumps, you have one place to add logging/tracing.
    """
    if state.has_fatal_error:
        return END

    routing_map = {
        "plan":         "planner",
        "select_tool":  "tool_selector",
        "execute_tool": "tool_executor",
        "evaluate":     "evaluator",
        "synthesize":   "synthesizer",
        "end":          END,
        "error":        END,
    }

    action = state.next_action
    destination = routing_map.get(action)

    if destination is None:
        # Unknown action — fail safe to END
        # In production: log this as an anomaly event
        return END

    return destination


# ─────────────────────────────────────────────
# Graph Factory
# ─────────────────────────────────────────────

def build_graph() -> StateGraph:
    """
    Constructs and compiles the research agent graph.

    Returns a compiled graph ready for invocation.
    Call this once at application startup, not per-request.
    """

    graph = StateGraph(ResearchState)

    # ── Register Nodes ────────────────────────
    # Node names must match routing_map keys exactly.
    graph.add_node("planner",       planner_node)
    graph.add_node("tool_selector", tool_selector_node)
    graph.add_node("tool_executor", tool_executor_node)
    graph.add_node("evaluator",     evaluator_node)
    graph.add_node("synthesizer",   synthesizer_node)

    # ── Entry Point ───────────────────────────
    # Every graph run starts here. The initial state
    # has next_action="plan", so this is consistent —
    # but the entry point is a hard topology constraint,
    # not derived from state.
    graph.set_entry_point("planner")

    # ── Edges ─────────────────────────────────
    #
    # All edges are conditional — they all read next_action
    # from state via route_from_state.
    #
    # WHY not use add_edge() for fixed edges?
    # Because even "fixed" transitions (executor always goes
    # to evaluator) should go through the routing function.
    # This keeps the error path (has_fatal_error) universally
    # respected without adding guards to every edge.

    graph.add_conditional_edges("planner",       route_from_state)
    graph.add_conditional_edges("tool_selector", route_from_state)
    graph.add_conditional_edges("tool_executor", route_from_state)
    graph.add_conditional_edges("evaluator",     route_from_state)
    graph.add_conditional_edges("synthesizer",   route_from_state)

    return graph.compile()


# ─────────────────────────────────────────────
# Application-level singleton
# ─────────────────────────────────────────────

# Compiled once at import time — not per request.
# This object is stateless: all state lives in the
# ResearchState passed to .invoke() or .ainvoke()
research_graph = build_graph()