from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Any, Dict, Optional

from app.core.guard import evaluate_action
from app.core.audit import record_event


router = APIRouter(
    prefix="/v1",
    tags=["AgentGuard"]
)


class AgentIdentity(BaseModel):
    id: str
    type: str = "autonomous"
    framework: str = "unknown"


class Principal(BaseModel):
    id: str


class Action(BaseModel):
    tool: str
    operation: str
    resource: Optional[str] = None
    arguments: Dict[str, Any] = Field(
        default_factory=dict
    )


class AuthorizationRequest(BaseModel):
    agent: AgentIdentity
    principal: Principal
    action: Action
    context: Dict[str, Any] = Field(
        default_factory=dict
    )


@router.post("/authorize")
def authorize(request: AuthorizationRequest):

    result = evaluate_action(
    tool=request.action.tool,
    action=request.action.operation,
    arguments=request.action.arguments,
    context=request.context,
    agent_id=request.agent.id,
    user_id=request.principal.id,
    resource=request.action.resource,
)

    record_event(
        agent_id=request.agent.id,
        user_id=request.principal.id,
        tool=request.action.tool,
        action=request.action.operation,
        decision=result["decision"],
        risk_level=result["risk_level"],
        risk_score=result["risk_score"],
        policy_id=result["policy_id"],
        reason=result["reason"],
        factors=result.get("factors", []),
        bedrock=result.get("bedrock", {})
    )

    return {
        "allowed": result["decision"] == "ALLOW",
        "requires_approval": result["decision"] == "APPROVE",
        "blocked": result["decision"] == "BLOCK",

        "decision": result["decision"],

        "risk": {
            "level": result["risk_level"],
            "score": result["risk_score"],
            "factors": result.get("factors", [])
        },

        "policy": {
            "id": result["policy_id"]
        },

        "authorization": result.get("authorization", {}),
        "security": result.get("security", {}),
        "bedrock": result.get("bedrock", {}),

        "reason": result["reason"]
    }