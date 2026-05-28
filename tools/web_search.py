from app.tools.registry import ToolSchema, tool_registry

WEB_SEARCH_SCHEMA = ToolSchema(
    name="web_search",
    description=(
        "Searches the web for current information on a query. "
        "Returns a list of relevant text excerpts with sources."
    ),
    when_to_use=(
        "Use when you need factual, current, or external information. "
        "Use for statistics, definitions, recent events, expert opinions. "
        "Do NOT use for calculations or logical deductions."
    ),
    input_schema={
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query. Be specific. Max 100 chars."
            },
            "num_results": {
                "type": "integer",
                "description": "Number of results to return. Default 5.",
                "default": 5
            }
        },
        "required": ["query"]
    },
    output_description="List of text excerpts with source URLs.",
    is_deterministic=False,
    avg_latency_ms=2000,
)


async def web_search_fn(input: dict) -> str:
    # implementation comes later
    ...


tool_registry.register(WEB_SEARCH_SCHEMA, web_search_fn)