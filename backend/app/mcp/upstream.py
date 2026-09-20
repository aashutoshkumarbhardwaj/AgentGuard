"""
Upstream MCP Server Registry and Connection Manager.

Manages connections to arbitrary upstream MCP servers via:
- Local stdio transport (mcp.client.stdio)
- Streamable HTTP transport (mcp.client.streamable_http)
- In-memory transport (for direct testing)

Discovers tools dynamically via tools/list, maintains an in-memory
aggregated registry, and routes tools/call to the correct upstream session.
"""

import os
import re
import json
import logging
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from contextlib import AsyncExitStack

import mcp.types as types
from mcp.client.session import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters
from mcp.client.streamable_http import streamable_http_client

logger = logging.getLogger("agentguard.mcp.upstream")


def resolve_env_vars(env_dict: Dict[str, str]) -> Dict[str, str]:
    """
    Resolves environment variable references like $VAR or ${VAR}
    from os.environ to prevent hardcoding credentials.
    """
    resolved = {}
    pattern = re.compile(r"\$\{([^}]+)\}|\$([a-zA-Z_][a-zA-Z0-9_]*)")

    for key, value in env_dict.items():
        if not isinstance(value, str):
            resolved[key] = str(value)
            continue

        def replace_match(match):
            var_name = match.group(1) or match.group(2)
            return os.environ.get(var_name, "")

        resolved[key] = pattern.sub(replace_match, value)

    return resolved


@dataclass
class UpstreamServerConfig:
    id: str
    name: str
    transport: str  # "stdio" | "streamable-http" | "memory"
    command: Optional[str] = None
    args: List[str] = field(default_factory=list)
    url: Optional[str] = None
    env: Dict[str, str] = field(default_factory=dict)
    # Memory streams for direct test injection
    memory_read_stream: Optional[Any] = None
    memory_write_stream: Optional[Any] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "UpstreamServerConfig":
        return cls(
            id=data["id"],
            name=data.get("name", data["id"]),
            transport=data.get("transport", "stdio"),
            command=data.get("command"),
            args=data.get("args", []),
            url=data.get("url"),
            env=data.get("env", {}),
        )


@dataclass
class DiscoveredTool:
    server_id: str
    original_name: str
    namespaced_name: str
    tool: types.Tool


