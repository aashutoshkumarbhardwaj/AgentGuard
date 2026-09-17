from uuid import uuid4
from datetime import datetime

APPROVALS = {}


def create_approval(request_data, decision):
    approval_id = str(uuid4())

    approval = {
        "id": approval_id,
        "created_at": datetime.utcnow().isoformat(),
        "status": "PENDING",
        "request": request_data,
        "decision": decision
    }

    APPROVALS[approval_id] = approval

    return approval


def get_approvals():
    return list(APPROVALS.values())


def get_approval(approval_id):
    return APPROVALS.get(approval_id)


def update_approval(approval_id, status):
    if approval_id not in APPROVALS:
        return None

    APPROVALS[approval_id]["status"] = status

    return APPROVALS[approval_id]