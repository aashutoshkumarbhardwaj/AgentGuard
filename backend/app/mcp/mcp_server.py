import sys
import json
import logging
import os
import warnings
from typing import Optional
from mcp.server.mcpserver import MCPServer
from mcp.shared.exceptions import MCPError
from mcp.types import ErrorData, INTERNAL_ERROR
import mcp.types as types

os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
os.environ["TRANSFORMERS_VERBOSITY"] = "error"
warnings.filterwarnings("ignore")

# We need to import AgentGuard components
# To run this, it must be run from the backend directory with PYTHONPATH=.
from app.mcp.gateway import authorize_mcp_tool_call
from app.core.audit import record_event
from app.core.approvals import create_approval

logging.basicConfig(level=logging.INFO, stream=sys.stderr)
logging.getLogger("httpx").setLevel(logging.WARNING)
logger = logging.getLogger("mcp-server")

# Create the MCPServer
mcp = MCPServer("AgentGuard MCP Gateway")

def format_decision_result(
    tool_name: str, 
    tool_domain: str, 
    action: str, 
    arguments: dict, 
    context: dict, 
    decision: dict, 
    agent_id: str, 
    user_id: str
):
    """
    Format the output based on AgentGuard's decision.
    """
    # Always log the audit event
    record_event(
        agent_id=agent_id,
        user_id=user_id,
        tool=tool_domain,
        action=action,
        decision=decision["decision"],
        risk_level=decision["risk_level"],
        risk_score=decision["risk_score"],
        policy_id=decision["policy_id"],
        reason=decision["reason"],
        factors=decision.get("factors", [])
    )

    if decision["decision"] == "BLOCK":
        print(f"\n[TOOL NOT EXECUTED] {tool_name}", file=sys.stderr)
        return f"AgentGuard BLOCKED this action.\nReason: {decision['reason']}\nRisk: {decision['risk_level']}"
        
    elif decision["decision"] == "APPROVE":
        print(f"\n[TOOL NOT EXECUTED - PENDING APPROVAL] {tool_name}", file=sys.stderr)
        approval = create_approval(
            request_data={
                "agent_id": agent_id,
                "user_id": user_id,
                "tool": tool_domain,
                "action": action,
                "arguments": arguments,
                "context": context,
                "resource": context.get("resource"),
            },
            decision=decision
        )
        return f"AgentGuard REQUIRES APPROVAL for this action.\nApproval ID: {approval['id']}\nReason: {decision['reason']}"

    return None # Means ALLOW


@mcp.tool()
def calendar_read(agent_id: str, user_id: str) -> str:
    """Read events from the calendar."""
    decision = authorize_mcp_tool_call(
        agent_id=agent_id,
        user_id=user_id,
        tool="calendar",
        arguments={"_operation": "read"},
        context={"source": "user", "resource": "user-calendar"},
    )
    
    error_msg = format_decision_result(
        tool_name="calendar_read", 
        tool_domain="calendar",
        action="read",
        arguments={"_operation": "read"},
        context={"source": "user", "resource": "user-calendar"},
        decision=decision, 
        agent_id=agent_id, 
        user_id=user_id
    )
    if error_msg:
        return error_msg
        
    print(f"\n[TOOL EXECUTED] calendar_read", file=sys.stderr)
    return "Events: 10:00 AM Team Sync, 2:00 PM Project Review"


@mcp.tool()
def email_send(agent_id: str, user_id: str, to: str, body: str) -> str:
    """Send an email to a recipient."""
    
    destination = "external" if "@" in to and "internal.com" not in to else "internal"
    
    decision = authorize_mcp_tool_call(
        agent_id=agent_id,
        user_id=user_id,
        tool="email",
        arguments={"_operation": "send", "to": to, "body": body},
        context={
            "source": "email", 
            "destination": destination,
            "resource": "email-service",
            "external_content": body,
        },
    )
    
    error_msg = format_decision_result(
        tool_name="email_send",
        tool_domain="email",
        action="send",
        arguments={"_operation": "send", "to": to, "body": body},
        context={
            "source": "email", 
            "destination": destination,
            "resource": "email-service",
            "external_content": body,
        },
        decision=decision,
        agent_id=agent_id,
        user_id=user_id
    )
    if error_msg:
        return error_msg
        
    print(f"\n[TOOL EXECUTED] email_send", file=sys.stderr)
    return f"Email sent successfully to {to}"


@mcp.tool()
def file_read(agent_id: str, user_id: str, path: str) -> str:
    """Read a file from the filesystem."""
    decision = authorize_mcp_tool_call(
        agent_id=agent_id,
        user_id=user_id,
        tool="file",
        arguments={"_operation": "read", "path": path},
        context={"source": "user", "resource": path},
    )
    
    error_msg = format_decision_result(
        tool_name="file_read",
        tool_domain="file",
        action="read",
        arguments={"_operation": "read", "path": path},
        context={"source": "user", "resource": path},
        decision=decision,
        agent_id=agent_id,
        user_id=user_id
    )
    if error_msg:
        return error_msg
        
    print(f"\n[TOOL EXECUTED] file_read", file=sys.stderr)
    return f"Content of {path}: Hello world"


@mcp.tool()
def file_modify(agent_id: str, user_id: str, path: str, content: str) -> str:
    """Modify a file on the filesystem."""
    decision = authorize_mcp_tool_call(
        agent_id=agent_id,
        user_id=user_id,
        tool="file",
        arguments={"_operation": "modify", "path": path, "content": content},
        context={"source": "user", "resource": path, "external_content": content},
    )
    
    error_msg = format_decision_result(
        tool_name="file_modify",
        tool_domain="file",
        action="modify",
        arguments={"_operation": "modify", "path": path, "content": content},
        context={"source": "user", "resource": path, "external_content": content},
        decision=decision,
        agent_id=agent_id,
        user_id=user_id
    )
    if error_msg:
        return error_msg
        
    print(f"\n[TOOL EXECUTED] file_modify", file=sys.stderr)
    return f"File {path} modified successfully"


@mcp.tool()
def file_delete(agent_id: str, user_id: str, path: str) -> str:
    """Delete a file from the filesystem."""
    decision = authorize_mcp_tool_call(
        agent_id=agent_id,
        user_id=user_id,
        tool="file",
        arguments={"_operation": "delete", "path": path},
        context={"source": "user", "resource": path},
    )
    
    error_msg = format_decision_result(
        tool_name="file_delete",
        tool_domain="file",
        action="delete",
        arguments={"_operation": "delete", "path": path},
        context={"source": "user", "resource": path},
        decision=decision,
        agent_id=agent_id,
        user_id=user_id
    )
    if error_msg:
        return error_msg
        
    print(f"\n[TOOL EXECUTED] file_delete", file=sys.stderr)
    return f"File {path} deleted successfully"


if __name__ == "__main__":
    mcp.run()
