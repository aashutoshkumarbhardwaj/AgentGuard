from fastapi import APIRouter
from app.models.action import ActionRequest
from app.core.guard import evaluate_action
from app.services.executor import execute_tool
from app.core.approvals import create_approval
from app.core.audit import record_event

router = APIRouter(
    prefix="/agent",
    tags=["Agent"]
)


@router.post("/action")
def agent_action(request: ActionRequest):

    decision = evaluate_action(
        tool=request.tool,
        action=request.action,
        arguments=request.arguments,
        context=request.context
    )
    record_event(
    agent_id=request.agent_id,
    user_id=request.user_id,
    tool=request.tool,
    action=request.action,
    decision=decision["decision"],
    risk_level=decision["risk_level"],
    risk_score=decision["risk_score"],
    policy_id=decision["policy_id"],
    reason=decision["reason"],
    factors=decision.get("factors", [])
)

    # BLOCK → tool never executes
    if decision["decision"] == "BLOCK":
        return {
            "status": "BLOCKED",
            "agent_id": request.agent_id,
            "tool": request.tool,
            "action": request.action,
            **decision
        }

    # APPROVE → do not execute yet
    if decision["decision"] == "APPROVE":
        approval = create_approval(
            request_data=request.model_dump(),
            decision=decision
        )

        return {
            "status": "PENDING_APPROVAL",
            "approval_id": approval["id"],
            "agent_id": request.agent_id,
            "tool": request.tool,
            "action": request.action,
            **decision
        }

    # ALLOW → execute
    result = execute_tool(
        tool=request.tool,
        action=request.action,
        arguments=request.arguments
    )

    return {
        "status": "EXECUTED",
        "agent_id": request.agent_id,
        "tool": request.tool,
        "action": request.action,
        **decision,
        "execution": result
    }