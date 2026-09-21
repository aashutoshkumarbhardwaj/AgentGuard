from typing import Optional
import asyncio
import concurrent.futures
from fastapi import APIRouter, HTTPException, Request

from app.core.approvals import (
    get_approvals,
    get_approval,
    update_approval,
)
from app.core.guard import evaluate_action
from app.services.executor import execute_tool
from app.core.audit import record_event

router = APIRouter(prefix="/approvals", tags=["Approvals"])


def _call_async(async_fn, *args, **kwargs):
    """
    Safely executes an async coroutine from sync code in FastAPI AnyIO threadpool
    or fallback thread.
    """
    try:
        import anyio.from_thread
        return anyio.from_thread.run(async_fn, *args, **kwargs)
    except Exception:
        coro = async_fn(*args, **kwargs)
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None
        if loop and loop.is_running():
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                return pool.submit(lambda: asyncio.run(coro)).result()
        else:
            return asyncio.run(coro)


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
def approve_approval(approval_id: str, http_req: Request = None):
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
    ctx = dict(request.get("context") or {})
    if "environment" not in ctx:
        import os
        ctx["environment"] = os.environ.get("AGENTGUARD_ENV", "development")
    if "destination" not in ctx:
        ctx["destination"] = "internal"

    decision = evaluate_action(
        tool=request["tool"],
        action=request["action"],
        arguments=request.get("arguments", {}),
        context=ctx,
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

    # Security can change between approval creation and execution.
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

    server_id = request.get("server_id")
    original_tool = request.get("original_tool")

    mgr = getattr(http_req.app.state, "mcp_upstream", None) if http_req and hasattr(http_req, "app") else None
    if mgr is None:
        try:
            from app.main import _SHARED_MCP_MANAGER
            mgr = _SHARED_MCP_MANAGER
        except ImportError:
            mgr = None

    if mgr and (server_id or original_tool):
        target_server = server_id
        target_tool = original_tool
        if not target_server and original_tool:
            resolved = mgr.resolve_tool(original_tool)
            if resolved:
                target_server = resolved.server_id
                target_tool = resolved.original_name

        if target_server and target_tool and target_server in mgr.sessions:
            try:
                upstream_res = _call_async(
                    mgr.call_upstream_tool,
                    target_server,
                    target_tool,
                    tool_args,
                )
                res_content = []
                for c in getattr(upstream_res, "content", []):
                    if hasattr(c, "text"):
                        res_content.append(c.text)
                    elif isinstance(c, dict) and "text" in c:
                        res_content.append(c["text"])
                    else:
                        res_content.append(str(c))
                res_text = "\n".join(res_content) if res_content else str(upstream_res)
                result_data = {
                    "success": not getattr(upstream_res, "isError", False),
                    "tool": f"{target_server}:{target_tool}",
                    "result": res_text,
                }
            except Exception as exc:
                result_data = {
                    "success": False,
                    "tool": f"{target_server}:{target_tool}",
                    "error": str(exc),
                }
            update_approval(approval_id, "APPROVED")
            return {
                "approval_id": approval_id,
                "status": "APPROVED",
                "executed": True,
                "result": result_data,
                "decision": decision,
            }

    result = execute_tool(
        tool=request["tool"],
        action=request["action"],
        arguments=tool_args,
    )
    update_approval(approval_id, "APPROVED")

    return {
        "approval_id": approval_id,
        "status": "APPROVED",
        "executed": True,
        "result": result,
        "decision": decision,
    }