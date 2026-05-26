from tools.registry import ToolSchema, tool_registry

REASONING_SCHEMA = ToolSchema(
    name="reasoning",
    description=(
        "Applies structured logical reasoning to synthesize, compare, or analyze "
        "information already gathered. Does not fetch new information."
    ),
    when_to_use=(
        "Use when you have sufficient raw findings and need to draw conclusions, "
        "identify contradictions, compare positions, or form a structured argument. "
        "This is a synthesis tool, not a search tool. "
        "Do NOT use as a substitute for web_search when facts are needed."
    ),
    input_schema={
        "type": "object",
        "properties": {
            "question": {
                "type": "string",
                "description": "The specific question to reason about."
            },
            "context": {
                "type": "string",
                "description": "All relevant findings to reason over. Be comprehensive."
            },
            "reasoning_type": {
                "type": "string",
                "enum": ["analyze", "compare", "critique", "synthesize", "identify_gaps"],
                "description": "The type of reasoning to apply."
            }
        },
        "required": ["question", "context", "reasoning_type"]
    },
    output_description="Structured reasoning output with conclusions and confidence.",
    is_deterministic=False,
    avg_latency_ms=3000,
)


async def reasoning_fn(input: dict) -> str:
    ...


tool_registry.register(REASONING_SCHEMA, reasoning_fn)