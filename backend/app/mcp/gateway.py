"""
Universal AgentGuard MCP Gateway.

Intercepts every MCP tools/call request, normalizes it into the
AgentGuard action model, evaluates it through the security pipeline
(Cedar authorization, Bedrock guardrails, risk engine, threat detection,
sensitive data classifier), handles approvals and fail-closed policies,
and forwards ONLY allowed requests to upstream MCP servers.
"""

import os
import sys
import json
import logging
from typing import Dict, Any, Optional, Tuple

import httpx
import mcp.types as types

from app.core.guard import evaluate_action
from app.core.audit import record_event
from app.core.approvals import create_approval
from app.mcp.classifier import classify_tool_action

logger = logging.getLogger("agentguard.mcp.gateway")


def authorize_mcp_tool_call(
    agent_id: str,
    user_id: str,
    tool: str,
    arguments: Dict[str, Any],
    context: Dict[str, Any] | None = None,
    tool_description: str = "",
    tool_schema: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    """
    AgentGuard security boundary for MCP tool calls.
    Supports in-process evaluation and remote backend API mode via AGENTGUARD_URL.
    """
    context = dict(context or {})
    tool_arguments = dict(arguments)

    # Allow explicit override from arguments if supplied
    operation = tool_arguments.pop("_operation", None)

    # Classify arbitrary tool into canonical domain, operation, and category
    classified_domain, classified_op, category = classify_tool_action(
        tool_name=tool,
        description=tool_description,
        schema=tool_schema,
        arguments=tool_arguments,
        context=context,
    )

    domain = classified_domain
    if not operation:
        operation = classified_op

    resource = context.get("resource") or tool_arguments.get("path") or tool_arguments.get("resource") or tool

    # Derive destination and external content signals from arguments
    all_arg_values = " ".join(str(v) for v in tool_arguments.values())
    
    if "destination" not in context:
        if "@" in all_arg_values and "internal.com" not in all_arg_values:
            context["destination"] = "external"
        elif "export" in tool.lower() or "external" in all_arg_values.lower():
            context["destination"] = "external"
        else:
            context["destination"] = "internal"

    if "external_content" not in context:
        # Check for message/body/content/prompt/command arguments
        for field in ["body", "content", "message", "prompt", "command", "text", "query"]:
            if field in tool_arguments and isinstance(tool_arguments[field], str):
                context["external_content"] = tool_arguments[field]
                break

    if "environment" not in context:
        context["environment"] = os.environ.get("AGENTGUARD_ENV", "development")

    # Remote Backend Mode (Phase 11)
    agentguard_url = os.environ.get("AGENTGUARD_URL")
    if agentguard_url:
        try:
            payload = {
                "agent_id": agent_id,
                "user_id": user_id,
                "tool": domain,
                "action": operation,
                "arguments": tool_arguments,
                "context": context,
            }
            with httpx.Client(timeout=10.0) as client:
                resp = client.post(f"{agentguard_url.rstrip('/')}/agent/action", json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    return data.get("decision", data)
                else:
                    logger.error(f"Remote AgentGuard returned error {resp.status_code}: {resp.text}")
                    return _fail_closed_decision(f"Remote AgentGuard error: HTTP {resp.status_code}")
        except Exception as e:
            logger.error(f"Failed to contact remote AgentGuard at {agentguard_url}: {e}")
            return _fail_closed_decision(f"Remote AgentGuard unreachable: {e}")

    # Local in-process evaluation (Phase 5)
    try:
        decision = evaluate_action(
            tool=domain,
            action=operation,
            arguments=tool_arguments,
            context=context,
            agent_id=agent_id,
            user_id=user_id,
            resource=resource,
        )
        return decision
    except Exception as e:
        logger.error(f"Error in evaluate_action: {e}")
        return _fail_closed_decision(f"Security evaluation failed: {e}")


def _fail_closed_decision(reason: str) -> Dict[str, Any]:
    """Phase 9 Fail-Closed decision structure."""
    return {
        "decision": "BLOCK",
        "risk_level": "CRITICAL",
        "risk_score": 100,
        "policy_id": "FAIL_CLOSED_001",
        "reason": f"Fail-closed policy triggered: {reason}",
        "factors": ["System error or unreachable security boundary"],
        "authorization": {"cedar_allowed": False},
        "security": {},
    }


async def handle_mcp_call(
    tool_name: str,
    arguments: Dict[str, Any],
    upstream_manager: Any,
    default_agent_id: str = "research-agent",
    default_user_id: str = "user123",
) -> types.CallToolResult:
    """
    Universal MCP tools/call proxy:
    1. Identify agent & user
    2. Resolve upstream tool & server
    3. Normalize request into AgentGuard action model
    4. Run security evaluation
    5. Handle ALLOW / APPROVE / BLOCK
    6. Record audit event
    7. Forward only ALLOW requests upstream
    8. Return result or fail closed
    """
    args = dict(arguments or {})

    # 1. Identify agent & user
    agent_id = args.pop("_agent_id", None) or args.pop("agent_id", None) or default_agent_id
    user_id = args.pop("_user_id", None) or args.pop("user_id", None) or default_user_id

    # Extract any caller-provided context
    context = args.pop("_context", {})
    if not isinstance(context, dict):
        context = {}

    # 2. Resolve upstream tool & server
    discovered = upstream_manager.resolve_tool(tool_name) if upstream_manager else None
    
    # Even if tool is unknown to upstream, still evaluate safely through AgentGuard (Phase 12, TEST 9)
    tool_desc = discovered.tool.description if discovered else ""
    tool_schema = (
        getattr(discovered.tool, "input_schema", getattr(discovered.tool, "inputSchema", None))
        if discovered
        else None
    )

    # 3 & 4. Security evaluation
    try:
        decision = authorize_mcp_tool_call(
            agent_id=agent_id,
            user_id=user_id,
            tool=tool_name,
            arguments=args,
            context=context,
            tool_description=tool_desc,
            tool_schema=tool_schema,
        )
    except Exception as e:
        decision = _fail_closed_decision(str(e))

    domain, op, _ = classify_tool_action(tool_name, tool_desc, tool_schema, args, context)

    # 10. Record audit event
    try:
        record_event(
            agent_id=agent_id,
            user_id=user_id,
            tool=domain,
            action=op,
            decision=decision["decision"],
            risk_level=decision.get("risk_level", "HIGH"),
            risk_score=decision.get("risk_score", 100),
            policy_id=decision.get("policy_id", "UNKNOWN_POLICY"),
            reason=decision.get("reason", "No reason provided"),
            factors=decision.get("factors", []),
            bedrock=decision.get("bedrock", {}),
        )
    except Exception as e:
        logger.warning(f"Failed to record audit event: {e}")

    # 7. Handle BLOCK
    if decision["decision"] == "BLOCK":
        logger.info(f"[MCP GATEWAY BLOCKED] Tool: {tool_name}, Reason: {decision.get('reason')}")
        return types.CallToolResult(
            content=[
                types.TextContent(
                    type="text",
                    text=(
                        f"AgentGuard BLOCKED this action.\n"
                        f"Reason: {decision.get('reason')}\n"
                        f"Risk: {decision.get('risk_level')} (Score: {decision.get('risk_score')})\n"
                        f"Policy: {decision.get('policy_id')}"
                    ),
                )
            ],
            isError=True,
        )

    # 7. Handle APPROVE
    if decision["decision"] == "APPROVE":
        logger.info(f"[MCP GATEWAY REQUIRES APPROVAL] Tool: {tool_name}")
        approval = create_approval(
            request_data={
                "agent_id": agent_id,
                "user_id": user_id,
                "tool": domain,
                "action": op,
                "original_tool": tool_name,
                "arguments": args,
                "context": context,
                "resource": context.get("resource", tool_name),
            },
            decision=decision,
        )
        return types.CallToolResult(
            content=[
                types.TextContent(
                    type="text",
                    text=(
                        f"AgentGuard REQUIRES APPROVAL for this action.\n"
                        f"Approval ID: {approval['id']}\n"
                        f"Reason: {decision.get('reason')}\n"
                        f"Risk: {decision.get('risk_level')}"
                    ),
                )
            ],
            isError=False,
        )

    # Unknown tool that bypassed decision (Fail-Closed)
    if not discovered:
        return types.CallToolResult(
            content=[
                types.TextContent(
                    type="text",
                    text=f"AgentGuard Error: Upstream tool '{tool_name}' not found on any connected MCP server.",
                )
            ],
            isError=True,
        )

    # 8. Forward only ALLOW requests upstream
    # Clean arguments for upstream: if upstream schema doesn't ask for agent_id/user_id, omit them
    upstream_args = dict(args)
    if tool_schema and "properties" in tool_schema:
        allowed_props = set(tool_schema["properties"].keys())
        upstream_args = {k: v for k, v in upstream_args.items() if k in allowed_props}

    try:
        result = await upstream_manager.call_upstream_tool(
            server_id=discovered.server_id,
            original_tool_name=discovered.original_name,
            arguments=upstream_args,
        )
        return result
    except Exception as e:
        logger.error(f"Error calling upstream server '{discovered.server_id}': {e}")
        return types.CallToolResult(
            content=[
                types.TextContent(
                    type="text",
                    text=f"AgentGuard MCP Gateway: Upstream server error while executing '{tool_name}': {str(e)}",
                )
            ],
            isError=True,
        )