"""
AgentGuard MCP Management REST API.

Provides endpoints to:
- List MCP servers with safe metadata (never secret values)
- Register a new MCP server (stdio / streamable-http) and connect immediately
- Cleanly disconnect and remove an MCP server
- Reconnect an MCP server and refresh discovered tools
- List all discovered tools namespaced as server_id:tool_name
- List discovered tools for a specific server
"""

import logging
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

from fastapi import APIRouter, Request, HTTPException, status
from app.mcp.upstream import UpstreamServerConfig, UpstreamManager
from app.mcp.mcp_server import save_upstream_config

logger = logging.getLogger("agentguard.api.mcp")

router = APIRouter(prefix="/v1/mcp", tags=["MCP Management"])


def _get_upstream_manager(request: Request) -> UpstreamManager:
    """Helper to retrieve the shared UpstreamManager from app state."""
    manager = getattr(request.app.state, "mcp_upstream", None)
    if manager is None:
        try:
            from app.main import _SHARED_MCP_MANAGER
            manager = _SHARED_MCP_MANAGER
        except ImportError:
            manager = None

    if manager is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AgentGuard MCP Gateway upstream manager is not initialized",
        )
    return manager


class AddServerRequest(BaseModel):
    id: str = Field(..., description="Unique identifier for the server (e.g. 'github')")
    name: Optional[str] = Field(None, description="Human-readable server name")
    transport: str = Field("stdio", description="'stdio' or 'streamable-http'")
    command: Optional[str] = Field(None, description="Command to execute (stdio transport)")
    args: Optional[List[str]] = Field(default_factory=list, description="Arguments for command (stdio)")
    url: Optional[str] = Field(None, description="URL endpoint (streamable-http transport)")
    env: Optional[Dict[str, str]] = Field(
        default_factory=dict,
        description="Environment variable references, e.g. {'KEY': '$ENV_VAR'} (never plaintext secrets)",
    )


@router.get("/servers")
def list_servers(request: Request):
    """
    List all configured MCP servers with safe connection and tool metadata.
    Never returns secret environment variable values.
    """
    mgr = _get_upstream_manager(request)
    servers = mgr.list_servers_metadata()
    return {"servers": servers}


@router.post("/servers", status_code=status.HTTP_201_CREATED)
async def add_server(payload: AddServerRequest, request: Request):
    """
    Add a new MCP server, connect immediately, discover its tools,
    and persist the configuration.
    """
    mgr = _get_upstream_manager(request)
    server_id = payload.id.strip().lower()

    if not server_id:
        raise HTTPException(status_code=400, detail="Server ID cannot be empty.")

    transport = payload.transport.strip().lower()
    if transport not in ("stdio", "streamable-http"):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported transport '{payload.transport}'. Must be 'stdio' or 'streamable-http'.",
        )

    if transport == "stdio" and not payload.command:
        raise HTTPException(status_code=400, detail="Field 'command' is required for stdio transport.")

    if transport == "streamable-http" and not payload.url:
        raise HTTPException(status_code=400, detail="Field 'url' is required for streamable-http transport.")

    cfg = UpstreamServerConfig(
        id=server_id,
        name=payload.name.strip() if payload.name else server_id,
        transport=transport,
        command=payload.command.strip() if payload.command else None,
        args=payload.args or [],
        url=payload.url.strip() if payload.url else None,
        env=payload.env or {},
    )

    try:
        metadata = await mgr.add_server(cfg)
        # Synchronize configuration file
        save_upstream_config(list(mgr.configs.values()))
        return {"server": metadata, "message": f"Successfully connected to '{server_id}'."}
    except Exception as exc:
        logger.error(f"Failed to connect to MCP server '{server_id}': {exc}")
        # Even if connection failed, do not leave corrupted session
        await mgr.disconnect_server(server_id)
        raise HTTPException(
            status_code=400,
            detail=f"Failed to connect to MCP server '{server_id}': {str(exc)}",
        )


@router.delete("/servers/{server_id}")
async def remove_server(server_id: str, request: Request):
    """
    Disconnects cleanly and removes an MCP server from runtime and persistent configuration.
    """
    mgr = _get_upstream_manager(request)
    if server_id not in mgr.configs and server_id not in mgr.sessions:
        raise HTTPException(
            status_code=404,
            detail=f"MCP server '{server_id}' not found.",
        )

    await mgr.remove_server(server_id)
    save_upstream_config(list(mgr.configs.values()))
    return {"status": "removed", "server_id": server_id}


@router.post("/servers/{server_id}/reconnect")
async def reconnect_server(server_id: str, request: Request):
    """
    Reconnect an existing MCP server and refresh its discovered tools.
    """
    mgr = _get_upstream_manager(request)
    if server_id not in mgr.configs:
        raise HTTPException(
            status_code=404,
            detail=f"MCP server '{server_id}' is not configured.",
        )

    try:
        metadata = await mgr.reconnect_server(server_id)
        return {"server": metadata, "message": f"Successfully reconnected to '{server_id}'."}
    except Exception as exc:
        logger.error(f"Failed to reconnect to MCP server '{server_id}': {exc}")
        raise HTTPException(
            status_code=400,
            detail=f"Failed to reconnect to MCP server '{server_id}': {str(exc)}",
        )


@router.get("/tools")
def list_all_tools(request: Request):
    """
    List all discovered tools across all upstream servers.
    Names are namespaced as 'server_id:tool_name'.
    """
    mgr = _get_upstream_manager(request)
    tools = mgr.get_all_tools_metadata()
    return {"tools": tools}


@router.get("/servers/{server_id}/tools")
def list_server_tools(server_id: str, request: Request):
    """
    List discovered tools for a specific server.
    """
    mgr = _get_upstream_manager(request)
    if server_id not in mgr.configs and server_id not in mgr.sessions:
        raise HTTPException(
            status_code=404,
            detail=f"MCP server '{server_id}' not found.",
        )

    tools = mgr.get_server_tools(server_id)
    return {"server_id": server_id, "tools": tools}
