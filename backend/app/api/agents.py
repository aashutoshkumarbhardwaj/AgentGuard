from fastapi import APIRouter, HTTPException

from app.core.agents import (
    AGENTS,
    get_agent,
    can_use_tool,
    get_registered_agents,
    get_agent_details,
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
    agent = get_agent_details(agent_id)
    if not agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found",
        )
    return agent


@router.get("/{agent_id}/permissions")
def permissions(agent_id: str):
    agent = get_agent_details(agent_id)
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
    
    if action not in agent["allowed_tools"]:
        agent["allowed_tools"].append(action)

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
    
    if action in agent["allowed_tools"]:
        agent["allowed_tools"].remove(action)

    return {
        "agent_id": agent_id,
        "action": action,
        "allowed": False,
        "allowed_tools": agent["allowed_tools"],
    }