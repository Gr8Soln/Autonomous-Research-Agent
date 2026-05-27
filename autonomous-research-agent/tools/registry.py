from __future__ import annotations

from typing import Any, Awaitable, Callable

from pydantic import BaseModel


class ToolSchema(BaseModel):
    """
    The schema the Tool Selector uses to build its LLM prompt
    and validate selected tool input before execution.
    """
    name: str
    description: str                        # LLM-facing: what this tool does
    when_to_use: str                        # LLM-facing: guidance on selection
    input_schema: dict[str, Any]            # JSON Schema for input validation
    output_description: str                 # what the output looks like
    is_deterministic: bool = True           # affects retry strategy
    avg_latency_ms: int | None = None       # informational


# Tool callable signature contract
ToolFn = Callable[[dict[str, Any]], Awaitable[str]]


class RegisteredTool(BaseModel):
    schema: ToolSchema
    fn: ToolFn                              # the actual callable

    class Config:
        arbitrary_types_allowed = True


class ToolRegistry:
    def __init__(self):
        self._tools: dict[str, RegisteredTool] = {}

    def register(self, schema: ToolSchema, fn: ToolFn) -> None:
        if schema.name in self._tools:
            raise ValueError(f"Tool '{schema.name}' is already registered")
        self._tools[schema.name] = RegisteredTool(schema=schema, fn=fn)

    def get(self, name: str) -> RegisteredTool:
        if name not in self._tools:
            raise KeyError(f"Tool '{name}' not found in registry")
        return self._tools[name]

    def all_schemas(self) -> list[ToolSchema]:
        """Used by Tool Selector to build LLM context."""
        return [t.schema for t in self._tools.values()]

    def names(self) -> list[str]:
        return list(self._tools.keys())

    def is_registered(self, name: str) -> bool:
        return name in self._tools


# Singleton — imported by nodes and tool files
tool_registry = ToolRegistry()