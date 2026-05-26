from tools.registry import ToolSchema, tool_registry

CALCULATOR_SCHEMA = ToolSchema(
    name="calculator",
    description=(
        "Evaluates mathematical expressions and performs numerical computations. "
        "Supports arithmetic, percentages, unit conversions, and basic statistics."
    ),
    when_to_use=(
        "Use when the subproblem requires a numerical answer. "
        "Use for growth rates, ratios, aggregations, or any math. "
        "Do NOT use for subjective or qualitative questions."
    ),
    input_schema={
        "type": "object",
        "properties": {
            "expression": {
                "type": "string",
                "description": "A valid mathematical expression as a string. e.g. '(42 * 1.15) / 100'"
            },
            "context": {
                "type": "string",
                "description": "Optional: describe what you're calculating and why."
            }
        },
        "required": ["expression"]
    },
    output_description="Numerical result with optional explanation.",
    is_deterministic=True,
    avg_latency_ms=10,
)


async def calculator_fn(input: dict) -> str:
    ...


tool_registry.register(CALCULATOR_SCHEMA, calculator_fn)