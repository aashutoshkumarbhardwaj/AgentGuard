from fastapi import APIRouter, HTTPException

from app.core.approvals import (
    get_approvals,
    get_approval,
    update_approval
)

from app.services.executor import execute_tool


router = APIRouter(
    prefix="/approvals",
    tags=["Approvals"]
)


@router.get("")
def list_approvals():
    return get_approvals()


@router.post("/{approval_id}/reject")
def reject_approval(approval_id: str):

    approval = get_approval(approval_id)

    if not approval:
        raise HTTPException(
            status_code=404,
            detail="Approval not found"
        )

    update_approval(
        approval_id,
        "REJECTED"
    )

    return {
        "status": "REJECTED",
        "approval_id": approval_id
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

    request = approval["request"]

    result = execute_tool(
        tool=request["tool"],
        action=request["action"],
        arguments=request["arguments"]
    )

    update_approval(
        approval_id,
        "APPROVED"
    )

    return {
        "status": "EXECUTED",
        "approval_id": approval_id,
        "execution": result
    }