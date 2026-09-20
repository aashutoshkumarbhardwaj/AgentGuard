from fastapi import APIRouter, HTTPException

from app.core.approvals import (
    get_approvals,
    get_approval,
    update_approval,
)
from app.core.guard import evaluate_action
from app.services.executor import execute_tool
from app.core.audit import record_event

router = APIRouter(prefix="/approvals", tags=["Approvals"])


@router.get("")
def list_approvals():
    return {
        "approvals": get_approvals()
    }


@router.post("/{approval_id}/reject")
def reject_approval(approval_id: str):
    approval = get_approval(approval_id)

    if not approval:
        raise HTTPException(
            status_code=404,
            detail="Approval not found"
        )

    if approval["status"] != "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Approval is no longer pending"
        )

    update_approval(approval_id, "REJECTED")

    return {
        "approval_id": approval_id,
        "status": "REJECTED",
        "executed": False,
    }


@router.post("/{approval_id}/approve")
def approve_approval(approval_id: str):
    approval = get_approval(approval_id)

    if not approval:
        raise HTTPException(
            status_code=404,
            detail="Approval not found"
        )

    if approval["status"] != "PENDING":
        raise HTTPException(
            status_code=400,
            detail="Approval is no longer pending"
        )

    # Check expiration (24 hours)
    from datetime import datetime, timedelta
    created_at = datetime.fromisoformat(approval["created_at"])
    if datetime.utcnow() - created_at > timedelta(hours=24):
        update_approval(approval_id, "EXPIRED")
        raise HTTPException(
            status_code=400,
            detail="Approval has expired"
        )

    request = approval["request"]

    # Re-authorize immediately before execution.
    decision = evaluate_action(
        tool=request["tool"],
        action=request["action"],
        arguments=request.get("arguments", {}),
        context=request.get("context", {}),
        agent_id=request["agent_id"],
        user_id=request["user_id"],
        resource=request.get("resource"),
    )

    record_event(
        agent_id=request["agent_id"],
        user_id=request["user_id"],
        tool=request["tool"],
        action=request["action"],
        decision=decision["decision"],
        risk_level=decision["risk_level"],
        risk_score=decision["risk_score"],
        policy_id=decision["policy_id"],
        reason=decision["reason"],
        factors=decision.get("factors", []),
        bedrock=decision.get("bedrock", {})
    )

    # Security can change between approval creation
    # and execution.
    if decision["decision"] == "BLOCK":
        update_approval(approval_id, "REJECTED")

        return {
            "approval_id": approval_id,
            "status": "BLOCKED",
            "executed": False,
            "reason": "Security re-check blocked the action.",
            "decision": decision,
        }

    # Only now execute the tool.
    tool_args = request.get("arguments", {}).copy()
    tool_args.pop("_operation", None)
    
    result = execute_tool(
        tool=request["tool"],
        action=request["action"],
        arguments=tool_args,
    )

    update_approval(approval_id, "APPROVED")

    return {
        "approval_id": approval_id,
        "status": "EXECUTED",
        "executed": True,
        "result": result,
        "decision": decision,
    }