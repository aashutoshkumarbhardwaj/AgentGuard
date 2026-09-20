"""
Second Mock Upstream MCP Server for Multi-Server Routing Verification (TEST 12).
"""

import sys
import asyncio
from typing import Dict, Any

import mcp.types as types
import mcp.server.lowlevel as ll
from mcp.server.stdio import stdio_server

EXECUTION_COUNTS_TWO: Dict[str, int] = {
    "fetch_metrics": 0,
    "ping": 0,
}


def create_mock_server_two(name: str = "mock-metrics") -> ll.Server:
    server = ll.Server(name)

    async def list_tools(ctx, req: types.PaginatedRequestParams) -> types.ListToolsResult:
        return types.ListToolsResult(
            tools=[
                types.Tool(
                    name="fetch_metrics",
                    description="Fetch performance metrics (read)",
                    input_schema={
                        "type": "object",
                        "properties": {"metric": {"type": "string"}},
                    },
                ),
                types.Tool(
                    name="ping",
                    description="Ping healthcheck",
                    input_schema={
                        "type": "object",
                        "properties": {"msg": {"type": "string"}},
                    },
                ),
            ]
        )

    async def call_tool(ctx, req: types.CallToolRequestParams) -> types.CallToolResult:
        name = req.name
        args = req.arguments or {}

        if name == "fetch_metrics":
            EXECUTION_COUNTS_TWO["fetch_metrics"] += 1
            return types.CallToolResult(
                content=[types.TextContent(type="text", text="cpu_usage: 12%")]
            )
        elif name == "ping":
            EXECUTION_COUNTS_TWO["ping"] += 1
            msg = args.get("msg", "pong")
            return types.CallToolResult(
                content=[types.TextContent(type="text", text=f"pong: {msg}")]
            )
        else:
            return types.CallToolResult(
                content=[types.TextContent(type="text", text=f"Unknown tool: {name}")],
                isError=True,
            )

    server.add_request_handler("tools/list", types.PaginatedRequestParams, list_tools)
    server.add_request_handler("tools/call", types.CallToolRequestParams, call_tool)

    return server


async def main():
    server = create_mock_server_two()
    init_opts = server.create_initialization_options()
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, init_opts)


if __name__ == "__main__":
    asyncio.run(main())
