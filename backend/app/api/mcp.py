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

import os
import sys
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

from fastapi import APIRouter, Request, HTTPException, status
from app.mcp.upstream import UpstreamServerConfig, UpstreamManager
from app.mcp.mcp_server import save_upstream_config
from app.mcp.gateway import authorize_mcp_tool_call
from app.mcp.classifier import classify_tool_action
from app.core.audit import record_event
from app.core.approvals import create_approval
from app.decision import get_decision_engine, Decision

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


@router.post("/servers/demo")
async def add_demo_server(request: Request):
    """
    Connects the built-in deterministic Demo MCP server for local testing.
    Discovers 5 tools: get_item, create_item, delete_item, execute_command, secret_export.
    """
    mgr = _get_upstream_manager(request)
    backend_root = Path(__file__).resolve().parent.parent.parent
    server_id = "demo-mcp"

    if server_id in mgr.configs or server_id in mgr.sessions:
        await mgr.remove_server(server_id)

    cfg = UpstreamServerConfig(
        id=server_id,
        name="Demo MCP",
        transport="stdio",
        command=sys.executable,
        args=["-m", "tests.mock_upstream_mcp"],
        env={"PYTHONPATH": str(backend_root)},
    )
    metadata = await mgr.add_server(cfg)
    save_upstream_config(list(mgr.configs.values()))
    return {"server": metadata, "message": "Demo MCP connected successfully with 5 discovered tools."}


class PlaygroundToolCallRequest(BaseModel):
    arguments: Dict[str, Any] = Field(default_factory=dict, description="Arguments to pass to the MCP tool")
    agent_id: Optional[str] = Field("research-agent", description="Calling agent identifier")
    user_id: Optional[str] = Field("user123", description="User identifier")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Optional security context")


class GenericToolCallRequest(BaseModel):
    server_id: str = Field(..., description="Target MCP server ID")
    tool_name: str = Field(..., description="Target tool name")
    arguments: Dict[str, Any] = Field(default_factory=dict, description="Arguments to pass to the MCP tool")
    agent_id: Optional[str] = Field("research-agent", description="Calling agent identifier")
    user_id: Optional[str] = Field("user123", description="User identifier")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Optional security context")