class UpstreamManager:
    """
    Manages connections to multiple upstream MCP servers, performs
    dynamic tool discovery, and routes tool calls to the appropriate upstream server.
    """

    def __init__(self, configs: List[UpstreamServerConfig]):
        self.configs = {cfg.id: cfg for cfg in configs}
        self.sessions: Dict[str, ClientSession] = {}
        self.discovered_tools: Dict[str, DiscoveredTool] = {}  # namespaced_name -> DiscoveredTool
        self.tools_by_original_name: Dict[str, List[DiscoveredTool]] = {}
        self.exit_stack = AsyncExitStack()
        self._initialized = False

    async def connect_all(self):
        """Connect to all configured upstream servers and discover tools."""
        for server_id, cfg in self.configs.items():
            try:
                await self.connect_server(cfg)
            except Exception as e:
                logger.error(f"Failed to connect to upstream server '{server_id}': {e}")

        self._initialized = True

    async def connect_server(self, cfg: UpstreamServerConfig):
        """Connect to a single upstream server and discover its tools."""
        logger.info(f"Connecting to upstream MCP server '{cfg.id}' via {cfg.transport}...")
        
        if cfg.transport == "stdio":
            if not cfg.command:
                raise ValueError(f"Upstream server '{cfg.id}' missing required 'command'")
            
            # Combine current os.environ with resolved config env
            env_vars = dict(os.environ)
            if cfg.env:
                env_vars.update(resolve_env_vars(cfg.env))
                
            server_params = StdioServerParameters(
                command=cfg.command,
                args=cfg.args,
                env=env_vars,
            )
            read_stream, write_stream = await self.exit_stack.enter_async_context(
                stdio_client(server_params)
            )
            session = await self.exit_stack.enter_async_context(
                ClientSession(read_stream, write_stream)
            )
            await session.initialize()
            self.sessions[cfg.id] = session

        elif cfg.transport == "streamable-http":
            if not cfg.url:
                raise ValueError(f"Upstream server '{cfg.id}' missing required 'url'")
            read_stream, write_stream = await self.exit_stack.enter_async_context(
                streamable_http_client(cfg.url)
            )
            session = await self.exit_stack.enter_async_context(
                ClientSession(read_stream, write_stream)
            )
            await session.initialize()
            self.sessions[cfg.id] = session

        elif cfg.transport == "memory":
            if not cfg.memory_read_stream or not cfg.memory_write_stream:
                raise ValueError(f"Upstream server '{cfg.id}' missing memory streams")
            session = await self.exit_stack.enter_async_context(
                ClientSession(cfg.memory_read_stream, cfg.memory_write_stream)
            )
            await session.initialize()
            self.sessions[cfg.id] = session

        else:
            raise ValueError(f"Unsupported transport '{cfg.transport}' for server '{cfg.id}'")

        # Discover tools
        await self.discover_tools_for_server(cfg.id)

    async def discover_tools_for_server(self, server_id: str):
        """Calls tools/list on the upstream session and registers tools."""
        session = self.sessions.get(server_id)
        if not session:
            return

        result = await session.list_tools()
        for t in result.tools:
            namespaced_name = f"{server_id}:{t.name}"
            # Create the exposed tool definition (mcp 2.2.0 uses input_schema)
            tool_schema = getattr(t, "input_schema", getattr(t, "inputSchema", None))
            exposed_tool = types.Tool(
                name=namespaced_name,
                description=t.description or f"Tool {t.name} from {server_id}",
                input_schema=tool_schema,
            )
            dt = DiscoveredTool(
                server_id=server_id,
                original_name=t.name,
                namespaced_name=namespaced_name,
                tool=exposed_tool,
            )
            self.discovered_tools[namespaced_name] = dt
            if t.name not in self.tools_by_original_name:
                self.tools_by_original_name[t.name] = []
            self.tools_by_original_name[t.name].append(dt)
            logger.info(f"Discovered tool: {namespaced_name} (original: {t.name})")

    def list_all_tools(self) -> List[types.Tool]:
        """Returns all aggregated tools for tools/list response."""
        return [dt.tool for dt in self.discovered_tools.values()]

    def resolve_tool(self, tool_name: str) -> Optional[DiscoveredTool]:
        """
        Resolves a tool name from a client call.
        Supports both namespaced ('github:create_issue') and original ('create_issue')
        if the original name is unambiguous.
        """
        # Exact namespaced match
        if tool_name in self.discovered_tools:
            return self.discovered_tools[tool_name]

        # Check by original name
        matches = self.tools_by_original_name.get(tool_name, [])
        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            logger.warning(
                f"Ambiguous tool name '{tool_name}' matches multiple servers: "
                f"{[m.namespaced_name for m in matches]}. Please use namespaced name."
            )
            # Default to first match if ambiguous
            return matches[0]

        return None

    async def call_upstream_tool(
        self, server_id: str, original_tool_name: str, arguments: Dict[str, Any]
    ) -> types.CallToolResult:
        """Forwards call_tool to the upstream server session."""
        session = self.sessions.get(server_id)
        if not session:
            raise RuntimeError(f"Upstream server '{server_id}' is not connected.")

        return await session.call_tool(original_tool_name, arguments=arguments)

    async def close(self):
        """Close all upstream sessions and transports."""
        await self.exit_stack.aclose()
        self.sessions.clear()
        self.discovered_tools.clear()
        self.tools_by_original_name.clear()
        self._initialized = False

    async def __aenter__(self):
        await self.connect_all()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()
