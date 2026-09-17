from fastapi import APIRouter

from app.core.audit import (
    get_audit_logs,
    verify_audit_chain
)

router = APIRouter(
    prefix="/audit",
    tags=["Audit"]
)


@router.get("")
def audit_logs():
    return get_audit_logs()


@router.get("/verify")
def verify_audit():
    valid = verify_audit_chain()

    return {
        "valid": valid,
        "status": (
            "VERIFIED"
            if valid
            else "INTEGRITY_VIOLATION"
        )
    }