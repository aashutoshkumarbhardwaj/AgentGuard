"""
Universal AgentGuard MCP Gateway Server.

Serves as an official MCP server sitting between ANY MCP client and
ANY MCP server. Intercepts tools/list to dynamically aggregate tools
from all configured upstream MCP servers, and intercepts tools/call
to enforce the AgentGuard security pipeline.
"""

import os
import sys
import json
import logging
import asyncio
from pathlib import Path
from typing import Optional, List

import anyio
import mcp.types as types
import mcp.server.lowlevel as ll
from mcp.server.stdio import stdio_server

from app.mcp.upstream import UpstreamServerConfig, UpstreamManager
from app.mcp.gateway import handle_mcp_call

logger = logging.getLogger("agentguard.mcp.server")
logging.basicConfig(level=logging.INFO, stream=sys.stderr)


def load_upstream_config(config_path: Optional[str] = None) -> List[UpstreamServerConfig]:
    """
    Loads upstream server configurations from a JSON file or environment variable.
    """
    path = config_path or os.environ.get("MCP_CONFIG_PATH")
    if not path:
        default_path = Path(__file__).resolve().parent.parent.parent / "mcp_servers.json"
        if default_path.exists():
            path = str(default_path)

    if not path or not os.path.exists(path):
        return []

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            servers_data = data.get("servers", [])
            return [UpstreamServerConfig.from_dict(s) for s in servers_data]
    except Exception as e:
        logger.error(f"Failed to load MCP server config from '{path}': {e}")
        return []


def create_gateway_server(upstream_manager: UpstreamManager) -> ll.Server:
    """
    Creates and configures a dynamic low-level MCP Gateway Server.
    """
    server = ll.Server("AgentGuard MCP Gateway")

    async def list_tools_handler(
        ctx, req: types.PaginatedRequestParams
    ) -> types.ListToolsResult:
        """Dynamic tools discovery handler aggregating all upstream tools."""
        tools = upstream_manager.list_all_tools()
        return types.ListToolsResult(tools=tools)

    async def call_tool_handler(
        ctx, req: types.CallToolRequestParams
    ) -> types.CallToolResult:
        """Universal tools proxy handler running AgentGuard security pipeline."""
        return await handle_mcp_call(
            tool_name=req.name,
            arguments=req.arguments or {},
            upstream_manager=upstream_manager,
        )

    server.add_request_handler("tools/list", types.PaginatedRequestParams, list_tools_handler)
    server.add_request_handler("tools/call", types.CallToolRequestParams, call_tool_handler)

    return server


def create_gateway_http_app(upstream_manager: UpstreamManager):
    """
    Creates a Starlette ASGI app exposing the gateway over Streamable HTTP (Phase 10).
    """
    server = create_gateway_server(upstream_manager)
    return server.streamable_http_app()


async def run_stdio(upstream_manager: Optional[UpstreamManager] = None):
    """
    Runs the MCP Gateway server over standard I/O for MCP clients.
    """
    if upstream_manager is None:
        configs = load_upstream_config()
        upstream_manager = UpstreamManager(configs)

    async with upstream_manager:
        server = create_gateway_server(upstream_manager)
        init_options = server.create_initialization_options()

        async with stdio_server() as (read_stream, write_stream):
            logger.info("AgentGuard MCP Gateway listening on stdio...")
            await server.run(read_stream, write_stream, init_options)


if __name__ == "__main__":
    try:
        asyncio.run(run_stdio())
    except (KeyboardInterrupt, anyio.get_cancelled_exc_class()):
        pass
