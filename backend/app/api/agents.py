from fastapi import APIRouter, HTTPException
from app.core.audit import record_event
from app.db.agents import (
    get_agent,
    list_agents as get_registered_agents,
    allow_permission,
    deny_permission,
)

router = APIRouter(
    prefix="/agents",
    tags=["Agents"],
)


@router.get("")
def list_agents():
    return {
        "agents": get_registered_agents()
    }


@router.get("/{agent_id}")
def agent_details(agent_id: str):
    agent = get_agent(agent_id)
    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )
    return agent


@router.get("/{agent_id}/permissions")
def permissions(agent_id: str):
    agent = get_agent(agent_id)
    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )
    return {
        "agent_id": agent_id,
        "allowed_tools": agent["allowed_tools"],
    }


@router.post("/{agent_id}/permissions/allow")
def allow_permission_endpoint(
    agent_id: str,
    action: str,
):
    agent = get_agent(agent_id)
    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )
    
    agent = allow_permission(agent_id, action)

    # Record audit event
    record_event(
        agent_id="admin",
        user_id="system",
        tool="agentguard",
        action="permission.allow",
        decision="ALLOW",
        risk_level="LOW",
        risk_score=0,
        policy_id="PERMISSION_ADMIN",
        reason=f"Permission granted: {action}",
        factors=[
            f"Target agent: {agent_id}",
        ],
    )

    return {
        "agent_id": agent_id,
        "action": action,
        "allowed": True,
        "allowed_tools": agent["allowed_tools"],
    }


@router.post("/{agent_id}/permissions/deny")
def deny_permission_endpoint(
    agent_id: str,
    action: str,
):
    agent = get_agent(agent_id)
    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )
    
    agent = deny_permission(agent_id, action)

    # Record audit event
    record_event(
        agent_id="admin",
        user_id="system",
        tool="agentguard",
        action="permission.deny",
        decision="BLOCK",
        risk_level="LOW",
        risk_score=0,
        policy_id="PERMISSION_ADMIN",
        reason=f"Permission revoked: {action}",
        factors=[
            f"Target agent: {agent_id}",
        ],
    )

    return {
        "agent_id": agent_id,
        "action": action,
        "allowed": False,
        "allowed_tools": agent["allowed_tools"],
    }