async def _execute_mcp_tool_through_gateway(
    request: Request,
    server_id: str,
    tool_name: str,
    arguments: Dict[str, Any],
    agent_id: str = "research-agent",
    user_id: str = "user123",
    context: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    mgr = _get_upstream_manager(request)

    if server_id not in mgr.configs and server_id not in mgr.sessions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"MCP server '{server_id}' not found.",
        )

    if server_id not in mgr.sessions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"MCP server '{server_id}' is disconnected. Please reconnect first.",
        )

    # Resolve tool from this server
    server_tools = mgr.get_server_tools(server_id)
    matching_tool = None
    for t in server_tools:
        t_name = t.get("name")
        t_orig = t.get("original_name")
        if t_name == tool_name or t_orig == tool_name or t_name == f"{server_id}:{tool_name}":
            matching_tool = t
            break

    if not matching_tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tool '{tool_name}' not found on MCP server '{server_id}'.",
        )

    original_tool_name = matching_tool.get("original_name", tool_name)
    tool_desc = matching_tool.get("description", "")
    tool_schema = matching_tool.get("input_schema")

    args = dict(arguments or {})
    ctx = dict(context or {})
    if "environment" not in ctx:
        ctx["environment"] = os.environ.get("AGENTGUARD_ENV", "development")
    if "destination" not in ctx:
        ctx["destination"] = "internal"

    # Evaluate action through existing AgentGuard security pipeline
    decision = authorize_mcp_tool_call(
        agent_id=agent_id,
        user_id=user_id,
        tool=original_tool_name,
        arguments=args,
        context=ctx,
        tool_description=tool_desc,
        tool_schema=tool_schema,
    )

    domain, op, _ = classify_tool_action(original_tool_name, tool_desc, tool_schema, args, ctx)

    engine_state = {
        "tool": original_tool_name,
        "action": op,
        "domain": domain,
        "risk_score": decision.get("risk_score", 20),
        "risk_level": decision.get("risk_level", "LOW"),
        "source": "mcp",
        "external": ctx.get("destination") == "external",
        "sensitive_data": bool(decision.get("bedrock", {}).get("guardrail_triggered", False)),
        "policy": decision.get("policy_id", "ALLOW"),
        "agent": agent_id,
        "arguments": args,
    }

    # CRITICAL SECURITY RULE: Jev / Decision Engine must NEVER override a hard security policy.
    # If Cedar / Permissions / Threat Scanner returned BLOCK, the action is immediately blocked.
    if decision["decision"] == "BLOCK":
        engine_res = await get_decision_engine().evaluate(engine_state)
        engine_data = engine_res.model_dump()
        engine_data["hard_policy_enforced"] = True

        record_event(
            agent_id=agent_id,
            user_id=user_id,
            tool=domain,
            action=op,
            decision="BLOCK",
            risk_level=decision.get("risk_level", "CRITICAL"),
            risk_score=decision.get("risk_score", 100),
            policy_id=decision.get("policy_id", "AGENT_PERMISSION_001"),
            reason=decision.get("reason", "Action blocked by security policy"),
            factors=decision.get("factors", []),
            bedrock=decision.get("bedrock", {}),
            decision_engine=engine_data,
        )

        return {
            "decision": "BLOCK",
            "risk_score": decision.get("risk_score", 100),
            "risk_level": decision.get("risk_level", "CRITICAL"),
            "policy_id": decision.get("policy_id", "AGENT_PERMISSION_001"),
            "reason": decision.get("reason", "Action blocked by security policy"),
            "factors": decision.get("factors", []),
            "status": "BLOCKED",
            "upstream_called": False,
            "approval_id": None,
            "result": None,
            "server_id": server_id,
            "tool_name": original_tool_name,
            "decision_engine": engine_data,
        }

    # Intelligence Layer: Evaluate through Provider Chain (TypeSafe Jev -> OpenJev -> Deterministic)
    engine_res = await get_decision_engine().evaluate(engine_state)
    engine_data = engine_res.model_dump()

    # Determine effective decision:
    # 1. Existing APPROVE policy cannot be downgraded to ALLOW by AI.
    # 2. AI can escalate ALLOW -> APPROVE (due to uncertainty/risk) or -> BLOCK.
    # 3. AI can escalate APPROVE -> BLOCK.
    if decision["decision"] == "APPROVE":
        if engine_res.decision == Decision.BLOCK:
            effective_decision = "BLOCK"
        else:
            effective_decision = "APPROVE"
    else:
        effective_decision = engine_res.decision.value

    # Handle BLOCK: Upstream is NEVER called
    if effective_decision == "BLOCK":
        record_event(
            agent_id=agent_id,
            user_id=user_id,
            tool=domain,
            action=op,
            decision="BLOCK",
            risk_level="CRITICAL",
            risk_score=max(decision.get("risk_score", 100), 85),
            policy_id=decision.get("policy_id", "DECISION_ENGINE_BLOCK"),
            reason=f"Blocked by {engine_res.provider.upper()} decision intelligence",
            factors=decision.get("factors", []),
            bedrock=decision.get("bedrock", {}),
            decision_engine=engine_data,
        )
        return {
            "decision": "BLOCK",
            "risk_score": max(decision.get("risk_score", 100), 85),
            "risk_level": "CRITICAL",
            "policy_id": decision.get("policy_id", "DECISION_ENGINE_BLOCK"),
            "reason": f"Blocked by {engine_res.provider.upper()} decision intelligence",
            "factors": decision.get("factors", []),
            "status": "BLOCKED",
            "upstream_called": False,
            "approval_id": None,
            "result": None,
            "server_id": server_id,
            "tool_name": original_tool_name,
            "decision_engine": engine_data,
        }

    # Handle APPROVE: Create real pending approval, upstream NOT called yet
    if effective_decision == "APPROVE":
        approval = create_approval(
            request_data={
                "agent_id": agent_id,
                "user_id": user_id,
                "tool": domain,
                "action": op,
                "original_tool": original_tool_name,
                "server_id": server_id,
                "arguments": args,
                "context": ctx,
                "resource": ctx.get("resource", original_tool_name),
                "decision_engine": engine_data,
            },
            decision=decision,
        )
        record_event(
            agent_id=agent_id,
            user_id=user_id,
            tool=domain,
            action=op,
            decision="APPROVE",
            risk_level=decision.get("risk_level", "HIGH"),
            risk_score=decision.get("risk_score", 70),
            policy_id=decision.get("policy_id", "FILE_MODIFY_001"),
            reason=decision.get("reason", "Action requires human approval"),
            factors=decision.get("factors", []),
            bedrock=decision.get("bedrock", {}),
            decision_engine=engine_data,
        )
        return {
            "decision": "APPROVE",
            "risk_score": decision.get("risk_score", 70),
            "risk_level": decision.get("risk_level", "HIGH"),
            "policy_id": decision.get("policy_id", "FILE_MODIFY_001"),
            "reason": decision.get("reason", "Action requires human approval"),
            "factors": decision.get("factors", []),
            "status": "PENDING_APPROVAL",
            "upstream_called": False,
            "approval_id": approval["id"],
            "result": None,
            "server_id": server_id,
            "tool_name": original_tool_name,
            "decision_engine": engine_data,
        }

    # Handle ALLOW: Forward to upstream MCP server ONLY
    upstream_args = dict(args)
    if tool_schema and isinstance(tool_schema, dict) and "properties" in tool_schema:
        allowed_props = set(tool_schema["properties"].keys())
        upstream_args = {k: v for k, v in upstream_args.items() if k in allowed_props}

    try:
        upstream_res = await mgr.call_upstream_tool(
            server_id=server_id,
            original_tool_name=original_tool_name,
            arguments=upstream_args,
        )
        res_text = ""
        if hasattr(upstream_res, "content"):
            lines = []
            for c in upstream_res.content:
                if hasattr(c, "text"):
                    lines.append(c.text)
                elif isinstance(c, dict) and "text" in c:
                    lines.append(c["text"])
                else:
                    lines.append(str(c))
            res_text = "\n".join(lines)
        else:
            res_text = str(upstream_res)

        record_event(
            agent_id=agent_id,
            user_id=user_id,
            tool=domain,
            action=op,
            decision="ALLOW",
            risk_level=decision.get("risk_level", "LOW"),
            risk_score=decision.get("risk_score", 20),
            policy_id=decision.get("policy_id", "FILE_READ_001"),
            reason=decision.get("reason", "Action permitted by policy"),
            factors=decision.get("factors", []),
            bedrock=decision.get("bedrock", {}),
            decision_engine=engine_data,
        )

        return {
            "decision": "ALLOW",
            "risk_score": decision.get("risk_score", 20),
            "risk_level": decision.get("risk_level", "LOW"),
            "policy_id": decision.get("policy_id", "FILE_READ_001"),
            "reason": decision.get("reason", "Action permitted by policy"),
            "factors": decision.get("factors", []),
            "status": "EXECUTED",
            "upstream_called": True,
            "approval_id": None,
            "result": res_text,
            "server_id": server_id,
            "tool_name": original_tool_name,
            "decision_engine": engine_data,
        }
    except Exception as exc:
        logger.error(f"Error executing tool '{original_tool_name}' on server '{server_id}': {exc}")
        return {
            "decision": "ALLOW",
            "risk_score": decision.get("risk_score", 20),
            "risk_level": decision.get("risk_level", "LOW"),
            "policy_id": decision.get("policy_id", "FILE_READ_001"),
            "reason": f"Execution error on upstream server: {exc}",
            "factors": decision.get("factors", []),
            "status": "ERROR",
            "upstream_called": True,
            "approval_id": None,
            "result": str(exc),
            "server_id": server_id,
            "tool_name": original_tool_name,
            "decision_engine": engine_data,
        }


@router.post("/servers/{server_id}/tools/{tool_name}/call")
async def call_server_tool(
    server_id: str,
    tool_name: str,
    payload: PlaygroundToolCallRequest,
    request: Request,
):
    """
    Playground and Gateway Execution Endpoint:
    Invokes an MCP tool call strictly through the AgentGuard security boundary.
    Executes upstream ONLY when allowed.
    """
    return await _execute_mcp_tool_through_gateway(
        request=request,
        server_id=server_id,
        tool_name=tool_name,
        arguments=payload.arguments,
        agent_id=payload.agent_id or "research-agent",
        user_id=payload.user_id or "user123",
        context=payload.context,
    )


@router.post("/call")
async def call_tool_generic(
    payload: GenericToolCallRequest,
    request: Request,
):
    """
    Generic MCP tool call endpoint through AgentGuard security boundary.
    """
    return await _execute_mcp_tool_through_gateway(
        request=request,
        server_id=payload.server_id,
        tool_name=payload.tool_name,
        arguments=payload.arguments,
        agent_id=payload.agent_id or "research-agent",
        user_id=payload.user_id or "user123",
        context=payload.context,
    )
