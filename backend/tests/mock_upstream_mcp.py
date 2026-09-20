"""
Deterministic Mock Upstream MCP Server for Gateway Verification.

Exposes tools:
- get_item
- create_item
- delete_item
- execute_command
- secret_export

Tracks execution counts so tests can verify whether the upstream tool
was actually executed or properly blocked by AgentGuard.
"""

import sys
import asyncio
from typing import Dict, Any

import mcp.types as types
import mcp.server.lowlevel as ll
from mcp.server.stdio import stdio_server

# Global execution counter for verification
EXECUTION_COUNTS: Dict[str, int] = {
    "get_item": 0,
    "create_item": 0,
    "delete_item": 0,
    "execute_command": 0,
    "secret_export": 0,
}


def reset_counts():
    for k in EXECUTION_COUNTS:
        EXECUTION_COUNTS[k] = 0


def create_mock_server(name: str = "mock-upstream") -> ll.Server:
    server = ll.Server(name)

    async def list_tools(ctx, req: types.PaginatedRequestParams) -> types.ListToolsResult:
        return types.ListToolsResult(
            tools=[
                types.Tool(
                    name="get_item",
                    description="Retrieve an item by ID (safe read operation)",
                    input_schema={
                        "type": "object",
                        "properties": {
                            "item_id": {"type": "string", "description": "The item identifier"}
                        },
                        "required": ["item_id"],
                    },
                ),
                types.Tool(
                    name="create_item",
                    description="Create a new item (state modifying operation)",
                    input_schema={
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "content": {"type": "string"},
                        },
                        "required": ["name"],
                    },
                ),
                types.Tool(
                    name="delete_item",
                    description="Delete an existing item (destructive delete operation)",
                    input_schema={
                        "type": "object",
                        "properties": {
                            "item_id": {"type": "string"}
                        },
                        "required": ["item_id"],
                    },
                ),
                types.Tool(
                    name="execute_command",
                    description="Execute a system command (system execution)",
                    input_schema={
                        "type": "object",
                        "properties": {
                            "command": {"type": "string"}
                        },
                        "required": ["command"],
                    },
                ),
                types.Tool(
                    name="secret_export",
                    description="Export sensitive credentials and secrets",
                    input_schema={
                        "type": "object",
                        "properties": {
                            "secret_type": {"type": "string"}
                        },
                        "required": ["secret_type"],
                    },
                ),
            ]
        )

    async def call_tool(ctx, req: types.CallToolRequestParams) -> types.CallToolResult:
        name = req.name
        args = req.arguments or {}

        if name == "get_item":
            EXECUTION_COUNTS["get_item"] += 1
            item_id = args.get("item_id", "default")
            return types.CallToolResult(
                content=[types.TextContent(type="text", text=f"Item {item_id}: Value = 42, Status = Active")]
            )

        elif name == "create_item":
            EXECUTION_COUNTS["create_item"] += 1
            item_name = args.get("name", "untitled")
            return types.CallToolResult(
                content=[types.TextContent(type="text", text=f"Item '{item_name}' successfully created.")]
            )

        elif name == "delete_item":
            EXECUTION_COUNTS["delete_item"] += 1
            item_id = args.get("item_id", "unknown")
            return types.CallToolResult(
                content=[types.TextContent(type="text", text=f"Item '{item_id}' deleted.")]
            )

        elif name == "execute_command":
            EXECUTION_COUNTS["execute_command"] += 1
            cmd = args.get("command", "")
            return types.CallToolResult(
                content=[types.TextContent(type="text", text=f"Command '{cmd}' executed successfully.")]
            )

        elif name == "secret_export":
            EXECUTION_COUNTS["secret_export"] += 1
            return types.CallToolResult(
                content=[types.TextContent(type="text", text="EXPORTED_SECRET_API_KEY_xyz123")]
            )

        else:
            return types.CallToolResult(
                content=[types.TextContent(type="text", text=f"Unknown mock tool: {name}")],
                isError=True,
            )

    server.add_request_handler("tools/list", types.PaginatedRequestParams, list_tools)
    server.add_request_handler("tools/call", types.CallToolRequestParams, call_tool)

    return server


async def main():
    server = create_mock_server()
    init_opts = server.create_initialization_options()
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, init_opts)


if __name__ == "__main__":
    asyncio.run(main())
