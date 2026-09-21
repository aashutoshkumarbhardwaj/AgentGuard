import hashlib
import json
from datetime import datetime
from app.db.audit import insert_audit_log, get_all_audit_logs, get_last_audit_log


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
    factors: list,
    bedrock: dict = None,
    decision_engine: dict = None
):
    last_event = get_last_audit_log()
    previous_hash = (
        last_event["event_hash"]
        if last_event
        else "GENESIS"
    )

    event = {
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
    }

    if decision_engine is not None:
        event["decision_engine"] = decision_engine

    if bedrock is not None:
        event["bedrock"] = {
            "available": bool(bedrock.get("available", False)),
            "prompt_attack_detected": bool(bedrock.get("prompt_attack_detected", False)),
            "sensitive_information_detected": bool(bedrock.get("sensitive_information_detected", False))
        }

    event["previous_hash"] = previous_hash
    event["event_hash"] = create_hash(event)

    inserted_event = insert_audit_log(event)

    return inserted_event


def get_audit_logs():
    return get_all_audit_logs()


def verify_audit_chain():
    audit_logs = get_all_audit_logs()
    previous_hash = "GENESIS"

    for event in audit_logs:
        if event["previous_hash"] != previous_hash:
            return False

        stored_hash = event["event_hash"]

        event_copy = {
            key: value
            for key, value in event.items()
            if key not in ("event_hash", "event_id")
        }

        calculated_hash = create_hash(
            event_copy
        )

        if calculated_hash != stored_hash:
            return False

        previous_hash = stored_hash

    return True