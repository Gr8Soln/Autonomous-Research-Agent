from datetime import datetime, timezone

from graph.state import ResearchState


async def synthesizer_node(state: ResearchState) -> dict:
    """
    Reads:  topic, objective, subproblems, findings
    Writes: final_report, completed_at, next_action
    """
    # TODO: implement LLM synthesis call
    return {
        "final_report": f"[STUB REPORT] Topic: {state.topic}",
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "next_action": "end",
    }