import hashlib
import json
from datetime import datetime

AUDIT_LOG = []


def create_hash(data: dict):

    serialized = json.dumps(
        data,
        sort_keys=True
    )

    return hashlib.sha256(
        serialized.encode()
    ).hexdigest()


def record_event(
    agent_id: str,
    user_id: str,
    tool: str,
    action: str,
    decision: str,
    risk_level: str,
    risk_score: int,
    policy_id: str,
    reason: str,
    factors: list
):

    previous_hash = (
        AUDIT_LOG[-1]["event_hash"]
        if AUDIT_LOG
        else "GENESIS"
    )

    event = {
        "event_id": len(AUDIT_LOG) + 1,
        "timestamp": datetime.utcnow().isoformat(),
        "agent_id": agent_id,
        "user_id": user_id,
        "tool": tool,
        "action": action,
        "decision": decision,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "policy_id": policy_id,
        "reason": reason,
        "factors": factors,
        "previous_hash": previous_hash
    }

    event["event_hash"] = create_hash(event)

    AUDIT_LOG.append(event)

    return event


def get_audit_logs():
    return AUDIT_LOG


def verify_audit_chain():

    previous_hash = "GENESIS"

    for event in AUDIT_LOG:

        if event["previous_hash"] != previous_hash:
            return False

        stored_hash = event["event_hash"]

        event_copy = {
            key: value
            for key, value in event.items()
            if key != "event_hash"
        }

        calculated_hash = create_hash(
            event_copy
        )

        if calculated_hash != stored_hash:
            return False

        previous_hash = stored_hash

    return True