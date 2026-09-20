from fastapi import APIRouter
from app.core.policies import POLICIES

router = APIRouter(prefix="/policies", tags=["Policies"])


@router.get("")
def list_policies():
    result = []
    for action, p in POLICIES.items():
        effect = "PERMIT" if p["decision"] == "ALLOW" else ("DENY" if p["decision"] == "BLOCK" else "APPROVE")
        name = action.replace(".", " ").title() + " Policy"
        result.append({
            "id": p["policy_id"],
            "name": name,
            "action": action,
            "effect": effect,
            "status": "ACTIVE",
            "decision": p["decision"],
            "risk_level": p["risk_level"],
            "risk_score": p["risk_score"],
            "description": p["reason"],
            "type": "AST_HEURISTIC",
        })
    return {"policies": result}
